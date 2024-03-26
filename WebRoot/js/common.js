/** 作者：谷利军(gulijun2001@163.com) 2014-5-1 */
var _symbol1 = "~";
var _symbol2 = "^";
var key = "ABCD0EFGH1IJKL2MNOP3QRST4UVWX5YZ6789";


//获取当前网址，如： http://localhost:8088/test/test.jsp
var curPath=window.document.location.href;
//获取主机地址之后的目录，如： test/test.jsp
var pathName=window.document.location.pathname;
var pos=curPath.indexOf(pathName);
//获取主机地址，如： http://localhost:8088
var localhostPath=curPath.substring(0,pos);
//获取带"/"的项目名，如：/test
var projectName=pathName.substring(0,pathName.substr(1).indexOf('/')+1);
//获取带"/"的项目名，如：http://localhost:8088/test
var basePath = localhostPath+projectName;


/** 判断浏览器是否是PC端 返回1代表是PC端,返回0代表为移动端 */
function IsPC() {
	var userAgentInfo = navigator.userAgent;
	var Agents = ["Android", "iPhone","SymbianOS", "Windows Phone","iPad", "iPod"];
	var flag = 1;
	for (var v = 0; v < Agents.length; v++) {
		if (userAgentInfo.indexOf(Agents[v]) > 0) {
			flag = 0;
			break;
		}
	}
	return flag;
}

/** 获取浏览器类型*/
function getBrowserType(){
	if(navigator.userAgent.indexOf("MSIE")>0) {
		return "MSIE";   //IE浏览器
	}else if(isFirefox=navigator.userAgent.indexOf("Firefox")>0){
		return "Firefox";//Firefox浏览器
	}else if(isSafari=navigator.userAgent.indexOf("Safari")>0) {
		return "Safari"; //Safan浏览器
	}else if(isCamino=navigator.userAgent.indexOf("Camino")>0){
		return "Camino"; //Camino浏览器
	}else if(isMozilla=navigator.userAgent.indexOf("Gecko")>0){
		return "Gecko";  //Gecko浏览器
	}else if(isChrome=navigator.userAgent.indexOf("Chrome")>0){
		return "Chrome"; //Chrome浏览器
	}
}

/**
 *获取浏览器缩放比例
 *即返回缩放比例值
 */
function detectZoom() {
	var ratio = 0,
		screen = window.screen,
		ua = navigator.userAgent.toLowerCase();
	if (window.devicePixelRatio !== undefined){
		ratio = window.devicePixelRatio;
	}else if (~ua.indexOf('msie')) {
		if(screen.deviceXDPI && screen.logicalXDPI){
			ratio = screen.deviceXDPI / screen.logicalXDPI;
		}
	}else if (window.outerWidth !== undefined && window.innerWidth !== undefined) {
		ratio = window.outerWidth / window.innerWidth;
	}
	if(ratio) {
		ratio = Math.round(ratio * 100);
	}
	return ratio;
}


/** 创建请求 */
function createXMLHttpRequest() {
	if (window.ActiveXObject) {
		try{
			return new ActiveXObject("Microsoft.XMLHTTP");
		}catch(e){
			return new ActiveXObject("Msxm12.XMLHTTP");
		}
	}else if (window.XMLHttpRequest) {
		return new XMLHttpRequest();
	}
}

/** 同步请求
 *blank 的状态值为true或false 或null/""
 *false代表返回的字符串没有空格;true代表返回的字符串有空格;为空时刷新当前页面
 */
function startRequest(url,blank){
	var returnStr = "";
	var xmlHttp = createXMLHttpRequest();
	xmlHttp.open("POST", url, false);
	xmlHttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded;charset=UTF-8");
	var btype = getBrowserType();//取得浏览器类型
	if(btype!="Firefox"){
		xmlHttp.onreadystatechange=function(){
			if (xmlHttp.readyState==4){
				if(xmlHttp.status == 200) {
					returnStr = getReqStr(xmlHttp.responseText,blank);
				}
			}
		}
	}
	xmlHttp.send(null);
	if(btype=="Firefox") returnStr = getReqStr(xmlHttp.responseText,blank);
	xmlHttp = null;
	return returnStr;
}

/** 同步请求
 *blank 的状态值为true或false 或null/""
 *false代表返回的字符串没有空格;true代表返回的字符串有空格;为空时刷新当前页面
 */
function startReq(url,para,blank) {
	var returnStr = "";
	var xmlHttp = createXMLHttpRequest();
	xmlHttp.open("POST", url, false);
	xmlHttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded;charset=UTF-8");
	var btype = getBrowserType();//取得浏览器类型
	if(btype!="Firefox"){
		xmlHttp.onreadystatechange=function(){
			if (xmlHttp.readyState==4){
				if(xmlHttp.status == 200){
					returnStr = getReqStr(xmlHttp.responseText,blank);
				}
			}
		}
	}
	xmlHttp.send(para);
	if(btype=="Firefox") returnStr = getReqStr(xmlHttp.responseText,blank);
	xmlHttp = null;
	return returnStr;
}

/**异步请求
 *blank 的状态值为true或false 或null/""
 *false代表返回的字符串没有空格;true代表返回的字符串有空格;为空时刷新当前页面
 */
function endRequest(url,blank) {
	var returnStr = "";
	var xmlHttp = createXMLHttpRequest();
	xmlHttp.open("POST", url, true);
	//xmlHttp.setRequestHeader("Content-Type", "text/xml;charset=UTF-8");
	xmlHttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded;charset=UTF-8");
	var btype = getBrowserType();//取得浏览器类型
	if(btype!="Firefox"){
		xmlHttp.onreadystatechange=function(){
			if (xmlHttp.readyState==4){
				if(xmlHttp.status == 200) {
					returnStr = getReqStr(xmlHttp.responseText,blank);
				}
			}
		}
	}
	xmlHttp.send(null);
	if(btype=="Firefox") returnStr = getReqStr(xmlHttp.responseText,blank);
	xmlHttp = null;
	return returnStr;
}

/**同步请求
 *blank 的状态值为true或false 或null/""
 *false代表返回的字符串没有空格;true代表返回的字符串有空格;为空时刷新当前页面
 */
function endReq(url,para,blank){
	var returnStr = "";
	var xmlHttp = createXMLHttpRequest();
	xmlHttp.open("POST", url, true);
	xmlHttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded;charset=UTF-8");
	var btype = getBrowserType();//取得浏览器类型
	if(btype!="Firefox"){
		xmlHttp.onreadystatechange=function(){
			if (xmlHttp.readyState==4){
				if(xmlHttp.status == 200){
					returnStr = getReqStr(xmlHttp.responseText,blank);
				}
			}
		}
	}
	xmlHttp.send(para);
	if(btype=="Firefox") returnStr = getReqStr(xmlHttp.responseText,blank);
	xmlHttp = null;
	return returnStr;
}

/**
 *功能:运行ajax后返回的字符串
 */
function getReqStr(str,blank){
	var tex="";
	if(blank){
		tex = str.replaceAll("\n","");
	}else{
		tex = removeBlankEnter(str);
	}
	return tex;
}

/**
 *谷利军
 *设置本地的Cookie
 *功能:运行ajax后返回的字符串
 *numb:Cookie保存的天数
 *name:Cookie保存的键名称
 *value:Cookie保存键所对应的值
 */
function setCookie(numb,name,value) {
	try{
		if(numb=="") numb = 0;
		var expdate = new Date();
		var base = new Date(0);
		var skew = base.getTime();
		if ( skew > 0 ) expdate.setTime(expdate.getTime() - skew );
		expdate.setTime(expdate.getTime() + eval(numb*24*60*60*1000));
		document.cookie = name + "=" + escape(value) + ";expires=" + expdate.toGMTString();
	}catch(e){}
}

/**
 *谷利军
 *读取本地的Cookie
 *功能:运行ajax后返回的字符串
 *numb:Cookie保存的天数
 *name:Cookie保存的键名称
 *value:Cookie保存键所对应的值
 */
function getCookie(name){
	var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
	if(arr=document.cookie.match(reg)) return unescape(arr[2]);
	else return null;
}

