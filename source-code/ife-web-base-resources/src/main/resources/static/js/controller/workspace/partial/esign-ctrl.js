/**
 * Created by mle29 on 12/7/2017.
 */
"use strict";
esignCtrl.$inject = ["$scope", "$state", "$stateParams", "$log", "salecaseCoreService"];
function esignCtrl($scope, $state, $stateParams, $log, salecaseCoreService) {
    (function () {
        $log.info("eSignature callback for: /" + $stateParams.caseId + "/" + $stateParams.pdfId);
        /**
         * Post-eSign flow
         * 1. Request DMS to save the Signed PDF
         * 2. Redirect user to case detail screen
         */
        var url = new URL(window.location.href);
        var sdwebResult = url.searchParams.get("sdweb_result");
        if (sdwebResult === "success") {
            salecaseCoreService.retrieveSignedPdf($stateParams.caseId, $stateParams.pdfId).then(function (status) {
                $state.go("root.list.detail", {
                    docType: "case",
                    productName: "rul",
                    businessType: "life",
                    userRole: "AG",
                    docId: $stateParams.caseId
                });
            });
        } else {
            $state.go("root.list.detail", {
                docType: "case",
                productName: "rul",
                businessType: "life",
                userRole: "AG",
                docId: $stateParams.caseId
            });
        }
        // url.searchParams.delete("sdweb_docid");
        // url.searchParams.delete("sdweb_lang");
        // url.searchParams.delete("sdweb_result");
        // url.searchParams.delete("sdweb_ts");
        // url.searchParams.delete("sdweb_dmsid");

    })();
}