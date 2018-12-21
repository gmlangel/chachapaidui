/**
 * app主入口
 * Created by guominglong on 2017/12/13.
 */
class AppDelegate{
    static get app(){
        if(!window.app)
            window.app = new AppDelegate();
        return window.app;
    }

    constructor(){
        this.dataBuffer = "";
        this.packageSize = 500;//数据包的最大长度
        this.minWidth = 1000;//界面最小宽度
        this.welcomePanel = document.getElementById("welcome");
        //测试用
        this.selfVideoDivID = "";
        this.roomCode = "";//教室邀请码
        this.roomInfo = null;//教室信息
        this.videoStreamPoolArr = [];//视频流集合
        this.gmlhost = "http://localhost:39855/";
    }

    /**
     * 根据用户ID 获取用户信息
     * */
    getUserInfoByUID(getUserUid){

        this.reqServer(this.gmlhost + "getUserInfoByUID",{
            "uid":getUserUid,
        },"post",function(data){
            if(data.Code == "1"){
                AppDelegate.app.httpUserinfo = {
                    "nickName":data.NickName,
                    "headerImage":data.HeaderImg,
                    "sex":parseInt(data.Sex),
                    "uid":parseInt(data.Uid),
                    "loginName":getUserUid.toString(10),
                    "resourcePath":""
                };
                AppDelegate.app.linkServer();//链接socket
            }

        });
    }

    /**
     * 请求服务器
     * */
    reqServer(url,argobj,method,callback){
        //登录
        $.ajax({
            type:method,
            url:url,
            timeout:30000,
            data:argobj,
            success:function(data,b){
                if(callback){
                    callback.call(AppDelegate.app,data);
                }
            },
            error:function(err){
                console.log("请求发生错误",err);
            }
        })
    }

    /**
     * 启动
     * */
    init(){
        //设置清晰度为1倍屏,不要设置2倍白板会有问题
        ScreenManager.main.quilaty = 1;
        //初始化音频播放器
        this.bgAudio = new GMLAudio();
        this.bgAudio.preload = true;
        //this.bgAudio.src = "./gameResource/bg.mp3"

        //初始化视频播放器
        this.bgVideo = new GMLVideo();
        this.bgVideo.preload = true;
        //this.bgAudio.src = "./gameResource/bg.mp4"

        //初始化白板区域
        this.whiteBoard = document.getElementById("whiteBoard");
        this.whiteBoard.style.display = "none";
        this.whiteBoardPro = new WhiteBoardProxy();
        //初始化右侧面板
        this.rightPanel = document.getElementById("rightPanel");
        this.rightPanel.style.display = "none";
        this.masterVideo = document.getElementsByClassName("masterVideo")[0];
        this.subVideoContainer = document.getElementById("subVideoContainer")

        //初始化聊天面板
        this.chatPro = new ChatProxy("chatContainer");

    }

    /**
     * 开始游戏
     * */
    startClass(_loginName,_roomCode = "testchanel_1"){
        if(OSManager.OS == "IOS" || OSManager.OS == "Android")
        {
            window.addEventListener("touchstart",function(evt){
                if(evt.targetTouches.length >0){
                    //点击位移方式
                    let t = evt.targetTouches[0];
                    let me = new GMLMouseEvent()
                    me.data = {"target":evt.target,"globelX":t.pageX,"globelY": t.pageY}
                    AppDelegate.app.ongMouseDown(me)
                }
            })
            window.addEventListener("touchend",function(evt){
                if(evt.targetTouches.length >0){
                    //点击位移方式
                    let t = evt.targetTouches[0];
                    let me = new GMLMouseEvent()
                    me.data = {"target":evt.target,"globelX":t.pageX,"globelY": t.pageY}
                    AppDelegate.app.ongMouseUp(me)
                }
            })
            window.addEventListener("touchmove",function(evt){
                if(evt.targetTouches.length >0){
                    //点击位移方式
                    let t = evt.targetTouches[0];
                    let me = new GMLMouseEvent()
                    me.data = {"target":evt.target,"globelX":t.pageX,"globelY": t.pageY}
                    AppDelegate.app.ongMouseMove(me)
                }
            })
        }else{

            window.addEventListener("mousedown",function(evt){
                let me = new GMLMouseEvent()
                me.data = {"target":evt.target,"globelX": evt.x,"globelY": evt.y};
                AppDelegate.app.ongMouseDown(me)
            })
            window.addEventListener("mousemove",function(evt){
                let me = new GMLMouseEvent()
                me.data = {"target":evt.target,"globelX": evt.x,"globelY": evt.y};
                AppDelegate.app.ongMouseMove(me)
            })
            window.addEventListener("mouseout",function(evt){
                let me = new GMLMouseEvent()
                me.data = {"target":evt.target,"globelX": evt.x,"globelY": evt.y};
                AppDelegate.app.ongMouseOut(me)
            })
            window.addEventListener("mouseup",function(evt){
                let me = new GMLMouseEvent()
                me.data = {"target":evt.target,"globelX": evt.x,"globelY": evt.y};
                AppDelegate.app.ongMouseUp(me)
            })
        }

        this.loginName = _loginName;
        this.roomCode = _roomCode;
        this.bgAudio.play();
        this.bgAudio.loop = true;
        this.bgVideo.play();
        this.bgVideo.loop = true;
        //this.fullScreen();//默认全屏

        this.linkServerTimerId = -1;
        this.getUserInfoByUID(this.loginName)
    }

