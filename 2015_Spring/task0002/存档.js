switch(icon){
		case "#" : // 可以通过id获取DOM对象，通过#标示
            element = document.getElementById(id); 
			break;
		case "." : // 可以通过样式名称获取DOM对象
			element = document.getElementsByClassName(id)[0];
			break;
		default:  // 可以通过tagName获取DOM对象 (不知道怎么表达第一个是字母)
			element = document.getElementsByTagName(selector)[0]; 
	} 
	return element;

	//这是掉过的坑
	if (selector.search(/\s/)!=-1) {
		var arr=selector.split(" ");
		var elements,pos;
		for (var i = 0; i < arr.length; i++) {
			id = arr[i].substring(1);
			icon = arr[i].charAt(0);
			if (icon=="#") {
				element = document.getElementById(id);
			}else if(icon=="."){
				pos = arr[i].substring(1);
			}
		}
		
	}

options.date.replace("=",":");//这里陷入一个误区，非要把对象转换成字符串，其实就用他的属性也是可以做到的。
options.date.replace(",","&");

	function addEnterEvent(element,listener){
	addEvent(element,"keydown",function(){
		if (event.keyCode==13) {
			addEvent(element,"keyup",listener);
		}//但是只要按过一次回车，就会把事件加上，以后按什么都这样了。
	});
}

//突然想到应该用事件代理
each(btns,function(item, index){
		addEvent(item,"click",function (){
			//怎么能让其他元素的active消失呢？
			item.className="active";
			box.style.left = -width * index+"px";
		});//addEvent
	});//each

	//返回几个类名组合
		var arr=selector.split(" ");
		var newarr=new Array();
		for (var i = 0; i < arr.length; i++) {
			newarr[i]=arr[i].substring(1);
		}
		element = document.getElementsByClassName(newarr.join(" "))[0];
	   return element;
	   //为了和他们一样，其实也能用双循环？但是就限定于两个类了，还是不要了。

	//返回类名和ID的组合，
	    //其实我觉得这题目有问题，ID肯定是一个呀，怎么会是两个呢
	    //开始陷入的误区是再循环里面进行操作
	    //之后想先用ID筛选出来，然后在晒出来的元素中选class，但其实只能在【某个】元素的【后代】中选
	    //现在想用class晒出来的数组中第一个和ID元素相等的元素就是了。
	    //试验了一下，div不等于div，所以返回true的应该就是同一个元素。
	    var arr=selector.split(" ");
	    var elements,pos;
	    for (var i = 0; i < arr.length; i++) {
	    	icon = arr[i].charAt(0);
	    	id = arr[i].substring(1);
	    	switch(icon){
	    		case ".":
		    		elements=document.getElementsByClassName(id);
		    		break;
		    	case "#":
		    	    element=document.getElementById(id);
		    	    break;
	    	}//switch
	    }//for
	    for (var i = 0; i < elements.length; i++) {
	    	if (elements[i]===element) {
	    		pos = i;
	    		break;
	    	}
	    }
	    return elements[pos];

	    


	    //返回tag和class组合
	    //双循环，但是当里层条件满足时怎么跳出外层循环呢？
	    //可以让里层传递给外层一个判断条件。
	    var arr=selector.split(" ");
	    var elements,pos=null;
	    for (var i = 0; i < arr.length; i++) {
	    	icon = arr[i].charAt(0);
	    	id = arr[i].substring(1);
	    	switch(icon){
	    		case ".":
		    		eleClass=document.getElementsByClassName(id);
		    		break;
		    	default:
		    	    eleTag=document.getElementsByTagName(arr[i]);
		    	    break;
	    	}//switch
	    }//for
	    for (var i = 0; i < eleTag.length; i++) {
	    	for (var j = 0; j < eleClass.length; j++) {
	    		if (eleTag[i]===eleClass[j]) {
	    		pos = j;
	    		break;
	    	}
	    	if (pos!=null) {
	    		break;
	    	}
	    	}//for
	    }//for
	    return eleClass[pos];

	    //返回tag和ID的组合
	    var arr=selector.split(" ");
	    var elements,pos;
	    for (var i = 0; i < arr.length; i++) {
	    	icon = arr[i].charAt(0);
	    	id = arr[i].substring(1);
	    	switch(icon){
		    	case "#":
		    	    element=document.getElementById(id);
		    	    break;
		    	default:
		    		eleTag=document.getElementsByTagName(arr[i]);
		    		break;
	    	}//switch
	    }//for
	    for (var i = 0; i < eleTag.length; i++) {
	    	if (eleTag[i]===element) {
	    		pos = i;
	    		break;
	    	}
	    }
	    return eleTag[pos];


