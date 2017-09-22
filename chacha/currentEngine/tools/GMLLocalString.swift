//
//  GMLLocalString.swift
//  chacha
//
//  Created by guominglong on 2017/9/22.
//  Copyright © 2017年 SSdk. All rights reserved.
//

import Foundation
class GMLLocalString {
    class func get(_ key:String) -> String{
        return NSLocalizedString(key, tableName: "local", bundle: Bundle.main, value: "", comment: "");
    }
}
