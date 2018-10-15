/**
 * 聊天代理
 * Created by guominglong on 2018/10/15.
 */
class ChatProxy{
    constructor(_divID){
        this.chatPanel = document.getElementById(_divID);
        this.chatPanel.style.display = "none";
        this.tbInput = document.getElementById('tb_chatInput');
        let selfIns = this;
        $('#' + _divID).find("#btn_closeChatPanel").bind('click',function(){
            selfIns.showOrHide();
        });

        $('#' + _divID).find("#btn_sendMsg").bind('click',function(){
            AppDelegate.app.sendChatMSG(selfIns.tbInput.value);
            selfIns.showMsg();
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
        this.callChat(init_H5Entity.key, init_H5Entity.toJSStr());
        //测试信息
        this.showMsg();
    }

    /**
     * 现实化隐藏
     * */
    showOrHide(){
        let chatPanelState = this.chatPanel.style.display || "none";
        if(chatPanelState === "none"){
            this.chatPanel.style.display = "inline-block";
            $("#tb_chatInput").focus();
        }else{
            this.chatPanel.style.display = "none";
            $("#tb_chatInput").blur();
        }
    }

    /**
     * 显示聊天消息
     * */
    showMsg(){
        let sendMsgReq = new H5Entity_1v1chat_sendData();
        sendMsgReq.data["type"] = "tipInfo";
        sendMsgReq.data["userInfo"] = {
            "courserole":-1,
            "headImg":"",
            "id":"0",
            "name":""
        };
        sendMsgReq.data["value"] = {
            "id": "",
            "isMe": "True",
            "time": "",
            "data": "这是测试"
        }
        this.callChat(sendMsgReq.key, sendMsgReq.toJSStr());
    }

    callChat(type,JSONStrValue){
        if(!this.chatWindow){
            this.chatWindow = document.getElementById('chatIframe').contentWindow;//获取chat的window
        }
        this.chatWindow.comm_chat_set(type,JSONStrValue);
    }
}
