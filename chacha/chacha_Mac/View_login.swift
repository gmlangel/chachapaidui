
//  登录
//  View_login.swift
//  chacha
//
//  Created by guominglong on 2017/9/22.
//  Copyright © 2017年 SSdk. All rights reserved.
//

import Foundation
class View_login: GMLView {
    
    fileprivate var tb_loginName:NSTextField!;
    fileprivate var tb_pwd:NSSecureTextField!;
    override init(frame frameRect: NSRect) {
        super.init(frame: frameRect);
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    override func gml_initialUI() {
        super.gml_initialUI();
        tb_loginName = NSTextField(frame: NSRect(x: 20, y: 20, width: 150, height: 30));
        tb_loginName.bezelStyle = .roundedBezel;
        tb_loginName.usesSingleLineMode = true;
        tb_loginName.font = FontEnum.commonFont;
        tb_loginName.placeholderString = GMLLocalString.get("loginPlaceHolder");
        self.addSubview(tb_loginName);
        
        
        tb_pwd = NSSecureTextField(frame: NSRect(x: 20, y: 20, width: 150, height: 30));
        tb_pwd.bezelStyle = .roundedBezel;
        tb_pwd.usesSingleLineMode = true;
        tb_pwd.font = FontEnum.commonFont;
        tb_pwd.placeholderString = GMLLocalString.get("loginPWDPlaceHolder");
        self.addSubview(tb_pwd);

    }
}
