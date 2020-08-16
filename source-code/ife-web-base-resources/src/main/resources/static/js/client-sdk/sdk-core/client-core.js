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
var clientModule = angular.module('clientModule', ['coreModule', 'commonUIModule'])
.service('clientCoreService', ['$q', 'ajax', '$location', 'appService', 'cacheService', 'commonUIService', 'detailCoreService', 'commonService', 'connectService','loadingBarService',
    function($q, ajax, $location, appService, cacheService, commonUIService, detailCoreService, commonService, connectService,loadingBarService){
	
	function ClientCoreService($q, ajax, $location, appService, cacheService, detailCoreService, commonService, connectService){
		var self = this;
		self.detailCoreService = detailCoreService;
		detailCoreService.ListDetailCoreService.call(self, $q, ajax, $location, appService, cacheService, commonService);
		self.name = commonService.CONSTANTS.MODULE_NAME.CLIENT;
		self.actionBar = commonService.CONSTANTS.MODULE_NAME.CLIENT;
	}
	
	inherit(detailCoreService.ListDetailCoreService, ClientCoreService);
	extend(commonUIService.constructor, ClientCoreService);
	
	ClientCoreService.prototype.getClientDetail= function (clientId) {
    	var self = this;
		var deferred = this.$q.defer();
		loadingBarService.showLoadingBar();
		connectService.exeAction({
			actionName: "SEARCH_CLIENTDETAIL",
            actionParams: {clientId:clientId}
            
		}).then(function (data) {
			deferred.resolve(data);
			loadingBarService.hideLoadingBar();
        });
		return deferred.promise;
	}; 

	return new ClientCoreService($q, ajax, $location, appService, cacheService, detailCoreService, commonService, connectService);
}]);
