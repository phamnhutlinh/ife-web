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

/* Directives */
//var urlContext = angular.contextPathTheme;
var directiveUIModule = angular.module('directiveUIModule',['ng','ui.bootstrap','translateUIModule'])
/**
 */
.directive('posAutonumeric', ['appService', 'commonService', '$locale', 
    function(appService, commonService, $locale) {
  return {
        require: '?ngModel',
        priority: 10,
        link: function(scope, element, attrs, model) {
        var opts = angular.extend({}, {
            aSep: $locale.NUMBER_FORMATS.GROUP_SEP, 
            aDec: $locale.NUMBER_FORMATS.DECIMAL_SEP, 
            mDec: attrs.decimal == undefined ? 2 : attrs.decimal, 
            aPad: true,
            nBracket: "(,)",
            vMin: attrs.min == undefined ? "0":attrs.min,
            vMax: attrs.max == undefined ? "999999999999999.99":attrs.max}, 
            scope.$eval(attrs.posAutonumeric));
          if (model != null) {
            element.bind("keyup blur", function(){
              var value = model.$viewValue;
              if(value !== undefined){
                var testValue = element.val();
                var newValue = '';
//                if(testValue !== '') newValue = element.autoNumericGet();
                if(testValue !== '') newValue = element.autoNumeric('get');
                if(value !== newValue){
                  return scope.$apply(function() {
                    if(opts.percent)
                      newValue = newValue/100;
                      return model.$setViewValue(newValue);
                  });  
                }  
//                if(newValue == ""){
//                	return element.autoNumeric('set', "0");
//                }
              }
              return false;
            });

            model.$render = function() {
              var value = model.$viewValue;
              //default 0 when data is null AVIVA-296 [AFA-UI-General] All number and percentage fields should be set to 0 by default
//              if(!commonService.hasValueNotEmpty(value)) {
//            	  element.autoNumeric('set', "0");
//            	  return model.$setViewValue("0")
//              }
              if (value === undefined){
            	  value = null;
              }
                if(opts.percent)
                  value = value * 100;
                if(angular.isString(value))
                  value = value.replace(/,/gi,'');
//              return element.autoNumericSet(value);
              return element.autoNumeric('set', value);
            };
          }
          return element.autoNumeric(opts);
        }
      };
}])
.directive('posAutonumericNumber', ['appService', 'commonService', '$locale', 
    function(appService, commonService, $locale) {
  return {
        require: '?ngModel',
        priority: 10,
        link: function(scope, element, attrs, model) {
        var opts = angular.extend({}, {
            aSep: $locale.NUMBER_FORMATS.GROUP_SEP, 
            aDec: $locale.NUMBER_FORMATS.DECIMAL_SEP, 
            mDec: attrs.decimal == undefined ? 9 : attrs.decimal, 
            aPad: true,
            nBracket: "(,)",
            vMin: attrs.min == undefined ? "0":attrs.min,
            vMax: attrs.max == undefined ? "999999999999999.99":attrs.max}, 
            scope.$eval(attrs.posAutonumeric));
          if (model != null) {
            element.bind("keyup blur", function(){
              var value = model.$viewValue;
              if(value !== undefined){
                var testValue = element.val();
                var newValue = '';
//                if(testValue !== '') newValue = element.autoNumericGet();
                if(testValue !== '') newValue = element.autoNumeric('get');
                if(value !== newValue){
                  return scope.$apply(function() {
                    if(opts.percent)
                      newValue = newValue/100;
                      return model.$setViewValue(newValue);
                  });  
                }  
//                if(newValue == ""){
//                	return element.autoNumeric('set', "0");
//                }
              }
              return false;
            });

            model.$render = function() {
              var value = model.$viewValue;
              //default 0 when data is null AVIVA-296 [AFA-UI-General] All number and percentage fields should be set to 0 by default
//              if(!commonService.hasValueNotEmpty(value)) {
//            	  element.autoNumeric('set', "0");
//            	  return model.$setViewValue("0")
//              }
              if (value === undefined){
            	  value = null;
              }
                if(opts.percent)
                  value = value * 100;
                if(angular.isString(value))
                  value = value.replace(/,/gi,'');
//              return element.autoNumericSet(value);
              return element.autoNumeric('set', value);
            };
          }
          return element.autoNumeric(opts);
        }
      };
}])

.directive('posAutonumericNumber1', ['appService', 'commonService', '$locale', 
    function(appService, commonService, $locale) {
  return {
        require: '?ngModel',
        priority: 10,
        link: function(scope, element, attrs, model) {
        var opts = angular.extend({}, {
            aSep: $locale.NUMBER_FORMATS.GROUP_SEP, 
            aDec: $locale.NUMBER_FORMATS.DECIMAL_SEP, 
            mDec: attrs.decimal == undefined ? 7 : attrs.decimal, 
            aPad: true,
            nBracket: "(,)",
            vMin: attrs.min == undefined ? "0":attrs.min,
            vMax: attrs.max == undefined ? "999999999999999.99":attrs.max}, 
            scope.$eval(attrs.posAutonumeric));
          if (model != null) {
            element.bind("keyup blur", function(){
              var value = model.$viewValue;
              if(value !== undefined){
                var testValue = element.val();
                var newValue = '';
//                if(testValue !== '') newValue = element.autoNumericGet();
                if(testValue !== '') newValue = element.autoNumeric('get');
                if(value !== newValue){
                  return scope.$apply(function() {
                    if(opts.percent)
                      newValue = newValue/100;
                      return model.$setViewValue(newValue);
                  });  
                }  
//                if(newValue == ""){
//                	return element.autoNumeric('set', "0");
//                }
              }
              return false;
            });

            model.$render = function() {
              var value = model.$viewValue;
              //default 0 when data is null AVIVA-296 [AFA-UI-General] All number and percentage fields should be set to 0 by default
//              if(!commonService.hasValueNotEmpty(value)) {
//            	  element.autoNumeric('set', "0");
//            	  return model.$setViewValue("0")
//              }
              if (value === undefined){
            	  value = null;
              }
                if(opts.percent)
                  value = value * 100;
                if(angular.isString(value))
                  value = value.replace(/,/gi,'');
//              return element.autoNumericSet(value);
              return element.autoNumeric('set', value);
            };
          }
          return element.autoNumeric(opts);
        }
      };
}])

.directive('posAutonumericWithSlider', ['appService', 'commonService', '$locale', 
    function(appService, commonService, $locale) {
  return {
        require: '?ngModel',
        priority: 10,
        link: function(scope, element, attrs, model) {
        	var aMin = Number(attrs.min);
        	var aMax = Number(attrs.max);
	        var opts = angular.extend({}, {
	            aSep: $locale.NUMBER_FORMATS.GROUP_SEP, 
	            aDec: $locale.NUMBER_FORMATS.DECIMAL_SEP, 
	            mDec: attrs.decimal == undefined ? 2 : attrs.decimal, 
	            aPad: true,
	            nBracket: "(,)",
//	            vMin: aMin,
//	            vMax: aMax
	            }, 
	            scope.$eval(attrs.posAutonumeric));
        
          if (model != null) {
        	  //hle56
        	 scope.$watch(function() {
        		 return scope.uiElement.refDetail.value;
        	 }, function(_new, _old) {    //when isDisplay's value is changed
        		 
  	            if (_new !== _old){
  	            	 _new = _new + '';
  	        		 _new = _new.replace(/,/gi,'');
  	        		 _old = _old + '';
  	        		 _old = _old.replace(/,/gi,'');
  	            	 var newValue = _new;
  	            	 
  	            	if(!commonService.hasValueNotEmpty(newValue) || Number(aMin) > Number(_new) || _new.contains('(')){
  	            		newValue = aMin;
  	            	}
  	            	else if(Number(aMax) < Number(_new)){
	  	            	newValue = aMax;
	  	            }
  	            	
  	            	//if (newValue != _new) {
  	            		model.$setViewValue(Number(newValue))
  	            		element.autoNumeric('set', Number(newValue));
  	            	//}
  	            }
  	        });
        	 
        	 model.$render = function() {
                 var value = model.$viewValue;
                   if(opts.percent)
                     value = value * 100;
                   if(angular.isString(value))
                     value = value.replace(/,/gi,'');
                 return element.autoNumeric('set', value);
              };
          }
          return element.autoNumeric(opts);
        }
      };
}]) 
.directive('numbersOnly', ['appService', 'commonService', function(appService, commonService) {
   return {
     require: 'ngModel',
     priority: 10,
     link: function(scope, element, attrs, modelCtrl) {
/*       var maxLength="";
       var opts = angular.extend({
            'maxLength': maxLength,
        },
        scope.$eval(attrs.numbersOnly) 
      );
*/       modelCtrl.$parsers.push(function (inputValue) {
           // this next if is necessary for when using ng-required on your input. 
           // In such cases, when a letter is typed first, this parser will be called
           // again, and the 2nd time, the value will be undefined
           if (inputValue == undefined) return '';
           var transformedInput = inputValue.replace(/[^0-9]/g, '');
//           transformedInput = transformedInput.substring(0,opts.maxLength);
           if (transformedInput!=inputValue) {
              modelCtrl.$setViewValue(transformedInput);
              modelCtrl.$render();
           }         

           return transformedInput;         
       });
     }
   };
}])
.directive('phoneNumbersOnly', ['appService', 'commonService', function(appService, commonService) {
   return {
     require: 'ngModel',
     priority: 10,
     link: function(scope, element, attrs, modelCtrl) {
/*       var maxLength="";
       var opts = angular.extend({
            'maxLength': maxLength,
        },
        scope.$eval(attrs.numbersOnly) 
      );
*/       modelCtrl.$parsers.push(function (inputValue) {
           // this next if is necessary for when using ng-required on your input. 
           // In such cases, when a letter is typed first, this parser will be called
           // again, and the 2nd time, the value will be undefined
           if (inputValue == undefined) return '';
           var n = inputValue.indexOf(" ");
           if (n<0){return;}
           var s1 = inputValue.slice(0,n);
           var s2 = inputValue.slice(n+1,inputValue.length);
           var transformedInput = s1+ " " + s2.replace(/[^0-9]/g, '');
//           transformedInput = transformedInput.substring(0,opts.maxLength);
			if(s2 == '') {
				return;
			}
           if (transformedInput!=inputValue) {
              modelCtrl.$setViewValue(transformedInput);
              modelCtrl.$render();
           }
           return transformedInput;         
       });
     }
   };
}])
/*
 * hle56
 * use for Direct Sale
 */
.directive('phoneNumbersOnlyDs', ['appService', 'commonService', function(appService, commonService) {
	var prefix = '';
   return {
     require: 'ngModel',
     priority: 10,
     link: function(scope, element, attrs, modelCtrl) {
       modelCtrl.$parsers.push(function (inputValue) {
           if (inputValue == undefined) return '';
           var transformedInput = '';
           var n = inputValue.indexOf(" ");
           if(inputValue.startsWith("+") && n!=-1){
		           var s1 = inputValue.slice(1,n+1);
		           var s2 = inputValue.slice(n+1,inputValue.length);
		           transformedInput = "+" + s1.replace(/[^0-9]/g, '') + " " + s2.replace(/[^0-9]/g, '');
		           prefix = "+" + s1.replace(/[^0-9]/g, '') + " ";
		           if(s2.replace(/[^0-9]/g, '').length == 0){
		        	   if(!commonService.hasValueNotEmpty(scope.uiElement.refDetail.errorMessage))
		        		   scope.uiElement.refDetail.errorMessage = 'null';
		               scope.uiElement.refDetail.$ = '';
		           } else
		        	   delete scope.uiElement.refDetail.errorMessage;
           }else if(inputValue.startsWith("+")){
        	   transformedInput = "+" + inputValue.replace(/[^0-9]/g, '') + " ";
        	   if(commonService.hasValueNotEmpty(transformedInput)){
        		   delete scope.uiElement.refDetail.errorMessage;
        	   }
           }else {
        		 transformedInput = inputValue.replace(/[^0-9]/g, '');
        		 if(commonService.hasValueNotEmpty(transformedInput)){
          		   delete scope.uiElement.refDetail.errorMessage;
          	   	 }
           }
           
           if(transformedInput.length == 0){
        	   transformedInput = prefix;
           }
           if (transformedInput!=inputValue) {
              modelCtrl.$render(transformedInput);
           }

           return transformedInput;         
       });
     }
   };
}])
/*
 * hle56
 * use for Direct Sale
 */
.directive('posPhoneNumberDs', ['commonService', function(commonService){
	return {
		require: '?ngModel',
		priority: 10,
		link: function(scope, element, attrs, model){
			if (model != null){
				//listen for changing in address type dropdown through observing a spy attribute
				attrs.$observe('src', function(item){
				     item = scope.$eval(item);//convert json string --> object
				     var value = scope.moduleService.findPropertyInElement(item, ['type'], 'value').value;
				     if (value == "EMAIL"){
				    	 element.prev().addClass("hide");
				     } else if (element.prev().hasClass("hide")){
				    	 element.prev().removeClass("hide");
				     }
				   });
				
				//view -> model
				element.bind("keyup blur", function() {
					var number = element.val();
					if(number !== undefined){
						var n = number.indexOf(" ")
						if (n !== -1){
							var s1 = number.slice(0,n+1);
							var s2 = number.slice(n+1,number.length);
				           	number = s1 + s2.replace(/[^0-9]/g, '');
						} else {
							/*number = number.replace(/[^0-9]/g, '') + "";
							element.val(number);*/
							number = number + " ";
						}
						
						//set new model after format -> view
						element.val(number);
						
						if(model.$viewValue !== undefined && !scope.$$phase){
							return scope.$apply(function(){
								model.$setViewValue(number);
								//model.$render(); //bug: IMKI-286: The key left and right does not work on Contact No under Contact Tile 
							});
						};
					}
					return false;
				});
				
				 // click off to close
	            $("ui-view").click(function(e) {
	            	var uiELe = $("ui-view").find('.country-list');	            	
	            	if(uiELe.length > 0){
	            		for(var i = 0; i < uiELe.length; i++){
	            			var htmlele = uiELe[i]; 
	            			if((htmlele instanceof HTMLElement) && htmlele.classList.contains("country-list")){
	            				if(!htmlele.classList.contains("hide")){
	            					htmlele.classList.add("hide");
	            				}	            					
	            			}
	            		}
	            	}	            	
	            });
				
				//model -> view
				model.$render = function(value){
					if(value == undefined)
						value = model.$viewValue;
					if(commonService.hasValueNotEmpty(value))
						element.val(value);
						element.keyup();
				};
			}


			var preferredCountries = scope.$eval(attrs.preferredCountries);
			var selectCountry = attrs.selectCountry;
			
			intlTelInput.countries.forEach(function (country){
				if(country.cca2 === selectCountry){
					element.val('+' + country['calling-code'] + ' ')
				}
			});
			
			var options = {
					preferredCountries: preferredCountries,
			        americaMode: false,
			        selectCountry: selectCountry
			};
			/*element.autoNumeric({vMin: '0', vMax: '999999999999'});*/
			element.intlTelInput(options);
			setTimeout(function(){ 
				var downArrow = $('.intl-number-input .down-arrow');
				if(downArrow && downArrow.length > 0){
					for(var i =0; i < downArrow.length; i++){
						if(downArrow[i].parentElement.parentElement.parentElement.nextElementSibling.disabled == true){
							downArrow[i].innerHTML = '<i class="fa fa-caret-down fa-3x isDisable"></i>';
						}else{
							downArrow[i].innerHTML = '<i class="fa fa-caret-down fa-3x"></i>';
						}
					}
				}
			 });
		}
	};
}])
.directive('cnumbersOnly', ['appService', 'commonService', function(appService, commonService) {
   return {
     require: 'ngModel',
     priority: 10,
     link: function(scope, element, attrs, modelCtrl) {
       var cmaxLength="";
       var opts = angular.extend({
            'cmaxLength': cmaxLength,
        },
        scope.$eval(attrs.cnumbersOnly) 
      );
       modelCtrl.$parsers.push(function (inputValue) {
           // this next if is necessary for when using ng-required on your input. 
           // In such cases, when a letter is typed first, this parser will be called
           // again, and the 2nd time, the value will be undefined
           if (inputValue == undefined) return '';
           var transformedInput = inputValue.replace(/[^0-9]/g, '');
           transformedInput = transformedInput.substring(0,opts.cmaxLength);
           
           if (transformedInput!=inputValue) {
              modelCtrl.$setViewValue(transformedInput);
              modelCtrl.$render();
           }         

           return transformedInput;         
       });
     }
   };
}])
.directive('rangeNumbersOnly', ['appService', 'commonService', function(appService, commonService) {
   return {
     require: 'ngModel',
     priority: 10,
     link: function(scope, element, attrs, modelCtrl) {
       var cmaxLength="";
       var max="";
       var min="";
       var opts = angular.extend({
            'cmaxLength': cmaxLength,
            'min': min,
            'max': max,
        },
        scope.$eval(attrs.rangeNumbersOnly) 
      );
       modelCtrl.$parsers.push(function (inputValue) {
           // this next if is necessary for when using ng-required on your input. 
           // In such cases, when a letter is typed first, this parser will be called
           // again, and the 2nd time, the value will be undefined
           if (inputValue == undefined) return '';
           
           var re = new RegExp("[^" + opts.min + "-" + opts.max + "]","g");
           var transformedInput = inputValue.replace(re, '');
           
//         var transformedInput = inputValue.replace(/[^1-6]/g, '');
           transformedInput = transformedInput.substring(0,opts.cmaxLength);
           
           if (transformedInput!=inputValue) {
              modelCtrl.$setViewValue(transformedInput);
              modelCtrl.$render();
           }         

           return transformedInput;         
       });
     }
   };
}])

/**
 * Ipos jQuery UI resizable directive
 * to do resize left side bar *only*
 */
.directive('posResizable', function() {
  return {
        link: function(scope, element, attrs) {
        
          return element.resizable({
        handles: "e",
        minWidth: 20,
        resize: function(event, ui){
           var w = Math.floor(( 100 * parseFloat($(this).css("width")) / parseFloat($(this).parent().css("width")) )) + "%";
           $(this).css("width" , w);
           $(this).css("height", "auto");
           $(this).siblings(".right").css("left" , w);
        }
      });
        }
      };
})

.directive('autoPercent', ['$filter', function($filter) {
  return {
      require: '?ngModel',
      link: function(scope, ele, attr, model){
        model.$parsers.unshift(
                function(viewValue){
                    return $filter('number')(viewValue/100);
                }
            );
        model.$formatters.unshift(
                function(modelValue){
                    return $filter('number')(modelValue*100);
                }
            );
          }
      };
}])

.directive('posPhonenumber', ['commonService', function(commonService){
	return {
		require: '?ngModel',
		priority: 10,
		link: function(scope, element, attrs, model){
			if (model != null){
				//listen for changing in address type dropdown through observing a spy attribute
				attrs.$observe('src', function(item){
				     item = scope.$eval(item);//convert json string --> object
				     var value = scope.moduleService.findPropertyInElement(item, ['type'], 'value').value;
				     if (value == "EMAIL"){
				    	 element.prev().addClass("hide");
				     } else if (element.prev().hasClass("hide")){
				    	 element.prev().removeClass("hide");
				     }
				   });
				
				//view -> model
				element.bind("keyup blur", function() {
					var number = element.val();
					if(number !== undefined){
						var n = number.indexOf(" ")
						if (n !== -1){
							var s1 = number.slice(0,n+1);
							var s2 = number.slice(n+1,number.length);
				           	number = s1 + s2.replace(/[^0-9]/g, '');
						} else {
							/*number = number.replace(/[^0-9]/g, '') + "";
							element.val(number);*/
							number = number + " ";							
						}
						
						//set new model after format -> view
						element.val(number);
						
						if(model.$viewValue !== undefined && !scope.$$phase){
							return scope.$apply(function(){
								model.$setViewValue(number);
								//model.$render(); //bug: IMKI-286: The key left and right does not work on Contact No under Contact Tile 
							});
						};
					}
					return false;
				});
				
				 // click off to close
	            $("ui-view").click(function(e) {
	            	var uiELe = $("ui-view").find('.country-list');	            	
	            	if(uiELe.length > 0){
	            		for(var i = 0; i < uiELe.length; i++){
	            			var htmlele = uiELe[i]; 
	            			if((htmlele instanceof HTMLElement) && htmlele.classList.contains("country-list")){
	            				if(!htmlele.classList.contains("hide")){
	            					htmlele.classList.add("hide");
	            				}	            					
	            			}
	            		}
	            	}	            	
	            });
				
				//model -> view
	            model.$render = function(value){
					if(value == undefined)
						value = model.$viewValue;
					if(commonService.hasValueNotEmpty(value))
						element.val(value);
						element.keyup();
				};
				
			}
			var preferredCountries = scope.$eval(attrs.preferredCountries);
			var selectCountry = attrs.selectCountry;
			
			intlTelInput.countries.forEach(function (country){
				if(country.cca2 === selectCountry){
					element.val('+' + country['calling-code'] + ' ')
				}
			});
		
			var options = {
					preferredCountries: preferredCountries,
			        americaMode: false,
			        selectCountry: selectCountry
			};
			/*element.autoNumeric({vMin: '0', vMax: '999999999999'});*/
			element.intlTelInput(options);
			
			//dnguyen98: override this class to hide the flag and the layout is same with other component
			/*setTimeout(function(){ 
				var downArrow = $('.intl-number-input .down-arrow');
				if(downArrow && downArrow.length > 0){
					for(var i =0; i < downArrow.length; i++){
						if(downArrow[i].parentElement.parentElement.parentElement.nextElementSibling.disabled == true){
							downArrow[i].innerHTML = '<i class="fa fa-caret-down fa-3x isDisable"></i>';
						}else{
							downArrow[i].innerHTML = '<i class="fa fa-caret-down fa-3x"></i>';
						}
					}
				}
			 });*/

		}
	};
}])
.directive('formatInputDate', ['$filter', 'commonService', 'commonUIService', function ($filter, commonService, commonUIService) {
    return {
      require: '?ngModel',
      restrict:'EA',
        link: function (scope, element, attrs, ngModel) {
          //format text going to user (model to view)
          ngModel.$formatters.unshift(function(value) {
        	  if (value == null){
        		  return "";
        	  }
        	  if(moment.unix(value/1000,"DD/MM/YYYY").isValid()){
        		  return  moment.unix(value/1000).format("DD/MM/YYYY") ;
        	  } 
	          if(value) {
	              return angular.element.mobiscroll.formatDate('dd/mm/yyyy', angular.element.mobiscroll.parseDate('yy-mm-dd', value));
	          }
	          return value;
          });
          
          //format text from the user (view to model)
          ngModel.$parsers.push(function(value) {
            /*if(!(value instanceof Date)) {
              var arrayDate = value.split("/");
              var isValidDate = new Date(arrayDate[2] + "/" + arrayDate[1] + "/" + arrayDate[0]);
              if(isValidDate.toString() == "NaN" || isValidDate.toString() == "Invalid Date") {
                commonUIService.showNotifyMessage("Invalid Date", "fail");
                // reset to current date
                var currentdateModel = angular.element.mobiscroll.formatDate('yy-mm-dd', angular.element.mobiscroll.parseDate('dd/mm/yy', new Date()));
                var currentdateView = angular.element.mobiscroll.formatDate('dd/mm/yy', angular.element.mobiscroll.parseDate('dd/mm/yy', new Date()));
                ngModel.$modelValue=currentdateModel;
                ngModel.$$rawModelValue=currentdateModel;
                ngModel.$setViewValue(currentdateView);
                ngModel.$render();
                return currentdateModel;
              } 
            }*/
            if(!commonService.hasValueNotEmpty(value)) {
              element.val("");
              ngModel.$setViewValue("");
              return "";
            }
            
            //return when user not conplete typing (issue on android tablet: always show invalid date)
          	if(value.indexOf("d") > -1 || value.indexOf("m") > -1 || value.indexOf("y") > -1){
        		return;
        	}
          	 
            var maxDate = attrs.maxdate;
            var minDate = attrs.mindate;
            var currentDate = moment().format("YYYY-MM-DD");
            var val = moment(value, "DD/MM/YYYY").format("YYYY-MM-DD");
            if(!commonUIService.isValidDate(val, "YYYY-MM-DD", minDate, maxDate)) {
              commonUIService.showNotifyMessage("v3.style.message.InvalidDate", "error");
              // reset to current date
              var currentdateModel = angular.element.mobiscroll.formatDate('yy-mm-dd', angular.element.mobiscroll.parseDate('dd/mm/yy', new Date()));
              var currentdateView = angular.element.mobiscroll.formatDate('dd/mm/yy', angular.element.mobiscroll.parseDate('dd/mm/yy', new Date()));
              ngModel.$modelValue=currentdateModel;
              ngModel.$$rawModelValue=currentdateModel;
              ngModel.$setViewValue(currentdateView);
              ngModel.$render();
              return currentdateModel;
            } else {
              return angular.element.mobiscroll.formatDate('yy-mm-dd 00-00-00', angular.element.mobiscroll.parseDate('dd/mm/yy', value));
            }
        
          });
        }
    };
}])
.directive('formatdatepicker', ['dateFilter', function(dateFilter) {
    return {
      require: 'ngModel',
      link: function(scope, element, attrs, ngModel) {
        ngModel.$parsers.push(function(viewValue) {
          return dateFilter(viewValue, 'yyyy-MM-dd');
        });
      }
    }
}])
.directive('v3WhenDone', ['$timeout', '$parse', function($timeout, $parse) {
    return {
        link: function(scope, element, attrs) {
            if (scope.$last) {
                //wait for the render to finish before mark the selected value
                $timeout(
                    function() {
                        //call function after finish render
                        if (attrs.hasOwnProperty('v3WhenDone')) {
                            $parse(attrs.v3WhenDone)(scope);
                        }
                    }, 100);
            }
        }
    }
}]) 
.directive('globalMessage', ['$timeout', '$sce', function ($timeout, $sce) {
    return {
      restrict:'E',
      templateUrl: resourceServerPath + 'views/templates/message/message.html',
      scope: {
        type: '=',   // by reference
        content: '=',
        isDisplay: '=isdisplay'
      },
      link: function (scope, element, attrs) {
        var timeoutId;
        scope.closeAlert = function() {   //event click close alert
          element.hide();
          $timeout.cancel(timeoutId);
          scope.isDisplay = false;
        };
        
        scope.$watch('isDisplay', function() {      //when isDisplay's value is changed
            if(scope.isDisplay == true) {
                element.show();
                timeoutId = $timeout(function() {
                     scope.isDisplay = false;
                 }, 10000);
            }
            else {
              element.hide();
            }
        });
        
        scope.renderHtml = function(html_code)
        {
            return $sce.trustAsHtml(html_code);
        };
      }
    };
}])
.directive('autosizeInput', ['$timeout', function($timeout) {   
    return {
      restrict:'A',
      link: function (scope, element, attrs){
        $timeout(function(){   //set timeout to get DOM 
          $timeout(function(){                      
            element.autosizeInput();
          }, 0);
        }, 0);
      }  
    };
}])
.directive('hint', ['appService', function (appService) {
    return {
      restrict:'EA',
      templateUrl: resourceServerPath + 'views/templates/hint/hint.html',
      transclude:true,
      replace:true,
      scope: {
        content: "=",
        multiple:"@multiline",
        hClass: "@hclass"
      },
      link: function(scope, iElement, iAttrs, controller) {
      }
    };
}])
.directive('scrolled', function() {
    return{
      link: function(scope, elm, attr) {
          var raw = elm[0];
          elm.on('scroll', function() {           
              if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight) {
                 scope.$apply(attr.scrolled);
              }           
          });
      }
    };
})
.directive('dropdownStayOpen', function() {   
    return {
      restrict:'A',
      link: function (scope, element, attrs){
        element.on("click", "[data-stopPropagation]", function(e) {
          e.stopPropagation();
        });
      }  
    };
})
.directive('numberpad', ['appService', function (appService) {
    return {
      require: '?ngModel',
    restrict:'EA',
    templateUrl: resourceServerPath + 'views/templates/numberpad/numberpad.html',
    transclude:true,
    replace:true,
    link: function(scope, iElement, iAttrs, model) {
      var opts = angular.extend({
              'interval': 1000
            },
            scope.$eval(iAttrs.numberpad)
          );
      var interval = opts.interval;
        var currentValue = 0, newValue = 0;
        scope.addDigit = function(digitToAdd){
          if (model.$viewValue === ''){
            model.$setViewValue(digitToAdd);
            return;
          };
          if (typeof model.$viewValue === 'number')
            currentValue = model.$viewValue;
          if (typeof model.$viewValue === 'string')
            currentValue = parseInt(model.$viewValue);
        if (currentValue == 0){
          newValue = digitToAdd;
        } else {
          newValue = currentValue * 10 + digitToAdd;
        }
        model.$setViewValue(newValue);
        };
        scope.clear = function(){
          model.$setViewValue(0);
        };
        scope.backSpace = function(){
          var modelValue = 0;
          if (model.$viewValue === ''){
            model.$setViewValue(0);
            return;
          };
          if (typeof model.$viewValue === 'number'){
            modelValue = model.$viewValue;
          }
          if (typeof model.$viewValue === 'string'){
            modelValue = parseInt(model.$viewValue);
          }
          newValue = Math.floor(modelValue/10);
          model.$setViewValue(newValue);
        };
        scope.increaseInterval = function(){
          if (model.$viewValue === '' || isNaN(model.$viewValue)){
            model.$setViewValue(interval);
            return;
          };
          if (typeof model.$viewValue === 'number'){
            model.$setViewValue(model.$viewValue + interval);
          }
          if (typeof model.$viewValue === 'string'){
            model.$setViewValue(parseInt(model.$viewValue) + interval);
          }
        };
        scope.decreaseInterval = function(){
          if (model.$viewValue === ''|| isNaN(model.$viewValue)){
            model.$setViewValue(-interval);
            return;
          };
          if (typeof model.$viewValue === 'number'){
            model.$setViewValue(model.$viewValue - interval);
          }
          if (typeof model.$viewValue === 'string'){
            model.$setViewValue(parseInt(model.$viewValue) - interval);
          }
        };
      }
    };
}])
.directive('ngRightClick', ['$parse', function($parse) {
    return function(scope, element, attrs) {
        var fn = $parse(attrs.ngRightClick);
        element.bind('contextmenu', function(event) {
            scope.$apply(function() {
                event.preventDefault();
                fn(scope, {$event:event});
            });
        });
    };
}])

