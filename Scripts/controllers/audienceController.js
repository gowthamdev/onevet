vettingApp.controller('audienceController', function ($scope, $http, audienceService, toastr) {
    $scope.AudienceTypeName = '';
    $scope.editInProgress = false;
    $scope.loadAudienceType = function () {
        fnOpenSpinner();
        audienceService.getType({}).then(function (response) {
            $scope.types = response.data;
            fnCloseSpinner();
        }, function (error) {
            fnCloseSpinner();
            toastr.error('Error while fetching Audience');
        });
    };
    $scope.addAudienceType = function () {
        fnOpenSpinner();
        debugger;
        var inputParams = {
              'AudienceTypeId': null,
              'AudienceTypeName': $scope.AudienceTypeName,
              'CreatedBy': null,
              'ModifiedBy': null,
              'DateTimeCreated': null,
              'DateTimeModified': null
        }
        audienceService.addType(inputParams).then(function (response) {
            $scope.types.splice(0, 0, response.data);
            $scope.createType = false;
            //$scope.loadAudienceType($scope.AudienceTypeName)
            fnCloseSpinner();
            toastr.success('Audience type added');
        }, function (error) {
            $scope.createType = false;
            fnCloseSpinner();
            toastr.error("Error while adding the Audience type");
        });
    };
    $scope.showTypeEditPanel = function (AudienceTypeId) {
        $("#editType" + AudienceTypeId).show();
        $("#deleteType" + AudienceTypeId).show();
    };

    $scope.hideTypeEditPanel = function (AudienceTypeId) {
        $("#editType" + AudienceTypeId).hide();
        $("#deleteType" + AudienceTypeId).hide();
    }

    $scope.editType = function (AudienceTypeId, AudienceTypeName, $event) {
        $scope.editInProgress = true;
        if ($scope.AudienceTypeName !== AudienceTypeName) {
            $scope.loadSubTypeByTypeId(AudienceTypeId, AudienceTypeName, $event);
        }
        $scope.AudienceTypeName = AudienceTypeName;
        $("#displayTypePanel" + AudienceTypeId).hide();
        $("#editTypePanel" + AudienceTypeId).show();
    };
    $scope.closeTypeEdit = function (AudienceTypeId, AudienceTypeName) {
        // $scope.loadRoles();
        $scope.updateInProgress = false;
        $("#editTypePanel" + AudienceTypeId).hide();
        $("#displayTypePanel" + AudienceTypeId).show();
        $scope.editInProgress = false;
        $scope.AudienceTypeName = AudienceTypeName;
    };
    $scope.updateType = function (type, $event) {
        if (type.AudienceTypeName == undefined || type.AudienceTypeName == '') {
            return;
        }
        fnOpenSpinner();
        var inputParams = {
            'AudienceTypeId': type.AudienceTypeId,
            'AudienceTypeName': type.AudienceTypeName,
            'CreatedBy': null,
            'ModifiedBy': null,
            'DateTimeCreated': "2016-08-25T21:56:43.245Z",
            'DateTimeModified': "2016-08-25T21:56:43.245Z"
        };
        audienceService.updateAudienceType(inputParams).then(function (response) {
            $scope.types.push(response.data);
           // $scope.closeRoleEdit(role.RoleId);
            $scope.editInProgress = false;
            fnCloseSpinner();
            toastr.success("Succesfully updated audienceType");
        }, function (error) {
            $scope.createType = false;
            fnCloseSpinner();
            toastr.error("error while updating the audienceType");
        });
    }
    $scope.deleteType = function (AudienceTypeId) {
        fnOpenSpinner();
        var inputParams = {
            'id': AudienceTypeId
        };

        audienceService.deleteType(inputParams).then(function (response) {
            // $scope.closeTenantEdit();
            fnCloseSpinner();
            var oldType = $scope.types;
           // $scope.types = [];
            angular.forEach(oldType, function (value, index) {
                if (value.AudienceTypeId == AudienceTypeId) {
                    $scope.types.splice(index, 1);
                    toastr.success('', 'The Type deleted successfully.');
                }
            });
        }, function (error) {
            fnCloseSpinner();
            toastr.error('', 'Error while deleting type');
        });
    };
    //$scope.deleteType = function (AudienceTypeId) {
    //    var dialogDeleteType;
    //    dialogDeleteType = $("#dialogDeleteType").data('dialog');
    //   // $scope.AudienceTypeId = AudienceTypeId;
    //    dialogDeleteType.open();
    //    $("#dialogDeleteType").find(".pageDeleteConfirm").on('click', function () {
    //        dialogDeleteType.close();
    //        $scope.confirmDeleteType(AudienceTypeId);
    //    });
    //    $("#dialogDeleteType").find(".modalCancel").on('click', function () {
    //        dialogDeleteType.close();
    //        return false;
    //    });
    //};
    $scope.showAddAudiencTypePanel = function (AudienceTypeId) {
        $scope.editInProgress = true;
        //$("#addTypePanel").show();
        $scope.createType = true;
        $scope.AudienceTypeName = null;
        $('#TypeName').removeClass('error');
    };
    $scope.cancelAudienceType = function () {
        //$("#addTypePanel").hide();
        $('#TypeName').removeClass('error');
        $scope.editInProgress = false;
        $scope.createType = false;
        $scope.AudienceTypeName = null;
        $scope.errorMessage = false;
    };
    /*SubType*/
    $scope.showAddSubTypePannel = function () {
        $("#addSubTypePanel").show();
        $scope.createSubType = true;
        $scope.AudienceSubTypeName = null;
        $scope.errorMessage = false;
        $('#SubTypeName').removeClass('error');
    }
    $scope.showSubTypeEditPanel = function (AudienceSubTypeId) {
        $("#editSubType" + AudienceSubTypeId).show();
        $("#deleteSubType" + AudienceSubTypeId).show();
    };

    $scope.hideSubTypeEditPanel = function (AudienceSubTypeId) {
        $("#editSubType" + AudienceSubTypeId).hide();
        $("#deleteSubType" + AudienceSubTypeId).hide();
    }
    $scope.cancelAudienceSubType = function () {
        $("#addSubTypePanel").hide();
        //$("#addTenantPanel").css('border-color','black');
        $scope.AudienceSubTypeName = null;
        $scope.errorMessage = false;
    }
    $scope.addAudienceSubType = function () {
        fnOpenSpinner();
        debugger;
        var inputParams = {
            'AudienceSubTypeId': null,
            'AudienceTypeId': $scope.AudienceTypeId,
            'AudienceSubTypeName': AudienceSubTypeName,
            'AudienceTypeName': $scope.AudienceTypeName,
            'CreatedBy': null,
            'ModifiedBy': null,
            'DateTimeCreated': null,
            'DateTimeModified': null
        }
        audienceService.addSubType(inputParams).then(function (response) {
            $scope.types.splice(0, 0, response.data);
            $scope.createType = false;
            //$scope.loadAudienceType($scope.AudienceTypeName)
            fnCloseSpinner();
            toastr.success('Audience type added');
        }, function (error) {
            $scope.createType = false;
            fnCloseSpinner();
            toastr.error("Error while adding the Audience type");
        });
    }
    //$scope.TypeNameValidation = function () {
    //    if ($scope.TypeName != undefined && $scope.TypeName != '') {
    //        $scope.TypeDisabled = false;
    //        $scope.errorMessage = false;
    //    }

    //    else {
    //        $scope.TypeDisabled = true;
    //        $scope.errorMessage = true;
    //    }
    //}
    ///*Sub Type based on Type Id*/
    $scope.loadSubTypeByTypeId = function (AudienceTypeId,AudienceTypeName, event) {
        var items = $("#typeList").find(".list-tab");
        if (event) {
            event.preventDefault();
            angular.forEach(items, function (item, index) {
                $(item).css("background-color", "white");
            });
            $($(event.currentTarget).closest('.list-tab')).css("background-color", "#e5f2fb");
        }

        fnOpenSpinner();
       // $("#users").attr("style", "display: block!important");

        audienceService.getSubTypeByTypeId({ AudienceTypeId: AudienceTypeId }).then(function (response) {
            $scope.subtypes = response.data;
            fnCloseSpinner();
        }, function (error) {
            fnCloseSpinner();
            toastr.error('error while fetching Tenants');
        });
    }
    $scope.initializeProviders = function () {
        //fnOpenSpinner();
        $scope.loadAudienceType();
       // $scope.loadSubTypeByTypeId = [];
       // $scope.loadSubTypeByTypeId();
    };

    $scope.$on('showAudience', function (e) {
        $scope.initializeProviders();
    });
});