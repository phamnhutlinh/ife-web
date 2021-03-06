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

var CaseIntroductionCtrl = ['$scope', '$stateParams', '$state', '$log', function($scope, $stateParams, $state, $log){
	var currentState = localStorage.getItem('currentState');
	
	$scope.productName = $stateParams.productName;
	
	
	// localStorage.getItem('quotationType');
	
	$scope.goBackToDashboard = function goBackToDashboard() {
		$state.go('root.list.listView', { link: 'case_management' });
	}

	$scope.createNewProduct = function createNewProduct(docTypeName) {
		var docType = docTypeName;
		var productType = undefined;
		var productName = undefined;
		var isEnableCreateNewProduct = false;
		var isQuotationStandalone = false;
		if($scope.dashboardName === 'quotation_management'){
			var isQuotationStandalone = true;
		}
		
		if($scope.productName === 'LIFE_RUL') {
			productType = 'life';
			productName = 'rul';
			isEnableCreateNewProduct = true;
		}
		if($scope.productName === 'LIFE_BNI') {
			productType = 'life';
			productName = 'bni';
			isEnableCreateNewProduct = true;
		}
		if($scope.productName === 'MT1') {
			productType = 'pnc';
			productName = 'mt1';
			isEnableCreateNewProduct = true;
		}
		if($scope.productName === 'MT2') {
			productType = 'pnc';
			productName = 'mt2';
			isEnableCreateNewProduct = true;
		}
		if($scope.productName === 'MAR') {
			productType = 'pnc';
			productName = 'mar';
			isEnableCreateNewProduct = true;
		}
		if($scope.productName === 'MIC') {
			productType = 'pnc';
			productName = 'mic';
			isEnableCreateNewProduct = true;
		}
		if($scope.productName === 'CAN') {
			productType = 'pnc';
			productName = 'can';
			isEnableCreateNewProduct = true;
		}
		if(isEnableCreateNewProduct) {
			$scope.createNewDocument(docType, productType, productName, $scope.currentRole,isQuotationStandalone);
		}
	}
}];

