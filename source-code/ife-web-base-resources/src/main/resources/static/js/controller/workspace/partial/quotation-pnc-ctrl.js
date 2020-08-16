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
var QuotationPncDetailCtrl = ['$scope', '$log','$stateParams', '$injector', 'loadingBarService','$location', '$mdDialog', 'commonService', 'commonUIService', 'quotationCoreService', 'accountCoreService', 'salecaseCoreService', 'contactCoreService', 'underwritingCoreService', '$filter','$rootScope', '$timeout',
	function($scope, $log, $stateParams, $injector, loadingBarService,$location, $mdDialog, commonService, commonUIService, quotationCoreService, accountCoreService, salecaseCoreService, contactCoreService, underwritingCoreService, $filter, $rootScope, $timeout) {

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
	$scope.isAdminfee = true;
	
	if(JSON.parse( localStorage.getItem('selected_profile')).role=="AG" && localStorage.getItem('username').includes("@greateasterngeneral.com")){
		$scope.isAdminfee = false;
	}
	$scope.SHIPMENT_TYPE = {
			DOMESTICS : {
				KEY: 1,
				VALUE : 'D'
			},
			EXPORT : {
				KEY: 2,
				VALUE : 'E'
			},
			IMPORT : {
				KEY: 3,
				VALUE : 'I'
			},
			OTHER : {
				KEY: 4,
				VALUE : 'X'
			}
		};

	this.$onInit = function() {
		localStorage.setItem("GeneralPrint","");
		$scope.NumberLine=0;
		$scope.isValid="true";
		$scope.numberType=0;
		$scope.numberTypeAssured=0;
		$scope.disabledConveyance=false;
		quotationCoreService.freeze = false;
		quotationCoreService.newRider = undefined;
		quotationCoreService.selectedContact = undefined;	
		$scope.productName = $stateParams.productName;
		if($scope.moduleService.detail.canPremiumCurrency.value=="IDR"){
            $scope.moduleService.detail.insuredAdminFee.value="10000";
         }else{
            $scope.moduleService.detail.insuredAdminFee.value="0.75";
        }
		
		$scope.shipment=$scope.getShipmentType($scope.moduleService.detail.shipmentType.value);
		$scope.ownerName = localStorage.getItem("username");
		$scope.ctrlName = genCtrlName('detail', commonService.CONSTANTS.MODULE_NAME.QUOTATION, undefined, commonService.CONSTANTS.PRODUCT_LOB.PNC);
		$scope.moduleService = quotationCoreService;
		$scope.moduleService.getProductInformation(commonService.CONSTANTS.PRODUCT_LOB.PNC,$scope.productName)
		$scope.salecaseCoreService = salecaseCoreService;
		$scope.accountCoreService = accountCoreService;
		$scope.contactService = contactCoreService;
		$scope.underwritingCoreService = underwritingCoreService;
		loadingBarService.showLoadingBar();
		$scope.lazyChoiceListName = "AdditionalCoverageMt1,InvoiceCurrency,PremiumCurrency,PortList," +
				"AdditionalCoverageMt2,VoyageFromTo,AddonInsuredCargo,InsuredCargoCode,VessleName,VoyageNum,CargoRoute," +
				"VoyageFromTo,State,District,Country,CoverType,VehicleClass,AdditionalCoverage,PremiumAsAgreed,RelationshipProposer," +
				"NatureBusinessQuotation,Industry,RaceInformation,Education," +
				"Title,Gender,Occupation,MaritalStatus,IDType,Country,YesNo,SmokerStatus,EmploymentStatus," +
				"NatureOfBusiness,DiplomaQualification,WorkingExperience,FinanceRelatedQualifications,SourceOfFund," +
				"AddressType,PremiumFrequency,FundQuotation,RiderNew,LoadingType,LoadingReason,ContractCurrency";
		//ticket 498 GGI hide icon date-picker cover to
		
		$scope.setupStuffs().then(function(){
			loadingBarService.hideLoadingBar();
			$scope.moduleService.lazyListVehicleClass = [];
			
			// Load County From/To
			$scope.loadCountryFromTo();
			// Load Port From/To after Country is initialized.
			$scope.loadPortFromTo();
			
			if(!$scope.moduleService.detail.premiumAsAgreed.value || $scope.moduleService.detail.premiumAsAgreed.value ===""){
				$scope.moduleService.detail.premiumAsAgreed.value ='Y';
				$scope.reSetupConcreteUiStructure(
						$scope.moduleService.detail,
	   				  commonService.CONSTANTS.UI_STRUCTURE.NOT_REMOVE_TEMPLATE_CHILDREN,
	   				  commonService.CONSTANTS.UI_STRUCTURE.EXPECTED_DETAIL_NOT_CHANGED
	   		  );
			}
			
			if(localStorage.getItem('quotationType') !== 'standalone' ){
				$scope.moduleService.detail.typeQuo.value = commonService.CONSTANTS.QUOTATION_TYPE.NORMAL;
			}
			else{
				$scope.moduleService.detail.typeQuo.value = commonService.CONSTANTS.QUOTATION_TYPE.STANDALONE;
			}
			
			$scope.setupActionBar($scope.moduleService.actionBar, undefined, $scope);
			
			$scope.print = (function () {
				var productName = $scope.moduleService.detail.metaData.productName.value;
		        var templateName = commonService.CONSTANTS.DMS_TYPE[productName.toUpperCase()].QUOTATION;
		        var data = {
		            quotation: $scope.moduleService.extractDataModel(quotationCoreService.detail),
		            caseModel: $scope.moduleService.extractDataModel($scope.salecaseCoreService.detail)
		        };
		        
		        function getData() {
					var deferred = $scope.moduleService.$q.defer();
					var getAccountDetail = function() {
						if (accountCoreService.detail) {
							data.account = $scope.moduleService.extractDataModel(accountCoreService.detail);
							$scope.checkSelectedProfile(data.account);
							deferred.resolve(data);
			            } else {
							accountCoreService.getUserDetail().then(function (user) {
								accountCoreService.detail = user;
			                    data.account = $scope.moduleService.extractDataModel(accountCoreService.detail);
			                    deferred.resolve(data);
							});
						}
					};
					var getProspectInfo = function() {
						if(productName!="can"){
						var prospects = $scope.salecaseCoreService.detail.prospects.value;
						$scope.moduleService.searchDocumentByDocName(
							$scope.requestURL,
							commonService.CONSTANTS.MODULE_NAME.CONTACT,
							prospects[0].refBusinessType.value,
							prospects[0].refProductName.value,
							prospects[0].refDocName.value,
							prospects[0].refVersion.value).then(function(gotProspectInfo) {
								data.prospect = gotProspectInfo;
								
							});
						}else{
							getAccountDetail();
						}
					}
					
					getProspectInfo();
					
					return deferred.promise;
		        };
		        
				function print() {
		            // check whether is the accepted quotation or not
					var quoAcceptedAttachment = undefined;
	    			if(quotationCoreService.detail !== undefined && quotationCoreService.detail.metaData.businessStatus.value.toUpperCase() === 'ACCEPTED') {
	    				// find attachment of the accepted quotation
	    				var attachments = $scope.$parent.moduleService.detail.attachments.value;
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
			            	payload.quotation = $scope.moduleService.extractDataModel(quotationCoreService.detail);
			            	$scope.computeQuotation().then(function(data){
			            		if(data == "fail"){
				            		var question = 'MSG-FQ06';
				    				commonUIService.showYesNoDialog(question, function() {
				    				$scope.saveDetail(false);
				    				});
			            		}
			    				else{
			    					//$scope.displayFullAddress(payload.prospect);
			    					return $scope.resourceReaderService.generatePDF($scope.requestURL, payload, templateName);
			    				}
			            	});
			            });
	    			}
		        }
		        return print;
	    }).call(this);
		});
		/*$scope.reOrderCard($scope.card.linkCUiStructure.children);*/
		$scope.isSignRequired = false;
	

	};
	$scope.refreshDataByConveyance = function(){
		if($scope.moduleService.detail.conveyance.value === 'A'){
			$scope.moduleService.detail.vehicleType.value = '';
			$scope.moduleService.detail.registrationNoConveyance.value = '';
			$scope.moduleService.detail.vesselNameConveyance.value = '';
			$scope.moduleService.detail.billOfLadingNo.value = '';
			$scope.moduleService.detail.voyageNo.value = '';
			$scope.disabledConveyance=true;
			$scope.moduleService.detail.conveyanceDetail.value='';
			$scope.moduleService.detail.conveyanceTugBar.value = '';
		}else if($scope.moduleService.detail.conveyance.value === 'L'){
			$scope.moduleService.detail.awbNo.value = '';
			$scope.moduleService.detail.flightNo.value = '';
			$scope.moduleService.detail.vesselNameConveyance.value = '';
			$scope.moduleService.detail.billOfLadingNo.value = '';
			$scope.moduleService.detail.voyageNo.value = '';
			$scope.moduleService.detail.conveyanceDetail.value='';
			$scope.disabledConveyance=true;
			$scope.moduleService.detail.conveyanceTugBar.value = '';
		}else if($scope.moduleService.detail.conveyance.value === 'S'){
			$scope.moduleService.detail.awbNo.value = '';
			$scope.moduleService.detail.flightNo.value = '';
			$scope.moduleService.detail.vehicleType.value = '';
			$scope.moduleService.detail.registrationNoConveyance.value = '';
			$scope.moduleService.detail.conveyanceTugBar.value = '';
			$scope.disabledConveyance=false;
			$scope.moduleService.detail.conveyanceDetail.value=$scope.moduleService.detail.vesselNameConveyance.value;
		}else if($scope.moduleService.detail.conveyance.value === 'B'){
			$scope.moduleService.detail.vehicleType.value = '';
			$scope.moduleService.detail.registrationNoConveyance.value = '';
			$scope.moduleService.detail.vesselNameConveyance.value = '';
			$scope.moduleService.detail.billOfLadingNo.value = '';
			$scope.moduleService.detail.voyageNo.value = '';
			$scope.moduleService.detail.flightNo.value = '';
			$scope.moduleService.detail.awbNo.value = '';
			$scope.moduleService.detail.conveyanceDetail.value='';
			$scope.disabledConveyance=true;
		}
		$scope.refreshDetail(true);
	}
	
	$scope.hideDatepickerIcon = function(){
		setTimeout(function(){
			var child = document.getElementById("quotation_coverTo").parentNode.getElementsByClassName("picker__input")[0]
			document.getElementById("quotation_coverTo").parentNode.removeChild(child)
		}, 300);
	};
	
	$scope.addDayForshipmentEnds = function(){
		if($scope.moduleService.detail.declarationStarts.value){
			var tempDateStart = new Date($scope.moduleService.detail.declarationStarts.value);
			tempDateStart.setDate( tempDateStart.getDate() + 90 );
			$scope.moduleService.detail.declarationEnds.value = moment(tempDateStart.toLocaleDateString(),"MM/DD/YYYY").format("YYYY-MM-DDTHH:mm:ssZZ");
		}
	};
	$scope.getMOCFromIHubForConvenyance= function($event){
		var  scopeParent = $scope;
	       $mdDialog.show({
	    	 targetEvent: $event,
	    	 templateUrl: resourceServerPath + 'view/templates/mdDialog/can/versalSearch.html',
	    	 parent: angular.element(document.body),
	    	 controller: DialogController,
	    	  clickOutsideToClose:true,
		      fullscreen: false // Only for -xs, -sm breakpoints.
	       });
	       function DialogController($scope, $mdDialog, $http) {
	    	   $scope.model=false;
			   $scope.NumberLine =0;
	    	    $scope.changeValue=function(){
					$scope.NumberLine = 0;
					if($("#conveyance").val()==""){
	    	    		$scope.model=false;
	    	    	}
	    	    	else{
	    	    		$scope.model=true;
	    	    	}
	    	    }
	    	   $scope.closeDialog = function() {
	    		   scopeParent.reSetupConcreteUiStructure(
	     				  scopeParent.moduleService.detail,
	     				  commonService.CONSTANTS.UI_STRUCTURE.NOT_REMOVE_TEMPLATE_CHILDREN,
	     				  commonService.CONSTANTS.UI_STRUCTURE.EXPECTED_DETAIL_NOT_CHANGED
	     		  );
		           $mdDialog.hide();
	    	   }
	    	   $scope.findItemForConvenyance=function(){
	    		   if($scope.modelConvenyee!="@"){
	    		   scopeParent.moduleService.getDataForConvenyance($scope.modelConvenyee,1,50).then(function(data){
	    			   $scope.listServelName=data.listVesselsName.vesselName;
					   $scope.NumberLine = 1;
	    		   });
	    		   }else{
	    			   scopeParent.moduleService.getDataForConvenyance("\\"+$scope.modelConvenyee,1,50).then(function(data){
		    			   $scope.listServelName=data.listVesselsName.vesselName;
						   $scope.NumberLine = 1;
		    		   });
	    		   }
	    	   }
	    	   
	    	  $scope.previousSearch=function(){
				  $scope.NumberLine--;
	    		  if($scope.NumberLine>0){
	    			  if($scope.modelConvenyee!="@"){
	    				  scopeParent.moduleService.getDataForConvenyance($scope.modelConvenyee,$scope.NumberLine,50).then(function(data){
	    					  $scope.listServelName=data.listVesselsName.vesselName;
	    				  });
	    			  }else{
	    				  scopeParent.moduleService.getDataForConvenyance("\\"+$scope.modelConvenyee,$scope.NumberLine,50).then(function(data){
	    					  $scope.listServelName=data.listVesselsName.vesselName;
	    				  });
	    			  }
	    		  }else{
					  $scope.NumberLine = 1;
	    		  }
	    	  }
	    	  
	    	  $scope.nextSearch=function(){
				  $scope.NumberLine++;
	    		  if($scope.modelConvenyee!="@"){
	    			  scopeParent.moduleService.getDataForConvenyance($scope.modelConvenyee,$scope.NumberLine,50).then(function(data){
	    				  $scope.listServelName=data.listVesselsName.vesselName;
	    			  });
	    		  }else{
	    			  scopeParent.moduleService.getDataForConvenyance("\\"+$scope.modelConvenyee,$scope.NumberLine,50).then(function(data){
    					  $scope.listServelName=data.listVesselsName.vesselName;
    				  });
	    		  }

	    	  }
	   
	    	  $scope.selectRow=function(item){
	    		  scopeParent.moduleService.detail.vesselNameConveyance.value=angular.copy(item.vesselName);
	    		  scopeParent.moduleService.detail.vessleId.value=angular.copy(item.vesselId);
	    			if(scopeParent.moduleService.detail.conveyance.value=="S"){
	    				scopeParent.moduleService.detail.conveyanceDetail.value=angular.copy(item.vesselName);
					}
	    		  if(item.yearOfBuild==""){
	    			  scopeParent.moduleService.detail.insuredPremiumString.value=angular.copy("1900");
	    		  }else{
	    			  scopeParent.moduleService.detail.insuredPremiumString.value=angular.copy(item.yearOfBuild);
	    		  }
	    		  $scope.closeDialog(); 	    		  
	    	  }
	       }
		
	};
	$scope.changepremiumCurrency=function(value){
		if(value=="IDR"){
			$scope.moduleService.detail.insuredAdminFee.value="10000";
		}else {
			$scope.moduleService.detail.insuredAdminFee.value="0.75";
		}
		
		$scope.computeQuotation(true);
		
	}
	$scope.showMessageDescription=function(ev){
		 $scope.numberType++;
		 if($scope.numberType % 2==0){
			 $scope.enablefield=true;
		 }else{
			 $scope.enablefield=false;
		 }
		
		
	}
	$scope.showMessageDescriptionAssured=function(ev){
			$scope.numberTypeAssured++;
		 if($scope.numberTypeAssured%2==0){
			 $scope.enablefieldAssured=true;
		 }else{
			 $scope.enablefieldAssured=false;
		 }
		
	}

	$scope.getMOCFromIHub = function(){
		
		var itemMock = commonService.CONSTANTS.MOC;
		$scope.moduleService.detail.marineOpenCoverInsured = angular.copy(itemMock.marineOpenCoverInsured);
		var selected_profile = JSON.parse( localStorage.getItem('selected_profile'));
		var role = selected_profile.role ;
		var pasId = selected_profile.pasId;
		var customId =  selected_profile.customerId;
		
		$scope.moduleService.getMockFromIHUB(role, pasId, customId,$scope.moduleService.detail.declarationStarts.value).then(function(metaModel){
			var detail =  $scope.moduleService.detail;
			detail.marineOpenCoverInsured = angular.copy(metaModel.marineOpenCoverInsured);
			$scope.moduleService.mergeMetaModel2UIModel(metaModel, detail);

			if(detail.marineOpenCoverInsured.clients.value.length >0){
				detail.policyHolderId.value =  metaModel.marineOpenCoverInsured.policyHolder.mocClientID.value;
				detail.policyHolderName.value = metaModel.marineOpenCoverInsured.policyHolder.mocClientName.value;
				detail.assuredPolicyHolder.value = metaModel.marineOpenCoverInsured.policyHolder.mocClientName.value;
				
			}
			$scope.reSetupConcreteUiStructure(
				$scope.moduleService.detail,
				commonService.CONSTANTS.UI_STRUCTURE.NOT_REMOVE_TEMPLATE_CHILDREN,
				commonService.CONSTANTS.UI_STRUCTURE.EXPECTED_DETAIL_NOT_CHANGED
			);
			if(metaModel.marineOpenCoverInsured.error.value){
				var marineOpenCoverNumber = $scope.moduleService.findElementInDetail(['marineOpenCoverNumber','value']);
				if(!marineOpenCoverNumber){
					$scope.moduleService.detail.marineOpenCoverNumber.meta.errorCode = 'MSG-E108';
					$scope.reSetupConcreteUiStructure(
						$scope.moduleService.detail,
						commonService.CONSTANTS.UI_STRUCTURE.NOT_REMOVE_TEMPLATE_CHILDREN,
						commonService.CONSTANTS.UI_STRUCTURE.EXPECTED_DETAIL_NOT_CHANGED
					);
				}else{
					$scope.moduleService.detail.marineOpenCoverNumber.meta.errorCode = metaModel.marineOpenCoverInsured.error.value;
					$scope.reSetupConcreteUiStructure(
						$scope.moduleService.detail,
						commonService.CONSTANTS.UI_STRUCTURE.NOT_REMOVE_TEMPLATE_CHILDREN,
						commonService.CONSTANTS.UI_STRUCTURE.EXPECTED_DETAIL_NOT_CHANGED
					);
				}
				

			}else{	
				
				$scope.moduleService.detail.marineOpenCoverDescription.value = metaModel.marineOpenCoverInsured.policyHolder.mocClientName.value;
				$scope.moduleService.detail.conveyance.value =$scope.moduleService.detail.marineOpenCoverInsured.conv.value[0].code.value;
				if($scope.moduleService.detail.marineOpenCoverInsured.conv.value[0].code.value!="S"){
					$scope.disabledConveyance=true;
				}
				$scope.moduleService.detail.conveyanceDescription.value =$scope.moduleService.detail.marineOpenCoverInsured.conv.value[0].description.value;
				$scope.refreshDetail(true).then(function(data){
					$scope.moduleService.mergeMetaModel2UIModel(data, $scope.moduleService.detail);
					$scope.reSetupConcreteUiStructure(
					$scope.moduleService.detail,
					commonService.CONSTANTS.UI_STRUCTURE.NOT_REMOVE_TEMPLATE_CHILDREN,
					commonService.CONSTANTS.UI_STRUCTURE.EXPECTED_DETAIL_NOT_CHANGED);
					$scope.saveQuotationWhenSearchMOC();
					commonUIService.showNotifyMessage("v4.quotation.can.marineopencovercheckingsuccessfully",'success');
				});
				
			}
		});
	};
	$scope.handleConsignee=function(){
		var maxLength = 50;
 	    var mawRow = 4;
 	 $('#consignee').on('input focus keydown keyup', function() {

 	       
 	        var text = $(this).val();
             var a="";
 	       
 	        var lines = text.split("\n"); 
 	 
 	        for (var i = 0; i < lines.length; i++) {
 	            if (lines[i].length > maxLength) {
 	                lines[i] = lines[i].substring(0, maxLength);
 	                a+=lines[i].substring(0, maxLength)+"\n";
 	            }     
 	        }

 	       
 	        while (lines.length > parseInt(mawRow)){    
 	            lines.pop();
 	        }

 	        
 	        $(this).val(lines.join("\n"));
 	       
 	    });
	}
	$scope.handleConveyanceDetail=function(){
		var maxLength = 70;
 	    var mawRow = 1;
 	   $('#conveyanceDetail').on('input focus keydown keyup', function() {

 	       
	        var text = $(this).val();

	       
	        var lines = text.split("\n"); 
	
	        for (var i = 0; i < lines.length; i++) {
	            if (lines[i].length > maxLength) {
	                lines[i] = lines[i].substring(0, maxLength);
	            }     
	        }

	       
	        while (lines.length > parseInt(mawRow)){    
	            lines.pop();
	        }

	        
	        $(this).val(lines.join("\n"));
	    });
		
	}
	$scope.handleLcterms=function(){
		var maxLength = 30;
 	    var mawRow = 1;
 	 $('#lcterm').on('input focus keydown keyup', function() {

 	       
 	        var text = $(this).val();

 	       
 	        var lines = text.split("\n"); 
 	
 	        for (var i = 0; i < lines.length; i++) {
 	            if (lines[i].length > maxLength) {
 	                lines[i] = lines[i].substring(0, maxLength);
 	            }     
 	        }

 	       
 	        while (lines.length > parseInt(mawRow)){    
 	            lines.pop();
 	        }

 	        
 	        $(this).val(lines.join("\n"));
 	    });
	}
	$scope.handleVoyage=function(){
		var maxLength = 50;
 	    var mawRow = 2;
 	 $('#voyage').on('input focus keydown keyup', function() {

 	       
 	        var text = $(this).val();

 	       
 	        var lines = text.split("\n"); 
 	
 	        for (var i = 0; i < lines.length; i++) {
 	            if (lines[i].length > maxLength) {
 	                lines[i] = lines[i].substring(0, maxLength);
 	            }     
 	        }

 	       
 	        while (lines.length > parseInt(mawRow)){    
 	            lines.pop();
 	        }

 	        
 	        $(this).val(lines.join("\n"));
 	    });
	}
	$scope.handleAssured=function(){
		
		 var maxLength = 50;
	 	    var mawRow = 10;
	 	 $('#assured').on('input focus keydown keyup', function() {

	 	       
	 	        var text = $(this).val();

	 	       
	 	        var lines = text.split("\n"); 
	 	
	 	        for (var i = 0; i < lines.length; i++) {
	 	            if (lines[i].length > maxLength) {
	 	                lines[i] = lines[i].substring(0, maxLength);
	 	            }     
	 	        }

	 	       
	 	        while (lines.length > parseInt(mawRow)){    
	 	            lines.pop();
	 	        }

	 	        
	 	        $(this).val(lines.join("\n"));
	 	    });
	}
	$scope.handleinterestInsured=function(){
		 var maxLength = 50;
 	    var mawRow = 10;
 	 $('#interestInsured').on('input focus keydown keyup', function() {

 	       
 	        var text = $(this).val();

 	       
 	        var lines = text.split("\n"); 
 	 
 	        for (var i = 0; i < lines.length; i++) {
 	            if (lines[i].length > maxLength) {
 	                lines[i] = lines[i].substring(0, maxLength);
 	            }     
 	        }

 	       
 	        while (lines.length > parseInt(mawRow)){    
 	            lines.pop();
 	        }

 	        
 	        $(this).val(lines.join("\n"));
 	    });
		
		
	}
	//thien hoang 
	$scope.showGeneralPrinted =function($event){
		var displaygeneralInfoTobePrinted;
		localStorage.setItem("status",$scope.moduleService.findElementInDetail(['businessStatus']).value);
		if($scope.moduleService.detail.generalInfoTobePrinted.value!=null ||$scope.moduleService.detail.generalInfoTobePrinted.value!="undefined"){
			displaygeneralInfoTobePrinted=$scope.moduleService.detail.generalInfoTobePrinted.value;
		 }
		 var parentEl = angular.element(document.body);
		 var  scopeParent = $scope;
	       $mdDialog.show({
	    	 targetEvent: $event,
	    	 templateUrl: resourceServerPath + 'view/templates/mdDialog/can/printDialog.html',
	    	 controller: DialogController
	       });
	       function DialogController($scope,$mdDialog) {
	    	   $scope.isValue=localStorage.getItem("status");
	    	   var isNumber;
	    	   if(displaygeneralInfoTobePrinted!=null ||displaygeneralInfoTobePrinted!=""){
	    		   $scope.geneprinted=displaygeneralInfoTobePrinted;
	    	   }
	    	   localStorage.setItem("arr","");
	    $scope.handleValue=function(){
	    	 var maxLength = 70;
	    	    var mawRow = 150;
	    	 $('#mytext').on('input focus keydown keyup', function() {

	    	       
	    	        var text = $(this).val();

	    	       
	    	        var lines = text.split("\n"); 
	    	  if(lines.length== parseInt(mawRow)){
	    	    $(window).keydown(function(event){
	    	    if(event.keyCode == 13) {
	    	      event.preventDefault();
	    	      return false;
	    	    }
	    	  });	
	    	  }
	    	        for (var i = 0; i < lines.length; i++) {
	    	            if (lines[i].length > maxLength) {
	    	                lines[i] = lines[i].substring(0, maxLength);
	    	            }     
	    	        }

	    	       
	    	        while (lines.length > parseInt(mawRow)){    
	    	            lines.pop();
	    	        }

	    	        
	    	        $(this).val(lines.join("\n"));
	    	    });
	    }
	         $scope.saveDialog=function(){
	        	 
	       getDataModel($scope.geneprinted,localStorage.getItem("arr"));
	           
	        	 $mdDialog.hide();
	         }
	         $scope.closeDialog = function() {
	           $mdDialog.hide();
	         }
	       }
	};
	$scope.showGeneralPrintedForgeneralInfoRef=function($event){
		var displaygeneralInfoRef;
		localStorage.setItem("status",$scope.moduleService.findElementInDetail(['businessStatus']).value);
		if($scope.moduleService.detail.generalInfoReferenceOnly.value!=null ||$scope.moduleService.detail.generalInfoReferenceOnly.value!="undefined"){
			displaygeneralInfoRef=$scope.moduleService.detail.generalInfoReferenceOnly.value;
		 }
		 var  scopeParent = $scope;
	       $mdDialog.show({
	    	 targetEvent: $event,
	    	 templateUrl: resourceServerPath + 'view/templates/mdDialog/can/referenceDialog.html',
	    	 controller: DialogController
	       });
	       function DialogController($scope,$mdDialog) {
	    	   var isNumber;
	    	   $scope.isValue=localStorage.getItem("status");
	    	   if(displaygeneralInfoRef!=null ||displaygeneralInfoRef!=""){
	    		   $scope.generalInfoRef=displaygeneralInfoRef;
	    	   }
	    	   localStorage.setItem("arr","");
	    	   $scope.handleValue=function(){
	  	    	 var maxLength = 70;
	  	    	    var mawRow = 150;
	  	    	 $('#generalInfo').on('input focus keydown keyup', function() {

	  	    	       
	  	    	        var text = $(this).val();

	  	    	       
	  	    	        var lines = text.split("\n"); 
	  	    	  if(lines.length== parseInt(mawRow)){
	  	    	    $(window).keydown(function(event){
	  	    	    if(event.keyCode == 13) {
	  	    	      event.preventDefault();
	  	    	      return false;
	  	    	    }
	  	    	  });	
	  	    	  }
	  	    	        for (var i = 0; i < lines.length; i++) {
	  	    	            if (lines[i].length > maxLength) {
	  	    	                lines[i] = lines[i].substring(0, maxLength);
	  	    	            }     
	  	    	        }

	  	    	       
	  	    	        while (lines.length > parseInt(mawRow)){    
	  	    	            lines.pop();
	  	    	        }

	  	    	        
	  	    	        $(this).val(lines.join("\n"));
	  	    	    });
	  	    }
	    	    $scope.saveDialog=function(){
	        	 
	       getDataModelForgeneralInfoRef($scope.generalInfoRef,localStorage.getItem("arr"));
	           
	        	 $mdDialog.hide();
	         }
	         $scope.closeDialog = function() {
	           $mdDialog.hide();
	         }
	       }
	}
	function getDataModelForgeneralInfoRef(item,isNumber){
		var dem=0;
		$scope.moduleService.detail.generalInfoReferenceOnly.value=item;
		for(var i=0;i<$scope.moduleService.detail.generalInfoReferenceOnly.value.length;i++){
			 if($scope.moduleService.detail.generalInfoReferenceOnly.value[i]=="\n"){
				 dem=i;
				 break;
			 }
		}
		if(dem==0){
			dem=item.length;
		}
		
		$scope.generalInfoReferenceOnly=item.slice(0,dem);
		  
		
	}
	function getDataModel(item,isNumber){
		var dem=0;

		$scope.moduleService.detail.generalInfoTobePrinted.value=item;
		for(var i=0;i<$scope.moduleService.detail.generalInfoTobePrinted.value.length;i++){
			 if($scope.moduleService.detail.generalInfoTobePrinted.value[i]=="\n"){
				 dem=i;
				 break;
			 }
		}
		if(dem==0){
			dem=item.length;
		}
		
		$scope.generalInfoTobePrinted=item.slice(0,dem);
		  
		
	}

	
	$scope.checkOpenCardWhenFinishDeclaration = function (card){
		var ischeck=true;
		var checkLine=0;
		var checkLinegeneralInfoTobePrinted=0;
		if($scope.moduleService.detail.marineOpenCoverNumber.value !== $scope.moduleService.detail.marineOpenCoverInsured.id){
			ischeck = false;
			commonUIService.showNotifyMessage('v4.quotation.can.checkmarinefirst');
			
		}else{
			if($scope.moduleService.detail.marineOpenCoverInsured.error.value || !$scope.moduleService.detail.marineOpenCoverNumber.value){
				ischeck = false;
				commonUIService.showNotifyMessage('v4.quotation.can.declarationFinishcard');
				
			}
		}
		if(ischeck==true){
			if($scope.moduleService.detail.generalInfoReferenceOnly.value==null ||$scope.moduleService.detail.generalInfoReferenceOnly.value==""){
				$scope.generalInfoReferenceOnly="";
			
				
			}else{
				for(var i=0;i<$scope.moduleService.detail.generalInfoReferenceOnly.value.length;i++){
					 if($scope.moduleService.detail.generalInfoReferenceOnly.value[i]=="\n"){
						 checkLine=i;
						 break;
					 }
				}
				
					
					if(checkLine==0){
						checkLine=$scope.moduleService.detail.generalInfoReferenceOnly.value.length;
					}
				   
					$scope.generalInfoReferenceOnly=$scope.moduleService.detail.generalInfoReferenceOnly.value.slice(0,checkLine);
					
				}
			if($scope.moduleService.detail.generalInfoTobePrinted.value==null ||$scope.moduleService.detail.generalInfoTobePrinted.value==""){
				$scope.generalInfoTobePrinted="";
			
				
			}else{
				for(var i=0;i<$scope.moduleService.detail.generalInfoTobePrinted.value.length;i++){
					 if($scope.moduleService.detail.generalInfoTobePrinted.value[i]=="\n"){
						 checkLinegeneralInfoTobePrinted=i;
						 break;
					 }
				}
				
					
					if(checkLinegeneralInfoTobePrinted==0){
						checkLinegeneralInfoTobePrinted=$scope.moduleService.detail.generalInfoTobePrinted.value.length;
					}
				   
					$scope.generalInfoTobePrinted=$scope.moduleService.detail.generalInfoTobePrinted.value.slice(0,checkLinegeneralInfoTobePrinted);
					
				}
	
		}
		
		if($scope.moduleService.detail!=undefined){
			var policyHolder=$scope.moduleService.detail.policyHolderName.value;
			if(policyHolder!=null){
				 if(policyHolder.length>20){
					 $scope.moduleService.detail.policyHolderName.value=policyHolder.slice(0,25);
				 }
			}
			}
		var selected_profile = JSON.parse( localStorage.getItem('selected_profile'));
		var role = selected_profile.role ;
		if(role=="PO"){
			$scope.isRole="PO";
		}
		
		if(ischeck == true  && card.name === "illustration:premiumSummary" && $scope.moduleService.detail.metaData.businessStatus.value !== commonService.CONSTANTS.BUSINESS_STATUS.ACCEPTED){
			$scope.computeQuotation(true);
		}
		
		return ischeck;
	};
	
	
	$scope.PopulateDataForAssured = function (selectItem){
		 $scope.moduleService.detail.marineOpenCoverInsured.clients.value.forEach(function(item){
			if(item.mocClientID.value === selectItem ){
				$scope.moduleService.detail.policyHolderName.value  = item.mocClientName.value;
				$scope.moduleService.detail.assuredPolicyHolder.value  = item.mocClientName.value;
				
			}
		 });
	
	};
	$scope.bindToComputePre = function(position){
		$scope.moduleService.detail.premiumSummary.insuredCargoSummary.value[position].insuredCargoDescription.value = $scope.moduleService.detail.insuredCargo.value[position].insuredCargoDescription.value;
		$scope.moduleService.detail.premiumSummary.insuredCargoSummary.value[position].insuredCargoCode.value = $scope.moduleService.detail.insuredCargo.value[position].insuredCargoCode.value
	};
	$scope.dipsplayAddOnInsuredCargo = function(position){
		var addonInsuredCargoLazy = $scope.moduleService.lazyChoiceList.AddonInsuredCargo;
		var filterProductName = undefined;
		var positionOfProductName = undefined;
		var displayAddOnInsuredCargo = $scope.moduleService.detail.insuredCargo.value[position].addonInsuredCargo.value;
		var initPositionHasValue = 0;
		for(var i = 0; i < addonInsuredCargoLazy[0].group.length; i++){
			if($scope.productName == addonInsuredCargoLazy[0].group[i]){
				positionOfProductName = i;
				break
			}
		}
		if(commonService.hasValueNotEmpty(positionOfProductName)){
			for(var j = 1; j < addonInsuredCargoLazy.length; j++){
				if(addonInsuredCargoLazy[j].group[positionOfProductName] === "1" ){
					for(var k = initPositionHasValue; k< displayAddOnInsuredCargo.length;k++){
						if(!commonService.hasValueNotEmpty(displayAddOnInsuredCargo[k].key.value) && !commonService.hasValueNotEmpty(displayAddOnInsuredCargo[k].description.value)){
							displayAddOnInsuredCargo[k].key.value = addonInsuredCargoLazy[j].key;
							displayAddOnInsuredCargo[k].description.value = addonInsuredCargoLazy[j].group[4];
							initPositionHasValue++
						}
						break;
					}
					
				}
			}
			$scope.moduleService.detail.insuredCargo.value[position].addonInsuredCargo.value = displayAddOnInsuredCargo;			
		}
	}
	
	$scope.filtervoyNumBasedOnvesselName = function(selectedItem){
		if(commonService.hasValueNotEmpty(selectedItem)){
			$scope.voyageFromDescription = '';
			$scope.voyageToDescription = '';
			$scope.moduleService.detail.voyageFrom.value = '';
			$scope.moduleService.detail.voyageTo.value = '';
			var vesselName = $scope.moduleService.lazyChoiceList.VessleName;
			var voyageNum = $scope.moduleService.lazyChoiceList.VoyageNum;
			var groupFollowingVesselName = [];
			//find group
			for(var i=0;i < vesselName.length; i++){
				if(selectedItem == vesselName[i].key){
					groupFollowingVesselName = vesselName[i].key;
					break;
				}
			}
			//filtering group
			var voyageNumAccordingName = [];
			angular.forEach(voyageNum,function(num,index){
				if(groupFollowingVesselName == num.group[1]){
					voyageNumAccordingName.push(num);
				}
			})
			$scope.filteredVesselName = voyageNumAccordingName;
			return voyageNumAccordingName;
		}
	}
	
	$scope.filtervoyNumInit = function(selectedItem){
		if(commonService.hasValueNotEmpty(selectedItem)){
			var vesselName = $scope.moduleService.lazyChoiceList.VessleName;
			var voyageNum = $scope.moduleService.lazyChoiceList.VoyageNum;
			var groupFollowingVesselName = [];
			//find group
			for(var i=0;i < vesselName.length; i++){
				if(selectedItem == vesselName[i].key){
					groupFollowingVesselName = vesselName[i].key;
					break;
				}
			}
			//filtering group
			var voyageNumAccordingName = [];
			angular.forEach(voyageNum,function(num,index){
				if(groupFollowingVesselName == num.group[1]){
					voyageNumAccordingName.push(num);
				}
			})
			$scope.filteredVesselName = voyageNumAccordingName;
			return voyageNumAccordingName;
		}
	}
	$scope.filterVoyageFromTo = function(voyNumber){
		//find voyNumber
		if(commonService.hasValueNotEmpty(voyNumber)){
			var voyageNum = $scope.moduleService.lazyChoiceList.VoyageNum;
			var selectedVoyNumber = [];
			angular.forEach(voyageNum,function(num,index){
				if(voyNumber == num.group[0]){
					selectedVoyNumber.push(num);
				}
			})
			var voyageFromTo = $scope.moduleService.lazyChoiceList.VoyageFromTo;
			var codeVoyageFrom = selectedVoyNumber[0].group[2];
			var codeVoyageTo = selectedVoyNumber[0].group[3];
			angular.forEach(voyageFromTo,function(FromTo,index){
				if(codeVoyageFrom == FromTo.key){
					$scope.moduleService.detail.voyageFrom.value = FromTo.key;
					$scope.moduleService.detail.voyageFromDesc.value = FromTo.group[0];
				}
			})
			angular.forEach(voyageFromTo,function(FromTo,index){
				if(codeVoyageTo == FromTo.key){
					$scope.moduleService.detail.voyageTo.value = FromTo.key;
					$scope.moduleService.detail.voyageToDesc.value = FromTo.group[0];
				}
			})
		}
	};
	//display description for pdf
	$scope.displayVoyFromDes = function(voyFrom){
		var voyageFromTo = $scope.moduleService.lazyChoiceList.VoyageFromTo;
		angular.forEach(voyageFromTo,function(From,index){
			if(voyFrom == From.key){
				$scope.moduleService.detail.voyageFromDesc.value = From.group[0];
			}
		})
	};
	
	$scope.displayVoyToDes = function(voyTo){
		var voyageFromTo = $scope.moduleService.lazyChoiceList.VoyageFromTo;
		angular.forEach(voyageFromTo,function(To,index){
			if(voyTo == To.key){
				$scope.moduleService.detail.voyageToDesc.value = To.group[0];
			}
		})
	};
	$scope.displayAddtionalCoverage = function(key){
		var addCovDes = undefined;
		if($scope.productName == "mt1"){
			var addtionalCoverages = $scope.moduleService.lazyChoiceList.AdditionalCoverageMt1;
		}
		else if($scope.productName == "mt2"){
			var addtionalCoverages = $scope.moduleService.lazyChoiceList.AdditionalCoverageMt2;
		}
		angular.forEach(addtionalCoverages,function(addtionalCoverage,index){
			if(key == addtionalCoverage.key){
				addCovDes = addtionalCoverage.group[0];
			}
		})
		return addCovDes;
	}
	$scope.processCoverTime = function(){
		if(commonService.hasValueNotEmpty($scope.moduleService.detail.coverFrom.value) && commonService.hasValueNotEmpty($scope.moduleService.detail.coverTo.value)){
			var coverFrom = $scope.moduleService.detail.coverFrom.value;
			var coverTo   = $scope.moduleService.detail.coverTo.value;
			var coverFromArr = coverFrom.split("");
			var coverToArr = coverTo.split("");
			coverToArr[11] = coverFromArr[11];
			coverToArr[12] = coverFromArr[12];
			coverToArr = coverToArr.join('');
			$scope.moduleService.detail.coverTo.value = coverToArr;
		};
	}

	$scope.checkSelectedProfile = function(accountDetail) {
		var selectedProfile = JSON.parse(localStorage.getItem('selected_profile'));
		
		accountDetail.profile.insurerProfiles.forEach(function(item) {
			if (selectedProfile.dn == item.dn) {
				item.isCheck = true;
			} else {
				item.isCheck = false;
			}
		});
		return;
	}
	
	$scope.filterVehicleClass = function(){
		if(!commonService.hasValueNotEmpty($scope.moduleService.lazyListVehicleClass)){
			angular.forEach($scope.moduleService.lazyChoiceList.VehicleClass, function(item, index){
				angular.forEach(item.group,function(itemGroup, indexGroup){
					if (itemGroup == $scope.productName.toUpperCase()){
						$scope.moduleService.lazyListVehicleClass.push(item)
					}
				})
			})
		}
	}
	$scope.checkAcceptQuotation = function (){
    	var result = false;
        var detailQuotation = $scope.salecaseCoreService.detail.quotations.value;
        var lengthDetailQuotation = $scope.salecaseCoreService.detail.quotations.value.length;
        for (var i = 0; i<lengthDetailQuotation; i++)
        	if (detailQuotation[i].refBusinessStatus.value == "ACCEPTED") {
        		result = true;
        		break;
        	}
        return result;
     }
	
	$scope.setupInitialData = function() {
		if(localStorage.getItem('quotationType') !== 'standalone' ){
		if($scope.checkAcceptQuotation()
				|| ($scope.moduleService.detail.metaData.businessStatus.value == commonService.CONSTANTS.BUSINESS_STATUS.DR && $scope.moduleService.detail.quotationType.value == 'UW_QUO')) {
			$scope.moduleService.freeze = true;
		}
		}
		$scope.moduleService.lazyListFund = [];
		angular.forEach($scope.moduleService.detail.basicPlan.funds.value, function(item_1, index_1){
			$scope.moduleService.lazyListFund.push(angular.copy($scope.moduleService.findElementInElement($scope.moduleService.lazyChoiceList,['FundQuotation'])))
		});
		$scope.moduleService.lazyListRider = [];
		angular.forEach($scope.moduleService.detail.riders.value, function(){
			$scope.moduleService.lazyListRider.push(angular.copy($scope.moduleService.findElementInElement($scope.moduleService.lazyChoiceList,['RiderNew'])))
		});
		
		$scope.processLoadingList();
		
	};

	/************************************************************************************* */
	/******************************** End lifecycle methods ****************************** */
	/************************************************************************************* */	
	//computeTag(commonService.CONSTANTS.VPMS_MAPPING_FIELD.AGE_NEAREST_BIRTHDAY, false)
	$scope.computeAgeNearestBirthLifeInsured = function(tagName, isNeedRefresh) {
		var self = this;
		var deferred = self.moduleService.$q.defer();
		$scope.validateTag(tagName).then( function (data) {
			if(commonService.hasValueNotEmpty($scope.moduleService.findElementInElement(data, ['lifeInsured', 'person', 'birthDate', 'meta', 'errorCode']))) {
				deferred.resolve("fail");
			} else {
				$scope.computeTag(tagName, isNeedRefresh).then(function (data) {
					return data;
				});
			}
		});
		return deferred.promise;
	}
	
	$scope.getShipmentType = function(shipmentTypeValue) {
		if (shipmentTypeValue === $scope.SHIPMENT_TYPE.DOMESTICS.VALUE) {
			$scope.moduleService.countryTo='true';
			$scope.moduleService.countryFrom='false';
			
			return $scope.SHIPMENT_TYPE.DOMESTICS.KEY;
		} else if (shipmentTypeValue === $scope.SHIPMENT_TYPE.EXPORT.VALUE) {
			$scope.moduleService.countryFrom='true';
			$scope.moduleService.countryTo='false';
			$scope.moduleService.detail.countryFrom.value="ID";
			$scope.moduleService.detail.countryFromDescription.value="INDONESIA";
			
			return $scope.SHIPMENT_TYPE.EXPORT.KEY;
		} else if (shipmentTypeValue === $scope.SHIPMENT_TYPE.IMPORT.VALUE) {
			$scope.moduleService.countryFrom='false';
			$scope.moduleService.countryTo='true';
			$scope.moduleService.detail.countryTo.value="ID";
			$scope.moduleService.detail.countryToDescription.value="INDONESIA";
			
			return $scope.SHIPMENT_TYPE.IMPORT.KEY;
		} else {
			$scope.moduleService.countryFrom='false';
			$scope.moduleService.countryTo='false';
			
			return $scope.SHIPMENT_TYPE.OTHER.KEY;
		}
	}
	
	$scope.changeShipmentType=function(value){
		
		if(value === $scope.SHIPMENT_TYPE.DOMESTICS.VALUE){
		$scope.shipment=$scope.SHIPMENT_TYPE.DOMESTICS.KEY;
		$scope.moduleService.countryTo='true';
		$scope.moduleService.countryFrom='false';
		if($scope.moduleService.detail.countryFrom.value!="" ||$scope.moduleService.detail.countryFrom.value!=null){
		$scope.moduleService.detail.countryTo.value=$scope.moduleService.detail.countryFrom.value;
		$scope.moduleService.detail.countryToDescription.value=$scope.moduleService.detail.countryFromDescription.value;
		}
		else{
			$scope.moduleService.detail.countryTo.value=null;
			$scope.moduleService.detail.countryToDescription.value=null;
		}
		
		$scope.moduleService.detail.portTo.value=$scope.moduleService.detail.portFrom.value;
	
		//$scope.moduleService.detail.countryToDescription.value=$scope.moduleService.detail.countryFromDescription.value;
		} else if(value === $scope.SHIPMENT_TYPE.EXPORT.VALUE){
		$scope.moduleService.countryFrom='true';
		$scope.moduleService.countryTo='false'; 
		$scope.shipment=$scope.SHIPMENT_TYPE.EXPORT.KEY;
		$scope.moduleService.detail.countryFrom.value="ID";
		$scope.moduleService.detail.countryFromDescription.value="INDONESIA";
		$scope.moduleService.detail.countryTo.value=null;
		$scope.moduleService.detail.countryToDescription.value=null;
		$scope.moduleService.detail.portFrom.value='';
	
	}else if(value === $scope.SHIPMENT_TYPE.IMPORT.VALUE){
		$scope.moduleService.countryFrom='false';
		$scope.moduleService.countryTo='true';
		$scope.shipment=$scope.SHIPMENT_TYPE.IMPORT.KEY;
		$scope.moduleService.detail.countryTo.value="ID";
		$scope.moduleService.detail.countryToDescription.value="INDONESIA";
		$scope.moduleService.detail.countryFrom.value=null;
		$scope.moduleService.detail.countryFromDescription.value=null;
		$scope.moduleService.detail.portTo.value='';
	
		
	}else{
		$scope.shipment = $scope.SHIPMENT_TYPE.OTHER.KEY;
		$scope.moduleService.countryFrom='false';
		$scope.moduleService.countryTo='false';
		$scope.moduleService.detail.countryFrom.value =null;
		$scope.moduleService.detail.countryFromDescription.value=null;
		$scope.moduleService.detail.countryTo.value =null;
		$scope.moduleService.detail.countryToDescription.value=null;
		$scope.moduleService.detail.portTo.value='';
		$scope.moduleService.detail.portFrom.value='';
	
	}
		$scope.loadCountryFromTo();
		$scope.loadPortFromTo();
		$scope.moduleService.detail.portFrom.value="";
   		$scope.moduleService.detail.portTo.value="";
  
		
   	
	};
	
	$scope.changeCountryFrom=function(value){
		var vetifyCountryTo;
		var country;
		 if(parseInt($scope.shipment)==$scope.SHIPMENT_TYPE.DOMESTICS.KEY){
	    	   $scope.moduleService.countryTo='true';
	    	   if($scope.moduleService.detail.countryFrom.value!="" ||$scope.moduleService.detail.countryFrom.value!=null){
	    			$scope.moduleService.detail.countryTo.value=$scope.moduleService.detail.countryFrom.value;
	    			$scope.countryFromListName = $scope.moduleService.findElementInDetail(['marineOpenCoverInsured','voyageFromListMOC','value']);
	    			// Filter by Country Code
	    			angular.forEach($scope.countryFromListName,
	    					function(item, key) {
	    						
	    						// Filter the element of CountryFrom when shipment type equals to IMPORT and not equals Country To
	    						if (item.code.value==$scope.moduleService.detail.countryTo.value) {
	    							$scope.moduleService.detail.countryToDescription.value=item.description.value;
	    						}
	    			});
	    			
	    			
	    			}
	    			else{
	    				$scope.moduleService.detail.countryTo.value=null;
	    				$scope.moduleService.detail.countryToDescription.value=null;
	    			}
			}else if(parseInt($scope.shipment)==$scope.SHIPMENT_TYPE.EXPORT.KEY){
				$scope.moduleService.countryFrom='true';
				$scope.moduleService.countryTo='false'; 
				$scope.moduleService.detail.countryFrom.value="ID";
				$scope.moduleService.detail.countryFromDescription.value="INDONESIA";
			}else if(parseInt($scope.shipment)==$scope.SHIPMENT_TYPE.IMPORT.KEY){
				$scope.moduleService.countryFrom='false';
				$scope.moduleService.detail.countryToDescription.value="INDONESIA";
				$scope.moduleService.countryTo='true';
				$scope.moduleService.detail.countryTo.value="ID";
			}else{
				$scope.moduleService.countryFrom='false';
				$scope.moduleService.countryTo='false'; 
			} 

			 $scope.loadCountryFromTo();
			 $scope.loadPortFromTo();
			 $scope.moduleService.detail.portFrom.value="";
   			 $scope.moduleService.detail.portTo.value="";
   			
   		
	   			
	};
	
	$scope.changeCountryTo = function(value) {
		var vetifyCountryFrom;
		var country;
		$scope.loadCountryFromTo();
		$scope.loadPortFromTo();
		$scope.moduleService.detail.portFrom.value="";
   		$scope.moduleService.detail.portTo.value="";
	
		
	};
	$scope.loadCountryFromTo = function() {
		// Initialize shipment type value
		var shipmentType = parseInt($scope.shipment) || '';
		
		// Port From load by Country From
 		$scope.countryFromListName = $scope.moduleService.findElementInDetail(['marineOpenCoverInsured','voyageFromListMOC','value']);
 		$scope.countryFromFilterList = [];
 		var selfValTo = $scope.moduleService.detail.countryTo.value || '';
		// Filter by Country Code
		angular.forEach($scope.countryFromListName,
				function(item, key) {
					
					// Filter the element of CountryFrom when shipment type equals to IMPORT and not equals Country To
					if (($scope.SHIPMENT_TYPE.IMPORT.KEY === shipmentType || $scope.SHIPMENT_TYPE.OTHER.KEY === shipmentType)
							&& item.code.value !== null && item.code.value !== selfValTo) {
						$scope.countryFromFilterList.push(item);
					}
		});
		
		// Update filter list
		if ($scope.countryFromFilterList.length > 0) {
			$scope.countryFromListName = $scope.countryFromFilterList;
			if (selfValTo !== '' && selfValTo === $scope.moduleService.detail.countryFrom.value) {
				$scope.moduleService.detail.countryFrom.value = $scope.countryFromListName[0].code.value;
			}
		}
		
		// Port To load by Country To
		$scope.countryToListName = $scope.moduleService.findElementInDetail(['marineOpenCoverInsured','voyageToListMOC','value']);
		$scope.countryToFilterList = [];
		var selfValFrom = $scope.moduleService.detail.countryFrom.value || '';
		// Filter by Country Code
   		angular.forEach($scope.countryToListName,
   				function(item, key) {
   			
   				// Filter the element of CountryTo when shipment type equals to EXPORT and not equals Country From
	   			if (($scope.SHIPMENT_TYPE.EXPORT.KEY === shipmentType || $scope.SHIPMENT_TYPE.OTHER.KEY === shipmentType)
	   					&& item.code.value !== null	&& item.code.value !== selfValFrom) {
					$scope.countryToFilterList.push(item);
				}
		});
   		
   		// Update filter list
		if ($scope.countryToFilterList.length > 0) {
			$scope.countryToListName = $scope.countryToFilterList;
			if (selfValFrom !== '' && selfValFrom === $scope.moduleService.detail.countryTo.value) {
				$scope.moduleService.detail.countryTo.value = $scope.countryToListName[0].code.value;
			}
		}
	  
	};
	
	$scope.loadPortFromTo = function(){
		// Port From load by Country From
 		$scope.portFromListName = [];
 		var selfValFrom = $scope.moduleService.detail.countryFrom.value || '';
		// Filter by Country Code
		angular.forEach($scope.moduleService.lazyChoiceList.PortList,
				function(item, key) {
					if (item.key !== null && item.key.substring(0, 2) === selfValFrom) {
						$scope.portFromListName.push(item);
					}
				});
		
		// Port To load by Country To
		$scope.portToListName = [];
		var selfValTo = $scope.moduleService.detail.countryTo.value || '';
		// Filter by Country Code
   		angular.forEach($scope.moduleService.lazyChoiceList.PortList,
   				function(item, key) {
   					if (item.key !== null && item.key.substring(0, 2) === selfValTo) {
   						$scope.portToListName.push(item);
   					}
   				});
	};
	$scope.saveQuotationWhenSearch = function(isShowComMessage) {
		var self = this;
		var deferred = self.moduleService.$q.defer();
				
				//this quotation save for quotation create from BC
				$scope.saveDetailWhenSearch().then(function(data){
					
					if (data.metaData.documentStatus.value === 'INVALID') {
						if(isShowComMessage == true)
							commonUIService.showNotifyMessage('v4.user.error.inputValidateFail');
						deferred.resolve("fail");
					} else {
						

					}	
				});
				return deferred.promise;
			

		
	}
	
	$scope.copyDescriptionPortTo = function(code){
		angular.forEach($scope.portToListName,
			function(item, index) {
				if (item.key !== null && item.key === code) {
					$scope.moduleService.detail.portToDescription.value =$scope.portToListName[index].group[0];
				}
		});
	}
	
	
	$scope.copyDescriptionPortFrom = function(code){
		angular.forEach($scope.portFromListName,
			function(item, index) {
				if (item.key !== null && item.key === code) {
					$scope.moduleService.detail.portFromDescription.value =$scope.portFromListName[index].group[0];
				}
		});
	}
	
	$scope.computeQuotation = function(isShowComMessage, accceptAction) {
		var self = this;
		var deferred = self.moduleService.$q.defer();

		if($scope.moduleService.detail.marineOpenCoverNumber.value !== $scope.moduleService.detail.marineOpenCoverInsured.id){
			commonUIService.showNotifyMessage('v4.quotation.can.checkmarinefirst');
		}else{
			
			//this quotation save for quotation create from BC
			if(localStorage.getItem('quotationType') !== 'standalone' ){
				$scope.moduleService.detail.typeQuo.value = commonService.CONSTANTS.QUOTATION_TYPE.NORMAL;
			}
			else{
				$scope.moduleService.detail.typeQuo.value = commonService.CONSTANTS.QUOTATION_TYPE.STANDALONE;
			}
			$scope.validateDetail(accceptAction).then(function(data){
				var vertify=0;
				var check=0;
				for(var i=0;i<$scope.moduleService.detail.marineOpenCoverInsured.shipmentMOC.value.length;i++){
					for(var j=0;j<$scope.moduleService.detail.marineOpenCoverInsured.shipmentMOC.value[i].vfromList.value.length;j++){
						    if($scope.moduleService.detail.marineOpenCoverInsured.shipmentMOC.value[i].vfromList.value[j].mocVFromType.value=="C"){
						    	if($scope.moduleService.detail.marineOpenCoverInsured.shipmentMOC.value[i].vfromList.value[j].mocVFromCode.value==$scope.moduleService.detail.countryFrom.value){
						    		  vertify=vertify+1;
						    		  break;
						    	}
						    	
						    	
						    }
					}
				}
				for(var i=0;i<$scope.moduleService.detail.marineOpenCoverInsured.shipmentMOC.value.length;i++){
					for(var j=0;j<$scope.moduleService.detail.marineOpenCoverInsured.shipmentMOC.value[i].vtoList.value.length;j++){
						    if($scope.moduleService.detail.marineOpenCoverInsured.shipmentMOC.value[i].vtoList.value[j].mocVToType.value=="C"){
						    	if($scope.moduleService.detail.marineOpenCoverInsured.shipmentMOC.value[i].vtoList.value[j].mocVToCode.value==$scope.moduleService.detail.countryTo.value){
						    		  check=check+1;
						    		  break;
						    	}
						    	
						    	
						    }
					}
				}
				 if(vertify>0 && check == 0){
					 $scope.moduleService.detail.countryTo.meta.errorCode="MSG-E113Q";
				
				data.metaData.documentStatus.value = 'INVALID';
			}else if(vertify==0 && check > 0){
				$scope.moduleService.detail.countryFrom.meta.errorCode="MSG-E113Q";
				data.metaData.documentStatus.value = 'INVALID';
			}
			else if(vertify==0 && check == 0){
				$scope.moduleService.detail.countryFrom.meta.errorCode="MSG-E113Q";
				$scope.moduleService.detail.countryTo.meta.errorCode="MSG-E113Q";
				data.metaData.documentStatus.value = 'INVALID';
			}
				if (data.metaData.documentStatus.value === 'INVALID') {
					if(isShowComMessage == true)
						commonUIService.showNotifyMessage('v4.user.error.inputValidateFail');
					deferred.resolve("fail");
				} else {
					
					$scope.computeDetail().then(function(){
						
						if($scope.moduleService.detail.conveyance.value === 'A'){
							$scope.moduleService.detail.vehicleType.value = '';
							$scope.moduleService.detail.registrationNoConveyance.value = '';
							$scope.moduleService.detail.vesselNameConveyance.value = '';
							$scope.moduleService.detail.billOfLadingNo.value = '';
							$scope.moduleService.detail.voyageNo.value = '';
							$scope.moduleService.detail.conveyanceTugBar.value = '';
						}else if($scope.moduleService.detail.conveyance.value === 'L'){
							$scope.moduleService.detail.awbNo.value = '';
							$scope.moduleService.detail.flightNo.value = '';
							$scope.moduleService.detail.vesselNameConveyance.value = '';
							$scope.moduleService.detail.billOfLadingNo.value = '';
							$scope.moduleService.detail.voyageNo.value = '';
							$scope.moduleService.detail.conveyanceTugBar.value = '';
						}else if($scope.moduleService.detail.conveyance.value === 'S'){
							$scope.moduleService.detail.awbNo.value = '';
							$scope.moduleService.detail.flightNo.value = '';
							$scope.moduleService.detail.vehicleType.value = '';
							$scope.moduleService.detail.registrationNoConveyance.value = '';
							$scope.moduleService.detail.conveyanceTugBar.value = '';
						}else if($scope.moduleService.detail.conveyance.value === 'B'){
							$scope.moduleService.detail.vehicleType.value = '';
							$scope.moduleService.detail.registrationNoConveyance.value = '';
							$scope.moduleService.detail.vesselNameConveyance.value = '';
							$scope.moduleService.detail.billOfLadingNo.value = '';
							$scope.moduleService.detail.voyageNo.value = '';
							$scope.moduleService.detail.flightNo.value = '';
							$scope.moduleService.detail.awbNo.value = '';
						}
					
						$scope.saveDetail(false).then(function() {
							deferred.resolve("success");
						});

					});
				}	
			});
			return deferred.promise;
		}

		
	}
	$scope.formatCovertoDate = function() {
		var coverFrom = $scope.moduleService.findElementInDetail(["coverFrom"]).value.split("T");
		var coverTo = $scope.moduleService.findElementInDetail(["coverTo"]).value.split("T");
		$scope.moduleService.findElementInDetail(["coverTo"]).value = coverTo[0] + "T" + coverFrom[1];
	}
	$scope.saveQuotationWhenSearchMOC=function(){
		var self = this;
		var deferred = self.moduleService.$q.defer();
				//this quotation save for quotation create from BC
				$scope.saveDetailWhenSearch().then(function(data){
					
					if (data.metaData.documentStatus.value === 'INVALID') {
						if(isShowComMessage == true)
							commonUIService.showNotifyMessage('v4.user.error.inputValidateFail');
						deferred.resolve("fail");
					} else {
						

					}	
				});
				return deferred.promise;
		
	}
	$scope.saveQuotation = function() {	
		if($scope.moduleService.detail.marineOpenCoverNumber.value !== $scope.moduleService.detail.marineOpenCoverInsured.id){
			commonUIService.showNotifyMessage('v4.quotation.can.checkmarinefirst');
		}else{
			
			if($scope.moduleService.detail.conveyance.value === 'A'){
				$scope.moduleService.detail.vehicleType.value = '';
				$scope.moduleService.detail.registrationNoConveyance.value = '';
				$scope.moduleService.detail.vesselNameConveyance.value = '';
				$scope.moduleService.detail.billOfLadingNo.value = '';
				$scope.moduleService.detail.voyageNo.value = '';
				$scope.moduleService.detail.conveyanceTugBar.value = '';
			}else if($scope.moduleService.detail.conveyance.value === 'L'){
				$scope.moduleService.detail.awbNo.value = '';
				$scope.moduleService.detail.flightNo.value = '';
				$scope.moduleService.detail.vesselNameConveyance.value = '';
				$scope.moduleService.detail.billOfLadingNo.value = '';
				$scope.moduleService.detail.voyageNo.value = '';
				$scope.moduleService.detail.conveyanceTugBar.value = '';
			}else if($scope.moduleService.detail.conveyance.value === 'S'){
				$scope.moduleService.detail.awbNo.value = '';
				$scope.moduleService.detail.flightNo.value = '';
				$scope.moduleService.detail.vehicleType.value = '';
				$scope.moduleService.detail.registrationNoConveyance.value = '';
				$scope.moduleService.detail.conveyanceTugBar.value = '';
			}else if($scope.moduleService.detail.conveyance.value === 'B'){
				$scope.moduleService.detail.vehicleType.value = '';
				$scope.moduleService.detail.registrationNoConveyance.value = '';
				$scope.moduleService.detail.vesselNameConveyance.value = '';
				$scope.moduleService.detail.billOfLadingNo.value = '';
				$scope.moduleService.detail.voyageNo.value = '';
				$scope.moduleService.detail.flightNo.value = '';
				$scope.moduleService.detail.awbNo.value = '';
			}
			
			//this quotation save for quotation create from BC
			if(localStorage.getItem('quotationType') !== 'standalone' ){
				$scope.moduleService.detail.typeQuo.value = commonService.CONSTANTS.QUOTATION_TYPE.NORMAL;
			}
			else{
				$scope.moduleService.detail.typeQuo.value = commonService.CONSTANTS.QUOTATION_TYPE.STANDALONE;
			}
			$scope.computeQuotation().then(function(data){
				if(data == "fail") {
					var question = 'MSG-FQ06';
					commonUIService.showYesNoDialog(question, function() {
						$scope.saveDetail(false);
					});
				}
			});
			
			
			
		}
	};
	
	$scope.confirmLoadingQuotation = function() {
		var performAceptAction = function() {
			$scope.salecaseCoreService.findElementInDetail(['underwriting', 'refBusinessStatus']).value = commonService.CONSTANTS.BUSINESS_OPERATION.UNDERWRITING.COUNTER_OFFER_CONFIRMED;
			$scope.moduleService.findElementInDetail(['businessStatus']).value = commonService.CONSTANTS.BUSINESS_STATUS.ACCEPTED;
			$scope.saveDetail(false,undefined,false).then(function(data){
				salecaseCoreService.acceptedQuotation = $scope.moduleService.extractDataModel(data);
				$scope.moduleService.freeze = true;
				$timeout(function (){
					commonUIService.FNotifyMessage('v4.UWquotation.message.acceptedSuccessfully', 'success');					
				}, 1000);
				if(!commonService.hasValueNotEmpty($scope.underwritingCoreService.detail)) {
					$scope.moduleService.getDocumentWithouUpdateDetail(undefined, $scope.salecaseCoreService.detail.underwriting.refType.value, $scope.salecaseCoreService.detail.underwriting.refId.value, undefined, $scope.salecaseCoreService.detail.underwriting.refBusinessType.value, $scope.salecaseCoreService.detail.underwriting.refProductName.value).then(function(data){	
						$scope.moduleService.findElementInElement(data, ['metaData']).businessStatus = commonService.CONSTANTS.BUSINESS_OPERATION.UNDERWRITING.COUNTER_OFFERED;
						$scope.moduleService.findElementInElement(data, ['underwritingDecisionInfo']).underwritingDecisionCd = commonService.CONSTANTS.BUSINESS_OPERATION.UNDERWRITING.COUNTER_OFFER_CONFIRMED;

						data.loading = 0;
						for(var i=0, n=$scope.moduleService.detail.basicPlan.loadingInformation.value.length; i<n; i++) {
							data.loading += $scope.moduleService.detail.basicPlan.loadingInformation.value[i].loading.value;
						}
						$scope.moduleService.updateDocument(undefined, data.metaData.docType, data.metaData.docId, data, data.metaData.businessType, data.metaData.productName);
					});
				} else {
					$scope.moduleService.findElementInElement($scope.underwritingCoreService.detail, ['metaData', 'businessStatus']).value = commonService.CONSTANTS.BUSINESS_OPERATION.UNDERWRITING.COUNTER_OFFERED;
					$scope.moduleService.findElementInElement($scope.underwritingCoreService.detail, ['underwritingDecisionInfo', 'underwritingDecisionCd']).value = commonService.CONSTANTS.BUSINESS_OPERATION.UNDERWRITING.COUNTER_OFFER_CONFIRMED;
					$scope.moduleService.findElementInElement($scope.underwritingCoreService.detail, ['loading']).value = 0;
					for(var i=0, n=$scope.moduleService.detail.basicPlan.loadingInformation.value.length; i<n; i++) {
						$scope.moduleService.findElementInElement($scope.underwritingCoreService.detail, ['loading']).value += $scope.moduleService.detail.basicPlan.loadingInformation.value[i].loading.value;
					}
					$scope.moduleService.updateDocument(undefined, $scope.underwritingCoreService.detail.metaData.docType.value, $scope.underwritingCoreService.detail.metaData.docId.value, $scope.underwritingCoreService.detail, $scope.underwritingCoreService.detail.metaData.businessType.value, $scope.underwritingCoreService.detail.metaData.productName.value);
				}
				
				
				
			});
		}
		if($scope.moduleService.detail != $scope.moduleService.originalDetail) {
			$scope.computeQuotation().then(function(data){
				if (data == 'success') {
					performAceptAction();
				} else {
					commonUIService.showNotifyMessage('v4.user.error.inputValidateFail');
				}
			});
		} else {
			performAceptAction();
		}
	}
	
	$scope.acceptedQuotation = function() {	
		//$scope.card.finishAcceptQuotation = false;
		var statusBackup = angular.copy($scope.moduleService.detail.metaData.businessStatus.value);
		$scope.moduleService.detail.metaData.businessStatus.value = "ACCEPTTING";
		$scope.card.refDetail.refBusinessStatus.value = "ACCEPTTING";
		var count = 0;
		if(localStorage.getItem('quotationType') !== 'standalone'){
			$scope.moduleService.detail.typeQuo.value = commonService.CONSTANTS.QUOTATION_TYPE.NORMAL;
		}
		else{
			$scope.moduleService.detail.typeQuo.value = commonService.CONSTANTS.QUOTATION_TYPE.STANDALONE;
		}
		for(var i=0; i < $scope.salecaseCoreService.detail.quotations.value.length;i++) {
			var summary = $scope.salecaseCoreService.detail.quotations.value[i];
			if($scope.salecaseCoreService.detail.quotations.value[i].refBusinessStatus.value == commonService.CONSTANTS.BUSINESS_STATUS.ACCEPTED) {
				commonUIService.showNotifyMessage('v4.error.message.acceptQuo');
				//$scope.card.finishAcceptQuotation = true;
				$scope.moduleService.detail.metaData.businessStatus.value = statusBackup;
				$scope.card.refDetail.refBusinessStatus.value = statusBackup;
				return;
			}
			if(summary.refBusinessStatus.value == "ACCEPTTING") {
				count = count + 1;
			}
		}	
		if(count >= 2) {
			commonUIService.showNotifyMessage('v4.error.message.acceptQuo');
			//$scope.card.finishAcceptQuotation = true;
			$scope.moduleService.detail.metaData.businessStatus.value = statusBackup;
			$scope.card.refDetail.refBusinessStatus.value = statusBackup;
			return;
		}
		
		// accept quotation
		var performAceptAction = function() {
			$scope.disableAcceptQuo = 'true';
			salecaseCoreService.acceptQuotation($scope.moduleService.detail).then(function(data) {
				if(data) {
					// re-structure quotation
					var acceptedQuo = data.quotations;
					if ($scope.moduleService.isSuccess(acceptedQuo)) {
						$scope.moduleService.convertDataModel2UiModel(acceptedQuo, $scope.moduleService.detail);
						$scope.moduleService.detail = angular.copy(acceptedQuo);
						$scope.moduleService.originalDetail = angular.copy(acceptedQuo);
						$scope.uiStructureRoot.isDetailChanged = false;
						$scope.reSetupConcreteUiStructure(
							$scope.moduleService.detail,
							commonService.CONSTANTS.UI_STRUCTURE.NOT_REMOVE_TEMPLATE_CHILDREN,
							commonService.CONSTANTS.UI_STRUCTURE.EXPECTED_DETAIL_NOT_CHANGED
						);
					}
					
					// re-structure data for case
					var updatedCase = data.cases;
					if (salecaseCoreService.isSuccess(updatedCase)) {
						salecaseCoreService.convertDataModel2UiModel(updatedCase, salecaseCoreService.detail);
						salecaseCoreService.detail = angular.copy(updatedCase);
						salecaseCoreService.originalDetail = angular.copy(updatedCase);
						$scope.$parent.uiStructureRoot.isDetailChanged = false;
						$scope.$parent.reSetupConcreteUiStructure(
							salecaseCoreService.detail,
							commonService.CONSTANTS.UI_STRUCTURE.NOT_REMOVE_TEMPLATE_CHILDREN,
							commonService.CONSTANTS.UI_STRUCTURE.EXPECTED_DETAIL_NOT_CHANGED
						);
					}
					
					// set quotation accepted
					salecaseCoreService.acceptedQuotation = $scope.moduleService.extractDataModel(data.quotations);
					$scope.moduleService.freeze = true;
					
					$timeout(function (){
						commonUIService.showNotifyMessage('v4.quotation.message.acceptedSuccessfully', 'success');
					}, 1000);
				}
			})
		}
		if($scope.moduleService.detail != $scope.moduleService.originalDetail) {
			var selected_profile = JSON.parse( localStorage.getItem('selected_profile'));
			var role = selected_profile.role ;
			var pasId = selected_profile.pasId;
			var customId =  selected_profile.customerId;
			$scope.moduleService.getMockFromIHUB(role, pasId, customId,$scope.moduleService.detail.declarationStarts.value).then(function(metaModel){
				var detail =  $scope.moduleService.detail;
				detail.marineOpenCoverInsured = angular.copy(metaModel.marineOpenCoverInsured);
				$scope.moduleService.mergeMetaModel2UIModel(metaModel, detail);
				$scope.computeQuotation(false, true).then(function(data){
					if (data == 'success') {
						performAceptAction();
					} else {
						commonUIService.showNotifyMessage('v4.user.error.inputValidateFail');
					}
				});
				
			});
			
		} else {
			performAceptAction();
		}
	}
	$scope.displayInsuredDescription = function(index,insuredCargoKey){
		//find description
			var insuredCargo = $scope.moduleService.lazyChoiceList.InsuredCargoCode;
			var descriptionElement = [];
			var insuredCargoDescription = undefined;
		//find group
			for(var i=0;i < insuredCargo.length; i++){
				if(insuredCargoKey == insuredCargo[i].key){
					insuredCargoDescription = insuredCargo[i].group[0];
					break;
				}
			}
		$scope.moduleService.detail.insuredCargo.value[index].insuredCargoDescription.value = insuredCargoDescription;
	}
	
	$scope.getTotalPremium = function(){
    var totalPayable = 10;
   /* for(var i = 0; i < $.card.products.length; i++){
        
        totalPayable += ;
    }*/
    return totalPayable;
	}
	
	$scope.addInsuredCargo = function() {
		//$scope.moduleService.lazyListFund.push(angular.copy($scope.moduleService.findElementInElement($scope.moduleService.lazyChoiceList,['FundQuotation'])));
		$scope.moduleService.addChildEleToParentEleWithCounterNoArrDefault($scope.moduleService.detail.insuredCargo,'value')
		$scope.moduleService.addChildEleToParentEleWithCounterNoArrDefault($scope.moduleService.detail.premiumSummary.insuredCargoSummary,'value')
	}
	$scope.removeInsuredCargo = function(index) {		
		//$scope.moduleService.lazyListFund.splice(index, 1);
		var insuredLength = $scope.moduleService.detail.insuredCargo.value.length;
		if(index == 0){
			$scope.moduleService.detail.insuredCargo.value[index+1].currency.value = $scope.moduleService.detail.insuredCargo.value[index].currency.value
		}
		if(index != insuredLength-1){
			if(!commonService.hasValueNotEmpty($scope.moduleService.detail.insuredCargo.value[index+1].sumInsured.value)){
				$scope.moduleService.detail.insuredCargo.value[index+1].sumInsured.value = "";
			}
			
		}
		$scope.moduleService.removeChildEleToParentEleWithCounter(index, $scope.moduleService.findElementInDetail(['insuredCargo']),'value')		
		$scope.moduleService.removeChildEleToParentEleWithCounter(index, $scope.moduleService.findElementInDetail(['premiumSummary','insuredCargoSummary']),'value')
		
	}
	
	$scope.reOrderCard = function(listChild){
		for(var i=0;i<listChild.length;i++){
			if(listChild[i].cardType =="action"){
				var temp = listChild[i];
				listChild.splice(i,1);
				listChild.splice(1,0,temp);
				break;
			}
		}
	}	

	$scope.toggleLifeInsured = function(card) {
//		if($scope.moduleService.freeze != true) {
//			if($scope.moduleService.detail.isAddLifeInsured.value == commonService.CONSTANTS.PO_LI_RELATION.SAME) {
//				$scope.moduleService.detail.isAddLifeInsured.value = commonService.CONSTANTS.PO_LI_RELATION.NOT_SAME;
//				$scope.clearDataLifeInsured();
//				$scope.refreshDetail();
//				return;
//			}
//			if($scope.moduleService.detail.isAddLifeInsured.value == commonService.CONSTANTS.PO_LI_RELATION.NOT_SAME) {
//				$scope.moduleService.detail.isAddLifeInsured.value = commonService.CONSTANTS.PO_LI_RELATION.SAME;
//				$scope.clearDataLifeInsured();
//				$scope.populateProposerToLifeInsured();
//				$scope.closeChildCards(card.level);
//				$scope.refreshDetail();
//				// fix issue delete
//				if(!$scope.shouldInitNormalQuotation()){
//					$scope.goToPreviousTab();
//				}
//				return;
//			}
//		}
	};	
	
	$scope.clearDataLifeInsured = function() {
		$scope.moduleService.clearDataInJson($scope.moduleService.detail.documentRelation.refContactLifeInsured,['value']);
		$scope.moduleService.clearDataInJson($scope.moduleService.detail.lifeInsured,['value']);
		$scope.moduleService.selectedContact = "";
	}
	
	$scope.populateProposerToLifeInsured = function(){
		$scope.populateDataToLifeInsuredQuotation($scope.moduleService.findElementInDetail(['policyOwner']));			
	};


	
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
					if(item.docName == $scope.salecaseCoreService.detail.prospects.value[0].refDocName.value) {
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
	};
	
	$scope.checkPdfExist = function (typePdf) {
		if($scope.shouldInitNormalQuotation()){
			var result = false;
			var attachments = this.salecaseCoreService.detail.attachments.value;
			for (var i = 0; i < attachments.length; i++)
				if(attachments[i].attachment.refId.value == undefined) {
					continue;
				} else if (attachments[i].attachment.refBusinessType.value == typePdf) {
					result = true;
					break;
				}
			return result;
		}
		else{
			return false
		}
	}
	
	//detect normal quotation and standalone quotation
	$scope.shouldInitNormalQuotation = function() {
		var retVal = true;
		//localStorage.removeItem('quotationType');
		$scope.moduleService = quotationCoreService;
		if($stateParams.quotationStandalone === undefined) {
			var quoType = localStorage.getItem('quotationType');
			if(quoType === undefined) {
				retVal = true;
			} else {
				if(quoType === 'standalone') {
					retVal = false;
				} 
			}
		} else {
			// existed quotationStandalone value
			if($stateParams.quotationStandalone && ($stateParams.quotationStandalone === true || $scope.$eval($stateParams.quotationStandalone)) ) { // $stateParams.quotationStandalone = "false"
				retVal = false;
			} else {
				retVal = true;
			}
			
		}
		return retVal;
	}
	
	if($scope.shouldInitNormalQuotation()){
		localStorage.setItem('quotationType', 'normal');
		} else {
    	localStorage.setItem('quotationType', 'standalone');
    }
	

	$scope.processLoadingList = function() {
		$scope.moduleService.originalLazyLoadingList = $scope.moduleService.findElementInElement($scope.moduleService.lazyChoiceList, ['LoadingType']);
		$scope.moduleService.tempLazyLoadingList = [];
		var loadingInformationList = $scope.moduleService.findElementInElement($scope.moduleService.detail, ['loadingInformation']).value;
		$scope.moduleService.tempLazyLoadingList = $scope.filterLazyList($scope.moduleService.originalLazyLoadingList, $scope.moduleService.tempLazyLoadingList, loadingInformationList);
		return;
	}
	$scope.filterLazyList = function(originalLazyList, tempLazyList, objectDropdown) {
		if(originalLazyList == undefined)
			return;
		
		var tempList = [];
		tempLazyList = [];
		
		/* Find all elements not select before on Lazy List */
		for(var i=0; i<originalLazyList.length; i++) {
			for(var j=0; j<objectDropdown.length; j++) {
				if(originalLazyList[i].key == objectDropdown[j].loadingType.value)
					break;
				if(j == objectDropdown.length-1 && originalLazyList[i].key != objectDropdown[j].loadingType.value)
					tempList.push(originalLazyList[i]);
			}
		}
		
		/* Push element selected to Lazy List */
		for(var i=0; i<objectDropdown.length; i++) {
			tempLazyList.push(angular.copy(tempList));
			for(var j=0; j<originalLazyList.length; j++) {
				if(objectDropdown[i].loadingType.value == originalLazyList[j].key) {
					tempLazyList[i].push(originalLazyList[j]);
					break;
				}
			}
		}
		return tempLazyList;
	}
	
	// hle71 - for 'Proceed BC' action of the quick quotation
	$scope.generateBusinessCaseFromQuickQuotationDetail = function (quotation) {
		return $scope.moduleService.generateBusinessCaseFromQuickQuotationAndNavigateToBC(quotation.metaData.docType.value, quotation.metaData.docName.value, quotation.metaData.businessType.value, quotation.metaData.productName.value, $scope.$root.currentRole);
	}
	
	$scope.updateAdditionalCoverage = function (key,value, index) {
		$scope.moduleService.detail.premiumSummary.addPremiumSummaries.value[index].additionalKey.value = key;
		$scope.moduleService.detail.premiumSummary.addPremiumSummaries.value[index].additionalValue.value = value;
	}
	
}];
