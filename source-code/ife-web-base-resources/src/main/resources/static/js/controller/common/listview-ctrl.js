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
var ListViewCtrl = ['$scope', '$log','$state', '$stateParams','$q','$timeout','$http', '$mdDialog','commonService','connectService', 'commonUIService', 'listviewCoreService', 'quotationCoreService', 'underwritingCoreService',
	function($scope, $log,$state, $stateParams, $q, $timeout, $http, $mdDialog, commonService, connectService,commonUIService, listviewCoreService, quotationCoreService, underwritingCoreService) {

	$scope.$on('$destroy', function(){
		if(siteName == "ife-web-base-system-admin"){
			$scope.disconnectWebsocket();
		}
		
	})
	
	this.$onInit = function () {
		$scope.scrollTop(0);
		$scope.name = 'ListViewCtrl';
		$scope.dashboardDoctype = $stateParams.link;
		localStorage.setItem("dashboardDoctype",$stateParams.link);
		$scope.ownerName = localStorage.getItem("username");
		
		$scope.sumInsured = Number(JSON.parse(localStorage.getItem("sumInsured")));
		var selectedProfile = JSON.parse(localStorage.getItem("selected_profile"));
		if(selectedProfile.role === "PO"){
			$scope.agentId = selectedProfile.customerId;					
		}else{
			$scope.agentId = selectedProfile.pasId;
		}
		$scope.policyId = selectedProfile.policyId;
		$scope.policyName= selectedProfile.policyName;
		$scope.role =selectedProfile.role;
		$scope.agentType = selectedProfile.pasType;
		$scope.businessType = "pnc";
		$scope.contractType = "MT1-MT2-MAR-MIC";
		$scope.isLoadList = true;
		$scope.contactList = [];
		$scope.fnaList = [];
		$scope.caseList = [];
		$scope.underwritingList = [];
		$scope.userList = [];		
		$scope.moduleService = listviewCoreService;
		$scope.getComputeLazy();
		if(siteName == "ife-web-base-system-admin") {
			try {
				$scope.connectWebsocket();
			} catch (err) {
				console.log(err)
			}
		}
		$scope.infiniteItems = [];
	};
	
	var stompClient = null;
	$scope.connectWebsocket = function() {
		var socket = new SockJS(websocketPath);
        console.log(socket);
        stompClient = Stomp.over(socket);  
        stompClient.connect({}, function(frame) {            
            console.log('Connected: ' + frame);
            stompClient.subscribe('/request_permission_mobility/messages', function(messageOutput) {
                //$scope.showMessageOutput(JSON.parse(messageOutput.body));
            	$scope.$broadcast('updateWebSocket')
            });
        }, function(error) {
        	commonUIService.showNotifyMessage(error, "error");
    	});
	}
	
	$scope.disconnectWebsocket = function() {
		if(stompClient != null) {
            stompClient.disconnect();
        }        
	}
	
//	$scope.showMessageOutput = function(messageOutput) {
//		($scope.infiniteItems).push(messageOutput);
//		$scope.$apply($scope.infiniteItems);
//		$timeout(function() {
//			$scope.$broadcast('$md-resize');
//		}, 200)
//		angular.element('.collapsible').collapsible();
//	}

	// show dialog to select a new document by doc type
	
	$scope.showListNewDocumentOptionDlg = function(ev, doctype, dashboardName) {
		console.log(doctype);
		if(doctype === undefined) {
			console.log('doc type is undefined');
			return;
		}
		
		// url of template
		var templateUrl = resourceServerPath + 'view/templates/catalogs/' + doctype + '-template.html';
		
		// get catalog json data file
		var defer = $q.defer();
		var catalogFileName = 'new_catalog_' + doctype + '.json';
		var catalogJsonMockUrl = resourceServerPath + "view/workspaces/jsonMock/" + catalogFileName;
		var promise = $http.get(catalogJsonMockUrl);
		
		promise.then(function(resp) {
			if(resp) {
				var jsonData = resp.data;
				// process to prepare data to show / hide item on dialog
				for(var i = 0; i < jsonData.content.length; i++) {
					var visible = jsonData.content[i].isVisible;
					if(visible === undefined) {
						visible = true;
					} else {
						if (angular.isString(visible)){
							visible = $scope.$eval(visible);
						} 
					}
					jsonData.content[i].isVisible = visible;
				}
				
				// show message 
				showDlg(doctype, jsonData.content);
			}
		}, function failed(){
			defer.reject();
		})
		
		function showDlg(type, content) {
			function DialogCatalogController($scope, $mdDialog) {
				//$scope.type = type;
				$scope.content = content;
				$scope.dashboardName = dashboardName;
				$scope.clickItemHandler = function(onClick) {
					if(onClick) {
						$scope.$parent.$eval(onClick);
					}
				}
			    $scope.cancel = function() {
			      $mdDialog.cancel();
			    };
			  }
			
			$mdDialog.show({
				 controller: DialogCatalogController,
				 scope: $scope.$new(),
			     templateUrl: templateUrl,
			      parent: angular.element(document.body),
			      targetEvent: ev,
			      clickOutsideToClose:true,
			      fullscreen: false // Only for -xs, -sm breakpoints.
			    }).then(function() {
			      // completed and release dialog
			    }, function() {
			      // cancel event
			    });
		}
		
	}
	
	//Add new document by doctype
	$scope.goToState = function(doctype) {
		$state.go(
			'root.list.detail',
			{ docType: doctype, docId: '' },
			{ reload: true }
		);
	}
	
	$scope.getComputeLazy = function() {
		var self = this;
		var deferred = self.moduleService.$q.defer();
		var lazyChoiceListName = "ProductCode,Sources,ContactType,PolicyType,BusinessStatus,UAStatusDashBoard,QuoteType,SourceType,Location,OperationStatus,MyActionableCaseStatus,MyInProgressCaseStatus,MyConventedCaseStatus,MyUnconventedCaseStatus," +
				"UWStatusDashBoard,AUStatusDashBoard,PIStatusDashBoard,PIMyConvertedDashBoard,SUStatusDashBoard,Gender,ClientType,ContractType,ExchangeRate,BasicRate";
		if (!commonService.hasValueNotEmpty(self.moduleService.lazyChoiceList)) {
			self.moduleService.getOptionsList(self.requestURL, lazyChoiceListName).then(function(data) {
				deferred.resolve(data);
			});
		} else {
			deferred.resolve();
		}
		return deferred.promise;
	};
	
	$scope.selectTab = function(id) {
		var self = this;
		var tabs = document.getElementsByClassName('tab');
		for (var i = 0; i < tabs.length; i++) {
			tabs[i].getElementsByTagName('a')[0].className = '';
		}
		document.getElementById(id).className = 'active';
		self.selectedDashboard = id;
		self.scrollTop(0);
	};
	$scope.isRoleActive=function(role){
		var result = false;
		if(JSON.parse(localStorage.getItem("selected_profile")).role==role){
			result = true;
		}
		return result;
		
	}
	$scope.isActiveForRole = function (role) {
		var result = false;
		var activeRoles = localStorage.getItem('roles');
		if (commonService.hasValueNotEmpty(activeRoles)) {
			activeRoles = JSON.parse(activeRoles);
		}
		activeRoles.forEach(function (activeRole) {
			if(role === activeRole.roleId){
				result = true;
			}
		});
		return result;
	};
	
	
	// hle71 - generate business case from the Quick Quotation dashboard
	$scope.generateBusinessCaseFromQuickQuotationDashboard = function (quotation) {
		return quotationCoreService.generateBusinessCaseFromQuickQuotationAndNavigateToBC(quotation.docType, quotation.docName, quotation.businessType, quotation.productName, $scope.$root.currentRole);
	};
		
	$scope.navigateFromUnderwritingToBusinessCase = function(caseId, businessType, productName, userRole) {
		underwritingCoreService.navigateFromUnderwritingToBusinessCase(caseId, businessType, productName, userRole); // $scope.$root.currentRole
	};
	
}];

