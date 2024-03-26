/**-----------------------------------------------------------|
| dTree 2.05 | www.destroydrop.com/javascript/tree/           |
|-------------------------------------------------------------|
| Copyright (c) 2002-2003 Geir Landr?                         |
| This script can be used freely as long as all               |
| copyright messages are intact.                              |
| Updated: 谷利军 gulijun2001@163.com QQ:23796788  2010-01-01  |
| last Updated Time 2011-03-23                                |
|-------------------------------------------------------------*/
// Node object
var bgColor ="#ece9d8";//鼠标点击此行时的背景色
var imp = getWebApp()+'plugs/DTree/images/';//这里是存放图片的路径
var curNodeId = "";//点击节点时当前节点的ID

function Node(id, pid, name, url, title,isSelect,ifShowCheck,target, icon, iconOpen, open) {
    this.id = id;
    this.pid = pid;
    this.name = name;
    this.url = url;
    this.title = title;
    this.isSelect = isSelect;
    this.ifShowCheck = ifShowCheck;
    this.target = target;
    this.icon = icon;
    this.iconOpen = iconOpen;
    this._io = open || false;
    this._is = false;
    this._ls = false;
    this._hc = false;
    this._ai = 0;
    this._p; 
}

// Tree object

function dTree(objName,status,showMenu){

    this.config = {
        target         : null,
        folderLinks    : true,
        useSelection   : true,
        useCookies     : true,
        useLines       : true,
        useIcons       : true,
        useStatusText  : false,
        closeSameLevel : false,
        inOrder        : false,
        //under is new add checkbox
        useCheckBox     : status,
        //右键菜单
        useMenu         : showMenu
     }

     this.icon = {
            root        : imp+'base.gif',
            folder      : imp+'folder.gif',
            folderOpen  : imp+'folderopen.gif',
            node        : imp+'page.gif',
            empty       : imp+'empty.gif',
            line        : imp+'line.gif',
            join        : imp+'join.gif',
            joinBottom  : imp+'joinbottom.gif',
            plus        : imp+'plus.gif',
            plusBottom  : imp+'plusbottom.gif',
            minus       : imp+'minus.gif',
            minusBottom : imp+'minusbottom.gif',
            nlPlus      : imp+'nolines_plus.gif',
            nlMinus     : imp+'nolines_minus.gif'
    };
     this.obj = objName;
     this.aNodes = [];
     this.aIndent = [];
     this.root = new Node(-1);
     this.selectedNode = null;
     this.selectedFound = false;
     this.completed = false;
     this.itemColor="#000000";
     this.itemBackground="#ffffff";
     this.itemOverColor="#0000ff";
     this.selectedItemBackground="#ccaacc";
}

// Adds a new node to the node array

dTree.prototype.add = function(id, pid, name, url, title, isSelect,ifShowCheck,target, icon, iconOpen, open) {
    this.aNodes[this.aNodes.length] = new Node(id, pid, name, url, title,isSelect,ifShowCheck,target, icon, iconOpen, open);
}

 
// Open/close all nodes

dTree.prototype.openAll = function() {
    this.oAll(true);
}

dTree.prototype.closeAll = function() {
    this.oAll(false);
}
// Outputs the tree to the page

dTree.prototype.toString = function() {
    var str = '<div class="dtree">\n';
    if (document.getElementById) {
        if (this.config.useCookies) this.selectedNode = this.getSelected();
        str += this.addNode(this.root);
    } else str += 'Browser not supported dtree';
    str += '</div>';
    if (!this.selectedFound) this.selectedNode = null;
    this.completed = true;
    return str;
}

// Creates the tree structure

