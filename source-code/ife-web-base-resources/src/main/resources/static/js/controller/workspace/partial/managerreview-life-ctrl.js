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
var ManagerreviewDetailCtrl = ['$scope', '$log', '$stateParams', '$injector', '$location', '$filter', '$mdDialog', '$translate','commonService', 'commonUIService', 'managerreviewCoreService', 'quotationCoreService', 'salecaseCoreService', 'contactCoreService',
	function($scope, $log, $stateParams, $injector, $location, $filter, $mdDialog, $translate, commonService, commonUIService, managerreviewCoreService, quotationCoreService, salecaseCoreService, contactCoreService) {

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
		//managerreviewCoreService.freeze = false;
		$scope.ownerName = localStorage.getItem("username");
		$scope.ctrlName = genCtrlName('detail', commonService.CONSTANTS.MODULE_NAME.MANAGERREVIEW, undefined, commonService.CONSTANTS.PRODUCT_LOB.LIFE);
		$scope.moduleService = managerreviewCoreService;
		$scope.salecaseService = salecaseCoreService;
		$scope.lazyChoiceListName = "YesNoNA";
		$scope.setupStuffs().then(function(){
			$scope.setupActionBar($scope.moduleService.actionBar, undefined, $scope);
		});		
	};	
	
	$scope.setupInitialData = function() {		
		$scope.remarkManagerObjective1 = false;
		$scope.remarkManagerObjective2 = false;
		$scope.remarkManagerObjective3 = false;
	};

	/************************************************************************************* */
	/******************************** End lifecycle methods ****************************** */
	/************************************************************************************* */
	
	$scope.remarkManager = function (index) {
		if (index == 1) {
			$scope.remarkManagerObjective1 = !$scope.remarkManagerObjective1;
		}
		if (index == 2) {
			$scope.remarkManagerObjective2 = !$scope.remarkManagerObjective2;
		}
		if (index == 3) {
			$scope.remarkManagerObjective3 = !$scope.remarkManagerObjective3;
		}
	}
	
	$scope.operateManager = function(action, isNeedValidate){		
		var self = this;	
		var promise;
		var temp;
		self.moduleService.detail.decision.value = action; //Populate value for decision field
		
		if(isNeedValidate) {
			promise = $scope.validateDetail(); //validate
		} else {
			promise = $scope.$q.reject(); 
		}
		promise.then(function (validatedData) {
			if (!commonService.hasValueNotEmpty(validatedData.documentError)) { //pass all validation rule
				
				$scope.moduleService.operateManager(
						self.requestURL,
						self.moduleService.detail.id,
						self.moduleService.businessLine,
						self.moduleService.productName,
						action
				).then(function(data) {
					if(data) {
						// re-structure manager review
						var newManagerreview = data[commonService.CONSTANTS.MODULE_NAME.MANAGERREVIEW];
						if ($scope.moduleService.isSuccess(newManagerreview)) {
							$scope.moduleService.convertDataModel2UiModel(newManagerreview, $scope.moduleService.detail);
							$scope.moduleService.detail = angular.copy(newManagerreview);
							$scope.moduleService.originalDetail = angular.copy(newManagerreview);
							$scope.moduleService.freeze = true;
							$scope.uiStructureRoot.isDetailChanged = false;
							$scope.reSetupConcreteUiStructure(
								$scope.moduleService.detail,
								commonService.CONSTANTS.UI_STRUCTURE.NOT_REMOVE_TEMPLATE_CHILDREN,
								commonService.CONSTANTS.UI_STRUCTURE.EXPECTED_DETAIL_NOT_CHANGED
							);
						}
						
						// re-structure case
						var updatedCase = data[commonService.CONSTANTS.MODULE_NAME.SALECASE];
						if (salecaseCoreService.isSuccess(updatedCase)) {
							salecaseCoreService.convertDataModel2UiModel(updatedCase, salecaseCoreService.detail);
							salecaseCoreService.detail = angular.copy(updatedCase);
							salecaseCoreService.originalDetail = angular.copy(updatedCase);
							$scope.$parent.uiStructureRoot.isDetailChanged = false;
							$scope.$parent.reSetupConcreteUiStructure(
								salecaseCoreService.detail,	
								commonService.CONSTANTS.UI_STRUCTURE.NOT_REMOVE_TEMPLATE_CHILDREN,
								commonService.CONSTANTS.UI_STRUCTURE.EXPECTED_DETAIL_NOT_CHANGED
							)
						}
						$scope.saveDetail(true);
						
						//notify
						setTimeout(function(){ commonUIService.showNotifyMessage('v4.managerreview.message.successfully.' + action, 'success'); }, 1000);
						
						
					} else {
						commonUIService.showNotifyMessage('v4.managerreview.message.unsuccessfully.' + action, 'failed');
					}
				});		
			}
				
		});
	}
}];

var ManagerreListViewCtrl = ['$rootScope', '$scope', '$log', '$stateParams', '$injector', '$location', '$filter', '$mdDialog', '$translate','commonService', 'commonUIService', 'managerreviewCoreService', 'quotationCoreService', 'salecaseCoreService', 'contactCoreService',
                           	function($rootScope, $scope, $log, $stateParams, $injector, $location, $filter, $mdDialog, $translate, commonService, commonUIService, managerreviewCoreService, quotationCoreService, salecaseCoreService, contactCoreService) {
	this.$onInit = function() {
		$scope.ctrlName = "ManagerreListViewCtrl";
		$scope.moduleService = managerreviewCoreService;		
	};	
	//Pick up underwriting
	$scope.pickupOrReturnManager = function (item, dataList, index, action) {
		$scope.moduleService.pickupOrReturnManager(
				self.requestURL,
				item.docId,
				item.businessType,
				item.productName,
				action
		).then(function (data) {
			$rootScope.$broadcast('updateTotalRecords');
			
			// Do not only remove the record from the list, must reload the list
			/* dataList.splice(index,1);
			$rootScope.$broadcast('updateItemLazyLoad'); */
			
			// Reload the list because the number of records changed
			$rootScope.$broadcast('reloadListView');
		});
	};
}];