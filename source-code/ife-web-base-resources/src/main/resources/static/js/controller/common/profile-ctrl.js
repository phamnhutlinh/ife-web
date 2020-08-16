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
var ProfileCtrl = ['$scope', '$rootScope', '$log', '$state', 'AclService', 'commonService', 'commonUIService', 'accountCoreService',
	function($scope, $rootScope, $log, $state, AclService, commonService, commonUIService, accountCoreService) {
	
	this.$onInit = function() {
		$rootScope.profiles = JSON.parse(localStorage.getItem("profiles"));
		if($rootScope.profiles == undefined) {
			commonUIService.showNotifyMessage('v4.user.error.empty_profile_info', "error");
		}
	};	

}];

