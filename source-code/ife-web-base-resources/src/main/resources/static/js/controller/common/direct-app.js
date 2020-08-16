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
var directApp = angular.module('directApp', [
	'mm.acl', 'ui.select2', 'ngRoute', 'ui.router', 'ui.bootstrap', 'filterUIModule', 'coreModule',
	'commonUIModule', 'directiveUIModule', 'ngMaterial', 'urlModule', 'angularFileUpload',
	'translateUIModule', 'uiRenderPrototypeModule', 'accountModule',
	'salecaseModule','ngSanitize', 'ngResource', 'ngIdle'
]);

directApp.controller('NavigationCtrl', NavigationCtrl);
directApp.controller('DirectHomeCtrl', DirectHomeCtrl);
directApp.controller('RegistrationCtrl', RegistrationCtrl);
directApp.controller('ResetPwdCtrl', ResetPwdCtrl);
directApp.controller('LandingLoginCtrl', LandingLoginCtrl);
directApp.controller('DirectLoginCtrl', DirectLoginCtrl);

directApp.controller('MyNewWorkspaceCtrl', MyNewWorkspaceCtrl);
directApp.controller('AccountDetailCtrl', AccountDetailCtrl);
directApp.controller('InforDetailCtrl', InforDetailCtrl);

directApp.controller('CaseLifeDetailCtrl', CaseLifeDetailCtrl);

directApp.config(directAppConfig);
directApp.run(['$rootScope', '$state', 'commonUIService', 'AclService', function($rootScope, $state, commonUIService, AclService) {
	commonUIService.setupAclForLanding(AclService);
}]);
