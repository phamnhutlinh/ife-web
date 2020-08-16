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

/* Filters */
var filterUIModule = angular.module('filterUIModule',['commonModule', 'translateUIModule'])
.filter('i18nText', ['appService', function(appService) {
  return function(code, params) {
    return appService.getI18NText(code, params);
  };
}])

.filter('dateFormat', ['appService', 'commonService', function(appService, commonService) {
	return function(dateStr, originalFormat, viewFormat) {
		if(!commonService.hasValueNotEmpty(dateStr) || !commonService.hasValueNotEmpty(originalFormat)) return dateStr;
		if (appService.localeContext == null) return "";
		var viewDateFormat = "";
		if(!commonService.hasValue(viewFormat)) viewFormat = "short";
		if(viewFormat == "short") viewDateFormat = appService.localeContext.shortDateFormat;
		else if(viewFormat == "medium") viewDateFormat = appService.localeContext.mediumDateFormat;
		else if(viewFormat == "full") viewDateFormat = appService.localeContext.fullDateFormat;
		else if(viewFormat == "mediumDateTime") viewDateFormat = appService.localeContext.mediumDateFormat;
		else viewDateFormat = appService.localeContext.shortDateFormat;
		var date = null;
		if (!isNaN(dateStr))
		      date = new Date(Number(dateStr));
		else
			date = $.datepicker.parseDate(originalFormat, dateStr);
		viewDateFormat = commonService.convertToJquiDateFormat(viewDateFormat);
		var formatStr = $.datepicker.formatDate(viewDateFormat, date);
		if(viewFormat == "mediumDateTime"){
			var date_obj_hours = date.getHours();
			var date_obj_mins = date.getMinutes();
			if (date_obj_mins < 10) { date_obj_mins = "0" + date_obj_mins; }
			formatStr += " "+date_obj_hours+":"+date_obj_mins;
		}
		return formatStr;
	};
}])
.filter('numberformat', ['appService', function (appService) {
	return function(number, fractionSize) {
		var pattern = { // Decimal Pattern
	            minInt: 1,
	            minFrac: 0,
	            maxFrac: 3,
	            posPre: '',
	            posSuf: '',
	            negPre: '-',
	            negSuf: '',
	            gSize: 3,
	            lgSize: 3
	          };
	    return formatNumber(number, pattern, appService.localeContext.numberGroupSep, appService.localeContext.numberDecimalSep,
	      fractionSize);
	  };

	  /** Copy formatNumber from angular because this api is not public */
//	  var DECIMAL_SEP = '.';
	  function formatNumber(number, pattern, groupSep, decimalSep, fractionSize) {
	    if (isNaN(number) || !isFinite(number)) return '';

	    var isNegative = number < 0;
	    number = Math.abs(number);
	    var numStr = number + '',
	        formatedText = '',
	        parts = [];

	    if (numStr.indexOf('e') !== -1) {
	      formatedText = numStr;
	    } else {
	      var fractionLen = (numStr.split('.')[1] || '').length;

	      // determine fractionSize if it is not specified
	      if (angular.isUndefined(fractionSize)) {
	        fractionSize = Math.min(Math.max(pattern.minFrac, fractionLen), pattern.maxFrac);
	      }

	      var pow = Math.pow(10, fractionSize);
	      number = Math.round(number * pow) / pow;
	      var fraction = ('' + number).split('.');
	      var whole = fraction[0];
	      fraction = fraction[1] || '';

	      var pos = 0,
	          lgroup = pattern.lgSize,
	          group = pattern.gSize;

	      if (whole.length >= (lgroup + group)) {
	        pos = whole.length - lgroup;
	        for (var i = 0; i < pos; i++) {
	          if ((pos - i)%group === 0 && i !== 0) {
	            formatedText += groupSep;
	          }
	          formatedText += whole.charAt(i);
	        }
	      }

	      for (i = pos; i < whole.length; i++) {
	        if ((whole.length - i)%lgroup === 0 && i !== 0) {
	          formatedText += groupSep;
	        }
	        formatedText += whole.charAt(i);
	      }

	      // format fraction part.
	      while(fraction.length < fractionSize) {
	        fraction += '0';
	      }

	      if (fractionSize) formatedText += decimalSep + fraction.substr(0, fractionSize);
	    }

	    parts.push(isNegative ? pattern.negPre : pattern.posPre);
	    parts.push(formatedText);
	    parts.push(isNegative ? pattern.negSuf : pattern.posSuf);
	    return parts.join('');
	  }
}])

