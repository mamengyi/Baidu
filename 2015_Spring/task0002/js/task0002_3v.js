//用scrollLeft实现轮播，正序+width，逆序-width
//怎么控制按钮变亮呢。按顺序？
//要么就是用按钮控制，给每个绑定一个scrollLeft
//或者还是用虚拟鼠标事件吧，每次都虚拟点击下一个。

function carousel(){
    var width=$(".carousel-box img").width;
    var btns=$(".carousel-btn").getElementsByTagName("a");
    for (var i = 0,len=btns.length;i<len; i++) {
            btns[i].index = i;
        }
    $.delegate(".carousel-btn","a","click",function(e){
        var e=e||window.event,
            target=e.target||e.srcElemenyt;
            each(btns,function(item,index){
                item.className=null;
            });
            addClass(target,"active");
        $(".carousel-box").style.left=-target.index*width+"px";
        
    });
    setTimeout(function(){
            var event = document.createEvent("MouseEvents");
            event.initMouseEvent("click",true,true,document.defuatView);
            var next=$(".active").nextSibling||btns[0];
            next.dispatchEvent(event);
            setTimeout(arguments.callee,3000);
        },3000);
}
carousel();