dTree.prototype.addNode = function(pNode) {
    var str = '';
    var n=0;
    if (this.config.inOrder) n = pNode._ai;
    for (n; n<this.aNodes.length; n++) {
        if (this.aNodes[n].pid == pNode.id) {
            var cn = this.aNodes[n];
            cn._p = pNode;
            cn._ai = n;
            this.setCS(cn);
            if (!cn.target && this.config.target) cn.target = this.config.target;
            if (cn._hc && !cn._io && this.config.useCookies) cn._io = this.isOpen(cn.id);
            if (!this.config.folderLinks && cn._hc) cn.url = null;
            if (this.config.useSelection && cn.id == this.selectedNode && !this.selectedFound) {
                cn._is = true;
                this.selectedNode = n;
                this.selectedFound = true;
            }
            str += this.node(cn, n);
            if (cn._ls) break;
        }
    }
    return str;
}

// Creates the node icon, url and text
dTree.prototype.node = function(node, nodeId){
    var TagAName = this.obj+"TagA";//节点树的所有行中的A标签,为了取到树中的所有节点用到
    var str = '<div id="md'+nodeId+'" class="dTreeNode">' + this.indent(node, nodeId);
    if (this.config.useIcons) {
        if (!node.icon) node.icon = (this.root.id == node.pid) ? this.icon.root : ((node._hc) ? this.icon.folder : this.icon.node);
        if (!node.iconOpen) node.iconOpen = (node._hc) ? this.icon.folderOpen : this.icon.node;
        if (this.root.id == node.pid) {
            node.icon = this.icon.root;
            node.iconOpen = this.icon.root;
        }
        //这里是节点的状态图标
        str += '<img id="i' + this.obj + nodeId + '" border="0" align=absmiddle style=\'cursor:hand;\' src="' + ((node._io) ? node.iconOpen : node.icon) + '" alt="" />';
    }
    /*generate checkbox*/
    if(this.config.useCheckBox && nodeId!="0"){
        var ckdstr = "";
        var checkName = this.obj+"Ck";//Check框名
        //alert(node.isSelect);
        if (node.ifShowCheck!=false){//是否显示Check框,默认是可以显示的
            if (node.isSelect) {
                ckdstr = 'checked="checked"';
            }
            str += '<input type="checkbox" '+ckdstr+' name="'+checkName+'" style="VERTICAL-ALIGN:middle;WIDTH:14px;HEIGHT:14px" id="'+
                node.id+"$#"+node.pid+'" nodeName="'+node.name+'" onClick=selParentChildNode("'+node.id+"$#"+node.pid+'","'+checkName+'") />'
        }
    }
    /* end */
    
    if (node.url) {
        /**
        *这一段主要是节点的点击事件
        */
        str += '<a id="s' + this.obj + nodeId + '" name="'+TagAName+'" class="' + ((this.config.useSelection) ? ((node._is ? 'nodeSel' : 'node')) : 'node') +
         '" style=\'cursor:hand;\' onclick="javascript:setNodeCol(\''+nodeId+'\');onClickTreeNode(\'' + node.id + '\',\''+node.pid
         +'\',\''+node.name+'\',\''+node.title+ '\',\''+node.url+'\',\''+node.target+'\')"';
        if (node.title) str += ' title="' + node.title + '"';
        if (node.target) str += ' target="' + node.target + '"';
        if (this.config.useStatusText) str += ' onmouseover="window.status=\'' + node.name + '\';return true;" onmouseout="window.status=\'\';return true;" ';
        if (this.config.useSelection && ((node._hc && this.config.folderLinks) || !node._hc)) str += '>';
        //alert(str);
    }else if ((!this.config.folderLinks || !node.url) && node._hc && node.pid != this.root.id){
        str += '<a href="javascript: ' + this.obj + '.o(' + nodeId + ');" class="node">';
    }
    str += node.name;
    if (node.url || ((!this.config.folderLinks || !node.url) && node._hc)) str += '</a>';
    str += '</div>';
    if (node._hc) {
        str += '<div id="d' + this.obj + nodeId + '" class="clip" style="display:' + ((this.root.id == node.pid || node._io) ? 'block' : 'none') + ';">';
        str += this.addNode(node);
        str += '</div>';
    }
     this.aIndent.pop();
     //alert(str);
     return str;

}