    /**
     * 链接服务器
     * */
    linkServer(){
        clearTimeout(this.linkServerTimerId);//清除上一次的倒计时重连
        //链接socket
        this.remoteStopWS = false;
        //this.ws = new WebSocketHandler("wss://www.juliaol.cn/gmlws",[]);//https的请求格式
        this.ws = new WebSocketHandler("ws://localhost:31111",[]);//本地http服务的请求格式
        this.ws.addEventListener(WebSocketEvent.SOCKET_CLOSE,this.onSocketClose,this)
        this.ws.addEventListener(WebSocketEvent.SOCKET_DATA,this.onSocketData,this);
        this.ws.addEventListener(WebSocketEvent.SOCKET_ERROR,this.onSocketError,this)
        this.ws.addEventListener(WebSocketEvent.SOCKET_CONNECTED,this.onSocketConnected,this)

        //长连接心跳 30秒发一次
        this.xintiaoTimerID = setInterval(function(){
            if(AppDelegate.app.ws.isOpen){
                let req = {"cmd":0x00FF0001,"seq":0,"lt":0};
                AppDelegate.app.sendDataToServer(JSON.stringify(req))
            }
        },30000)
    }

    /**
     * 拆包发送,保证每个包都能正常送达到服务器
     * */
    sendDataToServer(jsonStr){
        var waitSendStr = "<gmlb>" + jsonStr + "<gmle>";
        var result = "";
        //拆包发送，  如果要发送的内容长度大于500 则拆成N个包，发送
        while(waitSendStr.length > this.packageSize){
            result = waitSendStr.substring(0,this.packageSize);
            this.ws.sendData(result);
            waitSendStr = waitSendStr.substring(this.packageSize,waitSendStr.length);
        }
        this.ws.sendData(waitSendStr);
    }

    ongMouseDown(evt){
        let wX = evt.data.globelX;//全局坐标
        let wY = evt.data.globelY;
        //console.log("mouseDown,wX="+wX + ",wY=" + wY);
        if(evt.data.target == this.chatPro.chatPanel){
            //开始文本框拖拽
            this.dropObj = this.chatPro.chatPanel;//设置拖拽对象
            this.beginRect = {"x":wX,"y":wY,"w":parseInt(this.dropObj.clientWidth || 0),"h":parseInt(this.dropObj.clientHeight || 0)};
        }
    }

    ongMouseUp(evt){
        this.dropObj = null;//清除拖拽对象
        this.beginRect = null;
        let wX = evt.data.globelX;//全局坐标
        let wY = evt.data.globelY;
        //console.log("mouseUp,wX="+wX + ",wY=" + wY);
    }
    ongMouseOut(evt){
        this.dropObj = null;//清除拖拽对象
        this.beginRect = null;
        let wX = evt.data.globelX;//全局坐标
        let wY = evt.data.globelY;
        if(wX >= 0 && wX <= document.body.clientWidth && wY >= 0 && wY <= document.body.clientWidth){

        }else{
            this.dropObj = null;//清除拖拽对象
        }
        //console.log("mouseOut,wX="+wX + ",wY=" + wY);
    }

