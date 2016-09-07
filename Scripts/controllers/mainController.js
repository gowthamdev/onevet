/// <reference path="mainController.js" />
var vettingApp = angular.module('acVnext', ['ngRoute', 'mgo-angular-wizard', 'datatables', 'toastr', 'acVnext.services']);


vettingApp.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: '/Home/Home',
            controller: 'mainController'
        })
        .when('/requests', {
            templateUrl: '/Home/Requests/',
            controller: 'requestsController'
        })

          .when('/requestSummary', {
              templateUrl: '/Home/requestSummary/',
              controller: 'requestsController'
          })
         .when('/entitySummary', {
             templateUrl: '/Home/entitySummary/',
             controller: 'requestsController'
         })
        .when('/singleRequest', {
            templateUrl: '/Home/singleRequest/',
            controller: 'singleRequestController'
        })

        .when('/admin', {
            templateUrl: '/Home/Admin/',
            controller: 'adminController'
        })

         .when('/systemSettings', {
             templateUrl: '/Home/Permissions/',
             controller: 'groupController'
         })
         .when('/onBoarding', {
             templateUrl: '/Home/OnBoarding/',
             controller: 'groupController'
         })
        .when('/newQuestionnaire', {
            templateUrl: '/Home/newQuestionnaire/',
            controller: 'newQuestionnaireController'
        })

        .when('/newWorkflow', {
            templateUrl: '/Home/newWorkflow',
            controller: 'newWorkflowController'
        })

        .when('/newWorkflow/:id', {
            templateUrl: '/Home/newWorkflow/',
            controller: 'newWorkflowController'
        })
        .when('/newQuestionnaire/:questionnaireVersionId', {
            templateUrl: '/Home/newQuestionnaire/',
            controller: 'newQuestionnaireController'
        }
         )

        .when('/newQuestionnaireStep2', {
            templateUrl: '/Home/newQuestionnaireStep2/',
            controller: 'newQuestionnaireStep2'
        })
            .when('/step2Edit', {
                templateUrl: '/Home/step2Edit/',
                controller: 'newQuestionnaireStep2Edit'
            })
        .when('/workflowLanding', {
            templateUrl: '/Home/workflowLanding/',
            controller: 'workflowLandingController'
        })
        .when('/workFlowStep2', {
            templateUrl: '/Home/workFlowStep2',
            controller: 'workFlowStep2'
        })
            .when('/acDetails', {
                templateUrl: '/Home/acDetails',
                controller: 'acDetails'
            });
});

