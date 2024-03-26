/*
*	为workflow设定一些初值
*	id:页面中div的id
*/
/**列分割符*/
var colSplit = ".,";

/**行分割符*/
var rowSplit = ".;";

/**节点图标的宽*/
var Rect_default_width = 80;

/**节点图标的高*/
var Rect_default_hight = 70;

/**节点运行状态图标存储地址*/
var imgRun = "../plugs/workFlow/images/loading.gif";

var WorkFlow = function(id) {

	/*以下是各方法中用到的参数*/
	this.id = id;
	this.divID = "#" + id;
	this.draw = SVG(id); //SVG绘制器
	this.divObj = document.getElementById(id); //绘图用
	this.edges = this.draw.set(); //储存SVG线条的数组
	this.shapes = this.draw.set(); //储存SVG图形的数组
	this.particleSystem = null; //粒子系统，暂时为空
	this.nodeBoxes = {}; //计算包围盒坐标用
	this.selectBox = {
		begin: "",
		end: ""
	}; //包围盒
	this.canvas = "#canvas", //在.html页面中静态创建的canvas元素，其ID须为"canvas"
	this.svg = "svg", //SVG()方法创建的svg元素


	/*以下是鼠标事件中用到的参数*/
	this.selected = null; //选中的节点
	this.nearest = null; //储存最近的节点
	this.dragged = null; //为true则说明当前正处于鼠标按下的状态
	this.reline = null; //用于判断是否处于重连线
	this.sourceNode = null; //连线时的源节点
	this.tempNode = null; //连线时的中间节点，用于连线模式
	this.tempEdge = null; //连线时的中间连线，用于连线模式
	this.targetNode = null; //连线时的目标节点
	this.selectEdge = null; //拖动改变连线时用于保存edge信息
	this.twoway = false; //拖动的边是否双向
	this.mousepoint = null //鼠标位置，由mousemove赋值，keydown取用
	this.bbox = {
		x: 0,
		y: 0
	} //显示窗口的最右下角，在mouseup中赋值，mousemove中取用

	/*以下是一些人为设定好的常量*/
	this.ARROW = true; //true则连线有箭头，false则连线无箭头
	this.CHORECT = 20; //选中时选中框的大小
	this.LINEWIDTH = 2; //工作流中边的粗细
	this.ARROWCOLOR = "red"; //工作流中边的的箭头颜色
	this.LINECOLOR = "black"; //工作流中边的颜色
};

/*
* 有返回值，返回arbor所需的renderer，并且初始化鼠标键盘事件
*/
WorkFlow.prototype.GetRenderer = function() {
	var divID = this.divID;
	var workflow = this;
	var renderer = {
		init: function(system) {
			workflow.particleSystem = system;
			workflow.particleSystem.screenSize($(divID).width(), $(divID).height());
			//根据屏幕的长宽比来计算四周padding
			if (16 / 10.2 < $(divID).width() / $(divID).height() < 16 / 9.8) {
				var top = $(divID).height() * 0.25;
				var left = $(divID).width() * 0.2;
				var down = $(divID).height() * 0.25;
				var right = $(divID).width() * 0.2;
			} else if (4 / 3.2 < $(divID).width() / $(divID).height() < 4 / 2.8) {
				var top = $(divID).height() * 0.28;
				var left = $(divID).width() * 0.28;
				var down = $(divID).height() * 0.28;
				var right = $(divID).width() * 0.28;
			}
			workflow.particleSystem.screenPadding(top, right, down, left);
			workflow.particleSystem.screenStep(0)
			renderer.initMouseHandling();
		},
		redraw: function() {
			workflow._Cleaning()
			if (workflow.ARROW) {
				workflow.particleSystem.eachNode(function(node, pt) {
					workflow._DrawNode(node, pt);
				});
				workflow.particleSystem.eachEdge(function(edge, pt1, pt2) {
					workflow._DrawEdge(edge, pt1, pt2);
				});
			} else {
				workflow.particleSystem.eachEdge(function(edge, pt1, pt2) {
					workflow._DrawEdgeSimple(edge, pt1, pt2);
				});
				workflow.particleSystem.eachNode(function(node, pt) {
					workflow._DrawNode(node, pt);
				});
			}
			workflow.particleSystem.eachNode(function(node, pt) {
				workflow._ShowName(node,pt);
				workflow._ProcessImg(node, pt);
				//workflow._RunState(node, pt);
			});
			workflow._DrawSelectBox();
		},
		initMouseHandling: function() {
			if ($("#canvas").length == 0) {
				var canvas = document.createElement("canvas");
				canvas.setAttribute("id", "canvas");
				$("body").append(canvas);
				$("#canvas").width($(workflow.divID).width());
				$("#canvas").height($(workflow.divID).height());
			}

			$("#canvas").mousedown(function(e) {
				workflow._MouseDown(e, this);
			})

			$("#canvas").mouseup(function(e) {
				workflow._MouseUp(e, this);
			})

			$("#canvas").mousemove(function(e) {
				workflow._MouseMove(e, this);
			})
			
			$(window).mouseleave(function(e){
				workflow._MouseLeave(e, this);
			})
			/**这一段是评比键盘事件*/
			$(window).keydown(function(e) {
				if (e.which == 84) {
					return;
					//将遍历操作绑定在键盘T上(Traversal)
					var p = workflow.mousepoint;
					var choosed = workflow._InShape(p);
					workflow.Traversal(choosed.node);
					alert("遍历结束");
				} else if (e.which == 66) {
					return;
					//将确定begin节点绑定在键盘B上
					var p = workflow.mousepoint;
					var n = workflow.particleSystem.nearest(p); //距鼠标所指位置最近的node
					//alert(n.node.data.title)
					if (n.node.name == "tempNode") {
						//alert("请先退出连线模式")
						return;
					}
					var choosed = workflow._InShape(p);
					if (choosed) {
						workflow.SetBegin(choosed.node);
					}
					choosed = null;
				} else if (e.which == 69) {
					return;
					//将确定end节点绑定在键盘E上
					//alert(mousepoint.x + " " + mousepoint.y)
					var p = workflow.mousepoint;
					var n = workflow.particleSystem.nearest(p); //距鼠标所指位置最近的node
					if (n.node.name == "tempNode")
						return; //在连线中按E无效
					var choosed = workflow._InShape(p);
					p = null;
					n = null;
					choosed = null;
				} else if (e.which == 68) {
					return;
					//删除节点和边绑定在68上
					workflow.DeleteNode();
				} else if (e.which == 67) {
					return;
					//将遍历所有子节点绑定在C 67上
					var p = workflow.mousepoint;
					var n = workflow.particleSystem.nearest(p); //距鼠标所指位置最近的node
					if (n.node.name == "tempNode") return; //在连线中按E无效
					var choosed = workflow._InShape(p);
					if(choosed) workflow.FindChildNode(choosed.node);
					p = null;
					n = null;
					choosed = null;
				} else if (e.which == 70) {
					return;
					//将遍历所有父节点绑定在F 70上
					var p = workflow.mousepoint;
					var n = workflow.particleSystem.nearest(p); //距鼠标所指位置最近的node
					if (n.node.name == "tempNode") return; //在连线中按E无效
					var choosed = workflow._InShape(p);
					if (choosed) {
						workflow.FindFatherNode(choosed.node);
					}
					p = null;
					n = null;
					choosed = null;
				} else if (e.which == 83) {
					return;
					//储存绑定到83 S
					workflow.SaveData();
				} else if (e.which == 76) {
					return;
					//读取绑定到76 L
					workflow.LoadData();
				} else if (e.which == 81) {
					return;
					//增删进度条测试绑定到 81 Q
					workflow.particleSystem.eachNode(function(node, pt) {
						if (node.data.progress) {
							//node.data.progress = false;
						} else {
							//node.data.progress = true;
						}
					})
				} else if (e.which == 82) {
					return;
					//改变运行状态绑定到82 R
					var p = workflow.mousepoint;
					var choosed = workflow._InShape(p, renderer);
					if (choosed) {
						if (!choosed.node.data.run) {
							choosed.node.data.run = "before";
						} else if (choosed.node.data.run == "before") {
							choosed.node.data.run = "after";
						} else if (choosed.node.data.run == "after") {
							choosed.node.data.run = "error";
						} else if (choosed.node.data.run == "error") {
							choosed.node.data.run = "before";
						}
					}
					renderer.redraw();
				}else if (e.which == 86){
					return;
					//恢复屏幕绑定到V
					workflow.particleSystem.screenStep(1);
				}
			}
			);
		},
	}
	return renderer;
}

