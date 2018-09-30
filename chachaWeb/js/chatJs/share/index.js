
var number ;	
var beyond ;
 //学习课程填充
var lesson ;
var timer;
		
var vdays ='0';
var vcources ='0';
var vteacount ='0';

var vteacherid;
var vinfo;

function comm_type_get(datatype, param)
{
	if( datatype == 'ongetacrank')
	{
		number = param;
	}
	else if ( datatype == 'ongetacprecent')
	{
		beyond = param;
	}
	else if ( datatype == 'ongetaclessonindex')
	{
		lesson = param;
		vcources = param;
	}
	else if ( datatype == 'ongetachours')
	{
		timer = param;
	}
	else if ( datatype == 'ongetspeakdays')
	{
		vdays = param;
	}
	else if ( datatype == 'ongetteachercount')
	{
		vteacount = param;
	}
	else if ( datatype == 'ongetacteacherid')
	{
		vteacherid = param;
	}
	else if ( datatype == 'ongetinfo')
	{
		vinfo = param;
	}
	else if ( datatype == 'onLoadApp')
	{
		onloadapp_begin();
	}
}

 function onloadapp_begin()
 {
	var oUl = document.getElementsByTagName('ul')[0];
	var aLi = document.getElementsByTagName('li');
	var aP = document.getElementsByTagName("p");
	var len = aLi.length;
	var pT = "";

	//判断是bigBoy的位置
	var bigBoy = aLi[number];
	bigBoy.className="active";
	if(number > 2 || number < 7){
		pT="transcend";
	}
	if(number <= 2){
		pT="transcend left";
	}
	if(number >= 7){
		pT="transcend right";
	}
	bigBoy.innerHTML = '<div class="'+pT+'">超越了<span>'+ beyond +'</span>的小伙伴</div><div class="star"></div>';

	//bigBoy左边是灰色右边是黄色
	for(var i = 0; i < number; i++){
		aLi[i].className="pass";
	};
	for(var i = number+1; i < len; i++ ){
		aLi[i].className="soon";
	};
	
	aP[1].innerHTML = "这是你在51Talk上的第"+ lesson +"节课，累计开口说英语"+ timer +"小时！"
	cpp_onbd_share_config();
}

$(".head a").click(function() {
	window.AcJs_get('closeacsharewindow','');
});

function cpp_onbd_share_config ()
{
	shareContent = "#51Talk上课打卡#我在51Talk上的第"+vcources+"节课，累计开口说英语"+vdays+"天，与"+vteacount+"位外教对话过，感觉开口说英语变的很简单，小伙伴们跟我一起来吧！"
	
	shareLink = "http://www.51talk.com/app/appraise.php?teacher_id="+vteacherid+"&info="+vinfo+"&completelesson="+vcources+"&timercount="+vdays+"&teachercount="+vteacount;
	window._bd_share_config={"common":{"bdSnsKey":{},"bdText":shareContent,"bdMini":"2","bdMiniList":false,"bdPic":"http://static.51talk.com/images/web_new/home/banner/student1.jpg;http://static.51talk.com/images/web_new/home/banner/index.jpg;http://static.51talk.com/images/web_new/home/show/4.png;http://static.51talk.com/images/web_new/home/show/11_07.png","bdUrl": encodeURI(shareLink),"bdStyle":"0","bdSize":"16"},"share":{}};
	with(document)0[(getElementsByTagName('head')[0]||body).appendChild(createElement('script')).src='./js/share/share.js'];
}
	

