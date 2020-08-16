/*******************************************************************************
 * Copyright (C) 2010, 2016 CSC - All rights reserved.
 *
 * The information contained in this document is the exclusive property of
 * CSC.  This work is protected under USA copyright law
 *  and the copyright laws of given countries of origin and international
 * laws, treaties and/or conventions. No part of this document may be
 * reproduced or transmitted in any form or by any means, electronic or
 *  mechanical including photocopying or by any informational storage or
 * retrieval system, unless as expressly permitted by CSC.
 *
 * Design, Develop and Manage by Team Integral Point-of-Sales & Services
 *******************************************************************************/

'use strict';
var DirectLoginCtrl = ['$log', '$state', '$stateParams', 'AclService', 'commonService', 'commonUIService', 'accountCoreService',
	function($log, $state, $stateParams, AclService, commonService, commonUIService, accountCoreService) {

	/**
	 * Setup ACL and refresh token timer after user logs in successfully
	 */
	function setupStuffs() {
		commonUIService.setupAclForLanding(AclService, $state);
		commonUIService.setupRefreshTokenTimer(accountCoreService);
	}
	
	this.$onInit = function() {
		var username = localStorage.getItem('username');
		var landingLoggedIn = localStorage.getItem('landing_logged_in');
		if (commonService.hasValueNotEmpty(username) &&
			commonService.hasValueNotEmpty(landingLoggedIn)) {
			$state.go('root.list.home');
		} else {
			if ($stateParams.initRequest === 'true') {
				window.open("login/oauth2", "_self");
			} else {
				accountCoreService.grantPermissions().then(function (data) {
					if (data !== undefined) {
						if (!commonService.hasValueNotEmpty(data.error)) {
							localStorage.setItem("access_token", data.accessToken);
							localStorage.setItem("token_expires_at", accountCoreService.getTokenExpiresAt(data.tokenExpiredDuration));
							localStorage.setItem("username", (data.userName).toLowerCase());
							localStorage.setItem("sumInsured", JSON.stringify(data.sumInsured));
							localStorage.setItem("roles", JSON.stringify(data.roles));
							localStorage.setItem("landing_logged_in", "true");
							setupStuffs();
						} else {
							if (data.error === 'invalid_token') {
								window.open('login/oauth2', '_self');
							} else {
								commonUIService.showNotifyMessage('v4.user.error.' + data.error, undefined, 20000);
								$log.error('Some error happen or current user role not match current web app!');
								$state.go('root.list.message', {messageName: data.error});
							}
						}
					} else {
						commonUIService.showNotifyMessage('v4.user.error.empty_user_info', undefined, 20000);
						$log.error('Error getting user information!');
						window.open('logout', '_self');
					}
				});
			}
		}
	};

}];

