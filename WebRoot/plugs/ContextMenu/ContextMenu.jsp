<%@ page contentType="text/html; charset=UTF-8" language="java" pageEncoding="UTF-8"%>
<HTML xmlns:v="urn:schemas-microsoft-com:vml">
	<HEAD>
		<TITLE>右键菜单</TITLE>
		<link type="text/css" rel="stylesheet" href="ContextMenu.css" />
	</HEAD>
	<BODY onload=""><br><br></BODY>
	<script type="text/javascript" src="ContextMenu.js"></script>
	<script type="text/javascript">
		var treeMenu = null;
		initContextMenu();
		function initContextMenu(){
			/**
			 * 样式都写入同一目录下的ContextMenu.css中
			 * 右键菜单主构造方法
			 * id 菜单id 允许null
			 * width 菜单宽 如果菜单过长需要自己设置width,否则默认 允许null
			 * height 菜单高  允许null
			 * overflowType 菜单滚动条标识 默认"auto" 允许null
			 * displayType 初始化显示是否 默认初始隐藏 允许null
			 * className 菜单样式名字 默认divSelect 允许null
			 */
			treeMenu = new MainContextMenu('menu',null,null);
			/**
			 * 增加菜单节点方法
			 * id 节点id 必填
			 * text 节点内容 必填
			 * fun 节点点击方法
			 * overCss 鼠标聚焦样式 默认liFocus
			 * outCss 鼠标移除焦点样式 默认outCss
			 * treeMenu.addNode('b','增加一层','addOneLevelNodes','liFocus','outCss');
			 */
			treeMenu.addNode('b','增加一层','addOneLevelNodes');
			treeMenu.addNode('e','增加子节点','addOneLevelChildNodes');
			treeMenu.addNode('f','删除层节点','delLevelNodes');
			treeMenu.addNode('g','删除子节点','delChildNodes');
			treeMenu.create();
		}
		
		/**
		* 点击事件
		* id 节点id,text 节点内容
		*/
		function addOneLevelNodes(id,text){alert(text+"==="+id);}
	</script>
</HTML>
