//get selected size
function sc_getSelectedCount(obj) {
    var re = 0;
    if (obj.tagName == "SELECT") {
        for (var i = 0; i < obj.options.length; i++) {
            if (obj.options[i].selected) re++;
        }
    }

    return re;
}

function sc_getSelectedCountById(objId) {
    return sc_getSelectedCount(document.getElementById(objId));
}

//get selected value string
function sc_getSelectedStr(obj, splitBy) {
    var re = "";
    var index = 0;
    if (obj.tagName == "SELECT") {
        for (var i = 0; i < obj.options.length; i++) {
            if (obj.options[i].selected) {
                if (index++ > 0) re += splitBy == null || splitBy == "" ? "," : splitBy;
                re += obj.options[i].value;
            }
        }
    }
    return re;
}

function sc_getSelectedStrById(objId, splitBy) {
    return sc_getSelectedStr(document.getElementById(objId), splitBy);
}

//get selected value string
function sc_getSelectedLabelStr(obj, splitBy) {
    var re = "";
    var index = 0;
    if (obj.tagName == "SELECT") {
        for (var i = 0; i < obj.options.length; i++) {
            if (obj.options[i].selected) {
                if (index++ > 0) re += splitBy == null || splitBy == "" ? "," : splitBy;
                re += obj.options[i].innerHTML;
            }
        }
    }
    return re;
}

function sc_getSelectedLabelStrById(objId, splitBy) {
    return sc_getSelectedLabelStr(document.getElementById(objId), splitBy);
}

//get full value string
function sc_getFullStr(obj, splitBy) {
    var re = "";
    var index = 0;
    if (obj.tagName == "SELECT") {
        for (var i = 0; i < obj.options.length; i++) {
            if (index++ > 0) re += splitBy == null || splitBy == "" ? "," : splitBy;
            re += obj.options[i].value;
        }
    }
    return re;
}

function sc_getFullStrById(objId, splitBy) {
    return sc_getFullStr(document.getElementById(objId), splitBy);
}

//get full value string
function sc_getFullLabelStr(obj, splitBy) {
    var re = "";
    var index = 0;
    if (obj.tagName == "SELECT") {
        for (var i = 0; i < obj.options.length; i++) {
            if (index++ > 0) re += splitBy == null || splitBy == "" ? "," : splitBy;
            re += obj.options[i].innerHTML;
        }
    }
    return re;
}

function sc_getFullLabelStrById(objId, splitBy) {
    return sc_getFullLabelStr(document.getElementById(objId), splitBy);
}

//find forward
function sc_findOptionIndexForward(obj,value,pStartIndex){
    var startIndex=0;
    if(pStartIndex!=null) startIndex=pStartIndex;
    var matchIndex=-1;
    for(var i=startIndex;i<obj.options.length;i++){
        if(obj.options[i].value==value){
            matchIndex=i;
            break;
        }
    }
    if(matchIndex==-1){
        for(var i=0;i<startIndex;i++){
            if(obj.options[i].value==value){
                matchIndex=i;
                break;
            }
        }
    }
    return matchIndex;
}

function sc_findOptionIndexForwardById(objId,value,pStartIndex){
    return sc_findOptionIndexForward(document.getElementById(objId),value,pStartIndex);
}

function sc_findOptionForward(obj,value,pStartIndex){
    var theIndex=sc_findOptionIndexForward(obj,value,pStartIndex);
    if(theIndex==-1)
        return null;
    else
        return obj.options[theIndex];
}

function sc_findOptionForwardById(objId,value,pStartIndex){
    return sc_findOptionForward(document.getElementById(objId),value,pStartIndex);
}



//deselect
function sc_deSelect(obj) {
    if (obj.tagName == "SELECT") {
        for (var i = 0; i < obj.options.length; i++) {
            obj.options[i].selected = false;
        }
    }
}

function sc_deSelectById(objId) {
    sc_deSelect(document.getElementById(objId));
}

//select all
function sc_selectAll(obj) {
    if (obj.tagName == "SELECT") {
        for (var i = 0; i < obj.options.length; i++) {
            obj.options[i].selected = true;
        }
    }
}

function sc_selectAllById(objId) {
    sc_selectAll(document.getElementById(objId));
}

//select with filter
function sc_selectFilter(obj, filters) {
    if (obj.tagName == "SELECT") {
        sc_deSelect(obj);
        for (var i = 0; i < obj.options.length; i++) {
            for (var j = 0; j < filters.length; j++) {
                if (filters[j] == obj.options[i].value) {
                    obj.options[i].selected = true;
                    break;
                }
            }
        }
    }
}

function sc_selectFilterById(objId, filters) {
    sc_selectFilter(document.getElementById(objId), filters);
}

