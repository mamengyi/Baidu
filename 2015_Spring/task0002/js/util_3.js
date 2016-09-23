//兼容
//IE9-不支持数组的indexOf()
if (!Array.prototype.indexOf) {
	Array.prototype.indexOf=function(value){
		for (var i = 0,len=this.length;i<len; i++) {
			if(this[i]==value){
				return i;
			}
		}
		return -1;
	};
}

// 判断arr是否为一个数组，返回一个bool值
function isArray(arr){
	return Array.isArray(arr)||Object.prototype.toString.call(arr) === "[object Array]";
}

//对数组的每项都执行fn(item,index)
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

//去除数组中空的项
function trimArray(arr){
    for (var i = 0; i < arr.length; i++) {
        if(arr[i]==""){ //这里用不用去除空白字符串。
            arr.splice(i,1);
        }
    }
    return arr;
}


// 使用递归来实现一个深度克隆，可以复制一个目标对象，返回一个完整拷贝
// 被复制的对象类型会被限制为数字、字符串、布尔、日期、数组、Object对象。不会包含函数、正则对象等
function cloneObject(src){	
	//数组
	if(isArray(src)){
		var arr = [];
		for(var key in src){
			arr[key]=cloneObject(src[key]);
		}
		return arr;
	}
	//日期
	if (isDate(src)) {
		return new Date(src.valueOf());
		console.log(src.valueOf());
	}
	//对象
	if (typeof src ==="object") {
		var obj = {};
		for(var key in src){
			if (src.hasOwnProperty(key)) {
				obj[key]=cloneObject(src[key]);
			}
		}
		return obj;
	}
	//如果是数字，字符串，布尔，null，undefined，函数(递归的时候会用到)，直接返回
	return src;
}


// 对字符串头尾进行空格字符的去除、包括全角半角空格、Tab等，返回一个字符串
function trim(str){
	//return arr.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/,""); 这样不行，要全局查找
    return str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,"")
}

//去除数组中重复的项
function uniqArray(arr){
    var result=[];
    var hash={};
    for (var i = 0; i < arr.length; i++) {
        var item=arr[i];
        var key=typeof(item)+item;
        if(hash[key]!==1){
            result.push(item);
            hash[key]=1;
        }
    }
    return result;
}

//检查ele是否有className
function hasClass(ele,className){
    if (ele&&ele.className) {
        var classes=ele.className.split(/\s+/);//这里必须要切成数组之后再判断
        if(classes.indexOf(className)!=-1){
            return true;
        } 
    }
    return false;
}

// 为element增加一个样式名为newClassName的新样式
function addClass(ele,newClass){
    if (!hasClass(ele,newClass)) {
        ele.className=ele.className?[ele.className,newClass].join(" "):newClass;
    }
}

// 移除element中的样式oldClassName
function removeClass(ele,oldClass){
    if (hasClass(ele,oldClass)) {
        var arr = ele.className.split(/\s+/);
        for (var i = 0; i < arr.length; i++) {
            if(arr[i]===oldClass){
                arr.splice(i,1);
                break;
            }
        }
        ele.className=arr.join(" ");
    }
}

// 获取element相对于浏览器窗口的位置，返回一个对象{x, y}
function getPosition(ele){
    var left = ele.offsetLeft,
        top = ele.offsetTop,
        scrollx = ele.scrollLeft,
        scrolly = ele.scrollTop;
    while (ele.offsetParent) {
        left += ele.offsetParent.offsetLeft;
        top += ele.offsetParente.offsetTop;
        ele = ele.offsetParent;
    }
    
}

//添加事件
function addEvent(selector,event,listener){
    var ele=$(selector);
    if(ele.addEventListener){
        ele.addEventListener(event,listener,false);
    }else{
        ele.attachEvent("on"+event,listener);
    }
}
//添加事件(给节点)
function addEventToNode(ele,event,listener){
    if(ele.addEventListener){
        ele.addEventListener(event,listener,false);
    }else{
        ele.attachEvent("on"+event,listener);
    }
}
//移除事件
function removeEvent(selector,event,listener){
    var ele=$(selector);
    if(ele.removeEventListener){
        ele.removeEventListener(event,listener,false);
    }else{
        ele.detachEvent("on"+event,listener);
    }
}
function removeNodeEvent(ele,event,listener){
    if(ele.removeEventListener){
        ele.removeEventListener(event,listener,false);
    }else{
        ele.detachEvent("on"+event,listener);
    }
}
//添加点击事件
function addClickEvent(selector,listener){
    addEvent(selector,"click",listener);
}
//添加回车事件
function addEnterEvent(selector,listener){
    addEvent(selector,"keyup",function(e){
        var e = e || window.event;
        var keyCode =event.which || event.keyCode
        if (keyCode == 13) {
            listener(e);
        }
    });
}

