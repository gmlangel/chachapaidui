//  怪物基础类
//  GMLMonster.swift
//  Chaos
//
//  Created by guominglong on 16/6/8.
//  Copyright © 2016年 guominglong. All rights reserved.
//

import Foundation

class GMLMonster: SKSpriteNode {
    
    /**
     默认形象
     */
    var defaultFrames:[SKTexture?]!;
    
    /**
     向左移动
     */
    var leftFrames:[SKTexture?]!;
    /**
     向左上移动
     */
    var topLeftFrames:[SKTexture?]!;
    
    /**
     向左下移动
     */
    var bottomLeftFrames:[SKTexture?]!;
    
    /**
     向上移动
     */
    var topFrames:[SKTexture?]!;
    
    /**
     向下移动
     */
    var bottomFrames:[SKTexture?]!;
    
    /**
     向右移动
     */
    var rightFrames:[SKTexture?]!;
    /**
     向右上移动
     */
    var topRightFrames:[SKTexture?]!;
    /**
     向右下移动
     */
    var bottomRightFrames:[SKTexture?]!;
    
    /**
     怪物名称
     */
    var monsterName:String!;
    
    /**
     * 资源文件夹名称
     */
    var folderName:String!;
    
    /**
     对齐方式
     */
    var alignName:String!;
    /**
     使用配置文件初始化场景
     */
    init(monsterConfig:NSDictionary) {
        
        let keys = monsterConfig.allKeys as! [String];
        var frames:NSArray;
        var dic:NSDictionary;
        monsterName=monsterConfig.value(forKey: "name") as! String;
        folderName=monsterConfig.value(forKey: "folderName") as! String;
        alignName=monsterConfig.value(forKey: "align") as! String;
        for key:String in keys
        {
            switch key {
            case GMLAniType.DEFAULT.rawValue:
                defaultFrames = [];
                dic = monsterConfig.value(forKey: key) as! NSDictionary;
                frames = dic.value(forKey: "frames") as! NSArray;
                for i:Int in 0..<frames.count {
                    defaultFrames.append(GMLResourceManager.instance.textureByName(folderName + "_" + (frames.object(at: i) as! String)));
                }
                break;
            case GMLAniType.MOVE_LEFT.rawValue:
                leftFrames = [];
                dic = monsterConfig.value(forKey: key) as! NSDictionary;
                frames = dic.value(forKey: "frames") as! NSArray;
                for i:Int in 0..<frames.count {
                    leftFrames.append(GMLResourceManager.instance.textureByName(folderName + "_" + (frames.object(at: i) as! String)));
                }
                break;
            case GMLAniType.TOP.rawValue:
                topFrames = [];
                dic = monsterConfig.value(forKey: key) as! NSDictionary;
                frames = dic.value(forKey: "frames") as! NSArray;
                for i:Int in 0..<frames.count {
                    topFrames.append(GMLResourceManager.instance.textureByName(folderName + "_" + (frames.object(at: i) as! String)));
                }
                break;
            case GMLAniType.BOTTOM.rawValue:
                bottomFrames = [];
                dic = monsterConfig.value(forKey: key) as! NSDictionary;
                frames = dic.value(forKey: "frames") as! NSArray;
                for i:Int in 0..<frames.count {
                    bottomFrames.append(GMLResourceManager.instance.textureByName(folderName + "_" + (frames.object(at: i) as! String)));
                }
                break;
            case GMLAniType.MOVE_RIGHT.rawValue:
                rightFrames = [];
                dic = monsterConfig.value(forKey: key) as! NSDictionary;
                frames = dic.value(forKey: "frames") as! NSArray;
                for i:Int in 0..<frames.count {
                    rightFrames.append(GMLResourceManager.instance.textureByName(folderName + "_" + (frames.object(at: i) as! String)));
                }
                break;
            case GMLAniType.MOVE_TOP_RIGHT.rawValue:
                topRightFrames = [];
                dic = monsterConfig.value(forKey: key) as! NSDictionary;
                frames = dic.value(forKey: "frames") as! NSArray;
                for i:Int in 0..<frames.count {
                    topRightFrames.append(GMLResourceManager.instance.textureByName(folderName + "_" + (frames.object(at: i) as! String)));
                }
                break;
            case GMLAniType.MOVE_BOTTOM_RIGHT.rawValue:
                bottomRightFrames = [];
                dic = monsterConfig.value(forKey: key) as! NSDictionary;
                frames = dic.value(forKey: "frames") as! NSArray;
                for i:Int in 0..<frames.count {
                    bottomRightFrames.append(GMLResourceManager.instance.textureByName(folderName + "_" + (frames.object(at: i) as! String)));
                }
                break;
            case GMLAniType.MOVE_TOP_LEFT.rawValue:
                topLeftFrames = [];
                dic = monsterConfig.value(forKey: key) as! NSDictionary;
                frames = dic.value(forKey: "frames") as! NSArray;
                for i:Int in 0..<frames.count {
                    topLeftFrames.append(GMLResourceManager.instance.textureByName(folderName + "_" + (frames.object(at: i) as! String)));
                }
                break;
            case GMLAniType.MOVE_BOTTOM_LEFT.rawValue:
                bottomLeftFrames = [];
                dic = monsterConfig.value(forKey: key) as! NSDictionary;
                frames = dic.value(forKey: "frames") as! NSArray;
                for i:Int in 0..<frames.count {
                    bottomLeftFrames.append(GMLResourceManager.instance.textureByName(folderName + "_" + (frames.object(at: i) as! String)));
                }
                break;
            default:break;
                
            }
        }
        super.init(texture: defaultFrames[0], color: SKColor.clear, size: defaultFrames[0]!.size());
    }
    
    
    init(sourceMonster:GMLMonster)
    {
        self.alignName = sourceMonster.alignName;
        self.defaultFrames = sourceMonster.defaultFrames;
        self.bottomFrames = sourceMonster.bottomFrames;
        self.bottomLeftFrames = sourceMonster.bottomLeftFrames;
        self.bottomRightFrames = sourceMonster.bottomRightFrames;
        self.folderName = sourceMonster.folderName;
        self.leftFrames = sourceMonster.leftFrames;
        self.monsterName = sourceMonster.monsterName;
        self.rightFrames = sourceMonster.rightFrames;
        self.topFrames = sourceMonster.topFrames;
        self.topLeftFrames = sourceMonster.topLeftFrames;
        self.topRightFrames = sourceMonster.topRightFrames;
        super.init(texture: defaultFrames[0], color: SKColor.clear, size: defaultFrames[0]!.size());
//        self.physicsBody = SKPhysicsBody(circleOfRadius: defaultFrames[0]!.size().width);
//        self.physicsBody!.contactTestBitMask = GMLContactTestBitMaskEnum.Monster.rawValue;
//        self.physicsBody?.affectedByGravity = false;
    }
    
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    func appendFolderName(_ str:String)->String{
        return folderName + str;
    }
    
    
    /**
     克隆
     */
    func gClone()->GMLMonster{
        let mon = GMLMonster(sourceMonster: self);
        return mon
    }
    
    /**
     销毁
     */
    func gDestroy(){
        defaultFrames.removeAll();
        leftFrames.removeAll();
        topLeftFrames.removeAll();
        bottomLeftFrames.removeAll();
        topFrames.removeAll();
        bottomFrames.removeAll();
        rightFrames.removeAll();
        topRightFrames.removeAll();
        bottomRightFrames.removeAll();
    }
}


