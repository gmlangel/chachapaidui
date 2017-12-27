//  教学容器
//  ViewTeachingContainer.swift
//  chacha
//
//  Created by guominglong on 2017/9/27.
//  Copyright © 2017年 SSdk. All rights reserved.
//

import Foundation
class View_TeachingContainer: GMLView {
    
    var pdfV:View_PDF!;
    
    fileprivate var loading:NSProgressIndicator!;
    override func gml_initialUI() {
        //添加教材显示容器
        pdfV = View_PDF(frame: NSRect(x: 0, y: 0, width: 100, height: 100));
        self.addSubview(pdfV);
        pdfV.snp.makeConstraints { (make) in
            make.edges.equalTo(self.snp.edges);
        }
        
        //添加教材测试按钮
        let btn_loadPdf = GMLSkinManager.instance.getCurrentBtn(NSRect(x: 0, y: 0, width: 120, height: 30));
        btn_loadPdf.stringValue = "加载教材";
        self.addSubview(btn_loadPdf);
        btn_loadPdf.snp.makeConstraints { (make) in
            make.width.equalTo(120);
            make.height.equalTo(30);
            make.bottom.equalTo(self.snp.bottom).offset(-20);
            make.centerX.equalTo(self);
        }
        btn_loadPdf.target = self;
        btn_loadPdf.action = #selector(toLoadPdf);
        
        //添加loading
        loading = NSProgressIndicator(frame: NSZeroRect);
        loading.style = .spinning;
        loading.isHidden = true;
        self.addSubview(loading)
        loading.snp.makeConstraints { (make) in
            make.width.equalTo(40);
            make.height.equalTo(40);
            make.centerX.equalTo(self.snp.centerX);
            make.centerY.equalTo(self.snp.centerY);
        }
    }
    
    /**
     加载pdf教材，测试用
     */
    @objc func toLoadPdf(_ sender:Any){
        //let urlStr = "/Users/guominglong/Documents/51TalkAbout/51talkPDFS/0de809088645c56e0801b980f55e0cd7.pdf";
        let urlStr = "http://172.16.220.80:3000/15de3096cf8aa923f59c20d473c69c1d.pdf";
        
        var url:URL;
        if urlStr.contains("http://") || urlStr.contains("https://")
        {
            url = URL(string: urlStr)!;
            loading.isHidden = false;
            NSURLConnection.sendAsynchronousRequest(URLRequest(url:url), queue: OperationQueue.main) { (resp, pdfData, err) in
                self.loading.isHidden = true;
                if(err != nil) {
                }else{
                    DispatchQueue.main.async {
                        self.pdfV.fillPdf(pdfData as AnyObject, pageID: 0);
                    }
                }
            }
        }else{
            url = URL(fileURLWithPath: urlStr);
            //加载本地pdf
            DispatchQueue.global().async {
                
                do{
                    let pdfData = try Data(contentsOf: url, options: Data.ReadingOptions.uncached);
                    DispatchQueue.main.async {
                        self.pdfV.fillPdf(pdfData as AnyObject, pageID: 0);
                    }
                    
                }catch{
                    Swift.print("pdf加载失败")
                }
            }
        }
        
        
        
        
        
        //通知远端加载pdf
        let teaModel = Model_currentCMD_c2s();
        teaModel.rid = GlobelInfo.instance.classInfo!.rid;
        teaModel.uid = GlobelInfo.instance.userInfo!.uid;
        teaModel.data = ["cmd":"loadpdf","path":urlStr];
        GMLSocketManager.instance.sendMsgToServer(model: teaModel);
    }
}
