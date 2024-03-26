/**
 *modify by chenbin
 *在350左右修改一些配置参数
 *
 */
//var imgPath="images/";//此变量最好拿到引用的jsp中去定义

BALNode = function (id, pid, dsc, target,topAttr,bottomAttr,tStr,tableHeadColor,tableBorderColor,tableBodyColor,w,h,c,bc) {
	this.id = id;//节点ID;
	this.pid = pid;//父节点ID
	this.dsc = dsc;//节点描述及名称
	this.w = w;//节点宽度
	this.h = h;//节点高度
	this.c = c;//节点的颜色
	this.bc = bc;//节点边框
	this.target = target;//节点的链接
	this.tableStr = tStr;//表格内容
	this.tableHeadColor = tableHeadColor;//内容表格头的颜色
	this.tableBorderColor = tableBorderColor;//内容表格边框的颜色
	this.tableBodyColor = tableBodyColor;//内容表格背景色
	this.ta = topAttr;//节点上属性
	this.ba = bottomAttr;//节点下属性
	this.level = 0;//节点层次
	
	this.siblingIndex = 0;
	this.dbIndex = 0;
	
	this.XPosition = 0;
	this.YPosition = 0;
	this.XOffSet = 0;
	this.YOffSet = 0; // y轴的偏移
	this.modifier = 0;
	this.leftNeighbor = null;
	this.rightNeighbor = null;
	this.nodeParent = null;	
	this.nodeChildren = [];
	this.isCollapsed = false;
	this.canCollapse = false;
	this.isSelected = false;
}

BALNode.prototype._getLevel = function () {
	if (this.nodeParent.id == -1) {return 0;}
	else return this.nodeParent._getLevel() + 1;
}

//f父节点是否展开 是返回true 不是（如果父节点是顶级节点 返回false 不然循环判断父节点）
BALNode.prototype._isAncestorCollapsed = function () {
	if (this.nodeParent.isCollapsed) { return true; }
	else {
		if (this.nodeParent.id == -1) { return false; }
		else { return this.nodeParent._isAncestorCollapsed(); }
	}
}

BALNode.prototype._setAncestorsExpanded = function () {
	if (this.nodeParent.id == -1) { return; }
	else 
	{
		this.nodeParent.isCollapsed = false;
		return this.nodeParent._setAncestorsExpanded(); 
	}	
}

BALNode.prototype._getChildrenCount = function () {
	if (this.isCollapsed) return 0;
    if(this.nodeChildren == null)
        return 0;
    else
        return this.nodeChildren.length || 0;//modify by chenbin 修正this.nodeChildren=0报异常
}

BALNode.prototype._getLeftSibling = function () {
    if(this.leftNeighbor != null && this.leftNeighbor.nodeParent == this.nodeParent)
        return this.leftNeighbor;
    else
        return null;	
}

BALNode.prototype._getRightSibling = function () {
    if(this.rightNeighbor != null && this.rightNeighbor.nodeParent == this.nodeParent)
        return this.rightNeighbor;
    else
        return null;	
}

BALNode.prototype._getChildAt = function (i) {
	return this.nodeChildren[i];
}

BALNode.prototype._getChildrenCenter = function (tree) {
    node = this._getFirstChild();
    node1 = this._getLastChild();
    return node.XOffSet + ((node1.XOffSet - node.XOffSet) + tree._getNodeSize(node1)) / 2;	
}

BALNode.prototype._getFirstChild = function () {
	return this._getChildAt(0);
}

BALNode.prototype._getLastChild = function () {
	return this._getChildAt(this._getChildrenCount() - 1);
}
/**
 * 画子节点连线
 * @param tree 自身树对象
 */
BALNode.prototype._drawChildrenLinks = function (tree) {
	var s = [];
	var xa = 0, ya = 0, xb = 0, yb = 0, xc = 0, yc = 0, xd = 0, yd = 0;
	var node1 = null;

	switch(tree.config.iRootOrientation)
	{
		case BALTree.RO_TOP:
			xa = this.XPosition + (this.w / 2);
			ya = this.YPosition + this.h;
			break;
			
		case BALTree.RO_BOTTOM:
			xa = this.XPosition + (this.w / 2);
			ya = this.YPosition;
			break;
			
		case BALTree.RO_RIGHT:
			xa = this.XPosition;
			ya = this.YPosition + (this.h / 2);		
			break;
			
		case BALTree.RO_LEFT:
			xa = this.XPosition + this.w;
			ya = this.YPosition + (this.h / 2);
			break;		
	}
	
	for (var k = 0; k < this.nodeChildren.length; k++)
	{
		node1 = this.nodeChildren[k];
				
		switch(tree.config.iRootOrientation)
		{
			case BALTree.RO_TOP:
				xd = xc = node1.XPosition + (node1.w / 2);
				yd = node1.YPosition;
				xb = xa;
				switch (tree.config.iNodeJustification)
				{
					case BALTree.NJ_TOP:
						yb = yc = yd - tree.config.iLevelSeparation / 2;
						break;
					case BALTree.NJ_BOTTOM:
						yb = yc = ya + tree.config.iLevelSeparation / 2;
						break;
					case BALTree.NJ_CENTER:
						yb = yc = ya + (yd - ya) / 2;
						break;
				}
				break;
				
			case BALTree.RO_BOTTOM:
				xd = xc = node1.XPosition + (node1.w / 2);
				yd = node1.YPosition + node1.h;
				xb = xa;
				switch (tree.config.iNodeJustification)
				{
					case BALTree.NJ_TOP:
						yb = yc = yd + tree.config.iLevelSeparation / 2;
						break;
					case BALTree.NJ_BOTTOM:
						yb = yc = ya - tree.config.iLevelSeparation / 2;
						break;
					case BALTree.NJ_CENTER:
						yb = yc = yd + (ya - yd) / 2;
						break;
				}				
				break;

			case BALTree.RO_RIGHT:
				xd = node1.XPosition + node1.w;
				yd = yc = node1.YPosition + (node1.h / 2);	
				yb = ya;
				switch (tree.config.iNodeJustification)
				{
					case BALTree.NJ_TOP:
						xb = xc = xd + tree.config.iLevelSeparation / 2;
						break;
					case BALTree.NJ_BOTTOM:
						xb = xc = xa - tree.config.iLevelSeparation / 2;
						break;
					case BALTree.NJ_CENTER:
						xb = xc = xd + (xa - xd) / 2;
						break;
				}								
				break;		
				
			case BALTree.RO_LEFT:
				xd = node1.XPosition;
				yd = yc = node1.YPosition + (node1.h / 2);		
				yb = ya;
				switch (tree.config.iNodeJustification)
				{
					case BALTree.NJ_TOP:
						xb = xc = xd - tree.config.iLevelSeparation / 2;
						break;
					case BALTree.NJ_BOTTOM:
						xb = xc = xa + tree.config.iLevelSeparation / 2;
						break;
					case BALTree.NJ_CENTER:
						xb = xc = xa + (xd - xa) / 2;
						break;
				}								
				break;				
		}		
		
		tree.ctx.save();
		tree.ctx.strokeStyle = tree.config.linkColor;
		tree.ctx.beginPath();	
		switch (tree.config.linkType)
		{
			case "M":						
				tree.ctx.moveTo(xa,ya);
				tree.ctx.lineTo(xb,yb);
				tree.ctx.lineTo(xc,yc);
				tree.ctx.lineTo(xd,yd);						
				break;
			case "B":
				tree.ctx.moveTo(xa,ya);
				tree.ctx.bezierCurveTo(xb,yb,xc,yc,xd,yd);	
				break;					
		}
		tree.ctx.stroke();
		tree.ctx.restore();
		
	}	
	
	return s.join('');
}



