//  人物选择界面
//  SelectRoleScene.swift
//  Chaos
//
//  Created by guominglong on 16/6/6.
//  Copyright © 2016年 guominglong. All rights reserved.
//

import Foundation
import SpriteKit
class SelectRoleScene: GMLScene {
    var roleListPanel:SKSpriteNode!;
    fileprivate var roleSelectBg:SKSpriteNode!;
    var btn_in:SKSpriteNode!;
    var btn_out:SKSpriteNode!;
    override func didMove(to view: SKView) {
        super.didMove(to: view);
        
    }
    
    override func ginit() {
        super.ginit();
        self.backgroundColor = SKColor.black;
        
        roleSelectBg = SKSpriteNode(color: SKColor.red, size: CGSize(width: 150, height: 200));
        
        roleListPanel = SKSpriteNode(color: SKColor.blue, size: CGSize(width: roleSelectBg.size.width * 4, height: roleSelectBg.size.height * 2));
        roleListPanel.addChild(roleSelectBg);
        roleListPanel.anchorPoint = CGPoint(x: 0, y: 0);
        self.contextContainerLayer.addChild(roleListPanel);
        
        
        let lineHeight = roleSelectBg.size.height/2;
        let lineWidth = roleSelectBg.size.width/2;
        let ty:CGFloat = roleListPanel.size.height/roleListPanel.yScale - lineHeight;
        let tx:CGFloat = lineWidth;
        
        var cy:CGFloat = 0;
        var cx:CGFloat = 0;
        for i:Int in 0..<8
        {
            if(i%4 == 0)
            {
                cy = ty - CGFloat(i/4) * roleSelectBg.size.height;
            }
            cx = CGFloat(i%4) * roleSelectBg.size.width + tx;
            let roleMc = SKSpriteNode(texture: GMLResourceManager.instance.textureByName("Test1Monster_0"));
            roleMc.position = CGPoint(x: cx, y: cy);
            
            roleListPanel.addChild(roleMc);
            roleMc.name = "role_\(i)";
            if(i == 0)
            {//把角色选中背景 默认放置到第一个角色背后
                roleSelectBg.position = roleMc.position;
            }
        }
        
        btn_in = createBtn("开始");
        self.contextContainerLayer.addChild(btn_in);
        
        btn_out = createBtn("返回");
        self.contextContainerLayer.addChild(btn_out);
        
    }
    
    fileprivate func createBtn(_ text:String)->SKSpriteNode
    {
        let node = SKSpriteNode(color: SKColor.red, size: CGSize(width: 100, height: 30));
        let lab = SKLabelNode(text: text);
        lab.fontSize = 18;
        lab.fontName = "Chalkduster";
        lab.fontColor = SKColor.white;
        lab.horizontalAlignmentMode = .center;
        lab.verticalAlignmentMode = .center;
        node.addChild(lab)
        return node;
    }
    
    override func gresize(_ currentSize: CGSize) {
        let tempScale = autoScreen(1);
        roleListPanel.position.x = (self.frame.size.width/tempScale -  roleListPanel.frame.size.width)/2;
        roleListPanel.position.y = (self.frame.size.height/tempScale -  roleListPanel.frame.size.height)/2;
        btn_out.position.x = roleListPanel.position.x + btn_out.size.width / 2;
        btn_out.position.y = roleListPanel.position.y - 30;
        
        btn_in.position.x = roleListPanel.position.x + roleListPanel.size.width - btn_in.size.width / 2;
        btn_in.position.y = btn_out.position.y;
    }
    
    /**
     执行一个动画后，显示下一个场景
     */
    func onBtn_inClick()
    {
        /**
        进入场景
        */
        NotificationCenter.default.post(name: Notification.Name(rawValue: "changeScene"), object: "DiqiuScene");
    }
    
    /**
     执行一个动画后，显示显示上一个场景
     */
    func onBtn_outClick()
    {
        NotificationCenter.default.post(name: Notification.Name(rawValue: "changeScene"), object: "mainGameView")
    }
    
    /**
     当选中了一个角色
     */
    func selectRoleNode(_ roleNode:SKNode)
    {
        roleSelectBg.run(SKAction.move(to: roleNode.position, duration: 0.3), completion: {
            self.roleSelectBg.removeAllActions();
        }) 
    }
}
