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
var commonModule = angular.module('commonModule', [])
.provider('commonService', function (){

	function createRolePermission(roles) {
		var rs = {};
		for (var key in roles){
			if (roles.hasOwnProperty(key)) {
				rs[key] = {};
				rs[key]['openable'] = ['case_openable', 'quotation_openable'];
				rs[key]['editable'] = ['case_editable', 'quotation_editable'];
				rs[key]['viewable'] = ['case_viewable', 'quotation_viewable'];
			}
		}
		return rs;
	}
	
	this.$get = function() {
		var constants = {};
		var options = {};
		var urlMap_PublicAPI = {};
		var urlMap_PrivateAPI = {};

		// Include partial config, constant
		if (typeof ConstantConfig !== 'undefined') {
			constants = ConstantConfig;
			options = constants.DEFAULT_APPLICATION_OPTION;
		}

		// Include partial config, url
		if (typeof UrlConfig !== 'undefined') {
			urlMap_PublicAPI = UrlConfig.publicAPI;
			urlMap_PrivateAPI = UrlConfig.privateAPI;
		}

		// Include partial config, acl
		if (typeof AclConfig !== 'undefined') {
			constants.USER_ROLES = AclConfig.USER_ROLES;
			constants.USER_GROUPS = AclConfig.USER_GROUPS;
			constants.APP_CONFIGS = AclConfig.APP_CONFIGS;
			constants.DASHBOARDS = AclConfig.DASHBOARDS;
		} else {
			constants.USER_ROLES = {};
			constants.APP_CONFIGS = {};
			constants.DASHBOARDS = {};
			constants.USER_GROUPS = {};
		}

		// Include partial config, site
		if (typeof SiteConfig !== 'undefined') {
			constants.SITECONFIG = SiteConfig;
		}

		// Create default permission for uiStructure
		options.defaultPermissions = createRolePermission(constants.USER_ROLES);
		
		return new CommonService(options, constants, urlMap_PublicAPI, urlMap_PrivateAPI);
	};
	
	function CommonService(options, constants, urlMap_PublicAPI, urlMap_PrivateAPI) {
		this.CONSTANTS = constants;
		this.options = options;
		this.urlMap_PublicAPI = urlMap_PublicAPI;
		this.urlMap_PrivateAPI = urlMap_PrivateAPI;
		this.isRefreshingToken = false;
	}

	CommonService.prototype.currentState = (function(that) {
		var self = that;
		return {
			set: function(stateName) {
				localStorage.setItem('currentState', stateName);
				self._currentState = stateName;
			},
			get: function() {
				if (!self.hasValueNotEmpty(self._currentState)) {
					self._currentState = localStorage.getItem('currentState');
				}
				return self._currentState;
			}
		}
	})(this.$get());

	/**
	 * Remove objs in localStorage which belongs to UI_Framework only
	 */
	CommonService.prototype.removeLocalStorageVariables = function() {
		var frameworkPrefix = 'ui-framework:';
		var keysNeedToRemove = [];
		var key;

		for (var i = 0, len = localStorage.length; i < len; i++ ) {
			key = localStorage.key(i);
			if (key.indexOf(frameworkPrefix) !== -1) {
				keysNeedToRemove.push(key);
			}
		}

		// Iterate over arr and remove the items by key
		for (i = 0; i < keysNeedToRemove.length; i++) {
			localStorage.removeItem(keysNeedToRemove[i]);
		}
	};

	CommonService.prototype.getUrl = (function(){

		/**
		 * Replace parameter such as {0}, {1}, {2},.. in request url
		 * @param  {string} 	input 		input url
		 * @param  {array} 		params 		array of string which will replace curly params
		 * @param  {boolean} 	keepParams 	if true, will return the input, otherwise ''
		 * @return {string}		the modified input
		 */
		function replaceUrlParams(input, params, keepParams) {
			var result;
			var index = input.match(/\d+(?=\})/g);

			// there is no {\d} in input, we'll keep it
			if (index === null){
				result = input;	
			}else{
				if (CommonService.prototype.hasValueNotEmpty(params[index])) {
					result = input.replace(/\{\d+\}/g, params[index]);
				} else 
					result = keepParams ? input : '';	
			}
			
			return result;
		}

		/**
		 * append arrayOfParams to urlElement
		 * @param  {string} 	urlElement 		the name of url need to be create
		 * @param  {array} 		arrayOfParams 	of string which will replace curly params
		 * @return {string}		the url with parameters
		 */
		return function(urlElement, arrayOfParams) {
			var baseUrl = urlElement.baseUrl;
			var idx = baseUrl.indexOf('?'); 
			var url;//baseUrl before '?'
			var params = [];//list of params in baseUrl after '?'
			var i = 0;
			//map params to url
			if (this.hasValue(baseUrl) && this.hasValue(arrayOfParams)) {

				if (idx < 0){
					url = baseUrl;
					params = [];
				}
				else{
					url =  baseUrl.substr(0, idx);
					params = baseUrl.substr(idx + 1, baseUrl.length-1).split('&');
				}

				//process url
				url = url.replace(/\{\d+\}/g, function(substr){
					return replaceUrlParams(substr, arrayOfParams, true);
				});

				//process parameters in url
				if (params){
					params = params.map(function(param){
						return replaceUrlParams(param, arrayOfParams, false);
					});
				}
				params = params.filter(function(n){return n!="";});

				return params.length > 0 ? url + '?' + params.join('&') : url;
			}
			else
				return urlElement;
		}
	})();
	
	// Utilities function
	/**
	 * @param variable
	 * @returns {Boolean} Note: if variable is an empty string (""), it still return true; 
	 */
	CommonService.prototype.hasValue = function (variable){
		return (typeof variable !== 'undefined') && (variable !== null);
	};
	CommonService.prototype.hasValueNotEmpty = function (variable){
		return (typeof variable !== 'undefined') && (variable !== null) && (variable.length !== 0);
	};
	
	//check if string in format Date 'dd/mm/yyyy'
	CommonService.prototype.checkValidDateFormat = function (searchText){
		var token = searchText.split('/');
		if(token.length == 3){
			var day = +token[0], month = +token[1], year = +token[2];
			
			if(day > 0 && day<=31 && month > 0 && month <=12 && year > 0 ){
				return true;
			}
		}
		
		return false;
	};
	
	CommonService.prototype.parseInt = function (str) {
		var result = parseInt(str);
		if (result.toString() === "NaN")
			result = 0;
		return result;
	};
	
	CommonService.prototype.clone = function (o){
		if (o === undefined) return undefined;
		var newObj = jQuery.extend(true, {}, o);
		return newObj;
	};
	
	CommonService.prototype.cloneExcept = function (o, except){
		var self = this;
		if (o === undefined) return undefined;
		var newObj = angular.copy(o);
		for ( var i = 0; i < newObj.elements.length; i++) {
			if(self.hasValue(newObj.elements[i].name) && newObj.elements[i].name == except)
				newObj.elements.splice(i,1);
		}

		return newObj;
	};
	/**
	* Just for testing
	* @param msecs
	*/
	CommonService.prototype.wait = function(msecs){
		var start = new Date().getTime();
		var cur = start;
		while(cur - start < msecs){
			cur = new Date().getTime();
		}	
	};

	CommonService.prototype.addCommas = function(nStr) {
		nStr += '';
		var x = nStr.split('.');
		var x1 = x[0];
		var x2 = x.length > 1 ? '.' + x[1] : '';
		var rgx = /(\d+)(\d{3})/;
		while (rgx.test(x1)) {
			x1 = x1.replace(rgx, '$1' + ',' + '$2');
		}
		return x1 + x2;
	};

	/* This method is neccessary to close the gap between Java's SimpleDateFormat and jQuery UI datepicker formatDate methods.
	Takes the SimpleDateFormat string from the server and turns it into the expected jQueryUI formatDate.
	Note: the jQueryUI formatDate only supports some of SimpleDateFormat settings.  Basically only Years, months, days, day of week */
	CommonService.prototype.convertToJquiDateFormat = function(localFormatString){
		 //Year
		 if(localFormatString.search(/y{3,}/g) >=0){                 /* YYYY */
		 localFormatString = localFormatString.replace(/y{3,}/g,     "yy");
		 }else if(localFormatString.search(/y{2}/g) >=0){            /* YY   */
		 //localFormatString = localFormatString.replace(/y{2}/g,      "y");
		 localFormatString = localFormatString.replace(/y{2}/g,      "yy"); // force to 'yy'
		 }
		
		 //Month
		 if(localFormatString.search(/M{4,}/g) >=0){                 /* MMMM */
		 localFormatString = localFormatString.replace(/M{4,}/g,     "MM");
		 }else if(localFormatString.search(/M{3}/g) >=0){            /* MMM  */
		 localFormatString = localFormatString.replace(/M{3}/g,      "M");
		 }else if(localFormatString.search(/M{2}/g) >=0){            /* MM   */
		 localFormatString = localFormatString.replace(/M{2}/g,      "mm");
		 }else if(localFormatString.search(/M{1}/g) >=0){            /* M    */
		 localFormatString = localFormatString.replace(/M{1}/g,      "m");
		 }
		 
		 //Day
		 if(localFormatString.search(/D{2,}/g) >=0){                 /* DD   */
		 localFormatString = localFormatString.replace(/D{2,}/g,     "oo");
		 }else if(localFormatString.search(/D{1}/g) >=0){            /* D    */
		 localFormatString = localFormatString.replace(/D{1}/g,      "o");
		 }
		
		 //Day of month
		 if(localFormatString.search(/E{4,}/g) >=0){                 /* EEEE */
		 localFormatString = localFormatString.replace(/E{4,}/g,     "DD");
		 }else if(localFormatString.search(/E{2,3}/g) >=0){          /* EEE  */
		 localFormatString = localFormatString.replace(/E{2,3}/g,    "D");
		 }
		 return localFormatString;
	};

	/**
	* DatePicker settings
	*/
	CommonService.prototype.applyDatePicker = function(locale, datePattern) {
		var region = locale.replace('_','-');
		var uiRegion = $.datepicker.regional[region];
		if(uiRegion === undefined){
			if(region.length > 2) region = region.substring(0,2);
			else region = "en-GB";
			uiRegion = $.datepicker.regional[region];
			if(uiRegion === undefined){
				uiRegion = $.datepicker.regional["en-GB"];
			}
		}
		$.datepicker.setDefaults(uiRegion);
		$.datepicker.setDefaults({
			changeMonth : true,
			changeYear : true,
			dateFormat : datePattern
		});
	};

	CommonService.prototype.generateIdByDate = function (doctype) {
		function leadingZero (value) {
			if(value < 10){
				return "0" + value.toString();
			}
			return value.toString();
		}
		var now = new Date();
		if (doctype !== null) {
			return doctype.concat(now.getFullYear(), leadingZero(now.getMonth()), leadingZero(now.getDate()), leadingZero(now.getHours()), leadingZero(now.getMinutes()), leadingZero(now.getSeconds()));
		}
		return doctype;
	};
	
	/**
	 * tphan37
	 * Copy attributes values from des to src
	 * @param  {Object} src the object have attribute values need to copy to {@code des}
	 * @param  {Object} des the object have attribute values will be updated by {@code src}
	 */
	CommonService.prototype.copyValueFromOther = function copyValueFromOther (src, des) {
		for (var k in src) {
			if(angular.isObject(src[k])){
				this.copyValueFromOther(src[k], des[k]);
			}else
				des[k] = src[k];
		}
	};
})
/*##################################################################
 * AJAX Service
###################################################################*/
.service('ajax', ['$q', '$http', 'commonService', '$resource', function($q, $http, commonService, $resource){
	function AjaxPromise(){
		this.isSuccess = undefined;//the calling ajax method is success or not. If success, this value will be Boolean.true
		this.successData = undefined;
	}
	/**
	 * @param fn this function will be called after the ajax process is finished successfully.
	 * The fn should have an argument to receive the result data.
	 */
	AjaxPromise.prototype.success = function(fn){
		var self = this;
		if (self.isSuccess){
			var data = self.successData;
			self.successData = undefined;//clear this data after using it.
			fn.call(self, data);
		}
	};
	
	AjaxPromise.prototype.error = function(fn){
		var self = this;
		if (self.isSuccess) return;//don't run if result is success
		fn.call(self);
	};
	
	function AjaxService($http){
		this.$http = $http;
		this.apiUrl = commonService.options.serverUrl;
	}
	/**
	 * This method will call Ajax synchronously
	 * @param url
	 * @returns an AjaxPromise. we use this approach to simulate the promise of Angular.$http
	 */
	AjaxService.prototype.getSync = function(url){
		var promise = new AjaxPromise();
		$.getSync(this.apiUrl + url,function(data){
			promise.isSuccess = true;
			promise.successData = data;
		});
		return promise;
	};
	/**
	 * This method will call Ajax synchronously
	 * @param url
	 * @param data a JavaScript request object (will be converted to JSON)
	 * @returns an AjaxPromise. we use this approach to simulate the promise of Angular.$http
	 */
	AjaxService.prototype.postSync = function(url, requestData){
		var promise = new AjaxPromise();
		$.postSync(this.apiUrl + url, requestData, function(data){
			promise.isSuccess = true;
			promise.successData = data;//If there is some error, this code won't run
		});
		return promise;
	};	
	
	/**
	 * Thid method will call Runtime restful service via POST method
	 * @param requestURL
	 * @param requestData
	 * @return Angular promise
	 */
	AjaxService.prototype.postRuntime = function(requestURL, runtimeURL, requestData, fnSuccess, fnError){
		var self = this;
		self.$http({
			method: "POST",
			url: requestURL,
			runtimeURL:runtimeURL,
			cache: false,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
				'Authorization': 'Bearer ' + localStorage.getItem("access_token")
			},
			transformRequest: function(data) {
				if (commonService.hasValueNotEmpty(data)) {
					return $.param({
						URL: runtimeURL,
						METHOD: 'POST',
						COMMAND: JSON.stringify(data)
					});
				}
			},
			data: requestData
		}).then(function(response) {
			fnSuccess(response.data);
		}).catch(function(response) {
			fnError(response.data);
		});
	};
	
	/**
	 * Thid method will call Runtime restful service via POST method
	 * @param requestURL
	 * @param requestData
	 * @param fnSuccess
	 * @param fnError
	 */
	AjaxService.prototype.patchRuntime = function(requestURL, runtimeURL, requestData, fnSuccess, fnError){
		var self = this;
		self.$http({
			method: "POST",
			url: requestURL,
			runtimeURL:runtimeURL,
			cache: false,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
		 		'Authorization': 'Bearer ' + localStorage.getItem("access_token")
			},
			transformRequest: function(data) {
				if (commonService.hasValueNotEmpty(data)) {
					return $.param({
						URL: runtimeURL,
						METHOD: 'PATCH',
						COMMAND: JSON.stringify(data)
					});
				}
			},
			data: requestData
		}).then(function(response) {
			fnSuccess(response.data);
		}).catch(function(response) {
			fnError(response.data);
		});
	};
	
	/**
	 * Thid method will call Runtime restful service via PUT method
	 * @param requestURL
	 * @param requestData
	 * @param fnSuccess
	 * @param fnError
	 */
	AjaxService.prototype.putRuntime = function(requestURL, runtimeURL, requestData, fnSuccess, fnError){
		var self = this;
		self.$http({
			method: "POST",
			url: requestURL,
			runtimeURL:runtimeURL,
			cache: false,
			headers: { 
				'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
				'Authorization': 'Bearer ' + localStorage.getItem("access_token")
			},
			transformRequest: function(data) {
				if (commonService.hasValueNotEmpty(data)) {
					return $.param({
						URL: runtimeURL,
						METHOD: 'PUT',
						COMMAND: JSON.stringify(data)
					});
				}
			},
			data: requestData
		}).then(function(response) {
			fnSuccess(response.data);
		}).catch(function(response) {
			fnError(response.data);
		});
	};
	
	
	/**
	 * Thid method will call Runtime restful service via GET method
	 * @param requestURL
	 * @param requestData
	 * @param fnSuccess
	 * @param fnError
	 */
	AjaxService.prototype.getRuntime = function(requestURL, runtimeURL, fnSuccess, fnError){
		var self = this;
		self.$http({
			method: "POST",
			url: requestURL,
			runtimeURL:runtimeURL,
			cache: false,
			headers: { 
				'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
				'Authorization': 'Bearer ' + localStorage.getItem("access_token")
			},
			transformRequest: function(data) {
				if (commonService.hasValueNotEmpty(data)) {
					return $.param({
						URL: runtimeURL,
						METHOD: 'GET',
						COMMAND: JSON.stringify(data)
					});
				}
			},
			data: {}
		}).then(function(response) {
			fnSuccess(response.data);
		}).catch(function(response) {
			fnError(response.data);
		});
	};
	
	AjaxService.prototype.getRuntime_Token = function(requestURL, runtimeURL, fnSuccess, fnError){
		var self = this;
		self.$http({
			method: "POST",
			url: requestURL,
			runtimeURL:runtimeURL,
			cache: false,
			transformRequest: function(data) {
				if (commonService.hasValueNotEmpty(data)) {
					return $.param({
						URL: runtimeURL,
						METHOD: 'GET',
						COMMAND: JSON.stringify(data)
					});
				}
			},
			data: {}
		}).then(function(response) {
			fnSuccess(response.data);
		}).catch(function(response) {
			fnError(response.data);
		});
	};
	
	/**
	 * Thid method will call Runtime restful service via GET method
	 * @param requestURL
	 * @param requestData
	 * @param fnSuccess
	 * @param fnError
	 */
	AjaxService.prototype.deleteRuntime = function(requestURL, runtimeURL, fnSuccess, fnError){
		var self = this;
		self.$http({
			method: "POST",
			url: requestURL,
			runtimeURL:runtimeURL,
			cache: false,
			headers: { 
				'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
				'Authorization': 'Bearer ' + localStorage.getItem("access_token")
			},
			transformRequest: function(data) {
				if (commonService.hasValueNotEmpty(data)) {
					return $.param({
						URL: runtimeURL,
						METHOD: 'DELETE',
						COMMAND: JSON.stringify(data)
					});
				}
			},
			data: {}
		}).then(function(response) {
			fnSuccess(response.data);
		}).catch(function(response) {
			fnError(response.data);
		});
	};
	
	/**
	 * Thid method will call Backend restful service via POST method for File
	 * @param requestURL
	 * @param requestData
	 * @param fnSuccess
	 * @param fnError
	 */
	AjaxService.prototype.postFile = function(requestURL, runtimeURL, requestData, fnSuccess, fnError){
		var self = this;
		var form = new FormData();
		form.append("file", params.file);
		self.$http({
			method: "POST",
			url: requestURL,
			runtimeURL:runtimeURL,
			cache: false,
			processData: false,
			contentType: false,
			mimeType: "multipart/form-data",
			headers: { 
				'Content-Type': 'multipart/form-data',
				'Authorization': 'Bearer ' + localStorage.getItem("access_token")
			},
			data: form
		}).then(function(response) {
			fnSuccess(response.data);
		}).catch(function(response) {
			fnError(response.data);
		});
	};
	
	/**
	 * Thid method will call Backend restful service via GET method for File
	 * @param requestURL
	 * @param fnSuccess
	 * @param fnError
	 */
	AjaxService.prototype.getFile = function(requestURL, runtimeURL, fnSuccess, fnError){
		var self = this;
		self.$http({
			method: "GET",
			url: requestURL,
			runtimeURL:runtimeURL,
			cache: false,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
				'Authorization': 'Bearer ' + localStorage.getItem("access_token")
			},
			transformResponse: function(data) {
				return data.data;
			},
			responseType: 'arraybuffer'
		}).then(function(response) {
			fnSuccess(response.data);
		}).catch(function(response) {
			fnError(response.data);
		});
	};
	
	/**
	 * Thid method will call public API via POST method
	 * @param {String} publicApiUrl
	 * @param {Object} params
	 * @param {Object} requestData
	 * @return {Object} Angular promise
	 */
	AjaxService.prototype.postPublicApi = function(publicApiUrl, params, requestData) {
		var resource = $resource(
			publicApiUrl,
			params.actionParams,
			{
				'customPost' : {
					responseType: params.responseType,
					cache: false,
					method:'POST',
					transformResponse: function(data) {
						try { data = angular.fromJson(data); }
						catch (e) {}
						return data;
					}
				}
			}
		);
		return resource.customPost(requestData);
	};
	
	/**
	 * Thid method will call public API via POST method
	 * @param {String} publicApiUrl
	 * @param {Object} params
	 * @param {Object} requestData
	 * @return {Object} Angular promise
	 */
	AjaxService.prototype.patchPublicApi = function(publicApiUrl, params, requestData) {
		var resource = $resource(
			publicApiUrl,
			params.actionParams,
			{
				'customPatch' : {
					responseType: params.responseType,
					cache: false,
					method:'PATCH',
					transformResponse: function(data) {
						try { data = angular.fromJson(data); }
						catch (e) {}
						return data;
					}
				}
			}
		);
		return resource.customPatch(requestData);
	};
	
	/**
	 * Thid method will call public API via PUT method
	 * @param {String} publicApiUrl
	 * @param {Object} params
	 * @param {Object} requestData
	 * @return {Object} Angular promise
	 */
	AjaxService.prototype.putPublicApi = function(publicApiUrl, params, requestData) {
		var resource = $resource(
			publicApiUrl,
			params.actionParams,
			{
				'customPut' : {
					responseType: params.responseType,
					cache: false,
					method:'PUT',
					transformResponse: function(data) {
						try { data = angular.fromJson(data); }
						catch (e) {}
						return data;
					}
				}
			}
		);
		return resource.customPut(requestData);
	};
	
	/**
	 * Thid method will call public API via DELETE method
	 * @param {String} publicApiUrl
	 * @param {Object} params
	 * @param {Object} requestData
	 * @return {Object} Angular promise
	 */
	AjaxService.prototype.deletePublicApi = function(publicApiUrl, params, requestData) {
		var resource = $resource(
			publicApiUrl,
			params.actionParams,
			{
				'customDelete' : {
					responseType: params.responseType,
					cache: false,
					method:'DELETE',
					transformResponse: function(data) {
						try { data = angular.fromJson(data); }
						catch (e) {}
						return data;
					}
				}
			}
		);
		return resource.customDelete(requestData);
	};
	/**
	 * This method will call public API via GET method
	 * @param {String} publicApiUrl
	 * @param {Object} params
	 * @return {Object} Angular promise
	 */
	AjaxService.prototype.getPublicApi = function(publicApiUrl, params) {
		var resource = $resource(
			publicApiUrl,
			params.actionParams,
			{
				'customGet' : {
					responseType: params.responseType,
					cache: false,
					method:'GET',
					isArray: params.isArray,
					transformResponse: function(data) {
						try { data = angular.fromJson(data); }
						catch (e) {}
						return data;
					}
				}
			}
		);
		return resource.customGet();
	};

	/**
	 * Thid method will call Backend restful service via POST method for File
	 * @param {String} publicApiUrl
	 * @param {Object} params
	 * @return {Object} Angular promise
	 */
	AjaxService.prototype.postFilePublicApi = function(publicApiUrl, params) {
		var self = this;
		var deferred = $q.defer();
		var form = new FormData();
		form.append('file', params.file);
		if (commonService.hasValueNotEmpty(params.moreParams)) {
			var moreParams = params.moreParams;
			for (var prop in moreParams) {
				if (moreParams.hasOwnProperty(prop)) {
					form.append(prop, moreParams[prop]);
				}
			}
		}
		self.$http({
			method: "POST",
			url: publicApiUrl,
			cache: false,
			processData: false,
			contentType: false,
			mimeType: "multipart/form-data",
			headers: {
				'Content-Type': 'multipart/form-data',
				'Authorization': 'Bearer ' + localStorage.getItem("access_token")
			},
			data: form
		}).then(function(response) {
			deferred.resolve(response.data);
		}).catch(function(response) {
			deferred.reject(response.data);
		});
		return { $promise: deferred.promise };
	};

	return new AjaxService($http);
}])
/*##################################################################
 * Cache Service
###################################################################*/
.service('cacheService',['$cacheFactory', 'ajax', 'commonService', function($cacheFactory, ajax, commonService){
	
	/**
	 * 2012-08-25
	 * At this moment, each service (ProspectService, IllustrationService, FactFindService) has their own the list of meta-data items.
	 * In the future, we may move that items in to this class so other services can reuse those meta data items.
	 */
	function CacheService(ajax){
		var self = this;
		self.ajax = ajax;
		
		var metadataCache = $cacheFactory("metadataCache");
		var packageBundleCache = $cacheFactory("packageBundleCache");
		
		self.items = {
			metaData : metadataCache,
			packageBundle : packageBundleCache
		};
	}
	
	return new CacheService(ajax); 
}])
/*##################################################################
 * App Service
###################################################################*/
.service('appService', [ '$rootScope', 'ajax', 'commonService', function($rootScope, ajax, commonService){
	function AppService(ajax, scope){
		var self = this;
		self.ajax = ajax;
		self.localeContext = null;
		this.subordinateUid = undefined;
		this.subordinateFullname = undefined;
		
		self.formatString = function(text, params){
			var newText = text;
			// replace {0},{1},..,{n} with params
			if(params !== undefined && params.length > 0){
				for (var i = 0; i < params.length; i++) {
					var regexp = new RegExp('\\{'+i+'\\}', 'gi');
					newText = newText.replace(regexp, params[i]);
				}
			}
			return newText;
		};
		//Chi Nguyen add
		self.formatStringWithJson = function formatStringWithJson(text, jsonObj){
			var newText = text;

			for (var key in jsonObj) {
				var regexp = new RegExp('\\$\\{' + key + '\\}', 'gi');
				if(key.toUpperCase() === 'ACTIONAT') {
					var d = new Date(jsonObj[key]);
					newText = newText.replace(regexp, d.toLocaleString());
				}
				else {
					newText = newText.replace(regexp, jsonObj[key]);
				}
			}
			
			return newText;
		};
		self.getI18NText = function(code, params){
			if(self.localeContext == null) return code;
			var text = self.localeContext.messageSource[code];
			if(text != undefined) return self.formatString(text, params);
			//TODO : should be synchronous
			text = code;
			ajax.postSync("resource/i18n",[code]).success(function(data){
				text = data[code];
				self.localeContext.messageSource[code] = text;
			});
			return text;
		};
	}
	return new AppService(ajax, $rootScope);
}]);
//////////////////////////////////////////////////////////////////////////////////////////////////
//
// This common file has nothing to do with other JavaScript framework, just pure JavaScript function.
//
///////////////////////////////////////////////////////////////////////////////////////////////////
jQuery.support.cors = true;

