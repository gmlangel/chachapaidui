/**
 * pdfloader相关的数据结构体封装
 * Created by guominglong on 2018/9/30.
 */

/**
 * 替换JSON 字符串中的特殊字符
 * */
function transcodingJavascriptMessage(str){
    let resultMessage = str.replace("\\", "\\\\");
    //resultMessage = resultMessage.replace("\"","\\\"")打开这两行,会有问题
    //resultMessage = resultMessage.replace("\'","\\\'")打开这两行,会有问题
    resultMessage = resultMessage.replace("\n","\\n")
    resultMessage = resultMessage.replace("\r","\\r")
    resultMessage = resultMessage.replace("\u000C","\\f")
    resultMessage = resultMessage.replace("\u2028","\\u2028")
    resultMessage = resultMessage.replace("\u2029","\\u2029")

    return resultMessage
}

/**
 * 基础类
 * */
class H5EntityBase {
    constructor(){
        this._data = {};
        this._key = "";
    }
    /**
     对应window.comm_type_get(type,jsonStr) 中的type
     */
    get key(){
        return this._key;
    }

    /**
     获取当前数据模型中的数据
     */
    get data(){
        return this._data
    }

    set data(d){
        this._data = d;
    }

    /**
     使用data和key生成JS调用语句window.comm_type_get(type,jsonStr)
     */
    toJSStr(){
        let str = "";
        try{
            str = JSON.stringify(this.data);
            str = transcodingJavascriptMessage(str);
        }catch(err){
            console.log("H5EntityBase==>数据封装错误,原因:"+err);
        }
        return str;
    }
}

class H5Entity_course_simple extends H5EntityBase{
    constructor(){
        super();
        this._key = "course";
        this._data = {
            "courserole":1,/*用户角色类型 对应ACRoletype，可以值为(0,1,4,5,6,7,64)*/
            "coursestyle":9,/*教室的详细类型，对应ClassRoomType '0':'1v1',
             '1':'open lecture',
             '2':'multi video classroom',
             '3':'experience lecture',
             '4':'competitive Small-class-based lecture',
             '5':'active open lecture',
             '6':'PSO training lecture',
             '7':'SA open lecture',
             '8':'PT ways lecture',
             '9':'multi video classroom',
             '10': 'chinese teacher lecture',
             '12':'B2S open lecture',
             '13':'class lecture'
             */
            "metrialtype":0,/*
             绘制类型
             0：正常
             1：旧的
             2：新的
             3：正常，为了修补接口bug
             */
            "startedTime":58121698,/*课程已经开始了多少毫秒（ms）*/
            "CanTurnPage":1/*0 不可以翻页， 1可以翻页*/
        }
    }
}

class H5Entity_user_simple extends H5EntityBase{
    constructor(){
        super();
        this._key = "user"
        this._data = {
            "usergroup":7,/*
             用户所属人群
             1,上班族
             2,大学生
             3,中学生
             4,小学生
             5,高中生
             6,初中生
             7,幼儿
             */
            "userid":0,/*接口直接返回的uint32位userID*/
            "userrole":1,   /*用户的详细角色信息 对应ACRoleType
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
             '99':'1vN administrator'
             */
            "usertype":1  /*
             '1':'teacher', '2':'student', '3':'administrator', '4':'customer service'

             */
        }
    }
}

class H5Entity_courseAll extends H5EntityBase{
    constructor(){
        super();
        this._key = "courseAll"
        this._data = {}
    }
}


class H5Entity_host_simple extends H5EntityBase{
    constructor(){
        super();
        this._key = "host"
        this._data = {
            "language":"cn",/*当前app运行的系统使用的语言cn/en*/
            "mainhost":"mac",/*暂时不用*/
            "showtype":"normal",/*
             教材类型
             teen：青少
             normal：成人
             */
            "textType":0,
            /*
             教材类型：
             0：pdf
             1：ppt
             2：h5course
             */
            "tipdata":{"fixdata":true},/*固定提示信息*/
            "versionType":2/*未使用给2*/
        }
    }
}

class H5Entity_url_simple extends H5EntityBase{
    constructor(){
        super();
        this._key = "url"
        this._data = {}
    }
}

class H5Entity_enterOut_simple extends H5EntityBase{
    constructor(){
        super();
        this._key = "enterout"
        this._data = {
            "Bl_E_O":0/*老师进出教室  0：退出  1：进入*/
        }
    }
}

class H5Entity_paint_simple extends H5EntityBase{
    constructor(){
        super();
        this._key = "paint"
        this._data = {}
    }
}

class H5Entity_mouse_simple extends H5EntityBase{
    constructor(){
        super();
        this._key = "mouse"
        this._data = {
            "canvasWidth":"0",/*Double(画布宽度)*/
            "canvasHeight":"0",/*Double(画布高度)*/
            "mouseX":"0",/*Double(鼠标x坐标)*/
            "mouseY":"0",/*Double(鼠标y坐标)*/
            "CurrentPage":"1"/*当前页面从1开始*/
        }
    }
}

