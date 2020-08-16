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
var AccountDetailCtrl = ['$scope', '$log', '$stateParams','$state', '$injector', '$location', 'commonService', 'commonUIService', 'accountCoreService', 'loadingBarService',
	function($scope, $log, $stateParams, $state, $injector, $location, commonService, commonUIService, accountCoreService, loadingBarService) {

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
		$scope.validCheck=false;
		$scope.ctrlName = genCtrlName('detail', commonService.CONSTANTS.MODULE_NAME.ACCOUNT);
		$scope.moduleService = accountCoreService;
		$scope.moduleService.name = commonService.CONSTANTS.MODULE_NAME.ACCOUNT;
		$scope.username = localStorage.getItem("username");
		$scope.$stateParams = $stateParams;
		$scope.submitChangePwdForm = {};
		$scope.newRole = {'value': undefined};	
		$scope.requestSentOTP = { otpTypeSend: 'email' };
		$scope.isShowOtpForm = false;
		$scope.submitOTP = {};
		$scope.typeOF=$scope.$stateParams.type;
		$scope.initAcl();
		commonService.currentState.set($scope.moduleService.name + '-detail');
		$scope.newInsurerProfile = {"insurerId":{"value":null,"meta":{}},"insurerName":{"value":null,"meta":{}},"dobPolicyHolder":{"value":null,"meta":{}},"nric":{"value":null,"meta":{}},"pasId":{"value":null,"meta":{}},"customerId":{"value":null,"meta":{}},"pasBranch":{"value":null,"meta":{}},"pasType":{"value":null,"meta":{}},"policyId":{"value":null,"meta":{}},"policyName":{"value":null,"meta":{}},"effectiveDate":{"value":null,"meta":{}},"role":{"value":null,"meta":{}},"underwritingLevel":{"value":null,"meta":{}},"sumInsured":{"value":null,"meta":{}},"otpType":{"value":null,"meta":{}},"otpValue":{"value":null,"meta":{}},"isAdmin":{"value":null,"meta":{}}};
		$scope.setupStuffs().then(function(){
			$scope.setupActionBar($scope.moduleService.actionBar, undefined, $scope);
			if(localStorage.getItem('actionBySA') == 'create'){
				$scope.moduleService.detail.email.value = '';
				$scope.moduleService.detail.fullName.value = '';
				$scope.moduleService.detail.userName.value = '';
			}
			$scope.$watch('[moduleService.detail.firstName.value, moduleService.detail.lastName.value]', function() {		
				$scope.moduleService.detail.fullName.value = (commonService.hasValueNotEmpty($scope.moduleService.detail.firstName.value)?$scope.moduleService.detail.firstName.value + " ":"") + (commonService.hasValueNotEmpty($scope.moduleService.detail.lastName.value)?$scope.moduleService.detail.lastName.value:"");
			}, true);
		});
		
	};
	
	$scope.setupInitialData = function() {
		var self = this;
		//prevent execute from children state
		if (self.ctrlName === genCtrlName('detail', commonService.CONSTANTS.MODULE_NAME.ACCOUNT)) {

			//init ref detail from parent
			if (!commonService.hasValueNotEmpty(self.moduleService.detail.addresses.value)) {
				self.moduleService.detail.addresses.value.push("");
			}
		}
	};
	$scope.valueForAgentType = function(){
		if($scope.newInsurerProfile.role.value === 'AG'){
			$scope.newInsurerProfile.pasType.value = 'GENERAL';
		}
	};
	$scope.getComputeLazy = function() {
		var self = this;
		var listDropdowns = "Title,Gender,Occupation,MaritalStatus,IDType,Country,YesNo,PasType,AgentType,VerificationCode,Product_Code,Underwritinglevel,BranchName,ProductCode,BCStatus";
		var deferred = self.moduleService.$q.defer();
		if (!commonService.hasValueNotEmpty(self.moduleService.lazyChoiceList)) {
			var promises = [];
			promises.push(self.moduleService.getOptionsList(self.requestURL, listDropdowns));
			promises.push(self.moduleService.getLdapOptionList(self.requestURL));
			self.moduleService.$q.all(promises).then(function(optionLists) {
				angular.forEach(optionLists, function(optionList) {
					angular.forEach(optionList, function(listValue, listKey) {
						self.moduleService.lazyChoiceList[listKey] = listValue;
					});
				});
				self.watchUserRolesChange();
				deferred.resolve();
			});
		} else
			deferred.resolve();
		return deferred.promise;
	};

	$scope.getDetail = function() {
		var self = this;
		var deferred = self.moduleService.$q.defer();
		var getDataModel = undefined;
		if(!$scope.isActionCreate()){
			if (commonService.hasValueNotEmpty($stateParams.docId)) //get other user by system admin
				getDataModel = self.moduleService.getDocument(self.requestURL, self.moduleService.name, $stateParams.docId);
			else { //get self user detail
				getDataModel = self.moduleService.getUserDetail();
			}
		}
		else {
			getDataModel = self.moduleService.initializeDocument(self.requestURL, self.moduleService.name);
		}
		var getUIModel = self.moduleService.getUIModel(self.moduleService.name);
		var promises = [];
		promises.push(getDataModel);
		promises.push(getUIModel);
		self.moduleService.$q.all(promises).then(function(responses) {
			if (responses && self.moduleService.isSuccess(responses[0])) {
				self.moduleService.detail = responses[0];
				self.moduleService.convertDataModel2UiModel(self.moduleService.detail, responses[1]);
				self.moduleService.operateDocument(
					self.requestURL,
					self.moduleService.name,
					commonService.CONSTANTS.ACTION.REFRESH
				).then(function(postOpData) {
					if (self.moduleService.isSuccess(postOpData)) {
						self.moduleService.originalDetail = angular.copy(postOpData);
						self.moduleService.detail = postOpData;
						//delete postOpData.userPassword;
						//delete self.moduleService.originalDetail.userPassword;
					}
					deferred.resolve(postOpData);
				});
			} else {
				deferred.reject();
			}
		});
		return deferred.promise;
	};

	$scope.saveDetail = function() {
		//loadingBarService.showLoadingBar();
		var self = this;
		var deferred = self.moduleService.$q.defer();
		var saveDetailPromise = undefined;
		// Action update by System admin
		if(!$scope.isActionCreate()){
			if (commonService.hasValueNotEmpty($stateParams.docId)) //save other user by system admin
				saveDetailPromise = self.moduleService.updateDocument(self.requestURL, self.moduleService.name, $stateParams.docId); //return data model
			else { //update self user detail
				saveDetailPromise = self.moduleService.updateUserDetail(self.username); //return data model
			}
			saveDetailPromise.then(function(data){
				
				if (self.moduleService.isSuccess(data)) {
					
						self.moduleService.convertDataModel2UiModel(data, self.moduleService.detail);
						self.moduleService.detail = angular.copy(data);
						self.moduleService.originalDetail = angular.copy(data);
						
						self.reSetupConcreteUiStructure(self.moduleService.detail,
								commonService.CONSTANTS.UI_STRUCTURE.REMOVE_TEMPLATE_CHILDREN,
								commonService.CONSTANTS.UI_STRUCTURE.EXPECTED_DETAIL_CHANGED);
						self.watchUserRolesChange();
						commonUIService.showNotifyMessage('v4.user.message.saveSuccessfully', 'success');
				} else {
					if(data.error != undefined) {
						if(commonService.hasValueNotEmpty(data.error)) {
							commonUIService.showNotifyMessage('v4.user.message.saveUnsuccessfully.'+ data.error);
						}else {
							commonUIService.showNotifyMessage('v4.user.message.saveUnsuccessfully');
						}	
					}
				}
				deferred.resolve(data);
				loadingBarService.hideLoadingBar();
			});
		}
		// Action create by System admin
		else {	
			// populate userName to email
			$scope.moduleService.detail.email.value = $scope.moduleService.detail.userName.value;
			//validate data account first
			if($scope.moduleService.detail.hasOwnProperty('documentError')){
				delete $scope.moduleService.detail.documentError;
				//delete $scope.moduleService.detail.userPassword;
			}
			$scope.validateDetail().then(function(data){
				if(commonService.hasValueNotEmpty(data.documentError)){
					commonUIService.showNotifyMessage('v4.user.message.saveUnsuccessfully.'+ data.documentError)
				}
				else{
					if($scope.moduleService.detail.hasOwnProperty('documentError') ){
						delete $scope.moduleService.detail.documentError;
						//delete $scope.moduleService.detail.userPassword;
					}
					self.moduleService.createAccountFrSA(self.requestURL, self.moduleService.name, self.moduleService.detail, true).then(function(dataAfterCreate){
						if(commonService.hasValueNotEmpty(dataAfterCreate) && !commonService.hasValueNotEmpty(dataAfterCreate.error)){
							commonUIService.showNotifyMessage('v4.user.message.createSuccessfully','success',20000)
							$scope.goToDocumentDetails('account', self.moduleService.detail.userName.value, '','', 'SA')
						}
						else if(commonService.hasValueNotEmpty(dataAfterCreate.error)){
							if(dataAfterCreate.error == 'Existing exception'){
								commonUIService.showNotifyMessage('v4.user.message.duplicateAccount','error',20000);
							}
						}
					});
				}
			})
		}
		
		return deferred.promise;
	};
	
	/************************************************************************************* */
	/******************************** End lifecycle methods ****************************** */
	/************************************************************************************* */

	$scope.clearErrorCode = function(){
		var self = this;
		var role = $scope.newInsurerProfile.role.value;
		self.moduleService.clearDataInJson($scope.newInsurerProfile);
		self.moduleService.clearErrorInElement($scope.newInsurerProfile);
		$scope.newInsurerProfile.role.value = role;
	}
	
	$scope.resetIsSentOTP = function(){
		$scope.isShowOtpForm = !$scope.isShowOtpForm;
	}
	
	/**
	 * validate insurer profile
	 */
	$scope.validateInsurerProfile = function (newInsurerProfile){
		var self = this;
		var deferred = self.moduleService.$q.defer();
		var uiModel = newInsurerProfile;
		$scope.moduleService.validateInsurerProfile(newInsurerProfile).then(function (metaModel) {
			self.moduleService.mergeMetaModel2UIModel(metaModel, uiModel);
			deferred.resolve(metaModel);
		})
		
		return deferred.promise;
	}
	
	/**
	 * send OTP 
	 */
	$scope.sendOTP = function() {
		var self = this;
		var deferred = self.moduleService.$q.defer();
		
		accountCoreService.requestResetPwd($scope.requestSentOTP).then(function(data) { //sendOTP via email (use function of reSet pass)
			if (!commonService.hasValueNotEmpty(data.error)) {
				deferred.resolve(data);
			} else {
				commonUIService.showNotifyMessage('v4.user.error.' + data.error, undefined, 20000);
				deferred.resolve(data);
			}
		});
		
		return deferred.promise;
	};
	
	/**
	 * Verify OTP
	 */
	$scope.verifyOTP = function() {
		var self = this;
		var deferred = self.moduleService.$q.defer();
		
		self.moduleService.verifyOTP($scope.submitOTP).then(function(data) {//success
			if (!commonService.hasValueNotEmpty(data.error)) {
				deferred.resolve(data);
			} else {
				commonUIService.showNotifyMessage('v4.user.error.' + data.error, undefined, 20000);
				deferred.resolve(data);
			}
		});
		
		return deferred.promise;
	};
	
	/**
	 * validate  + send OTP
	 */
	$scope.validateAndSendOTP = function(newInsurerProfile) {
		var self = this;
		
		self.validateInsurerProfile(newInsurerProfile).then(function (insurerProfile) {
			if (!commonService.hasValueNotEmpty(insurerProfile.documentError)){ //pass all validation 
				
				$scope.requestSentOTP.otpTypeSend = insurerProfile.otpType.value;
				$scope.requestSentOTP.username = insurerProfile.otpValue.value;
				self.sendOTP().then(function(data) { //sendOTP via email (use function of reSet pass)
					if (commonService.hasValueNotEmpty(data.error)) {
						$scope.isShowOtpForm =  false;
					} else {
						$scope.isShowOtpForm =  true;
					}
				});
			} else {
				$scope.isShowOtpForm =  false;
			}
		})
	}
	
	$scope.initAcl = function(){
		var self = this;
		commonUIService.setupAcl(self.aclService);						
	}	
	
	/**
	 * Self upgrade Role = verify OTP + call addNewrole function 
	 */
	$scope.selfUpgradeRole = function(){
		var self = this;
		var roleNeedToAdd = $scope.newInsurerProfile.role.value;
		self.verifyOTP().then(function (afterVerifyOTP) {
			
			if (!commonService.hasValueNotEmpty(afterVerifyOTP.error)) { //verify otp success
				self.addNewRole($scope.newInsurerProfile).then(function(data) {
					if(commonService.hasValueNotEmpty(data.error)){ //upgrade failed
						
						var roleArr = self.moduleService.detail.profile.roles.value;
						for (var i = 0; i< roleArr.length; i++) {
							if(roleArr[i].value === roleNeedToAdd){
								roleArr.splice(i, 1);
								break;
							}
						}
						
						//remove item at the end of array
						self.moduleService.detail.profile.insurerProfiles.value.splice(-0,1);
					} else { //upgrade successfull
							//reload permission
						accountCoreService.grantPermissions().then(function(data) {
							if (data !== undefined) {
								if (!commonService.hasValueNotEmpty(data.error)) {
									localStorage.setItem("roles", JSON.stringify(data.roles));
									commonUIService.setupAcl(self.aclService);
									commonUIService.setupAclForLanding(self.aclService);
								} 
							} else {
								commonUIService.showNotifyMessage('v4.user.error.empty_user_info', undefined, 20000);
								$log.error('Error getting user information!');
								window.open('logout', '_self');
							}
						});
					}
				})
				$scope.isShowOtpForm =  false;
			} else {
				$scope.isShowOtpForm =  true;
			}
			
		})
	}

	/**
	 * upgrade role by system admin = validate + call addNewrole function 
	 */
	$scope.adminUpgradeRole = function(newInsurerProfile){
		loadingBarService.showLoadingBar();
		var self = this;
		var roleNeedToAdd = newInsurerProfile.role.value;
		var idNeedToAdd = newInsurerProfile.pasId.value;
		//admin don't need otp
		newInsurerProfile.isAdmin.value = "Y";
		self.validateInsurerProfile(newInsurerProfile).then(function (insurerProfile) {
			if (!commonService.hasValueNotEmpty(insurerProfile.documentError)){ //pass all validation 
				self.addNewRole(insurerProfile).then(function (data) {
					if(commonService.hasValueNotEmpty(data.error)){ //upgrade failed
						
						var roleArr = self.moduleService.detail.profile.roles.value;
						var index = null;
						for (var i = 0; i< roleArr.length; i++) {
							if(roleArr[i].value === roleNeedToAdd){
								index = i;
								roleArr.splice(i, 1);								
								break;
							}
						}			
						
						//remove item at the end of array
						var insureProfileArr = self.moduleService.detail.profile.insurerProfiles.value;
						var index1 = null;
						for (var i = 0; i< insureProfileArr.length; i++) {
							if(insureProfileArr[i].role.value === roleNeedToAdd && insureProfileArr[i].pasId.value == idNeedToAdd){
								if(!commonService.hasValueNotEmpty(insureProfileArr[i].pasBranch)){
									index1 = i;
									insureProfileArr.splice(i, 1);		
									break;
								}
							}
						}		
						
					}
					else{
						var profileInsurer = data.profile.insurerProfiles.value;
						for(i = 0; i< profileInsurer.length;i++){
							if(roleNeedToAdd == profileInsurer[i].role.value && idNeedToAdd == profileInsurer[i].pasId.value){
								newInsurerProfile.pasBranch.value = profileInsurer[i].pasBranch.value;
							}
						}
					}
				loadingBarService.hideLoadingBar();
				});
			} else {
				loadingBarService.hideLoadingBar();
			}
		})
	}
	
	
	//TODO only for system admin, will update with corresponding username, not current user
	$scope.addNewInsurerProfile = function(insurerProfile) {
		var self = this;
		var deferred = self.moduleService.$q.defer();
		insurerProfile.role = $scope.newRole.value; //set role = role need to add (ex: AG, PO)
		self.moduleService.addInsurerProfile(insurerProfile).then(function(data){
			if (self.moduleService.isSuccess(data)) {
				self.reSetupConcreteUiStructure(self.moduleService.detail, commonService.CONSTANTS.NOT_REMOVE_TEMPLATE_CHILDREN);
				self.watchUserRolesChange();
				commonUIService.showNotifyMessage('v4.user.message.saveSuccessfully', 'success');
			} else {
				commonUIService.showNotifyMessage('v4.user.message.saveUnsuccessfully');
			}
			deferred.resolve(data);
		});
		return deferred.promise;
	};

	/**
	 * Add NewRole GGI 
	 * 1. validate
	 * 2. send OTP (use reSet password function)
	 * 3. verify OTP
	 * 4. saveDetail
	 */
	
	$scope.addNewRole = function(insurerProfile) {
		var self = this;
		if(insurerProfile.customerId.value!=null &&insurerProfile.pasId.value==null){
			$scope.validCheck=1;
		}
		else if(insurerProfile.customerId.value==null &&insurerProfile.pasId.value!=null){
			$scope.validCheck=2;
		}
		else  if(insurerProfile.customerId.value!=null &&insurerProfile.pasId.value!=null){
			$scope.validCheck=3;
		}
		var deferred = self.moduleService.$q.defer();
		if(insurerProfile.role.value !== null ){
			var userProfile = self.moduleService.detail.profile;
			if (userProfile.roles === undefined) {
				userProfile.roles = [];
			}
			
			var flag = true;
			angular.forEach(userProfile.roles.value, function (object) {
				if(object.value === insurerProfile.role){
					flag = false;
				}
			});
			if (flag) {
				
				
				userProfile.roles.value.push({ value: insurerProfile.role.value, meta: {} });		//add role into doc account
				
				//if(insurerProfile.role.value == "MR") {
					var insurerProfileUiModel = angular.copy(insurerProfile);
					delete insurerProfileUiModel.otpType;
					delete insurerProfileUiModel.otpValue;
					delete insurerProfileUiModel.documentError;
					
					if (!userProfile.insurerProfiles.value) {
						userProfile.insurerProfiles.value = [];
					}
					userProfile.insurerProfiles.value.push(insurerProfileUiModel); //add insurerProfiles node into do account
				//}
				
				self.saveDetail(true).then(function(data) {
					deferred.resolve(data);
				});
				removefield();
				
				
			} else {
				deferred.resolve();
			}
		}else{
			deferred.resolve();
		}
		
	
		return deferred.promise;
	};
	function removefield(){
		$scope.newInsurerProfile.pasId.value="";
		$scope.newInsurerProfile.customerId.value="";
	}
	$scope.deleteRole = function (roles, index, role) {
		var self = this;
		var deletedRoles = roles.splice(index,1);	
		loadingBarService.showLoadingBar();
		var insurerProfiles = self.moduleService.detail.profile.insurerProfiles.value;
		for (var i = 0; i<insurerProfiles.length; i++) {
			if(insurerProfiles[i].role.value === role.value){
				insurerProfiles.splice(i, 1);
				break;
			}
		}
		
		self.saveDetail().then(function(data) {
			if (self.moduleService.isSuccess(data)){                
				if (!commonService.hasValueNotEmpty($stateParams.docId)){
					//reload permission
					var roles = localStorage.getItem('roles');
					if (commonService.hasValueNotEmpty(roles)) {
						roles = JSON.parse(roles);
					}
					roles.forEach(function(role, index, list) {
						deletedRoles.forEach(function(deletedRole){
							if (role.roleId === deletedRole.value){
								list.splice(index,1);
							}
						})
					});
					localStorage.setItem("roles", JSON.stringify(roles));
					commonUIService.setupAcl(self.aclService);
					commonUIService.setupAclForLanding(self.aclService);
				}
			}
			loadingBarService.hideLoadingBar();
		});
		loadingBarService.showLoadingBar();
		$scope.getDistinctRoles();
		
	};

	$scope.changePassword = function() {
		var self = this;
		self.moduleService.changePassword(self.submitChangePwdForm).then(function(data) {//success
			if (!commonService.hasValueNotEmpty(data.error)) {
				commonUIService.showNotifyMessage('v4.user.message.changePasswordSuccessfully', 'success');
			} else {
				commonUIService.showNotifyMessage('v4.user.error.' + data.error, undefined, 20000);
			}
		});
	};
	
	$scope.resetUserPassword = function() {
		var self = this;
		var username = self.moduleService.detail.userName.value;
		self.moduleService.resetUserPassword(username).then(function(data) {//success
			if (!commonService.hasValueNotEmpty(data.error)) {
				commonUIService.showNotifyMessage('v4.user.message.resetPasswordSuccessfully', 'success');
			} else {
				commonUIService.showNotifyMessage('v4.user.error.' + data.error, undefined, 20000);
			}
		});
	};

	
	
	/** Get list roles option filter for new & distinct roles */
		$scope.getDistinctRoles = function() {
		/*var self = this;
		var userRoles = self.moduleService.detail.profile.roles.value;
		var insurerProfiles = self.moduleService.detail.profile.insurerProfiles.value;
		var rolesOption = self.moduleService.lazyChoiceList.Roles;
		var distinctRolesOption = [];
		var arrNewDistinctRolesOption=[];
		if(!$scope.isActionCreate()){
			rolesOption.forEach(function(role) {
				//check this role option is assigned to user
				var isAssigned = false;
				userRoles.forEach(function(userRole) {
					//var distinctRoles = commonService.CONSTANTS.USER_ROLES[userRole.value].distinctRoles;
					if (distinctRoles.indexOf(role) !== -1 ) {
						isAssigned = true;
					}
					if(!isAssigned &&(role =='UW' || role =='MR') &&( $scope.$stateParams.userRole == 'SA'|| userRole.value =='SA')){
						distinctRolesOption.push(role);
					}
				});
				//if not assigned, add to option list
				if (!isAssigned && role!=='SA'&&role!=='UW'&&role!=='MR') {
						distinctRolesOption.push(role);
				}
			});
			for(var i = 0;i < distinctRolesOption.length; i++){
				var isExist = false;
				if(distinctRolesOption[i]=='PR'){
					isExist=true;
				} else {
					for(var j = 0 ;j<insurerProfiles.length;j++){
						if(insurerProfiles[j].role.value==distinctRolesOption[i] && distinctRolesOption[i] == 'MR'){
							isExist = true;
							break;
						}
					}
				}
				
				if(!isExist){
			        if(arrNewDistinctRolesOption.indexOf(distinctRolesOption[i]) == -1){
			        	arrNewDistinctRolesOption.push(distinctRolesOption[i])
			        }
				}
			}*/
			var self = this;
			var rolesOption = self.moduleService.lazyChoiceList;
			//thien hoang 	
			
				
		var arrNewDistinctRolesOption=[];
		arrNewDistinctRolesOption.push("AG");
		arrNewDistinctRolesOption.push("PO");
		

				self.moduleService.lazyChoiceList.DistinctRoles = arrNewDistinctRolesOption;
			
				
		
	};
	
	
	/** Add watch to user role for retrieving new distinct roles list */
	$scope.watchUserRolesChange = function() {
		var self = this;
		self.getDistinctRoles();
		self.$watch('moduleService.detail.profile.roles.value.length', function() {
			self.getDistinctRoles();
		}, true);
	}

	$scope.getRoleTranslateKey = function (roleKey) {		
		return 'v4.user.role.' + roleKey;
    }
	
	//detect create or update by System admin
	$scope.isActionCreate = function() {
		var retVal = undefined;
		if($stateParams.type === undefined || commonService.hasValueNotEmpty($stateParams.docId)) {
			retVal = false;
		} 
		else {
			if($stateParams.type === commonService.CONSTANTS.ACTION.CREATE){
				retVal = true;
			}
			else
				retVal = false;
		}
		return retVal;
	}
	if($scope.isActionCreate()){
		localStorage.setItem('actionBySA', 'create');
		} else {
    	localStorage.setItem('actionBySA', 'update');
    }
	$scope.checkToAddNewRole = function(newInsurerProfile){
		if($scope.isActionCreate()){
			$scope.adminUpgradeRole(newInsurerProfile)
		}
		else{
			if(commonService.hasValueNotEmpty($stateParams.docId)){
				$scope.adminUpgradeRole(newInsurerProfile);
			}
			else
				$scope.validateAndSendOTP(newInsurerProfile);
		}
	}
	$scope.checkToDisplayExistingRoles = function(role){
		if(role == 'SA' || role == 'PR')
			return false;
		else
			return true;	
	}
	$scope.goToDocumentDetails = function(docType, docId, businessLine, productName, role) {
		commonService.removeLocalStorageVariables();//clear all old values
		commonService.currentState.set(docType + '-detail');		
		$state.go('root.list.detail', 
			{docType: docType,docId: docId,userRole : role,productName: productName,businessType: businessLine,type: 'update'},
			{ reload: true });
	};
}];