(function($) {
	$.postSync = function(url, data, callback) {
		if(typeof data === "string"){
			return $.ajax({
				type: 'POST',
				url: url,
				cache: false,
				contentType: 'application/json',
				data: data,
				dataType: 'json',
				async: false,
				success: callback
			});
		}else if(window.JSON && window.JSON.stringify){
			return $.ajax({
				type: 'POST',
				url: url,
				cache: false,
				contentType: 'application/json',
				data: window.JSON.stringify(data),
		 		dataType: 'json',
				async: false,
				success: callback
			});
		}
		return null;
	};
	
	$.getSync = function(url, callback) {
		return $.ajax({
			type: 'GET',
			url: url,
			cache: false,
			dataType: 'json',
			async: false,
			success: callback
		});
	};
})(jQuery);

/**
 * mle27
 * This method return an array with unique elements
 */
Array.prototype.unique = function() {
	var unique = [];
	for (var i = 0; i < this.length; i++) {
		var current = this[i];
		if (unique.indexOf(current) < 0 && current!==undefined) unique.push(current);
	}
	return unique;
};

Array.prototype.remove = function(item) {
	var j = 0;
	while (j < this.length) {
		// alert(originalArray[j]);
		if (this[j] == item) {
		this.splice(j, 1);
		} else { j++; }
	}
};
String.prototype.beginWithRegExp = function(regExp){
	var rs = false;
	if(pathname.match(regExp)) {
		rs = true;
	}
	return rs;
	//return(this.indexOf(needle) == 0);
};
/**
 * @param s This method check whether the string start with @param s or not.
 * @returns {Boolean}
 */
