//
//  MediaProxy.swift
//  chacha
//
//  Created by guominglong on 2017/11/15.
//  Copyright © 2017年 SSdk. All rights reserved.
//

import Foundation
class MediaProxy: GMLProxy,AgoraRtcEngineDelegate {
    let AppID:String = "220af8ce9af94710bc0302bfc373f9cb";//Agora的sdk key
    weak var remoteVideo:NSView?;//远端视频窗口
    weak var localView:NSView?;//本地视频窗口
    var AgoraKit: AgoraRtcEngineKit!//媒体引擎操作对象
    
    /**
     单例
     */
    static var instance:MediaProxy{
        get{
            struct MediaProxyStruc{
                static let _instance:MediaProxy = MediaProxy();
            }
            return MediaProxyStruc._instance;
        }
    }
    
    /**
     启动
     */
    func start(_ rV:NSView,_ lV:NSView,_ channelName:String,_ uid:UInt = 0){
        remoteVideo = rV;
        localView = lV;
        //初始化引擎
        AgoraKit = AgoraRtcEngineKit.sharedEngine(withAppId: AppID, delegate: self)
        //开启摄像头，并设置
        AgoraKit.enableVideo()  // Default mode is disableVideo
        AgoraKit.setVideoProfile(._VideoProfile_480P_4, swapWidthAndHeight: false)//设置图像清晰度
        //绑定本地渲染窗口，以便显示本地摄像头采集的图像
        let videoCanvas = AgoraRtcVideoCanvas()
        videoCanvas.uid = 0
        videoCanvas.view = localView!
        videoCanvas.renderMode = .render_Adaptive
        AgoraKit.setupLocalVideo(videoCanvas)
        //进入频道
        AgoraKit.joinChannel(byKey: nil, channelName: channelName, info:nil, uid:uid) { (sid, uid, elapsed) -> Void in
            // Join channel "demoChannel1"
            Swift.print("进入频道成功")
        }
    }
    
    /**
     停止媒体引擎
     */
    func stop(){
        AgoraKit.leaveChannel(nil)//离开频道
        AgoraKit.setupLocalVideo(nil)
        //        remoteVideo?.removeFromSuperview()
        //        localVideo?.removeFromSuperview()
        AgoraKit = nil
    }


    
    /**
     Tutorial Step 5
     收到第一次开启了视频，并且收到了远端的视频帧
     */
    func rtcEngine(_ engine: AgoraRtcEngineKit!, firstRemoteVideoDecodedOfUid uid:UInt, size:CGSize, elapsed:Int) {
        if remoteVideo == nil{
            return;
        }
        if (remoteVideo!.isHidden) {
            remoteVideo!.isHidden = false
        }
        let videoCanvas = AgoraRtcVideoCanvas()
        videoCanvas.uid = uid
        videoCanvas.view = remoteVideo!
        videoCanvas.renderMode = .render_Adaptive
        AgoraKit.setupRemoteVideo(videoCanvas)
    }
    
    /**
     Tutorial Step 7
     远端掉线，视频关闭
     */
    func rtcEngine(_ engine: AgoraRtcEngineKit!, didOfflineOfUid uid:UInt, reason:AgoraRtcUserOfflineReason) {
        self.remoteVideo?.isHidden = true
    }
    
    /**
     Tutorial Step 10
     远端主动muteVideo
     */
    func rtcEngine(_ engine: AgoraRtcEngineKit!, didVideoMuted muted:Bool, byUid:UInt) {
        remoteVideo?.isHidden = muted
    }
}
