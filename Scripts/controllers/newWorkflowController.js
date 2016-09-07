3//var vettingApp = angular.module('acVnext', ['ngRoute', 'mgo-angular-wizard']);

vettingApp.controller("newWorkflowController", function ($scope, $http, $q, $location,$window, $sce, questionnaireService,newWorkflowService) {
    $scope.workflowHeader = "";
    $scope.workflowName = "";
    $scope.invalidTitle = false;
    $scope.isNonEnglishTitle = false;

    $scope.desco = '';
    $scope.invalidDesciption = false;

    $scope.newWorkflowFiscalYear = [];
    $scope.newWorkflowArea = [];
    $scope.newWorkflowCountry = [];
    var param = $location.search().id;
    
    $scope.fnLoadAreaFiscalyearDropdownsOnNewWorkflow = function (selectedFiscalYear, selectedArea, selectedCountries) {
      var myDataPromise = questionnaireService.getData('api/RegionSubsidiaryCountry/GetAreaCountries');
      $scope.regions = "";
      myDataPromise.then(function (result) {
          areaCountry = result;
          $.each(result, function (key, value) {
              fillSalesRegionDropDown(key, value);
          });
          
          $('#area').multipleSelect();
          if (selectedArea.length > 0) {
              $('#area').multipleSelect('setSelects', selectedArea);
              fnGetCountries(null, false);
          }
          if (selectedCountries.length > 0)
              $('#country').multipleSelect('setSelects', selectedCountries);
      });
      $scope.fiscalYear = "";
      myDataPromise = questionnaireService.getData('api/FiscalYear');
      var workflowSpinnerdialog = $('#spinnerDialog').data('dialog');
      workflowSpinnerdialog.open();
      myDataPromise.then(function (result) {
          workflowSpinnerdialog.close();
          $.each(result, function (key, value) {
              fillFiscalYearDropDowns(key, value);
          });
          
          $('#fiscalYear').multipleSelect();        
          if (selectedFiscalYear.length > 0) $('#fiscalYear').multipleSelect('setSelects', selectedFiscalYear);
      });
    }

    $scope.fnInitializeDropdowns = function () {
        var selectAll = true;
        $('#area').multipleSelect(
       {
           width: '100%',
           filter: true,
           onClick: function (view) {
               fnGetCountries(view, false);
           },
           onCheckAll: function (view) {
               fnSelectAllCountries(view, selectAll);
           },
           onUncheckAll: function (view) {
               fnUnSelectAllCountries();
           },
           onBlur: function () {
               $scope.checkArea();
           }
       });
        $('#country').multipleSelect(
        {
            width: '100%',
            filter: true,
            onClick: function (view) {
                fnCheckIfAreaExistForCountry(view);
            },
            onCheckAll: function (view) {
                fnSelectAllAssociatedAreas(view);
            },
            onUncheckAll: function (view) {
                stopLocking = true;
                fnUnSelectAllArea(view, selectAll);
                selectAll = false;
            },
            onBlur: function () {
                $scope.checkCountry();
            }
        });
        $('#fiscalYear').multipleSelect(
        {
            width: '100%',
            filter: true,
            onClick: function (view) {
                fnRemoveErrorClass(view, selectAll);
            },
            onCheckAll: function (view) {
                fnRemoveErrorClass(view, selectAll);
            },
            onBlur: function () {
                $scope.checkFiscalyear();
            }
        });
    };

    if (param) {
        fnOpenSpinner();
        $scope.workflowHeader = "Edit Workflow Configuration";
        newWorkflowService.getGeneralSetings({ workflowId: param }).then(function (response) {
            var result = response.data;
            $scope.workflowName = result.Title;
            $scope.desco = result.Description;
            $scope.fnLoadAreaFiscalyearDropdownsOnNewWorkflow(result.FiscalYears, result.Areas, result.Countries);
            $scope.fnInitializeDropdowns();
        });
    } else {
        $scope.workflowHeader = "New Workflow Configuration";
        $scope.fnLoadAreaFiscalyearDropdownsOnNewWorkflow([], [], []);
        $scope.fnInitializeDropdowns();
    }

    $scope.checkTitle = function () {
        if (!$scope.workflowName || $scope.workflowName.trim().length === 0) {
            $scope.invalidTitle = true;
        } else {
            $scope.invalidTitle = false;
        }
    };

  $scope.changeTitle = function () {
      //var pattern = /^[^-\s][a-zA-Z0-9\s]*$/;
      if (!pattern.test($scope.workflowName)) {
          $scope.isNonEnglishTitle = true;
          //$scope.workflowName = '';
      } else {
          $scope.isNonEnglishTitle = false;
          $scope.invalidTitle = false;
      }
  }

  $scope.checkDescription = function () {
      if (!$scope.desco || $scope.desco.trim().length === 0) {
          $scope.invalidDesciption = true;
      } else {
          $scope.invalidDesciption = false;
      }
  };

  $scope.changeDesc = function () {
      if (!$scope.desco || $scope.desco.trim().length === 0) {
          $scope.invalidDesciption = true;
      } else {
          $scope.invalidDesciption = false;
      }
  }
    
  $scope.checkFiscalyear = function () {
      if ($.trim($('#fiscalYear').val()) === "") {
          $(".fiscal").addClass("error");
          $('#errorFiscalyear').css('display', 'inline-block');
      } else {
          $(".fiscal").removeClass("error");
          $('#errorFiscalyear').css('display', 'none');
    }
  }
  $scope.checkArea = function () {
      if ($.trim($('#fiscalYear').val()) === "") {
          $(".area").addClass("error");
          $('#errorArea').css('display', 'inline-block');
      } else {
          $(".area").removeClass("error");
          $('#errorArea').css('display', 'none');
      }
  }
  $scope.checkCountry = function () {
      if ($.trim($('#fiscalYear').val()) === "") {
          $(".country").addClass("error");
          $('#errorCountry').css('display', 'inline-block');
      } else {
          $(".country").removeClass("error");
          $('#errorCountry').css('display', 'none');
      }
  }
 
  $scope.validateInputs = function () {
      var isValid = true;
      $scope.checkTitle();
      $scope.checkDescription();
      if ($.trim($('#fiscalYear').val()) === "") {
          $(".fiscal").addClass("error");
          $('#errorFiscalyear').css('display', 'inline-block');
          isValid = false;
      }

      if ($.trim($('#area').val()) == "") {
          $(".area").addClass("error");
          $('#errorArea').css('display', 'inline-block');
          isValid = false;
      }

      if ($.trim($('#country').val()) == "") {
          $(".country").addClass("error");
          $('#errorCountry').css('display', 'inline-block');
          isValid = false;
      }

      return isValid && !$scope.invalidTitle && !$scope.invalidDesciption;
  };

  
  $scope.fnRemoveErrorClassss = function (view, selectAll) {
      if (selectAll) {
          $(".fiscal").removeClass("error");
          $('#errorFiscalyear').css('display', 'none');
      }
  };

  $scope.fnRemoveErrorClassss = function (view, selectAll) {
      if (selectAll) {
          $(".area").removeClass("error");
          $('#errorArea').css('display', 'none');
      }
  };

  $scope.fnRemoveErrorClassss = function (view, selectAll) {
      if (selectAll) {
          $(".country").removeClass("error");
          $('#errorCountry').css('display', 'none');
      }
  };

  $scope.goToNext = function () {
      $scope.processRequest().then(function (response) {
          $location.url('/workFlowStep2?newWorkflowId=' + response.data.WorkflowId);
          fnCloseSpinner();
      }, function (error) {
          return false;
     });
      
  }

  $scope.processRequest = function () {
      var canSubmit = $scope.validateInputs();
      if (canSubmit) {
          var years = $('#fiscalYear').val().filter(function (item, i, ar) { return ar.indexOf(item) === i; });
          var areas = $('#area').val().filter(function (item, i, ar) { return ar.indexOf(item) === i; });
          var countries = $('#country').val().filter(function (item, i, ar) { return ar.indexOf(item) === i; });
          var spinner = $('#spinnerDialog').data('dialog');
          spinner.open();

          var param = $location.search().id;
          var data = {

              "TenantId": "433C587E-837E-41D5-B2E0-F2D0658CD6BD",
              "Title": $scope.workflowName,
              "Description": $scope.desco,
              "ProviderId": "00000000-0000-0000-0000-000000000000",
              "IsActive": false,
              "IsPublished": false,
              "FiscalYears": years,
              "Areas": areas,
              "Countries": countries,
              "ModifiedBy": "00000000-0000-0000-0000-000000000000"
          };
          
          if (param) {
              // Update the workflow.
              data.workflowId = param;
              return newWorkflowService.updateGeneralSetings(data).then(function (response) {
                  spinner.close();
                  return response;
              }, function (error) {
                  window.alert("Error occured while updating Workflow. Please contact support team.");
              });
          } else {
              // Create new workflow.
              return newWorkflowService.saveGeneralSetings(data).then(function (response) {
                  spinner.close();
                  return response;
              }, function (error) {
                  window.alert("Error occured while creating Workflow. Please contact support team.");
              });
          }
      } else {
          return ($q.reject("test"));
      }
  }
  $scope.redirectWithoutSave = function () {
      $location.url('/workflowLanding');
  }
  $scope.saveWorkFlowAndRediect = function () {
      $scope.processRequest().then(function (response) {
          console.log("Success");
          $location.url('/workflowLanding');
      });
  }
  
});
