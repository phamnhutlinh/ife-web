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
var managerreviewModule = angular.module('managerreviewModule', ['coreModule', 'commonUIModule'])
.service('managerreviewCoreService', ['$q', 'ajax', '$location', 'appService', 'cacheService', 'commonUIService', 'detailCoreService', 'commonService', 'connectService',
	function($q, ajax, $location, appService, cacheService, commonUIService, detailCoreService, commonService, connectService){

	function ManagerreviewCoreService($q, ajax, $location, appService, cacheService, detailCoreService, commonService){
		var self = this;
		self.detailCoreService = detailCoreService;
		detailCoreService.ListDetailCoreService.call(self, $q, ajax, $location, appService, cacheService, commonService);
		self.name = commonService.CONSTANTS.MODULE_NAME.MANAGERREVIEW;
		self.actionBar = commonService.CONSTANTS.MODULE_NAME.MANAGERREVIEW;
	}
	inherit(detailCoreService.ListDetailCoreService, ManagerreviewCoreService);
	extend(commonUIService.constructor, ManagerreviewCoreService);
	
	ManagerreviewCoreService.prototype.operateManager = function(requestURL, docId, businessType, productName, action) {
		var self = this;
		var deferred = self.$q.defer();
		var actionName = 'OPERATE_MANAGER_BY_ID';
		var docType = self.name;
		var dataSet = self.extractDataModel(self.detail); 
		var actionParams = {
			docType: docType + 's',
			docId: docId,
			businessType: businessType,
			productName: productName,
			action: action
		};
		connectService.exeAction({
			actionName: actionName,
			actionParams: actionParams,
			requestURL: requestURL,
			method: "PUT",
			data: dataSet
		}).then(function(data) {
			deferred.resolve(data);
		});
		return deferred.promise;
	};
	
	ManagerreviewCoreService.prototype.pickupOrReturnManager = function(requestURL, docId, businessType, productName, action) {
		var self = this;
		var deferred = self.$q.defer();
		var actionName = 'PICKUP_RETURN_MANAGER';
		var docType = self.name;
		if(docType === 'managerreview'){
			businessType = null;
			productName  = null;
			
		}
		var dataSet = {}; 
		var actionParams = {
			docType: docType + 's',
			docId: docId,
			businessType: businessType,
			productName: productName,
			action: action
		};
		connectService.exeAction({
			actionName: actionName,
			actionParams: actionParams,
			requestURL: requestURL,
			method: "PUT",
			data: dataSet
		}).then(function(data) {
			if (self.isSuccess(data)) {
				self.convertDataModel2UiModel(data, self.detail);
				self.detail = angular.copy(data);
				self.originalDetail = angular.copy(data);
			}
			deferred.resolve(data);
		});
		return deferred.promise;
	};

	return new ManagerreviewCoreService($q, ajax, $location, appService, cacheService, detailCoreService, commonService);
}]);

