//  Monster相关配置枚举
//  GMLEnums.swift
//  GMLGame
//
//  Created by guominglong on 16/1/19.
//  Copyright © 2016年 guominglong. All rights reserved.
//

import Foundation
/**
 动画类型
 */
enum GMLAniType:String{
    
    /**
     默认状态
     */
    case DEFAULT="ANI_DEFAULT"
    
    /**
     向左移动
     */
    case MOVE_LEFT =  "ANI_MOVE_LEFT"
    
    /**
     向左上移动
     */
    case MOVE_TOP_LEFT =  "ANI_MOVE_TOP_LEFT"
    
    /**
     向左下移动
     */
    case MOVE_BOTTOM_LEFT =  "ANI_MOVE_BOTTOM_LEFT"
    
    
    /**
     向上移动
     */
    case TOP = "ANI_TOP";
    
    /**
     向下移动
     */
    case BOTTOM = "ANI_BOTTOM";
    
    
    /**
     向右移动
     */
    case MOVE_RIGHT =  "ANI_MOVE_RIGHT"
    
    /**
     向右上移动
     */
    case MOVE_TOP_RIGHT =  "ANI_MOVE_TOP_RIGHT"
    
    /**
     向右下移动
     */
    case MOVE_BOTTOM_RIGHT =  "ANI_MOVE_BOTTOM_RIGHT"
    
    /**
     攻击
     */
    case ATTACK = "ANI_ATTACK"
    
    /**
     发动技能
     */
    case MAGIC = "ANI_MAGIC"
    
}