/**
 *字符串转码
 *js通过url传输特殊字符串时可能会出错,可以先用此方法转码,取胡字符串后,再用decode解码
 */
function encode(strIn){
	strIn += ""; //这是强制转为字符串,否则如果转入的是数字时就会出错
	if(isNull(strIn)) return "";
	var intLen=strIn.length;
	var strOut="";
	var strTemp;
	for(var i=0; i<intLen; i++)	{
		strTemp=strIn.charCodeAt(i);
		if (strTemp>255){
			tmp = strTemp.toString(16);
			for(var j=tmp.length; j<4; j++) tmp = "0"+tmp;
			strOut = strOut+_symbol2+tmp;
		}else{
			if (strTemp < 48 || (strTemp > 57 && strTemp < 65) || (strTemp > 90 && strTemp < 97) || strTemp > 122){
				tmp = strTemp.toString(16);
				for(var j=tmp.length; j<2; j++) tmp = "0"+tmp;
				strOut = strOut+_symbol1+tmp;
			}else{
				strOut=strOut+strIn.charAt(i);
			}
		}
	}
	return (strOut);
}

/**
 *字符串解码码
 *解通过encode加码的字符
 */
function decode(strIn){
	if(isNull(strIn)) return "";
	var intLen = strIn.length;
	var strOut = "";
	var strTemp;
	for(var i=0; i<intLen; i++)	{
		strTemp = strIn.charAt(i);
		switch (strTemp){
			case "~":{
				strTemp = strIn.substring(i+1, i+3);
				strTemp = parseInt(strTemp, 16);
				strTemp = String.fromCharCode(strTemp);
				strOut = strOut+strTemp;
				i += 2;
				break;
			}
			case "^":{
				strTemp = strIn.substring(i+1, i+5);
				strTemp = parseInt(strTemp,16);
				strTemp = String.fromCharCode(strTemp);
				strOut = strOut+strTemp;
				i += 4;
				break;
			}
			default:{
				strOut = strOut+strTemp;
				break;
			}
		}
	}
	return (strOut);
}

/**
 * 判断字段串是中文
 */
function isChinese(temp){
	var re = /[^\u4E00-\u9FA5]/;
	if(re.test(temp)) return false;
	return true;
}

/**
 *功能:把中文转化为Unicode
 */
function enUnicode(str){
	if(!str) return "";
	var unicode = '';
	for (var i = 0; i <  str.length; i++) {
		var temp = str.charAt(i);
		if(isChinese(temp)){
			unicode += '\\u' +  temp.charCodeAt(0).toString(16);
		}else{
			unicode += temp;
		}
	}
	return unicode;
}

/**
 *功能:把Unicode转化为中文
 */
function deUnicode(str){
	if(!str) return "";
	// 控制循环跃迁
	var len = 1;
	var result = '';
	// 注意，这里循环变量的变化是i=i+len 了
	for (var i = 0; i < str.length; i=i+len) {
		len = 1;
		var temp = str.charAt(i);
		if(temp == '\\'){
			// 找到形如 \u 的字符序列
			if(str.charAt(i+1) == 'u'){
				//提取从i+2开始(包括)的 四个字符
				var unicode = str.substr((i+2),4);
				//以16进制为基数解析unicode字符串，得到一个10进制的数字
				result += String.fromCharCode(parseInt(unicode,16).toString(10));
				//提取这个unicode经过了5个字符， 去掉这5次循环
				len = 6;
			}else{
				result += temp;
			}
		}else{
			result += temp;
		}
	}
	return result;
}

//对字符串进行加密   
function compileStr(code){
	var c=String.fromCharCode(code.charCodeAt(0)+code.length);
	for(var i=1;i<code.length;i++){
		c+=String.fromCharCode(code.charCodeAt(i)+code.charCodeAt(i-1));
	}
	return escape(c);
}
//字符串进行解密   
function uncompileStr(code){
	code = unescape(code);
	var c=String.fromCharCode(code.charCodeAt(0)-code.length);
	for(var i=1;i<code.length;i++){
		c+=String.fromCharCode(code.charCodeAt(i)-c.charCodeAt(i-1));
	}
	return c;
}

function tocode(str){  //加密字符串
	//定义密钥，36个字母和数字
	var len = key.length;  //获取密钥的长度
	var a = key.split("");  //把密钥字符串转换为字符数组
	var s = "",b, b1, b2, b3;  //定义临时变量
	for (var i = 0; i <str.length; i ++) {  //遍历字符串
		b = str.charCodeAt(i);  //逐个提取每个字符，并获取Unicode编码值
		b1 = b % len;  //求Unicode编码值得余数
		b = (b - b1) / len;  //求最大倍数
		b2 = b % len;  //求最大倍数的于是
		b = (b - b2) / len;  //求最大倍数
		b3 = b % len;  //求最大倍数的余数
		s += a[b3]+a[b2]+a[b1];//根据余数值映射到密钥中对应下标位置的字符
	}
	return s;  //返回这些映射的字符
}

function fromcode (str) {
	//定义密钥，36个字母和数字
	var len = key.length;  //获取密钥的长度
	var b, b1, b2, b3, d = 0, s;  //定义临时变量
	s = new Array(Math.floor(str.length / 3));  //计算加密字符串包含的字符数，并定义数组
	b = s.length;  //获取数组的长度
	for (var i = 0; i < b; i ++) {  //以数组的长度循环次数，遍历加密字符串
		b1 = key.indexOf(str.charAt(d));  //截取周期内第一个字符串，计算在密钥中的下标值
		d ++;
		b2 = key.indexOf(str.charAt(d));  //截取周期内第二个字符串，计算在密钥中的下标值
		d ++;
		b3 = key.indexOf(str.charAt(d));  //截取周期内第三个字符串，计算在密钥中的下标值
		d ++;
		s[i] = b1 * len * len + b2 * len + b3  //利用下标值，反推被加密字符的Unicode编码值
	}
	b = eval("String.fromCharCode(" + s.join(',') + ")");  // 用fromCharCode()算出字符串
	return b ;  //返回被解密的字符串
}

/**
 *功能:删除字符串中的空格和换行符
 */
function removeBlankEnter(tmpText){
	//删除字符串中的空格和换行符
	var tmpText = tmpText;
	for(var i=tmpText.length-1; i>=0; i--){
		tmpText = tmpText.replace("\n","");
	}
	var str = "";
	for(var i=tmpText.length-1; i>=0; i--){
		if(tmpText.charAt(i)!=" "&&tmpText.charAt(i)!="\r") str=tmpText.charAt(i)+str;
	}
	return str;
}

/**
 *移除对象元素的属性集
 *obj:带有多属性的对象
 *arrLi:属性集合
 */
function removeObjAttr(obj, arrLi){
	for(var i in arrLi){
		delete obj[arrLi[i]];
	}
	return obj;
}


//公用的ajax-----------------------------------------------end 
if(!Array.indexOf){
	Array.prototype.indexOf = function (obj) {
		for (var i = 0; i < this.length; i++) {
			if (this[i] == obj){
				return i;
			}
		}
		return -1;
	}
}

/**
 *取得输入框的值或单选下拉框的值或文本
 *元素的ID
 *ststus;text=文本,value=值
 */
function getEleVal(elementId,status){
	//根据传入的页面元素的ID得到,返回元素的text或value如status等于text返回text;如status等于value则返回value;
	//下拉框的值可以直接通过document.getElementById(elementId).value来取得
	var tmpStr="";
	try{
		var opValue = document.getElementById(elementId).value;
		if(status!=null && status=='text'){
			var objSel = document.getElementById(elementId);
			for(var i=0;i<objSel.options.length;i++){
				var valjs = objSel.options[i].value;
				var txtjs = objSel.options[i].text;
				if(opValue==valjs){
					tmpStr = objSel.options[i].text;
				}
			}
		}else{
			tmpStr = opValue;
		}
	}catch(e){
	}
	return tmpStr;
}

/**
 *取得下拉框的值或文本,并组成对象返回,value为对象的属性,text为对象的值
 *text=文本,value=值
 */
