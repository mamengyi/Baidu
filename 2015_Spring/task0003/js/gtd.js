console.log("gtd");
//管理分类的对象
var kind=function(){
	var activeItem= null;
	return {
		init: function(){
			$.click(".kind",this.removeActive);
			$.click(".new-kind",this.addKind);
			$.delegateTag(".kind-list","a","click",this.toggleActive);
		},
		toggleActive: function(e,target){
	        preventDefault(e);
	        stopPropagation(e);
			activeItem=target.parentNode;
			addClass(activeItem,"active");
		},
		removeActive: function(){
			removeClass(activeItem,"active");
			activeItem=null;
		},
		addKind: function(e){
			preventDefault(e);
			var kind=prompt("新分类：",""),
				li=document.createElement("li");
				addClass(li,"list-item");
			if (!activeItem) {
				li.innerHTML='<a href="#">'+kind+'</a>（<span></span>）';
				$(".kind-list").appendChild(li);
			}else if(hasClass(activeItem,"list-item")){
				li.innerHTML='<a href="#">'+kind+'</a>（<span></span>）';
				if(activeItem.getElementsByClassName("sub-kind")[0]){
					activeItem.getElementsByClassName("sub-kind")[0].appendChild(li);
				}else{
					var ul=document.createElement("ul");
					ul.className="sub-kind";
					ul.appendChild(li);
					activeItem.appendChild(ul);
				}
			}

		},
	}
}();

kind.init();
