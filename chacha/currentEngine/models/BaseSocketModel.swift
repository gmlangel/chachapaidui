//
//  BaseSocketModel.swift
//  chacha
//
//  Created by guominglong on 2017/9/15.
//  Copyright © 2017年 SSdk. All rights reserved.
//

import Foundation
class BaseSocketModel {
    open var cmd:GMLSocketCMD = .normal;
    open var seq:UInt32 = 0;
    
    init(_ dic:NSDictionary) {
        self.cmd = GMLSocketCMD(rawValue:DataFactory.toUint32Value(dic.value(forKey: "cmd"), def: 0))!;
        self.seq = DataFactory.toUint32Value(dic.value(forKey: "seq"), def: 0)
    }
    
    open func toDic()->[String:Any]{
        return ["cmd":cmd.rawValue,"seq":seq];
    }
}

/**
 客户端请求服务器的 时间服务模型
 */
class Model_HeartBeat_c2s:BaseSocketModel{
    open var localTime:UInt32 = 0;
    
    override func toDic() -> [String:Any] {
        var dic = super.toDic();
        dic["lt"] = localTime;
        return dic;
    }
}

/**
 服务器响应客户端的 时间服务模型
 */
class Model_HeartBeat_s2c:BaseSocketModel{
    open var c_seq:UInt32 = 0;
    open var serverTime:UInt32 = 0;
    
    override init(_ dic: NSDictionary) {
        super.init(dic);
        self.c_seq = DataFactory.toUint32Value(dic.value(forKey: "c_seq"), def: 0);
        self.serverTime = DataFactory.toUint32Value(dic.value(forKey: "st"), def: 0)
    }
}

