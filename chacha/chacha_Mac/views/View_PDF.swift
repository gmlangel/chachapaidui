//
//  View_PDF.swift
//  chacha
//
//  Created by guominglong on 2017/11/16.
//  Copyright © 2017年 SSdk. All rights reserved.
//

import Foundation
class View_PDF:NSView
{
    var cgpdfDocu:CGPDFDocument?;
    /**
     pdf原始尺寸
     */
    var sourcePDFSize:NSSize! = NSMakeSize(0, 0);
    var pdfContainer:NSPDFImageRep?;
    var h:CGFloat = 0;
    var zeroSize:NSSize = NSMakeSize(0, 0);
    var totalPages:Int!{
        get{
            if( pdfContainer == nil)
            {
                return 1
            }else{
                return pdfContainer?.pageCount;
            }
        }
    }
    
    var gSize:NSSize{
        get{
            if(pdfContainer != nil)
            {
                zeroSize.height = ((self.pdfContainer?.bounds.height)!)*(self.bounds.width/((self.pdfContainer?.bounds.width)!));
                zeroSize.width = self.bounds.width;
                return zeroSize;
            }
            else
            {
                return zeroSize;
            }
        }
    }
    override init(frame frameRect: NSRect) {
        
        
        let rect = NSRect(origin: frameRect.origin, size: CGSize(width: frameRect.size.width < 0 ? 0 : frameRect.size.width, height: frameRect.size.height < 0 ? 0 : frameRect.size.height));
        super.init(frame: rect);
        
    }
    
    required init?(coder: NSCoder) {
        super.init(coder: coder);
    }
    
    
    var currentPageId:Int{
        get{
            if(pdfContainer == nil)
            {
                return 0;
            }else
            {
                return (pdfContainer?.currentPage)!;
            }
        }
        set{
            if(pdfContainer != nil)
            {
                if(pdfContainer!.pageCount > newValue && newValue >= 0)
                {
                    pdfContainer?.currentPage = newValue;
                    self.setNeedsDisplay(self.bounds);
                    //setPages!((pdfContainer?.currentPage)!,(pdfContainer?.pageCount)!);
                }
            }
        }
    }
    
    
    /**
     总页数
     */
    func totalPageCount()->UInt
    {
        if(pdfContainer == nil)
        {
            return 0;
        }else
        {
            return UInt((pdfContainer?.pageCount)!);
        }
    }
    
    override func draw(_ dirtyRect: NSRect) {
        
        if(nil != pdfContainer)
        {
            h = ((self.pdfContainer?.bounds.height)!)*(dirtyRect.width/((self.pdfContainer?.bounds.width)!));
            
            var resizeImageRect = NSMakeRect(0, 0, CGFloat(dirtyRect.width), CGFloat(h))
            let resizeImagecgImaage = pdfContainer?.cgImage(forProposedRect: &resizeImageRect, context: nil, hints: nil)
            let pdfImage = NSImage(cgImage: resizeImagecgImaage!, size: NSMakeSize(CGFloat(dirtyRect.width), CGFloat(h)))
            let tempY = (self.bounds.size.height - h)/2;
            pdfImage.draw(at: NSMakePoint(dirtyRect.origin.x, tempY), from: resizeImageRect, operation: .sourceOver, fraction: 1.0)
        }
    }
    
    override func viewDidMoveToWindow() {
        if self.window == nil{
            pdfContainer = nil;
        }
    }
    
    deinit {
        
    }
    
    /**
     加载pdf
     */
    func fillPdf(_ _pdf:AnyObject,pageID:UInt16)
    {
        
        // 加载pdf
        pdfContainer = NSPDFImageRep(data: _pdf as! Data);
        
        if(pdfContainer?.size.width == 0 || pdfContainer?.size.height == 0)
        {
            pdfContainer = nil;
            Swift.print("教材加载失败");
            return;
        }
        //cgpdfDocu = getPdfDocumentByPath("/Users/guominglong/Documents/51TalkAbout/51talkPDFS/ea8f86220bfa1a22b85ae0f0ef345815.pdf");
        let n:NSNumber = NSNumber(value: pageID as UInt16);
        currentPageId = n.intValue;
        //setPages!(currentPageId,(pdfContainer?.pageCount)!);
        sourcePDFSize = (pdfContainer?.bounds.size)!;
        //h = ((self.pdfContainer?.bounds.height)!)*(self.frame.width/((self.pdfContainer?.bounds.width)!));
        //self.frame = NSMakeRect(self.frame.origin.x, self.frame.origin.y, self.frame.width, h);
        self.setNeedsDisplay(self.bounds);
        self.display(self.bounds)
    }
    
    override func setFrameSize(_ newSize: NSSize) {
        super.setFrameSize(newSize);
    }
    
}
