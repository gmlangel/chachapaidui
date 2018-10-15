/**
 * Created by Administrator on 2016/8/16.
 * module info:
 *          白板模块
 */
define('whiteBoard',['boardConf','enDataSend'],function (require,exports,module) {
    var seaConf=require('boardConf').conf,
        seaDataSend=require('enDataSend');
    var WEBTools={
        conf:{
            //user type  用户类型
            'type':'stu',
            //pause to draw there is some thing is not allowed to draw  ,eg:tea is out class ,stu is not allowed to draw  暂停绘制？
            'pauseDraw':true,
            //'show' and 'draw',two kind module  当前模式：绘制模式（允许绘制）：显示模式（不允许绘制但是可以显示服务器的绘制信息）？
            'paintModule':'show',
            //something used to control if new handle is opened  版本：控制新功能是否开启的 新橡皮 拖拽 重写
            'version':'old',
            //conf info for draw handle  绘制的基本信息配置
            'pencil':{
                'color':'#0078FF',
                'size':3
            },
            'rub':{//旧版橡皮擦
                'size':30
            },
            'sign_pencil':{
                'color':'#FFFF00',
                'size':20
            },
            'font':{
                'fontStyle':'songti',
                'fontSize':32,
                'fontColor':'#0078FF'
            },
            'target':{//当前笔迹 高亮
                'color':'#0000FF'
            },
            'canvas':{
                //canvas info
                'target':null,//show result canvas 结果层
                'targetContext':null,//2d obj  结果层的2d对象
                'targetBak':null,//show progress canvas  过程层
                'targetBakContext':null,//2d obj  过程层的2d对象
                'width':0,  //宽度
                'height':0,  //高度
                'left':0, //左边距
                'top':0, //上边距
                //tea's font color 老师的文字颜色
                'teaFontC':'',
                //tea's pen's color 老师的画笔颜色
                'teaPenC':'',
                //info of tea's sign pen 老师的荧光笔颜色
                'teaSignPen':'',
                //stu's font color 学生的文字颜色
                'stuFonC':'',
                //stu's pen color 学生的画笔颜色
                'stuPenC':'',
                //info of stu'd sign pen 学生的荧光笔颜色
                'stuSignPen':''
            },
            'paintBoard':{
                'PaintBoard':null,//paint board target 画布容器的对象
                'input':null,//progress input for drag 文本输入框容器的对象
                'edit':null,//progress edit 文字输入框的对象
                //策略：建立一个用户看不到的和input和edit完全相同的输入框和容器，输入已经输入的文字，判断何时换行
                'inputBak':null,//for show words(when newline) 用于识别单词何时换行
                'inputBakContain':null//for show words(when newline) 用于识别单词何时换行
            }
        },
        'recordConArr':[],//record all paint handle 记录所有的绘制数据信息
        'orderList':[],//record all order according time 存储操作序列 先后顺序
        'svcId':1,//svc id 维护确保每一条笔迹有不同的id号

        binded:false,//防止未绑定
        curDrawType:'pen',//used to remember current draw type,first time used to set default handle type 记录当前的画笔类型
        //表示鼠标移动时上一步是否有颜色变化
        //last time there is a color change or not
        colorChange:false,
        colorChangeId:-1,//record last color changed target id 记录上一个颜色变化的id

        //move之前是否触发了down事件防止没有点击操作时的move事件执行
        //down event is made or not before move event
        downEvent:false,
        //当up事件被触发,用于检测是否为移出画布被触发
        //out event is made or not when up event is alive
        outEvent:false,
        //record current target name 记录当前的笔迹对象
        curTarget:null,

        dragData:{
            //initial left and top
            initialLeft:0,//记录目标对象的初始左偏移
            initialTop:0,//记录目标对象的初始右偏移
        },

        textData:{
            signTextDrag:false,//writing drag or not? 区分是否在文字编辑的过程中进行了文本框的移动
            signREdit:false,//sign of reedit 文本编辑是否处于重写模式
            inputBorder:0,  //用于拖动的外边框的宽度
            inputMaxWid:0, //编辑框容器的最大的宽度，用于自动换行
            inputMaxHei:0, //编辑框容器的最大的高度，用于自动换行
            fontSize:0, //文字的大小
            //record text input to avoid height is overtop 记录当前已经输入的文本信息，用于当输入文字超出最大高度时的文本还原
            textInput:'',
            //记录上一次已经输入的文本信息，用于当输入文字超出最大高度时的文本还原
            lastTextInput:'',
            //record mouse point when text for click to drag 记录鼠标信息，用于拖拽
            pointXTD:0,
            pointYTD:0,
            //record input left and top
            pointLeftTD:0,//文字输入框左上角位置
            pointTopTD:0,//文字输入框左上角位置
        },

        mouseData:{//鼠标信息
            //开始位置
            startX:0,
            startY:0,
            //当前位置
            nowX:0,
            nowY:0,
            //结束的位置
            endX:0,
            endY:0,
            //一次过程中最小的x坐标
            minX:0,
            //一次过程中最小的y坐标
            minY:0,
            //一次过程中最大的x坐标
            maxX:0,
            //一次过程中最大的y坐标
            maxY:0,
            //记录所有的点信息
            pointArr:[]//record all mouse point data
        },

        initWEBTools:function (){
            if(document.getElementById("canvas")!=undefined){
                //初始化对象信息，注意防止出现null或者undefined错误
                this.conf.canvas.target=document.getElementById("canvas");//结果层
                this.conf.canvas.targetBak=document.getElementById("canvas_bak");//过程层
                this.conf.canvas.targetContext=this.conf.canvas.target.getContext('2d');
                this.conf.canvas.targetBakContext=this.conf.canvas.targetBak.getContext('2d');

                this.conf.paintBoard.PaintBoard=document.getElementById('paintBoard');//画布容器
                this.conf.paintBoard.input=document.getElementById('input');//输入框容器
                this.conf.paintBoard.edit=document.getElementById('edit');//输入框
                this.conf.paintBoard.inputBak=document.getElementById("inputBak");
                this.conf.paintBoard.inputBakContain=document.getElementById('inputBakContain');
                //先隐藏文字输入框
                this.conf.paintBoard.input.style.display='none';
                //document.title='Html_White_Board';
                //初始化canvas中的老师和学生的配置信息
                this.conf.canvas.stuFonC=seaConf.board.stu.font.fontColor;
                this.conf.canvas.stuPenC=seaConf.board.stu.pencil.color;
                this.conf.canvas.stuSignPen=seaConf.board.stu.sign_pencil.color;
                this.conf.canvas.teaFontC=seaConf.board.tea.font.fontColor;
                this.conf.canvas.teaPenC=seaConf.board.tea.pencil.color;
                this.conf.canvas.teaSignPen=seaConf.board.tea.sign_pencil.color;

                //---------------为了防止老师不允许划线的意外---------------------
                if(seaConf.user.type==='tea'){
                    this.conf.pauseDraw=false;
                }
                //---------------为了防止老师不允许划线的意外---------------------

                //如果当前模式是绘制模式 防止建立多余的监听机制
                if(this.conf.paintModule=='draw'){
                    //建立文本编辑过程中的键盘事件  两个事件必须同时监听否则会出现监听不到的现象
                    /*WEBTools.conf.paintBoard.edit.onkeyup= function (e) {
                        WEBTools.key_event(WEBTools.conf.paintBoard.edit,e);
                    }
                    WEBTools.conf.paintBoard.edit.onkeydown= function (e) {
                        WEBTools.key_event(WEBTools.conf.paintBoard.edit,e);
                    }*/
                    //初始化默认的当前的画笔
                    WEBTools.draw(WEBTools.curDrawType);
                    //绑定画布的鼠标事件
                    WEBTools.bind(WEBTools.conf.canvas.targetBak);
                    //绑定文本操作中的事件
                    WEBTools.bind(WEBTools.conf.paintBoard.input);
                    WEBTools.binded=true;
                }
            }
        },

        review: function (wid,hei,left,top) {
            wid=Math.round(wid);
            hei=Math.round(hei);
            left=Math.round(left);
            top=Math.round(top);
            //-----------------------屏蔽缩放屏幕时的文字错乱---------------------------
            if(WEBTools.conf.paintBoard.input&&WEBTools.conf.paintBoard.input.style.display!='none'){
                WEBTools.write_end();
            }
            //-----------------------屏蔽缩放屏幕时的文字错乱---------------------------
            //防止出现null和undefined 防止未初始化现象
            if(!this.conf.canvas.target){
                this.initWEBTools();
            }
            console.log('[%s] -----------> resize paint size: (width,height,left,top)(%d,%d,%d,%d)',window.getTimeNow(),wid,hei,left,top);
            //一些别名
            var temPBS=this.conf.paintBoard.PaintBoard.style,
                temIBCS=this.conf.paintBoard.inputBakContain.style,
                temCanvas=this.conf.canvas.target,
                temCanvasBak=this.conf.canvas.targetBak;
            //设置容器的位置属性
            temPBS.width=wid+'px';
            temPBS.height=hei+'px';
            temPBS.left=left+'px';
            temPBS.top=top+'px';
            //used to achieve text tool,user can not see  保证用户看不到用于判断换行的input和edit，不能隐藏，否则监听不到换行
            temIBCS.top=top+'px';
            temIBCS.left=left+'px';
            //设置画布的位置属性
            temCanvas.width=wid;
            temCanvas.height=hei;
            temCanvasBak.width=wid;
            temCanvasBak.height=hei;
            //获取offset信息，防止绘制的偏移现象
            var offset=WEBTools.getOffset(WEBTools.conf.paintBoard.PaintBoard);
            //更新当前的属性信息
            this.conf.canvas.width=wid;
            this.conf.canvas.height=hei;
            this.conf.canvas.left=offset.left;
            this.conf.canvas.top=offset.top;
            //更新数据池的信息
            seaConf.classInfo.drawInfo.left=offset.left;
            seaConf.classInfo.drawInfo.top=offset.top;
            if(seaConf.classInfo.serverInfo.curPage==seaConf.classInfo.textInfo.curPage){
                //用于如果resize之后的重绘本地数据信息
                WEBTools.repaint();
            }
        },

        draw:function (graphType){
            //防止出现null和undefined 防止未初始化现象
            if(!this.conf.canvas.target){
                this.initWEBTools();
            }
            //处理操作信息
            if(graphType!='back'&&graphType!='clear'){
                WEBTools.curDrawType=graphType;//record current draw type 记录当前的画笔类型
            }else if(graphType=='back'){
                if(WEBTools.orderList.length!=0){
                    var targetId=WEBTools.orderList.pop();//取最后一个操作的id，并在orderList中移出
                    if(targetId){//防止空
                        WEBTools.handle_back(targetId);//调用撤销函数
                    }
                }
            }else{
                WEBTools.handle_clear();//清空
            }
        },

        bind:function (target){
            target.removeEventListener('mousedown',WEBTools.mousedown);
            target.removeEventListener('mousemove',WEBTools.mousemove);
            target.removeEventListener('mouseup',WEBTools.mouseup);
            target.removeEventListener('mouseout',WEBTools.mouseout);
            target.addEventListener('mousedown',WEBTools.mousedown,false);
            target.addEventListener('mousemove',WEBTools.mousemove,false);
            target.addEventListener('mouseup',WEBTools.mouseup,false);
            target.addEventListener('mouseout',WEBTools.mouseout,false);
        },

        mousedown:function (e){
            e=e||window.event||arguments.callee.caller.arguments[0];
            //更新outEvent
            WEBTools.outEvent=false;
            if(WEBTools.conf.paintModule=='draw'&&!WEBTools.conf.pauseDraw){//if canvas can be allowed to draw now
                var context =WEBTools.conf.canvas.targetBakContext,
                    canvasW=WEBTools.conf.canvas.width,
                    canvasH=WEBTools.conf.canvas.height;
                //paint the words to the board when we edit words but not click board  防止在编辑文字时，未点击画布其他位置将文字打印在画布上
                if(WEBTools.conf.paintBoard.input.style.display!='none'&&WEBTools.curDrawType!='text'){
                    var id_cur=(e.target || e.srcElement).id;
                    if(id_cur!='input'&&id_cur!='edit'){
                        WEBTools.write_end();
                    }
                }
                WEBTools.downEvent=true;//record down event 记录down事件

                //update offset data
                var offset=WEBTools.getOffset(WEBTools.conf.paintBoard.PaintBoard);
                WEBTools.conf.canvas.left=offset.left;
                WEBTools.conf.canvas.top=offset.top;

                //update mouse data
                WEBTools.mouseData.startX=Math.round(e.clientX+document.body.scrollLeft-WEBTools.conf.canvas.left);
                WEBTools.mouseData.startY=Math.round(e.clientY+document.body.scrollTop-WEBTools.conf.canvas.top);

                var lineWid=Math.round(WEBTools.conf.pencil.size*canvasW/800);

                //单独处理矩形区域的点，避免溢出看不到绘制的边线
                if(WEBTools.curDrawType==='rec'){
                    WEBTools.mouseData.startX=(WEBTools.mouseData.startX-lineWid)>=0?WEBTools.mouseData.startX:lineWid;
                    WEBTools.mouseData.startY=(WEBTools.mouseData.startY-lineWid)>=0?WEBTools.mouseData.startY:lineWid;
                }

                //更新鼠标信息
                WEBTools.mouseData.minX=WEBTools.mouseData.startX;
                WEBTools.mouseData.minY=WEBTools.mouseData.startY;
                WEBTools.mouseData.maxX=WEBTools.mouseData.startX;
                WEBTools.mouseData.maxY=WEBTools.mouseData.startY;

                //set context 设置绘制配置信息
                context.strokeStyle=WEBTools.conf.pencil.color;
                context.lineWidth=lineWid;
                context.moveTo(WEBTools.mouseData.startX,WEBTools.mouseData.startY);

                //clear container of all points 先清空一次鼠标数据
                WEBTools.mouseData.pointArr.length=0;

                switch (WEBTools.curDrawType){
                    //每一个case基本模式都一样，先记录点信息，然后设置canvas的特定属性，之后就是canvas的固定写法
                    case 'pen':
                        WEBTools.mouseData.pointArr.push({'x':WEBTools.mouseData.startX,'y':WEBTools.mouseData.startY});
                        context.beginPath();
                        break;
                    case 'signpen':
                        WEBTools.mouseData.pointArr.push({'x':WEBTools.mouseData.startX,'y':WEBTools.mouseData.startY});
                        context.save();
                        context.beginPath();
                        context.globalAlpha=0.5;
                        context.globalCompositeOperation='xor';
                        context.strokeStyle=WEBTools.conf.sign_pencil.color;
                        context.lineWidth=WEBTools.conf.sign_pencil.size*canvasW/800;
                        break;
                    case 'rec':
                        WEBTools.mouseData.pointArr.push({'x':WEBTools.mouseData.startX,'y':WEBTools.mouseData.startY});
                        break;
                    case 'rub':
                        var sizerub=WEBTools.conf.rub.size;
                        WEBTools.mouseData.pointArr.push({'x':WEBTools.mouseData.startX,'y':WEBTools.mouseData.startY});
                        context.clearRect(WEBTools.mouseData.startX-sizerub/2,WEBTools.mouseData.startY-sizerub/2,sizerub,sizerub);
                        break;
                    case 'newrub':
                        var tem_e=WEBTools.curTarget;
                        if(tem_e){
                            //统一颜色
                            WEBTools.reInitColor();
                            //修改当前的笔迹颜色
                            tem_e.color=WEBTools.conf.target.color;
                            //所有笔迹重新绘制
                            WEBTools.repaint();
                        }
                        break;
                    case 'text':
                        var target = e.target || e.srcElement;
                        if(target.id=='input'){//拖拽
                            //标记哨兵 表明现在正在处于拖拽状态
                            WEBTools.textData.signTextDrag=true;
                            //设置为只读状态
                            WEBTools.conf.paintBoard.edit.readOnly='true';
                            //设置当前状态下的最大宽高
                            WEBTools.conf.paintBoard.input.style.minWidth=WEBTools.conf.paintBoard.input.scrollWidth+'px';
                            WEBTools.conf.paintBoard.input.style.minHeight=WEBTools.conf.paintBoard.input.scrollHeight+'px';
                            //阻止事件的默认事件以及向上冒泡
                            e.preventDefault();
                            e.stopPropagation();
                        }
                        else if(target.id=='edit'){//输入
                            //更改哨兵
                            WEBTools.textData.signTextDrag=false;
                            //可写
                            WEBTools.conf.paintBoard.edit.readOnly='';
                            //阻止冒泡
                            e.stopPropagation();
                        }else{
                            if(WEBTools.conf.paintBoard.input.style.display=="none")
                            {
                                if(WEBTools.curTarget!=null&&WEBTools.curTarget.drawingType==4){//重写
                                    //reedit module
                                    WEBTools.reEditText(e);
                                }
                                else{//写文字
                                    //first time to text
                                    WEBTools.write_start(WEBTools.mouseData.startX,WEBTools.mouseData.startY);
                                }
                            }
                            else{//打印
                                WEBTools.write_end();
                                WEBTools.clearConText();
                                WEBTools.textData.signTextDrag=false;
                            }
                        }
                        break;
                    case 'draft':
                        if(WEBTools.curTarget&&WEBTools.curTarget.drawingType!=10){
                            //必须记录的两个重要信息 初始的位置信息
                            WEBTools.dragData.initialLeft=WEBTools.curTarget.drag_left;
                            WEBTools.dragData.initialTop=WEBTools.curTarget.drag_top;
                            WEBTools.curTarget.color=WEBTools.conf.target.color;
                            //先隐藏这笔，但是要画在蒙版上
                            WEBTools.curTarget.display=0;
                            WEBTools.repaint();
                            WEBTools.curTarget.display=1;
                            WEBTools.curTarget.handle(context,2);
                        }
                        break;
                    default :
                        break;
                }
                if(WEBTools.curDrawType!='text'){
                    e.preventDefault();
                    e.stopPropagation();
                }
            }
        },
        mousemove:function (e){
            e=e||window.event||arguments.callee.caller.arguments[0];
            //更新outEvent
            WEBTools.outEvent=false;
            var context=WEBTools.conf.canvas.targetBakContext,
                canvasW=WEBTools.conf.canvas.width,
                canvasH=WEBTools.conf.canvas.height;
            //calculate the point {x,y} to line to
            var x =  Math.round(e.clientX+document.body.scrollLeft - WEBTools.conf.canvas.left);
            var y =  Math.round(e.clientY+document.body.scrollTop - WEBTools.conf.canvas.top);
            WEBTools.mouseData.nowX=x;
            WEBTools.mouseData.nowY=y;
            //record current points data for mouse synchronous 更新鼠标信息为了方便鼠标同步时判断有效的鼠标移动
            seaConf.board.mouse.curX= Math.round(e.clientX);
            seaConf.board.mouse.curY=  Math.round(e.clientY);
            if(WEBTools.downEvent){//in the event of down event is alive 判断如果down事件被点击

                WEBTools.mouseData.minX=(x<WEBTools.mouseData.minX)?x:WEBTools.mouseData.minX;
                WEBTools.mouseData.maxX=(x>WEBTools.mouseData.maxX)?x:WEBTools.mouseData.maxX;
                WEBTools.mouseData.minY=(y<WEBTools.mouseData.minY)?y:WEBTools.mouseData.minY;
                WEBTools.mouseData.maxY=(y>WEBTools.mouseData.maxY)?y:WEBTools.mouseData.maxY;
                
                switch (WEBTools.curDrawType){
                    case 'pen':
                        context.lineTo(x ,y);
                        context.stroke();
                        //防止点数据过多引起崩溃
                        if(WEBTools.mouseData.pointArr.length > 450){
                            WEBTools.mouseup();
                        }else{
                            WEBTools.mouseData.pointArr.push({'x':x,'y':y});
                        }
                        break;
                    case 'signpen':
                        context.lineTo(x ,y);
                        context.stroke();
                        //防止点数据过多引起崩溃
                        if(WEBTools.mouseData.pointArr.length > 450){
                            WEBTools.mouseup();
                        }else{
                            WEBTools.mouseData.pointArr.push({'x':x,'y':y});
                        }
                        break;
                    case 'rec':
                        context.beginPath();
                        WEBTools.clearConText();
                        context.moveTo(WEBTools.mouseData.startX , WEBTools.mouseData.startY);
                        context.lineTo(x  ,WEBTools.mouseData.startY );
                        context.lineTo(x  ,y );
                        context.lineTo(WEBTools.mouseData.startX  ,y );
                        context.lineTo(WEBTools.mouseData.startX  ,WEBTools.mouseData.startY );
                        context.lineTo(x  ,WEBTools.mouseData.startY );
                        context.stroke();
                        break;
                    case 'rub':
                        var sizerub=WEBTools.conf.rub.size;
                        //防止点数据过多引起崩溃
                        if(WEBTools.mouseData.pointArr.length > 450){
                            WEBTools.mouseup();
                        }else{
                            WEBTools.mouseData.pointArr.push({'x':x,'y':y});
                            WEBTools.conf.canvas.targetContext.clearRect(x-sizerub/2,y-sizerub/2,sizerub,sizerub);
                        }
                        break;
                    case 'newrub':
                        WEBTools.curTarget=WEBTools.e_search(x,y);
                        var targetCr=WEBTools.curTarget;
                        if(targetCr){
                            WEBTools.reInitColor();
                            targetCr.color=WEBTools.conf.target.color;
                            WEBTools.repaint();
                        }
                        else{
                            WEBTools.reInitColor();
                            WEBTools.repaint();
                        }
                        break;
                    case 'text':
                        if(WEBTools.textData.signTextDrag)//编辑过程中的拖拽
                        {
                            //WEBTools.textData.pointXTD maybe == WEBTools.mouseData.startX and maybe not
                            WEBTools.conf.paintBoard.input.style.left=WEBTools.textData.pointXTD+x-WEBTools.mouseData.startX+'px';
                            WEBTools.conf.paintBoard.input.style.top=WEBTools.textData.pointYTD+y-WEBTools.mouseData.startY+'px';
                            //WEBTools.textData.pointLeftTD and WEBTools.textData.pointTopTD used to avoid tea turn page when stu is dragging text
                            WEBTools.textData.pointLeftTD=WEBTools.textData.pointXTD+x-WEBTools.mouseData.startX;
                            WEBTools.textData.pointTopTD=WEBTools.textData.pointYTD+y-WEBTools.mouseData.startY;
                        }
                        break;
                    case 'draft':
                        //这里做移动操作
                        //improve safety
                        if(WEBTools.curTarget){
                            WEBTools.clearConText();
                            var s=WEBTools.curTarget.canvasWidth/canvasW;
                            WEBTools.curTarget.drag_left= Math.round((x-WEBTools.mouseData.startX)*s+WEBTools.dragData.initialLeft);
                            WEBTools.curTarget.drag_top= Math.round((y-WEBTools.mouseData.startY)*s+WEBTools.dragData.initialTop);
                            WEBTools.curTarget.handle(context,2);
                        }
                        break;
                }
            }
            else if(!WEBTools.conf.pauseDraw&&WEBTools.conf.version=='new'&&!WEBTools.textData.signREdit){//新功能中的down未触发，移动鼠标，高亮当前的笔迹
                WEBTools.curTarget=null;
                WEBTools.curTarget=WEBTools.e_search(x,y);
                if(WEBTools.curTarget){//当前鼠标区域存在笔迹
                    var a=(WEBTools.curDrawType=='newrub')?true:false,//新版橡皮擦 new rubber
                        //draft module but current target type is not Highlighter pen
                        b=(WEBTools.curDrawType=='draft'&&WEBTools.curTarget.drawingType!=10)?true:false,//当前对象不是荧光笔且处于拖拽模式
                        //text module but current target type is text
                        c=(WEBTools.curDrawType=='text'&&WEBTools.curTarget.drawingType==4)?true:false,//处于编辑模式切当前为文字文字
                        //different id from last color changed target
                        d=WEBTools.curTarget.id!=WEBTools.colorChangeId;
                    if((a||b||c)&&d){
                        WEBTools.reInitColor();
                        WEBTools.colorChange=true;
                        if(WEBTools.curTarget.drawingType!=4)//not text
                        {
                            WEBTools.curTarget.color=WEBTools.conf.target.color;
                        }
                        else//text
                        {
                            WEBTools.curTarget.font_color=WEBTools.conf.target.color;
                        }
                        WEBTools.repaint();
                        WEBTools.colorChangeId=WEBTools.curTarget.id;
                    }
                }
                else if(WEBTools.colorChange){//当前鼠标区域没有笔迹，但是之前的操作有笔迹颜色的变化
                    //回复颜色
                    WEBTools.reInitColor();
                    //重绘
                    WEBTools.repaint();
                    //修改哨兵
                    WEBTools.colorChange=false;
                    WEBTools.colorChangeId=-1;
                }
            }
            //除去文本的默认事件处理  文本之前已经处理，不再统一处理，涉及到拖拽
            if(WEBTools.curDrawType!='text'){
                e.preventDefault();
                e.stopPropagation();
            }
        },
        mouseup:function (e){
            e=e||window.event||arguments.callee.caller.arguments[0];
            if(!WEBTools.conf.pauseDraw&&WEBTools.downEvent){
                var re;
                var canvasW=WEBTools.conf.canvas.width,
                    canvasH=WEBTools.conf.canvas.height;
                //处理文本的拖拽的过程中文本区域超出canvas的区域
                if(WEBTools.curDrawType=='text'){
                    re=WEBTools.inputRange();//获取纠正数据
                    WEBTools.conf.paintBoard.edit.focus();
                }
                //down事件完毕
                WEBTools.downEvent = false;
                var x= 0,
                    y=0;
                ////修改矩形画出白板区域
                //if(WEBTools.outEvent&&WEBTools.curDrawType==='rec'){
                //    x=WEBTools.mouseData.nowX;
                //    y=WEBTools.mouseData.nowY;
                //}else{
                    //avoid window.event is undefined
                    //避免window.event为undefined
                    x = (e.clientX)?(Math.round(e.clientX+document.body.scrollLeft - WEBTools.conf.canvas.left)):WEBTools.mouseData.nowX;
                    y = (e.clientY)?(Math.round(e.clientY+document.body.scrollTop - WEBTools.conf.canvas.top)):WEBTools.mouseData.nowY;
                //}

                //单独处理矩形区域的点，避免溢出看不到绘制的边线
                if(WEBTools.curDrawType==='rec'){
                    //策略：先对0做纠正，然后再比较当前的点信息加边宽和canvas的宽高对比，调节当前的点
                    var lineWid=Math.round(WEBTools.conf.pencil.size*canvasW/800);
                    x=(x-lineWid)>=0?x:lineWid;
                    y=(y-lineWid)>=0?y:lineWid;

                    x=(x+lineWid-WEBTools.conf.canvas.width)<=0?x:WEBTools.conf.canvas.width-lineWid;
                    y=(y+lineWid-WEBTools.conf.canvas.height)<=0?y:WEBTools.conf.canvas.height-lineWid;
                }

                WEBTools.mouseData.minX=(x<WEBTools.mouseData.minX)?x:WEBTools.mouseData.minX;
                WEBTools.mouseData.maxX=(x>WEBTools.mouseData.maxX)?x:WEBTools.mouseData.maxX;
                WEBTools.mouseData.minY=(y<WEBTools.mouseData.minY)?y:WEBTools.mouseData.minY;
                WEBTools.mouseData.maxY=(y>WEBTools.mouseData.maxY)?y:WEBTools.mouseData.maxY;

                //计算当前的笔迹的矩形区域
                var child_div_W= Math.max(Math.round(WEBTools.mouseData.maxX-WEBTools.mouseData.minX),Math.round(10*canvasW/800));
                var child_div_H= Math.max(Math.round(WEBTools.mouseData.maxY-WEBTools.mouseData.minY),Math.round(10*canvasW/800));

                WEBTools.mouseData.pointArr.push({'x':x,'y':y});

                //mouse's move is effective or not  屏蔽无意义的点击，防抖处理
                var effectMove=WEBTools.mouseData.minX!=WEBTools.mouseData.maxX||WEBTools.mouseData.minY!=WEBTools.mouseData.maxY;

                switch (WEBTools.curDrawType){
                    case 'pen':
                        /*封装obj*/
                        if(effectMove){
                            var obj={
                                'handleType':0,//add
                                'drawingType':0,//pen
                                'id':WEBTools.svcId,
                                'specialValue':{
                                    'owner':WEBTools.conf.type,
                                    'pencil_color':WEBTools.conf.pencil.color,
                                    'pencil_size':WEBTools.conf.pencil.size,
                                    'canvasWidth':canvasW,
                                    'canvasHeight':canvasH,
                                    'child_div_W':child_div_W,//current handwriting's area  笔迹的矩形区域
                                    'child_div_H':child_div_H,//current handwriting's area  笔迹的矩形区域
                                    'margin_left':Math.round(WEBTools.mouseData.minX),//current handwriting's position  笔迹矩形区域的边距
                                    'margin_top':Math.round(WEBTools.mouseData.minY),//current handwriting's position   笔迹矩形区域的边距
                                    'point':WEBTools.mouseData.pointArr.slice(0)//container of points  点信息
                                }
                            };
                            //显示该笔迹
                            WEBTools.showPaint(obj);
                            //发送给服务端
                            seaDataSend.sendCommData('paint',JSON.stringify(obj));
                            //清除过程层笔迹
                            WEBTools.clearConText();
                        }
                        break;
                    case 'signpen':
                        if(effectMove){
                            /*封装obj*/
                            var obj={
                                'handleType':0,//add
                                'drawingType':10,//sign pen
                                'id':WEBTools.svcId,
                                'specialValue':{
                                    'owner':WEBTools.conf.type,
                                    'pencil_color':WEBTools.conf.sign_pencil.color,
                                    'pencil_size':WEBTools.conf.sign_pencil.size,
                                    'canvasWidth':canvasW,
                                    'canvasHeight':canvasH,
                                    'child_div_W':child_div_W,//current handwriting's area  笔迹的矩形区域
                                    'child_div_H':child_div_H,//current handwriting's area  笔迹的矩形区域
                                    'margin_left':Math.round(WEBTools.mouseData.minX),//current handwriting's position  笔迹矩形区域的边距
                                    'margin_top':Math.round(WEBTools.mouseData.minY),//current handwriting's position  笔迹矩形区域的边距
                                    'point':WEBTools.mouseData.pointArr.slice(0)//container of points 点信息
                                }
                            };

                            //显示该笔迹
                            WEBTools.showPaint(obj);
                            //发送给服务端
                            seaDataSend.sendCommData('paint',JSON.stringify(obj));
                            //恢复一次
                            WEBTools.conf.canvas.targetBakContext.restore();
                            //清除过程层笔迹
                            WEBTools.clearConText();
                        }
                        break;
                    case 'rec':
                        if(effectMove){
                            child_div_W=WEBTools.mouseData.maxX-WEBTools.mouseData.minX;
                            child_div_H=WEBTools.mouseData.maxY-WEBTools.mouseData.minY;

                            /*封装obj*/
                            var obj={
                                'handleType':0,//add
                                'drawingType':2,//rectangle
                                'id':WEBTools.svcId,
                                'specialValue':{
                                    'owner':WEBTools.conf.type,
                                    'pencil_color':WEBTools.conf.pencil.color,
                                    'pencil_size':WEBTools.conf.pencil.size,
                                    'canvasWidth':canvasW,
                                    'canvasHeight':canvasH,
                                    'child_div_W':child_div_W,//current handwriting's area  笔迹的矩形区域
                                    'child_div_H':child_div_H,//current handwriting's area  笔迹的矩形区域
                                    'margin_left':Math.round(WEBTools.mouseData.minX),//current handwriting's position  笔迹矩形区域的边距
                                    'margin_top':Math.round(WEBTools.mouseData.minY),//current handwriting's position  笔迹矩形区域的边距
                                    'point':WEBTools.mouseData.pointArr.slice(0)//container of points  点信息
                                }
                            };
                            //显示该笔迹
                            WEBTools.showPaint(obj);
                            //发送给服务端
                            seaDataSend.sendCommData('paint',JSON.stringify(obj));
                            //清除过程层笔迹
                            WEBTools.clearConText();
                        }
                        break;
                    case 'rub':
                        /*封装obj*/
                        var obj={
                            'handleType':0,//add
                            'drawingType':3,//rubber
                            'id':WEBTools.svcId,
                            'specialValue':{
                                'owner':WEBTools.conf.type,
                                'pencil_color':WEBTools.conf.pencil.color,
                                'pencil_size':WEBTools.conf.pencil.size,
                                'canvasWidth':canvasW,
                                'canvasHeight':canvasH,
                                'child_div_W':child_div_W,//current handwriting's area  笔迹的矩形区域
                                'child_div_H':child_div_H,//current handwriting's area  笔迹的矩形区域
                                'margin_left':Math.round(WEBTools.mouseData.minX),//current handwriting's position  笔迹矩形区域的边距
                                'margin_top':Math.round(WEBTools.mouseData.minY),//current handwriting's position  笔迹矩形区域的边距
                                'point':WEBTools.mouseData.pointArr.slice(0)//container of points  点信息
                            }
                        };

                        var sizerub=WEBTools.conf.rub.size;
                        //清除最后一个点
                        WEBTools.conf.canvas.targetContext.clearRect(x-sizerub/2,y-sizerub/2,sizerub,sizerub);

                        //显示该笔迹
                        WEBTools.showPaint(obj);
                        //发送给服务端
                        seaDataSend.sendCommData('paint',JSON.stringify(obj));
                        console.log("发送橡皮擦数据:",JSON.stringify(obj));
                        break;
                    case 'newrub':
                        var tem_e=WEBTools.e_search(x,y);

                        if(tem_e){
                            /*封装obj*/
                            var obj={
                                'handleType':0,//add
                                'drawingType':500,//new handle
                                'id':WEBTools.svcId,
                                'specialValue':{
                                    'id': tem_e.id,
                                    'type': 0 //new rubber
                                }
                            };
                            //回复颜色
                            if(tem_e.drawingType==4){
                                tem_e.color=WEBTools.conf.font.fontColor;
                            }else if(tem_e.drawingType==10){
                                tem_e.color=WEBTools.conf.target.color;
                            }else{
                                tem_e.color=WEBTools.conf.pencil.color;
                            }
                            //显示
                            WEBTools.showPaint(obj);

                            WEBTools.repaint();
                            seaDataSend.sendCommData('paint',JSON.stringify(obj));
                        }
                        else{
                            WEBTools.reInitColor();
                            WEBTools.repaint();
                        }


                        break;
                    case 'text':
                        if(WEBTools.textData.signTextDrag){
                            var input=WEBTools.conf.paintBoard.input,
                                edit=WEBTools.conf.paintBoard.edit,
                                inputBakCon=WEBTools.conf.paintBoard.inputBakContain;
                            var bor=2* WEBTools.textData.inputBorder;//获取input的border宽度
                            var minW=Math.round((WEBTools.conf.font.fontSize)*canvasW/800);//设置的默认的显示的输入框大小
                            //获取当前的偏移值
                            WEBTools.textData.pointLeftTD=WEBTools.textData.pointXTD+x-WEBTools.mouseData.startX;
                            WEBTools.textData.pointTopTD=WEBTools.textData.pointYTD+y-WEBTools.mouseData.startY;
                            //纠正当前的偏移值
                            WEBTools.textData.pointXTD=WEBTools.textData.pointLeftTD+re.shiftX;
                            WEBTools.textData.pointYTD=WEBTools.textData.pointTopTD+re.shiftY;
                            //获取当前的文本的宽高
                            WEBTools.textData.inputMaxWid=canvasW-WEBTools.textData.pointXTD - bor;
                            WEBTools.textData.inputMaxHei=canvasH-WEBTools.textData.pointYTD - bor;
                            //重置容器的最大的宽高
                            input.style.maxWidth=WEBTools.textData.inputMaxWid + 'px';
                            input.style.maxHeight=WEBTools.textData.inputMaxHei + 'px';
                            inputBakCon.style.maxWidth=WEBTools.textData.inputMaxWid + 'px';
                            inputBakCon.style.maxHeight=WEBTools.textData.inputMaxHei + 'px';
                            //根据纠正的值重置边距位置
                            input.style.left=WEBTools.textData.pointXTD+'px';
                            input.style.top=WEBTools.textData.pointYTD+'px';
                            //设置最小的宽高
                            input.style.minWidth=minW+'px';
                            input.style.minHeight=minW+'px';
                            //还原
                            WEBTools.textData.signTextDrag=false;
                            //可写
                            edit.readOnly='';
                        }
                        break;
                    case 'draft':
                        if(effectMove){
                            if(x-WEBTools.mouseData.startX!=0||y-WEBTools.mouseData.startY!=0){//是否移动了
                                if(WEBTools.curTarget&&!WEBTools.textData.signREdit){
                                    //if current target over or not， four kinds 拖拽时是否超出画布，四个方向四种情况
                                    var s=canvasW/WEBTools.curTarget.canvasWidth;
                                    if(s*(WEBTools.curTarget.margin_left+WEBTools.curTarget.drag_left)<0){
                                        WEBTools.curTarget.drag_left= Math.round(0-WEBTools.curTarget.margin_left);
                                    }
                                    if(s*(WEBTools.curTarget.margin_top+WEBTools.curTarget.drag_top)<0){
                                        WEBTools.curTarget.drag_top= Math.round(0-WEBTools.curTarget.margin_top);
                                    }
                                    if(s*(WEBTools.curTarget.margin_left+WEBTools.curTarget.drag_left+WEBTools.curTarget.child_div_W)>canvasW){
                                        WEBTools.curTarget.drag_left= Math.round((canvasW-10)/s-WEBTools.curTarget.child_div_W-WEBTools.curTarget.margin_left);
                                    }
                                    if(s*(WEBTools.curTarget.margin_top+WEBTools.curTarget.drag_top+WEBTools.curTarget.child_div_H)>canvasH){
                                        WEBTools.curTarget.drag_top= Math.round(canvasH/s-WEBTools.curTarget.child_div_H-WEBTools.curTarget.margin_top);
                                    }

                                    WEBTools.clearConText();

                                    var obj={
                                        'handleType': 0,//add
                                        'drawingType':500,//new handle
                                        'id': WEBTools.svcId,
                                        'specialValue':{
                                            'id': WEBTools.curTarget.id,
                                            'type':1,//drag
                                            'drag_left':Math.round(WEBTools.curTarget.drag_left) ,//x轴拖拽的距离
                                            'drag_top':Math.round(WEBTools.curTarget.drag_top) //y轴拖拽的距离
                                        }
                                    };

                                    WEBTools.showPaint(obj);

                                    WEBTools.curTarget.handle(WEBTools.conf.canvas.targetContext,2);

                                    seaDataSend.sendCommData('paint',JSON.stringify(obj));
                                }
                            }
                        }else{
                            WEBTools.repaint();
                        }
                        break;
                    default :
                        break;
                }
                try {
                    if(WEBTools.curDrawType!='text'){
                        WEBTools.clearConText();
                        e.preventDefault();
                        e.stopPropagation();
                    }
                }catch (e){

                }
            }
            WEBTools.outEvent=false;
        },
        mouseout:function (e){
            var target = e.target || e.srcElement;
            //out事件发生
            WEBTools.outEvent=true;
            if(WEBTools.downEvent&&target.id!='input'&&target.id!='edit'&&WEBTools.curDrawType!='text')
            {
                //策略
                //强制的触发up事件
                WEBTools.mouseup();
            }
            e.preventDefault();
            e.stopPropagation();
        },

        key_event:function (that,e){
            //-------------------处理拖住过程中的输入-------------------
            if(WEBTools.textData.signTextDrag){
                WEBTools.mouseup();
            }
            //-------------------处理拖住过程中的输入-------------------
            //防止直接复制网页的文字，显示网页乱码
            that.innerText=that.innerText.toString();
            //赋值
            WEBTools.textData.textInput=that.innerText;
            //策略
            //用一个属性相同的input和edit来决定看是否超出了canvas的区域
            WEBTools.conf.paintBoard.inputBak.innerText='';
            WEBTools.conf.paintBoard.inputBak.innerText=WEBTools.textData.textInput;
            if(WEBTools.conf.paintBoard.inputBakContain.scrollHeight!=WEBTools.conf.paintBoard.inputBakContain.clientHeight&& e.keyCode!=8&&e.keyCode!=46){
                //超出了高度  不再允许写入但是允许删除
                //恢复到之前的文字
                that.innerText=WEBTools.textData.lastTextInput;
                //移动光标到尾部
                WEBTools.keyAction(that);
                e.preventDefault();
            }else{
                //没有超出canvas的高度
                WEBTools.textData.lastTextInput=WEBTools.textData.textInput;
                WEBTools.textData.textInput='';
            }
            //实现有滚动条（滚动条未移到最底部）时输入文字可以自动拉动滚动条下移
            var xt=parseInt(document.getElementById('paintBoard').style.top.replace('px',''))+parseInt(WEBTools.conf.paintBoard.input.style.top.replace('px',''))+parseInt(WEBTools.conf.paintBoard.input.scrollHeight),
                xs=parseInt(document.getElementById('overview').style.top.replace('px','')),
                xc=parseInt(document.getElementById('workSpace').style.height.replace('px',''));
            if(xt+xs-xc>0){//判断现在已经需要下移滚动条 并且滚动条未到最底部
                //先更新滚动效果
                document.getElementById('overview').style.top=xc-xt-2* WEBTools.textData.inputBorder+'px';
                //再重置滚动条
                $('#scrollbar1').tinyscrollbar_update(xt-xc);
            }
            //移动光标到尾部
            WEBTools.keyAction(that);
            WEBTools.conf.paintBoard.inputBak.innerText="";
        },
        write_start:function (x,y){//x y current point
            var input=WEBTools.conf.paintBoard.input,
                edit=WEBTools.conf.paintBoard.edit,
                inputBak=WEBTools.conf.paintBoard.inputBak,
                inputBakCon=WEBTools.conf.paintBoard.inputBakContain,
                canvasW=WEBTools.conf.canvas.width,
                canvasH=WEBTools.conf.canvas.height;
            //获取焦点
            edit.autofocus="true";

            edit.innerText="";
            WEBTools.textData.textInput="";

            //for set initial input's width and height
            var w=Math.round((WEBTools.conf.font.fontSize)*canvasW/800);//根据当前的画布大小和文字的大小动态形成默认的编辑区域的宽度
            var h=Math.round((WEBTools.conf.font.fontSize+10)*canvasW/800);//根据当前的画布的大小和文字的大小动态形成编辑区域的高度  10是防止出现滚动条的调节值
            var b=Math.round(4*canvasW/800);//border  4是相对与800px来说的边框宽度
            //to avoid edit over input 防止刚开始点击时出现的输入框超出canvas的区域 做值得纠正：举例：右下角点击，出现的边框位置纠正
            y=((y+h+2*b)>canvasH)?(canvasH-h-2*b):y;
            x=((x+w+2*b)>canvasW)?(canvasW-w-2*b):x;
            //记录css的值
            WEBTools.textData.inputBorder=b;
            WEBTools.textData.inputMaxWid=canvasW - x -2*b;
            WEBTools.textData.inputMaxHei=canvasH - y -2*b;
            WEBTools.textData.fontSize=Math.round(WEBTools.conf.font.fontSize*canvasW/800);
            //设置css
            input.style.border='dashed '+WEBTools.textData.inputBorder+'px blue';
            input.style.zIndex=5;
            input.style.maxWidth= WEBTools.textData.inputMaxWid + 'px';
            input.style.maxHeight= WEBTools.textData.inputMaxHei + 'px';
            input.style.display='block';
            input.style.left=x+'px';
            input.style.top=y+'px';

            edit.style.minWidth=w+'px';
            edit.style.display='block';
            edit.style.font='bold '+WEBTools.textData.fontSize+"px "+WEBTools.conf.font.fontStyle;

            inputBakCon.style.border='dashed '+WEBTools.textData.inputBorder+'px blue';
            inputBakCon.style.maxWidth= WEBTools.textData.inputMaxWid + 'px';
            inputBakCon.style.maxHeight= WEBTools.textData.inputMaxHei + 'px';
            inputBak.style.font='bold '+WEBTools.textData.fontSize+"px "+WEBTools.conf.font.fontStyle;
            //记录当前的初始值
            WEBTools.textData.pointXTD=x;
            WEBTools.textData.pointYTD=y;
            WEBTools.textData.pointLeftTD=x;
            WEBTools.textData.pointTopTD=y;
        },
        write_writing: function () {//text but something else is alive,text must be drawed to pain board 已废弃
            if(WEBTools.conf.paintBoard.input.style.display!='none'){
                WEBTools.write_end();
            }
        },
        write_end:function (){//text end
            var canvasW=WEBTools.conf.canvas.width,
                canvasH=WEBTools.conf.canvas.height;
            var child_w=parseInt(WEBTools.conf.paintBoard.input.scrollWidth),//取编辑器的宽
                child_h=parseInt(WEBTools.conf.paintBoard.input.scrollHeight);//取编辑器的高
            //隐藏编辑器
            WEBTools.conf.paintBoard.input.style.display="none";
            WEBTools.conf.paintBoard.edit.style.display="none";

            var theString="";//用于存储待处理的文字串
            var changedStr='';//用于存储处理完的文字串
            var replacedStr='';//用于存储处理完的文字串
            //一些标记，标记当前未处理串中是否存在各种标签
            var sign_div= -1,//是否存在<div>
                sign_br= -1,//是否存在<br>
                sign_div_end=-1,//是否存在</div>
                sign_for= 0,//for循环
                sign_len=0;//avoid dead loop 避免死循环，保证循环能释放
            theString=WEBTools.conf.paintBoard.edit.innerHTML;//取元数据
            theString=WEBTools.removeDanger(theString);//移除js脚本或者html代码，避免xss攻击

            sign_len=theString.length;
            //因为鉴于使用的是maxHeight,所以会存在以下的各种情况，换行：<div>********</div>  <br>  需要将这几种情况修改掉，替换为换行符
            if(theString.indexOf('<div>')!=-1||theString.indexOf('<br>')!=-1){//there is a line break  存在其中一种情况，存在换行
                for(sign_for=0;sign_for<sign_len;sign_for++){
                    //判断存在哪一种情况
                    sign_div=theString.indexOf('<div>');
                    sign_br=theString.indexOf('<br>');
                    sign_div_end=theString.indexOf('</div>');

                    if(sign_div==-1){//there is not any div  不存在<div>
                        if(sign_br==-1){//there is not any div and br 不存在<br>
                            theString=theString.replace(/<\/div>/g,''); //不管有没有，干掉</div> 容错
                            break;
                        }
                        else{//only br  只有<br>的情况
                            theString=theString.replace(/<br>/g,'\n');
                            break;
                        }
                    }else{//some div is here 存在<div>
                        if(sign_br==-1){//there is not any br 表明<div></div>之间不存在<br>
                            theString.replace(/<div>/g,'\n').replace(/<\/div>/g,'');
                            break;
                        }else{//some br is here   两种情况都存在
                            if(sign_br<sign_div){//br is head  这种情况<br>在前
                                theString=theString.replace(/<br>/,'\n');
                            }else{//div first  这种情况<div>在前
                                if(sign_br<sign_div_end){//br between <div> and </div>  这种情况<div><br></div>
                                    theString.replace(/<div>/,'\n').replace(/<\/div>/,'').replace(/<br>/,'');
                                }else{//br out <div></div> 这种情况<div></div><br>
                                    theString.replace(/<div>/,'\n').replace(/<\/div>/,'');
                                }
                            }
                        }
                    }
                }
                //强制在处理一次，避免出错
                if(theString.indexOf('<div>')!=-1){
                    theString=theString.replace(/<div>/g,'\n').replace(/<\/div>/g,'').replace(/<br>/g,'');
                }else{
                    theString=theString.replace(/<br>/g,'\n');
                }
            }
            //下面开始拿上面处理过的数据，从相同属性的input和edit中过一遍，找到换行的结点插入换行符
            if(theString!=''){
                var str_temp="";
                var recordI=0;//avoid dead loop  避免死循环
                var curHeight=0;//current height  当前的高度
                var inputBakContain=WEBTools.conf.paintBoard.inputBakContain;

                WEBTools.conf.paintBoard.inputBak.innerText="";
                for(var i=0;i< theString.length;i++,recordI++){
                    if(theString.charAt(i)!="\n"&&theString.charAt(i)!="\r\n")//当前的字符不是换行符
                    {//no any \n
                        WEBTools.conf.paintBoard.inputBak.innerText+= theString.charAt(i);
                        //策略：
                        //先判断当前的clientHeight和上一个curHeight比较是不是变化了，如果变化了还不足以说明已经还行了，因为一些操作也能造成这种现象
                        //再拿WEBTools.conf.font.fontSize/3和上面两者之间的差值作比较，以确保现在是换行
                        //这样做的理由是如果真的是换行的话，一定会大于WEBTools.conf.font.fontSize/3
                        if(curHeight!=0&&inputBakContain.clientHeight>curHeight&&
                            Math.abs(inputBakContain.clientHeight-curHeight)>WEBTools.conf.font.fontSize/3)//sign of \n
                        {
                            str_temp+='\n';
                            changedStr+=str_temp;
                            str_temp= theString.charAt(i);
                        }else{//no any \n 当前的字符还不是可以换行的字符
                            str_temp+= theString.charAt(i);
                        }
                        if(i+1== theString.length){//end  当前为最后一个字符
                            changedStr+=str_temp;
                        }
                        //更新记录当前的高度
                        curHeight=inputBakContain.clientHeight;
                    }
                    else//当前的字符是换行符
                    {//handle of \n
                        str_temp+='\n';
                        changedStr+=str_temp;
                        str_temp="";
                        //换行后从头再来
                        WEBTools.conf.paintBoard.inputBak.innerText='';
                        curHeight=inputBakContain.clientHeight;
                    }
                }
                //回复现场
                WEBTools.conf.paintBoard.inputBak.innerText="";
                replacedStr=changedStr;
            }
            //区别是重写还是第一次写文字
            if(!WEBTools.textData.signREdit){
                //第一次写文字，避免写空
                if(theString!=''){//avoid null
                    var obj={
                        'handleType':0,//add
                        'drawingType':4,//text
                        'id':WEBTools.svcId,
                        'specialValue':{
                            'owner':WEBTools.conf.type,
                            'font':{
                                'font_color':WEBTools.conf.pencil.color,
                                'font_size':Math.round(WEBTools.conf.font.fontSize*canvasW/800),
                                'font_style':WEBTools.conf.font.fontStyle
                            },
                            'canvasWidth':canvasW,
                            'canvasHeight':canvasH,
                            'child_div_W':Math.round(child_w) ,//current handwriting's area 笔迹的矩形区域
                            'child_div_H': Math.round(child_h),//current handwriting's area 笔迹的矩形区域
                            'margin_left':Math.round(WEBTools.textData.pointXTD),//current handwriting's position 笔迹的矩形区域的边距
                            'margin_top':Math.round(WEBTools.textData.pointYTD),//current handwriting's position 笔迹的矩形区域的边距
                            'str_text':window.MyBase64.encode(replacedStr)//text   将处理完的文字发送到对端，一、避免再次解析 二、保持两端的一致性
                        }
                    };
                    //发送到服务器
                    seaDataSend.sendCommData('paint',JSON.stringify(obj));
                    //本端显示
                    WEBTools.showPaint(obj);
                }
            }
            else{//重写
                var s=WEBTools.curTarget.canvasWidth/canvasW;
                //新的笔迹区域的宽高
                WEBTools.curTarget.child_div_W= Math.round(child_w*s);
                WEBTools.curTarget.child_div_H= Math.round(child_h*s);
                //在重写中拖拽的距离
                WEBTools.curTarget.drag_left= Math.round((WEBTools.textData.pointXTD)*s-WEBTools.curTarget.margin_left);
                WEBTools.curTarget.drag_top= Math.round((WEBTools.textData.pointYTD)*s-WEBTools.curTarget.margin_top);

                
                var obj={
                    'handleType': 0,//add
                    'drawingType':500,//new handle
                    'id':WEBTools.svcId,
                    'specialValue':{
                        'id':WEBTools.curTarget.id,
                        'type':2,//reedit
                        'font':{
                            'font_color':WEBTools.conf.pencil.color,
                            'font_size':Math.round(WEBTools.conf.font.fontSize*s),
                            'font_style':WEBTools.conf.font.fontStyle
                        },
                        'child_div_W': Math.round(WEBTools.curTarget.child_div_W),//current handwriting's area 笔迹的矩形区域
                        'child_div_H': Math.round(WEBTools.curTarget.child_div_H),//current handwriting's area 笔迹的矩形区域
                        'drag_left':Math.round(WEBTools.curTarget.drag_left),//drafted distance x轴拖拽的距离
                        'drag_top':Math.round(WEBTools.curTarget.drag_top),//drafted distance y轴拖拽的距离
                        'str_text':window.MyBase64.encode(replacedStr)//edited text 将处理完的文字发送到对端，一、避免再次解析 二、保持两端的一致性
                    }
                };
                //发送到服务器
                seaDataSend.sendCommData('paint',JSON.stringify(obj));
                //显示这一笔
                WEBTools.curTarget.display=1;
                //本端显示
                WEBTools.showPaint(obj);
                //更新哨兵
                WEBTools.textData.signREdit=false;
            }
            //downEvent结束
            WEBTools.downEvent=false;
            //重置，为下一次的输入
            WEBTools.conf.paintBoard.edit.innerText='';
        },

        inputRange:function (){//文字操作时，用来判断是否需要调整边框的位置 ，避免溢出canvas画布
            var input=WEBTools.conf.paintBoard.input,
                canvasW=WEBTools.conf.canvas.width,
                canvasH=WEBTools.conf.canvas.height;

            var inputWid=parseInt(input.scrollWidth),
                inputHei=parseInt(input.scrollHeight),
                inputLeft=parseInt(input.style.left.replace('px','')),
                inputTop=parseInt(input.style.top.replace('px',''));

            var shiftLeft= 0,shiftTop=0;
            var b=2* WEBTools.textData.inputBorder;

            //right over
            if((inputLeft+inputWid+b>=canvasW)){
                shiftLeft=canvasW-inputLeft-inputWid-b;
            }
            //bottom over
            if(inputTop+inputHei+b>=canvasH){
                shiftTop=canvasH-inputTop-inputHei-b;
            }
            //left over
            if(inputLeft<0){
                shiftLeft=0-inputLeft;
            }
            //top over
            if(inputTop<0){
                shiftTop=0-inputTop;
            }
            return {shiftX:shiftLeft,shiftY:shiftTop};
        },
        'removeDanger': function (str) {//避免xss攻击
            var a=str;
            a= a.replace(/&nbsp;/g,' ');
            a=a.replace(/&amp;/g,'&');
            a=a.replace(/&quot;/g,'\\');
            a=a.replace(/&#039;/g,'\'');
            a=a.replace(/&lt;/g,'<');
            a=a.replace(/&gt;/g,'>');
            return a;
        },
        keyAction:function (that) {//光标到最后
            var textbox = that;
            var sel = window.getSelection();
            var range = document.createRange();
            range.selectNodeContents(textbox);
            range.collapse(false);
            sel.removeAllRanges();
            sel.addRange(range);
        },

        objFactory: function (handleType,drawingType,id,specialValue) {//used to make obj for draw  未使用
            //unused
            var obj=null;
            obj={
                'handleType':handleType,
                'drawingType':drawingType,
                'id':id,
                'specialValue':specialValue
            };
            return obj;
        },

        reEditText:function (e){//用于重写文字的start
            e=e||window.event||arguments.callee.caller.arguments[0];
            var input=WEBTools.conf.paintBoard.input,
                edit=WEBTools.conf.paintBoard.edit,
                inputBak=WEBTools.conf.paintBoard.inputBak,
                inputBakCon=WEBTools.conf.paintBoard.inputBakContain,
                canvasW=WEBTools.conf.canvas.width,
                canvasH=WEBTools.conf.canvas.height;

            if(WEBTools.curTarget){
                if(WEBTools.curTarget.handleType==0&&WEBTools.curTarget.drawingType==4){//如果当前双击的目标是文字
                    //标记当前的编辑状态是重写状态
                    WEBTools.textData.signREdit=true;
                    //先在结果层暂时隐藏这一段文字，显示在过程层上
                    WEBTools.curTarget.display=0;
                    //显示其他的笔迹
                    WEBTools.repaint();

                    var tem_text=WEBTools.curTarget.point_Arr_text,
                        s=WEBTools.conf.canvas.width/WEBTools.curTarget.canvasWidth;
                    var b=Math.round(4*canvasW/800);//border
                    //更新本地记录的相关值信息
                    WEBTools.textData.inputBorder=b;
                    WEBTools.textData.inputMaxWid=canvasW-(WEBTools.curTarget.drag_left+WEBTools.curTarget.margin_left) * s-2*b;
                    WEBTools.textData.inputMaxHei=canvasH-(WEBTools.curTarget.drag_top+WEBTools.curTarget.margin_top) * s-2*b;
                    WEBTools.textData.fontSize=Math.round(WEBTools.curTarget.font_size*s);
                    //根据当前比划的数据信息设置新的属性
                    input.style.border='dashed '+WEBTools.textData.inputBorder+'px red';
                    input.style.zIndex=5;
                    input.style.display='block';
                    input.style.maxWidth=WEBTools.textData.inputMaxWid+'px';
                    input.style.maxHeight=WEBTools.textData.inputMaxHei+'px';
                    input.style.left=(WEBTools.curTarget.margin_left+WEBTools.curTarget.drag_left)*s+'px';
                    input.style.top=(WEBTools.curTarget.margin_top+WEBTools.curTarget.drag_top)*s+'px';

                    edit.style.display='block';
                    edit.style.font='bold '+WEBTools.textData.fontSize+"px "+WEBTools.conf.font.fontStyle;

                    inputBak.style.font='bold '+WEBTools.textData.fontSize+"px "+WEBTools.conf.font.fontStyle;

                    inputBakCon.style.border='dashed '+WEBTools.textData.inputBorder+'px red';
                    inputBakCon.style.maxWidth=WEBTools.textData.inputMaxWid+'px';
                    inputBakCon.style.maxHeight=WEBTools.textData.inputMaxHei+'px';
                    //值输入
                    WEBTools.conf.paintBoard.edit.innerText=tem_text;
                    //make cursor end  将光标移到最后
                    WEBTools.keyAction(WEBTools.conf.paintBoard.edit);
                    //记录当前的位置信息
                    WEBTools.textData.pointXTD=(WEBTools.curTarget.margin_left+WEBTools.curTarget.drag_left)*s;
                    WEBTools.textData.pointYTD=(WEBTools.curTarget.margin_top+WEBTools.curTarget.drag_top)*s;
                    //记录当前的位置信息
                    WEBTools.textData.pointLeftTD=WEBTools.textData.pointXTD;
                    WEBTools.textData.pointTopTD=WEBTools.textData.pointYTD;
                }
            }
        },

        reInitColor:function (){//恢复所有比划的颜色
            var temArr=WEBTools.recordConArr;
            for(var i= 0,j=temArr.length;i<j;i++){
                if(temArr[i].drawingType!=10){
                    if(temArr[i].drawingType!=4)
                    {
                        temArr[i].color=temArr[i].login_type=='tea'?WEBTools.conf.canvas.teaPenC:WEBTools.conf.canvas.stuPenC;
                    }
                    else{//text
                        temArr[i].font_color=temArr[i].login_type=='tea'?WEBTools.conf.canvas.teaFontC:WEBTools.conf.canvas.stuFonC;
                    }
                }
                else{//sign pen
                    temArr[i].color=temArr[i].login_type=='tea'?WEBTools.conf.canvas.teaSignPen:WEBTools.conf.canvas.stuSignPen;
                }
            }
        },

        e_search:function (x,y){//寻找当前鼠标位置下的笔迹对象
            var e;
            var s;
            var i,j;
            var offset=WEBTools.getOffset(WEBTools.conf.paintBoard.PaintBoard);
            WEBTools.conf.canvas.left=offset.left;
            WEBTools.conf.canvas.top=offset.top;
            for(i= 0,j=WEBTools.recordConArr.length;i<j;i++){
                e=WEBTools.recordConArr[i];
                s= WEBTools.conf.canvas.width/ e.canvasWidth;
                if(e.handleType==0&&e.drawingType!=500&& e.drawingType!=3&&e.display==1){
                    if(e.drawingType!=10||WEBTools.curDrawType!='draft'){
                        if(x>= (e.margin_left+ e.drag_left)*s&&y>= (e.margin_top+ e.drag_top)*s){
                            if(x<= (e.margin_left+ e.child_div_W+ e.drag_left)*s&&y<=(e.margin_top+ e.child_div_H+ e.drag_top)*s){
                                return e;
                            }
                        }
                    }
                }
            }
            return null;
        },

        showPaint: function (obj) {//用于根据分析数据对象来实现数据可视化
            try{
                if(obj.handleType==0){//add
                    if([0,2,3,4,10,500].indexOf(obj.drawingType)!=-1){//legal drawingType  合法的或者当前版本已知的操作type
                        if(obj.drawingType!=500){//tradition drawingType  旧版本的操作
                            var tem_e=new paint(obj);//创建当前笔迹对象
                            tem_e.init_paint(obj);//初始化当前笔迹对象的属性

                            if(obj.drawingType == 3){
                                console.log("接收橡皮擦数据:",JSON.stringify(obj));
                            }

                            //绘制分发
                            tem_e.handle(WEBTools.conf.canvas.targetContext);
                        }else//new drawingType  500段的新功能
                        {
                            switch (obj.specialValue.type){
                                case 0://new rubber 新橡皮擦
                                    //从数据池中根据id寻找到当前的数据
                                    var e=WEBTools.searchByID(obj.specialValue.id);
                                    if(e!=null){
                                        //重置当前笔迹对象的属性
                                        e.init_paint(obj);
                                        //绘制所有
                                        WEBTools.repaint();
                                    }else{
                                        console.error('[%s] -----------> error happened when new rubber: error id to new rubber',window.getTimeNow());
                                    }
                                    break;
                                case 1://drag 拖拽
                                    //从数据池中根据id寻找到当前的数据
                                    var e=WEBTools.searchByID(obj.specialValue.id);
                                    if(e!=null){
                                        //重置当前笔迹对象的属性
                                        e.init_paint(obj);
                                        //绘制所有
                                        WEBTools.repaint();
                                    }else{
                                        console.error('[%s] -----------> error happened when draft handle: error id to draft',window.getTimeNow());
                                    }
                                    break;
                                case 2://reedit 重写
                                    //从数据池中根据id寻找到当前的数据
                                    var e=WEBTools.searchByID(obj.specialValue.id);
                                    if(e!=null){
                                        //重置当前笔迹对象的属性
                                        e.init_paint(obj);
                                        //绘制所有
                                        WEBTools.repaint();
                                    }else{
                                        console.error('[%s] -----------> error happened when reedit handle: error id to reedit',window.getTimeNow());
                                    }
                                    break;
                                default :
                                    //发现当前版本不能识别的type，提示用户升级
                                    if(seaConf.update.tip_update){
                                        WEBTools.orderList.push(-2);//未知修改操作（未来可能添加）
                                        WEBTools.svcId++;
                                        $('#update_cue').css('display','block');
                                        console.error('[%s] -----------> get unknown specialValue.type for 500 : type is %d',window.getTimeNow(),obj.specialValue.type);
                                    }
                                    break;
                            }
                        }
                    }
                    //发现当前版本不能识别的type，提示用户升级
                    else if(seaConf.update.tip_update){
                        WEBTools.orderList.push(-3);
                        WEBTools.svcId++;
                        $('#update_cue').css('display','block');
                        console.error('[%s] -----------> get unknown drawingType handleType 0: drawingType is %d',window.getTimeNow(),obj.drawingType);
                    }
                }else if(obj.handleType==1){//delete
                    if(obj.drawingType==1) //back
                        WEBTools.draw('back',1);
                    else if(obj.drawingType==2)  //clear
                        WEBTools.draw('clear',1);
                    //发现当前版本不能识别的type，提示用户升级
                    else if(seaConf.update.tip_update){
                        $('#update_cue').css('display','block');
                        console.error('[%s] -----------> get unknown drawingType of handleType 1: drawingType is %d',window.getTimeNow(),obj.drawingType);
                    }
                }else if(obj.handleType==2){//change
                    //发现当前版本不能识别的type，提示用户升级
                    if(seaConf.update.tip_update){
                        $('#update_cue').css('display','block');
                        console.error('[%s] -----------> get unknown drawingType of handleType 2: drawingType is %d',window.getTimeNow(),obj.drawingType);
                    }
                }else {
                    //发现当前版本不能识别的type，提示用户升级
                    if(seaConf.update.tip_update){
                        $('#update_cue').css('display','block');
                        console.error('[%s] -----------> get unknown handleType: handleType is %d',window.getTimeNow(),obj.handleType);
                    }
                }
            }catch(e){
                console.error('[%s] -----------> error happened when Paint update: %s',window.getTimeNow(),e);
            }
        },

        searchByID: function (id) {//根据id在WEBTools.recordConArr中寻找当前笔迹的原始数据
            var i,j;
            var temArr=WEBTools.recordConArr;
            for(i= 0,j=temArr.length;i<j;i++){
                if(temArr[i].id==id&&temArr[i].changeCount!=0){
                    return temArr[i];
                }
            }
            return null;
        },

        handle_back:function (target_id){//回退操作
            //策略
            //先回退当前笔迹的修改操作：比如拖拽，新橡皮的擦出，重写等
            //再回退笔迹
            var i,j;
            for(i= 0,j=WEBTools.recordConArr.length;i<j;i++){
                if(WEBTools.recordConArr[i].id==target_id&&WEBTools.recordConArr[i].changeCount!=0){//find target
                    WEBTools.clearConText(1);
                    var tem_e=WEBTools.recordConArr[i];
                    tem_e.changeCount--;//先将当前笔迹的改变总量-1
                    if(tem_e.changeCount==0)//init state  表示当前的笔迹已经么可以回退的改变了 ，直接隐藏当前的笔迹
                    {
                        tem_e.display=0;
                        WEBTools.svcId--;//id-1
                    }
                    else{//there are some change after init  表示当前的笔迹还存在可以回退的改变 比如拖拽，新橡皮的擦出，重写等
                        var del=tem_e.Arr_data_handle.pop();//pop最近的历史记录
                        if(del.drawingType==500&&del.specialValue.type==0)
                            tem_e.display=1;
                        else{
                            var obj=tem_e.Arr_data_handle[tem_e.Arr_data_handle.length-1];
                            tem_e.init_paint(obj,1);
                        }
                    }
                    WEBTools.repaint();
                }
            }
        },

        handle_clear:function (){//清空操作
            var target_e;
            for(var i=0,j=WEBTools.recordConArr.length;i<j;i++){
                target_e=WEBTools.recordConArr[i];
                //全部隐藏掉
                target_e.display=0;
                //全部改变总量置为0
                target_e.changeCount=0;
            }
            //操作序列置为空
            WEBTools.orderList.length=0;
            WEBTools.repaint();

            WEBTools.svcId=1;
        },

        clearConText:function (type){//type为undefined清空过程层，不为undefined清空过程层和结果层
            try{
                if(!type)
                    WEBTools.conf.canvas.targetBakContext.clearRect(0,0,WEBTools.conf.canvas.width,WEBTools.conf.canvas.height);
                else
                {
                    WEBTools.conf.canvas.targetContext.clearRect(0,0,WEBTools.conf.canvas.width,WEBTools.conf.canvas.height);
                    WEBTools.conf.canvas.targetBakContext.clearRect(0,0,WEBTools.conf.canvas.width,WEBTools.conf.canvas.height);
                }
            }catch(e){

            }
        },

        repaint: function () {//重绘
            WEBTools.clearConText(1);
            var e;
            var i=0,j=WEBTools.recordConArr.length;
            while(i<j){
                e=WEBTools.recordConArr[i];
                e.handle(WEBTools.conf.canvas.targetContext,2);
                i++;
            }
        },

        getOffset:function(Node, offset) {
            if (!offset) {
                offset = {};
                offset.top = 0;
                offset.left = 0;
            }
            if (Node == document.body) {//if current node is body，end
                return offset;
            }
            offset.top += Node.offsetTop;
            offset.left += Node.offsetLeft;
            return WEBTools.getOffset(Node.parentNode, offset);//up and account
        }
    }

    var paint= function (obj) {
        //parent class
        this.Arr_data_handle=new Array();//record every change's all data to back 用于存储所有的历史记录信息

        if(obj.specialValue.owner!=undefined){//预留
            this.login_type=obj.specialValue.owner;
        }else{//Compatible with older versions  适配老版本
            //为了记录颜色
            if(obj.drawingType==4)//text
            {
                this.login_type= obj.specialValue.font.font_color==WEBTools.conf.canvas.teaFontC?'tea':'stu';
            }
            else
            {
                this.login_type= obj.specialValue.pencil_color==WEBTools.conf.canvas.teaPenC?'tea':'stu';
            }
        }
        this.version_type=WEBTools.conf.version;//版本信息
        this.id=WEBTools.svcId;//id
        this.handleType=obj.handleType;
        this.drawingType=obj.drawingType;
        //update conf
        WEBTools.orderList.push(WEBTools.svcId);//加入操作列表
        WEBTools.recordConArr.push(this);//加入对应的对象列表
        WEBTools.svcId++;//递增id
    }

//初始化信息
    paint.prototype.init_paint= function (obj,type) {//init paint data  为当前的对象赋值
        if(!type)
            this.Arr_data_handle.push(obj);//入栈
        if(obj.handleType==0){//add
            if(obj.drawingType!=500){//旧操作
                this.canvasWidth=obj.specialValue.canvasWidth;//记录当前的笔迹的相对的画布大小
                this.canvasHeight=obj.specialValue.canvasHeight;//记录当前的笔迹的相对的画布大小
                //it maybe change after,but now set 1
                this.changeCount=1;//记录更改的次数 默认为1（出生）
                //1 will show, 0 won't  控制是否显示
                this.display=1;

                this.child_div_W=obj.specialValue.child_div_W;//笔记区域的大小
                this.child_div_H=obj.specialValue.child_div_H;//笔记区域的大小
                this.margin_left=obj.specialValue.margin_left;//笔记区域的边距
                this.margin_top=obj.specialValue.margin_top;//笔记区域的边距
                this.drag_left=0;//笔迹的拖拽的距离
                this.drag_top=0;//笔迹的拖拽的距离
                //记录笔迹的属性style
                if(obj.drawingType==4)//text 文本
                {
                    this.font_color=obj.specialValue.font.font_color;
                    this.font_size=obj.specialValue.font.font_size;
                    this.font_style=obj.specialValue.font.font_style;
                    this.point_Arr_text=window.MyBase64.decode(obj.specialValue.str_text).replace(/\/u0027/g,'\'');//replace适配老版本
                }
                else//pen
                {
                    this.color=obj.specialValue.pencil_color;
                    this.size=obj.specialValue.pencil_size;
                    this.point_Arr_text=obj.specialValue.point;
                }
            }else{
                //new handle 新操作（具有在已有笔迹的基础上更改性质的操作）
                //update conf
                WEBTools.orderList.push(this.id);
                WEBTools.svcId++;
                if(!type)
                    this.changeCount++;//没更改一次，更新哨兵一次
                switch (obj.specialValue.type){
                    case 0://new rubber 新橡皮
                        this.display=0;
                        break;
                    case 1://drag  拖拽
                        this.drag_left=obj.specialValue.drag_left;
                        this.drag_top=obj.specialValue.drag_top;
                        break;
                    case 2://reedit 重写
                        this.child_div_W=obj.specialValue.child_div_W;
                        this.child_div_H=obj.specialValue.child_div_H;
                        this.drag_left=obj.specialValue.drag_left;
                        this.drag_top=obj.specialValue.drag_top;
                        this.point_Arr_text=window.MyBase64.decode(obj.specialValue.str_text).replace(/\/u0027/g,'\'');
                        break;
                    default :
                        break;
                }
            }
        }
        else if(obj.handleType==1){
            /*delete*/
        }else if(obj.handleType==2){
            /*change*/
        }
    }

//按类型操作
    paint.prototype.handle= function (target_context) {//Message Dispatch 进行分发，实现绘制
        try{
            if(this.display==1&& (seaConf.classInfo.textInfo.curPage == seaConf.classInfo.serverInfo.curPage)){
                switch (this.drawingType){
                    case 0://pen
                        this.canvas_pencil(target_context);
                        break;
                    case 2://rectangle
                        this.canvas_square(target_context);
                        break;
                    case 10://Highlighter pen
                        this.canvas_sign(target_context);
                        break;
                    case 4://text
                        this.canvas_write(target_context);
                        break;
                    case 3://old rubber
                        this.canvas_rubber(target_context);
                        break;
                    default :
                        break;
                }
            }
        }catch(e){
            console.error('[%s] -----------> error happened when paint.prototype.handle : %s',window.getTimeNow(),e);
        }

    }
//    下面所有的绘制策略都是
//    先计算缩放比例，用于之后对点信息或者文字大小信息的缩放
//    根据对象设置当前的绘制属性
//画笔
    paint.prototype.canvas_pencil= function (target_context) {
        var s=WEBTools.conf.canvas.width/this.canvasWidth;
        var s2=WEBTools.conf.canvas.width/800;
        var lineWid=Math.round(WEBTools.conf.pencil.size*s2);
        target_context.lineCap='round';
        target_context.lineJoin="round";
        target_context.strokeStyle= this.color;
        //-----------------------修改为本地写死--------------------------
        //target_context.lineWidth = this.size*s2;
        target_context.lineWidth = lineWid;
        //-----------------------修改为本地写死--------------------------
        target_context.moveTo((this.point_Arr_text[0].x+this.drag_left)*s,(this.point_Arr_text[0].y+this.drag_top)*s);
        target_context.beginPath();
        for(var i=1;i<this.point_Arr_text.length;i++){
            target_context.lineTo((this.point_Arr_text[i].x+this.drag_left)*s,(this.point_Arr_text[i].y+this.drag_top)*s);
        }
        target_context.stroke();
    }

//长方形
    paint.prototype.canvas_square= function (target_context) {
        var s=WEBTools.conf.canvas.width/this.canvasWidth;
        var s2=WEBTools.conf.canvas.width/800;
        var lineWid=Math.round(WEBTools.conf.pencil.size*s2);
        target_context.strokeStyle= this.color;
        target_context.lineJoin="round";
        //-----------------------修改为本地写死--------------------------
        //target_context.lineWidth = this.size*s2;
        target_context.lineWidth = lineWid;
        //-----------------------修改为本地写死--------------------------
        target_context.moveTo((this.point_Arr_text[0].x+this.drag_left)*s,(this.point_Arr_text[0].y+this.drag_top)*s);
        target_context.beginPath();
        target_context.lineTo((this.point_Arr_text[1].x+this.drag_left)*s,(this.point_Arr_text[0].y+this.drag_top)*s);
        target_context.lineTo((this.point_Arr_text[1].x+this.drag_left)*s,(this.point_Arr_text[1].y+this.drag_top)*s);
        target_context.lineTo((this.point_Arr_text[0].x+this.drag_left)*s,(this.point_Arr_text[1].y+this.drag_top)*s);
        target_context.lineTo((this.point_Arr_text[0].x+this.drag_left)*s,(this.point_Arr_text[0].y+this.drag_top)*s);
        target_context.closePath();
        target_context.stroke();
    }

//荧光笔
    paint.prototype.canvas_sign= function (target_context) {
        target_context.save();
        var s=WEBTools.conf.canvas.width/this.canvasWidth;

        target_context.lineCap='round';
        target_context.lineJoin="round";
        target_context.strokeStyle=this.color;
        target_context.globalAlpha=0.3;
        target_context.globalCompositeOperation='destination-over';
        target_context.lineWidth=this.size*WEBTools.conf.canvas.width/800;
        target_context.moveTo((this.point_Arr_text[0].x+this.drag_left)*s,(this.point_Arr_text[0].y+this.drag_top)*s);
        target_context.beginPath();
        for(var i=2;i<this.point_Arr_text.length;i++){
            target_context.lineTo((this.point_Arr_text[i].x+this.drag_left)*s,(this.point_Arr_text[i].y+this.drag_top)*s);
        }
        target_context.stroke();
        target_context.restore();
    }

//文字
    paint.prototype.canvas_write= function (target_context){
        var theString=this.point_Arr_text;
        var s=WEBTools.conf.canvas.width/this.canvasWidth;
        var hei_point=(this.margin_top+this.drag_top)*s;
        var wid_point=(this.margin_left+this.drag_left)*s+WEBTools.textData.inputBorder;
        var words=[];
        var i,j;

        target_context.font='bold '+Math.round(this.font_size*s)+"px "+WEBTools.conf.font.fontStyle;//修改为写死数值songti
        target_context.fillStyle=this.font_color;

        theString.replace(/\r\n/g,'\n');
        words=theString.split(/\n/);

        for(i=0,j=words.length;i<j;i++){
            hei_point+=(this.font_size)*s;
            target_context.fillText(words.shift(),wid_point,hei_point);
        }
    }

//旧版橡皮擦
    paint.prototype.canvas_rubber= function (target_context) {
        target_context.save();
        var s=WEBTools.conf.canvas.width/this.canvasWidth;
        var sizerub=WEBTools.conf.rub.size*s;
        target_context.lineCap='round';
        target_context.lineJoin="round";
        /*for(var i=0;i<this.point_Arr_text.length;i++){
            //橡皮擦数据
            target_context.clearRect((this.point_Arr_text[i].x)*s-sizerub/2,(this.point_Arr_text[i].y)*s-sizerub/2,sizerub,sizerub);
        }*/
        target_context.lineWidth = sizerub;

        target_context.globalCompositeOperation = "destination-out";
        //-----------------------修改为本地写死--------------------------
        target_context.moveTo((this.point_Arr_text[0].x+this.drag_left)*s,(this.point_Arr_text[0].y+this.drag_top)*s);
        target_context.beginPath();
        for(var i=1;i<this.point_Arr_text.length;i++){
            target_context.lineTo((this.point_Arr_text[i].x+this.drag_left)*s,(this.point_Arr_text[i].y+this.drag_top)*s);
        }
        target_context.stroke();

        target_context.restore();
    }

    exports.resizePaint=function (wid,hei,left,top) {//用于第一次初始化和之后的每一次容器变化来设置画布的大小的
        WEBTools.review(wid,hei,left,top);
    };
    exports.draw=function (type) {//画笔激活，更换画笔，回退，清空
        WEBTools.draw(type);
    };
    exports.showCefPaint=function (obj) {//显示服务端的数据
        WEBTools.showPaint(obj);
    };
    exports.setBoardConf=function (obj) {//更新白板当前配置
        //update conf for WEBTools
        WEBTools.conf.type=(obj.type!=undefined)?obj.type:WEBTools.conf.type;
        WEBTools.conf.version=(obj.version!=undefined)?obj.version:WEBTools.conf.version;
        if(obj.pauseDraw!=undefined){
            if(obj.pauseDraw){//pauseDraw become true when drawing
                if(WEBTools.conf.paintBoard.input&&WEBTools.conf.paintBoard.input.style.display!='none'){//writing
                    WEBTools.write_end();
                }else{//other
                    WEBTools.mouseup();
                }
            }
            WEBTools.conf.pauseDraw=obj.pauseDraw;
        }
        if(obj.paintModule!=undefined){
            WEBTools.conf.paintModule=(obj.paintModule!=undefined)?obj.paintModule:WEBTools.conf.paintModule;
            if(WEBTools.conf.paintModule==='draw'&&WEBTools.binded===false){
                //切换为draw模式，防止未绑定
                WEBTools.initWEBTools();
            }
        }

        if(obj.pencil!=undefined){
            WEBTools.conf.pencil.color=(obj.pencil.color!=undefined)?obj.pencil.color:WEBTools.conf.pencil.color;
            WEBTools.conf.pencil.size=(obj.pencil.size!=undefined)?obj.pencil.size:WEBTools.conf.pencil.size;
        }
        if(obj.sign_pencil!=undefined){
            WEBTools.conf.sign_pencil.color=(obj.sign_pencil.color!=undefined)?obj.sign_pencil.color:WEBTools.conf.sign_pencil.color;
            WEBTools.conf.sign_pencil.size=(obj.sign_pencil.size!=undefined)?obj.sign_pencil.size:WEBTools.conf.sign_pencil.size;
        }
        if(obj.rub!=undefined){
            WEBTools.conf.rub.size=(obj.rub.size!=undefined)?obj.rub.size:WEBTools.conf.rub.size;
        }
        if(obj.font!=undefined){
            WEBTools.conf.font.fontStyle=(obj.font.fontStyle!=undefined)?obj.font.fontStyle:WEBTools.conf.font.fontStyle;
            WEBTools.conf.font.fontSize=(obj.font.fontSize!=undefined)?obj.font.fontSize:WEBTools.conf.font.fontSize;
            WEBTools.conf.font.fontColor=(obj.font.fontColor!=undefined)?obj.font.fontColor:WEBTools.conf.font.fontColor;
        }
        if(obj.target){
            WEBTools.conf.font.fontStyle=(obj.font.fontStyle!=undefined)?obj.font.fontStyle:WEBTools.conf.font.fontStyle;
        }
    };
    exports.rePaint= function () {//重绘
        WEBTools.repaint();
    };
    exports.clearPaint= function () {//清空所有笔记，但是不清楚数据
        WEBTools.clearConText(1);
    }
});
/**
 * Created by Administrator on 2016/8/16.
 * module info:
 *        管理程序的事件绑定函数和分类调用
 */
define('eventBind',['boardConf','enDataSend','moduleTools'],function (require, exports, module) {
    var seaConf=require('boardConf').conf,
        seaDataSend=require('enDataSend'),
        seaTools=require('moduleTools');
    var eventBind={
        'Arr_scroll':[],//used to achieve teacher's scrollData tip 用于存储滚动提示信息的内容，实现滚动提示信息
        'mouse':{//used to remember last mouse move,see every mouse move is effective or not  用于存储上一个鼠标的位置，判断当前的鼠标是否存在有效的移动
            'lastX':0,
            'lastY':0
        },
        'topScroll':0,//used to remember last scroll top,see every scroll is effective or not 用于记录上一个滚动条的信息，判断滚动条是否有有效的滚动
        'bind': function () {// unified management for bind 用于绑定事件
            //-------------------------------------------------for h5Course demo-----------------------------------------------------------------
            //修改检测机制判断ppt index.html的加载
            var iframe=document.getElementById('showDomain');
            if (iframe.attachEvent){
                iframe.attachEvent("onload", function(){
                    eventBind.loadedEvent();
                });
            }
            else {
                iframe.onload = function(){
                    eventBind.loadedEvent();
                };
            }
            //-------------------------------------------------for h5Course demo-----------------------------------------------------------------
            //resize 缩放窗口
            window.addEventListener('resize', function () {
                console.log('[%s] -----------> listen resize event',window.getTimeNow());
                //避免抖动，只处理最后一次的缩放
                eventBind.throttleStep(eventBind.resizeEvent);
            })
            //if(this module is alive) do sth
            if(seaConf.event.scrollData){//当滚动提示信息事件被激活
                //tip scroll
                console.log('[%s] -----------> listen scroll data event',window.getTimeNow());
                this.scrollDataEvent();
            }
            if(seaConf.event.fixedData){//当固定提示信息事件被激活
                //tip fixed
                console.log('[%s] -----------> listen fixed data event',window.getTimeNow());
                this.fixedDataEvent();
            }
            if(seaConf.moduleSet.page){//当翻页事件被激活
                //page changed
                console.log('[%s] -----------> listen page handle event',window.getTimeNow());
                this.pageChangeEvent();
            }
            if(seaConf.moduleSet.tools){//当工具条事件被激活 工具条显示时
                //tool is clicked
                console.log('[%s] -----------> listen tools handle event',window.getTimeNow());
                this.toolChangeEvent();
            }
            if(seaConf.moduleSet.update){//当更新事件被激活 支持更新提示功能
                //update tip (never tip is chosed or not )
                console.log('[%s] -----------> listen update event (unknow type from svc)',window.getTimeNow());
                $('#update_cue').bind('click', function (e) {
                    if(e.target.id=='cue_close'){//当关闭按钮被点击
                        $('#update_cue').css('visibility','hidden');
                    }else if(e.target.id=='cue_stop'){//当不再提示按钮被点击
                        seaConf.update.tip_update=false;//更新数据池
                        $('#update_cue').css('visibility','hidden');
                    }
                    else if(e.target.id=='cue_update'){//当立即升级按钮被点击
                        $('#update_cue').css('visibility','hidden');
                    }
                });
            }
            if(seaConf.event.mouse||seaConf.event.barScroll||seaConf.event.timeTip){//当鼠标监听或者滚动条监听被激活
                //mouse event and barScroll event
                setInterval(function () {
                    if(seaConf.event.mouse){//鼠标监听
                        //mouse event is alive
                        eventBind.mouseEvent();
                    }
                    if(seaConf.event.barScroll){//滚动条监听
                        //barScroll event is alive
                        eventBind.barScrollEvent();
                    }
                    if(seaConf.event.timeTip){//时间提示事件
                        eventBind.timeTipEvent();
                    }
                    //哨兵小于阈值且哨兵递增到最大值  隐藏对面的鼠标
                    if(seaConf.board.mouse.mouseSign<seaConf.board.mouse.mouseMax&&
                        (++seaConf.board.mouse.mouseSign)>=seaConf.board.mouse.mouseMax){
                        $("#mouseTea").hide();
                    }
                },1000);
                if(seaConf.event.mouse){
                    console.log('[%s] -----------> listen mouse event',window.getTimeNow());
                }
                if(seaConf.event.barScroll){
                    console.log('[%s] -----------> listen scroll event',window.getTimeNow());
                }
                if(seaConf.event.timeTip){//时间提示事件
                    console.log('[ %s ]-----------> listen tools handle event',window.getTimeNow());
                }
            }
            //-------------------------------------------------for h5Course demo-----------------------------------------------------------------
            if(seaConf.moduleSet.ccLayer){
                this.ccLayer();
            }
            //点击右键弹出菜单，隐藏白板
            //-------------------------------------------------for h5Course demo-----------------------------------------------------------------
            //after bind init board css first
            eventBind.throttleStep(eventBind.resizeEvent);
        },
        loadedEvent:function () {
            //-------------------------------------------------for h5Course demo-----------------------------------------------------------------
            var back=true;//用于检测是否有向互动教材成功传递初始化信息 不成功的情况：页面加载失败
            //-------------------------------------------------for h5Course demo-----------------------------------------------------------------
            if(seaConf.host.textType==='h5Course'){
                //init obj iFrame  向互动教材传递初始化信息
                window.iFrameParIO.parentCon=$(window.parent.document).contents().find("#showDomain")[0].contentWindow;
                back=window.iFrameParIO.H5Course.init();
                window.iFrameParIO.dataDrawI(0,0,0,0);
            }
            if(back){//成功向互动教材页面传递了信息
                //更新本地信息
                //首先检测当前服务端页码是否和当前的教材类型的页码相同  不相同则强制同步   share
                if(seaConf.user.type==='tea'&&seaConf.classInfo.serverInfo.curPage!==seaConf[seaConf.host.textType].curPage){
                    seaTools.agentTools('gopage',{targetPage:seaConf[seaConf.host.textType].curPage});
                    return;
                }
                seaConf.classInfo.textInfo.curPage=seaConf.classInfo.serverInfo.curPage;
                var tem_e={
                    'cur':seaConf.classInfo.textInfo.curPage-1,//客户端和服务器从0开始
                    'count':seaConf.classInfo.textInfo.countPage
                };
                //更新客户端的页码信息
                seaDataSend.sendCommData('teenpage',JSON.stringify(tem_e));
                //-------------------------------------------------for h5Course demo-----------------------------------------------------------------
                window.iFrameParIO.setPageO(seaConf.classInfo.serverInfo.curPage);
                //-------------------------------------------------for h5Course demo-----------------------------------------------------------------

            }
        },
        'fixedDataEvent': function () {
            //let outer remember user's chose
            $('#data_close').bind('click', function (e) {//当固定提示信息被关闭时通知客户端记录，重进教室之后不再显示
                var obj={
                    'type':'fixdata',
                    'status':'close'
                };
                seaDataSend.sendCommData('tipdata',JSON.stringify(obj));
                $('.fixdata_tea').css('display','none');
                e.preventDefault();
                e.stopPropagation();
            });
        },
        'scrollDataEvent': function () {
            $('.scroll_tea').css('display','block');
            //提示内容进栈
            if(seaConf.user.type=='teen'){//青少
                this.Arr_scroll.push('Speak slowly.');
                this.Arr_scroll.push('Ask students to repeat new words and sentences 2 times.');
                this.Arr_scroll.push('Use more TPR and gestures.');
                this.Arr_scroll.push('Motivate the student to speak complete sentences.');
                this.Arr_scroll.push('Keep instructions simple and short.');
            }else{//成人教室
                this.Arr_scroll.push('Speak slowly to low-leveled students.');
                this.Arr_scroll.push('Motivate students to speak complete sentences.');
                this.Arr_scroll.push('Ask students to repeat new words and sentences 2 times.');
                this.Arr_scroll.push('Correct only those mistakes that lead to misunderstanding.');
                this.Arr_scroll.push('Don’t stay at warm-up too long, and there must be a wrap-up');
            }

            $('.scroll_tea').text(eventBind.Arr_scroll.shift());//先显示第一条记录
            //这里处理的很差，之后干掉，归到一个时间轴上
            setTimeout(function () {
                setInterval(function () {
                    if(eventBind.Arr_scroll.length==0){
                        if(seaConf.user.type=='teen'){//青少
                            eventBind.Arr_scroll.push('Speak slowly.');
                            eventBind.Arr_scroll.push('Ask students to repeat new words and sentences 2 times.');
                            eventBind.Arr_scroll.push('Use more TPR and gestures.');
                            eventBind.Arr_scroll.push('Motivate the student to speak complete sentences.');
                            eventBind.Arr_scroll.push('Keep instructions simple and short.');
                        }else{
                            eventBind.Arr_scroll.push('Speak slowly to low-leveled students.');
                            eventBind.Arr_scroll.push('Motivate students to speak complete sentences.');
                            eventBind.Arr_scroll.push('Ask students to repeat new words and sentences 2 times.');
                            eventBind.Arr_scroll.push('Correct only those mistakes that lead to misunderstanding.');
                            eventBind.Arr_scroll.push('Don’t stay at warm-up too long, and there must be a wrap-up');
                        }
                        $('.scroll_tea').text(eventBind.Arr_scroll.shift());
                    }else{
                        $('.scroll_tea').text(eventBind.Arr_scroll.shift());
                    }
                },5000)
            },5000);
        },
        'mouseEvent':function(){
            //update mouse with teacher's board
            var MPoint=seaConf.board.mouse; //取最新的鼠标位置
            var classInfo=seaConf.classInfo; //取教室信息
            var offsetP=eventBind.getOffset(document.getElementById('paintBoard'));
            if(eventBind.mouse.lastX!=MPoint.curX||eventBind.mouse.lastY!=MPoint.curY){//有效的移动
                var obj={
                    'canvasWidth':classInfo.drawInfo.width,
                    'canvasHeight':classInfo.drawInfo.height,
                    'mouseX':MPoint.curX-offsetP.left,
                    'mouseY':MPoint.curY-offsetP.top,
                    'CurrentPage':classInfo.textInfo.curPage
                }
                seaDataSend.sendCommData('mouse',JSON.stringify(obj));//发送鼠标信息到服务器
                //更新当前鼠标的信息，便于下次的鼠标有效移动的比较
                eventBind.mouse.lastX=MPoint.curX;
                eventBind.mouse.lastY=MPoint.curY;
            }
        },
        'pageChangeEvent': function () {//h5自己的翻页
            $('#toolbar_id').find('.toolbarRight, .toolbarRight_m').bind('click', function (e) {
                e=e||window.event||arguments.callee.caller.arguments[0];
                var name= e.target.id;
                var obj=null;
                switch (name){
                    case 'previousPage'://上一页
                        if(seaConf.classInfo.textInfo.curPage-1>0){
                            obj={
                                targetPage:seaConf.classInfo.textInfo.curPage-1
                            }
                        }
                        break;
                    case 'nextPage'://下一页
                        if(seaConf.classInfo.textInfo.curPage+1<=seaConf.classInfo.textInfo.countPage){
                            obj={
                                targetPage:seaConf.classInfo.textInfo.curPage+1
                            }
                        }
                        break;
                    case 'update_tea'://同步页码
                        obj={
                            targetPage:seaConf.classInfo.serverInfo.curPage
                        }
                        break;
                    case 'btn_chat':
                        //显示或者隐藏聊天窗口
                        AppDelegate.app.chatPro.showOrHide();
                        break;
                    default:
                        break;
                }
                if(obj){//判断如果是有效的点击 抛给代理
                    seaTools.agentTools('gopage',obj);
                }
            });
            document.getElementById('pageNumber').addEventListener('click', function() {
                this.select();
            });

            document.getElementById('pageNumber').addEventListener('change', function() {//选中直接输入页码的跳转
                //tool_e.tool_skip(this.value);
                //屏蔽不合理的页码输入
                if(this.value<=seaConf.classInfo.textInfo.countPage&&this.value>0){
                    var obj={
                        targetPage:this.value
                    };
                    seaTools.agentTools('gopage',obj);
                }else{
                    this.value=seaConf.classInfo.textInfo.curPage;
                }
            });
        },
        'toolChangeEvent': function () {//h5自己的工具条点击事件
            var selectedClassName=seaConf.course.isMultiVC?'selectedBut_m':'selectedBut';
            $('.outerCenter').bind('click', function (e) {

                //老师未进房间，禁止使用画板工具
                if(!seaConf.user.teaLogin || !(seaConf.course.canDraw&&!seaConf.board.pauseDraw))return;

                e=e||window.event||arguments.callee.caller.arguments[0];
                var name= e.target.id!==''?e.target.id:e.target.className;
                var obj=null;

                //handle different chose
                switch (name){
                    case 'hand_pen'://铅笔
                        obj={
                            type:'pen'
                        };
                        //实现三态
                        $('#tools_handle span').removeClass(selectedClassName);
                        $('#tools_handle').find('#hand_pen').addClass(selectedClassName);
                        break;
                    case 'hand_signpen'://荧光笔
                        obj={
                            type:'signpen'
                        };
                        //实现三态
                        $('#tools_handle span').removeClass(selectedClassName);
                        $('#tools_handle').find('#hand_signpen').addClass(selectedClassName);
                        break;
                    case 'hand_rec'://矩形
                        obj={
                            type:'rec'
                        };
                        //实现三态
                        $('#tools_handle span').removeClass(selectedClassName);
                        $('#tools_handle').find('#hand_rec').addClass(selectedClassName);
                        break;
                    case 'hand_text'://文本
                        obj={
                            type:'text',
                            size:'big'
                        };
                        $('#chose_font').show();//显示选择文本的大小
                        $('#chose_font').focus();
                        //实现三态
                        $('#tools_handle span').removeClass(selectedClassName);
                        $('#tools_handle').find('#hand_text').addClass(selectedClassName);
                        break;
                    case 'hand_text selectedBut'://默认的文本大小
                        obj={
                            type:'text',
                            size:'big'
                        };
                        $('#tools_handle span').removeClass(selectedClassName);
                        $('#chose_font').show();
                        $('#chose_font').focus();
                        break;
                    case 'hand_rub'://橡皮
                        obj={
                            type:'rub'
                        };
                        //实现三态
                        $('#tools_handle span').removeClass(selectedClassName);
                        $('#tools_handle').find('#hand_rub').addClass(selectedClassName);
                        break;
                    case 'hand_newrub'://新版的橡皮
                        obj={
                            type:'newrub'
                        };
                        //实现三态
                        $('#tools_handle span').removeClass(selectedClassName);
                        $('#tools_handle').find('#hand_newrub').addClass(selectedClassName);
                        break;
                    case 'hand_draft'://拖拽
                        obj={
                            type:'draft'
                        };
                        //实现三态
                        $('#tools_handle span').removeClass(selectedClassName);
                        $('#tools_handle').find('#hand_draft').addClass(selectedClassName);
                        break;
                    case 'hand_back'://回退
                        obj={
                            type:'back'
                        };
                        break;
                    case 'hand_clear'://清空
                        obj={
                            type:'clear'
                        };
                        break;
                    case 'hand_magic'://魔法表情
                        obj={
                            left:$('#tools_handle').find('#hand_magic').offset().left+'',
                            top:$('#tools_handle').find('#hand_magic').offset().top+'',
                            ori:0+''
                        };
                        seaDataSend.sendCommData('magic',JSON.stringify(obj));
                        obj=null;
                        break;
                    case 'font_small'://选择小的文字
                        obj={
                            type:'text',
                            size:'small'
                        };
                        $('#tools_handle span').removeClass(selectedClassName);
                        $('#chose_font').find('.font_big').removeClass('selectedFont');
                        $('#chose_font').find('.font_small').addClass('selectedFont');
                        $('#chose_font').removeClass('chose_font_big').addClass('chose_font_small');
                        $('#tools_handle').find('#hand_text').addClass(selectedClassName);

                        break;
                    case 'font_big'://选择大的文字
                        obj={
                            type:'text',
                            size:'big'
                        };
                        $('#tools_handle span').removeClass(selectedClassName);
                        $('#chose_font').find('.font_small').removeClass('selectedFont');
                        $('#chose_font').find('.font_big').addClass('selectedFont');
                        $('#chose_font').removeClass('chose_font_small').addClass('chose_font_big');
                        $('#tools_handle').find('#hand_text').addClass(selectedClassName);

                        break;
                    default:
                        break;
                }
                if(obj){
                    seaTools.agentTools('tools',obj);
                }
            })
            //用于当点击白板时，文字大小选择的隐藏
            $('#chose_font').blur(function () {
                $('#chose_font').hide();
            });
            //如果是h5的工具条那么初始化画板一次   有风险
            if(seaConf.moduleSet.tools){
                var tem={
                    type:'pen'
                };
                seaTools.agentTools('tools',tem);
            }
            //工具条画笔被选中
            $('#tools_handle').find('#hand_pen').addClass(selectedClassName);
        },
        'barScrollEvent': function () {
            var topScroll=$('#scrollbar1').find('.thumb')[0].offsetTop,//取滚动条的滚动块上边缘距离滚动条顶层的距离
                heightBar=$('#scrollbar1').find('.thumb')[0].offsetHeight,//取滚动块的高度
                heightScroll=$('#scrollbar1').find('.track')[0].offsetHeight;//取滚动条的总高度

            var s2=(seaConf.classInfo.textInfo.height-heightScroll)/(heightScroll-heightBar);//（教材总高度-滚动条的总高度）/（滚动条总高度-滚动块的高度）即高出的部分和可滚动距离的比值
            if(heightBar!=0){//存在滚动条
                if(eventBind.topScroll!=topScroll){//有效的滚动
                    var obj={
                        'totalHeight':seaConf.classInfo.textInfo.height,
                        'scrollTop':parseInt(topScroll*s2),//映射到教材上的top
                        'CurrentPage':seaConf.classInfo.textInfo.curPage-1
                    };
                    seaDataSend.sendCommData('scroll',JSON.stringify(obj));
                }
            }
            //更新本次的滚动距离
            eventBind.topScroll=topScroll;
        },
        'resizeEvent': function () {
            //avoid shake , up to now this function don't show positive effect,because client don't support free resize
            var wid=$('#mainContainer').width(),//取容器的宽
                hei=$('#mainContainer').height();//取容器的高
            if(seaConf.moduleSet.contain){//if contain module is alive 如果容器模块存在
                if(seaConf.moduleSet.page&&!seaConf.course.isMultiVC){//if page contain is alive 如果页码模块存在 且不是多视频教室
                    $('#workSpace').height(hei-$('#toolbar_id').height()); //去除页码模块的高度
                }else{//page module is dead
                    $('#workSpace').height(hei);
                }
            }
            //设置css
            $('#showDomain').css({
                'width': $('#workContainer').width(),
                'height': $('#workContainer').height()
            });
            $('.outerCenter').css('left', function () {
                return ($('#mainContainer').width()/2 - $('.outerCenter').width()/2) + 'px';
            });
            //显示工具条
            if(seaConf.moduleSet.tools){
                $('.outerCenter').show();
            }
            //调用一次
            //window.iFrameParIO.resetModuleO();//已经废弃的方法
            window.iFrameParIO.resizeEventO();//调用一次，初始化一次教材
        },
        'timeTipEvent': function () {
            //事件函数
            var curLocalTime=new Date().getTime(),
                startLocalTime=seaConf.course.localTime,
                startedTime=seaConf.course.startedTime;
            var nowTime=Math.max(curLocalTime-startLocalTime+startedTime,0)/1000;//转为s
            var mine=Math.round(nowTime/60-0.5),
                sec=Math.round(nowTime%60-0.5);
            mine=mine<10?0+''+mine:mine+'';
            sec=sec<10?0+''+sec:sec+'';
            $('.timeTipCon').find('.timeInfo').html('<span>'+mine+':'+sec+'</span>');
        },
        //用于实现jquery的offset函数
        'getOffset':function(Node, offset) {
            if (!offset) {
                offset = {};
                offset.top = 0;
                offset.left = 0;
            }
            if (Node == document.body) {//if current node is body，end
                return offset;
            }
            offset.top += Node.offsetTop;
            offset.left += Node.offsetLeft;
            return eventBind.getOffset(Node.parentNode, offset);//up and account
        },
        'throttleStep':function(method,context){
            //避免重复操作 防抖处理
            clearTimeout(method.tid);
            method.tid=setTimeout(function () {
                method.call(context);
            },50);
        },
        //-------------------------------------------------for h5Course demo-----------------------------------------------------------------
        'ccLayer': function () {//cc  第三方人  蒙层 规避所有的点击操作 避免进入教室的行为影响上课
            $('#layerCon').bind('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
            });
        },
        //创建弹出菜单
        'createBoardMenu': function () {
            document.getElementById("workContainer").oncontextmenu = function(e){
                if(seaConf.host.textType==='h5Course'){
                    var pointX = e.pageX,
                        pointY = e.pageY;

                    //弹出框的宽度,高度，阴影宽度
                    var divW = 200,
                        divH = 60,
                        shadowW = 5;

                    //外层的宽度，高度
                    var ContaiW = $(this).width(),
                        ContaiH = $(this).height();

                    //弹出层的左边距,上边距
                    var leftx = pointX,
                        topx = pointY;

                    //避免弹出层超出右边界
                    if(pointX + divW > ContaiW){

                        leftx = leftx - (pointX + divW -ContaiW) - $(".scrollbar").width();
                    }
                    //避免弹出层超出下边界
                    if(pointY + divH > ContaiH){

                        topx = topx - (pointY + divH - ContaiH) - shadowW;
                    }

                    $("#popMenuBox").css({"left":leftx+"px","top":topx+"px"})
                        .show();
                }
            };

            //点击隐藏执行事件
            $("#popMenuBox").on("click", "li", function () {
                $("#popMenuBox").hide();
                $('#paintBoard').hide();
            })

            $("#workContainer").click(function (e) {
                if($("#popMenuBox").is(":visible")) {
                    $("#popMenuBox").hide();
                    e.stopPropagation();
                }
            })

            window.addEventListener('blur', function (e) {
                if($("#popMenuBox").is(":visible")) {
                    $("#popMenuBox").hide();
                }
            })
        },
        //-------------------------------------------------for h5Course demo-----------------------------------------------------------------
    };
    exports.eventStart=function () {
        eventBind.bind();//调用开始绑定的函数
    }
});
/**
 * Created by Administrator on 2016/8/16.
 * module info:
 *        管理页面中的模块，按需加载
 */
