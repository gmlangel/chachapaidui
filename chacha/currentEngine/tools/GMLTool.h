//
//  GMLTool.h
//  Chaos
//
//  Created by guominglong on 16/6/4.
//  Copyright © 2016年 guominglong. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <SpriteKit/SpriteKit.h>
@interface GMLTool : NSObject

/**
 根据NSData 获得SKTexture
 */
+(SKTexture * __nullable)imageByData:(NSData * __nonnull)fileData;

/**
 文档路径
 */
+(NSString * __nonnull)documentPath;

+(CGPoint)randomPositionInRect:(CGPoint)cp radius:(CGFloat)_radius;
@end
