package conf.jdbc.interaction;

import conf.jdbc.test.TestAdd;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;

public class frontservlet  extends HttpServlet {

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

    public frontservlet() {
        super();
    }

    public void	init()throws ServletException {
        ServletContext context = getServletConfig().getServletContext();
        checkType = getServletConfig().getInitParameter("checkType");
        configCheckType = checkType;
    }
    //销毁
    public void destroy() {
        super.destroy();
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws  ServletException, IOException {
        getinfor(request,response);
    }

    protected void doPost(HttpServletRequest req,HttpServletResponse resp)
            throws ServletException,IOException{
        //获取数据
        getinfor(req,resp);
    }
    private synchronized void getinfor(HttpServletRequest request, HttpServletResponse response) {

        //获取前端传来的数据
        String name = request.getParameter("username");
        String password = request.getParameter("password");
        String wid = request.getParameter("wid");


        try {
            testconndb tc = new testconndb();
//            datas = url1+ "," +name+ "," +password;		//记录需要回写的数据
            String opertype=request.getParameter("opertype");
            if(opertype.equals("select"))
                datas = testconndb.getlinked();
            else if (opertype.equals("insert")) {
                datas = tc.dataIn(name,password,wid);
            }else if (opertype.equals("update")){
                datas = testconndb.dataUp(name,password,wid);
            } else if (opertype.equals("delete")) {
                datas = testconndb.dataDe(name,password,wid);
            }

        }catch(Exception e){

        }

        writeJsonData(response,datas);	//回写数据到页面
        System.out.println("servlet回流："+datas);


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