vettingApp.controller('newQuestionnaireStep2Edit', function ($scope, $http, $location, $sce) {
    var languageId = "192C79DD-B246-4BF2-B297-A36338981F99";
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    var questSpinnerdialog = $('#spinnerDialog').data('dialog');
    questSpinnerdialog.open();
    $http.get('api/question/GetQuestionPageTitles?questionnaireVersionId=' + $location.search().questionnaireId + '&languageId=192C79DD-B246-4BF2-B297-A36338981F99').success(function (data) {

        stepTwoDataBinding(data);

    })

    $scope.previewQuestionnaire = function (e) {
        e.stopPropagation();
        var questionnaireVersionId = $location.search().questionnaireId;

        showDialog("#spinnerDialog");

        $http.get("/api/Questionnaire/GetQuestionnaireByQuestionnaireVersionId?QuestionnaireVersionId=" + questionnaireVersionId).success(
        function (result) {
            $scope.questionnaireName = result.QuestionnaireName;
            $scope.questionnaireIntro = result.QuestionnaireIntro;
            $scope.questionnaireThankYou = result.HelpText;
        }).error(
                                    function () {
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
                showDialog("#dialogPreviewQuestionnaire");
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
        }).error(
                                    function () {
                                        fnCloseSpinner();
                                        showDialog("#dialogPreviewQuestionnaire");
                                    }
                                    );

    }


    $scope.goToWizard = function ($event) {
        $event.stopPropagation();
        $scope.questionnairePreviewPercentageComplete = 0;
        $scope.questionnairePreviewCurrentPageNumber = 1;
        $scope.questionnairePreviewPageCount = $("#previewWizard").find(".step").length;
        if ($scope.questionnairePreviewPageCount > 0) {
            $("#previewWizard").wizard(
                {
                    onPage: function (page, wiz) {
                        //alert(page);
                        var scope = angular.element($("#previewWizard")).scope();
                        if (scope) {
                            scope.$apply(function () {
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
                                    }).error(
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
                            });
                        }
                        return true;
                    },
                    onFinish: function (page, wiz) {
                        //alert('finish:' + page);
                        $("#previewWizard").hide();
                        $(".previewHeadingRight").attr("style", "display: none !important");
                        $(".previewBye").show();
                    }
                }
            );
            $(".wizard .stepper>ul").attr("style", "width: " + (($scope.questionnairePreviewPageCount - 1) * 45) + "px!important");
            $(".previewWelcome").hide();
            $("#previewWizard").show();
            // Not showing percentage complete in Questionnaire Preview for now
            //$(".previewHeadingRight").attr("style", "display: block !important");
        }
        else {
            $(".previewWelcome").hide();
            $(".previewBye").show();
        }
    }

    $scope.showChildQuestionsSingleChoice = function (branchingQuestionVersionIds, questionVersionId) {
        $('input[name=' + questionVersionId + ']').each(function (index, value) {
            var questionsToHide = $.parseJSON(this.attributes["branchingquestion"].value);
            $.each(questionsToHide, function (index, value) {
                $("#question" + value + "  div.questionHide").attr("style", "display: none !important");
            });
        });

        var questionsToShow = branchingQuestionVersionIds;
        $.each(questionsToShow, function (index, value) {
            $("#question" + value + "  div.questionHide").attr("style", "display: block !important");
            if ($("#question" + value).length)
                $(".steps").scrollTop($("#question" + value).position().top);
        });
    }

    $scope.showChildQuestionsMultipleChoice = function (childQuestionGroups, questionVersionId) {
        var count = 0;

        $('input[name=' + questionVersionId + ']').each(function (index, value) {
            if (this.checked)
                count++;
        });

        $.each(childQuestionGroups, function (index, childQuestion) {
            $("#question" + childQuestion.ChildQuestionId + "  div.questionHide").attr("style", "display: none !important");
        });

        $.each(childQuestionGroups, function (index, childQuestion) {
            var show = true;

            $.each(childQuestion.OptionIds, function (index, value) {
                var $checkbox = $('input[name=' + questionVersionId + '][value=' + value + ']');
                if ($checkbox.is(':checked') == false)
                    show = false;
            });

            if (show && count === childQuestion.OptionIds.length) {
                $("#question" + childQuestion.ChildQuestionId + "  div.questionHide").attr("style", "display: block !important");
                $(".steps").scrollTop($("#question" + childQuestion.ChildQuestionId).position().top);
            }
        });
    }

    $scope.renderHtml = function (htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    }

    $scope.redirectToStep1 = function () {
        var url = '/newQuestionnaire?id=' + $location.search().questionnaireId;
        $location.url(url);
    }





    $scope.publishAndRedirect = function () {
        $http.put('api/questionnaire/MarkQuestionnaireAsPublished?questionnaireVersionId=' + $location.search().questionnaireId).success(function () {
            $location.url('/admin');
        }).error(
            function () {
                window.alert("Error occured while publishing questionnaire. Please contact support team.");
            }
        );
    }

    $scope.redirectWithoutSave = function () {
        var pageTarget = $('ul.accordion>li:last-child');
        var newPageLength = pageTarget.find('.editPageTxt ').children().length;
        if (newPageLength == 0) {
            //pge input validation
            if (pageTarget.find("input[type='text']").val()) {
                if (pageTarget.find("input[type='text']").hasClass('error')) {
                    pageTarget.find("input[type='text']").removeClass('error');
                    pageTarget.find("input[type='text']").next().find('label').hide();

                }
            } else {
                pageTarget.find("input[type='text']").addClass('error');
                pageTarget.find("input[type='text']").next().find('label').show();
                pageTarget.find("input[type='text']").next().show();
            }
            //page textarea validation
            if (pageTarget.find('textarea').val().length > 0) {
                if (pageTarget.find('.jHtmlArea').hasClass('error')) {
                    pageTarget.find('.jHtmlArea').removeClass('error');

                    pageTarget.find('.jHtmlArea').next().hide();
                }



            } else {

                pageTarget.find('.jHtmlArea').addClass('error');

                pageTarget.find('.jHtmlArea').next().show();
            }
            //there is no error
            if (pageTarget.find('.error').length == 0) {
                var pgTitle = pageTarget.find("input[type='text']").val();
                var pgIntro = pageTarget.find('textarea').val();
                var page_details = {

                    questionId: null,
                    dateTimeChanged: null,
                    dateTimeCreated: null,
                    isDeleted: 0,
                    answerType: null,
                    isActive: 1,
                    isMandatory: 0,
                    questionVersionId: null,
                    questionVersionNumber: null,
                    questionText: null,
                    questionContent: null,
                    questionHelpText: null,
                    sectionOrder: pageTarget.index() + 1,

                    questionnaireVersionId: $location.search().questionnaireId,
                    pageTitle: pageTarget.find("input[type='text']").val(),
                    languageId: "192C79DD-B246-4BF2-B297-A36338981F99",
                    displayOrder: null,
                    parentQuestionVersionId: null,

                    questionOptionsArray: null,
                    questionWeightsArray: null,
                    questionOptionAndWeight: null,
                    answerTypeId: null,
                    questionConditionArray: null,
                    pageIntro: pageTarget.find('textarea').val()

                }
                $http.post('api/question/SavePageWithNoQuestionIntoQuestionnaire', page_details).success(function (data) {
                    $location.url('/admin');

                }).error(
                    function () {
                        fnCloseSpinner();
                        window.alert("Error occured while saving page. Please contact support team.");
                    }
                );
                //
            }
        } else {
            $location.url('/admin');
        }
    }






    $(document).on('click', ".pageCancel", function (e) {
        e.preventDefault();
        e.stopPropagation();

        toggleArrow($(this).closest('ul.inner').parent().find('.editPageTxt'));




        $(this).closest('li').hide();

        $('a.toggle').prop('disabled', false);
        $('a.toggle').removeClass('disableHeader');
        $('.newChildQustLink').removeClass('disablePage');
        $('.previewQuestions').attr('disabled', false);
        $('.submitQuestions').attr('disabled', false);
        $('.saveQuestions').attr('disabled', false);
        $('.addNewQuest').removeClass('disablePage');

        $('.editNewChildQuestion').removeClass('disablePage');
        $('.newPageCreate').removeClass('disablePage');
        $('.editNewQuestion').removeClass('disablePage');

    });







    $(document).on('click', ".pageDone", function (e) {
        e.preventDefault();



        var pageTarget = $(this).closest('ul.inner').parent();
        //pge input validation
        if (pageTarget.find("input[type='text']").val()) {
            if (pageTarget.find("input[type='text']").hasClass('error')) {
                pageTarget.find("input[type='text']").removeClass('error');
                pageTarget.find("input[type='text']").next().find('label').hide();

            }
        } else {
            pageTarget.find("input[type='text']").addClass('error');
            pageTarget.find("input[type='text']").next().find('label').show();
            pageTarget.find("input[type='text']").next().show();
        }
        //page textarea validation
        if (pageTarget.find('.txtAreaWidth').val().length > 0) {
            if (pageTarget.find('.jHtmlArea').hasClass('error')) {
                pageTarget.find('.jHtmlArea').removeClass('error');

                pageTarget.find('.jHtmlArea').next().hide();
            }



        } else {

            pageTarget.find('.jHtmlArea').addClass('error');

            pageTarget.find('.jHtmlArea').next().show();
        }
        //there is no error
        if (pageTarget.find('.error').length == 0) {


            var questSpinnerdialog = $('#spinnerDialog').data('dialog');
            questSpinnerdialog.open();

            var that = this;
            var selector = $(that).closest('ul.inner').parent();

            var pageDetails = {
                questionnaireVersionSectionId: selector.find('.pageHidden').val(),
                pageTitle: selector.find('.editPageTitle').val(),
                pageIntro: selector.find('.txtAreaWidth').val(),
                languageId: "192C79DD-B246-4BF2-B297-A36338981F99"

            }
            $http.put('api/question/UpdateQuestionPage', pageDetails).success(function () {
                questSpinnerdialog.close();

                selector.find('.editPageTxt').text('Page ' + (selector.index() + 1) + '-' + selector.find('.editPageTitle').val());
                toggleArrow(selector.find('.editPageTxt'));

                selector.find('.editPageTxt').append('<span class="ms-Icon ms-Icon--trash place-right deletePage" onclick="showDialogDeletePage(event)"></span>');
                $(that).closest('li').hide();
                $('a.toggle').prop('disabled', false);
                $('a.toggle').removeClass('disableHeader');

                $('.previewQuestions').attr('disabled', false);
                $('.submitQuestions').attr('disabled', false);
                $('.saveQuestions').attr('disabled', false);
                $('.newChildQustLink').removeClass('disablePage');
                $('.editNewChildQuestion').removeClass('disablePage');
                $('.newPageCreate').removeClass('disablePage');
                $('.editNewQuestion').removeClass('disablePage');

                $('.addNewQuest').removeClass('disablePage');
            }).error(function () {
                fnCloseSpinner();
                window.alert("Error occured while updating page. Please contact support team.");
            });
        }
    });
    var questDisplayOrder;
    var childQuestDisplayOrder;
    var _sectionOrder;



    $(document).on('click', ".questionCancel", function (e) {
        e.stopPropagation();

        toggleArrow($(this).closest('ul.inner').parent().find('.editQuestionTxt'));
        $(this).closest('li').hide();

        $(this).closest('div.inner').children().remove();
        $('a.toggle').prop('disabled', false);
        $('a.toggle').removeClass('disableHeader');

        $('.previewQuestions').attr('disabled', false);
        $('.submitQuestions').attr('disabled', false);
        $('.saveQuestions').attr('disabled', false);

        $('.editNewChildQuestion').removeClass('disablePage');
        $('.newPageCreate').removeClass('disablePage');
        $('.editNewQuestion').removeClass('disablePage');
        $('.newChildQustLink').removeClass('disablePage');

    })


    $(document).on('click', ".childQuestionCancel", function (e) {
        e.stopPropagation();
        $('a.toggle').prop('disabled', false);
        $('a.toggle').removeClass('disableHeader');
        $('.previewQuestions').attr('disabled', false);
        $('.submitQuestions').attr('disabled', false);
        $('.saveQuestions').attr('disabled', false);
        $('.newChildQustLink').removeClass('disablePage');
        $('.editNewChildQuestion').removeClass('disablePage');
        $('.newPageCreate').removeClass('disablePage');
        $('.editNewQuestion').removeClass('disablePage');
        toggleArrow($(this).closest('li').find('.editChildQuestTxt'));
        $(this).closest('div.inner').hide();
        $(this).closest('div.inner').children().remove();
    })
    var childQuestAnswerTypeId;
    var childQuestOptionIdArray = [];
    var answerTypesArray = [];
    var answerTypeDynamic = '';
    $.ajax({
        url: 'api/question/GetAnswerTypes',
        type: 'GET',
        success: function (data) {
            answerTypesData = data;
            $.each(data, function (i, val) {

                answerTypesArray.push(val.AnswerTypeLocalizedtext);
            });
        },
        error: function (data) {
            fnCloseSpinner();
            window.alert("Error while retrieving answer types. Please try again.");
        }
    });
    $(document).on('click', ".editChildQuestTxt", function (e) {

        e.preventDefault();
        e.stopPropagation();
        toggleArrow($(this));
        var questSpinnerdialog = $('#spinnerDialog').data('dialog');
        questSpinnerdialog.open();
        childQuestAnswerTypeId = '';
        var editchildQuestionId = $(this).next().find('.childQuestionHidden').val();
        var childQuestionInfo;
        var that = this;
        var optionWeightArr = [];
        var optionObj = {};
        var childRelation;
        var equalityRelation = '';
        var selectedOpt = [];
        var requiredField = '';
        var parentType = '';
        $http.get('api/question/GetQuestionByQuestionVersionId?questionVersionId=' + editchildQuestionId + '&languageId=192C79DD-B246-4BF2-B297-A36338981F99').success(function (data) {
            questSpinnerdialog.close();
            setTimeout(function () {
                var items = ["bold", "italic", "underline", "link", "unlink", "orderedlist", "unorderedlist"];
                $('.hide-side-bar').find('.textarea').find("textarea").htmlarea({
                    toolbar: [
                      ["bold"], ["italic"], ["underline"],
                      ["link"], ["unlink"], ["orderedList"], ["unorderedList"]
                    ],
                    loaded: function () {
                        configureEditor(this);
                    }
                });
                items.forEach(function (type) {
                    $("a." + type).attr("tabindex", "-1");
                });
            }, 500);
            childQuestionInfo = data;
            _sectionOrder = data.SectionOrder;
            childQuestDisplayOrder = data.DisplayOrder;
            requiredField = childQuestionInfo.IsRequired;
            parentType = childQuestionInfo.ParentAnswerType;
            childQuestAnswerTypeId = data.QuestionOptions[0].AnswerTypeId;
            childRelation = childQuestionInfo.QuestionOptions[0].ChildToParentRelationship.split(",");
            equalityRelation = childRelation[0];
            $.each(childRelation, function (i, val) {
                if (i > 0) {
                    selectedOpt.push(val);
                }
            });
            $.each(childQuestionInfo.QuestionOptions, function (i, val) {

                optionObj = {};
                optionObj['option'] = val.OptionText;
                optionObj['weight'] = val.QuestionOptionWeight;
                optionObj['optionid'] = val.OptionId;
                optionWeightArr.push(optionObj);
            });

            answerTypeDynamic = '';
            $.each(answerTypesArray, function (i, val) {
                answerTypeDynamic = answerTypeDynamic + '<option>' + val + '</option>';
            });

            var optionsEle = '', mandatoryField, optionLabel = '';

            $.each(optionWeightArr, function (i, val) {
                if (childQuestionInfo.AnswerType == "Single Choice" || childQuestionInfo.AnswerType == "Multiple Choice") {
                    optionLabel = '<label class="alignLeft">Options</label>';
                    optionsEle = optionsEle +
'<div class="input-control text  alignLeft top_Margin">' +
              ' <input type="text" class="questionOption inputBorder" data-optionid="' + val.optionid + '" name="editQuestionName" value="' + val.option + '"><div class="errorMargin"><label class="alignLeft errorText">Please Enter Option</label></div></div>' +
              '<div class="input-control text  place-left weightWidth top_Margin">' +
              ' <input type="text" class="questionWeight inputBorder" name="weight" value="' + val.weight + '"><div class="errorMargin"><label class="alignLeft errorText weightFont">Please Enter Appropriate Weight</label></div></div>';
                    if (optionWeightArr.length - 1 == i) {
                        optionsEle = optionsEle +
'<div class="add-option place-left" id="addOption"><span class="ms-Icon ms-Icon--plus"></span></div>';
                    } else {
                        optionsEle = optionsEle +
'<div class="delete-option place-left" id="deleteOption"><span class="ms-Icon ms-Icon--minus"></span></div>';
                    }
                } else if (childQuestionInfo.AnswerType == "Attachment" || childQuestionInfo.AnswerType == "Free Text") {
                    optionLabel = ''
                    optionsEle = '';
                } else if (childQuestionInfo.AnswerType == "Data List") {
                    optionLabel = '<label class="alignLeft">Options</label>';
                    optionsEle = optionsEle +
                      '<label class="alignLeft">Options</label><div class="input-control text  alignLeft">' +
                 ' <input type="text" placeholder="Field title" class="questionOption inputBorder" data-optionid="' + val.optionid + '" name="editQuestionName" value="' + val.option + '"><div class="errorMargin"><label class="alignLeft errorText">Please Enter Option</label></div></div>';
                    if (optionWeightArr.length - 1 == i) {
                        optionsEle = optionsEle +
'<div class="add-option place-left" id="addDataListOption"><span class="ms-Icon ms-Icon--plus"></span></div>';
                    } else {
                        optionsEle = optionsEle +
'<div class="delete-option place-left" id="deleteOption"><span class="ms-Icon ms-Icon--minus"></span></div>';
                    }
                }

            });
            var newAnsOptions = '', ansToParent = '', ansblock = '';

            $.each(childQuestionInfo.ParentOptions, function (i, val) {
                if (val != "ISREQUIRED") {
                    newAnsOptions += "<option>" + val + "</option>"
                }
            })
            var dynamicCls;
            if (requiredField === true) {
                dynamicCls = "answerTo disablePage";
            } else {
                dynamicCls = "answerTo";
            }

            if (parentType == "Multiple Choice") {

                multipleSelect = 'to&nbsp' + '<select id="select" class = "optionClass" multiple>' + newAnsOptions + '</select>';
                ansToParent = '<div class="' + dynamicCls + '"><label class="alignLeft marginForAnsText">Answer to parent question</label>' +
            '<div class="input-control margin10 no-margin-left no-margin-right no-margin-top alignLeft widthSelector" data-role="select">' +
             '<select id="select" class="equality">' +
                '<option>is equal</option><option>is not equal</option>' +

             '</select></div>' +
             '<div class="input-control margin10 no-margin-right no-margin-top place-left widthSelector marginForOptions" data-role="select">' +
             multipleSelect +
                '</div></div>';
                mandatoryField = (requiredField === true) ? '<input type="checkbox" class="editChildBox" name="questionRequired" value="0" checked>' : '<input type="checkbox" class="editChildBox" name="questionRequired" value="0">';


            }
            else if (parentType == "Attachment" || parentType == "Free Text" || parentType == "Data List") {
                mandatoryField = (requiredField === true) ? '<input type="checkbox" class="editChildBox" name="questionRequired" value="0" checked disabled>' : '<input type="checkbox" class="editChildBox" name="questionRequired" value="0" disabled>'
                ansToParent = '';
            } else if (parentType == "Single Choice") {
                mandatoryField = (requiredField === true) ? '<input type="checkbox" class="editChildBox" name="questionRequired" value="0" checked>' : '<input type="checkbox" class="editChildBox" name="questionRequired" value="0">'

                multipleSelect = 'to&nbsp' + '<select id="select" class = "optionClass">' + newAnsOptions + '</select>';
                ansToParent = '<div class="' + dynamicCls + '"><label class="alignLeft marginForAnsText">Answer to parent question</label>' +
            '<div class="input-control margin10 no-margin-left no-margin-right no-margin-top alignLeft widthSelector" data-role="select">' +
             '<select id="select" class="equality">' +
                '<option>is equal</option><option>is not equal</option>' +

             '</select></div>' +
             '<div class="input-control margin10 no-margin-right no-margin-top place-left widthSelector marginForOptions" data-role="select">' +
             multipleSelect +
                '</div></div>';

            }


            var childQquestCnt = '<div class="editCreateChildQuestion">' +
 '<label class="input-control checkbox alignLeft">' + mandatoryField + '<span class="check inputBorder"></span><span class="caption">&nbsp;Required</span></label>' +
ansToParent +
 '<label class="alignLeft">Question Text</label><div class="input-control text width42 alignLeft">' +
' <input type="text" class="editChildQuestionName inputBorder questWidth" name="editChildQuestionName" value="' + childQuestionInfo.QuestionText + '"><div class="errorMargin"><label class="alignLeft errorText">Please Enter Question Title</label></div></div>' +
   '<label class="alignLeft top_Margin">Description</label>' +
   '<div class="input-control textarea alignLeft">' +
   '<textarea id="child_Intro" class="txtAreaWidth inputBorder fieldWidth" name="editChildQuestionExplanation">' + childQuestionInfo.QuestionContent + '</textarea><div class="errorMargin"><label id="errorChildIntro" class="error_Message marginNone">Please Enter Question Description</label></div></div>' +
    '<label class="alignLeft top_Margin">Tooltip</label><div class="input-control text width42 alignLeft">' +
'<input type="text" class="editChildQuestionTolltip inputBorder questWidth" name="editChildQuestionTolltip" value="' + childQuestionInfo.QuestionHelpText + '"><div class="errorMargin"><label class="alignLeft errorText">Please Enter Question Tooltip</label></div></div>' +
'<label class="alignLeft top_Margin">Answer Type</label>' +
'<div class="input-control margin10 no-margin-left no-margin-right no-margin-top place-left clearLeft widthSelect2" data-role="select">' +
 '<select id="select editChildQuestionAnswerType" class="editChildQuestionAnswerType">' +
              answerTypeDynamic +
             '</select>' +
'</div>' + optionLabel +
'<div class="lastOption">' + optionsEle + '</div>' +

'<div class="buttonDoneCancel alignLeft"><div class="childQuestionDone actionButtonDone"><img src="/images/generic-tick-small-accent@2x.png">&nbsp;Done</div><div class="childQuestionCancel actionButtonCancel margin80"><img src="/images/generic-cross-12px-accent@2x.png">&nbsp;Cancel</div></div>' +
 '</div>';
            $(that).closest('li').find('div.inner').html(childQquestCnt);
            $(that).closest('li').find('div.inner').toggle();
            if ($(that).closest('li').find('div.inner').css('display') !== 'none') {
                $('a.toggle').prop('disabled', true);
                $('a.toggle').addClass('disableHeader');
                $(that).removeClass('disableHeader');

                $('.previewQuestions').attr('disabled', true);
                $('.submitQuestions').attr('disabled', true);
                $('.saveQuestions').attr('disabled', true);

                $('.newChildQustLink').addClass('disablePage');
                $('.editNewChildQuestion').addClass('disablePage');
                $('.newPageCreate').addClass('disablePage');
                $('.editNewQuestion').addClass('disablePage');

                $('.addNewQuest').addClass('disablePage');

            }
            $(that).closest('li').find('.editChildQuestionAnswerType').val(childQuestionInfo.AnswerType);
            if ($(that).closest('li').find('.equality').length > 0) {
                $(that).closest('li').find('.equality').val(equalityRelation);
            }
            if ($(that).closest('li').find('.optionClass').length > 0) {

                $(that).closest('li').find('.optionClass').val(selectedOpt);
            }
        }).error(function () {
            fnCloseSpinner();
            window.alert("Error occured while retrieving question details from server. Please try again.");
        });

    });
    $(document).on('click', ".childQuestionDone", function (e) {
        e.stopPropagation();
        e.stopImmediatePropagation();
        childQuestOptionIdArray = [];
        var questionTarget = $(this).closest('li');
        //question input validation
        $.each(questionTarget.find("input[type='text']"), function (i, val) {
            if ($(this).val()) {
                if ($(this).hasClass('error')) {
                    $(this).removeClass('error');
                    $(this).next().find('label').hide();
                }
            } else {
                $(this).addClass('error');
                $(this).next().find('label').show();
            }
        });
        //weight validation
        $.each(questionTarget.find('.questionWeight'), function (i, val) {
            if ($(this).val() != "" && isNaN($(this).val()) == false) {

                if ($(this).hasClass('error')) {
                    $(this).removeClass('error');
                    $(this).next().find('label').hide();
                }
            } else {
                $(this).addClass('error');
                $(this).next().find('label').show();
            }

        });
        //question textarea validation
        if (questionTarget.find('textarea').val().length > 0) {
            $('.saveQuestions').attr('disabled', false);
            if (questionTarget.find('.jHtmlArea').hasClass('error')) {
                questionTarget.find('.jHtmlArea').removeClass('error');
                questionTarget.find('.jHtmlArea').next().find('label').hide();
            }



        } else {

            questionTarget.find('.jHtmlArea').addClass('error');
            questionTarget.find('.jHtmlArea').next().find('label').show();
        }
        //there is no error
        if (questionTarget.find('.error').length == 0) {

            var questSpinnerdialog = $('#spinnerDialog').data('dialog');
            questSpinnerdialog.open();
            var that = this;
            var selector = $(that).closest('li');
            var editFormObj = {}, editoptionsWeightsArray = [], editQuestOptArr = [],
            childQuestionHiddenId = selector.find('.childQuestionHidden').val();

            var selectVal = $(this).closest('.editCreateChildQuestion').find('.editChildQuestionAnswerType').val().trim();


            if (selectVal == "Multiple Choice" || selectVal == "Single Choice" || selectVal == "Data List") {

                $(this).closest('.editCreateChildQuestion').find('.questionOption').each(function (k, v) {
                    var r = k + 1;
                    editFormObj = {};

                    editFormObj['Option'] = $(this).val();

                    if ($(this).parent().next().find('.questionWeight').val() != undefined) {
                        editFormObj['Weight'] = $(this).parent().next().find('.questionWeight').val();
                    }
                    else {
                        editFormObj['Weight'] = "";

                    }

                    editoptionsWeightsArray.push(editFormObj);


                });


            }
            else if (selectVal == "Attachment" || selectVal == "Free Text") {
                editFormObj['Option'] = "";
                editFormObj['Weight'] = "";

                editoptionsWeightsArray.push(editFormObj);

            }



            $(this).closest('.editCreateChildQuestion').find('.questionOption').each(function (k, v) {

                editQuestOptArr.push($(this).val());
                childQuestOptionIdArray.push($(this).attr('data-optionid'));
            });



            $.each(editoptionsWeightsArray, function (i, v) {
                if (childQuestOptionIdArray[i] != null)
                    v['OptionId'] = childQuestOptionIdArray[i];
                else
                    v['OptionId'] = '00000000-0000-0000-0000-000000000000';
            });

            var arrayEquality = [];
            var arrayForCondition;
            var equailityIs;
            var optionsAre;
            if ($(this).closest('div.inner').find('input[name="questionRequired"]').prop('checked') == false) {
                optionsAre = selector.find('.optionClass').val();
                equailityIs = selector.find('.equality').val();
            }
            else {
                optionsAre = "isrequired";
                equailityIs = "is equal";
            }
            arrayEquality.push(equailityIs);

            arrayForCondition = arrayEquality.concat(optionsAre);






            var childQuestionDetails = {
                questionVersionId: childQuestionHiddenId,
                questionId: null,
                questionnaireVersionId: $location.search().questionnaireId,
                questionVersionLocalizedTextId: null,
                languageId: "192C79DD-B246-4BF2-B297-A36338981F99",
                questionVersionNumber: null,
                isMandatory: 0,
                answerType: selector.find('.editChildQuestionAnswerType').val(),
                questionText: selector.find('.editChildQuestionName').val(),
                questionHelpText: selector.find('.editChildQuestionTolltip').val(),
                sectionOrder: _sectionOrder,
                questionConditionArray: arrayForCondition,
                questionContent: selector.find('.txtAreaWidth').val(),
                isActive: 1,
                isDeleted: 0,
                dateTimeCreated: null,
                dateTimeChanged: null,
                questionOptionsArray: editQuestOptArr,
                questionOptionAndWeight: editoptionsWeightsArray,
                displayOrder: childQuestDisplayOrder,
                displayProperties: null,
                answerTypeId: childQuestAnswerTypeId,
                parentQuestionVersionId: $(this).closest('li').parent().find('.questionHidden').val(),
                pageTitle: $(this).closest('ul.inner').parent().parent().find('.editPageTitle').val(),
                pageIntro: $(this).closest('ul.inner').parent().parent().find('textarea[name="editPageIntroduction"]').val()

            }
            $http.put('api/question', childQuestionDetails).success(function (data) {
                questSpinnerdialog.close();

                $('.previewQuestions').attr('disabled', false);
                $('.submitQuestions').attr('disabled', false);
                $('.saveQuestions').attr('disabled', false);
                $('.addNewQuest').removeClass('disablePage');

                $('.editNewChildQuestion').removeClass('disablePage');
                $('.newPageCreate').removeClass('disablePage');
                $('.editNewQuestion').removeClass('disablePage');
                $('a.toggle').prop('disabled', false);
                $('a.toggle').removeClass('disableHeader');
                $('.newChildQustLink').removeClass('disablePage');

                $(that).closest('li').find('.editChildQuestTxt').text($(that).closest('li').parent().parent().index() - 1 + '.' + $(that).closest('li').index() + ' ' + $(that).closest('li').find('.editChildQuestionName').val());
                toggleArrow($(that).closest('li').find('.editChildQuestTxt'));

                data = data.replace(/(^"|"$)/g, "");
                $(that).closest('li').find('.childQuestionHidden').val(data);
                selector.find('.editChildQuestTxt').append('<span class="ms-Icon ms-Icon--trash place-right editDeleteChildQuestIcon"></span>');

                $(that).closest('div.inner').hide();
                $(that).closest('div.inner').children().remove();

            }).error(function () {
                fnCloseSpinner();
                window.alert("Error occured while saving question. Please contact support team.");
            });
        }
    });

});


