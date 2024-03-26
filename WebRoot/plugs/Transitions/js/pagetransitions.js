	var $main = $( '#pt-main' ),
		$pages = $main.children('div.pt-page'),
		$iterate = $('#iterateEffects'),
		animcursor = 1,
		pagesCount = $pages.length,
		current = 0,
		isAnimating = false,
		endCurrPage = false,
		endNextPage = false,
		animEndEventNames = {
			'WebkitAnimation' : 'webkitAnimationEnd',
			'OAnimation'      : 'oAnimationEnd',
			'msAnimation'     : 'MSAnimationEnd',
			'animation'       : 'animationend'
		},
		// animation end event name
		animEndEventName = animEndEventNames[Modernizr.prefixed( 'animation' ) ],
		// support css animations
		support = Modernizr.cssanimations;
	var mytime;//这里是动画事件
	function init() {
		$pages.each( function() {
			var $page = $( this );
			$page.data( 'originalClassList', $page.attr( 'class' ) );
		} );
		$pages.eq( current ).addClass( 'pt-page-current' );
		mytime = setInterval(_turnPage,itemSecond);
	}
	
	function _turnPage(){
			if(isAnimating ){
				return false;
			}
			if(animcursor > 67) {
				window.location.reload();//强刷从服务器加载
				animcursor = 1;
			}
			nextPage(animcursor);
			++animcursor;
	}

	/**
	*子页面调用此代码,继续执行翻转
	*/
	function continueTransitions(){
		try{
			var $currPage = $pages.eq(current);
			if( current < pagesCount - 1 ) {
				++current;
			}else{
				current = 0;
			}			
			var $nextPage = $pages.eq(current).addClass('pt-page-current' ),
				outClass = '', inClass = '';
			var ostyle = getStyleClassObj(animcursor);
			outClass = ostyle.outClass;
			inClass  = ostyle.inClass;
			$currPage.addClass( outClass ).on( animEndEventName, function(){
				$currPage.off( animEndEventName );
				endCurrPage = true;
				if( endNextPage ) {
					onEndAnimation( $currPage, $nextPage );
				}
			});
	
			$nextPage.addClass( inClass ).on( animEndEventName, function() {
				$nextPage.off( animEndEventName );
				endNextPage = true;
				if( endCurrPage ) {
					onEndAnimation( $currPage, $nextPage );
				}
			});
			if( !support ) {
				onEndAnimation( $currPage, $nextPage );
			}
			if(isNull(mytime)){
				mytime = setInterval(_turnPage,itemSecond);
			}
		}catch(e){
			alert(e);
		}
	}

	/**手动向前翻转*/
	function transitionsBack(){
		try{
			mytime = clearInterval(mytime);
			var $currPage = $pages.eq(current);
			if(current==0){
				current =  pagesCount - 1;
			}else{
				--current;
			}
			var $nextPage = $pages.eq( current ).addClass( 'pt-page-current' ),
				outClass = '', inClass = '';
			var ostyle = getStyleClassObj(animcursor);
			outClass = ostyle.outClass;
			inClass  = ostyle.inClass;
			$currPage.addClass( outClass ).on( animEndEventName, function(){
				$currPage.off( animEndEventName );
				endCurrPage = true;
				if( endNextPage ) {
					onEndAnimation( $currPage, $nextPage );
				}
			} );
	
			$nextPage.addClass( inClass ).on( animEndEventName, function() {
				$nextPage.off( animEndEventName );
				endNextPage = true;
				if( endCurrPage ) {
					onEndAnimation( $currPage, $nextPage );
				}
			} );
			if( !support ) {
				onEndAnimation( $currPage, $nextPage );
			}
		}catch(e){
			alert(e);
		}
	}
	
	/**手动向后翻转*/
	function transitionsForward(){
		try{
			mytime = clearInterval(mytime);
			var $currPage = $pages.eq(current);
			if( current < pagesCount - 1 ) {
				++current;
			}else{
				current = 0;
			}
			var $nextPage = $pages.eq( current ).addClass( 'pt-page-current' ),
				outClass = '', inClass = '';
			var ostyle = getStyleClassObj(animcursor);
			outClass = ostyle.outClass;
			inClass  = ostyle.inClass;
			$currPage.addClass( outClass ).on( animEndEventName, function(){
				$currPage.off( animEndEventName );
				endCurrPage = true;
				if( endNextPage ) {
					onEndAnimation( $currPage, $nextPage );
				}
			} );
	
			$nextPage.addClass( inClass ).on( animEndEventName, function() {
				$nextPage.off( animEndEventName );
				endNextPage = true;
				if( endCurrPage ) {
					onEndAnimation( $currPage, $nextPage );
				}
			} );
			if( !support ) {
				onEndAnimation( $currPage, $nextPage );
			}
		}catch(e){
			alert(e);
		}
	}	

	function nextPage( animation ) {
		try{
			if( isAnimating )　return false;
			isAnimating = true;
			var $currPage = $pages.eq(current);
			if( current < pagesCount - 1 ) {
				++current;
			}else{
				current = 0;
			}
			
			var $nextPage = $pages.eq( current ).addClass( 'pt-page-current' ),	outClass = '', inClass = '';
			var ostyle = getStyleClassObj(animation);
			outClass = ostyle.outClass;
			inClass  = ostyle.inClass;
			$currPage.addClass( outClass ).on( animEndEventName, function(){
				$currPage.off( animEndEventName );
				endCurrPage = true;
				if( endNextPage ) {
					onEndAnimation( $currPage, $nextPage );
				}
			} );
	
			$nextPage.addClass( inClass ).on( animEndEventName, function() {
				$nextPage.off( animEndEventName );
				endNextPage = true;
				if( endCurrPage ) {
					onEndAnimation( $currPage, $nextPage );
				}
			} );
			if( !support ) {
				onEndAnimation( $currPage, $nextPage );
			}
		}catch(e){
			alert(e);
		}
	}
	
	/**暂停播放*/
	function pausePlay(){
		if(mytime){
			mytime = clearInterval(mytime);
		}
	}
	
	/**暂停播放*/
	function pausePlaySwitch(){
		if(mytime){
			mytime = clearInterval(mytime);
		}else{
			continueTransitions();
		}
	}	
	
	/**动画样式*/
	function getStyleClassObj(animation){
		var outClass = '', inClass = '';
		var o = new Object();
		switch( animation ) {
			case 1:
				outClass= 'pt-page-moveToLeft';
				inClass = 'pt-page-moveFromRight';
				break;
			case 2:
				outClass= 'pt-page-moveToRight';
				inClass = 'pt-page-moveFromLeft';
				break;
			case 3:
				outClass= 'pt-page-moveToTop';
				inClass = 'pt-page-moveFromBottom';
				break;
			case 4:
				outClass='pt-page-moveToBottom';
				inClass = 'pt-page-moveFromTop';
				break;
			case 5:
				outClass= 'pt-page-fade';
				inClass = 'pt-page-moveFromRight pt-page-ontop';
				break;
			case 6:
				outClass= 'pt-page-fade';
				inClass = 'pt-page-moveFromLeft pt-page-ontop';
				break;
			case 7:
				outClass= 'pt-page-fade';
				inClass = 'pt-page-moveFromBottom pt-page-ontop';
				break;
			case 8:
				outClass= 'pt-page-fade';
				inClass = 'pt-page-moveFromTop pt-page-ontop';
				break;
			case 9:
				outClass= 'pt-page-moveToLeftFade';
				inClass = 'pt-page-moveFromRightFade';
				break;
			case 10:
				outClass= 'pt-page-moveToRightFade';
				inClass = 'pt-page-moveFromLeftFade';
				break;
			case 11:
				outClass= 'pt-page-moveToTopFade';
				inClass = 'pt-page-moveFromBottomFade';
				break;
			case 12:
				outClass= 'pt-page-moveToBottomFade';
				inClass = 'pt-page-moveFromTopFade';
				break;
			case 13:
				outClass= 'pt-page-moveToLeftEasing pt-page-ontop';
				inClass = 'pt-page-moveFromRight';
				break;
			case 14:
				outClass= 'pt-page-moveToRightEasing pt-page-ontop';
				inClass = 'pt-page-moveFromLeft';
				break;
			case 15:
				outClass= 'pt-page-moveToTopEasing pt-page-ontop';
				inClass = 'pt-page-moveFromBottom';
				break;
			case 16:
				outClass= 'pt-page-moveToBottomEasing pt-page-ontop';
				inClass = 'pt-page-moveFromTop';
				break;
			case 17:
				outClass= 'pt-page-scaleDown';
				inClass = 'pt-page-moveFromRight pt-page-ontop';
				break;
			case 18:
				outClass= 'pt-page-scaleDown';
				inClass = 'pt-page-moveFromLeft pt-page-ontop';
				break;
			case 19:
				outClass= 'pt-page-scaleDown';
				inClass = 'pt-page-moveFromBottom pt-page-ontop';
				break;
			case 20:
				outClass= 'pt-page-scaleDown';
				inClass = 'pt-page-moveFromTop pt-page-ontop';
				break;
			case 21:
				outClass= 'pt-page-scaleDown';
				inClass = 'pt-page-scaleUpDown pt-page-delay300';
				break;
			case 22:
				outClass= 'pt-page-scaleDownUp';
				inClass = 'pt-page-scaleUp pt-page-delay300';
				break;
			case 23:
				outClass= 'pt-page-moveToLeft pt-page-ontop';
				inClass = 'pt-page-scaleUp';
				break;
			case 24:
				outClass= 'pt-page-moveToRight pt-page-ontop';
				inClass = 'pt-page-scaleUp';
				break;
			case 25:
				outClass= 'pt-page-moveToTop pt-page-ontop';
				inClass = 'pt-page-scaleUp';
				break;
			case 26:
				outClass= 'pt-page-moveToBottom pt-page-ontop';
				inClass = 'pt-page-scaleUp';
				break;
			case 27:
				outClass= 'pt-page-scaleDownCenter';
				inClass = 'pt-page-scaleUpCenter pt-page-delay400';
				break;
			case 28:
				outClass= 'pt-page-rotateRightSideFirst';
				inClass = 'pt-page-moveFromRight pt-page-delay200 pt-page-ontop';
				break;
			case 29:
				outClass= 'pt-page-rotateLeftSideFirst';
				inClass = 'pt-page-moveFromLeft pt-page-delay200 pt-page-ontop';
				break;
			case 30:
				outClass= 'pt-page-rotateTopSideFirst';
				inClass = 'pt-page-moveFromTop pt-page-delay200 pt-page-ontop';
				break;
			case 31:
				outClass= 'pt-page-rotateBottomSideFirst';
				inClass = 'pt-page-moveFromBottom pt-page-delay200 pt-page-ontop';
				break;
			case 32:
				outClass= 'pt-page-flipOutRight';
				inClass = 'pt-page-flipInLeft pt-page-delay500';
				break;
			case 33:
				outClass= 'pt-page-flipOutLeft';
				inClass = 'pt-page-flipInRight pt-page-delay500';
				break;
			case 34:
				outClass= 'pt-page-flipOutTop';
				inClass = 'pt-page-flipInBottom pt-page-delay500';
				break;
			case 35:
				outClass= 'pt-page-flipOutBottom';
				inClass = 'pt-page-flipInTop pt-page-delay500';
				break;
			case 36:
				outClass= 'pt-page-rotateFall pt-page-ontop';
				inClass = 'pt-page-scaleUp';
				break;
			case 37:
				outClass= 'pt-page-rotateOutNewspaper';
				inClass = 'pt-page-rotateInNewspaper pt-page-delay500';
				break;
			case 38:
				outClass= 'pt-page-rotatePushLeft';
				inClass = 'pt-page-moveFromRight';
				break;
			case 39:
				outClass= 'pt-page-rotatePushRight';
				inClass = 'pt-page-moveFromLeft';
				break;
			case 40:
				outClass= 'pt-page-rotatePushTop';
				inClass = 'pt-page-moveFromBottom';
				break;
			case 41:
				outClass= 'pt-page-rotatePushBottom';
				inClass = 'pt-page-moveFromTop';
				break;
			case 42:
				outClass= 'pt-page-rotatePushLeft';
				inClass = 'pt-page-rotatePullRight pt-page-delay180';
				break;
			case 43:
				outClass= 'pt-page-rotatePushRight';
				inClass = 'pt-page-rotatePullLeft pt-page-delay180';
				break;
			case 44:
				outClass= 'pt-page-rotatePushTop';
				inClass = 'pt-page-rotatePullBottom pt-page-delay180';
				break;
			case 45:
				outClass= 'pt-page-rotatePushBottom';
				inClass = 'pt-page-rotatePullTop pt-page-delay180';
				break;
			case 46:
				outClass= 'pt-page-rotateFoldLeft';
				inClass = 'pt-page-moveFromRightFade';
				break;
			case 47:
				outClass= 'pt-page-rotateFoldRight';
				inClass = 'pt-page-moveFromLeftFade';
				break;
			case 48:
				outClass= 'pt-page-rotateFoldTop';
				inClass = 'pt-page-moveFromBottomFade';
				break;
			case 49:
				outClass= 'pt-page-rotateFoldBottom';
				inClass = 'pt-page-moveFromTopFade';
				break;
			case 50:
				outClass= 'pt-page-moveToRightFade';
				inClass = 'pt-page-rotateUnfoldLeft';
				break;
			case 51:
				outClass= 'pt-page-moveToLeftFade';
				inClass = 'pt-page-rotateUnfoldRight';
				break;
			case 52:
				outClass= 'pt-page-moveToBottomFade';
				inClass = 'pt-page-rotateUnfoldTop';
				break;
			case 53:
				outClass= 'pt-page-moveToTopFade';
				inClass = 'pt-page-rotateUnfoldBottom';
				break;
			case 54:
				outClass= 'pt-page-rotateRoomLeftOut pt-page-ontop';
				inClass = 'pt-page-rotateRoomLeftIn';
				break;
			case 55:
				outClass= 'pt-page-rotateRoomRightOut pt-page-ontop';
				inClass = 'pt-page-rotateRoomRightIn';
				break;
			case 56:
				outClass= 'pt-page-rotateRoomTopOut pt-page-ontop';
				inClass = 'pt-page-rotateRoomTopIn';
				break;
			case 57:
				outClass= 'pt-page-rotateRoomBottomOut pt-page-ontop';
				inClass = 'pt-page-rotateRoomBottomIn';
				break;
			case 58:
				outClass= 'pt-page-rotateCubeLeftOut pt-page-ontop';
				inClass = 'pt-page-rotateCubeLeftIn';
				break;
			case 59:
				outClass= 'pt-page-rotateCubeRightOut pt-page-ontop';
				inClass = 'pt-page-rotateCubeRightIn';
				break;
			case 60:
				outClass= 'pt-page-rotateCubeTopOut pt-page-ontop';
				inClass = 'pt-page-rotateCubeTopIn';
				break;
			case 61:
				outClass= 'pt-page-rotateCubeBottomOut pt-page-ontop';
				inClass = 'pt-page-rotateCubeBottomIn';
				break;
			case 62:
				outClass = 'pt-page-rotateCarouselLeftOut pt-page-ontop';
				inClass = 'pt-page-rotateCarouselLeftIn';
				break;
			case 63:
				outClass= 'pt-page-rotateCarouselRightOut pt-page-ontop';
				inClass = 'pt-page-rotateCarouselRightIn';
				break;
			case 64:
				outClass= 'pt-page-rotateCarouselTopOut pt-page-ontop';
				inClass = 'pt-page-rotateCarouselTopIn';
				break;
			case 65:
				outClass= 'pt-page-rotateCarouselBottomOut pt-page-ontop';
				inClass = 'pt-page-rotateCarouselBottomIn';
				break;
			case 66:
				outClass= 'pt-page-rotateSidesOut';
				inClass = 'pt-page-rotateSidesIn pt-page-delay200';
				break;
			case 67:
				outClass= 'pt-page-rotateSlideOut';
				inClass = 'pt-page-rotateSlideIn';
				break;
		}
		o.outClass = outClass;
		o.inClass = inClass;
		return o;
	}

	function onEndAnimation( $outpage, $inpage ) {
		endCurrPage = false;
		endNextPage = false;
		resetPage($outpage,$inpage);
		isAnimating = false;
	}

	function resetPage( $outpage, $inpage ) {
		setIframeUrl();
		$outpage.attr( 'class', $outpage.data( 'originalClassList' ) );
		$inpage.attr( 'class', $inpage.data( 'originalClassList' ) + ' pt-page-current' );
		if(pauseLi.indexOf(subDiv[current].type)>-1){//如果遇到视频文件,则要暂停翻动页面,这一条件是为需求而加
			mytime = clearInterval(mytime);
			$("#"+subDiv[current].id)[0].contentWindow.startPlay();//调用子页面播放开始函数
			return;
		}		
	}
	
	
	/**
	*动态为IFrame附值,这样避免子页面太多时播放太卡
	*只附值当前页面的前一页和后一面
	*
	*/
	function setIframeUrl(){
		var len = subDivLen-1;
		var curframe = 0;//当前iframe的ID号
		var front = 0;next = 0;
		if(current==len){
			next = 0;
			front = current-1;
		}else if(current==0){
			front = len;
			next = 1;
		}else{
			front = current-1;
			next =  current+1;		
		}
		for(var i in subDiv){
			if(i==front || i==next){
				$("#"+subDiv[i].id).attr("src",subDiv[i].url);//加上随机数,为了清除缓存
			}else if(i != current){
				$("#"+subDiv[i].id).attr("src","");
			}
		}
	}
	init();