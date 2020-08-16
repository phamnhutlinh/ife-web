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
var LandingLoginCtrl = ['$log', '$rootScope', '$state', '$stateParams', 'AclService', 'commonService', 'commonUIService', 'accountCoreService',
	function($log, $rootScope, $state, $stateParams, AclService, commonService, commonUIService, accountCoreService) {
	
	this.$onInit = function() {
		var username = localStorage.getItem('username');		
		if (commonService.hasValueNotEmpty(username) &&
				JSON.parse(localStorage.getItem('landing_logged_in'))) {
			$state.go('root.list.home');
		} else {
			if ($stateParams.initRequest === 'true') {
				window.open("login/oauth2", "_self");
			} else {
				accountCoreService.grantPermissions().then(function (data) {
					if (data !== undefined) {
						if (!commonService.hasValueNotEmpty(data.error)) {
							localStorage.setItem("access_token", data.accessToken);
							localStorage.setItem("buildVersion", data.buildVersion);
							localStorage.setItem("token_expires_at", accountCoreService.getTokenExpiresAt(data.tokenExpiredDuration));
							localStorage.setItem("username", (data.userName).toLowerCase());
							localStorage.setItem("sumInsured", JSON.stringify(data.sumInsured));
							localStorage.setItem("roles", JSON.stringify(data.roles));
							localStorage.setItem("landing_logged_in", true);							
							localStorage.setItem("profiles", JSON.stringify(data.profiles));							
							if(localStorage.getItem("selected_profile") == "null" || localStorage.getItem("selected_profile") == null || localStorage.getItem("selected_profile") == undefined){
								$state.go('root.list.profile');
							} else {						
								$rootScope.profiles = JSON.parse(localStorage.getItem("profiles"));						
								var selectedProfile = JSON.parse(localStorage.getItem("selected_profile"));
								var tmp = selectedProfile;
								delete selectedProfile["isCheck"];
								$rootScope.profiles.forEach(function(profile, index) {
									if(JSON.stringify(profile) == JSON.stringify(tmp)) {
										$rootScope.profiles[index].isCheck = true;
										selectedProfile = $rootScope.profiles[index];
									} else {
										$rootScope.profiles[index].isCheck = false;
									}
								});
								$rootScope.submitSelectProfile(selectedProfile, undefined);
							}
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

