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
var UrlConfig = {
	privateAPI: {
		"GET_SIGNED_DOCUMENTS": {
			"baseUrl": "attachments?q=moduleId={0}&attachmentType={1}&isSigned=true",
			"params": [
				"caseId",
				"docType"
			]
		},
		 "SIGN_RESULT_DOCUMENT_V4": {
		    "baseUrl": "cases/{0}/{1}/esignature/result/{2}?pdfID={3}&isMobileApp={4}&accessKey={5}&role={6}",
		    "params": [
		      "businessType",
		      "productName",
		      "caseId",
		      "pdfID",
			  "isMobileApp",
		      "accessKey", 
		      "role"
		    ]
		  },
		"RESOURCE_DOWNLOAD": {
			"baseUrl": "attachments/{0}/content",
			"params": [
				"attachmentId"
			]
		},
		"DOCUMENT_LAZY_CHOICELIST": {
			"baseUrl": "utilities/lookup?list={0}",
			"params": [
				"listDropdown"
			]
		},
		"INVOKE_RUNTIME": {
			"baseUrl": "invokeRuntime",
			"params": []
		},		
		"ONEMAP_API": {
			"baseUrl": "callAPIOneMap?api=search&searchVal={0}&country={1}",
			"params": [
				"postalCode",
				"country"
			]
		},
		"USER_GRANT_PERMISSIONS": {
			"baseUrl": "grantPermissions",
			"params": []
		},
		"USER_SELECT_PROFILE": {
			"baseUrl": "setSelectedProfile",
			"params": []
		},
		"USER_REGISTER": {
			"baseUrl": "user/register",
			"params": []
		},
		"USER_GET_DETAIL": {
			"baseUrl": "user/detail",
			"params": []
		},
		"USER_UPDATE_DETAIL": {
			"baseUrl": "user/detail/{0}",
			"params": [
				"username"
			]
		},
		"USER_REQUEST_RESET_PASSWORD": {
			"baseUrl": "user/requestResetPwd",
			"params": []
		},
		"USER_RESEND_OTP": {
			"baseUrl": "user/resendOTP",
			"params": []
		},
		"USER_SUBMIT_RESET_PASSWORD": {
			"baseUrl": "user/submitResetPwd",
			"params": []
		},
		"USER_VERIFY_OTP": {
			"baseUrl": "user/validateOTP ",
			"params": []
		},
		"USER_SUBMIT_CHANGE_PASSWORD": {
			"baseUrl": "user/submitChangePwd",
			"params": []
		},
		"ADMIN_RESET_USER_PASSWORD": {
			"baseUrl": "admin/resetUserPwd?username={0}",
			"params": [
				"username"
			]
		},
		"USER_ADD_INSURER_PROFILE": {
			"baseUrl": "user/insurerProfile",
			"params": []
		},
		"USER_LDAP_CHOICELIST": {
			"baseUrl": "accounts/restrictions",
			"params": []
		},
		"REQUEST_NEW_ACCESS_TOKEN": {
			"baseUrl": "requestNewAccessToken",
			"params": []
		},
		"GET_SYSTEM_DATE": {
			"baseUrl": "{0}/getSystemDate",
			"params": [
				"docType"
			]
		}
	},
	publicAPI: {
		"GET_PDF_ATTACHMENT_SIGNED_TO_VIEW": {
			"baseUrl": "attachments/getAttachmentToView?id=:id&view=pdf",
		    "params": [
		      "id"
		    ]
		},
		"SIGN_PDF_DOCUMENT_V4": {
		    "baseUrl": "cases/:businessType/:productName/esignature/:caseId?pdfID=:pdfID&isRunOnTablet=:isRunOnTablet&isMobileApp=:isMobileApp",
		    "params": [
		      "businessType",
		      "productName",
		      "caseId",
		      "pdfID",
		      "isRunOnTablet",
		      "isMobileApp"
		    ]
		 }, 
		"CASE_SUBMIT": {
			"baseUrl": "cases/submit?productCode=GGI",
			"params": [
			]
		},
		"FIND_BY_DOCNAME": {
            "baseUrl": ":docType/:businessType/:productName/:docName/:version",
            "params": [
            	"docType",
            	"businessType",
				"productName",
                "docName",
                "version"				
            ]
        },
        "CLONE_BY_DOCTYPE": {
        	"baseUrl": ":docType/:businessType/:productName/clone/:docName",
            "params": [
            	"docType",
            	"businessType",
				"productName",
                "docName",
            ]
        },
        "CLONE_DECLARATION_BY_POLICYID": {
        	"baseUrl": ":docType/:businessType/:productName/clone/:policyId/:effDate?endEffDate=:endEffDate",
            "params": [
            	"docType",
            	"businessType",
				"productName",
				"policyId",
				"effDate",
				"endEffDate"
            ]
        },
        "DOCUMENT_ACTION": {
            "baseUrl": ":docType/:docId/:action",
            "params": [
                "docType",
                "docId",
				"action"
            ]
        },
        "PRE_SUBMIT_CASE_ACTION": {
            "baseUrl": "cases/:businessType/:productName/:docId/presubmit?lang=:lang",
            "params": [
                "businessType",
                "productName",
                "docId",
                "lang"
            ]
        },
        
       "ACCEPT_QUOTATION": {
            "baseUrl": "quotations/:businessType/:productName/accept?caseId=:caseId&lang=:lang",
            "params": [
                "businessType",
                "productName",
                "caseId",
                "lang"
            ]
        },
        
		"SEARCH_DOCUMENT": {
			"baseUrl": ":docType/:businessType/:productName/metaData?page=:page&size=:size&sort=:sort",
			"params": [
				"docType",
				"page",
				"size",
				"sort",
				"businessType",
				"productName"
			]
		},
		"SEARCH_POLICY":{
			"baseUrl":"policys/policy/:policyid/:effDate",
			"params":[
				"policyid",
				"effDate"
			]
		},
		"SEARCH_POLICY_NEW":{
			"baseUrl":"policys/policy/:policyid/:effDate/:name",
			"params":[
				"policyid",
				"effDate",
				"name"
			]
		},
		"SEARCH_DOCUMENTLIST":{
			"baseUrl":"policys/documents/:policyid/:tranno",
			"params":[
				"policyid",
				"tranno"
			]
		},
		"SEARCH_CLIENTDETAIL":{
			"baseUrl":"clients/clientdetails/:clientId",
			"params":[
				"clientId"
			]
		},
		"GET_FULL_ACCOUNT": {
			"baseUrl": ":docType/allWithoutNestedProfile",
			"params": [
				"docType"
			]
		},
		"SEARCH_DOCUMENT_FULL": {
			"baseUrl": ":docType/getAll?page=:page&size=:size&sort=:sort",
			"params": [
				"docType",
				"page",
				"size",
				"sort"
			]
		},
		"SEARCH_DEDUPE_INTERESTPARTY": {
			"baseUrl": ":docType/dedupe?page=:page&size=:size&sort=:sort",
			"params": [
				"docType",
				"page",
				"size",
				"sort"
			]
		},
		"SEARCH_DOCUMENT_DEDUP_QUOTATION": {
			"baseUrl": ":docType/dedupe?page=:page&size=:size&sort=:sort",
			"params": [
				"docType",
				"page",
				"size",
				"sort"
				]
		},
		"COPY_DEDUP_QUOTATION": {
			"baseUrl": ":docType/:docId/copy",
			"params": [
				"docType",
				"docId"
			]
		},
		"GET_DOCUMENT_TOTAL_RECORDS": {
			"baseUrl": ":docType/:businessType/:productName/metaData/count",
			"params": [
				"docType",
				"businessType",
				"productName"
			]
		},
		"PICKUP_UNDERWRITING": {
			"baseUrl": ":docType/:businessType/:productName/pickup/:docId",
			"params": [
				"docType",
				"docId",
				"businessType",
				"productName"
			]
		},
		"RETURN_UNDERWRITING": {
			"baseUrl": ":docType/:businessType/:productName/return/:docId",
			"params": [
				"docType",
				"docId",
				"businessType",
				"productName"
			]
		},
		"PICKUP_RETURN_MANAGER": {
			"baseUrl": ":docType/:businessType/:productName/:action/:docId",
			"params": [
				"docType",
				"docId",
				"businessType",
				"productName",
				"action"
			]
		},
		"INIT_DOCUMENT": {
			"baseUrl": ":docType/:businessType/:productName/model",
			"params": [
				"docType",
				"businessType",
				"productName"
			]
		},
		"INIT_SA_REPORT": {
			"baseUrl": "cases/report/:SAName",
			"params": [
				"SAName"
			]
		},
		"GENERATE_REPORT_SA": {
			"baseUrl": "cases/report/generate",
			"params": [
				"data"
			]
		},
		"INIT_DOCUMENT_PARTIAL": {
			"baseUrl": ":docType/:partDocType/model",
			"params": [
				"docType",
				"partDocType"
			]
		},
		"CREATE_DOCUMENT": {
			"baseUrl": ":docType/:businessType/:productName",
			"params": [
				"docType",
				"businessType",
				"productName"
			]
		},
		"DELETE_DOCUMENT": {
			"baseUrl": ":docType/:docId",
			"params": [
				"docType",
				"docId"
			]
		},
		"OPERATE_DOCUMENT_BY_ID": {
			"baseUrl": ":docType/:businessType/:productName/:docId/:action",
			"params": [
				"docType",
				"docId",
				"action",
				"businessType",
				"productName"
			]
		},
		"OPERATE_DOCUMENT_BY_ID_POLICY": {
			"baseUrl": ":docType/:docId/:productName/:currFromDate/:lineOfBusiness",
			"params": [
				"docType",
				"docId",
				"action",
				"currFromDate",
				"productName",
				"lineOfBusiness"
			]
		},
		"OPERATE_DOCUMENT_BY_ID_AND_TYPE": {
			"baseUrl": ":docType/:businessType/:productName/:type/:docId/:action",
			"params": [
				"docType",
				"docId",
				"action",
				"businessType",
				"productName",
				"type"
			]
		},		
		"OPERATE_UW_BY_ID": {
			"baseUrl": ":docType/:businessType/:productName/operations/:docId?action=:action&role=:role",
			"params": [
				"docType",
				"docId",
				"action",
				"role",
				"businessType",
				"productName"
			]
		},
		"OPERATE_MANAGER_BY_ID": {
			"baseUrl": ":docType/:businessType/:productName/operations/:docId?action=:action",
			"params": [
				"docType",
				"docId",
				"action",
				"businessType",
				"productName"
			]
		},
		"OPERATE_DOCUMENT_BY_DETAIL": {
			"baseUrl": ":docType/:businessType/:productName/operations?action=:action&acceptaction=:arrayacceptAction",
			"params": [
				"docType",
				"businessType",
				"productName",
				"action",
				"acceptaction"
			]
		},
		"UPLOAD_ATTACHMENT": {
			"baseUrl": "{0}/upload",
			"params": [
				"docType"
			]
		},
		"PRINT_PDF" : {
			"baseUrl": "prints?templateName=:templateName&lang=:lang",
			"params": [
				'templateName',
				'lang'
			]
		},
        "SIGN_DOCUMENT" : {
            "baseUrl": "prints/esign?templateName=:templateName&caseId=:caseId&lang=:lang",
            "params": [
                "templateName",
				"caseId",
				"lang"
            ]
        },
        "RETRIEVE_SIGNED_DOCUMENT" : {
            "baseUrl": "attachments/retrieveSignedPdf?templateName=:templateName&caseId=:caseId&lang=:lang",
            "params": [
                "templateName",
                "caseId",
                "lang"
            ]
        },
		"GET_USERNAME_ROLE": {
			"baseUrl": ":docType/usernames/get-activate-list?roleId=:roleId&operator=OR",
			"params": [
				"docType",
				"roleId"
			]
		},
		"GET_TOB_TEMPLATE": {
			"baseUrl": ":docType/tobs/:tobType/categories?emirateId=:emirateId&categoryName=:categoryName",
			"params": [
				"docType",
				"tobType",
				"emirateId",
				"categoryName"
			]
		},
		"FORM_MODEL_BENEFIT": {
			"baseUrl": ":docType/:docId/tobs/:tobType/categories/:categoryId/benefits/model?emirateId=:emirateId",
			"params": [
				"docType",
				"docId",
				"tobType",
				"categoryId",
				"emirateId"
			]
		},
		"ADD_BENEFIT": {
			"baseUrl": ":docType/:docId/tobs/:tobType/categories?emirateId=:emirateId",
			"params": [
				"docType",
				"tobType",
				"emirateId"
			]
		},
		"SAVE_DETAIL_TOB": {
			"baseUrl": ":docType/:docId/tobs/:tobType/categories?emirateId=:emirateId",
			"params": [
				"docType",
				"tobType",
				"emirateId"
			]
		},
		"OPERATE_BENEFIT": {
			"baseUrl": ":docType/:docId/tobs/:tobType/categories/:categoryId/benefits/operations?action=:action",
			"params": [
				"docType",
				"tobType",
				"categoryId",
				"action"
			]
		},
		"INIT_NEW_QUOTATION": {
			"baseUrl": ":docType/newQuote?ownerName=:ownerName&licenseNumber=:licenseNumber&poBoxNumber=:poBoxNumber",
			"params": [
				"docType",
				"ownerName",
				"licenseNumber",
				"poBoxNumber",
			]
		},
		"REGULATOR_IHUB": {
			"baseUrl": "integrations/iHub/regulators?emirateId=:emirateId",
			"params": [
				"emirateId"
			]
		},
		"TOBID_IHUB": {
			"baseUrl": "integrations/iHub/regulators/:regulatorCode/tobs",
			"params": [
				"regulatorCode"
			]
		},
		"BROKER_DETAIL_IHUB": {
			"baseUrl": "integrations/iHub/brokerDetail?acctSel=:agentCode",
			"params": [
				"agentCode"
			]
		},
		"GET_COMMISSION": {
			"baseUrl": "integrations/getCommissionValueService/:productCode",
			"params": [
				"productCode"
			]
		},
		"PICKUP_RETURN": {
			"baseUrl": ":docType/:docId/:action?role=:role",
			"params": [
				"docType",
				"docId",
				"action",
				"role"
			]
		},
		"COMPUTE_BY_TAG_NAME": {
			"baseUrl": ":docType/tags/:tagName/compute",
			"params": [
				"docType",
				"tagName"
			]
		},
        "TOB_NEW_MODEL": {
            "baseUrl": ":docType/:docId/tobs/:tobType/categories?emirateId=:emirateCode",
            "params": [
                "docType",
                "docId",
                "emirateCode",
                "tobType"
            ]
        },
        "SAVE_TOB_NEW_MODEL": {
        	"baseUrl": ":docType/:docId/tobs/:tobType/categories?emirateId=:emirateCode",
        	"params": [
        		"docType",
        		"docId",
        		"emirateCode",
        		"tobType"
        		]
        },
        "GET_TOB_TEMPLATE_NEW": {

            "baseUrl": ":docType/:docId/tobs/:tobType/categories/:categoryNumber?action=import",
            "params": [
                "docType",
                "docId",
                "tobType",
                "categoryNumber"
            ]
        },
        "OPERATE_DOCUMENT_BY_TAG_NAME": {
			"baseUrl": ":docType/:businessType/:productName/operations?action=:action&tagName=:tagName&tagIndex=:tagIndex&tagParent=:tagParent&tagsInclude=:tagsInclude",
			"params": [
				"docType",
			    "businessType",
			    "productName",
				"action",
				"tagName",
				"tagIndex",
				"tagParent",
				"tagsInclude"
			]
		},
		"COPY_QUOTATION": {
			"baseUrl" : "quotations/:docId/copyQuo",
			"params": [
				"docId"
			]
		},
		"IMPORT_CONTACT_INTO_FNA": {
			"baseUrl" : ":docType/import?type=:type&docName=:contactDocName&index=:index",
			"params": [
			    "docType",
				"type",
				"contactDocName",
				"index"
			]
		},
		"IMPORT_FNA_INTO_CASE": {
			"baseUrl" : ":docType/:businessType/:productName/import?fnaDocName=:fnaDocName",
			"params": [
			    "docType", 
			    "businessType",
			    "productName",
				"fnaDocName"
			]
		},
		"USER_UPDATE_DETAIL": {
			"baseUrl": "accounts/:userName",
			"params": [
				"username"
			]
		},
		"CREATE_USER_ACCOUNT": {
			"baseUrl": "accounts?createByAdmin=:createByAdmin",
			"params": [
				"createByAdmin",
				"landingURL"
			],
			"data": []
		},
		"UNLOCK_ACCOUNT": {
			"baseUrl": "accounts/sendmailunlockaccount",
			"data": []
		},
		"GET_LIST": {
			"baseUrl" : ":docType/:businessType/:productName/model/:className",
			"params": [
			    "docType", 
			    "businessType",
			    "productName",
				"className"
			]
		},
		"VALIDATE_INSURER_PROFILE": {
			"baseUrl": "accounts/operations/validateProfile",
			"params": []
		},
		"LIFE_INSURED_CHECK_EXISTING": {
			"baseUrl": ":docType/:businessType/:productName/checkLIContactFromQuo/duplicate",
			"params": [
				"docType",
				"businessType",
			    "productName"
			]
		},
		"LOGIN_REQUEST_PERMISSION": {
            "baseUrl": "notifications/request_permission_mobility",
            "params": [
                "name",
                "email",
                "deviceId",
                "token"
            ],
            "data":[]
        },
        "GET_RESPONSE_PERMISSION": {
            "baseUrl": "notifications/mobility/response_permission_login",
            "params": [
                "name",
                "email",
                "deviceId",
                "token"
            ],
            "data":[]
        },
        "GET_MOCK_FROM_IHUB":{
        	
       	  "baseUrl": "quotations/pnc/can/policies?role=:role&pasId=:pasId&customerId=:customerId"
        },
        "GET_MOCK_FROM_IHUB_CONVENYEE":{
        	
         	  "baseUrl": "quotations/pnc/can/vessels?name=:name&offset=:offset&limit=:limit"
          },
          "GET_FILE_DOCUMENT":{
        	  "baseUrl": "policys/document?path=:path&policyID=:policyID"
          },
          "SEND_EMAIL":{
        	  "baseUrl":"cases/send/email-with-attachment",
        	  "params":[],
        	  "data":[]
          }
    }
};