    ongMouseMove(evt){
        let wX = evt.data.globelX;//全局坐标
        let wY = evt.data.globelY;
        //console.log("mouseMove,wX="+wX + ",wY=" + wY);
        if(this.dropObj){
            this.dropObj.style.top = (parseInt(this.dropObj.style.top || 0) + (wY - this.beginRect.y)) + "px"
            this.dropObj.style.left = (parseInt(this.dropObj.style.left || 0) + (wX - this.beginRect.x)) + "px"
            this.beginRect.y = wY;
            this.beginRect.x = wX;
        }
    }

    onSocketClose(e){
        console.log("socket断开")
        if(this.remoteStopWS == false){
            clearTimeout(this.linkServerTimerId);
            //非服务器强制断开连接,则重连
            this.linkServerTimerId = setTimeout(function(){
                //10秒重连
                AppDelegate.app.linkServer();
            },10000);
        }
    }
    onSocketData(e){
        this.dataBuffer = this.dataBuffer + e.data;
        var tempStr = this.dataBuffer;
        var pkgHeadIdx = tempStr.indexOf("<gmlb>");//取包头
        var pkgEndIdx = tempStr.indexOf("<gmle>");//取包尾
        var waitJSONStr = "";
        while(pkgHeadIdx >= 0 && pkgEndIdx > 0){
            if(pkgEndIdx > pkgHeadIdx){
                //可以读出一个数据包
                waitJSONStr = tempStr.substring(pkgHeadIdx + 6,pkgEndIdx);
                //清空pkgEndIdx以前的所有数据
                tempStr = tempStr.substring(pkgEndIdx+6,tempStr.length);
                this.jiexiData(waitJSONStr);
            }else{
                //清空pkgHeadIdx以前的所有数据
                tempStr = tempStr.substring(pkgHeadIdx,tempStr.length);
            }
            this.dataBuffer = tempStr;
            pkgHeadIdx = tempStr.indexOf("<gmlb>");//重新取包头
            pkgEndIdx = tempStr.indexOf("<gmle>");//重新取包尾
        }
    }

    onSocketError(e){
        console.log("socket发生错误");
        if(this.remoteStopWS == false){
            clearTimeout(this.linkServerTimerId);
            //非服务器强制断开连接,则重连
            this.linkServerTimerId = setTimeout(function(){
                //10秒重连
                AppDelegate.app.linkServer();
            },10000);
        }
    }

    onSocketConnected(e){
        //开始登陆
        let req = {"cmd":0x00FF0003,"seq":0,"ln":this.httpUserinfo.loginName,"userInfo":this.httpUserinfo};
        this.sendDataToServer(JSON.stringify(req));
    }

    /**
     *
     * 正式开始*/
    _trueBegin(){
        AppDelegate.app.whiteBoard.style.display = "block";
        AppDelegate.app.rightPanel.style.display = "block";
        AppDelegate.app.welcomePanel.style.display = "none";

        //初始化白板数据
        AppDelegate.app.h5Init();

        //初始化聊天框
        AppDelegate.app.chatPro.initial();

        //根据用户列表创建 视频容器
        let userArr = this.roomInfo.ua;
        let ownnerUID = this.roomInfo.ownnerUID
        $('div#video').empty();//移除所有子元素
        userArr.forEach(function(item){
            //如果Item不是主讲,则创建新的学生视频窗口
            if(ownnerUID != item.uid)
                $('div#subVideoContainer').append('<div id="stu_'+item.uid+'" style="float:left; width:160px;height:120px;display:inline-block;"></div>');
        });
        //启动媒体引擎
        AgoraMediaProxy.instance.start(this.userinfo.uid,this.roomInfo.rn);
    }

