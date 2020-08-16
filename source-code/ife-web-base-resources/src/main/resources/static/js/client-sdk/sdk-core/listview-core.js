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
var listviewModule = angular.module('listviewModule', ['coreModule', 'commonUIModule'])
.service('listviewCoreService', ['$q', 'ajax', '$location', 'appService', 'cacheService', 'detailCoreService', 'commonService', 'connectService', 'commonUIService', '$log', 
	function($q, ajax, $location, appService, cacheService, detailCoreService, commonService, connectService, commonUIService, $log){

	function ListViewCoreService($q, ajax, $location, appService, cacheService, detailCoreService, commonService, connectService){
		var self = this;
		self.detailCoreService = detailCoreService;
		detailCoreService.ListDetailCoreService.call(self, $q, ajax, $location, appService, cacheService, commonService);
		self.name = commonService.CONSTANTS.MODULE_NAME.SALECASE;
	}
	
	inherit(detailCoreService.ListDetailCoreService, ListViewCoreService);
	extend(commonUIService.constructor, ListViewCoreService);
	
	/*
	 * get System Date
	 */
	ListViewCoreService.prototype.getSystemDate = function(requestURL) {
		var self = this;
		var deferred = self.$q.defer();
		var actionName = 'GET_SYSTEM_DATE';
		var actionParams = [
			self.name + 's'
		];
		connectService.exeAction({
			actionName: actionName,
			actionParams: actionParams,
			requestURL: requestURL
		}).then(function(data) {
			deferred.resolve(data.time);
		});
		return deferred.promise;
	};
	return new ListViewCoreService($q, ajax, $location, appService, cacheService, detailCoreService, commonService, connectService);
}]);
