package conf.jdbc.test;

/**
 * @author Wyl
 * @author 包含get,set方法
 * 
 *
 */
public class Dat {
	private String uersname;
	private String password;
	
	@Override
	public String toString() {
//		return "Dat [uersname=" + uersname + ", password=" + password + "]";
		return "uersname=" + uersname + ", password=" + password;
	}
	public String getUersname() {
		return uersname;
	}
	public void setUersname(String uersname) {
		this.uersname = uersname;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public Dat() {}
	public Dat(String uersname,String password) {
		this.uersname = uersname;
		this.password = password;
	}
}
