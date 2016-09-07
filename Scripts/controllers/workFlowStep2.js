function show_Dialog(id) {
    var wfDialog = $(id).data('dialog');
    wfDialog.open();
}
vettingApp.controller('workFlowStep2', function ($scope, $http, $location, toastr, $sce) {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    var idToDelete = '', indexsel = -1;
    
    fnOpenSpinner();
    
    $scope.type = [];
    
    $scope.numericFreq = false;
    
    
    $scope.$watch('WF.WFFrequency', function (newvalue, oldvalue) {
        if ($scope.WF.WFFrequency != undefined) {
            if (isNaN($scope.WF.WFFrequency) == true) {
                $("#WFFrequency").addClass("error_Border");
                $scope.numericFreq = true;
            }
            else {
                $("#WFFrequency").removeClass("error_Border");
                $scope.numericFreq = false;
            }
        }
    });

    
    $scope.$watch('WF.WFDays', function (newvalue, oldvalue) {
        if ($scope.WF.WFFrequency != undefined) {
            if (isNaN($scope.WF.WFDays) == true) {
                $("#WFDays").addClass("error_Border");
                $scope.numericFreq = true;
            }
            else {
                $("#WFDays").removeClass("error_Border");
                $scope.numericFreq = false;
            }
        }
    });


    $scope.formTitle = "New step";
    var selectedQuestionnaire = '';
    $http.get('api/Workflow/GetConditionTypes').success(function (tier) {
        $scope.tierData = tier.aaData;
        $http.get('api/Questionnaire/GetQuestionnairesByTenantId?tenantId=FB030F50-4204-4883-849F-1C0022EF6925').success(function (data) {
            $scope.questionnaire = data;
   var availableQuestionnaires =[];
    angular.forEach($scope.questionnaire, function (value, key) {
        availableQuestionnaires.push(value.QuestionnaireName);
        })

    $(document).on("focus.autocomplete", ".inputSearchQuestionnaire", function () {
        $(this).autocomplete({
            source: availableQuestionnaires,
            minLength : 3,
            delay: 0,
            select: function (event, ui) {
                selectedQuestionnaire = ui.item;

            }, response: function (event, ui) {



                if (ui.content.length === 0) {
                    $("#results").text("No results found");
                } else {
                    $("#results").empty();
                }
            }
        })

        $(this).autocomplete("search");
        });
        
        $http.get('api/Workflow/GetWorkflowStepTypes').success(function (data) {
            $scope.type = data.aaData;
            
            angular.forEach($scope.type, function (val, key) {
                if (val.Name == "Automation Condition Evaluation") {
                    $scope.Econdition = val;

                } else if (val.Name == "Manual Condition Evaluation") {
                    $scope.MEcondition = val;

                }
            })

            $http.get('api/Workflow/GetWorkflowStepTree?workflowId=' + $location.search().newWorkflowId).success(function (aaData) {
                fnCloseSpinner();
                if (aaData.length > 0) {
                    $("#submitWorkflow").removeClass("disablePage");
                    angular.forEach(aaData, function (value, key) {
                        var WFL = {};
                        WFL.id = value.StepId;
                        WFL.WFType = value.StepType;
                        WFL.WFTitle = value.Title;
                        WFL.WFRolesGeoTxt = value.RoleName ? value.RoleName : "";
                        if (value.StepType == "Automation Condition Evaluation" || value.StepType == "Manual Condition Evaluation") {

                            var conditionTier1 = value.Title + " [Condition (" + value.ConditionName + ")]";
                            $scope.conditionSteps.push({ Name: conditionTier1, Id: value.StepId });
                            $scope.conditionStepsVal = $scope.conditionSteps.length;
                            WFL.WFConditionName = value.ConditionName;
                        } else {
                            if (value.StepType == "Questionnaire") {
                                $scope.steps.push({ Name: value.Title, Id: value.StepId });
                                $scope.stepsVal = $scope.steps.length;
                            }
                        }
                        if (value.ConditionValue !== "") {
                            WFL.conditionChecked = true;

                            WFL.conditionValue = "Condition: " + value.ConditionValue; 

                        }
                        var formDetailsLoad = angular.copy(WFL)
                        $scope.addStepData.push(formDetailsLoad);

                    });

                }
                else {
                    $("#submitWorkflow").addClass("disablePage");
                }
            }).error(function () {
                fnCloseSpinner();

                toastr.error('', 'Error occured. Please contact support team.');

            });



        }).error(function () {
            fnCloseSpinner();

            toastr.error('', 'Error occured. Please contact support team.');

        });
    }).error(function () {
        fnCloseSpinner();

        toastr.error('', 'Error occured. Please contact support team.');

    });
        
    }).error(function () {
        fnCloseSpinner();

        toastr.error('', 'Error occured. Please contact support team.');

    });
    $scope.publishWorkflow = function () {
        var stepidArr = [];
        angular.forEach($scope.addStepData, function (value, key) {

            stepidArr.push(value.id);


        })
        var obj = {
            StepId: stepidArr
        }
        fnOpenSpinner();
        $http.put('api/Workflow/UpdateWorkflowStepSequence', obj).success(function (data) {
            $http.put('api/Workflow/UpdateWorkflowIsPublishedFlag?Id=' + $location.search().newWorkflowId + '&flagStatus=true').success(function (data) {
                fnCloseSpinner();
                toastr.success('', 'Your workflow is now published and active');

                $location.url('/workflowLanding');
                document.body.scrollTop = document.documentElement.scrollTop = 0;

            }).error(function () {
                fnCloseSpinner();

                toastr.error('', 'Error occured. Please contact support team.');

            });

        }).error(function () {
            fnCloseSpinner();

            toastr.error('', 'Error occured. Please contact support team.');

        });

    }



    $scope.goToPrevious = function () {

        var stepidArr = [];
        angular.forEach($scope.addStepData, function (value, key) {

            stepidArr.push(value.id);


        })
        var obj = { StepId: stepidArr }
        fnOpenSpinner();
        $http.put('api/Workflow/UpdateWorkflowStepSequence', obj).success(function (data) {
            fnCloseSpinner();

            $location.url('/newWorkflow?id=' + $location.search().newWorkflowId);


        }).error(function () {
            fnCloseSpinner();

            toastr.error('', 'Error occured. Please contact support team.');

        });







    }



    







    $scope.cancelWorkflow = function () {
        $location.url('/workflowLanding');

    }
    $scope.selectedIndex = -1;
    $scope.stepsDisabled = false;
    $scope.showForm = false;
    $scope.submitted = false;
    $scope.WF = {};
    $scope.addStepData = [];
    $scope.count = 0;
    $scope.steps = [];
    $scope.stepsVal = 0;
    $scope.conditionSteps = [];
    $scope.conditionStepsVal = 0;
    $scope.condition = [{ "name": "Tier 1", "id": 1 }, { "name": "Tier 2", "id": 2 }, { "name": "Tier 3", "id": 3 }];
    $scope.condValue = {
        selected: {}
    };
    var stepTree =

[
 {
     "StepId": "f1abf932-0e50-e611-80c3-0003ff4668a2",
     "StepType": "3rd Party Report",
     "Title": "qu",
     "RoleName": "Area VPs",
     "ConditionValue": ""
 },

 {

     "StepId": "7d8e3c3d-0e50-e611-80c3-0003ff4668a2",
     "StepType": "Automation Condition Evaluation",
     "Title": "con1",
     "RoleName": "",
     "ConditionValue": ""
 },
{

    "StepId": "32c0ce53-0e50-e611-80c3-0003ff4668a2",
    "StepType": "Choice",
    "Title": "cho",
    "RoleName": "Sub controllers",
    "ConditionValue": ["Tier2", "Tier3"]
}

]

    $scope.tierChange = function (val) {
        if (val == "N/A") {
            $scope.condValue = {
                selected: { 1: "", 2: "", 3: "" }
            };
        } else {
            $scope.condValue.selected["4"] = "";


        }
    }
    $scope.addStepStart = function () {
        document.body.scrollTop = document.documentElement.scrollTop = 0;
        $scope.showCustom = true;
        $scope.stepsDisabled = true;
        $scope.conditionStepsVal = $scope.count > 0 ? $scope.count : $scope.conditionStepsVal;
        if ($scope.addStepData.length > 0) {
          /* if ($scope.type.length < 8) {
               // $scope.type["7"] = $scope.Econdition;
               $scope.type.splice(6, 0, $scope.Econdition);
               //  $scope.type["8"] = $scope.MEcondition;
                $scope.type.splice(8, 0, $scope.MEcondition);
           }*/
            $scope.flag = false;
            $scope.MEFlag = false;
            angular.forEach($scope.addStepData, function (value, key) {
                if (value.WFType == "Questionnaire") {
                    $scope.flag = true;
                    if ($scope.type[6].Id !== 7) {
                        $scope.type.splice(6, 0, $scope.Econdition);
                    }
                }
            });
            if (!$scope.flag) {
                angular.forEach($scope.type, function (value, key) {
                    if (value.Name == "Automation Condition Evaluation") {
                        $scope.Econdition = value;
                        $scope.type.splice(key, 1);
                    }
                });

            }
            angular.forEach($scope.type, function (value, key) {
                if (value.Name == "Manual Condition Evaluation") {
                    $scope.MEFlag = true;
                }
            });
            if (!$scope.MEFlag) {
                $scope.type.push($scope.MEcondition)
            }

        } else {
            angular.forEach($scope.type, function (value, key) {
                if (value.Name == "Automation Condition Evaluation") {
                    $scope.Econdition = value;
                    $scope.type.splice(key, 1);
                } else if (value.Name == "Manual Condition Evaluation") {
                    $scope.MEcondition = value;
                    $scope.type.splice(key, 1);
                }

            });

        }
        $scope.showForm = true;
    };

    $scope.geoSpecific = [{ "Name": "LCA Area Leads", "Id": "CF030F51-4204-4883-849F-1C0022EF6925" }, { "Name": "Area controllers", "Id": "AF030F50-4204-4883-849F-1C0032EF6925" }, { "Name": "Sub controllers", "Id": "GF030F50-4204-4883-849F-1C0022EW6925" }, { "Name": "Area VPs", "Id": "MF030F50-4204-4883-849F-1C0022EF6865" }, { "Name": "Country managers", "Id": "KF030F50-4204-4883-849F-1C0258EF6925" }];
 


    $scope.deleteStepConfirm = function (id) {
        fnOpenSpinner();
        id = idToDelete;
        var reloadPage = false;
        angular.forEach($scope.addStepData, function (value, key) {
            if (value.id == id) {
                if (value.WFType == "Automation Condition Evaluation" || value.WFType == "Manual Condition Evaluation") {
                    reloadPage = true;
                }
            } });
        $http.put('api/Workflow/DeleteWorkflowStep?guidId=' + id).success(function (data) {
            var dialog;
            dialog = $("#dialogDeleteStep").data('dialog');
            dialog.close();
            fnCloseSpinner();
            var title = $scope.addStepData[indexsel].id;
            if ($scope.addStepData[indexsel].WFType == 'Automation Condition Evaluation') {
                angular.forEach($scope.conditionSteps, function (value, key) {
                    if (value.Id == title) {
                        $scope.conditionSteps.splice(key, 1);
                    }
                });
            } else {
                angular.forEach($scope.steps, function (value, key) {
                    if (value.Id == title) {
                        $scope.steps.splice(key, 1);
                    }
                });
        }


            $scope.addStepData.splice(indexsel, 1);
            if ($scope.addStepData.length > 0) {
                $("#submitWorkflow").removeClass("disablePage");
            }
            else {
                $("#submitWorkflow").addClass("disablePage");
            }


            //start
            $http.get('api/Workflow/GetWorkflowStepTree?workflowId=' + $location.search().newWorkflowId).success(function (aaData) {
                $scope.addStepData = [];
                $scope.conditionSteps = [];
                $scope.steps = [];
                $scope.conditionStepsVal = 0;
                if (aaData.length > 0) {
                    $("#submitWorkflow").removeClass("disablePage");
                    angular.forEach(aaData, function (value, key) {
                        var WFL = {};
                        WFL.id = value.StepId;
                        WFL.WFType = value.StepType;
                        WFL.WFTitle = value.Title;
                        WFL.WFRolesGeoTxt = value.RoleName ? value.RoleName : "";
                        if (value.StepType == "Automation Condition Evaluation" || value.StepType == "Manual Condition Evaluation") {

                            var conditionTier1 = value.Title + " [Condition (" + value.ConditionName + ")]";
                            $scope.conditionSteps.push({ Name: conditionTier1, Id: value.StepId });
                            $scope.conditionStepsVal = $scope.conditionSteps.length;
                            WFL.WFConditionName = value.ConditionName;
                        } else {
                            if (value.StepType == "Questionnaire") {
                                $scope.steps.push({ Name: value.Title, Id: value.StepId });
                                $scope.stepsVal = $scope.steps.length;
                            }
                        }
                        if (value.ConditionValue !== "") {
                            WFL.conditionChecked = true;

                            WFL.conditionValue = "Condition: " + value.ConditionValue;

                        }
                        var formDetailsLoad = angular.copy(WFL)
                        $scope.addStepData.push(formDetailsLoad);

                    });

                }
                else {
                    $("#submitWorkflow").addClass("disablePage");
                }
                fnCloseSpinner();

            }).error(function () {
                fnCloseSpinner();

                toastr.error('', 'Error occured. Please contact support team.');

            });

           
        }).error(function () {
            fnCloseSpinner();

            toastr.error('', 'Error occured. Please contact support team.');

        });
    }
    $scope.deleteStepCancel = function () {
        var dialog;
        dialog = $("#dialogDeleteStep").data('dialog');

        dialog.close();
    }

    $scope.stepdelete = function (delIndex, idx) {
        var dialog;
        dialog = $("#dialogDeleteStep").data('dialog');
        dialog.open();
        idToDelete = delIndex;
        indexsel = idx;

    }
    var step_Id = "";
    var selected_questionnaire = '';
    $scope.addStepBlock = function (editIndex, index) {
        $scope.showCustom = true;
        $scope.formTitle = "Edit step";
        step_Id = editIndex;
        $scope.showForm = true;
        $scope.stepsDisabled = true;
        $scope.selectedIndex = index;
        fnOpenSpinner();
        $http.get('api/Workflow/GetWorkflowStepSettings?guidId=' + editIndex).success(function (data) {
            fnCloseSpinner();
            $("#selectWorkFlowType").addClass("disablePage");
            angular.forEach($scope.addStepData, function (value, key) {
                if (value.id == data.InputStep) {
                    if (value.WFType == "Manual Condition Evaluation") {
                        $scope.showCustom = false;
                    }
                    else {
                        $scope.showCustom = true;
                    }
                }
            });
            angular.forEach($scope.type, function (value, key) {
                if (value.Id == data.TypeId) {
                    $scope.WF.WFType = value.Name;
                }
            });
            
            if (data.StepProperties.length > 0) {
                if (data.StepProperties[0].Value != "") {
                    selected_questionnaire = data.StepProperties[0].Value;
                }
                    angular.forEach($scope.questionnaire, function (value, key) {

                        if (data.StepProperties[0].Value == value.QuestionnaireVersionId) {
                            $scope.WF.WFQuestionnaire = value.QuestionnaireName;
                        }
                    })
                }
                else {
                    $scope.WF.WFQuestionnaire = "";
                }
            
            $scope.WF.WFTitle = data.Title;
            $scope.WF.WFReminders = data.MessageReminder.Message;
            $scope.WF.WFFrequency = data.MessageReminder.Frequency;
            $scope.WF.WFDays = data.MessageReminder.Days;
            $scope.WF.WFSendCopy = data.MessageReminder.SendCopy;
            $scope.WF.WFRolesCustom = data.StepProperties.length > 0 ? data.StepProperties[1].Value : "";
            $scope.WF.WFRolesGeo = data.StepProperties.length > 0 ? data.StepProperties[2].Value : "";
            if ($scope.WF.WFType == "Automation Condition Evaluation" || $scope.WF.WFType=="Manual Condition Evaluation") {
                $scope.WF.WFInputStep = data.InputStep;
                $scope.WF.WFConditionName = $scope.addStepData[index].WFConditionName;
            } else {
                if (data.InputStep !== "00000000-0000-0000-0000-000000000000") {
                    $scope.WF.WFCondition = data.InputStep;
                    $scope.conditionStepsVal = $scope.count > 0 ? $scope.count : $scope.conditionStepsVal;
                } else {
                    $scope.count = $scope.conditionStepsVal;
                    $scope.conditionStepsVal = 0;
                }
                if (data.ConditionValues.length > 0) {

                    angular.forEach(data.ConditionValues, function (val, key) {
                        if (val.Value == "N/A") {
                            $scope.condValue.selected["4"] = "N/A";
                        } else {
                            var idx = val.Value.slice(-1);
                            $scope.condValue.selected[idx] = "Tier " + idx;
                        }

                    });
                }

            }

            setTimeout(function () {
                $("#selectWFConditionName").addClass("disablePage");

            }, 500);




        }).error(function () {
            fnCloseSpinner();

            toastr.error('', 'Error occured. Please contact support team.');

        });
    }
    $scope.saveWorkflowStep2 = function (form) {


        $scope.cancelValidations_Reminders = true;
        $scope.cancelValidations_Freq = true;
        $scope.cancelValidations_Days = true;
        $scope.cancelValidations_Type = true;
        $scope.cancelValidations_Title = true;
        $scope.cancelValidations_Questionnaire = true;
        $scope.cancelValidations_Geo = true;

        $scope.cancelVaidations_Condition = true;
        $scope.cancelValidations_ConditionType = true;
        $scope.cancelValidations_Input = true;





      
        
  

        var tier = "", tierArr = [];
        $scope.submitted = true;
        if (!form.$invalid) {
            if ($scope.WF.WFType !== "Automation Condition Evaluation" && $scope.WF.WFType !== "Manual Condition Evaluation" && $scope.WF.WFType !== "Auto-approve") {
                if ($scope.WF.WFRolesGeo && $scope.WF.WFRolesCustom) {
                    toastr.error('', 'Please enter either Geo-specific role or Custom role');

                    return false;
                } else if (($scope.WF.WFRolesGeo === "" || $scope.WF.WFRolesGeo === null || $scope.WF.WFRolesGeo === undefined) && ($scope.WF.WFRolesCustom === "" || $scope.WF.WFRolesCustom === null || $scope.WF.WFRolesCustom === undefined)) {
                    toastr.error('', 'Please enter a valid value for role');
                    return false;
                }
            }
            var typeId;
            angular.forEach($scope.type, function (value, key) {
                if (value.Name == $scope.WF.WFType) {
                    typeId = value.Id;
                }
            });
            var ConditionValues = [];
            var conditon_name = "";
            angular.forEach($scope.conditionSteps, function (val, key) {
                if (val.Id == $scope.WF.WFCondition) {
                    
                    if (val.Name.indexOf("Initial Tier") > -1) {
                        conditon_name = "Initial Tier";
                    }
                    else {
                        conditon_name = "Final Tier";

                    }

                }
            })
            if ($scope.WF.WFCondition) {
                for (prop in $scope.condValue.selected) {
                    if ($scope.condValue.selected[prop].length > 0) {
                        ConditionValues.push({ "Name": conditon_name, value: $scope.condValue.selected[prop] });
                    }

                }
            } else {
                ConditionValues = "";
            }
            if (selectedQuestionnaire.value == undefined) {
                $scope.WF.WFQuestionnaire = selected_questionnaire;
            }else{
            angular.forEach($scope.questionnaire, function (value, key) {
                
                if (value.QuestionnaireName == selectedQuestionnaire.value) {
                    $scope.WF.WFQuestionnaire = value.QuestionnaireVersionId;
                }
            })
                }
            var dataToSave = {
                "WorkflowId": $location.search().newWorkflowId,
                "Title": $scope.WF.WFTitle,
                "TypeId": typeId,
                "InputStep": $scope.WF.WFCondition ? $scope.WF.WFCondition: $scope.WF.WFInputStep ? $scope.WF.WFInputStep: "",
                "StepProperties": [
                           {
                               "Name": "Questionnaire",
                               "Value": $scope.WF.WFQuestionnaire ? $scope.WF.WFQuestionnaire: ""
                },
                           {
                               "Name": "Custom Role",
                               "Value": $scope.WF.WFRolesCustom ? $scope.WF.WFRolesCustom: ""
                },
                            {
                                "Name": "Geo Specific Role",
                                "Value": $scope.WF.WFRolesGeo ? $scope.WF.WFRolesGeo: ""
                },
                            {
                                "Name": "Condition Name",
                                "Value": $scope.WF.WFConditionName ? $scope.WF.WFConditionName: ""
                }
            ],
            "MessageReminder": {
                    "Message": $scope.WF.WFReminders ? $scope.WF.WFReminders: "",
                    "Frequency": $scope.WF.WFFrequency ? $scope.WF.WFFrequency: "",
                    "Days": $scope.WF.WFDays ? $scope.WF.WFDays: "",
                    "SendCopy": $scope.WF.WFSendCopy ? $scope.WF.WFSendCopy: ""
            },
            "ConditionValues": ConditionValues ? ConditionValues: []
            }
            //inside success

            if ($scope.selectedIndex >= 0) {
                
                dataToSave.StepId = step_Id;
                $scope.WF.id = step_Id;
                
                fnOpenSpinner();

                $http.put('api/Workflow/UpdateWorkflowStepSettings', dataToSave).success(function (data) {
                    $scope.stepsDisabled = false;
                    $scope.formTitle = "New step";
                    $("#selectWorkFlowType").removeClass("disablePage");
                    $("#selectWFConditionName").removeClass("disablePage");

                    var formDetails = angular.copy($scope.WF);
                    if ($scope.WF.WFType == 'Automation Condition Evaluation' || $scope.WF.WFType == 'Manual Condition Evaluation') {
                        var conditionTier = $scope.WF.WFTitle + " [Condition (" + $scope.WF.WFConditionName + ")]";
                        angular.forEach($scope.conditionSteps, function (value, key) {
                            if (value.Id == step_Id) {
                                value.Name = conditionTier;
                            }
                        });
                        $scope.conditionStepsVal = $scope.conditionSteps.length;
                        $scope.addStepData[$scope.selectedIndex] = formDetails;
                    } else {
                        if ($scope.WF.WFRolesCustom) {
                            formDetails.WFRolesGeoTxt = $scope.WF.WFRolesCustom;
                        }
                        angular.forEach($scope.geoSpecific, function (value, key) {
                            if (value.Id == $scope.WF.WFRolesGeo) {
                                formDetails.WFRolesGeoTxt = value.Name;
                            }
                        });
                        if ($scope.WF.WFCondition) {

                            for (prop in $scope.condValue.selected) {
                                if ($scope.condValue.selected[prop].length > 0) {
                                    tierArr.push($scope.condValue.selected[prop]);
                                }

                            }
                            for (var i = 0; i < tierArr.length; i++) {
                                if (i == 0) {
                                    tier += tierArr[i];
                                } else if (i == tierArr.length - 1) {
                                    tier += ", " + tierArr[i];
                                } else {
                                    tier += ", " + tierArr[i];
                                }

                            }
                            formDetails.conditionValue = conditon_name + ": " + tier; //"Condition: " + tier;
                            formDetails.conditionChecked = true;
                        }
                        angular.forEach($scope.steps, function (value, key) {
                            if (value.Id == step_Id) {
                                value.Name = $scope.WF.WFTitle;
                            }
                        });
                        $scope.stepsVal = $scope.steps.length;
                        $scope.addStepData[$scope.selectedIndex] = formDetails;
                       
                    }
                    $scope.selectedIndex = -1;
                    $scope.showForm = false;
                    $scope.WF = {};
                    selectedQuestionnaire = '';
                    $scope.submitted = false;
                    $scope.condValue = {
                        selected: {}
                    };
                    fnCloseSpinner();

                    $scope.stepsDisabled = false;

                    document.body.scrollTop = document.documentElement.scrollTop = 0;

                    toastr.success('', 'Step updated');
                }).error(function () {
                    fnCloseSpinner();

                    toastr.error('', 'Error occured. Please contact support team.');

                });//close post call

            } else {
                fnOpenSpinner();
                $http.post('api/Workflow/SaveWorkflowStepSettings', dataToSave).success(function (data) {
                    $scope.stepsDisabled = false;

                    $scope.WF.id = data.StepId;
                    var formDetails = angular.copy($scope.WF);
                    if ($scope.WF.WFType == 'Automation Condition Evaluation' || $scope.WF.WFType == 'Manual Condition Evaluation') {
                       
                        $scope.addStepData.push(formDetails);
                        var conditionTier = $scope.WF.WFTitle + " [Condition (" + $scope.WF.WFConditionName + ")]";
                        $scope.conditionSteps.push({ Name: conditionTier, Id: $scope.WF.id });
                        $scope.conditionStepsVal = $scope.conditionSteps.length;
                    } else {
                        if ($scope.WF.WFRolesCustom) {
                            formDetails.WFRolesGeoTxt = $scope.WF.WFRolesCustom;
                        }
                        angular.forEach($scope.geoSpecific, function (value, key) {
                            if (value.Id == $scope.WF.WFRolesGeo) {
                                formDetails.WFRolesGeoTxt = value.Name;
                            }
                        });
                        if ($scope.WF.WFCondition) {
                            for (prop in $scope.condValue.selected) {
                                if ($scope.condValue.selected[prop].length > 0) {
                                    tierArr.push($scope.condValue.selected[prop]);
                                }

                            }
                            for (var i = 0; i < tierArr.length; i++) {
                                if (i == 0) {
                                    tier += tierArr[i];
                                } else if (i == tierArr.length - 1) {
                                    tier += ", " + tierArr[i];
                                } else {
                                    tier += ", " + tierArr[i];
                                }

                            }
                            formDetails.conditionValue = conditon_name +": "+ tier;//"Condition: " + tier;
                            formDetails.conditionChecked = true;
                        }
                        if ($scope.WF.WFType == "Questionnaire") {
                            $scope.steps.push({ Name: $scope.WF.WFTitle, Id: $scope.WF.id });
                            $scope.stepsVal = $scope.steps.length;
                            
                        }
                        $scope.addStepData.push(formDetails);
                    }

                    $scope.showForm = false;
                    $scope.WF = {};
                    selectedQuestionnaire = '';

                    $scope.submitted = false;
                    $scope.condValue = {
                        selected: {}
                    };
                    fnCloseSpinner();


                    document.body.scrollTop = document.documentElement.scrollTop = 0;

                    toastr.success('', 'Step added to the workflow');
                }).error(function () {
                    fnCloseSpinner();

                    toastr.error('', 'Error occured. Please contact support team.');

                });
            }//close else
            // })//close success call
        }


    }
    $scope.cancelStep = function () {



        $scope.cancelValidations_Reminders = false;
        $scope.cancelValidations_Freq = false;
        $scope.cancelValidations_Days = false;
        $scope.cancelValidations_Type = false;
        $scope.cancelValidations_Title = false;
        $scope.cancelValidations_Questionnaire = false;
        $scope.cancelValidations_Geo = false;

        $scope.cancelVaidations_Condition = false;
        $scope.cancelValidations_ConditionType = false;
        $scope.cancelValidations_Input = false;







        $scope.showForm = false;
        $scope.formTitle = "New step";
        $("#selectWorkFlowType").removeClass("disablePage");
        $("#selectWFConditionName").removeClass("disablePage");

        $scope.WF = {};
        $scope.submitted = false;
        $scope.condValue = {
            selected: {}
        };
        $scope.stepsDisabled = false;
        $scope.conditionStepsVal = $scope.count > 0 ? $scope.count : $scope.conditionStepsVal;
        $scope.selectedIndex = -1;
        document.body.scrollTop = document.documentElement.scrollTop = 0;
    }
    $scope.previewQuestionnaire = function (e) {
        e.stopPropagation();
        var questionnaireVersionId = "";
        angular.forEach($scope.questionnaire, function (value, key) {
            if (value.QuestionnaireName == selectedQuestionnaire.value) {
                questionnaireVersionId = value.QuestionnaireVersionId;
            }
        })
        var languageId = "192C79DD-B246-4BF2-B297-A36338981F99";
        show_Dialog("#spinnerDialog");

        $http.get("/api/Questionnaire/GetQuestionnaireByQuestionnaireVersionId?QuestionnaireVersionId=" + questionnaireVersionId).success(
        function (result) {
            setTimeout(function () {
                $('.workFlow_Editor').find('.jHtmlArea div').remove();
                $('.workFlow_Editor').find('.jHtmlArea textarea').show();
            }, 10000);
            $scope.questionnaireName = result.QuestionnaireName;
            $scope.questionnaireIntro = result.QuestionnaireIntro;
            $scope.questionnaireThankYou = result.HelpText;
        }).error(function () {
            $scope.questionnaireName = null;
            $scope.questionnaireIntro = null;
            $scope.questionnaireThankYou = null;
            fnCloseSpinner();
            window.alert("Error occured while retrieving questionnaire. Please try again");
        }
                                    );

        $http.get('api/question/GetQuestionPages?questionnaireVersionId=' + questionnaireVersionId + '&languageId=' + languageId).success(function (result) {
            $scope.questionnairePreviewPages = result;

            if (result.length === 0) {
                var dialog = $("#spinnerDialog").data('dialog');
                dialog.close();
                show_Dialog("#dialogPreviewQuestionnaire");
            }
            else {
                $scope.questionnairePreviewFirstPageId = result[0].PageId;
                $scope.questionnairePreviewPageIds = [];

                $.each(result, function () {
                    var obj = result;
                    $scope.questionnairePreviewPageIds.push(
                        {
                            "pageId": $(this).attr("PageId")
                        }
                    );
                });
            }
        }).error(function () {
            fnCloseSpinner();
            show_Dialog("#dialogPreviewQuestionnaire");
        });

    }
    $scope.saveAsDraft = function () {
        var stepidArr = [];
        angular.forEach($scope.addStepData, function (value, key) {

            stepidArr.push(value.id);


        })
        var obj = { StepId: stepidArr }
        fnOpenSpinner();
        $http.put('api/Workflow/UpdateWorkflowStepSequence', obj).success(function (data) {
            fnCloseSpinner();
            toastr.success('', 'Your workflow is currently saved as draft');

            $location.url('/workflowLanding');
            
            
        }).error(function () {
            fnCloseSpinner();

            toastr.error('', 'Error occured. Please contact support team.');

        });
    }
    $scope.validateType = function () {
        $scope.WF.WFCondition = '';
        if ($scope.WF.WFType == undefined) {
            $scope.invalidType = true;
            $("select[name='WFType']").addClass('error');
            $scope.cancelValidations_Type = true;
        } else {
            $scope.invalidType = false;
            $scope.cancelValidations_Type = false;
            $("select[name='WFType']").removeClass('error');
        }
    }

    $scope.checkType = function () {
        if (!$scope.WF.WFType || $scope.WF.WFType.trim().length === 0) {

            $scope.invalidType = true;
            $scope.cancelValidations_Type = true;
            $("select[name='WFType']").addClass('error');

        } else {
            $scope.invalidType = false;
            $scope.cancelValidations_Type = false;
            $("select[name='WFType']").removeClass('error');
            
        }
    };
    
    //$scope.validateRole = function () {
        
    //    if ($scope.WF.WFRolesGeo == undefined) {
    //        $scope.invalidGeo = true;
    //        $scope.cancelValidations_Geo = true;
    //        $("select[name='WFRolesGeo']").addClass('error');
           
    //    } else {
    //        $scope.invalidGeo = false;
    //        $scope.cancelValidations_Geo = false;
    //        $("select[name='WFRolesGeo']").removeClass('error');
            
    //    }
    //}

    //$scope.checkGeo = function () {
    //    if (!$scope.WF.WFRolesGeo || $scope.WF.WFRolesGeo.trim().length === 0) {
    //        $scope.invalidGeo = true;
    //        $scope.cancelValidations_Geo = true;
    //        $("select[name='WFRolesGeo']").addClass('error');

    //    } else {
    //        $scope.invalidGeo = false;
    //        $scope.cancelValidations_Geo = false;
    //        $("select[name='WFRolesGeo']").removeClass('error');
           
    //    }
    //}

    
    $scope.validateTitle = function () {

        if ($scope.WF.WFTitle == undefined) {
            $scope.invalidTitle = true;
            $scope.cancelValidations_Title = true;
            $("input[name='WFTitle']").addClass('error');

        } else {
            $scope.invalidTitle = false;
            $scope.cancelValidations_Title = false;
            $("input[name='WFTitle']").removeClass('error');

        }
    }

    $scope.checkTitle = function () {
        if (!$scope.WF.WFTitle || $scope.WF.WFTitle.trim().length === 0) {
            $scope.invalidTitle = true;
            $scope.cancelValidations_Title = true;
            $("input[name='WFTitle']").addClass('error');
        } else {
            $scope.invalidTitle = false;
            $scope.cancelValidations_Title = false;
            $("input[name='WFTitle']").removeClass('error');

        }
    }


    $scope.validateReminders = function () {

        if ($scope.WF.WFReminders == undefined) {
            $scope.invalidReminders = true;
            $scope.cancelValidations_Reminders = true;
            $("textarea[name='WFReminders']").addClass('error');

        } else {
            $scope.invalidReminders = false;
            $scope.cancelValidations_Reminders = false;
            $("textarea[name='WFReminders']").removeClass('error');

        }
    }

    $scope.checkReminders = function () {
        if (!$scope.WF.WFReminders || $scope.WF.WFReminders.trim().length === 0) {
            $scope.invalidReminders = true;
            $scope.cancelValidations_Reminders = true;
            $("textarea[name='WFReminders']").addClass('error');

        } else {
            $scope.invalidReminders = false;
            $scope.cancelValidations_Reminders = false;
            $("textarea[name='WFReminders']").removeClass('error');

        }
    };

    $scope.validateFrequency = function () {

        if ($scope.WF.WFFrequency == undefined) {
            $scope.invalidFreq = true;
            $scope.cancelValidations_Freq = true;
            $("input[name='WFFrequency']").addClass('error');

        } else {
            $scope.invalidFreq = false;
            $scope.cancelValidations_Freq = false;
            $("input[name='WFFrequency']").removeClass('error');

        }
    }


    $scope.checkFreq = function () {
        if (!$scope.WF.WFFrequency || $scope.WF.WFFrequency.trim().length === 0) {
            $scope.invalidFreq = true;
            $scope.cancelValidations_Freq = true;
            $("input[name='WFFrequency']").addClass('error');

        } else {
            $scope.invalidFreq = false;
            $scope.cancelValidations_Freq = false;
            $("input[name='WFFrequency']").removeClass('error');
        }
    };


    $scope.validateDays = function () {

        if ($scope.WF.WFDays == undefined) {
            $scope.invalidDays = true;
            $scope.cancelValidations_Days = true;
            $("input[name='WFDays']").addClass('error');

        } else {
            $scope.invalidDays = false;
            $scope.cancelValidations_Days = false;
            $("input[name='WFDays']").removeClass('error');

        }
    }

    $scope.checkDays = function () {
        if (!$scope.WF.WFDays || $scope.WF.WFDays.trim().length === 0) {
            $scope.invalidDays = true;
            $scope.cancelValidations_Days = true;
                        $("input[name='WFDays']").addClass('error');

        } else {
            $scope.invalidDays = false;
            $scope.cancelValidations_Days = false;
            $("input[name='WFDays']").removeClass('error');
        }
        };
    


    $scope.validateConditionName = function () {

        if ($scope.WF.WFConditionName == undefined) {
            $scope.invalidCondition = true;
            $scope.cancelVaidations_Condition = true;
            $("select[name='WFConditionName']").addClass('error');

        } else {
            $scope.invalidCondition = false;
            $scope.cancelVaidations_Condition = false;
            $("select[name='WFConditionName']").removeClass('error');

        }
    }

    $scope.checkCondition = function () {
        if (!$scope.WF.WFConditionName || $scope.WF.WFConditionName.trim().length === 0) {
            $scope.invalidCondition = true;
            $scope.cancelVaidations_Condition = true;
            $("select[name='WFConditionName']").addClass('error');

        } else {
            $scope.invalidCondition = false;
            $scope.cancelVaidations_Condition = false;
            $("select[name='WFConditionName']").removeClass('error');

        }
    };

    $scope.showCustom = true;
    $scope.validateInputConditionType = function () {
        $scope.showCustom = true;
        angular.forEach($scope.addStepData, function (val, key) {
            if (val.id == $scope.WF.WFCondition) {
                if (val.WFType == 'Manual Condition Evaluation') {
                    $scope.showCustom = false;
                }
                else {
                    $scope.showCustom = true;
                }
            }

    })
        if ($scope.WF.WFCondition == undefined) {
            $scope.invalidConditionType = true;
            $scope.cancelValidations_ConditionType = true;
            $("select[name='WFCondition']").addClass('error');

        } else {
            $scope.invalidConditionType = false;
            $scope.cancelValidations_ConditionType = false;
            $("select[name='WFCondition']").removeClass('error');

        }
    }

    $scope.checkInputConditionType = function () {
        if (!$scope.WF.WFCondition || $scope.WF.WFCondition.trim().length === 0) {
            $scope.invalidConditionType = true;
            $scope.cancelValidations_ConditionType = true;
            $("select[name='WFCondition']").addClass('error');

        } else {
            $scope.invalidConditionType = false;
            $scope.cancelValidations_ConditionType = false;
            $("select[name='WFCondition']").removeClass('error');

        }
    };



    $scope.validateInputStep = function () {

        if ($scope.WF.WFInputStep == undefined) {
            $scope.invalidInputStep = true;
            $scope.cancelValidations_Input = true;
            $("select[name='WFInputStep']").addClass('error');

        } else {
            $scope.invalidInputStep = false;
            $scope.cancelValidations_Input = false;
            $("select[name='WFInputStep']").removeClass('error');

        }
    }

    $scope.checkInputStep = function () {
        if (!$scope.WF.WFInputStep || $scope.WF.WFInputStep.trim().length === 0) {
            $scope.invalidInputStep = true;
            $scope.cancelValidations_Input = true;
            $("select[name='WFInputStep']").addClass('error');

        } else {
            $scope.invalidInputStep = false;
            $scope.cancelValidations_Input = false;
            $("select[name='WFInputStep']").removeClass('error');

        }
    };

    



    $scope.validateQuestionnaire = function () {

        if ($scope.WF.WFQuestionnaire == undefined) {
            $scope.invalidQuestionnaire = true;
            $scope.cancelValidations_Questionnaire = true;
            $("input[name='WFQuestionnaire']").addClass('error');

        } else {
            $scope.invalidQuestionnaire = false;
            $scope.cancelValidations_Questionnaire = false;
            $("input[name='WFQuestionnaire']").removeClass('error');

            }
        }
    $scope.checkQuestionnaire = function () {
        if (!$scope.WF.WFQuestionnaire || $scope.WF.WFQuestionnaire.trim().length === 0) {
            $scope.invalidQuestionnaire = true;
            $scope.cancelValidations_Questionnaire = true;
            $("input[name='WFQuestionnaire']").addClass('error');

        } else {
            $scope.invalidQuestionnaire = false;
            $scope.cancelValidations_Questionnaire = false;
            $("input[name='WFQuestionnaire']").removeClass('error');
        }
    };


    var languageId = "192C79DD-B246-4BF2-B297-A36338981F99";


    $scope.goToWizard = function ($event) {
        $event.stopPropagation();
        $scope.questionnairePreviewPercentageComplete = 0;
        $scope.questionnairePreviewCurrentPageNumber = 1;
        $scope.questionnairePreviewPageCount = $("#previewWizard").find(".step").length;
        if ($scope.questionnairePreviewPageCount > 0) {
            $("#previewWizard").wizard(
                {
                    onPage: function (page, wiz) {
                        $("#previewWizard a").attr("target", "_blank");
                        var scope = angular.element($("#previewWizard")).scope();
                        if (scope) {
                                showDialog("#spinnerDialog");
                                $("#previewWizard").append('<div class="dialog-overlay op-dark"></div>');

                                scope.questionnairePreviewCurrentPageNumber = page;
                                scope.questionnairePreviewPercentageComplete = Math.round(((page - 1) / scope.questionnairePreviewPageCount) * 100);

                                $http.get("api/question/GetQuestionsByPageId?pageId=" + scope.questionnairePreviewPageIds[page - 1].pageId + "&languageId=" + languageId).success(
                                    function (questionResult) {
                                        scope.questionResult = questionResult;
                                        var dialog = $('#spinnerDialog').data('dialog');
                                        dialog.close();
                                        $("body").append('<div class="dialog-overlay op-dark"></div>');
                                    })
                                    .error(
                                    function () {
                                        scope.questionResult = null;
                                        var dialog = $('#spinnerDialog').data('dialog');
                                        dialog.close();
                                        $("body").append('<div class="dialog-overlay op-dark"></div>');
                                    }
                                    );



                                if (page === 1) {
                                    $(".previewMain .actions .btn-prior").attr("style", "display: none !important");
                                }
                                else {
                                    $(".previewMain .actions .btn-prior").attr("style", "display: block !important");
                                }

                                if (scope.questionnairePreviewPageCount === page) {
                                    $(".previewMain .actions .btn-next").attr("style", "display: none !important");
                                    $(".previewMain .actions .btn-finish").attr("style", "display: block !important");
                                }
                                else {
                                    $(".previewMain .actions .btn-next").attr("style", "display: block !important");
                                    $(".previewMain .actions .btn-finish").attr("style", "display: none !important");
                                }
                        }
                        return true;
                    },
                    onFinish: function (page, wiz) {
                        $("#previewWizard").hide();
                        $(".previewHeadingRight").attr("style", "display: none !important");
                        $(".previewBye").show();
                    }
                }
            );
            $(".wizard .stepper>ul").attr("style", "width: " + (($scope.questionnairePreviewPageCount - 1) * 45) + "px!important");
            $(".previewWelcome").hide();
            $("#previewWizard").show();
        }
        else {
            $(".previewWelcome").hide();
            $(".previewBye").show();
        }
    }

    $scope.renderHtml = function (htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    }
    
});