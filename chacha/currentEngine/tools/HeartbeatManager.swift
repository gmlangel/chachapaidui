//  心跳控制器
//  心跳任务
//  AC for swift
//
//  Created by guominglong on 15/5/20.
//  Copyright (c) 2015年 guominglong. All rights reserved.
//

import Foundation

open class HeartbeatManager: NSObject {
    
    fileprivate var taskArr:NSMutableDictionary;
    open class var instance:HeartbeatManager{
        get{
            struct HeartbeatIns {
                static var _ins:HeartbeatManager = HeartbeatManager();
            }
            return HeartbeatIns._ins;
        }
    }
    
    public override init() {
        taskArr = NSMutableDictionary();
        super.init();
    }
    
    open func hasTask(_ taskName:String)->Bool
    {
        return taskArr.value(forKey: taskName) != nil;
    }
    
    /**
    绑定任务
    sel 要绑定的函数
    ti  间隔时间
    tg  target
    taskName 绑定名称
    repeats 是否循环执行
    */
    open func addTask(_ sel:Selector,ti:TimeInterval,tg:AnyObject,taskName:String,repeats:Bool = true)
    {
        let nt:Timer = Timer.scheduledTimer(timeInterval: ti, target: tg, selector: sel, userInfo: nil, repeats: repeats);
        taskArr.setObject(nt, forKey: taskName as NSCopying);
    }
    
    /**
    删除绑定的任务
    */
    open func removeTask(_ taskName:String)
    {
        if(hasTask(taskName) == false)
        {
            return;
        }
        let nt:Timer = taskArr.object(forKey: taskName)as! Timer;
        nt.invalidate();
        taskArr.removeObject(forKey: taskName);
    }
    
    /**
    移除所有任务
    */
    open func removeAllTask()
    {
        var arr:Array = taskArr.allKeys;
        var nt:Timer;
        for i:Int in 0..<arr.count
        {
            nt = taskArr.object(forKey: arr[i]) as! Timer;
            nt.invalidate();
            taskArr.removeObject(forKey: arr[i]);
        }
    }
    

    
}