/*
* 	绘制节点
* 	node:arbor中的node
* 	pt:node在屏幕坐标系中的坐标	pt = {x:,y:,}
*/
WorkFlow.prototype._DrawNode = function(node, pt) {
	if(document.getElementById(node.name)){//如果已经存在该元素,先删除,在重新绘制
		jQuery("#"+node.name).remove();
	}
	var shape = node.data.shape;
	if (shape == "table") {
		this._DrawTable(node, pt);
	} else if (shape == "circle") {
		this._DrawCircle(node, pt);
	} else if (shape == "rectangle") {
		this._DrawRectangle(node, pt);
	} else if (shape == "diamond") {
		this._DrawDiamond(node, pt);
	}
}

/*
*	绘制表格
* 	node:arbor中的node
* 	pt:node在屏幕坐标系中的坐标	pt = {x:,y:,}
*/
WorkFlow.prototype._DrawTable = function(node, pt) {
	var table = document.createElement("table");
	table.setAttribute("id", node.name);
	table.setAttribute("class", node.data.shape);
	table.border = 1;
	table.cellSpacing = 0;

	var ro = node.data.texts.split(rowSplit);
	var txt = new Array();
	for (x in ro) {
		txt[x] = ro[x].split(colSplit);
	}

	for (x in ro) {
		var row = table.insertRow(x);
		for (y in txt[x]) {
			var cell = row.insertCell(y);
			cell.innerHTML = txt[x][y];
			cell.setAttribute("class", "content");
		}
	}

	if (node.data.title) {
		var title = table.insertRow(0);
		var cell = title.insertCell(0);
		cell.innerHTML = node.data.title;
		cell.colSpan = txt[0].length;
		cell.setAttribute("class", "title");
	}

	this.divObj.appendChild(table);
	var po = $(this.divID).children("table#" + node.name);
	var width = $(table).width();
	var height = $(table).height();
	po.css("position", "absolute");
	po.css("left", (pt.x - width / 2) + "px");
	po.css("top", (pt.y - height / 2) + "px");
	po.css("cursor", "default");

	//CTRL选中//是否被ctrl选中
	if (node.data.selected) {
		var chorect = this.draw.rect(width + this.CHORECT, height + this.CHORECT).stroke({width: 1,color: "#5F5F5F"}).fill('none');
		chorect.move(pt.x - (width + this.CHORECT) / 2, pt.y - (height + this.CHORECT) / 2);
	}

	if (node.data.images) {
		this._DrawPic(node, pt);
	}
	this.nodeBoxes[node.name] = [pt.x - width / 2 - 2, pt.y - height / 2 - 2, width + 4, height + 4];
}

/*
*	绘制圆
* 	node:arbor中的node
* 	pt:node在屏幕坐标系中的坐标	pt = {x:,y:,}
*/
WorkFlow.prototype._DrawCircle = function(node, pt) {
	var circle = document.createElement("div");
	circle.setAttribute("id", node.name);
	circle.setAttribute("class", node.data.shape);

	var radius = parseFloat(node.data.radius);
	$(circle).css("width", radius * 2 + "px");
	$(circle).css("height", radius * 2 + "px");

	$(circle).css("border-radius", radius + "px");
	$(circle).css("-moz-border-radius", radius + "px");
	$(circle).css("-webkit-border-radius", radius + "px");

	$(circle).css("position", "absolute");
	$(circle).css("left", (pt.x - radius) + "px");
	$(circle).css("top", (pt.y - radius) + "px");

	//alert(1)
	if (node.name == "tempNode") {
		$(circle).css("opacity", "0"); //连线用的tempnode完全透明
	}
	this.divObj.appendChild(circle);

	//CTRL选中
	if (node.data.selected) {
		var chorect = this.draw.rect(2 * radius + this.CHORECT, 2 * radius + this.CHORECT).fill("none").stroke({width: 1,color: "#5f5f5f"});
		chorect.move(pt.x - (2 * radius + this.CHORECT) / 2, pt.y - (2 * radius + this.CHORECT) / 2);
	}

	if (node.data.images) {
		this._DrawPic(node, pt);
	}
	this.nodeBoxes[node.name] = [pt.x - radius, pt.y - radius, radius * 2, radius * 2];
}

/*
*	绘制矩形
* 	node:arbor中的node
* 	pt:node在屏幕坐标系中的坐标	pt = {x:,y:,}
*/
WorkFlow.prototype._DrawRectangle = function(node, pt) {
	var rectangle = document.createElement("div");
	rectangle.setAttribute("id", node.name);
	rectangle.setAttribute("class", node.data.shape);
	var width = parseFloat(node.data.width);
	var height = parseFloat(node.data.height);
	$(rectangle).css("width", width + "px");
	$(rectangle).css("height", height + "px");
	$(rectangle).css("position", "absolute");
	$(rectangle).css("left", (pt.x - width / 2) + "px");
	$(rectangle).css("top", (pt.y - height / 2) + "px");
	this.divObj.appendChild(rectangle);
	//CTRL选中
	if (node.data.selected) {
		var chorect = this.draw.rect(width + this.CHORECT, height + this.CHORECT).fill("none").stroke({width: 1,color: "#5f5f5f"});
		chorect.move(pt.x - (width + this.CHORECT) / 2, pt.y - (height + this.CHORECT) / 2);
	}
	if (node.data.images) {
		this._DrawPic(node, pt);
	}
	this.nodeBoxes[node.name] = [pt.x - width / 2, pt.y - height / 2, width, height];
}

/*
*	绘制菱形
* 	node:arbor中的node
* 	pt:node在屏幕坐标系中的坐标	pt = {x:,y:,}
*/
WorkFlow.prototype._DrawDiamond = function(node, pt) {
	var base = parseFloat(node.data.base);
	var height = parseFloat(node.data.height);
	var dstring = ' -' + base / 2 + ',0 ' + '0,' + height / 2 + ' ' + base / 2 + ',0 ' + '0,' + '-' + height / 2;
	var diamond = this.draw.polygon(dstring).stroke({width: 1});
	diamond.move(pt.x - base / 2, pt.y - height / 2);
	diamond.attr('id', node.name);
	diamond.attr('class', 'diamond');
	//CTRL选中
	if (node.data.selected) {
		var chorect = this.draw.rect(base + this.CHORECT, height + this.CHORECT).fill("none").stroke({width: 1,color: "#5f5f5f"});
		chorect.move(pt.x - (base + this.CHORECT) / 2, pt.y - (height + this.CHORECT) / 2);
	}
	this.nodeBoxes[node.name] = [pt.x - base / 2, pt.y - height / 2, base, height];
}

/*
*	在图形上方显示图形的别名(alias)，alias存于node.data.alias中，并且可以通过 .NodeName 在css选择器中选中
* 	node:arbor中的node
* 	pt:node在屏幕坐标系中的坐标	pt = {x:,y:,}
*/
WorkFlow.prototype._ShowName = function(node, pt) {
	if (node.data.alias) {
		if (node.data.shape == "table") {
			this._ShowTableName(node,  pt);
		} else if (node.data.shape == "circle") {
			this._ShowCircleName(node, pt);
		} else if (node.data.shape == "rectangle") {
			this._ShowRectangleName(node,pt);
		} else if (node.data.shape == "diamond") {
			this._ShowDiamondName(node,pt);
		}
	}else{
		//alert(406);
	}
}

