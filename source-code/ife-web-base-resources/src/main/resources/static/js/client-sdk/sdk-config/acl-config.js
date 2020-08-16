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
var AclConfig = {
	"USER_ROLES": {		
		"AG": {
			"name": "AG",
			"group": ["AGENT"],
			"distinctRoles": [ "AG"]
		},
		"SA": {
			"name": "SA",
			"group": "SYSTEM_ADMIN",
			"distinctRoles": [ "SA" ]
		},
		"PR": {
			"name": "PR",
			"group": "PROSPECT",
			"distinctRoles": [ "PR" ]
		},
		"PO": {
			"name": "PO",
			"group": "POLICY HOLDER",
			"distinctRoles": [ "PO" ]
		},
		"UW": {
			"name": "UW",
			"group": "Underwriting",
			"distinctRoles": [ "UW" ]
		},
		"MR": {
			"name": "MR",
			"group": "Managerreview",
			"distinctRoles": [ "MR" ]
		}
	},
	"USER_GROUPS": {		
		"AGENT": {
			"name": "AGENT",			
			"roles": [ "AG"]
		},
		"SYSTEM_ADMIN": {
			"name": "SYSTEM_ADMIN",			
			"roles": [ "SA" ]
		},
		"PROSPECT": {
			"name": "PROSPECT",			
			"roles": [ "PR"]
		},
		"CONTACT": {
			"name": "CONTACT",			
			"roles": [ "AG"]
		},
		"PAYMENT": {
			"name": "PAYMENT",			
			"roles": [ "AG","PR","PO" ]
		},
		"TRANSACTION": {
			"name": "TRANSACTION",			
			"roles": [ "AG","PR","PO" ]
		},
		"FNA": {
			"name": "FNA",			
			"roles": [ "AG"]
		},
		"CLIENT": {
			"name": "CLIENT",			
			"roles": [ "AG" ]
		},
		"POLICY": {
			"name": "POLICY",			
			"roles": [ "AG","PO" ]
		},
		"UNDERWRITING": {
			"name": "UNDERWRITING",			
			"roles": [ "UW" ]
		},
		"MANAGERREVIEW": {
			"name": "MANAGERREVIEW",			
			"roles": [ "MR" ]
		},
		"QUOTATION": {
			"name": "QUOTATION",			
			"roles": [ "AG" ]
		}
	},
	"APP_CONFIGS": {
		"AGENT": {
		    "name": "AGENT",
		    "siteName": "ife-web-base-agent",
		    "icon": "ico-businesscases",
		    "cssClass": "box-business-case-new",
		    "permission": "app_agent",
		    "roles": [ "AG","PO"]
		  },
		  "SYSTEM_ADMIN": {
			"name": "SYSTEM_ADMIN",
			"siteName": "ife-web-base-system-admin",
			"icon": "ico-systemadmin",
			"cssClass": "box-super-user-new",
			"permission": "app_system_admin",
			"roles": [ "SA" ]
		  },
		  "CONTACT": {
			"name": "CONTACT",
			"siteName": "ife-web-base-contact",
			"icon": "ico-contacts",
			"cssClass": "box-contact-new",
			"permission": "app_contact",
			"roles": [ "AG" ]
		  },
		  "PAYMENT": {
			"name": "PAYMENT",
			"siteName": "ife-web-base-payment",
			"icon": "ico-payments",
			"cssClass": "box-payment-new",
			"permission": "app_payment",
			"roles": [ "AG","PR","PO" ]
		 },
		 "FNA": {
			"name": "FNA",
			"siteName": "ife-web-base-fna",
			"icon": "ico-financialneedsanalysis",
			"cssClass": "box-fna-new",
			"permission": "app_fna",
			"roles": [ "AG" ]
		  },
		  "CLIENT": {
			"name": "CLIENT",
			"siteName": "ife-web-base-client",
			"icon": "ico-clients",
			"cssClass": "box-contact-new",
			"permission": "app_client",
			"roles": [ "AG" ]
		  },
		 "POLICY": {
			"name": "POLICY",
			"siteName": "ife-web-base-policy",
			"icon": "ico-policies",
			"cssClass": "box-fna-new",
			"permission": "app_policy",
			"roles": [ "AG","PO" ]
		  },
		  "UNDERWRITING": {
		    "name": "UNDERWRITING",
		    "siteName": "ife-web-base-underwriting",
		    "icon": "ico-underwritingreviews",
		    "cssClass": "box-business-case-new",
		    "permission": "app_underwriting",
		    "roles": [ "UW"]
		  },
		  "MANAGERREVIEW": {
			"name": "MANAGERREVIEW",
			"siteName": "ife-web-base-managerreview",
			"icon": "ico-managerreviews",
			"cssClass": "box-fna-new",
			"permission": "app_managerreview",
			"roles": [ "MR" ]
		  },
		  "QUOTATION": {
				"name": "QUOTATION",
				"siteName": "ife-web-base-quotation",
				"icon": "ico-policies",
				"cssClass": "box-fna-new",
				"permission": "app_quotation",
				"roles": [ "AG" ]
			  }
	},
	"DASHBOARDS": {
		"case_management": {
			"link": "case_management",
			"classname": "box-business-case",
			"iconName": "ico-businesscases",
			"permission": "dashboard_case_management"
		},
		"user": {
			"link": "user",
			"classname": "box-super-user",
			"iconName": "ico-clients",
			"permission": "dashboard_user"
		},
		"contact_management": {
			"link": "contact_management",
			"classname": "box-contact",
			"iconName": "ico-contacts",
			"permission": "dashboard_contact_management"
		},
		"payment_management": {
			"link": "payment_management",
			"classname": "box-payment",
			"iconName": "ico-payments",
			"permission": "dashboard_payment_management"
		},
		"client_management": {
			"link": "client_management",
			"classname": "box-contact",
			"iconName": "ico-clients",
			"permission": "dashboard_client_management"
		},
		"policy_management": {
			"link": "policy_management",
			"classname": "box-fna",
			"iconName": "ico-policies",
			"permission": "dashboard_policy_management"
		},
		"underwriting_management": {
			"link": "underwriting_management",
			"classname": "box-fna",
			"iconName": "ico-underwritingreviews",
			"permission": "dashboard_underwriting_management"
		},
		"managerreview_management": {
			"link": "managerreview_management",
			"classname": "box-fna",
			"iconName": "ico-managerreviews",
			"permission": "dashboard_managerreview_management"
		}
	}
};