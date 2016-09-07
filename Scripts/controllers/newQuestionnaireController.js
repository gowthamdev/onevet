vettingApp.controller('newQuestionnaireController', function ($scope, $http, $window, $location, questionnaireService) {
    var items = ["bold", "italic", "underline", "link", "unlink", "orderedlist", "unorderedlist"];
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

    $('#title').keydown(function (event) {
        if (!supressNonEng(event)) {
            $('#title').val("");
            isNonEnglishTitle = true;
            $("#errorNonEngTitle").css('display', 'inline-block');
            return false;
        }
        else
            $("#errorNonEngTitle").css('display', 'none');
    });
    //$('#title').blur(function (event) {
    //    return removeNonEng(event);
    //});
    ///new
    $scope.invalidTitle = false;
    $scope.isNonEnglishTitle = false;
    $scope.checkTitle = function () {
        if (!$scope.questionnaireTitle || $scope.questionnaireTitle.trim().length === 0) {
            $scope.invalidTitle = true;
        } else {
            $scope.invalidTitle = false;
        }
    };

    $scope.changeTitle = function () {
        var pattern = /^[^-\s][a-zA-Z0-9\s]*$/;
        if (!pattern.test($scope.questionnaireTitle)) {
            $scope.isNonEnglishTitle = true;
            $scope.questionnaireTitle = '';
        } else {
            $scope.isNonEnglishTitle = false;
            $scope.invalidTitle = false;
        }
    };

    var param = $location.search().id;
    if (param != null && param != "") {
        var questSpinnerdialog = $('#spinnerDialog').data('dialog');
        questSpinnerdialog.open();
        $scope.questionnaireHeading = "Edit Questionnaire";
        var myDataPromise = questionnaireService.getData('api/Questionnaire/GetQuestionnaireByQuestionnaireVersionId?questionnaireVersionId=' + param);
        myDataPromise.then(function (result) {
            if (result == "null") {
                alert('An error occured. Please try again.');
                $location.url('/admin');
                questSpinnerdialog.close();
            }
            else {
                questSpinnerdialog.close();
                $scope.questionnaireTitle = result.QuestionnaireName;
                $('#questIntro').htmlarea('html', result.QuestionnaireIntro);
                $('#questHelpText').htmlarea('html', result.HelpText);
                $scope.selectAreaCountries = result.AreaCountriesForGet;
                $scope.selectFiscalyear = result.FiscalYearIds;
                fnLoadDropdownsOnNewQustionnaire($scope, questionnaireService, true);
                $scope.questionnaireId = result.QuestionnaireId;
                $scope.questionnaireVersionNumber = result.QuestionnaireVersionNumber;
            }
        });
    } else {
        fnLoadDropdownsOnNewQustionnaire($scope, questionnaireService, false);
        $scope.questionnaireHeading = "New Questionnaire";
    }

    $scope.redirectWithoutSave = function () {
        $location.url('/admin');
    }

    $scope.saveQuestionnaireAndRediect = function () {
        fnOpenSpinner();
        if (ValidateQuestionnaire()) {
            var dataParams = {
                questionnaireId: $scope.questionnaireId,
                tenantId: "FB030F50-4204-4883-849F-1C0022EF6925",
                isDeleted: 0,
                dateTimeCreated: null,
                dateTimeChanged: null,
                fiscalYearIds: $('#fiscalYear').multipleSelect('getSelects'),
                questionnaireIntro: $('#questIntro').val(),
                questionnaireVersionId: $location.search().id,
                questionnaireVersionNumber: $scope.questionnaireVersionNumber,
                helpText: $('#questHelpText').val(),
                languageId: "192C79DD-B246-4BF2-B297-A36338981F99",
                questionnaireName: $scope.questionnaireTitle,
                questionnaireVersionLocalizedTextId: null,
                AreaCountries: creatJsonforAreaCountryForSaving(),
                isActive: 0
            }
            var url = "api/questionnaire";
            if ($location.search().id == null) {
                $http.post(url, dataParams).success(function (data) {

                    $location.url('/admin');
                }).error(function () {
                    fnCloseSpinner();
                    window.alert("Error occured while creating questionnaire. Please contact support team.");
                });
            } else {
                $http.put(url, dataParams).success(function (data) {

                    $location.url('/admin');
                }).error(function () {
                    fnCloseSpinner();
                    window.alert("Error occured while updating questionnaire. Please contact support team.");
                });
            }
        } else
            fnCloseSpinner();
    }
    $scope.saveQuestionnaire = function () {
        var questSpinnerdialog = $('#spinnerDialog').data('dialog');
        questSpinnerdialog.open();
        $scope.checkTitle();
        var inValid = $scope.invalidTitle;
        if (ValidateQuestionnaire() && !inValid) {
            var dataParams = {
                questionnaireId: $scope.questionnaireId,
                tenantId: "FB030F50-4204-4883-849F-1C0022EF6925",
                isDeleted: 0,
                dateTimeCreated: null,
                dateTimeChanged: null,
                fiscalYearIds: $('#fiscalYear').multipleSelect('getSelects'),
                questionnaireIntro: $('#questIntro').val(),
                questionnaireVersionId: $location.search().id,
                questionnaireVersionNumber: $scope.questionnaireVersionNumber,
                helpText: $('#questHelpText').val(),
                languageId: "192C79DD-B246-4BF2-B297-A36338981F99",
                questionnaireName: $scope.questionnaireTitle,
                questionnaireVersionLocalizedTextId: null,
                AreaCountries: creatJsonforAreaCountryForSaving(),
                isActive: 0
            }

            var url = "api/questionnaire";
            var questionnaireData;

            if ($location.search().id == null) {
                $http.post(url, dataParams).success(function (data) {


                    data = data.replace(/(^"|"$)/g, '');
                    questionnaireData = data;
                    $location.path('/newQuestionnaireStep2').search('questionnaireId', data);
                    questSpinnerdialog.close();
                }).error(function () {
                    fnCloseSpinner();
                    window.alert("Error occured while creating questionnaire. Please contact support team.");
                });
            } else {

                $http.put(url, dataParams).success(function (questionnaireData) {
                    $http.get('api/question/GetQuestionPageTitles?questionnaireVersionId=' + $location.search().id + '&languageId=192C79DD-B246-4BF2-B297-A36338981F99').success(function (data) {
                        questionnaireData = questionnaireData.replace(/(^"|"$)/g, '');
                        if (data.length != 0) {
                            $location.url('/step2Edit?questionnaireId=' + questionnaireData);
                            stepTwoDataBinding(data);

                        }
                        else {
                            $location.url('/newQuestionnaireStep2?questionnaireId=' + $location.search().id);
                            questSpinnerdialog.close();
                        }
                    }).error(function () {
                        fnCloseSpinner();
                        window.alert("Error occured while retrieving page and question details. Please contact support team.");
                    });
                }).error(function () {
                    fnCloseSpinner();
                    window.alert("Error occured while updating questionnaire. Please contact support team.");
                });
            }

        }
        else
            questSpinnerdialog.close();

    }
});