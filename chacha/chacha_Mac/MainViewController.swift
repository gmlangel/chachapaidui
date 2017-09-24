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
    fileprivate lazy var huanyingV:View_huanying! = {
        let v = View_huanying(frame: NSRect(x: 0, y: 0, width: 300, height: 300));
        return v;
    }();
    
    //登录视图
    fileprivate lazy var loginV:View_login = {
        let v = View_login(frame: NSRect(x: 0, y: 0, width: 200, height: self.view.frame.size.height));
        return v;
    }();
    fileprivate var containerV:NSView!;
    fileprivate var isAniing:Bool = false;//是否在执行动画中
    fileprivate var dispalyMode:DisplayMode = .huanying;//当前显示的模块 模式
    override func viewDidLoad() {
        super.viewDidLoad();
        self.view.wantsLayer = true;
        self.view.layer?.backgroundColor = GMLSkinManager.instance.mainBackgroundColor;
        
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
    
    fileprivate func createShowAni() -> POPAnimation{
        let showAni:POPBasicAnimation! = POPBasicAnimation.init(propertyNamed: kPOPViewAlphaValue)
        showAni.duration = 0.4;
        showAni.delegate = self;
        showAni.toValue = 1;
        return showAni;
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
            //显示
        }else{
            //隐藏
        }
    }
    
    /**
     显示或隐藏课中模式
     */
    fileprivate func showOrHideClassroomMode(b:Bool){
        if b == true{
            //显示
        }else{
            //隐藏
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
        }
    }
    override func viewDidAppear() {
        super.viewDidAppear();
        self.view.window?.makeFirstResponder(nil);
    }
    override func viewDidDisappear() {
        NotificationCenter.default.removeObserver(self);
    }
}

enum DisplayMode:UInt32{
    case huanying = 0 //欢迎页面模式
    case classlist = 2 // 课表模式
    case classroom = 1 //课中模式
}
