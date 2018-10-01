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
        this.minWidth = 1000;//界面最小宽度
        this.welcomePanel = document.getElementById("welcome");
        //测试用
        this.selfVideoDivID = "testMaster";
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

        //初始化右侧面板
        this.rightPanel = document.getElementById("rightPanel");
        this.rightPanel.style.display = "none";
        this.masterVideo = document.getElementsByClassName("masterVideo")[0];
        this.subVideoContainer = document.getElementById("subVideoContainer")
    }

    /**
     * 开始游戏
     * */
    startClass(_nickName){
        if(OSManager.OS == "IOS" || OSManager.OS == "Android")
        {
            window.addEventListener("touchstart",function(evt){
                if(evt.targetTouches.length >0){
                    //点击位移方式
                    let t = evt.targetTouches[0];
                    let me = new GMLMouseEvent()
                    me.data = {"globelX":t.pageX,"globelY": t.pageY}
                    AppDelegate.app.ongMouseDown(me)
                }
            })
            window.addEventListener("touchend",function(evt){
                if(evt.targetTouches.length >0){
                    //点击位移方式
                    let t = evt.targetTouches[0];
                    let me = new GMLMouseEvent()
                    me.data = {"globelX":t.pageX,"globelY": t.pageY}
                    AppDelegate.app.ongMouseUp(me)
                }
            })
            window.addEventListener("touchmove",function(evt){
                if(evt.targetTouches.length >0){
                    //点击位移方式
                    let t = evt.targetTouches[0];
                    let me = new GMLMouseEvent()
                    me.data = {"globelX":t.pageX,"globelY": t.pageY}
                    AppDelegate.app.ongMouseMove(me)
                }
            })
        }else{
            window.addEventListener("mousedown",function(evt){
                let me = new GMLMouseEvent()
                me.data = {"globelX": evt.target.x,"globelY": evt.target.y};
                AppDelegate.app.ongMouseDown(me)
            })
        }

        this.nickName = _nickName.length > 17 ? _nickName.substr(0,17) : _nickName;
        this.bgAudio.play();
        this.bgAudio.loop = true;
        this.bgVideo.play();
        this.bgVideo.loop = true;
        this.fullScreen();//默认全屏

        //链接socket
        this.ws = new WebSocketHandler("ws://39.106.135.11:31111",[]);//localhost:31111
        this.ws.addEventListener(WebSocketEvent.SOCKET_CLOSE,this.onSocketClose,this)
        this.ws.addEventListener(WebSocketEvent.SOCKET_DATA,this.onSocketData,this);
        this.ws.addEventListener(WebSocketEvent.SOCKET_ERROR,this.onSocketError,this)
        this.ws.addEventListener(WebSocketEvent.SOCKET_CONNECTED,this.onSocketConnected,this)

        //长连接心跳 30秒发一次
        setInterval(function(){
            if(AppDelegate.app.ws.isOpen){
                let req = {"cmd":0x00FF0001,"seq":0,"lt":0};
                AppDelegate.app.ws.sendData(JSON.stringify(req))
            }
        },30000)
    }

    ongMouseDown(evt){
        let wX = evt.data.globelX;//全局坐标
        let wY = evt.data.globelY;
        console.log("mouseDown,wX="+wX + ",wY=" + wY);
    }

    ongMouseUp(evt){
        let wX = evt.data.globelX;//全局坐标
        let wY = evt.data.globelY;
        console.log("mouseUp,wX="+wX + ",wY=" + wY);
    }

    ongMouseMove(evt){
        let wX = evt.data.globelX;//全局坐标
        let wY = evt.data.globelY;
        //console.log("mouseMove,wX="+wX + ",wY=" + wY);
    }

    onSocketClose(e){
        console.log("socket断开")
    }
    onSocketData(e){
        this.jiexiData(e.data);
    }

    onSocketError(e){
        console.log("socket发生错误");
    }

    onSocketConnected(e){
        //开始登陆
        let req = {"cmd":0x00FF0003,"seq":0,"ln":this.nickName};
        this.ws.sendData(JSON.stringify(req));
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
        //启动媒体引擎
        AgoraMediaProxy.instance.start(AppDelegate.app.selfVideoDivID,"799547");
    }

    h5Init(){
        //测试代码
        let course_H5Entity = new H5Entity_course_simple();
        course_H5Entity.data["courserole"] = 1;
        course_H5Entity.data["coursestyle"] = 0;
        course_H5Entity.data["metrialtype"] = 0;//1比1的教材比例
        course_H5Entity.data["startedTime"] = parseInt(new Date().valueOf() / 1000);
        course_H5Entity.data["CanTurnPage"] = 1;//可以翻页

        let user_H5Entity = new H5Entity_user_simple();
        user_H5Entity.data["usergroup"] = 1;
        user_H5Entity.data["userid"] = 799547;
        user_H5Entity.data["userrole"] = 1;
        user_H5Entity.data["usertype"] = 1;//self.teacherRole() ? 1 : 2;//gmlok

        //构建pdf下载地址
        let urlInfo = new H5Entity_url_simple();
        //加载网络pdf资源
        //        var pdfPath = currentCourse!.teaCourseSource;
        //        pdfPath = pdfPath == "" ? currentCourse!.courseSource : pdfPath;
        //        var path:NSString=NSString(string: pdfPath)
        //        // 去空格处理和URI处理
        //        if(pdfPath.contains("%") == false)
        //        {
        //            // 需要URI处理
        //            path = path.addingPercentEncoding(withAllowedCharacters: CharacterSet.urlQueryAllowed)! as NSString
        //        }
        //        path = path.replacingOccurrences(of: " ", with: "%20") as NSString;
        //
        //        var headUrlBeforeBase64 = path as String;//path as String;//本地加载本地pdf必须在同一个目录才可以，本地加载网上资源可以，网上JS加载本地pdf不可以，网上JS只能加载同域下的资源。
        //        //"http://localhost:8080/1b26189c48018d410c8a78fb89f6a3d6.pdf";//"http://172.16.0.98/web/1.pdf";//"file://" + ACDataCachePresenter.sharedinstance.documentPath() + "/51TalkAbout/51talkPDFS/1b26189c48018d410c8a78fb89f6a3d6.pdf";//"http://localhost:8080/1b26189c48018d410c8a78fb89f6a3d6.pdf"; ////"http://172.16.0.98/web/1.pdf";//"file://" + Bundle.main.path(forResource: "pdfloaderByH5/1b26189c48018d410c8a78fb89f6a3d6", ofType: "pdf")!
        //        var headUrl:String? = headUrlBeforeBase64.data(using: String.Encoding.utf8)?.base64EncodedString();
        //        headUrl = headUrl == nil ? "" : headUrl;

        //加载本地pdf资源
        let headUrlBeforeBase64 = "../../4b7598199953ffe850ed9d672991ccc6.pdf";//"file://" + PDFCacheProxy.instance._localPdfPath;
        var headUrl = window.MyBase64.encode(headUrlBeforeBase64);
        headUrl = headUrl || "";
        urlInfo.data["pdf"] = headUrl;

        let hostInfo = new H5Entity_host_simple();
        hostInfo.data["language"] = "cn";
        hostInfo.data["showtype"] = "normal"//成人还是青少
        let whiteConfigDic = this.createWhiteConfigDic();
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
        window.comm_type_get(type,JSONStrValue);
    }

    createWhiteConfigDic(){
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
                    this.userinfo = jsonObj;//设置全局用户信息
                    if(jsonObj.code == 0){
                        //进入教室
                        let req = {
                            "cmd":0x00FF0014,
                            "seq":0,
                            "rc":"testchanel",
                            "uid":this.userinfo.uid,
                            "nn":this.userinfo.nn,
                            "hi":this.userinfo.hi,
                            "sex":this.userinfo.sex,
                            "ca":{x:34,y:387},//{x:parseInt(this.scene.width/2+Math.random()*100),y:parseInt(this.scene.height/2+Math.random()*100)},
                            "rp":this.userinfo.resourcePath.toString().replace("resource","gameResource")/*这个替换只是临时解决方案,真正的解决办法要从服务器入手,下发资源ID,本地根据资源ID动态算资源地址*/
                        };
                        this.ws.sendData(JSON.stringify(req));
                    }else{
                        console.log("登录失败")
                    }

                    break;
                case 0x00FF0007:
                    //掉线通知
                    console.log("掉线了");
                    break;
                case 0x00FF0015:
                    //进入教室回调
                    if(jsonObj.code == 0){
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
            }
        }catch(err){
            console.log("数据不是json",data)
        }
    }

    //其它用户进入
    userIn(item){
        //let nn = item.nn;
        //let sp = item.rp;
        //let sk = AppDelegate.app.monsterConfigYingShe[sp];
        //let mons = new Monster(nn,sp,sk);
        //mons.x = item.ca.x;
        //mons.y = item.ca.y;
        //AppDelegate.app.container.addChild(mons);
        //mons.uid = item.uid;
        //AppDelegate.app.allMonster.push(mons);
        //if(item.nn == "chacha" && item.nn != this.userinfo.nn){
        //    //如果该玩家的名字是 chacha,且这个玩家的名字和自己的不同,则证明自己是队员,会被队长带着走
        //    this.master = mons;
        //}
        //return mons;
        console.log("其他人进入教室:"+item)
    }

    //其它用户退出
    userOut(item){
        console.log("其他人离开教室:"+item)
    }


    /**
     * 尺寸变更
     * */
    resize(w,h){
        w = w < AppDelegate.app.minWidth ? AppDelegate.app.minWidth : w;
        BaseScene.main.resize(w,h)
        if(AppDelegate.app.whiteBoard)
        {
            AppDelegate.app.whiteBoard.style.width = (w - 320) + "px";
            AppDelegate.app.subVideoContainer.style.height = (h - 240) + "px";
        }
    }

    /**
     * 停止
     * */
    stop(){
        BaseScene.main.stop();
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
