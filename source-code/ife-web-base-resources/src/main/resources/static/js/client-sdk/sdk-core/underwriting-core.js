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
var underwritingModule = angular.module('underwritingModule', ['coreModule', 'commonUIModule'])
.service('underwritingCoreService', ['$q', 'ajax', '$location', 'appService', 'cacheService', 'commonUIService', 'detailCoreService', 'commonService', 'connectService', 'navigationCoreHelper',
	function($q, ajax, $location, appService, cacheService, commonUIService, detailCoreService, commonService, connectService, navigationCoreHelper){

	function UnderwritingCoreService($q, ajax, $location, appService, cacheService, detailCoreService, commonService){
		var self = this;
		self.detailCoreService = detailCoreService;
		detailCoreService.ListDetailCoreService.call(self, $q, ajax, $location, appService, cacheService, commonService);
		self.name = commonService.CONSTANTS.MODULE_NAME.UNDERWRITING;
		self.actionBar = commonService.CONSTANTS.MODULE_NAME.UNDERWRITING;
		self.formLetterList = [];
	}
	inherit(detailCoreService.ListDetailCoreService, UnderwritingCoreService);
	extend(commonUIService.constructor, UnderwritingCoreService);
	
	/**
	 * Pick up Underwriting to My Underwriting Workspace 
	 * @param requestURL
	 * @param docType
	 * @param docId
	 * @param businessLine
	 * @param productName
	 */
	UnderwritingCoreService.prototype.pickupForUnderwriting = function(requestURL, docType, docId, businessLine, productName) {
		var self = this;
		var deferred = $q.defer();
		if (!commonService.hasValueNotEmpty(docType)) {
			docType = self.name;
		}
		var dataSet = [];
		var actName = 'PICKUP_UNDERWRITING';
		var actParams = { docType: docType + 's', docId: docId, businessType: businessLine, productName: productName };
		connectService.exeAction({
			actionName: actName,
			actionParams: actParams,
			data: dataSet,
			method: "PUT",
			requestURL: requestURL
		}).then(function(data) {
			deferred.resolve(data);
		});
		return deferred.promise;
	};
	
	/**
	 * Return Underwriting to Underwriting Request List
	 * @param requestURL
	 * @param docType
	 * @param docId
	 * @param businessLine
	 * @param productName
	 */
	UnderwritingCoreService.prototype.returnForUnderwriting = function(requestURL, docType, docId, businessLine, productName) {
		var self = this;
		var deferred = $q.defer();
		if (!commonService.hasValueNotEmpty(docType)) {
			docType = self.name;
		}
		var dataSet = [];
		var actName = 'RETURN_UNDERWRITING';
		var actParams = { docType: docType + 's', docId: docId, businessType: businessLine, productName: productName };
		connectService.exeAction({
			actionName: actName,
			actionParams: actParams,
			data: dataSet,
			method: "PUT",
			requestURL: requestURL
		}).then(function(data) {
			deferred.resolve(data);
		});
		return deferred.promise;
	};
	
	UnderwritingCoreService.prototype.operateUWById = function(requestURL, docId, businessType, productName, action, role) {
		var self = this;
		var deferred = self.$q.defer();
		var actionName = 'OPERATE_UW_BY_ID';
		var docType = self.name;
		var dataSet = self.extractDataModel(self.detail); 
		var actionParams = {
			docType: docType + 's',
			docId: docId,
			businessType: businessType,
			productName: productName,
			action: action,
			role: role
		};
		connectService.exeAction({
			actionName: actionName,
			actionParams: actionParams,
			requestURL: requestURL,
			method: "PUT",
			data: dataSet
		}).then(function(data) {
			if (self.isSuccess(data)) {
				self.convertDataModel2UiModel(data[commonService.CONSTANTS.MODULE_NAME.UNDERWRITING], self.detail);
				self.detail = angular.copy(data[commonService.CONSTANTS.MODULE_NAME.UNDERWRITING]);
				self.originalDetail = angular.copy(data[commonService.CONSTANTS.MODULE_NAME.UNDERWRITING]);
			}
			deferred.resolve(data);
		});
		return deferred.promise;
	};
	
	UnderwritingCoreService.prototype.navigateFromUnderwritingToBusinessCase = function(caseId, businessType, productName, userRole) {
		localStorage.setItem('quotationType', 'normal');
		// Navigate to the business case
		var busCaseIdentification = {
			caseId: caseId,
			businessType: businessType,
			productName: productName,
			userRole: userRole, // $scope.$root.currentRole,
			type: undefined,
			isOnStandaloneQuotationPage: false
		}
		return navigationCoreHelper.toBusinessCase(busCaseIdentification);
	};

	return new UnderwritingCoreService($q, ajax, $location, appService, cacheService, detailCoreService, commonService);
}]);