/*
*显示表格的name
*node:arbor中的node
*pt:node在屏幕坐标系中的坐标	pt = {x:,y:,}
*/
WorkFlow.prototype._ShowTableName = function(node, pt) {
	var table = "#" + node.name;
	var name = document.createElement("div");
	name.innerHTML = node.data.alias;
	name.setAttribute("id", node.name + "name");
	name.setAttribute("class", "NodeName");
	this.divObj.appendChild(name);
	var left = pt.x - ($(table).width()) / 2;
	var top = pt.y - ($(table).height()) / 2 - $(table + "name").height();
	$(name).css("position", "absolute");
	$(name).css("left", left + "px");
	$(name).css("top", top + "px");
}

/*
*	显示圆的name
* 	node:arbor中的node
* 	pt:node在屏幕坐标系中的坐标	pt = {x:,y:,}
*/
WorkFlow.prototype._ShowCircleName = function(node, pt) {
	var circle = "#" + node.name;
	var name = document.createElement("div");
	name.innerHTML = node.data.alias;
	name.setAttribute("id", node.name + "name");
	name.setAttribute("class", "NodeName");
	this.divObj.appendChild(name);
	var radius = parseFloat(node.data.radius);
	var left = pt.x - radius;
	var top = pt.y - radius - $(circle + "name").height();
	$(name).css("position", "absolute");
	$(name).css("left", left + "px");
	$(name).css("top", top + "px");
}

/*
*	显示菱形的name
* 	node:arbor中的node
* 	pt:node在屏幕坐标系中的坐标	pt = {x:,y:,}
*/
WorkFlow.prototype._ShowDiamondName = function(node, pt) {
	var diamond = "#" + node.name;
	var name = document.createElement("div");
	name.innerHTML = node.data.alias;
	name.setAttribute("id", node.name + "name");
	name.setAttribute("class", "NodeName");
	this.divObj.appendChild(name);
	var base = parseFloat(node.data.base);
	var height = parseFloat(node.data.height);
	var left = pt.x - base / 2;
	var top = pt.y - height / 2 - $(diamond + "name").height();
	$(name).css("position", "absolute");
	$(name).css("left", left + "px");
	$(name).css("top", top + "px");
}

/*
*	显示矩形的name
* 	node:arbor中的node
* 	pt:node在屏幕坐标系中的坐标	pt = {x:,y:,}
*/
WorkFlow.prototype._ShowRectangleName = function(node, pt) {
	var rectangle = "#" + node.name;
	var name = document.createElement("div");
	name.innerHTML = node.data.alias;
	name.setAttribute("id", node.name + "name");
	name.setAttribute("class", "NodeName");
	this.divObj.appendChild(name);
	var width = parseFloat(node.data.width);
	var height = parseFloat(node.data.height);
	var left = pt.x - width / 2;
	var top = pt.y - height / 2 - $(rectangle + "name").height();
	$(name).css("position", "absolute");
	$(name).css("left", left + "px");
	$(name).css("top", top + "px");
}

/*
*	在图形中绘制图片，图片的信息储存于 node.data.images中
* 	node:arbor中的node
* 	pt:node在屏幕坐标系中的坐标	pt = {x:,y:,}
*	一个节点中可以有多外图标,但只建议用一个图标就行
*/
WorkFlow.prototype._DrawPic = function(node, pt) {
	var image = node.data.images.split(rowSplit);
	for (x in image) {
		var im = image[x].split(colSplit); //取出每张图片的各个参数
		var isrc = im[0];//第一个参数为图标的路径
		var img = new Image();
		img.src = isrc;
		var iwidth = Rect_default_width;//为图标的宽度
		var iheight = Rect_default_hight;//为图标的高度
		if(node.data.width) width = parseInt(node.data.width);
		if(node.data.height) height = parseInt(node.data.height);
	
		if (!iwidth) iwidth = img.width;//如果不设置,则默认为图标的宽
		if (!iheight)  iheight = img.height;

		var dx = pt.x;
		var dy = pt.y;
		var img = document.createElement("img");
		img.setAttribute("id", node.name + x + "img");
		img.setAttribute("class", "image");
		img.setAttribute("src", isrc);
		if (iwidth && iheight) {
			img.setAttribute("width", iwidth);
			img.setAttribute("height", iheight);
		}
		this.divObj.appendChild(img);
		var pic = $(this.divID).children("img#" + node.name + x + "img");
		pic.css("position", "absolute");
		pic.css("left", (pt.x - iwidth / 2) + "px");
		pic.css("top", (pt.y - iheight / 2) + "px");
		pic.css("z-index", 0);
	}
}

/*
*	绘制无向边
*	edge:arbor中的edge
*	pt1:源node在屏幕坐标系中的坐标
*	pt2:目标node在屏幕坐标系中的坐标
*/
WorkFlow.prototype._DrawEdgeSimple = function(edge, pt1, pt2) {
	this.draw.line(pt1.x, pt1.y, pt2.x, pt2.y).stroke({width: this.LINEWIDTH,stroke: this.LINECOLOR});
}
/*
*	绘制有向边，边可以是单向或者双向
*	edge:arbor中的edge
*	pt1:源node在屏幕坐标系中的坐标
*	pt2:目标node在屏幕坐标系中的坐标
*/
WorkFlow.prototype._DrawEdge = function(edge, pt1, pt2) {
	var tail = this._IntersectLineBox(pt1, pt2, this.nodeBoxes[edge.source.name]);
	var head = this._IntersectLineBox(tail, pt2, this.nodeBoxes[edge.target.name]);

	if (tail.x && tail.y && head.x && head.y) {
		var linelength = Math.sqrt((tail.x - head.x) * (tail.x - head.x) + (tail.y - head.y) * (tail.y - head.y));
		var line = this.draw.line(2, 0, linelength - 2, 0).stroke({width: this.LINEWIDTH,stroke: this.LINECOLOR});
		line.transform({
			x: tail.x,
			y: tail.y,
			rotation: Math.atan2(head.y - tail.y, head.x - tail.x) * (180 / Math.PI),
			cx: tail.x,
			cy: tail.y});
		var arrow = this.draw.polygon('-8,0 -13,8 0,0 -13,-8').fill(this.ARROWCOLOR);
		arrow.transform({
			x: head.x,
			y: head.y,
			rotation: Math.atan2(head.y - tail.y, head.x - tail.x) * (180 / Math.PI),
			cx: head.x,
			cy: head.y});
		if (edge.data.twoway) {
			var Darrow = this.draw.polygon('-8,0 -13,8 0,0 -13,-8').fill(this.ARROWCOLOR);
			Darrow.transform({
				x: tail.x,
				y: tail.y,
				rotation: Math.atan2(tail.y - head.y, tail.x - head.x) * (180 / Math.PI),
				cx: tail.x,
				cy: tail.y});
		}
	}
}

/*以下两个函数均只在_DrawEdge中使用，作用是计算图形的包围盒*/
WorkFlow.prototype._IntersectLineLine = function(p1, p2, p3, p4) {
	var denom = ((p4.y - p3.y) * (p2.x - p1.x) - (p4.x - p3.x) * (p2.y - p1.y));
	if (denom === 0) return false; // lines are parallel
	var ua = ((p4.x - p3.x) * (p1.y - p3.y) - (p4.y - p3.y) * (p1.x - p3.x)) / denom;
	var ub = ((p2.x - p1.x) * (p1.y - p3.y) - (p2.y - p1.y) * (p1.x - p3.x)) / denom;
	if (ua < 0 || ua > 1 || ub < 0 || ub > 1) return false;
	return arbor.Point(p1.x + ua * (p2.x - p1.x), p1.y + ua * (p2.y - p1.y));
}

WorkFlow.prototype._IntersectLineBox = function(p1, p2, boxTuple) {
	var p3 = {x: boxTuple[0],y: boxTuple[1]	};
		w = boxTuple[2];
		h = boxTuple[3];

	var tl = {x: p3.x,y: p3.y};
	var tr = {x: p3.x + w,y: p3.y};
	var bl = {x: p3.x,y: p3.y + h};
	var br = {x: p3.x + w,y: p3.y + h};

	return this._IntersectLineLine(p1, p2, tl, tr) ||
		this._IntersectLineLine(p1, p2, tr, br) ||
		this._IntersectLineLine(p1, p2, br, bl) ||
		this._IntersectLineLine(p1, p2, bl, tl) ||
		false;
}

