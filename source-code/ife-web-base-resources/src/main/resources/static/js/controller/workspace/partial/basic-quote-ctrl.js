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
var BasicQuoteCtrl = ['$scope', '$log', '$stateParams', '$injector', '$location', '$mdDialog', 'commonService', 'commonUIService', 'quotationCoreService', 'accountCoreService', 'salecaseCoreService', 'contactCoreService', 'underwritingCoreService', '$filter','$rootScope', '$timeout', 'loadingBarService',
	function($scope, $log, $stateParams, $injector, $location, $mdDialog, commonService, commonUIService, quotationCoreService, accountCoreService, salecaseCoreService, contactCoreService, underwritingCoreService, $filter, $rootScope, $timeout, loadingBarService) {

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
		localStorage.setItem('currentState', 'basic_quote_details');
		$scope.lazyChoiceListName = "RelationshipProposer,NatureBusinessQuotation,Industry,RaceInformation,Education," +
		"Title,Gender,Occupation,MaritalStatus,IDType,Country,YesNo,SmokerStatus,EmploymentStatus," +
		"NatureOfBusiness,DiplomaQualification,WorkingExperience,FinanceRelatedQualifications,SourceOfFund," +
		"AddressType,PremiumFrequency,FundQuotation,RiderNew,LoadingType,LoadingReason,ContractCurrency,Product_Code";
		$scope.getComputeLazy();
		/*$scope.basicQuoteProductName = 'rul'
		$scope.selectProduct("rul");	
		$scope.basicQuoteProductName = 'bni'*/
		//$scope.selectProduct("bni");
		$scope.displayProductSection = true;
		$scope.isSignRequired = false;
		$scope.checkErrorSelectProduct = false;
		$scope.tagType ='';
		$scope.tagName = 'BasicQuo';
		$scope.tagIncludeCompute = ['Input TransEffDate', 'Input Calling System', 'Input Contract Type', 'Input Region', 'Input Locale', 'Input Coverage Code','Input Sex','Input Proposer Smoker Status','Input Billing Frequency','Input Premium', 'Input Currency','Output Total premium','Input Sum Assured','Output Total Sum Assured','Input Premium Cal'];
		$scope.tagIncludeValidate = ['Input TransEffDate', 'Input Calling System', 'Input Contract Type', 'Input Region', 'Input Locale', 'Input Coverage Code','Input Sex','Input Proposer Smoker Status','Input Billing Frequency','Input Premium', 'Input Currency','Output Total premium','Input Sum Assured','Output Total Sum Assured','Input Premium Cal','Input Type Quote','Input Proposer Age Basic Quote'];
		$scope.tagParent = '';
		$scope.tagIndex = '';
		$scope.$watch('[moduleService.detail]', function() {		
			if(typeof($scope.moduleService.detail) == 'object'  ){
				$scope.moduleService.detail.typeQuo.value = "BQ";
				$scope.moduleService.detail.policyOwner.person.ageInput.meta.mandatory = 'true'
			}
		}, true);
	};
	

	/************************************************************************************* */
	/******************************** End lifecycle methods ****************************** */
	/************************************************************************************* */	
	$scope.selectProduct = function(productName){
		$scope.basicQuoteBusinessLine = (JSON.parse(localStorage.getItem("selected_profile")).pasType).toLowerCase()
		$scope.basicQuoteProductName = productName;
		if(commonService.hasValueNotEmpty($scope.basicQuoteBusinessLine) && $scope.basicQuoteProductName=="rul" || $scope.basicQuoteProductName=="bni"){
			$scope.displayProductSection = false;
			$scope.checkErrorSelectProduct = false;
			quotationCoreService.freeze = false;
			quotationCoreService.newRider = undefined;
			quotationCoreService.selectedContact = undefined;		
			$scope.ownerName = localStorage.getItem("username");
			$scope.ctrlName = commonService.CONSTANTS.BASICQUOTECTRL;
			$scope.moduleService = quotationCoreService;
			$scope.moduleService.getProductInformation($scope.basicQuoteBusinessLine, productName)
			$scope.salecaseCoreService = salecaseCoreService;
			$scope.accountCoreService = accountCoreService;
			$scope.underwritingCoreService = underwritingCoreService;
			
			if(commonService.hasValueNotEmpty($scope.moduleService.detail)){
				var OldString=$scope.moduleService.detail.metaData.docName.value;
				$scope.moduleService.detail.metaData.productName.value = productName;
				//Ticket 1301
				if(productName=="rul"){				
				$scope.moduleService.detail.metaData.docName.value=OldString.replace("BNI","RUL");
				}

				if(productName=="bni"){				
				$scope.moduleService.detail.metaData.docName.value=OldString.replace("RUL","BNI");
				}
				
				}
			
			$scope.setupStuffs().then(function(data){
				if(localStorage.getItem('quotationType') !== 'standalone' ){
					$scope.moduleService.detail.typeQuo.value = commonService.CONSTANTS.QUOTATION_TYPE.NORMAL;
				}
				else{
					$scope.moduleService.detail.typeQuo.value = commonService.CONSTANTS.QUOTATION_TYPE.STANDALONE;
				}
				$scope.setupActionBar($scope.moduleService.actionBar, undefined, $scope);
				$scope.$watch('moduleService.detail.policyOwner', function() {		
					if($scope.moduleService.detail.isAddLifeInsured.value == commonService.CONSTANTS.PO_LI_RELATION.SAME) {
						$scope.populateProposerToLifeInsured();			
					}
				}, true);
				
				$scope.$watch('[moduleService.detail.policyOwner.person.name.first.value, moduleService.detail.policyOwner.person.name.last.value]', function() {		
					$scope.moduleService.detail.policyOwner.person.name.full.value = $scope.moduleService.detail.policyOwner.person.name.first.value + " " + $scope.moduleService.detail.policyOwner.person.name.last.value;
				}, true);
				
				$scope.$watch('[moduleService.detail.lifeInsured.person.name.first.value, moduleService.detail.lifeInsured.person.name.last.value]', function() {		
					$scope.moduleService.detail.lifeInsured.person.name.full.value = $scope.moduleService.detail.lifeInsured.person.name.first.value + " " + $scope.moduleService.detail.lifeInsured.person.name.last.value;
				}, true);
			});
		}
		else{
			$scope.displayErrorSelectProduct(productName);
		}
		
	}
	$scope.displayErrorSelectProduct = function(productName){
		$scope.checkErrorSelectProduct = true;
		$scope.errorSelectProduct = '';
		if(productName == "rul"){
			$scope.errorSelectProduct = null;
			return $scope.errorSelectProduct
		}
		if(productName == "bni"){
			$scope.errorSelectProduct = null;
			return $scope.errorSelectProduct
		}
		else{
			$scope.errorSelectProduct = 'product'
			return $scope.errorSelectProduct
		}
	}
	$scope.getBasicQuote = function(){
		loadingBarService.showLoadingBar();
		$scope.validateByTagNameCommon($scope.moduleService, $scope.tagType, $scope.tagName, $scope.tagIncludeValidate).then(function(validateData){
			if(validateData.metaData.documentStatus.value === commonService.CONSTANTS.DOCUMENT_STATUS.VALID){
				$scope.computeByTagNameCommon($scope.moduleService, $scope.tagType, $scope.tagName, $scope.tagParent, $scope.tagIncludeCompute, $scope.tagIndex).then(function(data){
				$scope.computedData = data;
				})
			}
			else
				return false
		    loadingBarService.hideLoadingBar();
		})
	}
	$scope.cancelBasicQuote = function (){
		window.open($rootScope.landingPagePath + '#/login?initRequest=true', "_self");
	}
	$scope.proceedToQuickQuote = function(){
		loadingBarService.showLoadingBar();
		$scope.validateByTagNameCommon($scope.moduleService, $scope.tagType, $scope.tagName, $scope.tagIncludeValidate).then(function(validateData){
			if(validateData.metaData.documentStatus.value === commonService.CONSTANTS.DOCUMENT_STATUS.VALID){
				$scope.computeByTagNameCommon($scope.moduleService, $scope.tagType, $scope.tagName, $scope.tagParent, $scope.tagIncludeCompute, $scope.tagIndex).then(function(data){
				$scope.computedData = data;
				$scope.createNewDocument(commonService.CONSTANTS.MODULE_NAME.QUOTATION, $scope.basicQuoteBusinessLine, $scope.basicQuoteProductName, $scope.currentRole,'true');
				})
			}
			else
				return false
			loadingBarService.hideLoadingBar();
		})
		
	}
	// DeDup Check Function
	$scope.checkLifeInsuredInformation = function(){
		if(commonService.hasValueNotEmpty($scope.moduleService.detail.lifeInsured.person.name.first.value)&&commonService.hasValueNotEmpty($scope.moduleService.detail.lifeInsured.person.name.last.value)&&commonService.hasValueNotEmpty($scope.moduleService.detail.lifeInsured.person.birthDate.value)&&commonService.hasValueNotEmpty($scope.moduleService.detail.lifeInsured.person.genderCode.value)){
			return false
		}
		else
			return true
	}
	$scope.getComputeLazy = function() {
		var self = this;
		if (!commonService.hasValueNotEmpty(self.moduleService.lazyChoiceList) && self.lazyChoiceListName != undefined) {
			self.moduleService.getOptionsList(self.requestURL, self.lazyChoiceListName)
		}
	};
	//computeTag(commonService.CONSTANTS.VPMS_MAPPING_FIELD.AGE_NEAREST_BIRTHDAY, false)
	$scope.computeAgeNearestBirthLifeInsured = function(tagName, isNeedRefresh) {
		var self = this;
		var deferred = self.moduleService.$q.defer();
		$scope.validateTag(tagName).then( function (data) {
			if(commonService.hasValueNotEmpty($scope.moduleService.findElementInElement(data, ['lifeInsured', 'person', 'birthDate', 'meta', 'errorCode']))) {
				deferred.resolve("fail");
			} else {
				$scope.computeTag(tagName, isNeedRefresh).then(function (data) {
					return data;
				});
			}
		});
		return deferred.promise;
	}
	
	$scope.checkBirthDayLifeInsure = function(){
		if($scope.moduleService.detail.lifeInsured.person.birthDate.value == undefined ||
				$scope.moduleService.detail.lifeInsured.person.birthDate.value == null ||
				$scope.moduleService.detail.lifeInsured.person.birthDate.value == ""){
			$scope.moduleService.detail.lifeInsured.person.age.value = null;
		}
	}
	
	$scope.checkBirthDayPolicyOwner = function(){
		if($scope.moduleService.detail.policyOwner.person.birthDate.value == undefined ||
				$scope.moduleService.detail.policyOwner.person.birthDate.value == null ||
				$scope.moduleService.detail.policyOwner.person.birthDate.value == ""){
			$scope.moduleService.detail.policyOwner.person.age.value = null;
		}
	}

	//Support VPMS 
	$scope.checkTotalFund100 = function(){
			$scope.checkTotalFund = 0;
		angular.forEach($scope.moduleService.findElementInDetail(['basicPlan','funds','value']), function(item, index){
			$scope.checkTotalFund = $scope.checkTotalFund + Number(item.fundAllocated.value);
		})
		if ($scope.checkTotalFund >= 100)
			return true;
		return false;
	}
	
	$scope.reOrderCard = function(listChild){
		for(var i=0;i<listChild.length;i++){
			if(listChild[i].cardType =="action"){
				var temp = listChild[i];
				listChild.splice(i,1);
				listChild.splice(1,0,temp);
				break;
			}
		}
	}	

	$scope.toggleLifeInsured = function(card) {
//		if($scope.moduleService.freeze != true) {
//			if($scope.moduleService.detail.isAddLifeInsured.value == commonService.CONSTANTS.PO_LI_RELATION.SAME) {
//				$scope.moduleService.detail.isAddLifeInsured.value = commonService.CONSTANTS.PO_LI_RELATION.NOT_SAME;
//				$scope.clearDataLifeInsured();
//				$scope.refreshDetail();
//				return;
//			}
//			if($scope.moduleService.detail.isAddLifeInsured.value == commonService.CONSTANTS.PO_LI_RELATION.NOT_SAME) {
//				$scope.moduleService.detail.isAddLifeInsured.value = commonService.CONSTANTS.PO_LI_RELATION.SAME;
//				$scope.clearDataLifeInsured();
//				$scope.populateProposerToLifeInsured();
//				$scope.closeChildCards(card.level);
//				$scope.refreshDetail();
//				// fix issue delete
//				if(!$scope.shouldInitNormalQuotation()){
//					$scope.goToPreviousTab();
//				}
//				return;
//			}
//		}
	};	
	
	$scope.populateContactToLifeInsuredQuotation = function() {
		var self = this;
		self.moduleService.cloneByDocName(undefined, 'contact', undefined , undefined, $scope.moduleService.selectedContact).then(function(data) {
			$scope.moduleService.findElementInDetail(['refContactLifeInsured','refDocName']).value = $scope.moduleService.selectedContact;
			$scope.moduleService.findElementInDetail(['refContactLifeInsured','refVersion']).value = data.version;
			self.moduleService.searchDocumentByDocName(undefined, 'contact', undefined, undefined, $scope.moduleService.findElementInDetail(['refContactLifeInsured','refDocName']).value, $scope.moduleService.findElementInDetail(['refContactLifeInsured','refVersion']).value).then(function(data) {
				$scope.moduleService.findElementInDetail(['lifeInsured','titleCode']).value = $scope.moduleService.findElementInElement(data, ['titleCode'])
				$scope.moduleService.findElementInDetail(['lifeInsured','person','first']).value = $scope.moduleService.findElementInElement(data, ['first'])
				$scope.moduleService.findElementInDetail(['lifeInsured','person','last']).value = $scope.moduleService.findElementInElement(data, ['last'])
				$scope.moduleService.findElementInDetail(['lifeInsured','person','birthDate']).value = $scope.moduleService.findElementInElement(data, ['birthDate'])
				$scope.moduleService.findElementInDetail(['lifeInsured','person','genderCode']).value = $scope.moduleService.findElementInElement(data, ['genderCode'])
				$scope.moduleService.findElementInDetail(['lifeInsured','person','smokerStatus']).value = $scope.moduleService.findElementInElement(data, ['smokerStatus'])
				$scope.moduleService.findElementInDetail(['lifeInsured','natureOfBusiness']).value = $scope.moduleService.findElementInElement(data, ['industry'])
				$scope.moduleService.findElementInDetail(['lifeInsured','occupationCode']).value = $scope.moduleService.findElementInElement(data, ['occupationCode']);
				$scope.moduleService.findElementInDetail(['lifeInsured', 'person', 'age']).value = ''
				$scope.computeAgeNearestBirthLifeInsured(commonService.CONSTANTS.VPMS_MAPPING_FIELD.AGE_NEAREST_BIRTHDAY, false);
			});
		});		
	}	
	
	$scope.populateDataToLifeInsuredQuotation = function(data) {
		$scope.moduleService.findElementInDetail(['lifeInsured','titleCode']).value = $scope.moduleService.findElementInElement(data, ['titleCode']).value
		$scope.moduleService.findElementInDetail(['lifeInsured','person','first']).value = $scope.moduleService.findElementInElement(data, ['first']).value
		$scope.moduleService.findElementInDetail(['lifeInsured','person','last']).value = $scope.moduleService.findElementInElement(data, ['last']).value
		$scope.moduleService.findElementInDetail(['lifeInsured','person','birthDate']).value = $scope.moduleService.findElementInElement(data, ['birthDate']).value
		$scope.moduleService.findElementInDetail(['lifeInsured','person','genderCode']).value = $scope.moduleService.findElementInElement(data, ['genderCode']).value
		$scope.moduleService.findElementInDetail(['lifeInsured','person','smokerStatus']).value = $scope.moduleService.findElementInElement(data, ['smokerStatus']).value
		$scope.moduleService.findElementInDetail(['lifeInsured','natureOfBusiness']).value = $scope.moduleService.findElementInElement(data, ['natureOfBusiness']).value			
		$scope.moduleService.findElementInDetail(['lifeInsured','occupationCode']).value = $scope.moduleService.findElementInElement(data, ['occupationCode']).value		
	}
	
	$scope.clearDataLifeInsured = function() {
	$scope.moduleService.clearDataInJson($scope.moduleService.detail.documentRelation.refContactLifeInsured,['value']);
		$scope.moduleService.clearDataInJson($scope.moduleService.detail.lifeInsured,['value']);
		$scope.moduleService.selectedContact = "";
	}
	
	$scope.populateProposerToLifeInsured = function(){
		$scope.populateDataToLifeInsuredQuotation($scope.moduleService.findElementInDetail(['policyOwner']));			
	};


	
	$scope.searchContact = function(){
		var self = this;
		var defaultquery = [{"fields":["metaData.ownerName"],"values":[$scope.ownerName]}, {"fields":["metaData.documentStatus"],"values":["VALID"]}, {"fields":["contactType"],"values":["INDIVIDUAL"]}];
		var searchParams = {
			page: 0,
			size: $scope.pageSize
		};		
		self.moduleService.searchDocument(undefined, 'contact', defaultquery , searchParams).then(function(data) {
			if(commonService.hasValueNotEmpty(data)){
				angular.forEach(data._embedded.metaDatas, function(item, index){
					if(item.docName == $scope.salecaseCoreService.detail.prospects.value[0].refDocName.value) {
						data._embedded.metaDatas.splice(index,1)
					}
				});
				if(data._embedded){ //system has at least 1 contact
					$scope.contactList = data._embedded.metaDatas;					
				} else {
					$scope.msg = 'There is no data.';					
				}
			}else {
				$scope.msg = 'There is no data.';				
			}
		});		
	};
	
	//detect normal quotation and standalone quotation
	$scope.shouldInitNormalQuotation = function() {
		var retVal = true;
		//localStorage.removeItem('quotationType');
		$scope.moduleService = quotationCoreService;
		if($stateParams.quotationStandalone === undefined) {
			var quoType = localStorage.getItem('quotationType');
			if(quoType === undefined) {
				retVal = true;
			} else {
				if(quoType === 'standalone') {
					retVal = false;
				} 
			}
		} else {
			// existed quotationStandalone value
			if($stateParams.quotationStandalone) {
				retVal = false;
			} else {
				retVal = true;
			}
			
		}
		return retVal;
	}
	
	if($scope.shouldInitNormalQuotation()){
		localStorage.setItem('quotationType', 'normal');
		} else {
    	localStorage.setItem('quotationType', 'standalone');
    }
	
	$scope.filterLazyList = function(originalLazyList, tempLazyList, objectDropdown) {
		if(originalLazyList == undefined)
			return;
		
		var tempList = [];
		tempLazyList = [];
		
		/* Find all elements not select before on Lazy List */
		for(var i=0; i<originalLazyList.length; i++) {
			for(var j=0; j<objectDropdown.length; j++) {
				if(originalLazyList[i].key == objectDropdown[j].loadingType.value)
					break;
				if(j == objectDropdown.length-1 && originalLazyList[i].key != objectDropdown[j].loadingType.value)
					tempList.push(originalLazyList[i]);
			}
		}
		
		/* Push element selected to Lazy List */
		for(var i=0; i<objectDropdown.length; i++) {
			tempLazyList.push(angular.copy(tempList));
			for(var j=0; j<originalLazyList.length; j++) {
				if(objectDropdown[i].loadingType.value == originalLazyList[j].key) {
					tempLazyList[i].push(originalLazyList[j]);
					break;
				}
			}
		}
		return tempLazyList;
	}

}];
