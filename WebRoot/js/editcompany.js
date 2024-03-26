    function loadData() {
        loadPageData();
        var code = $('#industry_cd').val();
        if(isNull(code)) return;
        var ob = hydetail[code];
            ob.cd=code;
        var nob = _getSpCodeObj(ob);
        var selo = $('#c1');
            selo.html("");//清空原对象
        var o = $('<option>').val(code).text(nob.nm);//这里是反射下拉框的值
            selo.append(o);
    }

    function reExtraCode(){
        var vl = $('#c1').val();
        $('#industry_cd').val(vl);
    }

    function extraCode(){
        var url = basePath+"/service.do?check=1";
        var obj = new Object();
        obj.type ="getHyCode";
        obj.companynm =$('#reg_company_nm').val();
        obj.business =$('#mainbusiness1').val();
        var param = "data="+encode(JSON.stringify(obj));
        var str = startReq(url,param);
        var ra = JSON.parse(str);
        var selo = $('#c1');
        selo.html("");

        var objli = [];
        for(var i in ra){objli.push(_getSpCodeObj(ra[i]));}
        //objli.sort(function(a, b) {return b.sc - a.sc;});//这里是对象数据按属性sc倒排序
        for(var i in objli) {
            if(i==0) $('#industry_cd').val(objli[i].cd);
            var o = $('<option>').val(objli[i].cd).text(objli[i].nm);
            selo.append(o);
        }
    }

    /**
     * 返回带有高新的字样
     * @param ob
     * @returns {string}
     * @private
     */
    function _getSpCodeObj(ob) {
        var cnm = "";
        var numb = 0;
        if(ob.isszjj=="1") {numb++;cnm += "数字经济;";}
        if(ob.isgx=="1") {numb++;cnm += "高新;";}
        if(ob.iswh=="1") {numb++; cnm +="文化;";}
        if(ob.isgjs=="1") {numb++; cnm +="高技术;";}
        if(!isNull(cnm)) {cnm = getStrFront(cnm, ";", "last");cnm = "【"+cnm+"】";}
        var sobj = new Object();
        sobj.cd=ob.cd;
        sobj.nm=ob.cd+"："+cnm+ob.name;
        sobj.sc=numb;
        return sobj;
    }

    //根据选择的验收状态赋予验收时间
    function setacpttime(){
                 var selectedValue = $('#data_status').val();
                 var acpttime = "";
				 if(selectedValue=="3"){
                     acpttime = getNowTime('yyyyMMdd');
				 }
                 $('#acdt').val(acpttime);
    } 