    /**
     * 向服务器发送文本消息
     * */
    sendChatMSG(msgObj){
        let uid = this.userinfo.uid || -1;
        let rid = this.roomInfo.rid || -1;
        if(uid > -1 && rid > -1){
            let nickName = this.userinfo.nn
            //封装发送数据结构
            let msgReq = {
                "cmd":0x00FF0018,
                "seq":0,
                "lt":parseInt(new Date().valueOf() / 1000),
                "uid":uid,
                "rid":rid,
                "nn":nickName,
                "msg":msgObj
            }
            this.sendDataToServer(JSON.stringify(msgReq))
        }
    }

    //上报给服务器,让其他人知道我的媒体ID
    upLoadMediaUserChange(clientUID,mediaId){
        this.roomInfo.mediaMap[clientUID] = mediaId;
        let req = {
            "cmd":0x00FF0020,
            "uid":clientUID,
            "rid":this.roomInfo.rid,
            "mid":mediaId
        };
        this.sendDataToServer(JSON.stringify(req))
    }

    getUIDbyMediaId(mediaId){
        let tempmap = this.roomInfo.mediaMap;
        let resultUid = -1;
        for(var key in tempmap){
            if(tempmap[key] == mediaId)
            {
                resultUid = key;
                break;
            }
        }
        return resultUid;
    }

    //添加视频流
    addStream(stream){
        let streamID = stream.getId();
        let clientUID = this.getUIDbyMediaId(streamID);
        if(clientUID == -1)
            return;//如果为寻找到对应的uid,则return
        let arr = this.videoStreamPoolArr;
        let j = arr.length;
        //遍历视频流集合,去重
        for(var i=0;i<j;i++){
            if(arr[i].getId() == streamID){
                //移除相同mediaID的stream
                this.videoStreamPoolArr.splice(i,1);
                break;
            }
        }

        //添加
        this.videoStreamPoolArr.push(stream);

        //刷新视频
        this.refreshVideo(clientUID,streamID);
    }

    //移除视频流
    removeStream(stream){
        let streamID = stream.getId();
        let clientUID = this.getUIDbyMediaId(streamID);
        if(clientUID == -1)
            return;//如果为寻找到对应的uid,则return
        let arr = this.videoStreamPoolArr;
        let j = arr.length;
        //遍历视频流集合,删除视频流
        for(var i=0;i<j;i++){
            if(arr[i].getId() == streamID){
                //移除相同mediaID的stream
                this.videoStreamPoolArr.splice(i,1);
                break;
            }
        }
    }

    //刷新视频
    refreshVideo(clientUID,mediaId){
        let divId = this.makeVideoDivId(clientUID);
        let arr = this.videoStreamPoolArr;
        let j = arr.length;
        //遍历视频流集合
        for(var i=0;i<j;i++){
            if(arr[i].getId() == mediaId){
                //由于agora每次都会在div容器中创建新的div,所以要先移除div中原有的子视图,再重新刷新,防止agora影响HTML样式
                $('#' + divId).empty();
                //开始渲染
                arr[i].play(divId);
                break;
            }
        }
    }

    //根据uid生成对应的渲染视频用的div的ID
    makeVideoDivId(clientUID){
        if(this.roomInfo.ownnerUID == clientUID)
            return "mainVideo";
        else
            return "stu_" + clientUID;
    }

    h5Init(){
        let isTeacher = this.roomInfo.ownnerUID == this.userinfo.uid;
        //测试代码
        let course_H5Entity = new H5Entity_course_simple();
        course_H5Entity.data["courserole"] = isTeacher ? 1 : 0;
        course_H5Entity.data["coursestyle"] = 0;
        course_H5Entity.data["metrialtype"] = 0;//1比1的教材比例
        course_H5Entity.data["startedTime"] = parseInt(new Date().valueOf() / 1000);
        course_H5Entity.data["CanTurnPage"] = 1;//可以翻页

        let user_H5Entity = new H5Entity_user_simple();
        user_H5Entity.data["usergroup"] = 1;
        user_H5Entity.data["userid"] = this.userinfo.uid;
        user_H5Entity.data["userrole"] = isTeacher ? 1 : 0;
        user_H5Entity.data["usertype"] = isTeacher ? 1 : 2;//self.teacherRole() ? 1 : 2;//gmlok

        //构建pdf下载地址
        let urlInfo = new H5Entity_url_simple();
        //加载网络pdf资源
        let headUrlBeforeBase64 = this.roomInfo.teachingMaterialPath;//"../../4b7598199953ffe850ed9d672991ccc6.pdf";//
        var headUrl = window.MyBase64.encode(headUrlBeforeBase64);
        headUrl = headUrl || "";
        urlInfo.data["pdf"] = headUrl;

        let hostInfo = new H5Entity_host_simple();
        hostInfo.data["language"] = "cn";
        hostInfo.data["showtype"] = "normal"//成人还是青少
        let whiteConfigDic = this.createWhiteConfigDic(isTeacher);
        hostInfo.data["toolsconf"] = whiteConfigDic;

        let courseAll = new H5Entity_courseAll();
        courseAll.data["courseTypeEx"] = 0;

        //开始初始化H5PdfLoader
        this.callH5(courseAll.key,courseAll.toJSStr());
        this.callH5(course_H5Entity.key,course_H5Entity.toJSStr());
        this.callH5(user_H5Entity.key,user_H5Entity.toJSStr());
        this.callH5(urlInfo.key,urlInfo.toJSStr());
        this.callH5(hostInfo.key,hostInfo.toJSStr());

    }

