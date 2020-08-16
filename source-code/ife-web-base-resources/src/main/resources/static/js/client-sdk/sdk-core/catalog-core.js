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
var catalogModule = angular.module('catalogModule', ['coreModule', 'commonUIModule'])
.service('catalogCoreService', ['$q', '$location', 'appService', 'cacheService', 'commonUIService', 'detailCoreService', 'commonService', 'connectService', '$log',
	function($q, $location, appService, cacheService, commonUIService, detailCoreService, commonService, connectService, $log){
	
	function CatalogCoreService($q, $location, appService, cacheService, detailCoreService, commonService, connectService){
		var self = this;
		self.detailCoreService = detailCoreService;
		detailCoreService.ListDetailCoreService.call(self, $q, $location, appService, cacheService, commonService);
		self.name = commonService.CONSTANTS.MODULE_NAME.CATALOG;
		self.actionBar = commonService.CONSTANTS.MODULE_NAME.CATALOG;
	}
	
	inherit(detailCoreService.ListDetailCoreService, CatalogCoreService);
	extend(commonUIService.constructor, CatalogCoreService);	
	
	return new CatalogCoreService($q, $location, appService, cacheService, detailCoreService, commonService, connectService);
}]);
