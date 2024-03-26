package conf.jdbc.interaction;

import org.apache.log4j.PropertyConfigurator;

import java.util.logging.Logger;

public  class TestLogs {
//    static {
public static void main(String[] args) {
    Logger log = Logger.getLogger(String.valueOf(TestLogs.class));
    PropertyConfigurator.configure("log4j.properties");
    log.info("------here is info----");
    }

//    }

}