//copySelectedOptionsTo
function sc_copySelectedOptionsTo(obj1, obj2) {
    for (var i = 0; i < obj1.options.length; i++) {
        if (obj1.options[i].selected) {
            var exist = false;
            for (var j = 0; j < obj2.options.length; j++) {
                if (obj1.options[i].value == obj2.options[j].value) {
                    exist = true;
                    break;
                }
            }
            if (!exist) {
                var opt = document.createElement("OPTION");
                opt.innerHTML = obj1.options[i].innerHTML;
                opt.value = obj1.options[i].value;
                obj2.appendChild(opt);
            }
        }

    }
}

function sc_copySelectedOptionsToById(obj1Id, obj2Id) {
    sc_copySelectedOptionsTo(document.getElementById(obj1Id), document.getElementById(obj2Id));
}

//deselect
function sc_clearOptions(obj) {
    if (obj.tagName == "SELECT") {
        obj.innerHTML = "&nbsp;";
    }
}

function sc_clearOptionsById(objId) {
    //sc_clearOptions($(objId));
    sc_clearOptions(document.getElementById(objId))
}

//addOption
function sc_addOption(obj, value, name) {
    var opt;
    opt = document.createElement("OPTION");
    opt.innerHTML = name;
    opt.value = value;
    opt.title = name;
    obj.appendChild(opt);
    return opt;
}

function sc_addOptionById(objId, value, name) {
    sc_addOption(document.getElementById(objId),value,name);
}

/*批量增加下拉框选项 wla 20210326
 * objId 下拉框id
 * ObjOptin 下拉框内容 以value为键 text为值的json对象集合
 */
function sc_addBatchOptionById(objId,ObjOptin){
     for(var k in ObjOptin){
         sc_addOptionById(objId,k,ObjOptin[k]);
     }
}


//remove the options selected
function sc_removeSelectedOption(obj){
    for (var i = obj.options.length-1; i >=0; i--) {
        if (obj.options[i].selected) {
            obj.remove(i);
        }
    }
}

function sc_removeSelectedOptionById(objId){
    sc_removeSelectedOption(document.getElementById(objId));
}

//get selected option label
function sc_getLabel(obj){
    var selectedIndex=obj.selectedIndex;
    if(selectedIndex==-1)
        return ""
    else
        return obj.options[selectedIndex].innerHTML;
}

function sc_getLabelById(objId) {
    sc_getLabel(document.getElementById(objId));
}

//get selected option value
function sc_getValue(obj){
    var selectedIndex=obj.selectedIndex;
    if(selectedIndex==-1)
        return ""
    else
        return obj.options[selectedIndex].value;
}

function sc_getValueById(objId) {
    sc_getValue(document.getElementById(objId));
}

//options move down
function sc_moveDown(obj){
    if (obj.tagName != "SELECT") return;
    if(sc_getSelectedCount(obj)<=0) return;
    for(var i=obj.options.length-1;i>=0;i--){
        if(obj.options[i].selected){
            if(i==obj.options.length-1) break;
            var tmpLabel=obj.options[i+1].innerHTML;
            var tmpValue=obj.options[i+1].value;
            var isSelected=obj.options[i+1].selected;
            obj.options[i+1].innerHTML=obj.options[i].innerHTML;
            obj.options[i+1].value=obj.options[i].value;
            obj.options[i+1].selected=obj.options[i].selected;
            obj.options[i].innerHTML=tmpLabel;
            obj.options[i].value=tmpValue;
            obj.options[i].selected=isSelected;
        }
    }
}

function sc_moveDownById(objId){
    sc_moveDown(document.getElementById(objId));
}

//options move up
function sc_moveUp(obj){
    if (obj.tagName != "SELECT") return;
    if(sc_getSelectedCount(obj)<=0) return;
    for(var i=0;i<obj.options.length;i++){
        if(obj.options[i].selected){
            if(i==0) break;
            var tmpLabel=obj.options[i-1].innerHTML;
            var tmpValue=obj.options[i-1].value;
            var isSelected=obj.options[i-1].selected;
            obj.options[i-1].innerHTML=obj.options[i].innerHTML;
            obj.options[i-1].value=obj.options[i].value;
            obj.options[i-1].selected=obj.options[i].selected;
            obj.options[i].innerHTML=tmpLabel;
            obj.options[i].value=tmpValue;
            obj.options[i].selected=isSelected;
        }
    }
}

function sc_moveUpById(objId){
    sc_moveUp(document.getElementById(objId));
}

//if selected options size >1 ,only select the first
function sc_selectFirstSelected(obj){
    if(sc_getSelectedCount(obj)<=1) return;

    var isFirst=true;
    for(var i=0;i<obj.options.length;i++){
        if(obj.options[i].selected){
            if(isFirst){
                isFirst=false;
            }else{
                obj.options[i].selected=false;
            }
        }
    }
}

