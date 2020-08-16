/**
 * 
 */
package com.csc.gdn.integralpos.api.controller;

import javax.annotation.Resource;

import org.junit.Before;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.security.ldap.authentication.LdapAuthenticationProvider;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import com.csc.gdn.integralpos.webcommon.core.exception.ServiceProcessException;
import com.csc.gdn.integralpos.webcommon.core.profile.RequestProfile;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * @author Son Le
 *
 */
@RunWith(SpringJUnit4ClassRunner.class)
@WebAppConfiguration
@ContextConfiguration("/META-INF/config/ipos-client-web-context.xml")
public class AbstractControllerTests {
	@Autowired
	protected WebApplicationContext wac;
    protected MockMvc mockMvc;
    protected ObjectMapper jsonObjectMapper;
//    @Resource
//    protected LdapAuthenticationProvider ldapAuthProvider;
    
    @Before
    public void setup() throws ServiceProcessException {
        this.mockMvc = MockMvcBuilders.webAppContextSetup(this.wac).build();
        this.jsonObjectMapper = new ObjectMapper();
        
        // login as super@ipos.com as default
        // overwrite your user login within your test cases.
        login("super@ipos.com", "111111");
    }
    
    /**
     * New Request profile
     * @param module
     * @return
     */
    protected RequestProfile newRequestProfile(final String module){
    	RequestProfile requestProfile = new RequestProfile(); 
    	requestProfile.setModule(module);
    	return requestProfile;
    }
    
    /**
     * Login and set secuirty context for testing
     * @param username
     * @throws ServiceProcessException 
     */
    protected void login(final String username, final String password) throws ServiceProcessException{
    	Authentication authentication = new UsernamePasswordAuthenticationToken(username, password);
//    	Authentication auth = ldapAuthProvider.authenticate(authentication);
//    	if(auth != null){
//        	SecurityContextHolder.getContext().setAuthentication(auth);
//    	}
    }
}
