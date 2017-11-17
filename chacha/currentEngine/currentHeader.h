//  多平台兼容头文件
//  currentHeader.h
//  Chaos
//
//  Created by guominglong on 16/6/3.
//  Copyright © 2016年 guominglong. All rights reserved.
//

#ifndef currentHeader_h
#define currentHeader_h


#endif /* currentHeader_h */

#import "ZipArchive.h"
#import "GMLGameConfig.h"
#import <CoreGraphics/CoreGraphics.h>
#import <SpriteKit/SpriteKit.h>
#import "GMLTool.h"
#import "AsyncSocket.h"
#import <AgoraRtcEngineKit/AgoraRtcEngineKit.h>


#if TARGET_OS_IPHONE
#import <UIKit/UIKit.h>
#import "GMLKit_IOS.h"
#elif (TARGET_OS_MAC && !TARGET_OS_SIMULATOR)
#import <AppKit/AppKit.h>
#import "GMLKit.h"
#elif(TARGET_OS_IOS || (TARGET_OS_MAC && TARGET_OS_SIMULATOR))
#import <UIKit/UIKit.h>
#import "GMLKit_IOS.h"
#endif