var AccountListViewCtrl = ['$scope', '$log', '$state', '$stateParams', '$compile', 'loadingBarService', 'commonService', 'commonUIService', 'accountCoreService',
	function($scope, $log, $state, $stateParams, $compile, loadingBarService, commonService, commonUIService, accountCoreService) {

	// it not work for new ui with lazyload
	/*$scope.setupStuffs = function(index, username) {
		var parentElement = angular.element('.ipos_table_v4_row:nth-child(' + (index + 2) + ') > md-card > div');
		var elements = angular.element('.ipos_table_v4_row:nth-child(' + (index + 2) + ') > md-card > div > div:nth-child(-n+5)');
		elements.attr('ng-click', 'goToDocumentDetails(commonService.CONSTANTS.MODULE_NAME.ACCOUNT, \"' + username + '\")');
		$compile(elements)(parentElement.scope());
	};
	 */
	$scope.triggerActiveSwitch = function(event, user) {
		var question = user.isActive === 'true' ?
			'v4.user.label.ActivateUserQuestion' :
			'v4.user.label.DeactivateUserQuestion';
		commonUIService.showYesNoDialog(question, function() {
			loadingBarService.showLoadingBar();
			accountCoreService.getDocument(undefined, commonService.CONSTANTS.MODULE_NAME.ACCOUNT, user.userName)
				.then(function (detail) {
					detail.isActive = user.isActive;
					accountCoreService.saveDocument(undefined, commonService.CONSTANTS.MODULE_NAME.ACCOUNT, user.userName)
						.then(function () {
							loadingBarService.hideLoadingBar();
						});
				});
		}, function() {
			user.isActive = user.isActive === 'true' ? 'false' : 'true';
		});
	};
	
	$scope.triggerActiveSwitchBlock = function(event, user) {
		var question = user.isBlockAccount === 'true' ?
			'v4.user.label.BlockedUserQuestion' :
			'v4.user.label.UnblockUserQuestion';
		commonUIService.showYesNoDialog(question, function() {
			loadingBarService.showLoadingBar();
			accountCoreService.getDocument(undefined, commonService.CONSTANTS.MODULE_NAME.ACCOUNT, user.userName)
				.then(function (detail) {
					detail.isBlockAccount = user.isBlockAccount;
					if(detail.isBlockAccount === "true"){
						detail.timeRetryAccount = "3";
					}else{
						detail.timeRetryAccount = "0";
					}
					accountCoreService.saveDocument(undefined, commonService.CONSTANTS.MODULE_NAME.ACCOUNT, user.userName)
						.then(function (data) {
							
							accountCoreService.sendMailUnlockAccount(undefined,commonService.CONSTANTS.MODULE_NAME.ACCOUNT, data ).then(function(){
								loadingBarService.hideLoadingBar();
								commonUIService.showNotifyMessage("v4.quotation.can.unblockaccountsuccessfully",'success');
								$state.reload();
							});
						});
				});
		}, function() {
			user.isBlockAccount = user.isBlockAccount === 'true' ? 'false' : 'true';
		});
	};
	
	$scope.triggerOfflineSwitch = function(event, user) {
		var question = user.offline === 'true' ?
			'v4.user.label.OfflineUserQuestion' :
			'v4.user.label.OnlineUserQuestion';
		commonUIService.showYesNoDialog(question, function() {
			loadingBarService.showLoadingBar();
			accountCoreService.getDocument(undefined, commonService.CONSTANTS.MODULE_NAME.ACCOUNT, user.userName)
				.then(function (detail) {
					detail.offline = user.offline;
					accountCoreService.saveDocument(undefined, commonService.CONSTANTS.MODULE_NAME.ACCOUNT, user.userName)
						.then(function () {
							loadingBarService.hideLoadingBar();
						});
				});
		}, function() {
			user.offline = user.offline === 'true' ? 'false' : 'true';
		});
	};
}];

