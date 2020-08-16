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
var ApplicationLifeDetailCtrl = ['$scope', '$log', '$stateParams', '$injector', '$location', '$mdDialog', 'commonService', 'commonUIService', 'accountCoreService', 'applicationCoreService', 'salecaseCoreService', 'contactCoreService', '$filter','$rootScope',
	function($scope, $log, $stateParams, $injector, $location, $mdDialog, commonService, commonUIService, accountCoreService, applicationCoreService, salecaseCoreService, contactCoreService, $filter, $rootScope) {

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
		$scope.ctrlName = genCtrlName('detail', commonService.CONSTANTS.MODULE_NAME.APPLICATION, undefined, commonService.CONSTANTS.PRODUCT_LOB.LIFE);
		applicationCoreService.freeze = false;
		$scope.moduleService = applicationCoreService;
		$scope.salecaseCoreService = salecaseCoreService;
		$scope.lazyChoiceListName = "YesNo,PerDayWeek,PremiumFrequency,USTaxQuestions,AddressType,Industry,Gender,SmokerStatus,IDType,Title,MaritalStatus,Occupation,Country,RaceInformation,Education,EmploymentStatus,SourceOfFund,PolicyDelivery,Religion,MethodPayingPremium,RelationshipProposer";
		$scope.setupStuffs().then(function(){
			$scope.setupActionBar($scope.moduleService.actionBar, undefined, $scope);
		});
        $scope.isSignRequired = false;
	};	
	
	$scope.setupInitialData = function() {
		$scope.findCurrentBasePosInsuredFamilyInformation();
		$scope.findCurrentBasePosInsuredFamilyInformationOfLifeAssured();
		
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
	
	$scope.clearSelectBenefit = function() {
		angular.forEach($scope.moduleService.findElementInDetail(['beneficiaryItems','value']), function(item, index){
			item.beneficiaryDetailsContactFullName.value = null;
		});
	}
	
	$scope.checkShare100Benefit = function() {
		$scope.totalShareBenefit = 0;
		angular.forEach($scope.moduleService.findElementInDetail(['beneficiaryItems','value']), function(item, index){
			$scope.totalShareBenefit = $scope.totalShareBenefit + Number(item.beneficiaryDetailsShare.value);
		});
		if($scope.totalShareBenefit >= 100)
			return true;
		return false;
	}
	
	$scope.saveApplication = function() {
		$scope.moduleService.findElementInDetail(['beneficiarySelectedBenShare']).value = $scope.catString();
		$scope.clearSelectBenefit();
		$scope.validateQuotation().then(function(data){
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
	
	//upadte for benifi VPMS
	$scope.catString = function(data){
		var test = $scope.moduleService.findElementInDetail(['beneficiaryItems']).value;
		//var test = data;
		var arr = [];
		var tempValue="";
		angular.forEach(test,function(item){
		
			tempValue=item.beneficiaryDetailsShare.value;
		if(tempValue==""){tempValue="0";}
		
				
			arr.push(tempValue);
		})
		return '(' + arr.join('!') + ')';
	}
	
	
	//look up Singapore postal code
    $scope.clearResidentialAddress = function(addressTypeCode,information, parentNode){    	
    	parentNode.houseNumber.value = "";
    	parentNode.street.value = "";
    	parentNode.buildingName.value = "";
    	parentNode.cityCode.value = "";    	
    };
	
    $scope.addNewItem = function(list, sampleItem){
    	if(sampleItem != undefined)
    		list.push(angular.copy(sampleItem));
    	else list.push($scope.clearData(angular.copy(list[0])));
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
    		
//    		if(object.qkey.value == "POGeneralQ3"){
    		if(object.qkey.value == "LQ1"){
    			
    			$scope.changePropertyValue([object.generalQ3Amount, object.generalQ3BeverageType, object.generalQ3Howlong], "value", "");
    			$scope.changePropertyValue([object.generalQ3Amount.meta, object.generalQ3BeverageType.meta, object.generalQ3Howlong.meta], "errorCode", "");
    			$scope.changePropertyValue([object.generalQ3Amount.meta, object.generalQ3BeverageType.meta, object.generalQ3Howlong.meta], "mandatory", "false")
    			
    			
//    		}else if(object.qkey.value == "POGeneralQ5"){
    		}else if(object.qkey.value == "LQ2"){
    			$scope.changePropertyValue([object.generalQ5CigaretesDay, object.generalQ5Explain, object.generalQ5Since], "value", "");
    			$scope.changePropertyValue([object.generalQ5CigaretesDay.meta, object.generalQ5Explain.meta, object.generalQ5Since.meta], "errorCode", "");
    			$scope.changePropertyValue([object.generalQ5CigaretesDay.meta, object.generalQ5Explain.meta, object.generalQ5Since.meta], "mandatory", "false")
    			
    			
    		}else{
    			// detail is text-area
    			if( detail.value == null || (detail.value != null && typeof detail.value == 'string')){
    				detail.value = "";
    				detail.meta.errorCode = "";
//    				if(object.qkey.value == "POGeneralQ2")
    				if(object.qkey.value == "BQ3")
    					
    					detail.meta.mandatory = "true";
    				else
    					detail.meta.mandatory = "false";
    			}else{
    				// detail is table
//    				angular.forEach(detail.arrayDefault, function(value, key) {
//	      		    console.log(key + ': ' + value);
//	    			$scope.changePropertyValue(value.meta, "mandatory", "false");
//	      		})
    				detail.value.length = 0;
    				
    			}
    		}
    	}else{
    		
//    		if(object.qkey.value == "POGeneralQ3"){
    		if(object.qkey.value == "LQ1"){
    			$scope.changePropertyValue([object.generalQ3Amount.meta, object.generalQ3BeverageType.meta, object.generalQ3Howlong.meta], "mandatory", "true")
//    		}else if(object.qkey.value == "POGeneralQ5"){
    		}else if(object.qkey.value == "LQ2"){
    			
    			$scope.changePropertyValue([object.generalQ5CigaretesDay.meta, object.generalQ5Explain.meta, object.generalQ5Since.meta], "mandatory", "true")
    		}else{
    			// detail is text-area
    			if( detail.value == null || (detail.value != null && typeof detail.value == 'string')){
//    				if(object.qkey.value == "POGeneralQ2")
    				if(object.qkey.value == "BQ3")
    					detail.meta.mandatory = "false";
    				else
    					detail.meta.mandatory = "true";
    			}else{
    				// detail is table
//    				angular.forEach(detail.arrayDefault, function(value, key) {
//    	      		    console.log(key + ': ' + value);
//    	    			$scope.changePropertyValue(value.meta, "mandatory", "true");
//    	      		})
    	      		detail.value.length = 0;
    				detail.value.push(angular.copy(detail.arrayDefault));
    			}
    		}
    		
    	}
    }
    
    $scope.clearDetail2 = function(detail, object){
    	if(object.questionValue.value == 'N'){
    		
//    		if(object.qkey.value == "LAGeneralQ3"){
    		if(object.qkey.value == "LQ1"){
    			
    			$scope.changePropertyValue([object.generalQ3Amount, object.generalQ3BeverageType, object.generalQ3Howlong], "value", "");
    			$scope.changePropertyValue([object.generalQ3Amount.meta, object.generalQ3BeverageType.meta, object.generalQ3Howlong.meta], "errorCode", "");
    			$scope.changePropertyValue([object.generalQ3Amount.meta, object.generalQ3BeverageType.meta, object.generalQ3Howlong.meta], "mandatory", "false")
    			
    			
//    		}else if(object.qkey.value == "LAGeneralQ5"){
    		}else if(object.qkey.value == "LQ2"){
    			
    			$scope.changePropertyValue([object.generalQ5CigaretesDay, object.generalQ5Explain, object.generalQ5Since], "value", "");
    			$scope.changePropertyValue([object.generalQ5CigaretesDay.meta, object.generalQ5Explain.meta, object.generalQ5Since.meta], "errorCode", "");
    			$scope.changePropertyValue([object.generalQ5CigaretesDay.meta, object.generalQ5Explain.meta, object.generalQ5Since.meta], "mandatory", "false")
    			
    			
    		}else{
    			if( detail.value == null || (detail.value != null && typeof detail.value == 'string')){
    				detail.value = "";
    				detail.meta.errorCode = "";
//    				if(object.qkey.value == "LAGeneralQ2")
    				if(object.qkey.value == "BQ3")
    					
    					detail.meta.mandatory = "true";
    				else
    					detail.meta.mandatory = "false";
    			}else{
    				detail.value.length = 0;
    				
    			}
    		}
    	}else{
    		
//    		if(object.qkey.value == "LAGeneralQ3"){
    		if(object.qkey.value == "LQ1"){
    			$scope.changePropertyValue([object.generalQ3Amount.meta, object.generalQ3BeverageType.meta, object.generalQ3Howlong.meta], "mandatory", "true")
//    		}else if(object.qkey.value == "LAGeneralQ5"){
    		}else if(object.qkey.value == "LQ2"){
    			$scope.changePropertyValue([object.generalQ5CigaretesDay.meta, object.generalQ5Explain.meta, object.generalQ5Since.meta], "mandatory", "true")
    		}else{
    			if( detail.value == null || (detail.value != null && typeof detail.value == 'string')){
//    				if(object.qkey.value == "LAGeneralQ2")
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
    
    $scope.clearData = function(obj ){
    	obj.value = "";
    }
    
    $scope.changePropertyValue = function(element, propertyName, propertyValue){
    	if( Array.isArray(element)){
    		angular.forEach(element, function(value, key) {
//      		    console.log(key + ': ' + value);
    			$scope.changePropertyValue(value, propertyName, propertyValue)
      		})
    	}else{
    		element[propertyName] = propertyValue;
    	}
    	
    	
    	
    	
    }
    
	/**
	 * Search by postalCode
	 */
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

    $scope.addressList = [];
    $scope.getAddressList = function() {
    	$scope.addressList = [];
    	var addresses = $scope.moduleService.findElementInDetail(['policyOwnerDetails', 'proporserInformation', 'person', 'addresses']).value;
    	
    	for(var i=0, n=addresses.length; i<n; i++) {
    		if(addresses[i].addressType.value == "NON-PRIMARY") {
    			var houseNumber = addresses[i].houseNumber.value;
    			var street = addresses[i].street.value;
    			var valueAddr = houseNumber + " - " + street;
    			$scope.addressList.push({
					"fullAddress": valueAddr,
					"typeCode": addresses[i].typeCode.value,
					"houseNumber": houseNumber,
					"street": street,
					"unitNo": addresses[i].unitNo.value,
					"buildingName": addresses[i].buildingName.value,
					"cityCode": addresses[i].cityCode.value,
					"countryCode": addresses[i].countryCode.value,
					"postalCode": addresses[i].postalCode.value
				});
    		}
    	}
    };    
    
    $scope.changeValueOfSelectedAddress = function(detail) {
    	if(typeof $scope.moduleService.addressChosen !== 'object') {
    		var objAddr = JSON.parse($scope.moduleService.addressChosen);
    		detail.addressType.value = objAddr.fullAddress;
    	}
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
    	}
    };
    
    $scope.clearAddress = function(detail) {
    	$scope.moduleService.addressChosen = {};
    	detail.addressType.value = null;
    	detail.typeCode.value = null;
    	detail.houseNumber.value = null;
    	detail.street.value = null;
    	detail.unitNo.value = null;
    	detail.buildingName.value = null;
    	detail.cityCode.value = null;
    	detail.countryCode.value = null;
    	detail.postalCode.value = null;
    }
    
    $scope.findCurrentBasePosInsuredFamilyInformation = function() {
    	$scope.indexInsuredFamilyInformationPO = [];
    	$scope.numPOInsuredFamilyBro = 0;
		$scope.numPOInsuredFamilySis = 0;
		$scope.numPOInsuredFamilyChi = 0;
    	angular.forEach($scope.moduleService.findElementInDetail(['policyOwnerDetails','insuredFamilyInformationItem']).value, function(item, index){
    		if(item.familyQKey.value == "Bro" && $scope.baseNumPOInsuredFamilyBro == undefined) {
    			$scope.baseNumPOInsuredFamilyBro = index;
    		}
    		if(item.familyQKey.value == "Sis" && $scope.baseNumPOInsuredFamilySis == undefined) {
    			$scope.baseNumPOInsuredFamilySis = index;
    		}
    		if(item.familyQKey.value == "Chi" && $scope.baseNumPOInsuredFamilyChi == undefined) {
    			$scope.baseNumPOInsuredFamilyChi = index;
    		}
    		if(item.familyQKey.value == "Bro") {
    			$scope.numPOInsuredFamilyBro++;
    		}
    		if(item.familyQKey.value == "Sis") {
    			$scope.numPOInsuredFamilySis++;
    		}
    		if(item.familyQKey.value == "Chi") {
    			$scope.numPOInsuredFamilyChi++;
    		}
    	});
    	$scope.indexInsuredFamilyInformationPO['Bro'] = $scope.baseNumPOInsuredFamilyBro + $scope.numPOInsuredFamilyBro - 1;
    	$scope.indexInsuredFamilyInformationPO['Sis'] = $scope.baseNumPOInsuredFamilySis + $scope.numPOInsuredFamilySis - 1 ;
    	$scope.indexInsuredFamilyInformationPO['Chi'] = $scope.baseNumPOInsuredFamilyChi + $scope.numPOInsuredFamilyChi - 1;
    }  
    
    $scope.checkPOAddInsuredFamily = function(index, key) {
    	if(key == "Bro" && index == $scope.baseNumPOInsuredFamilyBro) {
    		return true;
    	}
    	if(key == "Sis" && index == $scope.baseNumPOInsuredFamilySis) {
    		return true;
    	}
    	if(key == "Chi" && index == $scope.baseNumPOInsuredFamilyChi) {
    		return true;
    	}
    }
    
    $scope.checkPOSubInsuredFamily = function(index, key) {
    	if(key == "Bro" && index != $scope.baseNumPOInsuredFamilyBro) {
    		return true;
    	}
    	if(key == "Sis" && index != $scope.baseNumPOInsuredFamilySis) {
    		return true;
    	}
    	if(key == "Chi" && index != $scope.baseNumPOInsuredFamilyChi) {
    		return true;
    	}
    }
    
    $scope.addNewinsuredFamilyInformation = function(index, familyQKey) {	    
	    if($scope.indexInsuredFamilyInformationPO[familyQKey] == undefined) {
		    $scope.indexInsuredFamilyInformationPO[familyQKey] = index;
	    }
	    $scope.indexInsuredFamilyInformationPO[familyQKey]++;
	    $scope.moduleService.addChildEleToParentEleWithCounter($scope.moduleService.findElementInDetail(['policyOwnerDetails','insuredFamilyInformationItem']),'value', $scope.indexInsuredFamilyInformationPO[familyQKey]);
	    $scope.moduleService.findElementInDetail(['policyOwnerDetails','insuredFamilyInformationItem']).value[$scope.indexInsuredFamilyInformationPO[familyQKey]].familyQKey.value = familyQKey;
	    if(familyQKey == 'Bro') {
	    	if($scope.indexInsuredFamilyInformationPO['Sis'] != undefined && $scope.indexInsuredFamilyInformationPO['Sis'] != 0) {
	    		$scope.indexInsuredFamilyInformationPO['Sis']++;	    		
	    	}
	    	$scope.baseNumPOInsuredFamilySis++;
	    	if($scope.indexInsuredFamilyInformationPO['Chi'] != undefined && $scope.indexInsuredFamilyInformationPO['Chi'] != 0) {
	    		$scope.indexInsuredFamilyInformationPO['Chi']++;	    		
	    	}
	    	$scope.baseNumPOInsuredFamilyChi++;
	    }
	    if(familyQKey == 'Sis') {	    	
	    	if($scope.indexInsuredFamilyInformationPO['Chi'] != undefined && $scope.indexInsuredFamilyInformationPO['Chi'] != 0) {
	    		$scope.indexInsuredFamilyInformationPO['Chi']++;	    		
	    	}
	    	$scope.baseNumPOInsuredFamilyChi++;
	    }
	    //$scope.updateBasePosInsuredFamilyInformation(true);
    }
    
    $scope.$watch('[moduleService.detail.policyOwnerDetails.proporserInformation.person.basic.name.first.value, moduleService.detail.policyOwnerDetails.proporserInformation.person.basic.name.last.value]', function() {		
		$scope.moduleService.detail.policyOwnerDetails.proporserInformation.person.basic.name.full.value = $scope.moduleService.detail.policyOwnerDetails.proporserInformation.person.basic.name.first.value + " " + $scope.moduleService.detail.policyOwnerDetails.proporserInformation.person.basic.name.last.value;
	}, true);
	
    $scope.$watch('[moduleService.detail.lifeAssuredDetails.proporserInformation.person.basic.name.first.value, moduleService.detail.lifeAssuredDetails.proporserInformation.person.basic.name.last.value]', function() {		
		$scope.moduleService.detail.lifeAssuredDetails.proporserInformation.person.basic.name.full.value = $scope.moduleService.detail.lifeAssuredDetails.proporserInformation.person.basic.name.first.value + " " + $scope.moduleService.detail.lifeAssuredDetails.proporserInformation.person.basic.name.last.value;
	}, true);
    
    $scope.removeNewinsuredFamilyInformation = function(index, familyQKey) {	   
	    $scope.moduleService.removeChildEleToParentEleWithCounter(index, $scope.moduleService.findElementInDetail(['policyOwnerDetails','insuredFamilyInformationItem']),'value');
	    $scope.indexInsuredFamilyInformationPO[familyQKey]--;
	    if(familyQKey == 'Bro') {
	    	if($scope.indexInsuredFamilyInformationPO['Sis'] != undefined && $scope.indexInsuredFamilyInformationPO['Sis'] != 0) {
	    		$scope.indexInsuredFamilyInformationPO['Sis']--;	    		
	    	}
	    	$scope.baseNumPOInsuredFamilySis--;
	    	if($scope.indexInsuredFamilyInformationPO['Chi'] != undefined && $scope.indexInsuredFamilyInformationPO['Chi'] != 0) {
	    		$scope.indexInsuredFamilyInformationPO['Chi']--;	    		
	    	}
	    	$scope.baseNumPOInsuredFamilyChi--;
	    }
	    if(familyQKey == 'Sis') {	    	
	    	if($scope.indexInsuredFamilyInformationPO['Chi'] != undefined && $scope.indexInsuredFamilyInformationPO['Chi'] != 0) {
	    		$scope.indexInsuredFamilyInformationPO['Chi']--;	    		
	    	}
	    	$scope.baseNumPOInsuredFamilyChi--;
	    }
	    //$scope.updateBasePosInsuredFamilyInformation(false);
    }
    
    //Insured Family Information Of Life Assured
    $scope.findCurrentBasePosInsuredFamilyInformationOfLifeAssured = function() {
    	$scope.indexInsuredFamilyInformationLA = [];
    	$scope.numLAInsuredFamilyBro = 0;
		$scope.numLAInsuredFamilySis = 0;
		$scope.numLAInsuredFamilyChi = 0;
    	angular.forEach($scope.moduleService.findElementInDetail(['lifeAssuredDetails','insuredFamilyInformationItem']).value, function(item, index){
    		if(item.familyQKey.value == "Bro" && $scope.baseNumLAInsuredFamilyBro == undefined) {
    			$scope.baseNumLAInsuredFamilyBro = index;
    		}
    		if(item.familyQKey.value == "Sis" && $scope.baseNumLAInsuredFamilySis == undefined) {
    			$scope.baseNumLAInsuredFamilySis = index;
    		}
    		if(item.familyQKey.value == "Chi" && $scope.baseNumLAInsuredFamilyChi == undefined) {
    			$scope.baseNumLAInsuredFamilyChi = index;
    		}
    		if(item.familyQKey.value == "Bro") {
    			$scope.numLAInsuredFamilyBro++;
    		}
    		if(item.familyQKey.value == "Sis") {
    			$scope.numLAInsuredFamilySis++;
    		}
    		if(item.familyQKey.value == "Chi") {
    			$scope.numLAInsuredFamilyChi++;
    		}
    	});
    	$scope.indexInsuredFamilyInformationLA['Bro'] = $scope.baseNumLAInsuredFamilyBro + $scope.numLAInsuredFamilyBro - 1;
    	$scope.indexInsuredFamilyInformationLA['Sis'] = $scope.baseNumLAInsuredFamilySis + $scope.numLAInsuredFamilySis - 1 ;
    	$scope.indexInsuredFamilyInformationLA['Chi'] = $scope.baseNumLAInsuredFamilyChi + $scope.numLAInsuredFamilyChi - 1;
    }  
    
    $scope.checkLAAddInsuredFamily = function(index, key) {
    	if(key == "Bro" && index == $scope.baseNumLAInsuredFamilyBro) {
    		return true;
    	}
    	if(key == "Sis" && index == $scope.baseNumLAInsuredFamilySis) {
    		return true;
    	}
    	if(key == "Chi" && index == $scope.baseNumLAInsuredFamilyChi) {
    		return true;
    	}
    }
    
    $scope.checkLASubInsuredFamily = function(index, key) {
    	if(key == "Bro" && index != $scope.baseNumLAInsuredFamilyBro) {
    		return true;
    	}
    	if(key == "Sis" && index != $scope.baseNumLAInsuredFamilySis) {
    		return true;
    	}
    	if(key == "Chi" && index != $scope.baseNumLAInsuredFamilyChi) {
    		return true;
    	}
    }
    
    $scope.addNewinsuredFamilyInformationOfLifeAssured = function(index, familyQKey) {	    
	    if($scope.indexInsuredFamilyInformationLA[familyQKey] == undefined) {
		    $scope.indexInsuredFamilyInformationLA[familyQKey] = index;
	    }
	    $scope.indexInsuredFamilyInformationLA[familyQKey]++;
	    $scope.moduleService.addChildEleToParentEleWithCounter($scope.moduleService.findElementInDetail(['lifeAssuredDetails','insuredFamilyInformationItem']),'value', $scope.indexInsuredFamilyInformationLA[familyQKey]);
	    $scope.moduleService.findElementInDetail(['lifeAssuredDetails','insuredFamilyInformationItem']).value[$scope.indexInsuredFamilyInformationLA[familyQKey]].familyQKey.value = familyQKey;
	    if(familyQKey == 'Bro') {
	    	if($scope.indexInsuredFamilyInformationLA['Sis'] != undefined && $scope.indexInsuredFamilyInformationLA['Sis'] != 0) {
	    		$scope.indexInsuredFamilyInformationLA['Sis']++;	    		
	    	}
	    	$scope.baseNumLAInsuredFamilySis++;
	    	if($scope.indexInsuredFamilyInformationLA['Chi'] != undefined && $scope.indexInsuredFamilyInformationLA['Chi'] != 0) {
	    		$scope.indexInsuredFamilyInformationLA['Chi']++;	    		
	    	}
	    	$scope.baseNumLAInsuredFamilyChi++;
	    }
	    if(familyQKey == 'Sis') {	    	
	    	if($scope.indexInsuredFamilyInformationLA['Chi'] != undefined && $scope.indexInsuredFamilyInformationLA['Chi'] != 0) {
	    		$scope.indexInsuredFamilyInformationLA['Chi']++;	    		
	    	}
	    	$scope.baseNumLAInsuredFamilyChi++;
	    }
	    //$scope.updateBasePosInsuredFamilyInformation(true);
    }
    
    $scope.removeNewinsuredFamilyInformationOfLifeAssured = function(index, familyQKey) {	   
	    $scope.moduleService.removeChildEleToParentEleWithCounter(index, $scope.moduleService.findElementInDetail(['lifeAssuredDetails','insuredFamilyInformationItem']),'value');
	    $scope.indexInsuredFamilyInformationLA[familyQKey]--;
	    if(familyQKey == 'Bro') {
	    	if($scope.indexInsuredFamilyInformationLA['Sis'] != undefined && $scope.indexInsuredFamilyInformationLA['Sis'] != 0) {
	    		$scope.indexInsuredFamilyInformationLA['Sis']--;	    		
	    	}
	    	$scope.baseNumLAInsuredFamilySis--;
	    	if($scope.indexInsuredFamilyInformationLA['Chi'] != undefined && $scope.indexInsuredFamilyInformationLA['Chi'] != 0) {
	    		$scope.indexInsuredFamilyInformationLA['Chi']--;	    		
	    	}
	    	$scope.baseNumLAInsuredFamilyChi--;
	    }
	    if(familyQKey == 'Sis') {	    	
	    	if($scope.indexInsuredFamilyInformationLA['Chi'] != undefined && $scope.indexInsuredFamilyInformationLA['Chi'] != 0) {
	    		$scope.indexInsuredFamilyInformationLA['Chi']--;	    		
	    	}
	    	$scope.baseNumLAInsuredFamilyChi--;
	    }
    }
    
    $scope.populateContactToBenefit = function(item) {
		var self = this;
		self.moduleService.getDocumentWithouUpdateDetail(undefined, 'contact', item.beneficiaryDetailsContactFullName.value).then(function(data) {
			$scope.moduleService.findElementInElement(item, ['beneficiaryDetailsFirstName']).value = $scope.moduleService.findElementInElement(data, ['personInformation','name','first'])
			$scope.moduleService.findElementInElement(item, ['beneficiaryDetailsLastName']).value = $scope.moduleService.findElementInElement(data, ['personInformation','name','last'])
			$scope.moduleService.findElementInElement(item, ['beneficiaryDetailsGender']).value = $scope.moduleService.findElementInElement(data, ['personInformation','genderCode'])
			$scope.moduleService.findElementInElement(item, ['beneficiaryDetailsDateOfBirth']).value = $scope.moduleService.findElementInElement(data, ['personInformation','birthDate'])
			$scope.moduleService.findElementInElement(item, ['beneficiaryDetailsIdType']).value = $scope.moduleService.findElementInElement(data, ['personInformation','idList'])[0].code
			$scope.moduleService.findElementInElement(item, ['beneficiaryDetailsIdNumber']).value = $scope.moduleService.findElementInElement(data, ['personInformation','idList'])[0].value
		});
	}
    
    $scope.populateEmailToChannelPolicyDelivery = function(item){
    	$scope.moduleService.findElementInDetail(['channelAndPolicyDelivery','email']).meta.mandatory = 'false';
    	if(item.toUpperCase() == "Email".toUpperCase()){
    		$scope.moduleService.findElementInDetail(['channelAndPolicyDelivery','email']).meta.mandatory = 'true';
    		$scope.moduleService.findElementInDetail(['channelAndPolicyDelivery','email']).value = $scope.moduleService.findElementInDetail(['policyOwnerDetails','proporserInformation','person','contacts','email']).value;
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
    
    $scope.changeMandatory = function(fieldValue, fieldMandatory) {
    	if(commonService.hasValueNotEmpty(fieldValue) && commonService.hasValueNotEmpty(fieldMandatory)) {
    		if(fieldValue.value == 'Y')
    			fieldMandatory.meta.mandatory = "true";
    	}
    };
    
    $scope.addAddress = function(card) {
    	if($scope.moduleService.detail.metaData.businessStatus.value == commonService.CONSTANTS.BUSINESS_STATUS.ACCEPTED) {
    		return;
    	} else {
    		$scope.addCard(card);
    	}
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

    $scope.addBeneficiary = function(card){
    	$scope.moduleService.addChildEleToParentEleWithCounter($scope.moduleService.findElementInDetail(['beneficiaryItems']),'value');
    }
    
    $scope.removeBeneficiary = function(card, index) {
		$scope.moduleService.removeChildEleToParentEleWithCounter(index, $scope.moduleService.findElementInDetail(['beneficiaryItems']),'value');
	    $scope.reSetupConcreteUiStructure($scope.moduleService.detail, commonService.CONSTANTS.UI_STRUCTURE.NOT_REMOVE_TEMPLATE_CHILDREN, true); 
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
    
	$scope.print = (function () {
		var templateName = commonService.CONSTANTS.DMS_TYPE.APPLICATION;
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
				return $scope.resourceReaderService.generatePDF($scope.requestURL, payload, templateName);
			});
		}

		return print;
	}).call(this);
}];
