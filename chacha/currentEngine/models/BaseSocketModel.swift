//
//  BaseSocketModel.swift
//  chacha
//
//  Created by guominglong on 2017/9/15.
//  Copyright © 2017年 SSdk. All rights reserved.
//

import Foundation

class BaseSocketModel{
    open var cmd:GMLSocketCMD = .normal;
    open var seq:UInt32 = 0;
}

class BaseSocketModel_c2s:BaseSocketModel {

    open func toDic()->[String:Any]{
        return ["cmd":cmd.rawValue,"seq":seq];
    }
}

class BaseSocketModel_s2c:BaseSocketModel {
    
    init(_ dic:NSDictionary) {
        super.init();
        self.cmd = GMLSocketCMD(rawValue:DataFactory.toUint32Value(dic.value(forKey: "cmd"), def: 0))!;
        self.seq = DataFactory.toUint32Value(dic.value(forKey: "seq"), def: 0)
    }
    
}

/**
 客户端请求服务器的 时间服务模型
 */
class Model_HeartBeat_c2s:BaseSocketModel_c2s{
    open var localTime:UInt32 = 0;
    
    override func toDic() -> [String:Any] {
        self.cmd = GMLSocketCMD.c_req_s_heartbeat;
        var dic = super.toDic();
        dic["lt"] = localTime;
        return dic;
    }
}

/**
 服务器响应客户端的 时间服务模型
 */
class Model_HeartBeat_s2c:BaseSocketModel_s2c{
    open var c_seq:UInt32 = 0;
    open var serverTime:UInt32 = 0;
    
    override init(_ dic: NSDictionary) {
        super.init(dic);
        self.c_seq = DataFactory.toUint32Value(dic.value(forKey: "c_seq"), def: 0);
        self.serverTime = DataFactory.toUint32Value(dic.value(forKey: "st"), def: 0)
    }
}


/**
 客户端请求服务器的 登录服务模型
 */
class Model_login_c2s:BaseSocketModel_c2s{
    
    open var loginName:String = "";
    
    override func toDic() -> [String:Any] {
        self.cmd = GMLSocketCMD.c_req_s_login;
        var dic = super.toDic();
        dic["ln"] = self.loginName;
        return dic;
    }
}

/**
 服务器响应客户端的 登录服务模型
 */
class Model_login_s2c:BaseSocketModel_s2c{
    open var c_seq:UInt32 = 0;
    open var code:UInt32 = 0;
    open var faildError:String = "";
    open var nickName:String = "";
    open var headerImage:String = "";
    open var sex:Bool = true;//true 是男  false 女
    open var uid:UInt32 = 0;
    
    override init(_ dic: NSDictionary) {
        super.init(dic);
        self.c_seq = DataFactory.toUint32Value(dic.value(forKey: "c_seq"), def: 0);
        self.code = DataFactory.toUint32Value(dic.value(forKey: "code"), def: 0);
        self.uid = DataFactory.toUint32Value(dic.value(forKey: "uid"), def: 0);
        self.faildError = DataFactory.toStringValue(dic.value(forKey: "fe"), def: "")
        self.nickName = DataFactory.toStringValue(dic.value(forKey: "nn"), def: "")
        self.headerImage = DataFactory.toStringValue(dic.value(forKey: "hi"), def: "")
        self.sex = DataFactory.toUint32Value(dic.value(forKey: "sex"), def: 1) == 1;
    }
}


/**
 客户端请求服务器的 登出服务模型
 */
class Model_logout_c2s:BaseSocketModel_c2s{
    open var uid:UInt32 = 0;
    override func toDic() -> [String:Any] {
        self.cmd = GMLSocketCMD.c_req_s_logout;
        var dic = super.toDic();
        dic["uid"] = self.uid;
        return dic;
    }
}

/**
 服务器响应客户端的 登出服务模型
 */
class Model_logout_s2c:BaseSocketModel_s2c{
    open var c_seq:UInt32 = 0;
    override init(_ dic: NSDictionary) {
        super.init(dic);
        self.c_seq = DataFactory.toUint32Value(dic.value(forKey: "c_seq"), def: 0);
    }
}