.filter('momentDate', ['commonService', function(commonService) {
      return function(dateStr) {
            if(!commonService.hasValueNotEmpty(dateStr)) return dateStr;
            var defaultFormat = "MMM DD, YYYY";
            var viewDate = null;
            if (!isNaN(dateStr))
                  viewDate = moment(new Date(Number(dateStr)));
            else
                  viewDate = moment(dateStr, 'YYYY-MM-DD h:mm:ss');
            var result = "";
            var now = moment();
            var diff = now.diff(viewDate, "months", true);
            if(diff > 2) result = viewDate.format(defaultFormat);
            else result = viewDate.fromNow();
            return result;
      };
}])
.filter('handlyRole',function(){
	 return function(arr){
		 var arrContent=[];
		 for(var i=0;i<arr.length;i++){
			 if(arr[i].role!="PR"){
				 arrContent.push(arr[i]);
			 }
		 }
		 return arrContent;
	 }
})
.filter('ageOnNextBirthday', function(){
	// use this filter to get Age_Nearest_Birthdate from an ipos's dateString, eg: 2009-02-28
	return function(dateString) {
		var today = new Date();
		//workaround: yyyy-mm-dd (ISO 8601) date format is not supported in Safari and IE
		var birthDateArr = dateString.split("-");
		var birthDate = new Date(birthDateArr[0], birthDateArr[1]-1, birthDateArr[2]);

		if (today.getMonth() == birthDate.getMonth()){
			if (today.getDate() < birthDate.getDate()){
				return today.getFullYear() - birthDate.getFullYear();
			}
			return today.getFullYear() - birthDate.getFullYear() + 1;
		} else {
			if (today.getMonth() < birthDate.getMonth()){
				return today.getFullYear() - birthDate.getFullYear();
			}
			return today.getFullYear() - birthDate.getFullYear() + 1;
		}
	};
})
.filter('covertString',function(){
	return function(item,value){
		var arr=[];
		for(var i=0;i<item.length;i++){
			if(value=="Mt2"){
				arr.push(item[i]);
			}
			else{
				if(item[i].name=="Quotation"){
					item[i].name="Description Quotation";
				}
				arr.push(item[i]);
			}
		}
		console.log(arr);
		return arr;
	}
})
.filter('alphabeticalOrder', ['$filter', 'quotationCoreService', function($filter, quotationCoreService){
	// use to filter dropdown text in alphabetical order
	return function(arr, fieldName, reverse) {
		if (!quotationCoreService.commonService.hasValue(reverse)) reverse = false;
		// products list
		if (quotationCoreService.commonService.hasValue(arr)
				&& !quotationCoreService.commonService.hasValue(arr[0][fieldName])
				&& quotationCoreService.commonService.hasValue(arr[0].uid)){
			var transformedArr = new Array();
			for (var i = 0; i < arr.length; i++){
				var textValue = quotationCoreService.findPropertyInElement(arr[i], null, fieldName).value;
				transformedArr.push({uid: arr[i].uid, text: textValue});
			}
			return $filter('orderBy')(transformedArr, 'text', reverse);
		}
		// usual enums
		return $filter('orderBy')(arr, fieldName, reverse);
	};
}])

.filter('filterByGroup', ['commonService', function(commonService){
	return function(array, groupKey) {
		var result = [];
		if (!commonService.hasValueNotEmpty(groupKey) || !commonService.hasValueNotEmpty(array)){
			return result;
		}
		for (var i = 0; i < array.length; i++){
			if (Array.isArray(array[i].group) && array[i].group.indexOf(groupKey) !== -1){
				result.push(array[i]);
			}
		}
		return result;
	};
}])