var PaymentListViewCtrl = ['$scope', '$rootScope', '$log', '$state', '$stateParams', '$compile', '$timeout', 'loadingBarService', 'commonService', 'commonUIService', 'transactionCoreService', 'AclService', 'paginationService',
	function($scope, $rootScope, $log, $state, $stateParams, $compile, $timeout, loadingBarService, commonService, commonUIService, transactionCoreService, AclService, paginationService) {

	this.$onInit = function () {
		$scope.pageSizes = [10, 20, 30, 40, 50];
		$scope.currentPage = 0;
		$scope.size = 20;
		$scope.paymentList = [];
		$scope.moduleService = transactionCoreService;	
		$scope.resetSearch(undefined, 0, 20);
		$scope.listtitle = "agent-payment";
		$scope.searchcriteria=[
			'referenceInfo.businessCaseNo',
			'paymentinfo.paymentAmount.payments.transactionNumber'
		];
		$scope.isListView  = true;
	};
	
	$scope.resetSearch = function (searchText, page, size, customSearchQuery, customSort) {
		$scope.isLoad = true;
		$scope.lengthCurrent = 0;
		$scope.infiniteItems.numLoaded= 0;
		$scope.infiniteItems.toLoad= 0;
		$scope.infiniteItems.items= [];
		$scope.currentPage = 0;
		$scope.pendingPaymentList = [];
		$scope.ownerName = localStorage.getItem("username");
	    $scope.defaultquery = $scope.defaultquery = [{"fields":["metaData.ownerName"],"values":[$scope.ownerName]},{"fields":["metaData.businessStatus"],"values":["PAID"]}];
		//$scope.resetValue();
		$scope.searchPaymentHistory(searchText, page, size, customSearchQuery, customSort);
		//paginationService.setCurrentPage($scope.listtitle, $scope.currentPage);
	}
	
	// Start lazy load
	// lazy load page
	$scope.isLoad = true;
	$scope.lengthCurrent = 0;
	$scope.infiniteItems = {
    	        numLoaded: 0,
    	        toLoad: 0,
    	        items: [],
    	        getItemAtIndex: function (index) {
    	            if (index > this.numLoaded) {
    	                this.fetchMoreItems(index);
    	                return null;
    	            }
    	            return this.items[index];
    	        },
    	        getLength: function () {
    	        	return this.numLoaded;
    	        },

    	        fetchMoreItems: function (index) {	 
    	            if ((this.toLoad < index)) {
    	            		if(($scope.isLoad) && ($scope.paymentList.length > $scope.lengthCurrent ) ){
	    	            		if($scope.paymentList.length < $scope.totalItems){
	    	            			$scope.lengthCurrent = $scope.paymentList.length;
		    	            		$scope.searchPaymentHistory();
		    	            	} else{ // when totalItems % size == 0
		    	            		$scope.isLoad = false;
		    	            		$rootScope.$broadcast('updateListViewScreen');
		    	            	}
	    	            	} 
    	            		if(this.items.length < $scope.paymentList.length){
        	            		this.items = $scope.paymentList;
        	            		this.toLoad = this.items.length;
    		    	            this.numLoaded = this.toLoad;   
        	            	} else {
        	            		return;
        	            	} 	
    	            }
    	        }
    	    };
	// end
	$scope.$on('updateListViewScreen', updateListView);
	
	function updateListView() {
		$timeout(function() {
			$scope.$broadcast('$md-resize');
		}, 200)
	}
	$scope.searchPaymentHistory = function(searchText, page, size, customSearchQuery, customSort) {
		var self = this;
		var searchText = [];			
		if (!commonService.hasValueNotEmpty(page)) {
			page = $scope.currentPage;
		} else{
			page = page;
		}
		var searchParams = {
				page: page,
				size: $scope.size
			};
		$scope.queryBusinessCaseNo = undefined !== $scope.queryBusinessCaseNo ? $scope.queryBusinessCaseNo : [];
		$scope.queryPaymentNo = undefined !== $scope.queryPaymentNo ? $scope.queryPaymentNo : [];
		var searchQuery = $scope.buildSearchQuery($scope.queryBusinessCaseNo.value,$scope.queryPaymentNo.value, $scope.searchcriteria);
		searchQuery = searchQuery.concat($scope.buildSearchQueryByDate("paymentinfo.paymentAmount.payments.paymentDate", $scope.queryDateFrom, $scope.queryDateTo));
		self.moduleService.searchDocumentFull(undefined, $scope.moduleService.name, searchQuery, searchParams).then(function(data) {
			if(commonService.hasValueNotEmpty(data)) {
				var totalElements = self.moduleService.findElementInElement(data, ['totalElements']);
				var list = self.moduleService.findElementInElement(data, ['payments']);
				var number =  self.moduleService.findElementInElement(data, ['page']).number;
				var totalPages = self.moduleService.findElementInElement(data, ['totalPages']);
				if (commonService.hasValueNotEmpty(totalElements)) {
					$scope.totalItems = data.page.totalElements;	
					$scope.totalPage = totalPages;
					$scope.currentPage += 1;
					//scope.isLoad =true;
					if(number == 0){
						if(list != undefined){
							$scope.paymentList = list;
							$scope.infiniteItems.items = $scope.paymentList;
							$scope.infiniteItems.numLoaded = $scope.paymentList.length;
							$scope.isLoad =true;
							$rootScope.$broadcast('updateListViewScreen');
							
						} else{
							$scope.isLoad = false;
							$scope.paymentList = [];
							$scope.infiniteItems.items = $scope.paymentList;
						}								
					} else {
						if(Array.isArray(list)) {
							$scope.paymentList = $scope.paymentList.concat(list);
							$rootScope.$broadcast('updateListViewScreen');
						}
					}
					
					// Check if ending of the list, turn off the loading bar
					if ( !Array.isArray(list) || (list.length < searchParams.size) ) { 
						$scope.isLoad =false;
					}
				} else {
					$scope.isLoad =false;
				}			
				//$scope.totalItems = data.page.totalElements;
				// $scope.paymentDate = moment().format($scope.formatDate);
			} /*else {
				$scope.paymentList = [];
				$scope.totalItems = 0;
			}*/
		});
	}
	
	
	
	$scope.buildSearchQuery = function(queryBusinessCaseNo,queryPaymentNo, searchFields) {
		var searchQuery = [];
		var searchTexts = [];
	
		if ((commonService.hasValueNotEmpty(queryBusinessCaseNo) || commonService.hasValueNotEmpty(queryPaymentNo)) &&
			commonService.hasValueNotEmpty(searchFields)) {
			searchTexts.push(queryBusinessCaseNo);
			searchTexts.push(queryPaymentNo);
			searchTexts.forEach(function(item,index){
				if(item){
				searchQuery.push({fields:[searchFields[index]], values:[item]});
				}
			})			
		}
		if (commonService.hasValueNotEmpty($scope.defaultquery)) {
			searchQuery = searchQuery.concat($scope.defaultquery);
		}
		
		if (commonService.hasValueNotEmpty($scope.filterValueChains)) {
			$scope.filterValueChains.forEach(function (filterValue){
				if(commonService.hasValueNotEmpty(filterValue.values))
					searchQuery.push(filterValue);
			});
		}
		
		return searchQuery;
	};
	
	$scope.buildSearchQueryByDate = function(fieldName, dateFromValue, dateToValue) {
		var searchQuery = [];
		if(commonService.hasValueNotEmpty(dateFromValue) && commonService.hasValueNotEmpty(dateToValue)) {
			searchQuery.push({fields:[fieldName], values:[dateFromValue.value, dateToValue.value]});
		}		
		return searchQuery;
	};
	
	$scope.goToDocumentDetails = function(docType, docId, businessLine, productName) {
		commonService.removeLocalStorageVariables();//clear all old values
		commonService.currentState.set(docType + '-detail');		
		//var activeRole = commonUIService.setupAclForDetail(AclService, [$rootScope.currentRole]);
		$state.go('root.list.detail', {
			docType: docType,
			docId: docId,
			userRole : $rootScope.currentRole,
			productName: productName,
			businessType: businessLine
		});
	};
	
}];