function getOptionItems(elementId){
	var obj=new Object();
	try{
		var objSel = document.getElementById(elementId);
		for(var i=0;i<objSel.options.length;i++){
			obj[objSel.options[i].value] = objSel.options[i].text;
		}
	}catch(e){
	}
	return obj;
}


/**
 *谷利军
 *根据传入的键或值,动态设置与传入的键或值相等的Select框被选中的分项
 *elementId select框的ID号
 *text 传入的文本值
 *ststus;0=比较键,1=比较值
 */
function setSelected(elementId,text,ststus){
	try{
		var objSel = document.getElementById(elementId);
		for(var i=0;i<objSel.options.length;i++){
			var val = objSel.options[i].value;
			if(ststus==1) val = objSel.options[i].text;
			if(val==text){
				objSel.options[i].selected="selected";
				break;
			}
		}
	}catch(e){}
}


/**
 *设置元素的值
 */
function setEleVal(elementId,text){
	try{
		var eleObj = document.getElementById(elementId);
		eleObj.value = text;//eleObj.innerText = text;//firefox不支持innerText
	}catch(e){}
}

/**
 *设置元素的值
 */
function setEleHtml(elementId,nodeStr){
	try{
		var eleObj = document.getElementById(elementId);
		eleObj.innerHTML = nodeStr;
	}catch(e){}
}

/**
 *设置元素是否显示
 *elementId =元素ID
 *status 0=不显示;1=显示
 */
function setDisplay(elementId,status){
	try{
		var eleObj = document.getElementById(elementId);
		if(status==0){
			eleObj.style.display="none";
		}else{
			eleObj.style.display="block";
		}
	}catch(e){}
}

/**
 * 校验只要是数字（包含正负整数，0以及正负浮点数）就返回true
 **/
function isNumber(val){
	var regPos = /^[0-9]+.?[0-9]*/; //判断是否是数字。
	if(regPos.test(val) ) return true;
	else return false;
}

/**
 *判断字符串是否为空,包括空字符串,也包括undefined的情况
 *如果传入的数据0,并且没有加单引号也是true,这里不能再修改了，原来判断为0时也用到了此方法
 */
function isNull(str){
	var flg = false;
	try{
		if(str==undefined || str=="undefined" || str=="" || str==null || trimStr(str)==""){
			flg = true;
		}
	}catch(e){
		alert(e);
	}
	return flg;
}

/**
 *判断对象是否为空
 */
function isNullObj(str){
	var flg = false;
	try{
		for(var key in str){
			return false;
		}
		flg=true;
	}catch(e){
		alert(e);
	}
	return flg;
}

/**
 *去掉两端空格
 */
function trimStr(str){//去掉两端空格
	if (!str) return "";
	try{
		for(var i=str.length-1; i>=0; i--){
			if (str.charAt(i)!=" ") break;
		}
		for (var j=0; j <= str.length - 1; j++){
			if (str.charAt(j) !=" ") break;
		}
		return str.substr(j, i+1-j);
	}catch(e){
	}
}

//比较两个文本是否相等(不区分大小写)，返回true或false
function compareText(str1,str2){
	if (str1==str2) return true;
	else return (str1.toLowerCase() == str2.toLowerCase());
}

/**
 *判断一个字符串中是否包括另一个字符串(不区分大小写),
 *str:主字符串
 *substr:子字符串
 */
function isContains(str,substr){
	var nstr = str.toLowerCase();
	var nsubstr = substr.toLowerCase();
	return nstr.indexOf(nsubstr) >= 0;
}

/*
*全角转半角
*/
function ToCDB(str) {
	var tmp = "";
	for(var i=0;i<str.length;i++){
		if (str.charCodeAt(i) == 12288){//这里是空格的情况
			tmp += String.fromCharCode(str.charCodeAt(i)-12256);
		}else if(str.charCodeAt(i) > 65248 && str.charCodeAt(i) < 65375){
			tmp += String.fromCharCode(str.charCodeAt(i)-65248);
		}else{
			tmp += String.fromCharCode(str.charCodeAt(i));
		}
	}
	return tmp
}

/**
 *判断一个字符串集合中是否包括另一个字符串(不区分大小写),
 *strArr:字符串集合
 *str:子字符串
 */
function arrayIsContains(strArr,str){
	var flg = false;
	for(var i in strArr){
		if(compareText(strArr[i],str)) flg = true;
	}
	return flg;
}




/*
*返回对象所在行的行索引号
*obj:行的单个或多个单元格的值
*arrayObj:相当于二维表
*/
function getArrayIndex(obj,arrayObj){
	var n=-1;
	try{
		var flg = true;
		var robj = new Object();
		for(var i in arrayObj){//数组循环
			flg = true;
			robj = arrayObj[i];
			for(var name in obj){//对象属性循环
				if(!robj.hasOwnProperty(name) || obj[name]!=robj[name]){
					flg = false;
					break;
				}
			}
			if(flg){
				n=i;
				break;
			}
		}
	}catch(e){
		alert("570====:"+e);
	}
	return n;
}

function getArrayIndex1(obj,arrayObj){
	var n=-1;
	try{
		var str=JSON.stringify(obj);
		var sub="";
		for(var i in arrayObj){//数组循环
			sub=JSON.stringify(arrayObj[i]);
			if(str==sub) return i;
		}
	}catch(e){
		alert("570====:"+e);
	}
	return n;
}


/*
*返回对象所在行的整行数据
*obj:行的单个或多个单元格的值
*arrayObj:相当于二维表
*/
function getArrayRowData(obj,arrayObj){
	var nobj = new Object();
	try{
		var flg = true;
		var robj = new Object();
		for(var i in arrayObj){//数组循环
			flg = true;
			robj = arrayObj[i];
			for(var name in obj){//对象属性循环
				if(!robj.hasOwnProperty(name) || obj[name]!=robj[name]){
					flg = false;
					break;
				}
			}
			if(flg){
				nobj = cloneObj(robj);
				break;
			}
		}
	}catch(e){
	}
	return nobj;
}

/**
 *页面一定要引用json2.js或jqery
 *克隆对象
 *obj:包含多个属性的对象
 */
function cloneObj(obj){
	try{
		if(!obj) return obj;
		var nobj = new Object();
		var str = JSON.stringify(obj);
		nobj = JSON.parse(str);
		return nobj;
	}catch(e){
		alert(e);
	}
}

/**
 *页面一定要引用json2.js
 *克隆数组对象
 *arryObj:数组对象
 */
function cloneArrayObj(arryObj){
	var cObj = new Array();
	try{
		var str = "";
		for(var i=0;i<arryObj.length;i++){
			str = JSON.stringify(arryObj[i]);
			cObj.push(JSON.parse(str));
		}
	}catch(e){alert(e)}
	return cObj;
}

/**
 *合并两个数组对象,返回一个新的数组
 *arry1:数组1
 *arry1:数组2
 */
function mergeArrayObj(arry1,arry2){
	var cObj = new Array();
	for(var n in arry1){
		cObj.push(arry1[n]);
	}
	for(var n in arry2){
		cObj.push(arry2[n]);
	}
	return cObj;
}

/**
 *这个方法在中文时好象有点问题
 *替换所有
 */
String.prototype.replaceAll=function(search,replace){
	var result=this+"";
	while(result.indexOf(search)!=-1){
		result=result.replace(search,replace);
	}
	return result;
}

/**
 *str:主字符串
 *ostr:被替换的字符串 如果字符串中有[] 则要转义\\,因为是正则表达式特有的
 *nstr:新字符串,中的中括号不用转义
 */
function strReplaeAll(str,ostr,nstr){
	var reg = new RegExp(ostr,'g')
	return str.replace(reg,nstr);
}

/**
 *谷利军
 *node 当前节点对象
 *取得当前节点的所有属性,没用到
 */
function nodeAttribute(node){
	var str = "";
	try{
		var count = node.attributes.length;
		for (var i=0; i<count;i++){
			var nm = node.attributes[i].nodeName;
			var text = node.attributes[i].nodeValue;
			if(text!=null && text!=""){
				if(nm=='contentEditable' && nm=='class') continue;
				str += nm+"="+text;
			}
		}
	}catch(e){
	}
	return str;
}

