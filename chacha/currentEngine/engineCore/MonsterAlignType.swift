//
//  MonsterAlignType.swift
//  Chaos
//
//  Created by guominglong on 16/6/9.
//  Copyright © 2016年 guominglong. All rights reserved.
//

import Foundation
/**
 对齐方式
 */
enum MonsterAlignType:String{
    /**
     左上角对齐
     */
    case TOP_LEFT = "TOP_LEFT"
    
    /**
     居中上对齐
     */
    case TOP = "TOP"
    
    /**
     右上角对齐
     */
    case TOP_RIGHT = "TOP_RIGHT"
    
    /**
     垂直，水平居中
     */
    case CENTER = "CENTER"
    
    /**
     垂直居中左对齐
     */
    case CENTER_LEFT = "CENTER_LEFT";
    
    /**
     垂直居中右对齐
     */
    case CENTER_RIGHT = "CENTER_RIGHT";
    
    /**
     左下角对齐
     */
    case BOTTOM_LEFT = "BOTTOM_LEFT"
    
    /**
     居中下对齐
     */
    case BOTTOM = "BOTTOM"
    
    /**
     右下角对齐
     */
    case BOTTOM_RIGHT = "BOTTOM_RIGHT"
    
    
    
}