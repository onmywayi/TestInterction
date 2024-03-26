
/*
 * gulijun -202204
 * 页面加载数据
 * 这里是通用的反射加保存,前端都可以通过
 */
function loadPageData(){
	var pdata = window.parent.pdata;//这里是父页面的对象
	var subedit = window.parent.subedit;//这里是父页面的对象
	var subehide= window.parent.subehide;//这里是父页面的对象
	reflexPageData(pdata);
	try {
		if (subedit == "1" && !isNullObj(readobj)) {//这里判断页面的只读属性
			var flg = true;
			for (var nm in readobj) {
				if (pdata[nm] != readobj[nm]) {
					flg = false;
					break;
				}
			}
			if (flg) setEleReadonly()//已验收的数据只能
		}
		if (subehide == "1" && ehide.length > 0) partEleReadonly(ehide);
	}catch (e) {
	}
	if(window.parent.cd=="view") setEleReadonly()//查看状态的情况
}


/***
 * 取得是对象集合
*  页面元素有eleid和elename,包括有eleid的元素才更新,包括elename的只展示
*  eletype
*  1=普通文本输入
*  2=select选择框
*  3=checkbox
*  4=radio
*  5=textarea
*  6=数字型
*  7=时间控件年
*  8=时间控件年月
*  9=时间控件年月日
*  10=lable标签，即写html
*/

/**
 * 新增数据时可以不要主键,这里就用自增主键，这里的pk不一定是真正的主键,这是要做为条件的
 * 返回的值包括,对象的属性包括 {"pk":"[]", "cols":{}}
 * cols:里是{字段：值}
 */
function getPageParamObj(){
	var o = new Object();//键为字段名,值为字段的值
	var pkli = [];
	//jsp页面的元素eleid号(必须显现的写出)
	var elename="",elepk="",elevl="",eletype="";//元素的类型(必须显现的写出,类型有options;)
	$("body [eleid]").each(function(){//这里是用jquery查找页面上所有包括ID的元素
		try{
			elename="";elepk="";elevl="";eletype="";
			var eobj = $(this);
			id = eobj.attr("id");
			elename = eobj.attr("elename");
			elepk = eobj.attr("elepk");
			eletype = eobj.attr("eletype");
			if(eletype=="4"){//eobj.is(":checked");eobj.prop("checked")两种方法都可以判断当前radio是否选选中
				if(eobj.prop("checked")) elevl = eobj.val();
			}else if(eletype=="10") elevl = eobj.html();//这里是span标签的情况
			else elevl = eobj.val();
			if(isNull(elevl)) elevl="";
			//如果值不为空，或字段没在对象里时的情况(清空值也要保存)
			if((!isNull(elevl)) || (!isContainsKey(o,elename)))	o[elename] = elevl;//主要是考虑radio都不选的情况
			if(!isNull(elepk) && elepk=="1") pkli.push(elename);
		}catch(e){
			alert(e);
		}
	});
	var nobj = new Object();//键为字段名,值为字段的值
	nobj.pk = pkli;
	nobj.cols = o;
	return nobj;
}

/**
*这里是一一行数据,即一个Map
*Map的键为字段的名称(全为小写字母),值为数据对应的值
*所有包括elename属性的元素都能反身射上数据
*反射时找所有的eleid的属性，元素必须包括eleid,elename,id,value,注意所有的值都要加引号，包括下拉框的值，elename为真正的字段，
*/
function reflexPageData(rowData){
   //反射数据
	$("body [eleid]").each(function(){
		var eobj = $(this);
 		var eid = eobj.attr("id");
 		var elename = eobj.attr("elename");
		if(elename){
	 		if (rowData[elename]){
	 			_reflectCell(eobj,rowData[elename]);
	 		}
		}
	});
}


/*
 *单元格反射数据 id和name 对应标签属性
 *  eletype 1=普通文本输入; 2=select选择框; 3=checkbox多选框; 4=radio; 5=textarea; 6=数字型; 7=时间控件年;
 *  8=时间控件年月;  9=时间控件年月日
 */
function _reflectCell(ele,value){
	var eletype = ele.attr("eletype");
	if(eletype=="2") setSelectedVal(ele,value);//select选择框
	else if(eletype=="3") ele.prop("checked",true);//checkbox多选框
	else if(eletype=="4") setRadioVal(ele,value);//radio
	else setCellTextVal(ele,value);
}

//设置单元格文本型的值 需要判断标签头决定 table里面的是html input是val //这边不需要考虑eleformater easyui在加载的时候会自动处理
function setCellTextVal(ele,value){
   if(ele.is('input')) ele.val(value);//表格外的
   else ele.html(value); //最多就是这个优先匹配
}

/**
 * 设置单选框的值
 * @param ele
 * @param value
 */
function setRadioVal(ele,value){
	if(ele.prop("value")==value) ele.prop("checked",true);
}

