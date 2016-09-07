var changeOwnerDialog;
var currentTierValue = "";
var previousTierValue = "";

function showDialogChangeOwner() {
    changeOwnerDialog = $("#changeOwnerDialog").data('dialog');
    changeOwnerDialog.open();
}

var changeTierDialog;
function showDialogchangeTier() {
    changeTierDialog = $("#changeTier").data('dialog');
    changeTierDialog.open();
}
var changeAttestation;
function showDialogAttestation(reviewerType) {
  
    if (reviewerType === 1) {
        $("#attestationName").text("Recommender’s Attestation");
        $("#recomnndations").text("recommendation");
        $("#representative").text("Representative (if any);");
        $("#decision").text("recommendation");

    } else {
        $("#attestationName").text("Approver’s Attestation");
        $("#recomnndations").text("approval");
        $("#representative").text("Representative;");
        $("#decision").text("decision");
    }
    changeAttestation = $("#dialogReviewerApproverAttestation").data('dialog');
    changeAttestation.open();
}
function discardModal() {
  
    currentTierValue = "";
    previousTierValue = "";
    changeOwnerDialog = $("#changeOwnerDialog").data('dialog');
    changeOwnerDialog.close();
    changeAttestation = $("#dialogReviewerApproverAttestation").data('dialog');
    changeAttestation.close();
    changeTierDialog = $("#changeTier").data('dialog');
    changeTierDialog.close();
}

function ValidateAttestation($scope) {
    if ($.trim($("#employeeName").text().toLowerCase()) !== $("#employeeNameRepeat").val().toLowerCase()) {
        $("#errorMismatchName").css("display", "block");
        return false;
    }
    return true;
}
function removeDupes(origArr) {
    var newArr = [],
            origLen = origArr.length,
            found, x, y;

    for (x = 0; x < origLen; x++) {
        found = undefined;
        for (y = 0; y < newArr.length; y++) {
            if (origArr[x] === newArr[y]) {
                found = true;
                break;
            }
        }
        if (!found) {
            newArr.push(origArr[x]);
        }
    }
    return newArr;
}
vettingApp.directive('focusMe', function ($timeout, $parse) {
    return {
        link: function (scope, element, attrs) {
            var model = $parse(attrs.focusMe);
            scope.$watch(model, function (value) {
                if (value === true) {
                    $timeout(function () {
                        element[0].focus();
                    });
                }
            });
            element.bind('blur', function () {
              
            })
        }
    };
});
vettingApp.directive('myClickOnce', function ($timeout) {
    var delay = 500;   // min milliseconds between clicks

    return {
        restrict: 'A',
        priority: -1,   // cause out postLink function to execute before native `ngClick`'s
                        // ensuring that we can stop the propagation of the 'click' event
                        // before it reaches `ngClick`'s listener
        link: function (scope, elem) {
            var disabled = false;

            function onClick(evt) {
                if (disabled) {
                    evt.preventDefault();
                    evt.stopImmediatePropagation();
                } else {
                    disabled = true;
                    $timeout(function () { disabled = false; }, delay, false);
                }
            }

            scope.$on('$destroy', function () { elem.off('click', onClick); });
            elem.on('click', onClick);
        }
    };
});
// get filename and size for upload(directive for Reports section)

vettingApp.directive('bindFile', [function () {
    return {
        require: "ngModel",
        restrict: 'A',
        controller: 'reportController',
        link: function ($scope, el, attrs, ngModel) {
            el.bind('change', function (event) {
                ngModel.$setViewValue(event.target.files[0]);
                $scope.$apply();
            });

            $scope.$watch(function () {
                return ngModel.$viewValue;
            }, function (value) {
                if (!value) {
                    el.val("");
                }
            });
        }
    };
}]);



// get filename and size for upload(directive for Reviews section)


vettingApp.directive('reviewsAttachment', [function () {
    return {
        require: "ngModel",
        restrict: 'A',
        scope:{
            reviewFile:'='
        },
       // controller: 'acDetails',
        link: function ($scope, el, attrs, ngModel) {
            el.bind('change', function (event) {
                ngModel.$setViewValue(event.target.files[0]);
                $scope.$apply();
            });

            $scope.$watch(function () {
                return ngModel.$viewValue;
            }, function (value) {
                if (!value) {
                    el.val("");
                }
            });
        }
    };
}]);




