/**
 * Created by guominglong on 2018/10/19.
 */
class WhiteBoardProxy{
    constructor(){

    }

    /**
     * 处理
     * */
    jsWhiteBoardDatatoMain(_dataObj){
        console.log("====>gml",_dataObj)
    }

    /**
     * 主程序调用 白板的各种协议接口
     * */
    callH5(type,JSONStrValue) {
        window.comm_type_get(type, JSONStrValue);
    }
}