// Adds the empty and line icons 
dTree.prototype.indent = function(node, nodeId) {
    var str = '';
    if (this.root.id != node.pid) {
        for (var n=0; n<this.aIndent.length; n++)
         str += '<img src="' + ( (this.aIndent[n] == 1 && this.config.useLines) ? this.icon.line : this.icon.empty ) + '" border="0" align=absmiddle style=\'cursor:hand;\' alt="" />';
        (node._ls) ? this.aIndent.push(0) : this.aIndent.push(1);
        if (node._hc) {
             str += '<a href="javascript: ' + this.obj + '.o(' + nodeId + ');"><img id="j' + this.obj + nodeId + '" border="0" align=absmiddle style=\'cursor:hand;\' src="';
             if (!this.config.useLines) str += (node._io) ? this.icon.nlMinus : this.icon.nlPlus;
             else str += ( (node._io) ? ((node._ls && this.config.useLines) ? this.icon.minusBottom : this.icon.minus) : ((node._ls && this.config.useLines) ? this.icon.plusBottom : this.icon.plus ) );
             str += '" alt="" /></a>';
        } else str += '<img border="0" align=absmiddle style=\'cursor:hand;\' src="' + ( (this.config.useLines) ? ((node._ls) ? this.icon.joinBottom : this.icon.join ) : this.icon.empty) + '" alt="" />';
    }
    return str;
}

 

// Checks if a node has any children and if it is the last sibling

dTree.prototype.setCS = function(node) {
    var lastId;
    for (var n=0; n<this.aNodes.length; n++) {
        if (this.aNodes[n].pid == node.id) node._hc = true;
        if (this.aNodes[n].pid == node.pid) lastId = this.aNodes[n].id;
    }
    if (lastId==node.id) node._ls = true;
}

 

// Returns the selected node

dTree.prototype.getSelected = function() {
    var sn = this.getCookie('cs' + this.obj);
    return (sn) ? sn : null;
}

 

// Highlights the selected node

dTree.prototype.s = function(id) {
    if (!this.config.useSelection) return;
    var cn = this.aNodes[id];
    if (cn._hc && !this.config.folderLinks) return;
    if (this.selectedNode != id) {
        if (this.selectedNode || this.selectedNode==0) {
            eOld = document.getElementById("s" + this.obj + this.selectedNode);
            if(eOld!=null)  eOld.className = "node";
        }
        eNew = document.getElementById("s" + this.obj + id);
        eNew.className = "nodeSel";
        this.selectedNode = id;
        if (this.config.useCookies) this.setCookie('cs' + this.obj, cn.id);
    }
}

 

// Toggle Open or close

dTree.prototype.o = function(id) {
    var cn = this.aNodes[id];
    this.nodeStatus(!cn._io, id, cn._ls);
    cn._io = !cn._io;
    if (this.config.closeSameLevel) this.closeLevel(cn);
    if (this.config.useCookies) this.updateCookie();
}

// Open or close all nodes

dTree.prototype.oAll = function(status) {
    for (var n=0; n<this.aNodes.length; n++) {
        if (this.aNodes[n]._hc && this.aNodes[n].pid != this.root.id) {
            this.nodeStatus(status, n, this.aNodes[n]._ls)
            this.aNodes[n]._io = status;
        }
    }
    if (this.config.useCookies) this.updateCookie();
}

 

// Opens the tree to a specific node

dTree.prototype.openTo = function(nId, bSelect, bFirst) {
    if (!bFirst) {
        for (var n=0; n<this.aNodes.length; n++) {
            if (this.aNodes[n].id == nId) {
                nId=n;
                break;
            }
        }
    }
    var cn=this.aNodes[nId];
    if (cn.pid==this.root.id || !cn._p) return;
    cn._io = true;
    cn._is = bSelect;
    if (this.completed && cn._hc) this.nodeStatus(true, cn._ai, cn._ls);
    if (this.completed && bSelect) this.s(cn._ai);
    else if (bSelect) this._sn=cn._ai;
    this.openTo(cn._p._ai, false, true);
}

 

// Closes all nodes on the same level as certain node

