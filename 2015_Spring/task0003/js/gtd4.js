console.log("gtd4");


var task=function(){
	var activeItem=$(".default a"),
		showBox=$(".show-box"),
		editBox,
		activeTask,
		filterStatus=$(".all-task"),
		operate,
		getStorage=function(){
			var kinds=getStore("kindIndex"),
				arr=[],
				value;
			switch(arguments.length){
				case 0:
					if (!getStore("默认分类")) {
						setStore("默认分类",{length:0});
					}
					if (kinds) {
						for (var i = 0, len = kinds.length; i < len; i++) {
							value=getStore(kinds[i]);
							if (value[1]) {
								var subArr=[kinds[i],value[0]&&value[0].length||0];
								for (var key in value[1]){
									subArr.push(key,value[1][key].length);
								}
								arr.push(subArr);
							}else{
								arr.push(kinds[i],value[0]&&value[0].length||0);
							}
						}
						renderKind(arr);
						renderTask();
					}
					break;
					
				case 1:
					if (getStore(arguments[0])) {
						if (arguments[0]==="默认分类") {
							return getStore(arguments[0]).taskData;
						}else{
							if (getStore(arguments[0])[0]) {
								return getStore(arguments[0])[0].taskData;
							}
						}
					}
					break;
				case 2:
					return getStore(arguments[0])[1][arguments[1]].taskData;
			}
		},
		editTaskStorage=function(defaultK,superK,subK){
			if (!activeItem.name) {
				if (activeItem.getAttribute("subname")) { //如果是二级分类
					editStore(activeItem.parentNode.parentNode.previousSibling.name,subK);
				}else{ //如果是默认分类
					editStore("默认分类",defaultK);
				}
			}else{ //如果是一级分类
				editStore(activeItem.name,superK);
			}
		},
		getTaskData=function(){
			if (!activeItem.name) {
				if (activeItem.getAttribute("subname")) {
					return getStorage(activeItem.parentNode.parentNode.previousSibling.name,activeItem.getAttribute("subname"));
				}else{
					return getStorage("默认分类");
				}
			}else{
				return getStorage(activeItem.name);
			}
		},
		renderKind=function(arr){
			var kindList=$(".kind-list"),
				defaultNum=getStore("默认分类").length,
				sum=defaultNum;
			kinds='<li class="default"><a href="#" class="active"><i></i>默认分类<span>('+defaultNum+')</span></a></li>';
			for(var i=0,len=arr.length;i<len;i++){
				if (isArray(arr[i])) {
					var subKind='',
						num=arr[i][1];
					for (var j = 2; j < arr[i].length; j+=2) {
						num+=arr[i][j+1];
						subKind+='<li><a subname="'+arr[i][j]+'">'+arr[i][j]+'<span>('+arr[i][j+1]+')</span></a></li>';
					}
					kinds+='<li class="list-item"><a href="#" name="'+arr[i][0]+'"><i></i>'+arr[i][0]+'<span>('+num+')</span></a><ul class="sub-kind">'+subKind+'</ul></li>';
					sum+=num;
				}else{
					kinds+='<li class="list-item"><a href="#" name="'+arr[i]+'"><i></i>'+arr[i]+'<span>('+arr[i+1]+')</span></a></li>';
					sum+=arr[i+1];
					i++;
				}
			}
			$(".sum").innerHTML="("+sum+")";
			kindList.innerHTML=kinds;
			$(".kind").appendChild(kindList);
			activeItem=$(".default a");
		},
		renderTask=function(active){
			var taskList=$(".task-list"),
				content="",
				option;
			if (hasClass(filterStatus,"finish-task")) {
				option="finish";
			}else if(hasClass(filterStatus,"unfinish-task")){
				option="unfinish";
			}
			if (activeItem) {
				var	taskData=getTaskData();
				if (taskData) {
					for (var i = 0; i < taskData["orderData"].length; i++) {
						var item=taskData["orderData"][i];
						for(var j=0;j<taskData[item].length;j++){
							if (taskData[item][j].finish) {
								if (option==="unfinish") {
									content+="";
								}else{
									console.log(content.indexOf('<dt>'+item+'</dt>'))
									if (content.indexOf('<dt>'+item+'</dt>')===-1) {
										content+='<dt>'+item+'</dt>';
									}
									content+='<dd><a class="finish" index="'+j+'">'+taskData[item][j].title+'</a></dd>';
								}
							}else{
								if (option==="finish") {
									content+="";
								}else{
									if (content.indexOf('<dt>'+item+'</dt>')===-1) {
										content+='<dt>'+item+'</dt>';
									}
									if (active&&active===taskData[item][j].title) {
										content+='<dd><a index="'+j+'" class="active">'+taskData[item][j].title+'</a></dd>';
									}else{
										content+='<dd><a index="'+j+'">'+taskData[item][j].title+'</a></dd>';
									}
								}
							}
						}
					}
					taskList.innerHTML=content;
					if (content && typeof active!=="string") {
						var date=$(".task-list dt").innerHTML,
							title=$(".task-list dd a").innerHTML,
							index=$(".task-list dd a").getAttribute("index");
						$(".edit-title").innerHTML=title;
						$(".date").innerHTML=date;
						$(".edit-content").innerHTML=taskData[date][index].content;
					}
					if (!content) {
						$(".edit-title").innerHTML="";
						$(".date").innerHTML="";
						$(".edit-content").innerHTML="";
					}
				}else{
					taskList.innerHTML="";
					$(".edit-title").innerHTML="";
					$(".date").innerHTML="";
					$(".edit-content").innerHTML="";
				}
			}else{
				if(taskList){
					taskList.innerHTML="";
				}
				$(".edit-title").innerHTML="";
				$(".date").innerHTML="";
				$(".edit-content").innerHTML="";
			}
			if(typeof active==="string"){
				activeTask=$(".task-list .active");
			}else{
				activeTask=$(".task-list a");
				activeTask && addClass(activeTask,"active");
			}
		},
		showTask=function(e,target){
			var getdate=function(node){
				if (node.previousSibling.tagName==="dt"||node.previousSibling.tagName.toLowerCase()==="dt") {
					return node.previousSibling.innerHTML;
				}else{
					return getdate(node.previousSibling);
				}
			},
			    taskData=getTaskData(),
				date=getdate(target.parentNode),
				title=target.innerHTML;
				content=taskData[date][target.getAttribute("index")].content;
			$(".edit-title").innerHTML=title;
			$(".date").innerHTML=date;
			$(".edit-content").innerHTML=content;
			activeTask && removeClass(activeTask,"active");
			activeTask=target;
			addClass(activeTask,"active");
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
				var reduceNum=function(){
					var num=arguments[0].getElementsByTagName("span")[0].innerHTML.substr(1,1),
						sum=arguments[1].innerHTML.substr(1,1);
					arguments[1].innerHTML="("+(sum-num)+")";
				}
				if (hasClass(target.parentNode,"default")) {
					alert("不能删除默认分类");
				}else if (confirm("确认要删除吗？")) {
					if (target.parentNode.nextSibling) {
						activeItem=target.parentNode.nextSibling;
						addClass(activeItem,"active");
					}else{
						activeItem=null;
					}
					if (target.name) { //如果是一级分类
						localStorage.removeItem(target.name);
						editStore("kindIndex",function(arr){
							removeItem(arr,target.name);
						});
					}else if (target.getAttribute("subname")) { //如果是二级分类
						var name=target.parentNode.parentNode.previousSibling.name;
						editStore(name,function(arr){
							delete arr[1][target.getAttribute("subname")];
						});
						reduceNum(target,target.parentNode.parentNode.previousSibling.getElementsByTagName("span")[0]);
					}
					reduceNum(target,$(".sum"));
					target.parentNode.parentNode.removeChild(target.parentNode);
					target.parentNode=null;
				}
				renderTask();
			}
		},
		removeActive = function(){
			removeClass(activeItem,"active");
			activeItem=null;
			renderTask();
		},
		addKind = function(e){
			preventDefault(e);
			if (!activeItem||!activeItem.getAttribute("subname")) {
				var kind=trim(prompt("新分类：",""));
				if (kind&&!haveKind(kind)) {
					if (kind.length<=7) {
						var li=document.createElement("li"),
						    a=document.createElement("a");
						li.appendChild(a);
						if (!activeItem||!activeItem.name) {
							addClass(li,"list-item");
							$(".kind-list").appendChild(li);
							a.innerHTML="<i></i>"+kind+"<span>(0)</span>";
							a.name=kind;
							setStore(kind,[]);
							if (!getStore("kindIndex")) {
								setStore("kindIndex",[]);
							}
							editStore("kindIndex",function(arr){
								arr.push(kind);
							});
						}else{
							if (!activeItem.parentNode.getElementsByClassName("sub-kind")[0]) {
								var ul=document.createElement("ul");
								ul.className="sub-kind";
								activeItem.parentNode.appendChild(ul);
							}
							a.setAttribute("subname",kind);
							activeItem.parentNode.getElementsByClassName("sub-kind")[0].appendChild(li);
							editStore(activeItem.name,function(arr){
								if (!arr[1]) {
									arr[1]={};
								}
								arr[1][kind]={length:0};
							});
							a.innerHTML=kind+"<span>(0)</span>";
						}
						removeClass(activeItem,"active");
						activeItem=a;
						addClass(activeItem,"active");
						renderTask();
					}else{
						alert("分类名太长了，不要超过7个汉字哦")
					}	
				}else{
					if (!kind) {
						alert("分类名不能为空");
					}else{
						alert("该分类已存在");
					}
				}
			}
		},
		haveKind=function(kind){
			if (activeItem&&activeItem.name) {
				if (getStore(activeItem.name)[1]) {
					return !!getStore(activeItem.name)[1][kind];	
				}else{
					return false;
				}
			}else{
				return !!getStore(kind);
			}
		},
		collapse = function(e,target){
			toggleClass(target.parentNode.parentNode,"hide");
		},
		createBox=function(){
			box=document.createElement("div");
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
			cancel.appendChild(document.createTextNode("取消"));
			submit.appendChild(document.createTextNode("确定"));
			$.add(submit,"click",agent);
			$.add(cancel,"click",function(){
				$(".edit").removeChild(editBox);
				$(".edit").appendChild(showBox);
			});
			box.appendChild(titleLb);
			box.appendChild(dateLb);
			box.appendChild(contentLb);
			box.appendChild(submit);
			box.appendChild(cancel);
			addClass(box,"edit-box");
			return box;
		},
		agent=function(){
			if (isDate(date)) {
				if (operate==="new") {
					addTask();
				}else if (operate==="edit") {
					reviseTask();
				}
			}else{
				alert("请输入正确的日期格式");
			}
		},
		newTask=function(e){
			preventDefault(e);
			if (activeItem) {
				if (!editBox) {
					editBox=createBox();
				}
				editBox.getElementsByTagName("input")[0].value="";
				editBox.getElementsByTagName("input")[1].value="";
				editBox.getElementsByTagName("textarea")[0].value="";
				operate="new";
				$(".edit").removeChild(showBox);
				$(".edit").appendChild(editBox);
			}
		},
		addTask=function(){
			var title=editBox.getElementsByTagName("input")[0],
				date=editBox.getElementsByTagName("input")[1],
				content=editBox.getElementsByTagName("textarea")[0],
			    store=function(task){
					task.length+=1;
					if (!task.taskData) {
						task.taskData={};
						task.taskData["orderData"]=[];
					}
					if (!task.taskData[date.value]) {
						task.taskData[date.value]=[];
						task.taskData["orderData"]=orderInsert(task.taskData["orderData"],date.value);
					}
					task.taskData[date.value].push({"title":title.value,"content":content.value,"finish":false});
				},
				addNum=function(){
					for (var i = 0; i < arguments.length; i++) {
						var node=arguments[i],
							num=node.innerHTML.substr(1,1)-0+1;
						node.innerHTML="("+num+")";
					}
				};
			editTaskStorage(function(arr){
				store(arr);
			},
			function(arr){
				if (!arr[0]) {
					arr[0]={length:0};
				}
				store(arr[0]);
			},
			function(arr){
				var task=arr[1][activeItem.getAttribute("subname")];
				store(task);
			});
			if (activeItem.getAttribute("subname")) { //如果是二级分类
				addNum(activeItem.parentNode.parentNode.previousSibling.getElementsByTagName("span")[0]);
			}
			renderTask(title.value);
			addNum(activeItem.getElementsByTagName("span")[0],$(".sum"));
			$(".edit").removeChild(editBox);
			$(".edit").appendChild(showBox);
			$(".edit-title").innerHTML=title.value;
			$(".date").innerHTML=date.value;
			$(".edit-content").innerHTML=content.value;
		},
		editTask=function(e){
			if (activeTask) {
				var date=$(".date").innerHTML,
					title=$(".edit-title").innerHTML,
					content=$(".edit-content").innerHTML;
				preventDefault(e);
				if (!editBox) {
					editBox=createBox();
				}
				editBox.getElementsByTagName("input")[0].value=title;
				editBox.getElementsByTagName("input")[1].value=date;
				editBox.getElementsByTagName("textarea")[0].value=content;
				operate="edit";
				$(".edit").removeChild(showBox);
				$(".edit").appendChild(editBox);
			}
		},
		reviseTask=function(){
			var dateBefore=showBox.getElementsByClassName("date")[0].innerHTML,
				title=editBox.getElementsByTagName("input")[0].value,
				date=editBox.getElementsByTagName("input")[1].value,
				content=editBox.getElementsByTagName("textarea")[0].value,
				index=activeTask.getAttribute("index"),
				refreshTask=function(obj){
					obj.taskData[date][index].title=title;
					obj.taskData[date][index].content=content;
					obj.taskData[date][index].finish=false;
				},
				replaceTask=function(obj){
					obj.taskData[dateBefore].splice(index,1);
					if (!obj.taskData[dateBefore][0]) {
						delete obj.taskData[dateBefore];
						removeItem(obj.taskData.orderData,dateBefore);
						obj.taskData.orderData=orderInsert(obj.taskData.orderData,date);
					}
					if (!obj.taskData[date]) {
						obj.taskData[date]=[];
					}
					obj.taskData[date].push({title:title,content:content,finish:false});
				};
				if (dateBefore===date) {
					editTaskStorage(
						refreshTask,
						function(arr){
							refreshTask(arr[0]);
						},
						function(arr){
							var kind=activeItem.getAttribute("subname");
							refreshTask(arr[1][kind]);
					});
				}else{ 
					editTaskStorage(
						replaceTask,
						function(arr){
							replaceTask(arr[0]);
						},
						function(arr){
							var kind=activeItem.getAttribute("subname");
							replaceTask(arr[1][kind]);
					});
				}
				$(".edit").removeChild(editBox);
				$(".edit").appendChild(showBox);
				renderTask(title);
				$(".edit-title").innerHTML=title;
				$(".date").innerHTML=date;
				$(".edit-content").innerHTML=content;
		},
		finishTask=function(e){
			if (activeTask) {
				var date=$(".date").innerHTML,
					index=activeTask.getAttribute("index");
				preventDefault(e);
				addClass(activeTask,"finish");
				editTaskStorage(
					function(obj){
						obj.taskData[date][index].finish=true;
					},
					function(arr){
						arr[0].taskData[date][index].finish=true;
					},
					function(arr){
						var kind=activeItem.getAttribute("subname");
						arr[1][kind].taskData[date][index].finish=true;
				});
			}
		},
		filterTask=function(e,target){
			preventDefault(e);
			removeClass(filterStatus,"active");
			filterStatus=target;
			addClass(target,"active");
			renderTask();
		};
	return {
		init: function(){
			getStorage();
			$.click(".kind",removeActive); //点击任务列表的空白处
			$.click(".new-kind",addKind);  //点击添加分类
			$.delegateTag(".kind-list","a","click",toggleActive); //点击分类标题
			$.delegateTag(".kind-list","a","click",renderTask);  //点击分类标题
			$.delegateTag(".kind-list","a","click",deleteKind);  //点击删除分类按钮
			$.delegateTag(".kind-list","i","click",collapse);  //点击左侧文件夹标志
			$.delegateTag(".task-list","a","click",showTask);  //点击任务标题
			$.delegateTag(".task-title","a","click",filterTask); //点击所有、已完成、未完成
			$.click(".new-task",newTask); //点击新增任务
			$.click('.finish-btn',finishTask); //点击完成任务
			$.click('.edit-btn',editTask);  //点击修改任务
		},
	}
}();


task.init();
