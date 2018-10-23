/**
 * Created by guominglong on 2018/10/1.
 */
class AgoraMediaProxy{
    /**
     * 单例
     * */
    static get instance(){
        if(!window.agoraMediaHandler)
            window.agoraMediaHandler = new AgoraMediaProxy();
        return window.agoraMediaHandler;
    }

    static get mediaAppId(){
        return "220af8ce9af94710bc0302bfc373f9cb";
    }

    constructor(){
        this.started = false;
        this.client = null;//媒体引擎客户端引用
        this.localStream = null;//本地的音视频流
        this.camera = 0;//当前正在使用的摄像头ID
        this.microphone = 0;//当前正在使用的麦克风ID

        this.cameraArr = [];//可选 摄像头数组
        this.microphoneArr = [];//可选麦克风数组

        //客户端逻辑所使用的uint32 uid
        this.clientUID = 0;
        //媒体频道名称
        this.channelName = "";
        //媒体引擎返回的针对channelName 映射而成的 媒体逻辑需要用的channelID
        this.mediaChannelID = "";
        //媒体引擎返回的针对clientUID 映射而成的 媒体逻辑需要用的mediaUID
        this.mediaUID = 0;
        //media模式
        this.mediaType = "video";//默认为音视频模式video,  也可以为audio纯音频模式
    }


    /**
     * 检查浏览器是否支持WEBRTC
     * */
    checkWebRTCSuport(){
        if(!AgoraRTC.checkSystemRequirements()) {
            return false;
        }
        return true
    }

    /**
     * 开始sdk
     * */
    start(_clientUID,_channelName){
        this.clientUID = _clientUID;//用户客户端uid
        this.channelName = _channelName;//频道名称
        if(this.checkWebRTCSuport()){
            //获取硬件列表
            this.getDevices();
            this.started = true;
        }else{
            alert("Your browser does not support WebRTC!");
        }
    }

    /**
     * 停止sdk
     * */
    stop(){
        this.started = false;
        this.leaveChanel();
    }

    /**
     * 获取硬件列表
     * */
    getDevices() {
        AgoraRTC.getDevices(function (devices) {
            //清空原有列表
            AgoraMediaProxy.instance.microphoneArr = [];
            AgoraMediaProxy.instance.cameraArr = [];
            //重新填充列表
            for (var i = 0; i !== devices.length; ++i) {
                var device = devices[i];
                if (device.kind === 'audioinput') {
                    AgoraMediaProxy.instance.microphoneArr.push(device.deviceId);
                } else if (device.kind === 'videoinput') {
                    AgoraMediaProxy.instance.cameraArr.push(device.deviceId);
                } else {
                    console.log('Some other kind of source/device: ', device);
                }
            }
            if(AgoraMediaProxy.instance.cameraArr.length > 0 && AgoraMediaProxy.instance.microphoneArr.length > 0){
                //硬件列表获取成功后,调用进入教室
                AgoraMediaProxy.instance.joinChanel();
            }
        });
    }

