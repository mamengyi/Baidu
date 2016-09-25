//对数组(类数组对象)的每项都执行fn(item,index)
function each(arr,fn){
    for(var i = 0 , len = arr.length ; i<len ; i++){
        fn(arr[i],i);
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
        }
        rooot=result;
        result=[];   
    }
    return rooot[0];
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
//获得元素的CSS样式
function getCSS(ele,name){
    if (ele) {
        return document.defaultView.getComputedStyle?
            document.defaultView.getComputedStyle(ele,null)[name]:ele.currentStyle[name];
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
//阻止浏览器默认行为
function preventDefault(e){
    if (e&&e.preventDefault) {
        e.preventDefault();
    }else{
        e.returnValue=false;
    }
    return false;
}
$.prevent=preventDefault;
$.on = addEvent;
$.add = addEventToNode;
$.un = removeEvent;
$.remove=removeNodeEvent;

//判断是否支持ondrag事件
function supportDrag(){ 
    var div = document.createElement('div'); 
    return ('draggable' in div) || ('ondragstart' in div && 'ondrop' in div); 
}