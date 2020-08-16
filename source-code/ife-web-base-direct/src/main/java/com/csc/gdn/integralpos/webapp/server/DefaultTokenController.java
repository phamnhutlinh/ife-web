package com.csc.gdn.integralpos.webapp.server;

import java.io.IOException;
import java.util.HashMap;
import java.util.LinkedHashMap;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;

import com.csc.gdn.integralpos.webcommon.api.common.WebHelper;
import com.csc.gdn.integralpos.webcommon.api.webapp.controller.WorkspaceController;
import com.csc.gdn.integralpos.webcommon.api.webapp.ssl.IposSimpleClientHttpRequestFactory;
import com.csc.gdn.integralpos.webcommon.api.webapp.ssl.WebClientDevWrapper;

@Controller
public class DefaultTokenController {
	private static final Logger LOGGER = Logger.getLogger(WorkspaceController.class);
	@Resource
	protected WebClientDevWrapper webClientDevWrapper;
	@Resource
	protected IposSimpleClientHttpRequestFactory iposSimpleClientHttpRequestFactory;
	@Resource
	protected SimpleClientHttpRequestFactory simpleClientHttpRequestFactory;
	@Resource
	protected WebHelper webHelper;
	
	@Value("${authentication.oauth2.token.password.url}")
	private String authenticationUrlPath;
	
	@Value("${authentication.oauth2.server}")
	private String authenticationServerUrl;
	
	@Value("${authentication.oauth2.user.authentication.url}")
	private String authenticationUserUrl;
	
	@Value("${authentication.oauth2.clientid}")
	private String authenticationClientId;
	
	@Value("${authentication.oauth2.secret}")
	private String authenticationClientSecret;
	
	@Value("${authentication.oauth2.username}")
	private String authenticationUserName;
	
	@Value("${authentication.oauth2.password}")
	private String authenticationPassword;
	
	/**
	 * url: http://localhost:9999/ife-infra-oauth2/oauth/token?grant_type=password&client_id=internal&username=vegito@ipos.com&password=P@ssword123
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping(value = "/getTokens", method = RequestMethod.POST)
	public <T> void workspace(HttpServletRequest request, HttpServletResponse response) throws Exception {
		HashMap<String, Object> result = new HashMap<String, Object>();
	    RestTemplate restTemplate = new RestTemplate();
	    ResponseEntity<Object> responseToken = null;
	    T rs = null;
	    HttpHeaders httpHeaders = new HttpHeaders();
	    
	    String uriPath = authenticationUrlPath;
	    String authServerURL = authenticationServerUrl;
	    String userAuthUrl = authenticationUserUrl;
	    //String uriPath = authenticationProperties.get("authentication.oauth2.token.password.url");
	    //String authServerURL = authenticationProperties.get("authentication.oauth2.server");
	    //String userAuthUrl = authServerURL + authenticationProperties.get("authentication.oauth2.user.authentication.url");
	    
		LOGGER.info("URL: " + userAuthUrl);
			
		if (StringUtils.startsWith(userAuthUrl, "https")) {
			webClientDevWrapper.trustSelfSignedSSL();
			restTemplate.setRequestFactory(iposSimpleClientHttpRequestFactory);
		} else {
			restTemplate.setRequestFactory(simpleClientHttpRequestFactory);
		}
		String url = authServerURL + uriPath + "&username=" + authenticationUserName + "&password=" + authenticationPassword;
		LOGGER.info("URL: " + url);	     
		String authorization = authenticationClientId + ":" + authenticationClientSecret;
		//String authorization = authenticationProperties.get("authentication.oauth2.clientid") + ":" + authenticationProperties.get("authentication.oauth2.secret");
		String encodedAuthorizationToken = Base64.encodeBase64String(authorization.getBytes());
		httpHeaders.add("Authorization", "Basic " + encodedAuthorizationToken);
	 
	    try {
			responseToken = restTemplate.exchange(url, HttpMethod.POST, new HttpEntity<Object>(null, httpHeaders), Object.class);
		} catch (HttpClientErrorException e) {
			try {
				rs = webHelper.toPojo(e.getResponseBodyAsString(), Object.class);
				String error = ((LinkedHashMap<String, String>) rs).get("error_description");
				LOGGER.error(e.getResponseBodyAsString());
				throw new AuthenticationCredentialsNotFoundException(error, e);
			} catch (IOException e1) {
				LOGGER.error(e1);
				throw new AuthenticationServiceException("Server error. Please contact Admin!", e1);
			}
		} catch (HttpServerErrorException e) {
			LOGGER.error(e);
			throw new AuthenticationServiceException("Server error. Please contact Admin!", e);
		} catch (ResourceAccessException e) {
			LOGGER.error(e);
			throw new AuthenticationServiceException(
					"Connection to authentication server failed. Please contact Admin!", e);
		}
	    rs = (T) responseToken.getBody();
		LOGGER.debug("Response: " + rs);
		result.put("access_token", ((HashMap<String, String>) rs).get("access_token"));
		result.put("expires_in", ((HashMap<String, String>) rs).get("expires_in"));
	    webHelper.responseJsonData(response, result);
	}

}