//
//  GMLSkinManager.swift
//  chacha
//
//  Created by guominglong on 2017/9/22.
//  Copyright © 2017年 SSdk. All rights reserved.
//

import Foundation
class GMLSkinManager {
    static var instance:GMLSkinManager{
        get{
            struct GMLSkinManagerStruc{
                static var _ins = GMLSkinManager();
            }
            return GMLSkinManagerStruc._ins;
        }
    }
    /**
     主窗口背景色
     */
    open let mainBackgroundColor:CGColor = CGColor(red: 0x22 / 255.0, green: 0x22 / 255.0, blue: 0x22 / 255.0, alpha: 1)
    
    /**
     主界面前景色
     */
    open let mainForegroundColor:CGColor = CGColor(red: 0xdd / 255.0, green: 0xdd / 255.0, blue: 0xdd / 255.0, alpha: 1)
}
