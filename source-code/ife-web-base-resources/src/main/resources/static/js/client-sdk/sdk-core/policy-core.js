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
var policyModule = angular.module('policyModule', ['coreModule', 'commonUIModule'])
.service('policyCoreService', ['$q', 'ajax', '$location', 'appService', 'cacheService', 'commonUIService', 'detailCoreService', 'commonService', 'connectService','loadingBarService',
    function($q, ajax, $location, appService, cacheService, commonUIService, detailCoreService, commonService, connectService,loadingBarService){
	
	function PolicyCoreService($q, ajax, $location, appService, cacheService, detailCoreService, commonService, connectService){
		var self = this;
		self.detailCoreService = detailCoreService;
		detailCoreService.ListDetailCoreService.call(self, $q, ajax, $location, appService, cacheService, commonService);
		self.name = commonService.CONSTANTS.MODULE_NAME.POLICY;
		self.actionBar = commonService.CONSTANTS.MODULE_NAME.POLICY;
	}
	
	inherit(detailCoreService.ListDetailCoreService, PolicyCoreService);
	extend(commonUIService.constructor, PolicyCoreService);
	PolicyCoreService.prototype.getPolicyDetail= function (policyid,effDate) {
		var eff;
		if(effDate==null){
			eff="";
		}
		else{
			eff=effDate.substring(0,4)+""+effDate.substring(5,7)+""+effDate.substring(8,10);
		}
    	var self = this;
		var deferred = this.$q.defer();
		loadingBarService.showLoadingBar();
		connectService.exeAction({
			actionName: "SEARCH_POLICY",
            actionParams: 
            {
            	policyid:policyid,
               	effDate :eff
            }
            
		}).then(function (data) {
			if(data.data.metaDatas[0].polTranno==""){
				data.data.metaDatas[0].polTranno=0;
			}
			deferred.resolve(data);
			loadingBarService.hideLoadingBar();
        });
		return deferred.promise;
	}; 
	/**
	 * @author lpham24
	 * method Get
	 */
	PolicyCoreService.prototype.getPolicyDetailNew= function (policyid,effDate,username) {
		loadingBarService.showLoadingBar();
		var eff;
		if(effDate==null){
			eff="";
		}
		else{
			eff=effDate.substring(0,4)+""+effDate.substring(5,7)+""+effDate.substring(8,10);
		}
    	var self = this;
		var deferred = this.$q.defer();
		
		connectService.exeAction({
			actionName: "SEARCH_POLICY_NEW",
            actionParams: 
            {
            	policyid:policyid,
               	effDate :eff,
               	name:username
            }
            
		}).then(function (data) {
			if(data[0]=="N"){
				deferred.resolve(data[0]);
			}else{
			if(data.data.metaDatas[0].polTranno==""){
				data.data.metaDatas[0].polTranno=0;
			}
			
			deferred.resolve(data);
			
			}
			
        });
		return deferred.promise;
	}; 
	/**
	 * @author lpham24
	 * method Get
	 */
	PolicyCoreService.prototype.getDocumentList= function (policyid,tranno) {
    	var self = this;
		var deferred = this.$q.defer();
		loadingBarService.showLoadingBar();
		connectService.exeAction({
			actionName: "SEARCH_DOCUMENTLIST",
            actionParams: {policyid:policyid,tranno:tranno}
            
		}).then(function (data) {
			
			deferred.resolve(data);
			
        });
		return deferred.promise;
	}; 
	/**
	 * @author lpham24
	 * method Get
	 */
	PolicyCoreService.prototype.getFILEDOCUMENT= function (path, policyID) {
    	var self = this;
		var deferred = this.$q.defer();
		loadingBarService.showLoadingBar();
		connectService.exeAction({
			actionName: "GET_FILE_DOCUMENT",
			 actionParams: {path:path,
				 policyID:policyID}
		}).then(function (data) {
			deferred.resolve(data);
			loadingBarService.hideLoadingBar();
        });
		return deferred.promise;
	}; 
	/**
	 * @author lpham24
	 * method Get
	 */
	PolicyCoreService.prototype.sendEmail= function(policyID,emailTO,ccTo,subject,content,attachment){
		   var self = this;
		   var dataToApprove=
		   {
				   "policyID":policyID,
				   "emailTo": emailTO,
				    "ccTo":ccTo,
				   "subject": subject,
				   "attachment":attachment,
				   "content": content
				 } 		
		   
			var deferred = this.$q.defer();
			loadingBarService.showLoadingBar();
			
			connectService.exeAction({
				actionName: "SEND_EMAIL",
	           actionParams: {},
	           data: dataToApprove
			}).then(function (data) {
				deferred.resolve(data);
				loadingBarService.hideLoadingBar();
	       });
			return deferred.promise;
	   }
	
	/**
	 * @author lpham24
	 * method Get
	 */
	PolicyCoreService.prototype.cloneShipmentDeclaration = function(policyId, docType, productName,businessType, selectProfile,effDate, endEffDate) {
		var self = this;
		var deferred = self.$q.defer();
		loadingBarService.showLoadingBar();
		var actionName = 'CLONE_DECLARATION_BY_POLICYID';		
		var actionParams = {
			docType: docType + 's',
			businessType:businessType,
			productName: productName,
			policyId: policyId,
			effDate:effDate,
			endEffDate: endEffDate
		};
		connectService.exeAction({
			actionName: actionName,
			actionParams: actionParams,
			data: selectProfile
		}).then(function(data) {
			if (self.isSuccess(data)) {			
				deferred.resolve(data);
				loadingBarService.hideLoadingBar();
			}
		});
		return deferred.promise;
	};

	return new PolicyCoreService($q, ajax, $location, appService, cacheService, detailCoreService, commonService, connectService);
}]);
