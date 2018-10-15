//将utils定义为window对象下的一个属性，属性值为对象
window.utils = {};
 
//requestAnimationFrame的兼容问题，
if(!window.requestAnimationFrame){
    window.requestAnimationFrame =(window.webkitRequestAnimationFrame||
                                   window.mozRequestAnimationFrame||
                                   window.oRequestAnimationFrame||
                                   window.msRequestAnimationFrame||
                                   function(callback){
                                       return window.setTimeout(callback,1000/60); 
                                 });    
}
 
//在utils对象上定义鼠标捕获坐标的方法
window.utils.captureMouse = function(element){
 	//定义一个名为mouse的对象
 	var mouse = {x:0,y:0};
 	//为元素绑定mouseOver事件
 	element.addEventListener("mousemove",function(event){
 		var x,y;
 		//获取鼠标位于当前屏幕的位置，并做兼容处理
 		if(event.pageX||event.pageY){
 			x = event.pageX;
 			y = event.pageY;
 		}else{
 			x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
 			y = event.clientY + document.body.scrollTop +document.documentElement.scrollTop
 		}
 		//将当前的坐标值减去元素的偏移位置，即为鼠标位于当前canvas的位置
 		x -= element.offsetLeft;
 		y -= element.offsetTop;
 		
 		mouse.x = x;
 		mouse.y = y;
 	},false);
 	return mouse;
};

//在utils对象上定义触摸位置的方法
window.utils.captureTouch = function(element){
	var touch = {
		x:null,					//x坐标
		y:null,					//y坐标
		isPressed:false,		//是否开始触摸
		event:null				//事件对象
	};
	var body_scrollLeft 	= document.body.scrollLeft;				//对象左边界和窗口中目前可见内容的最左端之间的距离
		element_scrollLeft 	= document.documentElement.scrollLeft; 	//兼容性处理
		body_scrollTop 		= document.body.scrollTop;				//对象最顶端和窗口中可见内容的最顶端之间的距离
		element_scrollTop 	= document.documentElement.scrollTop;	//兼容性处理
		offsetLeft 			= element.offsetLeft;					//当前元素的左偏移
		offsetTop			= element.offsetTop;					//当前元素的上偏移
	// 绑定touchstart事件
  	element.addEventListener('touchstart', function(event){
    	touch.isPressed = true;		
        touch.event = event;
  	}, false);
  	// 绑定touchend事件
  	element.addEventListener('touchend', function(event){
        touch.isPressed = false;
        touch.x = null;
        touch.y = null;
        touch.event = null;
  	}, false);
  	//绑定touchmove事件
  	element.addEventListener("touchmove", function(event){
  		var x,
  			y,
  			touch_event = event.touches[0];//第一次touch
  		if (touch_event.pageX || touch_event.pageY) {
          	x = touch_event.pageX;
          	y = touch_event.pageY;
        }else{
          	x = touch_event.clientX + body_scrollLeft + element_scrollLeft;
          	y = touch_event.clientY + body_scrollTop + element_scrollTop;
        }	
        //减去偏移量
        x -= offsetLeft;
        y -= offsetTop;
        
        touch.x = x;
        touch.y = y;
        touch.event = event;
  	}, false);
	return touch;
};
