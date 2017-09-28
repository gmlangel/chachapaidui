//  课表
//  View_ClassList.swift
//  chacha
//
//  Created by guominglong on 2017/9/27.
//  Copyright © 2017年 SSdk. All rights reserved.
//

import Foundation
class View_ClassList: GMLView,NSCollectionViewDataSource,NSCollectionViewDelegate {
    //教室信息数组
    fileprivate var classlistArr:[RoomInfo] = [RoomInfo]();
    fileprivate var listContainer:NSCollectionView!;
    override func gml_initialUI() {
        //初始化课表容器
        listContainer = NSCollectionView(frame: NSRect(x: 0, y: 0, width: 100, height: 100));
        listContainer.maxItemSize = NSSize(width: 500, height: 500);
        let lao = NSCollectionViewFlowLayout();
        lao.scrollDirection = .vertical;
        lao.estimatedItemSize = NSSize(width: 300, height: 300);
        listContainer.collectionViewLayout = lao;
        listContainer.register(ClassListItem.self, forItemWithIdentifier: "currentItem");
        listContainer.register(ClassListItem_Add.self, forItemWithIdentifier: "addClassListItem");
        listContainer.dataSource = self;
        listContainer.delegate = self;
        
        
        self.addSubview(listContainer);
        listContainer.snp.makeConstraints { (make) in
            make.width.equalTo(self);
            make.height.equalTo(self);
        }
        
    
        
        gml_addEvents();
    }
    
    override func gml_addEvents() {
        NotificationCenter.default.addObserver(self, selector: #selector(getClassListCallback), name: SOCKET_GETROOMSINFOBYUSER, object: nil);
        NotificationCenter.default.addObserver(self, selector: #selector(createRoomCallback), name: SOCKET_CREATEROOM, object: nil)
        NotificationCenter.default.addObserver(self, selector: #selector(deleteRoomCallback), name: SOCKET_DELETEROOM, object: nil)
    }
    
    override func gml_removeEvents() {
        NotificationCenter.default.removeObserver(self);
    }
    
    /**
     获取课程列表信息回调
     */
    func getClassListCallback(_ notify:NSNotification){
        if let s2cModel = notify.object as? Model_getRoomsInfoByUser_s2c{
            if s2cModel.code == 0{
                Swift.print("获取课表成功");
            }else{
                Swift.print("获取课表失败.\(s2cModel.faildError)");
            }
        }
    }
    
    /**
     创建教室回调
     */
    func createRoomCallback(_ notify:NSNotification){
        if let s2cModel = notify.object as? Model_createRoom_s2c{
            if s2cModel.code == 0{
                Swift.print("创建教室成功");
            }else{
                Swift.print("创建教室失败.\(s2cModel.faildError)");
            }
        }
    }
    
    /**
     创建教室回调
     */
    func deleteRoomCallback(_ notify:NSNotification){
        if let s2cModel = notify.object as? Model_deleteRoom_s2c{
            if s2cModel.code == 0{
                Swift.print("删除教室成功");
            }else{
                Swift.print("删除教室失败.\(s2cModel.faildError)");
            }
        }
    }
    
    //MARK:CollectionView部分的实现-----------
    func collectionView(_ collectionView: NSCollectionView, numberOfItemsInSection section: Int) -> Int {
        return 20;//正式用classlistArr.count
    }
    
    func collectionView(_ collectionView: NSCollectionView, itemForRepresentedObjectAt indexPath: IndexPath) -> NSCollectionViewItem {
        if Int(indexPath.last!) == 19{
            //最后一个现实添加面板
            return collectionView.makeItem(withIdentifier: "addClassListItem", for: indexPath);
        }else{
            //其它的显示通用面板
            return collectionView.makeItem(withIdentifier: "currentItem", for: indexPath);
        }
    }
    
}

/**
 普通的classlistItem
 */
class ClassListItem:NSCollectionViewItem{

    override init?(nibName nibNameOrNil: String?, bundle nibBundleOrNil: Bundle?) {
        super.init(nibName: "", bundle: Bundle.main)
        self.view = NSView(frame: NSRect(x: 0, y: 0, width: 300, height: 300));
        self.viewDidLoad();
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    override func viewDidLoad() {
        self.view.wantsLayer = true;
        self.view.layer?.backgroundColor = NSColor.red.cgColor;
    }
}

/**
 用于添加课程的classlistItem
 */
class ClassListItem_Add:NSCollectionViewItem{
    
    override init?(nibName nibNameOrNil: String?, bundle nibBundleOrNil: Bundle?) {
        super.init(nibName: "", bundle: Bundle.main)
        self.view = NSView(frame: NSRect(x: 0, y: 0, width: 100, height: 300));
        self.viewDidLoad();
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    override func viewDidLoad() {
        self.view.wantsLayer = true;
        self.view.layer?.backgroundColor = NSColor.blue.cgColor;
    }
}
