//
//  GMLExtensions.m
//  Chaos
//
//  Created by guominglong on 16/6/3.
//  Copyright © 2016年 guominglong. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "GMLGameConfig.h"
#import <SpriteKit/SpriteKit.h>

@implementation SKSpriteNode (GMLEngineCore)

-(SKSpriteNode *)autoScreen{
    self.xScale = GMLGameConfig.sourceScale;
    self.yScale = GMLGameConfig.sourceScale;
    return self;
}

@end


//@implementation SKNode(GMLEngineCore)
//
//- (void)gmlAddChild:(SKNode *)node{
//    if(node.zPosition == 0)
//    {
//        node.zPosition = [[self children] count];
//    }
//    [self addChild:node];
//}
//
//-(void)gmlInsertChildAt:(SKNode *)node idx:(NSInteger)_idx{
//    if(node.zPosition == 0)
//    {
//        node.zPosition = [[self children] count];
//    }
//    [self insertChild:node atIndex:_idx];
//}
//
//@end