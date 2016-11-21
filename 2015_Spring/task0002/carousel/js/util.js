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

//绑定点击事件
$.click=function (selector,listener){
    addEvent(selector,"click",listener);
}
//给DOM元素绑定事件处理程序
$.add=function(ele,event,listener){
    if(ele.addEventListener){
        ele.addEventListener(event,listener,false);
    }else{
        ele.attachEvent("on"+event,listener);
    }
}

//事件代理
$.delegateTag=function(selector,tag,eventName,listener){
    addEvent(selector,eventName,function(e){
        var e = arguments[0] || window.event,
        target = e.srcElement ? e.srcElement : e.target;
        if(target.tagName === tag || target.tagName.toLowerCase() === tag){
            listener(e,target);
        }
    });
}

//获取元素在CSS文件中设置的样式
function getCSS(ele,name){
    if (ele) {
        return document.defaultView.getComputedStyle?
            document.defaultView.getComputedStyle(ele,null)[name]:ele.currentStyle[name];
    }
}

//