BALTree = function (obj, elm) {
	this.config = {
		iMaxDepth : 100,
		iLevelSeparation : 60,//层距离
		iSiblingSeparation : 40,//节点与节点距离
		iSubtreeSeparation : 80,
		iRootOrientation : BALTree.RO_TOP,
		iNodeJustification : BALTree.NJ_TOP,
		topXAdjustment : 60,//默认节点的横坐标调整值
		topYAdjustment : -60,//默认节点的纵坐标调整值
		render : "AUTO",
		linkType : "M",//节点与节点连线模式 M:直线连接 B:曲线连接
		linkColor : "#5555FF",//节点与节点连线颜色 "blue"
		nodeColor : "#BDDFFF",//节点颜色
		nodeFill : BALTree.NF_GRADIENT,//节点颜色种类 一种或二种颜色
		nodeBorderColor : "#BDDFFF",
		nodeSelColor : "#FFFFCC",
		nodeTableHeadColor : "#71a9df",//内容表头颜色
		nodeTableBorderColor : "#B5D7E7",//内容表格边框颜色
		nodeTableBodyColor : "#E8F4FF",//内容表格背景颜色
		levelColors : ["#5555FF","#8888FF","#AAAAFF","#CCCCFF"], //层次节点颜色集合
		levelBorderColors : ["#5555FF","#8888FF","#AAAAFF","#CCCCFF"],//层次节点边框颜色集合
		levelTableBorderColors:["#B5D7E7"],//层次节点表格边框颜色集合
		levelTableBodyColors:["#E8F4FF"],//层次节点表格体颜色集合
		levelTableHeadColors:["#71a9df"],//层次节点表格头颜色集合
		colorStyle : BALTree.CS_NODE,//节点颜色模式   CS_NODE 按每个节点颜色显示 CS_LEVEL 按层显示颜色
		useTarget : true,//是否支持节点文字url点击
		searchMode : BALTree.SM_DSC,
		selectMode : BALTree.SL_MULTIPLE,//节点点击模式 SL_MULTIPLE:点击节点变色 SL_NONE:点击节点不变色
		defaultNodeWidth : 80,
		defaultNodeHeight : 60,
		defaultTarget : 'javascript:void(0);',
		expandedImage : imgPath+'less.png',//modify by chenbin 减号图片
		collapsedImage : imgPath+'plus.png',//modify by chenbin 加号图片
		transImage : imgPath+'trans.gif',//modify by chenbin
		tableStr : '',//表格内容, 表格为一行数据,有三列值,第一列为当前值,第二列为最小列,最三列为最大值
		tableMode : BALTree.TABLE_NONE,//表格模式 有表格或无
		nodeClickMode: BALTree.N_ADD,//树节点点击模式
		nodeAttrSetMode:false,//是否支持节点与节点间的上连线属性设置文字
		nodeButtonAttrSetMode:false,//是否支持节点与节点间的下属性
		canvasSetMode: false,//firefox下是否可代码设置画布宽高 true:可以设置画布宽高,canvasWidth 属性获取树宽 canvasHeight 属性获取树高
		nodePositionBug: true,//是否让修正节点位置bug有效 true:有效
		nodeClickFunMode: false,//是否支持点击树节点 调用自定义方法(返回节点对象) true:有效
		treeRightMenuMode:true,//是否支持树的右键点击事件
		nodeTableClickMode:false,//是否支持节点表格点击
		updateTreeMode:false
	}
	this.version = "1.5";
	this.obj = obj;
	this.elm = document.getElementById(elm);
	this.self = this;
	this.ctx = null;
	this.canvasoffsetTop = -5;// html元素渲染的位置偏移量 测试应该要向上偏移10个元素左右(好像这个属性没启到作用)
	this.canvasoffsetLeft = 0;
	
	this.maxLevelHeight = [];
	this.maxLevelWidth = [];
	this.previousLevelNode = [];
	
	this.rootYOffset = 0;
	this.rootXOffset = 0;
	
	this.nDatabaseNodes = [];
	this.mapIDs = {};
	
	this.root = new BALNode(-1, null, null, 2, 2);
	this.iSelectedNode = -1;
	this.iLastSearch = 0;
	
	//add by chenbin firfox下图形画布宽高
	this.CANVAS_WIDTH = 300;
	this.CANVAS_HEIGHT = 300;
	
	this.cXAdjustment = 10;//画布x轴调整值
	this.cYAdjustment = 10;//画布y轴调整值
	
	this.maxXPosition = 0;//树中节点最大x位置值
	this.maxYPosition = 0;//树中节点最大y位置值
	
	this.nodeClickFun = "nodeClick";//节点点击方法名
	this.nodeRMenuFun = "nodeRMenu";//节点右键方法名
	this.nodeTableClickFun = "nodeClick";//节点表格点击方法
	
	this.canvasWidth = 0;//firefox 树图形宽
	this.canvasHeight = 0;//firefox 树图形高
	
	this.updateTreeMethod = "";//树更新时自动调用方法名
}

//Constant values

 //add by chenbin split string
BALTree.ROW_SPlIT = ";~";//表格内格的行分割符
BALTree.COL_SPLIT = ",~";//表格内容的列分割符

//add by chenbin 表格内字体样式
BALTree.FONT_SYSTLE= ' size=2 style="font-family:\'Microsoft YaHei\';" ';

//add by chenbin table mode
BALTree.TABLE = 1;//需要加入表格
BALTree.TABLE_NONE = 0;//不需要加入表格
BALTree.TABLE_TITLE = 0;//是否需要表头，如果要表头,则传入的第一行内容作为表头的标题(0=不要表头;1=需要表头)

//add by chenbin node click in ie
BALTree.N_ADD = 1;//节点自增
BALTree.N_NOCHANGE = 0;//节点无变化

//Tree orientation
BALTree.RO_TOP = 0;
BALTree.RO_BOTTOM = 1;
BALTree.RO_RIGHT = 2;
BALTree.RO_LEFT = 3;

//Level node alignment
BALTree.NJ_TOP = 0;
BALTree.NJ_CENTER = 1;
BALTree.NJ_BOTTOM = 2;

//Node fill type
BALTree.NF_GRADIENT = 0;//节点有2种颜色
BALTree.NF_FLAT = 1;//节点显示全色

//Colorizing style
BALTree.CS_NODE = 0;//淡色
BALTree.CS_LEVEL = 1;//多层颜色

//Search method: Title, both
BALTree.SM_DSC = 0;
BALTree.SM_BOTH = 2;

//Selection mode: single, multiple, no selection 点击节点模式 节点颜色改变
BALTree.SL_MULTIPLE = 0;
BALTree.SL_SINGLE = 1;
BALTree.SL_NONE = 2;

//CANVAS functions...//补：应该是画节点形状如带圆角的矩形的方法
/*
 CTX 节点对象
  x  节点像素位置x
  y   节点像素位置y
  width 矩形的宽度
  height 矩形的高度
  radius 圆角的半径
 */
BALTree._roundedRect = function (ctx,x,y,width,height,radius) {
  ctx.beginPath();
  ctx.moveTo(x,y+radius);
  ctx.lineTo(x,y+height-radius);
  ctx.quadraticCurveTo(x,y+height,x+radius,y+height); //创造圆角 context.quadraticCurveTo(cpx,cpy,x,y);cpx，cpy控制点坐标  x,y结束点坐标
  ctx.lineTo(x+width-radius,y+height); 		
  ctx.quadraticCurveTo(x+width,y+height,x+width,y+height-radius);
  ctx.lineTo(x+width,y+radius);
  ctx.quadraticCurveTo(x+width,y,x+width-radius,y);
  ctx.lineTo(x+radius,y);
  ctx.quadraticCurveTo(x,y,x,y+radius);
  ctx.fill();
  ctx.stroke();
}

BALTree._canvasNodeClickHandler = function (tree,target,nodeid) {
	if (target != nodeid) return;
	tree.selectNode(nodeid,true);
}