define('moduleSet',['boardConf','animate'],function (require, exports, module) {
    var seaConf=require('boardConf').conf;
    var animate = require('animate').animate;
    var module={
        'loadModule':function(){
            var temModuleSet=seaConf.moduleSet;
            var isPDF = true;

            //按需加载
            //外层容器
            if(temModuleSet.contain){
                console.log('[%s] -----------> load contain',window.getTimeNow());
                module.moduleContain();
            }
            //课件显示
            if(temModuleSet.course){
                console.log('[%s] -----------> load course',window.getTimeNow());
                module.moduleCourse(seaConf.host.textType);
            }
            //白板画布
            if(temModuleSet.board){
                console.log('[%s] -----------> load board',window.getTimeNow());
                module.moduleBoard();
            }
            //翻页
            if(temModuleSet.page){
                console.log('[%s] -----------> load page',window.getTimeNow());
                module.modulePage();
            }
            //工具条
             if(temModuleSet.tools){
                console.log('[%s] -----------> load tools',window.getTimeNow());
                module.moduleTools();
            }
            //升级提示
            if(temModuleSet.update){
                console.log('[%s] -----------> load update',window.getTimeNow());
                module.moduleUpdate();
            }
            //滚动提示信息
            if(temModuleSet.dataScroll){
                console.log('[%s] -----------> load scroll data',window.getTimeNow());
                module.moduleDataScroll();
            }
            //固定提示信息
            if(temModuleSet.dataFixed){
                console.log('[%s] -----------> load fiexd data',window.getTimeNow());
                module.moduleDataFixed();
            }
            //-------------------------------------------------for h5Course demo-----------------------------------------------------------------
            //CC蒙层
            if(temModuleSet.ccLayer){
                console.log('[%s] -----------> load cc layer',window.getTimeNow());
                module.moduleCCLayer();
            }
            //-------------------------------------------------for h5Course demo-----------------------------------------------------------------
            //时间提示模块
            if(temModuleSet.timeTip){
                console.log('['+window.getTimeNow()+']'+'----------->'+'load time tip');
                module.moduleTimeTip();
            }
            //教材切换
            if(temModuleSet.switch){
                module.loadSwitch();
            }

            //动画层
            animate.init();
        },
        loadSwitch:function(){
            var $btn_switch = $("<a class='btn-switch'>Switch Material</a>");
            $btn_switch.hide();
            $btn_switch.click(function(){
                window.comm_type_send("H5ChangeBook","{}");
            });
            $(".toolContain").append($btn_switch);
        },
        //------------------------out module-------------------------------//
        'moduleContain' : function () {
            //父模块
            var str='<div class="workSpace" id="workSpace">' +
                '<div id="scrollbar1">' +
                '<div class="viewport" id="dsa">' +
                '<div class="overview" id="overview">' +
                '<div id="workContainer">' +
                '<iframe class="showDomain" id="showDomain" scrolling="no"></iframe>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="scrollbar">' +
                '<div class="track">' +
                '<div class="thumb" id="scroll1_thumb">' +
                '<div class="end"></div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' ;
            $('#mainContainer').append(str);
            //调用滚动条js的初始化函数
            $('#scrollbar1').tinyscrollbar();
            //根据不同的教室来设置不同的背景颜色
            if(seaConf.host.classType=='teen'){
                $('#workSpace').css('background-color','rgb(248,243,232)');
            }else if(seaConf.course.courseType=='1v1'){
                $('#workSpace').css('background-color','rgb(239,243,247)');
            }
        },
        'modulePage' : function () {

            var className=(seaConf.course.isMultiVC&&'toolbarRight_m')||'toolbarRight';

            var str=
                '<div class="toolbar" id="toolbar_id">' +
                '<div class="toolContain">' +
                '<div class="toolbarLeft">' +
                '</div>'+
                '<div class="toolbarCenter">' +
                '</div>'+
                '<div class="'+className+'">' +
                '<ul>'+
                '<li class="item_update"><span id="update_tea" title = "同步"></span></li>'+
                '<li class="item_pre forbid"><span title="上一页" id="previousPage"></span></li>'+
                '<li class="item_num"><input type="tel" id="pageNumber" value="1"/></li>'+
                '<li class="item_count"><span id="numPages"></span></li>'+
                '<li class="item_next"><span title="下一页" id="nextPage"  tabindex="14"></span></li>'+
                '<li class="item_chat"><span title="聊天" id="btn_chat"  tabindex="15"></span></li>'+
                '</ul>'+
                '</div>'+
                '</div>'+
                '</div>';
            $('#mainContainer').append(str);
            if(seaConf.course.isMultiVC){
                //如果是多视频教室 宽度调整，位置调整
                $('#toolbar_id').css({
                    'right':'0px'
                });
            }

            //如果是英文的版面更换信息
            if(seaConf.host.language=='en'){
                $('#previousPage').attr('title','Previous Page');
                $('#nextPage').attr('title','Next Page');
                $('#update_tea').attr('title','updatePage');
            }
        },
        'moduleTools' : function () {

            var str1='<div class="tool_m_l_r" id="toolbar_left" style="left: 0px;"></div>'
                +'<div class="tool_m_l_r" id="toolbar_right" style="right: 0px;"></div>'
                +'<div class="tool_m_l_r" id="toolbar_bottom" style="bottom: 0px;"></div>';
            var str2=
                '<div class="outerCenter">'+
                '<ul class="centerBak">'+
                '<li id="chose_font" tabindex="-1">' +
                '<span class="font_small"></span>' +
                '<span class="font_big"></span>' +
                '</li>' +
                '<li class="'+(seaConf.course.isMultiVC?'tools_handle_m':'tools_handle')+'" id="tools_handle">' ;

            console.log('['+window.getTimeNow()+']'+'----------->'+'load fiexd data');

            if(seaConf.host.language=='en'){
                var line='<span class="hand_pen" id="hand_pen" stitle="画笔" title = "pen"></span>',
                    signline='<span class="hand_signpen" id="hand_signpen" stitle="荧光笔" title = "signpen"></span>',
                    square='<span class="hand_rec" id="hand_rec" stitle="矩形" title = "rect"></span>',
                    text='<span class="hand_text" id="hand_text" stitle="文字" title = "text"></span>',
                    rubber='<span class="hand_rub" id="hand_rub" stitle="橡皮擦" title = "eraser"></span>',
                    newrub='<span class="hand_newrub" id="hand_newrub" stitle="橡皮擦" title = "eraser"></span>',
                    drag='<span class="hand_draft" id="hand_draft" stitle="拖动" title = "move"></span>',
                    back='<span class="hand_back" id="hand_back" stitle="回退" title = "undo"></span>',
                    clear='<span class="hand_clear" id="hand_clear" stitle="清除" title = "clear"></span>',
                    magic='<span class="hand_magic" id="hand_magic" style="display: none" title = "magic"></span>';
            }else{
                var line='<span class="hand_pen" id="hand_pen" stitle="画笔" title = "画笔"></span>',
                    signline='<span class="hand_signpen" id="hand_signpen" stitle="荧光笔" title = "荧光笔"></span>',
                    square='<span class="hand_rec" id="hand_rec" stitle="矩形" title = "矩形"></span>',
                    text='<span class="hand_text" id="hand_text" stitle="文字" title = "文字"></span>',
                    rubber='<span class="hand_rub" id="hand_rub" stitle="橡皮擦" title = "橡皮擦"></span>',
                    newrub='<span class="hand_newrub" id="hand_newrub" stitle="橡皮擦" title = "橡皮擦"></span>',
                    drag='<span class="hand_draft" id="hand_draft" stitle="拖动" title = "拖动"></span>',
                    back='<span class="hand_back" id="hand_back" stitle="回退" title = "回退"></span>',
                    clear='<span class="hand_clear" id="hand_clear" stitle="清除" title = "清除"></span>',
                    magic='<span class="hand_magic" id="hand_magic" style="display: none" title = "魔法表情"></span>';
            }

            //下面根据配置文件来决定显示还是隐藏部分工具，智能调整工具条的长度
            var count= 0,//记录当前的可用的工具的总个数
                sign=0,//记录文字工具之前的工具的总个数 为了确定文字大小选择的显示位置
                first='',//记录第一个工具
                titleArr=[];//一次记录显示的工具的title提示
            if(seaConf.host.tools.text){
                first=(count==0)?'hand_text':first;
                str2+=text;//形成html字符串
                count++;
                titleArr.push('text');
            }
            if(seaConf.host.tools.pen){
                first=(count==0)?'hand_pen':first;
                str2+=line;//形成html字符串
                count++;
                titleArr.push('pencil');
            }
            if(seaConf.host.tools.rec){
                first=(count==0)?'hand_rec':first;
                str2+=square;//形成html字符串
                count++;
                titleArr.push('rectangle');
            }
            if(seaConf.host.tools.signpen){
                first=(count==0)?'hand_signpen':first;
                str2+=signline;//形成html字符串
                count++;
                titleArr.push('highlighter');
            }
            if(seaConf.host.tools.rub){
                first=(count==0)?'hand_rub':first;
                str2+=rubber;//形成html字符串
                count++;
                titleArr.push('rubber');
            }
            if(seaConf.host.tools.newrub){
                first=(count==0)?'hand_newrub':first;
                str2+=newrub;//形成html字符串
                count++;
                titleArr.push('rubber');
            }
            if(seaConf.host.tools.back){
                first=(count==0)?'hand_back':first;
                str2+=back;//形成html字符串
                count++;
                titleArr.push('back');
            }
            if(seaConf.host.tools.clear){
                first=(count==0)?'hand_clear':first;
                str2+=clear;//形成html字符串
                count++;
                titleArr.push('clear');
            }
            if(seaConf.host.tools.draft){
                first=(count==0)?'hand_draft':first;
                str2+=drag;//形成html字符串
                count++;
                titleArr.push('drag');
            }

            //if(seaConf.user.type=='tea'){
            //    first=(count==0)?'hand_magic':first;
            //    str2+=magic;
            //    count++;
            //    titleArr.push('magic');
            //}
            //修改为以下逻辑  count不++，暂时不显示，但是要加入magic的html字符串，修改为客户端通知，因为魔法表情不一定下载完成了
            if(seaConf.user.type=='tea'){
                first=(count==0)?'hand_magic':first;
                str2+=magic;
                titleArr.push('magic');
            }
            //封尾，保证标签的闭合性
            str2+='</li>' +
                '</ul>' +
                '</div>';
            //已不用
            var str3='<div id="tool_move"></div>';
            $('#mainContainer').append(str2);


            //如果没有可用工具，则隐藏工具条
            if(first==''){
                $('.outerCenter').hide();
            }else{
                //如果是英文的系统则修改提示信息
                if(seaConf.host.language=='en'){
                    if(seaConf.user.type!='tea')$('#tools_handle span').attr("title", "The teacher is not in classroom, can't use these tools");
                    $('#tools_handle span').each(function () {
                        $(this).attr('stitle',titleArr.shift());
                    });
                }else{
                    if(seaConf.user.type!='tea')$('#tools_handle span').attr("title", "老师不在教室，不能使用白板工具");
                }

                if(seaConf.course.isMultiVC){
                    //多视频一对多教室样式
                    //处理第一个的边距
                    $('#'+first).css('margin-left', '15px');
                    //计算设置宽度
                    $('#tools_handle').css('width',30+count*44+'px');
                    //计算设置文字选择的边距
                    $('#chose_font').css('margin-left',(sign*44+13)+'px');//sign*44+15-2
                    //设置默认的字体
                    $('#chose_font').find('.font_big').addClass('selectedFont');
                    $('#chose_font').removeClass('chose_font_small').addClass('chose_font_big');

                    //如果是英文的系统则修改提示信息
                    // if(seaConf.host.language=='en'){
                    //     $('#tools_handle').find('span').each(function () {
                    //         $(this).attr('title',titleArr.shift());
                    //     });
                    // }
                }else{
                    //正常一对多教室

                    //调整工具栏左边距
                    // $('.outerCenter').css('left', function () {
                    //     return ($('#mainContainer').width()-$('#tools_handle').width())/6+'px';
                    // });
                    //处理第一个的边距
                    $('#'+first).css('margin-left', '15px');
                    //计算设置宽度
                    //$('#tools_handle').css('width',20+count*22+'px');
                    //计算设置文字选择的边距
                    $('#chose_font').css('margin-left',(sign*22+1)+'px');//sign*(20+2)+15-14
                    //设置默认的字体
                    $('#chose_font').find('.font_small').addClass('selectedFont');
                    $('#chose_font').removeClass('chose_font_big').addClass('chose_font_small');


                    //如果是英文的系统则修改提示信息
                    // if(seaConf.host.language=='en'){
                    //     $('#tools_handle').find('span').each(function () {
                    //         $(this).attr('title',titleArr.shift());
                    //     });
                    // }
                }
            }
        },
        'moduleDataScroll' : function () {
            var str='<div class="scroll_tea"></div>';
            $('#mainContainer').append(str);
            //修改背景颜色
            if(seaConf.host.classType=='teen'){
                $('.scroll_tea').css('background-color','rgb(250, 237, 192)');
            }
        },
        'moduleDataFixed' : function () {
            var str='<div class="fixdata_tea"><div style="position: relative;width: 100%;height: 100%;"><span>Your lesson is recorded for quality purposes. And a quality evaluator might be observing your lesson.</span><div id="data_close"></div></div></div>';
            $('#mainContainer').append(str);
            //fixed data css change
            if(seaConf.host.classType=='teen'){
                $('.fixdata_tea').css('background-color','rgb(98, 97, 93)');
                $('.fixdata_tea').css('cursor',seaConf.cursor.teen.normal);
            }else{
                $('.fixdata_tea').css('cursor',seaConf.cursor.normal.normal);
            }
        },
        'moduleTimeTip' : function () {
            var str='<div class="timeTipCon"><div class="timeInfo"><span>00:00</span></div></div>';
            $('#mainContainer').append(str);
        },
        'moduleUpdate' : function () {
            var str=
                '<div id="update_cue">' +
                '<ul>'+
                '<li class="l1_close"><span id="cue_close"></span></li>'+
                '<li class="l2_info"><span>AC教室又增加新功能啦，升级后即可使用.提示：可在AC主界面左下角系统菜单中点击升级</span></li>'+
                '<li class="l3_chose"><span id="cue_stop" class="cue_stop">不再提示</span></li>'+
                '</ul>'+
            '</div>';
            $('#mainContainer').append(str);
            if(seaConf.host.language=='en'){
                var tipWordsC='<span>New functions in AC,try after upgrading it!Tips: Click on "Upgrade" in the MENU at  the AC main page.</span>';
                $('#update_cue').find('.l2_info').html(tipWordsC);
                $('#update_cue').find('.cue_stop').html('Don\'t ask me again');
            }
        },
        //------------------------out module-------------------------------//

        //-------------------------------------------------for h5Course demo-----------------------------------------------------------------
        //--------------------------for cc---------------------------------//
        'moduleCCLayer': function () {
            var str='<div id="layerCon"></div>';
            $('#mainContainer').append(str);
        },
        //--------------------------for cc---------------------------------//

        //-------------------------------------------------for h5Course demo-----------------------------------------------------------------

        //------------------------inner module-------------------------------//
        'moduleBoard' : function () {
            var str='<div id="paintBoard" class="paintBoard"><div style="position: relative;width: 100%;height: 100%">' +
                '<div id="input" autofocus="autofocus" tabindex="-1">' +
                '<p id="edit" contenteditable="plaintext-only"></p>' +
                '</div>' +
                '<div id="mouseTea"><canvas id="canvasMouse" width="20" height="20"></canvas></div>'+
                '<canvas class="canvas" id="canvas">浏览器不支持</canvas>' +
                '<canvas class="canvas" id="canvas_bak" tabindex="-1"></canvas>' +
                '</div></div>'+
                '<div id="inputBakContain"><span id="inputBak"></span><div>';
            $('#workContainer').append(str);
            //修改光标
            if(seaConf.host.classType=='teen'){
                if(seaConf.user.type!=='tea'){
                    $('#canvas_bak').css('cursor',seaConf.cursor.teen.forbidden);
                }else{
                    $('#canvas_bak').css('cursor',seaConf.cursor.teen.normal);
                    seaConf.board.pauseDraw=false;
                }
                //关于对方的鼠标
                $('#mouseTea').css({
                    'width': seaConf.cursor.teen.size.wid+'px',
                    'height': seaConf.cursor.teen.size.hei+'px',
                    'background-image':seaConf.cursor.teen.ferule
                });
                $('#input').css('cursor',seaConf.cursor.teen.draft);
            }
            else{
                if(seaConf.user.type!=='tea'){
                    $('#canvas_bak').css('cursor',seaConf.cursor.normal.forbidden);
                }else{
                    $('#canvas_bak').css('cursor',seaConf.cursor.teen.normal);
                    seaConf.board.pauseDraw=false;
                }
                //关于对方的鼠标
                $('#mouseTea').css({
                    'width': seaConf.cursor.normal.size.wid+'px',
                    'height': seaConf.cursor.normal.size.hei+'px',
                    'background-image':seaConf.cursor.normal.ferule
                });
                $('#input').css('cursor',seaConf.cursor.normal.draft);
            }

            //-------------------------------------------------for h5Course demo-----------------------------------------------------------------
            //如果是互动教材，白板是透明色
            if(seaConf.host.textType==='h5Course'){
                if(seaConf.user.type==='tea'){
                    $("#paintBoard").css("background-color", seaConf.h5Course.canvasColor);
                }
                //默认没有画布
                $("#paintBoard").hide();
            }
            //-------------------------------------------------for h5Course demo-----------------------------------------------------------------
        },
        'moduleCourse' : function (type) {
            //根据类型加载不同的课件
            switch (type){
                case 'pdf':
                    $('#showDomain').attr('src','./courseLoad/pdf/pdf.html');
                    break;
                case 'h5Course':
                    $('#showDomain').attr('src',seaConf.host.textUrl.h5Course.urlControl+'?'+new Date().getTime());
                    break;
                default :
                    break;
            }
            //init obj iFrame  初始化子iframe对象
            window.iFrameParIO.parentCon=$(window.parent.document).contents().find("#showDomain")[0].contentWindow;
        },
        //------------------------inner module-------------------------------//

    }
    exports.loadModuleStart= function () {
        module.loadModule();
    };
});
/**
 * 动画
 */
