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
var quotationModule = angular.module('quotationModule', ['coreModule', 'commonUIModule'])
.service('quotationCoreService', ['$q', 'ajax', '$location', '$timeout', '$log', 'appService', 'cacheService', 'commonUIService', 'detailCoreService', 'commonService', 'connectService', 'navigationCoreHelper','loadingBarService', 
	function($q, ajax, $location, $timeout, $log, appService, cacheService, commonUIService, detailCoreService, commonService, connectService, navigationCoreHelper, loadingBarService){
	
	// hle71 - convert a data model to ui model (called from case-life-ctr.js)
	var convertDataModel2UIModelForQuotationSummary = function convertDataModel2UIModelForQuotationSummary(requestURL, docType, dataModel, businessType, productName) {
		var actionName = 'OPERATE_DOCUMENT_BY_DETAIL';
		var actionParams = { docType: docType + 's', productName: productName, businessType: businessType, action: commonService.CONSTANTS.ACTION.REFRESH};
		return connectService.exeAction({
			actionName: actionName,
			actionParams: actionParams,
			requestURL: requestURL,
			data: dataModel
		});
	}
	
	var generateBusinessCaseFromQuickQuotationAndNavigateToBC = function (docType, docName, businessType, productName, userRole) {
		this.operateDocumentByNameBusinessProductAction(undefined, docType, docName, {}, businessType, productName, 'createBC').then(function (businessCase) {
			// set the default card to Quotation when navigating to Business Case page
			localStorage.setItem('initAtTabName', 'case-management-base:Quotation');
			localStorage.setItem('quotationType', 'normal');
			// The following flag is used to open the quotation detail after the business case is open and the quotation tab is selected
			localStorage.setItem('isOpenQuotationDetailGeneratedFromQuickQuote', 'Yes');
			
			
			// Navigate to the business case
			var busCaseIdentification = {
				caseId: businessCase.metaData.docId,
				businessType: businessCase.metaData.businessType,
				productName: businessCase.metaData.productName,
				userRole: userRole, // $scope.$root.currentRole,
				type: undefined,
				isOnStandaloneQuotationPage: false
			}
			return navigationCoreHelper.toBusinessCase(busCaseIdentification);
		});
	}
	
	var quotationActions = {};
	
	
	
	quotationActions.computeQuotation = function computeQuotation(thisArg, validatedQuotation, requestURL, docType, businessType, productName) {
		return thisArg.operateDocument(requestURL, docType, commonService.CONSTANTS.ACTION.COMPUTE, validatedQuotation, businessType, productName);
	}
	
	quotationActions.validateQuotation = function validateQuotation(thisArg, uiQuotation, requestURL, docType, businessType, productName) {
		return thisArg.operateDocument(requestURL, docType, commonService.CONSTANTS.ACTION.VALIDATE, uiQuotation, businessType, productName);
	}
	
	quotationActions.convertDataModel2UIModel = function convertDataModel2UIModel(thisArg, quotation, requestURL, docType, businessType, productName) {
		return thisArg.convertDataModel2UIModelForQuotationSummary(requestURL, docType, quotation, businessType, productName);
	}
	
	quotationActions.getOriginalQuotation = function getOriginalQuotation(thisArg, quotationDocId, docType, businessType, productName) {
		return thisArg.getDocument(undefined, docType, quotationDocId, undefined, businessType, productName);
	}
	
	quotationActions.convertQuotationPropertyValueFromEmptyToNull = function convertQuotationPropertyValueFromEmptyToNull(uiModel) {
		Object.keys(uiModel).forEach(function(key) {
			if (uiModel[key] && typeof uiModel[key] === 'object') {
				if (uiModel[key].meta && uiModel[key].value !== undefined && uiModel[key].value === '') {
					uiModel[key].value = null;
				} else if (uiModel[key].value && angular.isArray(uiModel[key].value)) { // an array
					for (var i = 0; i < uiModel[key].value.length; i++) {
						quotationActions.convertQuotationPropertyValueFromEmptyToNull(uiModel[key].value[i]);
					}
				} else if (!uiModel[key].meta && !uiModel[key].value) { // not a leaf
					quotationActions.convertQuotationPropertyValueFromEmptyToNull(uiModel[key]);
				} 
			} else {
				if (uiModel[key] && uiModel[key] === '') {
					uiModel[key] = null;
				}
			}
		});
		return uiModel;
	}
		
	function refreshValidateComputeQuotation(quotationDataModel) {
		var requestURL = this.initialRequestURL("INVOKE_RUNTIME", []); //$scope.requestURL;
		var docType = this.name; //commonService.CONSTANTS.MODULE_NAME.QUOTATION;
		var businessType = quotationDataModel.metaData.businessType;
		var productName = quotationDataModel.metaData.productName;
		var deferred = $q.defer();
		var self = this;
		
		quotationActions.getOriginalQuotation(self, quotationDataModel.metaData.docId, docType, businessType, productName).then(function (originalQuotation) {
			quotationActions.convertDataModel2UIModel(self, originalQuotation, requestURL, docType, businessType, productName).then(function (originalUiQuotation) {
				quotationActions.validateQuotation(self, originalUiQuotation, requestURL, docType, businessType, productName).then(function (validatedQuotation) {
					if (validatedQuotation.metaData.documentStatus.value === commonService.CONSTANTS.DOCUMENT_STATUS.INVALID) {
						commonUIService.showNotifyMessage('v4.user.error.inputValidateFail');
						deferred.resolve('failed');
					} else {
						quotationActions.computeQuotation(self, validatedQuotation, requestURL, docType, businessType, productName).then(function (computedQuotation) {
							if (computedQuotation.documentError && computedQuotation.documentError.value) {
								commonUIService.showNotifyMessage('v4.user.error.inputValidateFail');
								deferred.resolve('failed');
							} else {
								/*var coverFrom = computedQuotation.coverFrom.value.split("T");
								var coverTo = computedQuotation.coverTo.value.split("T");
								computedQuotation.coverTo.value = coverTo[0] + "T" + coverFrom[1];
								// Do not know why some quotation's properties' value is empty, but they are should be null - so convert it manually ????
								quotationActions.convertQuotationPropertyValueFromEmptyToNull(computedQuotation);*/
								deferred.resolve(computedQuotation);
							}
						}).catch(function (error) { // not reach
							commonUIService.showNotifyMessage('v4.user.error.inputValidateFail');
							deferred.resolve('failed');
						});
					}
				});
			});
		});
		return deferred.promise;
	}

	function QuotationCoreService($q, ajax, $location, appService, cacheService, detailCoreService, commonService){
		var self = this;
		self.detailCoreService = detailCoreService;
		detailCoreService.ListDetailCoreService.call(self, $q, ajax, $location, appService, cacheService, commonService);
		self.name = commonService.CONSTANTS.MODULE_NAME.QUOTATION;
		self.actionBar = commonService.CONSTANTS.MODULE_NAME.QUOTATION;
		self.convertDataModel2UIModelForQuotationSummary = convertDataModel2UIModelForQuotationSummary; // hle71
		self.generateBusinessCaseFromQuickQuotationAndNavigateToBC = generateBusinessCaseFromQuickQuotationAndNavigateToBC; // hle71
		self.quotationActions = quotationActions;
		self.refreshValidateComputeQuotation = refreshValidateComputeQuotation;
	}
	inherit(detailCoreService.ListDetailCoreService, QuotationCoreService);
	extend(commonUIService.constructor, QuotationCoreService);	

	QuotationCoreService.prototype.getProductInformation = function(businessType, productName)  {
		var self = this;
		self.businessLine = businessType
		self.productName = productName
	};

	QuotationCoreService.prototype.getMockFromIHUB = function (role, pasId, customerId,effDate) {
    	var self = this;
		var deferred = this.$q.defer();
		var eff;
		if(effDate==null){
			eff="";
		}
		else{
			eff=effDate.substring(0,4)+""+effDate.substring(5,7)+""+effDate.substring(8,10);
		}
		loadingBarService.showLoadingBar();
		var dataSet = self.extractDataModel(self.detail);
		connectService.exeAction({
			actionName: "GET_MOCK_FROM_IHUB",
            actionParams: {role:role,
            	pasId:pasId,
            	customerId:customerId,
            	effDate:eff  
            },
            data: dataSet
		}).then(function (data) {
			deferred.resolve(data);
			loadingBarService.hideLoadingBar();
        });
		return deferred.promise;
	}; 
	QuotationCoreService.prototype.getDataForConvenyance = function (name, offset, limit) {
    	var self = this;
		var deferred = this.$q.defer();
		loadingBarService.showLoadingBar();
		connectService.exeAction({
			actionName: "GET_MOCK_FROM_IHUB_CONVENYEE",
            actionParams: {name:name,
            	offset:offset,
            	limit:limit}
            
		}).then(function (data) {
			deferred.resolve(data);
			loadingBarService.hideLoadingBar();
        });
		return deferred.promise;
	}; 

	return new QuotationCoreService($q, ajax, $location, appService, cacheService, detailCoreService, commonService);
}]);

