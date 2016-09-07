
angular.module('acVnext.services', []).
  factory('acDetailsService', function ($http, $location,toastr) {

      var acDetailsService = {};
    //  var param = $location.search().requestid;
      acDetailsService.getEntityDetails = function (param) {
          return $http({
              method: 'GET',
              url: 'api/SingleRequest/GetEntityDetailsByRequestId?requestid=' + param
          });
      }


      acDetailsService.getAudienceDetails = function (data) {
          return $http({
              method: 'GET',
              url: 'api/Audience/GetAudienceTypesSubTypesByRequestId?requestId=' + data
          });
      }

      acDetailsService.getCountryDetails = function (data) {
          return $http({
              method: 'GET',
              url: 'api/RegionSubsidiaryCountry/GetCountryByCountryId?CountryId=' + data
          });
      }

      acDetailsService.getTenantId = function (data) {
          return $http({
              method: 'GET',
              url: 'api/tenants/GetTenantByUserId?userId=' + data
          });
      }

      acDetailsService.getTenantDetails = function (data) {
          return $http({
              method: 'GET',
              url: 'api/tenants/GetTenantDetailsByTenantId?tenantid=' + data
          });
      }


      acDetailsService.getControlDetails = function () {
          return $http({
              method: 'GET',
              url: 'api/review/GetControlDetails'
          });
      }



      acDetailsService.getRecommendation = function () {
          return $http({
              method: 'GET',
              url: 'api/review/GetRecommendation'
          });
      }

      acDetailsService.submitReview = function (param, id, statusId) {
          fnOpenSpinner();
         
            $http.put('api/review/'+id,param).success(function (data) {

                fnCloseSpinner();
          if (statusId == 3) {
              toastr.success('', 'Review submitted successfully');

              window.location.reload();
          }
          else {
              toastr.success('', 'Review saved successfully');
          }
            }).error(function (data) {
          fnCloseSpinner();
          toastr.error('', 'Error occured. Please contact support team.');

      });

      }

   acDetailsService.changeTier = function (param) {
          fnOpenSpinner();
          $http.put('api/Workflow/UpdateWorkflowInstanceConditionTier', param).success(function (data) {
              fnCloseSpinner();
              toastr.success('', 'Tier has been changed successfully');
              window.location.reload();
            }).error(function (data) {fnCloseSpinner();
            toastr.error('', 'Error occured. Please contact support team.');
           });
      }

      acDetailsService.getSteps = function (param) {
          return $http({
              method: 'GET',
              url: 'api/Workflow/GetWorkflowStepOrderedDetails?requestid=' + param

          });
      }

      acDetailsService.GetCurrentTier = function (param) {
         return $http({
              method: 'GET',
              url: 'api/Workflow/GetWorkflowInstanceConditionTier?requestId=' + param
          });
      }

      acDetailsService.getEvidence = function (param) {
          return $http({
              method: 'GET',
              url: 'api/evidence/GetByRequestId/' + param

          });
      }

      acDetailsService.postReportAttachment = function (param) {
         // fnOpenSpinner();
         // console.log(reportArray);
          return $http({
                  url: 'api/evidence/AddAttachment',
                  method: "POST",
                  data: param
              })
              //.then(function (response) {
              //    // success
              //    console.log('response', response);
              //},
              //function (response) { // optional
              //    // failed
              //});
          
          //$http.post('api/evidence/AddAttachment', param).success(function (data) {
          //    console.log(data);
          //    var newReport = {
          //        Name: data.Name,
          //        DateTimeCreated: data.DateTimeCreated,
          //        Description: data.Description
          //    }
          //    reportArray.push(newReport);
          //    console.log(reportArray);
          //    fileObject = null;
          //    //fnCloseSpinner();
          //    toastr.success('', 'File uploaded');

              
          //}).error(function (data) {
          //  //  fnCloseSpinner();
          //    toastr.error('', 'Error occured. Please contact support team.');

          //});
      }

      acDetailsService.getReports = function (RequestId) {
          return $http({
              method: 'GET',
              url: 'api/evidence/GetReportsByRequestId/' + RequestId

          });
      }
      acDetailsService.retrigger = function (RequestId,stepId) {
          return $http({
              method: 'POST',
              url: 'api/Workflow/ReTriggerStep?requestId=' + RequestId + '&reTriggerStepId='+stepId

          });
      }

      return acDetailsService;
  });