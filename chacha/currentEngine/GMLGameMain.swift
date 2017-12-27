//  引擎主入口
//  GMLMain.swift
//  Chaos
//
//  Created by guominglong on 16/6/3.
//  Copyright © 2016年 guominglong. All rights reserved.
//

import Foundation
class GMLGameMain:NSObject {
    /**
     主游戏视图,唯一
     */
    fileprivate(set) var mainGameView:SKView!;
    
    
    /**
     聊天面板视图
     */
    fileprivate(set) var chatView:SKView!;
    
    static var instance:GMLGameMain{
        get{
            struct gmlMainIns {
                static var _ins:GMLGameMain = GMLGameMain();
            }
            return gmlMainIns._ins;
        }
    }
    
    /**
     游戏开始
     */
    func start(_ _mainView:SKView,_chatView:SKView){
        //设置主视图
        mainGameView = _mainView;
        mainGameView.showsFPS = true;//显示fps
        mainGameView.showsNodeCount = true//显示当前屏幕中被渲染的节点数
        mainGameView.ignoresSiblingOrder = true;//启用外优化，增加渲染性能
        
        //设置聊天视图
        chatView = _chatView;
        chatView.isHidden = true;
        
        //启动log系统
        GMLLogCenter.instance.start();
        
        
        //呈现log页面 同时加载登录界面和引导界面的资源
        mainGameView.presentScene(LogoScene.instance);
        GMLResourceManager.instance.loadResourcePick("main", resourcePath: "/MainAssets1/main",completeSelector: NSSelectorFromString("onMainSorceLoadEnd"),completeSelectorTarget: self);
        
        NotificationCenter.default.addObserver(self, selector: NSSelectorFromString("changeScene:"), name: NSNotification.Name(rawValue: "changeScene"), object: nil);
        NotificationCenter.default.addObserver(self, selector: NSSelectorFromString("showOrHideChatView:"), name: NSNotification.Name(rawValue: "showOrHideChatView"), object: nil);
    }
    
    /**
     当主资源包加载完毕，显示登录页面
     */
    func onMainSorceLoadEnd(){
        //添加一个计时器，确保logo场景动画播放完毕后再显示登陆场景
        HeartbeatManager.instance.addTask(NSSelectorFromString("canShowLoginScene"), ti: 1, tg: self, taskName: "canShowLoginScene",repeats: true);
    }
    
    func canShowLoginScene()
    {
        if(self.mainGameView.scene == PreloadScene.instance)
        {
            HeartbeatManager.instance.removeTask("canShowLoginScene");
            //显示登陆页面
            PreloadScene.instance.stopLoading("mainGameView");
        }
    }
    
    func changeScene(_ notify:Notification)
    {
        let sceneName = notify.object as! String;
        if("PrelaodScene" == sceneName)
        {
            mainGameView.presentScene(PreloadScene.instance, transition: SKTransition.fade(withDuration: 1));
        }else if("SelectRoleScene" == sceneName)
        {
           // mainGameView.presentScene(SelectRoleSceneExten.instance, transition: SKTransition.fade(withDuration: 1));
        }else if("mainGameView" == sceneName)
        {
           // mainGameView.presentScene(LoginSceneExten.instance, transition: SKTransition.fade(withDuration: 1));
        }else{
            //显示预加载
            mainGameView.presentScene(PreloadScene.instance, transition: SKTransition.fade(withDuration: 1));
            //开启一个异步线程，构建即将呈现的场景
            DispatchQueue.global().async {
                if let config = GMLResourceManager.instance.configByName(sceneName){
                    let goScene = GMLDynamicScene(sceneConfig:config);
                    goScene.name = sceneName;
                    Thread.sleep(forTimeInterval: 1);
                    PreloadScene.instance.stopLoading();
                    DispatchQueue.main.asyncAfter(deadline: DispatchTime.now() + Double(Int64(2 * Double(NSEC_PER_SEC))) / Double(NSEC_PER_SEC), execute: {
                        self.mainGameView.presentScene(goScene);
                        NotificationCenter.default.post(name: Notification.Name(rawValue: "showOrHideChatView"), object: true);
                    })
                }
            }
            
        }
    }
    
    /**
     显示或者隐藏chat层
     */
    func showOrHideChatView(_ notify:Notification)
    {
        return;
        let b = notify.object as! Bool;
        if(b)
        {
            //显示chat
            chatView.isHidden = !b;
        }else{
            //隐藏chat
            chatView.isHidden = !b;
        }
    }
}
