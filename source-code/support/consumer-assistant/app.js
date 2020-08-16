//Import Node Module
var Q = require('q');
var resource = require('resource');
var isObject = require('isobject');
var extend = require('node.extend');
var forEach = require('foreach');
var request = require('request-promise');
var fs = require('fs');
var http = require('http');

var optionsProxy = {
    hostname: 'localhost',
    path: '',
    port: '2408'
};

var str = '';
var header_tmp = {};
var linkMap = {};
var finalResult = {};

/**
* Default configuration for spring data rest defaults
*/
var config = {
	'linksKey': '_links',
	'linksHrefKey': 'href',
	'linksSelfLinkName': 'self',
	'embeddedKey': '_embedded',
	'embeddedNewKey': '_embeddedItems',
	'embeddedNamedResources': false,
	'resourcesKey': '_resources',
	'resourcesFunction': undefined,
	'fetchFunction': undefined,
	'fetchAllKey': '_allLinks'
};

function addCorsHeaders(req, res) {   
    res.setHeader('Access-Control-Allow-Origin', '*');
    if (req.headers['access-control-request-method']) {
        res.setHeader('Access-Control-Allow-Methods', req.headers['access-control-request-method']);
        requestMethod = req.headers['access-control-request-method'];
    }
    if (req.headers['access-control-request-headers']) {
        res.setHeader('Access-Control-Allow-Headers', req.headers['access-control-request-headers']);
    }
}

function response(req, res, responseDoc) {
    console.log("REQUEST DATE: " +Date());
    console.log("MOCK REQUEST START-----------------------------------");
    console.log("Request URL: " + req.url);
    console.log("Request Method: " + req.method);
    var objec = responseDoc;
    try {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.write(JSON.stringify(objec), 'binary');
    }
    catch (err){
        console.log(err);
    }
    console.log("MOCK REQUEST END-----------------------------------");
    res.end();
}
	
function moveArray(object, sourceKey, destinationKey, useSameObject) {
    var embeddedObject = object[sourceKey];
    if (embeddedObject) {
        var processedData = {};
        processedData[destinationKey] = {};

        if (useSameObject === true) {
            // loop over all items in the embedded object and add them to the processed data
            forEach(Object.keys(embeddedObject), function (key) {
                processedData[destinationKey][key] = embeddedObject[key];
            });
        } else {
            // remove the key and replace it with the value of it
            var key = Object.keys(embeddedObject)[0];
            processedData[destinationKey] = embeddedObject[key];
        }

        object = extend(object, processedData);
        delete object[sourceKey];
    }
    return object;
}

function extractUrl(url, templated) {
    if (templated) {
        url = removeTemplateParameters(url)
    }
    return url;
}

function checkUrl(url, resourceName, hrefKey) {
    if (url == undefined || !url) {
        throw new Error("The provided resource name '" + resourceName + "' has no valid URL in the '" +
        hrefKey + "' property.");
    }
    return url
}

function removeTemplateParameters(url) {
    return url.replace(/{.*}/g, '');
}

function extractTemplateParameters(url) {
    var templateParametersObject = {};

    var regexp = /{\?(.*)}/g;
    var templateParametersArray = regexp.exec(url)[1].split(',');

    forEach(templateParametersArray, function (value) {
        templateParametersObject[value] = "";
    });

    return templateParametersObject;
}	
	
function deepExtend(destination) {
    forEach(arguments, function (obj) {
        if (obj !== destination) {
            forEach(obj, function (value, key) {
                if (destination[key] && destination[key].constructor && destination[key].constructor === Object) {
                    deepExtend(destination[key], value);
                } else {
                    destination[key] = value;
                }
            });
        }
    });
    return destination;
}

function resourcesFunction(url, paramDefaults, actions, options) {
	if (config.resourcesFunction == undefined) {
		return resource(url, paramDefaults, actions, options);
	} else {
		return config.resourcesFunction(url, paramDefaults, actions, options);
	}
}

function fetchFunction(url, key, data, fetchLinkNames, recursive) {	
	var url = url.replace("localhost", "localhost"); //for test only
	if (config.fetchFunction == undefined) {
		var promisesArray = [];
		var options = {  
		  method: 'GET',
		  uri: url,
		  headers: header_tmp
		}
		promisesArray.push(request(options)
			.then(function (responseData1) {

				// wrap the response again with the adapter and return the promise
				var responseData = {};
				if (!isObject(responseData1)) {
					responseData.data = JSON.parse(responseData1);
				} else 
					responseData.data = responseData1;
				
				
				if (recursive) {
					return processData(responseData.data, fetchLinkNames, true).then(function (processedData) {
						data[key] = processedData;
					});
				} else {
					return processData(responseData.data).then(function (processedData) {
						data[key] = processedData;
					});
				}
			}, function (error) {
				if (error.status != 404) {
					// just reject the error if its not a 404 as there are links which return a 404 which are not set
					return Q.reject(error);
				}
			}));

		// wait for all promises to be resolved and return a new promise
		return Q.all(promisesArray);
	} else {
		return config.fetchFunction(url, key, data, fetchLinkNames, recursive);
	}
}