/**
 服务器响应客户端的 掉线通知服务模型
 */
class Model_offline_notify:BaseSocketModel_s2c{
    open var c_seq:UInt32 = 0;
    open var code:UInt32 = 0;
    open var reason:String = "";
    override init(_ dic: NSDictionary) {
        super.init(dic);
        self.c_seq = DataFactory.toUint32Value(dic.value(forKey: "c_seq"), def: 0);
        self.code = DataFactory.toUint32Value(dic.value(forKey: "code"), def: 0);
        self.reason = DataFactory.toStringValue(dic.value(forKey: "reason"), def: "");
    }
}


/**
 客户端请求服务器的 获取用户信息服务模型
 */
class Model_getUserInfo_c2s:BaseSocketModel_c2s{
    open var uid:UInt32 = 0;
    override func toDic() -> [String:Any] {
        self.cmd = GMLSocketCMD.c_req_s_getUserInfo;
        var dic = super.toDic();
        dic["uid"] = self.uid;
        return dic;
    }
}

/**
 服务器响应客户端的 获取用户信息服务模型
 */
class Model_getUserInfo_s2c:BaseSocketModel_s2c{
    open var c_seq:UInt32 = 0;
    open var code:UInt32 = 0;
    open var faildError:String = "";
    open var nickName:String = "";
    open var headerImage:String = "";
    open var sex:Bool = true;//true 是男  false 女
    open var uid:UInt32 = 0;
    override init(_ dic: NSDictionary) {
        super.init(dic);
        self.c_seq = DataFactory.toUint32Value(dic.value(forKey: "c_seq"), def: 0);
        self.code = DataFactory.toUint32Value(dic.value(forKey: "code"), def: 0);
        self.uid = DataFactory.toUint32Value(dic.value(forKey: "uid"), def: 0);
        self.faildError = DataFactory.toStringValue(dic.value(forKey: "fe"), def: "")
        self.nickName = DataFactory.toStringValue(dic.value(forKey: "nn"), def: "")
        self.headerImage = DataFactory.toStringValue(dic.value(forKey: "hi"), def: "")
        self.sex = DataFactory.toUint32Value(dic.value(forKey: "sex"), def: 1) == 1;
    }
}

/**
 客户端请求服务器的 更新用户信息服务模型
 */
class Model_updateUserInfo_c2s:BaseSocketModel_c2s{
    open var nickName:String = "";
    open var headerImage:String = "";
    open var sex:Bool = true;//true 是男  false 女
    open var uid:UInt32 = 0;
    override func toDic() -> [String:Any] {
        self.cmd = GMLSocketCMD.c_req_s_updateUserInfo;
        var dic = super.toDic();
        dic["uid"] = self.uid;
        dic["sex"] = self.sex ? 1 : 0;
        dic["hi"] = self.headerImage;
        dic["nn"] = self.nickName;
        return dic;
    }
}

/**
 服务器响应客户端的 更新用户信息服务模型
 */
class Model_updateUserInfo_s2c:BaseSocketModel_s2c{
    open var c_seq:UInt32 = 0;
    open var code:UInt32 = 0;
    open var faildError:String = "";
    
    override init(_ dic: NSDictionary) {
        super.init(dic);
        self.c_seq = DataFactory.toUint32Value(dic.value(forKey: "c_seq"), def: 0);
        self.code = DataFactory.toUint32Value(dic.value(forKey: "code"), def: 0);
        self.faildError = DataFactory.toStringValue(dic.value(forKey: "fe"), def: "")
    }
}

/**
 客户端请求服务器的 创建room服务模型
 */
class Model_createRoom_c2s:BaseSocketModel_c2s{
    open var roomName:String = "";
    open var roomImage:String = "";
    open var uid:UInt32 = 0;
    override func toDic() -> [String:Any] {
        self.cmd = GMLSocketCMD.c_req_s_createRoom;
        var dic = super.toDic();
        dic["rn"] = self.roomName;
        dic["ri"] = self.roomImage;
        dic["uid"] = self.uid;
        return dic;
    }
}

