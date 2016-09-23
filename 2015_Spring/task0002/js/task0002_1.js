

//去除数组中空的项
function trimArray(arr){
	for (var i = 0; i < arr.length; i++) {
		if(arr[i]==""){
			arr.splice(i,1);
			i = i-1;
		}
	}
	return arr;
}


$.on(".hobbyBtn","click",function (){
	if ($(".hobbyShow")) {document.body.removeChild($(".hobbyShow"));}
	var hobby = trim($("#hobbyIn").value);
	hobby = hobby.replace(/ /g,",");
	hobby = hobby.replace(/　/g,",");
	hobby = hobby.replace(/\n/g,",");
	hobby = hobby.replace(/，/g,",");
	hobby = hobby.replace(/、/g,",");
	hobby = hobby.replace(/;/g,",");
	var arr = hobby.split(",");
	hobby = trimArray(uniqArray(arr));
	//这里纠结了一会因为判断的时候用了赋值“=”
	if (trimArray(arr).length>10 || hobby[0]=="") {
		if (!$(".warn")) {
		var btn = $(".hobbyBtn");
		var span = document.createElement("span");
		var warn = document.createTextNode("不得为空或超过十项!");
		span.appendChild(warn);
		document.body.insertBefore(span,btn);
		span.className="warn";
		}
	}else{
		if ($(".warn")) {
			document.body.removeChild($(".warn"));
		}
		var div = document.createElement("div");
		div.className="hobbyShow";
		document.body.appendChild(div);
		for (var i = 0; i < hobby.length; i++) {
		div.innerHTML += '<label><input type="checkbox">'+hobby[i]+'</label><br>';
	}
}//处理函数
	
});
//开始的时候没实现去重，因为没分清全角逗号和半角逗号
//第二阶段的困惑就是没有理解replace方法，不过开始没想到用这个方法，还以为不能让用户混用呢。
//第三阶段更多的是发现问题，然后完善。
//现在我觉得不足的是，必须要等用户按下按钮才会提醒，不过我觉得不能为空的话也只能这样比较好