define('animate',['boardConf'],function (require, exports, module) {
    var seaConf=require('boardConf').conf;

    var animate = {
        timeid:0,

        //播完完毕后自动关闭时间
        autoTime:60000,

        //传给服务器
        id:0,

        //是否显示播放/关闭按钮
        btnVisible:false,

        init:function(){
            var $div = $("<div class='anime'><iframe scrolling='no'></iframe><div class='btns'></div></div>");
            var $btn_play,$btn_close;

            if(seaConf.host.language=='en'){
                $btn_play = $("<a class='btn-play'>replay</a>");
                $btn_close = $("<a class='btn-close'>close</a>");
            }else{
                $btn_play = $("<a class='btn-play'>重播</a>");
                $btn_close = $("<a class='btn-close'>关闭</a>");
            }

            var $btns = $div.find(".btns");
            $btns.append($btn_play);
            $btns.append($btn_close);
            $btns.hide();

            $(document.body).append($div);
            $div.hide();

            var $iframe = $(".anime iframe");
            var iframe = $iframe.get(0);
            $btn_play.click(function(){
                animate.replay();
            });

            $btn_close.click(function(){
                animate.close();
            });

            animate.showButton(animate.btnVisible);

            window.animeComplete = function(){
                console.log("动画播放完毕");
                //$btns.show();
                var data = {type:"stop",id:animate.id};
                window.comm_type_send("animate",JSON.stringify(data));

                //60秒自动关闭
                //animate.timeid = setTimeout(animate.close,animate.autoTime);
            }
        },

        replay:function(){
            //clearTimeout(animate.timeid);

            var $div = $(".anime");
            var $btns = $div.find(".btns");
            var $iframe = $(".anime iframe");
            var iframe = $iframe.get(0);
            $div.show();
            //$btns.hide();
            iframe.contentWindow.exportRoot.gotoAndPlay(1);

            var data = {type:"play",id:animate.id};
            window.comm_type_send("animate",JSON.stringify(data));
        },

        close:function(){
            //clearTimeout(animate.timeid);

            var $div = $(".anime");
            var $iframe = $(".anime iframe");
            $div.hide();
            $iframe.attr("src","");
            //window.comm_type_send("animate",'{"type":"close"}');
            var data = {type:"close",id:animate.id};
            window.comm_type_send("animate",JSON.stringify(data));
        },

        play:function(path){
            //clearTimeout(animate.timeid);

            var $div = $(".anime");
            var $btns = $div.find(".btns");
            var $iframe = $(".anime iframe");
            $div.show();
            //$btns.hide();
            $iframe.attr("src",path);
        },

        stop:function(){
            clearTimeout(animate.timeid);

            var $div = $(".anime");
            var $iframe = $(".anime iframe");
            $div.hide();
            $iframe.attr("src","");
        },

        showButton:function(b){
            animate.btnVisible = b;
            var $btns = $(".anime .btns");
            if(b){
                $btns.show();
            }
            else{
                $btns.hide();
            }
        }
    }

    //animate.init();
    exports.animate = animate;
});
/**
 * Created by Administrator on 2016/9/10.
 * module info:
 *        用于拆环，弥补设计补足
 *        但是使用我修改的合并js后失去了自己的意义 ，之后的话会干掉
 */
