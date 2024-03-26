/**
*格式化用户名称
*/
function　formatUser(value){
	var url=servletPath+"operType=getUserName&userId="+value;
	return startRequest(url);
}

/**
*格式化数据的更新方法
*value:yyMMddhhmmss
*/    
function formatUploadDate(value,row,index) {
	return "20"+value.substring(0,2)+"-"+value.substring(2,4)+"-"+value.substring(4,6)+" "+value.substring(6,8)+":"+value.substring(8,10)+":"+value.substring(10,12);
}

/**
*动态生成元素的Html,并返回相关字符串
*obj:{"id":"1","name":"时间选择","width":60,"cd":"PERIOD _CD","val":"curM(-1)","eletype":"8",readonly:1}
*目前只实现了 eletype=1,2,7,8,9 
*/
function getCondParamHtml(n,obj){
	var str="";
	try{
		var len = 15;
		if(n>0) len = 40;
		str = "<span style='color:#000099;margin-left:"+len+"px'>"+obj.name+"</span>";
		var eletype = obj.eletype;//元素类型
		var wid = 100;//控件的宽度
		var defval="";//控件的缺省值
		var type = "text",options="";
		if(obj.hasOwnProperty("width")) wid = obj.width;
		if(obj.hasOwnProperty("val")){//这里是有默认值的情况
			defval = obj.val;
			if(defval.indexOf("cur")>-1) defval = getRelativeDate(defval);//取得当前相对时间
		}

		if(eletype==7){//年
			str += "<input class='Wdate' onClick=\"WdatePicker({dateFmt:\'yyyy\'})\" ";
		}else if(eletype==8){//月
			str += "<input class='Wdate' onClick=\"WdatePicker({dateFmt:\'yyyyMM\'})\" ";
		}else if(eletype==9){//日
			str += "<input class='Wdate' onClick=\"WdatePicker({dateFmt:\'yyyyMMdd\'})\" ";
		}else if(eletype==1){//普通文本输入框
			str += "<input ";
		}else if(eletype==2){//这里是下拉框的情况
			str += "<select ";
			if(obj.hasOwnProperty("options")) str += "options='"+obj.options+"' ";
			if(obj.hasOwnProperty("sql")) str += "sql='"+encode(obj.sql)+"' ";
		}
		if(obj.hasOwnProperty("cd")){//这里是CD列
			str += " cd='"+obj.cd+"'";
			if(obj.cd=="data_sheet") str+=" onkeyup=\"inputNumberOnly(this)\" ";//这里是加上回车事件
		}
		if(obj.hasOwnProperty("nm")) str += " nm='"+obj.nm+"'";//有时候下拉框要加上name即名称列  filter
		if(obj.hasOwnProperty("msg")) str += " msg='"+obj.msg+"'";//这里是条件为空时的错误提示
		if(obj.hasOwnProperty("reg")) str += " reg='"+obj.reg+"'";//这里是需要过滤时的情况,reg的值为:( dept_id,31) 逗号前面是取的字段,逗号后面可能是一位数字,也可能是两位数据 (第一位代表长度, 第二位代按地区或是按部门过滤)
		if(obj.hasOwnProperty("filter")) str += " filter='"+obj.filter+"'";//这里是有联动和筛选器的情况0=无;1=筛选器;2=联动, 当为2时,只有筛选器加载完成才加载数据
		if(obj.hasOwnProperty("linked")){//
			var linked = obj.linked;
			str += " linked='"+linked+"'";//这里是有联动所影响的下拉框的值
			str += " onchange=\"linkedOption(\'"+obj.id+"\')\"";
		}
		if(obj.hasOwnProperty("readonly") && obj.readonly=="1") str += " readOnly='true'";
		var oid = "e"+n;
		if(obj.hasOwnProperty("id")){
			oid = obj.id;
			if(isNumber(oid)) oid = "e"+oid;//这一句是为了原来的老系统没带字母的情况,
		}
		str += " id='"+oid+"' eletype='"+eletype+"' style='margin-left:2px;width:"+wid+"px;height:25px' type='"+type+"' value='"+defval+"'/>";
	}catch(e){
	}
	return str;
}