String.prototype.beginWith = function(s){
	var rs = (this.substr(0, s.length) == s);
	return rs;
};

/**
 * tphan37
 * @param s This method capitalize the first letter
 * @returns {String}
 */
String.prototype.capitalizeFirstLetter = function(){
	return this.charAt(0).toUpperCase() + this.slice(1);
};



/**
 * tphan37
 * @returns {Object} the last object in the array, 'undefined' if length = 0
 */
Array.prototype.lastObj = function(){
	if(this.length < 1)
		return undefined;

	return this[this.length - 1];
};

/**
 * qle7
 * @param places
 * @param symbol
 * @param thousand
 * @param decimal
 * @returns
 */
Number.prototype.formatMoney = function(places, symbol, thousand, decimal) {
	places = !isNaN(places = Math.abs(places)) ? places : 2;
	symbol = symbol !== undefined ? symbol : "$";
	thousand = thousand || ",";
	decimal = decimal || ".";
	var number = this, 
		negative = number < 0 ? "-" : "",
		i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + "",
		j = (j = i.length) > 3 ? j % 3 : 0;
	return symbol + negative + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : "");
};

/**
 * tphan37
 * 27-Jan-2016
 * @param  {Object} obj      obj need to find
 * @param  {String} propName key name want to find
 * @return {Object}          primitive value or object
 */
