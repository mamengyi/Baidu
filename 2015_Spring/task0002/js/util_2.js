// 判断arr是否为一个数组，返回一个bool值
function isArray(arr){
	return Object.prototype.toString.call(arr) === "[object Array]";
}

// 判断fn是否为一个函数，返回一个bool值
function isFunction(fn){
	return Object.prototype.toString.call(fn) === "[object Function]";
}

// 判断date是否为一个日期对象，返回一个bool值
function isDate(date){
    return Object.prototype.toString.call(date) ==="[object Date]";
}


// 使用递归来实现一个深度克隆，可以复制一个目标对象，返回一个完整拷贝
// 被复制的对象类型会被限制为数字、字符串、布尔、日期、数组、Object对象。不会包含函数、正则对象等
function cloneObject(src){
	//如果是数字，字符串，布尔，直接返回
	if (typeof src === "number"|| typeof src === "string" || typeof src === "boolean") {
		return src.valueOf();
	}
	//数组
	if(isArray(src)){
		var arr = [];
		for (var i = 0; i < src.length; i++) {
			arr[i] = src[i];
		}
		return arr;
	}
	//日期
	if (isDate(src)) {
		return new Date(src.valueOf());
	}
	//对象
	if (typeof src ==="object") {
		var obj = {};
		for(var key in src){
			if (isArray(src[key])|| typeof src[key] === "object") {
				obj[key]=cloneObject(src[key]);
			}else{
				obj[key] = src[key];
			}
		}
		return obj;
	}
}

// 对数组进行去重操作，只考虑数组中元素为数字或字符串，返回一个去重后的数组
function uniqArray(arr){
    if(!isArray(arr)){
        return arr;
    }
    var new_array = [];
    for(var i = 0 ; i < arr.length ; i++){
        if (new_array.indexOf(arr[i]) < 0 ) {
            new_array.push(arr[i]);
        };
    }
    return new_array;
}

// 对字符串头尾进行空格字符的去除、包括全角半角空格、Tab等，返回一个字符串
// 先暂时不要简单的用一句正则表达式来实现
function trim(str){
	if (str[0].search(/\s/)>-1) {
		str = trim(str.substring(1));
	}
	if (str[str.length-1].search(/\s/)>-1) {
		str = trim(str.substring(0,str.length-1));
	}
	return str;
}

// 实现一个遍历数组的方法，针对数组中每一个元素执行fn函数，并将数组索引和元素作为参数传递
function each(arr,fn){
    if(!isArray(arr)){
        return false;
    }
    if(!isFunction(fn)){
        return false;
    }
    for(var i = 0 ; i < arr.length ; i++){
        fn(arr[i],i);
    }
}


// 获取一个对象里面第一层元素的数量，返回一个整数
function getObjectLength(obj){
	if (typeof obj === "object") {
		var count = 0;
		for(var key in obj){
			count++;
		}
		return count;
	}
}

// 判断是否为邮箱地址
function isEmail(email){
	var pattern = /^[\w-]+@\w+(\.\w{1,3}){1,2}$/;
	return pattern.test(email);
}

// 判断是否为手机号
function isPhone(phone){
	var pattern = /1[3458]\d{9}/;
	return pattern.test(phone);
}

// 为element增加一个样式名为newClassName的新样式
function addClass(ele,newClass){
    if(ele.classList){
    	ele.classList.add(newClass);
    }else{
	    ele.newClass = ele.newClass + " " + newClass;
    }
}

// 移除element中的样式oldClassName
function removeClass(ele,oldClass){
	if(ele.classList){
		ele.classList.remove(oldClass)
	}else{
		var old = new RegExp("\\s|^"+oldClass+"\\s|$");
		ele.className.replace(old," ");
	}
}

// 判断siblingNode和element是否为同一个父元素下的同一级的元素，返回bool值


// 获取element相对于浏览器窗口的位置，返回一个对象{x, y}


//判断一个元素在不在一个数组里面
function inArray(ele,arr){
	if (!isArray(arr)) {
		return false;
	}
	for (var i = 0; i < arr.length; i++) {
		if(arr[i] = ele){
			return true;
			break;
		}
	}
	return false;
}


//把一个类数组转换成数组
function toArray(obj){
    if (obj.nodeType == 1 ) {
        return [obj];
    }
    var arr = [];
    for( var i = 0 ; i < obj.length ; i++){
        arr.push(obj[i]);
    }
    return arr;
}



// 实现一个简单的Query
function getElements(selector){
    //类选择器，返回全部项
    if(/\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/.test(selector)){
        if(document.getElementsByClassName){
            return document.getElementsByClassName(selector.slice(1,selector.length));
        }
        var nodes = document.all ? document.all : document.getElementsByTagName('*');
        var arr=[];//用来保存符合的className；    
        for(var i=0;i<nodes.length;i++){
            if(hasClass(nodes[i],selector.slice(1,selector.length))){
                arr.push(nodes[i]);
            }
        }
        return arr;
    }

    //ID选择器
    if(/#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/.test(selector)){
        return document.getElementById(selector.slice(1,selector.length));
    }


    //tag选择器
    if(/^((?:[\w\u00c0-\uFFFF\-]|\\.)+)/.test(selector)){
        return document.getElementsByTagName(selector);
    }

    //属性选择器
    if(/^\[[A-Za-z0-9_-\S]+\]$/.test(selector)){
        selector = selector.slice(1,selector.length-1);
        var eles = document.getElementsByTagName("*");
        selector = selector.split("=");
        var att = selector[0];
        var value = selector[1];
        var arr = []; 
        if (value) {
            for (var i = 0; i < eles.length; i++) {
                if(eles[i].getAttribute(att)==value){
                   arr.push(eles[i]);
                } 
            }
        }else{
            for (var i = 0; i < eles.length; i++) {
                if(eles[i].getAttribute(att)){
                    arr.push(eles[i]);
                } 
            }
        }
        return arr;
    }
}

