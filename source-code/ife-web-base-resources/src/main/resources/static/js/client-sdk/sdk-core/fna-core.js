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
var fnaModule = angular.module('fnaModule', ['coreModule', 'commonUIModule'])
.service('fnaCoreService', ['$q', 'ajax', '$location', 'appService', 'cacheService', 'commonUIService', 'detailCoreService', 'commonService', 'connectService',
    function($q, ajax, $location, appService, cacheService, commonUIService, detailCoreService, commonService, connectService){
	
	function fnaCoreService($q, ajax, $location, appService, cacheService, detailCoreService, commonService, connectService){
		var self = this;
		self.detailCoreService = detailCoreService;
		detailCoreService.ListDetailCoreService.call(self, $q, ajax, $location, appService, cacheService, commonService);
		self.name = commonService.CONSTANTS.MODULE_NAME.FNA;
		self.actionBar = commonService.CONSTANTS.MODULE_NAME.FNA;
	}
	
	inherit(detailCoreService.ListDetailCoreService, fnaCoreService);
	extend(commonUIService.constructor, fnaCoreService);
	
	/**
	 * Request server auth token and roles info
	 * @return {Object} data Angular Promise, include username, token, roles info if success
	 */
	fnaCoreService.prototype.callOneMapAPI = function(postalCode) {
		var self = this;
		var deferred = self.$q.defer();
		var requestURL = self.initialRequestURL("ONEMAP_API", [postalCode]);
		connectService.exeAction({
			actionName: '',
			actionParams: [],
			requestURL: requestURL
		}).then(function(data) {
			deferred.resolve(data);
		});
		return deferred.promise;
	};
	
	/**
	 * Import contact into FNA
	 * use for: Import Client / Joint Applicant / Dependants 
	 */
	fnaCoreService.prototype.importContactIntoFNA = function(type, contactDocName, index) {
		var self = this;
		var deferred = self.$q.defer();
		var actionName = 'IMPORT_CONTACT_INTO_FNA';
		var docType = self.name;
		var dataSet = self.extractDataModel(self.detail);
		var actionParams = {
			docType: docType + 's',
			type: type,
			contactDocName: contactDocName,
			index: index
		};
		connectService.exeAction({
			actionName: actionName,
			actionParams: actionParams,
			data: dataSet,
			method: "PUT"
		}).then(function(data) {
			if (self.isSuccess(data)) {
				self.convertDataModel2UiModel(data, self.detail);
				self.detail = angular.copy(data);
				deferred.resolve(self.detail);
			}
		});
		return deferred.promise;
	};
	
	/**
	 * Init document without update detail
	 */
	fnaCoreService.prototype.initDocument = function(requestURL, docType, productName, transactionType, isDetail, businessType, requestBody) {
		var self = this;
		var deferred = self.$q.defer();
		if (!commonService.hasValueNotEmpty(docType)) {
			docType = self.name;
		}
		isDetail = typeof isDetail === "undefined" ? true : isDetail;
		var actionName = 'INIT_DOCUMENT';
		var actionParams = { docType: docType + 's', productName: productName, businessType: businessType };
		connectService.exeAction({
			actionName: actionName,
			actionParams: actionParams,
			requestURL: requestURL,
			data: requestBody
		}).then(function (data) {
			deferred.resolve(data);
		});
		return deferred.promise;
	};
	
	fnaCoreService.prototype.needForFNAPdf = function needForFNAPdf(data) {
		//Old
		/**
		 * Original: Clone from IGI project
		 *  this function is called at compute FNA
		 *  data: module service of FNA as ui model
		 */
		/*var totalShortfallOfChildWedding = 0;
		var totalMarriageFund = 0;
		for(var i = 0; i < data.client.baseContact.analysisGoal.childWedding.childOfWedding.value.length; i++) {
			totalShortfallOfChildWedding += data.client.baseContact.analysisGoal.childWedding.childOfWedding.value[i].totalShortfall.value;
			totalMarriageFund += data.client.baseContact.analysisGoal.childWedding.childOfWedding.value[i].totalMarriageFund.value;
		}
		
		
		var totalShortfallOfEducationFund = 0;
		var totalEducationFundRequiredToStart = 0;
		for(var i = 0; i < data.client.baseContact.analysisGoal.educationFund.children.value.length; i++) {
			totalShortfallOfEducationFund += data.client.baseContact.analysisGoal.educationFund.children.value[i].totalShortfall.value;
			totalEducationFundRequiredToStart += data.client.baseContact.analysisGoal.educationFund.children.value[i].totalEducationFundRequiredToStart.value;
		}

		
		data.client.baseContact.analysisGoal.childWedding.totalShortfallOfChildWedding.value = totalShortfallOfChildWedding;
		data.client.baseContact.analysisGoal.childWedding.totalMarriageFund.value = totalMarriageFund;
		data.client.baseContact.analysisGoal.educationFund.totalShortfallOfEducationFund.value = totalShortfallOfEducationFund;
		data.client.baseContact.analysisGoal.educationFund.totalEducationFundRequiredToStart.value = totalEducationFundRequiredToStart;
		
		data.client.baseContact.currentPosition.existingPlans.numberOfExistingPlans.value = data.client.baseContact.currentPosition.existingPlans.existingPlans.value.length;
		var resultDate = moment().format('DD/MM/YYYY HH:mm');
		data.client.refContact.middle.value = resultDate;
		var birthDate = data.client.refContact.birthDate.value; 
		var result = data.client.refContact.birthDate.value.toString();
		data.client.refContact.birthDatePdf.value = result;
		
		return data;*/
		
		// New
		/**
		 * CUSTOMIZE TO ADAPT INTO CF BASE PROJECT
		 *  this function is called at print - base detail ctrl
		 *  data: module service of FNA as data model
		 *  Reason to customize: some params of fna module are specific of igi project 
		 *  and we're using pdf template which copy from igi project 
		 */
		var totalShortfallOfEducationFund = 0;
		var totalEducationFundRequiredToStart = 0;
		for(var i = 0; i < data.client.baseContact.analysisGoal.educationFund.children.length; i++) {
			totalShortfallOfEducationFund += data.client.baseContact.analysisGoal.educationFund.children[i].totalShortfall;
			totalEducationFundRequiredToStart += data.client.baseContact.analysisGoal.educationFund.children[i].totalEducationFundRequiredToStart;
		}
		data.client.baseContact.analysisGoal.educationFund.totalShortfallOfEducationFund = totalShortfallOfEducationFund;
		data.client.baseContact.analysisGoal.educationFund.totalEducationFundRequiredToStart = totalEducationFundRequiredToStart;
		
		
		data.client.baseContact.currentPosition.existingPlans.numberOfExistingPlans = data.client.baseContact.currentPosition.existingPlans.existingPlans.length;
		
		var resultDate = moment().format('DD/MM/YYYY HH:mm');
		data.client.refContact.middle = resultDate;
		var birthDatePdf = data.client.refContact.birthDate.toString();
		data.client.refContact.birthDatePdf = birthDatePdf;
		return data;
	}
	
	return new fnaCoreService($q, ajax, $location, appService, cacheService, detailCoreService, commonService, connectService);
}]);
