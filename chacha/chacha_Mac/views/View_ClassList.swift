//  课表
//  View_ClassList.swift
//  chacha
//
//  Created by guominglong on 2017/9/27.
//  Copyright © 2017年 SSdk. All rights reserved.
//

import Foundation
class View_ClassList: GMLView {
    //MARK:进入教室部分
    fileprivate var tb_joinRoomTitle:NSTextField!;
    fileprivate var tb_joinRoom:NSTextField!;
    fileprivate var btn_joinRoom:CurrentBtn!;
    fileprivate var v_fenge:NSView!;
    //MARK:课表部分
    fileprivate var tb_classListTitle:NSTextField!;
    //教室信息数组
    fileprivate var classlistArr:[RoomInfo] = [RoomInfo]();
    override func gml_initialUI() {
        //进入教室部分---------------------
        tb_joinRoomTitle = NSTextField(labelWithString: GMLLocalString.get("tb_joinRoomTitle"));
        tb_joinRoomTitle.font = FontEnum.titleFont;
        tb_joinRoomTitle.textColor = GMLSkinManager.instance.currentFontColor2;
        self.addSubview(tb_joinRoomTitle);
        tb_joinRoomTitle.snp.makeConstraints { (make) in
            make.top.equalTo(self).offset(5);
            make.centerX.equalTo(self);
        }
        
        tb_joinRoom = NSTextField(frame: NSRect(x: 0, y: 0, width: 300, height: 30));
        tb_joinRoom.focusRingType = .none;
        tb_joinRoom.bezelStyle = .roundedBezel;
        tb_joinRoom.font = FontEnum.commonFont;
        tb_joinRoom.textColor = GMLSkinManager.instance.currentFontColor;
        self.addSubview(tb_joinRoom);
        tb_joinRoom.snp.makeConstraints { (make) in
            make.top.equalTo(tb_joinRoomTitle.snp.bottom).offset(5);
            make.width.equalTo(300);
            make.height.equalTo(30);
            make.centerX.equalTo(self).offset(-60);
        }
        
        btn_joinRoom = GMLSkinManager.instance.getCurrentBtn2(NSRect(x: 0, y: 0, width: 100, height: 30));
        btn_joinRoom.stringValue = GMLLocalString.get("btn_joinroom");
        self.addSubview(btn_joinRoom);
        btn_joinRoom.snp.makeConstraints { (make) in
            make.width.equalTo(100);
            make.height.equalTo(30);
            make.top.equalTo(tb_joinRoom);
            make.left.equalTo(tb_joinRoom.snp.right).offset(20);
        }
        btn_joinRoom.target = self;
        btn_joinRoom.action = #selector(joinRoom);
        
        v_fenge = NSView(frame: NSRect(x: 0, y: 0, width: 100, height: 1));
        v_fenge.wantsLayer = true;
        v_fenge.layer?.backgroundColor = GMLSkinManager.instance.fengexianColor;
        if NSScreen.main() != nil{
            v_fenge.layer?.contentsScale = NSScreen.main()!.backingScaleFactor
        }
        self.addSubview(v_fenge);
        v_fenge.snp.makeConstraints { (make) in
            make.left.equalTo(self).offset(10);
            make.right.equalTo(self).offset(-10);
            make.height.equalTo(1);
            make.bottom.equalTo(btn_joinRoom).offset(10);
        }
        //课表部分---------------------
        tb_classListTitle = NSTextField(labelWithString: GMLLocalString.get("tb_classListTitle"));
        tb_classListTitle.font = FontEnum.titleFont;
        tb_classListTitle.textColor = GMLSkinManager.instance.currentFontColor2;
        self.addSubview(tb_classListTitle);
        tb_classListTitle.snp.makeConstraints { (make) in
            make.top.equalTo(v_fenge).offset(5);
            make.centerX.equalTo(self);
        }
        
        gml_addEvents();
    }
    
    override func gml_addEvents() {
        NotificationCenter.default.addObserver(self, selector: #selector(getClassListCallback), name: SOCKET_GETROOMSINFOBYUSER, object: nil);
        NotificationCenter.default.addObserver(self, selector: #selector(createRoomCallback), name: SOCKET_CREATEROOM, object: nil)
        NotificationCenter.default.addObserver(self, selector: #selector(deleteRoomCallback), name: SOCKET_DELETEROOM, object: nil)
    }
    
    override func gml_removeEvents() {
        NotificationCenter.default.removeObserver(self);
    }
    
    /**
     获取课程列表信息回调
     */
    func getClassListCallback(_ notify:NSNotification){
        if let s2cModel = notify.object as? Model_getRoomsInfoByUser_s2c{
            if s2cModel.code == 0{
                Swift.print("获取课表成功");
            }else{
                Swift.print("获取课表失败.\(s2cModel.faildError)");
            }
        }
    }
    
    /**
     创建教室回调
     */
    func createRoomCallback(_ notify:NSNotification){
        if let s2cModel = notify.object as? Model_createRoom_s2c{
            if s2cModel.code == 0{
                Swift.print("创建教室成功");
            }else{
                Swift.print("创建教室失败.\(s2cModel.faildError)");
            }
        }
    }
    
    /**
     创建教室回调
     */
    func deleteRoomCallback(_ notify:NSNotification){
        if let s2cModel = notify.object as? Model_deleteRoom_s2c{
            if s2cModel.code == 0{
                Swift.print("删除教室成功");
            }else{
                Swift.print("删除教室失败.\(s2cModel.faildError)");
            }
        }
    }
    
    /**
     进入教室
     */
    func joinRoom(_ sender:Any){
    
    }
}