vettingApp.factory('questionsService', function ($http) {
    var getData = function (apiUri) {
        return $http.get(apiUri).then(function (result) {
            return result;
        });
    };
    return { getData: getData };
});

vettingApp.controller('newQuestionnaireStep2', function ($scope, $http, $location, questionsService, $sce) {
    var questSpinnerdialog = $('#spinnerDialog').data('dialog');
    var items = ["bold", "italic", "underline", "link", "unlink", "orderedlist", "unorderedlist"];
    questSpinnerdialog.open();

    $http.get('api/question/GetQuestionPageTitles?questionnaireVersionId=' + $location.search().questionnaireId + '&languageId=192C79DD-B246-4BF2-B297-A36338981F99').success(function (data) {
        questSpinnerdialog.close();

        if (data.length != 0) {
            var questionnaireVersionId = $location.search().questionnaireId;
            $location.url('/step2Edit?questionnaireId=' + questionnaireVersionId);
        }
    });
    $("textarea").htmlarea({
        toolbar: [
            ["bold"], ["italic"], ["underline"],
            ["link"], ["unlink"], ["orderedList"], ["unorderedList"]
        ],
        loaded: function () {
            configureEditor(this);
        }
    });
    items.forEach(function (type) {
        $("a." + type).attr("tabindex", "-1");
    });
    $(window).scrollTop(0);
    var languageId = "192C79DD-B246-4BF2-B297-A36338981F99";
    $('.editNewQuestion').addClass('disablePage');
    $('.previewQuestions').attr('disabled', true);
    $('.submitQuestions').attr('disabled', true);
    $('.saveQuestions').attr('disabled', true);
    $scope.redirectToAdmin = function () {

        $location.url('/admin');
    }
    $scope.previewQuestionnaire = function (e) {
        e.stopPropagation();
        var questionnaireVersionId = $location.search().questionnaireId;

        showDialog("#spinnerDialog");

        $http.get("/api/Questionnaire/GetQuestionnaireByQuestionnaireVersionId?QuestionnaireVersionId=" + questionnaireVersionId).success(
            function (result) {
                $scope.questionnaireName = result.QuestionnaireName;
                $scope.questionnaireIntro = result.QuestionnaireIntro;
                $scope.questionnaireThankYou = result.HelpText;
            }).error(
                                    function () {
                                        fnCloseSpinner();
                                        $scope.questionnaireName = null;
                                        $scope.questionnaireIntro = null;
                                        $scope.questionnaireThankYou = null;
                                    }
                                    );

        $http.get('api/question/GetQuestionPages?questionnaireVersionId=' + questionnaireVersionId + '&languageId=' + languageId).success(function (result) {
            $scope.questionnairePreviewPages = result;
            if (result.length === 0) {
                var dialog = $("#spinnerDialog").data('dialog');
                dialog.close();
                showDialog("#dialogPreviewQuestionnaire");
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
        }).error(
                                    function () {
                                        var dialog = $("#spinnerDialog").data('dialog');
                                        dialog.close();
                                        showDialog("#dialogPreviewQuestionnaire");
                                    }
                                    );
    }

    $scope.goToWizard = function ($event) {
        $event.stopPropagation();
        $scope.questionnairePreviewPercentageComplete = 0;
        $scope.questionnairePreviewCurrentPageNumber = 1;
        $scope.questionnairePreviewPageCount = $("#previewWizard").find(".step").length;
        if ($scope.questionnairePreviewPageCount > 0) {
            $("#previewWizard").wizard(
                {
                    onPage: function (page, wiz) {
                        //alert(page);
                        var scope = angular.element($("#previewWizard")).scope();
                        if (scope) {
                            scope.$apply(function () {
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
                                    }).error(
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
                            });
                        }
                        return true;
                    },
                    onFinish: function (page, wiz) {
                        //alert('finish:' + page);
                        $("#previewWizard").hide();
                        $(".previewHeadingRight").attr("style", "display: none !important");
                        $(".previewBye").show();
                    }
                }
            );
            $(".wizard .stepper>ul").attr("style", "width: " + (($scope.questionnairePreviewPageCount - 1) * 45) + "px!important");
            $(".previewWelcome").hide();
            $("#previewWizard").show();
            // Not showing percentage complete in Questionnaire Preview for now
            //$(".previewHeadingRight").attr("style", "display: block !important");
        }
        else {
            $(".previewWelcome").hide();
            $(".previewBye").show();
        }
    }

    $scope.showChildQuestionsSingleChoice = function (branchingQuestionVersionIds, questionVersionId) {
        $('input[name=' + questionVersionId + ']').each(function (index, value) {
            var questionsToHide = $.parseJSON(this.attributes["branchingquestion"].value);
            $.each(questionsToHide, function (index, value) {
                $("#question" + value + "  div.questionHide").attr("style", "display: none !important");
            });
        });

        var questionsToShow = branchingQuestionVersionIds;
        $.each(questionsToShow, function (index, value) {
            $("#question" + value + "  div.questionHide").attr("style", "display: block !important");
            if ($("#question" + value).length)
                $(".steps").scrollTop($("#question" + value).position().top);
        });
    }

    $scope.showChildQuestionsMultipleChoice = function (childQuestionGroups, questionVersionId) {
        var count = 0;

        $('input[name=' + questionVersionId + ']').each(function (index, value) {
            if (this.checked)
                count++;
        });

        $.each(childQuestionGroups, function (index, childQuestion) {
            $("#question" + childQuestion.ChildQuestionId + "  div.questionHide").attr("style", "display: none !important");
        });

        $.each(childQuestionGroups, function (index, childQuestion) {
            var show = true;

            $.each(childQuestion.OptionIds, function (index, value) {
                var $checkbox = $('input[name=' + questionVersionId + '][value=' + value + ']');
                if ($checkbox.is(':checked') == false)
                    show = false;
            });

            if (show && count === childQuestion.OptionIds.length) {
                $("#question" + childQuestion.ChildQuestionId + "  div.questionHide").attr("style", "display: block !important");
                $(".steps").scrollTop($("#question" + childQuestion.ChildQuestionId).position().top);
            }
        });
    }

    $scope.renderHtml = function (htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    };

    $scope.publishAndRedirect = function () {
        $http.put('api/questionnaire/MarkQuestionnaireAsPublished?questionnaireVersionId=' + $location.search().questionnaireId).success(function () {
            $location.url('/admin');
        }).error(function () {
            fnCloseSpinner();
            window.alert("Error while publishing questionnaire. Please contact support team.")
        });
    }

    $scope.redirectWithoutSave = function () {
        var pageTarget = $('ul.accordion>li:last-child');
        var newPageLength = pageTarget.find('.editPageTxt ').children().length;
        if (newPageLength == 0) {
            //pge input validation
            if (pageTarget.find("input[type='text']").val()) {
                if (pageTarget.find("input[type='text']").hasClass('error')) {
                    pageTarget.find("input[type='text']").removeClass('error');
                    pageTarget.find("input[type='text']").next().find('label').hide();
                }
            }
            else {
                pageTarget.find("input[type='text']").addClass('error');
                pageTarget.find("input[type='text']").next().find('label').show();
                pageTarget.find("input[type='text']").next().show();
            }
            //page textarea validation
            if (pageTarget.find('textarea').val().length > 0) {
                if (pageTarget.find('.jHtmlArea').hasClass('error')) {
                    pageTarget.find('.jHtmlArea').removeClass('error');

                    pageTarget.find('.jHtmlArea').next().hide();
                }
            }
            else {
                pageTarget.find('.jHtmlArea').addClass('error');

                pageTarget.find('.jHtmlArea').next().show();
            }
            //there is no error
            if (pageTarget.find('.error').length == 0) {
                var pgTitle = pageTarget.find("input[type='text']").val();
                var pgIntro = pageTarget.find('textarea').val();
                var page_details = {
                    questionId: null,
                    dateTimeChanged: null,
                    dateTimeCreated: null,
                    isDeleted: 0,
                    answerType: null,
                    isActive: 1,
                    isMandatory: 0,
                    questionVersionId: null,
                    questionVersionNumber: null,
                    questionText: null,
                    questionContent: null,
                    questionHelpText: null,
                    sectionOrder: pageTarget.index() + 1,

                    questionnaireVersionId: $location.search().questionnaireId,
                    pageTitle: pageTarget.find("input[type='text']").val(),
                    languageId: "192C79DD-B246-4BF2-B297-A36338981F99",
                    displayOrder: null,
                    parentQuestionVersionId: null,

                    questionOptionsArray: null,
                    questionWeightsArray: null,
                    questionOptionAndWeight: null,
                    answerTypeId: null,
                    questionConditionArray: null,
                    pageIntro: pageTarget.find('textarea').val()

                }
                var questSpinnerdialog = $('#spinnerDialog').data('dialog');
                questSpinnerdialog.open();
                $http.post('api/question/SavePageWithNoQuestionIntoQuestionnaire', page_details).success(function (data) {
                    questSpinnerdialog.close();
                    $location.url('/admin');
                }).error(function () {
                    fnCloseSpinner();
                    window.alert("Error occured while saving page. Please contact support team.");
                });
            }
        }
        else {
            $location.url('/admin');
        }
    }

    $scope.redirectToStep1 = function () {
        var url = '/newQuestionnaire?id=' + $location.search().questionnaireId;
        $location.url(url);
    }
});

function populateSubsidiaries($scope, result) {

    $scope.subsdiaries = result;
    $.each($scope.subsdiaries, function (key, value) {
        if (value.SubsidiaryId === $scope.selectedSubsidiary) {
            $('#select2-selectSubsidiary-container')[0].title = value.SubsidiaryText;
            $('#select2-selectSubsidiary-container')[0].textContent = value.SubsidiaryText;
        }
    });
}

function populateCountries($scope, result) {
    $scope.countries = result;
    $.each($scope.countries, function (key, value) {
        $($('.select2-selection__rendered')[3]).append('<li class="select2-selection__choice" title=' + value.CountryText + '><span class="select2-selection__choice__remove" role="presentation">x</span>' + value.CountryText + '</li>');
    });
}
function populateCountriesForSelectedArea(value, item, editMode) {

    $.each(value.Countries, function (key, country) {
        if (country.AreaId === item) {
            if (editMode)
                $('#country').append("<option value='" + country.CountryId + "'>" + country.CountryName + "</option>");
            else
                $('#country').append("<option selected  value='" + country.CountryId + "'>" + country.CountryName + "</option>");
        }
    });

}
var areaCountry = null;
function fnGetCountries(view, editMode) {
    if (areaCountry != null) {
        var selectedArea = $('#area').multipleSelect('getSelects');
        if (selectedArea != null) {
            $('#country').empty();
            $.each(areaCountry, function (key, value) {
                $.each(selectedArea, function (key, item) {
                    populateCountriesForSelectedArea(value, item, editMode);
                });
            });
            $('#country').multipleSelect();
        } else {
            $('#country').empty();
            $('#country').multipleSelect();
        }
    }
    $(".area").removeClass("error");
    $('#errorArea').css('display', 'none');
    $(".country").removeClass("error");
    $('#errorCountry').css('display', 'none');
}
function removeSelectedText(areaCountry) {
    $(areaCountry[0]).empty();
}
function fillSalesRegionDropDown(key, value) {

    $('#area').append("<option  value='" + value.AreaId + "'>" + value.AreaName + "</option>");
}
function fnSelectAllCountries(view, selectAll) {
    if (stopLocking) {
        stopLocking = false;
        $('#country').empty();
        loadAllCountries();
        $('#country').multipleSelect();
        $(".area").removeClass("error");
        $('#errorArea').css('display', 'none');
        $(".country").removeClass("error");
        $('#errorCountry').css('display', 'none');
    }
    stopLocking = true;
}
function fnUnSelectAllCountries() {
    if (stopLocking) {
        stopLocking = false;
        $('#country').multipleSelect('uncheckAll');
    }
    stopLocking = true;
}
function loadAllCountries() {

    $.each(areaCountry, function (key, value) {
        $.each(value.Countries, function (key, value) {
            $('#country').append("<option selected  value='" + value.CountryId + "'>" + value.CountryName + "</option>");
        });
    });
}
function fnGetAreaCodeByCountryCode(countryCode) {
    var areaId = null;
    if (areaCountry != null) {
        $.each(areaCountry, function (key, value) {
            $.each(value.Countries, function (key, value) {
                if (value.CountryId === countryCode)
                    areaId = value.AreaId;
            });
        });
    }
    return areaId;
}
function fnUnSelectArea(areaId) {
    $("select option[value='" + areaId + "']").prop("selected", false);
    $('#area').multipleSelect();
}
function fnSelectArea(areaId) {
    $("select option[value='" + areaId + "']").prop("selected", true);
}

function fnCheckIfAreaExistForCountry(view) {
    stopLocking = true;
    var areaCodes = $('#area').multipleSelect('getSelects');
    var countryCodes = $('#country').multipleSelect('getSelects');
    var isCountryForAreaExist = false;
    if (view.checked == false) {
        if (areaCountry != null && areaCodes != null) {
            $.each(areaCodes, function (key, areaId) {
                $.each(countryCodes, function (key, country) {
                    if (areaId == fnGetAreaCodeByCountryCode(country))
                        isCountryForAreaExist = true;
                });
                if (isCountryForAreaExist == false) {
                    fnUnSelectArea(areaId);
                }
                isCountryForAreaExist = false;
            });
        }
    } else {
        if (areaCountry != null && areaCodes != null) {
            $.each(countryCodes, function (key, country) {
                fnSelectArea(fnGetAreaCodeByCountryCode(country));
            });
        }
    }
    $('#area').multipleSelect();
    $(".country").removeClass("error");
    $('#errorCountry').css('display', 'none');
}
function fnSelectAllAssociatedAreas(view) {
    stopLocking = false;
    var countryCodes = $('#country').multipleSelect('getSelects');
    $.each(countryCodes, function (key, country) {
        fnSelectArea(fnGetAreaCodeByCountryCode(country));
    });
    $('#area').multipleSelect();
}
function fnUnSelectAllArea(view, selectAll) {
    if (stopLocking) {
        stopLocking = false;
        $('#area').multipleSelect('uncheckAll');
    }
}
function addAttributeToControls() {
    var inputs = $('.ms-search input');
    if (!$.isEmptyObject(inputs)) {
        $.each(inputs, function (key, value) {
            $(value).attr("placeholder", "Search");
        });
    }
}
function fillFiscalYearDropDowns(key, value) {
    $('#fiscalYear').append("<option  value='" + value.FiscalYearId + "'>" + value.FiscalYearName + "</option>");
};

function pushParamatersToJsonArray(areaCountryParameter, areaId, value) {

    areaCountryParameter.push({
        "AreaId": areaId,
        "CountryId": value
    });
}
function creatJsonforAreaCountryForSaving() {

    var areaCountryParameter = [];
    var areaId = null;
    var selectedCountries = $('#country').multipleSelect('getSelects');
    $.each(selectedCountries, function (key, value) {
        areaId = fnGetAreaCodeByCountryCode(value);
        if (areaId != null) {
            pushParamatersToJsonArray(areaCountryParameter, areaId, value);
        }
    });
    return areaCountryParameter;
}
var selectedArea = [];
var selectedCountries = [];
var selectedFiscalYear = [];
function preSelectAreaCountires($scope) {

    selectedArea = [];
    selectedCountries = [];
    var selectedAreaCountries = $scope.selectAreaCountries;
    $.each(selectedAreaCountries, function (key, value) {
        if ($.inArray(value.AreaId, selectedArea)) selectedArea.push(value.AreaId);
        selectedCountries.push(value.CountryId);
    });
}