/*
*	绘制进度条
* 	node:arbor中的node
* 	pt:node在屏幕坐标系中的坐标	pt = {x:,y:,}
*/
WorkFlow.prototype._ProcessImg = function(node, pt) {
	if (node.data.progress) {
		if (node.data.shape == "table") {
			this._GetTableProcessImg(node, pt);
		} else if (node.data.shape == "circle") {
			this._GetCircleProcessImg(node, pt);
		} else if (node.data.shape == "rectangle") {
			this._GetRectangleProcessImg(node, pt);
		} else if (node.data.shape == "diamond") {
			this._GetDiamondProcessImg(node, pt);
		}
	} else {
		this._DeleteProcessImg(node, pt);
	}
}

/*
*	绘制表格的进度条
* 	node:arbor中的node
* 	pt:node在屏幕坐标系中的坐标	pt = {x:,y:,}
*/
WorkFlow.prototype._GetTableProcessImg = function(node,pt){
	var table = "#" + node.name;
	var left = pt.x - ($(table).width()) / 2;
	var top = pt.y + ($(table).height()) / 2;
	var img = document.getElementById(node.name + "img");
	if (!img) { //创建并加载图片
		var img = document.createElement("img");
		img.setAttribute("id", node.name + "img");
		img.setAttribute("class", "progressbar");
		img.setAttribute("src", imgRun);
		this.divObj.appendChild(img);
	}
	$(img).css("position", "absolute");
	$(img).css("left", left + "px");
	$(img).css("top", top + "px");
}

/*
*	绘制圆的进度条
* 	node:arbor中的node
* 	pt:node在屏幕坐标系中的坐标	pt = {x:,y:,}
*/
WorkFlow.prototype._GetCircleProcessImg = function(node,pt){
	var circle = "#" + node.name;
	var radius = parseFloat(node.data.radius);
	var left = pt.x - radius;
	var top = pt.y + radius;
	var img = document.getElementById(node.name + "img");
	if (!img) {
		var img = document.createElement("img");
		img.setAttribute("id", node.name + "img");
		img.setAttribute("class", "progressbar");
		img.setAttribute("src", imgRun);
		this.divObj.appendChild(img);
	}
	$(img).css("position", "absolute");
	$(img).css("left", left + "px");
	$(img).css("top", top + "px");
}

/*
*	绘制矩形的进度条
* 	node:arbor中的node
* 	pt:node在屏幕坐标系中的坐标	pt = {x:,y:,}
*/
WorkFlow.prototype._GetRectangleProcessImg = function(node,pt){
	var rect = "#" + node.name;
	var width = parseFloat(node.data.width);
	var height = parseFloat(node.data.height);
	var left = pt.x - width / 2;
	var top = pt.y + height / 2;
	var img = document.getElementById(node.name + "img");
	if (!img) {
		var img = document.createElement("img");
		img.setAttribute("id", node.name + "img");
		img.setAttribute("class", "progressbar");
		img.setAttribute("src", imgRun);
		img.setAttribute("width", width + 2);
		img.setAttribute("height", 12);
		this.divObj.appendChild(img);
	}
	$(img).css("position", "absolute");
	$(img).css("left", left + "px");
	$(img).css("top", top + "px");
}

/*
*	绘制菱形的进度条
* 	node:arbor中的node
* 	pt:node在屏幕坐标系中的坐标	pt = {x:,y:,}
*/
WorkFlow.prototype._GetDiamondProcessImg = function(node,pt){
	var base = node.data.base;
	var height = node.data.height;
	var left = pt.x - base / 2;
	var top = pt.y + height / 2;
	var img = document.getElementById(node.name + "img");
	if (!img) {
		var img = document.createElement("img");
		img.setAttribute("id", node.name + "img");
		img.setAttribute("class", "progressbar");
		img.setAttribute("src", imgRun);
		this.divObj.appendChild(img);
	}
	$(img).css("position", "absolute");
	$(img).css("left", left + "px");
	$(img).css("top", top + "px");
}

/*
*	删除进度条图片
* 	node:arbor中的node
* 	pt:node在屏幕坐标系中的坐标	pt = {x:,y:,}
*/
WorkFlow.prototype._DeleteProcessImg = function(node,pt){
	var img = '#' + node.name + "img";
	$(img).remove();
}

/*
 *	依照节点的运行状态来改变节点的颜色，节点运行状态信息储存在node.data.run中，节点颜色依靠css选择器来改变
 *  @para node arbor.js的节点
 *  @para pt  节点的坐标
 */
WorkFlow.prototype._RunState = function(node, pt) {
	var n = $("#" + node.name)
	if (node.data.run == "before") {
		n.removeClass("AfterRun").removeClass("ErrorRun").addClass("BeforeRun");
	} else if (node.data.run == "after") {
		n.removeClass("BeforeRun").removeClass("ErrorRun").addClass("AfterRun");
	} else if (node.data.run == "error") {
		n.removeClass("AfterRun").removeClass("BeforeRun").addClass("ErrorRun");
	}
}
/*
*	绘制选择框
*/
WorkFlow.prototype._DrawSelectBox = function() {
	if (this.selectBox.begin && this.selectBox.end) {
		var b = this.selectBox.begin;
		var e = this.selectBox.end;

		var lt = {x: "",y: ""}, rb = {x: "",y: ""};
		var rect = this.draw.rect(Math.abs(b.x - e.x), Math.abs(b.y - e.y)).stroke({color: '#000000',opacity: 0.3,width: 2}).fill("none");
		rect.attr("id", "selectbox");
		if (b.x < e.x && b.y < e.y) {
			rect.move(b.x, b.y);
			lt.x = b.x;
			lt.y = b.y;
			rb.x = e.x;
			rb.y = e.y;
		} else if (b.x < e.x && b.y > e.y) {
			rect.move(b.x, e.y);
			lt.x = b.x;
			lt.y = e.y;
			rb.x = e.x;
			rb.y = b.y;
		} else if (b.x > e.x && b.y < e.y) {
			rect.move(e.x, b.y);
			lt.x = e.x;
			lt.y = b.y;
			rb.x = b.x;
			rb.y = e.y;
		} else if (b.x > e.x && b.y > e.y) {
			rect.move(e.x, e.y);
			lt.x = e.x;
			lt.y = e.y;
			rb.x = b.x;
			rb.y = b.y;
		}
		this.selectBox.lt = lt;
		this.selectBox.rb = rb;
	}
}

/**
 *	清除所有元素
 */
WorkFlow.prototype._Cleaning = function() {
	$(this.divID).children(".table").remove();
	$(this.divID).children(".circle").remove();
	$(this.divID).children(".rectangle").remove();
	$(this.divID).children(".diamond").remove();
	$(this.divID).children(".image").remove();
	$(this.divID).children(".NodeName").remove();
	//alert('into')
	this.draw.clear();
}

/*
*	选取多个节点的时候为选中的节点创建一个节点集，用于一次拖动多个节点
*	c:鼠标点击位置在particleSystem坐标系中的坐标
*/
WorkFlow.prototype._NodeSet = function(c) {
	var set = {node: [],point: "",useable: false};
	var setp = {x: 0,y: 0};
	var setn = 0;

	this.particleSystem.eachNode(function(node, pt) {
		if (node.data.selected) {
			setn = setn + 1;
			setp.x = setp.x + node.p.x;
			setp.y = setp.y + node.p.y;
			node.data.dx = node.p.x - c.x;
			node.data.dy = node.p.y - c.y;
			set.node.push(node);
			set.useable = true;
		}
	})
	if (setn !== 0) {
		setp.x = setp.x / setn;
		setp.y = setp.y / setn;
	}
	set.point = setp;
	return set;
}