define('enDataSend',['boardConf'],function (require, exports, module) {
    var seaConf=require('boardConf').conf
    exports.sendCommData= function (type,jsonStr) {
        if(type==='paint'&&seaConf.host.textType==='h5Course'&&!seaConf.h5Course.startClass){
            //当互动教材还没有开始上课时，所有的绘制信息不同步，只在本端显示
            return;
        }
        window.comm_type_send(type,jsonStr);
    }
});
/**
 * Created by Administrator on 2016/8/18.
 * module info:
 *        细节逻辑模块
 *        按照类型分发服务器的白板数据
 *        翻页逻辑
 *        滚动条
 *        鼠标教鞭
 */
define('moduleTools',['boardConf','whiteBoard','enDataSend'],function (require, exports, module) {
    var seaConf=require('boardConf').conf,
        seaBoard=require('whiteBoard'),
        seaDataSend=require('enDataSend');

        function setPageProhibit(page, total){
            if(page==1){
                $("#toolbar_id .item_pre").addClass("forbid");
                $("#toolbar_id .item_next").removeClass("forbid");
                return;
            }
            if(page==total){
                $("#toolbar_id .item_pre").removeClass("forbid");
                $("#toolbar_id .item_next").addClass("forbid");
                return;
            }
            $("#toolbar_id .item_pre").removeClass("forbid");
            $("#toolbar_id .item_next").removeClass("forbid");
        }

    var Tools={
        operAgent:function(type,obj){
            if(type=='pageclick'){//随堂测验
                type='gopage';
            }
            switch (type){
                case 'paint'://处理来自服务端的paint数据
                    seaBoard.showCefPaint(obj);
                    break;
                case 'mouse'://mouse event 处理来自服务端的鼠标数据
                    if(seaConf.classInfo.textInfo.curPage==seaConf.classInfo.serverInfo.curPage){
                        if(!(seaConf.user.type=='tea'&&seaConf.course.courseType=='1vN')){
                            $('#mouseTea').show();
                            //更新当前哨兵，用于是否显示隐藏对面的鼠标
                            seaConf.board.mouse.mouseSign=0;
                            //做坐标点的适配
                            var s=seaConf.classInfo.drawInfo.width/obj.canvasWidth;
                            $('#mouseTea').animate({
                                'left': obj.mouseX*s,
                                'top' : obj.mouseY*s
                            },'fast');
                        }
                    }
                    break;
                case 'scroll'://scroll event 用于处理来自服务端的滚动条数据
                    var topScroll=$('#scrollbar1').find('.thumb')[0].offsetTop,//取滚动条的滚动块上边缘距离滚动条顶层的距离
                        heightBar=$('#scrollbar1').find('.thumb').height(),//取滚动块的高度
                        heightScroll=$('#scrollbar1').find('.track')[0].offsetHeight;//取滚动条的总高度
                    var textHeight=seaConf.classInfo.textInfo.height;//获取教材的高度
                    //条件： 存在滚动条&&和老师在同一页&&身份不是老师
                    if(heightScroll!=0&&seaConf.classInfo.textInfo.curPage==seaConf.classInfo.serverInfo.curPage&&seaConf.user.type!='tea'){
                        var s0=textHeight/obj.totalHeight;//取当前的教材高度和对面教材高度的比例
                        var newTop=obj.scrollTop*s0;//取得对面top映射到当前教材的top
                        var s1=(heightScroll-heightBar)/(textHeight-heightScroll);//（教材总高度-滚动条的总高度）/（滚动条总高度-滚动块的高度）即高出的部分和可滚动距离的比值
                        if(newTop>(textHeight-$('#overview').height())){//如果超出了当前的可滚动距离，将课件滚动到最底部
                            newTop=textHeight-$('#overview').height();
                        }
                        //滚动条滚动
                        $('#scrollbar1').find('.thumb').animate({'top':newTop*s1},'fast');
                        //课件区域滚动
                        $('#overview').animate({'top':newTop*-1},'fast');
                    }
                    break;
                case 'page'://page event   handle svc page event 处理来自服务器的翻页
                    //当前课件是pdf或者是新协议传过来的
                    if(seaConf.host.textType==='pdf'||(obj.type&&obj.type==='pageNew')){
                        seaConf.classInfo.serverInfo.curPage=parseInt(obj.CurrentPage)+1;//更新数据池中服务器的页码信息

                        if(seaConf.classInfo.textInfo.curPage!=seaConf.classInfo.serverInfo.curPage){//if cur page ! = server page,go it 判断如果当前本地的页码和服务器的页码不同
                            seaConf.classInfo.textInfo.curPage=seaConf.classInfo.serverInfo.curPage;//强制同步本地页码和服务器页码
                            //update page
                            window.iFrameParIO.setPageO(seaConf.classInfo.textInfo.curPage);//调用翻页
                        }else{
                        }       

                        //for no page module
                        if(seaConf.moduleSet.page){//如果存在page模块，则更新页码显示 隐藏同步按钮
                            $('#pageNumber').val(seaConf.classInfo.serverInfo.curPage);
                            setPageProhibit(seaConf.classInfo.serverInfo.curPage, seaConf.classInfo.serverInfo.countPage);
                            $('.item_update').hide();
                        }
                        //always send to client
                        //总是通知客户端当前页码
                        var tem_e={
                            'cur':seaConf.classInfo.textInfo.curPage-1,
                            'count':seaConf.classInfo.textInfo.countPage
                        };
                        seaDataSend.sendCommData('teenpage',JSON.stringify(tem_e));
                        //如果存在白板模块且当前用户有绘制的能力
                        if(seaConf.moduleSet.board&&seaConf.course.canDraw){
                            //如果老师已经在线并且当前页码和服务器相同
                            if(seaConf.user.teaLogin&&seaConf.classInfo.serverInfo.curPage==seaConf.classInfo.textInfo.curPage){
                                //移除白板的暂停绘制
                                console.log('[%s] -----------> update board to pause draw(false) when page and page number is same',window.getTimeNow());
                                seaConf.board.pauseDraw=false;
                                exports.updateBoardConf({'pauseDraw':false});//update Board conf
                            }
                        }
                        //将本地数据重新绘制一遍
                        seaBoard.rePaint();
                        //重新激活当前的画笔
                        exports.agentTools('tools',{'type':seaConf.board.curToolType});
                    }else{
                        //如果是pdf，更新pdf的页码，防止老师回来回到第一页
                        //更新pdf的页码信息
                        seaConf.pdf.curPage=parseInt(obj.CurrentPage)+1;
                    }
                    break;

                //------------------------------------------for h5Course demo--------------------------------
                case 'pageNew'://page event   handle svc page event 处理来自服务器的翻页    新协议的page内容处理
                    console.log('[%s] -----------> pageNew handle,handle info :%s',window.getTimeNow(),JSON.stringify(obj));
                    //更新当前教材类型的页码信息
                    seaConf[obj.Type].curPage=parseInt(obj.CurrentPage)+1;
                    seaConf[obj.Type].countPage=parseInt(obj.TotalPage);
                    if(obj.Type==seaConf.host.textType){
                        //判断如果类型相同 则此信息对本地页码有效 强制同步
                        var temObj={
                            CurrentPage:seaConf[obj.Type].curPage-1,
                            TotalPage:seaConf[obj.Type].countPage,
                            type:'pageNew'
                        }
                        Tools.operAgent('page',temObj);
                    }
                    break;
                //------------------------------------------for h5Course demo--------------------------------
                case 'updateStuPage':
                    var numCur=parseInt(obj.targetPage);//取目标页码
                    var temObj={
                        'TotalPage':seaConf.classInfo.textInfo.countPage,
                        'CurrentPage':numCur-1
                    }
                    //保证只发送一种协议
                    if(seaConf.host.textType==='pdf'){
                        console.log('[%s] -----------> %s send page data to server,type : updateStuPage(%s %s)',window.getTimeNow(),seaConf.user.type,temObj.CurrentPage,temObj.TotalPage);
                        seaDataSend.sendCommData('page',JSON.stringify(temObj));
                    }else if(seaConf.host.textType==='h5Course'){
                        //支持新协议
                        //------------------------------------------for h5Course demo--------------------------------
                        //这个新的协议
                        temObj.Type=seaConf.host.textType;
                        console.log('[%s] -----------> %s send pageNew data to server,type : updateStuPage(%s %s %s)',window.getTimeNow(),seaConf.user.type,temObj.CurrentPage,temObj.TotalPage,temObj.Type);
                        seaDataSend.sendCommData('pageNew',JSON.stringify(temObj));
                        //------------------------------------------for h5Course demo--------------------------------
                    }
                    break;
                //------------------------------------------for h5Course demo--------------------------------
                case 'gopage'://young classroom page event  处理来自客户端或本身的翻页

                    var numCur=parseInt(obj.targetPage);//取目标页码
                    var lastNum = seaConf.classInfo.textInfo.curPage-1;
                    window.iFrameParIO.setPageO(numCur);//调用翻页
                    seaConf.classInfo.textInfo.curPage=numCur;//更新本地数据

                    if(seaConf.user.type=='tea'){
                        //------------------------------------------for h5Course demo--------------------------------
                        if((seaConf.host.textType==='h5Course'&&seaConf.h5Course.startClass)||seaConf.host.textType==='pdf'){
                            //更新服务器页码数据
                            seaConf.classInfo.serverInfo.curPage=numCur;

                            //-------------------------------------------------for h5Course demo-----------------------------------------------------------------
                            //更新当前教材类型的页码信息
                            seaConf[seaConf.host.textType].curPage=seaConf.classInfo.serverInfo.curPage;
                            //-------------------------------------------------for h5Course demo-----------------------------------------------------------------

                            //先清空一次  目的是清空服务器的数据，防止下发其他页码的数据
                            exports.agentTools('tools',{'type':'clear'});
                            //通知服务器页码变更
                            var temObj={
                                'TotalPage':seaConf.classInfo.textInfo.countPage,
                                'CurrentPage':seaConf.classInfo.textInfo.curPage-1
                            }
                            //保证只发送一种协议
                            if(seaConf.host.textType==='pdf'){
                                console.log('[%s] -----------> %s send page data to server,type : updateStuPage(%s %s)',window.getTimeNow(),seaConf.user.type,temObj.CurrentPage,temObj.TotalPage);
                                seaDataSend.sendCommData('page',JSON.stringify(temObj));
                            }else if(seaConf.host.textType==='h5Course'){
                                //支持新协议
                                //------------------------------------------for h5Course demo--------------------------------
                                //这个新的协议
                                temObj.Type=seaConf.host.textType;
                                console.log('[%s] -----------> %s send pageNew data to server,type : updateStuPage(%s %s %s)',window.getTimeNow(),seaConf.user.type,temObj.CurrentPage,temObj.TotalPage,temObj.Type);
                                seaDataSend.sendCommData('pageNew',JSON.stringify(temObj));
                                //------------------------------------------for h5Course demo--------------------------------
                            }
                        }
                        //-------------------------------------------------------------------------------------------
                        //通知客户端页码变更
                        var tem_e={
                            'cur':seaConf.classInfo.textInfo.curPage-1,
                            'count':seaConf.classInfo.textInfo.countPage
                        };
                        console.log('[%s] -----------> %s send teenpage data to server,type : gopage',window.getTimeNow(),seaConf.user.type);
                        seaDataSend.sendCommData('teenpage',JSON.stringify(tem_e));
                    }else{//非老师身份
                        //判断是否在同一页
                        if(seaConf.classInfo.textInfo.curPage!=seaConf.classInfo.serverInfo.curPage){
                            if(seaConf.moduleSet.page){
                                $('.item_update').show();//如果存在页码模块则显示同步按钮
                            }

                            if(seaConf.user.teaLogin){
                                //暂停绘制
                                seaConf.board.pauseDraw=true;
                                console.log('[%s] -----------> update board to pause draw(true) when gopage',window.getTimeNow());
                                exports.updateBoardConf({'pauseDraw':true});//update Board conf
                                //更改鼠标样式
                                if(seaConf.host.classType=='teen'){
                                    $('#canvas_bak').css('cursor',seaConf.cursor.teen.forbidden);
                                    $('#showDomain').css('cursor',seaConf.cursor.teen.forbidden);
                                }else{
                                    $('#canvas_bak').css('cursor',seaConf.cursor.normal.forbidden);
                                    $('#showDomain').css('cursor',seaConf.cursor.normal.forbidden);
                                }
                            }
                            //清空本地的绘制信息
                            seaBoard.clearPaint();
                        }else{
                            if(seaConf.moduleSet.page){
                                $('.item_update').hide();
                            }
                            if(seaConf.user.teaLogin){
                                //关闭暂停绘制
                                console.log('[%s] -----------> update board to pause draw(false) when gopage and page number is same and teacher is in class',window.getTimeNow());
                                seaConf.board.pauseDraw=false;
                                exports.updateBoardConf({'pauseDraw':false});//update Board conf
                                //重新激活当前画笔
                                exports.agentTools('tools',{'type':seaConf.board.curToolType});
                            }
                            //重绘本地绘制信息
                            seaBoard.rePaint();
                        }
                    }
                    if(seaConf.moduleSet.page){
                        //存在页码模块  更新页码内容
                        $('#pageNumber').val(seaConf.classInfo.textInfo.curPage);
                        setPageProhibit(seaConf.classInfo.textInfo.curPage, seaConf.classInfo.textInfo.countPage);
                    }
                    //翻页数据上报
                    /*
                        action 参数
                        1 上一页
                        2 下一页
                        3 同步定位
                    */
                    seaDataSend.sendCommData('pageNotify',JSON.stringify({
                        'cur':lastNum,
                        'target':seaConf.classInfo.textInfo.curPage-1,
                        'action':seaConf.classInfo.textInfo.curPage-1>lastNum?2:1,
                    }));
                    break;
                case 'tools'://tools event
                    console.log('[%s] -----------> tools handle,handle info :%s',window.getTimeNow(),JSON.stringify(obj));

                    //----------------------容错处理--------------------------
                    if(seaConf.board.pauseDraw&&seaConf.user.type==='tea'){
                        seaConf.board.pauseDraw=false;
                    }
                    //----------------------容错处理--------------------------
                    if(seaConf.board.pauseDraw){//now can not draw  这里可能是多余的处理，但是是无害处理，能屏蔽很多意外
                        //更新鼠标样式
                        if(seaConf.host.classType=='teen'){
                            $('#canvas_bak').css('cursor',seaConf.cursor.teen.forbidden);
                        }else{
                            $('#canvas_bak').css('cursor',seaConf.cursor.normal.forbidden);
                        }
                        //通知白板 暂停绘制
                        console.log('[%s] -----------> update board to pause draw(true) when tools',window.getTimeNow());
                        seaBoard.setBoardConf({'pauseDraw':true});
                    }else{
                        //通知白板 可以绘制
                        console.log('[%s] -----------> update board to pause draw(false) when tools and conf data pauseDraw is false',window.getTimeNow());
                        seaBoard.setBoardConf({'pauseDraw':false});
                        //将绘制命令托管到另外的处理函数
                        Tools.operDraw(obj);
                    }
                    break;
                case 'addTool'://add magic from c++  改为魔法表情的显示由客户端通知
                    if(seaConf.moduleSet.tools){
                        if(obj.magic){
                            $('.outerCenter').show();
                            //显示魔法表情图标
                            $('#tools_handle').find('#hand_magic').show();
                            var wid=$('#tools_handle').width();
                            //修改托盘宽度
                            $('#tools_handle').css('width',wid+22+'px');
                        }
                    }
                    break;
                //-------------------------------------------------for h5Course demo-----------------------------------------------------------------
                case 'startPractice':
                    seaDataSend.sendCommData('startPractice',JSON.stringify(obj));
                    break;
                case 'startClass':
                    seaDataSend.sendCommData('startClass',JSON.stringify(obj));
                    break;
                case 'backFirst':
                    var temObj={
                        targetPage:1
                    }
                    Tools.operAgent('gopage',temObj);
                    break;
                case 'canvas':
                    if(obj.type === "open"){
                        $("#paintBoard").show();
                        seaBoard.rePaint();
                    } else {
                        $("#paintBoard").hide();
                    }
                    break;
                case 'otherEnter':
                    var temObj={
                        type:'otherEnter',
                        identify:obj.type
                    };
                    window.iFrameParIO.H5Course.notify(temObj);//通知互动js
                    break;
                //-------------------------------------------------for h5Course demo-----------------------------------------------------------------
                default :
                    console.error('[%s] -----------> unKnow agent type : %s',window.getTimeNow(),type);
                    break;
            }
            
        },
        operDraw: function (obj) {
            if(seaConf.course.canDraw&&!seaConf.board.pauseDraw){//如果当前用户有绘制的能力并且没有被暂停绘制
                var teen=(seaConf.host.classType=='teen')?true:false,
                    cursorTeen=seaConf.cursor.teen,//青少的鼠标样式信息
                    cursorNor=seaConf.cursor.normal;//成人的鼠标样式信息
                switch (obj.type){
                    case 'pen':
                        $('#canvas_bak').css('cursor',"");//先清空，防止MAC换不了光标
                        if(teen){
                            $('#canvas_bak').css('cursor',cursorTeen.pen);
                        }else{
                            $('#canvas_bak').css('cursor',cursorNor.pen);
                        }
                        seaConf.board.curToolType=obj.type;
                        break;
                    case 'signpen':
                        $('#canvas_bak').css('cursor',"");
                        if(teen){
                            $('#canvas_bak').css('cursor',cursorTeen.signpen);
                        }else{
                            $('#canvas_bak').css('cursor',cursorNor.signpen);
                        }
                        seaConf.board.curToolType=obj.type;
                        break;
                    case 'rec':
                        $('#canvas_bak').css('cursor',"");
                        if(teen){
                            $('#canvas_bak').css('cursor',cursorTeen.rec);
                        }else{
                            $('#canvas_bak').css('cursor',cursorNor.rec);
                        }
                        seaConf.board.curToolType=obj.type;
                        break;
                    case 'rub':
                        $('#canvas_bak').css('cursor',"");
                        if(teen){
                            $('#canvas_bak').css('cursor',cursorTeen.rub);
                        }else{
                            $('#canvas_bak').css('cursor',cursorNor.rub);
                        }
                        seaConf.board.curToolType=obj.type;
                        break;
                    case 'newrub':
                        $('#canvas_bak').css('cursor',"");
                        if(teen){
                            $('#canvas_bak').css('cursor',cursorTeen.newrub);
                        }else{
                            $('#canvas_bak').css('cursor',cursorNor.newrub);
                        }
                        seaConf.board.curToolType=obj.type;
                        break;
                    case 'text':
                        if($('#Center_chose')){
                            $('#Center_chose').css('display','none');
                        }
                        $('#canvas_bak').css('cursor',"");
                        if(teen){
                            $('#canvas_bak').css('cursor',cursorTeen.text);
                        }else{
                            $('#canvas_bak').css('cursor',cursorNor.text);
                        }
                        //字体大小
                        var sizeFont=(obj.size=='big')?seaConf.board.font.big:seaConf.board.font.small;
                        var objConf={
                            font:{
                                fontSize:sizeFont
                            }
                        };
                        //更新字体大小
                        seaBoard.setBoardConf(objConf);
                        seaConf.board.curToolType=obj.type;
                        break;
                    case 'draft':
                        $('#canvas_bak').css('cursor',"");
                        if(teen){
                            $('#canvas_bak').css('cursor',seaConf.cursor.teen.draft);
                        }else{
                            $('#canvas_bak').css('cursor',seaConf.cursor.normal.draft);
                        }
                        seaConf.board.curToolType=obj.type;
                        break;
                    case 'back':
                        var tem_e={
                            'handleType':1,/*删*/
                            'drawingType':1,/*代表撤销*/
                            'specialValue':null
                        }
                        //通知服务器回退
                        seaDataSend.sendCommData('paint',JSON.stringify(tem_e));
                        break;
                    case 'clear':
                        var tem_e={
                            'handleType':1,/*删*/
                            'drawingType':2,/*代表清空*/
                            'specialValue':null
                        }
                        //通知客户端撤销
                        seaDataSend.sendCommData('paint',JSON.stringify(tem_e));
                        break;
                    default:
                        console.error('[%s] -----------> unKnow draw type : %s',window.getTimeNow(),obj.type);
                        break;
                }

                //MAC恢复默认光标
                /*if(seaConf.host.mainHost==='mac'){
                    $('#canvas_bak').css('cursor',"auto");
                }*/

                //更新画笔
                seaBoard.draw(obj.type);
            }
        }
    }
    exports.initPageNum=function (obj) {
        seaDataSend.sendCommData('teenpage',JSON.stringify(obj));
    };
    exports.agentTools=function (oper,obj) {
        Tools.operAgent(oper,obj);
    };
    exports.updateBoardConf= function (obj) {
        seaBoard.setBoardConf(obj);
    };
    exports.reviewCanvas= function (tw,th,tl,tt) {
        seaBoard.resizePaint(tw,th,tl,tt);
    }
});
/**
 * Created by Administrator on 2016/8/15.
 * module info:
 *        分析完逻辑之后管理模块加载和时间调用
 */
