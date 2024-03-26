package cn.com.db.branch;

import cn.com.common.sysdb.util.DBAH2Util;
import cn.com.db.core.db.DBAccessInterface;
import cn.com.db.core.db.external.DBAUtil;
import cn.com.db.branch.InitDbTable;
/*
 * 这是自动生成Oracle数据库表的方法
 */
public class Intable {
	private static final DBAH2Util h2dba = DBAH2Util.getInstance();
	 
	 /**外部数据库 SYS_DEPT,这里是内外同库**/
	 private static final DBAccessInterface dba = DBAUtil.getDBA();
	 /**
	  * @param args
	  */
	 public static void main(String[] args){
		 InitDbTable idt = new InitDbTable();
//	  String fileName = "D:/workbench/DSS/doc/init.xls";
		 String fileName = "D:/Testdata/201-1/createtable.xls";
		 idt.initDb(fileName,"Test_SYS_COMPANY_B_F");//除去后面参数则是创建表中所有sheet的表
	 }
	
}
