/**
 * Created by guominglong on 2018/10/19.
 */
class WhiteBoardProxy{
    constructor(){

    }
    /**
     * 收到服务器下发的通用教学命令
     * */
    reciveServerData(_dataObj){
        //收到服务器下发的白板相关数据
        let funcName = _dataObj.funcName || "";
        let funcDic = _dataObj.data || {};
        switch(funcName){
            case "teenpage":
                //翻页命令
                this.fanyeToH5(funcDic);
                break;
            case "paint":
                //白板数据命令
                this.wbDataToH5(funcDic);
                break;
            case "scroll":
                //白板滚动命令
                this.scrollToH5(funcDic)
                break;
            default:break;
        }
    }

    /**
     * 处理JS调用主函数的各种白板操作
     * */
    jsWhiteBoardDatatoMain(_dataObj){
        let resultDataObj = JSON.parse(_dataObj);
        let funcName = resultDataObj.type || "";
        let funcDic = JSON.parse(resultDataObj.value || "{}");
        switch(funcName){
            case "mouse":
                break;
            case "scroll":
                this.reciveH5ScrollData(funcName,funcDic);
                break;
            case "magic":
                break;
            case "teenpage":
                this.reciveH5TeenPage(funcName,funcDic);
                break;
            case "startClass":
                break;
            case "startPractice":
                break;
            case "H5CourseLoad":
                break;
            case "load":
                break;
            case "paint":
                this.reciveH5WhiteBoardData(funcName,funcDic);
                break;
            case "animate":
                break;
            case "h5_ready":
                break;
            case "H5ChangeBook":
                //换教材
                break;
            default:
                break;
        }
    }

    /**
     * PDF被滚动
     * */
    reciveH5ScrollData(funcName,dic){
        if(AppDelegate.app.roomInfo.ownnerUID == AppDelegate.app.userinfo.uid){
            //自己是老师
            let req = {
                "funcName":funcName,
                "data":dic
            }
            this.sendTongYongCMD(req);
        }
    }

    /**
     * pdf被翻页
     * */
    reciveH5TeenPage(funcName,dic){
        if(AppDelegate.app.roomInfo.ownnerUID == AppDelegate.app.userinfo.uid){
            dic.count = dic.count || 0
            if(dic.count == 0)
            {
                return;
            }
            //自己是老师
            let req = {
                "funcName":funcName,
                "data":dic
            }
            this.sendTongYongCMD(req);
        }
    }

    /**
     * 白板笔触数据(铅笔,矩形,橡皮擦,等等)
     * */
    reciveH5WhiteBoardData(funcName,dic){
        if(AppDelegate.app.roomInfo.ownnerUID == AppDelegate.app.userinfo.uid){
            //自己是老师
            let req = {
                "funcName":funcName,
                "data":dic
            }
            this.sendTongYongCMD(req);
        }
    }


    /**
     * 向服务器发送 通用教学命令
     * */
    sendTongYongCMD(_dataObj){
        let uid = AppDelegate.app.userinfo.uid || -1;
        let rid = AppDelegate.app.roomInfo.rid || -1;
        if(uid > -1 && rid > -1){
            let req = {
                "cmd":0x00FF001C,
                "uid":uid,
                "rid":rid,
                "lt":0,
                "data":_dataObj
            };
            AppDelegate.app.sendDataToServer(JSON.stringify(req))
        }
    }

    /**
     * 通知H5翻页
     * */
    fanyeToH5(_dic){
        let req = new H5Entity_page_simple();
        req.data = {
            "TotalPage":_dic.count.toString(),
            "CurrentPage":_dic.cur.toString()
        }
        this.callH5(req.key,req.toJSStr())
    }

    /**
     * 通知H5滚动
     * */
    scrollToH5(_dic){
        let req = new H5Entity_scroll_simple();
        req.data = _dic;
        this.callH5(req.key,req.toJSStr())
    }

    /**
     * 通知H5绘制白板数据
     * */
    wbDataToH5(_dic){
        let req = new H5Entity_paint_simple();
        req.data = _dic;
        this.callH5(req.key,req.toJSStr())
    }

    /**
     * 主程序调用 白板的各种协议接口
     * */
    callH5(type,JSONStrValue) {
        window.comm_type_get(type, JSONStrValue);
    }
}