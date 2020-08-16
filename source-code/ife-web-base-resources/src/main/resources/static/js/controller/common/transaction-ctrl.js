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
var TransactionDetailCtrl = ['$scope', '$rootScope', '$log', '$stateParams', '$injector', '$location', 'commonService', 'commonUIService', 'transactionCoreService', 'AclService', 'paginationService', 'loadingBarService', '$timeout', '$state',
	function($scope, $rootScope, $log, $stateParams, $injector, $location, commonService, commonUIService, transactionCoreService, AclService, paginationService, loadingBarService, $timeout, $state) {

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
		$scope.ctrlName = genCtrlName('detail', commonService.CONSTANTS.MODULE_NAME.TRANSACTION);
		$scope.moduleService = transactionCoreService;
		$scope.$stateParams = $stateParams;
		$scope.lazyChoiceListName = "BankName,PaymentBasis,PaymentMethod,PayorName,Currency,ProductCode";
		$scope.pageSizes = [10, 20, 30, 40, 50];
		$scope.currentPage = 0;
		$scope.totalPayableAmount = "0.00";
        $scope.pageSize = $scope.pageSizes[0];
        $scope.formatDate = "YYYY-MM-DDTHH:mm:ssZZ";
        $scope.listtitle = "agent-payment";        
		//commonUIService.setupAclForDetail(AclService, [$stateParams.userRole]);
		$scope.setupStuffs(true);
		$scope.pendingPaymentList = [];	
		$scope.isListView  = true;
		
	};	
	
	$scope.getDetail = function() {
		var self = this;
		var deferred = self.moduleService.$q.defer();
		self.moduleService.detail =  self.moduleService.originalDetail = {};
		deferred.resolve(self.moduleService.detail);
		return deferred.promise;
	};
	
	$scope.goToTransaction = function(docType) {		
		//var activeRole = commonUIService.setupAclForDetail(AclService, [$rootScope.currentRole]);
		$state.go('root.list.detail', {
			docType: docType,
			userRole : $rootScope.currentRole
		});
	};
	
	$scope.goToPaymentHistory = function() {
		commonService.currentState.set('payment-history');		
		$state.go('root.list.listView', { link: 'payment_management'});
	};
	/************************************************************************************* */
	/******************************** End lifecycle methods ****************************** */
	/************************************************************************************* */
	
	$scope.initPaymentList = function(searchText, page, size, customSearchQuery, customSort){
		$scope.setVisibleCard("transaction:Step3_Finish", false);
		$scope.resetValue(true);
		$scope.searchListPayment(searchText, page, size, customSearchQuery, customSort);
	}
	
	$scope.resetValue = function(resetSearch){
		if(resetSearch == true) {
			$scope.queryProduct = [];
	        $scope.queryCurrency = [];
	        $scope.queryEffectiveDateFrom = [];
	        $scope.queryEffectiveDateTo = [];
		}
		$scope.idChecked=[];
		$scope.totalPayableAmount = "0.00";
    	$scope.a = {};    	
    	$scope.paymentSubNo = $scope.moduleService.genDefaultName();
    	$scope.paymentDate = moment().format($scope.formatDate);
    	$scope.a.isSelectAll = false;
        $scope.paymentChecked = [];
        $scope.paymentBasic = undefined;
        $scope.moduleService.paymentBasic = "GROSS";
        $scope.moduleService.paymentMethod = "1";
        $scope.moduleService.passStep1Payment = false;
        $scope.ownerName = localStorage.getItem("username");
        $scope.defaultquery = [{"fields":["metaData.ownerName"],"values":[$scope.ownerName]},{"fields":["metaData.businessStatus"],"values":["DR"]}];
        $scope.resetPaymentInfor();
	}
	
	$scope.searchcriteria=[
		'referenceInfo.productCode',
		'referenceInfo.contractCurrency'
	];
	
	$scope.cancelFirstTile = function(){
    	$scope.idChecked = [];
    	$scope.paymentChecked = [];
    	$scope.totalPayableAmount = "0.00";
    	$scope.a.isSelectAll = false;
    	$scope.moduleService.paymentMethod = undefined;
    	$scope.moduleService.passStep1Payment = false;
    	for (var i=0; i< $scope.pendingPaymentList.length; i++){
			$scope.pendingPaymentList[i].isCheck = false;
		}
    }
	
	$scope.updateDetailPayment = function updateDetailPayment(payment){
        $scope.moduleService.findElementInElement(payment, ['paymentMethod']).type = $scope.moduleService.paymentMethod;
		$scope.moduleService.findElementInElement(payment, ['bankAccount']).adviceDate = $scope.moduleService.adviceDate;
		$scope.moduleService.findElementInElement(payment, ['bankAccount']).adviceNo = $scope.moduleService.adviceNo;
		$scope.moduleService.findElementInElement(payment, ['cheque']).chequeBankName = $scope.moduleService.bankName;
		$scope.moduleService.findElementInElement(payment, ['cheque']).date = $scope.moduleService.chequeDate;
		$scope.moduleService.findElementInElement(payment, ['cheque']).number = $scope.moduleService.chequeNo;
		$scope.moduleService.findElementInElement(payment, ['payer']).payorName = $scope.moduleService.payorName;
		$scope.moduleService.findElementInElement(payment, ['comment']).remarkText = $scope.moduleService.comment;
		$scope.moduleService.findElementInElement(payment, ['payments'])[0].transactionNumber = $scope.paymentSubNo;
		$scope.moduleService.findElementInElement(payment, ['payments'])[0].paymentDate = $scope.paymentDate;
		$scope.moduleService.findElementInElement(payment, ['paymentinfo']).paymentType = $scope.moduleService.paymentBasic;		
		payment.id = payment.metaData.docId;
		delete payment.isShow;
		delete payment.isCheck;
	}
	
	$scope.resetPaymentInfor = function(){
		$scope.moduleService.adviceDate = undefined;
		$scope.moduleService.adviceNo = undefined;
		$scope.moduleService.bankName = undefined;
		$scope.moduleService.chequeDate = undefined;
		$scope.moduleService.chequeNo = undefined;
		$scope.moduleService.payorName = undefined;
		$scope.moduleService.comment = undefined;
		$scope.checkChequeNo = false;
		$scope.checkChequeDate = false;
		$scope.checkBankName = false;
		$scope.checkPayorName = false;
		$scope.checkAdviceNo = false;		
		$scope.checkAdviceDate = false;		
	}
	
	$scope.cancelSecondTile = function(){
		$scope.resetPaymentInfor();
    	$scope.moveToCard("transaction:Step1_SelectYourTransaction");
    }
	
	$scope.resetSearch = function (searchText, page, size, customSearchQuery, customSort) {
		$scope.isLoad = true;
		$scope.lengthCurrent = 0;
		$scope.infiniteItems.numLoaded= 0;
		$scope.infiniteItems.toLoad= 0;
		$scope.infiniteItems.items= [];
		$scope.currentPage = 0;
		$scope.pendingPaymentList = [];
		$scope.resetValue();
		$scope.searchListPayment(searchText, undefined, undefined, customSearchQuery, customSort);
		//paginationService.setCurrentPage($scope.listtitle, $scope.currentPage);
	}	
	
	$scope.goToDocumentDetails = function(docType, docId, businessLine, productName, event) {
		if(event && event.button == 1) {
			event.preventDefault();
		}
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
    	            	if(($scope.isLoad) && ($scope.pendingPaymentList.length > $scope.lengthCurrent ) ){
	    	            	if($scope.pendingPaymentList.length < $scope.totalItems){
	    	            		$scope.lengthCurrent = $scope.pendingPaymentList.length;
		    	            	$scope.searchListPayment();
		    	            } else{ // when totalItems % size == 0
		    	            	$scope.isLoad = false;
		    	            	$rootScope.$broadcast('updateListViewScreen');
		    	           	}
    	            	} 
    	            	if(this.items.length < $scope.pendingPaymentList.length){
    	            		this.items = $scope.pendingPaymentList;
    	            		this.toLoad = this.items.length;
		    	            this.numLoaded = this.toLoad;   
    	            	} else {
    	            		return;
    	            	} 	
    	            }
    	        }
    	    };
	// end
	$scope.searchListPayment = function(searchText, page, size, customSearchQuery, customSort) {
		var self = this;
		
		$scope.a.isSelectAll = false;
		var searchText = [];

		var searchParams = {
			page: page,
			size: size
		};
		if (!commonService.hasValueNotEmpty(page)) {
			page = $scope.currentPage;
		} else{
			page = page;
		}
		var queryProduct = undefined;
		if($scope.queryProduct.value != undefined) {
			queryProduct = $scope.queryProduct.value.toLowerCase();
		}
		var searchQuery = $scope.buildSearchQuery(queryProduct,$scope.queryCurrency.value, $scope.searchcriteria)
		searchQuery = searchQuery.concat($scope.buildSearchQueryByDate("metaData.createDate", $scope.queryEffectiveDateFrom, $scope.queryEffectiveDateTo));
		self.moduleService.searchDocumentFull(undefined, $scope.moduleService.name, searchQuery, searchParams).then(function(data) {
			if(commonService.hasValueNotEmpty(data) && self.moduleService.findElementInElement(data, ['businessStatus']) == commonService.CONSTANTS.BUSINESS_STATUS.DR) {
				var totalElements = self.moduleService.findElementInElement(data, ['totalElements']);
				//var totalRecords = self.moduleService.findElementInElement(data, ['totalRecords']);
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
							$scope.pendingPaymentList = list;
							$scope.infiniteItems.items = $scope.pendingPaymentList;
							$scope.infiniteItems.numLoaded = $scope.pendingPaymentList.length;
							$scope.isLoad =true;
							$rootScope.$broadcast('updateListViewScreen');
							
						} else{
							$scope.isLoad = false;
							$scope.pendingPaymentList = [];
							$scope.infiniteItems.items = $scope.pendingPaymentList;
						}								
					} else {
						if(Array.isArray(list)) {
							$scope.pendingPaymentList = $scope.pendingPaymentList.concat(list);
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
				
				/*$scope.pendingPaymentList.forEach(function(payment) {
					payment.isShow = true;
					payment.isCheck = false;
					
					$scope.paymentChecked.forEach(function(paymentChecked) {
						if(paymentChecked.metaData.docId == payment.metaData.docId) {
							payment.isCheck = true;
						}
					});					
					if(payment.metaData.businessStatus == commonService.CONSTANTS.BUSINESS_STATUS.DR)
						$scope.pendingPaymentList.push(payment);
				});*/

			}
				//scope.currentPage += 1;
				/*data._embedded.payments.forEach(function(payment) {
					payment.isShow = true;
					payment.isCheck = false;
					
					$scope.paymentChecked.forEach(function(paymentChecked) {
						if(paymentChecked.metaData.docId == payment.metaData.docId) {
							payment.isCheck = true;
						}
					});					
					if(payment.metaData.businessStatus == commonService.CONSTANTS.BUSINESS_STATUS.DR)
						$scope.pendingPaymentList.push(payment);
				}*/
				/*);
				$rootScope.$broadcast('updateListViewScreen');*/		
		});
	}	
	$scope.$on('updateListViewScreen', updateListView);
	
	function updateListView() {
		$timeout(function() {
			$scope.$broadcast('$md-resize');
		}, 200)
	}
	
	$scope.$on('resetListPayment', resetList);
	
	function resetList(){
		$scope.isLoad = true;
		$scope.lengthCurrent = 0;
		$scope.infiniteItems.numLoaded= 0;
		$scope.infiniteItems.toLoad= 0;
		$scope.infiniteItems.items= [];
		$scope.currentPage = 0;
		$scope.pendingPaymentList = [];
		$scope.resetValue();
		$scope.searchListPayment();		
	}
	
	$scope.checkFieldMethodPayment = function checkFieldMethodPayment(){
		$scope.moduleService.checkFieldMethodPayment = true;
		if($scope.moduleService.paymentMethod == commonService.CONSTANTS.PAYMENT_METHOD.CHEQUE) {
			if($scope.moduleService.chequeNo == undefined){
				$scope.checkChequeNo = true;
				$scope.moduleService.checkFieldMethodPayment = false;
			}
			if($scope.moduleService.chequeDate == undefined) {
				$scope.checkChequeDate = true;
				$scope.moduleService.checkFieldMethodPayment = false;
			}
			if($scope.moduleService.bankName == undefined){
				$scope.checkBankName = true;
				$scope.moduleService.checkFieldMethodPayment = false;
			}
			if($scope.moduleService.payorName == undefined){
				$scope.checkPayorName = true;
				$scope.moduleService.checkFieldMethodPayment = false;
			}
		}
		if($scope.moduleService.paymentMethod == commonService.CONSTANTS.PAYMENT_METHOD.BANK_TRANSFER) {
			if($scope.moduleService.adviceNo == undefined){
				$scope.checkAdviceNo = true;
				$scope.moduleService.checkFieldMethodPayment = false;
			}
			if($scope.moduleService.adviceDate == undefined){
				$scope.checkAdviceDate = true;
				$scope.moduleService.checkFieldMethodPayment = false;
			}
			if($scope.moduleService.payorName == undefined){
				$scope.checkPayorName = true;
				$scope.moduleService.checkFieldMethodPayment = false;
			}
		}
		if($scope.moduleService.paymentMethod == commonService.CONSTANTS.PAYMENT_METHOD.CASH) {
			if($scope.moduleService.payorName == undefined){
				$scope.checkPayorName = true;
				$scope.moduleService.checkFieldMethodPayment = false;
			}
		}
	};
	
	$scope.doRealPayment = function doRealPayment(){
		//$scope.checkFieldMethodPayment();
		//if($scope.moduleService.checkFieldMethodPayment == true) {
		if(true) {
			var promises = [];
			$scope.paymentChecked.forEach(function(payment) {
				$scope.updateDetailPayment(payment);
				var updatePayment = $scope.moduleService.updateDocument($scope.requestURL, $scope.moduleService.name, payment.metaData.docId, payment);
				promises.push(updatePayment);
			});
			$scope.moduleService.$q.all(promises).then(function (responses) {				
				var listCaseIds = [];
				angular.forEach(responses, function(response){
					listCaseIds.push(response.referenceInfo.caseId);
				});
				var submitDetail = {};
				submitDetail.agentInfors = {};
				var selectedProfile = JSON.parse(localStorage.getItem("selected_profile"));				
				submitDetail.agentInfors.agentId = selectedProfile.pasId;
				submitDetail.caseIds = listCaseIds;
                $scope.moduleService.submit(submitDetail).then(function(data){
                	if(data != null) {
                		$scope.moduleService.result = data;
                        commonUIService.showNotifyMessage('v4.user.message.paymentSuccessful', 'success');
                        $scope.moduleService.passStep1Payment = false;
                        $rootScope.$broadcast('resetListPayment');
           			 	$rootScope.$broadcast('updateListViewScreen');
	           			$timeout(function() {
	           				$scope.denyDuplicatePayments = true;
	           			}, 300)
           			 	
                	} else {
                		commonUIService.showNotifyMessage('v4.user.message.paymentUnsuccessful', 'fail');
                		$scope.denyDuplicatePayments = true;
                	}	
                });
               
			});
			
		} 
	};

	$scope.buildSearchQuery = function(searchProduct,searchCurrency, searchFields) {
		var searchQuery = [];
		var searchTexts = [];
		if(searchProduct == 'ALL') {
			searchProduct = undefined;
		}
		if(searchCurrency == 'ALL') {
			searchCurrency = undefined;
		}
		if ((commonService.hasValueNotEmpty(searchProduct) || commonService.hasValueNotEmpty(searchCurrency)) &&
			commonService.hasValueNotEmpty(searchFields)) {
			searchTexts.push(searchProduct);
			searchTexts.push(searchCurrency);
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
		if(commonService.hasValueNotEmpty(dateFromValue.value) && commonService.hasValueNotEmpty(dateToValue.value)) {
			fieldName = fieldName + ":rangeDate:" + Intl.DateTimeFormat().resolvedOptions().timeZone;
			searchQuery.push({fields:[fieldName], values:[dateFromValue.value, dateToValue.value]});
		}		
		return searchQuery;
	};
	
	$scope.showPaymentDetail = function(index, payment){
		var caret = angular.element("#endorse-submenu-caret-" + index);
		caret.toggleClass("rotate-caret");		
		payment.isShow = !payment.isShow;
	};
	
	$scope.selectAll = function(){
		if($scope.a.isSelectAll == true){
			//$scope.totalPayableAmount = "0.00";
			for (var i=0; i< $scope.pendingPaymentList.length; i++){
				if($scope.pendingPaymentList[i].isCheck == false) {
					$scope.pendingPaymentList[i].isCheck = true;
					$scope.paymentChecked.push($scope.pendingPaymentList[i]);				
					if($scope.pendingPaymentList[i].paymentinfo.paymentAmount.paidAmount.paidValue && $scope.pendingPaymentList[i].paymentinfo.paymentAmount.paidAmount.paidValue != 0)
						$scope.totalPayableAmount = (parseFloat($scope.totalPayableAmount.replace(/,/g, "")) + $scope.pendingPaymentList[i].paymentinfo.paymentAmount.paidAmount.paidValue).toFixed(2);	
				}
			}
			$scope.TotalPayableAmountCurrency = $scope.pendingPaymentList[0].referenceInfo.contractCurrency;
		}else{
			$scope.TotalPayableAmountCurrency = undefined;
			for (var i=0; i< $scope.pendingPaymentList.length; i++){
				$scope.paymentChecked = [];
				if($scope.pendingPaymentList[i].paymentinfo.paymentAmount.paidAmount.paidValue && $scope.pendingPaymentList[i].isCheck == true && $scope.pendingPaymentList[i].paymentinfo.paymentAmount.paidAmount.paidValue != 0)
					$scope.totalPayableAmount = (parseFloat($scope.totalPayableAmount.replace(/,/g, "")) - $scope.pendingPaymentList[i].paymentinfo.paymentAmount.paidAmount.paidValue).toFixed(2);
				$scope.pendingPaymentList[i].isCheck = false;
								
			}
		}		
	}
	
	$scope.toggleSelection=function(payment){
		var index = $scope.idChecked.indexOf(payment.id);		
		if(payment.isCheck == true){
			$scope.totalPayableAmount = (parseFloat($scope.totalPayableAmount.replace(/,/g, "")) + payment.paymentinfo.paymentAmount.paidAmount.paidValue).toFixed(2);
			$scope.paymentChecked.push(payment);
			$scope.idChecked.push(payment.id);
		}else{
			$scope.totalPayableAmount = (parseFloat($scope.totalPayableAmount.replace(/,/g, "")) - payment.paymentinfo.paymentAmount.paidAmount.paidValue).toFixed(2);
			$scope.idChecked.splice(index, 1);
			$scope.paymentChecked.splice(index, 1);
		}
		if($scope.paymentChecked.length == 0) {
			$scope.a.isSelectAll = false;
		}
		if (payment.isCheck) {
			$scope.TotalPayableAmountCurrency = payment.referenceInfo.contractCurrency;
		} else {
			$scope.TotalPayableAmountCurrency = undefined;
		}
		
	};
	
	$scope.showPaymentInformation = false;
	$scope.processToPayment = function processToPayment(){
		$scope.showPaymentInformation = false;
		if($scope.paymentChecked.length){
			$scope.currency = $scope.paymentChecked[0].referenceInfo.contractCurrency;
			if($scope.moduleService.paymentBasic){
				$scope.paymentBasis = false;
				if($scope.moduleService.paymentMethod == commonService.CONSTANTS.PAYMENT_METHOD.CREDIT_CARD){
					commonUIService.showNotifyMessage("Current payment method isn't supported");
				}else{	
					/*$scope.setVisibleCard("transaction:Step2_PaymentInformation", true);*/
    				/*$scope.setVisibleCard("transaction:Step3_Finish", false);*/
    				/*$scope.moveToCard("transaction:Step2_PaymentInformation");*/
    				//$scope.moduleService.passStep1Payment = true;    
    				//$scope.showPaymentInformation = true;
					$scope.denyDuplicatePayments = false;
					$scope.doRealPayment();
				}
			}else{
				$scope.paymentBasis = true;
			}
		}		
		if(!$scope.paymentChecked.length){
			commonUIService.showNotifyMessage('v3.transactioncenter.message.NoPaymentSelected');			
		}		
	}	
	
	$scope.showPaymentInformationViaMethod = function showPaymentInformationViaMethod() {
		$scope.showPaymentInformation = false;
	}
}];