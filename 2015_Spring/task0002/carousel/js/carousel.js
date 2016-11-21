var animate=function(){
	var liner=function(ele,prop,next){
		var speed=(next-ele[prop])/10,
			i=0;
		(function(){
			ele[prop]+=speed;
			i++;
			if (i<10) {
				setTimeout(arguments.callee,60);
			}
		})();	
	},
	slowfast=function(ele,prop,next){
		var speed=(next-ele[prop])/10,
			i=0;
		(function(){
			ele[prop]+=speed;
			i++;
			if (i<5) {
				setTimeout(arguments.callee,80);
			}else if (i<10) {
				setTimeout(arguments.callee,30);
			}
		})();
	};
	return {
		liner:liner,
		slowfast,slowfast
	}
}();

var carousel=function(eleSelec,wrapSelec){
	var ele=$(eleSelec),
		container=$(wrapSelec),
		len=ele.getElementsByTagName("img").length,
		width=parseInt(getCSS(ele.getElementsByTagName("img")[0],"width")),
		begin,
		active,
		count=0,
		direction,
		t,
		loop,
		haveStart,
	light=function(index){
		removeClass(active,"active");
		active=$('[index='+index+']');
		addClass(active,"active");
	},
	go=function(dire){
		var index=active.getAttribute("index")-0,
			nextIndex,
			nextPosition;
		if (dire==="next") {
			nextIndex=(index+1)%len;
			nextPosition=(ele.scrollLeft+width)%(width*len);
		}else{
			nextIndex=index===0? len-1:index-1,
			nextPosition=ele.scrollLeft===0?width*len:ele.scrollLeft-width;
		}
		light(nextIndex);
		animate.liner(ele,"scrollLeft",nextPosition);
	},
	circle=function(){
		count++;
		if (loop||count<len) {
			if (direction==="forward") {
				go("next");
			}else{
				go("prev");
			}
			begin=setTimeout(arguments.callee,t);
		}
	},
	createBtn=function(){
		var div=document.createElement("div"),
			btns='';
		for(var i=0;i<len;i++){
			btns+='<a href="#" index="'+i+'"></a>';
		}
		div.innerHTML=btns;
		addClass(div,"carousel-btn");
		container.appendChild(div);
	},
	createArrow=function(){
		var prev=document.createElement("div"),
			next=document.createElement("div");
		prev.appendChild(document.createTextNode("<"));
		next.appendChild(document.createTextNode(">"));
		prev.className="arrow prev";
		next.className="arrow next";	
		container.appendChild(prev);
		container.appendChild(next);
		addClass(container,"hide");
		$.add(next,"click",function(){
			go("next");
		});
		$.add(prev,"click",function(){
			go("prev");
		});
	},
	init=function(){
		createBtn();
		createArrow();
		$.delegateTag(wrapSelec+" "+".carousel-btn","a","click",function(e,target){
			$.prevent(e);
			light(target.getAttribute("index"));
			animate.liner(ele,"scrollLeft",target.getAttribute("index")*width);
		});
		$.add(container,"mouseenter",function(){
			stop();
			removeClass(container,"hide");
		});
		$.add(container,"mouseleave",function(){
			addClass(container,"hide");
			begin=setTimeout(circle,t); 
			//console.log("start");
		});
		count=0;
		if (direction==="forward") {
			light(0);
		}else{
			light(len-1);
			ele.scrollLeft=width*(len-1);
		}
		haveStart=true;
	},
	start=function(dir,th,lo){
		stop();
		direction=dir;
		t=th*1000;
		loop=lo;
		if (!haveStart) {
			init();
		}
		begin=setTimeout(circle,t);
	},
	stop=function(){
		clearTimeout(begin);
	};
	return {
		start:start,
		stop:stop
	}
}(".carousel",".carousel-box");
window.onload=function(){
	carousel.start("forward",3,true);
	$.click(".start",function(){
		var direction=$(".backward").checked||"forward",
			loop=$(".noloop").checked?false:true,
			t=$(".t").value-0||3;
		carousel.start(direction,t,loop);
	});
}



