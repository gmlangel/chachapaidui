//
//  GMLProxy.m
//  MyTalk
//
//  Created by guominglong on 16/5/10.
//  Copyright © 2016年 guominglong. All rights reserved.
//

#import "GMLProxy.h"
@implementation GMLProxy

-(GMLCoreDispatcher * __nullable)gml_delegate{
    if(_gmlDis == nil)
    {
        _gmlDis = [[GMLCoreDispatcher alloc] init];
    }
    return  _gmlDis;
    

}

-(void)gml_destroy{
    if([self gml_delegate]){
        //移除所有的监听
        [[self gml_delegate] removeAllEventListener];
    }
}

-(void)execFun:(NSString * __nonnull)funcName arg:(id __nullable)_arg{

}

-(id __nullable)execHasCallbackFun:(NSString * __nonnull)funcName arg:(id __nullable)_arg{
    return nil;
}
@end