.filter('sortPriority', ['commonService', function(commonService){
	return function(array) {
		var result = [];
		if (!commonService.hasValueNotEmpty(array)){
			return result;
		}
	    for (var i = 0; i < array.length; i++){
	    	if (array[i].priority === 'HIGH'){
	    		result.push(array[i]);
	    	}
	    }
	    for (var j = 0; j < array.length; j++){
	    	if (array[j].priority === 'MEDIUM'){
	    		result.push(array[j]);
	    	}
	    }
	    for (var k = 0; k < array.length; k++){
	    	if (array[k].priority === 'LOW'){
	    		result.push(array[k]);
	    	}
	    }
		return result;
	};
}])

.filter('formatFNAOutput', ['commonService', function(commonService) {
      return function(number) {
		var result = "0";
		if(number == '-' || number == '_'){
			result = number;
		} else if(commonService.hasValueNotEmpty(number)){
			var test= number.replace(/\s+/g, '');
			var temp = parseFloat(test.replace(/,/g, ''));
			if(temp < 0) {
				result = "(" + commonService.addCommas(temp*-1) + ")";
			} else {
				result = commonService.addCommas(temp);
			}
		}
		return result;
      };
}])
.filter('daysFilter', function() {
    return function(dayString) {
        if (dayString != undefined) {
            var date = dayString.split('-');
            var year = date[0];
            var month = date[1];
            var day = date[2];
            return day + "/" + month + "/" + year;
        } else {

        }
    };
})
.filter('expiryDaysFilter', function() {
    return function(dayString) {
        if (dayString != undefined) {
            var date = dayString.split('-');
            var year = date[0];
            var month = date[1] - 1;
            var day = date[2];
            var d = new Date(year, month, day);
            d.setDate(d.getDate() + 30);
            var rdateString = d.toISOString().slice(0, 10);
            var rdate = rdateString.split('-');
            var ryear = rdate[0];
            var rmonth = rdate[1];
            var rday = rdate[2];
            return rday + "/" + rmonth + "/" + ryear;
        } else {

        }
    };
})

.filter('datetimeFilter', function() {
	var existingDateList = ["YYYY-MM-DD hh-mm-ss","YYYY-MM-DD-hh-mm-ss", "YYYY-MM-DD", "DD-MM-YYYY hh-mm-ss", "DD-MM-YYYY-hh-mm-ss", "DD-MM-YYYY", "DD-MMM-YYYY", "DD/MM/YYYY"];
    return function(data,format){
    	if(data==undefined || data=="" || format==undefined || data==null)
			return;
    	if(!moment(data,existingDateList).isValid()){
    		data = moment.unix(data/1000);
  	  	}
		return moment(data,existingDateList).format(format);
    };
})
.filter('addDaysFilter', function() {
    return function(dayString) {
    	if(dayString.slice(2,3)=='-'){
    		var day = dayString.substring(0, 2);
	        var month = dayString.substring(3, 5);
	        var year = dayString.substring(6, 10);
    	} else {
    		var year = dayString.substring(0, 4);
            var month = dayString.substring(5, 7);
            var day = dayString.substring(8, 10);
    	}
        var d = new Date();
        d.setFullYear(year, month, day);
        var result = new Date();
        result.setDate(d.getDate() + 30);
        var dateString = result.toISOString().slice(0, 10);
        return dateString;
    };
})

.filter('dateFilter', function() {
	return function(dayString) {
        if (dayString != undefined && dayString != "") {
        	dayString = dayString.toString();
        	var isDate = ((new Date(dayString)).toString() !== "Invalid Date") ? true : false;
        	if(isDate){
        		var date = dayString.split('-');
                var year = date[0];
                var month = date[1];
                var day = date[2];
                return day + "/" + month + "/" + year;
        	} else{
        		return dayString;
        	}
        } else {

        }
    };
})
.filter('dateFilter2', function() {
    return function(dayString) {
        if (dayString != undefined && dayString != "") {
            var year = dayString.substr(0,4);
            var month = dayString.substr(4,2);
            var day = dayString.substr(6);
            return day + "/" + month + "/" + year;
        } else {

        }
    };
})

