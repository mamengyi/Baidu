console.log("gtd");
//管理分类的对象
var taskData={},
	orderData=[];
var kind=function(){
	var activeItem= $(".default a"),
		taskBox,
		renderTask=function(){
			var taskList=createTaskList(),
				content="";
			if (activeItem.taskData) {
				for (var i = 0; i < activeItem.taskData["orderData"].length; i++) {
					var item=activeItem.taskData["orderData"][i];
					content+="<dt>"+item+"</dt>";
					for(var j=0;j<activeItem.taskData[item].length;j++){
						content+="<dd>"+activeItem.taskData[item][j].title+"<dd>";
					}
				}
			}
			taskList.innerHTML=content;
		},
		createTaskList=function(){
			var taskList;
			return function(){
				if (taskList) {
					return taskList;
				}else{
					taskList=document.createElement("dl");
					addClass(taskList,"task-list");
					$(".task").appendChild(taskList);
					return taskList;
				}
			}
		}(),
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
					renderTask();
				}
			}
		},
		collapse = function(e,target){
			toggleClass(target.parentNode.parentNode,"hide");
		},
		createTaskBox=function(){
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
		},
		newTask=function(e){
			preventDefault(e);
			if (activeItem) {
				if (!taskBox) {
					createTaskBox();
				}
				document.body.appendChild(taskBox);
			}
		},
		update=function(){
			var title=taskBox.getElementsByTagName("input")[0],
				date=taskBox.getElementsByTagName("input")[1],
				content=taskBox.getElementsByTagName("textarea")[0];
			if (!activeItem.taskData) {
				activeItem.taskData={};
				activeItem.taskData["orderData"]=[];
			}
			if (!activeItem.taskData[date.value]) {
				activeItem.taskData[date.value]=[];
				activeItem.taskData["orderData"]=orderInsert(activeItem.taskData["orderData"],date.value);
			}
			activeItem.taskData[date.value].push({"title":title.value,"content":content.value});
			renderTask();
			title.value="";
			date.value="";
			content.value="";
			document.body.removeChild(taskBox);
		};
	return {
		init: function(){
			$.click(".kind",removeActive);
			$.click(".new-kind",addKind);
			$.delegateTag(".kind-list","a","click",toggleActive);
			$.delegateTag(".kind-list","a","click",deleteKind);
			$.delegateTag(".kind-list","a","click",renderTask);
			$.delegateTag(".kind-list","i","click",collapse);
			$.click(".new-task",newTask);
		},
	}
}();





kind.init();
