var src=[1,2,3,4,5];
var arr=cloneObject(src);
src[0]=100;
console.log(src[0]);
console.log(arr[0]);


function fn() {};
var result=isFunction(fn);

var srcObj = {
    a: 1,
    b: {
        b1: ["hello", "hi"],
        b2: "JavaScript"
    }
};
var abObj = srcObj;
var tarObj = cloneObject(srcObj);

srcObj.a = 2;
srcObj.b.b1[0] = "Hello";

console.log(tarObj);



//判断arr是否为一个数组，返回一个bool值
function isArray(arr){
	return Array.isArray(arr);
}
var testee = { splice: 1, join: 2 };
console.log("是数组吗："+ isArray(testee)); // true
//判断fn是否为一个函数，返回一个bool值
function isFunction(fn){
	return (typeof fn === "function");
}

//使用递归来实现一个深度克隆，可以复制一个目标对象，返回一个完整拷贝
//被复制的对象类型会被限制为数字、字符串、布尔、日期、数组、Object对象。不会包含函数、正则对象等
function cloneObject(src){
	//先判断类型，不同类型用不同的方法复制
	//如果是数字，字符串，布尔，直接返回
	if (typeof src === "number"|| typeof src === "string" || typeof src === "boolean") {
		return src;
	}
	//如果是日期、数组、对象,返回一个有相同值的新对象
	if (isArray(src)){
		var arr= new Array();
		for (var i = 0; i < src.length; i++) {
			arr[i]=src[i];
		}
		return arr;
	}
	else if (typeof src === "object") {
		//我想把对象变成字符串，然后放到数组里，然后取出值赋给新对象，但是
		//对对象的value使用slice时会出错。
		//我不知道怎么遍历一个对象的所有属性，然后把值赋给另一个对象。
		//知道了用for in遍历对象中的属性
		//后来犯了一个错就是没有定义变量，直接复制给对象，是不行的。
		//obj[name]=value.要先定义name和value。然后对象自然就拥有了属性和相应的值。
		//现在的思路是，如果遍历到的属性值是一个对象，那就继续遍历这个对象，把这个对象的属性值赋给返回对象。
		//!这里应该想到递归。
		//问题出在无法将这个对象的属性值赋给返回对象，说是undefined。
		var obj = new Object();
		var object = src;
		for(var p in object){
			if(typeof object[p] === "object"){
				var name = p;
				for(var q in object[p]){
					var subname = q;
					var subvalue = object[p][q];
					var subobj= new Object();
					subobj[subname] = subvalue;
					obj[name]=subobj[subname];
				}
			}else{
				var name = p;
				var value = object[p];
				obj[name] = value;
			}

		}
		return obj;
	}
}

// 对数组进行去重操作，只考虑数组中元素为数字或字符串，返回一个去重后的数组
//创建一个新的数组，先放进一项，之后要放都和新数组的[每项]比较，不相等就放进去。
function uniqArray(arr){
	var array = new Array();
	var index=1;
	array[0]=arr[0];
	for(var i=1;i<arr.length;i++){
			if(array.every(function(item,idex,array){
				return item !== arr[i];
			})){
				array[index]=arr[i];
				index++;
			}
	}
	return array;
}
var a = ["zhongyu", "hao", "zuo", "hao", "le", "zuo"];
var b = uniqArray(a);
console.log(b); // [1, 3, 5, 7]


//for (var j = 0,len=array.length; j < len; j++) {
//if(arr[i] === array[j]){ //这里应该是，arr[i]不等于每一项array[j]
//				break;
//			}else{
//				array[index]=arr[i];
//				index++;
//			}
//		}
//终于找到症结了，是要和每一项比较，我之前的方法只是和其中一项，任一项合格就合格了。

// 中级班同学跳过此题
// 实现一个简单的trim函数，用于去除一个字符串，头部和尾部的空白字符
// 假定空白字符只有半角空格、Tab
// 练习通过循环，以及字符串的一些基本方法，分别扫描字符串str头部和尾部是否有连续的空白字符，并且删掉他们，最后返回一个完成去除的字符串
//怎么在字符串上创建循环？直接用trim也是可以的呀。
function simpleTrim(str) {
  
}

// 很多同学肯定对于上面的代码看不下去，接下来，我们真正实现一个trim
// 对字符串头尾进行空格字符的去除、包括全角半角空格、Tab等，返回一个字符串
// 尝试使用一行简洁的正则表达式完成该题目
//在字符串中寻找空格，返回这个位置，如果这个位置是字符串的开头，那就从此处剪切，如果不是，就切到这位置之前。
function trim(str) {
	str.replace(/\t/g,"\s"); //果真要用相应的符号表示。
	str.replace(/\u3000/g,"\s");　//现在问题是，没有这两句结果也是一样的。
    for(var i=0;i<str.length;i++){
    	var index=str.search(/\s/);
	    if (index==0) {
		    newstr = str.substring(1);
		    str = newstr;
	    }else{
	    	newstr = str.substring(0,index);
	    	break;
	    }   
    }
    return newstr;
}
//这个有问题，如果中间有空白的话，空白后面的内容就没了。

