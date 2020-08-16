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
var FnaDetailCtrl = [
		'$scope',
		'$log',
		'$q',
		'$stateParams',
		'$mdToast',
		'$injector',
		'$location',
		'$filter',
		'commonService',
		'commonUIService',
		'fnaCoreService',
		'salecaseCoreService',
		'AclService',
		'$translate',
		'$timeout',
		'$mdDialog',
		function($scope, $log, $q, $stateParams, $mdToast, $injector,
				$location, $filter, commonService, commonUIService,
				fnaCoreService, salecaseCoreService, AclService, $translate,
				$timeout, $mdDialog) {

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
				$scope.ctrlName = genCtrlName('detail',
						commonService.CONSTANTS.MODULE_NAME.FNA);
				$scope.moduleService = fnaCoreService;
				$scope.moduleService.freeze = false;
				$scope.yestopass = [ {
					"key" : "Y",
					"group" : null,
					"$$hashKey" : "object:390",
					"translate" : "Yes"
				}, {
					"key" : "N",
					"group" : null,
					"$$hashKey" : "object:391",
					"translate" : "No"
				} ]
				$scope.lazyChoiceListName = "BusinessIndustry,RaceInformation,Education,Title,Gender,Occupation,MaritalStatus,IDType,Country,YesNo,SmokerStatus,EmploymentStatus,NatureOfBusiness,DiplomaQualification,WorkingExperience,FinanceRelatedQualifications,SourceOfFund,AddressType,ProtectionUponDeath,Institution,Transaction,NatureOfWork,Ordinal,PurposeSaving,PolicyType,Company,PremiumType,RelationshipToClient";
				// commonUIService.setupAclForDetail(AclService,
				// [$stateParams.userRole]);
				$scope.setupStuffs().then(
						function() {
							$scope.setupActionBar(
									$scope.moduleService.actionBar, undefined,
									$scope);
						});
				$scope.$filter = $filter;
				$scope.ownerName = localStorage.getItem("username");
			};

			$scope.setupInitialData = function() {
			};

			/** *********************************************************************************** */
			/**
			 * ****************************** End lifecycle methods
			 * ******************************
			 */
			/** *********************************************************************************** */

			/**
			 * validate -> compute FNA
			 */
			$scope.computeFNA = function() {
				var self = this;
				var deferred = self.moduleService.$q.defer();
				$scope
						.validateDetail()
						.then(
								function(validatedData) {
									if (commonService
											.hasValueNotEmpty(validatedData.documentError)) { // not
																								// pass
																								// all
																								// validation
																								// rule
										// commonUIService.showNotifyMessage('v4.user.error.inputValidateFail');
										deferred.resolve("fail");
									} else {
										$scope.computeDetail().then(function() {
											deferred.resolve("success");
										});
									}
								});
				return deferred.promise;
			}

			/**
			 * compute -> save FNA
			 */
			$scope.saveFNA = function() {
				$scope.computeFNA().then(function(data) {
					if (data == "fail") {
						var question = 'MSG-FQ06';
						commonUIService.showYesNoDialog(question, function() {
							$scope.saveDetail(false);
						});
					}
					if (data == "success") {
						$scope.saveDetail(false);
					}
				})
			}

			$scope.autoPopulatedOutcomeCKA = function(detail) {
				var isDiplomaOrHigher = detail.isDiplomaOrHigher.value;
				var professionalQualification = detail.professionalQualification.value;
				var isInvestCIS = detail.isInvestCIS.value;
				var isWorkExperience = detail.isWorkExperience.value;

				if ((isDiplomaOrHigher == "Y")
						|| (professionalQualification == "Y")
						|| (isInvestCIS == "Y") || (isWorkExperience == "Y")) {
					detail.isExperienceCIS.value = "Y";
					return;
				}

				if ((isDiplomaOrHigher == "N")
						&& (professionalQualification == "N")
						&& (isInvestCIS == "N") && (isWorkExperience == "N")) {
					detail.isExperienceCIS.value = "N";
				}
			}

			/**
			 * Clear a data in Client/ Joint Applicant Card
			 */
			$scope.removeCard = function removeCard(i18nMessage, type) {
				var self = this;
				if (type === "client"
						&& commonService.hasValueNotEmpty(self.moduleService
								.findElementInDetail([ 'jointApplicant',
										'refContact', 'refDocName' ]).value)) {
					commonUIService.showNotifyMessage('MSG-20-002', 'failed')
					return;
				}
				function removeDetail() {
					// get new data model -> set into current detail (in order
					// to get default value)
					var getDataModel = self.moduleService.initDocument(
							self.requestURL, self.moduleService.name,
							self.moduleService.productName, '', '',
							self.moduleService.businessLine);
					// get uiModel
					var getUIModel = self.moduleService.getUIModel(
							self.moduleService.name,
							self.moduleService.businessLine);
					var promises = [];
					promises.push(getDataModel);
					promises.push(getUIModel);
					self.moduleService.$q
							.all(promises)
							.then(
									function(responses) {
										if (responses
												&& self.moduleService
														.isSuccess(responses[0])) {
											self.moduleService
													.convertDataModel2UiModel(
															responses[0],
															responses[1]);

											var partialModel = self.moduleService
													.findElementInElement(
															responses[0],
															[ type ]);
											self.moduleService.detail[type] = angular
													.copy(partialModel);
											self.refreshDetail();
										}
									})

					self.closeChildCards(self.card.level);
				}
				if (i18nMessage) {
					commonUIService.showYesNoDialog($translate
							.instant(i18nMessage), removeDetail);
				} else {
					removeDetail();
				}
			};

			/**
			 * Refresh slider for reset position on UI
			 */
			$scope.setSlider = function() {
				$timeout(function() {
					$scope.$broadcast('reCalcViewDimensions');
				}, 2000);
			}

			// $scope.planAdded = false;
			$scope.setupExistingPlan = function(hasExistingPlan, isClient) {
				var self = this;

				if (isClient) {
					var existingPlan = self.moduleService.findElementInDetail([
							'client', 'baseContact', 'currentPosition',
							'existingPlans', 'existingPlans' ]);
				} else {
					var existingPlan = self.moduleService.findElementInDetail([
							'jointApplicant', 'baseContact', 'currentPosition',
							'existingPlans', 'existingPlans' ]);

				}

				if (hasExistingPlan !== 'Y' && existingPlan.meta.counter > 0) {
					var question = "v3.mynewworkspace.message.AreYouSureToRemoveTheCurrentExistingPlan";

					commonUIService
							.showYesNoDialog(
									question,
									function() {
										self.moduleService
												.removeAllChildrenInParentEleWithCounter(
														existingPlan, 'value');
										self.closeChildCards(2);
										self
												.reSetupConcreteUiStructure(
														self.moduleService.detail,
														commonService.CONSTANTS.UI_STRUCTURE.REMOVE_TEMPLATE_CHILDREN,
														commonService.CONSTANTS.UI_STRUCTURE.EXPECTED_DETAIL_CHANGED);
									},
									function() {
										self.moduleService
												.findElementInDetail([
														'existingPlans',
														'planDeclaration',
														'hasExistingPlan' ]).value = 'Y';
										self.closeChildCards(2);
									})
				}
			}

			/**
			 * Show/Hide the Goal in Goals Analysis section base on Goal
			 * Selection
			 */
			$scope.isVisibleGoal = function(clientPriority) {
				if (clientPriority != null && clientPriority != 'NR') {
					return true;
				}
				return false;
			};

			/**
			 * populate client / joint applicant name into ownerName in Existing
			 * plan tile
			 * 
			 * @clientType = 'client' || 'jointApplicant'
			 */
			$scope.populateOwnerInExistingPlanTile = function(clientType) {
				var self = this;
				var ownerName = self.moduleService.findElementInDetail([
						clientType, 'baseContact', 'currentPosition',
						'existingPlans', 'existingPlans', 'value' ]);

				ownerName.forEach(function(plan) {
					plan.owner.value = self.moduleService.findElementInDetail([
							clientType, 'refContact', 'full' ]).value;
				})

				return self.refreshDetail();
			}
			// Add and Remove Dependants //
			$scope.addElderlyDependant = function(card,uiElement) {
				$scope.moduleService.addChildEleToParentEleWithCounter(uiElement.refDetail,'value');
				card.validStatus = 'INVALID';
			}

			$scope.removeElderlyDependant = function(card,uiElement,index) {
				$scope.moduleService.removeChildEleToParentEleWithCounter(index, uiElement.refDetail,'value');
				if(uiElement.refDetail.meta.counter == 0){
					card.validStatus = 'VALID';
				}
			}
			$scope.addChildrenDepedant = function(card,uiElement) {
				$scope.moduleService.addChildEleToParentEleWithCounter(uiElement.refDetail,'value');
				card.validStatus = 'INVALID';
			}

			$scope.removeChildrenDepedant = function(card,uiElement,index) {
				$scope.moduleService.removeChildEleToParentEleWithCounter(index, uiElement.refDetail,'value');
				if(uiElement.refDetail.meta.counter == 0){
					card.validStatus = 'VALID';
				}
			}
			
			// =============================================================================================//
			// ============================Start GET LIST and IMPORT Contact
			// Into FNA========================//
			// =============================================================================================//
			/**
			 * Get list contact was been imported in Children Dependant Tile and
			 * exclude contact was imported in Education Fund
			 */
			$scope.getListContactForEducationTile = function() {
				var self = this;
				var listContactInChildren = excludeEmptyNode(self.moduleService
						.findElementInDetail([ 'client', 'dependants',
								'children' ]).value);
				var listContactInEducation = excludeEmptyNode(self.moduleService
						.findElementInDetail([ 'client', 'baseContact',
								'analysisGoal', 'educationFund', 'children' ]).value);
				var result = [];
				$scope.msg = undefined;
				$scope.contactListForEducationTile = undefined;

				function excludeEmptyNode(contactList) {
					var tempArr = [];
					if (contactList.length !== 0 && contactList) {
						for (var i = 0; i < contactList.length; i++) {
							if (commonService
									.hasValueNotEmpty(contactList[i].refContact.refDocName.value)) {
								// contactList.splice(i,1);
								tempArr.push(contactList[i]);
							}
						}
					}
					return tempArr;
				}

				if (!commonService.hasValueNotEmpty(listContactInChildren)) {
					$scope.msg = 'There is no data.';
				} else {
					result = angular.copy(listContactInChildren);
					if (commonService.hasValueNotEmpty(listContactInEducation)) {
						for (var i = 0; i < listContactInChildren.length; i++) {
							for (var j = 0; j < listContactInEducation.length; j++) {
								if (self.moduleService.findElementInElement(
										listContactInChildren[i], [
												'refContact', 'refDocName' ]).value === self.moduleService
										.findElementInElement(
												listContactInEducation[j], [
														'refContact',
														'refDocName' ]).value) {
									result.splice(i, 1);
								}
							}
						}
					}
				}
				if (commonService.hasValueNotEmpty(result)) {
					$scope.contactListForEducationTile = result;
				} else {
					$scope.msg = 'There is no data.';
				}
			}

			/**
			 * call API
			 * 
			 * @params type=elderly || children
			 */
			$scope.populateContactInfoIntoDependant = function(type, item,
					$event, index) {
				var self = this;
				var deferred = self.moduleService.$q.defer();

				$scope
						.importContactIntoFNA(type, item.docNameTemp.value,
								$event, index, false)
						.then(
								function() {
									if (type === 'children') {
										self
												.computeTag(
														[ 'DEPENDANTS_CHILDREN_TILE' ],
														false, 'Children', [],
														index)
												.then(
														function(data) {
															$scope
																	.getListContactForDependant();
														});
									} else {
										self
												.computeTag(
														[ 'DEPENDANTS_ELDERLY_TILE' ],
														false, 'Elderly', [],
														index)
												.then(
														function(data) {
															$scope
																	.getListContactForDependant();
														});
									}
								});
				return deferred.promise;
			}

			/**
			 * get contact list for dependant
			 */
			$scope.getListContactForDependant = function() {
				var self = this;
				$scope.contactListForDependant = [];

				var promise = $scope.getContactList(); // list contact excluded
														// clien + joint
														// applicant

				promise
						.then(function(contactList) {
							if (commonService.hasValueNotEmpty(contactList)) {

								var arrChildren = self.moduleService
										.findElementInDetail([
												'childrenObject', 'children' ]).value;
								var arrElderly = self.moduleService
										.findElementInDetail([ 'elderlyObject',
												'elderlyDependants' ]).value;
								var arrDependent = arrChildren
										.concat(arrElderly);

								if (commonService
										.hasValueNotEmpty(arrDependent)) {
									contactList
											.forEach(function(contact) {
												var flag = false;
												for (var i = 0; i < arrDependent.length; i++) {
													if (contact.docName === arrDependent[i].refContact.refDocName.value) {
														flag = true;
														break;
													}
												}
												if (!flag) {
													$scope.contactListForDependant
															.push(contact);
												}
											})
								} else {
									$scope.contactListForDependant = contactList;
								}
							}
						})
			}

			/**
			 * Import contact into Education Fund Tile type = clientEducation ||
			 * jointEducation
			 */
			$scope.importContactIntoEducationFund = function(card, type,
					contactDocname, contactAge, $event, index) {
				var self = this;
				if (type === 'fna:Client') {
					type = 'clientEducation';
					var node = 'client';
				} else {
					type = 'jointEducation';
					var node = 'jointApplicant';
				}
				$scope
						.addCard(card)
						.then(
								function() { // clone educationFund node
												// (with card = actionCard)
									// reset birthDate before importing
									var child = self.moduleService
											.findElementInDetail([ node,
													'baseContact',
													'analysisGoal',
													'educationFund',
													'children', 'value' ])[index];
									if (child.refContact.birthDate.value == "")
										child.refContact.birthDate.value = null;

									self
											.importContactIntoFNA(type,
													contactDocname, $event,
													index, true)
											.then(
													function(data) { // call
																		// API
																		// import
														self
																.closeChildCards(self.card.level);
														self.moduleService
																.findElementInDetail([
																		node,
																		'baseContact',
																		'analysisGoal',
																		'educationFund',
																		'children',
																		'value' ])[index].currentAge.value = contactAge; // populate
																															// age
																															// from
																															// children
																															// dependant
																															// to
																															// education
																															// fund
													});
								});
			}

			/**
			 * Import contact into FNA Type: client / joint / children /
			 * elderlyDependant When type = client, fna docType not yet save ->
			 * call API import Client -> backend will import contact into FNA ->
			 * save FNA type = client & joint -> index = undefined type =
			 * children & elderlyDependant -> index = 2 ( <- example )
			 */
			$scope.importContactIntoFNA = function(type, contactDocName,
					$event, index, isNeedRefresh) {
				var self = this;
				return fnaCoreService
						.importContactIntoFNA(type, contactDocName, index)
						.then(
								function(data) {
									if (self.moduleService.isSuccess(data)) {

										// only update docId to URL when old URL
										// didn't have docId
										var oldSearch = $location.search();
										if (!commonService
												.hasValueNotEmpty(oldSearch.docId)) {
											$location
													.search(angular
															.extend(
																	{},
																	oldSearch,
																	{
																		docId : self.moduleService.detail.id
																	}));
										}
										/*
										 * self.moduleService.detail = data;
										 * self.moduleService.originalDetail =
										 * angular.copy(data);
										 */

										self
												.reSetupConcreteUiStructure(
														self.moduleService.detail,
														commonService.CONSTANTS.UI_STRUCTURE.NOT_REMOVE_TEMPLATE_CHILDREN,
														commonService.CONSTANTS.UI_STRUCTURE.EXPECTED_DETAIL_CHANGED);

										if (type === 'client'
												|| type === 'joint') {
											self
													.closeChildCards(self.card.level);
										}

										commonUIService.showNotifyMessage(
												"Import Successfully",
												'success');
										if (isNeedRefresh === true)
											return self.refreshDetail(true);
										else
											return self.moduleService.detail;
										// return self.refreshDetail();
									} else {
										commonUIService.showNotifyMessage(
												"v4.fna.message.import." + type
														+ ".unsuccessfully",
												"failed");
										return self.moduleService.$q.reject();
									}
								});

			};

			/**
			 * Get contact list exclude client Id and Joint Applicant Id
			 */
			$scope.getContactList = function() {
				var self = this;
				var deferred = self.moduleService.$q.defer();

				var clientDocName = $scope.moduleService.findElementInDetail([
						'client', 'refContact', 'refDocName' ]).value;
				var jointDocName = $scope.moduleService.findElementInDetail([
						'jointApplicant', 'refContact', 'refDocName' ]).value;

				var promise = $scope.searchContact(); // get contact list from
														// backend

				promise.then(function(contactList) {
					if (commonService.hasValueNotEmpty(clientDocName)) {
						contactList = excludeContactInContactList(contactList,
								clientDocName); // exclude client Id
					}
					if (commonService.hasValueNotEmpty(jointDocName)) {
						contactList = excludeContactInContactList(contactList,
								jointDocName); // exclude joint applicant Id
					}
					if (commonService.hasValueNotEmpty(contactList)) {
						$scope.contactList = contactList;
						deferred.resolve(contactList);
					} else {
						$scope.msg = 'There is no data.';
						$scope.contactList = contactList;
						deferred.resolve();
					}
				})

				return deferred.promise;
			}

			/**
			 * Exclude 1 contact in contact list by DocName
			 */
			function excludeContactInContactList(contactList, docName) {
				var tempArr = [];
				contactList.forEach(function(contact) {
					if (contact.docName !== docName) {
						tempArr.push(contact);
					}
				})
				return tempArr;
			}

			/**
			 * Get list contact data from Backend
			 */
			$scope.searchContact = function() {
				var self = this;
				var deferred = self.moduleService.$q.defer();
				var searchParams = {
					page : 0,
					size : $scope.pageSize
				};
				var defaultquery = [ {
					"fields" : [ "metaData.ownerName" ],
					"values" : [ $scope.ownerName ]
				}, {
					"fields" : [ "metaData.documentStatus" ],
					"values" : [ "VALID" ]
				}, {
					"fields" : [ "contactType" ],
					"values" : [ "INDIVIDUAL" ]
				} ];

				self.moduleService.searchDocument(undefined, 'contact',
						defaultquery, searchParams).then(function(data) {
					if (commonService.hasValueNotEmpty(data)) {
						if (data._embedded) { // system has at least 1 contact
							deferred.resolve(data._embedded.metaDatas);
						} else {
							$scope.msg = 'There is no data.';
							deferred.resolve();
						}
					} else {
						$scope.msg = 'There is no data.';
						deferred.resolve();
					}
				});

				return deferred.promise;
			}
			// ===========================================================================================//
			// ============================End GET LIST and IMPORT Contact For
			// FNA========================//
			// ===========================================================================================//

			$scope.updateIncome4Retirement = function(data, isClient) {
				var self = this;
				if (isClient)
					self.moduleService.findElementInDetail([ 'client',
							'baseContact', 'analysisGoal', 'retirementFund',
							'currentAnnualIncome' ]).value = data;
				else
					self.moduleService.findElementInDetail([ 'jointApplicant',
							'baseContact', 'analysisGoal', 'retirementFund',
							'currentAnnualIncome' ]).value = data;
			}

			/**
			 * Clear Ranking's value when Client Priority is Not Required
			 */
			$scope.updateRanking = function(detail) {
				var clientPriority = detail.clientPriority.value;
				if (clientPriority == 'NR') {
					detail.ranking.value = "";
				}
			}

		} ];

