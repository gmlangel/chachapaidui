//
//  GMLGameConfig.h
//  Chaos
//
//  Created by guominglong on 16/6/3.
//  Copyright © 2016年 guominglong. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <CoreGraphics/CoreGraphics.h>


@interface GMLGameConfig : NSObject
{
    GMLGameConfig * _ins;
}
/**
 设置所有UI资源的默认缩放比，以保证多平台的不同分辨率的设备都能呈现出适用自己的界面效果
 */
+(CGFloat)sourceScale;
+(void)setSourceScale:(CGFloat)f;

/**
 log系统不同种类日志的路径
 */
+(NSArray<NSString *> *)logPaths;
+(void)setLogPaths:(NSArray<NSString *> *)va;

@end


CG_EXTERN CGFloat autoScreen(CGFloat source) CG_AVAILABLE_STARTING(__MAC_10_0, __IPHONE_2_0);
