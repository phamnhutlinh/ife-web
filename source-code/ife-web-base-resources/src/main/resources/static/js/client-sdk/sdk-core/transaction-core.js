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
var transactionModule = angular.module('transactionModule', ['coreModule', 'commonUIModule'])
.service('transactionCoreService', ['$q', '$location', 'appService', 'cacheService', 'commonUIService', 'detailCoreService', 'commonService', 'connectService', '$log',
	function($q, $location, appService, cacheService, commonUIService, detailCoreService, commonService, connectService, $log){
	
	function TransactionCoreService($q, $location, appService, cacheService, detailCoreService, commonService, connectService){
		var self = this;
		self.detailCoreService = detailCoreService;
		detailCoreService.ListDetailCoreService.call(self, $q, $location, appService, cacheService, commonService);
		self.name = commonService.CONSTANTS.MODULE_NAME.TRANSACTION;
		self.actionBar = commonService.CONSTANTS.MODULE_NAME.TRANSACTION;
	}
	
	inherit(detailCoreService.ListDetailCoreService, TransactionCoreService);
	extend(commonUIService.constructor, TransactionCoreService);
	
	/**
	 * Request server auth token and roles info
	 * Apr-23-2017
	 * @author  ttan40
	 * @return {Object} data Angular Promise, include username, token, roles info if success
	 */
	TransactionCoreService.prototype.submit = function(dataSet) {		
		return connectService.exeAction({
			actionName: "DOCUMENT_ACTION",
			actionParams: {
                docType: ConstantConfig.MODULE_NAME.SALECASE + "s",                
                action: "submit"
			},
			data: dataSet,
			method: "POST"			
		});
	};
	
	return new TransactionCoreService($q, $location, appService, cacheService, detailCoreService, commonService, connectService);
}]);