/*
*	按照顺序来遍历节点
*	node:遍历的起点节点
*/
WorkFlow.prototype.Traversal = function(node) {
	var edges = this.particleSystem.getEdgesFrom(node);
	/**
	*在这里插入需要做的操作==============待续
	*/
	for(x in edges){
		var nextnode = edges[x].target;
		if (nextnode) this.Traversal(nextnode);
	}
}

/*
*找到前一个节点的结果属性
*node:遍历的起点
*/
WorkFlow.prototype.PriorNodeResult = function(nodeId) {
	var node  = this.particleSystem.getNode(nodeId);
	var edges = this.particleSystem.getEdgesTo(node);
	var i = 0;
	var rsource = "";
	for (x in edges){
		priornode = edges[x].source;
		if(priornode.data.resultXml){
			if(i>0) rsource += ";";
			rsource += decode(priornode.data.resultXml);
			i++;
		}
	}
	return encode(rsource);
}

/*
*按照顺序遍历选中节点的父节点,只是找父亲节点,不找祖先节点
*node:遍历的起点
*/
WorkFlow.prototype.FindFatherNode = function(node) {
	var pnode = [];
	var edges = this.particleSystem.getEdgesTo(node);
	if(node.data.typeId == "2") return;//这是数据源节点的情况
	for (n in edges) {
		prevnode = edges[n].source;
		if(prevnode.data.typeId == "2") continue;
		if(prevnode) pnode.push(prevnode);
	}
	return pnode;
}


/*
* 按照顺序遍历选中节点的子节点
* node:遍历的起点
*/
WorkFlow.prototype.FindChildNode = function(node){
	var edges = this.particleSystem.getEdgesFrom(node);
	alert(node.data.typeId + "==father====898=====待续====== "+node.data.alias);
	if(node.data.typeId == "2") return;
	for (cn in edges){
		nextnode = edges[cn].target;
		if(nextnode) this.FindChildNode(nextnode);
	}
}

/*
*		"nodes":{"A":{"alias":"one table","shape":"table","title":"table 123","texts":"example","images":"img1.jpg","x":644,"y":367},
*				 "B":{"alias":"one circle","shape":"circle","radius":50,"images":"img2,jpg","x":123,"y":456},
*				 "C":{"alias":"one rectangle","shape":"rectangle","width":100,"height":80,"images":"img3.jpg","x":123,"y":456},
*				 },
*		"edges":{"A":{"B":{"twoway":true},"C":{"twoway":false}},
*				 "B":{"C":{"twoway":true}}
*				}
*			将当前屏幕中的节点与边用xml的格式储存到本地
*			另外节点还增加了 algoCd(算法代码),typeId(节点类型),mainUrl(参数页面url),resultXml(当前元素所产生的结果数据);
*/
WorkFlow.prototype.SaveData = function() {
	var workflow = this;
	var nodes = '{';
	var edges = '{';
	var n = 0;
	this.particleSystem.eachNode(function(node, pt) {

		if(n>0) nodes += ",";
		if(node.name!="1" && node.name!="2"){
			nodes += '"' + node.name + '":{';//这里相当于节点的ID及唯一关键字
			if (node.data.alias) {//如果节点有属性
				nodes += '"alias":' + '"' + node.data.alias + '",';
			}
			if (node.data.algoCd) {//节点的算法代码
				nodes +=  '"algoCd":' + '"' + node.data.algoCd + '",';
			}
			if (node.data.typeId) {//节点的类型ID
				nodes +=  '"typeId":' + '"' + node.data.typeId + '",';
			}
			if (node.data.mainUrl) {//所对应的参数页面
				nodes +=  '"mainUrl":' + '"' + node.data.mainUrl + '",';
			}
			if (node.data.resultXml) {//所对应的参数页面
				nodes +=  '"resultXml":' + '"' + node.data.resultXml + '",';
			}
			if (node.data.description) {//如果节点有说明
				nodes +=  '"description":' + '"' + node.data.description + '",';
			}
			if (node.data.shape) {//节点的形状
				nodes += '"shape":' + '"' + node.data.shape + '",';
			}
			if (node.data.title) {//节点有标题
				nodes += '"title":' + '"' + node.data.title + '",';
			}
			if (node.data.texts) {//节点的文字内容
				nodes += '"texts":' + '"' + node.data.texts + '",';
			}
			if (node.data.images) {//节点中的小图标
				nodes += '"images":' + '"' + node.data.images + '",';
			}
			if (node.data.radius) {//如果节点是圆,此时是圆的半径
				nodes += '"radius":' + '"' + node.data.radius + '",';
			}
			if (node.data.base) {
				nodes += '"base":' + '"' + node.data.base + '",';
			}
			if (node.data.height) {//节点的高
				nodes += '"height":' + '"' + node.data.height + '",';
			}
			if (node.data.width) {//节点的宽
				nodes += '"width":' + '"' + node.data.width + '",';
			};
			nodes += '"x":' + Math.round(pt.x) + ',';
			nodes += '"y":' + Math.round(pt.y);
			nodes += '}';//节点属性组装完毕
	
			//下面是根据边找子节点
			var en = workflow.particleSystem.getEdgesFrom(node);
			if(n>0) edges += ",";
			edges += '"' + node.name + '":{';//这里相当于节点的ID及唯一关键字
			var sonNode;//子节点
			var sj = 0;
			for (x in en) {
				sonNode = en[x].target;
				if(sonNode.name!="1" && sonNode.name!="2"){//这里是因为界面上默认的加了两个点
					if(sj>0) edges += ',';
					if (en[x].data.twoway) edges += '"'+sonNode.name + '":{"twoway":true}';
					else edges += '"'+sonNode.name + '":{"twoway":false}';
					sj++;
				}
			}
			edges += '}';
			n++;
		}
	})
	nodes += '}';
	edges += '}';
	var wfInfo = '{"nodes":'+nodes+',"edges":'+edges+'}';//整个工作流数据
	return wfInfo;
}


/*
*	读取储存的节点与边的信息
*		其数据格式为,
*			{"nodes":{"A":{"alias":"one table","shape":"table","title":"table 123","texts":"example","images":"img1.jpg","x":644,"y":367},
*						 "B":{"alias":"one circle","shape":"circle","radius":50,"images":"img2,jpg","x":123,"y":456},
*						 "C":{"alias":"one rectangle","shape":"rectangle","width":100,"height":80,"images":"img3.jpg","x":123,"y":456},
*						 },//这里是节点的集合信息
*				"edges":{"A":{"B":{"twoway":true},"C":{"twoway":false}},//这里为边的关系
*						 "B":{"C":{"twoway":true}}
*						}
*			}
*			另外节点还增加了 algoCd(算法代码),typeId(节点类型),mainUrl(参数页面url);
*/
WorkFlow.prototype.LoadData = function(jsonData){
	this.particleSystem.screenStep(1); //在mousedown方法的最开始加了一个screenStep(0)
	this.particleSystem.screenSize($(this.divID).width(), $(this.divID).height());
	this.clearPanel();//清空面板
	this.particleSystem.merge(jsonData);
}

/*
*	清空整个工作流面板
*/
WorkFlow.prototype.clearPanel = function(){
	var workflow = this;
	this.particleSystem.eachNode(function(node, pt) {
		workflow.particleSystem.pruneNode(node);//arbor.js删除节点的方法
	});
	$('img').remove();//除去进度条图片
}


/*
*	删除节点和线条
*	node：需要删除的节点
*	最好用鼠标框选中要删除的对象
*/
WorkFlow.prototype.DeleteNode = function() {
	var p = this.mousepoint;
	var set = this._NodeSet(p);
	if( set.useable == true){
		for( x in set.node){
			workflow.particleSystem.pruneNode(set.node[x]);
		}
		set.useable = false;
	}else{
		var choosed = workflow._InShape(p);
		if(choosed){
			workflow.particleSystem.pruneNode(choosed.node);
		}else if (workflow._InEdge(p)) {
			workflow.particleSystem.pruneEdge(workflow._InEdge(p));
		}
	}
}