//Layout algorithm
BALTree._firstWalk = function (tree, node, level) {
		var leftSibling = null;
        node.XPosition = 0;
        node.YPosition = 0;
        node.XOffSet = 0;
        node.YOffSet = 0;
        node.modifier = 0;
        node.leftNeighbor = null;
        node.rightNeighbor = null;
        
        //add by chenbin 添加节点属性 level层次
        node.level = level;
        
        //alert("当前已经加载的节点数为"+nodenum)
        tree._setLevelHeight(node, level);
        tree._setLevelWidth(node, level);
        tree._setNeighbors(node, level);
        //alert("进入计算偏差节点"+node.dsc)
        //没有子节点或者当前层次为树最后一层
        if(node._getChildrenCount() == 0 || level == tree.config.iMaxDepth)
        {
            leftSibling = node._getLeftSibling();
            if(leftSibling != null) {
                node.XOffSet = leftSibling.XOffSet + tree._getNodeSize(leftSibling) + tree.config.iSiblingSeparation;
                node.YOffSet = leftSibling.YOffSet + node.h;
            }
            else {
                node.XOffSet = 0;
                node.YOffSet = 0;    
            }
        } 
        else {          
            var n = node._getChildrenCount();
            //alert("子节点数量"+n)
            for(var i = 0; i < n; i++)
            {
                var iChild = node._getChildAt(i);
                BALTree._firstWalk(tree, iChild, level + 1);
            }
			
            var midPoint = node._getChildrenCenter(tree);
            midPoint -= tree._getNodeSize(node) / 2;
            leftSibling = node._getLeftSibling(); //坐标的节点
           
            if(leftSibling != null)//左对象非空
            {      
                node.XOffSet = leftSibling.XOffSet + tree._getNodeSize(leftSibling) + tree.config.iSiblingSeparation;        
                node.YOffSet = leftSibling.YOffSet + node.h;           
                node.modifier = node.XOffSet - midPoint;
                //modify by chenbin 修正节点位置bug 某种情况下左边节点显示不出现象
                if(tree.config.nodePositionBug){
                	if(node.XOffSet<midPoint)
                		node.modifier = 0;
                }
                BALTree._apportion(tree, node, level);
            } 
            else
            {            	
                node.XOffSet = midPoint;
              
            }
             
        }	
       // alert("计算偏差节点"+node.dsc+"y轴的偏移量为"+node.YOffSet)
     
}
/**
  节点分配
 */
BALTree._apportion = function (tree, node, level) {
        var firstChild = node._getFirstChild();
        var firstChildLeftNeighbor = firstChild.leftNeighbor;
        var j = 1;
        for(var k = tree.config.iMaxDepth - level; firstChild != null && firstChildLeftNeighbor != null && j <= k;){
            var modifierSumRight = 0;
            var modifierSumLeft = 0;
            var rightAncestor = firstChild;
            var leftAncestor = firstChildLeftNeighbor;
            for(var l = 0; l < j; l++){
                rightAncestor = rightAncestor.nodeParent;
                leftAncestor = leftAncestor.nodeParent;
                modifierSumRight += rightAncestor.modifier;
                modifierSumLeft += leftAncestor.modifier;
            }

            var totalGap = (firstChildLeftNeighbor.XOffSet + modifierSumLeft + tree._getNodeSize(firstChildLeftNeighbor) + tree.config.iSubtreeSeparation) - (firstChild.XOffSet + modifierSumRight);
            if(totalGap > 0){
                var subtreeAux = node;
                var numSubtrees = 0;
                for(; subtreeAux != null && subtreeAux != leftAncestor; subtreeAux = subtreeAux._getLeftSibling()) numSubtrees++;

                if(subtreeAux != null){
                    var subtreeMoveAux = node;
                    var singleGap = totalGap / numSubtrees;
                    for(; subtreeMoveAux != leftAncestor; subtreeMoveAux = subtreeMoveAux._getLeftSibling()){
                        subtreeMoveAux.XOffSet += totalGap;
                        subtreeMoveAux.modifier += totalGap;
                        totalGap -= singleGap;
                    }
                }
            }
            j++;
            if(firstChild._getChildrenCount() == 0) firstChild = tree._getLeftmost(node, 0, j);
            else firstChild = firstChild._getFirstChild();
            if(firstChild != null) firstChildLeftNeighbor = firstChild.leftNeighbor;
        }
}
/**
 * 节点x、y位置
 * @param tree 树对象
 * @param node 当前节点第一子节点
 * @param level 当前层次
 * @param X 节点x轴位置
 * @param Y 节点y轴位置
 */
BALTree._secondWalk = function (tree, node, level, X, Y) {
        if(level <= tree.config.iMaxDepth)//当前层次与最大限定层次比较
        {
            var xTmp = tree.rootXOffset + node.XOffSet + X;
            var yTmp = tree.rootYOffset + Y;
            var maxsizeTmp = 0;
            var nodesizeTmp = 0;
            var flag = false;
            
            switch(tree.config.iRootOrientation){            
	            case BALTree.RO_TOP:
	            case BALTree.RO_BOTTOM:	        	            	    	
	                maxsizeTmp = tree.maxLevelHeight[level];
	                nodesizeTmp = node.h;	                
	                break;

	            case BALTree.RO_RIGHT:
	            case BALTree.RO_LEFT:            
	                maxsizeTmp = tree.maxLevelWidth[level];
	                flag = true;
	                nodesizeTmp = node.w;
	                break;
            }
            switch(tree.config.iNodeJustification) {
	            case BALTree.NJ_TOP:
	                node.XPosition = xTmp;
	                node.YPosition = yTmp;
	                break;
	
	            case BALTree.NJ_CENTER:
	                node.XPosition = xTmp;
	                node.YPosition = yTmp + (maxsizeTmp - nodesizeTmp) / 2;
	                break;
	
	            case BALTree.NJ_BOTTOM:
	                node.XPosition = xTmp;
	                node.YPosition = (yTmp + maxsizeTmp) - nodesizeTmp;
	                break;
            }
            
            
            if(flag) {
                var swapTmp = node.XPosition;
                node.XPosition = node.YPosition;
                node.YPosition = swapTmp;
            }
            switch(tree.config.iRootOrientation){
	            case BALTree.RO_BOTTOM:
	                node.YPosition = -node.YPosition - nodesizeTmp;
	                break;
	
	            case BALTree.RO_RIGHT:
	                node.XPosition = -node.XPosition - nodesizeTmp;
	                break;
            }
            //add by chenbin 获取画布最宽值及最高值 修改firefox树很小也出滚动条现象
            if(tree.config.canvasSetMode){
            	if(tree.maxXPosition < node.XPosition) tree.maxXPosition = node.XPosition;
            	if(tree.maxYPosition < node.YPosition) tree.maxYPosition = node.YPosition;
            }
            if(node._getChildrenCount() != 0)
                BALTree._secondWalk(tree, node._getFirstChild(), level + 1, X + node.modifier, Y + maxsizeTmp + tree.config.iLevelSeparation);
            var rightSibling = node._getRightSibling();
            if(rightSibling != null) BALTree._secondWalk(tree, rightSibling, level, X, Y);
        }	
}

BALTree.prototype._positionTree = function () {	
	this.maxLevelHeight = [];
	this.maxLevelWidth = [];			
	this.previousLevelNode = [];		
	BALTree._firstWalk(this.self, this.root, 0);
	
	switch(this.config.iRootOrientation) {            
	    case BALTree.RO_TOP:
	    case BALTree.RO_LEFT: 
	    		this.rootXOffset = this.config.topXAdjustment + this.root.XPosition;
	    		this.rootYOffset = this.config.topYAdjustment + this.root.YPosition;
	        break;    
	        
	    case BALTree.RO_BOTTOM:	
	    case BALTree.RO_RIGHT:             
	    		this.rootXOffset = this.config.topXAdjustment + this.root.XPosition;
	    		this.rootYOffset = this.config.topYAdjustment + this.root.YPosition;
	}	
	
	BALTree._secondWalk(this.self, this.root, 0, 0, 0);	
}
/**
 * 设置树每层中最高节点值
 * @param node 节点对象
 * @param level 层次
 */
BALTree.prototype._setLevelHeight = function (node, level) {	
	if (this.maxLevelHeight[level] == null) this.maxLevelHeight[level] = 0;
    if(this.maxLevelHeight[level] < node.h) this.maxLevelHeight[level] = node.h;	
}
/**
 * 设置树每层中最宽节点值
 * @param node 节点对象
 * @param level 层次
 */
