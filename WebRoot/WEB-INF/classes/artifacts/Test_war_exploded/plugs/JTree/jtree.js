 var subLenght = 18;
 
 function AccordionMenu(options) {
	this.config = {
		containerCls        : '.wrap-menu',                // 外层容器
		menuArrs            :  '',                         //  JSON传进来的数据
		type                :  'click',                    // 默认为click 也可以mouseover
		renderCallBack      :  null,                       // 渲染html结构后回调
		clickItemCallBack   :  null                // 每点击某一项时候回调
	};
	this.cache = {};
	this.init(options);
 }

/**
*
*
*/

 AccordionMenu.prototype = {
	constructor: AccordionMenu,
	init:function(options){
		this.config = $.extend(this.config,options || {});
		var self = this,
			_config = self.config,
			_cache = self.cache;
		//渲染html结构
		$(_config.containerCls).each(function(index,item){
			self._renderHTML(item);
			//处理点击事件
			self._bindEnv(item);
		});
	},
	
	_renderHTML: function(container){
		var self = this,
			_config = self.config,
			_cache = self.cache;
		var ulhtml = $('<ul></ul>');
		$(_config.menuArrs).each(function(index,item){
			var lihtml = $('<li><h2 id="n'+item.id+'" title="'+item.name+'" code="'+item.code+'" >'+(item.name).substr(0,subLenght)+'</h2></li>');
			//添加属性=================开始========================
			if(item.url && item.url.length > 0){
				($(lihtml).children("h2")).attr("url",item.url);
				($(lihtml).children("h2")).bind("click", function(){
					alert($(this).attr("target"));
				});
			}
			if(item.type_id && item.type_id.length > 0){
				($(lihtml).children("h2")).attr("type_id",item.type_id);
			}
			if(item.target && item.target.length > 0){
				($(lihtml).children("h2")).attr("target",item.target);
			}
			//添加属性=================结束========================

			//$("img").attr("src","test.jpg");
			if(item.image && item.image.length > 0){
				$(lihtml).children("h2").prepend('<img src="'+ item.image +'" alt=""/>');
			}

			if(item.submenu && item.submenu.length > 0){
				self._createSubMenu(item.submenu,lihtml);
			}
			$(ulhtml).append(lihtml);
		});
		$(container).empty();//清空下拉框 
		$(container).append(ulhtml);//这是只是添加要先清空,再添加
		//$.parser.parse();//这里是渲染,一定要加上哦!!
		_config.renderCallBack && $.isFunction(_config.renderCallBack) && _config.renderCallBack();
		// 处理层级缩进
		self._levelIndent(ulhtml);
	},
	
	/**
	 * 创建子菜单
	 * @param {array} 子菜单
	 * @param {lihtml} li项
	 */
	_createSubMenu: function(submenu,lihtml){
		var self = this,
			_config = self.config,
			_cache = self.cache;
		var subUl = $('<ul></ul>'),
			callee = arguments.callee,
			subLi;
		//这里是子菜单的子菜单项
		$(submenu).each(function(index,item){
			var aUrl = 'javascript:void(0)';//所有a标签不加跳转
			//subLi = $('<li><a id="n'+item.id+'" href="'+aUrl+'">'+item.name+'</a></li>');
			var subname = item.name;
			if(item.seq_no && item.seq_no.length > 0) subname= item.seq_no+"-"+subname;
			subLi = $('<li><a id="n'+item.id+'" title="'+subname+'" code="'+item.code+'" >'+(item.name).substr(0,subLenght)+'</a></li>');
			//子元素添加属性=================开始========================
			if(item.url && item.url.length > 0) ($(subLi).children("a")).attr("url",item.url);
			if(item.type_id && item.type_id.length > 0) ($(subLi).children("a")).attr("type_id",item.type_id);
			if(item.target && item.target.length > 0) ($(subLi).children("a")).attr("target",item.target);
			//子元素添加属性=================结束========================
			if(item.image && item.image.length > 0) $(subLi).children('a').prepend('<img src="'+ item.image +'" width="16px" height="16px" alt=""/>'); 
			if(item.submenu && item.submenu.length > 0){
				$(subLi).children('a').prepend('<img class="arrow" src="images/blank.gif" alt=""/>');
                callee(item.submenu,subLi);
			}
			$(subUl).append(subLi);
		});
		$(lihtml).append(subUl);
	},
	
	
	/**
	*点击当前菜单,动态加载子菜单的数据
	*
	*/
	
	

	/**
	 * 处理层级缩进
	 */
	_levelIndent: function(ulList){
		var self = this,
			_config = self.config,
			_cache = self.cache,
			callee = arguments.callee;

		var initTextIndent = 2,
			lev = 1,
			$oUl = $(ulList);

		while($oUl.find('ul').length > 0){
			initTextIndent = parseInt(initTextIndent,10) + 1 + 'em'; 
			$oUl.children().children('ul').addClass('lev-' + lev).children('li').css('text-indent',initTextIndent);
			$oUl = $oUl.children().children('ul');
			lev++;
		}
		$(ulList).find('ul').hide();
		//$(ulList).find('ul:first').show();//默认打开第一个节点
	},

	/**
	 * 绑定事件
	 */
	_bindEnv: function(container) {
		var self = this, _config = self.config;
		$('h2,a',container).unbind(_config.type);
		$('h2,a',container).bind(_config.type,function(e){
			if($(this).siblings('ul').length > 0) {//这里可以进行点击加载,但点击后的事件没有加载,所以没有写--gulijun20210604
				/**
				//alert("jtree.js==========146==77========="+$(this).children().length);
				var subLi = $('<li style="text-indent: 3em;"><a id="d34" title="FFF" code="two">FF</a></li>');
				$(this).siblings('ul').append(subLi);
				*/
				$(this).siblings('ul').slideToggle('slow').end().children('img').toggleClass('unfold');
			}
			$(this).parent('li').siblings().find('ul').hide().end().find('img.unfold').removeClass('unfold');
			_config.clickItemCallBack && $.isFunction(_config.clickItemCallBack) && _config.clickItemCallBack($(this));
		});

		//绑定事件双击事件(及含有url属性的可以有单击事件)
		$('h2,a',container).bind("dblclick",function(e){
			//alert($(this).attr("type_id"));
			nodeOnDbClick($(this));//此函数在页面上定义
		});
	}
 };
