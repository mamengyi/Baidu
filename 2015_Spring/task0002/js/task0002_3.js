var m={
	getElement:	function(selector){
		var element;
		if (selector.search(/\s/)!=-1) { 
			//判断组合，然后选用不同方法
			//怎么判断？为他们计数。
			var arr=selector.split(" ");
		    var eleClass,eleTag,pos=null,tagNum=0,cNum=0,idNum=0;
		    var outer,inner;
		    for (var i = 0; i < arr.length; i++) {
		    	icon = arr[i].charAt(0);
		    	id = arr[i].substring(1);
		    	switch(icon){
		    		case ".":
			    		eleClass=document.getElementsByClassName(id);
			    		cNum+=1;
			    		break;
			    	case "#":
			    	    element=document.getElementById(id);
			    	    idNum+=1;
			    	    break;
			    	default:
			    	    eleTag=document.getElementsByTagName(arr[i]);
			    	    tagNum+=1;
			    	    break;
		    	}//switch
		    }//for
		    if (tagNum==0 && idNum==1) {
		    	outer=0;
		    	inner=eleClass;
		    }else if(tagNum==1 && idNum==0){
		    	outer=eleTag;
		    	inner=eleClass;
		    }else if(cNum==0){
		    	outer=0;
		    	inner=eleTag;
		    }else{
				var newarr=new Array();
				for (var i = 0; i < arr.length; i++) {
					newarr[i]=arr[i].substring(1);
				}
				element = document.getElementsByClassName(newarr.join(" "))[0];
			   return element;
		    }//if...else
		    
		    if (outer==0) {
		    	for (var i = 0; i < inner.length; i++) {
		    	if (inner[i]===element) {
		    		pos = i;
		    		break;
		    	}
		    }
		    }else{
		    	for (var i = 0; i < outer.length; i++) {
			    	for (var j = 0; j < inner.length; j++) {
			    		if (outer[i]===inner[j]) {
			    		pos = j ;
			    		break;
			    	}
			    	if (pos!=null) {
			    		break;
			    	}
		    	}//for
		    }//for
		    }//if  
		    return inner[pos];
		}else{
			var icon = selector.charAt(0);
			var id = selector.substring(1);
			switch(icon){
			case "#" : // 可以通过id获取DOM对象，通过#标示
	            element = document.getElementById(id); 
				break;
			case "." : // 可以通过样式名称获取DOM对象
				element = document.getElementsByClassName(id)[0];
				break;
			default:  // 可以通过tagName获取DOM对象 (不知道怎么表达第一个是字母)
				element = document.getElementsByTagName(selector)[0]; 
		} //switch
		return element;
		}//else
	},//getElement

	// 给一个element绑定一个针对event事件的响应，响应函数为listener
	on: function (selector,event,listener){
		var element=m.getElement(selector);
		if(element.addEventListener){
			element.addEventListener(event,listener,false);
		}else if(element.attachEvent){
			element.attachEvent("on"+event,listener);
		}else{
			element["on"+event]=listener;
		}
	},//on

	//移除事件
	un: function (selector,event,listener){
		var element=m.getElement(selector);
		if(element.removeEventListener){
			element.removeEventListener(event,listener,false);
		}else if(element.dettachEvent){
			element.detachEvent("on"+event,listener);
		}else{
			element["on"+event]=null;
		}
	},//un

	// 实现对click事件的绑定
	click:	function (selector,listener){
			m.on(selector,"click",listener);
	},//click

	// 实现对于按Enter键时的事件绑定
	enter:	function (element,listener){
			m.on(element,"keyup",function(){
				if (event.keyCode==13) {
					listener();
				}
			});
	},//enter
	delegate: function (element,tag,eventName,listener){
	m.on(element,eventName,function(){
		var event=event ? event : window.event,
	    target = event.target || event.srcElement,
	    tagName=target.nodeName.toLowerCase();
	    if (tagName==tag) { //为什么没有这句话的话，就说target未定义呢?
	    	listener(target);
	    }
	});	
	},//delegate
}//m对象


//为【元素】添加事件
function addEvent(element,event,listener){
	if(element.addEventListener){
		element.addEventListener(event,listener,false);
	}else if(element.attachEvent){
		element.attachEvent("on"+event,listener);
	}else{
		element["on"+event]=listener;
	}
}

function each(arr, fn) {
	var array = new Array();
    for (var i = 0; i < arr.length; i++) {
    	array[i] = fn(arr[i],i);
    }
    return array;
}

//轮播图
m.on(".c-start","click",function(){
	var t = m.getElement(".t").value;
	carousel(t);
});
function carousel(t){
	var width = 1200;
	var box = m.getElement(".carousel-box");
	var btns = m.getElement(".carousel-btn").getElementsByTagName("a");
	for (var i = 0; i < btns.length; i++) {
	    	btns[i].index = i;
	    }//这里也好喜欢自己。
	m.delegate(".carousel-btn","a","click",function(target){
	    //怎么让其他的active为null？
	    each(btns,function(item, index){
	    	item.className=null;
	    });//each
	    //啊啊啊啊啊天了噜，我好喜欢自己。
		target.className="active";
		box.style.left = -width * target.index +"px";
	});//delegate
	var event = document.createEvent("MouseEvents");
	event.initMouseEvent("click",true,true,document.defuatView);
	//点击第一个元素，然后隔两秒点击第二个
    function change(){
		each(btns,function(item, index){
			var num = (m.getElement(".backward").checked) ? btns.length-index : index;
			setTimeout(function(){
				item.dispatchEvent(event)
			},t*num*1000);
		});//each
		setTimeout(function(){
			if (m.getElement(".circle").checked) {
				change();
			}
		},t*i*1000);//如果在一次循环结束前没选循环，也无法在进入循环了
		
		//注意注意，想要给每个元素执行函数时记得直接想到each
		//不要再傻傻的试过for循环不行之后再想到each。
	}//change
	//不选方向的话就默认正向轮播。如果中途换方向的也要等到下一轮才能改。
	//而且，不会从点击的图继续轮播，只能按照自己的顺序走。
		change();
}//carousel
//缺点就是从右向左的时候先显示第一张，过两秒才开始循环。
//如果中途改掉间隔时间会彻底乱掉。