.filter('trimtext', function () {
    return function (value, wordwise, max,tail) {
        if (!value) return '';
        max = parseInt(max, 10);
        if (!max) return value;
        if (value.length <= max) return value;

        value = value.toString().substr(0, max);
        if (wordwise) {
            var lastspace = value.toString().lastIndexOf(' ');
            if (lastspace != -1) {
                value = value.toString().substr(0, lastspace);
            }
        }

        return value + (tail);
    };
})

.filter('groupByLevel', ['$timeout', function ($timeout) {
	return function (data, key) {
		if (!key) return data;
		var outputPropertyName = '__groupBy__' + key;
		if(!data[outputPropertyName]){
			var result = {};
			for (var i=0;i<data.length;i++) {
				if (!result[data[i][key]])
					result[data[i][key]]=[];
				result[data[i][key]].push(data[i]);
			}
			Object.defineProperty(data, outputPropertyName, {enumerable:false, configurable:true, writable: false, value:result});
			$timeout(function(){delete data[outputPropertyName];},0,false);
		}
		var arrayOutput = [];
		var inputObject = data[outputPropertyName];
		for (key in inputObject) {
			if (inputObject.hasOwnProperty(key)) {
				arrayOutput.push({
					key: parseInt(key),
					value: inputObject[key]
				})
			}
		}
		return arrayOutput;
	};
}])

.filter('getFileType', function () {
    return function (fileName) {
    	var fileExtension;
       if (!fileName) return '';
       else{
    	   fileExtension = fileName.substr((fileName.lastIndexOf('.') + 1));
       }
       return fileExtension;
    };
})

.filter('uniqueForSearch', function() {
    return function(input, key) {
        var unique = {};
        var uniqueList = [];
        for(var i = 0; i < input.length; i++){
            if(typeof unique[input[i][key]] == "undefined"){
                unique[input[i][key]] = "";
                uniqueList.push({'key': input[i][key]});
            }
        }
        return uniqueList;
    };
})

