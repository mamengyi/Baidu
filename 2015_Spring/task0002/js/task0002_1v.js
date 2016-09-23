//在一个节点后面添加一个新的节点
function insertAfter(node,bro){
	bro.parentNode.insertBefore(node,bro.nextSbling);
}
//去除数组中空的项
function trimArray(arr){
	for (var i = 0; i < arr.length; i++) {
		if(arr[i]==""){ //这里用不用去除空白字符串。
			arr.splice(i,1);
		}
	}
	return arr;
}

//按下按钮时处理字符串。
window.onload=function(){
	var reg=/[\n\u3000\u0020\uff0c\u002c\u3001\uff1b]+/g;
	var hobbyArea=$("#hobby-in");
	$.on("#hobby-in","keyup",function(){
		var arr=hobbyArea.value.split(reg);
		if(arr&&arr.length>10&&!$(".warn")){
			var warn=document.createElement("span");
			warn.innerHTML="输入的爱好不得超过十个！"
			warn.className="warn";
			insertAfter(warn,hobbyArea);

		}else if(arr.length<=10&&$(".warn")){
			$(".warn").parentNode.removeChild($(".warn"));
		}
	});
	var hobbyBtn=$(".hobby-btn");
	$.on(".hobby-btn","click",function(){
		if(trim(hobbyArea.value)==""){
			if(!$(".warn")){
				var warn=document.createElement("span");
				warn.innerHTML="请输入至少一个非空白字符！"
				warn.className="warn";
				insertAfter(warn,hobbyArea);
			}
		}
		if (!$(".warn")) {
			var hobbies=hobbyArea.value.split(reg);
			var checkes=trimArray(uniqArray(hobbies));
			var checkBox=document.createDocumentFragment();
			checkBox.innerHTML="";
			for (var i = 0; i < checkes.length; i++) {
				checkBox.innerHTML+='<label><input type="checkbox">'+checkes[i]+'</label></br>';
			}
			if (!$(".hobby-show")) {
				var box=document.createElement("div");
				insertAfter(box,hobbyBtn);
				addClass(box,"hobby-show");
			}
			$(".hobby-show").innerHTML=checkBox.innerHTML;
		}
	});

}