function sc_selectFirstSelectedById(objId){
    sc_selectFirstSelected(document.getElementById(objId));
}

//reverse options display
function sc_reverse(obj){
    var values=new Array();
    var labels=new Array();
    var selected=new Array();
    for(var i=0;i<obj.options.length;i++){
        labels[i]=obj.options[i].innerHTML;
        values[i]=obj.options[i].value;
        selected[i]=obj.options[i].selected;
    }
    for(var i=0;i<obj.options.length;i++){
        obj.options[i].innerHTML=labels[obj.options.length-1-i];
        obj.options[i].value=values[obj.options.length-1-i];
        obj.options[i].selected=selected[obj.options.length-1-i];
    }

}

function sc_reverseById(objId){
    sc_reverse(document.getElementById(objId));
}

//with groupOpt begin
function sc_move(obj1, obj2) {   
    var obj1=document.getElementById(obj1);
    var obj2=document.getElementById(obj2);
    for (var i = 0; i < obj1.length; i++) {
        if (obj1.options[i].selected) {
            var opt_parent = obj1.options[i].parentNode;
            if(opt_parent.label+""=='undefined'){
                var oOption = document.createElement("OPTION");
                oOption.text = obj1.options[i].text;
                oOption.value = obj1.options[i].value;
                obj2.add(oOption);
            }else{
                var el = sc_getGroup(obj2, opt_parent.label);
                if(el == null) {
                    el = document.createElement("OPTGROUP");
                    el.label = opt_parent.label;
                }
                var oOption = sc_getGroupOption(el, obj1.options[i].value);
                if(oOption == null) {
                    oOption = document.createElement("OPTION");
                    oOption.text = obj1.options[i].text;
                    oOption.value = obj1.options[i].value;
                    oOption.innerHTML = obj1.options[i].text;
                    el.appendChild(oOption);
                    obj2.appendChild(el);
                }
            }
        }
    }
    
    var removedParent=new Array();
    for (var i = obj1.length - 1; i >= 0; i--) {
        if (obj1.options[i].selected) {
            var opt_parent = obj1.options[i].parentNode;
            //alert("338=="+opt_parent.label)
            if(opt_parent.label+""!='undefined'&&removedParent[opt_parent.label+""]+""=="undefined"){
                removedParent.push(opt_parent)
            }
            obj1.remove(i);
        }
    }

    for(var i=0;i<removedParent.length;i++){
        var exist=false;
        for(var j=0;j<obj1.length;j++){
            var opt_parent = obj1.options[j].parentNode;
            if(opt_parent.label==removedParent[i].label){
                exist=true;
                break;
            }
        }
        if(!exist){
          try{
            // removedParent[i].removeNode(true);
            removeElement(removedParent[i]);
           }catch(e){
             alert(e)
           }
         }
    }
    
    obj1.focus();  
}

//obj1移动对象不删除 被移动对象value 重复不增加
function sc_move2(obj1, obj2) {   
    var obj1=document.getElementById(obj1);
    var obj2=document.getElementById(obj2);
    for (var i = 0; i < obj1.length; i++) {
        if (obj1.options[i].selected) {
            var val=obj1.options[i].value;
       //     var opt_parent = obj1.options[i].parentNode;
            if(validateValExist(obj2,val)){
                var oOption = document.createElement("OPTION");
                oOption.text = obj1.options[i].text;
                oOption.value = obj1.options[i].value;
                obj2.add(oOption);
            }
        }
    }
    obj1.focus();  
}

/**
  * 验证下拉框是否有对应的值的value存在
  */
function validateValExist(Obj,Value){
  for (var i = 0; i < Obj.options.length; i++) {
      var val=  Obj.options[i].value;
      if(val==Value){
        return false;
      }
  }
  return true;
}



//obj2 被移动对象不增加
function sc_move3(obj1, obj2) {   
    var obj1=document.getElementById(obj1);
    var obj2=document.getElementById(obj2);
    
    var removedParent=new Array();
    for (var i = obj1.length - 1; i >= 0; i--) {
        if (obj1.options[i].selected) {
            var opt_parent = obj1.options[i].parentNode;
            //alert("338=="+opt_parent.label)
            if(opt_parent.label+""!='undefined'&&removedParent[opt_parent.label+""]+""=="undefined"){
                removedParent.push(opt_parent)
            }
            obj1.remove(i);
        }
    }

    for(var i=0;i<removedParent.length;i++){
        var exist=false;
        for(var j=0;j<obj1.length;j++){
            var opt_parent = obj1.options[j].parentNode;
            if(opt_parent.label==removedParent[i].label){
                exist=true;
                break;
            }
        }
        if(!exist){
          try{
            // removedParent[i].removeNode(true);
            removeElement(removedParent[i]);
           }catch(e){
             alert(e)
           }
         }
    }  
    obj1.focus();    
}



