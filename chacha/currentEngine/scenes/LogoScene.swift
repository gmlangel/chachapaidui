//  程序第一次启动的第一个页面
//  LogoScene.swift
//  Chaos
//
//  Created by guominglong on 16/6/2.
//  Copyright © 2016年 guominglong. All rights reserved.
//

import Foundation
import SpriteKit
class LogoScene: GMLScene {
    
    fileprivate var mainLogo:SKSpriteNode!;
    fileprivate var logoAction:SKAction!;
    var isAniEnd:Bool! = false;
    static var instance:LogoScene{
        get{
            struct LogoSceneIns {
                static var _ins:LogoScene = LogoScene(size: GMLMain.instance.mainGameView.frame.size);
            }
            return LogoSceneIns._ins;
        }
    }
    
    override func didMove(to view: SKView) {
        super.didMove(to: view)
        isAniEnd = false;
        mainLogo.removeAction(forKey: "chuchang");
        mainLogo.run(logoAction, withKey: "chuchang")
    }
    
    override func ginit() {
        super.ginit();
        self.backgroundColor = SKColor.white;
        mainLogo = SKSpriteNode(imageNamed: "MainAssets1/logo/mainLog");
        mainLogo.alpha = 0;
        mainLogo.normalTexture = mainLogo.texture?.generatingNormalMap();
        self.bgLayer.addChild(mainLogo);
        
        
        logoAction = SKAction.sequence([SKAction.perform(NSSelectorFromString("logoReset"), onTarget: self),SKAction.wait(forDuration: 0.5),SKAction.group([SKAction.fadeIn(withDuration: 0.3),SKAction.scale(to: 1, duration: 0.5)]),SKAction.wait(forDuration: 1),SKAction.perform(NSSelectorFromString("aniEnd"), onTarget: self)]);
        
        
    }
    

    
    func logoReset()
    {
        mainLogo.alpha = 0;
        mainLogo.xScale = 0.3;
        mainLogo.yScale = 0.3;
    }
    
    /**
     动画执行完毕
     */
    func aniEnd()
    {
        isAniEnd = true;
        NotificationCenter.default.post(name: Notification.Name(rawValue: "changeScene"), object: "PrelaodScene");
    }
    
    
    override func update(_ currentTime: TimeInterval) {
        //NSLog("\(self.frame)");
        
        
    }
    
    override func gresize(_ currentSize: CGSize) {
        mainLogo.position.x = self.frame.midX/self.bgLayer.xScale;
        mainLogo.position.y = self.frame.midY/self.bgLayer.yScale;
    }
}