function saveFile(docType, filename, data){
    console.log("Save File");
    fs.writeFile("mock_saved_data/test.json", data, function(err) {
            if(err) {
                return console.log(err);
            }        
        }); 
}

var processData = function processDataFunction(promiseOrData, fetchLinkNames, recursive) {

	// convert the given promise or data to a $q promise
	return Q.when(promiseOrData).then(function (tmp) {
		
		if (!isObject(tmp)) {
			var data = JSON.parse(tmp);
		} else 
			data = tmp;		
		var resources = function (resourceObject, paramDefaults, actions, options) {
			var resources = this[config.linksKey];
			var parameters = paramDefaults;

			var urlTemplates = "";

			// split the resourceObject to extract the URL templates for the $resource method
			if (hasUrlTemplate(resourceObject)) {
				var extractedUrlTemplates = extractUrlTemplates(resourceObject);
				resourceObject = extractedUrlTemplates[0];
				urlTemplates = extractedUrlTemplates[1];
			}

			// if a resource object is given process it
			if (isObject(resourceObject)) {
				if (!resourceObject.name) {
					throw new Error("The provided resource object must contain a name property.");
				}

				var resourceObjectParameters = resourceObject.parameters;

				// if the default parameters and the resource object parameters are objects, then merge these two objects
				// if not use the objects themselves as parameters
				if (paramDefaults && isObject(paramDefaults)) {
					if (resourceObjectParameters && isObject(resourceObjectParameters)) {
						parameters = extend(paramDefaults, resourceObjectParameters);
					} else {
						parameters = paramDefaults;
					}
				} else {
					if (resourceObjectParameters && isObject(resourceObjectParameters)) {
						parameters = resourceObjectParameters;
					}
				}

				// remove parameters which have an empty string as value
				forEach(parameters, function (value, key) {
					if (value === "") {
						delete parameters[key];
					}
				});

				// process the url and call the resources function with the given parameters
				return resourcesFunction(getProcessedUrl(data, resourceObject.name), parameters, actions, options);
			} else if (resourceObject in resources) {

				// process the url, add the url templates and call the resources function with the given parameters
				return resourcesFunction(getProcessedUrl(data, resourceObject) + urlTemplates, parameters, actions, options);
			}

			// return the available resources as resource object array if the resource object parameter is not set
			var availableResources = [];
			forEach(resources, function (value, key) {

				// if the URL is templated add the available template parameters to the returned object
				if (value.templated) {
					var templateParameters = extractTemplateParameters(value[config.linksHrefKey]);
					availableResources.push({"name": key, "parameters": templateParameters});
				} else {
					availableResources.push({"name": key});
				}
			});
			return availableResources;
		};

		// if the given data object has a data property use this for the further processing as the
		// standard httpPromises from the $http functions store the response data in a data property
		if (data && data.data) {
			data = data.data;
		}

		// throw an exception if given data parameter is not of type object
		if (!isObject(data) || data instanceof Array) {
			return Q.reject("Given data '" + data + "' is not of type object.");
		}

		// throw an exception if given fetch links parameter is not of type array or string
		if (fetchLinkNames && !(fetchLinkNames instanceof Array || typeof fetchLinkNames === "string")) {
			return Q.reject("Given fetch links '" + fetchLinkNames + "' is not of type array or string.");
		}

		var processedData = undefined;
		var promisesArray = [];

		// only add the resource method to the object if the links key is present
		if (config.linksKey in data) {

			// add Angular resources property to object
			var resourcesObject = {};
			resourcesObject[config.resourcesKey] = resources;
			processedData = extend(data, resourcesObject);

			// if there are links to fetch, then process and fetch them
			if (fetchLinkNames != undefined) {
				var self = data[config.linksKey][config.linksSelfLinkName][config.linksHrefKey];

				// add the self link value as key and add an empty map to store all other links which are fetched for this entity
				if (!linkMap[self]) {
					linkMap[self] = [];
				}

				// process all links
				forEach(data[config.linksKey], function (linkValue, linkName) {

					// if the link name is not 'self' then process the link name
					if (linkName != config.linksSelfLinkName) {

						// check if:
						// 1. the link was not fetched already
						// 2. the all link names key is given then fetch the link
						// 3. the given key is equal
						// 4. the given key is inside the array
						if (linkMap[self].indexOf(linkName) < 0 &&
							(fetchLinkNames == config.fetchAllKey ||
							(typeof fetchLinkNames === "string" && linkName == fetchLinkNames) ||
							(fetchLinkNames instanceof Array && fetchLinkNames.indexOf(linkName) >= 0))) {
							promisesArray.push(fetchFunction(getProcessedUrl(data, linkName), linkName,
								processedData, fetchLinkNames, recursive));
							linkMap[self].push(linkName);
						}
					}
				});
			}
		}

		// only move the embedded values to a top level property if the embedded key is present
		if (config.embeddedKey in data) {

			// make a defensive copy if the processedData variable is undefined
			if (!processedData) {
				processedData = data;
			}

			// process the embedded key and move it to an embedded value key
			processedData = moveArray(processedData, config.embeddedKey, config.embeddedNewKey, config.embeddedNamedResources);

			// recursively process all contained objects in the embedded value array
			forEach(processedData[config.embeddedNewKey], function (value, key) {

				// if the embeddedResourceName config variable is set to true, process each resource name array
				if (value instanceof Array && value.length > 0) {
					var processedDataArray = [];
					var processedDataArrayPromise;
					forEach(value, function (arrayValue, arrayKey) {
						if (isObject(arrayValue)) {
							processedDataArrayPromise = processDataFunction({data: arrayValue}, fetchLinkNames, recursive).then(function (processedResponseData) {
								processedDataArray[arrayKey] = processedResponseData;
							});
							promisesArray.push(processedDataArrayPromise);
						} else {
							processedDataArray[arrayKey] = arrayValue;
						}
					});

					// after the last data array promise has been resolved add the result to the processed data
					if (processedDataArrayPromise) {
						processedDataArrayPromise.then(function () {
							processedData[config.embeddedNewKey][key] = processedDataArray;
						})
					}
				} else if (isObject(value)) {
					// single objects are processed directly
					promisesArray.push(processDataFunction({data: value}, fetchLinkNames, recursive).then(function (processedResponseData) {
						processedData[config.embeddedNewKey][key] = processedResponseData;
					}));
				}
			});
		}

		return Q.all(promisesArray).then(function () {

			// return the original data object if no processing is done			
			return processedData ? processedData : data;
		});
	});

	/**
	 * Gets the processed URL of the given resource name form the given data object.
	 * @param {object} data the given data object
	 * @param {string} resourceName the resource name from which the URL is retrieved
	 * @returns {string} the processed url
	 */
	function getProcessedUrl(data, resourceName) {
		// get the raw URL out of the resource name and check if it is valid
		var rawUrl = checkUrl(data[config.linksKey][resourceName][config.linksHrefKey], resourceName,
			config.linksHrefKey);

		// extract the template parameters of the raw URL
		return extractUrl(rawUrl, data[config.linksKey][resourceName].templated);
	}

	/**
	 * Returns true if the resource name has URL templates
	 * @param resourceName the resource name to parse
	 * @returns {boolean} true if the resource name has URL templates, false otherwise
	 */
	function hasUrlTemplate(resourceName) {
		return typeof resourceName == "string" && resourceName.indexOf("/") > 0;
	}

	/**
	 * Extracts the URL template and returns the resource name and the URL templates as an array.
	 * @param resourceName the resource name to parse
	 * @returns {[]} the first element is the raw resource name and the second is the extracted URL templates
	 */
	function extractUrlTemplates(resourceName) {
		if (hasUrlTemplate(resourceName)) {
			var indexOfSlash = resourceName.indexOf("/");
			return [resourceName.substr(0, indexOfSlash), resourceName.substr(indexOfSlash, resourceName.length)];
		}
	}
};

var server = http.createServer(function(req, res) {
    addCorsHeaders(req, res);
    console.log("REQUEST START-----------------------------------");
	console.log(req.url);
    function callAPI(req, res){
		//var url = 'http://' + optionsProxy.hostname + ':' + optionsProxy.port + req.url;
		var url = 'http://localhost:2407/gateway/runtime/fna-standards'; //for test
		console.log(url);
		header_tmp = req.headers;
        var option = {
			  uri: url,	
			  method: req.method,
			  headers: req.headers
		}			
		linkMap = {};	
		var proxy_req = request(option);		
		/**
		* https://github.com/guylabs/angular-spring-data-rest
		*/
		processData(proxy_req, '_allLinks').then(function(data){
			//console.log(data);			
			//saveFile("","",JSON.stringify(data));
			response(req, res, data);			
		}).catch(function (err) {			
			response(req, res, data);
		});		
        return;
    }
	callAPI(req, res);
    return;
	
}).listen({
        host: 'localhost',
        port: '2409'
    },
    () => {
        address = server.address();
        console.log('opened server on %j', address);
    });

