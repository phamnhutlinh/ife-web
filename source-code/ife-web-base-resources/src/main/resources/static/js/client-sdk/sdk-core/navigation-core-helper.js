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

(function (module) {
'use strict';

// hle71 - containing all helper functions, it means they are stateless / pure functions
module.service('navigationCoreHelper', navigationCoreHelper);

// Dependency Injection
navigationCoreHelper.$inject = ['$q', '$window', '$location', '$state', 'appService', 'cacheService', 'commonUIService', 'detailCoreService', 'commonService', 'connectService'];

function navigationCoreHelper($q, $window, $location, $state, appService, cacheService, commonUIService, detailCoreService, commonService, connectService) {
	
	var moduleToAppConfigMap = { // constant-config.js -> "MODULE_NAME" : acl-config.js -> "APP_CONFIGS":
		"case" : "AGENT", // commonService.CONSTANTS.MODULE_NAME.SALECASE
		"quotation" : "QUOTATION", // commonService.CONSTANTS.MODULE_NAME.QUOTATION
	}
	
	function buildDetailUrl(docType, docId, userRole, productName, businessType, type, isOnStandaloneQuotationPage) {
		var url = $location.protocol() + "\:" + "//" + $location.host();
		if ($location.port() != 80) {
			url = url + "\:" + $location.port();
		}
		url = url + "/" + commonService.CONSTANTS.APP_CONFIGS[moduleToAppConfigMap[docType]].siteName + "/workspace?roles=" + userRole + "&#";
		url = url + "/detail/" + docType + "?";
		url = url + "businessType=" + businessType;
		url = url + "&productName=" + productName;
		url = url + "&docId=" + docId;
		url = url + "&userRole=" + userRole;
		if (type) {
			url = url + "&type=" + type;
		}
		url = url + "&quotationStandalone=" + isOnStandaloneQuotationPage;
		return url;
	}
	
	/**
	 * busCaseIdentification = {
				caseId: businessCase.metaData.docId,
				businessType: businessCase.metaData.businessType,
				productName: businessCase.metaData.productName,
				userRole: userRole, // $scope.$root.currentRole or $scope.activeRoles
				type: undefined,
				isOnStandaloneQuotationPage: false
			}
	 */
	this.toBusinessCase = function (busCaseIdentification, businessCase, userRole) { // business case in data model
		commonService.removeLocalStorageVariables();//clear all old values
		commonService.currentState.set(commonService.CONSTANTS.MODULE_NAME.SALECASE + '-detail');
		$window.location.href = buildDetailUrl(
				commonService.CONSTANTS.MODULE_NAME.SALECASE,
				busCaseIdentification.caseId,
				busCaseIdentification.userRole,
				busCaseIdentification.productName,
				busCaseIdentification.businessType,
				busCaseIdentification.type,
				busCaseIdentification.isOnStandaloneQuotationPage);
		
		/* return $state.go('root.list.detail', {
			docType: businessCase.metaData.docType,
			docId: businessCase.metaData.docId,
			userRole : userRole, // $scope.$root.currentRole
			productName: businessCase.metaData.productName,
			businessType: businessCase.metaData.businessType,
			type: undefined,
			quotationStandalone: false // must set
		}); */
	};
	
}

}) (angular.module('commonUIModule'));
