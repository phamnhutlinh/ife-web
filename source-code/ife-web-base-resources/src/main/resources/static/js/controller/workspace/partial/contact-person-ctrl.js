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
var ContactPersonalDetailCtrl = ['$scope', '$log', '$stateParams', '$mdToast','loadingBarService','$injector', '$location', '$filter', 'commonService', 'commonUIService', 'contactCoreService', 'salecaseCoreService', 'AclService','$rootScope',
	function($scope, $log, $stateParams, $mdToast, loadingBarService,$injector, $location, $filter, commonService, commonUIService, contactCoreService, salecaseCoreService, AclService, $rootScope) {

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
		$scope.ctrlName = genCtrlName('detail', commonService.CONSTANTS.MODULE_NAME.CONTACT, undefined, "personal");		
		contactCoreService.businessLine = "personal";
		$scope.moduleService = contactCoreService;
		$scope.salecaseService = salecaseCoreService;
		$scope.moduleService.freeze = false;
		$scope.moduleService.lazyChoiceList = undefined;
		$scope.isCardPDPAOpen = false;
		$scope.yestopass = [{"key":"Y","group":null,"$$hashKey":"object:390","translate":"Yes"},{"key":"N","group":null,"$$hashKey":"object:391","translate":"No"}]
		$scope.lazyChoiceListName = "ProvinceTownship,State,District,BusinessIndustry,RaceInformation,Education,Title,Gender,Occupation,MaritalStatus,IDType,Country,YesNo,SmokerStatus,EmploymentStatus,NatureOfBusiness,DiplomaQualification,WorkingExperience,FinanceRelatedQualifications,SourceOfFund,AddressType";
		//commonUIService.setupAclForDetail(AclService, [$stateParams.userRole]);
		$scope.setupStuffs().then(function(){
			$scope.setupActionBar($scope.moduleService.actionBar, undefined, $scope);
			$scope.$watch('[moduleService.detail.personInformation.person.basic.name.first.value, moduleService.detail.personInformation.person.basic.name.last.value]', function() {		
				$scope.moduleService.detail.personInformation.person.basic.name.full.value = (commonService.hasValueNotEmpty($scope.moduleService.detail.personInformation.person.basic.name.first.value)?$scope.moduleService.detail.personInformation.person.basic.name.first.value + " ":"") + (commonService.hasValueNotEmpty($scope.moduleService.detail.personInformation.person.basic.name.last.value)?$scope.moduleService.detail.personInformation.person.basic.name.last.value:"");
			}, true);
			$scope.$watch('[moduleService.detail.personInformation.person.addresses.value[0]]', function() {		
				$scope.displayFullAddress($scope.moduleService.detail.personInformation.person.addresses.value[0]);
			}, true);
			$scope.changeIDType();
			$scope.setIDNumber();
			$scope.displayFullAddress($scope.moduleService.detail.personInformation.person.addresses.value[0]);
		});
		$scope.$filter = $filter;
		$scope.filteredStates = {};
	};
	
	$scope.setupInitialData = function() {
		if (this.moduleService.detail.metaData.businessStatus.value == 'ACCEPTED')
			$scope.moduleService.freeze = true;
	};
	
	/************************************************************************************* */
	/******************************** End lifecycle methods ****************************** */
	/************************************************************************************* */	
	
	$scope.$on('someEvent', function(e) {  
		$scope.saveContact(undefined, undefined, "case");
    });
	
	/*
	 * Save contact detail after check user input existing contact
	 */
	$scope.saveContact = function(event, userClickButtonSave, moduleName){
		var self = this;	
		$scope.setIDNumber();
		$scope.displayFullAddress($scope.moduleService.detail.personInformation.person.addresses.value[0]);
		$scope.saveDetail(true).then(function(createdData){
			if(moduleName == "case"){
				//clone document first
				var doctype = $scope.moduleService.findElementInElement(createdData, ['docType']).value;
				var contactModel = $scope.moduleService.detail;
				var businessType = $scope.moduleService.findElementInElement(createdData, ['businessType']).value;
					var docName = contactModel.metaData.docName.value;
					loadingBarService.showLoadingBar();
					self.moduleService.cloneByDocName(undefined, doctype, businessType , undefined, docName)
					.then(function(data) {
						loadingBarService.showLoadingBar();
						if(commonService.hasValueNotEmpty(data)){
							//$scope.moduleService.findElementInElement(data, ['personInformation']).parentModule = commonService.CONSTANTS.MODULE_NAME.SALECASE;
							$scope.salecaseService.findElementInDetail(['prospects']).value[0].refId.value = data.id;
							$scope.salecaseService.findElementInDetail(['prospects']).value[0].refDocName.value = data.metaData.docName;
							$scope.salecaseService.findElementInDetail(['prospects']).value[0].refVersion.value = data.version;
							$scope.salecaseService.findElementInDetail(['prospects']).value[0].refBusinessType.value = data.metaData.businessType;
							$scope.salecaseService.findElementInDetail(['prospects']).value[0].status.value = commonService.CONSTANTS.DOCUMENT_STATUS.VALID;							
							$scope.moduleService.convertDataModel2UiModel(data, $scope.moduleService.detail);							
							$scope.moduleService.detail = angular.copy(data);
							$scope.moduleService.originalDetail = angular.copy(data);
							$scope.reSetupConcreteUiStructure(
									$scope.moduleService.detail,
									commonService.CONSTANTS.UI_STRUCTURE.NOT_REMOVE_TEMPLATE_CHILDREN,
									commonService.CONSTANTS.UI_STRUCTURE.EXPECTED_DETAIL_NOT_CHANGED
								);
							$scope.salecaseService.updateDocument(undefined, $scope.salecaseService.detail.metaData.docType.value, $scope.salecaseService.detail.id,
								$scope.salecaseService.detail, $scope.salecaseService.detail.metaData.businessType.value, $scope.salecaseService.detail.metaData.productName.value).then(function(updatedData){
									if(commonService.hasValueNotEmpty(updatedData)){
										console.log("Update Contact In Case Successfully");
									}
							});
						}
				}).then(function(){
					self.validateDetailCommon(self.moduleService).then(function(validateData){
						loadingBarService.hideLoadingBar();
						if((commonService.hasValueNotEmpty(validateData.documentError) && moduleName == "case") || $scope.moduleService.detail.metaData.documentStatus.value == "INVALID") {
							$scope.goToPreviousTab();
						}
					})
				});
			}
		}); //true ==> validate before save
	};
	$scope.displayFullAddress = function(prospect){
		var street = commonService.hasValueNotEmpty(prospect.street.value)?prospect.street.value + ', ':'';
		var line1 = commonService.hasValueNotEmpty(prospect.line1.value)?prospect.line1.value+ ', ':''; 
    	var line2 = commonService.hasValueNotEmpty(prospect.line2.value)?prospect.line2.value+ ', ':'';
		var district = commonService.hasValueNotEmpty(prospect.district.value)?prospect.district.value:'';
		if(commonService.hasValueNotEmpty(district)){
			var districtName = $filter('filter')($scope.moduleService.lazyChoiceList.District, {key: district});
		}
		else
			var districtName = ''
		
		districtName = commonService.hasValueNotEmpty(districtName)?districtName[0].group[0]+', ':'';
		var state = commonService.hasValueNotEmpty(prospect.state.value)?prospect.state.value:'';
		if(commonService.hasValueNotEmpty(state)){
			var stateName = $filter('filter')($scope.moduleService.lazyChoiceList.State, {key: state});
		}
		else
			var stateName = '';
		stateName = commonService.hasValueNotEmpty(stateName)?stateName[0].group[0]+', ':'';
		
		var country = commonService.hasValueNotEmpty(prospect.countryCode.value)?prospect.countryCode.value:'';
		if(commonService.hasValueNotEmpty(country)){
			var countryName = $filter('filter')($scope.moduleService.lazyChoiceList.Country, {key: country});
		}
		else
			var countryName = '';
		countryName = commonService.hasValueNotEmpty(countryName)?countryName[0].group[0]+' ':'';
		var fullAddress = street + line1 + line2 + stateName + districtName + countryName;
		$scope.moduleService.detail.personInformation.person.addresses.value[0].fullAddress.value = fullAddress;
	}
	$scope.filterStateBasedOnDistrict = function(selectedItem,index){
		if(commonService.hasValueNotEmpty(selectedItem)){
			var states = $scope.moduleService.lazyChoiceList.State;
			var districts = $scope.moduleService.lazyChoiceList.District;
			var groupFollowingState = undefined;
			//find group
			for(var i=0;i < districts.length; i++){
				if(selectedItem == districts[i].key){
					groupFollowingState = districts[i].group[2];
					break;
				}
			}
			//filtering group
			var stateAccordingDistrict = [];
			angular.forEach(states,function(state,index){
				if(groupFollowingState == state.group[1]){
					stateAccordingDistrict.push(state);
				}
			})
			$scope.filteredStates[index] = stateAccordingDistrict;
		}
	}
	
	
	$scope.setIDNumber = function(){
		if($scope.moduleService.detail.personInformation.person.basic.idType.value == 'N'){
			var towValue = $scope.moduleService.detail.personInformation.person.basic.township.value;
			var township = commonService.hasValueNotEmpty(towValue)?$filter('filter')($scope.moduleService.lazyChoiceList.ProvinceTownship, {key: towValue}):'';
			var townshipName = commonService.hasValueNotEmpty(township)?township[0].group[0]+' ':'';
			var segNo = commonService.hasValueNotEmpty($scope.moduleService.detail.personInformation.person.basic.seqno.value)?$scope.moduleService.detail.personInformation.person.basic.seqno.value:'';
			$scope.moduleService.detail.personInformation.person.basic.idNumber.value = townshipName + segNo;
			
		}
		
	}
	$scope.changeIDType = function(){
		var idType = $scope.moduleService.detail.personInformation.person.basic.idType.value;
		$scope.checkPriviousNRIC = undefined || $scope.checkPriviousNRIC;
		if(idType == 'N'){
			$scope.moduleService.detail.personInformation.person.basic.township.meta.mandatory = 'true';
			$scope.moduleService.detail.personInformation.person.basic.seqno.meta.mandatory = 'true';
			$scope.moduleService.detail.personInformation.person.basic.idNumber.value = '';
			$scope.moduleService.detail.personInformation.person.basic.idNumber.meta.editable = 'false';
			$scope.checkPriviousNRIC = true;
		}
		else{
			$scope.moduleService.detail.personInformation.person.basic.township.meta.mandatory = 'false';
			$scope.moduleService.detail.personInformation.person.basic.seqno.meta.mandatory = 'false';
			$scope.moduleService.detail.personInformation.person.basic.idNumber.meta.editable = 'true';
			$scope.moduleService.detail.personInformation.person.basic.township.value = '';
			$scope.moduleService.detail.personInformation.person.basic.seqno.value = '';
			if($scope.checkPriviousNRIC) {
				$scope.moduleService.detail.personInformation.person.basic.idNumber.value = '';
			}
			$scope.checkPriviousNRIC = false;
		}
	}
	
	
	$scope.isDisablePdfButton = function() {
		if ($scope.moduleService.detail == undefined) return true;
		if ($scope.moduleService.detail.metaData.documentStatus.value == "VALID")
			return false;
		return true;
	}
	
	$scope.isOpenCard = function() {
		$scope.isCardPDPAOpen = true;
	}
	
	$scope.isCloseCard = function() {
		$scope.isCardPDPAOpen = false;
	}
	
	$scope.isVisiblePDPAButton = function() {
		if ($scope.isCardPDPAOpen == true) return true;
		return false;
	}
	
	$scope.isVisibleCard = function() {
		if (this.moduleService.freeze == true) return false;
		return true;
	}
	
	$scope.visibleAdressCard = function(typeAddress) {
		if(typeAddress == "NON-PRIMARY")
			return true;
		return false;
	}
	
    $scope.clearDataACKA = function (name1,name2){
       $scope.moduleService.clearDataInJson($scope.moduleService.findElementInDetail([name1]));
       $scope.moduleService.clearDataInJson($scope.moduleService.findElementInDetail([name2]));
       $scope.refreshNoMessage();
    }
	
    $scope.checkAcceptQuotation = function (){
    	$scope.isAcceptQuotation = false;
    	if ($scope.salecaseService.detail != undefined) {
    		var detailQuotation = $scope.salecaseService.detail.quotations.value;
    		var lengthDetailQuotation = $scope.salecaseService.detail.quotations.value.length;
    		for (var i = 0; i<lengthDetailQuotation; i++)
    			if (detailQuotation[i].refBusinessStatus.value == "ACCEPTED") {
    				$scope.isAcceptQuotation = true;
    				break;
    			}
    	}
     }
    $scope.resetState = function(addressAccording){
    	return addressAccording.state.value = '';
    }
    
	//look up Singapore postal code
    $scope.clearResidentialAddress = function(addressTypeCode,information, parentNode){    	
    	parentNode.houseNumber.value = "";
    	parentNode.street.value = "";
    	parentNode.buildingName.value = "";
    	parentNode.cityCode.value = "";    	
    }; 
	
	/**
	 * Search by postalCode
	 */
	 $scope.entrySingaporePostalCode = function(addressTypeCode, parentNode){
	    	var self = this;
	    	var deferred = contactCoreService.$q.defer();
	    	var parentDetail;
	    	var information;
	    	var country;
	    	var postalCode;
	    	
	        if($scope.moduleService.findElementInDetail(['contactType']).value == 'INDIVIDUAL'){
	        	parentDetail = parentNode;
	        	information = 'personInformation';
	        	$scope.clearResidentialAddress(addressTypeCode,information, parentNode);
	        	if(commonService.hasValueNotEmpty(self.moduleService.findElementInElement(parentDetail, ['postalCode']).meta.errorCode)){
	        		self.moduleService.findElementInElement(parentDetail, ['postalCode']).meta.errorCode = "";
	        	}
	        	country = $scope.moduleService.findElementInElement(parentDetail, ['countryCode']).value;
	        	if (!commonService.hasValueNotEmpty(country) || (country != "SNG" && country != "732" && country != "Singapore" && country != "SGP" && country!="USA")){
	    			self.moduleService.findElementInElement(parentDetail, ['postalCode']).meta.errorCode = "MSG-C15";
	    			return;
	    		}
	    		postalCode = $scope.moduleService.findElementInElement(parentDetail, ['postalCode']).value;
	    		if(isNaN(postalCode) || postalCode=="" || postalCode == undefined){
	    			self.moduleService.findElementInElement(parentDetail, ['postalCode']).meta.errorCode = "MSG-C17";
	    			return;
	    		}
	        }
			
			if(postalCode != undefined){
				this.moduleService.callOneMapAPI(postalCode, country).then(function(data){
					var dataResult = data;
					if (dataResult.found < 1|| dataResult=="") {
						if(information == 'personInformation'){
							parentNode.houseNumber.value = "";
					    	parentNode.street.value = "";
					    	parentNode.buildingName.value = "";
					    	parentNode.cityCode.value = "";
					    	parentNode.unitNo.value = "";                            
				        }
						self.moduleService.findElementInElement(parentDetail, ['postalCode']).meta.errorCode = "MSG-C16";
						return;
					}
					if(dataResult.results.length > 0){
						if(information == 'personInformation'){
                    		parentNode.houseNumber.value = self.moduleService.findElementInElement(dataResult.results[0],['BLK_NO']);
							parentNode.street.value = self.moduleService.findElementInElement(dataResult.results[0],['ROAD_NAME']);
							parentNode.unitNo.value = "";
							parentNode.buildingName.value = self.moduleService.findElementInElement(dataResult.results[0],['BUILDING']).substr(0,30);
							if(country == "SGP"){
								parentNode.cityCode.value = "Singapore";							
							}else{
								parentNode.cityCode.value = "";
							}	
							parentNode.countryCode.value = country;
							parentNode.unitNo.value = "";
							parentNode.houseNumber.meta.errorCode = null;
							parentNode.street.meta.errorCode = null;
							parentNode.countryCode.meta.errorCode = null;
				        }
						parentDetail.postalCode.meta.errorCode = null;
					}
				});
			}
			return deferred.promise;
	    };
	
	$scope.clearDataArray = function(name) {
    	if($scope.moduleService.findElementInDetail(['consent']).value =='N'){
	    	angular.forEach($scope.moduleService.findElementInDetail([name]).value, function(item) {
	    		$scope.moduleService.clearDataInJson(item.value);
	    	})
    	}
		$scope.validateTag(commonService.CONSTANTS.VPMS_MAPPING_FIELD.COMMUNICATION_CHANNEL_VALUE).then(function(){			
			var errorCode = $scope.moduleService.findElementInDetail(['communicationChannel']).value[0].value.meta.errorCode;
			if(commonService.hasValueNotEmpty(errorCode)) {
				commonUIService.showNotifyMessage("communicationChannel." + errorCode, "warning");
			}    				
		});
    }
	
	/*
	 * Check boxes of personal data protection card 
	 */	
    $scope.checkAllBox = function() {
    	var communicationChannel = $scope.moduleService.findElementInDetail(['communicationChannel']).value;
    	var allValueItem = $scope.moduleService.findElementInDetail(['communicationChannel']).value[5].value.value;
    	angular.forEach(communicationChannel, function(item) {
			  item.value.value=allValueItem;
		});
    	if($scope.moduleService.findElementInDetail(['communicationChannel']).value[5].value.value=="true") {
    		//Vector for vpms
    		$scope.moduleService.findElementInDetail(['checkChannels']).value = "(1)";
    	} else {
    		//Vector for vpms
    		$scope.moduleService.findElementInDetail(['checkChannels']).value = "(0)";
    	}
    };
    
    /*
	 * Check each box of personal data protection card 
	 */	
    $scope.checkBox = function() {
    	var count = 0;
    	var communicationChannel = $scope.moduleService.findElementInDetail(['communicationChannel']).value;
    	//Vector for vpms
    	$scope.moduleService.findElementInDetail(['checkChannels']).value = "(0)";
    	angular.forEach(communicationChannel, function(item) {
    		if(item.code.value != "ALL") {
	    		if ((item.value.value=="false" || !commonService.hasValueNotEmpty(item.value.value))){
	    			$scope.moduleService.findElementInDetail(['communicationChannel']).value[5].value.value="";
	    			return;
	    		} else {
	    			count++;
	    		}
    		}
    		if(item.value.value=="true") {
    			//Vector for vpms
    			$scope.moduleService.findElementInDetail(['checkChannels']).value = "(1)";
    		}
    	});    	
    	if(count == communicationChannel.length-1) {
    		$scope.moduleService.findElementInDetail(['communicationChannel']).value[5].value.value="true";
    	}    	
    };
    
    $scope.autoPopulatedSelectCC = function(){
    	var age = parseInt($scope.moduleService.findElementInDetail(['age']).value);
    	if((age >= 62) && ($scope.moduleService.findElementInDetail(['languageProficiencyList']).value[0].value.value == "N" || $scope.moduleService.findElementInDetail(['languageProficiencyList']).value[1].value.value == "N"
    	   || $scope.moduleService.findElementInDetail(['educationLevelCode']).value == "Pr" || $scope.moduleService.findElementInDetail(['educationLevelCode']).value == "Sec"))
    			$scope.moduleService.findElementInDetail(['clientChecked']).value = "Y";
    	else {
			if(($scope.moduleService.findElementInDetail(['languageProficiencyList']).value[0].value.value == "N" || $scope.moduleService.findElementInDetail(['languageProficiencyList']).value[1].value.value == "N") && 
			($scope.moduleService.findElementInDetail(['educationLevelCode']).value == "Sec" || $scope.moduleService.findElementInDetail(['educationLevelCode']).value == "Pr"))
				$scope.moduleService.findElementInDetail(['clientChecked']).value = "Y";
			else{
				$scope.moduleService.findElementInDetail(['clientChecked']).value = "N";
			}	
    	}		
    }
    
    $scope.clearDataSCGroup = function(){
    	$scope.moduleService.clearDataInJson($scope.moduleService.findElementInDetail(['trusteeName']));
    	$scope.moduleService.clearDataInJson($scope.moduleService.findElementInDetail(['relationshipToClient']));
    	$scope.moduleService.clearDataInJson($scope.moduleService.findElementInDetail(['nricNo']));
    	$scope.moduleService.clearDataInJson($scope.moduleService.findElementInDetail(['specification']));
    	$scope.refreshNoMessage();
    }
    
    // Clear Data In Json for Object
    $scope.clearData = function(name,parent){
    	if(parent==null) {
    		$scope.moduleService.clearDataInJson($scope.moduleService.findElementInDetail([name]));	
    	}
    	else {
    		$scope.moduleService.clearDataInJson($scope.moduleService.findElementInDetail([name]));	
    		for (var i = $scope.moduleService.findElementInDetail([name]).length; i > 1; i-- ) {
    			$scope.moduleService.removeElementInElement(i-1,$scope.moduleService.detail,[parent],[name]);
    		}
    	}
    	$scope.refreshNoMessage();
    }
    
    $scope.autoPopulatedCKAOutcome = function(name1){
    	if ($scope.moduleService.findElementInDetail(['question1']).value == "N" && $scope.moduleService.findElementInDetail(['question2a']).value == "N" 
    		&& $scope.moduleService.findElementInDetail(['question2b']).value == "N" && $scope.moduleService.findElementInDetail(['question3']).value == "N")
    		{
    		 	$scope.moduleService.findElementInDetail(['passOrNot']).value = "N";
    		 	$scope.clearDataCKAPass();
    		}else 
    			{
    				$scope.moduleService.findElementInDetail(['passOrNot']).value = "Y";
    				$scope.clearDataCKAPass();
    			}
    }
    
    $scope.clearDataCKAPass = function (){
    	$scope.moduleService.clearDataInJson($scope.moduleService.findElementInDetail(['ckaIncomesesQuestion1']));
    	$scope.moduleService.clearDataInJson($scope.moduleService.findElementInDetail(['ckaIncomesesQuestion1a']));
    	$scope.moduleService.clearDataInJson($scope.moduleService.findElementInDetail(['ckaIncomesesQuestion1b']));
    	$scope.moduleService.clearDataInJson($scope.moduleService.findElementInDetail(['ckaIncomesesQuestion2']));
    	$scope.moduleService.clearDataInJson($scope.moduleService.findElementInDetail(['ckaIncomesesQuestion2a']));
    	$scope.moduleService.clearDataInJson($scope.moduleService.findElementInDetail(['ckaIncomesesQuestionSub2a']));
    }
    
    $scope.clearDataCKAGroup = function(name1,parent,name2){
    	if(name2 == null){
	    	$scope.moduleService.clearDataInJson($scope.moduleService.findElementInDetail([name1]));	
	    	
	    	for (var i = $scope.moduleService.findElementInDetail([name1]).length; i > 1; i-- ) {
	    		$scope.moduleService.removeElementInElement(i-1,$scope.moduleService.detail,[parent],[name1]);
	    	}
    	}
    	else{
    		$scope.moduleService.clearDataInJson($scope.moduleService.findElementInDetail([name1]));	
        	for (var i = $scope.moduleService.findElementInDetail([name1]).length; i > 1; i-- ) {
        		$scope.moduleService.removeElementInElement(i-1,$scope.moduleService.detail,[parent],[name1]);
        	}
        	$scope.moduleService.clearDataInJson($scope.moduleService.findElementInDetail([name2]));	
        	
        	for (var i = $scope.moduleService.findElementInDetail([name2]).length; i > 1; i-- ) {
        		$scope.moduleService.removeElementInElement(i-1,$scope.moduleService.detail,[parent],[name2]);
        	}
    	}
    	$scope.refreshNoMessage();
    }
    
    $scope.clearDataRefresh = function(element){
    	$scope.moduleService.clearDataInJson($scope.moduleService.findElementInDetail(element));
    	$scope.refreshNoMessage();
    }
    
    // Clear Data In Json Group for Existing Life Insurance Policies
    $scope.clearDataELGroup = function(child2,no){
	    	$scope.moduleService.clearDataInJson($scope.moduleService.findElementInDetail(['insurancePolicies']));	
	    	for (var i = $scope.moduleService.findElementInDetail(['insurancePolicies']).length; i > 1; i-- ) {
	    		$scope.moduleService.removeElementInElement(i-1,$scope.moduleService.detail,['existingFinancialPlans'],['insurancePolicies']);
	    	}	    	
	    	$scope.moduleService.clearDataInJson($scope.moduleService.findElementInDetail(['investments']));	    	
	    	for (var i = $scope.moduleService.findElementInDetail(['investments']).length; i > 1; i-- ) {
	    		$scope.moduleService.removeElementInElement(i-1,$scope.moduleService.detail,['existingFinancialPlans'],['investments']);
	    	}
	    	
	    	$scope.moduleService.clearDataInJson($scope.moduleService.findElementInDetail(['stateReason']));	
	    	$scope.moduleService.clearDataInJson($scope.moduleService.findElementInDetail(['additionalNote']));
	    	$scope.moduleService.clearDataInJson($scope.moduleService.findElementInDetail(['totalDeathValue']));
	    	$scope.moduleService.clearDataInJson($scope.moduleService.findElementInDetail(['totalTPDValue']));
	    	$scope.moduleService.clearDataInJson($scope.moduleService.findElementInDetail(['totalCIValue']));
	    	$scope.moduleService.clearDataInJson($scope.moduleService.findElementInDetail(['totalAcchsValue']));
	    	$scope.refreshNoMessage();
	} 
    
    /**
     * Refresh when change data from input contact
     */
    $scope.refreshNoMessage = function(){    	
    	var deferred = $scope.moduleService.$q.defer();    	
    	$scope.refreshDetail().then(function(data){
			if(data){
				$scope.moduleService.detail = data;
			 	$scope.reSetupConcreteUiStructure($scope.moduleService.detail, undefined, true);			 	
		    	deferred.resolve(data); 
			}else{
				$scope.commonUIService.showToast($translate.instant("v4.common.message.RefreshFailed"), "success");
			}			
        }); 
		return deferred.promise;
    };
    
    $scope.configForAddCard = function(card, mode) {
		$scope.addCard(card).then(function(data) {
	    	switch (mode) {
		    	case 'Address':
		    		data.addressType.value = "NON-PRIMARY";
		    		break;
	    	}
		});
    };
    $scope.removeAddress = function(card) {
    	if(card != undefined) {
	    	for(var i=0, n=card.parent.children.length; i<n; i++) {
				if(card.parent.children[i].isSelected) {
					$scope.closeChildCards(card.parent.children[i].level);
					break;
				}
			}
    	}
    	$scope.removeCardInList(undefined, undefined, card);
    };
}];