dTree.prototype.closeLevel = function(node) {
    for (var n=0; n<this.aNodes.length; n++) {
        if (this.aNodes[n].pid == node.pid && this.aNodes[n].id != node.id && this.aNodes[n]._hc) {
            this.nodeStatus(false, n, this.aNodes[n]._ls);
            this.aNodes[n]._io = false;
            this.closeAllChildren(this.aNodes[n]);
        }
    }
}

 

// Closes all children of a node

dTree.prototype.closeAllChildren = function(node) {
    for (var n=0; n<this.aNodes.length; n++) {
        if (this.aNodes[n].pid == node.id && this.aNodes[n]._hc) {
            if (this.aNodes[n]._io) this.nodeStatus(false, n, this.aNodes[n]._ls);
            this.aNodes[n]._io = false;
            this.closeAllChildren(this.aNodes[n]);  
        }
    }
}

 

// Change the status of a node(open or closed)

dTree.prototype.nodeStatus = function(status, id, bottom) {
    eDiv = document.getElementById('d' + this.obj + id);
    eJoin = document.getElementById('j' + this.obj + id);
    if (this.config.useIcons) {
        eIcon = document.getElementById('i' + this.obj + id);
        eIcon.src = (status) ? this.aNodes[id].iconOpen : this.aNodes[id].icon;
    }
    eJoin.src = (this.config.useLines)?
    ((status)?((bottom)?this.icon.minusBottom:this.icon.minus):((bottom)?this.icon.plusBottom:this.icon.plus)):
    ((status)?this.icon.nlMinus:this.icon.nlPlus);
    eDiv.style.display = (status) ? 'block': 'none';
}

 

 

// [Cookie] Clears a cookie

dTree.prototype.clearCookie = function() {
    var now = new Date();
    var yesterday = new Date(now.getTime() - 1000 * 60 * 60 * 24);
    this.setCookie('co'+this.obj, 'cookieValue', yesterday);
    this.setCookie('cs'+this.obj, 'cookieValue', yesterday);
}

 

// [Cookie] Sets value in a cookie

dTree.prototype.setCookie = function(cookieName, cookieValue, expires, path, domain, secure) {
    document.cookie =
        escape(cookieName) + '=' + escape(cookieValue)
        + (expires ? '; expires=' + expires.toGMTString() : '')
        + (path ? '; path=' + path : '')
        + (domain ? '; domain=' + domain : '')
        + (secure ? '; secure' : '');
}

 

// [Cookie] Gets a value from a cookie

dTree.prototype.getCookie = function(cookieName) {
    var cookieValue = '';
    var posName = document.cookie.indexOf(escape(cookieName) + '=');
    if (posName != -1) {
        var posValue = posName + (escape(cookieName) + '=').length;
        var endPos = document.cookie.indexOf(';', posValue);
        if (endPos != -1) cookieValue = unescape(document.cookie.substring(posValue, endPos));
        else cookieValue = unescape(document.cookie.substring(posValue));
    }
    return (cookieValue);
}

 

// [Cookie] Returns ids of open nodes as a string

dTree.prototype.updateCookie = function() {
    var str = '';
    for (var n=0; n<this.aNodes.length; n++) {
        if (this.aNodes[n]._io && this.aNodes[n].pid != this.root.id) {
            if (str) str += '.';
            str += this.aNodes[n].id;
        }
    }
    this.setCookie('co' + this.obj, str);
}

 

// [Cookie] Checks if a node id is in a cookie

dTree.prototype.isOpen = function(id) {
    var aOpen = this.getCookie('co' + this.obj).split('.');
    for (var n=0; n<aOpen.length; n++)
    if (aOpen[n] == id) return true;
    return false;
}

 

// If Push and pop is not implemented by the browser

if (!Array.prototype.push) {
    Array.prototype.push = function array_push() {
        for(var i=0;i<arguments.length;i++)
        this[this.length]=arguments[i];
        return this.length;
    }
}

if (!Array.prototype.pop) {
    Array.prototype.pop = function array_pop() {
        lastElement = this[this.length-1];
        this.length = Math.max(this.length-1,0);
        return lastElement;
    }
}

