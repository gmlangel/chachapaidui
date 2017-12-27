//
//  MainViewController.swift
//  chacha
//
//  Created by guominglong on 2017/9/22.
//  Copyright © 2017年 SSdk. All rights reserved.
//

import Foundation
import SnapKit
import pop
class MainViewController: NSViewController,POPAnimationDelegate {
    //欢迎视图
    fileprivate lazy var huanyingV:View_huanying = {
        let v = View_huanying(frame: NSRect(x: 0, y: 0, width: 300, height: 300));
        return v;
    }();
    
    //登录视图
    fileprivate lazy var loginV:View_login = {
        let v = View_login(frame: NSRect(x: 0, y: 0, width: 200, height: self.view.frame.size.height));
        return v;
    }();
    
    //用户信息及工具条面板
    fileprivate lazy var userInfoV:View_UserInfoAndTool = {
        let v = View_UserInfoAndTool(frame: NSRect(x: 0, y: 0, width: 100, height: 100));
        return v;
    }();
    
    //课表视图
    fileprivate lazy var classlistV:View_ClassList = {
        let v = View_ClassList(frame: NSRect(x: 0, y: 0, width: 200, height: 200));
        return v;
    }();
    
    //教学区域视图
    fileprivate lazy var teachV:View_TeachingContainer = {
        let v = View_TeachingContainer(frame: NSRect(x: 0, y: 0, width: 200, height: 200));
        return v;
    }();
    
    //文本聊天视图
    fileprivate lazy var chatV:View_ChatView = {
        let v = View_ChatView(frame: NSRect(x: 0, y: 0, width: 200, height: 200));
        return v;
    }();
    