/**
 服务器响应客户端的 创建room服务模型
 */
class Model_createRoom_s2c:BaseSocketModel_s2c{
    open var c_seq:UInt32 = 0;
    open var code:UInt32 = 0;
    open var faildError:String = "";
    open var roomCode:String = "";
    open var rid:UInt32 = 0;
    override init(_ dic: NSDictionary) {
        super.init(dic);
        self.c_seq = DataFactory.toUint32Value(dic.value(forKey: "c_seq"), def: 0);
        self.code = DataFactory.toUint32Value(dic.value(forKey: "code"), def: 0);
        self.faildError = DataFactory.toStringValue(dic.value(forKey: "fe"), def: "")
        self.roomCode = DataFactory.toStringValue(dic.value(forKey: "rc"), def: "")
        self.rid = DataFactory.toUint32Value(dic.value(forKey: "rid"), def: 0);
    }
}

/**
 客户端请求服务器的 获取用户创建的教室信息服务模型
 */
class Model_getRoomsInfoByUser_c2s:BaseSocketModel_c2s{
    open var uid:UInt32 = 0;
    
    override func toDic() -> [String:Any] {
        self.cmd = GMLSocketCMD.c_req_s_getRoomsInfoByUser;
        var dic = super.toDic();
        dic["uid"] = self.uid;
        return dic;
    }
}

/**
 服务器响应客户端的 获取用户创建的教室信息服务模型
 */
class Model_getRoomsInfoByUser_s2c:BaseSocketModel_s2c{
    open var c_seq:UInt32 = 0;
    open var code:UInt32 = 0;
    open var faildError:String = "";
    open var roomInfoArr:[RoomInfo] = [RoomInfo]();
    override init(_ dic: NSDictionary) {
        super.init(dic);
        self.c_seq = DataFactory.toUint32Value(dic.value(forKey: "c_seq"), def: 0);
        self.code = DataFactory.toUint32Value(dic.value(forKey: "code"), def: 0);
        self.faildError = DataFactory.toStringValue(dic.value(forKey: "fe"), def: "")
        let arr = DataFactory.toArrayValue(dic.value(forKey: "ra"));
        for i:Int in 0 ..< arr.count{
            let obj = arr[i] as! NSDictionary;
            roomInfoArr.append(RoomInfo(obj));
        }
    }
}

class RoomInfo{
    open var rid:UInt32 = 0;
    open var roomCode:String = "";
    open var roomName:String = "";
    open var roomImage:String = "";
    init(_ dic: NSDictionary) {
        self.rid = DataFactory.toUint32Value(dic.value(forKey: "rid"), def: 0);
        self.roomCode = DataFactory.toStringValue(dic.value(forKey: "rc"), def: "");
        self.roomName = DataFactory.toStringValue(dic.value(forKey: "rn"), def: "");
        self.roomImage = DataFactory.toStringValue(dic.value(forKey: "ri"), def: "");
    }
}
/**
 客户端请求服务器的 删除room服务模型
 */
class Model_deleteRoom_c2s:BaseSocketModel_c2s{
    open var rid:UInt32 = 0;
    override func toDic() -> [String:Any] {
        self.cmd = GMLSocketCMD.c_req_s_delRoom;
        var dic = super.toDic();
        dic["rid"] = self.rid;
        return dic;
    }
}

/**
 服务器响应客户端的 删除room服务模型
 */
class Model_deleteRoom_s2c:BaseSocketModel_s2c{
    open var c_seq:UInt32 = 0;
    open var code:UInt32 = 0;
    open var faildError:String = "";
    override init(_ dic: NSDictionary) {
        super.init(dic);
        self.c_seq = DataFactory.toUint32Value(dic.value(forKey: "c_seq"), def: 0);
        self.code = DataFactory.toUint32Value(dic.value(forKey: "code"), def: 0);
        self.faildError = DataFactory.toStringValue(dic.value(forKey: "fe"), def: "")
    }
}