/*This filter for My Workspace portlet*/
.filter('myNewWorkspaceFilter', ['contactCoreService', 'quotationCoreService', function(contactCoreService, quotationCoreService) {
    return function(objects, searchTxt, currentState) {
        if (searchTxt == undefined || searchTxt == null || searchTxt.length < 1)
            return objects;
        var rs = [];
        var lowerCaseSearchTxt = angular.lowercase(searchTxt);
        angular.forEach(objects, function(item) {
        	if (currentState == 'prospect') {
                if(
                	(angular.lowercase(contactCoreService.findValueInMapListByKey(item,'fullName')).indexOf(lowerCaseSearchTxt) != -1)
                ){
                    rs.push(item);
                }
            } else if (currentState == 'quotation') {
                if(
                	(angular.lowercase(quotationCoreService.findValueInMapListByKey(item,'DocName')).indexOf(lowerCaseSearchTxt) != -1 ||
                	(angular.lowercase(quotationCoreService.findValueInMapListByKey(item,'FullName')) != undefined && angular.lowercase(quotationCoreService.findValueInMapListByKey(item,'FullName')).indexOf(lowerCaseSearchTxt) != -1) ||
                	 angular.lowercase(quotationCoreService.findValueInMapListByKey(item,'OwnerUid')).indexOf(lowerCaseSearchTxt) != -1)
                ){
                    rs.push(item);
                }
        	}else if (currentState == 'fna') {
                if(
                    	angular.lowercase(quotationCoreService.findValueInMapListByKey(item,'docName')).indexOf(lowerCaseSearchTxt) != -1 ||
                    	angular.lowercase(quotationCoreService.findValueInMapListByKey(item,'fullName')).indexOf(lowerCaseSearchTxt) != -1
                    ){
                        rs.push(item);
                    }
            }else if (currentState == 'BIState') {
            	if(
            		(angular.lowercase(quotationCoreService.findValueInMapListByKey(item,'ProductName')).indexOf(lowerCaseSearchTxt) != -1) ||
            		(angular.lowercase(quotationCoreService.findValueInMapListByKey(item,'DocName')).indexOf(lowerCaseSearchTxt) != -1)
            	){
            		rs.push(item);
            	}
            } else if (currentState == 'applicationState') {
            	if(
	        		(angular.lowercase(contactCoreService.findValueInMapListByKey(item,'Product')).indexOf(lowerCaseSearchTxt) != -1 ||
	                 angular.lowercase(contactCoreService.findValueInMapListByKey(item,'DocName')).indexOf(lowerCaseSearchTxt) != -1 ||
	                 angular.lowercase(contactCoreService.findValueInMapListByKey(item,'POFullName')).indexOf(lowerCaseSearchTxt) != -1)
            	){
            		rs.push(item);
            	}
            }else if (currentState == 'pdpaState') {
                if(
	        		(angular.lowercase(contactCoreService.findValueInMapListByKey(item,'ProspectFullName')).indexOf(lowerCaseSearchTxt) != -1)
            	){
            		rs.push(item);
            	}
            }else if (currentState == 'salecaseState') {
            	if(
	        		(angular.lowercase(contactCoreService.findValueInMapListByKey(item,'Product')).indexOf(lowerCaseSearchTxt) != -1 ||
	        		 angular.lowercase(contactCoreService.findValueInMapListByKey(item,'DocumentStatus')).indexOf(lowerCaseSearchTxt) != -1 ||
	                 angular.lowercase(contactCoreService.findValueInMapListByKey(item,'DocName')).indexOf(lowerCaseSearchTxt) != -1)
            	){
            		rs.push(item);
            	}
            }else if (currentState == 'ClaimState') {
            	if(
	        		(angular.lowercase(contactCoreService.findValueInMapListByKey(item,'ClaimNum')).indexOf(lowerCaseSearchTxt) != -1 ||
	                 angular.lowercase(contactCoreService.findValueInMapListByKey(item,'PolicyOwner')).indexOf(lowerCaseSearchTxt) != -1)
            	){
            		rs.push(item);
            	}
            }else if (currentState == 'ClientState') {
            	if(
    	        		(angular.lowercase(contactCoreService.findValueInMapListByKey(item,'First_Name')).indexOf(lowerCaseSearchTxt) != -1 ||
	        				angular.lowercase(contactCoreService.findValueInMapListByKey(item,'Surname')).indexOf(lowerCaseSearchTxt) != -1 ||
	        				angular.lowercase(contactCoreService.findValueInMapListByKey(item,'Client_ID')).indexOf(lowerCaseSearchTxt) != -1)
                	){
                		rs.push(item);
                	}
            }else if (currentState == 'factfind') {
            	if(
    	        		(angular.lowercase(contactCoreService.findValueInMapListByKey(item,'DocName')).indexOf(lowerCaseSearchTxt) != -1)
                	){
                		rs.push(item);
                	}
            }
        });
        return rs;
    };
}])
//this filter apply for card summary, depends on the format the filter will use apporiate function
.filter('summaryFormat', function() {
	var existingDateList = ["YYYY-MM-DD hh-mm-ss","YYYY-MM-DD-hh-mm-ss", "YYYY-MM-DD", "DD-MM-YYYY hh-mm-ss", "DD-MM-YYYY-hh-mm-ss", "DD-MM-YYYY"];
    return function(input, format) {
    	if (format==undefined || format!='datetime') {
			return input;
		}
    	else{
    		return moment(input,existingDateList).format('DD/MM/YYYY');
    	}
    };

})
.filter('translateMessage', ['commonService', 'commonUIService', '$translate', function(commonService, commonUIService, $translate) {
    return function(message) {
    	if (!commonService.hasValueNotEmpty(message)) {
			return "";
		}
    	var messageArr = message.split(";");
    	if(messageArr.length == 1) {
    		return $translate.instant(messageArr[0]);
    	} else {
    		var mssg =  $translate.instant(messageArr[0]);
    		for(var i = 1; i < messageArr.length; i++) {
    			//check if parameter is valid date
    			if(moment(messageArr[i], 'YYYY-MM-DD', true).isValid()){
    				messageArr[i] = commonUIService.convertToDateTime(messageArr[i],'DD/MMYYYY');
    			}else{
    				messageArr[i] = $translate.instant(messageArr[i])
    			}
    			mssg = mssg.replace("{" + (i - 1) + "}", messageArr[i]);
    		}
    		return mssg;
    	}
    };
}])
.filter('cardSummary', ['commonService', '$translate', '$filter', function(commonService, $translate, $filter) {
	function formatValue(uiEle, value) {
		var existingDateList = ["YYYY-MM-DD hh-mm-ss","YYYY-MM-DD-hh-mm-ss", "YYYY-MM-DD", "DD-MM-YYYY hh-mm-ss", "DD-MM-YYYY-hh-mm-ss", "DD-MM-YYYY"];
		if(commonService.hasValueNotEmpty(uiEle.valuePrefix)) {
			return $translate.instant(uiEle.valuePrefix + value);
		}
		if (uiEle.format != undefined && uiEle.format.search('datetime') == 0) {
			var datetimeFormat = 'MMM DD, YYYY';
			if(uiEle.format.indexOf(':') != -1)
				datetimeFormat = uiEle.format.slice(9);
			return moment(value, existingDateList).format(datetimeFormat);
		} else if (uiEle.format != undefined && uiEle.format.search('currency') == 0) {
			var numDec = 2
			if(uiEle.format.indexOf(':') != -1)
				numDec = uiEle.format.charAt((uiEle.format.length)-1)
			return $filter('v3Currency')(value, numDec);
		} else {
    		return value;
    	}
	}
    return function(uiEle) {
    	if(uiEle != undefined) {
    		if(!commonService.hasValueNotEmpty(uiEle.refDetail)) return "";

	    	if(commonService.hasValueNotEmpty(uiEle.refDetail.Value)) {
	    		return formatValue(uiEle, uiEle.refDetail.Value);
	    	} else if(commonService.hasValueNotEmpty(uiEle.refDetail.value)) {
	 	    	return formatValue(uiEle, uiEle.refDetail.value);
	    	} else if(commonService.hasValueNotEmpty(uiEle.refDetail.$)) {
	    		return formatValue(uiEle, uiEle.refDetail.$);
	    	} else if(typeof(uiEle.refDetail) != "object") {
	    		return formatValue(uiEle, uiEle.refDetail);
	    	} else {
	    		return "";
			}
    	}
    };
}])
.filter('searchFilter', function() {
	return function(objects, moduleService, searchText, selectedColumns) {
		if (searchText == undefined || searchText == null || searchText.length < 1)
			return objects;

		var rs = [];
		var lowerCaseSearchText = angular.lowercase(searchText);
		angular.forEach(objects, function(item) {
			var itemMetaKey = [];
			for (var x in item) {
				itemMetaKey.push(x);
			}
			for (var i = 0; i < itemMetaKey.length; i++) {
				if (angular.lowercase(moduleService.findElementInElement_V3(item, [itemMetaKey[i]])).indexOf(lowerCaseSearchText) != -1) {
					rs.push(item);
					break;
				}
			}

		});
		return rs;
	};
})
.filter('advancedSearch', function() {
	return function(objects, moduleService, searchText, searchType, selectedColumns) {
		if (searchText == undefined || searchText == null || searchText.length < 1)
			return objects;

		var rs = [];
		var lowerCaseSearchText = angular.lowercase(searchText);
		angular.forEach(objects, function(item) {
			if (angular.lowercase(moduleService.findElementInElement_V3(item, [searchType])).indexOf(lowerCaseSearchText) != -1) {
				rs.push(item);
			}
		});
		return rs;
	};
})