/*
*	删除边
*	edge：需要删除的边
*/
WorkFlow.prototype.DeleteEdge = function(edge) {
	this.particleSystem.pruneEdge(edge);
}

/*
*	增加节点
*	name:节点的id
*	data:需要增加的节点信息 data中所需信息详见 说明文档
*	例:
*		name:"ExpNode" //节点唯编号arbor.js用到,字符串;
*		data = {
*				"alias":"nodename", //为节点的别名,可以为空;
*				"shape":"circle",   //节点的图票形状
*				"radius": 35,       //如果是圆
*				"images":"d:/save.png",//节点上显示的小图标
*				......
*			}
*/
WorkFlow.prototype.AddNode = function(name,data){
	//var data = eval(data);
	if(!data.shape || data.shape==undefined) data.shape="rectangle";//新加入的节点形状也可以为空,如果为空则默认为矩形
	if(data.shape=="rectangle"){//矩形时给出默认的宽高
		if(!data.width || data.width==undefined)  data.width = Rect_default_width;
		if(!data.height || data.height==undefined) data.height = Rect_default_hight;
	}
	this.particleSystem.addNode(name,data);
}

/*
*	判断鼠标所指坐标是否在某个图形内，若是则返回图形的node
*	pt:鼠标所指坐标
*/
WorkFlow.prototype._InShape = function(pt) {
	var st = new Array(); //用于存放node的数组
	var choosedNode = null;
	this.particleSystem.eachNode(function(node, pt) {
		st.push(node); //把所有nodes存入st中
	});
	for (x in st) {
		var n = {node: "", point: "", distance: "", dx: "", dy: ""};
		n.node = st[x];
		n.point = st[x].p;
		var dpt = this.particleSystem.fromScreen(pt);
		//计算鼠标点击位置距离节点中心的坐标差
		n.dx = n.point.x - dpt.x;
		n.dy = n.point.y - dpt.y;
		var center = this.particleSystem.toScreen(n.point); //n.point.x = n.node.p.x  n.point.y = n.node.p.y
		n.distance = Math.sqrt((center.x - pt.x) * (center.x - pt.x) + (center.y - pt.y) * (center.y - pt.y));
		var b = this._InNode(n, pt, center);
		if (b) choosedNode = n;
	}
	return choosedNode;
}

/*
*	_InShape方法中用到的子方法
*/
WorkFlow.prototype._InNode = function(nearest, pt, center) {
	var n = nearest, p = pt;
	var inTheNode = false;
	var sp = center;
	if (n.node.data.shape == "table" || n.node.data.shape == undefined) {
		var table = "#" + n.node.name;
		n.node.data.beginX = center.x - $(table).width() / 2;
		n.node.data.endX = center.x + $(table).width() / 2;
		n.node.data.beginY = center.y - $(table).height() / 2;
		n.node.data.endY = center.y + $(table).height() / 2;
		if (p.x > n.node.data.beginX && p.x < n.node.data.endX && p.y > n.node.data.beginY && p.y < n.node.data.endY) {
			inTheNode = true;
		}
		table = null;
	} else if (n.node.data.shape == "circle") {
		if (n.distance <= n.node.data.radius) { //拖动圆
			inTheNode = true;
		}
	} else if (n.node.data.shape == "diamond") {
		var top = {x: sp.x,y: sp.y - (n.node.data.height) / 2};
		var bottom = {x: sp.x, y: sp.y + (n.node.data.height) / 2};
		var left = {x: sp.x - (n.node.data.base) / 2,y: sp.y};
		var right = {x: sp.x + (n.node.data.base) / 2,y: sp.y};

		var ptop = {x: top.x - p.x,	y: top.y - p.y};
		var pbottom = {x: bottom.x - p.x,y: bottom.y - p.y};
		var pleft = {x: left.x - p.x, y: left.y - p.y};
		var pright = {x: right.x - p.x,y: right.y - p.y};

		var x1 = ptop.x, y1 = ptop.y, x2 = pleft.x,	y2 = pleft.y;
		var thetatl = Math.acos(((x1 * x2) + (y1 * y2)) / (Math.sqrt(x1 * x1 + y1 * y1) * Math.sqrt(x2 * x2 + y2 * y2)));
		x1 = pleft.x;
		y1 = pleft.y;
		x2 = pbottom.x;
		y2 = pbottom.y;

		var thetalb = Math.acos(((x1 * x2) + (y1 * y2)) / (Math.sqrt(x1 * x1 + y1 * y1) * Math.sqrt(x2 * x2 + y2 * y2)));
		x1 = pbottom.x;
		y1 = pbottom.y;
		x2 = pright.x;
		y2 = pright.y;

		var thetabr = Math.acos(((x1 * x2) + (y1 * y2)) / (Math.sqrt(x1 * x1 + y1 * y1) * Math.sqrt(x2 * x2 + y2 * y2)));
		x1 = pright.x;
		y1 = pright.y;
		x2 = ptop.x;
		y2 = ptop.y;

		var thetart = Math.acos(((x1 * x2) + (y1 * y2)) / (Math.sqrt(x1 * x1 + y1 * y1) * Math.sqrt(x2 * x2 + y2 * y2)));
		var sum = thetatl + thetalb + thetabr + thetart;
		if (sum < 6.284 && sum > 6.282 && n.distance < (n.node.data.base) / 2) {
			inTheNode = true;
		}
	} else if (n.node.data.shape == "rectangle") {
		n.node.data.beginX = center.x - n.node.data.width / 2;
		n.node.data.endX = center.x + n.node.data.width / 2;
		n.node.data.beginY = center.y - n.node.data.height / 2;
		n.node.data.endY = center.y + n.node.data.height / 2;
		if (p.x > n.node.data.beginX && p.x < n.node.data.endX && p.y > n.node.data.beginY && p.y < n.node.data.endY) inTheNode = true;
	}
	//在之后还有别的图形的话需要自己加入 		
	n = null;
	sp = null;
	p = null;
	return inTheNode;
}

/*
*	判断鼠标所指坐标是否在某条边上，若是则返回这条边
*	p:鼠标所指坐标
*/
WorkFlow.prototype._InEdge = function(p) {
	var choosedEdge = false;
	//拖动边
	this.particleSystem.eachEdge(function(edge, pt1, pt2) {
		var x1 = pt1.x;
		var x2 = pt2.x;
		var y1 = pt1.y;
		var y2 = pt2.y;
		var x = p.x;
		var y = p.y;
		var vector; //计算鼠标坐标到pt1,pt2的矢量积  在两个节点距离很近的情况下，边的选择可能会出BUG
		vector = (x1 - x) * (x2 - x) + (y1 - y) * (y2 - y);
		//用点到直线距离公式计算鼠标坐标到edge的距离
		var tempd = Math.abs((y2-y1)*x+(x1-x2)*y+(y1*(x1+x2)-x1*(y1+y2))) / Math.sqrt((y2-y1)*(y2-y1)+(x1-x2)*(x1-x2));
		if (tempd < 7 && vector < 0) choosedEdge = edge;
	});
	return choosedEdge;
}


/*
*	鼠标移动事件
*	e:事件的event
*	thisEle:事件绑定对象的id
*/
WorkFlow.prototype._MouseMove = function(e, thisEle) {
	var old_nearest = this.nearest && this.nearest.node._id;
	var pos = $(thisEle).offset();
	var s = {x: e.pageX - pos.left,y: e.pageY - pos.top};
	this.mousepoint = {x: s.x,y: s.y};
	this.nearest = this.particleSystem.nearest(s);
	var c = this.particleSystem.fromScreen(s);
	if (!this.nearest) return;
	if (this.dragged !== null && this.dragged.node !== null) {
		if (this.reline == null) this._DragMoveNode(s);
		else this._RelineMoveTempNode(s);
		//alert("pruned!");
	} else if (this.dragged == null) {
		//鼠标移动时没有拖拽节点,那么可能是进入了连线模式
		this._LineMoveTempNode(s);
	}
	return false;
}

