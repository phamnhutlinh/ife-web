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
var ApplicationPncDetailCtrl = ['$scope', '$log', '$stateParams', '$injector', '$location', '$mdDialog', 'commonService', 'commonUIService', 'accountCoreService', 'loadingBarService', 'applicationCoreService','quotationCoreService', 'salecaseCoreService', 'contactCoreService', '$filter','$rootScope',
	function($scope, $log, $stateParams, $injector, $location, $mdDialog, commonService, commonUIService, accountCoreService, loadingBarService, applicationCoreService,quotationCoreService, salecaseCoreService, contactCoreService, $filter, $rootScope) {

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
		$scope.ctrlName = genCtrlName('detail', commonService.CONSTANTS.MODULE_NAME.APPLICATION, undefined, commonService.CONSTANTS.PRODUCT_LOB.PNC);
		applicationCoreService.freeze = false;
		$scope.moduleService = applicationCoreService;
		$scope.salecaseCoreService = salecaseCoreService;
		$scope.lazyChoiceListName = "ApplicationCountry,CorporateCountry,CorporateIndustry,CorporateCategory,ProvinceTownship,FuelType,State,District,MT2AppDocumentType,MakeAndModel,TypeOfBody,YesNo,PerDayWeek,PremiumFrequency,USTaxQuestions,AddressType,Industry,BusinessIndustry,Gender,SmokerStatus,IDType,Title,MaritalStatus,Occupation,Country,RaceInformation,Education,EmploymentStatus,SourceOfFund,PolicyDelivery,Religion,MethodPayingPremium,RelationshipProposer";
		$scope.setupStuffs().then(function(){
			$scope.setupActionBar($scope.moduleService.actionBar, undefined, $scope);
			
			if($scope.moduleService.freeze === false && !$scope.moduleService.detail.reviewRequiredAppliCation.value){
				$scope.quotationSumary =  $scope.salecaseCoreService.detail.quotations.value[0].summary;
				if($scope.quotationSumary.conveyance === 'S'){
					var d = new Date();
					var age = parseInt(d.getFullYear())-($scope.quotationSumary.insuredPremiumString);
					if(parseInt($scope.quotationSumary.marineOpenCoverInsured.ageMax) === 0 &&  parseInt($scope.quotationSumary.marineOpenCoverInsured.ageMin) === 0){
						if(age > 30){
							$scope.moduleService.detail.reviewRequiredAppliCation.value="Y";
							$scope.isfreeze = true;
						}else{
							$scope.moduleService.detail.reviewRequiredAppliCation.value="N";
						}
					}else{
						if(parseInt($scope.quotationSumary.insuredPremiumString)==1900){
							$scope.moduleService.detail.reviewRequiredAppliCation.value="Y";
							$scope.isfreeze = true;
						 }else{
							 if(age >= parseInt($scope.quotationSumary.marineOpenCoverInsured.ageMin) && age <= parseInt($scope.quotationSumary.marineOpenCoverInsured.ageMax)){
									$scope.moduleService.detail.reviewRequiredAppliCation.value="Y";
									$scope.isfreeze = true;
								}else{
									$scope.moduleService.detail.reviewRequiredAppliCation.value="N";
								}
						 }
						
					}
				}else{
					$scope.moduleService.detail.reviewRequiredAppliCation.value="N";
				}
				$scope.refreshDetail(true);
			}
		});
        $scope.isSignRequired = false;
        $scope.filteredStates = {};
	};
	
	
	
	$scope.setupInitialData = function() {
		if($scope.moduleService.detail.metaData.businessStatus.value == commonService.CONSTANTS.BUSINESS_STATUS.ACCEPTED) {
			$scope.moduleService.freeze = true;
		}
	};

	/************************************************************************************* */
	/******************************** End lifecycle methods ****************************** */
	/************************************************************************************* */	

	$scope.validateQuotation = function() {
		var self = this;
		var deferred = self.moduleService.$q.defer();
		$scope.validateDetail().then(function(){
			if (self.uiStructureRoot.validStatus === 'INVALID') {
				//commonUIService.showNotifyMessage('v4.user.error.inputValidateFail');
				deferred.resolve("fail");
			} else {
				deferred.resolve("success");
			}
		});
		return deferred.promise;
	};
	
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
	
	$scope.saveApplication = function() {
		$scope.setIDNumber();
		$scope.displayFullAddress($scope.moduleService.detail.documentRelation.policyOwnerType.value)
		$scope.validateQuotation().then(function(data){
			//sync data between policy holder and prospect
			if(data == "fail") {
				var question = 'MSG-FQ06';
				commonUIService.showYesNoDialog(question, function() {
					$scope.saveDetail(false);
				});
			}
			if(data == "success") {
				$scope.saveDetail(false);
			}
		})
	};

	$scope.setIDNumber = function(){
		if($scope.moduleService.detail.policyOwnerDetails.proporserInformation.person.basic.idType.value == 'N'){
			var towValue = $scope.moduleService.detail.policyOwnerDetails.proporserInformation.person.basic.township.value;
			var township = commonService.hasValueNotEmpty(towValue)?$filter('filter')($scope.moduleService.lazyChoiceList.ProvinceTownship, {key: towValue}):'';
			var townshipName = commonService.hasValueNotEmpty(township)?township[0].group[0]+' ':'';
			var segNo = commonService.hasValueNotEmpty($scope.moduleService.detail.policyOwnerDetails.proporserInformation.person.basic.seqno.value)?$scope.moduleService.detail.policyOwnerDetails.proporserInformation.person.basic.seqno.value:'';
			$scope.moduleService.detail.policyOwnerDetails.proporserInformation.person.basic.idNumber.value = townshipName + segNo;
		}
	}
	$scope.changeIDType = function(){
		var idType = $scope.moduleService.detail.policyOwnerDetails.proporserInformation.person.basic.idType.value;
		$scope.checkPriviousNRIC = undefined || $scope.checkPriviousNRIC;
		if(idType == 'N'){
			$scope.moduleService.detail.policyOwnerDetails.proporserInformation.person.basic.township.meta.mandatory = 'true';
			$scope.moduleService.detail.policyOwnerDetails.proporserInformation.person.basic.seqno.meta.mandatory = 'true';
			$scope.moduleService.detail.policyOwnerDetails.proporserInformation.person.basic.idNumber.value = '';
			$scope.moduleService.detail.policyOwnerDetails.proporserInformation.person.basic.idNumber.meta.editable = 'false';
			$scope.checkPriviousNRIC = true;
		}
		else{
			$scope.moduleService.detail.policyOwnerDetails.proporserInformation.person.basic.township.meta.mandatory = 'false';
			$scope.moduleService.detail.policyOwnerDetails.proporserInformation.person.basic.seqno.meta.mandatory = 'false';
			$scope.moduleService.detail.policyOwnerDetails.proporserInformation.person.basic.idNumber.meta.editable = 'true';
			$scope.moduleService.detail.policyOwnerDetails.proporserInformation.person.basic.township.value = '';
			$scope.moduleService.detail.policyOwnerDetails.proporserInformation.person.basic.seqno.value = '';
			if($scope.checkPriviousNRIC) {
				$scope.moduleService.detail.policyOwnerDetails.proporserInformation.person.basic.idNumber.value = '';
			}
			$scope.checkPriviousNRIC = false;
				
		}
	}
	
    $scope.clearData = function(object){
    	angular.forEach(object, function(value, key) {
    		  //console.log(key + ': ' + value);
    		  value.value="";
    		  value.meta.errorCode="";
    		})
    		return object;
    }
    
    $scope.clearErrorCode= (function(item){
    	if(item.value != "" || item.value != null){
    		item.meta.errorCode = '';
    	}
    })
    
    $scope.removeItem = function(list, index){
    	list.splice(index, 1);
    }
    
    $scope.clearDetail = function(detail, object){
    	if(object.questionValue.value == 'N'){
    		
    		if(object.qkey.value == "LQ1"){
    			
    			$scope.changePropertyValue([object.generalQ3Amount, object.generalQ3BeverageType, object.generalQ3Howlong], "value", "");
    			$scope.changePropertyValue([object.generalQ3Amount.meta, object.generalQ3BeverageType.meta, object.generalQ3Howlong.meta], "errorCode", "");
    			$scope.changePropertyValue([object.generalQ3Amount.meta, object.generalQ3BeverageType.meta, object.generalQ3Howlong.meta], "mandatory", "false")
    			
    		}else if(object.qkey.value == "LQ2"){
    			$scope.changePropertyValue([object.generalQ5CigaretesDay, object.generalQ5Explain, object.generalQ5Since], "value", "");
    			$scope.changePropertyValue([object.generalQ5CigaretesDay.meta, object.generalQ5Explain.meta, object.generalQ5Since.meta], "errorCode", "");
    			$scope.changePropertyValue([object.generalQ5CigaretesDay.meta, object.generalQ5Explain.meta, object.generalQ5Since.meta], "mandatory", "false")
    			
    			
    		}else{
    			if( detail.value == null || (detail.value != null && typeof detail.value == 'string')){
    				detail.value = "";
    				detail.meta.errorCode = "";
    				if(object.qkey.value == "BQ3")
    					
    					detail.meta.mandatory = "true";
    				else
    					detail.meta.mandatory = "false";
    			}else{
    				detail.value.length = 0;
    				
    			}
    		}
    	}else{
    		if(object.qkey.value == "LQ1"){
    			$scope.changePropertyValue([object.generalQ3Amount.meta, object.generalQ3BeverageType.meta, object.generalQ3Howlong.meta], "mandatory", "true")

    		}else if(object.qkey.value == "LQ2"){
    			
    			$scope.changePropertyValue([object.generalQ5CigaretesDay.meta, object.generalQ5Explain.meta, object.generalQ5Since.meta], "mandatory", "true")
    		}else{
    			if( detail.value == null || (detail.value != null && typeof detail.value == 'string')){
    				if(object.qkey.value == "BQ3")
    					detail.meta.mandatory = "false";
    				else
    					detail.meta.mandatory = "true";
    			}else{
    	      		detail.value.length = 0;
    				detail.value.push(angular.copy(detail.arrayDefault));
    			}
    		}
    		
    	}
    }
    
    $scope.entrySingaporePostalCode = function(addressTypeCode, parentNode) {
    	var self = this;
    	var deferred = contactCoreService.$q.defer();
    	var parentDetail;
    	var information;
    	var country;
    	var postalCode;
    	
        if(true/*$scope.moduleService.findElementInDetail(['contactType']).value == 'INDIVIDUAL'*/){
        	parentDetail = parentNode;
        	information = 'personInformation';
        	$scope.clearResidentialAddress(addressTypeCode,information, parentNode);
        	if(commonService.hasValueNotEmpty(self.moduleService.findElementInElement(parentDetail, ['postalCode']).meta.errorCode)){
        		self.moduleService.findElementInElement(parentDetail, ['postalCode']).meta.errorCode = "";
        	}
        	country = $scope.moduleService.findElementInElement(parentDetail, ['countryCode']).value;
        	if (!commonService.hasValueNotEmpty(country) || (country != "SNG" && country != "SGP" && country != "732" && country != "Singapore" && country != "USA")){
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
				if (dataResult.found < 1 || dataResult=="" ) {
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
    $scope.addDriver = function(){
    	$scope.moduleService.addChildEleToParentEleWithCounter($scope.moduleService.findElementInDetail(['driver']),'value');
    	if($scope.moduleService.detail.driver.value.length > 1){
    		$scope.moduleService.detail.driver.arrayDefault.driverIsPolicyHolder.value = 'false';
    	}
    	else if($scope.moduleService.detail.driver.value.length == 1){
    		$scope.moduleService.detail.driver.value[0].driverIsPolicyHolder.value = 'true';
    	}
    }
    $scope.removeNamedDriver = function(index,item) {
    	var policyValue = $scope.moduleService.detail.driver.value[0].driverIsPolicyHolder.value;
		$scope.moduleService.removeChildEleToParentEleWithCounter(index, $scope.moduleService.findElementInDetail(['driver']),'value');
	    $scope.reSetupConcreteUiStructure($scope.moduleService.detail, commonService.CONSTANTS.UI_STRUCTURE.NOT_REMOVE_TEMPLATE_CHILDREN, true);   
	    if(index == 0 && item.length >=1){
	    	if(policyValue == 'true'){
	    		$scope.isCheckedForFirstDriver('true');
	    	}
	    	else
	    		$scope.isCheckedForFirstDriver('false');
	    }
	}
    $scope.isCheckedForFirstDriver = function(changeNextDriverToMainDriver){
    	if(changeNextDriverToMainDriver == 'true'){
    		$scope.moduleService.detail.driver.value[0].driverIsPolicyHolder.value = 'true';
    		$scope.shouldBeBlankField = 'true';
    	}
    	if($scope.moduleService.detail.driver.value[0].driverIsPolicyHolder.value == 'true'){
    		$scope.moduleService.detail.driver.value[0].driverFirstName.meta.enable = 'false';
        	$scope.moduleService.detail.driver.value[0].driverLastName.meta.enable = 'false';
        	$scope.moduleService.detail.driver.value[0].driverGender.meta.enable = 'false';
        	$scope.moduleService.detail.driver.value[0].driverIDNo.meta.enable = 'false';
        	$scope.moduleService.detail.driver.value[0].driverDateofBirth.meta.enable = 'false';
        	$scope.moduleService.detail.driver.value[0].driverFirstName.value = $scope.moduleService.detail.policyOwnerDetails.proporserInformation.person.basic.name.first.value;
        	$scope.moduleService.detail.driver.value[0].driverLastName.value =  $scope.moduleService.detail.policyOwnerDetails.proporserInformation.person.basic.name.last.value;
        	$scope.moduleService.detail.driver.value[0].driverGender.value = $scope.moduleService.detail.policyOwnerDetails.proporserInformation.person.basic.genderCode.value;
        	$scope.moduleService.detail.driver.value[0].driverIDNo.value = $scope.moduleService.detail.policyOwnerDetails.proporserInformation.person.basic.idNumber.value;
        	$scope.moduleService.detail.driver.value[0].driverDateofBirth.value = $scope.moduleService.detail.policyOwnerDetails.proporserInformation.person.basic.birthDate.value;
    	}
    }
    $scope.isPolicyHolder = function(index,item){
    	if(item.driverIsPolicyHolder.value == 'true' && index == 0){
    		$scope.previousValueNamedDriver = angular.copy($scope.moduleService.detail.driver.value[0]);
    		$scope.moduleService.detail.driver.value[0].driverIsPolicyHolder.value = item.driverIsPolicyHolder.value;
    		$scope.moduleService.detail.driver.value[0].driverFirstName.meta.enable = 'false';
    		$scope.moduleService.detail.driver.value[0].driverLastName.meta.enable = 'false';
    		$scope.moduleService.detail.driver.value[0].driverGender.meta.enable = 'false';
    		$scope.moduleService.detail.driver.value[0].driverIDNo.meta.enable = 'false';
    		$scope.moduleService.detail.driver.value[0].driverDateofBirth.meta.enable = 'false';
    		$scope.moduleService.detail.driver.value[0].driverFirstName.value = $scope.moduleService.detail.policyOwnerDetails.proporserInformation.person.basic.name.first.value;
    		$scope.moduleService.detail.driver.value[0].driverLastName.value =  $scope.moduleService.detail.policyOwnerDetails.proporserInformation.person.basic.name.last.value;
    		$scope.moduleService.detail.driver.value[0].driverGender.value = $scope.moduleService.detail.policyOwnerDetails.proporserInformation.person.basic.genderCode.value;
    		$scope.moduleService.detail.driver.value[0].driverIDNo.value = $scope.moduleService.detail.policyOwnerDetails.proporserInformation.person.basic.idNumber.value;
    		$scope.moduleService.detail.driver.value[0].driverDateofBirth.value = $scope.moduleService.detail.policyOwnerDetails.proporserInformation.person.basic.birthDate.value;
    	}
    	else if(item.driverIsPolicyHolder.value == 'false'){
    		if(commonService.hasValueNotEmpty($scope.previousValueNamedDriver)){
    			$scope.moduleService.detail.driver.value[0] = $scope.previousValueNamedDriver;
    			$scope.moduleService.detail.driver.value[0].driverIsPolicyHolder.value = item.driverIsPolicyHolder.value;
    		}
    		else if(!commonService.hasValueNotEmpty($scope.previousValueNamedDriver)){
    			$scope.moduleService.detail.driver.value[0].driverFirstName.value = '';
        		$scope.moduleService.detail.driver.value[0].driverLastName.value =  '';
        		$scope.moduleService.detail.driver.value[0].driverGender.value = '';
        		$scope.moduleService.detail.driver.value[0].driverIDNo.value = '';
        		$scope.moduleService.detail.driver.value[0].driverDateofBirth.value = '';
        		if(index == 0){
			        $(".picker__day--selected").removeClass( "picker__day--selected" );
        		}
        		
    		}
    		
    		$scope.moduleService.detail.driver.value[0].driverFirstName.meta.enable = 'true';
    		$scope.moduleService.detail.driver.value[0].driverLastName.meta.enable = 'true';
    		$scope.moduleService.detail.driver.value[0].driverGender.meta.enable = 'true';
    		$scope.moduleService.detail.driver.value[0].driverIDNo.meta.enable = 'true';
    		$scope.moduleService.detail.driver.value[0].driverDateofBirth.meta.enable = 'true';
    	}
    }
    $scope.resetState = function(addressAccording){
    	return addressAccording.state.value = '';
    }
    $scope.moduleService.addressChosen = {};
    $scope.populateAddress = function(detail) {
    	if(typeof $scope.moduleService.addressChosen !== 'object') {
    		var objAddr = JSON.parse($scope.moduleService.addressChosen);
    		detail.typeCode.value = objAddr.typeCode;
	    	detail.houseNumber.value = objAddr.houseNumber;
	    	detail.street.value = objAddr.street;
	    	detail.unitNo.value = objAddr.unitNo;
	    	detail.buildingName.value = objAddr.buildingName;
	    	detail.cityCode.value = objAddr.cityCode;
	    	detail.countryCode.value = objAddr.countryCode;
	    	detail.postalCode.value = objAddr.postalCode;
	    	detail.line1.value = objAddr.line1;
	    	detail.line2.value = objAddr.line2;
	    	detail.district.value = objAddr.district;
	    	detail.state.value = objAddr.state;
    	}
    };
    
    $scope.clearAddress = function(detail) {
    	$scope.moduleService.addressChosen = '';
    	detail.addressType.value = null;
    	detail.typeCode.value = null;
    	detail.houseNumber.value = null;
    	detail.street.value = null;
    	detail.unitNo.value = null;
    	detail.buildingName.value = null;
    	detail.cityCode.value = null;
    	detail.countryCode.value = null;
    	detail.postalCode.value = null;
    	detail.line1.value = null;
    	detail.line2.value = null;
    	detail.district.value = null;
    	detail.state.value = null;
    }
    $scope.syncDataToProspect = function(){
    	if($scope.moduleService.detail.driver.value[0].driverIsPolicyHolder.value == 'true'){
    		$scope.moduleService.detail.policyOwnerDetails.proporserInformation.person.basic.name.first.value = $scope.moduleService.detail.driver.value[0].driverFirstName.value;
    		$scope.moduleService.detail.policyOwnerDetails.proporserInformation.person.basic.name.last.value = $scope.moduleService.detail.driver.value[0].driverLastName.value;
    		$scope.moduleService.detail.policyOwnerDetails.proporserInformation.person.basic.genderCode.value = $scope.moduleService.detail.driver.value[0].driverGender.value ;
    		$scope.moduleService.detail.policyOwnerDetails.proporserInformation.person.basic.birthDate.value = $scope.moduleService.detail.driver.value[0].driverDateofBirth.value;
    		$scope.moduleService.detail.policyOwnerDetails.proporserInformation.person.basic.idNumber.value = $scope.moduleService.detail.driver.value[0].driverIDNo.value;
    	}
    	
    }
    $scope.syncDataToNamedDriver = function(){
    	if(commonService.hasValueNotEmpty($scope.moduleService.detail.driver.value[0]) && $scope.moduleService.detail.driver.value[0].driverIsPolicyHolder.value == 'true'){
    		$scope.moduleService.detail.driver.value[0].driverFirstName.value = $scope.moduleService.detail.policyOwnerDetails.proporserInformation.person.basic.name.first.value;
        	$scope.moduleService.detail.driver.value[0].driverLastName.value = $scope.moduleService.detail.policyOwnerDetails.proporserInformation.person.basic.name.last.value;
        	$scope.moduleService.detail.driver.value[0].driverGender.value = $scope.moduleService.detail.policyOwnerDetails.proporserInformation.person.basic.genderCode.value;
        	$scope.moduleService.detail.driver.value[0].driverDateofBirth.value = $scope.moduleService.detail.policyOwnerDetails.proporserInformation.person.basic.birthDate.value;
        	$scope.moduleService.detail.driver.value[0].driverIDNo.value = $scope.moduleService.detail.policyOwnerDetails.proporserInformation.person.basic.idNumber.value;
    	}
    }
   
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
					if(item.docName == $scope.moduleService.detail.documentRelation.refProposer.refDocName.value) {
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
	}
    
    $scope.checkPdfExist = function (typePdf) {
		var result = false;
		var test = $scope;
		var attachments = this.salecaseCoreService.detail.attachments.value;
		for (var i = 0; i < attachments.length; i++) {
			if(attachments[i].attachment.refId.value == undefined) {
				continue;
			} else if (attachments[i].attachment.refBusinessType.value == typePdf) {
				result = true;
				break;
			}
		}
		return result;
	}
    
    
    $scope.replaceTheNameOfBodyAndMakeModel = function(application,productName) {
    	if(productName == 'mt1'){
    		var typeOfBody = application.bodyType;
    	}
    	else{
    		var typeOfBody = application.body;
    	}
    	var makeModel = application.makeModel;
    	var body = $filter('filter')($scope.moduleService.lazyChoiceList.TypeOfBody, {key: typeOfBody});
    	var mModel = $filter('filter')($scope.moduleService.lazyChoiceList.MakeAndModel, {key: makeModel});
    	if(productName == 'mt1'){
    		application.bodyType = body[0].group[0];
    	}
    	else{
    		application.body = body[0].group[0];
    	}
    	application.makeModel = mModel[0].group[0];
    	return;
    }
    $scope.displayFullAddress = function(policyOwnerType){
    	if (policyOwnerType === 'INDIVIDUAL'){
    		var prospect = $scope.moduleService.detail.policyOwnerDetails.proporserInformation.person.addresses.value[0];
    	} else {
    		var prospect = $scope.moduleService.detail.policyOwnerDetails.corporateInformation.addresses.value[0];
    	}
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
			var countryName = $filter('filter')($scope.moduleService.lazyChoiceList.ApplicationCountry, {key: country});
		}
		else
			var countryName = '';
		countryName = commonService.hasValueNotEmpty(countryName)?countryName[0].group[0]+' ':'';
		var fullAddress = street + line1 + line2 + stateName + districtName + countryName;
		
    	if (policyOwnerType === 'INDIVIDUAL'){
    		$scope.moduleService.detail.policyOwnerDetails.proporserInformation.person.addresses.value[0].fullAddress.value = fullAddress;
    	} else {
    		$scope.moduleService.detail.policyOwnerDetails.corporateInformation.addresses.value[0].fullAddress.value = fullAddress;
    	}
		
	}
    $scope.getAddressList = function() {
    	$scope.addressList = [];
    	var addresses = undefined;
    	if($scope.moduleService.detail.documentRelation.policyOwnerType.value == "INDIVIDUAL") {
    		addresses = $scope.moduleService.findElementInDetail(['policyOwnerDetails', 'proporserInformation', 'person', 'addresses']).value;
    	}
    	if($scope.moduleService.detail.documentRelation.policyOwnerType.value == "CORPORATE") {
    		addresses = $scope.moduleService.findElementInDetail(['policyOwnerDetails', 'corporateInformation', 'addresses']).value;
    	}
    	for(var i=0, n=addresses.length; i<n; i++) {
    		if($scope.moduleService.detail.documentRelation.policyOwnerType.value == "INDIVIDUAL" && addresses[i].addressType.value == "NON-PRIMARY") {
    			//var houseNumber = addresses[i].houseNumber.value;
    			//var valueAddr = houseNumber + " - " + street;
    			var street = addresses[i].street.value;
    			$scope.addressList.push({
					"fullAddress": street,
					"typeCode": addresses[i].typeCode.value,
					"street": street,
					"unitNo": addresses[i].unitNo.value,
					"buildingName": addresses[i].buildingName.value,
					"cityCode": addresses[i].cityCode.value,
					"countryCode": addresses[i].countryCode.value,
					"postalCode": addresses[i].postalCode.value,
					"line1": addresses[i].line1.value,
					"line2": addresses[i].line2.value,
					"district": addresses[i].district.value,
					"state": addresses[i].state.value
				});
    		}
    		if($scope.moduleService.detail.documentRelation.policyOwnerType.value == "CORPORATE" && addresses[i].addressType.value != "Busines") {
    			var street = addresses[i].street.value;
    			$scope.addressList.push({
					"fullAddress": street,
					"typeCode": addresses[i].typeCode.value,
					"street": street,
					"unitNo": addresses[i].unitNo.value,
					"buildingName": addresses[i].buildingName.value,
					"cityCode": addresses[i].cityCode.value,
					"countryCode": addresses[i].countryCode.value,
					"postalCode": addresses[i].postalCode.value,
					"line1": addresses[i].line1.value,
					"line2": addresses[i].line2.value,
					"district": addresses[i].district.value,
					"state": addresses[i].state.value
				});
    		}
    	}
    };
	$scope.print = (function () {
		var productName = $scope.moduleService.detail.metaData.productName.value;
        var templateName = commonService.CONSTANTS.DMS_TYPE[productName.toUpperCase()].APPLICATION;
		var data = {
			quotation: $scope.moduleService.extractDataModel($scope.moduleService.acceptedQuotation),
			application: $scope.moduleService.extractDataModel(applicationCoreService.detail)
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
			getData().then(function (payload) {
				payload.application = $scope.moduleService.extractDataModel(applicationCoreService.detail);
				if(productName == 'mt2' || productName == 'mt1'){
					//$scope.replaceTheNameOfBodyAndMakeModel(payload.application,productName);
					//$scope.getFullAddress(payload.application);
				}
				return $scope.resourceReaderService.generatePDF($scope.requestURL, payload, templateName);
			});
		}

		return print;
	}).call(this);
	
	 
    
}];
