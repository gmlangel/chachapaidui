//
//  PreloadScene.swift
//  Chaos
//
//  Created by guominglong on 16/6/8.
//  Copyright © 2016年 guominglong. All rights reserved.
//

import Foundation
import SpriteKit
class PreloadScene: GMLScene {
    
    //循环动画的资源
    fileprivate var textues:[SKTexture]!;//loading人物的资源
    fileprivate var loadtool:SKSpriteNode!;//loading条
    fileprivate var loadMaskMC:SKSpriteNode!;
    fileprivate var loadtoolAK:SKAction!;//loading条动画
    
    fileprivate var loadingNode:SKSpriteNode!;//loading人物
    fileprivate var loadingAk:SKAction!;
    fileprivate var loadingInterval:Double = 1/12;//loading动画的间隔
    fileprivate var tsize:CGSize!;
    var loadingTime:TimeInterval! = 5;//loading动画的完整执行时间
    
    fileprivate var stopAc:SKAction!;
    fileprivate var wanttogoSceneName:String!;//将要去的下一个场景
    static var instance:PreloadScene{
        get{
            struct PreloadSceneIns{
                static var _ins:PreloadScene = PreloadScene(size: GMLMain.instance.mainGameView.frame.size);
            }
            return PreloadSceneIns._ins;
        }
    }
    
    override func didMove(to view: SKView) {
        super.didMove(to: view);
        loadMaskMC.size.width = tsize.width;
        loadMaskMC.run(loadtoolAK, withKey: "loadingtiao");
        loadingNode.run(loadingAk, withKey: "renwuloading");
        NotificationCenter.default.post(name: Notification.Name(rawValue: "showOrHideChatView"), object: false);
    }
    
    override func ginit() {
        super.ginit();
        self.backgroundColor = SKColor.black;
        textues = [];
        for i:Int in 0..<4
        {
            textues.append(SKTexture(imageNamed:"MainAssets1/preload/\(i)"));
        }
        //loading条
        loadtool = SKSpriteNode();
        tsize = CGSize(width:(self.frame.size.width - 80)/self.contextContainerLayer.xScale,height:20);
        let loadbg = SKShapeNode(rect: CGRect(x:-tsize.width/2,y:-tsize.height/2,width:tsize.width,height:tsize.height), cornerRadius: 10)
        loadbg.fillColor = SKColor.blue;
        loadbg.lineWidth = 0;
        loadtool.addChild(loadbg);
        
        loadMaskMC = SKSpriteNode(color: SKColor.black, size: tsize);
        loadMaskMC.anchorPoint.x = 1;
        loadMaskMC.position.x = tsize.width/2;
        loadtool.addChild(loadMaskMC);
        self.contextContainerLayer.addChild(loadtool);
        
        //loading人物
        loadingNode = SKSpriteNode(texture: textues[0]);
        self.contextContainerLayer.addChild(loadingNode);
        
        //loading动作
        loadingAk = SKAction.repeatForever(SKAction.animate(with: textues, timePerFrame: loadingInterval,resize: true,restore: true));
        
        loadtoolAK = SKAction.resize(toWidth: 0, duration: loadingTime);
        loadtoolAK.timingFunction = onloadtoolAKFuncUpdaet;
        
        stopAc = SKAction.sequence([SKAction.wait(forDuration: 1),SKAction.perform(NSSelectorFromString("onstopAni"), onTarget: self)]);
    }
    
    func onloadtoolAKFuncUpdaet(_ a:Float)->Float
    {
        loadingNode.position.x = loadMaskMC.position.x - loadMaskMC.size.width + loadtool.position.x;
        return a;
    }
    
    /**
     停止加载动画
     */
    func stopLoading(_ _wanttogoSceneName:String = ""){
        self.wanttogoSceneName = _wanttogoSceneName;
        loadMaskMC.removeAllActions();
        loadMaskMC.size.width = 0;
        loadingNode.position.x = loadMaskMC.position.x - loadMaskMC.size.width + loadtool.position.x;
        self.run(stopAc, withKey: "stopAc")
    }
    
    func onstopAni(){
        
        //如果wanttogoSceneName不为空字符串，则跳转至指定的场景
        if(wanttogoSceneName != "")
        {
            NotificationCenter.default.post(name: Notification.Name(rawValue: "changeScene"), object: wanttogoSceneName);
        }
    }
    
    override func willMove(from view: SKView) {
        loadingNode.removeAllActions();
        self.removeAllActions();
    }
    
    override func gresize(_ currentSize: CGSize) {
        loadtool.position.x = self.size.width / self.contextContainerLayer.xScale / 2;
        loadingNode.position.y = self.size.height / self.contextContainerLayer.yScale / 2;
        loadtool.position.y = loadingNode.position.y - loadingNode.size.height / 2 - 40;
        loadingNode.position.x = loadMaskMC.position.x - loadMaskMC.size.width + loadtool.position.x;
        
    }
}
