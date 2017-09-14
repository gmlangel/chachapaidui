//  动态场景生成器
//  GMLDynamicSceneFactory.swift
//  Chaos
//
//  Created by guominglong on 16/6/8.
//  Copyright © 2016年 guominglong. All rights reserved.
//

import Foundation
import SpriteKit
class GMLDynamicSceneFactory: NSObject {
    
    static var instance:GMLDynamicSceneFactory{
        get{
            struct GMLDynamicSceneFactoryIns{
                static var _ins:GMLDynamicSceneFactory = GMLDynamicSceneFactory();
            }
            return GMLDynamicSceneFactoryIns._ins;
        }
    }
    
    /**
     通过配置文件生成动态场景
     */
//    func createDynamicScene(sceneConfig:NSDictionary)->GMLDynamicScene
//    {
//        let gmlDynaScene = GMLDynamicScene(size:GMLMain.instance.mainGameView.frame.size);
//        return gmlDynaScene;
//    }
}