define('loadHtmlModule',['moduleSet','eventBind'],function (require, exports, module) {
    exports.loadStart=function () {
        //start load module according data
        //same module between 'teen class' and 'adult class'
        // same module:moduleContain moduleCourse moduleBoard moduleUpdate CreateDataFixed
        console.log('[%s] -----------> load html',window.getTimeNow());
        require('moduleSet').loadModuleStart();//调用moduleSet模块，创建html元素
        console.log('[%s] -----------> bind event',window.getTimeNow());
        require('eventBind').eventStart();//对已经创建的html元素根据数据池进行事件的绑定
    }
});
/**
 * Created by Administrator on 2016/8/15.
 * module info:
 *        逻辑管理模块
 *        统一处理逻辑初始化逻辑，服务器下发数据类型分发
 *        和iframe通信逻辑
 */
define('logicUnpack',['boardConf','loadHtmlModule','moduleTools','enDataSend','animate'],function (require, exports, module) {
    var seaConf=require('boardConf').conf,
        seaLoad=require('loadHtmlModule'),
        seaTools=require('moduleTools'),
        seaDataSend=require('enDataSend'),
        animate = require('animate').animate;

    //固定算法，tg教材 其中的3是为了弥补接口的错误
    var CalculateOffset=function (cx, cy, emType)
    {
        var x=0,y=0;
        var temX=cx,temY=cy;
        switch(parseInt(emType))
        {
            case 0:
                break;
            case 1:
                temX = cx * 732 / 1000;
                temY = temX / 2;
                x = cx * 265 / 1003;
                y = cy * 117 / 503;
                break;
            case 2:
                temX = cx * 268768 / 367500;
                temY = temX * 153853 / 268768;
                x = cx * 870 / 3675;
                y = cy * 49244 / 210000;
                break;
            case 3:
                break;
            default:
                break;
        }

        return {marginX:parseInt(x),marginY:parseInt(y),width:parseInt(temX),height:parseInt(temY)};
    }

    window.iFrameParIO={//comm with iFrame 和frame做交互的对象
        'parentCon':null,//object of parent IFrame,used to achieve comm with iframe 用于存储子iframe的对象，用于调用子iframe内的方法
        //init function  when course is loaded  当课程被下载完后的初始化操作
        'initI': function (cur,count) {
            console.log('[%s] -----------> init page data: {curpage: %d ,countpage: %d }',window.getTimeNow(),cur,count);
            //更新本地页码信息
            seaConf.classInfo.textInfo.curPage=parseInt(cur);
            seaConf.classInfo.textInfo.countPage=parseInt(count);

            //-------------------------------------------------for h5Course demo----------------------------------------------------------------
            //分别更新互动教材和pdf的页码信息
            seaConf[seaConf.host.textType].countPage=parseInt(count);
            //-------------------------------------------------for h5Course demo-----------------------------------------------------------------

            //更新服务器页码信息
            seaConf.classInfo.serverInfo.countPage=parseInt(count);
            seaConf.classInfo.serverInfo.curPage=seaConf[seaConf.host.textType].curPage;
            if(seaConf.classInfo.serverInfo.curPage!=seaConf.classInfo.textInfo.curPage){
                //如果当支持互动教材的新版本切到pdf时，防止停留在第一页
                seaTools.agentTools('gopage',{targetPage:seaConf.classInfo.serverInfo.curPage});
            }

            //-------------------------------------------------for h5Course demo  有风险-----------------------------------------------------------------
            if(seaConf.host.textType!=='h5Course'){
                //更新iframe内的鼠标样式
                if(seaConf.host.classType=='teen'){//青少
                    this.parentCon.document.body.style.cursor=seaConf.cursor.teen.normal;
                }
                else{
                    this.parentCon.document.body.style.cursor=seaConf.cursor.normal.normal;
                }
            }
            //-------------------------------------------------for h5Course demo-----------------------------------------------------------------

            //如果页码模块存在  初始化总页码，然后显示模块
            if(seaConf.moduleSet.page){//if page module is alive
                $('#numPages').text('/ '+count);
                $('#toolbar_id').css('display','inline-block');
            }
            //draw is ready  更新观察者
            seaConf.classInfo.drawInfo.ready=true;
            //consume the data from svc when course is not ready  清空缓存池中的数据
            logicUnpack.clearCache();
            //初始化一次工具
            seaTools.agentTools('tools',{type:seaConf.board.curToolType})
        },
        //init board's items
        'dataDrawI': function (wid,hei,left,top) {
            //根据拿到的教材信息走固定算法得出可绘制区域的大小和边距对象
            var tem=null;
            //-------------------------------------------------for h5Course demo-----------------------------------------------------------------
            if(seaConf.host.textType==='h5Course'){
                //all default for h5Course demo
                tem={
                    marginX:left,
                    marginY:top,
                    width:wid,
                    height:hei
                };
            }else{
                tem=CalculateOffset(wid,hei,seaConf.course.metrialType);
            }
            //-----------------------------------------------------------------------------------------------------------------------------------

            //ensure data is fresh  数据保鲜，更新数据池
            seaConf.classInfo.textInfo.width=wid;
            seaConf.classInfo.textInfo.height=hei;
            seaConf.classInfo.drawInfo.width=tem.width;
            seaConf.classInfo.drawInfo.height=tem.height;
            //ensure wid and hei is the max 确保充满
            wid=Math.max(wid,$('#showDomain').width());
            hei=Math.max(hei,$('#showDomain').height());
            //设置教材显示的高度
            $('#showDomain').css({
                'height': hei
            });
            //判断画板模块存在 然后设置画布的大小和位置
            if(seaConf.moduleSet.board){
                var tw=0,
                    th=0,
                    tl=0,
                    tt=0;
                //-------------------------------------------------for h5Course demo-----------------------------------------------------------------
                if(seaConf.host.textType==='h5Course'){
                    //all default for h5Course demo
                    tw=tem.width;
                    th=tem.height;
                    tl=tem.marginX;
                    tt=tem.marginY;
                }else{
                    tw=tem.width;
                    th=tem.height;
                    tl=left+tem.marginX+($('#workSpace').width()-wid)/ 2;
                    tt=top+tem.marginY;
                }
                //-----------------------------------------------------------------------------------------------------------------------------------

                seaTools.reviewCanvas(tw,th,tl,tt);
            }
            //调用滚动条js的刷新
            $('#scrollbar1').tinyscrollbar_update();
        },
        //unused after 2.6,this will make something is wrong,bad way 已经废弃了
        'removeScrollI': function (wid) {
            console.log('[%s] -----------> height taller and remove scroll',window.getTimeNow());
            //when offset of height is less than 100px,we let width become litter and remove scroll
            $('#showDomain').width(wid);
            $('#showDomain').css('left', function () {
                return ($('#workSpace').width()-wid)/2;
            });
            if(seaConf.host.textType==='pdf'){
                //make iFrame child's resize event
                this.pdfCourse.resize();
            }else if(seaConf.host.textType==='h5Course'){
                this.H5Course.resize();
            }
        },
        //used to set course's page  用于设置iframe（教材）的页码
        'setPageO': function (num) {
            //pdf和h5Course的分别管理
            if(seaConf.host.textType==='pdf'){
                //make iFrame child's resize event
                this.pdfCourse.setPage(num);
            }else if(seaConf.host.textType==='h5Course'){
                this.H5Course.setPage(num);
            }
        },
        //unused after 2.6,this will make something is wrong,bad way 已经废弃了
        'resetModuleO': function () {
            $('#showDomain').css('left',0);
            this.parentCon.resetscroll=true;
        },
        //notify iframe to resize 通知课件进行resize操作，iframe不做多余的resize监听
        'resizeEventO': function () {
            if(seaConf.host.textType==='pdf'){
                //make iFrame child's resize event
                this.pdfCourse.resize();
            }else if(seaConf.host.textType==='h5Course'){
                this.H5Course.resize();
            }
        },
        //for iframe to get course url 用于iframe请求当前教材的信息
        'getUrlO': function () {
            return seaConf.host.textUrl;
        },
        //for pdf ,when pdf loaded is bad ,notify outer reload  用于pdf专属的接口：当下载的pdf出现问题后，通知客户端进行不同的操作
        'loadMes': function (info) {
            window.comm_type_send('load',info);
        },
        //统一管理pdf的通知
        'pdfCourse': {
            resize: function () {
                if(window.iFrameParIO.parentCon.handleChlIO)
                    window.iFrameParIO.parentCon.handleChlIO.resize();
                //处理当缩放时产生的当前教材的错位
                setTimeout(function () {
                    window.iFrameParIO.pdfCourse.setPage(seaConf.classInfo.textInfo.curPage);
                },10)
            },
            setPage: function (num) {
                if(window.iFrameParIO.parentCon.handleChlIO)
                    window.iFrameParIO.parentCon.handleChlIO.setPage(num);//初始化页数
            }
        },
        'changeCourse': function (obj) {
            console.log('[%s] -----------> change course to %s',window.getTimeNow(),obj.targetCourse);
            seaConf.classInfo.drawInfo.ready=false;
            if(obj.targetCourse==='pdf'){
                if(obj.urlData&&obj.urlData.url){
                    var urlTem=window.MyBase64.decode(obj.urlData.url);
                    if(urlTem.split('?')[0]!=seaConf.host.textUrl.pdf.split('?')[0]){
                        console.log('[%s] -----------> urlData is %s',window.getTimeNow(),JSON.stringify(obj.urlData));
                        //如果新的url存在
                        // 先回归pdf页码信息
                        seaConf.pdf.curPage=1;
                        // 再更新当前的pdf路径
                        seaConf.host.textUrl.pdf=urlTem;
                    }
                }
                seaConf.host.textType='pdf';
                $("#paintBoard").show();
                //-------------------------------------------------for h5Course demo-----------------------------------------------------------------
                //还原白板背景颜色
                $("#paintBoard").css("background-color", "transparent");

                if((seaConf.user.type==='stu'&&seaConf.course.courseType==='1v1')||seaConf.user.type==='tea'){//user's type is allowed to draw 允许老师和学生绘制的逻辑
                    console.log('[%s] -----------> update board to canDraw(true) when changeCourse(1v1 stu pdf)',window.getTimeNow());
                    seaConf.course.canDraw=true;//更新注明该用户拥有可以绘制的权利
                    //update conf of WEBTools
                    seaTools.updateBoardConf({'paintModule':'draw'});//通知白板
                }
                //-------------------------------------------------for h5Course demo-----------------------------------------------------------------
                $('#showDomain').attr('src','./courseLoad/pdf/pdf.html?'+new Date().getTime());

                //init obj iFrame
                window.iFrameParIO.parentCon=$(window.parent.document).contents().find("#showDomain")[0].contentWindow;

            }else if(obj.targetCourse==='h5Course'){
                if(obj.urlData&&obj.urlData.countNum){
                    //如果新的url存在
                    // 先回归互动教材页码信息
                    seaConf.h5Course.curPage=1;
                    // 再更新当前的互动教材路径
                    console.log('[%s] -----------> urlData is %s',window.getTimeNow(),JSON.stringify(obj.urlData));
                    seaConf.host.textUrl.h5Course=obj.urlData;
                }
                seaConf.host.textType='h5Course';
                //-------------------------------------------------for h5Course demo-----------------------------------------------------------------
                //如果是互动教材，白板是透明色
                if(seaConf.host.textType==='h5Course'&&seaConf.user.type==='tea'){
                    $("#paintBoard").css("background-color", seaConf.h5Course.canvasColor);
                }

                // if(seaConf.user.type==='stu'){//互动教材学生不可绘制
                //     console.log('[%s] -----------> update board to canDraw(false) when changeCourse(stu h5Course)',window.getTimeNow());
                //     seaConf.course.canDraw=false;//更新注明该用户拥有可以绘制的权利
                //     //update conf of WEBTools
                //     seaTools.updateBoardConf({'paintModule':'draw'});//通知白板
                // }
                //-------------------------------------------------for h5Course demo-----------------------------------------------------------------
                $("#paintBoard").hide();
                $('#showDomain').attr('src',seaConf.host.textUrl.h5Course.urlControl+'?'+new Date().getTime());
            }
        },
        'H5Course':{
            init: function () {
                //-------------------------------------------------for h5Course demo-----------------------------------------------------------------
                if(window.iFrameParIO.parentCon.sendSyncData===undefined){
                    //iframe 加载失败
                    console.error('[%s] -----------> failed to load controller.html,change course type!',window.getTimeNow());
                    var tem_e={
                        'type':'error'
                    }
                    seaDataSend.sendCommData('H5CourseLoad',JSON.stringify(tem_e));
                    return false;
                }else{
                    var user=seaConf.user;
                    var teaState=user.type=='tea'?'in':(user.teaLogin?'in':'out');
                    var classT=seaConf.course.courseType;
                    var lan=seaConf.host.language;
                    var courseid=seaConf.course.courseId;
                    var initObj={
                        userInfo:{
                            userType:user.type,
                            userId:user.userId,
                            teaState:teaState
                        },
                        classInfo:{
                            classType:classT,
                            language:lan
                        },
                        courseInfo:{
                            courseId:courseid,
                            pageCount:seaConf.host.textUrl.h5Course.countNum,
                            headUrl:seaConf.host.textUrl.h5Course.headUrl
                        },
                        startClass:seaConf.h5Course.startClass,
                        startPractice:seaConf.h5Course.startPractice
                    };
                    console.log('[%s] -----------> parentIFrame : send init data :',window.getTimeNow());
                    console.log(initObj);
                    if(window.iFrameParIO.parentCon.sendSyncData){
                        window.iFrameParIO.parentCon.sendSyncData('init',initObj);
                    }else{
                        console.error('[%s] -----------> parentIFrame : error happened when send init data to child',window.getTimeNow());
                    }

                    //for test
                    window.iFrameParIO.initI(1,seaConf.host.textUrl.h5Course.countNum);

                    return true;
                }
                //-------------------------------------------------for h5Course demo-----------------------------------------------------------------
            },
            resize:function () {
                if(!seaConf.h5Course.resizeFirst){
                    var temObj={
                        type:'resize'//resize
                    };
                    window.iFrameParIO.H5Course.notify(temObj);
                }
                seaConf.h5Course.resizeFirst=false;
            },
            setPage:function (num) {
                var temObj={
                    type:'page',//翻页通知
                    targetNum:num//目标页码
                };
                window.iFrameParIO.H5Course.notify(temObj);
            },
            comm: function (obj) {
                var temObj=obj;
                temObj.uuid=0;
                console.log('[%s] -----------> parentIFrame : get data from svc and send to child',window.getTimeNow());
                console.log(temObj);
                if(window.iFrameParIO.parentCon.sendSyncData){
                    window.iFrameParIO.parentCon.sendSyncData('comm',temObj.specialValue.value);
                }else{
                    console.error('[%s] -----------> parentIFrame : error happened when send svc data to child',window.getTimeNow());
                }
            },
            notify: function (obj) {
                if(window.iFrameParIO.parentCon.sendSyncData!==undefined){
                    console.log('[%s] -----------> parentIFrame : send notify data',window.getTimeNow());
                    console.log(obj);
                    if(window.iFrameParIO.parentCon.sendSyncData){
                        window.iFrameParIO.parentCon.sendSyncData('notify',obj);
                    }else{
                        console.error('[%s] -----------> parentIFrame : error happened when send notify data to child',window.getTimeNow());
                    }
                }
            },
            sendMSG: function (type,obj) {
                switch (type){
                    case 'svcMes':
                        console.log('[%s] -----------> parentIFrame : get svcMes data :',window.getTimeNow());
                        console.log(obj);

                        var temObj={
                            'handleType':0,//add
                            'drawingType':400,//ppt
                            'id':1000,
                            'specialValue':{
                                value:obj
                                //value:JSON.stringify(obj)
                            }
                        }
                        seaDataSend.sendCommData('paint',JSON.stringify(temObj));
                        break;
                    case 'loadData':
                        //now unused
                        break;
                    case 'startClass':
                        if(obj.type==='startClass'&&!seaConf.h5Course.startClass){
                            console.log('[%s] -----------> parentIFrame : get startClass:',window.getTimeNow());
                            console.log(obj);
                            seaConf.h5Course.startClass=true;
                            if(seaConf.user.type==='tea'&&obj.firstTime){
                                seaTools.agentTools('gopage',{targetPage:'1'});
                            }
                            // seaTools.agentTools('startClass',obj);
                        }
                        break;
                    case 'startPractice':
                        if(obj.type==='startPractice'&&!seaConf.h5Course.startPractice){
                            console.log('[%s] -----------> parentIFrame : get startPractice:',window.getTimeNow());
                            console.log(obj);
                            seaConf.h5Course.startPractice=true;
                            //这里应该判断是老师还是第一次点击的事件
                            //...
                            seaTools.agentTools('startPractice', obj);
                        }
                        break;
                    case 'backFirst':
                        if(obj.type==='backFirst'){
                            console.log('[%s] -----------> parentIFrame : get backFirst:',window.getTimeNow());
                            console.log(obj);
                            if(seaConf.user.type==='tea'){
                                seaTools.agentTools('gopage',{targetPage:'1'});
                            }
                        }
                        break;
                    case 'updateStuPage'://供老师端使用 用于同步学生的页码
                        if(seaConf.user.type==='tea'){
                            console.log('[%s] -----------> parentIFrame : get updateStuPage:',window.getTimeNow());
                            console.log(obj);
                            seaTools.agentTools('updateStuPage',{targetPage:obj.targetPage});
                        }else{
                            console.error('[%s] -----------> parentIFrame : error happened when stu get updateStuPage',window.getTimeNow());
                        }
                        break;
                    case 'pageInit':
                        console.error('[%s] -----------> parentIFrame : wrong function is used!',window.getTimeNow());
                        console.error('wrong function is used!');
                        //console.log('['+window.getTimeNow()+']'+'----------->'+'parentIFrame : get page data :');
                        //console.log(obj);
                        //var cur= obj.currentPage,
                        //    count=obj.pageCount;
                        //window.iFrameParIO.initI(cur,count);
                        break;
                    case 'boardSet':
                        var top= obj.top,
                            left=obj.left,
                            width=obj.width,
                            height=obj.height;
                        console.log('[%s] -----------> parentIFrame : set whiteBoard data :',window.getTimeNow());
                        console.log('                ---------------------------------->(top,left,width,height)(%d,%d,%d,%d)',top,left,width,height);
                        window.iFrameParIO.dataDrawI(width,height,left,top);
                        break;
                    case 'tool':
                    //console.log('******************************************parentIFrame : get tool data :');
                    //console.log(obj);
                    //var st=obj.switch;//get switch type  on or off
                    //if(st==='on'){
                    //    seaConf.board.pauseDraw=false;
                    //    seaTools.updateBoardConf({'pauseDraw':false});//update Board conf
                    //    $('#paintBoard').show();
                    //}else{
                    //    seaConf.board.pauseDraw=true;
                    //    seaTools.updateBoardConf({'pauseDraw':true});//update Board conf
                    //    $('#paintBoard').hide();
                    //}
                    //break;
                    default:
                        break;
                }
            }
        }
    }
    var logicUnpack={
        //unpack info that get from server according company's business logic to load different module
        //根据公司的业务逻辑将从服务器拿到的数据信息解包以便加载不同的模块
        'conf':{//这里是一些固定的配置信息
            'courseRole':{
                '0':'student',
                '1':'1v1 teacher',
                '4':'open lecture teacher',
                '5':'PSO student',
                '6':'PSO teacher',
                '7':'chinese teacher',
                '64':'cc'//can not draw
            },
            'courseStyle':{
                '0':'1v1',
                '1':'open lecture',
                '2':'multi video classroom',
                '3':'experience lecture',
                '4':'competitive Small-class-based lecture',
                '5':'active open lecture',
                '6':'PSO training lecture',
                '7':'SA open lecture',
                '8':'PT ways lecture',
                '9':'CEGC(CE Unit lecture)',
                '10': 'chinese teacher lecture',
                '12':'B2S open lecture',
                '13':'class lecture'
            },
            'userRole':{
                '-1':'guest',
                '0': 'student',
                '1':'1v1 teacher',
                '2':'experience user',
                '3':'unKnow type',
                '4': '1vn teacher',
                '5':'PSO student',
                '6':'PSO teacher',
                '7':'chinese teacher',
                '16':'control',
                '64':'cc sales',
                '65':'crit',
                '99':'1vN administrator'
            },
            'userType':{
                '1':'teacher',
                '2':'student',
                '3':'administrator',
                '4':'customer service'
            },
            'textType':{
                '0':'pdf',
                '1':'ppt',
                //-------------------------------------------------for h5Course demo-----------------------------------------------------------------
                '2':'h5Course'
                //-------------------------------------------------for h5Course demo-----------------------------------------------------------------
            },
            'teaType':[1,4,6,7],
            'stuType':[0,5]
        },
        'init': function (type,obj) {
            //init handle data
            switch (type){
                case 'course':
                    seaConf.serverData.objCourseInfo=obj;
                    console.log('[%s] -----------> objCourseInfo: %s',window.getTimeNow(),JSON.stringify(obj));
                    break;
                case 'user':
                    seaConf.serverData.objUserInfo=obj;
                    console.log('[%s] -----------> objUserInfo: %s',window.getTimeNow(),JSON.stringify(obj));
                    break;
                case 'host':
                    seaConf.serverData.objHostInfo=obj;
                    console.log('[%s] -----------> objHostInfo: %s',window.getTimeNow(),JSON.stringify(obj));
                    break;
                case 'url':
                    seaConf.serverData.objURLInfo=obj;
                    console.log('[%s] -----------> objURLInfo: %s',window.getTimeNow(),JSON.stringify(obj));
                    break;
                case 'courseAll':
                    seaConf.serverData.objCourseAllInfo=obj;
                    console.log('[%s] -----------> objCourseAllInfo: %s',window.getTimeNow(),JSON.stringify(obj));
                    break;
                default :
                    console.warn('[%s] -----------> objOtherInitInfo: %s', window.getTimeNow(),JSON.stringify(obj));
                    return;
                    break;
            }

            //ensure all data for loading html had been accepted  确保运行前拿到了所有的必要数据
            if(seaConf.serverData.objCourseInfo!=null
                &&seaConf.serverData.objUserInfo!=null
                &&seaConf.serverData.objHostInfo!=null
                &&seaConf.serverData.objURLInfo!=null)
            {
                var aliasCourse = seaConf.course,//课程信息别名
                    aliasUser = seaConf.user,//用户信息别名
                    aliasHost = seaConf.host,//宿主信息别名
                    aliasServerData = seaConf.serverData;//服务端信息别名
                //下面的字段详见数据池注释
                //course info
                //是否可以翻页
                aliasCourse.turnPage = (aliasServerData.objCourseInfo.CanTurnPage!=undefined)?
                    (aliasServerData.objCourseInfo.CanTurnPage==1?true:false):true;
                //教材类型0 1 2 3
                aliasCourse.metrialType = aliasServerData.objCourseInfo.metrialtype||0;
                //-------------------------------------------------for h5Course demo-----------------------------------------------------------------
                aliasCourse.courseId = aliasServerData.objCourseInfo.courseId||'';
                //-------------------------------------------------for h5Course demo-----------------------------------------------------------------
                //教材详细类型
                aliasCourse.courseStyle =aliasServerData.objCourseInfo.coursestyle&&logicUnpack.conf.courseStyle[aliasServerData.objCourseInfo.coursestyle]|| 'undefined';
                //教材类型 1v1 1vN？
                aliasCourse.courseType = (aliasServerData.objCourseInfo.coursestyle!=undefined)?
                    (aliasServerData.objCourseInfo.coursestyle==0?'1v1':'1vN'):'1v1';

                //判断是否为多视频教室
                aliasCourse.isMultiVC=aliasServerData.objCourseInfo.coursestyle===2?true:false;

                //获取当前的课程开始的时间
                aliasCourse.startedTime=aliasServerData.objCourseInfo.startedTime||0;
                //user info
                //用户信息 tea stu other
                aliasUser.type = "other";
                if(aliasServerData.objCourseInfo.courserole!=undefined){
                    if(logicUnpack.conf.teaType.indexOf(aliasServerData.objCourseInfo.courserole)!=-1)aliasUser.type = "tea";
                    if(logicUnpack.conf.stuType.indexOf(aliasServerData.objCourseInfo.courserole)!=-1)aliasUser.type = "stu";
                }
                //cc的逻辑
                if(aliasServerData.objCourseInfo.courserole!=undefined){
                    if(aliasServerData.objCourseInfo.courserole==64){//cc的逻辑
                        aliasUser.type='cc';
                    }else if(aliasServerData.objCourseInfo.courserole==65){//crit的逻辑
                        aliasUser.type='crit';
                    }
                }

                aliasUser.courseRole = aliasServerData.objCourseInfo.courserole&&logicUnpack.conf.courseRole[aliasServerData.objCourseInfo.courserole]||'undefined';
                aliasUser.userRole = aliasServerData.objUserInfo.userrole&&logicUnpack.conf.userRole[aliasServerData.objUserInfo.userrole]||'undefined';
                aliasUser.userType = aliasServerData.objUserInfo.usertype&&logicUnpack.conf.userType[aliasServerData.objUserInfo.usertype]||'undefined';
                aliasUser.userId = aliasServerData.objUserInfo.userid||'undefined';

                //host info
                aliasHost.mainHost = aliasServerData.objHostInfo.mainhost||'undefined';
                aliasHost.language = aliasServerData.objHostInfo.language||'undefined';
                aliasHost.versionType = aliasServerData.objHostInfo.versionType||'undefined';
                aliasHost.tipData.fixedData=(aliasServerData.objHostInfo.tipdata!=undefined)?
                    (aliasServerData.objHostInfo.tipdata.fixdata!=undefined?aliasServerData.objHostInfo.tipdata.fixdata:false):false;
                aliasHost.tipData.scrollData=(aliasServerData.objHostInfo.tipdata!=undefined)?
                    (aliasServerData.objHostInfo.tipdata.scrollData!=undefined?aliasServerData.objHostInfo.tipdata.fixedData:true):true;
                aliasHost.textType=aliasServerData.objHostInfo.textType&&logicUnpack.conf.textType[aliasServerData.objHostInfo.textType]||'pdf';
                seaConf.h5Course.open=aliasHost.textType=='pdf'?false:true;//如果刚开始是pdf，则表示当前不支持新协议：pageNew

                aliasHost.textUrl=aliasServerData.objURLInfo||'undefined';
                aliasHost.classType=aliasServerData.objHostInfo.showtype||'normal';
                aliasHost.tools=aliasServerData.objHostInfo.toolsconf||aliasHost.tools;

                if(aliasUser.courseRole==5){
                    //PSO stu
                    seaConf.board.stu.pencil.color='#FF0000';
                }else if(aliasUser.courseRole==6){
                    //PSO tea
                    seaConf.board.tea.pencil.color='#0078FF';
                }

                //判断是否支持encode function
                (window.AcJs_get_encode != undefined) && (seaConf.isSupportEncodeFunc = true);

                //--------------------------------------for h5Course demo  (增加&& aliasHost.textType!='h5Course')-------------------------------------------------------
                //固定逻辑（老师都可以绘制，pdf:1v1学生可以绘制 H5Course：学生能使用画笔）
                if((aliasUser.type==='stu'&&aliasCourse.courseType==='1v1')||aliasUser.type==='tea'){//user's type is allowed to draw 允许学生绘制的逻辑
                    console.log('[%s] -----------> update board to canDraw(true) when initData(1v1 stu and tea)',window.getTimeNow());
                    aliasCourse.canDraw=true;//更新注明该用户拥有可以绘制的权利
                    //update conf of WEBTools
                    seaTools.updateBoardConf({'paintModule':'draw'});//通知白板
                }
                //-------------------------------------------------for h5Course demo-----------------------------------------------------------------
                //update edit for drawing 固定逻辑，当有新的橡皮开放或者拖拽功能开放时版本统一置为new，主要针对是否支持重写操作
                if(aliasHost.tools.newrub||aliasHost.tools.draft){
                    seaConf.board.version='new';
                    seaTools.updateBoardConf({'version':'new'});
                }

                console.log('[%s] -----------> result:',window.getTimeNow());
                console.log('                                ----->'+'user: %s',JSON.stringify(aliasUser));
                console.log('                                ----->'+'course: %s',JSON.stringify(aliasCourse));
                console.log('                                ----->'+'host: %s',JSON.stringify(aliasHost));
                
                var courseTypeEx = seaConf.serverData.objCourseAllInfo.courseTypeEx;

                //固定逻辑
                if(aliasUser.type=='tea'){
                    //老师支持滚动提示
                    aliasHost.tipData.scrollData=true;//更新提示信息中的滚动信息哨兵
                    seaConf.moduleSet.dataScroll=true;//更新模块配置中的滚动模块哨兵

                    seaConf.event.barScroll=true;//teacher's scroll event 更新事件配置中的滚动条事件哨兵（用于同步两端的滚动条）
                    seaConf.event.mouse=true;//teacher's mouse event  更新事件配置中的鼠标事件哨兵（用于同步两端的鼠标位置）
                    seaConf.event.scrollData=true;//更新事件配置中的滚动信息提示哨兵

                    if(aliasHost.tipData.fixedData){//判断是否存在固定提示信息
                        seaConf.event.fixedData=true;//更新事件配置信息的固定提示哨兵
                        seaConf.moduleSet.dataFixed=true;//更新模块配置信息中的固定模块哨兵
                    }

                    //1VN和1V1的青少配置H5画板工具栏
                    // if(seaConf.course.courseType=='1vN' || (seaConf.course.courseType=='1v1' && (courseTypeEx==4 || courseTypeEx==5 || courseTypeEx==6 || courseTypeEx==7))){
                    if(seaConf.course.courseType=='1vN' || seaConf.course.courseType=='1v1'){
                        seaConf.moduleSet.page=true;//更新模块配置中的翻页模块哨兵
                        seaConf.moduleSet.tools=true;//更新模块配置中的工具条模块哨兵
                    }

                    //1V1不显示提示
                    if(seaConf.course.courseType=='1v1'){
                        seaConf.moduleSet.dataScroll=false;
                        seaConf.moduleSet.dataFixed=false;
                    }

                    //老师显示特效关闭/重播按钮
                    animate.showButton(true);

                }else{//非老师
                    //当为1vN并且可以翻页的时候 更新模块配置中的翻页哨兵
                    if(seaConf.course.courseType=='1vN'&&seaConf.course.turnPage){
                        seaConf.moduleSet.page=true;
                    }else if(seaConf.course.courseType=='1v1'){
                        seaConf.event.mouse=true;//student's mouse event  更新事件配置信息的鼠标事件哨兵
                        seaConf.moduleSet.page=true;//更新模块配置中的翻页模块哨兵
                        seaConf.moduleSet.tools=true;//更新模块配置中的工具条模块哨兵
                    }
                }

                //MAC必显示画板工具栏
                if(seaConf.host.mainHost==='mac'){
                    seaConf.moduleSet.page=true;
                    seaConf.moduleSet.tools=true;
                }

                //如果是多视频教室 打开时间提示模块 关闭信息提示
                if(aliasCourse.isMultiVC){
                    seaConf.moduleSet.timeTip=true;
                    seaConf.event.timeTip=true;

                    aliasHost.tipData.scrollData=false;//更新提示信息中的滚动信息哨兵
                    seaConf.moduleSet.dataScroll=false;//更新模块配置中的滚动模块哨兵
                    seaConf.event.fixedData=false;//更新事件配置信息的固定提示哨兵
                    seaConf.moduleSet.dataFixed=false;//更新模块配置信息中的固定模块哨兵
                }
                //-------------------------------------------------for h5Course demo-----------------------------------------------------------------
                if(aliasUser.userRole==='cc sales'){
                    seaConf.moduleSet.ccLayer=true;
                }
                //-------------------------------------------------for h5Course demo-----------------------------------------------------------------


                //load html  加载html
                seaLoad.loadStart();
                //根据用户类型提取数据池中的数据初始化白板的配置
                if(aliasUser.type=='tea'){
                    seaTools.updateBoardConf(seaConf.board.tea);
                    aliasUser.teaLogin=true; //更新老师进入的字段
                    seaConf.board.pauseDraw=false;//为老师提供随时可以绘制的支持
                    console.log('[%s] -----------> update board to pause draw(false) when init and user type is tea',window.getTimeNow());
                    seaTools.updateBoardConf({'pauseDraw':false});//通知白板，打开绘制支持
                }
                else{
                    seaTools.updateBoardConf(seaConf.board.stu);
                }

                window.comm_type_send("h5_ready",JSON.stringify({}));
            }
        },
        'update': function (obj) {//处理数据

            if(!seaConf.classInfo.drawInfo.ready){//draw unready  当白板没有准备好绘制时
                seaConf.boardDataCache.push(obj);//入队列
                console.log('[%s] -----------> canvas is not ready , push data to Array : %s',window.getTimeNow(),JSON.stringify(obj));
            }
            else{

                if(obj.type=='enterout'){//teacher enter class or out  sdk下发的通知，老师进出教室的通知
                   if(seaConf.user.type!=='tea'){
                       if(seaConf.user.teaLogin&&JSON.parse(obj.jsonStr).Bl_E_O==0){//屏蔽重复的通知
                           //accept teacher out when teacher is in class
                           console.log('[%s] -----------> teacher out class',window.getTimeNow());

                           //更新哨兵
                           seaConf.user.teaLogin=false;
                           //暂停绘制功能
                           seaConf.board.pauseDraw=true;
                           console.log('[%s] -----------> update board to pause draw(true) when teacher out class',window.getTimeNow());
                           seaTools.updateBoardConf({'pauseDraw':true});//update Board conf

                           if(seaConf.moduleSet.tools){//if update module is alive
                               $('#outerCenter').css('display','none');//当不能绘制的时候隐藏工具
                           }
                           if(seaConf.moduleSet.board){
                               seaTools.agentTools('tools',{'type':seaConf.board.curToolType});//统一一次白板，为了触发固定逻辑
                           }
                           //-------------------------------------------------for h5Course demo-----------------------------------------------------------------
                           if(seaConf.host.textType==='h5Course'){
                               var dataLogin={
                                   type:'teaState',
                                   state:'out'
                               }
                               window.iFrameParIO.H5Course.notify(dataLogin);
                           }
                           //-----------------------------------------------------------------------------------------------------------------------------------
                           
                            //如果是英文的系统则修改提示信息
                            if(seaConf.host.language=='en'){
                                $('#tools_handle span').attr("title", "The teacher is not in classroom, can't use these tools");
                            }else{
                                $('#tools_handle span').attr("title", "老师不在教室，不能使用白板工具");
                            }
                       
                        }
                       else if(!seaConf.user.teaLogin&&JSON.parse(obj.jsonStr).Bl_E_O==1){
                           //accept teacher enter class when teacher is out class
                           console.log('[%s] -----------> teacher enter class',window.getTimeNow());

                           //更新哨兵
                           seaConf.user.teaLogin=true;

                           //判断是否和老师在同一页
                           if(seaConf.classInfo.serverInfo.curPage==seaConf.classInfo.textInfo.curPage){
                               //开启绘制功能
                               console.log('[%s] -----------> update board to pause draw(false) when teacher enter class and page number is same',window.getTimeNow());
                               seaConf.board.pauseDraw=false;
                               seaTools.updateBoardConf({'pauseDraw':false});//update Board conf
                           }

                           if(seaConf.moduleSet.tools){//如果存在这个模块 不做显示因为是公开课本身不会有tools
                               //...
                           }
                           if(seaConf.course.canDraw&&seaConf.moduleSet.board){
                               seaTools.agentTools('tools',{'type':seaConf.board.curToolType});//统一一次白板，为了触发固定逻辑
                           }
                           //-------------------------------------------------for h5Course demo-----------------------------------------------------------------
                           if(seaConf.host.textType==='h5Course'){
                               var dataLogin={
                                   type:'teaState',
                                   state:'in'
                               }
                               window.iFrameParIO.H5Course.notify(dataLogin);
                           }
                           //-----------------------------------------------------------------------------------------------------------------------------------
                       
                            //如果是英文的系统则修改提示信息
                            $('#tools_handle span').each(function () {
                                $(this).attr('title', $(this).attr('stitle'));
                            });
            
                        }
                   }
                }
                //显示or隐藏教材切换按钮
                else if(obj.type == "changebookbtn"){
                    var temObj=JSON.parse(obj.jsonStr);
                    var $btn = $(".toolContain .btn-switch");
                    if(temObj.visible == "true"){
                        $btn.show();
                    }else{
                        $btn.hide();
                    }
                }
                //播放动画
                else if(obj.type == "animate"){
                    var temObj=JSON.parse(obj.jsonStr);
                    var $div = $(".anime");
                    var $iframe = $(".anime iframe");
                    if(temObj.play == "true"){
                        animate.id = temObj.id;
                        animate.play(temObj.path);
                    }else{
                        animate.stop();
                    }
                }
                else{
                    //-------------------------------------------------for h5Course demo-----------------------------------------------------------------
                    var temObj=JSON.parse(obj.jsonStr);
                    //截取互动教材的指令信息
                    if(temObj.handleType==0&&obj.type=='paint'&&temObj.drawingType==seaConf.h5Course.idType){
                        console.log('[%s] -----------> get data:',window.getTimeNow());
                        console.log(temObj);
                        window.iFrameParIO.H5Course.comm(temObj);
                    }else{
                        seaTools.agentTools(obj.type,JSON.parse(obj.jsonStr));
                    }
                    //-----------------------------------------------------------------------------------------------------------------------------------
                }
            }
        },
        'clearCache': function () {//清除之前因为白板没准备好服务器下发的数据
            var obj={
                'cur':seaConf.classInfo.textInfo.curPage-1,
                'count':seaConf.classInfo.textInfo.countPage
            };
            //先通知一次客户端页码
            seaTools.initPageNum(obj);

            if(seaConf.moduleSet.board){//if board module is alive
                if(seaConf.boardDataCache.length!=0){//client get board data from server when board is not ready
                    console.log('[%s] -----------> cache to paint when canvas is ready',window.getTimeNow());
                    console.log('[%s] -----------> cache : ',window.getTimeNow());

                    var tem=null;
                    for(var i= 0,j=seaConf.boardDataCache.length;i<j;i++){
                        var a=seaConf.boardDataCache.shift();
                        console.log('        -----------> %s',JSON.stringify(a));
                        if(a.type!='scroll'){
                            logicUnpack.update(a);
                        }else{//屏蔽多个滚动条信息
                            tem=a;
                        }
                    }
                    if(tem!=null){//更新一次滚动条
                        logicUnpack.update(tem);
                    }
                }
            }
        }
    };

    exports.dataGet=function (type,objStr) {
        //accept server data
        //接收数据
        if(['course','user','host','url','boardSet','appointMemberList','courseAll','userAll'].indexOf(type)!=-1){//把初始化信息摘出来
            //serverData initData of loadHtml to logic module
            var obj=objStr;
            if(Object.prototype.toString.call(objStr) == '[object String]'){
                obj = JSON.parse(objStr);
            }
            if(type=='url'){
                //-------------------------------------------------for h5Course demo-----------------------------------------------------------------
                //obj.url=window.MyBase64.decode(obj.url);
                //-------------------------------------------------for h5Course demo-----------------------------------------------------------------
                try {
                    obj.pdf=window.MyBase64.decode(obj.pdf);
                    obj.h5Course.countNum=parseInt(obj.h5Course.countNum);
                    obj.h5Course.headUrl=window.MyBase64.decode(obj.h5Course.headUrl);
                    obj.h5Course.urlControl=window.MyBase64.decode(obj.h5Course.urlControl);
                    console.log('[%s] -----------> get URL data from client:',window.getTimeNow());
                    console.log('                      ----------->controlURL: %s',obj.h5Course.urlControl);
                    console.log('                      ----------->headSTR: %s',obj.h5Course.headUrl);
                    console.log('                      ----------->count page： %s',obj.h5Course.countNum);
                }catch (e){

                }
            }
            logicUnpack.init(type,obj);
        }
        else if(type==='changeCourse'){
            window.iFrameParIO.changeCourse(JSON.parse(objStr));
            //serverData but not initData
            var obj={
                'type':'tools',
                'jsonStr':JSON.stringify({type:'clear'})
            };
            logicUnpack.update(obj);
        }else if(type == 'testEncode'){
            console.log('===========test encode================>router enter:');
            console.log(objStr);

            window.comm_type_send('testEncodeBack',objStr);
        }
        else{//处理其他信息
            //serverData but not initData
            var obj={
                'type':type,
                'jsonStr':objStr
            };
            logicUnpack.update(obj);
        }
    };
});
/**
 * Created by Administrator on 2016/8/17.
 * module info:
 *        生产者消费者模式
 *        函数节流,用于管理从客户端接收到的数据，存入缓冲池，每50ms拿一次数据
 */
