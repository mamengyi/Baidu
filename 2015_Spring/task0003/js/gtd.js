console.log("gtd");
//管理分类的对象
var kind=function(){
	var activeItem= $(".default");
	return {
		init: function(){
			$.click(".kind",this.removeActive);
			$.click(".new-kind",this.addKind);
			$.delegateTag(".kind-list","a","click",this.toggleActive);
			$.delegateTag(".kind-list","a","click",this.delete);
		},
		toggleActive: function(e,target){
	        preventDefault(e);
	        stopPropagation(e);
	        if (activeItem) {removeClass(activeItem,"active");}
			activeItem=target;
			addClass(activeItem,"active");
		},
		delete: function(e,target){
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
				}
			}
			
		},
		removeActive: function(){
			removeClass(activeItem,"active");
			activeItem=null;
		},
		addKind: function(e){
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
	}
}();

kind.init();
