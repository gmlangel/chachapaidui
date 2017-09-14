//  GMLKit架构的核心机制
//  NSObject_GMLExtension.h
//  MyTalk
//
//  Created by guominglong on 16/5/10.
//  Copyright © 2016年 guominglong. All rights reserved.
//

#import <Foundation/Foundation.h>

//#import <GMLKit/GMLCoreDispatcher.h>

#import "GMLCoreDispatcher.h"

#if TARGET_OS_IPHONE
#import <UIKit/UIKit.h>
@interface UIResponder(GMLKitExtension)
#elif (TARGET_OS_MAC && !TARGET_OS_SIMULATOR)
#import <AppKit/AppKit.h>
@interface NSResponder(GMLKitExtension)
#elif(TARGET_OS_IOS || (TARGET_OS_MAC && TARGET_OS_SIMULATOR))
#import <UIKit/UIKit.h>
@interface UIResponder(GMLKitExtension)
#endif


/**
 GMLKit的事件处理对象,想要addEvent，removeEvent就必须重写这个函数
 */
-(GMLCoreDispatcher * __nullable)gml_delegate;

/**
 用于Autolayout布局的ViewController引用(有了它就可以调用topLayoutGuide等等，你懂得)
 注意使用layoutDelegate之前一定要确保gml_delegate不为nil
 */
-(UIViewController * __nullable)layoutDelegate;
/**
 添加事件
 */
-(void)addEventListener:(NSString * __nonnull)eventName execFunc:(void(^ __nullable)(GMLEvent * __nonnull e))_execFunc;

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
-(void)dispatchEvent:(GMLEvent * __nonnull)e;
@end


@implementation UIResponder (GMLKitExtension)

-(GMLCoreDispatcher * __nullable)gml_delegate{
    return nil;
}

-(void)addEventListener:(NSString * __nonnull)eventName execFunc:(void(^ __nullable)(GMLEvent * __nonnull e))_execFunc{
    if([self gml_delegate])
    {
        [[self gml_delegate] addEventListener:eventName execFunc:_execFunc];
    }
}

-(void)removeEventListener:(NSString * __nonnull)eventName{
    if ([self gml_delegate]) {
        [[self gml_delegate] removeEventListener:eventName];
    }
}

-(void)removeAllEventListener{
    if([self gml_delegate])
    {
        [[self gml_delegate] removeAllEventListener];
    }
}

-(void)dispatchEvent:(GMLEvent * __nonnull)e{
    if([self gml_delegate])
    {
        [[self gml_delegate] dispatchEvent:e];
    }
}

-(UIViewController * __nullable)layoutDelegate{
    return [[self gml_delegate] layoutDelegate];
}


@end

//------------------------------------------------------------------------------------


@interface UIViewController (GMLKitViewController)
-(void)viewWillLayoutSubviews;
@end

@implementation UIViewController (GMLKitViewController)


-(void)viewWillLayoutSubviews{
    [self.view gml_delegate].layoutDelegate = self;
}
@end

