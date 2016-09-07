var idToDelete, createQuestionNode;
var child_To_Delete, createChildQuestionNode;
var questIdToDelete, editQuestionNode;
var childquestIdToDelete, editChildQuestionNode;
$(document).ready(function () {

    var answerTypesArray = [];
    var answerTypesData;
    var childNewQuest;

    var answerTypeDynamic = '';
    var quest, childQuestContent;
    childQuestContent = '<div class="childQuestBlock"><label class="alignLeft">Question Text</label><div class="input-control text width42 alignLeft">' +
             '<input type="text" class="childQuestionName questWidth inputBorder" name="childQuestionName" placeholder="Question Text"><div class="errorMargin"><label class="alignLeft errorText">Please Enter Question Title</label></div><br></div>' +
             '<label class="alignLeft erroLabel margin_2">Description</label>' +
             '<div class="input-control textarea alignLeft">' +
             '<textarea id="child_Intro" class="txtAreaWidth" name="childquestionExplanation"></textarea><div class="errorMargin"><label id="errorChildIntro" class="error_Message marginNone">Please Enter Question Description</label></div></div>' +
             '<label class="alignLeft erroLabel">Tooltip</label><div class="input-control text width42 alignLeft">' +
             '<input type="text" class="childQuestionTolltip questWidth inputBorder" name="childQuestionTolltip" value=""><div class="errorMargin"><label class="alignLeft errorText">Please Enter Question Tooltip</label></div></div>' +
             '<label class="alignLeft erroLabel">Answer Type</label>' +
             '<div class="input-control margin10 no-margin-left no-margin-right no-margin-top place-left clearLeft widthSelect2" data-role="select">' +
              '<select id="select childQuestionAnswerSelect" class="childQuestionAnswerSelect">' +
               +
              '</select></div>' +
              '<label class="alignLeft">Options</label>' +
              '<div class="lastOption"><div class="input-control text  alignLeft optionMargin">' +
             ' <input type="text" class="questionOption inputBorder" name="questionName" placeholder="Option"><div class="errorMargin"><label class="alignLeft errorText">Please Enter Option</label></div></div>' +
             '<div class="input-control text  place-left weightWidth optionMargin">' +
             ' <input type="text" class="questionWeight inputBorder" name="weight" placeholder="Weight"><div class="errorMargin"><label class="alignLeft errorText weightFont">Please Enter Appropriate Weight</label></div></div>' +
             '<div class="delete-option place-left optionMargin" id="deleteOption"><span class="ms-Icon ms-Icon--minus"></span></div>' +
                 '<div class="input-control text  alignLeft optionMargin">' +
             ' <input type="text" class="questionOption inputBorder" name="questionName" placeholder="Option"><div class="errorMargin"><label class="alignLeft errorText">Please Enter Option</label></div></div>' +
             '<div class="input-control text  place-left weightWidth optionMargin">' +
             ' <input type="text" class="questionWeight inputBorder" name="weight" placeholder="Weight"><div class="errorMargin"><label class="alignLeft errorText weightFont">Please Enter Appropriate Weight</label></div></div>' +
 '<div class="add-option place-left" id="addOption"><span class="ms-Icon ms-Icon--plus"></span></div></div>' +
 '<div class="doneChildQuest actionButtonDone alignLeft optionMargin"><img src="/images/generic-tick-small-accent@2x.png">&nbsp;Done</div>' +
             '<div class="cancelChildQuestion place-left optionMargin actionButtonCancel margin65"><img src="/images/generic-cross-12px-accent@2x.png">&nbsp;Cancel</div></div></div></form>';

    $.ajax({
        url: 'api/question/GetAnswerTypes',
        type: 'GET',
        success: function (data) {

            answerTypesData = data;
            $.each(data, function (i, val) {

                answerTypesArray.push(val.AnswerTypeLocalizedtext);
            });
            $.each(answerTypesArray, function (i, val) {
                answerTypeDynamic = answerTypeDynamic + '<option>' + val + '</option>';

            });
            quest = '<div class="createQuestions ">' +
                '<label class="input-control checkbox alignLeft">' +
                        '<input type="checkbox" class= "questCheckBox" name="questionRequired" value="0">' +
                        '<span class="check inputBorder"></span>' +
                        '<span class="caption">&nbsp;Required</span></label>' +
                        '<label class="alignLeft">Question Text</label><div class="input-control text width42 alignLeft">' +
                ' <input type="text" class="questionName inputBorder questWidth" name="questionName" placeholder="Question Text"><div class="errorMargin"><label class="alignLeft errorText">Please Enter Question Title</label></div></div>' +
                        '<label class="alignLeft erroLabel margin_2">Description</label>' +
                        '<div class="input-control textarea alignLeft">' +
                        '<textarea id="quest_Intro" class="txtAreaWidth" name="questionExplanation"></textarea><div class="errorMargin"><label id="errorParentIntro" class="error_Message marginNone">Please Enter Question Description</label></div></div>' +
                         '<label class="alignLeft erroLabel margin_2">Tooltip</label><div class="input-control text width42 alignLeft">' +
                '<input type="text" class="questionTolltip inputBorder questWidth" name="questionTolltip" value=""><div class="errorMargin"><label class="alignLeft errorText">Please Enter Question Tooltip</label></div></div>' +
                  '<label class="alignLeft erroLabel margin_2">Answer Type</label>' +
                   '<div class="input-control margin10 no-margin-left no-margin-right no-margin-top place-left clearLeft widthSelect2" data-role="select">' +
                 '<select id="select questionAnswerSelect" class="questionAnswerSelect">' +
                    answerTypeDynamic +
                 '</select></div>' +
                    '<label class="alignLeft erroLabel">Options</label>' +
                    '<div class="lastOption"><div class="input-control text  alignLeft optionMargin">' +
                ' <input type="text" class="questionOption inputBorder" name="questionName" placeholder="Option"><div class="errorMargin"><label class="alignLeft errorText">Please Enter Option</label></div></div>' +
                '<div class="input-control text  place-left weightWidth optionMargin">' +
                ' <input type="text" class="questionWeight inputBorder" name="weight" placeholder="Weight"><div class="errorMargin"><label class="alignLeft errorText weightFont">Please Enter Appropriate Weight</label></div></div>' + '<div class="delete-option place-left optionMargin" id="deleteOption"><span class="ms-Icon ms-Icon--minus"></span></div>' +
                    '<div class="input-control text  alignLeft optionMargin">' +
                ' <input type="text" class="questionOption inputBorder" name="questionName" placeholder="Option"><div class="errorMargin"><label class="alignLeft errorText">Please Enter  Option</label></div></div>' +
                '<div class="input-control text  place-left weightWidth optionMargin">' +
                ' <input type="text" class="questionWeight inputBorder" name="weight" placeholder="Weight"><div class="errorMargin"><label class="alignLeft errorText weightFont">Please Enter Appropriate Weight</label></div></div>' + '<div class="add-option place-left optionMargin" id="addOption"><span class="ms-Icon ms-Icon--plus"></span></div></div>' +
                '<div class="hasChild alignLeft actionButtonDone optionMargin"><img src="/images/generic-tick-small-accent@2x.png"> &nbsp;Done</div>' +
                '<div class="cancelMainQuestion place-left optionMargin actionButtonCancel margin65"><img src="/images/generic-cross-12px-accent@2x.png">&nbsp;Cancel</div>' +
            '</div>';
            childQuestContent = '<div class="childQuestBlock"><label class="alignLeft">Question Text</label><div class="input-control text width42 alignLeft">' +
            '<input type="text" class="childQuestionName questWidth inputBorder" name="childQuestionName" placeholder="Question Text"><div class="errorMargin"><label class="alignLeft errorText">Please Enter Question Title</label></div><br></div>' +
            '<label class="alignLeft erroLabel margin_2">Description</label>' +
            '<div class="input-control textarea alignLeft">' +
            '<textarea id="child_Intro" class="txtAreaWidth" name="childquestionExplanation"></textarea><div class="errorMargin"><label id="errorChildIntro" class="error_Message marginNone">Please Enter Question Description</label></div></div>' +
            '<label class="alignLeft erroLabel margin_2">Tooltip</label><div class="input-control text width42 alignLeft">' +
            '<input type="text" class="childQuestionTolltip questWidth inputBorder" name="childQuestionTolltip" value=""><div class="errorMargin"><label class="alignLeft errorText">Please Enter Question Tooltip</label></div></div>' +
            '<label class="alignLeft erroLabel margin_2">Answer Type</label>' +
            '<div class="input-control margin10 no-margin-left no-margin-right no-margin-top place-left clearLeft widthSelect2" data-role="select">' +
             '<select id="select childQuestionAnswerSelect" class="childQuestionAnswerSelect">' +
             answerTypeDynamic +
             '</select></div>' +
             '<label class="alignLeft">Options</label>' +
             '<div class="lastOption"><div class="input-control text  alignLeft optionMargin">' +
            ' <input type="text" class="questionOption inputBorder" name="questionName" placeholder="Option"><div class="errorMargin"><label class="alignLeft errorText">Please Enter Option</label></div></div>' +
            '<div class="input-control text  place-left weightWidth optionMargin">' +
            ' <input type="text" class="questionWeight inputBorder" name="weight" placeholder="Weight"><div class="errorMargin"><label class="alignLeft errorText weightFont">Please Enter Appropriate Weight</label></div></div>' +
            '<div class="delete-option place-left optionMargin" id="deleteOption"><span class="ms-Icon ms-Icon--minus"></span></div>' +
                '<div class="input-control text  alignLeft optionMargin">' +
            ' <input type="text" class="questionOption inputBorder" name="questionName" placeholder="Option"><div class="errorMargin"><label class="alignLeft errorText">Please Enter Option</label></div></div>' +
            '<div class="input-control text  place-left weightWidth optionMargin">' +
            ' <input type="text" class="questionWeight inputBorder" name="weight" placeholder="Weight"><div class="errorMargin"><label class="alignLeft errorText weightFont">Please Enter Appropriate Weight</label></div></div>' +
'<div class="add-option place-left" id="addOption"><span class="ms-Icon ms-Icon--plus"></span></div></div>' +
'<div class="doneChildQuest actionButtonDone alignLeft optionMargin"><img src="/images/generic-tick-small-accent@2x.png">&nbsp;Done</div>' +
            '<div class="cancelChildQuestion place-left optionMargin actionButtonCancel margin65"><img src="/images/generic-cross-12px-accent@2x.png">&nbsp;Cancel</div></div></div></form>';



        }
    });














    var availableTags = [];
    var questionsData;
    var idToGetQuestionDetails;


    $.ajax({
        url: 'api/question/SearchQuestions',
        type: 'GET',
        success: function (data) {
            questionsData = data;
            var sameUser = [], oterUser = [], allUsers = [];
            $(questionsData).each(function (i, val) {
                if (val.TenantId == 'FB030F50-4204-4883-849F-1C0022EF6925') {
                    sameUser.push(val);
                } else {
                    oterUser.push(val);
                }
            });
            allUsers = sameUser.concat(oterUser);
            $(allUsers).each(function () {
                if ($(this)[0].QuestionText != null && $(this)[0].QuestionText != "Blank Question Text") {
                    availableTags.push($(this)[0].QuestionText);

                }
            });

            availableTags = availableTags.slice(0, 10);

            $(document).on("focus.autocomplete", ".inputSearchQuestion", function () {
                $(this).autocomplete({
                    source: availableTags,
                    minLength: 3,
                    delay: 0
                });

                $(this).autocomplete("search");
            });





            $(document).on("click", ".childQuestionSearchButton", function (e) {
                e.preventDefault();
                e.stopImmediatePropagation();

                var selectedQuestion = $(this).parent().find('.inputSearchQuestion').val();
                var questData;

                $(questionsData).each(function () {
                    if (selectedQuestion == $(this)[0].QuestionText) {
                        questData = $(this)[0];

                    }
                });
                if (questData == undefined) {
                    if ($(this).closest('.tab-group-content').find('.errMsg').length == 0) {
                        $(this).closest('.tab-group-content').append('<p class="errMsg alignLeft">No Matches Found</p>');
                    } else {
                        $(this).closest('.tab-group-content').find('.errMsg').show();
                    }
                } else {
                    if ($(this).closest('.tab-group-content').find('.errMsg').length > 0) {
                        $(this).closest('.tab-group-content').find('.errMsg').hide();
                    }
                    var questSpinnerdialog = $('#spinnerDialog').data('dialog');
                    questSpinnerdialog.open();

                    $('.saveQuestions').attr('disabled', true);
                    $(this).closest('.tab-group-content').siblings().addClass('disablePage');
                    $(this).parent().addClass('disablePage');
                    var arrayOfOptions = [];
                    var child_question_data;
                    var questOptionsFromApi;
                    var questOpts = '';
                    var ansType = '';
                    var optionsHtml = '';
                    var self = this;
                    var childQuest_Text = questData.QuestionText;
                    $.ajax({
                        url: 'api/question/GetQuestionByQuestionText?questionText=' + childQuest_Text + '&languageId=192C79DD-B246-4BF2-B297-A36338981F99',
                        type: 'GET',
                        success: function (data) {
                            $('a.toggle').prop('disabled', true);
                            $('a.toggle').addClass('disableHeader');
                            $(self).parent().parent().parent().parent().parent().parent().children().removeClass('disableHeader');
                            questSpinnerdialog.close();
                            child_question_data = data;
                            $('.previewQuestions').attr('disabled', true);
                            $('.submitQuestions').attr('disabled', true);
                            questOptionsFromApi = child_question_data.QuestionOptions;
                            $(questOptionsFromApi).each(function (i, val) {

                                arrayOfOptions.push(val.OptionText);

                            });
                            var questionval = child_question_data.AnswerType;
                            if (questionval == 'Attachment' || questionval == 'Free Text') {
                                questOpts = '';
                            } else if (questionval == 'Single Choice' || questionval == 'Multiple Choice') {


                                $(questOptionsFromApi).each(function (key, value) {

                                    if ((arrayOfOptions.length - 1) == key) {
                                        questOpts = questOpts + '<div class="input-control text  alignLeft optionMargin">' +
                            ' <input type="text" class="questionOption inputBorder" name="questionName" value="' + value.OptionText + '" disabled><div calss="errorMargin"><label class="alignLeft errorText">Please Enter Option</label></div></div>' +
                            '<div class="input-control text  place-left weightWidth optionMargin">' +
                            ' <input type="text" class="questionWeight inputBorder" name="weight" value="' + value.QuestionOptionWeight + '" disabled><div class="errorMargin"><label class="alignLeft errorText weightFont">Please Enter Appropriate Weight</label></div></div><div class="add-option place-left optionMargin" id="addOption"><span class="ms-Icon ms-Icon--plus"></span></div>';
                                    } else {
                                        questOpts = questOpts + '<div class="input-control text  alignLeft optionMargin">' +
                                  ' <input type="text" class="questionOption inputBorder" name="questionName" value="' + value.OptionText + '" disabled><div class="errorMargin"><label class="alignLeft errorText">Please Enter Option</label></div></div>' +
                                  '<div class="input-control text  place-left weightWidth optionMargin">' +
                                  ' <input type="text" class="questionWeight inputBorder" name="weight" value="' + value.QuestionOptionWeight + '" disabled><div class="errorMargin"><label class="alignLeft errorText weightFont">Please Enter Appropriate Weight</label></div></div>'
                                    }
                                });



                            } else if (questionval == 'Data List') {
                                $(arrayOfOptions).each(function (key, value) {
                                    if ((arrayOfOptions.length - 1) == key) {
                                        questOpts = questOpts + '<div class="input-control text  alignLeft">' +
                            ' <input type="text" placeholder="Field title" class="questionOption inputBorder" name="questionName" value="' + value.OptionText + '" disabled><label class="alignLeft errorText">Please Enter Option</label></div>' +

                            '<div class="add-option place-left" id="addDataListOption"><span class="ms-Icon ms-Icon--plus"></span></div>';
                                    } else {
                                        questOpts = questOpts + '<div class="input-control text  alignLeft">' +
                                  ' <input type="text" placeholder="Field title" class="questionOption inputBorder" name="questionName" value="' + value.OptionText + '" disabled><label class="alignLeft errorText">Please Enter Option</label></div>';


                                    }

                                });

                            }


                            ansType = '';

                            $(answerTypesArray).each(function (key, value) {


                                if (value == child_question_data.AnswerType) {
                                    ansType = ansType + '<option selected>' + value + '</option>';
                                }
                                else {
                                    ansType = ansType + '<option>' + value + '</option>';
                                }
                            });

                            var childQuestAuto = '<div class="childQuestBlock"><div class="place-right"><button class="button bt-edit" id="editChildQuest"><span class="ms-Icon ms-Icon--pencil"></span>&nbsp;Edit Question</button></div>' +
                         '<label class="alignLeft margin35">Question Text</label><div class="input-control text width42 alignLeft">' +
                         '<input type="text" class="childQuestionName editQuestWidth inputBorder" name="childQuestionName" disabled value="' + child_question_data.QuestionText + '"><div class="errorMargin"><label class="alignLeft errorText">Please Enter Question Title</label></div><br></div>' +
                         '<label class="alignLeft erroLabel margin_2">Description</label>' +
                         '<div class="input-control textarea alignLeft" style="width: 487px!important">' +
                          '<textarea id="child_Intro" class="txtAreaWidth" name="childquestionExplanation"disabled>' + child_question_data.QuestionContent + '</textarea><div class="errorMargin"><label id="errorChildIntro" class="error_Message marginNone">Please Enter Question Description</label></div></div>' +
                        '<label class="alignLeft erroLabel margin_2">Tooltip</label><div class="input-control text width42 alignLeft">' +
                        '<input type="text" class="childQuestionTolltip editQuestWidth inputBorder" name="childQuestionTolltip" value="' + child_question_data.QuestionHelpText + '" disabled><div class="errorMargin"><label class="alignLeft errorText">Please Enter Question Tooltip</label></div></div>' +

                        '<label class="alignLeft erroLabel margin_2">Answer Type</label>' +
                        '<div class="input-control margin10 no-margin-left no-margin-right no-margin-top place-left clearLeft widthSelect2" data-role="select">' +
                         '<select id="select" id="select childQuestionAnswerSelect" class="childQuestionAnswerSelect" disabled>' + ansType + '</select></div>' +
                         '<label class="alignLeft">Options</label><div class="lastOption">' + questOpts +

                               '</div><div class="doneChildQuest actionButtonDone alignLeft optionMargin"><img src="/images/generic-tick-small-accent@2x.png">&nbsp;Done</div><div class="cancelChildQuestion place-left optionMargin actionButtonCancel margin65"><img src="/images/generic-cross-12px-accent@2x.png">&nbsp;Cancel</div></div>';





                            var check = $(self).parent().parent().find('.childQuestBlock').html();
                            if (check == undefined) {
                                $(self).parent().parent().append(childQuestAuto);

                            } else {

                                $(self).parent().parent().find('.childQuestBlock').after(childQuestAuto);
                            }
                            $(this).closest('div.inner').find('.childQuestionAnswerSelect').val(questionval);
                            if (!$(self).closest('ul.inner').find('.addNewQuest').hasClass('disablePage')) {
                                $(self).closest('ul.inner').find('.addNewQuest').addClass('disablePage')
                            }
                            if (!$('.newPageCreate').hasClass('disablePage')) {

                                $('.newPageCreate').addClass('disablePage')
                            }
                            $(self).parent().parent().parent().find('.tab-group-content').find('.textarea').css({ 'opacity': 0.5, 'pointer-events': 'none' });
                            $(self).parent().parent().parent().find('.tab-group-content').find('.childQuestionName').css({ 'opacity': 0.5, 'pointer-events': 'none' });
                            $(self).parent().parent().parent().find('.tab-group-content').find('.childQuestionTolltip').css({ 'opacity': 0.5, 'pointer-events': 'none' });
                            $(self).parent().parent().parent().find('.tab-group-content').find('.questionOption').css({ 'opacity': 0.5, 'pointer-events': 'none' });
                            $(self).parent().parent().parent().find('.tab-group-content').find('.questionWeight').css({ 'opacity': 0.5, 'pointer-events': 'none' });



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



                        },
                            error: function (data) {
                                var questSpinnerdialog = $('#spinnerDialog').data('dialog');
                                questSpinnerdialog.close();
                                window.alert("Error occured while retrieving question details from server. Please try again.");
                            }

                    });
                }

            });



            $(document).on("click", '.questionSearchButton', function (e) {


                e.preventDefault();
                e.stopImmediatePropagation();
                var questData;
                var selectedQuestion = $(this).parent().find('.inputSearchQuestion').val();
                $(questionsData).each(function () {
                    if (selectedQuestion == $(this)[0].QuestionText) {
                        questData = $(this)[0];

                    }



                });
                if (questData == undefined) {
                    if ($(this).closest('.tab-group-content').find('.errMsg').length == 0) {
                        $(this).closest('.tab-group-content').append('<p class="errMsg alignLeft">No Matches Found</p>');
                    } else {
                        $(this).closest('.tab-group-content').find('.errMsg').show();
                    }
                } else {
                    if ($(this).closest('.tab-group-content').find('.errMsg').length > 0) {
                        $(this).closest('.tab-group-content').find('.errMsg').hide();
                    }
                    var questSpinnerdialog = $('#spinnerDialog').data('dialog');
                    questSpinnerdialog.open();

                    $('.saveQuestions').attr('disabled', true);



                    $(this).closest('.tab-group-content').siblings().addClass('disablePage');
                    $(this).parent().addClass('disablePage');

                    var arrayOfOptions = [];

                    var questOptionsFromApi;
                    var questOpts = '';
                    var ansType = '';
                    var optionsHtml = '';
                    var questauto;
                    var question_data;
                    var _that = this;
                    var quest_Text = questData.QuestionText;

                    $.ajax({
                        url: 'api/question/GetQuestionByQuestionText?questionText=' + quest_Text + '&languageId=192C79DD-B246-4BF2-B297-A36338981F99',
                        type: 'GET',
                        success: function (data) {
                            $('a.toggle').prop('disabled', true);
                            $('a.toggle').addClass('disableHeader');
                            $(_that).parent().parent().parent().parent().parent().parent().parent().parent().children().removeClass('disableHeader');
                            questSpinnerdialog.close();
                            question_data = data;
                            $('.previewQuestions').attr('disabled', true);
                            $('.submitQuestions').attr('disabled', true);


                            questOptionsFromApi = question_data.QuestionOptions;



                            $(questOptionsFromApi).each(function (i, val) {
                                arrayOfOptions.push(val.OptionText);
                            });


                            var questionval = question_data.AnswerType;
                            if (questionval == 'Attachment' || questionval == 'Free Text') {
                                questOpts = '';
                            } else if (questionval == 'Single Choice' || questionval == 'Multiple Choice') {



                                $(questOptionsFromApi).each(function (key, value) {
                                    if ((questOptionsFromApi.length - 1) == key) {
                                        questOpts = questOpts + '<div class="input-control text  alignLeft optionMargin">' +
                            ' <input type="text" class="questionOption inputBorder" name="questionName" value="' + value.OptionText + '" disabled><div class="errorMargin"><label class="alignLeft errorText">Please Enter Option</label></div></div>' +
                            '<div class="input-control text  place-left weightWidth optionMargin">' +
                            ' <input type="text" class="questionWeight inputBorder" name="weight" value="' + value.QuestionOptionWeight + '" disabled><div class="errorMargin"><label class="alignLeft errorText weightFont">Please Enter Appropriate Weight</label></div></div><div class="add-option place-left optionMargin" id="addOption"><span class="ms-Icon ms-Icon--plus"></span></div>';
                                    } else {
                                        questOpts = questOpts + '<div class="input-control text  alignLeft optionMargin">' +
                                  ' <input type="text" class="questionOption inputBorder" name="questionName" value="' + value.OptionText + '" disabled><div class="errorMargin"><label class="alignLeft errorText">Please Enter Option</label></div></div>' +
                                  '<div class="input-control text  place-left weightWidth optionMargin">' +
                                  ' <input type="text" class="questionWeight inputBorder" name="weight" value="' +value.QuestionOptionWeight + '" disabled><div class="errorMargin"><label class="alignLeft errorText weightFont">Please Enter Appropriate Weight</label></div></div>'
                                    }
                                });

                            } else if (questionval == 'Data List') {
                                $(questOptionsFromApi).each(function (key, value) {
                                    if ((questOptionsFromApi.length - 1) == key) {
                                        questOpts = questOpts + '<div class="input-control text  alignLeft">' +
                            ' <input type="text" class="questionOption inputBorder" placeholder="Field title" name="questionName" value="' + value.OptionText + '" disabled><label class="alignLeft errorText">Please Enter Option</label></div>' +

                            '<div class="add-option place-left" id="addDataListOption"><span class="ms-Icon ms-Icon--plus"></span></div>';
                                    } else {
                                        questOpts = questOpts + '<div class="input-control text  alignLeft">' +
                                  ' <input type="text" placeholder="Field title" class="questionOption inputBorder" name="questionName" value="' + value.OptionText + '" disabled><label class="alignLeft errorText">Please Enter Option</label></div>';


                                    }

                                });

                            }
                            ansType = '';

                            $(answerTypesArray).each(function (key, value) {
                                if (value == question_data.AnswerType) {
                                    ansType = ansType + '<option selected>' + value + '</option>';
                                }
                                else {
                                    ansType = ansType + '<option>' + value + '</option>';
                                }
                            });

                            var mandatoryField = (question_data.IsMandatory == true) ? '<input type="checkbox" name="questionRequired" value="0" checked>' : '<input type="checkbox" name="questionRequired" value="0">';


                            questauto = '<div class="createQuestions" style="margin-top:20px">' +
                               '<div class="place-right"><button class="button bt-edit" id="editQuest"><span class="ms-Icon ms-Icon--pencil"></span>&nbsp;Edit Question</button></div>'
                               + '<label class="input-control checkbox alignLeft">' + mandatoryField + '<span class="check inputBorder"></span><span class="caption">&nbsp;Required</span></label>' + '<label class="alignLeft">Question Text</label><div class="input-control text width42 alignLeft">' +
                       ' <input type="text" class="questionName inputBorder editQuestWidth" name="questionName" value="' + question_data.QuestionText + '" disabled><div class="errorMargin"><label class="alignLeft errorText">Please Enter Question Title</label></div></div>' +
                               '<label class="alignLeft erroLabel margin_2">Description</label>' +
                               '<div class="input-control textarea alignLeft" style="width: 487px!important">' +
                               '<textarea id="quest_Intro" class="txtAreaWidth" name="questionExplanation" disabled>' + question_data.QuestionContent + '</textarea><div class="errorMargin"><label id="errorParentIntro" class="error_Message marginNone">Please Enter Question Description</label></div></div>' +
                                '<label class="alignLeft margin_2">Tooltip</label><div class="input-control text width42 alignLeft">' +
                       '<input type="text" class="questionTolltip inputBorder editQuestWidth" name="questionTolltip" value="' + question_data.QuestionHelpText + '" disabled><div class="errorMargin"><label class="alignLeft errorText">Please Enter Question Tooltip</label></div></div>' +
                         '<label class="alignLeft erroLabel margin_2">Answer Type</label>' +
                          '<div class="input-control margin10 no-margin-left no-margin-right no-margin-top place-left clearLeft widthSelect2" data-role="select">' +
                        '<select id="select questionAnswerSelect" class="questionAnswerSelect"  disabled>' + ansType + '</select></div>' +
                           '<label class="alignLeft">Options</label><div class="lastOption">' + questOpts + '</div><div class="hasChild actionButtonDone alignLeft optionMargin"><img src="/images/generic-tick-small-accent@2x.png">&nbsp;Done</div><div class="cancelMainQuestion place-left optionMargin actionButtonCancel margin65"><img src="/images/generic-cross-12px-accent@2x.png">&nbsp;Cancel</div>' +
                       '</div>';




                            var check = $(_that).parent().parent().find('.createQuestions').html();
                            if (check == undefined) {
                                $(_that).parent().parent().append(questauto);
                            } else {
                                $(_that).parent().parent().find('.createQuestions').after(questauto);
                            }
                            $(this).closest('div.inner').find('.questionAnswerSelect').val(questionval);
                            if (!$(_that).closest('ul.inner').find('.addNewQuest').hasClass('disablePage')) {
                                $(_that).closest('ul.inner').find('.addNewQuest').addClass('disablePage')
                            }
                            if (!$('.newPageCreate').hasClass('disablePage')) {

                                $('.newPageCreate').addClass('disablePage')
                            }
                            $(_that).closest('ul.inner').append('<div href="javascript:void(0);" class="addNewQuest disablePage border_tp">New Question</div>');
                            $(_that).parent().parent().parent().find('.tab-group-content').find('.textarea').css({ 'opacity': 0.5, 'pointer-events': 'none' });
                            $(_that).parent().parent().parent().find('.tab-group-content').find('.questionName').css({ 'opacity': 0.5, 'pointer-events': 'none' });
                            $(_that).parent().parent().parent().find('.tab-group-content').find('.questionTolltip').css({ 'opacity': 0.5, 'pointer-events': 'none' });
                            $(_that).parent().parent().parent().find('.tab-group-content').find('.questionOption').css({ 'opacity': 0.5, 'pointer-events': 'none' });
                            $(_that).parent().parent().parent().find('.tab-group-content').find('.questionWeight').css({ 'opacity': 0.5, 'pointer-events': 'none' });

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


                        },
                        error: function (data) {
                            var questSpinnerdialog = $('#spinnerDialog').data('dialog');
                            questSpinnerdialog.close();
                            window.alert("Error occured while retrieving question details from server. Please try again.");
                        }
                    });
                }


            });

            $(document).on('click', '#editChildQuest', function (e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                $(this).parent().parent().find('.childQuestionName').attr('disabled', false);
                $(this).parent().parent().find('.childQuestionName').css({ 'opacity': 1, 'pointer-events': 'auto' });
                $(this).parent().parent().find('.txtAreaWidth').attr('disabled', false);

                $(this).parent().parent().find('.childQuestionTolltip').attr('disabled', false);
                $(this).parent().parent().find('.childQuestionTolltip').css({ 'opacity': 1, 'pointer-events': 'auto' });
                $(this).parent().parent().find('.questionOption').attr('disabled', false);
                $(this).parent().parent().find('.questionOption').css({ 'opacity': 1, 'pointer-events': 'auto' });
                $(this).parent().parent().find('.questionWeight').attr('disabled', false);
                $(this).parent().parent().find('.questionWeight').css({ 'opacity': 1, 'pointer-events': 'auto' });
                $(this).parent().parent().find('.textarea').css({ 'opacity': 1, 'pointer-events': 'auto' })


            });




            $(document).on('click', '#editQuest', function (e) {
                e.preventDefault();
                e.stopImmediatePropagation();


                $(this).parent().parent().find('.questionName').attr('disabled', false);
                $(this).parent().parent().find('.questionName').css({ 'opacity': 1, 'pointer-events': 'auto' });
                $(this).parent().parent().find('.txtAreaWidth').attr('disabled', false);
                $(this).parent().parent().find('.questionTolltip').attr('disabled', false);
                $(this).parent().parent().find('.questionTolltip').css({ 'opacity': 1, 'pointer-events': 'auto' });
                $(this).parent().parent().find('.questionOption').attr('disabled', false);
                $(this).parent().parent().find('.questionOption').css({ 'opacity': 1, 'pointer-events': 'auto' });
                $(this).parent().parent().find('.questionWeight').attr('disabled', false);
                $(this).parent().parent().find('.questionWeight').css({ 'opacity': 1, 'pointer-events': 'auto' });
                $(this).parent().parent().find('.textarea').css({ 'opacity': 1, 'pointer-events': 'auto' })

            });



        }


    });

    var childQustObj = {
        "1": "a", "2": "b", "3": "c", "4": "d", "5": "e", "6": "f", "7": "g", "8": "h", "9": "i", "10": "j"
    }

    var newQuest = '<li><a class="toggle downArrowPng" href="javascript:void(0);">New Question</a>' +
    '<ul class="inner"><li><form><div class="inner">' +
          '<div><span class="place-left">Search questions or&nbsp</span>' +
          '<span class="addQuest1 place-left">add a new one</span>' +
            '<div class="tab-group-content alignLeft search_input margin10 no-margin-left">' +
        '<div class="input-control text no-margin">' +
           '<input type="text" class="textInput inputSearchQuestion" name="inputSearchQuestion">' +
           '<button class="button search_btn questionSearchButton"><span class="mif-search"></span>' +

       '</button> </div> </div> </div> </div>' +
       '</form></li></ul></li>';

    var page =
'<li class="createPageCtnt ">' +
   '<a class="toggle downArrowPng pageTxt editPageTxt" href="javascript:void(0);">New Page</a>' +
    '<ul class="inner"><input type="hidden" class="pageHidden" value=""><li><div class="inner"><form><label class="alignLeft">Title</label>' +
          '<div class="input-control text alignLeft">' +
           '<input type="text" class="pageTitle inputBorder fieldWidth" name="pageTitle">' +
           '<div class="errorMargin"><label class="alignLeft errorText">Please Enter Page Title</label></div>' +
          '</div><label class="alignLeft erroLabel">Introduction</label>' +
        '<div class="input-control textarea alignLeft"><textarea id="page_Intro" class="txtAreaWidth" name="pageIntroduction"></textarea><span id="errorPageIntro" class="error_Message marginNone">Please Enter Page Introduction</span>' +

'</div><div class="buttonDoneCancel alignLeft"><div class="createPageDone actionButtonDone">' +
                                    '<img src="/images/generic-tick-small-accent@2x.png">&nbsp;Done</div>' +
                            '<div class="createPageCancel actionButtonCancel margin80">' +
                                   ' <img src="/images/generic-cross-12px-accent@2x.png">&nbsp;Cancel</div>' +
                            '</div></form></div></li></ul>' +
        '<div class="editNewQuestion">New Question</div>' +
        '</li>';



    var childQuest;
    var childQuest1;






    $(document).on('click', '.accordion>li>.toggle', function (e) {


        e.stopPropagation()
        if ($(this).hasClass('editingPage')) {
            toggleArrow($(this));

            var editpageId = $(this).next().find('.pageHidden').val();
            var pageInfo;
            var that = this;
            var selecorPage = $(that).parent().children('ul.inner').children('li:eq(0)').find('div.inner');
            var questSpinnerdialog = $('#spinnerDialog').data('dialog');
            questSpinnerdialog.open();
            $.ajax({
                url: 'api/question/GetPageInfo?pageId=' + editpageId + '&languageId=192C79DD-B246-4BF2-B297-A36338981F99',
                type: 'GET',
                success: function (data) {


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


                    questSpinnerdialog.close();
                    pageInfo = data;
                    selecorPage.find('.editPageTitle').val(pageInfo.PageTitle);


                    setTimeout(function () {
                        selecorPage.find('#page_Intro').htmlarea('html', pageInfo.PageIntro);
                    }, 1000);


                    $(that).parent().children('ul.inner').children('li:eq(0)').toggle();
                    if ($(that).parent().children('ul.inner').children('li:eq(0)').css('display') !== 'none') {
                        $('a.toggle').prop('disabled', true);
                        $('a.toggle').addClass('disableHeader');
                        $(that).removeClass('disableHeader');

                        $('.newChildQustLink').addClass('disablePage');
                        $('.previewQuestions').attr('disabled', true);
                        $('.submitQuestions').attr('disabled', true);
                        $('.saveQuestions').attr('disabled', true);

                        $('.addNewQuest').addClass('disablePage');
                        $('.editNewChildQuestion').addClass('disablePage');
                        $('.newPageCreate').addClass('disablePage');
                        $('.editNewQuestion').addClass('disablePage');


                    }
                },
                error: function (data) {
                    var questSpinnerdialog = $('#spinnerDialog').data('dialog');
                    questSpinnerdialog.close();
                    window.alert("Error occured while retrieving page details from server. Please try again.");
                }
            });

        }
        else {

            var pageId = $(this).next().find('.pageHidden').val();
            if (pageId == "") {
                toggleArrow($(this));
                $(this).next().find('li:eq(0)').toggle();
                if ($(this).next().find('li:eq(0)').css('display') !== 'none') {
                    $('a.toggle').prop('disabled', true);
                    $('a.toggle').addClass('disableHeader');
                    $(this).removeClass('disableHeader');
                }
            }
            else {
                var questSpinnerdialog = $('#spinnerDialog').data('dialog');
                questSpinnerdialog.open();
                var that = this;
                var pageInfo;
                var selecorPage = $(that).parent().children('ul.inner').children('li:eq(0)').find('div.inner');
                $.ajax({
                    url: 'api/question/GetPageInfo?pageId=' + pageId + '&languageId=192C79DD-B246-4BF2-B297-A36338981F99',
                    type: 'GET',
                    success: function (data) {
                        questSpinnerdialog.close();
                        $('.editNewQuestion').addClass('disablePage');
                        $('.previewQuestions').attr('disabled', true);
                        $('.submitQuestions').attr('disabled', true);
                        $('.saveQuestions').attr('disabled', true);


                        $('.editNewChildQuestion').addClass('disablePage');
                        $('.addNewQuest').addClass('disablePage');
                        $('.newPageCreate').addClass('disablePage');

                        $('.newChildQustLink').addClass('disablePage');

                        toggleArrow($(that));
                        $(that).next().find('li:eq(0)').toggle();
                        pageInfo = data;
                        selecorPage.find('.pageTitle ').val(pageInfo.PageTitle);
                        selecorPage.find('#page_Intro').htmlarea('html', pageInfo.PageIntro);

                        if ($(that).next().find('li:eq(0)').css('display') !== 'none') {
                            $('a.toggle').prop('disabled', true);
                            $('a.toggle').addClass('disableHeader');
                            $(that).removeClass('disableHeader');
                        }
                    },
                    error: function (data) {
                        var questSpinnerdialog = $('#spinnerDialog').data('dialog');
                        questSpinnerdialog.close();
                        window.alert("Error occured while retrieving page details from server. Please try again.");
                    }
                })
            }
        }
    });
    var questAnswerTypeId;
    var questOptionIdArray = [];
    $(document).on('click', '.accordion>li>ul.inner>li>.toggle', function (e) {

        e.stopPropagation();
        toggleArrow($(this));

        if ($(this).hasClass('editQuestionTxt')) {
            questAnswerTypeId = '';
            var editQuestionId = $(this).next().find('.questionHidden').val();
            var that = this;
            var questionInfo;
            var optionWeightArr = [];
            var optionObj = {};
            var questSpinnerdialog = $('#spinnerDialog').data('dialog');
            questSpinnerdialog.open();
            var ischildQuestionExisist = ($(this).next('ul.inner').html().indexOf("editChildQuestTxt") > 0) ? true : false;
            if (ischildQuestionExisist) {
                answerTypeDynamic = '';
                $.each(answerTypesArray, function (i, val) {
                    answerTypeDynamic = answerTypeDynamic + '<option>' + val + '</option>';
                });
            }
            $.ajax({
                url: 'api/question/GetQuestionByQuestionVersionId?questionVersionId=' + editQuestionId + '&languageId=192C79DD-B246-4BF2-B297-A36338981F99',
                type: 'GET',
                success: function (data) {

                    questSpinnerdialog.close();
                    questionInfo = data;
                    questDisplayOrder = data.DisplayOrder;
                    _sectionOrder = data.SectionOrder;
                    questAnswerTypeId = data.QuestionOptions[0].AnswerTypeId;
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

                    var options = "";
                    if (!ischildQuestionExisist) {
                        answerTypeDynamic = '';
                        $.each(answerTypesArray, function (i, val) {
                            if (val == questionInfo.AnswerType)
                                answerTypeDynamic = answerTypeDynamic + '<option selected>' + val + '</option>';
                            else
                                answerTypeDynamic = answerTypeDynamic + '<option>' + val + '</option>';
                        });
                        options = '<select id="select questionAnswerSelect" class="questionAnswerSelect">' + answerTypeDynamic + '</select></div>';
                    } else {
                        options = '<input type="text" class="editQuestionAnswerType" value="' + questionInfo.AnswerType + '" disabled></div>';
                    }


                    $.each(questionInfo.QuestionOptions, function (i, val) {

                        optionObj = {};
                        optionObj['option'] = val.OptionText;
                        optionObj['weight'] = val.QuestionOptionWeight;
                        optionObj['optionid'] = val.OptionId;
                        optionWeightArr.push(optionObj);
                    });

                    var optionsEle = '';
                    var len = optionWeightArr.length;
                    $.each(optionWeightArr, function (i, val) {
                        if (questionInfo.AnswerType == "Single Choice" || questionInfo.AnswerType == "Multiple Choice") {
                            if (!ischildQuestionExisist) {
                                if (i == len - 1) {
                                    optionsEle = optionsEle +
                                    '<div class="input-control text  alignLeft top_Margin">' +
                                                ' <input type="text" class="editQuestionOption questionOption inputBorder" name="editQuestionName" data-optionid="' + val.optionid + '" value="' + val.option + '"><div class="errorMargin"><label class="alignLeft errorText">Please Enter Option</label></div></div>' +
                              '<div class="input-control text  place-left weightWidth top_Margin">' +
                                                ' <input type="text" class="editQuestionWeight questionWeight inputBorder" name="weight" value="' + val.weight + '"><div class="errorMargin"><label class="alignLeft errorText weightFont">Please Enter Appropriate Weight</label></div></div>' +
                                                '<div class="add-option place-left" id="addOption"><span class="ms-Icon ms-Icon--plus"></span></div>';
                                } else {
                                    optionsEle = optionsEle +
                                       '<div class="input-control text  alignLeft top_Margin">' +
                                       ' <input type="text" class="editQuestionOption questionOption inputBorder" name="editQuestionName" data-optionid="' + val.optionid + '" value="' + val.option + '"><div class="errorMargin"><label class="alignLeft errorText">Please Enter Option</label></div></div>' +
                                       '<div class="input-control text  place-left weightWidth top_Margin">' +
                                       ' <input type="text" class="editQuestionWeight questionWeight inputBorder" name="weight" value="' + val.weight + '"><div class="errorMargin"><label class="alignLeft errorText weightFont">Please Enter Appropriate Weight</label></div></div>' +
                                       '<div class="delete-option place-left" id="deleteOption"><span class="ms-Icon ms-Icon--minus"></span></div>';
                                }
                            } else {
                                optionsEle = optionsEle +
                                    '<div class="input-control text  alignLeft top_Margin">' +
                                    ' <input type="text" class="editQuestionOption questionOption inputBorder" name="editQuestionName" data-optionid="' + val.optionid + '" value="' + val.option + '"><div class="errorMargin"><label class="alignLeft errorText">Please Enter Option</label></div></div>' +
                                    '<div class="input-control text  place-left weightWidth top_Margin">' +
                                    ' <input type="text" class="editQuestionWeight questionWeight inputBorder" name="weight" value="' + val.weight + '"><div class="errorMargin"><label class="alignLeft errorText weightFont">Please Enter Appropriate Weight</label></div></div>';
                            }


                        } else if (questionInfo.AnswerType == "Attachment" || questionInfo.AnswerType == "Free Text") {
                            optionsEle = '';
                        } else if (questionInfo.AnswerType == "Data List") {
                            if (!ischildQuestionExisist) {
                                if (i == len - 1) {
                                    optionsEle += '<div class="input-control text  alignLeft top_Margin">' +
                                        '<input type="text" placeholder="Field title" class="questionOption inputBorder" name="questionName" data-optionid="' + val.optionid + '" value =" ' + val.option + '"><label class="alignLeft errorText">Please Enter Option</label></div>' +
                                        '<div class="delete-option place-left" id="deleteOption"><span class="ms-Icon ms-Icon--minus"></span></div>';
                                }
                                else {
                                    optionsEle += '<div class="input-control text  alignLeft top_Margin">' +
                                        '<input type="text" placeholder="Field title" class="questionOption inputBorder" name="questionName" data-optionid="' + val.optionid + '" value =" ' + val.option + '"><label class="alignLeft errorText">Please Enter Option</label></div>' +
                                        '<div class="add-option place-left" id="addDataListOption"><span class="ms-Icon ms-Icon--minus"></span></div>';
                                }
                            } else {
                                optionsEle = optionsEle +
                                   '<div class="input-control text  alignLeft top_Margin">' +
                                        ' <input type="text" placeholder="Field title" class="editQuestionOption questionOption inputBorder" name="editQuestionName" data-optionid="' + val.optionid + '" value="' + val.option + '"><div class="errorMargin"><label class="alignLeft errorText">Please Enter Option</label></div></div>';
                            }
                        }

                    });

                    var mandatoryField = (questionInfo.IsMandatory == true) ? '<input type="checkbox" name="questionRequired" value="0" checked>' : '<input type="checkbox" name="questionRequired" value="0">';

                    var questCnt = '<div class="editCreateQuestion">' +
          '<label class="input-control checkbox alignLeft">' + mandatoryField + '<span class="check inputBorder"></span><span class="caption">&nbsp;Required</span></label>' +
          '<label class="alignLeft">Question Text</label><div class="input-control text width42 alignLeft">' +
                ' <input type="text" class="editQuestionName inputBorder questWidth" name="editQuestionName" value="' + questionInfo.QuestionText + '"><div class="errorMargin"><label class="alignLeft errorText">Please Enter Question Title</label></div></div>' +
                        '<label class="alignLeft top_Margin">Description</label>' +
                        '<div class="input-control textarea alignLeft">' +
                        '<textarea id="quest_Intro" class="txtAreaWidth inputBorder fieldWidth" name="editQuestionExplanation">' + questionInfo.QuestionContent + '</textarea><div class="errorMargin"><label id="errorParentIntro" class="error_Message marginNone">Please Enter Question Description</label></div></div>' +
                         '<label class="alignLeft top_Margin">Tooltip</label><div class="input-control text width42 alignLeft">' +
                '<input type="text" class="editQuestionTolltip inputBorder questWidth" name="editQuestionTolltip" value="' + questionInfo.QuestionHelpText + '"><div class="errorMargin"><label class="alignLeft errorText">Please Enter Question Tooltip</label></div></div>' +
                  '<label class="alignLeft top_Margin">Answer Type</label>' +
                   '<div class="input-control margin10 no-margin-left no-margin-right no-margin-top place-left clearLeft widthSelect2" data-role="select">' +
                 options +
                    '<label class="alignLeft">Options</label><div class="lastOption">' +
                   optionsEle +
                       '</div><div class="buttonDoneCancel alignLeft"><div class="questionDone actionButtonDone"><img src="/images/generic-tick-small-accent@2x.png">&nbsp;Done</div><div class="questionCancel actionButtonCancel margin80"><img src="/images/generic-cross-12px-accent@2x.png">&nbsp;Cancel</div></div>' +
          '</div>';
                    $(that).parent().children('ul.inner').children('li:eq(0)').find('div.inner').html(questCnt);
                    $(that).next().find('li:eq(0)').toggle();
                    if ($(that).next().find('li:eq(0)').css('display') !== 'none') {
                        $('a.toggle').prop('disabled', true);
                        $('a.toggle').addClass('disableHeader');
                        $(that).removeClass('disableHeader');



                        $('.previewQuestions').attr('disabled', true);
                        $('.submitQuestions').attr('disabled', true);
                        $('.saveQuestions').attr('disabled', true);

                        $('.editNewChildQuestion').addClass('disablePage');
                        $('.newPageCreate').addClass('disablePage');
                        $('.editNewQuestion').addClass('disablePage');
                        $('.newChildQustLink').addClass('disablePage');

                        $('.addNewQuest').addClass('disablePage');

                    }
                },
                error: function (data) {
                    var questSpinnerdialog = $('#spinnerDialog').data('dialog');
                    questSpinnerdialog.close();
                    window.alert("Error occured while retrieving question details from server. Please try again.");
                }
            });


        }


        else {
            var quest_id = $(this).closest('li').find('.questionStoreId').val();
            if (quest_id == undefined) {
                $(this).next().find('li:eq(0)').toggle();
                if ($(this).next().find('li:eq(0)').css('display') !== 'none') {
                    $('a.toggle').prop('disabled', true);
                    $('a.toggle').addClass('disableHeader');
                    $(this).removeClass('disableHeader');
                }
            } else {

                var that = this;
                var questSpinnerdialog = $('#spinnerDialog').data('dialog');
                questSpinnerdialog.open();
                $.ajax({
                    url: 'api/question/GetQuestionByQuestionVersionId?questionVersionId=' + quest_id + '&languageId=192C79DD-B246-4BF2-B297-A36338981F99',
                    type: 'GET',
                    success: function (data) {
                        questSpinnerdialog.close();



                        $('.previewQuestions').attr('disabled', true);
                        $('.submitQuestions').attr('disabled', true);
                        $('.saveQuestions').attr('disabled', true);
                        $('.newPageCreate').addClass('disablePage');
                        $('a.toggle').prop('disabled', true);
                        $('a.toggle').addClass('disableHeader');
                        $(that).removeClass('disableHeader');
                        $('.editNewChildQuestion').addClass('disablePage');

                        $('.addNewQuest').addClass('disablePage');
                        $('.newChildQustLink').addClass('disablePage');
                        $('.editNewQuestion').addClass('disablePage');
                        var selector = $(that).next().find('li:eq(0)');
                        selector.toggle();
                        selector.find('.questionName').val(data.QuestionText);
                        selector.find('input[name="questionRequired"]').prop("checked", data.IsMandatory);
                        selector.find('.questionTolltip').val(data.QuestionHelpText);
                        selector.find('#quest_Intro').htmlarea('html', data.QuestionContent);


                        var ansType = '';

                        $(answerTypesArray).each(function (key, value) {


                            if (value == data.AnswerType) {
                                ansType = ansType + '<option selected>' + value + '</option>';
                            }
                            else {
                                ansType = ansType + '<option>' + value + '</option>';
                            }
                        });
                        options = '<select id="select questionAnswerSelect" class="questionAnswerSelect">' + ansType + '</select>';
                        selector.find('.widthSelect2').html(options);
                        $('.questionAnswerSelect').select2();

                        var optionsEle = '', optionLabel;
                        $.each(data.QuestionOptions, function (i, val) {


                            if (data.AnswerType == "Single Choice" || data.AnswerType == "Multiple Choice") {
                                selector.find('.erroLabel:eq(4)').show();
                                optionLabel = '<label class="alignLeft">Options</label>';
                                optionsEle = optionsEle +
            '<div class="input-control text  alignLeft top_Margin">' +
                          ' <input type="text" class="questionOption inputBorder" data-optionid="' + val.OptionId + '" name="questionName" value="' + val.OptionText + '"><div class="errorMargin"><label class="alignLeft errorText">Please Enter Option</label></div></div>' +
                          '<div class="input-control text  place-left weightWidth top_Margin">' +
                          ' <input type="text" class="questionWeight inputBorder" name="weight" value="' + val.QuestionOptionWeight + '"><div class="errorMargin"><label class="alignLeft errorText weightFont">Please Enter Appropriate Weight</label></div></div>';
                                if (data.QuestionOptions.length - 1 == i) {
                                    optionsEle = optionsEle +
            '<div class="add-option place-left" id="addOption"><span class="ms-Icon ms-Icon--plus"></span></div>';
                                } else {
                                    optionsEle = optionsEle +
            '<div class="delete-option place-left" id="deleteOption"><span class="ms-Icon ms-Icon--minus"></span></div>';
                                }
                            } else if (data.AnswerType == "Attachment" || data.AnswerType == "Free Text") {
                                selector.find('.erroLabel:eq(4)').hide();
                                optionLabel = ''
                                optionsEle = '';
                            } else if (data.AnswerType == "Data List") {
                                selector.find('.erroLabel:eq(4)').show();
                                optionLabel = '<label class="alignLeft">Options</label>';
                                optionsEle = optionsEle +
                                  '<label class="alignLeft">Options</label><div class="input-control text  alignLeft">' +
                             ' <input type="text" placeholder="Field title" class="questionOption inputBorder" data-optionid="' + val.OptionId + '" name="questionName" value="' + val.OptionText + '"><div class="errorMargin"><label class="alignLeft errorText">Please Enter Option</label></div></div>';
                                if (data.QuestionOptions.length - 1 == i) {
                                    optionsEle = optionsEle +
            '<div class="add-option place-left" id="addDataListOption"><span class="ms-Icon ms-Icon--plus"></span></div>';
                                } else {
                                    optionsEle = optionsEle +
            '<div class="delete-option place-left" id="deleteOption"><span class="ms-Icon ms-Icon--minus"></span></div>';
                                }
                            }

                        });
                        selector.find('.lastOption').html(optionsEle);

                    },
                    error: function (data) {
                        var questSpinnerdialog = $('#spinnerDialog').data('dialog');
                        questSpinnerdialog.close();
                        window.alert("Error occured while retrieving question details from server. Please try again.");
                    }
                })

            }

        }
    });


    $(document).on('click', ".questionDone", function (e) {

        e.preventDefault();

        questOptionIdArray = [];




        var selector = $(this).closest('ul.inner').parent(), editoptionsWeightsArray = [], editFormObj = {}, editQuestOptArr = [],
        questionHiddenId = selector.find('.questionHidden').val();


        //question input validation
        $.each(selector.find("input[type='text']"), function (i, val) {
            if ($(this).val() ) {
                if ($(this).hasClass('error')) {
                    $(this).removeClass('error');
                    $(this).next().find('label').hide();
                }
            } else {
                $(this).addClass('error');
                $(this).next().find('label').show();
            }
        });
        if (selector.find("input[type='text'].inputSearchQuestion").hasClass('error')) {
            selector.find("input[type='text'].inputSearchQuestion").removeClass('error')
}

        //weight validation
        $.each(selector.find('.questionWeight'), function (i, val) {
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
        if (selector.find('textarea').val().length > 0) {
            if (selector.find('.jHtmlArea').hasClass('error')) {
                selector.find('.jHtmlArea').removeClass('error');
                selector.find('.jHtmlArea').next().find('span').hide();
            }



        } else {

            selector.find('.jHtmlArea').addClass('error');
            selector.find('.jHtmlArea').next().find('span').show();
        }

        //there is no error
        if (selector.find('.error').length == 0) {
            var questSpinnerdialog = $('#spinnerDialog').data('dialog');
            questSpinnerdialog.open();
            var that = this;
            var selectVal = "";
            if ($(this).closest('.editCreateQuestion').find('.editQuestionAnswerType').length) {
                selectVal = $(this).closest('.editCreateQuestion').find('.editQuestionAnswerType').val().trim();
            } else
                selectVal = $(this).closest('.editCreateQuestion').find('select[class="questionAnswerSelect select2-hidden-accessible"]').val().trim();
            if (selectVal == "Attachment" || selectVal == "Free Text") {
                editFormObj['Option'] = "";
                editFormObj['Weight'] = "";
                editFormObj['OptionId'] = "";
                editoptionsWeightsArray.push(editFormObj);

            }
            else if (selectVal == "Multiple Choice" || selectVal == "Single Choice" || selectVal == "Data List") {

                $(this).closest('.editCreateQuestion').find('.questionOption').each(function (k, v) {
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
            $(this).closest('.editCreateQuestion').find('.questionOption').each(function (k, v) {

                editQuestOptArr.push($(this).val());
                questOptionIdArray.push($(this).attr('data-optionid'));
            });


            var locationSearchId = window.location.hash.split("=");
            $.each(editoptionsWeightsArray, function (i, v) {
                if (questOptionIdArray[i] != null)
                    v['OptionId'] = questOptionIdArray[i];
                else
                    v['OptionId'] = '00000000-0000-0000-0000-000000000000';
            });

            var answerType = "";
            if (selector.find('.editQuestionAnswerType').length)
                answerType = selector.find('.editQuestionAnswerType').val();
            else {
                var parentAnswerTypeId = null;
                answerType = $(this).closest('.editCreateQuestion').find('select').val().trim();

                $.each(answerTypesData, function (i, val) {
                    if (val.AnswerTypeLocalizedtext == answerType) {
                        questAnswerTypeId = val.AnswerTypeId;
                    }
                });
            }

            var questionDetails = {
                questionVersionId: questionHiddenId,
                questionId: null,
                questionnaireVersionId: locationSearchId[1],
                questionVersionLocalizedTextId: null,
                languageId: "192C79DD-B246-4BF2-B297-A36338981F99",
                questionVersionNumber: null,
                isMandatory: $(this).closest('div.inner').find('input[name="questionRequired"]').prop('checked'),
                answerType: answerType,
                questionText: selector.find('.editQuestionName').val(),
                questionHelpText: selector.find('.editQuestionTolltip').val(),
                sectionOrder: _sectionOrder,
                questionContent: selector.find('.txtAreaWidth').val(),
                isActive: 1,
                isDeleted: 0,
                dateTimeCreated: null,
                dateTimeChanged: null,
                questionOptionsArray: editQuestOptArr,
                questionOptionAndWeight: editoptionsWeightsArray,
                displayOrder: questDisplayOrder,
                displayProperties: null,
                answerTypeId: questAnswerTypeId,

                pageTitle: $(this).closest('ul.inner').parent().parent().find('.editPageTitle').val(),
                pageIntro: $(this).closest('ul.inner').parent().parent().find('textarea[name="editPageIntroduction"]').val()

            }

            $.ajax({
                url: 'api/question',
                type: 'PUT',
                data: JSON.stringify(questionDetails),
                contentType: "application/json",
                dataType: "json",
                success: function (data) {

                    questSpinnerdialog.close();
                    $('a.toggle').prop('disabled', false);
                    $('a.toggle').removeClass('disableHeader');
                    $('.addNewQuest').removeClass('disablePage');

                    $('.previewQuestions').attr('disabled', false);
                    $('.submitQuestions').attr('disabled', false);
                    $('.saveQuestions').attr('disabled', false);

                    $('.editNewChildQuestion').removeClass('disablePage');
                    $('.newPageCreate').removeClass('disablePage');
                    $('.editNewQuestion').removeClass('disablePage');
                    $('.newChildQustLink').removeClass('disablePage');
                    $(that).closest('ul.inner').parent().find('.editQuestionTxt').text(selector.index() - 1 + ' ' + selector.find('.editQuestionName').val());
                    toggleArrow($(that).closest('ul.inner').parent().find('.editQuestionTxt'));

                    data = data.replace(/(^"|"$)/g, "");
                    $(that).closest('ul.inner').parent().find('.editQuestionTxt').append('<span class="ms-Icon ms-Icon--trash place-right editDeleteIcon"></span>');
                    $(that).closest('ul.inner').parent().find('.questionHidden').val(data);
                    $(that).closest('li').hide();
                    $(that).closest('div.inner').children().remove();
                },
                error: function (data) {
                    var questSpinnerdialog = $('#spinnerDialog').data('dialog');
                    questSpinnerdialog.close();
                    window.alert("Error occured while updating the question details. Please try again.");
                }
            })
        }
    });


    $(document).on('click', '.createChildQuestions .toggle', function (e) {
        toggleArrow($(this));
        var childId;
        childId = $(this).next().children('div.inner').find('.childQuestionStoreId').val();
        if (childId == undefined) {
            $(this).next().children('div.inner').toggle();
            if ($(this).next().children('div.inner').css('display') !== 'none') {
                $('a.toggle').prop('disabled', true);
                $('a.toggle').addClass('disableHeader');
                $(this).removeClass('disableHeader');

            }
        }
        else {


            var that = this;
            var questSpinnerdialog = $('#spinnerDialog').data('dialog');
            questSpinnerdialog.open();
            $.ajax({
                url: 'api/question/GetQuestionByQuestionVersionId?questionVersionId=' + childId + '&languageId=192C79DD-B246-4BF2-B297-A36338981F99',
                type: 'GET',
                success: function (data) {
                    questSpinnerdialog.close();
                    $('a.toggle').prop('disabled', true);
                    $('a.toggle').addClass('disableHeader');
                    $(that).removeClass('disableHeader');
                    $('.newPageCreate').addClass('disablePage');
                    $('.newChildQustLink').addClass('disablePage');

                    $('.addNewQuest').addClass('disablePage');

                    $('.previewQuestions').attr('disabled', true);
                    $('.submitQuestions').attr('disabled', true);
                    $('.saveQuestions').attr('disabled', true);
                    $('.editNewQuestion').addClass('disablePage');
                    $('.editNewChildQuestion').addClass('disablePage');


                    var selector = $(that).next().children('div.inner');
                    var answers = data.QuestionOptions[0].ChildToParentRelationship.split(',');
                    var ansCondition = answers[1];
                    var equal = ['is equal', 'is not equal'];
                    var condition_Array = data.ParentOptions;
                    $(that).next().children('div.inner').toggle();
                    selector.find('.childQuestionName ').val(data.QuestionText);
                    selector.find('input[name="childQuestionRequired"]').prop("checked", data.IsRequired);
                    selector.find('#child_Intro').htmlarea('html', data.QuestionContent);



                    selector.find('.childQuestionTolltip').val(data.QuestionHelpText);

                    if (selector.find('input[name="childQuestionRequired"]').prop("checked") == true) {

                        selector.find('.answerTo').addClass('disablePage');
                    }
                    var ansType = '', equalType = '', optType = '';

                    $(answerTypesArray).each(function (key, value) {


                        if (value == data.AnswerType) {
                            ansType = ansType + '<option selected>' + value + '</option>';
                        }
                        else {
                            ansType = ansType + '<option>' + value + '</option>';
                        }
                    });
                    $(condition_Array).each(function (key, value) {


                        if (value == ansCondition) {
                            optType = optType + '<option selected>' + value + '</option>';
                        }
                        else {
                            optType = optType + '<option>' + value + '</option>';
                        }
                    });
                    $(equal).each(function (key, value) {


                        if (value == answers[0]) {
                            equalType = equalType + '<option selected>' + value + '</option>';
                        }
                        else {
                            equalType = equalType + '<option>' + value + '</option>';
                        }
                    });
                    options = '<select id="select childQuestionAnswerSelect" class="childQuestionAnswerSelect">' + ansType + '</select>';
                    var equalSelect = '<select id="select" class="equality">' + equalType + '</select>';
                    var conditionSelect = '<select id="select" class="optionClass">' + optType + '</select>';
                    selector.find('.widthSelector:eq(0)').html(equalSelect);
                    selector.find('.widthSelector:eq(1)').html(conditionSelect);

                    selector.find('.widthSelect2').html(options);
                    $('.childQuestionAnswerSelect ').select2();
                    $('.equality').select2();
                    $('.optionClass').select2();

                    var optionsEle = '', optionLabel;
                    $.each(data.QuestionOptions, function (i, val) {


                        if (data.AnswerType == "Single Choice" || data.AnswerType == "Multiple Choice") {
                            selector.find('.lastOption').prev().show();
                            optionLabel = '<label class="alignLeft">Options</label>';
                            optionsEle = optionsEle +
        '<div class="input-control text  alignLeft top_Margin">' +
                      ' <input type="text" class="questionOption inputBorder" data-optionid="' + val.OptionId + '" name="questionName" value="' + val.OptionText + '"><div class="errorMargin"><label class="alignLeft errorText">Please Enter Option</label></div></div>' +
                      '<div class="input-control text  place-left weightWidth top_Margin">' +
                      ' <input type="text" class="questionWeight inputBorder" name="weight" value="' + val.QuestionOptionWeight + '"><div class="errorMargin"><label class="alignLeft errorText weightFont">Please Enter Appropriate Weight</label></div></div>';
                            if (data.QuestionOptions.length - 1 == i) {
                                optionsEle = optionsEle +
        '<div class="add-option place-left" id="addOption"><span class="ms-Icon ms-Icon--plus"></span></div>';
                            } else {
                                optionsEle = optionsEle +
        '<div class="delete-option place-left" id="deleteOption"><span class="ms-Icon ms-Icon--minus"></span></div>';
                            }
                        } else if (data.AnswerType == "Attachment" || data.AnswerType == "Free Text") {
                            selector.find('.lastOption').prev().hide();
                            optionLabel = ''
                            optionsEle = '';
                        } else if (data.AnswerType == "Data List") {
                            selector.find('.lastOption').prev().show();
                            optionLabel = '<label class="alignLeft">Options</label>';
                            optionsEle = optionsEle +
                              '<label class="alignLeft">Options</label><div class="input-control text  alignLeft">' +
                         ' <input type="text" placeholder="Field title" class="questionOption inputBorder" data-optionid="' + val.OptionId + '" name="questionName" value="' + val.OptionText + '"><div class="errorMargin"><label class="alignLeft errorText">Please Enter Option</label></div></div>';
                            if (data.QuestionOptions.length - 1 == i) {
                                optionsEle = optionsEle +
        '<div class="add-option place-left" id="addDataListOption"><span class="ms-Icon ms-Icon--plus"></span></div>';
                            } else {
                                optionsEle = optionsEle +
        '<div class="delete-option place-left" id="deleteOption"><span class="ms-Icon ms-Icon--minus"></span></div>';
                            }
                        }

                    });
                    selector.find('.lastOption').html(optionsEle);


                },
                error: function (data) {
                    var questSpinnerdialog = $('#spinnerDialog').data('dialog');
                    questSpinnerdialog.close();
                    window.alert("Error occured while retrieving question details from server. Please try again.");
                }
            })

        }

    });



    var questOptArr = [];
    var questWeightArr = [];
    var questionOptionObj = {};
    var questionWeightObj = {};
    var ansOptions = '';
    var multipleSelect = '';
    var ansToParent = '';
    var optionLabel = '';
    var questId = [];
    var questionIdToDelete;

    var optionsWeightsArray = [];

    var formObj = {};
    var parentAnswerTypeId;


    $(document).on('change', 'select', function () {


        // if (($(this).attr('id').indexOf('questionAnswerSelect') >= 0) || ($(this).attr('id').indexOf('childQuestionAnswerSelect') >= 0)) {
        var lastoptionSelect = $(this).parent().siblings('.lastOption');
        var questionval = $(this).val();
        if ($(this).parent().next().hasClass('displayNone')) {
            $(this).parent().next().removeClass('displayNone');
        }
        if (questionval == 'Attachment' || questionval == 'Free Text') {
            lastoptionSelect.html('');
            optionLabel = '';
            if($(this).attr('id').indexOf('selectWorkFlowType') >= 0){
               
            } else {
                $(this).parent().next().addClass('displayNone');
            }
        } else if (questionval == 'Single Choice' || questionval == 'Multiple Choice') {
            lastoptionSelect.html('<div class="input-control text  alignLeft optionMargin">' +
            ' <input type="text" class="questionOption inputBorder" name="questionName" placeholder="Option"><label class="alignLeft errorText">Please Enter Option</label></div>' +
            '<div class="input-control text  place-left weightWidth optionMargin">' +
            ' <input type="text" class="questionWeight inputBorder" name="weight" placeholder="Weight"><label class="alignLeft errorText weightFont">Please Enter Appropriate Weight</label></div>' +
            '<div class="delete-option place-left" id="deleteOption"><span class="ms-Icon ms-Icon--minus"></span></div>' +
                '<div class="input-control text  alignLeft optionMargin">' +
            ' <input type="text" class="questionOption inputBorder" name="questionName" placeholder="Option"><label class="alignLeft errorText">Please Enter Option</label></div>' +
            '<div class="input-control text  place-left weightWidth optionMargin">' +
            ' <input type="text" class="questionWeight inputBorder" name="weight" placeholder="Weight"><label class="alignLeft errorText weightFont">Please Enter Appropriate Weight</label></div>' + '<div class="add-option place-left" id="addOption"><span class="ms-Icon ms-Icon--plus"></span></div>');

        } else if (questionval == 'Data List') {
            lastoptionSelect.html('<div class="input-control text  alignLeft">' +
            ' <input type="text" placeholder="Field title" class="questionOption inputBorder" name="questionName"><label class="alignLeft errorText">Please Enter Option</label></div>' +
            '<div class="delete-option place-left" id="deleteOption"><span class="ms-Icon ms-Icon--minus"></span></div>' +
           '<div class="input-control text  alignLeft">' +
            ' <input type="text" placeholder="Field title" class="questionOption inputBorder" name="questionName"><label class="alignLeft errorText">Please Enter Option</label></div>' +
            '<div class="add-option place-left" id="addDataListOption"><span class="ms-Icon ms-Icon--plus"></span></div>');

        }


        // }

    });


    $(document).on('click', '.createQuestions .hasChild', function (e) {




        var selectedAnswer = $(this).closest('.createQuestions').find('select').val().trim();

        $.each(answerTypesData, function (i, val) {
            if (val.AnswerTypeLocalizedtext == selectedAnswer) {
                parentAnswerTypeId = val.AnswerTypeId;
            }

        });

        optionsWeightsArray = [];
        var questionTarget = $(this).closest('.createQuestions');
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
            if ($(this).closest('li').find('#editQuest').length > 0) {
                $(this).closest('li').find('#editQuest').remove();
            }
            var optionAttachment;
            questOptArr = [];
            $('.saveQuestions').attr('disabled', false);

            var selectVal = $(this).closest('.createQuestions').find('select').val().trim();
            if (selectVal == "Attachment" || selectVal == "Free Text") {
                formObj['Option'] = "";
                formObj['Weight'] = "";
                optionsWeightsArray.push(formObj);

            }
            else if (selectVal == "Multiple Choice" || selectVal == "Single Choice" || selectVal == "Data List") {
                $(this).closest('.createQuestions').find('.questionOption').each(function (k, v) {
                    var r = k + 1;
                    formObj = {};

                    formObj['Option'] = $(this).val();

                    if ($(this).parent().next().find('.questionWeight').val() != undefined) {
                        formObj['Weight'] = $(this).parent().next().find('.questionWeight').val();
                    }
                    else {
                        formObj['Weight'] = "";

                    }

                    optionsWeightsArray.push(formObj);


                });


                $(this).closest('.createQuestions').find('.questionOption').each(function (k, v) {

                    questOptArr.push($(this).val());
                });

                $(this).closest('.createQuestions').find('.questionWeight').each(function (k, v) {
                    questWeightArr.push($(this).val());
                });
                ansOptions = '';

                $(questOptArr).each(function (key, value) {



                    ansOptions += "<option>" + value + "</option>"
                });
            }

            if (selectVal == "Multiple Choice") {
                multipleSelect = 'to&nbsp' + '<select id="select" class = "optionClass" multiple>' + ansOptions + '</select>';
                ansToParent = '<label class="input-control checkbox alignLeft"><input type="checkbox" class="childQuestCheckBox" name="childQuestionRequired"><span class="check inputBorder"></span><span class="caption">&nbsp;Required</span></label>' +
'<div class="answerTo"><label class="alignLeft marginForAnsText">Answer to parent question</label>' +
            '<div class="input-control margin10 no-margin-left no-margin-right no-margin-top alignLeft widthSelector" data-role="select">' +
             '<select id="select" class="equality">' +
                '<option>is equal</option><option>is not equal</option>' +

             '</select></div>' +
             '<div class="input-control margin10 no-margin-right no-margin-top place-left widthSelector marginForOptions" data-role="select">' +
             multipleSelect +
                '</div></div>';

                optionLabel = '<label class="alignLeft">Options</label>';
            }
            else if (selectVal == "Attachment" || selectVal == "Free Text") {
                optionAttachment = '';
                multipleSelect = '';
                ansToParent =  '<label class="input-control checkbox alignLeft"><input type="checkbox" class="childQuestCheckBox" name="childQuestionRequired" checked disabled><span class="check inputBorder"></span><span class="caption">&nbsp;Required</span></label>' ;
                optionLabel = '';
            } else {
                multipleSelect = 'to&nbsp' + '<select id="select" class = "optionClass">' + ansOptions + '</select>';
                ansToParent = '<label class="input-control checkbox alignLeft"><input type="checkbox" class="childQuestCheckBox" name="childQuestionRequired"><span class="check inputBorder"></span><span class="caption">&nbsp;Required</span></label>' +
 '<div class="answerTo"><label class="alignLeft marginForAnsText">Answer to parent question</label>' +
            '<div class="input-control margin10 no-margin-left no-margin-right no-margin-top alignLeft widthSelector" data-role="select">' +
             '<select id="select" class="equality">' +
                '<option>is equal</option><option>is not equal</option>' +

             '</select></div>' +
             '<div class="input-control margin10 no-margin-right no-margin-top place-left widthSelector marginForOptions" data-role="select">' +
             multipleSelect +
                '</div></div>';
                optionLabel = '<label class="alignLeft">Options</label>';

            }




            var questTitle = $(this).closest('li').find('.questionName').val();
            $(this).closest('ul.inner').prev().text(($(this).closest('ul.inner').parent().index() - 1) + ' ' + questTitle);
            $(this).closest('ul.inner').prev().append('<span class="ms-Icon ms-Icon--trash place-right deleteIcon"></span>');
            $(this).closest('li').hide();
            if ($(this).closest('ul.inner').find('.addNewQuest').hasClass('disablePage')) {
                $(this).closest('ul.inner').find('.addNewQuest').removeClass('disablePage')
            }
            if ($('.newPageCreate').hasClass('disablePage')) {

                $('.newPageCreate').removeClass('disablePage')
            }


            childQuest = '<li class="createChildQuestions " style="display:none;">' +
            '<a class="toggle downArrowPng" href="javascript:void(0);">New Child Question</a>' +
            '<form><div class="inner">' +
            ansToParent +
            '<div class="searchBarQuest"><span class="place-left">Search questions or&nbsp</span><span class="addChildQuest place-left">add a new one</span>' +
            '<div class="tab-group-content alignLeft search_input margin10 no-margin-left">' +
            '<div class="input-control text no-margin">' +
            '<input type="text" class="textInput inputSearchQuestion" name="inputSearchQuestion">' +
            '<button class="button search_btn childQuestionSearchButton"><span class="mif-search"></span>' +

            '</button> </div> </div> </div>' +
            '</li>';


            var locationSearchId = window.location.hash.split("=");
            var questVersionId = '';
            if ($(this).closest('li').find('.questionStoreId').val() == undefined) {
                questVersionId = null;
            } else {
                questVersionId = $(this).closest('li').find('.questionStoreId').val();
            }
            var questionDetails = {
                questionVersionId: questVersionId,
                questionId: null,
                questionnaireVersionId: locationSearchId[1],
                questionVersionLocalizedTextId: null,
                languageId: "192C79DD-B246-4BF2-B297-A36338981F99",
                questionVersionNumber: null,
                isMandatory: $(this).closest('.createQuestions').find('input[name="questionRequired"]').prop('checked'),
                answerType: $(this).closest('.createQuestions').find('select').val().trim(),
                questionText: $(this).closest('.createQuestions').find('.questionName').val().trim(),
                questionHelpText: $(this).closest('.createQuestions').find('.questionTolltip').val().trim(),
                sectionOrder: $(this).closest('ul.inner').parent().parent().parent().index() + 1,
                questionContent: $(this).closest('.createQuestions').find('textarea[name="questionExplanation"]').val().trim(),
                isActive: 1,
                isDeleted: 0,
                dateTimeCreated: null,
                dateTimeChanged: null,
                questionOptionsArray: questOptArr,
                questionWeightsArray: questWeightArr,
                questionOptionAndWeight: optionsWeightsArray,
                displayOrder: $(this).closest('ul.inner').parent().index() - 1,
                displayProperties: null,
                answerTypeId: parentAnswerTypeId,

                pageTitle: $(this).closest('ul.inner').parent().parent().find('.pageTitle').val(),
                pageIntro: $(this).closest('ul.inner').parent().parent().find('textarea').val()

            }



            var that = $(this);
            var dialog = $('#spinnerDialog').data('dialog');
            dialog.open();

            if ($(this).closest('li').find('.questionStoreId').val() == undefined) {


                $.ajax({
                    url: 'api/question',
                    type: 'POST',
                    data: JSON.stringify(questionDetails),
                    contentType: "application/json",
                    dataType: "json",
                    success: function (data) {

                        var locationSearchId = window.location.hash.split("=");

                        $.ajax({

                            url: 'api/question/GetQuestionPageTitles?questionnaireVersionId=' + locationSearchId[1] + '&languageId=192C79DD-B246-4BF2-B297-A36338981F99',
                            type: 'GET',
                            success: function (result) {
                                dialog.close();
                                $('.previewQuestions').attr('disabled', false);
                                $('.submitQuestions').attr('disabled', false);
                                $('.saveQuestions').attr('disabled', false);
                                $('.newPageCreate').removeClass('disablePage');
                                $('a.toggle').prop('disabled', false);
                                $('a.toggle').removeClass('disableHeader');
                                $('.addNewQuest').removeClass('disablePage');
                                $('.newChildQustLink').removeClass('disablePage');
                                $('.editNewChildQuestion').removeClass('disablePage');
                                $('.editNewQuestion').removeClass('disablePage');


                                $(that).closest('ul.inner').parent().parent().find('.pageHidden').val(result[result.length - 1].PageId);
                                if ($(that).closest('ul.inner').parent().parent().prev().html().indexOf("span") == -1) {
                                    $(that).closest('ul.inner').parent().parent().prev().append('<span class="ms-Icon ms-Icon--trash place-right deletePage" onclick="showDialogDeletePage(event)"></span>');

                                }
                            }
                        });

                        data = data.replace(/(^"|"$)/g, "");
                        questionIdToDelete = data;


                        $(that).append('<input type="hidden" class="questionStoreId" />');
                        toggleArrow($(that).closest('ul.inner').prev());
                        $(that).closest('li').find('.questionStoreId').val(questionIdToDelete);



                        $(that).closest('ul.inner').find('.addNewQuest').before(childQuest);
                        $(that).closest('ul.inner').find('.addNewQuest').before('<div class="newChildQustLink padding32">New Child Question</div>');

                        $(that).closest('li').next().find('.childQuestBlock').hide();

                    },
                    error: function (data) {
                        var questSpinnerdialog = $('#spinnerDialog').data('dialog');
                        questSpinnerdialog.close();
                        window.alert("Error occured while creating the question. Please try again.");
                    }
                });
            }
            else {
                $.ajax({
                    url: 'api/question',
                    type: 'PUT',
                    data: JSON.stringify(questionDetails),
                    contentType: "application/json",
                    dataType: "json",
                    success: function (data) {
                        dialog.close();
                        var locationSearchId = window.location.hash.split("=");
                        data = data.replace(/(^"|"$)/g, "");
                        questionIdToDelete = data;
                        toggleArrow($(that).closest('ul.inner').prev());
                        $(that).closest('li').find('.questionStoreId').val(questionIdToDelete);


                        $('.previewQuestions').attr('disabled', false);
                        $('.submitQuestions').attr('disabled', false);
                        $('.saveQuestions').attr('disabled', false);
                        $('.newPageCreate').removeClass('disablePage');
                        $('a.toggle').prop('disabled', false);
                        $('a.toggle').removeClass('disableHeader');
                        $('.addNewQuest').removeClass('disablePage');
                        $('.newChildQustLink').removeClass('disablePage');
                        $('.editNewQuestion').removeClass('disablePage');
                        $('.editNewChildQuestion').removeClass('disablePage');


                    },
                    error: function (data) {
                        var questSpinnerdialog = $('#spinnerDialog').data('dialog');
                        questSpinnerdialog.close();
                        window.alert("Error occured while updating the question. Please try again.");
                    }
                });

                if ($(this).closest('.createQuestions').find('select').val() == 'Multiple Choice') {
                    $(this).closest('ul.inner').find('.widthSelector.marginForOptions').empty();
                    $(this).closest('ul.inner').find('.widthSelector.marginForOptions').append('to&nbsp' + '<select id="select" class = "optionClass" multiple>' + ansOptions + '</select>');
                    $(this).closest('ul.inner').find('.optionClass').select2();
                    $(this).closest('ul.inner').find('input.childQuestCheckBox').prop('checked', false);
                    $(this).closest('ul.inner').find('input.childQuestCheckBox').prop('disabled', false);
                }
                else if ($(this).closest('.createQuestions').find('select').val() == 'Attachment' || $(this).closest('.createQuestions').find('select').val() == 'Free Text') {
                    $(this).closest('ul.inner').find('.answerTo').empty();
$(this).closest('ul.inner').find('input.childQuestCheckBox').prop('checked', true);
                    $(this).closest('ul.inner').find('input.childQuestCheckBox').prop('disabled', true);


                }
                else {
                    $(this).closest('ul.inner').find('.widthSelector.marginForOptions').empty();
                    $(this).closest('ul.inner').find('.widthSelector.marginForOptions').append('to&nbsp' + '<select id="select" class = "optionClass">' + ansOptions + '</select>');
                    $(this).closest('ul.inner').find('.optionClass').select2();
$(this).closest('ul.inner').find('input.childQuestCheckBox').prop('checked', false);
                    $(this).closest('ul.inner').find('input.childQuestCheckBox').prop('disabled', false);
                }
            }


        }

    });
    $(document).on('click', '.cancelMainQuestion', function (e) {

        e.preventDefault();

        if ($(this).closest('li').find('.questionStoreId').val() == undefined) {
            $(this).closest('ul.inner').parent().parent().parent().append('<div class="editNewQuestion">New Question</div>');
            $(this).closest('ul.inner').parent().remove();
        }

        else {

            $(this).closest('li').hide();
            toggleArrow($(this).closest('ul.inner').prev());

        }
        $('a.toggle').prop('disabled', false);
        $('a.toggle').removeClass('disableHeader');
        $('.previewQuestions').attr('disabled', false);
        $('.submitQuestions').attr('disabled', false);
        $('.saveQuestions').attr('disabled', false);
        $('.newPageCreate').removeClass('disablePage');
        $('.addNewQuest').removeClass('disablePage');
        $('.newChildQustLink').removeClass('disablePage');
        $('.editNewChildQuestion').removeClass('disablePage');
        $('.editNewQuestion').removeClass('disablePage');



    });

    $(document).on('click', '.cancelChildQuestion', function (e) {

        e.preventDefault();
        $(this).closest('div.inner').children().removeAttr('style');
        if ($(this).closest('div.inner').find('.searchBarQuest').children().hasClass('disablePage')) {
            $(this).closest('div.inner').find('.searchBarQuest').children().removeClass('disablePage');
        }
        if ($(this).closest('div.inner').find('.search_input').children().hasClass('disablePage')) {
            $(this).closest('div.inner').find('.search_input').children().removeClass('disablePage');
        }

        if ($(this).closest('ul.inner').find('.addNewQuest').hasClass('disablePage')) {
            $(this).closest('ul.inner').find('.addNewQuest').removeClass('disablePage')
        }
        if ($('.newPageCreate').hasClass('disablePage')) {

            $('.newPageCreate').removeClass('disablePage')
        }
        if ($(this).closest('li').find('.childQuestionStoreId').length == 0) {
            $(this).closest('li').find('.inputSearchQuestion').val("");
            if (!$(this).closest('li').parent().children().hasClass('newChildQustLink')) {
                if ($(this).closest('li').parent().find('.addNewQuest').length > 0) {
                    $(this).closest('li').parent().find('.addNewQuest').before('<div class= "newChildQustLink padding32">New Child Question</div>');
                } else {
                    $(this).closest('li').parent().append('<div class= "newChildQustLink padding32">New Child Question</div>');

                }
            }

            $(this).closest('li').hide();
            $(this).closest('li').find('.childQuestBlock').remove();

        } else {
            $(this).closest('li').find('div.inner').hide();
            toggleArrow($(this).closest('li').find('a.toggle'));

        }


        $('.previewQuestions').attr('disabled', false);
        $('.submitQuestions').attr('disabled', false);
        $('.saveQuestions').attr('disabled', false);
        $('.newChildQustLink').removeClass('disablePage');
        $('a.toggle').prop('disabled', false);
        $('a.toggle').removeClass('disableHeader');
        $('.addNewQuest').removeClass('disablePage');
        $('.editNewQuestion').removeClass('disablePage');
        $('.editNewChildQuestion').removeClass('disablePage');


    });


    var childIdToDelete;
    var childOptionsWeightsArray = [];
    var formObjectForChild = {};
    var childAnswerTypeId;
    $(document).on('click', '.doneChildQuest', function (e) {

        e.preventDefault();


        $('.previewQuestions').attr('disabled', false);
        $('.submitQuestions').attr('disabled', false);
        $('.saveQuestions').attr('disabled', false);



        var selectedAnswer = $(this).closest('.childQuestBlock').find('select').val().trim();

        $.each(answerTypesData, function (i, val) {

            if (val.AnswerTypeLocalizedtext == selectedAnswer) {
                childAnswerTypeId = val.AnswerTypeId;
            }

        });






        childOptionsWeightsArray = [];
        var questionTarget = $(this).closest('.childQuestBlock');
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
            $('a.toggle').prop('disabled', false);
            $('a.toggle').removeClass('disableHeader');
            if ($(this).closest('li').find('#editChildQuest').length > 0) {
                $(this).closest('li').find('#editChildQuest').remove();
            }

            if ($(this).closest('ul.inner').find('.addNewQuest').hasClass('disablePage')) {
                $(this).closest('ul.inner').find('.addNewQuest').removeClass('disablePage')
            }
            if ($('.newPageCreate').hasClass('disablePage')) {

                $('.newPageCreate').removeClass('disablePage')
            }
            var subQuestOptArr = [];
            var subQuestWeightArr = [];



            var selectVal = $(this).closest('.childQuestBlock').find('select').val().trim();

            if (selectVal == "Attachment" || selectVal == "Free Text") {
                formObjectForChild['Option'] = "";
                formObjectForChild['Weight'] = "";
                childOptionsWeightsArray.push(formObjectForChild);
            }

            else if (selectVal == "Multiple Choice" || selectVal == "Single Choice" || selectVal == "Data List") {
                $(this).closest('.childQuestBlock').find('.questionOption').each(function (k, v) {

                    var r = k + 1;
                    formObjectForChild = {};


                    formObjectForChild['Option'] = $(this).val();


                    if ($(this).closest('.childQuestBlock').find('.questionWeight').val() != undefined) {
                        formObjectForChild['Weight'] = $(this).parent().next().find('.questionWeight').val();
                    }
                    else {
                        formObjectForChild['Weight'] = "";

                    }
                    childOptionsWeightsArray.push(formObjectForChild);
                });



            }

            $(this).closest('.createChildQuestions').find('.questionOption').each(function (k, v) {
                subQuestOptArr.push($(this).val());
            });
            $(this).parent().find('.questionWeight').each(function (k, v) {
                subQuestWeightArr.push($(this).val());
            });
            var arrayEquality = [];
            var arrayForCondition;
            var equailityIs;

            var optionsAre;
            if ($(this).closest('li').find('.childQuestCheckBox').prop('checked') == false) {
                optionsAre = $(this).closest('li').find('.optionClass').val();
                equailityIs = $(this).closest('li').find('.equality').val();
            }
            else {
                optionsAre = "isrequired";
                equailityIs = "is equal";
            }
            arrayEquality.push(equailityIs);

            arrayForCondition = arrayEquality.concat(optionsAre);
            var locationSearchId = window.location.hash.split("=");
            var childQuestVersionId = '';
            if ($(this).closest('li').find('.childQuestionStoreId').val() == undefined) {
                childQuestVersionId = null;
            }
            else {
                childQuestVersionId = $(this).closest('li').find('.childQuestionStoreId').val();
            }
            var childQuestionDetails = {

                questionId: null,
                dateTimeChanged: null,
                dateTimeCreated: null,
                isDeleted: 0,
                answerType: $(this).closest('.childQuestBlock').find('select').val().trim(),
                isActive: 1,
                isMandatory: 0,
                questionVersionId: childQuestVersionId,
                questionVersionNumber: null,
                questionText: $(this).closest('li').find('.childQuestionName').val(),
                questionContent: $(this).closest('li').find('textarea[name="childquestionExplanation"]').val(),
                questionHelpText: $(this).closest('li').find('.childQuestionTolltip').val(),
                sectionOrder: $(this).closest('ul.inner').parent().parent().parent().index() + 1,

                questionnaireVersionId: locationSearchId[1],
                pageTitle: $(this).closest('ul.inner').parent().parent().find('.pageTitle').val(),
                languageId: "192C79DD-B246-4BF2-B297-A36338981F99",
                displayOrder: ($(this).closest('ul.inner').parent().index() - 1) + "." + $(this).parents('li').index(),
                parentQuestionVersionId: $(this).closest('li').parent().find('.questionStoreId').val(),

                questionOptionsArray: subQuestOptArr,
                questionWeightsArray: subQuestWeightArr,
                questionOptionAndWeight: childOptionsWeightsArray,
                answerTypeId: childAnswerTypeId,
                questionConditionArray: arrayForCondition,
                pageIntro: $(this).closest('ul.inner').parent().parent().find('textarea[name="pageIntroduction"]').val()

            }
            var dialog = $('#spinnerDialog').data('dialog');
            dialog.open();
            var that = this;
            if ($(this).closest('li').find('.childQuestionStoreId').val() == undefined) {
                $.ajax({
                    url: 'api/question',
                    type: 'POST',

                    data: JSON.stringify(childQuestionDetails),
                    contentType: "application/json",
                    dataType: "json",

                    success: function (data) {



                        data = data.replace(/(^"|"$)/g, "");
                        childIdToDelete = data;

                        $(that).closest('div.inner').append('<input type="hidden" class="childQuestionStoreId" />');
                        $(that).closest('li').find('.childQuestionStoreId').val(childIdToDelete);



                        if ($(that).closest('ul.inner').find('.addNewQuest').length > 0) {
                            $(that).closest('ul.inner').find('.addNewQuest').before(childQuest);
                            $(that).closest('ul.inner').find('.addNewQuest').before('<div class="newChildQustLink padding32">New Child Question</div>');
                        }
                        else {
                            $(that).closest('ul.inner').append('<div class="newChildQustLink padding32">New Child Question</div>');
                        }
                        $(that).closest('li').next().find('.childQuestBlock').hide();
                        var chidQuestTxt = ($(that).closest('ul.inner').parent().index() - 1) + "." + $(that).closest('li').index() + " " + $(that).closest('li').find('.childQuestionName').val();
                        $(that).closest('li').find('a.toggle').text(chidQuestTxt);
                        toggleArrow($(that).closest('li').find('a.toggle'));
                        $(that).closest('li').find('a.toggle').append('<span class="ms-Icon ms-Icon--trash place-right deleteChildQuestIcon"></span>');
                        $(that).closest('div.inner').hide();
                        dialog.close();
                        $('.addNewQuest').removeClass('disablePage');
                        $('.newChildQustLink').removeClass('disablePage');
                        $('.editNewQuestion').removeClass('disablePage');
                        $('.editNewChildQuestion').removeClass('disablePage');

                    },
                    error: function (data) {
                        var questSpinnerdialog = $('#spinnerDialog').data('dialog');
                        questSpinnerdialog.close();
                        window.alert("Error occured while creating the question. Please try again.");
                    }
                });





            }
            else {
                $.ajax({
                    url: 'api/question',
                    type: 'PUT',

                    data: JSON.stringify(childQuestionDetails),
                    contentType: "application/json",
                    dataType: "json",

                    success: function (data) {



                        data = data.replace(/(^"|"$)/g, "");
                        childIdToDelete = data;
                        $(that).closest('li').find('.childQuestionStoreId').val(childIdToDelete);
                        var chidQuestTxt = ($(that).closest('ul.inner').parent().index() - 1) + "." + $(that).closest('li').index() + " " + $(that).closest('li').find('.childQuestionName').val();
                        $(that).closest('li').find('a.toggle').text(chidQuestTxt);
                        toggleArrow($(that).closest('li').find('a.toggle'));
                        $(that).closest('li').find('a.toggle').append('<span class="ms-Icon ms-Icon--trash place-right deleteChildQuestIcon"></span>');
                        $(that).closest('li').find('div.inner').hide();
                        dialog.close();
                        $('.newChildQustLink').removeClass('disablePage');
                        $('.addNewQuest').removeClass('disablePage');
                        $('.editNewQuestion').removeClass('disablePage');
                        $('.editNewChildQuestion').removeClass('disablePage');
                    },
                    error: function (data) {
                        var questSpinnerdialog = $('#spinnerDialog').data('dialog');
                        questSpinnerdialog.close();
                        window.alert("Error occured while updating the question. Please try again.");
                    }
                });





            }
        }


    });

    $(document).on('click', ".editDeleteChildQuestIcon", function (e) {
        e.stopImmediatePropagation();
        e.preventDefault();
        childquestIdToDelete = $(this).closest('li').find('.childQuestionHidden').val();
        childquestIdToDelete = childquestIdToDelete.replace(/(^"|"$)/g, '');

        editChildQuestionNode = this;
        var editChildQuestionDialog = $("#dialogEditChildQuestionDelete").data('dialog');

        editChildQuestionDialog.open();



    });



    $(document).on('click', '.deleteChildQuestIcon', function (e) {
        e.preventDefault();
        e.stopPropagation();

        child_To_Delete = $(this).closest('li').find('.childQuestionStoreId').val();
        child_To_Delete = child_To_Delete.replace(/(^"|"$)/g, '');

        createChildQuestionNode = this;
        var createChildQuestionDialog = $("#dialogChildQuestionDelete").data('dialog');

        createChildQuestionDialog.open();




    });



    $(document).on('click', ".editDeleteIcon", function (e) {
        e.stopImmediatePropagation();
        e.preventDefault();
        questIdToDelete = $(this).closest('li').find('.questionHidden').val();
        questIdToDelete = questIdToDelete.replace(/(^"|"$)/g, '');


        editQuestionNode = this;
        var editQuestionDialog = $("#dialogEditQuestionDelete").data('dialog');

        editQuestionDialog.open();



    });


    $(document).on('click', '.deleteIcon', function (e) {
        e.preventDefault();
        e.stopPropagation();



        idToDelete = $(this).closest('li').find('.questionStoreId').val();
        idToDelete = idToDelete.replace(/(^"|"$)/g, '');


        createQuestionNode = this;
        var createQuestionDialog = $("#dialogQuestionDelete").data('dialog');

        createQuestionDialog.open();



    });





    $(document).on('click', ' .addNewQuest', function (e) {
        e.stopImmediatePropagation();
        $('.newChildQustLink').addClass('disablePage');
        $('.previewQuestions').attr('disabled', true);
        $('.submitQuestions').attr('disabled', true);
        $('.saveQuestions').attr('disabled', true);
        $('a.toggle').prop('disabled', true);
        $('a.toggle').addClass('disableHeader');
        $(this).removeClass('disableHeader');

        questOptArr = [];
        questWeightArr = [];
        ansOptions = '';
        if (!$('.newPageCreate').hasClass('disablePage')) {

            $('.newPageCreate').addClass('disablePage')
        }
        $(this).parent().parent().parent().append(newQuest);
        var questVal = $(this).closest('ul.inner').find('li:eq(0)').find('input[type="text"].questionName').val();

        $(this).closest('ul.inner').prev().text(($(this).closest('ul.inner').parent().index() - 1) + ' ' + questVal);
        $(this).closest('ul.inner').prev().append('<span class="ms-Icon ms-Icon--trash place-right deleteIcon"></span>');
        $(this).hide();
    });


    $(document).on('click', ' .addChildQuest', function (e) {
        e.stopImmediatePropagation();
        $('a.toggle').prop('disabled', true);
        $('a.toggle').addClass('disableHeader');
        $(this).parent().parent().parent().parent().children().removeClass('disableHeader');

        $('.previewQuestions').attr('disabled', true);
        $('.submitQuestions').attr('disabled', true);
        $('.saveQuestions').attr('disabled', true);


        if (!$(this).closest('ul.inner').find('.addNewQuest').hasClass('disablePage')) {
            $(this).closest('ul.inner').find('.addNewQuest').addClass('disablePage')
        }
        if (!$('.newPageCreate').hasClass('disablePage')) {

            $('.newPageCreate').addClass('disablePage')
        }
        $('.saveQuestions').attr('disabled', true);
        $(this).closest('li').find('div.inner').append(childQuestContent);

        $(this).parent().css({ 'opacity': 0.5, 'pointer-events': 'none' });


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

    });




    $(document).on('click', '.newPageCreate', function (e) {
        e.stopImmediatePropagation();

        if (!$('.newPageCreate').hasClass('disablePage')) {

            $('.newPageCreate').addClass('disablePage')
        }

        questOptArr = [];
        questWeightArr = [];
        $('ul.accordion>li').each(function (key, val) {


            $(this).find('a.pageTxt').text('Page ' + ($(this).index() + 1) + '-' + $(this).find('ul.inner').find('input[type="text"].pageTitle').val())
            $(this).find('a.pageTxt').append('<span class="ms-Icon ms-Icon--trash place-right deletePage" onclick="showDialogDeletePage(event)"></span>');

            if ($(this).children('ul.inner').children('li:eq(0)').is(':hidden')) {

                $(this).children('ul.inner').children('li').each(function (k, v) {
                    if (k > 0) {

                        if ($(this).find('ul.inner').find('input[type="text"].questionName').length > 0) {
                            $(this).children('a.toggle ').text(k + '-' + $(this).find('ul.inner').find('input[type="text"].questionName').val())
                            $(this).children('a.toggle ').append('<span class="ms-Icon ms-Icon--trash place-right deleteIcon"></span>');
                        }

                    }

                });
            } else {
                $(this).children('ul.inner').children('li').each(function (k, v) {
                    if (k == 0) {
                        $(this).hide();
                    }

                });
            }


        });

        $('ul.accordion').append(page);
        $('a.toggle').prop('disabled', true);
        $('a.toggle').addClass('disableHeader');
        $('ul.accordion>li:last-child').find('.editPageTxt ').removeClass('disableHeader');

        $('.editNewQuestion').addClass('disablePage');
        $('.previewQuestions').attr('disabled', true);
        $('.submitQuestions').attr('disabled', true);
        $('.saveQuestions').attr('disabled', true);
        $('.editNewChildQuestion').addClass('disablePage');
        $('.newChildQustLink').addClass('disablePage');

        $('.addNewQuest').addClass('disablePage');
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

    });

    $(document).on('click', '#addOption', function () {

        $(this).before('<div class="delete-option place-left" id="deleteOption"><span class="ms-Icon ms-Icon--minus"></span></div><div class="input-control text alignLeft optionMargin">' +
        ' <input type="text" class="questionOption inputBorder" name="questionName" placeholder="Option"><div class="errorMargin"><label class="alignLeft errorText">Please Enter Option</label></div></div>' +
        '<div class="input-control text  place-left weightWidth optionMargin">' +
        '<input type="text" class="questionWeight inputBorder" name="weight" placeholder="Weight">' +
        '<div class="errorMargin"><label class="alignLeft errorText weightFont">Please Enter Appropriate Weight</label></div></div>');


    });
    $(document).on('click', '#addDataListOption', function () {

        $(this).before('<div class="delete-option place-left" id="deleteOption"><span class="ms-Icon ms-Icon--minus"></span></div><div class="input-control text alignLeft">' +
          ' <input type="text" placeholder="Field title" class="questionOption inputBorder" name="questionName"><label class="alignLeft errorText">Please Enter Option</label></div>'
          );

    });
    $(document).on('click', 'li .addQuest', function (e) {
        e.stopImmediatePropagation();
        $('a.toggle').prop('disabled', true);
        $('a.toggle').addClass('disableHeader');
        $(this).parent().parent().parent().parent().parent().parent().children().removeClass('disableHeader');
        var dialog = $('#spinnerDialog').data('dialog');

        var pageTarget = $(this).closest('ul.inner').parent().prev();
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
            dialog.open();
            questOptArr = [];
            $('.saveQuestions').attr('disabled', true);
            $('.previewQuestions').attr('disabled', true);
            $('.submitQuestions').attr('disabled', true);
            $('.newPageCreate').addClass('disablePage')
            var that = $(this);
            $(this).closest('ul.inner').parent().prev().slideUp(150, function () {
                $(that).closest('ul.inner').append('<div href="javascript:void(0);" class="addNewQuest disablePage border_tp">New Question</div>');
                setTimeout(function () {

                    $(that).closest('div.inner').append(quest);
                    dialog.close();
                }, 3000);


                var title = 'Page ' + ($(this).parents('ul.inner').parent().index() + 1) + ' - ' + $(that).closest('ul.inner').parent().prev().find('.pageTitle').val();
                $(that).parents('ul.inner').siblings('.pageTxt').text(title);
                $(that).parent().css({ 'opacity': 0.5, 'pointer-events': 'none' });

            });

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
            }, 5000);

        }
    });
    $(document).on('click', 'li .addQuest1', function (e) {
        e.stopImmediatePropagation();
        $('a.toggle').prop('disabled', true);
        $('a.toggle').addClass('disableHeader');
        $(this).parent().parent().parent().parent().parent().parent().children().removeClass('disableHeader');
        $('.previewQuestions').attr('disabled', true);
        $('.submitQuestions').attr('disabled', true);
        $('.saveQuestions').attr('disabled', true);
        $('.newPageCreate').addClass('disablePage')
        $('.newChildQustLink').addClass('disablePage');


        $(this).closest('ul.inner').append('<div href="javascript:void(0);" class="addNewQuest disablePage border_tp">New Question</div>');
        $(this).closest('div.inner').append(quest);

        $(this).parent().css({ 'opacity': 0.5, 'pointer-events': 'none' });


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
    });
    $(document).on('click', '.delete-option', function () {
        $(this).prev().remove();
        if ($(this).prev().hasClass('input-control'))
            $(this).prev().remove();
        $(this).remove();
    });
    $(document).on('click', '.childQuestCheckBox, .editChildBox', function () {
        if ($(this).prop('checked') == false) {
            $(this).closest('div.inner').find('.answerTo').removeClass('disablePage');
        } else {
            $(this).closest('div.inner').find('.answerTo').addClass('disablePage');
        }
    })
    $(document).on('click', '.editNewQuestion', function () {

        var addQuest;
        $('.previewQuestions').attr('disabled', true);
        $('.submitQuestions').attr('disabled', true);
        $('.saveQuestions').attr('disabled', true);
        $('.newChildQustLink').addClass('disablePage');

        $('.editNewChildQuestion').addClass('disablePage');
        $('.newPageCreate').addClass('disablePage');
        $('a.toggle').prop('disabled', true);
        $('a.toggle').addClass('disableHeader');
        $('.editNewQuestion').addClass('disablePage');

        $('.addNewQuest').addClass('disablePage');

        $(this).removeClass('disableHeader');
        if ($(this).siblings('ul.inner').children('li').length == 1) {
            addQuest = "addQuest place-left";
        } else {
            addQuest = "addQuest1 place-left";
        }
        $(this).siblings('ul.inner').
            append('<li><a class="toggle downArrowPng" href="javascript:void(0);">New Question</a><ul class="inner"><li><form><div class="inner"><div><span class="place-left">Search questions or&nbsp;</span><span class="' + addQuest + '">add a new one</span><div class="tab-group-content alignLeft search_input margin10 no-margin-left"><div class="input-control text no-margin"><input type="text" class="textInput inputSearchQuestion" name="inputSearchQuestion"><button class="button search_btn questionSearchButton"><span class="mif-search"></span></button> </div> </div> </div> </div></form></li></ul></li>');
        $(this).remove();
    })

    var childOptions = '';
    $(document).on('click', '.editNewChildQuestion', function () {
        childOptions = '';
        var parentId = $(this).closest('ul.inner').find('.questionHidden').val();
        var that = this;
        var questSpinnerdialog = $('#spinnerDialog').data('dialog');
        questSpinnerdialog.open();
        var ansOptions = '';
        $.ajax({
            url: 'api/question/GetParentOptions?parentQuestionVersionId=' + parentId,
            type: 'GET',
            success: function (data) {
                $.each(data, function (i, val) {
                    childOptions = childOptions + '<option>' + val.OptionText + '</option>';

                });
                if (data[0].OptionText == "" || data[0].OptionText == "ISREQUIRED") {
                    ansOptions='<label class="input-control checkbox alignLeft"><input type="checkbox" class="childQuestCheckBox" disabled checked   name="childQuestionRequired"><span class="check inputBorder"></span><span class="caption">&nbsp;Required</span></label>' ;
                }
                else {
                    ansOptions = '<label class="input-control checkbox alignLeft"><input type="checkbox" class="childQuestCheckBox" name="childQuestionRequired"><span class="check inputBorder"></span><span class="caption">&nbsp;Required</span></label>' +
                                '<div class="answerTo"><label class="alignLeft marginForAnsText">Answer to parent question</label>' +
                                '<div class="input-control margin10 no-margin-left no-margin-right no-margin-top alignLeft widthSelector" data-role="select">' +
                                 '<select id="select" class="equality">' +
                                    '<option>is equal</option><option>is not equal</option>' +
                                 '</select></div>' +
                                 '<div class="input-control margin10 no-margin-right no-margin-top place-left widthSelector marginForOptions" data-role="select">' +
                                 'to&nbsp' + '<select id="select" class = "optionClass">' + childOptions + '</select>' +
                                    '</div></div>';
}
                childNewQuest = '<li class="createChildQuestions ">' +
            '<a class="toggle downArrowPng" href="javascript:void(0);">New Child Question</a>' +
            '<form><div class="inner">' +
           ansOptions+
            '<div class="searchBarQuest"><span class="place-left">Search questions or&nbsp</span><span class="addChildQuest place-left">add a new one</span>' +
            '<div class="tab-group-content alignLeft search_input margin10 no-margin-left">' +
            '<div class="input-control text no-margin">' +
            '<input type="text" class="textInput inputSearchQuestion" name="inputSearchQuestion">' +
            '<button class="button search_btn childQuestionSearchButton"><span class="mif-search"></span>' +
            '</button> </div> </div> </div>' +
           '</li>';
                $(that).closest('ul.inner').append(childNewQuest);
                $('a.toggle').prop('disabled', true);
                $('a.toggle').addClass('disableHeader');
                $(that).closest('ul.inner').find('.createChildQuestions ').find('a').removeClass('disableHeader');

               $(that).remove();
                questSpinnerdialog.close();
                $('.previewQuestions').attr('disabled', true);
                $('.submitQuestions').attr('disabled', true);
                $('.saveQuestions').attr('disabled', true);

                $('.editNewChildQuestion').addClass('disablePage');
                $('.newPageCreate').addClass('disablePage');
                $('.editNewQuestion').addClass('disablePage');
                $(that).removeClass('disablePage');

                $('.newChildQustLink').addClass('disablePage');

            }
        });

    })
    $(document).on('focus', '.inputSearchQuestion ', function () {

        $(this).closest('.tab-group-content').find('.errMsg').hide();

    });

    $(document).on('keyup', "input[type='text']", function (e) {
        if (e.which !== 9) {
            if (($(this).attr('class').indexOf('inputSearchQuestion') < 0) && ($(this).attr('class').indexOf('searchDataTab') < 0)) {

                if ($(this).val()) {
                    if ($(this).hasClass('error')) {
                        $(this).removeClass('error');
                        $(this).next().find('label').hide();
                    }
                } else {
                    $(this).addClass('error');
                    $(this).next().find('label').show();
                }

            }
        }
    });

    $(document).on('keyup', '.questionWeight', function (e) {
        if (e.which !== 9) {
            if ($(this).val() != "" && isNaN($(this).val()) == false) {
                if ($(this).hasClass('error')) {
                    $(this).removeClass('error');
                    $(this).next().find('label').hide();
                }
            } else {
                $(this).addClass('error');
                $(this).next().find('label').show();
            }
        }
    });


    $(document).on('click', '.newChildQustLink', function () {
        $(this).prev().show();
        $('a.toggle').prop('disabled', true);
        $('a.toggle').addClass('disableHeader');
        $(this).prev().children().removeClass('disableHeader');
        $(this).remove();


        $('.newPageCreate').addClass('disablePage');
        $('.editNewQuestion').addClass('disablePage');

        $('.editNewChildQuestion').addClass('disablePage');
        $('.addNewQuest').addClass('disablePage');

        $('.previewQuestions').attr('disabled', true);
        $('.submitQuestions').attr('disabled', true);
        $('.saveQuestions').attr('disabled', true);

        $('.newChildQustLink').addClass('disablePage');
        $(this).removeClass('disablePage');


    });
    $(document).on('click', '.createPageDone', function (e) {
        e.preventDefault();

        if ($(this).closest('ul.inner').find('.pageHidden').val() == "") {
            var questSpinnerdialog = $('#spinnerDialog').data('dialog');
            questSpinnerdialog.open();
            var that = this;
            var selector = $(that).closest('ul.inner').parent();
            var locationSearchId = window.location.hash.split("=");
            var pageDetails = {
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
                sectionOrder: selector.index() + 1,
                questionnaireVersionId: locationSearchId[1],
                pageTitle: selector.find('.pageTitle').val(),
                pageIntro: selector.find('.txtAreaWidth').val(),
                languageId: "192C79DD-B246-4BF2-B297-A36338981F99",
                displayOrder: null,
                parentQuestionVersionId: null,

                questionOptionsArray: null,
                questionWeightsArray: null,
                questionOptionAndWeight: null,
                answerTypeId: null,
                questionConditionArray: null
            }
            $.ajax({
                url: 'api/question/SavePageWithNoQuestionIntoQuestionnaire',
                type: 'POST',
                data: JSON.stringify(pageDetails),
                contentType: "application/json",
                dataType: "json",
                success: function (data) {
                    $(that).closest('ul.inner').find('.pageHidden').val(data);
                    questSpinnerdialog.close();
                    if (selector.find('.editPageTxt').children('.deletePage').length !== 0) {
                        selector.find('.editPageTxt').text('Page ' + (selector.index() + 1) + '-' + selector.find('.pageTitle').val());
                    } else {
                        selector.find('.editPageTxt').text('Page ' + (selector.index() + 1) + '-' + selector.find('.pageTitle').val());
                        selector.find('.editPageTxt').append('<span class="ms-Icon ms-Icon--trash place-right deletePage" onclick="showDialogDeletePage(event)"></span>');

                    }
                    toggleArrow(selector.find('.editPageTxt'));
                    $('a.toggle').prop('disabled', false);
                    $('a.toggle').removeClass('disableHeader');
                    $('.editNewQuestion').removeClass('disablePage');
                    $('.previewQuestions').attr('disabled', false);
                    $('.submitQuestions').attr('disabled', false);
                    $('.saveQuestions').attr('disabled', false);
                    $('.newPageCreate').removeClass('disablePage');
                    $('.newChildQustLink').removeClass('disablePage');
                    $('.editNewChildQuestion').removeClass('disablePage');
                    $('.addNewQuest').removeClass('disablePage');






                    $(that).closest('li').hide();
                },
                    error: function (data) {
                        var questSpinnerdialog = $('#spinnerDialog').data('dialog');
                        questSpinnerdialog.close();
                        window.alert("Error occured while creating the page. Please try again.");
                    }
            })

        }
        else {
            var quest_Spinnerdialog = $('#spinnerDialog').data('dialog');
            quest_Spinnerdialog.open();
            var that = this;
            var selectorPage = $(that).closest('ul.inner').parent();
            var page_Details = {
                questionnaireVersionSectionId: $(this).closest('ul.inner').find('.pageHidden').val(),
                pageTitle: selectorPage.find('.pageTitle').val(),
                pageIntro: selectorPage.find('.txtAreaWidth').val(),
                languageId: "192C79DD-B246-4BF2-B297-A36338981F99"

            }
            $.ajax({
                url: 'api/question/UpdateQuestionPage',
                type: 'PUT',
                data: JSON.stringify(page_Details),
                contentType: "application/json",
                dataType: "json",
                success: function (data) {

                }
            });

            setTimeout(function () {

                if (selectorPage.find('.editPageTxt').children('.deletePage').length == 0) {
                    selectorPage.find('.editPageTxt').text('Page ' + (selectorPage.index() + 1) + '-' + selectorPage.find('.pageTitle').val());
                } else {
                    selectorPage.find('.editPageTxt').text('Page ' + (selectorPage.index() + 1) + '-' + selectorPage.find('.pageTitle').val());
                    selectorPage.find('.editPageTxt').append('<span class="ms-Icon ms-Icon--trash place-right deletePage" onclick="showDialogDeletePage(event)"></span>');

                }
                toggleArrow(selectorPage.find('.editPageTxt'));
                $('a.toggle').prop('disabled', false);
                $('a.toggle').removeClass('disableHeader');
                $('.editNewQuestion').removeClass('disablePage');
                $('.previewQuestions').attr('disabled', false);
                $('.submitQuestions').attr('disabled', false);
                $('.saveQuestions').attr('disabled', false);
                $('.newPageCreate').removeClass('disablePage');
                $('.newChildQustLink').removeClass('disablePage');
                $('.editNewChildQuestion').removeClass('disablePage');
                $('.addNewQuest').removeClass('disablePage');







                $(that).closest('li').hide();
                quest_Spinnerdialog.close();
            }, 500);


        }
    });
    $(document).on('click', ".createPageCancel", function (e) {
        e.preventDefault();
        e.stopPropagation();
        var selectorPage = $(this).closest('ul.inner').parent();
        if ($(this).closest('ul.inner').find('.pageHidden').val() == "") {

            selectorPage.remove();

        }
        else {

}

        $('.newPageCreate').removeClass('disablePage');

        toggleArrow($(this).closest('ul.inner').parent().find('.editPageTxt'));
        $(this).closest('li').hide();
        $('a.toggle').prop('disabled', false);
        $('a.toggle').removeClass('disableHeader');

        $('.editNewQuestion').removeClass('disablePage');
        $('.previewQuestions').attr('disabled', false);
        $('.submitQuestions').attr('disabled', false);
        $('.saveQuestions').attr('disabled', false);

        $('.editNewChildQuestion').removeClass('disablePage');
        $('.newChildQustLink').removeClass('disablePage');

        $('.addNewQuest').removeClass('disablePage');




    });

});
