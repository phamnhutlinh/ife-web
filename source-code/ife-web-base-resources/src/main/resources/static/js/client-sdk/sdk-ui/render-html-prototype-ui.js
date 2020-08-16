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
var uiRenderPrototypeModule = angular.module('uiRenderPrototypeModule', ['uiRenderModule'])
.service('uiRenderPrototypeService', ['$q', '$log', 'loadingBarService', '$http', '$location', '$injector', 'ajax', 'appService', 'cacheService', 'commonUIService', 'commonService', 'uiRenderCoreService' , 'AclService', '$rootScope', 
	function($q, $log, loadingBarService, $http, $location, $injector, ajax, appService, cacheService, commonUIService, commonService, uiRenderCoreService, AclService, $rootScope) {
		
	function UiRenderUIService($q, ajax, $location, appService, cacheService, uiRenderCoreService, commonService, AclService){
		var self = this;
		uiRenderCoreService.constructor.call(this, $q, ajax, $location, appService, cacheService, uiRenderCoreService.detailCoreService, commonService);


		self.name = "uiRenderPrototypeService";
		self.moduleService = uiRenderCoreService;

		//for setting default value to detail. Default is true, need to set to false for production environment
		self.DEV_MODE = commonService.options.DEV_MODE;

		if(!commonService.options.cacheUiJsonMock)
			commonService.removeLocalStorageVariables();//clear all old values
		
		self.aclService = AclService;
	}
	inherit(uiRenderCoreService.constructor, UiRenderUIService);
	extend(commonUIService.constructor, UiRenderUIService);

		/**
		 * Using this functions everytime need to re-associate the detail with uiStructure
		 * Ex: After computing, the output in detail will be changed
		 * --> need to call this fn so the display of element with "counter" can be refresh
		 * When success, the new "detail" will be binded with current uiStructure of this doctype
		 * @param  {Object} uiStructureRoot the root of uiStructure that started resetup
		 * @param  {Object} detail ipos v3 json dataset
		 * @param  {String} requestURL ipos v3 url to call backend
		 * @param  {boolean} notRemoveTemplateChildren if true, then keep all template children in uiStructure, else remove them all, default to undefined (will remove)
		 * @param  {boolean} expectedDetailNotChanged expected state of isDetailChanged is unchanged, default is undefined (inherited from parent)
		 */
		UiRenderUIService.prototype.reSetupConcreteUiStructure = function reSetupConcreteUiStructure (uiStructureRoot, detail, requestURL, notRemoveTemplateChildren, expectedDetailNotChanged) {
			var defer = $q.defer();

			//remove all template children in case of number of template children will change
			if (!notRemoveTemplateChildren) {
				this.removeAllOtherTypeUiStructure(uiStructureRoot);
			}

			//expect all detail not changed, synced from root
			if (expectedDetailNotChanged) {
				uiStructureRoot.isDetailChanged = false;
			}

			//calling main function
			this.setupConcreteUiStructure(uiStructureRoot, detail, requestURL, notRemoveTemplateChildren)
				.then(function () {
					defer.resolve();
				});

			return defer.promise;
		};

		/**
		 * This functions will combine the "detail" object with empty (shell) uiStructure to become a concrete uiStructure
		 * @param  {Object} shellUiStructure a shell uiStructure (without detail)
		 * @param  {Object} detail           ipos v3 json dataset
		 * @param  {String} requestURL
		 */
		UiRenderUIService.prototype.setupConcreteUiStructure = function setupConcreteUiStructure (shellUiStructure, detail, requestURL, notRemoveTemplateChildren) {

			var self = this;
			var defer = $q.defer();
			if(commonService.hasValueNotEmpty(detail)){

				//convert object to array
				if(commonService.hasValueNotEmpty(shellUiStructure.arrayKey)){
					for(var i = 0; i < shellUiStructure.arrayKey.length; i++){
						self.convertObjectToArray(detail, shellUiStructure.arrayKey[i]);
					}
				}

				self.setupRefDetails(shellUiStructure, detail, undefined, notRemoveTemplateChildren);
				
				//For UIC: uiStructureRoot can not be override by whole detail
				//hle56
				if(!shellUiStructure.isKeepRefDetailFromKey){
					//need to bind the whole iPOS v3 document to the root uiStructure
					shellUiStructure.refDetail = detail;
				}
				//shellUiStructure has became a concrete UiStructure

				self.initIsRenderValues(shellUiStructure);

				self.removeStandaloneSection(shellUiStructure);

				//Comment out, so the uiStructure can be resetup again on those uiStructure not visible
				//for those fields which not visible on screen, but be preview fields for other cards
				// self.removeInvisibleChildSection(shellUiStructure);
				self.setTemplateToUIStructure(shellUiStructure);

				//TODO: need load metadata?
				//self.loadAllMetadata(shellUiStructure, requestURL).then(function (){
				//	defer.resolve();
				//});

//				if(self.DEV_MODE){
				self.setDefaultValueToUiEle(shellUiStructure);
				

				self.markValidStatus(shellUiStructure);
				self.markNumberOfEmptyFields(shellUiStructure);

				//need to decorate again, because the prospect inside case need to be a specific color
				self.decorateWithDetail(shellUiStructure);

				if (self.isDocumentEditable(shellUiStructure)) {
					shellUiStructure.addActionCardsRecursive();
				} else {
					self.removeClickableIcon(shellUiStructure);
				}

				$log.debug("Created CONCRETE uiStructure (see below) for: " + JSON.stringify(shellUiStructure.docParams));
				$log.debug(shellUiStructure);

				defer.resolve();
			} else {
				defer.resolve();
			}

			return defer.promise;
		};


		/**
		 * refresh uiStructure view attribute
		 * @param  {[type]} uiStructure [description]
		 * @return {[type]}             [description]
		 */
		UiRenderUIService.prototype.refreshUiStructureView = function refreshUiStructureView (uiStructure) {
			if(uiStructure.scope)
				uiStructure.scope.refreshCardContent();

			for (var i = uiStructure.children.length - 1; i >= 0; i--) {
				this.refreshUiStructureView(uiStructure.children[i]);
			}
		};

		/**
		 * @param  {Object} uiStructure uiStructure need to remove 'preview' fields
		 */
		UiRenderUIService.prototype.removePreviewFields = function removePreviewFields (uiStructure) {
			this.traverseAndProcess(uiStructure, [function (cUiStructure) {
				if(cUiStructure.preview)
					cUiStructure.preview.length = 0;
			}]);
		};

		/**
		 * NOTE: currently this function only accurate with action & template cards is in the end of the list
		 * Remove all child action & template cards in uiStructure
		 * @param  {Object} uiStructure uiStructure need to remove
		 */
		UiRenderUIService.prototype.removeAllOtherTypeUiStructure = function removeAllOtherTypeUiStructure (uiStructure) {
			this.traverseAndProcess(uiStructure, [function (cUiStructure) {
				// var tmpArr = [];
				var childLen = cUiStructure.children ? cUiStructure.children.length : 0;
				for (var i = 0; i < childLen; i++) {
					if(cUiStructure.children[i].cardType !== this.CONSTANTS.cardType.DEFAULT){
						cUiStructure.children.length = i;
						break;
					}
					// if(cUiStructure.children[i].cardType === this.CONSTANTS.cardType.DEFAULT){
					// 	tmpArr.push(cUiStructure.children[i]);
					// }
				}
			}]);
		};

		/**
		 * Remove scope & html binded with this uiStructure's children
		 * @param  {[type]} uiStructure object need to release children's memory
		 */
		UiRenderUIService.prototype.removeRefLinkOfChildren = function removeRefLinkOfChildren (uiStructure) {
			uiStructure.root = undefined;
			uiStructure.refDetail = undefined;
			uiStructure.parent = undefined;

			this.traverseAndProcess(
				uiStructure,
				[function (cUiStructure) {
					cUiStructure.parent = undefined;
					cUiStructure.root = undefined;
					cUiStructure.scope = undefined;
					cUiStructure.html = undefined;
					cUiStructure.refDetail = undefined;

					//if it's link to other uiStructure, release the linking
					if(cUiStructure.linkCUiStructure){
						this.removeRefLinkOfChildren(cUiStructure.linkCUiStructure);
					}
				}],
				[function (uiElement) {
					uiElement.parent = undefined;
					// uiElement.root = undefined;
					uiElement.scope = undefined;
					uiElement.html = undefined;
					uiElement.refDetail = undefined;
				}]
			);
		};

		/**
		 * keep the
		 * @param
		 */
		UiRenderUIService.prototype.updatePreviewCardOnClose = function updatePreviewCardOnClose (uiStructure) {
			if(uiStructure.linkCUiStructure){
				var cardPreview = uiStructure.linkCUiStructure.preview;
				var parentReview = uiStructure.preview;
				var refDetailOfReview = [];

				//copy newest refDetail from
				for(var item in cardPreview)	{
					refDetailOfReview[item] = cardPreview[item].refDetail;
				}

				//reassign newest refDetail for preview card
				for(var item in cardPreview)	{
					parentReview[item].refDetail = refDetailOfReview[item];
				}
			}
		};

		/**
		 * Short: create 'parent' & 'root' references
		 * Long:
		 * 		make link (parent, root) between uiStructures.
		 *  	This functions will not create link for template & action card
		 *  	cause it make the copying more longer (need to copy referencing objs)
		 *  	When creating a concrete action card or template, call this fn again
		 *
		 * @param  {Object} childUiStructure 	uiStructure need to make references
		 * @param  {Object} parentUIStructure 	parent of childUiStructure. If undefined will assign 'root' and 'parent' to childUiStructure itself
		 */
		UiRenderUIService.prototype.makeLinkBetweenUiStructure = function makeLinkBetweenUiStructure(childUiStructure, parentUIStructure){
			// if(!childUiStructure.root){
			// 	childUiStructure.root = childUiStructure;
			// }

			//if 'parentUIStructure' is 'undefined', means 'childUiStructure' is a root uiStructure
			if(parentUIStructure){
				childUiStructure.root = parentUIStructure.root;
				childUiStructure.parent = parentUIStructure;
			}else{
				childUiStructure.root = childUiStructure;
			}


			//will bypass uiStructures in 'otherType' attribute
			//Cause we will making them when add action or template cards
			this.traverseAndProcess(
				childUiStructure,
				[function (cUiStructure, index, pUiStructure) {
					cUiStructure.parent = pUiStructure;
					cUiStructure.root = childUiStructure.root;
				}],

				[function (uiElement, index, pUiStructure) {
					uiElement.parent = pUiStructure;
				}]
			);
		};

		/**
		 * Got uiStructure empty object for this refDocType, after that combine the provided detail
		 * @param  {string} requestURL		[description]
		 * @param  {Object} detail     		ipos v3 document
		 * @param  {string}	docParams 		parameters relative to a doctype, include:
		 * @param  {string}	docParams		refDocType - doctype with product
		 * @param  {string} docParams 		businessType - business type (renewal, new_business)
		 * @param  {string} docParams		userRole - agent role (underwriter, agent,...)
		 * @param  {string} docParams		saleChannel - channel of sale (direct, agent, bance,..)
		 * @param  {object} moreParams 		more params
		 * @param  {object} moreParams		pUiStructure - parent of the creating uiStructure
		 * @return {object}            		Angular Promise. Will return uiStructure with detail combined when success
		 */
		UiRenderUIService.prototype.createConcreteUiStructure = function createConcreteUiStructure(requestURL, detail, docParams, moreParams) {
			var self = this;
			var defer = self.$q.defer();
			moreParams = moreParams || {};

			if(!detail){
				$log.debug('You initialized uiStructure of docType: ' + docParams.refDocType + ' without detail. Please init it with detail');
				$log.debug('detail: ' + detail);
			}

			self.getShellUiStructure(requestURL, docParams).then(
				function gotShellUiStructure (shellUiStructure) {

					self.makeLinkBetweenUiStructure(shellUiStructure);
					self.buildPreviewFields(shellUiStructure);


					if(moreParams.pUiStructure){
						//keep track the child uiStructure
						moreParams.pUiStructure.linkCUiStructure = shellUiStructure;
						shellUiStructure.parent = moreParams.pUiStructure;
					}

					self.setupConcreteUiStructure(shellUiStructure, detail, requestURL).then(function (){
						defer.resolve(shellUiStructure);
					});
				},
				function failed () {
					defer.reject();
				}
			);

			return defer.promise;
		};

		/**
		 * @author tphan37
		 * Dec-2015
		 * Remove all clickable icons of a uiStructure (icons which declared 'onClick')
		 * @param  {Object} uiStructure uiStructure need to remove all clickable icons
		 */
		UiRenderUIService.prototype.removeClickableIcon = function removeClickableIcon(uiStructure){
			if(uiStructure.cardType === "template"){
				//old structure of '@icon'
				if(uiStructure.icon && typeof(uiStructure.icon) === 'object'){
					uiStructure.icon.subAction = undefined;
				}

				//new structure of 'icons'
				for(var i in uiStructure.icons){
					//if icons has 'onClick' attribute, need to remove this icon
					if (uiStructure.icons[i]){
						if(uiStructure.icons[i].onClick)
							uiStructure.icons[i] = undefined;
							// delete uiStructure.icons[i];
					}
				}
			}

			if (uiStructure.children){
				for(var i = 0; i < uiStructure.children.length; i++){
					this.removeClickableIcon(uiStructure.children[i]);
				}
			}
		};

		/**
		 * Decorating uiStructure when it's detail. We might color it's prospect card with blue,...
		 * @param  {[type]} uiStructure [description]
		 * @return {[type]}             [description]
		 */
		UiRenderUIService.prototype.decorateWithDetail = function decorateWithDetail(uiStructure){

			if(uiStructure.refDetail){
				var refDocType = uiStructure.getRefDocTypeInDetail();

				//only decorate card again if there is no children card
				//Eg: FNA Joint Applicant & Client card
				if(refDocType && uiStructure.children.length === 0){
					this.decorateSection(uiStructure, refDocType);
				}
			}

			for(var i = 0; i < uiStructure.children.length; i++){
				this.decorateWithDetail(uiStructure.children[i]);
			}
		};

		UiRenderUIService.prototype.decorateSection = function decorateSection(uiStructure, refDocType){
			var self = this;
			self.getThemeData().then(
				function gotTheme () {
					var docTypeTheme = self.getThemeForDoctype(refDocType);
					self.processIcons(uiStructure, docTypeTheme);
					self.addCssClass(uiStructure, docTypeTheme);
				}
			);
		};

		/**
		 * Feb-24-2016
		 * @author tphan37
		 *
		 * evaluate and execute a function in renderUIService
		 * http://mattsnider.com/parsing-javascript-function-argument-names/
		 *
		 * NOTE: Only support primitive variable in arguments of fn (string, boolean, number)
		 *
		 * @param  {string} fnText 		the string need to evaluate
		 * @return {Object}             the value of executed fn or the input value
		 */
		UiRenderUIService.prototype.evalFn = function evalFn(fnText) {
			var fnName = fnText.slice(0, fnText.indexOf('('));
			var fn = this[fnName];

			if(typeof fn === 'function'){

				var paramsString = fnText.slice(fnText.indexOf('(') + 1, fnText.indexOf(')'));
				var paramsValue = paramsString.match(/([^\s,]+)/g);

				var args = [];
				if(paramsValue){
					for (var i = 0; i < paramsValue.length; i++) {
						try{
							args.push(JSON.parse(paramsValue[i]));
						}catch(e){
							args.push(paramsValue[i]);
							$log.error("Can't parse: " + paramsValue[i]);
						}
					}
				}

				return fn.apply(this, args);
			}else
				return fnText;
		};

		/**
		 * set default value in JsonMock to UI Elements
		 * @param  {Object} uiStructure [description]
		 */
		UiRenderUIService.prototype.setDefaultValueToUiEle = function setDefaultValueToUiEle (uiStructure){
			var defaultValue;
			
			if(uiStructure.isUiStructureLeaf()){
				var currUiEle = undefined;
				for(var i = 0; i < uiStructure.uiEle.length; i++){
					currUiEle = uiStructure.uiEle[i];
					if(currUiEle.defaultValue && currUiEle.refDetail &&
						!commonService.hasValueNotEmpty(currUiEle.refDetail.value)) {
						defaultValue = this.evalFn(currUiEle.defaultValue);
						currUiEle.refDetail.value = defaultValue;
					}
				}
			}

			if(uiStructure.children){
				for(var i = 0; i < uiStructure.children.length; i++){
					this.setDefaultValueToUiEle(uiStructure.children[i]);
				}
			}

		};

		/**
		 * Traverse all the content of a uiStructure, execute sectionExeFn() on "section" & uiEleExeFn() on uiEle
		 * NOTE: function will got 3 parameters
		 * 		1. the child uiStructure obj
		 * 		2. the child index in parent uiStructure
		 * 		3. the parent
		 *
		 * @param  {Object} 	uiStructure  		uiStructure has children need to process
		 * @param  {Array} 		sectionExeFn 		array of functions will be called to process an descendant uiStructure object
		 * @param  {Array} 		uiEleExeFn   		array of functions will be called to process an descendant uiEle object
		 * @param  {Object}		flags				flags for the processing
		 * {
		 * 		bProcessAll: {Boolean} 	 		if false, will process uiStructure in "children" attribute only, otherwise will process in otherType too
		 * }
		 *
		 */
		UiRenderUIService.prototype.traverseAndProcess = function traverseAndProcess (uiStructure, sectionExeFns, uiEleExeFns, flags) {
			if(!uiStructure.isUiStructureLeaf()){
				var childPool = uiStructure.children;

				//if need to process all the children (directly card children and other types card children)
				if(flags){
					if(flags.bProcessAll && uiStructure.otherType)
						childPool = uiStructure.children.concat(
							uiStructure.otherType.action, uiStructure.otherType.template);
				}


				var childLen = childPool.length;
				for (var i = 0; i < childLen; i++) {
					// if(childPool[i]){
						//call sectionExeFns
						if(sectionExeFns){
							for (var j = 0; j < sectionExeFns.length; j++) {
								sectionExeFns[j].call(this, childPool[i], i, uiStructure);
							}
						}

						this.traverseAndProcess(childPool[i], sectionExeFns, uiEleExeFns, flags);
					// }
				}

			}else{
				if(uiEleExeFns){

					var uiLen = uiStructure.uiEle.length;

					for (var i = 0; i < uiLen; i++) {

						//call uiEleExeFns
						for (var j = 0; j < uiEleExeFns.length; j++) {
							uiEleExeFns[j].call(this, uiStructure.uiEle[i], i, uiStructure);
						}
					}
				}
			}
		};

		/**
		 * @author tphan37
		 * 23/Nov/2015
		 * NOTE: for now it will run wrong with multiple card template (eg: other drivers with same uiStructure name)
		 * Construct or update the DescendantLs of root
		 * @param  {[type]} uiStructure uiStructure need to add to  'descendantLs' of root uiStructure
		 * @return {Object}             object stores {uiStructureName : uiStructureData}
		 */
		UiRenderUIService.prototype.buildDescendantLs = function buildDescendantLs (uiStructure) {
			var lsUiStructure = {};//store links to uiStructure
			var uiStructureRoot = uiStructure.root;//get the uiStructureRoot

			//if the 'descendantLs' is existed, use it and update it
			if(uiStructureRoot.descendantLs){
				lsUiStructure = uiStructureRoot.descendantLs;
			}
			//if not, we start to build the list
			else{
				uiStructureRoot.descendantLs = lsUiStructure;
				lsUiStructure[uiStructureRoot.name] = uiStructureRoot;
			}

			//create/add values for and 'lsUiStructure'
			lsUiStructure[uiStructure.name] = uiStructure;
			this.traverseAndProcess(
				uiStructure,
				[function (cUiStructure) {
					lsUiStructure[cUiStructure.name] = cUiStructure;
				}]
			);

			return lsUiStructure;
		};

		/**
		 * @author tphan37
		 * 23/Nov/2015
		 * Construct previews field for this uiStructure, and their children
		 * @param  {Object} uiStructure uiStructure need to initalize 'preview' fields (maybe template cards or uiStructure root)
		 */
		UiRenderUIService.prototype.buildPreviewFields = function buildPreviewFields (uiStructure) {
			var lsUiEle = [];//store links to uiEle, list of uiEles in this uiStructure
			var lsUiStructure = this.buildDescendantLs(uiStructure); //list of cards

			//create values for and 'lsUiStructure'
			this.traverseAndProcess(
				uiStructure,
				undefined,
				[function (uiElement) {
					lsUiEle.push(uiElement);
				}]
			);

			//now loop through 'lsUiEle' elements to link them with uiStructures
			for (var i = 0; i < lsUiEle.length; i++) {
				var lsCardPreviewFor = lsUiEle[i].previewFor; //names of cards which link to uiEles

				if(lsCardPreviewFor){
					for (var j = 0; j < lsCardPreviewFor.length; j++) {
						var card = undefined; //a specific card which links to this uiEle
						if (typeof lsCardPreviewFor[j] == 'object') {
							card = lsUiStructure[lsCardPreviewFor[j].cardName];
						} else {
							card = lsUiStructure[lsCardPreviewFor[j]];
						}
						if(card){
							if(!card.preview)
								card.preview = [];
							card.preview.push({
								uiElement: lsUiEle[i],
								label: lsCardPreviewFor[j].label,
								priority: lsCardPreviewFor[j].priority
							});
						}
						else{
							$log.error("Can't find the parent of 'preview' attribute of node with name:'" + lsCardPreviewFor[j] + "'");
							$log.error(lsUiStructure);
						}
					};
				}
			}

			for (var key in lsUiStructure){
				if(lsUiStructure[key].templates.PREVIEW.length > 0){
					lsUiStructure[key].preview = lsUiStructure[key].preview.concat(lsUiStructure[key].templates.PREVIEW).unique();
				}

			}

			//re order ui element by priority
			for (var key in lsUiStructure){
				if(lsUiStructure[key].preview){
					this.sortUIElementPriority(lsUiStructure[key].preview, "priority", false);
				}
			}
		};

		/**
		 * sorting array base on priority
		 * @param  {array}		previewArray		the objects array
		 * @param  {String}		sortBy	sort criteria
		 * @return {boolean}    ascending     sort ascending if ascending == true
		 */
		UiRenderUIService.prototype.sortUIElementPriority = function sortPriority (arrayList, sortBy, ascending) {
			var items = arrayList;
			if (items && angular.isArray(items)) {
				if (ascending == true) {
					items.sort(function (a, b) {
						return a[sortBy] - b[sortBy];
					});
				} else {
					items.sort(function (a, b) {
						return b[sortBy] - a[sortBy];
					});
				}
			} else {
				$log.error("Object is not an array.");
				$log.error(arrayList);
			}
		};

		/**
		 * @author tphan37
		 * Nov-2015
		 * Traverse through uiStructure to mark these uiStructure can be render or not
		 * @param  {Object} uiStructure the uiStructure and its descendant which need to be process
		 */
		UiRenderUIService.prototype.initIsRenderValues = function initIsRenderValues (uiStructure) {
			var self = this;

			// var sectionLen = uiStructure.children ? uiStructure.children.length : 0;
			// if(sectionLen > 0){
			if(!uiStructure.isUiStructureLeaf()){
				var childLen = uiStructure.children.length;
				for (var i = childLen - 1; i >= 0; i--) {
					self.initIsRenderValues(uiStructure.children[i]);
				};

				//if uiStructure doens't have child uiStructure, it might be visible for now
				if(childLen == 0)
					self.setRenderValues(uiStructure);
			}else{
				var uiLen = uiStructure.uiEle.length;
				var isCardVisible = false;
				var uiEle = undefined;

				//if uiStructure doens't have uiEle, it might be visible for now
				if(uiLen === 0)
					isCardVisible = true;
				else{
					for (var i = 0; i < uiLen; i++) {
						uiEle = uiStructure.uiEle[i];

						//if only one uiEle is visible, set card visible
						if(self.isElementVisible(uiEle.refDetail)){
							isCardVisible = true;
							break;
						}

					}
				}

				if(isCardVisible)
					self.setRenderValues(uiStructure);
			}
		};

	    /**
	     * remove child of a uiStructure obj if this child have only 1 section obj
	     * @param  {Object} uiStructure object need to remove descendant uiStructure's not visible
	     */
	    UiRenderUIService.prototype.removeStandaloneSection = function removeStandaloneSection (uiStructure) {
			// if(uiStructure.children){
			// 	var visibleChildren = this.getVisibleChildren(uiStructure);
    			
			// 	//if visibleChildren.length = 1, we're going to remove this only child
			// 	if(visibleChildren.length === 1 && uiStructure.refDetail && uiStructure.refDetail['@counter'] === undefined){
			// 		if( visibleChildren[0].children ){
			// 			uiStructure.children = visibleChildren[0].children;
			// 			//make links between grandparent & children
			// 			for (var i = 0; i < uiStructure.children; i++) {
			// 				uiStructure.children[i].parent = uiStructure;
			// 			};
			// 		}
			// 		else{
			// 			uiStructure.uiEle = visibleChildren[0].uiEle;
						
			// 			for (var i = 0; i < uiStructure.uiEle; i++) {
			// 				uiStructure.uiEle[i].parent = uiStructure;
			// 			};
			// 		}
					    				
			// 		childLen = uiStructure.children ? uiStructure.children.length : 0;
			// 	}

			// 	for (var i = 0; i < visibleChildren.length; i++) {
			// 		this.removeStandaloneSection(visibleChildren[i]);
			// 	};
				
			// }
	    };
	    
	    // UiRenderUIService.prototype.checkChildLength = function checkChildLength(childArr){
	    // 	var count = 0;
	    // 	for(var i = 0;i < childArr.length; i++){
	    // 		if(childArr[i].isVisible == true)
	    // 			count++;
	    // 		if(count > 1)
	    // 			return false;
	    // 	}
	    // 	return true;
	    // }
	    // 
	    //     UiRenderUIService.prototype.getVisibleChildPos = function getVisibleChild(uiStructure){
	    // 	var count = 0;
	    // 	var j = 0;
	    // 	for(var i = 0;i < childArr.length; i++){
	    // 		if(childArr[i].isVisible == true){
	    // 			count++;
	    // 			j = i;
	    // 		}
	    // 		if(count > 1)
	    // 			return undefined;
	    // 	}
	    // 	return j;
	    // }

		/**
		 * return the children which are visible on screen
		 * @param  {Object} uiStructure uiStructure need to get the visible children
		 * @return {Array}             [description]
		 */
		UiRenderUIService.prototype.getVisibleChildren = function getVisibleChildren(uiStructure){
			var visibleChildren = [];
			if(!uiStructure.isUiStructureLeaf()){
				var childLen = uiStructure.children.length;
				for (var i = childLen - 1; i >= 0; i--) {
					if(uiStructure.children[i].isVisible == true)
						visibleChildren.push(uiStructure.children[i]);
				};
			}
			return visibleChildren;
		};

		/**
		 * return the children which are visible on screen
		 * @param  {Object} uiStructure uiStructure need to get the visible children
		 * @return {Array}             [description]
		 */
		UiRenderUIService.prototype.getVisibleUiElements = function getVisibleUiElements(uiStructure){
			var self = this;
			var visibleUiElements = [];
			if (uiStructure.isUiStructureLeaf()) {
				var uiEleLen = uiStructure.uiEle.length;
				for (var i = uiEleLen - 1; i >= 0; i--) {
					if (uiStructure.uiEle[i].view.isVisible == true && uiStructure.uiEle[i].type != this.CONSTANTS.type.PREVIEW)
						visibleUiElements.push(uiStructure.uiEle[i]);
				}
			} else {
				for (var i = 0; i < uiStructure.children.length; i++){
					visibleUiElements.concat(self.getVisibleUiElements(uiStructure.children[i]));
				}
			}
			return visibleUiElements;
		};

		/**
		 * Return the 'userRole' attribute value of an uiStructure.
		 * If not exist, return current user
		 * @param  {Object} uiStructure uiStructure need to get value
		 * @param  {bool} 	useDefaultRoot 	if true, will use value in uiStructureRoot
		 * @return {String}             the role need get the view for
		 */
		UiRenderUIService.prototype.getUserRole = function getUserRole(uiStructure, useDefaultRoot) {
			var defaultValue = useDefaultRoot ? uiStructure.root.docParams.userRole : commonUIService.getActiveUserRole(uiStructure.root.docParams);
			return uiStructure.userRole ? uiStructure.userRole : defaultValue;
		};


		/**
		 * remove invisible child secionts of a uiStructure obj
		 * @param  {Object} uiStructure object need to remove descendant uiStructure's not visible
		 */
		UiRenderUIService.prototype.removeInvisibleChildSection = function removeInvisibleChildSection (uiStructure) {
			if(!uiStructure.isUiStructureLeaf()){
				var childLen = uiStructure.children.length;
				var tmpSections = [];
				for (var i = 0; i < childLen; i++) {
					if(uiStructure.children[i].isRender){
						tmpSections.push(uiStructure.children[i]);
						this.removeInvisibleChildSection(uiStructure.children[i]);
					}
					else{
						this.removeRefLinkOfChildren(uiStructure.children[i]);
					}

				}

				//need to set 'length' to 0, so the references to the 'uiStructure.children' can keep the links
				uiStructure.children.length = 0;
				uiStructure.children.push.apply(uiStructure.children, tmpSections);	//http://stackoverflow.com/a/12190371
			}
		};

		UiRenderUIService.prototype.setTemplateToUIStructure = function setTemplateToUIStructure(uiStructure) {
			//hle56 mark template card level
			if(!uiStructure.templateLevel){
				uiStructure.templateLevel = 0;
			}
			
			var self = this;
			var template = uiStructure.otherType ? uiStructure.otherType.template[0] : undefined;
			var refDetail = [];

			if (template && uiStructure.refDetail) {
				refDetail = uiStructure.refDetail;
			}
			
			// only for UIC
			// hle56 TODO: findElementInElement
//			if (!refDetail.value && uiStructure.cardType === "template" && uiStructure.otherType.template.length > 0 && uiStructure.key && uiStructure.key.length > 0) {
//				refDetail = refDetail[uiStructure.key[0]];
//			}

			if ((Array.isArray(refDetail.value) || uiStructure.key) && template) {
				//if template is existed
				if (template && Array.isArray(template.key)) {
					var actionChildLen = uiStructure.getTemplateCardsLen();
					
					var detailForChild = refDetail.value || refDetail[uiStructure.key[0]].value; //use for level >= 2
					
					for (var i = actionChildLen; i < detailForChild.length; i++) {
						var newUiStructure = new UiStructure('cloneRecursive', [template]);
						
						newUiStructure.templateLevel = uiStructure.templateLevel+1; //hle56 mark template card level
						
						self.makeLinkBetweenUiStructure(newUiStructure, uiStructure);
						if(refDetail.value && Array.isArray(refDetail.value)){ // level1
							self.setupRefDetails(newUiStructure, detailForChild[i], true);
						}else{ // level >= 2
							self.setupRefDetails(newUiStructure, uiStructure.refDetail, true, undefined, i);
						}
						// update template parent uiStructure
						self.buildPreviewFields(newUiStructure);
						uiStructure.children.push(newUiStructure);
						
						//hle56 permission matrix
						//update editable with role
						if(newUiStructure.refDetail.hasOwnProperty('value') && !newUiStructure.refDetail.meta)
							newUiStructure.refDetail.meta = {};
						self.updateEditableMeta(newUiStructure);
					}
				} else {
					$log.debug("Card (see detail below) will not appear because of missing 'template' in otherType.");
					$log.debug(uiStructure);
				}
			}
			if (!uiStructure.isUiStructureLeaf()) {
				for (var i = 0; i < uiStructure.children.length; i++)
					self.setTemplateToUIStructure(uiStructure.children[i]);
			}
		};

		/**
		 * True if document (iPOS v3) can be edited. Eg: Business status is NEW or DRAFT
		 * @param  {[type]}  uiStructureRoot the root of uiStructure
		 * @return {Boolean}                 true if can, otherwise false
		 */
		UiRenderUIService.prototype.isDocumentEditable = function isDocumentEditable(uiStructureRoot) {
			var isEditable = true;
			/* TODO: Add more logic here
			if(uiStructureRoot.refDetail){
				var businessStatus =  this.findElementInElement(uiStructureRoot.refDetail, ['BusinessStatus']);
				switch(businessStatus){
					case ""://new document, don't have document
					case commonService.CONSTANTS.STATUS.DRAFT:
					case commonService.CONSTANTS.STATUS.NEW:
					case commonService.CONSTANTS.STATUS.DRAFT_QUOTATION:
						isEditable = true;
						break;
					default:
						isEditable = false;
				}
			}*/
			return isEditable;
		};
		
		/**
		 * This function will auto update editable in meta of uiStructure's refDetail.
		 * Update depend on role (permission) and current editable's value
		 * 
		 * Permission			Current editable's value	=>		Editable's value after update
		 * 	 true					true									true
		 *   true					false									false
		 *   false					true									false
		 *   false					false									false
		 *   
		 * @author hle56
		 * @param uiStructure
		 */
		UiRenderUIService.prototype.updateEditableMeta = function updateEditableMeta(uiStructure) {
			if(uiStructure.refDetail && uiStructure.refDetail.meta)
				uiStructure.refDetail.meta.editable = (this.isUiStructureEditableWithRole(uiStructure) && uiStructure.refDetail.meta.editable !== 'false') + '';
		};

		UiRenderUIService.prototype.calUiEleStatus = function calUiEleStatus (uiEle){
			var result = true;
			if (uiEle.refDetail) {
				result = uiRenderCoreService.isElementValid(uiEle.refDetail);
			}
			return result;
		};

		/**
		 * marking the valid status for a node
		 * @param  {Object} node uiElement or uiStructure
		 */
		UiRenderUIService.prototype.markValidStatus = function markValidStatus (node){
			// set default valid status
			node.validStatus = uiObjTmpl.validStatus;
			if (this.isUiElementObj(node)) {
				node.validStatus = this.calUiEleStatus(node) ? commonService.CONSTANTS.DOCUMENT_STATUS.VALID : commonService.CONSTANTS.DOCUMENT_STATUS.INVALID;
			} else {
				if(node.permission.openable2 && node.visible && node.isShowValidationIcon){ // card can be open
					//Check status on card base on length and minOccurs
					if (!this.isMinOccursSatisfied(node)) {
						node.validStatus = commonService.CONSTANTS.DOCUMENT_STATUS.INVALID;
					}

					//Check status for all children
                    var lsNode = node.children.length > 0 ? node.children : node.uiEle;
                    for (var i = 0; i < lsNode.length; i++){
                        this.markValidStatus(lsNode[i]);
                        if(lsNode[i].validStatus === commonService.CONSTANTS.DOCUMENT_STATUS.INVALID){
                            node.validStatus = commonService.CONSTANTS.DOCUMENT_STATUS.INVALID;
                        }
                    }
					//Check status for refType card, not open yet
					if (node.refDetail &&
						node.refDetail.status &&
						node.refDetail.status.value !== commonService.CONSTANTS.DOCUMENT_STATUS.VALID) {
						node.validStatus = commonService.CONSTANTS.DOCUMENT_STATUS.INVALID;
					}
				} else { // card can not be opened -> always valid
					node.validStatus = commonService.CONSTANTS.DOCUMENT_STATUS.VALID
				}
			}
			if(node.mandatoryCard == 'true' && node.refDetail.value.length == 0) {
            	node.validStatus = commonService.CONSTANTS.DOCUMENT_STATUS.INVALID;
            }
		};

		/**
		 * update INVALID/VALID status of uiElement
		 * @param  {Object} uiEle input need to update valid status
		 */
		UiRenderUIService.prototype.updateUiEleStatus = function updateUiEleStatus (uiEle) {
			var oldStatus = uiEle.validStatus;
			uiEle.validStatus = !this.calUiEleStatus(uiEle) ? commonService.CONSTANTS.DOCUMENT_STATUS.INVALID : commonService.CONSTANTS.DOCUMENT_STATUS.VALID;
			if (oldStatus !== uiEle.validStatus){
				this.updateParentValidStatus(uiEle);
			}
		};

		UiRenderUIService.prototype.isRefDetailChanged = function isDetailChanged(uiEle){
			return !uiRenderCoreService.compareData(uiEle.refDetail, uiEle.originalValue);
		};

		/**
		 * Check if an UiStructure was forgot by it's parent tree
		 * (ReSetupConcreteUiStructure cause this situation now)
		 */
		UiRenderUIService.prototype.isForgottenElement = function isForgottenElement(child){
			var parentElement = child.parent;

			if (parentElement !== undefined && child instanceof UiStructure) {
				if (parentElement.linkCUiStructure) {
					if (parentElement.linkCUiStructure._id == child._id) {
						return false;
					}
				}
				for (var i =0; i < parentElement.children.length; i++) {
					if (parentElement.children[i]._id == child._id) {
						return false;
					}
				}
				return true;
			}
			return false;
		};

		/**
		 */
		UiRenderUIService.prototype.updateParentDetailChanged = function updateParentDetailChanged(cElement){
			var pElement = cElement.parent;

			while(pElement){
				// if an element is forgot by it's parent, change isDetailChanged to it's parent isDetail Changed
				if (this.isForgottenElement(pElement)) {
					pElement.isDetailChanged = pElement.parent.isDetailChanged;
				}
				//stop if parent and child have different docId
				if (UiRenderUIService.prototype.isUiStructureObj(pElement) &&
					UiRenderUIService.prototype.isUiStructureObj(cElement) &&
					UiRenderUIService.prototype.getUiStructureDocUid(pElement) !== UiRenderUIService.prototype.getUiStructureDocUid(cElement)) {
					break;
				}
				//stop if status of child and father is the same, no more processing
				else if (pElement.isDetailChanged === cElement.isDetailChanged) {
					break;
				} else {
					// cElement = 'true' & pElement = 'false'
					if(cElement.isDetailChanged){
						pElement.isDetailChanged = cElement.isDetailChanged;
					}
					else{// cElement = 'false' & pElement = 'true'
						if(pElement.children.length > 0){
							//set pElement = false
							pElement.isDetailChanged = false;

							for (var i = 0; i < pElement.children.length; i++) {
								if(pElement.children[i].isDetailChanged){
									pElement.isDetailChanged = true;
									break;
								}
							}
						}
						else if(pElement.uiEle.length > 0){
							pElement.isDetailChanged = false;
							for (var i = 0; i < pElement.uiEle.length; i++) {
								if(pElement.uiEle[i].isDetailChanged){
									pElement.isDetailChanged = true;
									break;
								}
							}
						}
						/*else{
							//when import prospect, it's parent is template card with name "case-management-motor:Prospect"
							//instead of name "case-management-motor:Step1_ProspectClient"
							pElement.isDetailChanged = cElement.isDetailChanged;
						}*/
					}
				}
				cElement = pElement;
				pElement = pElement.parent;
			}
		};

		 /**
		 * (Dec-2015)
		 * Check the changes in detail
		 * The function'll also update uiStructure's parent isDetailChanged status
		 * @param  {Object} uiEle an uiElement need to check the changes in detail
		 */
		UiRenderUIService.prototype.checkChangeDetail = function checkChangeDetail(uiEle){
			$log.debug('Checking changes');
			if (this.isRefDetailChanged(uiEle)) {
				uiEle.isDetailChanged = true;
			} else {
				uiEle.isDetailChanged = false;
			}
			this.updateParentDetailChanged(uiEle);
		};

		/**
		 * Return the current valid status of this uiStructure
		 * @param  {Object} uiStructure uiStructure obj need to get valid status
		 * @return {Boolean}          		return true if valid, false if invalid
		 */
		UiRenderUIService.prototype.getValidStatus = function getValidStatus (uiStructure) {
			return uiStructure.validStatus;
		};

		/**
		 * @author tphan37
		 * (Oct-2015)
		 * Get the valid status for an uiStructure. For now the function will check:
		 * - If mandatory fields is not satisfied --> FALSE
		 * - If error messages is exist --> FALSE
		 * - If counter is lower than "minOccur" --> FALSE
		 * @param  {Object} uiStructure     uiStructure object
		 * @return {Boolean}          		return true if valid, false if invalid
		 */
		UiRenderUIService.prototype.isUiStructureValid = function isUiStructureValid(uiStructure){
			//for uiStructure with "counter" attribute
			if(uiStructure.refDetail && commonService.hasValueNotEmpty(uiStructure.minOccurs)){
				return this.isMinOccursSatisfied(uiStructure) && this.isMandatoryFieldSatisfy(uiStructure.refDetail);
			}

			//recursive to their children
			if(uiStructure.uiEle){
				var refDetail = undefined;
				for(var i = 0; i < uiStructure.uiEle.length; i++){
					refDetail = uiStructure.uiEle[i].refDetail;
					if(refDetail && angular.isObject(refDetail)){
						if(
							!this.isMandatoryFieldSatisfy(refDetail)
							|| this.isErrorMsgsExist(refDetail)
						){
							return false;
						}
					}
					else{
						$log.debug(uiStructure.uiEle[i].name + " doesn't have refDetail value");
						//return true;
					}

				}
			}

			return true;
		};

		/**
		 * @author tphan37
		 * (24-Mar-2016)
		 * Return the linking child uiStructure of the input
		 * @param  {Object} uiStructure     uiStructure object input
		 * @return {Object}          		the child linked uiStructure, if not exist, return null
		 */
		UiRenderUIService.prototype.getLinkChildUiStructure = function getLinkChildUiStructure(uiStructure) {
			if(uiStructure.linkCUiStructure)
				return uiStructure.linkCUiStructure;
			return null;
		};

		/**
		 * @author tphan37
		 * (24-Mar-2016)
		 * Check whether the children document detail has been changed or not
		 * Will return false if children uiStructure not exist
		 * @param  {Object} uiStructure     uiStructure object
		 * @return {Boolean}          		return true if children detail has changed, otherwise not
		 */
		UiRenderUIService.prototype.isChildUiStructureDetailChanged = function isChildUiStructureDetailChanged(uiStructure){
			var result = false;
			var childUiStructure = this.getLinkChildUiStructure(uiStructure);
			if(childUiStructure){
				result = childUiStructure.isDetailChanged;
			}

			return result;
		};

		/**
		 * @author tphan37
		 * (Oct-2015)
		 * Update parent's valid status. The algorithm is simple: if status of child & father is different
		 *  --> need to check for father status
		 * base on AND algorithm
		 * @param  {Object} cUiStructure the cUiStructure has father need to update valid status
		 */
		UiRenderUIService.prototype.updateParentValidStatus = function updateParentValidStatus(cUiStructure){
			var parent = cUiStructure.parent;
			var originalParent = cUiStructure.parent;
			var isContinue = true;
			while (parent && isContinue) {

				//stop if status of child and father is the same, no more processing
				if (parent.validStatus === cUiStructure.validStatus) {
					isContinue = false;
				} else {
					//if children cUiStructure is 'invalid', need to change parent's valid to commonService.CONSTANTS.DOCUMENT_STATUS.INVALID
					if (cUiStructure.validStatus === commonService.CONSTANTS.DOCUMENT_STATUS.INVALID) {
						parent.validStatus = commonService.CONSTANTS.DOCUMENT_STATUS.INVALID;
						
						if (parent.refDetail &&
								parent.refDetail.refType &&
								parent.refDetail.status) {
								//just update if has different
								if (parent.refDetail.status.value !== parent.validStatus) {
									parent.refDetail.status.value = parent.validStatus;

									//mask as detail changed, for auto save purpose
									parent.root.isDetailChanged = true;
								}
							}
					}
					//parent status is commonService.CONSTANTS.DOCUMENT_STATUS.INVALID, can change to commonService.CONSTANTS.DOCUMENT_STATUS.VALID if all of its children is commonService.CONSTANTS.DOCUMENT_STATUS.VALID
					else {
						//Update parent status  base on current children status
						parent.validStatus = cUiStructure.validStatus;

						if (parent.children.length > 0) {
							//first we set status to VALID
							parent.validStatus = commonService.CONSTANTS.DOCUMENT_STATUS.VALID;

							//if 'counter' conditions isn't satisfied, set it back to invalid
							if (!this.isMinOccursSatisfied(parent)) {
								parent.validStatus = commonService.CONSTANTS.DOCUMENT_STATUS.INVALID;
								break;
							}

							//now we go to check whether all of its children is commonService.CONSTANTS.DOCUMENT_STATUS.VALID
							for (var i = 0; i < parent.children.length; i++) {
								if (parent.children[i].validStatus === commonService.CONSTANTS.DOCUMENT_STATUS.INVALID) {
									parent.validStatus = commonService.CONSTANTS.DOCUMENT_STATUS.INVALID;
									break;
								}
							}
						}
						if (parent.uiEle.length > 0) {
							//first we set status to VALID
							parent.validStatus = commonService.CONSTANTS.DOCUMENT_STATUS.VALID;

							//now we go to check whether all of its children is commonService.CONSTANTS.DOCUMENT_STATUS.VALID
							for (var i = 0; i < parent.uiEle.length; i++) {
								if (parent.uiEle[i].validStatus === commonService.CONSTANTS.DOCUMENT_STATUS.INVALID) {
									parent.validStatus = commonService.CONSTANTS.DOCUMENT_STATUS.INVALID;
									break;
								}
							}
						}
						//Update parent status model for refType card
						if (parent.refDetail &&
							parent.refDetail.refType &&
							parent.refDetail.status) {
							//just update if has different
							if (parent.refDetail.status.value !== parent.validStatus) {
								parent.refDetail.status.value = parent.validStatus;

								//mask as detail changed, for auto save purpose
								parent.root.isDetailChanged = true;
							}
						}
						//child have parent but parent doesn't have child
						//--> child is from other doctype, it's a weak relationship
						/*else if(parent.children.length == 0){
						 parent.validStatus = cUiStructure.validStatus;
						 }*/
					}
				}

				//update card border color by valid status
				this.updateUIElementStatus(parent);

				cUiStructure = parent;
				parent = parent.parent;
			}
		};
		
		
		UiRenderUIService.prototype.getUIElementStyle = function getUIElementStyle(cardInfo) {
			var uiStyle = cardInfo.uiStyle;
			if(uiStyle === undefined) {
				var parentCard = cardInfo.parent;
				while(parentCard !== undefined) {
					uiStyle = parentCard.uiStyle;
					if(uiStyle) {
						break;
					} else {
						parentCard = parentCard.parent;
					}
				}
				if(uiStyle === undefined) {
					// get default ui style
					uiStyle = "section"; 
				}
			} 
			return uiStyle;
		}
		
		
		/**
		 * updateUIElementStatus 
		 * @description: update ui status of element 
		 * @author hnguyen294
		 * @param element {Object} element which need to update ui
		 * @return
		 * */
		UiRenderUIService.prototype.updateUIElementStatus = function updateUIElementStatus(element) {
			if (element && element.html) {
				var validStatus = element.validStatus;
				var uiStyle = this.getUIElementStyle(element.parent);
				switch(uiStyle) {
				case "card":
					if (element.validStatus === "INVALID" && element.html[0].querySelector(".card-element").classList.toString().indexOf("v3-box-invalid") === -1) {
						element.html[0].querySelector(".card-element").classList.add("v3-box-invalid");
						element.html[0].querySelector(".card-element").style.border = "2px solid red";
						element.html[0].querySelector(".v3-live-card-info").style.border = "2px solid red";
					} else if (element.validStatus === "VALID" && element.html[0].querySelector(".card-element").classList.toString().indexOf("v3-box-invalid") !== -1) {
						element.html[0].querySelector(".card-element").classList.remove("v3-box-invalid");
						element.html[0].querySelector(".card-element").style.border = "0px";
						element.html[0].querySelector(".v3-live-card-info").style.border = "0px";
					}
					break;
				case "section":
					if (element.validStatus === "INVALID" && element.html[0].querySelector(".section-element").classList.toString().indexOf("v3-section-invalid") === -1) {
						element.html[0].querySelector(".section-element").classList.add("v3-section-invalid");
						//element.html[0].querySelector(".section-element").style.border = "2px solid red";
						//element.html[0].querySelector(".v3-live-card-info").style.border = "2px solid red";
					} else if (element.validStatus === "VALID" && element.html[0].querySelector(".section-element").classList.toString().indexOf("v3-section-invalid") !== -1) {
						element.html[0].querySelector(".section-element").classList.remove("v3-section-invalid");
						//element.html[0].querySelector(".section-element").style.border = "0px";
						//element.html[0].querySelector(".v3-live-card-info").style.border = "0px";
					}
					break;
				case "tab":
					if (element.validStatus === "INVALID" && element.html[0].querySelector(".v4-tab-item-button").classList.toString().indexOf("v3-tab-invalid") === -1) {
						element.html[0].querySelector(".v4-tab-item-button").classList.add("v3-tab-invalid");
						//element.html[0].querySelector(".tab-element").style.border = "2px solid red";
						//element.html[0].querySelector(".v3-live-card-info").style.border = "2px solid red";
					} else if (element.validStatus === "VALID" && element.html[0].querySelector(".v4-tab-item-button").classList.toString().indexOf("v3-tab-invalid") !== -1) {
						element.html[0].querySelector(".v4-tab-item-button").classList.remove("v3-tab-invalid");
						//element.html[0].querySelector(".tab-element").style.border = "0px";
						//element.html[0].querySelector(".v3-live-card-info").style.border = "0px";
					}
					break;
				case "groupsecs":
					break;
				default:
					break;
				
				}
				
				
			}
		}

		/**
		 * check all input value with its mandatory
		 */
		UiRenderUIService.prototype.isErrorMsgsExist = function isErrorMsgsExist(elementDetail){
			// if(uiEle && uiEle.refDetail){
				if(elementDetail["errorMessage"] == undefined || elementDetail["errorMessage"] == ""){
					return false;
				}
				return true;
			// }
		};

		/**
		 * Decide whether an element in dataset is visible or not?
		 * @param  {Object}  element an element in dataset (runtime v3)
		 * @return {Boolean}         true if visible, otherwise is false
		 */
		UiRenderUIService.prototype.isElementVisible = function isElementVisible (element) {
			//if undefined, set visible for showing
			if (!element)
				return true;
			if (element['@visible'] === '0')
				return false;

			return true;
		};

	    /**
	     * Internal using only
	     * Find values in metadata document
	     * @param  {Object} metadata  	iPOS v3 metadata document
	     * @param  {Array} 	nameChains	array of strings, chain of name to find the value in iPOS v3 document
	     * @return {String}          	the result in metadata, or undefined if can't find
	     */
	    UiRenderUIService.prototype._findValueInMetadataByKey = function _findValueInMetadataByKey (metadata, nameChains) {
	    	if(nameChains && metadata){

	    		//we using only the last name in 'nameChains' (because the document is metadata)
	    		var originalName = nameChains.length > 1? nameChains.lastObj() : nameChains[0];

	    		var name = this.removePrefixOfName(originalName);
	    		return metadata[name];
	    	}
	    };

		/**
		 * Create preview fields for cards has metadata only
		 * @param  {[type]} uiStructure [description]
		 * @return {[type]}             [description]
		 */
		UiRenderUIService.prototype.buildPreviewFromMetadata = function buildPreviewFromMetadata (requestURL, uiStructure) {
			var self = this;
			if(uiStructure.metadata && !commonService.hasValueNotEmpty(uiStructure.previewHtml)){
				var refDocType = uiStructure.getRefDocTypeInDetail();
				var businessType = uiStructure.getBusinessType();
				var userRole = this.getUserRole(uiStructure);
				var saleChannel = uiStructure.getSaleChannel();

				//load the real uiStructure of this uiStructure
				this.getShellUiStructure(
					requestURL,
					{'refDocType': refDocType, 'businessType': businessType, 'userRole': userRole, 'saleChannel': saleChannel}
				).then(
					function gotShellUiStructure (shellUiStructure) {
						uiStructure.preview = [];
						self.makeLinkBetweenUiStructure(shellUiStructure);
						self.buildPreviewFields(shellUiStructure);
						var previews = shellUiStructure.preview;
						if(previews){
							for (var i = 0; i < previews.length; i++) {
								if(previews[i].uiElement) {
									previews[i].uiElement.refDetail = {
										$: self._findValueInMetadataByKey(uiStructure.metadata, previews[i].uiElement.key)
									};
								}
								previews[i].parent = undefined;
								uiStructure.preview.push(angular.copy(previews[i]));

							}
						}
					}
				);
			}
		};

		/**
		 * TODO: is the algorithm right? Does the childDetail store the datamodel for children?
		 * Combine UiStructure with detail, so every uiObject will have a correspondent part of detail
		 * @param  {Object} 	uiStructure 	[description]
		 * @param  {Object} 	detail      	ipos v3 document datamodel (maybe part of it)
		 * @param  {Boolean} 	isDetailRoot    if true, will bind detail to uiStructure directly
		 * @return {[type]}             	[description]
		 */
		UiRenderUIService.prototype.setupRefDetails = function setupRefDetails (uiStructure, detail, isDetailRoot, notRemoveTemplateChildren, indexChild) {
			var self = this;

			//immediately return if not has detail to setup
			if (!detail) return;

			//first time setup, default to false
			if (uiStructure.isDetailChanged === undefined) {
				uiStructure.isDetailChanged = false;
			}

			//inherited detail changed from parent uiStructure
			if (uiStructure.parent && (uiStructure.parent.isDetailChanged === false)) {
				uiStructure.isDetailChanged = false;
			}
			
			//hle56
			//update openable with role
			this.isUiStructureOpenableWithRole(uiStructure);
			
			//This case for node which is object and have card type with default
			if (commonService.hasValueNotEmpty(uiStructure.key)) {
				if (!angular.isArray(uiStructure.key)) uiStructure.key = [uiStructure.key];
				var childDetail = isDetailRoot ? detail : self.findElementInElement(detail, uiStructure.key);

				if (uiStructure.isShowOnlyLastItem === true && angular.isArray(childDetail.value)) {
					uiStructure.refDetail = childDetail.value[childDetail.value.length - 1];
				} else {
					uiStructure.refDetail = childDetail;
				}
				//store the original detail when card has template card
				if (commonService.hasValueNotEmpty(uiStructure.refDetail) && angular.isArray(uiStructure.refDetail.value)) {
					uiStructure.originalDetail = angular.copy(childDetail);
				}
			} else if (uiStructure.parent && commonService.hasValueNotEmpty(uiStructure.parent.key) && uiStructure.cardType === "template"){ //xxx
					
					if(uiStructure.templateLevel >= 2){ // level >=2
						if(indexChild == undefined){
							indexChild = uiStructure.parent.children.indexOf(uiStructure);
						}
						uiStructure.refDetail = self.findElementInElement(detail, uiStructure.parent.key).value[indexChild];
					} else { // level 1
						uiStructure.refDetail = detail;
					}
				}

			//This case for node which is object and have card type with template
			if (!uiStructure.refDetail && !commonService.hasValueNotEmpty(uiStructure.key) && uiStructure.cardType === "template") {
				var childDetail = detail;
				if (uiStructure.isShowOnlyLastItem === true && angular.isArray(childDetail)) {
					uiStructure.refDetail = childDetail[childDetail.length - 1];
				} else {
					uiStructure.refDetail = childDetail;
				}
				//store the original detail when card has template card
				if (commonService.hasValueNotEmpty(uiStructure.refDetail) && angular.isArray(uiStructure.refDetail.value)) {
					uiStructure.originalDetail = angular.copy(childDetail);
				}
			}

			// var sectionLen = uiStructure.children ? uiStructure.children.length : 0;
			//if(sectionLen > 0){
			if (!uiStructure.isUiStructureLeaf()) {
				var childLen = uiStructure.children.length;
				var childIndex = 0;
				if (uiStructure.refDetail && Array.isArray(uiStructure.refDetail.value)) {
					childIndex = uiStructure.refDetail.value.length;
				}
				for (var i = childLen - 1; i >= 0; i--) {
					if (notRemoveTemplateChildren) {
						if (uiStructure.refDetail && Array.isArray(uiStructure.refDetail.value)) {
							if (uiStructure.children[i].cardType === this.CONSTANTS.cardType.TEMPLATE && childIndex > 0) {
								self.setupRefDetails(uiStructure.children[i], uiStructure.refDetail.value[--childIndex], true, notRemoveTemplateChildren);
							} else if (uiStructure.children[i].cardType !== this.CONSTANTS.cardType.ACTION) {
								self.setupRefDetails(uiStructure.children[i], detail, false, notRemoveTemplateChildren);
							}
						} else {
							self.setupRefDetails(uiStructure.children[i], detail, undefined, notRemoveTemplateChildren);
						}
					} else {
						self.setupRefDetails(uiStructure.children[i], detail, undefined, notRemoveTemplateChildren);
					}

				}
			} else {
				var uiLen = uiStructure.uiEle ? uiStructure.uiEle.length : 0;

				for (var i = 0; i < uiLen; i++) {
					var uiEle = uiStructure.uiEle[i];

					if (commonService.hasValueNotEmpty(uiEle.key) && uiEle.key[0].length) {
						//TODO: this will exhausted searching all the detail overtime, find a way to avoid it
						uiEle.setRefDetail(self.findElementInElement(detail, uiEle.key));

						//hle56 permission matrix
						//update editable with role
						self.updateEditableMeta(uiEle);
					}
				}

				//setup refDetail for uiStructure.templates.PREVIEW
				var uiElePreviewLen = uiStructure.templates.PREVIEW ? uiStructure.templates.PREVIEW.length : 0;
				for (var j = 0; j < uiElePreviewLen; j++) {
					var uiElePreview = uiStructure.templates.PREVIEW[j];

					if (commonService.hasValueNotEmpty(uiElePreview.key)) {
						uiElePreview.setRefDetail(self.findElementInElement(detail, uiElePreview.key, undefined, notRemoveTemplateChildren));
					}
				}
			}
		};

		/**
		 * get list uiStructure contain refUid in refdetail
		 * @param  {object} uiStructure [description]
		 * @param  {array} listUistructure [description]
		 */
		UiRenderUIService.prototype.getListUiStructureWithRefUid = function getListUiStructureWithRefUid(uiStructure){
			var uiStructureList = {};

			if(uiStructure.refDetail && uiStructure.name !== 'Attachment'){
				var refUid = uiStructure.refDetail["refUid"] ? uiStructure.refDetail["refUid"] : uiStructure.refDetail["refResourceUid"];
				var refDocType = uiStructure.refDetail["refDocType"] ? uiStructure.refDetail["refDocType"] : uiStructure.refDetail["refResourceDocType"];
				if(refUid && refDocType){
					uiStructureList[refUid] = uiStructure;
				}
			}

			this.traverseAndProcess(
					uiStructure,
					[function (uiStructure) {
						if(uiStructure.refDetail){
							var refUid = uiStructure.refDetail["refUid"] ? uiStructure.refDetail["refUid"] : uiStructure.refDetail["refResourceUid"];
							var refDocType = uiStructure.refDetail["refDocType"] ? uiStructure.refDetail["refDocType"] : uiStructure.refDetail["refResourceDocType"];
							if(refUid && refDocType){
								uiStructureList[refUid] = uiStructure;
							}
						}
					}]
				);
			return uiStructureList;
		};
	    
		/**
		 * Load children's metadata of given uiStructure
		 * @param  {[type]} uiStructure [description]
		 * @param  {String} requestURL [description]
		 */
		UiRenderUIService.prototype.loadAllMetadata = function loadAllMetadata (uiStructure, requestURL) {
			var self = this;
			var defer = $q.defer();
			defer.resolve();

			var uiStructureList = self.getListUiStructureWithRefUid(uiStructure);

			if(Object.keys(uiStructureList).length){
				var listUid = '';
				for(var uid in uiStructureList){
					listUid = listUid + ',' + uid;
				}
				listUid = listUid.substr(1, listUid.length);

				self.findMetadata(requestURL, listUid).then(function(data){
					//var metadataList = self.convertToArray(data.MetadataDocuments.MetadataDocument);
					var metadataList = self.convertToArray(self.findElementInElement(data, ['MetadataDocuments']));

					for(var i = 0; i < metadataList.length; i++){
						uiStructureList[metadataList[i].DocId].metadata = metadataList[i];
						self.buildPreviewFromMetadata(requestURL, uiStructureList[metadataList[i].DocId]);
						var documentStatus = metadataList[i].DocumentStatus;
						if(documentStatus === commonService.CONSTANTS.DOCUMENT_STATUS.INVALID){
							uiStructureList[metadataList[i].DocId].validStatus = commonService.CONSTANTS.DOCUMENT_STATUS.INVALID;
						}
					}

					defer.resolve();
				});
			}
			else{
				defer.resolve();
			}
			return defer.promise;
		};


		/**
		 * will enable 'isRender' attribute for this uiStructure and its ancestors
		 * @param {Object} uiStructure the uiStructure need to visible
		 */
		UiRenderUIService.prototype.setRenderValues = function setRenderValues (uiStructure) {
			uiStructure.isRender = true;

			var parent = uiStructure.parent;

			//traverse to root to set visible
			while(parent){

				//if parent is visible, means the ancestor all are visible, don't need to process more
				if(parent.isRender)
					break;

				parent.isRender = true;
				parent = parent.parent;
			}
		};

		/**
		 * add new child to this uiStructure, auto add new element to datamodel (ipos v3 document)
		 *
		 * @param {Object}      uiStructure     the uiStructure need to add one more children
		 * @param {function}    fnCallBack 		the function will be execute after the method executed
		 * */
		UiRenderUIService.prototype.addChildElement = function addChildElement (params) {
			var self = this;
			var rootDefer = $q.defer();
			var uiStructure = params.parentCard;
			var templateId = params.templateId;
			var fnCallBack = params.callBackFn;
			var requestURL = params.requestURL;
			var getChildDetail = params.getChildDetail;
			var pEle = uiStructure.refDetail;//element parent
			var totalTemplateCard = 0;
			var addedEle = undefined;//the added elements to dataset

			//get uiStructureTemplate
			var template = self.getTemplate(uiStructure, templateId);
			//only get last object cause child detail always lying in parent detail
			// var cEleKey = template.key.lastObj();
			// cEleKey = self._findFullKeyWithPrefix(pEle, cEleKey);

			//V4 new structure of array
			var cEleKey = 'value';

			//push new uiStructure to the top of its siblings
			//find farest template card position

			for(var i = 0; i < uiStructure.children.length; i++){
				if(uiStructure.children[i].cardType === "template" || uiStructure.children[i].cardType === "default")
					totalTemplateCard++;
			}

			var newUiStructure = new UiStructure('cloneRecursive', [template]);
			self.makeLinkBetweenUiStructure(newUiStructure, uiStructure);
			self.buildPreviewFields(newUiStructure);

			//Get child detail, default is clone first object, or use other ways with getChildDetail
			var prepareChildDetail = function() {
				var defer = $q.defer();
				//if uiStructure has refDetail
				if (commonService.hasValueNotEmpty(pEle)) {
					if (commonService.hasValueNotEmpty(getChildDetail)) {
						getChildDetail({
							scope: self,
							addChildEleFn: self.addChildEleToParentEle,
							parentEle: pEle,
							childEleKey: cEleKey
						}).then(function () {
							defer.resolve();
						});
					} else {
						//true when the screen will show more than 1 card
						/*self.addChildEleToParentEle(pEle, cEleKey);
						defer.resolve();*/
						self.addChildEleToParentEle_New(pEle, cEleKey, params.docType, params.businessType, params.productName).then(function(data) {
							defer.resolve();
						});
					}
				} else {
					defer.resolve();
				}
				return defer.promise;
			};

			var oldLen = pEle[cEleKey].length;
			prepareChildDetail().then(function() {

				//if uiStructure has refDetail
				if (commonService.hasValueNotEmpty(pEle)) {

					//if added new element in datamodel, need to add new uiStructure
					if (oldLen !== pEle[cEleKey].length) {
						//if added new element in datamodel, need to add new uiStructure

						addedEle = pEle[cEleKey][pEle[cEleKey].length - 1];

						//need to update ref detail now
						self.setupRefDetails(newUiStructure, addedEle, true);

						//change '@icon' & '@cssClass' with added Element
						// var refDocType = newUiStructure.refDetail["@refDocType"];
						var refDocType = newUiStructure.getRefDocTypeInDetail();
						if (refDocType) {
							self.decorateSection(newUiStructure, refDocType);
						}
						
						//update counter 
						if(pEle.meta && commonService.hasValueNotEmpty(pEle.meta.counter)){
							pEle.meta.counter = pEle[cEleKey].length;
						}
						
						//remove actionCard when counter = maxOccurs
						if (pEle.meta && commonService.hasValueNotEmpty(pEle.meta.maxOccurs)
							&& pEle[cEleKey].length === parseInt(pEle.meta.maxOccurs)) {
							uiStructure.removeActionCards();
						}
					}
				}

				//push next to current template card position
				uiStructure.children.splice(totalTemplateCard, 0, newUiStructure);

				//if(self.DEV_MODE)
				self.setDefaultValueToUiEle(newUiStructure);

				self.markValidStatus(newUiStructure);
				//count empty madatory fields
				self.updateNumberOfEmptyFields(newUiStructure);

				// compare with original card detail
				uiStructure.isDetailChanged = !angular.equals(uiStructure.refDetail, uiStructure.originalDetail);
				uiStructure.originalDetail = angular.copy(uiStructure.refDetail);
				self.updateParentDetailChanged(uiStructure);
				
				//hle56 permisson matrix
				//update editable with role
				self.updateEditableMeta(newUiStructure);
				
				//if fnCallBack is existed, execute it
				if (fnCallBack) {
					fnCallBack(addedEle);
					//TODO: need load metedata for business purpose?
					//self.loadAllMetadata(newUiStructure, requestURL);
				}
				rootDefer.resolve(newUiStructure.refDetail);
			});
			return rootDefer.promise;
		};

		UiRenderUIService.prototype.getTemplate = function getTemplate(uiStructure, templateId){
			var templates = uiStructure.otherType.template;
			if(templateId){
				for(var i = 0; i < templates.length; i++){
					if(templates[i].templateId === templateId)
						return templates[i];
				}
			}else{
				return templates[0];
			}
		};


		/**
		 * Find uiStructure with given name
		 * @param  {Object} uiStructureRoot the uiStructure start to find
		 * @param  {String} name            name of uiStructure need to find
		 * @param  {bool} 	bDeepSearch 	search in linking document (salecase link to illustration)
		 * @return {Object}                 result, undefined if can't find
		 */
		UiRenderUIService.prototype.findUiStructureWithName = function findUiStructureWithName(uiStructureRoot, name, bDeepSearch){
			var result = undefined;

			/*if(uiStructureRoot.descendantLs){
				result = uiStructureRoot.descendantLs[name];
			}*/

			 if(uiStructureRoot){

				if(uiStructureRoot.name === name)
					return uiStructureRoot;

				if(uiStructureRoot.children){
					var childLen = uiStructureRoot.children.length;
					for(var i = 0; i < childLen; i++){
						result = this.findUiStructureWithName(uiStructureRoot.children[i], name, bDeepSearch );
						if(result){
							break;
						}
					}
				}

				//if bDeepSearch is true, find in the children uiStructure (another doctype)
				if(!result && bDeepSearch && uiStructureRoot.linkCUiStructure){
					result = this.findUiStructureWithName(uiStructureRoot.linkCUiStructure, name, bDeepSearch);
				}
			 }

			return result;
		};

		/**
		 * Set action cards visible or not
		 * @param {Object}  uiStructure    The uiStructure which need to process
		 * @param {Boolean} isVisible      true will show the action cards, false will remove it
		 * @param {Array}  actionCardNames array of String. Specific the action cards need to hide/show
		 */
		UiRenderUIService.prototype.setVisibleActionCards = function setVisibleActionCards (uiStructure, isVisible, actionCardNames) {
			if(angular.isArray(actionCardNames)){
				for (var i = 0; i < actionCardNames.length; i++) {
					this.setVisibleActionCard(uiStructure, isVisible, actionCardNames[i]);
				}
			}else{
				this.setVisibleActionCard(uiStructure, isVisible);
			}
		};

		/**
		 * Set visible for an action card
		 * @param {Object}  uiStructure     The uiStructure which need to process
		 * @param {Boolean} isVisible       true will show the action cards, false will remove it
		 * @param {String}  actionCardName Specific the action cards need to hide/show. If undefined, will apply all the action cards
		 */
		UiRenderUIService.prototype.setVisibleActionCard = function setVisibleActionCard (uiStructure, isVisible, actionCardName) {
			var tmpUiStructureLst = [];
			for (var i = 0; i < uiStructure.children.length; i++) {
				if(uiStructure.children[i].cardType === this.CONSTANTS.cardType.ACTION){
					if(!actionCardName || uiStructure.children[i].name === actionCardName){
						this.setVisibleUiStructure(uiStructure.children[i], isVisible);
					}
				}
			}
		};

		UiRenderUIService.prototype.getParent = function getParent (uiStructure) {
			if(uiStructure)
				return uiStructure.parent;
			else{
				$log.debug("Can't find parent of uiStructure (see below):");
				$log.debug(uiStructure);
			}
		};

		/**
		 * Set card visible or not
		 * @param {Object}  uiStructure    The uiStructure which need to process
		 * @param {Boolean} isVisible      true will show the action cards, false will remove it
		 */
		UiRenderUIService.prototype.setVisibleCard = function setVisibleCard (uiStructure, isVisible) {
			this.setVisibleUiStructure(uiStructure, isVisible);
		};

		UiRenderUIService.prototype.setVisibleUiStructure = function setVisibleUiStructure (uiStructure, isVisible) {
			if(uiStructure){
				//only set new value for card with 'isVisible' is 'false' or 'true'
				if(typeof uiStructure.isVisible === 'boolean'){
					uiStructure.isVisible = isVisible;

					//if it's displaying on screen, setup its 'display' html attribute
					if(uiStructure.scope){
						uiStructure.scope.setCardVisible(uiStructure.html, isVisible);
					}
				}

			}
		};

		/**
		 * remove child from this uiStructure, auto remove element from datamodel (ipos v3 document)
		 *
		 * @param {Object}      card       the card need to removed one more children
		 * @param {function}    fnCallBack the function will be execute after the method executed
		 * @param {boolean}	removeTemplateObject allow item in detail if total children is 1 (support new structure without array of template detail)
		 * */
		UiRenderUIService.prototype.removeChildElement = function removeChildElement (uiStructure, index, fnCallBack, removeTemplateObject) {
			var self = this;
			var pEle = uiStructure.refDetail;//element parent
			var cEleName = 'value';//name of child element
			var oldLen = undefined; //pEle.length; //old list length
			var actionCards = uiStructure.otherType.action;
			var tempIndex = index; //position of template card

			if (pEle && pEle[cEleName]) {
				oldLen = pEle[cEleName].length;
			}

			if (oldLen === undefined) {
				$log.debug(uiStructure);
				$log.debug("Above uiStructure obj doesn't have '@counter' in its refDetail");
				return;
			}

			//calculate the position of template in iposDocument
			for (var i = 0; i < uiStructure.children.length; i++) {
				//hle56. if card is visible, we count it.
				var isVisible = undefined;
				if(typeof uiStructure.children[index].isVisible == "boolean")
					isVisible = uiStructure.children[index].isVisible;
				else
					isVisible = uiStructure.scope.$eval(uiStructure.children[index].isVisible);
				if (uiStructure.children[i].cardType === self.CONSTANTS.cardType.DEFAULT || uiStructure.children[i].cardType === self.CONSTANTS.cardType.ACTION || !isVisible) {
					tempIndex--;
				} else {
					break;
				}
			}

			self.removeChildEleParentEle(pEle, cEleName, tempIndex, removeTemplateObject);

			//if list children had changed, update the UI
			if(oldLen !== pEle[cEleName].length) {

				oldLen = oldLen ? oldLen : 0;//case oldLen is empty
				uiStructure.children.splice(index, 1);//remove card from uiStructure

				//IVPORTAL-5168: START
				//when removed an element from list, need to remove the link between scope & uiStructure of the last card
				//otherwise, when last card is destroyed (angular destroys it when array is reduced 1),
				// the scope.card.scope will be set to 'undefined'.
				//This will make the siblings card failed to notify each others (due to leak of scope)
				if (uiStructure.children.length > 0) {
					if(uiStructure.children.lastObj().scope) {
						var scope = uiStructure.children.lastObj().scope;
						if (scope.moduleService.name !== "case" || !scope.uiFrameworkService.currentTabIndex === 2) { // hle71 - At Quotation tab
							uiStructure.children.lastObj().scope.card = undefined;//unlink scope from removed card	
						}
					}
				//IVPORTAL-5168: END
			    }

				//add back action cards
				//TODO: is it correct?
				for (var i = 0; i < actionCards.length; i++) {
					if (!uiStructure.hasChildWithName(actionCards[i].name)) {
						// if(!self.hasActionCardWithName(uiStructure.children, )){
						if (actionCards[i].parent == undefined) {
							actionCards[i].parent = uiStructure;
						}
						uiStructure.children.push(actionCards[i]);
						
						//hle56: reset openable2 for action card after removing
						self.isUiStructureOpenableWithRole(actionCards[i]);
					}
				}

				//compare card's original detail with current detail
				uiStructure.isDetailChanged = !angular.equals(uiStructure.refDetail, uiStructure.originalDetail);
				uiStructure.originalDetail = angular.copy(uiStructure.refDetail);
				self.updateParentDetailChanged(uiStructure);

				//update number of empty mandatory fields
				self.updateNumberOfEmptyFields(uiStructure);

				//update current card valid status
				self.markValidStatus(uiStructure);

				//update all card valid status
				self.updateParentValidStatus(uiStructure);

			}

			//if fnCallBack is existed, return the added element in datamodel
			if(fnCallBack) {
				fnCallBack(pEle[oldLen]);
			}
		};

		/**
		 * remove child from this uiStructure, auto remove element from datamodel (ipos v3 document)
		 *
		 * @param {Object}      card       the card need to add one more children
		 * @param {function}    fnCallBack the function will be execute after the method executed
		 * */
		UiRenderUIService.prototype.removeAllChildrenElement = function removeAllChildrenElement (uiStructure, fnCallBack) {
			var self = this;
			var pEle = uiStructure.refDetail;//element parent
			var cEleName = 'value'; //uiStructure.otherType.template[0].key;//name of child element
			var oldLen = undefined; //pEle['@counter']; //old list length
			var iTemplateCards = 0; //template card's index

			if (pEle && pEle[cEleName]) {
				oldLen = pEle[cEleName].length;
			}

			if (oldLen === undefined) {
				$log.debug(uiStructure);
				$log.debug("Above uiStructure obj doesn't have '@counter' in its refDetail");
				return;
			}

			//calculate the position of template in iposDocument
			for (var i = 0; i < uiStructure.children.length; i++) {
				if (uiStructure.children[i].cardType === self.CONSTANTS.cardType.DEFAULT) {
					iTemplateCards++;
				} else {
					break;
				}
			}

			self.removeAllChildrenInParentEle(pEle, cEleName);

			// remove card from uiStructure
			uiStructure.children.splice(iTemplateCards, oldLen);

			//see IVPORTAL-5168
			for(i = iTemplateCards; i < uiStructure.children.length; i++){
				uiStructure.children[i].scope.card = undefined;
			}

			//compare card's original detail with current detail
			uiStructure.isDetailChanged = !angular.equals(uiStructure.refDetail, uiStructure.originalDetail);
			self.updateParentDetailChanged(uiStructure);

			//if fnCallBack is existed, return the added element in datamodel
			if(fnCallBack)
				fnCallBack(pEle[cEleName][oldLen]);
		};

		/**
		 * Get uiElement objects of a uiStructure
		 * @param  {Object} uiStructure the object need to get uiEle objects
		 * @return {[type]}             [description]
		 */
		UiRenderUIService.prototype.getUiElements = function getUiElements (uiStructure) {
			var self = this;
			var defer = self.$q.defer();

			//we need defer
			//need to use docParams from uiStructureRoot, uiElement and uiStructure of a doctype must be loaded with same docParams
			// self.getUiElementTemplate(uiStructure.root.docParams).then(function(uiEleHtml){

				if(uiStructure) {
					if (uiStructure.uiEle.length > 0) {
						defer.resolve(uiStructure.uiEle);
					}
					//static html for card
					else if (uiStructure.staticHtml) {
						var url = resourceServerPath + "view/workspaces/template/" + uiStructure.staticHtml;
						$http.get(url).then(function(response) {
							defer.resolve(response.data);
						});
					}
					else {
						if (uiStructure.cardType !== self.CONSTANTS.cardType.ACTION) {
							$log.error("Exception: uiStructure doesn't contain both 'uiEle' and 'staticHtml'...");
						}
						defer.resolve(undefined);
					}
				} else {
					$log.debug("Can't get the uiElement for this uiStructure object (see below):");
					$log.debug(uiStructure);
				}

			// });


			return defer.promise;
		};

		UiRenderUIService.prototype.getDocBusinessStatus = function getDocBusinessStatus(doc){
			return this.moduleService.findElementInElement(doc, ['metaData', 'businessStatus']);
		};

		UiRenderUIService.prototype.isBusinessStatus = function isBusinessStatus(doc, status){
			return this.moduleService.findElementInElement(doc, ['metaData', 'businessStatus']) === status;
		};

		UiRenderUIService.prototype.isDraftBusinessStatus = function isDraftBusinessStatus(doc){
			return this.isBusinessStatus(doc, 'DRAFT');
		};

		UiRenderUIService.prototype.isNewBusinessStatus = function isNewBusinessStatus(doc){
			return this.isBusinessStatus(doc, 'NEW') || this.isBusinessStatus(doc, null);
		};

		UiRenderUIService.prototype.getUiService = function getUiService (docType) {
			var uiServiceName = docType + 'CoreService';
			if (docType === commonService.CONSTANTS.MODULE_NAME.SALECASE) {
				uiServiceName = 'salecaseCoreService';
			}
			return $injector.get(uiServiceName);
		};

		/**
		 * Internal function, use to prepare a detail (ipos v3 doc) for a new uiStructure
		 * @param  {string} requestURL porlet url
		 * @param  {Object} uiService   a uiService will execute the new/load detail
		 * @param  {string} docId    	docId of document need to get detail
		 * @param  {string} parentUid   the parent's docId
		 * @param  {string} docType     prospect, illustration,..
		 * @param  {string} product
		 * @return {promise}            Angular promise
		 */
		function prepareDetailForUiStructure (requestURL, uiService, moreParams, scope) {
			var self = this;
			var defer = self.$q.defer();
			var resultDetail, getDataModel, getUIModel;

			moreParams = moreParams || {};

			//if having docId, need to load new detail or using current detail
			if (commonService.hasValueNotEmpty(moreParams.docId)) {
				//Need to get new detail(ex: quotation change contact detail, so contact module need to update its detail)
				//Get UI Model from portal server side
				getUIModel = uiService.getUIModel(uiService.name, uiService.businessLine, uiService.productName);
				//Get Data Model from runtime service
				if(commonService.hasValueNotEmpty(scope.card.data.requestBody)) {
					getDataModel = uiService.getDocument(requestURL, moreParams.docType, moreParams.docId, undefined, uiService.businessLine, uiService.productName, scope.card.data.requestBody);
				} else {
					getDataModel = uiService.getDocument(requestURL, moreParams.docType, moreParams.docId, undefined, uiService.businessLine, uiService.productName);
				}
				//if detail is existed, using this detail if docId is the same
//				if (uiService.detail && moreParams.docId === uiService.detail.id) {
//					resultDetail = uiService.detail;
//				}
				//If detail isn't existed, or docId is different, need to load detail
//				else {
//					//Get UI Model from portal server side
//					getUIModel = uiService.getUIModel(uiService.name, uiService.businessLine, uiService.productName);
//					//Get Data Model from runtime service
//					getDataModel = uiService.getDocument(requestURL, moreParams.docType, moreParams.docId, undefined, uiService.businessLine, uiService.productName);
//				}
			} else {
				//if detail status is new, don't need to initialize new obj again
				if (uiService.detail !== undefined && self.isNewBusinessStatus(uiService.detail)) {
					resultDetail = uiService.detail;
				} else {
					//Get UI Model from portal server side
					getUIModel = uiService.getUIModel(uiService.name, moreParams.businessType, moreParams.product);
					//Get Data Model from runtime service
					if(commonService.hasValueNotEmpty(scope.card.data.requestBody)) {
						getDataModel = uiService.initializeDocument(
								requestURL,
								moreParams.docType,
								moreParams.product,
								undefined, //don't have any chance for initializeing salecase in here
								undefined,
								moreParams.businessType,
								scope.card.data.requestBody
							);
					} else {
						getDataModel = uiService.initializeDocument(
							requestURL,
							moreParams.docType,
							moreParams.product,
							undefined, //don't have any chance for initializeing salecase in here
							undefined,
							moreParams.businessType
						);
					}
					uiService.isFirstInitialize = true;
				}
			}
			var promises = [];
			promises.push(getDataModel);
			promises.push(getUIModel);

			//if need to request to server, wait for a moment
			if (getDataModel) {
				loadingBarService.showLoadingBar();
				self.$q.all(promises).then(function gotDetail(responses) {
					var successMsg, errMsg;
					if (commonService.hasValueNotEmpty(moreParams.docId)) {
						successMsg = "Got detail of: " + moreParams.docId;
						errMsg = "Can't get detail of: " + moreParams.docId;
					} else {
						successMsg = "Initialized new object detail of docType: " + moreParams.docType;
						errMsg = "Can't initialized detail of docType: " + moreParams.docType;
					}
					if (responses && uiService.isSuccess(responses[0])) {
						uiService.detail = responses[0];
						uiService.convertDataModel2UiModel(uiService.detail, responses[1]);
						
						//Eval mandatory by uiModel
						scope.evalMandatory(uiService.detail);
						
						loadingBarService.showLoadingBar();
						
						uiService.operateDocument(
							self.requestURL,
							uiService.name,
							commonService.CONSTANTS.ACTION.REFRESH,
							undefined,
							uiService.businessLine,
							uiService.productName
						).then(function(postOpData) {
							if (uiService.isSuccess(postOpData)) {
								uiService.originalDetail = angular.copy(postOpData);
								$log.debug(successMsg);
							}
							defer.resolve(postOpData);
						});
					} else
						$log.error(errMsg);
				});
			}
			//if not need to request server, resolve now
			else {
				defer.resolve(resultDetail);
			}

			return defer.promise;
		}

		UiRenderUIService.prototype.getUiStructureRoot = function getUiStructureRoot (uiStructure) {
			return uiStructure.root;
		};

		/**
		 * Return docId of a uiStructure
		 * @param  {[type]} uiStructure [description]
		 * @return {[type]}             [description]
		 */
		UiRenderUIService.prototype.getUiStructureDocUid = function getUiStructureDocUid (uiStructure) {
			var docId = this.getUiStructureRoot(uiStructure).docParams.docId;
			if (!docId && uiStructure.root.refDetail)
				docId = this.findElementInElement(uiStructure.root.refDetail,['id']);
			return docId;
		};



		/**
		 * @author tphan37
		 * Get child uiObject for display
		 * @param  {Object} 	uiStructure 	the concrete uiStructure, differ from uiStructure template
		 * @param  {String} 	requestURL  	the url of porlets
		 * @return {object}        				Angular promise. The real result can be:
		 * 1. Children uiStructures
		 * 2. uiElement to render HTML form
		 * 3. Static HTML string
		 */
		UiRenderUIService.prototype.getChildContentOfUiStructure = function getChildContentOfUiStructure (uiStructure, requestURL) {
			var self = this;
			var defer = self.$q.defer();
			var userRole = self.getUserRole(uiStructure);
			
			// show loading bar
			//loadingBarService.showLoadingBar();

			//for module doesn't have specific document dataset
			if(uiStructure.initCtrl) {
				//Set refdetail to parent refdetail
				var initDetail = uiStructure.root.refDetail;
				self.createConcreteUiStructure(
					requestURL,
					initDetail,
					{
						'refDocType': uiStructure.initCtrl,
						'userRole': userRole
					},
					{
						'pUiStructure': uiStructure
					}
				).then(function gotUiStructure(childUiStructure) {

					//set valid status for parent base on child
					uiStructure.validStatus = childUiStructure.validStatus;
					uiStructure.preview = childUiStructure.preview;

					//keep track the child uiStructure
					uiStructure.linkCUiStructure = childUiStructure;
					childUiStructure.parent = uiStructure;
					self.updateParentValidStatus(uiStructure);

					//if uiStructure is leaf --> need to render the HTML form
					if (childUiStructure.isUiStructureLeaf()) {
						self.getUiElements(childUiStructure).then(function gotUiElements(result) {
							defer.resolve(result);
							loadingBarService.hideLoadingBar();
						});
					} else {
						defer.resolve(childUiStructure.children);
						loadingBarService.hideLoadingBar();
					}

				}, function failed() {
					defer.reject();
					loadingBarService.hideLoadingBar();
				});
				return defer.promise;
			}

			//get refDocType value
			var refDocType = uiStructure.getRefDocTypeInDetail();

			//need to find out each params for children
			var businessType = uiStructure.getBusinessType();
			var saleChannel = uiStructure.getSaleChannel();


			//refDocType has value --> Open another doctype, or open another document with the same doctype (eg: prospect list)
			if(
					refDocType
				&& uiStructure.children.length === 0 //if there are any children or uiEle, won't load other doctypes
				&& uiStructure.uiEle.length === 0//because we priority jsonMock declaration
				//(Eg: in FNA, Client & Joint Applicant will open views of FNA document, not open prospect doctype
				) {
				
				var refDocId = undefined;
				if (uiStructure.refDetail && uiStructure.refDetail.refId) {
					refDocId = uiStructure.refDetail.refId.value;
				}
				var parentUid = self.getUiStructureDocUid(uiStructure);

				//load detail of ref doctype
				var docType = refDocType.split(';')[0];
				var product = uiStructure.getProductNameInDetail();
				var newUiService = self.getUiService(docType);
				newUiService.productName = product;
				var businessTypeInDetail = uiStructure.getBusinessTypeInDetail();
				newUiService.businessLine = businessTypeInDetail;
				if (newUiService) {
					//first step: we need to find the detail for new child uiStructure
					prepareDetailForUiStructure.call(
						self,
						requestURL,
						newUiService,
						{
							'docId': refDocId,
							'docType': docType,
							'product': product,
							'parentUid': parentUid,
							'businessType': businessTypeInDetail
						},
						uiStructure.scope
					)
					//second step: from the detail we initalize the uiStructure
					.then(function gotDetail(detail) {
						return self.createConcreteUiStructure(requestURL, detail,
							{
								'refDocType': refDocType,
								'businessType': businessType,
								'userRole': userRole,
								'saleChannel': saleChannel,
								'docId': refDocId,
								'businessLine': businessTypeInDetail,
								'productName': product
							},
							{
								'pUiStructure': uiStructure
							}
						);
					})
					//final step: after have child uiStructure (from other document)
					//we link it with parent uiStructure
					.then(function gotUiStructure(childUiStructure) {

						//set valid status for parent base on child
						uiStructure.validStatus = childUiStructure.validStatus;
						uiStructure.preview = childUiStructure.preview;

						//set number of empty required fields
						// uiStructure.view.FieldsInformation.NumEmptyRequiredFields = childUiStructure.view.FieldsInformation.NumEmptyRequiredFields;

						//keep track the child uiStructure
						uiStructure.linkCUiStructure = childUiStructure;
						childUiStructure.parent = uiStructure;
						self.updateParentValidStatus(uiStructure);

						//if uiStructure is leaf --> need to render the HTML form
						if (childUiStructure.isUiStructureLeaf()) {

							self.getUiElements(childUiStructure).then(function gotUiElements(result) {
								defer.resolve(result);
								loadingBarService.hideLoadingBar();
							});
						}
						else {
							defer.resolve(childUiStructure.children);
							loadingBarService.hideLoadingBar();
						}
					}, function failed() {
						defer.reject();
						loadingBarService.hideLoadingBar();
					});

				} else {
					$log.error("Can't get uiService with name: " + uiServiceName);
					loadingBarService.hideLoadingBar();	
				}
			}

			//current uiStructure not has refType in refDetail
			else {

				//check if docId of uiStructure root is the same of docId from uiService.detail
				//get associate UiService from uiStructure.scope.moduleService
				var associateUiService =  uiStructure.getAssociateUiService();
				if (associateUiService) {
					var uiServiceDocId = associateUiService.findElementInDetail(['id']);
					var rootDocId = self.getUiStructureDocUid(uiStructure);

					//if different, reassign detail from uiStructure root to uiService
					if (uiServiceDocId !== rootDocId) {
						var rootUiStruture = self.getUiStructureRoot(uiStructure);
						associateUiService.detail = rootUiStruture.refDetail;
						associateUiService.originalDetail = angular.copy(rootUiStruture.refDetail);

						//reSetup detail
						self.reSetupConcreteUiStructure(
							rootUiStruture,
							associateUiService.detail,
							undefined,
							commonService.CONSTANTS.UI_STRUCTURE.NOT_REMOVE_TEMPLATE_CHILDREN,
							commonService.CONSTANTS.UI_STRUCTURE.EXPECTED_DETAIL_NOT_CHANGED);
					}
				}

				//current uiStructure has children
				if (!uiStructure.isUiStructureLeaf()) {

					if (uiStructure.refDetail) {

						//set template when click card (second time)
						//because someone might added new element to counter
						//TODO: is it right to only add action cards here?
						self.setTemplateToUIStructure(uiStructure);
					}

					if (self.isDocumentEditable(uiStructure.root)) {
						uiStructure.addActionCards();
					}

					defer.resolve(uiStructure.children);
					loadingBarService.hideLoadingBar();
				}
				//current uiStructure is leaf of tree, only has uiElement
				else {
					self.getUiElements(uiStructure).then(function gotUiElements(result) {
						defer.resolve(result);
						loadingBarService.hideLoadingBar();
					});
				}
			}

			return defer.promise;
		};

	    
	/**
	 * Check whether '@minOccurs' is satisfied
	 * @param  {Object} 	uiStructure 	the uiStructure
	 * @return {Boolean}
	 */
	UiRenderUIService.prototype.isMinOccursSatisfied = function isMinOccursSatisfied(uiStructure){
		var result = true;
		if (uiStructure.refDetail && Array.isArray(uiStructure.refDetail.value) &&
			uiStructure.refDetail.meta && commonService.hasValueNotEmpty(uiStructure.refDetail.meta.minOccurs)) {
			if (parseInt(uiStructure.refDetail.meta.minOccurs) > uiStructure.refDetail.value.length) {
				result = false;
			}
		}
		return result;
	};

	//TODO: restructure code to seperate this creation behavior from UiRenderService
	//It should belongs to UiElement
	UiRenderUIService.prototype.createUiElement = function(wayOfCreation, params) {
		return new UiElement(wayOfCreation, params);
	};

	//TODO: restructure code to seperate this creation behavior from UiRenderService
	//It should belongs to UiStructure
	UiRenderUIService.prototype.createUiStructure = function(wayOfCreation, params) {
		return new UiStructure(wayOfCreation, params);
	};

	/////////////////////////
	//UiStructure template //
	/////////////////////////
	//follow alphabe-order
	//those value with default null value is references value
	var uiObjTmpl = {

		//relative of this obj
		"children": [],//store child cards (normal card)
		"linkCUiStructure": undefined,//link to a child uiStructure, which different in docType (Eg: Card prospect in case will open prospect cards)				
		"parent": undefined,//parent of this uiStructure. Which can lead to the other doctype (for validation purpose)
		"root": undefined,//point to the root of this uiStructure
		"uiEle": [],//if this is leaf node, will stores the id of html div
		//extraction values from jsonMock or from other sources
		"descendantLs": undefined, //only root card has this attribute, store mapping between name of uiStructure and its data
		"isDetailChanged": false, //default is 'false', is the detail of this card has changed?
		"isRender": false,//default is 'false', card won't be render except at least 1 uiEle.refDetail['@visible'] = 1
		"level": undefined,//level of card, 0 is highest (child of root)
		"metadata": undefined, //store metadata 
		"objType": uiRenderCoreService.CONSTANTS.objType.uiStructure,//which type of obj is
		"otherType": {//store other types of card need conditions to appear on screen
			"template": [],//template cards for rendering in counter case
			"action": []//action cards, acting like button with its associate 'onClick' attribute
		},
		"refDetail": undefined, //ref to correspondent part of detail associates with this uiObject
		"subAction": undefined,//which function will be execute when click on subIcon			
		// "linkPUiStructure": undefined,//link to a parent uiStructure, which different in docType (Eg: Card prospect in case will open prospect cards)
		"validStatus": commonService.CONSTANTS.DOCUMENT_STATUS.VALID,//if all the card's uiEle required fields is not empty, then it will have "valid" value


		//copy values from jsonMock
		"mandatoryCard": undefined,
		"arrayKey": undefined, //defined elementName will be converted from Json to Array			
		"cssClass": undefined,//css style for card
		"cardType": undefined,//type of this card
		"cssLabelFont": undefined, // font for title of card
		"cssIconFont": undefined,
		"uiStyle": undefined, // ui style of this card
		"isViewed": false, // card info is viewed in the last
		"icon": undefined,//icon for card
		"icons": undefined,//icons for card (new version)
		"initCtrl": undefined,//support ctrl name for screen doesn't have data document (like admin, register user)
		"isEditable": undefined,//default is 'undefined', card and its descendant can be edited (remove this card, add new child card...)
		"isShowValidationIcon": true,//default is 'true', card and its descendant can be edited (remove this card, add new child card...)
		"isShowNoOfEmptyField": true,//default is 'true', all cards will be displayed on screen
		"isVisible": true,//default is 'true', all cards will be displayed on screen
		"key": undefined, //key of the detail part, will use to locate the correspondent detail
		"name": undefined,//name of node
		"customName": undefined,//name of node
		"customNameTranslate": undefined,//boolean value, if true translate custom name
		"customNameArray": undefined,//List name of node
		"onClick": undefined,//js function will be execute when clicked, associate with 'action' & 'default' card type
		"onClose": undefined,				
		"onOpen": undefined,
		"permission": undefined,//stores fields use for card review
		"preview": undefined,//stores fields use for card review
		"previewHtml": undefined,// stores html file name for card review
		"staticHtml": undefined,//html for binding static content					
		"templateId": undefined,//template id
		"stepAction": undefined,//action name for step-card style
		"isShowOnlyLastItem" : false,
		//internal values
		"html": undefined,//link to HTML of a card, will have value when a card has been drawn on screen
		"isSelected": false,//default is 'false', this card isn't selected
		"scope": undefined,//link to scope of a card's HTML, will have value when this card has been drawn on screen,

		//data for empty fields
		"data": {
			"emptyFields": [], //list of uiEles that are unfilled
			"uiElements": [] //list of uiEles
		},

		"templates":{
			"ACTION_CARD": [],
			"PREVIEW": [],
			"TEMPLATE_CARD": []
		},
		
		"priority": 50,//template id
		//values for viewing on screen
		"view": {
			"icons": [],
			"FieldsInformation": {
				NumEmptyRequiredFields: 0,
				TotalRequiredFields: 0
			}
		},
		"refDocType": undefined,
		"isKeepRefDetailFromKey": false,
		"visible" : true // visible or not
	};

	var UiStructure = (function(){

		var id = 0;//id of a uiStructure object, which will start from 0

		function UiStructure(wayOfCreation, params) {
			if(!Array.isArray(params)){
				$log.error("Input of creating a new UiStructure instance is invalid (not an array)");
				$log.error(params);
			}

			switch (wayOfCreation){
				//clone single UiStructure only, without recursive
				case 'cloneObj':
					this.cloneObj(params[0]);
					break;
				//clone the whole tree
				case 'cloneRecursive':
					this.cloneRecursive(params[0]);
					break;
				case 'fromJsonMock':
					this.fromJsonMock(params[0], params[1]);
					break;
				default:
					extendValueFromOther(this, uiObjTmpl);
					break;
			}

			this._id = id++;
		}

		return UiStructure;
	})();

	



	UiStructure.prototype.fromJsonMock = function fromJsonMock(jsonMockEle, jsonMockEleName){
		extendValueFromOther(this, uiObjTmpl);
		this.name = jsonMockEleName;
		this.key = jsonMockEle['key'];

		// jsonMockEle['@section'] = undefined;//we used this field in the parent fn. Remove it for faster loop

		var businessType = commonService.CONSTANTS.ACTIONTYPE[jsonMockEle['businessType']];
		if(businessType){
			//replace "-" to "_"
		    this.businessType = uiRenderCoreService.genKey({'businessType': businessType});
		    jsonMockEle['@businessType'] = undefined;
		}

		this.userRole = commonService.CONSTANTS.USER_ROLES[jsonMockEle['userRole']];
		jsonMockEle['userRole'] = undefined;
		// jsonMockEle['@userRole'] = undefined;//set to undefined, so in the below loop we don't care about these case

		//loop with key in jsonMockEle because usually its key will be short
		for(var key in jsonMockEle){

			//we processed these keys in above, don't process them anymore
			if(key === 'section')
				continue;

			if(jsonMockEle[key] !== undefined){
				//if key in jsonMockEle has '@' in the first character --> uiStructure won't have it
				// var uiStructureKey = key[0] === '@' ? key.substr(1) : key;

				// //only copy those attribute registered in uiStructure from jsonMockEle
				// if(uiStructure.hasOwnProperty(uiStructureKey))
				// 	uiStructure[uiStructureKey] = jsonMockEle[key];					
				if(this.hasOwnProperty(key))
					this[key] = jsonMockEle[key];			
			}	

		}

		if(!this.cardType)
			this.cardType = uiRenderCoreService.CONSTANTS.cardType.DEFAULT;

	};



	/**
	 * Feb-16-2016
	 * @author tphan37
	 * This function will convert normal json Object to a UiStructure instance
	 * with its children together
	 * @param  {Object} jsonObj  json object which restored from local storage
	 */
	UiStructure.prototype.cloneRecursive = function cloneRecursive(jsonObj) {
		var childUiStructure, i;

		//restore is detail change
		this.isDetailChanged = jsonObj.isDetailChanged;

		//we fetch the main data from the jsonObj
		this.cloneObj(jsonObj);

		//if leaf, generate the child uiElements
		if (this.isUiStructureLeaf.call(jsonObj)){
			this.uiEle = jsonObj.uiEle.map(function(uiEleObj) {
				return UiRenderUIService.prototype.createUiElement('fromJsonObj', [uiEleObj]);
			});

			this.templates.PREVIEW = jsonObj.templates.PREVIEW.map(function(uiEleObj) {
				return UiRenderUIService.prototype.createUiElement('fromJsonObj', [uiEleObj]);
			});

		}else{
			//after that, generating the children
			var childNodes = this.getAllChildrenTypes.call(jsonObj);
			for (i = 0; i < childNodes.length; i++) {
				childUiStructure = new UiStructure('cloneRecursive', [childNodes[i]]);
				switch(childUiStructure.cardType){
					case uiRenderCoreService.CONSTANTS.cardType.DEFAULT:
						this.children.push(childUiStructure);
						break;
					case uiRenderCoreService.CONSTANTS.cardType.ACTION:
						childUiStructure.isRender = true;
						childUiStructure.validStatus = undefined;
						this.otherType.action.push(childUiStructure);
						break;
					case uiRenderCoreService.CONSTANTS.cardType.TEMPLATE:
						childUiStructure.isRender = true;
						childUiStructure.validStatus = undefined;
						this.otherType.template.push(childUiStructure);
						break;
				}
			}
		}
	};
	
	/**
	 * @author tphan37
	 * This function will create new uiStructure from json object (or from an instance of UiStructure )
	 * Only copy main values, won't copy references (included otherType)
	 * @param  {UiStructure} instance 	an instance will be cloned
	 */
	UiStructure.prototype.cloneObj = (function() {
		//attribute doesn't need to copy
		var ignoreNames = ['uiEle', 'root', 'children', 'linkCUiStructure', 'parent', 'otherType', 'templates'];

		var cacheObj = {};
		var name, i;
		function setUndefinedRelativeFields(uiStructure) {
			for(i = 0; i < ignoreNames.length; ++i){
				name = ignoreNames[i];
				cacheObj[name] = uiStructure[name];
				uiStructure[name] = uiObjTmpl[name];
			}
		}

		//restore attributes for instance
		function restoresRelativeFields(uiStructure) {
			for(i = 0; i < ignoreNames.length; ++i){
				name = ignoreNames[i];
				uiStructure[name] = cacheObj[name];
			}
			cacheObj = {};
		}

		return function(instance) {
			if (instance){
				setUndefinedRelativeFields(instance);
				extendValueFromOther(this, instance);
				restoresRelativeFields(instance);
			}
		}
	})();

	/**
	 * Return true if this is leaf uiStructure (no children cards but has uiElements)
	 * @param  {Object}  obj obj need to check
	 * @return {Boolean}     true if is an leaf uiStructure
	 */
	UiStructure.prototype.isUiStructureLeaf = function isLeafUiStructure () {
		return this.uiEle.length > 0 || commonService.hasValueNotEmpty(this.staticHtml);
	};

	/**
	 * Mar-04-2016
	 * @author tphan37
	 * Return list of all children uiStructure (from other types, too)
	 * @param  {uiStructure} uiStructure need to get all of its children
	 */
	UiStructure.prototype.getAllChildrenTypes = function() {
		// var ls = this.children;
		// if(this.otherType)
		// 	ls = ls.concat(this.otherType.action, this.otherType.template);
		// return ls;
		return this.children.concat(this.otherType.action, this.otherType.template);
	};



	 /**
	 * Return true if this is root uiStructure
	 * @param  {Object}  	obj obj need to check
	 * @return {Boolean}     true if is an root uiStructure
	 */
	UiStructure.prototype.isRootNode = function (){
		return this.root === this;
	};



	/**
	 * Return the 'userRole' attribute value of an uiStructure.
	 * If not exist, return root's value for now
	 * @return {String}             the role value in this uiStructure
	 */
	UiStructure.prototype.getSaleChannel = function() {
		var defaultValue = this.root.docParams.saleChannel;
		return this.saleChannel ? this.saleChannel : defaultValue;
	};


	/**
	 * Return the 'businessType' attribute value of this uiStructure.
	 * If not exist, return NEWBUSINESS for now, because usually renewal or endorsement will use jsonMock of newbusiness
	 * @param  {bool} 	useDefaultRoot 	if true, will use value in uiStructureRoot
	 * @return {String}             type of business
	 */
	UiStructure.prototype.getBusinessType = function(useDefaultRoot) {
		var defaultValue = useDefaultRoot ? this.root.docParams.businessType : commonService.CONSTANTS.ACTIONTYPE.NEWBUSINESS;
		return this.businessType ? this.businessType : defaultValue;
	};


	/**
	 * return the current docType of the root of this uiStructure
	 * @param  {Object} uiStructure the input
	 * @return {String}             refDocType
	 */
	UiStructure.prototype.getRefDocTypeOfRoot = function() {
		var root = this.root;

		//if root isn't defined, root is this uiStructure
		if(!root)
			root = this;

		return root.docParams.refDocType ? root.docParams.refDocType.split(';')[0] : undefined;
	};

	/**
	 * return the current product of the root of this uiStructure
	 * @param  {Object} uiStructure the input
	 * @return {String}             Product
	 */
	UiStructure.prototype.getProductOfRoot = function() {
		var root = this.root;

		//if root isn't defined, root is this uiStructure
		if(!root)
			root = this;

		return root.docParams.refDocType ? root.docParams.refDocType.split(';product=')[1] : undefined;
	};

	/**
	 * return the refDocType of detail this uiStructure, or the value in 'initCtrl'
	 * @param  {Object} uiStructure the input
	 * @return {String}             refDocType
	 */
	UiStructure.prototype.getRefDocTypeInDetail = function getRefDocTypeInDetail() {
		var refDocType = undefined;
		if (this.refDetail && this.refDetail.refType && commonService.hasValueNotEmpty(this.refDetail.refType.value)) {
			refDocType = this.refDetail.refType.value;
		}

		//try again, maybe we're in a screen doesn't have detail (datamodel)
		if (!refDocType) {
			refDocType = this.initCtrl;
		}

		return refDocType;
	};
	
	/**
	 * return the businessType of detail this uiStructure
	 * @param  {Object} uiStructure the input
	 * @return {String}             refDocType
	 */
	UiStructure.prototype.getBusinessTypeInDetail = function getBusinessTypeInDetail() {
		var businessType = undefined;
		if (this.refDetail && this.refDetail.refBusinessType && commonService.hasValueNotEmpty(this.refDetail.refBusinessType.value)) {
			businessType = this.refDetail.refBusinessType.value;
		}
		return businessType;
	};
	
	/**
	 * return the productName of detail this uiStructure
	 * @param  {Object} uiStructure the input
	 * @return {String}             refDocType
	 */
	UiStructure.prototype.getProductNameInDetail = function getProductNameInDetail() {
		var productName = undefined;
		if (this.refDetail && this.refDetail.refProductName && commonService.hasValueNotEmpty(this.refDetail.refProductName.value)) {
			productName = this.refDetail.refProductName.value;
		}
		return productName;
	};


	/**
	 * get current angular scope of a uiStructure
	 * NOTE: Currently we can't return the scope of uiStructure which render an HTML form
	 *
	 * @return {Object}             Angular scope associate
	 */
	UiStructure.prototype.getCurrentAngularScope = function getCurrentAngularScope() {
		var result;

		//usually root doesn't have scope (cause it doesn't appear on screen)
		// we'll get scope from its children
		if (this.isRootNode()){
			var children = this.uiEle[0];
			children = children || this.children[0];

			result = children.scope;
		}
		else{
			result = this.scope;
		}

		return result;
	};

	/**
	 * return the associate uiService of this uiStructure
	 * @param  {Object} uiStructure the input
	 * @return {Object} uiService
	 */
	UiStructure.prototype.getAssociateUiService = function getAssociateUiService() {
		var uiService = undefined;
		if (this.scope &&
			this.scope.moduleService) {
			uiService = this.scope.moduleService;
		}
		return uiService;
	};

	/**
	 * Feb-18-2016
	 * @author tphan37
	 * Return true if this card is clickable (permission is allow or...?)
	 * @return {boolean}             true if card is clickable
	 */
	UiStructure.prototype.isCardOpenable = function() {
		var result = true;

		try{
			result = this.permission.openable2;
		}catch(e){
			$log.error(e);
		}

		return result;
	};

	/**
	 * find a template with given name of this uiStructure
	 * @param  {String}		name	name of action card need to check
	 * @param  {String}		name	name of action card need to check
	 * @return {Object}             undefined if no result
	 */
	UiStructure.prototype.getTemplateWithName = function(templateType, name){
		var searchLst, result;

		switch(templateType){
			case uiRenderCoreService.CONSTANTS.cardType.ACTION:
				searchLst = this.otherType.action;
				break;
		}

		for(var i = 0; i < searchLst.length; i++){
			if(searchLst[i].name === name){
				result = searchLst[i];
				break;
			}
		}
		return result;
	};

	/**
	 * Check the existing of an children with given name
	 * @param  {String}		name	name of action card need to check
	 * @return {boolean}             true if the card exist
	 */
	UiStructure.prototype.hasChildWithName = function(name){
		for(var i = 0; i < this.children.length; i++){
			if(this.children[i].name === name){
				return true;
			}
		}
		return false;
	};


	/**
	 * add an action cards for this uiStructure when it hasn't been defined in 'children' attribute .
	 * if actionCardName is defined, add only action card following actionCardName
	 * @param {String}		actionCardName		name of action card need to add
	 * */
	UiStructure.prototype.addActionCards =  function addActionCards(actionCardName){
		var lsNeedAdd = [];
		var newUiStructure;
		var i;
		if(this.isAllowActionCards()){

			if (actionCardName){
				lsNeedAdd.push(this.getTemplateWithName(uiRenderCoreService.CONSTANTS.cardType.ACTION, actionCardName));
			}else{
				lsNeedAdd = this.otherType.action;
			}

			for(i = 0; i < lsNeedAdd.length; i++){
				if (!this.hasChildWithName(lsNeedAdd[i].name)){
					UiRenderUIService.prototype.makeLinkBetweenUiStructure(lsNeedAdd[i], this);
					uiRenderCoreService.isUiStructureOpenableWithRole(lsNeedAdd[i]);
					this.children.push(lsNeedAdd[i]);
				}
			}
		}
	};

	/**
	 * add action cards for uiStructure & all children in the first time .
	 * @param {Object}		uiStructure			[description]
	 * */
	UiStructure.prototype.addActionCardsRecursive = function addActionCardsRecursive(){
		var i;

		//first we check if this card can add action cards
		this.addActionCards();

		if(!this.isUiStructureLeaf()){
			for(i = 0; i < this.children.length; i++)
				this.children[i].addActionCardsRecursive();
		}
	};

	/**
	 * Get current number of template card in this card's children
	 * @return {Integer}             	the len of child (TEMPLATE type) in uiStructure
	 */
	UiStructure.prototype.getTemplateCardsLen = function getTemplateCardsLen () {
		var actionLen = 0;
		// var childLen = uiStructure.children ? uiStructure.children.length : 0;
		var childLen = this.children.length;
		for(var i = 0; i < childLen; i++){
			if(this.children[i].cardType === uiRenderCoreService.CONSTANTS.cardType.TEMPLATE)
				actionLen++;
		}
		return actionLen;
	};

	/**
	 * Check whether this instance can have action cards
	 * Allow action cards when we can add more element to its refDetail for now
	 * @return {Boolean}
	 */
	UiStructure.prototype.isAllowActionCards = function isAllowActionCards(){
		var result = true;
		if(this.refDetail && Array.isArray(this.refDetail.value) &&
			this.refDetail.meta && commonService.hasValueNotEmpty(this.refDetail.meta.maxOccurs)) {
			if (parseInt(this.refDetail.meta.maxOccurs) <= this.refDetail.value.length) {
				result = false;
			}
		}
		return result;
	};


	/**
	 * remove action cards from this uiStructure.
	 * if actionCardName is defined, remove only action card following actionCardName
	 * @param {String}		actionCardName		name of action card need to remove
	 * */
	UiStructure.prototype.removeActionCards = function removeActionCards(actionCardName){
		var secLen = this.children.length;
		if(commonService.hasValueNotEmpty(actionCardName)){
			for(var i = 0; i < this.children.length; i++){
				if(this.children[i].name == actionCardName){
					this.children.splice(i, 1);
					break;
				}
			}
		}
		else{
			for(var i = 0; i < secLen; i++){
				if(this.children[i].cardType == commonService.CONSTANTS.CARDTYPE.ACTION){
					this.children.splice(i, 1);
					secLen--;
					i--;
				}
			}
		}
	};

	/////////////////////
	// UiElement class //
	/////////////////////
	var uiEleTmpl = {//follow alphabe-order

		//relative of this obj
		"parent": undefined,// ref to parent card

		//extraction values from jsonMock
		"htmlContent": undefined,//its associate html, will be auto-render
		"isDetailChanged": false, //default is 'false', is the detail of this card has changed?
		"objType": uiRenderCoreService.CONSTANTS.objType.uiEle,//which type of obj is
		"originalValue": undefined, //Keep the old values of this element, help to compare between detail vs orignalDetail
		"refDetail": undefined, //ref to the correspondent element location in detail, use 'key' to find element

		//copy values from jsonMock
		"defaultValue": undefined,//if existed, show this value on UI
		"format": undefined,
		"index": undefined,//don't know whether it's still use or not, it used to set the order of uiELements on screen
		"key": undefined,//key of node, will use to locate the correspondent detail
		"labelKey": undefined,//keyid in translation file
		"maxlength": undefined,
		"name": undefined,//name of node
		
		"originalHtmlContent": undefined,//its original associate html, read from html files
		"permission": undefined,//stores fields use for card review
		"placeholder": undefined,
		"priority": 50, //the order of uiEle on preview card, higher priority will be ordered first
		"previewFor": undefined,//which uiStructure this uiElement will be a preview for
		"type": undefined, // view type of data 
		"valuePrefix": undefined,//if existed, will append to value to make translation key

		//need to preview again the purpose
		"html": undefined,//link to HTML of a uiEle, will have value when this uiEle has been drawn on screen
		"onClick": undefined, // on click event for print preview pdf
		"previewHtml": undefined,//which html file will be loaded for rendering preview
		"disableCondition": undefined, // disable condition for print preview pdf
		"scope": undefined,//link to scope of a uiEle's HTML, will have value when this uiEle has been drawn on screen
		"group": undefined,//align element by column
		//values for viewing on screen
		"view": {
			"isVisible": true, //default this uiElement will be display on screen
			"isDisable": undefined, //default this uiElement will be display on screen
		},
		"evalRefDetail" : undefined
	};//uiEle template

	var UiElement = (function(){

		var id = 0;//id of uiElement objects, which will start from 0
		var _name;//private variable, for testing

		function UiElement(wayOfCreation, params) {			
			if(!Array.isArray(params)){
				$log.error("Input of creating a new UiElement instance is invalid (not an array)");
				$log.error(params);
			}

			switch (wayOfCreation){
				case 'clone':
					this.fromInstance(params[0]);
					break;
				case 'fromJsonObj':
					this.fromJsonObj(params[0]);
					break;
				case 'fromJsonMock':
					this.fromJsonMock(params[0], params[1]);
					break;
			}

			this._id = id++;
		}


		//for testing
		UiElement.prototype.getName = function getName() {
			return this._name;
		};

		//for testing
		UiElement.prototype.setName = function setName(name) {
			_name = name;
		};

		return UiElement;
	})();

	extend(UiRenderUIService, UiElement);

	//add observer methods for UiElement
	Observer.extendMethods(UiElement);


	UiElement.prototype.fromJsonMock = function fromJsonMock(jsonMockEle, jsonMockEleName){
		extendValueFromOther(this, uiEleTmpl);

		this.setName(jsonMockEleName);
		this.name = jsonMockEleName;

		//handle 'type' attribute
		if(commonService.hasValueNotEmpty(jsonMockEle['type'])){					
			this.type = uiRenderCoreService.CONSTANTS.type[jsonMockEle['type']];
			jsonMockEle['type'] = undefined;

			if(!this.type)
				$log.debug("Attribute 'type' of uiEle: " + this.name + " in jsonMock is invalid!");
		}else{
			// $log.debug("Attribute 'type' of uiEle: " + this.name + " in jsonMock hasn't been declared yet");
		}

		//handle 'format' attribute
		if(commonService.hasValueNotEmpty(jsonMockEle['format'])){
			for(var key in uiRenderCoreService.CONSTANTS.format ){
				if(jsonMockEle['format'] == uiRenderCoreService.CONSTANTS.format[key]){
					this.format = jsonMockEle['format'];
					break;
				}
			}
			if(!commonService.hasValueNotEmpty(this.format)){
				$log.debug("'format' of uiEle: " + this.name + " is invalid");
			}
		}
		
		//handle 'preview' attribute
		if(commonService.hasValueNotEmpty(jsonMockEle['preview'])){
			this['previewFor'] = jsonMockEle['preview'];
			jsonMockEle['preview'] = undefined;
		}

		//handle 'isVisible' attribute
		if(jsonMockEle['isVisible']){
			this['view']['isVisible'] = jsonMockEle['isVisible'];
			jsonMockEle['isVisible'] = undefined;
		}
		
		//handle 'isDisable' attribute
		if(commonService.hasValueNotEmpty(jsonMockEle['isDisable'])){
			this['view']['isDisable'] = jsonMockEle['isDisable'];
			jsonMockEle['isDisable'] = undefined;
		}

		//handle 'group' attribute
		if(commonService.hasValueNotEmpty(jsonMockEle['group']) &&
			!isNaN(jsonMockEle['group'])){
			jsonMockEle['group'] = parseInt(jsonMockEle['group']);
		}

		for(var key in jsonMockEle){
			if(jsonMockEle[key] !== undefined){
				//only copy those attribute registered in uiElement
				if(this.hasOwnProperty(key))
					this[key] = jsonMockEle[key];
			}	

		}

	};

	UiElement.prototype.fromJsonObj = function fromJsonObj(jsonObj) {
		extendValueFromOther(this, jsonObj);
	};

	/**
	 * @author tphan37
	 * This function will create new uiElement base on the input, won't copy links attribute
	 * @param  {uiElement} instance an instance will be copy
	 */
	UiElement.prototype.fromInstance = function fromInstance(instance) {
		//currently parent always undefined, don't need to set it to undefined
	    // var oldParent = uiElement.parent;
	    // uiElement.parent = undefined;

		extendValueFromOther(this, instance);

    	//restore parent value
    	// uiElement.parent = oldParent;
	};

	UiElement.prototype.addAttr = function addAttr(key, value) {
		this[key] = value;
	};	

	/**
	 * Feb-16-2016
	 * @author tphan37
	 * Return the visible value of this uiElement
	 * @return {boolean} current visible value of this uiElement
	 */
	UiElement.prototype.isVisibleOnScreen = function() {
		var isVisible = this.view.isVisible;
		return typeof (isVisible) === 'boolean' ? isVisible : this.scope.$eval(isVisible);
	};	

	/**
	 * Feb-16-2016
	 * @author tphan37
	 * Return a function, which execute will provide the visible value 
	 * @return {function} when execute will provide the visible value (true/false)
	 */
	UiElement.prototype.getIsVisibleOnScreenFn = function(){
		var self = this;
		var fn;
		var isVisible = self.view.isVisible;

		if(typeof (isVisible) === 'boolean'){
			fn = function () {
				return isVisible;
			};
		}else{
			fn = function () {
				return self.scope.$eval(isVisible);
			};
		}

		return fn;
	};

	/**
	 * return the function to get the current value
	 * @param  {[type]} newValue [description]
	 * @return {[type]}          [description]
	 */
	UiElement.prototype.getValueFn = function() {
		/*var refDetail = this.refDetail;
		var fnReturn;

		if (refDetail.hasOwnProperty('Options')){
			fnReturn = function() {
				return refDetail.Value;
			}
		} else if (refDetail.hasOwnProperty('@visible')){
			fnReturn = function() {
				return refDetail.$;
			}
		} else {
			fnReturn = function() {
				return refDetail;
			}
		}

		return fnReturn;*/
		
		var refDetail = this.refDetail;
		var fnReturn;

		if (commonService.hasValueNotEmpty(refDetail.meta)){
			fnReturn = function() {
				return refDetail.value;
			}
		} else {
			fnReturn = function() {
				return refDetail;
			}
		}

		return fnReturn;
	};

	/**
	 * return the function to set the current value
	 * @param  {[type]} newValue [description]
	 * @return {[type]}          [description]
	 */
	UiElement.prototype.setValueFn = function() {
		/*var refDetail = this.refDetail;
		var fnReturn;

		if (refDetail.hasOwnProperty('Options')){
			fnReturn = function(newValue) {
				refDetail.Value = newValue;
			}
		} else if (refDetail.hasOwnProperty('@visible')){
			fnReturn = function(newValue) {
				refDetail.$ = newValue;
			}
		} else {
			fnReturn = function(newValue) {
				//do nothing for big refDetail
			}
		}

		return fnReturn;*/
		
		var refDetail = this.refDetail;
		var fnReturn;

		if (commonService.hasValueNotEmpty(refDetail.meta)){
			fnReturn = function(newValue) {
				refDetail.value = newValue;
			}
		} else {
			fnReturn = function(newValue) {
				//do nothing for big refDetail
			}
		}

		return fnReturn;
	};

	/**
	 * update value to uiElement
	 * @param  {[type]} newValue [description]
	 * @return {[type]}          [description]
	 */
	UiElement.prototype.updateValue = function(newValue, isClearErrorCode) {
		/* enhance:
		 * 	isClearErrorCode	value 		->		value2
		 * 						undefined			true
		 * 						true				true
		 * 						false				false
		 */
		isClearErrorCode = isClearErrorCode !== false;
		
		var refDetail = this.refDetail;
		if(isClearErrorCode && refDetail.meta != undefined) {
			//We don't need to clear array of object
			if(refDetail.meta["counter"] == undefined && Array.isArray(refDetail.value) === false) {
				uiRenderCoreService.clearErrorInElement(refDetail);
			}
			else if(Array.isArray(refDetail.value) === true){
				uiRenderCoreService.clearErrorInArray(refDetail.value);
			}
		}
		this.setValue(newValue);
		this.updateUiEleStatus(this);
		this.checkChangeDetail(this);
		this.fireEvent(uiRenderCoreService.CONSTANTS.EVENT.VALUE_CHANGED, this);
	};

	UiElement.prototype.setRefDetail = function(newRefDetail) {
		this.refDetail = newRefDetail;

		if (newRefDetail){
			var refDetail = this.refDetail;

			this.originalValue = angular.copy(refDetail);
			if(this.isDetailChanged === undefined) {
				this.isDetailChanged = false;
	    	}
	    	if(this.parent && (this.parent.isDetailChanged === false)) {
	    		this.isDetailChanged = false;
	    	}

			this.updateUiEleStatus(this);

			//update the getValue()
			this.getValue = this.getValueFn();
			this.setValue = this.setValueFn();
		}

		//we have new refDetail, notify event
		this.fireEvent(uiRenderCoreService.CONSTANTS.EVENT.DETAIL_CHANGED, this.refDetail);
	};
	
	/**
     * @param  {Object}  	scope current Angular Scope on screen
     * @return {function}   the function which executes will return the value
     */
	UiElement.prototype.getIsDisableFn = function(scope){
		var self = this;
		var fn;
		var isDisable = self.view.isDisable;
		if(typeof (isDisable) === 'boolean'){
			fn = function () {
				if(self.refDetail['@editable'] == "0")
					return true;
				else
					return isDisable;
			};
		}else{
			fn = function () {
				if(self.refDetail['@editable'] == "0")
					return true;
				else
					return scope.$eval(isDisable);
			};
		}
		
		//now call this.isDisable() will return real value
		this.isDisable = fn;
		return fn;    	    	
    };

	/////////////////////
	// UiElement class //
	/////////////////////

	//HTML builder single instance
	var HtmlBuilder = (function() {
		var singleInstance;

		function HtmlBuilder() {

			this.standardTemplate = 
				'<div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 v3-column-content">'
			+ 		' <div class="col-xs-offset-1 col-xs-10 v3-column-content">'
			+ 			'<div class="form-group form-group-lg has-success">'
			+ 	'</div></div></div>';

			//list out the standard order steps for building an html content
			this.standardBuild = [
				//build label first
				this.buildLabel,
				this.buildMandatory,
				this.buildPlaceHolder,
				this.buildNgModel,
				this.buildDisable,
				this.buildInput,
				this.buildError
			];

			this.setWrapperEle = function setWrapperEle(obj) {
				this.wrapperEle = obj;
			}
			this.setWrapperInput = function setWrapperInput(obj) {
				this.wrapperInput = obj;
			}

			this.buildDisable = function buildDisable() {
				$log.error('Not implemented yet!');
				return this;
			};

			this.buildError = function buildError() {
				$log.error('Not implemented yet!');
				return this;
			};

			this.buildInput = function buildInput () {
				$log.error('Not implemented yet!');
				return this;
			};

			this.buildLabel = function buildLabel () {
				var mandatory = this.refDetail['@mandatory'] === '1' ? '*' : '';
				$log.error('Not implemented yet!');
				return this;
			};

			this.buildMandatory = function buildMandatory () {
				$log.error('Not implemented yet!');
				return this;
			};

			//return content of ng-model for binding
			this.buildNgModel = function buildNgModel() {
				$log.error('Not implemented yet!');
				return this;
			};

			this.buildPlaceHolder = function buildPlaceHolder() {
				$log.error('Not implemented yet!');
				return this;
			};

			this.build = function build() {
				// body...
			}

		}

		return {
			getInstance: function () {		
				if (typeof singleInstance === "undefined") {
					singleInstance = new HtmlBuilder();
					// Hide the constructor so the returned objected can't be new'd...
					singleInstance.constructor = null;
				}
				return singleInstance;
			}
		}
	})();

	// var s1 = HtmlBuilder.getInstance();
	// var s2 = HtmlBuilder.getInstance();
	// if (s1 === s2) {
	//     alert ("Good singleton");
	// }

	return new UiRenderUIService($q, ajax, $location, appService, cacheService, uiRenderCoreService, commonService, AclService);
}]);