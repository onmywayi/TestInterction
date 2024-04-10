package cn.com.db.branch;
	
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;

import cn.com.common.file.FileUtil;
import cn.com.common.string.StringUtil;
import cn.com.plug.execl.ExcelUtil;

/**
 * 此类用于同方模板历年迭代更新用
 * 使用前一年的模板创建新一年的模板
 * @author cris
 *
 */
public class chaseTemplate {
	

	/*数据源字段文件字段分割符*/
	private String soureceFieldSplitSymbol=",";
    
	public static void main(String[] args) {
		//同方的压缩包解压后生成的字段表头文件
		String sourceFilePath ="D:/Downloads/指标比对/2021_2024年04月02日18时43分20秒/数据字段说明文档.txt";
		//历年的导入模板匹配文件
		String historyFilePath ="D:/Downloads/指标比对/9277.xlsx";
		//结果输出文件（不用改名字）
		String newFieldExcelpath="D:/Downloads/指标比对/2021_2024年04月02日18时43分20秒/新配置文件.xls";
		//模板配置文件在excel的第几个sheet//历年的导入模板匹配对应的匹配sheet 从1开始
		int historyFileSheetIndex =2;
		
		chaseTemplate cTemplate = new chaseTemplate();
		List<String> sourceFieldList = cTemplate.getSourceField(sourceFilePath);//
		List<LinkedHashMap<String, String>> hisfieldSetList = cTemplate.getHistoryFieldSet(historyFilePath,historyFileSheetIndex);//历史配置文件的配置集合	
		List<LinkedHashMap<String, String>> matchNewFieldSet = cTemplate.matchNewFieldSet(sourceFieldList, hisfieldSetList);//匹配后新的配置文件
		//System.out.println(matchNewFieldSet);
		//System.out.println(hisfieldSetList);
		cTemplate.writeFieldSetToExcel(matchNewFieldSet, hisfieldSetList,newFieldExcelpath);
		System.out.println("配置文件生成完成");
	}
	
	/**
	 * 获取数据源的字段名
	 * @param sourceFilePath 字段名称匹配文件
	 * @return
	 */
	public List<String> getSourceField(String sourceFilePath){
		List<String> fieldList = new ArrayList<String>();
		String fieldText = FileUtil.readFile(sourceFilePath);
		fieldText = fieldText.substring(fieldText.indexOf("：")+1);
		fieldText = fieldText.substring(fieldText.indexOf("：")+1);//截取2次 去除数据源字段文件多余内容
		fieldText = fieldText.replace("\n","");//删除换行符
		if(StringUtil.isNull(fieldText)) return fieldList;
		fieldList = Arrays.asList(fieldText.split(soureceFieldSplitSymbol));
		return fieldList;
	}
	
	/**
	 * 活动历史字段匹配的设置参数集合
	 * @param historySetPath
	 * @return
	 */
	public List<LinkedHashMap<String, String>> getHistoryFieldSet(String historySetPath,int sheetIndex){
		List<LinkedHashMap<String, String>> fieldSetList = new ArrayList<LinkedHashMap<String, String>>();
		fieldSetList = ExcelUtil.readExcel2(historySetPath, sheetIndex,"1-", "1-");
		return fieldSetList;
	}
	
	/**
	 * 根据历史的字段设置匹配新的上传模板的字段设定
	 * 匹配原则：字段中文相同 不进行空格删除
	 * @param sourceField 新的数据源下载模板信息
	 * @param hisfieldSetList
	 * @return
	 */
	public List<LinkedHashMap<String, String>> matchNewFieldSet(List<String> sourceFieldList,List<LinkedHashMap<String, String>> hisfieldSetList){
		List<LinkedHashMap<String, String>> fieldSetList = new ArrayList<LinkedHashMap<String, String>>();
		for (String sourceField : sourceFieldList) {
			LinkedHashMap<String, String> sortMap = sortFieldSet(sourceField,hisfieldSetList);
			if(!StringUtil.isNull(sortMap)) {
				sortMap.put("confirmflag", "");
			}else{
				sortMap.put("case_desc", sourceField);
				sortMap.put("confirmflag", "1");
			}
			fieldSetList.add(sortMap);
		}
		return fieldSetList;
	}
	
	/**
	 * 根据历史字段对新上传模板的名称进行匹配 不进行空格删除;返回匹配上的字段信息集合;匹配不上返回空map
	 * 历史模板配置的字段名称在case_desc属性里面
	 * @param sourceField
	 * @param hisfieldSetList
	 * @return
	 */
	public LinkedHashMap<String, String> sortFieldSet(String sourceField,List<LinkedHashMap<String, String>> hisfieldSetList){
		LinkedHashMap<String, String> sortMap =new LinkedHashMap<String, String>();
		String case_desc;	
		for(int i=0;i<hisfieldSetList.size();i++){
			LinkedHashMap<String, String> checkMap = hisfieldSetList.get(i);
			case_desc = checkMap.get("case_desc");
			if(case_desc.equals(sourceField)){
				sortMap = checkMap;
				hisfieldSetList.remove(i);//找到就移除
				return sortMap;
			}
		}
		return sortMap;
	}
	
	/**
	 * 将结果写入到excel中
	 * @param matchNewFieldSet 新的匹配字符串
	 * @param hisfieldSetList 历史字段没有匹配上的部分
	 * @param excelpath
	 */
	public void writeFieldSetToExcel(List<LinkedHashMap<String, String>> matchNewFieldSet,List<LinkedHashMap<String, String>> hisfieldSetList,String excelpath){
		File file = new File(excelpath);
		int titleCompleteIndex=0;
		int titleMaxIndex=matchNewFieldSet.size();
		String confirmflag="1";
		for (int i = 0; i < titleMaxIndex; i++) {
			LinkedHashMap<String, String> dMap=matchNewFieldSet.get(i);
			confirmflag =dMap.get("confirmflag");
			if(!confirmflag.equals("1")) { 	//代表少属性 不能作为表头 找下一行直到找到不等于1的那行
				titleCompleteIndex = i;
			    break;
			}
		}
		LinkedHashMap<String, String> titleMap = getFieldSetExcelTitle(matchNewFieldSet,1,titleCompleteIndex);//标题行
		if(hisfieldSetList.size()>0){
			LinkedHashMap<String, String> splitMap =  getFieldSetExcelTitle(matchNewFieldSet,2,titleCompleteIndex); 
			splitMap.put("col_name", "遗留字段");
			matchNewFieldSet.add(splitMap);
			matchNewFieldSet.addAll(hisfieldSetList);
		}
		if(file.exists()){
			file.delete();//每次生成新的
		}
		try {
			file.createNewFile();
			ExcelUtil.writeExcel(excelpath, titleMap, matchNewFieldSet);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	/**
	 * 获取excel配置表头
	 * type 1生成表头 2生产空行
	 * titleRow 行号所在列
	 * @return
	 */
	public LinkedHashMap<String, String> getFieldSetExcelTitle(List<LinkedHashMap<String, String>> matchNewFieldSet,int type,int titleRow){
		LinkedHashMap<String, String> titleMap = new LinkedHashMap<String, String>();
		if(matchNewFieldSet.size()>0){
			LinkedHashMap<String, String> matchEle = matchNewFieldSet.get(titleRow);
			for(String key:matchEle.keySet()){
				if(type==1){
					titleMap.put(key, key);
				}else{
					titleMap.put(key, "");
				}	
			}
		}
        return titleMap;	
	}
}
