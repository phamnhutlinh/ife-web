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

//landing app config
var directAppConfig = ['$stateProvider', '$urlRouterProvider', '$sceDelegateProvider', '$qProvider', '$locationProvider', '$translateProvider',
	function($stateProvider, $urlRouterProvider, $sceDelegateProvider, $qProvider, $locationProvider, $translateProvider) {
	
	$sceDelegateProvider.resourceUrlWhitelist([
		'self', // Allow same origin resource loads.   
		resourceServerPath + '**' // Allow loading from outer templates domain.
	]);

	//Remove unnecessary error logs
	$qProvider.errorOnUnhandledRejections(false);

	//Remove '!' symbol
	$locationProvider.hashPrefix('');

	// Enable sanitize of HTML in angular translate
	$translateProvider.useSanitizeValueStrategy('sanitizeParameters');
	
	$urlRouterProvider.otherwise('/home');
	$stateProvider
		.state('login', {
			url: '/login?initRequest',
			controller: 'DirectLoginCtrl',
			params: {
				initRequest: 'false'
			}
		})
		.state('root', {
			controller: 'MyNewWorkspaceCtrl',
			templateUrl: resourceServerPath  + "view/common/root_layout.html"
		})
		.state('root.list', {
			views: {
				'navbar-view': {
					controller: 'NavigationCtrl',
					templateUrl: resourceServerPath + 'view/common/navigation.html'
				},
				'footer': {
					templateUrl: resourceServerPath + 'view/common/footer.html'
				}
			}
		})
		.state('root.list.home', {
			url: '/home',
			views: {
				'main-view@root': {
					controller: 'DirectHomeCtrl as ctrl',
					templateUrl: resourceServerPath + 'view/common/homeDirect.html'
				}
			},
			params: {
				isShowNavBar: true
			}
		})
		.state('root.list.registration', {
			url: '/registration',
			views: {
				'main-view@root': {
					controller: 'RegistrationCtrl',
					templateUrl: resourceServerPath + 'view/common/registration.html'
				}
			}
		})
		.state('root.list.message', {
			url: '/message/:messageName',
			views: {
				'main-view@root': {
					templateUrl: function($stateParams) {
						return resourceServerPath + 'view/common/' + $stateParams.messageName + '.html';
					}
				}
			}
		})
		.state('root.list.requestResetPwd', {
			url: '/requestResetPwd',
			views: {
				'main-view@root': {
					controller: 'ResetPwdCtrl',
					templateUrl: resourceServerPath + 'view/common/resetpwd_username.html'
				}
			}
		})
		.state('root.list.submitResetPwd', {
			url: '/submitResetPwd',
			views: {
				'main-view@root': {
					controller: 'ResetPwdCtrl',
					templateUrl: resourceServerPath + 'view/common/resetpwd_newpwd.html'
				}
			}
		})
		.state('root.list.detail', {
			url: "/detail/:docType?:businessType&:productName&:docId&:ctrlName",
			views: {
				'main-view@root': {
					templateUrl: resourceServerPath + 'view/workspaces/detail.html',
					controllerProvider: ['$stateParams', function($stateParams) {
						var ctrlName = undefined;
						if ($stateParams.ctrlName) {
							ctrlName = $stateParams.ctrlName;
						} else {
							ctrlName = genCtrlName('detail', $stateParams.docType, $stateParams.productName, $stateParams.businessType);
						}
						return ctrlName;
					}]
				}
			},
			reloadOnSearch : false,
			params: {// default value if params are unavailable
				docType: '',
				ctrlName: '',//specific ctrl want to call
				htmlUrl: '',//specific html want to show
				docId: '',
				productName: '',
				businessType: '',//business transaction (new-business, renewal,..)
				userRole: '',//user role (agent, UW,..)
				userName: '',
				saleChannel: '',//sale channel (direct_sale, agent_sale,...)
				hasDetail: false,
				isShowNavBar: true
			},
			resolve : {
				'acl' : ['$q', 'AclService', '$stateParams', function($q, AclService, $stateParams) {
					var result = undefined;
					//TODO define complex permission matrix
					if (false /*!AclService.can('view_content')*/) {
						result = $q.reject('access_denied');
					} else {
						result = true;
					}
					return result;
				}]
			}
		})
		.state('root.list.infor', {
			url: "/infor/:param1/:param2",
			views: {
				'main-view@root': {
					templateUrl: function($stateParams) {				
						return resourceServerPath + 'view/inforpage/' + $stateParams.param1 + '/' + $stateParams.param2 + '/detail.html';
					},
					controllerProvider: ['$stateParams', function($stateParams) {
						var ctrlName = "InforDetailCtrl";						
						return ctrlName;
					}]
				}
			}				
		});
}];

/**
 * Return AngularJS Controller's name for binding
 * @param  {String} ctrlType	   list, overview, detail
 * @param  {String} moduleName prospect, illustration,...
 * @param  {String} productName	 motor-m-ds, motor-m-as
 * @param  {String} businessType	renewal
 * @return {String}				 ProspectOverviewCtrl,...
 */
function genCtrlName(ctrlType, docType, productName, businessType) {
	var prefix = docType;

	if(businessType && businessType !== "NewBusiness" )
		prefix = businessType;

	prefix = prefix.split('-').map(
		function(text) {
			return text.capitalizeFirstLetter();
		}
	).join('');


	var ctrlName = prefix + ctrlType.capitalizeFirstLetter() + "Ctrl";
	console.log("Using ctrl: " + ctrlName);
	return ctrlName;
}
