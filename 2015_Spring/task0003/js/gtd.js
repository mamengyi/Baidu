console.log("gtd");
//管理分类的对象
var taskData={},
	orderData=[];
var kind=function(){
	var activeItem= $(".default"),
		renderTask=function(e,target){

		},
		toggleActive= function(e,target){
	        preventDefault(e);
	        stopPropagation(e);
	        if (activeItem) {removeClass(activeItem,"active");}
			activeItem=target;
			addClass(activeItem,"active");
		},
		deleteKind = function(e,target){
			var x=e.clientX;
			if (x>217&&x<226) {
				if (hasClass(target.parentNode,"default")) {
					alert("不能删除默认分类");
				}else if (confirm("确认要删除吗？")) {
					if (target.parentNode.nextSibling) {
						activeItem=target.parentNode.nextSibling;
						addClass(activeItem,"active");
					}else{
						activeItem=null;
					}
					target.parentNode.parentNode.removeChild(target.parentNode);
					target.parentNode=null;
				}
			}
			
		},
		removeActive = function(){
			removeClass(activeItem,"active");
			activeItem=null;
		},
		addKind = function(e){
			console.log(activeItem);
			preventDefault(e);
			if (!activeItem||hasClass(activeItem.parentNode,"list-item")) {
				var kind=prompt("新分类：","");
				if (kind) {
					var li=document.createElement("li"),
						a=document.createElement("a");
						li.appendChild(a);
					if (!activeItem) {
						addClass(li,"list-item");
						$(".kind-list").appendChild(li);
						var file=document.createElement("i");
						a.appendChild(file);
					}else if(activeItem.parentNode.getElementsByClassName("sub-kind")[0]){
						activeItem.parentNode.getElementsByClassName("sub-kind")[0].appendChild(li);
					}else{
						var ul=document.createElement("ul");
						ul.className="sub-kind";
						ul.appendChild(li);
						activeItem.parentNode.appendChild(ul);
					}
					a.appendChild(document.createTextNode(kind));
					removeClass(activeItem,"active");
					activeItem=a;
					addClass(activeItem,"active");
				}
			}
		},
		collapse = function(e,target){
			toggleClass(target.parentNode.parentNode,"hide");
		};
	return {
		init: function(){
			$.click(".kind",removeActive);
			$.click(".new-kind",addKind);
			$.delegateTag(".kind-list","a","click",toggleActive);
			$.delegateTag(".kind-list","a","click",deleteKind);
			$.delegateTag(".kind-list","a","click",renderTask);
			$.delegateTag(".kind-list","i","click",collapse);
		},
	}
}();



var task=function(){
	var createTaskBox=function(){
		var taskBox;
		return function(){
			if (taskBox) {
				return taskBox;
			}else{
				taskBox=document.createElement("div");
				var titleLb=document.createElement("label"),
					title=document.createElement("input"),
					dateLb=document.createElement("label"),
					date=document.createElement("input"),
					contentLb=document.createElement("label"),
					content=document.createElement("textarea"),
					submit=document.createElement("button"),
					cancel=document.createElement("button");
				title.type="text";
				date.type="text";
				titleLb.appendChild(document.createTextNode("标题(不得超过10个汉字)："));
				titleLb.appendChild(title);
				dateLb.appendChild(document.createTextNode("日期(格式为XXXX-XX-XX)："));
				dateLb.appendChild(date);
				contentLb.appendChild(document.createTextNode("任务描述："));
				contentLb.appendChild(content);
				submit.appendChild(document.createTextNode("确定"));
				$.add(submit,"click",update);
				cancel.appendChild(document.createTextNode("取消"));
				$.add(cancel,"click",function(){
					document.body.removeChild(taskBox);
				});
				taskBox.appendChild(titleLb);
				taskBox.appendChild(dateLb);
				taskBox.appendChild(contentLb);
				taskBox.appendChild(submit);
				taskBox.appendChild(cancel);
				addClass(taskBox,"task-box");
				return taskBox;
			}
		}
	}(),
	newTask=function(e){
		preventDefault(e);
		var box=createTaskBox();
		document.body.appendChild(box);
	},
	update=function(){
		var taskBox=$(".task-box");
			title=taskBox.getElementsByTagName("input")[0].value,
			date=taskBox.getElementsByTagName("input")[1].value,
			content=taskBox.getElementsByTagName("textarea")[0].value;
		if (!taskData[date]) {
			taskData[date]=[];

		}
		taskData[date].push({"title":title,"content":content});
		orderInsert(orderData,Date.parse(date));

		document.body.appendChild(box);
	};
	return {
		init: function(){
			$.click(".new-task",newTask);
		}
	}

}();

kind.init();
task.init();