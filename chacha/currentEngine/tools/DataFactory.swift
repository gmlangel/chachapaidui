//  http返回数据封装器
//  HttpResponsePro.swift
//  51talkAC
//
//  Created by guominglong on 16/11/30.
//  Copyright © 2016年 guominglong. All rights reserved.
//

import Foundation
//MARK:数据转换工厂
class DataFactory:NSObject{
    
    /**
     AnyObject 转 Int32
     */
    class func toInt32Value(_ obj:Any?,def:Int32)->Int32{
        if obj != nil {
            if (obj! as AnyObject).isKind(of: NSString.self){
                let str = obj as! String;
                return Int32(str) ?? def;
            }else if (obj! as AnyObject).isKind(of: NSNumber.self){
                return (obj as! NSNumber).int32Value;
            }else{
                return def;
            }
        }else{
            return def;
        }
    }
    
    /**
     AnyObject 转 UInt8
     */
    class func toUint8Value(_ obj:Any?,def:UInt8)->UInt8{
        if obj != nil {
            if (obj! as AnyObject).isKind(of: NSString.self){
                let str = obj as! String;
                return UInt8(str) ?? def;
            }else if (obj! as AnyObject).isKind(of: NSNumber.self){
                return (obj as! NSNumber).uint8Value;
            }else{
                return def;
            }
        }else{
            return def;
        }
    }
    /**
     AnyObject 转 UInt16
     */
    class func toUint16Value(_ obj:Any?,def:UInt16)->UInt16{
        if obj != nil {
            if (obj! as AnyObject).isKind(of: NSString.self){
                let str = obj as! String;
                return UInt16(str) ?? def;
            }else if (obj! as AnyObject).isKind(of: NSNumber.self){
                return (obj as! NSNumber).uint16Value;
            }else{
                return def;
            }
        }else{
            return def;
        }
    }

    /**
     AnyObject 转 UInt32
     */
    class func toUint32Value(_ obj:Any?,def:UInt32)->UInt32{
        if obj != nil {
            if (obj! as AnyObject).isKind(of: NSString.self){
                let str = obj as! String;
                return UInt32(str) ?? def;
            }else if (obj! as AnyObject).isKind(of: NSNumber.self){
                return (obj as! NSNumber).uint32Value;
            }else{
                return def;
            }
        }else{
            return def;
        }
    }
    /**
     AnyObject 转 UInt64
     */
    class func toUint64Value(_ obj:Any?,def:UInt64)->UInt64{
        if obj != nil {
            if (obj! as AnyObject).isKind(of: NSString.self){
                let str = obj as! String;
                return UInt64(str) ?? def;
            }else if (obj! as AnyObject).isKind(of: NSNumber.self){
                return (obj as! NSNumber).uint64Value;
            }else{
                return def;
            }
        }else{
            return def;
        }
    }
    
    /**
     AnyObject 转 Int
     */
    class func toIntValue(_ obj:Any?,def:Int)->Int{
        if obj != nil {
            if (obj! as AnyObject).isKind(of: NSString.self){
                let str = obj as! String;
                return Int(str) ?? def;
            }else if (obj! as AnyObject).isKind(of: NSNumber.self){
                return (obj as! NSNumber).intValue;
            }else{
                return def;
            }
        }else{
            return def;
        }
    }
    
    /**
     AnyObject 转 String
     */
    class func toStringValue(_ obj:Any?,def:String)->String{
        if obj != nil {
            if (obj! as AnyObject).isKind(of: NSString.self){
                let str = obj as! String;
                return str;
            }else{
                return def;
            }
        }else{
            return def;
        }
    }
    
    /**
     AnyObject 转 Bool
     */
    class func toBoolValue(_ obj:Any?,def:Bool)->Bool{
        if obj != nil {
            if (obj! as AnyObject).isKind(of: NSString.self){
                let str = obj as! String;
                let i = Int(str) ?? 0;
                return i != 0;
            }else if (obj! as AnyObject).isKind(of: NSNumber.self){
                return (obj as! NSNumber).intValue != 0;
            }else{
                return def;
            }
        }else{
            return def;
        }
    }
    
    /**
     AnyObject 转 NSDictionary
     */
    class func toDictionaryValue(_ obj:Any?)->NSDictionary{
        if obj != nil {
            if (obj! as AnyObject).isKind(of: NSDictionary.self){
                return obj as! NSDictionary
            }else{
                return NSDictionary();
            }
        }else{
            return NSDictionary();
        }
    }
    
    /**
     AnyObject 转 NSArray
     */
    class func toArrayValue(_ obj:Any?)->NSArray{
        if obj != nil {
            if (obj! as AnyObject).isKind(of: NSArray.self){
                return obj as! NSArray
            }else{
                return NSArray();
            }
        }else{
            return NSArray();
        }
    }
}