/**
 * 设置下拉框被选中，这里是只设置值相等被选中，没考虑内容相等的情况
 * @param ele
 * @param text
 */
function setSelectedVal(ele,text){
	ele.find("option[value='"+text+"']").attr("selected",true);
}

/**
 *
 * @param cname
 */
function checkPageData(cname){
	var msg = "";
	clearClass(cname);// 遍历所有具有class为 "warnstl" 的元素,并移除样式
	var obj = getPageParamObj();
	var da = obj.cols;
	var statue = $("#statue").val();//只有当状态为1时才正常验收  下面三行是5经普定制，后面用可以删除
	var msgo;
	if(statue=="1" || statue==1) msgo = checkNeedCalcu(checkobj,da);
	else msgo = checkNeedCalcu(speccheckobj,da);
	if(isNullObj(msgo)) return "审核通过！！";
	msg = "变色区为必填字段！！";
	var nobj = msgo.need;
	var cols = [];
	for(var cl in nobj){
		cols.push(cl);
	}
	setEleClass(cname,cols);
	return msg;
}

/**
 * 返回验证错误信息,结构与checkobj相似
 * @param 页面定义的需要验证和自动计算的变量,need,check,calcu} checkobj
 * {"need":{"company_cd":"公司编码"},"check":{"[v1]>[v2]+[v3]":"表达式不满足条件"},"calcu":{"v1":"[v2]+[v3]"}
 * @param 保存时的页面取值后的对象，注意这里不是初始化数据对象，这是真正的结果集 da
 */
function checkNeedCalcu(checkobj,da){
	if(isNullObj(checkobj)) return null;
	var msgo = new Object();
	if(checkobj.hasOwnProperty("need")){//这里是不能为空验证
		var nobj = new Object();
		var o = checkobj.need;
		if(!isNullObj(o)){
			for(var fld in o){
				if(isNull(da[fld])) nobj[fld]=o[fld]+"不能为空!";
			}
			if(!isNullObj(nobj)) msgo.need = nobj;
		}
	}
	if(checkobj.hasOwnProperty("check")){//这里是必要条件审核
		var nobj = new Object();
		var o = checkobj.check;
		var nexpr = "";
		if(!isNullObj(o)){
			for(var expr in o){
				nexpr = transformExpr(da,expr);
				if(!eval(nexpr)) nobj[expr]=o[expr];
			}
			if(!isNullObj(nobj)) msgo.check = nobj;
		}
	}

	if(checkobj.hasOwnProperty("calcu")){//这里是计算,如果隐藏块是要把值清空，此时可能用到三目表达式
		var nobj = new Object();
		var o = checkobj.calcu;
		if(!isNullObj(o)){
			var expr="",vl="";
			for(var fld in o){
				expr = transformExpr(da,o[fld]);
				vl = eval(expr);
				da[fld] = vl;
			}
			reflexPageData(da);//这里是计算时要返回到页面上的值
		}
	}
	return msgo;
}

/**
 * 传入class的名称，并清除相应的样式
 * @param cname:样式名称
 */
function clearClass(cname) {
	$("."+cname).each(function() {
		$(this).removeClass(cname);
	});
}

/**
 * 设置class的名称
 * @param cname:class的名称
 * @param cols：这里是列名(elename值)数组，因为有多选框的情况
 */
function setEleClass(cname,cols) {
	$("body [eleid]").each(function(){
		var eobj = $(this);
		var eid = eobj.attr("id");
		var elename = eobj.attr("elename");
		var eletype = eobj.attr("eletype");
		if(arrayIsContains(cols,elename)) {
			if(eletype=="4") eobj.parent().addClass(cname);//这里是radio的情况，radio不方便渲染只能渲染父元素
			else eobj.addClass(cname);
		}
	});
}

/**
 * 设置所有的元素
 *  eletype 1=普通文本输入; 2=select选择框; 3=checkbox多选框; 4=radio; 5=textarea; 6=数字型; 7=时间控件年;
 *  8=时间控件年月;  9=时间控件年月日;10=类似spqn标签之内的
 *  flg：true=设置为可读，false=设置为只读
 */
function setEleReadonly(){
	$("body [eletype]").each(function(){
		var eobj = $(this);
		singleEleReadOnly(eobj);
	});
}

/**
 *设置部分元素只读
 *@param eleLi
 */
function partEleReadonly(eleLi) {
	for(var i in eleLi){
		var eobj = $("#"+eleLi[i]);
		singleEleReadOnly(eobj);
	}
}

/**
 * 设置单个对象只读
 * @param obj
 */
function singleEleReadOnly(eobj) {
	var eletype = eobj.attr("eletype");
	if(eletype=="10") eobj.removeAttr("onclick");
	else if(eletype=="2" || eletype=="3" || eletype=="4") eobj.attr('disabled', true);
	else eobj.attr('readonly', true);//输入框
}
