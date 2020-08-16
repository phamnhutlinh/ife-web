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
var ContactCorporateDetailCtrl = ['$scope', '$log', '$stateParams', '$mdToast','$injector', '$location', '$filter', 'commonService', 'commonUIService', 'salecaseCoreService', 'AclService','contactCoreService','$rootScope',
	function($scope, $log, $stateParams, $mdToast, $injector, $location, $filter, commonService, commonUIService, salecaseCoreService, AclService,contactCoreService,$rootScope) {

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
		$scope.ctrlName = genCtrlName('detail', commonService.CONSTANTS.MODULE_NAME.CORPORATE, undefined, "corporate");		
		contactCoreService.businessLine = "corporate";
		$scope.moduleService = contactCoreService;
		$scope.salecaseCoreService = salecaseCoreService;
		$scope.salecaseCoreService.isCoporateContact = 'true';
		$scope.moduleService.freeze = false;
		$scope.moduleService.lazyChoiceList = undefined;
		$scope.lazyChoiceListName = "AddressType,State,District,CorporateCountry,Boolean,Country,CorporateIndustry,CorporateCategory,SmokerStatus,YesNo";
		//commonUIService.setupAclForDetail(AclService, [$stateParams.userRole]);
		$scope.setupStuffs().then(function(){
			$scope.setupActionBar($scope.moduleService.actionBar, undefined, $scope);
			$scope.$watch('[moduleService.detail.corporateInformation.addresses.value[0]]', function() {		
				$scope.displayFullAddress($scope.moduleService.detail.corporateInformation.addresses.value[0]);
			}, true);
			$scope.displayFullAddress($scope.moduleService.detail.corporateInformation.addresses.value[0]);
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
		$scope.displayFullAddress($scope.moduleService.detail.corporateInformation.addresses.value[0]);
		$scope.saveDetail(true).then(function(data){
			if(data.documentError == null && $scope.salecaseCoreService.detail != null && $scope.moduleService.detail.version == 0) {
				var doctype = $scope.moduleService.findElementInElement(data, ['docType']).value;
				var contactModel = $scope.moduleService.detail;
				var businessType = $scope.moduleService.findElementInElement(data, ['businessType']).value;
					var docName = contactModel.metaData.docName.value;
					self.moduleService.cloneByDocName(undefined, doctype, businessType , undefined, docName)
					.then(function(data) {
						if(commonService.hasValueNotEmpty(data)){
							//$scope.moduleService.findElementInElement(data, ['personInformation']).parentModule = commonService.CONSTANTS.MODULE_NAME.SALECASE;
							$scope.salecaseCoreService.findElementInDetail(['prospects']).value[0].refId.value = data.id;
							$scope.salecaseCoreService.findElementInDetail(['prospects']).value[0].refDocName.value = data.metaData.docName;
							$scope.salecaseCoreService.findElementInDetail(['prospects']).value[0].refVersion.value = data.version;
							$scope.salecaseCoreService.findElementInDetail(['prospects']).value[0].refBusinessType.value = data.metaData.businessType;
							$scope.salecaseCoreService.findElementInDetail(['prospects']).value[0].status.value = commonService.CONSTANTS.DOCUMENT_STATUS.VALID;							
							$scope.moduleService.convertDataModel2UiModel(data, $scope.moduleService.detail);							
							$scope.moduleService.detail = angular.copy(data);
							$scope.moduleService.originalDetail = angular.copy(data);
							$scope.reSetupConcreteUiStructure(
									$scope.moduleService.detail,
									commonService.CONSTANTS.UI_STRUCTURE.NOT_REMOVE_TEMPLATE_CHILDREN,
									commonService.CONSTANTS.UI_STRUCTURE.EXPECTED_DETAIL_NOT_CHANGED
								);
							$scope.salecaseCoreService.updateDocument(undefined, $scope.salecaseCoreService.detail.metaData.docType.value, $scope.salecaseCoreService.detail.id,
									$scope.salecaseCoreService.detail, $scope.salecaseCoreService.detail.metaData.businessType.value, $scope.salecaseCoreService.detail.metaData.productName.value);

						}
				});
			}
			if((data.documentError != null && moduleName == "case") || $scope.moduleService.detail.metaData.documentStatus.value == "INVALID") {
				$scope.goToPreviousTab();
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
		var fullAddress = street + line1 + line2 + stateName + districtName +  countryName;
		$scope.moduleService.detail.corporateInformation.addresses.value[0].fullAddress.value = fullAddress;
	}
	
	$scope.resetState = function(addressAccording){
    	return addressAccording.state.value = '';
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
	
	
    //look up Singapore postal code
    $scope.clearResidentialAddress = function(addressTypeCode,information, parentNode){
    	var self = this;
    	if(information == 'personInformation'){
    		self.moduleService.findElementInDetail([information, parentNode, 'houseNumber']).value = "";
            self.moduleService.findElementInDetail([information, parentNode, 'street']).value = "";
            //self.moduleService.findElementInDetail([information, parentNode, 'unitNo']).value = "";
            self.moduleService.findElementInDetail([information, parentNode, 'buildingName']).value = "";
            self.moduleService.findElementInDetail([information, parentNode, 'cityCode']).value = "";
    	}else if('corporateInformation'){
    		for( var i = 0; i < self.moduleService.findElementInDetail([information, parentNode]).length; i++) {
				if(self.moduleService.findElementInDetail([information, parentNode])[i].typeCode.value == addressTypeCode){
				self.moduleService.findElementInDetail([information, parentNode])[i].houseNumber.value = "";
				self.moduleService.findElementInDetail([information, parentNode])[i].street.value = "";
				//self.moduleService.findElementInDetail([information, parentNode,'unitNo']).value = "";
				self.moduleService.findElementInDetail([information, parentNode])[i].buildingName.value = "";
				self.moduleService.findElementInDetail([information, parentNode])[i].cityCode.value = "";
				break;
				}
			}
	    }
    }
	
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
	    	
	    	parentDetail = $scope.moduleService.findElementInDetail(['corporateInformation', parentNode]);
        	information = 'corporateInformation';
        	$scope.clearResidentialAddress(addressTypeCode,information, parentNode);
        	if(commonService.hasValueNotEmpty(self.moduleService.findElementInElement(parentDetail, ['postalCode']).meta.errorCode)){
        		self.moduleService.findElementInElement(parentDetail, ['postalCode']).meta.errorCode = "";
        	}
        	for( var i = 0; i < self.moduleService.findElementInDetail([information, parentNode]).value.length; i++) {
				if(self.moduleService.findElementInDetail([information, parentNode]).value[i].typeCode.value == addressTypeCode){
					country = self.moduleService.findElementInDetail([information, parentNode]).value[i].countryCode.value;
		    		if (!commonService.hasValueNotEmpty(country) || (country != "SGP" && country != "732" && country != "Singapore"&& country!="USA")){
		    			self.moduleService.findElementInDetail([information, parentNode]).value[i].postalCode.meta.errorCode = "MSG-C15";
		    			return;
		    		}
		    		postalCode = self.moduleService.findElementInDetail([information, parentNode]).value[i].postalCode.value;
		    		if(isNaN(postalCode) || postalCode=="" || postalCode == undefined){
		    			self.moduleService.findElementInDetail([information, parentNode]).value[i].postalCode.meta.errorCode = "MSG-C17";
		    			return;
		    		}
				}
	    	}
			
			if(postalCode != undefined){
				this.moduleService.callOneMapAPI(postalCode, country).then(function(data){
					var dataResult = data;
					if (dataResult.found < 1||dataResult =="") {
						if(information == 'personInformation'){
							self.moduleService.findElementInDetail([information, parentNode, 'houseNumber']).value = "";
                            self.moduleService.findElementInDetail([information, parentNode, 'street']).value = "";
                            self.moduleService.findElementInDetail([information, parentNode, 'unitNo']).value = "";
                            self.moduleService.findElementInDetail([information, parentNode, 'buildingName']).value = "";
                            self.moduleService.findElementInDetail([information, parentNode, 'cityCode']).value = "";
                            
				        }else if(information == 'corporateInformation'){
				        	for( var i = 0; i < self.moduleService.findElementInDetail([information, parentNode]).value.length; i++) {
	   							if(self.moduleService.findElementInDetail([information, parentNode]).value[i].typeCode.value == addressTypeCode){
									self.moduleService.findElementInDetail([information, parentNode]).value[i].houseNumber.value = "";
									self.moduleService.findElementInDetail([information, parentNode]).value[i].street.value = "";
									self.moduleService.findElementInDetail([information, parentNode,'unitNo']).value = "";
									self.moduleService.findElementInDetail([information, parentNode]).value[i].buildingName.value = "";
									self.moduleService.findElementInDetail([information, parentNode]).value[i].cityCode.value = "";
									self.moduleService.findElementInDetail([information, parentNode]).value[i].postalCode.meta.errorCode = "MSG-C16";
									break;
	   							}
	   					    }
				        }
						self.moduleService.findElementInElement(parentDetail, ['postalCode']).vaule[i].meta.errorCode = "MSG-C16";
						return;
					}
					if(dataResult.results.length > 0){
						if(information == 'personInformation'){
                    		self.moduleService.findElementInDetail([information, parentNode,'houseNumber']).value = self.moduleService.findElementInElement(dataResult.results[0],['BLK_NO']);
							self.moduleService.findElementInDetail([information, parentNode,'street']).value = self.moduleService.findElementInElement(dataResult.results[0],['ROAD_NAME']);
							self.moduleService.findElementInDetail([information, parentNode,'unitNo']).value = "";
							self.moduleService.findElementInDetail([information, parentNode,'buildingName']).value = self.moduleService.findElementInElement(dataResult.results[0],['BUILDING']);
							if(country=="SGP"){
								self.moduleService.findElementInDetail([information, parentNode,'cityCode']).value = "Singapore";
							} else{
								self.moduleService.findElementInDetail([information, parentNode,'cityCode']).value = "";
							}
							
							self.moduleService.findElementInDetail([information, parentNode,'countryCode']).value = country;
							self.moduleService.findElementInDetail([information, parentNode,'unitNo']).value = "";
							self.moduleService.findElementInDetail([information, parentNode,'houseNumber']).meta.errorCode = null;
							self.moduleService.findElementInDetail([information, parentNode,'street']).meta.errorCode = null;
							self.moduleService.findElementInDetail([information, parentNode,'countryCode']).meta.errorCode = null;
				        }else if(information == 'corporateInformation'){
				        	for( var i = 0; i < self.moduleService.findElementInDetail([information, parentNode]).value.length; i++) {
   	   							if(self.moduleService.findElementInDetail([information, parentNode]).value[i].typeCode.value == addressTypeCode){
	   	   							self.moduleService.findElementInDetail([information, parentNode]).value[i].houseNumber.value = self.moduleService.findElementInElement(dataResult.results[0],['BLK_NO']);
	   								self.moduleService.findElementInDetail([information, parentNode]).value[i].street.value = self.moduleService.findElementInElement(dataResult.results[0],['ROAD_NAME']);
	   								self.moduleService.findElementInDetail([information, parentNode,'unitNo']).value = "";
	   								self.moduleService.findElementInDetail([information, parentNode]).value[i].buildingName.value = self.moduleService.findElementInElement(dataResult.results[0],['BUILDING']).substr(0,30);
	   								
	   								if(country=="SGP"){
	   									self.moduleService.findElementInDetail([information, parentNode]).value[i].cityCode.value = "Singapore";
	   								} else{
	   									self.moduleService.findElementInDetail([information, parentNode]).value[i].cityCode.value = "";
	   								}
	   								self.moduleService.findElementInDetail([information, parentNode]).value[i].postalCode.meta.errorCode = null;
	   								break;
   	   							}
	   					    }
				        }
					}
				});		
			}
			return deferred.promise;
	    };
}];