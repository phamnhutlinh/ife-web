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
var ConstantConfig = {
	"SALE_CHANNEL": {
		"AGENT_SALE": "AS",
		"DIRECT_SALE": "DS"
	},
	"COMPANY_NAME": {
		"CSC-Insurance": "",
		"MNC-General": "mnc-general",
		"MNC-Life": "mnc-life",
		"CSC-Insurance-company": "csc-insurance",
		"DEFAULT": ""
	},
	"COMPANY_ID": {
		"MNC_GENERAL": "MNC-General",
		"MNC-Life": "MNC-Life"
	},
	"DOCTYPE": {
		"METADATA": "metaData",
		"PACKAGEBUNDLE": "packageBundle"
	},
	"ACTIONTYPE": {
		"NEWBUSINESS": "new-business",
		"RENEWAL": "renewal",
		"ENDORSMENT": "endorsment",
		"UNDERWRITING_ACTION": {
			"ACCEPT": "accept",
			"REJECT": "reject",
			"COUNTER-OFFER": "counter-offer"
		}
	},
	"QUOTATION": {
		"UW_QUO": "UW_QUO"		
	},
	"CARDTYPE": {
		"ACTION": "action",
		"DEFAULT": "default",
		"TEMPLATE": "template"
	},
	"CONFIG_KEY": {
		"ROLE": "role_config",
		"GLOBAL": "global_config",
		"UI": "ui_config"
	},
	"PLATFORM": {
		"ANDROID": "android",
		"IOS": "iOS",
		"WEB": "web",
		"WEB_LIFERAY": "web-liferay"
	},
	"USER_STATUS": {
		"ACTIVE": "USER_ACTIVE",
		"IN_ACTIVE": "USER_INACTIVE"
	},
	"BUSINESS_OPERATION" : {
		"UNDERWRITING": {
			"PENDING_UW":"PENDING_UW",
			"COUNTER_OFFER":"COUNTER_OFFER",
			"COUNTER_OFFERED":"COUNTER_OFFERED",
			"COUNTER_OFFER_INPROGRESS":"COUNTER_OFFER_INPROGRESS",
			"COUNTER_OFFER_CONFIRMED":"COUNTER_OFFER_CONFIRMED",
			"PICKUP":"PICKUP",
			"UNPICKUP":"UNPICKUP",
			"NOT_DECIDED":"NOT_DECIDED",
			"DECIDED":"DECIDED"
		},
		"MANAGERREVIEW": {
			"DR": "DR",
			"PICKEDUP":"PICKEDUP",
			"AGREE":"AGREE",
			"DISAGREE":"DISAGREE"
		},
		"QUOTATION": {
			"SUBMIT": "submit",
			"RESUBMIT": "resubmit"
		},		
		"POLICYINSURRANCE": {
			"PICKUP": "pickup",
			"RETURN": "return",
			"APPROVE": "submitToPI",
			"REJECT_TO_SALE": "rejectFromPIToAgent"
		}
	},
	"BUSINESS_STATUS": {
		"DR": "DR", //Draft
		"PR": "PR", //Process
		"RJ": "RJ", //Dropped by UW
		"RS": "RS", //Reject to Sales
		"CS": "CS", //Cancelled by Sales
		"RC": "RC", //Rejected by Client
		"AC": "AC", //Accept
		"PD": "PD", //Pending Document
		"DS": "DS", //Dropped by Sales
		"EX": "EX", //Expired
		"PS": "PS", //Pending for Submission
		"QC": "QC", //Quote Closed
		"CQ": "CQ", //Converted Quote
		"RN": "RN", //Not Renewed
		"AT": "AT", //Auto Terminate
		"COMPLETED": "COMPLETED",	//Complete
		"ACCEPTED": "ACCEPTED",	//ACCEPTED
		"REJECTED": "REJECTED",	//REJECTED
		"PENDING": "PENDING", //Pending Review
		"PICKED": "PICKED", //Picked up
		"READY_FOR_SUBMISSION": "READY_FOR_SUBMISSION",
		"SUBMITTING": "SUBMITTING",
		"SUBMITTED": "SUBMITTED",
		"FAILED": "FAILED"
	}, 
	"CONTACT_TYPE": {
		"INDIVIDUAL": "INDIVIDUAL",
		"COPORATE": "COPORATE"
	},
	"DOCUMENT_STATUS": {
		"VALID": "VALID",
		"INVALID": "INVALID"
	},
	"QUOTATION_TYPE": {
		"STANDALONE": "ST",
		"NORMAL": "NM"
	},
	"PROSPECT_TYPE": {
		"BENEFICIARY": "BENEFICIARY"
	},
	"STANDALONE_DOCTYPE": [
		"agent-payment",
		"client",
		"userProfile",
		"agent",
		"prospect",
		"manager-review",
		"pdpa",
		"organization-contact",
		"factfind"
	],
	"LAYOUT_STYLE": {
		"DEFAULT": "",
		"card": "",
		"sec": "sec"
	},
	"MODULE_NAME": {
		"CONTACT": "contact",
		"CORPORATE": "corporate",
		"SALECASE": "case",
		"APPLICATION": "application",
		"POLICYISSUANCE": "policy-issuance",
		"TOB": "tob",
		"UNDERWRITING": "underwriting",
		"MANAGERREVIEW": "managerreview",
		"UNDERWRITING_ADMIN": "underwriting-admin",
		"AGENT_PAYMENT": "agent-payment",
		"PAYMENT": "payment",
		"CLIENT_PAYMENT": "client-payment",
		"RESOURCE_FILE": "resource-file",
		"QUOTATION": "quotation",
		"ACCOUNT": "account",
		"ATTACHMENT": "attachment",
		"AUDITOR": "auditor",
		"CATALOG": "catalog",
		"TRANSACTION": "transaction",
		"FNA": "fna",
		"CLIENT": "client",
		"POLICY": "policy",
		"DIRECT_SALE": "direct-sale"
	},
	"TAG": {
		"STARRED": "STARRED"
	},
	"TITLE_DOCUMENT_NAME": {
		"PATTERN": /^([a-zA-Z- _\d])+\.((doc|DOC|docx|DOCX)|(xls|XLS|xlsx|XLSX)|(ppt|PPT|pptx|PPTX)|(pdf|PDF)|(tif|TIF|jpg|JPG|jpeg|JPEG|gif|GIF|png|PNG|))$/g
	},
	"PASSWORD": {
		"PATTERN": "(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[~!@#$%^&*()_+=])(?=[\\S]+$).{8,20}"
	},
	"EMAIL": {
		"PATTERN": /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	},
	"ACTION": {
		"SUBMIT": "/action/submit",
		"COMPUTE": "COMPUTE",
		"REFRESH": "REFRESH",
		"VALIDATE": "VALIDATE",
		"UPDATE": "UPDATE",
		"CREATE": "CREATE"
	},
	"TAG_TYPE" : {
		"TAGS" : "tags",
		"IGNORE_TAGS" : "ignoreTags"
	},	
	"MANAGERREVIEW_ACTION": {
		"AGREE": "AGREE",
		"DISAGREE": "DISAGREE",
		"PICKUP": "PICKUP",
		"RETURN": "RETURN"
	},	
	"DATEFORMAT": "dd/MM/yyyy",
	"LEFT_SIDE_BAR_INITIAL_LIMIT": 36,
	"LEFT_SIDE_BAR_INCREMENT": 12,
	"SDWEB": {
		"STATUS": {
			"SIGNED": "SIGNED",
			"NOT_SIGNED": "NOT_SIGNED"
		}
	},
	"PAYMENT_METHOD": {
		"CASH": "1",	
		"CHEQUE": "2",		
		"BANK_TRANSFER": "3",
		"CREDIT_CARD": "4"
	},
	"NOTIFY_MESSAGE": {
		"SUCCESS": "success",
		"WARNING": "warning",
		"ERROR": "error"
	},
	"ATTACHMENT_GROUP": {
		"TRANSACTION": "TD",
		"OPTIONAL": "OP"
	},	
	"STARRED": "Starred",
	"PRODUCT_GROUP": {
		"FIRE": "Fire",
		"MOTOR": "Motor",
		"FOREIGN_WORKER": "ForeignWorker",
		"TERM_LIFE": "TermLife",
		"GROUP_TERM_LIFE": "GTL1",
		"UNIT_LINK": "UnitLink",
		"TRAVEL": "Travel",
		"DIRECT_TRAVEL": "TravelDirectSale",
		"DIRECT_PA": "Personal-accident"
	},
	"PRODUCT_LOB": {
		"PNC": "pnc",
		"LIFE": "life",
		"GROUP": "group"
	},
	"PRODUCT_CODE": {
		"travel-express": "TR-AG-01",
		"group-travel-express": "TR-AG-02",
		"direct-sale-pa": "PA-DI-01",
		"direct-sale-travel-express": "TR-DI-01"
	},
	"PRODUCT": {
		"TERM_LIFE_PROTECT_AS": "term-life-protect-as",
		"TERM_LIFE_PROTECT_DS": "term-life-protect-ds",
		"MOTOR_PRIVATE_CAR_M_AS": "motor-private-car-m-as",
		"MOTOR_PRIVATE_CAR_M_DS": "motor-private-car-m-ds",
		"MOTOR_PRIVATE_CAR_M": "motor-private-car-m",
		"MOTOR_PRIVATE_CAR_DS": "motor-private-car-ds",
		"MOTOR": "motor-private-car-m-as",
		"FIRE_HOUSEOWNER_AS": "fire-houseowner-as",
		"FIRE": "fir",
		"PERSONAL_ACCIDENT": "personal-accident",
		"GUARANTEED_CASHBACK": "guaranteed-cashback-saver",
		"TERM_LIFE_SECURE": "term-life-secure",
		"GROUP_TERM_LIFE": "GTL1",
		"REGULAR_UNIT_LINK": "regular-unit-link",
		"TRAVEL_EXPRESS": "travel-express",
		"GROUP_TRAVEL_EXPRESS": "group-travel-express",
		"DIRECT_SALE_PA": "direct-sale-pa",
		"DIRECT_TRAVEL": "direct-sale-travel-express",
		"DIRECT_SALE_HOME": "direct-sale-home",
		"DS_GUARANTEED_CASHBACK": "ds-guaranteed-cashback-saver"
	},
	"POLICYSERVICING_REASON": {
		"ADD_BENEFICIARY": "addBeneficiary",
		"CHANGE_PREMIUM_FREQUENCY": "changePremiumFrequency"
	},
	"UI_STRUCTURE": {
		"NOT_REMOVE_TEMPLATE_CHILDREN": true,
		"REMOVE_TEMPLATE_CHILDREN": false,
		"EXPECTED_DETAIL_NOT_CHANGED": false
	},
	"DEFAULT_META_PROPERTIES": {
		"errorCode": null,
		"errorDesc": null,
		"captionCode": null,
		"captionDesc": null,
		"enable": "true",
		"visible": "true",
		"mandatory": "false",
		"encrypt": null,
		"encryptAlgo": null,
		"dataGroup": null,
		"dataType": null,
		"dataFormat": null,
		"dataMinValue": null,
		"dataMaxValue": null,
		"dataMinLength": null,
		"dataMaxLength": null,
		"dataSeq": null
	},
	"DEFAULT_META_PROPERTIES_FOR_ARRAY": {
		"minOccurs": "0",
		"maxOccurs": "15"
	},
	"DEFAULT_APPLICATION_OPTION": {
		"autoSaveInterval": 0,
		"multiple_session_per_user": "Yes",
		"useTranslationDataFromDB": false,
		"multiple_tabs_per_session": "Yes",
		"DEV_MODE": false,
		"isShowLeftSideBar": false,
		"cardPreview": true,
		"cacheUiJsonMock": false,
		"config_live_time": 3600000,
		"maxDayToRenew": 7,
		"cacheFlg": true,
		"alphabet": "KfkJs9VtWXIivjLBocCDz67FemQb3wnT/xpaZgUG=HlEuA021y+NOP5RSdr4MhYq8",
		"cardTouchMode": false,
		"autoSaveNavigating": true,
		"retrieveTime": 1496630955256
	},
	"EXTENTION_FILE":{
		"TYPE_FILE":[
			{"key":"DOC_IC","value":["xls","xlsx"]},
			{"key":"DOC_DECE","value":["xls","xlsx"]},
            {"key":"DOC_OLRR","value":["docx","doc","pdf","xlsx","xls","pptx","ppt","zip","rar"]},
            {"key":"DOC_CTOB","value":["pdf","zip","rar"]},
            {"key":"DOC_DECR","value":["docx","doc","pdf","xlsx","xls","pptx","ppt","zip","rar"]},
            {"key":"DOC_GRAF","value":["pdf"]},
            {"key":"DOC_TRLI","value":["pdf"]},
            {"key":"DOC_CRTA","value":["all"]},
            {"key":"DOC_ESEC","value":["all"]},
            {"key":"DOC_PHOT","value":["jpg","zip","rar"]},
            {"key":"DOC_CHEQ","value":["all"]},
            {"key":"DOC_SGQT","value":["all"]},
            {"key":"DOC_PPVI","value":["all"]},
            {"key":"DOC_COIC","value":["all"]},
            {"key":"DOC_GCIF","value":["all"]},
            {"key":"DOC_IMAF","value":["all"]},
            {"key":"DOC_SADE","value":["all"]},
            {"key":"DOC_EMLI","value":["all"]},
            {"key":"DOC_PNPI","value":["all"]},
            {"key":"DOC_HAPE","value":["all"]},
            {"key":"DOC_SPVI","value":["all"]},
            {"key":"DOC_PYRE","value":["all"]},
            {"key":"DOC_ORTHER","value":["all"]},
            {"key":"DOC_VAAB","value":["pdf"]},
            {"key":"DOC_BROC","value":["pdf"]},
            {"key":"DOC_UIPR","value":["pdf"]},
            {"key":"DOC_MACL","value":["pdf"]},
            {"key":"DOC_UILI","value":["pdf"]},
            {"key":"DOC_UIDO","value":["pdf"]},
            {"key":"DOC_UIKP","value":["pdf"]}

		]
	},
	"FILE_SIZE":{
		"MAX":10485760
	},
	"VPMS_MAPPING_FIELD":{
		/*** compute in Assumption tile (FNA outside - Client) ***/
		"ASSUMPTION_TILE":"AssumptionTile",
		
		/*** compute in Protection Upon Death tile (FNA outside - Client) ***/
		"PROTECTION_UPON_DEATH_TILE":"ProtectionUponDeathTile",
		
		/*** compute in Medium/Long Term Savings tile (FNA outside - Client/Joint) ***/
		"MEDIUM_LONG_TERM_TILE":"MediumLongTermSavingsTile",
		
		/*** compute Mortgage Protection tile (FNA outside - Client/Joint) ***/
		"MORTGAGE_PROTECTION_TILE":"MortgageProtectionTile",
		
		/*** compute Critical Illness tile (FNA outside - Client) ***/
		"CRITICAL_ILLNESS_TILE":"CriticalIllnessTile",
		
		/*** compute Total Score In Investment Risk Profile Tile (FNA outside - Client/Joint) ***/
		"INVESTMENT_RISK_PROFILE_TILE":"InvestmentRiskProfileTile",
		
		/*** compute No. of years to support in Dependents/Children tile (FNA outside - Client/Joint) ***/ 
		"DEPENDANTS_CHILDREN_TILE":"DependantsChildrenTile",
		"DEPENDANTS_ELDERLY_TILE":"DependantsElderlyTile",
		
		/*** compute RETIRE FUND tile (FNA outside - Client/Joint) ***/ 
		"RETIRE_FUND_TILE":"RetireFundTile",
		
		/*** compute Education Fund tile (FNA outside - Client/Joint) ***/ 
		"EDUCATION_FUND_TILE":"EducationFundTile",
			
		/*** compute Number of Goal (FNA outside - Client) ***/ 
		"NUMBER_OF_GOAL":"NumberOfGoal"	,
		
		/*** compute Annual Cash Flow & Budgeted Funds (FNA outside - Client/Joint) ***/
		"ANNUAL_FUND_TILE": "AnnualFundTile",
			
		/*** compute Annual Cash Flow & Budgeted Funds (FNA outside - Client/Joint) ***/
		"ASSETS_LIABILITIES_TILE": "AssetsLiabilitiesTile",
			
		/*** compute Age Nearest Birthday(Quotation) ***/
		"AGE_NEAREST_BIRTHDAY":"AgeNearestBirthday",
			
		/*** validate PDPA (Contact) ***/
		"COMMUNICATION_CHANNEL_VALUE":"CommunicationChannelValue"
	},	
	
	"VPMS_MAPPING_TAG_INCLUDE": {
	},
	"DMS_TYPE":{
		"PDPA": "PDPA",
		"QUOTATION": "BI",
		"APPLICATION": "APPLICATION",
		"MANAGER_REVIEW": "MR",
		"FNA": "FNA",
		"MT2": {
			"QUOTATION": "BI_PNC_MT2",
			"APPLICATION": "APPLICATION_PNC_MT2"
		},
		"MT1": {
			"QUOTATION": "BI_PNC_MT1",
			"APPLICATION": "APPLICATION_PNC_MT1"
		},
		"MAR": {
			"QUOTATION": "BI_PNC_MAR",
			"APPLICATION": "APPLICATION_PNC_MAR"
		},
		"MIC": {
			"QUOTATION": "BI_PNC_MIC",
			"APPLICATION": "APPLICATION_PNC_MIC"
		},"CAN": {
			"QUOTATION": "BI_PNC_CAN",
			"APPLICATION": "APPLICATION_PNC_CAN"
		}
	},
	"PO_LI_RELATION": {
		"SAME": "Y",
		"NOT_SAME": "N"
	},
	"NUMBER": {
		"ZERO": 0
	},
	"PRODUCT": {
		"RUL": "rul",
		"BNI": "bni"
	
	},
	"BUSINESS": {
		"LIFE": "life"
	},
	"BASICQUOTECTRL": "BasicQuoteCtrl",
	"TIMEOUT_SETTINGS": {
		"IDLE_TIME": 3600,
		"WAITING_TIME": 60,
		"KEEPALIVE_INTERVAL": 300
	},
	"MOC":{
		"marineOpenCoverInsured": {
		    "id": null,
		    "inception": {
		      "value": "",
		      "meta": {
		        "encryptAlgo": "",
		        "dataMinValue": "",
		        "stepped": "",
		        "visible": "",
		        "maxvalue": "",
		        "errorDesc": "",
		        "editable": "",
		        "dataFormat": "",
		        "dataType": "",
		        "errorCode": "",
		        "dataMinLength": "",
		        "mandatory": "",
		        "minvalue": "",
		        "dataMaxValue": "",
		        "dataSeq": "",
		        "dataGroup": "",
		        "captionDesc": "",
		        "enable": "",
		        "encrypt": "",
		        "captionCode": "",
		        "dataMaxLength": ""
		      }
		    },
		    "expiry": {
		      "value": null,
		      "meta": {
		        "encryptAlgo": "",
		        "dataMinValue": "",
		        "stepped": "",
		        "visible": "",
		        "maxvalue": "",
		        "errorDesc": "",
		        "editable": "",
		        "dataFormat": "",
		        "dataType": "",
		        "errorCode": "",
		        "dataMinLength": "",
		        "mandatory": "",
		        "minvalue": "",
		        "dataMaxValue": "",
		        "dataSeq": "",
		        "dataGroup": "",
		        "captionDesc": "",
		        "enable": "",
		        "encrypt": "",
		        "captionCode": "",
		        "dataMaxLength": ""
		      }
		    },
		    "mct": {
		      "meta": {
		        "counter": "4",
		        "defaultOccurs": "",
		        "minOccurs": "",
		        "maxOccurs": "",
		        "errorCode": ""
		      },
		      "value": []
		    },
		    "conv": {
		      "meta": {
		        "counter": "4",
		        "defaultOccurs": "",
		        "minOccurs": "",
		        "maxOccurs": "",
		        "errorCode": ""
		      },
		      "value": []
		    },
		    "clients": {
		      "meta": {
		        "counter": "5",
		        "defaultOccurs": "0",
		        "minOccurs": "",
		        "maxOccurs": "",
		        "errorCode": ""
		      },
		      "value": []
		    },
		    "shipmentMOC": {
		      "meta": {
		        "counter": "3",
		        "defaultOccurs": "",
		        "minOccurs": "",
		        "maxOccurs": "",
		        "errorCode": ""
		      },
		      "value": []
		    },
		    "userIdListMOC": {
		      "meta": {
		        "counter": "3",
		        "defaultOccurs": "",
		        "minOccurs": "",
		        "maxOccurs": "",
		        "errorCode": ""
		      },
		      "value": []
		    },
		    "voyageFromListMOC": {
		      "meta": {
		        "counter": "3",
		        "defaultOccurs": "",
		        "minOccurs": "",
		        "maxOccurs": "",
		        "errorCode": ""
		      },
		      "value": []
		    },
		    "voyageToListMOC": {
		      "meta": {
		        "counter": "3",
		        "defaultOccurs": "",
		        "minOccurs": "",
		        "maxOccurs": "",
		        "errorCode": ""
		      },
		      "value": []
		    },
		    "packingMOC": {
		      "meta": {
		        "counter": "3",
		        "defaultOccurs": "",
		        "minOccurs": "",
		        "maxOccurs": "",
		        "errorCode": ""
		      },
		      "value": []
		    },
		    "commodityTypeMOC": {
		      "meta": {
		        "counter": "4",
		        "defaultOccurs": "",
		        "minOccurs": "",
		        "maxOccurs": "",
		        "errorCode": ""
		      },
		      "value": []
		    },
		    "portFromMOC": {
		    	"meta": {
		    		"counter": "4",
		    		"defaultOccurs": "",
		    		"minOccurs": "",
		    		"maxOccurs": "",
		    		"errorCode": ""
		    	},
		    	"value": []
		    },
		    "portToMOC": {
		    	"meta": {
		    		"counter": "4",
		    		"defaultOccurs": "",
		    		"minOccurs": "",
		    		"maxOccurs": "",
		    		"errorCode": ""
		    	},
		    	"value": []
		    },
		    "liabilityLimit": {
		      "value": null,
		      "meta": {
		        "encryptAlgo": "",
		        "dataMinValue": "",
		        "stepped": "",
		        "visible": "",
		        "maxvalue": "",
		        "errorDesc": "",
		        "editable": "",
		        "dataFormat": "",
		        "dataType": "",
		        "errorCode": "",
		        "dataMinLength": "",
		        "mandatory": "",
		        "minvalue": "",
		        "dataMaxValue": "",
		        "dataSeq": "",
		        "dataGroup": "",
		        "captionDesc": "",
		        "enable": "",
		        "encrypt": "",
		        "captionCode": "",
		        "dataMaxLength": ""
		      }
		    },
		    "liabilityLimitCurrency": {
		      "value": null,
		      "meta": {
		        "encryptAlgo": "",
		        "dataMinValue": "",
		        "stepped": "",
		        "visible": "",
		        "maxvalue": "",
		        "errorDesc": "",
		        "editable": "",
		        "dataFormat": "",
		        "dataType": "",
		        "errorCode": "",
		        "dataMinLength": "",
		        "mandatory": "",
		        "minvalue": "",
		        "dataMaxValue": "",
		        "dataSeq": "",
		        "dataGroup": "",
		        "captionDesc": "",
		        "enable": "",
		        "encrypt": "",
		        "captionCode": "",
		        "dataMaxLength": ""
		      }
		    },
		    "sumInsuredCurrency": {
		      "value": null,
		      "meta": {
		        "encryptAlgo": "",
		        "dataMinValue": "",
		        "stepped": "",
		        "visible": "",
		        "maxvalue": "",
		        "errorDesc": "",
		        "editable": "",
		        "dataFormat": "",
		        "dataType": "",
		        "errorCode": "",
		        "dataMinLength": "",
		        "mandatory": "",
		        "minvalue": "",
		        "dataMaxValue": "",
		        "dataSeq": "",
		        "dataGroup": "",
		        "captionDesc": "",
		        "enable": "",
		        "encrypt": "",
		        "captionCode": "",
		        "dataMaxLength": ""
		      }
		    },
		    "description": {
		      "value": null,
		      "meta": {
		        "encryptAlgo": "",
		        "dataMinValue": "",
		        "stepped": "",
		        "visible": "",
		        "maxvalue": "",
		        "errorDesc": "",
		        "editable": "",
		        "dataFormat": "",
		        "dataType": "",
		        "errorCode": "",
		        "dataMinLength": "",
		        "mandatory": "",
		        "minvalue": "",
		        "dataMaxValue": "",
		        "dataSeq": "",
		        "dataGroup": "",
		        "captionDesc": "",
		        "enable": "",
		        "encrypt": "",
		        "captionCode": "",
		        "dataMaxLength": ""
		      }
		    },
		    "cargoDescription": {
		      "value": null,
		      "meta": {
		        "encryptAlgo": "",
		        "dataMinValue": "",
		        "stepped": "",
		        "visible": "",
		        "maxvalue": "",
		        "errorDesc": "",
		        "editable": "",
		        "dataFormat": "",
		        "dataType": "",
		        "errorCode": "",
		        "dataMinLength": "",
		        "mandatory": "",
		        "minvalue": "",
		        "dataMaxValue": "",
		        "dataSeq": "",
		        "dataGroup": "",
		        "captionDesc": "",
		        "enable": "",
		        "encrypt": "",
		        "captionCode": "",
		        "dataMaxLength": ""
		      }
		    },
		    "agentID": {
		      "value": null,
		      "meta": {
		        "encryptAlgo": "",
		        "dataMinValue": "",
		        "stepped": "",
		        "visible": "",
		        "maxvalue": "",
		        "errorDesc": "",
		        "editable": "",
		        "dataFormat": "",
		        "dataType": "",
		        "errorCode": "",
		        "dataMinLength": "",
		        "mandatory": "",
		        "minvalue": "",
		        "dataMaxValue": "",
		        "dataSeq": "",
		        "dataGroup": "",
		        "captionDesc": "",
		        "enable": "",
		        "encrypt": "",
		        "captionCode": "",
		        "dataMaxLength": ""
		      }
		    },
		    "marineRate": {
		      "value": null,
		      "meta": {
		        "encryptAlgo": "",
		        "dataMinValue": "",
		        "stepped": "",
		        "visible": "",
		        "maxvalue": "",
		        "errorDesc": "",
		        "editable": "",
		        "dataFormat": "",
		        "dataType": "",
		        "errorCode": "",
		        "dataMinLength": "",
		        "mandatory": "",
		        "minvalue": "",
		        "dataMaxValue": "",
		        "dataSeq": "",
		        "dataGroup": "",
		        "captionDesc": "",
		        "enable": "",
		        "encrypt": "",
		        "captionCode": "",
		        "dataMaxLength": ""
		      }
		    },
		    "error": {
		      "value": null,
		      "meta": {
		        "encryptAlgo": "",
		        "dataMinValue": "",
		        "stepped": "",
		        "visible": "",
		        "maxvalue": "",
		        "errorDesc": "",
		        "editable": "",
		        "dataFormat": "",
		        "dataType": "",
		        "errorCode": "",
		        "dataMinLength": "",
		        "mandatory": "",
		        "minvalue": "",
		        "dataMaxValue": "",
		        "dataSeq": "",
		        "dataGroup": "",
		        "captionDesc": "",
		        "enable": "",
		        "encrypt": "",
		        "captionCode": "",
		        "dataMaxLength": ""
		      }
		    },
		    "policyHolder": {
		      "id": "",
		      "name": {
		        "value": null,
		        "meta": {
		          "encryptAlgo": "",
		          "dataMinValue": "",
		          "visible": "",
		          "errorDesc": "",
		          "editable": "",
		          "dataFormat": "",
		          "dataType": "",
		          "errorCode": "",
		          "dataMinLength": "",
		          "mandatory": "",
		          "dataMaxValue": "",
		          "dataSeq": "",
		          "dataGroup": "",
		          "captionDesc": "",
		          "enable": "",
		          "encrypt": "",
		          "captionCode": "",
		          "dataMaxLength": ""
		        }
		      }
		    },
		    "assuredMOC": {
		      "value": null,
		      "meta": {
		        "encryptAlgo": "",
		        "dataMinValue": "",
		        "stepped": "",
		        "visible": "",
		        "maxvalue": "",
		        "errorDesc": "",
		        "editable": "",
		        "dataFormat": "",
		        "dataType": "",
		        "errorCode": "",
		        "dataMinLength": "",
		        "mandatory": "",
		        "minvalue": "",
		        "dataMaxValue": "",
		        "dataSeq": "",
		        "dataGroup": "",
		        "captionDesc": "",
		        "enable": "",
		        "encrypt": "",
		        "captionCode": "",
		        "dataMaxLength": ""
		      }
		    },
		    "tranNo": {
                "value": null,
                "meta": {
                  "encryptAlgo": "",
                  "dataMinValue": "",
                  "stepped": "",
                  "visible": "",
                  "maxvalue": "",
                  "errorDesc": "",
                  "editable": "",
                  "dataFormat": "",
                  "dataType": "",
                  "errorCode": "",
                  "dataMinLength": "",
                  "mandatory": "",
                  "minvalue": "",
                  "dataMaxValue": "",
                  "dataSeq": "",
                  "dataGroup": "",
                  "captionDesc": "",
                  "enable": "",
                  "encrypt": "",
                  "captionCode": "",
                  "dataMaxLength": ""
                }
              },
		    "ageMax": {
                "value": null,
                "meta": {
                  "encryptAlgo": "",
                  "dataMinValue": "",
                  "stepped": "",
                  "visible": "",
                  "maxvalue": "",
                  "errorDesc": "",
                  "editable": "",
                  "dataFormat": "",
                  "dataType": "",
                  "errorCode": "",
                  "dataMinLength": "",
                  "mandatory": "",
                  "minvalue": "",
                  "dataMaxValue": "",
                  "dataSeq": "",
                  "dataGroup": "",
                  "captionDesc": "",
                  "enable": "",
                  "encrypt": "",
                  "captionCode": "",
                  "dataMaxLength": ""
                }
              },
		    "ageMin": {
                "value": null,
                "meta": {
                  "encryptAlgo": "",
                  "dataMinValue": "",
                  "stepped": "",
                  "visible": "",
                  "maxvalue": "",
                  "errorDesc": "",
                  "editable": "",
                  "dataFormat": "",
                  "dataType": "",
                  "errorCode": "",
                  "dataMinLength": "",
                  "mandatory": "",
                  "minvalue": "",
                  "dataMaxValue": "",
                  "dataSeq": "",
                  "dataGroup": "",
                  "captionDesc": "",
                  "enable": "",
                  "encrypt": "",
                  "captionCode": "",
                  "dataMaxLength": ""
                }
              },
		    "sicurrency": {
		      "value": null,
		      "meta": {
		        "encryptAlgo": "",
		        "dataMinValue": "",
		        "stepped": "",
		        "visible": "",
		        "maxvalue": "",
		        "errorDesc": "",
		        "editable": "",
		        "dataFormat": "",
		        "dataType": "",
		        "errorCode": "",
		        "dataMinLength": "",
		        "mandatory": "",
		        "minvalue": "",
		        "dataMaxValue": "",
		        "dataSeq": "",
		        "dataGroup": "",
		        "captionDesc": "",
		        "enable": "",
		        "encrypt": "",
		        "captionCode": "",
		        "dataMaxLength": ""
		      }
		    }
		  }
	}
};