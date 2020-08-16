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
var DirectHomeCtrl = ['$scope', '$state', 'commonService', 'ajax',
	function($scope, $state, commonService, ajax) {

	/*this.$onInit = function() {
		commonService.currentState.set('landing-home');
		$scope.roleName = localStorage.getItem("roleName");
		$scope.appList = JSON.parse(localStorage.getItem("appList"));
		if (!Array.isArray($scope.appList)) {
			$scope.appList = [];
		}
	};*/

	this.$onInit = function() {
		/*$scope.selectedRole = undefined;
		$scope.isRoleListLoaded = false;*/
		commonService.currentState.set('direct-home');
    	var requestURL = "getTokens";
    	
    	ajax.getRuntime_Token(requestURL, undefined, function(data) {
    		if (data != "null") {
    			localStorage.setItem("access_token", data["access_token"]);
    		} else {
    			localStorage.removeItem("access_token");
                commonUIService.showNotifyMessage($translate.instant('v4.authentication.message.getTokenError'));
    		}
    	}, function() {
    		$log.error('Error getting token');
            commonUIService.showNotifyMessage($translate.instant('v4.authentication.message.getTokenError'));
    	});
    };
    
	//go to specific site
	$scope.gotoSite = function (app) {
		/*
		 * hle56
		 * store user group to check permission when access app.
		 */
		localStorage.setItem('USER_GROUPS', app.name);
		window.open(app.link + "?" + buildParamUserRole(app.roles), '_self')
	};
	
	function buildParamUserRole(roles){
		var params = '';
		roles.forEach(function (role){
			params += 'roles=' + role+ '&';
		})
		return params;
	}
	
}];
