		/**
		* 谷利军 20140829
		* shield 不能为空;遮罩层 true=有遮罩层;false=没有遮罩层
		* name必须有形参,但可以为空字符串;窗口的名称,如果name=="0"代表没有窗口的标题栏,也没有关闭按钮
		* url 可以为空,但当后面的参数不为空时,此参数必须有形参;子窗口的内容url
		* w 可空为,大与1代表实际的宽度,小于1代表百分比
		* h 可空为,大与1代表实际的宽度,小于1代表百分比
		* parentNum 整形数据 如0,1,2,3等 父窗体的层级 可以为空;为空代表本页;
		*/
		
		var myAlert;//这里是主要的弹出DIV
		var mybg;//这里是遮罩层
		var docu = document;//目标层显示的位置
		
		function creatWindDiv(shield,name,url,w,h,parentNum,funcName){
			if(myAlert) closeAlertDiv();
			myAlert=null;mybg=null;
  			var sw=screen.width; //屏的宽度
			var sh=screen.height;//屏的高度
			var divW,divH;//弹出div的宽高
			//下面是宽度设置
			if(!w || w==0) divW = sw*0.8;
			else if(w>1) divW = w;
			else  divW = sw*w;
			//下面是高度设置
			if(!h || h==0) divH = sh*0.6;
			else if(h>1) divH = h;
			else  divH = sh*h;
			//宽和高都划成整数
			divW = parseInt(divW);
			if(parentNum != undefined){
				if(parentNum==1){
					docu = parent.document;
				}else if(parentNum==2){
					docu = parent.parent.document;
				}else if(parentNum==3){
					docu = parent.parent.parent.document;
				}
			}
			if(myAlert) return;//如果已经创建过,则不进行下次创建
			myAlert = docu.createElement("div"); //这里是主要的弹出DIV
			myAlert.id = "alertDiv";
			myAlert.style.cssText = "border: 1px solid #369;width:"+divW+"px;height:"+divH+"px;background:#e2ecf5;z-index:1000;position:absolute;";
			myAlert.style.display = "block"; 
			myAlert.style.position = "absolute"; 
			myAlert.style.top =  parseInt(((sh-divH)/2)-80)+"px";
			myAlert.style.left = parseInt((sw-divW)/2)+"px";
			myAlert.onmousedown=function(e){
				if(!e) e = window.event;  
				posX = e.clientX - parseInt(myAlert.style.left);
				posY = e.clientY - parseInt(myAlert.style.top);
				docu.onmousemove = mousemove;            
			};
			myAlert.onmouseup = function(){
				docu.onmousemove = null;
			};
			myAlert.callFunction = function(args) {
			    eval(funcName + "(" + args + ")" );
			};
			setAlertWindChild(myAlert,name,url,divH);//添加子页面的标题,关闭按钮,最大化,最小化
			docu.body.appendChild(myAlert);
			//===================下面是背景遮罩层的创建
			if(shield) createTranslucentDiv();
		}
	
		function setAlertWindChild(pObject,name,contUrl,divH){
			var framH = divH;
			if(name!="0"){//如果name==0代表没有标题栏
				framH = parseInt(framH-25);
				var titleObj = docu.createElement("h4"); //这里是创建窗口表头行,行高为20px
					titleObj.style.cssText = "height: 20px;background:#369;color: #fff;padding: 5px 0 0 5px;cursor:move;";
		
				var titleName = docu.createElement("span"); //窗口标题
					titleName.style.cssText = "float:left;";
					titleName.innerHTML=name;
					titleObj.appendChild(titleName);
					
				var titleColse = docu.createElement("span"); //窗口关闭
					titleColse.id = "closeAlertDiv";
					titleColse.style.cssText = "float:right;margin-right: 10px;font-weight:500;cursor: pointer;";
					titleColse.onclick=function(){
						closeAlertDiv();
					};
					titleColse.innerHTML="关闭";
					titleObj.appendChild(titleColse);
				pObject.appendChild(titleObj);
			}
				//下面是内容框
			var contentObj = docu.createElement("iframe");
				contentObj.id = "alertIfr";
				//如果你查看一下DOM Inspector 你会发现在IE下面，DOM里面的属性都是大写的，所以frame.setAttribute("frameborder", "0");不起作用
				contentObj.setAttribute("frameborder", "0", 0);//后面那个'0'表示是否区分大小写.
				contentObj.setAttribute("allowTransparency","true");//背景透明 overflow:hidden;
				contentObj.style.cssText = "height:"+framH+"px; width:100%; visibility:inherit;scroll:no;overflow:hidden;";
				if(contUrl) contentObj.src = contUrl;
			pObject.appendChild(contentObj);
		}
		
		function test() {
		  alert("In wins.js");
		}
		
		//创建透明背景遮罩层
		function createTranslucentDiv(){
			mybg = docu.createElement("div");
			mybg.setAttribute("id","mybg"); 
			mybg.style.background = "#000"; 
			mybg.style.width = "100%"; 
			mybg.style.height = "100%"; 
			mybg.style.position = "absolute"; 
			mybg.style.top = "0"; 
			mybg.style.left = "0"; 
			mybg.style.zIndex = "500"; 
			mybg.style.opacity = "0.3"; 
			mybg.style.filter = "Alpha(opacity=30)"; 
			docu.body.appendChild(mybg);
		}		

		 //拖动
		var posX;
		var posY;                  
		
		document.onmouseup = function(){
			docu.onmousemove = null;
		}

		function mousemove(ev){
			if(ev==null) ev = window.event;
			myAlert.style.left = (ev.clientX - posX) + "px"; 
			myAlert.style.top = ev.clientY - posY + "px";
		}
		
		//删除什么样的DIV
		function closeAlertDiv() {
			try{
		        if(mybg){
		        	mybg.parentNode.removeChild(mybg);
		        	mybg = null;
		        }
		        if(myAlert){
		        	myAlert.parentNode.removeChild(myAlert);
		        	myAlert = null;
		        }
	        }catch(e){}
		}		