/*
*	连线期间线条的移动
*	s:鼠标所指屏幕坐标
*/
WorkFlow.prototype._LineMoveTempNode = function(s) {
	if (this.tempNode !== null) {
		var p = this.particleSystem.fromScreen(s);
		this.tempNode.p = {x: p.x,y: p.y};
	}
}

/*
* 重连线期间线条移动
* s:鼠标所指屏幕坐标
*/
WorkFlow.prototype._RelineMoveTempNode = function(s) {
	var p = this.particleSystem.fromScreen(s);
	this.dragged.node.p = {x: p.x,y: p.y};
	this.particleSystem.pruneEdge(this.selectEdge);
	this.selectEdge = null;
	var tedge = this.particleSystem.addEdge(this.sourceNode, this.dragged.node, {"twoway": this.twoway});
}

/*
*	节点的移动
*	s:鼠标所指屏幕坐标
*/
WorkFlow.prototype._DragMoveNode = function(s){
	var p = this.particleSystem.fromScreen(s);
	if (this.dragged == "blank") {
		this.selectBox.end = s;
		if (this.selectBox.lt) {
			var lt = this.selectBox.lt;
			var rb = this.selectBox.rb;
			this.particleSystem.eachNode(function(node, pt) {
				if (pt.x > lt.x && pt.x < rb.x && pt.y > lt.y && pt.y < rb.y) {
					node.data.selected = true;
					node.mass = 0.1;
				} else {
					node.data.selected = false;
					node.mass = 0.1;
				}
			});
		}
	} else if (this.dragged.useable) {
		for (x in this.dragged.node) {
			this.dragged.node[x].p = {
				x: p.x + this.dragged.node[x].data.dx,
				y: p.y + this.dragged.node[x].data.dy
			} //将选中的一组节点移动位置
		}
	} else {
		this.dragged.node.p = {
			x: p.x + this.dragged.dx,
			y: p.y + this.dragged.dy
		}; //将选中的节点坐标移到鼠标所指位置
	}
	this.particleSystem.pruneNode(this.tempNode);
	this.sourceNode = null;
}

/*
*	鼠标按下的事件
*	e:事件的event
*	thisEle:事件绑定对象的id
*/
WorkFlow.prototype._MouseDown = function(e, thisEle) {
	//e.button = 0 左键， 1 中键， 2 右键，
	this.particleSystem.screenStep(0); //点击可能触发拖动，把screenStep设为0可不让particleSystem的坐标系发生变化
	this.particleSystem.eachNode(function(node, pt) {
		node.mass = 0.1;
	})
	var pos = $(thisEle).offset();
	var p = {x: e.pageX - pos.left,y: e.pageY - pos.top}; //鼠标点击位置的屏幕坐标系坐标
	var n = this.particleSystem.nearest(p); //离鼠标点击位置最近的一个节点
	var c = this.particleSystem.fromScreen(p); //鼠标点击位置的particleSystem坐标系坐标
	var center = this.particleSystem.toScreen(n.point); //离鼠标最近节点的坐标

	if (e.button == 0) {
		var set = this._NodeSet(c);
		if (set.useable) {
			this.dragged = set; //如果选中的是多个节点，那么拖动多个节点
		} else if (this.sourceNode == null) {
			//sourceNode为空，说明现在还没进入选择连线模式
			if (this._InShape(p) !== null) {
				this._InitialDragAndSelect(n,p,c);
			} else if (this._InEdge(p)) {
				this._RelineSelectLine(p,c);
			} else {
				this._SelectBoxBeginPoint(p);
			}
		} else if (this.sourceNode !== null) {
			//sourceNode不为空，那么说明已经进入了选择连线模式
			this._LineSelectNode(p);
		}
	}
	return false;
}
/*
*	初始化节点的拖动
*	n:particleSystem.nearest()函数返回值
*	p:鼠标所指屏幕坐标
*	c:鼠标所指屏幕坐标转化在particleSystem坐标系中的坐标
*/
WorkFlow.prototype._InitialDragAndSelect = function(n,p,c) {
	//按下鼠标时可能会进行拖动操作，或者进行连线绘制动作，因此selected和sourceNode都需要赋值
	this.selected = this.nearest = this.dragged = this._InShape(p);
	this.sourceNode = n.node;
	this.tempNode = this.particleSystem.addNode("tempNode", {shape: "circle",radius: "1",x: c.x,y: c.y});
	this.tempEdge = this.particleSystem.addEdge(this.sourceNode, this.tempNode);
}

/*
*	初始化重连线
*	p:鼠标所指屏幕坐标
*	c:鼠标所指屏幕坐标转化在particleSystem坐标系中的坐标
*/
WorkFlow.prototype._RelineSelectLine = function(p, c) {
	var edge = this._InEdge(p);
	this.reline = true;
	this.selectEdge = edge;
	this.twoway = this.selectEdge.data.twoway;
	this.tempNode = this.particleSystem.addNode("tempNode",{shape: "circle",radius: "0.1",	x: c.x,y: c.y});
	var nearest = this.particleSystem.nearest(p);//选中了tempnode
	this.dragged = nearest; //拖动边时要一直按下鼠标，因此一直选中tempnode
	this.sourceNode = this.selectEdge.source;
	this.targetNode = this.selectEdge.target;
}

/*
*	初始化连线
*	p:鼠标所指屏幕坐标
*/
WorkFlow.prototype._LineSelectNode = function(p) {
	//需重新定位nearest，因为之前的nearest肯定是tempnode(它一直处在鼠标所指位置)
	this.particleSystem.pruneNode(this.tempNode);
	this.tempNode = null;
	n = this.particleSystem.nearest(p);
	var to = this.particleSystem.getEdges(this.sourceNode, n.node);
	var from = this.particleSystem.getEdges(n.node, this.sourceNode); //to和from中都只有一条边
	var choosed = this._InShape(p);
	if (to[0] == undefined && from[0] == undefined) {
		if (choosed !== null) {
			this.targetNode = choosed.node;
			this.particleSystem.addEdge(this.sourceNode, this.targetNode);
		}
	} else if (to[0] == undefined && from[0] !== undefined) {
		if (choosed !== null) {
			from[0].data.twoway = true;
		}
	}
	//无论是否完成新连线，在进入连线模式状态下点击鼠标左键均会退出连线模式
	this.sourceNode = null;
	this.targetNode = null;
}

/*
*	绘制选择框的起点坐标
*	p:鼠标所指屏幕坐标
*/
WorkFlow.prototype._SelectBoxBeginPoint = function(p) {
	//画方框的起点坐标
	this.selectBox.begin = p;
	this.dragged = "blank";
}

/*
*	鼠标抬起的事件
*	e:事件的event
*	thisEle:事件绑定对象的id
*/
WorkFlow.prototype._MouseUp = function(e, thisEle) {
	//e.button = 0左键,1中键,2右键，
	//e.which  = 1左键,2中键,3右键
	//alert(e.button)
	this.particleSystem.eachNode(function(node, pt) {
		node.mass = 0.1;
	})
	if (document.getElementById('menu')) {
		/*若已经有右键菜单，则先删除当前右键菜单*/
		var child = document.getElementById('menu');
		child.parentNode.removeChild(child);		
	}

	var pos = $(thisEle).offset();
	var p = {x: e.pageX - pos.left,y: e.pageY - pos.top};
	if (e.which == 1) {
		//alert(this.dragged)
		if (this.dragged == null) {
			/*dragged为null说明当前没有拖动节点*/
			return;
		} else {
			if (this.reline) this._RelineSelectTarget(p);
			this.reline = null;//无论是否重连成功，reline都结束
		}
	} else if (e.which == 3) {
		this._CreateContextMenu(p);
	}

	/*如果拖动的是选中的多个节点，在拖动完成时需要将所有选中的节点释放*/
	this._ReleaseNodeSet();

	/*以下代码作用是当有节点超出屏幕时动态改变屏幕分辨率*/
	this._WindowAdaption();
	return false;
}

