//
//  View_ClassListItem.swift
//  chacha
//
//  Created by guominglong on 2017/10/19.
//  Copyright © 2017年 SSdk. All rights reserved.
//

import Foundation
import SnapKit
class View_ClassListItem: GMLView {
    
    open var id:Int = 0;
    //课程名称
    fileprivate var tb_classNameLabel:NSTextField!;
    
    /**
     课程图片
     */
    fileprivate var img_ClassIcon:NSImageView!;
    
    /**
     进入教室按钮
     */
    fileprivate var btn_joinRoom:CurrentBtn!;
    
    /**
     邀请码复制按钮
     */
    fileprivate var btn_copyRoomCode:CurrentBtn!;
    
    /**
     创建教室按钮
     */
    fileprivate var btn_createRoom:CurrentBtn!;
    
    /**
     classroom信息
     */
    fileprivate var dataModel:RoomInfo?;
    
    /**
     课程名称输入框
     */
    fileprivate var tb_classNameInput:NSTextField!;
    override func gml_initialUI() {
        super.gml_initialUI();
        
        img_ClassIcon = NSImageView(frame: NSRect(x: 0, y: 0, width: 128, height: 128));
        img_ClassIcon.imageFrameStyle = .grayBezel;
        img_ClassIcon.imageScaling = .scaleNone;
        self.addSubview(img_ClassIcon);
        img_ClassIcon.snp.makeConstraints { (make) in
            make.width.height.equalTo(128);
            make.centerY.equalTo(self);
            make.left.equalTo(20);
        }
        img_ClassIcon.image = NSImage(named: NSImage.Name(rawValue: "classItemIcon"));
        
        tb_classNameLabel = NSTextField(frame: NSRect(x: 0, y: 0, width: 100, height: 20));
        tb_classNameLabel.textColor = GMLSkinManager.instance.currentFontColor2;
        tb_classNameLabel.font = FontEnum.commonFont;
        tb_classNameLabel.isSelectable = false;
        tb_classNameLabel.isEditable = false;
        tb_classNameLabel.isBordered = false;
        tb_classNameLabel.backgroundColor = NSColor.clear;
        self.addSubview(tb_classNameLabel)
        tb_classNameLabel.snp.makeConstraints { (make) in
            make.top.equalTo(img_ClassIcon);
            make.left.equalTo(img_ClassIcon.snp.right).offset(10);
            make.right.equalTo(self).offset(-10);
            make.height.equalTo(50);
        }
        
        tb_classNameInput = NSTextField(frame: NSRect(x: 0, y: 0, width: 100, height: 20));
        tb_classNameInput.textColor = GMLSkinManager.instance.currentFontColor2;
        tb_classNameInput.font = FontEnum.commonFont;
        self.addSubview(tb_classNameInput)
        tb_classNameInput.placeholderString = GMLLocalString.get("tb_classNameInputHolder");
        tb_classNameInput.snp.makeConstraints { (make) in
            make.top.equalTo(img_ClassIcon);
            make.left.equalTo(img_ClassIcon.snp.right).offset(10);
            make.right.equalTo(self).offset(-10);
            make.height.equalTo(50);
        }
        
        btn_joinRoom = GMLSkinManager.instance.getCurrentBtn2(NSRect(x: 0, y: 0, width: 120, height: 30));
        self.addSubview(btn_joinRoom);
        btn_joinRoom.snp.makeConstraints { (make) in
            make.width.equalTo(120);
            make.height.equalTo(30);
            make.right.equalTo(tb_classNameLabel);
            make.bottom.equalTo(img_ClassIcon);
        }
        btn_joinRoom.stringValue = GMLLocalString.get("btn_joinroom");
        btn_joinRoom.target = self;
        btn_joinRoom.action = #selector(joinroom);
        
        btn_copyRoomCode = GMLSkinManager.instance.getCurrentBtn2(NSRect(x: 0, y: 0, width: 120, height: 30));
        self.addSubview(btn_copyRoomCode);
        btn_copyRoomCode.snp.makeConstraints { (make) in
            make.width.equalTo(120);
            make.height.equalTo(30);
            make.right.equalTo(btn_joinRoom.snp.left).offset(-10);
            make.bottom.equalTo(img_ClassIcon);
        }
        btn_copyRoomCode.stringValue = GMLLocalString.get("btn_copyRoomCode");
        btn_copyRoomCode.target = self;
        btn_copyRoomCode.action = #selector(copyRoomCode);
        
        btn_createRoom = GMLSkinManager.instance.getCurrentBtn2(NSRect(x: 0, y: 0, width: 120, height: 30));
        self.addSubview(btn_createRoom);
        btn_createRoom.snp.makeConstraints { (make) in
            make.width.equalTo(120);
            make.height.equalTo(30);
            make.right.equalTo(tb_classNameLabel);
            make.bottom.equalTo(img_ClassIcon);
        }
        btn_createRoom.stringValue = GMLLocalString.get("btn_createRoom");
        btn_createRoom.target = self;
        btn_createRoom.action = #selector(createRoom);
    }
    @objc func joinroom(_ sender:AnyObject){
        NotificationCenter.default.post(name: Notify_JoinRoom, object: dataModel!.roomCode);
    }
    
    @objc func copyRoomCode(_ sender:AnyObject){
        let roomCode = dataModel!.roomCode;
        let board = NSPasteboard.general
        board.clearContents();
        board.declareTypes([NSPasteboard.PasteboardType.string], owner: self);
        board.setString(roomCode, forType: NSPasteboard.PasteboardType.string);
    }
    
    @objc func createRoom(_ sender:AnyObject){
        let reqMode = Model_createRoom_c2s();
        reqMode.roomImage = "";
        reqMode.roomName = tb_classNameInput.stringValue;
        reqMode.uid = GlobelInfo.instance.userInfo!.uid;
        NotificationCenter.default.post(name: Notify_CreateRoom, object: reqMode);
    }
//    override func gml_addEvents() {
//        
//    }
//    
//    override func gml_removeEvents() {
//        
//    }
    
    override func gml_fillUserInfo(_ userInfo: [AnyHashable : Any]?) {
        if let roominfo = userInfo?["model"] as? RoomInfo{
            //呈现显示教室信息模式
            dataModel = roominfo;
            tb_classNameLabel.stringValue = dataModel!.roomName;
            tb_classNameLabel.isHidden = false;
            tb_classNameInput.isHidden = true;
            btn_copyRoomCode.isHidden = false;
            btn_joinRoom.isHidden = false;
            btn_createRoom.isHidden = true;
        }else{
            //呈现添加教室模式
            tb_classNameInput.isHidden = false;
            tb_classNameLabel.isHidden = true;
            btn_copyRoomCode.isHidden = true;
            btn_joinRoom.isHidden = true;
            btn_createRoom.isHidden = false;
        }
    }
}
