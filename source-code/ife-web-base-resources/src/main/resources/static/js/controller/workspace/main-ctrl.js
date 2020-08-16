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

var MyNewWorkspaceCtrl = ['$scope', '$q', '$state', '$stateParams', '$window', '$log', '$timeout', '$interval', 'uiRenderPrototypeService', 'commonService', '$translate', '$translatePartialLoader', 'multiUploadService', 'resourceReaderService', 'commonUIService', 'salecaseCoreService', 'loadingBarService', 'uiFrameworkService', 'AclService','$rootScope', 'accountCoreService', 'Keepalive', 'Idle', '$http',
	function($scope, $q, $state, $stateParams, $window, $log, $timeout, $interval, uiRenderPrototypeService, commonService, $translate, $translatePartialLoader, multiUploadService, resourceReaderService, commonUIService, salecaseCoreService, loadingBarService, uiFrameworkService, AclService, $rootScope, accountCoreService, Keepalive, Idle, $http) {

	this.$onInit = function() {
		$scope.name = "MyNewWorkspaceCtrl";
		$scope.printDebugInfo();
		//keep track the actionBarEle
		$scope.html = {};//stores html reference
		$scope.$state = $state;//reference to ui-router $state
		$scope.resourceServerPath = resourceServerPath;
		$scope.salecaseCoreService = salecaseCoreService;
		$scope.commonService = commonService;
		$scope.commonUIService = commonUIService;
		$scope.requestURL = salecaseCoreService.initialRequestURL("INVOKE_RUNTIME", []);
		$scope.resourceReaderService = resourceReaderService; //View file
		$scope.multiUploadService = multiUploadService;
		$scope.uiFrameworkService = uiFrameworkService;
		$scope.aclService = AclService;
		$scope.stateParams = $state;

		document.addEventListener("touchstart", function () {
		}, true);
		
		$scope.uiFrameworkService.isSummaryLeft = false;
	    $scope.hideAllNavigationSide = function(){
			$scope.uiFrameworkService.isSummaryLeft = !$scope.uiFrameworkService.isSummaryLeft;
		}
		
		//breadcrum setup
		$scope.isLoadBreadCrum = false;
		$(window).scroll(function () {
			$scope.setScrollBreadCrum();
		});

		//Scroll to top when first access portlet
		$scope.scrollTop(0);

		//Setup scrolltop button
		$(window).scroll(function () {
			if ($(this).scrollTop() >= 50) {        // If page is scrolled more than 50px
				$('.v4-fab-scrolltop').fadeIn(200);    // Fade in the arrow
			} else {
				$('.v4-fab-scrolltop').fadeOut(200);   // Else fade out the arrow
			}
		});

		//Card CSS setup
		if ($(window).width() > 1680) {
			$scope.v3LiveCard = "col-xs-6 col-sm-4 col-md-4 col-lg-2";
		} else {
			$scope.v3LiveCard = "col-xs-6 col-sm-4 col-md-4 col-lg-3";
		}
		
		//Header item CSS setup
		if ($(window).width() > 1680) {
			$scope.v4LiveTabItem = "col-xs-4 col-sm-3 col-md-2 col-lg-2";
		} else {
			$scope.v4LiveTabItem = "col-xs-4 col-sm-3 col-md-2 col-lg-2";
		}
		
		$scope.$on('IdleStart', function() {
			// the user appears to have gone idle
			console.log('Start idling ......');
		});
		
		/*$scope.$on('Keepalive', function() {
			// do something to keep the user's session alive
			console.log('Keepalive......');
//			var url = "../ife-infra-oauth2/oauth/" + localStorage.getItem("access_token") + "/get";
//			var url = "../ife-infra-oauth2/oauth/heartbeat";
			var url = "/workspace?roles=AG&";
			$http.get(url).then(function(response) {
				console.log("Token information: " + response.data);
				//deferred.resolve(response.data);
			});
		});*/
		
		$scope.$on('IdleTimeout', function() {
			// the user has timed out (meaning idleDuration + timeout has passed without any activity)
			// this is where you'd log them
			console.log('IdleTimeout - logging out');
			//$rootScope.doLogout();
			localStorage.clear();
			window.open('logout', '_self');
		});
	};
	$scope.displayVersion = function(){
		var version = localStorage.getItem('buildVersion');
		return version;
	}
	//get list summary on sidebar in detail screen
	//to config how to get summary information goto app-config.js
	$scope.getSummary = function(){
		
		var currentModuleName  = this.viewProp.currentModule.split(";")[0];
		//reset summary
		$scope.listSummaryOnSideBar = [];
		$scope.currenSummaryTemplate = undefined;
		$scope.currenSummaryDetail = undefined;
		
		//get current moduleService
		var uiService = uiRenderPrototypeService.getUiService(currentModuleName);
		
		var currenSummaryTemplate = listSummary[currentModuleName];
		if (!currenSummaryTemplate){return;}
		
		$scope.currenSummaryTemplate = currenSummaryTemplate.templateName;
		$scope.currenSummaryDetail = uiService.detail;
	
	
	} 
	
	//hide icon
	$scope.showSummaryIcon = function(state){
		try {
			var currentModuleName  = this.viewProp.currentModule.split(";")[0];
		} catch(err) {
			return false;
		}		
		var currenSummaryTemplate = listSummary[currentModuleName];
		if (!currenSummaryTemplate){
			return false;
		}
		return true;
	}
	
	$scope.changeSystemLanguage = function changeSystemLanguage(lang){
		var currentLang = localStorage.getItem("system_language");
		if(currentLang != lang)
		{
			localStorage.setItem("system_language",lang);
			location.reload();
		}
	}
	// go to the product's introduction screen
	$scope.goToProductIntroducionPage = function(productName, dashboardName) {
		var selected_profile = JSON.parse( localStorage.getItem('selected_profile'));
		var role = selected_profile.role ;
		if(role=="PO" && productName=="MT1"){
			commonUIService.showNotifyMessage('v4.quotation.can.checkquotationuser');
		}else{
			if(productName) {
				$state.go(
						'root.list.case-introduce',
						{ productName: productName, dashboardName: dashboardName}
				);
			}
			
		}
	}
	$scope.goToProductIntroducionPageFromQuotation = function(productName, dashboardName) {
		if(productName && dashboardName) {
			$state.go(
					'root.list.quotationst-introduce',
					{ productName: productName,
					  dashboardName: dashboardName
					}
			);
		}
	}
	
	/**
     * Create new document for this docType and navigate to its screen
     * @param  {String} docType     [description]
     * @param  {String} productName [description]     
     * @return {Object}              Angular Promise, iposV3Doc if success
     */
	$scope.createNewDocument = function createNewDocument(doctype, businessType, product, activeRoles, isQuotationStandalone,ctrlName) {		
		commonService.currentState.set(doctype + '-detail');
		if(doctype === commonService.CONSTANTS.MODULE_NAME.CONTACT && businessType === commonService.CONSTANTS.MODULE_NAME.CORPORATE){
			commonService.currentState.set(businessType + '-detail');
		}
		//var activeRole = commonUIService.setupAclForDetail(AclService, activeRoles);
		var isQuoStandalone =  doctype.toLowerCase() == 'quotation' ? true : false;
		if(doctype == commonService.CONSTANTS.MODULE_NAME.ACCOUNT){
			var typeOfAction = commonService.CONSTANTS.ACTION.CREATE;
		}
		$state.go('root.list.detail', {
			docType: doctype,
			userRole: activeRoles,
			productName: product,
			businessType: businessType,
			quotationStandalone: isQuoStandalone,
			type: typeOfAction,
			ctrlName: ctrlName
		});
	}
	
	$scope.toogleElement = function(id, quickNavigationToggle) {
        $('.' + id).slideToggle("slow");
    };

	//scroll table by press button
	$scope.scrollLeft = function scrollWin(id) {
		document.getElementById(id).scrollLeft += 50;
	};
	
	$scope.scrollRight = function scrollWin(id) {
		document.getElementById(id).scrollLeft -= 50;
	};

	//scroll to opened card position
	$scope.scrollTop = function(scrollAmount, speed) {
		if (scrollAmount === undefined) {
			scrollAmount = uiFrameworkService.scrollAmount;
		}
		if (speed === undefined) {
			speed = 500;
		}
		uiFrameworkService.scrollTop(scrollAmount, speed);
	};


	//***** FOR GENERAL SETUP CONFIGURATION****

	$scope.printDebugInfo = function printDebugInfo() {
		uiFrameworkService.printDebugInfo(this);
	};

	/**
	 * setup some common variable and behavior for controller have datamodel (ipos v3 document)
	 * NOTE: need to have detail in 'moduleService' when calling this function
	 *
	 * For screen doesn't have datamodel (payment, configuration screen,...)
	 * Please call setupCtrlWithoutDetail()
	 * 
	 * @param  {String} ctrlName		name of the ctrl
	 * @param  {Object} moduleService   UIService
	 * @return {Object}				 Angular Promise, success when got uiStructure
	 */
	$scope.generalConfigCtrl = function generalConfigCtrl (ctrlName, moduleService, isLoadJsonMock) {
		return uiFrameworkService.generalConfigCtrl(ctrlName, moduleService, this, isLoadJsonMock);
	};

	/**
	 * setup some common variable and behavior for screen doesn't have datamodel (payment, configuration screen,...)
	 * 
	 * @param  {String} ctrlName		name of the ctrl
	 * @param  {Object} refDocType	  current refDocType of this ctrl
	 * @param  {String} businessType	[description]
	 * @return {Object}				 Angular Promise, success when got uiStructure
	 */
	$scope.setupCtrlWithoutDetail = function setupCtrlWithoutDetail (ctrlName, refDocType, userType, businessType, userRole, detail) {
		return uiFrameworkService.setupCtrlWithoutDetail(ctrlName, refDocType, userType, businessType, userRole, detail, this);
	};

	/**
	 * add this ctrl to history
	 * @return {[type]} [description]
	 */
	$scope.registerToHistoryCtrl = function registerToHistoryCtrl (scope) {
		uiFrameworkService.registerToHistoryCtrl(this);
	};
	/**
	 * Setup HTML for action bar and its controller
	 */
	$scope.setupActionBar = function setupActionBar (refDocType, businessType) {
		uiFrameworkService.setupActionBar(refDocType, businessType, this);
	};

	//----------------General functions which can be called from jsonMock----------------
	/**
	 * call findElementInDetail underlying
	 * @param elementsChain is an array of of elements' names
	 * Example: ['prospect','fullname','firstname']
	 * @return an element which is equals to the last element's name in @elementsChain
	 */
	$scope.findElementInDetail = function findElementInDetail(elementChains) {
		return this.moduleService.findElementInDetail(elementChains);
	};
	
	$scope.findElementInElement = function findElementInElement(detail, elementChains) {
		return this.moduleService.findElementInElement(detail, elementChains);
	};

	$scope.hasValueNotEmpty = function hasValueNotEmpty(value) {
		return commonService.hasValueNotEmpty(value);
	};
	//----------------********----------------
	
	/**
	 * return the card's data given card name
	 * @param  {String} cardName	name of card (which is associated with the current ctrl-in-charge)
	 * If 'cardName' is undefined, will return the current card of this scope
	 * @param  {bool}   bDeepSearch search in linking document (salecase link to illustration)
	 * @return {Object}		  [description]
	 */
	$scope.getCardDataWithName = function getCardDataWithName (cardName, bDeepSearch) {
		var result = this.card;//default result is the current card of this scope
		if(cardName){
			var uiStructureRoot = this.getAssociateUiStructureRoot();
			result = uiRenderPrototypeService.findUiStructureWithName(uiStructureRoot, cardName, bDeepSearch);
		}
		return result;
	};
	
	$scope.getCardMetadata = function getCardMetadata(cardName){
		var uiStructure = this.getCardDataWithName(cardName);
		return uiStructure ? uiStructure.metadata : undefined;
	};
	
	/**
	 * show or hide action cards of a card with name
	 * @param {String}  cardName  [description]
	 * @param {Boolean} isVisible [description]
	 */
	$scope.setVisibleActionCards = function setVisibleActionCards (cardName, isVisible) {
		var uiStructure = this.getCardDataWithName(cardName);
		if(uiStructure)
			uiRenderPrototypeService.setVisibleActionCards(uiStructure, isVisible);
	};
	
	/**
	 * Set visible for a card
	 * @param {String}  cardName		name of card need to set visible
	 * @param {Boolean} isVisible	   true will show the action cards, false will remove it
	 */
	$scope.setVisibleCard = function setVisibleCard (cardName, isVisible) {		
		var uiStructure = cardName ? this.getCardDataWithName(cardName) : this.card;

		if(uiStructure){
			uiRenderPrototypeService.setVisibleCard(uiStructure, isVisible);

			//setup its theme when it's already appear in screen
			if(isVisible && uiStructure.scope ){ 
				var result = uiStructure.scope.setCssLeafCard();

				//if false, wait again to setup css again
				if(!result){
					var intervalId = $interval(function() {
						result = uiStructure.scope.setCssLeafCard();
						
						if(result)
							$interval.cancel(intervalId);
					}, 10);//set 10ms loop
				}
			}
		}
	};
	
	$scope.forceUpdateCardDetailChanged = function forceUpdateCardDetailChange (card) {
		card.isDetailChanged = true;
		uiRenderPrototypeService.updateParentDetailChanged(card);
	};

	$scope.addActionCardToUiStructure = function addActionCardToUiStructure (cardName) {
		var uiStructure = this.getCardDataWithName(cardName);
		if(uiStructure)
		   uiStructure.addActionCards();
	};

	$scope.isCardStatusValid = function isCardStatusValid (cardName) {
		var uiStructure = this.getCardDataWithName(cardName);
		if(uiStructure)
		   return uiRenderPrototypeService.getValidStatus(uiStructure) === commonService.CONSTANTS.DOCUMENT_STATUS.VALID;
	};
	

	/**
	 * Return the parent refDocType of this controller
	 * Ex: If opening propsect in case screen, prospectDetailCtrl using this function will get 'case-management'
	 * @param  {String} currRefDoctype		current refDocType
	 * @return {String}					   refDocType of parent ctrl, or undefined if doesn't have any yet
	 */
	$scope.getParentRefDoctype = function getParentRefDoctype (currRefDoctype) {
		if(!$scope.viewProp)
			return undefined;

		for (var i = 0; i < $scope.viewProp.historySelect.length; i++) {
			if($scope.viewProp.historySelect[i].refDocType.indexOf(currRefDoctype) !== -1){
				if(i === 0)
					return undefined;
				else
					return $scope.viewProp.historySelect[i - 1].refDocType;
			}
		}

		return undefined;
	};

	/**
	 * The caller ctrl can be anywhere, use this function to find the main ctrl in charge (eg: Case, illustration, application,...)
	 * @return {Object} Main ctrl in charge
	 */
	$scope.getCtrlInCharge = function getCtrlInCharge () {
		return uiFrameworkService.getCtrlInCharge(this);
	};

	/**
	 * The caller ctrl can be anywhere, use this function to find the main ctrl's parent in charge 
	 * (eg: Application will result case,...)
	 * @return {Object} Main ctrl's parent in charge
	 */
	$scope.getParentCtrlInCharge = function getParentCtrlInCharge () {
		var mainCtrl = this.getCtrlInCharge();

		if(!mainCtrl)
			return undefined;

		var pCtrl = mainCtrl.$parent;
		while(pCtrl){
			if(pCtrl.hasOwnProperty('isMainCtrl') === true){				
				break;
			}
			pCtrl = pCtrl.$parent;
		}

		//mainCtrl is parent, return undefined
		if(!pCtrl){
			return undefined;
		}

		return pCtrl;
	};

	/**
	 * return the uiStructure root associate with the current ctrl in charge
	 * @return {Object} uiStructure
	 */
	$scope.getAssociateUiStructureRoot = function getAssociateUiStructureRoot () {
		if(this.viewProp){
			//we find the main ctrl
			//Cause children ctrl can call this function
			//--> Can identify the result
			//We only find the first isMainCtrl
			var mainCtrl = this.getCtrlInCharge();
			
			var historyCtrl = this.viewProp.historyCtrl;
			//find the current ctrl in historyCtrl
			for (var i = 0; i < historyCtrl.length; i++) {
				
				//mainCtrl.$parent can be null when the scope is destroyed
				if(mainCtrl === null){
					//in this case, temporary using ctrl name
					if(historyCtrl[i].ctrl.name === this.name)
						return historyCtrl[i].uiStructureRoot;
				}
				else{
					if ( historyCtrl[i].ctrl === mainCtrl){
						return historyCtrl[i].uiStructureRoot;
					}
				}
			}
		}

		return undefined;
	};

	/**
	 * Return the current product information which the controller is processing
	 * @return {Object} [description]
	 */
	$scope.getCurrProductInfor = function getCurrProductInfor() {
		var result = {
			parentRefDocType: undefined,//refDocType of the parent document
			rootRefDocType: undefined,//refDocType of the root document (the main opening doctype)
			refDocType: undefined,//refDocType of the detail
			businessType: undefined//which type of business it's processing
		};

		var uiStructureRoot = this.getAssociateUiStructureRoot();

		if (uiStructureRoot) {
			result.refDocType = uiStructureRoot.docParams.refDocType;

			//refDocType can different, but businessType has to be the same with the current main ctrl
			result.businessType = uiStructureRoot.docParams.businessType;
		}

		return result;
	};

	/**
	 * Using this functions everytime need to re-associate the detail with uiStructure
	 * Ex: After computing, the output in detail will be changed
	 * --> need to call this fn so the display of element with "counter" can be refresh
	 * When success, the new "detail" will be binded with current uiStructure of this doctype
	 * @param  {Object} detail ipos v3 json dataset
	 * @param  {boolean} notRemoveTemplateChildren if true, then keep all template children in uiStructure, else remove them all, default to undefined (will remove)
	 * @param  {boolean} expectedDetailNotChanged expected state of isDetailChanged is unchanged, default is undefined (inherited from parent)
	 * @param  support to resetup parent module from child module
	 */
	$scope.reSetupConcreteUiStructure = function reSetupConcreteUiStructure (detail, notRemoveTemplateChildren, expectedDetailNotChanged, moduleToResetup) {
		// hle71 - Load quotation data to fill quotation summary information
		if (detail.quotations && detail.quotations.value.length > 0 && !detail.quotations.value[0].summary) { // tab.name === "case-management-base:Quotation"
			$scope.getQuotationsForQuotationSummaries();
		}
		
		if(commonService.hasValueNotEmpty(moduleToResetup)) {
			//Support to resetup parent module from child module
			return uiFrameworkService.reSetupConcreteUiStructure(detail, moduleToResetup, notRemoveTemplateChildren, expectedDetailNotChanged);
		}
		return uiFrameworkService.reSetupConcreteUiStructure(detail, this, notRemoveTemplateChildren, expectedDetailNotChanged);
	};

	//***** FOR GENERAL SETUP CONFIGURATION****

	/**
	 * close all children cards of "X" level
	 * @param  {string} closeLevel		card level need tobe close
	 * @param  {Object} $event		  js event for clicking
	 */
	$scope.closeChildCards = function closeChildCards(closeLevel) {
		uiFrameworkService.closeChildCards(closeLevel, this);
	};

	/**
	 * @author: tphan37
	 * date: 17-Nov-2015
	 * http://stackoverflow.com/questions/22447374/how-to-trigger-ng-click-angularjs-programmatically
	 *
	 * Trigger the event 'click' on a card with given name (Card must be rendered in screen)
	 * @param  {String} cardName card's name
	 */
	$scope.moveToCard = function moveToCard(cardName) {
		var uiStructure = this.getCardDataWithName(cardName);
		$scope.moveToCardByCardUIStructureInfo(uiStructure);
	}
	
	
	/**
	 * moveToCardByCardUIStructureInfo
	 * @author hnguyen294
	 * @date 2018 June 27
	 * @description open card which have uiStructure value
	 * @param uiStructure {Object} ui structure of card
	 * 
	 * */
	$scope.moveToCardByCardUIStructureInfo = function moveToCardByCardUIStructureInfo(uiStructure) {
		if(uiStructure){
			var intervalPromise = $interval(function() {
				// uiStructure.html.click();
				if(uiStructure.html) {
					uiStructure.html.triggerHandler('click');   
				} else {
					if(uiStructure.parent.html){
						uiStructure.parent.html.triggerHandler('click');
						 var intervalPromise1 = $interval(function() {
							 if(uiStructure.html){
								 uiStructure.html.triggerHandler('click');   
							 }
							 $interval.cancel(intervalPromise1); 
						 },10);
					}
				}
				
				$interval.cancel(intervalPromise);
			}, 10);
		} else {
			$log.warn("moveToCardByCardUIStructureInfo: uistructure is undefined");
		}
	}
	
	/**
	 * getTabIndexToOpenAutomaticallyFromTabIndex
	 * @author: hnguyen294
	 * @date: 2018 Jun 19
	 * @description: detect the first index of tab which is visible in tab list 
	 * @param fromTabIndex {Int} start index to check to open tab 
	 * @param tabsList {Array} list of tab items info
	 * @return: the first position of tab index which tab is visible from fromTabIndex
	 * @return other, return undefined 
	 * */
	$scope.getTabIndexToOpenAutomaticallyFromTabIndex = function getTabIndexToOpenAutomaticallyFromTabIndex(tabsList, fromTabIndex) {
		if(fromTabIndex === undefined) {
			fromTabIndex = 0;
		}
		var visibleAtIndex = undefined; 
		for(var index = fromTabIndex; index < tabsList.length; index++ ) {
			if(tabsList[index].visible == true) {
				visibleAtIndex = index;
				break;
			}
		}
		return visibleAtIndex;
	}
	
	/**
	 * getTabIndexToOpenAutomaticallyToTabIndex
	 * @author: hnguyen294
	 * @date: 2018 Jun 19
	 * @description: detect the last index of tab which is visible in tab list 
	 * @param toTabIndex {Int} the end index to check to open tab 
	 * @param tabsList {Array} list of tab items info
	 * @return: the last position of tab index which tab is visible from toTabIndex
	 * @return other, return undefined 
	 * */
	$scope.getTabIndexToOpenAutomaticallyToTabIndex = function getTabIndexToOpenAutomaticallyToTabIndex(tabsList, toTabIndex) {
		if(toTabIndex === undefined) {
			toTabIndex = tabsList.length - 1;
		}
		var visibleAtIndex = undefined; 
		for(var index = toTabIndex; index >= 0; index-- ) {
			if(tabsList[index].visible == true) {
				visibleAtIndex = index;
				break;
			}
		}
		return visibleAtIndex;
	}
	
	//restore current working space with list name of cards
	//$scope.cardName = ["case-management-motor:Quotation","illustration-motor:VehicleDetails", "illustration-motor:VehicleInformation"];
	$scope.moveToCards = function moveToCards(lisCardName) {
		if (lisCardName) {
			$scope.cardName = lisCardName;
		}
		if (!$scope.cardName) {
			$scope.cardName = JSON.parse(localStorage.getItem("listCardHistory"));
			localStorage.removeItem("listCardHistory");
		}
		if (!$scope.cardName.length) {
			return;
		}
 
		var self = this;
		var uiStructure =  self.getCardDataWithName($scope.cardName[0], true);
		if (uiStructure){
			if(uiStructure.html) {
				uiStructure.html.triggerHandler('click');
				$scope.cardName.splice(0, 1);
				setTimeout(function () {
					self.moveToCards();
				}, 1000);
			}
		}
	};

	/**
	 * @author: nle32
	 * Move to next step and execute input function
	 * @param  {boolean} move to next step if isMoveForward is true, move to previoust step if isMoveForward is false
	 * @param  {Object} uiStructure object
	 * @param  {String} stepExeFns function needed before move to next step
	 */
	$scope.moveToSection = function moveToSection(isMoveForward, uiStructure, stepExeFns) {
		var self = this;
		uiFrameworkService.clickOnNav = true;
		commonService.forwardDirection = isMoveForward;
		if(isMoveForward){
			uiFrameworkService.moveToNextStep(uiStructure);
		}else{
			uiFrameworkService.moveToPreviousStep(uiStructure);
		}
	};

	/**
	 * @author: tphan37
	 * date: 10-Dec-2015
	 *
	 * Trigger autosave loop for a doctype
	 * Auto remove parent autosave loop (it's autosaved when navigating to child doctype)
	 */
	$scope.triggerAutoSaveLoop = function triggerAutoSaveLoop () {
		var self = this;
		var configTime = commonService.options.autoSaveInterval;

		//find the parent and remove its intervalSaveId
		var parentCtrl = self.getParentCtrlInCharge();
		if(parentCtrl)
			$interval.cancel(parentCtrl.intervalSaveId);

		function setInterval(loopTime) {
			return $interval(function() {
				//check whether it's time to autosave
				var lastSavedTime = localStorage.getItem('savedTime');
				lastSavedTime = lastSavedTime !== null ? lastSavedTime : 0;
				var currTime = new Date().getTime();
				var diffTime = currTime - lastSavedTime;//the time has passed since the last saved (by autosave or by user)
				var newWaitTime;

				if( diffTime >= configTime){
					self.autoSaveDetail();
					newWaitTime = configTime;//set interval time the same with config
				}
				//user clicked button, need to wait again!
				else{
					newWaitTime = configTime - diffTime;//need to wait more
				}

				//destroy old interval
				$interval.cancel(self.intervalSaveId);

				//setup new interval
				self.intervalSaveId = setInterval(newWaitTime);
			}, loopTime);
		}

		if(configTime){//if '0', disable this feature			
			self.intervalSaveId = setInterval(configTime);
		}

	};

	/**
	 * Get correct doctype. Ex: illustration in motor product will be quotation.
	 * Use for translating purpose only
	 * @param  {[type]} moduleService [description]
	 * @return {[type]}			   [description]
	 */
	$scope.getCorrectDoctype = function getCorrectDoctype (moduleService) {
		var self = this;
		moduleService = moduleService || self.moduleService;
		return moduleService.name;
	};

	/**
	 * @author: tphan37
	 * date: 10-Dec-2015
	 *
	 * Automatic save the document detail, add spinning in save button, remove the full-screen loading banner
	 */
	$scope.autoSaveDetail = function autoSaveDetail() {
		var self = this;
		if (this.uiStructureRoot.isDetailChanged) {
			//temporary remove full loading screen when auto save
			$('#ipos-full-loading').attr('id', 'ipos-full-loading-temp');
			commonUIService.activeSpiner();
			this.saveDetailNotCompute(this.moduleService)
				.then(function saveSuccess() {
					commonUIService.showNotifyMessage('v4.' + self.getCorrectDoctype() + '.message.autoSaveSuccessfully'
						, "success", 3000);
				}, function saveFailed() {
					commonUIService.showNotifyMessage('v4.' + self.getCorrectDoctype() + '.message.autoSaveUnsuccessfully'
						, "unsuccessful", 3000);
				})['finally'](function () {
				// re-add full loading screen after auto save
				$('#ipos-full-loading-temp').attr('id', 'ipos-full-loading');
				commonUIService.inactiveSpiner();
			});
		}
	};

	/**
	 * @author: tphan37
	 * date: 18-Dec-2015
	 * Save detail and show messages success or not
	 * Automatic calling the parent document for saving
	 * @param  {Object}		 currUiService	   moduleSerice will using to save this document
	 * @param  {Object}		 flags			   which
	 *		 (bool)			   bCompute			will compute this document when saving
	 *		 {bool}			   bShowSavedMessage   will show message after saving successful?
	 * @return {[type]}				 Angular promise
	 */
	$scope.saveDetailNotCompute = function saveDetailNotCompute (currUiService, flags) {
		return uiFrameworkService.saveDetailNotCompute.call(this, currUiService, flags);
	};
	
	/**
	 * @author: tphan37
	 * date: 16-Dec-2015
	 * This fn support get parent element which link to this document
	 * Eg: Case has list quotation. When open a quotation, in quotation-ctrl call this fn, will return the element in case doc,
	 * which is the place to put docId of this quotation 
	 * @returns  {Object}		  an element in multiple element of parent doc, which store the uid of child doc (doc request this fn)
	 */
	$scope.getRightDetailInMultipleEleFromParentDoc = function getRightDetailInMultipleEleFromParentDoc() {
		var self = this;
		var uiStructure = self.getAssociateUiStructureRoot();
		return uiStructure.parent.refDetail;
	};
	
	/**
	 * @author: tphan37
	 * date: 16-Dec-2015
	 * get metadata list of children from a parent card
	 * @param  {String} pCardName		   the name of card want to get its children metadata
	 * @returns  {Array}		  list metadata of children
	 */
	$scope.getMetadataListFromCard = function getMetadataListFromCard(pCardName){
		var metadataLs = [];
		var parentCard = this.getCardDataWithName(pCardName);
		for(var i = 0; i < parentCard.children.length; ++i){
			if(parentCard.children[i].metadata)
				metadataLs.push(parentCard.children[i].metadata);
		}
		return metadataLs;
	};
	
	/**
	 * capture the clicking event on card
	 * @param  {Object} card			current card
	 * @param  {Object} selectLevel		   the selectLevel of chosing card
	 * @param  {Object} selectIndex	 the index of chosing card
	 * @param  {Object} $event		  js event for clicking
	 */   
	$scope.chooseCard = function chooseCard(card, selectLevel, selectIndex, $event) {
		uiFrameworkService.chooseCard(card, selectLevel, selectIndex, $event, this, $scope.requestURL);
	};
	
	/**
	 * capture the clicking event on section
	 */
	$scope.chooseSection = function chooseSection(card, selectLevel, selectIndex, $event) {
		//uiFrameworkService.chooseSectionNew(card, selectLevel, selectIndex, $event, this, $scope.requestURL);
		uiFrameworkService.chooseSectionAndOpenOnlyOneSectionAtTime(card, selectLevel, selectIndex, $event, this, $scope.requestURL);
	};
	
	/**
	 * capture the clicking event on tab
	 */
	$scope.chooseTab = function chooseTab(tab, selectLevel, selectIndex, $event) {
		uiFrameworkService.chooseTab(tab, selectLevel, selectIndex, $event, this, $scope.requestURL);

        
        // set active to header if tab level is 0
        if(tab.level == 0) {
        	var headerItemTagName = tab.name + 'Stage';
        	if(document.getElementById(headerItemTagName).classList.toString().indexOf("active") === -1) {
        		document.getElementById(headerItemTagName).classList.add("active");
        	}
        	
        	// set current tab index which is focused
        	uiFrameworkService.currentTabIndex = selectIndex;
        }
        
        $scope.openQuotationDetailIfNecessary(tab);
	};
	
	/**
	 * Load quotation data to fill quotation summaries
	 */
	$scope.getQuotationsForQuotationSummaries = function getQuotationsForQuotationSummaries() {
		angular.forEach($scope.salecaseCoreService.detail.quotations.value, function(item){
			if (item.refId && item.refId.value) {
				$scope.salecaseCoreService.getDocumentWithouUpdateDetail(undefined, item.refType.value, item.refId.value, undefined, item.refBusinessType.value, item.refProductName.value).then(function(data){
					item.summary = data;
				});
			}
		});
	};
	
	/*
	 * hle71 - a cheat to open the quotation when generating a business case from a standalone quotation
	 */
	$scope.openQuotationDetailIfNecessary = function(tab) {
		if (tab.name !== "case-management-base:Quotation" || localStorage.getItem('isOpenQuotationDetailGeneratedFromQuickQuote') !== 'Yes') {
			return;
		}
		
		// Clear the flag
		localStorage.removeItem('isOpenQuotationDetailGeneratedFromQuickQuote');
		
     	// Open the quotation detail after the business case is open and the quotation tab is selected
		var delayedSeconds = 1;
		$timeout(function() {
			var quotationCards = angular.element(document).find('ui-quotation-card-content');
			if (quotationCards && quotationCards.length === 1) {
				quotationCards[0].click(); // click on the first card - in fact, there is only one card
			} else {
				$log.error('Could not find the quotation card in ' + delayedSeconds + '. Try increasing it a little bit.');
			}
		}, delayedSeconds * 1000);
	};
	
	/**
	 * chooseQuotationCard
	 * Handle a click action on quotation card
	 * */
	$scope.chooseQuotationCard = function chooseQuotationCard(card, selectLevel, selectIndex, $event) {
		uiFrameworkService.chooseQuotationCard(card, selectLevel, selectIndex, $event, this, $scope.requestURL);
	}
	
	
	/**
	 * chooseGroupSection
	 * @description action when section in the group section is clicked
	 * */
	$scope.chooseGroupSection = function chooseGroupSection(section, selectLevel, selectIndex, childrenIndex, $event) {
		uiFrameworkService.chooseGroupSection(section, selectLevel, selectIndex, childrenIndex, $event, this, $scope.requestURL);
	};
	
	
	/**
	 * go to previous tab
	 * Important: parent's ui style must be tab style
	 * */
	$scope.goToPreviousTab = function goToPreviousTab() {
		if(this.viewProp.uiStyle === 'tab' && uiFrameworkService.currentTabIndex > 0) {
			var willOpenTabAtIndex = $scope.getTabIndexToOpenAutomaticallyToTabIndex(this.viewProp.viewObject[0], uiFrameworkService.currentTabIndex - 1);
			if(willOpenTabAtIndex === undefined) return;
			var willOpenTab = this.viewProp.viewObject[0][willOpenTabAtIndex];
			$scope.openTab(willOpenTab, willOpenTabAtIndex);
		} 
	}
	
	/**
	 * go to next tab
	 * Important: parent's ui style must be tab style
	 * */
	$scope.goToNextTab = function goToNextTab() {
		if(this.viewProp.uiStyle === 'tab' && (uiFrameworkService.currentTabIndex < this.viewProp.viewObject[0].length - 1)) {
			var willOpenTabAtIndex = $scope.getTabIndexToOpenAutomaticallyFromTabIndex(this.viewProp.viewObject[0], uiFrameworkService.currentTabIndex + 1);
			if(willOpenTabAtIndex === undefined) return;
			
			var willOpenTab = this.viewProp.viewObject[0][willOpenTabAtIndex];
			
			$scope.openTab(willOpenTab, willOpenTabAtIndex);
		}
	}
	
	/**
	 * @author hnguyen294
	 * @description Open tab at tab index 
	 * @param willOpenTab {Object} tab info of tab will be opened
	 * @param atTabIndex {Integer} position of tab will be opened
	 * */
	$scope.goToTab = function(willOpenTab, atTabIndex) {
		if(atTabIndex == uiFrameworkService.currentTabIndex) return;
		 
		$scope.openTab(willOpenTab, atTabIndex);
	}
	
	
	/**
	 * @author hnguyen294
	 * @description open willOpenTab tab and update current tab index which is opened
	 * @param willOpenTab {Object} tab info of tab will be opened
	 * @param atIndex {Integer} position of tab will be opened
	 * */
	$scope.openTab = function openTab(willOpenTab, atIndex) {
		$scope.moveToCardByCardUIStructureInfo(willOpenTab);
		
		// wait for render ui completed and set current index
		$timeout(function() {
      	  if(willOpenTab.isSelected) uiFrameworkService.currentTabIndex = atIndex;
        }, 1500);
	}
	
	
	/**
	 * @author hnguyen294
	 * @description check to enable or disable next button of tab ui
	 * */
	$scope.shouldDisableNextTabButton = function shouldDisableNextTabButton() {
	    var posTabOpenAtNextNextAction = $scope.getTabIndexToOpenAutomaticallyFromTabIndex(this.viewProp.viewObject[0], uiFrameworkService.currentTabIndex + 1);
	    if(posTabOpenAtNextNextAction === undefined) {
	    	return true;
	    } else {
	    	return false;
	    }
	}
	
	
	/**
	 * @author hnguyen294
	 * @description check to enable or disable back button of tab ui
	 * */
	$scope.shouldDisableBackTabButton = function shouldDisableBackTabButton() {
		var posTabOpenAtNextBackAction = $scope.getTabIndexToOpenAutomaticallyToTabIndex(this.viewProp.viewObject[0], uiFrameworkService.currentTabIndex - 1);
		if(posTabOpenAtNextBackAction === undefined) {
			return true;
		} else {
			return false;
	    }
	}
	

	//support direct sale
	//keep quotation data
	//restore current working space after login
	$scope.getViewHistory = function(){
		//update history select card name to local storage (support direct sale)
		if(this.viewProp.historySelect.length){
			for(var i = 0 ; i < this.viewProp.historySelect.length ; i++){
				uiFrameworkService.listCardHistory[i] = this.viewProp.historySelect[i].refUiStructure.name;
			}
			localStorage.setItem( 'listCardHistory' , JSON.stringify(uiFrameworkService.listCardHistory));
			localStorage.setItem( 'caseDSDetail' , JSON.stringify(quotationCoreService.detail));
		}
		
	};
	
	$scope.closeChildCardsBreadCrum = function closeChildCardsBreadCrum(closeLevel, breadCrum){	 
		var self = this;
		var isLastBreadCrum = true;
		var card = breadCrum;
		
		if(breadCrum.refUiStructure != undefined){		  
			card = breadCrum.refUiStructure;			
			if(self.viewProp.historySelect.length > 0){
				if(self.viewProp.historySelect.length < 1 || self.viewProp.historySelect[self.viewProp.historySelect.length-1].refUiStructure.level != closeLevel){
					closeLevel = closeLevel + 1;
				} else{
					card.isSelected = false;
					card.scope.setSelectCss();
					card.scope.setCssLeafCard();
					isLastBreadCrum = false;
				}				   
			}		   
		}
		if(isLastBreadCrum){ // currency breadCrum is last Bread Crum 
			if(card.children != undefined  && card.children.length > 0){
				for(var i = 0; i < card.children.length; i++){
					card.children[i].isSelected = false;
					card.children[i].scope.setSelectCss();
					card.children[i].scope.setSelectCss();
				}
			}else if(card.linkUiStructure != undefined && card.linkUiStructure.children != undefined && card.linkUiStructure.children.length > 0){
				for(var i = 0; i < card.linkUiStructure.children.length; i++){
					card.linkUiStructure.children[i].isSelected = false;
					card.linkUiStructure.children[i].scope.setSelectCss();
					card.linkUiStructure.children[i].scope.setSelectCss();
				}
			}else{		  
				card.isSelected = false;
				card.scope.setSelectCss();
				card.scope.setCssLeafCard();
			}					   
		}
		uiFrameworkService.closeChildCards(closeLevel, self);
		
	};

	/**
	 * marking the valid status for a node
	 */
	$scope.markValidStatus = function (node) {
		uiRenderPrototypeService.markValidStatus(node);
	}
	
	$scope.updateParentValidStatus = function (node) {
		uiRenderPrototypeService.updateParentValidStatus(node);
	}
	
	/**
	 * add element to ipos document & new card on the screen
	 * @param {Object}	  card	   the card which received the clicking event (uiStructure)
	 * @param {function}	fnCallBack the function will be execute after the method executed
	 * @param {Object}	  getChildDetail use existing child detail for new card
	 *
	 */
	$scope.addCard = function addCard (card, fnCallBack, getChildDetail) {
		var self = this;
		var defer = $q.defer();
		//if card is action card, get the parent
		//Otherwise, use card to get the list of children need to add
		var parentCard = card.cardType === uiRenderPrototypeService.CONSTANTS.cardType.ACTION ? card.parent : card;
		uiRenderPrototypeService.addChildElement({
			"parentCard" : parentCard,
			"templateId": card.templateId,
			"requestURL": self.requestURL,
			"callBackFn": fnCallBack,
			"getChildDetail": getChildDetail,
			"docType": self.moduleService.detail.metaData.docType.value,
			"businessType": self.moduleService.detail.metaData.businessType.value,
			"productName": self.moduleService.detail.metaData.productName.value
		}).then(function(data) {
			defer.resolve(data);
		});
		return defer.promise;
	};

	/*
	 * Check 'counter' and 'minOccurs' values to decide whether card can be removed
	 * And check 'freeze' condition
	 */
	$scope.isCardRemovable = function isCardRemovable (card) {
		return (card.parent.refDetail.value.length > card.parent.refDetail.meta.minOccurs)
			 && !card.scope.moduleService.freeze;
	};
	
	/**
	 * Internal functions called by UI Framework. Which remove an element in multiple element list
	 */
	$scope.removeCardInList = function removeCardInList (i18nMessage, fnCallBack, card) {
		//if card or index is undefined, try to use the value from 'this'
		card = card || this.card;
		var index = card.scope.$index;
		
		function removeCard() {
			if ((card !== undefined) && (index !== undefined)) {
				uiRenderPrototypeService.removeChildElement(card.parent, index, fnCallBack);
			}
		}

		if (i18nMessage) {
			commonUIService.showYesNoDialog(i18nMessage, removeCard);
		} else {
			//if no message, remove card directly
			removeCard();
		}
	};

	/**
	 * Internal functions called by UI Framework. Will remove all children template card of card with name
	 * @param {string}	  parentCardName	   card name which wants to remove its template children card
	 * @param {string}	  i18nMessage	   if not null, will show a popup to confirm the removing
	 * @param {function}	fnCallBack	   execute after the removing is complete
	 */
	$scope.remChildrenInCard = function remChildrenInCard(parentCardName, i18nMessage, fnCallBack) {
		 //if card or index is undefined, try to use the value from 'this'
		var card = this.getCardDataWithName(parentCardName);

		function removeCard() {			
			if((card !== undefined)){
				uiRenderPrototypeService.removeAllChildrenElement(card, fnCallBack);
			}
		}

		if(i18nMessage){
			commonUIService.showYesNoDialog(i18nMessage, removeCard);   
		}else{
			//if no message, remove card directly
			removeCard();
		}
	};

	$scope.setScrollBreadCrum = function() {
		var scroll = $(window).scrollTop();
		var height = $('#containerRight').height() - scroll + 50 + 'px';
		if (scroll > 150) {

			$('.v3-bread-crum-list').css({
				'height': height
			});

		} else{
			$('.v3-bread-crum-list').css({
				'height': '100%'
			});
		}
	};

	$scope.checkLoadBreadCrum = function() {
		if($scope.vars.isShowLeftSidebar){
			if($scope.isLoadBreadCrum){   
				$scope.isLoadBreadCrum = false;
				$('#containerRight')[0].style.float="none";
			}else{		  
				if($(window).width() > 800){
					$scope.isLoadBreadCrum = true;
					$('#containerRight')[0].style.float="left";
				}		   
			}		
			$scope.setScrollBreadCrum();
		}
	};
	
	$scope.isRunOnTablet = function() {
		return uiRenderPrototypeService.isRunOnTablet();
	};
	
	/*
	 *hle56
	 *we need resetup all card's children have the same refDetail with other.
	 *Ex. Attachment refDetail,...
	 */
	$scope.resetupTemplateChildrenCard = function() {
		var card = this.card; //current card is opening.
		uiRenderPrototypeService.removeAllOtherTypeUiStructure(card.parent);
		uiRenderPrototypeService.setTemplateToUIStructure(card);
	};

	/**
	 * Calling two concurrent function sync
	 * @param {Object}  fnInput  two functions input object
	 * @return {Object}  promise after execute second function
	 */
	$scope.syncChainFn = function(fnInput) {
		var self = this;
		var firstFn = fnInput.firstFn || self.moduleService.$q.when;
		var secondFn = fnInput.secondFn || self.moduleService.$q.when;
		firstFn.apply(self, fnInput.firstFnParams).then(function() {
			return secondFn.apply(self, fnInput.secondFnParams);
		});
	};
	$scope.hasRoles = function hasRoles(listRoles){
		var result = false;
		listRoles.forEach(function (role) {
			if($scope.aclService.hasRole(role)){
				result = true;
			}
		});
		return result;
	};
	
	$scope.hasRolesInLocalStorage = function hasRoles(roleCheck){
		var result = false;
		var roles = localStorage.getItem('roles');
		if (commonService.hasValueNotEmpty(roles)) {
			roles = JSON.parse(roles);
		}
		if (roles !== undefined && Array.isArray(roles) && roles.length > 0) {
			roles.forEach(function(role) {
				if(role.roleId == roleCheck)
					result = true;
			});
		}
		return result;
	};
	$scope.hasRolesInSALocalStorage = function(){
		var result = false;
		var roles = JSON.parse(localStorage.getItem('selected_profile'));
		
	
				if(roles.role == "SA"){
					result=true;
				}
		
		return result;
	};
	
	$scope.isRoleAgent = function isRoleAgent(){
		var selected_profile = localStorage.getItem('selected_profile');
		if (commonService.hasValueNotEmpty(selected_profile)) {
			var selected_profileJSON = JSON.parse(selected_profile);
			var roleAG = selected_profileJSON.role;
		}
		if (roleAG === 'AG'){
			return true
		}
		return false
	};
	
	/**
	 * @listStatus: list status need to check
	 */
	$scope.isOperationStatusIn = function (listStatus) {
		var currentOperationStatus = salecaseCoreService.detail.metaData.operationStatus.value; //current CASE's status
		return listStatus.indexOf(currentOperationStatus)!=-1;
	};
	
	$scope.checkOpenCardDocumentCenter = function() {
			var self = this;
			var quotationType = self.findElementInElement(self.salecaseCoreService.detail,['businessInformation','typeCode','value']);
			if(!quotationType){
				commonUIService.showNotifyMessage("v4.message.documentcenter.notchoosequotationType", "fail");
				return false;
			}else{
				self.refreshDetail().then(function(data) {
					if (self.moduleService.isSuccess(data)) {
						//update detail in scope underwriting admin 
						self.reSetupConcreteUiStructure(
								self.moduleService.detail,
								commonService.CONSTANTS.UI_STRUCTURE.NOT_REMOVE_TEMPLATE_CHILDREN,
								commonService.CONSTANTS.UI_STRUCTURE.EXPECTED_DETAIL_NOT_CHANGED);
					}
				});
				return true;
			}
	};
	$scope.getCurrentDate = function() {
		var self = this;
        var deferred = self.moduleService.$q.defer();
        self.moduleService.getCurrentDate(self.requestURL).then(function (time) {
            deferred.resolve(time);
        });
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
	
	//Fix time-zone for only Singapore    
    $scope.configTimeZoneForSingapore = function(fieldCheck) {
    	if(fieldCheck) {
        	//Check time-zone is Singapore   
	    	var timezone = new Date().getTimezoneOffset();
	    	timezone = - timezone / 60;
	    	if(timezone == 8) {
	    		var date = new Date(fieldCheck);
	    		
	    		var day = date.getDate();
	    		var month = date.getMonth() + 1;
	    		var year = date.getFullYear();
	    		
	    		var dateCheck = new Date(year, month-1, day);
	    		if(dateCheck > new Date(1982, 0, 1) ||
	    				dateCheck <= new Date(1945, 8, 11) && dateCheck > new Date(1942, 1, 16)) {
	    			return fieldCheck;
	    		} else if((dateCheck <= new Date(1982, 0, 1) && dateCheck >= new Date(1945, 8, 12)) || 
	    				(dateCheck <= new Date(1942, 1, 16) && dateCheck > new Date(1941, 8, 1))) {
	    			fieldCheck = fieldCheck.slice(0,20) + "0730";
	    		} else if(dateCheck <= new Date(1941, 8, 1) && dateCheck > new Date(1933, 0, 1)) {
	    			fieldCheck = fieldCheck.slice(0,20) + "0720";
	    		} else if(dateCheck <= new Date(1933, 0, 1) && dateCheck > new Date(1905, 5, 1)) {
	    			fieldCheck = fieldCheck.slice(0,20) + "0700";
	    		} else {
	    			fieldCheck = fieldCheck.slice(0,20) + "0655";
	    		}
	    	}
    	}
    	return fieldCheck;
    };
    $scope.checkValidQuotation = function checkValidQuotation(card){
    	var quoList = {};
    	if(card.name == "case-management-base:Quotation"){
    		quoList = card.refDetail.value;
    		if(quoList != undefined){
	    		for(var i = 0; i < quoList.length;i++){
	    			if(quoList[i].refBusinessStatus.value == "ACCEPTED") return true;
	    		}
    		}
    	}
    	else return false;
    }
}];