define('checkData',['boardConf','logicUnpack'],function (require, exports, module) {
    var seaConf=require('boardConf').conf,
        seaLogic=require('logicUnpack');
    var handleCheck={//used to achieve check
        'route':function(obj){//路由 中转
            //distribute obj to different module according type
            seaLogic.dataGet(obj.type,obj.jsonStr);
        },
        'checkInfo': function (Arr,process,context) {
            //函数节流
            setTimeout(function () {
                var tem=Arr.shift();
                if(tem){
                    process.call(context,tem);
                }
                if(Arr.length>0){
                    setTimeout(arguments.callee,50);
                }
            },50)
        }
    };

    exports.getCheckData=function (type,jsonStr) {
        //做一次封装
        var obj={
            'type':type,
            'jsonStr':jsonStr
        }
        if(type==='course'){
            //记录拿到课程数据的本地时间，保证低误差
            seaConf.course.localTime=new Date().getTime();
        }
        //如果缓冲池中有数据直接丢入
        if(seaConf.serverIOArr.length>0){
            seaConf.serverIOArr.push(obj);
        }else{//如果缓冲池中没有数据，丢入数据并且激活消费者函数
            seaConf.serverIOArr.push(obj);
            handleCheck.checkInfo(seaConf.serverIOArr,handleCheck.route);
        }
    };

    exports.getCheckDataEncode = function(type, json){
        //做一次封装
        var obj={
            'type':type,
            'jsonStr':json
        }
        if(type==='course'){
            //记录拿到课程数据的本地时间，保证低误差
            seaConf.course.localTime=new Date().getTime();
        }
        //改为直接消费
        handleCheck.route(obj);
    }
});
/**
 * Created by Administrator on 2016/8/17.
 * module info:
 *        数据池，用于各个模块共享交互
 *        数据池中包含当前信息和固定配置信息
 */
