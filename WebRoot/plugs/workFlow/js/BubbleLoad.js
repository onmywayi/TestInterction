
var MainBubbleLoad = function(num,radius,color,opacity,position,drawer){
	//alert("creation")
	this.num = num || 5 //圆的数量
	this.radius = radius || 10 //圆的半径
	this.color = color || "#000000" //圆的颜色
	this.opacity = opacity || 0.2  //圆的透明度
	this.p = position //坐标
	this.draw = drawer //绘制SVG
	this.set = drawer.set() //圆数组
	this.timer = null //动画循环
}

/*
 *创建指定数量的圆，圆的数量和绘图用的svg需要作为参数传入
 * @para name 圆的id
 */
MainBubbleLoad.prototype.createCircle = function(name){
	
	for (var i = 0 ; i < this.num ; i = i+1){
		var circle = this.draw.circle(0)
		//alert(this.radius)
		circle.dx(2*i*this.radius)
		//alert(circle.x())
		this.set.add(circle)
	}
	
	this.set.attr({
		fill: this.color,
		opacity: this.opacity,
	})
	this.set.attr("class","loading")
	if(name){
		this.set.attr("id",name)
	}
	this.set.dmove(this.p.x + this.radius,this.p.y + this.radius)
}

/* 给元素集加上动画
 * @para set createCircle返回的set
 * @return timer 循环动画用，当需要停止动画时要使用clearTimerout(timer)
 */

MainBubbleLoad.prototype.addAnime = function(){
	var n = this.num //set中圆的个数
	var r = this.radius   //圆的半径
	var ms = 250 //单个圆的动画周期时间，单位是毫秒
	for (var i = 0; i<n; i=i+1){
		this.set.get(i).animate(ms/2,'<>', i * ms).radius(r).after(function(){
																this.animate(ms/2).radius(0)
																})
	}
	//this.timer = setTimeout(addAnime,n*ms+200)
}
