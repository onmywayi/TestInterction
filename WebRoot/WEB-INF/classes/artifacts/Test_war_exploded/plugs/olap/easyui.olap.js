/*
*EasyUI datagrid olap控件
*谷利军
*gulijun2001@163.com
*qq:23796788
*2015-5-1
*version 1.0
*
*/
//======================================================================================olap上卷下钻代码开始=========================
var olaptag = "<olap>+</olap>";//全局变量,不能删除
var olapEnd = "</olap>";//全局变量,不能删除
var olapdefault = "ALL";//olap的默认值
var retract = "&nbsp;";//缩进的符号
/**
*参数tbid:为表格的id号
*olap事件,在这里区分下钻还是上卷
*value的值为:<label id='d10' hidden='hidden'>EST-1</label>EST-1或
*		<olap>+</olap><label id='d21' hidden='hidden'>K9-DL-01</label>K9-DL-01
*/
function olapEvent(tbid,curRowIndex,field,value){
	var labo = _olapContent(value);//返回olap的符号和&nbsp;字符串
	var blank = labo.blank;//这个符号是点了下钻后,olap符号要变为-,此时前面也要加&nbsp用到
	var olapContent = labo.olap;//$(value).eq(0)[0].innerHTML;//值为'+'或者'-'号
	var subO=parseDom(value,"label"); 
	var curLabelId = $(subO).attr("id");
	var cellval = _getCellText(value);//点击后,当前单元格的内容
	//var flds = $("#"+tbid).datagrid('getColumnFields');//这里可以取到移动后的字符串序列
	var curRowData = $("#"+tbid).datagrid("getSelected");//当前行的数据对象
	var drillDim = parseDom(value,"label").html();//当前钻取的维度
	var drillConds = getDimCondition(field,curRowData);//olap.jsp中的方法;维度条件组成的集合,除了被点击的当前行维度的条件数组,sex=男,这样的格式,注意没有引号
	drillConds.push(drillDim);
	drillConds = _restoreEnumVal(drillConds);//这里是处理枚举值的情况
	//alert("33============"+drillConds);
	var eleTagName = $(value).prop('tagName');//OLAP
	if(eleTagName && eleTagName=="OLAP"){//如果是olap,则进行收起或下钻动作
		curRowData = _collapseBackColEvent(tbid,field,curRowIndex,curRowData);//折叠后面列的olap事件
		if(olapContent=='+'){//下钻数据通过ajax取得
			dataLi = getOlapDrillData(curLabelId,field,drillConds);//这里是取得下钻时ajax返回的数据
			if(_insertMultiRow(tbid,curRowIndex,dataLi)>0){//插入数据,返回数据的行数
				cellval = "<olap>"+blank+"-</olap>"+cellval;
			}else cellval = cellval;//如果没有下级,则不再出现olap标签
		}else if(olapContent=='-'){
			_delMultiRow(tbid,curRowIndex,field,curLabelId);
			cellval = "<olap>"+blank+"+</olap>"+cellval;
		}
		curRowData[field] = cellval;
		$("#"+tbid).datagrid('updateRow',{index: curRowIndex,row: curRowData});//更新表格的数据
	}
	olapFilterEven(drillConds);//如果olap作为过滤器时,其它元素的连动事件
	//$("#"+tbid).datagrid('refreshRow',curRowIndex);//刷新当前行的数据
}


/**
*取得olap的内容,返回为+或-号
*value的格式为:<olap>+<\/olap><label id='d10' hidden='hidden'>category_name=全部<\/label>全部
*即:这里是删除&nbsp;
*返回的对象属性为:olap和blank;即olap的符号,和&nbsp;字符串
*/
function _olapContent(value){
	var str = $(value).html();
	var lab = new Object();
	lab.olap  = getStrEnd(str,retract,"last");
	lab.blank = str.replace(/[\+|\-]/ig,"");
	return lab;
}

/**
*插入多行数据,
*tbid:当前数据表
*rowIndex:当前点击行的数据索引
*dataLi：行数据列表
*返回插入的记录条数
*/
function _insertMultiRow(tbid,rowIndex,dataLi){
	var count = 0;
	var tobj = $("#"+tbid);
	for(var k in dataLi){
		$("#"+tbid).datagrid('insertRow',{
			index:++rowIndex,
			row: dataLi[k]
		});
		count++;
	}
	return count;
}

