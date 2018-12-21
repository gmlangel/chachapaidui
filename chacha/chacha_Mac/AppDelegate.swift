//
//  AppDelegate.swift
//  chacha_Mac
//
//  Created by guominglong on 2017/9/14.
//  Copyright © 2017年 SSdk. All rights reserved.
//

import Cocoa

@NSApplicationMain
class AppDelegate: NSObject, NSApplicationDelegate {

    fileprivate let serverHost:String = "39.106.135.11";
    fileprivate let serverPort:UInt16 = 48888;
    fileprivate let reconnectMaxCount:Int = 5;//最大重连次数
    fileprivate var reconnectCurrent:Int = 0;//当前重连次数
    fileprivate var isBeKick:Bool  = false;//是否是被远端提出socket
    fileprivate var reconnectTimer:Timer!;//用于重连的timer
    func applicationDidFinishLaunching(_ aNotification: Notification) {
        // Insert code here to initialize your application
        //开启Socket 服务
        toConnectSocket();
        NotificationCenter.default.addObserver(self, selector: #selector(onSocketConnected), name: SOCKET_CONNECTED, object: nil);
        NotificationCenter.default.addObserver(self, selector: #selector(onsocketclose), name: SOCKET_DISCONNECT, object: nil);
        NotificationCenter.default.addObserver(self, selector: #selector(onBeKickOffline), name: SOCKET_OFFLINE, object: nil);
        
    }

    func applicationWillTerminate(_ aNotification: Notification) {
        // Insert code here to tear down your application
        NotificationCenter.default.removeObserver(self);
    }

    //当socket断开
    @objc open func onsocketclose(_ notify:NSNotification){
        
        if isBeKick {
            //被socket服务器主动提出，不需要尝试重连
            Swift.print("被socket服务提出");
            return;
        }
        Swift.print("socket服务断开");
        if reconnectCurrent < reconnectMaxCount{
            //未达到重连次数上限的，可以进行重连
            reconnectCurrent += 1;
            Swift.print("正在尝试重连，当前重连第\(reconnectCurrent)次")
            reconnectTimer = Timer.init(timeInterval: 30, target: self, selector: #selector(toConnectSocket), userInfo: nil, repeats: false);
            RunLoop.current.add(reconnectTimer, forMode: RunLoopMode.commonModes);
        }else{
            Swift.print("已经重连\(reconnectMaxCount)次,不能再继续尝试重连，socket彻底断开")
        }
    }
    
    @objc open func toConnectSocket(){
        GMLSocketManager.instance.connect(host: serverHost, port: serverPort);
    }

    //掉线通知
    @objc open func onBeKickOffline(_ notify:NSNotification){
        isBeKick = true;
        reconnectCurrent = 0;
    }
    
    //socket连接成功
    @objc open func onSocketConnected(_ notify:NSNotification){
        reconnectCurrent = 0;
    }
}

