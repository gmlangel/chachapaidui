//
//  BaseWindow.swift
//  chacha
//
//  Created by guominglong on 2017/9/14.
//  Copyright © 2017年 SSdk. All rights reserved.
//

import Foundation
import AppKit
class BaseWindow:NSWindow,NSWindowDelegate{
    override init(contentRect: NSRect, styleMask style: NSWindowStyleMask, backing bufferingType: NSBackingStoreType, defer flag: Bool) {
        super.init(contentRect: contentRect, styleMask: style, backing: bufferingType, defer: flag);
        self.delegate = self;
    }
    
    func windowShouldClose(_ sender: Any) -> Bool {
        NSApplication.shared().terminate(nil);
        return true;
    }
}