function preSelectFiscalYear($scope) {

    selectedFiscalYear = [];
    var selectFiscalYear = $scope.selectFiscalyear;
    $.each(selectFiscalYear, function (key, value) {
        selectedFiscalYear.push(value);
    });
}
function fnResetDropdowns() {
    $('#area').empty();
    $('#country').empty();
    $('#fiscalYear').empty();
    selectedArea = [];
    selectedCountries = [];
    selectedFiscalYear = [];
}
function fnLoadAreaFiscalyearDropdownsOnNewQustionnaire($scope, questionnaireService, editQuestionnaire) {
    var myDataPromise = questionnaireService.getData('api/RegionSubsidiaryCountry/GetAreaCountries');
    $scope.regions = "";
    fnResetDropdowns();
    fnInitializeDropdowns();
    myDataPromise.then(function (result) {
        areaCountry = result;
        $.each(result, function (key, value) {
            fillSalesRegionDropDown(key, value);
        });
        if (editQuestionnaire) preSelectAreaCountires($scope);
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
    var questSpinnerdialog = $('#spinnerDialog').data('dialog');
    questSpinnerdialog.open();
    myDataPromise.then(function (result) {
        console.log(result);
        questSpinnerdialog.close();
        $.each(result, function (key, value) {
            fillFiscalYearDropDowns(key, value);
        });
        $('#fiscalYear').multipleSelect();
        if (editQuestionnaire) preSelectFiscalYear($scope);
        if (selectedFiscalYear.length > 0) $('#fiscalYear').multipleSelect('setSelects', selectedFiscalYear);
    });
}
function fnRemoveErrorClass(view, selectAll) {
    if (selectAll) {
        $(".fiscal").removeClass("error");
        $('#errorFiscalyear').css('display', 'none');
    }
}

var stopLocking = true;
function fnInitializeDropdowns() {
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
        }
    });
}

function fnLoadDropdownsOnNewQustionnaire($scope, questionnaireService, editQuestionnaire) {
    if (editQuestionnaire) {
        fnLoadAreaFiscalyearDropdownsOnNewQustionnaire($scope, questionnaireService, true);
    }
    else {
        fnLoadAreaFiscalyearDropdownsOnNewQustionnaire($scope, questionnaireService, false);
    }
}

function supressNonEng(event) {
    var key = event.which || event.keyCode;
    if (key > 128) {
        isNonEnglishThankYou = true;
        isNonEnglishIntroduction = true;
        isNonEnglishTitle = true;
        return false;
    }
    return true;
}

var isNonEnglishThankYou = false;
var isNonEnglishIntroduction = false;
var isNonEnglishTitle = false;

function removeNonEng(event) {
    var val = $.trim($('#questIntro').val());
    var jhtmlEditors = $(".jHtmlArea");
    var code = "";
    var i = 0;
    if (event.editor != null) {
        for (i = 0; i < val.length; i++) {
            code = val.charCodeAt(i);
            if (code > 128) {
                $('#questIntro').html("<p></p>");
                $("#questIntro").htmlarea('updateHtmlArea', "<p></p>");
                $(jhtmlEditors)[0].style.borderColor = "#FF0000";
                $('#errorNonEngQuestionnaireIntro').css('display', 'inline-block');
                isNonEnglishIntroduction = true;
                break;
            }
        }
        val = $.trim($('#questHelpText').val());
        for (i = 0; i < val.length; i++) {
            code = val.charCodeAt(i);
            if (code > 128) {
                $('#questHelpText').html("<p></p>");
                $("#questHelpText").htmlarea('updateHtmlArea', "<p></p>");
                $(jhtmlEditors)[0].style.borderColor = "#FF0000";
                $('#errorNonEngQuestionnaireHelpText').css('display', 'inline-block');
                isNonEnglishThankYou = true;
                break;
            }
        }
    } else {
        val = $.trim($('#title').val());
        for (i = 0; i < val.length; i++) {
            code = val.charCodeAt(i);
            if (code > 128) {
                $('#title').val("");
                $('#title').removeClass("valid").addClass("error");
                $('#errorNonEngTitle').css('display', 'inline-block');
                isNonEnglishTitle = true;
                break;
            }
        }
    }

}


function validateEditor(jhtmlEditor, event) {
    removeNonEng(jhtmlEditor);
    var isValidText = $.trim($(jhtmlEditor)[0].editor.body.outerText);
    var textAreaId = $(jhtmlEditor)[0].textarea[0].id;
    if (isValidText !== "") {
        jhtmlEditor.htmlarea[0].parentNode.style.borderColor = "black";
        if (textAreaId == 'questIntro') {
            $('#errorQuestionnaireIntro').css('display', 'none');
            $('#errorNonEngQuestionnaireIntro').css('display', 'none');
            isNonEnglishIntroduction = false;
        } else if (textAreaId == 'questHelpText') {
            $('#errorQuestionnaireHelpText').css('display', 'none');
            $('#errorNonEngQuestionnaireHelpText').css('display', 'none');
            isNonEnglishThankYou = false;
        } else if (textAreaId == 'page_Intro') {
            $('#errorPageIntro').css('display', 'none');
            $('.jHtmlArea').removeClass('error');
        } else if (textAreaId == 'quest_Intro') {
            $('#errorParentIntro').css('display', 'none');
            $('.jHtmlArea').removeClass('error');
        } else {
            $('#errorChildIntro').css('display', 'none');
            $('.jHtmlArea').removeClass('error');
        }

    } else {
        // Show error only in case of pressed key is either Tab or Space
        // in blank editor.
        if (event.key !== 'Tab' && event.key !== 'Spacebar') {
            return;
        }
        // jhtmlEditor.htmlarea[0].parentNode.style.borderColor = "#FF0000";
        if (textAreaId == 'questIntro') {
            if (isNonEnglishIntroduction) {
                $('#errorNonEngQuestionnaireIntro').css('display', 'inline-block');
                $('#errorQuestionnaireIntro').css('display', 'none');
            } else {
                $('#errorQuestionnaireIntro').css('display', 'inline-block');
                $('#errorNonEngQuestionnaireIntro').css('display', 'none');
            }
        } else if (textAreaId == 'questHelpText') {
            if (isNonEnglishThankYou) {
                $('#errorQuestionnaireHelpText').css('display', 'none');
                $('#errorNonEngQuestionnaireHelpText').css('display', 'inline-block');
            } else {
                $('#errorNonEngQuestionnaireHelpText').css('display', 'none');
                $('#errorQuestionnaireHelpText').css('display', 'inline-block');
            }
        } else if (textAreaId == 'page_Intro') {
            $('#errorPageIntro').css('display', 'inline-block');
        } else if (textAreaId == 'quest_Intro') {
            $('#errorParentIntro').css('display', 'inline-block');
        } else {
            $('#errorChildIntro').css('display', 'inline-block');
        }
    }
}

function fnRemoveEmptyHTMLMarkup(editorContent) {
    editorContent = editorContent.replace("&nbsp;", "");
    editorContent = editorContent.replace("<p>", "");
    editorContent = editorContent.replace("</p>", "");
    editorContent = editorContent.replace("<br>", "");
    editorContent = editorContent.replace("<br/>", "");
    editorContent = editorContent.replace("</br>", "");
    return editorContent;
}

