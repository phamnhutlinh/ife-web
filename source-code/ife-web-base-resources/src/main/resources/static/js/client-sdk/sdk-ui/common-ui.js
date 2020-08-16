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
var commonUIModule = angular.module('commonUIModule',['ngMaterial', 'uiRenderPrototypeModule'])

.controller('MessageCtrl', ['$scope', 'urlService', '$mdToast', 'commonUIService', 'commonService', '$translate', '$translatePartialLoader',
	function($scope, urlService, $mdToast, commonUIService, commonService, $translate, $translatePartialLoader) {
	$scope.message = commonUIService.message;
	$scope.status = commonUIService.status;
	$scope.closeToast = function() {
	    $mdToast.hide();
	  };
}])
.service('commonUIService', ['commonService', 'appService', 'detailCoreService', '$log', '$filter', '$mdToast', '$animate', '$translatePartialLoader', '$translate', '$mdDialog',
	function(commonService, appService, detailCoreService, $log, $filter, $mdToast, $animate, $translatePartialLoader, $translate, $mdDialog){
	
	function CommonUIService(){
		this.name = "common";
		$translatePartialLoader.addPart('translation');
		$translate.refresh();
		var language = localStorage.getItem('language');
		if (language !== undefined && language !== 'undefined') {
			$translate.use(language);
		} else {
			$translate.use('en');
		}
	}

	CommonUIService.prototype.setupAcl = function(aclService, stateService) {
		// clear existing role.
		aclService.flushStorage();
		aclService.flushRoles();
		
		var self = this;
		var customID = null;
		var role = null;
		var selectedProfile = localStorage.getItem('selected_profile');
		if (commonService.hasValueNotEmpty(selectedProfile)) {
			selectedProfile = JSON.parse(selectedProfile);
			customID =  selectedProfile.customerId;
			role = selectedProfile.role;
		}
		
		var roles = localStorage.getItem('roles');
		if (commonService.hasValueNotEmpty(roles)) {
			roles = JSON.parse(roles);
			if(commonService.hasValueNotEmpty(selectedProfile)) {
				for(var i=0; i<roles.length; i++) {
					if(roles[i].roleId != selectedProfile.role) {
						roles.splice(i, 1);
						i--;
					}
				}		
				if(role ==='PO' && !customID){
					for(var i=0; i<roles[0].permissions.length; i++) {
						if(roles[0].permissions[i] == "dashboard_case_management"){
							roles[0].permissions.splice(i, 1);
							i--;
						}
					}				
				}
				if(role ==='PO'){
					for(var i=0; i<roles[0].permissions.length; i++) {
						if(roles[0].permissions[i] == "dashboard_contact_management"){
							roles[0].permissions.splice(i, 1);
							i--;
						}
					}
				}
			}
		}
		if (roles !== undefined && Array.isArray(roles) && roles.length > 0) {
			// Setup acl list
			var aclData = {};
			roles.forEach(function(role) {
				aclData[role.roleId] = role.permissions;
				aclService.attachRole(role.roleId);
			});
			
			aclService.setAbilities(aclData);

			// Setup workspace by permissions
				if (commonService.CONSTANTS.SITECONFIG !== undefined) {
					var workspaces = [];
					var defaultLink = '';
					var defaultLinks = commonService.CONSTANTS.SITECONFIG.defaultLinks;
					var dashboards = commonService.CONSTANTS.DASHBOARDS;
					for (var idx in dashboards) {
						if (dashboards.hasOwnProperty(idx)) {
							if (aclService.can(dashboards[idx].permission)) {
								workspaces = workspaces.concat(dashboards[idx]);
								if (defaultLinks.indexOf(dashboards[idx].link) !== -1) {
									defaultLink = dashboards[idx].link;
								}
							}
						}
					}
					if(commonService.hasValueNotEmpty(defaultLink)){
						commonService.currentState.set(defaultLink);
					}
					localStorage.removeItem("workspaces");
					localStorage.setItem("workspaces", JSON.stringify(workspaces));
					if (stateService !== undefined) {
						if(localStorage.getItem("basic_quote") === 'true'){
							localStorage.setItem("currentState", "basic_quote_details")
						}
						else{
							commonService.currentState.set(defaultLink);
						}
						if(defaultLink == 'payment_management'){
							stateService.go('root.list.payment', {link: defaultLink});
						} else {
							if(defaultLink == 'direct'){
								stateService.go('root.list.direct', {link: defaultLink});
							}
							else {
								if(localStorage.getItem("basic_quote") === 'true'){
									localStorage.removeItem("basic_quote")
									/*
									 * localStorage.setItem("currentState",
									 * "basic_quote_details")
									 */
									stateService.go('root.list.basicquote',{link: defaultLink});
							}
								else{
									stateService.go('root.list.listView', {link: defaultLink});
								}
						}
					}
				}
			}
		} else {
			if (stateService !== undefined) {
				stateService.go('root.list.message', {messageName: 'access_denied'});
			}
		}
	};

	CommonUIService.prototype.setupAclForLanding = function(aclService, stateService) {
		var self = this;
		var self = this;
		var isCheck;
		var userOnline;
		
		var username = localStorage.getItem('username');
		var profile=localStorage.getItem('profiles');
		var selectedProfile = localStorage.getItem('selected_profile');
		if (commonService.hasValueNotEmpty(selectedProfile)) {
			selectedProfile = JSON.parse(selectedProfile);
		}
		var roles = localStorage.getItem('roles');
		var roles1 = localStorage.getItem('roles');
		if (commonService.hasValueNotEmpty(roles)) {
			roles = JSON.parse(roles);
			if(commonService.hasValueNotEmpty(selectedProfile)) {
				for(var i=0; i<roles.length; i++) {
					if(roles[i].roleId != selectedProfile.role) {
						roles.splice(i, 1);
						i--;
					}
				}
			}
		}
		/*
		 * for(var i=0; i<profile.length; i++) {
		 * if(profile[i].isVisibleMobility==true) { userOnline=value.role; } }
		 */
		
    if(selectedProfile!=null){
        if(selectedProfile.role=='AG'){
		   isCheck=1;
	       }
	    else if(selectedProfile.role=='SA'){
		    isCheck=2;
	       }
	    else if(selectedProfile.role =='PO'){
		if(selectedProfile.customerId!=null && selectedProfile.pasId==null){
			isCheck=3;
		}else if(selectedProfile.customerId==null && selectedProfile.pasId!=null){
			 isCheck=4;
		}else{
			isCheck=3;
		} 
		
	}
		}
	
		var myAppList = [];
		if (!commonService.hasValueNotEmpty(username)&&!selectedProfile) {
			// Display all app is user not logged in
			try {
				appList.forEach(function(app) {
					var appConfig = angular.copy(commonService.CONSTANTS.APP_CONFIGS[app.name]);
					appConfig.link = app.url;
					myAppList.push(appConfig);
				});
			} catch(e) {}
			localStorage.removeItem("appList");
			localStorage.setItem("appList", JSON.stringify(myAppList));
		} else if (roles !== undefined && Array.isArray(roles) && roles.length > 0) {
			// Setup acl list
			
			
			var aclData = {};
			roles.forEach(function(role) {
				if(isCheck==1){
					
						aclData[role.roleId] = role.permissions;
						aclService.attachRole(role.roleId);
					
				}else if(isCheck==2){
					
						aclData[role.roleId] = role.permissions;
						aclService.attachRole(role.roleId);
					
				}else if(isCheck==3){
				 	var arr=[];
					arr.push("app_agent");
					for(var i=0;i<role.permissions.length;i++){
						if(role.permissions[i]!="app_system_admin" && role.permissions[i]!="app_client" && role.permissions[i]!="app_contact" && role.permissions[i]!="app_payment"){
							arr.push(role.permissions[i]);
						}
					}
				
						aclData[role.roleId] = arr;
						aclService.attachRole(role.roleId);
					
				}else if(isCheck==4){
					var arr=[];
					
					for(var i=0;i<role.permissions.length;i++){
						if(role.permissions[i]!="app_system_admin" && role.permissions[i]!="app_client" && role.permissions[i]!="app_contact" && role.permissions[i]!="app_agent" && role.permissions[i]!="app_payment"){
							arr.push(role.permissions[i]);
						}
					}
				
						aclData[role.roleId] = arr;
						aclService.attachRole(role.roleId)
					
				}
//				else{
//				aclData[role.roleId] = role.permissions;
//				aclService.attachRole(role.roleId);
//				}
				/*
				 * aclData[role.roleId] = role.permissions;
				 * aclService.attachRole(role.roleId);
				 */
			});
			
			aclService.setAbilities(aclData);
			try {
				// Setup apps list by permission
				appList.forEach(function(app) {
					var appConfig = angular.copy(commonService.CONSTANTS.APP_CONFIGS[app.name]);
					if (aclService.can(appConfig.permission)){
							appConfig.link = app.url;
							myAppList.push(appConfig);
					}
				});
			} catch(e) {}
			localStorage.removeItem("appList");
			localStorage.setItem("appList", JSON.stringify(myAppList));
			if (stateService !== undefined) {
				stateService.go('root.list.home');
			}
		} else {
			if (stateService !== undefined) {
				stateService.go('root.list.message', {messageName: 'access_denied'});
			}
		}
	};
	
	/**
	 * After intersection between current user's roles with activeRoles =>
	 * resultActiveRole user's roles activeRoles => resultActiveRole
	 * ['AG','UW','UA'] ['AG','PR'] 'AG'
	 * 
	 * Besides, we setup role and permission into aclService.
	 * 
	 * @author hle56
	 * @param: aclService Access control service activeRoles String[]: list of
	 *         roles can access detail.
	 * @return resultActiveRole String: which role is active.
	 */
	CommonUIService.prototype.setupAclForDetail = function setupAclForDetail(aclService, activeRoles) {
		// clear existing role.
		aclService.flushStorage();
		aclService.flushRoles();
		
		var roles = localStorage.getItem('roles');
		if (commonService.hasValueNotEmpty(roles)) {
			roles = JSON.parse(roles);
		}
		
		var resultActiveRole = '';
		if (roles !== undefined && Array.isArray(roles) && roles.length > 0 &&
			activeRoles !== undefined && Array.isArray(activeRoles)) {
			// Setup acl list
			var aclData = {};
			roles.forEach(function(role) {
				activeRoles.forEach(function(activeRole) {
					if (role.roleId === activeRole) {
						resultActiveRole = activeRole;
						aclData[activeRole] = role.permissions;
						aclService.attachRole(activeRole);
					}
				});
			});
			aclService.setAbilities(aclData);
		}
		return resultActiveRole;
	};
	
	var firstTokenRefreshRequestId = null; // hle71
	CommonUIService.prototype.setupRefreshTokenTimer = function(accountCoreService) {
		var tokenExpiresAt = localStorage.getItem("token_expires_at");
		if (commonService.hasValueNotEmpty(tokenExpiresAt)) {
			var requestNewAccessToken = function() {
				commonService.isRefreshingToken = true;
				accountCoreService.requestNewAccessToken().then(function(data) {
					if (!commonService.hasValueNotEmpty(data.error)) {
						commonService.isRefreshingToken = false;
						tokenExpiresAt = accountCoreService.getTokenExpiresAt(data.tokenExpiredDuration);
						localStorage.setItem("access_token", data.accessToken);
						localStorage.setItem("token_expires_at", tokenExpiresAt);
						
						var date = new Date();
						var currentTimeInMillis = date.getTime();
						// determine execution time of calling refresh token: 5
						// mins before current token expires
						var executeAfter = tokenExpiresAt - currentTimeInMillis - 300 * 1000;
						setTimeout(requestNewAccessToken, executeAfter);
						
						date.setTime(currentTimeInMillis + executeAfter); // for
																			// logging
																			// only
						console.log("Set a refreshing token timeout at " + date);
					}
				});
			};
			if (!firstTokenRefreshRequestId) { // hle71
				var date = new Date();
				var currentTimeInMillis = date.getTime();
				// determine execution time of calling refresh token: 5 mins
				// before current token expires
				var executeAfter = tokenExpiresAt - currentTimeInMillis - 300 * 1000;
				firstTokenRefreshRequestId = setTimeout(requestNewAccessToken, executeAfter);
				
				date.setTime(currentTimeInMillis + executeAfter); // for
																	// logging
																	// only
				console.log("Set a refreshing token timeout for the first time visiting a dashboard at " + date);
			} else {
				console.log("Ignore one redundant refreshing token timeout for the first time visiting a dashboard");
			}
		}
	};
	
	CommonUIService.prototype.gotoParentState = function($state, params, options) {
		if ($state == undefined || $state.$current == undefined || $state.$current.parent == undefined) {
			throw new Error("invalid state !");
		}
		if ($state.$current.parent.abstract) {
			$state.go($state.$current.parent.parent.name, params, options);
		} else {
			$state.go('^', params, options);
		}
	};

	CommonUIService.prototype.showNotifyMessage = function(message, status, timeout) {
		timeout = timeout || 6000;
		this.message = message;
		this.status = status;
		$mdToast.show({
			controller: 'MessageCtrl',
			templateUrl: resourceServerPath + 'view/templates/toast-template.html',
			hideDelay: timeout,
			position: 'bottom'
		});
	};
	
	/**
	 * message : String[]
	 */
	CommonUIService.prototype.showNotifyWithMultiMessages = function(message, status, timeout) {
		var self = this;
		timeout = timeout || 6000;
		if (message.length > 0) {
			self.message = message[0];
		}else{
			return;
		}
		self.status = status;
		$mdToast.show({
			controller: 'MessageCtrl',
			templateUrl: resourceServerPath + 'view/templates/toast-template.html',
			hideDelay: timeout,
			position: 'bottom'
		}).then(function (){
			message.splice(0,1);
			self.showNotifyWithMultiMessages(message, status, timeout);
		});
	};

	/**
	 * Show yes/no dialog
	 * 
	 * @param {String}
	 *            message will be translated
	 * @param {function}
	 *            yesHandler function will be called when click YES
	 * @param {function}
	 *            noHandler function will be called when click NO
	 */
	CommonUIService.prototype.showYesNoDialog = function(message, yesHandler, noHandler) {
		var confirm = $mdDialog.confirm()
			.title($translate.instant(message))
			.ok($translate.instant('v4.yesno.enum.Y'))
			.cancel($translate.instant('v4.yesno.enum.N'));
		$mdDialog.show(confirm).then(yesHandler, noHandler);
	};
    
    CommonUIService.prototype.getTimeAgo = function(data) {
		var existingDateList = [
			"YYYY-MM-DDTHH:mm:ssZZ",
			"YYYY-MM-DD hh-mm-ss",
			"YYYY-MM-DD-hh-mm-ss",
			"YYYY-MM-DD",
			"DD-MM-YYYY hh-mm-ss",
			"DD-MM-YYYY-hh-mm-ss",
			"DD-MM-YYYY"
		];
		var result = undefined;
		if (commonService.hasValueNotEmpty(data)) {
			result = moment(data, existingDateList).fromNow();
		}
		return result;
	};
	
	CommonUIService.prototype.convertToDateTime = function(data, format) {
		var existingDateList = [
			"YYYY-MM-DDTHH:mm:ssZZ",
			"YYYY-MM-DD hh-mm-ss",
			"YYYY-MM-DD-hh-mm-ss",
			"YYYY-MM-DD",
			"DD-MM-YYYY hh-mm-ss",
			"DD-MM-YYYY-hh-mm-ss",
			"DD-MM-YYYY"
		];
		var result = undefined;
		if (commonService.hasValueNotEmpty(data) &&
			commonService.hasValueNotEmpty(format)) {
			result = moment(data, existingDateList).format(format);
		}
		return result;
	};
	
	 CommonUIService.prototype.formatDateList=function(list,itemType){
    	var self = this;
    	angular.forEach(list, function(item){
			item[itemType.replace("-","")] = self.convertToDateTime(item[itemType.replace("-","")], "YYYY-MM-DD HH-mm-ss");
			if(item.UpdatedDate == "Invalid date"){
				item.UpdatedDate = "2015-01-01 12-00-00";
			}
		});
		return list;
	};
	
	CommonUIService.prototype.sortList = function(list, sortBy, sortReverse) {
		return $filter('orderBy')(list, sortBy, sortReverse);
	};

	CommonUIService.prototype.toggleStar = function (requestURL, objectMetadata){
		var self = this;
		var deferred = self.$q.defer();
		self.detailCoreService.ListDetailCoreService.prototype.toggleStar.call(self, requestURL, objectMetadata).then(function(metaData){
			deferred.resolve();
		});
		return deferred.promise;
	};

	CommonUIService.prototype.isValidEmailString = function(isSendEmails, strEmails){
		if (isSendEmails != "true"
			&& !self.hasValueNotEmpty(strEmails))
			return true;
		var regex = /([\w\+\-\._]+@[\w\-\._]+\.\w{2,}){1,}([\;]($|[\w\+\-\._]+@[\w\-\._]+\.\w{2,}))*$/;
		return regex.test(strEmails);
	};

	CommonUIService.prototype.showHideItems = function() {
		$('#showMore').fadeToggle('fast');
	};
	
	CommonUIService.prototype.isAbleToDo = function(action, requireNotSubmitted) {
		var self = this;
		if (requireNotSubmitted == undefined || requireNotSubmitted == false) {
			return self.checkActionPermission(self.detail, action);
		}
		return self.checkActionPermission(self.detail, action) && !self.isSubmittedStatus();
	};
	
	// go to specific element
	CommonUIService.prototype.moveToSpecificElement = function(areaName) {
		var classTarget = "." + areaName;
		var currentElement = $(classTarget);
		$('html, body').animate({
				scrollTop: currentElement.position().top
			}, 1000
		);
	};

	CommonUIService.prototype.isValidDate = function(date, formatDate, minDate, maxDate) {
		// date, minDate, maxDate same format
		if (!commonService.hasValueNotEmpty(formatDate)) {
			formatDate = "YYYY-MM-DD";
		}

		var m = new moment(date, formatDate, true);
		if (!m.isValid()) {
			return false;
		}

		if (commonService.hasValueNotEmpty(minDate) && m.isBefore(new Date(minDate)) && date !== minDate) {
			return false;
		} else if (commonService.hasValueNotEmpty(maxDate) && m.isAfter(new Date(maxDate)) && date !== maxDate) {
			return false;
		} else {
			return true;
		}
	};
	
    CommonUIService.prototype.addDate = function(inputMoment, value, key, formatDate) {
		if (!commonService.hasValueNotEmpty(key)) {
			key = 'd';
		}
		if (!commonService.hasValueNotEmpty(formatDate)) {
			formatDate = "YYYY-MM-DD";
		}
		if (value.indexOf('-') !== -1) {
			return inputMoment.subtract(parseInt(value.substr(1)), key).format(formatDate);
		} else {
			return inputMoment.add(parseInt(value), key).format(formatDate);
		}
	};
	
	CommonUIService.prototype.addDateFromNow = function(value, key, formatDate) {
		return this.addDate(moment(), value, key, formatDate);
	};

	CommonUIService.prototype.activeSpiner = function () {
		var spinIcon = "fa fa-spinner fa-spin fa-2x";
		var icon = $(".activate-spiner").find("i.fa");
		if (icon.length > 0) {
			icon.attr('class', spinIcon);
		}
	};

	CommonUIService.prototype.inactiveSpiner = function () {
		var saveIcon = "fa fa-floppy-o fa-2x";
		var icon = $(".activate-spiner").find("i.fa");
		if (icon.length > 0) {
			icon.attr('class', saveIcon);
		}
	};

	/**
	 * Return the current sale channel
	 * 
	 * @return {String} type of sale channel
	 */
	CommonUIService.prototype.getActiveSaleChannel = function getActiveSaleChannel() {
		// see {@code
		// ipos-portlet-common\src\main\webapp\view\myNewWorkspace\main.jsp} for
		// more detail
		var defaulChannel = commonService.CONSTANTS.SALE_CHANNEL.AGENT_SALE;// default
																			// channel
																			// is
																			// agent
																			// sale?
		var result;
		try {
			result = activeChannel;
		} catch(e) {
			// $log.warn(e);
		} finally {
			if (
				result === 'null' // 'null' when navigating pages not support
									// yet by java backend
				|| !result // undefined when navigating pages not support yet
							// by java backend
			) {
				result = defaulChannel;
				$log.debug("Set channel to " + defaulChannel);
			}
		}

		return result;
	};

	/**
	 * Return the current user role
	 * 
	 * @return {String} type of sale channel
	 */
	CommonUIService.prototype.getActiveUserRole = function getActiveUserRole(stateParam) {
		if(stateParam)
			return stateParam.userRole;
		else
			return "GT";
	};

	CommonUIService.prototype.checkValidEmail = function checkValidEmail(data) {
		var errorMessage= "";
		if(data == undefined || data ==""){
			errorMessage = "MSG-C06"
		}else{
			var re = commonService.CONSTANTS.EMAIL.PATTERN;
			if(re.test(data))
				errorMessage = "";
			else
				errorMessage = "MSG-C06"
		}

		return errorMessage;
	};

	return new CommonUIService();
}])
.service('multiUploadService', ['$q', '$sce', 'connectService', 'commonService', 'commonUIService',
	function($q, $sce, connectService, commonService, commonUIService){

	function MultiUploadService() {
		var self = this;
		self.initFile = {desc: "", data: "", validate: "", documentType: ""};
		self.acceptType = "image/*,application/pdf";
		self.files = [];
	}
	
	/**
	 * Nov-17-2016
	 * 
	 * @author dnguyen98 Choose one or more file for send to back end
	 * @param {Object}
	 *            $files list file choosed
	 * @param {String}
	 *            isMultiple check one or more file
	 */
	MultiUploadService.prototype.onFileSelect = function($files, isMultiple) {
		var self = this;
		var maxFileLength = 10;
		var fileReadyToUpload = self.files;
		if (fileReadyToUpload.length < maxFileLength && $files.length < maxFileLength) {
			var file = $files;
			for (var i = 0; i < file.length; i++) {
				if (fileReadyToUpload.map(function (el) {
						return el.name;
					}).indexOf(file[i].name) < 0) { // find the object's index
													// with a specific property
													// (name) - check file name
													// to do not duplicate
					if (file[i].size <= 10485760) {
						getFileReader(file[i], self.initFile).then(function (data) {
							if (data.type.split('/')[0] !== "text" && data.type.split('/')[0] !== "application" && data.type.split('/')[0] !== "image") {
								data.validate = "v3.style.message.sorrySysCurrentlyDoesNotSupportThisFileType";
							}
							if (isMultiple === true) {
								self.files.push(data);
							} else {
								self.files[0] = data;
							}
						});
					} else {
						commonUIService.showNotifyMessage("MSG-024", "fail");
					}
				}
			}
		} else {
			commonUIService.showNotifyMessage("v3.style.message.youCannotAttachManyFileInTheSameTime", "fail");
		}
	};
	
	/**
	 * Nov-17-2016
	 * 
	 * @author dnguyen98 Parse file to String and push to a template object
	 * @param {Object}
	 *            file file to parse
	 * @param {Object}
	 *            initFile template object to contain file
	 * @return defer
	 */
	function getFileReader(file, initFile) {
		var deferred = $q.defer();
		var reader = new FileReader();
		reader.onload = (function (file) {
			return function (e) {
				var f = file;
				angular.extend(f, initFile);
				f.desc = file.name;
				f.data = e.target.result;
				deferred.resolve(f);
			};
		})(file);
		reader.readAsDataURL(file);
		return deferred.promise;
	}

	/**
	 * Nov-17-2016
	 * 
	 * @author dnguyen98 Parse file to String and push to a template object
	 * @param {Object}
	 *            fileList list file to validate
	 * @return Boolean
	 */
	MultiUploadService.prototype.isFileListValid = function(fileList) {
		var isValid = true;
		for (var i = 0; i < fileList.length && isValid === true; i++) {
			if (commonService.hasValueNotEmpty(fileList[i].validate)) {
				isValid = false;
			}
		}
		return isValid;
	};

	
	return new MultiUploadService();
}])
.service('resourceReaderService', ['$log', '$q', "$http", '$window', '$sce', 'commonService', 'commonUIService', 'detailCoreService', 'connectService',
	function($log, $q, $http, $window, $sce, commonService, commonUIService, detailCoreService, connectService){
	
	function ResourceReaderService() {
		var self = this;
		angular.extend(self, detailCoreService.IposDocService.prototype);
		self.init();
	}
	
	/**
	 * Nov-17-2016
	 * 
	 * @author dnguyen98 Init variables for this service
	 */
	ResourceReaderService.prototype.init = function() {
		var self = this;
		self.isReader = false; // for show view file
		self.content = "";	// for show file with content type is
							// application/pdf
		self.source = "";	// for show file with content type is image/jpeg
		self.detailFile = undefined;	// for detail of a file
		self.isSafari = false;
		self.templateFile = {
			fileName: undefined,
			fileSize: undefined,
			dateCreated: undefined,
			createdBy: undefined,
			templatePDF: undefined,
			printDoctype: undefined,
			product: undefined,
			pdfStream: undefined
		};	// template a file to show on UI
		self.indexFile = undefined;	// No. of a file in list
		self.isDetail = false;	// for show detail of a file on UI
		self.isSigned = false;	// file whether is signed or not
	};
	
	/**
	 * Nov-17-2016
	 * 
	 * @author dnguyen98 Upload a file and save it in system
	 * @param {Object}
	 *            resource object file
	 * @param {String}
	 *            mode view or download mode
	 * @param {Boolean}
	 *            isSigned whether file is signed or not
	 */
	ResourceReaderService.prototype.openFileReader = function(resource, mode, isSigned,isGenerateReport) {
		var self = this;
		var item = {
				fileName:"",
				content:"",
				fileSize:"",
				createdDate:"",
				fileType:""	
		};
		if (mode !== 'download') {
			self.isReader = true;
		}
		if(isGenerateReport){
			resource.content = atob(resource.content)
		}
		
		if(isSigned == true ){
			item.fileName = self.findElementInElement(resource, ['fileName']);
			
		}else{
			if(self.findElementInElement(resource, ['fileName', 'value'])){
				item.fileName = self.findElementInElement(resource, ['fileName', 'value']);
				item.fileSize = self.findElementInElement(resource, ['fileSize','value']);
				item.createdDate = self.findElementInElement(resource, ['createdDate','value']);
			}else{
				item.fileName = self.findElementInElement(resource, ['documentName']);
				item.fileSize = self.findElementInElement(resource, ['systemInformation','contentSize']);
				item.createdDate = self.findElementInElement(resource, ['systemInformation','createdDate']);
			}
		}
		
		var fileName = self.findElementInElement(resource, ['fileName', 'value']) || self.findElementInElement(resource, ['documentName']);
		var fileData = self.findElementInElement(resource, ['content']);
		var fileType = (resource.businessInformation) ? resource.businessInformation.attachmentType.toLowerCase() : item.fileName.substr((item.fileName.lastIndexOf('.') + 1)).toLowerCase();
		console.log("File Name: " + fileName + " - File Type: " + fileType);
		item.content = self.findElementInElement(resource, ['content']);
		item.fileType = (resource.businessInformation) ? resource.businessInformation.attachmentType.toLowerCase() : item.fileName.substr((item.fileName.lastIndexOf('.') + 1)).toLowerCase();
		var contentType = setContentType(fileType);
		var arrayData = parseBase64ToByteArray(fileData);
		self.file = new Blob([arrayData], { type: contentType });
		self.fileUrl = URL.createObjectURL(self.file);
		self.detailFile = item;
		self.isSigned = isSigned;
		if (fileType === "jpg" || fileType === "pdf" || fileType === "png" || fileType === "jpeg" || fileType === "txt" || mode === "download") {
			if (mode === "view") {
				if (fileType === "pdf") {
					if (detectMobileAndTablet()) {
						self.isReader = true;
						self.isSafari = true;
						setTimeout(function() {
							self.renderPDF($sce.trustAsResourceUrl(self.fileUrl));
						}, 1000)
					}
					self.source = "";
					self.content = $sce.trustAsResourceUrl(self.fileUrl);

				} else {
					self.content = "";
					self.source = $sce.trustAsResourceUrl(self.fileUrl);
				}
			} else {
				self.download(item.fileName);
			}
		} else {
			// Mode is view but Reader can not support this file type.
			self.fileNotFoundMessage = "v3.style.message.sorrySysCurrentlyDoesNotSupportThisFileType";
			self.isReader = false;
			self.download(item.fileName);
		}
	};
	
	function detectMobileAndTablet() {
		if(navigator.userAgent.match(/Android/i)
				 || navigator.userAgent.match(/webOS/i)
				 || navigator.userAgent.match(/iPhone/i)
				 || navigator.userAgent.match(/iPad/i)
				 || navigator.userAgent.match(/iPod/i)
				 || navigator.userAgent.match(/BlackBerry/i)
				 || navigator.userAgent.match(/Windows Phone/i)) {
			return true;
		} else {
			return false;
		}
	}
	
	ResourceReaderService.prototype.renderPDF = function(url) {
		var pdfjsLib = window['pdfjs-dist/build/pdf'];
		pdfjsLib.GlobalWorkerOptions.workerSrc = resourceServerPath + 'lib/pdfjs-viewer/pdf.worker.js';
		
		console.log(pdfjsViewer);
		var viewerContainer = document.getElementById('pageContainer');

		var SCALE = 1.0;
		
		var params = {
				url: url
		}
		
		var renderPages = function(pdfDoc) {
			
			var viewer = new pdfjsViewer.PDFViewer({
				container: viewerContainer,
				l10n: pdfjsViewer.NullL10n,
				useOnlyCssZoom: false,
				textLayerMode: 1
			});
			
			viewer.setDocument(pdfDoc);
			
			/*
			 * pdfDoc.getPage(PAGE_TO_VIEW).then(function (pdfPage) { var
			 * pdfPageView = new pdfjsViewer.PDFPageView({ container: container,
			 * id: PAGE_TO_VIEW, scale: SCALE, defaultViewport:
			 * pdfPage.getViewport(SCALE), // We can enable text/annotations
			 * layers, if needed textLayerFactory: new
			 * pdfjsViewer.DefaultTextLayerFactory(), annotationLayerFactory:
			 * new pdfjsViewer.DefaultAnnotationLayerFactory(), });
			 * 
			 * pdfPageView.setPdfPage(pdfPage);
			 * 
			 * console.log(pdfPageView.draw()); });
			 */			
			
		}
		
		pdfjsLib.getDocument(params).then(function(pdfDocument) {
			renderPages(pdfDocument);
		});
		
	}
	
	/**
	 * June-20-2017 Generate pdf by system
	 * 
	 * @author hle56
	 * @param {String}
	 *            requestURL for call runtime
	 * @param {Object}
	 *            dataSet json data to send to Runtime
	 * @param {String}
	 *            tempalateName config template will show on UI
	 * @return {Object} That is resource model.
	 */
	ResourceReaderService.prototype.generatePDF = function generatePDF(requestURL, dataSet, tempalateName){
		var self = this;
		var deferred = $q.defer();
		self.isReader = true;
        this.pdfPayload = dataSet;
        var lang = localStorage.getItem('system_language');
        
		connectService.exeAction({
			actionName: 'PRINT_PDF',
			actionParams: { templateName: tempalateName, lang: lang},
			requestURL: requestURL,
			data: dataSet
		}).then(function(resource){
			self.openFileReader(resource, 'view');
			deferred.resolve(data);
		});
		return deferred.promise;
	};


	/**
	 * Nov-17-2016
	 * 
	 * @author dnguyen98 Check type of file to set content type
	 * @param {Object}
	 *            fileType type of file
	 * @return {String} contentType
	 */
	function setContentType(fileType) {
		var contentType;
		if (fileType === 'pdf') {
			contentType = "application/pdf";
		} else if (fileType === 'jpg' || fileType === 'jpeg' || fileType === 'png') {
			contentType = "image/jpeg";
		} else if (fileType === 'doc') {
			contentType = "application/msword";
		} else if (fileType === 'txt') {
			contentType = "application/text";
		}
		return contentType;
	}
	
	/**
	 * Nov-17-2016
	 * 
	 * @author dnguyen98 Parse Base64 data to Byte Array
	 * @param {String}
	 *            base64 value data with string type
	 * @return {Uint8Array} array
	 */
	function parseBase64ToByteArray(base64){
		var binary = atob(base64);
		var array = [];
		for(var i = 0; i < binary.length; i++) {
			array.push(binary.charCodeAt(i));
		}
		return new Uint8Array(array);
	}
	
	/**
	 * Convert ByteArray PDF files to Base64 format.
	 * 
	 * @author mle29
	 */
	ResourceReaderService.prototype.convertByteArrayToBase64 = function(byteArrayData) {
		var binary = '';
		var bytes = new Uint8Array( byteArrayData );
		var len = bytes.byteLength;
		for (var i = 0; i < len; i++) {
			binary += String.fromCharCode( bytes[ i ] );
		}
		var base64Data = $window.btoa(binary);

		return base64Data;
	};
	
	/**
	 * Nov-17-2016
	 * 
	 * @author dnguyen98 Hide reader view file
	 */
	ResourceReaderService.prototype.closeFileReader = function(){
		var self = this;
		URL.revokeObjectURL(self.file);
		self.init();
	};
	
	/**
	 * Nov-30-2017
	 * 
	 * @author tnguyen492 Sign Document
	 */
	ResourceReaderService.prototype.signDocument = function(requestURL, caseId, dataSet){
        var self = this;
        var lang = localStorage.getItem('system_language');
        var deferred = $q.defer();
        connectService.exeAction({
            actionName: "SIGN_DOCUMENT",
            actionParams: {
                templateName: self.detailFile.attachment.refBusinessType.value,
				caseId: caseId,
				lang: lang
			},
            requestURL: requestURL,
            data: dataSet
        }).then(function(esignRef){
            window.open(esignRef.esignUrl, "_self");
            deferred.resolve();
        });
        return deferred.promise;
	};

	/**
	 * Nov-17-2016
	 * 
	 * @author dnguyen98 Download file to local
	 */
	ResourceReaderService.prototype.download = function(){
		var self = this;
		var anchor = document.createElement("a");
		anchor.href = self.fileUrl;
		anchor.download =  self.detailFile.fileName;
		anchor.click();
	};

	/**
	 * Nov-17-2016
	 * 
	 * @author dnguyen98 chech show or hide detail
	 */
	ResourceReaderService.prototype.showFileDetail = function(){
		this.isDetail ? this.isDetail = false : this.isDetail = true;
	};
	
	return new ResourceReaderService();
	
}])
.service('pingService', ['ajax', '$log', function(ajax, $log){
	/**
	 * This service is intended to ping server every 10mins to keep session
	 * alive all the time if still opening from browser
	 * 
	 * @param $http
	 * @param $log
	 */
	function PingService(ajax, $log){
		var self = this;
		self.DURATION = 300000; // 1000*60*5 (5mins)
		self.ajax = ajax;
		self.$log = $log;
		self.interval = undefined;
		self.ping = function(){
			if(sessionTimeout == -1){ // keep session active
				ajax.get('ping').success(function(data) {
					$log.debug("****** ping ******");
				});
			}else{
				clearInterval(self.interval);
			}
		};
		self.init = function(){
			self.interval = setInterval(function(){
				self.ping();
			}, self.DURATION);
		};
	};
	
	return new PingService(ajax, $log);
	
}])
.service('notificationFromServer', ['$log', '$translate', function($log, $translate){
	var notification= this;
	notification.events = {
			"GO_TO_HOME_PAGE":function(data){
				var defaultLandingPage = localStorage.getItem("defaultLandingPage");
				if(defaultLandingPage){
					defaultLandingPage = '/web/integral/home';
				}
				window.location.href= defaultLandingPage;
			},
			"SESSION_DESTROY":function(data){
	    		if(notification.isOpen()){
	    			var msg=$translate.instant('v3.errorinformation.message.alert.sessionexpired');
	    			window.localStorage.setItem('logoutCause',msg);
	    		}    		
	    		notification.doSignOut();
	    	},
	    	"FORCE_LOGIN":function(data){
	    		if(notification.isOpen()){
	    			var msg=$translate.instant('v3.errorinformation.message.alert.signinanother');
	    			window.localStorage.setItem('logoutCause',msg);
	    		}    		
	    		notification.doSignOut();
	    	},
	    	"INVALID_USER":function(data){
				notification.doSignOut();
	    	}			
	}
		
	notification.addEvent = function(eventName,action){
		notification.events[eventName] = action;
	}
	
	notification.init=function(channel){
		var resolve = null;
		var reject = null;
		return new Promise(function (resolve, reject) {	
        	if(!window.notificationSocket){		
    			try{
    				var protocol = window.location.protocol === 'http:' ? 'ws://' : 'wss://';
    				var wsUrl = protocol + location.host + '/ipos-portal-hook/notification-endpoint/'+channel;
    				window.notificationSocket = new WebSocket(wsUrl);			
    			}catch (e) {
    				reject();
    			}			
    			notificationSocket.onopen = function() {
    				$log.debug("Sessions EndPoint Opened");
    				resolve();
    			}
    			window.notificationSocket.onclose = function() {
    				$log.debug("Sessions EndPoint Closed");
    				notification.close();
    			}
    			window.notificationSocket.onerror = function(evt) {
    				$log.error("Sessions EndPoint error occurred: " + evt.data);
    				reject();
    			}			
    			window.onbeforeunload = function(event) {
    				$log.debug("Sessions EndPoint window onbeforeunload");
    				window.notificationSocket = undefined;
    				notification.close();
    			};
    			window.notificationSocket.onmessage = function(evt) {
    				$log.debug("Sessions EndPoint was received:" + evt.data);
    				if(notification.isOpen()){
    					var jsonData = JSON.parse(evt.data);
    					var eventName = jsonData.event;
    					var actionData = jsonData.data;
    					var action = notification.events[eventName];
    					if (action && typeof(action) === "function") {
    						action.call(actionData);
    					}
    				}else{
    					$log.debug("notificationSocket have been closed." );
    				}
    			};
    		}else{
    			resolve();
    		}
        });
	}
	
	notification.send=function(event,data){
		var message = {
				event:event,
				data:data
		}		
		window.notificationSocket.send(JSON.stringify(message));
	}
	
	notification.isOpen = function(){
		return window.notificationSocket && window.notificationSocket.readyState===WebSocket.OPEN;
	};
	
	notification.close = function(){
		if(notification.isOpen()){
			window.notificationSocket.close();
		}
		window.notificationSocket = undefined;
	}
	
	
	
}])
.service('translateService', ['$translate', '$q', function($translate, $q){
	/**
	 * This service is using for translate message with params Based on
	 * angular.translate service
	 * 
	 * @param $http
	 * @param $log
	 */
	function TranslateService($translate, $q) {
		var self = this;
		self.currentLanguageCode = 'en.translation';

		/**
		 * add parameters to result
		 */
		self.addParasToResult = function (result, params) {
			if (params) {
				for (var i = params.length - 1; i >= 0; i--) {
					result = result.replace("{" + i + "}", params[i]);
				}
				;
				return result;
			}
			else return result;
		};

		self.prepareData = function (key, params) {
			var obj = undefined;
			params = key.split(";");
			// with params
			if (params.length > 1) {
				key = params.shift();
			}
			// without params
			else {
				params = undefined;
			}
			obj = {key: key, params: params};
			return obj;
		};

		/**
		 * Translate synchronous, don't return promise
		 * 
		 * @param {String}
		 *            key message to translate
		 * @param {String}
		 *            prefix i18n prefix
		 * @return {String} Translated string
		 */
		self.instant = function instant(key, prefix) {
			var params = undefined;
			var data = this.prepareData(key, params);
			if (prefix)
				data.key = prefix + '.' + data.key;

			var result = $translate.instant(data.key);

			result = this.addParasToResult(result, data.params);

			return result;
		};

		/**
		 * Translate aynchronous, return promise
		 * 
		 * @param {String}
		 *            key message to translate
		 * @param {String}
		 *            prefix i18n prefix
		 * @return {Object} Angular promise
		 */
		self.translate = function translate(key, prefix) {
			var self = this;
			var deferred = $q.defer();
			var params = undefined;

			var data = self.prepareData(key, params);
			if (prefix)
				data.key = prefix + '.' + data.key;

			var result = $translate(data.key).then(
				function hadResult(translatedText) {
					translatedText = self.addParasToResult(translatedText, data.params);
					deferred.resolve(translatedText);
				}
			);

			return deferred.promise;
		};

	}
	
	return new TranslateService($translate, $q);
	
}])
// //////////////////////////////////////////////////
// Provides information about the current platform //
// //////////////////////////////////////////////////
.service('platformService', ['$document', '$q', '$log', 'commonService',
function($document, $q, $log, commonService) {

    var defaultPlatform = commonService.CONSTANTS.PLATFORM.WEB; // default is
																// web browser

    function PlatformService(){
        this.name = "platformService";
        this.browserVersion;
        this.platformId;
    }

    /**
	 * return browser name & version TODO: tested on Chrome only
	 * 
	 * @return {Object} name {string} browser name (Chrome, Firefox,...) version
	 *         {string} browser version
	 */
    PlatformService.prototype.getBrowserVersion = function getBrowserVersion() {

        if(this.browserVersion)
            return this.browserVersion;

        var ua = navigator.userAgent, tem,
        M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];

        // M[0]: "Chrome/43"
        // M[1]: "Chrome"
        // M[2]: "43"
        // index: 75
        // input: "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36
		// (KHTML, like Gecko) Chrome/43.0.2357.124 Safari/537.36"
        // length: 3
        if (/trident/i.test(M[1])){
            tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
            return 'IE '+ (tem[1] || '');
        }
        else if (M[1] === 'Chrome'){
            tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
            if (tem!= null) 
                return tem.slice(1).join(' ').replace('OPR', 'Opera');
        }

        M = M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
        if ((tem= ua.match(/version\/(\d+)/i)) != null) 
            M.splice(1, 1, tem[1]);
        // return M.join(' ');
        
        this.browserVersion = {
            name: M[0],
            version: M[1]
        };
        return this.browserVersion;
    };

    /**
	 * Return the current platform Id
	 * 
	 * @return {Object} Angular promise
	 */
    PlatformService.prototype.getPlatformId = function getPlatformId() {
    	var self = this;
        var defer = $q.defer();
        var resolved = false;
        var result = defaultPlatform;

        if (self.platformId){
        	defer.resolve(self.platformId);
        } 
        // mobile platform
        else if(window.cordova){                
            document.addEventListener('deviceready', function() {
                resolved = true;
                defer.resolve(window.cordova.platformId);
            });

            // Check to make sure we didn't miss the
            // event (just in case)
            setTimeout(function() {
                if (!resolved) {
                    if (window.cordova)
                        defer.resolve(window.cordova.platformId);
                }
            }, 3000);

        }else{
            var browserInfo = self.getBrowserVersion();
            $log.debug("Browser information:" + JSON.stringify(browserInfo));
            result = commonService.CONSTANTS.PLATFORM.WEB;
            defer.resolve(result);
        }

        return defer.promise;
    }
    return new PlatformService();
}])