.directive('inputPopup', ['$modal', function($modal){
    function link(scope, element, attrs){
        function open(size) {
        $modal.open({
          templateUrl: resourceServerPath + '/views/templates/inputpopup/iputpopup.html',
          controller: function ($scope, $modalInstance, items) {
                      $scope.items = items;
                      $scope.selected = {
                        item: scope.myModel
                      };
                      $scope.ok = function () {
                        $modalInstance.close($scope.selected.item);
                        scope.myModel=$scope.selected.item;
                      };
                      $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                      };
                    },
          size: size,
          resolve: {
            items: function () {
              return scope.myItems;
            }
          }
        });
      };
      element.bind('click', function() {
          open();
        });
    };
    return {
      restrict:'A',
      require: '?ngModel',
      replace: true,
      transclude : true,
      scope: {
          myModel: '=ngModel',
          myItems: '=items',
      },
      link:link
    };
}])
.directive('tooltips', ['$window', '$compile', function manageDirective($window, $compile) {

    var TOOLTIP_SMALL_MARGIN = 8 //px
      , TOOLTIP_MEDIUM_MARGIN = 9 //px
      , TOOLTIP_LARGE_MARGIN = 10 //px
      , CSS_PREFIX = '_720kb-tooltip-';
    return {
      'restrict': 'A',
      'scope': {
    	  triggerUpdate : "="
      },
      'link': function linkingFunction($scope, element, attr) {

        var initialized = false
          , thisElement = angular.element(element[0])
          , body = angular.element($window.document.getElementsByTagName('body')[0])
          , theTooltip
          , theTooltipHeight
          , theTooltipWidth
          , theTooltipMargin //used both for margin top left right bottom
          , height
          , width
          , offsetTop
          , offsetLeft
          , title = attr.tooltipTitle || attr.title || ''
          , content = attr.tooltipContent || ''
          , showTriggers = attr.tooltipShowTrigger || 'mouseover'
          , hideTriggers = attr.tooltipHideTrigger || 'mouseleave'
          , originSide = attr.tooltipSide || 'top'
          , side = originSide
          , size = attr.tooltipSize || 'medium'
          , tryPosition = typeof attr.tooltipTry !== 'undefined' && attr.tooltipTry !== null ? $scope.$eval(attr.tooltipTry) : true
          , className = attr.tooltipClass || ''
          , speed = (attr.tooltipSpeed || 'medium').toLowerCase()
          , lazyMode = typeof attr.tooltipLazy !== 'undefined' && attr.tooltipLazy !== null ? $scope.$eval(attr.tooltipLazy) : true
          , htmlTemplate =
              '<div class="_720kb-tooltip ' + CSS_PREFIX + size + '">' +
              '<div class="' + CSS_PREFIX + 'title"> ' + title + '</div>' +
              content + ' <span class="' + CSS_PREFIX + 'caret"></span>' +
              '</div>';

        //parse the animation speed of tooltips
        $scope.parseSpeed = function parseSpeed () {

          switch (speed) {
            case 'fast':
              speed = 100;
              break;
            case 'medium':
              speed = 450;
              break;
            case 'slow':
              speed = 800;
              break;
            default:
              speed = Number(speed);
          }
        };
        //create the tooltip
        createToolTip();

        $scope.isTooltipEmpty = function checkEmptyTooltip () {

          if (!title && !content) {

            return true;
          }
        };

        $scope.initTooltip = function initTooltip (tooltipSide) {

          if (!$scope.isTooltipEmpty()) {

            height = thisElement[0].offsetHeight;
            width = thisElement[0].offsetWidth;
            offsetTop = $scope.getRootOffsetTop(thisElement[0], 0);
            offsetLeft = $scope.getRootOffsetLeft(thisElement[0], 0);
            //get tooltip dimension
            theTooltipHeight = theTooltip[0].offsetHeight;
            theTooltipWidth = theTooltip[0].offsetWidth;

            $scope.parseSpeed();
            $scope.tooltipPositioning(tooltipSide);
          }
        };

        $scope.getRootOffsetTop = function getRootOffsetTop (elem, val){

          if (elem.offsetParent === null){

            return val + elem.offsetTop;
          }

          return $scope.getRootOffsetTop(elem.offsetParent, val + elem.offsetTop);
        };

        $scope.getRootOffsetLeft = function getRootOffsetLeft (elem, val){

          if (elem.offsetParent === null){

            return val + elem.offsetLeft;
          }

          return $scope.getRootOffsetLeft(elem.offsetParent, val + elem.offsetLeft);
        };

        thisElement.bind(showTriggers, function onMouseEnterAndMouseOver() {

          if (!lazyMode || !initialized) {

            initialized = true;
            $scope.initTooltip(side);
          }
          if (tryPosition) {

            $scope.tooltipTryPosition();
          }
          $scope.showTooltip();
        });

        thisElement.bind(hideTriggers, function onMouseLeaveAndMouseOut() {

          $scope.hideTooltip();
        });

        $scope.showTooltip = function showTooltip () {

          theTooltip.addClass(CSS_PREFIX + 'open');
          theTooltip.css('transition', 'opacity ' + speed + 'ms linear');
        };

        $scope.hideTooltip = function hideTooltip () {

          theTooltip.removeClass(CSS_PREFIX + 'open');
          theTooltip.css('transition', '');
        };

        $scope.removePosition = function removeTooltipPosition () {

          theTooltip
          .removeClass(CSS_PREFIX + 'left')
          .removeClass(CSS_PREFIX + 'right')
          .removeClass(CSS_PREFIX + 'top')
          .removeClass(CSS_PREFIX + 'bottom ');
        };

        $scope.tooltipPositioning = function tooltipPositioning (tooltipSide) {

          $scope.removePosition();

          var topValue
            , leftValue;

          if (size === 'small') {

            theTooltipMargin = TOOLTIP_SMALL_MARGIN;

          } else if (size === 'medium') {

            theTooltipMargin = TOOLTIP_MEDIUM_MARGIN;

          } else if (size === 'large') {

            theTooltipMargin = TOOLTIP_LARGE_MARGIN;
          }

          if (tooltipSide === 'left') {

            topValue = offsetTop + height / 2 - theTooltipHeight / 2;
            leftValue = offsetLeft - (theTooltipWidth + theTooltipMargin);

            theTooltip.css('top', topValue + 'px');
            theTooltip.css('left', leftValue + 'px');
            theTooltip.addClass(CSS_PREFIX + 'left');
          }

          if (tooltipSide === 'right') {

            topValue = offsetTop + height / 2 - theTooltipHeight / 2;
            leftValue = offsetLeft + width + theTooltipMargin;

            theTooltip.css('top', topValue + 'px');
            theTooltip.css('left', leftValue + 'px');
            theTooltip.addClass(CSS_PREFIX + 'right');
          }

          if (tooltipSide === 'top') {

            topValue = offsetTop - theTooltipMargin - theTooltipHeight;
            leftValue = offsetLeft + width / 2 - theTooltipWidth / 2;

            theTooltip.css('top', topValue + 'px');
            theTooltip.css('left', leftValue + 'px');
            theTooltip.addClass(CSS_PREFIX + 'top');
          }

          if (tooltipSide === 'bottom') {

            topValue = offsetTop + height + theTooltipMargin;
            leftValue = offsetLeft + width / 2 - theTooltipWidth / 2;
            theTooltip.css('top', topValue + 'px');
            theTooltip.css('left', leftValue + 'px');
            theTooltip.addClass(CSS_PREFIX + 'bottom');
          }
        };

        $scope.tooltipTryPosition = function tooltipTryPosition () {

            var theTooltipH = theTooltip[0].offsetHeight
              , theTooltipW = theTooltip[0].offsetWidth
              , topOffset = theTooltip[0].offsetTop
              , leftOffset = theTooltip[0].offsetLeft
              , winWidth = $window.outerWidth
              , winHeight = $window.outerHeight
              , rightOffset = winWidth - (theTooltipW + leftOffset)
              , bottomOffset = winHeight - (theTooltipH + topOffset)
              //element OFFSETS (not tooltip offsets)
              , elmHeight = thisElement[0].offsetHeight
              , elmWidth = thisElement[0].offsetWidth
              , elmOffsetLeft = thisElement[0].offsetLeft
              , elmOffsetTop = thisElement[0].offsetTop
              , elmOffsetRight = winWidth - (elmOffsetLeft + elmWidth)
              , elmOffsetBottom = winHeight - (elmHeight + elmOffsetTop)
              , offsets = {
                'left': leftOffset,
                'top': topOffset,
                'bottom': bottomOffset,
                'right': rightOffset
              }
              , posix = {
                'left': elmOffsetLeft,
                'right': elmOffsetRight,
                'top': elmOffsetTop,
                'bottom': elmOffsetBottom
              }
              , bestPosition = Object.keys(posix).reduce(function (best, key) {

                  return posix[best] > posix[key] ? best : key;
              })
              , worstOffset = Object.keys(offsets).reduce(function (worst, key) {

                  return offsets[worst] < offsets[key] ? worst : key;
              });

              if (offsets[worstOffset] < 5) {

                side = bestPosition;

                $scope.initTooltip(bestPosition);
              }
        };

        //make sure that the tooltip is hidden when the directive is destroyed
        $scope.$on('$destroy', $scope.hideTooltip);

        angular.element($window).bind('resize', function onResize() {

          $scope.hideTooltip();
          $scope.initTooltip(originSide);
        });
        
        $scope.stopWatching = $scope.$watch(
			'triggerUpdate',
			function (_new, _old) {
				if (_new !== _old) {
					updateTooltip();
				}
			}
		);
        function updateTooltip (){
        	title = attr.tooltipTitle || attr.title || '';
        	htmlTemplate =
                '<div class="_720kb-tooltip ' + CSS_PREFIX + size + '">' +
                '<div class="' + CSS_PREFIX + 'title"> ' + title + '</div>' +
                content + ' <span class="' + CSS_PREFIX + 'caret"></span>' +
                '</div>';
        	createToolTip();
        	initialized = false;
        }
        
        function createToolTip () {
        	if(theTooltip)
        		theTooltip.remove();
        	
        	theTooltip = $compile(htmlTemplate)($scope);
        	
        	theTooltip.addClass(className);
        	
        	body.append(theTooltip);
        }
      }
    };
}])

/*nle32: This Directive for reorder cards when add new card*/
.directive('cardReorder', [ "$timeout", "commonService", "$compile" , function($timeout, commonService, $compile){
    return {
      
        scope: {
          currentLevel: "=",
          viewObjectLenght: "=",
          viewObject: "="
        },
        link: function(scope, element, attributes){
         scope.$watch("viewObjectLenght", function(newValue, oldValue) {
          if(!angular.equals(newValue, oldValue) && scope.viewObjectLenght){
                  $timeout( scope.reOrderCard, 0);
          }          
        });
         scope.reOrderCard = function(){
          var detailContainer = $("#level-" + scope.currentLevel + "-content");
          detailContainer.removeClass("animated zoomIn");
          if(detailContainer[0]){
         
          var parentElement = detailContainer[0].parentElement;
          var currOffsetTop =  detailContainer[0].children[0].offsetTop;
          var siblingEles = parentElement.children;
          detailContainer.insertAfter("#level-" + (scope.currentLevel -1) + "-card-" + (scope.viewObjectLenght - 1) );
          var appendEle = undefined;//where the new layout will be append
            currOffsetTop = currOffsetTop - siblingEles[0].firstChild.offsetHeight;
          var siblingLen = siblingEles.length;
  
           var i = 0;
          for (; i < siblingLen; i++) {
            if(!commonService.hasValueNotEmpty(siblingEles[i].children)) continue;
            if (siblingEles[i].children[0].offsetTop > currOffsetTop) {
              break;
            }
            appendEle = siblingEles[i];
          };
  
        angular.element(appendEle).after(detailContainer);
          }
       }
        }
    };
}])
.directive('v3SwitchNewSlide', ['$parse', '$timeout', '$translate', '$filter', 'commonService', function($parse, $timeout, $translate, $filter, commonService) {
	return {
		restrict: 'E',
		scope: {
			switchModel: '=',
			switchDisabled: '=',
			switchOptions: '=',
			switchMeta: '=',
			alwayWatch: '@',
			prefix:'@',
			float: '@',
			moreAction: '&'//the function(from controller) you want to call in directive
		},
		templateUrl: resourceServerPath + '/view/templates/v3_switch_more.html',
		link: function(scope, element, attrs) {
			// html template
			// <v3-switch switch-disabled="::!moduleService.isEditMode" switch-model="variables.Gender.Value" switch-default-value="" switch-options="{{::moduleService.listGenders}}">
			// <v3-switch>

			var stopWatchingOption = scope.$watch(
				"switchOptions",
				function handleFooChange( newValue, oldValue ) {
					if(newValue != undefined &&  newValue[0] != undefined){
						scope.renderSwitch();
						stopWatchingOption();
					}

				}
			);

			scope.$on("changeLanguage", function handleChangeLanguageEvent(event) {
				scope.renderSwitch();
			});
			
			
			/**
			 * hle56
			 * if translate service is not ready, we need rerender again when it's ready to make UI beauty
			 */
			if(!$translate.isReady()){
				$translate.onReady(function(){
					scope.lgth = 0;
					scope.renderSwitch();
				});
			}

			scope.renderSwitch = function(){
				scope.firstTimeRender = true;
				//translate list
				translateItems();
				function translateItems(){
					//check if list is array or not
					if(!angular.isArray(scope.switchOptions)){
						var item=scope.switchOptions;
						scope.switchOptions=[];
						scope.switchOptions.push(item);
					}
					//add file translate to list
					if(scope.switchOptions[0]){
						for (var i = 0; i < scope.switchOptions.length; i++) {
							scope.switchOptions[i].translateKey=scope.prefix+'.'+scope.switchOptions[i].key.toString();
						}
					}
				}

				// var switchSize = attrs.switchSize;
				// scope.switchItems = scope.switchOptions;
				if (!scope.switchName) {
					scope.switchName = (0|Math.random()*9e6).toString(36);
				}
				var stopWatchModel = scope.$watch('switchModel', function() {

					if(scope.switchOptions != undefined){   // dnguyen98: check value of switchModel for init highlightSelected
						scope.switchItemsLength = scope.switchOptions.length;
						if (scope.prevSelectedItem){
							/*scope.clearSelect();*/
						}
						scope.highlightSelected();
					}
					//call function
					if(scope.moreAction && !scope.firstTimeRender){
						scope.moreAction({});
					}
					//clear selected value
					//remove all selected class in switch
					if( (scope.switchModel === "" || scope.switchModel === null) && scope.selectedClass){
						scope.clearSelect();
						scope.switchModelButton = "";
					}
					//stop watch model
					/*stopWatchModel();*/
				});

				//clear selected value and remove all selected class
				scope.clearSelect = function clearSelect (){
					scope.prevSelectedItem.removeClass(scope.selectedClass);
					scope.prevSelectedItem.removeClass(scope.switchBorder);
					scope.prevSelectedItem.removeClass(scope.lastItem);
					scope.prevSelectedItem.addClass(scope.itemsSeparator);

					$( "#v3-switch-slider-" + scope.switchName ).width(0);
				};



				//class for selected and unselected
				scope.selectedClass = undefined;
				scope.switchBorder = undefined;
				scope.separator = undefined;
				scope.alwaysWatch = scope.$eval(scope.alwayWatch);
				scope.sliderWidth = undefined;

				scope.toggleClass = function toggleClass () {
					//defind class for disabled/ enabled
					if(scope.switchDisabled == true){
						scope.selectedClass = 'v3-switch-item-selected-disabled';
						scope.switchBorder = 'v3-switch-new-disabled';
						scope.itemsSeparator = 'v3-switch-item-sep-disabled';
						scope.lastItem = 'v3-switch-last-disabled';
					}
					else{
						scope.selectedClass = 'v3-switch-item-selected-new';
						if (scope.float == 'left') {
							scope.switchBorder = 'v3-switch-new-left';
						} else {
							scope.switchBorder = 'v3-switch-new';
						}
						scope.itemsSeparator = 'v3-switch-slider-item-sep';
						scope.lastItem = 'v3-switch-last';
					}
				};

				//watch switchDisabled to update when toggle enabled/disabled
				var stopWatching = scope.$watch('switchDisabled', function() {
					$( "#v3-switch-slider-" + scope.switchName ).width("0");
					//remove all class
					if(scope.prevSelectedItem){
						scope.prevSelectedItem.removeClass(scope.selectedClass);
					}
					if(scope.switchContainer){
						scope.switchContainer.removeClass(scope.switchBorder);
					}
					var i = 0;
					for(i; i < scope.switchItemsLength; i++){
						scope.prevSelectedItem = element.find('#switch-' + scope.switchName + '-' + i);
						scope.prevSelectedItem.removeClass(scope.itemsSeparator);

						if(i == scope.switchItemsLength-1){
							scope.prevSelectedItem.removeClass(scope.lastItem);
						}
					}
					//toggle class
					scope.toggleClass();

					scope.highlightSelected();
					if(scope.alwaysWatch == false)
						stopWatching();
				});

				//find the length of longest item to define the width for all items
				scope.findLongestItem = function findLongestItem () {
					scope.lgth = 0;
					for (var j = scope.switchItemsLength - 1; j >= 0; j--) {
						scope.switchOptions[j].translate = $translate.instant(scope.prefix+'.'+scope.switchOptions[j].key.toString());
						if(scope.switchOptions[j].translate.length > scope.lgth){
							scope.lgth = scope.switchOptions[j].translate.length;
						}
					}
					scope.lgth += 1;
				};

				scope.highlightSelected = function highlightSelected () {
					//add border
					scope.switchContainer = element.find('#switch-' + scope.switchName);
					scope.switchContainer.addClass(scope.switchBorder);

					//find the longest length
					if(!scope.lgth || scope.LiferayFake === true){
						scope.findLongestItem();
					}
					scope.lgth = 100 / scope.switchItemsLength;
					//add item separators
					var i = 0;
					for(i; i < scope.switchItemsLength; i++){
						scope.Item = element.find('#switch-' + scope.switchName + '-' + i);

						// var obj= document.createElement('select');
						// scope.Item.style.width= '100px' ;
						/*scope.Item.css('width', scope.lgth * 8 + 'px');*/
						scope.Item.css('width', scope.lgth  + '%');
						if(scope.switchOptions[i].key == scope.switchModel){
							if(scope.prevSelectedItem){
								scope.prevSelectedItem.removeClass(scope.selectedClass);
							}
							scope.prevSelectedItem = scope.Item;
							//add selected class for selected item
							scope.prevSelectedItem.addClass(scope.selectedClass);
						}
						//add item separators
						if(i < scope.switchItemsLength-1){
							scope.Item.addClass(scope.itemsSeparator);
						}
						else{
							//last item dont have separator
							scope.Item.addClass(scope.lastItem);
						}
						//change switch item base on longest item
						//changeCSS('.v3-switch-item-new', 'width', scope.lgth*10 + 'px !important');
					}
				};

				//highlight selected item when render finished
				$timeout(scope.highlightSelected, 0);


			};
			scope.chooseSwitch = function toggleSwitch(index, selectedValue) {
				scope.firstTimeRender = false;
				if((scope.switchDisabled == false && scope.switchModel != selectedValue) || (scope.LiferayFake === true && (scope.switchDisabled == false && scope.switchModel != selectedValue))){

					//set width for slider
					if(!scope.sliderWidth || scope.LiferayFake === true){
						scope.sliderWidth = element.find('#switch-' + scope.switchName + '-' + index).width();
						$( "#v3-switch-slider-" + scope.switchName ).width( scope.sliderWidth);
					}

					//move slider to selected option
					$( "#v3-switch-slider-" + scope.switchName ).animate({ left: element.find('#switch-' + scope.switchName + '-' + index)[0].offsetLeft });

					if(scope.prevSelectedItem){
						scope.prevSelectedItem.removeClass(scope.selectedClass);
					}
					//set selected item
					scope.prevSelectedItem = element.find('#switch-' + scope.switchName + '-' + index);
					scope.prevSelectedItem.addClass(scope.selectedClass);
					//bind value to model
					scope.switchModel = selectedValue;					
					if(scope.switchMeta != undefined) {
						scope.switchMeta.errorCode = '';
						if(commonService.hasValueNotEmpty(selectedValue))
							scope.validStatus = "VALID";
						else
							scope.validStatus = "INVALID";
						
						scope.$parent.changeStatus(scope.validStatus);
					}
				}
			};
		}
	};
}])
.directive('v3SwitchNew', ['$parse', '$timeout', '$translate', '$filter', '$window', '$document',
    function($parse, $timeout, $translate, $filter, $window, $document) {
  return {
        restrict: 'E',
        scope: {
            switchModel: '=',
            switchDisabled: '=',
            switchOptions: '=',
            alwayWatch: '@',
            prefix:'@',
            switchPosition: "@switchPosition",
            moreAction: '&'//the function(from controller) you want to call in directive
        },
        templateUrl: resourceServerPath + '/view/templates/v3_switch_button.html',
        link: function(scope, element, attrs) {
        	
        	scope.LiferayFake = true; //TODO Liferay.Fake;
	          
	        var stopWatchingOption = scope.$watch("switchOptions",
	    		 function handleFooChange( newValue, oldValue ) {
	            	 if(newValue != undefined && newValue[0] != undefined){
	            		 scope.renderSwitch();
	            		 stopWatchingOption();
	            	 }                  
	             }
	        );
	        
	         scope.$on("changeLanguage", function handleChangeLanguageEvent(event) {
	        	 scope.renderSwitch();
	         })
	         
	        scope.renderSwitch = function(){
	          //translate list
	          translateItems();
	          function translateItems(){
		          //check if list is array or not
		          if(!angular.isArray(scope.switchOptions)){
		            var item=scope.switchOptions;
		            scope.switchOptions=[];
		            scope.switchOptions.push(item);
		          }
		          //add file translate to list
		          if(scope.switchOptions[0]){
		            for (var int = 0; int < scope.switchOptions.length; int++) {
		              scope.switchOptions[int].translate=$translate.instant(scope.prefix+'.'+scope.switchOptions[int].key.toString());
		            }
		          }
		          
		          /*this.findElementInElement(lazyList,[lazyChoiceField])['Option']=fieldNode;*/
	            }
	          
	          if (!scope.switchName) {
	        	  scope.switchName = (0|Math.random()*9e6).toString(36);
	          }
	          
	            scope.$watch('switchModel', function() { 
	              
	              if(scope.switchOptions != undefined){   // dnguyen98: check value of switchModel for init highlightSelected
	                scope.switchItemsLength = scope.switchOptions.length;
	             
	                scope.highlightSelected();
	              }
	              //call function
	              if(scope.moreAction){
	                scope.moreAction({});
	              }
	              
	              if( scope.switchModel === "" && scope.selectedClass){
	                scope.clearSelect();
	              }
	            }); 
	            
	            scope.clearSelect = function clearSelect (){
	              scope.prevSelectedItem.removeClass(scope.selectedClass);
	              scope.prevSelectedItem.removeClass(scope.switchBorder);
	              scope.prevSelectedItem.removeClass(scope.lastItem);
	              scope.prevSelectedItem.addClass(scope.itemsSeparator);
	              $( "#v3-switch-slider-" + scope.switchName ).width(0);
	            }
	
	            
	            scope.showSwitch = false;
	            //class for selected and unselected 
	            scope.selectedClass = undefined;
	            scope.switchBorder = undefined;
	            scope.separator = undefined;
	            scope.prevSelected = undefined;
	            scope.showMasked = false;
	            scope.buttonCaretIconClass = undefined;
	            scope.alwaysWatch = scope.$eval(scope.alwayWatch);
	
	            scope.toggleClass = function toggleClass () {
	                //defind class for disabled/ enabled
	                if(scope.switchDisabled == true){
	                    scope.selectedClass = 'v3-switch-item-selected-disabled';
	                    scope.switchBorder = 'v3-switch-new-disabled';
	                    scope.itemsSeparator = 'v3-switch-item-sep-disabled';
	                    scope.lastItem = 'v3-switch-last-disabled';
	                    scope.buttonCaretIconClass = 'v3-switch-button-disable';
	                    angular.element(element).find('input').css({"cursor":"not-allowed"});
	                    angular.element(element).find('i').css({"color": "#999", "cursor":"not-allowed"});
	                }
	                else{
	                    scope.selectedClass = 'v3-switch-item-selected-new';
	                    scope.switchBorder = 'v3-switch-new';
	                    scope.itemsSeparator = 'v3-switch-item-sep';
	                    scope.lastItem = 'v3-switch-last';
	                    scope.buttonCaretIconClass = "";
	                }
	            }
	
	            //watch switchDisabled to update when toggle enabled/disabled 
	            var stopWatching = scope.$watch('switchDisabled', function() {  
	
	                //remove all class 
	                if(scope.prevSelectedItem){
	                    scope.prevSelectedItem.removeClass(scope.selectedClass);
	                }
	                if(scope.switchContainer){
	                    scope.switchContainer.removeClass(scope.switchBorder);
	                }
	                var i = 0;
	                for(i; i < scope.switchItemsLength; i++){
	                    scope.prevSelectedItem = element.find('#switch-' + scope.switchName + '-' + i);
	                    scope.prevSelectedItem.removeClass(scope.itemsSeparator);
	
	                    if(i == scope.switchItemsLength-1){
	                        scope.prevSelectedItem.removeClass(scope.lastItem);
	                    }
	                }
	                //toggle class 
	                scope.toggleClass();
	                scope.highlightSelected();
	                if(scope.alwaysWatch == false)
	                    stopWatching();
	            });
	
	            //find the length of longest item to define the width for all items
	            scope.findLongestItem = function findLongestItem () {
	                scope.lgth = 0;
	                for (var j = scope.switchItemsLength - 1; j >= 0; j--) {
	                    if(scope.switchOptions[j].translate.length > scope.lgth){
	                      if(scope.switchOptions[j].translate.length > 15){
	                        scope.lgth = 15;
	                      }else{
	                         scope.lgth = scope.switchOptions[j].translate.length + 3;
	                      }
	                    }    
	                };
	            }
	
	            scope.highlightSelected = function highlightSelected () {
	              scope.switchButton = element.find("#switch-button-" + scope.switchName);
	              scope.switchButtonIcon = element.find("#switch-button-icon-" + scope.switchName);
	              scope.switchButtonInput = element.find("#switch-button-input-" + scope.switchName);
	              //find the side to expand switch (left/right)
	              if(scope.switchOptions.length > 3 ){
	                 var switchPosLeft = scope.switchButton.offset().left;
	                   var switchPosRight =$window.innerWidth -  scope.switchButton.offset().left;
	                   if(switchPosLeft >  switchPosRight){
	                     scope.switchPosition = "right";
	                   }else{
	                     scope.switchPosition = "left";
	                   }
	              }else{
	                scope.switchPosition = "left";
	              }
	             
	              //add class for switch container
	     
	               scope.switchButtonConatiner = element.find("#switch-button-containner-" + scope.switchName);
	               scope.switchButtonIcon.addClass(scope.buttonCaretIconClass);
	               scope.switchButtonInput.addClass(scope.buttonCaretIconClass);
	               
	               scope.switchButtonConatiner.addClass('v3-switch-container-' + scope.switchPosition);
	              
	               //add border
	                scope.switchContainer = element.find('#switch-' + scope.switchName);
	                scope.switchContainer.addClass(scope.switchBorder);
	                    
	                scope.switchButtonConatiner = element.find("#switch-button-containner-" + scope.switchName);
	                  
	                  scope.switchButtonConatiner.addClass('v3-switch-container-' + scope.switchPosition);
	                  scope.switchButton.addClass('v3-switch-button-' + scope.switchPosition);
	                  scope.switchContainer.addClass('v3-switch-animation-' + scope.switchPosition);
	              
	                //find the longest length
	                if(!scope.lgth || scope.LiferayFake === true){
	                    scope.findLongestItem();
	                }
	
	                //add item separators
	                var i = 0;
	                for(i; i < scope.switchItemsLength; i++){
	                    scope.Item = element.find('#switch-' + scope.switchName + '-' + i);

	                    scope.Item.css('width', scope.lgth*10 + 'px');
	                    if(scope.switchOptions[i].value == scope.switchModel){
	                      if(scope.prevSelectedItem){
	                            scope.prevSelectedItem.removeClass(scope.selectedClass);
	                        }
	                        scope.prevSelectedItem = scope.Item;
	                        //add selected class for selected item
	                      //need test
	                        scope.prevSelectedItem.addClass(scope.selectedClass);
	                      
	                        //set Value for input switch
	                        scope.switchModelButton = scope.switchOptions[i].translate;
	                        scope.prevSelected = scope.switchModel;
	                    }
	                    //add item separators
	                    if(i < scope.switchItemsLength-1){
	                        scope.Item.addClass(scope.itemsSeparator);
	                    }
	                    else{
	                        //last item dont have separator
	                        scope.Item.addClass(scope.lastItem);
	                    }
	                    //change switch item base on longest item
	                    //changeCSS('.v3-switch-item-new', 'width', scope.lgth*10 + 'px !important');
	                }
	            }
	
	            //highlight selected item when render finished
	            $timeout(scope.highlightSelected, 0);
	        }
	        //change switch value
	        scope.chooseSwitch = function chooseSwitch(index, selectedValue) {
	           if(scope.switchDisabled == false){
	             scope.showMasked = false;
	             //hide switch bar
	             //scope.prevSelectedItem = scope.switchModel; 
	             
	             scope.switchContainer.removeClass('v3-switch-animation-' + scope.switchPosition + '-active');
	
	             scope.switchButton.addClass('v3-switch-button-ontop');
	                if(scope.prevSelectedItem){
	                    scope.prevSelectedItem.removeClass(scope.selectedClass);
	                }
	                //set selected item
	                scope.prevSelectedItem = element.find('#switch-' + scope.switchName + '-' + index);
	                scope.prevSelectedItem.addClass(scope.selectedClass);
	                
	                //bind value to model
	                scope.switchModel = selectedValue;	                
	                scope.switchModelButton = $translate.instant(scope.prefix+'.'+selectedValue);//set value for switch input field	               	               
	            }
	        }
	        //show switch bar
	        scope.open = function () {
	          if(scope.switchDisabled == false){
	            scope.showMasked = true;
	            scope.switchButton.removeClass('v3-switch-button-ontop');
	            scope.switchContainer.toggleClass('v3-switch-animation-' + scope.switchPosition + '-active');
	            }
	        }
	        scope.close = function () {
	          if(scope.switchDisabled == false){
	            scope.showMasked = false;
	            scope.switchButton.addClass('v3-switch-button-ontop');
	            scope.switchContainer.removeClass('v3-switch-animation-' + scope.switchPosition + '-active');
	            }
	        }
        }
    };
}])
.directive('pls', ['$document', '$timeout', function ($document, $timeout) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                items: '=',
                id: '@',
                hoverTimeout: '@',
                openMode: '@',
                gridColumns: '@',
                showFlag: '@',
                selectedLang: '@'
            },
            controller: ['$scope', function ($scope) {
                var selectedLang = $scope.selectedLang;
                var columns = Math.round($scope.items.length / parseInt($scope.gridColumns));
                var hoverTimeout = $scope.hoverTimeout;
                if (!hoverTimeout) {
                    hoverTimeout = 200;
                }

                var hoverTimeoutPromise = null;
                var documentClickHandler = function () {
                    closePopup();
                    $scope.$apply();
                };
                var documentKeyHandler = function (evt) {
                    if (evt.keyCode === 27) {
                        closePopup();
                        $scope.$apply();
                    }
                };

                var prepareModel = function () {
                    $scope.model = {
                        opened: false,
                        selectedLang: null,
                        showFlag: ($scope.showFlag === 'true'),
                        columns: []
                    };

                    var column = [];
                    var i = 1;
                    angular.forEach($scope.items, function (item) {
                        item.selected = false;
                        if (!$scope.model.selectedLang && item.id === selectedLang) {
                            item.selected = true;
                            $scope.model.selectedLang = item;
                        }
                        column.push(item);
                        if (i % columns === 0) {
                            $scope.model.columns.push(column);
                            column = [];
                        }
                        i++;
                    });
                    if (column.length > 0) {
                        $scope.model.columns.push(column);
                        column = null;
                    }
                    if (!$scope.model.selectedLang) {
                        $scope.model.selectedLang = $scope.items[0];
                        $scope.items[0].selected = true;
                    }
                };

                var openPopup = function () {
                    if (!$scope.model.opened) {
                        $scope.$emit('pls.popupOpening', {id: $scope.id});
                        $scope.model.opened = true;
                        $document.on('click', documentClickHandler);
                        $document.on('keydown', documentKeyHandler);
                        $scope.$emit('pls.popupOpened', {id: $scope.id});
                    }
                    return false;
                };

                var closePopup = function () {
                    if ($scope.model.opened) {
                        $scope.$emit('pls.popupClosing', {id: $scope.id});
                        $document.off('click', documentClickHandler);
                        $document.off('keydown', documentKeyHandler);
                        $scope.model.opened = false;
                        $scope.$emit('pls.popupClosed', {id: $scope.id});
                    }
                    return false;
                };

                $scope.onMouseEnterOrLeave = function (mouseEnter) {
                    if (mouseEnter) {
                        if (hoverTimeoutPromise) {
                            $timeout.cancel(hoverTimeoutPromise);
                            hoverTimeoutPromise = null;
                        }
                        openPopup();
                    } else {
                        if (!hoverTimeoutPromise) {
                            hoverTimeoutPromise = $timeout(function () {
                                closePopup();
                            }, hoverTimeout);
                        }
                    }
                    return false;
                };

                $scope.onClick = function (evt) {
                    evt.stopPropagation();
                    if (!$scope.model.opened) {
                        openPopup();
                    } else {
                        closePopup();
                    }
                    return false;
                };

                $scope.onLanguageChanged = function (evt, selectedLang) {
                    evt.stopPropagation();
                    closePopup();
                    angular.forEach($scope.items, function (item) {
                        item.selected = false;
                    });
                    selectedLang.selected = true;
                    $scope.model.selectedLang = selectedLang;
                    $scope.$emit('pls.onLanguageChanged', {
                        id: $scope.id,
                        lang: angular.copy(selectedLang)
                    });
                    return false;
                };

                prepareModel();
            }],
            template: function (context, $scope) {
                var template = '<div class="polyglot-language-switcher ng-polyglot-language-switcher">';
                if ($scope.openMode === 'hover') {
                    template += '<a class="pls-selected-locale" href="#" data-ng-mouseenter="onMouseEnterOrLeave(true)" data-ng-mouseleave="onMouseEnterOrLeave(false)"><img data-ng-if="model.showFlag" data-ng-src="{{model.selectedLang.flagImg}}" alt="{{model.selectedLang.flagTitle}}"> {{model.selectedLang.name}}</a>' +
                    '<div class="pls-language-container-scrollable" data-ng-show="model.opened" data-ng-mouseenter="onMouseEnterOrLeave(true)" data-ng-mouseleave="onMouseEnterOrLeave(false)">';
                } else if ($scope.openMode === 'click') {
                    template += '<div layout="row" class="pls-selected-locale" href="#" data-ng-click="onClick($event)">'
                      +'<div class="flag-dropdown f15" layout="column" layout-align="center center" flex="15" style="margin-right:10px;">'
            + '<div class="selected-flag">'
            +   '<div style="width: 16px !important" class="{{model.selectedLang.flagImg}}">'
            +     '<span ng-click="setValue(item.value)" class="ipos_flag"></span>'
            +   '</div>'
            + '</div>'
            +'</div>'
                      +'<div>{{model.selectedLang.name}}</div>' 
                      +'</div>'+
                    '<div class="pls-language-container-scrollable" data-ng-show="model.opened">';
                }
                template += '<div class="pls-language-container" >'
                      + '<div data-ng-repeat="column in model.columns">'
                      +     '<div data-ng-repeat="item in column" data-ng-click="onLanguageChanged($event, item)" layout="column" class="select_hover" layout-align="center center">'
                      +       '<div layout="row" data-ng-class="item.selected? \'pls-selected-locale\':\'\'">'
                            +         '<div layout-margin class="flag-dropdown f15" layout="column" layout-align="center center" flex="15">'
                            +             '<div class="selected-flag">'
                            +                 '<div style="width: 16px !important" class="{{item.flagImg}}">'
                            +                     '<span ng-click="setValue(item.value)" class="ipos_flag"></span>'
                            +                 '</div>'
                            +             '</div>'
                            +         '</div>'
                            +         '<div flex="85"><a>{{item.name}}</a><div>' 
                            +       '</div>'
                            +     '</div>'
                            + '</div>'
                            +'</div>' 
                            +'</div>';
                return template;
            }
        };
}])