/*
*	重连线选择重连目标
*	p:鼠标所指屏幕坐标
*/
WorkFlow.prototype._RelineSelectTarget = function(p) {
	this.particleSystem.pruneNode(this.tempNode);
	var n = this.particleSystem.nearest(p); //距鼠标所指位置最近的node
	var c = this.particleSystem.fromScreen(p); //将鼠标所指canvas坐标转变成在particlesystem中的坐标
	var to = this.particleSystem.getEdges(this.sourceNode, n.node);
	var from = this.particleSystem.getEdges(n.node, this.sourceNode);
	var center = this.particleSystem.toScreen(n.point);
	var choosed = this._InShape(p);

	if (from[0] !== undefined || to[0] !== undefined) {
		//如果所选节点与重连的目标节点之间已经有连线，那么重连会取消
		this.particleSystem.addEdge(this.sourceNode, this.targetNode, {
			"twoway": this.twoway
		});
	} else {
		if (choosed) {
			//如果所选节点与重连的目标节点之间没有连线，那么重连完成
			var haveedge = this.particleSystem.getEdges(this.sourceNode, choosed.node);
			this.particleSystem.addEdge(this.sourceNode, choosed.node, {
				"twoway": this.twoway
			});
		} else {
			//松开鼠标时指针没有指向图形内，那么重连会取消
			this.particleSystem.addEdge(this.sourceNode, this.targetNode, {
				"twoway": this.twoway
			});
		}
	}
	this.sourceNode = null;
	this.targetNode = null;
}


/*
*若移动的是多个节点，移动完成后清空节点集
*/
WorkFlow.prototype._ReleaseNodeSet = function() {
	if (this.dragged != null && this.dragged.useable == true) {
		for (x in this.dragged.node) {
			this.dragged.node[x].data.selected = false;
		}
	}
	this.selectBox = {begin: "",end: ""};
	this.dragged = null;
	this.selected = null;
}

/*
* 若有节点移出屏幕，那么会自适应出现滚动条
*/
WorkFlow.prototype._WindowAdaption = function() {
	var workflow = this;
	this.particleSystem.eachNode(function(node, pt) {
		var obj = $("#" + node.name);
		if (parseInt(obj.width()) == 0 || obj.width() == "NaNpx") {
			obj = SVG.get(node.name);
		}
		if (pt.x + obj.width() / 2 > workflow.bbox.x) {
			workflow.bbox.x = pt.x + obj.width() / 2;
		}

		if (pt.y + obj.height() / 2 > workflow.bbox.y) {
			workflow.bbox.y = pt.y + obj.height() / 2;
		}
	})

	var pos = $(this.divID).offset();

	if (this.bbox.x > $(window).width()) {
		$(this.divID).width(this.bbox.x);
		$(this.svg).width(this.bbox.x);
		$(this.canvas).width(this.bbox.x);
	} else {
		$(this.divID).width($(window).width() - pos.left);
		$(this.svg).width($(window).width() - pos.left);
		$(this.canvas).width($(window).width() - pos.left);
	}
	if (this.bbox.y > $(window).height()) {
		$(this.divID).height(this.bbox.y);
		$(this.svg).height(this.bbox.y);
		$(this.canvas).height(this.bbox.y);
	} else {
		$(this.divID).height($(window).height() - pos.top);
		$(this.svg).height($(window).height() - pos.top);
		$(this.canvas).height($(window).height() - pos.top);
	}

	this.bbox.x = 0;
	this.bbox.y = 0;//重新归零
}

/*
*	根据所给ID和节点新别名来修改节点的别名
*	nodeId:节点的id
*	nodeName:节点的新别名
*/
WorkFlow.prototype.ChangeName = function(nodeId,nodeName){
	var node = this.particleSystem.getNode(nodeId);
	node.data.alias = nodeName;
}

/*
*	接收节点ID，返回节点的对象
*	nodeId:节点的id
*/
WorkFlow.prototype.GetNode = function(nodeId){
	var node = this.particleSystem.getNode(nodeId);
	return node;
}

/*
*	若在操作时鼠标移出workflow窗口，则释放所有参数以免产生BUG
*/
WorkFlow.prototype._MouseLeave = function(e, thisEle) {
	try{
		this._ReleaseNodeSet();
		if (this.reline) {
			//如有重连则取消重连
			this.particleSystem.addEdge(this.sourceNode, this.targetNode, {
				"twoway": this.twoway
			});
			this.reline = null;
		}
		this.particleSystem.pruneNode("tempNode");
		this.sourceNode = null;
		this.targetNode = null;
		this.tempNode = null; 
		this.tempEdge = null;
		this.twoway = false;
		this.nearest = null;
		this.selected = null;
	}catch(e){
	}
}

/*
*如果数据源发生变化时,删除所有子节点的相关属性
*删除子节点的相关属性(styleXml,nodeXml,resultXml)
*/
WorkFlow.prototype.clearChildAttr = function() {
	var p = this.mousepoint;
	var choosed = workflow._InShape(p);
	var curNode;
	if(choosed){//被选中的是节点
		curNode = choosed.node;
	}else if (workflow._InEdge(p)) {//被选中的是边即箭线
		var curEdge = workflow._InEdge(p);
		curNode = curEdge.source;
	}
	workflow.removeChildAttr(curNode.name);
}


/*
*	nodeId:当前节点对象ID号
*	删除当前对象中所有子节点的相关属性(styleXml,nodeXml,resultXml),注意:不包括当前对象
*	如果当前节点或者连线被删除,那么子节点的所有设置信息都将重新设置
*/
WorkFlow.prototype.removeChildAttr = function(nodeId) {
	var node  = this.particleSystem.getNode(nodeId);
	var edges = this.particleSystem.getEdgesFrom(node);
	try{
		for (x in edges) {
			nextnode = edges[x].target;
			if (nextnode){
				nextnode.data.styleXml = "";
				nextnode.data.nodeXml = "";
				nextnode.data.resultXml = "";	
				this.removeChildAttr(nextnode.name);
			}
		}
	}catch(e){}
}


/*
*	创建右键菜单
*	p:鼠标所指屏幕坐标
*/
WorkFlow.prototype._CreateContextMenu = function(p) {
	if (this.tempNode !== null) {
		/*若在右键时处于连线状态，则会先取消连线*/
		this.particleSystem.pruneNode(this.tempNode);
		this.sourceNode = null;
		this.targetNode = null;
	}
	var n = this.particleSystem.nearest(p); //距鼠标所指位置最近的node
	var c = this.particleSystem.fromScreen(p); //将鼠标所指canvas坐标转变成在particlesystem中的坐标
	var center = this.particleSystem.toScreen(n.point);
	
	var treeMenu = null;//右键菜单
	var choosed = this._InShape(p);
	if (choosed) {
		var curNode = choosed.node;//当前节点
		treeMenu = new MainContextMenu('menu', null, null);
		var algoCd =  curNode.data.algoCd;
		if(algoCd!="run"){
			treeMenu.addNode('a', '参数设置', 'rParamSetting("'+curNode.name+'","'+curNode.data.mainUrl+'")');
		}
		var typeId =  curNode.data.typeId;
		if(typeId=="2"){//如果是数据源
			treeMenu.addNode('b', '数据浏览', 'rViewData("'+curNode.name+'")');
		}else{//如果是算法节点
			treeMenu.addNode('c', '节点运行', 'rNodeRun("'+curNode.name+'")');
			treeMenu.addNode('d', '结果查看', 'rViewResult("'+curNode.name+'")');
		}
		treeMenu.addLine();
		if(algoCd=="run"){
			treeMenu.addNode('e', '设为任务', 'rTimerTask("'+curNode.name+'")');
		}
		treeMenu.addNode('g', '节点命名','rNodeReName("'+curNode.name+'")');
		treeMenu.addNode('f', '删除节点', 'rDelSelect()');
		treeMenu.create();
	} else if (this._InEdge(p)) {
		var edge = this._InEdge(p);
		treeMenu = new MainContextMenu('menu', null, null);
		treeMenu.addNode('l', '删除箭线', 'rDelSelect()');
		treeMenu.create();
	}
}