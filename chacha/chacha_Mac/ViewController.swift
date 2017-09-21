//
//  ViewController.swift
//  chacha_Mac
//
//  Created by guominglong on 2017/9/14.
//  Copyright © 2017年 SSdk. All rights reserved.
//

import Cocoa

class ViewController: NSViewController,POPAnimationDelegate {

    fileprivate var myView:NSView!;
    fileprivate var ani:POPBasicAnimation!;
    fileprivate var ani_fan:POPBasicAnimation!;
    override func viewDidLoad() {
        super.viewDidLoad()

        // Do any additional setup after loading the view.
        myView = NSView(frame: NSRect(x: 0, y: 0, width: 100, height: 100));
        self.view.addSubview(myView)
        myView.wantsLayer = true;
        myView.layer?.backgroundColor = NSColor.red.cgColor;
        
        ani = POPBasicAnimation.init(propertyNamed: kPOPViewFrame);
        ani.toValue = NSRect(x: 200, y: 0, width: 100, height: 100);
        
        ani.delegate = self;
        
        ani_fan = POPBasicAnimation.init(propertyNamed: kPOPViewFrame);
        ani_fan.toValue = NSRect(x: 0, y: 0, width: 100, height: 100);
        ani_fan.delegate = self;
        
        myView.pop_add(ani, forKey: "bbb");
        
        let textf:NSTextField = NSTextField(labelWithString: "SDFDF");
        
        myView.addSubview(textf);
    }
    
    func pop_animationDidStop(_ anim: POPAnimation!, finished: Bool) {
        if finished{
            var nextAni:POPBasicAnimation? = nil
            if anim == ani{
                nextAni = ani_fan;
            }else{
                nextAni = ani;
            }
            nextAni!.beginTime = CACurrentMediaTime() + 1.0
            myView.pop_removeAnimation(forKey: "bbb");
            myView.pop_add(nextAni!, forKey: "bbb");
        }
    }

    override var representedObject: Any? {
        didSet {
        // Update the view, if already loaded.
        }
    }


}

