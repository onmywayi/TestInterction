var view = {  
  /** 
   * 填充表格主体数据(生成数据部分的各行tr) 
   * @param {DOM object} target  datagrid宿主table对应的DOM对象 
   * @param {DOM object} container 数据主体容器。包含两个可能的值，即： 
   * 1.frozen部分body1，对应的DOM对象为：div.datagrid-view>div.datagrid-view1>div.datagrid-body>div.datagrid-body-inner 
   * 2.常规部分body2，对应的DOM对象为：div.datagrid-view>div.datagrid-view2>div.datagrid-body 
   * @param {boolean} frozen  是否是冻结列 
   * @return {undefined}      未返回值 
   */
  render: function(target, container, frozen) {
    var data = $.data(target,"datagrid");
    var opts = data.options;
    var rows = data.data.rows;
    var fields = $(target).datagrid("getColumnFields", frozen);
    if(frozen) {  
      //如果grid不显示rownumbers并且也没有frozenColumns的话，直接退出。  
      if(!(opts.rownumbers || (opts.frozenColumns && opts.frozenColumns.length))) {  
        return;
      }  
    }  
    //定义表格字符串，注意这里使用了数组的join方式代替了传统的"+"运算符，在大多浏览器中，这样效率会更高些。  
    var html = ["<table class=\"datagrid-btable\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\"><tbody>"];  
    for(var i = 0; i < rows.length; i++) {  
      //striped属性，用于设置grid数据是否隔行变色，当然了实现原理很简单。  
      var cls = (i % 2 && opts.striped) ? "class=\"datagrid-row datagrid-row-alt\"" : "class=\"datagrid-row\"";  
      /** 
       * 表格的rowStyler属性用于处理数据行的css样式，当然了这个样式仅仅是作用于tr标签上。 
       * 这地方使用call了方法来设置上下文，如果rowStyler函数内部使用了this的话，则this指向datagrid的宿主table对应的DOM对象。 
       */
      var style = opts.rowStyler ? opts.rowStyler.call(target, i, rows[i]) : "";  
      var styler = style ? "style=\"" + style + "\"" : "";  
      /** 
       * rowId：行的唯一标示，对应于tr的id属性，其由以下几部分组成： 
       * 1.字符窜常量："datagrid-row-r"; 
       * 2.全局索引index：该索引值从1开始递增，同一个datagrid组件实例拥有唯一值，如果同一页面内有多个datagrid实例，那么其值从1递增分配给每个datagrid实例； 
       * 3.冻结列标识frozen：该标识用于标示是否是冻结列(包含行号和用户指定的frozenColumns)，"1"代表冻结列，"2"代表非冻结列； 
       * 4.行数索引：该值才是真正代表“第几行”的意思，该值从0开始递增 
       * 如页面内第一个datagrid实例的非冻结列第10行数据的rowId为"datagrid-row-r1-2-9" 
       */
      var rowId = data.rowIdPrefix + "-" + (frozen ? 1 : 2) + "-" + i;  
      html.push("<tr id=\"" + rowId + "\" datagrid-row-index=\"" + i + "\" " + cls + " " + styler + ">");  
      /** 
       * 调用renderRow方法，生成行数据(行内的各列数据)。 
       * 这里的this就是opts.view，之所以用call方法，只是为了传参进去。这里我们使用this.renderRow(target,fields,frozen,i,rows[i])来调用renderRow方法应该也是可以的。 
       */
      html.push(this.renderRow.call(this, target, fields, frozen, i, rows[i]));  
      html.push("</tr>");  
    }  
    html.push("</tbody></table>");  
    //用join方法完成字符创拼接后直接innerHTML到容器内。  
    $(container).html(html.join(""));
  }, 
  /** 
   * [renderFooter  description] 
   * @param {DOM object} target  datagrid宿主table对应的DOM对象 
   * @param {DOM object} container 可能为dc.footer1或者dc.footer2 
   * @param {boolean} frozen  是否为frozen区 
   * @return {undefined}      未返回值 
   */
  renderFooter: function(target, container, frozen) {  
    var opts = $.data(target, "datagrid").options;  
    //获取footer数据  
    var rows = $.data(target, "datagrid").footer || [];  
    var columnsFields = $(target).datagrid("getColumnFields", frozen);  
    //生成footer区的table  
    var footerTable = ["<table class=\"datagrid-ftable\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\"><tbody>"];  
    for(var i = 0; i < rows.length; i++) {  
      footerTable.push("<tr class=\"datagrid-row\" datagrid-row-index=\"" + i + "\">");  
      footerTable.push(this.renderRow.call(this, target, columnsFields, frozen, i, rows[i]));  
      footerTable.push("</tr>");  
    }  
    footerTable.push("</tbody></table>");  
    $(container).html(footerTable.join(""));  
  }, 
   
  /** 
   * 生成某一行数据 
   * @param {DOM object} target  datagrid宿主table对应的DOM对象 
   * @param {array} fields  datagrid的字段列表 
   * @param {boolean} frozen  是否为冻结列 
   * @param {number} rowIndex 行索引(从0开始) 
   * @param {json object} rowData 某一行的数据 
   * @return {string}     单元格的拼接字符串 
   */
  renderRow: function(target, fields, frozen, rowIndex, rowData) {  
    var opts = $.data(target, "datagrid").options;  
    //用于拼接字符串的数组  
    var cc = [];  
    if(frozen && opts.rownumbers) {  
      //rowIndex从0开始，而行号显示的时候是从1开始，所以这里要加1.  
      var rowNumber = rowIndex + 1;

		//如果分页的话，根据页码和每页记录数重新设置行号
		if(opts.pagination) {  
			rowNumber += (opts.pageNumber - 1) * opts.pageSize;
		}

      /** 
       * 先拼接行号列
       * 注意DOM特征,用zenCoding可表达为"td.datagrid-td-rownumber>div.datagrid-cell-rownumber"
       */
		cc.push("<td class=\"datagrid-td-rownumber\"><div class=\"datagrid-cell-rownumber\">" + rowNumber + "</div></td>");  
    }
      
    for(var i = 0; i < fields.length; i++) {  
      var field = fields[i];  
      var col = $(target).datagrid("getColumnOption", field);  
      if(col) {  
        var value = rowData[field];  
        //获取用户定义的单元格样式，入参包括：单元格值，当前行数据，当前行索引(从0开始)  
        var style = col.styler ? (col.styler(value, rowData, rowIndex) || "") : "";  
        //如果是隐藏列直接设置display为none，否则设置为用户想要的样式  
        var styler = col.hidden ? "style=\"display:none;" + style + "\"" : (style ? "style=\"" + style + "\"" : "");  
        cc.push("<td field=\"" + field + "\" " + styler + ">");  
        //如果当前列是datagrid组件保留的ck列时，则忽略掉用户定义的样式，即styler属性对datagrid自带的ck列是不起作用的。  
        if(col.checkbox) {  
          var styler = "";  
        } else {  
          var styler = "";  
          //设置文字对齐属性  
          if(col.align) {  
            styler += "text-align:" + col.align + ";";  
          }  
          //设置文字超出td宽时是否自动换行(设置为自动换行的话会撑高单元格)  
          if(!opts.nowrap) {  
            styler += "white-space:normal;height:auto;";  
          } else {  
            /** 
             * 并不是nowrap属性为true单元格就肯定不会被撑高，这还得看autoRowHeight属性的脸色 
             * 当autoRowHeight属性为true的时候单元格的高度是根据单元格内容而定的，这种情况主要是用于表格里展示图片等媒体。 
             */
            if(opts.autoRowHeight) {  
              styler += "height:auto;";  
            }  
          }  
        }  
        //这个地方要特别注意，前面所拼接的styler属性并不是作用于td标签上，而是作用于td下的div标签上。  
        cc.push("<div style=\"" + styler + "\" ");  
        //如果是ck列，增加"datagrid-cell-check"样式类  
        if(col.checkbox) {  
          cc.push("class=\"datagrid-cell-check ");  
        }  
        //如果是普通列，增加"datagrid-cell-check"样式类  
        else {  
          cc.push("class=\"datagrid-cell " + col.cellClass);  
        }  
        cc.push("\">");  
        /** 
         * ck列光设置class是不够的，当突然还得append一个input进去才是真正的checkbox。此处未设置input的id，只设置了name属性。 
         * 我们注意到formatter属性对datagird自带的ck列同样不起作用。 
         */
        if(col.checkbox) {  
          cc.push("<input type=\"checkbox\" name=\"" + field + "\" value=\"" + (value != undefined ? value : "") + "\"/>");  
        }  
        //普通列  
        else {  
          /** 
           * 如果单元格有formatter，则将formatter后生成的DOM放到td>div里面 
           * 换句话说，td>div就是如来佛祖的五指山，而formatter只是孙猴子而已，猴子再怎么变化翻跟头，始终在佛祖手里。 
           */
          if(col.formatter) {  
            cc.push(col.formatter(value, rowData, rowIndex));  
          }  
          //操，这是最简单的简况了，将值直接放到td>div里面。  
          else {
            cc.push(value);  
          }  
        }  
        cc.push("</div>");
        cc.push("</td>");
      }  
    }  
    //返回单元格字符串，注意这个函数内部并未把字符串放到文档流中。  
    return cc.join("");  
  },  
  /** 
   * 刷新行数据，只有一个行索引(从0开始)，调用的updateRow方法，这里直接跳过。 
   * @param {DOM object} target  datagrid实例的宿主table对应的DOM对象 
   * @param {number} rowIndex 行索引(从0开始) 
   * @return {undefined}     未返回数据 
   */
  refreshRow: function(target, rowIndex) {  
    this.updateRow.call(this, target, rowIndex, {});  
  },  
  /** 
   * 刷新行数据，该接口方法肩负着同步行高，重新计算和布局grid面板等重任 
   * @param {DOM object} target  datagrid实例的宿主table对应的DOM对象 
   * @param {number} rowIndex 行索引(从0开始) 
   * @param {json object} 行数据 
   * @return {undefined}     未返回数据 
   */
  updateRow: function(target, rowIndex, row) {  
    var opts = $.data(target, "datagrid").options;  
    var rows = $(target).datagrid("getRows");  
    $.extend(rows[rowIndex], row);  
    var style = opts.rowStyler ? opts.rowStyler.call(target, rowIndex, rows[rowIndex]) : "";  
  
    function updateTableRow(frozen) {  
      var fields = $(target).datagrid("getColumnFields", frozen);  
      //这个地方查找grid的数据主体表格(可能包含冻结列对应的主体表格和普通列对应的主体表格)  
      //getTr这个函数，我在博客上介绍过，请参考：http://www.easyui.info/archives/396.html  
      var tr = opts.finder.getTr(target, rowIndex, "body", (frozen ? 1 : 2));  
      var checked = tr.find("div.datagrid-cell-check input[type=checkbox]").is(":checked");  
      //这里调用了renderRow方法来重新获取当前行的html字符串  
      tr.html(this.renderRow.call(this, target, fields, frozen, rowIndex, rows[rowIndex]));  
      tr.attr("style", style || "");  
      //更新的时候保留checkbox状态(包含两层信息:一是有ck列;二是ck列被之前就被选中)  
      if(checked) {  
        tr.find("div.datagrid-cell-check input[type=checkbox]")._propAttr("checked", true);  
      }  
    };  
    //更新冻结列对应的行  
    updateTableRow.call(this, true);  
    //更新普通列对应的行  
    updateTableRow.call(this, false);  
    //重新布局表格面板  
    $(target).datagrid("fixRowHeight", rowIndex);  
  },  
  insertRow: function(target, rowIndex, row) {  
    var state = $.data(target, "datagrid");  
    //options  
    var opts = state.options;  
    //document of datagrid  
    var dc = state.dc;  
    var data = state.data;  
    //兼容无效的rowIndex，默认设置为在最后一行追加  
    if(rowIndex == undefined || rowIndex == null) {  
      rowIndex = data.rows.length;  
    }  
    //为啥不跟上面的条件并到一起，真是蛋疼  
    if(rowIndex > data.rows.length) {  
      rowIndex = data.rows.length;  
    }  
    /** 
     * 下移rows 
     * @param {boolean} frozen 是否为frozen部分 
     * @return {undefined}    无返回值 
     */
    function moveDownRows(frozen) {  
      //1:冻结列部分；2:普通列部分  
      var whichBody = frozen ? 1 : 2;  
      for(var i = data.rows.length - 1; i >= rowIndex; i--) {  
        var tr = opts.finder.getTr(target, i, "body", whichBody);  
        //注意这地方设置了tr的"datagrid-row-index"和"id"属性  
        tr.attr("datagrid-row-index", i + 1);  
        tr.attr("id", state.rowIdPrefix + "-" + whichBody + "-" + (i + 1));  
        //计算行号  
        if(frozen && opts.rownumbers) {  
          //因rowIndex从0开始，以及须插入位置以下的tr要统一下移，所以新行号为i+2  
          var rownumber = i + 2;  
          //有分页的话，行号还要加上分页数据  
          if(opts.pagination) {  
            rownumber += (opts.pageNumber - 1) * opts.pageSize;  
          }  
          tr.find("div.datagrid-cell-rownumber").html(rownumber);  
        }  
      }  
    };  
    /** 
     * 插入了，要插两个地方的哦(如果你是男人，你可以淫荡地笑一下) 
     * @param {boolean} frozen 是否是frozen部分 
     * @return {undefined}    未返回值 
     */
    function doInsert(frozen) {  
      var whichBody = frozen ? 1 : 2;  
      //这行代码，不知道是干嘛的，怕插入得太快而早早缴械，所以才故意拖延时间的么？  
      var columnFields = $(target).datagrid("getColumnFields", frozen);  
      //构造新插入行的id属性  
      var trId = state.rowIdPrefix + "-" + whichBody + "-" + rowIndex;  
      var tr = "<tr id=\"" + trId + "\" class=\"datagrid-row\" datagrid-row-index=\"" + rowIndex + "\"></tr>";  
      if(rowIndex >= data.rows.length) {  
        //如果已经有记录，则插入tr即可  
        if(data.rows.length) {  
          //嗯哼，getTr的这个用法不多哦，未传入行索引，第三个参数为"last",随便的意淫一下就知道是获取最后一行了  
          //然后再在最后一行后插入一行，注意了，这里用的后入式  
          opts.finder.getTr(target, "", "last", whichBody).after(tr);  
        }  
        //如果表格尚无记录，则要生成表格，同时插入tr  
        else {  
          var cc = frozen ? dc.body1 : dc.body2;  
          cc.html("<table cellspacing=\"0\" cellpadding=\"0\" border=\"0\"><tbody>" + tr + "</tbody></table>");  
        }  
      }  
      //在rowIndex + 1前准确无误地插入，注意了，这里是前入式。  
      else {  
        opts.finder.getTr(target, rowIndex + 1, "body", whichBody).before(tr);  
      }  
    };  
    //下移frozen部分  
    moveDownRows.call(this, true);  
    //下移普通列部分  
    moveDownRows.call(this, false);  
    //插入frozen区  
    doInsert.call(this, true);  
    //插入普通区  
    doInsert.call(this, false);  
    //总数加1  
    data.total += 1;  
    //维护data.rows数组，这地方是插入一个数组元素了  
    data.rows.splice(rowIndex, 0, row);  
    //刷新，其中包含了重新布局grid面板等复杂得一笔的操作  
    //插入本是件很简单愉快的事情，可是你得为其后果负上沉重的代价  
    this.refreshRow.call(this, target, rowIndex);  
  },  
  /** 
   * 删除行接口 
   * @param {DOM object} target datagrid实例的宿主table对应的DOM对象 
   * @param {number} rowIndex 行索引 
   * @return {undefined}    未返回值 
   */
  deleteRow: function(target, rowIndex) {  
    var state = $.data(target, "datagrid");  
    var opts = state.options;  
    var data = state.data;  
  
    function moveUpRows(frozen) {  
      var whichBody = frozen ? 1 : 2;  
      for(var i = rowIndex + 1; i < data.rows.length; i++) {  
        var tr = opts.finder.getTr(target, i, "body", whichBody);  
        //"datagrid-row-index"和"id"属性减一  
        tr.attr("datagrid-row-index", i - 1);  
        tr.attr("id", state.rowIdPrefix + "-" + whichBody + "-" + (i - 1));  
        if(frozen && opts.rownumbers) {  
          var rownumber = i;  
          if(opts.pagination) {  
            rownumber += (opts.pageNumber - 1) * opts.pageSize;  
          }  
          tr.find("div.datagrid-cell-rownumber").html(rownumber);  
        }  
      }  
    };  
    //移除行  
    opts.finder.getTr(target, rowIndex).remove();  
    //上移frozen区  
    moveUpRows.call(this, true);  
    //上移普通区  
    moveUpRows.call(this, false);  
    //记录数减一  
    data.total -= 1;  
    //维护data.rows数据  
    data.rows.splice(rowIndex, 1);  
  },  
  /** 
   * 默认的onBeforeRender事件 为空 
   * @param {DOM object} target datagrid实例的宿主table对应的DOM对象 
   * @param {array} rows 要插入的数据 
   * @return {undefined}    默认未返回值 
   */
  onBeforeRender: function(target, rows) {},  
  /** 
   * 默认的onAfterRender 隐藏footer里的行号和check 
   * @param {DOM object} target datagrid实例的宿主table对应的DOM对象 
   * @return {undefined}    未返回值 
   */
  onAfterRender: function(target) {  
    var opts = $.data(target, "datagrid").options;  
    if(opts.showFooter) {  
      var footer = $(target).datagrid("getPanel").find("div.datagrid-footer");  
      footer.find("div.datagrid-cell-rownumber,div.datagrid-cell-check").css("visibility", "hidden");  
    }  
  }  
};