/**
 *谷利军
 *取得传入节点的子节点如果有多个,则只返回第一个
 *node 当前节点对象
 *name 节点名称或节点标签名称
 *status 0=匹配节点的标签名称;1=匹配节点的名称
 */
function getChildNode(node,name,status){
	try{
		if (!node) return;
		if (node.hasChildNodes()){
			var childs = node.childNodes;//取得当前节点的所有子节点
			for(var m=0;m<childs.length;m++) {
				if(status==1){
					if(childs[m].name==name)
						return childs[m];
				}else{
					if(childs[m].tagName==name)
						return childs[m];
				}
			}
		}
	}catch(e){
	}
}

/**
 *谷利军
 *递归的删除一个DOM节点下的所有子节点方法
 *node 当前节点
 */
function removeChild(node) {
	try{
		if (!node) return;
		while (node.hasChildNodes()){
			var childs = node.childNodes;//取得当前节点的所有子节点
			for(var m = childs.length-1;m >= 0; m--){//我们从索引最大值开始删除，采用递减的方法，这样索引便不会移动改变了
				removeChild(childs[m]);
				node.removeChild(childs[m]);
			}
		}
	}catch(e){
	}
}

/**
 *移除当前节点，包括所有子节点
 *node当前节点对象
 */
function removeCurNode(node){
	try{
		removeChild(node);
		node.removeNode();
	}catch(e){
		alert("common=======429========"+e);
	}
}

/**
 *格式化代码,并实现三位一撇
 */
function getFormat(n){
	var b=parseInt(n).toString();
	var len=b.length;
	if(len<=3){return b;}
	var r=len%3;
	return r>0?b.slice(0,r)+","+b.slice(r,len).match(/\d{3}/g).join(","):b.slice(r,len).match(/\d{3}/g).join(",");
}

/**
 * @param str 原字符串
 * @param fillStr 填充的字符串
 * @param len 需要的长度
 * @return 按需要的长度,把填充的字符串填充到原字符串的左边
 */
function LFillStr(str,fillStr,len) {
	var i = len-str.length;
	var mStr = "";
	for (var j=0; j<i; j++){
		mStr=mStr+fillStr;
	}
	mStr=mStr+str;
	return mStr;
}

/**
 保留两位小数
 功能：将浮点数四舍五入,取小数点后2位
 **/
function getFormat0(oldStr,scale) {
	try{
		var f = parseFloat(oldStr);
		if (isNaN(oldStr)) return 0;
		var s = Math.pow(10,scale);
		f = Math.round(oldStr * s)/s;
		return getFormat1(f,scale);
	}catch(e){
		return oldStr;
	}
}

/**
 * 保留scale位小数;如果小数点后面为0则把小数点也去掉
 * @param oldStr
 * @param scale 数值型
 */
function getFormat1(oldStr,scale){
	var str = oldStr+"";
	var len = str.length;//字符串的长度
	var newStr = "";
	if (str=="" || str==undefined) return newStr;
	var opNumb = str.indexOf(".");
	if (opNumb>-1){
		if(len-opNumb>scale){
			newStr = str.substr(0,opNumb+scale+1);
			var subScale = getStrEnd(newStr,".");
			if(parseInt(subScale)==0) newStr = getStrFront(newStr,".");
		}else {
			newStr = str;
		}
		if(newStr.indexOf(".")>-1 && newStr.substr(len-3)=="0"){//字符串后面加了 "",所以比原来加长了两位
			newStr = newStr.substr(0,len-3);//这里是去掉小数最后一位的0
		}
	}else{
		newStr = str;
	}
	return newStr;
}

//将字符串转为json对象 str的格式为0=qwr;2=wryw;3=rtywry
function strTomap(jsonStr){
	var obj = new Object();
	var strArr = jsonStr.split(";");
	var str,strVal,StrText;
	for(var i =0;i<strArr.length;i++){
		str = strArr[i];
		strVal = getStrFront(str,"=");
		StrText = getStrEnd(str,"=",'last');
		obj[strVal] = StrText;
	}
	return obj;
}



/*
*这里是格式化标签用到
*如果数据太长,用此方法格式化
*/
function getFormat2(numb,scale){
	var vl=numb;
	if(isNull(scale)) scale = 2;
	if(numb >= 100000000 || numb <= -100000000){
		vl=getFormat1(numb/100000000,scale) + "亿";
	}else if(numb >= 10000 || numb <= -10000){
		vl=getFormat1(numb/10000,scale) + "万";
	}else if(numb >= 1000 || numb <= -1000){
		vl=getFormat1(numb/1000,scale) + "千";
	}
	return vl;
}

/*
*产生一个numb位的随机数
*/
function getRanNumb(numb){
	return Math.round(Math.random()*Math.pow(10,numb));
}

/**
 *产生一定范围内的随机数
 *
 */
function RandomNum(Min,Max){
	var Range = Max - Min;
	var Rand = Math.random();
	var num = Min + Math.round(Rand * Range);
	return num;
}

/*
*取到一个字符串(str)的倒数第(numb)位的一个字符
*主要作用是用来判断二进制位
*/
function getStrDigit(str,numb){
	var returnStr="";
	str += "";
	if(str.length>=numb){
		var start = str.length-numb;
		var end = start+1;
		var subStr = str.substring(start,end);
		returnStr = subStr;
	}
	return returnStr;
}

/*
*去掉一个字符串(str)的倒数(numb)个字符
*/
function delEndStr(str,numb){
	var returnStr="";
	if(str.length>=numb){
		var subStr = str.substring(0,str.length-numb);
		returnStr = subStr;
	}
	return returnStr;
}

/*
*去掉一个字符串(str)的前(numb)个字符
*/
function delFrontStr(str,numb){
	var returnStr="";
	if(str.length>=numb){
		var subStr = str.substring(numb,str.length);
		returnStr = subStr;
	}
	return returnStr;
}

/**
 *提取查找字符串前面所有的字符
 *mainStr主字符串
 *searchStr被查找的字符串
 *place：如果有多个相同的被查字符串时，取最前一个还是最后一个(front=最前一个;last=最后一个)
 */
function getStrFront(mainStr,searchStr,place){
	var startNumb = 0;
	if(place=="last"){
		startNumb = mainStr.lastIndexOf(searchStr);
	}else{
		startNumb = mainStr.indexOf(searchStr);
	}
	if(startNumb==-1){
		return mainStr;
	}
	return mainStr.substring(0,startNumb);
}

/**
 *提取查找字符串后面的所有字符
 *mainStr主字符串
 *searchStr被查找的字符串
 *place:如果有多个相同的被查字符串时，取最前一个还是最后一个(front=最前一个;last=最后一个)
 */
function getStrEnd(mainStr,searchStr,place){
	try{
		var startNumb = 0;
		mainStr += "";
		if(place=="last") startNumb = mainStr.lastIndexOf(searchStr);
		else startNumb = mainStr.indexOf(searchStr);
		if(startNumb==-1) return mainStr;
		return mainStr.substring(startNumb+searchStr.length,mainStr.length);
	}catch(e){
		alert(e);
	}
}

//显示一个模态窗口，并返回子窗口所附的值(window.returnValue)
function showModal(url,windTitle,width,height){
	var str="";
	try{
		var winState = "scroll:yes;help:0;fullscreen=no;resizable:1;status:1;center:1;dialogHeight:"+height+"px;dialogWidth:"+width+"px;";
		if(url.indexOf("?")>-1) url += "&windTitle="+windTitle;
		else url += "?windTitle="+windTitle;
		url += "&random="+getRanNumb(2);//加上随机数防止IE对同一URL不发生请求winName
		str=window.showModalDialog(url,windTitle,winState);
	}catch(e){
	}
	return str;
}

/**
 *如果不传top left，默认为12
 *弹出一个新的普通窗口，并返回子窗口所附的值(window.returnValue=)指定弹出窗口的横纵坐标
 */
