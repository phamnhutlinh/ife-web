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

//portal app config
'use strict';
var portalAppConfig = ['$stateProvider', '$urlRouterProvider', '$sceDelegateProvider', '$qProvider', '$locationProvider', '$translateProvider',
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

	$urlRouterProvider.otherwise('/login');
	$stateProvider
		.state('login', {
			url: '/login',
			controller: 'LoginCtrl'
		})
		.state('root', {
			controller: 'MyNewWorkspaceCtrl',
			templateUrl: resourceServerPath + "view/common/root_layout.html"
		})
		.state('root.list', {
			views: {
				'navbar-view':{
					controller: 'NavigationCtrl',
					templateUrl: resourceServerPath + 'view/common/navigation.html'
				},
				'sidebar-view':{
					controller: 'SidebarCtrl',
					templateUrl: resourceServerPath + 'view/common/sidebar.html'
				},
				'footer': {
					templateUrl: resourceServerPath + 'view/common/footer.html'
				}
			}
		})
		.state('root.list.case-introduce', {
			url: '/case-introduce/:productName',
			views: {
				 'main-view@root': {
						templateUrl: function($stateParams){
							var htmlName = 'case_introducion_' + $stateParams.productName + '.html';
							var htmlUrl = resourceServerPath + "view/workspaces/partial/uiElements/" + htmlName;
							console.log('Using ' + htmlUrl);
							return htmlUrl;
						},
						controller: 'CaseIntroductionCtrl'
					}
			},
			params: {
				productName : undefined,
				isShowNavBar: true,
				dashboardName: undefined,
			}
		})
		.state('root.list.quotationst-introduce', {
			url: '/quotationst-introduce/:productName',
			views: {
				 'main-view@root': {
						templateUrl: function($stateParams){
							var htmlName = undefined;
							if($stateParams.productName === 'LIFE_RUL') {
								htmlName = 'quotationst_introducion_life_rul.html';
							}
							if($stateParams.productName === 'LIFE_BNI') {
								htmlName = 'quotationst_introducion_life_bni.html';
							}
							var htmlUrl = resourceServerPath + "view/workspaces/partial/uiElements/" + htmlName;
							console.log('Using ' + htmlUrl);
							return htmlUrl;
						},
						controller: 'QuotationStIntroductionCtrl'
					}
			},
			params: {
				productName : undefined,
				isShowNavBar: true,
				dashboardName: undefined,
			}
		})
		.state('root.list.listView', {
			url: '/list/:link',
			views: {
				 'main-view@root': {
						templateUrl: function($stateParams){
							var htmlUrl = 'view/dashboards/' + $stateParams.link + '/dashboard.html';
							localStorage.setItem('currentState',$stateParams.link);
							htmlUrl = resourceServerPath +  htmlUrl;
							console.log('Using ' + htmlUrl);
							return htmlUrl;
						},
						controller: 'ListViewCtrl'
					}
			},
			params: {
				isShowNavBar: true,
				link: ''
			},
			resolve : {
				'acl' : ['$q', 'AclService', '$stateParams', function($q, AclService, $stateParams) {
					var result = undefined;
					if (!AclService.can('dashboard_' + $stateParams.link)) {
						result = $q.reject('access_denied');
					} else {
						result = true;
					}
					return result;
				}]
			}
		})
		.state('root.list.basicquote', {
			url: '/basic-quote/:link',
			views: {
				 'main-view@root': {
						templateUrl: function($stateParams){
							var htmlName = 'basicquote.html'
							var htmlUrl = resourceServerPath + "view/workspaces/partial/uiElements/" + htmlName;
							console.log('Using ' + htmlUrl);
							return htmlUrl;
						},
						controller: 'BasicQuoteCtrl'
					}
			},
			params: {
				isShowNavBar: true,
				link: ''
			},
			resolve : {
				'acl' : ['$q', 'AclService', '$stateParams', function($q, AclService, $stateParams) {
					var result = undefined;
					if (!AclService.can('dashboard_' + $stateParams.link)) {
						result = $q.reject('access_denied');
					} else {
						result = true;
					}
					return result;
				}]
			}
		})
		.state('root.list.detail', {
			url: "/detail/:docType?:businessType&:productName&:type&:docId&:ctrlName&:userRole&:quotationStandalone&:lineOfBusiness&:currFromDate",
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
						$stateParams.businessType != 'corporate'?localStorage.setItem('currentState', $stateParams.docType + '-detail'):localStorage.setItem('currentState', $stateParams.businessType + '-detail');
						
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
				isShowNavBar: true,
				quotationStandalone: undefined,
				type: '',
				lineOfBusiness:'',
				currFromDate:''
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
		.state('root.list.policydetail', {
			url: "/detail/:docType?:businessType&:id&:policyId&:productName&:type&:docId&:ctrlName&:userRole&:quotationStandalone&:lineOfBusiness&:currFromDate&:isDeclaration",
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
						$stateParams.businessType != 'corporate'?localStorage.setItem('currentState', $stateParams.docType + '-detail'):localStorage.setItem('currentState', $stateParams.businessType + '-detail');
						
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
				isShowNavBar: true,
				quotationStandalone: undefined,
				type: '',
				lineOfBusiness:'',
				currFromDate:'',
				isDeclaration:''
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
		.state('root.list.payment', {
			url: '/:link',
			views: {
				'main-view@root': {
					templateUrl: resourceServerPath + 'view/workspaces/detail.html',
					controllerProvider: ['$stateParams', function() {												
						return 'TransactionDetailCtrl';
					}]
				}
			},
			params: {
				isShowNavBar: true,
				link: '',
				docType: 'agent_payment'
			},
			resolve : {
				'acl' : ['$q', 'AclService', '$stateParams', function($q, AclService, $stateParams) {
					var result = undefined;
					if (!AclService.can('dashboard_' + $stateParams.link)) {
						result = $q.reject('access_denied');
					} else {
						result = true;
					}
					return result;
				}]
			}
		})
		.state('root.list.direct', {
			url: '/:link',
			views: {
				'main-view@root': {
					templateUrl: resourceServerPath + 'view/workspaces/detail.html',
					controllerProvider: ['$stateParams', function() {												
						return 'TransactionDetailCtrl';
					}]
				}
			},
			params: {
				isShowNavBar: true,
				link: '',
				docType: 'direct'
			},
			resolve : {
				'acl' : ['$q', 'AclService', '$stateParams', function($q, AclService, $stateParams) {
					var result = undefined;
					if (!AclService.can('dashboard_' + $stateParams.link)) {
						result = $q.reject('access_denied');
					} else {
						result = true;
					}
					return result;
				}]
			}
		})
		.state('root.list.message', {
			url: "/message/:messageName",
			views: {
				'main-view@root': {
					templateUrl: function($stateParams) {
						return resourceServerPath + 'view/common/' + $stateParams.messageName + '.html';
					}
				}
			},
			params: {
				isShowNavBar: false
			}
		})
		.state('root.list.profile', {
			url: "/profile",
			views: {
				'main-view@root': {
					templateUrl: function($stateParams) {				
						return resourceServerPath + 'view/common/profile.html';
					},
					controllerProvider: ['$stateParams', function($stateParams) {
						var ctrlName = "ProfileCtrl";						
						return ctrlName;
					}]
				}
			},
			params: {
				isShowNavBar: true
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
		})
		.state("esign", {
			url: "/esign/:caseId/:pdfId",
			controller: "EsignCtrl"
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
		prefix = prefix+ '-' +businessType;
//	if(productName == 'MT2')
//		prefix = prefix+ '-' +productName;
	prefix = prefix.split('-').map(
		function(text) {
			return text.capitalizeFirstLetter();
		}
	).join('');


	var ctrlName = prefix + ctrlType.capitalizeFirstLetter() + "Ctrl";
	return ctrlName;
}
