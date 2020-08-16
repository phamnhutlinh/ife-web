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
var UnderwritingLifeDetailCtrl = ['$scope', '$log', '$stateParams', '$injector', '$location', '$filter', '$mdDialog', '$translate','commonService', 'commonUIService', 'underwritingCoreService', 'quotationCoreService', 'salecaseCoreService', 'contactCoreService',
	function($scope, $log, $stateParams, $injector, $location, $filter, $mdDialog, $translate, commonService, commonUIService, underwritingCoreService, quotationCoreService, salecaseCoreService, contactCoreService) {

	/************************************************************************************* */
	/******************************** Begin lifecycle methods **************************** */
	/************************************************************************************* */
	$injector.invoke(BaseDetailCtrl, this, {
		$scope: $scope,
		$log: $log,
		$stateParams: $stateParams,
		$location: $location,
		commonService: commonService,
		commonUIService: commonUIService
	});

	this.$onInit = function() {		
		$scope.ownerName = localStorage.getItem("username");
		$scope.ctrlName = genCtrlName('detail', commonService.CONSTANTS.MODULE_NAME.UNDERWRITING, undefined, commonService.CONSTANTS.PRODUCT_LOB.LIFE);
		$scope.moduleService = underwritingCoreService;	
		$scope.salecaseCoreService = salecaseCoreService;
		$scope.lazyChoiceListName = "FormUnderWriting,LetterUnderWriting";
		$scope.setupStuffs().then(function(){
			$scope.setupActionBar($scope.moduleService.actionBar, undefined, $scope);
		});		
	};	
	
	$scope.setupInitialData = function() {	
		$scope.moduleService.freeze = false
		if($scope.moduleService.findElementInDetail(['businessStatus']).value == commonService.CONSTANTS.BUSINESS_STATUS.ACCEPTED || $scope.moduleService.findElementInDetail(['businessStatus']).value == commonService.CONSTANTS.BUSINESS_STATUS.REJECTED ) {
			$scope.moduleService.freeze = true;
		}
	};

	/************************************************************************************* */
	/******************************** End lifecycle methods ****************************** */
	/************************************************************************************* */

	$scope.addFormLetter = function(type, isForm){
		//console.log($scope.formType.value);
		
		var formLetterList = $scope.moduleService.findElementInDetail(['listFormLetter']).value;
		
		if(formLetterList.length > 0 && !commonService.hasValueNotEmpty(formLetterList[0].key.value)){
			formLetterList.length = 0;
		}
		var item = angular.copy($scope.moduleService.findElementInDetail(['listFormLetter']).arrayDefault);
		item.key.value = type;
		item.fileName.value = $translate.instant('v4.formLetter.enum.' + type);
		if(isForm){
			item.fileType.value = "Form";
			if(formLetterList.find(function(data){ return data.fileType.value == item.fileType.value && data.key.value == type }) != undefined){
				commonUIService.showNotifyMessage('v4.error.message.noDuplicateFormLetter');
				return false;
			}
		}
		else {
			item.fileType.value = "Letter";
			if(formLetterList.find(function(data){ return data.fileType.value == item.fileType.value && data.key.value == type }) != undefined){
				commonUIService.showNotifyMessage('v4.error.message.noDuplicateFormLetter');
				return false;
			}
		}
		formLetterList.push(item);
	}
	
	$scope.removeFormLetter = function(index){
		 $scope.moduleService.findElementInDetail(['listFormLetter']).value.splice(index,1);
	}
	
	$scope.operateUW = function(action){		
		var self = this;		
		$scope.validateDetail().then(function(data){
			if(self.uiStructureRoot.validStatus === 'VALID'){
				var role = undefined;
				if($scope.isActiveRoleIn([commonService.CONSTANTS.USER_ROLES.AG.name])) {
					role = commonService.CONSTANTS.USER_ROLES.AG.name;
				}
				if($scope.isActiveRoleIn([commonService.CONSTANTS.USER_ROLES.UW.name])) {
					role = commonService.CONSTANTS.USER_ROLES.UW.name;
				}
				$scope.moduleService.operateUWById(
						self.requestURL,
						$scope.moduleService.detail.id,
						$scope.moduleService.businessLine,
						$scope.moduleService.productName,
						action, role
				).then(function(data) {
					if (self.moduleService.isSuccess(data)) {    
						$scope.moduleService.freeze = true;
						self.uiStructureRoot.isDetailChanged = false;
						self.reSetupConcreteUiStructure(
								self.moduleService.detail,
								commonService.CONSTANTS.UI_STRUCTURE.NOT_REMOVE_TEMPLATE_CHILDREN,
								commonService.CONSTANTS.UI_STRUCTURE.EXPECTED_DETAIL_NOT_CHANGED
						);
						if(commonService.hasValueNotEmpty(data[commonService.CONSTANTS.MODULE_NAME.SALECASE])) {							
							$scope.salecaseCoreService.convertDataModel2UiModel(data[commonService.CONSTANTS.MODULE_NAME.SALECASE], $scope.salecaseCoreService.detail);
							$scope.salecaseCoreService.detail = data[commonService.CONSTANTS.MODULE_NAME.SALECASE];
							self.reSetupConcreteUiStructure(
									$scope.salecaseCoreService.detail,									
									commonService.CONSTANTS.UI_STRUCTURE.NOT_REMOVE_TEMPLATE_CHILDREN,
									commonService.CONSTANTS.UI_STRUCTURE.EXPECTED_DETAIL_NOT_CHANGED,
									self.$parent.$parent
							);
						}
						
						//notify
						commonUIService.showNotifyMessage('v4.underwriting.message.Successfully.'+action,'success');
						
					}
				});		
			}
		});		
	}
	
	$scope.sendFormLetter = function(){
		if( $scope.moduleService.findElementInDetail(['listFormLetter']).value.length == 0 || !commonService.hasValueNotEmpty($scope.moduleService.findElementInDetail(['listFormLetter']).value[0].key.value)){
			commonUIService.showNotifyMessage('v4.error.message.mustChooseFile');
			return false;
		}
		var self = this;
		var role = undefined;
		if($scope.isActiveRoleIn([commonService.CONSTANTS.USER_ROLES.AG.name])) {
			role = commonService.CONSTANTS.USER_ROLES.AG.name;
		}
		if($scope.isActiveRoleIn([commonService.CONSTANTS.USER_ROLES.UW.name])) {
			role = commonService.CONSTANTS.USER_ROLES.UW.name;
		}
		$scope.moduleService.operateUWById(self.requestURL,
				$scope.moduleService.detail.id,
				$scope.moduleService.businessLine,
				$scope.moduleService.productName,"FORMLETTER",role).then(function(data){
			if (self.moduleService.isSuccess(data)){
				commonUIService.showNotifyMessage('v4.underwriting.message.sendSuccessfully','success');
				self.moduleService.saveDocument(self.requestURL, self.moduleService.name).then(function(data){
					if (self.moduleService.isSuccess(data)) {    
						self.uiStructureRoot.isDetailChanged = false;
						self.reSetupConcreteUiStructure(
								self.moduleService.detail,
								commonService.CONSTANTS.UI_STRUCTURE.NOT_REMOVE_TEMPLATE_CHILDREN,
								commonService.CONSTANTS.UI_STRUCTURE.EXPECTED_DETAIL_NOT_CHANGED
						);
					}
				});
			}
		});
	}
	
	$scope.checkVisibleSendForm = function(){
		var decision = $scope.moduleService.detail.underwritingDecisionInfo.underwritingDecisionCd.value;
		return (decision == commonService.CONSTANTS.BUSINESS_OPERATION.UNDERWRITING.COUNTER_OFFER_CONFIRMED || decision == commonService.CONSTANTS.BUSINESS_STATUS.ACCEPTED || decision == commonService.CONSTANTS.BUSINESS_STATUS.REJECTED );
	}	
	
	$scope.listFinding = [];
	$scope.getListFinding = function(errorFinding) {
		$scope.listFinding = [];
		var tempListFinding = errorFinding.split(";");
		for(var i=0; i<tempListFinding.length; i++) {
			if(tempListFinding[i] !== " ") {
				$scope.listFinding.push({"value": tempListFinding[i].trim()});
			}
		}
	}
	
}];