/**
 服务器响应客户端的 room状态变更通知服务模型
 */
class Model_roomStateChange_notify:BaseSocketModel_s2c{
    open var c_seq:UInt32 = 0;
    open var code:UInt32 = 0;
    open var msgObj:NSDictionary = NSDictionary();
    override init(_ dic: NSDictionary) {
        super.init(dic);
        self.c_seq = DataFactory.toUint32Value(dic.value(forKey: "c_seq"), def: 0);
        self.code = DataFactory.toUint32Value(dic.value(forKey: "code"), def: 0);
        self.msgObj = DataFactory.toDictionaryValue(dic.value(forKey: "msg"));
    }
}


/**
 客户端请求服务器的 进入room服务模型
 */
class Model_joinRoom_c2s:BaseSocketModel_c2s{
    //open var rid:UInt32 = 0;
    open var uid:UInt32 = 0;
    open var roomCode:String = "";
    open var nickName:String = "";
    open var headerImage:String = "";
    open var sex:Bool = true;
    open var customAttributesy:NSDictionary = NSDictionary();
    override func toDic() -> [String:Any] {
        self.cmd = GMLSocketCMD.c_req_s_joinRoom;
        var dic = super.toDic();
        //dic["rid"] = self.rid;
        dic["uid"] = self.uid;
        dic["rc"] = self.roomCode;
        dic["nn"] = self.nickName;
        dic["hi"] = self.headerImage;
        dic["sex"] = self.sex ? 1 : 0;
        dic["ca"] = self.customAttributesy;
        return dic;
    }
}

/**
 服务器响应客户端的 进入room服务模型
 */
class Model_joinRoom_s2c:BaseSocketModel_s2c{
    open var c_seq:UInt32 = 0;
    open var code:UInt32 = 0;
    open var faildError:String = "";
    open var rid:UInt32 = 0;
    open var roomName:String = "";
    open var roomImage:String = "";
    open var userInfoArr:[UserInfo] = [UserInfo]();
    override init(_ dic: NSDictionary) {
        super.init(dic);
        self.c_seq = DataFactory.toUint32Value(dic.value(forKey: "c_seq"), def: 0);
        self.code = DataFactory.toUint32Value(dic.value(forKey: "code"), def: 0);
        self.faildError = DataFactory.toStringValue(dic.value(forKey: "fe"), def: "")
        self.rid = DataFactory.toUint32Value(dic.value(forKey: "rid"), def: 0);
        self.roomImage = DataFactory.toStringValue(dic.value(forKey: "ri"), def: "")
        self.roomName = DataFactory.toStringValue(dic.value(forKey: "rn"), def: "")
        let arr = DataFactory.toArrayValue(dic.value(forKey: "ua"));
        for i:Int in 0 ..< arr.count{
            let dic = arr[i] as! NSDictionary;
            userInfoArr.append(UserInfo(dic));
        }
    }
}

/**
 用户信息
 */
class UserInfo{
    open var uid:UInt32 = 0;
    open var nickName:String = "";
    open var headerImage:String = "";
    open var sex:Bool = true;//男为true
    open var type:Bool = true;//进入还是离开教室， true为进入教室
    open var customAttributesy:NSDictionary = NSDictionary();
    init(_ dic: NSDictionary) {
        self.uid = DataFactory.toUint32Value(dic.value(forKey: "uid"), def: 0);
        self.nickName = DataFactory.toStringValue(dic.value(forKey: "nn"), def: "");
        self.headerImage = DataFactory.toStringValue(dic.value(forKey: "hi"), def: "");
        self.sex = DataFactory.toUint32Value(dic.value(forKey: "sex"), def: 1) == 1;
        self.customAttributesy = DataFactory.toDictionaryValue(dic.value(forKey: "ca"));
        self.type = DataFactory.toUint32Value(dic.value(forKey: "type"), def: 1) == 1;
    }
}

/**
 客户端请求服务器的 退出room服务模型
 */