function windOpen(url,windTitle,width,height,left,top){
	if(typeof top==undefined)top=12;
	if(typeof left==undefined)left=12;
	var str="";
	try{
		if(width && height){
			var winState = "top="+top+",left="+left+",location=no,toolbar=no,directories=no,scrollbars=no,resizable=yes,width="+
				width+"px,height="+height+"px";
			str=window.open(url,"",winState);//弹出一个新页面
		}else{
			str=window.open(url,"_blank");//新加一个tab页面
		}
	}catch(e){
	}
	return str;
}

/**
 *下载文件的名的格式化,返回可以下载文件名的字符串
 *filePath:这里是文件名的璐径,后面可以不用带"/";
 *fileName:这里是文件名
 */
function formatDownFile(filePath,fileName){
	if(isNull(fileName)) return "";
	var downpath = filePath+"/"+fileName;
	return "<a href=\"javascript:void(0)\" style='text-decoration:none;color: blue;' onclick='filedownload(\""+downpath+"\")' title='"+fileName+"'>"+fileName+"</a>";
}

/**
 *文件件下载
 *这里是文件下载
 *path:包括路径的全文件名称
 */
function filedownload(path){
	window.open(path,"newwindow", "height=100, width=400, toolbar =no, menubar=no, scrollbars=no, resizable=no, location=yes, status=no");//下载文件的jsp 
}

/**
 *谷利军
 *为URL添加随机数,主要是为了防止请求同一个页面而造成网页不刷新
 */
function urlAddRandom(url){
	if(url.indexOf("?")>-1) url += "&random="+getRanNumb(2);
	else url += "?random="+getRanNumb(2);
	return url;
}

/**
 *谷利军
 *取得对象的值(radio对象的选择值)
 */
function getRadVal(radioObj,radioNumb){
	var str = "";
	try{
		for(var i=0;i<=radioNumb;i++){
			var obj = document.getElementById(radioObj+i);
			if(obj!=null && obj.checked){
				str = obj.value;
				break;
			}else{
				continue;
			}
		}
	}catch(e){
	}
	return str;
}

/**---------------------------------------------------
 * 取得当前日期所在月的最大天数
 */
Date.prototype.MaxDayOfDate = function(){
	var myDate = this;
	var ary = myDate.toArray();
	var date1 = (new Date(ary[0],ary[1]+1,1));
	var date2 = date1.dateAdd(1,'m',1);
	var result = dateDiff(date1.Format('yyyy-MM-dd'),date2.Format('yyyy-MM-dd'));
	return result;
}

//+--------------------------------------------------- 
//| 取得当前日期所在周是一年中的第几周 
//+--------------------------------------------------- 
Date.prototype.WeekNumOfYear = function(){
	var myDate = this;
	var ary = myDate.toArray();
	var year = ary[0];
	var month = ary[1]+1;
	var day = ary[2];
	var result = DatePart('ww', myDate);
	return result;
}

//+--------------------------------------------------- 
//| 把日期分割成数组 
//+--------------------------------------------------- 
Date.prototype.toArray = function(){
	var myDate = this;
	var myArray = Array();
	myArray[0] = myDate.getFullYear();
	myArray[1] = myDate.getMonth();
	myArray[2] = myDate.getDate();
	myArray[3] = myDate.getHours();
	myArray[4] = myDate.getMinutes();
	myArray[5] = myDate.getSeconds();
	return myArray;
}

//+--------------------------------------------------- 
//| 取得日期数据信息 
//| 参数 interval 表示数据类型 
//| y 年 m月 d日 w星期 ww周 h时 n分 s秒 
//+--------------------------------------------------- 
Date.prototype.DatePart = function(interval){
	var myDate = this;
	var partStr="";
	var Week = new Array("日","一","二","三","四","五","六");
	switch (interval){
		case 'y' :partStr = myDate.getFullYear();break;
		case 'm' :partStr = myDate.getMonth()+1;break;
		case 'd' :partStr = myDate.getDate();break;
		case 'w' :partStr = Week[myDate.getDay()];break;
		case 'ww' :partStr = myDate.WeekNumOfYear();break;
		case 'h' :partStr = myDate.getHours();break;
		case 'n' :partStr = myDate.getMinutes();break;
		case 's' :partStr = myDate.getSeconds();break;
	}
	return partStr;
}

/**
 *取得当前的时间传入所需要的时间格式
 *如：yyyyMMdd;yyyyMM;yyyy;yyyy-MM-dd;yyyy-MM;
 *yyyyMMddhhmmss;yyyyMMddhhmm;yyyyMMddhh;
 */
function getNowTime(format){
	var mydate = new Date();
	//取得当前时间
	var nowDate= new Date();
	return dateFromat(nowDate,format);
}

/**
 *取得相对时间
 *dateStr:curY(-1);curM(-2);curD(-3)
 *dateFormat:时间格式yyyyMMdd
 */
function getRelativeDate(dateStr,dateFormat){
	var type = 1;//1=年,2=月,3=天,4=小时
	var n = -1;//相隔数据
	var format = "";
	if(!isNull(dateFormat)) format = dateFormat;
	if(dateStr.indexOf("curW")>-1){
		type = 3;
		format = "yyyyMMdd";
		n = getStrFront(getStrEnd(dateStr,"(","last"),")","front");
		n = eval(n*7);
		var dt = curNearDate(type,n,format);
		return getYearWeek(dt);
	}else{
		if(dateStr.indexOf("curY")>-1){
			type = 1;
			if(isNull(format)) format = "yyyy";
		}else if(dateStr.indexOf("curM")>-1){
			type = 2;
			if(isNull(format)) format = "yyyyMM";
		}else if(dateStr.indexOf("curD")>-1){
			type = 3;
			if(isNull(format)) format = "yyyyMMdd";
		}else if(dateStr.indexOf("curH")>-1){
			type = 4;
			if(isNull(format)) format = "yyyyMMdd HH";
		}
		n = getStrFront(getStrEnd(dateStr,"(","last"),")","front");
	}
	var dt = curNearDate(type,n,format);
	return dt;
}

/**
 *谷利军
 *取得当前的时间传入所需要的时间格式和日期
 */
function curMillisecond(){
	var oldTime = (new Date()).getTime(); //得到毫秒数
	return oldTime;
}

/**
 *谷利军
 *取得当前的时间传入所需要的时间格式和日期
 *参数一：传入的日期型变量；参数二：传入返回值的格式
 *如：yyyyMMdd;yyyyMM;yyyy;yyyy-MM-dd;yyyy-MM;
 *yyyyMMddhhmmss;yyyyMMddhhmm;yyyyMMddhh;
 */
function dateFromat(date,format){
	//取得当前时间
	var now = date;
	if(!now || now=="")	now = new Date();
	var year=now.getFullYear();
	var month=now.getMonth()+1;
	//如果月份长度是一位则前面补0
	if(month<10) month = "0" + month;

	var day=now.getDate();
	//如果天的长度是一位则前面补0
	if(day<10) day = "0" + day;
	var hour=now.getHours();
	//如果小时长度是一位则前面补0
	if(hour<10) hour = "0" + hour;

	var minute=now.getMinutes();
	//如果分钟长度是一位则前面补0
	if(minute<10) minute = "0" + minute;

	var second=now.getSeconds();
	//如果钞长度是一位则前面补0
	if(second<10) second = "0" + second;

	var nowdate="";
	if(format=="yyyy"){
		nowdate = year;
	}else if(format=="yyyyMM"){
		nowdate = year+""+month;
	}else if(format=="yyyyMMdd"){
		nowdate = year+""+month+""+day;
	}else if(format=="yyyyMMddhh"){
		nowdate = year+""+month+""+day+""+hour;
	}else if(format=="yyyyMMddhhmm"){
		nowdate = year+""+month+""+day+""+hour+""+minute;
	}else if(format=="yyyyMMddhhmmss"){
		nowdate = year+""+month+""+day+""+hour+""+minute+""+second;
	}else if(format=="yyyy-MM"){
		nowdate = year+"-"+month;
	}else if(format=="yyyy-MM-dd"){
		nowdate = year+"-"+month+"-"+day;
	}else if(format=="yyyy-MM-dd hh"){
		nowdate = year+"-"+month+"-"+day+" "+hour;
	}else if(format=="yyyy-MM-dd hh:mm"){
		nowdate = year+"-"+month+"-"+day+" "+hour+":"+minute;
	}else if(format=="yyyy-MM-dd hh:mm:ss"){
		nowdate = year+"-"+month+"-"+day+" "+hour+":"+minute+":"+second;
	}
	return nowdate;
}