.directive("ngNewdropdown", ['$compile', '$http','$translate','$filter' , '$parse', '$timeout', 'commonService', '$log', function($compile, $http,$translate,$filter, $parse, $timeout, commonService, $log){
  var templateLoader, templateText;
  return{
    restrict: "E",
    scope: {
        model:"=",
        filename: '=filename',
        disable:'=disable',
        listItems:"=?list",
        type:"@type",
        prefix:"@prefix",
        key:"@key",
        sort:"@sort",
        moreAction: '&'//the function(from controller) you want to call in directive
    },
    templateUrl: resourceServerPath + 'view/templates/commonDropdown.html',  
    link: function(scope, element, attrs){
      scope.LiferayFake = true; //TODO Liferay.Fake;
      scope.items = scope.listItems==undefined ? []:scope.listItems;
      scope.type=attrs.type;
      scope.prefix=attrs.prefix;
      scope.isRegular=scope.type=='regular';
      scope.moduleService=scope.$parent.moduleService;
      scope.showAppend = false;
      scope.isOpen = false;
      scope.search = {};
      if (scope.type=='full-flag' || scope.type=='nonFlag' || scope.type=='table') {
    	  scope.value=scope.model ? scope.model.value : undefined; //apply for V4 dataModel
    	  /*scope.model.value = scope.model.value == null? "": scope.model.value;//prevent null value show on screen
*///        scope.value=scope.model ? scope.model.Value : undefined;
        translateAndOrderItems();
      }
      scope.$on("changeLanguage", function handleChangeLanguageEvent(event) {
    	  translateAndOrderItems();
      })
      
    //prevent double click whithin 1s, this bug appear in samsung tablet, when user click 1 device detect as double clicks
      scope.isContinue = true;
      function doFreeze (){
    	  if(scope.isContinue == true){
    		  scope.isContinue = false;
    		  $timeout(function() {
            	  scope.isContinue = true; 
              }, 1000);
    	  }
      }
      
      element.bind('click',function($event){
		 if(scope.isContinue == true){
			 doFreeze();
			 scope.items = scope.listItems;
 	        translateAndOrderItems(); 
 	        if (scope.disable!==true) {
 	          templateLoader.then(function (){
 	            scope.showDropdown($event);
 	          });
 	        }
		 }
    	
      });
      
      scope.$watch('disable', function() {  
    	  scope.setCSS();
      });
			
      scope.setCSS = function (){
    	  if (scope.disable){
    		  angular.element(element).children().css({"background-color": "#eeeeee","cursor":"not-allowed"});
    		  angular.element(element).children().find('i').css({"color": "#999"});
    	  }else{
    		  angular.element(element).children().css({"background-color": "white","cursor":"pointer"});
    		  angular.element(element).children().find('i').css({"color": "#004fb6"});
    	  }
      }
      scope.setCSS();
			
      scope.setValue = function (item){
    	  if (scope.type=='regular' ||scope.type=='irregular') {
    		  scope.model=item;
    	  }else{
    		  scope.displayValue = $translate.instant(attrs.prefix+'.'+item);
    		  scope.model.value=item; //Apply for V4 model
//    		  scope.model.Value=item;
    		  scope.value=item;
    	  }

    	  $('#append-items').remove();
    	  scope.showAppend = false;
    	  scope.isOpen = false;
    	  //	call function from controller
    	  if(scope.moreAction){
    		  scope.moreAction({});
    	  }
      };
    
      templateLoader = $http.get(resourceServerPath + 'view/workspaces/template/newLongDropdown.html')
          .success(function(html) {
            templateText = html;
          }).error(function(){
            $log.error("File not found!");
          });
      //translate list before displaying in the view
      function translateAndOrderItems(){
        //check if list is array or not
        if(!angular.isArray(scope.items)){
          var item=scope.items;
          scope.items=[];
          scope.items.push(item);
        }
        //add file translate to list
        for (var int = 0; int < scope.items.length; int++) {
        	if (attrs.prefix  && (scope.items[int].key || scope.items[int].key == "")){
        		  if (scope.items[int].key != "N.A.") {
        			  var key = scope.items[int].key == ""? "null":scope.items[int].key;
        	          scope.items[int].translate=$translate.instant(attrs.prefix+'.'+ key);
    	          } else {
    	            scope.items[int].translate = "Not Available";
    	          }
        	}
        }
        //sort items in list
        if(scope.sort != "false"){
          scope.items = $filter('orderBy')(scope.items,'translate');
        }
      }
      scope.showDropdown = function($event){
    	//reset search
    	scope.search = {};
        scope.showAppend = true;
        scope.isOpen = true;
        scope.showSearchBox = true;
        scope.valueSelectedBefore = undefined;
        
        //get current level of clicked DOM
        var levels=['level-1','level-2','level-3','level-4','level-5'];
        var currentLevel= 'level-2';
        var currentBackgroundColor = getComputedStyle($event.currentTarget).getPropertyValue("background-color");
        var curentLevelIndex=levels.indexOf(currentLevel);
        var childLevel=levels[curentLevelIndex+1];
        var isChildOpened=false;
        isChildOpened=document.getElementsByClassName(childLevel).length>0 ? true:false;
        var arrowPositionX = $event.currentTarget.offsetLeft+($event.currentTarget.offsetWidth/2.4);
        var arrowPositionY = $event.currentTarget.offsetTop + $event.currentTarget.offsetHeight + 11;

        if (!isChildOpened) {
        	 var itemTarget = $event.currentTarget;
             var tempTarget = $event.currentTarget;
             var targetId = angular.element($event.currentTarget).scope().$id;
             while (angular.element(tempTarget.parentElement).scope().$id == targetId) {
          	   tempTarget = tempTarget.parentElement;
          	   if (angular.element(tempTarget).hasClass("v3-column-content")) {
          		   itemTarget = tempTarget;
          	   }
             }
             var currentOffsetTop = itemTarget.offsetTop;
             var globalOffsetTop = $(itemTarget).offset().top;
               var temp=[];
               var check=true;
               var objectOfSameLevel=document.getElementsByClassName("v3-column-content");
               var objectLength=objectOfSameLevel.length;
               for (var i = 0; i < objectLength; i++) {
                 if (objectOfSameLevel[i].offsetTop == currentOffsetTop) {
              	   if ($(objectOfSameLevel[i]).offset().top == globalOffsetTop)
              	   temp.push(objectOfSameLevel[i]);
                  }         
               }
               scope.child=childLevel;
               scope.child2=childLevel;
             if (scope.items.length<20) {
            	 scope.isLong=false;
             }else{
            	 scope.isLong=true;
             }
             var styleForTypeTable = "";
             if(scope.type=="table" && $event.currentTarget.parentElement.parentElement.tagName=="TR"){
            	 var maxWidth = $event.currentTarget.parentElement.parentElement.offsetWidth;
            	 styleForTypeTable = "z-index: 100;position: absolute;max-width: " + maxWidth + "px;";
             }else if(scope.type=="table" && $event.currentTarget.id=="dropDownDashboard"){
            	 //This is config for longDropDown V4 Dashboard
            	 var maxWidth = $event.currentTarget.parentElement.parentElement.offsetWidth;
            	 styleForTypeTable = "z-index: 100;position: fixed;max-width: " + maxWidth + "px;";
            	 scope.showSearchBox = false;
            	 
            	 //raise value selected            	 
            	 scope.valueSelectedBefore=$translate.instant(scope.prefix+'.'+scope.model.value);//for V4 DataModel
            	 
            	 //End config longDropDown V4 Dashboard
             }
             var appendObject="<div style='" + styleForTypeTable + "margin-bottom:20px;padding-left:0px;padding-right:0px' id='append-items' class='col-xs-12 col-sm-12 col-md-12 col-lg-12 level-2-wrapper animated fadeIn'>" +
                        "<div style='padding-bottom:10px' class='box-detail wrapper-detail md-whiteframe-z3 " + scope.child +
                        "'> <div id='common-dropdown' class='container-fluid' style='overflow-y: auto; overflow-x: hidden; max-height: 300px;padding-left:0px'>"+templateText+"</div></div>" +                          
                        "</div>";
           
             var compile=$compile(appendObject)(scope); 
             if(scope.type=="table" && $event.currentTarget.parentElement.parentElement.tagName=="TR"){            	 
            	 angular.element($event.currentTarget.parentElement.parentElement).after(compile);
             }else{
            	 angular.element(temp[temp.length-1]).after(compile);
             }
             setTimeout(function(){
            	var value=undefined;
	            if (scope.type=='regular') {
	              if (scope.model!==undefined) {
	                value=scope.model[scope.key];
	              }           
	            }else if (scope.type=='irregular') {
	              if (scope.model!==undefined) {
	                value=scope.moduleService.findElementInElement(scope.model,[scope.key]).$;
	              }           
	            }else{
	            	value=$translate.instant(scope.prefix+'.'+scope.model.value);//for V4 DataModel
//	            	value=$translate.instant(scope.prefix+'.'+scope.model.Value);
	            }
	            
	            $log.debug(value);
	            $('.flag-box > span').each(function(){
	              if(value==$(this).text()){
	                $(this).parent().parent().css({'background-color':'rgb(18, 50, 116)','color':'white'});
	              }
	            });
	            
	            $('.nonFlag > div> span').each(function(){
	              if(value==$(this).text()){
	                $(this).parent().parent().css({'background-color':'rgb(18, 50, 116)','color':'white'});
	              }
	            });
           }, 3000);
             
        }else{
          scope.isContinue = true; 
          $('#append-items').remove();
        }
      //append child div to the next row of clicked DOM
            
      };
      
      // Dropdown dow will close if click outside  
      window.onclick = function(event) {
    	  // if click to search box => not close
    	  if(!event.target.attributes.id){return;}
		  
    	  if(event.target.attributes.id.textContent == "new-dropdown-search-box"){
    		  return;
    	  } else {
    		  // if click outside 
    		  var scope = angular.element(document.getElementById('append-items')).scope();
    		  if(scope != undefined && scope.showAppend == true && scope.isOpen == true){
    			  scope.showAppend = false;
    			  return;
    		  } else  if(scope != undefined){
    			  $('#append-items').remove();
    			  scope.isOpen = false;
    			  return;
    		  }
    	  }
      };
    }
  };
}])