define('boardConf',function (require, exports, module) {
    exports.conf={
        'serverIOArr':[],//storage server input or out data 存储服务器的数据（缓冲池，数据节流）
        'boardDataCache':[],//storage server data when draw handle is not ready 缓冲池，用于当教材和白板没有准备好的时候存储服务器下发的数据
        'isSupportEncodeFunc':false,//指定是否支持编码的方法
        'cToJsCacheArr':[],//存发送给js的数据缓冲数组
        'cToJsChildTaskEnd':true,//表示当前的任务是否已经完成
        'jsToCArr':[],//存储向c++发送的数据
        'jsToCTime':300,//指定向c++发送数据时的时区长度
        'jsToCTimer':null,//向c++发送数据时的时间对象
        'serverData':{//服务器的数据，用于存储最开始从客户端接收到的数据
            'objCourseInfo':null,//class info 教室的信息
            'objUserInfo':null,//user info 用户的信息
            'objHostInfo':null,//host info 宿主信息
            'objURLInfo':null,//url info 课件信息 比如url
        },
        'user':{
            'type':'stu',//'stu'/'tea' 用户的类型
            'userRole':'',//detailed user's role 用户的详细角色信息
            'userType':'',//user's power stu/administrator/tea/... 和权限相关的类型
            'courseRole':'',//user's type in course 教室内的角色
            'userId':'',//user's id 用户的id
            'teaLogin':false,//true/false 老师是否已经进入教室
        },
        'course':{
            'turnPage':true,//true/false 教材是否可以翻页
            'canDraw':false,//if user's type can draw 本教材是否允许绘制，总开关
            'courseType':'1v1',//1v1 1vN 教室的类型
            'courseId':'',//课程id
            'metrialType':0,//drawing area 0 1 2 3 教材的类型 有固定的算法（关于pdf的显示区域问题：pdf是0和3是tg，1 普通2不常见）
            'courseStyle':0,//detailed course style 教室的详细类型
            'isMultiVC':false,//是否为多视频教室  特殊对待的1vN教室
            'startedTime':0,//当前教室已经开始的时间 ms级别
            'localTime':0//当收到客户端传来的startedTime后，记录本地的时间
        },
        'host':{
            'mainHost':'window',//reserved unused 暂时未使用，留给区分mac和window或者其他的端口
            'language':'cn',//language  语言
            'versionType':0,//if open new handle 0:no 1:yes 2:no local configure 之前的本地配置，是否开启新功能，已废弃
            'textType':'pdf',//'pdf'  'ppt' ... 教材的类型
            'textUrl':{
                pdf:'',
                h5Course:{
                    countNum:0,
                    headUrl:'',
                    urlControl:''
                }
            },//url of text
            'classType':'normal',//'normal'  'teen' 区分青少还是成人教室
            'tipData':{//for teacher 提示信息
                'scrollData':false,//tip scrolled  滚动的提示信息
                'fixedData':false//tip fixed   固定的提示信息
            },
            'tools':{ //根据这个来判断采用哪些工具
                //工具条信息
                'pen':false,//画笔
                'signpen':false,//荧光笔
                'rec':false,//矩形
                'rub':false,//旧版橡皮擦
                'newrub':false,//新版橡皮擦
                'text':false,//文字
                'draft':false,//拖拽
                'back':false,//回退
                'clear':false//清空
            }
        },
        'moduleSet':{//根据这个来加载模块
            //module sign
            'contain':true,//主模块壳
            'update':true,//收到无法分析的信令时的提示升级信息
            'page':false,//显示页码和翻页的模块
            'tools':false,//工具条模块
            'board':true,//白板模块
            'course':true,//教材模块
            'dataScroll':false,//滚动提示信息模块
            'dataFixed':false,//固定提示信息模块
            //-------------------------------------------------for h5Course demo-----------------------------------------------------------------
            'ccLayer':false,
            //-------------------------------------------------for h5Course demo-----------------------------------------------------------------
            'timeTip':false,//时间提示模块
            'switch':true//教材切换按钮
        },
        'event':{//事件绑定 根据这些来判断是否要绑定这些事件
            //event need to bind when html is loaded
            'mouse':false,//鼠标事件
            'barScroll':false,//滚动条同步
            'scrollData':false,//信息滚动
            'fixedData':false,//固定信息的关闭，只关闭一次不再显示
            'timeTip':false//时间提示信息
        },
        'classInfo':{//教室内信息
            'textInfo':{//教材信息
                'curPage':1,//>=1 本地当前的页码
                'countPage':0,//>=1 本地总页码
                'width':0, //本地教材的宽高
                'height':0 //本地教材的宽高
            },
            'drawInfo':{//绘制白板的信息
                'width':0,//白板宽度
                'height':0,//白板的高度
                'left':0,//白板的左边距
                'top':0,//白板的上边距
                'ready':false,//course loaded? true:false 白板是否已经准备好了可以绘制的状态
            },
            'serverInfo':{//服务器的信息
                //record server data
                'curPage':1,//>=1 服务器当前的页码
                'countPage':0//>=1 服务器的总页码
            },
            'cursorStyle':{//unused 未使用
                'iframe':'',
                'canvas':''
            }
        },
        'update':{//收到无法分析的信令时的提示升级信息
            //used to record if never tip is clicked
            'tip_update':true//是否点击了不再显示
        },
        'board':{//白板信息
            'version':'old',//new handle?'new':'old' new:newRubber\drag\reedit 新老版本：新版本存在新的橡皮擦，拖拽功能，和文字的重写，用于控制是否开放这些功能
            'curToolType':'pen',//record current tool 当前的画笔类型
            'pauseDraw':true,//for whiteBoard,it can not be drawed when pause is true , 当canDraw为true时有效，表示是否暂停绘制，暂停绘制时可以显示来自服务端的数据
            'mouse':{//current mouse position  鼠标信息
                'curX':0, //当前的位置x坐标
                'curY':0, //当前的位置y坐标
                //---------------------------------share for mouse display----------------------------------------
                'mouseMax':5,//控制教鞭从接收到上一次的对方鼠标位置显示后直到隐藏的秒数
                'mouseSign':0//记录从接收到上一次的对方鼠标位置后过了多少秒
                //---------------------------------share for mouse display----------------------------------------
            },
            'font':{//文字大小信息
                'big':32,//大文字
                'small':25//小文字
            },
            //default set for board 默认白板的初始化信息
            'tea':{//老师的白板默认初始化信息
                'type':'tea',//老师
                'pencil':{//画笔
                    'color':'#FF0000',//画笔的颜色
                    'size':3//画笔的大小
                },
                'sign_pencil':{//荧光笔
                    'color':'#FF0000',//荧光笔颜色
                    'size':20//荧光笔的大小
                },
                'rub':{//橡皮
                    'size':30//橡皮的大小
                },
                'font':{//文字
                    'fontStyle':'songti',//文字的样式
                    'fontSize':32, //文字的大小
                    'fontColor':'#FF0000'//文字的颜色
                },
                'target':{//鼠标移动时的当前选中的画笔的颜色
                    'color':'#0000FF'
                }
            },
            //default set for board
            'stu':{
                'type':'stu',
                'pencil':{
                    'color':'#0078FF',
                    'size':3
                },
                'sign_pencil':{
                    'color':'#FFFF00',
                    'size':20
                },
                'rub':{
                    'size':30
                },
                'font':{
                    'fontStyle':'songti',
                    'fontSize':32,
                    'fontColor':'#0078FF'
                },
                'target':{
                    'color':'#0000FF'
                }
            }
        },
        'cursor':{//for change mouse style 鼠标样式
            'normal':{ //普通成人教室
                'size':{//大小
                    'wid':'46',
                    'hei':'46'
                },
                'forbidden':'url(images/nor_forbid.png) 46 46,auto',//禁止绘制
                'normal':'url(images/nor_normal.png) 46 46,auto',//正常
                'ferule':'url("images/nor_ferule.png") 46 46,auto',//教鞭
                'pen':'url(images/nor_pen.png) 46 46,auto',//铅笔
                'signpen':'url(images/nor_signpen.png) 46 46,auto',//荧光笔
                'rec':'url(images/nor_rec.png) 23 23,auto',//矩形
                'rub':'url(images/nor_rub.png) 23 23,auto',//橡皮
                'newrub':'url(images/nor_newrub.png) 23 23,auto',//新版的橡皮
                'text':'url(images/nor_text.png) 23 23,auto',//文本
                'draft':'url(images/nor_move.png) 23 23,auto',//拖拽
                'wait':''//unused now 未使用
            },
            'teen':{
                'size':{
                    'wid':'64',
                    'hei':'64'
                },
                'forbidden':'url(images/young_forbid.png) 64 64,auto',
                'normal':'url(images/young_normal.png) 64 64,auto',
                'ferule':'url("images/young_ferule.png") 64 64,auto',
                'pen':'url(images/young_pen.png) 64 64,auto',
                'signpen':'url(images/young_signpen.png) 64 64,auto',
                'rec':'url(images/young_rec.png) 32 32,auto',
                'rub':'url(images/young_rub.png) 64 64,auto',
                'newrub':'url(images/young_rub.png) 64 64,auto',
                'text':'url(images/young_text.png) 32 32,auto',
                'draft':'url(images/young_move.png) 64 64,auto',
                'wait':'url(images/young_wait.png) 32 32,auto'//unused now
            }
        },
        'pdf':{
            //单独记录pdf的页码
            curPage:1,
            countPage:0
        },
        'h5Course':{
            idType:400,//互动教材协议的type
            open:false,//当前版本是否支持H5
            //单独记录pdf的页码
            curPage:1,
            countPage:0,
            startClass:false,//开始上课
            startPractice:false,//开始练习
            resizeFirst:true,//是否是第一次缩放标志
            canvasColor:'rgba(202, 232, 174, 0.2)'//画布的颜色配置
        }
    };
});
/**
 * Created by Administrator on 2016/8/15.
 * module info:
 *        用于和c++交互的模块
 */