/*
 * ##################################################################
 * UiFramework Service:
 * ###################################################################
 */
/**
 * @author nle32
 */
.service('uiFrameworkService', ['loadingBarService', 'commonService', 'uiRenderPrototypeService', 'commonUIService', '$compile', '$timeout', '$state', '$log', '$filter', '$location',
	function(loadingBarService, commonService, uiRenderPrototypeService, commonUIService, $compile, $timeout, $state, $log, $filter, $location){
	function UiFrameworkService(){
		this.listCardHistory;
		// init variables for render cards on screen
		this.isOpenedDetail = false;
		this.isFirstTimeOpen = false;
		
		// init the current index of tab (ui tab style)
		this.currentTabIndex = undefined;
	}
	
	// This function help us move to next step in section layout
	UiFrameworkService.prototype.moveToNextStep = function moveToNextStep(uiStructure, initStep){

		// This function use to identify suitable step to redirect user base on
		// the detail of case-management
		// Note:
		// - We MUST add more logic base on the requirement to make work
		// correctly
		// - Because of application performance, this function should do all
		// decision base on case-management,
		// if we need information from other doctype, system must perform some
		// additional request to server

		if(uiStructure && !this.isFirstTimeOpen){
			var moduleService = uiRenderPrototypeService.getUiService(uiStructure.parent.getRefDocTypeOfRoot());
			commonService.listStep = uiStructure.parent.children;
			var currentStep = initStep;
			var nextStep = this.findNextVisibleStep(currentStep + 1, true);
			var previousStep = null;
			if (currentStep > 0) {
				previousStep = commonService.listStep[currentStep - 1];
			}

			commonService.previousButton = this.getStepButtonKey(previousStep);
			commonService.currentStep = currentStep;
			commonService.nextButton = this.getStepButtonKey(nextStep);

			this.isFirstTimeOpen = true;
			this.clickToOpenCard(commonService.listStep[currentStep]);
		}

		// When case is already open and user navigate between step
		if(!uiStructure && commonService.listStep){
			var previousStep = commonService.currentStep;
			var currentStep = this.findNextVisibleStep(previousStep + 1, true);
			var nextStep = this.findNextVisibleStep(currentStep + 1, true);
			commonService.previousButton = this.getStepButtonKey(previousStep);
			commonService.currentStep = currentStep;
			commonService.nextButton = this.getStepButtonKey(nextStep);


			var nextStepUIStructure = commonService.listStep[currentStep];
			this.clickToOpenCard(nextStepUIStructure);
		}
	};

	// This function help us move to previous step in section layout
	UiFrameworkService.prototype.moveToPreviousStep = function moveToPreviousStep (uiStructure){
		if(!uiStructure && commonService.listStep){// open other step when
													// click
			var nextStep = commonService.currentStep;
			var currentStep = this.findNextVisibleStep(nextStep - 1, false);
			var previousStep = this.findNextVisibleStep(currentStep - 1, false);
			var previousStepUIStructure = commonService.listStep[currentStep];

			commonService.nextButton = this.getStepButtonKey(nextStep);
			commonService.currentStep = currentStep;
			commonService.previousButton = this.getStepButtonKey(previousStep);
			this.clickToOpenCard(previousStepUIStructure);
		}
	};
	
	// This function use to get key on button of a step
	UiFrameworkService.prototype.getStepButtonKey = function getButtonKey(index) {
		if (index!=null && index < commonService.listStep.length && index > -1) {
			var stepAction = commonService.listStep[index].stepAction;
			if (stepAction) {
				return stepAction;
			} else {
				return commonService.listStep[index].name;
			}
		} else {
			return "";
		}
	};
	
	// Simulate the click action on a card
	// This is use in section layout when normal click is disable on stepCard
	UiFrameworkService.prototype.clickToOpenCard = function clickToOpenCard(uiStructure){
		if(uiStructure){
			setTimeout(function(){
				if(uiStructure.html){
					uiStructure.html.triggerHandler('click');
			 }
			}, 0);
		}
	};

	// This function is use to find next visible step (because we can help some
	// step, but it is set to invisible at current time)
	UiFrameworkService.prototype.findNextVisibleStep = function findNextVisibleStep(index, moveForward) {
		if (moveForward) {
			for(var i = index; i < commonService.listStep.length; i++){
				if(commonService.listStep[i].isVisible == true){
					return i;
				}
			}
		} else {
			for(var i = index; i > -1; i--){
				if(commonService.listStep[i].isVisible == true){
					return i;
				}
			}
		}
		return null;
	};
	
/*
 * this method is replaced by the method which has the same name at customize
 * for the new ui framework section @date: 2018 May 18
 */
	UiFrameworkService.prototype.chooseCard = function chooseCard(card, selectLevel, selectIndex, event, scope, requestURL) {
		var self = this;
		loadingBarService.showLoadingBar();
		// toggle class for summary
		if (commonService.options.cardTouchMode) {
			if (card.cardStatus !== "detail") {
				return;
			}
		}

		var viewProp = scope.viewProp;
		var viewObj = scope.viewProp.viewObject;
		var historySelect = scope.viewProp.historySelect;
		this.listCardHistory = [];
		var lastHistorySelect = historySelect.lastObj();

		self.checkClosingCard(card, selectLevel, scope).then(function checkedCloseCard (result) {
			if(result !== 'stop'){
				uiRenderPrototypeService.getChildContentOfUiStructure(viewObj[selectLevel][selectIndex], requestURL)
				.then(function gotNextUiObj (result) {

					// "result" will be "undefined" if clicking on an action
					// which will executing a function
					if(result){
						// show loading bar when render ui
						 loadingBarService.showLoadingBar();
						 
						var refDocType = viewObj[selectLevel][selectIndex].getRefDocTypeInDetail();
						var refBusinessType = viewObj[selectLevel][selectIndex].getBusinessTypeInDetail();
						var refProductName = viewObj[selectLevel][selectIndex].getProductNameInDetail();

						if(
							viewObj[selectLevel][selectIndex].children.length !== 0 // if
																					// there
																					// are
																					// any
																					// children
																					// or
																					// uiEle,
																					// won't
																					// load
																					// other
																					// doctypes
							|| viewObj[selectLevel][selectIndex].uiEle.length !== 0// because
																					// we
																					// priority
																					// jsonMock
																					// declaration
							// (Eg: in FNA, Client & Joint Applicant will open
							// views of FNA document, not open prospect doctype
							){
							refDocType = undefined;
							refBusinessType = undefined;
							refProductName = undefined;
						}

						var uiEles = undefined;

						// there will be new cards
						if(uiRenderPrototypeService.isUiStructureObj(result[0])){
							self.isOpenedDetail = false;
							 viewObj[selectLevel + 1] = result;
						}
						// static HTML or HTML form
						else{
							self.isOpenedDetail = true;
							uiEles = result;
						}
						self.updateHistorySelectObj(selectLevel, selectIndex, scope);
// self.setupActionBar(viewObj[selectLevel][selectIndex].getAssociateUiService().name,
// undefined, scope);
						// divide name of action bar follow name of module
						// service
						// self.setupActionBar(viewObj[selectLevel][selectIndex].getAssociateUiService().actionBar,
						// undefined, scope);

						if (self.isSectionLayout(viewProp)) {
							// need time out here to wait for the animation of
							// scrollTop on close completed
							$timeout(function() {
								var scrollAmount = self.calculateScrollAmountOnOpen(selectLevel, event.currentTarget, historySelect,viewProp);
								self.scrollTop(scrollAmount);
							}, 700);

							self.renderNewSectionRow(event, selectLevel + 1, selectIndex, refDocType, uiEles, scope);
						} else {
							// need time out here to wait for the animation of
							// scrollTop on close completed
							$timeout(function() {
								self.scrollAmount = self.calculateScrollAmountOnOpen(selectLevel, event.currentTarget, historySelect, viewProp);
								self.scrollTop(self.scrollAmount, 200);
							}, 400);
							self.renderNewCardsRow(event, selectLevel + 1, refDocType, uiEles, scope, refBusinessType, refProductName);
						}

					}else{
						// remove last historySelect ele when cardType is
						// 'action'
						// cause when click on this card again nothing will
						// happen
						// historySelect.pop();
					}
					loadingBarService.hideLoadingBar();
				});

			}
			else {
				loadingBarService.hideLoadingBar();
			}
		});
	};
	
	// /////////////////////////// CUSTOMIZE FOR NEW UI FRAMEWORK
	// /////////////////////////////////////////
	UiFrameworkService.prototype.chooseGroupSection = function chooseGroupSection(card, selectLevel, selectIndex, childrenIndex, event, scope, requestURL) {
		var self = this;
		loadingBarService.showLoadingBar();
		// toggle class for summary
		if (commonService.options.cardTouchMode) {
			if (card.cardStatus !== "detail") {
				return;
			}
		}

		var viewProp = scope.viewProp;
		var viewObj = scope.viewProp.viewObject;
		var historySelect = scope.viewProp.historySelect;
		this.listCardHistory = [];
		var lastHistorySelect = historySelect.lastObj();
		
		// test
		var viewObjAtChild = viewObj[selectLevel][selectIndex].children[childrenIndex];
		// end

		self.checkClosingSectionInGroup(card, selectLevel, childrenIndex, scope).then(function checkedCloseCard (result) {
			if(result !== 'stop'){
				uiRenderPrototypeService.getChildContentOfUiStructure(viewObjAtChild, requestURL)
				.then(function gotNextUiObj (result) {

					// "result" will be "undefined" if clicking on an action
					// which will executing a function
					if(result){
						// show loading bar when render ui
						 loadingBarService.showLoadingBar();
						 
						var refDocType = viewObjAtChild.getRefDocTypeInDetail();
						var refBusinessType = viewObjAtChild.getBusinessTypeInDetail();
						var refProductName = viewObjAtChild.getProductNameInDetail();

						if(
								viewObjAtChild.children.length !== 0 // if
																		// there
																		// are
																		// any
																		// children
																		// or
																		// uiEle,
																		// won't
																		// load
																		// other
																		// doctypes
							|| viewObjAtChild.uiEle.length !== 0// because we
																// priority
																// jsonMock
																// declaration
							// (Eg: in FNA, Client & Joint Applicant will open
							// views of FNA document, not open prospect doctype
							){
							refDocType = undefined;
							refBusinessType = undefined;
							refProductName = undefined;
						}

						var uiEles = undefined;

						// there will be new cards
						if(uiRenderPrototypeService.isUiStructureObj(result[0])){
							self.isOpenedDetail = false;
							 viewObj[selectLevel + 1] = result;
						}
						// static HTML or HTML form
						else{
							self.isOpenedDetail = true;
							uiEles = result;
						}
						self.updateHistorySelectObj(selectLevel, selectIndex, scope);

						$timeout(function() {
							self.scrollAmount = self.calculateScrollAmountOnOpen(selectLevel, event.currentTarget, historySelect, viewProp);
							self.scrollTop(self.scrollAmount, 200);
						}, 400);
						
						// set ui style of card
						self.setUiStyleForChildrensOfCard(selectLevel, card, viewProp);
						
						self.renderNewSectionsRowAndOnpenOnlyOneAtTime(card, event, selectLevel + 1, selectIndex, refDocType, uiEles, scope, refBusinessType, refProductName);
						
						// reset isLastSelected to false and set isLastSelected
						// flag to true at childrenIndex index to know it's last
						// child card which is selected
						for(var i = 0; i < historySelect[selectLevel].refUiStructure.children.length; i++) {
							if(i == childrenIndex) {
								historySelect[selectLevel].refUiStructure.children[i].isLastSelected = true;
							} else {
								historySelect[selectLevel].refUiStructure.children[i].isLastSelected = false;
							}
						}
					}else{
						// remove last historySelect ele when cardType is
						// 'action'
						// cause when click on this card again nothing will
						// happen
						// historySelect.pop();
					}
					loadingBarService.hideLoadingBar();
				});

			}
			else {
				loadingBarService.hideLoadingBar();
			}
		});
	};
	
	
	UiFrameworkService.prototype.checkClosingSectionInGroup = function checkClosingSectionInGroup(willOpenCard, willOpenLevel, childrenIndex, scope) {
		var self = this;
		var historySelect = scope.viewProp.historySelect;
		// var message = 'Choose YES if you want to save the current content
		// before opening document. If NO, the new content will be reset.'
		var defer = scope.moduleService.$q.defer();

		function checkNeedToSaveDetail(oldScope, openingCard) {
			// openingCard: card is opening on screen, which we're going to
			// close it
			// willOpenCard: card which will be opened
			var defer = scope.moduleService.$q.defer();

			// store new isDetailChanged to local storage
			if (openingCard) {
				uiRenderPrototypeService.updateShellUiStructureToStorage(openingCard.root);
			}

			if (// Check allow auto save
				self.isAllowNavAutoSave() &&

				(
					// if root is different --> it's a different documents
					// or willOpenCard will open other doctype, need to check
					// for saving detail
					(openingCard && openingCard.root !== willOpenCard.root && openingCard.root.refDetail.id !== willOpenCard.root.refDetail.id) ||

					// if user wants to open new doctype, need to save the old
					// one
					willOpenCard.getRefDocTypeInDetail()
				) &&

				// check dirty change
				!oldScope.moduleService.compareData(oldScope.moduleService.detail, oldScope.moduleService.originalDetail)) {

				var oldDocType = oldScope.moduleService.name;
				var currUiService = uiRenderPrototypeService.getUiService(oldDocType);
				if (currUiService) {
					var saveDetailAdditionalParams = {
						bUpdateLocationSearch: true,
						locationParams: {
							locationDocType: $state.params.docType,
							locationService: $location
						}
					};
					UiFrameworkService.prototype.saveDetailNotCompute.call(oldScope, currUiService, saveDetailAdditionalParams).then(function () {
						commonUIService.showNotifyMessage('v4.' + scope.getCorrectDoctype(currUiService) + '.message.autoSaveSuccessfully', "success", 3000);
						defer.resolve();
					}, function () {
						commonUIService.showNotifyMessage('v4.' + scope.getCorrectDoctype(currUiService) + '.message.autoSaveUnsuccessfully', "unsuccessful", 3000);
						defer.reject();
					});
				} else {
					$log.error("Can't get uiService of doctype: " + oldDocType);
					defer.resolve();
				}
			} else {
				defer.resolve();
			}

			return defer.promise;
		}

		var lastSelectedInfo = historySelect.lastObj();
		var currCardDocType = scope.moduleService.name;
		var willOpenCardDocType = willOpenCard.getRefDocTypeInDetail();
		if (!commonService.hasValueNotEmpty(willOpenCardDocType)) {
			if (willOpenCard.scope &&
				willOpenCard.scope.moduleService) {
				willOpenCardDocType = willOpenCard.scope.moduleService.name;
			}
		}
		if (lastSelectedInfo) {
			var currCardUiStructure = lastSelectedInfo.refUiStructure;
			if (currCardUiStructure &&
				currCardUiStructure.refDetail &&
				currCardUiStructure.refDetail.refType) {
				currCardDocType = currCardUiStructure.refDetail.refType.value;
			}
		}
		if (currCardDocType !== willOpenCardDocType || lastSelectedInfo) {
			var oldScope = scope;
			var lastSelectedCard, linkCUiStructure;
			if (lastSelectedInfo) {
				lastSelectedCard = lastSelectedInfo.refUiStructure;
				// if lastSelectedInfo has linkChildUiStructure, it need to be
				// it
				linkCUiStructure = uiRenderPrototypeService.getLinkChildUiStructure(lastSelectedCard);
				lastSelectedCard = linkCUiStructure ? linkCUiStructure : lastSelectedCard;
				// we need oldScope, so in saveDetailNotCompute() can get the
				// parents uiStructure for autosave
				var lastSelectedCardScope = lastSelectedCard.getCurrentAngularScope();
				if (lastSelectedCardScope) {
					oldScope = lastSelectedCardScope;
				}
			}

			checkNeedToSaveDetail(oldScope, lastSelectedCard).then(function () {
				// if close an opening card
				if (historySelect[willOpenLevel]) {
					var selectedParentCard = historySelect[willOpenLevel].refUiStructure;
					
					// var selectedCard =
					// historySelect[willOpenLevel].refUiStructure.children[childrenIndex];
					
					// close child of opening card
					self.closeChildCards(willOpenLevel, scope);
					if (commonService.options.cardTouchMode) {
						willOpenCard.cardStatus = "start";
					}
					
					var selectedCard = undefined;
					if(selectedParentCard.children.includes(willOpenCard)) {
						console.log("include me.....");
						// check child card whether is the last selected or not
						// var arrSelectedChildCards =
						// selectedParentCard.children.filter(item =>
						// item.isLastSelected == true);

						var arrSelectedChildCards = [];
						for(var i = 0; i < selectedParentCard.children.length; i++) {
							if(selectedParentCard.children[i].isLastSelected == true) {
								arrSelectedChildCards.push(selectedParentCard.children[i]);
							}
						}
						if(arrSelectedChildCards.length == 1) {
							selectedCard = arrSelectedChildCards[0];
							selectedCard.isLastSelected = false;
							console.log('>>> reset isLastSelected');
						} else {
							console.log('>>> error here, length mus is 1---' + arrSelectedChildCards.length);
						}
					}
					// unselected card after close card, so check isSelected to
					// false
					// selectedCard.isSelected = false;

					// if click on an opened card, simple close its children and
					// do no more
					if (selectedCard === willOpenCard) {
						defer.resolve('stop');
					} else {
						// delay wait for last open row is remove completely
						$timeout(function () {
							defer.resolve();
						}, 200);
					}
				} else
					defer.resolve();
			});
		} else
			 defer.resolve();

		return defer.promise;
	};
	
	
	UiFrameworkService.prototype.chooseSectionAndOpenOnlyOneSectionAtTime = function chooseSectionAndOpenOnlyOneSectionAtTime(card, selectLevel, selectIndex, event, scope, requestURL) {
		var self = this;
		loadingBarService.showLoadingBar();
		// toggle class for summary
		if (commonService.options.cardTouchMode) {
			if (card.cardStatus !== "detail") {
				return;
			}
		}

		var viewProp = scope.viewProp;
		var viewObj = scope.viewProp.viewObject;
		var historySelect = scope.viewProp.historySelect;
		this.listCardHistory = [];
		var lastHistorySelect = historySelect.lastObj();
		
		// render a border at bottom of section if it isn't render
		var childElements = event.currentTarget.parentElement.children;
		for(var i = 0; i < childElements.length; i++) {
			var childEleCardType = angular.element(document.getElementById(childElements[i].id)).scope().card.cardType;
			
			if((childElements[i].tagName == 'UI-SECTION-CONTENT') 
					&& (childEleCardType !== uiRenderPrototypeService.CONSTANTS.cardType.ACTION)
					&& (childElements[i].children[0].classList.toString().indexOf("label-section") === -1)) {
				childElements[i].children[0].classList.add("label-section");
			}
		}

		self.checkClosingCard(card, selectLevel, scope).then(function checkedCloseCard (result) {
			
			if(result !== 'stop'){
				uiRenderPrototypeService.getChildContentOfUiStructure(viewObj[selectLevel][selectIndex], requestURL)
				.then(function gotNextUiObj (result) {

					// "result" will be "undefined" if clicking on an action
					// which will executing a function
					if(result){
						// show loading bar when render ui
						 loadingBarService.showLoadingBar();
						 
						var refDocType = viewObj[selectLevel][selectIndex].getRefDocTypeInDetail();
						var refBusinessType = viewObj[selectLevel][selectIndex].getBusinessTypeInDetail();
						var refProductName = viewObj[selectLevel][selectIndex].getProductNameInDetail();

						if(
							viewObj[selectLevel][selectIndex].children.length !== 0 // if
																					// there
																					// are
																					// any
																					// children
																					// or
																					// uiEle,
																					// won't
																					// load
																					// other
																					// doctypes
							|| viewObj[selectLevel][selectIndex].uiEle.length !== 0// because
																					// we
																					// priority
																					// jsonMock
																					// declaration
							// (Eg: in FNA, Client & Joint Applicant will open
							// views of FNA document, not open prospect doctype
							){
							refDocType = undefined;
							refBusinessType = undefined;
							refProductName = undefined;
						}

						var uiEles = undefined;

						// there will be new cards
						if(uiRenderPrototypeService.isUiStructureObj(result[0])){
							self.isOpenedDetail = false;
							 viewObj[selectLevel + 1] = result;
						} else {
							// static HTML or HTML form
							self.isOpenedDetail = true;
							uiEles = result;
						}
						self.updateHistorySelectObj(selectLevel, selectIndex, scope);
// self.setupActionBar(viewObj[selectLevel][selectIndex].getAssociateUiService().name,
// undefined, scope);
						// divide name of action bar follow name of module
						// service
						// self.setupActionBar(viewObj[selectLevel][selectIndex].getAssociateUiService().actionBar,
						// undefined, scope);

						$timeout(function() {
							self.scrollAmount = self.calculateScrollAmountOnOpen(selectLevel, event.currentTarget, historySelect, viewProp);
							self.scrollTop(self.scrollAmount, 200);
						}, 400);
						
						// set ui style of card
						self.setUiStyleForChildrensOfCard(selectLevel, card, viewProp);
						
						self.renderNewSectionsRowAndOnpenOnlyOneAtTime(card, event, selectLevel + 1, selectIndex, refDocType, uiEles, scope, refBusinessType, refProductName);
					}
					loadingBarService.hideLoadingBar();
				});

			}
			else {
				loadingBarService.hideLoadingBar();
			}
		});
	};
	
	UiFrameworkService.prototype.chooseSectionNew = function chooseSectionNew(card, selectLevel, selectIndex, event, scope, requestURL) {
		var self = this;
		loadingBarService.showLoadingBar();
		// toggle class for summary
		if (commonService.options.cardTouchMode) {
			if (card.cardStatus !== "detail") {
				return;
			}
		}

		var viewProp = scope.viewProp;
		var viewObj = scope.viewProp.viewObject;
		var historySelect = scope.viewProp.historySelect;
		this.listCardHistory = [];
		var lastHistorySelect = historySelect.lastObj();

		self.checkClosingSectionNew(card, selectLevel, selectIndex, scope).then(function checkedCloseSection (result) {
			if(result !== 'stop'){
				uiRenderPrototypeService.getChildContentOfUiStructure(viewObj[selectLevel][selectIndex], requestURL)
				.then(function gotNextUiObj (result) {

					// "result" will be "undefined" if clicking on an action
					// which will executing a function
					if(result){
						// show loading bar when render ui
						 loadingBarService.showLoadingBar();
						 
						var refDocType = viewObj[selectLevel][selectIndex].getRefDocTypeInDetail();
						var refBusinessType = viewObj[selectLevel][selectIndex].getBusinessTypeInDetail();
						var refProductName = viewObj[selectLevel][selectIndex].getProductNameInDetail();

						if(
							viewObj[selectLevel][selectIndex].children.length !== 0 // if
																					// there
																					// are
																					// any
																					// children
																					// or
																					// uiEle,
																					// won't
																					// load
																					// other
																					// doctypes
							|| viewObj[selectLevel][selectIndex].uiEle.length !== 0// because
																					// we
																					// priority
																					// jsonMock
																					// declaration
							// (Eg: in FNA, Client & Joint Applicant will open
							// views of FNA document, not open prospect doctype
							){
							refDocType = undefined;
							refBusinessType = undefined;
							refProductName = undefined;
						}

						var uiEles = undefined;

						// there will be new cards
						if(uiRenderPrototypeService.isUiStructureObj(result[0])){
							self.isOpenedDetail = false;
							 viewObj[selectLevel + 1] = result;
						}
						// static HTML or HTML form
						else{
							self.isOpenedDetail = true;
							uiEles = result;
						}
						self.updateHistorySelectObjNew(selectLevel, selectIndex, scope);
// self.setupActionBar(viewObj[selectLevel][selectIndex].getAssociateUiService().name,
// undefined, scope);
						// divide name of action bar follow name of module
						// service
						// self.setupActionBar(viewObj[selectLevel][selectIndex].getAssociateUiService().actionBar,
						// undefined, scope);

						/*
						 * $timeout(function() { self.scrollAmount =
						 * self.calculateScrollAmountOnOpen(selectLevel,
						 * event.currentTarget, historySelect, viewProp);
						 * self.scrollTop(self.scrollAmount, 200); }, 400);
						 */
						// hnguyen294---self.renderNewSectionRowNew(event,
						// selectLevel + 1, selectIndex, refDocType, uiEles,
						// scope, refBusinessType, refProductName);
						self.renderNewSectionRowNew(event, selectLevel, selectIndex, refDocType, uiEles, scope, refBusinessType, refProductName);
					} else {
						// remove last historySelect ele when cardType is
						// 'action'
						// cause when click on this card again nothing will
						// happen
						// historySelect.pop();
					}
					loadingBarService.hideLoadingBar();
				});

			}
			else {
				loadingBarService.hideLoadingBar();
			}
		});
	};
	
	
	/**
	 * Render tab content
	 */
	UiFrameworkService.prototype.chooseTab = function chooseTab(card, selectLevel, selectIndex, event, scope, requestURL) {
		var self = this;
		loadingBarService.showLoadingBar();
		
		// toggle class for summary
		if (commonService.options.cardTouchMode) {
			if (card.cardStatus !== "detail") {
				return;
			}
		}
		
		var viewProp = scope.viewProp;
		var viewObj = scope.viewProp.viewObject;
		var historySelect = scope.viewProp.historySelect;
		
		self.checkClosingTab(card, selectLevel, selectIndex, scope).then(function checkedCloseSection (result) {
			if(result !== 'stop') {
				uiRenderPrototypeService.getChildContentOfUiStructure(viewObj[selectLevel][selectIndex], requestURL)
				 .then(function gotNextUiObj (result) {
					 if(result){
						 // show loading bar when render ui
						 loadingBarService.showLoadingBar();
						 
						 var refDocType = viewObj[selectLevel][selectIndex].getRefDocTypeInDetail();
						 var refBusinessType = viewObj[selectLevel][selectIndex].getBusinessTypeInDetail();
						 var refProductName = viewObj[selectLevel][selectIndex].getProductNameInDetail();
						 if(
							viewObj[selectLevel][selectIndex].children.length !== 0 // if
																					// there
																					// are
																					// any
																					// children
																					// or
																					// uiEle,
																					// won't
																					// load
																					// other
																					// doctypes
							|| viewObj[selectLevel][selectIndex].uiEle.length !== 0// because
																					// we
																					// priority
																					// jsonMock
																					// declaration
							// (Eg: in FNA, Client & Joint Applicant will open
							// views of FNA document, not open prospect doctype
							){
							refDocType = undefined;
							refBusinessType = undefined;
							refProductName = undefined;
						}

						var uiEles = undefined;
						
						// there will be new cards
						if(uiRenderPrototypeService.isUiStructureObj(result[0])){
							self.isOpenedDetail = false;
							 viewObj[selectLevel + 1] = result;
						} else {
							// static HTML or HTML form
							self.isOpenedDetail = true;
							uiEles = result;
						}
						self.updateHistorySelectObj(selectLevel, selectIndex, scope);
						// need time out here to wait for the animation of
						// scrollTop on close completed
						$timeout(function() {
							self.scrollAmount = self.calculateScrollAmountOnOpen(selectLevel, event.currentTarget, historySelect, viewProp);
							self.scrollTop(self.scrollAmount, 200);
						}, 400);
						if(card.key[0] == (commonService.CONSTANTS.MODULE_NAME.ATTACHMENT + 's')  || card.key[0] == (commonService.CONSTANTS.MODULE_NAME.QUOTATION + 's')){
							$timeout(function() {
								self.scrollTop(commonService.CONSTANTS.NUMBER.ZERO, 200);
							}, 1000);
						}
						// set ui style of card
						self.setUiStyleForChildrensOfCard(selectLevel, card, viewProp);
						
						self.renderNewTab(card, event, selectLevel + 1, selectIndex, refDocType, uiEles, scope, refBusinessType, refProductName);
					 } 
					 loadingBarService.hideLoadingBar();
				 });
			} else {
				loadingBarService.hideLoadingBar();
			}
		})
	}
	
	
	/**
	 * setVisibleStatusForAllQuotationCardsInParentOfElement
	 * 
	 * @author hnguyen294
	 * @param element
	 *            {Object} element which is used to detect parent
	 * @param isVisible
	 *            {Boolean} visible status will be set
	 * @description set visible for all quotation card in parent of element
	 *              which isVisible value
	 */
	UiFrameworkService.prototype.setVisibleStatusForAllQuotationCardsInParentOfElement = function (element, isVisible, card) {
	  	  var chilrens = element.parentElement.children;
	  	  var display = "none";
	  	  if(isVisible) {
	  		display = "initial"; 
	  	  }
	  	  var isImportingQuotation = (card.name === "case-management-base:ImportFromExistingQuotation");
	  	  for(var i = 0; i < chilrens.length; i++) {
			  if(!isImportingQuotation && chilrens[i].classList.toString().indexOf("quo-card-item") !== -1) {
				  chilrens[i].style.display = display;
			  }
		  }
	  	  if (!isImportingQuotation) {
	  		  angular.element('#AddQuotationDivId').css('display', display);
	  	  }
    }
	
	UiFrameworkService.prototype.chooseQuotationCard = function chooseQuotationCard(card, selectLevel, selectIndex, event, scope, requestURL) {
		var self = this;
		loadingBarService.showLoadingBar();
		
		// toggle class for summary
		if (commonService.options.cardTouchMode) {
			if (card.cardStatus !== "detail") {
				return;
			}
		}
		
		var viewProp = scope.viewProp;
		var viewObj = scope.viewProp.viewObject;
		var historySelect = scope.viewProp.historySelect;
		
		self.checkClosingTab(card, selectLevel, selectIndex, scope).then(function checkedCloseSection (result) {
			if(result !== 'stop') {
				uiRenderPrototypeService.getChildContentOfUiStructure(viewObj[selectLevel][selectIndex], requestURL)
				 .then(function gotNextUiObj (result) {
					 if(result){
						 var refDocType = viewObj[selectLevel][selectIndex].getRefDocTypeInDetail();
						 var refBusinessType = viewObj[selectLevel][selectIndex].getBusinessTypeInDetail();
						 var refProductName = viewObj[selectLevel][selectIndex].getProductNameInDetail();
						 if(
							viewObj[selectLevel][selectIndex].children.length !== 0 // if
																					// there
																					// are
																					// any
																					// children
																					// or
																					// uiEle,
																					// won't
																					// load
																					// other
																					// doctypes
							|| viewObj[selectLevel][selectIndex].uiEle.length !== 0// because
																					// we
																					// priority
																					// jsonMock
																					// declaration
							// (Eg: in FNA, Client & Joint Applicant will open
							// views of FNA document, not open prospect doctype
							){
							refDocType = undefined;
							refBusinessType = undefined;
							refProductName = undefined;
						}

						var uiEles = undefined;
						
						// there will be new cards
						if(uiRenderPrototypeService.isUiStructureObj(result[0])){
							self.isOpenedDetail = false;
							 viewObj[selectLevel + 1] = result;
						} else {
							// static HTML or HTML form
							self.isOpenedDetail = true;
							uiEles = result;
						}
						self.updateHistorySelectObj(selectLevel, selectIndex, scope);
						// need time out here to wait for the animation of
						// scrollTop on close completed
						$timeout(function() {
							self.scrollAmount = self.calculateScrollAmountOnOpen(selectLevel, event.currentTarget, historySelect, viewProp);
							self.scrollTop(self.scrollAmount, 200);
						}, 400);
						
						// set ui style of card
						self.setUiStyleForChildrensOfCard(selectLevel, card, viewProp);
						
						self.setVisibleStatusForAllQuotationCardsInParentOfElement(event.currentTarget, false, card);
						
						self.renderNewTab(card, event, selectLevel + 1, selectIndex, refDocType, uiEles, scope, refBusinessType, refProductName);
					 } 
					 loadingBarService.hideLoadingBar();
				 });
			} else {
				loadingBarService.hideLoadingBar();
			}
		})
	}
	
	
	/**
	 * set ui style of card
	 * 
	 * @param selectLevel
	 *            {Int} level of card in ui structure
	 * @param card
	 *            {Object} card info which need to set ui style for children of
	 *            it
	 * @param viewProp
	 *            {Object} view prop, where contain root ui style
	 */
	UiFrameworkService.prototype.setUiStyleForChildrensOfCard = function setUiStyleForChildrensOfCard(selectLevel, card, viewProp) {
		if(card.uiStyle == undefined) {
			if(selectLevel == 0) {
				card.uiStyle = viewProp.uiStyle;
			} else {
				var parentCard = card.parent;
				var uiStyle = undefined;
				while(parentCard !== undefined) {
					uiStyle = parentCard.uiStyle;
					if(uiStyle) {
						break;
					} else {
						parentCard = parentCard.parent;
					}
				}
				if(uiStyle === undefined) {
					uiStyle = viewProp.uiStyle; // get style of root view
				} 
				card.uiStyle = uiStyle;
			}
		}
	}
	
	
	/**
	 * Render first tab
	 */
	UiFrameworkService.prototype.OpenTabAutomatically = function OpenTabAutomaticly(card, selectLevel, selectIndex, parentElement, scope, requestURL) {
		var self = this;
		loadingBarService.showLoadingBar();
		
		// add card info manually
		scope.card = card;
		
		// toggle class for summary
		if (commonService.options.cardTouchMode) {
			if (card.cardStatus !== "detail") {
				return;
			}
		}
		
		var viewProp = scope.viewProp;
		var viewObj = scope.viewProp.viewObject;
		var historySelect = scope.viewProp.historySelect;
		self.checkClosingTab(card, selectLevel, selectIndex, scope).then(function checkedCloseSection (result) {
			if(result !== 'stop') {
				uiRenderPrototypeService.getChildContentOfUiStructure(viewObj[selectLevel][selectIndex], requestURL)
				 .then(function gotNextUiObj (result) {
					 if(result){
						 var refDocType = viewObj[selectLevel][selectIndex].getRefDocTypeInDetail();
						 var refBusinessType = viewObj[selectLevel][selectIndex].getBusinessTypeInDetail();
						 var refProductName = viewObj[selectLevel][selectIndex].getProductNameInDetail();
						 if(
							viewObj[selectLevel][selectIndex].children.length !== 0 // if
																					// there
																					// are
																					// any
																					// children
																					// or
																					// uiEle,
																					// won't
																					// load
																					// other
																					// doctypes
							|| viewObj[selectLevel][selectIndex].uiEle.length !== 0// because
																					// we
																					// priority
																					// jsonMock
																					// declaration
							// (Eg: in FNA, Client & Joint Applicant will open
							// views of FNA document, not open prospect doctype
							){
							refDocType = undefined;
							refBusinessType = undefined;
							refProductName = undefined;
						}

						var uiEles = undefined;
						
						// there will be new cards
						if(uiRenderPrototypeService.isUiStructureObj(result[0])){
							self.isOpenedDetail = false;
							 viewObj[selectLevel + 1] = result;
						} else {
							// static HTML or HTML form
							self.isOpenedDetail = true;
							uiEles = result;
						}
						self.updateHistorySelectObj(selectLevel, selectIndex, scope);
						// need time out here to wait for the animation of
						// scrollTop on close completed
						/*
						 * $timeout(function() { self.scrollAmount =
						 * self.calculateScrollAmountOnOpen(selectLevel,
						 * event.currentTarget, historySelect, viewProp);
						 * self.scrollTop(self.scrollAmount, 200); }, 400);
						 */
						
						// set ui style of card
						self.setUiStyleForChildrensOfCard(selectLevel, card, viewProp);
						
						self.renderNewTabAutomatically(card.uiStyle, parentElement, selectLevel + 1, selectIndex, refDocType, uiEles, scope, refBusinessType, refProductName);
					 } 
					 loadingBarService.hideLoadingBar();
				 });
			} else {
				loadingBarService.hideLoadingBar();
			}
		});
	}
	
	
	UiFrameworkService.prototype.renderNewTab = function renderNewTab (parentCard, event, selectLevel, selectIndex, refDocType, objs, scope, refBusinessType, refProductName) {
		var self = this;
		var needOpenTab = false;
		var ctrl = '';
		if(refDocType)
			ctrl = ' ng-controller="' + genCtrlName('detail', refDocType, refProductName, refBusinessType) + '"';

		var layoutTemplate = undefined;

		// if objs is undefined, means new row of cards
		if(!objs) {
			layoutTemplate = UiFrameworkService.prototype.buildHtmlElementInfo(parentCard.uiStyle, ctrl, selectLevel);
			 if(parentCard.uiStyle == 'tab') {
				 needOpenTab = true;
			 }
		}
		// render form HTML
		else if(uiRenderPrototypeService.isUiElementObj(objs[0])){
			scope.viewProp.uiElements = objs;
			scope.groupUielemnt = $filter('groupByLevel')(objs, "group");
			layoutTemplate =
				'<div card-reorder class="v4-prototype-card-container" current-level = "' + selectLevel+ '" view-object-lenght="viewProp.viewObject[' + (selectLevel -1 ) + '].length"  view-object="viewProp.viewObject[' + (selectLevel -1 ) + ']" class="row" id="level-' + selectLevel+ '-content">' +
					'<div' + ctrl + ' class="row v4-prototype-card-container" style="width: 100%;" >' +
						"<div class='card box-detail wrapper-detail'>" +
							"<div class='container-fluid v3-padding-0 box-detail-form'>" +
								"<div class='row v4-materialize-container' ng-repeat=\"item in groupUielemnt | orderBy: 'key'\">"+
									'<ui-element ng-repeat="uiElement in item.value track by $index" />' +
								"</div>" +
							"</div>" +
						"</div>" +
					"</div>" +
				"</div>";

		}
		// render static HTML
		else{
			layoutTemplate =
			'<div class="row v4-prototype-card-container" card-reorder current-level = "' + selectLevel+ '" view-object-lenght="viewProp.viewObject[' + (selectLevel -1 ) + '].length" view-object="viewProp.viewObject[' + (selectLevel -1 ) + ']" id="level-' + selectLevel+ '-content">' +
				"<div class='card box-detail wrapper-detail'>" +
					"<div class='container-fluid v3-padding-0 box-detail-form'>" + objs + "</div>" +
				"</div>" +
			"</div>";
		}

		var appendEle = undefined;// where the new layout will be append
		var parentElement = event.currentTarget.parentElement;
		var currOffsetTop = event.currentTarget.children[0].offsetTop;
		var siblingEles = parentElement.children;
		var siblingLen = siblingEles.length;

		// <<<<< will review the bellow code after
	   /*
		 * var i = 0; for (; i < siblingLen; i++) {
		 * if(!commonService.hasValueNotEmpty(siblingEles[i].children))
		 * continue; if (siblingEles[i].children[0].offsetTop > currOffsetTop) {
		 * break; } appendEle = siblingEles[i]; }
		 * 
		 * //all cards are on the same height //append in the end of parent
		 * element if(i >= siblingLen){ appendEle = siblingEles[i - 1]; }
		 */
		
		// ================
		appendEle = siblingEles[siblingLen - 1];
		// >>>>>


		// append new layout here
		// http://www.mattzeunert.com/2014/11/03/manually-removing-angular-directives.html
		var childScope = scope.$new();

		// add class for new layout
		// var currTargetEle =
		// angular.element(event.currentTarget).find('.card-element');
		// var arrowPositionX = event.currentTarget.children[0].offsetLeft +
		// event.currentTarget.children[0].offsetWidth/2 - 30;
		var compiledTemplate = $compile(layoutTemplate)(childScope);
		angular.element(appendEle).after(compiledTemplate);

		// keep track of appendEle
		if(scope.viewProp.historySelect[selectLevel - 1]){
			scope.viewProp.historySelect[selectLevel - 1].refChildHtml = compiledTemplate;
			scope.viewProp.historySelect[selectLevel - 1].childScope = childScope;
		}
		/*
		 * var currBackgroundColor = currTargetEle.css("background-color");
		 * if(currBackgroundColor == "rgba(0, 0, 0, 0)"){ var
		 * currBackgroundColor = currTargetEle.css("color"); }
		 */

		compiledTemplate.css('width', '100%');
		compiledTemplate.css('clear', 'both');
		// var borderProp="2px solid "+currBackgroundColor;
		compiledTemplate.addClass('animated zoomIn');
		// var boxDetailEle = compiledTemplate.find('.box-detail');
		// boxDetailEle.css('border-top',borderProp);
		// boxDetailEle.before("<span class='arrow-container-card'
		// style='left:"+arrowPositionX+"px;
		// border-right:"+currBackgroundColor+"2px
		// solid;border-top:"+currBackgroundColor+"2px solid;'></span>");
		
		// check to open tab
		if(needOpenTab) {
			needOpenTab = false;
			self.openFirtTabAutomatically(scope, selectLevel);
		}
	};
	
	
	/**
	 * openFirtTabAutomatically
	 * 
	 * @author hnguyen294
	 * @description auto open the first tab item of tab
	 * @param scope
	 *            {Object}
	 * @param selectLevel
	 *            {Int} level of tab in the ui structure system
	 */
	UiFrameworkService.prototype.openFirtTabAutomatically = function openFirtTabAutomatically(scope, selectLevel) {
		var self = this;
		// wait for ui is rendered stable
		$timeout(function () {
			var willOpenTabAtIndex = scope.getTabIndexToOpenAutomaticallyFromTabIndex(scope.viewProp.viewObject[selectLevel]);
			if(willOpenTabAtIndex === undefined) return;
			var willOpenTab = scope.viewProp.viewObject[selectLevel][willOpenTabAtIndex];
			scope.moveToCardByCardUIStructureInfo(willOpenTab);
		}, 200);
	}
	
	
	UiFrameworkService.prototype.checkClosingSectionNew = function checkClosingSectionNew(willOpenCard, willOpenLevel, willOpenIndex, scope) {
		var self = this;
		var historySelect = scope.viewProp.historySelect;
		// var message = 'Choose YES if you want to save the current content
		// before opening document. If NO, the new content will be reset.'
		var defer = scope.moduleService.$q.defer();

		function checkNeedToSaveDetail(oldScope, openingCard) {
			// openingCard: card is opening on screen, which we're going to
			// close it
			// willOpenCard: card which will be opened
			var defer = scope.moduleService.$q.defer();

			// store new isDetailChanged to local storage
			if (openingCard) {
				uiRenderPrototypeService.updateShellUiStructureToStorage(openingCard.root);
			}

			if (// Check allow auto save
				self.isAllowNavAutoSave() &&

				(
					// if root is different --> it's a different documents
					// or willOpenCard will open other doctype, need to check
					// for saving detail
					(openingCard && openingCard.root !== willOpenCard.root && openingCard.root.refDetail.id !== willOpenCard.root.refDetail.id) ||

					// if user wants to open new doctype, need to save the old
					// one
					willOpenCard.getRefDocTypeInDetail()
				) &&

				// check dirty change
				!oldScope.moduleService.compareData(oldScope.moduleService.detail, oldScope.moduleService.originalDetail)) {

				var oldDocType = oldScope.moduleService.name;
				var currUiService = uiRenderPrototypeService.getUiService(oldDocType);
				if (currUiService) {
					var saveDetailAdditionalParams = {
						bUpdateLocationSearch: true,
						locationParams: {
							locationDocType: $state.params.docType,
							locationService: $location
						}
					};
					UiFrameworkService.prototype.saveDetailNotCompute.call(oldScope, currUiService, saveDetailAdditionalParams).then(function () {
						commonUIService.showNotifyMessage('v4.' + scope.getCorrectDoctype(currUiService) + '.message.autoSaveSuccessfully', "success", 3000);
						defer.resolve();
					}, function () {
						commonUIService.showNotifyMessage('v4.' + scope.getCorrectDoctype(currUiService) + '.message.autoSaveUnsuccessfully', "unsuccessful", 3000);
						defer.reject();
					});
				} else {
					$log.error("Can't get uiService of doctype: " + oldDocType);
					defer.resolve();
				}
			} else {
				defer.resolve();
			}

			return defer.promise;
		}
		
		// <<<<<<< hnguyen294 - must update source code to get lastSelectedInfo
		// value here
		// build key value of the select info
		var selectedInfo = UiFrameworkService.prototype.getHistorySelectedObject(willOpenLevel, willOpenIndex, scope);
		if(selectedInfo) {
			var currCardDocType = scope.moduleService.name;
			var willOpenCardDocType = willOpenCard.getRefDocTypeInDetail();
			if (!commonService.hasValueNotEmpty(willOpenCardDocType)) {
				if (willOpenCard.scope &&
					willOpenCard.scope.moduleService) {
					willOpenCardDocType = willOpenCard.scope.moduleService.name;
				}
			}
			
			var currCardUiStructure = selectedInfo.refUiStructure;
			if (currCardUiStructure &&
				currCardUiStructure.refDetail &&
				currCardUiStructure.refDetail.refType) {
				currCardDocType = currCardUiStructure.refDetail.refType.value;
			}
			
			if (currCardDocType !== willOpenCardDocType || selectedInfo) {
				var oldScope = scope;
				// hnguyen294 -deleted to test--var selectedCard,
				// linkCUiStructure;
				var selectedCard;
				if (selectedInfo) {
					selectedCard = selectedInfo.refUiStructure;
					/*
					 * hnguyen294 --- removed to test //if selectedInfo has
					 * linkChildUiStructure, it need to be it linkCUiStructure =
					 * uiRenderPrototypeService.getLinkChildUiStructure(selectedCard);
					 * selectedInfo = linkCUiStructure ? linkCUiStructure :
					 * selectedInfo; //we need oldScope, so in
					 * saveDetailNotCompute() can get the parents uiStructure
					 * for autosave var selectedCardScope =
					 * selectedInfo.getCurrentAngularScope(); if
					 * (selectedCardScope) { oldScope = selectedCardScope; }
					 */
				}

				checkNeedToSaveDetail(oldScope, selectedCard).then(function () {
					// TODO: hnguyen294 - must update source code to get
					// historySelect value here
					// if close an opening card
					if (selectedInfo) {

						var selectedCard = selectedInfo.refUiStructure;

						// close child of opening card
						self.closeChildSectionsNew(selectedInfo, scope);
						
						// unselected card after close card, so check isSelected
						// to false
						selectedCard.isSelected = false;
						
						if (commonService.options.cardTouchMode) {
							willOpenCard.cardStatus = "start";
						}

						// if click on an opened card, simple close its children
						// and do no more
						if (selectedCard === willOpenCard) {
							// hnguyen 294
							// self.closeChildCards(willOpenLevel, scope);
							// end
							defer.resolve('stop');
						} else {
							// delay wait for last open row is remove completely
							$timeout(function () {
								defer.resolve();
							}, 200);
						}
					} else
						defer.resolve();
				});
			} else
				 defer.resolve();
		} else {
			defer.resolve();
		}
		
		// =============
		
		/*
		 * var lastSelectedInfo = historySelect.lastObj(); var currCardDocType =
		 * scope.moduleService.name; var willOpenCardDocType =
		 * willOpenCard.getRefDocTypeInDetail(); if
		 * (!commonService.hasValueNotEmpty(willOpenCardDocType)) { if
		 * (willOpenCard.scope && willOpenCard.scope.moduleService) {
		 * willOpenCardDocType = willOpenCard.scope.moduleService.name; } } if
		 * (lastSelectedInfo) { var currCardUiStructure =
		 * lastSelectedInfo.refUiStructure; if (currCardUiStructure &&
		 * currCardUiStructure.refDetail &&
		 * currCardUiStructure.refDetail.refType) { currCardDocType =
		 * currCardUiStructure.refDetail.refType.value; } }
		 * 
		 * if (currCardDocType !== willOpenCardDocType || lastSelectedInfo) {
		 * var oldScope = scope; var lastSelectedCard, linkCUiStructure; if
		 * (lastSelectedInfo) { lastSelectedCard =
		 * lastSelectedInfo.refUiStructure; //if lastSelectedInfo has
		 * linkChildUiStructure, it need to be it linkCUiStructure =
		 * uiRenderPrototypeService.getLinkChildUiStructure(lastSelectedCard);
		 * lastSelectedCard = linkCUiStructure ? linkCUiStructure :
		 * lastSelectedCard; //we need oldScope, so in saveDetailNotCompute()
		 * can get the parents uiStructure for autosave var
		 * lastSelectedCardScope = lastSelectedCard.getCurrentAngularScope(); if
		 * (lastSelectedCardScope) { oldScope = lastSelectedCardScope; } }
		 * 
		 * checkNeedToSaveDetail(oldScope, lastSelectedCard).then(function () {
		 * //TODO: hnguyen294 - must update source code to get historySelect
		 * value here //if close an opening card if
		 * (historySelect[willOpenLevel]) {
		 * 
		 * var selectedCard = historySelect[willOpenLevel].refUiStructure;
		 * 
		 * //close child of opening card self.closeChildCards(willOpenLevel,
		 * scope); if (commonService.options.cardTouchMode) {
		 * willOpenCard.cardStatus = "start"; }
		 * 
		 * //if click on an opened card, simple close its children and do no
		 * more if (selectedCard === willOpenCard) { // hnguyen 294
		 * //self.closeChildCards(willOpenLevel, scope); //end
		 * defer.resolve('stop'); } else { //delay wait for last open row is
		 * remove completely $timeout(function () { defer.resolve(); }, 200); } }
		 * else defer.resolve(); }); } else defer.resolve();
		 */
		// <<<<<<<<end
		
		

		return defer.promise;
	};
	
	
	UiFrameworkService.prototype.checkClosingTab = function checkClosingTab(willOpenCard, willOpenLevel, willOpenIndex, scope) {
		var self = this;
		var historySelect = scope.viewProp.historySelect;
		// var message = 'Choose YES if you want to save the current content
		// before opening document. If NO, the new content will be reset.'
		var defer = scope.moduleService.$q.defer();
		
		// if tab is opening, return stop signal
		var lastSelectedInfo = historySelect.lastObj();
		if ( (lastSelectedInfo && lastSelectedInfo.refUiStructure === willOpenCard) || willOpenCard.stopPropagation ) { // hle71
																														// -
																														// stopPropagation
																														// -
																														// for
																														// "Import
																														// From
																														// Existing
																														// Quotation"
																														// button
			defer.resolve('stop');
		} else {
			function checkNeedToSaveDetail(oldScope, openingCard) {
				// openingCard: card is opening on screen, which we're going to
				// close it
				// willOpenCard: card which will be opened
				var defer = scope.moduleService.$q.defer();

				// store new isDetailChanged to local storage
				if (openingCard) {
					uiRenderPrototypeService.updateShellUiStructureToStorage(openingCard.root);
				}

				if (// Check allow auto save
					self.isAllowNavAutoSave() &&

					(
						// if root is different --> it's a different documents
						// or willOpenCard will open other doctype, need to
						// check for saving detail
						(openingCard && willOpenCard.root && openingCard.root !== willOpenCard.root && openingCard.root.refDetail.id !== willOpenCard.root.refDetail.id) ||

						// if user wants to open new doctype, need to save the
						// old one
						willOpenCard.getRefDocTypeInDetail()
					) &&

					// check dirty change
					!oldScope.moduleService.compareData(oldScope.moduleService.detail, oldScope.moduleService.originalDetail)) {

					var oldDocType = oldScope.moduleService.name;
					var currUiService = uiRenderPrototypeService.getUiService(oldDocType);
					if (currUiService) {
						var saveDetailAdditionalParams = {
							bUpdateLocationSearch: true,
							locationParams: {
								locationDocType: $state.params.docType,
								locationService: $location
							}
						};
						UiFrameworkService.prototype.saveDetailNotCompute.call(oldScope, currUiService, saveDetailAdditionalParams).then(function () {
							commonUIService.showNotifyMessage('v4.' + scope.getCorrectDoctype(currUiService) + '.message.autoSaveSuccessfully', "success", 3000);
							defer.resolve();
						}, function () {
							commonUIService.showNotifyMessage('v4.' + scope.getCorrectDoctype(currUiService) + '.message.autoSaveUnsuccessfully', "unsuccessful", 3000);
							defer.reject();
						});
					} else {
						$log.error("Can't get uiService of doctype: " + oldDocType);
						defer.resolve();
					}
				} else {
					defer.resolve();
				}

				return defer.promise;
			}
			
			var lastSelectedInfo = historySelect.lastObj();
			var currCardDocType = scope.moduleService.name;
			var willOpenCardDocType = willOpenCard.getRefDocTypeInDetail();
			if (!commonService.hasValueNotEmpty(willOpenCardDocType)) {
				if (willOpenCard.scope &&
					willOpenCard.scope.moduleService) {
					willOpenCardDocType = willOpenCard.scope.moduleService.name;
				}
			}
			if (lastSelectedInfo) {
				var currCardUiStructure = lastSelectedInfo.refUiStructure;
				if (currCardUiStructure &&
					currCardUiStructure.refDetail &&
					currCardUiStructure.refDetail.refType) {
					currCardDocType = currCardUiStructure.refDetail.refType.value;
				}
			}
			if (currCardDocType !== willOpenCardDocType || lastSelectedInfo) {
				var oldScope = scope;
				var lastSelectedCard, linkCUiStructure;
				if (lastSelectedInfo) {
					lastSelectedCard = lastSelectedInfo.refUiStructure;
					// if lastSelectedInfo has linkChildUiStructure, it need to
					// be it
					linkCUiStructure = uiRenderPrototypeService.getLinkChildUiStructure(lastSelectedCard);
					lastSelectedCard = linkCUiStructure ? linkCUiStructure : lastSelectedCard;
					// we need oldScope, so in saveDetailNotCompute() can get
					// the parents uiStructure for autosave
					var lastSelectedCardScope = lastSelectedCard.getCurrentAngularScope();
					if (lastSelectedCardScope) {
						oldScope = lastSelectedCardScope;
					}
				}

				checkNeedToSaveDetail(oldScope, lastSelectedCard).then(function () {
					// if close an opening card
					if (historySelect[willOpenLevel]) {

						var selectedCard = historySelect[willOpenLevel].refUiStructure;
						
						// close child of opening card
						self.closeChildCards(willOpenLevel, scope);
						if (commonService.options.cardTouchMode) {
							willOpenCard.cardStatus = "start";
						}
						
						// unselected card after close card, so check isSelected
						// to false
						selectedCard.isSelected = false;

						// if click on an opened card, simple close its children
						// and do no more
						if (selectedCard === willOpenCard) {
							defer.resolve('stop');
						} else {
							// delay wait for last open row is remove completely
							$timeout(function () {
								defer.resolve();
							}, 200);
						}
					} else
						defer.resolve();
				});
			} else
				 defer.resolve();
		}
		return defer.promise;
	};
	
	UiFrameworkService.prototype.updateHistorySelectObjNew = function updateHistorySelectObjNew (selectLevel, selectIndex, scope) {
		var self = this;
		var viewProp = scope.viewProp;
		var viewObj = scope.viewProp.viewObject;
		var historySelect = scope.viewProp.historySelect;

		// <<<<<< hnguyen294 ---- customize
		// build key for history selection object
		var selectedObjKey = 'level-' + selectLevel + '-index-' + selectIndex;
		var selectedObjVal = angular.copy(viewProp.historyObjTmpl);
		selectedObjVal.refUiStructure = viewObj[selectLevel][selectIndex];
		selectedObjVal.level = selectLevel;
		selectedObjVal.index = selectIndex;
		
		// update the history of doctype
		selectedObjVal.refDocType = scope.uiStructureRoot.docParams.refDocType;
		
		var selectedObject = {'selectedObjPos': selectedObjKey, 'selectedObjVal': selectedObjVal};
		historySelect.push(selectedObject);
		// =======
		 // update the historySelect object
		/*
		 * if(historySelect.length == selectLevel){
		 * historySelect.push(angular.copy(viewProp.historyObjTmpl)); }
		 * historySelect[selectLevel].refUiStructure =
		 * viewObj[selectLevel][selectIndex]; historySelect[selectLevel].index =
		 * selectIndex;
		 * 
		 * //update the history of doctype if(selectLevel == 0){//if in first
		 * step, need to init the refDocType value
		 * historySelect[selectLevel].refDocType =
		 * scope.uiStructureRoot.docParams.refDocType; } else{ var
		 * prevRefDocType = historySelect[selectLevel -
		 * 1].refUiStructure.getRefDocTypeInDetail(); if(prevRefDocType)
		 * historySelect[selectLevel].refDocType = prevRefDocType; else{
		 * historySelect[selectLevel].refDocType = historySelect[selectLevel -
		 * 1].refDocType; } }
		 */
		
		// <<<<<<<<end
	};
	
	
	UiFrameworkService.prototype.renderNewSectionRowNew = function renderNewSectionRowNew (event, selectLevel, selectIndex, refDocType, objs, scope, refBusinessType, refProductName) {
		var self = this;
		var ctrl = '';
		//
		var nextLevel = selectLevel + 1;
		// hnguyen294
		if(refDocType)
			ctrl = ' ng-controller="' + genCtrlName('detail', refDocType, refProductName, refBusinessType) + '"';

		var layoutTemplate = undefined;

		// if objs is undefined, means new row of cards
		if(!objs){
			 layoutTemplate =
				 '<div car-reoder class="v4-prototype-card-container" current-level = "' + nextLevel + '" view-object-lenght="viewProp.viewObject[' + selectLevel + '].length" view-object="viewProp.viewObject[' + selectLevel + ']" id="level-' + nextLevel + '-content">' +
					'<div' + ctrl + ' class="row v4-prototype-card-container" style="width: 100%;">' +
						'<div class="card box-detail wrapper-detail">' +
							'<div class="container-fluid v3-padding-0">' +
								'<ui-section-content id="level-' + nextLevel + '-card-{{$index}}" ng-repeat="card in viewProp.viewObject[' + nextLevel + '] track by $index" level="' + nextLevel + '" when-click="chooseSection(card, ' + nextLevel + ' , $index, clickEvent)" ng-init="cardIndex = $index + 1"/>' +
							'</div>' +
						'</div>' +
					'</div>' +
				 '</div>';

		}
		// render form HTML
		else if(uiRenderPrototypeService.isUiElementObj(objs[0])){
			scope.viewProp.uiElements = objs;
			scope.groupUielemnt = $filter('groupByLevel')(objs, "group");
			layoutTemplate =
				'<div car-reoder class="v4-prototype-card-container" current-level = "' + nextLevel+ '" view-object-lenght="viewProp.viewObject[' + selectLevel + '].length"  view-object="viewProp.viewObject[' + selectLevel + ']" class="row" id="level-' + nextLevel + '-content">' +
					'<div' + ctrl + ' class="row v4-prototype-card-container" style="width: 100%;" >' +
						"<div class='card box-detail wrapper-detail'>" +
							"<div class='container-fluid v3-padding-0 box-detail-form'>" +
								"<div class='row v4-materialize-container' ng-repeat=\"item in groupUielemnt | orderBy: 'key'\">"+
									'<ui-element ng-repeat="uiElement in item.value track by $index" />' +
								"</div>" +
							"</div>" +
						"</div>" +
					"</div>" +
				"</div>";

		}
		// render static HTML
		else{
			layoutTemplate =
			'<div class="row v4-prototype-card-container" card-reorder current-level = "' + nextLevel + '" view-object-lenght="viewProp.viewObject[' + selectLevel + '].length" view-object="viewProp.viewObject[' + selectLevel + ']" id="level-' + nextLevel + '-content">' +
				"<div class='card box-detail wrapper-detail'>" +
					"<div class='container-fluid v3-padding-0 box-detail-form'>" + objs + "</div>" +
				"</div>" +
			"</div>";
		}

		var appendEle = undefined;// where the new layout will be append
		var parentElement = event.currentTarget.parentElement;
		var currOffsetTop = event.currentTarget.children[0].offsetTop;
		var siblingEles = parentElement.children;
		var siblingLen = siblingEles.length;

		var i = 0;
		for (; i < siblingLen; i++) {
			if(!commonService.hasValueNotEmpty(siblingEles[i].children)) continue;
			if (siblingEles[i].children[0].offsetTop > currOffsetTop) {
				break;
			}
			appendEle = siblingEles[i];
		}

		// all cards are on the same height
		// append in the end of parent element
		if(i >= siblingLen){
			appendEle = siblingEles[i - 1];
		}

		// append new layout here
		// http://www.mattzeunert.com/2014/11/03/manually-removing-angular-directives.html
		var childScope = scope.$new();

		// add class for new layout
		// var currTargetEle =
		// angular.element(event.currentTarget).find('.card-element');
		// var arrowPositionX = event.currentTarget.children[0].offsetLeft +
		// event.currentTarget.children[0].offsetWidth/2 - 30;
		var compiledTemplate = $compile(layoutTemplate)(childScope);
		
		angular.element(appendEle).after(compiledTemplate);

		
		// keep track of appendEle
		self.updateHistorySelectedObject(selectLevel, selectIndex, compiledTemplate, childScope, scope);
		
		/*
		 * if(scope.viewProp.historySelect[selectLevel - 1]){
		 * scope.viewProp.historySelect[selectLevel - 1].refChildHtml =
		 * compiledTemplate; scope.viewProp.historySelect[selectLevel -
		 * 1].childScope = childScope; }
		 */
		/*
		 * var currBackgroundColor = currTargetEle.css("background-color");
		 * if(currBackgroundColor == "rgba(0, 0, 0, 0)"){ var
		 * currBackgroundColor = currTargetEle.css("color"); }
		 */

		compiledTemplate.css('width', '100%');
		compiledTemplate.css('clear', 'both');
		// var borderProp="2px solid "+currBackgroundColor;
		compiledTemplate.addClass('animated zoomIn');
		/*
		 * hnguyen294 --removed--var boxDetailEle =
		 * compiledTemplate.find('.box-detail');
		 * boxDetailEle.css('border-top',borderProp);
		 * //boxDetailEle.css('border-bottom',borderProp);
		 * //boxDetailEle.css('margin-bottom','-2px'); boxDetailEle.before("<span
		 * class='arrow-container-card' style='left:"+arrowPositionX+"px;
		 * border-right:"+currBackgroundColor+"2px
		 * solid;border-top:"+currBackgroundColor+"2px solid;'></span>");
		 */
		// User Guide: if this card is the first time access, it will show User
		// Guide popover for Card
		/*
		 * if(objs){ $timeout(function() {
		 * scope.moduleProspectPersonalService.tourGuideFirstLoginForUser("documentDetails"); },
		 * 1000); }else{ $timeout(function() { if(refDocType){
		 * scope.moduleProspectPersonalService.tourGuideFirstLoginForUser(refDocType.split(';')[0].capitalizeFirstLetter()); } },
		 * 1000); }
		 */
	};
	
	// scope.viewProp.historySelect[selectLevel - 1].refChildHtml =
	// compiledTemplate;
	// scope.viewProp.historySelect[selectLevel - 1].childScope = childScope;
	UiFrameworkService.prototype.updateHistorySelectedObject = function updateHistorySelectedObject (selectLevel, selectIndex, refChildHtml, childScope, scope) {
		var self = this;
		var selectedObjKeyVal = self.buildSelectedObjKeyValue(selectLevel, selectIndex);
		var historySelect = scope.viewProp.historySelect;
		// var selectedObject = {'selectedObjPos': selectedObjKey,
		// 'selectedObjVal': selectedObjVal};
		for(var i = 0; i < historySelect.length; i++) {
			var historyItem = historySelect[i];
			if(historyItem.selectedObjPos === selectedObjKeyVal) {
				historyItem.selectedObjVal.refChildHtml = refChildHtml;
				historyItem.selectedObjVal.childScope = childScope;
				return;
			}
		}
	}
	
	
	UiFrameworkService.prototype.getHistorySelectedObject = function getHistorySelectedObject (selectLevel, selectIndex, scope) {
		var self = this;
		var selectedObjKeyVal = self.buildSelectedObjKeyValue(selectLevel, selectIndex);
		var historySelect = scope.viewProp.historySelect;
		// var selectedObject = {'selectedObjPos': selectedObjKey,
		// 'selectedObjVal': selectedObjVal};
		for(var i = 0; i < historySelect.length; i++) {
			var historyItem = historySelect[i];
			if(historyItem.selectedObjPos === selectedObjKeyVal) {
				return historyItem.selectedObjVal;
			}
		}
		return null;
	}
	
	UiFrameworkService.prototype.deleteHistorySelectedObject = function deleteHistorySelectedObject(selectLevel, selectIndex, scope) {
		var self = this;
		var selectedObjKeyVal = self.buildSelectedObjKeyValue(selectLevel, selectIndex);
		var historySelect = scope.viewProp.historySelect;
		for(var i = 0; i < historySelect.length; i++) {
			var historyItem = historySelect[i];
			if(historyItem.selectedObjPos === selectedObjKeyVal) {
				console.log('remove object at: ' + selectedObjKeyVal);
				historySelect.splice(i, 1);
			}
		}
	}
	
	UiFrameworkService.prototype.buildSelectedObjKeyValue = function buildSelectedObjKeyValue(selectLevel, selectIndex) {
		if(selectLevel != undefined && selectIndex !== undefined) {
			return 'level-' + selectLevel + '-index-' + selectIndex;
		}
		return null;
	}
	
	
	UiFrameworkService.prototype.closeChildSectionsNew = function closeChildSectionsNew(selectedObjectInfo, scope) {
		// <<<<<<<<<<hnguyen294 ---- customize
		var self = this;
		var viewProp = scope.viewProp;
		var viewObj = scope.viewProp.viewObject;
		var historySelect = scope.viewProp.historySelect;
		var closeLevelRefDocType = undefined;
		var closeLevelBusinessType = undefined;
		var currCardRefDocType = undefined;// current refDocType of newest
											// child
		if(selectedObjectInfo) {
			closeLevelRefDocType = selectedObjectInfo.refDocType;
			closeLevelBusinessType = selectedObjectInfo.refUiStructure.root.businessType;

			// if close card with difference refdoctype then render new action
			// bar
			// or opening another docType (eg: illustration card in case when
			// opening "illustrations" (case) card)
			var lastSelectedObject = historySelect.lastObj().selectedObjVal;
			if(lastSelectedObject) {
				currCardRefDocType = lastSelectedObject.refDocType;
				var isOpenOtherDocType = lastSelectedObject.refUiStructure.getRefDocTypeInDetail() ? true : false;
				
				if (closeLevelRefDocType !== currCardRefDocType || isOpenOtherDocType) {
					var ctrlInCharge = self.getCtrlInCharge(scope);
					if (self.isSectionLayout(this.viewProp) === false)
						self.setupActionBar(closeLevelRefDocType, closeLevelBusinessType, ctrlInCharge);
				}
			}
			
		
			// Update scrollTop for close Child Element
			/*
			 * hnguyen294-----var scrollAmount =
			 * self.calculateScrollAmountOnClose(closeLevel, historySelect,
			 * viewProp); self.scrollTop(scrollAmount);
			 */

			// handle 'onClose' code if existed
			if (selectedObjectInfo.refUiStructure.onClose) {
				scope.$eval(selectedObjectInfo.refUiStructure.onClose);
			}

			
			// If we're closing a card which loaded another doctype
			// --> need to release the another uiStructure
			if (this.isSectionLayout(viewProp)) {
				this.removeSection(selectedObjectInfo.refChildHtml);
			} else {
				this.removeRow(selectedObjectInfo.refChildHtml);
			}

			selectedObjectInfo.childScope.$destroy();
			
			// viewObj.splice(closeLevel + 1, viewObj.length);
			
			var selectLevel = selectedObjectInfo.level;
			var selectIndex = selectedObjectInfo.index;
			self.deleteHistorySelectedObject(selectLevel, selectIndex, scope);
		}
		// ==================================
		/*
		 * UiFrameworkService.prototype.closeChildSectionsNew = function
		 * closeChildSectionsNew(closeLevel, closeIndex, scope) { var self =
		 * this; var viewProp = scope.viewProp; var viewObj =
		 * scope.viewProp.viewObject; var historySelect =
		 * scope.viewProp.historySelect; var closeLevelRefDocType = undefined;
		 * var closeLevelBusinessType = undefined; var currCardRefDocType =
		 * undefined;//current refDocType of newest child
		 * if(historySelect[closeLevel]) { var indexOfOpenedCardOfselectLevel =
		 * historySelect[closeLevel].index;
		 * 
		 * closeLevelRefDocType = historySelect[closeLevel].refDocType;
		 * closeLevelBusinessType =
		 * historySelect[closeLevel].refUiStructure.root.businessType;
		 * 
		 * currCardRefDocType = historySelect.lastObj().refDocType; var
		 * isOpenOtherDocType =
		 * historySelect.lastObj().refUiStructure.getRefDocTypeInDetail() ? true :
		 * false;
		 * 
		 * 
		 * //if close card with difference refdoctype then render new action bar
		 * //or opening another docType (eg: illustration card in case when
		 * opening "illustrations" (case) card) if (closeLevelRefDocType !==
		 * currCardRefDocType || isOpenOtherDocType) { var ctrlInCharge =
		 * self.getCtrlInCharge(scope); if (self.isSectionLayout(this.viewProp)
		 * === false) self.setupActionBar(closeLevelRefDocType,
		 * closeLevelBusinessType, ctrlInCharge); }
		 * 
		 * //Update scrollTop for close Child Element var scrollAmount =
		 * self.calculateScrollAmountOnClose(closeLevel, historySelect,
		 * viewProp); self.scrollTop(scrollAmount);
		 * 
		 * 
		 * //handle 'onClose' code if existed if
		 * (historySelect[closeLevel].refUiStructure.onClose) {
		 * scope.$eval(historySelect[closeLevel].refUiStructure.onClose); }
		 * 
		 * //update historySelect //
		 * uiRenderPrototypeService.getValidStatus(historySelect[closeLevel].refUiStructure); //
		 * uiRenderPrototypeService.updateParentStatusWithoutSectios(closeLevel,
		 * indexOfOpenedCardOfselectLevel, viewObj);
		 *  // If we're closing a card which loaded another doctype // --> need
		 * to release the another uiStructure if
		 * (this.isSectionLayout(viewProp)) {
		 * this.removeSection(historySelect[closeLevel].refChildHtml); } else {
		 * this.removeRow(historySelect[closeLevel].refChildHtml); }
		 * 
		 * historySelect[closeLevel].childScope.$destroy();
		 * viewObj.splice(closeLevel + 1, viewObj.length);
		 * historySelect.splice(closeLevel, historySelect.length); }
		 */
		// <<<<<<<<<<end
	};
	
	
	UiFrameworkService.prototype.closeChildTab = function closeChildTab(selectedObjectInfo, scope) {
		var self = this;
		var viewProp = scope.viewProp;
		var viewObj = scope.viewProp.viewObject;
		var historySelect = scope.viewProp.historySelect;
		var closeLevelRefDocType = undefined;
		var closeLevelBusinessType = undefined;
		var currCardRefDocType = undefined;// current refDocType of newest
											// child
		if(selectedObjectInfo) {
			closeLevelRefDocType = selectedObjectInfo.refDocType;
			closeLevelBusinessType = selectedObjectInfo.refUiStructure.root.businessType;

			// if close card with difference refdoctype then render new action
			// bar
			// or opening another docType (eg: illustration card in case when
			// opening "illustrations" (case) card)
			var lastSelectedObject = historySelect.lastObj().selectedObjVal;
			if(lastSelectedObject) {
				currCardRefDocType = lastSelectedObject.refDocType;
				var isOpenOtherDocType = lastSelectedObject.refUiStructure.getRefDocTypeInDetail() ? true : false;
				
				if (closeLevelRefDocType !== currCardRefDocType || isOpenOtherDocType) {
					var ctrlInCharge = self.getCtrlInCharge(scope);
					if (self.isSectionLayout(this.viewProp) === false)
						self.setupActionBar(closeLevelRefDocType, closeLevelBusinessType, ctrlInCharge);
				}
			}
			// handle 'onClose' code if existed
			if (selectedObjectInfo.refUiStructure.onClose) {
				scope.$eval(selectedObjectInfo.refUiStructure.onClose);
			}

			
			// If we're closing a card which loaded another doctype
			// --> need to release the another uiStructure
			if (this.isSectionLayout(viewProp)) {
				this.removeSection(selectedObjectInfo.refChildHtml);
			} else {
				this.removeRow(selectedObjectInfo.refChildHtml);
			}

			selectedObjectInfo.childScope.$destroy();
			
			var selectLevel = selectedObjectInfo.level;
			var selectIndex = selectedObjectInfo.index;
			self.deleteHistorySelectedObject(selectLevel, selectIndex, scope);
		}
	};
	
	
	UiFrameworkService.prototype.renderNewSectionsRowAndOnpenOnlyOneAtTime = function renderNewSectionsRowAndOnpenOnlyOneAtTime (parentCard, event, selectLevel, selectIndex, refDocType, objs, scope, refBusinessType, refProductName) {
		var self = this;
		var needOpenTab = false;
		var ctrl = '';
		if(refDocType)
			ctrl = ' ng-controller="' + genCtrlName('detail', refDocType, refProductName, refBusinessType) + '"';

		var layoutTemplate = undefined;

		// if objs is undefined, means new row of cards
		if(!objs) {
			 // get element name and action name of child base on uiStyle
				// value
			layoutTemplate = UiFrameworkService.prototype.buildHtmlElementInfo(parentCard.uiStyle, ctrl, selectLevel);
			 
			 if(parentCard.uiStyle == 'tab') {
				 needOpenTab = true;
			 }

		}
		// render form HTML
		else if(uiRenderPrototypeService.isUiElementObj(objs[0])){
			scope.viewProp.uiElements = objs;
			scope.groupUielemnt = $filter('groupByLevel')(objs, "group");
			layoutTemplate =
				'<div card-reorder class="v4-prototype-card-container label-section" current-level = "' + selectLevel+ '" view-object-lenght="viewProp.viewObject[' + (selectLevel -1 ) + '].length"  view-object="viewProp.viewObject[' + (selectLevel -1 ) + ']" class="row" id="level-' + selectLevel+ '-content">' +
					'<div' + ctrl + ' class="row v4-prototype-card-container" style="width: 100%;" >' +
						// "<div class='card box-detail wrapper-detail'>" +
							"<div>" +
							"<div class='container-fluid v3-padding-0 box-detail-form'>" +
								"<div class='row v4-materialize-container' ng-repeat=\"item in groupUielemnt | orderBy: 'key'\">"+
									'<ui-element ng-repeat="uiElement in item.value track by $index" />' +
								"</div>" +
							"</div>" +
						"</div>" +
					"</div>" +
				"</div>";
		}
		// render static HTML
		else{
			layoutTemplate =
			'<div class="row v4-prototype-card-container label-section" card-reorder current-level = "' + selectLevel+ '" view-object-lenght="viewProp.viewObject[' + (selectLevel -1 ) + '].length" view-object="viewProp.viewObject[' + (selectLevel -1 ) + ']" id="level-' + selectLevel+ '-content">' +
				"<div class='card box-detail wrapper-detail'>" +
					"<div class='container-fluid v3-padding-0 box-detail-form'>" + objs + "</div>" +
				"</div>" +
			"</div>";
		}

		var appendEle = undefined;// where the new layout will be append
		var parentElement = event.currentTarget.parentElement;
		var currOffsetTop = event.currentTarget.children[0].offsetTop;
		var siblingEles = parentElement.children;
		var siblingLen = siblingEles.length;

		/*
		 * var i = 0; for (; i < siblingLen; i++) {
		 * if(!commonService.hasValueNotEmpty(siblingEles[i].children))
		 * continue; if (siblingEles[i].children[0].offsetTop > currOffsetTop) {
		 * break; } appendEle = siblingEles[i]; }
		 * 
		 * //all cards are on the same height //append in the end of parent
		 * element if(i >= siblingLen){ appendEle = siblingEles[i - 1]; }
		 */
		
		
		// try to detect parent's position to render
		try {
			for (var i = 0; i < siblingLen; i++) {
				var eleID = siblingEles[i].id;
				var eleCardName = angular.element(document.getElementById(eleID)).scope().card.name;
				if(eleCardName === parentCard.name  && i === selectIndex) {
					appendEle = siblingEles[i];
					break;
				}
			}
		} catch(err) {
			console.log('cannot detect parent of section, reason: ' + err.message);
		}
		
		if(appendEle === undefined) {
			appendEle = siblingEles[siblingLen - 1];
		}
		// append new layout here
		// http://www.mattzeunert.com/2014/11/03/manually-removing-angular-directives.html
		var childScope = scope.$new();

		// add class for new layout
		// var currTargetEle =
		// angular.element(event.currentTarget).find('.card-element');
		// var arrowPositionX = event.currentTarget.children[0].offsetLeft +
		// event.currentTarget.children[0].offsetWidth/2 - 30;
		var compiledTemplate = $compile(layoutTemplate)(childScope);
		angular.element(appendEle).after(compiledTemplate);
		
		// remove border at middle section header and section content
		appendEle.children[0].classList.remove("label-section");
	

		// keep track of appendEle
		if(scope.viewProp.historySelect[selectLevel - 1]){
			scope.viewProp.historySelect[selectLevel - 1].refChildHtml = compiledTemplate;
			scope.viewProp.historySelect[selectLevel - 1].childScope = childScope;
		}
		/*
		 * var currBackgroundColor = currTargetEle.css("background-color");
		 * if(currBackgroundColor == "rgba(0, 0, 0, 0)"){ var
		 * currBackgroundColor = currTargetEle.css("color"); }
		 */

		compiledTemplate.css('width', '100%');
		compiledTemplate.css('clear', 'both');
		// var borderProp="2px solid "+currBackgroundColor;
		compiledTemplate.addClass('animated zoomIn');
		// var boxDetailEle = compiledTemplate.find('.box-detail');
	// boxDetailEle.css('border-top',borderProp);
		// boxDetailEle.before("<span class='arrow-container-card'
		// style='left:"+arrowPositionX+"px;
		// border-right:"+currBackgroundColor+"2px
		// solid;border-top:"+currBackgroundColor+"2px solid;'></span>");
		
		// check to open tab
		if(needOpenTab) {
			needOpenTab = false;
			self.openFirtTabAutomatically(scope, selectLevel);
		}
	};
	
	
	UiFrameworkService.prototype.renderNewTabAutomatically = function renderNewTabAutomaticly (uiStyle, parentElement, selectLevel, selectIndex, refDocType, objs, scope, refBusinessType, refProductName) {
		var self = this;
		var needOpenTab = false;
		var ctrl = '';
		if(refDocType)
			ctrl = ' ng-controller="' + genCtrlName('detail', refDocType, refProductName, refBusinessType) + '"';

		var layoutTemplate = undefined;

		// if objs is undefined, means new row of cards
		if(!objs) {
			layoutTemplate = UiFrameworkService.prototype.buildHtmlElementInfo(uiStyle, ctrl, selectLevel);
			
			 if(uiStyle == 'tab') {
				 needOpenTab = true;
			 }

		}
		// render form HTML
		else if(uiRenderPrototypeService.isUiElementObj(objs[0])){
			scope.viewProp.uiElements = objs;
			scope.groupUielemnt = $filter('groupByLevel')(objs, "group");
			layoutTemplate =
				'<div card-reorder class="v4-prototype-card-container" current-level = "' + selectLevel+ '" view-object-lenght="viewProp.viewObject[' + (selectLevel -1 ) + '].length"  view-object="viewProp.viewObject[' + (selectLevel -1 ) + ']" class="row" id="level-' + selectLevel+ '-content">' +
					'<div' + ctrl + ' class="row v4-prototype-card-container" style="width: 100%;" >' +
						"<div class='card box-detail wrapper-detail'>" +
							"<div class='container-fluid v3-padding-0 box-detail-form'>" +
								"<div class='row v4-materialize-container' ng-repeat=\"item in groupUielemnt | orderBy: 'key'\">"+
									'<ui-element ng-repeat="uiElement in item.value track by $index" />' +
								"</div>" +
							"</div>" +
						"</div>" +
					"</div>" +
				"</div>";

		}
		// render static HTML
		else{
			layoutTemplate =
			'<div class="row v4-prototype-card-container" card-reorder current-level = "' + selectLevel+ '" view-object-lenght="viewProp.viewObject[' + (selectLevel -1 ) + '].length" view-object="viewProp.viewObject[' + (selectLevel -1 ) + ']" id="level-' + selectLevel+ '-content">' +
				"<div class='card box-detail wrapper-detail'>" +
					"<div class='container-fluid v3-padding-0 box-detail-form'>" + objs + "</div>" +
				"</div>" +
			"</div>";
		}

		var appendEle = undefined;// where the new layout will be append
		// var parentElement = event.currentTarget.parentElement;
		// var currOffsetTop = event.currentTarget.children[0].offsetTop;
		// var siblingEles = parentElement.children;
		var siblingEles = parentElement.children; 
		var siblingLen = siblingEles.length;
		
		appendEle = siblingEles[siblingLen - 1];
		// append new layout here
		// http://www.mattzeunert.com/2014/11/03/manually-removing-angular-directives.html
		var childScope = scope.$new();

		// add class for new layout
		// var currTargetEle =
		// angular.element(event.currentTarget).find('.card-element');
		// var arrowPositionX = event.currentTarget.children[0].offsetLeft +
		// event.currentTarget.children[0].offsetWidth/2 - 30;
		var compiledTemplate = $compile(layoutTemplate)(childScope);
		angular.element(appendEle).after(compiledTemplate);

		// keep track of appendEle
		if(scope.viewProp.historySelect[selectLevel - 1]){
			scope.viewProp.historySelect[selectLevel - 1].refChildHtml = compiledTemplate;
			scope.viewProp.historySelect[selectLevel - 1].childScope = childScope;
		}

		compiledTemplate.css('width', '100%');
		compiledTemplate.css('clear', 'both');
		compiledTemplate.addClass('animated zoomIn');
		
       // check to open tab
		if(needOpenTab) {
			needOpenTab = false;
			self.openFirtTabAutomatically(scope, selectLevel);
			/*
			 * $timeout(function () { var willOpenTabAtIndex =
			 * scope.getTabIndexToOpenAutomaticallyFromTabIndex(scope.viewProp.viewObject[selectLevel]);
			 * if(willOpenTabAtIndex === undefined) return; var willOpenTab =
			 * scope.viewProp.viewObject[selectLevel][willOpenTabAtIndex];
			 * scope.card = willOpenTab; var newSiblingLen =
			 * parentElement.children.length; var element =
			 * parentElement.children[newSiblingLen - 1];
			 * UiFrameworkService.prototype.OpenTabAutomatically(willOpenTab,
			 * selectLevel, willOpenTabAtIndex, element, scope);
			 * $timeout(function(){ scope.moveToCard(willOpenTab.name);
			 * willOpenTab.isSelected = true; }, 200); }, 200);
			 */
		}
	};
	
	
	/**
	 * get html of ui element by uiStyle value and selectLevel level
	 * 
	 * @param uiStyle
	 *            {string} must equal card, section, tab
	 * @param selectLevel
	 *            {int} level of card in json mock
	 */
	UiFrameworkService.prototype.buildHtmlElementInfo = function buildHtmlElementInfo(uiStyle, ctrl, selectLevel) {
		var eleHtml = undefined;
		var layoutTemplate = undefined;
		if(uiStyle) {
			// check valid of uiStyle
			if(!uiRenderPrototypeService.CONSTANTS.uiStyle.lstUITypeIsSupported.includes(uiStyle)) {
    			$log.error("uiStyle in section root is invalid: " + uiStyle);
    		} else {
    			switch(uiStyle) {
	  			  case "tab":
	  				  eleHtml = '<ui-tab-content' +  ' id="level-' + selectLevel+ '-card-{{$index}}" ng-repeat="card in viewProp.viewObject[' + selectLevel + '] track by $index" level="' + selectLevel + '" when-click="chooseTab(card, ' + selectLevel + ' , $index, clickEvent)" ng-init="cardIndex = $index + 1"/>';
	  				  var separateLineHtml = '<separate-line/>';
	  				  if(selectLevel == 1) {
	  					  eleHtml =  separateLineHtml + eleHtml + separateLineHtml
	  				  } else {
	  					  eleHtml =  eleHtml + separateLineHtml
	  				  }
	  				  break;
	  			  case "section":
	  				  eleHtml = '<ui-section-content' + ' id="level-' + selectLevel + '-card-{{$index}}" ng-repeat="card in viewProp.viewObject[' + selectLevel + '] track by $index" level="' + selectLevel + '" when-click="chooseSection(card, ' + selectLevel + ' , $index, clickEvent)" ng-init="cardIndex = $index + 1"/>';
	  				  break;
	  			  case "groupSecs":
	  				  eleHtml = '<div class="col-xs-12 v3-margin-top-10" >' +
	  				               '<ui-group-section-content' +  ' ng-repeat="card in viewProp.viewObject[' + selectLevel + '] track by $index" level="' + selectLevel + '"' + ' index="{{$index}}"/>' +
	  				             '</div>';
	  				  break;
		  		  case "quoCard":
		  			  // eleHtml = '<ui-quotation-card-content
						// class="quo-card-item"' + ' id="level-' + selectLevel
						// + '-card-{{$index}}" ng-repeat="card in
						// viewProp.viewObject[' + selectLevel + '] track by
						// $index" level="' + selectLevel + '"
						// when-click="chooseQuotationCard(card, ' + selectLevel
						// + ' , $index, clickEvent)" ng-init="cardIndex =
						// $index + 1"/>';
		  			  
		  			  // 2018-07-16 hle71 - break the Add Quotation button to
						// a new line
		  			  eleHtml = '<ui-quotation-card-content class="quo-card-item"' + ' id="level-' + selectLevel + '-card-{{$index}}" ng-repeat="card in viewProp.viewObject[' + selectLevel + '] track by $index" level="' + selectLevel + '" when-click="chooseQuotationCard(card, ' + selectLevel + ' , $index, clickEvent)" ng-if="card.cardType !== \'action\'"  ng-init="cardIndex = $index + 1"/>';
		  			  // quotation template
		  			  var quotationTemplate =
	   					  '<div class="row">' +
			  				  '<div card-reorder class="v4-prototype-card-container" ng-class="{\'label-section\' : uiStyle === \'section\'}" current-level = "' + selectLevel+ '" view-object-lenght="viewProp.viewObject[' + (selectLevel -1 ) + '].length" view-object="viewProp.viewObject[' + (selectLevel -1 ) + ']" id="level-' + selectLevel+ '-content">' +
		   						'<div' + ctrl + ' class="row v4-prototype-card-container" style="width: 100%;">' +
		   							'<div class="card box-detail wrapper-detail">' +
		   								'<div class="container-fluid v3-padding-0">' +
		   								     eleHtml +
		   								'</div>' +
		   							'</div>' +
		   						'</div>' +
		   					 '</div>' +
	   					 '</div>';
		  			  
		  			  // action template
		  			  var eleActionHtml = '<ui-quotation-action class="quo-card-item"' + ' id="level-' + selectLevel + '-card-{{$index}}" ng-repeat="card in viewProp.viewObject[' + selectLevel + '] track by $index" level="' + selectLevel + '" when-click="chooseQuotationCard(card, ' + selectLevel + ' , $index, clickEvent)" ng-if="card.cardType === \'action\'" ng-init="cardIndex = $index + 1"/>';
		  			  var actionTemplate = 
			  				'<div class="row" id="AddQuotationDivId">' + 
			  					'<div current-level = "' + selectLevel+ '" view-object-lenght="viewProp.viewObject[' + (selectLevel -1 ) + '].length" view-object="viewProp.viewObject[' + (selectLevel -1 ) + ']" id="level-' + selectLevel+ '-content">' +
			   						'<div' + ctrl + ' class="col-xs-12" style="width: 100%;">' +
			   								eleActionHtml +
			   						'</div>' +
		   						'</div>' +
		   					 '</div>';
		  			  layoutTemplate = '<div>' + quotationTemplate + actionTemplate + '</div>';
		  			  return layoutTemplate;
		  			  // break;
		  		  case "card":
		  			  eleHtml = '<card' + ' id="level-' + selectLevel + '-card-{{$index}}" ng-repeat="card in viewProp.viewObject[' + selectLevel + '] track by $index" level="' + selectLevel + '" when-click="chooseCard(card, ' + selectLevel + ' , $index, clickEvent)" ng-init="cardIndex = $index + 1"/>';
		  			  break;
	  				  
	  				  // <ui-group-section-content ng-repeat="card in
						// viewProp.viewObject[0] track by $index" level="0"
						// index="{{$index}}"></ui-group-section-content>
	  				  break;
	  			  default:
	  				  break;
	  			}
    			
    			if(eleHtml) {
    			   layoutTemplate =
    					 '<div card-reorder class="v4-prototype-card-container" ng-class="{\'label-section\' : uiStyle === \'section\'}" current-level = "' + selectLevel+ '" view-object-lenght="viewProp.viewObject[' + (selectLevel -1 ) + '].length" view-object="viewProp.viewObject[' + (selectLevel -1 ) + ']" id="level-' + selectLevel+ '-content">' +
    						'<div' + ctrl + ' class="row v4-prototype-card-container" style="width: 100%;">' +
    							'<div class="card box-detail wrapper-detail">' +
    								'<div class="container-fluid v3-padding-0">' +
    								     eleHtml +
    								'</div>' +
    							'</div>' +
    						'</div>' +
    					 '</div>';
    			}
    		}
		} else {
			$log.error("Value of uiStyle key is not found");
		}
		return layoutTemplate;
	}
	
	
	/**
	 * getRemovingCardInfo
	 * 
	 * @description get information of the removing card icon
	 * @param scope
	 *            {Object}
	 * @param iconsInfo
	 *            {Object}
	 * @return rmvCardInfo {Object} include visible value and onClick value
	 */
	UiFrameworkService.prototype.getRemovingCardInfo = function getRemovingCardInfo(scope, iconsInfo) {
		var rmvCardInfo = undefined;
		if(iconsInfo !== undefined && iconsInfo.removeCardInList !== undefined) {
			rmvCardInfo = {"isVisible": true, "onClick": iconsInfo.removeCardInList.onClick};
			var isVisible = iconsInfo.removeCardInList.isVisible;
			if(isVisible) {
				var isTmpVisible = angular.copy(isVisible).toLowerCase();
				if(isTmpVisible !== 'false' && isTmpVisible !== 'true') {
					// It's a function
					isTmpVisible = scope.$eval(isVisible);
				}
				rmvCardInfo.isVisible = isTmpVisible;
			} 
		}
		return rmvCardInfo;
	}
	
	
	// ////////////////////////// END
	// ////////////////////////////////////////////

	UiFrameworkService.prototype.chooseSection = function chooseSection(card, selectLevel, selectIndex, event, scope, requestURL) {
		var self = this;
		loadingBarService.showLoadingBar();

		// toggle class for summary
		if(commonService.options.cardTouchMode){
			if(card.cardStatus != "detail"){
				return;
			}
		}

		var viewObj = scope.viewProp.viewObject;
		var historySelect = scope.viewProp.historySelect;

		this.checkClosingSection(card, selectLevel, scope).then(function checkedCloseCard (result) {
			if(result !== 'stop'){
				uiRenderPrototypeService.getChildContentOfUiStructure(viewObj[selectLevel][selectIndex], requestURL)
				.then(function gotNextUiObj (result) {

					// "result" will be "undefined" if clicking on an action
					// which will executing a function
					if(result){
						var refDocType = viewObj[selectLevel][selectIndex].getRefDocTypeInDetail();


						if(
							viewObj[selectLevel][selectIndex].children.length !== 0 // if
																					// there
																					// are
																					// any
																					// children
																					// or
																					// uiEle,
																					// won't
																					// load
																					// other
																					// doctypes
							|| viewObj[selectLevel][selectIndex].uiEle.length !== 0// because
																					// we
																					// priority
																					// jsonMock
																					// declaration
							// (Eg: in FNA, Client & Joint Applicant will open
							// views of FNA document, not open prospect doctype
							){
							refDocType = undefined;
						}

						var uiEles = undefined;

						// there will be new cards
						if(uiRenderPrototypeService.isUiStructureObj(result[0])){
							self.isOpenedDetail = false;
							 viewObj[selectLevel + 1] = result;
						}
						// static HTML or HTML form
						else{
							self.isOpenedDetail = true;
							uiEles = result;
						}
						self.updateHistorySelectObjSection(selectLevel, selectIndex, scope);
						self.renderNewSectionRow(event, selectLevel + 1, selectIndex, refDocType, uiEles, scope);
					}
					loadingBarService.hideLoadingBar();
				});

			}
			else
				loadingBarService.hideLoadingBar();
		});
	};
    
	UiFrameworkService.prototype.checkClosingSection = function checkClosingSection(willOpenCard, willOpenLevel, scope) {
		var self = this;
		var historySelect = scope.viewProp.historySelect;
		// var message = 'Choose YES if you want to save the current content
		// before opening document. If NO, the new content will be reset.'
		var defer = scope.moduleService.$q.defer();


		function checkNeedToSaveDetail(openingCard) {
			// openingCard: card is opening on screen, which we're going to
			// close it
			// willOpenCard: card which will be opened
			var defer = scope.moduleService.$q.defer();

			if( self.isAllowNavAutoSave() &&
				(
					// if root is different --> it's a different documents
					// or willOpenCard will open other doctype, need to check
					// for saving detail
					openingCard.root !== willOpenCard.root ||

					// if user wants to open new doctype, need to save the old
					// one
					willOpenCard.getRefDocTypeInDetail()
				)
				&& openingCard.root.isDetailChanged){

				var oldDocType = openingCard.getRefDocTypeOfRoot();
				var currUiService = uiRenderPrototypeService.getUiService(oldDocType);

				if (currUiService) {
					// we need oldScope, so in saveDetailNotCompute() can get
					// the parents uiStructure for autosave
					var oldScope = openingCard.getCurrentAngularScope();

					UiFrameworkService.prototype.saveDetailNotCompute.call(oldScope, currUiService).then(function () {

						commonUIService.showNotifyMessage('v3.mynewworkspace.message.'
							+ scope.getCorrectDoctype(currUiService) + '.autosave.success', "success", 3000);
						defer.resolve();
						openingCard.root.isDetailChanged = false;
					}, function () {
						commonUIService.showNotifyMessage("v3.mynewworkspace.message.SaveAutomatically" + " "
							+ scope.getCorrectDoctype(currUiService) + "v3.mynewworkspace.message.unsuccessful" , "unsuccessful", 3000);
						defer.reject();
					});
				} else {
					$log.error("Can't get uiService of doctype: " + oldDocType);
					defer.resolve();
				}
			}else{
				defer.resolve();
			}

			return defer.promise;
		}

		// if lastSelectedInfo has linkChildUiStructure, it need to be it
		var linkCUiStructure = uiRenderPrototypeService.getLinkChildUiStructure(willOpenCard);
		var lastSelectedCard = linkCUiStructure ? linkCUiStructure : willOpenCard;
		checkNeedToSaveDetail(willOpenCard).then(function() {
			// if close an opening card
			if(willOpenCard.isSelected != true){
				// if click on an opened card, simple close its children and do
				// no more
					self.closeChildSections(willOpenCard, willOpenLevel, scope);
				if(commonService.options.cardTouchMode){
					willOpenCard.cardStatus = "start";
				}
				defer.resolve('stop');
			}else{
				defer.resolve();
			}
		});
		// }else
		return defer.promise;
	};

	/**
	 * @author: tphan37 date: 17-Dec-2015 Internal fn called by
	 *          {@code chooseCard()} Check whether need to close card, show
	 *          message for saving detail or not
	 * 
	 * NOTE: Selecting card: Card is selecting by user Opening card: cards are
	 * openning on screen, include old selected cards
	 * @param {Object}
	 *            willOpenCard card's just selected by user, is going to open
	 * @param {Integer}
	 *            willOpenLevel level of select
	 * @return {Object} angular promise
	 */
	UiFrameworkService.prototype.checkClosingCard = function checkClosingCard(willOpenCard, willOpenLevel, scope) {
		var self = this;
		var historySelect = scope.viewProp.historySelect;
		// var message = 'Choose YES if you want to save the current content
		// before opening document. If NO, the new content will be reset.'
		var defer = scope.moduleService.$q.defer();

		function checkNeedToSaveDetail(oldScope, openingCard) {
			// openingCard: card is opening on screen, which we're going to
			// close it
			// willOpenCard: card which will be opened
			var defer = scope.moduleService.$q.defer();

			// store new isDetailChanged to local storage
			if (openingCard) {
				uiRenderPrototypeService.updateShellUiStructureToStorage(openingCard.root);
			}

			if (// Check allow auto save
				self.isAllowNavAutoSave() &&

				(
					// if root is different --> it's a different documents
					// or willOpenCard will open other doctype, need to check
					// for saving detail
					(openingCard && openingCard.root !== willOpenCard.root && openingCard.root.refDetail.id !== willOpenCard.root.refDetail.id) ||

					// if user wants to open new doctype, need to save the old
					// one
					willOpenCard.getRefDocTypeInDetail()
				) &&

				// check dirty change
				!oldScope.moduleService.compareData(oldScope.moduleService.detail, oldScope.moduleService.originalDetail)) {

				var oldDocType = oldScope.moduleService.name;
				var currUiService = uiRenderPrototypeService.getUiService(oldDocType);
				if (currUiService) {
					var saveDetailAdditionalParams = {
						bUpdateLocationSearch: true,
						locationParams: {
							locationDocType: $state.params.docType,
							locationService: $location
						}
					};
					UiFrameworkService.prototype.saveDetailNotCompute.call(oldScope, currUiService, saveDetailAdditionalParams).then(function () {
						commonUIService.showNotifyMessage('v4.' + scope.getCorrectDoctype(currUiService) + '.message.autoSaveSuccessfully', "success", 3000);
						defer.resolve();
					}, function () {
						commonUIService.showNotifyMessage('v4.' + scope.getCorrectDoctype(currUiService) + '.message.autoSaveUnsuccessfully', "unsuccessful", 3000);
						defer.reject();
					});
				} else {
					$log.error("Can't get uiService of doctype: " + oldDocType);
					defer.resolve();
				}
			} else {
				defer.resolve();
			}

			return defer.promise;
		}

		var lastSelectedInfo = historySelect.lastObj();
		var currCardDocType = scope.moduleService.name;
		var willOpenCardDocType = willOpenCard.getRefDocTypeInDetail();
		if (!commonService.hasValueNotEmpty(willOpenCardDocType)) {
			if (willOpenCard.scope &&
				willOpenCard.scope.moduleService) {
				willOpenCardDocType = willOpenCard.scope.moduleService.name;
			}
		}
		if (lastSelectedInfo) {
			var currCardUiStructure = lastSelectedInfo.refUiStructure;
			if (currCardUiStructure &&
				currCardUiStructure.refDetail &&
				currCardUiStructure.refDetail.refType) {
				currCardDocType = currCardUiStructure.refDetail.refType.value;
			}
		}
		if (currCardDocType !== willOpenCardDocType || lastSelectedInfo) {
			var oldScope = scope;
			var lastSelectedCard, linkCUiStructure;
			if (lastSelectedInfo) {
				lastSelectedCard = lastSelectedInfo.refUiStructure;
				// if lastSelectedInfo has linkChildUiStructure, it need to be
				// it
				linkCUiStructure = uiRenderPrototypeService.getLinkChildUiStructure(lastSelectedCard);
				lastSelectedCard = linkCUiStructure ? linkCUiStructure : lastSelectedCard;
				// we need oldScope, so in saveDetailNotCompute() can get the
				// parents uiStructure for autosave
				var lastSelectedCardScope = lastSelectedCard.getCurrentAngularScope();
				if (lastSelectedCardScope) {
					oldScope = lastSelectedCardScope;
				}
			}

			checkNeedToSaveDetail(oldScope, lastSelectedCard).then(function () {
				// if close an opening card
				if (historySelect[willOpenLevel]) {

					var selectedCard = historySelect[willOpenLevel].refUiStructure;
					
					// close child of opening card
					self.closeChildCards(willOpenLevel, scope);
					if (commonService.options.cardTouchMode) {
						willOpenCard.cardStatus = "start";
					}
					
					// unselected card after close card, so check isSelected to
					// false
					selectedCard.isSelected = false;

					// if click on an opened card, simple close its children and
					// do no more
					if (selectedCard === willOpenCard) {
						defer.resolve('stop');
					} else {
						// delay wait for last open row is remove completely
						$timeout(function () {
							defer.resolve();
						}, 200);
					}
				} else
					defer.resolve();
			});
		} else
			 defer.resolve();

		return defer.promise;
	};

	/**
	 * Setup HTML for action bar and its controller
	 */
	UiFrameworkService.prototype.setupActionBar = function setupActionBar (refDocType, businessType, scope) {
		// support sideBar summary
		if (scope.moduleService.customSlideBar != undefined) {
			scope.viewProp.currentModule = scope.moduleService.customSlideBar;
		}
		else {
			scope.viewProp.currentModule = refDocType;
		}
		loadingBarService.showLoadingBar();
		uiRenderPrototypeService.getActionBarHtml(refDocType, businessType).then(function gotHtml(html){
			$log.debug("Render action bar with ctrl: " + scope.name);
			var a = $.parseHTML(html.data);
			var saveButtonEle = $(a).find(".fa-database").parent();

			var ngClick = saveButtonEle.attr("ng-click");
			// TODO: ngClick = 'uiStructureRoot.isDetailChanged = false;' +
			// ngClick;
			saveButtonEle.attr('loading-action', ngClick);

			// var ngClass = "{'common-action-disabled':
			// !uiStructureRoot.isDetailChanged}";
			// saveButtonEle.attr('ng-class', ngClass);

			var compiledActionBar = $compile(a)(scope);
			scope.html.actionBarEle = angular.element('action-bar');

			// for issue can not compile action bar when switch between modules
			if(scope.html.actionBarEle.length > 1){
				scope.html.actionBarEle.splice(1, 1);
			}
			// remove all children
			// nle32: clear content of action bar
			$("action-bar").empty();
			scope.html.actionBarEle.append(compiledActionBar);
			$('#showMore').fadeOut();
			loadingBarService.hideLoadingBar();
		});
	};

	/**
	 * Setup HTML for action bar and its controller for Direct Sale
	 */
	UiFrameworkService.prototype.setupSidePanelDS = function setupActionBarDS (refDocType, businessType, scope) {
		var viewProp = scope.viewProp;
		var htmlPanelFileType = 'side';
		uiRenderPrototypeService.getPanelHtmlDS(refDocType, businessType, htmlPanelFileType, scope).then(function gotHtml(html){
			scope.uiFrameworkService.gotHtmlDS(html, htmlPanelFileType, scope);
		});
	};

	UiFrameworkService.prototype.setupBottomPanelDS = function setupActionBarDS (refDocType, businessType, scope) {
		var viewProp = scope.viewProp;
		var htmlPanelFileType = 'bottom';
		uiRenderPrototypeService.getPanelHtmlDS(refDocType, businessType, htmlPanelFileType, scope).then(function gotHtml(html){
			scope.uiFrameworkService.gotHtmlDS(html, htmlPanelFileType, scope);
		});
	};

	/**
	 * Process action bar html for Direct Sale
	 */
	UiFrameworkService.prototype.gotHtmlDS = function gotHtmlDS (html, htmlPanelFileType, scope) {
		$log.debug("Render action bar with ctrl: " + scope.name);
		var a = $.parseHTML(html.data);
		var viewProp = scope.viewProp;
		var saveButtonEle = $(a).find(".apply-button");
		var ngClick = saveButtonEle.attr("ng-click");
		ngClick =  'uiStructureRoot.isDetailChanged = false;' + ngClick;
		var ngClass = "{'common-action-disabled': !uiStructureRoot.isDetailChanged}"

		saveButtonEle.attr('ng-click', ngClick);
		saveButtonEle.attr('ng-class', ngClass);

		var refreshButtonEle = $(a).find(".fa-repeat").parent();
		refreshButtonEle.addClass("common-action-disabled");

		var compiledActionBar = $compile(a)(scope);

		// select action bar for DS or AS
		if(scope.uiFrameworkService.isSectionLayout(viewProp)){
			if(htmlPanelFileType == 'side') {
				scope.html.panelEle = angular.element('side-pannel');
			}
			if(htmlPanelFileType == 'bottom') {
				scope.html.panelEle = angular.element('bottom-pannel');
			}
		} else {
			scope.html.panelEle = angular.element('action-bar');
		}
		// for issue can not compile action bar when switch between modules
		if(scope.html.panelEle.length > 1){
			scope.html.panelEle.splice(1, 1);
		}
		// remove all children
		if(scope.uiFrameworkService.isSectionLayout(viewProp)){
			if(htmlPanelFileType == 'side') {
				$("side-pannel").empty();
			}
			if(htmlPanelFileType == 'bottom') {
				$("bottom-pannel").empty();
			}
		} else {
			$("action-bar").empty();
		}

		scope.html.panelEle.append(compiledActionBar);
		$('#showMore').fadeOut();
	};

	/**
	 * add this ctrl to history
	 * 
	 * @return {[type]} [description]
	 */
	UiFrameworkService.prototype.registerToHistoryCtrl = function registerToHistoryCtrl(scope) {
		var uiStructureRoot = undefined;
		var viewProp = scope.viewProp;
		var lastSelect = undefined;

		// get the link children uiStructure from the last selected obj (which
		// has been loaded successfully)
		if(viewProp.historySelect.length > 0){
			if (this.isSectionLayout(viewProp)) {
				if ((viewProp.historySelect.length !== 1) && (viewProp.lastSelectStep)) {
					lastSelect = viewProp.lastSelectStep;
				} else {
					lastSelect = this.getLastStepInHistory(viewProp.historySelect,viewProp.historySelect.length - 1)
				}
			} else {
				lastSelect = viewProp.historySelect.lastObj();
			}
			uiStructureRoot = lastSelect.refUiStructure.linkCUiStructure;
		}
		// if historySelect is empty --> get the main current uiStructure
		else{
			uiStructureRoot = scope.uiStructureRoot;
		}

		scope.isMainCtrl = {};// indicate this ctrl is main-ctrl of the view,
								// using for getAssociateUiStructureRoot()
		scope.uiStructureRoot = uiStructureRoot;// setup uiStructureRoot for
												// this uiStructure

		// keep track ctrl
		scope.viewProp.historyCtrl.push({
			"ctrl": scope,
			"uiStructureRoot" : uiStructureRoot
		});
	};
	
	/**
	 * The caller ctrl can be anywhere, use this function to find the main ctrl
	 * in charge (eg: Case, illustration, application,...)
	 * 
	 * @return {Object} Main ctrl in charge
	 */
	UiFrameworkService.prototype.getCtrlInCharge = function getCtrlInCharge(scope) {
		var mainCtrl = scope;
		while(mainCtrl.hasOwnProperty('isMainCtrl') !== true){
			mainCtrl = mainCtrl.$parent;
			if(!mainCtrl)
				break;
		}

		return mainCtrl;
	};

	UiFrameworkService.prototype.closeChildCards = function closeChildCards(closeLevel, scope) {
		var self = this;
		var viewProp = scope.viewProp;
		var viewObj = scope.viewProp.viewObject;
		var historySelect = scope.viewProp.historySelect;
		var closeLevelRefDocType = undefined;
		var closeLevelBusinessType = undefined;
		var currCardRefDocType = undefined;// current refDocType of newest
											// child
		if(historySelect[closeLevel]) {
			var indexOfOpenedCardOfselectLevel = historySelect[closeLevel].index;

			closeLevelRefDocType = historySelect[closeLevel].refDocType;
			closeLevelBusinessType = historySelect[closeLevel].refUiStructure.root.businessType;

			currCardRefDocType = historySelect.lastObj().refDocType;
			var isOpenOtherDocType = historySelect.lastObj().refUiStructure.getRefDocTypeInDetail() ? true : false;


			// if close card with difference refdoctype then render new action
			// bar
			// or opening another docType (eg: illustration card in case when
			// opening "illustrations" (case) card)
			if (closeLevelRefDocType !== currCardRefDocType || isOpenOtherDocType) {
				var ctrlInCharge = self.getCtrlInCharge(scope);
				if (self.isSectionLayout(this.viewProp) === false)
					self.setupActionBar(closeLevelRefDocType, closeLevelBusinessType, ctrlInCharge);
			}

			// Update scrollTop for close Child Element
			var scrollAmount = self.calculateScrollAmountOnClose(closeLevel, historySelect, viewProp);
			self.scrollTop(scrollAmount);


			// handle 'onClose' code if existed
			if (historySelect[closeLevel].refUiStructure.onClose) {
				scope.$eval(historySelect[closeLevel].refUiStructure.onClose);
			}

			// update historySelect
			// uiRenderPrototypeService.getValidStatus(historySelect[closeLevel].refUiStructure);
			// uiRenderPrototypeService.updateParentStatusWithoutSectios(closeLevel,
			// indexOfOpenedCardOfselectLevel, viewObj);

			// If we're closing a card which loaded another doctype
			// --> need to release the another uiStructure
			if (this.isSectionLayout(viewProp)) {
				this.removeSection(historySelect[closeLevel].refChildHtml);
			} else {
				this.removeRow(historySelect[closeLevel].refChildHtml);
			}

			historySelect[closeLevel].childScope.$destroy();
			viewObj.splice(closeLevel + 1, viewObj.length);
			historySelect.splice(closeLevel, historySelect.length);
		}
	};

	UiFrameworkService.prototype.closeChildSections = function closeChildSections(card ,closeLevel, scope){
		var self = this;
		var viewProp = scope.viewProp;
		var viewObj = scope.viewProp.viewObject;
		var historySelect = scope.viewProp.historySelect;
		var closeLevelRefDocType = undefined;
		var closeLevelBusinessType = undefined;
		var currCardRefDocType = undefined;// current refDocType of newest
											// child

		// handle 'onClose' code if existed
		if(card.onClose){
			self.$eval(card.onClose);
		}

		if (this.isSectionLayout(viewProp)) {
			var pPrevious = undefined;
			var pCurrent = historySelect[closeLevel];
			var isFound = false;
			while (pCurrent != undefined) {
				if (card._id == pCurrent.refUiStructure._id) {
					isFound = true;
					break;
				} else {
					pPrevious = pCurrent;
					pCurrent = pCurrent.stepLink;
				}
			}
			if (isFound) {
				if (historySelect[closeLevel].stepLink == undefined) {
					viewObj.splice(closeLevel + 1, viewObj.length);
					historySelect.splice(closeLevel, historySelect.length);
				} else {
					if (pPrevious) {
						pPrevious.stepLink = pCurrent.stepLink;
					} else {
						historySelect[closeLevel] = pCurrent.stepLink;
					}

					var removeArray = [card._id];
					if (card.linkCUiStructure) {
						removeArray.push[card.linkCUiStructure._id]
					}
					if (closeLevel == historySelect.length) {
						for (var i = closeLevel + 1; i < historySelect.length; i++) {
							var pChildHead = historySelect[i];
							var pChildCurrent = pChildHead;
							var pChildPrevious = undefined;
							while (pChildCurrent) {
								var parentUIStructure = pChildCurrent.refUiStructure.parent;
								if (removeArray.indexOf(parentUIStructure._id) != -1) {
									removeArray.push(pChildCurrent.refUiStructure._id);
									if (pChildCurrent.refUiStructure.linkCUiStructure) {
										removeArray.push(pChildCurrent.refUiStructure.linkCUiStructure._id);
									}
									if (pChildPrevious == undefined) {
										pChildHead = pChildCurrent.stepLink;
									}
								} else {
									if (pChildPrevious == undefined) {
										pChildPrevious = pChildHead;
									} else {
										pChildPrevious.stepLink = pChildCurrent;
									}
								}
								pChildCurrent = pChildCurrent.stepLink
							}
						}
					}
				}
				this.removeSection(pCurrent.refChildHtml)
				pCurrent.childScope.$destroy();
			}
		} else {
			this.removeRow(historySelect[closeLevel].refChildHtml);
			historySelect[closeLevel].childScope.$destroy();
			viewObj.splice(closeLevel + 1, viewObj.length);
			historySelect.splice(closeLevel, historySelect.length);
		}
	};

	/**
	 * @author: tphan37 date: 18-Dec-2015 Save detail and show messages success
	 *          or not Automatic calling the parent document for saving
	 * @param {Object}
	 *            currUiService moduleSerice will using to save this document
	 * @param {Object}
	 *            flags which (bool) bCompute will compute this document when
	 *            saving {bool} bShowSavedMessage will show message after saving
	 *            successful?
	 * @return {[type]} Angular promise
	 */
	UiFrameworkService.prototype.saveDetailNotCompute = function saveDetailNotCompute (currUiService, flags) {
		var self = this;
		currUiService = currUiService || self.moduleService;
		var defer = currUiService.$q.defer();

		// if flags empty, create empty obj
		flags = flags || {};

		// we switch to use "pCtrl.uiStructureRoot.refDetail" instead of
		// "pCtrl.moduleService.detail"
		// for multi details per uiService purpose

		// caution, much getting current document id in
		// self.uiStructureRoot.refDetail
		var currUiRootDocId = currUiService.findElementInElement(self.uiStructureRoot.refDetail, ['id']);

		// getting current docId of detail of current uiService
		var currUiServiceDocId = currUiService.findElementInDetail(['id']);

		// perform save draft detail of current uiStructureRoot
		currUiService.saveDocument(
			self.requestURL,
			currUiService.name,
			currUiRootDocId,
			self.uiStructureRoot.refDetail)
		.then(function success(savedDetail) {

			// update saved detail to UI structure, and autosave parent
			if (currUiService.isSuccess(savedDetail)) {

				// getting saved detail docId
				var savedDetailDocId = currUiService.findElementInElement(savedDetail, ['id']);

				// update saved detail to moduleService detail
				if (currUiRootDocId === currUiServiceDocId ||
					!commonService.hasValueNotEmpty(currUiRootDocId)) {
					currUiService.detail = savedDetail;
					currUiService.originalDetail = angular.copy(savedDetail);

					// reSetup new detail
					uiRenderPrototypeService.reSetupConcreteUiStructure(
						self.uiStructureRoot,
						currUiService.detail,
						self.requestURL,
						commonService.CONSTANTS.UI_STRUCTURE.NOT_REMOVE_TEMPLATE_CHILDREN,
						commonService.CONSTANTS.UI_STRUCTURE.EXPECTED_DETAIL_NOT_CHANGED
					);
				}

				// if uiStructure root and moduleService hold different docType,
				// only update uiStructure root
				else {
					self.uiStructureRoot.refDetail = savedDetail;

					// async update if current docId from uiService switch to
					// uiRoot
					if (savedDetailDocId === currUiService.findElementInDetail(['id'])) {
						currUiService.detail = self.uiStructureRoot.refDetail;
						currUiService.originalDetail = angular.copy(self.uiStructureRoot.refDetail);

						// reSetup detail
						uiRenderPrototypeService.reSetupConcreteUiStructure(
							self.uiStructureRoot,
							currUiService.detail,
							undefined,
							commonService.CONSTANTS.UI_STRUCTURE.NOT_REMOVE_TEMPLATE_CHILDREN,
							commonService.CONSTANTS.UI_STRUCTURE.EXPECTED_DETAIL_NOT_CHANGED);
					} else {
						uiRenderPrototypeService.reSetupConcreteUiStructure(
								self.uiStructureRoot,
								self.uiStructureRoot.refDetail,
								undefined,
								commonService.CONSTANTS.UI_STRUCTURE.NOT_REMOVE_TEMPLATE_CHILDREN,
								commonService.CONSTANTS.UI_STRUCTURE.EXPECTED_DETAIL_NOT_CHANGED);
					}
				}

				// need to find its parent document on the screen and update it
				var pCtrl = self.getParentCtrlInCharge();
				if (pCtrl) {
					var pElement = self.getRightDetailInMultipleEleFromParentDoc();
					if (pElement &&
						pElement.refId &&
						pElement.refType &&
						pElement.refType.value === currUiService.name) {

						// store original parent detail to compare dirty change
						var pOriginalDetail= angular.copy(pCtrl.uiStructureRoot.refDetail);

						// Update ref values of parent detail
						pElement.refId.value = savedDetailDocId;
						pElement.refDocName.value = currUiService.findElementInDetail(['docName']).value;
						pElement.refVersion.value =currUiService.findElementInDetail(['version']);
						pElement.refBusinessType.value = currUiService.findElementInDetail(['businessType']).value;
					//	pElement.status.value = currUiService.findElementInDetail(['documentStatus']).value;
						if (pCtrl.updateRefBusinessDetail && typeof pCtrl.updateRefBusinessDetail === 'function') {
							pCtrl.updateRefBusinessDetail(pCtrl.uiStructureRoot.refDetail);
						}

						// Check for dirty change then save detail
						if (pCtrl.uiStructureRoot.isDetailChanged || !pCtrl.moduleService.compareData(pCtrl.uiStructureRoot.refDetail, pOriginalDetail)) {
							pCtrl.saveDetailNotCompute.call(pCtrl, pCtrl.moduleService, {
								bShowSavedMessage: false, // save of parent
															// will silent
															// notify
								bUpdateLocationSearch: flags.bUpdateLocationSearch,
								locationParams: flags.locationParams
							}).then( function () {
								if (pCtrl.evalRefDetail(pCtrl.uiStructureRoot)) {
									pCtrl.markValidStatus(pCtrl.uiStructureRoot);
								}
							});
						}
					}
				}

				// show success notify messages
				if (flags.bShowSavedMessage) {
					commonUIService.showNotifyMessage('v4.' + self.getCorrectDoctype(currUiService) + '.message.autoSaveSuccessfully', 'success');
				}

				// check need to update docId in url
				if (flags.bUpdateLocationSearch) {
					var currUiDocType = currUiService.name;
					var currUiDocId = savedDetailDocId;
					if (flags.locationParams) {
						var locationDocType = flags.locationParams.locationDocType;
						var locationService = flags.locationParams.locationService;
						if (currUiDocType === locationDocType) {
							var oldSearch = locationService.search();

							// only update docId to URL when old URL didn't have
							// docId
							// prevent case of parent and children have the same
							// docType
							if (!commonService.hasValueNotEmpty(oldSearch.docId)) {
								locationService.search(angular.extend({}, oldSearch, {
									docId: currUiDocId
								}));
							}
						}
					}
				}
			}

			// save unsuccessfully
			else {
				// show fail notify messages
				if (flags.bShowSavedMessage) {
					commonUIService.showNotifyMessage('v4.' + self.getCorrectDoctype(currUiService) + '.message.autoSaveUnsuccessfully');
				}
			}
			defer.resolve();
		}).catch(function failed() {
			// show fail notify messages
			if (flags.bShowSavedMessage) {
				commonUIService.showNotifyMessage('v4.' + self.getCorrectDoctype(currUiService) + '.message.autoSaveUnsuccessfully');
			}
			defer.reject();
		});

		return defer.promise;
	};

	UiFrameworkService.prototype.calculateScrollAmountOnClose = function calculateScrollAmountOnClose(level, historySelect, viewProp) {
		var amount = 0;
		if (this.isSectionLayout(viewProp)) {
			if (level > 0){
				var parentCard = historySelect[level-1];
				amount = parentCard.refChildHtml.offset().top - 100;
			}
		} else {
			if(level > 1){
				var parentCard = historySelect[level-2];
				amount = parentCard.refChildHtml.offset().top - 60;
			}
		}
		return amount;
	};

	UiFrameworkService.prototype.calculateScrollAmountOnOpen = function calculateScrollAmountOnOpen(level, currentTarget, historySelect, viewProp) {
		var amount = 0;
		if(currentTarget.children.length > 0) {
			amount = currentTarget.children[0].offsetTop;
			if (this.isSectionLayout(viewProp)) {
				if (level > 1) {
					var parentCard = historySelect[level-1];
					amount = parentCard.refChildHtml.offset().top + amount - 80;
				} else {
					amount = 0;
				}
			} else {
				if(historySelect.length > 0 && level <= historySelect.lastObj().refUiStructure.level){
					var rowIndexOfSelectCard = Math.floor(historySelect.lastObj().index / 6);
					var valueOfPosittionIndex = rowIndexOfSelectCard * 200;
					amount = currentTarget.parentElement.offsetTop + valueOfPosittionIndex;
				}
			}
		}
		return amount;
	};

	UiFrameworkService.prototype.scrollTop = function scrollTop(offsetPosittion, speed) {
		speed = speed || 1500;
		$('html, body').stop().animate({
				scrollTop: offsetPosittion
			}, speed, 'swing'
		);
	};

	UiFrameworkService.prototype.isSectionLayout = function isSectionLayout(viewProp) {
		var style = viewProp ? viewProp.layoutStyle : this.getLayoutStyle();
		if (style == 'sec') {
			return true;
		} else {
			return false;
		}
	};

	
	UiFrameworkService.prototype.getLayoutStyle = function getLayoutStyle(refDocType) {
		if (typeof layoutStyle !== 'undefined') {
			if (refDocType !== "business_catalog") {
				return layoutStyle;
			}
		}
		return 'card';
	};

	UiFrameworkService.prototype.removeRow = function removeRows (htmlEle) {
		if(!htmlEle)
			return;

		this.isOpenedDetail = false;
		var eleList=$(htmlEle).siblings();
		eleList.each(function(){
			$(this).children().children().css('opacity','1');
		});
		var delay = function() {
			htmlEle.remove();
		};
		htmlEle.addClass('animated zoomOut animated-out');
		$timeout(delay, 200);
	};

	UiFrameworkService.prototype.removeSection = function removeSection (htmlEle) {
		if(!htmlEle)
			return;

		this.isOpenedDetail = false;
		var eleList=$(htmlEle).siblings();
		eleList.each(function(){
			$(this).children().children().css('opacity','1');
		});
		htmlEle.slideToggle(500);

		$timeout(function() {
			htmlEle.remove();
		}, 500);
	};

	/**
	 * @author: tphan37 date: 07-Jan-2016
	 * @return {Boolean} true if allow auto save when navigating
	 */
	UiFrameworkService.prototype.isAllowNavAutoSave = function isAllowNavAutoSave () {
		var result = false;
		if( commonService.options.autoSaveNavigating
			&& commonUIService.getActiveUserRole() !== commonService.CONSTANTS.USER_ROLES.GUEST // doesn't
																								// allow
																								// auto
																								// save
																								// if
																								// role
																								// is
																								// guest
			&& commonUIService.getActiveUserRole() !== commonService.CONSTANTS.USER_ROLES.POLICY_OWNER // doesn't
																										// allow
																										// auto
																										// save
																										// if
																										// role
																										// is
																										// policy
																										// owner

			){
			result = true;
		}
		return result;
	};

	UiFrameworkService.prototype.updateHistorySelectObj = function updateHistorySelectObj (selectLevel, selectIndex, scope) {
		var self = this;
		var viewProp = scope.viewProp;
		var viewObj = scope.viewProp.viewObject;
		var historySelect = scope.viewProp.historySelect;

		 // update the historySelect object
		if(historySelect.length == selectLevel){
			 historySelect.push(angular.copy(viewProp.historyObjTmpl));
		}
		historySelect[selectLevel].refUiStructure = viewObj[selectLevel][selectIndex];
		historySelect[selectLevel].index = selectIndex;

		// update the history of doctype
		if(selectLevel == 0){// if in first step, need to init the refDocType
								// value
			historySelect[selectLevel].refDocType = scope.uiStructureRoot.docParams.refDocType;
		}
		else{
			var prevRefDocType = historySelect[selectLevel - 1].refUiStructure.getRefDocTypeInDetail();
			if(prevRefDocType)
				historySelect[selectLevel].refDocType = prevRefDocType;
			else{
				historySelect[selectLevel].refDocType = historySelect[selectLevel - 1].refDocType;
			}
		}
	};

	UiFrameworkService.prototype.updateHistorySelectObjSection = function updateHistorySelectObjSection (selectLevel, selectIndex, scope) {
		var self = this;
		var viewProp = scope.viewProp;
		var viewObj = scope.viewProp.viewObject;
		var historySelect = scope.viewProp.historySelect;
		var historySelectObj = angular.copy(viewProp.historyObjTmpl);

		historySelectObj.refUiStructure = viewObj[selectLevel][selectIndex];
		historySelectObj.index = selectIndex;
		if(selectLevel == 0){
			historySelectObj.refDocType = scope.uiStructureRoot.docParams.refDocType;
		} else {
			var prevRefDocType = historySelect[selectLevel - 1].refUiStructure.getRefDocTypeInDetail();
			if(prevRefDocType) {
				historySelectObj.refDocType = prevRefDocType;
			} else {
				historySelectObj.refDocType = historySelect[selectLevel - 1].refDocType;
			}
		}

		 // update the historySelect object
		if(historySelect.length == selectLevel){
			historySelect.push(historySelectObj);
			viewProp.lastSelectStep = historySelectObj;
		} else {
			var lastItem = this.getLastStepInHistory(historySelect,selectLevel);
			lastItem.stepLink = historySelectObj;
			viewProp.lastSelectStep = historySelectObj;
		}
	};

	UiFrameworkService.prototype.getLastStepInHistory = function getLastStepInHistory(historySelect, level) {
		var item = historySelect[level];
		while (item.stepLink) {
			item = item.stepLink;
		}
		return item;
	};

	// TODO: It heavily depends on jquery, find a way to get out of this
	UiFrameworkService.prototype.renderNewSectionRow = function renderNewSectionRow (event, selectLevel, selectIndex, refDocType, objs, scope ) {
		var self = this;
		var ctrl = '';
		if(refDocType)
			ctrl = ' ng-controller="' + genCtrlName('detail', refDocType.split(';')[0]) + '"';

		var layoutTemplate = undefined;
		// if objs is undefined, means new row of cards
		if(!objs){
			layoutTemplate =
				 '<div card-reorder current-level = "' + selectLevel+ '" view-object-lenght="viewProp.viewObject[' + (selectLevel -1 ) + '].length" view-object="viewProp.viewObject[' + (selectLevel -1 ) + ']" id="level-' + selectLevel+ '-content">' +
			'<div' + ctrl + '>' +
				'<div class="box-detail wrapper-detail">' +
					'<div class="container-fluid v3-padding-0">' +
						'<section-card id="level-' + selectLevel + '-card-{{$index}}" ng-repeat="card in viewProp.viewObject[' + selectLevel + '] track by $index" level="' + selectLevel + '" when-click="chooseSection(card, ' + selectLevel + ' , $index, clickEvent)"/>' +
					'</div>' +
				'</div>' +
			'</div>' +
		  '</div>';
		}
		// render form HTML
		else if(uiRenderPrototypeService.isUiElementObj(objs[0])){
			// scope.viewProp.uiElements = objs;
			if (scope.viewProp.viewObject[selectLevel-1][selectIndex].linkCUiStructure) {
				layoutTemplate =
					'<div card-reorder current-level = "' + selectLevel+ '" view-object-lenght="viewProp.viewObject[' + (selectLevel -1 ) + '].length"  view-object="viewProp.viewObject[' + (selectLevel -1 ) + ']" class="row" id="level-' + selectLevel+ '-content">' +
						'<div' + ctrl + '>' +
							"<div class='col-xs-12 box-detail wrapper-detail'>" +
								"<div class='container-fluid v3-padding-0 box-detail-form'>" +
									'<ui-element ng-repeat="uiElement in viewProp.viewObject[' + (selectLevel-1) + '][' + selectIndex + '].linkCUiStructure.uiEle ' + 'track by $index" />' +
								"</div>" +
							"</div>" +
						"</div>" +
					"</div>";
			} else {
				layoutTemplate =
					'<div card-reorder current-level = "' + selectLevel+ '" view-object-lenght="viewProp.viewObject[' + (selectLevel -1 ) + '].length"  view-object="viewProp.viewObject[' + (selectLevel -1 ) + ']" class="row" id="level-' + selectLevel+ '-content">' +
						'<div' + ctrl + '>' +
							"<div class='col-xs-12 box-detail wrapper-detail'>" +
								"<div class='container-fluid v3-padding-0 box-detail-form'>" +
									'<ui-element ng-repeat="uiElement in viewProp.viewObject[' + (selectLevel-1) + '][' + selectIndex + '].uiEle ' + 'track by $index" />' +
								"</div>" +
							"</div>" +
						"</div>" +
					"</div>";
			}
		}
		// render static HTML
		else {
			layoutTemplate =
			'<div card-reorder current-level = "' + selectLevel+ '" view-object-lenght="viewProp.viewObject[' + (selectLevel -1 ) + '].length" view-object="viewProp.viewObject[' + (selectLevel -1 ) + ']" id="level-' + selectLevel+ '-content">' +
				"<div class='col-xs-12 box-detail wrapper-detail'>" +
					"<div class='container-fluid v3-padding-0 box-detail-form'>" + objs + "</div>" +
				"</div>" +
			"</div>";
		}

		var appendEle = undefined;// where the new layout will be append
		var parentElement = event.currentTarget.parentElement;
		var currOffsetTop = event.currentTarget.children[0].offsetTop;
		var siblingEles = parentElement.children;
		var childScope = scope.$new();
		var compiledTemplate = $compile(layoutTemplate)(childScope);

		if (selectLevel == 1) {
			appendEle = parentElement.parentElement;
			angular.element(appendEle).find('.section-column').append(compiledTemplate);
		}
		else {
			appendEle = siblingEles[selectIndex];
			angular.element(appendEle).find('.card-element').after(compiledTemplate);
			compiledTemplate.click(function(e) {
				e.stopPropagation();
			});
		}

		// keep track of appendEle
		if(scope.viewProp.historySelect[selectLevel - 1]){
			var recentItem = self.getLastStepInHistory(scope.viewProp.historySelect, selectLevel - 1);
			recentItem.refChildHtml = compiledTemplate;
			recentItem.childScope = childScope;
		}

		compiledTemplate.css('display', 'none');
		compiledTemplate.css('width', '100%');
		compiledTemplate.css('clear', 'both');
		$timeout(function() {
			compiledTemplate.slideToggle(500);
		}, 700);

		/*
		 * if(objs){ $timeout(function() {
		 * scope.moduleProspectPersonalService.tourGuideFirstLoginForUser("documentDetails"); },
		 * 1000); }else{ $timeout(function() { if(refDocType){
		 * scope.moduleProspectPersonalService.tourGuideFirstLoginForUser(refDocType.split(';')[0].capitalizeFirstLetter()); } },
		 * 1000); }
		 */
	};
    
	// TODO: It heavily depends on jquery, find a way to get out of this
	UiFrameworkService.prototype.renderNewCardsRow = function renderNewCardsRow (event, selectLevel, refDocType, objs, scope, refBusinessType, refProductName) {
		var self = this;
		var ctrl = '';
		if(refDocType)
			ctrl = ' ng-controller="' + genCtrlName('detail', refDocType, refProductName, refBusinessType) + '"';

		var layoutTemplate = undefined;

		// if objs is undefined, means new row of cards
		if(!objs){
			 layoutTemplate =
				 '<div card-reorder class="v4-prototype-card-container" current-level = "' + selectLevel+ '" view-object-lenght="viewProp.viewObject[' + (selectLevel -1 ) + '].length" view-object="viewProp.viewObject[' + (selectLevel -1 ) + ']" id="level-' + selectLevel+ '-content">' +
					'<div' + ctrl + ' class="row v4-prototype-card-container" style="width: 100%;">' +
						'<div class="card box-detail wrapper-detail">' +
							'<div class="container-fluid v3-padding-0">' +
								'<card id="level-' + selectLevel+ '-card-{{$index}}" ng-repeat="card in viewProp.viewObject[' + selectLevel + '] track by $index" level="' + selectLevel + '" when-click="chooseCard(card, ' + selectLevel + ' , $index, clickEvent)" ng-init="cardIndex = $index + 1"/>' +
							'</div>' +
						'</div>' +
					'</div>' +
				 '</div>';

		}
		// render form HTML
		else if(uiRenderPrototypeService.isUiElementObj(objs[0])){
			scope.viewProp.uiElements = objs;
			scope.groupUielemnt = $filter('groupByLevel')(objs, "group");
			layoutTemplate =
				'<div card-reorder class="v4-prototype-card-container" current-level = "' + selectLevel+ '" view-object-lenght="viewProp.viewObject[' + (selectLevel -1 ) + '].length"  view-object="viewProp.viewObject[' + (selectLevel -1 ) + ']" class="row" id="level-' + selectLevel+ '-content">' +
					'<div' + ctrl + ' class="row v4-prototype-card-container" style="width: 100%;" >' +
						"<div class='card box-detail wrapper-detail'>" +
							"<div class='container-fluid v3-padding-0 box-detail-form'>" +
								"<div class='row v4-materialize-container' ng-repeat=\"item in groupUielemnt | orderBy: 'key'\">"+
									'<ui-element ng-repeat="uiElement in item.value track by $index" />' +
								"</div>" +
							"</div>" +
						"</div>" +
					"</div>" +
				"</div>";

		}
		// render static HTML
		else{
			layoutTemplate =
			'<div class="row v4-prototype-card-container" card-reorder current-level = "' + selectLevel+ '" view-object-lenght="viewProp.viewObject[' + (selectLevel -1 ) + '].length" view-object="viewProp.viewObject[' + (selectLevel -1 ) + ']" id="level-' + selectLevel+ '-content">' +
				"<div class='card box-detail wrapper-detail'>" +
					"<div class='container-fluid v3-padding-0 box-detail-form'>" + objs + "</div>" +
				"</div>" +
			"</div>";
		}

		var appendEle = undefined;// where the new layout will be append
		var parentElement = event.currentTarget.parentElement;
		var currOffsetTop = event.currentTarget.children[0].offsetTop;
		var siblingEles = parentElement.children;
		var siblingLen = siblingEles.length;

		var i = 0;
		for (; i < siblingLen; i++) {
			if(!commonService.hasValueNotEmpty(siblingEles[i].children)) continue;
			if (siblingEles[i].children[0].offsetTop > currOffsetTop) {
				break;
			}
			appendEle = siblingEles[i];
		}

		// all cards are on the same height
		// append in the end of parent element
		if(i >= siblingLen){
			appendEle = siblingEles[i - 1];
		}


		// append new layout here
		// http://www.mattzeunert.com/2014/11/03/manually-removing-angular-directives.html
		var childScope = scope.$new();

		// add class for new layout
		var currTargetEle = angular.element(event.currentTarget).find('.card-element');
		var arrowPositionX = event.currentTarget.children[0].offsetLeft + event.currentTarget.children[0].offsetWidth/2 - 30;
		var compiledTemplate = $compile(layoutTemplate)(childScope);
		angular.element(appendEle).after(compiledTemplate);

		// keep track of appendEle
		if(scope.viewProp.historySelect[selectLevel - 1]){
			scope.viewProp.historySelect[selectLevel - 1].refChildHtml = compiledTemplate;
			scope.viewProp.historySelect[selectLevel - 1].childScope = childScope;
		}
		var currBackgroundColor = currTargetEle.css("background-color");
		if(currBackgroundColor == "rgba(0, 0, 0, 0)"){
		  var currBackgroundColor = currTargetEle.css("color");
		}

		compiledTemplate.css('width', '100%');
		compiledTemplate.css('clear', 'both');
		var borderProp="2px solid "+currBackgroundColor;
		compiledTemplate.addClass('animated zoomIn');
		var boxDetailEle = compiledTemplate.find('.box-detail');
		boxDetailEle.css('border-top',borderProp);
		// boxDetailEle.css('border-bottom',borderProp);
		// boxDetailEle.css('margin-bottom','-2px');
		boxDetailEle.before("<span class='arrow-container-card' style='left:"+arrowPositionX+"px; border-right:"+currBackgroundColor+"2px solid;border-top:"+currBackgroundColor+"2px solid;'></span>");
		// User Guide: if this card is the first time access, it will show User
		// Guide popover for Card
		/*
		 * if(objs){ $timeout(function() {
		 * scope.moduleProspectPersonalService.tourGuideFirstLoginForUser("documentDetails"); },
		 * 1000); }else{ $timeout(function() { if(refDocType){
		 * scope.moduleProspectPersonalService.tourGuideFirstLoginForUser(refDocType.split(';')[0].capitalizeFirstLetter()); } },
		 * 1000); }
		 */
	};

	/**
	 * setup some common variable and behavior for controller have datamodel
	 * (ipos v3 document) NOTE: need to have detail in 'moduleService' when
	 * calling this function
	 * 
	 * For screen doesn't have datamodel (payment, configuration screen,...)
	 * Please call setupCtrlWithoutDetail()
	 * 
	 * @param {String}
	 *            ctrlName name of the ctrl
	 * @param {Object}
	 *            moduleService UIService
	 * @return {Object} Angular Promise, success when got uiStructure
	 */
	UiFrameworkService.prototype.generalConfigCtrl = function generalConfigCtrl(ctrlName, moduleService, scope, isLoadJsonMock) {

		/**
		 * We came to this function through 3 ways: - New document (on document
		 * screen) - Open existing document (on document screen) - Open existing
		 * document (on other screen, like from case)
		 */

		var self = this;
		scope.name = ctrlName;
		scope.moduleService = moduleService;
		// self.moduleService.businessType = businessType;
		var defer = scope.moduleService.$q.defer();
		// var refDocType = self.getRefDocTypeFromParams();
		var refDocType, businessType, userRole, saleChannel;

		if(!scope.moduleService){
			$log.error('moduleService of ctrl: ' + ctrlName + " isn't declared");
			return;
		}

		self.printDebugInfo(scope);

		// var refDocType = self.moduleService.name;
		if(scope.$state.params.docType === scope.moduleService.name  || isLoadJsonMock == true ){
			if(scope.$state.params.docType !== 'quotation') {
				refDocType = UiFrameworkService.prototype.getRefDocTypeFromParams();
				businessType = $state.params.businessType;
				userRole = commonUIService.getActiveUserRole(scope.$state.params);
				saleChannel = commonUIService.getActiveSaleChannel();

				if(!scope.moduleService.detail)
					$log.error('moduleService.detail (ctrl: ' + self.name + ") isn't declared");

				// setup uiStructure of this docType
				UiFrameworkService.prototype.setupUiStructure.call(self,
					{   'refDocType': refDocType,
						'businessType': businessType,
						'userRole': userRole,
						'saleChannel': saleChannel,
						'docId': $state.params.docId,
						'productName': $state.params.productName
					},
					scope.moduleService.detail,
					scope)
				.then(function hadSetupUiStructure () {

					// keep track ctrl
					self.registerToHistoryCtrl(scope);
					scope.triggerAutoSaveLoop();
					defer.resolve();
				});
			} else {
				// process for standalone quotation
				if(localStorage.getItem('quotationType') === 'standalone') {
					// standalone quo
					refDocType = UiFrameworkService.prototype.getRefDocTypeFromParams();
					businessType = $state.params.businessType;
					userRole = commonUIService.getActiveUserRole(scope.$state.params);
					saleChannel = commonUIService.getActiveSaleChannel();

					if(!scope.moduleService.detail)
						$log.error('moduleService.detail (ctrl: ' + self.name + ") isn't declared");

					// setup uiStructure of this docType
					UiFrameworkService.prototype.setupUiStructure.call(self,
						{   'refDocType': refDocType,
							'businessType': businessType,
							'userRole': userRole,
							'saleChannel': saleChannel,
							'docId': $state.params.docId,
							'productName': 'rul'
						},
						scope.moduleService.detail,
						scope)
					.then(function hadSetupUiStructure () {

						// keep track ctrl
						self.registerToHistoryCtrl(scope);
						scope.triggerAutoSaveLoop();
						defer.resolve();
					});
				}
			}
			
		} 
		// open from other module, uiRenderPrototypeService has taken care of
		// creating uiStructures
		else{

			// keep track ctrl
			self.registerToHistoryCtrl(scope);
			scope.triggerAutoSaveLoop();
			var productInfor = scope.getCurrProductInfor();
			refDocType = productInfor.refDocType;
			businessType = productInfor.businessType;
			defer.resolve();
		}

		// TODO: merge promise of action bar into the return promise
// xxx Thuc cheat scope.setupActionBar(refDocType, businessType, scope);

		return defer.promise;

	};
    
	/**
	 * initalize uiStructure for this controller (need to have the associate
	 * detail from runtime)
	 * 
	 * @param {String}
	 *            docParams parameters relative to a doctype, include: {String}
	 *            refDocType doctype with product {String} businessType business
	 *            type (renewal, new_business) {String} userRole agent role
	 *            (underwriter, agent,...) {String} saleChannel channel of sale
	 *            (direct, agent, bance,..)
	 * @param {Object}
	 *            detail v3 iPOS document
	 */
	UiFrameworkService.prototype.setupUiStructure = function setupUiStructure (docParams, detail, scope) {
		var self = this;

		// TODO: need to match those 2 value
		if(docParams.businessType === 'NewBusiness')
			docParams.businessType = commonService.CONSTANTS.ACTIONTYPE.NEWBUSINESS;

		var defer = uiRenderPrototypeService.$q.defer();

		// init only one time (called from $state of ui-router)
		if(scope.viewProp){
			defer.resolve();
		}else{
			// init variables for render cards on screen
			scope.viewProp = {
				// viewObject: store data to display cards on the screen
				uiStyle: 'section',
				viewObject: [], // a table structure, array 2D, reflect the tree
								// structure of uiStructure
				viewUiEles: undefined, // list of uiElements. Use for screen
										// show HTML form directly

				// stores history of selecting card (with other associate
				// information)
				// historySelect's selectLevel will lower than viewObject 1 unit
				historySelect: [],
				lastSelectStep : undefined,
				historyObjTmpl: {
					'index': undefined,// the order of card has been clicked
										// (in a row)
					'refUiStructure': undefined,// reference to correspondent
												// uiStructure
					'refDocType': undefined,// keep current doctype of select
					'refChildHtml': undefined,// keep the ref to the current
												// drawing of HTML form
					'childScope': undefined, // keep the ref to the current
												// angular controller of HTML
												// form
					'stepLink': undefined// keep the ref to the current
											// drawing of HTML form
				},// template object for historySelect
				layoutStyle : self.getLayoutStyle(docParams.refDocType),
				historyCtrl: []// keep track the ctrl when generating
								// action-bar
			};

			// refDocType is empty, use inaormation from moduleService
			uiRenderPrototypeService.createConcreteUiStructure(
					scope.requestURL, detail, docParams)
			.then(function hadUiStructure (uiStructureRoot) {
				scope.uiStructureRoot = uiStructureRoot;
				
				// set ui style value if we have config at json moock
				if (uiStructureRoot.uiStyle) scope.viewProp.uiStyle = uiStructureRoot.uiStyle;
				
				// uiStructureRoot won't appears on screen, need to find the
				// children to display
				uiRenderPrototypeService.getChildContentOfUiStructure(uiStructureRoot)
				.then( function gotResult (result) {
					if(uiRenderPrototypeService.isUiStructureObj(result[0])){
						// hnguyen294 -- optimize
						scope.viewProp.viewObject.splice(0, scope.viewProp.viewObject.length);
						//
						scope.viewProp.viewObject.push(result);
					}
					// currently NOT support HTML static
					else{
						scope.viewProp.viewUiEles = result;
						$log.debug("Render HTML form");
					}

					// User Guide: if this card is the first time access, it
					// will show User Guide popover for Card
					/*
					 * $timeout(function() { if(scope.uiStructureRoot !=
					 * undefined)
					 * scope.moduleProspectPersonalService.tourGuideFirstLoginForUser(scope.uiStructureRoot.name.split(':')[1]); },
					 * 1000);
					 */

					// continue last working space (direct sale)
					if(localStorage.getItem("isContinueLastWorking")){
						setTimeout(function(){ self.moveToCards(); }, 2000);
					}
					// for esignature to loading signing card in transaction
					// document after sign back
					if(sessionStorage.getItem("isContinueLastSigningWorking")){
						sessionStorage.removeItem("isContinueLastSigningWorking");
						setTimeout(function(){
							if(scope.uiStructureRoot !== undefined)
								scope.moveToSigningCards();
						}, 100);
					}

					defer.resolve();
				});

				// scope.checkLoadBreadCrum();

			});
		}

		return defer.promise;
	};

	/**
	 * Using this functions everytime need to re-associate the detail with
	 * uiStructure Ex: After computing, the output in detail will be changed -->
	 * need to call this fn so the display of element with "counter" can be
	 * refresh When success, the new "detail" will be binded with current
	 * uiStructure of this doctype
	 * 
	 * @param {Object}
	 *            detail ipos v3 json dataset
	 * @param {Object}
	 *            scope current acting controller
	 * @param {boolean}
	 *            notRemoveTemplateChildren if true, then keep all template
	 *            children in uiStructure, else remove them all, default to
	 *            undefined (will remove)
	 * @param {boolean}
	 *            expectedDetailNotChanged expected state of isDetailChanged is
	 *            unchanged, default is undefined (inherited from parent)
	 */
	UiFrameworkService.prototype.reSetupConcreteUiStructure = function reSetupConcreteUiStructure(detail, scope, notRemoveTemplateChildren, expectedDetailNotChanged) {
		// find the current uiStructure of this ctrl.
		var uiStructureRoot = scope.getAssociateUiStructureRoot();
		if (uiStructureRoot) {
			// uiRenderPrototypeService.removePreviewFields(uiStructureRoot);
			return uiRenderPrototypeService.reSetupConcreteUiStructure(
				uiStructureRoot,
				detail,
				scope.requestURL,
				notRemoveTemplateChildren,
				expectedDetailNotChanged);
		} else {
			return uiRenderPrototypeService.$q.when();
		}
	};

	UiFrameworkService.prototype.getRefDocTypeFromParams = function getRefDocTypeFromParams () {
		var result = $state.params.docType;
		var product = $state.params.productName ? ";product=" + $state.params.productName : "";
		if($state.params.docType == commonService.CONSTANTS.MODULE_NAME.SALECASE) {
			return result;
		}
		if($state.params.docType === 'quotation' && $state.params.quotationStandalone == true ){
			return result;
		}
		return result + product;
	};

	/**
	 * setup some common variable and behavior for screen doesn't have datamodel
	 * (payment, configuration screen,...)
	 * 
	 * @param {String}
	 *            ctrlName name of the ctrl
	 * @param {Object}
	 *            refDocType current refDocType of this ctrl
	 * @param {String}
	 *            businessType [description]
	 * @return {Object} Angular Promise, success when got uiStructure
	 */
	UiFrameworkService.prototype.setupCtrlWithoutDetail = function setupCtrlWithoutDetail (ctrlName, refDocType, userType, businessType, userRole, detail, scope) {

		/**
		 * We came to this ctrl through 3 ways: - New document (on document
		 * screen) - Open existing document (on document screen) - Open existing
		 * document (on other screen, like from case)
		 */

		var self = this;
		scope.name = ctrlName;
		var defer = uiRenderPrototypeService.$q.defer();


		self.printDebugInfo(scope);

		// TODO: merge promise of action bar into the return promise
		self.setupActionBar(refDocType, businessType, scope);

		// case open this module screen directly, the detail has been loaded
		// before coming here
		if(scope.getParentRefDoctype(refDocType) === undefined){
			// setup uiStructure of this docType
			UiFrameworkService.prototype.setupUiStructure.call(self,
				{   'refDocType': refDocType,
					'businessType': businessType,
					'userRole': commonUIService.getActiveUserRole()
				}, detail, scope).then(function hadSetupUiStructure () {
				// keep track ctrl
				self.registerToHistoryCtrl(scope);

				defer.resolve();
			});
		}
		// open from other module, uiRenderPrototypeService has taken care of
		// creating uiStructure
		else{
			// keep track ctrl
			self.registerToHistoryCtrl(scope);
			defer.resolve();
		}


		return defer.promise;

	};

	UiFrameworkService.prototype.printDebugInfo = function printDebugInfo(scope) {
		$log.debug(scope.name + " is initialized...");
	};

	/**
	 * When leaving detail root, we need clean up detail of all uiServices
	 */
	UiFrameworkService.prototype.cleanUpUiServices = function() {
		var allUiModulesName = commonService.CONSTANTS.MODULE_NAME;
		for (var key in allUiModulesName) {
			if (allUiModulesName.hasOwnProperty(key)) {
				var uiService;
				try {
					uiService = uiRenderPrototypeService.getUiService(allUiModulesName[key]);
				} catch (e) {}
				if (uiService) {
					delete uiService.detail;
				}
			}
		}
	};

	return new UiFrameworkService();
}])	