BALTree.prototype._setLevelWidth = function (node, level) {
	if (this.maxLevelWidth[level] == null) this.maxLevelWidth[level] = 0;
    if(this.maxLevelWidth[level] < node.w) this.maxLevelWidth[level] = node.w;		
}

BALTree.prototype._setNeighbors = function(node, level) {
    node.leftNeighbor = this.previousLevelNode[level];
    if(node.leftNeighbor != null) node.leftNeighbor.rightNeighbor = node;
    this.previousLevelNode[level] = node;	
}
/**
 * 获取节点长度
 * @param node 节点对象
 * @return BALTree.RO_BOTTOM:节点宽 BALTree.RO_LEFT:节点高
 */
BALTree.prototype._getNodeSize = function (node) {
    switch(this.config.iRootOrientation) {
    case BALTree.RO_TOP: 
    case BALTree.RO_BOTTOM: 
        return node.w;

    case BALTree.RO_RIGHT: 
    case BALTree.RO_LEFT: 
        return node.h;
    }
    return 0;
}

BALTree.prototype._getLeftmost = function (node, level, maxlevel) {
    if(level >= maxlevel) return node;
    if(node._getChildrenCount() == 0) return null;
    
    var n = node._getChildrenCount();
    for(var i = 0; i < n; i++)
    {
        var iChild = node._getChildAt(i);
        var leftmostDescendant = this._getLeftmost(iChild, level + 1, maxlevel);
        if(leftmostDescendant != null)
            return leftmostDescendant;
    }

    return null;	
}

BALTree.prototype._selectNodeInt = function (dbindex, flagToggle) {
	if (this.config.selectMode == BALTree.SL_SINGLE)
	{
		if ((this.iSelectedNode != dbindex) && (this.iSelectedNode != -1))
		{
			this.nDatabaseNodes[this.iSelectedNode].isSelected = false;
		}		
		this.iSelectedNode = (this.nDatabaseNodes[dbindex].isSelected && flagToggle) ? -1 : dbindex;
	}	
	this.nDatabaseNodes[dbindex].isSelected = (flagToggle) ? !this.nDatabaseNodes[dbindex].isSelected : true;	
}

BALTree.prototype._collapseAllInt = function (flag) {
	var node = null;
	for (var n = 0; n < this.nDatabaseNodes.length; n++)
	{ 
		node = this.nDatabaseNodes[n];
		if (node.canCollapse) node.isCollapsed = flag;
	}	
	this.UpdateTree();
}

BALTree.prototype._selectAllInt = function (flag) {
	var node = null;
	for (var k = 0; k < this.nDatabaseNodes.length; k++)
	{ 
		node = this.nDatabaseNodes[k];
		node.isSelected = flag;
	}	
	this.iSelectedNode = -1;
	this.UpdateTree();
}
/**
 * 动态增加树子节点
 * @param {} dbNodesLength 存放所有节点数组长度
 * @param {} nodeId 点击节点id
 * @param {} updb 是否增加树节点标识
 */
BALTree.prototype.changeTree = function (dbNodesLength,nodeId ,upd) {
	this.add(dbNodesLength,nodeId,"Right Child");
	if (upd) this.UpdateTree();
}
BALTree.prototype._drawTree = function () {
	var s = [];
	var node = null;
	var color = "";
	var border = "";
	var dbNodesLength = this.nDatabaseNodes.length;
    var count=0; //计算div高度用
    
	for (var n = 0; n < this.nDatabaseNodes.length; n++)
	{ 
		node = this.nDatabaseNodes[n];
		switch (this.config.colorStyle) {
		
			case BALTree.CS_NODE://按单个节点颜色属性显示颜色
				color = node.c;
				border = node.bc;
				break;
			case BALTree.CS_LEVEL://按层显示节点颜色
				var iColor = node._getLevel() % this.config.levelColors.length;
				color = this.config.levelColors[iColor];
				iColor = node._getLevel() % this.config.levelBorderColors.length;
				border = this.config.levelBorderColors[iColor];
				break;
		}
		if (!node._isAncestorCollapsed()) //是否继承父节点的扩展性 true or false
		{
			this.ctx.save();
			this.ctx.strokeStyle = border; //画笔画下去线的颜色
			switch (this.config.nodeFill) {
				case BALTree.NF_GRADIENT:							
					var lgradient = this.ctx.createLinearGradient(node.XPosition,0,node.XPosition+node.w,0); //画出画布节点的渐变颜色带
					lgradient.addColorStop(0.0,((node.isSelected)?this.config.nodeSelColor:color));
					lgradient.addColorStop(1.0,"#F5FFF5");
					this.ctx.fillStyle = lgradient;
					break;
					
				case BALTree.NF_FLAT:
					this.ctx.fillStyle = ((node.isSelected)?this.config.nodeSelColor:color);
					break;
			}					
			
			BALTree._roundedRect(this.ctx,node.XPosition,node.YPosition,node.w,node.h,5);//画出节点的矩形外框
			this.ctx.restore();
			var canvas=document.getElementById("BALTreecanvas");
			var canvash=canvas.height; //画布高度
			var corgap=(node.h)*count; //由于div是列排列的 采用的position是relative 经过计算每次top修正的位置都需要-之前已经加载的div累计高度（div高度）
			count=count+1; //独立计算 因为如果节点收缩就不放入计算
            //alert("当前节点是"+node.dsc+"其连接点高度:"+NodeLineAttrGap)
			
			//在节点矩形框中添加html元素 目前状态渲染的html元素在top上存在问题 3层节点后html内容不加载
			//HTML part...
		    // alert("当前节点是"+node.dsc+"其中节点元素 node.YPosition="+node.YPosition+";canvasoffsetTop"+this.canvasoffsetTop+";node.YOffSet="+node.YOffSet+";node.level="+node.level);
			//alert("当前节点是"+node.dsc+"其中节点元素 node.XPosition="+node.XPosition+";canvasoffsetLeft"+this.canvasoffsetLeft+";node.width"+node.w+";node.height="+node.h);
			//alert("当前节点是"+node.dsc+"其中html元素 top:"+(node.YPosition+this.canvasoffsetTop-node.YOffSet-290-(node.level-1)*100)+"; left:"+(node.XPosition+this.canvasoffsetLeft)+"; width:"+node.w+"; height:"+node.h+";position:relative;"  )
           // alert("当前节点是"+node.dsc+"其中上方元素:"+node.ta+" 其中选下方元素:"+node.ba)
           // alert("当前节点是"+node.dsc+"是否伸缩"+node.isCollapsed)
            var divtop=node.YPosition+this.canvasoffsetTop-corgap-canvash-NodeLineAttrGap;
			s.push('<div id="' + node.id + '" style="top:'+(divtop)+'; left:'+(node.XPosition+this.canvasoffsetLeft)+'; width:'+node.w+'px; height:'+node.h+'px;position:relative;" ');
		    if(node.ta){//上节点div产生的偏差
			  NodeLineAttrGap=(NodeLineAttrheight)*NodeLineAttrNum;
			  NodeLineAttrNum=NodeLineAttrNum+1;
			}
			
			if(node.ba){//下节点div产生的偏差
			  NodeLineAttrGap=(NodeLineAttrheight)*NodeLineAttrNum;
			  NodeLineAttrNum=NodeLineAttrNum+1;
			}
					
		    // s.push('<div id="' + node.id + '" class="balnode" style="top:'+(node.YPosition+this.canvasoffsetTop-5)+'px; left:'+(node.XPosition+this.canvasoffsetLeft)+'px; width:'+node.w+'px; height:'+node.h+'px;position:absolute;" ');		
			//s.push('<div id="' + node.id + '" class="balnode" style="top:'+(node.YPosition+this.canvasoffsetTop-node.YOffSet*1.05-440-(node.level-1)*90-gap)+'px; left:'+(node.XPosition+this.canvasoffsetLeft)+'px; width:'+node.w+'px; height:'+node.h+'px;position:relative;" ');
																		
			s.push('onclick="javascript:nodeClick('+node.id+',event.target.id,\''+node.dsc+'\');" ');				
			//s.push('onclick="javascript:reflectNodeMes('+this.obj+',event.target.id,\''+node.id+'\');" ');		
			//右键点击事件
			if(this.config.treeRightMenuMode)	    
			    var memutop=node.YPosition+this.canvasoffsetTop+5; //菜单出现位置top
			    var memuleft=node.XPosition+this.canvasoffsetLeft+node.w/4;//菜单出现位置left
				s.push(' oncontextmenu="'+this.nodeRMenuFun+'(\''+node.id+'\',\''+node.dsc+'\',\''+node.pid+'\',\''+memutop+'\',\''+memuleft+'\')"');//吧配置右击的方法名传入
			
			s.push('>');
			s.push('<font face=Verdana size=2>');					
			if (node.canCollapse) {
				s.push('<a id="c' + node.id + '" href="javascript:'+this.obj+'.collapseNode(\''+node.id+'\', true);">');
				//modify by chenbin 使展开加号与文字不换行 style="float:left;"
				s.push('<img border=0 src="'+((node.isCollapsed) ? this.config.collapsedImage : this.config.expandedImage)+'" style="float:left;">');							
				s.push('</a>');
				s.push('<img src="'+this.config.transImage+'" >');						
			}			
			//node.target节点url目标地址 useTarget是否支持url点击
			if (node.target && this.config.useTarget){
				s.push('<a id="t' + node.id + '" href="'+node.target+'">');
				s.push(node.dsc);
				s.push('</a>');
			}else{						
				s.push(node.dsc);
			}
			//判断是否需要添加表格
			if(this.config.tableMode != BALTree.TABLE_NONE){
	
				s.push(this.getTableData(node));
			}
			s.push('</font>');
			
			/*判断是否支持节点内容点击事件
			if(this.config.nodeClickFunMode){
				var funStr = this.nodeClickFun;//节点点击方法名
				s.push('<div style="cursor:pointer;width:'+node.w+';height:'+node.h+';');
				s.push('position:absolute;top:13px;" onclick="'+funStr+'(\''+node.id+'\',\''+node.dsc+'\')">');
				s.push('</div>')
			}*/
			
			s.push('</div>');		

			var is_ff = /Firefox/i.test(navigator.userAgent);//判断浏览器是否为firefox
			//判断是否支持上连线属性、是否root节点
			if(node.ta){
				var txtLeft = node.XPosition+this.config.defaultNodeWidth/2;
				//var txtTop = node.YPosition-20 - 372 - node.YOffSet-(node.level-1)*110;
				var txtTop = divtop-node.h*3/4-node.h  //20是连接线图标的大小;
				s.push(this.setNodeLineAttr(txtLeft,txtTop,node.ta));//添加节点的上属性
			}
			//判断是否支持下连线属性、是否有子节点（这边修改了一下,node.canCollapse是是否所有节点都有扩展标记，默认false 但是实际需求不需要在此进行判断）
			//if(this.config.nodeButtonAttrSetMode && node.canCollapse && !node.isCollapsed){//这个配置属性要根据数的设定来
			if(node.ba){//这个配置属性要根据数的设定来
				var txtLeft = node.XPosition+this.config.defaultNodeWidth/2;
				//var txtTop = node.YPosition+this.config.defaultNodeHeight+18 - 362- node.YOffSet-(node.level-1)*110;
				//var txtTop = eval(node.YPosition+node.h+8-this.config.iLevelSeparation);
				//if(is_ff) txtTop = eval(node.YPosition+node.h+8);
				var txtTop=divtop-node.h/2-node.h ; //20是连接线图标的大小
				s.push(this.setNodeLineAttr(txtLeft,txtTop,node.ba));//添加节点的下属性
			}
			//画节点间连线
			if (!node.isCollapsed)	s.push(node._drawChildrenLinks(this.self));
		}
	}
	return s.join('');	
}
/**
 * 设置节点间连线属性
 */
