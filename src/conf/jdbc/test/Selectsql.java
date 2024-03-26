package conf.jdbc.test;
import conf.jdbc.test.JdbcUtils;

import java.sql.*;

/**
 * 	还有问题没解决，目前报空指针异常，工具类有问题
 * @author Wyl
 *
 */
public class Selectsql {
	public static void main(String[] args) {
		
		
		try {
			//获取连接
			Connection conn = JdbcUtils.getConnection();
			//设置sql语句
			String sql="select * from uers";
			//执行语句
			PreparedStatement stmt = conn.prepareStatement(sql);
			//获取执行后的数据集
			ResultSet rs = stmt.executeQuery();
			while(rs.next()) {
				System.out.println(rs.getString("uersname")+rs.getString("password"));
			}
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		

	}
	

}
