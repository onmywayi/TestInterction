/*
*添加上传文件模板项
*增加upload_item行,并且动态给URL,数据库及部门附值
*/
function caseAdd(){
	if(curCaseIndex!=-1) $('#case_item').datagrid('endEdit',curCaseIndex);
	caseFieldLi = [];
	$('.pagination-last').click();//如果是分页表格,这里是新加时翻到最后一页
	var url=servletPath+"operType=uploadId";
	curItemId = startRequest(url);
	$('#case_item').datagrid('appendRow',{
		upload_id:curItemId,db_type:2,conn_type:1,update_type:3,ignore_type:0,operateaction:0,upload_type:uploadType,
		create_dt:getNowTime('yyyyMMdd'),
		user_id:userId
	});
	var lastIndex = $('#case_item').datagrid('getRows').length-1;
	curCaseIndex = lastIndex;
	$('#case_item').datagrid('selectRow', lastIndex);
	$('#case_item').datagrid('beginEdit', lastIndex);
	$('#sysTable').combobox('setText',[]);
	$('#case_item_field').datagrid('loadData',[]);
	editLoadUrlDbOption(curCaseIndex);
	enterkeyendEdit('case_item',lastIndex);
}

/**
 * 查询数据
 */
function searchCase(){
	var url=servletPath+"operType=caseSel&uploadType="+uploadType;
	var conds = getCondStr();
	if(isNull(conds)) return;
	url += "&conds="+encode(getCondStr());
	var rdata = startRequest(url);
	var dataObj=[];
	if(!isNull(rdata)) dataObj = JSON.parse(rdata);
	$('#case_item').datagrid('loadData',dataObj);
}

/**
*编辑表的行
*/
function editGridRow(tbid,rowIndex,rowData){
	var tb = $("#"+tbid);
	tb.datagrid('beginEdit',rowIndex);
	if(tbid=="case_item"){
		curCaseIndex = rowIndex;
		curItemId = rowData.upload_id;//
		editLoadUrlDbOption(rowIndex);//动态加载主表中的URL和DB的下拉选项
	}else{
		curCaseFieldIndex = rowIndex;
		editUploadTableField(rowIndex);//动态加载编辑字段
	}
	enterkeyendEdit(tbid,rowIndex);
}

/**
*格式化数据库类型
*/    
function formatDbType(value) {
    for (var i = 0; i < dbType.length; i++){
        if (dbType[i].id == value) {
            return dbType[i].text;
        }
    }
    return value
}

/**
*格式化数据库类型
*/
function formatFunname(value){
	var str = value;
	try{
	    for(var i = 0; i < defaultFunDate.length; i++){
	        if (defaultFunDate[i].fun_name == value) {
	            str = defaultFunDate[i].fun_text;
	            break;
	        }
	    }
    }catch(e){
    }
    return str
}

/**
*输入框添加手输入的值
*/
function addInputOption(){
	var valueField = $(this).combobox("options").valueField;
	var val = $(this).combobox("getValue");//当前combobox的值
	var allData = $(this).combobox("getData");   //获取combobox所有数据
	var flg = true;//为true说明输入的值在下拉框数据中不存在
	for (var i = 0; i < allData.length; i++) {
		if (val == allData[i][valueField]) {
			flg = false;
		}
	}
	if (flg){//$(this).combobox("clear");//这里是清空不存在的值
		$(this).combobox('setValue',$(this).combobox('getText'));//这里是把输入值加入到下拉框中
	}
}

/**
*格式化主键列
*/
function formatPkType(value){
	var str = "";
	if(value==1) str = value;
	return str;
}

/**
*格式化数据的更新方法
*/    
function formatUpdateType(value) {
    for (var i = 0; i < updateType.length; i++) {
        if (updateType[i].id == value) {
            return updateType[i].text;
        }
    }
    return value
}

/**
*数据插入时错误的处理机制
*/    
function formatIgnoreType(value) {
    for (var i = 0; i < ignoreType.length; i++) {
        if (ignoreType[i].id == value) {
            return ignoreType[i].text;
        }
    }
    return value
}

