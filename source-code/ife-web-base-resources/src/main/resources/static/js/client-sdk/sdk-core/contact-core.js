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
var contactModule = angular.module('contactModule', ['coreModule', 'commonUIModule'])
.service('contactCoreService', ['$q', 'ajax', '$location', 'appService', 'cacheService', 'commonUIService', 'detailCoreService', 'commonService', 'connectService',
    function($q, ajax, $location, appService, cacheService, commonUIService, detailCoreService, commonService, connectService){
	
	function ContactCoreService($q, ajax, $location, appService, cacheService, detailCoreService, commonService, connectService){
		var self = this;
		self.detailCoreService = detailCoreService;
		detailCoreService.ListDetailCoreService.call(self, $q, ajax, $location, appService, cacheService, commonService);
		self.name = commonService.CONSTANTS.MODULE_NAME.CONTACT;
		self.actionBar = commonService.CONSTANTS.MODULE_NAME.CONTACT;
	}
	
	inherit(detailCoreService.ListDetailCoreService, ContactCoreService);
	extend(commonUIService.constructor, ContactCoreService);
	
	/**
	 * Request server auth token and roles info
	 * Apr-23-2017
	 * @author  ttan40
	 * @return {Object} data Angular Promise, include username, token, roles info if success
	 */
	ContactCoreService.prototype.callOneMapAPI = function(postalCode, country)  {
		var self = this;
		var deferred = self.$q.defer();
		var requestURL = self.initialRequestURL("ONEMAP_API", [postalCode , country]);
		connectService.exeAction({
			actionName: '',
			actionParams: [],
			requestURL: requestURL
		}).then(function(data) {
			deferred.resolve(data);
		});
		return deferred.promise;
	};
	
	return new ContactCoreService($q, ajax, $location, appService, cacheService, detailCoreService, commonService, connectService);
}]);
