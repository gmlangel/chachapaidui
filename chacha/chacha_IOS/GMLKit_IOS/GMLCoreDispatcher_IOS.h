//  负责派发和监听事件,关联Autolayout相关引用的核心组件
//  GMLCoreDispatcher.h
//  MyTalk
//
//  Created by guominglong on 16/5/9.
//  Copyright © 2016年 guominglong. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
@class GMLEvent_IOS;
@interface GMLCoreDispatcher_IOS : NSObject
{
    NSMutableDictionary * eventDic;
}

/**
 添加事件
 */
-(void)addEventListener:(NSString * __nonnull)eventName execFunc:(void(^ __nonnull)(GMLEvent_IOS * __nonnull e))_execFunc;


/**
 移除事件
 */
-(void)removeEventListener:(NSString * __nonnull)eventName;

/**
 移除全部的事件
 */
-(void)removeAllEventListener;

/**
 判断是否有指定事件
 */
-(BOOL)hasEventListener:(NSString * __nonnull)eventName;

-(void)dispatchEvent:(GMLEvent_IOS * __nonnull)e;


@end
