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
var accountModule = angular.module('accountModule', ['coreModule', 'commonUIModule'])
.service('accountCoreService', ['$q', '$location', 'appService', 'cacheService', 'commonUIService','loadingBarService', 'detailCoreService', 'commonService', 'connectService', '$log',
	function($q, $location, appService, cacheService, commonUIService,loadingBarService, detailCoreService, commonService, connectService, $log){
	
	function AccountCoreService($q, $location, appService, cacheService, detailCoreService, commonService, connectService){
		var self = this;
		self.detailCoreService = detailCoreService;
		detailCoreService.ListDetailCoreService.call(self, $q, $location, appService, cacheService, commonService);
		self.name = commonService.CONSTANTS.MODULE_NAME.ACCOUNT;
		self.actionBar = commonService.CONSTANTS.MODULE_NAME.ACCOUNT;
	}
	
	inherit(detailCoreService.ListDetailCoreService, AccountCoreService);
	extend(commonUIService.constructor, AccountCoreService);

	/**
	 * Request server auth token and roles info
	 * Apr-23-2017
	 * @author  ttan40
	 * @return {Object} data Angular Promise, include username, token, roles info if success
	 */
	AccountCoreService.prototype.grantPermissions = function() {
		var self = this;
		var deferred = self.$q.defer();
		var requestURL = self.initialRequestURL("USER_GRANT_PERMISSIONS", []);
		connectService.exeAction({
			actionName: '',
			actionParams: [],
			requestURL: requestURL
		}).then(function(data) {
			deferred.resolve(data);
		});
		return deferred.promise;
	};
	
	/**
	 * Request server auth token and roles info
	 * Apr-23-2017
	 * @author  ttan40
	 * @return {Object} data Angular Promise, include username, token, roles info if success
	 */
	AccountCoreService.prototype.submitProfile = function(data) {
		var self = this;
		var deferred = self.$q.defer();
		var requestURL = self.initialRequestURL("USER_SELECT_PROFILE", []);
		connectService.exeAction({
			actionName: '',
			actionParams: [],
			requestURL: requestURL,
			data: data
		}).then(function(data) {
			deferred.resolve(data);
		});
		return deferred.promise;
	};

	/**
	 * Register user
	 * Apr-23-2017
	 * @author  ttan40
	 * @param  {Object} userRegisterForm User data model to registration
	 * @return {Object} data Angular Promise, inform if success created
	 */
	AccountCoreService.prototype.registerUser = function(userRegisterForm) {
		var self = this;
		var deferred = self.$q.defer();
		var requestURL = self.initialRequestURL("USER_REGISTER", []);
		connectService.exeAction({
			actionName: '',
			actionParams: [],
			requestURL: requestURL,
			data: userRegisterForm
		}).then(function(data) {
			deferred.resolve(data);
		});
		return deferred.promise;
	};

	/**
	 * Request reset password action by provide username
	 * Apr-23-2017
	 * @author  ttan40
	 * @param  {String} requestResetPwdForm Form who request reset password
	 * @return {Object} data Angular Promise, inform if success request (send otp to email)
	 */
	AccountCoreService.prototype.requestResetPwd = function(requestResetPwdForm) {
		var self = this;
		var deferred = self.$q.defer();
		var requestURL = self.initialRequestURL("USER_REQUEST_RESET_PASSWORD", []);
		connectService.exeAction({
			actionName: '',
			actionParams: [],
			requestURL: requestURL,
			data: requestResetPwdForm
		}).then(function(data) {
			deferred.resolve(data);
		});
		return deferred.promise;
	};
	
	AccountCoreService.prototype.resendOTP = function() {
		var self = this;
		var deferred = self.$q.defer();
		var requestURL = self.initialRequestURL("USER_RESEND_OTP", []);
		connectService.exeAction({
			actionName: '',
			actionParams: [],
			requestURL: requestURL
		}).then(function(data) {
			deferred.resolve(data);
		});
		return deferred.promise;
	};

	/**
	 * Submit a form to reset password
	 * Apr-23-2017
	 * @author  ttan40
	 * @param  {Object} submitResetPwdForm Include new password and otp code
	 * @return {Object} data Angular Promise, inform if success change password
	 */
	AccountCoreService.prototype.submitResetPwd = function(submitResetPwdForm) {
		var self = this;
		var deferred = self.$q.defer();
		var requestURL = self.initialRequestURL("USER_SUBMIT_RESET_PASSWORD", []);
		connectService.exeAction({
			actionName: '',
			actionParams: [],
			requestURL: requestURL,
			data: submitResetPwdForm
		}).then(function(data) {
			deferred.resolve(data);
		});
		return deferred.promise;
	};
	
	AccountCoreService.prototype.verifyOTP = function(submitResetPwdForm) {
		var self = this;
		var deferred = self.$q.defer();
		var requestURL = self.initialRequestURL("USER_VERIFY_OTP", []);
		connectService.exeAction({
			actionName: '',
			actionParams: [],
			requestURL: requestURL,
			data: submitResetPwdForm
		}).then(function(data) {
			deferred.resolve(data);
		});
		return deferred.promise;
	};
	
	AccountCoreService.prototype.changePassword = function(submitChangePwdForm) {
		var self = this;
		var deferred = self.$q.defer();
		var requestURL = self.initialRequestURL("USER_SUBMIT_CHANGE_PASSWORD", []);
		connectService.exeAction({
			actionName: '',
			actionParams: [],
			requestURL: requestURL,
			data: submitChangePwdForm
		}).then(function(data) {
			deferred.resolve(data);
		});
		return deferred.promise;
	};
	
	AccountCoreService.prototype.resetUserPassword = function(username) {
		var self = this;
		var deferred = self.$q.defer();
		var requestURL = self.initialRequestURL("ADMIN_RESET_USER_PASSWORD", [username]);
		connectService.exeAction({
			actionName: '',
			actionParams: [],
			requestURL: requestURL
		}).then(function(data) {
			deferred.resolve(data);
		});
		return deferred.promise;
	};

	/**
	 * Get current user detail (data model) from portal backend
	 * Apr-23-2017
	 * @author  ttan40
	 * @return {Object} data Angular Promise, user detail data
	 */
	AccountCoreService.prototype.getUserDetail = function() {
		var self = this;
		var deferred = self.$q.defer();
		var requestURL = self.initialRequestURL("USER_GET_DETAIL", []);
		connectService.exeAction({
			actionName: '',
			actionParams: [],
			requestURL: requestURL
		}).then(function(data) {
			deferred.resolve(data);
		});
		return deferred.promise;
	};

	/**
	 * Update user detail (by data model), must match with username
	 * Apr-23-2017
	 * @author  ttan40
	 * @param  {String} userName Current username
	 * @return {Object} data Angular Promise, user model data after update
	 */
	AccountCoreService.prototype.updateUserDetail = function(userName) {
		var self = this;
		var deferred = self.$q.defer();
		var requestURL = self.initialRequestURL("USER_UPDATE_DETAIL", [userName]);
		var dataModel = self.extractDataModel(self.detail);
		delete dataModel.userPassword;
		connectService.exeAction({
			actionName: 'USER_UPDATE_DETAIL',
			actionParams: {userName: userName},
			method: "PUT",
			data: dataModel
		}).then(function(data) {
			/*if (self.isSuccess(data)) {
				self.originalDetail = angular.copy(self.detail);
				self.detail = data;
				self.convertDataModel2UiModel(self.detail, self.originalDetail);
			}*/
			deferred.resolve(data);
		});
		
		return deferred.promise;
	};
	AccountCoreService.prototype.createAccountFrSA = function(requestURL, moduleName, dataModel,createByAdmin) {
		var self = this;
		var deferred = self.$q.defer();
		var requestURL = requestURL;
		var dataModel = self.extractDataModel(self.detail);
		loadingBarService.showLoadingBar();
		connectService.exeAction({
			actionName: 'CREATE_USER_ACCOUNT',
			actionParams: {
			createByAdmin: createByAdmin,
			landingURL: landingPagePath
			},
			method: "POST",
			data: dataModel
		}).then(function(data) {
			loadingBarService.hideLoadingBar();
			/*if (self.isSuccess(data)) {
				self.originalDetail = angular.copy(self.detail);
				self.detail = data;
				self.convertDataModel2UiModel(self.detail, self.originalDetail);
			}*/
			deferred.resolve(data);
		});
		
		return deferred.promise;
	};
	AccountCoreService.prototype.sendMailUnlockAccount = function(requestURL, moduleName, data) {
		var self = this;
		var deferred = self.$q.defer();
		var requestURL = requestURL;
		var dataModel = self.extractDataModel(data);
		loadingBarService.showLoadingBar();
		connectService.exeAction({
			actionName: 'UNLOCK_ACCOUNT',
			method: "POST",
			data: dataModel
		}).then(function(data) {
			loadingBarService.hideLoadingBar();
			deferred.resolve(data);
		});
		
		return deferred.promise;
	};

	/**
	 * Add insurer profile
	 * Apr-23-2017
	 * @author  ttan40
	 * @param  {Object} insurerProfile Insurer profile model, include pasid, pastype, name
	 * @return {Object} data Angular Promise, user model data after added insurer profile
	 */
	AccountCoreService.prototype.addInsurerProfile = function(insurerProfile) {
		var self = this;
		var deferred = self.$q.defer();
		var requestURL = self.initialRequestURL("USER_ADD_INSURER_PROFILE", []);
		connectService.exeAction({
			actionName: '',
			actionParams: [],
			requestURL: requestURL,
			data: insurerProfile
		}).then(function(data) {
			if (self.isSuccess(data)) {
				self.originalDetail = angular.copy(self.detail);
				self.detail = data;
				self.convertDataModel2UiModel(self.detail, self.originalDetail);
			}
			deferred.resolve(data);
		});
		return deferred.promise;
	};

	/**
	 * Get special option choice list from ldap
	 * Apr-23-2017
	 * @author  ttan40
	 * @param  {String} requestURL Invoke runtime url
	 * @return {Object} data Angular Promise, option choice list from ldap
	 */
	AccountCoreService.prototype.getLdapOptionList = function(requestURL) {
		var self = this;
		var deferred = self.$q.defer();
		connectService.exeAction({
			actionName: 'USER_LDAP_CHOICELIST',
			actionParams: [],
			requestURL: requestURL
		}).then(function(data) {
			deferred.resolve(data);
		});
		return deferred.promise;
	};
	
	AccountCoreService.prototype.requestNewAccessToken = function() {
		var self = this;
		var deferred = self.$q.defer();
		var requestURL = self.initialRequestURL("REQUEST_NEW_ACCESS_TOKEN", []);
		connectService.exeAction({
			actionName: '',
			actionParams: [],
			requestURL: requestURL
		}).then(function(data) {
			deferred.resolve(data);
		});
		return deferred.promise;
	};
	
	AccountCoreService.prototype.getTokenExpiresAt = function(tokenExpiredDuration) {
		var date = new Date();
		var currentTimeInMillis = date.getTime();
		var tokenExpiresAt = currentTimeInMillis + tokenExpiredDuration * 1000;
		
		return tokenExpiresAt;
	};
	
	/**
	 * Getlist by user role 
	 * Apr-23-2017
	 * @author  lpham24
	 * @return {Object} data Angular Promise, include username, token, roles info if success
	 */
	AccountCoreService.prototype.getListUserByRole = function(requestURL, roleId) {
		var self = this;
		var deferred = self.$q.defer();
		var actionName = 'GET_USERNAME_ROLE';
		var actionParams = {
			docType: self.name + 's',
			roleId: roleId
		};
		connectService.exeAction({
			actionName: actionName,
			actionParams: actionParams,
			requestURL: requestURL
		}).then(function(data) {
			deferred.resolve(data);
		});
		return deferred.promise;
	};
	
	/**
	 * Validate insurer profile
	 * @param  {Object} insurerProfile Insurer profile model, include pasid, pastype, name
	 * @return {Object} data Angular Promise, user model data after added insurer profile
	 */
	AccountCoreService.prototype.validateInsurerProfile = function(insurerProfile) {
		var self = this;
		var deferred = self.$q.defer();
		insurerProfile = self.extractDataModel(insurerProfile);
		connectService.exeAction({
			actionName: 'VALIDATE_INSURER_PROFILE',
			actionParams: [],
			//requestURL: requestURL,
			data: insurerProfile
		}).then(function(metaModel) {
			if (self.isSuccess(metaModel)) {
				 
					if(metaModel.documentError=="MSG-E702"){
						if(metaModel.role.value=="AG"){
										metaModel.documentError="MSG-E703";
										metaModel.pasId.meta.errorCode="MSG-E703";
						}
									} 
					 

				//self.convertDataModel2UiModel(data, {});
				/*var metaModel = data || {};
				self.mergeMetaModel2UIModel(metaModel, {});*/
				deferred.resolve(metaModel);
			}
		});
		return deferred.promise;
	};
	
	return new AccountCoreService($q, $location, appService, cacheService, detailCoreService, commonService, connectService);
}]);
