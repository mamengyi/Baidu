//自定义事件
function eventTarget(){
	this.handlers={};
}

eventTarget.prototype={
	constructor:eventTarget,
	addHandler:function(type,handler){
		if (typeof this.handlers[type]=="undefined") {
			this.handlers[type]=[];
		}
		this.handlers[type].push(handler);
	},

	fire:function(e){
		var handlers=this.handlers[e.type]
		if (isArray(handlers)) {
			for (var i = 0,len = handlers.length;i<len; i++) {
				handlers[i](e);
			}
		}
	},

	removeHandler:function(type,handler){
		if (isArray(this.handlers[type])) {
			removeItem(this.handlers[type],handler);
		}
	},
};


//自定义拖动事件（和HTML的class属性耦合）
var DragDrop=function(){
	var dragdrop=new eventTarget(),
		dragging=null,
		x=0,
		y=0;
	
	function handle(e){
		var e=e||window.event;
		var target=e.target||e.srcElement;
		switch(e.type){
			case "mousedown":
				if (hasClass(target,"draggable")) {
					dragging=target;
					x=e.clientX-target.offsetLeft;
					y=e.clientY-target.offsetTop;
					dragdrop.fire({
						type:"dragstart",
						target:dragging,
						x:e.clientX,
						y:e.clientY
					});
				}
				break;
			case "mousemove":
				if (dragging!==null) {
					dragging.style.left=e.clientX-x+"px";
					dragging.style.top=e.clientY-y+"px";
					dragdrop.fire({
						type:"drag",
						target:dragging,
						x:e.clientX,
						y:e.clientY
					});
				}
				break;
			case "mouseup":
				dragdrop.fire({
						type:"dragend",
						target:dragging,
						x:e.clientX,
						y:e.clientY
				});
				dragging=null;
				break;
		}
	};
	dragdrop.enable=function(){
		$.add(document,"mousedown",handle);
		$.add(document,"mousemove",handle);
		$.add(document,"mouseup",handle);
	};
	dragdrop.disable=function(){
		$.remove(document,"mousedown",handle);
		$.remove(document,"mousemove",handle);
		$.remove(document,"mouseup",handle);
	};
	return dragdrop;
}

/*实验
var dragevent=new DragDrop();
dragevent.enable();
dragevent.addHandler("dragstart",function(e){
	console.log(e.x);
});
*/
//HTML5拖动
window.onload=function(){
	//设置拖动目标可以被拖动
	var divs=document.getElementsByClassName("box");
	each(divs,function(item,index){
		item.draggable="true";
		console.log("item.draggable");
	});

	//监听拖动目标的drag事件，让他在原容器中消失
	function hide(e){
		var e=e||window.event,
			target=e.target||e.srcElement;
		target.style.display="none";
	}
	$.delegate(".container1","div","drag",hide);
	$.delegate(".container2","div","drag",hide);
	//监听放置目标的dragenter事件，确定操作和视觉
	function handle(e){
		var e=e||window.event,
			target=e.target||e.srcElement;
		target.style.backgroundColor="blue";
		e.dataTransfer.dropEffect="move";
		e.dataTransfer.effectAllowed="move";
	}
	$.on(".container1","dragenter",handle);
	$.on(".container2","dragenter",handle);
	//设置放置目标
	function prevent(e){
		preventDefault(e);
	}
	$.on(".container1","dragover",prevent);
	$.on(".container2","dragover",prevent);
	//取消视觉效果
	$.un(".container1","dragleave",handle);
	$.un(".container2","dragleave",handle);
}