BALTree.prototype.setNodeLineAttr = function(txtLeft,txtTop,txt){
	//最外层div设为position: relative; 文字可以随整个树位置变化
	txtLeft= eval(txtLeft-5-this.getStrLen(txt));
	var returnStr = "<div style='visibility:visible; display:table; z-index:999; background:#ffffff;"+
					"position:relative;height:"+NodeLineAttrheight+"; white-space:nowrap; "+
					"top:"+txtTop+";left:"+txtLeft+";font-family:systle Verdana Arial; font-size:12px;'>"+
					txt+"</div>";
	return returnStr;
}

/**
* 取到字符串的长度，包括中文
* 主要是为了把属性放在竖线的中间
*/
BALTree.prototype.getStrLen = function(str){
	var sumLen=0;
	for (var i=0;i<str.length;i++){
		var intCode=str.charCodeAt(i);
		if (intCode>=0&&intCode<=128) {
			sumLen++;//非中文单个字符长度加1
		}else {
			sumLen+=2;//中文字符长度则加2
		}
	}
	return parseInt(sumLen*2);
}
/**
 * 拼表内容
 * node 节点对象
 */
BALTree.prototype.getTableData = function(node){
	var cTBorder,cTHead,cTBody;
	var str = node.tableStr;
	var wid = eval(node.w-25);//内容的宽度
	//子节点个数
	var chile = node.nodeChildren.length;
	switch (this.config.colorStyle) {
		case BALTree.CS_NODE:
			cTHead = node.tableHeadColor;
			cTBody = node.tableBodyColor;
			cTBorder = node.tableBorderColor;
			break;
		case BALTree.CS_LEVEL:
			cTHead = this.config.levelTableHeadColors[node._getLevel() % this.config.levelTableHeadColors.length];
			cTBody = this.config.levelTableBodyColors[node._getLevel() % this.config.levelTableBodyColors.length];
			cTBorder = this.config.levelTableBorderColors[node._getLevel() % this.config.levelTableBorderColors.length];
			break;
	}
	if(str!=""){
		var rowList = str.split(BALTree.ROW_SPlIT);
		var returnStr = "";
		if(this.config.nodeTableClickMode)
			returnStr = '<br/><table border="0" bgcolor="" style="cursor:pointer;border-collapse:collapse;width:97%;height:75%;" onclick="'+this.nodeTableClickFun+'(\''+node.id+'\',\''+node.dsc+'\')"> ';
		else
			returnStr = '<br/><table border="0" bgcolor="" style="border-collapse:collapse;width:97%;height:75%;"> ';
		for(var i=0,len=rowList.length;i<len;i++){
			returnStr += '<tr  bgcolor="'+cTBody+'">';
			var colList = rowList[i].split(BALTree.COL_SPLIT);
			
			//内容区
			returnStr += '<td id="Txt'+node.id+'" value="'+colList[0]+'" style="text-align:center;padding-left:5px;border:1px solid '+cTBorder+'">';
			//alert("当前节点"+node.dsc+"chile为"+chile)
			//if(chile==0 && colList.length>1){//只有叶子节点才可以拖动,并且要有最小值和最大值时才能拖动
			  if(colList.length>1){//只修改了判断条件只要有最小值和最大值时就能拖动
			    var v_val=eval(colList[0]*1);
				var v_min = eval(colList[1]*1);
				var v_max = eval(colList[2]*1);
				/*原来业务逻辑暂时屏蔽
				var decimalLabel = 4;
				var decimalLimit = 1;
				if(v_max>100) {
				    decimalLabel = 0;
				    decimalLimit = 0;
				}
				//var v_avg = this.dataFormat((v_max+v_min)/2,decimalLabel);//保留两位小数
				var nv_min = v_min;
				var nv_max = v_max;
				var p = 1;
				var step = v_max-v_min;
				if(step<100){
					p = parseInt(100/step);
					nv_min = this.dataFormat(nv_min*p,decimalLimit);
					nv_max = this.dataFormat(nv_max*p,decimalLimit);
				}
                label_min = this.dataFormat(v_min, decimalLimit);
                label_max = this.dataFormat(v_max, decimalLimit);              
				var curval = this.dataFormat(eval(colList[0]*p),decimalLabel);//节点的当前值
				//alert("节点："+node.dsc+"允许最大值"+nv_max+"允许最小值"+nv_min+"label最大值"+label_max+"label最小值"+label_min+"节点当前值"+curval)
				returnStr += '<input dataDecima='+decimalLabel+' dataStep='+p+' id="slider'+node.id+'" class="easyui-slider" style="width:'+wid+'px" value="'+curval+
                             '" data-options="showTip:true,min:'+nv_min+',max:'+nv_max+
                             ',tipFormatter:function(value){return (value/'+p+').toFixed('+decimalLabel+')},rule: ['+
                             label_min+','+label_max+'],onChange:function(value){javascript:'+
                             this.obj+'.curNodeChangVal('+node.id+',(value/'+p+').toFixed('+decimalLabel+'))}">';
                 */            
                 returnStr += '<input  id="slider'+node.id+'" class="easyui-slider" style="width:'+wid+'px" value="'+v_val+
                             '" data-options="showTip:true,min:'+v_min+',max:'+v_max+
                             ',rule: ['+v_min+','+v_max+'],onChange:function(value){javascript:'+
                             this.obj+'.curNodeChangVal('+node.id+',value)}">';
			}else{
				returnStr += trimStr(colList[0]);
			}
			returnStr += '</td> ';
			returnStr += '</tr>';
		}
		returnStr += '</table>';
	}
	return returnStr;
}
BALTree.prototype.toString = function () {	
	var s = [];
	this._positionTree();
	//设置可控制画布大小
	s.push('<canvas id="BALTreecanvas" width='+this.CANVAS_WIDTH+' height='+this.CANVAS_HEIGHT+'></canvas>');
	return s.join('');
}

