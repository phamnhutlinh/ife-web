package com.csc.gdn.integralpos.resources.server;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan("com.csc.gdn.integralpos")
public class WebResourcesApplication {
	public static void main(String[] args) {
		SpringApplication.run(WebResourcesApplication.class, args);
	}
}