    /**
     * 调用 白板的各种协议接口
     * */
    callH5(type,JSONStrValue){
        this.whiteBoardPro.callH5(type,JSONStrValue)
    }

    createWhiteConfigDic(_isTeacher){
        if(_isTeacher){
            return {
                "back":true,/*回退*/
                "clear":true,/*清空*/
                "draft":false,/*拖拽*/
                "newrub":false,/*新橡皮擦*/
                "pen":true,/*画笔*/
                "rec":true,/*矩形*/
                "rub":true,/*旧版橡皮擦*/
                "signpen":true,/*荧光笔*/
                "text":true/*文本*/
            }
        }else{
            return {
                "back":false,/*回退*/
                "clear":false,/*清空*/
                "draft":false,/*拖拽*/
                "newrub":false,/*新橡皮擦*/
                "pen":false,/*画笔*/
                "rec":false,/*矩形*/
                "rub":false,/*旧版橡皮擦*/
                "signpen":false,/*荧光笔*/
                "text":false/*文本*/
            }
        }

    }

    /**
     * 解析服务器返回的数据
     * */
    jiexiData(data){
        try{
            let jsonObj = JSON.parse(data);
            switch(jsonObj.cmd){
                case 0x00FF0004:
                    //登陆信息回调
                    if(jsonObj.code == 0){
                        需要先通过CID 获取课程信息,然后改写AppDelegate_TestGame2.js 的roomMap 以及进入教室逻辑,做到roomMap的自动创建,而不是预留
                        //this.userinfo = jsonObj;//设置全局用户信息
                        ////进入教室
                        //let req = {
                        //    "cmd":0x00FF0014,
                        //    "seq":0,
                        //    "rc":this.roomCode,
                        //    "uid":this.httpUserinfo.uid,
                        //    "nn":this.httpUserinfo.nn,
                        //    "hi":this.httpUserinfo.hi,
                        //    "sex":this.httpUserinfo.sex,
                        //    "ca":{x:34,y:387},//{x:parseInt(this.scene.width/2+Math.random()*100),y:parseInt(this.scene.height/2+Math.random()*100)},
                        //    "rp":""
                        //};
                        //this.sendDataToServer(JSON.stringify(req));
                    }else{
                        console.log("登录失败")
                    }

                    break;
                case 0x00FF0007:
                    //掉线通知
                    this.remoteStopWS = true;
                    clearInterval(this.xintiaoTimerID);//释放心跳
                    //停止媒体引擎
                    AgoraMediaProxy.instance.stop();
                    alert("您已经被强制下线");
                    break;
                case 0x00FF0015:
                    //进入教室回调
                    if(jsonObj.code == 0){
                        this.roomInfo = jsonObj;
                        console.log("进入教室成功");
                        this._trueBegin();
                    }else{
                        console.log("进入教室失败");
                    }
                    break;
                case 0x00FF0017:
                    //其它用户数据变更
                    let arr = jsonObj.ua;
                    arr.forEach(function(obj,idx){
                        if(obj.type == 1){
                            //新用户进入
                            AppDelegate.app.userIn(obj)
                        }else{
                            //老用户退出
                            AppDelegate.app.userOut(obj)
                        }
                    })
                    break;
                case 0x00FF0019:
                    //收到文本消息
                    let arr2 = jsonObj.msga;
                    arr2.forEach(function(obj,idx){
                        let senderUID = obj.suid;
                        let senderNickName = obj.snn;
                        let msgObj = obj.msg;
                        AppDelegate.app.chatPro.showMsg(senderUID,senderNickName,msgObj.msgType,msgObj.msg,senderUID == AppDelegate.app.userinfo.uid ? 2 : 1)
                    })
                    let msgIcon = document.getElementById("btn_chat");
                    if(AppDelegate.app.chatPro.isShow == false && msgIcon){
                        msgIcon.className = "btn_chatClassMSG";//更改icon为有信息状态
                    }
                    break;
                case 0x00FF0021:
                    //其它用户的mediaId变更
                    let trueData = jsonObj.data
                    let tempUid = trueData.suid;
                    let tempMediaId = trueData.mediaId;
                    this.roomInfo.mediaMap[tempUid] = tempMediaId;
                    this.refreshVideo(tempUid,tempMediaId);//刷新视频
                    break;
                case 0x00FF001D:
                    //收到通用教学命令
                    let tongyongarr = jsonObj.datas;
                    tongyongarr.forEach(function(obj,idx){
                        AppDelegate.app.whiteBoardPro.reciveServerData(obj.data);
                    })
                    break;
            }
        }catch(err){
            console.log("数据不是json",data)
        }
    }

