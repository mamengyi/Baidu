console.log("gtd");
//管理分类的对象

var kind=function(){
	var activeItem,
		taskBox,
		getStorage=function(){
			var lStore=localStorage,
				kinds=JSON.parse(lStore.getItem("kindIndex")),
				arr=[],
				value;
			switch(arguments.length){
				case 0:
					for (var i = 0, len = kinds.length; i < len; i++) {
						value=JSON.parse(lStore.getItem(kinds[i]));
						if (value[1]) {
							var subArr=[kinds[i],value[0].length];
							for (var key in value[1]){
								subArr.push(key,value[1][key].length);
							}
							arr.push(subArr);
						}else{
							arr.push(kinds[i],value[0].length);
						}
					}
					renderKind(arr);
					break;
				case 1:
					return JSON.parse(lStore.getItem(arguments[0])).taskData||
						   JSON.parse(lStore.getItem(arguments[0]))[0].taskData;
				case 2:
					return JSON.parse(lStore.getItem(arguments[0]))[1][arguments[1]].taskData;
			}
			
		},
		renderKind=function(arr){
			var kindList=document.createElement("ul"),
				defaultNum=JSON.parse(localStorage.getItem("默认分类")).length,
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
				}else{
					kinds+='<li class="list-item"><a href="#" name="'+arr[i][0]+'"><i></i>'+arr[i][0]+'<span>('+arr[i][1]+')</span></a></li>';
				}
				sum+=num;
			}
			$(".sum").innerHTML=sum;
			kindList.innerHTML=kinds;
			addClass(kindList,"kind-list");
			$(".kind").appendChild(kindList);
			activeItem= $(".default a");
		}
		renderTask=function(){
			var taskList=createTaskList(),
				content="",
				taskData;
			if (!activeItem.name) {
				if (activeItem.getAttribute("subname")) {
					taskData=getStorage(activeItem.parentNode.parentNode.previousSibling.name,activeItem.getAttribute("subname"));
				}else{
					taskData=getStorage("默认分类");
				}
			}else{
				taskData=getStorage(activeItem.name);
			}
			if (taskData) {
				for (var i = 0; i < taskData["orderData"].length; i++) {
					var item=taskData["orderData"][i];
					content+="<dt>"+item+"</dt>";
					for(var j=0;j<taskData[item].length;j++){
						if (taskData[item][j].finish) {
							content+='<dd class="finish">'+taskData[item][j].title+'</dd>';
						}else{
							content+="<dd>"+taskData[item][j].title+"</dd>";
						}
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
			title.value="";
			date.value="";
			content.value="";
			document.body.removeChild(taskBox);
		};
	return {
		init: function(){
			getStorage();
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

var defaultKind={
	length: 2,
	taskData: {
		orderData: ["2016-10-01","2016-11-02"],
		"2016-10-01": [{
			title: "大扫除",
			content: "人生整理魔法",
			finish: true
		}],
		"2016-11-02": [{
			title: "安装",
			content: "安装梳妆台",
			finish: false
		}]
	}
},
ife=[
	{
		length: 2,
		taskData: {
			orderData: ["2016-08-02","2016-09-01"],
			"2016-09-01": [{
				title: "review",
				content: "看看review",
				finish: true
			}],
			"2016-08-02": [{
				title: "对比",
				content: "看看别代码",
				finish: false
			}]
		}
	},
	{
		task01: {
			length: 2,
			taskData: {
				orderData: ["2016-07-02","2016-07-12"],
				"2016-07-12": [{
					title: "两列布局",
					content: "自适应两列布局",
					finish: true
				}],
				"2016-07-02": [{
					title: "三列布局",
					content: "圣杯布局和双飞翼布局",
					finish: false
				}]
			}
		},
		task02: {
			length: 1,
			taskData: {
				orderData: ["2016-08-12"],
				"2016-08-12": [{
					title: "Ajax",
					content: "高级程序设计Ajax部分",
					finish: false
				}],
			}
		},
	},
],
life=[
	{
		length: 0,
	},
	{
		游玩: {
			length: 2,
			taskData: {
				orderData: ["2016-11-12","2016-11-19"],
				"2016-11-12": [{
					title: "回家",
					content: "洗衣服，拿望远镜",
					finish: false
				}],
				"2016-11-19": [{
					title: "演唱会",
					content: "南京",
					finish: false
				}]
			}
		},
	},
];
var arr=["百度IFE","家庭生活"];
localStorage.clear();
localStorage.setItem("kindIndex",JSON.stringify(arr));
localStorage.setItem("默认分类",JSON.stringify(defaultKind));
localStorage.setItem("百度IFE",JSON.stringify(ife));
localStorage.setItem("家庭生活",JSON.stringify(life));


kind.init();