//achieve communication agent
define('commCef',['boardConf','checkData'],function (require, exports, module) {
    var seaConf=require('boardConf').conf,
        seaCheck=require('checkData');

    function consumeServerData(data, pi, pj) {
        //先置哨兵为false
        seaConf.cToJsChildTaskEnd = false;
        var i = 0,
            j = 0,
            pi = pi,
            pj = pj,
            runArr = [],
            runLen = 0,
            childArr = [],
            childLen = 0,
            childIndex = -1,

            isBFalse = false, //为了区别是不是Base64 decode失败
            // isDFalse = false,
            isCFalse = false; //为了避免try catch到c++的错误，造成死机制循环


        //初始化数据 分两种情况
        // 一种是第一次执行或者完整执行一次consumeServerData后发现cToJsCacheArr还有新的数据加入继续执行
        // 一种是在完整执行一次consumeServerData函数的时候出现错误，继续执行下一次

        if(data == undefined){
            //第一种情况
            runArr = seaConf.cToJsCacheArr.splice(0);
            pi = 0;
            pj = 0;
        }else{
            //第二种情况
            runArr = data;
        }

        runLen = runArr.length;

        var type = '',
            value = null;
        // debugger;
        try{
            for(i = pi; i < runLen; i++){
                childIndex = runArr[i].dataIndex;

                console.log('===========test encode================>consumeServerData 当前执行:');
                console.log(childIndex);

                isBFalse = true;
                childArr = JSON.parse(MyBase64.decode(runArr[i].data));
                isBFalse = false;
                childLen = childArr.length;
                for(j = pj; j < childLen; j++){
                    type = childArr[j].type;
                    value = childArr[j].value;
                    console.log('~~~~~~~'+childIndex+'~~~~~~~~~~~~'+j+'~~~~~~~~~~');
                    if(type != undefined && value != undefined){
                        seaCheck.getCheckDataEncode(type,value);
                    }else{
                        if(type == undefined) throw "type is undefined!"
                        if(value == undefined) throw "value is undefined!"
                    }
                }
                //还原pj，保证下次for时从0开始，避免漏掉数据
                pj = 0;

                //每成功消费一次arr数据和c++握手一次
                isCFalse = true;
                window.comm_type_get_encode_back && window.comm_type_get_encode_back('complete',JSON.stringify({index:childIndex}));
                isCFalse = false;
            }
        }catch (e){
            console.warn('|-------------consumeServerData---------->消费服务器数据时出错!');
            console.warn(e);

            if(isBFalse){
                console.log('===========test encode================>consumeServerData Base64出错');
                //假如是Base64造成的出错
                window.comm_type_get_encode_back && window.comm_type_get_encode_back('BaseError',JSON.stringify({
                    index : childIndex,
                    errorInfo : e
                }));
                window.comm_type_get_encode_back && window.comm_type_get_encode_back('complete',JSON.stringify({index:childIndex}));
                return consumeServerData(runArr.slice(0),++i,j);
            }

            if(!isCFalse){//确保不是c++的错误触发try catch机制
                console.log('===========test encode================>consumeServerData 处理数据出错');
                //在消费每一次的数据的时候出现任何问题都要进行告知c++
                window.comm_type_get_encode_back && window.comm_type_get_encode_back('DataError',JSON.stringify({
                    index : childIndex,
                    errorInfo : e,
                    errorPosition : j  //不能直接给错误数据，因为可能是decode或者Json.parse引起的错误，而且数据量还会大
                }));
                //在消费每一次的数据的时候出现任何问题后，确保下一条数据的正确执行  return是为了不会重复消费
                return consumeServerData(runArr.slice(0),i,++j);
            }
            console.log('===========test encode================>consumeServerData 其他错误！');
        }
        // setTimeout(function () {
            console.log('!!!!!!!!!!!!!!test encode!!!!!!!!!!!!!!!!!!!!!!!!>consumeServerData 结束一次！');
            //保证所有的缓存数据都被消费掉
            if(seaConf.cToJsCacheArr.length > 0){
                //消费数据的同时有新数据传入
                consumeServerData();
            }else{
                //表示这次的消费截止了
                console.log('===========test encode================>consumeServerData 运行完，重设task状态！');
                seaConf.cToJsChildTaskEnd = true;
            }
        // },500);
    }

    //两个挂载到window的函数，用于和c++通信
    ////window function to get data from Cef(Server data) 用于c++向js发送信息
    window.comm_type_get= function(type,jsonStr){
        //for mac test
        //if(typeof jsonStr=='object'){
        //    try {
        //        console.log('--------------------------------------test jsonStr :');
        //        console.log('--------------------------------------json :');
        //        console.log(jsonStr);
        //        if(type=='url'){
        //            console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!受到加密后的是：'+jsonStr.url);
        //            console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!解密之后是 ：'+window.MyBase64.decode(jsonStr.url));
        //        }
        //        jsonStr=JSON.stringify(jsonStr);
        //    }catch (e){
        //        console.error('--------------------------------------failed when turn json to jsonStr:'+e);
        //    }
        //    jsonStr=JSON.stringify(jsonStr);
        //}
        console.log("client->js:",type,jsonStr);
        seaCheck.getCheckData(type,jsonStr);
    }

    window.comm_type_get_encode = function (dataIndex, arrStr) {
        try{
            console.log("client->js:",dataIndex,arrStr);
            seaConf.cToJsCacheArr.push({
                dataIndex : dataIndex,
                data : arrStr
            });
            console.log('===========test encode================>comm_type_get_encode enter:');
            console.log(seaConf.cToJsCacheArr.length);
            if(seaConf.cToJsChildTaskEnd){
                console.log('===========test encode================>comm_type_get_encode 上次任务已经结束:');
                //消费cache数据
                consumeServerData();
            }else{
                console.log('===========test encode================>comm_type_get_encode 上次任务尚未结束:');
            }
        }catch (e){
            console.warn('|-------------comm_type_get_encode---------->消费服务器数据时出错!');
            console.warn(e);
        }
    }

    //function used to send data to the outer（c++/mac/ios/....）  用于js向c++通信
    window.comm_type_send=function(type,jsonStr){
        return;
        try{
            console.log("js->client:",type,jsonStr);
            //for mac test
            if(seaConf.host.mainHost==='mac'){
                window.webkit.messageHandlers.AcJs_get.postMessage(JSON.stringify({type:type,value:jsonStr}));
                return;
            }
            //window.AcJs_get(type,jsonStr); 调用c++预先定义的函数
            if(!seaConf.isSupportEncodeFunc){
                window.AcJs_get(type,jsonStr);
            }else{
                seaConf.jsToCArr.push({
                    type : type,
                    value : JSON.parse(jsonStr)
                });
                //判断当前是否在时间段内
                if(seaConf.jsToCTimer == null){
                    //未在时间段内，启动监听
                    seaConf.jsToCTimer = window.setTimeout(function () {
                        try{
                            var targetData = JSON.stringify(seaConf.jsToCArr.splice(0));
                            window.AcJs_get_encode(targetData);
                        }catch (e){
                            console.warn('|-------------AcJs_get_encode---------->发送到C++时出错!');
                            console.warn(e);
                        }finally{
                            //还原状态
                            window.clearTimeout(seaConf.jsToCTimer);
                            seaConf.jsToCTimer = null;
                        }
                    },seaConf.jsToCTime);
                }

            }
        }catch(e){
            console.log('[%s] -----> failed to send data to cef3 : [%s]',window.getTimeNow(),e);
        }
    }
});
/**
 * Created by Administrator on 2016/8/15.
 * module info:
 *        seajs 入口
 */
$(document).ready(function () {
    window.MyBase64 = {
        // 转码表
        table : [
            'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H',
            'I', 'J', 'K', 'L', 'M', 'N', 'O' ,'P',
            'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X',
            'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f',
            'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n',
            'o', 'p', 'q', 'r', 's', 't', 'u', 'v',
            'w', 'x', 'y', 'z', '0', '1', '2', '3',
            '4', '5', '6', '7', '8', '9', '+', '/'
        ],
        UTF16ToUTF8 : function(str) {
            var res = [], len = str.length;
            for (var i = 0; i < len; i++) {
                var code = str.charCodeAt(i);
                if (code > 0x0000 && code <= 0x007F) {
                    // 单字节，这里并不考虑0x0000，因为它是空字节
                    // U+00000000 – U+0000007F  0xxxxxxx
                    res.push(str.charAt(i));
                } else if (code >= 0x0080 && code <= 0x07FF) {
                    // 双字节
                    // U+00000080 – U+000007FF  110xxxxx 10xxxxxx
                    // 110xxxxx
                    var byte1 = 0xC0 | ((code >> 6) & 0x1F);
                    // 10xxxxxx
                    var byte2 = 0x80 | (code & 0x3F);
                    res.push(
                        String.fromCharCode(byte1),
                        String.fromCharCode(byte2)
                    );
                } else if (code >= 0x0800 && code <= 0xFFFF) {
                    // 三字节
                    // U+00000800 – U+0000FFFF  1110xxxx 10xxxxxx 10xxxxxx
                    // 1110xxxx
                    var byte1 = 0xE0 | ((code >> 12) & 0x0F);
                    // 10xxxxxx
                    var byte2 = 0x80 | ((code >> 6) & 0x3F);
                    // 10xxxxxx
                    var byte3 = 0x80 | (code & 0x3F);
                    res.push(
                        String.fromCharCode(byte1),
                        String.fromCharCode(byte2),
                        String.fromCharCode(byte3)
                    );
                } else if (code >= 0x00010000 && code <= 0x001FFFFF) {
                    // 四字节
                    // U+00010000 – U+001FFFFF  11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
                } else if (code >= 0x00200000 && code <= 0x03FFFFFF) {
                    // 五字节
                    // U+00200000 – U+03FFFFFF  111110xx 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx
                } else /** if (code >= 0x04000000 && code <= 0x7FFFFFFF)*/ {
                    // 六字节
                    // U+04000000 – U+7FFFFFFF  1111110x 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx
                }
            }

            return res.join('');
        },
        UTF8ToUTF16 : function(str) {
            var res = [], len = str.length;
            var i = 0;
            for (var i = 0; i < len; i++) {
                var code = str.charCodeAt(i);
                // 对第一个字节进行判断
                if (((code >> 7) & 0xFF) == 0x0) {
                    // 单字节
                    // 0xxxxxxx
                    res.push(str.charAt(i));
                } else if (((code >> 5) & 0xFF) == 0x6) {
                    // 双字节
                    // 110xxxxx 10xxxxxx
                    var code2 = str.charCodeAt(++i);
                    var byte1 = (code & 0x1F) << 6;
                    var byte2 = code2 & 0x3F;
                    var utf16 = byte1 | byte2;
                    res.push(
                        String.fromCharCode(utf16)
                    );
                } else if (((code >> 4) & 0xFF) == 0xE) {
                    // 三字节
                    // 1110xxxx 10xxxxxx 10xxxxxx
                    var code2 = str.charCodeAt(++i);
                    var code3 = str.charCodeAt(++i);
                    var byte1 = (code << 4) | ((code2 >> 2) & 0x0F);
                    var byte2 = ((code2 & 0x03) << 6) | (code3 & 0x3F);
                    utf16 = ((byte1 & 0x00FF) << 8) | byte2
                    res.push(String.fromCharCode(utf16));
                } else if (((code >> 3) & 0xFF) == 0x1E) {
                    // 四字节
                    // 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
                } else if (((code >> 2) & 0xFF) == 0x3E) {
                    // 五字节
                    // 111110xx 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx
                } else /** if (((code >> 1) & 0xFF) == 0x7E)*/ {
                    // 六字节
                    // 1111110x 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx
                }
            }

            return res.join('');
        },
        encode : function(str) {
            if (!str) {
                return '';
            }
            var utf8    = this.UTF16ToUTF8(str); // 转成UTF8
            var i = 0; // 遍历索引
            var len = utf8.length;
            var res = [];
            while (i < len) {
                var c1 = utf8.charCodeAt(i++) & 0xFF;
                res.push(this.table[c1 >> 2]);
                // 需要补2个=
                if (i == len) {
                    res.push(this.table[(c1 & 0x3) << 4]);
                    res.push('==');
                    break;
                }
                var c2 = utf8.charCodeAt(i++);
                // 需要补1个=
                if (i == len) {
                    res.push(this.table[((c1 & 0x3) << 4) | ((c2 >> 4) & 0x0F)]);
                    res.push(this.table[(c2 & 0x0F) << 2]);
                    res.push('=');
                    break;
                }
                var c3 = utf8.charCodeAt(i++);
                res.push(this.table[((c1 & 0x3) << 4) | ((c2 >> 4) & 0x0F)]);
                res.push(this.table[((c2 & 0x0F) << 2) | ((c3 & 0xC0) >> 6)]);
                res.push(this.table[c3 & 0x3F]);
            }

            return res.join('');
        },
        decode : function(str) {
            if (!str) {
                return '';
            }

            var len = str.length;
            var i   = 0;
            var res = [];

            while (i < len) {
                code1 = this.table.indexOf(str.charAt(i++));
                code2 = this.table.indexOf(str.charAt(i++));
                code3 = this.table.indexOf(str.charAt(i++));
                code4 = this.table.indexOf(str.charAt(i++));

                c1 = (code1 << 2) | (code2 >> 4);
                c2 = ((code2 & 0xF) << 4) | (code3 >> 2);
                c3 = ((code3 & 0x3) << 6) | code4;

                res.push(String.fromCharCode(c1));

                if (code3 != 64) {
                    res.push(String.fromCharCode(c2));
                }
                if (code4 != 64) {
                    res.push(String.fromCharCode(c3));
                }

            }

            return this.UTF8ToUTF16(res.join(''));
        }
    };
    //用于打印日志时的调用
    window.getTimeNow= function () {
        var date=new Date();
        var headDes=date.toLocaleTimeString()+' '+date.getMilliseconds()+'ms';
        return headDes;
    }
    //入口
    seajs.use('commCef');
})
