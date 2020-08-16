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
var salecaseModule = angular.module('salecaseModule', ['coreModule', 'commonUIModule'])
.service('salecaseCoreService', ['$q', 'ajax', '$location', 'appService', 'cacheService', 'detailCoreService', 'commonService', 'connectService', 'commonUIService', '$log', 
	function($q, ajax, $location, appService, cacheService, detailCoreService, commonService, connectService, commonUIService, $log){

	function SaleCaseCoreService($q, ajax, $location, appService, cacheService, detailCoreService, commonService, connectService){
		var self = this;		
		self.detailCoreService = detailCoreService;
		detailCoreService.ListDetailCoreService.call(self, $q, ajax, $location, appService, cacheService, commonService);
		self.name = commonService.CONSTANTS.MODULE_NAME.SALECASE;
		self.actionBar = commonService.CONSTANTS.MODULE_NAME.SALECASE;
	}
	
	inherit(detailCoreService.ListDetailCoreService, SaleCaseCoreService);
	extend(commonUIService.constructor, SaleCaseCoreService);	

	SaleCaseCoreService.prototype.retrieveSignedPdf = function (caseId, templateName) {
		var lang = localStorage.getItem('system_language');
		var deferred = this.$q.defer();
		connectService.exeAction({
			actionName: "RETRIEVE_SIGNED_DOCUMENT",
			actionParams: {
				templateName: templateName,
				caseId: caseId,
				lang: lang
			}
		}).then(function (status) {
			deferred.resolve(status);
        }, function (err) {
            $log.error("Failed to retrieve signed PDF.");
        });

		return deferred.promise;

    };
    
    SaleCaseCoreService.prototype.acceptQuotation = function (quotationInfo) {
    	var self = this;
    	var lang = localStorage.getItem('system_language');
		var deferred = this.$q.defer();
		connectService.exeAction({
			actionName: "ACCEPT_QUOTATION",
            actionParams: {
            	businessType: this.detail.metaData.businessType.value,
            	productName: this.detail.metaData.productName.value,
            	caseId: this.detail.id,
            	lang: lang
            },
			data: this.extractDataModel(quotationInfo)
		}).then(function (data) {
			deferred.resolve(data);
        });
		return deferred.promise;
	}

	SaleCaseCoreService.prototype.presubmit = function () {
		var self = this;
		var lang = localStorage.getItem('system_language');
		var deferred = this.$q.defer();
		connectService.exeAction({
			actionName: "PRE_SUBMIT_CASE_ACTION",
            actionParams: {
            	businessType: this.detail.metaData.businessType.value,
            	productName: this.detail.metaData.productName.value,
                docId: this.detail.id,
                lang: lang
            },
			data: this.extractDataModel(this.detail)
		}).then(function (data) {
			if (self.isSuccess(data)) {
				self.convertDataModel2UiModel(data, self.detail);
				self.detail = angular.copy(data);
				self.originalDetail = angular.copy(data);
			}
			deferred.resolve(data);
        });
		return deferred.promise;		
    };

	SaleCaseCoreService.prototype.submit = function () {
		return connectService.exeAction({
            actionName: "DOCUMENT_ACTION",
            actionParams: {
                docType: ConstantConfig.MODULE_NAME.SALECASE + "s",
                docId: this.detail.id,
                action: "submit"
            },
            data: this.extractDataModel(this.detail)
		});
    };

	return new SaleCaseCoreService($q, ajax, $location, appService, cacheService, detailCoreService, commonService, connectService);
}]);