/**
*格式化密码
*/ 
 function formatPassword(value,row,index){
 	if(isNull(value)) return "";
 	return "********";
 }
 
	/**
	*格式化连接单元格
	*/
	function　formatConnect(value,row,index){
    	var s = "";
		if(value==0){
    		s = "<img src='../plugs/easyui/themes/icons/dbConn0.png' title='数据库连接' style='cursor:pointer' onclick='dbConn("+index+")'/>";
		}else{
			s = "<img src='../plugs/easyui/themes/icons/dbConn1.png' title='数据库连接' style='cursor:pointer' onclick='dbConn("+index+")'/>";
		}
    	return s;
    }
    
    /**
    *数据库存连接
    */
    function dbConn(indexId){
    	$('#case_item').datagrid('endEdit', indexId);
    	$('#case_item').datagrid('selectRow', indexId);
    	var row = $('#case_item').datagrid('getData').rows[indexId];
    	var url=servletPath+"operType=getUserTable&db_type="+row.db_type;
    	var connurl = row.conn_url;//连接URL
    	var conndb  = row.conn_db;//数据库
    	if(isNull(connurl) || isNull(conndb)) {
    		$.messager.alert('提示','连接地址和数据库名称为必填项,不能为空!');
    		return;
    	}
    		url += "&conn_url="+encode(connurl);
    		url += "&conn_db="+encode(conndb);
    		url += "&conn_user="+encode(row.conn_user);
    		url += "&conn_password="+encode(row.conn_password);
		var tabLi = startRequest(url);
   		if(tabLi){
   			try{
   				$("#sysTable").combobox('loadData',eval(tabLi));
   			}catch(e){}
   			$.messager.alert('提示','数据库连接成功!');
   			row.operateaction = 1;
   			$('#case_item').datagrid('refreshRow',indexId);
   		}else{
   			$.messager.alert('提示','数据库连接失败!');
   			row.operateaction = 0;
   			$('#case_item').datagrid('refreshRow',indexId);
   		}
    }
    
    /**
    *切换表时要清空表的匹配信息
    */
    function changeSysTable(record){
    	if(record){
    		var newValue = record.table_name;
    		var row = $('#case_item').datagrid('getSelected');//默认选中第一行
    		if(!isNull(row.conn_table) && row.conn_table != newValue){
			 	$.messager.confirm('确认','您确认想要切换表吗? 如果继续将清空已匹配的字信息!',function(flg){    
	    			if(flg){
	    				getSysTableColInfo(newValue);
	    				row.conn_table = newValue;//这里是后台数据的修改
	    				$('#case_item').datagrid('refreshRow',curCaseIndex);
	    				$('#case_item_field').datagrid('loadData',[]);
	    			}else{
	    				$('#sysTable').combobox('setValue',row.conn_table);
	    				$('#sysTable').combobox('setText',row.conn_table);
	    				return;
	    			}
				});    			
    		}else{
     			getSysTableColInfo(newValue);
    			row.conn_table = newValue;//这里是后台数据的修改
    			$('#case_item').datagrid('refreshRow', curCaseIndex);
    			$('#case_item_field').datagrid('loadData',[]);   		
    		}
    	}
    }
    
    /**
    *根据表名取得系统表的列信息,其返回值的列信息包括col_name,col_desc,col_type
    *被选择的列信息
    */    
    function getSysTableColInfo(tablename){
    	var row = $('#case_item').datagrid('getSelected');//默认选中第一行
    	var url=servletPath+"operType=getUserTableColInfo&db_type="+row.db_type;
    		url += "&conn_url="+encode(row.conn_url);
    		url += "&conn_db="+encode(row.conn_db);
    		url += "&conn_table="+encode(tablename);
    		url += "&conn_user="+encode(row.conn_user);
    		url += "&conn_password="+encode(row.conn_password);
    	if(tablename && row.conn_url && row.conn_db){
    		caseFieldLi = JSON.parse(startRequest(url));
    	}
    }

	/*
	*添加字段的对应关系
	*增加数据库字段和模板字段的对应关系
	*/
	function fieldMappingAdd(){
		if(curCaseFieldIndex!=-1) $('#case_item_field').datagrid('endEdit',curCaseFieldIndex);
		var selectRow = $('#case_item').datagrid('getSelected');//默认选中第一行
		if(!selectRow){
			$.messager.alert('提示','请选中1个模板!');
			return;
		}
		$('#case_item_field').datagrid('appendRow',{
			case_field: '',
			case_desc: ''
		});
		var lastIndex = $('#case_item_field').datagrid('getRows').length-1;
		var uploadColLi = $('#case_item_field').datagrid('getRows');//删除已经添加的列
		caseFieldLi = delExitRowByKeyVal(caseFieldLi,uploadColLi,"col_name");
		$('#case_item_field').datagrid('selectRow', lastIndex);
		$('#case_item_field').datagrid('beginEdit', lastIndex);
		editUploadTableField(lastIndex);
		curCaseFieldIndex = lastIndex;
		enterkeyendEdit('case_item_field',lastIndex);
	}
	
	/**
	*编辑字段时动态加载下拉框的值
	*/
	function editUploadTableField(rowIndex){
		try{
			var smEditor = $('#case_item_field').datagrid('getEditor',{index:rowIndex,field:'col_name'});
			$(smEditor.target).combobox("loadData", caseFieldLi);
		}catch(e){}
	}
	
	/**
	*编辑主表模板时动态加载主表中的URL和DB,以及DEPT_NAME的下拉选项
	*/
	function editLoadUrlDbOption(rowIndex){
		try{
			//这里的caseData是整个数据集不只是当前页面的数据
			var cases = caseData;//$('#case_item').datagrid('getRows');
			var urlo = new Object();
			var dbo = new Object();
			var depto = new Object();
			for(var i in cases){
				urlo[cases[i].conn_url] = cases[i].conn_url;
				dbo[cases[i].conn_db] = cases[i].conn_db;
				depto[cases[i].dept_name] = cases[i].dept_name;
			}
			var defaultConnurl = [];
			for(var url in urlo){//IP地址
				if(isNull(url)) continue;
				var o = new Object();
				o.conn_url = url;
				defaultConnurl.push(o);
			}
			var smUrl = $('#case_item').datagrid('getEditor',{index:rowIndex,field:'conn_url'});
			$(smUrl.target).combobox("loadData", defaultConnurl);
			
			var defaultConndb = [];
			for(var db in dbo){//数据库
				if(isNull(db)) continue;
				var o = new Object();
				o.conn_db = db;
				defaultConndb.push(o);
			}
			var smDb = $('#case_item').datagrid('getEditor',{index:rowIndex,field:'conn_db'});
			$(smDb.target).combobox("loadData", defaultConndb);
			
			var defaultDept = [];
			for(var dept in depto){//数据库
				if(isNull(dept)) continue;
				var o = new Object();
				o.dept_name = dept;
				defaultDept.push(o);
			}
			var smDept = $('#case_item').datagrid('getEditor',{index:rowIndex,field:'dept_name'});
			$(smDept.target).combobox("loadData", defaultDept);
		}catch(e){
		}			
	}	
	
	/**
	*选择列时自动填写字段类型
	*列连动的效果
	*/
	function changeTableCol(row){
        try{
           var td=$('.datagrid-body td[field="col_type"]')[curCaseFieldIndex];
           var div = $(td).find('div')[0];
           $(div).text(row.col_type);//这是里是界面上的修改
           var caseRow= $("#case_item_field").datagrid('getSelected');
           caseRow.col_type = row.col_type;//选择列时添加列的类型
           caseRow.col_pk = row.col_pk;//选择列时添加列的PK属性值
  		}catch(e){}		
	}	
	
	
	/**
	*删除匹配的字段的节点
	*/
	function fieldMappingDel(){
		var row = removeRow("case_item_field");
		caseFieldLi.push(row);
	}


	/**
	*结束编辑匹配的字段的节点
	*/
	function fieldMappingEndEdit(){
		if(curCaseFieldIndex!=-1){
			$('#case_item_field').datagrid('endEdit',curCaseFieldIndex);
		}
	}	
	
	/**
	*结束模板编辑的表
	*/
	function caseEndEdit(){
		if(curCaseIndex!=-1){
			$('#case_item').datagrid('endEdit',curCaseIndex);
		}
	}
		
	/**
	*删除表格的行
	*/
	function removeRow(tbid){
		var row= $("#"+tbid).datagrid('getSelected');
		var index=$("#"+tbid).datagrid('getRowIndex',row);
		$("#"+tbid).datagrid('deleteRow',index);
		return row;
	}	
	
	/**
	*保存模板配置表
	*单表设置保存
	*/
	function caseSave(){
		try{
			if(curCaseFieldIndex!=-1) $('#case_item_field').datagrid('endEdit',curCaseFieldIndex);
			if(curCaseIndex!=-1) $('#case_item').datagrid('endEdit',curCaseIndex);
			var url=servletPath+"operType=caseSave&userId="+userId;
			var row= $("#case_item").datagrid('getSelected');//保存被选中的行
			if(isNull(row.upload_name)){
				$.messager.alert('提示','名称不能为空!');
			}else{
				if(uploadType=="0"){//这里是单个模板配置的时候
					var fieldLi=$('#case_item_field').datagrid('getRows');//是个数组
					if(fieldLi.length<1) {
						$.messager.alert('提示','请设置匹配字段!');
						return;
					}
					for(var i in fieldLi){//输入字段可能包括空格等特殊字符,所以要去掉特殊字符
						fieldLi[i].case_field = delSpecialStr(fieldLi[i].case_field);
					}
					//如果有更新的情况,则必须选上主键列
					var updateType = row.update_type;//1=清空原表并插入新数据;2=更新并添加数据;3=只添加原表不存在的数据
					var flg = havePkCaseField(updateType,fieldLi);
					if(!flg) {
						$.messager.alert('提示','更新数据库时,必须要匹配相应的主键!');
						return;
					}
					var nodeJsonDate = JSON.stringify(fieldLi);
					row.upload_xml = nodeJsonDate;
				}
				var caseData = encode(JSON.stringify(row));
				var para = "caseData="+caseData;
				var str = startReq(url,para);
				if(str=="1"){
					$.messager.alert('提示','模板设置保存成功!');
				}else{
					$.messager.alert('提示','模板设置保存失败!');
				}
			}
		}catch(e){
			alert(e);
		}
	}
	
	
	/**
	*判断选匹配的字段是否有主键,如没有则返回false
	*更新时要用到主键
	*/
	function havePkCaseField(updatetype,fieldLi){
		var flg = false;
		if(updatetype==2){
			for(var i in fieldLi){
				row = fieldLi[i];
				if(fieldLi[i].hasOwnProperty('col_pk') && fieldLi[i].col_pk==1){
					flg = true;
					break;
				}
			}
		}else flg = true;
		return flg;
	}
	
	/**
	*单击模板主文件行,加载子表的字段匹配数据
	*/
	function loadCaseFieldData(rowIndex,caseItem){
		curCaseIndex = rowIndex;
		curItemId = caseItem.upload_id;
		getSysTableColInfo(caseItem.conn_table);//为caseFieldLi附值
		$("#sysTable").combobox('select',caseItem.conn_table);
		if(caseItem.upload_xml)	$('#case_item_field').datagrid('loadData',JSON.parse(caseItem.upload_xml));
		else $('#case_item_field').datagrid('loadData',[]);
	}	
	
