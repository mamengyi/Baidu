//需要一个可以选择所有元素的方法
function getElements(selector){
    //类选择器，返回全部项
    if(/\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/.test(selector)){
        if(document.getElementsByClassName){
            return document.getElementsByClassName(selector.slice(1,selector.length));
        }
        var nodes = document.all ? document.all : document.getElementsByTagName('*');
        var arr=[];  //用来保存符合的className；    
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
    if (ele.parentNode) {
        if (str.indexOf(ele.parentNode)>-1) {
            return true;
        }else{
            return isParent(ele.parentNode,str); 
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

// 判断arr是否为一个数组，返回一个bool值
function isArray(arr){
    return Array.isArray(arr)||Object.prototype.toString.call(arr) === "[object Array]";
}

// 对字符串头尾进行空格字符的去除、包括全角半角空格、Tab等，返回一个字符串
function trim(str){
    return str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,"")
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