/**
 *谷利军
 *转入形如yyyyMMddhhmmss这样的字符串,返回所需要的格式 可以扩展
 参数二：传入返回值的格式
 *如：yyyy-MM;yyyy-MM-dd;yyyy-MM-dd HH;yyyy-MM-dd HH:mm;yyyy-MM-dd HH:mm:ss;yyyy-MM-dd HH:mm:ss:SSS
 */
function strDateFromat(strDate,format){
	if(isNull(strDate)) return "";
	var st = strDate+"";//传入的可能是数字型
	var len = st.length;
	var year="";
	if(len>=4) year=st.substring(0, 4);
	var month="";
	if(len>=6) month=st.substring(4,6);
	var day="";
	if(len>=8) day=st.substring(6,8);
	var hour="";
	if(len>=10) hour=st.substring(8,10);
	var minute="";
	if(len>=12) minute=st.substring(10,12);
	var second="";
	//如果钞长度是一位则前面补0
	if(len>=14) second=st.substring(12,14);

	var nowdate="";
	if(format=="yyyy-MM"){
		nowdate = year+"-"+month;
	}else if(format=="yyyy-MM-dd"){
		nowdate = year+"-"+month+"-"+day;
	}else if(format=="yyyy-MM-dd hh"){
		nowdate = year+"-"+month+"-"+day+" "+hour;
	}else if(format=="yyyy-MM-dd hh:mm"){
		nowdate = year+"-"+month+"-"+day+" "+hour+":"+minute;
	}else if(format=="yyyy-MM-dd hh:mm:ss"){
		nowdate = year+"-"+month+"-"+day+" "+hour+":"+minute+":"+second;
	}
	return nowdate;
}

//+---------------------------------------------------
//| 字符串转成日期类型 (有待改进)
//| 格式 MM/dd/YYYY MM-dd-YYYY YYYY/MM/dd YYYY-MM-dd
//+---------------------------------------------------
function StringToDate(DateStr){
	var converted = Date.parse(DateStr);
	var myDate = new Date(converted);
	if (isNaN(myDate)){
		var arys= DateStr.split('-');
		myDate = new Date(arys[0],arys[1],arys[2]);
	}
	return myDate;
}

//根据日期字符串生成日期对象,日期字符串格式为YYYY-MM-DD或YYYYMMDD
function setDate(strDate){
	try{
		if(strDate.indexOf("-")==-1){
			if(strDate.length!=8) return;
			var str = strDate;
			strDate = delEndStr(str,4)+"-"+delFrontStr(delEndStr(str,2),4)+"-"+delFrontStr(str,6)
		}else{
			if(strDate.length!=10) return;
		}
		var aDate = strDate.split("-");
		return new Date(aDate[0],aDate[1]-1,aDate[2]);
	}catch(e){
	}
}

/**
 *谷利军
 *获得指定日期的临近日期
 *strDate:字符串类型;指定的日期,格式为yyyy-MM-dd或yyyyMMdd
 *nDay:与指定日期相邻的天数 1为明天 -1为昨天
 *format返回字符串的格式(yyyy-MM-dd或yyyyMMdd或yyyy-MM或yyyyMM或yyyy)
 *如果strDate为空或为空字符串则取当前日期
 */
function getNearDay(strDate,nDay,format){
	try{
		var oDate;
		if(strDate==null || strDate=="") oDate = new Date();
		else oDate = setDate(strDate);
		var newDate = new Date(oDate.valueOf() + nDay*24*60*60*1000);
		return dateFromat(newDate,format);
	}catch(e){
		alert(e);
		return "";
	}
}

/**
 *谷利军
 *获得当前日期的临近日期
 *dateType:数字类型;1=年,2=月,3=天,4=小时
 *n:与指定日期相邻的数据,与dateType配合使用,
 *format返回字符串的格式(yyyy-MM-dd或yyyyMMdd或yyyy-MM或yyyyMM或yyyy)
 *strDate:字符串类型;指定的日期,格式为yyyy-MM-dd或yyyyMMdd,如果没有找表则取系统日期
 */
function curNearDate(dateType,n,format,strDate){
	var str = "";
	try{
		var num = eval(n*1);
		var oDate;
		if(isNull(strDate)) oDate = new Date();
		else{
			while(strDate.length<8){
				strDate=strDate+"01";
			}
			oDate = setDate(strDate);
		}
		if(dateType==1){
			oDate.setFullYear(oDate.getFullYear()+(num));
		}else if(dateType==2){//这里需要处理3.30 减一过月时变成了2.30,系统还是取的三月的情况
			//如果是大月的31号,如果这里设置6.31号,则时间就变成了7.1(因为6月没有31号)
			var maxmonth = [4,6,9,11];
			var d = oDate.getDate();
			var m = oDate.getMonth()+(num);
			if(d==31 && maxmonth.indexOf(m+1)>-1) oDate.setDate(30);//二月份没有处理
			oDate.setMonth(m);
		}else if(dateType==3){
			oDate.setDate(oDate.getDate() +(num));
		}else if(dateType==4){
			oDate.setHours(oDate.getHours()+(num));
		}
		str=dateFromat(oDate,format);
	}catch(e){
	}
	return str;
}

/** 取得系统当前日期 */
function getNowZhTime(){
	var today=new Date();
	var hours=today.getHours();
	var minutes = today.getMinutes();
	var seconds=today.getSeconds();
	var noon="";
	if(hours<5) noon="凌晨";
	if(hours>4&hours<8) noon="早晨";
	if(hours>7&hours<12) noon="上午";
	if(hours==12) noon="中午";
	if(hours>12&hours<19) noon="下午";
	if(hours>18&hours<23) noon="晚上";
	if(hours>22) noon="深夜";
	var week=["天","一","二","三","四","五","六"];
	return today.getFullYear()+"年"+(today.getMonth()+1)+"月"+today.getDate()+"日"+" 星期"+week[today.getDay()];
}

/** 取得系统当前日期 */
function getNowHours(){
	var today=new Date();
	var hours=today.getHours();
	var minutes = today.getMinutes();
	var seconds=today.getSeconds();
	return hours;
}

/** 取得当前日期是一年的第几周(传入数据的格式yyyyMMdd)*/
function getYearWeek (strDate) {
	/*  date1是当前日期; date2是当年第一天; d是当前日期是今年第多少天  用d + 当前年的第一天的周差距的和在除以7就是本年第几周   */
	var a = strDate.substring(0, 4);
	var b = strDate.substring(4, 6);
	var c = strDate.substring(6, 8);
	var date1 = new Date(a, parseInt(b) - 1, c),
		date2 = new Date(a, 0, 1),
		d = Math.round((date1.valueOf() - date2.valueOf()) / 86400000);
	var week = Math.ceil((d + ((date2.getDay() + 1) - 1)) / 7);
	if(week<10) week = a+"0"+week;
	else week = a+""+week;
	return week;
}

/** 取得当前日期是一月的第几周*/
function getMonthWeek(strDate) {
	var a = strDate.substring(0, 4);
	var b = strDate.substring(4, 6);
	var c = strDate.substring(6, 8);
	/**a = d = 当前日期; b = 6 - w = 当前周的还有几天过完(不算今天); a + b 的和在除以7 就是当天是当前月份的第几周	*/
	var date = new Date(a, parseInt(b) - 1, c),
		w = date.getDay(),
		d = date.getDate();
	if(w==0) w=7;
	var config={getMonth:date.getMonth()+1,	getYear:date.getFullYear(),	getWeek:Math.ceil((d + 6 - w) / 7),}
	return config;
}

/**
 *谷利军
 *功能：动态为select框增加选择项
 *info：如果多个点则用半角分号隔开(如：val1=text1;val2=text2)
 *sel:加入select框的ID号
 *status：在加入下框内容之前是否要清空原来的项目;0=不清空;1=先清空
 */
