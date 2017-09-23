
//  登录
//  View_login.swift
//  chacha
//
//  Created by guominglong on 2017/9/22.
//  Copyright © 2017年 SSdk. All rights reserved.
//

import Foundation
import SnapKit

class View_login: GMLView {
    
    fileprivate var tb_loginName:NSTextField!;//登录框
    fileprivate var tb_pwd:NSSecureTextField!;//密码框
    fileprivate var img_header:NSImageView!;//头像
    fileprivate var btn_login:CurrentBtn!;//登录按钮
    override init(frame frameRect: NSRect) {
        super.init(frame: frameRect);
        self.wantsLayer = true;
        self.layer?.backgroundColor = NSColor.red.cgColor;
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    override func gml_initialUI() {
        super.gml_initialUI();
        //账号框
        tb_loginName = NSTextField(frame: NSRect(x: (self.bounds.size.width - 150)/2.0, y: 20, width: 150, height: 30));
        tb_loginName.bezelStyle = .roundedBezel;
        tb_loginName.usesSingleLineMode = true;
        tb_loginName.font = FontEnum.commonFont;
        tb_loginName.placeholderString = GMLLocalString.get("loginPlaceHolder");
        tb_loginName.focusRingType = .none;//隐藏选中时的高亮框
        self.addSubview(tb_loginName);
        tb_loginName.snp.makeConstraints { (make) in
            make.height.equalTo(30);
            make.centerY.equalTo(self.snp_centerYWithinMargins).offset(-50);//.offset(50);//.offset(50);
        }
        
        //密码框
        tb_pwd = NSSecureTextField(frame: NSRect(x: (self.bounds.size.width - 150)/2.0, y: 60, width: 150, height: 30));
        tb_pwd.bezelStyle = .roundedBezel;//圆角边框
        tb_pwd.usesSingleLineMode = true;//单行
        tb_pwd.font = FontEnum.commonFont;
        tb_pwd.placeholderString = GMLLocalString.get("loginPWDPlaceHolder");
        tb_pwd.focusRingType = .none;//隐藏选中时的高亮框
        self.addSubview(tb_pwd);
        tb_pwd.snp.makeConstraints { (make) in
            make.height.equalTo(30);
            make.top.equalTo(tb_loginName.snp.bottom).offset(10);
        }
        
        //头像
        img_header = NSImageView(frame: NSRect(x: (self.bounds.size.width - 100)/2.0, y: 0, width: 100, height: 100));
        img_header.imageFrameStyle = .grayBezel;
        self.addSubview(img_header);
        img_header.snp.makeConstraints { (make) in
            make.width.equalTo(100);
            make.height.equalTo(100);
            make.bottom.equalTo(tb_loginName.snp.top).offset(-20);
        }
        
        //登录按钮
    }
}
