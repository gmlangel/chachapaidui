//
//  MainViewController.swift
//  chacha
//
//  Created by guominglong on 2017/9/22.
//  Copyright © 2017年 SSdk. All rights reserved.
//

import Foundation
import SnapKit
class MainViewController: NSViewController {
    fileprivate var gmlv:View_login!;
    override func viewDidLoad() {
        super.viewDidLoad();
        self.view.wantsLayer = true;
        self.view.layer?.backgroundColor = GMLSkinManager.instance.mainBackgroundColor;
        
        gmlv = View_login(frame: NSRect(x: 0, y: 0, width: 200, height: self.view.frame.size.height));
        self.view.addSubview(gmlv);
        gmlv.snp.makeConstraints { (make) in
            make.height.equalTo(self.view);
        }
    }
    
    override func viewDidAppear() {
        super.viewDidAppear();
        self.view.window?.makeFirstResponder(nil);
    }
}