console.log(w(".cc .dd")); //class+class通过
console.log(document.querySelector(".cc.dd"));

console.log(w("#pp .dd")); //id+class没通过
console.log(document.querySelector("#pp.dd"));
//因为id只有一个，不放在数组里，outer[0]=undefined
//那怎么办呢？只能不进入一循环，要想进入两个循环，还是要有标记。
//然后就OK了

console.log(w("#pp p")); //tag+id没通过
console.log(document.querySelector("p#pp"));

console.log(w(".p p")); //tag+class通过
console.log(document.querySelector("p.p"));


m.on(element,eventName,function(){
		var event=event ? event : window.event,
	    target = event.target || event.srcElement,
	    tagName=target.nodeName.toLowerCase();
	    if (tagName==tag) { //为什么没有这句话的话，就说target未定义呢?
	    	listener(target);
	    }
	});	

element=w(selector)

//封装了很多事件方法的对象
var w = {
	//获取元素
	getElement: function(selector){
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
		var element = w.getElement(selector);  //有没有什么办法省略这一句？让传进来的selector自动转换？
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
		var element = w.getElement(selector);
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
		    var element = w.getElement(selector);
			w.on(element,"click",listener);
	},//click

	// 实现对于按Enter键时的事件绑定
	enter:	function (selector,listener){
			var element = w.getElement(selector);
			w.on(element,"keyup",function(){
				if (event.keyCode==13) {
					listener();
				}
			});
	},//enter
	delegate: function (selector,tag,eventName,listener){
		var element = w.getElement(selector);
	w.on(element,eventName,function(){
		var event=event ? event : window.event,
	    target = event.target || event.srcElement,
	    tagName=target.nodeName.toLowerCase();
	    if (tagName==tag) { //为什么没有这句话的话，就说target未定义呢?
	    	listener(target);
	    }
	});	
	},//delegate
}//m对象


//这就是等于换个地方调用函数了，只能传入函数名！
//要传参数的话可以包裹在一个函数里
m.on(".search","click",cue(suggestData));

//li没有focus，a也没有。
for (var i = 0; i < data.length; i++) {
			var li = document.createElement("li");
			var a = document.createElement("a");
			li.appendChild(a);
			a.appendChild(document.createTextNode(da只是我忘ta[i]));
			fragment.appendChild(li);
		}


//然后自定义放置目标
	m.preventDefault(".container","dragenter");
	m.preventDefault(".container","dragover");
//这个是没问题的，只是我忘了这个方法是对第一个.container元素执行的。


	//先让box可以被拖动,且获得被拖动的元素。
	var boxes = document.getElementsByClassName("box");
	each(boxes,function(item,index){
		item.draggable = true;
		//移动时在原容器中消失
		item.addEventListener("drag",function(){
			var event=event ? event : window.event,
		    target = event.target || event.srcElement;
		    target.style.display = "none"; 
		},true);
		item.addEventListener("dragend",function(){
			var event=event ? event : window.event,
		    target = event.target || event.srcElement;
			target.style.display = "block";
			//处理被拖动的元素
			m.on(".container1","drop",function(){
				m.getElement(".container1").appendChild(target);
				console.log(target);
				console.log("往1中");
			});
			m.on(".container2","drop",function(){
				m.getElement(".container2").appendChild(target);
				console.log(target);
				console.log("往2中");
			});
		},true);
	});
	//怎么不动了？