vettingApp.controller('acDetails', function ($scope, $http, $location, $compile, acDetailsService, toastr, $timeout,$sce) {
    $scope.recoArray = [];
    $scope.controlsArray = [];
    $scope.attachmentDetails = [];
    $scope.controlDetailsArray = [];
    $scope.submitControlsArray = [];
    $scope.moved_reviewForm = false;
    $scope.moved_helpForm = false;
    $scope.ReviewTypeId = '';
    $scope.noReviews = false;
    $scope.submitted = false;
    $scope.attUpload = false;
    $scope.triggerDisabled = true;
    $scope.changeFlag = true;
    $scope.invalidDescription = false;

    $scope.audienceSubTypeArray = [];
    $scope.audienceTypeArray=[];
   
    var items = ["bold", "italic", "underline", "link", "unlink", "orderedlist", "unorderedlist"];

    $scope.showDialogAttestation = function (reviewerType, form) {
        $scope.submitted = true;
        if ($('#reviewerComments').val() == "" || ($('#reviewerComments').val().indexOf('<div><br></div>') ==0)) {
            
            $('.textareaReview ').find('.jHtmlArea').addClass('error');
            $('.textareaReview').find('#commentRequired').show();
        }
        if (!form.$invalid && $('.textareaReview ').find('.error').length == 0 && (!($('#reviewerComments').val().indexOf('<div><br></div>') ==0))) {

       
            if (reviewerType === 1)
                $("#attestationName").text("Recommender’s Attestation");
            else
                $("#attestationName").text("Approver’s Attestation");
            changeAttestation = $("#dialogReviewerApproverAttestation").data('dialog');
            changeAttestation.open();
        }
    }
    $scope.discardModal= function() {
        

        currentTierValue = "";
        previousTierValue = "";
        changeOwnerDialog = $("#changeOwnerDialog").data('dialog');
        changeOwnerDialog.close();
        changeAttestation = $("#dialogReviewerApproverAttestation").data('dialog');
        changeAttestation.close();
        changeTierDialog = $("#changeTier").data('dialog');
        changeTierDialog.close();
    }
    $("#reviewerComments").htmlarea({
        toolbar: [
            ["bold"], ["italic"], ["underline"],
            ["link"], ["unlink"], ["orderedList"], ["unorderedList"]
        ],
        loaded: function () {
            configureText(this);
        }
    });
    items.forEach(function (type) {
        $("a." + type).attr("tabindex", "-1");
    });

    vettingApp.directive('keyEnter', function () {
        return function (scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                scope.$apply(function () {
                    scope.$eval(attrs.myEnter);
                });
                event.preventDefault();
            });
        };
    });

    $scope.hideErrorMessage = function () {
        $("#errorMismatchName").css("display", "none");
    }
    $scope.hideHelpText = function () {
        $scope.showHelpText = false;
        $scope.showReviewForm = true;
    }

    $scope.submitReview = function (statusId, form) {
        $scope.submitted = true;

            if ($('#reviewerComments').val() == "" || ($('#reviewerComments').val().indexOf('<div><br></div>') ==0)) {
                $('.textareaReview ').find('.jHtmlArea').addClass('error');
                $('.textareaReview').find('#commentRequired').show();
        }
            if (!form.$invalid && $('.textareaReview ').find('.error').length == 0 && (!($('#reviewerComments').val().indexOf('<div><br></div>') ==0))) {
                var control_array = $('#reviewTypeMultiDropdown').multipleSelect('getSelects');
            var controlsIdObj = {};
            angular.forEach(control_array, function (val, key) {
                controlsIdObj.ControlDetailsId = val;
                $scope.submitControlsArray.push(controlsIdObj);
                controlsIdObj = {};
            })
            if (statusId === 3 && !ValidateAttestation($scope))
                return false;
            var param = {
                "RequestId": $location.search().requestid,
                "EvidenceDetailsID": null,
                "Comment": $('#reviewerComments').val(),
                "RecommendationId": $scope.reviewType,
                "ControlDetails": $scope.submitControlsArray,
                "ReviewerID": null,
                "ReviewStatusID": statusId,
                "DateTimeModified": null,
                "DateTimeCreated": null,
                "Attachments": $scope.attachmentDetails,
                "IsAttested": statusId === 3 ? true : false,
                "ReviewTypeId": $scope.ReviewTypeId
            }
            var _reviewId = reviewIdForm;
            var changeAttestation = $("#dialogReviewerApproverAttestation").data('dialog');
            changeAttestation.close();
            return acDetailsService.submitReview(param, _reviewId, statusId);
        }
    }
    $scope.changeTier = function () {
        debugger;
        var param = {
            "WorkflowInstanceConditionId": $scope.currentTierData[0].WorkflowInstanceConditionId,
            "WorkflowInstanceId": $scope.currentTierData[0].WorkflowInstanceId,
            "value": currentTierValue,
            "IsCurrent": $scope.currentTierData[0].IsCurrent,
            "IsPrevious": $scope.currentTierData[0].IsPrevious,
            "RequestId": $location.search().requestid,
        }
        acDetailsService.changeTier(param);
        changeTierDialog.close();

    }
    $scope.newTierValue = function (value) {
      
        currentTierValue = value;
        if ($scope.currentTier !== value)
            previousTierValue = $scope.currentTierDataValue;
        else
            previousTierValue = $scope.previousTierDataValue;
    }
    $scope.decisionChange = function () {
        if ($scope.reviewType == 2 || $scope.reviewType == 6) {
            $scope.showMultiDropdown = true;
        }
        else {
            $scope.showMultiDropdown = false;

        }
    }


    $scope.companyDetails = {};
    var entityDetails = {};
    var audienceId = '';
    var audienceName = '';
    var subAudienceName = '';
    var orgAddress = '';
    var countryName = '';
    var countryId = '';
    var userId = $("#userObjectId").val();
    //var userId = "33m12eee-d186-4662-a511-35c463d4dc76";
    var tenantId = '';
    var tenantName = '';
    var selectedControl = [];
   $scope.stepDetails = [];
    var reviewIdForm = $("#reviewIdForm").val();
    function preSelectControls($scope) {

        selectedControl = [];
        var selectControl = $scope.selectControl;
        $.each(selectControl, function (key, value) {
            selectedControl.push(value);
        });
    }
    $scope.evidenceDetails = {};

    $scope.reviewEvidence = [];
    
    fnOpenSpinner();

    acDetailsService.getEntityDetails($location.search().requestid).success(function (response) {
       
        entityDetails = response;
        audienceId = entityDetails.AudienceTypes[0].AudienceTypeId;
        countryId = entityDetails.OrganizationData.Address.Country;
        tenantId = entityDetails.TenantId;
        acDetailsService.GetCurrentTier($location.search().requestid).success(function (data) {
            
            $scope.currentTierDataValue = "";
            $scope.previousTierDataValue = "";
            $scope.currentTierData = data;
            var isExist = false;
            if (data != "null") {
                $.each(data, function(index, itemData) {
                    if (index == 1)
                        isExist = true;
                    if (itemData.IsCurrent == true)
                        $scope.currentTierDataValue = itemData.Value;
                    else
                        $scope.previousTierDataValue = itemData.Value;
                });
                if (isExist == false) {
                    if( $scope.currentTierDataValue == "")
                      $scope.currentTierDataValue = "Tier: None";
                    $scope.previousTierDataValue = "Tier: None";
                }
                else if($scope.previousTierDataValue == "")
                    $scope.previousTierDataValue = "Tier: None";
            } else {
                $scope.currentTierDataValue = "Tier: None";
                $scope.previousTierDataValue = "Tier: None";
            }
            $scope.value = $scope.currentTierDataValue;
         });

        

        acDetailsService.getTenantDetails(tenantId).success(function (resp_tenantName) {
           
                tenantName = resp_tenantName.Tenant.TenantName;

            acDetailsService.getCountryDetails(countryId).success(function (_resp) {
               
            countryName = _resp.CountryName;


                acDetailsService.getAudienceDetails($location.search().requestid).success(function (resp) {
                    
                                angular.forEach(resp, function (val, key) {
                  
                        subAudienceName = val.AudienceSubTypeName;
                        $scope.audienceSubTypeArray.push(subAudienceName);
                        audienceName = val.AudienceTypeName;
                        $scope.audienceTypeArray.push(audienceName);

                    
                })
                                $scope.audienceSubTypeArray=removeDupes($scope.audienceSubTypeArray);
                                $scope.audienceTypeArray = removeDupes($scope.audienceTypeArray);
                                subAudienceName = $scope.audienceSubTypeArray.join("; ");
                                audienceName = $scope.audienceTypeArray.join("; ");
                  
                acDetailsService.getSteps($location.search().requestid).success(function (stepsData) {
                    $scope.stepDetails = stepsData;
                    angular.forEach($scope.stepDetails, function (val, i) {
                        $scope.stepDetails[i].toggleEdit = true;
                    });

                    var data = lineGraph();
                    var temp = $compile(data)($scope);
                    $('#lineGraph').html(temp);
                    acDetailsService.getEvidence($location.search().requestid).success(function (data) {
                       
                     $scope.evidenceDetails = data;

                        acDetailsService.getRecommendation().success(function (resp_reco_array) {
                                                  // $scope.recommendationArray = resp_reco_array;
                            var recommendationObj = {};
                            $scope.typeOther = [];
                            $scope.typeTwo = [];
                        angular.forEach(resp_reco_array, function (rec, index) {
                            recommendationObj[rec.RecommendationId] = rec.Name;
                            if (rec.RecommendationId == 1 || rec.RecommendationId == 2 || rec.RecommendationId == 3) {
                                $scope.typeOther.push(rec);
                            } else if (rec.RecommendationId == 5 || rec.RecommendationId == 6 || rec.RecommendationId == 7) {
                                $scope.typeTwo.push(rec);
                            } else if (rec.RecommendationId == 8) {
                                $scope.typeTwo.push(rec);
                                $scope.typeOther.push(rec);
                            }
                        });


                        acDetailsService.getControlDetails().success(function (resp_control_array) {
                            $scope.controlsArray = resp_control_array;

                            angular.forEach($scope.controlsArray, function (value, key) {
                                $('#reviewTypeMultiDropdown').append("<option  value='" + value.ControlDetailsId + "'>" + value.Name + "</option>");

                            })
                            $('#reviewTypeMultiDropdown').multipleSelect();
                            if ($scope.evidenceDetails.EvidenceDetails.length == 0) {
                                $scope.noReviews = true;
                            }
                            else {
                                $scope.noReviews = false;
                            }
                            angular.forEach($scope.evidenceDetails.EvidenceDetails, function(val, key) {
                                if (val.EvidenceDetailTypeID == 2) {
                                    
                                    angular.forEach(val.ReviewDetails, function(rec, index) {
                                        if (rec.ReviewStatusID == 3) {


                                            rec.Name = recommendationObj[rec.RecommendationId]
                                            rec.Comment = $sce.trustAsHtml(rec.Comment);
                                            $scope.reviewEvidence.push(rec);
                                        } else if (rec.ReviewStatusID == 1 || rec.ReviewStatusID == 2) {

                                            if (rec.Reviewer.UserID == userId) {
                                            //   $("#reviewIdForm").val(rec.ReviewID);
                                             $scope.attachmentDetails = rec.Attachments;


                                            

                                             angular.forEach(rec.ControlDetails, function (val, key) {
                                                 
                                                 $scope.controlDetailsArray.push(val.ControlDetailsId)

                                             })
                                            
                                             reviewIdForm = rec.ReviewID
                                             if (rec.ReviewStatusID == 1) {
                                                 $scope.showReviewForm = false;
                                                 $scope.showHelpText = true;
                                             } else {
                                                 $scope.showReviewForm = true;
                                                 $scope.showHelpText = false;
                                             }
                                                $scope.reviewForm = rec;
                                                $scope.ReviewTypeId = rec.ReviewTypeId;
                                                //if (rec.ReviewTypeId == 1) {
                                                   
                                                //    angular.forEach($scope.recoArray, function (val, key) {
                                                //        console.log(val.RecommendationId,val.Name)
                                                //        if (val.RecommendationId == 5 || val.RecommendationId == 6 || val.RecommendationId == 7) {
                                                //            $scope.recoArray.splice(key, 1);

                                                //        }
                                                //    })
                                            //}
                                                if (rec.ReviewTypeId == 2) {
                                                    //  someArray.splice(x, 1);
                                                    $scope.recoArray = $scope.typeTwo;
                                                 //   $scope.recoArray.splice(0,1)
                                                  /*  $scope.recoArray = [
 
                                                                  {
                                                                      "RecommendationId": 5,
                                                                      "Name": "Approved",
                                                                      "ReviewerType": 2
                                                                  },
                                                                  {
                                                                      "RecommendationId": 6,
                                                                      "Name": "Approved with controls",
                                                                      "ReviewerType": 2
                                                                  },
                                                                  {
                                                                      "RecommendationId": 7,
                                                                      "Name": "Not approved",
                                                                      "ReviewerType": 2
                                                                  },
                                                                  {
                                                                      "RecommendationId": 8,
                                                                      "Name": "On Hold",
                                                                      "ReviewerType": 2
                                                                    }]*/

                                                }
                                                else {
                                                    $scope.recoArray = $scope.typeOther;
                                                  /*  $scope.recoArray = [
                                                      {
                                                          "RecommendationId": 1,
                                                          "Name": "Recommend",
                                                          "ReviewerType": 1
                                                      },
                                                      {
                                                          "RecommendationId": 2,
                                                          "Name": "Recommend with controls",
                                                          "ReviewerType": 1
                                                      },
                                                      {
                                                          "RecommendationId": 3,
                                                          "Name": "Do not recommend",
                                                          "ReviewerType": 1
                                                      },
                                                     
                                                      {
                                                          "RecommendationId": 8,
                                                          "Name": "On Hold",
                                                          "ReviewerType": 2
                                                      } ]*/
                                                }

                                                $scope.reviewType = rec.RecommendationId;
                                                if ($scope.reviewType == 2 || $scope.reviewType == 6) {
                                                    $scope.showMultiDropdown = true;
                                                }
                                                else {
                                                    $scope.showMultiDropdown = false;
                                                }
                                                $('#reviewerComments').htmlarea('html', rec.Comment);
                                                $scope.selectControl = $scope.controlDetailsArray;
                                                preSelectControls($scope);
                                                if (selectedControl.length > 0) {
                                                    $('#reviewTypeMultiDropdown').multipleSelect({
                                                        selectAll: false
                                                    });
                                                    $('#reviewTypeMultiDropdown').multipleSelect('setSelects', selectedControl);
                                                }

                                        }
                                            else {
                                                $scope.showReviewForm = false;
                                                $scope.showHelpText = false;
                                                }

                                        }

                                        }


                                    ); //review array
                                } //evidence type
                            });


                            if ($scope.reviewEvidence.length == 0) {
                                $scope.noReviews = true;
                            }
                            else {
                                $scope.noReviews = false;
                            }

                            entityDetails.OrganizationData.Address.Country = countryName;

                            angular.forEach(entityDetails.OrganizationData.Address, function (value, key) {
                                if (value != null) {
                                    orgAddress += value + ', '

                                }

                            });
                            orgAddress = orgAddress.replace(/,\s*$/, "");


                            $scope.companyDetails = {
                                companyName: entityDetails.OrganizationData.OrganizationName,
                                id: "1234567890",
                                address: orgAddress,
                                phoneNumber: entityDetails.OrganizationData.CompanyPhone == null ? "" : entityDetails.OrganizationData.CompanyPhone,
                                website: entityDetails.OrganizationData.CompanyWebsite == null ? "" : entityDetails.OrganizationData.CompanyWebsite,//CompanyWebsite
                                audience: audienceName,
                                audienceSubType: subAudienceName,
                                contactName: entityDetails.IndividualData.FirstName,
                                contactNumber: entityDetails.OrganizationData.CompanyPhone == null ? "" : entityDetails.OrganizationData.CompanyPhone,
                                requestId: entityDetails.RequestId,
                                tenant_Name: tenantName
                            }
                            fnCloseSpinner();
                        }).error(function (data) {
                            fnCloseSpinner();
                            toastr.error('', 'Error occured. Please contact support team.');

                        });
                    }).error(function (data) {
                        fnCloseSpinner();
                        toastr.error('', 'Error occured. Please contact support team.');

                    });
                            }).error(function (data) {
                                fnCloseSpinner();
                                toastr.error('', 'Error occured. Please contact support team.');

                            });

                }).error(function (data) {
                    fnCloseSpinner();
                    toastr.error('', 'Error occured. Please contact support team.');

                });
            }).error(function (data) {
                fnCloseSpinner();
                toastr.error('', 'Error occured. Please contact support team.');

            });

        }).error(function (data) {
            fnCloseSpinner();
            toastr.error('', 'Error occured. Please contact support team.');

        });



                    }).error(function (data) {
                        fnCloseSpinner();
                        toastr.error('', 'Error occured. Please contact support team.');

                    });



                   


       


    }).error(function (data) {
        fnCloseSpinner();
        toastr.error('', 'Error occured. Please contact support team.');

    });




    $scope.WFReview = true;
    $scope.WFAttachments = false;
    $scope.WFQuestioner = false;

    
    $scope.questionnaireDetails = [{
        questionnaireName: "FY15 Asian Sponsors(Version 1.1)",
        status: "In progress",
        startedBy: "John Doe",
        date: "Aug 08, 2015"
    },
    {
        questionnaireName: "FY16 Asian Sponsors(Version 1.15)",
        status: "Completed",
        startedBy: "Mary Emerson",
        date: "Aug 05, 2018"
    },
    {
        questionnaireName: "FY17 Asian Sponsors(Version 1.8)",
        status: "In progress",
        startedBy: "Sam Peralta",
        date: "May 08, 2017"
    }
    ];
    $scope.reviewDetails = [{
        reviewer: "Colby Spencer, CELA",
        role: "Area Controller",
        recommendation: "Approve",
        date: "Aug 13, 2014",
        comment: "AngularJS lets you write client-side web applications as if you had a smarter browser. It lets you use good old HTML (or HAML, Jade and friends!) as your template language and lets you extend HTML’s syntax to express your application’s components clearly and succinctly. It automatically synchronizes data from your UI (view) with your JavaScript objects (model) through 2-way data binding. ",
        attachments: [{
            attachmentName: "Evidence.pdf",
            description: "Primis frames lectus sollictudin taciti",
            date: "Aug 13,2016"
        },
        {
            attachmentName: "Thirdparty report.pdf",
            description: "Primis frames lectus sollictudin taciti",
            date: "Aug 13,2016"
        }
        ]
    },
{
    reviewer: "Ariel Bogle",
    role: "LCA Area Lead",
    recommendation: "Approve",
    date: "Aug 10, 2014",
    comment: "It also helps with server-side communication, taming async callbacks with promises and deferreds, and it makes client-side navigation and deeplinking with hashbang urls or HTML5 pushState a piece of cake. Best of all? It makes development fun!",
    attachments: [{
        attachmentName: "Evidence.pdf",
        description: "Primis frames lectus sollictudin taciti",
        date: "Aug 13,2016"
    },
    {
        attachmentName: "Thirdparty report.pdf",
        description: "Primis frames lectus sollictudin taciti",
        date: "Aug 13,2016"
    }
    ]

}
    ]
    $scope.changeClass = function (anchorId) {
        $('.review-head a').removeClass('activeBlue').addClass('fg-lightgray');
        $(anchorId).removeClass('fg-lightgray').addClass('activeBlue');
        switch (anchorId) {
            case '#WFReview':
                $scope.WFReview = true;
                $scope.WFAttachments = false;
                $scope.WFQuestioner = false;
                if ($scope.moved_helpForm == true) {
                    $scope.showHelpText = true;
                }
                else if ($scope.moved_reviewForm == true) {
                    $scope.showReviewForm = true;
}
                break;
            case '#WFAttachments':
                $scope.WFReview = false;
                $scope.WFAttachments = true;
                $scope.WFQuestioner = false;
                
                if ($scope.showReviewForm == true) {
                    $scope.showReviewForm = false
                    $scope.moved_reviewForm = true;
                }
                else if ($scope.showHelpText == true) {
                    $scope.showHelpText = false;
                    $scope.moved_helpForm = true;
    }
                
                break;
            case '#WFQuestioner':
                $scope.WFReview = false;
                $scope.WFAttachments = false;
                $scope.WFQuestioner = true;
                break;
        }

    }
    $scope.showStepDetails = function (e, index) {
        $scope.triggerDisabled = false;
        $scope.selectedStep = index;
        $scope.selectedStepDesc = $scope.stepDetails[$scope.selectedStep - 1]["Step"];
        $scope.selectedStepReview = $scope.stepDetails[$scope.selectedStep - 1]["Reviewer"];
        $scope.selectedStepId = $scope.stepDetails[$scope.selectedStep - 1]["StepId"];
        $scope.stepNo = index;
     
    }

    function lineGraph() {

        var graph = '',completionCount=0;
        for (var i = 0; i < $scope.stepDetails.length; i++) {
            var previous = $scope.stepDetails[i].PreviousStep;
            var current = $scope.stepDetails[i].CurrentStep;
            var future = $scope.stepDetails[i].FutureStep;
            if (previous) {
                completionCount++;
                graph = graph + '<span class="circle circle-click circle-start" ng-click="showStepDetails($event, ' + (i + 1) + ')"><span class="hide">' + i + '</span><img src="./images/circlec.svg" width="17px" height="17px"/></span>';
                if (i != $scope.stepDetails.length - 1) {
                    graph = graph + '<span class="circle-line">&nbsp;</span>';
                } 
            } else {
                if (current) {
                    $scope.selectedStep = i + 1;
                  //  $scope.selectedStepDesc = $scope.stepDetails[$scope.selectedStep - 1]["Step"];
                  //  $scope.selectedStepReview = $scope.stepDetails[$scope.selectedStep - 1]["Reviewer"];
                    if (i == $scope.stepDetails.length - 1) {
                        graph = graph + '<span class="circle-click-blue" ng-click="showStepDetails($event, ' + (i + 1) + ')"><span class="hide">' + i + '</span><img src="./images/circlei.svg" width="25px" height="24px" class="cicrlei-align"/></span>';
                    }
                    else {
                        graph = graph + '<span class="circle-click-blue" ng-click="showStepDetails($event, ' + (i + 1) + ')"><span class="hide">' + i + '</span><img src="./images/circlei.svg"  width="25px" height="24px" class="cicrlei-align"/></span><span class="circle-line">&nbsp;</span>';

                    }

                } else {
                    if (i == $scope.stepDetails.length - 1) {
                        graph = graph + '<span class="circlef circle-click" ng-click="showStepDetails($event, ' + (i + 1) + ')"><span class="hide">' + i + '</span><img src="./images/circle.svg" width="17px" height="17px"/></span>';
                    } else {
                        graph = graph + '<span class="circlef circle-click" ng-click="showStepDetails($event, ' + (i + 1) + ')"><span class="hide">' + i + '</span><img src="./images/circle.svg" width="17px" height="17px"/></span><span class="circle-line">&nbsp;</span>';
                    }
                }
            }
        }
        if ($scope.stepDetails.length == completionCount) {
            $scope.changeFlag = false;
        }
        return graph;
    }
    
    $scope.reviewFile = {};

    $scope.cancelFileUpload = function () {
        $scope.invalidDescription = false;
        $("#revAttachmentDesc").removeClass('error');
        $scope.reviewFile = {};
       

    }
    $scope.data = 'none';
    $scope.addFile = function () {
       
        if ($scope.reviewFile.size > 5000000) {
            toastr.error('', 'Maximum allowed file size is 5 MB');

        }
        else {
            if ($scope.reviewFile.attachmentDesc == undefined || $scope.reviewFile.attachmentDesc == "") {
                $scope.invalidDescription = true;
                $("#revAttachmentDesc").addClass('error');
            }
            else {
                $scope.invalidDescription = false;
                $("#revAttachmentDesc").removeClass('error');
                $scope.bytesArray = [];
               
                var f = document.getElementById('reviewFile').files[0],
                    r = new FileReader();
                r.onloadend = function (e) {
                    var binary = "";
                    var bytes = new Uint8Array(e.target.result);
                    // console.log(bytes);
                    start_uploading();
                    $scope.attUpload = true;
                    angular.forEach(bytes, function (val, key) {
                        $scope.bytesArray.push(val);

                    })
                   
                    var _newReport = {
                        RequestId: $location.search().requestid,
                        Name: f.name,
                        DateTimeCreated: Date(),
                        Description: $scope.reviewFile.attachmentDesc,
                        AttachmentUrl: null,
                        AttachmentID: null,
                        AttachmentExtension: f.name.split('.').pop(),
                        AttachmentSize: $scope.reviewFile.size,
                        AtachmentData: $scope.bytesArray

                    }
                    $timeout(function () {
                        $scope.attachmentDetails.unshift(_newReport);
                        stop_uploading();
                        $scope.attUpload = false;

                    })
                    $scope.reviewFile = {};
                    

                    var length = bytes.byteLength;

                    for (var i = 0; i < length; i++) {
                        binary += String.fromCharCode(bytes[i]);
                    }

                    $scope.data = (binary).toString();

                }
                r.readAsArrayBuffer(f);
            }
        }

    }
    $scope.reviewAttachmentDelete = function (ind) {
        ind = idToDelete;
        $scope.attachmentDetails.splice(ind, 1);
         var dialog;
        dialog = $("#dialogDeleteAttachment").data('dialog');

        dialog.close();
    }
    $scope.uploadReviewFile = function () {
        $(document).find('#reviewFile').click();
        

    }
    $scope.convertToUTC = function (dt) {
        var localDate = new Date(dt);
        var localTime = localDate.getTime();
        var localOffset = localDate.getTimezoneOffset() * 60000;
        return new Date(localTime + localOffset);
    };
    $scope.convertToMB = function (size) {
        var newSize = size / 1000000;
        return Math.round(newSize * 1000) / 1000;
    };
    $scope.convertToPlain = 
        function (html) {
            var tag = document.createElement('div');
            tag.innerHTML = html;

            return tag.innerText;
        }
    $scope.remove = function (item) {
        var index = $scope.bdays.indexOf(item)
        $scope.bdays.splice(index, 1);
    }
    $scope.invalidDesc = function () {
        if ($scope.reviewFile.attachmentDesc == undefined || $scope.reviewFile.attachmentDesc=="") {
            $scope.invalidDescription = true;
            $("#revAttachmentDesc").addClass('error');
        }
        else {
             $scope.invalidDescription = false;
            $("#revAttachmentDesc").removeClass('error');
        }
    }
    var idToDelete = '';
    $scope.attachmentDelete = function (delIndex) {
        var dialog;
        dialog = $("#dialogDeleteAttachment").data('dialog');
        dialog.open();
        idToDelete = delIndex;
        

    }
    $scope.deleteAttachmentCancel = function () {
        var dialog;
        dialog = $("#dialogDeleteAttachment").data('dialog');

        dialog.close();
    }
    var reTrigger;
    var idToTrigger = '';
    $scope.showDialogRetrigger = function (id) {
        if ($scope.stepDetails[$scope.selectedStep - 1]["FutureStep"] == true) {
            toastr.error('', 'Selected step cannot be re-triggered');

        } else {
            reTrigger = $("#dialogRetrigger").data('dialog');
            reTrigger.open();
            idToTrigger = id;
        }
    }
    $scope.reTriggerStep = function (id) {
        id = idToTrigger;
        fnOpenSpinner();
        acDetailsService.retrigger($location.search().requestid, id).success(function (data) {
            var dialog;
            dialog = $("#dialogRetrigger").data('dialog');

            dialog.close();
            fnCloseSpinner();
            window.location.reload();

        }).error(function () {
            fnCloseSpinner();
            var dialog;
            dialog = $("#dialogRetrigger").data('dialog');

            dialog.close();
            toastr.error('', 'Error occured. Please contact support team.');

        });


    }
    $scope.cancelRetrigger = function () {
        var dialog;
        dialog = $("#dialogRetrigger").data('dialog');

        dialog.close();
    }
    $scope.verifyAlias = function (ind, val) {
        console.log(val, $scope.stepDetails[ind].Reviewer);
        $scope.stepDetails[ind].toggleEdit = true;
//val post call
    }
    $scope.cancelEmail = function (ind) {
       // $('e.currentTarget').closest('.grey-border-bottom').find('input').focus();
        $scope.stepDetails[ind].toggleEdit = false;
    }
    $scope.submitList = function () {
        // alert('hello');
        console.log($scope.stepDetails);
        var stepData = [];
        angular.forEach($scope.stepDetails, function (val, i) {
            var stepInfo = { StepId: val.StepId, Reviewer: val.Reviewer, Step: val.Step };
            stepData.push(stepInfo);


        });
        console.log("stepInfo", stepData);
    }
    function start_uploading() {
        $(document).find('#upload-review-file').addClass('position-relative');
        $(document).find('#upload-spinner-review').addClass('position-absolute');
    }
    function stop_uploading() {
        $(document).find('#upload-review-file').removeClass('position-relative');
        $(document).find('#upload-spinner-review').removeClass('position-absolute');
    }
    $('.textareaReview').find('#commentRequired').hide();
    function configureText(jhtmlEditor) {
       

        $($(jhtmlEditor.editor.body)).keyup(function (e) {
            if ($('#reviewerComments').val().indexOf('&nbsp') > 0 || $('#reviewerComments').val() == "" || (($('#reviewerComments').val().indexOf('<div><br></div>') > -1) && ($('#reviewerComments').val() == "<div><br></div>"))) {
                
                $('.textareaReview ').find('.jHtmlArea').addClass('error');
                $('.textareaReview').find('#commentRequired').show();
            }
            else {
                $('.textareaReview ').find('.jHtmlArea').removeClass('error');
                $('.textareaReview').find('#commentRequired').hide();

            }
            
        });
        
        
    }
});
vettingApp.controller('reportController', function ($scope, $http, $location, $compile, acDetailsService, toastr,$timeout) {
    $scope.reportDetails = [];
    $scope.reportUpload = false;

    fnOpenSpinner();
    acDetailsService.getReports($location.search().requestid).success(function (data) {
        fnCloseSpinner();
        $scope.reportDetails = data;
            
    }).error(function (data) {
          fnCloseSpinner();
          toastr.error('', 'Error occured. Please contact support team.');

    });
    var idToDelete = '';
    var _url=''
    $scope.deleteAttachment = function (id, url) {
        idToDelete = id;
        _url = url;
        var dialog;
        dialog = $("#dialogDeleteReport").data('dialog');
        dialog.open();
        


    }
    $scope.deleteReportCancel = function () {
        var dialog;
        dialog = $("#dialogDeleteReport").data('dialog');

        dialog.close();
    }
    $scope.deleteReport = function (id, url) {
        id = idToDelete;
        url = _url;
        angular.forEach($scope.reportDetails, function (val, i) {
            if (val.AttachmentID == id) {
                var param = {
                    "AttachmentUrl": url,
                    "AttachmentID": id
                }
                        fnOpenSpinner();

                $http.post('api/evidence/DeleteAttachment', param).success(function () {
                    fnCloseSpinner();

                    $scope.reportDetails.splice(i, 1);
                    var dialog;
                    dialog = $("#dialogDeleteReport").data('dialog');

                    dialog.close();
                }).error(function () {
                    fnCloseSpinner();
                    var dialog;
                    dialog = $("#dialogDeleteReport").data('dialog');

                    dialog.close();
                    toastr.error('', 'Error occured. Please contact support team.');

                });
                
            }
        });
    }
    $scope.uploadFile = function () {
      
        $(document).find('#file').click();
    }
    $scope.myFile = null;
    $scope.cancelUpload = function () {
       
        $scope.myFile = null;
     
    }
    

    //file upload function
    $scope.uploading = false;
    $scope.data = 'none';
    $scope.add = function () {



        if ($scope.myFile.size > 5000000) {
            toastr.error('', 'Maximum allowed file size is 5 MB');

        }
        else {
            if ($scope.myFile.attachmentDesc == undefined || $scope.myFile.attachmentDesc == "") {
                $scope.invalid_Description = true;
                $("#reportDesc").addClass('error');
            }
            else {

                $scope.invalid_Description = false;
                $("#reportDesc").removeClass('error');
                $scope.bytesArray = [];

                var f = document.getElementById('file').files[0],
                    r = new FileReader();
                r.onloadend = function (e) {
                    var binary = "";
                    var bytes = new Uint8Array(e.target.result);
                    startUploading();
                    $scope.reportUpload = true;
                    angular.forEach(bytes, function (val, key) {
                        $scope.bytesArray.push(val);

                    })
                   
                    var fileName = $scope.myFile.name;
                    var fileparams = {
                        "RequestId": $location.search().requestid,
                        "Name": $scope.myFile.name,
                        "Description": $scope.myFile.attachmentDesc,
                        "AttachmentUrl": null,
                        "AttachmentID": null,
                        "AttachmentExtension": fileName.split('.').pop(),
                        "AttachmentSize": $scope.myFile.size,
                        "AtachmentData": $scope.bytesArray
                    }
                   
                    
                    acDetailsService.postReportAttachment(fileparams).success(function (data) {
                        var newReport = {
                            Name: data.Name,
                            DateTimeCreated: data.DateTimeCreated,
                            Description: data.Description,
                            AttachmentUrl: data.AttachmentUrl
                        }
                        $scope.reportDetails.unshift(newReport);
                        stopUploading();
                        $scope.reportUpload = false;
                        $scope.myFile = null;
                        toastr.success('', 'File uploaded');
                        document.body.scrollTop = document.documentElement.scrollTop = 0;

                    }).error(function (data) {
                        stopUploading();
                        $scope.reportUpload = false;
                        toastr.error('', 'Error occured. Please contact support team.');

                    });
                    
                    var length = bytes.byteLength;

                    for (var i = 0; i < length; i++) {
                        binary += String.fromCharCode(bytes[i]);
                    }

                    $scope.data = (binary).toString();

                }
                r.readAsArrayBuffer(f);

            }
        }
    }
    var interval1;
    $scope.runPB1 = function () {
        clearInterval(interval1);
        $('#pb1').removeClass('hide');
        var pb = $("#pb1").data('progress');
        var val = 0;
        interval1 = setInterval(function () {
            val += 1;
            pb.set(val);
            if (val >= 100) {
                val = 0;
                clearInterval(interval1);
        }
        }, 100);
        }
    $scope.convertToMB = function (size) {
        var newSize = size / 1000000;
        return Math.round(newSize * 1000) / 1000;
    };
    $scope.invalidDesc = function () {
        if ($scope.myFile.attachmentDesc == undefined || $scope.myFile.attachmentDesc == "") {
            $scope.invalid_Description = true;
            $("#reportDesc").addClass('error');
        }
        else {
            $scope.invalid_Description = false;
            $("#reportDesc").removeClass('error');
        }
    }
            function flashPB1() {
        clearInterval(interval1);
        var pb = $("#pb1").data('progress');
        pb.set(0);
        }

            function startUploading() {
        $(document).find('#upload-file-block').addClass('position-relative');
        $(document).find('#upload-spinner').addClass('position-absolute');
        }
            function stopUploading() {
        $(document).find('#upload-file-block').removeClass('position-relative');
        $(document).find('#upload-spinner').removeClass('position-absolute');
        }
});
