//
//  SKSpriteNode_GMLExtensions.h
//  Chaos
//
//  Created by guominglong on 16/6/3.
//  Copyright © 2016年 guominglong. All rights reserved.
//

#import <SpriteKit/SpriteKit.h>
#import "GMLMouseEvent.h"
@interface SKSpriteNode (GMLEngineCore)

/**
 自动适配苹果的各个产品的屏幕大小
 */
-(SKSpriteNode *)autoScreen;
@end

//------------------------------------------------------------------------------------


//@interface SKNode(GMLEngineCore)
//
///**
// 添加节点时，保证后添加的节点在最上层渲染（在没有设置过zPosition的情况下）
// */
//-(void)gmlAddChild:(SKNode *)node;
//
///**
// 添加节点时，保证后添加的节点在最上层渲染（在没有设置过zPosition的情况下）
// */
//-(void)gmlInsertChild:(SKNode *)node idx:(NSInteger)_idx;
//@end