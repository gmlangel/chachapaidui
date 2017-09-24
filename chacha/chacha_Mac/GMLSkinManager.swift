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
    open let mainForegroundColor:CGColor = CGColor(red: 0xe6 / 255.0, green: 0xed / 255.0, blue: 0xeb / 255.0, alpha: 1)
    
    /**
     通用按钮1
     */
    open func getCurrentBtn(_ frame:NSRect) ->CurrentBtn{
        let args = CurrentBtnArgs();
        args.tbFont = FontEnum.btnTextFont;
        args.colorStates = [CurrentBtnColorState.fillColor,CurrentBtnColorState.fillColor,CurrentBtnColorState.fillColor];
        args.tbColorArr = [NSColor.white,NSColor.white,NSColor.white];
        args.bgColorArr = [NSColor(red: 0x44 / 255.0, green: 0xd7 / 255.0, blue: 0x41 / 255.0, alpha: 1),NSColor(red: 72 / 255.0, green: 228 / 255.0, blue: 72 / 255.0, alpha: 1),NSColor(red: 0x38 / 255.0, green: 0xb4 / 255.0, blue: 0x39 / 255.0, alpha: 1)]
        args.bgUnEnabledColorArr = [NSColor.gray,NSColor.gray,NSColor.gray];
        let btn:CurrentBtn = CurrentBtn(frame: frame, cba: args);
        return btn;
    }
    
    open let currentFontColor = NSColor(red: 0x33 / 255.0, green: 0x33 / 255.0, blue: 0x33 / 255.0, alpha: 1)
}
