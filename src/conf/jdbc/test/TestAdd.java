package conf.jdbc.test;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


/**
 * 
 * @author Wyl
 * @author 连接数据库类
 *
 */
public class TestAdd{
//		public static final Connection getConnection = null;
		//定义连接数据库的相关信息驱动器
		static String driver = "com.mysql.cj.jdbc.Driver";
		//连接数据库
		    static String url = "jdbc:mysql://localhost:3306/test?serverTimezone=GMT%2B8";
//		    static String username = "root";
//		    static String password = "123456";
//		static String url;	//前端传入时会把符号替换成其他符号，待解决问题
		static String username;
		static String password;
		
		public  Connection conn;
		
		/**
		 * @author wyl
		 * 	 连接数据库的方法，传入账号密码，返回list结果集
		 * @
		 * @param username
		 * @param password
		 * @return
		 * @throws ClassNotFoundException
		 * @throws SQLException
		 */
		public List<Map<String,String>> ConnMethod(String username,String password) throws ClassNotFoundException ,SQLException{
		//调用连接数据库的方法	
						
			//加载jdbc驱动
			 Class.forName(driver);
			 
			//通过驱动管理器获得和数据的连接
			 Connection conn = DriverManager.getConnection(url,username,password);
			 
			//定义查询的sql语句
			String sql = "select * from uers";
			//创建一个PreparedStatement对象(可以用来执行sql,来操作数据库)
			PreparedStatement pstmt = conn.prepareStatement(sql);
			//执行sql，得到结果集
			ResultSet rs = pstmt.executeQuery();
			
			List<Map<String,String>> list = new ArrayList<>() ;
			//遍历结果集
			while(rs.next()) {	
				
					Map<String, String> map = new HashMap<String, String>();
					map.put(rs.getString("uersname"), rs.getString("password"));	//写入map
					list.add(map);	//将map写入list
			 
//				Dat dat = new Dat(rs.getString("uersname"),rs.getString("password"));
//				list.add(dat);			
//				System.out.println(rs.getString("uersname")+rs.getString("password"));
			}	
			rs.close();
			pstmt.close();
			conn.close();
			
			return 	list;
		}
	
	
	}


		

 