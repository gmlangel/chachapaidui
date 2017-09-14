//  资源管理器
//  GMLResourceManager.swift
//  Chaos
//
//  Created by guominglong on 16/6/3.
//  Copyright © 2016年 guominglong. All rights reserved.
//

import Foundation
class GMLResourceManager:NSObject,ZipArchiveDelegate {
    /**
     文理集合
     */
    var textureDic:[String:SKTexture]!;
    
    /**
     存储资源名称对应texture和媒体资源的NSData
     */
    fileprivate var resourceDataDic:[String:Data]!;
    
    /**
     存储资源名称对照表
     */
    fileprivate var resourceTable:[String:[String]]!;
    
    /**
     存储资源名称对应配置文件
     */
    fileprivate var resourceConfitDic:[String:NSDictionary]!;
    
    
    fileprivate var zipTool:ZipArchive!;
    fileprivate var currentResourceKey:String!;//当前正在加载的资源包的KEY
    fileprivate var resourceIsLoading:Bool! = false;//是否正在加载一个资源
    
    /**
     等待加载的资源包
     */
    fileprivate var waitLoad:[[String:String]]!;
    
    
    fileprivate var completeSelectorTarget:AnyObject?;
    fileprivate var completeSelector:Selector?;
    static var instance:GMLResourceManager{
        get{
            struct gmlResourceIns {
                static var _ins:GMLResourceManager = GMLResourceManager();
            }
            return gmlResourceIns._ins;
        }
    }
    
    override init(){
        super.init();
        textureDic = [String:SKTexture]();
        resourceDataDic = [String:Data]();
        resourceTable = [String:[String]]();
        resourceConfitDic = [String:NSDictionary]();
        waitLoad = [[String:String]]();
        zipTool = ZipArchive();
        zipTool.delegate = self;
    }
    
    /**
     资源包解压失败
     */
    func errorMessage(_ msg: String!) {
        GMLLogCenter.instance.trace(msg);
        waitLoad.remove(at: 0);
        loadResource();//判断是否还有 没被加载的资源包，并加载
    }
    
    /**
     资源包解压成功
     */
    func unzipFileAsyncComplete(_ reusltDic: NSMutableDictionary!) {
        zipTool.closeZipFile2();
        resourceTable[currentResourceKey] = [];
        
        DispatchQueue.global(priority: DispatchQueue.GlobalQueuePriority.default).async { 
            //解析resourceDic
            var keyStrNS:NSString;//key的NSString形式
            var extenName:String;//扩展名
            var keyStr:String;//key的String形式
            for key in reusltDic.allKeys
            {
                keyStrNS = key as! NSString;
                extenName = keyStrNS.pathExtension.lowercased();//获取扩展名
                keyStrNS = keyStrNS.deletingPathExtension.replacingOccurrences(of: "/", with: "_") as NSString;//删除扩展名,同时将路径/  转换为_,最终获取文件名
                keyStr = keyStrNS as String;
                
                if(keyStr.contains("__MACOSX") || extenName == "" || keyStr.contains(".DS_Store"))
                {
                    //系统缓存文件或者没有扩展名的文件，不解析
                    continue;
                }else if(extenName == "plist")
                {
                    let filePath = GMLTool.documentPath() + "/\(key)";
                    //创建本地的临时配置文件，以供加载
                    if((try? (reusltDic.value(forKey: key as! String) as! Data).write(to: URL(fileURLWithPath: filePath), options: [.atomic])) != nil)
                    {
                        if((key as AnyObject).contains("Config."))
                        {
                            //主程序配置文件，一般情况下只有main资源包内才有两个这样的文件，分别是 AllMonsterConfig用于存储所有资源包内的monster的对照表。AllSceneConfig用于存储所有资源包内的scene的对照表
                        }else if((key as AnyObject).contains("Scene."))
                        {
                            //场景配置文件
                        }else if((key as AnyObject).contains("Monster.")){
                            //怪物配置文件
                        }
                        self.resourceConfitDic[keyStr] = NSDictionary(contentsOfFile: filePath);
                        //加载完毕后移除这个配置文件
                        do{
                            try FileManager.default.removeItem(atPath: filePath);
                            //配置文件,存储到资源名称对照表和配置集合中
                            self.resourceTable[self.currentResourceKey]!.append(keyStr);
                        }catch{
                            GMLLogCenter.instance.trace("[UnzipFileAsyncComplete]配置文件转换失败:\(key)");
                        }
                        
                    }
                }else if(extenName == "png" || extenName == "jpg")
                {
                    //texture资源,存储到资源名称对照表和资源集合中
                    self.resourceTable[self.currentResourceKey]!.append(keyStr);
                    self.resourceDataDic[keyStr] = reusltDic.value(forKey: key as! String) as! Data;
                }else{
                    //媒体资源,存储到资源名称对照表和资源集合中
                    self.resourceTable[self.currentResourceKey]!.append(keyStr);
                    self.resourceDataDic[keyStr] = reusltDic.value(forKey: key as! String) as! Data;
                }
            }
            
            DispatchQueue.main.async(execute: {
                GMLLogCenter.instance.trace("[UnzipFileAsyncComplete]资源解压完毕:" + self.currentResourceKey);
                self.waitLoad.remove(at: 0);
                self.loadResource();//判断是否还有 没被加载的资源包，并加载
            })
        }
        
        
        
    }
    
