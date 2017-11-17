//  视频容器视图
//  View_MediaContainer.swift
//  chacha
//
//  Created by guominglong on 2017/9/27.
//  Copyright © 2017年 SSdk. All rights reserved.
//

import Foundation
class View_MediaContainer: GMLView {
    var localView:NSView!;//本地视图
    var remoteView:NSView!;//远端视图
    override func gml_initialUI() {
        localView = NSView(frame:NSZeroRect);
        self.addSubview(localView);
        localView.snp.makeConstraints { (make) in
            make.width.equalTo(400);
            make.height.equalTo(300)
            make.left.equalTo(self.snp_leftMargin);
            make.top.equalTo(self.snp.top);
        }
        
        remoteView = NSView(frame:NSZeroRect);
        self.addSubview(remoteView);
        remoteView.snp.makeConstraints { (make) in
            make.width.equalTo(400);
            make.height.equalTo(300)
            make.left.equalTo(self.snp_leftMargin);
            make.top.equalTo(localView.snp.bottom);
        }
    }
}