/**
 * 设置firefox下画布尺寸
 * canvasObj 画布对象
 */
BALTree.prototype.setCanvasSize = function(canvasObj){
	canvasObj.width = this.maxXPosition + this.config.defaultNodeWidth + this.cXAdjustment;
	canvasObj.height = this.maxYPosition + this.config.defaultNodeHeight + this.cYAdjustment;
	this.canvasHeight = canvasObj.height;
	this.canvasWidth = canvasObj.width;
}
/**
 * 设置ie下尺寸
 */
BALTree.prototype.setIESize = function(){
	this.canvasWidth = this.maxXPosition + this.config.defaultNodeWidth + this.cXAdjustment;
	this.canvasHeight = this.maxYPosition + this.config.defaultNodeHeight + this.cYAdjustment;
}
// BALTree API begins here...
BALTree.prototype.UpdateTree = function () {
        NodeLineAttrNum=1; //初始化
		NodeLineAttrGap=0; //初始化
		this.elm.innerHTML = this;
		//this.elm.innerHTML = <canvas id="BALTreecanvas" width="300" height="300"></canvas> 获取当前画布元素      
		var canvas = document.getElementById("BALTreecanvas");
		//add by chenbin 自动存储画布最大宽、高		
		if(this.config.canvasSetMode) //画布的一些配置参数 参考234行BALTree的参数设置
			this.setCanvasSize(canvas);
		//是否支持更新树自动调用js方法
		if(this.config.updateTreeMode)
			eval(this.updateTreeMethod+"();");
		if (canvas && canvas.getContext)  {
			this.canvasoffsetLeft = canvas.offsetLeft;
			this.canvasoffsetTop = canvas.offsetTop;
			this.ctx = canvas.getContext('2d');
			var h = this._drawTree();	//画出节点图 691行（关键）
			var r = this.elm.ownerDocument.createRange();		
			r.setStartBefore(this.elm);
			var parsedHTML = r.createContextualFragment(h);							
			//this.elm.parentNode.insertBefore(parsedHTML,this.elm)
			//this.elm.parentNode.appendChild(parsedHTML);
			this.elm.appendChild(parsedHTML);//画布中添加节点图
			//this.elm.insertBefore(parsedHTML,this.elm.firstChild);
		}
		$.parser.parse();//这里是动态渲染
}
/**
 * 添加树节点 这里是在jsp中传入的节点信息
 * id 节点id 必填项目，不能为空
 * pid 节点父id 必填项目，不能为空
 * dsc 节点名称 可以为null 
 * target 连接URL 可以为null 
 * topAttr 连线上端字符串 可以为null 
 * bottomAttr 连线下端字符串 可以为null 
 * tableStr 表格字符串(一行数据,列用平台列分割符分开,行用) 可以为null 
 * width 节点width 可以为null 
 * height 节点height 可以为null 
 * color 节点color 可以为null 
 * borderColor 节点边框颜色 可以为null 
 * cTHead 表格头颜色
 * cTBorder 表格体颜色
 * 下面这些参数可以不用构造出来
 * cTHead,cTBorder,cTBody, width, height, colors, borderColor
 */
BALTree.prototype.add = function (id, pid, dsc,target,topAttr,bottomAttr,tableStr,cTHead,cTBorder,cTBody, width, height, colors, borderColor) {	
	var nw = width || this.config.defaultNodeWidth; //Width, height, colors, target and defaults...
	var nh = height || this.config.defaultNodeHeight;
	var color = colors || this.config.nodeColor;
	var border = borderColor || this.config.nodeBorderColor;
	var tableHeadColor = cTHead || this.config.nodeTableHeadColor;
	var tableBorderColor = cTBorder || this.config.nodeTableBorderColor;
	var tableBodyColor = cTBody || this.config.nodeTableBodyColor;
	var tg = (this.config.useTarget) ? ((typeof target == "undefined") ? (this.config.defaultTarget) : target) : null;
	var tStr = tableStr || this.config.tableStr;//表格内容
	var ta = topAttr || "";
	var ba = bottomAttr || "";

	var pnode = null; //Search for parent node in database
	if (pid == -1) {
			pnode = this.root;
	}else{
		for (var k = 0; k < this.nDatabaseNodes.length; k++){
			if (this.nDatabaseNodes[k].id == pid){
				pnode = this.nDatabaseNodes[k];
				break;
			}
		}
	}
		
	var node = new BALNode(id, pid, dsc, tg,ta,ba,tStr,tableHeadColor
					,tableBorderColor,tableBodyColor,nw, nh, color, border);	//New node creation...
	node.nodeParent = pnode;  //Set it's parent
	node.ta=ta;
	node.ba=ba;
	pnode.canCollapse = true; //It's obvious that now the parent can collapse	
	var i = this.nDatabaseNodes.length;	//Save it in database
	node.dbIndex = this.mapIDs[id] = i;	 
	this.nDatabaseNodes[i] = node;	
	var h = pnode.nodeChildren.length; //Add it as child of it's parent
	node.siblingIndex = h;
	pnode.nodeChildren[h] = node;
}

BALTree.prototype.searchNodes = function (str) {
	var node = null;
	var m = this.config.searchMode;
	var sm = (this.config.selectMode == BALTree.SL_SINGLE);	 
	
	if (typeof str == "undefined") return;
	if (str == "") return;
	
	var found = false;
	var n = (sm) ? this.iLastSearch : 0;
	if (n == this.nDatabaseNodes.length) n = this.iLastSeach = 0;
	
	str = str.toLocaleUpperCase();
	
	for (; n < this.nDatabaseNodes.length; n++)
	{ 		
		node = this.nDatabaseNodes[n];				
		if (node.dsc.toLocaleUpperCase().indexOf(str) != -1 && ((m == BALTree.SM_DSC) || (m == BALTree.SM_BOTH))) { node._setAncestorsExpanded(); this._selectNodeInt(node.dbIndex, false); found = true; }
		if (m == BALTree.SM_BOTH) { node._setAncestorsExpanded(); this._selectNodeInt(node.dbIndex, false); found = true; }
		if (sm && found) {this.iLastSearch = n + 1; break;}
	}	
	this.UpdateTree();	
}

BALTree.prototype.selectAll = function () {
	if (this.config.selectMode != BALTree.SL_MULTIPLE) return;
	this._selectAllInt(true);
}