.directive("card", ['$log', '$compile', 'commonService', 'uiRenderPrototypeService', 'uiFrameworkService', '$timeout',
  function($log, $compile, commonService, uiRenderPrototypeService, uiFrameworkService, $timeout) {   

    /**
     * set card's visible to 'true' or 'false'
     * @param {Object}  jqEle       jquery element
     * @param {boolean}  isVisible  true or false
     */
    function setHtmlEleVisible(jqEle, isVisible) {
      isVisible ? jqEle.css("display", "initial") : jqEle.css("display", "none");
    }

    return {
        restrict: 'E',
        scope: false,
        templateUrl: resourceServerPath + 'view/workspaces/template/card.html',
        link: function(scope, element, attr) {
          uiFrameworkService.isOpenedDetail = false;
          var currCard, visibleWatcherFn;
          scope.setCardVisible = setHtmlEleVisible;

          function setupCard (scope, element, attr) {       

            currCard = scope.card;
            currCard.html = element;
            currCard.scope = scope;

            currCard.level = attr.level;

            currCard.cardStatus = "start";
            currCard.refreshCard = false;
            
            scope.cardElement  = element.find(".v3-live-card-info");

            //update css of selecting & leaf node
            scope.setSelectCss();
            scope.setCssLeafCard();


            var visible = currCard.isVisible;
            //if isVisible is function, continuously watching it
            if (angular.isString(visible)){
              //if visibleWatcherFn is exist, clear the old watching
              if(visibleWatcherFn)
                visibleWatcherFn();

              visibleWatcherFn = scope.$watch(visible, function(_new) {
				if (scope.card.isVisible === visible) {
					scope.card.visible = _new;
					setHtmlEleVisible(element, _new);
				}
              });
            }
            else{
              setHtmlEleVisible(element, visible);
            }
          }
          
          //setup initalized values again
          element.on('$destroy', function() {
            //IVPORTAL-5168: START
            var currCard = scope.card;
            if(currCard){
               currCard.isSelected = false;
               currCard.html = undefined;
               currCard.scope = undefined;
            }
            //IVPORTAL-5168: END
          });
          
        //prevent double click whithin 1s, this bug appear in samsung tablet, when user click 1 device detect as double clicks
          scope.isContinue = true;
          function doFreeze (){
        	  if(scope.isContinue == true){
        		  scope.isContinue = false;
        		  $timeout(function() {
                	  scope.isContinue = true; 
                  }, 1000);
        	  }
          }
            
          element.bind('click', 
            function(event) {
        	  
        	  //fix double clicks on tablet samsung android
        	  if (scope.isContinue == false){
        		  return;
        	  }
        	  
        	  doFreeze();
              $log.debug("Click on card [level: " + currCard.level + ", index: " + scope.$index + "]");

              //User Guide: there are userguide list on Card and @click Button on it, it will return (Since it will do not call other function)
              if (event.target.nodeName == "BUTTON"){
                return;
              }

              if (!currCard.isCardOpenable())
                return;
              
              if (currCard.onOpen === false) { 
            	  return; 
              }

              if(currCard.onOpen && !currCard.isSelected){
                  var isContinue = scope.$eval(currCard.onOpen);

                  switch(true){
                    case isContinue === undefined:
                       scope.isContinueOpenCard(event);
                      break;
                      //stop if return false
                      case isContinue === false:
                        return;

                      //promise case: need to wait before the onOpen functions finish
                      case isContinue.$$state !== undefined:
                          isContinue.then(function () {
                             scope.isContinueOpenCard(event);
                          });
                          break;
                      default:
                         scope.isContinueOpenCard(event);
                  }
              }
              //if doesn't have 'onOpen' attribute, continue
              else{

                  if(currCard.cardType === uiRenderPrototypeService.CONSTANTS.cardType.ACTION 
                    && currCard.onClick){
                      scope.$eval(currCard.onClick);

                      //this card has staticHtml need to render!
                      if(currCard.staticHtml)
                        scope.isContinueOpenCard(event);
                  }
                  else{
                    scope.isContinueOpenCard(event);
                  }
              }
          });           
          
          scope.isContinueOpenCard = function isContinueOpenCard (event) {     
            //set selected or not
            currCard.isSelected = !currCard.isSelected;
            scope.setSelectCss();
            
            if(!currCard.isViewed) currCard.isViewed = true;
            
            //notify other siblings 
            var siblingCards = currCard.parent ? currCard.parent.children : [];
            for (var i = 0; i < siblingCards.length; i++) {
              if(siblingCards[i] !== currCard){                 
                siblingCards[i].isSelected = false;
                siblingCards[i].scope.setSelectCss();
                
                //close all summary preview cgange card type
                //only show card preview on touch on touch device 
                if(commonService.options.cardTouchMode){
                  if(commonService.options.cardPreview){
                     if(currCard.cardStatus == "start"){
                    siblingCards[i].cardStatus = "detail";
                    siblingCards[i].scope.openSummary();
                    siblingCards[i].cardStatus = "start";
                  }
                  if(currCard.cardStatus == "detail"){
                    siblingCards[i].cardStatus = "detail";
                    siblingCards[i].scope.openSummary();
                    siblingCards[i].cardStatus = "start";
                  }
                    if(currCard.cardStatus == "summary"){
                    siblingCards[i].cardStatus = "smallDetail";
                  }
                  
                  if(currCard.cardStatus == "smallDetail"){
      
                    if(siblingCards[i].cardStatus  != "detail"){
                      siblingCards[i].cardStatus = "detail";
                      siblingCards[i].scope.openSummary();
                      siblingCards[i].cardStatus = "smallDetail";
                    }
                  }
                  if(currCard.cardStatus == "smallSummary"){
                    siblingCards[i].cardStatus = "smallDetail";
                    
                  }
                  }else{
                    siblingCards[i].cardStatus = "detail";
                    currCard.cardStatus = "detail";
                  }
                }
              }   
            };
            if(commonService.options.cardTouchMode){
              if(commonService.options.cardPreview){
                if(currCard.cardStatus == "smallSummary" ){
                  currCard.cardStatus = "summary";
                  currCard.prevSmallSummary = "detail";
                }else{
                  currCard.prevSmallSummary = undefined ;
                }
                scope.openSummary ();
              }
            }
            
            //execute the declare function
            scope.$eval(attr.whenClick, {clickEvent: event});
            if(currCard.prevSmallSummary && commonService.options.cardTouchMode)
              currCard.cardStatus = currCard.prevSmallSummary;
        }

		/**
		  * return false when can't set the css (element children can't be found, not render yet)
		  */
		scope.setSelectCss = function setSelectCss () {
			if(element.children().length < 1)
				return false;//check element has value

			var mainCard = element.children().children();
			var cardInfo = mainCard.find(".v3-live-card-info");
			var backgroundInfo = mainCard.css("background");
			if (backgroundInfo !="" && backgroundInfo != "rgba(0, 0, 0, 0)" && backgroundInfo != "white") {
				cardInfo.css("background", backgroundInfo);
			}

			// if (!currCard.isSelected) {
			// 	mainCard.attr('style', 'opacity: 0.6');
			// } else {
			// 	mainCard.attr('style', 'opacity: 1');
			// }
			return true;
		};

          /**
           * return false when can't set the css (element children can't be found, not render yet)
           */
          scope.setCssLeafCard = function setCssLeafCard () {
            if(element.children().length < 1)
              return false;
            
            var mainCard = element.children().children();

            if(scope.isLeafCard()) {
              // Remove small class
              if($(window).width() > 500){
                  scope.maxTrimTextTitle = "22";  
              } else {
                scope.maxTrimTextTitle = "20";
              }
              mainCard.removeClass( "v3-small-live-card-item" ).addClass("v3-live-card-item");
//              currCard.cardStatus = "summary";
            
            }
            else {
              // Set small card
              if($(window).width() > 500){
                scope.maxTrimTextTitle = "40";
              }
              mainCard.removeClass( "v3-live-card-item" ).addClass("v3-small-live-card-item");
              //currCard.cardStatus = "detail";
            }

            return true;
          };

          //change style of summary card base on card's status
          scope.openSummary = function openSummary () {
            if(!commonService.options.cardTouchMode){
              return;
            }
            switch(currCard.cardStatus){
              case "detail":
                element.find(".v3-live-card-info").removeClass("v3-live-card-item-hover").removeClass("v3-small-live-card-item-hover");
                //currCard.cardStatus = "detail";
                break;
              case "start"://open card review
                element.find(".v3-live-card-info").addClass("v3-live-card-item-hover");
                currCard.cardStatus = "summary";
                break;
              case "summary"://
                element.find(".v3-live-card-info").removeClass("v3-live-card-item-hover");
                element.find(".v3-live-card-info").removeClass("v3-small-live-card-item-hover");
                currCard.cardStatus = "detail";
                break;
      
              case "smallDetail":
                element.find(".v3-live-card-info").addClass("v3-small-live-card-item-hover");
                element.find(".v3-small-live-card-item").css("overflow", "visible");
                currCard.cardStatus = "smallSummary";
                break;
            }
          };
          
          scope.isLeafCard = function isLeafCard () {   
            if(uiFrameworkService.isOpenedDetail)
              return false;
            
            if(!scope.viewProp)
              return true;

            return currCard.level == scope.viewProp.viewObject.length - 1;
          }
          
          scope.refreshCard = function refreshCard(){
            var newEl = $compile(template)(scope);
            element.replaceWith(newEl);
          }
                    
          setupCard(scope, element, attr);  
          
          //when import a document, or remove a card in list
          //currCard content will be changed
          scope.$watch(
	        function () {return scope.card;},
	        //re-setup the currCard
	        function(_new, _old){setupCard(scope, element, attr);}
          );

        scope.$watch(
        	function () {return scope.isLeafCard();},
			function(_new, _old){        
			  if(_new === undefined){return;}              
			  scope.setCssLeafCard();
			}
          );                       
        }
    };
}])
.directive("stepCard", ['$log', '$compile', 'commonService', 'uiRenderPrototypeService', 'uiFrameworkService',
  function($log, $compile, commonService, uiRenderPrototypeService, uiFrameworkService) {   

    /**
     * set card's visible to 'true' or 'false'
     * @param {Object}  jqEle       jquery element
     * @param {boolean}  isVisible  true or false
     */
    function setHtmlEleVisible(jqEle, isVisible) {
      isVisible ? jqEle.css("display", "initial") : jqEle.css("display", "none");
    }

    return {
    	
        restrict: 'E',
        scope: false,
        templateUrl: resourceServerPath + 'view/workspaces/template/step-card.html',
        link: function(scope, element, attr) {

          var currCard, visibleWatcherFn;
          scope.setCardVisible = setHtmlEleVisible;

          function setupCard (scope, element, attr) {       

            currCard = scope.card;
            currCard.html = element;
            currCard.scope = scope;
            currCard.level = attr.level;

            currCard.cardStatus = "start";
            currCard.refreshCard = false;
            
            scope.cardElement  = element.find(".v3-live-card-info");

            //update css of selecting & leaf node
            scope.setSelectCss();
            scope.setCssLeafCard();


            var visible = scope.card.isVisible;
            //if isVisible is function, continuously watching it
            if (angular.isString(visible)){
              //if visibleWatcherFn is exist, clear the old watching
              if(visibleWatcherFn)
                visibleWatcherFn();

              visibleWatcherFn = scope.$watch(visible, function(_new) {
                setHtmlEleVisible(element, _new);
              });
            }
            else{
              setHtmlEleVisible(element, visible);
            }
          }
          
          //setup initalized values again
          element.on('$destroy', function() {
            //IVPORTAL-5168: START
            var currCard = scope.card;
            if(currCard){
               currCard.isSelected = false;
               currCard.html = undefined;
               currCard.scope = undefined;
            }
            //IVPORTAL-5168: END
          });
          
          element.bind('click', 
            function(event) {
        	  if (!uiFrameworkService.clickOnNav) {
            	  return;
              }
              uiFrameworkService.clickOnNav = false;
              
              $log.debug("Click on card [level: " + currCard.level + ", index: " + scope.$index + "]");

              //User Guide: there are userguide list on Card and @click Button on it, it will return (Since it will do not call other function)
              if (event.target.nodeName == "BUTTON"){
                return;
              }

              if (!currCard.isCardOpenable())
                return;

              if(currCard.onOpen && !currCard.isSelected){
                  var isContinue = scope.$eval(currCard.onOpen);

                  switch(true){
                    case isContinue === undefined:
                       scope.isContinueOpenCard(event);
                      break;
                      //stop if return false
                      case isContinue === false:
                    	uiFrameworkService.moveToPreviousStep();
                        return;

                      //promise case: need to wait before the onOpen functions finish
                      case isContinue.$$state !== undefined:
                          isContinue.then(function () {
                             scope.isContinueOpenCard(event);
                          });
                          break;
                      default:
                         scope.isContinueOpenCard(event);
                  }
              }
              //if doesn't have 'onOpen' attribute, continue
              else{

                  if(currCard.cardType === uiRenderPrototypeService.CONSTANTS.cardType.ACTION 
                    && currCard.onClick){
                      scope.$eval(currCard.onClick);

                      //this card has staticHtml need to render!
                      if(currCard.staticHtml)
                        scope.isContinueOpenCard(event);
                  }
                  else{
                    scope.isContinueOpenCard(event);
                  }
              }
          });           
          
          scope.isContinueOpenCard = function isContinueOpenCard (event) {     
            //set selected or not
            currCard.isSelected = !currCard.isSelected;
            scope.setSelectCss();
            
            if(!currCard.isViewed) currCard.isViewed = true;
            
            //notify other siblings 
            var siblingCards = currCard.parent ? currCard.parent.children : [];
            for (var i = 0; i < siblingCards.length; i++) {
              if(siblingCards[i] !== currCard){                 
                siblingCards[i].isSelected = false;
                siblingCards[i].scope.setSelectCss();
                
                //close all summary preview cgange card type
                //only show card preview on touch on touch device 
                if(commonService.options.cardTouchMode){
                  if(commonService.options.cardPreview){
                     if(currCard.cardStatus == "start"){
                    siblingCards[i].cardStatus = "detail";
                    //siblingCards[i].scope.openSummary();
                    siblingCards[i].cardStatus = "start";
                  }
                  if(currCard.cardStatus == "detail"){
                    siblingCards[i].cardStatus = "detail";
                    //siblingCards[i].scope.openSummary();
                    siblingCards[i].cardStatus = "start";
                  }
                    if(currCard.cardStatus == "summary"){
                    siblingCards[i].cardStatus = "smallDetail";
                  }
                  
                  if(currCard.cardStatus == "smallDetail"){
      
                    if(siblingCards[i].cardStatus  != "detail"){
                      siblingCards[i].cardStatus = "detail";
                      //siblingCards[i].scope.openSummary();
                      siblingCards[i].cardStatus = "smallDetail";
                    }
                  }
                  if(currCard.cardStatus == "smallSummary"){
                    siblingCards[i].cardStatus = "smallDetail";
                    
                  }
                  }else{
                    siblingCards[i].cardStatus = "detail";
                    currCard.cardStatus = "detail";
                  }
                }
              }   
            };
            if(commonService.options.cardTouchMode){
              if(commonService.options.cardPreview){
                if(currCard.cardStatus == "smallSummary" ){
                  currCard.cardStatus = "summary";
                  currCard.prevSmallSummary = "detail";
                }else{
                  currCard.prevSmallSummary = undefined ;
                }
               // scope.openSummary ();
              }
            }
            
            //execute the declare function
            scope.$eval(attr.whenClick, {clickEvent: event});
            // if(isContinue == false){
            //  currCard.isSelected = !currCard.isSelected;
            //  scope.setSelectCss();
            // }
            if(currCard.prevSmallSummary && commonService.options.cardTouchMode)
              currCard.cardStatus = currCard.prevSmallSummary;
        }
      
  
          /**
           * return false when can't set the css (element children can't be found, not render yet)
           */
          scope.setSelectCss = function setSelectCss () {
            if(element.children().length < 1) 
              return false;//check element has value

            if(currCard.isSelected) {
              var mainCard = element.children().children();
              if(currCard.cardType != 'action') {
                  mainCard.addClass('active');
              }
              
              // Set style class card info
              var cardInfo = mainCard.find(".v3-live-card-info");
              var colorInfo = mainCard.css("background-color");
              if(colorInfo !="" && colorInfo != "rgba(0, 0, 0, 0)" && colorInfo != "white") {
                var borderInfo = "solid 2px " + colorInfo;
                cardInfo.css("color", colorInfo);
                cardInfo.css("border", borderInfo);
              }
            }
            else {
              element.children().children().attr('style', '');
              element.children().children().removeClass('active');
            }      
            return true;                  
          };

          /**
           * return false when can't set the css (element children can't be found, not render yet)
           */
          scope.setCssLeafCard = function setCssLeafCard () {
            if(element.children().length < 1)
              return false;
            
            var mainCard = element.children().children();

            if(scope.isLeafCard()) {
              // Remove small class
              if($(window).width() > 500){
                  scope.maxTrimTextTitle = "22";  
              } else {
                scope.maxTrimTextTitle = "20";
              }
            }
            else {
              // Set small card
              if($(window).width() > 500){
                scope.maxTrimTextTitle = "40";
              }
            }

            return true;
          };

          //change style of summary card base on card's status
          scope.openSummary = function openSummary () {
            if(!commonService.options.cardTouchMode){
              return;
            }
            switch(currCard.cardStatus){
              case "detail":
                break;
              case "start"://open card review
                currCard.cardStatus = "summary";
                break;
              case "summary"://
                currCard.cardStatus = "detail";
                break;
              case "smallDetail":
                currCard.cardStatus = "smallSummary";
                break;

            }

          };
          

          scope.isLeafCard = function isLeafCard () {   
            if(uiFrameworkService.isOpenedDetail)
              return false;
            
            if(!scope.viewProp)
              return true;

            return currCard.level == scope.viewProp.viewObject.length - 1;
          }
          
          scope.refreshCard = function refreshCard(){
            var newEl = $compile(template)(scope);
            element.replaceWith(newEl);
          }
          
                    
          setupCard(scope, element, attr);  
          
          
          //when import a document, or remove a card in list
          //currCard content will be changed
          scope.$watch(
        function () {
            return scope.card;
          },
          function(_new, _old){
                //re-setup the currCard
                setupCard(scope, element, attr);
          }
          );

        scope.$watch(
          function () {
              return scope.isLeafCard();
            },
            function(_new, _old){
        
              if(_new === undefined){
                return;
              }
              
              scope.setCssLeafCard();
            }
          );   
        }
        
    };
}])
.directive("sectionCard", ['$log', '$compile', 'commonService', 'uiRenderPrototypeService', 'uiFrameworkService',
  function($log, $compile, commonService, uiRenderPrototypeService, uiFrameworkService) {   

    /**
     * set card's visible to 'true' or 'false'
     * @param {Object}  jqEle       jquery element
     * @param {boolean}  isVisible  true or false
     */
    function setHtmlEleVisible(jqEle, isVisible) {
      isVisible ? jqEle.css("display", "initial") : jqEle.css("display", "none");
    }

    return {
        restrict: 'E',
        scope: false,
        templateUrl: resourceServerPath + 'view/workspaces/template/section-card.html',
        link: function(scope, element, attr) {

          var currCard, visibleWatcherFn;
          scope.setCardVisible = setHtmlEleVisible;

          function setupCard (scope, element, attr) {       

            currCard = scope.card;
            currCard.html = element;
            currCard.scope = scope;

            currCard.level = attr.level;

            currCard.cardStatus = "start";
            currCard.refreshCard = false;
            
            scope.cardElement  = element.find(".v3-live-card-info");

            //update css of selecting & leaf node
            scope.setSelectCss();
            scope.setCssLeafCard();


            var visible = scope.card.isVisible;
            //if isVisible is function, continuously watching it
            if (angular.isString(visible)){
              //if visibleWatcherFn is exist, clear the old watching
              if(visibleWatcherFn)
                visibleWatcherFn();

              visibleWatcherFn = scope.$watch(visible, function(_new) {
                setHtmlEleVisible(element, _new);
              });
            }
            else{
              setHtmlEleVisible(element, visible);
            }
          }
          
          //setup initalized values again
          element.on('$destroy', function() {
            //IVPORTAL-5168: START
            var currCard = scope.card;
            if(currCard){
               currCard.isSelected = false;
               currCard.html = undefined;
               currCard.scope = undefined;
            }
            //IVPORTAL-5168: END
          });
          
          element.bind('click', 
            function(event) {
                            
              $log.debug("Click on card [level: " + currCard.level + ", index: " + scope.$index + "]");

              //User Guide: there are userguide list on Card and @click Button on it, it will return (Since it will do not call other function)
              if (event.target.nodeName == "BUTTON"){
                return;
              }

              if (!currCard.isCardOpenable())
                return;

              if(currCard.onOpen && !currCard.isSelected){
                  var isContinue = scope.$eval(currCard.onOpen);

                  switch(true){
                    case isContinue === undefined:
                       scope.isContinueOpenCard(event);
                      break;
                      //stop if return false
                      case isContinue === false:
                        return;

                      //promise case: need to wait before the onOpen functions finish
                      case isContinue.$$state !== undefined:
                          isContinue.then(function () {
                             scope.isContinueOpenCard(event);
                          });
                          break;
                      default:
                         scope.isContinueOpenCard(event);
                  }
              }
              //if doesn't have 'onOpen' attribute, continue
              else{

                  if(currCard.cardType === uiRenderPrototypeService.CONSTANTS.cardType.ACTION 
                    && currCard.onClick){
                      scope.$eval(currCard.onClick);

                      //this card has staticHtml need to render!
                      if(currCard.staticHtml)
                        scope.isContinueOpenCard(event);
                  }
                  else{
                    scope.isContinueOpenCard(event);
                  }
              }
          });           
          
          scope.isContinueOpenCard = function isContinueOpenCard (event) {     
            //set selected or not
            currCard.isSelected = !currCard.isSelected;
            scope.setSelectCss();
            
            if(!currCard.isViewed) currCard.isViewed = true;
            
            //notify other siblings 
            var siblingCards = currCard.parent ? currCard.parent.children : [];
            for (var i = 0; i < siblingCards.length; i++) {
              if(siblingCards[i] !== currCard){                 
 //               siblingCards[i].isSelected = false;
//                siblingCards[i].scope.setSelectCss();
                
                //close all summary preview cgange card type
                //only show card preview on touch on touch device 
                if(commonService.options.cardTouchMode){
                  if(commonService.options.cardPreview){
                     if(currCard.cardStatus == "start"){
                    siblingCards[i].cardStatus = "detail";
                    siblingCards[i].scope.openSummary();
                    siblingCards[i].cardStatus = "start";
                  }
                  if(currCard.cardStatus == "detail"){
                    siblingCards[i].cardStatus = "detail";
                    siblingCards[i].scope.openSummary();
                    siblingCards[i].cardStatus = "start";
                  }
                    if(currCard.cardStatus == "summary"){
                    siblingCards[i].cardStatus = "smallDetail";
                  }
                  
                  if(currCard.cardStatus == "smallDetail"){
      
                    if(siblingCards[i].cardStatus  != "detail"){
                      siblingCards[i].cardStatus = "detail";
                      siblingCards[i].scope.openSummary();
                      siblingCards[i].cardStatus = "smallDetail";
                    }
                  }
                  if(currCard.cardStatus == "smallSummary"){
                    siblingCards[i].cardStatus = "smallDetail";
                    
                  }
                  }else{
                    siblingCards[i].cardStatus = "detail";
                    currCard.cardStatus = "detail";
                  }
                }
              }   
            };
            if(commonService.options.cardTouchMode){
              if(commonService.options.cardPreview){
                if(currCard.cardStatus == "smallSummary" ){
                  currCard.cardStatus = "summary";
                  currCard.prevSmallSummary = "detail";
                }else{
                  currCard.prevSmallSummary = undefined ;
                }
                scope.openSummary ();
              }
            }
            
            //execute the declare function
            scope.$eval(attr.whenClick, {clickEvent: event});
            // if(isContinue == false){
            //  currCard.isSelected = !currCard.isSelected;
            //  scope.setSelectCss();
            // }
            if(currCard.prevSmallSummary && commonService.options.cardTouchMode)
              currCard.cardStatus = currCard.prevSmallSummary;
        }
      
  
          /**
           * return false when can't set the css (element children can't be found, not render yet)
           */
          scope.setSelectCss = function setSelectCss () {
              if(element.children().length < 1) 
                return false;//check element has value
              
              var outerBox = element.children().children();
              var mainCard = outerBox.children();
              if(currCard.isSelected) {
            	  mainCard.addClass('active');
              }
              else {
            	  mainCard.removeClass('active');
              }      
              return true;                  
            };

          /**
           * return false when can't set the css (element children can't be found, not render yet)
           */
          scope.setCssLeafCard = function setCssLeafCard () {
          };

          //change style of summary card base on card's status
          scope.openSummary = function openSummary () {
            if(!commonService.options.cardTouchMode){
              return;
            }
            switch(currCard.cardStatus){
              case "detail":
                break;
              case "start":
                currCard.cardStatus = "summary";
                break;
              case "summary":
                currCard.cardStatus = "detail";
                break;
              case "smallDetail":
                currCard.cardStatus = "smallSummary";
                break;

            }
          };

          scope.isLeafCard = function isLeafCard () {   
            if(uiFrameworkService.isOpenedDetail)
              return false;
            
            if(!scope.viewProp)
              return true;

            return currCard.level == scope.viewProp.viewObject.length - 1;
          }
          
          scope.refreshCard = function refreshCard(){
            var newEl = $compile(template)(scope);
            element.replaceWith(newEl);
          }
          
          setupCard(scope, element, attr);  
          
          //when import a document, or remove a card in list
          //currCard content will be changed
          scope.$watch(
        function () {
            return scope.card;
          },
          function(_new, _old){
                //re-setup the currCard
                setupCard(scope, element, attr);
          }
          );

        scope.$watch(
          function () {
              return scope.isLeafCard();
            },
            function(_new, _old){
        
              if(_new === undefined){
                return;
              }
              
              scope.setCssLeafCard();
            }
          );
        }
    };
}])
//http://stackoverflow.com/questions/10629238/angularjs-customizing-the-template-within-a-directive
//http://stackoverflow.com/questions/23065165/angularjs-directive-dynamic-templates
.directive("uiElement", ['$log', '$compile', '$interval', '$timeout', '$translate', 'uiRenderPrototypeService', 
	function($log, $compile, $interval, $timeout, $translate, uiRenderPrototypeService) {

	function insertAt(html, type, str) {
		var index = html.indexOf(type) + type.length;
		return html.substr(0, index) + str + html.substr(index);
	}

	//Dream so far
	var prepareTemplate = function prepareTemplate(uiElement) {
		var htmlContent = uiElement.originalHtmlContent;

		if((
			uiRenderPrototypeService.getUiElementRefDocType(uiElement) === uiRenderPrototypeService.commonService.CONSTANTS.MODULE_NAME.PROSPECT ||
			uiRenderPrototypeService.getUiElementRefDocType(uiElement) === uiRenderPrototypeService.commonService.CONSTANTS.MODULE_NAME.CORPORATE ||
			uiRenderPrototypeService.getUiElementRefDocType(uiElement) === uiRenderPrototypeService.commonService.CONSTANTS.MODULE_NAME.USER ||
			uiRenderPrototypeService.getUiElementRefDocType(uiElement) === uiRenderPrototypeService.commonService.CONSTANTS.MODULE_NAME.APPLICATION
			) && uiElement.type === uiRenderPrototypeService.CONSTANTS.type.INPUT) {
			var wrapContent = {
				start: '<div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 v3-column-content"> <div class="col-xs-offset-1 col-xs-10 v3-column-content"><div class="form-group form-group-lg has-success">',
				end: '</div></div></div>'
			};

			var labelContent = $translate.instant(uiElement.labelKey);
			var mandatory = uiElement.refDetail.meta.mandatory == true ? '*' : '';
			// var labelHtml = '<label>' + labelContent + '<span id="mandatory" class="errorMessage">' + mandatory + '</span></label>';
			var labelHtml = '<label>' + labelContent + '<span id="mandatory">' + mandatory + '</span></label>';

			var placeHolderTxt = uiElement.refDetail.meta.enable == true ? $translate.instant(uiElement.placeholder) : '';
			var bindValue = "uiElement.refDetail." + (uiElement.refDetail.Options ? "Value" : "$");
			//        var disable = uiElement.refDetail.meta.enable == true ? '' : 'disabled';
			var maxlength = uiElement.maxlength ? 'maxlength="' + uiElement.maxlength + '"' : '';
			//        var errMsg = $translate.instant(uiElement.refDetail.errorMessage);

			var inputHtml = '<input type="text" class="form-control" placeholder="' + placeHolderTxt
				+ '" ng-model="' + bindValue + '"' + 'ng-disabled="uiElement.isDisable() || moduleService.freeze == true" ' + maxlength + '/>'
				+ '<span class="errorMessage" ng-bind="uiElement.refDetail.errorMessage | translate"></span>';

			htmlContent = wrapContent.start + labelHtml + inputHtml + wrapContent.end;
		}

		if(uiElement.type === "hyperlink") {
			var wrapContent = {
				start: '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12"> <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12"><div class="form-group form-group-lg has-success">',
				end: '</div></div></div>'
			};

			var labelContent = $translate.instant(uiElement.labelKey);
			var onClick = uiElement.onClick;
			var disableCondition = uiElement.disableCondition;
			var labelHtml = '<a href="" ng-click="' + onClick + '"> <u><i>' + labelContent + '</a>';
			//var labelHtml = '<a href="">' + labelContent + '</a>';

			htmlContent = wrapContent.start + labelHtml + wrapContent.end;
		}

		//Check & set disable element field
		if(uiElement.refDetail && htmlContent && uiElement.type) {
			if (uiElement.refDetail.meta.enable !== true) {
				if (uiElement.type == "v3-switch-new" || uiElement.type == "v3-switch-new-slide") {
					htmlContent = insertAt(htmlContent, uiElement.type, ' switch-disabled="true" ');
				}
				else if (uiElement.type == "ng-newDropDown") {
					htmlContent = insertAt(htmlContent, uiElement.type, ' disable="true" ');
				}
				/*else{
				 htmlContent = insertAt(htmlContent, uiElement.type, ' ng-disabled="true" ');
				 }*/
			}
			else {
				// NOTE: will appear error if "switch-disable" isn't added to htmlContent
				if (uiElement.type == "v3-switch-new" || uiElement.type == "v3-switch-new-slide") {
					htmlContent = insertAt(htmlContent, uiElement.type, ' switch-disabled="false" ');
				}
			}
		}

		return htmlContent;
	};

	function unbindEvents(scope, element) {
		if (scope.stopWatching)
			scope.stopWatching();

		if (scope.bindFn)
			element.unbind("click change", scope.bindFn);
	}

	function bindEvents(refDetail, scope, element) {
		if (refDetail) {
			//first we unbind the old ones
			unbindEvents(scope, element);

			//if uiElement is input field
			if (refDetail.hasOwnProperty('meta') &&
				refDetail.hasOwnProperty('value') &&
				!Array.isArray(refDetail.value)) {
				var watchingFn = function () {
					return refDetail.value
				};

				//watching the detail for showing the red line on input
				scope.stopWatching = scope.$watch(
					watchingFn,
					function (_new, _old) {
						if (_new !== _old) {
							updateView(scope.uiElement);
						}
					}
				);
				
				//update when uiElement init
				if(scope.uiElement.getValue)
					scope.uiElement.updateValue(scope.uiElement.getValue(), false);
			}
			//if uiELement is a BIG object, ex: array
			else {
				scope.bindFn = function ($event) {
					//This area code to close popup Nation Flag selection when clicking outside it
					//if(scope.uiElement.parent.uiEle[1].html.find('.country-list').hasClass)
					updateView(scope.uiElement);
				};

				element.bind("change", scope.bindFn);
			}
//			updateView(scope.uiElement);
		}
	}


	function updateView(uiElement) {
		$log.debug("Update view for UiElement: " + uiElement.name);

		//TODO: need a better way for uiElement to detect change in value itself,
		//not notify by angular event
		if(uiElement.getValue)
			uiElement.updateValue(uiElement.getValue());


		//uiRenderPrototypeService.removeEmptyField(uiElement.parent);
		uiRenderPrototypeService.updateNumberOfEmptyFields(uiElement.parent);
	}

	var linkFn = function linkFn(scope, element, attr) {
		var template = prepareTemplate(scope.uiElement);

		//if template is undefined, don't need to render these content
		if (!template)
			return;

		var newEle = $compile(template)(scope);

		element.replaceWith(newEle);

		scope.uiElement.scope = scope;
		scope.uiElement.html = newEle;

		//setup initalized values again
		newEle.on('$destroy', function () {
			scope.uiElement.html = undefined;
			scope.uiElement.scope = undefined;
		});

		scope.uiElement.onEvent(uiRenderPrototypeService.CONSTANTS.EVENT.DETAIL_CHANGED, function (event) {
			bindEvents(event.data, scope, newEle);
		});

		bindEvents(scope.uiElement.refDetail, scope, newEle);
		scope.uiElement.getIsDisableFn(scope);
		//continuosly watching whether this uiElement is visible on screen or not
		scope.$watch(
			// function(){
			//   return scope.uiElement.isVisibleOnScreen();
			// },
			scope.uiElement.getIsVisibleOnScreenFn()
			,
			function (_new, _old) {
				_new ? newEle.css("display", "") : newEle.css("display", "none");
			}
		);
	};

	return {
		restrict: 'E',
		transclude: 'element',
		scope: false,
		controller :  ['$scope', function ($scope) {
				$scope.registerNewChild = function (child) {
					if(!$scope.childUiElement)
						$scope.childUiElement = [];
					$scope.childUiElement.push(child);
					if($scope.uiElement.validStatus !== child.validStatus) {
						$scope.changeStatus(child.validStatus);
					}
				};
				
				$scope.changeStatus = function (status) {
					if(status === "INVALID"){
						if($scope.uiElement.validStatus !== status){
							$scope.uiElement.validStatus = status;
							$scope.uiElement.updateParentValidStatus($scope.uiElement);
						}
					} else {
						//check all child
						var oldValidStatus = $scope.uiElement.validStatus;
						$scope.uiElement.validStatus = "VALID";
						if($scope.childUiElement != undefined)
							$scope.childUiElement.forEach( function (child, index) {
								if(child.getValidStatus() == "INVALID"){
									$scope.uiElement.validStatus = "INVALID";
								}
							});
						
						if(oldValidStatus !== $scope.uiElement.validStatus){
							$scope.uiElement.updateParentValidStatus($scope.uiElement);
						}
					}
				};
				
				$scope.unregisterChild = function (child) {
					$scope.childUiElement.splice($scope.childUiElement.indexOf(child),1);
				}
			}
		],
		link: linkFn
	};
}])
.directive("cardIcon", ['$log', function($log) {
    return{
      restrict: 'A',
      scope: false,
      link: function(scope, ele, attr) {
        var iconData = scope.$eval(attr.cardIcon);
        if(iconData.content.indexOf("(") != -1){//suport function to return string icon
        	var content = scope.$eval(iconData.content);
        }else{
        	var content = iconData.content;
        }

        var cssClass = iconData.cssClass;
        switch(iconData.contentType){
          case 'text'://case test: like type 1, type 2, ...
            ele.html(content);
            break;
          case 'function'://case content is a result from a dynamic function
            scope.$watch(content, function (_new, _old) {
              ele.html(_new);
            });
            break;
          case 'cssClass':
            cssClass = cssClass + ' ' + content;
            break;
          default:
            $log.error("Icon Content is misconfiguration! (see the data below for more detail)");
            $log.error(iconData);
        }

        //handle css
        ele.addClass(cssClass);

        //handle isVisible att
        //If it's not string --> it's a function need to watch
        if(angular.isString(iconData.isVisible)){          
          scope.$watch(iconData.isVisible, function (_new, _old) {
            _new ? ele.css("display", "") : ele.css("display", "none");
          });
        }

        //handle onClick attribute
        if(iconData.onClick){
          ele.bind('click', function (event) {
            //don't allow the click event affect the main card
            event.stopPropagation();
            
            scope.$eval(iconData.onClick);

            //if parent card has scope (not the root card)
            if (scope.card.parent.scope)
              scope.card.parent.scope.$digest();
            //get the main-ctrl in charge, and digest its children
            else
              scope.getCtrlInCharge().$digest();
          });
        }
      }
    };
}])

.directive("tabIcon", ['$log', function($log) {
    return{
      restrict: 'A',
      scope: false,
      link: function(scope, ele, attr) {
        var iconData = scope.$eval(attr.tabIcon);
        if(iconData.content.indexOf("(") != -1){//suport function to return string icon
        	var content = scope.$eval(iconData.content);
        }else{
        	var content = iconData.content;
        }
        
        var cssClass = 'v3-tab-icon-remove' + ' ' + content;

        //handle css
        ele.addClass(cssClass);

        //handle isVisible att
        //If it's not string --> it's a function need to watch
        if(angular.isString(iconData.isVisible)){          
          scope.$watch(iconData.isVisible, function (_new, _old) {
            _new ? ele.css("display", "") : ele.css("display", "none");
          });
        }

        //handle onClick attribute
        if(iconData.onClick){
          ele.bind('click', function (event) {
            //don't allow the click event affect the main card
            event.stopPropagation();
            
            scope.$eval(iconData.onClick);

            //if parent card has scope (not the root card)
            if (scope.card.parent.scope)
              scope.card.parent.scope.$digest();
            //get the main-ctrl in charge, and digest its children
            else
              scope.getCtrlInCharge().$digest();
          });
        }
      }
    };
}])

.directive('loading', ['$compile', function($compile) {
    return{
      priority: 1,
      //terminal:true,
      restrict: 'A',
      link: function(scope, elm, attr) {
        var clickAction = attr.loadingAction;
        elm.bind('click',function($event){
          //find class by regex
          var totalClass=$("[class*='ipos-partial-loading-selected-']");
          var className='ipos-partial-loading-selected-'+(totalClass.length+1);
          if(elm.attr("class").indexOf("ipos-partial-loading-selected") < 0) {
            angular.element(elm).addClass(className);
          }
          scope.$eval(clickAction);
      });
      }
    };
}])
.directive('format', ['$filter', function($filter) {
    return {
        require: '?ngModel',
        link: function(scope, elem, attrs, ctrl) {
            if (!ctrl) return;

            //model -> view 
            ctrl.$formatters.unshift(function(a) {
              return $filter(attrs.format)(ctrl.$modelValue)
            });
            
            //view -> model
            ctrl.$parsers.unshift(function(viewValue) {
              var plainNumber = viewValue.replace(/[^\d|\-+|\.+]/g, '');
              elem.val( $filter('number')(plainNumber) );
              return plainNumber;
            });
        }
    };
}])
.directive('formatRanking', ['$filter', function($filter) {
    return {
        require: '?ngModel',
        link: function(scope, elem, attrs, ctrl) {
            if (!ctrl) return;

            //model -> view 
            ctrl.$formatters.unshift(function(a) {
              if(a != "")
                return $filter(attrs.formatRanking)(ctrl.$modelValue)
            });
            
            //view -> model
            ctrl.$parsers.unshift(function(viewValue) {
              var plainNumber = viewValue.replace(/[^\d|\-+|\.+]/g, '');
              if(viewValue==""){
                elem.val(plainNumber);
              }else{
                elem.val( $filter(attrs.formatRanking)(plainNumber) );
              }
              return plainNumber;
            });
        }
    };
}])
.directive('clickWhenKeydown',  function() {
  return {
      link: function(scope, element, attrs) {
        element.bind("keyup", function(){
          element.click()
        });
    }
  }
})
.directive('positiveNumber',  function() {
  return {
      require: '?ngModel',
      link: function(scope, element, attrs, ngModelCtrl) {
        if(!ngModelCtrl) {
          return; 
        }
        
        ngModelCtrl.$parsers.push(function(val) {
          var clean = val.replace( /[^0-9]+/g, '');
          if (val !== clean) {
            ngModelCtrl.$setViewValue(clean);
            ngModelCtrl.$render();
          }
          return clean;
        });
        
        element.bind('keypress', function(event) {
          if(event.keyCode === 32) {
            event.preventDefault();
          }
        });
      }
    };
})
.directive('refreshOn', ['$compile', '$parse', function($compile, $parse) {
    return {
        restrict: 'A',
        scope: true,
        compile: function(element) {
            var template = angular.element('<a></a>').append(element.clone()).html();
            return function link(scope, element, attrs) {
                var stopWatching = scope.$parent.$watch(attrs.refreshOn, function(_new, _old) {
                    var useBoolean = attrs.hasOwnProperty('useBoolean');
                    if ((useBoolean && (!_new || _new === false)) || (!useBoolean && (!_new || _new === _old))) {
                        return;
                    }
                    // reset refreshOn to false if we're using a boolean
                    if (useBoolean) {
                        $parse(attrs.refreshOn).assign(scope.$parent, false);
                    }

                    // recompile
                    var newEl = $compile(template)(scope.$parent);
                    element.replaceWith(newEl);

                    // Destroy old scope, reassign new scope.
                    stopWatching();
                    scope.$destroy();

                    //call function after finish render
                    if (attrs.hasOwnProperty('afterRefresh')) {
                        $parse(attrs.afterRefresh)(scope);
                    }

                });
            }
        }
    };
}])
//tphan37: execute functions in controllers when enter
.directive('v3OnEnter', function() {
  return function(scope, element, attrs) {
    element.bind("keydown", 
      function(event) {
        if(event.keyCode == 13 ||event.which == 13){
          scope.$eval(attrs.v3OnEnter, {$event: event});
          return false;
        }
        return true;
      }
    )
  }
})
//dnguyen98: auto focus element Input with expression
.directive('v3AutoFocus', ['$timeout', function($timeout) { 
  return function(scope, element, attrs) {
    scope.$watch(attrs.v3AutoFocus, 
      function () { 
        $timeout(function() {
             element[0].focus();
        });
      },true);
  };    
}])