/**
*当前节点如果有变化，所有子节点也要变化，如子节点被选中所有父节点也要被选中
*chkboxId -- 的格式为node.id+"$#"+node.pid（当前节点）
*checkName--选择框的名称；这种情况是为了防一个页面上有多个树
*/

function selParentChildNode(chkboxId,checkName){
    //get node id
    var node = chkboxId.split("$#");
    var nodeId = node[0];
    var nodePid = node[1];
    //checked or cancel checked
    var checkedFlag = document.getElementById(chkboxId).checked;//true或false
    selChildNode(nodeId,checkedFlag,checkName);
    selParentNode(nodePid,checkedFlag,checkName);
}

/**
*add new function selChildNode
*chkboxId -- 的格式为node.id+"$#"+node.pid
*checkName--选择框的名称;这种情况是为了防一个页面上有多个树
*父节点变化引起子节点也变化
*内部私有方法
*/
function selChildNode(nodeId,checkedFlag,checkName){
    try{
        //alert(checkedFlag);
        //search child node
        var myinput = document.getElementsByName(checkName);
        for(var i=0;i<myinput.length;i++){
            if(myinput[i].type=="checkbox"){
                var chkboxId = myinput[i].id;//选择框的ID为node.id+"$#"+node.pid
                var arrayId = chkboxId.split("$#");
                var childNodeId = arrayId[0];
                var childNodePid = arrayId[1];
                if(childNodePid == nodeId){//当前节点nodeId的所有子节点
                     myinput[i].checked = checkedFlag;
                     selChildNode(childNodeId,checkedFlag,checkName);//circular transfer
                }
            }
        }
    }catch(ex){
        alert("some error dtree!");
    }

};


/**
*add new function selChildNode
*chkboxId -- 的格式为node.id+"$#"+node.pid
*checkName--选择框的名称；这种情况是为了防一个页面上有多个树
*如子节点被选中父节点也被选中
*内部私有方法
*/

function selParentNode(nodePid,checkedFlag,checkName){
    try{
        //alert(checkedFlag);
        //search child node
        var myinput = document.getElementsByName(checkName);
        for(var i=0;i<myinput.length;i++){
            if(myinput[i].type=="checkbox"){
                var chkboxId = myinput[i].id;//选择框的ID为node.id+"$#"+node.pid
                var arrayId = chkboxId.split("$#");
                var childNodeId = arrayId[0];
                var childNodePid = arrayId[1];
                if(checkedFlag && (parentNodeId == nodePid)){//当前节点nodeId的所有子节点
                     myinput[i].checked = checkedFlag;
                     selParentNode(parentNodePid,checkedFlag,checkName);//circular transfer
                }
            }
        }
    }catch(ex){
        //alert("513==some error dtree!");
    }

};

/**
*add new function getCheckedIds
*return ids 节点id的JS方法如下(用逗号分隔)
*返回树中被选中节点的ID值
*treeId为树名字符串
*/
 function getCheckedIds(treeId){
    try{
        var ids = "";
        var objName = treeId+"Ck";//Check框名
        //var myinput = document.body.getElementsByTagName("input");
        var myinput = document.getElementsByName(objName);
        for(var i=0;i<myinput.length;i++){
             if(myinput[i].type == "checkbox")  { 
                if(myinput[i].checked){
                     ids += myinput[i].id.split("$#")[0]+",";
                }
             }
        }
        //alert( ids.substring(0,ids.length-1));
        return ids.substring(0,ids.length-1);
    }catch(ex){
        alert("some error dtree!");
    }
 };
 