console.log(Date.parse(time));
	if ((arr[0]%100!=0 && arr[0]%4==0)||arr[0]%400==0) {
		arr[0]=366;
	}else{
		arr[0]=365;
	}
	var year = Math.floor(interval/(arr[0]*24*60*60));
	switch(arr[1]){
		case 02:
			arr[1]=arr[0]-337;
			break;
		case 04:
		case 06:
		case 09:
		case 11:
			arr[1]=30;
			break;
		default:
			arr[1]=31;
	}
	var month = (Math.floor(interval/(arr[1]*24*60*60)))%12;
	var day = Math.floor(interval/(24*60*60));
	var hour = Math.floor(interval/(60*60));
	//我输了，今年是闰年，也不能把间隔的每一年当做闰年
	//这个月是1月，不能把间隔的每个月都当31天。

	year = date.getFullYear(),
		month = date.getMonth()+1,
		day = date.getDate(),
		hour = 23-date.getHours(),
		minute = 59-date.getMinutes(),
		second = 59-date.getSeconds();
		if (arr[2]-1<day) {
			arr[1] = arr[1]-1;
			switch(arr[1]){
				case 02:
					if ((arr[0]%100!=0 && arr[0]%4==0)||arr[0]%400==0) {
						day = arr[2]-1+29-day;
					}else{
						day = arr[2]-1+28-day;
					}
					break;
				case 04:
				case 06:
				case 09:
				case 11:
					day = arr[2]-1+30-day;
					break;
				default:
					day = arr[2]-1+31-day;
			}//switch
		}else{
			day = arr[2]-1-day;
		}//日

		if (arr[1]<month) {
			arr[0] = arr[0]-1;
			month = arr[1]+12-month;
		}else{
			month = arr[1]-month;
		}//月

		year = arr[0]-year;
		var countdown = "距离"+arr0+"年"+arr1+"月"+arr[2]
		+"日还有"+year+"年"+month+"月"+day+"天"+hour+"小时"+minute+"分钟"+second+"秒";
		//完全审错题，人家让算的是剩下的天数，而每天的秒数是固定的
		//不过至少我是知道了这个的难度，也知道就算要先是年数要怎么办。


var type=trim(selector).charAt(0);
switch(type){
    case ".":
		//class选择器
	case "#":
	    //id选择器
	case "[":
		//属性选择器
	default:
	    //tag选择器
}


//ID选择器
return document.getElementById(selector.slice(1,selector.length));
//tag选择器
return document.getElementsByTagName(selector)[0];
//类选择器
if(document.getElementsByClassName){
    return document.getElementsByClassName(selector.slice(1,selector.length))[0];
}else{
	var nodes = document.all ? document.all : document.getElementsByTagName('*');
	for(var i=0;i<nodes.length;i++){
	    var classes=nodes[i].className.split(/\s+/);
	        if(classes.indexOf(selector.slice(1))!=-1){ //indexOf不兼容，需要在原型上扩展
	            return nodes[i];
	            break;
	        } 
	    }
	}    
}



//属性选择器
if(/^\[[A-Za-z0-9_-\S]+\]$/.test(selector)){
    selector = selector.slice(1,selector.length-1);
    var eles = document.getElementsByTagName("*");
    selector = selector.split("=");
    var att = selector[0];
    var value = selector[1];
    if (value) {
        for (var i = 0; i < eles.length; i++) {
            if(eles[i].getAttribute(att)==value){
                return eles[i];
            } 
        }
    }else{
        for (var i = 0; i < eles.length; i++) {
            if(eles[i].getAttribute(att)){
                return eles[i];
            } 
        }
    }
}