/**
*取得条件参数
*eletype 1=普通文本输入框,2=select选择框,3=checkbox,4=radio,7=时间控件年,8=时间控件年月,9=时间控件年月日
*vtype:0=取得所有数据,包括下拉框为空的情况;1=取所有带有数据的值
*/
function getCondParam(vtype){//注意这里取得的参数是全等参数
	var o = new Object();
	var eleId = "",cd="",nm="",msg="";
	var eletype = "",eleval="",elename="";//元素的类型(必须显现的写出,类型有options;)
	var obj;
	var flg = false;
	$("body [eletype]").each(function(){//这里是用jquery查找页面上所有包括ID的元素
		elename="";
		obj = $(this);
		eleId = obj.attr("id");
		cd = obj.attr("cd");//下拉框即有可能取CD值
		nm = obj.attr("nm");//下拉框也可能取name值
		msg = obj.attr("msg");
		eleval = getEleVal(eleId,"value");//这里是文本框的参数映射
		if(!isNull(eleval)) o[cd] = eleval;
		else if(vtype==0){
			o[cd] = "";
			if(!isNull(msg)){//条件必选项，如果此条件不选，则要出现警告提示
				flg=true;
				$.messager.alert('提示',msg);
				return false;//这里相当于break; return true相当于continue
			}
		}
		if(!isNull(nm)){
			elename=getEleVal(eleId,"text");
			if(!isNull(elename)) o[nm] = elename;
			else if(vtype==0){
				 o[nm]="";
			}
		}
	});
	if(flg) return null;//这里是有警告的情况
	else return o;//这里是正常返回
}

/**
*取得条件参数
*eletype 1=普通文本输入框,2=select选择框,3=checkbox,4= radio, 7=时间控件年,8=时间控件年月,9=时间控件年月日
*可以支持连动和SQL语句 (未完待续.........) 
*/
function setCondOptions(){//设置条件下拉框的数据原
	var eleId = "",eletype = "",options="";//元素的类型(必须显现的写出,类型有options;)
	$("body [eletype]").each(function(){//这里是用jquery查找页面上所有包括ID的元素
		eleId = $(this).attr("id");
		eletype = $(this).attr("eletype");
		options = $(this).attr("options");
		if(eletype=="2"){
			if(!isNull(options)){
				addOption(options,eleId,1);
			}
		}
	});
	return o;
}

/**
*动态取得查询条件的字符串,此无素中必须包括:查询关系relate(exact,contain);cd(查询的字段);eletype
*及relate的值与exhibition/conditionPage/stringMatch.jsp中的值对应
*eletype 1=普通文本输入框,2=select选择框,3=checkbox,4= radio, 7=时间控件年,8=时间控件年月,9=时间控件年月日
*/
function getCondStr(){//注意这里取得的参数是全等参数
	var cond="";//
	var eleId = "",cd="",relate="";
	var eletype = "",eleval="";//元素的类型(必须显现的写出,类型有options;)
	var i=0;
	$("body [relate]").each(function(){//这里是用jquery查找页面上所有包括ID的元素
		eleId = $(this).attr("id");
		cd = $(this).attr("cd");
		eletype = $(this).attr("eletype");
		relate =  $(this).attr("relate");
		if(eletype=="2") eleval = optionItem(eleId);//元素所对应的值
		else eleval = getEleVal(eleId,"value");//这里是文本框的参数映射
		
		if(!isNull(eleval)){
			if(i>0) cond += " and "
			cond += cd;
			if(relate=="exact") cond += " = '"+eleval+"'";
			else if(relate=="contain") cond += " LIKE '%"+eleval+"%'";
			i++;
		}
	});
	return cond;
}
