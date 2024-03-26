<%@ page contentType="text/html; charset=utf-8" language="java" import="java.util.*" pageEncoding="utf-8"%>
<%@ include file="/common/global.jsp"%>

<html>
<head>
	<meta charset="utf-8">
	<title>whatif</title>
    <link type="text/css" rel="stylesheet" href="${basePath}/css/comm.css" ></link>
    <link rel="stylesheet" href="${basePath}/plugs/easyui/themes/default/easyui.css" type="text/css" ></link>
    <link rel="stylesheet" href="${basePath}/plugs/BalanceTree/BALTree.css" type="text/css" ></link>
    <link rel="stylesheet" type="text/css" href="${basePath}/plugs/easyui/themes/icon.css" ></link>
	<script type="text/javascript" src="${basePath}/plugs/jquery/1.10.2/jquery.min.js"></script>
	<script language="javascript" type="text/javascript" src="${basePath}/plugs/easyui/1.3.6/jquery.easyui.min.js" charset="utf-8"></script>
	<script type="text/javascript" src="${basePath}/plugs/BalanceTree/BALTree.js"></script>
	<script type="text/javascript" src="${basePath}/plugs/BalanceTree/BALTreeData.js"></script>
    <script type="text/javascript" src="${basePath}/js/common.js"></script>
    <script type="text/javascript" src="${basePath}/js/json2.js"></script>
    <style>
    .td3{ 
	height:5px;
	background-color: #F8F8FF; 
	BORDER-RIGHT: #f6f6f6 0px solid; 
	BORDER-TOP: #f9f9f9 0px solid; 
	BORDER-LEFT: #f9f9f9 0px solid;
	BORDER-BOTTOM: #f5f5f5 0px solid;
} 
    </style>
  <script>
		var imgPath="images/";		
		var myTree = null;
		var Snode; //当前选择的节点属性
		var testNodeid=20;//测试增加点（正式版删除）
		var NodeLineAttrNum=1; //当前加载的连接点标签数量 这边设置的标签长度为12
		var NodeLineAttrheight=20;//单个连接点高度
		var NodeLineAttrGap=0;//；累计连接点高度
	
		var cNodeList=[{value:'#ffb8be',name:'红色'},{value:'#BDDFFF',name:'蓝色'},{value:'#C1FBB0',name:'绿色'}
				,{value:'#FFFF9C',name:'黄色'},{value:'#fedafe',name:'紫色'}];
		var cTBodyList=[{'#ffb8be':'#FFECEC','#BDDFFF':'#E8F4FF','#C1FBB0':'#ECFBE1'
				  ,'#FFFF9C':'#FFFFE6','#fedafe':'#ffecff'}];
		var cTHeadList=[{'#ffb8be':'#f7838e','#BDDFFF':'#71a9df','#C1FBB0':'#9ccf6e'
					  ,'#FFFF9C':'#f0d05e','#fedafe':'#fdb5fd'}];
		var cTBorderList=[{'#ffb8be':'#FFA6A4','#BDDFFF':'#B5D7E7','#C1FBB0':'#C1F192'
					   ,'#FFFF9C':'#f6df8c','#fedafe':'#fda8fd'}];
			
			/**
			 * 设置树参数
			 */
			function createCTreeParam(){
				myTree = new BALTree('myTree','myTreeContainer');
				myTree.config.nodeFill = BALTree.NF_GRADIENT;//节点填充颜色模式 NF_GRADIENT:节点有2种颜色 NF_FLAT:一种颜色
				myTree.config.selectMode = BALTree.SL_NONE;//点击节点不变色
				myTree.config.tableMode = BALTree.TABLE;//需要加入表格
				myTree.config.nodeClickMode = BALTree.N_NOCHANGE//不需要节点自增
				myTree.config.canvasSetMode = true;//设置可以自定义画布大小
				myTree.config.nodePositionBug = true;//设置是否修正bug
				myTree.config.nodeAttrSetMode = true;//设置能添加连线属性
				myTree.config.nodeButtonAttrSetMode = true;//设置连线下属性
				myTree.config.useTarget = false;//设置不支持节点文字url点击
				//myTree.config.linkColor = this.cTree.linkColor;//节点与节点连线颜色(深灰)
				//myTree.config.linkType = this.cTree.linkType;//节点与节点连线模式 M:直线连接 B:曲线连接
				myTree.config.defaultNodeWidth = 260;
				myTree.config.defaultNodeHeight = 80;
				myTree.config.iSiblingSeparation = 20;
				myTree.config.iLevelSeparation = 80;
				
				//myTree.config.nodeClickFunMode = true;//设置支持节点内容点击事件 如果要用则必须和myTree.nodeClickFun桎使用并且自己实现treeLClick方法
				//myTree.config.treeRightMenuMode = true;//设置树节点支持右键点击事件 下面同理
				//myTree.config.nodeTableClickMode = true;//设置节点表格点击事件
				//myTree.config.updateTreeMode = true;//设置树更新自动调用某js方法 myTree.updateTreeMethod属性设置调用方法名

				//myTree.nodeClickFun = "treeLClick";//节点点击事件
				//myTree.nodeRMenuFun = "nodeRClick";//节点右键事件
				//myTree.nodeTableClickFun = "treeLClick";//节点表格点击事件
				//myTree.updateTreeMethod = "treeUpdate"; //树更新调用方法名
				
				//第7个参数说明(格式：实际值,~最小值,~最大值),第一个值为当前实际值
				//注：节点加载顺序 父节点必须优于子节点优先加载
				myTree.add('1','-1','节点1  marstat',null,null,null,'98'); 				
				myTree.add('2','1','节点2',null,'-3*','-2*','54');				    		
		 	    myTree.add('3','1','节点3',null,'4*','-2*','54');
		 		myTree.add('4','1','节点4',null,'0.2*',null,'26,~10,~60');
		 		//myTree.add('5','1','节点5',null,'1.8*',null,'54,~1,~99');
		 		// myTree.add('10','1','新节点',null,null,null,'待写');
		 		//myTree.add('6','1','节点6',null,'1.8*',null,'54,~1,~99');
		 	    myTree.add('6','2','节点6',null,'1.9*',null,'53,~1,~99');
		
		 	   myTree.add('7','3','节点7',null,'-3*','1.9*','53,~1,~99');
		 	    myTree.add('9','6','节点9',null,'-3*','1.9*','53,~1,~99');
		 	      myTree.add('10','4','节点10',null,'-3*','1.9*','53,~1,~99');
		 	    /*参数介绍
		 	     其中实际值，最大值，最小值为滑动条所用
				'5'     ,'1'    ,'节点5' ,null,    '1.8*'        ,null,          '54,    ~1     ,~99'
				当前节点  父节点    节点名   连接URL  连线上端字符串    连线上端字符串   实际值  最小值   最大值
				
				*/
				
				document.getElementById("myTreeContainer").oncontextmenu = function(e){ //屏蔽原有页面右击菜单事件
		　　       return false;
		        }
		        try{  
				myTree.UpdateTree();
				//myTree.calcInitRootVal(); //此方法中的calcInitRootVal尚未定义
				}catch(e){alert(e)}  
		     
			}
			
			function nodeRMenu(nodeid,nodetext,nodepid,nodeTop,nodeleft){
			   //alert("当前节点是"+nodetext+";节点x坐标"+nodeTop+";节点y坐标"+nodeleft);	
			   var ScrollTop=$('#myTreeContainer').scrollTop(); //竖直滚动距离顶端的距离
			   var ScrollLeft=$('#myTreeContainer').scrollLeft(); //水平滚动距离顶端的位置
			   var nodeTop_c=nodeTop-ScrollTop;//节点Top位置-竖直滚动距离
			   var nodeleft_c=nodeleft-ScrollLeft;//节点left位置-水平滚动距离
			   createMenu(nodeTop_c+"px",nodeleft_c+"px");
			   Snode = myTree.getNodeById(nodeid);//根据节点ID找到当前选中节点对象

			}
			
			  /*点击图形菜单栏easyui定义*/ 	  	
		function createMenu(topPy,leftPx){		    	    	  
		    $('#mm').menu('show', {
					left: leftPx,top:topPy
				});			
		}
		
	
			
		</script>