BALTree.prototype.unselectAll = function () {
	this._selectAllInt(false);
}

BALTree.prototype.collapseAll = function () {
	this._collapseAllInt(true);
}

BALTree.prototype.expandAll = function () {
	this._collapseAllInt(false);
}

BALTree.prototype.collapseNode = function (nodeid, upd) {
	var dbindex = this.mapIDs[nodeid];
	this.nDatabaseNodes[dbindex].isCollapsed = !this.nDatabaseNodes[dbindex].isCollapsed;
	if (upd) this.UpdateTree();
}
/**
 * 点击树节点触发方法(包括加号、节点文字及节点内所有内容)
 * nodeid 点击节点id
 * upd 是否更新标识
 */
BALTree.prototype.selectNode = function (nodeid, upd) {		
	this._selectNodeInt(this.mapIDs[nodeid], true);
	if (upd) this.UpdateTree();0
}

BALTree.prototype.setNodeTitle = function (nodeid, title, upd) {
	var dbindex = this.mapIDs[nodeid];
	this.nDatabaseNodes[dbindex].dsc = title;
	if (upd) this.UpdateTree();
}

BALTree.prototype.setNodeTarget = function (nodeid, target, upd) {
	var dbindex = this.mapIDs[nodeid];
	this.nDatabaseNodes[dbindex].target = target;
	if (upd) this.UpdateTree();	
}

BALTree.prototype.setNodeColors = function (nodeid, color, border, upd) {
	var dbindex = this.mapIDs[nodeid];
	if (color) this.nDatabaseNodes[dbindex].c = color;
	if (border) this.nDatabaseNodes[dbindex].bc = border;
	if (upd) this.UpdateTree();	
}

BALTree.prototype.getSelectedNodes = function () {
	var node = null;
	var selection = [];
	var selnode = null;	
	
	for (var n=0; n<this.nDatabaseNodes.length; n++) {
		node = this.nDatabaseNodes[n];
		if (node.isSelected)
		{			
			selnode = {
				"id" : node.id,
				"dsc" : node.dsc
			}
			selection[selection.length] = selnode;
		}
	}
	return selection;
}

/**
*
*拖动叶子节点事件
*/
BALTree.prototype.curNodeChangVal = function(nodeid,val){
	nodeValToText(nodeid,val);//这里是取得节点的属性进行改动,此方法是在引用页面定义的方法
	this.updataParentNodeTxt(nodeid,val);//循环更新当前节点及父节点的值
}

/**
*递归更新父节点的值
*拖动叶子节点进动态更改父节点的值
*
*/
BALTree.prototype.updataParentNodeTxt = function(nodeid,val){
		$("#Txt"+nodeid).attr("value",val);//当前节点的属性值
		//更新仪表盘的数据
		changPointerVal(nodeid,val);//这里在引用页面定义方法
		var node = this.getNodeById(nodeid);//根据节点ID找到节点对象
		if(node.nodeParent==null){
			return;
		}
		var pid = node.nodeParent.id;
		var pval = 0;
		var brotherNodeList = node.nodeParent.nodeChildren || [];//点击节点子节点  )").attr("title
		var bid;//兄弟节点ID
		var expr = "";//表达式
		for(var i=0;i<brotherNodeList.length;i++){
			bid = brotherNodeList[i].id;
			//节点的上属性与节点值组成的表达式的计算结果
			expr = brotherNodeList[i].ta+$("#Txt"+bid).attr("value");
			pval += eval(expr);//计算表达式
		}
		pval = this.dataFormat(pval,2);//保留两位小数
		
		//更新仪表盘的数据
		changPointerVal(pid,pval);//这里在引用页面的算定义方法
		if(pid=="1" || pid == 1){
			$("#Txt"+pid).html(this.getFormat1(pval));//更新内容
			return;
		}
		//$("#Txt"+pid).attr("value",pval);
		$("#Txt"+pid).html(pval);//更新内容
		this.updataParentNodeTxt(pid,pval);
}

/**
 * 计算根节点的值
 * 初始化根节点的值
 */
BALTree.prototype.calcInitRootVal = function(){
	var lastIdxId = this.nDatabaseNodes.length - 1;
	var lastNode = this.nDatabaseNodes[lastIdxId];
	var lId = lastNode.id;
	var lval = eval($("#Txt"+lId).attr("value"));
	this.updataParentNodeTxt(lId,lval);
}

/**
 * 根据节点id获取节点对象
 * nodeid 节点id
 */
BALTree.prototype.getNodeById = function(nodeid){
	var dbindex = this.mapIDs[nodeid];
	var node = this.nDatabaseNodes[dbindex];
	return node;
}

/**
 * 删除树中节点后，需要重构nDatabaseNodes数组
 */
BALTree.prototype.rebuildNodeDB = function(){
	this.mapIDs = {};
	for(var i=0,len=this.nDatabaseNodes.length;i<len;i++){
		var dNode = this.nDatabaseNodes[i];
		this.mapIDs[dNode.id] = i;
	}
}

/**
 * add by chenbin
 * 删除树子节点主方法
 * nodeid 选中节点id
 */
BALTree.prototype.delChildNodesMain = function(nodeid){
	var node = this.getNodeById(nodeid);
	var nodeArr = node.nodeChildren || [];//点击节点子节点
	var returnList = [];
	
	returnList = this.delChildNodes(node,returnList)
	node.nodeChildren.length = 0;//去除子节点连线
	node.canCollapse = false;//节点属性设为没有子节点
	this.UpdateTree();
	return returnList;
}

/**
 * add by chenbin
 * 递归删除树子节点
 * nodeid 选中节点id
 * returnList 被删除的所有节点集合
 */
BALTree.prototype.delChildNodes = function(node,returnList){
	var nodeArr = node.nodeChildren || [];//点击节点子节点
	returnList = returnList || [];
	for(var i=0,len=nodeArr.length;i<len;i++){
		var index=0;
		while(index<this.nDatabaseNodes.length){
			if(nodeArr[i].id==this.nDatabaseNodes[index].id){
				this.delChildNodes(nodeArr[i],returnList);//递归删除本身所有子节点
				this.nDatabaseNodes.splice(index,1);//从节点集合中删除节点
				this.rebuildNodeDB();//重构节点集合
				returnList.push(nodeArr[i]);//添加返回数组
				break;
			}
			index++;
		}
	}
	return returnList;
}

/**
 * add by chenbin
 * 删除树子节点包括本身
 * nodeid 选中节点id
 */
BALTree.prototype.delChildNodesIncludeSelf = function(nodeid){
	var returnList = [];
	var node = this.getNodeById(nodeid);
	var parentNode = node.nodeParent;
	returnList = this.delChildNodes(node,returnList);//删除选中节点所有子节点
	
	for(var i=0,len=parentNode.nodeChildren.length;i<len;i++){//删除节点与父节点联系、连线
		if(parentNode.nodeChildren[i].id==nodeid){
			parentNode.nodeChildren.splice(i,1);
			returnList.push(node);
			break;
		}
	}
	
	var dbindex = this.mapIDs[nodeid];//删除节点集合中本身节点信息
	this.nDatabaseNodes.splice(dbindex,1);
	this.rebuildNodeDB();//重构nDatabaseNodes数组
	this.UpdateTree();
	return returnList;
}
/**
 * add by chenbin
 * 删除选中树层次节点
 * nodeid 选中节点id
 */
BALTree.prototype.delLevelNodes = function(nodeid){
	var returnList = [];
	var levelNodeParentArr = [];
	var node = this.getNodeById(nodeid);
	
	for(var i=0,len=this.nDatabaseNodes.length;i<len;i++){
		if(node.level==this.nDatabaseNodes[i].level){//获取与点击节点相同层次节点
			var p_node = this.nDatabaseNodes[i].nodeParent;//获取点击节点父节点
			if(p_node){
				var type = true;
				for(var j=0,jlen=levelNodeParentArr.length;j<jlen;j++){//判断是否在父节点集合中，不存在就保存
					if(p_node.id==levelNodeParentArr[j].id){
						type = false;
						break;
					}
				}
				if(type)
					levelNodeParentArr.push(p_node);
			}
		}
	}
	
	for(var i=0,len=levelNodeParentArr.length;i<len;i++){//循环父节点集合删除所属子节点
		this.delChildNodes(levelNodeParentArr[i],returnList);
		levelNodeParentArr[i].nodeChildren.length = 0;//去除子节点连线
		levelNodeParentArr[i].canCollapse = false;//节点属性设为没有子节点
	}
	this.UpdateTree();
	return returnList;
}


