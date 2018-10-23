/**
 * 聊天代理
 * Created by guominglong on 2018/10/15.
 */
class ChatProxy{
    constructor(_divID){
        this.daojishiID = 0;
        this.canShowTime = true;
        this.chatPanel = document.getElementById(_divID);
        this.chatPanel.style.display = "none";
        this.tbInput = document.getElementById('tb_chatInput');
        let selfIns = this;
        $('#' + _divID).find("#btn_closeChatPanel").bind('click',function(){
            selfIns.showOrHide();
        });

        $('#' + _divID).find("#btn_sendMsg").bind('click',function(){
            let msgType = "text";//文本消息类型
            let msg = selfIns.tbInput.value;//文本消息
            selfIns.clearTbInputValue();
            AppDelegate.app.sendChatMSG({"msgType":msgType,"msg":msg});
            if(AppDelegate.app.userinfo){
                //显示本机消息
                selfIns.showMsg(AppDelegate.app.userinfo.uid,AppDelegate.app.userinfo.nn,msgType,msg,2);
            }
        });
    }

    /**
     * 初始化chatH5
     * */
    initial(){
        let isTeacher = AppDelegate.app.roomInfo.ownnerUID == AppDelegate.app.userinfo.uid;
        let init_H5Entity = new H5Entity_1v1chat_init();
        init_H5Entity.data["id"] = AppDelegate.app.userinfo.uid;
        init_H5Entity.data["type"] = isTeacher ? "tea" : "stu";
        init_H5Entity.data["name"] = AppDelegate.app.userinfo.nn;
        init_H5Entity.data["clienttype"] = "7";
        this._callChat(init_H5Entity.key, init_H5Entity.toJSStr());
    }

    /**
     * 清空文本框内的数据
     * */
    clearTbInputValue(){
        this.tbInput.value = ""
    }

    get isShow(){
        let chatPanelState = this.chatPanel.style.display || "none";
        if(chatPanelState === "none"){
            return false;
        }else{
            return true;
        }
    }
    /**
     * 显示或者隐藏
     * */
    showOrHide(){
        let msgIcon = document.getElementById("btn_chat");
        if(msgIcon){
            msgIcon.className = "btn_chatClass";//还原icon为无新信息状态
        }
        if(this.isShow == false){
            this.chatPanel.style.display = "inline-block";
            //$("#tb_chatInput").focus();//不聚焦,否则在移动端一打开聊天界面就弹出键盘
        }else{
            this.chatPanel.style.display = "none";
            $("#tb_chatInput").blur();
        }
    }

    showMsg(senderUID,senderNickName,msgType,msg,msgStyle=2){
        if(this.canShowTime == true){
            //居中显示时间
            this._trueshowMsg(senderUID,senderNickName,"text",new Date().toLocaleTimeString(),3);
            this.canShowTime = false;
            clearTimeout(this.daojishiID);
            let selfIns = this;
            this.daojishiID = setTimeout(function(){
                selfIns.canShowTime = true;
            },18000);//180秒后重置状态
        }
        this._trueshowMsg(senderUID,senderNickName,msgType,msg,msgStyle);
    }

    /**
     * 私有显示聊天消息
     * @param senderUID 发送者id
     * @param senderNickName 发送者用户昵称
     * @param msgType 消息类型 text:纯文本消息
     * @param msg 消息体
     * @param msgStyle 消息显示的类型,默认为右侧显示,5:提示消息
     * */
    _trueshowMsg(senderUID,senderNickName,msgType,msg,msgStyle){
        let isTeacher = AppDelegate.app.roomInfo.ownnerUID == senderUID;//该用户是否是老师
        let sendMsgReq = new H5Entity_1v1chat_sendData();
        sendMsgReq.data["type"] = "tipInfo";
        let userInfo = {
            "courserole":-1,
            "headImg":"",
            "id":"0",
            "name":""
        };
        if(msgType == "text"){
            if(msgStyle == 5){
                //进出教室提示
                sendMsgReq.data["type"] = "tipELRoom";
                sendMsgReq.data["userInfo"] = userInfo;
                sendMsgReq.data["value"] = {
                    "id": "",
                    "isMe": "True",
                    "time": "",
                    "data": msg
                }
            }else if(msgStyle == 3){
                //居中显示信息
                sendMsgReq.data["type"] = "tipInfo";
                sendMsgReq.data["userInfo"] = userInfo;
                sendMsgReq.data["value"] = {
                    "id": "",
                    "isMe": "True",
                    "time": "",
                    "data": msg
                }
            }else if(msgStyle == 2){
                //右侧显示文本
                sendMsgReq.data["type"] = "text";
                userInfo["courserole"] = isTeacher ? 1 : 0;
                userInfo["name"] = senderNickName;
                userInfo["id"] = senderUID.toString();
                sendMsgReq.data["userInfo"] = userInfo;
                sendMsgReq.data["value"] = {
                    "id": senderUID.toString(),
                    "isMe": "True",
                    "time": "",
                    "data": msg
                }
            }else if(msgStyle == 1){
                //左侧显示文本
                sendMsgReq.data["type"] = "text";
                userInfo["courserole"] = isTeacher ? 1 : 0;
                userInfo["name"] = senderNickName;
                userInfo["id"] = senderUID.toString();
                sendMsgReq.data["userInfo"] = userInfo;
                sendMsgReq.data["value"] = {
                    "id": senderUID.toString(),
                    "isMe": "False",
                    "time": "",
                    "data": msg
                }
            }
        }
        this._callChat(sendMsgReq.key, sendMsgReq.toJSStr());
    }

    checkCanShowTime(){

    }
    /**
     * 私有函数
     * */
    _callChat(type,JSONStrValue){
        if(!this.chatWindow){
            this.chatWindow = document.getElementById('chatIframe').contentWindow;//获取chat的window
        }
        this.chatWindow.comm_chat_set(type,JSONStrValue);
    }
}
