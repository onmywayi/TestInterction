package conf.jdbc.test;

import java.sql.SQLException;
import java.util.List;
import java.util.Map;

/**
 * 	测试数据库接口
 * @author Wyl
 *
 */
public class getdata {
	
	public static void main(String[] args) throws ClassNotFoundException, SQLException{
		TestAdd test = new TestAdd();
		List<Map<String, String>> data = test.ConnMethod("root", "123456");
		data.forEach(System.out::println);
		
	}
}
