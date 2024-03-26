/*
 Highcharts JS v2.2.0 (2012-02-16)
 toolbox module

 (c) 2010-2011 Torstein H?nsi
 
这里覆盖了以前的exporting.js ,把它所对应的下拉按钮，替换为一排横向按钮
只需在页面上引用即可该JS即可
为了替换方便以前的exporting.js与toolbox.js的区别是一个是页面上直接显示控件，一个是下拉的形式展示控件的方法

License: www.highcharts.com/license
*/

		//获取当前网址，如： http://localhost:8088/test/test.jsp  
    var curPath=window.document.location.href;  
    //获取主机地址之后的目录，如： test/test.jsp  
    var pathName=window.document.location.pathname;  
    var pos=curPath.indexOf(pathName);  
    //获取主机地址，如： http://localhost:8088  
    var localhostPaht=curPath.substring(0,pos);  
    //获取带"/"的项目名，如：/test  
    var projectName=pathName.substring(0,pathName.substr(1).indexOf('/')+1);  
     //获取带"/"的项目名，如：http://localhost:8088/test 
    var projectPath = localhostPaht+projectName;

(function() {
    function x(a){
        for(var b=a.length;b--;)
            typeof a[b]==="number"&&(a[b]=Math.round(a[b])-0.5);
        return a
    }var f=Highcharts,y=f.Chart,z=f.addEvent,B=f.removeEvent,r=f.createElement,u=f.discardElement,t=f.css,s=f.merge,k=f.each,n=f.extend,C=Math.max,h=document,D=window,A=h.documentElement.ontouchstart!==void 0,v=f.getOptions();
    n(v.lang,{
        downloadPNG:"Download PNG image",
        contextButtonTitle:"Chart context menu",
        chartToTable:"Chart to table",
        chartToColumn:"Chart to column",
        chartToBar:"Chart to bar",
        chartToLine:"Chart to line",
        chartToPie:"Chart to pie",
        filterCond:"condtion"      
    });
    v.navigation={
        menuStyle:{
            border:"1px solid #A0A0A0",
            background:"#FFFFFF",
            padding:"5px 0"
        },
        menuItemStyle:{
            padding:"0 10px",
            background:"none",
            color:"#303030",
            fontSize:A?"14px":"11px"
        },

        menuItemHoverStyle:{
            background:"#4572A5",
            color:"#FFFFFF"
        },

        buttonOptions:{
            symbolFill:"#E0E0E0",
            symbolStroke:"#A0A0A0",

            align:"right",
            backgroundColor:{
                linearGradient:[0,0,0,20],
                stops:[[0.4,"#F7F7F7"],[0.6,"#E3E3E3"]]
            },
            borderColor:"#B0B0B0",
            borderRadius:3,
            borderWidth:1,
            height:15,
            hoverBorderColor:"#909090",
            hoverSymbolStroke:"#4572A5",

            verticalAlign:"top",
            width:16,y:10
        }
    };

    v.toolbox={
        type:"image/png",
        url:projectPath+"/ExportServlet",
        width:800,
        buttons:{
            exportButton:{
                symbol:"url("+projectPath+"/plugs/highChart/js/modules/image/options.gif)",
                x:-10,
                symbolFill:"#A8BF77",
                hoverSymbolFill:"#768F3E",
                _id:"exportButton",
                _titleKey:"contextButtonTitle",
                menuItems:[
                        {textKey:"filterCond",onclick:function(){setEleCond()}},
                        {textKey:"downloadPNG",onclick:function(){this.exportChart()}},
                        {textKey:"chartToTable",onclick:function(){SolveAll()}},
						{textKey:"chartToPie",onclick:function(){changeType("pie")}},
                        {textKey:"chartToColumn",onclick:function(){changeType("column")}},
                        {textKey:"chartToBar",onclick:function(){changeType("bar")}},
                        {textKey:"chartToLine",onclick:function(){changeType("line")}}
                    ]
            }
        }
    };n(y.prototype,{getSVG:function(a){var b=this,c,d,e,g=s(b.options,a);if(!h.createElementNS)h.createElementNS=function(a,b){var c=h.createElement(b);c.getBBox=function(){return f.Renderer.prototype.Element.prototype.getBBox.apply({element:c})};
return c};a=r("div",null,{position:"absolute",top:"-9999em",width:b.chartWidth+"px",height:b.chartHeight+"px"},h.body);n(g.chart,{renderTo:a,forExport:!0});g.toolbox.enabled=!1;g.chart.plotBackgroundImage=null;g.series=[];k(b.series,function(a){e=s(a.options,{animation:!1,showCheckbox:!1,visible:a.visible});if(!e.isInternal){if(e&&e.marker&&/^url\(/.test(e.marker.symbol))e.marker.symbol="circle";g.series.push(e)}});c=new Highcharts.Chart(g);k(["xAxis","yAxis"],function(a){k(b[a],function(b,d){var e=
c[a][d],g=b.getExtremes(),f=g.userMin,g=g.userMax;(f!==void 0||g!==void 0)&&e.setExtremes(f,g,!0,!1)})});d=c.container.innerHTML;g=null;c.destroy();u(a);
d=d.replace(/zIndex="[^"]+"/g,"")
   .replace(/isShadow="[^"]+"/g,"")
   .replace(/symbolName="[^"]+"/g,"")
   .replace(/jQuery[0-9]+="[^"]+"/g,"")
   .replace(/isTracker="[^"]+"/g,"")
   .replace(/url\([^#]+#/g,"url(#")
   .replace(/&nbsp;/g,"\u00a0")
   .replace(/&shy;/g,"\u00ad")
   .replace(/id=([^" >]+)/g,'id="$1"')
   .replace(/class=([^" ]+)/g,'class="$1"')
   .replace(/ transform /g," ")
   .replace(/:(path|rect)/g,"$1")
   .replace(/style="([^"]+)"/g,
    function(a){
        return a.toLowerCase()
    });
   d=d.replace(/(url\(#highcharts-[0-9]+)&quot;/g,"$1")
      .replace(/&quot;/g,"'");d.match(/ xmlns="/g)
      .length===2&&(d=d.replace(/xmlns="[^"]+"/,""));return d},
      exportChart:function(a,b){
        var c,d=this.getSVG(s(this.options.toolbox.chartOptions,b)),
        a=s(this.options.toolbox,a);
        c=r("form",{method:"post",action:a.url},{display:"none"},h.body);
        k(["filename","type","width","svg"],function(b){r("input",{
            type:"hidden",
            name:b,
            value:{filename:a.filename||"chart",type:a.type,width:a.width,svg:d}[b]
        },null,c)});c.submit();
        u(c)},
        print:function(){
            var a=this,b=a.container,c=[],d=b.parentNode,e=h.body,g=e.childNodes;
            if(!a.isPrinting)a.isPrinting=!0,k(g,function(a,b){if(a.nodeType===1)c[b]=a.style.display,a.style.display="none"
        }),
                e.appendChild(b),
            D.print(),setTimeout(function(){d.appendChild(b);k(g,function(a,b){if(a.nodeType===1)a.style.display=c[b]});a.isPrinting=!1},1E3)},
    contextMenu:function(a,b,c,d,e,g){
        var i=this,
            f=i.options.navigation,
            h=f.menuItemStyle,
            o=i.chartWidth,
            p=i.chartHeight,
            q="cache-"+a,
            j=i[q],
            l=C(e,g),
            m,
            w;
            if(!j)
                i[q]=j=r("div",{
                    className:"highcharts-"+a
                },{
                    position:"absolute",
                    zIndex:1E3,
                    padding:l+"px"
                },i.container),
            m=r("div",null,n({MozBoxShadow:"3px 3px 10px #888",WebkitBoxShadow:"3px 3px 10px #888",boxShadow:"3px 3px 10px #888"},f.menuStyle),j),
            w=function(){
                t(j,{display:"none"})
            },
            z(j,"mouseleave",w),
            k(b,function(a){
                if(a){
                    var b=a.separator?r("hr",null,null,m):r("div",{onmouseover:function(){t(this,f.menuItemHoverStyle)},onmouseout:function(){t(this,
h)},innerHTML:a.text||i.options.lang[a.textKey]},n({cursor:"pointer"},h),m);b[A?"ontouchstart":"onclick"]=function(){w();a.onclick.apply(i,arguments)};i.exportDivElements.push(b)}}),i.exportDivElements.push(m,j),i.exportMenuWidth=j.offsetWidth,i.exportMenuHeight=j.offsetHeight;a={display:"block"};c+i.exportMenuWidth>o?a.right=o-c-e-l+"px":a.left=c-l+"px";d+g+i.exportMenuHeight>p?a.bottom=p-d-l+"px":a.top=d+g-l+"px";t(j,a)},addButton:function(a){function b(){p.attr(l);o.attr(j)}var c=this,d=c.renderer,
e=s(c.options.navigation.buttonOptions,a),g=e.onclick,f=e.menuItems,h=e.width,k=e.height,o,p,q,a=e.borderWidth,j={stroke:e.borderColor},l={stroke:e.symbolStroke,fill:e.symbolFill},m=e.symbolSize||12;if(!c.exportDivElements)c.exportDivElements=[],c.exportSVGElements=[];e.enabled!==!1&&(o=d.rect(0,0,h,k,e.borderRadius,a).align(e,!0).attr(n({fill:e.backgroundColor,"stroke-width":a,zIndex:19},j)).add(),q=d.rect(0,0,h,k,0).align(e).attr({id:e._id,fill:"rgba(255, 255, 255, 0.001)",title:c.options.lang[e._titleKey],
zIndex:21}).css({cursor:"pointer"}).on("mouseover",function(){p.attr({stroke:e.hoverSymbolStroke,fill:e.hoverSymbolFill});o.attr({stroke:e.hoverBorderColor})}).on("mouseout",b).on("click",b).add(),f&&(g=function(){b();var a=q.getBBox();c.contextMenu("export-menu",f,a.x,a.y,h,k)}),q.on("click",function(){g.apply(c,arguments)}),p=d.symbol(e.symbol,e.symbolX-m/2,e.symbolY-m/2,m,m).align(e,!0).attr(n(l,{"stroke-width":e.symbolStrokeWidth||1,zIndex:20})).add(),c.exportSVGElements.push(o,q,p))},destroyExport:function(){var a,
b;for(a=0;a<this.exportSVGElements.length;a++)b=this.exportSVGElements[a],b.onclick=b.ontouchstart=null,this.exportSVGElements[a]=b.destroy();for(a=0;a<this.exportDivElements.length;a++)b=this.exportDivElements[a],B(b,"mouseleave"),this.exportDivElements[a]=b.onmouseout=b.onmouseover=b.ontouchstart=b.onclick=null,u(b)}});
f.Renderer.prototype.symbols.exportIcon=function(a,b,c,d){
    return["M",b+0.5,a+0.5,"L",b+0.5+d,a+0.5,"M",b+0.5,a+c/2-1.3,"L",b+0.5+d,a+c/2-1.3,"M",b+0.5,a+c-3.3,"L",b+0.5+d,a+c-3.3]
};
    f.Renderer.prototype.symbols.printIcon=function(a,b,c,d){return x(["M",a,b+d*0.7,"L",a+c,b+d*0.7,a+c,b+d*0.4,a,b+d*0.4,"Z","M",a+c*0.2,b+d*0.4,"L",a+c*0.2,b,a+c*0.8,b,a+c*0.8,b+d*0.4,"Z","M",a+c*0.2,b+d*0.7,"L",a,b+d,a+c,b+d,a+c*0.8,b+d*0.7,"Z"])};y.prototype.callbacks.push(function(a){var b,c=a.options.toolbox,d=c.buttons;if(c.enabled!==!1){for(b in d)a.addButton(d[b]);z(a,"destroy",a.destroyExport)}})})();

    
/**
*谷利军
*Highcharts 图形样式转换专用
*页面中必须要有下面一句
*/
function changeType(type){
	try{
		var flg = false;
		 options.chart.type = type;
		flg = true;
		if(flg) chartObj = new Highcharts.Chart(options);
	}catch(e){}
}   
    
/**
*页面设置元素的条件
*/
function setEleCond(){
	//这里是转入到showMain.jsp中的showMain.js的方法中
	window.parent.chartEleSetCond(this.eleId);
}	


//	把highchart图转换成easyUI的datagrid。
//	需要easyUI-1.3.6以及highcharts相应js库
//	在最外层创建了一个commonChartOptions对象（不用在最外层单独去建立对象用于接收变量）
//  这里的表格id为EasyTable
//***************************************************************************************
//获取最外层页面，并返回层数
function findOutside(){
	var num = 1;
	var pdom = window.parent;
	do{
		pdom = pdom.window.parent;
		num = num + 1;
	}while(pdom.window.parent != pdom)
	//num = num - 1;//因为逻辑关系，num会比已有层数高1 所以要减掉
	return num;
}
//在num层创建一个变量；目的是用来接收heighchart的options对象
/**
*把当前对象传送到父页面
*
*/
function SendVar(obj,num,varname){
	var pdom = window.parent;
	var name = varname || "commonChartOptions";//在num层创建一个变量；目的是用来接收heighchart的options对象
	
	for(var i = 1; i < num; i = i + 1){
		pdom = pdom.window.parent;
	}
	eval("pdom.window."+name+" = obj");
}

function SolveAll(){
	var num = findOutside();
	var obj = window.options;
	if(!obj){
		return;
	}
	SendVar(obj,num);
	var sw=screen.width/2; //屏的宽度
	var sh=screen.height/2;//屏的高度
	creatWindDiv(false,"",projectPath+"/plugs/highChart/js/modules/chartToTable/toTable.jsp",sw,sh,num)
}
