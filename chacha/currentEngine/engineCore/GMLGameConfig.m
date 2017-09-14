//
//  GMLGameConfig.m
//  Chaos
//
//  Created by guominglong on 16/6/3.
//  Copyright © 2016年 guominglong. All rights reserved.
//

#import "GMLGameConfig.h"

@implementation GMLGameConfig
static CGFloat _sourceScale;
static NSArray<NSString *> * _logPaths;
- (instancetype)init
{
    self = [super init];
    if (self) {
        
        _sourceScale = 1;
        _logPaths = [[NSArray alloc] init];
    }
    return self;
}

+(void)setSourceScale:(CGFloat)f{
    _sourceScale = f;
}
+(void)setLogPaths:(NSArray<NSString *> *)va{
    _logPaths = va;
}

+(CGFloat)sourceScale{
    return _sourceScale;
}

+(NSArray<NSString *> *)logPaths{
    return _logPaths;
}

@end

CG_EXTERN CGFloat autoScreen(CGFloat source) CG_AVAILABLE_STARTING(__MAC_10_0, __IPHONE_2_0)
{
    return source * GMLGameConfig.sourceScale;
}