/**
 * Android app
 * dnguyen98: This directive for list view      
 */
.directive('documentListView', ['$rootScope', '$parse', '$timeout', '$translate', '$filter', '$compile', '$state', 'uiRenderPrototypeService', 'commonService', 'commonUIService', 'AclService', 'paginationService', 'underwritingCoreService', 'loadingBarService','detailCoreService','connectService','policyCoreService','$mdDialog',
	function($rootScope, $parse, $timeout, $translate, $filter, $compile, $state, uiRenderPrototypeService, commonService, commonUIService, AclService, paginationService, underwritingCoreService, loadingBarService,detailCoreService,connectService, policyCoreService,$mdDialog) {
	return {
		restrict: 'E',
		transclude: true,
		replace: false,
		scope: {
			datalist: '=',
			isloadlist: '=?', // hle71 - it is only used in the searchList() function below like an internal variable (just assigning, no usage)
			doctype: '@',
			dashboardstatus: '@',
			listtitle: '@',
			action: '@?',
			datalistsync: '=?',
			moreaction: '&?',
			filterby: '@',
			isdashboard: '@',
			importcaseorfna: '@',
			defaultquery: '@',
			dodedup: '=',
			isdedup: '=',
			ispolicylistnoelstasicsearch: '@',
			dashboarddoctype: '=',
			searchcriteria: '=',			
			lazyChoiceList : '=',
			currentDate: '=',
			extension: '=?' // hle71 - {a: list, b: addNewXXX} - an object that can contains any data type such as an array, a function, a text, a number, etc. 
		},
		controller: ['$scope', function ($scope) {
		
				$scope.filterValueChains = [];
				this.addFilterValueChain = function addFilterValueChain(filterValue) {
					$scope.filterValueChains.push(filterValue);
				};
				
				this.updateView = function () {
					//IUICV-1761 Paging item is displaying wrong value when using filter function. 
					//$scope.currentPage is being 1 but we update 0 is the root cause of -1
					$scope.currentPage = 0;
					$scope.infiniteItems.numLoaded = 0;
					$scope.infiniteItems.toLoad = 0;
					$scope.infiniteItems.items =[];
					$scope.lengthCurrent = 0;
					$scope.isLoad = true ;
					$scope.datalist = $scope.infiniteItems.items;
					$scope.searchList($scope.searchText);
					
				};
			
				
				// lazy load page
				
				$scope.isLoad = true;
				
				
				
				
				$scope.dashboardDoctype=localStorage.getItem("dashboardDoctype");
				
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
			    	            		if(($scope.isLoad) && ($scope.datalist.length > $scope.lengthCurrent ) ){
				    	            		if($scope.datalist.length < $scope.totalItems){
				    	            			$scope.lengthCurrent = $scope.datalist.length;
					    	            		$scope.searchList();
					    	            	} else{ // when totalItems % size == 0
					    	            		$scope.isLoad = false;
					    	            		$rootScope.$broadcast('updateListViewScreen');
					    	            	}
				    	            	} 
			    	            		if(this.items.length < $scope.datalist.length){
			    	            			this.items = $scope.datalist;
					    	                this.toLoad = this.items.length;
					    	                this.numLoaded = this.toLoad;   
			    	            		} else {
			    	            			return;
			    	            		} 			    	            		  				    	                
			    	            }
			    	        }
			    	    };
				// end
			}
		],
		link: function(scope, element, attrs, ctrl) {
			scope.activeRoles = $rootScope.currentRole;
			scope.filter = {isfilterShow : false};
			scope.filterBy = scope.$eval(attrs.filterby);
			scope.filterModel = {};
			if (scope.filterBy){
				scope.filterModel.value = scope.filterBy[0].key;
			}
			scope.isLoad =true;
			scope.dashboardDoctype=localStorage.getItem("dashboardDoctype");
			scope.customerId=JSON.parse( localStorage.getItem('selected_profile')).customerId;
			
			if( JSON.parse( localStorage.getItem('selected_profile')).role=="PO"){
				if(scope.customerId==null){
				scope.userID=true;
				}
				else{
					policyCoreService.getPolicyDetail(JSON.parse(localStorage.getItem('selected_profile')).pasId).then(function(data){
						 for(var i=0;i<data.data.userIdList.length;i++){
							 if(data.data.userIdList[i]==scope.customerId){
								 scope.userID=false;
								 break;
							 }else{
								 scope.userID=true;
								 
							 }
						 }
						
					})
				}
			}else{
				scope.userID=false;
			}
			scope.currentPage = 0;
			scope.totalItems = 0;
			scope.commonService = commonService;
			scope.totalPage = 0;
			scope.pageSizes = [10, 20, 30, 40, 50];
			if(scope.ispolicylistnoelstasicsearch==="true"){
			scope.pageSize = {"size": "50000"};
			}else{
			scope.pageSize = {"size": "200"};
			}
			if (scope.action) {
				scope.templateHtml = 'view/dashboards/partial/'+ scope.doctype +'-' + scope.action +'-list-view.html';
			} else {
				
				if(scope.listtitle === 'my-submitted-case'){
					scope.templateHtml = 'view/dashboards/partial/policynumber-case-list-view.html';
				}else{
					scope.templateHtml = 'view/dashboards/partial/'+ scope.doctype +'-list-view.html';
				}
			}
			scope.templateHtml = resourceServerPath + scope.templateHtml;
			scope.isShowSearchForm = false;
			scope.isListView = true;

			if (scope.isdedup) {
				scope.deduppartial = 'view/dashboards/partial/'+ scope.doctype +'-partial.html';
				scope.deduppartial = resourceServerPath + scope.deduppartial;
			}

			//Add new document by doctype
//			scope.goToState = function(doctype, activeRoles) {
//				$state.go(
//					'root.list.detail',
//					{ docType: doctype, docId: '' },
//					{ reload: true }
//			);
//				activeRoles = activeRoles || scope.activeRoles;
//				commonService.removeLocalStorageVariables();//clear all old values
//				if (scope.dodedup === true) {
//					$state.go('root.list.dedup', {
//						dashboardDocType: scope.dashboarddoctype
//					});
//				} else {
//					commonService.currentState.set(doctype + '-detail');
//					var activeRole = commonUIService.setupAclForDetail(AclService, activeRoles);
//					$state.go('root.list.detail', {
//						docType: doctype,
//						userRole: activeRole
//					});
//				}
		//	};
			scope.approvalToken = function(item){
				
				// TODO: will remove hard code create date and modifyDate, when server returns date format correctly;
				var dataToApprove = {
					  "id" : item.docId,
					  "version" : 0,
					  "metaData" : {
					    "entityType" : null,
					    "entityNumber" : null,
					    "docId" : item.docId,
					    "docType" : null,
					    "docName" : null,
					    "createDate" : item.createDate,
					    "modifyDate" : item.modifyDate,
					    "ownerId" : null,
					    "ownerName" : null,
					    "profileId" : null,
					    "documentStatus" : null,
					    "operationStatus" : null,
					    "businessStatus" : "DR",
					    "productName" : null,
					    "businessType" : null
					  },
					  "name" : item.name,
					  "email" : item.email,
					  "deviceId" : item.deviceId,
					  "token" : item.token,
					  "adminDecision" : "APPROVED",
					  "requestType": item.requestType
				};
				connectService.exeAction({
		            actionName: "GET_RESPONSE_PERMISSION",
		            actionParams: {},
		            data: dataToApprove
		        }).then(function(data){
		        	console.log('Accept Token Successfully: ' + data)
		        	$rootScope.$broadcast('reloadListView');
		        })
			}
			scope.rejectToken = function(item){
				var dataToReject = {
				  "id" : item.docId,
				  "version" : 0,
				  "metaData" : {
				    "entityType" : null,
				    "entityNumber" : null,
				    "docId" : item.docId,
				    "docType" : null,
				    "docName" : null,
				    "createDate" : item.createDate,
				    "modifyDate" : item.modifyDate,
				    "ownerId" : null,
				    "ownerName" : null,
				    "profileId" : null,
				    "documentStatus" : null,
				    "operationStatus" : null,
				    "businessStatus" : "DR",
				    "productName" : null,
				    "businessType" : null
				  },
				  "name" : item.name,
				  "email" : item.email,
				  "deviceId" : item.deviceId,
				  "token" : item.token,
				  "adminDecision" : "REJECTED",
				  "requestType": item.requestType
					};
				connectService.exeAction({
		            actionName: "GET_RESPONSE_PERMISSION",
		            actionParams: {},
		            data: dataToReject
		        }).then(function(data){
		        	console.log('Reject Token Successfully: ' + data)
		        	$rootScope.$broadcast('reloadListView');
		        })
			}
			scope.cloneShipmentDeclaration = function(policyId , docType, productName,value,inceptionDate,expiryDate,masterPol ){
				var selectProfile = JSON.parse(localStorage.getItem('selected_profile'));
				selectProfile.timeCurrent = Intl.DateTimeFormat().resolvedOptions().timeZone;
				
				
				$mdDialog
				.show({	
					templateUrl : resourceServerPath
							+ 'view/templates/mdDialog/can/cloneDialog.html',
					controller : DialogController
				});
		function DialogController($scope, $mdDialog, $http) {
			$scope.marineOpen=masterPol;
			$scope.shipmentStarts=inceptionDate;
			$scope.shipmentEnds=expiryDate;
			$scope.changeDate = function() {
				// Shipment end date is by shipment start date + 90 days
				$scope.shipmentEnds = moment($scope.shipmentStarts).add(90, 'day').format('YYYY-MM-DD');
			};
			$scope.cancelDialog = function() {
				$mdDialog.hide();
			}
			$scope.cloneDialog =function(){
				
				
				policyCoreService.cloneShipmentDeclaration(policyId , docType, productName.toLowerCase(),"pnc", selectProfile,$scope.shipmentStarts, $scope.shipmentEnds).then(function(data){
					if(!data.errors){
						commonService.removeLocalStorageVariables();//clear all old values
						commonService.currentState.set(docType + '-detail');
						var isQuoStandalone =  docType.toLowerCase() == 'quotation' ? true : false;
						var selectProfile = JSON.parse(localStorage.getItem('selected_profile'));
						$state.go('root.list.detail', {
							docType: "case",
							docId: data.DocId,
							userRole : selectProfile.role,
							productName: "can",
							businessType: "pnc",
							type: "", 
							quotationStandalone: false,
							lineOfBusiness:"",
							currFromDate:""
							
						});
					}else{
						commonUIService.showNotifyMessage(data.errors);
					}
				
				});
				$mdDialog.hide();
			}
		}

				
			}
			
			scope.choosePolicyDetail=function(data,docType, docId, businessLine, productName, type, currFromDate, lineOfBusiness,status){
					commonService.removeLocalStorageVariables();//clear all old values
					commonService.currentState.set(docType + '-detail');
					//var activeRole = commonUIService.setupAclForDetail(AclService, scope.activeRoles);
					
					var isQuoStandalone =  docType.toLowerCase() == 'quotation' ? true : false;
					
					$state.go('root.list.policydetail', {
						docType: docType,
						docId: docId,
						policyId:data,
						userRole : scope.activeRoles,
						productName: productName,
						businessType: businessLine,
						type: type, 
						quotationStandalone: isQuoStandalone,
						lineOfBusiness:lineOfBusiness,
						currFromDate:currFromDate,
						isDeclaration:status
					});
			}
			//Open detail document by doctype, docID
			scope.goToDocumentDetails = function(docType, docId, businessLine, productName, type, currFromDate, lineOfBusiness) {
				commonService.removeLocalStorageVariables();//clear all old values
				commonService.currentState.set(docType + '-detail');
				//var activeRole = commonUIService.setupAclForDetail(AclService, scope.activeRoles);
				
				var isQuoStandalone =  docType.toLowerCase() == 'quotation' ? true : false;
				
				$state.go('root.list.detail', {
					docType: docType,
					docId: docId,
					userRole : scope.activeRoles,
					productName: productName,
					businessType: businessLine,
					type: type, 
					quotationStandalone: isQuoStandalone,
					lineOfBusiness:lineOfBusiness,
					currFromDate:currFromDate
				});
			};
			
			// Import complete standalone quotation to case from list import
			scope.isRowVisibleForQuotationImport = function(item) {
				var quoteDocNames = scope.extension ? scope.extension.quotationDocNames : undefined;
				if (quoteDocNames && angular.isArray(quoteDocNames) && quoteDocNames.length > 0) {
					return quoteDocNames.indexOf(item.docName) < 0; // not exist
				}
				return true;
			}
			
			scope.importQuotationToCase = function(card, docId, docName, $event){
				var cardCase = scope.$parent.card;
				scope.$parent.importQuotationToCase(cardCase, docId, docName, $event);
			}
			
			scope.handleStandaloneQuotationSelection = function (card, docId, docName, $event) {
				if (scope.dashboarddoctype) {
					scope.goToDocumentDetails(commonService.CONSTANTS.MODULE_NAME.QUOTATION, docId, commonService.CONSTANTS.BUSINESS.LIFE, commonService.CONSTANTS.PRODUCT.RUL);
				} else {
					scope.importQuotationToCase(card, docId, docName, $event);
				}
			}
			
			scope.generateBusinessCaseFromQuickQuotationDashboard = function (quotation) {
				scope.$parent.generateBusinessCaseFromQuickQuotationDashboard(quotation);
			}
			
			scope.navigateFromUnderwritingToBusinessCase = function(caseId, businessType, productName) {
				scope.$parent.navigateFromUnderwritingToBusinessCase(caseId, businessType, productName, scope.activeRoles);
			}
			
			// Import contact to case in from list import contact of case
			scope.importContactToCases = function(card, docId, docName, $event){
				var cardCase = scope.$parent.card;
				scope.$parent.importContactToCase(cardCase, docId, docName, $event);
			}
			
			// Import contact to Fna in from list import contact of Fna
			scope.importClientJointApplicant = function (card, contactDocName, $event, isNeedRefresh){
				var cardfna = scope.$parent.card;
				scope.$parent.importClientJointApplicant(cardfna, contactDocName, $event, isNeedRefresh);
			}
			
			
			//Pick up underwriting
			scope.pickupUnderwriting = function (docType, docId, businessLine, productName, dataList, index) {
				underwritingCoreService.pickupForUnderwriting(
						undefined,
						docType,
						docId,
						businessLine,
						productName
				).then(function (data) {
					if(data.error == 'UW-ERR1'){
						commonUIService.showNotifyMessage('v4.underwriting.message.saveUnsuccessfully.UW-ERR1');
					}
					$rootScope.$broadcast('updateTotalRecords');
					
					// Do not only remove the record from the list, must reload the list
					/*dataList.splice(index,1);
					$rootScope.$broadcast('updateItemLazyLoad');*/
					
					// Reload the list because the number of records changed
					$rootScope.$broadcast('reloadListView');
				});
			};
			
			//Return underwriting
			scope.returnUnderwriting = function (docType, docId, businessLine, productName, dataList, index) {
				underwritingCoreService.returnForUnderwriting(
						undefined,
						docType,
						docId,
						businessLine,
						productName
				).then(function (data) {
					$rootScope.$broadcast('updateTotalRecords');
					
					// Do not only remove the record from the list, must reload the list
					//dataList.splice(index,1);
					//$rootScope.$broadcast('updateItemLazyLoad');
					
					// Reload the list because the number of records changed
					$rootScope.$broadcast('reloadListView');
				});
			};
			
			/**
		     * Create new document for this docType and navigate to its screen
		     * @param  {String} docType     [description]   
		     * @return {Object}              Angular Promise, iposV3Doc if success
		     */
			scope.createNewDocument = function(docType) {
				commonService.currentState.set(docType + '-detail');
				//var activeRole = commonUIService.setupAclForDetail(AclService, scope.activeRoles);
				$state.go('root.list.detail', {
					docType: docType,
					userRole : scope.activeRoles
				});
			};
			
			// Listen on 'reloadListView' event to reload the list when the number of records changed (Manager Review & Underwriting Review)
			scope.$on('reloadListView', function () {
				scope.search();
				$rootScope.$broadcast('updateListViewScreen');
			});
			
			scope.search = function () {
				scope.currentPage = 0;
				scope.infiniteItems.numLoaded = 0;
				scope.infiniteItems.toLoad = 0;
				scope.lengthCurrent = 0;
				scope.infiniteItems.items =[];
				scope.isLoad = true ;
				scope.datalist = scope.infiniteItems.items;
			
				scope.searchList(this.searchText);
			}
		
			scope.pickupUW = function(docId, datalist, index){
				console.log("hello");
				uiRenderPrototypeService.calApiUW('PUT','PICKUP_RETURN_UW', docId,'pickup').then(function(data){
					$rootScope.$broadcast('updateTotalRecords');
					datalist.splice(index,1);
				});
			};
			scope.chooseSearch=function(){
				scope.object=$("#dxc").val();
				localStorage.setItem("object",$("#dxc").val());
				  if($("#dxc").val()!="? string: ?"&&$("#searchBox").val()!="" && $("#dxc").val()!="? undefined:undefined ?"){
					  
					  $(".ipos-mobile-control").css('pointer-events', 'auto');
				   }else{
						$(".ipos-mobile-control").css('pointer-events','none');
				   }
				
			}
			scope.chooseSearchTextField=function(){
			
			  if($("#dxc").val()!="? string: ?"&&$("#searchBox").val()!="" && $("#dxc").val()!="? undefined:undefined ?"){
				  
				  $(".ipos-mobile-control").css('pointer-events', 'auto');
			   }else{
					$(".ipos-mobile-control").css('pointer-events','none');
			   }
			}
			scope.searchLine=function(){
				$(".ipos-mobile-control").css('pointer-events','none');
				scope.currentPage = 0;
				scope.infiniteItems.numLoaded = 0;
				scope.infiniteItems.toLoad = 0;
				scope.lengthCurrent = 0;
				scope.infiniteItems.items =[];
				scope.isLoad = true ;
				scope.datalist = scope.infiniteItems.items;
			
				scope.searchList("");
			}
			scope.searchList = function(searchText, page, size, customSearchQuery, customSort) {
			
				localStorage.setItem("object1",$("#searchBox").val());
				
				var k= localStorage.getItem("object1");
					
				if(k.lastIndexOf("#")!=-1){
					
				}else{
				if(localStorage.getItem("object")!=null&&localStorage.getItem("object")!=""&&searchText!=null&&searchText!=""){
					scope.isCheck=false;
					$(".pointer fa fa-search fa-2x padding-left-7 search-item").show();
					}
			
				if(customSort != undefined){
					if(scope.manualSort != customSort){
						scope.currentPage = 0;
						scope.infiniteItems.numLoaded = 0;
						scope.infiniteItems.toLoad = 0;
						scope.lengthCurrent = 0;
						scope.infiniteItems.items =[];
						scope.isLoad = true ;
						scope.datalist = scope.infiniteItems.items;
					}
				} else{
					customSort = scope.manualSort;
				}
				
				scope.isloadlist = false;
				scope.searchText = searchText;
				
				if (!commonService.hasValueNotEmpty(page)) {
					page = scope.currentPage;
				} else{
					page = scope.currentPage;
				}
				
				
				if (!commonService.hasValueNotEmpty(size)) {
					size = scope.pageSize.size;
				}
				var searchQuery = undefined;
				if (commonService.hasValueNotEmpty(customSearchQuery)) {
					searchQuery = customSearchQuery;
				} else {
					searchQuery = scope.buildSearchQuery(searchText, scope.searchcriteria,scope.flowsearch,scope.ispolicylistnoelstasicsearch);
				}
				var searchParams = {
					page: page,
					size: size
				};

				//TODO: Need enhance custom sort
				if (commonService.hasValueNotEmpty(customSort)) {
					searchParams.sort = customSort;
				} else if (commonService.hasValueNotEmpty(attrs.sortby)) {
					searchParams.sort = attrs.sortby;
					if (commonService.hasValueNotEmpty(attrs.sortorder)) {
						searchParams.sort += ',' + attrs.sortorder;
					}
				}

				var doctype = scope.doctype;
				var flowsearch=scope.modelSearch;
				var businessLine = undefined;
				var productName = undefined;
				//Remove later
				if(doctype == "underwriting" || doctype == "managerreview") {
					businessLine = "life";
					productName = "rul";
				}		
				uiRenderPrototypeService.searchDocument(
					undefined,
					doctype,
					searchQuery,
					searchParams,
					businessLine,
					productName,
					flowsearch
				).then(function(data) {
					if (commonService.hasValueNotEmpty(data)) {
						var totalElements = uiRenderPrototypeService.findElementInElement(data, ['totalElements']);
						var totalRecords = uiRenderPrototypeService.findElementInElement(data, ['totalRecords']);
						var list = uiRenderPrototypeService.findElementInElement(data, ['metaDatas']);
						if(localStorage.getItem("dashboardDoctype")=="policy_management"){
							list = $filter('orderBy')(list, 'inceptionDate',true);
						}
						var number =  uiRenderPrototypeService.findElementInElement(data, ['number']);
						// field number of client and policy model different with another model (number with numbers)
						if(number == undefined){
							number =  uiRenderPrototypeService.findElementInElement(data, ['numbers']);
						}  
						
						//scope.numberPage = uiRenderPrototypeService.findElementInElement(data, ['number']);
						var totalPages = uiRenderPrototypeService.findElementInElement(data, ['totalPages']);
						if (commonService.hasValueNotEmpty(totalElements)) {
							scope.totalItems = data.page.totalElements;	
							scope.totalPage = totalPages;
							scope.currentPage += 1;
							//scope.isLoad =true;
							if(number == 0){
								if(list != undefined){
									scope.datalist = list;
									
									scope.infiniteItems.items = scope.datalist;
									scope.infiniteItems.numLoaded = scope.datalist.length;
									scope.isLoad =true;
									$rootScope.$broadcast('updateListViewScreen');
								} else{
									scope.isLoad = false;
									scope.datalist = [];
									scope.infiniteItems.items = scope.datalist;
								}								
							} else {
								if(Array.isArray(list)) {
									scope.datalist = scope.datalist.concat(list);
									$rootScope.$broadcast('updateListViewScreen');
								}
							}
							
							// Check if ending of the list, turn off the loading bar
							if ( !Array.isArray(list) || (list.length < searchParams.size) ) { 
								scope.isLoad =false;
							}
						} else {
							scope.isLoad =false;
						}
						if (commonService.hasValueNotEmpty(totalRecords)) {
							if(uiRenderPrototypeService.totalRecords === undefined) {
								uiRenderPrototypeService.totalRecords = {};
							}
							uiRenderPrototypeService.totalRecords[scope.listtitle] = totalRecords;
						}
						scope.isloadlist = true;
						
						$rootScope.$broadcast('updateTotalRecords');
					}else{
						scope.currentPage += 1;
					}
					
					if (!commonService.hasValueNotEmpty(customSort)) {
						$rootScope.$broadcast('updateSortKey', {
							sortBy: attrs.sortby,
							sortOrder: attrs.sortorder
						});
					}
					//re-init collapsible
					angular.element('.collapsible').collapsible();
				});
				}
			};

			scope.buildSearchQuery = function(searchText, searchFields,flowsearch,ispolicylistnoelstasicsearch) {
				var searchQuery = [];
				var searchCriteria = {};
				var searchCriteria1 = {};
				var searchValues = [ searchText ];
				if (commonService.hasValueNotEmpty(searchText) &&
					commonService.hasValueNotEmpty(searchFields)) {
						var tempSearchFields = angular.copy(searchFields);
						for(var index = 0; index < searchFields.length; index++){
							if(searchFields[index].endsWith('Date') )
							{
								if(!commonService.checkValidDateFormat(searchText) )
									tempSearchFields.remove(searchFields[index]);
							}
						}
						
							searchCriteria.values = searchValues;
							searchCriteria.fields = tempSearchFields;
							searchQuery.push(searchCriteria);
							if(localStorage.getItem("dashboardDoctype")=="policy_management" && ispolicylistnoelstasicsearch==="true"){
							searchCriteria1.values=[scope.object];
							searchCriteria1.fields=["Search"];
							searchQuery.push(searchCriteria1);
							}
							
				}

				if (commonService.hasValueNotEmpty(scope.defaultquery)) {
					searchQuery = searchQuery.concat(JSON.parse(scope.defaultquery));
				}
				
				if (commonService.hasValueNotEmpty(scope.filterValueChains)) {
					scope.filterValueChains.forEach(function (filterValue){
						if(commonService.hasValueNotEmpty(filterValue.values))
							searchQuery.push(filterValue);
					});
				}
				
				return searchQuery;
			};
			//Listen for sort key update
			scope.$on('updateParentSortKey', function(event, args) {
				scope.manualSort = args.manualSort;
			});

			/**********Start function for check box***************/
			//Click to choose a item or remove a item
			scope.toggleSelection = function(item) {
				var idx = scope.datalistsync.indexOf(item);
				if (idx > -1) {
					scope.datalistsync.splice(idx, 1);
				} else {
					scope.datalistsync.push(item);
				}
			};

			//Check existing item
			scope.exists = function (item) {
				return scope.datalistsync.indexOf(item) > -1;
			};

			//Check selected all item
			scope.isChecked = function() {
				if (scope.datalist) {
					return scope.datalistsync.length === scope.datalist.length;
				} else {
					return false;
				}
			};

			//Click to choose all items or remove all items
			scope.selectAll = function() {
				if (scope.datalistsync.length === scope.datalist.length) {
					scope.datalistsync = [];
				} else if (scope.datalistsync.length === 0 || scope.datalistsync.length > 0) {
					scope.datalistsync = scope.datalist.slice(0);
				}
			};
			
			scope.isFilterValueNotEmpty = function () {
				var result = false;
				if(scope.filterValueChains){
					scope.filterValueChains.forEach(function (filterValue){
						if(commonService.hasValueNotEmpty(filterValue.values))
							result = true;
					});
				}
				return result;
			};
			
			scope.toggleFilter = function () {
				scope.filter.isfilterShow = !scope.filter.isfilterShow;
				
				if(!scope.filter.isfilterShow){
					scope.filterValueChains.forEach(function (filterValue) {
						filterValue.values.splice(0,filterValue.values.length);
					});
					
					ctrl.updateView();
				}
			};
			
			scope.$on('updateListViewScreen', updateListView);
			function updateListView() {
				$timeout(function() {
					scope.$broadcast('$md-resize');
				}, 200)
			}
			
			scope.$on('updateItemLazyLoad', updateItem);
			function updateItem(){
				scope.infiniteItems.items =scope.datalist;
				scope.infiniteItems.toLoad = scope.infiniteItems.items.length;
				scope.infiniteItems.numLoaded = scope.infiniteItems.toLoad;			
			}
			scope.$on('updateWebSocket', function(){
				if (scope.dashboardstatus === 'wait_for_approval' || scope.dashboardstatus === 'approved_list'){
					$rootScope.$broadcast('reloadListView');
				}
			});
			
			/**********End function for check box***************/

			//Comments
			(function setupStuffs() {
				if (!scope.isdedup) {
					scope.searchList();
				}
			})();
		},
		templateUrl : resourceServerPath + 'view/dashboards/main-list-view.html'
	};
}])
.directive('totalRecords', ['$interval', 'commonService', 'uiRenderPrototypeService',
	function($interval, commonService, uiRenderPrototypeService) {
	return {
		restrict: 'E',
		scope: {
			docType: '@',
			query: '@',
			listtitle: "@"
		},
		link: function(scope, element, attrs) {
			element.text(0);
			if(uiRenderPrototypeService.totalRecords === undefined) {
				uiRenderPrototypeService.totalRecords = {};
			} else {
				uiRenderPrototypeService.totalRecords[scope.listtitle] = 0;
			}
			function getTotalRecords() {
				var query = scope.query || '[]';
				query = JSON.parse(query);
				//Remove later
				var businessLine = undefined;
				var productName = undefined;
				if(scope.docType == "underwriting" || scope.docType == "managerreview"|| scope.docType == "quotation") {
					businessLine = "life";
					productName = "rul";
				}
				if(scope.docType == "client" || scope.docType == "policy") {					
					element.text(uiRenderPrototypeService.totalRecords[scope.listtitle]);
				} else {
					uiRenderPrototypeService.getDocumentTotalRecords(
							undefined,
							scope.docType,
							query,
							businessLine,
							productName
						).then(function (data) {
							if (commonService.hasValueNotEmpty(data)) {
								var size = uiRenderPrototypeService.findElementInElement(data, ['size']);
								if (commonService.hasValueNotEmpty(size)) {
									element.text(size);
								}
							}
						});
				}
				
			}
			
			getTotalRecords();
			scope.$on('updateTotalRecords', getTotalRecords);
		}
	};
}])
.directive('listViewSort', ['$compile', '$rootScope',
	function($compile, $rootScope) {
	return {
		restrict: 'A',
		link: function link(scope, element, attrs) {

			//Get sort value
			var sortValue = attrs.listViewSort;

			//Append sort icon beside header
			var appendObject = "<i class=\"fa fa-sort\" ng-class=\"{'fa-sort': sortBy !== '" + sortValue +
								"', 'fa-sort-asc sorted': sortOrder === 'ASC' && sortBy === '" + sortValue +
								"', 'fa-sort-desc sorted': sortOrder === 'DESC' && sortBy === '" + sortValue + "'}\" />";
			var compile = $compile(appendObject)(scope);
			element.append(compile);

			//Add click function for sort
			element.on('click', function() {
				/*scope.infiniteItems.toLoad = 0;
				scope.currentPage = 0;
				scope.infiniteItems.numLoaded = 0;
				scope.infiniteItems.items =[];
				scope.lengthCurrent = 0;
				scope.isLoad = true ;
				scope.datalist = scope.infiniteItems.items;*/
				scope.sortBy = sortValue;
				scope.sortOrder = (scope.sortOrder === 'ASC') ? 'DESC': 'ASC';
				var sortKey = scope.sortBy + ',' + scope.sortOrder;
				scope.searchList(
					scope.searchText,
					undefined,
					undefined,
					undefined,
					sortKey
				);
				$rootScope.$broadcast('updateParentSortKey', {
					manualSort: sortKey
				});
			});

			//Listen for sort key update
			scope.$on('updateSortKey', function(event, args) {
				scope.sortBy = args.sortBy;
				scope.sortOrder = args.sortOrder;
			});
		}
	};
}])
//ynguyen7: only allow to key in alphabetical
.directive('alphabeticalsOnly', ['appService', 'commonService', function(appService, commonService) {
   return {
     require: 'ngModel',
     priority: 60,
     link: function(scope, element, attrs, modelCtrl) {
       modelCtrl.$parsers.push(function (inputValue) {
           // this next if is necessary for when using ng-required on your input. 
           // In such cases, when a letter is typed first, this parser will be called
           // again, and the 2nd time, the value will be undefined
           if (inputValue == undefined) return '';
           var transformedInput = inputValue.replace(/[[0-9@.:!?><”"'$#%&’()*\-+,\/;\[\\\]\^_`{|}~]/g, '');
           if (transformedInput!=inputValue) {
              modelCtrl.$setViewValue(transformedInput);
              modelCtrl.$render();
           }
           return transformedInput;         
       });
     }
  };
}])
.directive('alphabeticalsNumbersOnly', ['appService', 'commonService', function(appService, commonService) {
   return {
     require: 'ngModel',
     priority: 60,
     link: function(scope, element, attrs, modelCtrl) {
       modelCtrl.$parsers.push(function (inputValue) {
           // this next if is necessary for when using ng-required on your input. 
           // In such cases, when a letter is typed first, this parser will be called
           // again, and the 2nd time, the value will be undefined
           if (inputValue == undefined) return '';
           var transformedInput = inputValue.replace(/[[@.:!?><”"'$#%&’()*\-+,\/;\[\\\]\^_`{|}~]/g, '');
           if (transformedInput!=inputValue) {
              modelCtrl.$setViewValue(transformedInput);
              modelCtrl.$render();
           }
           return transformedInput;         
       });
     }
  };
}])
//this is auto expand height ONLY work with text area 
.directive('autoExpandInput', ["$timeout", function($timeout) {
   return {
	 restrict: "A",
     link: function(scope, element, attrs) {
    	 
    	 //auto expand textarea when input
    	 /*element.on('keydown', function(e){
    		    if(e.which == 13) {e.preventDefault();}
    		}).on('input', function(){
    		    $(this).height(1);
    		    var totalHeight = $(this).prop('scrollHeight') - parseInt($(this).css('padding-top')) - parseInt($(this).css('padding-bottom'));
    		    totalHeight = totalHeight < 28? 28:totalHeight;
    		    $(this).height(totalHeight);
    		});*/
    	 
    	 //reset text area when loaded
    	  $timeout(function() {
    	        	element.height(1);
    	    		var totalHeight = element.prop('scrollHeight') - parseInt(element.css('padding-top')) - parseInt(element.css('padding-bottom'));
    	    		
    	    		totalHeight = totalHeight < 28? 28:totalHeight;
    	    		element.height(totalHeight);
    	  }, 0);
    	 
     }
   }
}])
//This directive apply for library material-components-web
.directive('mdcTextfield', ["$timeout", function($timeout) {
   return {
	 restrict: "C",
     link: function(scope, element, attrs) {
    	  $timeout(function() {
    		  if(element.children('input')[0].value != undefined && element.children('input')[0].value != ""){
    			  element.children('label')[0].className += " mdc-textfield__label--float-above";
    		  }
    		  mdc.autoInit();
    	  }, 0);
    	 
     }
   }
}])

.directive('v4DropDown', ['$parse', '$timeout', '$translate', '$filter','$document', function($parse, $timeout, $translate, $filter, $document) {
	return {
		restrict: 'E',
        scope: {
            model: '=',
            list: '=',
            prefix:'@',
            type:'@',
            tilte:'@',
            searchAble:'@'
        },
		templateUrl: function(elem, attrs) {
			var templateUrl;
			switch(attrs.type) {
			    case "singleChoice":
			    	templateUrl = resourceServerPath + 'view/templates/v4_dropdown.html';
			        break;
			    case "multiChoice":
			    	templateUrl = resourceServerPath + 'view/templates/v4_dropdown_multipleChoice.html';
			        break;
			    case "range":
			    	templateUrl = resourceServerPath + 'view/templates/v4_dropdown_range.html';
			        break;
			    default:
			        templateUrl = resourceServerPath + 'view/templates/v4_dropdown.html';
			}
	        return templateUrl;
	        /* List Dropdown Template
		      //single choice template
		      <v4-drop-down search-able="true" title="Status" type="singleChoice" model="abc" prefix="v3.paymentMethod" list='[{"value": "CASH"},{"value": "CHEQUE"},{"value": "BANKTRANSFER"},{"value": "CASH"},{"value": "CHEQUE"},{"value": "BANKTRANSFER"},{"value": "CASHqweeqweqw"},{"value": "CHEQUqweqweE"},{"value": "BANKTRAsdwqeqweNSFER"},{"value": "CASsdsdsdH"},{"value": "CHEsdsdQUE"},{"value": "BANKTRANSdsdsdFER"}]'>
		      </v4-drop-down>
		      //multiple choice template
		      <v4-drop-down search-able="true" title="Status" type="multiChoice" model="abca" prefix="v3.paymentMethod" list='[{"value": "CASH"},{"value": "CHEQUE"},{"value": "BANKTRANSFER"},{"value": "CAS34234H"},{"value": "CHEQUsdfsdfE"},{"value": "sfsdfsd"},{"value": "CA23123SH"},{"value": "CHEQU3123asdE"},{"value": "BANKTRANS123123FER"},{"value": "asdsadfCASH"},{"value": "CHEQ213213UE"},{"value": "BANKTRANSasdf bdFER"}]'>
		      </v4-drop-down>
		      //date range 
		      <v4-drop-down title="Date Range" type="range" model="date">
		      </v4-drop-down>
		   */
	    },
		link: function(scope, elem, attr) {
			scope.title = attr.title;
			scope.searchable = attr.searchAble;
			scope.searchText = "";
			
			/*$translate.refresh();*/
			var language = localStorage.getItem('language')
			if (language != undefined && language != 'undefined') {
				$translate.use(language);
			} else {
				$translate.use('en');
			}
			
	
	        var stopList = scope.$watch(
                    "list",
                    function handleFooChange( newValue, oldValue ) {
                     if(newValue != undefined &&  newValue[0] != undefined){
                       scope.translate();
                       stopList();
                     }
                }
           );
	        
	        
	        scope.translate = function(){
	        	if (attr.type != "range") {
			          //translate list
			         
				        //check if list is array or not
				        if(!angular.isArray(scope.list)){
				          var item=scope.list;
				          scope.list=[];
				          scope.list.push(item);
				        }
				        //add file translate to list
				        if(scope.list[0]){
				          for (var int = 0; int < scope.list.length; int++) {
				            scope.list[int].translate=$translate.instant(scope.prefix+'.'+scope.list[int].value.toString());
				            scope.list[int].checkboxModel = {};
				          }
				        }
				  
	        	} else {
	        		
	        		scope.from = $translate.instant("v4.directive.dropdown.from");
	        		scope.to = $translate.instant("v4.directive.dropdown.to");
	        		scope.close = $translate.instant("v4.directive.dropdown.close");
	        		scope.clear = $translate.instant("v4.directive.dropdown.clear");
	        	}
		     }
	        scope.translate();
	        
	        
	        //generate name for dropdown
			if (!scope.name) {
	            scope.name = "dropdown-" + (0|Math.random()*9e6).toString(36);
	        }
			
			//remove search text field if not available in directive
			 $timeout(function() {
				 if (scope.searchable == "false"){
					 elem.find("#search-text-"+scope.name).empty(); 
					}
			 }, 0);
			

			scope.toggleDowpdown = function(){
				//close all sibling's dropdown
				if (!elem.find("#" +  scope.name).hasClass("v4-dropdown-item-active")){
					$(".v4-dropdown-item-active").removeClass("v4-dropdown-item-active");
					$(".v4-multi-button-active").removeClass("v4-multi-button-active");
				} else {
					elem.find("#button-" +  scope.name).addClass("v4-multi-button-active");
				}

				
				elem.find("#" +  scope.name).toggleClass("v4-dropdown-item-active");
				if (elem.find("#" +  scope.name).hasClass("v4-dropdown-item-active")){
					elem.find("#mask-" +  scope.name).addClass("v4-dropdown-mask-active");
					elem.find("#button-" +  scope.name).addClass("v4-multi-button-active");
				} else {
					elem.find("#button-" +  scope.name).removeClass("v4-multi-button-active");
				}
			}
			
			//hide dropdown by click outside
			scope.hideDowpdown = function(){
				if (elem.find("#" +  scope.name).hasClass("v4-dropdown-item-active")){
					elem.find("#" +  scope.name).removeClass("v4-dropdown-item-active");
					elem.find("#button-" +  scope.name).removeClass("v4-multi-button-active");
				} else {
					elem.find("#mask-" +  scope.name).removeClass("v4-dropdown-mask-active");
				}
			}
			
			scope.clearSearchText = function(){
				scope.searchText = "";
			}
			
			//single Value
			scope.setValue = function(value){
				scope.toggleDowpdown();
				scope.model.Value = value;
			}
			
			//clear data for date range dropdown
			scope.clearDatRangeValue = function(){
				scope.model.Value.from = "";
				scope.model.Value.to = "";
			}
			//multi value
			scope.setMultiValue = function(value, checkboxModel){
				if (checkboxModel == false){
					delete scope.model.Value[value];
				} else {
					scope.model.Value[value] = checkboxModel;
				}
			}
		}
	}
}])

//This directive apply for library materiallize library
.directive('materiallizeDatetime', ["$timeout", "$compile", "commonService", "commonUIService", "$translate", function($timeout, $compile, commonService, commonUIService, $translate) {
   return {
	 restrict: 'A',
	 require: '?ngModel',
	 scope: {
		 onClose: "&",
		 ngDisabled: "="
	 },
     link: function(scope, element, attrs, model) {
    	 
    	 //create default today variable with hour,minute and seccond is zero
    	 // ex: 01/01/2017 00:00:00
    	 var  today = moment();//today's type is moment
    	 	  today.second(0);//today's type is moment
	    	  today.minute(0);//today's type is moment
	    	  today.hour(0);//today's type is moment
	    	  
//	    	  today = today.toDate();//today's type is Date
	    	  
	    	  //if maxdate is today it get from now to pre
    	 if(attrs.maxdate == "today"){
    		 attrs.maxdate = today;
    	 } else if (attrs.maxdate == undefined) {
    		 attrs.maxdate = moment(new Date(2999, 12, 31, 23, 59, 59, 0));
    	 }
    	//if mindate is today it get from now to next
    	 if(attrs.mindate == "today"){
    		 attrs.mindate = today;
    	 }  else if (attrs.mindate == undefined) {
    		 attrs.mindate = moment(new Date(1900, 1, 1, 0, 0, 0, 0));
    	 }
    	 var dateformat = 'yyyy-mm-dd';
    	 if (attrs.formatdisplay) {
    		 dateformat = attrs.formatdisplay.toLowerCase();
    	 }
    	 var iconDatePicker =  $compile("<i class=\"fa fa-calendar fa-2x subfix-icon\" aria-hidden=\"true\"></i>")(scope);
    	 element.after(iconDatePicker);
    	 
    	 var pickerMaxDate = attrs.maxdate.toDate();

         if(!attrs.includemaxdate) { // not include max date
    	    pickerMaxDate.setDate(pickerMaxDate.getDate()); // past date not include Max date
         }

    	 var pickerMinDate = attrs.mindate.toDate();

         if(attrs.excludemindate) { // exclude min date
             pickerMinDate.setDate(pickerMinDate.getDate()+1);// future date exclude Min date
         }
    	 
    	 var picker = iconDatePicker.pickadate({
		    selectMonths: true, // Creates a dropdown to control month
		    selectYears: 100, // Creates a dropdown of 20 years to control year
		    format: dateformat,
		    max: pickerMaxDate,
		    min: pickerMinDate,
		    onOpen: function(){
		    	//fix bug croll start screen 
		    	//scrollToElement()
		    },
		    onClose: function() {
		    	focusToElement(); //when close picker, move the focus back to input. Prevent picker open again.
		    	//fix bug croll start screen 
		    	//scrollToElement();
		    	
		    	if(scope.onClose)
		    		scope.onClose();
		    },
		    onSet : function(context){
		    	//fix bug croll start screen 
		    	//scrollToElement();
		    	if(context.select) {
		    		element.val(moment(context.select).format(formatdisplay));
		    		angular.element(element).triggerHandler('input');
		    	}
		    }
		 });
    	 
    	 /*
    	  * hle56
    	  * move the root picker into div which have id is '#materiallizeDatetime' to overlay all element.
    	  * if this directive use any where not exist '#materiallizeDatetime', not thing to do.
    	  */
    	 setTimeout(function() {
    		 if( $('#materiallizeDatetime').length == 0)
    			  return;
    		 
    		 scope.id = picker.attr('id');
    		 var pickerRoot = $('#'+scope.id+"_root").detach();
    		 
    		 var fieldId = findIdInElement(element.parent());
    		 fieldId = fieldId.replace(':',"_");
    		 pickerRoot.attr('id', 'picker_id_' + fieldId);
    		 
    		 if( $('#picker_id_' + fieldId).length > 0) //remove
    			 $('#picker_id_' + fieldId).remove();
    		 
    		 $('#materiallizeDatetime').append(pickerRoot);
    		 
    		 //unbind default event because prevent auto open picker when browser was focus again.
    		 picker.unbind( "focus click" );
    		 
    		 //after unbind all default event, need to add click event to open picker.
    		 iconDatePicker.on('click', function(){
    			 if(!scope.ngDisabled)
    				 picker.pickadate('picker').open();
    		 });
    		 
    		 //set default value for picker if model have value not empty
    		 if(commonService.hasValueNotEmpty(model.$modelValue))
    			 picker.pickadate('picker').set('select', model.$modelValue, { format: 'yyyy-mm-dd' });
    		 
    		 element.mask(convertFormatDateToMask(formatdisplay),{placeholder:formatdisplay});
    		 
    		 element.on('blur', function(){
    			 if(scope.onClose)
    				 scope.onClose(); 
    		 });
    		 
		}, 500);
    	 
    	 //focus to element contain this picker
    	 function focusToElement(){
    		 element.focus();
    	 }
    	 
    	 //scroll to element contain this picker
    	 function scrollToElement(){
    		 $('html, body').stop().animate({
				scrollTop: 	element.offset().top-400	   
				},0, 'linear'
    		 );
    	 }
    	 
    	 function findIdInElement(element){
    		 if(element.attr('id'))
    			 return element.attr('id');
    		 if(element.attr('fieldId'))
    			 return element.attr('fieldId');
    		 return findIdInElement(element.parent());
    	 }
    	 
    	 var formatdisplay = 'YYYY-MM-DD';
    	 if (attrs.formatdisplay) {
    		 formatdisplay = attrs.formatdisplay;
    	 }
    	 var formatsubmit = 'YYYY-MM-DDTHH:mm:ssZZ';
    	 if (attrs.formatsubmit) {
    		 formatsubmit = attrs.formatsubmit;
    	 }
    	 var maxDate = attrs.maxdate;
    	 var minDate = attrs.mindate;

    	 // DD/MM/YYY -> 99/99/9999
    	 var convertFormatDateToMask = function (format) {
    		var result = "";
    		for (var i = 0, len = format.length; i < len; i++) {
    			if(format[i] === "/" || format[i] === "-") // if need more character, add them into here
    				result += format[i];
    			else
    				result += "9";
			}
    		return result;
    	 }
    	 
    	 // view to model
    	 // ynguyen7: get Date Type of error message
    	 var dateName = $translate.instant(attrs.datename);
    	 model.$parsers.push(function(input){
    		 var a = model;
    		 var validDate = true
    		 if(input === "01/01/1970" && model.$modelValue !== null && model.$modelValue.includes("1970-01-01")){
    			 model.$setViewValue(moment(model.$modelValue, formatsubmit).format(formatdisplay));
    			 model.$render();
    			 return model.$modelValue;
    		 }
    		 
    		 if(input === '' || input === 'Invalid date')
    			 return undefined;
    		 
    		 if(moment(input, formatdisplay).isValid() != true) {
    			 validDate = false;
    		 }
    		 
		 	if(validDate){
		 		//past date exclude max date
	             if(!attrs.includemaxdate){ // not include max date
	                 if(maxDate!=undefined && !moment(input, formatdisplay).isBefore(moment(maxDate.format(formatdisplay), formatdisplay))) {
	                     commonUIService.showNotifyMessage("v3.style.message.FailedFutureDate;"+dateName, "error");
	                     element.val("");
	                     return undefined;
	                 }
	             } else {
	                 if(maxDate!=undefined && !moment(input, formatdisplay).isSameOrBefore(moment(maxDate.format(formatdisplay), formatdisplay))) {
	                     commonUIService.showNotifyMessage("v3.style.message.FailedFutureDate;"+dateName, "error");
	                     element.val("");
	                     return undefined;
	                 }
	             }

	             if(!attrs.excludemindate){ // not exclude min date
	                 if(minDate!=undefined && !moment(input, formatdisplay).isSameOrAfter(moment(minDate.format(formatdisplay), formatdisplay))) {
	                     commonUIService.showNotifyMessage("v3.style.message.FailedPastDate2;"+dateName, "error");
	                     element.val("");
	                     return undefined;
	                 }
	             } else {
	                 if(minDate!=undefined && !moment(input, formatdisplay).isAfter(moment(minDate.format(formatdisplay), formatdisplay))) {
	                     commonUIService.showNotifyMessage("v3.style.message.FailedPastDate2;"+dateName, "error");
	                     element.val("");
	                     return undefined;
	                 }
	             }
	             return moment(input, formatdisplay).format(formatsubmit);
    		 } else {
    			 commonUIService.showNotifyMessage("v3.style.message.InvalidDate;"+input, "error");
    			 element.val("");
    			 return undefined;
    		 }
    		
    	 });
    	 
    	 // model to view
    	 model.$formatters.push(function(value){
    		 if(value == undefined || value == ""){
    			 return "";
    		 }else {
    			 return moment(value, formatsubmit).format(formatdisplay);
    		 }
    	 });
     }
   }
}])

/**
 * Mar-27-2017
 * @author  dnguyen98
 * Action List View for dashboard 
 */
.directive('actionListView', ['$timeout', '$translate', '$filter', '$state', 'commonService',
                        function($timeout, $translate, $filter, $state, commonService) {
    return {
      restrict:'E',
      replace:false,
      scope: {
    	  filterModel: '=?', // data model of filter action 
    	  filterList: '=?', // data list of filter action
    	  filterAction: '&?', // call Funtion of filter action
          searchModel: '=?', // data model of search action
          searchAction: '&?', // call Funtion of search action
          reloadAction: '&?' // call Function of reload action
      },
      link: function(scope, element, attrs) {
    	  scope.isShowFilter = false;
    	  scope.isShowSearch = false;
    	  
    	  //Show Search Box up and hide other Box up
    	  scope.showSearchBoxUp = function() {
    		  scope.isShowFilter = false;
    		  scope.isShowSearch = !scope.isShowSearch;
    		 
    	  };
    	  
    	  //Show Filter Box up and hide other Box up
    	  scope.showFilterBoxUp = function() {
    		  scope.isShowFilter = !scope.isShowFilter;
    		  scope.isShowSearch = false;
    	  };
    	  
    	  //Hide all Box up
    	  scope.hideAllBoxUp = function() {
    		  scope.isShowFilter = false;
        	  scope.isShowSearch = false;
    	  };
    	  
      },
      templateUrl : '../../../view/templates/action-list-view.html',     
    };
}])

.directive('checkEmail', ['commonUIService',function(commonUIService ) {
   return {
	 restrict: 'A',
	 require: '?ngModel',
	 scope:{
		 meta: '='
	 },
     link: function(scope, element, attrs, model) {
    	 model.$parsers.push(function(input){
    		var errorMessage = commonUIService.checkValidEmail(input);
    		scope.meta.errorCode2 = errorMessage;
    		return input;
    	 });
     }
   }
}])

/**
 * Apr-21-2017
 * @author  tlai20
 * Directive Compare Password & Confirm Password
 */

.directive('pwCheck', [function () {
    return {
        require: 'ngModel',
        link: function (scope, elem, attrs, ctrl) {
            var firstPassword = '#' + attrs.pwCheck;
            elem.add(firstPassword).on('keyup', function () {
                scope.$apply(function () {
                    // console.info(elem.val() === $(firstPassword).val());
                    ctrl.$setValidity('pwmatch', elem.val() === $(firstPassword).val());
                });
            });
        }
    }
}])
.directive('emailPattern', ["commonService", function (commonService) {
  return {
    restrict: 'A',
    require: '?ngModel',
    link: function(scope, elm, attr, ctrl) {
      if (!ctrl) return;
      var regexp = commonService.CONSTANTS.EMAIL.PATTERN;
	  if (regexp && !regexp.test) {
	      throw minErr('ngPattern')('noregexp',
	      'Expected {0} to be a RegExp but was {1}. Element: {2}', patternExp,
	      regexp, startingTag(elm));
	  }
	  ctrl.$validate();
      ctrl.$validators.pattern = function(modelValue, viewValue) {
        // HTML5 pattern constraint validates the input value, so we validate the viewValue
        return ctrl.$isEmpty(viewValue) || regexp.test(viewValue);
      };
    }
  };
}])
.directive('syncScroll', ["commonService", function(commonService) {
	return {
		restrict: 'A',
		link: function(scope, element, attr) {
			var scrollTopTarget = attr.syncScrollTop;
			var scrollLeftTarget = attr.syncScrollLeft;
			element.on('scroll', function () {
				if (commonService.hasValueNotEmpty(scrollTopTarget)) {
					angular.element(scrollTopTarget).scrollTop(element.scrollTop());
				}
				if (commonService.hasValueNotEmpty(scrollLeftTarget)) {
					angular.element(scrollLeftTarget).scrollLeft(element.scrollLeft());
				}
			});
		}
	};
}])
.directive('headerFilter', ["$compile", "commonService", function($compile, commonService) {
	return {
		restrict: 'E',
		require: '^^documentListView',
		scope: {
			listChoices: "=",
			searchFields : "=",
			translatePrefix : "@",
			isFilterShow : "="
		},
		link: function(scope, element, attr, documentListViewCtrl) {
			scope.filterValue = { values:[], fields : scope.searchFields };
			documentListViewCtrl.addFilterValueChain(scope.filterValue);
			
			var newEl = $compile("<div>" +
									"<md-select aria-label='noname" +
									"' ng-if=\"isFilterShow\" ng-model=\"filterValue.values\" multiple " +
										"md-on-close=\"updateView()\" >" +
										"<md-option ng-repeat=\"option in listChoices\" value=\"{{option.key}}\">{{'" + scope.translatePrefix +  "' + option.key | translate}}</md-option>" +
									"</md-select>"+
								"</div>")(scope);
			element.append(newEl);
			
			scope.updateView = function () {
				documentListViewCtrl.updateView();
			};
		}
	};
}])
/**
 * lpham 24
 * Direct format phone number for project UIC only 
 */
.directive('phoneNumber', [function() {
	return {
		restrict: 'A',
		link: function(scope, element, attr) {
			if( attr.telephone ){
				element.mask('999-9-9999999',{placeholder:"XXX-X-XXXXXXX"});
			}
			if( attr.mobilephone ){
				element.mask('999-99-9999999',{placeholder:"XXX-XX-XXXXXXX"});
			}
		}
	};
	
}])
.directive('toggleButton', ['commonService',function(commonService) {
  return {
    require: 'ngModel',
    scope: {
      activeText: '@',
      inactiveText: '@',
      activeValue : '@',
	  inactiveValue : '@',
      lightState: '=ngModel',
      isDisable:'=',
      onChange:'&'
    },
    replace: true,
    transclude: true,
    template: '<div>' +
              '<span ng-transclude></span> ' +
              '<button class="btn btn-toggle-small" ng-class="{\'btn-toggle-active\': state.isActive, \'btn-toggle\': !state.isActive}" ng-click=" state.toggle(activeValue);" ng-disabled="isDisable">{{activeText}}</button>' +
              '<button class="btn btn-toggle-small" ng-class="{\'btn-toggle-active\': state.isInactive, \'btn-toggle\': !state.isInactive}" ng-click="state.toggle(inactiveValue);" ng-disabled="isDisable">{{inactiveText}}</button>' +
              '</div>',
    link: function postLink(scope, element, attr) {
    	var isActive = scope.lightState === scope.activeValue;
    	var isInactive = scope.lightState === scope.inactiveValue;
        scope.state = {
            isActive: isActive,
            isInactive: isInactive,
            toggle: function(selectedValue) {
              scope.lightState = selectedValue;
              this.isActive = scope.lightState === scope.activeValue;
              this.isInactive = scope.lightState === scope.inactiveValue;
            }
        };
        scope.$watch('lightState', function(_old, _new) {
            if(_old === _new)
                return;
            if(scope.onChange){
                scope.onChange();
            }
            scope.state.isActive = scope.lightState === scope.activeValue;
            scope.state.isInactive = scope.lightState === scope.inactiveValue;1
        });

        if(scope.isDisable && scope.state.isActive ){
            element[0].children[1].style= "background-color: #2bbbad !important;color: white !important;";
        }
        if(scope.isDisable && scope.state.isInactive){
            element[0].children[2].style= "background-color: #2bbbad !important;color: white !important;";
        }
    }
  }
}])
.directive('autoCompleteUic', ["$compile", "$http", "$window", function ($compile, $http, $window) {
	return {
		scope : {
			list: "=autoCompleteUicList", //[]
			onItemSelected : "&autoCompleteUicOnItemSelected", //function (item) {}
			text : "=ngModel",
			type : "@autoCompleteUicType"
		},
		link: function (scope, element, attr) {
			var containerItems;
			$http.get(resourceServerPath + 'view/workspaces/template/interested-party-dedup.html')
	        .then(function(html) {
	        	containerItems = $compile(html.data)(scope);
	 			angular.element($window.document.getElementsByTagName('body')[0]).append(containerItems);
	 			element.on("focus", function (){
	 				openContainerItems();
	 			});
	 			element.on("blur", function (){
	 				setTimeout(function (){
	 					closeContainerItems();
	 				},500);
	 			});
	 			
	 			containerItems.attr('id',attr.autoCompleteUic);
	 			
	 			 scope.$watch(function () {
	 	            return scope.list;
	 	          }, function(_new, _old) {
	 				 if(scope.isOpen) // update current list opened
	 					 openContainerItems();
	 			 });
	 			
	        },function(){
	            $log.error("File not found!");
	        });
			
			var getRootOffsetLeft = function getRootOffsetLeft (elem, val){
				if (elem.offsetParent === null){
					return val + elem.offsetLeft;
				}
				return getRootOffsetLeft(elem.offsetParent, val + elem.offsetLeft);
			};
			
			var getRootOffsetTop = function getRootOffsetTop (elem, val){
		         if (elem.offsetParent === null){
		            return val + elem.offsetTop;
		         }
		         return getRootOffsetTop(elem.offsetParent, val + elem.offsetTop);
		    };
		    
		    var openContainerItems = function () {
				var offsetLeft = getRootOffsetLeft(element[0],0);
				var offsetTop = getRootOffsetTop(element[0],0) + element[0].offsetHeight;
				var offsetWidth = element[0].offsetWidth;
				var height = scope.list.length == 0 ? 0 : 260;
				
		    	containerItems.attr('style', 'left: ' + offsetLeft + 'px; width: ' + offsetWidth + 'px; top: ' + offsetTop+ 'px; bottom: auto; display: block; height: auto; max-height: ' + height + 'px')
		    	$( window ).bind( "click", onClickOutside );
		    	scope.isOpen = true;
		    };
		    
		    var closeContainerItems = function () {
		    	containerItems.attr('style', 'display: none');
		    	$( window ).unbind( "click", onClickOutside );
		    	scope.isOpen = false;
		    };
		     
		    var onClickOutside = function(event) {
		    	//click into the input. don't close.
		    	if(element[0] === event.target){
		    		return;
		    	}
		    	closeContainerItems();
		    };
		    
		}
	}
}])
.directive('matchText', [ function () {
	return {
		scope : {
			matchText : "="
		},
		link: function (scope, element, attr) {
			setTimeout(function (){
				var searchTexts = scope.matchText, 
					lable = element.html().split(":")[0] + ":", 
					text  = element.html().split(":")[1],
					regEx,
					index = 0;
				if(searchTexts){
					var result = "";
					searchTexts.split(" ").forEach(function (searchText){
						regEx = new RegExp(searchText, "ig");
						if( (index = text.search(regEx)) >= 0){
							var k = 0;
							result = result + text.substring(0, index);
							k = text.substring(0, index).length;
							text = text.substring(index, text.length);
							
							index -= k;
							var subText = text.substring(index , index + searchText.length);
							result = result +  "<span style=\"color: red\">" + subText + "</span>";
							text = text.substring(index + searchText.length, text.length);
						}
					});
					result = result + text;
					element.html(lable + result);
				}
        	}, 100);
		}
	}
}])
.directive('noDoubleSpace', ["commonUIService", function (commonUIService) {
	return {
		require: '?ngModel',
		link: function (scope, element, attr, modelCtrl) {
			 modelCtrl.$parsers.push(function (inputValue) {
				 var isCheckDoubleSpace = false ;
				 while (inputValue && inputValue.indexOf("  ") > -1){
					 inputValue = inputValue.replace("  ", " ");
                     isCheckDoubleSpace = true;
				 }
				 if(isCheckDoubleSpace){
                     commonUIService.showNotifyMessage("v4.common.message.UICDoubleSpaceCorporateNameNotAllow", "error");
                 }
				 inputValue = inputValue.trim();
                 modelCtrl.$setViewValue(inputValue);
                 modelCtrl.$render();
				 return inputValue;
			 });
			 
			 modelCtrl.$formatters.unshift(function(valueFromModel) {
				 while (valueFromModel && valueFromModel.indexOf("  ") > -1){
					 valueFromModel = valueFromModel.replace("  ", " ");
				 }
				 return valueFromModel;
			 });
		}
	}
}])
.directive('noTrim', ["$compile", function($compile){
    // Runs during compile
    return {
      link: function (scope, iElement, iAttrs) {
        if (iElement.attr('type') === 'text') {
          iAttrs.$set('ngTrim', "false");
        }
      }
    };
}])
.directive('percent', ["commonService", function(commonService){
	return {
		require: '?ngModel',
		link: function (scope, eElement, iAttrs, modelCtrl) {
		 modelCtrl.$formatters.unshift(function(valueFromModel) {
			 if(commonService.hasValueNotEmpty(valueFromModel)){
				 valueFromModel = valueFromModel + "%";
			 }
			 return valueFromModel;
		 });
    	  eElement.on("blur", function (){
    		  var val = eElement.val();
    		  if(commonService.hasValueNotEmpty(val)){
    			  val = val + "%";
    		  }
    		  eElement.val(val);
    	  });
    	  eElement.on("focus", function (){
    		  var val = eElement.val();
    		  if(commonService.hasValueNotEmpty(val)){
    			  val = val.replace("%","");
    		  }
    		  eElement.val(val);
    	  });
      }
    };
}])
.directive('noSpecialChar',["commonUIService", function(commonUIService) {
    return {
        require: 'ngModel',
        restrict: 'A',
        link: function(scope, element, attrs, modelCtrl) {
            modelCtrl.$parsers.push(function(inputValue) {
                var isCheckSpecialCharater = false;
                if (inputValue == null)
                    return ''
                if((/[^\w\s]/gi).test(inputValue)){
                    isCheckSpecialCharater = true;
                    var inputValue = inputValue.replace(/[^\w\s]/gi, '');
                    while(inputValue && inputValue.indexOf("  ") > -1){
                        inputValue = inputValue.replace("  ", " ");
                    }
                }

                if(isCheckSpecialCharater){
                    commonUIService.showNotifyMessage("v4.common.message.UICSpecialCharaterCorporateNameNotAllow", "error");
                }
                modelCtrl.$setViewValue(inputValue);
                modelCtrl.$render();
                return inputValue;
            });
        }
    }
}])
.directive('setDefaultsizeTextarea', [function() {	
	return {
        restrict: 'A',
        require: '?ngModel',
        link: function (scope, element, attrs, controller) {
        	scope.$watch(attrs.ngModel, function(newValue) {
        	    if(newValue == "")
        	    	element[0].style.height = "25px";
        	});
        }
    } 
}])
/**
 * if all chlidUiElement valid, UiElement will be valid.
 */
.directive('childUiElement',["commonService", function(commonService) {
	return {
		require: 'ngModel',
		restrict: 'A',
		scope : true,
		link: function(scope, element, attrs, modelCtrl) {
			var jsonPath = attrs.childUiElement.split('.');
			
			var detail = scope;
			scope.jsonPath = jsonPath;
			jsonPath.forEach( function (path) {
				detail = detail[path];
			});
			
			if(detail.mandatory === "true"){
				scope.validStatus = "INVALID";
				scope.registerNewChild(scope);
				
				scope.$on('$destroy', function() {
					scope.unregisterChild(scope);
			    });
				
				scope.getValidStatus = function () {
					if(commonService.hasValueNotEmpty(scope.value)){
						scope.validStatus = "VALID";
					}else{
						scope.validStatus = "INVALID";
					}
					return scope.validStatus;
				}
				
				modelCtrl.$parsers.push(function(inputValue) {
						scope.value = inputValue;
						detail.errorCode = '';
						if(commonService.hasValueNotEmpty(inputValue))
							scope.validStatus = "VALID";
						else
							scope.validStatus = "INVALID";
						
						scope.changeStatus(scope.validStatus);
						return inputValue;
					}
				);
				
				modelCtrl.$formatters.unshift(
	                function(modelValue){
	                	scope.value = modelValue;
	                	if(commonService.hasValueNotEmpty(modelValue)){
	                		scope.validStatus = "VALID";
	                		var detail = scope;
	                		scope.jsonPath.forEach( function (path) {
	            				detail = detail[path];
	            			});
	                		if(commonService.hasValueNotEmpty(detail.errorCode))
	                			scope.validStatus = "INVALID";
	                		scope.changeStatus(scope.validStatus);
	                	}
	                    return modelValue;
	                }
	            );
			}
		}
	}
}])

.directive('clickOutside', ["$document", "uiFrameworkService", function($document, uiFrameworkService) {
    return {
       restrict: 'A',
       scope: {
           clickOutside: '&'
       },
       link: function (scope, el, attr) {

           $document.on('click', function (e) {
               if (!e.target.className.includes("childsidebarSum")) {
                    scope.$apply(function () {
                    	uiFrameworkService.isSummaryLeft = false;
                    });
                }
           });
       }
    }
}])
/*
 * Auto update another model base on ngModel change
 * ONLY use for dropdown input.
 * 
 * TODO: improve read data from nest object.
 * 
 */ 
.directive('whenModelUpdate',["commonService", function(commonService) {
	return {
		restrict: 'A',
		scope : {
			updateModel : '=whenModelUpdate',
			model: '=ngModel',
			list : '=whenModelUpdateList',
			from : '@whenModelUpdateFrom',
			to : '@whenModelUpdateTo',
			value: '@isValue'
			
		},
		link: function(scope, element, attrs) {
			scope.$watch('model', function(_new, _old) {      //when isDisplay's value is changed
	            if (_new !== _old){
	            	scope.list.forEach(function (item) {
	            		if(scope.value){
	            			if(item[scope.from][scope.value] === scope.model){
	            				scope.updateModel[scope.value] = item[scope.to][scope.value];
	            			}
	            		}else{
	            			if(item[scope.from] === scope.model){
	            				scope.updateModel = item[scope.to];
	            			}	
	            		}
	            	});
	            }
	        });
		}
	}
}])
.directive('whenModelUpdatecountry2',["commonService", function(commonService) {
	return {
		restrict: 'A',
		scope : {
			updateModel : '=whenModelUpdatecountry2',
			updateModel1:'=whenModelUpdatecountry1',
			updateModel2:'=whenModelUpdateconveyance',
			model: '=ngModel',
			list : '=whenModelUpdateList',
			list1: '=whenModelUpdateList1',
			from : '@whenModelUpdateFrom',
			to : '@whenModelUpdateTo',
			value: '@isValue'
			
		},
		link: function(scope, element, attrs) {
			scope.$watch('model', function(_new, _old) {      //when isDisplay's value is changed
	            if (_new !== _old){
	            	var gt="";
	            	var dem=0;
	            	var authen=false;
	            	scope.list.forEach(function (item) {
	            		if(scope.value){
	            			
	            			if(item[scope.from][scope.value] === scope.model){
	            				gt="";
	            				scope.updateModel[scope.value] = item[scope.to][scope.value];
	            				scope.list1.forEach(function(item1){
	            					if(item1["description"][scope.value] === scope.updateModel1[scope.value]){
	            						authen=true;
	            					}
	            				})
	            				if(authen==true){
	            					gt+="From "+scope.updateModel1[scope.value];
	            				}
	            				gt+=" To "+scope.updateModel[scope.value];
	            				scope.updateModel2[scope.value]=gt;
	            				dem=dem+1;
	            			}else if(dem<=0){
	            				gt="";
	            				scope.list1.forEach(function(item1){
	            					if(item1["description"][scope.value] === scope.updateModel1[scope.value]){
	            						authen=true;
	            					}
	            				})
	            				if(authen==true){
	            					gt+="From "+scope.updateModel1[scope.value];
	            				}
	            				scope.updateModel2[scope.value]=gt;
	            				
	            			}
	            			
	            		}else{
	            			if(item[scope.from] === scope.model){
	            				scope.updateModel = item[scope.to];
	            			}	
	            		}
	            	});
	            }
	        });
		}
	}
}])
.directive('whenModelUpdatecountry',["commonService", function(commonService) {
	return {
		restrict: 'A',
		scope : {
			updateModel : '=whenModelUpdatecountry',
			updateModel1:'=whenModelUpdatecountry1',
			updateModel2:'=whenModelUpdateconveyance',
			model: '=ngModel',
			list : '=whenModelUpdateList',
			list1: '=whenModelUpdateList1',
			from : '@whenModelUpdateFrom',
			to : '@whenModelUpdateTo',
			value: '@isValue'
			
		},
		link: function(scope, element, attrs) {
			scope.$watch('model', function(_new, _old) {      //when isDisplay's value is changed
	            if (_new !== _old){
	            	var gt="";
	            	var dem=0;
	            	var authen=false;
	            	scope.list.forEach(function (item) {
	            		if(scope.value){
	            		
	            			if(item[scope.from][scope.value] === scope.model){
	            				gt="";
	            				scope.updateModel[scope.value] = item[scope.to][scope.value];
	            				gt+="From "+item[scope.to][scope.value];
	            				scope.list1.forEach(function(item1){
	            					if(item1["description"][scope.value] === scope.updateModel1[scope.value]){
	            						authen=true;	
	            					}	
	            				})
	            				if(authen==true){
	            					gt+=" To "+scope.updateModel1[scope.value];
	            				}
	            				
	            				scope.updateModel2[scope.value]=gt;
	            				dem=dem+1;
	            			}
	            			else if(dem<=0){
	            				gt="";
	            				if(scope.updateModel1[scope.value]!=null &&scope.updateModel1[scope.value]!=""){
	            					gt+=" To "+scope.updateModel1[scope.value];
	            				}
	            				scope.updateModel2[scope.value]=gt;
	            			}
	            			
	            				
	            			
	            		}else{
	            			if(item[scope.from] === scope.model){
	            				scope.updateModel = item[scope.to];
	            			}	
	            		}
	            	});
	            }
	        });
		}
	}
}])
.directive('whenModelUpdate1',["commonService", function(commonService) {
	return {
		restrict: 'A',
		scope : {
			updateModel : '=whenModelUpdate1',
			updateModelLiability : '=whenModelUpdate2',
			model: '=ngModel',
			list : '=whenModelUpdateList',
			from : '@whenModelUpdateFrom',
			to : '@whenModelUpdateTo',
			value: '@isValue'
			
		},
		link: function(scope, element, attrs) {
			scope.$watch('model', function(_new, _old) {      //when isDisplay's value is changed
	            if (_new !== _old){
	            	scope.list.forEach(function (item) {
	            		if(scope.value){
	            			if(item[scope.from][scope.value] === scope.model){
	            				scope.updateModel[scope.value] = item[scope.to][scope.value];
	            				scope.updateModelLiability[scope.value]=item["mocLiabilityLimit"][scope.value];
	            			}
	            		}else{
	            			if(item[scope.from] === scope.model){
	            				scope.updateModel = item[scope.to];
	            			}	
	            		}
	            	});
	            }
	        });
		}
	}
}])
.directive('checkMinMaxValues', ['appService', 'commonService', '$locale', 
    function(appService, commonService, $locale) {
  return {
        require: '?ngModel',
        priority: 9,
        link: function(scope, element, attrs, model) {
        	
          if (model != null) {
            element.bind("blur", function(){
              var value = model.$viewValue;
			  var maxValue = element.attr('max') || 999999999999999.99;
			  var minValue = element.attr('min') || 0;
              if(parseInt(value.replace(',','')) > parseInt(maxValue)){
              	model.$setViewValue(maxValue);
				element.val(maxValue);
              }else if(value == "" || value == undefined || parseInt(value) < parseInt(minValue)){
				model.$setViewValue(minValue);
				element.val(minValue);
			  }
            });
          }                   
        }
      };
}])
.directive('ngMiddleClick', [ function() {
	return {
		restrict: 'A',
		link: function ngMiddleClickLink(scope, element, attrs) {
			var clickExpression = attrs.ngMiddleClick || attrs.ngClick;

			if (clickExpression){
				// Using 'auxclick' cause modern browsers no longer trigger 'click' event for middle button
				// https://w3c.github.io/uievents/#event-type-auxclick
				var event = ('onauxclick' in document.documentElement) ? 'auxclick' : 'mousedown';

				element.on(event, function (e) {
					if(e.which === 2) {
						// Not sure if the 'preventDefault' will always work when using 'mousedown' event
						if(e.currentTarget.getAttribute('disabled') === 'disabled') {
							return e.preventDefault();
						}

						scope.$eval(clickExpression, { $event: e });
					}
				});
			}
		}
	}
}])
.directive('posAutonumericWithSlider2', ['appService', 'commonService', '$locale', 'fnaCoreService',
    function(appService, commonService, $locale, fnaCoreService) {
  return {
        require: '?ngModel',
        priority: 10,
        link: function(scope, element, attrs, model) {
        var opts = angular.extend({}, {
            aSep: $locale.NUMBER_FORMATS.GROUP_SEP, 
            aDec: $locale.NUMBER_FORMATS.DECIMAL_SEP, 
            mDec: attrs.decimal == undefined ? 2 : attrs.decimal, 
            aPad: true,
            nBracket: "(,)",}, 
            
          scope.$eval(attrs.posAutonumeric));
          if (model != null) {
			element.bind("keyup blur", function(){
            var value = model.$viewValue;
            	
            if(value !== undefined){
	            var testValue = element.val();
	            var newValue = '';
	            if(testValue !== '') newValue = element.autoNumeric('get');
	            if(value !== newValue){
	            	// Start - Using for slider FNA
	                if(fnaCoreService != undefined && scope.uiElement.refDetail != undefined) {
		              	  var maxValue = fnaCoreService.findElementInElement(scope.uiElement.refDetail, ['maxvalue']);
		              	  if(maxValue != undefined && maxValue != null && maxValue < newValue){
		              		  element.autoNumeric('update', {vMax: maxValue});  
		              		  newValue = maxValue;
		              		  model.$setViewValue(maxValue);
		              	  }
		              	  var minValue = fnaCoreService.findElementInElement(scope.uiElement.refDetail, ['minvalue']); 
		              	  if(minValue != undefined && minValue != null && minValue > newValue){
		            		  newValue = minValue;
		            		  model.$setViewValue(minValue);
		            	  }
	              	  // End - - Using for slider FNA
	                } else {
			              return scope.$apply(function() {
			                if(opts.percent)
			                  newValue = newValue/100;
			                  return model.$setViewValue(newValue);
			              });  
	                }
	            } 
            }
             return false;
			});

            model.$render = function() {
              var value = model.$viewValue;
                if(opts.percent)
                  value = value * 100;
                if(angular.isString(value))
                  value = value.replace(/,/gi,'');
              return element.autoNumeric('set', value);
            };
          }
          return element.autoNumeric(opts);
        }
      };
}])

//////////////////// CUSTOMIZE FOR NEW UI FRAMEWORK   /////////////////////////////////////////


.directive("uiHeaderItem", ['$log', '$compile', 'commonService', 'uiRenderPrototypeService', 'uiFrameworkService',
	function($log, $compile, commonService, uiRenderPrototypeService, uiFrameworkService) { 
		return {
			restrict: 'E',
	        scope: false,
	        templateUrl: resourceServerPath + 'view/workspaces/template/ui-header-item.html',
	        link: function(scope, element, attr) {
	        }
		}
}])

.directive("uiSection", ['$log', '$compile', 'commonService', 'uiRenderPrototypeService', 'uiFrameworkService',
	function($log, $compile, commonService, uiRenderPrototypeService, uiFrameworkService) { 
		return {
			restrict: 'E',
			scope: false,
	        templateUrl: resourceServerPath + 'view/workspaces/template/ui-section.html',
		}
}])

.directive("uiSectionContent", ['$log', '$compile', 'commonService', 'uiRenderPrototypeService', 'uiFrameworkService', '$timeout',
  function($log, $compile, commonService, uiRenderPrototypeService, uiFrameworkService, $timeout) {   

    /**
     * set card's visible to 'true' or 'false'
     * @param {Object}  jqEle       jquery element
     * @param {boolean}  isVisible  true or false
     */
    function setHtmlEleVisible(jqEle, isVisible) {
      isVisible ? jqEle.css("display", "initial") : jqEle.css("display", "none");
    }

    return {
        restrict: 'E',
        scope: false,
        
        templateUrl: resourceServerPath + 'view/workspaces/template/ui-section-content.html',
        link: function(scope, element, attr) {

          var currCard, visibleWatcherFn;
          scope.setCardVisible = setHtmlEleVisible;
          function setupCard (scope, element, attr) {       

            currCard = scope.card;
            currCard.html = element;
            currCard.scope = scope;

            currCard.level = attr.level;
            
            // card's open status
           // currCard.isOpening = false;

            currCard.cardStatus = "start";
            currCard.refreshCard = false;
            
            scope.cardElement  = element.find(".v3-live-card-info");
            scope.byLevel = attr.level;
            //update css of selecting & leaf node
            scope.setSelectCss();
            scope.setCssLeafCard();

            var visible = scope.card.isVisible;
            //if isVisible is function, continuously watching it
            if (angular.isString(visible)){
              //if visibleWatcherFn is exist, clear the old watching
              if(visibleWatcherFn)
                visibleWatcherFn();

              visibleWatcherFn = scope.$watch(visible, function(_new) {
                setHtmlEleVisible(element, _new);
              });
            }
            else{
              setHtmlEleVisible(element, visible);
            }
          }
          
          //setup initalized values again
          element.on('$destroy', function() {
            //IVPORTAL-5168: START
            var currCard = scope.card;
            if(currCard){
               currCard.isSelected = false;
               currCard.html = undefined;
               currCard.scope = undefined;
            }
            //IVPORTAL-5168: END
          });
          
        //prevent double click whithin 1s, this bug appear in samsung tablet, when user click 1 device detect as double clicks
          scope.isContinue = true;
          function doFreeze (){
        	  if(scope.isContinue == true){
        		  scope.isContinue = false;
        		  $timeout(function() {
                	  scope.isContinue = true; 
                  }, 1000);
        	  }
          }
          
          element.bind('click', 
            function(event) {
        	  
        	//fix double clicks on tablet samsung android
        	  if (scope.isContinue == false){
        		  return;
        	  }
        	  
        	  doFreeze();
                            
              $log.debug("Click on card [level: " + currCard.level + ", index: " + scope.$index + "]");

              //User Guide: there are userguide list on Card and @click Button on it, it will return (Since it will do not call other function)
              if (event.target.nodeName == "BUTTON"){
                return;
              }

              if (!currCard.isCardOpenable())
                return;

              if(currCard.onOpen && !currCard.isSelected){
                  var isContinue = scope.$eval(currCard.onOpen);

                  switch(true){
                    case isContinue === undefined:
                       scope.isContinueOpenCard(event);
                      break;
                      //stop if return false
                      case isContinue === false:
                        return;

                      //promise case: need to wait before the onOpen functions finish
                      case isContinue.$$state !== undefined:
                          isContinue.then(function () {
                             scope.isContinueOpenCard(event);
                          });
                          break;
                      default:
                         scope.isContinueOpenCard(event);
                  }
              }
              //if doesn't have 'onOpen' attribute, continue
              else{

                  if(currCard.cardType === uiRenderPrototypeService.CONSTANTS.cardType.ACTION 
                    && currCard.onClick){
                      scope.$eval(currCard.onClick);

                      //this card has staticHtml need to render!
                      if(currCard.staticHtml)
                        scope.isContinueOpenCard(event);
                  }
                  else{
                    scope.isContinueOpenCard(event);
                  }
              }
          });           
          
          scope.isContinueOpenCard = function isContinueOpenCard (event) {     
            //set selected or not
            currCard.isSelected = !currCard.isSelected;
            scope.setSelectCss();
            
            if(!currCard.isViewed) currCard.isViewed = true;
            
            //notify other siblings 
            var siblingCards = currCard.parent ? currCard.parent.children : [];
            for (var i = 0; i < siblingCards.length; i++) {
              if(siblingCards[i] !== currCard){                 
 //               siblingCards[i].isSelected = false;
//                siblingCards[i].scope.setSelectCss();
                
                //close all summary preview cgange card type
                //only show card preview on touch on touch device 
                if(commonService.options.cardTouchMode){
                  if(commonService.options.cardPreview){
                     if(currCard.cardStatus == "start"){
                    siblingCards[i].cardStatus = "detail";
                    siblingCards[i].scope.openSummary();
                    siblingCards[i].cardStatus = "start";
                  }
                  if(currCard.cardStatus == "detail"){
                    siblingCards[i].cardStatus = "detail";
                    siblingCards[i].scope.openSummary();
                    siblingCards[i].cardStatus = "start";
                  }
                    if(currCard.cardStatus == "summary"){
                    siblingCards[i].cardStatus = "smallDetail";
                  }
                  
                  if(currCard.cardStatus == "smallDetail"){
      
                    if(siblingCards[i].cardStatus  != "detail"){
                      siblingCards[i].cardStatus = "detail";
                      siblingCards[i].scope.openSummary();
                      siblingCards[i].cardStatus = "smallDetail";
                    }
                  }
                  if(currCard.cardStatus == "smallSummary"){
                    siblingCards[i].cardStatus = "smallDetail";
                    
                  }
                  }else{
                    siblingCards[i].cardStatus = "detail";
                    currCard.cardStatus = "detail";
                  }
                }
              }   
            };
            if(commonService.options.cardTouchMode){
              if(commonService.options.cardPreview){
                if(currCard.cardStatus == "smallSummary" ){
                  currCard.cardStatus = "summary";
                  currCard.prevSmallSummary = "detail";
                }else{
                  currCard.prevSmallSummary = undefined ;
                }
                scope.openSummary ();
              }
            }
            
            //execute the declare function
            scope.$eval(attr.whenClick, {clickEvent: event});
            // if(isContinue == false){
            //  currCard.isSelected = !currCard.isSelected;
            //  scope.setSelectCss();
            // }
            if(currCard.prevSmallSummary && commonService.options.cardTouchMode)
              currCard.cardStatus = currCard.prevSmallSummary;
        }
      
  
          /**
           * return false when can't set the css (element children can't be found, not render yet)
           */
          scope.setSelectCss = function setSelectCss () {
              if(element.children().length < 1) 
                return false;//check element has value
              
              var outerBox = element.children().children();
              var mainCard = outerBox.children();
              if(currCard.isSelected) {
            	  mainCard.addClass('active');
              }
              else {
            	  mainCard.removeClass('active');
              }      
              return true;                  
            };

          /**
           * return false when can't set the css (element children can't be found, not render yet)
           */
          scope.setCssLeafCard = function setCssLeafCard () {
          };

          //change style of summary card base on card's status
          scope.openSummary = function openSummary () {
            if(!commonService.options.cardTouchMode){
              return;
            }
            switch(currCard.cardStatus){
              case "detail":
                break;
              case "start":
                currCard.cardStatus = "summary";
                break;
              case "summary":
                currCard.cardStatus = "detail";
                break;
              case "smallDetail":
                currCard.cardStatus = "smallSummary";
                break;

            }
          };

          scope.isLeafCard = function isLeafCard () {   
            if(uiFrameworkService.isOpenedDetail)
              return false;
            
            if(!scope.viewProp)
              return true;

            return currCard.level == scope.viewProp.viewObject.length - 1;
          }
          
          scope.refreshCard = function refreshCard(){
            var newEl = $compile(template)(scope);
            element.replaceWith(newEl);
          }
          
          setupCard(scope, element, attr);  
          
          //when import a document, or remove a card in list
          //currCard content will be changed
          scope.$watch(
	        function () {
	            return scope.card;
	         },
	         function(_new, _old){
	                //re-setup the currCard
	                setupCard(scope, element, attr);
	          }
          );

        scope.$watch(
          function () {
              return scope.isLeafCard();
            },
            function(_new, _old){
        
              if(_new === undefined){
                return;
              }
              
              scope.setCssLeafCard();
            }
          );
        }
    };
}])

/* tab layout */
.directive("separateLine", ['$log', '$compile', 'commonService', 'uiRenderPrototypeService', 'uiFrameworkService',
	function($log, $compile, commonService, uiRenderPrototypeService, uiFrameworkService) { 
		return {
			restrict: 'E',
			scope: false,
	        templateUrl: resourceServerPath + 'view/workspaces/template/separate-line.html',
		}
}])

.directive("uiTab", ['$log', '$compile', 'commonService', 'uiRenderPrototypeService', 'uiFrameworkService', '$timeout',
	function($log, $compile, commonService, uiRenderPrototypeService, uiFrameworkService, $timeout) { 
		return {
			restrict: 'E',
			scope: false,
	        templateUrl: resourceServerPath + 'view/workspaces/template/ui-tab.html',
	        
	        link: function(scope, element, attr) {
	        	// waiting for render UI  and open tab
	        	$timeout(function () {
        			var level = parseInt(attr.level);
        			
	        		// move to priority tab or the first tab which is visible
	        		var initAtTabName = localStorage.getItem('initAtTabName');
	        		var initAtTabIndex = undefined;
	        		if(initAtTabName !== null) {
	        			var tabsList = scope.viewProp.viewObject[level];
	        			for(var index = 0; index < tabsList.length; index++) {
	        				if (tabsList[index].name === initAtTabName) {
	        					initAtTabIndex = index;
	        				}
	        			}
	        			
	        			localStorage.removeItem('initAtTabName');
	        		} else {
	        			// detect first card is visible to move to this
		        		var willOpenTabAtIndex = scope.getTabIndexToOpenAutomaticallyFromTabIndex(scope.viewProp.viewObject[level]);
		        		if(willOpenTabAtIndex !== undefined) {
		        			var willOpenTab = scope.viewProp.viewObject[level][willOpenTabAtIndex];
		        			initAtTabName = willOpenTab.name;
		        			initAtTabIndex = willOpenTabAtIndex;
		        		}
	        		}
	        		
	        		if(initAtTabName !== undefined && initAtTabIndex !== undefined) {
	        			scope.moveToCard(initAtTabName);
		        		// update header status
		        		$timeout(function () {
				        	// set current tab index which is focused
				        	uiFrameworkService.currentTabIndex = initAtTabIndex;
		        		}, 500);
	        		}
	        	}, 1000);
	        	
	        	element.on('$destroy', function() {
	        		uiFrameworkService.currentTabIndex = undefined;
	        	})
	        }
		}
}])
/*
.directive("uiTabHeader", ['$log', '$compile', 'commonService', 'uiRenderPrototypeService', 'uiFrameworkService',
	function($log, $compile, commonService, uiRenderPrototypeService, uiFrameworkService) { 
		return {
			restrict: 'E',
			scope: false,
	        templateUrl: resourceServerPath + 'view/workspaces/template/ui-tab-header.html',
		}
}])*/

.directive("uiTabContent", ['$log', '$compile', 'loadingBarService', 'commonService', 'uiRenderPrototypeService', 'uiFrameworkService', '$timeout',
	function($log, $compile, loadingBarService, commonService, uiRenderPrototypeService, uiFrameworkService, $timeout) { 
		/**
	     * set card's visible to 'true' or 'false'
	     * @param {Object}  jqEle       jquery element
	     * @param {boolean}  isVisible  true or false
	     */
	    function setHtmlEleVisible(currTab, jqEle, isVisible) {
	    	if(isVisible) {
	    		jqEle.css("display", "initial");
	    	} else {
	    		jqEle.css("display", "none");
	    		// reset selected flag
	    		if(currTab.isSelected) currTab.isSelected = false;
	    	}
	    }
	
		return {
			restrict: 'E',
			scope: false,
	        templateUrl: resourceServerPath + 'view/workspaces/template/ui-tab-content.html',
	        link: function(scope, element, attr) {
	        	var currTab, visibleWatcherFn;
	        	scope.setCardVisible = setHtmlEleVisible;
	        	
	        	function setupTab (scope, element, attr) {
	        		currTab = scope.card;
	        		currTab.html = element;
	        		currTab.scope = scope;
	        		currTab.level = parseInt(attr.level);
	        		currTab.isSelected = false;
	        		
	        		var visible = currTab.isVisible;
	                //if isVisible is function, continuously watching it
	                if (angular.isString(visible)){
	                  //if visibleWatcherFn is exist, clear the old watching
	                  if(visibleWatcherFn)
	                    visibleWatcherFn();

	                  visibleWatcherFn = scope.$watch(visible, function(_new) {
	    				if (scope.card.isVisible === visible) {
	    					scope.card.visible = _new;
	    					setHtmlEleVisible(scope.card, element, _new);
	    				}
	                  });
	                } else{
	                  setHtmlEleVisible(scope.card, element, visible);
	                }
	        	}
	        	
	        	//setup initalized values again
	            element.on('$destroy', function() {
	              var currTab = scope.card;
	              if(currTab) {
	            	  currTab.isSelected = false;
	            	  currTab.html = undefined;
	            	  currTab.scope = undefined;
	              }
	              //IVPORTAL-5168: END
	            });
	            
	            //when import a document, or remove a card in list
	            //currCard content will be changed
	            scope.$watch(
		  	        function () {return scope.card;},
		  	        //re-setup the currCard
		  	        function(_new, _old){ 
		  	        	setupTab(scope, element, attr);
		  	        }
	            );
	            /* review this watcher later
	            scope.$watch(
                   function () {return scope.isLeafCard();},
                      function(_new, _old){
                        if(_new === undefined){
                          return;
                        }
                        scope.setCssLeafCard();
                      }
	             );*/
	            
	            setupTab(scope, element, attr); 
	            
	          //prevent double click within 1s, this bug appear in samsung tablet, when user click 1 device detect as double clicks
	            scope.isContinue = true;
	            function doFreeze (){
	          	  if(scope.isContinue == true){
	          		  scope.isContinue = false;
	          		  $timeout(function() {
	                  	  scope.isContinue = true; 
	                    }, 1000);
	          	  }
	            }
	            
	        	element.bind('click', 
	                function(event) {
	        		
		        		//fix double clicks on tablet samsung android
			          	  if (scope.isContinue == false){
			          		  return;
			          	  }
			          	  
			          	 doFreeze();
			          	$log.debug("Click on tab [level: " + currTab.level + ", index: " + scope.$index + "]");
			          	
			          	//User Guide: there are userguide list on Card and @click Button on it, it will return (Since it will do not call other function)
			            /* if (event.target.nodeName == "BUTTON"){
			                return;
			             }*/
			             
			             if (!currTab.isCardOpenable())
			                 return;
			             
			             if (currTab.onOpen === false) { 
			            	  return; 
			             }
			          	// show loading bar
			          	loadingBarService.showLoadingBar();
			             
			             if(currTab.onOpen && !currTab.isSelected){
			                  var isContinue = scope.$eval(currTab.onOpen);

			                  switch(true){
			                    case isContinue === undefined:
			                       scope.isContinueOpenCard(event);
			                      break;
			                      //stop if return false
			                      case isContinue === false:
			                    	// hide loading bar   
			    			        loadingBarService.hideLoadingBar();
			                        return;

			                      //promise case: need to wait before the onOpen functions finish
			                      case isContinue.$$state !== undefined:
			                          isContinue.then(function () {
			                             scope.isContinueOpenCard(event);
			                          });
			                          break;
			                      default:
			                         scope.isContinueOpenCard(event);
			                  }
			              } else {
			            	//if doesn't have 'onOpen' attribute, continue
			            	  if(currTab.cardType === uiRenderPrototypeService.CONSTANTS.cardType.ACTION && currTab.onClick){
			                      scope.$eval(currTab.onClick);
			                      //this card has staticHtml need to render!
			                      if(currTab.staticHtml)
			                        scope.isContinueOpenCard(event);
			                  } else{
			                    scope.isContinueOpenCard(event);
			                  }
			              }
	                    /*             
	                  $log.debug("Click on tab [level: " + currTab.level + ", index: " + scope.$index + "]");
	                  
	                  currTab.isSelected = true;
	                  //execute the declare function
	                  scope.$eval(attr.whenClick, {clickEvent: event});*/
			          // hide loading bar   
			          loadingBarService.hideLoadingBar();
	             });
	        	
	        	scope.isContinueOpenCard = function isContinueOpenCard (event) {     
	                //set selected or not
	        		currTab.isSelected = !currTab.isSelected;
	                scope.setSelectCss();
	                
	                if(!currTab.isViewed) currTab.isViewed = true;
	                
	                //notify other siblings 
	                var siblingCards = currTab.parent ? currTab.parent.children : [];
	                for (var i = 0; i < siblingCards.length; i++) {
	                  if(siblingCards[i] !== currTab){                 
	                    siblingCards[i].isSelected = false;
	                    siblingCards[i].scope.setSelectCss();
	                    
	                    //close all summary preview change card type
	                    //only show card preview on touch device 
	                    if(commonService.options.cardTouchMode){
	                      if(commonService.options.cardPreview){
	                         if(currTab.cardStatus == "start"){
		                        siblingCards[i].cardStatus = "detail";
		                        siblingCards[i].scope.openSummary();
		                        siblingCards[i].cardStatus = "start";
		                     }
		                     if(currTab.cardStatus == "detail"){
		                        siblingCards[i].cardStatus = "detail";
		                        siblingCards[i].scope.openSummary();
		                        siblingCards[i].cardStatus = "start";
		                      }
		                       if(currTab.cardStatus == "summary") {
		                        siblingCards[i].cardStatus = "smallDetail";
		                      }
		                      
		                      if(currTab.cardStatus == "smallDetail") {
		                        if(siblingCards[i].cardStatus  != "detail"){
		                          siblingCards[i].cardStatus = "detail";
		                          siblingCards[i].scope.openSummary();
		                          siblingCards[i].cardStatus = "smallDetail";
		                        }
		                      }
		                      if(currTab.cardStatus == "smallSummary"){
		                        siblingCards[i].cardStatus = "smallDetail";
		                      }
	                      } else {
	                        siblingCards[i].cardStatus = "detail";
	                        currTab.cardStatus = "detail";
	                      }
	                    }
	                  }   
	                }
	                
	                if(commonService.options.cardTouchMode) {
	                  if(commonService.options.cardPreview){
	                    if(currTab.cardStatus == "smallSummary" ){
	                    	currTab.cardStatus = "summary";
	                    	currTab.prevSmallSummary = "detail";
	                    }else{
	                    	currTab.prevSmallSummary = undefined ;
	                    }
	                    scope.openSummary ();
	                  }
	                }
	                
	                //execute the declare function
	                scope.$eval(attr.whenClick, {clickEvent: event});
	                if(currTab.prevSmallSummary && commonService.options.cardTouchMode)
	                	currTab.cardStatus = currTab.prevSmallSummary;
	            }
	        	
	        	/**
	             * return false when can't set the css (element children can't be found, not render yet)
	             */
	            scope.setSelectCss = function setSelectCss () {
	                if(element.children().length < 1) 
	                  return false;//check element has value
	                
	                var outerBox = element.children().children();
	                var mainCard = outerBox.children();
	                if(currTab.isSelected) {
	              	  mainCard.addClass('active');
	                }
	                else {
	              	  mainCard.removeClass('active');
	                }      
	                return true;                  
	              };
	        }
		}
}])

/* ui group section */
.directive("uiGroupSection", ['$log', '$compile', 'commonService', 'uiRenderPrototypeService', 'uiFrameworkService',
	function($log, $compile, commonService, uiRenderPrototypeService, uiFrameworkService) { 
		return {
			restrict: 'E',
			scope: false,
	        templateUrl: resourceServerPath + 'view/workspaces/template/ui-group-section.html',
	        link: function(scope, element, attr) {
	        }
		}
}])

/* ui group section content */
.directive("uiGroupSectionContent", ['$log', '$compile', 'commonService', 'uiRenderPrototypeService', 'uiFrameworkService',
	function($log, $compile, commonService, uiRenderPrototypeService, uiFrameworkService) { 
		return {
			restrict: 'E',
			scope: false,
	        templateUrl: resourceServerPath + 'view/workspaces/template/ui-group-section-content.html',
	        link: function(scope, element, attr) {
	        	scope.groupLevel = parseInt(attr.level);
	        	scope.groupIndex = parseInt(attr.index);
	        }
		}
}])

.directive("sectionIcon", ['$log', function($log) {
    return{
      restrict: 'A',
      scope: false,
      link: function(scope, ele, attr) {
        var iconData = scope.$eval(attr.sectionIcon);
        if(iconData.content.indexOf("(") != -1){//suport function to return string icon
        	var content = scope.$eval(iconData.content);
        }else{
        	var content = iconData.content;
        }

        var cssClass = iconData.cssClass;
        switch(iconData.contentType){
          case 'text'://case test: like type 1, type 2, ...
            ele.html(content);
            break;
          case 'function'://case content is a result from a dynamic function
            scope.$watch(content, function (_new, _old) {
              ele.html(_new);
            });
            break;
          case 'cssClass':
            cssClass = 'fa fa-trash-o'; /*cssClass + ' ' + content;*/
            break;
          default:
            $log.error("Icon Content is misconfiguration! (see the data below for more detail)");
            $log.error(iconData);
        }

        //handle css
        ele.addClass(cssClass);

        //handle isVisible att
        //If it's not string --> it's a function need to watch
        if(angular.isString(iconData.isVisible)){          
          scope.$watch(iconData.isVisible, function (_new, _old) {
            _new ? ele.css("display", "") : ele.css("display", "none");
          });
        }

        //handle onClick attribute
        if(iconData.onClick){
          ele.bind('click', function (event) {
            //don't allow the click event affect the main card
            event.stopPropagation();
            
            // close card if it is selected
            if(scope.card.isSelected) {
            	scope.closeChildCards(scope.card.level, scope);
            }
            
            scope.$eval(iconData.onClick);

            //if parent card has scope (not the root card)
            if (scope.card.parent.scope)
              scope.card.parent.scope.$digest();
            //get the main-ctrl in charge, and digest its children
            else
              scope.getCtrlInCharge().$digest();
          });
        }
      }
    };
}])

.directive("uiQuotationCardContent", ['$log', '$compile', 'commonService', 'uiRenderPrototypeService', 'uiFrameworkService', '$timeout',
  function($log, $compile, commonService, uiRenderPrototypeService, uiFrameworkService, $timeout) {   

    /**
     * set card's visible to 'true' or 'false'
     * @param {Object}  jqEle       jquery element
     * @param {boolean}  isVisible  true or false
     */
    function setHtmlEleVisible(jqEle, isVisible) {
      isVisible ? jqEle.css("display", "initial") : jqEle.css("display", "none");
    }

    return {
        restrict: 'E',
        scope: false,
        templateUrl: resourceServerPath + 'view/workspaces/template/ui-quotation-card-content.html',
        link: function(scope, element, attr) {
          uiFrameworkService.isOpenedDetail = false;
          var currCard, visibleWatcherFn;
          scope.setCardVisible = setHtmlEleVisible;

          function setupCard (scope, element, attr) {       

            currCard = scope.card;
            currCard.html = element;
            currCard.scope = scope;

            currCard.level = attr.level;

            currCard.cardStatus = "start";
            currCard.refreshCard = false;
            
            scope.cardElement  = element.find(".v3-live-card-info");

            //update css of selecting & leaf node
            scope.setSelectCss();
            scope.setCssLeafCard();


            var visible = currCard.isVisible;
            //if isVisible is function, continuously watching it
            if (angular.isString(visible)){
              //if visibleWatcherFn is exist, clear the old watching
              if(visibleWatcherFn)
                visibleWatcherFn();

              visibleWatcherFn = scope.$watch(visible, function(_new) {
				if (scope.card.isVisible === visible) {
					scope.card.visible = _new;
					setHtmlEleVisible(element, _new);
				}
              });
            }
            else{
              setHtmlEleVisible(element, visible);
            }
          }
          
          //setup initalized values again
          element.on('$destroy', function() {
            //IVPORTAL-5168: START
            var currCard = scope.card;
            if(currCard){
               currCard.isSelected = false;
               if (scope.moduleService.name !== "case" || !scope.uiFrameworkService.currentTabIndex === 2) { // hle71 - At Quotation tab
            	   currCard.html = undefined;
            	   currCard.scope = undefined;
               }
            }
            //IVPORTAL-5168: END
          });
          
        //prevent double click whithin 1s, this bug appear in samsung tablet, when user click 1 device detect as double clicks
          scope.isContinue = true;
          function doFreeze (){
        	  if(scope.isContinue == true){
        		  scope.isContinue = false;
        		  $timeout(function() {
                	  scope.isContinue = true; 
                  }, 1000);
        	  }
          }
            
          element.bind('click', 
            function(event) {
        	  
        	  //fix double clicks on tablet samsung android
        	  if (scope.isContinue == false){
        		  return;
        	  }
        	  
        	  doFreeze();
              $log.debug("Click on card [level: " + currCard.level + ", index: " + scope.$index + "]");

              //User Guide: there are userguide list on Card and @click Button on it, it will return (Since it will do not call other function)
              if (event.target.nodeName == "BUTTON"){
                return;
              }

              if (!currCard.isCardOpenable())
                return;
              
              if (currCard.onOpen === false) { 
            	  return; 
              }

              if(currCard.onOpen && !currCard.isSelected){
                  var isContinue = scope.$eval(currCard.onOpen);

                  switch(true){
                    case isContinue === undefined:
                       scope.isContinueOpenCard(event);
                      break;
                      //stop if return false
                      case isContinue === false:
                        return;

                      //promise case: need to wait before the onOpen functions finish
                      case isContinue.$$state !== undefined:
                          isContinue.then(function () {
                             scope.isContinueOpenCard(event);
                          });
                          break;
                      default:
                         scope.isContinueOpenCard(event);
                  }
              }
              //if doesn't have 'onOpen' attribute, continue
              else{

                  if(currCard.cardType === uiRenderPrototypeService.CONSTANTS.cardType.ACTION 
                    && currCard.onClick){
                      scope.$eval(currCard.onClick);

                      //this card has staticHtml need to render!
                      if(currCard.staticHtml)
                        scope.isContinueOpenCard(event);
                  }
                  else{
                    scope.isContinueOpenCard(event);
                  }
              }
          });           
          
          scope.isContinueOpenCard = function isContinueOpenCard (event) {     
            //set selected or not
            currCard.isSelected = !currCard.isSelected;
            scope.setSelectCss();
            
            if(!currCard.isViewed) currCard.isViewed = true;
            
            //notify other siblings 
            var siblingCards = currCard.parent ? currCard.parent.children : [];
            for (var i = 0; i < siblingCards.length; i++) {
              if(siblingCards[i] !== currCard){                 
                siblingCards[i].isSelected = false;
                siblingCards[i].scope.setSelectCss();
                
                //close all summary preview cgange card type
                //only show card preview on touch on touch device 
                if(commonService.options.cardTouchMode){
                  if(commonService.options.cardPreview){
                     if(currCard.cardStatus == "start"){
                    siblingCards[i].cardStatus = "detail";
                    siblingCards[i].scope.openSummary();
                    siblingCards[i].cardStatus = "start";
                  }
                  if(currCard.cardStatus == "detail"){
                    siblingCards[i].cardStatus = "detail";
                    siblingCards[i].scope.openSummary();
                    siblingCards[i].cardStatus = "start";
                  }
                    if(currCard.cardStatus == "summary"){
                    siblingCards[i].cardStatus = "smallDetail";
                  }
                  
                  if(currCard.cardStatus == "smallDetail"){
      
                    if(siblingCards[i].cardStatus  != "detail"){
                      siblingCards[i].cardStatus = "detail";
                      siblingCards[i].scope.openSummary();
                      siblingCards[i].cardStatus = "smallDetail";
                    }
                  }
                  if(currCard.cardStatus == "smallSummary"){
                    siblingCards[i].cardStatus = "smallDetail";
                    
                  }
                  }else{
                    siblingCards[i].cardStatus = "detail";
                    currCard.cardStatus = "detail";
                  }
                }
              }   
            };
            if(commonService.options.cardTouchMode){
              if(commonService.options.cardPreview){
                if(currCard.cardStatus == "smallSummary" ){
                  currCard.cardStatus = "summary";
                  currCard.prevSmallSummary = "detail";
                }else{
                  currCard.prevSmallSummary = undefined ;
                }
                scope.openSummary ();
              }
            }
            
            //execute the declare function
            scope.$eval(attr.whenClick, {clickEvent: event});
            if(currCard.prevSmallSummary && commonService.options.cardTouchMode)
              currCard.cardStatus = currCard.prevSmallSummary;
        }

		/**
		  * return false when can't set the css (element children can't be found, not render yet)
		  */
		scope.setSelectCss = function setSelectCss () {
			if(element.children().length < 1)
				return false;//check element has value

			var mainCard = element.children().children();
			var cardInfo = mainCard.find(".v3-live-card-info");
			var backgroundInfo = mainCard.css("background");
			if (backgroundInfo !="" && backgroundInfo != "rgba(0, 0, 0, 0)" && backgroundInfo != "white") {
				cardInfo.css("background", backgroundInfo);
			}

			// if (!currCard.isSelected) {
			// 	mainCard.attr('style', 'opacity: 0.6');
			// } else {
			// 	mainCard.attr('style', 'opacity: 1');
			// }
			return true;
		};

          /**
           * return false when can't set the css (element children can't be found, not render yet)
           */
          scope.setCssLeafCard = function setCssLeafCard () {
            if(element.children().length < 1)
              return false;
            
            var mainCard = element.children().children();

            if(scope.isLeafCard()) {
              // Remove small class
              if($(window).width() > 500){
                  scope.maxTrimTextTitle = "22";  
              } else {
                scope.maxTrimTextTitle = "20";
              }
              mainCard.removeClass( "v3-small-live-card-item" ).addClass("v3-live-card-item");
//              currCard.cardStatus = "summary";
            
            }
            else {
              // Set small card
              if($(window).width() > 500){
                scope.maxTrimTextTitle = "40";
              }
              mainCard.removeClass( "v3-live-card-item" ).addClass("v3-small-live-card-item");
              //currCard.cardStatus = "detail";
            }

            return true;
          };

          //change style of summary card base on card's status
          scope.openSummary = function openSummary () {
            if(!commonService.options.cardTouchMode){
              return;
            }
            switch(currCard.cardStatus){
              case "detail":
                element.find(".v3-live-card-info").removeClass("v3-live-card-item-hover").removeClass("v3-small-live-card-item-hover");
                //currCard.cardStatus = "detail";
                break;
              case "start"://open card review
                element.find(".v3-live-card-info").addClass("v3-live-card-item-hover");
                currCard.cardStatus = "summary";
                break;
              case "summary"://
                element.find(".v3-live-card-info").removeClass("v3-live-card-item-hover");
                element.find(".v3-live-card-info").removeClass("v3-small-live-card-item-hover");
                currCard.cardStatus = "detail";
                break;
      
              case "smallDetail":
                element.find(".v3-live-card-info").addClass("v3-small-live-card-item-hover");
                element.find(".v3-small-live-card-item").css("overflow", "visible");
                currCard.cardStatus = "smallSummary";
                break;
            }
          };
          
          scope.isLeafCard = function isLeafCard () {   
            if(uiFrameworkService.isOpenedDetail)
              return false;
            
            if(!scope.viewProp)
              return true;

            return currCard.level == scope.viewProp.viewObject.length - 1;
          }
          
          scope.refreshCard = function refreshCard(){
            var newEl = $compile(template)(scope);
            element.replaceWith(newEl);
          }
                    
          setupCard(scope, element, attr);  
          
          //when import a document, or remove a card in list
          //currCard content will be changed
          scope.$watch(
	        function () {return scope.card;},
	        //re-setup the currCard
	        function(_new, _old){setupCard(scope, element, attr);}
          );

        scope.$watch(
        	function () {return scope.isLeafCard();},
			function(_new, _old){        
			  if(_new === undefined){return;}              
			  scope.setCssLeafCard();
			}
          );                       
        }
    };
}])

.directive("uiQuotationAction", ['$log', '$compile', 'commonService', 'uiRenderPrototypeService', 'uiFrameworkService', '$timeout',
  function($log, $compile, commonService, uiRenderPrototypeService, uiFrameworkService, $timeout) {   

    /**
     * set card's visible to 'true' or 'false'
     * @param {Object}  jqEle       jquery element
     * @param {boolean}  isVisible  true or false
     */
    function setHtmlEleVisible(jqEle, isVisible) {
      isVisible ? jqEle.css("display", "initial") : jqEle.css("display", "none");
    }

    return {
        restrict: 'E',
        scope: false,
        templateUrl: resourceServerPath + 'view/workspaces/template/ui-quotation-action.html',
        link: function(scope, element, attr) {
          uiFrameworkService.isOpenedDetail = false;
          var currCard, visibleWatcherFn;
          scope.setCardVisible = setHtmlEleVisible;

          function setupCard (scope, element, attr) {       

            currCard = scope.card;
            currCard.html = element;
            currCard.scope = scope;

            currCard.level = attr.level;

            currCard.cardStatus = "start";
            currCard.refreshCard = false;
            
            scope.cardElement  = element.find(".v3-live-card-info");

            //update css of selecting & leaf node
            scope.setSelectCss();
            scope.setCssLeafCard();


            var visible = currCard.isVisible;
            //if isVisible is function, continuously watching it
            if (angular.isString(visible)){
              //if visibleWatcherFn is exist, clear the old watching
              if(visibleWatcherFn)
                visibleWatcherFn();

              visibleWatcherFn = scope.$watch(visible, function(_new) {
				if (scope.card.isVisible === visible) {
					scope.card.visible = _new;
					setHtmlEleVisible(element, _new);
				}
              });
            }
            else{
              setHtmlEleVisible(element, visible);
            }
          }
          
          //setup initalized values again
          element.on('$destroy', function() {
            //IVPORTAL-5168: START
            var currCard = scope.card;
            if(currCard){
               currCard.isSelected = false;
               
               // 2018-07-18 hle71 - temporarily comment it to fix the ability to remove or edit the quotations that have just been added
               if (scope.moduleService.name !== "case" || !scope.uiFrameworkService.currentTabIndex === 2) { // hle71 - At Quotation tab
	               currCard.html = undefined;
	               currCard.scope = undefined;
               }
            }
            //IVPORTAL-5168: END
          });
          
        //prevent double click whithin 1s, this bug appear in samsung tablet, when user click 1 device detect as double clicks
          scope.isContinue = true;
          function doFreeze (){
        	  if(scope.isContinue == true){
        		  scope.isContinue = false;
        		  $timeout(function() {
                	  scope.isContinue = true; 
                  }, 1000);
        	  }
          }
            
          element.bind('click', 
            function(event) {
        	  
        	  //fix double clicks on tablet samsung android
        	  if (scope.isContinue == false){
        		  return;
        	  }
        	  
        	  doFreeze();
              $log.debug("Click on card [level: " + currCard.level + ", index: " + scope.$index + "]");

              //User Guide: there are userguide list on Card and @click Button on it, it will return (Since it will do not call other function)
              if (event.target.nodeName == "BUTTON"){
                return;
              }

              if (!currCard.isCardOpenable())
                return;
              
              if (currCard.onOpen === false) { 
            	  return; 
              }

              if(currCard.onOpen && !currCard.isSelected){
                  var isContinue = scope.$eval(currCard.onOpen);

                  switch(true){
                    case isContinue === undefined:
                       scope.isContinueOpenCard(event);
                      break;
                      //stop if return false
                      case isContinue === false:
                        return;

                      //promise case: need to wait before the onOpen functions finish
                      case isContinue.$$state !== undefined:
                          isContinue.then(function () {
                             scope.isContinueOpenCard(event);
                          });
                          break;
                      default:
                         scope.isContinueOpenCard(event);
                  }
              }
              //if doesn't have 'onOpen' attribute, continue
              else{

                  if(currCard.cardType === uiRenderPrototypeService.CONSTANTS.cardType.ACTION 
                    && currCard.onClick){
                      scope.$eval(currCard.onClick);

                      //this card has staticHtml need to render!
                      if(currCard.staticHtml)
                        scope.isContinueOpenCard(event);
                  }
                  else{
                    scope.isContinueOpenCard(event);
                  }
              }
          });           
          
          scope.isContinueOpenCard = function isContinueOpenCard (event) {     
            //set selected or not
            currCard.isSelected = !currCard.isSelected;
            scope.setSelectCss();
            
            if(!currCard.isViewed) currCard.isViewed = true;
            
            //notify other siblings 
            var siblingCards = currCard.parent ? currCard.parent.children : [];
            for (var i = 0; i < siblingCards.length; i++) {
              if(siblingCards[i] !== currCard){                 
                siblingCards[i].isSelected = false;
                siblingCards[i].scope.setSelectCss();
                
                //close all summary preview cgange card type
                //only show card preview on touch on touch device 
                if(commonService.options.cardTouchMode){
                  if(commonService.options.cardPreview){
                     if(currCard.cardStatus == "start"){
                    siblingCards[i].cardStatus = "detail";
                    siblingCards[i].scope.openSummary();
                    siblingCards[i].cardStatus = "start";
                  }
                  if(currCard.cardStatus == "detail"){
                    siblingCards[i].cardStatus = "detail";
                    siblingCards[i].scope.openSummary();
                    siblingCards[i].cardStatus = "start";
                  }
                    if(currCard.cardStatus == "summary"){
                    siblingCards[i].cardStatus = "smallDetail";
                  }
                  
                  if(currCard.cardStatus == "smallDetail"){
      
                    if(siblingCards[i].cardStatus  != "detail"){
                      siblingCards[i].cardStatus = "detail";
                      siblingCards[i].scope.openSummary();
                      siblingCards[i].cardStatus = "smallDetail";
                    }
                  }
                  if(currCard.cardStatus == "smallSummary"){
                    siblingCards[i].cardStatus = "smallDetail";
                    
                  }
                  }else{
                    siblingCards[i].cardStatus = "detail";
                    currCard.cardStatus = "detail";
                  }
                }
              }   
            };
            if(commonService.options.cardTouchMode){
              if(commonService.options.cardPreview){
                if(currCard.cardStatus == "smallSummary" ){
                  currCard.cardStatus = "summary";
                  currCard.prevSmallSummary = "detail";
                }else{
                  currCard.prevSmallSummary = undefined ;
                }
                scope.openSummary ();
              }
            }
            
            //execute the declare function
            scope.$eval(attr.whenClick, {clickEvent: event});
            if(currCard.prevSmallSummary && commonService.options.cardTouchMode)
              currCard.cardStatus = currCard.prevSmallSummary;
        }

		/**
		  * return false when can't set the css (element children can't be found, not render yet)
		  */
		scope.setSelectCss = function setSelectCss () {
			if(element.children().length < 1)
				return false;//check element has value

			var mainCard = element.children().children();
			var cardInfo = mainCard.find(".v3-live-card-info");
			var backgroundInfo = mainCard.css("background");
			if (backgroundInfo !="" && backgroundInfo != "rgba(0, 0, 0, 0)" && backgroundInfo != "white") {
				cardInfo.css("background", backgroundInfo);
			}

			// if (!currCard.isSelected) {
			// 	mainCard.attr('style', 'opacity: 0.6');
			// } else {
			// 	mainCard.attr('style', 'opacity: 1');
			// }
			return true;
		};

          /**
           * return false when can't set the css (element children can't be found, not render yet)
           */
          scope.setCssLeafCard = function setCssLeafCard () {
            if(element.children().length < 1)
              return false;
            
            var mainCard = element.children().children();

            if(scope.isLeafCard()) {
              // Remove small class
              if($(window).width() > 500){
                  scope.maxTrimTextTitle = "22";  
              } else {
                scope.maxTrimTextTitle = "20";
              }
              mainCard.removeClass( "v3-small-live-card-item" ).addClass("v3-live-card-item");
//              currCard.cardStatus = "summary";
            
            }
            else {
              // Set small card
              if($(window).width() > 500){
                scope.maxTrimTextTitle = "40";
              }
              mainCard.removeClass( "v3-live-card-item" ).addClass("v3-small-live-card-item");
              //currCard.cardStatus = "detail";
            }

            return true;
          };

          //change style of summary card base on card's status
          scope.openSummary = function openSummary () {
            if(!commonService.options.cardTouchMode){
              return;
            }
            switch(currCard.cardStatus){
              case "detail":
                element.find(".v3-live-card-info").removeClass("v3-live-card-item-hover").removeClass("v3-small-live-card-item-hover");
                //currCard.cardStatus = "detail";
                break;
              case "start"://open card review
                element.find(".v3-live-card-info").addClass("v3-live-card-item-hover");
                currCard.cardStatus = "summary";
                break;
              case "summary"://
                element.find(".v3-live-card-info").removeClass("v3-live-card-item-hover");
                element.find(".v3-live-card-info").removeClass("v3-small-live-card-item-hover");
                currCard.cardStatus = "detail";
                break;
      
              case "smallDetail":
                element.find(".v3-live-card-info").addClass("v3-small-live-card-item-hover");
                element.find(".v3-small-live-card-item").css("overflow", "visible");
                currCard.cardStatus = "smallSummary";
                break;
            }
          };
          
          scope.isLeafCard = function isLeafCard () {   
            if(uiFrameworkService.isOpenedDetail)
              return false;
            
            if(!scope.viewProp)
              return true;

            return currCard.level == scope.viewProp.viewObject.length - 1;
          }
          
          scope.refreshCard = function refreshCard(){
            var newEl = $compile(template)(scope);
            element.replaceWith(newEl);
          }
                    
          setupCard(scope, element, attr);  
          
          //when import a document, or remove a card in list
          //currCard content will be changed
          scope.$watch(
	        function () {return scope.card;},
	        //re-setup the currCard
	        function(_new, _old){setupCard(scope, element, attr);}
          );

        scope.$watch(
        	function () {return scope.isLeafCard();},
			function(_new, _old){        
			  if(_new === undefined){return;}              
			  scope.setCssLeafCard();
			}
          );                       
        }
    };
}])
///////////////////////////////////// END //////////////////////////////////////////////////////////
;