function removeElement(_element){
         var _parentElement = _element.parentNode;
         if(_parentElement){
                _parentElement.removeChild(_element);
         }
}


function removeOptionByLabel(obj,slabel){
    for (var i = 0; i < obj.length; i++) {
       var opt_label = obj.options[i].label+""; 
       if(opt_label==slabel){
          obj.remove(i);
       }
    }
}

function removeOptionByVal(obj,val){
    for (var i = 0; i < obj.length; i++) {
       if(obj.options[i].value==val){
          obj.remove(i);
       }
    }
}

function sc_moveAll(obj1, obj2) {
try{
    var obj1=document.getElementById(obj1);
    var obj2=document.getElementById(obj2);
    for (var i = 0; i < obj1.length; i++) {
        var opt_parent = obj1.options[i].parentNode;

        if(opt_parent.label+""=='undefined'){
            var oOption = document.createElement("OPTION");
            oOption.text = obj1.options[i].text;
            oOption.value = obj1.options[i].value;
            obj2.add(oOption);
        } else {
            var el = sc_getGroup(obj2, opt_parent.label);
            if (el == null) {
                el = document.createElement("OPTGROUP");
                el.label = opt_parent.label;
            }
            var oOption = sc_getGroupOption(el, obj1.options[i].value);
            if (oOption == null) {
                oOption = document.createElement("OPTION");
                oOption.text = obj1.options[i].text;
                oOption.value = obj1.options[i].value;
                oOption.innerHTML = obj1.options[i].text;
                el.appendChild(oOption);
                obj2.appendChild(el);
            }
        }

    }
    obj1.innerHTML="&nbsp;" //左边不删除
    obj2.focus();
    }catch(e){alert("share/selectCommon.js 441="+e)}
}

/**
  * obj1不删除 并且重复选项不加入obj2
  */
function sc_moveAll2(obj1, obj2) {
try{
    var obj1=document.getElementById(obj1);
    var obj2=document.getElementById(obj2);
    for (var i = 0; i < obj1.length; i++) {
         var val=obj1.options[i].value;
            if(validateValExist(obj2,val)){       
            var oOption = document.createElement("OPTION");
            oOption.text = obj1.options[i].text;
            oOption.value = obj1.options[i].value;
            obj2.add(oOption);
        } 

    }
    
    obj2.focus();
    }catch(e){alert("share/selectCommon.js 441="+e)}
}

//全部移动 被移动对象不增加 删除移动对象
function sc_moveAll3(obj1, obj2) {
try{
    var obj1=document.getElementById(obj1);
    var obj2=document.getElementById(obj2);
    
    obj1.innerHTML="&nbsp;" //左边不删除
    obj2.focus();
    }catch(e){alert("share/selectCommon.js 441="+e)}
}


//get group by Select object and groupLabel
function sc_getGroup(s, groupLabel) {
    var gs = s.getElementsByTagName("OPTGROUP");
    for(var c=0; c<gs.length; c++) {
        if(groupLabel == gs[c].label) {
            return gs[c];
        }
    }
    return null;
}

//get option by group and optionValue
function sc_getGroupOption(group, optionValue) {
    var opts = group.getElementsByTagName("OPTION");
    for(var c=0; c<opts.length; c++) {
        if(optionValue == opts[c].value) {
            return opts[c];
        }
    }
    return null;
}

function sc_addGroup(s,groupLabel){
    var sg=sc_getGroup(s,groupLabel);
    if(sg==null){
        sg = document.createElement("OPTGROUP");
        sg.label = groupLabel;
        s.appendChild(sg);
    }
    return sg;
}

function sc_addGroupOption(s,groupLabel,value, name){
    var sg=sc_getGroup(s,groupLabel);
    if(sg==null){
        sg = document.createElement("OPTGROUP");
        sg.label = groupLabel;
        s.appendChild(sg);
    }

    var oOption = sc_getGroupOption(sg, value);
    if (oOption == null) {
        oOption = document.createElement("OPTION");
        oOption.text = name;
        oOption.value = value;
        oOption.innerHTML = name
        sg.appendChild(oOption);
    }
    return sg;
}
//with groupOpt end

//get scallval user for subjectublicsh.Jsp,TextInfroPublish.jsp ....allPublish.jsp
function getscAllOptVal(ObjId){
  var res=""; 
  var obj = document.getElementById(ObjId);
  var options = obj.options;
  for(var i=0,len=options.length;i<len;i++){
     var opt = options[i];
     if(opt&&res)  res += ";"
     res += opt.value;
  }
  return res;
}