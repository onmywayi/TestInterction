
<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>

<%
String path = request.getContextPath();
String basePath = 
request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>


<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    
    <title>Testlogin</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	<!--
	<link rel="stylesheet" type="text/css" href="styles.css">
	-->
 </head>

  <div >
	
	<input type="text" placeholder="请输入用户名" id='yhm' name='yhm' value="">	
	<br>	
	<input type="password" id='mima' name='mima' value="" >
	<br>	
	<input type="submit" id = 'button' onclick="tosubmit" value="登录"/>
	
</div>

<script language="javascript" type="text/javascript">
	
	function test() {
		
		var  user = document.getElementById('yhm').value;
		var  password = document.getElementBylId('mima').value;
		if(user==""||user.length<3){
			alert("用户名不能小于三位");
			return false;
		}else if(password=""||passsword<6){
			alert("密码不能小于6位");			
			return false;
		}else{
			window.location.href='www.taobao.com';
		}
		
	}
</script>


</body>
  
</html>