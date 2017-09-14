//  自定义事件的基类
//  GMLEvent.h
//  MyTalk
//
//  Created by guominglong on 16/5/9.
//  Copyright © 2016年 guominglong. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
@interface GMLEvent_IOS : NSObject
{
    NSString * _eventType;
    id _data;
    UIResponder * _target;
}
/**
 事件类型
 */
@property (readonly) NSString * __nonnull eventType;

/**
 事件携带的数据
 */
@property (readonly) id __nullable data;

/**
 事件的发起者
 */
@property (readonly) UIResponder * __nullable target;


-(instancetype __nonnull)initWithEventType:(NSString * __nonnull)_eventType target:(UIResponder * __nullable)_tg data:(id __nullable) _da;
@end


@interface GMLProgressEvent_IOS:GMLEvent_IOS
{
    CGFloat _loadedBytes;
    CGFloat _totalBytes;
}

/**
 已经加载的字节数
 */
@property (readonly) CGFloat loadedBytes;


/**
 总字节数
 */
@property (readonly) CGFloat totalBytes;


-(instancetype __nonnull)initWithBytesState:(NSString * __nonnull)_eventType loadedBytes:(CGFloat)_lb totalBytes:(CGFloat)_tb;
@end
