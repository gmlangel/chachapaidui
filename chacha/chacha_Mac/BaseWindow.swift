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
        self.minSize = NSSize(width: 680, height: 500);
        self.titlebarAppearsTransparent = true;
        self.styleMask = NSWindowStyleMask(rawValue: NSWindowStyleMask.closable.rawValue | NSWindowStyleMask.fullSizeContentView.rawValue | NSWindowStyleMask.miniaturizable.rawValue | NSWindowStyleMask.resizable.rawValue | NSWindowStyleMask.titled.rawValue);
        self.hasShadow = true;
        self.titleVisibility = .hidden;
    }
    
    func windowShouldClose(_ sender: Any) -> Bool {
        NSApplication.shared().terminate(nil);
        return true;
    }
}