    jsWhiteBoardDatatoMain(_dataObj){
        //白板派发到主程序中的相关协议数据
        this.whiteBoardPro.jsWhiteBoardDatatoMain(_dataObj);
    }

    //其它用户进入
    userIn(item){
        console.log("其他人进入教室:"+item)
        let tempJson = {"list":[{"enter":item.nn + "进入教室"}]};
        this.chatPro.showMsg(item.uid,item.nn,"text",JSON.stringify(tempJson),5);
        let divID = this.makeVideoDivId(item.uid);
        let tempDiv = document.getElementById(divID)
        //如果视频DIV不存在,则创建视频div
        if(!tempDiv)
            $('div#subVideoContainer').append('<div id=' + divID + ' style="float:left; width:160px;height:120px;display:inline-block;"></div>');
    }

    //其它用户退出
    userOut(item){
        console.log("其他人离开教室:"+item)
        let tempJson = {"list":[{"leave":item.nn + "离开教室"}]};
        this.chatPro.showMsg(item.uid,item.nn,"text",JSON.stringify(tempJson),5);
        //停止视频渲染
        let divID = this.makeVideoDivId(item.uid);
        let mediaId = this.roomInfo.mediaMap[item.uid] || -1;
        if(mediaId == -1){
            return;
        }
        let arr = this.videoStreamPoolArr;
        let j = arr.length;
        for(var i=0;i<j;i++){
            if(arr[i].getId() == mediaId){
                arr[i].stop();
                this.videoStreamPoolArr.splice(i,1);
                break;
            }
        }
    }


    /**
     * 尺寸变更
     * */
    resize(w,h){
        w = w < AppDelegate.app.minWidth ? AppDelegate.app.minWidth : w;
        //BaseScene.main.resize(w,h)
        if(AppDelegate.app.whiteBoard)
        {
            AppDelegate.app.whiteBoard.style.width = (w - 320) + "px";
            AppDelegate.app.subVideoContainer.style.height = (h - 240) + "px";
            AppDelegate.app.chatPro.chatPanel.style.top = ((h - 500) / 2) + "px";
            AppDelegate.app.chatPro.chatPanel.style.left = ((w - 500) / 2) + "px";
        }
    }

    /**
     * 停止
     * */
    stop(){
       // BaseScene.main.stop();
    }

    /**
     * 进入全屏
     * */
    fullScreen(){
        let el = document.documentElement;
        let rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullscreen;
        if(typeof rfs != "undefined" && rfs) {
            rfs.call(el);
        };
    }

    /**
     * 退出全屏
     * */
    exitScreen(){
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
        else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        }
        else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        }
        else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }
}
