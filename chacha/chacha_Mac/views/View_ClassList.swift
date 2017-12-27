//  课表
//  View_ClassList.swift
//  chacha
//
//  Created by guominglong on 2017/9/27.
//  Copyright © 2017年 SSdk. All rights reserved.
//

import Foundation
let GMLEvent_JoinRoom:String = "GMLEvent.JoinRoom";
let Notify_JoinRoom:Notification.Name = Notification.Name.init("Notify_JoinRoom");
let Notify_CreateRoom:Notification.Name = Notification.Name.init("Notify_CreateRoom");
class View_ClassList: GMLView {
    //MARK:进入教室部分
    fileprivate var tb_joinRoomTitle:NSTextField!;
    fileprivate var tb_joinRoom:NSTextField!;
    fileprivate var btn_joinRoom:CurrentBtn!;
    fileprivate var v_fenge:NSView!;
    //MARK:课表部分
    fileprivate var tb_classListTitle:NSTextField!;
    fileprivate var v_loading:NSProgressIndicator!;
    fileprivate var classlistItems:[View_ClassListItem] = [View_ClassListItem]();
    fileprivate var v_classScroll:NSScrollView!;
    fileprivate var v_classScrollDocument:NSView!;
    //教室信息数组
    
    
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
        if NSScreen.main != nil{
            v_fenge.layer?.contentsScale = NSScreen.main!.backingScaleFactor
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
        
        v_loading = NSProgressIndicator(frame: NSRect(x: 0, y: 0, width: 40, height: 40));
        v_loading.style = .spinning;
        self.addSubview(v_loading);
        v_loading.snp.makeConstraints { (make) in
            make.width.height.equalTo(40);
            make.centerX.equalTo(self.snp.centerX);
            make.centerY.equalTo(tb_classListTitle.frame.origin.y / 2 + 20);
        }
        v_loading.isHidden = true;
        
        v_classScroll = NSScrollView(frame: NSRect(x: 0, y: 0, width: 100, height: 100));
        v_classScroll.autohidesScrollers = true;
        v_classScroll.hasVerticalScroller = true;
        v_classScroll.drawsBackground = false;
        self.addSubview(v_classScroll);
        v_classScroll.snp.makeConstraints { (make) in
            make.top.equalTo(tb_classListTitle.snp.bottom).offset(5);
            make.bottom.equalTo(self).offset(-5);
            make.left.equalTo(self).offset(10);
            make.right.equalTo(self).offset(-10);
        }
        
        
        let item = createClissListItem(nil);//创建一个课程添加item
        classlistItems.append(item);
        
        
        
        v_classScrollDocument = NSView(frame: NSRect(x: 0, y: 0, width: 100, height: 100));
        v_classScroll.documentView = v_classScrollDocument;
        v_classScrollDocument.snp.makeConstraints { (make) in
            make.width.equalTo(v_classScroll);
            make.height.equalTo(classlistItems.count * 150);
            make.bottom.equalTo(0);
            make.left.equalTo(0);
        }
        
        
        //填充课程列表
        fillClassList()
        
        
        gml_addEvents();
    }
    
    fileprivate func fillClassList(){
        for subV in v_classScrollDocument.subviews{
            subV.removeFromSuperview();
            (subV as! View_ClassListItem).gml_destroy();
        }
        let j = classlistItems.count;
        v_classScrollDocument.snp.removeConstraints();
        v_classScrollDocument.snp.makeConstraints { (make) in
            make.width.equalTo(v_classScroll);
            make.height.equalTo(classlistItems.count * 150);
            make.bottom.equalTo(0);
            make.left.equalTo(0);
        }
        for i:Int in 0 ..< j{
            let item = classlistItems[j - i - 1];
            item.id = j - i - 1;
            v_classScrollDocument.addSubview(item);
            item.snp.makeConstraints { (make) in
                //make.top.equalTo((make.view as View_ClassListItem)*150);
                make.width.equalTo(v_classScrollDocument);
                make.height.equalTo(150);
               // make.left.equalTo(0);
            }
            item.frame.origin = CGPoint(x: 0, y: item.id * 150);
        }
        
    }
    
