package conf.jdbc.test;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.util.List;

public class TestDatsx implements TestDat {
	private Connection conn = null;
	private PreparedStatement pstmt = null;	
	
	public TestDatsx(Connection conn) {
		this.conn =conn;
	}
	public TestDatsx(PreparedStatement pstmt) {
		this.pstmt=pstmt;
	}

	@Override
	public List<Dat> getAllDat() {
		// TODO Auto-generated method stub
		return null;
	}
}