/**
*删除多行数据,
*tbid:当前数据表
*rowIndex:当前点击行的数据索引
*field:点击列的列名
*curLabelId:点击行的LabelId号
*/
function _delMultiRow(tbid,rowIndex,field,curLabelId){
	var rowDatas = $("#"+tbid).datagrid('getRows');
	var firstCell="";
	for(var i=rowDatas.length-1;i>rowIndex;i--){
		firstCell = rowDatas[i][field];//当前行的数据对象,张一单元格的内容
		if(firstCell.indexOf(curLabelId+"_")>-1) $("#"+tbid).datagrid('deleteRow',i);
	}
}


/**
*在同一行中如果后面olap列已经被展开,此时再对同一行进行下钻时,则要收起同一行后面列的olap事件,即把原来的'-'变成'+'
*tbid:当前数据表
*rowIndex:当前点击行的数据索引
*返回当前行被修改后的数据对象
*/
function _collapseBackColEvent(tbid,field,rowIndex,curRowData){
	var opts = $("#"+tbid).datagrid('getColumnFields');
	var isBack = false;
	var colval = "",fld="",coltxt="";
	var subO; 
	for(var k in opts){
		fld = opts[k];
		if(isBack){//如果是当前页面后面的列
			colval = curRowData[fld];
			if(_olapExpandTag(colval)){
				coltxt = _getCellText(colval);//点击后,当前单元格的内容
				subO = parseDom(coltxt);
				if(subO[0].id){
					_delMultiRow(tbid,rowIndex,fld,subO[0].id);
					coltxt = olaptag+coltxt;
					curRowData[fld] = coltxt;
				}
			}
		}
		if(fld==field) isBack = true;
	}
	//alert(JSON.stringify(opts));//这里是把对象转化为String 展示属性数据
	return curRowData;
}

/**
*取得单元格中的文件,如果单元格中有其它标签,则删除标签的值
*str:标签和文件的字符串;
*如:<olap>+</olap><label id='d21' hidden='hidden'>K9-DL-01</label>Dalmation
返回值为:<label id='d21' hidden='hidden'>K9-DL-01</label>Dalmation
*/
function _getCellText(str){
	return getStrEnd(str,olapEnd,"front");
}

/**
*判断当前单元格是否是下钻状态,如果是下钻状态,则返回是true,否则返回false
*如:<olap>-</olap><label id='d21' hidden='hidden'>K9-DL-01</label>Dalmation,返回值为true或false
*/
function _olapExpandTag(str){
	var flg = false;
	var eleTagName = $(str).prop('tagName');//OLAP
	if(eleTagName && eleTagName=="OLAP"){//如果是olap,则进行收起或下钻动作
		var olapType = $(str).html();//olapType的值为'+'或者'-'号
		if(olapType=='-') flg = true;//是olap,并且为展开模式
	}
	return flg;
}

/*
*var obj=parseDom('<div id="div_1" class="div1">Hello World!</div>'); 
*var obj=parseDom('<div id="div_1" class="div1">Hello World!</div><span>多个也没关系</span>'); 
*返回的是一个dom对象数组的集合。所以如果是一个元素，要使用这个dom需要这样使用obj[0]。如果是多个同级的dom转换，可以这样使用obj[0]、obj[1]… 
*str:html格式的字符串,
tagName:标签,可以为空
*/
function parseDom(str,tagName){ 
	var objE = document.createElement("div"); 
	objE.innerHTML = str;
	if(tagName)	return $(objE).children(tagName);
	else return $(objE).children();
}

/**
*取得维度的条件信息
*维度条件组成的集合
*
*/
function getDimCondition(field,curRowData){
	var cond="";
	var drillConds = new Array();
	for(var st in curRowData){
		if(st==field) continue;
		cond = parseDom(curRowData[st],"label").html();
		if(!isNull(cond)) drillConds.push(cond);
	}
	return drillConds;
}

//==============================================================================olap上卷下钻代码结束=========================

