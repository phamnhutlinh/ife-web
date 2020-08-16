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
var RegistrationCtrl = ['$rootScope', '$scope', '$state', '$log', 'commonService', 'commonUIService', 'accountCoreService',
	function($rootScope, $scope, $state, $log, commonService, commonUIService, accountCoreService) {

	this.$onInit = function() {
		$scope.moduleService = accountCoreService;
		$scope.requestURL = accountCoreService.initialRequestURL("INVOKE_RUNTIME", []);
		$scope.userModel = {
			phoneNumbers: ['']
		};
		$scope.checkPasswordPattern= commonService.CONSTANTS.PASSWORD.PATTERN;
		$scope.checkEmailPattern= "(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))";
		$scope.setupStuffs();
		$scope.userModel.nationality ="UAE";
		$scope.isRebindingSlider = false;
	};

	$scope.submitRegistration = function() {
		$scope.userModel.email=$scope.userModel.userName;
		accountCoreService.registerUser($scope.userModel).then(function(data) {//success
			if (!commonService.hasValueNotEmpty(data.error)) {
				$state.go('root.list.message', { messageName: 'registration_success' });
				commonUIService.moveToSpecificElement("v4-prototype-topView");
			} else {
				commonUIService.showNotifyMessage('v4.user.error.' + data.error, undefined, 20000);
			}
		});
	};
	
	$scope.refreshSlider = function() {
		if (($scope.isRebindingSlider != true) && (document.getElementById("slider") != null))
			if (document.getElementById("slider").innerHTML.indexOf("title=\"\"") > 0)
				{
					$scope.isRebindingSlider = true;
					$rootScope.$broadcast('changeLanguage');
				}
		return true;
	};

	$scope.setupStuffs = function() {
		var deferred = accountCoreService.$q.defer();
		var listDropdowns = "Gender,Occupation,MaritalStatus,Country,BranchName,ProductCode";
		accountCoreService.getOptionsList($scope.requestURL, listDropdowns).then(function(data) {
			if (!commonService.hasValueNotEmpty(data)) {
				$log.error("Fail getting lazy choice list!!!");
			}
			deferred.resolve();
		});
		return deferred.promise;
	};
}];

var ResetPwdCtrl = ['$state', '$rootScope', '$scope', '$log', 'commonService', 'accountCoreService', 'commonUIService',
	function($state, $rootScope, $scope, $log, commonService, accountCoreService, commonUIService) {

	this.$onInit = function() {
		$scope.requestResetPwdForm = { otpTypeSend: 'email' };
		$scope.submitResetPwdForm = {};
		$scope.checkPasswordPattern= commonService.CONSTANTS.PASSWORD.PATTERN;
		$scope.checkEmailPattern= commonService.CONSTANTS.EMAIL.PATTERN;
	};

	$scope.requestResetPwd = function() {
		accountCoreService.requestResetPwd($scope.requestResetPwdForm).then(function(data) {//success
			if (!commonService.hasValueNotEmpty(data.error)) {
				$state.go('root.list.submitResetPwd');
			} else {
				commonUIService.showNotifyMessage('v4.user.error.' + data.error, undefined, 20000);
			}
		});
	};
	
	$scope.resendOTP = function() {
		accountCoreService.resendOTP().then(function(data) {
			if (commonService.hasValueNotEmpty(data.error)) {
				commonUIService.showNotifyMessage('v4.user.error.' + data.error, undefined, 20000);
			}
		});
	};

	$scope.submitResetPwd = function() {
		accountCoreService.submitResetPwd($scope.submitResetPwdForm).then(function(data) {//success
			if (!commonService.hasValueNotEmpty(data.error)) {
				$state.go('root.list.message', { messageName: 'resetpwd_newpwd_result' });
			} else {
				commonUIService.showNotifyMessage('v4.user.error.' + data.error, undefined, 20000);
			}
		});
	};

}];