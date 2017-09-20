//  Socket客户端管理类
//  GMLSocketManager.swift
//  chacha
//
//  Created by guominglong on 2017/9/14.
//  Copyright © 2017年 SSdk. All rights reserved.
//

import Foundation
/**
 socket断开连接
 */
let SOCKET_DISCONNECT:NSNotification.Name = NSNotification.Name.init("socket_disconnect");

/**
 socket连接成功
 */
let SOCKET_CONNECTED:NSNotification.Name = NSNotification.Name.init("socket_connnected");

/**
 socket连接出错
 */
let SOCKET_ERROR:NSNotification.Name = NSNotification.Name.init("socket_error");

/**
 socket收到Socket发来的数据
 */
//let SOCKET_DATA:NSNotification.Name = NSNotification.Name.init("socket_data");
class GMLSocketManager: NSObject,AsyncSocketDelegate {
    
    open var timeOutInterval:TimeInterval = 50;
    open var sock:AsyncSocket!;
    fileprivate var heartTimer:Timer?;
    
    /*/**
     连接成功后的回调函数
     */
    fileprivate var connectedFunc:(()->Void)?;
    
    /**
     链接失败后的回调函数
     */
    fileprivate var connectErrFunc:(()->Void)?;
 */
    /**
     单例
     */
    static var instance:GMLSocketManager{
        get{
            struct GMLSocketManagerStruc{
                static var _ins = GMLSocketManager()
            }
            return GMLSocketManagerStruc._ins;
        }
    }
    
    override init() {
        super.init();
        sock = AsyncSocket(delegate: self);
        sock.setRunLoopModes([RunLoopMode.commonModes]);
        
        let model = Model_HeartBeat_c2s();
        model.cmd = GMLSocketCMD.c_req_s_heartbeat;
        model.localTime = UInt32(Date().timeIntervalSince1970);
        model.seq = 0;
        self.sendMsgToServer(model: model);
    }
    
    /**
     开始心跳
     */
    fileprivate func startHeart(){
        if (heartTimer != nil){
            return
        }
        heartTimer = Timer(timeInterval: timeOutInterval - 5, target: self, selector: #selector(xintiao), userInfo: nil, repeats: true);
        RunLoop.current.add(heartTimer!, forMode: RunLoopMode.commonModes);
        heartTimer!.fire();
    }
    
    /**
     心跳具体操作函数
     */
    open func xintiao(){
        let model = Model_HeartBeat_c2s();
        model.cmd = GMLSocketCMD.c_req_s_heartbeat;
        model.localTime = UInt32(Date().timeIntervalSince1970);
        model.seq = 0;
        self.sendMsgToServer(model: model);
    }
    /**
     停止心跳
     */
    fileprivate func stopHeart(){
        if let tim = heartTimer{
            tim.invalidate()
            heartTimer = nil;
        }
    }
    
    /**
     链接socket
     */
    open func connect(host:String,port:UInt16){
        do{
            try sock.connect(toHost: host, onPort: port, withTimeout: timeOutInterval);
        }catch{
            NSLog(error.localizedDescription)
            NotificationCenter.default.post(name: SOCKET_ERROR, object: ["code":10,"err":error.localizedDescription]);
        }
        
    }
    
    /**
     socket 断开连接
     */
    func onSocketDidDisconnect(_ sock: AsyncSocket!) {
        NSLog("socket链接断开");
        //停止心跳
        stopHeart();
        NotificationCenter.default.post(name: SOCKET_DISCONNECT, object: "");
    }
    
    func onSocketWillConnect(_ sock: AsyncSocket!) -> Bool {
        return true;
    }
    
    /**
     socket 连接成功
     */
    func onSocket(_ sock: AsyncSocket!, didConnectToHost host: String!, port: UInt16) {
        NotificationCenter.default.post(name: SOCKET_CONNECTED, object: ["hostName":host,"port":port]);
        //开启心跳
        startHeart();
        //读一个数据包
        sock.readData(withTimeout: timeOutInterval, tag: 0)
    }
    
    
    
    func onSocket(_ sock: AsyncSocket!, willDisconnectWithError err: Error?) {
        if err != nil{
            NSLog("socket出错,error:\(err!.localizedDescription)")
            NotificationCenter.default.post(name: SOCKET_ERROR, object: ["code":20,"err":err!.localizedDescription]);
        }
    }
    
    /**
     向服务器发送数据
     */
    func sendMsgToServer(model:BaseSocketModel_c2s){
        if let data = GMLSocketDataTool.instance.packageConvertToData(model),self.sock.isConnected(){
            NSLog("发送数据:\(model.cmd)");
            self.sock.write(data, withTimeout: self.timeOutInterval, tag: 0);
        }
    }
    
    /**
     接收到了socket数据
     */
    func onSocket(_ sock: AsyncSocket!, didRead data: Data!, withTag tag: Int) {
        if let model = GMLSocketDataTool.instance.dataConvertToPackage(data){
            NSLog("收到数据:\(model.cmd)");
        }
        //读下一个数据包，如果不这么写socket不会监听到断开
        sock.readData(withTimeout: timeOutInterval, tag: 0)
    }
    
}
