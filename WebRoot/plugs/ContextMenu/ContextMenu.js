/**
 * author 
 **/ 
 
/**
 * 右键菜单主构造方法
 * id 菜单id
 * width 菜单宽
 * height 菜单高
 * overflowType 菜单滚动条标识
 * displayType 初始化显示是否
 * className 菜单样式名字
 */
var MainContextMenu = function(id,width,height,overflowYType,displayType,className){
	this.id = id;
	this.width = width || "150px";
	this.height = height;
	this.className = className || "divSelect";
	this.overflowYType = overflowYType || "auto";
	this.displayType = displayType || "none";
	this.positionXAdjust = 1;
	this.positionYAdjust = 1;
	this.positionX = 0;
	this.positionY = 0;
	this.childrens = [];
	this.bodyObj = null;
}


MainContextMenu.$;

var NodeContextMenu = function(id,text,fun,overCss,outCss){
	this.id = id;
	//this.text =text?"&nbsp;&#160;" + text : "&nbsp"; //&nbsp;  &#160;  the entity name of space
	if (text != "_line"){
		this.text = "&nbsp;&#160;" + text 
	}else{
		this.text = ""
	}
	
	this.fun = fun;
	this.overCss = overCss || '';
	this.outCss = outCss || '';
}
/**
 * 增加菜单节点方法
 * id 节点id 必填
 * text 节点内容 必填
 * fun 节点点击方法
 * overCss 鼠标聚焦样式 默认liFocus
 * outCss 鼠标移除焦点样式 默认outCss
 */
MainContextMenu.prototype.addNode = function(id,text,fun,overCss,outCss){
	var ovCss = overCss || "liFocus";
	var ouCss = outCss || "liDefault";
	var node = new NodeContextMenu(id,text,fun,ovCss,ouCss);
	this.childrens.push(node);
}

MainContextMenu.prototype.addLine = function(){
	var ovCss = "liFocus";
	var ouCss = "liDefault";
	var id = 'line'
	var text = '_line'
	var fun = function(){}
	var node = new NodeContextMenu(id,text,fun,ovCss,ouCss);
	this.childrens.push(node);
}
/**
 * 更新菜单位置
 */
MainContextMenu.prototype.updatePosition = function(){
	this.bodyObj.style.display = "block";
	this.bodyObj.style.left = this.intToString(this.positionX);
	this.bodyObj.style.top = this.intToString(this.positionY);
	
	var bodyHeight = this.stringToInt(document.body.clientHeight);//页面实际高
	var bodyWidth = this.stringToInt(document.body.clientWidth);//页面实际宽
	
	var positionTop = this.stringToInt(this.bodyObj.style.top);//当前鼠标y位置
	var positionLeft = this.stringToInt(this.bodyObj.style.left);//当前鼠标x位置
	
	var menuHeight = this.stringToInt(this.bodyObj.clientHeight);//菜单实际高
	var menuWidth = this.stringToInt(this.bodyObj.clientWidth);//菜单实际宽
	
	var scrollTop = this.stringToInt(document.body.scrollTop);//页面滚动条离顶部距离
	var scrollLeft = this.stringToInt(document.body.scrollLeft);//页面滚动条离左边距离
	
	//alert(positionTop+"===="+scrollTop+"===="+menuHeight+"==="+bodyHeight);
	//alert(positionLeft+"===="+scrollLeft+"===="+menuWidth+"==="+bodyWidth);
	if(this.checkFirfoxBrowse()){//firefox
		if(scrollTop!=0 || scrollLeft!=0){
			if(scrollTop!=0 && (positionTop + menuHeight)>(bodyHeight + scrollTop)){
				this.bodyObj.style.top = this.intToString(bodyHeight + scrollTop - menuHeight - this.positionYAdjust);
			}
			if(scrollLeft!=0 && (positionLeft + menuWidth)>(bodyWidth + scrollLeft)){
				this.bodyObj.style.left = this.intToString(bodyWidth + scrollLeft - menuWidth - this.positionXAdjust);
			}
		}else{
			if((positionTop + menuHeight)>bodyHeight){
				this.bodyObj.style.top = this.intToString(this.positionY - menuHeight -this.positionYAdjust);
			}
			if((positionLeft + menuWidth)>bodyWidth){
				this.bodyObj.style.left = this.intToString(this.positionX - menuWidth -this.positionXAdjust);
			}
		}
	}else{//ie
		if(scrollTop!=0 || scrollLeft!=0){
			if(scrollTop!=0 && (positionTop + menuHeight)>(bodyHeight)){
				this.bodyObj.style.top = this.intToString(bodyHeight + scrollTop - menuHeight - this.positionYAdjust);
			}
			if(scrollLeft!=0 && (positionLeft + menuWidth)>(bodyWidth)){
				this.bodyObj.style.left = this.intToString(bodyWidth + scrollLeft - menuWidth - this.positionXAdjust);
			}
			if((positionTop + menuHeight)<=(bodyHeight) && (positionLeft + menuWidth)<=(bodyWidth)){//ie需要 坐标+滚动条位置
				this.bodyObj.style.left = this.intToString(this.positionX + scrollLeft);
				this.bodyObj.style.top = this.intToString(this.positionY + scrollTop);
			}
		}else{
			if((positionTop + menuHeight)>bodyHeight){
				this.bodyObj.style.top = this.intToString(this.positionY - menuHeight - this.positionYAdjust);
			}
			if((positionLeft + menuWidth)>bodyWidth){
				this.bodyObj.style.left = this.intToString(this.positionX - menuWidth - this.positionXAdjust);
			}
		}
	}
}

