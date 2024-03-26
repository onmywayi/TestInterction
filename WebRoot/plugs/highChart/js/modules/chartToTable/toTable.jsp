<%@ page contentType="text/html; charset=UTF-8" language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ include file="/common/global.jsp"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%	

%>
<html>
	<style type="text/css">
		</style>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		<link type="text/css" rel="stylesheet" href="${basePath}/css/comm.css"></link>
		<link rel="stylesheet" href="${basePath}/plugs/easyui/themes/default/easyui.css" type="text/css"></link>
		<link rel="stylesheet" href="${basePath}/plugs/easyui/themes/icon.css" type="text/css"></link>
		<script type="text/javascript" src="${basePath}/plugs/jquery/1.10.2/jquery.min.js"></script>
		<script type="text/javascript" src="${basePath}/plugs/easyui/1.3.6/jquery.easyui.min.js"></script>
		<script type="text/javascript" src="${basePath}/plugs/highChart/js/modules/exporting.js"></script>
		<script type="text/javascript" src="${basePath}/js/common.js"></script>
		<script type="text/javascript" src="${basePath}/exhibition/eleItem/js/MultiFuncTable.js"></script>
	<script>

var options;
var FristField = "Category0";
var FirstText = "Category";
var ColField = "Field";

//双饼图的列定义
var FrtClassFields = 'frtClass';
var SubClassFields = 'subClass';
var PieDate = 'pieDate';
var DoublePiecolumns = [
	 {	title: "大类",	field: FrtClassFields,width: 150 },
	 {	title: "小类",	field: SubClassFields,width: 150 },
	 {	title: "数据",	field: PieDate,width: 150 }
	 ];

$(document).ready(function () {
	//获取对象，在点击转换按钮时，在最外层创建了一个commonChartOptions对象（不用在最外层单独去建立对象用于接收变量）	
	options = window.parent.window.commonChartOptions;
	toTable();
});
//生成表格
function toTable(){
	var column;
	var json;
	if(options.defType=="pieDonut"){
		column = DoublePiecolumns;
		json = getDoubliPieData();
	}else{
		column = getTabColums();
 		json = getTableData();
 	}
	$("body").append("<table id='EasyTable' data-options="+"\"tools:'#tt'"+"\"></table>");
	var title = "数据浏览";
	if(options.title.text){
		title = options.title.text;
	}
	var sw=screen.width; //屏的宽度
	var sh=screen.height;//屏的高度
	$("#EasyTable").datagrid({
		columns:[column],
		data:{rows:json},
		//fitColumns:true,
		title:title,
		striped:true,
		width:sw,
		height:sh,
		rownumbers:true,
		checkOnSelect: false, //点击行时不会影响行内的checkbox 因为没用到选择行功能本行暂时没用
		selectOnCheck: false, //点击checkbox时不会同时选中行 因为没用到选择行功能本行暂时没用
		singleSelect: true,   //一次只能选中一行
		striped: true, //隔行显示不同颜色
		sort: true,    //允许表格排列
		remoteSort: false,//本地化排列 暂时不知有什么用
		multiSort: true,  //允许多行排列
		onHeaderContextMenu: function(e, field) {//不能在datagrid外面定义，否则会使列和单元格不对齐
			e.preventDefault();//禁止原本的右键事件，既生成右键菜单
			if (!cmenu){
				ContextMenu(e, field); //创建右键菜单
			}
			cmenu.menu('show', {
				left:e.pageX,
				top:e.pageY
			});
		}
	})
}
//获取双饼图的数据
function getDoubliPieData(){
	var series = options.series;
	var bigClass = series[0].data;//大类总计
	var subClass = series[1].data;//子类明细
	var data = [];
//var FrtClassFields = 'frtClass';
//var SubClassFields = 'subClass';
//var PieDate = 'pieDate';
	for(var i=0;i<bigClass.length;i++){
		var row={};
		var bignm = bigClass[i].name.toString();
		row[FrtClassFields] = bignm;
		row[SubClassFields] = "小计";
		row[PieDate] = bigClass[i].y;
		data.push(row);
		for(var j=0;j<subClass.length;j++){
			var subrow = {};
			var subnm = subClass[j].bigname.toString();
			if(subnm.toLowerCase() == bignm.toLowerCase()){
				subrow[FrtClassFields] = "";
				subrow[SubClassFields] = subClass[j].name;
				subrow[PieDate] = subClass[j].y;
				data.push(subrow);
			}
		}
	}
	return data;
}

//获取表格的列
function getTabColums(){
	var xAxis = options.xAxis;
	var cols= [];
	if(xAxis.type=="datetime"){//时间轴
		FirstText = "时间";
	}
	if(options.hasOwnProperty("xLend") && !isNull(options.xLend)){
		FirstText = options.xLend;
	}
	var col = {
			title: FirstText,
			field: FristField,
			width: 150 
	}
	cols.push(col);//第一个Y轴
	var series = options.series;
	for(var i=0;i<series.length;i++){
		var title = "Series"+i;
		if(series[i].name){//判断是否有series的name，有的话则以该name作为表格的列，没有则以"Series"+i的形式作为变了个的列
			title = series[i].name;
		}
		col = {
			title: title,
			field: ColField+i,
			width: 150,
			sortable:true
			
		}
		cols.push(col);
	}
	return  cols;
}


