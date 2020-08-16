/*
 * //*******************************************************************************
 * // * Copyright (c) 2011-2014 CSC.
 * // * Copyright (C) 2010-2016 CSC - All rights reserved.
 * // *
 * // * The information contained in this document is the exclusive property of
 * // * CSC.  This work is protected under USA copyright law
 * // * and the copyright laws of given countries of origin and international
 * // * laws, treaties and/or conventions. No part of this document may be
 * // * reproduced or transmitted in any form or by any means, electronic or
 * // * mechanical including photocopying or by any informational storage or
 * // * retrieval system, unless as expressly permitted by CSC.
 * //
 * // * Design, Develop and Manage by Team Integral Point-of-Sales & Services
 * // ******************************************************************************
 */


'use strict';
/*
* This module is an adapter module for any connector: ios, android, web,...
* Author: tphan37
* Dec-27-2014
*/
var connectionModule = angular.module('connectionModule', [])
.service('connectService', ['$q', '$log', 'commonService', '$injector', function($q, $log, commonService, $injector){
	function ConnectService() {
		var self = this;
		self.name = "connectService";
		self.platform;
		self.connectorService;
	
		self.defaultConnector = $injector.get('webConnectorService'); //default connection when no Platform is specific


		var platformService = $injector.get('platformService');
		platformService.getPlatformId().then(function gotPlatformId(platformId) {
			$log.info("Current Platform: " + platformId);
			ConnectService.prototype.setPlatform(platformId);
		});
	}


	ConnectService.prototype.setPlatform = function(platform){
		var self = this;
		self.platform = platform;
		
		try{
			if(self.platform === commonService.CONSTANTS.PLATFORM.WEB_LIFERAY)
				self.platform = commonService.CONSTANTS.PLATFORM.WEB;
			
			self.connectorService = $injector.get(self.platform.toLowerCase() + 'ConnectorService');
		}catch(e){			
			$log.error("No connector for platform: " + platform + ". Using default: " + self.defaultConnector.name);
			self.connectorService = self.defaultConnector;
		}

		self.connectorService.platform = platform;

		$log.debug("Initialized connector for platform: " + platform);
	};

	ConnectService.prototype.getPlatformId = function(){
		return this.platform;
	};

	/**
	 * Main function, which call the underline connector
	 * @param 	{object}		params	input for executing actions, which has properties:
	 * @param 	{string}		params	actionName - the action which connector need to execute
	 * @param 	{array}			params	actionParams - array of actionParams
	 * @param 	{object}		params	data - send for post action (optional)
	 * @param 	{requestURL}	params	requestURL - for using with liferay (optional)
	 * @return an Angular Promise instance
	 */
	ConnectService.prototype.exeAction = function exeAction(params) {
		var self = this;
		var deferred = $q.defer();

		this.setPlatform('web');

		if(self.connectorService === undefined){
			$log.error("Execute action: \'" +  params.actionName + "\'' but connector hasn't been initialized...\nChange to use " + self.defaultConnector.name);
			self.connectorService = self.defaultConnector;
		}
		
		if(params.data){
			$log.debug("Data sent to action: " + params.actionName + " (see below) with actionParams: [" + params.actionParams + "]");
			// $log.debug(data);
			$log.debug(params.data);	

			//turn it on when u need to see the data in String
			// $log.debug("Json String sent for action: " + actionName + "\n" + JSON.stringify(postData));
		}else{			
			$log.debug("Execute action: " + params.actionName + " with actionParams: [" + params.actionParams + "]");
		}

		self.connectorService.executeAction(params,
			function fnSuccess(data){
				deferred.resolve(data);
				$log.debug("Data received for action: " + params.actionName + " (see below) with actionParams: [" + params.actionParams + "]");
				switch(params.actionName){
					case 'RESOURCE_DOWNLOAD':
					case 'RESOURCE_UPLOAD':
						//this will slow down the console screen
						$log.debug("Data's too big for showing");
						break;
					default:
						$log.debug(data);
				}
			},
			function fnFailed(data){
				deferred.reject(data);
			}
		);

		return deferred.promise;
	};

	return new ConnectService();
}]);