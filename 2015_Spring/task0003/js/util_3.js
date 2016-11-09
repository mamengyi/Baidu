console.log("util_3");
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

// 判断fn是否为一个函数，返回一个bool值
function isFunction(fn){
    return Object.prototype.toString.call(fn) === "[object Function]";
}

//对数组(类数组对象)的每项都执行fn(item,index)
function each(arr,fn){
    for(var i = 0 , len = arr.length ; i<len ; i++){
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
function toggleClass(ele,className){
    if (hasClass(ele,className)) {
        removeClass(ele,className);
    }else{
        addClass(ele,className)
    }
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
function delegateEventTag(selector,tag,eventName,listener){
    addEvent(selector,eventName,function(e){
        var e = arguments[0] || window.event,
        target = e.srcElement ? e.srcElement : e.target;
        if(target.tagName === tag || target.tagName.toLowerCase() === tag){
            listener(e,target);
        }
    });
}
function delegateEventClass(selector,classname,eventName,listener){
    addEvent(selector,eventName,function(e){
        var e = arguments[0] || window.event,
        target = e.srcElement ? e.srcElement : e.target;
        if(hasClass(target,classname)){
            listener(e,target);
        }
    });
}

$.on = addEvent;
$.add = addEventToNode;
$.un = removeEvent;
$.remove=removeNodeEvent;
$.click = addClickEvent;
$.enter = addEnterEvent;
$.delegateTag = delegateEventTag;
$.delegateClass = delegateEventClass;
$.prevent=preventDefault;
$.stop=stopPropagation;
//阻止浏览器默认行为
function preventDefault(e){
    if (e&&e.preventDefault) {
        e.preventDefault();
    }else{
        e.returnValue=false;
    }
    return false;
}
//阻止事件冒泡
function stopPropagation(e){
    if (e&&e.stopPropagation) {
        e.stopPropagation();
    }else{
        e.cancelBubble = true;
    }
}


//DOM元素选择器
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


//获得元素的CSS样式
function getCSS(ele,name){
    if (ele) {
        return document.defaultView.getComputedStyle?
            document.defaultView.getComputedStyle(ele,null)[name]:ele.currentStyle[name];
    }
}
//判断是否支持ondrag事件
function supportDrag(){ 
    var div = document.createElement('div'); 
    return ('draggable' in div) || ('ondragstart' in div && 'ondrop' in div); 
}

//在升序的表示日期的数组中插入新的一项,返回新数组。
function orderInsert(arr,item){
    var itemNum=Date.parse(item);
    if (!arr[0]) {
        arr.push(item);
        return arr;
    }else if (itemNum<Date.parse(arr[0])) {
        arr.unshift(item);
        return arr;
    }else if(itemNum>Date.parse(arr[arr.length-1])){
        arr.push(item);
        return arr;
    }else{
        var i=Math.floor(arr.length/2);
        while(i){
            if (itemNum<Date.parse(arr[i])) {
                if (itemNum>Date.parse(arr[i-1])) {
                    return insertItem(arr,i,item);
                }else{
                    i=Math.floor(i/2);
                }
            }else{
                if (itemNum<Date.parse(arr[i+1])) {
                    return insertItem(arr,i+1,item);
                }else{
                    i=i+Math.floor(i/2);
                }
            }
        }
    }
}

//在数组的i位置插入一项
function insertItem(arr,i,item){
    var result=arr.slice(0,i);
    result.push(item);
    return result.concat(arr.slice(i));
}

//从storage中获取对象
function getStore(name){
    return JSON.parse(localStorage.getItem(name));
}
//将对象保存到storage中
function setStore(name,obj){
    localStorage.setItem(name,JSON.stringify(obj));
}
//修改storage中的对象
function editStore(name,fn){
    var obj=getStore(name);
    fn(obj);
    setStore(name,obj);
}