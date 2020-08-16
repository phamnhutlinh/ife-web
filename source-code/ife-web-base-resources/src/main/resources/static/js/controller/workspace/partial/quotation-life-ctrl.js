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
var QuotationLifeDetailCtrl = ['$scope', '$log', '$stateParams', '$injector', '$location', '$mdDialog', 'commonService', 'commonUIService', 'quotationCoreService', 'accountCoreService', 'salecaseCoreService', 'contactCoreService', 'underwritingCoreService', '$filter','$rootScope', '$timeout', 
	function($scope, $log, $stateParams, $injector, $location, $mdDialog, commonService, commonUIService, quotationCoreService, accountCoreService, salecaseCoreService, contactCoreService, underwritingCoreService, $filter, $rootScope, $timeout) {

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
		//$scope.isQuotationStandalone = $stateParams.quotationStandalone;
		//localStorage.setItem('quotationType', 'standalone');
		//localStorage.getItem('quotationType');
		
		quotationCoreService.freeze = false;
		quotationCoreService.newRider = undefined;
		quotationCoreService.selectedContact = undefined;	
		$scope.productName = $stateParams.productName;
		$scope.ownerName = localStorage.getItem("username");
		$scope.ctrlName = genCtrlName('detail', commonService.CONSTANTS.MODULE_NAME.QUOTATION, undefined, commonService.CONSTANTS.PRODUCT_LOB.LIFE);
		$scope.moduleService = quotationCoreService;
		$scope.moduleService.getProductInformation(commonService.CONSTANTS.PRODUCT_LOB.LIFE,$scope.productName)
		$scope.salecaseCoreService = salecaseCoreService;
		$scope.accountCoreService = accountCoreService;
		$scope.underwritingCoreService = underwritingCoreService;
		$scope.lazyChoiceListName = "RelationshipProposer,NatureBusinessQuotation,Industry,RaceInformation,Education," +
				"Title,Gender,Occupation,MaritalStatus,IDType,Country,YesNo,SmokerStatus,EmploymentStatus," +
				"NatureOfBusiness,DiplomaQualification,WorkingExperience,FinanceRelatedQualifications,SourceOfFund," +
				"AddressType,PremiumFrequency,FundQuotation,RiderNew,LoadingType,LoadingReason,ContractCurrency";
		$scope.setupStuffs().then(function(){
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
			
			$scope.$watch('moduleService.detail.basicPlan.funds.value', function() {		
				$scope.processFundList();
			}, true);
			
			$scope.$watch('moduleService.detail.riders.value', function() {
				$scope.processRiderList();
			}, true);	
			
			$scope.$watch('moduleService.detail.basicPlan.loadingInformation.value', function() {		
				$scope.processLoadingList();
			}, true);
			
			$scope.print = (function () {
		        var templateName = commonService.CONSTANTS.DMS_TYPE.QUOTATION;
		        var data = {
		            quotation: $scope.moduleService.extractDataModel(quotationCoreService.detail)
		        };
		        
		        function getData() {
					var deferred = $scope.moduleService.$q.defer();
					if (accountCoreService.detail) {
						data.account = $scope.moduleService.extractDataModel(accountCoreService.detail);
						deferred.resolve(data);
		            } else {
						accountCoreService.getUserDetail().then(function (user) {
							accountCoreService.detail = user;
		                    data.account = $scope.moduleService.extractDataModel(accountCoreService.detail);
		                    deferred.resolve(data);
		});
					}
					return deferred.promise;
		        }
				function print() {
		            // check whether is the accepted quotation or not
					var quoAcceptedAttachment = undefined;
	    			if(quotationCoreService.detail !== undefined && quotationCoreService.detail.metaData.businessStatus.value.toUpperCase() === 'ACCEPTED') {
	    				// find attachment of the accepted quotation
	    				var attachments = $scope.$parent.moduleService.detail.attachments.value;
	    				for(var i = 0; i < attachments.length; i++) {
	    					if(attachments[i].typeCode.value.toUpperCase() === 'BI') {
	    						quoAcceptedAttachment = attachments[i];
	    						break;
	    					}
	    				}
	    			}
					
					if(quoAcceptedAttachment) {
	    				$scope.moduleService.getDocument(
	    						$scope.requestURL,
	    						commonService.CONSTANTS.MODULE_NAME.ATTACHMENT,
	    						quoAcceptedAttachment.attachment.refId.value)
	    					.then(function(data) {
	    						if(data.businessInformation.isSigned) {
	    							$scope.moduleService.getPDFAttachmentSignedToView(quoAcceptedAttachment.attachment.refId.value).then(function(data) {
	    								quoAcceptedAttachment.content = data.content;
	    								$scope.resourceReaderService.openFileReader(quoAcceptedAttachment, 'view', data.businessInformation.isSigned);
	    							});
	    						} else {
	    							quoAcceptedAttachment.content = data.content;
	    							$scope.resourceReaderService.openFileReader(quoAcceptedAttachment, 'view', data.businessInformation.isSigned);
	    						}
	    					});
	    			} else {
	    				getData().then(function (payload) {
			            	payload.quotation = $scope.moduleService.extractDataModel(quotationCoreService.detail);
			            	$scope.computeQuotation().then(function(data){
			            		if(data == "fail"){
				            		var question = 'MSG-FQ06';
				    				commonUIService.showYesNoDialog(question, function() {
				    				$scope.saveDetail(false);
				    				});
			            		}
			    				else{
			    					return $scope.resourceReaderService.generatePDF($scope.requestURL, payload, templateName);
			    				}
			            	});
			            });
	    			}
		        }
		        return print;
	    }).call(this);
		});
		/*$scope.reOrderCard($scope.card.linkCUiStructure.children);*/
		$scope.isSignRequired = false;

	};
	
	
	
	$scope.checkAcceptQuotation = function (){
    	var result = false;
        var detailQuotation = $scope.salecaseCoreService.detail.quotations.value;
        var lengthDetailQuotation = $scope.salecaseCoreService.detail.quotations.value.length;
        for (var i = 0; i<lengthDetailQuotation; i++)
        	if (detailQuotation[i].refBusinessStatus.value == "ACCEPTED") {
        		result = true;
        		break;
        	}
        return result;
     }
	
	$scope.setupInitialData = function() {
		if(localStorage.getItem('quotationType') !== 'standalone' ){
		if($scope.checkAcceptQuotation()
				|| ($scope.moduleService.detail.metaData.businessStatus.value == commonService.CONSTANTS.BUSINESS_STATUS.DR && $scope.moduleService.detail.quotationType.value == 'UW_QUO')) {
			$scope.moduleService.freeze = true;
		}
		}
		$scope.moduleService.lazyListFund = [];
		angular.forEach($scope.moduleService.detail.basicPlan.funds.value, function(item_1, index_1){
			$scope.moduleService.lazyListFund.push(angular.copy($scope.moduleService.findElementInElement($scope.moduleService.lazyChoiceList,['FundQuotation'])))
		});
		$scope.processFundList();
		$scope.moduleService.lazyListRider = [];
		angular.forEach($scope.moduleService.detail.riders.value, function(){
			$scope.moduleService.lazyListRider.push(angular.copy($scope.moduleService.findElementInElement($scope.moduleService.lazyChoiceList,['RiderNew'])))
		});
		$scope.processRiderList();
		
		$scope.processLoadingList();
	};

	/************************************************************************************* */
	/******************************** End lifecycle methods ****************************** */
	/************************************************************************************* */	
	// DeDup Check Function
	$scope.checkLifeInsuredInformation = function(){
		if(commonService.hasValueNotEmpty($scope.moduleService.detail.lifeInsured.person.name.first.value)&&commonService.hasValueNotEmpty($scope.moduleService.detail.lifeInsured.person.name.last.value)&&commonService.hasValueNotEmpty($scope.moduleService.detail.lifeInsured.person.birthDate.value)&&commonService.hasValueNotEmpty($scope.moduleService.detail.lifeInsured.person.genderCode.value)){
			return false
		}
		else
			return true
	}
	$scope.dedupCheck = function() {
		var self = this;
		var data = $scope.moduleService.extractDataModel(quotationCoreService.detail)
		var name = quotationCoreService.name;
		var businessLine = quotationCoreService.businessLine;
		var productName = quotationCoreService.productName;
		$scope.moduleService.DeDupCheckLifeInsured(name,businessLine,productName,data).then(function (data){
			if(data.duplicate === "true"){
				$scope.moduleService.searchDocumentByDocName(undefined, 'contact', undefined, undefined, data.docName, data.version).then(function(dataToPopulate) {
					$scope.moduleService.findElementInDetail(['lifeInsured','titleCode']).value = $scope.moduleService.findElementInElement(dataToPopulate, ['titleCode'])
					$scope.moduleService.findElementInDetail(['lifeInsured','person','first']).value = $scope.moduleService.findElementInElement(dataToPopulate, ['first'])
					$scope.moduleService.findElementInDetail(['lifeInsured','person','last']).value = $scope.moduleService.findElementInElement(dataToPopulate, ['last'])
					$scope.moduleService.findElementInDetail(['lifeInsured','person','birthDate']).value = $scope.moduleService.findElementInElement(dataToPopulate, ['birthDate'])
					$scope.moduleService.findElementInDetail(['lifeInsured','person','genderCode']).value = $scope.moduleService.findElementInElement(dataToPopulate, ['genderCode'])
					$scope.moduleService.findElementInDetail(['lifeInsured','person','smokerStatus']).value = $scope.moduleService.findElementInElement(dataToPopulate, ['smokerStatus'])
					$scope.moduleService.findElementInDetail(['lifeInsured','natureOfBusiness']).value = $scope.moduleService.findElementInElement(dataToPopulate, ['industry'])
					$scope.moduleService.findElementInDetail(['lifeInsured','occupationCode']).value = $scope.moduleService.findElementInElement(dataToPopulate, ['occupationCode']);
					$scope.moduleService.findElementInDetail(['lifeInsured', 'person', 'age']).value = ''
					$scope.computeAgeNearestBirthLifeInsured(commonService.CONSTANTS.VPMS_MAPPING_FIELD.AGE_NEAREST_BIRTHDAY, false);
				});
				commonUIService.showNotifyMessage('v4.' + self.moduleService.name + '.message.populateSuccessfully', 'success');
			}
			else{
				commonUIService.showNotifyMessage('v4.' + self.moduleService.name + '.message.createSuccessfully', 'success');
			}
			$scope.moduleService.detail.documentRelation.refContactLifeInsured.refDocName.value = data.docName
			$scope.moduleService.detail.documentRelation.refContactLifeInsured.refVersion.value = data.version
			
		});
	}
	$scope.checkImportStandAlone = function() {
		if( ($scope.moduleService.detail.typeQuo.value === commonService.CONSTANTS.QUOTATION_TYPE.NORMAL) && ($scope.moduleService.detail.version > 0)) {
			return true
		}
		else {
			return false
		}
	}
	$scope.checkIsPOSameLI = function(){
		var birthDayPO =  new Date($scope.moduleService.findElementInDetail(['policyOwner','person','birthDate']).value);
		var birthDayPO = birthDayPO.getDate() + '/' + birthDayPO.getMonth()+ '/' + birthDayPO.getFullYear();
		
		var birthDayLI =  new Date($scope.moduleService.findElementInDetail(['lifeInsured','person','birthDate']).value);
		var birthDayLI = birthDayLI.getDate() + '/' + birthDayLI.getMonth()+ '/' + birthDayLI.getFullYear();
		
		if($scope.moduleService.findElementInDetail(['isAddLifeInsured']).value === 'N'
				&& $scope.moduleService.findElementInDetail(['lifeInsured','person','first']).value === $scope.moduleService.findElementInDetail(['policyOwner','person','first']).value 
				&& $scope.moduleService.findElementInDetail(['lifeInsured','person','last']).value === $scope.moduleService.findElementInDetail(['policyOwner','person','last']).value
				&& birthDayPO === birthDayLI
				&& $scope.moduleService.findElementInDetail(['lifeInsured','person','genderCode']).value === $scope.moduleService.findElementInDetail(['policyOwner','person','genderCode']).value)
			return true
		else
			return false
	}
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
	
	$scope.computeQuotation = function(isShowComMessage) {
		if($scope.checkIsPOSameLI()){
			var question = 'v4.error.message.isPOsameLI';
			commonUIService.showNotifyMessage(question)
			return;
		}
		else{
			var self = this;
			var deferred = self.moduleService.$q.defer();
			//this quotation save for quotation create from BC 
			if(localStorage.getItem('quotationType') !== 'standalone' ){
				$scope.moduleService.detail.typeQuo.value = commonService.CONSTANTS.QUOTATION_TYPE.NORMAL;
			}
			else{
					$scope.moduleService.detail.typeQuo.value = commonService.CONSTANTS.QUOTATION_TYPE.STANDALONE;
			}
			$scope.moduleService.findElementInDetail(['selectedValueFund']).value = $scope.catStringFund();
			$scope.moduleService.findElementInDetail(['selectedValueWithdrawal']).value = $scope.catString($scope.moduleService.findElementInDetail(['withdrawal']).value);
			$scope.moduleService.findElementInDetail(['selectedValueSingleTopUp']).value = $scope.catString($scope.moduleService.findElementInDetail(['singleTopUp']).value);
			$scope.validateDetail().then(function(data){
				if (data.metaData.documentStatus.value === 'INVALID') {
					if(isShowComMessage == true)
						commonUIService.showNotifyMessage('v4.user.error.inputValidateFail');
					deferred.resolve("fail");
				} else {
					$scope.computeDetail().then(function(){
	//					deferred.resolve("success");
						$scope.saveDetail(false).then(function() {
							deferred.resolve("success");
						});
					});
				}
			});
			return deferred.promise;
		}
	}
	
	$scope.saveQuotation = function() {	
		if($scope.checkIsPOSameLI()){
			var question = 'v4.error.message.isPOsameLI';
			commonUIService.showNotifyMessage(question)
			return;
		}
		else{
			//this quotation save for quotation create from BC 
			if(localStorage.getItem('quotationType') !== 'standalone' ){
				$scope.moduleService.detail.typeQuo.value = commonService.CONSTANTS.QUOTATION_TYPE.NORMAL;
			}
			else{
					$scope.moduleService.detail.typeQuo.value = commonService.CONSTANTS.QUOTATION_TYPE.STANDALONE;
			}
			$scope.computeQuotation().then(function(data){
				if(data == "fail") {
					var question = 'MSG-FQ06';
					commonUIService.showYesNoDialog(question, function() {
						$scope.saveDetail(false);
					});
				}
	//			if(data == "success") {
	//				//$scope.saveDetail(false);
	//			}
			})
		}
	}
	
	$scope.confirmLoadingQuotation = function() {
		var performAceptAction = function() {
			$scope.salecaseCoreService.findElementInDetail(['underwriting', 'refBusinessStatus']).value = commonService.CONSTANTS.BUSINESS_OPERATION.UNDERWRITING.COUNTER_OFFER_CONFIRMED;
			$scope.moduleService.findElementInDetail(['businessStatus']).value = commonService.CONSTANTS.BUSINESS_STATUS.ACCEPTED;
			$scope.saveDetail(false,undefined,false).then(function(data){
				salecaseCoreService.acceptedQuotation = $scope.moduleService.extractDataModel(data);
				$scope.moduleService.freeze = true;
				$timeout(function (){
					commonUIService.showNotifyMessage('v4.UWquotation.message.acceptedSuccessfully', 'success');					
				}, 1000);
				if(!commonService.hasValueNotEmpty($scope.underwritingCoreService.detail)) {
					$scope.moduleService.getDocumentWithouUpdateDetail(undefined, $scope.salecaseCoreService.detail.underwriting.refType.value, $scope.salecaseCoreService.detail.underwriting.refId.value, undefined, $scope.salecaseCoreService.detail.underwriting.refBusinessType.value, $scope.salecaseCoreService.detail.underwriting.refProductName.value).then(function(data){	
						$scope.moduleService.findElementInElement(data, ['metaData']).businessStatus = commonService.CONSTANTS.BUSINESS_OPERATION.UNDERWRITING.COUNTER_OFFERED;
						$scope.moduleService.findElementInElement(data, ['underwritingDecisionInfo']).underwritingDecisionCd = commonService.CONSTANTS.BUSINESS_OPERATION.UNDERWRITING.COUNTER_OFFER_CONFIRMED;

						data.loading = 0;
						for(var i=0, n=$scope.moduleService.detail.basicPlan.loadingInformation.value.length; i<n; i++) {
							data.loading += $scope.moduleService.detail.basicPlan.loadingInformation.value[i].loading.value;
						}
						$scope.moduleService.updateDocument(undefined, data.metaData.docType, data.metaData.docId, data, data.metaData.businessType, data.metaData.productName);
					});
				} else {
					$scope.moduleService.findElementInElement($scope.underwritingCoreService.detail, ['metaData', 'businessStatus']).value = commonService.CONSTANTS.BUSINESS_OPERATION.UNDERWRITING.COUNTER_OFFERED;
					$scope.moduleService.findElementInElement($scope.underwritingCoreService.detail, ['underwritingDecisionInfo', 'underwritingDecisionCd']).value = commonService.CONSTANTS.BUSINESS_OPERATION.UNDERWRITING.COUNTER_OFFER_CONFIRMED;
					$scope.moduleService.findElementInElement($scope.underwritingCoreService.detail, ['loading']).value = 0;
					for(var i=0, n=$scope.moduleService.detail.basicPlan.loadingInformation.value.length; i<n; i++) {
						$scope.moduleService.findElementInElement($scope.underwritingCoreService.detail, ['loading']).value += $scope.moduleService.detail.basicPlan.loadingInformation.value[i].loading.value;
					}
					$scope.moduleService.updateDocument(undefined, $scope.underwritingCoreService.detail.metaData.docType.value, $scope.underwritingCoreService.detail.metaData.docId.value, $scope.underwritingCoreService.detail, $scope.underwritingCoreService.detail.metaData.businessType.value, $scope.underwritingCoreService.detail.metaData.productName.value);
				}
				
				
				
			});
		}
		if($scope.moduleService.detail != $scope.moduleService.originalDetail) {
			$scope.computeQuotation().then(function(data){
				if (data == 'success') {
					performAceptAction();
				} else {
					commonUIService.showNotifyMessage('v4.user.error.inputValidateFail');
				}
			});
		} else {
			performAceptAction();
		}
	}
	
	$scope.acceptedQuotation = function() {		
		if(localStorage.getItem('quotationType') !== 'standalone'){
			$scope.moduleService.detail.typeQuo.value = commonService.CONSTANTS.QUOTATION_TYPE.NORMAL;
		}
		else{
			$scope.moduleService.detail.typeQuo.value = commonService.CONSTANTS.QUOTATION_TYPE.STANDALONE;
		}
		for(var i=0; i < $scope.salecaseCoreService.detail.quotations.value.length;i++) {
			if($scope.salecaseCoreService.detail.quotations.value[i].refBusinessStatus.value == commonService.CONSTANTS.BUSINESS_STATUS.ACCEPTED) {
				commonUIService.showNotifyMessage('v4.error.message.acceptQuo');
				return;
			}
		}	
		
		// accept quotation
		var performAceptAction = function() {
			salecaseCoreService.acceptQuotation($scope.moduleService.detail).then(function(data) {
				if(data) {
					// re-structure quotation
					var acceptedQuo = data.quotations;
					if ($scope.moduleService.isSuccess(acceptedQuo)) {
						$scope.moduleService.convertDataModel2UiModel(acceptedQuo, $scope.moduleService.detail);
						$scope.moduleService.detail = angular.copy(acceptedQuo);
						$scope.moduleService.originalDetail = angular.copy(acceptedQuo);
						$scope.uiStructureRoot.isDetailChanged = false;
						$scope.reSetupConcreteUiStructure(
							$scope.moduleService.detail,
							commonService.CONSTANTS.UI_STRUCTURE.NOT_REMOVE_TEMPLATE_CHILDREN,
							commonService.CONSTANTS.UI_STRUCTURE.EXPECTED_DETAIL_NOT_CHANGED
						);
					}
					
					// re-structure data for case
					var updatedCase = data.cases;
					if (salecaseCoreService.isSuccess(updatedCase)) {
						salecaseCoreService.convertDataModel2UiModel(updatedCase, salecaseCoreService.detail);
						salecaseCoreService.detail = angular.copy(updatedCase);
						salecaseCoreService.originalDetail = angular.copy(updatedCase);
						$scope.$parent.uiStructureRoot.isDetailChanged = false;
						$scope.$parent.reSetupConcreteUiStructure(
							salecaseCoreService.detail,
							commonService.CONSTANTS.UI_STRUCTURE.NOT_REMOVE_TEMPLATE_CHILDREN,
							commonService.CONSTANTS.UI_STRUCTURE.EXPECTED_DETAIL_NOT_CHANGED
						);
					}
					
					// set quotation accepted
					salecaseCoreService.acceptedQuotation = $scope.moduleService.extractDataModel(data.quotations);
					$scope.moduleService.freeze = true;
					
					$timeout(function (){
						commonUIService.showNotifyMessage('v4.quotation.message.acceptedSuccessfully', 'success');
					}, 1000);
				}
			})
		}
		if($scope.moduleService.detail != $scope.moduleService.originalDetail) {
			$scope.computeQuotation().then(function(data){
				if (data == 'success') {
					performAceptAction();
				} else {
					commonUIService.showNotifyMessage('v4.user.error.inputValidateFail');
				}
			});
		} else {
			performAceptAction();
		}
	}
	
	/*$scope.addRiderCard = function(card) {
		$scope.moduleService.lazyListRider.push(angular.copy($scope.moduleService.findElementInElement($scope.moduleService.lazyChoiceList,['RiderNew'])));
		var length = card.parent.children.length;
		var riderCard = card.parent.children[length-1];	
		$scope.addCard(riderCard);
		var lengthRider = card.parent.refDetail.meta.counter;
		if(lengthRider == 0)
			card.parent.refDetail.value[lengthRider].riderName.value = $scope.moduleService.newRider;
		else 
			card.parent.refDetail.value[lengthRider].riderName.value = undefined;
		$scope.refreshDetail();
	}
	
	$scope.getRiderCardPos = function(card) {
		for(var i=0; i < card.parent.children.length; i ++) {
			if(card.parent.children[i] == card)
				return i-1;
		}
	}*/
	
/*	$scope.removeRiderCard = function(index, card) {
		$scope.moduleService.newRider = undefined;
		$scope.closeChildCards(card.level);
		$scope.moduleService.lazyListRider.splice(index, 1);
		$scope.removeCardInList(undefined, undefined, card.parent.children[index+1]);
		if(!$scope.checkExistingRiders(card.parent.children)){
			document.getElementsByName('illustration:Rider')[0].style.border = "";
			document.getElementsByName('illustration:Rider')[0].children[3].style.border = "";
		}
		
	}	*/
	
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
	
	
	
	/*$scope.checkExistingRiders = function(list) {
		var isHas = false;
		list.forEach(function(item){
			if(item.name ="illustration:RiderInformation"){
				isHas = true;
				return isHas;
			}
		});
	}*/
	$scope.addFund = function() {
		$scope.moduleService.lazyListFund.push(angular.copy($scope.moduleService.findElementInElement($scope.moduleService.lazyChoiceList,['FundQuotation'])));
		$scope.moduleService.addChildEleToParentEleWithCounter($scope.moduleService.findElementInDetail(['funds']),'value')
	}
	$scope.addWithdrawal = function() {
		$scope.moduleService.addChildEleToParentEleWithCounter($scope.moduleService.findElementInDetail(['withdrawal']),'value');
	}
	$scope.addRider = function(card){
		$scope.moduleService.lazyListRider.push(angular.copy($scope.moduleService.findElementInElement($scope.moduleService.lazyChoiceList,['RiderNew'])));
		$scope.moduleService.addChildEleToParentEleWithCounter($scope.moduleService.findElementInDetail(['riders']),'value')
		card.validStatus = 'INVALID';	
	}
	$scope.addLoadingInfor = function() {
		$scope.moduleService.addChildEleToParentEleWithCounter($scope.moduleService.detail.basicPlan.loadingInformation,'value');
	}
	$scope.removeFund = function(index) {		
		$scope.moduleService.lazyListFund.splice(index, 1);
		$scope.moduleService.removeChildEleToParentEleWithCounter(index, $scope.moduleService.findElementInDetail(['funds']),'value')
	}
	$scope.removeWithdrawal = function(index) {
		$scope.moduleService.removeChildEleToParentEleWithCounter(index, $scope.moduleService.findElementInDetail(['withdrawal']),'value');
	    $scope.reSetupConcreteUiStructure($scope.moduleService.detail, commonService.CONSTANTS.UI_STRUCTURE.NOT_REMOVE_TEMPLATE_CHILDREN, true);   

	}
	$scope.removeLoadingInfor = function(index) {
		$scope.moduleService.removeChildEleToParentEleWithCounter(index, $scope.moduleService.findElementInDetail(['loadingInformation']),'value');
	    $scope.reSetupConcreteUiStructure($scope.moduleService.detail, commonService.CONSTANTS.UI_STRUCTURE.NOT_REMOVE_TEMPLATE_CHILDREN, true);   
	}
	$scope.removeRider = function(card, index) {		
		$scope.moduleService.lazyListRider.splice(index, 1);
		$scope.moduleService.removeChildEleToParentEleWithCounter(index, $scope.moduleService.findElementInDetail(['riders']),'value')
		card.validStatus = 'VALID';	
	}
	
	$scope.removeSingleTopUp = function(index) {
		$scope.moduleService.removeChildEleToParentEleWithCounter(index, $scope.moduleService.findElementInDetail(['singleTopUp']),'value');
	    $scope.reSetupConcreteUiStructure($scope.moduleService.detail, commonService.CONSTANTS.UI_STRUCTURE.NOT_REMOVE_TEMPLATE_CHILDREN, true);   

	}

	$scope.addSingleTopUp = function() {
		$scope.moduleService.addChildEleToParentEleWithCounter($scope.moduleService.findElementInDetail(['singleTopUp']),'value');
	}
	//Support VPMS 
	$scope.catString = function(data){
		//var test = $scope.moduleService.findElementInDetail(['withdrawal']).value;
		var test = data;
		var arr = [];
		angular.forEach(test,function(item){
			arr.push(item.year.value);
		})
		return '(' + arr.join('!') + ')';
	}
	
	$scope.catStringFund = function(){
		var fund = $scope.moduleService.findElementInDetail(['funds']).value;
		var arr = [];
		angular.forEach(fund,function(item){
			arr.push(item.fundAllocated.value);
		})
		var result = "";
		var number = fund.length;
		if (number > 1) {			
			result = '(' + arr.join('!') + ')';
		} else {
			result = '(' + arr[0] + ')';
		}
		return result;
	}
	$scope.checkTotalFund100 = function(){
			$scope.checkTotalFund = 0;
		angular.forEach($scope.moduleService.findElementInDetail(['basicPlan','funds','value']), function(item, index){
			$scope.checkTotalFund = $scope.checkTotalFund + Number(item.fundAllocated.value);
		})
		if ($scope.checkTotalFund >= 100)
			return true;
		return false;
	}
	
	$scope.checkTotalLoading100 = function(){
		$scope.checkTotalLoading = 0;
	angular.forEach($scope.moduleService.findElementInDetail(['basicPlan','loadingInformation','value']), function(item, index){
		$scope.checkTotalLoading = $scope.checkTotalLoading + Number(item.loading.value);
	})
	if ($scope.checkTotalLoading >= 100)
		return true;
	return false;
}
	
	$scope.processFundList = function() {
		angular.forEach($scope.moduleService.lazyListFund, function(item, index){
			$scope.moduleService.lazyListFund[index] = angular.copy($scope.moduleService.findElementInElement($scope.moduleService.lazyChoiceList,['FundQuotation']));
			angular.forEach($scope.moduleService.detail.basicPlan.funds.value, function(item_1, index_1){				
				if((item_1.fundName.value != null || item_1.fundName.value != undefined) && index != index_1) {					
					angular.forEach($scope.moduleService.lazyListFund[index], function(item_2, index_2){
						if(item_2.key == item_1.fundName.value) {
							$scope.moduleService.lazyListFund[index].splice(index_2,1);
						}
					});
				}
			});
		});
	}
	
	$scope.processRiderList = function() {
		angular.forEach($scope.moduleService.lazyListRider, function(item, index){
			$scope.moduleService.lazyListRider[index] = angular.copy($scope.moduleService.findElementInElement($scope.moduleService.lazyChoiceList,['RiderNew']));
			angular.forEach($scope.moduleService.detail.riders.value, function(item_1, index_1){				
				if((item_1.riderName.value != null || item_1.riderName.value != undefined) && index != index_1) {					
					angular.forEach($scope.moduleService.lazyListRider[index], function(item_2, index_2){
						if(item_2.key == item_1.riderName.value) {
							$scope.moduleService.lazyListRider[index].splice(index_2,1);
						}
					});
				}
			});
		});
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
		if($scope.moduleService.freeze != true) {
			if($scope.moduleService.detail.isAddLifeInsured.value == commonService.CONSTANTS.PO_LI_RELATION.SAME) {
				$scope.moduleService.detail.isAddLifeInsured.value = commonService.CONSTANTS.PO_LI_RELATION.NOT_SAME;
				$scope.clearDataLifeInsured();
				$scope.refreshDetail();
				return;
			}
			if($scope.moduleService.detail.isAddLifeInsured.value == commonService.CONSTANTS.PO_LI_RELATION.NOT_SAME) {
				$scope.moduleService.detail.isAddLifeInsured.value = commonService.CONSTANTS.PO_LI_RELATION.SAME;
				$scope.clearDataLifeInsured();
				$scope.populateProposerToLifeInsured();
				$scope.closeChildCards(card.level);
				$scope.refreshDetail();
				// fix issue delete
				if(!$scope.shouldInitNormalQuotation()){
					$scope.goToPreviousTab();
				}
				return;
			}
		}
	}	

	
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
//		$scope.moduleService.clearDataInJson($scope.moduleService.detail.documentRelation.refContactLifeInsured,['value']);
//		$scope.moduleService.clearDataInJson($scope.moduleService.detail.lifeInsured,['value']);
//		$scope.moduleService.selectedContact = "";
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
	
	$scope.checkPdfExist = function (typePdf) {
		if($scope.shouldInitNormalQuotation()){
			var result = false;
			var attachments = this.salecaseCoreService.detail.attachments.value;
			for (var i = 0; i < attachments.length; i++)
				if(attachments[i].attachment.refId.value == undefined) {
					continue;
				} else if (attachments[i].attachment.refBusinessType.value == typePdf) {
					result = true;
					break;
				}
			return result;
		}
		else{
			return false
		}
	}
	
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
			if($stateParams.quotationStandalone && ($stateParams.quotationStandalone === true || $scope.$eval($stateParams.quotationStandalone)) ) { // $stateParams.quotationStandalone = "false"
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
	

	$scope.processLoadingList = function() {
		$scope.moduleService.originalLazyLoadingList = $scope.moduleService.findElementInElement($scope.moduleService.lazyChoiceList, ['LoadingType']);
		$scope.moduleService.tempLazyLoadingList = [];
		var loadingInformationList = $scope.moduleService.findElementInElement($scope.moduleService.detail, ['loadingInformation']).value;
		$scope.moduleService.tempLazyLoadingList = $scope.filterLazyList($scope.moduleService.originalLazyLoadingList, $scope.moduleService.tempLazyLoadingList, loadingInformationList);
		return;
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
	
	// hle71 - for 'Proceed BC' action of the quick quotation
	$scope.generateBusinessCaseFromQuickQuotationDetail = function (quotation) {
		return $scope.moduleService.generateBusinessCaseFromQuickQuotationAndNavigateToBC(quotation.metaData.docType.value, quotation.metaData.docName.value, quotation.metaData.businessType.value, quotation.metaData.productName.value, $scope.$root.currentRole);
	}

}];
