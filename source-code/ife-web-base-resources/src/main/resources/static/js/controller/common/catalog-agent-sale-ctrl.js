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
var CatalogagentsaleDetailCtrl = ['$scope', '$log', '$stateParams', '$injector', '$location', 'commonService', 'commonUIService', 'catalogCoreService',
	function($scope, $log, $stateParams, $injector, $location, commonService, commonUIService, catalogCoreService) {

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
		$scope.ctrlName = "CatalogagentsaleDetailCtrl";
		$scope.moduleService = catalogCoreService;
		$scope.$stateParams = $stateParams;
		$scope.setupStuffs(true);
	};	
	
	$scope.getDetail = function() {
		var self = this;
		var deferred = self.moduleService.$q.defer();
		self.moduleService.detail =  self.moduleService.originalDetail = {};
		deferred.resolve(self.moduleService.detail);
		return deferred.promise;
	};
	
	/************************************************************************************* */
	/******************************** End lifecycle methods ****************************** */
	/************************************************************************************* */
}];