.filter('formatTitleImage', function() {
	return function(list) {
		var newValue="N/A";
		var value = "";

		if(angular.isArray(list)){
			value = list.join(" ");
		}else{
			value = list;
		}

    	if(value != "" && value != " " && value != undefined){
    		var oldValue = value.replace(/[^\w\s]/gi,'').trim().split(' ');
    		if(oldValue.length > 1)
    			newValue = oldValue[0][0] + oldValue[oldValue.length-1][0];
    		else
    			newValue = oldValue[0][0];
    	}
        return newValue;
	};
})

.filter('removePageNameWithRole', ['$translate', function($translate) {
    return function(pageName) {
    	var result = '';
    	if (pageName.indexOf('(') == -1) {
			result = $translate.instant('v3.pageName.label.'+pageName);

		} else {
			result = $translate.instant('v3.pageName.label.'+pageName.substr(0, pageName.indexOf('(')-1));
    	}
    	return result;
    };
}])

.filter('translateUWRule', ['$translate', '$filter', function($translate, $filter) {
    return function(rule, translateSuffix) {
    	var uwRule = '';
    	if (rule) {
	    	var errors = rule.split(':');
	    	var suffix = "new.v3.mynewworkspace.life.underwriting.rule.";
	    	if (translateSuffix){
	    		suffix = translateSuffix;
	    	}
	    	uwRule = $translate.instant(suffix + errors[0]);
	    	if (errors.length < 3) {
	    		if (errors[0] == 'SMOK') {
	    			uwRule = uwRule + errors[1] + $translate.instant('new.v3.mynewworkspace.life.underwriting.rule.SticksOfCigarrette');
	    		} else if (errors[0] == 'DOBC') {
	    			uwRule = uwRule + $filter('datetimeFilter')(errors[1], 'DD/MM/YYYY');
	    		} else if (errors[1]){
	    			uwRule = uwRule + errors[1];
	    		}
	    	} else {
	    		for (var i = 1; i < errors.length - 1; i++) {
	    			if (errors[i]){
	    				uwRule = uwRule + errors[i] + ', ';
	    			}
	    		}
	    		uwRule = uwRule.substr(0, uwRule.lastIndexOf(', '));
	    	}
    	}
    	return uwRule;
    };
}])