/**
*删除模板文件信息
*/
function caseDel(){
	var url=servletPath+"operType=caseDel";
	$.messager.confirm('确认','您确认想要删除当前Case？',function(r){    
	    if(r){    
			var row = removeRow("case_item");
			url += "&uploadId="+row.upload_id+"&excel_path="+row.excel_path;
			startRequest(url);
			try{//批量上传时没有case_item_field表格,所以这要包起来
				$('#case_item_field').datagrid('loadData',[]);
			}catch(e){}
	    }
	}); 
}	
	
/**
*刷新模板文件信息
*/
function caseReload(){
	document.location.reload();
}	
	
//根据行号回车键结束编辑
function enterkeyendEdit(datagridnname,rowIndex){
	try{
		_firefox();
		var editors = $('#'+datagridnname).datagrid('getEditors', rowIndex);
		for (var i = 0, len = editors.length; i < len; i++) {
			var editor = editors[i];
			$(editor.target).bind('keyup', function (e) {
				var code = window.event.keyCode || window.event.which;
				if (code == 13) {
					$('#'+datagridnname).datagrid('endEdit', rowIndex);
				}
			});
		}
	}catch(e){}
}


//解决Firefox不识别event事件
/*firefox  中没有window.event*/
function _firefox(){
	try{
	    HTMLElement.prototype._defineGetter_("runtimeStyle", _element_style);
	    window.constructor.prototype._defineGetter_("event", _window_event);
	    Event.prototype._defineGetter_("srcElement", _event_srcElement);
    }catch(e){
    }
}

function _element_style(){
    return this.style;
}
function _window_event(){
    return _window_event_constructor();
}
function _event_srcElement(){
    return this.target;
}
function _window_event_constructor(){
    if(document.all){
        return window.event;
    }
    var _caller = _window_event_constructor.caller;
    while(_caller!=null){
        var _argument = _caller.arguments[0];
        if(_argument){
            var _temp = _argument.constructor;
            if(_temp.toString().indexOf("Event")!=-1){
                return _argument;
            }
        }
        _caller = _caller.caller;
    }
    return null;
}
if(window.addEventListener){
    _firefox();
}
