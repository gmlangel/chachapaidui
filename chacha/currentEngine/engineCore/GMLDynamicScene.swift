//  动态场景
//  GMLDynamicScene.swift
//  Chaos
//
//  Created by guominglong on 16/6/8.
//  Copyright © 2016年 guominglong. All rights reserved.
//

import Foundation
import SpriteKit
class GMLDynamicScene: GMLScene {
    fileprivate(set) var bgs:[SKSpriteNode]?;//所有的背景
    fileprivate(set) var mounsters:[GMLMonster]?;//所有的怪物
    fileprivate(set) var monsterFenbu:NSArray?;//怪物分布
    
    var currentScenePosition:CGPoint!;
    
    /**
     内容尺寸
     */
    fileprivate var contextSize:CGSize!;
    
    /**
     资源文件夹名称
     */
    fileprivate var folderName:String!;
    /**
     使用配置文件初始化场景
     */
    init(sceneConfig:NSDictionary) {
        //根据屏幕尺寸初始化场景
        super.init(size: GMLGameMain.instance.mainGameView.frame.size);
        
        //设置资源文件夹名称
        folderName = sceneConfig.value(forKey: "folderName") as! String;
        //将图像位移到指定的入口坐标
        var dic = sceneConfig.value(forKey: "enterPoint") as! NSDictionary;
        currentScenePosition = CGPoint(x: autoScreen(CGFloat(dic.value(forKey: "x") as! NSNumber)), y: autoScreen(CGFloat(dic.value(forKey: "y") as! NSNumber)))
        self.anchorPoint = CGPoint(x: -currentScenePosition.x/self.size.width, y: -currentScenePosition.y/self.size.height);
        
        
        
        dic = sceneConfig.value(forKey: "contextSize") as! NSDictionary;
        
        //设置scene中呈现的内容尺寸
        contextSize = CGSize(width: autoScreen(CGFloat(dic.value(forKey: "width") as! NSNumber)), height: autoScreen(CGFloat(dic.value(forKey: "height") as! NSNumber)));
        
        if let bginfo = sceneConfig.value(forKey: "bg") as? NSArray{
            let j = bginfo.count;
            var textureName:String;
            var obj:NSDictionary;
            bgs = [];
            for i:Int in 0..<j
            {
                //obj = bginfo.object(at: i) as! NSDictionary;
                textureName = folderName + "_" + (bginfo.object(at: i) as! String);
                let bgNode = SKSpriteNode(texture: GMLResourceManager.instance.textureByName(textureName));
                bgs!.append(bgNode);
                bgNode.position = CGPoint(x: CGFloat(256), y: CGFloat(256));
            }
        }
        
        //读取怪物分布
        monsterFenbu = sceneConfig.value(forKey: "monsterFenbu") as? NSArray;
        if(monsterFenbu != nil)
        {
            mounsters = [];
            //初始化怪物
            for obj in monsterFenbu!
            {
                pushMonsters(obj as! NSDictionary);
            }
        }
    }

    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    /**
     根据怪物分布信息填充Monsters集合
     */
    fileprivate func pushMonsters(_ obj:NSDictionary)
    {
        let monsterConfigName = obj.value(forKey: "monsterKey") as! String;
        if let dic = GMLResourceManager.instance.configByName(monsterConfigName){
            let monster:GMLMonster = GMLMonster(monsterConfig: dic);
            let centerPos:CGPoint = CGPoint(x: CGFloat(obj.value(forKey: "x") as! NSNumber), y: CGFloat(obj.value(forKey: "y") as! NSNumber));
            let radius:CGFloat = CGFloat(obj.value(forKey: "radius") as! NSNumber);
            mounsters!.append(monster);
            monster.position = GMLTool.randomPosition(inRect: centerPos,radius:radius);
            let j:Int = Int(obj.value(forKey: "count") as! NSNumber);//读取要创建的个数
            for  i:Int in 1..<j {
                let mo = monster.gClone();
                mounsters!.append(mo);
                mo.position = GMLTool.randomPosition(inRect: centerPos,radius:radius);
            }
        }else{
            GMLLogCenter.instance.trace("[pushMonsters]未能加载怪物:"+monsterConfigName)
        }
        
    }
    
    override func didMove(to view: SKView) {
        super.didMove(to: view);
    }
    
    override func ginit() {
        super.ginit();
        self.backgroundColor = SKColor.red;
        //设置contextContainerLayer的区域范围
        self.contextContainerLayer.physicsBody = SKPhysicsBody(edgeLoopFrom: CGRect(x: 0, y: 0, width: contextSize.width/self.contextContainerLayer.xScale, height: contextSize.height/self.contextContainerLayer.yScale));
        
        if(bgs != nil)
        {
            let j = bgs!.count;
            for i:Int in 0..<j
            {
                self.bgLayer.addChild(bgs![i]);
            }
        }
        
        if(mounsters != nil)
        {
            let j = mounsters!.count;
            for i:Int in 0..<j
            {
                self.contextContainerLayer.addChild(mounsters![i]);
            }
        }

    }
    
    override func gresize(_ currentSize: CGSize) {
        self.anchorPoint = CGPoint(x: -currentScenePosition.x/self.size.width, y: -currentScenePosition.y/self.size.height);//在缩放屏幕时，防止场景位置跑偏
    }

    /**
     销毁
     */
    func gDestroy(){
        if(mounsters != nil)
        {
            for mon in mounsters!{
                mon.gDestroy();
                mon.removeFromParent();
            }
            mounsters!.removeAll();
        }
        
        self.bgLayer.removeAllChildren();
        if(bgs != nil)
        {
            bgs?.removeAll();
        }
    }
    
    
}