var str = ' 	　  hi! 　 ';
str = trim(str);
console.log(str); // 'hi!'
console.log(str.length);

// 实现一个遍历数组的方法，针对数组中每一个元素执行fn函数，并将数组索引和元素作为参数传递
//这里关键是要可以给函数传递参数。
//这里传进来的函数名是指向函数的指针（就是个变量），而函数本身可以作为值。
//像函数传递参数，就像是在外面调用它一样。实际上你开始的思路里已经给函数传递了参数，现在多加一个就好了。
function each(arr, fn) {
    for (var i = 0; i < arr.length; i++) {
    	fn(arr[i],i);
    }
}
//但是奇怪的事情发生了，就算不给他传入函数名，仅仅传入一个匿名函数，他还是可以用。
//这是因为他把函数赋给了fn吧，之前是把函数名赋给fn，然后他们指向同一个函数。
//现在是直接把函数赋给fn,fn就指向了函数。

// 其中fn函数可以接受两个参数：item和index
// 使用示例
var arr = ['java', 'c', 'php', 'html'];
function output(item) {
    console.log(item)
}
each(arr, output);  // java, c, php, html

// 使用示例
var arr = ['java', 'c', 'php', 'html'];

each(arr, function (item, index) {
	console.log(index+":"+item);
});  // 0:java, 1:c, 2:php, 3:html


// 获取一个对象里面第一层元素的数量，返回一个整数
//就是遍历属性然后返回长度喽？
function getObjectLength(obj){
	if (!typeof obj === "string") {
		return false;
	}
	var sum=0;
	for(var p in obj){
		sum++;
	}
	return sum;
}

// 使用示例
var obj = {
    a: 1,
    b: 2,
    c: {
        c1: 3,
        c2: 4
    }
};
console.log(getObjectLength(obj)); // 3

var object = "new Object()";
console.log(getObjectLength(object));
// 判断是否为邮箱地址
//邮箱地址的特点：前面一串数字或字母+@+字母+.+字母。
function isEmail(emailStr) {
    var pattern=/\w@\w*\.\w/; //\w表示匹配包括下划线的任何单词字符。等价于'[A-Za-z0-9_]'
    var pattern1=/\w@\w*\.[a-z]/;  //但也许有的邮箱后面带数字呢，反正正则表达式的重点就是归纳总结找到最抽象的模式。
    return pattern1.test(emailStr);
}

// 判断是否为手机号
//手机号特点：11位纯数字
//不只是这个限制，还有什么号段之类的说明
//感觉正则表达式是一种语言啊，比如(d{8})$表明以8个数字结尾
//这些可怎么学，是JS的范围吗？反正书里只介绍基本方法，没说怎么表达
//他有一些元字符，好像用这些元字符组合起来就可以表达一切了。
function isMobilePhone(phone) {
    var pattern=/^(13[0-9]{9})|(15[89][0-9]{8})$/;
    return pattern.test(phone);
}
var email="708833607@qq.com";  //这个邮箱的不好，这明显不是邮箱嘛。应该改成a-z.
console.log(isEmail(email)); 

var phone="15811506631";
console.log(isMobilePhone(phone));

// 为element增加一个样式名为newClassName的新样式
function addClass(element, newClassName) {
    //element.classList.add(newClassName);
    element.className=element.className +" "+ newClassName;
    //如果之前没有类，就会多个空格，可以用if判断一下。
}
var div=document.getElementById("div1");
addClass(div,"red");
removeClass(div,"m")
console.log(div.className);

// 移除element中的样式oldClassName
function removeClass(element,oldClass){
	//element.classList.remove(oldClass);
	//将字符串分割成数组，然后遍历数组找到oldClass，
	//删掉，再重新拼成字符串，给element.className
	var className = element.className;
	var classList = className.split(" ");
	var pos;
	for (var i = 0; i < classList.length; i++) {
		if(classList[i]===oldClass){
			pos=i;
			break;
		}
	}
	classList.splice(pos,1);
	element.className = classList.join(" ");
}

//? 判断siblingNode和element是否为同一个父元素下的同一级的元素，返回bool值
//同一父元素--parentNode相同
//同一级--同一父元素肯定就是同一级了吧？不然父元素就不一样了呀
function isSiblingNode(element,siblingNode){
	return (element.parentNode===siblingNode.parentNode);
}
var btn=document.getElementById("btn");
var p=document.getElementById("p1");
var p2=document.getElementById("p2");
console.log(isSiblingNode(btn,p2));

// 获取element相对于浏览器窗口的位置，返回一个对象{x, y}
//第一种：getBoundingClientRect()方法，直接获取四个属性值
//第二种：offsetParent结合obj.offsetTop //元素相对于父元素的top
function getPosition(element){
	var x= element.getBoundingClientRect().left+document.documentElement.scrollLeft;
	var y= element.getBoundingClientRect().top+document.documentElement.scrollTop;
	var obj={x:x,
	         y:y};
	return obj;
}
console.log(getPosition(p2));

