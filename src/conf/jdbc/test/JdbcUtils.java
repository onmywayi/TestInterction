package conf.jdbc.test;

import java.io.InputStream;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Properties;

/**
 * 	mysql连接类
 * @author Wyl
 *
 */
public class JdbcUtils {
	
	public static String user =null;
	public static String password =null;
	public static String url =null;
	public static String driverClass =null;
	
	static	{
		try {
		// 读取类的加载器,反射获取文件内容
		InputStream is = JdbcUtils.class.getClassLoader().getResourceAsStream("jdbcmysql.properties");

		// 将用户名和密码封装到Properties
		Properties pros = new Properties();
		pros.load(is);		
		
		//读取属性		
		user = pros.getProperty("username");
		password = pros.getProperty("password");
		url = pros.getProperty("url");
		driverClass = pros.getProperty("driverClass");

		//加载驱动
		Class.forName(driverClass);
		}catch(Exception e) {
			e.printStackTrace();
		}
	}	
	
		/**
		 * 	获取数据库连接方法
		 * @return
		 * @throws Exception
		 */
		public static Connection getConnection() throws Exception{
		Connection conn = DriverManager.getConnection(url, user, password);
		return conn;
	}
		//释放连接
		public static void release(Connection conn,Statement stmt,ResultSet rs) {
			if(rs!=null) {
				try {
					rs.close();
				}catch(SQLException thowException){
					thowException.printStackTrace();
					
				}
			}
			if(stmt!=null) {
				try {
					stmt.close();
				}catch(SQLException thowException){
					thowException.printStackTrace();
					
				}
			}
			if(conn!=null) {
				try {
					conn.close();
				}catch(SQLException thowException){
					thowException.printStackTrace();
					
				}
			}
		}
		public static void main(String[] args) {
			System.out.println(user+password+url);
		}

		
}