</head>
<BODY onload="createCTreeParam()" id="pb" >
	<!-- 
		<input class="easyui-slider" style="width:150px" data-options="showTip:true">
	 -->
	  <div>
		<div id="myTreeContainer"  style="height:70%;width:100%;overflow:auto"  ></div>
		<div style="height:30%;width:100%" > 
			<div id="p" class="easyui-panel"  data-options="closable:true,minimizable:true,maximizable:true,fit:true">
			  <table style="margin:5px 40px;width:80%;overflow-y:scroll;">
			     <tr>
	    			<td colspan=5>
	    			<a class="btn" onclick="saveNode()" style="width:60px">&nbsp;&nbsp;保&nbsp;存&nbsp;&nbsp;</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
		    		<!-- <a class="btn" onclick="window.location.reload();" style="width:60px">&nbsp;&nbsp;刷&nbsp;新&nbsp;&nbsp;</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; -->
		    		<!-- <a class="btn" onclick="$('#delWin').window('open');" style="width:60px">&nbsp;&nbsp;删&nbsp;除&nbsp;&nbsp;</a>-->
	    			</td>
	    		</tr>
	    		<tr>
	    			<td class="td3" colspan="6"></td>
	    		</tr>
	    		<tr>
	    			<td>节点名称:</td>
	    			<td><input id="index_nm" eleType="text"  name="index_nm"></input></td>	    			
	    			<td>连线上端内容:</td>
	    			<td><input id="nodeta"  eleType="text"  name="nodeta"></input></td>  		
	    			<td>连线下端内容:</td>
	    		    <td><input id="nodeba"  eleType="text" name="nodeba"></input></td>
	    		    <td>是否启用滑动条:</td>
	    		    <td>
	    				<input  type="radio" id="isUseSplider_0" name="isUseSplider" value="0" onclick="showSpliderMes()"/>是
	    				&nbsp;&nbsp;
						<input type="radio"  id="isUseSplider_1"   name="isUseSplider" value="1" onclick="showSpliderMes()" check="checked"/>否
					</td>
	    		</tr> 
	    		<tr>
	    			<td class="td3" colspan="6"></td>
	    		</tr>   		
	    		<tr id="spliderdetail" style="display:none">
	    		    <td>实际值：</td>
	    		    <td><input id="actval" eleType="text"  name="actval"></input></td>
	    		    <td>最小值：</td>
	    		    <td><input id="minval" eleType="text"  name="minval"></input></td>
	    		    <td>最大值：</td>
	    		    <td><input id="maxval" eleType="text"  name="maxval"></input></td>
	    		</tr>
		    	<tr id="normaldetail" style="display:none">
	    		    <td>显示值：</td>
	    		    <td><input id="showval" eleType="text"  name="showval"></input></td>
	    		</tr>
		        </table>
			 
	        </div>  
	    </div>
	 </div>	
		  
	  <!-- 图形点击菜单 -->	

	<div id="mm" class="easyui-menu" >     
		<div onclick="addNode(0)" data-options="iconCls:'icon-add'">添加同级</div>
		<div onclick="addNode(1)" data-options="iconCls:'icon-add'">添加子类</div>
		<div onclick="removeNode()" data-options="iconCls:'icon-remove'">移除</div>
	</div>
	
</BODY>
</html>