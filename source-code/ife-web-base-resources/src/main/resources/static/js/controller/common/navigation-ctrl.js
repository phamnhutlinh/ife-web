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
var NavigationCtrl = ['$scope', '$rootScope', '$log', '$state', '$translate', '$translatePartialLoader', '$transitions', '$interval', 'commonService', 'commonUIService', 'salecaseCoreService','AclService', '$filter',
	function($scope, $rootScope, $log, $state, $translate, $translatePartialLoader, $transitions, $interval, commonService, commonUIService, salecaseCoreService, AclService, $filter) {	
	
	$scope.searchText = "";
	$scope.listApplication = commonUIService.listApplication;
	//show the toggle sidebar button on list view only
	$scope.isShowSideBarButton = $state.current.name == "root.list.listView" ? true : false;
	//list site on landing page
	$scope.listMenuApplication = [{ "name": "ife-web-agent-portal-life", "state": "root.list.agentPortalLifeCatalog", "icon": "fa fa-user" }, { "name": "ife-web-direct-sales-portal", "state": "directPortalCatalog", "icon": "fa fa-file" }, { "name": "ife-web-uw", "state": "root.list.uwList", "icon": "fa fa-pencil" }, { "name": "ife-web-customer-portal", "state": "root.list.customerPortalList", "icon": "fa fa-users" }, { "name": "ife-web-group-service-portal", "state": "root.list.groupServicePortalList", "icon": "fa fa-users" }, { "name": "ife-web-group-department-manager", "state": "root.list.departmentManagerList", "icon": "fa fa-building" }, { "name": "ife-web-group-accessor", "state": "root.list.groupAccessorList", "icon": "fa fa-folder-open" }];
	$scope.listAllApp = $scope.listAllApplicationOnNavigation;

	$scope.hideAllNavigationSide = function() {
		$scope.isNavigationLeft = false;
		$scope.isNavigationRight = false;
		$scope.isToggleCollapseMenu = false;
		$scope.isShowBubble_user = false;
		$scope.isShowBubble = false;
		$("#toggleCollapseMenu").collapse('hide');
	};
		
	this.$onInit = function() {
		$rootScope.setupNavigationBar();
	};	
	
	$rootScope.setupNavigationBar = function() {
		$rootScope.profiles = JSON.parse(localStorage.getItem("profiles"));		
		$rootScope.selectedProfiles = JSON.parse(localStorage.getItem("selected_profile"));
		if($rootScope.selectedProfiles != null) {
			$rootScope.currentRole = $rootScope.selectedProfiles.role;
		}
		$rootScope.resourceServerPath = resourceServerPath;
		$rootScope.landingPagePath = landingPagePath;
		
		$transitions.onSuccess({}, function() {
			  if ($state.current.params !== undefined) {
				  $scope.isShowNavBar = $state.current.params.isShowNavBar;
			  }
		});

		$scope.name = 'NavigationCtrl';
		$scope.currentSite = siteName;
		$scope.commonService = commonService;
        $scope.moduleService = salecaseCoreService;
		$scope.username = localStorage.getItem("username");
		$scope.changeLanguage();
		$scope.systemLanguage = localStorage.getItem('system_language')
		$scope.isNavigationLeft = false;
		if ($state.current.params !== undefined) {
			$scope.isShowNavBar = $state.current.params.isShowNavBar;
		}

		$rootScope.myWorkspaces = [];
		if (commonService.CONSTANTS.SITECONFIG !== undefined) {
			//change the way to display side bar
			$rootScope.isDisplayPaymentSideBar();
			
//			$rootScope.myWorkspaces = JSON.parse(localStorage.getItem("workspaces"));
//			if (!Array.isArray($rootScope.myWorkspaces)) {
//				$rootScope.myWorkspaces = [];
//			}
		}

		if (!commonService.hasValueNotEmpty(commonService.currentState.get()) && $rootScope.selectedProfiles != undefined) {
			if ($rootScope.myWorkspaces.length > 0) {
				commonService.currentState.set($rootScope.myWorkspaces[0].link);
			}
		}

	}	
	
	$rootScope.goToPaymentCenter = function() {
		if ($state.current.name === "root.list.detail") {
			var question = 'Do you want leave working section?';
			commonUIService.showYesNoDialog(question, function() {
				commonService.removeLocalStorageVariables();
				commonService.currentState.set("payment_management");
				$state.go('root.list.payment', { link: "payment_management" });				
			}, angular.noop);
		} else {
			commonService.removeLocalStorageVariables();
			commonService.currentState.set("payment_management");
			$state.go('root.list.payment', { link: "payment_management" });
		}		
	}
	$rootScope.navigateBasicQuote = function(){
		if(localStorage.getItem("currentState") === "landing-home"){
			$scope.appList = JSON.parse(localStorage.getItem("appList"));
			var quotationApp = $filter('filter')($scope.appList, {name: "QUOTATION"})[0];
			localStorage.setItem('basic_quote', true);
			window.open(quotationApp.link + "?" + buildParamUserRole(quotationApp.roles), '_self')
		}
		else if($state.current.name === "root.list.detail") {
			var question = 'Do you want leave working section?';
			commonUIService.showYesNoDialog(question, function() {
				commonService.removeLocalStorageVariables();
				commonService.currentState.set("basic_quote_details");
				$state.go('root.list.basicquote', { link: "quotation_management" });				
			}, angular.noop);
		}
		else {
			commonService.removeLocalStorageVariables();
			commonService.currentState.set("basic_quote_details");
			$state.go('root.list.basicquote', { link: "quotation_management" });
		}	
			
	}
	$rootScope.isDisplayPayment = function(){
		if(commonService.hasValueNotEmpty(localStorage.getItem("appList"))){
			var appLists = JSON.parse(localStorage.getItem("appList"));
			var isDisplay = false;
			for(var i=0;i<appLists.length;i++){
				if(appLists[i].name ===  commonService.CONSTANTS.MODULE_NAME.PAYMENT.toUpperCase()){
					isDisplay = true;
					break;
				}
			}
			return isDisplay;
		}
	}
	$rootScope.isDisplayPaymentSideBar = function(){
		var hasPayment = $rootScope.isDisplayPayment();
		if(commonService.hasValueNotEmpty(localStorage.getItem("workspaces"))){
			var workspaces = JSON.parse(localStorage.getItem("workspaces"));
			for(var i=0;i<workspaces.length;i++){
				if(workspaces[i].link !== 'payment_management'){
					$rootScope.myWorkspaces.push(workspaces[i]);
				}
				else if(workspaces[i].link === 'payment_management' && hasPayment === true){
					$rootScope.myWorkspaces.push(workspaces[i]);
				}
			}
		}
	}
	$rootScope.displayDetail = function(){
		return localStorage.getItem('currentState');
	}
	$scope.changeLanguage = function(id) {
		if(id === undefined) {
			id = localStorage.getItem("system_language");
			if(id == "" || id == undefined ||  id == "null"){
				id = "en";
				localStorage.setItem("system_language","en");
			}
		}
		$translatePartialLoader.addPart('translation');
		$translate.refresh();
		$translate.use(id);
	};

	$rootScope.goToState = function(stateName, params, option) {
		var sParams = params ? JSON.stringify(params) : '[no params]';
		$log.debug("You went to state: " + stateName + ' with params: ' + sParams);
		return $state.go(stateName, params, option);
	};
	
	$rootScope.goToListView = function(item) {
		var self = this;
		//change state to list view
		if ($state.current.name === "root.list.detail") {
			var question = 'Do you want leave working section?';
		//	commonUIService.showYesNoDialog(question, function() {
				commonService.removeLocalStorageVariables();
				commonService.currentState.set(item.link);
				if(item.link == 'payment_management') {
					$state.go('root.list.payment', { link: item.link });
				} else {
					if (item.link == 'direct'){
						$state.go('root.list.direct', { link: item.link });
					} else {
						$state.go('root.list.listView', { link: item.link });
					}
				}				
				self.toggleNavigationLeft();
	//		}, angular.noop);
		} else {
			commonService.removeLocalStorageVariables();
			commonService.currentState.set(item.link);
			if(item.link == 'payment_management') {
				$state.go('root.list.payment', { link: item.link });
			} else {
				$state.go('root.list.listView', { link: item.link },{ reload: true });
			}			
			self.toggleNavigationLeft();
		}
	};

	$rootScope.toggleNavigationLeft = function(forceClose) {
		var listViewEle = $(".v4-prototype-middleView-list");
		var listViewNestedEle = listViewEle.find(".navigation-side-left");

		if (forceClose) {
			$scope.isNavigationLeft = false;
			if (listViewEle.hasClass("v4-prototype-middleView-list-active")) {
				listViewEle.toggleClass("v4-prototype-middleView-list-active");
				listViewNestedEle.toggleClass("navigation-side-left-hide");
			}
		} else {
			$scope.isNavigationLeft = !$scope.isNavigationLeft;
			listViewEle.toggleClass("v4-prototype-middleView-list-active");
			listViewNestedEle.toggleClass("navigation-side-left-hide");
		}
	};

	$rootScope.doLogin = function() {
		//Currently, will do login on landing app only
		$state.go('login', { initRequest: true });
	};

	$rootScope.doLogout = function() {
		$scope.toggleNavigationLeft(true);
		localStorage.clear();
		window.open('logout', '_self');
	};
	
	$rootScope.isLoggedIn = function() {
		var isLoggedIn = commonService.hasValueNotEmpty($scope.username);
		return isLoggedIn;
	};
	
	$scope.goToUserDetail = function() {
		$scope.toggleNavigationLeft(true);
		if ($state.current.name === "root.list.detail") {
			var question = 'Do you want leave working section?';
			commonUIService.showYesNoDialog(question, function() {
				commonService.removeLocalStorageVariables();
				commonService.currentState.set('account-detail');
				$state.go(
					'root.list.detail',
					{ docType: commonService.CONSTANTS.MODULE_NAME.ACCOUNT, docId: '', businessType: '', productName: '',type:'view' },
					{ reload: true }
				);
			}, angular.noop);
		} else {
			commonService.removeLocalStorageVariables();
			commonService.currentState.set('account-detail');
			$state.go(
				'root.list.detail',
				{ docType: commonService.CONSTANTS.MODULE_NAME.ACCOUNT, docId: '', businessType: '', productName: '',type:'view' },
				{ reload: true }
			);
		}
	};

	$scope.getsystemCurrentdate = function (){
		var self = this;
		self.moduleService.getCurrentDateAndTime(self.requestURL).then(function(dateTime){
            $rootScope.systemDateTime = dateTime.dateTime;
            $rootScope.systemTimeZone = dateTime.time.substring(dateTime.time.lastIndexOf('+'),dateTime.time.lastIndexOf('+') + 5);
            $interval(function() {
                $rootScope.systemDateTime+=1000;
            }, 1000);
		});

	};
	
	
	//$scope.enableToggle = false;
	
	//toogle visible for application list menu
	$scope.toggleBubble = function toggleBubble() {		
		$scope.isShowBubble = !$scope.isShowBubble;
	};	
	function buildParamUserRole(roles){
		var params = '';
		roles.forEach(function (role){
			params += 'roles=' + role+ '&';
		})
		return params;
	}
}];