.filter('parseStringToNum', function() {
    return function(input) {
    	if(input == undefined || input == '')
    		return parseInt("0");
    	else
    		return parseInt(input);
    }
})
.filter('removeClientJoinFromChildren', function() {
	return function(childrenList,clientUid,jointUid) {
		if (childrenList == undefined || childrenList.length < 1){
			return childrenList;
		}
		var filteredchildrenList = [];
		angular.forEach(childrenList, function(item){
			if(item.DocId !== clientUid && item.DocId !== jointUid)
				filteredchildrenList.push(item);
		});
		return filteredchildrenList;
	};
})
.filter('removeProspectFromList', function() {
	return function(prospectList,clientUid,jointUid,childrenUids) {
		if (prospectList == undefined || prospectList.length < 1){
			return prospectList;
		}
		var filteredProspectList = [];
		if (childrenUids.length > 0){
			angular.forEach(prospectList, function(item){
				var differChildrenFlag = true;
				angular.forEach(childrenUids, function(childItem){
					if(item.DocId === childItem['refUid']){
						differChildrenFlag = false;
					}
				});
				if((item.DocId !== clientUid && item.DocId !== jointUid && differChildrenFlag === true)){
					filteredProspectList.push(item);
				}
			});
		}
		else{
			angular.forEach(prospectList, function(item){
				if(item.DocId !== clientUid && item.DocId !== jointUid){
					filteredProspectList.push(item);
				}
			});
		}
		return filteredProspectList;
	};
})
.filter('contactTelephone', ['commonService', function(commonService) {
	return function(contact) {
		if (contact.DocType == commonService.CONSTANTS.MODULE_NAME.PROSPECT) {
			if (commonService.hasValueNotEmpty(contact.MobilePhone)) {
				return contact.MobilePhone;
			}
			if (commonService.hasValueNotEmpty(contact.HomePhone)) {
				return contact.HomePhone;
			}
			if (commonService.hasValueNotEmpty(contact.OfficePhone)) {
				return contact.OfficePhone;
			}
		}
		if (contact.DocType == commonService.CONSTANTS.MODULE_NAME.CORPORATE) {
			if (commonService.hasValueNotEmpty(contact.MainLineTelephone)) {
				return contact.MainLineTelephone;
			}
			if (commonService.hasValueNotEmpty(contact.PersonInChargeTelephone)) {
				return contact.PersonInChargeTelephone;
			}
		}
		return "";
	}
}])