    /**
     * 进入频道
     * */
    joinChanel(){
        let selfInstance = AgoraMediaProxy.instance;
        let appId = AgoraMediaProxy.mediaAppId;
        console.log("Init AgoraRTC client with App ID: " + appId);
        this.client = AgoraRTC.createClient({mode: 'h264_interop'});//如果和移动端通信则所有端都必须设置为'h264_interop'编码// OSManager.OS == "IOS" ?AgoraRTC.createClient({mode: 'h264_interop'}) : AgoraRTC.createClient({mode: 'interop'});//创建互动音视频教室interop,ios需要特殊处理否则publish失败
        this.client.init(appId, function () {
            console.log("AgoraRTC client initialized");
            selfInstance.client.join(selfInstance.mediaChannelID, selfInstance.channelName, null, function(uid) {
                selfInstance.mediaUID = uid;
                AppDelegate.app.upLoadMediaUserChange(selfInstance.clientUID,selfInstance.mediaUID);//上报给服务器,让其他人知道我的媒体ID
                console.log("User " + uid + " join channel successfully");
                let needVideoMode = selfInstance.mediaType === "video";
                if (needVideoMode) {
                    //使用默认设备selfInstance.camera和selfInstance.microPhone 生成音视频流
                    selfInstance.localStream = AgoraRTC.createStream({streamID: uid, audio: true, cameraId: selfInstance.camera, microphoneId: selfInstance.microphone, video: needVideoMode, screen: false});
                    //selfInstance.localStream = AgoraRTC.createStream({streamID: uid, audio: false, cameraId: camera, microphoneId: microphone, video: false, screen: true, extensionId: 'minllpmhdgpndnkomcoccfekfegnlikg'});
                    if (needVideoMode) {
                        //selfInstance.localStream.setVideoProfile('720p_3');
                        if(OSManager.OS == "IOS"){
                            //IOS的清晰度,需要特殊处理,否则video publish 失败
                            selfInstance.localStream.setVideoProfile('480p_4');//降低清晰度,减少带宽占用
                        }else{
                            //PC 和android的清晰度设置
                            selfInstance.localStream.setVideoProfile('480p_4');//降低清晰度,减少带宽占用
                        }
                    }

                    // The user has granted access to the camera and mic.
                    selfInstance.localStream.on("accessAllowed", function() {
                        console.log("accessAllowed");
                    });

                    // The user has denied access to the camera and mic.
                    selfInstance.localStream.on("accessDenied", function() {
                        console.log("accessDenied");
                    });

                    selfInstance.localStream.init(function() {
                        console.log("getUserMedia successfully");
                        AppDelegate.app.addStream(selfInstance.localStream);//在属于自己的视频窗口上,渲染视频
                        selfInstance.client.publish(selfInstance.localStream, function (err) {
                            console.log("Publish local stream error: " + err);
                        });

                        selfInstance.client.on('stream-published', function (evt) {
                            console.log("Publish local stream successfully");
                        });
                    }, function (err) {
                        console.log("getUserMedia failed", err);
                    });
                }
            }, function(err) {
                console.log("Join channel failed", err);
            });
        }, function (err) {
            console.log("AgoraRTC client init failed", err);
        });


        this.client.on('error', function(err) {
            console.log("Got error msg:", err.reason);
            if (err.reason === 'DYNAMIC_KEY_TIMEOUT') {
                client.renewChannelKey(selfInstance.mediaChannelID, function(){
                    console.log("Renew channel key successfully");
                }, function(err){
                    console.log("Renew channel key failed: ", err);
                });
            }
        });

        //当有新的视频流进来
        this.client.on('stream-added', function (evt) {
            var stream = evt.stream;
            console.log("New stream added: " + stream.getId());
            console.log("Subscribe ", stream);
            selfInstance.client.subscribe(stream, function (err) {
                console.log("Subscribe stream failed", err);
            });
        });

        //当新的视频流订阅成功
        this.client.on('stream-subscribed', function (evt) {
            var stream = evt.stream;
            console.log("Subscribe remote stream successfully: " + stream.getId());
            AppDelegate.app.addStream(stream)
        });


        //当视频流被服务器断开
        this.client.on('stream-removed', function (evt) {
            var stream = evt.stream;
            AppDelegate.app.removeStream(stream)
            console.log("Remote stream is removed " + stream.getId());
        });

        //当视频流主动离开了频道
        this.client.on('peer-leave', function (evt) {
            var stream = evt.stream;
            if (stream) {
                AppDelegate.app.removeStream(stream)
                console.log(evt.uid + " leaved from this channel");
            }
        });
    }

    /**
     * 离开频道
     * */
    leaveChanel() {
        if(!this.client)
            return;
        this.client.leave(function () {
            console.log("Leavel channel successfully");
        }, function (err) {
            console.log("Leave channel failed");
        });
    }

    /**
     * 发布音视频
     * */
    publish() {
        if(!this.client)
            return;
        this.client.publish(this.localStream, function (err) {
            console.log("Publish local stream error: " + err);
        });
    }

    /**
     * 关闭音视频发布
     * */
    unpublish() {
        if(!this.client)
            return;
        this.client.unpublish(this.localStream, function (err) {
            console.log("Unpublish local stream failed" + err);
        });
    }
}