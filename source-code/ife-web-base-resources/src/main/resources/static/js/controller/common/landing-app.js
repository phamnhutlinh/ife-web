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
var landingApp = angular.module('landingApp', [
	'mm.acl', 'ui.select2', 'ngRoute', 'ui.router', 'ui.bootstrap', 'filterUIModule', 'coreModule',
	'commonUIModule', 'directiveUIModule', 'ngMaterial', 'urlModule', 'angularFileUpload',
	'translateUIModule', 'uiRenderPrototypeModule', 'accountModule',
	'salecaseModule','ngSanitize', 'ngResource', 'ngIdle'
]);

landingApp.controller('NavigationCtrl', NavigationCtrl);
landingApp.controller('HomeCtrl', HomeCtrl);
landingApp.controller('RegistrationCtrl', RegistrationCtrl);
landingApp.controller('ResetPwdCtrl', ResetPwdCtrl);
landingApp.controller('LandingLoginCtrl', LandingLoginCtrl);
landingApp.controller('ProfileCtrl', ProfileCtrl);
landingApp.controller('MyNewWorkspaceCtrl', MyNewWorkspaceCtrl);
landingApp.controller('AccountDetailCtrl', AccountDetailCtrl);
landingApp.controller('InforDetailCtrl', InforDetailCtrl);

landingApp.config(landingAppConfig);
landingApp.run(['$rootScope', '$state', 'commonService', 'commonUIService', 'AclService', 'accountCoreService', function($rootScope, $state, commonService, commonUIService, AclService, accountCoreService) {
	
	var username = localStorage.getItem('username');
	var expiredTime = localStorage.getItem('token_expires_at');
	if(commonService.hasValueNotEmpty(username) && commonService.hasValueNotEmpty(expiredTime) && Date.now() - expiredTime >= 0) {
		localStorage.clear();
		window.open('logout', '_self');
	}
	commonUIService.setupAclForLanding(AclService);
	
	/**
	 * Setup ACL and refresh token timer after user logs in successfully
	 */
	function setupStuffsLanding() {
		commonUIService.setupAclForLanding(AclService, $state);
		commonUIService.setupRefreshTokenTimer(accountCoreService);
	}
	
	$rootScope.submitProfile = function(index, isFromNav) {
		$rootScope.profiles.forEach(function(profile) {
			profile.isCheck = false;
		});
		$rootScope.profiles[Number(index)].isCheck = true;		
		$rootScope.submitSelectProfile($rootScope.profiles[Number(index)], isFromNav);
	}
	
	$rootScope.submitSelectProfile = function(selectedProfile, isFromNav) {
		accountCoreService.submitProfile(selectedProfile).then(function (data) {
			if (data !== undefined) {
				localStorage.setItem("profiles", JSON.stringify($rootScope.profiles));
				localStorage.setItem("selected_profile", JSON.stringify(data.selected_profile));
				$rootScope.selectedProfiles = JSON.stringify(data.selected_profile);
				if(isFromNav == true) {
					window.open($rootScope.landingPagePath + '#/login?initRequest=true', "_self");
					setupStuffsLanding();
				} else {
					setupStuffsLanding();
				}
			}
		});
	}
	
}]);