/*
 * ################################################################## Loading
 * Bar Service: show or hide loading
 * ###################################################################
 */
.service('loadingBarService', ['$log', 'commonService', function($log, commonService){
	function LoadingBarService($log){
		this.counter = 0; // # of total request to show and hide loading bar
							// (expect #req to show == #req to hide)
		this.showOptions = {}; // default showOptions
		this.hideOptions = {}; // default hideOptions
	}

	LoadingBarService.prototype.showLoadingBar = function (showOptions){
		var self = this;
		if(commonService.hasValueNotEmpty(sessionStorage.getItem("longOverLay")) && self.longOverLay){
			return;
		}
		showOptions = showOptions || this.showOptions;
		this.counter++;

		// only show when counter is equal 1, otherwise it's been showed, don't
		// need to set again
		if(showOptions.forceShow || this.counter === 1){
			$('#ipos-full-loading').show(); 
		}
		if(commonService.hasValueNotEmpty(sessionStorage.getItem("longOverLay")) && !self.longOverLay){
			self.longOverLay = true;
			self.fullFoadingOpacity = $('#ipos-full-loading').css("opacity");
			$('#ipos-full-loading').css("opacity", 0.9);
			return;
		}
	};

	LoadingBarService.prototype.hideLoadingBar = function (hideOptions){
		var self = this;
		if(commonService.hasValueNotEmpty(sessionStorage.getItem("longOverLay")) && self.longOverLay){
			return;
		}
		else if(!commonService.hasValueNotEmpty(sessionStorage.getItem("longOverLay")) && self.longOverLay){
			self.longOverLay = undefined;
			$('#ipos-full-loading').css("opacity", self.fullFoadingOpacity);
		}
		hideOptions = hideOptions || this.hideOptions;
		this.counter--;
		if(this.counter < 0){
			this.counter = 0;
			$log.warn("There is a logical error: # of hide > # of show")
		}
		if(hideOptions.forceHide || this.counter === 0 ){
			$('#ipos-full-loading').hide();
		}
	};

	return new LoadingBarService($log);
}]);


