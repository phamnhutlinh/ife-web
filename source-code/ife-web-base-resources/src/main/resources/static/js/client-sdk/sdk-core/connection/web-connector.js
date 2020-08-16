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
var connectionModule = angular.module('connectionModule')
.service('webConnectorService', ['$q', '$http', '$log', 'commonService', 'ajax',
	function($q, $http, $log, commonService, ajax) {

	function WebConnectorService() {
		this.name = "web-ConnectorService";
		this.maxIntervalTimes = 24;
		this.serverUrl = apiServerPath;		
		if (commonService.hasValueNotEmpty(this.serverUrl)) {
			this.serverUrl = this.serverUrl.replace(/\/+$/, '') + '/';
			//this.serverUrl = "http://20.203.7.8:2407/"
		}
	}

	WebConnectorService.prototype.executeAction = function(params, fnSuccess, fnFailed) {
		var self = this;
		if (params.actionName === undefined) {
			$log.error("The action: " + params.actionName + " hasn't been implemented in " + this.name);
		} else {
			// For print PDF, set response type to arraybuffer
			if (params.actionName === 'GET_ATTACHMENT' || params.isResourceFile === true) {
				params.responseType = 'arraybuffer';
			}
			
			// Call API
			if (commonService.urlMap_PublicAPI[params.actionName]) {
				// check if token is being refreshed or not
				if (commonService.isRefreshingToken) {
					// if token is being refreshed, try to loop API call every 5 seconds for at least 2 minutes (24 times)
					var intervalCount = 0;
					var interval = setInterval(function() {
						intervalCount++;
						self.request2PublicApiWithNewToken(params, fnSuccess, fnFailed, interval, intervalCount);
					}, 5000);
				} else {
					self.request2PublicApi(params, fnSuccess, fnFailed);
				}
			} else {
				self.request2Portal(params, fnSuccess, fnFailed);
			}
		}
	};

	//request to API 
	WebConnectorService.prototype.request2PublicApi = function request2PublicApi(params, fnSuccess, fnFailed) {
		var self = this;
		var promise;
		
		//Prepare and call ajax
		if (params.method === 'PUT') {
			promise = ajax.putPublicApi(self.serverUrl + commonService.urlMap_PublicAPI[params.actionName].baseUrl, params, params.data);
		} else if (params.method === 'DELETE') {
        	promise = ajax.deletePublicApi(self.serverUrl + commonService.urlMap_PublicAPI[params.actionName].baseUrl, params, params.data);
        } else if (params.data) {
			promise = ajax.postPublicApi(self.serverUrl + commonService.urlMap_PublicAPI[params.actionName].baseUrl, params, params.data);
		} else if (params.file) {
			promise = ajax.postFilePublicApi(self.serverUrl + commonService.getUrl(commonService.urlMap_PublicAPI[params.actionName], params.actionParams), params);
		} else {
			promise = ajax.getPublicApi(self.serverUrl + commonService.urlMap_PublicAPI[params.actionName].baseUrl, params);
		}

		//Simple use $resource, no need to use spring data rest since not build links
		promise.$promise.then(function onSuccess(response) {
			delete response["$promise"];
			delete response["$resolved"];
			if (fnSuccess && typeof fnSuccess === 'function') {
				fnSuccess(response);
			}
		}, function onFailed(response) {
			delete response["$promise"];
			delete response["$resolved"];
			if (fnFailed && typeof fnFailed === 'function') {
				fnFailed(response);
			}
		});
	};

	//Currently, we don't connect runtime-web directly
	//We still need to call request through portal
	WebConnectorService.prototype.request2Portal = function request2Portal(params, fnSuccess, fnFailed) {
		var runtimeUrl = undefined;
		if(commonService.urlMap_PrivateAPI[params.actionName] !== undefined) {
			runtimeUrl = commonService.getUrl(commonService.urlMap_PrivateAPI[params.actionName], params.actionParams);
		}
		$log.info("Request URL: " + runtimeUrl);
		
		//Prepare and call ajax
		if (params.method === 'PUT') {
			ajax.putRuntime(params.requestURL, runtimeUrl, params.data, fnSuccess, fnFailed);
		} else if (params.method === 'PATCH') {
			ajax.patchRuntime(params.requestURL, runtimeUrl, params.data, fnSuccess, fnFailed);
		} else if (params.method === 'DELETE') {
			ajax.deleteRuntime(params.requestURL, runtimeUrl, fnSuccess, fnFailed);
		} else { //post request
			if (params.data) {
				ajax.postRuntime(params.requestURL, runtimeUrl, params.data, fnSuccess, fnFailed);
			} else { //get request
				if (params.isResourceFile === true) {
					ajax.getFile(params.requestURL, runtimeUrl, fnSuccess, fnFailed);
				} else {
					ajax.getRuntime(params.requestURL, runtimeUrl, fnSuccess, fnFailed);
				}
			}
		}
	};

	WebConnectorService.prototype.request2PublicApiWithNewToken = function(params, fnSuccess, fnFailed, interval, intervalCount) {
		var self = this;
		if (intervalCount <= self.maxIntervalTimes) {
			// recheck if token is being refreshed or not
			if (!commonService.isRefreshingToken) {
				// call API if token is done refreshing
				self.request2PublicApi(params, fnSuccess, fnFailed);
				clearInterval(interval);
			}
		} else {
			clearInterval(interval);
		}
	};

	return new WebConnectorService();
}]);
