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
var InforDetailCtrl = ['$scope', '$state', '$log', 'commonService', 'commonUIService',
	function($scope, $state, $log, commonService, commonUIService) {

	this.$onInit = function() {
		$scope.products = [{
            title: 'MotorInsurance',
            text: 'Motor Insurance'
        }, {
            title: 'HouseHolderAndHouseOwnerInsurance',
            text: 'HouseHolder\'s Insurance'
        }, {
            title: 'Limited10PayRewardsSaver',
            text: 'Limited 10Pay Rewards Saver'
        }, {
            title: 'TermLifeProtect',
            text: 'TermLife Protect'
        }];
        $scope.selectedIndex = 0;
        $scope.selectedProduct = $scope.products[0];
        $scope.isEnquiryProduct = false;
        $scope.selectProduct = function(product) {
            $scope.isEnquiryProduct = false;
            $scope.selectedProduct = product;
            $scope.selectedIndex = $scope.products
                .indexOf(product);
        };
        
        var getParameterByName = function(name) {
            name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                results = regex.exec(location.search);
            return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
        };
        var productTitle = getParameterByName('productTitle');
         //$('#myTab a[href="#' + productTitle + '"]').tab('show');

         $(document).ready(function() {
            $('#custom-tab a[href="#' + productTitle + '"]').tab('show');
            for (var i = 0; i < $scope.products.length; i++) {
                if ($scope.products[i].title === productTitle) {
                    $scope.selectProduct($scope.products[i]);
                };
            };
         });

        if (productTitle != "") {
            for (var i = 0; i < $scope.products.length; i++) {
                if ($scope.products[i].title === productTitle) {
                    $scope.selectProduct($scope.products[i]);
                    console.log($scope.products[i]);
                };
            };
        }
        $scope.enquiryProduct = function(selectedProduct) {  
        	$scope.firstLoad = true;
            $scope.selectedIndex = -1;
            $scope.isEnquiryProduct = true;
        };
        $scope.getAnInstantQuote = function(quoteType) {
            var newURL = urlService.urlMap.CREATE_QUOTE + "?quoteType=" + quoteType;
            window.open(newURL, '_self');
        };
        $scope.enquiryInfo = {
            name: '',
            email: '',
            cNo: '',
            productForEnquiries: '',
            detail: ''
        };
        $scope.firstLoad = true;
        $scope.submit = function() {
            $scope.firstLoad = false;
        };
        $scope.checkValidEmail = function(data) {
            var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(data);
        };
        $scope.reset = function() {
            $scope.firstLoad = true;
            $scope.enquiryInfo.name = '';
            $scope.enquiryInfo.email = '';
            $scope.enquiryInfo.cNo = '';
            $scope.enquiryInfo.detail = '';
        };
	};
	
	
}];