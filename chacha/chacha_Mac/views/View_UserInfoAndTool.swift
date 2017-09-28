//  课表左侧的用户信息工具面板
//  View_UserInfoAndTool.swift
//  chacha
//
//  Created by guominglong on 2017/9/27.
//  Copyright © 2017年 SSdk. All rights reserved.
//

import Foundation
class View_UserInfoAndTool: GMLView {
    fileprivate var img_headerbgShadow:NSImageView!;
    fileprivate var img_header:NSImageView!;
    fileprivate var tb_title:NSTextField!;
    fileprivate var tb_NickName:NSTextField!;
    fileprivate var v_right_line:NSView!;
    fileprivate var v_bottom_line:NSView!;
    fileprivate var isEditMode:Bool = false;
    
    fileprivate var btn_edit:CurrentBtn!;//编辑按钮
    override func gml_initialUI() {
        //头像的阴影
        img_headerbgShadow = NSImageView(frame: NSRect(x: 0, y: 0, width: 100, height: 100));
        img_headerbgShadow.imageScaling = .scaleNone;
        img_headerbgShadow.imageFrameStyle = .grayBezel;
        //不开启layer就显示不出来阴影
        img_headerbgShadow.wantsLayer = true;
        img_headerbgShadow.layer?.backgroundColor = CGColor(red: 1, green: 1, blue: 1, alpha: 1);
        img_headerbgShadow.layer?.cornerRadius = 5;
        self.addSubview(img_headerbgShadow);
        img_headerbgShadow.snp.makeConstraints { (make) in
            make.width.equalTo(100);
            make.height.equalTo(100);
            make.centerY.equalTo(self);
            make.leading.equalTo(self.snp.leftMargin).offset(40);
        }
        let sha = NSShadow();
        sha.shadowBlurRadius = 20;
        sha.shadowColor = NSColor(red: 0, green: 0, blue: 0, alpha: 0.8);
        img_headerbgShadow.shadow = sha;
        
        
        //头像
        img_header = NSImageView(frame: NSRect(x: 0, y: 0, width: 100, height: 100));
        img_header.imageScaling = .scaleNone;
        img_header.imageFrameStyle = .grayBezel;
        img_header.wantsLayer = true;
        img_header.layer?.cornerRadius = 5;
        img_header.layer?.backgroundColor = CGColor(red: 1, green: 1, blue: 1, alpha: 0.3);
        self.addSubview(img_header);
        img_header.snp.makeConstraints { (make) in
            make.width.equalTo(100);
            make.height.equalTo(100);
            make.centerY.equalTo(self);
            make.leading.equalTo(self.snp.leftMargin).offset(40);
        }
        
        if let headerStr = GlobelInfo.instance.userInfo?.headerImage{
            if let headUrl = URL(string: headerStr){
                img_header.image = NSImage(contentsOf: headUrl);
            }
        }
        if img_header.image == nil{
            img_header.image = NSImage(named: "test");
        }
        
        //title文本框
        tb_title = NSTextField(labelWithString: GMLLocalString.get("classlist_title"));
        tb_title.isEditable = false;
        tb_title.isBordered = false;
        tb_title.alignment = .center;
        tb_title.font = FontEnum.titleFont;
        tb_title.textColor = GMLSkinManager.instance.currentFontColor2
        tb_title.backgroundColor = NSColor.clear;
        self.addSubview(tb_title);
        tb_title.snp.makeConstraints { (make) in
            make.top.equalTo(self.snp.topMargin).offset(3);
            make.centerX.equalTo(self);
        }
        //用户昵称文本框
        tb_NickName = NSTextField(frame:NSRect(x: 0, y: 0, width: 100, height: 25));
        tb_NickName.alignment = .center;
        tb_NickName.cell?.wraps = false;
        tb_NickName.cell?.isScrollable = true;
        tb_NickName.lineBreakMode = .byTruncatingTail;
        tb_NickName.font = FontEnum.commonFont;
        tb_NickName.textColor = GMLSkinManager.instance.currentFontColor2;
        tb_NickName.stringValue = GlobelInfo.instance.userInfo?.nickName ?? "Teacher";
        self.addSubview(tb_NickName);
        tb_NickName.snp.makeConstraints { (make) in
            make.width.equalTo(100);
            make.height.equalTo(25);
            make.top.equalTo(img_header.snp.bottom).offset(8);
            make.centerX.equalTo(img_header);
        }
        
        //底部分割线
        v_bottom_line = NSView(frame: NSRect(x: 0, y: 0, width: 100, height: 1));
        v_bottom_line.wantsLayer = true;
        v_bottom_line.layer?.backgroundColor = GMLSkinManager.instance.fengexianColor;
        if NSScreen.main() != nil{
            v_bottom_line.layer?.contentsScale = NSScreen.main()!.backingScaleFactor
        }
        self.addSubview(v_bottom_line);
        v_bottom_line.snp.makeConstraints { (make) in
            make.left.equalTo(self).offset(10);
            make.right.equalTo(self).offset(-10);
            make.height.equalTo(1);
            make.bottom.equalTo(self.snp.bottom).offset(-1);
        }
        //右侧分割线
        v_right_line = NSView(frame: NSRect(x: 0, y: 0, width: 1, height: 100));
        v_right_line.wantsLayer = true;
        v_right_line.layer?.backgroundColor = GMLSkinManager.instance.fengexianColor;
        if NSScreen.main() != nil{
            v_right_line.layer?.contentsScale = NSScreen.main()!.backingScaleFactor
        }
        self.addSubview(v_right_line);
        v_right_line.snp.makeConstraints { (make) in
            make.width.equalTo(1);
            make.right.equalTo(self).offset(-125);
            make.top.equalTo(self).offset(20);
            make.bottom.equalTo(self).offset(-20);
        }
        
        //编辑按钮
        btn_edit = GMLSkinManager.instance.getCurrentBtn2(NSRect(x: 0, y: 0, width: 80, height: 25));
        btn_edit.stringValue = GMLLocalString.get("btn_edit");
        self.addSubview(btn_edit);
        btn_edit.snp.makeConstraints { (make) in
            make.leading.equalTo(v_right_line).offset(10);
            make.width.equalTo(80);
            make.height.equalTo(25);
            make.top.equalTo(v_right_line);
        }
        btn_edit.action = #selector(onbtn_editCLICK);
        btn_edit.target = self;
        //设置为显示状态
        swapEditMode(isEditMode);
        
        //向服务器请求最新的用户信息
        getuserInfo()
        
        gml_addEvents();
    }
    
    
    open func onbtn_editCLICK(_ sender:Any){
        isEditMode = !isEditMode;
        swapEditMode(isEditMode);
        if isEditMode == false{
            if let uid = GlobelInfo.instance.userInfo?.uid{
                //提交更新内容
                let c2sModel = Model_updateUserInfo_c2s();
                c2sModel.headerImage = "";
                c2sModel.nickName = tb_NickName.stringValue;
                c2sModel.uid = uid;
                GMLSocketManager.instance.sendMsgToServer(model: c2sModel);
            }
            
            btn_edit.stringValue = GMLLocalString.get("btn_edit");
        }else{
            btn_edit.stringValue = GMLLocalString.get("btn_edit_complete");
        }
    }
    override func gml_addEvents() {
        NotificationCenter.default.addObserver(self, selector: #selector(onUpdateUserInfoCallBack), name: SOCKET_UPDATEUSERINFO, object: nil)
        NotificationCenter.default.addObserver(self, selector: #selector(ongetUserInfoCallBack), name: SOCKET_GETUSERINFO, object: nil)
    }
    
    override func gml_removeEvents() {
        NotificationCenter.default.removeObserver(self);
    }
    
    /**
     更新用户信息回调
     */
    func onUpdateUserInfoCallBack(_ notify:NSNotification){
        if let s2cModel = notify.object as? Model_updateUserInfo_s2c{
            if s2cModel.code == 0{
                Swift.print("更新成功");
                //更新本地全局数据
                GlobelInfo.instance.userInfo?.nickName = tb_NickName.stringValue;
            }
        }
    }
    
    //向服务器请求最新的用户信息
    func getuserInfo(){
        if let uid = GlobelInfo.instance.userInfo?.uid{
            let c2sModel = Model_getUserInfo_c2s();
            c2sModel.uid = uid;
            GMLSocketManager.instance.sendMsgToServer(model: c2sModel);
        }
    }
    /**
     获取用户信息回调
     */
    func ongetUserInfoCallBack(_ notify:NSNotification){
        if let s2cModel = notify.object as? Model_getUserInfo_s2c{
            if s2cModel.code == 0{
                Swift.print("获取用户信息成功");
                //更新本地全局数据
                GlobelInfo.instance.userInfo?.nickName = s2cModel.nickName;
                tb_NickName.stringValue = s2cModel.nickName;
            }
        }
    }
    
    /**
     切换至编辑模式， true为编辑模式， false为一般模式
     */
    fileprivate func swapEditMode(_ b:Bool){
        if b{
            tb_NickName.isSelectable = true;
            tb_NickName.isEditable = true;
            tb_NickName.backgroundColor = NSColor.white;
            tb_NickName.focusRingType = .default;
        }else{
            tb_NickName.selectText(nil);
            tb_NickName.isSelectable = false;
            tb_NickName.isEditable = false;
            tb_NickName.backgroundColor = NSColor.clear;
            tb_NickName.isBordered = false;
            self.window?.makeFirstResponder(nil);
        }
    
    }
}
