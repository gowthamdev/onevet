vettingApp.controller('onBoardingController', function ($scope, $http, onBoardingService, toastr) {
    $scope.tenants = [];
    $scope.tenantAdmins = [];
    $scope.scenarios = [];
    $scope.audienceTypes = [];
    $scope.audienceSubTypes = [];
    $scope.tenantAudienceTypes = [];
    $scope.tenantAudienceSubTypes = [];
    $scope.backupTenantAudienceTypes = [];
    $scope.backupTenantAudienceSubTypes = [];
    $scope.audienceType = '';
    $scope.audienceSubType = '';
    $scope.selectAudience = false;
    $scope.canAddAdmins = false;
    $scope.canAddAudience = false;
    $scope.updateInProgress = false;
    $scope.showAllSenarios = false;
    $scope.showSaveAndCancel = false;
    $scope.showAudiencePanel = false;
    $scope.showAddTenantAdminPanel = false;
    $scope.editInProgress = false;
    $scope.selectedScenarios = {
        'ids': {}
    };

    var buttonClassName = "button-scenario-after-selection";
    $scope.createTenant = false;
    $scope.TenantName = '';
    $scope.selectedTenantName = '';
    $scope.UserId = "";
    $scope.hideDeleteUser = true;

    $scope.loadTenants = function () {
        //fnOpenSpinner();
        onBoardingService.getTenants({}).then(function (response) {
            $scope.tenants = response.data;
            //fnCloseSpinner();
        }, function (error) {
            fnCloseSpinner();
            toastr.error('error while fetching Tenants');
        });
    };

    $scope.checkTenant = function () {
        if (!$scope.TenantUser || $scope.TenantUser.trim().length === 0) {
            $scope.TenantRequired = true;
        } else {
            $scope.TenantRequired = false;
        }
    };
    $scope.loadSenarios = function () {
        //fnOpenSpinner();
        onBoardingService.getAllSenarios({}).then(function (response) {
            $scope.senarios = response.data;
            fnCloseSpinner();
        }, function (error) {
            fnCloseSpinner();
            toastr.error('error while fetching senarios');
        });
    };
    $scope.showAddTenantPanel = function (TenantId) {
        $scope.editInProgress = true;
        //$("#addTenantPanel").show();
        $scope.createTenant = true;
        $scope.TenantName = null;
        $scope.errorMessage = false;
        $('#TenantName').removeClass('error');
    };
    $scope.cancelTenant = function () {
       // $("#addTenantPanel").hide();
        //$("#addTenantPanel").css('border-color','black');
        $scope.createTenant = false;
        $scope.editInProgress = false;
        $scope.TenantName = null;
        $scope.errorMessage = false;
    };
    $scope.tenantNameValidation = function () {
        if ($scope.TenantName != undefined && $scope.TenantName != '') {
            $scope.TenantDisabled = false;
            $scope.errorMessage = false;
        }

        else {
            $scope.TenantDisabled = true;
            $scope.errorMessage = true;
        }
    }
  
    $scope.editTenant = function (TenantId, TenantName, $event) {
        $scope.editInProgress = true;
        $scope.showSaveAndCancel = false;
        if ($scope.updateInProgress === true) {
            return false;
        }
        if($scope.TenantName !== TenantName){
            $scope.getTenantDetails(TenantId, TenantName, $event);
        }
        $scope.TenantName = TenantName;
        $scope.updateInProgress = true;
        $scope.TenantNameBeforeEdit = TenantName;
       // $scope.error = false;
        $("#displayTenantPanel" + TenantId).hide();
        $("#editTenantPanel" + TenantId).show();
    };

    $scope.showTenantEditPanel = function (TenantId) {
        $("#editTenant" + TenantId).show();
        $("#deleteTenant" + TenantId).show();
    };

    $scope.hideTenantEditPanel = function (TenantId) {
        $("#editTenant" + TenantId).hide();
        $("#deleteTenant" + TenantId).hide();
    }

    $scope.closeTenantEdit = function (TenantId, tenantName) {
        $scope.TenantName = tenantName;
        $scope.updateInProgress = false;
        $scope.editInProgress = false;
        $scope.TenantName = $scope.TenantNameBeforeEdit;
        $('#t' + TenantId).val($scope.TenantNameBeforeEdit).removeClass('error');
        $("#editTenantPanel" + TenantId).hide();
        $("#displayTenantPanel" + TenantId).show();
        angular.forEach($scope.tenants, function (item, ind) {
            if (item.TenantName == TenantName) {
                TenantName = $scope.TenantNameBeforeEdit;
                $scope.tenant[ind].TenantName = $scope.TenantNameBeforeEdit;
            }
        });
    };
    $scope.cancelAudience = function () {
        $scope.selectAudience = false;
        $scope.audienceType = [];
        $scope.audienceSubType = [];
    };
    $scope.showAudiencePanel = function (event) {
        if ($scope.canAddAudience === true) {
            $scope.selectAudience = true;
            var justAudiIds = [];
            var justAudiSubIds = [];
            angular.forEach($scope.tenantAudienceTypes, function (type) {
                justAudiIds.push(type.AudienceTypeId);
            });
            angular.forEach($scope.tenantAudienceSubTypes, function (subType) {
                justAudiSubIds.push(subType.AudienceSubTypeId);
            });
            if (justAudiIds.length > 0) {
                $('#audienceType').multipleSelect('setSelects', justAudiIds);
            }
            if (justAudiSubIds.length > 0) {
                $('#audienceSubType').multipleSelect('setSelects', justAudiSubIds);
            }
           // $scope.TenantUser = null;
        }
    };
    $scope.confirmDeleteTenant = function (TenantId) {
        fnOpenSpinner();
        var inputParams = {
            'id': $scope.TenantId
        };

        onBoardingService.deleteTenant(inputParams).then(function (response) {
            $scope.closeTenantEdit();
            var oldTenants = $scope.tenants;
            $scope.tenantAdmins = [];
            $scope.tenantAudienceTypes = [];
            $scope.tenantAudienceSubTypes = [];
            // $scope.selection.ids = {};
            $scope.selectedScenarios = {
                'ids': {}
            };
            angular.forEach(oldTenants, function (value, index) {
                if (value.TenantId == $scope.TenantId) {
                    $scope.tenants.splice(index, 1);
                  //  dialogDeleteTenant.close();
                     fnCloseSpinner();
                    toastr.success('', 'The Tenant deleted successfully.');
                }
            });
        }, function (error) {
             fnCloseSpinner();
            toastr.error('', 'error while deleting tenant');
        });
    };
    $scope.deleteTenant = function (TenantId) {
        var dialogDeleteTenant;
        dialogDeleteTenant = $("#dialogDeleteTenant").data('dialog');
        $scope.TenantId = TenantId;
        dialogDeleteTenant.open();
        $("#dialogDeleteTenant").find(".pageDeleteConfirm").on('click', function () {
            dialogDeleteTenant.close();
            $scope.confirmDeleteTenant(TenantId);
        });
        $("#dialogDeleteTenant").find(".modalCancel").on('click', function () {
            dialogDeleteTenant.close();
            return false;
        }); 
    };
    $scope.deleteTenantCancel = function () {
        var dialogDeleteTenant;
        dialogDeleteTenant = $("#dialogDeleteTenant").data('dialog');

        dialogDeleteTenant.close();
    }
    $scope.showUsersAndPermissions = function (TenantId) {
        $(".list-tab").removeClass("active");
        $("#groupList" + TenantId).addClass("active");
    };
    $scope.isNameExists = function () {
        var exists = $scope.tenants.find(function (item) {
            return item.TenantName === $scope.TenantName;
        });
        return exists;
    };

    $scope.addTenant = function () {
        fnOpenSpinner();
        var isDuplicate = $scope.isNameExists();
        if (isDuplicate) {
            fnCloseSpinner();
            toastr.error('Name Already Exists.');
            return false;
        }
        var inputParams = {
            'TenantId': null,
            'TenantName': $scope.TenantName,
            'IsDeleted': false,
            'DateTimeCreated': null,
            'DateTimeChanged': null
        }
        onBoardingService.addTenant(inputParams).then(function (response) {
            $scope.tenants.splice(0, 0, response.data);
            $scope.createTenant = false;
           // getTenantDetails($scope.TenantName);
            toastr.success('Tenant added');
            fnCloseSpinner();
        }, function (error) {
            $scope.createTenant = false;
            fnCloseSpinner();
            toastr.error('Error occured while adding a tenant');
        });
    };
    $scope.updateTenant = function (tenant, $event) {
        if (tenant.TenantName == undefined || tenant.TenantName == '') {
            return;
        }
        fnOpenSpinner();
        var inputParams = {
            "TenantId": tenant.TenantId,
            "TenantName": tenant.TenantName,
            "CreatedBy": "gow",
            "ModifedBy": "gow",
            "DateTimeCreated": "2016-07-28T11:48:13.878Z",
            "DateTimeModified": "2016-07-28T11:48:13.878Z"
        };
        onBoardingService.updateTenant(inputParams).then(function (response) {
            $scope.tenants.push(response.data);
            $scope.closeTenantEdit(tenant.TenantId);
            $scope.TenantName = tenant.TenantName;
            $scope.TenantId = tenant.TenantId;
            fnCloseSpinner();
            $scope.editInProgress = false;
        }, function (error) {
            $scope.createTenant = false;
            fnCloseSpinner();
            toastr.error('Error occured while updating a tenant');
        });
    };

    /*Tenant Admin*/
    $scope.showAddTenantUserPanel = function () {
        $scope.createTenantUser = true;
        $scope.TenantUserName = null;
        $scope.errorMessage_User = false;
    };
    $scope.cancelTenantUser = function () {
        $scope.createTenantUser = false;
        $scope.errorMessage_User = false;
        $scope.TenantUserName = null;
    };
    $scope.adminEmailValidation = function () {
        if ($scope.TenantUser != undefined && $scope.TenantUser != '') {
            $scope.tenantUserDisabled = false;
            $scope.errorMessage_User = false;
        }

        else {
            $scope.tenantUserDisabled = true;
            $scope.errorMessage_User = true;
        }
    }
    $scope.getTenantDetails = function (TenantId, TenantName, event) {
        // check if already an item is with the blue background color.
      //  $scope.TenantId = TenantId;
        var items = $("#tenantList").find(".list-tab");
        $scope.showAllSenarios = true;
        $scope.showSaveAndCancel = true;
       // $scope.showAddTenantAdminPanel = true;
       // $scope.createTenantUser = true;
        $scope.selectAudience = false;
        $scope.selectedTenantName = TenantName;
        $scope.tenantAudienceTypes = [];
        $scope.tenantAudienceSubTypes = [];
        $scope.selectedScenarios = {
            'ids': {}
        };
        if (event) {
            event.preventDefault();
            angular.forEach(items, function (item, index) {
                $(item).css("background-color", "white");
            });
            $($(event.currentTarget).closest('.list-tab')).css("background-color", "#e5f2fb");
        }

        fnOpenSpinner();
        $("#users").attr("style", "display: block!important");

        onBoardingService.getTenantbyTenantDetails({ TenantId: TenantId }).then(function (response) {
           $scope.TenantId = response.data.Tenant.TenantId;
            fnCloseSpinner();
            $scope.tenantAdmins = response.data.TenantUsers;
            $scope.scenarios = response.data["Scenarios"];
            if ($scope.scenarios.length > 0) {
                angular.forEach($scope.scenarios, function (item) {
                    var id = item.ScenarioId;
                    $scope.selectedScenarios.ids[id] = true;
                });
            }
            var audienceTypes = response.data["TenantAudienceTypes"];
            var audienceSubTypes = response.data["TenantAudienceTypeSubTypes"];

            if (audienceTypes.length > 0 && $scope.audienceTypes.length > 0) {
                angular.forEach(audienceTypes, function (item) {
                    $scope.tenantAudienceTypes = $scope.tenantAudienceTypes.concat($.grep($scope.audienceTypes, function (e) { return e.AudienceTypeId == item.AudienceTypeId; }));
                });
            }
            if (audienceSubTypes.length > 0 && $scope.allSubTypes.length > 0) {
                angular.forEach(audienceSubTypes, function (item) {
                    $scope.tenantAudienceSubTypes = $scope.tenantAudienceSubTypes.concat($.grep($scope.allSubTypes, function (e) { return e.AudienceSubTypeId == item.AudienceSubTypeId; }));
                });
               // $('#audienceSubType').multipleSelect('setSelects', audienceSubTypes);
               //$('#audienceType').multipleSelect('setSelects', audienceTypes);
            }

            //$scope.tenantAudienceTypes = response.data["TenantAudienceTypes"];
            //$scope.tenantAudienceSubTypes = response.data["TenantAudienceTypeSubTypes"];

            $scope.audienceType = $scope.tenantAudienceTypes.length > 0 ? $scope.tenantAudienceTypes[0].AudienceTypeId : '';
            $scope.audienceSubType = $scope.tenantAudienceSubTypes.length > 0 ? $scope.tenantAudienceSubTypes[0].AudienceSubTypeId : '';
            $scope.backupTenantAudienceTypes = response.data["TenantAudienceTypes"];
            $scope.backupTenantAudienceSubTypes = response.data["TenantAudienceTypeSubTypes"];

        }, function (error) {
            fnCloseSpinner();
            toastr.error('Error occured while loading tenant details');
        });
        $scope.canAddAdmins = true;
        $scope.canAddAudience = true;

    };
    $scope.showAddTenantAdminPanel = function (TenantId) {
        if ($scope.canAddAdmins === true) {
            $scope.createTenantUser = true;
            $scope.TenantUser = null;
            $('#TenantUser').removeClass('error');  
        }
    };

    $scope.addAdmin = function (userId) {
        if ($scope.TenantId !== null) {
            var dataParams = {
                TenantUserId: null,
                TenantId: $scope.TenantId,
                UserId: userId,
                CreatedBy: "GOW",
                ModifiedBy: "GOW",
                TenantUserEmail: $scope.TenantUser,
                DateTimeCreated: "2016-08-01T22:25:37.784Z",
                DateTimeModified: "2016-08-01T22:25:37.784Z"

            }
            onBoardingService.addTenantUser(dataParams).then(function (response) {
                fnCloseSpinner();
                toastr.success('admin added to tenant');
                $scope.createTenantUser = false;
                $scope.getTenantDetails($scope.TenantId,$scope.TenantName);
            }, function (error) {
                fnCloseSpinner();
                toastr.error('Error occured while adding admin');
            });
        } else {
            toastr.error('Tenant required');
        }
    };

    $scope.createAndAddAdmin = function () {
        var dataParams1 = {
            TenantUserId: null,
            UserId: null,
            dateTimeChanged: null,
            dateTimeCreated: null,
            email: $scope.TenantUser,
            tenantId: $scope.TenantId
        }

        onBoardingService.createUser(dataParams1).then(function (response) {
            // User created successfully. Now get the  user details.
            onBoardingService.getUserbyEmail({ email: $scope.TenantUser }).then(function (response) {
                $scope.addAdmin(response.UserId);
                fnCloseSpinner();
            }, function (error) {
                fnCloseSpinner();
                toastr.error("Error while getting user by email.");
            });
        }, function (error) {
            fnCloseSpinner();
            toastr.error("Error while creating the user.");
        });
    };

    $scope.addTenantUser = function () {
        showDialog("#spinnerDialog");
        onBoardingService.getUserByEmail({ email: $scope.TenantUser }).then(function (response) {
           // console.log(response.data);
            if (response === null) {
                $scope.createAndAddAdmin();
            } else {
                $scope.addAdmin(response.data.UserId);
            }
        }, function (error) {
            fnCloseSpinner();
            toastr.error("Error while getting user by email.");
        });

    };
    $scope.showUserButtons = function (id) {
        $('#dUser' + id).show();
    };
    $scope.hideUserButtons = function (id) {
        $('#dUser' + id).hide();
    };
    $scope.confirmDeleteTenantAdmin = function (id, email, tuId) {
        fnOpenSpinner();
        var dataParams = {
            TenantUserId: tuId,
            TenantId: $scope.TenantId,
            UserId: id,
            CreatedBy: "GOW",
            ModifiedBy: "GOW",
            TenantUserEmail: email,
            DateTimeCreated: "2016-08-03T11:41:11.864Z",
            DateTimeModified: "2016-08-03T11:41:11.864Z"
        };


        onBoardingService.removeTenantUserMapping(dataParams).then(function (response) {
            var oldTenants = $scope.tenantAdmins;

            angular.forEach(oldTenants, function (value, index) {
                if (value.TenantUserId == tuId) {
                    $scope.tenantAdmins.splice(index, 1);
                    fnCloseSpinner();
                }
            });
            $scope.hideUserButtons(id);
            $scope.initializeProviders;
        }, function (error) {
            fnCloseSpinner();
            toastr.error('Error while deleting the user mapping');
        });
    };
    $scope.removeTenantUser = function (id, email, tuId) {
        var dialogDeleteTenantAdmin;
        dialogDeleteTenantAdmin = $("#dialogDeleteTenantAdmin").data('dialog');
        $scope.TenantUserId = id;
        dialogDeleteTenantAdmin.open();
        $("#dialogDeleteTenantAdmin").find(".pageDeleteConfirm").on('click', function () {
            dialogDeleteTenantAdmin.close();
            $scope.confirmDeleteTenantAdmin(id, email, tuId);
        });
        $("#dialogDeleteTenantAdmin").find(".modalCancel").on('click', function () {
            dialogDeleteTenantAdmin.close();
            return false;
        });
    };

    $scope.setAudienceTypes = function () {
        fnOpenSpinner();
        var aTypes = $('#audienceType').val();
        var selectedTypes = $scope.audienceTypes.filter(function (obj) {
            return aTypes.indexOf(obj.AudienceTypeId) !== -1;
        });
        
        var asTypes = $('#audienceSubType').val();
        var selectedSubTypes = $scope.allSubTypes.filter(function (obj) {
            return asTypes.indexOf(obj.AudienceSubTypeId) !== -1;
        });

        var params = {
            "TenantId": $scope.TenantId,
            "AudienceTypes": selectedTypes,
            "AudienceSubTypes": selectedSubTypes
        };


        onBoardingService.addAudienceTypes(params).then(function (response) {
           // console.log('Audience Saved Successfully');
            fnCloseSpinner();
            $scope.tenantAudienceTypes = [];
            $scope.tenantAudienceSubTypes = [];
            $scope.tenantAudienceTypes = $scope.tenantAudienceTypes.concat(selectedTypes);
            $scope.tenantAudienceSubTypes = $scope.tenantAudienceSubTypes.concat(selectedSubTypes);
            $scope.selectAudience = false;
        }, function (error) {
            fnCloseSpinner();
            toastr.error('Error while adding audience and subtype');
        });

    };

    $scope.saveTenantDetails = function () {
        if($scope.updateInProgress === true){
            toastr.error('Tenant is being update. Can not save the details now.');
            return false;
        }
        if ($scope.tenantAdmins.length === 0) {
            toastr.error('Tenant admin required');
            return false;
        }
        if ($scope.tenantAudienceTypes.length === 0 || $scope.tenantAudienceSubTypes.length === 0) {
            toastr.error('No audience type has been selected');
            return false;
        }
        fnOpenSpinner();
        var aType = $scope.audienceType;
        var asType = $scope.audienceSubType;
        var asTypes = $('#audienceSubType').val();
        var TenantAudienceTypes = $scope.audienceTypes.filter(function (obj) {
            return obj.TenantAudienceTypeId === aType;
        });
        var TenantAudienceSubTypes = $scope.audienceSubTypes.filter(function (obj) {
            //return obj.TenantAudienceSubTypeId === asType;
            return asTypes.indexOf(obj.TenantAudienceSubTypeId) !== -1;
        });
        var scenarioIds = $scope.selectedScenarios.ids;
        var selectedScenarios = $scope.senarios.filter(function (item) {
            return scenarioIds[item.ScenarioId] === true;
        });

        var dataParams = {
            "Tenant": {
                "TenantId": $scope.TenantId,
                "TenantName": $scope.selectedTenantName,
                "CreatedBy": "string",
                "ModifedBy": "string",
                "DateTimeCreated": "2016-08-04T02:42:08.413Z",
                "DateTimeModified": "2016-08-04T02:42:08.413Z"
            },
            "TenantId" : $scope.TenantId,
            "TenantUsers": $scope.tenantAdmins,
            "Scenarios": selectedScenarios,
            "TenantAudienceTypes": $scope.tenantAudienceTypes,
            "TenantAudienceTypeSubTypes": $scope.tenantAudienceSubTypes
        };

        onBoardingService.saveTenantDetails(dataParams).then(function (response) {
            fnCloseSpinner();
            toastr.success("Tenant Details Saved Succesfully");

        }, function (error) {
            fnCloseSpinner();
            toastr.error("Error while saving Tenant Details.");
        });

    };
    $scope.cancelTenantDetails = function () {
       // $scope.getTenantDetails($scope.TenantId);
        $scope.selectedScenarios.ids = {};
        if ($scope.scenarios.length > 0) {
            angular.forEach($scope.scenarios, function (item) {
                var id = item.ScenarioId;
                $scope.selectedScenarios.ids[id] = true;
            });
        };
    };
    function fillSubTypeDropDowns(key, value) {
        $('#audienceSubType').append("<option  value='" + value.AudienceSubTypeId + "'>" + value.AudienceSubTypeName + "</option>");
    };
    function fillAudienceTypeDropDowns(key, value) {
        $('#audienceType').append("<option  value='" + value.AudienceTypeId + "'>" + value.AudienceTypeName + "</option>");
    };
    function fillSubSelectedTypeDropDowns(key, value) {
        $('#audienceSubType').append("<option selected value='" + value.AudienceSubTypeId + "'>" + value.AudienceSubTypeName + "</option>");
    };
    function fillSelectedAudienceTypeDropDowns(key, value) {
        $('#audienceType').append("<option selected value='" + value.AudienceTypeId + "'>" + value.AudienceTypeName + "</option>");
    }

    $scope.fnLoadAudienceSubTypes = function () {
       // $scope.fiscalYear = "";
        var result = $scope.allSubTypes;
        $('#audienceSubType').empty();
        $.each(result, function (key, value) {
            fillSubTypeDropDowns(key, value);
        });

        $('#audienceSubType').multipleSelect({
            width: '100%',
            filter: true,
            onClick: function (view) {
                           var selectedIds = $('#audienceSubType').multipleSelect('getSelects'); // only subTypeids
                            var audienceTypes = [];
                            $scope.allSubTypes.filter(function (item) {
                                // check for selected AudienceTypeId.

                                if (selectedIds.indexOf(item.AudienceSubTypeId) !== -1) {
                                    audienceTypes.push(item.AudienceTypeId);
                                };
                            });
                            //$('#audienceType').empty();
                            $.each(audienceTypes, function (key, value) {
                                //fillSelectedAudienceTypeDropDowns(key, value);
                            });
                            // $('#audienceType').empty();
                            $('#audienceType').multipleSelect('setSelects', audienceTypes);
                            //$('#audienceType').multipleSelect('refresh');
                        },
                        onCheckAll: function (view, selectAll) {
                            var selectedIds = $('#audienceSubType').multipleSelect('getSelects');

                            var selectedSubTypes = [];
                            angular.forEach(selectedIds, function (id) {
                                // get subType using subType id.
                                var currentItem = $scope.allSubTypes.filter(function (item) {
                                    if (item.AudienceSubTypeId === id) {
                                        selectedSubTypes.push(item.AudienceTypeId);
                                    };
                                });
                                $('#audienceType').empty();
                                $.each($scope.audienceTypes, function (key, value) {
                                    fillSelectedAudienceTypeDropDowns(key, value);
                                });
                                // store typeId of the subType.
                                //selectedSubTypes.push(currentItem[0].AudienceTypeId); // contains AudienceTypeId
                            });
                            var audienceTypes = [];
                            $scope.audienceTypes.filter(function (item) {
                                // check for selected AudienceTypeId.
                                if (selectedSubTypes.indexOf(item.AudienceTypeId) !== -1) {
                                    audienceTypes.push(item.AudienceTypeId);
                                }
                            });
                            $('#audienceType').multipleSelect('setSelects', audienceTypes);
                            $('#audienceType').multipleSelect('refresh');
                        },
                        onUncheckAll: function (view) {
                            $('#audienceType').empty();
                            $.each($scope.audienceTypes, function (key, value) {
                                fillAudienceTypeDropDowns(key, value);
                            });
                            $('#audienceType').multipleSelect('uncheckAll');
                        }
                 });
    }
    $scope.fnLoadAudienceTypes = function () {
        var result = $scope.audienceTypes;
        $('#audienceType').empty();
        $.each(result, function (key, value) {
            fillAudienceTypeDropDowns(key, value);
        });

        $('#audienceType').multipleSelect({
            width: '100%',
            filter: true,
            onClick: function (view) {
                var selectedIds = $('#audienceType').multipleSelect('getSelects');
                $scope.audienceSubTypes = [];
                //var id = view.value;
                $scope.audienceSubTypes = $scope.allSubTypes.filter(function (item) {
                    return selectedIds.indexOf(item.AudienceTypeId) !== -1;
                });
                $('#audienceSubType').empty();
                $.each($scope.audienceSubTypes, function (key, value) {
                    fillSubSelectedTypeDropDowns(key, value);
                });
                $('#audienceSubType').multipleSelect('refresh');
            },
            onCheckAll: function (view, selectAll) {
                var selectedIds = $('#audienceType').multipleSelect('getSelects');
                $scope.audienceSubTypes = [];
                //var id = view.value;
                //allSubTypes
                //tenantAudienceSubTypes
                $scope.audienceSubTypes = $scope.allSubTypes.filter(function (item) {
                    return selectedIds.indexOf(item.AudienceTypeId) !== -1;
                });
                $('#audienceSubType').empty();
                $.each($scope.audienceSubTypes, function (key, value) {
                    fillSubSelectedTypeDropDowns(key, value);
                });
                $('#audienceSubType').multipleSelect('refresh');
            },
            onUncheckAll: function () {
                //if (!view) {
                //    return false;
                //}
                $('#audienceSubType').empty();
                $.each($scope.audienceSubTypes, function (key, value) {
                    fillSubTypeDropDowns(key, value);
                });
                $('#audienceSubType').multipleSelect('refresh');
            }
        });
    }
    $scope.loadAllAudience = function () {
        onBoardingService.getAllAudienceTypesAndSubTypes({}).then(function (response) {
            var data = response.data;
            $scope.audienceTypes = data.AudienceTypes;
            $scope.allSubTypes = data.AudienceSubTypes;
            $scope.fnLoadAudienceTypes();
            $scope.fnLoadAudienceSubTypes();
        }, function (error) {
            toastr.error('Error while fetching Audience');
            // console.log("Error while fetching audience types.");
        });
    };
    $scope.initializeProviders = function () {
        fnOpenSpinner();
        $scope.loadTenants();
        $scope.loadAllAudience();
        $scope.loadSenarios();
        //$scope.loadTenantbyTenantDetails();
    };

    $scope.$on('showOnBoarding', function (e) {
        $scope.initializeProviders();
        $scope.createTenantUser = false;
        $scope.selectAudience = false;
        $scope.showSaveAndCancel = false;
        $scope.tenantAdmins = [];
        $scope.tenantAudienceTypes = [];
        $scope.tenantAudienceSubTypes = [];
        $scope.selectedScenarios = {
            'ids': {}
        };
        
    });
});

