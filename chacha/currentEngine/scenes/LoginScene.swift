//
//  LoginScene.swift
//  Chaos
//
//  Created by guominglong on 16/6/5.
//  Copyright © 2016年 guominglong. All rights reserved.
//

import Foundation
class LoginScene: GMLScene {
    
    var bgNode:SKSpriteNode!;
    var btn_beginGame:SKSpriteNode!;
    
    
    override func didMove(to view: SKView) {
        super.didMove(to: view);

    }
    
    
    override func ginit() {
        super.ginit();
        self.backgroundColor = SKColor.black;
        bgNode = SKSpriteNode(texture: GMLResourceManager.instance.textureByName("loginScene_bg"))
        self.bgLayer.addChild(bgNode);

        
        btn_beginGame = SKSpriteNode(color: SKColor.white, size: CGSize(width: 120, height: 30));
        let btn_beginGameLabel:SKLabelNode = SKLabelNode(text: "开始");
        btn_beginGameLabel.fontSize = 18;
        btn_beginGameLabel.fontName = "Chalkduster";
        btn_beginGameLabel.fontColor = SKColor.red;
        btn_beginGameLabel.verticalAlignmentMode = .center;
        btn_beginGameLabel.horizontalAlignmentMode = .center;
        btn_beginGame.addChild(btn_beginGameLabel);
        self.contextContainerLayer.addChild(btn_beginGame);

        
    }
    
    
    
    
    override func gresize(_ currentSize: CGSize) {
        let tempScale = autoScreen(1);
        bgNode.position.x = self.frame.midX / tempScale;
        bgNode.position.y = self.frame.midY / tempScale;
        btn_beginGame.position.x = bgNode.position.x;
        btn_beginGame.position.y = self.frame.midY / 2 / tempScale;
    }
}
