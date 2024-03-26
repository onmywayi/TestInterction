package conf.jdbc.interaction;

import cn.com.common.string.JsonUtil;
import cn.com.common.sysdb.util.DBAH2Util;
import cn.com.db.core.db.DBAccessInterface;
import cn.com.db.core.db.external.DBAUtil;


import java.beans.Transient;
import java.util.*;

public class testconndb {

//    /**平台数据库接口*/
//    private static DBAH2Util h2dba = DbaManage.getBba();
//
//    /**外部数据库**/
//    private static final DBAccessInterface dba = DBAUtil.getDBA();

    /**外部数据库**/
    private static final DBAccessInterface dba = DBAUtil.getDBA();

    /**平台数据库接口*/
//    private static DBAH2Util h2dba = DbaManage.getBba();




    /**
     * 查询数据
     * @return 返回前端的数据格式
     */
    public static String getlinked(){

        String selectsql = "select * from uers ";

        Map<Integer,String> map = new HashMap<Integer,String>();
        ArrayList<LinkedHashMap<String,String>> d=dba.get_ArrayLinkedList(selectsql,map);
        String str = null;
        Map smap = new HashMap<>();
        smap.put("total",d.size());
        smap.put("rows",d);
        str= JsonUtil.Map2JSON(smap);
        System.out.println("执行sql结果："+d);
        System.out.println("smap结果:"+smap);
        return str;
    }

    /**
     * 插入数据
     * @param username
     * @param password
     * @param wid
     * @return
     */
    public static  String dataIn(String username,String password,String wid){
        Map<Integer,String> imap = new HashMap<Integer,String>();
//      ArrayList<LinkedHashMap<String,String>> d = new ArrayList<>();
        String Indatesql ="insert into uers (username,password,wid) values(?,?,?)";
        imap.put(1,username);
        imap.put(2,password);
        imap.put(3,wid);
        System.out.println("进入insert-----imap---："+imap);
        int ins= dba.executeUpdate(Indatesql,imap);
        System.out.println("ins -----63-----:"+ins);
        return String.valueOf(ins);
     }

    /**
     * 更新数据
     * @param username
     * @param password
     * @param wid
     * @return
     */
    public static String dataUp(String username,String password,String wid){
        String updatesql = "update uers set username=?,password=? where wid=?";
        Map<Integer,String> umap = new HashMap<>();
        umap.put(1,username);
        umap.put(2,password);
        umap.put(3,wid);
        dba.executeUpdate(updatesql,umap);
        System.out.println("进入update---umap:"+umap);
        return "";
    }

    /**
     * 删除数据
     * @param username
     * @param password
     * @param wid
     * @return
     */
    public  static  String dataDe(String username,String password,String wid){
        String deletesql = "delete from uers where wid=?";
        Map<Integer,String> dmap = new HashMap<>();
        dmap.put(1,wid);
        dba.executeUpdate(deletesql,dmap);
        System.out.println("进入删除----dmap:"+dmap);
        return "";
    }


    public static void main(String[] args) {

        System.out.println("uers表数据:"+new testconndb().getlinked());
//        new testconndb().dataIn("测试1","6665","6");
//        new testconndb().dataUp("老六","66661","4");
//        new testconndb().dataDe("1","2","5");
    }

}
