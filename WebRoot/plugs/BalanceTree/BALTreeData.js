//如需修改节点内容 如果是文本框的话就是操作id=Txt+node.id  如果操作easyui的滑动条的话操作id=slider+node.id

/**
  增加BALTree节点
  @param {int} level 0为同级 1为子级
*/

function addNode(level){
   var NodeParentid=Snode.pid;
   var Nodeid=Snode.id;
   var newNodeParentid;
   if(level==0){
     if(NodeParentid){
       newNodeParentid=NodeParentid;
     }else{
        newNodeParentid=-1
     }
   }else{
      newNodeParentid=Nodeid;
   }
   appentTree(newNodeParentid);
}

/**
  * 删除节点包括子节点
  *
  */
function removeNode(){
  //预留递交后台删除节点和子节点
  var Nodeid=Snode.id;
  myTree.delChildNodesIncludeSelf(Nodeid);
}


/**
   设置添加节点的属性菜单

*/
function setParamList(node){
  var nodedsc=node.dsc; //节点名称
  var nodeta=node.ta; //连接点上端内容
  var nodeba=node.ba //连接点下端内容
  var nodetStr=node.tableStr;
  if(nodedsc) $('#index_nm').val(nodedsc);
  if(nodeta) $('#nodeta').val(nodeta);
  if(nodeba) $('#nodeba').val(nodeba);
  if(nodetStr){
    var rowList = nodetStr.split(BALTree.ROW_SPlIT);
    var colList = rowList[0].split(BALTree.COL_SPLIT);//默认第一列
    var isUseSplider=0;
    if(colList.length<=1)  isUseSplider=1;
    $("input[name=isUseSplider][value="+isUseSplider+"]").prop("checked",true); 
    showSpliderMes();
    if(colList.length>1){
        $('#actval').val(colList[0]);
        $('#minval').val(colList[1]);
        $('#maxval').val(colList[2]);
    }else{
       $('#showval').val(colList[0]);
    }
    //alert(colList[0]+":"+colList[1]+":"+colList[2])
   }
}

/**
 启动滑动条追加选项
*/
function showSpliderMes(){
  	var rs=$("input[name=isUseSplider]:checked").val(); 
  	if(rs==0){
  	   document.getElementById("spliderdetail").style.display="table-row";
  	   document.getElementById("normaldetail").style.display="none";
  	   
  	} else{
  	    document.getElementById("spliderdetail").style.display="none";
  	    document.getElementById("normaldetail").style.display="table-row";	
  	} 
  	clearSpliderTxt(rs);
}
/**
   清除滑动条追加选项
 */
function clearSpliderTxt(rs){
   if(rs==0){
  	   $('#showval').val('');
  	}  else{
  	   $('#actval').val('');$('#minval').val('');$('#maxval').val('');  
  	} 

}

/**
  * 增加节点树
 */
function appentTree(Parentid){
      var nodeid=testNodeid;
      testNodeid=testNodeid+1;
      //上面的nodeid为测试用 正式版因为问后台索取（待写）
      myTree.add(nodeid,Parentid,'新节点'+nodeid,null,null,null,'0');
      myTree.UpdateTree();
     
}

/*节点单击事件*/
function nodeClick(nodeid,targetid,nodedsc){
  var txt=$("#Txt"+nodeid).attr("value");
  var node=myTree.getNodeById(nodeid);//单击的node对象
  setParamList(node);
}

/**
  * 滑动条拖动更新节点事件
  */
function nodeValToText(nodeid,val){
  $("#Txt"+nodeid).attr("value",val);//当前节点的属性值
}

//更新仪表盘的数据未定义
function changPointerVal(nodeid,val){

}