    fileprivate func createClissListItem(_ model:RoomInfo?) -> View_ClassListItem{
        let item = View_ClassListItem(frame: NSRect(x: 0, y: 0, width: 300, height: 150));
        if model != nil{
            item.gml_fillUserInfo(["model":model!]);
        }else{
            item.gml_fillUserInfo(nil);
        }
        
        return item;
    }
    
    override func gml_addEvents() {
        NotificationCenter.default.addObserver(self, selector: #selector(getClassListCallback), name: SOCKET_GETROOMSINFOBYUSER, object: nil);
        NotificationCenter.default.addObserver(self, selector: #selector(createRoomCallback), name: SOCKET_CREATEROOM, object: nil)
        NotificationCenter.default.addObserver(self, selector: #selector(deleteRoomCallback), name: SOCKET_DELETEROOM, object: nil)
        NotificationCenter.default.addObserver(self, selector: #selector(onJoinNotification), name: Notify_JoinRoom, object: nil)
        NotificationCenter.default.addObserver(self, selector: #selector(onCreateRoomNotification), name: Notify_CreateRoom, object: nil)
    }
    
    override func gml_removeEvents() {
        NotificationCenter.default.removeObserver(self);
    }
    
    /**
     获取课程列表信息回调
     */
    @objc func getClassListCallback(_ notify:NSNotification){
        //隐藏loading
        v_loading.stopAnimation(nil);
        v_loading.isHidden = true;
        if let s2cModel = notify.object as? Model_getRoomsInfoByUser_s2c{
            if s2cModel.code == 0{
                Swift.print("获取课表成功");
                let classRoomInfo = s2cModel.roomInfoArr;
                //清空原有的课程数据
                while classlistItems.count > 1 {
                    classlistItems.removeLast();
                }
                let j = classRoomInfo.count;
                for i:Int in 0 ..< j{
                    classlistItems.append(createClissListItem(classRoomInfo[i]));
                }
                //填充课表
                fillClassList();
            }else{
                Swift.print("获取课表失败.\(s2cModel.faildError)");
            }
        }
    }
    
    /**
     响应classlistItem的创建教室请求
     */
    @objc func onCreateRoomNotification(_ notify:NSNotification){
        if let mode = notify.object as? Model_createRoom_c2s{
            GMLSocketManager.instance.sendMsgToServer(model: mode);
        }
    }
    
    /**
     创建教室回调
     */
    @objc func createRoomCallback(_ notify:NSNotification){
        if let s2cModel = notify.object as? Model_createRoom_s2c{
            if s2cModel.code == 0{
                Swift.print("创建教室成功");
                //刷新课表
                updateClassList();
            }else{
                Swift.print("创建教室失败.\(s2cModel.faildError)");
            }
        }
    }
    
    /**
     创建教室回调
     */
    @objc func deleteRoomCallback(_ notify:NSNotification){
        if let s2cModel = notify.object as? Model_deleteRoom_s2c{
            if s2cModel.code == 0{
                Swift.print("删除教室成功");
                //刷新课表
                updateClassList();
            }else{
                Swift.print("删除教室失败.\(s2cModel.faildError)");
            }
        }
    }
    
    /**
     进入教室
     */
    @objc func joinRoom(_ sender:Any){
        execJoinRoom(tb_joinRoom.stringValue);
    }
    
    func execJoinRoom(_ roomCode:String){
        if roomCode != ""{
            self.dispatchEvent(GMLEvent(eventType: GMLEvent_JoinRoom, target: nil, data: roomCode));
        }
    }
    
    /**
     响应classlistItem发来的进入教室请求
     */
    @objc func onJoinNotification(_ notify:Notification){
        if let roomCode = notify.object as? String{
            execJoinRoom(roomCode);
        }
    }
    
    /**
     刷新课程
     */
    func updateClassList(){
        if let uid = GlobelInfo.instance.userInfo?.uid{
            let req = Model_getRoomsInfoByUser_c2s();
            req.uid = uid;
            GMLSocketManager.instance.sendMsgToServer(model: req);
            v_loading.isHidden = false;
            v_loading.startAnimation(nil);
        }
    }
    
    override func viewDidMoveToWindow() {
        if window != nil {
            //刷新课表
            updateClassList();
        }
    }
}