//===========================以下是扩展的datagrid表头交换的拖拉事件代码开始======================================================
  $.extend($.fn.datagrid.methods,{
			columnMoving: function(jq){
				return jq.each(function(){
					var target = this;
					var cells = $(this).datagrid('getPanel').find('div.datagrid-header td[field]');
					cells.draggable({revert:true,cursor:'move',edge:5,
						proxy:function(source){
							var p = $('<div class="tree-node-proxy tree-dnd-no" style="position:absolute;border:1px solid #ff0000"/>').appendTo('body');
							p.html($(source).text());
							p.hide();
							return p;
						},
						onBeforeDrag:function(e){
							e.data.startLeft = $(this).offset().left;
							e.data.startTop = $(this).offset().top;
						},
						onStartDrag: function(){
							$(this).draggable('proxy').css({left:-10000,top:-10000});
						},
						onDrag:function(e){
							$(this).draggable('proxy').show().css({left:e.pageX+15,top:e.pageY+15});
							return false;
						}
					}).droppable({
						accept:'td[field]',
						onDragOver:function(e,source){
							$(source).draggable('proxy').removeClass('tree-dnd-no').addClass('tree-dnd-yes');
							$(this).css('border-left','1px solid #ff0000');
						},
						onDragLeave:function(e,source){
							$(source).draggable('proxy').removeClass('tree-dnd-yes').addClass('tree-dnd-no');
							$(this).css('border-left',0);
						},
						onDrop:function(e,source){
							$(this).css('border-left',0);
							var fromField = $(source).attr('field');
							var toField = $(this).attr('field');
							setTimeout(function(){
								var flg = moveField(fromField,toField);
								$(target).datagrid();
								$(target).datagrid('columnMoving');
								if(flg)moveEndEvent();//移动结束后事件
							},0);
						}
					});
					
					//move field to another location
					function moveField(from,to){
						var columns = $(target).datagrid('options').columns;
						//alert(from+"======219======="+to);
						//这里要判断两情情况:1.指标不能要维度的前面;2.维度不能在指标的事面
						if(!dimIndxNorm(from,to,columns[0])) return false;//如果不合规,则不能移动
						var cc = columns[0];
						var c = _remove(from);
						if (c) _insert(to,c);
						
						function _remove(field){
							for(var i=0; i<cc.length; i++){
								if (cc[i].field == field){
									var c = cc[i];
									cc.splice(i,1);
									return c;
								}
							}
							return null;
						}
						function _insert(field,c){
							var newcc = [];
							for(var i=0; i<cc.length; i++){
								if (cc[i].field == field) newcc.push(c);
								newcc.push(cc[i]);
							}
							columns[0] = newcc;
						}
						return true;
					}
				});
			}
		});	
		
	/*
	*fromFld:被移动的字段;
	*toFld:目标字段;
	*columns:所有字段对象;
	*如果fromFld是指标,toFld不能是维度
	*如果fromFld是维度,则不是放在第二个指标前,放在第一个指标前是没有问题的
	*如查合规,则返回true;否则返回fasle
	*/
	function dimIndxNorm(fromFld,toFld,columns){
		var flg = false;
		var fldsobj = window.parent.getColumnArr(eleobj);//eleAttr.js中的方法,取得元素所有的字段信息,判断字段是否是维度时用到
		var fromFldFlg = _checdDimCol(fromFld,fldsobj);//olap.jsp页面上的对象被移动的对象是否是维度
		var toFldFlg = _checdDimCol(toFld,fldsobj);//olap.jsp放置的对象是否是维度
		
		if(fromFldFlg){//是维度的情况
			if(toFldFlg) flg = true;
			else{
				var frontfld=fromFld,curfld="";//目标字段前一个字段
				for(var i in columns){
					curfld = columns[i].field;
					if(curfld==toFld) break;
					else frontfld = curfld;
				}
				if(_checdDimCol(frontfld,fldsobj) && frontfld!=fromFld) flg = true;//如果前一个字段是维度则也是合规的
			}
		}else{//不是维度而是指标的情况
			if(!toFldFlg) flg = true;
		}
		//alert(fromFldFlg+"===="+toFldFlg);
		return flg;
	}
//===========================以上是扩展的datagrid表头交换的拖拉事件代码结束======================================================


