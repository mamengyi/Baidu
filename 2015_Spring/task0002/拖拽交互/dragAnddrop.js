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
		x=0,y=0,
		border_r,border_l,border_top,border_btm,
		left,right,top,bottom;
	
	function handle(e){
		var e=e||window.event,
			target=e.target||e.srcElement,
			drops=getElements(".dropable");
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
					if (drops[0]) {
						for (var i = 0; i < drops.length; i++) {
						border_l=dragging.offsetLeft;
						border_r=parseInt(getCSS(dragging,"width"))+border_l;
						border_top=dragging.offsetTop;
						border_btm=parseInt(getCSS(dragging,"height"))+border_top;
						left=drops[i].offsetLeft;
						right=parseInt(getCSS(drops[i],"width"))+left;
						top=drops[i].offsetTop;
						bottom=parseInt(getCSS(drops[i],"height"))+top;
						if(border_r>left&&border_l<right&&border_top<bottom&&border_btm>top){
							dragdrop.fire({
								type:"dragenter",
								target:drops[i]
							});
							}else{
								dragdrop.fire({
									type:"dragleave",
									target:drops[i]
								});
							}
						}
					}
				}
				break;
			case "mouseup":
				if (drops[0]&&dragging) {
					for (var i = 0; i < drops.length; i++) {
						dragWidth=parseInt(getCSS(dragging,"width"));
						border_r=dragWidth+dragging.offsetLeft;
						border_l=dragging.offsetLeft;
						left=drops[i].offsetLeft;
						right=drops[i].offsetLeft+parseInt(getCSS(drops[i],"width"));
						if(border_r>left&&border_l<right&&border_top<bottom&&border_btm>top){  //会更容易drop进第一个盒子里。
							dragdrop.fire({
								type:"drop",
								target:drops[i],
								dragging:dragging
							});
						break;
						}
					}
				}
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



//拖动
window.onload=function(){
	var dragdrop={
		//初始化
		inith5:function(){
			var me=this;
			me.box=getElements(".box");
			//设置拖动目标可以被拖动
			each(me.box,function(item,index){
				item.draggable=true;
			});
			//获取拖动目标，并为其添加样式
			$.on(".wrap","dragstart",me.dragStart);
			//让拖动目标在拖起来的时候在原容器中消失
			$.on(".wrap","drag",me.Drag);
			//松开的时候恢复原状
			$.on(".wrap","dragend",me.dragEnd);
			//监听放置目标的dragenter事件，添加视觉效果
			$.on(".wrap","dragenter",me.dragEnter);
			//设置放置目标
			$.on(".wrap","dragover",me.prevent);
			//取消视觉效果
			$.on(".wrap","dragleave",me.dragLeave);
			//在拖放目标上处理
			$.on(".wrap","drop",me.dragDrop);
		},
		init:function(){
			var me=this,
				dragevent=new DragDrop();
			dragevent.enable();
			//设置拖动目标可以被拖动
			me.box=getElements(".box");
			each(me.box,function(item,index){
				addClass(item,"draggable");
			});
			//获取拖动目标，并为其添加样式
			dragevent.addHandler("dragstart",me.dragStart);
			//松开的时候恢复原状
			dragevent.addHandler("dragend",me.dragEnd);
			//监听放置目标的dragenter事件，添加视觉效果
			dragevent.addHandler("dragenter",me.dragEnter);
			//设置放置目标
			me.container=getElements(".container");
			each(me.container,function(item,index){
				addClass(item,"dropable");
			});
			//取消视觉效果
			dragevent.addHandler("dragleave",me.dragLeave);
			//在拖放目标上处理
			dragevent.addHandler("drop",me.dragDrop);
		},
		dragStart:function(e){
			var e=e||window.event,
				target=e.target||e.srcElement;
			if (hasClass(target,"box")) {
				if (e.dataTransfer) {
					e.dataTransfer.setData("text/plain",".move");
					addClass(target,"move");
				}else{
					addClass(target,"moving");
				}
			}
		},
		Drag:function(e){
			var e=e||window.event,
				target=e.target||e.srcElement;
			if (e.dataTransfer&&hasClass(target,"box")) {
				addClass(target,"hide");
			}
		},
		dragEnd:function(e){
			var e=e||window.event,
				target=e.target||e.srcElement;
			if (e.dataTransfer&&hasClass(target,"box")) {
				removeClass(target,"hide");
				removeClass(target,"move");
			}else{
				removeClass(target,"moving");
			}
		},
		dragEnter:function(e){
			var e=e||window.event,
				target=e.target||e.srcElement;
			if (hasClass(target,"container")) {
				addClass(target,"light");
			}
		},
		prevent:function(e){
			$.prevent(e);
		},
		dragLeave:function(e){
			var e=e||window.event,
				target=e.target||e.srcElement;
			if (hasClass(target,"container")) {
				removeClass(target,"light");
			}
		},
		dragDrop:function(e){
			var e=e||window.event,
				target=e.target||e.srcElement;
			if (e.dataTransfer&&hasClass(target,"container")) {
				var dragging=$(e.dataTransfer.getData("text/plain"));
				removeClass(dragging,"move");
				removeClass(target,"light");
				target.appendChild(dragging);
			}else if (e.dragging) {
				var lights=getElements(".light"),
					len=lights.length;
				for (var i = 0; i < len; i++) {
					removeClass(lights[0],"light"); 
				}
				removeClass(e.dragging,"moving");
				target.appendChild(e.dragging);
			}
		},
	}
	if(supportDrag()){
		dragdrop.inith5();
	}else{
		dragdrop.init();
	}
}