//只有一个X轴，表格数据的第一列时唯一的
function getTableData(){
	var data = [];
	var xAxis = options.xAxis;
	if(xAxis.type!="datetime"){//不是时间轴
		var fristData = getFristData();
		data = getAllData(fristData);
	}else{
		data = getDataByxAxisDateTime();
	}
	return data;
}
//获取图形中的X轴（不是时间轴），作为表格的第一行
function getFristData(){
	var fristData= [];
	var xAxis = options.xAxis;
	if(xAxis.categories&&xAxis.categories.length>0){//定义了X轴，则以X轴作为表格第一列
		for(var i=0;i<xAxis.categories.length;i++){
			var row = {
				Category0:xAxis.categories[i]
			}
			fristData.push(row);
		} 
	}else{//未定义X轴，则图形中每个点的Name就是X轴，若果没有name，那么图形的X轴就是自然数（0,1,2,3...），即表格第一列(heighChart中默认的)
		var series = options.series;
		for(var i=0;i<series.length;i++){
			var sdata  = series[i].data;
			for(var j=0;j<sdata.length;j++){
				var val = j;
				if(sdata[j].name){//若有name属性，则取name作为第一列的值，否则以其对应的下标作为X轴
					val = sdata[j].name
				}if(sdata[j].length>1){//没有name属性
					val = sdata[j][0];
				}
				if(!isExit(fristData,val)){
					var row ={} ;
					row[FristField] = val
					fristData.push(row);
				}
			}
		}
	}
	return fristData;
}
//获取图形中所有数据，fristData：表格的第一列数据
function getAllData(fristData){
	var data = fristData;
	var series = options.series;
	for(var i=0;i<data.length;i++){
		for(var j=0;j<series.length;j++){
			var sdata  = series[j].data;
			var value = "";
			if(sdata[i]){//判断是空否有该行数据，有则添加，没有就为空
				if(data[i][FristField]==sdata[i].name||data[i][FristField]==i||data[i][FristField]==sdata[i][0]){
					value = sdata[i].y;//y 可能也是未定义的 
					if(!value){
						value = sdata[i][1];
					}
				}
			}
			data[i][ColField+j] = value
		}
	}
	return data;
}


//获取定义了X轴为时间轴的数据
function getDataByxAxisDateTime(){
	var data = [];
	var series = options.series;
	//获取第一列数据
	for(var i=0;i<series.length;i++){
		var sdata  = series[i].data;
		for(var j=0;j<sdata.length;j++){
			var val = dateFromat(new Date(sdata[j][0]),"yyyy-MM");//firstCell[x]-1 月末 不减第一天
			if(!isExit(data,val)){
				var row ={} ;
				row[FristField] = val
				data.push(row);
			}
		}
	}
	var series = options.series;
	//获取所有数据
	for(var i=0;i<series.length;i++){
		var sdata  = series[i].data;
		for(var j=0;j<data.length;j++){
			var value = "";
			if(sdata[j]){//判断是空否有该行数据，有则添加，没有就为
				var field = dateFromat(new Date(sdata[j][0]),"yyyy-MM");//firstCell[x]-1 月末 不减第一天
				if(data[j][FristField]==field){
					value = sdata[j][1];
				}
			}
			data[j][ColField+i] = value
		}
	}
	return data;
}
//========判断字段是否在X轴中出现==========
function isExit(sdata,field){
	var ifExit = false;
	for(var i=0;i<sdata.length;i++){
		if(sdata[i][FristField]==field||sdata[i].name==field){
			return true;
		}
	}
	return ifExit;
}


/*
 *	生成右键菜单
 *	e：事件参数
 *	field：datagird表头的field
 */
var cmenu;
function ContextMenu(e, field) {
	var id = "#EasyTable";
	cmenu = $('<div/>').appendTo('body');
	cmenu.menu({
		onClick: function(item){
			if (item.iconCls == 'icon-ok'){
				$(id).datagrid('hideColumn', item.name);
				cmenu.menu('setIcon', {
					target: item.target,
					iconCls: 'icon-empty'
				});
			} else {
				$(id).datagrid('showColumn', item.name);
				cmenu.menu('setIcon', {
					target: item.target,
					iconCls: 'icon-ok'
				});
			}
		}
	});
	var fields = $(id).datagrid('getColumnFields');
		for(var i=0; i<fields.length; i++){
			var field = fields[i];
			var col = $(id).datagrid('getColumnOption', field);
			cmenu.menu('appendItem', {
				text: col.title,
				name: field,
				iconCls: 'icon-ok'
			});
		}
	}
</script>
  </head>
  
  <body>
  
  	<div id="tt"><!-- 这里是控件箱 -->
		<a href="javascript:void(0)" class="icon-down"  onclick="downLoadExcel('EasyTable')"></a>
	</div>
  </body>
  
</html>
