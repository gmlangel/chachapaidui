//  日志中心
//  GMLLogCenter.swift
//  Chaos
//
//  Created by guominglong on 16/6/3.
//  Copyright © 2016年 guominglong. All rights reserved.
//

import Foundation
class GMLLogCenter:NSObject {
    /**
     程序运行打点数据的日志路径
     */
    fileprivate var runningLogPath:String!;
    fileprivate var runningFileHandler:FileHandle?;
    fileprivate var dateFormat:DateFormatter!;
    fileprivate var fileNameDateFormat:DateFormatter!;
    static var instance:GMLLogCenter{
        get{
            struct gmllgoIns {
                static var _ins:GMLLogCenter = GMLLogCenter();
            }
            return gmllgoIns._ins;
        }
        
        
    }
    
    
    /**
     启动日志系统
     */
    func start()
    {
        dateFormat = DateFormatter()
        dateFormat.dateFormat = "yyyy-MM-dd HH:mm:ss.SSS";
        
        fileNameDateFormat = DateFormatter();
        fileNameDateFormat.dateFormat = "yyyy-MM-dd_HH_mm_ss";
        runningLogPath = String(format:"%@/game_current%@.log",GMLGameConfig.logPaths()[0],fileNameDateFormat.string(from: Date()));

        
        if(!FileManager.default.fileExists(atPath: runningLogPath))
        {
            //如果日志不存在，则手动创建日志
            do{
                try "".write(toFile: runningLogPath, atomically: true, encoding: String.Encoding.utf8);
                runningFileHandler = FileHandle(forUpdatingAtPath: runningLogPath);
            }catch{
                NSLog("创建日志路径失败:\(runningLogPath)");
            }
        }
        
    }
    
    /**
     输出日志(Debug模式)
     */
    func trace(_ msg:String?,_needTrace:Bool = true,_needWriteToFile:Bool = true){
        if(msg == nil)
        {
            return ;
        }
        
        if(_needTrace)
        {
            NSLog(msg!);
        }
        if(_needWriteToFile)
        {
            runningFileHandler?.seekToEndOfFile();
            runningFileHandler?.write(msgAppendDateTime("\(msg!)\n").data(using: String.Encoding.utf8)!);
        }
    }
    
    /**
     追加日志时间
     */
    fileprivate func msgAppendDateTime(_ msg:String)->String
    {
        return String(format: "[%@]%@", dateFormat.string(from: Date()),msg);
    }
    
//    
//    /**
//     输出日志(release模式)
//     */
//    private func traceFuncRelease(msg:String?,_needTrace:Bool = true,_needWriteToFile:Bool = true){
//        if(msg == nil)
//        {
//            return ;
//        }
//        runningFileHandler?.seekToEndOfFile();
//        runningFileHandler?.writeData(msg!.dataUsingEncoding(NSUTF8StringEncoding)!);
//        
//    }
    
}
