//
//  GlobelInfo.swift
//  chacha
//
//  Created by guominglong on 2017/9/27.
//  Copyright © 2017年 SSdk. All rights reserved.
//

import Foundation
class GlobelInfo: NSObject {
    static var instance:GlobelInfo{
        get{
            struct GlobelInfoStruc{
                static let _ins = GlobelInfo();
            }
            
            return GlobelInfoStruc._ins;
        }
    }
    /**
     用户信息
     */
    open var userInfo:Model_login_s2c?;
    
    /**
     教室数据
     */
    open var classInfo:ClassRoomInfo?;
}