/**
*add new function setCheckedIds
*传入的ids 节点id的JS方法如下(用逗号分隔)
*返回树中被选中节点的ID值
*cleartype = 0;不清空原来的选项目;1=清空原来所有的选项目
*/
function setCheckedIds(treeId,ids,cleartype){
    try{

        var idsArr = ids.split(",");
        var objName = treeId+"Ck";//Check框名
        var myinput = document.getElementsByName(objName);
        //如果传入的字符串为空,则要清空被选项目
        if(cleartype!=undefined && cleartype==1){
            for(var i=0;i<myinput.length;i++){
                if(myinput[i].type == "checkbox"){
                    myinput[i].checked = false;
                }
            }       
        }

        if(!ids || ids=="") return;
        var nid;        
        for(var i=0;i<myinput.length;i++){
            if(myinput[i].type == "checkbox"){
                nid = myinput[i].id.split("$#")[0];
                if(idsArr.contains(nid)){
                    myinput[i].checked = true;
                }
            }
        }
    }catch(ex){
        alert("some error dtree!");
    }
}; 


/**
*判断数组中是否包含某个元素
*/
Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
}

 
/**
*add new function getCheckedIdsName
*return str 返回节点id及名称 多个用;分开 格式(id=name)
*treeId为树名字符串
*/

 function getCheckedIdsName(treeId){
    try{
        var str = "";
        var objName = treeId+"Ck";//Check框名
        //var myinput = document.body.getElementsByTagName("input");
        var myinput = document.getElementsByName(objName);
        for(var i=0;i<myinput.length;i++){
             if(myinput[i].type == "checkbox"){//和前面第三行配合使用
                if(myinput[i].checked){
                     var objId = myinput[i].id;
                     var nid = myinput[i].id.split("$#")[0];
                     var nname = myinput[i].nodeName;
                     str += nid+"="+nname+";";
                }
             }
        }
        //alert( ids.substring(0,ids.length-1));
        return str.substring(0,str.length-1);
    }catch(ex){
        alert("some error dtree!");
    }
 };
 
 
/**
*add new function getTreeAllId
*return 所有节点id的JS方法如下(用逗号分隔)
*返回树中所有节点的ID值
*treeId为树名字符串
*/
 function getTreeAllId(treeId){
    try{
        var ids = "";
        var TagAName = treeId+"TagA";//节点树的所有行中的A标签,为了取到树中的所有节点用到
        //var myinput = document.body.getElementsByTagName("input");
        var mynode = document.getElementsByName(TagAName);
        var aTag = "s"+treeId;
        var startNumb = aTag.length;
        for(var i=0;i<mynode.length;i++){
            var aTagId = mynode[i].id;//A标签的ID号
            ids += aTagId.substring(startNumb,aTagId.length)+",";
        }
        //alert( ids.substring(0,ids.length-1));
        return ids.substring(0,ids.length-1);
    }catch(ex){
        alert("some error dtree!");
    }
 };
 
 /**
 *点击当前节点时的颜色变化
 *
 */
function setNodeCol(curId) {
    try {
        //alert(window.event.srcElement.tagName);
        if(window.event.srcElement.tagName){//单元格点击事件;
            //如果当前元素是TD则需要找出当前表的ID号;td的父节点是tr,tr的父节点是tbody,tbody的父节点是table;
            //curTbId = event.srcElement.parentNode.parentNode.parentNode.id;//当前表的ID
            //var tbId = document.getElementById(curTbId);//当前表对象
            //curTrId = event.srcElement.parentNode.id;//当前tr的ID
            //alert(curNodeId+"========="+curId);
            if(curNodeId != "" && curNodeId!=curId){
                document.getElementById("md"+curNodeId).style.backgroundColor="";
            }
            curNodeId = curId;
            var bgcol = event.srcElement.parentNode.style.backgroundColor;
            if(bgcol!=bgColor){
                event.srcElement.parentNode.style.backgroundColor=bgColor;
            }else{
                event.srcElement.parentNode.style.backgroundColor="";
            }
        }
    }catch(e){
    }
}
 
 /**
 *谷利军
 *取得应用的相对路径
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

/////////以下为自定义方法------------------------------------------------
//node onClick Even
/**
function onClickTreeNode(nid,pid,htmlName,tabTitle,url,target){
    if(htmlName==null || htmlName==""){
        return;
    }else{
        window.parent.addNewTab(htmlName,tabTitle);
    }
}
*/