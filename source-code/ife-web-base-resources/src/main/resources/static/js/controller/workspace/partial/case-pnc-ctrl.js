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
var CasePncDetailCtrl = ['$mdDialog', '$http', '$q', '$window', '$scope', '$log', '$stateParams', '$injector', '$location', '$filter', 'commonService', 'commonUIService', 'salecaseCoreService', 'quotationCoreService', 'contactCoreService', 'accountCoreService', 'underwritingCoreService', 'AclService', '$timeout', 'loadingBarService',
	function($mdDialog, $http, $q, $window, $scope, $log, $stateParams, $injector, $location, $filter, commonService, commonUIService, salecaseCoreService, quotationCoreService, contactCoreService, accountCoreService, underwritingCoreService, AclService, $timeout, loadingBarService) {

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
		salecaseCoreService.acceptedQuotation = undefined;
		$scope.ctrlName = genCtrlName('detail', commonService.CONSTANTS.MODULE_NAME.SALECASE, undefined, commonService.CONSTANTS.PRODUCT_LOB.PNC);
		salecaseCoreService.productName = $stateParams.productName;
		salecaseCoreService.businessLine = commonService.CONSTANTS.PRODUCT_LOB.PNC;
		$scope.moduleService = salecaseCoreService;
		$scope.productname = $stateParams.productName;
		$scope.contactService = contactCoreService;
		$scope.quotationService = quotationCoreService;
		$scope.moduleService.freeze = false;
		$scope.lazyChoiceListName = "YesNo";
		$scope.moduleService.isSubmitted = false;
		$scope.isOpenFNACard = false;
		//commonUIService.setupAclForDetail(AclService, [$stateParams.userRole]);
		$scope.setupStuffs().then(function(){
			$scope.setupActionBar($scope.moduleService.actionBar, undefined, $scope);
		});
		$scope.$filter = $filter;
		
//		console.log($scope.contactService);
	};
	
	$scope.setupInitialData = function() {
		$scope.getAcceptedQuotation();
	}
	
	/************************************************************************************* */
	/******************************** End lifecycle methods ****************************** */
	/************************************************************************************* */	
	
	$scope.checkProspect = function() {
		if($scope.moduleService.detail.prospects.value.length != 0) {
			if($scope.moduleService.detail.prospects.value[0].status.value == null || $scope.moduleService.detail.prospects.value[0].status.value == undefined || $scope.moduleService.detail.prospects.value[0].refVersion.value == 0 || $scope.moduleService.detail.prospects.value[0].refVersion.value == null) {
				$scope.$broadcast('someEvent');
			}
		}
	}
	
	$scope.getAcceptedQuotation = function() {
		angular.forEach($scope.moduleService.detail.quotations.value, function(item){
			if(item.refBusinessStatus.value == commonService.CONSTANTS.BUSINESS_STATUS.ACCEPTED) {
				$scope.moduleService.getDocumentWithouUpdateDetail(undefined, item.refType.value, item.refId.value, undefined, item.refBusinessType.value, item.refProductName.value).then(function(data){
					$scope.moduleService.acceptedQuotation = data;
				});
			}
		});		
	} 
	
	$scope.checkOnOpenQuotationCard = function(card) {		
		card.data.requestBody = [];
		card.data.requestBody.push($scope.moduleService.detail.prospects.value[0].refDocName.value);
		card.data.requestBody.push($scope.moduleService.detail.prospects.value[0].refVersion.value);		
	}
	
	$scope.checkOnOpenApplicationCard = function(card) {
		var permissionApplication = false;
		angular.forEach($scope.moduleService.detail.quotations.value, function(item, index){
			if(item.refBusinessStatus.value == commonService.CONSTANTS.BUSINESS_STATUS.ACCEPTED) {
				permissionApplication = true;
				card.data.requestBody = $scope.moduleService.acceptedQuotation;				
			}
		});
		if(permissionApplication == false) {
			commonUIService.showNotifyMessage('v4.error.message.permissionApplication');
			return false;
		}
	}

	$scope.removeQuotation = function(card) {
		 var parentEl = angular.element(document.body);
	       $mdDialog.show({
	         parent: parentEl,
	         template:
	        	 
	           '<md-dialog>' +
       
	            '  <md-dialog-content>			<br/><br/><span style="margin:30px;font-size:15px;" >Are you sure you want to delete this Declaration?</span>			</md-dialog-content>' +
              
	            '  <md-dialog-actions> <br/>' +
	            '    <md-button ng-click="deleteQuo()" class="md-primary">' +
	            'Yes'+
	            '    </md-button>' +
	            '    <md-button ng-click="closeQuo()" class="md-primary">' +
	            '      No ' +
	            '    </md-button>' +
	            '  </md-dialog-actions>' +
	            '</md-dialog>',
	         locals: {
	           items: $scope.items
	         },
	         controller: DialogController
	       });
	       function DialogController($scope,$mdDialog) {
	    	  $scope.deleteQuo=function(){
	    		  deleteQuo(card);
	    		  $mdDialog.hide();
	    	  }
	    	  $scope.closeQuo=function(){
	    		  $mdDialog.hide();
	    	  }
	       }
		
	}
	function deleteQuo(card){
		if(card.refDetail.refBusinessStatus.value != commonService.CONSTANTS.BUSINESS_STATUS.ACCEPTED) {
			$scope.removeCardInList(undefined, undefined, card);
//			$scope.autoSaveDetail(); // hle71 - should save the change
		}
	}
	$scope.removeProposer = function(card) {
		var checkRemoveProposer = false;
		if( $scope.moduleService.findElementInDetail(['quotations']).value.length > 0 )
			{
				checkRemoveProposer = true;
				commonUIService.showNotifyMessage('v4.case.message.removeFNAorQuoFirst','success');
			}
		if(checkRemoveProposer == false) {
			$scope.closeChildCards(card.level);
			$scope.removeCardInList(undefined, undefined, card);
		}
	}
	
	$scope.checkVisible =  function(){
		var selectedProfile = JSON.parse(localStorage.getItem("selected_profile"));
		var role = selectedProfile.role;
		if (role == 'UW' || role == 'MR')
			return false;
		return true;
	}
	
	$scope.addNewQuotationCard =  function(card){
		var checkAddQuo = true;
		
		angular.forEach(card.parent.children, function(item, index){
			if(item.refDetail != undefined && item.refDetail.refBusinessStatus.value == commonService.CONSTANTS.BUSINESS_STATUS.ACCEPTED) {
				checkAddQuo = false;				
			}
		});
		if(checkAddQuo == false) {
			commonUIService.showNotifyMessage('v4.error.message.addQuotation');
			return;
		}
		
		if($scope.moduleService.productName === 'can'){

			// show loading bar
			loadingBarService.showLoadingBar();
			// add new card quotation
			$scope.addCard(card).then(function(){
				
				$scope.markValidStatus(card.parent);
				
				// wait for rendering ui structure completed  and then open detail of new quotation
				$timeout(function() {
					var childCards = card.parent.children;
					var indexNewQuoCard = undefined;
					var newQuoCard = undefined;
					// get new quotation card element
					// note: new quotation card's position is last of children position but before the position  of add button
					for(var i = childCards.length - 1; i >= 0; i--) {
						if(childCards[i].cardType.toLowerCase() !== 'action') {
							indexNewQuoCard = i;
							newQuoCard = childCards[indexNewQuoCard];
							break;
						}
					}
					
					if(indexNewQuoCard !== undefined) {
						var htmlIdOfNewQuo = '#level-' + newQuoCard.level + '-card-' + indexNewQuoCard;
					    var newQuoEle = angular.element(htmlIdOfNewQuo);
					    if(newQuoEle === undefined) $log.error("Not found a new Quotation element");
						var htmlEleOfNewQuo = newQuoEle.scope().card.html;
					    
					    if(htmlEleOfNewQuo) {
					    	htmlEleOfNewQuo.triggerHandler('click');
					    } else {
					    	$log.error("not found html of new Quotation element");
					    }
					} else {
						$log.error("not found a position of a new Quotation element");
					}
					loadingBarService.hideLoadingBar();
				}, 500);
			});
			
		}else{
			
			if($scope.moduleService.detail.prospects.value.length != 0) {
				// show loading bar
				loadingBarService.showLoadingBar();
				
				// add new card quotation
				$scope.addCard(card).then(function(){
					
					$scope.markValidStatus(card.parent);
					
					// wait for rendering ui structure completed  and then open detail of new quotation
					$timeout(function() {
						var childCards = card.parent.children;
						var indexNewQuoCard = undefined;
						var newQuoCard = undefined;
						// get new quotation card element
						// note: new quotation card's position is last of children position but before the position  of add button
						for(var i = childCards.length - 1; i >= 0; i--) {
							if(childCards[i].cardType.toLowerCase() !== 'action') {
								indexNewQuoCard = i;
								newQuoCard = childCards[indexNewQuoCard];
								break;
							}
						}
						
						if(indexNewQuoCard !== undefined) {
							var htmlIdOfNewQuo = '#level-' + newQuoCard.level + '-card-' + indexNewQuoCard;
						    var newQuoEle = angular.element(htmlIdOfNewQuo);
						    if(newQuoEle === undefined) $log.error("Not found a new Quotation element");
							var htmlEleOfNewQuo = newQuoEle.scope().card.html;
						    
						    if(htmlEleOfNewQuo) {
						    	htmlEleOfNewQuo.triggerHandler('click');
						    } else {
						    	$log.error("not found html of new Quotation element");
						    }
						} else {
							$log.error("not found a position of a new Quotation element");
						}
						loadingBarService.hideLoadingBar();
					}, 500);
				});
			} else {
				commonUIService.showNotifyMessage('v4.error.message.addProspect');
			}
			
		}
		
	};

	$scope.addNewProspectCard =  function(card, doctype, businessType){
		var self = this;
		if(card != undefined) {
	    	for(var i=0, n=card.parent.children.length; i<n; i++) {
				if(card.parent.children[i].isSelected) {
					$scope.closeChildCards(card.parent.children[i].level);
					break;
				}
			}
    	}
		$scope.addCard(card).then(function(){
			//contactCoreService.initializeDocument(self.requestURL, doctype, '', '', '', businessType)
			//.then(function (data){
				//contactCoreService.createDocument(self.requestURL, doctype, contactModel, businessType, '')
					//.then(function (contactModel) {
						//var docName = contactModel.metaData.docName;
						//self.moduleService.cloneByDocName(undefined, doctype, businessType , undefined, docName)
						//.then(function(data) {
							//if(commonService.hasValueNotEmpty(data)){
								//$scope.moduleService.findElementInElement(data, ['personInformation']).parentModule = commonService.CONSTANTS.MODULE_NAME.SALECASE;
								$scope.moduleService.findElementInDetail(['prospects']).value[0].refId.value = null;
								$scope.moduleService.findElementInDetail(['prospects']).value[0].refDocName.value = null;
								$scope.moduleService.findElementInDetail(['prospects']).value[0].refVersion.value = null;
								$scope.moduleService.findElementInDetail(['prospects']).value[0].refBusinessType.value = businessType;
								$scope.moduleService.findElementInDetail(['prospects']).value[0].status.value = null;
								//$scope.moduleService.updateDocument(undefined, data.metaData.docType, data.metaData.docId, data, data.metaData.businessType, data.metaData.productName);
								
								// wait for ui stable and move to prospect card
				  				$timeout(function(){
				  					$scope.moveToCard('case-management-base:Prospect');
				  				}, 500);
							//}
						//});
					//});
				//});
			$scope.markValidStatus(card.parent);
		});
	};
	
	$scope.checkVisibleImportCardProspect = function(card) {
		if(parseInt(card.parent.refDetail.meta.counter) == parseInt(card.parent.refDetail.meta.maxOccurs)) 
			return false;
		return true;
	};

	$scope.addOptionalDocument = function addOptionalDocument(card) {
		if ($scope.moduleService.detail.metaData.businessStatus.value !== 'DR') {
			return;
        }
		var arrayDefault = card.refDetail.value[0];
		var cloneElement = angular.copy(arrayDefault);
		cloneElement.attachmentGroup.value = commonService.CONSTANTS.ATTACHMENT_GROUP.OPTIONAL;
		card.refDetail.value.push(cloneElement);
	};
	
	function getFileReader(file, initFile) {
		var deferred = $q.defer();
		var reader = new FileReader();
		reader.onload = (function (file) {
			return function (e) {
				var f = file;
				angular.extend(f, initFile);
				f.desc = file.name;
				f.data = e.target.result;
				deferred.resolve(f);
			};
		})(file);
		reader.readAsDataURL(file);
		return deferred.promise;
	}
	$scope.checkTitleDocumentName = ConstantConfig.TITLE_DOCUMENT_NAME.PATTERN;
	$scope.uploadFilesNew = function($files, card) {
        var self = this;
        if ($scope.moduleService.detail.metaData.businessStatus.value !== 'DR') {
			return;
        }
		var arrayDefault = card.refDetail.value[0];
		var cloneElement = angular.copy(arrayDefault);
		cloneElement.attachmentGroup.value = commonService.CONSTANTS.ATTACHMENT_GROUP.OPTIONAL;
		var attachment = cloneElement;
		var deferred = self.moduleService.$q.defer();
		if($files.length > 0){
			$files = $files || [];
			$files.forEach(function (file, index, object) {
				if(ConstantConfig.TITLE_DOCUMENT_NAME.PATTERN.test(file.name)){
					card.refDetail.value.push(cloneElement);
					var initFile = {desc: "", data: "", validate: "", documentType: ""};
					getFileReader(file, initFile).then(function (data) {
						self.moduleService.uploadAttachment(self.requestURL, commonService.CONSTANTS.MODULE_NAME.ATTACHMENT, data, {attachmentType : attachment.typeCode.value})
						.then(function (data){		
							if(!data){
								commonUIService.showNotifyMessage('MSG-018-1', 'Error');
							}
								attachment.attachment.refId.value = data.id;
								attachment.fileName.value = self.findElementInElement(data, ['documentName']);
								attachment.fileSize.value = self.findElementInElement(data, ['contentSize']);
								attachment.createdDate.value = self.findElementInElement(data, ['createdDate']);
								attachment.typeCode.value = self.findElementInElement(data, ['attachmentType']);
								attachment.uploadedBy.value = self.findElementInElement(data, ['businessInformation', 'ownerId']);
                                commonUIService.showNotifyMessage('MSG-018', 'success');
                                deferred.resolve(attachment)                            
						});
					});
				}else{
					commonUIService
					.showNotifyMessage('MSG-0111');
				
				}
			});
		}
        return deferred.promise;
	};

	$scope.signDocument = function () {
		var self = this;
		if (salecaseCoreService.detail.id) {
            self.resourceReaderService.signDocument(this.requestURL, salecaseCoreService.detail.id, self.resourceReaderService.detailFile.content);
		} else {
            $scope.saveDetail().then(function () {
                self.resourceReaderService.signDocument(self.requestURL, salecaseCoreService.detail.id, self.resourceReaderService.detailFile.content);
            });
		}
	};

	$scope.presubmit = function () {
		var self = this;
		
		if($scope.moduleService.detail.metaData.productName.value === 'can' && $scope.moduleService.detail.application.status.value !== 'VALID'){
				commonUIService.showNotifyMessage('v4.error.message.permissionApplication');
				return;
		}
		if ($scope.moduleService.isSubmitted == false) {
			loadingBarService.showLoadingBar();
			this.moduleService.presubmit().then(function (data) {
				loadingBarService.hideLoadingBar();
				if (self.moduleService.isSuccess(data)) {
					$scope.moduleService.isSubmitted = true;
	        		commonUIService.showNotifyMessage('v4.case.message.presubmitSuccessfully', 'success');
	        		self.uiStructureRoot.isDetailChanged = false;
					self.reSetupConcreteUiStructure(
						self.moduleService.detail,
						commonService.CONSTANTS.UI_STRUCTURE.NOT_REMOVE_TEMPLATE_CHILDREN,
						commonService.CONSTANTS.UI_STRUCTURE.EXPECTED_DETAIL_NOT_CHANGED
					);
	        	} 
			});
		}
    };
    
    $scope.checkEnaleSubmitCaseLife = function() {
    	if ($scope.moduleService.detail == undefined) return true;
    	if($scope.moduleService.findElementInDetail(['metaData','businessStatus']).value == commonService.CONSTANTS.BUSINESS_STATUS.DR) {
    		if($scope.moduleService.isSubmitted !== true)
    			return false;
    	}
    	return true;
    }
    $scope.sumAddPre = function(arrPremiumValue) {	
    	if(commonService.hasValueNotEmpty(arrPremiumValue)){
    		var sumAddPre = 0;
        	for(var i=0; i < arrPremiumValue.length; i++) {
    			sumAddPre=arrPremiumValue[i].additionalPremium + sumAddPre;
    		}
        	$scope.showAddPre = sumAddPre;
        	return sumAddPre;
    	}
	}
    
    $scope.showListNewDocumentOptionDlg = function(card, ev, doctype, dashboardName) {
		console.log(doctype);
		$scope.card = card;
		if(doctype === undefined) {
			console.log('doc type is undefined');
			return;
		}
		
		// url of template
		var templateUrl = resourceServerPath + 'view/templates/catalogs/' + doctype + '-template.html';
		
		// get catalog json data file
		var defer = $q.defer();
		var catalogFileName = 'new_catalog_' + doctype + "_case" + '.json';
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
				showDlg(doctype, jsonData.content, card);
			}
		}, function failed(){
			defer.reject();
		})
		
		function showDlg(type, content, card) {
			function DialogCatalogController($scope, $mdDialog) {				
				$scope.content = content;
				$scope.dashboardName = dashboardName;
				$scope.clickItemHandler = function(onClick) {
					if(onClick) {
						$scope.$parent.$eval(onClick);
						$mdDialog.cancel();
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
    
    $scope.signDocumentPdf = function signDocumentPdf(templateName) {
    	var self = this;
    	var detailFile = $scope.resourceReaderService.detailFile;
    	var refDocIdIsSelected = detailFile.attachment.refId.value
    	// show loading 
    	loadingBarService.showLoadingBar();
    	
    	// validate detail
    	$scope.validateDetail(true).then(function(data) {
    		if(data) {
    			console.log("Case is valid");
    			// get content of pdf file which need to esign
    			var attachments = $scope.moduleService.detail.attachments.value;
    			var isFullInfoForPrepareEsignature = false;
    			var moduleName, caseId, refDocId, businessType, productName, fileName, fileContent, docType;
    			for(var i = 0; i < attachments.length; i++) {
    				if(refDocIdIsSelected == attachments[i].attachment.refId.value){
    					var attachment = attachments[i];
	        			moduleName = $scope.moduleService.name;
	        			caseId = data.id;
	        		    refDocId = attachment.attachment.refId.value;
	        			businessType = data.metaData.businessType.value;
	        			productName = data.metaData.productName.value;
	        			fileName = attachment.fileName.value; 
	        			fileContent = detailFile.content;
						docType = attachment.typeCode.value;
	        			isFullInfoForPrepareEsignature = true;
	        			break;
    				}
    			}
    			
    			if(isFullInfoForPrepareEsignature) {
    				console.log("Get content success");
					$scope.moduleService.signDocumentNew(self, moduleName, caseId, refDocId, businessType, productName, fileName, fileContent, docType).then(function(data) {
						loadingBarService.hideLoadingBar();
						if(data) {
							// set a destination card to back after esigned
							localStorage.setItem('initAtTabName', 'case-management-base:DocumentCenter');
							// go to esign
							$window.location.href = data.esignUrl;
						}
					});
    			} else {
    				loadingBarService.hideLoadingBar();
    			}
    		} else {
    			loadingBarService.hideLoadingBar();
    		}
    	});
    	
		console.log("Start esign here");
	}
    //end
    
    $scope.reOrderCard = function(listChild){ // hle71 - no longer used for Quotation tab - should remove it?
		for(var i=0;i<listChild.length;i++){
			if(listChild[i].cardType =="action"){
				var temp = listChild[i];
				listChild.splice(i,1);
				listChild.push(temp);
				break;
			}
		}
	}	
    
    $scope.isEsignVisible = function(data){
    	var detailFile = data.detailFile;
    	if (detailFile == undefined) 
    		return false;
    	else
    		if (detailFile.attachment == undefined)
    			return false;
    		else
    			if (detailFile.attachment.status.value == 'ACCEPTED'
    				&& ((detailFile.typeCode.value).toUpperCase() == 'APPLICATION' || (detailFile.typeCode.value).toUpperCase() == 'BI')
    				/*&& !data.isSigned*/) // no limit esign time
    				return true;
    	return false;
    }

    /*********************** Start FNA Inside ******************************/
    $scope.isOpenFNACardFunction = function(isOpen){
    	if(isOpen != undefined)
    		return $scope.isOpenFNACard = isOpen;
    	return $scope.isOpenFNACard = !$scope.isOpenFNACard;
    }
    
    $scope.removeFNAInside = function(card){
    	var self = this;
    	var question = 'v4.popup.remove.fnaInside';
    	setTimeout(function(){commonUIService.showYesNoDialog(question, function() {
			self.moduleService.clearDataInJson(self.moduleService.findElementInDetail(['fnaInside', 'refIdModel']));
			self.moduleService.clearDataInJson(self.moduleService.findElementInDetail(['fnaInside', 'recommendation']));
			self.moduleService.clearDataInJson(self.moduleService.findElementInDetail(['fnaInside', 'summary']));
			$scope.closeChildCards(card.level);
			return self.saveDetail().then(function (data) {
				self.updateParentValidStatus(card);
			});
		}, function() {
		});
    	},1);
    }
    
    $scope.printBI = (function () {
            var templateName = commonService.CONSTANTS.DMS_TYPE.QUOTATION;
            var data = {};
            var getAccount = {};
            var getQuotation = {};
            function getData() {
            	
    			var deferred = $scope.moduleService.$q.defer();
    			if (accountCoreService.detail) {
    				getAccount = $scope.moduleService.extractDataModel(accountCoreService.detail);
                } else {
                	getAccount = accountCoreService.getUserDetail();
    			}
    			
    			if(quotationCoreService.detail){
    				getQuotation = $scope.moduleService.extractDataModel(quotationCoreService.detail);
    			} else {
    				var quoID = $scope.moduleService.findElementInDetail(['quotations', 'refId', 'value']);
    				if(commonService.hasValueNotEmpty(quoID)){
    					getQuotation = $scope.moduleService.getDocument(undefined, 'quotation', quoID, undefined, $scope.moduleService.businessLine, $scope.moduleService.productName);
    				} else {
    					getQuotation = {};
    				}
    			}
    			
    			var promises = [];
    			promises.push(getAccount);
    			promises.push(getQuotation);
    			$scope.moduleService.$q.all(promises).then(function (responses) {
    				data.account = $scope.moduleService.extractDataModel(responses[0]);
    				data.quotation = $scope.moduleService.extractDataModel(responses[1]);
    				deferred.resolve(data);
    			})
    			return deferred.promise;
            }
    		
    		function print() {
    			var quoAcceptedAttachment = undefined;
    			if($scope.moduleService.acceptedQuotation !== undefined
    			   || (quotationCoreService.detail !== undefined && quotationCoreService.detail.metaData.businessStatus.value.toUpperCase() === 'ACCEPTED')) {
    				// find attachment of the accepted quotation
    				var attachments = $scope.moduleService.detail.attachments.value;
    				for(var i = 0; i < attachments.length; i++) {
    					if(attachments[i].typeCode.value.toUpperCase() === 'BI') {
    						quoAcceptedAttachment = attachments[i];
    						break;
    					}
    				}
    			}
    			
    			if(quoAcceptedAttachment) {
    				$scope.moduleService.getDocument(
    						$scope.requestURL,
    						commonService.CONSTANTS.MODULE_NAME.ATTACHMENT,
    						quoAcceptedAttachment.attachment.refId.value)
    					.then(function(data) {
    						if(data.businessInformation.isSigned) {
    							$scope.moduleService.getPDFAttachmentSignedToView(quoAcceptedAttachment.attachment.refId.value).then(function(data) {
    								quoAcceptedAttachment.content = data.content;
    								$scope.resourceReaderService.openFileReader(quoAcceptedAttachment, 'view', data.businessInformation.isSigned);
    							});
    						} else {
    							quoAcceptedAttachment.content = data.content;
    							$scope.resourceReaderService.openFileReader(quoAcceptedAttachment, 'view', data.businessInformation.isSigned);
    						}
    					});
    			} else {
    				getData().then(function (payload) {
                        return $scope.resourceReaderService.generatePDF($scope.requestURL, payload, templateName);
                    });
    			}
    		}
    		
    		return print;
       }).call(this);
    /*********************** End FNA Inside ******************************/
    
    /*********** Quotation Summary section **********************/
		
	$scope.acceptQuotation = function acceptQuotationV2(quotationSummary, card) {
		if(quotationSummary.metaData.documentStatus == 'VALID'){
			card.finishAcceptQuotation = false;
			var statusBackup = angular.copy(quotationSummary.metaData.businessStatus);
			quotationSummary.metaData.businessStatus = "ACCEPTTING";
			card.refDetail.refBusinessStatus.value = "ACCEPTTING";
			var count = 0;
			for(var i=0; i < $scope.salecaseCoreService.detail.quotations.value.length; i++) {
				var summary = $scope.salecaseCoreService.detail.quotations.value[i].summary;
				if(summary && summary.metaData.businessStatus === commonService.CONSTANTS.BUSINESS_STATUS.ACCEPTED) {
					commonUIService.showNotifyMessage('v4.error.message.acceptQuo');
					card.finishAcceptQuotation = true;
					quotationSummary.metaData.businessStatus = statusBackup;
					card.refDetail.refBusinessStatus.value = statusBackup;
					return;
				}
				/*if(summary.metaData.businessStatus == "ACCEPTTING") {
					count = count + 1;
				}*/
			}
		/*	if(count >= 2) {
				commonUIService.showNotifyMessage('v4.error.message.acceptQuo');
				card.finishAcceptQuotation = true;
				quotationSummary.metaData.businessStatus = statusBackup;
				card.refDetail.refBusinessStatus.value = statusBackup;
				return;
			}*/
		}
		
		
		var acceptQuotation = function acceptQuotation(computedQuotation, requestURL, docType) {
			$scope.moduleService.acceptQuotation(computedQuotation).then(function(data) {
				if(data) {
					// re-structure data for case
					var updatedCase = data.cases;
					if ($scope.moduleService.isSuccess(updatedCase)) {
						$scope.moduleService.convertDataModel2UiModel(updatedCase, salecaseCoreService.detail);
						$scope.moduleService.detail = angular.copy(updatedCase);
						$scope.moduleService.originalDetail = angular.copy(updatedCase);
						$scope.uiStructureRoot.isDetailChanged = false;
						$scope.reSetupConcreteUiStructure(
								$scope.moduleService.detail,
							commonService.CONSTANTS.UI_STRUCTURE.NOT_REMOVE_TEMPLATE_CHILDREN,
							commonService.CONSTANTS.UI_STRUCTURE.EXPECTED_DETAIL_NOT_CHANGED
						);
					}
					
					// set quotation accepted
					$scope.moduleService.acceptedQuotation = $scope.moduleService.extractDataModel(data.quotations);
					$scope.moduleService.freeze = true;
					
					$timeout(function (){
						commonUIService.showNotifyMessage('v4.quotation.message.acceptedSuccessfully', 'success');
						card.finishAcceptQuotation = true;
					}, 1000);
				}
			});
		}
		
		// Execute 
		$scope.moduleService.updateDocument(undefined, quotationSummary.metaData.docType, quotationSummary.metaData.docId, quotationSummary, quotationSummary.metaData.businessType, quotationSummary.metaData.productName).then(function(quotationSummary){			
			quotationCoreService.refreshValidateComputeQuotation(quotationSummary).then(function (computedQuotation) {
				if (computedQuotation !== 'failed') {
					acceptQuotation(computedQuotation, $scope.requestURL, quotationCoreService.name);
				} else {
					card.finishAcceptQuotation = true;
				}
			});
		})
	};
	
	$scope.printPDF = function (quotationSummaryInfo) {
		// get account info
        function getAccountInfo() {
			var deferred = $scope.moduleService.$q.defer();
			if (accountCoreService.detail) {
				deferred.resolve($scope.moduleService.extractDataModel(accountCoreService.detail));
            } else {
				accountCoreService.getUserDetail().then(function (user) {
					accountCoreService.detail = user;
                    deferred.resolve($scope.moduleService.extractDataModel(accountCoreService.detail));
				});
			}
			return deferred.promise;
        }
        
        if(quotationSummaryInfo !== undefined && quotationSummaryInfo.metaData.businessStatus === commonService.CONSTANTS.BUSINESS_STATUS.ACCEPTED) {
        	var quoAcceptedAttachment = undefined;
        	// find attachment of the accepted quotation
			var attachments = $scope.moduleService.detail.attachments.value;
			for(var i = 0; i < attachments.length; i++) {
				if(attachments[i].typeCode.value.toUpperCase() === 'BI') {
					quoAcceptedAttachment = attachments[i];
					break;
				}
			}
			if(quoAcceptedAttachment) {
				$scope.moduleService.getDocument(
						$scope.requestURL,
						commonService.CONSTANTS.MODULE_NAME.ATTACHMENT,
						quoAcceptedAttachment.attachment.refId.value)
					.then(function(data) {
						if(data.businessInformation.isSigned) {
							$scope.moduleService.getPDFAttachmentSignedToView(quoAcceptedAttachment.attachment.refId.value).then(function(data) {
								quoAcceptedAttachment.content = data.content;
								$scope.resourceReaderService.openFileReader(quoAcceptedAttachment, 'view', data.businessInformation.isSigned);
							});
						} else {
							quoAcceptedAttachment.content = data.content;
							$scope.resourceReaderService.openFileReader(quoAcceptedAttachment, 'view', data.businessInformation.isSigned);
						}
					});
			}
        	
        } else {
        	// Validate and compute the quotation before generating PDF
        	quotationCoreService.refreshValidateComputeQuotation(quotationSummaryInfo).then(function (computedQuotation) {
    			if (computedQuotation !== 'falied') {
    				getAccountInfo().then(function (accountInfo) {
    					var reqPdfParams = {
    			        	quotation: $scope.moduleService.extractDataModel(computedQuotation),
    			        	account: accountInfo
    			        };
    					var templateName = commonService.CONSTANTS.DMS_TYPE.QUOTATION;
    					return $scope.resourceReaderService.generatePDF($scope.requestURL, reqPdfParams, templateName);
    	        	})
    			}
    		})
        }
        
	}
	
	$scope.importExistingQuotationCard =  function(card){
		var hasAcceptedQuotation = false;
		angular.forEach(card.parent.children, function(item, index){
			if(item.refDetail != undefined && item.refDetail.refBusinessStatus.value === commonService.CONSTANTS.BUSINESS_STATUS.ACCEPTED) {
				hasAcceptedQuotation = true;
			}
		});
		
		if(hasAcceptedQuotation) {
			commonUIService.showNotifyMessage('v4.error.message.importStandaloneQuotation');
			card.stopPropagation = true; // ????
			return;
		}
		if($scope.moduleService.detail.prospects.value.length == 0) {
			commonUIService.showNotifyMessage('v4.error.message.addProspect');
			card.stopPropagation = true; // ????
			return;
		}
		
		card.stopPropagation = false;
		
		// Collect quotation names for quotation import
		var quotationDocNames = [];
		var quotations = $scope.salecaseCoreService.detail.quotations.value;
		for(var i=0; i < quotations.length; i++) {
			if (quotations[i].refDocName.value) {
				quotationDocNames.push(quotations[i].refDocName.value);
			}
		}
		$scope.quotationDocNames = quotationDocNames;
	};
	
	$scope.isValidQuotation = function (card) {
		return card.validStatus === 'VALID' && card.refDetail.summary && (card.refDetail.summary.metaData.businessStatus === commonService.CONSTANTS.BUSINESS_STATUS.ACCEPTED || (card.refDetail.summary.metaData.documentStatus === commonService.CONSTANTS.DOCUMENT_STATUS.VALID));
	};
	
    /*********** End of Quotation Summary section **********************/
   
}];