.filter('v3Currency', ['commonService', '$translate', '$filter', function(commonService, $translate, $filter) {
	return function(data, decimal) {
		if(data == undefined || data == '')
			return 0;
		if(decimal == undefined || decimal == ''){
			//support long decimal number ex: 2.11295571692947e+22
			data = parseInt(data);
			decimal = 0;
		}

    	if(angular.isString(data)){
    		var value = data.replace(/,/gi,'')
    		return $filter('currency')(value, "", decimal);
    	}
    	else
    		return $filter('currency')(data, "", decimal);
    }
}])

.filter('splitrow', function(){
	return function (input, count){
		var out = [];
		if(typeof input === "object"){
  			for (var i=0, j=input.length; i < j; i+=count) {
  	    		out.push(input.slice(i, i+count));
  			}
  		}
   		return out;
	}
})
.filter('negativenumberformat',function(){
	return function (input){
		if(parseInt(input) < 0)
			{
				var value = 0 - parseInt(input);
				return "("+value+")";
			}
		else return input
	}
})
//status filter function for general screen
.filter('statusFilter', ['$filter', function($filter){
	return function(list, expression) {
		var result;
		switch (expression.businessStatus.value) {
		case 'OPEN':
			var draft = $filter('filter')(list, {businessStatus:{value: 'DRAFT'}});
			var application_pending = $filter('filter')(list, {businessStatus:{value: 'PENDING_APPLICATION'}});
			result = draft.concat(application_pending);
			break;
		case 'SUBMITTED':
			var review_in_progress = $filter('filter')(list, {businessStatus:{value: 'REVIEW_IN_PROGRESS'}});
			var pending_manager_review = $filter('filter')(list, {businessStatus:{value: 'PENDING_MANAGER_REVIEW'}});
			var submitted = $filter('filter')(list, {businessStatus:{value: 'SUBMITTED'}});
			result = review_in_progress.concat(pending_manager_review, submitted);
			break;
		case 'COMPLETED':
			var completed = $filter('filter')(list, {businessStatus:{value: 'COMPLETED'}});
			var failed = $filter('filter')(list, {businessStatus:{value: 'FAILED'}});
			var rejected = $filter('filter')(list, {businessStatus:{value: 'REJECTED'}});
			var abandoned = $filter('filter')(list, {businessStatus:{value: 'ABANDONED'}});
			var expired = $filter('filter')(list, {businessStatus:{value: 'EXPIRED'}});
			result = completed.concat(failed, rejected, abandoned, expired);
			break;

		default:
			break;
		}
		return result;
	}
}])
.filter('limitChar', function () {
    return function (content, length, tail) {
        if (isNaN(length))
            length = 50;
 
        if (tail === undefined)
            tail = "...";
        if (content == undefined || content==="") {
        	return "";
        }
        if (content.length <= length || content.length - tail.length <= length) {
            return content;
        }
        else {
            return String(content).substring(0, length-tail.length) + tail;
        }
    };
})
/**
 * filter By Name and value of field in array
 */
.filter('filterByName', ['commonService', function(commonService) {
	return function (array, name, value, isEquals) {
		isEquals = isEquals == true; // undefined => false
		
		var result = [];
		if (!commonService.hasValueNotEmpty(name) || !commonService.hasValueNotEmpty(array)){
			return result;
		}
		for (var i = 0; i < array.length; i++){
			if(isEquals) {
				if (array[i][name] === value){
					result.push(array[i]);
				}
			} else {
				if (array[i][name] !== value){
					result.push(array[i]);
				}
			}
		}
		return result;
	}
}]);

;//End



