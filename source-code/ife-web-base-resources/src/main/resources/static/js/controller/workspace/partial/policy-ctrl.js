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
var PolicyDetailCtrl = [
		'$scope',
		'$log',
		'$stateParams',
		'$mdToast',
		'$injector',
		'$location',
		'$mdDialog',
		'$filter',
		'commonService',
		'commonUIService',
		'policyCoreService',
		'quotationCoreService',
		'resourceReaderService',
		'loadingBarService',
		'detailCoreService',
		'AclService',
		'$rootScope',
		function($scope, $log, $stateParams, $mdToast, $injector, $location,
				$mdDialog, $filter, commonService, commonUIService,
				policyCoreService, quotationCoreService, resourceReaderService,loadingBarService,
				detailCoreService, AclService, $rootScope) {

			/** *********************************************************************************** */
			/**
			 * ****************************** Begin lifecycle methods
			 * ****************************
			 */
			/** *********************************************************************************** */

			$injector.invoke(BaseDetailCtrl, this, {
				$scope : $scope,
				$log : $log,
				$stateParams : $stateParams,
				$location : $location,
				commonService : commonService,
				commonUIService : commonUIService
			});

			this.$onInit = function() {
				loadingBarService.showLoadingBar();
				var cover = "";
				var shipment = "";
				var voyageFrom = "";
				var voyageTo = "";
				var packing = "";
				var conveyance = "";
				var commodity ="";
				$scope.namefile = [];
				$scope.document = [];
				$scope.$stateParams = $stateParams;
				$scope.isDeclaration = $scope.$stateParams.isDeclaration === "true" ? true
						: false;
				$scope.ctrlName = genCtrlName('detail',
						commonService.CONSTANTS.MODULE_NAME.POLICY);
				$scope.moduleService = policyCoreService;
				$scope.resourceReaderService = resourceReaderService;
				$scope.detailCoreService = detailCoreService;
				$scope.moduleService.freeze = false;
				$scope.moduleService.currFromDate = $scope.$stateParams.currFromDate;
				$scope.moduleService.lineOfBusiness = $scope.$stateParams.lineOfBusiness;
				$scope.moduleService.docId = $scope.$stateParams.docId;
				$scope.moduleService.productId=$stateParams.policyId;
				$scope.moduleService.productName = $scope.$stateParams.productName;
				$scope.$filter = $filter;
				if(JSON.parse(localStorage.getItem("selected_profile"))!=null){
				if(JSON.parse(localStorage.getItem("selected_profile")).role!=null){
					$scope.agentId=JSON.parse(localStorage.getItem("selected_profile")).role=="AG"?JSON.parse(localStorage.getItem("selected_profile")).pasId:JSON.parse(localStorage.getItem("selected_profile")).policyId;
					policyCoreService.getPolicyDetailNew($stateParams.policyId,$stateParams.currFromDate,$scope.agentId)
					.then(
							function(data) {
								if(data=="N"){
							   $scope.verify=false;		
									
									commonUIService
									.showNotifyMessage('v3.mynewworkspace.policylist.label.fail');
									loadingBarService.hideLoadingBar();
								}else{
								policyCoreService
								.getDocumentList($stateParams.policyId,data.data.metaDatas[0].polTranno)
								.then(function(data1){
									
									$scope.itemDoument = data1;
									$scope.moduleService.documentlist = data1.data.metaDatas;
								});
								$scope.verify=true;
								$scope.item = data;
								$scope.moduleService.detail = data;
								$scope.moduleService.tranNo=data.data.metaDatas[0].polTranno;
								loadingBarService.showLoadingBar();
								if ($scope.item.data.metaDatas[0].polCnttype == "OCP") {
									if ($scope.item.data.metaDatas[0].mocCoverage.length > 0) {
										for (var i = 0; i < $scope.item.data.metaDatas[0].mocCoverage.length; i++) {
											cover += $scope.item.data.metaDatas[0].mocCoverage[i].mocCoverageDesc;
											if (i != $scope.item.data.metaDatas[0].mocCoverage.length - 1) {
												cover += ", ";
											}
										}
									} else {
										cover = "";
									}
									if ($scope.item.data.metaDatas[0].mocShipment.length > 0) {
										for (var i = 0; i < $scope.item.data.metaDatas[0].mocShipment.length; i++) {
											shipment += $scope.item.data.metaDatas[0].mocShipment[i].mocShipDesc;
											if (i != $scope.item.data.metaDatas[0].mocShipment.length - 1) {
												shipment += ", ";
											}
										}
									} else {
										shipment = "";
									}
									if ($scope.item.data.metaDatas[0].voyageFrom.length > 0) {
										for (var i = 0; i < $scope.item.data.metaDatas[0].voyageFrom.length; i++) {
											voyageFrom += $scope.item.data.metaDatas[0].voyageFrom[i].mocVoyFromDesc;
											if (i != $scope.item.data.metaDatas[0].voyageFrom.length - 1) {
												voyageFrom += ", ";
											}
										}
									} else {
										voyageFrom = "";
									}
									if ($scope.item.data.metaDatas[0].voyageTo.length > 0) {
										for (var i = 0; i < $scope.item.data.metaDatas[0].voyageTo.length; i++) {
											voyageTo += $scope.item.data.metaDatas[0].voyageTo[i].mocVoyToDesc;
											if (i != $scope.item.data.metaDatas[0].voyageTo.length - 1) {
												voyageTo += ", ";
											}
										}
									} else {
										voyageTo = "";
									}
									if ($scope.item.data.metaDatas[0].mocPacking.length > 0) {
										for (var i = 0; i < $scope.item.data.metaDatas[0].mocPacking.length ; i++) {
											packing += $scope.item.data.metaDatas[0].mocPacking[i].mocPackDesc;
											if (i != $scope.item.data.metaDatas[0].mocPacking.length - 1) {
												packing += ", ";
											}
										}
									} else {
										packing = "";
									}
									if ($scope.item.data.metaDatas[0].mocCoveyance.length > 0) {
										  $scope.conveyanceList=$scope.item.data.metaDatas[0].mocCoveyance;
										for (var i = 0; i < $scope.item.data.metaDatas[0].mocCoveyance.length; i++) {
											conveyance += $scope.item.data.metaDatas[0].mocCoveyance[i].mocConveyanceDesc;
											if (i != $scope.item.data.metaDatas[0].mocCoveyance.length  - 1) {
												conveyance += ", ";
											}
										}
									} else {
										conveyance = "";
									}
									if ($scope.item.data.metaDatas[0].mocComodity.length > 0) {
										  $scope.comodityList=$scope.item.data.metaDatas[0].mocComodity;
										for (var i = 0; i < $scope.item.data.metaDatas[0].mocComodity.length; i++) {
											commodity += $scope.item.data.metaDatas[0].mocComodity[i].mocCmdtyDesc;
											if (i != $scope.item.data.metaDatas[0].mocComodity.length  - 1) {
												commodity += ", ";
											}
										}
									} else {
										commodity = "";
									}
								}
								$scope.commodity=commodity;
								$scope.cover = cover;
								$scope.shipment = shipment;
								$scope.voyageFrom = voyageFrom;
								$scope.voyageTo = voyageTo;
								$scope.packing = packing;
								$scope.conveyance = conveyance;
								
								$scope.setupStuffs().then(
										function() {
											$scope.setupActionBar(
													$scope.moduleService.actionBar, undefined,
													$scope);
										});
								
								}
								loadingBarService.hideLoadingBar();
								
							
							
							});
				}else{
					commonUIService
					.showNotifyMessage("Not Found");
				}
				}else{
					commonUIService
					.showNotifyMessage("Not Found");
				}
				
			
			};
				    $scope.sendEmail = function($event) {
					if ($scope.namefile.length == 0) {
						commonUIService
								.showNotifyMessage('Please select document before sending email');
					} else {
						var scopeParent = $scope;
						$mdDialog
								.show({
									targetEvent : $event,
									templateUrl : resourceServerPath
											+ 'view/templates/mdDialog/can/emailDialog.html',
									controller : DialogController
								});
						function DialogController($scope, $mdDialog, $http) {
							var attachment = "";
							var documentlist = [];

							for (var i = 0; i < scopeParent.namefile.length; i++) {
								if (scopeParent.namefile[i] != "undefined"
										&& scopeParent.namefile[i] != 1) {
									attachment += scopeParent.namefile[i];

									if (i != scopeParent.namefile.length - 1) {
										attachment += ", ";
									}
								}
							}
							$scope.attachment = attachment;
							for (var i = 0; i < scopeParent.moduleService.documentlist.length; i++) {
								for (var j = 0; j < scopeParent.namefile.length; j++) {
									if (scopeParent.namefile[j] == scopeParent.moduleService.documentlist[i].type.description) {
										documentlist
												.push(scopeParent.moduleService.documentlist[i]);
									}
								}
							}
							var listdocument = [];
							for (var i = 0; i < documentlist.length; i++) {
								var itemData = {
									"id" : documentlist[i].id,
									"name" : documentlist[i].name,
									"path" : documentlist[i].path
								}
								listdocument.push(itemData);
							}
							$scope.cancelDialog = function() {
								$mdDialog.hide();
							}
							$scope.sendDialog = function() {
								var policyID = $stateParams.policyId;
								var arrEmail = [];
								var listEmail = [];
								var arrccEmail=[];
								var listccTo=[];
								
								if ($scope.email != undefined
										&& $scope.subject != undefined) {
									
									if($scope.ccto!= undefined){
										arrccEmail=$scope.ccto.split(";");
										for (var i = 0; i < arrccEmail.length; i++) {
											if (i == arrccEmail.length - 1
													&& arrccEmail[arrccEmail.length - 1] == "") {

											} else {
												listccTo.push(arrccEmail[i]);
											}
										}
									}
									arrEmail = $scope.email.split(";");
									
									for (var i = 0; i < arrEmail.length; i++) {
										if (i == arrEmail.length - 1
												&& arrEmail[arrEmail.length - 1] == "") {

										} else {
											listEmail.push(arrEmail[i]);
										}
									}

									var flat = false;
									var flatccTo= false;
									for (var i = 0; i < listEmail.length; i++) {
										if (!filterEmail(listEmail[i])) {
											flat = true;
											break;
										}

									}
									for (var i = 0; i < listccTo.length; i++) {
										if (!filterEmail(listccTo[i])) {
											flatccTo = true;
											break;
										}

									}
									if (flat == true || flatccTo == true ) {
										commonUIService
												.showNotifyMessage('v3.document.email.label.fail');
									} else if(flat == false && flatccTo == false) {
										policyCoreService
												.sendEmail(policyID, $scope.email,
														   $scope.ccto,
														$scope.subject,
														$scope.content,
														listdocument)
												.then(
														function() {

															
														})
														commonUIService
																	.showNotifyMessage(
																			'v3.mynewworkspace.email.label.success',
																			'success');
														$mdDialog.hide();
									}
									
								} else {
									commonUIService
											.showNotifyMessage('v3.mynewworkspace.email.label.fail');
								}
							}
						}
					}
				}
				function filterEmail(email) {
					var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
					return regex.test(email);
				}
				$scope.chooseDocument = function(data, content) {

					if (data == true) {

						$scope.namefile.push(content);

					} else {
						for (var i = 0; i < $scope.namefile.length; i++) {
							if ($scope.namefile[i] == content) {
								$scope.namefile.splice(i, 1);
							}
						}
					}

				}
				$scope.chooseFile = function(path) {
					var policyID = $stateParams.policyId;
					policyCoreService.getFILEDOCUMENT(path, policyID).then(
							function(data) {

								resourceReaderService.openFileReader(data,
										'view', true ,'');
							})
				}
			
			
			/**
			 * fix for ticket IGI-705 for project GE-Indonesia
			 * lpham24
			 */
			$scope.checkDisplayDocumenetWithRole = function(item){
				var selected_profile = JSON.parse( localStorage.getItem('selected_profile'));
				var role = selected_profile.role ;
				if(role == "PO" && item.name.includes("Intermediary")){
					return false
				}
				return true;
			}
			
		} ];