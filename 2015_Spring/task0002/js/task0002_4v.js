window.onload=function(){
	//var value=$(".search").value; 写在这里不行
	$.on(".search","keydown",function(){
		var e=e||window.event;
		var keyNum=e.which||e.keyCode;
		if (keyNum!==40&&keyNum!==38&&keyNum!==13) {
			showData("Simon, Erik, Kener");
		}
	});
	$.on(".search","keyup",function(e){
		var e=e||window.event;
		var keyNum=e.which||e.keyCode;
		if ($(".search-list").getElementsByTagName("li")) {
			$(".search-list").style.display="block";
		}
		swithValue(keyNum);
	});
	//li在这里没有值。
	$.delegate(".search-list","li","click",function(e){
		var e=e||window.event;
		var target=e.target||e.srcElement;
		$(".search").value=target.innerHTML;
		hide();
	});
}
//将字符串转换成列表
function showData(responseText){
	var datas=trimArray(responseText.split(","));
	var frag=document.createDocumentFragment();
	frag.innerHTML="";
	for (var i = 0,len=datas.length; i < len; i++) {
		frag.innerHTML+="<li>"+datas[i]+"</li>";
	}
	$(".search-list").innerHTML=frag.innerHTML;
	var li=$(".search-list").getElementsByTagName("li");
	addMouseEvent(li);
}
//为li添加q切换效果。
function addMouseEvent(li){
	for (var i = 0, len = li.length;i<len; i++) {
		$.add(li[i],"mouseover",function(){
			//console.log(li[i]); li不见了
			addClass(this,"active");
		});
		$.add(li[i],"mouseout",function(){
	        removeClass(this,"active");
		});
	}
}
//返回项在数组中的index
function getIndex(item,arr){
	//console.log($(".active"));//为什么是undefined呢？
	for (var i = 0; i < arr.length; i++) {
		if(arr[i]===item){
			return i;
			break;
		}
	}
	return -1;
}

//根据键盘动作更新input的value
function swithValue(keyNum){
	var li=$(".search-list").getElementsByTagName("li");
	var index=getIndex($(".active"),li);
	var len=li.length;
	switch(keyNum){
		case 40: //down
			if (index===-1) {
				addClass(li[0],"active");
				$(".search").value=li[0].innerHTML;
			}else{
			    shiftActive(li[index],li[(index+1)%(len+1)]);
			}
		    break;
		case 38: //up
			if (index===-1) {
				addClass(li[len-1],"active");
				$(".search").value=li[len-1].innerHTML;
			}else{
			    shiftActive(li[index],li[(index+len)%(len+1)]);
			}
		    break;
		case 13: //enter
			hide();//不支持用鼠标选择用键盘确认。
	}

}

//隐藏ul并清空内容
function hide(){
	$(".search-list").style.display="none";
}

//交换active状态
function shiftActive(before,after){
	removeClass(before,"active");
	if (after) {
		addClass(after,"active");	
		$(".search").value=$(".active").innerHTML;	
	}
}

