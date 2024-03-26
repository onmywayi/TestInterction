package conf.jdbc.test;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.util.List;

import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.seleniumhq.jetty9.server.Request;

public class TestServlet extends HttpServlet {	
	
	/**
	 * 序列号
	 */
	private static final long serialVersionUID = 1L;

	/**
	 * 验证失败跳转的页面
	 */
	private static String nextPage = "login";
	
	/**
	 * 系统的主页面
	 */
	private static String mainPage = "MyHtml.html";
	//声明变量
	private static String checkType ;
	private static String configCheckType ;	
	public static  String datas;
	String url1;
	static String name;
	static String password;
	
	public TestServlet() {
		super();
	}
	
	public void	init()throws ServletException{
		ServletContext context = getServletConfig().getServletContext();
		checkType = getServletConfig().getInitParameter("checkType");
		configCheckType = checkType;
	}
	//销毁
	public void destroy() {
		super.destroy();
	}
	
	protected void doGet(HttpServletRequest request, HttpServletResponse response)throws  ServletException, IOException {
		getinfor(request,response);
	}
	
	protected void doPost(HttpServletRequest req,HttpServletResponse resp)throws ServletException,IOException{
		
		//获取数据
		getinfor(req,resp);
	}
	private synchronized void getinfor(HttpServletRequest request, HttpServletResponse response) {
		 url1 = request.getParameter("url");
		 name = request.getParameter("name");
		 password = request.getParameter("pwd"); //获取前端传来的数据
		
		 TestAdd ta = new TestAdd();
		 try {
			ta.ConnMethod(name, password);			
			
		} catch (ClassNotFoundException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		} catch (SQLException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}
		
		try {		
		datas = url1+ "," +name+ "," +password;		//记录需要回写的数据
		}catch(Exception e){
		}
		
		writeJsonData(response,datas);	//回写数据到页面
		
		
	}	
	/**
	 * 输出信息到页面
	 * @param resp
	 * @param data
	 */
	private static void writeJsonData(HttpServletResponse resp,String data){
        //resp.setContentType("text/html;charset=utf-8");
        resp.setContentType("application/json;charset=utf-8");
        PrintWriter writer=null;
        try {
            writer= resp.getWriter();
            writer.print(data);
        } catch (IOException e) {
            e.printStackTrace();
        }finally {
            writer.flush();
            writer.close();
        }
        
	}
	
	
}