    //媒体视频容器视图
    fileprivate lazy var mediaV:View_MediaContainer = {
        let v = View_MediaContainer(frame: NSRect(x: 0, y: 0, width: 200, height: 200));
        return v;
    }();
    
    
    /**
     主体内容页面的容器
     */
    fileprivate var containerV:NSView!;
    fileprivate var isAniing:Bool = false;//是否在执行动画中
    fileprivate var dispalyMode:DisplayMode = .huanying;//当前显示的模块 模式
    override func viewDidLoad() {
        super.viewDidLoad();
        self.view.wantsLayer = true;
        self.view.layer?.backgroundColor = GMLSkinManager.instance.mainBackgroundColor;
        //添加窗口resize处理
        NotificationCenter.default.addObserver(self, selector: #selector(ongWindowResize), name: NSWindow.didResizeNotification, object: nil);
        //内容容器窗口
        containerV = NSView();
        containerV.wantsLayer = true;
        containerV.layer?.backgroundColor = GMLSkinManager.instance.mainForegroundColor;
        let sha = NSShadow();
        sha.shadowColor = NSColor(white: 0, alpha: 0.8);
        sha.shadowBlurRadius = 20;
        containerV.shadow = sha;
        self.view.addSubview(containerV);
        //显示登录界面
        swapDisplayMode(.huanying);
    }
    
    
    
    @objc open func ongWindowResize(_ notify:NSNotification){
        if let _ = self.view.window{
            self.view.needsUpdateConstraints = true;
        }
    }
    
    fileprivate func createShowAni() -> POPAnimation{
        let showAni:POPBasicAnimation! = POPBasicAnimation.init(propertyNamed: kPOPViewAlphaValue)
        showAni.duration = 0.4;
        showAni.delegate = self;
        showAni.toValue = 1;
        return showAni;
    }
    
    fileprivate func createChangeFrameAni(_ wantFrame:NSRect) -> POPAnimation{
        let cfAni:POPBasicAnimation! = POPBasicAnimation.init(propertyNamed: kPOPViewFrame);
        cfAni.duration = 0.3;
        cfAni.delegate = self;
        cfAni.toValue = wantFrame;
        return cfAni;
    }
    
    /**
     显示或隐藏欢迎模式
     */
    fileprivate func showOrHideHuanyingMode(b:Bool){
        if b == true{
            //显示
            loginV.alphaValue = 0;
            huanyingV.alphaValue = 0;
            self.view.addSubview(loginV);
            //添加监听
            loginV.addEventListener(GMLEvent_Logined,execFunc: onlogined);
            //添加约束
            loginV.snp.makeConstraints { (make) in
                make.height.equalTo(self.view);
            }
            containerV.addSubview(huanyingV);
            huanyingV.snp.makeConstraints { (make) in
                make.width.equalTo(300);
                make.height.equalTo(300);
                make.centerY.equalTo(containerV);
                make.centerX.equalTo(containerV.snp.centerX);
            }
            let ani1 = createShowAni();
            ani1.name = "loginVAni";
            ani1.beginTime = CACurrentMediaTime() + 0.5;
            let ani2 = createShowAni();
            ani2.name = "huanyingAni";
            ani2.beginTime = CACurrentMediaTime() + 1;
            loginV.pop_add(ani1, forKey: "loginVAni");
            huanyingV.pop_add(ani2, forKey: "huanyingAni");
        }else{
            //隐藏
            loginV.snp.removeConstraints();
            huanyingV.snp.removeConstraints();
            loginV.removeFromSuperview();
            huanyingV.removeFromSuperview();
            loginV.pop_removeAllAnimations();
            huanyingV.pop_removeAllAnimations();
        }
    }
    
    /**
     显示或隐藏课表模式
     */
    fileprivate func showOrHideClassLisMode(b:Bool){
        if b == true{
            //改变containerV的区域大小
            let changeSizeAni = createChangeFrameAni(self.view.bounds);
            changeSizeAni.name = "containerVChangeSize";
            containerV.pop_add(changeSizeAni, forKey: "containerVChangeSize");
            //显示
            userInfoV.alphaValue = 0;
            classlistV.alphaValue = 0;
            containerV.addSubview(userInfoV);
            //添加监听
            classlistV.addEventListener(GMLEvent_JoinRoom,execFunc: onJoinRoom);
            //添加约束
            userInfoV.snp.makeConstraints { (make) in
                make.height.equalTo(180);
                make.width.equalTo(containerV);
                make.top.equalTo(containerV.snp.topMargin)
            }
            containerV.addSubview(classlistV);
            classlistV.snp.makeConstraints { (make) in
                make.width.equalTo(containerV);
                make.top.equalTo(userInfoV.snp.bottom);
                make.bottom.equalTo(0);
            }
            let ani1 = createShowAni();
            ani1.name = "userInfoVAni";
            ani1.beginTime = CACurrentMediaTime() + 0.5;
            let ani2 = createShowAni();
            ani2.name = "classlistVAni";
            ani2.beginTime = CACurrentMediaTime() + 1;
            userInfoV.pop_add(ani1, forKey: "userInfoVAni");
            classlistV.pop_add(ani2, forKey: "classlistVAni");
        }else{
            //隐藏
            userInfoV.snp.removeConstraints();
            classlistV.snp.removeConstraints();
            userInfoV.removeFromSuperview();
            classlistV.removeFromSuperview();
            userInfoV.pop_removeAllAnimations();
            classlistV.pop_removeAllAnimations();
        }
    }
    
    /**
     显示或隐藏课中模式
     */
    fileprivate func showOrHideClassroomMode(b:Bool){
        if b == true{
            let changeSizeAni = createChangeFrameAni(NSRect(x: 0, y: 0, width: self.view.bounds.size.width - 400, height: self.view.bounds.size.height));
            changeSizeAni.name = "containerVChangeSize";
            containerV.pop_add(changeSizeAni, forKey: "containerVChangeSize");
            //显示 教学区域
            teachV.alphaValue = 0;
            teachV.wantsLayer = true;
            teachV.layer?.backgroundColor = NSColor.brown.cgColor;
            containerV.addSubview(teachV);
            //添加约束
            teachV.snp.makeConstraints { (make) in
                make.height.equalTo(containerV);
                make.width.equalTo(containerV);
            }
            let ani1 = createShowAni();
            ani1.name = "teachVAni";
            ani1.beginTime = CACurrentMediaTime() + 0.5;
            teachV.pop_add(ani1, forKey: "teachVAni");
            
            //添加视频区域
            mediaV.alphaValue = 0;
            mediaV.wantsLayer = true;
            mediaV.layer?.backgroundColor = NSColor.red.cgColor;
            self.view.addSubview(mediaV);
            mediaV.snp.makeConstraints({ (make) in
                make.width.equalTo(400);
                make.height.equalTo(self.view.snp.height);
                make.right.equalTo(self.view.snp_rightMargin);
                make.bottom.equalTo(self.view.snp_bottomMargin);
            })
            let ani2 = createShowAni();
            ani2.name = "mediaVAni";
            ani2.beginTime = CACurrentMediaTime() + 1;
            mediaV.pop_add(ani2, forKey: "mediaVAni");
            //添加聊天区域
        }else{
            
            //隐藏
            teachV.snp.removeConstraints();
            teachV.removeFromSuperview();
            teachV.pop_removeAllAnimations();
            
            mediaV.snp.removeConstraints();
            mediaV.removeFromSuperview();
            mediaV.pop_removeAllAnimations();
            
        }
    }
    
    /**
     切换 欢迎页面  课表页面  课中页面
     */
    open func swapDisplayMode(_ mode:DisplayMode){
        //隐藏当前的页面
        switch dispalyMode {
        case .classlist:
            showOrHideClassLisMode(b: false);
            break;
        case .classroom:
            showOrHideClassroomMode(b: false);
            break;
        case .huanying:
            showOrHideHuanyingMode(b: false);
            break;
        default:
            break;
        }
        dispalyMode = mode;
        //显示新页面
        switch mode {
        case .classlist:
            showOrHideClassLisMode(b: true);
            break;
        case .classroom:
            showOrHideClassroomMode(b: true);
            break;
        case .huanying:
            showOrHideHuanyingMode(b: true);
            break;
        default:
            break;
        }
    }
    
    func pop_animationDidStop(_ anim: POPAnimation!, finished: Bool) {
        isAniing = false;
        if anim.name == "loginVAni"{
            loginV.pop_removeAllAnimations();
        }else if anim.name == "huanyingAni"{
            huanyingV.pop_removeAllAnimations();
        }else if anim.name == "userInfoVAni"{
            userInfoV.pop_removeAllAnimations();
        }else if anim.name == "classlistVAni"{
            classlistV.pop_removeAllAnimations();
        }else if anim.name == "containerVChangeSize"{
            containerV.pop_removeAllAnimations();
        }else if anim.name == "teachVAni"{
            teachV.pop_removeAllAnimations();
        }else if anim.name == "mediaVAni"{
            mediaV.pop_removeAllAnimations();
        }
    }
    
    

    override func updateViewConstraints() {
        super.updateViewConstraints();
        if isAniing {
            return;
        }
        if dispalyMode == .huanying,let win = self.view.window{
            //欢迎页面模式
            containerV.frame = NSRect(x: loginV.frame.maxX, y: 0, width: win.frame.size.width - loginV.frame.maxX, height: win.frame.size.height);
        }else if dispalyMode == .classlist,let win = self.view.window{
            //课表页面模式
            containerV.frame = NSRect(x: 0, y: 0, width: win.frame.size.width, height: win.frame.size.height);
        }else if dispalyMode == .classroom,let win = self.view.window{
            //课中模式
            containerV.frame = NSRect(x: 0, y: 0, width: win.frame.size.width - 400, height: win.frame.size.height);
        }
    }
    override func viewDidAppear() {
        super.viewDidAppear();
        self.view.window?.makeFirstResponder(nil);
    }
    override func viewDidDisappear() {
        NotificationCenter.default.removeObserver(self);
    }
    
    /**
     登录完毕
     */
    func onlogined(e:GMLEvent){
        //切换到 课表模式
        swapDisplayMode(.classlist);
    }
    
    /**
     进入教室
     */
    func onJoinRoom(e:GMLEvent){
        
        if let roomCode = e.data as? String{
            //切换到 课中模式
            swapDisplayMode(.classroom);
            //添加教室内的相关监听
            NotificationCenter.default.addObserver(self, selector: #selector(onJoinRoomComplete), name: SOCKET_JOINROOM, object: nil);//进入教室完毕
            NotificationCenter.default.addObserver(self, selector: #selector(onReceiveMsg), name: SOCKET_CHATMSGCALLBACK, object: nil);//收到文本消息
            NotificationCenter.default.addObserver(self, selector: #selector(onAdminCMD), name: SOCKET_ADMINNOTIFY, object: nil);//收到管理员命令
            NotificationCenter.default.addObserver(self, selector: #selector(onTongyongTeachCMD), name: SOCKET_CURRENTCMDNOTIFY, object: nil);//收到通用教学命令
            NotificationCenter.default.addObserver(self, selector: #selector(onUserChange), name: SOCKET_OTHERUSERSTATECHANGE, object: nil);//用户列表变更
            //请求进入教室接口
            let req = Model_joinRoom_c2s();
            let userModel = GlobelInfo.instance.userInfo!;
            req.headerImage = userModel.headerImage;
            req.nickName = userModel.nickName;
            req.roomCode = roomCode;
            req.sex = userModel.sex;
            req.uid = userModel.uid;
            GMLSocketManager.instance.sendMsgToServer(model: req);
        }
    }
    
    /**
     进入教室完毕
     */
    @objc func onJoinRoomComplete(_ notify:NSNotification){
        if let obj = notify.object as? Model_joinRoom_s2c{
            //记录教室信息
            let classInfo = ClassRoomInfo();
            classInfo.rid = obj.rid;
            classInfo.roomImage = obj.roomImage;
            classInfo.roomName = obj.roomName;
            GlobelInfo.instance.classInfo = classInfo;
            //启动媒体引擎
            let sdkChannelName = "gmlChannel_\(obj.rid)";//channel不可以用中文，这是个坑,否则启动媒体引擎sdk会失败
            MediaProxy.instance.start(mediaV.remoteView, mediaV.localView, sdkChannelName,UInt(GlobelInfo.instance.userInfo!.uid));
        }
    }
    
    /**
     离开教室
     */
    func onLeaveRoom(e:GMLEvent){
        //切换到 课表模式
        swapDisplayMode(.classlist);
        //删除通知监听
        NotificationCenter.default.removeObserver(self, name: SOCKET_CHATMSGCALLBACK, object: nil);
        NotificationCenter.default.removeObserver(self, name: SOCKET_ADMINNOTIFY, object: nil);
        NotificationCenter.default.removeObserver(self, name: SOCKET_CURRENTCMDNOTIFY, object: nil);
        NotificationCenter.default.removeObserver(self, name: SOCKET_OTHERUSERSTATECHANGE, object: nil);
        //停止媒体引擎
        MediaProxy.instance.stop();
        
    }
    
    /**
     收到文本消息
     */
    @objc func onReceiveMsg(_ notify:NSNotification){
        if let obj = notify.object as? Model_sendChat_notify{
            NSLog("1")
        }
    }
    
    /**
     收到管理员命令
     */
    @objc func onAdminCMD(_ notify:NSNotification){
        if let obj = notify.object as? Model_adminCMD_notify{
            NSLog("1")
        }
    }
    
    /**
     收到通用教学命令
     */
    @objc func onTongyongTeachCMD(_ notify:NSNotification){
        if let obj = notify.object as? Model_currentCMD_notify{
            NSLog("1")
        }
    }
    
    /**
     收到用户列表变更
     */
    @objc func onUserChange(_ notify:NSNotification){
        if let obj = notify.object as? Model_otherUserStateChange_notify{
            NSLog("1")
        }
    }
}

enum DisplayMode:UInt32{
    case huanying = 0 //欢迎页面模式
    case classlist = 2 // 课表模式
    case classroom = 1 //课中模式
}