MainContextMenu.prototype.display = function(){
	this.bodyObj.style.display = "none";
	
}

MainContextMenu.prototype.intToString = function(val){
	return val+"px";
}

/**
 * 创建右键菜单
 */
MainContextMenu.prototype.create = function(){
	MainContextMenu.$ = this;
	this.bodyObj = this.createMain();
	this.createNode(this.bodyObj);
	document.body.appendChild(this.bodyObj);
}

MainContextMenu.prototype.createMain = function(){
	var div = document.createElement("div");
	div.setAttribute("id",this.id);
	div.className = this.className;
	div.style.width = this.width;
	if(this.height)
		div.style.height = this.height;
	div.style.left = this.positionX+"px";
	div.style.top = this.positionY+"px";
	div.style.display = this.displayType;
	div.style.overflowY = this.overflowYType;
	return div;
}

//按照用addNode方法进去的节点和分割线来创建右键菜单
//如果某一行属于分割线，那么把哪一行的className设置成line
//然后利用已经设定好的CSS来创建横线
MainContextMenu.prototype.createNode = function(obj){
	for(var i=0,len=this.childrens.length;i<len;i++){
		var childObj = this.childrens[i];
		var div = document.createElement("div");
		var id = childObj.id;
		var text = childObj.text;
		//alert(text)
		div.id = id
		//alert(div.id)
		div.setAttribute("val",text);
		div.setAttribute("fun",childObj.fun);
		//alert(div.id+ " " + childObj.fun)
		if(text){
			div.innerHTML = childObj.text;
		}else{
			div.className = 'line';
		}
		/**
		 *	只有指向非line行时会有css的变化
		 *	当鼠标指向line行时，点击鼠标左键contextmenu不会关闭
		 */
		
		div.onmouseover = function(){
			if(this.id != 'line'){
				this.className = childObj.overCss;
			}else{
				document.ondblclick = function ondblclick_(){};
				document.onmouseup = function onclick_(){};
			}
		};


		div.onmouseout = function(){
			if(this.id != 'line'){
				this.className = childObj.outCss;
			}else{
				document.onmouseup = function onclick_(){
					if(MainContextMenu.$)
						MainContextMenu.$.display();
				}
			}
		}

		div.onmousedown = function(){
			//alert(this.name+"这里是测试方法208===="+this.getAttribute('fun')+'("'+this.id+'","'+this.getAttribute('val')+'")')
			try{
				//eval(this.getAttribute('fun')+'("'+this.id+'","'+this.getAttribute('val')+'")')
				eval(this.getAttribute('fun'));
			}catch(exception){
				alert(exception)
			}
		}
//		ie下点击事件为onClick firefox下onclick
//		div.setAttribute("onclick",
//			"javascript:eval(this.getAttribute('fun')+\"('"+id+"','"+text+"')\");"
//		);
		obj.appendChild(div);
	}
}
MainContextMenu.prototype.stringToInt = function(str){
	var newStr = str;
	var type = typeof newStr;
	if(type=="string"){
		var i = newStr.indexOf("px");
		if(i>-1)
			newStr = newStr.substring(0,newStr.length-2);
	}
	return parseInt(newStr);
}
/**
 * 判断是否firefox浏览器
 * true:firefox false:非firefox
 */
MainContextMenu.prototype.checkFirfoxBrowse = function(){
	var returnType = false;
	if(/Firefox/.test(navigator.userAgent))
		returnType = true;
	return returnType;
}

/**
 * 页面右键菜单显示位置为鼠标位置
 * 注:对于非添加在body上的右键事件 firefox会自动调用父右键事件,ie需要自己调用 如方法callContextMenu
 */
document.oncontextmenu = function oncontextmenu_(e){
	if(MainContextMenu.$){
		var eve = e || event;
		var x = eve.pageX || eve.clientX;
		var y = eve.pageY || eve.clientY;
	
		MainContextMenu.$.positionX = x;
		MainContextMenu.$.positionY = y;
		MainContextMenu.$.updatePosition();
		eve.returnValue = false;
		return false;
	}
}
/**
 * 点击页面隐藏右键菜单
 * 在非页面body下调用右键菜单,firefox会自动调用父右键事件,ie需要自己调用
 */
document.onmouseup = function onclick_(){
	if(MainContextMenu.$)
		MainContextMenu.$.display();
}
/**
 * ie需要自己调用方法示例
 * function callContextMenu(){
	if(!/Firefox/.test(navigator.userAgent)){
		oncontextmenu_();
	}
 */
