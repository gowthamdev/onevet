vettingApp.controller('scenarioController', function ($scope, questionnaireService, onBoardingService, commonService, acDetailsService, toastr, $http, $location) {

    $scope.any1selected = false;
    $scope.activeBusiness = false;
    $scope.audienceTypes = [];
    $scope.audienceSubTypes = [];
    $scope.tenantAudienceTypes = [];
    $scope.tenantAudienceSubTypes = [];
    $scope.tenantAudienceSubTypes1 = [];
    $scope.allSubTypes = [];
    $scope.audienceType = '';
    $scope.audienceSubType = '';
    $scope.entityScenarios = [];
    $scope.all = true;
    $scope.isDeniedSelected = true;
    $scope.isAntiCorruptionSelected = true;
    $scope.showSelectEntity = false;
    $scope.showSelectScenario = false;
    $scope.showSingleRequest = false;
    //$scope.shouldShowNotificationSection = true;
    $scope.currentTenantId = '';
    $scope.justScenarios = [];
    $scope.mappings = {};
    $scope.entityIds = []; // to hold unique entity ids
    $scope.entities = {
        name: ''
    };

    $scope.showDetails = {};

    $scope.Scenarios = [];
    $scope.scenarioNames = {
        'DeniedPartyCheckValidation': 'Denied parties check',
        'AntiCorruptionValidations': 'Anti-Corruption check'
    };
    $scope.justEntities = [];

    $scope.someData = {};

    $scope.mycountry = '';
   // var userId = $("#userObjectId").val();
    var userId = "0ADC4807-8F73-4D41-B573-0D769B844468";
    var tenantId = '';
    var tenantName = '';

    $scope.disableDenied = function () {
        // individual not selected
        // business not selected 
        // not all selected
        return $scope.someData.Individual === false && $scope.someData.Business === false && $scope.all === false;
    };

    $scope.disableAntiCur = function () {
        // individual not selected
        // business not selected 
        // not all selected
        return $scope.someData.Business === false && $scope.all === false;
    };
    $scope.disableOthers = function () {
        // individual not selected
        // business not selected 
        // not all selected
        return $scope.all === false;
    };

    $scope.test = function (radioId) {
        $scope.isDeniedSelected = false;
        $scope.isAntiCorruptionSelected = false;
        $scope.Scenarios = $scope.mappings[radioId];
        $('#' + $scope.Scenarios[0].text + '-img').show();
        $scope.DeniedPartyCheckValidationCheck = true;
        $scope.scenariosCheck.forEach(function(item, index){
            item.enabled = false;
            $scope.showDetails[item.name] = false;
            $scope.isRequestInformation = true;
        });
    }
    $scope.scenariosCheck = [];
    var buttonClassName = "button-scenario-after-selection";
    var input = $('.companyPhone');
    for (var i = 0; i < input.length; i++) {
        input[i].setAttribute('size', input[i].getAttribute('maxlength'));
    }
    hideAllNewRequestFormFields($scope);
    resetAllValidations($scope);
    $scope.showPersonalAddressValidation = function () {
        return ($scope.singleRequetForm.streetAddress.$error.required && $scope.singleRequetForm.streetAddress.$dirty) ||
        ($scope.singleRequetForm.city.$error.required && $scope.singleRequetForm.city.$dirty);
    }
    $('#businessSponser').keyup(function () {
        fnValidateBuisnessSopnser($scope);
    });
    $scope.model = {
        country: "",
        companyCountry: "",
        fiscalYearSelected: ""
    }
    fnPopulateCountryDropDowns($scope, questionnaireService);
    $scope.SetPersonalCountry = function () {
        //alert($scope.mycountry);
        fnResetPersonalCountryDropdownValidators();
    };
    $scope.SetSelectCompanyCountry = function () {
        fnResetCompanyCountryDropdownValidators();
    }
    $scope.SetSelectFiscalYearCountry = function () {
        fnResetFiscalYearDropDownValidators();
    }
    fnPopulateFiscalYearDropDowns($scope, questionnaireService);

    $scope.scenarioCheck = function (scenario) {
        var spanId = "#" + scenario;
        var imagId = '#' + scenario + '-img';
        var before = scenario + "-before-selection";
        var after = scenario + "-after-selection";
        var status = $scope.canShow(scenario);

        var currentItem = $scope.scenariosCheck.filter(function (item) {
            return item.name === scenario;
        });
        currentItem[0].enabled = !status;
        $scope.showDetails[scenario] = currentItem[0].enabled;
        toggleCSSClasses(buttonClassName, before, after, spanId, imagId);
        
        var enbaledItems = $scope.scenariosCheck.filter(function (item) {
            return item.enabled === true;
        });
        $scope.isRequestInformation = enbaledItems.length === 0;
        //toggleRequestInfoFields($scope);
        $scope.countries = $scope.countries;
    }
    $scope.canShow = function (sText) {

        var currentItem = $scope.scenariosCheck.filter(function (item) {
            return item.name === sText;
        });
        return currentItem ? currentItem[0].enabled : false;
    };
    $scope.saveSingleRequest = function () {
            fnOpenSpinner();
            var canProceed = true;
            var currentItem = $scope.justEntities.filter(function (item) {
                return item.id == $scope.entities.name;
            });
            if (currentItem[0].text === 'Individual') {
                canProceed = fnValidatePersonalInfo($scope);
                if (canProceed) {
                    canProceed = fnValidatePersonalAddress();
                    if (!canProceed) {
                        fnCloseSpinner();
                        toastr.error('Invalid Address');
                        return false;
                    }
                } else {
                    fnCloseSpinner();
                    toastr.error("Invalid Info.");
                    return false;
                }

            } else {
                canProceed = fnValidateCompany($scope);
                if (canProceed) {
                    canProceed = fnValidateFiscalYear();
                    if (!canProceed) {
                        fnCloseSpinner();
                        toastr.error("enter fiscal year");
                    }
                } else {
                    fnCloseSpinner();
                    toastr.error("enter valid company info");
                    return false;
                }

            }
            var aTypes = $('#audienceType').val();
            var selectedTypes = $scope.audienceTypes.filter(function (obj) {
                return aTypes.indexOf(obj.AudienceTypeId) !== -1;
            });

            var asTypes = $('#audienceSubType').val();
            var selectedSubTypes = $scope.allSubTypes.filter(function (obj) {
                return asTypes.indexOf(obj.AudienceSubTypeId) !== -1;
            });
            var scenarioParam = CreateDataParamforSenarion($scope);
            var entityParam = CreateDataParamForEntity($scope);
            var selectedAudTypes = $('#audienceType').multipleSelect('getSelects');
            var selectedAudSubTypes = $('#audienceSubType').multipleSelect('getSelects');
            var audiArray = [];
            angular.forEach(selectedAudTypes, function (typeItem) {
                // iterate through all selected audience types to find respective sub types.
                // typeItem is simply an ID.
                var subArray = [];
                angular.forEach(selectedAudSubTypes, function (subTypeItem) {
                    // iterated through all subtypes. subTypeItem is simple id.
                    // It does not have info about audienceType it belongs to.
                    var subTypeWithAudiType = $scope.allSubTypes.filter(function (item) {
                        // to get to know the audienceType of selected subType, 
                        //find it from allSubTypes.
                        return item.AudienceSubTypeId === subTypeItem;
                    });
                    if (typeItem === subTypeWithAudiType[0].AudienceTypeId) {
                        subArray.push({ "AudienceSubTypeId": subTypeItem });
                    }
                });
                audiArray.push({ "AudienceTypeId": typeItem, "AudienceSubTypes": subArray });
            });
            var fiscalYearId = $scope.model.fiscalYearSelected;
            var singleRequestParam = {
                Scenarios: scenarioParam,
                RequestFields: entityParam,
                FiscalYearId: fiscalYearId,
                CompanyCountryId: $scope.model.companyCountry,
                PersonalCountryId: $scope.model.country,
                AudienceTypes: audiArray,
                //AudienceTypes: selectedAudTypes,
                //AudienceSubTypes:selectedAudSubTypes,
                //Tenantid
                TenantId: $scope.TenantId,
                Source: "Single"
            };
            $http.post('api/SingleRequest', singleRequestParam).success(function (data) {
                fnCloseSpinner();
                toastr.success("New request has been created.");
                $location.url('/requests');
            }).error(function (data) {
                fnCloseSpinner();
                toastr.error("Error occured while creating new request.");
            });
        }
    $scope.cancelSingleRequest = function () {
        resetAllValidations($scope);
        removeCSSClasses(buttonClassName, "div-denied-before-selection", "div-denied-after-selection", '#denied-party-check', '#denied-party-check-img');
        removeCSSClasses(buttonClassName, "div-business-before-selection", "div-business-after-selection", '#business', '#business-img');
        removeCSSClasses(buttonClassName, "div-academic-before-selection", "div-academic-after-selection", '#academic', '#academic-img');
        removeCSSClasses(buttonClassName, "div-anti-corruption-before-selection", "div-anti-corruption-after-selection", '#anti-corruption', '#anti-corruption-img');
        removeCSSClasses(buttonClassName, "div-email-before-selection", "div-email-after-selection", '#email', '#email-img');
        removeCSSClasses(buttonClassName, "div-employee-before-selection", "div-employee-after-selection", '#employee', '#employee-img');
        hideAllNewRequestFormFields($scope);
    }
    $scope.shouldShowNotificationSection = function () {
        return $scope.isFirstName || $scope.isLastName || $scope.isEmail || $scope.isPersonalAddress || $scope.isCompanyName || $scope.isCompanyAddress || $scope.isCompanyPhone ||
            $scope.isCompanyWebsite || $scope.isContactName || $scope.isContactNumber || $scope.isBusinessSponsor;
    }
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
       var result = $scope.tenantAudienceSubTypes;
        //var result = $scope.allSubTypes;
       //$('#audienceSubType').empty();
        $.each(result, function (key, value) {
            fillSubTypeDropDowns(key, value);
        });
        var selectAll = true;
        $('#audienceSubType').multipleSelect({
            width: '100%',
            filter: true,
            onClick: function (view) {
                var selectedIds = $('#audienceSubType').multipleSelect('getSelects'); // only subTypeids
                var selectedSubTypes = [];
                angular.forEach(selectedIds, function (id) {
                    // get subType using subType id.
                    $scope.allSubTypes.filter(function (item) {
                        if (item.AudienceSubTypeId === id) {
                            selectedSubTypes.push(item.AudienceSubTypeId);
                        }
                    });
                    // store typeId of the subType.
                    //selectedSubTypes.push(currentItem.AudienceTypeId); // contains AudienceTypeId
                });
                var audienceTypes = [];
                $scope.tenantAudienceTypes.filter(function (item) {
                    // check for selected AudienceTypeId.
                    if (selectedSubTypes.indexOf(item.AudienceTypeId) !== -1 ) {
                        audienceTypes.push(item.AudienceTypeId);
                    }
                });
                //$('#audienceType').empty();
                //$.each($scope.audienceTypes, function (key, value) {
                //    fillSelectedAudienceTypeDropDowns(key, value);
                //});
                // $('#audienceType').empty();
               // $('#audienceType').multipleSelect('setSelects', audienceTypes);   
                $('#audienceType').multipleSelect('refresh');
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
                    // store typeId of the subType.
                    //selectedSubTypes.push(currentItem[0].AudienceTypeId); // contains AudienceTypeId
                });
                var audienceTypes = [];
                $scope.tenantAudienceTypes.filter(function (item) {
                    // check for selected AudienceTypeId.
                    if (selectedSubTypes.indexOf(item.AudienceTypeId) !== -1) {
                        audienceTypes.push(item.AudienceTypeId);
                    }
                });
                $('#audienceType').multipleSelect('setSelects', audienceTypes);
                $('#audienceType').multipleSelect('refresh');
            },
            onUncheckAll: function (view) {
               
                $('#audienceType').multipleSelect('uncheckAll');
            }
        });
    }
    $scope.fnLoadAudienceTypes = function () {
        var result = $scope.tenantAudienceTypes;
       // var result = $scope.audienceTypes;
       // $('#audienceType').empty();
        $.each(result, function (key, value) {
            fillAudienceTypeDropDowns(key, value);
        });
        var selectAll = true;
        $('#audienceType').multipleSelect({
            width: '100%',
            filter: true,
            onClick: function (view) {
                var selectedIds = $('#audienceType').multipleSelect('getSelects');
                $scope.audienceSubTypes = [];
                //var id = view.value;
                //allSubTypes
                //tenantAudienceSubTypes
                $scope.audienceSubTypes = $scope.tenantAudienceSubTypes1.filter(function (item) {
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
                $scope.audienceSubTypes = $scope.tenantAudienceSubTypes1.filter(function (item) {
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
    };
    $scope.loadAllAudience = function () {
        commonService.loadData('get', '/api/Tenants/GetAllAudienceTypesSubTypes', {}).then(function (response) {
           // console.log(response);
            var data = response.data;
            $scope.audienceTypes = data.AudienceTypes;
            $scope.allSubTypes = data.AudienceSubTypes;
            //for loading all audience type and subtypes
            //$scope.fnLoadAudienceTypes();
            //$scope.fnLoadAudienceSubTypes();
        }, function (error) {
            toastr.error('Error while getting the entity scenarios.');
        });
    };
    //$scope.$on('$locationChangeStart', function (event, next, current) {
    //    if ($scope.isRequestInformation === false) {
    //        if (confirm('Are you sure to leave this page?')) {
    //            return true;
    //        } else {
    //            event.preventDefault();
    //            return false;
    //        }
    //    }
    //});
    $scope.getEntityScenarios = function () {
        fnOpenSpinner();
        commonService.loadData('get', 'api/Tenants/GetEntityScenarios', {}).then(function (response) {
            $scope.showSingleRequest = true;
            $scope.showSelectEntity = true;
            $scope.showSelectScenario = true;
            $scope.entityScenarios = response.data;
            // console.log(data);
            var entityIds = [];
            var scenarioIDs = [];
            angular.forEach($scope.entityScenarios, function (item) {
                fnCloseSpinner();
                // Iterat through all entityScenarios
                if (entityIds.indexOf(item.EntityTypeId) === -1) {
                    // Avoid duplicates entries for entities
                    entityIds.push(item.EntityTypeId);
                    $scope.justEntities.push({ id: item.EntityTypeId, text: item.EntityTypeText });
                }
                if (scenarioIDs.indexOf(item.ScenarioId) === -1) {
                    scenarioIDs.push(item.ScenarioId);
                    $scope.scenariosCheck.push({ name: item.ScenarioText, enabled: false });
                    $scope.Scenarios.push({ id: item.ScenarioId, text: item.ScenarioText, eid: item.EntityTypeId, label: $scope.scenarioNames[item.ScenarioText] });
                    $scope.showDetails[item.ScenarioText] = false;
                }
                if (!$scope.mappings[item.EntityTypeId]) {
                    $scope.mappings[item.EntityTypeId] = [];
                }
                // Map all scenarios of an entity type
                $scope.mappings[item.EntityTypeId].push({ id: item.ScenarioId, text: item.ScenarioText, eid: item.EntityTypeId, label: $scope.scenarioNames[item.ScenarioText] });
            });
            // populate all mapping into Scenarios.
            var keys = Object.keys($scope.mappings);
            keys.forEach(function (key) {
                //$scope.Scenarios = $scope.Scenarios.concat($scope.mappings[key]);
            });
        }, function (error) {
            toastr.error('Error while getting the entity scenarios.');
        });
    };
    $scope.getTenantDetails = function () {
        acDetailsService.getTenantId(userId).success(function (response) {
            $scope.currentTenantId = response.TenantId;
            onBoardingService.getTenantbyTenantDetails({ TenantId: "433C587E-837E-41D5-B2E0-F2D0658CD6BD" }).then(function (response) {
                $scope.TenantId = response.data.Tenant.TenantId;
                //fnCloseSpinner();
                $scope.tenantAdmins = response.data.TenantUsers;
                var audienceTypes = response.data["TenantAudienceTypes"];
                var audienceSubTypes = response.data["TenantAudienceTypeSubTypes"];

                if (audienceTypes.length > 0 && $scope.audienceTypes.length > 0) {
                    angular.forEach(audienceTypes, function (item) {
                        // For name purpose, get the required audience from audienceTypes
                        $scope.tenantAudienceTypes = $scope.tenantAudienceTypes.concat($.grep($scope.audienceTypes, function (e) { return e.AudienceTypeId == item.AudienceTypeId; }));
                    });
                }
                if (audienceSubTypes.length > 0 && $scope.allSubTypes.length > 0) {
                    angular.forEach(audienceSubTypes, function (item) {
                        // For name purpose, get the required audienceSubTypes from allSubTypes
                        $scope.tenantAudienceSubTypes1 = $scope.tenantAudienceSubTypes.concat($.grep($scope.allSubTypes, function (e) { return e.AudienceSubTypeId == item.AudienceSubTypeId; }));
                    });

                    $scope.fnLoadAudienceTypes();
                    $scope.fnLoadAudienceSubTypes();
                }

                $scope.audienceType = $scope.tenantAudienceTypes.length > 0 ? $scope.tenantAudienceTypes[0].AudienceTypeId : '';
                $scope.audienceSubType = $scope.tenantAudienceSubTypes.length > 0 ? $scope.tenantAudienceSubTypes[0].AudienceSubTypeId : '';
                $scope.backupTenantAudienceTypes = response.data["TenantAudienceTypes"];
                $scope.backupTenantAudienceSubTypes = response.data["TenantAudienceTypeSubTypes"];

            }, function (error) {
                fnCloseSpinner();
                toastr.error('Error occured while loading tenant details');
            });
        });
    },
    $scope.getEntityScenarios();
    $scope.loadAllAudience();
    $scope.getTenantDetails();
   
});

function CreateDataParamforSenarion($scope) {
    var scenariosToSend = [];
    $scope.scenariosCheck.forEach(function (item) {
        if (item.enabled === true) {
            scenariosToSend.push({ ScenarioText: item.name });
        }
    });
    return scenariosToSend; 
}

function CreateDataParamForEntity($scope) {
    var entityParam = [];

    entityParam.push({
        "RequestFieldText": "FirstName",
        "RequestFieldValue": $scope.model.name
    });
    entityParam.push({
        "RequestFieldText": "LastName",
        "RequestFieldValue": $scope.model.lastName
    });
    entityParam.push({
        "RequestFieldText": "Email",
        "RequestFieldValue": $scope.model.email
    });
    entityParam.push({
        "RequestFieldText": "PersonStreetAddress",
        "RequestFieldValue": $scope.model.streetAddress
    });
    entityParam.push({
        "RequestFieldText": "PersonCity",
        "RequestFieldValue": $scope.model.city
    });
    entityParam.push({
        "RequestFieldText": "PersonState",
        "RequestFieldValue": $scope.model.state
    });
    entityParam.push({
        "RequestFieldText": "PersonZip",
        "RequestFieldValue": $scope.model.zip
    });
    entityParam.push({
        "RequestFieldText": "PersonCountry",
        "RequestFieldValue": $scope.model.country
    });
    entityParam.push({
        "RequestFieldText": "CompanyName",
        "RequestFieldValue": $scope.model.companyName
    });
    //entityParam.push({
    //    "RequestFieldText": "CompanyEnglishName",
    //    "RequestFieldValue": $scope.model.companyEnglishName
    //});
    entityParam.push({
        "RequestFieldText": "CompanyStreetAddress",
        "RequestFieldValue": $scope.model.companyStreetAddress
    });
    entityParam.push({
        "RequestFieldText": "CompanyCity",
        "RequestFieldValue": $scope.model.companyCity
    });
    entityParam.push({
        "RequestFieldText": "CompanyState",
        "RequestFieldValue": $scope.model.companyState
    });
    entityParam.push({
        "RequestFieldText": "CompanyZip",
        "RequestFieldValue": $scope.model.companyZip
    });
    entityParam.push({
        "RequestFieldText": "CompanyCountry",
        "RequestFieldValue": $scope.model.companyCountry
    });
    entityParam.push({
        "RequestFieldText": "CompanyPhone",
        "RequestFieldValue": ($scope.model.countryCode == null || $scope.model.countryCode.trim() == "" ? $scope.model.companyPhone : $scope.model.countryCode + "-" + $scope.model.companyPhone)
    });
    entityParam.push({
        "RequestFieldText": "CompanyWebsite",
        "RequestFieldValue": $scope.model.companyWebsite
    });
    entityParam.push({
        "RequestFieldText": "PersonPhone",
        "RequestFieldValue": ($scope.model.personalCountryCode == null || $scope.model.personalCountryCode.trim() == "" ? $scope.model.personalPhone : $scope.model.personalCountryCode + "-" + $scope.model.personalPhone)
    });
    entityParam.push({
        "RequestFieldText": "BusinessSponsor",
        "RequestFieldValue": $scope.model.businessSponser
    });
    entityParam.push({
        "RequestFieldText": "notify",
        "RequestFieldValue": $scope.model.notifyEmails
    });
    entityParam.push({
        "RequestFieldText": "FiscalYearId",
        "RequestFieldValue": $scope.model.fiscalYearSelected
    });
    return entityParam;
}
var isValid = true;
function fnValidateRequest(scope) {
    isValid = true;
    if (scope.activeBusiness || scope.activeBusinessWithMiniInv || scope.activeAntiCorruption) {
        fnValidateCompany(scope);
        fnValidateFiscalYear();
        if (scope.activeAntiCorruption) {
            if ($.trim($('#businessSponser').val()) === "") {
                $('#businessSponser').removeClass("valid").addClass("error");
                $('#errorBuisinessSponser').css('display', 'inline-block');
                isValid = false;
            }
        }
        if ($('#select2-selectCompanyCountry-container')[0].title == "All" || $('#select2-selectCompanyCountry-container')[0].title == '') {
            $("#companyCountry").removeClass("valid").addClass("error");
            $('#errorCompnayAddress').css('display', 'inline-block');
        }
        if ($('#select2-selectCountry-container')[0].title == 'All' || $('#select2-selectCountry-container')[0].title == '')
            $("#personalCountry").removeClass("valid").addClass('error');
        $('#errorAddress').css('display', 'inline-block');
    }

    if (scope.activeEmail || scope.activeEmployee) {
        fnValidatePersonalInfo(scope);

        if (scope.activeEmployee) {
            fnValidateFiscalYear();
            fnValidateCompany(scope);
            if (scope.activeEmployee) {
                if ($.trim($('#companyWebsite').val().toUpperCase()) !== "")
                    fnVerifyWebsite();
                if ($.trim($('#companyWebsite').val().toUpperCase()) === "") {
                    $('#companyWebsite').removeClass("valid").addClass("error");
                    $('#errorRequiredWebsite').css('display', 'inline-block');
                    isValid = false;
                }
            }
        }
        fnValidateFiscalYear();
    }

    if (scope.activeAcademic) {
        fnValidateCompany(scope);
        if ($.trim($('#companyWebsite').val().toUpperCase()) === "") {
            $('#errorRequiredWebsite').css('display', 'inline-block');
            $('#errorWebsite').css('display', 'inline-block');
            isValid = false;
        } else
            fnVerifyWebsite();
        fnValidateFiscalYear();
    }
    if (scope.activeDeniedPartyCheck) {
        fnValidatePersonalInfo(scope);
        // fnValidateCompany(scope);
        // fnValidatePersonalAddress();
        //fnValidateFiscalYear();
    }
    if (scope.activeDeniedPartyCheck && scope.activeAntiCorruption) {
        fnValidatePersonalInfo(scope);
        fnValidateCompany(scope);
        fnValidatePersonalAddress();
        fnValidateFiscalYear();
    }
    // fnValidateCompanyPhoneNumber();
    fnValidatePersonalPhoneNumber();
    return isValid;
}


function fnValidateFiscalYear() {
    var isValid = true;
    if ($.trim($('#select2-selectFiscalYear-container')[0].textContent) === "") {
        $('#fiscalYear').removeClass("valid").addClass("error");
        $('#errorFiscalyear').css('display', 'inline-block');
        isValid = false;
    }
    return isValid;
}