/**
 * add by chenbin
 * 增加选中树节点的子节点
 * nodeid 选中节点对象id
 * nodeArr 需要添加的节点集合
 * nodeLevel 需要添加的层次
 * type 0:一次把所有删除层都添加进来 1:只添加点击节点的下一层
 */
BALTree.prototype.addChildNodes = function(nodeid,nodeArr,nodeLevel,type){
	if(nodeArr.length==0)
		return;
	nodeArr = this.sortBy(nodeArr,"siblingIndex","asc");
	this.nDatabaseNodes = this.sortBy(this.nDatabaseNodes,"level","asc");
	var node = this.getNodeById(nodeid);
	var dbIndex = 0;//节点存储集合中应插入的下标位置
	
	for(var i=0;i<this.nDatabaseNodes.length;i++){//获取插入集合下标
		var obj = this.nDatabaseNodes[i];
		if(obj.level>nodeLevel){
			dbIndex = i;
			break;
		}
		dbIndex = i;
	}
	var sameSize = false;//添加是否加在集合最后标识
	if(dbIndex==this.nDatabaseNodes.length-1)
		sameSize = true;
	
	for(var i=0,len=nodeArr.length;i<len;i++){//向节点集合添加节点信息
		//插入了节点集合当前层第一节点位置,没有按照siblingIndex顺序
		if(sameSize)
			this.nDatabaseNodes.splice(dbIndex+1+i,0,nodeArr[i]);//插入传入数组至节点集合的指定位置
		else
			this.nDatabaseNodes.splice(dbIndex+i,0,nodeArr[i]);//插入传入数组至节点集合的指定位置
	}
	var index = 0;
	var newArr = nodeArr.slice(0);
	while(index<newArr.length){//生成当前节点直接子节点
		if(nodeid!=newArr[index].nodeParent.id){
			newArr.splice(index,1);
		}else
			index++;
	}
	if(type==1){//一层层添加节点需要把下层连线删除
		for(var i=0,len=newArr.length;i<len;i++){
			newArr[i].canCollapse = false;
			newArr[i].nodeChildren.length = 0;
		}
	}
	
	this.rebuildNodeDB();//重构nDatabaseNodes数组
	node.nodeChildren = newArr;//重新赋值当前节点子节点
	node.canCollapse = true;//节点属性设为有子节点
	this.UpdateTree();
}
/**
 * add by chenbin
 * nodeid 点击的节点id
 * nodeArr 需要添加的节点集合
 * nodeLevel 需要添加的层次
 * type 0:一次把所有删除层都添加进来 1:只添加点击节点的下一层
 * 增加选中树的下一层次节点
 */
BALTree.prototype.addNextLevelNodes = function(nodeid,nodeArr,nodeLevel,type){
	if(nodeArr.length==0)
		return;
		
	nodeArr = this.sortBy(nodeArr,"level","asc");
	this.nDatabaseNodes = this.sortBy(this.nDatabaseNodes,"level","asc");
	
	var node = this.getNodeById(nodeid);
	var dbIndex = 0;//节点存储集合中应插入的下标位置
	for(var i=0,len=this.nDatabaseNodes.length;i<len;i++){
		var obj = this.nDatabaseNodes[i];
		if(obj.level+1>nodeLevel){
			dbIndex = i;
			break;
		}
		dbIndex = i;
	}
	var sameSize = false;//添加是否加在集合最后标识
	if(dbIndex==this.nDatabaseNodes.length-1)
		sameSize = true;
	for(var i=0,len=nodeArr.length;i<len;i++){//向节点集合添加节点信息
		//插入了节点集合当前层第一节点位置,没有按照siblingIndex顺序
		if(sameSize)
			this.nDatabaseNodes.splice(dbIndex+1+i,0,nodeArr[i]);//插入传入数组至节点集合的指定位置
		else
			this.nDatabaseNodes.splice(dbIndex+i,0,nodeArr[i]);//插入传入数组至节点集合的指定位置
	}
	
	var levelNodesArr = new Array();
	for(var i=0,len=nodeArr.length;i<len;i++){//保存当前层节点，剔除其他层节点
		if(nodeArr[i].level==nodeLevel)
			levelNodesArr.push(nodeArr[i]);
	}
	
	this.rebuildNodeDB();//重构nDatabaseNodes数组
	for(var i=0,len=levelNodesArr.length;i<len;i++){//循环当前层所有节点
		for(var j=0,jlen=this.nDatabaseNodes.length;j<jlen;j++){//寻找父节点，赋值至父节点的子节点
			if(levelNodesArr[i].nodeParent.id==this.nDatabaseNodes[j].id){
				this.nDatabaseNodes[j].nodeChildren.push(levelNodesArr[i]);
				if(this.nDatabaseNodes[j].nodeChildren.length>0)
					this.nDatabaseNodes[j].canCollapse = true;//节点属性设为有子节点
				break;
			}
		}
	}
	if(node.nodeChildren.length>0 && !node.canCollapse)
		node.canCollapse = true;//节点属性设为有子节点
			
	if(type==1){//一层层添加节点需要把下层连线删除
		for(var i=0,len=levelNodesArr.length;i<len;i++){
			levelNodesArr[i].canCollapse = false;
			levelNodesArr[i].nodeChildren.length = 0;
		}
	}
	this.UpdateTree();
}
/**
 * 显示指定节点下的层数，不包括自已所在的层
 * nodeId 节点id 
 * numb 节点下的层数
 */
BALTree.prototype.collapseLevelNode=function(nodeId,numb){
	var node = null;
	var nodeObj = this.getNodeById(nodeId);//找到目标节点后才作操作
	numb = eval(numb+nodeObj.level);
	for(var n=0; n<this.nDatabaseNodes.length; n++){
		node = this.nDatabaseNodes[n];
		if(node.level==numb) node.isCollapsed = true;
	}
	this.UpdateTree();//一定要更新 否则看不出结果
}

/**
 * 数组排序
 * @param {} arr 排序数组
 * @param {} sortStr 排序字段
 * @param {} type desc降序 asc升序
 */
BALTree.prototype.sortBy = function(arr,sortStr,type){
	var newArr = [];
	var returnArr = [];
	if(typeof sortStr=="string"){
		for(var i=0,len=arr.length;i<len;i++){
			(newArr[i] = new String(arr[i] && arr[i][sortStr] || "")).obj = arr[i];
		}
	}
	if(type=="asc")
		newArr.sort(function(a,b){return a-b;})
	else
		newArr.reverse();
		
	for(var i=0,len=newArr.length;i<len;i++){
		returnArr[i] = newArr[i].obj;
	}
	return returnArr;
}

	/**
	 * 保留scale位小数
	 * @param oldStr
	 * @param scale 数值性
	 */
BALTree.prototype.dataFormat = function(oldStr,scale){
		var str = oldStr+""; 
		var newStr = "";
		if (str=="" || str==undefined) return newStr;
		var opNumb = str.indexOf(".");
		if (opNumb>-1 && str.length-opNumb>scale){
			newStr = str.substr(0,opNumb+scale+1);
		}else{
			newStr = str;
		}
		return newStr;
}

/**
*
*没有用到,目前只能对整数实现三位一撇
*/
BALTree.prototype.getFormat1 = function(n){
	var b=parseInt(n).toString();
	var len=b.length;
	if(len<=3){return b;}
	var r=len%3;
	return r>0?b.slice(0,r)+","+b.slice(r,len).match(/\d{3}/g).join(","):b.slice(r,len).match(/\d{3}/g).join(",");
}