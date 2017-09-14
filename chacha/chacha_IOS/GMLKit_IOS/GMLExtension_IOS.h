//  GMLKit架构的核心机制
//  NSObject_GMLExtension.h
//  MyTalk
//
//  Created by guominglong on 16/5/10.
//  Copyright © 2016年 guominglong. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
@class GMLCoreDispatcher_IOS,GMLEvent_IOS;

@interface UIResponder(GMLKitExtension)

/**
 GMLKit的事件处理对象,想要addEvent，removeEvent就必须重写这个函数
 */
-(GMLCoreDispatcher_IOS * __nullable)gml_delegate;

/**
 添加事件
 */
-(void)addEventListener:(NSString * __nonnull)eventName execFunc:(void(^ __nullable)(GMLEvent_IOS * __nonnull e))_execFunc;

/**
 移除事件
 */
-(void)removeEventListener:(NSString * __nonnull)eventName;

/**
 移除全部的事件
 */
-(void)removeAllEventListener;

/**
 派发GMLKit的相关事件
 */
-(void)dispatchEvent:(GMLEvent_IOS * __nonnull)e;
@end



//@interface NSObject(PropertyListing)
//
//- (NSArray *)getAllProperties;
//- (NSDictionary *)properties_aps;
//-(void)printMothList;
//@end