function getValueByPropertyName(obj, propName) {
	for(var key in obj) {
		if(propName === key) {
			return obj[key];
		} else if (typeof obj[key] === 'object') {
			var value = getValueByPropertyName(obj[key], propName);
			if (value) {
				return value;
			}
		}
	}
	return undefined;
}


/**
 * @author tphan37
 * Copy attributes values from des to src
 * Will recursive to children obj for further processing
 * @param  {Object} src the object have attribute values need to copy to {@code des}
 * @param  {Object} des the object have attribute values will be updated by {@code src}
 */
function copyValueFromOther(src, des) {
	for (var k in src) {
		if(typeof src[k] === 'object'){
			copyValueFromOther(src[k], des[k]);
		}else
			des[k] = src[k];
	}
}

/**
 * @author tphan37
 * copy and extend attributes values from des to src
 * Will recursive to children obj for further processing
 * @param  {Object} des the object have attribute values will be updated by {@code src}
 * @param  {Object} src the object have attribute values need to copy to {@code des}
 * @return {Object}     the {@code des} object has been extended
 */
function extendValueFromOther(des, src) {
	for (var k in src) {
		if (!src.hasOwnProperty(k))
			continue;

		if (typeof src[k] === 'object' && src[k] !== null){
			//is array, check whether if it's been created
			if(Array.isArray(src[k])){
				des[k] = Array.isArray(des[k]) ? des[k] : [];
			}
			//is object, check whether if it's been created
			else{
				des[k] = typeof des[k] === 'object' ? des[k] : {};
			}
			extendValueFromOther(des[k], src[k]);
		}else
			des[k] = src[k];
	}
	return des;
}

function inheritPrototype(prototype) {
	function F() {}; // Dummy constructor
	F.prototype = prototype; 
	return new F(); 
}

/**
 * Inherit proptotype chain of parentClazz to childClazz
 * @param parentClazz parent class 
 * @param childClazz child class 
 */
function inherit(parentClazz, childClazz){
	childClazz.prototype = inheritPrototype(parentClazz.prototype);
	childClazz.prototype.constructor = childClazz;
}

/**
 * Extend only proptotype properties that srcClazz owns to prototype of destClazz
 * @param srcClazz source class 
 * @param destClazz destination class to be extended
 */
function extend(srcClazz, destClazz) {
	for (var k in srcClazz.prototype) {
		if (srcClazz.prototype.hasOwnProperty(k)) {
			destClazz.prototype[k] = srcClazz.prototype[k];
		}
	}
	destClazz.prototype = inheritPrototype(destClazz.prototype);
}

