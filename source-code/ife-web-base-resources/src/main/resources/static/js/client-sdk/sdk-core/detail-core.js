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
var coreModule = angular.module('coreModule',['commonModule','translateUIModule','HttpInterceptorModule', 'connectionModule'])
.service('detailCoreService', ['$q', 'ajax', '$http', '$location', 'appService', 'cacheService', 'commonService', '$window', '$translate', '$filter', '$log', 'connectService','loadingBarService',
	function($q, ajax, $http, $location, appService, cacheService, commonService, $window, $translate, $filter, $log, connectService, loadingBarService){

	/*##################################################################
	 * IposDocService Function
	###################################################################*/

	/**
	 * This file is only a part of service-model.js
	 * Therefore, we have to import service-model.js before using this file.
	 */

	function IposDocService(){
	}

	IposDocService.prototype.findElement = function(eleName, element){
		if (eleName =="") return undefined;
		var eleNameArray = eleName.split(":");
		for(var prop in element) {
			var originalProp = prop;
			if(prop != undefined){
				if(eleNameArray.length < 2){
					var propArray = prop.split(":");
					if(propArray.length > 1){
						var keyProp = propArray[1];
						prop = keyProp;
					}
				}
			}
			if(prop === eleName) {
				eleName = originalProp;
				return element[eleName];
			}
			prop = originalProp;
			if(angular.isObject(element[prop])) {
				var rs = this.findElement(eleName, element[prop]);
				if (rs !== undefined)
				return rs;
			}
		}
		return undefined;
	};

	IposDocService.prototype.findElementInElement = function(element, elementsChain, options){
		if (element === undefined) return undefined;

		var errorOn = true;
		if (elementsChain[0] === 'MetadataDocument') errorOn = false;

		options = options || {
			'returnLastFound': true, //default want to return last found
			'errorOn': errorOn //default error will show
		};

		var ele = element;
		for (var i = 0; i < elementsChain.length; i++) {
			var eleName = elementsChain[i];
			var newEle = this.findElement(eleName, ele);
			if (newEle !== undefined){
				ele = newEle;
			}
			else if(!options.getlastFound) {
				ele = undefined;
			}
		}
		//if can't find any result for the first time
		if(ele === undefined && options.errorOn){
			$log.warn("Error: Can't find element in object by elementsChain: ["+ elementsChain + "]");
			$log.warn(element);
		}

		return ele;
	};

	IposDocService.prototype.findElementInDetail = function(elementsChain, options){
		if (this.detail === undefined) return undefined;
		return this.findElementInElement(this.detail, elementsChain, options);
	};

	/**
	 *  sort any array of objects that all share the property which is used as they key 
	 */
	IposDocService.prototype.sortByKey = function sortByKey(array, key) {
	    return array.sort(function(a, b) {
	        var x = a[key]; var y = b[key];
	        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
	    });
	}
	
	/**
	 *  sort any array of objects that all share the property which is used as they 2 key
	 */
	IposDocService.prototype.sortByTwoKey = function sortByKey(array, key1, key2) {
		return array.sort(function(a, b) {
	        var x = a[key1]; var y = b[key1];
	        var t = a[key2]; var e = b[key2];
	        return ((x < y) ? -1 : ((x > y) ? 1 : ((t < e) ? -1 : ((t > e) ? 1 : 0))));
	    });
	}
	
	
	/**
	 * Check whether an obj is leaf node or not
	 * @param  {Object}  obj obj need to check
	 * @return {Boolean}     true if leaf-node, otherwise false
	 */
	IposDocService.prototype.isLeafNode =  function isLeafNode(obj) {
		if(!obj)
			return true;

		if(obj['section'])
			return false;

		if('type' in obj){//for now, only 'type' exist in obj
			return true;
		}

		if(
			obj['preview'] ||
			obj.Options ||
			Object.keys(obj).length === 0
			)
			return true;

		for(var prop in obj){
			//section or leaf node might have '@key' attribute
			if(prop === 'key' || prop === 'permission')
				continue;

			if(angular.isObject(obj[prop])){
				return false;
			}
		}
		return true;
	};

	/**
	 * remove the prefixs (Eg: 'person:Gender' --> 'Gender')
	 * @param  {String} originalStr original string
	 * @return {String}      		the removed prefix
	 */
	IposDocService.prototype.removePrefixOfName = function removePrefixOfName(originalStr) {
		var names = originalStr.split(':');
		return names.length > 1 ? names[1] : names[0];
	};

	/**
	 * @author tphan37
	 * 30-Nov-2015
	 * Internal function to find the full name of a key (with prefix)
	 * @param  {Object} ele Object which have attribute with 'key' (short or full)
	 * @param  {String} key with or without prefix
	 * @return {String}     key of attribute in 'ele'
	 */
	IposDocService.prototype._findFullKeyWithPrefix = function _findFullKeyWithPrefix (ele, key) {
		var result = key;
		//if the ele[key] is undefined, means key has been removed the prefix
		if(!ele[key]){
			//find the full prefix
			for (var k in ele) {
				if(k.indexOf(key) !== -1){
					result = k;
				}
			}
		}
		return result;
	};
	
	IposDocService.prototype.addChildEleToParentEleWithCounter = function(parentEle, childEleName, index) {
		var eles = parentEle[childEleName];
		var cloneElement = angular.copy(parentEle.arrayDefault);
		parentEle['meta'].counter++;
		if(index != undefined) {
			eles.splice(index, 0, cloneElement);
		} else {
			eles.push(cloneElement);
		}
	};
	IposDocService.prototype.addChildEleToParentEleWithCounterNoArrDefault = function(parentEle, childEleName, index) {
		var self = this;
		var eles = parentEle[childEleName];
		var cloneElement = angular.copy(parentEle.value[0]);
		this.clearDataInJson(cloneElement);
		this.clearErrorInElement(cloneElement)
		parentEle['meta'].counter++;
		if(index != undefined) {
			eles.splice(index, 0, cloneElement);
		} else {
			eles.push(cloneElement);
		}
	};
	
	IposDocService.prototype.removeChildEleToParentEleWithCounter = function(index, parentEle, childEleName) {
		var eles = parentEle[childEleName];		
		parentEle['meta'].counter--;
		eles.splice(index, 1);		
	};

	IposDocService.prototype.removeAllChildrenInParentEleWithCounter = function(parentEle, childEleName){
		parentEle[childEleName] = [];
		parentEle['meta'].counter = 0;
	};
	
	/**
	 * Oct-06-2016
	 * @author  dnguyen98
	 * add new child 'childEle' to its parent 'parentEle'
	 * @param {Object} parentEle object parent
	 * @return {Object} Return the added element
	 */
	IposDocService.prototype.addChildEleToParentEle = function(parentEle, childEleName) {
		var eles = parentEle[childEleName];
		var cloneElement = undefined;
		if (!angular.isArray(eles)) {
			if (angular.isArray(eles.value)) {
				parentEle = eles;
				eles = eles.value;
			}
		}
			cloneElement = angular.copy(parentEle.arrayDefault);
			eles.push(cloneElement);
		return eles;
	};
	
	/**
	 * Jan-24-2018
	 * @author  ppham34
	 */
	IposDocService.prototype.addChildEleToParentEle_New = function(parentEle, childEleName, docType, businessType, productName) {
		var self = this;
		var deferred = self.$q.defer();
		var eles = parentEle[childEleName];
		var cloneElement = undefined;
		if (!angular.isArray(eles)) {
			if (angular.isArray(eles.value)) {
				parentEle = eles;
				eles = eles.value;
			}
		}
		if(parentEle.arrayDefault != undefined) {
			cloneElement = angular.copy(parentEle.arrayDefault);
			eles.push(cloneElement);
			deferred.resolve(eles);
		} else {
			if(commonService.hasValueNotEmpty(parentEle.className)) {
				var actionName = 'GET_LIST';
				var actionParams = { docType: docType + 's', productName: productName, businessType: businessType, className: parentEle.className };
				connectService.exeAction({
					actionName: actionName,
					actionParams: actionParams,
					requestURL: undefined,
					data: undefined
				}).then(function (data) {
					parentEle.arrayDefault = angular.copy(data);
					eles.push(data);
					deferred.resolve(eles);
				});
			} else {
				deferred.resolve();
			}
		}
		return deferred.promise;
	};

	/**
	 * Feb-16-2017
	 * @author  tphan37
	 * Remove all the children in parent element
	 * @param {Object} parentEle 		object parent
	 * @param {String} childEleName  	name of the element need to remove
	 */
	IposDocService.prototype.removeAllChildrenInParentEle = function(parentEle, childEleName){
		// var eles = parentEle[childEleName];
		// eles.splice(1, eles.length - 1);
		// this.clearDataInJson(eles[0]);
		// parentEle['@counter'] = 0;

		//V4-UIC approach
		parentEle[childEleName] = [];
	};

	/**
	 * Oct-06-2016
	 * @author  dnguyen98
	 * Remove all the children in parent element
	 * @param {Object} parentEle 		object parent
	 * @param {String} childEleName  	name of the element need to remove
	 * @param {Integer} index  	index of element need to remove
	 * @param {boolean} removeTemplateObject  	remove last item from array
	 */
	IposDocService.prototype.removeChildEleParentEle = function(parentEle, childEleName, index, removeTemplateObject){
		var eles = parentEle[childEleName];
		if (angular.isArray(eles)) {
			//allow to empty parent node
			// if (parentEle.length == 1 && removeTemplateObject) {
			// 	parentEle.splice(0, 1);
			// } else if (parentEle.length > 1) {
			// 	parentEle.splice(index, 1);
			// } else {
			// 	this.clearDataInJson(parentEle[0]);
			// }

			//V4-UIC approach
			if(!isNaN(parentEle['meta'].counter)) {
				parentEle['meta'].counter --;
			}			
			eles.splice(index, 1);
		}
	};
	
	/**
	 * add new child 'element' to its parent 'elements'
	 * @param {Object} data     object in iPosDocument v3 store element need to add and its parent (elements)
	 * @param {String} elements name of the object parent
	 * @param {String} element  name of the object need to add
	 */
	IposDocService.prototype.addElementInElement = function(data, elements, element) {
		var parentEle = this.findElementInElement(data, elements);
		parentEle[element].meta.counter++;
		if (parentEle[element].meta.counter != 1) {
			var childEle = this.findElementInElement(parentEle, element).value;			
			var cloneElement = JSON.parse(JSON.stringify(childEle[0]));
			this.clearDataInJson(cloneElement);
			childEle.push(cloneElement);
		}
	};

	IposDocService.prototype.removeElementInElement = function(index, data, elements, element) {
		var parentEle = this.findElementInElement(data, elements);
		var childEle = this.findElementInElement(parentEle, element).value;
		if (childEle.length > 1) {
			childEle.splice(index, 1);
			parentEle[element].meta.counter--;
		} else if (childEle.length == 1) {
			this.clearDataInJson(childEle[0]);
		}
	};

	/**
	 * compare 2 data with the same json format
	 * @param {json} src: object to compare with des
	 * @param {json} des: object to compare with src
	 * return {boolean} true: if src and des are the same/ false: if src and des are not the same
	 */
	IposDocService.prototype.compareData = function(src, des) {
		var prop;
		if (!src && des || src && !des) {
			return false;
		}
		if(!src && !des){
			return true;
		}

		for (prop in src) {
			if (src.hasOwnProperty(prop)) {
				if (prop === "value" && typeof src[prop] !== "object") {
					if (src[prop] !== des[prop]) {
						return false;
					}
				}
				if (typeof src[prop] === "object" &&
					prop !== "meta" &&
					prop !== "arrayDefault" &&
					prop !== "className") {
					if (!this.compareData(src[prop], des[prop]))
						return false;
				}
			}
		}
		return true;
	};

	IposDocService.prototype.extractDataModel = function(uiModel) {
		var self = this;
		var dataModel = {};
		if (uiModel === undefined) {
			throw "ERROR extractDataModel(uiModel): uiModel is null";
		}
		self.convertUIModel2DataModel(uiModel, dataModel);
		return dataModel;
	};

	/**
	 * Prepare UI Model binding to html
	 * @author  lhoang4
	 * get UI model base on docType, Product...
	 */
	IposDocService.prototype.getUIModel = function(docType, businessType, product) {
		var self = this;
		var deferred = self.$q.defer();
		if (!commonService.hasValueNotEmpty(docType)) {
			docType = self.name;
		}
		var fileName = docType;
		if (businessType != undefined) {
			fileName = fileName + '_' + businessType;
		}
		if (product != undefined && docType !='contact') {
			fileName = fileName + '_' + product;
		}
		var url = resourceServerPath + 'view/workspaces/uiModel/' + fileName + '.json';
		$http.get(url).then(function(response) {
			deferred.resolve(response.data);
		});
		return  deferred.promise;
	};

	/**
	 * This function is used for Merge from MetaModel (after call REFRESH, VALIDATE API) to UI Model
	 * Change data structure to from Array to Meta object
	 */
	IposDocService.prototype.mergeMetaModel2UIModel = function(metaModel, uiModel) {
		var self = this;
		for (var prop in metaModel) {
			if (metaModel.hasOwnProperty(prop) && metaModel[prop] !== null) {
				if (typeof metaModel[prop] === 'object' && metaModel[prop] !== null) {
					//is array, check whether if it's been created
					if (Array.isArray(metaModel[prop])) {
						
						uiModel[prop] = Array.isArray(uiModel[prop]) ? uiModel[prop] : [];
					}
					//is object, check whether if it's been created
					else {
						uiModel[prop] = typeof uiModel[prop] === 'object' ? uiModel[prop] : {};
					}
					self.mergeMetaModel2UIModel(metaModel[prop], uiModel[prop]);
				} else {
					if (prop !== 'value' &&
						(typeof uiModel[prop] === 'string' || typeof uiModel[prop] === 'undefined' ||
						(typeof uiModel[prop] === 'object' && uiModel[prop] === null))) {
						
						if(prop === "mandatory")
//							uiModel[prop] = commonService.hasValueNotEmpty(metaModel[prop]) ? metaModel[prop] : uiModel[prop];
//							uiModel[prop] = (metaModel[prop] === "true" || uiModel[prop] === "true") + "";
							uiModel[prop] = (commonService.hasValueNotEmpty(metaModel[prop]) ? metaModel[prop] : (commonService.hasValueNotEmpty(uiModel[prop]) ? uiModel[prop] : "false"));
						else
							uiModel[prop] = metaModel[prop];
					}
				}
			}
		}
	};

	/**
	 * This function is used for convert from UI model to data model
	 * Change data structure to key: value
	 */
	IposDocService.prototype.convertUIModel2DataModel = function(uiModel, dataModel){
		for (var prop in uiModel) {
			if (uiModel.hasOwnProperty(prop)) {
				dataModel[prop] = angular.copy(uiModel[prop]);
				var propName = angular.copy(prop);

				if (angular.isObject(dataModel[prop])) {

					if (dataModel[prop].hasOwnProperty("value") &&
						dataModel[prop].hasOwnProperty("meta")) {
						var value = dataModel[prop].value;
						//remove prefix
						delete dataModel[prop];

						dataModel[propName] = value;

						//Process for array
						if (Array.isArray(uiModel[prop].value)) {
							this.convertUIModel2DataModel(uiModel[prop].value, dataModel[propName]);
						}

					} else {
						var tempObj = angular.copy(dataModel[prop]);
						delete dataModel[prop];
						dataModel[propName] = tempObj;

						this.convertUIModel2DataModel(uiModel[prop], dataModel[propName]);
					}
				} else if (prop.indexOf("Counter") !== -1) {
					delete dataModel[prop];
				}
			}
		}
	};

	/**
	 * This function is used for convert from data model to UI model
	 * Change data structure from key: value to
	 *
	 * "key": {
	 * "value": null,
	 * "meta":{}
	 * }
	 *
	 * NOTE: pass only dataModel to convert from new data model to ui model format
	 * if dataModel and uiModel if available then this function use vpms name from uiModel then set it to dataModel
	 */
	IposDocService.prototype.convertDataModel2UiModel = function(dataModel, uiModel) {
		var self = this;
		for (var prop in dataModel) {
			if (dataModel.hasOwnProperty(prop)) {
				var tempDM = dataModel[prop];
				var tempUDM = undefined;

				//get the first item from array
				if (uiModel) {
					tempUDM = isNaN(prop) ? uiModel[prop] : uiModel[parseInt(prop)];
				}
				if (typeof tempDM === "object" && !Array.isArray(tempDM) && tempDM !== null ) {
					self.convertDataModel2UiModel(tempDM, tempUDM);
				} else if (prop !== "id" && prop !== "version") {
					var meta = undefined;
					var arrayDefault = undefined;
					var className = undefined;
					if (tempUDM) {
						meta = tempUDM.meta;
						arrayDefault = tempUDM.arrayDefault;
						className = tempUDM.className;
					} else if (Array.isArray(tempDM)) {
						meta = commonService.CONSTANTS.DEFAULT_META_PROPERTIES_FOR_ARRAY;
					} else {
						meta = commonService.CONSTANTS.DEFAULT_META_PROPERTIES;
					}
					if (tempDM === null && tempUDM && Array.isArray(tempUDM.value)) {
						tempDM = angular.copy(tempUDM.value);
					}
					if (typeof(tempDM) === "boolean") {
						tempDM += '';
					}
					dataModel[prop] = {
						value: tempDM,
						meta: angular.copy(meta),
						arrayDefault: angular.copy(arrayDefault),
						className: angular.copy(className)
					};
					if (Array.isArray(tempDM) && typeof dataModel[prop].arrayDefault !== "string" && typeof dataModel[prop].arrayDefault !== "number") {
						self.convertDataModel2UiModel(tempDM, tempUDM ? tempUDM.value : undefined);
					}
				}
			}
		}
	};
	IposDocService.prototype.copyValueToNode = function(detail, node, value ) {
		var self = this;
		for (var prop in detail) {
            var tempNode = node;
            var tempValue = value;
			if (detail.hasOwnProperty(prop)) {
				var tempDetail = detail[prop];
				if (typeof tempDetail === "object" && !Array.isArray(tempDetail) && tempDetail !== null ) {
					self.copyValueToNode(tempDetail, tempNode, tempValue);
				}else if(typeof  tempDetail === "string" && prop === tempNode){
                    detail[prop] = tempValue;				}
			}
		}
	};
	IposDocService.prototype.clearSpecificElement = function(src, revList){
		var self = this;
		var removeList = revList;
		for (var prop in src) {
			if (src.hasOwnProperty(prop)) {
				//remove attribute
				if ((removeList.indexOf(prop) > -1)) {
					src[prop] = null;
				}
				if (typeof src[prop] === "object") {
					if (!self.isLeafNode(src[prop])) {
						self.clearSpecificElement(src[prop], removeList);
					}
				}
			}
		}
	};

	IposDocService.prototype.clearErrorInElement = function(element){
		var self = this;
		for(var prop in element){
			if (element.hasOwnProperty(prop)) {
				if (prop === 'errorCode') {
					element[prop] = "";
				} else if (element[prop] !== null && typeof element[prop] === 'object') {
					self.clearErrorInElement(element[prop]);
				}
			}
		}
	};
	IposDocService.prototype.clearErrorInArray = function(element){
		var self = this;
		for(var prop in element){
			if (element.hasOwnProperty(prop)) {
				if ( prop === 'meta' && typeof element[prop] === 'object' && element.hasOwnProperty('value') && commonService.hasValueNotEmpty(element.value)) {
					if(element[prop].hasOwnProperty('errorCode')){
						element[prop].errorCode = '';
					}
				} 
				else if (element[prop] !== null && typeof element[prop] === 'object') {
					self.clearErrorInArray(element[prop]);
				}
			}
		}
	};
	/**
	 * Oct-06-2016
	 * @author  dnguyen98
	 * clear data in attribute of objects
	 * @param  {Object} 	element  	the object need to clear element
	 */
	IposDocService.prototype.clearDataInJson = function(element, listRemoveNode){

		//remove some item from default list
		if (listRemoveNode){
			this.listDeleteElement = listRemoveNode;
		} else {
			this.listDeleteElement = ["refUid", "value", "errorCode", "checkbox", "uuid", "id"];
		}

		for (var prop in element) {
			//if element has those 'prop', clear it
			if ( this.listDeleteElement.indexOf(prop) !== -1){
				//if has default value, set it again
				if(commonService.hasValueNotEmpty(element['default']))
					element[prop] = element['default'];
				else if(typeof(element[prop]) === "boolean"){
					element[prop] = false;
				} else if (angular.isString(element[prop]) || angular.isNumber(element[prop])){
					/*element[prop] = "";*/
					element[prop] = null; //element[prop] == null in order to call API (msg cannot parse field from "" to Date )
				}
			}

			//if it's an object, continuous to processe it
			if (typeof element[prop] === "object" &&
				prop !== "Options" &&
				prop !== "code" &&
				prop !== "meta" &&
				prop !== "refType") {
				this.clearDataInJson(element[prop],listRemoveNode);
			}
		}
	};

	/**
	 * Oct-14-2016
	 * @author  dnguyen98
	 * check data is empty in objects
	 * @param  {Object} 	element  	the object need to check element
	 * @return {boolean} True if the array is empty
	 */
	IposDocService.prototype.checkEmptyDataInObjects = function(element){
		var isEmptyNode = true;

		for (var prop in element) {
			if(prop === "code")
				continue;
			if(angular.isString(element[prop])){
				if (prop === "refUid" || prop === "value" || prop === "refUidFnaStandard" || prop === "quotationRefUid"){
					if((commonService.hasValueNotEmpty(element[prop]) && (element[prop] !== "0" && element[prop] !== "0.00"))) {
						isEmptyNode = false;
						break;
					}
				}
			}

			//if it's an object, continuous to processe it
			if (typeof element[prop] === "object") {
				isEmptyNode =  this.checkEmptyDataInObjects(element[prop]);
				if(isEmptyNode === false)
					return isEmptyNode;
			}
		}
		return isEmptyNode;
	};

	/**
	 * Oct-14-2016
	 * @author  dnguyen98
	 * check data is empty in Array
	 * @param  {Object} 	element  	the object need to check element
	 * @param  {Boolean} 	isOneNode  	check one or all node in array
	 * @return {Boolean}    True if the array is empty
	 */
	IposDocService.prototype.checkEmptyDataInArray = function(element, isOneNode){
		var self = this;
		var isEmptyArray = false;
		if(!angular.isArray(element)){
			$log.error("Error: This element must be array");
			$log.debug(element);
			return;
		}

		if(isOneNode === true){
			if(element.length === 1 && self.checkEmptyDataInObjects(element[0])){
				isEmptyArray = true;
			}
		}else{
			for(var i = 0; i < element.length-1; i++){
				if(!self.checkEmptyDataInObjects(element[i])){
					isEmptyArray = true;
					break;
				}
			}
		}
		return isEmptyArray;
	};

	/**
	 * @author nnguyen75
	 * Check calling gateway runtime result
	 * @param data
	 * @returns {Boolean}
	 */
	IposDocService.prototype.isSuccess = function(data) {
		var result = data && !data.hasOwnProperty('error');
		
		return result;
	};

	/**
	 * convert all object base on 'arrayKey' in detail to array
	 * @param  {Object}		detail 		iposDocument json data
	 * @param  {Array}		arrayKey 	contain eleName array need to convert.
	 */
	IposDocService.prototype.convertObjectToArray = function convertObjectToArray(detail, arrayKey){
		var self = this;
		var childDetail = detail;
		var eleName = arrayKey;

		if(arrayKey.length > 1){
			eleName = arrayKey.pop();
			childDetail = self.findElementInElement(detail, arrayKey);
		}
		self.convertObjectEleToArray(childDetail, eleName);
	};

	//convert Object element to Array. Apply for new UiStructure
	IposDocService.prototype.convertObjectEleToArray = function (detail, elementName){
		var self = this;
		for(var key in detail){
			if(detail.hasOwnProperty(key) && typeof(detail[key]) === "object"){
				if(key.indexOf(elementName) !== -1){ //detail is parent of detail[elementName]
					if(!angular.isArray(detail[key])){
						detail[key] = self.convertToArray(detail[key]);
						break;
					}
				}
				else{
					self.convertObjectEleToArray(detail[key], elementName);
				}
			}
		}
	};

	/*##################################################################
	 * ListDetailCoreService Function
	 *###################################################################*/

	/**
	 * @constructor
	 * @param $q
	 * @param ajax
	 * @param $location
	 * @param appService
	 * @param cacheService
	 */
	var ListDetailCoreService = function ($q, ajax, $location, appService, cacheService, commonService) {
		IposDocService.call(this);

		this.name = undefined;

		// services
		this.$q = $q;
		this.ajax = ajax;
		this.cacheService = cacheService;
		this.$location = $location;
		this.appService = appService;
		this.commonService = commonService;
		// data
		this.items = undefined;
		this.detail = undefined;
		this.originalDetail = undefined;
		this.lazyChoiceList = undefined;
	};
	inherit(IposDocService, ListDetailCoreService);

	/**
	 * init new v4 datamodel object (iposDocument)
	 * @param  {String} requestURL [description]
	 * @param  {String} docType     [description]
	 * @param  {String} productName [description]
	 * @param  {String} transactionType    transaction type ('NewBusiness', 'ENDORSEMENT')
	 *  @param isDetail: Is assign into detail of moduleService
	 * @return {Object}             Angular promise
	 */
	ListDetailCoreService.prototype.initializeDocument = function(requestURL, docType, productName, transactionType, isDetail, businessType, requestBody) {
		var self = this;
		var deferred = self.$q.defer();
		if (!commonService.hasValueNotEmpty(docType)) {
			docType = self.name;
		}
		isDetail = typeof isDetail === "undefined" ? true : isDetail;
		var actionName = 'INIT_DOCUMENT';
		var actionParams = { docType: docType + 's', productName: productName, businessType: businessType };
		connectService.exeAction({
			actionName: actionName,
			actionParams: actionParams,
			requestURL: requestURL,
			data: requestBody
		}).then(function (data) {
			if (self.isSuccess(data)) {
				if (self.name === docType && isDetail) {
					self.detail = data;
					self.originalDetail = angular.copy(self.detail);
				}
			}
			deferred.resolve(data);
		});
		return deferred.promise;
	};
	ListDetailCoreService.prototype.initializeSAReport = function(requestURL,docType, SAName) {
		var self = this;
		var deferred = self.$q.defer();
		//isDetail = typeof isDetail === "undefined" ? true : isDetail;
		var actionName = 'INIT_SA_REPORT';
		var actionParams = { SAName: SAName};
		connectService.exeAction({
			actionName: actionName,
			actionParams: actionParams,
			requestURL: requestURL
		}).then(function (data) {
			if (self.isSuccess(data)) {
				if (self.name === docType) {
					data.username = localStorage.getItem("username");
					self.detail = data;
					self.originalDetail = angular.copy(self.detail);
				}
			}
			deferred.resolve(data);
		});
		return deferred.promise;
	};
	ListDetailCoreService.prototype.generateReport = function(requestBody) {
		var self = this;
		var deferred = self.$q.defer();
		var actionName = 'GENERATE_REPORT_SA';
		var data = undefined;
		connectService.exeAction({
			actionName: actionName,
			data: requestBody
		}).then(function (data) {
			deferred.resolve(data);
		});
		return deferred.promise;
	};

	//init small part of model
	ListDetailCoreService.prototype.initializePartialDocument = function(requestURL, docType, partDocType, partName) {
		var self = this;
		var deferred = $q.defer();
		docType = docType !== undefined ? docType : self.name;
		connectService.exeAction({
			actionName: "INIT_DOCUMENT_PARTIAL",
			actionParams: {'docType': docType + "s", 'partDocType': partDocType, 'type': partName},
			requestURL: requestURL
		}).then(function (data) {
			deferred.resolve(data);
		});
		return deferred.promise;
	};
	
	ListDetailCoreService.prototype.genRandomNumber = function(len){
	 	var text = "";
		var possible = "0123456789";
		
		for( var i = 0; i < len; i++ )
		    text += possible.charAt(Math.floor(Math.random() * possible.length));

		return text;
	 };
	
	ListDetailCoreService.prototype.genDefaultName = function(){
		var self = this;			 
		var text = self.genRandomNumber(8);			
		
		if(self.name == "prospect"){
			text = 'PP'+text;
		}else if(self.name == 'organization-contact'){
			 text = 'CC' + text;
		}else if(self.name == "illustration"){
			if (self.productName.indexOf('life')) text = "BI" + text;
			else text = 'QI'+ text;
		}else if(self.name == 'application'){
			text = 'AP'+text;
		}else if(self.name == 'pdpa'){
			text = 'PA'+text;
		}else if(self.name == 'case-management'){
			 text = 'BC'+text;
		}else if(self.name == 'claim-notification'){
			 text = 'CN'+text;
		}else if(self.name == 'claim'){
			 text = 'V'+text;
		}else if(self.name == 'underwriting'){
			 text = 'UW'+text;
		}else if(self.name == 'transaction'){			
			text = 'TS' + self.genRandomNumber(20)+self.genRandomNumber(8);
		}else if(self.name == 'user'){
			 text = 'PF' + text;
		}else if(self.name == 'factfind'){
			 text = 'FNA' + text;
		}else if(self.name == 'GSS'){
			 text = 'RQ' + text;
		}
		 return text;
	 };

	 /**
	  * Save detail of an existing document or create a new document with input detail
	  * @param requestURL
	  * @param docType
	  * @param docId
	  * @param specificDetail
	  */
	ListDetailCoreService.prototype.saveDocument = function(requestURL, docType, docId, specificDetail) {
		var self = this;
		var deferred = $q.defer();
		if (!commonService.hasValueNotEmpty(docType)) {
			docType = self.name;
		}
		if (!commonService.hasValueNotEmpty(docId)) {
			docId = self.findElementInElement(specificDetail, ['id']);
		}
		if (!commonService.hasValueNotEmpty(docId)) {
			docId = self.findElementInDetail(['id']);
		}
		if (!commonService.hasValueNotEmpty(docId)) { //create new
			self.createDocument(requestURL, docType, specificDetail, self.businessLine, self.productName).then(function(data){
				if (self.isSuccess(data)){
					self.convertDataModel2UiModel(data, specificDetail || self.detail);
					if (!commonService.hasValueNotEmpty(specificDetail)) {
						self.detail = angular.copy(data);
						self.originalDetail = angular.copy(data);
					}
				}
				deferred.resolve(data);
			});
		} else { //update
			self.updateDocument(requestURL, docType, docId, specificDetail, self.businessLine, self.productName).then(function(data){
				if (self.isSuccess(data)) {
					self.convertDataModel2UiModel(data, specificDetail || self.detail);
					if (!commonService.hasValueNotEmpty(specificDetail)) {
						self.detail = angular.copy(data);
						self.originalDetail = angular.copy(data);
					}
				}
				deferred.resolve(data);
			});
		}
		return deferred.promise;
	};

	/**
	 * Create new document in first time save
	 * @param requestURL
	 * @param docType
	 * @param specificDetail
	 */
	ListDetailCoreService.prototype.createDocument = function(requestURL, docType, specificDetail, businessType, productName) {
		var self = this;
		var deferred = $q.defer();
		if (!commonService.hasValueNotEmpty(docType)) {
			docType = self.name;
		}
		
		try {
			var data = JSON.parse(localStorage.selected_profile);
			if(data.role === 'PO'){
				specificDetail.metaData.profileId.value = data.customerId;
			}else{
				specificDetail.metaData.profileId.value = data.pasId;
			}
			specificDetail.metaData.branchName.value = data.pasBranch;
			specificDetail.metaData.branchId.value = data.pasBranchId;
			specificDetail.metaData.clientTimeZone.value = Intl.DateTimeFormat().resolvedOptions().timeZone;
			}
			catch(err) {
			  console.log(err)
			}		
		
		var detail = specificDetail || self.detail;
		var dataSet = self.extractDataModel(detail);
		var actName = 'CREATE_DOCUMENT';
		var actParams = { docType: docType + 's', productName: productName, businessType: businessType };		
		connectService.exeAction({
			actionName: actName,
			actionParams: actParams,
			data: dataSet,
			requestURL: requestURL
		}).then(function (data) {
			deferred.resolve(data);
		});
		return deferred.promise;
	};

	/**
	 * Update document by document id
	 * @param requestURL
	 * @param docType
	 * @param docId
	 * @param specificDetail
	 */
	ListDetailCoreService.prototype.updateDocument = function(requestURL, docType, docId, specificDetail, businessType, productName) {
		var self = this;
		var deferred = $q.defer();
		if (!commonService.hasValueNotEmpty(docType)) {
			docType = self.name;
		}
		if (!commonService.hasValueNotEmpty(docId)) {
			docId = self.findElementInElement(specificDetail, ['id']);
		}
		if (!commonService.hasValueNotEmpty(docId)) {
			docId = self.findElementInDetail(['id']);
		}
		var detail = specificDetail || self.detail;
		var dataSet = self.extractDataModel(detail);
		var actName = 'OPERATE_DOCUMENT_BY_ID';
		var actParams = { docType: docType + 's', productName: productName, businessType: businessType, docId: docId };
		connectService.exeAction({
			actionName: actName,
			actionParams: actParams,
			data: dataSet,
			method: "PUT",
			requestURL: requestURL
		}).then(function(data) {
			self.getQuotesForQuoteSummaries(docType, data);
			deferred.resolve(data);
		});
		return  deferred.promise;
	};

	/**
	 * Get document by document id
	 * @param requestURL
	 * @param docType
	 * @param docId
	 * @param isDetail: Is assign into detail of moduleService
	 */
	ListDetailCoreService.prototype.getDocument = function(requestURL, docType, docId, isDetail, businessType, productName, requestBody,currFromDate,lineOfBusiness) {
		var self = this;
		loadingBarService.showLoadingBar();
		var deferred = self.$q.defer();
		if (!commonService.hasValueNotEmpty(docType)) {
			docType = self.name;
		}
		if (!commonService.hasValueNotEmpty(docId)) {
			docId = self.findElementInDetail(['id']);
		}
		
		isDetail = typeof isDetail === "undefined" ? true : isDetail;
		if(docType == 'policy'){
			var actionName = 'OPERATE_DOCUMENT_BY_ID_POLICY';
			var actionParams = { docType: docType + 's', productName: productName, businessType: businessType, docId: docId,currFromDate: currFromDate, lineOfBusiness: lineOfBusiness };
		}
		else{
			var actionName = 'OPERATE_DOCUMENT_BY_ID';
			var actionParams = { docType: docType + 's', productName: productName, businessType: businessType, docId: docId };
		}
		connectService.exeAction({
			actionName: actionName,
			actionParams: actionParams,
			requestURL: requestURL,
			data: requestBody
		}).then(function(data) {
			if (self.isSuccess(data)) {
				if (self.name === docType && isDetail) {
					self.detail = data;
					self.originalDetail = angular.copy(self.detail);
				}
				self.getQuotesForQuoteSummaries(docType, data);
			}
			loadingBarService.hideLoadingBar();
			deferred.resolve(data);
		});
		return  deferred.promise;
	};
	
	/**
	 * Get document by document id & Type
	 * @param requestURL
	 * @param docType
	 * @param docId
	 * @param type
	 * @param isDetail: Is assign into detail of moduleService
	 */
	ListDetailCoreService.prototype.getDocumentWithType = function(requestURL, docType, docId, type, isDetail, businessType, productName, requestBody) {
		var self = this;
		var deferred = self.$q.defer();
		if (!commonService.hasValueNotEmpty(docType)) {
			docType = self.name;
		}
		if (!commonService.hasValueNotEmpty(docId)) {
			docId = self.findElementInDetail(['id']);
		}
		
		isDetail = typeof isDetail === "undefined" ? true : isDetail;
		
		var actionName = 'OPERATE_DOCUMENT_BY_ID_AND_TYPE';
		var actionParams = { docType: docType + 's', productName: productName, businessType: businessType, docId: docId, type: type };
		connectService.exeAction({
			actionName: actionName,
			actionParams: actionParams,
			requestURL: requestURL,
			data: requestBody
		}).then(function(data) {
			if (self.isSuccess(data)) {
				if (self.name === docType && isDetail) {
					self.detail = data;
					self.originalDetail = angular.copy(self.detail);
				}
			}
			deferred.resolve(data);
		});
		return  deferred.promise;
	};
	

	/**
	 * get pdf attachment with flatten mode
	 * @author hnguyen294
	 * @param id {String} id of pdf in dms 
	 * @return document information of pdf doc
	 * */
	ListDetailCoreService.prototype.getPDFAttachmentSignedToView = function(id) {
		var self = this;
		var deferred = $q.defer();
		var actParams = {id: id};
		connectService.exeAction({
			actionName: "GET_PDF_ATTACHMENT_SIGNED_TO_VIEW",
			actionParams: actParams,
			method: "GET"
		}).then(function(data) {
			deferred.resolve(data);
		}, function (error) {
			$log.error(error);
		});
		return  deferred.promise;
	};
	
	
	/**
	 * Get document by document id
	 * @param requestURL
	 * @param docType
	 * @param docId	 
	 */
	ListDetailCoreService.prototype.getDocumentWithouUpdateDetail = function(requestURL, docType, docId, isDetail, businessType, productName) {
		var self = this;
		var deferred = self.$q.defer();		
		isDetail = typeof isDetail === "undefined" ? true : isDetail;		
		var actionName = 'OPERATE_DOCUMENT_BY_ID';
		var actionParams = { docType: docType + 's', productName: productName, businessType: businessType, docId: docId };
		connectService.exeAction({
			actionName: actionName,
			actionParams: actionParams,
			requestURL: requestURL
		}).then(function(data) {
			if (self.isSuccess(data)) {
				deferred.resolve(data);
			} else {
				deferred.resolve();
			}			
		});
		return  deferred.promise;
	};

	/**
	 * Delete document by docId
	 * @param requestURL
	 * @param docType
	 * @param docId
	 */
	ListDetailCoreService.prototype.deleteDocument = function(requestURL, docType, docId){
		var self = this;
		var deferred = self.$q.defer();
		if (!commonService.hasValueNotEmpty(docType)) {
			docType = self.name;
		}
		if (!commonService.hasValueNotEmpty(docId)) {
			docId = self.findElementInDetail(['id']);
		}
		var actionName = 'DELETE_DOCUMENT';
		var actionParams = {
			docType: docType + 's',
			docId: docId
		};
		connectService.exeAction({
			actionName: actionName,
			actionParams: actionParams,
			requestURL: requestURL,
			method: "DELETE",
			data : {}
		}).then(function(data){
			deferred.resolve(data);
		});
		return  deferred.promise;
	};
	
	// clone this function from igi project
	ListDetailCoreService.prototype.signDocumentNew = function(scope, moduleName, caseId, refDocId, businessType, productName, pdfName, pdfContentAsBase64String, docType) {
		 var self = this;
		 var isRunOnTablet = self.isRunOnTablet();
		 var isMobileApp = false;
		 
		// build param to call api
		 var accessKey = localStorage.getItem("access_token");
		 var userRole = scope.currentRole;
		 var resultURL = apiServerPath + "/" + scope.moduleService.initialRequestURL("SIGN_RESULT_DOCUMENT_V4",[businessType, productName, caseId, refDocId, isMobileApp, accessKey, userRole]);
		 var requestBody = {"docType": docType,"pdfContent":pdfContentAsBase64String, "pdfFileName": pdfName,"resultURL":resultURL};
		
        var actonParams = {businessType: businessType, productName: productName, caseId : caseId, pdfID: refDocId, isRunOnTablet: isRunOnTablet, isMobileApp: isMobileApp};
        var deferred = $q.defer();
			connectService.exeAction({
			actionName: "SIGN_PDF_DOCUMENT_V4",
	    	actionParams: actonParams,
	    	data: JSON.stringify(requestBody)
	    }).then(function(data){
			deferred.resolve(data);	
	    });

		 return  deferred.promise;
	 }
	// end

	/**
	 * Do operation in document by data model: refresh, compute, validate
	 * @param requestURL
	 * @param docType
	 * @param action
	 * @param specificDetail
	 */
	ListDetailCoreService.prototype.operateDocument = function(requestURL, docType, action, specificDetail, businessType, productName,acceptaction) {
		var self = this;
		loadingBarService.showLoadingBar();
		var deferred = self.$q.defer();
		if (!commonService.hasValueNotEmpty(docType)) {
			docType = self.name;
		}
		var doctypeCan = docType;
		var detail = specificDetail || self.detail;
		var dataSet = self.extractDataModel(detail);
		var actionName = 'OPERATE_DOCUMENT_BY_DETAIL';
		var actionParams = { docType: docType + 's', productName: productName, businessType: businessType, action: action,arrayacceptAction:acceptaction};
		connectService.exeAction({
			actionName: actionName,
			actionParams: actionParams,
			requestURL: requestURL,
			data: dataSet
		}).then(function(data){
		   
			if (action === commonService.CONSTANTS.ACTION.REFRESH ||
				action === commonService.CONSTANTS.ACTION.VALIDATE) {
			
				if(doctypeCan === 'quotation' && action === commonService.CONSTANTS.ACTION.VALIDATE){
					
					///specific for can product
					detail.vesselNameConveyance.value = data.vesselNameConveyance.value;
				}
				
				var metaModel = data || {};
				self.mergeMetaModel2UIModel(metaModel, detail);
				if(action === commonService.CONSTANTS.ACTION.VALIDATE){
					self.updateDocumentStatus(metaModel, detail);
				}
			}
			else if (action === commonService.CONSTANTS.ACTION.COMPUTE) {
				if (self.isSuccess(data)) {
					if (commonService.hasValueNotEmpty(specificDetail)) {
						self.convertDataModel2UiModel(data, specificDetail);
					}else{
						self.convertDataModel2UiModel(data, self.detail);
						self.detail = angular.copy(data);
					}
				}
				detail = data;
			}
			loadingBarService.hideLoadingBar();
			deferred.resolve(detail);
		});
		return  deferred.promise;
	};
	
	/**
	 * update Business Status (after callValidate, if no errorCode, business status = COMPLETE -> need to update into detail
	 * @param: metaModel
	 * @param detail
	 * @return detail has updated business status
	 */
	ListDetailCoreService.prototype.updateDocumentStatus = function(metaModel, detail){
		var self = this;
		if(commonService.hasValueNotEmpty(metaModel)){	
			if(localStorage.currentState != "account-detail"){
				self.findElementInElement(detail, ['documentStatus']).value = self.findElementInElement(metaModel, ['documentStatus']).value;
			}
			else{
				detail.documentError = self.findElementInElement(metaModel, ['documentError']);
			}
		}
	}
	/**
	 * @author tlai20
	 * @param requestURl {String} backend
	 * @param docId Id of doc
	 * @param action of doctype it is define in constant config 
	 */
	ListDetailCoreService.prototype.operateDocumentById = function(requestURL, docId, action) {
		var self = this;
		var deferred = self.$q.defer();
		var actionName = 'OPERATE_DOCUMENT_BY_ID';
		var docType = self.name;
		var dataSet = self.extractDataModel(self.detail); 
		var actionParams = {
			docType: docType + 's',
			docId: docId,
			action: action
		};
		connectService.exeAction({
			actionName: actionName,
			actionParams: actionParams,
			requestURL: requestURL,
			data: dataSet
		}).then(function(data) {
			deferred.resolve(data);
		});
		return deferred.promise;
	};
	
	/**
	 * @author tlai20
	 * @param requestURl {String}
	 * @param docId Id
	 * @param action pickup, return case for auditor shared pool 
	 * method POST, body {} 
	 */
	ListDetailCoreService.prototype.searchDocumentById = function(requestURL, docId, action) {
		var self = this;
		var deferred = self.$q.defer();
		var actionName = 'OPERATE_DOCUMENT_BY_ID';
		var docType = self.name;
		var actionParams = {
			docType: docType + 's',
			docId: docId,
			action: action
		};
		connectService.exeAction({
			actionName: actionName,
			actionParams: actionParams,
			requestURL: requestURL,
			data: {}
		}).then(function(data) {
			deferred.resolve(data);
		});
		return deferred.promise;
	};
	
	ListDetailCoreService.prototype.pickUpOrReturn = function(requestURL, docId, action, role) {
		var self = this;
		var deferred = self.$q.defer();
		var actionName = 'PICKUP_RETURN';
		var docType = self.name;
		var actionParams = {
			docType: docType + 's',
			docId: docId,
			action: action,
			role: role
		};
		connectService.exeAction({
			actionName: actionName,
			actionParams: actionParams,
			requestURL: requestURL,
			data: {}
		}).then(function(data) {
			deferred.resolve(data);
		});
		return deferred.promise;
	};
	
	/**
	 * Search document
	 * @param requestURL
	 * @param docType
	 */
	ListDetailCoreService.prototype.searchDocumentFull = function(requestURL, docType, searchDataSet, searchParams) {
		var self = this;
		var deferred = $q.defer();
		if (!commonService.hasValueNotEmpty(docType)) {
			docType = self.name;
		}
		var dataSet = searchDataSet || [];
		var actName = 'SEARCH_DOCUMENT_FULL';
		var actParams = {
			docType: docType + 's',
			page: searchParams.page,
			size: searchParams.size
		};
		if (commonService.hasValueNotEmpty(searchParams.sort)) {
			actParams.sort = searchParams.sort;
		}
		connectService.exeAction({
			actionName: actName,
			actionParams: actParams,
			data: dataSet,
			requestURL: requestURL
		}).then(function(data) {
			deferred.resolve(data);
		});
		return deferred.promise;
	};
	
	/**
	 * Search document
	 * @param requestURL
	 * @param docType
	 */
	ListDetailCoreService.prototype.searchDocument = function(requestURL, docType, searchDataSet, searchParams, businessLine, productName) {
		var self = this;
		var deferred = $q.defer();
		if (!commonService.hasValueNotEmpty(docType)) {
			docType = self.name;
		}
		if(docType === 'managerreview'|| docType === 'underwriting'){
			businessLine = null;
			productName  = null;
			
		}
		var dataSet = searchDataSet || [];
		var actName = 'SEARCH_DOCUMENT';
		var actParams = {
			docType: docType + 's',
			page: searchParams.page,
			size: searchParams.size,
			businessType: businessLine,
			productName: productName
		};
		if (commonService.hasValueNotEmpty(searchParams.sort)) {
			actParams.sort = searchParams.sort;
		}
		connectService.exeAction({
			actionName: actName,
			actionParams: actParams,
			data: dataSet,
			requestURL: requestURL
		}).then(function(data) {
			deferred.resolve(data);
		});
		return deferred.promise;
	};
	
	ListDetailCoreService.prototype.getFullAccount = function(docType) {
		var self = this;
		var deferred = $q.defer();
		if (!commonService.hasValueNotEmpty(docType)) {
			docType = self.name;
		}
		var actName = 'GET_FULL_ACCOUNT';
		var actParams = {
			docType: docType + 's'
		};
		connectService.exeAction({
			actionName: actName,
			actionParams: actParams
		}).then(function(data) {
			deferred.resolve(data);
		});
		return deferred.promise;
	};
	
	/**
	 * @author tlai20
	 * method POST, body {} 
	 */
	ListDetailCoreService.prototype.searchDocumentByDocName = function(requestURL, docType, businessType, productName, docName, version) {
		var self = this;
		var deferred = self.$q.defer();
		var actionName = 'FIND_BY_DOCNAME';		
		version = version || 0;
		var actionParams = {
			docType: docType + 's',
			businessType: businessType,
			productName: productName,
			docName: docName,
			version: version
		};
		connectService.exeAction({
			actionName: actionName,
			actionParams: actionParams,
			requestURL: requestURL			
		}).then(function(data) {
			if (self.isSuccess(data)) {			
				deferred.resolve(data);
			}
		});
		return deferred.promise;
	};
//	ListDetailCoreService.prototype.deleteDocumentByDocName = function(requestURL, docType, businessType, productName, docId) {
//		var self = this;
//		var deferred = self.$q.defer();
//		var actionName = 'DELETE_BY_DOCNAME';		
//		var actionParams = {
//			docType: docType + 's',
//			businessType: businessType,
//			productName: productName,
//			docId: docId
//		};
//		connectService.exeAction({
//			actionName: actionName,
//			actionParams: actionParams,
//			method: "DELETE",
//			requestURL: requestURL			
//		}).then(function(data) {
//			if (self.isSuccess(data)) {			
//				deferred.resolve(data);
//			}
//		});
//		return deferred.promise;
//	};
	
	/**
	 * @author tthai21
	 * method POST, body {} 
	 */
	ListDetailCoreService.prototype.cloneByDocName = function(requestURL, docType, businessType, productName, docName) {
		var self = this;
		var deferred = self.$q.defer();
		var actionName = 'CLONE_BY_DOCTYPE';		
		var actionParams = {
			docType: docType + 's',
			businessType: businessType,
			productName: productName,
			docName: docName			
		};
		connectService.exeAction({
			actionName: actionName,
			actionParams: actionParams,
			requestURL: requestURL,
			method: "PUT"
		}).then(function(data) {
			if (self.isSuccess(data)) {			
				deferred.resolve(data);
			}
		});
		return deferred.promise;
	};
	
	/**
	 * Import FNA into case
	 */
	ListDetailCoreService.prototype.importFNAIntoCase = function(businessType, productName, fnaDocName) {
		var self = this;
		var deferred = self.$q.defer();
		var actionName = 'IMPORT_FNA_INTO_CASE';
		var docType = self.name;
		var dataSet = self.extractDataModel(self.detail);
		var actionParams = {
			docType: docType + 's',
			businessType: businessType,
			productName: productName,
			fnaDocName: fnaDocName
		};
		connectService.exeAction({
			actionName: actionName,
			actionParams: actionParams,
			data: dataSet,
			method: "PUT"
		}).then(function(data) {
			if (self.isSuccess(data)) {
				self.convertDataModel2UiModel(data, self.detail);
				self.detail = angular.copy(data);
				deferred.resolve(self.detail);
			}
		});
		return deferred.promise;
	};
	
	/**
	 * Get document total records
	 * @param requestURL
	 * @param docType
	 */
	ListDetailCoreService.prototype.getDocumentTotalRecords = function(requestURL, docType, searchDataSet, businessLine, productName) {
		var self = this;
		var deferred = $q.defer();
		if (!commonService.hasValueNotEmpty(docType)) {
			docType = self.name;
		}
		if(docType === 'managerreview'|| docType === 'underwriting'){
			businessLine = null;
			productName  = null;
			
		}
		var dataSet = searchDataSet || [];
		var actName = 'GET_DOCUMENT_TOTAL_RECORDS';
		var actParams = { docType: docType + 's', businessType: businessLine, productName: productName };
		connectService.exeAction({
			actionName: actName,
			actionParams: actParams,
			data: dataSet,
			requestURL: requestURL
		}).then(function(data) {
			deferred.resolve(data);
		});
		return deferred.promise;
	};	

	/**
	 * Get all options list for dropdown box.
	 * The response data depends on which list specified on 'list' parameter.
	 * @param  requestURL
	 * @param  listDropdown the string declare list of specific dropdown name. Ex: "titleCode,genderCode"
	 */
	ListDetailCoreService.prototype.getOptionsList = function(requestURL, listDropdown) {
		var self = this;
		var deferred = self.$q.defer();
		connectService.exeAction({
			actionName: "DOCUMENT_LAZY_CHOICELIST",
			actionParams: [listDropdown],
			requestURL: requestURL
		}).then(function(data){
			self.lazyChoiceList = data;
			deferred.resolve(data);
		});
		return  deferred.promise;
	};

	/**
	 * Nov-14-2016
	 * @author  dnguyen98
	 * Upload a file and save it in system
	 * @param  {String} 	requestURL	to define to backend
	 * @param  {String} docType
	 * @param  {File} 	attachment	file to upload
	 * @param  {Object} 	moreParams	to send to backend
	 * @return {Object} 	data	Angular Promise, include data information if upload success
	 */
	ListDetailCoreService.prototype.uploadAttachment = function(requestURL, docType, attachment, moreParams) {
		var self = this;
		var deferred = self.$q.defer();
		if (!commonService.hasValueNotEmpty(docType)) {
			docType = self.name;
		}
		var actName = 'UPLOAD_ATTACHMENT';
		var actParams = [ docType + 's' ];
		connectService.exeAction({
			actionName: actName,
			actionParams: actParams,
			requestURL: requestURL,
			file: attachment,
			moreParams: moreParams
		}).then(function(data){
			deferred.resolve(data);
		});
		return  deferred.promise;
	};

	ListDetailCoreService.prototype.isRunOnTablet = function() {
		var isRunOnTablet = (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
		|| /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4)));
		return isRunOnTablet;
	};

	ListDetailCoreService.prototype.isElementValid = function isElementValid (element){
		var self = this;
		var result = true;
		if (typeof(element) !== 'string') {
			// check mandatory field when element is leaf node
			if (commonService.hasValueNotEmpty(element.meta)) {
				if (element.meta.hasOwnProperty('errorCode') && commonService.hasValueNotEmpty(element.meta['errorCode'])) {
                    return false;
				}
				if (element.value && typeof(element.value) === 'object') {
					for (var prop in element.value) {
						if (element.value.hasOwnProperty(prop)) {
							if (typeof(element.value[prop]) === 'object' && element.value[prop] !== null) {
								result = self.isElementValid(element.value[prop]);
								if (!result) {
									break;
								}
							}
						}
					}
                } else { // element.value == null
                    if (commonService.hasValueNotEmpty(element.meta['errorCode'])) {
                        result = false;
                    } else if (element.meta['mandatory'] === 'true' && !commonService.hasValueNotEmpty(element.value)) {
                        result = false;
                    }
				}
			}
			// loop to leaf node
			else {
				for (var prop in element) {
					if (element.hasOwnProperty(prop) && prop !== 'arrayDefault' && prop !== 'className') {
						if (typeof(element[prop]) === 'object' && element[prop] !== null) {
							result = self.isElementValid(element[prop]);
							if (!result) {
								break;
							}
						}
					}
				}
			}
		}
		return result;
	};

	ListDetailCoreService.prototype.initialRequestURL = function(requestName, requestParam){
		var requestURL = commonService.getUrl(commonService.urlMap_PrivateAPI[requestName], requestParam);
		return requestURL;
	};
	
	ListDetailCoreService.prototype.getCurrentDate = function(requestURL) {
		var self = this;
		var deferred = self.$q.defer();
		var actionName = 'GET_SYSTEM_DATE';
		var actionParams = [
			self.name + 's'
		];
		connectService.exeAction({
			actionName: actionName,
			actionParams: actionParams,
			requestURL:requestURL
		}).then(function(data) {
			deferred.resolve(data.time);
		});
		
		return deferred.promise;
	};
	ListDetailCoreService.prototype.getCurrentDateAndTime = function(requestURL) {
		var self = this;
		var deferred = self.$q.defer();
		var actionName = 'GET_SYSTEM_DATE';
		var actionParams = [self.name + 's'];
		connectService.exeAction({
			actionName: actionName,
			actionParams: actionParams,
			requestURL: requestURL
		}).then(function(data) {
			deferred.resolve(data);
		});

		return deferred.promise;
	};
	
	/**
	 * This function is used for specific the map list json returned from runtime V3
	 */
	IposDocService.prototype.findValueInMapListByKey = function(data, key) {
        if (data != undefined) {

            //new structure
            if(data["ipos-container:map-list"] == undefined)
                return data[key];

           var items = this.findJsonPathInItem(data, '$..ipos-container:pair');    
            
            for (var i in items) {
                if (items[i]['@key'] == key) {
                    return items[i]['@value'];
                }
            }
        }
        
        return undefined;
    };
	

	/*Action Convert Object to Array and add item*/
	ListDetailCoreService.prototype.convertToArray = function(data) {
		if(data !== undefined && data.length === undefined){
			data = [ data ];
		}
		return data;
	};
	/*This is to call dedupcheck at quick quotation*/
	ListDetailCoreService.prototype.DeDupCheckLifeInsured = function(docType,businessLine,productName,specificDetail) {
		var self = this;
		var deferred = self.$q.defer();
		var detail = specificDetail || self.detail;
		var dataSet = self.extractDataModel(detail);
		var actionName = 'LIFE_INSURED_CHECK_EXISTING';
		var actionParams = {
			docType: docType + "s",
			businessType: businessLine,
		    productName: productName,		
		};
		connectService.exeAction({
			actionName: actionName,
			actionParams: actionParams,
			data: dataSet
		}).then(function(data) {		
				deferred.resolve(data);
		});
		return deferred.promise;
	};
	/**
	 * get Commission From iHub
	 */
	ListDetailCoreService.prototype.getCommissionFromBackend = function(productCode) {
		var self = this;
		var deferred = self.$q.defer();
		var actionName = 'GET_COMMISSION';
		var actionParams = {
			productCode: productCode,			
		};
		connectService.exeAction({
			actionName: actionName,
			actionParams: actionParams			
		}).then(function(data) {	
			if (self.isSuccess(data)) {			
				deferred.resolve(data);
			}
		});
		return deferred.promise;
	};
	
	/**
	 * Compute tag
	 */
	ListDetailCoreService.prototype.computeElement = function(element, specificDetail, docType) {
		var self = this;
		var deferred = self.$q.defer();
		var actionName = 'COMPUTE_BY_TAG_NAME';
		if (!commonService.hasValueNotEmpty(docType)) {
			docType = self.name;
		}
		var detail = specificDetail || self.detail;
		var dataSet = self.extractDataModel(detail);
		var arrayVPMS = commonService.CONSTANTS.VPMS_MAPPING_FIELD;
		 if ($.isArray(element)){
			 var tag = [];
			 var tagName="";
			 for (var i=0; i<element.length; i++){
				 tag.push(arrayVPMS[element[i]]); 
			 }
			 tagName = tag.toString();
		 }		
		var actionParams = {
				docType: docType + "s",
				tagName: tagName,
		};	
		connectService.exeAction({
			actionName: actionName,
			actionParams: actionParams,
			data: dataSet
	     }).then(function(data){
	    	 if(self.isSuccess(data)){
	    		 self.convertDataModel2UiModel(data, self.detail);
				 self.detail = angular.copy(data);
	    		 deferred.resolve(data);
			 }		 	 
	     });
		
		return deferred.promise;
	}; 
	/**
	 * Compute by tag name
	 */
	ListDetailCoreService.prototype.computeByTagName = function(tagsType, tagName, element, tagParent, tagIndex, specificDetail, docType) {
		var self = this;
		var deferred = self.$q.defer();
		var actionName = 'OPERATE_DOCUMENT_BY_TAG_NAME';
		if (!commonService.hasValueNotEmpty(docType)) {
			docType = self.name;
		}
		var detail = specificDetail || self.detail;
		var dataSet = self.extractDataModel(detail);
		var arrayVPMS = commonService.CONSTANTS.VPMS_MAPPING_TAG_INCLUDE;
		if ($.isArray(element)){
			var tag = [];
			var tags="";
			for (var i=0; i<element.length; i++){
				//tag.push(arrayVPMS[element[i]]); 
				tag.push(element[i]);
			}
			tags = tag.toString();
		}		
		var actionParams = {
				docType: docType + "s",
				businessType: self.businessLine,
			    productName: self.productName,
				action : commonService.CONSTANTS.ACTION.COMPUTE,
				tagsType: tagsType,
				tagName : tagName,
				tagsInclude: tags,
				tagParent: tagParent,
				tagIndex: tagIndex
		};	
		connectService.exeAction({
			actionName: actionName,
			actionParams: actionParams,
			data: dataSet
		}).then(function(data){
			if(self.isSuccess(data)){
				self.convertDataModel2UiModel(data, self.detail);
				self.detail = angular.copy(data);
				deferred.resolve(data);
			}		 	 
		});
		
		return deferred.promise;
	}; 
	/**
	 * Validate by tag name
	 */
	ListDetailCoreService.prototype.validateByTagName = function(tagsType, tagName, element, tagParent, tagIndex, specificDetail, docType) {
		var self = this;
		var deferred = self.$q.defer();
		var actionName = 'OPERATE_DOCUMENT_BY_TAG_NAME';
		if (!commonService.hasValueNotEmpty(docType)) {
			docType = self.name;
		}
		var detail = specificDetail || self.detail;
		var dataSet = self.extractDataModel(detail);
		var arrayVPMS = commonService.CONSTANTS.VPMS_MAPPING_FIELD;
		if ($.isArray(element)){
			var tag = [];
			var tags="";
			for (var i=0; i<element.length; i++){
				// tag.push(arrayVPMS[element[i]]); 
				tag.push(element[i]); 
			}
			tags = tag.toString();
		}		
		var actionParams = {
				docType: docType + "s",
				businessType: self.businessLine,
			    productName: self.productName,
				action : commonService.CONSTANTS.ACTION.VALIDATE,
				tagName: tagName,
				tagsInclude: tags,
				tagParent: tagParent,
				tagIndex: tagIndex
		};	
		connectService.exeAction({
			actionName: actionName,
			actionParams: actionParams,
			data: dataSet
		}).then(function(data){
			if(self.isSuccess(data)){
				self.mergeMetaModel2UIModel(data, detail);
				deferred.resolve(data);
			}		 	 
		});
		
		return deferred.promise;
	}; 
	
	/**
	 * @author hle71
	 * @param requestURl {String} backend
	 * @param docType Type of doc
	 * @param docId Id of doc
	 * @param businessType type of doc
	 * @param productName name of doc
	 * @param action of doctype it is define in constant config 
	 */
	ListDetailCoreService.prototype.operateDocumentByNameBusinessProductAction = function(requestURL, docType, docId, data, businessType, productName, action) {
		var self = this;
		var deferred = self.$q.defer();
		var actionName = 'OPERATE_DOCUMENT_BY_ID';
		var docType = docType || self.name;
		var body = data || self.detail;
		var dataSet = self.extractDataModel(data); 
		var actionParams = {
			docType: docType + 's',
			docId: docId,
			action: action,
			businessType: businessType,
			productName: productName
		};
		connectService.exeAction({
			actionName: actionName,
			actionParams: actionParams,
			requestURL: requestURL,
			data: dataSet
		}).then(function(data) {
			deferred.resolve(data);
		});
		return deferred.promise;
	};
	
	/**
	 * hle71 - Load quotation data to fill quotation summaries
	 */
	ListDetailCoreService.prototype.getQuotesForQuoteSummaries = function(docType, businessCaseDataModel) {
		if (commonService.CONSTANTS.MODULE_NAME.SALECASE !== docType) {
			return;
		}
		var self = this;
		angular.forEach(businessCaseDataModel.quotations, function(item){
			if (item.refId) {
				self.getDocumentWithouUpdateDetail(undefined, item.refType, item.refId, undefined, item.refBusinessType, item.refProductName).then(function(quotation){
					item.summary = quotation;
				});
			}
		});
		
	};
	
	
	return {
		IposDocService: IposDocService,
		ListDetailCoreService: ListDetailCoreService
	};

}]);