    /**
     加载资源包
     */
    func loadResourcePick(_ key:String,resourcePath:String,completeSelector:Selector? = nil,completeSelectorTarget:AnyObject? = nil)
    {
        self.completeSelector = completeSelector;
        self.completeSelectorTarget = completeSelectorTarget;
        if(resourceTable.keys.contains(key))
        {
            //已经加载的资源包就不重复加载了
            GMLLogCenter.instance.trace("[loadResourcePick]不需要重复加载资源包:" + key);
            return;
        }
        waitLoad.append([key:resourcePath]);
        if(!resourceIsLoading)
        {
            //如果当前处于空闲状态，则直接开始加载资源。否则只能等待之前的资源加载完毕后，程序自动处理等待任务
            loadResource();
        }
    }
    
    fileprivate func loadResource()
    {
        if(waitLoad.count == 0)
        {
            resourceIsLoading = false;
            //执行加载完毕处理函数
            if(completeSelector != nil && completeSelectorTarget != nil)
            {
                if(completeSelectorTarget!.responds(to: completeSelector!))
                {
                    completeSelectorTarget!.perform(completeSelector!);
                }
            }
            return;
        }
        resourceIsLoading = true;
        currentResourceKey = waitLoad[0].keys.first;
        if(zipTool.unzipOpenFile(Bundle.main.path(forResource: waitLoad[0].values.first, ofType: "zip"))){
            zipTool.unzipFileToDictionary_Async()
        }else{
            GMLLogCenter.instance.trace("[loadResourcePick]资源包不存在 :"+currentResourceKey+"   "+waitLoad[0].values.first!);
            waitLoad.remove(at: 0);
            loadResource();
        }
    }
    
    /**
     根据纹理名称获得纹理
     */
    func textureByName(_ key:String)->SKTexture?
    {
        if(textureDic.keys.contains(key))
        {
            //遍历文理集合
            return textureDic[key];
        }
        else if(resourceDataDic.keys.contains(key)){
            //纹理集合中没有指定的纹理，则通过NSData创建一个纹理
            textureDic[key] = GMLTool.image(by: resourceDataDic[key]! as Data);
            return textureDic[key];
        }
        else{
            GMLLogCenter.instance.trace("[textureByName]请求的纹理资源不存在"+key);
            return nil;
        }
    }
    
    /**
     根据key获取配置文件
     */
    func configByName(_ key:String)->NSDictionary?{
        if(resourceConfitDic.keys.contains(key))
        {
            return resourceConfitDic[key];
        }else{
            return nil;
        }
    }
    
    
}