function addOption(info,selId,status){
	try{
		var str1, str2;
		var sel = document.getElementById(selId);
		if(status==1) sel.length=0;// 这一句是把sel框清空
		//在每个分隔字符处进行分解。
		if(info!=""){
			str1 = info.split(";");
			for(var i=0;i<str1.length;i++){
				str2 = str1[i].split("=");
				setOptionData(str2[0],str2[1],sel);
			}
		}
	}catch(e){
	}
}

/**
 *如果下拉框中包含有传入的选项, 则只留传入的项 ,删除别的项目
 *则只保留onecd相应的项
 */
function oneOptionsByObj(onecd,obj,selId){
	if(!isNull(onecd) && obj.hasOwnProperty(onecd)){
		for(var cd in obj){//这晨是删除相关下拉
			if(cd!=onecd) delete obj[cd];
		}
	}
	addOptionByObj(obj,selId,1);
}

/**
 *谷利军
 *功能：动态为select框增加选择项
 *obj
 *sel:加入select框的ID号
 *status：在加入下框内容之前是否要清空原来的项目;0=不清空;1=先清空
 */
function addOptionByObj(obj,selId,status){
	try{
		var selobj = document.getElementById(selId);
		if(status==1) selobj.length=0;// 这一句是把sel框清空
		//在每个分隔字符处进行分解。
		if(isNullObj(obj)) return;
		for(var cd in obj){
			setOptionData(cd,obj[cd],selobj);
		}
	}catch(e){
	}
}

/**
 * 为下拉框添加下拉对象
 * @param value
 * @param text
 * @param selobj
 */
function setOptionData(value,text,selobj){
	var oOption = document.createElement("option");
	oOption.value = value;
	oOption.text  = text;
	oOption.title = oOption.text;//鼠标放上去出现提示信息
	if(isExist(selobj,value)) alert("不能重复加入所选项!");
	else selobj.add(oOption);
}

/**
 *谷利军
 *功能：判断select 框中是否有存在的Option Value值;返回true或false
 *objSel：select 对象
 *optVal：传入的Option对象的Value值
 */
function isExist(objSel,optVal){
	var flag = false;
	try{
		for(var i=0;i<objSel.options.length;i++){
			if(optVal==objSel.options[i].value){
				flag = true;
				break;
			}
		}
	}catch(e){
	}
	return flag;
}

/**
 *谷利军
 *清除select中的下拉项
 *sel1：select的ID号
 *status清除状态：全部清空还是只清空选择项;0=全部清空;1=清空当前选中项
 */
function clearOption(sel1,status){
	try{
		var sourceSel = document.getElementById(sel1);
		if(status==0){
			//sourceSel.length=0;// 这一句是把sel框清空
			removeChild(sourceSel);
		}else{
			for(var i=sourceSel.options.length-1;i>=0;i--){
				if(sourceSel.options[i].selected){
					//sourceSel.options[i] = null;//这样也可以
					sourceSel.removeChild(sourceSel.options[i]);//这句就做到兼容了.
				}
			}
		}
	}catch(e){
	}
}

/**
 *谷利军
 *得到select中的所有下拉项;返回值为字符串：如果多个点则用半角分号隔开(如：val1=text1;val2=text2)
 *注意：下拉项的value和text不能包括半角等号和半角分号(= ;)
 *sel1：select的ID号
 */
function optionItem(chkId){
	var str = "";
	try{
		var objChk = document.getElementById(chkId);
		var optVal,optText;
		for(var i=0;i<objChk.options.length;i++){
			optVal = objChk.options[i].value;
			optText = objChk.options[i].text;
			if(optVal!="" && optText!=""){
				str += optVal+"="+optText+";";
			}
		}
	}catch(e){
	}
	return delEndStr(str,1);
}


/**
 *取得表达式中的字段集合
 *expr:含有字段名称的表达式,字段用[]括起来的;
 **/
function getFieldList(expr){
	var fldLi = [];
	try{
		if (expr=="" || expr==null) return "";
		var m = expr.indexOf("[");
		while(m >=0){//每次只能替换一个字段
			var n = expr.indexOf("]");
			var startStr = expr.substring(0,m);
			var subComm = expr.substring(m+1,n);
			var endStr = expr.substring(n+1,expr.length);
			fldLi.push(subComm);
			expr = endStr;
			m = expr.indexOf("[");
		}
	}catch(e){
	}
	return fldLi;
}

/**
 *根据用户输入的中文字段条件，替换成sql语句中的字段
 *commentStr含有字段名称的表达式,中文字段用[]括起来的;
 *colArray为对象数组,单个对象必需包括的键为name,和comm
 **/
function getSearchStr(commentStr,colArray){
	try{
		if (commentStr=="" || commentStr==null) return "";
		var m = commentStr.indexOf("[");
		while(m >=0){//每次只能替换一个字段
			var n = commentStr.indexOf("]");
			var startStr = commentStr.substring(0,m);
			var subComm = commentStr.substring(m+1,n);
			var endStr = commentStr.substring(n+1,commentStr.length);
			commentStr = startStr+_getFieldName(subComm,colArray)+endStr;
			m = commentStr.indexOf("[");
		}
		return commentStr;
	}catch(e){
	}
}

/**
 *根据传入的字段注释返回字段名，为了组成新的SQL语句
 *fieldComm字段的说明;
 *colArray为对象数组,单个对象必需包括的键为name,和comm
 **/
function _getFieldName(fieldComm,colArray){
	var str = fieldComm;
	try{
		if (fieldComm==null || fieldComm=="") return "";
		for(var i in colArray){
			if(fieldComm==colArray[i].comm){
				str = colArray[i].name;
				break;
			}
		}
	}catch(e){
	}
	return str;
}

/**
 *谷利军
 * 获取鼠标在页面上的位置
 * @param ev	触发的事件
 * @return		point.x:鼠标在页面上的横向位置,point.y:鼠标在页面上的纵向位置
 */
function getMousePoint() {
	// 定义鼠标在视窗中的位置
	var point = {
		x:0,
		y:0
	};
	// 如果浏览器支持 pageYOffset, 通过 pageXOffset 和 pageYOffset 获取页面和视窗之间的距离
	if(typeof window.pageYOffset != 'undefined') {
		point.x = window.pageXOffset;
		point.y = window.pageYOffset;
	}
		// 如果浏览器支持 compatMode, 并且指定了 DOCTYPE, 通过 documentElement 获取滚动距离作为页面和视窗间的距离
	// IE 中, 当页面指定 DOCTYPE, compatMode 的值是 CSS1Compat, 否则 compatMode 的值是 BackCompat
	else if(typeof document.compatMode != 'undefined' && document.compatMode != 'BackCompat') {
		point.x = document.documentElement.scrollLeft;
		point.y = document.documentElement.scrollTop;
	}
	// 如果浏览器支持 document.body, 可以通过 document.body 来获取滚动高度
	else if(typeof document.body != 'undefined') {
		point.x = document.body.scrollLeft;
		point.y = document.body.scrollTop;
	}

	// 加上鼠标在视窗中的位置
	point.x += event.clientX;
	point.y += event.clientY;
	// 返回鼠标在视窗中的位置
	return point;
}

/**
 *谷利军
 *在jsp中返回元素的位置 o.l左;o.r右;o.t顶;o.h高
 *还没完成
 */
function getEleSeat(){
	try{
		//获得输入框的横纵坐标
		var obj=document.getElementById("idxName");
		var leftValue=0;
		var topValue=0;

		topValue+=obj.offsetHeight;//将坐标加上输入框的高度

		while(obj.offsetParent){
			leftValue+=obj.offsetLeft;
			topValue+=obj.offsetTop;
			obj=obj.offsetParent;
		}
		//设置显示div框的坐标
		document.getElementById("showSearchInfo").style.left=leftValue-2;
		document.getElementById("showSearchInfo").style.top=topValue-5;
	}catch(e){
	}
}

/**
 *谷利军
 *清空input type="file" 控件的value值
 *传入控件的ID
 */