var activeRequests = {}; // keeping all active requests operations
var spinIcon = "fa fa-spinner fa-spin fa-2x";
var fontSpinIcon = "<i class='fa fa-spinner fa-spin loading-button-icon'></i>";
var isPartialLoading=false;
// parttern for partial loading
var patterns=[
				/underwritings\?/gi,
				/integral\/policies\?/gi,
				/integral\/claims\?/gi,
				/integral\/clients\?/gi,
				/integral\/paymentdues\?/gi,
				/integral\/renewals\?/gi,
				/(user\/(.*)\/operations\/validate\/update)/gi,
				/organization-contacts/,
				/(illustration\/complete)/gi,
				/(illustration\/incomplete)/gi,
				/(illustration\/operations\/compute)/gi,
				/(prospect\/(.*)\/operations\/update)/gi,
				/resourcefiles/,
				/(illustration\/pdf)/gi,
				/illustration\/incomplete\?/gi,
				/(documents\/(.*)\/operations)/gi,
				/restrictions/gi,
				/docmapDefinitions/gi
			];
var activeLinks=[];// active link for partial loading
/*
 * ##################################################################
 * Interceptor Module
 * ###################################################################
 */
var HttpInterceptorModule = angular.module('HttpInterceptorModule', ['commonModule'])
.config(['$httpProvider', function ($httpProvider) {
	$httpProvider.interceptors.push('myHttpInterceptor');
	$httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
	$httpProvider.defaults.transformResponse.push(function (data, headerGetter) {
		// $log.debug(" http response:
		// ==========================================");
		// $log.debug(" data response: "+ JSON.stringify(data));
		if(data.forceLogOut){
			// $log.debug("forceLogOut
			// ==========================================");
			var msg='v3.errorinformation.message.alert.signinanother';
			window.localStorage.setItem('logoutCause',msg);
			window.doSignOut();
			// return data;
		}else{
			return data;
		}
	});
	
}])
// register the interceptor as a service, intercepts ALL angular ajax http calls
.factory('myHttpInterceptor', ['$q', '$window', '$log', 'commonService', 'loadingBarService', '$injector',
	function ($q, $window, $log, commonService, loadingBarService, $injector) {
	
	// dnguyen98: show error message after inject commonUIService
	function showMessage (errorMessage) {
		var commonUIService = $injector.get('commonUIService');  // inject
																	// service
		commonUIService.showNotifyMessage(errorMessage, 'error', 10000); // call
																			// function
																			// show
																			// notify
																			// in
																			// this
																			// service
	}

	function checkBackendGotError (response) {
		var message;
		try{
			// for runtime error
			var iposResponse = getValueByPropertyName(response, 'ipos-response:response');
			if (iposResponse && iposResponse['@code'] === "500"){
				var cause = getValueByPropertyName(iposResponse, 'ipos-response:cause');				
				message = "There're errors with backend. Please contact admin!";
				showMessage(message);
				$log.error("Error from backend. See response object below for more detail: ");
				$log.error(response);
			} else if (!response.data && [200, 201].indexOf(response.status) === -1){
				showMessage("There're errors with backend. Please contact admin!");
			}
		}
		catch(e){
			$log.error(e);
		}
	}

	return {
		// optional method
		'request': function(config) {
			// in device, request start with '/' can't be executed
			if (window.cordova) {
				config.url = config.url[0] !== '/' ? config.url : config.url.substr(1);
			} else {
				config.url = config.url[0] !== '/' ? config.url : '.' + config.url;
			}

			// set header to request to support fetch all from API
			config.headers['Authorization'] = 'Bearer ' + localStorage.getItem('access_token');
			if (config.headers['Content-Type'] !== 'multipart/form-data') {
				config.headers['Content-Type'] = 'application/json';
			} else {
				// for multipart data
				delete config.headers['Content-Type'];
			}

			/*
			 * hnguyen294 -deny show loading bar---- if
			 * (config.url.indexOf('count') === -1) {
			 * loadingBarService.showLoadingBar(); }
			 */
			return config || $q.when(config);
		},
		'requestError': function(rejection) {
			// remove url from activeRequests;
			var url = rejection.config.url;
			for (var index = 0; index < activeRequests.length; index++) {
				if (activeRequests[index] === url) {
					activeRequests.splice(index, 1);
					break;
				}
			}
			// do something on error
			var module = rejection.config.url.substring(0, rejection.config.url.indexOf('/'));
			if(rejection.status == 403){
				 window.location = "sestimeout";
				 return $q.reject(rejection);
			}else if(rejection.status == 401){
				 window.location = "login";
				 return $q.reject(rejection);
			}
			if (module && module !== 'notification'){
				var loadingMessageBox = $('#loadingMessageBox');
				loadingMessageBox.text('An error has occured...');
				var loadingDialog = $("#loadingDialog");
				loadingDialog.modal('hide');
				loadingMessageBox.show();
			}
		return $q.reject(rejection);
		},
		'response': function(response) {
			checkBackendGotError(response);

			if (response.config.url.indexOf('count') == -1) {
				loadingBarService.hideLoadingBar();
			}
			if(Array.isArray(response.data) && response.data[0].hasOwnProperty('nameDrivers')){
				response.data = response.data[0];
			}
			return response || $q.when(response);
		},
		'responseError': function(rejection) {
			var errorMessage = undefined;
			var $state = $injector.get('$state');  // inject service
			
			var url = rejection.config.url;
			console.log("Response error>> for url " + url + " - status " + rejection.status + " at " + new Date());
			
			switch (rejection.status) {
				case 403:
					console.log("Response error>> for url " + url + " - Access denied with status 403 at " + new Date());
// errorMessage = "Session Timeout";
					$state.go('root.list.message', { messageName: 'access_denied' });
					break; 
				case 401:
					console.log("Response error>> for url " + url + " - Session timeout with status 401 at " + new Date());
// errorMessage = "Session Timeout";
					window.open("sestimeout", "_self");
					break;
				case 415:
					// 417 when compute or validate document failed
					errorMessage = rejection.statusText;
					break; 
				case 404:
					// 417 when compute or validate document failed
					errorMessage = "404 Not Found, Please Contact Admin!";
					break; 
				case 500:
					// 500 Internal Server Error
					errorMessage = rejection.statusText + ", Please Contact Admin!";
					break;
				case 0:
				case 400:
					// Check Internal Server Error with preflight OPTION
					if (rejection && rejection.data && commonService.hasValueNotEmpty(rejection.data.message)) {
						errorMessage = rejection.data.message;
					} else {
						errorMessage = "Bad Request, Please Contact Admin!";
					}
					break;
				case 417:
					// Check Internal Server Error with preflight OPTION
					if (rejection && rejection.data && commonService.hasValueNotEmpty(rejection.data.message)) {
						errorMessage = rejection.data.message;
					} else {
						errorMessage = "Bad Request, Please Contact Admin!";
					}
					break;
			}
			
			// show error message
			if (errorMessage) {
				showMessage(errorMessage);
			}
			
			loadingBarService.hideLoadingBar();
			return $q.reject(rejection);
		}
	};
}]);
