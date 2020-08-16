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
var ClientDetailCtrl = ['$scope', '$log', '$stateParams', '$mdToast','$injector', '$location', '$filter', 'commonService', 'commonUIService', 'clientCoreService', 'AclService','$rootScope',
	function($scope, $log, $stateParams, $mdToast, $injector, $location, $filter, commonService, commonUIService, clientCoreService, AclService, $rootScope) {

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
		$scope.$stateParams = $stateParams;
		$scope.ctrlName = genCtrlName('detail', commonService.CONSTANTS.MODULE_NAME.CLIENT);		
		$scope.moduleService = clientCoreService;
		$scope.moduleService.freeze = false;
		//set client type
		$scope.moduleService.type = $scope.$stateParams.type;
		//commonUIService.setupAclForDetail(AclService, [$stateParams.userRole]);
	
		$scope.$filter = $filter;
		clientCoreService.getClientDetail($stateParams.currFromDate).then(function(data){
			
			$scope.item = data.data.metaDatas;
			console.log($scope.item);
			$scope.setupStuffs().then(function(){
				$scope.setupActionBar($scope.moduleService.actionBar, undefined, $scope);			
			});
		});
	};
	//old
/*	$scope.clientType = function() {
		return ($scope.moduleService.detail != undefined && $scope.moduleService.detail.detail != undefined && $scope.moduleService.detail.detail.clientType != undefined)
							? $scope.moduleService.detail.detail.clientType.value : '';
	};*/
	$scope.clientType = function() {
		return $scope.moduleService.type;
	}

	
}];