function ValidateQuestionnaire() {
    var isValid = true;
    if ($.trim($('#title').val()) === "") {
        $('#title').removeClass("valid").addClass("error");
        if (isNonEnglishTitle) {
            $('#errorNonEngTitle').css('display', 'inline-block');
            $('#errorTitle').css('display', 'none');
        } else {
            $('#errorTitle').css('display', 'inline-block');
            $('#errorNonEngTitle').css('display', 'none');
        }
        isValid = false;
    }
    var jhtmlEditors = $(".jHtmlArea");
    var editorContentToValidate = "";
    if (jhtmlEditors != null) {
        editorContentToValidate = fnRemoveEmptyHTMLMarkup($.trim($('#questIntro').val()));
        if ($.trim(editorContentToValidate) == "") {
            $(jhtmlEditors)[0].style.borderColor = "#FF0000";
            if (isNonEnglishIntroduction)
                $('#errorNonEngQuestionnaireIntro').css('display', 'inline-block');
            else
                $('#errorQuestionnaireIntro').css('display', 'inline-block');
            isValid = false;
        }
        editorContentToValidate = "";
        editorContentToValidate = fnRemoveEmptyHTMLMarkup($.trim($('#questHelpText').val()));
        if ($.trim(editorContentToValidate) === "") {

            $(jhtmlEditors)[1].style.borderColor = "#FF0000";
            if (isNonEnglishThankYou)
                $('#errorNonEngQuestionnaireHelpText').css('display', 'inline-block');
            else
                $('#errorQuestionnaireHelpText').css('display', 'inline-block');
            isValid = false;
        }
    }
    if ($.trim($('#fiscalYear').val()) == "") {
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
    isNonEnglishTitle = false;
    isNonEnglishIntroduction = false;
    isNonEnglishThankYou = false;
    //return isvalid flag
    return isValid;

}
function configureEditor(jhtmlEditor) {
    $($(jhtmlEditor.editor.body)).keypress(function (e) {
        return supressNonEng(e);
    });
    //$($(jhtmlEditor.editor.body)).blur(function (e) {
    //    return removeNonEng(e);
    //});

    // Need to handle only keypress. Key up event handling causes issue in IE.
    // IE supports keydown inplace of keypress event.
    $($(jhtmlEditor.editor.body)).keydown(function (e) {
        validateEditor(jhtmlEditor, e);
    });
}





vettingApp.controller('mainController', function ($scope) {

    $scope.showSpinner = true;

    $scope.$watch(function () {
        return $(document).height();
    }, function onHeightChange(newValue, oldValue) {


        $('.left_part').css('height', newValue);

    });


    var assigned = [
        { "companyName": "BestBuy", "country": "Korea", "assigned": "10 days ago", "action": "Review" },
        { "companyName": "AT&T", "country": "UK", "assigned": "10 days ago", "action": "Decision" },
        { "companyName": "Verizon", "country": "USA", "assigned": "10 days ago", "action": "Review" },
        { "companyName": "Microsoft", "country": "Germany", "assigned": "10 days ago", "action": "Decision" },
        { "companyName": "Horizon", "country": "Argentina", "assigned": "10 days ago", "action": "Decision" }
    ];
    var history = [
        { "companyName": "BestBuy", "country": "Korea", "completed": "Aug23 2016", "finalStatus": "Approved" },
        { "companyName": "AT&T", "country": "UK", "completed": "Aug23 2016", "finalStatus": "Approved" },
        { "companyName": "Verizon", "country": "USA", "completed": "Aug23 2016", "finalStatus": "Approved" },
        { "companyName": "Microsoft", "country": "Germany", "completed": "Aug23 2016", "finalStatus": "Approved" },
        { "companyName": "Horizon", "country": "Argentina", "completed": "Aug23 2016", "finalStatus": "Approved" }
    ];
    $.each(assigned, function (i, val) {
        var tcontent = "<tr><td>" + val.companyName + "</td>" +
        "<td>" + val.country + "</td>" +
        "<td>" + val.assigned + "</td>" +
        "<td><button class='button'>" + val.action + "</button></td>" +

        "</tr>";
        $('#myTable tbody').append(tcontent);
    });
    $.each(history, function (i, val) {
        var hcontent = "<tr><td>" + val.companyName + "</td>" +
        "<td>" + val.country + "</td>" +
        "<td>" + val.completed + "</td>" +
        "<td><strong>" + val.finalStatus + "</strong></td>" +

        "</tr>";
        $('#historyTable tbody').append(hcontent);
    });
    $('#myTable').dataTable({
        "scrollX": true,
        "paging": false,
        "searching": false,
        "info": false
    });
    $('#historyTable').dataTable({

        "scrollX": true,
        "paging": false,
        "searching": false,
        "info": false
    });

    $scope.showSpinner = false;
});

function fnPopulateCountryDropDowns($scope, questionnaireService) {

    var myDataPromise = questionnaireService.getData('api/RegionSubsidiaryCountry/GetAllCountries');
    myDataPromise.then(function (result) {
        $scope.countries = result;
        $.each(result, function (key, value) {
            if (key === 0) {
                $scope.model.country = value.CountryId;
                $scope.model.companyCountry = value.CountryId;
            }
            fnCloseSpinner();
        });
    }).catch(function (result) {
        window.alert("Error while loading dropdown for country");
        fnCloseSpinner();
    });
}

function fnPopulateFiscalYearDropDowns($scope, questionnaireService) {
    var questSpinnerdialog = $('#spinnerDialog').data('dialog');
    questSpinnerdialog.open();
    var myDataPromise = questionnaireService.getData('api/FiscalYear');
    myDataPromise.then(function (result) {
        $scope.fiscalYears = result;

        var index = 1;
        $.each($scope.fiscalYears, function (key, value) {
            if (key === 0) {
                $scope.model.fiscalYearSelected = value.FiscalYearId;
            }
            fnCloseSpinner();
        });
    }).catch(function (result) {
        window.alert("Error while loading dropdown for fiscalyear");
        fnCloseSpinner();
    });
}


function fnResetCompanyCountryDropdownValidators() {

    $('#companyCountry').removeClass("error").addClass("valid");
    if ($.trim($('#companyStreetAddress').val()) !== '' && $.trim($('#companyCity').val()) !== '' && $.trim($('#companyCity').val()) !== '' && $.trim($('#companyZip').val()) !== '')
        $('#errorCompnayAddress').css('display', 'none');
}

function fnResetPersonalCountryDropdownValidators() {
    $('#personalCountry').removeClass("error").addClass("valid");
    if ($.trim($('#streetAddress').val()) !== '' && $.trim($('#city').val()) !== '' && $.trim($('#state').val()) !== '' && $.trim($('#zip').val()) !== '')
        $('#errorAddress').css('display', 'none');
}
function fnResetFiscalYearDropDownValidators() {
    $('#fiscalYear').removeClass("error").addClass("valid");
    $('#errorFiscalyear').css('display', 'none');
}

function fnInitializeFiscalYearDropdown() {
    $('#fiscalYear').multipleSelect(
   {
       width: '100%',
       filter: true,
       onClick: function (view) {
           fnRemoveErrorClass(view, true);
       },
       onCheckAll: function (view) {
           fnRemoveErrorClass(view, true);
       }
   });
}
   // fnCloseSpinner();


function fnValidateBuisnessSopnser(scope) {
    if (scope.activeAntiCorruption) {
        var isBuisnessSopnser = $.trim($('#businessSponser').val());
        if (isBuisnessSopnser) {
            $('#businessSponser').removeClass("error").addClass("valid");
            $('#errorBuisinessSponser').css('display', 'none');
        }
        else {
            $('#businessSponser').removeClass("valid").addClass("error");
            $('#errorBuisinessSponser').css('display', 'inline-block');
        }
    }

}

function fnValidateCompanyPhoneNumber() {
    var regExp = /^[0-9]{1,10}$/;
    if ($.trim($("#companyPhone").val()) !== "") {
        if (regExp.test($.trim($("#companyPhone").val())) === false) {
            $('#companyPhone').removeClass("valid").addClass("error");
            $('#errorValidCompanyContact').css('display', 'inline-block');
            isValid = false;
        }
        if ($.trim($("#countryCode").val() === "")) {
            $('#countryCode').removeClass("valid").addClass("error");
            $('#errorValidCompanyContact').css('display', 'inline-block');
            isValid = false;
        }
    }
    if ($.trim($("#countryCode").val()) !== "") {
        if ($.trim($("#companyPhone").val()) === "") {
            $('#companyPhone').removeClass("valid").addClass("error");
            $('#errorValidCompanyContact').css('display', 'inline-block');
            isValid = false;
        }
    }
    var companyPhoneNumber = $.trim($("#countryCode").val()) + $.trim($("#companyPhone").val());
    if (companyPhoneNumber.length > 0 && companyPhoneNumber.length < 10) {
        $('#companyPhone').removeClass("valid").addClass("error");
        $('#countryCode').removeClass("valid").addClass("error");
        $('#errorValidCompanyContact10').css('display', 'inline-block');
        isValid = false;
    }
}
function fnValidatePersonalPhoneNumber() {
    var regExp = /^[0-9]{1,10}$/;
    if ($.trim($("#personalPhone").val()) !== "") {
        if (regExp.test($.trim($("#personalPhone").val())) === false) {
            $('#personalPhone').removeClass("valid").addClass("error");
            $('#errorValidPhoneNumber').css('display', 'inline-block');
            isValid = false;
        }
        if ($.trim($("#personalCountryCode").val()) === "") {
            $('#personalCountryCode').removeClass("valid").addClass("error");
            $('#errorValidPhoneNumber').css('display', 'inline-block');
            isValid = false;
        }
    }
    if ($.trim($("#personalCountryCode").val()) !== "") {
        if ($.trim($("#personalPhone").val()) === "") {
            $('#personalPhone').removeClass("valid").addClass("error");
            $('#errorValidPhoneNumber').css('display', 'inline-block');
            isValid = false;
        }
    }
    var personalPhoneNumber = $.trim($("#personalCountryCode").val()) + $.trim($("#personalPhone").val());
    if (personalPhoneNumber.length > 0 && personalPhoneNumber.length < 10) {
        $('#personalPhone').removeClass("valid").addClass("error");
        $('#personalCountryCode').removeClass("valid").addClass("error");
        $('#errorvalidPhoneNumber10').css('display', 'inline-block');
        isValid = false;
    }
}
function fnValidateFiscalYear() {

    if ($.trim($('#select2-selectFiscalYear-container')[0].textContent) === "") {
        $('#fiscalYear').removeClass("valid").addClass("error");
        $('#errorFiscalyear').css('display', 'inline-block');
        isValid = false;
    }
}
function fnValidatePersonalAddress() {
    var isValid = true;
    if ($.trim($('#streetAddress').val()) === "") {
        $('#streetAddress').removeClass("valid").addClass("error");
        $('#errorAddress').css('display', 'inline-block');
        isValid = false;
    }
    if ($.trim($('#city').val()) === "") {
        $('#city').removeClass("valid").addClass("error");
        $('#errorAddress').css('display', 'inline-block');
        isValid = false;
    }
    if ($.trim($('#state').val()) === "") {
        $('#state').removeClass("valid").addClass("error");
        $('#errorAddress').css('display', 'inline-block');
        isValid = false;
    }
    if ($.trim($('#zip').val()) === "") {
        $('#zip').removeClass("valid").addClass("error");
        $('#errorAddress').css('display', 'inline-block');
        isValid = false;
    }
    if ($.trim($('#select2-selectCountry-container')[0].textContent) === "") {
        $('#personalCountry').removeClass("valid").addClass("error");
        $('#errorAddress').css('display', 'inline-block');
        isValid = false;
    }
    return isValid;
}

function fnVerifyWebsite() {
    var regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;

    if (!regex.test($.trim($('#companyWebsite').val()))) {
        $('#companyWebsite').removeClass("valid").addClass("error");
        $('#errorWebsite').css('display', 'inline-block');
        isValid = false;
    }
}
function fnValidatePersonalInfo(scope) {
    var isValid = true;
    if ($.trim($('#firstName').val()) === "") {
        $('#firstName').removeClass("valid").addClass("error");
        $('#errorFirstName').css('display', 'inline-block');
        isValid = false;
    }
    if ($.trim($('#lastName').val()) === "") {
        $('#lastName').removeClass("valid").addClass("error");
        $('#errorLastName').css('display', 'inline-block');
        isValid = false;
    }
    if (!scope.activeDeniedPartyCheck) {
        if ($.trim($('#emailId').val()) === "") {
            $('#emailId').removeClass("valid").addClass("error");
            $('#errorEmail').css('display', 'inline-block');
            isValid = false;
        } else {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (re.test($.trim($('#emailId').val())) == false) {
                $('#emailId').removeClass("valid").addClass("error");
                $('#errorValidEmail').css('display', 'inline-block');
                isValid = false;
            }
        }
    }
    return isValid;
}

function fnValidateCompany(scope) {
    var isValid = true;
    if ($.trim($('#companyName').val()) === "") {
        $('#companyName').removeClass("valid").addClass("error");
        $('#errorCompany').css('display', 'inline-block');
        isValid = false;
    }
    //if (!scope.activeEmployee) {
    //    //if ($.trim($('#select2-selectCompanyCountry-container')[0].textContent.toUpperCase()) === "UNITED STATES" && $.trim($('#companyEnglishName').val()) == '') {
    //    //    $('#companyEnglishName').removeClass("valid").addClass("error");
    //    //    $('#errorCompanyEnglishName').css('display', 'inline-block');
    //    //    isValid = false;
    //    //}
        if ($.trim($('#companyStreetAddress').val()) === "") {
            $('#companyStreetAddress').removeClass("valid").addClass("error");
            $('#errorCompnayAddress').css('display', 'inline-block');
            isValid = false;
        }
        if ($.trim($('#companyCity').val().toUpperCase()) === "") {
            $('#companyCity').removeClass("valid").addClass("error");
            $('#errorCompnayAddress').css('display', 'inline-block');
            isValid = false;
        }
        if ($.trim($('#companyState').val().toUpperCase()) === "") {
            $('#companyState').removeClass("valid").addClass("error");
            $('#errorCompnayAddress').css('display', 'inline-block');
            isValid = false;
        }
        if ($.trim($('#companyZip').val().toUpperCase()) === "") {
            $('#companyZip').removeClass("valid").addClass("error");
            $('#errorCompnayAddress').css('display', 'inline-block');
            isValid = false;
        }
        if ($.trim($('#select2-selectCompanyCountry-container')[0].textContent.toUpperCase()) === "") {
            $('#companyCountry').removeClass("valid").addClass("error");
            $('#errorCompnayAddress').css('display', 'inline-block');
            isValid = false;
        //}
    }
    return isValid;
}



function resetAllValidations(scope) {
    scope.activeBusiness = false;
    scope.activeDeniedPartyCheck = false;
    scope.activeAcademic = false;
    scope.activeEmail = false;
    scope.activeEmployee = false;
    scope.activeAntiCorruption = false;
}

function hideAllNewRequestFormFields(scope) {
    scope.isFirstName = false;
    scope.isLastName = false;
    scope.isEmail = false;
    scope.isPersonalAddress = false;
    scope.isCompanyName = false;
    scope.isCompanyNameEnglish = false;
    scope.isCompanyAddress = false;
    scope.isCompanyPhone = false;
    scope.isCompanyWebsite = false;
    scope.isContactName = false;
    scope.isContactNumber = false;
    scope.isBusinessSponsor = false;
    scope.isFiscalYear = false;
    scope.isAudienceType = false;
    scope.isRequestInformation = true;
}

function toggleCSSClasses(buttonClass, divBeforeClass, divAfterClass, buttonId, scenarioImageId, toggle) {
    if (toggle === false) {
        return;
    }
    $(buttonId).toggleClass(buttonClass);
    $(scenarioImageId).toggleClass(divBeforeClass);
    $(scenarioImageId).toggleClass(divAfterClass);
}

function removeCSSClasses(buttonClass, divBeforeClass, divAfterClass, buttonId, scenarioImageId) {
    $(buttonId).removeClass(buttonClass);
    if (!$(scenarioImageId).hasClass(divBeforeClass)) {
        $(scenarioImageId).addClass(divBeforeClass);
    }
    $(scenarioImageId).removeClass(divAfterClass);
}

vettingApp.controller('requestsController', function ($scope, $location) {
    $scope.reDirectToSingleRequest = function () {

        $location.url('/singleRequest');
    }
    $scope.reDirectToBatchRequest = function () {
        /* $location.url('/requestSummary');*/
        // $location.url('/entitySummary');
    }

});





vettingApp.controller('singleRequestController', function ($scope) {


});

function convertDate(currentFormat) {
    var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "June",
                      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    return monthNames[new Date(currentFormat).getUTCMonth()] + " " + new Date(currentFormat).getDate() + " " + new Date(currentFormat).getUTCFullYear();
}





vettingApp.factory('questionnaireService', function ($http) {
    var getData = function (apiUri) {
        return $http.get(apiUri).then(function (result) {
            return result.data;
        });
    };
    return { getData: getData };
});

vettingApp.factory('updateQuestionnaireService', function ($http) {

    var getData = function (apiUri, successMessage, questionnaireVersionId) {
        return $http.put(apiUri).success(function (data) {
            alert(successMessage);
            if (questionnaireVersionId != null) {
                window.location.reload();

            }
        }).error(function () {
            fnCloseSpinner();
            alert("Error occured while performing this operation");
        });
    };
    return { getData: getData };
});

function fnDeleteQuestionnaire(questionnaireVersionId, rowIndex) {
    if (confirm("Are you sure, You want to delete this Questionnaire")) {
        fnOpenSpinner();
        var myDataPromise = globalScope.updateQuestionnaireService.getData('api/Questionnaire/UpdateQuestionnaire?questionnairVersionId=' + questionnaireVersionId.id, "Questionnaire has been marked as deleted.", questionnaireVersionId);
    }
}
function fnRedirectToEditQuestionnaire(questionnaireVersionId, isNew) {

    if (isNew == "true") {

        $.ajax({
            url: 'api/questionnaire/UpdateQuestionnaireIsNewFlag?questionnaireVersionId=' + questionnaireVersionId,
            type: 'PUT',

            contentType: "application/json",
            dataType: "json",
            success: function (data) {


                document.location.href = "#/newQuestionnaire?id=" + questionnaireVersionId;
                window.location.reload();



            }
        })
        return false;
    }
    else {
        //window.location.assign = "#/newQuestionnaire?id=" + questionnaireVersionId;
        document.location.href = "#/newQuestionnaire?id=" + questionnaireVersionId;
        window.location.reload();
    }
}
function fnCloneQuestionnaire(questionnaireVersionId) {
    var myDataPromise = globalScope.updateQuestionnaireService.getData('api/Questionnaire/CloneQuestionnaire?questionnairVersionId=' + questionnaireVersionId.id, "Clone for selected Questionnaire has been created successfully.", null);
    myDataPromise.then(function (result) {
        window.location.reload();
    });
}

var globalScope = {
    updateQuestionnaireService: null,
    questionnaireService: null,
    questionnairePreviewService: null,
    location: null
};

function populateQuestionnaire(type, questionnaireService, updateQuestionnaireService, questionnairePreviewService, $scope, apiUri, $http) {


    globalScope.questionnairePreviewService = questionnairePreviewService;
    var myDataPromise = questionnaireService.getData(apiUri);
    var otable = null;
    myDataPromise.then(function (result) {
        var actionContent = '';
        $scope.data = result;
        var rowIndex = 0;
        $('#adminTable').show();
        globalScope.updateQuestionnaireService = updateQuestionnaireService;
        angular.forEach(result, function (val, key) {
            val["usedIn"] = key;
            if (val["IsActive"] == true) {
                val["IsActive"] = 1;
            }
            if (val["IsActive"] == false) {
                val["IsActive"] = 0;
            }
            if (type == 'myQuestionnaire') {
                actionContent = val.usedIn == 0 ? "<a class='ms-Icon ms-Icon--pencil ms-Icon-CustomSize' onclick='fnRedirectToEditQuestionnaire(\"" + val.QuestionnaireVersionId + "\")'></a><span id=" + val.QuestionnaireVersionId + " class='ms-Icon ms-Icon--trash ms-Icon-Custom-Red' onclick='fnDeleteQuestionnaire(this," + rowIndex + ")'/>" : "<a class='ms-Icon ms-Icon--pencil ms-Icon-CustomSize' onclick='fnRedirectToEditQuestionnaire(\"" + val.QuestionnaireVersionId + "\")'></a> <span id='" + val.QuestionnaireVersionId + "' class='ms-Icon ms-Icon--trash ms-Icon-Custom-Gray'/>";

            }
            else

                actionContent = "<span id =" + val.QuestionnaireVersionId + " class='ms-Icon ms-Icon--copy ms-Icon-CustomSize' onclick='fnCloneQuestionnaire(this)'>";
            var newDraftFlag;
            if (val.IsNew == true && val.IsPublished == true) {
                newDraftFlag = "New";

            } else if (val.IsPublished == false) {
                newDraftFlag = "Draft";

            }
            else {
                newDraftFlag = "";
            }


            var hcontent = "<tr><td class='questionnaire_Name'><a onclick=\"previewQuestionnaire(); return false;\" style='cursor:pointer'>" + val.QuestionnaireName + "</a><span class='" + newDraftFlag + "'>" + newDraftFlag + "</span></td>" +
            "<td class='tableFont'>" + val.TenantName + "</td>" +
            "<td class='tableFont'>" + convertDate(val.DateTimeCreated) + "</td>" +
             "<td class='tableFont'>" + val.usedIn + " " + "requests" + "</td>" +
            "<td class='tableFont'>" + val.QuestionnaireVersionNumber + "</td>" +
            '<td data-search=' + val.IsActive + '><label id="btn_checked" class="switch"' + '><input type="checkbox"'
            + (val.IsActive == 1 ? 'checked' : '') + ' ' + (parseInt(val.usedIn) == 0 ? '' : 'disabled') +
             '><span class="check"></span></label></td>' +
            "<td>" + actionContent + "</td>" +
            "</tr>";
            $('#adminTable tbody').append(hcontent);

            rowIndex++;

        });

        //data table for mobile start
        angular.forEach(result, function (val, key) {
            if (val["IsActive"] == true) {
                val["IsActive"] = 1;
            }
            if (val["IsActive"] == false) {
                val["IsActive"] = 0;
            }
            var hcontent = "<tr><td>" + val.QuestionnaireName + "</td>" +
            '<td class="myheadermobile" data-search=' + val.IsActive + '><label id="btn_checked" class="switch"' + '><input type="checkbox"'

            + (val.IsActive == 1 ? 'checked' : '') +




             '><span class="check"></span></label></td>' +
            "</tr>";
            $('#adminTablemobile tbody').append(hcontent);

        });


        var otablemobile = $('#adminTablemobile').dataTable({
            "scrollX": true,
            "paging": true,
            "searching": true,
            "info": false,
            "destroy": true
        });
        // end

        otable = $('#adminTable').dataTable({
            "scrollX": true,
            "paging": true,
            "searching": false,
            "oLanguage": { "sSearch": "" },
            "info": false,
            "bRetrieve": true,
            "autoWidth": false,
            "aoColumns": [
          { sWidth: '30%' },
          { sWidth: '15%' },
          { sWidth: '20%' },
          { sWidth: '20%' },
          { sWidth: '15%' },
          { sWidth: '15%' },
          { sWidth: '15%' }]
        });
        if (type == "myQuestionnaire") {
            otable.fnSetColumnVis(1, false);
        }
        if (type == "deletedQuestionnaire") {
            otable.fnSetColumnVis(5, false);
            otable.fnSetColumnVis(6, false);
        }


        var values = {}, arr = [], colnum = 4, x;
        setTimeout(function () {
            if ($('#datepicker_from input').attr("readonly") === "readonly") {
                $('#datepicker_from input').removeAttr("readonly");

            }
            if ($('#datepicker_to input').attr("readonly") === "readonly") {
                $('#datepicker_to input').removeAttr("readonly");

            }

        }, 2000);

        $("#datepicker_from").datepicker({

            "onSelect": function (date) {
                var dateFormatted = date.replace(/\./g, '-');
                var getDates = new Date(dateFormatted);
                minDateFilter = getDates;
                otable.fnDraw();
            },
            "format": "mmmm d, yyyy"
        }).keyup(function () {
            minDateFilter = new Date(this.value).getTime();
            otable.fnDraw();
        });

        $("#datepicker_to").datepicker({
            "onSelect": function (date) {
                var dateFormatted = date.replace(/\./g, '-');
                var getDates = new Date(dateFormatted);
                maxDateFilter = getDates;
                otable.fnDraw();
            },
            "format": "mmmm d, yyyy"
        }).keyup(function () {

            maxDateFilter = new Date(this.value).getTime();
            otable.fnDraw();
        });


        minDateFilter = "";
        maxDateFilter = "";
        $.fn.dataTableExt.afnFiltering.push(

          function (oSettings, aData, iDataIndex) {
              if (typeof aData._date == 'undefined') {

                  aData._date = new Date(aData[2]).getTime();
              }

              if (minDateFilter && !isNaN(minDateFilter)) {

                  if (aData._date < minDateFilter) {
                      return false;
                  }
              }

              if (maxDateFilter && !isNaN(maxDateFilter)) {


                  if (aData._date > maxDateFilter) {
                      return false;
                  }
              }

              return true;
          }
        );
        if (typeof values[colnum] === "undefined") values[colnum] = {};


        $(result).each(function (i, val) {

            values[colnum][val.usedIn] = 1;

        });


        for (var prop in values[colnum]) {

            if (prop !== "0")
                arr.push(prop);

        }

        for (i = 0; i < arr.length; i++) {

            if (i === 0) {
                x = arr[i];
            }
            else {
                x = x + '|' + arr[i];
            }
        }

        $('#useRecord').val(x);

        $scope.filterme = function () {
            var types = $('input:checkbox[name="type"]:checked').map(function () {
                return this.value;
            }).get().join('|');


            otable.fnFilter(types, 5, true, false, false, false);

            otablemobile.fnFilter(types, 1, true, false, false, false);

            var frees = $('input:checkbox[name="free"]:checked').map(function () {

                return this.value;
            }).get().join('|');


            otable.fnFilter("^" + frees, 3, true, false, true, false);
        }
        var dialog = $('#spinnerDialog').data('dialog');
        dialog.close();
        // $($('.spinner')[0]).show();
    });

    return otable;
}

function clearAdminDatatable() {
    if ($.fn.DataTable.isDataTable("#adminTable") == true)
        $("#adminTable").DataTable().clear().destroy();
}

function showHideElement(documentId, showHide) {
    //document.getElementById(documentId).style.display = showHide;
}
function PopulateQuestionniareFromServer(questionnaire, questionnaireService, updateQuestionnaireService, questionnairePreviewService, $scope, apiUri) {
    globalScope.questionnaireService = questionnaireService;
    globalScope.updateQuestionnaireService = updateQuestionnaireService;
    globalScope.questionnairePreviewService = questionnairePreviewService;

    $('#dateModified').html('Date modified');

    var blnTenantVisible = true;
    var blnActiveAction = true;
    var blnDeletedBy = false;
    if (questionnaire == "#myQuestionnaire")
        blnTenantVisible = false;

    if (questionnaire == "#deletedQuestionnaire") {
        blnActiveAction = false;
        blnDeletedBy = true;
        $('#dateModified').html('Date deleted');
    }


    $('#adminTable').show();

    var otable = $('#adminTable').dataTable({
        "scrollX": true,
        "paging": true,
        "searching": false,
        "info": false,
        "bRetrieve": true,
        "autoWidth": false,
        "serverSide": true, // recommended to use serverSide when data is more than 10000 rows for performance reasons
        "ajax": {
            "url": apiUri,
            "type": "GET",
            "data": function (data) {
                fnPassExternalFilters(data, apiUri);
            },
            "error": function (data) {
                fnCloseSpinner();
                window.alert("Error occured while trying to retrieve Questionnaire data. Please try again.");
            }
        },
        "aaSorting": [[2, 'asc']],
        "columns": [
            { "data": "QuestionnaireName", "orderable": true },
            { "data": "TenantName", "orderable": true },
            { "data": "DateTimeChanged", "orderable": true },
            { "data": "UsedBy", "orderable": true },
            { "data": "TenantName", "orderable": true },
            { "data": "QuestionnaireVersionNumber", "orderable": true },
            { "data": "Active", "orderable": false },
            { "data": "Action", "orderable": false }
        ],
        "columnDefs": [
        {
            "targets": [1],
            "visible": blnTenantVisible,
            "searchable": false,
            "width": "25%"
        },
        {
            "targets": [0],
            "searchable": true,
            "width": "20%",
            "render": function (data, type, row) {
                return formatQuestionnaireName(data, type, row, $scope);
            }
        },
             {
                 "targets": [2],
                 "searchable": true,
                 "width": "20%",
                 "render": function (data, type, row) {
                     return formatData(data, type, row);
                 }
             },
             {
                 "targets": [3],
                 "searchable": true,
                 "width": "15%",
                 "visible": blnActiveAction
             },
             {
                 "targets": [4],
                 "searchable": true,
                 "width": "15%",
                 "visible": blnDeletedBy
             },
             {
                 "targets": [5],
                 "searchable": true,
                 "width": "10%"
             },
             {
                 "targets": [6],
                 "searchable": true,
                 "width": "15%",
                 "visible": blnActiveAction,
                 "render": function (data, type, row) {
                     return fnFormatActive(data, TypeError, row);
                 }

             },
             {
                 "targets": [7],
                 "searchable": true,
                 "width": "15%",
                 "visible": blnActiveAction,
                 "render": function (data, type, row, index) {
                     return fnFormatActions(data, type, row, index, questionnaire);
                 }
             }
        ],
        "createdRow": function (row, data, index) {

            fnFormatRow(data, row, index);

        },
        "drawCallback": function (settings) {
            fnCheckData(settings);
        }
    });

}
function fnCheckData(settings) {
    if (settings.aoData.length == 0) {

        fnCloseSpinner();
    }

}
function fnPassExternalFilters(data, apiUri) {

    var dialog = $('#spinnerDialog').data('dialog');
    dialog.open();
    data.toQuestionnaireDateValue = maxDateFilter;
    data.fromQuestionnaireDateValue = minDateFilter;
    data.activeInActive = types;
    data.searchText = $.trim($('#dataTableSearchText').val()) == '' ? '' : $.trim($('#dataTableSearchText').val());
    data.tenant = tenant;
}
function fnFormatActive(data, type, row) {

    if (!row.IsPublished) {
        data = "<label id='btn_checked' class='switch'><input type='checkbox' disabled";
    } else {
        data = "<label id='btn_checked' class='switch'><input type='checkbox'";

    }
    if (row.IsActive)
        data = data + " checked = true";
    if (parseInt(row.UsedBy) > 0)
        data = data + " 'disabled'";
    data = data + "><span class='check'></span></label>";
    return data;
}
function fnFormatActions(data, type, row, index, questionnaire) {
    if (questionnaire === "#myQuestionnaire")
        data = row.UsedBy === 0 ? "<a class='ms-Icon ms-Icon--pencil ms-Icon-CustomSize' onclick='fnRedirectToEditQuestionnaire(\"" + row.QuestionnaireVersionId + "\",\"" + row.IsNew + "\")'></a> <span id=" + row.QuestionnaireVersionId + " class='ms-Icon ms-Icon--trash ms-Icon-Custom-Red' onclick='fnDeleteQuestionnaire(this," + index.row + ")'></span>" : "<a class='ms-Icon ms-Icon--pencil ms-Icon-CustomSize' onclick='fnRedirectToEditQuestionnaire(\"" + row.QuestionnaireVersionId + "\",\"" + row.IsNew + "\")'></a> <span id='" + row.QuestionnaireVersionId + "' class='ms-Icon ms-Icon--trash ms-Icon-Custom-Gray'></span>";
    else {


        if (row.UsedBy === 0) {
            data = "<a class='ms-Icon ms-Icon--pencil ms-Icon-CustomSize'onclick='fnRedirectToEditQuestionnaire(\"" + row.QuestionnaireVersionId + "\",\"" + row.IsNew + "\")'></a>" +
                    "<span id =" + row.QuestionnaireVersionId + " class='ms-Icon ms-Icon--copy ms-Icon-CustomSize' onclick='fnCloneQuestionnaire(this)'></span>" +
                    "<span id=" + row.QuestionnaireVersionId + " class='ms-Icon ms-Icon--trash ms-Icon-Custom-Red' onclick='fnDeleteQuestionnaire(this," + index.row + ")'></span>"
        } else {

            data = "<a class='ms-Icon ms-Icon--pencil ms-Icon-CustomSize'onclick='fnRedirectToEditQuestionnaire(\"" + row.QuestionnaireVersionId + "\",\"" + row.IsNew + "\")'></a>" +
                    "<span id =" + row.QuestionnaireVersionId + " class='ms-Icon ms-Icon--copy ms-Icon-CustomSize' onclick='fnCloneQuestionnaire(this)'></span>" +
                    "<span id='" + row.QuestionnaireVersionId + "' class='ms-Icon ms-Icon--trash ms-Icon-Custom-Gray'></span>";
        }



    }
    return data;
}
function fnFormatRow(data, row, index) {

    $('td', row).eq(0).addClass('questionnaire_Name');
}
var count = 0;
function formatQuestionnaireName(data, type, row) {

    var dialog = $('#spinnerDialog').data('dialog');
    dialog.close();
    var newDraftFlag = "";
    if (row.IsNew)
        newDraftFlag = "New";
    if (!row.IsPublished)
        newDraftFlag = "Draft";
    data = "<a onclick='previewQuestionnaire(\"" + row.QuestionnaireVersionId + "\");return false' style='cursor:pointer'>" + data + "</a><span class='" + newDraftFlag + "'>" + newDraftFlag + "</span>";
    return data;
}
function formatData(data, type, row) {

    var index = data.indexOf("T");
    data = data.substring(0, index);
    var dataArray = data.split("-");
    var dateToParse = "";
    for (var i = 0; i < dataArray.length - 1 ; i++) {
        dateToParse += dataArray[i] + "/";
    }
    dateToParse += dataArray[dataArray.length - 1];
    return convertDate(dateToParse);
}

var maxDateFilter = "";
var minDateFilter = "";
var questionnaireType = "";
var searchText = "";
var tenant = "";
function ToQuestionnaireDateValue(questionnaireService, updateQuestionnaireService, questionnairePreviewService, $scope, $http) {
    $("#datepicker_to").datepicker({
        "onSelect": function (date) {
            var dateFormatted = date.replace(/\./g, '-');
            var getDates = new Date(dateFormatted);
            maxDateFilter = convertDate(getDates);
            var maxDate = new Date(maxDateFilter);
            var minDate = new Date(minDateFilter);
            if (maxDate < minDate) {
                $('#errorDate').css('display', 'inline-block');
                $('#errorDateDiv').css('display', 'inline-block');
            } else {
                $('#errorDate').css('display', 'none');
                $('#errorDateDiv').css('display', 'none');
                populateQuestionnaireType(questionnaireType, questionnaireService, updateQuestionnaireService, questionnairePreviewService, $scope, $http);
            }
        },
        "format": "mmmm d, yyyy"
    }).keyup(function () {
        maxDateFilter = new Date(this.value).getTime();
    });
}
function FromQuestionnaireDateValue(questionnaireService, updateQuestionnaireService, questionnairePreviewService, $scope, $http) {

    $("#datepicker_from").datepicker({
        "onSelect": function (date) {

            var dateFormatted = date.replace(/\./g, '-');
            var getDates = new Date(dateFormatted);
            minDateFilter = convertDate(getDates);
            if (maxDateFilter == "")
                maxDateFilter = convertDate(new Date());
            var maxDate = new Date(maxDateFilter);
            var minDate = new Date(minDateFilter);
            if (maxDate < minDate) {
                $('#errorDate').css('display', 'inline-block');
                $('#errorDateDiv').css('display', 'inline-block');
                $('#datePickerTo').val(maxDateFilter);
                $("#datepicker_to").datepicker();
            } else {
                $('#errorDate').css('display', 'none');
                $('#errorDateDiv').css('display', 'none');
                $('#datePickerTo').val(maxDateFilter)
                $("#datepicker_to").datepicker();
                populateQuestionnaireType(questionnaireType, questionnaireService, updateQuestionnaireService, questionnairePreviewService, $scope, $http);
            }

        },
        "format": "mmmm d, yyyy"
    }).keyup(function () {
        maxDateFilter = new Date(this.value).getTime();
    });

}

function showTenantDiv(show) {
    if (show) {
        $('#tenantDiv').css('display', 'block');
        $('#tenantLabel').css('display', 'block');
    } else {
        $('#tenantDiv').css('display', 'none');
        $('#tenantLabel').css('display', 'none');
    }
}
function fnOpenSpinner() {
    var dialog = $('#spinnerDialog').data('dialog');
    dialog.open();
}
function fnCloseSpinner() {
    var dialog = $('#spinnerDialog').data('dialog');
    dialog.close();
}
function populateQuestionnaireType(anchorId, questionnaireService, updateQuestionnaireService, questionnairePreviewService, $scope, $http) {
    $(anchorId).toggleClass('active', 'fg-lightgray');
    $('.active').toggleClass('active', 'fg-lightgray');
    var apiUri = "";
    var dialog = "";
    $scope.showActiveInActiveFilters = true;
    switch (anchorId) {
        case '#myQuestionnaire':
            showHideElement('tenant', 'none');
            clearAdminDatatable();
            $('#adminTable').hide();
            fnOpenSpinner();
            apiUri = 'api/questionnaire/GetQuestionnairesByTenant';
            questionnaireType = "#myQuestionnaire";
            PopulateQuestionniareFromServer("#myQuestionnaire", questionnaireService, updateQuestionnaireService, questionnairePreviewService, $scope, apiUri);
            showTenantDiv(false);
            $scope.showActiveInActiveFilters = true;
            break;
        case '#allQuestionnaire':
            showHideElement('tenant', '');
            showHideElement('activeQuestionnaire', '');
            showHideElement('actions', '');
            clearAdminDatatable();
            $('#adminTable').hide();
            fnOpenSpinner();
            apiUri = 'api/questionnaire/GetAllQuestionnnaires';
            questionnaireType = "#allQuestionnaire";
            PopulateQuestionniareFromServer("#allQuestionnaire", questionnaireService, updateQuestionnaireService, questionnairePreviewService, $scope, apiUri);
            showTenantDiv(true);
            break;
        case '#deletedQuestionnaire':
            showHideElement('activeQuestionnaire', 'none');
            showHideElement('actions', 'none');
            clearAdminDatatable();
            $('#adminTable').hide();
            fnOpenSpinner();
            types = "";
            apiUri = 'api/questionnaire/GetAllDeletedQuestionnaires';
            questionnaireType = "#deletedQuestionnaire";
            PopulateQuestionniareFromServer("#deletedQuestionnaire", questionnaireService, updateQuestionnaireService, questionnairePreviewService, $scope, apiUri);
            showTenantDiv(true);
            $scope.showActiveInActiveFilters = false;
            break;
    }
}

var types = "";
function getActiveInActive() {
    types = $('input:checkbox[name="type"]:checked').map(function () {

        return this.value;
    }).get().join('|');
}

function getSelectedTenat(questionnaireType, questionnaireService, updateQuestionnaireService, questionnairePreviewService, $scope, $http) {

    tenant = $scope.selectedTenant;
    populateQuestionnaireType(questionnaireType, questionnaireService, updateQuestionnaireService, questionnairePreviewService, $scope, $http);
}
function fnSearchDataTable(questionnaireService, updateQuestionnaireService, questionnairePreviewService, $scope, $http) {

    populateQuestionnaireType(questionnaireType, questionnaireService, updateQuestionnaireService, questionnairePreviewService, $scope, $http);
}
function fnResetFilters(questionnaireType, questionnaireService, updateQuestionnaireService, questionnairePreviewService, $scope, $http) {

    $("#datepicker_from").children()[0].value = "";
    $("#datepicker_to").children()[0].value = "";
    $('#activeQuestionnaire').attr('checked', false);
    $('#inactiveQuestionnaire').attr('checked', false);
    $('#dataTableSearchText').val("");
    $('#selectTenant').val("");
    $('#select2-selectTenant-container')[0].title = "";
    $('#select2-selectTenant-container')[0].textContent = "";
    $('#errorDateDiv').hide();
    maxDateFilter = "";
    minDateFilter = "";
    searchText = "";
    $scope.selectedTenant = "";
    tenant = "";
    types = "";
    populateQuestionnaireType(questionnaireType, questionnaireService, updateQuestionnaireService, questionnairePreviewService, $scope, $http);
}
vettingApp.controller('adminController', function ($scope, $http, $timeout, $window, questionnaireService, updateQuestionnaireService, questionnairePreviewService, WizardHandler, $location, $sce) {
    var languageId = "192C79DD-B246-4BF2-B297-A36338981F99";
    $scope.onFolderNumberKeyPress = function (event) {
        if (event.charCode == 13) {
            $scope.searchDataTable = function () {
                fnSearchDataTable(questionnaireService, updateQuestionnaireService, questionnairePreviewService, $scope, $http);
            }
            $scope.searchDataTable();
        }

    }
    $scope.redirectToAdmin = function () {
        $location.url('/admin');
        $window.location.reload();
    }

    $scope.redirectToWorkFlowLanding = function () {
        $location.url('/workflowLanding');
        $window.location.reload();
    }
    $scope.redirectToSystemSettings = function () {
        $location.url('/systemSettings');
    }
    globalScope.location = $location;
    questionnaireType = "#myQuestionnaire";
    $scope.fnClearFilters = function () {
        fnResetFilters(questionnaireType, questionnaireService, updateQuestionnaireService, questionnairePreviewService, $scope, $http);
    }
    var questionnaireVersionId = null;

    $scope.renderHtml = function (htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    }

    $scope.showChildQuestionsSingleChoice = function (branchingQuestionVersionIds, questionVersionId) {
        $('input[name=' + questionVersionId + ']').each(function (index, value) {
            var questionsToHide = $.parseJSON(this.attributes["branchingquestion"].value);
            $.each(questionsToHide, function (index, value) {
                $("#question" + value + "  div.questionHide").attr("style", "display: none !important");
            });
        });

        var questionsToShow = branchingQuestionVersionIds;
        $.each(questionsToShow, function (index, value) {
            $("#question" + value + "  div.questionHide").attr("style", "display: block !important");
            if ($("#question" + value).length)
                $(".steps").scrollTop($("#question" + value).position().top);
        });
    }

    $scope.showChildQuestionsMultipleChoice = function (childQuestionGroups, questionVersionId) {
        var count = 0;

        $('input[name=' + questionVersionId + ']').each(function (index, value) {
            if (this.checked)
                count++;
        });

        $.each(childQuestionGroups, function (index, childQuestion) {
            $("#question" + childQuestion.ChildQuestionId + "  div.questionHide").attr("style", "display: none !important");
        });

        $.each(childQuestionGroups, function (index, childQuestion) {
            var show = true;

            $.each(childQuestion.OptionIds, function (index, value) {
                var $checkbox = $('input[name=' + questionVersionId + '][value=' + value + ']');
                if ($checkbox.is(':checked') == false)
                    show = false;
            });

            if (show && count === childQuestion.OptionIds.length) {
                $("#question" + childQuestion.ChildQuestionId + "  div.questionHide").attr("style", "display: block !important");
                $(".steps").scrollTop($("#question" + childQuestion.ChildQuestionId).position().top);
            }
        });
    }

    $scope.$on('handleQuestionnairePreviewBroadcast', function () {
        questionnaireVersionId = questionnairePreviewService.questionnaireVersionId;

        showDialog("#spinnerDialog");

        $http.get("/api/Questionnaire/GetQuestionnaireByQuestionnaireVersionId?QuestionnaireVersionId=" + questionnaireVersionId).success(
        function (result) {
            $scope.questionnaireName = result.QuestionnaireName;
            $scope.questionnaireIntro = result.QuestionnaireIntro;
            $scope.questionnaireThankYou = result.HelpText;
        }).error(
                                    function () {
                                        $scope.questionnaireName = null;
                                        $scope.questionnaireIntro = null;
                                        $scope.questionnaireThankYou = null;
                                    }
                                    );

        $http.get('api/question/GetQuestionPages?questionnaireVersionId=' + questionnaireVersionId + '&languageId=' + languageId).success(function (result) {
            $scope.questionnairePreviewPages = result;
            if (result.length === 0) {
                var dialog = $("#spinnerDialog").data('dialog');
                dialog.close();
                showDialog("#dialogPreviewQuestionnaire");
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
        }).error(
                                    function () {
                                        var dialog = $("#spinnerDialog").data('dialog');
                                        dialog.close();
                                        showDialog("#dialogPreviewQuestionnaire");
                                    }
                                    );

    });

    $scope.goToWizard = function ($event) {
        $event.stopPropagation();
        $scope.questionnairePreviewPercentageComplete = 0;
        $scope.questionnairePreviewCurrentPageNumber = 1;
        $scope.questionnairePreviewPageCount = $("#previewWizard").find(".step").length;
        if ($scope.questionnairePreviewPageCount > 0) {
            $("#previewWizard").wizard(
                {
                    onPage: function (page, wiz) {
                        //alert(page);
                        $("#previewWizard a").attr("target", "_blank");
                        var scope = angular.element($("#previewWizard")).scope();
                        if (scope) {
                            scope.$apply(function () {
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
                            });
                        }
                        return true;
                    },
                    onFinish: function (page, wiz) {
                        //alert('finish:' + page);
                        $("#previewWizard").hide();
                        $(".previewHeadingRight").attr("style", "display: none !important");
                        $(".previewBye").show();
                    }
                }
            );
            $(".wizard .stepper>ul").attr("style", "width: " + (($scope.questionnairePreviewPageCount - 1) * 45) + "px!important");
            $(".previewWelcome").hide();
            $("#previewWizard").show();
            // Not showing percentage complete in Questionnaire Preview for now
            //$(".previewHeadingRight").attr("style", "display: block !important");
        }
        else {
            $(".previewWelcome").hide();
            $(".previewBye").show();
        }
    }


    LoadTenant($scope, questionnaireService);
    showTenantDiv(false);
    $scope.reDirectToNewQuestionnaire = function () {
        $location.url('/newQuestionnaire');

    }
    $scope.searchDataTable = function () {
        fnSearchDataTable(questionnaireService, updateQuestionnaireService, questionnairePreviewService, $scope, $http);
    }
    $scope.SetSelectTenant = function () {
        getSelectedTenat(questionnaireType, questionnaireService, updateQuestionnaireService, questionnairePreviewService, $scope, $http);
    }
    $('#area').multipleSelect({ width: '40%', height: '40px' });
    questionnaireType = "#myQuestionnaire";
    var dialog = $('#spinnerDialog').data('dialog');
    dialog.open();
    ToQuestionnaireDateValue(questionnaireService, updateQuestionnaireService, questionnairePreviewService, $scope, $http);
    FromQuestionnaireDateValue(questionnaireService, updateQuestionnaireService, questionnairePreviewService, $scope, $http);
    //$($('#spinner')[0]).show();
    $scope.changeClass = function (anchorId) {
        populateQuestionnaireType(anchorId, questionnaireService, updateQuestionnaireService, questionnairePreviewService, $scope, $http);
    }
    showHideElement('tenant', 'none');
    $scope.showActiveInActiveFilters = true;
    var otable = PopulateQuestionniareFromServer("#myQuestionnaire", questionnaireService, updateQuestionnaireService, questionnairePreviewService, $scope, 'api/questionnaire/GetQuestionnairesByTenant');
    $scope.filterme = function () {

        getActiveInActive();
        populateQuestionnaireType(questionnaireType, questionnaireService, updateQuestionnaireService, questionnairePreviewService, $scope, $http);
    }




    $('a.toggle-vis').on('click', function (e) {

        e.preventDefault();
        otable = $("#adminTable").dataTable();
        var bVis = otable.fnSettings().aoColumns[$(this).attr('data-column')].bVisible;
        otable.fnSetColumnVis($(this).attr('data-column'), bVis ? false : true);
    });

});




vettingApp.controller('IntermediateCtrl', ['$scope', function ($scope) {
    var input = document.querySelector('countryCode');
    for (var i = 0; i < input.length; i++) {
        input[i].setAttribute('size', input[i].getAttribute('maxlength').value);
    }
}]);

vettingApp.directive('moveFocus', function () {
    return {
        restrict: 'AE',
        link: function (scope, element, attr) {

            element.on('keyup', function (evt) {
                if (element.val().length == element.attr('maxlength')) {
                    if (element.next()[0] != null)
                        element.next()[0].focus();
                }

            });
            element.on('keypress', function (evt) {
                var charCode = (evt.which) ? evt.which : event.keyCode;
                if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
                    return false;
                } else {
                    return true;
                }
            });
        }
    }
});

vettingApp.factory('dataService', function ($http) {
    var getData = function (apiUri) {
        return $http.get(apiUri).then(function (result) {
            return result.data;
        }).catch(function (e) {
            var dialog = $("#spinnerDialog").data('dialog');
            dialog.close();
            alert("Error. Please try again.");
        });
    };
    return { getData: getData };
});

vettingApp.factory('permissionsService', function ($rootScope) {
    var permissionsService = {};

    permissionsService.selectedGroupId = '';

    permissionsService.prepForBroadcast = function (selectedGroupId) {
        this.selectedGroupId = selectedGroupId;
        this.broadcastItem();
    };

    permissionsService.broadcastItem = function () {
        $rootScope.$broadcast('handleBroadcast');
    };

    return permissionsService;
});

vettingApp.controller('groupController', function ($scope, $http, $location, permissionsService, dataService, $window, toastr) {
    var group_Id = '', group_name = '', group_dateTimeCreated = '', group_isDeleted = '';
    $scope.updateInProgress = false;
    $scope.selectedIndex = -1;
    showDialog("#spinnerDialog");
    $scope.redirectToWorkFlowLanding = function () {
        $location.url('/workflowLanding');
        $window.location.reload();
    }

    $scope.redirectToAdmin = function () {

        $location.url('/admin');
        $window.location.reload();
    };
    $scope.goToOnBoarding = function () {
        $scope.$broadcast('showOnBoarding');
    };
    $scope.goToRoles = function () {
        $scope.$broadcast('showRoles');
    };
    $scope.goToAudience = function () {
        $scope.$broadcast('showAudience');
    };
    $scope.goToRiskScores = function () {
        $scope.$broadcast('showRiskScores');
    };
    var groups = dataService.getData('api/Group');
    groups.then(function (result) {
        $scope.groupsArray = result;
        var dialog = $("#spinnerDialog").data('dialog');
        dialog.close();
    });

    $scope.saveGroup = function () {

        showDialog("#spinnerDialog");
        debugger;
        var dataParams = {
            GroupId: null,
            DateTimeChanged: null,
            DateTimeCreated: null,
            IsDeleted: 0,
            Name: $scope.groupName
        }
        var url = "api/group";

        $http.post(url, dataParams).success(function (data) {
            debugger;
            groups = dataService.getData('api/Group');
            groups.then(function (result) {
                $scope.groupsArray = result;
                $("#addGroupPanel").hide();
                $scope.groupName = null;
                var dialog = $("#spinnerDialog").data('dialog');
                dialog.close();
                document.body.scrollTop = document.documentElement.scrollTop = 0;

                //showDialog("#dialogGroupSaved");
            });
        }).error(
                                    function () {
                                        var dialog = $("#spinnerDialog").data('dialog');
                                        dialog.close();
                                        alert("Error. Please try again.");
                                        document.body.scrollTop = document.documentElement.scrollTop = 0;

                                    }
                                    );
    }

    $scope.cancelGroup = function () {
        $("#addGroupPanel").hide();
        $scope.groupName = null;
        document.body.scrollTop = document.documentElement.scrollTop = 0;

    }

    $scope.cancelGroupEdit = function (groupId) {
        
        var dialog = $("#spinnerDialog").data('dialog');
        dialog.open();

        groups = dataService.getData('api/Group');
        groups.then(function (result) {
            $scope.groupsArray = result;


            $("#editGroupPanel" + groupId).hide();
            $("#displayGroupPanel" + groupId).show();
            $scope.groupName = null;

            var dialog = $("#spinnerDialog").data('dialog');
            dialog.close();
            $scope.updateInProgress = false;

        });



    }
    
    
    $scope.deleteGroup = function (groupId, name, dateTimeCreated, isDeleted) {
        if ($scope.updateInProgress === true) {
            return false;
        }
        var dialogDeleteGroup;
        dialogDeleteGroup = $("#dialogDeleteGroup").data('dialog');
        dialogDeleteGroup.open();
        group_Id = groupId;
        group_name = name;
        group_dateTimeCreated = dateTimeCreated;
        group_isDeleted = isDeleted;
    }
    $scope.updateGroup = function (groupId, name, dateTimeCreated, isDeleted) {
        
        if (isDeleted != 0) {
            isDeleted = group_isDeleted;
            groupId = group_Id;
            name = group_name;
            dateTimeCreated = group_dateTimeCreated;
        }
        
        showDialog("#spinnerDialog");

        var dataParams = {
            groupId: groupId,
            dateTimeChanged: null,
            dateTimeCreated: dateTimeCreated,
            isDeleted: isDeleted,
            name: name
        }

        var url = "api/Group/";

        //if (isDeleted == 0 || confirm("Are you sure you want to delete this group?")) {
            $http.put(url, dataParams).success(function (data) {
                groups = dataService.getData('api/Group');
                groups.then(function (result) {
                    $scope.groupsArray = result;
                    $("#editGroupPanel" + groupId).hide();
                    $("#displayGroupPanel" + groupId).show();

                    var dialog = $("#spinnerDialog").data('dialog');
                    dialog.close();
                    var dialogDeleteGroup;
                    dialogDeleteGroup = $("#dialogDeleteGroup").data('dialog');
                    
                    dialogDeleteGroup.close();
                    if (isDeleted == 0) {
                        toastr.success('', 'The group was saved successfully.');
                        
                    }
                    else {
                        $("#users").attr("style", "display: none!important");
                        $("#roles").attr("style", "display: none!important");
                        toastr.success('', 'The group was deleted successfully.');
                        
                        $scope.selectedIndex = -1;
                    }
                    $scope.updateInProgress = false;
                });

            }).error(
                                    function () {
                                        var dialog = $("#spinnerDialog").data('dialog');
                                        dialog.close();
                                        var dialogDeleteGroup;
                                        dialogDeleteGroup = $("#dialogDeleteGroup").data('dialog');
                                        
                                        dialogDeleteGroup.close();

                                        toastr.error('', 'Error occured. Please contact support team.');
                                    }
                                    );
        //}
        //else {
            //var dialog = $("#spinnerDialog").data('dialog');
            //dialog.close();
        //}
    }
    $scope.deleteGroupCancel = function () {
        var dialogDeleteGroup;
        dialogDeleteGroup = $("#dialogDeleteGroup").data('dialog');
       
        dialogDeleteGroup.close();
    }
    $scope.showAddGroupPanel = function () {
        window.scrollTo(0, document.body.scrollHeight);
        $("#addGroupPanel").show();
        $scope.groupName = null;
        $scope.groupDisabled = true;
        $scope.errorMessage = false;
    }

    $scope.showEditGroupPanel = function (groupId) {

        if ($scope.updateInProgress === true) {
            return false;
        }
        

        $("#displayGroupPanel" + groupId).hide();
        $("#editGroupPanel" + groupId).show();
        $scope.updateInProgress = true;
    }

    $scope.showGroupButtons = function (groupId) {
        $("#dGroup" + groupId).show();
        $("#eGroup" + groupId).show();
    }

    $scope.hideGroupButtons = function (groupId) {
        $("#dGroup" + groupId).hide();
        $("#eGroup" + groupId).hide();
    }

    $scope.showUsersAndPermissions = function (groupId, index) {
        if ($scope.updateInProgress === true) {
            return false;
        }
        $scope.selectedIndex = index;
        $(".list").removeClass("active");
        $("#groupList" + groupId).addClass("active");
        permissionsService.prepForBroadcast(groupId);
    }
    $scope.groupDisabled = true;
    $scope.groupNameValidation = function () {
        if ($scope.groupName != undefined && $scope.groupName!='') {
            $scope.groupDisabled = false;
            $scope.errorMessage = false;
        }
        
        else {
            $scope.groupDisabled = true;
            $scope.errorMessage = true;
        }
    }


    





});

vettingApp.controller('roleController', function ($scope, $http, $location, permissionsService, dataService) {

    

    
    var roles = null;
    var roleTypes = null;

    $scope.$on('handleBroadcast', function () {
        showDialog("#spinnerDialog");

        $scope.addPermissionsArray = [];
        $scope.deletePermissionsArray = [];

        $scope.selectedGroupId = permissionsService.selectedGroupId;

        roleTypes = dataService.getData('api/Role/GetRoleTypes');
        roleTypes.then(function (result) {
            $scope.roleTypeArray = result;

            roles = dataService.getData('api/Role/GetRolesInGroup?groupId=' + $scope.selectedGroupId);
            roles.then(function (result) {
                $scope.rolesForGroupArray = result;

                $("#roles").attr("style", "display: block!important");

                var dialog = $("#spinnerDialog").data('dialog');
                dialog.close();
            });

        });

    });

    $scope.refreshPermissions = function () {
        showDialog("#spinnerDialog");

        $scope.addPermissionsArray = [];
        $scope.deletePermissionsArray = [];

        roleTypes = dataService.getData('api/Role/GetRoleTypes');
        roleTypes.then(function (result) {
            $scope.roleTypeArray = result;

            roles = dataService.getData('api/Role/GetRolesInGroup?groupId=' + $scope.selectedGroupId);
            roles.then(function (result) {
                $scope.rolesForGroupArray = result;

                $("#roles").attr("style", "display: block!important");

                var dialog = $("#spinnerDialog").data('dialog');
                dialog.close();
                document.body.scrollTop = document.documentElement.scrollTop = 0;

            });

        });
    }


    $scope.isInRoleArray = function (roleId) {
        if ($scope.rolesForGroupArray) {
            return $scope.rolesForGroupArray.map(function (role) { return role.RoleId; }).indexOf(roleId);
        }
        else {
            return -1;
        }
    }


    $scope.areAllChecked = function (roleTypeId) {
        if ($scope.rolesForGroupArray) {
            return $scope.rolesForGroupArray.filter(function (role) { return role.RoleTypeId == roleTypeId; }).length;
        }
        else {
            return -1;
        }
    }

    $scope.savePermissions = function () {

        

        showDialog("#spinnerDialog");

        var currentLength = 0;
        var finalLength = $scope.addPermissionsArray.length + $scope.deletePermissionsArray.length;

        if (finalLength == 0) {
            var dialog = $("#spinnerDialog").data('dialog');
            dialog.close();
        }

        angular.forEach($scope.addPermissionsArray, function (value, index) {
            var dataParams = {
                groupId: $scope.selectedGroupId,
                roleId: value
            }

            $http.post('api/Group/AddGroupToRole', dataParams).success(function (data) {
                currentLength++;
                if (currentLength == finalLength) {
                    $scope.addPermissionsArray = [];
                    $scope.deletePermissionsArray = [];
                    var dialog = $("#spinnerDialog").data('dialog');
                    dialog.close();
                    document.body.scrollTop = document.documentElement.scrollTop = 0;

                }
            }).error(
                function () {
                    var dialog = $("#spinnerDialog").data('dialog');
                    dialog.close();
                    alert("Error. Please try again.");
                    document.body.scrollTop = document.documentElement.scrollTop = 0;

                }
                );

        });

        angular.forEach($scope.deletePermissionsArray, function (value, index) {
            var url = "api/Group/RemoveGroupFromRole/" + $scope.selectedGroupId + "/" + value;


            $http.delete(url).success(function () {
                currentLength++;
                if (currentLength == finalLength) {
                    $scope.addPermissionsArray = [];
                    $scope.deletePermissionsArray = [];
                    var dialog = $("#spinnerDialog").data('dialog');
                    dialog.close();
                }
            }).error(
                                    function () {
                                        var dialog = $("#spinnerDialog").data('dialog');
                                        dialog.close();
                                        alert("Error. Please try again.");
                                    }
                                    );


        });
    }

    $scope.toggleRoleToGroup = function (roleId) {
        var $checkbox = $('input[name=' + roleId + ']');
        if ($checkbox.is(':checked') == true) {
            var roleTypeName = $checkbox.attr("roleTypeId");
            var checkCount = 0;
            $('input[roleTypeId=' + roleTypeName + ']').each(function (index, value) {
                if (this.checked)
                    checkCount++;
            });
            if (checkCount == 3) {
                document.getElementById(roleTypeName).checked = true;
                $('input[name=' + roleTypeName + ']').attr('checked', true);
            }

            if ($scope.addPermissionsArray.indexOf(roleId) == -1 && ($scope.rolesForGroupArray == null || $scope.rolesForGroupArray.map(function (role) { return role.RoleId; }).indexOf(roleId) == -1))
                $scope.addPermissionsArray.push(roleId);

            if ($scope.deletePermissionsArray.indexOf(roleId) > -1)
                $scope.deletePermissionsArray.splice($scope.deletePermissionsArray.indexOf(roleId), 1);
        }
        else {
            var roleTypeName = $checkbox.attr("roleTypeId");
            $('input[name=' + roleTypeName + ']').attr('checked', false);

            if ($scope.deletePermissionsArray.indexOf(roleId) == -1 && $scope.rolesForGroupArray != null && $scope.rolesForGroupArray.map(function (role) { return role.RoleId; }).indexOf(roleId) > -1)
                $scope.deletePermissionsArray.push(roleId);

            if ($scope.addPermissionsArray.indexOf(roleId) > -1)
                $scope.addPermissionsArray.splice($scope.addPermissionsArray.indexOf(roleId), 1);
        }
    }


    $scope.toggleRoleTypeToGroup = function (roleTypeId) {
        var $checkbox = $('input[name=' + roleTypeId + ']');
        if ($checkbox.is(':checked') == true) {

            $('input[roleTypeId=' + roleTypeId + ']').each(function (index, value) {
                if (!this.checked) {
                    if ($scope.addPermissionsArray.indexOf(this.value) == -1 && ($scope.rolesForGroupArray == null || $scope.rolesForGroupArray.map(function (role) { return role.RoleId; }).indexOf(this.value) == -1))
                        $scope.addPermissionsArray.push(this.value);
                    
                    if ($scope.deletePermissionsArray.indexOf(this.value) > -1)
                        $scope.deletePermissionsArray.splice($scope.deletePermissionsArray.indexOf(this.value), 1);
                    this.checked = true;
                }
            });
        }
        else {

            $('input[roleTypeId=' + roleTypeId + ']').each(function (index, value) {
                if (this.checked) {
                    if ($scope.deletePermissionsArray.indexOf(this.value) == -1 && $scope.rolesForGroupArray != null && $scope.rolesForGroupArray.map(function (role) { return role.RoleId; }).indexOf(this.value) > -1)
                        $scope.deletePermissionsArray.push(this.value);

                    if ($scope.addPermissionsArray.indexOf(this.value) > -1)
                        $scope.addPermissionsArray.splice($scope.addPermissionsArray.indexOf(this.value), 1);

                    this.checked = false;
                }
            });
        }
    }

});

vettingApp.controller('userController', function ($scope, $http, $location, permissionsService, dataService,toastr) {
    var users = null;
    var user_Id = '';
    $scope.showUserDialog = function (userId) {
      //  $scope.deleteGroup = function (groupId, name, dateTimeCreated, isDeleted) {
            var dialogDeleteUser;
            dialogDeleteUser = $("#dialogDeleteUser").data('dialog');
            dialogDeleteUser.open();
            user_Id = userId;
            
      //  }


    }


    $scope.removeUserFromGroup = function (userId) {
        userId = user_Id;
        showDialog("#spinnerDialog");

        var url = "api/User/RemoveUserFromGroup/" + userId + "/" + $scope.selectedGroupId;

      //  if (confirm("Are you sure you want to remove this user from this group?")) {
            $http.delete(url).success(function () {
                users = dataService.getData('api/User/GetUsersInGroup?groupId=' + $scope.selectedGroupId);
                users.then(function (result) {
                    $scope.usersArray = result;
                    var dialog = $("#spinnerDialog").data('dialog');
                    dialog.close();
                    var dialogDeleteUser;
                    dialogDeleteUser = $("#dialogDeleteUser").data('dialog');
                    dialogDeleteUser.close();
                    //showDialog("#dialogUserDeleted");
                    toastr.success('', 'The user was deleted successfully.');

                });
            }).error(
                                    function () {
                                        var dialog = $("#spinnerDialog").data('dialog');
                                        dialog.close();
                                        var dialogDeleteUser;
                                        dialogDeleteUser = $("#dialogDeleteUser").data('dialog');
                                        dialogDeleteUser.close();
                                        toastr.error('', 'Error. Please try again.');
                                    }
                                    );
       // }
        //else {
        //    var dialog = $("#spinnerDialog").data('dialog');
        //    dialog.close();
        //}
    }




    $scope.userDisabled = true;
    $scope.emailValidation = function () {
        if ($scope.userName != undefined && $scope.userName != '') {
            $scope.userDisabled = false;
            $scope.errorMessage_User = false;
        }

        else {
            $scope.userDisabled = true;
            $scope.errorMessage_User = true;
        }
    }




    $scope.$on('handleBroadcast', function () {
        showDialog("#spinnerDialog");

        $("#users").attr("style", "display: block!important");

        $scope.selectedGroupId = permissionsService.selectedGroupId;

        users = dataService.getData('api/User/GetUsersInGroup?groupId=' + $scope.selectedGroupId);
        users.then(function (result) {
            $scope.usersArray = result;
        });
    });


    $scope.saveUser = function () {
        showDialog("#spinnerDialog");

        $http.get("/api/User/GetByEmail?email=" + $scope.userName).success(
            function (result) {
                if (result === "null") {
                    var dataParams1 = {
                        userId: null,
                        dateTimeChanged: null,
                        dateTimeCreated: null,
                        isDeleted: false,
                        email: $scope.userName,
                        tenantId: null
                    }

                    $http.post('api/User', dataParams1).success(function (data) {
                        $http.get("/api/User/GetByEmail?email=" + $scope.userName).success(
                            function (result) {
                                var dataParams2 = {
                                    userId: result.UserId,
                                    groupId: $scope.selectedGroupId
                                }


                                $http.post('api/User/AddUserToGroup', dataParams2).success(function (data) {
                                    users = dataService.getData('api/User/GetUsersInGroup?groupId=' + $scope.selectedGroupId);
                                    users.then(function (result) {
                                        $scope.usersArray = result;
                                        $("#addUserPanel").hide();
                                        $scope.userName = null;
                                        var dialog = $("#spinnerDialog").data('dialog');
                                        dialog.close();
                                        //showDialog("#dialogUserSaved");
                                    });
                                }).error(
                                    function () {
                                        var dialog = $("#spinnerDialog").data('dialog');
                                        dialog.close();
                                        alert("Error. Please try again.");
                                    }
                                    );

                            });
                    });
                }
                else {
                    var dataParams2 = {
                        userId: result.UserId,
                        groupId: $scope.selectedGroupId
                    }

                    $http.post('api/User/AddUserToGroup', dataParams2).success(function (data) {
                        users = dataService.getData('api/User/GetUsersInGroup?groupId=' + $scope.selectedGroupId);
                        users.then(function (result) {
                            $scope.usersArray = result;
                            $("#addUserPanel").hide();
                            $scope.userName = null;
                            var dialog = $("#spinnerDialog").data('dialog');
                            dialog.close();
                            //showDialog("#dialogUserSaved");
                        });
                    }).error(
                                    function () {
                                        var dialog = $("#spinnerDialog").data('dialog');
                                        dialog.close();
                                        alert("Error. Please try again.");
                                    }
                                    );
                }
            }).error(
                                    function () {
                                        var dialog = $("#spinnerDialog").data('dialog');
                                        dialog.close();
                                        alert("Error. Please try again.");
                                    }
                                    );
    }

    $scope.cancelUser = function () {
        $("#addUserPanel").hide();
        $scope.userName = null;
    }

    

    $scope.showAddUserPanel = function () {
        $("#addUserPanel").show();
        $scope.userName = null;
        $scope.userDisabled = true;
        $scope.errorMessage_User = false;
    }
    $scope.deleteUserCancel = function () {
        var dialogDeleteUser;
        dialogDeleteUser = $("#dialogDeleteUser").data('dialog');

        dialogDeleteUser.close();
    }
    $scope.showUserButtons = function (userId) {
        $("#dUser" + userId).show();
    }

    $scope.hideUserButtons = function (userId) {
        $("#dUser" + userId).hide();
    }
});

function showDialog(id) {
    var dialog = $(id).data('dialog');
    dialog.open();
}

function previewQuestionnaire(questionnaireVersionId) {

    globalScope.questionnairePreviewService.prepForBroadcast(questionnaireVersionId);
}

vettingApp.directive('finPreviewPagesLoad', function () {
    return function (scope, element, attr) {
        if (scope.$last) {
            $("textarea").htmlarea();
            var dialog = $("#spinnerDialog").data('dialog');
            dialog.close();
            showDialog("#dialogPreviewQuestionnaire");
        }
    }
});

vettingApp.directive('finPreviewQuestionsLoad', function ($timeout) {
    return function (scope, element, attr) {
        if (scope.$last === true) {
            element.ready($timeout(function () {
                $(".step a").attr("target", "_blank");
            }), 0);
        }
    }
});

vettingApp.service('questionnairePreviewService', function ($rootScope) {
    var questionnairePreviewService = {};

    questionnairePreviewService.questionnaireVersionId = '';

    questionnairePreviewService.prepForBroadcast = function (questionnaireVersionId) {
        this.questionnaireVersionId = questionnaireVersionId;
        this.broadcastItem();
    };

    questionnairePreviewService.broadcastItem = function () {
        $rootScope.$broadcast('handleQuestionnairePreviewBroadcast');
    };

    return questionnairePreviewService;
});

function LoadTenant($scope, questionnaireService) {

    var myDataPromise = questionnaireService.getData('api/Tenant');
    myDataPromise.then(function (result) {
        $scope.tenants = result;
    });
}

vettingApp.filter('range', function () {
    return function (input, total) {
        total = parseInt(total);
        for (var i = 0; i < total; i++)
            input.push(i);
        return input;
    };
});

vettingApp.controller('previewQuestionnaireDataList', function ($scope, $http, $location) {
    $scope.dataListEntry = { dataListFields: {} };

    $scope.dataListEntries = [];

    $scope.saveDataList = function () {
        $scope.dataListEntries.push({ fields: $scope.dataListEntry });
        $scope.dataListEntry = { dataListFields: {} };
    }

    $scope.removeEntry = function (index) {
        $scope.dataListEntries.splice(index, 1);
    }
});

vettingApp.filter('range', function () {
    return function (input, total) {
        total = parseInt(total);
        for (var i = 0; i < total; i++)
            input.push(i);
        return input;
    };
});

vettingApp.directive("previewLinksOpenNewWindow", function () {
    return function (scope, element, attrs) {
        scope.$watch("questionnaireIntro", function (value) {
            $("#dialogPreviewQuestionnaire a").attr("target", "_blank");
        });
        scope.$watch("questionnaireThankYou", function (value) {
            $("#dialogPreviewQuestionnaire a").attr("target", "_blank");
        });
    };
});