class H5Entity_scroll_simple extends H5EntityBase{
    constructor(){
        super();
        this._key = "scroll"
        this._data = {
            "totalHeight_X":"0",/*Int默认给0*/
            "scrollTop_X":"0",/*Int默认给0*/
            "totalHeight_Y":"0",/*Int(纵向滚动条总高度)*/
            "scrollTop_Y":"0",/*Int(纵向滚动条滚动距离)*/
            "CurrentPage":"1"/*当前页面从1开始*/
        }
    }
}

class H5Entity_page_simple extends H5EntityBase{
    constructor(){
        super();
        this._key = "page"
        this._data = {
            "TotalPage":"0",/*Int总页数*/
            "CurrentPage":"1"/*当前页面从1开始*/
        }
    }
}

class H5Entity_tools_simple extends H5EntityBase{
    constructor(){
        super();
        this._key = "tools"
        this._data = {
            "type":"pen",/*
             工具栏类型
             pen:铅笔
             signpen：银光笔
             rec：矩形
             rub：橡皮擦
             newrub：新橡皮
             {type:’text’,
             size:’big’/’samll’}文字
             draft：拖拽
             back：回退
             clear：清空
             */
        }
    }
}

class H5Entity_pageclick_simple extends H5EntityBase{
    constructor(){
        super();
        this._key = "pageclick"
        this._data = {
            "targetPage":1/*Int(目标页码) （从1开始）*/
        }
    }
}

class H5Entity_addTool_simple extends H5EntityBase{
    constructor(){
        super();
        this._key = "addTool"
        this._data = {
            "magic":1/*是否增加魔法表情按钮*/
        }
    }
}

class H5Entity_changeCourse_simple extends H5EntityBase{
    constructor(){
        super();
        this._key = "changeCourse"
        this._data = {
            "targetCourse":""/*参数给pdf或者是h5Course*/
        }
    }
}

class H5Entity_canvas_simple extends H5EntityBase{
    constructor(){
        super();
        this._key = "canvas"
        this._data = {
            "type":"open"/*'open' or 'close'*/
        }
    }
}


class H5Entity_magic_simple extends H5EntityBase{
    constructor(){
        super();
        this._key = "magic"
        this._data = {
            "left":"0",/*x轴坐标*/
            "top":"0",/*Y轴坐标*/
            "ori":"0"/*
             魔法表情的基准点
             0：下
             1：左
             2：右
             */
        }
    }
}

class H5Entity_teenpage_simple extends H5EntityBase{
    constructor(){
        super();
        this._key = "teenpage"
        this._data = {
            "cur":"1",/*当前页 从1开始*/
            "count":"1"/*总页数*/
        }
    }
}

class H5Entity_starClass_simple extends H5EntityBase{
    constructor(){
        super();
        this._key = "startClass"
        this._data = {
            "type":"startClass"/*开始课程*/
        }
    }
}

class H5Entity_startPractice_simple extends H5EntityBase{
    constructor(){
        super();
        this._key = "startPractice"
        this._data = {
            "type":"startPractice"/*开始联系*/
        }
    }
}

class H5Entity_H5CourseLoad_simple extends H5EntityBase{
    constructor(){
        super();
        this._key = "H5CourseLoad"
        this._data = {
            "type":"error"/*加载教材失败通知*/
        }
    }
}

class H5Entity_load_simple extends H5EntityBase{
    constructor(){
        super();
        this._key = "load"
        this._data = {
            "type":"error"/*
             错误信息
             error:下载pdf时错误
             memoryOut:展示时内存溢出
             */
        }
    }
}

class H5Entity_animate_simple extends H5EntityBase{
    constructor(){
        super();
        this._key = "animate"
        this._data = {
            "play":"true",/*true false*/
            "path":""/*动画html系统绝对路径*/
        }
    }
}

//-----------聊天相关mode
class H5Entity1v1ChatBase{


    constructor(){
        this._key = ""
        this._data = {
            "play":"true",/*true false*/
            "path":""/*动画html系统绝对路径*/
        }
    }

    get key(){
        return this._key;
    }

    /**
     获取当前数据模型中的数据
     */
    get data(){
        return this._data
    }

    set data(d){
        this._data = d;
    }

    toJSStr(){
        let str = "";
        try{
            str = JSON.stringify(this.data);
            str = transcodingJavascriptMessage(str);
            str = window.MyBase64.encode(str)
        }catch(err){
            console.log("H5EntityBase==>数据封装错误,原因:"+err);
        }
        return str;
    }
}

class H5Entity_1v1chat_init extends H5Entity1v1ChatBase{
    constructor(){
        super();
        this._key = "init"
        this._data = {
            "allBlock":"false",
            "classType":"1v1",
            "id":"799547",/*svc偏移后的id*/
            "is1vNPDF":"false",
            "lang":"Cn",
            "name":"Jarine",
            "type":"tea",
            "headImg":""
        }
    }
}

class H5Entity_1v1chat_sendData extends H5Entity1v1ChatBase{
    constructor(){
        super();
        this._key = "data"
        this._data = {
            "handle":"show",
            "type":"tipInfo"/*可选值为tipInfo  text img tipELRoom*/
        }
    }
}