// 实现一个简单的Query
// 首先要识别字符串的特点，然后判断根据哪种方法取得元素。
// 这些模式我不会写，所以我只能用别的方法了。
// 新的问题是，icon==“.”得条件就是不成立。#的就成立了。
// 其实不是他不成立，而是我忘了之前的DOM把我测试的那个类删掉了。

//在ele的父元素集合中，搜索是否存在符合selector的元素，后面复合选择器会用到，不是作业要求的
function searchParent(ele,selector){
    var all = $(selector);
    if(!isArray(all)){
        var temp = [all];
        all = temp;
    }
    if(ele.parentNode){
        if(isElementInArray(all,ele.parentNode)){
            return true;
        }else{
            return searchParent(ele.parentNode,selector);
        }
    }else{
        return false;
    }
}

//根据searchParent的结果过滤集合
function fliterByParent(ele_array,selector){
    var temparr = toArray(ele_array);
    for(var i = 0 ; i < temparr.length ; i++){
        if(!searchParent(temparr[i],selector)){
            temparr.splice(i,1);
            i = i - 1;
        }
    }
    return temparr;
}



//一个简单的jQuery
var m={
	getElement:	function(selector){
		if(trim(selector).split(" ").length > 1){
        var all = trim(selector).split(" ");
        var root = $(all[all.length-1]);
        if(!root.length){
            return root;
        }
        if(!isArray(root)){
            root = toArray(root);
        }
        for(var i = 2 ; i < all.length+2 && all.length-i >=0 ; i++){
            root = fliterByParent(root,all[all.length-i]);
        }
        return root;
    }
    //ID选择器
    if(/#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/.test(selector)){
        return document.getElementById(selector.slice(1,selector.length));
    }


    //tag选择器，只返回第一个
    if(/^((?:[\w\u00c0-\uFFFF\-]|\\.)+)/.test(selector)){
        return document.getElementsByTagName(selector)[0];
    }


    
    /*
    class选择器，返回全部匹配项，复合选择器的实现需要匹配全部，所以只能暂时用这个
    */
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
	    if (tagName==tag) { 
	    	listener(target);
	    }
	});	
	},//delegate
}//m对象
console.log("选出来的"+ m.getElement(".one .two .three a"));

function listener(){
	alert("成功啦");
}
m.on("#p2","click",listener);
m.un("#p2","click",listener);

m.click("#div1",listener);
m.enter("#txt",enterListener);

function enterListener(){
	alert("you pressed the enter");
}
function clickHandle(element){
	alert(element.innerHTML);
}
m.delegate("#list","li","click",clickHandle);


// 判断是否为IE浏览器，返回-1或者版本号
function isIE(){
	var u_agent = navigator.userAgent,
	    index = u_agent.indexOf("MSIE");
	if(index >-1){
		return ("IE版本号为："+u_agent.substr(index+4,4));
	}else{
		return ("不是IE浏览器。");
	}
}//是这样吗？说上说尽量不要用客户端检测。
console.log(isIE());

// 设置cookie
function setCookie(cookieName,cookieValue,expiredays){
	var exdate = new Date();
	exdate.setDate(exdate.getDate()+expiredays);
	document.cookie = cookieName + "="+escape(cookieValue)
	+((expiredays==null) ? "" : "; expires="+exdate.toGMTString());
}
setCookie("Ma","I love William",100000);
//为什么没有创建成功？
//果然，IE中就有。难道谷歌的不是document.cookie方法吗？

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
console.log(getCookie("Ma"));

//异步加载。
function ajax(url,options){
	var xmlhttp, dataValue="";
	if (typeof options.data=="object") {
			for (var p in options.data) {
				dataValue += p +"="+options.data[p]+"&"; 
			}
		}else{
			dataValue = options.data;
		}//统一格式
		console.log(dataValue);
	if(window.XMLHttpRequest){
		xmlhttp = new XMLHttpRequest();
	}else{
		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp.onreadystatechange=function(){
		if(xmlhttp.readyState==4 && xmlhttp.status==200){
			options.onsuccess(xmlhttp.responseText);
		}else if(xmlhttp.status==404){
			options.onfail();
		}
	}//onreadystatechange
	if (options.type=="GET") {
			xmlhttp.open("GET",url+"?"+dataValue,true);
			xmlhttp.send();
		}else{
			xmlhttp.open("POST",url,true);
			xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
			xmlhttp.send(dataValue);
		}//发送数据
}//ajax
//改好了，发送请求的方法就是不应该在函数里面，昨天没看清楚，最可怕的是竟然说服自己相信了那个错误的。
//现在的问题就是无法访问。
ajax(
    "http://localhost/test.html", 
    {
    	type: "GET",
        data: {
            name: 'simon',
            password: '123456'
        },
        onsuccess: function (responseText) {
            console.log(responseText);
        },
        onfail:function(){
        	console.log("失败");
        }
    }
);