var ListImportContact = [
		'$scope',
		'$log',
		'$q',
		'$stateParams',
		'$mdToast',
		'$injector',
		'$location',
		'$filter',
		'commonService',
		'commonUIService',
		'fnaCoreService',
		'salecaseCoreService',
		'AclService',
		'loadingBarService',
		'$timeout',
		function($scope, $log, $q, $stateParams, $mdToast, $injector,
				$location, $filter, commonService, commonUIService,
				fnaCoreService, salecaseCoreService, AclService,
				loadingBarService, $timeout) {

			/**
			 * Import contact into FNA base on card's name Client / Joint
			 * Applicant Type: client / joint
			 */

			this.$onInit = function() {
				// init Type search
				$scope.currentState = "fna";
			}

			$scope.importClientJointApplicant = function(card, contactDocName,
					$event, isNeedRefresh) {
				var type = undefined;
				if (card.name === 'fna:ImportJointApplicant') {
					type = 'joint';
				}
				if (card.name === 'fna:ImportClient') {
					type = 'client';
				}
				$scope.importContactIntoFNA(type, contactDocName, $event,
						undefined, isNeedRefresh).then(function(data) {
					if (data) {
						// wait for ui stable and open data after import
						$timeout(function() {
							if (type == 'client') {
								$scope.moveToCard('fna:Client');
							} else if (type == 'joint') {
								$scope.moveToCard('fna:JointApplicant');
							}
						}, 200);
					}
				});
			};

			
		} ];
