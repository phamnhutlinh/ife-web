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
var portalApp = angular.module('portalApp', [ 
	'mm.acl', 'ui.select2', 'ngRoute', 'ui.router', 'ui.bootstrap', 'angular.filter', 'angularUtils.directives.dirPagination',
	'filterUIModule', 'coreModule', 'contactModule', 'commonUIModule', 'quotationModule',
	'underwritingModule', 'salecaseModule', 'listviewModule', 'directiveUIModule', 'ngMaterial', 'urlModule', 'angularFileUpload',
	'translateUIModule', 'uiRenderPrototypeModule', 'accountModule', 'applicationModule', 
	'ngSanitize', 'ngResource', 'catalogModule', 'transactionModule', 'fnaModule', 'rzModule', 'managerreviewModule', 'clientModule', 'policyModule', 'ngIdle'
]);

portalApp.controller('MyNewWorkspaceCtrl', MyNewWorkspaceCtrl);
portalApp.controller('ContactPersonalDetailCtrl', ContactPersonalDetailCtrl);
portalApp.controller('ContactCorporateDetailCtrl', ContactCorporateDetailCtrl);
portalApp.controller('QuotationLifeDetailCtrl', QuotationLifeDetailCtrl);
portalApp.controller('QuotationPncDetailCtrl', QuotationPncDetailCtrl);
portalApp.controller('ApplicationLifeDetailCtrl', ApplicationLifeDetailCtrl);
portalApp.controller('ApplicationPncDetailCtrl', ApplicationPncDetailCtrl);
portalApp.controller('CaseLifeDetailCtrl', CaseLifeDetailCtrl);
portalApp.controller('CasePncDetailCtrl', CasePncDetailCtrl);
portalApp.controller('AccountDetailCtrl', AccountDetailCtrl);
portalApp.controller('SystemadminreportDetailCtrl', SystemadminreportDetailCtrl);
portalApp.controller('UnderwritingLifeDetailCtrl', UnderwritingLifeDetailCtrl);
portalApp.controller('NavigationCtrl', NavigationCtrl);
portalApp.controller('SidebarCtrl', SidebarCtrl);
portalApp.controller('ListViewCtrl', ListViewCtrl);
portalApp.controller('CaseIntroductionCtrl', CaseIntroductionCtrl);
portalApp.controller('QuotationStIntroductionCtrl', QuotationStIntroductionCtrl);
portalApp.controller('BasicQuoteCtrl', BasicQuoteCtrl);
portalApp.controller('LoginCtrl', LoginCtrl);
portalApp.controller('ProfileCtrl', ProfileCtrl);
portalApp.controller('CatalogagentsaleDetailCtrl', CatalogagentsaleDetailCtrl);
portalApp.controller('CatalogcontactDetailCtrl', CatalogcontactDetailCtrl);
portalApp.controller('AccountListViewCtrl', AccountListViewCtrl);
portalApp.controller('PaymentListViewCtrl', PaymentListViewCtrl);
portalApp.controller('InforDetailCtrl', InforDetailCtrl);
portalApp.controller('TransactionDetailCtrl', TransactionDetailCtrl);
portalApp.controller('FnaDetailCtrl', FnaDetailCtrl);
portalApp.controller('EsignCtrl', esignCtrl);
portalApp.controller('ListImportContact', ListImportContact);
portalApp.controller('ListImport', ListImport);
portalApp.controller('ClientDetailCtrl', ClientDetailCtrl);
portalApp.controller('PolicyDetailCtrl', PolicyDetailCtrl);
portalApp.controller('ManagerreviewDetailCtrl', ManagerreviewDetailCtrl);
portalApp.controller('ManagerreListViewCtrl', ManagerreListViewCtrl);

portalApp.config(portalAppConfig);
portalApp.config(function($mdAriaProvider) {
	// Globally disables all ARIA warnings.
	$mdAriaProvider.disableWarnings();
});
portalApp.config(['KeepaliveProvider', 'IdleProvider', function(KeepaliveProvider, IdleProvider) {
	console.log("Client side timeout setting is " + ConstantConfig.TIMEOUT_SETTINGS.IDLE_TIME + " seconds.");
    IdleProvider.idle(ConstantConfig.TIMEOUT_SETTINGS.IDLE_TIME); // 300 in seconds
    IdleProvider.timeout(ConstantConfig.TIMEOUT_SETTINGS.WAITING_TIME); // 60 in seconds
    KeepaliveProvider.interval(ConstantConfig.TIMEOUT_SETTINGS.KEEPALIVE_INTERVAL); // 60 (in seconds) do an action to update last access time to server
//    KeepaliveProvider.http('/api/heartbeat'); // URL that makes sure session is alive
    
    IdleProvider.interrupt('keydown wheel mousedown touchstart touchmove scroll');
}]);
portalApp.run(['$rootScope', '$state', '$transitions', 'commonService', 'commonUIService', 'uiFrameworkService', 'AclService', 'accountCoreService', 'Idle',
	function($rootScope, $state, $transitions, commonService, commonUIService, uiFrameworkService, AclService, accountCoreService, Idle) {
	commonUIService.setupAcl(AclService);
	commonUIService.setupRefreshTokenTimer(accountCoreService);
	
	/**
	 * Setup ACL and refresh token timer after user logs in successfully
	 */	
	function setupStuffsInternalApp() {
		commonUIService.setupAcl(AclService, $state);
		commonUIService.setupRefreshTokenTimer(accountCoreService);
		// start watching when the app runs. also starts the Keepalive service by default.
		Idle.watch();
		console.log('Starting the idle monitoring...');
	}	
	
	$transitions.onError({}, function(transition) {
		if (commonService.hasValueNotEmpty(transition.error().detail)) {
			$state.go('root.list.message', { messageName: transition.error().detail });
		}
	});
	$transitions.onExit({ exiting: 'root.list.detail' }, function(transition, state) {
		commonUIService.setupAcl(AclService);

		//Clean up detail(datamodel) of all UI Services
		uiFrameworkService.cleanUpUiServices();
	});
	
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
					//setupStuffsInternalApp();
				} else {
					setupStuffsInternalApp();
					$rootScope.setupNavigationBar()
				}				
			}
		});
	}
	
}]);