//检查ele的祖先对象是否符合选择器
function isParent(ele,str){
    if (!isArray(str)) {
        str = toArray(str);
    }
    //console.log(ele);
    //console.log(ele.parentNode);
    //console.log(str);
    if (ele.parentNode) {
        if (str.indexOf(ele.parentNode)>-1) {
            //console.log("true");
            return true;
        }else{
            return isParent(ele.parentNode,str);  //这里，关键问题，卡了好多小时的问题
        }
    }else{
        return false;
    }
}

//从eles中删掉祖先对象不符合选择器的对象
function fliterEles(eles,str){
    if(!isArray(eles)){
            eles = toArray(eles);
    }
    for (var i = 0; i < eles.length; i++) {
        //console.log(isParent(eles[i],str))
        if (!isParent(eles[i],str)) {
            eles.splice(i,1);
            i = i - 1;
        }
    }
    return eles;
}


//DOM元素选择器
function $(selector){
    if(!typeof selector === "string"){
        return false;
    }

    //复合选择器
    if(trim(selector).split(" ").length > 1){
        var all = trim(selector).split(" ");
        var eles = getElements(all[all.length-1]);
        for(var i = 2 ; i < all.length+2 && all.length-i >=0; i++){
            eles = fliterEles(eles,getElements(all[all.length-i]));
        }
        return eles[0];
    }


    //ID选择器
    if(/#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/.test(selector)){
        return document.getElementById(selector.slice(1,selector.length));
    }


    //tag选择器，只返回第一个
    if(/^((?:[\w\u00c0-\uFFFF\-]|\\.)+)/.test(selector)){
        return document.getElementsByTagName(selector)[0];
    }

    //类选择器
    if(/\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/.test(selector)){
        if(document.getElementsByClassName){
            return document.getElementsByClassName(selector.slice(1,selector.length))[0];
        }
        var nodes = document.all ? document.all : document.getElementsByTagName('*');
        for(var i=0;i<nodes.length;i++){
            if(hasClass(nodes[i],selector.slice(1,selector.length))){
                return nodes[i];
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
}

//添加事件
function addEvent(selector,event,listener){
	var ele=$(selector);
	if(ele.addEventListener){
		ele.addEventListener(event,listener,false);
	}else if(ele.attachEvent){
		ele.attachEvent("on"+event,listener);
	}else{
		ele["on"+event]=listener;
	}
}
//移除事件
function removeEvent(selector,event,listener){
	var ele=m.getElement(selector);
	if(ele.removeEventListener){
		ele.removeEventListener(event,listener,false);
	}else if(ele.dettachEvent){
		ele.detachEvent("on"+event,listener);
	}else{
		ele["on"+event]=null;
	}
}
//添加点击事件
function addClickEvent(selector,listener){
	addEvent(selector,"click",listener);
}
//添加回车事件
function addEnterEvent(selector,listener){
	addEvent(selector,"keyup",function(){
		var e = event || widow.event || arguments.callee.caller.arguments[0];
		if (e.keyCode == 13) {
			listener();
		}
	});
}
//事件代理
function delegateEvent(selector,tag,eventName,listener){
	addEvent(ele,eventName,function(){
        var e = arguments[0] || window.event,
        target = e.srcElement ? e.srcElement : e.target;
        if(target.tagName == tag || target.tagName.toLowerCase() == tag){
            listener();
        }
    });
}

$.on = addEvent;
$.un = removeEvent;
$.click = addClickEvent;
$.enter = addEnterEvent;
$.delegate = delegateEvent;



// 判断是否为IE浏览器，返回-1或者版本号
function isIE(){
    //只有IE支持ActiveX控件
    if(window.ActiveXObject||"ActiveXObject" in window){
        return navigator.userAgent.slice(8,11);
    }else{
        return -1;
    }
}

// 设置cookie
function setCookie(cookieName,cookieValue,expiredays){
	var exdate = new Date();
	exdate.setDate(exdate.getDate()+expiredays);
	document.cookie = cookieName + "="+escape(cookieValue)
	+((expiredays==null) ? "" : "; expires="+exdate.toGMTString());
}

//取出cooKie
function getCookie(cookieName){
	if(document.cookie.length >0){
		var start = document.cookie.indexOf(cookieName+"=");
		if(start!= -1){
			start = start+cookieName.length+1;
			var end = document.cookie.indexOf(";",start);
			if (end == -1) {
				end = document.cookie.length;
			}
			return unescape(document.cookie.substring(start,end));
		}else{
			return "查无此人";
		}
	}else{
		return "没有找到";
	}
}

//异步加载
function ajax(url,options){
	var xmlhttp, dataValue="";
	if (typeof options.data=="object") {
			for (var p in options.data) {
				dataValue += p +"="+options.data[p]+"&"; 
			}
		}else{
			dataValue = options.data;
		}//统一格式
	if(window.XMLHttpRequest){
		xhr = new XMLHttpRequest();
	}else{
		xhr = new ActiveXObject("Microsoft.XMLHTTP");
	}
	xhr.onreadystatechange=function(){
		if(xhr.readyState==4 && xhr.status==200){
			options.onsuccess(xhr.responseText);
		}else{
			options.onfail(xhr.responseText, xhr.status);
		}
	}//onreadystatechange
	if (options.type=="GET") {
			xhr.open("GET",url+"?"+dataValue,true);
			xhr.send();
		}else{
			xhr.open("POST",url,true);
			xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
			xhr.send(dataValue);
		}//发送数据
}//ajax
