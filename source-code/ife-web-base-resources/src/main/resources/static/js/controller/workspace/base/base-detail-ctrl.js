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
var BaseDetailCtrl = ['$scope', '$log', '$stateParams', '$location', '$q', 'commonService', 'commonUIService',
	function($scope, $log, $stateParams, $location, $q, commonService, commonUIService) {

	$scope.setupStuffs = function(isLoadJsonMock,isIdBaseStateParam) {
		var self = this;		
		var deferred = self.moduleService.$q.defer();
		self.getDetail(isIdBaseStateParam).then(function(data) {
			if (self.moduleService.isSuccess(data)) {
				self.generalConfigCtrl(self.ctrlName, self.moduleService, isLoadJsonMock).then(function() {
					self.getComputeLazy().then(function () {
						
						if (self.evalRefDetail(self.uiStructureRoot)) {
							self.markValidStatus(self.uiStructureRoot);
						}
						
						if (self.setupInitialData && typeof self.setupInitialData === 'function') {
							self.setupInitialData();
						}
						deferred.resolve();
					});
				});
			} else {
				deferred.reject();
			}
		});
		return deferred.promise;
	};

	$scope.getDetail = function(isIdBaseStateParam) {
		var self = this;
		var deferred = self.moduleService.$q.defer();
		if (commonService.hasValueNotEmpty(self.moduleService.detail)) {
			deferred.resolve(self.moduleService.detail);
		} else {
			var getDataModel = undefined;
			var docId = undefined;
			if ($stateParams.docType === self.moduleService.name || isIdBaseStateParam) {
				docId = $stateParams.docId;
			} else if (self.moduleService.detail) {
				docId = self.moduleService.detail.id;
			}
			if (commonService.hasValueNotEmpty(docId) && self.moduleService.name !== 'systemadminreport') { //get existing detail
				if($stateParams.type) {
					getDataModel = self.moduleService.getDocumentWithType(self.requestURL, self.moduleService.name, docId, $stateParams.type, undefined, self.moduleService.businessLine, self.moduleService.productName);
				} else {
					if(self.moduleService.name == 'policy'){
						getDataModel = self.moduleService.getDocument(self.requestURL, self.moduleService.name, docId,undefined, self.moduleService.businessLine,self.moduleService.productName,'',self.moduleService.currFromDate,self.moduleService.lineOfBusiness);
					}else{
						getDataModel = self.moduleService.getDocument(self.requestURL, self.moduleService.name, docId, undefined, self.moduleService.businessLine, self.moduleService.productName);
					}
					
				}				
			} else { //create new detail
				if(self.moduleService.name === 'systemadminreport'){
					getDataModel = self.moduleService.initializeSAReport(self.requestURL, self.moduleService.name, "systemadmin@ipos.com");
				}
				else{
					getDataModel = self.moduleService.initializeDocument(self.requestURL, self.moduleService.name, self.moduleService.productName, '', '', self.moduleService.businessLine);
				}
			}
			if (self.moduleService.name === 'quotation' || self.moduleService.name === 'case' )
				{
					var getUIModel = self.moduleService.getUIModel(self.moduleService.name, self.moduleService.businessLine, self.moduleService.productName);
				}
			else{
			var getUIModel = self.moduleService.getUIModel(self.moduleService.name, self.moduleService.businessLine);}
			var promises = [];
			promises.push(getDataModel);
			promises.push(getUIModel);
			var docType = $stateParams.docType;
			self.moduleService.$q.all(promises).then(function (responses) {
				if (responses && self.moduleService.isSuccess(responses[0])) {
					self.moduleService.detail = responses[0];
					self.moduleService.convertDataModel2UiModel(self.moduleService.detail, responses[1]);
					
					//Eval mandatory by uiModel
					//Run before refresh.
					self.evalMandatory(self.moduleService.detail);
					
					// because we use only one 'contact' model for corporate & Individual => always get model with contactType = 'INDIVIDUAL' on first time
					// Have to update contactType before call the refresh.
					if(self.moduleService.name == 'contact' && docType == 'corporate') {
						self.moduleService.detail.contactType.value = "CORPORATE";
					} 
					if(self.moduleService.name != 'policy' && self.moduleService.name != 'systemadminreport'){
						self.moduleService.operateDocument(
								self.requestURL,
								self.moduleService.name,
								commonService.CONSTANTS.ACTION.REFRESH,
								undefined,
								self.moduleService.businessLine,
								self.moduleService.productName
							).then(function(postOpData) {
								if (self.moduleService.isSuccess(postOpData)) {
									self.moduleService.originalDetail = angular.copy(postOpData);
									if (self.postGetDetail && typeof self.postGetDetail === 'function') {
										self.postGetDetail();
									}
								}
								else {
									commonUIService.showNotifyMessage(responses[0].error, 'fail');
									deferred.reject();
								}
								deferred.resolve(postOpData);
							});
						} 
					else
						deferred.resolve(self.moduleService.detail);
					}
					
			});
		}
		return deferred.promise;
	};
	
	$scope.checkPdfExist = function (typePdf) {
		var result = false;
		if (this.salecaseCoreService.detail == undefined) return result;
		var attachments = this.salecaseCoreService.detail.attachments.value;
		for (var i = 1; i < attachments.length; i++)
			if (attachments[i].attachment.refBusinessType.value == typePdf)
			{
				result = true;
				break;
			}
		return result;
	}
	
	/**
	 * hle56
	 * Only get document Json, not assign into moduleService.detail
	 * @param : moduleService is service (salecaseCoreService, quotationCoreService, ...)
	 * @param : docId is document's id. if docId is null, we will init new model.
	 */
	$scope.getDocument = function (moduleService, docId) {
		var self = this;
		var deferred = moduleService.$q.defer();
		
		var getDataModel = undefined;
		if (commonService.hasValueNotEmpty(docId)) { //get existing document
			getDataModel = moduleService.getDocument(self.requestURL, moduleService.name, docId, false);
		} else { //create new detail
			getDataModel = moduleService.initializeDocument(self.requestURL, moduleService.name, '', '');
		}
		var getUIModel = moduleService.getUIModel(moduleService.name);
		var promises = [];
		promises.push(getDataModel);
		promises.push(getUIModel);
		moduleService.$q.all(promises).then(function (responses) {
			if (responses && moduleService.isSuccess(responses[0])) {
				moduleService.convertDataModel2UiModel(responses[0], responses[1]);
				
				//Eval mandatory by uiModel
				//Run before refresh.
				self.evalMandatory(responses[0]);
				
				deferred.resolve(responses[0]);
			} else {
				deferred.reject();
			}
		});
		return deferred.promise;
	}

	$scope.getComputeLazy = function() {
		var self = this;
		var deferred = self.moduleService.$q.defer();
		if (!commonService.hasValueNotEmpty(self.moduleService.lazyChoiceList) && self.lazyChoiceListName != undefined) {
			self.moduleService.getOptionsList(self.requestURL, self.lazyChoiceListName).then(function(data) {
				deferred.resolve(data);
			});
		} else {
			deferred.resolve();
		}
		return deferred.promise;
	};

	$scope.saveDetail = function(needValidate, isBypassCheckServiceNameandDoctype, showMessage) {
		var self = this;
		var deferred = self.moduleService.$q.defer();
		if(commonService.hasValueNotEmpty(self.moduleService.detail) && commonService.hasValueNotEmpty(self.moduleService.detail.metaData)){
			var data = JSON.parse(localStorage.selected_profile);
			var branch = data.pasBranch;
			var branchId = data.pasBranchId;
				if(data.role === "PO"){
					self.moduleService.detail.metaData.profileId.value = data.customerId;					
				}else{
					self.moduleService.detail.metaData.profileId.value = data.pasId;
				}
				self.moduleService.detail.metaData.branchName.value = branch;
				self.moduleService.detail.metaData.branchId.value = branchId;
				self.moduleService.detail.metaData.clientTimeZone.value = Intl.DateTimeFormat().resolvedOptions().timeZone;
		
		}
		var performSaveAction = function() {
			self.moduleService.saveDocument(self.requestURL, self.moduleService.name).then(function (data) {
				var promise = self.moduleService.$q.when(data);
				
				if (self.moduleService.isSuccess(data)) {
					promise = self.postSaveDetailOfBase(isBypassCheckServiceNameandDoctype);
				}
				
				promise.then(function () {
					if (self.postSaveDetail && typeof self.postSaveDetail === 'function') {
						self.postSaveDetail();
					}
					self.uiStructureRoot.isDetailChanged = false;
					self.reSetupConcreteUiStructure(
						self.moduleService.detail,
						commonService.CONSTANTS.UI_STRUCTURE.NOT_REMOVE_TEMPLATE_CHILDREN,
						commonService.CONSTANTS.UI_STRUCTURE.EXPECTED_DETAIL_NOT_CHANGED
					);
					
					if (self.evalRefDetail(self.uiStructureRoot)) {
						self.markValidStatus(self.uiStructureRoot);
					}
					if(showMessage !== false){
						if(self.moduleService.name == 'contact' && self.moduleService.detail.contactType.value == 'CORPORATE'){
							commonUIService.showNotifyMessage('v4.' + self.moduleService.detail.contactType.value + '.message.saveSuccessfully', 'success');
						}
						else {
							if(self.moduleService.name == 'quotation' && self.moduleService.detail.quotationType.value == 'UW_QUO')
								commonUIService.showNotifyMessage('v4.' + self.moduleService.detail.quotationType.value + '.message.saveSuccessfully', 'success');
							else
								commonUIService.showNotifyMessage('v4.' + self.moduleService.name + '.message.saveSuccessfully', 'success');	
						}
					}
					deferred.resolve(data);
				});
			});
			return deferred.promise;
		};
		
		if (needValidate) { //Need validate before save
			self.validateDetail().then(function(validatedData) {
				if (self.moduleService.isSuccess(validatedData)) {
					if (self.uiStructureRoot.validStatus === 'INVALID') {
						var question = 'MSG-FQ06';
						commonUIService.showYesNoDialog(question, function() {
							performSaveAction().then(function(savedData) {
								deferred.resolve(savedData);
							});
						}, function() {
							deferred.resolve(validatedData);
						});
					} else {
						performSaveAction().then(function(savedData) {
							deferred.resolve(savedData);
						});
					}
				} else {
					if(showMessage !== false){
					commonUIService.showNotifyMessage('v4.' + self.moduleService.name + '.message.saveUnsuccessfully');
					}
					deferred.resolve(validatedData);
				}
			});
		} else { //No need validate before save, save in draft
			performSaveAction().then(function(savedData) {
				deferred.resolve(savedData);
			});
		}
		return deferred.promise;
	};
	$scope.saveDetailWhenSearch = function(needValidate, isBypassCheckServiceNameandDoctype, showMessage) {
		var self = this;
		var deferred = self.moduleService.$q.defer();
		
		
			self.moduleService.saveDocument(self.requestURL, self.moduleService.name).then(function (data) {
				var promise = self.moduleService.$q.when(data);
				
				if (self.moduleService.isSuccess(data)) {
					promise = self.postSaveDetailOfBase(isBypassCheckServiceNameandDoctype);
				}
				
				
			});
			return deferred.promise;
		
		
		
	};
	$scope.saveDetailQuiet = function() {
		var self = this;
		var deferred = self.moduleService.$q.defer();
		
		self.moduleService.saveDocument(self.requestURL, self.moduleService.name).then(function success(data) {
			var promise = self.moduleService.$q.when(data);
			
			if (self.moduleService.isSuccess(data)) {
				promise = self.postSaveDetailOfBase();
			}
			
			promise.then(function () {
				if (self.postSaveDetail && typeof self.postSaveDetail === 'function') {
					self.postSaveDetail();
				}
				self.uiStructureRoot.isDetailChanged = false;
				self.reSetupConcreteUiStructure(
					self.moduleService.detail,
					commonService.CONSTANTS.UI_STRUCTURE.NOT_REMOVE_TEMPLATE_CHILDREN,
					commonService.CONSTANTS.UI_STRUCTURE.EXPECTED_DETAIL_NOT_CHANGED
				);
				if (self.evalRefDetail(self.uiStructureRoot)) {
					self.markValidStatus(self.uiStructureRoot);
				}
				deferred.resolve(data);
			});
		}, function fail(){
			deferred.reject();
		});
		
		return deferred.promise;
	};
	
	
	$scope.refreshDetail = function(resetUpUIStructure) {
		var self = this;
		var deferred = self.moduleService.$q.defer();
		self.moduleService.operateDocument(
			self.requestURL,
			self.moduleService.name,
			commonService.CONSTANTS.ACTION.REFRESH,
			undefined,
			self.moduleService.businessLine,
			self.moduleService.productName
		).then(function(data) {
			if (self.moduleService.isSuccess(data)) {
				if (self.postRefreshDetail && typeof self.postRefreshDetail === 'function') {
					self.postRefreshDetail();
				}
				if(resetUpUIStructure == true) {
					self.uiStructureRoot.isDetailChanged = false;
					self.reSetupConcreteUiStructure(
						self.moduleService.detail,
						commonService.CONSTANTS.UI_STRUCTURE.NOT_REMOVE_TEMPLATE_CHILDREN,
						commonService.CONSTANTS.UI_STRUCTURE.EXPECTED_DETAIL_NOT_CHANGED
					);
				}
			}
			deferred.resolve(data);
		});
		return deferred.promise;
	};
	
	$scope.validateDetail = function(accceptAction) {
		var self = this;
		var deferred = self.moduleService.$q.defer();
		self.validateDetailCommon(self.moduleService, accceptAction).then(function(data) {
			if (self.moduleService.isSuccess(data)) {
				self.moduleService.detail = data;
				self.manualValidateMandatory(self.moduleService.detail);
				
				if (self.postValidateDetail && typeof self.postValidateDetail === 'function') {
					self.postValidateDetail();
				}
				
				self.reSetupConcreteUiStructure(self.moduleService.detail,
						commonService.CONSTANTS.UI_STRUCTURE.NOT_REMOVE_TEMPLATE_CHILDREN);
			}
			deferred.resolve(data);
		});
		return deferred.promise;
	};
	
	$scope.evalMandatory = function evalMandatory(uiModel) {
		var self = this;
		for (var prop in uiModel) {
			if (uiModel.hasOwnProperty(prop)) {
				if (prop === "mandatory"){
					uiModel[prop] = self.$eval(uiModel[prop]) + "";
				} else if (typeof uiModel[prop] === 'object') {
					self.evalMandatory(uiModel[prop]);
				}
			}
		}
	};
	
	$scope.evalRefDetail = function evalRefDetail(uiStructure) {
		var self = this;
		var isEvalAnyField = false;
		
		if(uiStructure.objType === "ui-element" ) {
			if (uiStructure.hasOwnProperty("evalRefDetail") && uiStructure.evalRefDetail){
				uiStructure.refDetail = self.$eval(uiStructure.evalRefDetail);
				return true;
			}
		} else {
			for (var idx = 0; idx < uiStructure.children.length; idx++) {
				isEvalAnyField = self.evalRefDetail(uiStructure.children[idx]) || isEvalAnyField;
			}
			
			for (var idx = 0; idx < uiStructure.uiEle.length; idx++) {
				isEvalAnyField = self.evalRefDetail(uiStructure.uiEle[idx]) || isEvalAnyField;
			}
			
			return isEvalAnyField;
		}
	};
	
	$scope.manualValidateMandatory = function manualValidateMandatory(uiModel) {
		var self = this;
		for (var prop in uiModel) {
			if (uiModel.hasOwnProperty(prop)) {
				if (typeof uiModel[prop] === 'object') {
					if(uiModel[prop]){
						if(uiModel[prop].hasOwnProperty('value') && uiModel[prop].hasOwnProperty('meta')){
							if(!commonService.hasValueNotEmpty(uiModel[prop].meta.errorCode) 
									&& uiModel[prop].meta.mandatory === "true" 
									&& !commonService.hasValueNotEmpty(uiModel[prop].value)){
								uiModel[prop].meta.errorCode = 'MSG-C01';
							}
						} else {
							self.manualValidateMandatory(uiModel[prop]);
						}
					}
				}
			}
		}
	};

	$scope.computeDetail = function() {
		var self = this;
		var deferred = self.moduleService.$q.defer();
		self.moduleService.operateDocument(
			self.requestURL,
			self.moduleService.name,
			commonService.CONSTANTS.ACTION.COMPUTE,
			undefined,
			self.moduleService.businessLine,
			self.moduleService.productName,false
		).then(function(data) {
			if (self.moduleService.isSuccess(data)) {
				if (self.postComputeDetail && typeof self.postComputeDetail === 'function') {
					self.postComputeDetail();
				}
				self.reSetupConcreteUiStructure(self.moduleService.detail,
					commonService.CONSTANTS.UI_STRUCTURE.NOT_REMOVE_TEMPLATE_CHILDREN);
				
				if (self.evalRefDetail(self.uiStructureRoot)) {
					self.markValidStatus(self.uiStructureRoot);
				}
			}
			deferred.resolve(data);
		});
		return deferred.promise;
	};

	$scope.discardChangeDetail = function() {
		var self = this;
		var question = 'v4.user.label.DiscardChangeQuestion';
		commonUIService.showYesNoDialog(question, function() {
			self.moduleService.detail = angular.copy(self.moduleService.originalDetail);
			self.moduleService.clearErrorInElement(self.moduleService.detail);
			self.reSetupConcreteUiStructure(self.moduleService.detail,
				commonService.CONSTANTS.UI_STRUCTURE.NOT_REMOVE_TEMPLATE_CHILDREN,
				commonService.CONSTANTS.UI_STRUCTURE.EXPECTED_DETAIL_NOT_CHANGED
			);
			commonUIService.showNotifyMessage('v4.' + self.moduleService.name + '.message.discardChangeSuccessfully', 'success');
		}, angular.noop);
	};

	$scope.postSaveDetailOfBase = function(isBypassCheckServiceNameandDoctype) {
		var self = this;
		 var deferred = self.moduleService.$q.defer();

		//Set saved docId to stateParams
		if ($stateParams.docType === self.moduleService.name || isBypassCheckServiceNameandDoctype == true) {
			var oldSearch = $location.search();

			//only update docId to URL when old URL didn't have docId
			//prevent case of parent and children have the same docType
			if (!commonService.hasValueNotEmpty(oldSearch.docId)) {
				$location.search(angular.extend({}, oldSearch, {
					docId: self.moduleService.detail.id
				}));
			}
		}
		
		var promise = self.moduleService.$q.when();
		
		//need to find its parent document on the screen and update it
		var pCtrl = self.getParentCtrlInCharge();
		if (pCtrl) {
			var pElement = self.getRightDetailInMultipleEleFromParentDoc();
			if (pElement &&
				pElement.refId &&
				pElement.refType &&
				pElement.refType.value === self.moduleService.name) {

				//we switch to use "pCtrl.uiStructureRoot.refDetail" instead of "pCtrl.moduleService.detail"
				//for multi details per uiService purpose
				//store original parent detail to compare dirty change
				var pOriginalDetail= angular.copy(pCtrl.uiStructureRoot.refDetail);

				//Update ref values of parent detail
				pElement.refId.value = self.moduleService.findElementInDetail(['id']);
				pElement.refVersion.value = self.moduleService.findElementInDetail(['version']);
				pElement.refDocName.value = self.moduleService.findElementInDetail(['docName']).value;
				pElement.refBusinessStatus.value = self.moduleService.findElementInDetail(['businessStatus']).value;
				pElement.status.value = self.moduleService.findElementInDetail(['metaData', 'documentStatus']).value;
				if (pCtrl.updateRefBusinessDetail && typeof pCtrl.updateRefBusinessDetail === 'function') {
					pCtrl.updateRefBusinessDetail(pCtrl.uiStructureRoot.refDetail);
				}

				//Check for dirty change then save detail
				if (pCtrl.uiStructureRoot.isDetailChanged 
						|| !pCtrl.moduleService.compareData(pCtrl.uiStructureRoot.refDetail, pOriginalDetail)
						|| !pCtrl.moduleService.compareData(pCtrl.uiStructureRoot.refDetail, pCtrl.moduleService.originalDetail)) {
					promise = pCtrl.saveDetailNotCompute.call(pCtrl, pCtrl.moduleService, {
						bShowSavedMessage: false,
						bUpdateLocationSearch: true,
						locationParams: {
							locationDocType: $stateParams.docType,
							locationService: $location
						}
					});
				}
			}
		}
		promise.then( function () {
			if (pCtrl && pCtrl.evalRefDetail(pCtrl.uiStructureRoot)) {
				pCtrl.markValidStatus(pCtrl.uiStructureRoot);
			}
			deferred.resolve();
		});
		
		return deferred.promise;
	};

	$scope.openFile = function(fileCard) {
		var self = this;
		if (!commonService.hasValueNotEmpty(fileCard.fileResource)) {
			self.moduleService.getDocument(
				self.requestURL,
				commonService.CONSTANTS.MODULE_NAME.ATTACHMENT,
				self.moduleService.findElementInElement(fileCard.refDetail, ['refId']).value)
			.then(function(data) {
				fileCard.fileResource = data;
				self.resourceReaderService.openFileReader(fileCard.fileResource, 'view');
			});
		} else {
			self.resourceReaderService.openFileReader(fileCard.fileResource, 'view');
		}
	};
	
	$scope.listTypeCode = ('BDC IDC OTH').split(' ').map(function(typeCode) {
		return {abbrev: typeCode};
	});
	
	//Use for document center show in list view.
	$scope.openFileInListView = function(attachment) {
		var self = this;
		
		// fork to get data from dms instead getting data from case 
		self.moduleService.getDocument(
				self.requestURL,
				commonService.CONSTANTS.MODULE_NAME.ATTACHMENT,
				self.moduleService.findElementInElement(attachment, ['refId']).value)
			.then(function(data) {
				var fileName = self.findElementInElement(data, ['fileName', 'value']) || self.findElementInElement(data, ['documentName']);
				var fileType = (data.businessInformation) ? data.businessInformation.attachmentType.toLowerCase() : fileName.substr((fileName.lastIndexOf('.') + 1)).toLowerCase();
				if(fileType === "pdf" && data.businessInformation.isSigned) {  
					var docId = self.moduleService.findElementInElement(attachment, ['refId']).value;
					self.moduleService.getPDFAttachmentSignedToView(docId).then(function(data){
						attachment.content = data.content;
						self.resourceReaderService.openFileReader(attachment, 'view', data.businessInformation.isSigned);
					});
				} else {
					attachment.content = data.content;
					self.resourceReaderService.openFileReader(attachment, 'view', data.businessInformation.isSigned);
				}
			});
		
	};	
	
	/**
	 * Print pdf generated by system.
	 * @author hle56
	 * @param: object dataset
	 * @return: object dataset
	 */
	$scope.print = function(templateName) {
		var self = this;
        try {
            return getPdfData.call(this, templateName).then(function (pdfPayload) {
                return self.resourceReaderService.generatePDF(self.requestURL, pdfPayload, templateName);
            });
        } catch (e) {
            commonUIService.showNotifyMessage('v3.myworkspace.message.GeneratePDFUnsuccessfully', 'fail');
        }

        function getPdfData(templateName) {
        	var self = this;
        	var deferred = $q.defer();
            var data;
            switch (templateName.toUpperCase()) {
                case commonService.CONSTANTS.DMS_TYPE.MANAGER_REVIEW:
                    data = self.moduleService.extractDataModel(this.moduleService.detail);
                    deferred.resolve(data);
                    break;
                case commonService.CONSTANTS.DMS_TYPE.PDPA:
//                    this.moduleService.getDocumentWithouUpdateDetail(undefined, 'contact', this.moduleService.detail.prospects.value[0].refId.value).then(function (prospect) {
//                        deferred.resolve(self.moduleService.extractDataModel(prospect));
//                    });
                    deferred.resolve(self.moduleService.extractDataModel(this.moduleService.detail));
                    break;
                    
                case commonService.CONSTANTS.DMS_TYPE.FNA:
                	if(self.moduleService.name.toUpperCase() === 'FNA') {
                		data = self.moduleService.extractDataModel(self.moduleService.detail);
                		data = self.moduleService.needForFNAPdf(data);
                		deferred.resolve(data);
                	} else {
                		deferred.reject();
                	}
                	break;
                default:
                    deferred.resolve({});
            }

            return deferred.promise;
        }
	};

	$scope.findAttachmentByTypeCode = function findAttachmentByTypeCode(typeCode) {
		var self = this;
		var attachmentInformation =  self.moduleService.findElementInDetail(['attachmentInformation']);
		var result = [];
		attachmentInformation.value.forEach(function(attachment) {
			if(attachment.typeCode.value === typeCode) {
				result.push(attachment);
			}
		});
		return result;
	};
	/**
	 * Freeze Doc if have scope status and role in CONSTANTS.LIST_CONDITION_TO_FRERZE
	 * @param salecaseService
	 * @param docType
	 * @param detailDoc
	 * @returns {boolean} true detail is change ,false detail not change
	 */
	$scope.freezeDoc = function freezeDoc(salecaseService,docType, detailDoc) {
		var self = this;
		var result  = false;
        var operationStatus = salecaseService.findElementInDetail(['operationStatus']).value;
		commonService.CONSTANTS.LIST_CONDITION_TO_FRERZE[docType][operationStatus].forEach(function(role) {
			if(role === commonUIService.getActiveUserRole($stateParams)){
				result = true;
			}
		});
		if(result){
			self.moduleService.copyValueToNode(detailDoc, "editable", "true");
		}
		return result;
	};
	/**
	 * lpham24 delete one elemnet in any array
	 * @param myArray
	 * @param item
	 */
	$scope.deleteElementInArray = function deleteElementInArray(myArray, item) {
        if ($scope.moduleService.detail.metaData.businessStatus.value !== 'DR') {
            return;
        }
        myArray.splice(myArray.indexOf(item), 1);
	};
	$scope.checkExtentionbyTypeFile = function(filename, typeFile){
		var parts = filename.split('.');
		parts= (parts[parts.length - 1]).toLowerCase();
		var arrayFiletype = commonService.CONSTANTS.EXTENTION_FILE.TYPE_FILE;
        var isCheck = false;
        arrayFiletype.forEach(function (item) {
            if(item.key === typeFile){
            	item.value.forEach(function(item){
            		if(item === parts || item ==='all'){
                        isCheck = true;
					}
				});
            }
        });
		return isCheck;
	};
	$scope.addNewElementByArrayDefault = function (array){
		var self = this;
		
		var newElement = angular.copy(array.arrayDefault);
		array.value.push(newElement)
		
		return self.moduleService.$q.when(newElement);
	};
	/**
	 * @author:lpham24
	 * @detail: function to add comment of all doc to document center
	 * @param salecaseCoreService
	 * @param contentComment
	 * @param type
	 */
	$scope.addCommentToCenter = function (salecaseCoreService, contentComment, type) {
		var self = this ;
		var deferred = $q.defer();
		self.getCurrentDate().then(function (time){
			if(self.moduleService.isSuccess(time)){
              var arrayComment  = salecaseCoreService.findElementInDetail(['comments','value']);
              var newComment = angular.copy (salecaseCoreService.findElementInDetail(['comments','arrayDefault']));
              newComment.commentContent.value = contentComment;
			  newComment.dateAndTime.value = time;
			  newComment.postedBy.value = localStorage.getItem("fullname");
			  newComment.postedRole.value = commonUIService.getActiveUserRole($stateParams);
			  newComment.type.value = type;
			  arrayComment.unshift(newComment);
			}
			deferred.resolve();
        })
        return deferred.promise;
    };    
    
	//Whether current user's role in listRoles or not.
	$scope.isActiveRoleIn = function (listRoles) {
		var result = false;
		var currentActiveRole = commonUIService.getActiveUserRole($stateParams)
		listRoles.forEach(function (role) {
			if(currentActiveRole === role){
				result = true;
			}
		});
		return result;
	};
	
	/**
	 * Compute a few tag was specified
	 */
	$scope.computeTag = function (tagName, isNeedRefresh, tagParent, tagInclude, tagIndex) {
		var self = this;
		isNeedRefresh = isNeedRefresh == true;
		
		var deferred = self.moduleService.$q.defer();
		self.computeByTagNameCommon(self.moduleService, commonService.CONSTANTS.TAG_TYPE.TAGS, tagName, tagParent, tagInclude, tagIndex).then( function (data) {
			if(isNeedRefresh)
				return self.refreshDetail();
			else
				return data;
		}).then(function afterCheckRefresh(data){
			deferred.resolve(data);
		});
		return deferred.promise;
	};
	
	/**
	 * Compute full but ignore a few tag.
	 */
	$scope.computeIgnoreTag = function (elementNeedIgnore) {
		var self = this;
		var deferred = self.moduleService.$q.defer();
		self.computeByTagNameCommon(self.moduleService, commonService.CONSTANTS.TAG_TYPE.IGNORE_TAGS, elementNeedIgnore).then( function (data) {
			self.refreshDetail().then( function () {
				deferred.resolve();
			});
		});
		return deferred.promise;
	};
	
	/**
	 * Validate a few tag was specified
	 */
	$scope.validateTag = function (elementNeedCompute) {
		var self = this;
		var deferred = self.moduleService.$q.defer();
		self.validateByTagNameCommon(self.moduleService, commonService.CONSTANTS.TAG_TYPE.TAGS, elementNeedCompute).then(function (data) {
			deferred.resolve(data);
		});
		return deferred.promise;
	};
	
	/**
	 * Validate full but ignore a few tag.
	 */
	$scope.validateIgnoreTag = function (elementNeedCompute) {
		var self = this;
		var deferred = self.moduleService.$q.defer();
		self.validateByTagNameCommon(self.moduleService, commonService.CONSTANTS.TAG_TYPE.IGNORE_TAGS, elementNeedCompute).then(function (data) {
			deferred.resolve(data);
		});
		return deferred.promise;
	};
	
	
	
	/**
	 * ==================================================
	 * 
	 * 		|		Helper function      |
	 *      v							 v
	 * ==================================================
	 */
	
	/**
	 * Validate full node.
	 */
	$scope.validateDetailCommon = function(moduleService, accceptAction) {
		var self = this;
		var deferred = self.moduleService.$q.defer();
		var arrayaccceptAction = [accceptAction];
		moduleService.operateDocument(
			self.requestURL,
			moduleService.name,
			commonService.CONSTANTS.ACTION.VALIDATE,
			moduleService.detail,
			moduleService.businessLine,
			moduleService.productName,
			arrayaccceptAction
		).then(function(data) {
			if (moduleService.isSuccess(data)) {
				deferred.resolve(data);
			} else {
				deferred.reject(data);
			}
		});
		return deferred.promise;
	};
	
	/**
	 * Compute by tag name common.
	 * @param tagType : tags or ignoreTags
	 */
	$scope.computeByTagNameCommon = function(moduleService, tagType, tagName, tagParent, tagInclude, tagIndex){
		var self = this;
		var deferred = self.moduleService.$q.defer();
		moduleService.computeByTagName(tagType, tagName, tagInclude || [], tagParent, tagIndex).then(function(data){
			self.reSetupConcreteUiStructure(
					moduleService.detail,
					commonService.CONSTANTS.UI_STRUCTURE.NOT_REMOVE_TEMPLATE_CHILDREN,
					commonService.CONSTANTS.UI_STRUCTURE.EXPECTED_DETAIL_NOT_CHANGED
				);
			deferred.resolve(data);
		});
		return deferred.promise;
	};
	
	/**
	 * validate by tag name common.
	 * @param tagType : tags or ignoreTags
	 */
	$scope.validateByTagNameCommon = function(moduleService, tagType, tagName, tagInclude){
		var self = this;
		var deferred = self.moduleService.$q.defer();
		moduleService.validateByTagName(tagType, tagName, tagInclude || []).then(function(data){
			self.reSetupConcreteUiStructure(
					moduleService.detail,
					commonService.CONSTANTS.UI_STRUCTURE.NOT_REMOVE_TEMPLATE_CHILDREN,
					commonService.CONSTANTS.UI_STRUCTURE.EXPECTED_DETAIL_NOT_CHANGED
				);
			deferred.resolve(data);
		});
		return deferred.promise;
	};
	
	
	/**
	 * ==================================================
	 * 		^							 ^
	 * 		|		Helper function      |
	 *      							 
	 * ==================================================
	 */
	
	//Reload specific detail of the controller specify in input
	$scope.reloadDetail = function(ctrl, docId) {
		var self = this;
		var deferred = $q.defer();
		var id = docId || ctrl.moduleService.detail.id;
		//Prepare previous UI model for salecase
		var oldDetail = angular.copy(ctrl.moduleService.detail);
		self.getDocument(ctrl.moduleService,id).then(function(data) {
			if (ctrl.moduleService.isSuccess(data)) {
				return data;
			} else {
				deferred.reject();
			}
		}).then( function afterGetDocument(data) {
			ctrl.moduleService.detail = data;
			ctrl.moduleService.originalDetail = angular.copy(data);
			
			ctrl.refreshDetail().then( function (data) {
				ctrl.reSetupConcreteUiStructure(ctrl.moduleService.detail,
						commonService.CONSTANTS.UI_STRUCTURE.NOT_REMOVE_TEMPLATE_CHILDREN,
						commonService.CONSTANTS.UI_STRUCTURE.EXPECTED_DETAIL_NOT_CHANGED
				);
				
				if (ctrl.evalRefDetail(ctrl.uiStructureRoot)) {
					ctrl.markValidStatus(ctrl.uiStructureRoot);
				}
				
				deferred.resolve(oldDetail);
			});
		});
		return deferred.promise;
	};
}];