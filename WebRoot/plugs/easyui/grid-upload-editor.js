/**Easyui之Datagrid编辑器Editor扩展(uploadFile),其它的都可以在这里来扩展罗....*/
$.extend($.fn.datagrid.defaults.editors,{
    uploadFile:{
	    init: function(container, options){  
	        var editorContainer = $("<div style='white-space:nowrap;'/>");
	        var button = "<form id='formup' method='post' enctype='multipart/form-data' style='padding:0px;margin:0px;'><input type='file' "+
              "name='file' id='fileup' filename='' style='display:none'/><input type='button' class='my-fileup' value='附件' "+
              "onClick='fileup.click();'/><input type='button' class='my-fileup' value='提交' onClick='editorUpFile();'/></form>";
        	//editorUpFile()要在引用页面自定义
	        editorContainer.append(button);
	        editorContainer.appendTo(container);
	        return button;
	    },  
	    getValue: function(target){
			return $("#fileup").attr("filename");
	    },
	    setValue:function(target, value){
	    	$("#fileup").attr("filename",value);
	    }
    }  
});