function cleanFile(id){
	var _file = document.getElementById(id);
	if(_file.files) _file.value = "";
	else {
		if (typeof _file != "object") return null;
		var _span = document.createElement("span");
		_span.id = "sp"+id;
		_file.parentNode.insertBefore(_span,_file);
		var tf = document.createElement("form");
		tf.appendChild(_file);
		document.getElementsByTagName("body")[0].appendChild(tf);
		tf.reset();//清空表单
		_span.parentNode.insertBefore(_file,_span);
		_span.parentNode.removeChild(_span); //移去span标签       
		_span = null;
		tf.parentNode.removeChild(tf);//移去from标签  
	}
}

/**
 *谷利军
 *切换竖向的分割栏，主要是用来隐藏或显示左栏(ldivId)
 *eleType元素的类型1=表格;否则为div
 */
var lDivWidth;//全局变量,是为了记住左边div的宽度,如果左边div隐藏它的宽度也变成0了
function switchBar(ldivId,rdivId,eleType){
	try{
		var lDivDisp = document.getElementById(ldivId).style.display;//左边div的显示状态
		var mDivWidth = document.getElementById(rdivId).offsetWidth;//右边div的宽度
		if(lDivDisp=="none"){
			document.getElementById(ldivId).style.display="block";
			document.getElementById(rdivId).style.width = (mDivWidth - lDivWidth)+ "px";
		}else{
			lDivWidth = document.getElementById(ldivId).offsetWidth;
			document.getElementById(ldivId).style.display="none";
			document.getElementById(rdivId).style.width = (mDivWidth + lDivWidth)+ "px";
		}
	}catch(e){}
}

/**
 *谷利军
 *删除特殊符号
 *用正则表达式去掉特殊字符
 */
function delSpecialStr(mainStr){
	try{
		var newStr = mainStr.replace(/[\s|\#|\%|\$|\&|\'|\@|\+|\*|\?|\(|\)|\[|\]|<|>|\{|\}|\||\/|\\|\"]/ig,"");
		return newStr;
	}catch(e){}
}

/**
 *谷利军
 *获取颜色
 *页面中必须要有下面一句
 *<OBJECT id="dlgHelper"	CLASSID="clsid:3050f819-98b5-11cf-bb82-00aa00bdce0b"></OBJECT>
 */
function callColorDlg(dlgHelper){
	var sColor = dlgHelper.ChooseColorDlg();
	if('0'==sColor){//即是选择了黑色或者是取消
		return '0';
	}
	sColor = sColor.toString(16);//选择了除开黑色以外的颜色
	if (sColor.length < 6) {
		var sTempString = "000000".substring(0,6-sColor.length);
		sColor = sTempString.concat(sColor);
	}
	return sColor;
}

/**
 *谷利军
 *取得应用的相对路径,最前面加了反斜杠
 */
function getWebApp(){
	try{
		var localUrl = location.href;
		localUrl = localUrl.replace(/\/\//g,"");//去掉//号
		var m = localUrl.indexOf("/");
		localUrl = localUrl.substring(m+1,localUrl.length);
		m = localUrl.indexOf("/");
		localUrl = localUrl.substring(0,m+1);
		return "/"+localUrl;
	}catch(e){
	}
}

/**
 *dataLi:数据对应其中存储的键值对,如果是数据则要变成数据型==
 *这里主要是为了表格自带的排序用到,如果不转数据的排序就不正确
 *将string类型的数字转化成float,
 */
function stringFormatNumb(dataLi){
	var v = "";
	for (var y in dataLi){
		for (var x in dataLi[y]){//注意:数据前面如果有0也是字符串
			v = dataLi[y][x];
			if(isNull(v)) continue;
			else if(v.length>=15) continue;//大于15就可能不是数值了！
			else if(!isNaN(Number(v))){
				if(v.indexOf("0.") == 0){
					dataLi[y][x] = Number(v);
				}else if(v.indexOf("0") == 0){
					continue;
				}else{
					dataLi[y][x] = Number(dataLi[y][x]);
				}
			}
		}
	}
	return dataLi;
}

/***
 * js
 * @param delay
 */
function sleep(delay) {
	var start = (new Date()).getTime();
	while((new Date()).getTime() - start < delay) {
		continue;
	}
}

/**
 * 将数字标准化为3位一撇
 * 输入： num 数字类型
 * 返回： string 类型
 */
function numberFormatter(num) {
	var ArrayData = num.toString().split('.');
	ArrayData[0] = ArrayData[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	return ArrayData.join(".");
}

Number.EPSILON=(function(){//解决兼容性问题
	return Number.EPSILON?Number.EPSILON:Math.pow(2,-52);
})();

//上面是一个自调用函数，当JS文件刚加载到内存中，就会去判断并返回一个结果，相比
//if(!Number.EPSILON){
//   Number.EPSILON=Math.pow(2,-52);
//}这种代码更节约性能，也更美观。
function numbersEqual(a,b){
	return Math.abs(a-b)<0.00001//Number.EPSILON;
}

/**
 *判断表达式是否相等,如果相等返回true,否则返回fasle
 *3406.85=1848.3+246.1+102.5+180.3+0+0+0+580.1+42.75+361.8+45
 */
function exprsEqual(expr){
	var flg = false;
	var v1 = eval(getStrFront(expr,"="));
	var v2 = eval(getStrEnd(expr,"=",'last'));
	flg = numbersEqual(v1,v2);
	return flg;
}

/**
 *返回一个新数据集,即rowsLi删除subRowsLi中满足条件的所有值
 *rowsLi:为所有行的数据(相当于List中存放的Map)
 *subRowsLi:子行的数据(相当于List中存放的Map)
 *cellCol:单元格所对应的字段(相当于key)
 */
function delExitRowByKeyVal(rowsLi,subRowsLi,cellCol){
	var nLi = new Array();
	var row = null,subrow = null,flg = false;
	for(var i in rowsLi){
		row = rowsLi[i];
		flg = false;//不包括标记
		for(var k in subRowsLi){
			subrow = subRowsLi[k];
			if(row[cellCol]==subrow[cellCol]){
				flg=true;
				continue;
			}
		}
		if(!flg) nLi.push(row);
	}
	return nLi;
}


/*解决Firefox不识别event事件===================================================开始============*/
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
	if(document.all)  return window.event;
	var _caller = _window_event_constructor.caller;
	while(_caller!=null){
		var _argument = _caller.arguments[0];
		if(_argument){
			var _temp = _argument.constructor;
			if(_temp.toString().indexOf("Event")!=-1) return _argument;
		}
		_caller = _caller.caller;
	}
	return null;
}
if(window.addEventListener) _firefox();
/*解决Firefox不识别event事件===================================================结束============*/

//身份证号合法性验证
//支持18位身份证号
//支持地址编码、出生日期、校验位验证
function IdentityCodeValid(code) {
	var city = { 11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古", 21: "辽宁", 22: "吉林", 23: "黑龙江 ", 31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南", 42: "湖北 ", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏 ", 61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏", 65: "新疆", 71: "中国台湾", 81: "中国香港", 82: "中国澳门", 91: "国外 " };
	var tip = "";
	/*    if (!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)) {
           tip = "身份证号格式错误";
           alert(tip);
           return false;
       } */

	if(code.length != 18){
		alert("身份证不足18位");
		return false;
	}


	if (!city[code.substr(0, 2)]) {
		tip = "地址编码错误";
		alert(tip);
		return false;
	}
	if (code.length == 18) {
		sBirthday = code.substr(6, 4) + "-" + Number(code.substr(10, 2)) + "-" + Number(code.substr(12, 2));
		var d = new Date(sBirthday.replace(/-/g, "/"))
		if (sBirthday != (d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate())) {
			tip="非法生日";
			alert(tip);
			return false;
		}
	}
	/*     //18位身份证需要验证最后一位校验位
        if (code.length == 18) {
            code = code.split('');
            //∑(ai×Wi)(mod 11)
            //加权因子
            var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
            //校验位
            var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
            var sum = 0;
            var ai = 0;
            var wi = 0;
            for (var i = 0; i < 17; i++) {
                ai = code[i];
                wi = factor[i];
                sum += ai * wi;
            }
            var last = parity[sum % 11];
            if (parity[sum % 11] != code[17]) {
                tip = "校验位错误";
                alert(tip);
                return false;
            }
        } */
	return true;
}