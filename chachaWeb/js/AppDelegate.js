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

    }

    /**
     * 启动
     * */
    init(){
        //设置清晰度为2倍屏
        ScreenManager.main.quilaty = 2;

        //初始化音频播放器
        this.bgAudio = new GMLAudio();
        this.bgAudio.preload = true;
        //this.bgAudio.src = "./gameResource/bg.mp3"

        //初始化视频播放器
        this.bgVideo = new GMLVideo();
        this.bgVideo.preload = true;
        //this.bgAudio.src = "./gameResource/bg.mp4"

        //初始化白板区域
        //this.whiteBoard = document.getElementById("")
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
        BaseScene.main.resize(w,h)
    }

    /**
     * 停止
     * */
    stop(){
        BaseScene.main.stop();
    }
}
