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
var SystemadminreportDetailCtrl = ['$scope', '$log','resourceReaderService','detailCoreService','uiRenderPrototypeService', '$stateParams','$state', '$injector', '$location', 'commonService', 'commonUIService', 'accountCoreService', 'loadingBarService',
	function($scope, $log, resourceReaderService, detailCoreService, uiRenderPrototypeService, $stateParams, $state, $injector, $location, commonService, commonUIService, accountCoreService, loadingBarService) {

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
		$scope.moduleService = accountCoreService;
		$scope.moduleService.name = "systemadminreport"
		$scope.username = localStorage.getItem("username");
		$scope.lazyChoiceListName = "ProductCode,BCStatus,BranchName";
		$scope.$stateParams = $stateParams;
		$scope.ctrlName = genCtrlName('detail','systemadminreport' , undefined, undefined);
		$scope.setupStuffs().then(function(){
		});
		
	};
	$scope.getUserAccount = function(){
		$scope.userList = [];
		uiRenderPrototypeService.getFullAccount(
			"account"
		).then(function(data){
			$scope.userList = data.metaDatas;
		})
	}
	$scope.clearErrorSubTo = function(){
		$scope.inValidSubTo = "";
	}
	$scope.clearErrorCreTo = function(){
		$scope.inValidCreTo = "";
	}
	$scope.clearSearch = function(submitDateFrom,submitDateTo,createDateFrom,createDateTo){
		var self = this;
		var criteria = $scope.moduleService.detail.criteria.value
		for (var i = 0; i < criteria.length;i++){
			if(commonService.hasValueNotEmpty(criteria[i].searchType.value) && criteria[i].searchType.value != "rangeDate"){
				criteria[i].searchType.value = "";
			}
		}
		$(inputSubmitDF).val("");
		$(inputSubmitDT).val("");
		$(inputCreateDF).val("");
		$(inputCreateDT).val("");
	}
	$scope.generateReport = function(submitDateFrom,submitDateTo,createDateFrom,createDateTo){
		var self = this;
		var criteria = $scope.moduleService.detail.criteria.value;
		var buildQuerySearch =[];
		var genReport = 'true';
		var templateBuildQuery = {
				"fields": [],
				"values": []
		}
		var tempArr = angular.copy(templateBuildQuery)
		var orderIndex = 0;
		angular.forEach(criteria, function(item,index){
			if(commonService.hasValueNotEmpty(item.searchType.value) && item.searchType.value != "rangeDate"){
				if(item.searchType.value != 'All Branches'){
					buildQuerySearch.push(angular.copy(tempArr));
					buildQuerySearch[orderIndex].fields[0] = item.field.value ;
					buildQuerySearch[orderIndex].values[0] = item.searchType.value;
					orderIndex = orderIndex + 1;
				}
			}
			else if(commonService.hasValueNotEmpty(item.searchType.value) && item.searchType.value == "rangeDate"){
				if(item.code.value == "submitDate"){
					if(commonService.hasValueNotEmpty(submitDateFrom) && commonService.hasValueNotEmpty(submitDateTo)) {
						var momentSubFrom = moment(submitDateFrom);
						var momentSubTo = moment(submitDateTo);
						if(commonService.hasValueNotEmpty(submitDateFrom) && commonService.hasValueNotEmpty(submitDateTo)){
							if(momentSubTo >= momentSubFrom){
								buildQuerySearch.push(angular.copy(tempArr));
								buildQuerySearch[orderIndex].fields[0] = item.field.value + ":" + item.searchType.value + ":" + Intl.DateTimeFormat().resolvedOptions().timeZone;
								buildQuerySearch[orderIndex].values[0] = submitDateFrom.substring(0,10);
								buildQuerySearch[orderIndex].values[1] = submitDateTo.substring(0,10);
								orderIndex = orderIndex + 1;
							}
							else{
								$scope.inValidSubTo = "Invalid Date";
								genReport = 'false';
							}
								
						}
					} else if(commonService.hasValueNotEmpty(submitDateFrom) || commonService.hasValueNotEmpty(submitDateTo)) {
						buildQuerySearch.push(angular.copy(tempArr));
						buildQuerySearch[orderIndex].fields[0] = item.field.value + ":" + item.searchType.value + ":" + Intl.DateTimeFormat().resolvedOptions().timeZone;
						buildQuerySearch[orderIndex].values[0] = commonService.hasValueNotEmpty(submitDateFrom) ? submitDateFrom.substring(0,10) : "";
						buildQuerySearch[orderIndex].values[1] = commonService.hasValueNotEmpty(submitDateTo) ? submitDateTo.substring(0,10) : "";
						orderIndex = orderIndex + 1;
					}
				}
				else if(item.code.value == "createDate"){
					if(commonService.hasValueNotEmpty(createDateFrom) && commonService.hasValueNotEmpty(createDateTo)) {
						var momentCreFrom = moment(createDateFrom);
						var momentCreTo = moment(createDateTo);
						if(commonService.hasValueNotEmpty(createDateFrom) && commonService.hasValueNotEmpty(createDateTo)){
							if(momentCreTo >= momentCreFrom){
								buildQuerySearch.push(angular.copy(tempArr));
								buildQuerySearch[orderIndex].fields[0] = item.field.value + ":" + item.searchType.value + ":" + Intl.DateTimeFormat().resolvedOptions().timeZone;
								buildQuerySearch[orderIndex].values[0] = createDateFrom.substring(0,10);
								buildQuerySearch[orderIndex].values[1] = createDateTo.substring(0,10);
								orderIndex = orderIndex + 1;
							}
							else{
								$scope.inValidCreTo = "Invalid Date";
								genReport = 'false';
							}
								
						}
					} else if(commonService.hasValueNotEmpty(createDateFrom) || commonService.hasValueNotEmpty(createDateTo)) {
						buildQuerySearch.push(angular.copy(tempArr));
						buildQuerySearch[orderIndex].fields[0] = item.field.value + ":" + item.searchType.value + ":" + Intl.DateTimeFormat().resolvedOptions().timeZone;
						buildQuerySearch[orderIndex].values[0] = commonService.hasValueNotEmpty(createDateFrom) ? createDateFrom.substring(0,10) : "";
						buildQuerySearch[orderIndex].values[1] = commonService.hasValueNotEmpty(createDateTo) ? createDateTo.substring(0,10) : "";
						orderIndex = orderIndex + 1;
					}
				}

			}
		})
		if(genReport != 'false'){
			self.moduleService.generateReport(buildQuerySearch).then(function(content){
				var params = {"content": content.dataJson,"fileName": {"value": ""}};
				//params.fileName.value = "ReportOn" +  moment().get('year') + "/" + moment().get('month') + "/" + moment().get('date') + ".csv"
				params.fileName.value = "BC_Report"+ ".xlsx"
				resourceReaderService.openFileReader(params,'download','',true)
			})
		}
	}
}];
