//
//  View_huanying.swift
//  chacha
//
//  Created by guominglong on 2017/9/24.
//  Copyright © 2017年 SSdk. All rights reserved.
//

import Foundation
import AppKit
import SnapKit
class View_huanying: GMLView {
    fileprivate var tb_huanying:NSTextField!;
    override func gml_initialUI() {
        super.gml_initialUI();
        
        tb_huanying = NSTextField(frame: NSRect(x: 0, y: 0, width: 0, height: 50));
        tb_huanying.alignment = .center;
        tb_huanying.isEditable = false;
        tb_huanying.isSelectable = false;
        tb_huanying.usesSingleLineMode = true;
        tb_huanying.cell?.wraps = false;
        tb_huanying.cell?.isScrollable = true;
        tb_huanying.backgroundColor = NSColor.clear;
        tb_huanying.isBordered = false;
        tb_huanying.textColor = GMLSkinManager.instance.currentFontColor;
        tb_huanying.font = FontEnum.huanyingTextFont;
        tb_huanying.stringValue = GMLLocalString.get("huanying_title");
        self.addSubview(tb_huanying);
        tb_huanying.snp.makeConstraints { (make) in
            make.width.equalTo(self);
            make.height.equalTo(50);
            make.centerY.equalTo(self);
        }
    }
}