class Model_leaveRoom_c2s:BaseSocketModel_c2s{
    open var rid:UInt32 = 0;
    open var uid:UInt32 = 0;
    override func toDic() -> [String:Any] {
        self.cmd = GMLSocketCMD.c_req_s_leaveRoom;
        var dic = super.toDic();
        dic["rid"] = self.rid;
        dic["uid"] = self.uid;
        return dic;
    }
}


/**
 服务器响应客户端的 其它用户状态变更通知服务模型
 */
class Model_otherUserStateChange_notify:BaseSocketModel_s2c{
    open var c_seq:UInt32 = 0;
    open var code:UInt32 = 0;
    open var faildError:String = "";
    open var userInfoArr:[UserInfo] = [UserInfo]();
    override init(_ dic: NSDictionary) {
        super.init(dic);
        self.c_seq = DataFactory.toUint32Value(dic.value(forKey: "c_seq"), def: 0);
        self.code = DataFactory.toUint32Value(dic.value(forKey: "code"), def: 0);
        self.faildError = DataFactory.toStringValue(dic.value(forKey: "fe"), def: "")
        let arr = DataFactory.toArrayValue(dic.value(forKey: "ua"));
        for i:Int in 0 ..< arr.count{
            let dic = arr[i] as! NSDictionary;
            userInfoArr.append(UserInfo(dic));
        }
    }
}

/**
 客户端请求服务器的 文本消息服务模型
 */
class Model_sendChat_c2s:BaseSocketModel_c2s{
    open var rid:UInt32 = 0;
    open var uid:UInt32 = 0;
    open var msg:String = "";
    open var localTime:UInt32 = 0;
    override func toDic() -> [String:Any] {
        self.cmd = GMLSocketCMD.c_req_s_sendChat;
        var dic = super.toDic();
        dic["rid"] = self.rid;
        dic["uid"] = self.uid;
        dic["msg"] = self.msg;
        dic["lt"] = self.localTime;
        return dic;
    }
}


/**
 服务器响应客户端的 文本消息通知服务模型
 */
class Model_sendChat_notify:BaseSocketModel_s2c{
    open var c_seq:UInt32 = 0;
    open var code:UInt32 = 0;
    open var rid:UInt32 = 0;
    open var messageArr:[MessageEntity] = [MessageEntity]();
    override init(_ dic: NSDictionary) {
        super.init(dic);
        self.c_seq = DataFactory.toUint32Value(dic.value(forKey: "c_seq"), def: 0);
        self.code = DataFactory.toUint32Value(dic.value(forKey: "code"), def: 0);
        self.rid = DataFactory.toUint32Value(dic.value(forKey: "rid"), def: 0);
        let arr = DataFactory.toArrayValue(dic.value(forKey: "msga"));
        for i:Int in 0 ..< arr.count{
            let dic = arr[i] as! NSDictionary;
            messageArr.append(MessageEntity(dic));
        }
    }
}

/**
 文本消息结构体
 */
class MessageEntity {
    open var senderId:UInt32 = 0;
    open var serverTime:UInt32 = 0;
    open var msg:String = "";
    init(_ dic: NSDictionary) {
        self.senderId = DataFactory.toUint32Value(dic.value(forKey: "suid"), def: 0);
        self.serverTime = DataFactory.toUint32Value(dic.value(forKey: "st"), def: 0);
        self.msg = DataFactory.toStringValue(dic.value(forKey: "msg"), def: "");
        
    }
    
}


/**
 客户端请求服务器的 管理员命令服务模型
 */
class Model_adminCMD_c2s:BaseSocketModel_c2s{
    open var rid:UInt32 = 0;
    open var uid:UInt32 = 0;
    open var cmdMessage:NSDictionary = NSDictionary();
    override func toDic() -> [String:Any] {
        self.cmd = GMLSocketCMD.c_req_s_sendAdminCMD;
        var dic = super.toDic();
        dic["rid"] = self.rid;
        dic["uid"] = self.uid;
        dic["cm"] = self.cmdMessage;
        return dic;
    }
}


