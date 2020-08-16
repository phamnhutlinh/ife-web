package com.csc.gdn.integralpos.webapp.server;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.autoconfigure.jdbc.DataSourceTransactionManagerAutoConfiguration;
import org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;

import com.csc.gdn.integralpos.webapp.properties.AppListProperties;
import com.csc.gdn.integralpos.webcommon.api.webapp.controller.AbstractBasicController;

@SpringBootApplication
@ComponentScan("com.csc.gdn.integralpos")
@EnableAutoConfiguration(exclude = {DataSourceAutoConfiguration.class, DataSourceTransactionManagerAutoConfiguration.class, HibernateJpaAutoConfiguration.class})
@Controller
public class WebLandingApplication extends AbstractBasicController {

	private static final Logger LOGGER = Logger.getLogger(WebLandingApplication.class);

	@Value("${workspace.view.name}")
	private String directPageViewName;
	
	@Autowired
	private AppListProperties appListProperties;
	
	public static void main(String[] args) {
		SpringApplication.run(WebLandingApplication.class, args);
	}
	
	@GetMapping("/public")
	public String landingPage(HttpServletRequest request, ModelMap model) throws Exception {
		retrieveApplicationToken(request);
		/*LOGGER.info("App list from yaml: " + appListProperties.getAppList().toString());
		model.addAttribute("appList", appListProperties.getAppList());*/
		return directPageViewName;
	}
	
}