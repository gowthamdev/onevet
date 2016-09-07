vettingApp.controller('userRolesController', function ($scope, onBoardingService, commonService, toastr) {
    $scope.roles = [];
    $scope.areas = [];
    $scope.countries = [];
    $scope.RoleAreas = [];
    $scope.CountryId = [];
    $scope.roleUsers = [];
    $scope.RoleCountries = [];
    $scope.roleUsers = [];
    $scope.selection = {
        ids: {}
    };
    $scope.countrySelection = {
        ids: {}
    };
    $scope.ContactName = null;
    $scope.showRoleSaveAndCancel = false;
    $scope.showAreas = false;
    $scope.showCountries = false;
    $scope.showAddContactIcon = false;
    $scope.updateInProgress = false;
    $scope.editInProgress = false;
    $scope.selectedRoleName = '';
    $scope.selectedRoleId = '';
    $scope.config = {
        'getRoles': '/api/RegionSubsidiaryCountry/GetAllRoles',
        'getAllAreas': '/api/RegionSubsidiaryCountry/GetAreaCountries',
        'postRoles': 'api/RegionSubsidiaryCountry/AddRole',
        'getRoleDetails': '/api/RegionSubsidiaryCountry/GetRoleAreaCountryUserDetailsByRoleId',
        'addRoleUser': '/api/RegionSubsidiaryCountry/AddRoleUser',
        'saveRoleDetails': '/api/RegionSubsidiaryCountry/SaveRoleAreaCountry',
        'deleteRole': '/api/RegionSubsidiaryCountry/DeleteRole',
    }

    $scope.loadRoles = function () {
        fnOpenSpinner();
        commonService.loadData('get', $scope.config.getRoles, {}).then(onSuccess, onError);
    };
    $scope.loadAreasAndCountries = function () {
        fnOpenSpinner();
        commonService.loadData('get', $scope.config.getAllAreas, {}).then(function (response) {
            $scope.showAreas = true;
            $scope.areas = response.data;
            $scope.showCountries = false;
            fnCloseSpinner();
        }, onError);
    }
    $scope.areaChange = function () {
        fnOpenSpinner();
        var allAreas = $scope.areas;
        var test = $scope.selection;
        var keys = Object.keys(test['ids']);
        var areaIds = keys.filter(function (key) { return test['ids'][key] === true; });
        var countriesToShow = [];
        //fnOpenSpinner();
        angular.forEach(allAreas, function (areaObj) {
            fnCloseSpinner();
            if (areaIds.indexOf(areaObj.AreaId) !== -1) {
                countriesToShow = countriesToShow.concat(areaObj.Countries);
            }
        });
        if (countriesToShow.length > 0) {
            $scope.showCountries = true;
            //  $scope.showRoleSaveAndCancel = true;
            $scope.countries = countriesToShow;
        } else {
            $scope.showCountries = false;
            $scope.allCountries = false;
            $scope.selectAllCountries();
        }
       
    }

    function onSuccess(response) {
        fnCloseSpinner();
        $scope.roles = response.data;
    }
    function onError(error) {
        fnCloseSpinner();
        toastr.error('Error while getting data');
    }
    $scope.cancelRoleUser = function () {
        $scope.createRoleUser = false;
    }
    $scope.showRolePanel = function (RoleId) {
        // $("#addRolePanel").show();
        $('#RoleName').removeClass('error');
        $scope.editInProgress = true;
        $scope.createRole = true;
        $scope.RoleName = null;
    }
    $scope.cancelRole = function () {
        //$("#addRolePanel").hide();
        $('#RoleName').removeClass('error');
        $scope.createRole = false;
        $scope.editInProgress = false;
        $scope.RoleName = null;
        $scope.errorMessage = false
    }
    $scope.cancelContactName = function () {
        $scope.createContactName = false;
        $scope.showRoleSaveAndCancel = false;
        $scope.ContactName = null;
        $scope.errorMessage = false;
        $('#errMsg').css('display', 'none');
    }
    $scope.RoleNameValidation = function () {
        if ($scope.RoleName != undefined && $scope.RoleName != '') {
            $scope.RoleDisabled = false;
            $scope.errorMessage = false;
        }

        else {
            $scope.RoleDisabled = true;
            $scope.errorMessage = true;
        }
    }
    $scope.ContactNameValidation = function () {
        if ($scope.ContactName != undefined && $scope.ContactName != '') {
            $scope.ContactDisabled = false;
            $scope.errorMessage = false;
        }

        else {
            $scope.ContactDisabled = true;
            $scope.errorMessage = true;
        }
    }
    //$scope.isRoleNameExists = function () {
    //    var roleExists = $scope.roles.find(function (item) {
    //        return item.RoleName === $scope.RoleName;
    //    });

    //    return roleExists;
    //};
    $scope.addRole = function () {
        fnOpenSpinner();
        //var isRoleDuplicate = $scope.isRoleNameExists();
        //if (isRoleDuplicate) {
        //    fnCloseSpinner();
        //    toastr.error('RoleName Already Exists.');
        //    return false;
        //}
        var inputParams = {
            RoleId: null,
            RoleName: $scope.RoleName,
            CreatedDate: "2016-07-28T11:48:13.878Z",
            LastModifiedDate: "2016-07-28T11:48:13.878Z",
            CreatedBy: "Gow",
            ModifiedBy: "Gow"
        }
        
        commonService.sendRequest('post', $scope.config.postRoles, inputParams).then(function (response) {
            //$scope.roles.push(0, 0, response.data);
            fnCloseSpinner();
            $scope.roles.push(response.data);
            $scope.createRole = false;
            // getTenantDetails($scope.RoleId);
            toastr.success('Successfully added role');
        }, function (error) {
            fnCloseSpinner();
            toastr.error('Error while adding role');
            $scope.createRole = false;

        });
    };
    $scope.updateRole = function (role, $event) {

        if (role.RoleName == undefined || role.RoleName == '')
        {
            return;
        }
        fnOpenSpinner();
        var inputParams = {
            'RoleId': role.RoleId,
            'RoleName': role.RoleName,
            'CreatedDate': "2016-07-28T11:48:13.878Z",
            'LastModifiedDate': "2016-07-28T11:48:13.878Z",
            'CreatedBy': null,
            'ModifiedBy': null
        };
        commonService.updateRole(inputParams).then(function (response) {
           // $scope.roles.push(response.data);
            $scope.closeRoleEdit(role.RoleId);
            $scope.editInProgress = false;
            fnCloseSpinner();
            toastr.success("Succesfully updated role");
            $scope.$aaply();
            angular.forEach($scope.roles, function (item, ind) {
                if (item.RoleId == Role.RolId) {
                   // RoleName = $scope.RoleNameBeforeEdit;
                    $scope.roles[ind].RoleName = Role.RoleName;
                }
            });
        }, function (error) {
            $scope.createRole = false;
            fnCloseSpinner();
            toastr.error("error while updating the role");
        });
    };
    $scope.showRoleEditPanel = function (RoleId,RoleName) {
       
        $("#editRole" + RoleId).show();
        $("#deleteRole" + RoleId).show();
    }
    $scope.editRole = function (Role, $event) {
        //if ($scope.updateInProgress === true) {
        //    return false;
        //}
        $scope.editInProgress = true;
        if ($scope.RoleName !== Role.RoleName) {
            $scope.getRoleDetails(Role.RoleId, Role.RoleName, $event);
        }
        $scope.RoleName = Role.RoleName;
        // $scope.editRole = false;
        // $scope.updateInProgress = true;
        $("#displayRolePanel" + Role.RoleId).hide();
        $("#editRolePanel" + Role.RoleId).show();
        $scope.RoleNameBeforeEdit = $scope.RoleName;
    };
    $scope.hideRoleEditPanel = function (RoleId) {
        $("#editRole" + RoleId).hide();
        $("#deleteRole" + RoleId).hide();
    }
    $scope.closeRoleEdit = function (RoleId, RoleName) {
        // $scope.loadRoles();
        $scope.updateInProgress = false;
        $("#editRolePanel" + RoleId).hide();
        $("#displayRolePanel" + RoleId).show();
        //$scope.editInProgress = false;
        $scope.RoleName = $scope.RoleNameBeforeEdit;
        $('#r' + RoleId).val($scope.RoleNameBeforeEdit).removeClass('error');
        $scope.editInProgress = false;
        angular.forEach($scope.roles, function (item,ind)
        {
            if (item.RoleName == RoleName)
            {
                RoleName = $scope.RoleNameBeforeEdit;
                $scope.roles[ind].RoleName = $scope.RoleNameBeforeEdit;
            }
        });
        $scope.RoleNameBeforeEdit = $scope.RoleName;
    };
    $scope.deleteRole = function (RoleId) {
        $scope.roleUsers = [];
        $scope.areas = [];
        $scope.countries = [];
        fnOpenSpinner();
        var inputParams = {
            'id': RoleId
        };
        commonService.loadData('delete', $scope.config.deleteRole, inputParams).then(function (response) {
            $scope.closeRoleEdit();
            fnCloseSpinner();
            var oldTenants = $scope.roles;
            angular.forEach(oldTenants, function (value, index) {
                if (value.RoleId == RoleId) {
                    $scope.roles.splice(index, 1);
                    fnCloseSpinner();
                    toastr.success('Successfully deleted');
                }
            });
        }, function (error) {
            fnCloseSpinner();
            toastr.error('Error while deleting the role');
        });
    }
    //$scope.deleteRole = function (RoleId) {
    //    var dialogDeleteRole;
    //    dialogDeleteRole = $("#dialogDeleteRole").data('dialog');
    //    //$scope.RoleId = RoleId;
    //    dialogDeleteRole.open();
    //    $("#dialogDeleteRole").find(".pageDeleteConfirm").on('click', function () {
    //        dialogDeleteRole.close();
    //        $scope.confirmDeleteRole(RoleId);
    //    });
    //    $("#dialogDeleteRole").find(".modalCancel").on('click', function () {
    //        dialogDeleteRole.close();
    //        return false;
    //    });
    //};
    $scope.showAddContactNamePanel = function () {
        $scope.createContactName = true;
        $scope.showRoleSaveAndCancel = true;
    }
    $scope.getRoleDetails = function (RoleId, RoleName, event) {
        fnOpenSpinner();
        $scope.areas = [];
        $scope.countries = [];
        $scope.loadAreasAndCountries();
        $scope.roleUsers = [];
        $scope.RoleId = RoleId;
        $scope.RoleName = RoleName;
        // check if already an item is with the blue background color.
        var items = $("#roleList").find(".list-tab");
        $scope.selection = {
            ids: {}
        };
        $scope.countrySelection = {
            ids: {}
        };
        if (event) {
            event.preventDefault();
            angular.forEach(items, function (item, index) {
                $(item).css("background-color", "white");
            });
            $($(event.currentTarget).closest('.list-tab')).css("background-color", "#e5f2fb");
        }

        // fnOpenSpinner();
        $("#users").attr("style", "display: block!important");
        var inputParams = { RoleId: $scope.selectedRoleId };
        // fnCloseSpinner();      
    };
   
    $scope.createAndAddContact = function () {
        var dataParams1 = {
            UserId: null,
            dateTimeChanged: null,
            dateTimeCreated: null,
            email: $scope.ContactUser,
            RoleId: $scope.RoleId,
            RoleUserId: null
        }

        onBoardingService.createUser(dataParams1).then(function (response) {
            // User created successfully. Now get the  user details.
            onBoardingService.getContactByEmail({ email: $scope.ContactName }).then(function (response) {
                $scope.addContact(response.UserId);
                fnCloseSpinner();
                toastr.success("Contact created successfully");
            }, function (error) {
                fnCloseSpinner();
                $scope.showRoleSaveAndCancel = true;
                toastr.error("Error while getting user by email.");
            });
        }, function (error) {
            fnCloseSpinner();
            $scope.showRoleSaveAndCancel = true;
            toastr.error("Error while creating the user.");
        });
    };
    $scope.addContactName = function() {
        fnOpenSpinner();
        onBoardingService.getUserByEmail({ email: $scope.ContactName }).then(function (response) {
            console.log(response.data);
            $scope.UserId = response.data.UserId;
            if (response.data == 'null') {
                $scope.createAndAddContact();
                //alert("hello");
            } else {
                var dataParams = {
                    RoleUserId: null,
                    RoleId: $scope.RoleId,
                    UserId: $scope.UserId,
                    Email: $scope.ContactName,
                    CreatedDate: "2016-08-07T08:41:49.735Z",
                    LastModifiedDate: "2016-08-07T08:41:49.735Z",
                    CreatedBy: null,
                    ModifiedBy: null
                };
                commonService.sendRequest('post', $scope.config.addRoleUser, dataParams).then(function (response) {
                    if ($scope.updateInProgress === true) {
                        toastr.error('Role is being update. Can not save the details now.');
                        return false;
                    }
                    fnOpenSpinner();
                    $scope.createContactName = false;
                    //$scope.getRoleDetails($scope.RoleId);
                    $scope.createRoleUser = false;

                    // $scope.UserId = response.data.UserId;
                    //toastr.success('Contact Added succesfully');
                    var areas = $scope.areas.filter(function (item) {
                        return $scope.selection.ids[item.AreaId] === true;
                    });
                    var countries = $scope.countries.filter(function (item) {
                        return $scope.countrySelection.ids[item.CountryId] === true;
                    });
                    var countryIds = [];
                    angular.forEach(countries, function (country) {
                        countryIds.push(country.CountryId)
                    });
                    var inputparams = {
                        "RoleAreaCountryUserId": null,
                        "RoleId": $scope.RoleId,
                        "RoleName": $scope.RoleName,
                        "Areas": areas,
                        "Countries": countries,
                        "UserId": $scope.UserId,
                        "All" : $scope.allCountries,
                        // "UserId": "88197824-26fc-4833-a94a-8d9ca02f9b71",
                        // "UserId": "0adc4807-8f73-4d41-b573-0d769b844468",
                        "CountryIds": countryIds,
                        "CreatedDate": "2016-08-07T08:41:49.528Z",
                        "LastModifiedDate": "2016-08-07T08:41:49.528Z",
                        "CreatedBy": null,
                        "ModifiedBy": null
                    };
                    commonService.sendRequest('post', $scope.config.saveRoleDetails, inputparams).then(function (response) {
                        console.log(response.data);
                        $scope.areas = [];
                        $scope.countries = [];
                        $scope.showAddContactIcon = false;
                        $scope.showAreas = false;
                        $scope.showCountries = false;
                        $(".list-tab").removeAttr("style");
                        fnCloseSpinner();
                        toastr.success('Role details saved succesfully');
                        $scope.createContactName = false;
                        $scope.ContactName = null;
                        $scope.initializeRoles;
                        $scope.allAreas = false;
                        $scope.allCountries = false;
                        // $scope.getRoleDetails();
                    }, function (error) {
                        fnCloseSpinner();
                        toastr.error('Error while saving Role details.');
                    });
                    // $scope.initializeRoles;
                }, function (error) {
                    fnCloseSpinner();
                    toastr.error('Error while creating contact');
                });
                //$scope.addContact(response.data.UserId);
                //$scope.UserId = response.data.UserId;
                // alert("run");
            }
        }, function (error) {
            // fnCloseSpinner();
            toastr.error("Error while getting user by email.");
        });
        $scope.showRoleSaveAndCancel = false;
    }

    $scope.selectAllAreas = function()
    {
        var eles = angular.element(".area")
        if ($scope.allAreas) {
                angular.forEach(eles, function (ele) {
                    if ($(ele).is(':checked') != true) {

                        setTimeout(function () {
                            angular.element(ele).trigger('click');
                        },1000);
                    }
                })
        }
        else { 
            //$scope.createContactName = false;
            //angular.element('.area').trigger('click');
            angular.forEach(eles, function (ele) {

                setTimeout(function () {
                    angular.element(ele).trigger('click');
                }, 1000);

            });
            $scope.createContactName = false;  
        }    
    }
    $scope.selectAllCountries = function () {
        var eles =$(".country").prop('checked', $scope.allCountries);
      
        if ($scope.allCountries) {

           
            //angular.forEach(eles, function (ele) {
            //    if ($(ele).is(':checked') != true) {
            //        setTimeout(function () {
            //            angular.element(ele).trigger('click');
            //        }, 1000);
            //    }
            //});
            angular.forEach($scope.countries, function (country)
            {
                // $scope.countrySelection.ids.push({ country.CountryId })
                var coutnryId= country.CountryId ;
                $scope.countrySelection.ids[coutnryId] = true;
            });
           
       // setTimeout(function () {
          
            $scope.getContactOnRoleAndCountry();
      //  }, 100);
        }
        else {
            //angular.forEach(eles, function (ele) {

            //    setTimeout(function () {
            //        angular.element(ele).trigger('click');
            //    }, 1000);

            //});
            angular.forEach($scope.countries, function (country) {
                // $scope.countrySelection.ids.push({ country.CountryId })
                var coutnryId = country.CountryId;
                $scope.countrySelection.ids[coutnryId] = false;
            });
            $scope.getContactOnRoleAndCountry();
            $scope.createContactName = false;
            $scope.roleUsers = [];
        }
     //   $(eles)
       
    }
    $scope.showRoleUserButtons = function (id) {
        $('#rUser' + id).show();
    };
    $scope.hideRoleUserButtons = function (id) {
        $('#rUser' + id).hide();
    };
    $scope.removeRoleUser = function (id, email) {
        fnOpenSpinner();
        $scope.hideRoleUserButtons(id);
        $scope.roleUsers = [];
        fnCloseSpinner();
    }
    $scope.showUserButtons = function (id) {
        $('#deleteUser' + id).show();
    };
    $scope.hideUserButtons = function (id) {
        $('#deleteUser' + id).hide();
    };
    $scope.getUserOnCountryIfExists = function ()
    {
        //$scope.showRoleSaveAndCancel = true;
        $scope.showAddContactIcon = true;
       
            $scope.getContactOnRoleAndCountry();
            //$scope.roleUsers = [];
        
    }
    $scope.getContactOnRoleAndCountry = function ()
    {
         fnOpenSpinner();
         $scope.showAddContactIcon = false;
         var areastoSend = [];
        var areas = $scope.areas.filter(function (item) {
            if ($scope.selection.ids[item.AreaId] === true)

            { areastoSend.push(item); }
        });
        var countries = $scope.countries.filter(function (item) {
            return $scope.countrySelection.ids[item.CountryId] === true;
        });
      
        var countryIds = [];
        angular.forEach(countries, function (country) {
            countryIds.push(country.CountryId);
        });
        if (countryIds.length > 0) {
            $scope.showAddContactIcon = true;
            $scope.showRoleSaveAndCancel = false;
            $scope.roleUsers = [];
            var inputParam = {
                RoleId: $scope.RoleId,
                Countries: countryIds,
                Areas: areastoSend,
                All :$scope.allCountries == true ? 'Country' : 'None'
            };
            commonService.userByRoleCountry(inputParam).then(function (response) {
                // $scope.roleUsers = [];
                fnCloseSpinner();
                $scope.roleUsers = response.data;
            }, function (error) {
                fnCloseSpinner();
                toastr.error('Error while Contact retrevied');
            });
        } else {
            fnCloseSpinner();
            $scope.roleUsers = '';
            $scope.showRoleSaveAndCancel = false;
            return false;
        }
     //   $scope.showAddContactNamePanel()
    }
    $scope.cancelRoleDetails = function () {

        //$scope.selection.ids = {};
        //if ($scope.RoleAreas.length > 0) {
        //    angular.forEach($scope.RoleAreas, function (item) {
        //        var id = item.AreaId;
        //        $scope.selection.ids.push({ id: true });
        //    });
        //};
        //$scope.countrySelection.ids = {};
        //if ($scope.RoleCountries.length > 0) {
        //    angular.forEach($scope.RoleCountries, function (item) {
        //        var id = item.AreaId;
        //        $scope.countrySelection.ids.push({ id: true });
        //    });
        //};
        //  $scope.roleUsers = [];
        $scope.ContactName = undefined;
        $scope.createContactName = false;
      //  $scope.showAddContactIcon = false;
        $scope.showRoleSaveAndCancel = false;
    }
    $scope.initializeRoles = function () {
        fnOpenSpinner();
        $scope.loadRoles();
    };
    $scope.$on('showRoles', function (e) {
        $scope.initializeRoles();
        // $scope.createRole = false;
        $scope.roleUsers = [];
        $scope.showAreas = false;
        $scope.showCountries = false;
        $scope.selection = {
            ids: {}
        };
        $scope.countrySelection = {
            ids: {}
        };
    });
    //$scope.initializeRoles();
});