/**
 服务器响应客户端的 管理员命令通知服务模型
 */
class Model_adminCMD_notify:BaseSocketModel_s2c{
    open var c_seq:UInt32 = 0;
    open var code:UInt32 = 0;
    open var cmdArr:[AdminCMDEntity] = [AdminCMDEntity]();
    override init(_ dic: NSDictionary) {
        super.init(dic);
        self.c_seq = DataFactory.toUint32Value(dic.value(forKey: "c_seq"), def: 0);
        self.code = DataFactory.toUint32Value(dic.value(forKey: "code"), def: 0);
        let arr = DataFactory.toArrayValue(dic.value(forKey: "cmda"));
        for i:Int in 0 ..< arr.count{
            let dic = arr[i] as! NSDictionary;
            cmdArr.append(AdminCMDEntity(dic));
        }
    }
}

/**
 管理员命令数据结构
 */
class AdminCMDEntity {
    open var senderId:UInt32 = 0;
    open var serverTime:UInt32 = 0;
    open var cmd:NSDictionary = NSDictionary();
    init(_ dic: NSDictionary) {
        self.senderId = DataFactory.toUint32Value(dic.value(forKey: "suid"), def: 0);
        self.serverTime = DataFactory.toUint32Value(dic.value(forKey: "st"), def: 0);
        self.cmd = DataFactory.toDictionaryValue(dic.value(forKey: "cmd"));
    }
}

/**
 客户端请求服务器的 通用教学命令服务模型
 */
class Model_currentCMD_c2s:BaseSocketModel_c2s{
    open var rid:UInt32 = 0;
    open var uid:UInt32 = 0;
    open var data:NSDictionary = NSDictionary();
    override func toDic() -> [String:Any] {
        self.cmd = GMLSocketCMD.c_req_s_sendCurrentCMD;
        var dic = super.toDic();
        dic["rid"] = self.rid;
        dic["uid"] = self.uid;
        dic["data"] = self.data;
        return dic;
    }
}


/**
 服务器响应客户端的 通用教学命令通知服务模型
 */
class Model_currentCMD_notify:BaseSocketModel_s2c{
    open var c_seq:UInt32 = 0;
    open var code:UInt32 = 0;
    open var dataArr:[CurrentCMD] = [CurrentCMD]();
    override init(_ dic: NSDictionary) {
        super.init(dic);
        self.c_seq = DataFactory.toUint32Value(dic.value(forKey: "c_seq"), def: 0);
        self.code = DataFactory.toUint32Value(dic.value(forKey: "code"), def: 0);
        let arr = DataFactory.toArrayValue(dic.value(forKey: "datas"));
        for i:Int in 0 ..< arr.count{
            let dic = arr[i] as! NSDictionary;
            dataArr.append(CurrentCMD(dic));
        }
    }
}

/**
 通用教学命令数据结构
 */
class CurrentCMD {
    open var senderId:UInt32 = 0;
    open var serverTime:UInt32 = 0;
    open var data:NSDictionary = NSDictionary();
    init(_ dic: NSDictionary) {
        self.senderId = DataFactory.toUint32Value(dic.value(forKey: "suid"), def: 0);
        self.serverTime = DataFactory.toUint32Value(dic.value(forKey: "st"), def: 0);
        self.data = DataFactory.toDictionaryValue(dic.value(forKey: "data"));
    }
}

/**
 客户端请求服务器的 更新用户状态服务模型
 */
class Model_updateUserState_c2s:BaseSocketModel_c2s{
    open var rid:UInt32 = 0;
    open var uid:UInt32 = 0;
    open var customAttributesy:NSDictionary = NSDictionary();
    override func toDic() -> [String:Any] {
        self.cmd = GMLSocketCMD.c_req_s_updateUserState;
        var dic = super.toDic();
        dic["rid"] = self.rid;
        dic["uid"] = self.uid;
        dic["ca"] = self.customAttributesy;
        return dic;
    }
}