//事件代理
function delegateEvent(selector,tag,eventName,listener){
    addEvent(selector,eventName,function(e){
        var e = arguments[0] || window.event,
        target = e.srcElement ? e.srcElement : e.target;
        if(target.tagName == tag || target.tagName.toLowerCase() == tag){
            listener();
        }
    });
}

$.on = addEvent;
$.add = addEventToNode;
$.un = removeEvent;
$.remove=removeNodeEvent;
$.click = addClickEvent;
$.enter = addEnterEvent;
$.delegate = delegateEvent;
//阻止浏览器默认行为
function preventDefault(e){
    if (e&&e.preventDefault) {
        e.preventDefault();
    }else{
        e.returnValue=false;
    }
    return false;
}

//DOM元素选择器
function $(selector){
    var all=selector.split(/\s+/);
    var result = [],rooot=[document];
    for (var i = 0; i < all.length; i++) {
        var type=all[i][0];
        switch(type){
        //ID
        case "#" :
            for (var j = 0; j < rooot.length; j++) {
                var ele=rooot[j].getElementById(all[i].slice(1));
                if (ele) {
                    result.push(ele);
                }
            }
            break;
        
        //class
        case ".":
            for (var j = 0; j < rooot.length; j++) {
                if (document.getElementsByClassName) {
                    var eles=rooot[j].getElementsByClassName(all[i].slice(1));
                    if (eles) {
                        result=result.concat(Array.prototype.slice.call(eles));
                    }
                }else{
                    var arr = rooot[j].getElementsByTagName("*");
                    for (var i = 0; i < arr.length; i++) {
                        if (hasClass(arr[i], className)) {
                            result.push(arr[i]);
                        }
                    }
                }
            }
            break;
        //属性
        case "[":
            var att = all[i].slice(1,all[i].length-1).split("=");
            var key = att[0],value=att[1];
            for (var j = 0; j < rooot.length; j++) {
                var eles=rooot[j].getElementsByTagName("*");
                for (var i = 0; i < eles.length; i++) {
                    if (value) {
                        for (var i = 0; i < eles.length; i++) {
                            if(eles[i].getAttribute(key)==value){
                                result.push(eles[i]);
                            }
                        }
                    }else{
                        for (var i = 0; i < eles.length; i++) {
                            if(eles[i].getAttribute(key)){
                                result.push(eles[i]);
                            }
                        }
                    }
                }
            }
            break;
        //tag
        default:
            for (var j = 0; j < rooot.length; j++) {
                eles=rooot[j].getElementsByTagName(all[i]);
                if (eles) {
                    result=result.concat(Array.prototype.slice.call(eles));
                }
            }
        }//switch
        rooot=result;
        result=[];   
    }//for
    return rooot[0];
}//$


// 设置cookie
function setCookie(cookieName,cookieValue,expiredays){
    var exdate = new Date();
    exdate.setDate(exdate.getDate()+expiredays);
    document.cookie = cookieName + "="+encodeURIComponent(cookieValue)
    +((expiredays==null) ? "" : "; expires="+exdate.toURIString());
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
            return decodeURIComponent(document.cookie.substring(start,end));
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
		xhr = new ActiveXObject("Msxml2.XMLHTTP")|| new ActiveXObject("Microsoft.XMLHTTP");
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
			xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded;charset=UTF-8");
			xhr.send(dataValue);
		}//发送数据
}//ajax

//从数组中移除item
function removeItem(arr,item){
    for (var i = 0; i < arr.length; i++) {
        if (arr[i]===item) {
            arr.splice(i,1);
            break;
        }
    }
}
