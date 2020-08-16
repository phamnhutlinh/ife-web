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
var ListImport = ['$scope', '$log', '$q', '$stateParams', '$mdToast','$injector', '$location', '$filter', 'commonService', 'commonUIService', 'fnaCoreService', 'salecaseCoreService', 'contactCoreService', 'quotationCoreService', 'AclService', 'loadingBarService', '$timeout',
	function($scope, $log, $q, $stateParams, $mdToast, $injector, $location, $filter, commonService, commonUIService, fnaCoreService, salecaseCoreService, contactCoreService, quotationCoreService, AclService, loadingBarService, $timeout) { 	
		
	this.$onInit = function() {
		$scope.ownerName = localStorage.getItem("username");
		$scope.initTypeSearch();		
	}	
	
	$scope.initTypeSearch = function() {
		var self = this;
		var defaultquery = [];
		if($scope.card.onOpen == "searchContactPersonal") {
			$scope.currentState = "prospect";
			defaultquery = [{"fields":["metaData.ownerName"],"values":[$scope.ownerName]}, {"fields":["metaData.documentStatus"],"values":["VALID"]}];			
			//$scope.searchContactPersonal(defaultquery);
		}
		if($scope.card.onOpen == "searchFNA") {
			$scope.currentState = "fna";
			var contactDocName = self.moduleService.findElementInDetail(['prospects', 'refDocName']).value;
			if(commonService.hasValueNotEmpty(contactDocName)){
				defaultquery = [{"fields":["metaData.ownerName"],"values":[$scope.ownerName]}, {"fields":["metaData.documentStatus"],"values":["VALID"]}, {"fields":["client.refContact.refDocName"],"values":[contactDocName]}];			
				$scope.searchFNA(defaultquery);
			} else {
				$scope.msg = 'There is no data.';
			}
		} else if($scope.card.onOpen === "searchCompleteStandaloneQuotation") { // redundant
			$scope.currentState = "quotation";
			var contactDocName = self.moduleService.findElementInDetail(['prospects', 'refDocName']).value;
			if(commonService.hasValueNotEmpty(contactDocName)){
				defaultquery = [{"fields":["typeQuo"],"values":[commonService.CONSTANTS.QUOTATION_TYPE.STANDALONE]}, {"fields":["metaData.ownerName"],"values":[$scope.ownerName]}, {"fields":["metaData.documentStatus"],"values":["VALID"]}];			
				$scope.searchCompleteStandaloneQuotation(defaultquery);
			} else {
				$scope.msg = 'There is no data.';
			}
		}
	}
	
	$scope.importContactToCase = function(card, docId, docName, businessType, $event) {
		var self = this;
		$scope.closeChildCards(0, $event);
		self.moduleService.cloneByDocName(undefined, 'contact', businessType , undefined, docName).then(function(data) {
			if(commonService.hasValueNotEmpty(data)){
				$scope.moduleService.findElementInElement(data, ['personInformation']).parentModule = commonService.CONSTANTS.MODULE_NAME.SALECASE;
				$scope.moduleService.findElementInDetail(['prospects']).value.push(angular.copy($scope.moduleService.findElementInDetail(['prospects', 'arrayDefault'])));
				$scope.moduleService.findElementInDetail(['prospects']).value[0].refId.value = data.id;
				$scope.moduleService.findElementInDetail(['prospects']).value[0].refDocName.value = docName;
				$scope.moduleService.findElementInDetail(['prospects']).value[0].refVersion.value = data.version;
				$scope.moduleService.findElementInDetail(['prospects']).value[0].refBusinessType.value = data.metaData.businessType;
				$scope.moduleService.findElementInDetail(['prospects']).meta.counter++;
				var tempData = angular.copy(data);
				contactCoreService.convertDataModel2UiModel(tempData, {});
				
				contactCoreService.operateDocument(
						self.requestURL,
						contactCoreService.name,
						commonService.CONSTANTS.ACTION.REFRESH,
						tempData,
						businessType
					).then(function (contactAfterRefresh) {
						if (contactAfterRefresh.metaData.documentStatus.value==commonService.CONSTANTS.DOCUMENT_STATUS.VALID){
							$scope.moduleService.findElementInDetail(['prospects']).value[0].status.value = commonService.CONSTANTS.DOCUMENT_STATUS.VALID;
						} else {
							$scope.moduleService.findElementInDetail(['prospects']).value[0].status.value = commonService.CONSTANTS.DOCUMENT_STATUS.INVALID; 
						}
						//update contact
						$scope.moduleService.updateDocument(undefined, data.metaData.docType, data.metaData.docId, data, data.metaData.businessType, data.metaData.productName);
						
						$scope.reSetupConcreteUiStructure(
								$scope.moduleService.detail,
								commonService.CONSTANTS.UI_STRUCTURE.NOT_REMOVE_TEMPLATE_CHILDREN,
								commonService.CONSTANTS.UI_STRUCTURE.EXPECTED_DETAIL_NOT_CHANGED
							);
						// wait for ui stable and move to prospect card
		  				$timeout(function(){
		  					$scope.moveToCard('case-management-base:Prospect');
		  				}, 200);
					});
				
			}
		});		
	}
	
	$scope.searchContactPersonal = function(defaultquery){
		var self = this;		
		var searchParams = {
			page: 0,
			size: $scope.pageSize
		};		
		self.moduleService.searchDocument(undefined, 'contact', defaultquery , searchParams, 'personal').then(function(data) {
			if(commonService.hasValueNotEmpty(data)){
				if(data._embedded){ //system has at least 1 contact
					$scope.contactList = data._embedded.metaDatas;					
				} else {
					$scope.msg = 'There is no data.';					
				}
			}else {
				$scope.msg = 'There is no data.';				
			}
		});		
	}
	
	/**
	 * search FNA 
	 */
	$scope.searchFNA = function(defaultquery){
		var self = this;		
		var searchParams = {
			page: 0,
			size: $scope.pageSize
		};	
		self.moduleService.searchDocument(undefined, 'fna', defaultquery , searchParams).then(function(data) {
			if(commonService.hasValueNotEmpty(data)){
				if(data._embedded){ //system has at least 1 fna
					$scope.fnaList = data._embedded.metaDatas;					
				} else {
					$scope.msg = 'There is no data.';					
				}
			}else {
				$scope.msg = 'There is no data.';				
			}
		});		
	}
	
	$scope.importFNAIntoCase = function(card, fnaDocName, $event) {
		var self = this;
		var businessType = $scope.moduleService.findElementInDetail(['metaData', 'businessType']).value;
		var productName = $scope.moduleService.findElementInDetail(['metaData', 'productName']).value;
		$scope.moduleService.importFNAIntoCase(businessType, productName, fnaDocName).then(function(data) {
			if(data){
				$scope.closeChildCards(0, $event);
				$scope.reSetupConcreteUiStructure(
						$scope.moduleService.detail,
						commonService.CONSTANTS.UI_STRUCTURE.NOT_REMOVE_TEMPLATE_CHILDREN,
						commonService.CONSTANTS.UI_STRUCTURE.EXPECTED_DETAIL_NOT_CHANGED
					);
				//resetup evalRefDetail
				if ($scope.evalRefDetail($scope.uiStructureRoot)) {
					$scope.markValidStatus($scope.uiStructureRoot);
				}
				return self.refreshDetail(true).then(function (data){
					//card.parent.children[1].validStatus = "INVALID";
					card.parent.children[1].visible = true;
					self.markValidStatus(card.parent.children[1]);
					self.updateParentValidStatus(card.parent.children[1]);
					
					// wait for ui stable and move to FNA card
	  				$timeout(function(){
	  					$scope.moveToCard('case-management-base:FNA');
	  				}, 200);
				});
			}
		});		
	}
	
	//////////////////////// Complete Quick Quotation import /////////////////////
	/**
	 * search Complete Standalone Quotations 
	 */
	$scope.searchCompleteStandaloneQuotation = function(defaultquery){ // unused
		var self = this;		
		var searchParams = {
			page: 0,
			size: $scope.pageSize
		};	
		self.moduleService.searchDocument(undefined, 'quotation', defaultquery , searchParams).then(function(data) {
			if(commonService.hasValueNotEmpty(data)){
				if(data._embedded){ //system has at least 1 complete standalone quotation
					$scope.completeQuotationList = data._embedded.metaDatas;					
				} else {
					$scope.msg = 'There is no data.';					
				}
			}else {
				$scope.msg = 'There is no data.';				
			}
		});		
	}
	
	
	$scope.checkLifeInsuredInformation = function(data){
		if(data.isAddLifeInsured == "N" && commonService.hasValueNotEmpty(data.lifeInsured.person.name.first)&&commonService.hasValueNotEmpty(data.lifeInsured.person.name.last)&&commonService.hasValueNotEmpty(data.lifeInsured.person.birthDate)&&commonService.hasValueNotEmpty(data.lifeInsured.person.genderCode)){
			return true
		}
		else
			return false
	}
	
	
	$scope.dedupCheck = function(data) { // no longer used
		var self = this;
		var name = quotationCoreService.name;
		var businessLine = quotationCoreService.businessLine;
		var productName = quotationCoreService.productName;
		$scope.moduleService.DeDupCheckLifeInsured(name,businessLine,productName,data).then(function (dataCheck){
			//Do somethings if duplicate = true or false later
			if(dataCheck.duplicate === "true"){			
				//commonUIService.showNotifyMessage('v4.' + self.moduleService.name + '.message.populateSuccessfully', 'success');
			}
			else{
				//commonUIService.showNotifyMessage('v4.' + self.moduleService.name + '.message.createSuccessfully', 'success');
			}
			data.documentRelation.refContactLifeInsured.refDocName = dataCheck.docName;
			data.documentRelation.refContactLifeInsured.refVersion = dataCheck.version;			
		});
	}
	
	function cloneQuickQuotation(docName, docType, businessType, productName) {
		var deferred = $q.defer();
		$scope.moduleService.cloneByDocName(undefined, docType, businessType , productName, docName).then(function(data) {
			if(!commonService.hasValueNotEmpty(data)){
				deferred.resolve('failed');
			} else {
				//check duplicate LI
				var isCheckLi = $scope.checkLifeInsuredInformation(data);
				if (isCheckLi) {
					$scope.moduleService.DeDupCheckLifeInsured(docType, businessType, productName, data).then(function (dataCheck){
						//Do somethings if duplicate = true or false later
						if(dataCheck.duplicate === "true"){			
							//commonUIService.showNotifyMessage('v4.' + self.moduleService.name + '.message.populateSuccessfully', 'success');
						}
						else{
							//commonUIService.showNotifyMessage('v4.' + self.moduleService.name + '.message.createSuccessfully', 'success');
						}
						data.documentRelation.refContactLifeInsured.refDocName = dataCheck.docName;
						data.documentRelation.refContactLifeInsured.refVersion = dataCheck.version;
						deferred.resolve(data);
					});
				} else {
					deferred.resolve(data);
				}
			}
		});
		return deferred.promise;
	}
	
	function addNewQuotationReferenceToCase(clonedQuotation) {
		var newQuotationCloned = angular.copy($scope.moduleService.findElementInDetail(['quotations', 'arrayDefault']));
		newQuotationCloned.refId.value = clonedQuotation.id;
		newQuotationCloned.refDocName.value = clonedQuotation.metaData.docName;
		newQuotationCloned.refVersion.value = clonedQuotation.version;
		newQuotationCloned.refBusinessType.value = clonedQuotation.metaData.businessType;
		// Add the cloned quotation to the case model
		$scope.moduleService.findElementInDetail(['quotations']).value.push(newQuotationCloned);
		$scope.moduleService.findElementInDetail(['quotations']).meta.counter++;
	}
	
	function overrideQuotationProspect(clonedQuotation) {
		var deferred = $q.defer();
		
		// Override prospect
		var prospect = $scope.moduleService.findElementInDetail(['prospects']).value[0];
		clonedQuotation.documentRelation.refContact.refDocName = prospect.refDocName.value;
		clonedQuotation.documentRelation.refContact.refVersion = prospect.refVersion.value;
		contactCoreService.getDocument(undefined, contactCoreService.name, prospect.refId.value, undefined, 'personal', undefined).then(function (contact) {
			loadingBarService.showLoadingBar();
			clonedQuotation.policyOwner.person.name = contact.personInformation.person.basic.name;
			clonedQuotation.policyOwner.person.birthDate = contact.personInformation.person.basic.birthDate;
			clonedQuotation.policyOwner.person.age = contact.personInformation.person.basic.age;
			clonedQuotation.policyOwner.person.genderCode = contact.personInformation.person.basic.genderCode;
			clonedQuotation.policyOwner.person.maritalStatusCode = contact.personInformation.person.basic.maritalStatusCode;
			clonedQuotation.policyOwner.person.smokerStatus = contact.personInformation.person.basic.smokerStatus;
			clonedQuotation.policyOwner.person.nationalityCode = contact.personInformation.person.basic.nationalityCode;
			clonedQuotation.policyOwner.person.religionCode = contact.personInformation.person.basic.religionCode;
			clonedQuotation.policyOwner.person.birthCountryCode = contact.personInformation.person.basic.birthCountryCode;
			
			deferred.resolve(clonedQuotation);
		});
		return deferred.promise;
	}
	
	function saveQuotation(quotation) {
		return $scope.moduleService.updateDocument(undefined, quotation.metaData.docType, quotation.metaData.docId, quotation, quotation.metaData.businessType, quotation.metaData.productName);
	}
	
	function saveAndValidateAndComputeQuotation(clonedQuotation) {
		var deferred = $q.defer();
		// The first update to keep typeQuo commonService.CONSTANTS.QUOTATION_TYPE.NORMAL
		saveQuotation(clonedQuotation).then(function (savedQuotation) {
			loadingBarService.showLoadingBar();
			quotationCoreService.refreshValidateComputeQuotation(savedQuotation).then(function (computedQuotationUiModel) {
				loadingBarService.showLoadingBar();
				var computedQuotation = quotationCoreService.extractDataModel(computedQuotationUiModel);
				// Update computed quotation
				saveQuotation(computedQuotation).then(function (updatedQuotation) {
					deferred.resolve(updatedQuotation);
				});
			});
		});
		return deferred.promise;
	}
	
	function updateBusinessCaseWithQuotationReference(updatedQuotation) {
		// Look up the quotation in the business case model
		var quotationInCase = undefined;
		var index = 0;
		var quotationList = $scope.moduleService.findElementInDetail(['quotations']).value;
		for (var i = 0; i < quotationList.length; i++) {
			if (updatedQuotation.id === quotationList[i].refId.value) {
				quotationInCase = quotationList[i];
				index = i;
				break;
			}
		}
		
		// Update the status of the quotation in the business case model
		if (quotationInCase) {
			quotationInCase.status.value = updatedQuotation.metaData.documentStatus;
		}
		
		//??????? Auto save business case to update the quotation reference
		
		$scope.reSetupConcreteUiStructure(
				$scope.moduleService.detail,
				commonService.CONSTANTS.UI_STRUCTURE.NOT_REMOVE_TEMPLATE_CHILDREN,
				commonService.CONSTANTS.UI_STRUCTURE.EXPECTED_DETAIL_NOT_CHANGED
			);
		//resetup evalRefDetail
		if ($scope.evalRefDetail($scope.uiStructureRoot)) {
			$scope.markValidStatus($scope.uiStructureRoot);
		}
		
		//??????? Auto save business case to update the quotation reference
	}
	
	function openQuotationDetail(thisArg, card, updatedQuotation) {
		return thisArg.refreshDetail(true).then(function (data){
			loadingBarService.showLoadingBar();
			//card.parent.children[1].validStatus = "INVALID";
			card.parent.children[2].visible = true;
			thisArg.markValidStatus(card.parent.children[2]);
			thisArg.updateParentValidStatus(card.parent.children[2]);
				
				// wait for rendering ui structure completed  and then open detail of new quotation
			$timeout(function() {
				var childCards = card.parent.children;
				var indexNewQuoCard = undefined;
				var newQuoCard = undefined;
				// get new quotation card element
				// note: new quotation card's position is last of children position but before the position  of add button
				for(var i = childCards.length - 1; i >= 0; i--) {
					if(childCards[i].cardType.toLowerCase() !== 'action') {
						indexNewQuoCard = i;
						newQuoCard = childCards[indexNewQuoCard];
						break;
					}
				}
				
				if(indexNewQuoCard !== undefined) {
					var level = newQuoCard.level ? newQuoCard.level : 1;
					var htmlIdOfNewQuo = '#level-' + level + '-card-' + indexNewQuoCard;
				    var newQuoEle = angular.element(htmlIdOfNewQuo);
				    if(newQuoEle === undefined || newQuoEle.length === 0) {
				    	$log.error("Not found a new Quotation element");
				    	return;
				    }
					var htmlEleOfNewQuo = newQuoEle.scope().card.html;
				    
				    if(htmlEleOfNewQuo) {
				    	htmlEleOfNewQuo.triggerHandler('click');
				    } else {
				    	$log.error("not found html of new Quotation element");
				    }
				} else {
					$log.error("not found a position of a new Quotation element");
				}
				loadingBarService.hideLoadingBar();
			}, 500);
		});
	}
	
	$scope.importQuotationToCase = function(card, docId, docName, $event) {
		loadingBarService.showLoadingBar();
		var self = this;
		var businessType = $scope.moduleService.findElementInDetail(['metaData', 'businessType']).value;
		var productName = $scope.moduleService.findElementInDetail(['metaData', 'productName']).value;
		cloneQuickQuotation(docName, quotationCoreService.name, businessType, productName).then(function(clonedQuotation) {
			loadingBarService.showLoadingBar();
			if (clonedQuotation === 'failed') {
				// displaying an error message
				return;
			}
			
			addNewQuotationReferenceToCase(clonedQuotation);
			
			overrideQuotationProspect(clonedQuotation).then(function (clonedQuotation) {
				loadingBarService.showLoadingBar();
				// change quotation type after cloning it
				clonedQuotation.typeQuo = commonService.CONSTANTS.QUOTATION_TYPE.NORMAL;
				clonedQuotation.metaData.documentStatus = commonService.CONSTANTS.DOCUMENT_STATUS.INVALID; // must save or compute to update after overriding prospect to get VALID status
				
				saveAndValidateAndComputeQuotation(clonedQuotation).then(function (updatedQuotation) {
					loadingBarService.showLoadingBar();
					updateBusinessCaseWithQuotationReference(updatedQuotation);
					return openQuotationDetail(self, card, updatedQuotation);
				});
			});
		});
	} // $scope.importQuotationToCase
	//////////////////////Complete Quick Quotation import /////////////////////
	
}];