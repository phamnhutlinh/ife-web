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
var HomeCtrl = ['$scope', '$state', 'commonService',
	function($scope, $state, commonService) {

	this.$onInit = function() {
		commonService.currentState.set('landing-home');
		$scope.roleName = localStorage.getItem("roleName");
		if(JSON.parse(localStorage.getItem("selected_profile"))!=null){
		$scope.appList = JSON.parse(localStorage.getItem("appList"));
		}
		else{
			window.open("login/oauth2", "_self");
		}
		localStorage.removeItem("basic_quote")
		if (!Array.isArray($scope.appList)) {
			$scope.appList = [];
		}
	};

	//go to specific site
	$scope.gotoSite = function (app) {
		/*
		 * hle56
		 * store user group to check permission when access app.
		 */
		localStorage.removeItem("basic_quote")
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
