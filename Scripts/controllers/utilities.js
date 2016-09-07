var pageNodeIndex, pageId, dialog;
function showDialogDeletePage(e) {
    e.stopPropagation();

    dialog = $("#dialogPageDelete").data('dialog');
    pageNodeIndex = $(e.target).closest('li').index();
    pageId = $(e.target).closest('li').find('.pageHidden').val();
    dialog.open();
}

function pageDeleteConfirmFunc(e) {
    e.stopPropagation();
    var questSpinnerdialog = $('#spinnerDialog').data('dialog');
    questSpinnerdialog.open();
    var that = this;
    $.ajax({
        url: 'api/question/DeleteQuestionsByPageId?id=' + pageId,
        type: 'DELETE',
        success: function (result) {
            questSpinnerdialog.close();
            $('ul.accordion>li:eq(' + pageNodeIndex + ')').remove();
            $('ul.accordion>li').each(function (key, val) {
                var pageTxt = $(this).children('a.editPageTxt').text().trim().toString();
                pageTxt = pageTxt.substr(6, pageTxt.length);
                $(this).find('.editPageTxt').text('page ' + (key + 1) + pageTxt);

                $(this).find('.editPageTxt').append('<span class="ms-Icon ms-Icon--trash place-right deletePage" onclick="showDialogDeletePage(event)"></span>');
            });
            dialog.close();
        }
    });



}
function hideMetroDialog(e) {
    e.stopPropagation();
    dialog.close();
}
function hideMetroDialogDiv(el) {
    var dialog = $(el), dialog_obj;
    if (dialog.length == 0) {
        console.log('Dialog ' + el + ' not found!');
        return false;
    }

    dialog_obj = dialog.data('dialog');
    if (dialog_obj == undefined) {
        console.log('Element not contain role dialog! Please add attribute data-role="dialog" to element ' + el);
        return false;
    }

    dialog_obj.close();
}
function destroyWizard(id) {
    if ($(id).wizard())
        $(id).wizard("destroy");
    $(id).hide();
    $(".previewHeadingRight").attr("style", "display: none !important");
    $(".previewBye").hide();
    $(".previewWelcome").show();
}
function toggleArrow(element) {
    if (element.hasClass('downArrowPng')) {

        element.removeClass('downArrowPng');
        element.addClass('rightArrowPng');
    } else {

        element.removeClass('rightArrowPng');
        element.addClass('downArrowPng');
    }
}


function editChildQuestionDeleteConfirmFunc(e) {

    e.stopPropagation();
    var locationSearchId = window.location.hash.split("=");

    var questSpinnerdialog = $('#spinnerDialog').data('dialog');
    questSpinnerdialog.open();
    $.ajax({
        url: 'api/question/DeleteQuestion?questionVersionId=' + childquestIdToDelete + '&questionnaireVersionId=' + locationSearchId[1],
        type: 'PUT',
        success: function (data) {
            questSpinnerdialog.close();
            $(editChildQuestionNode).closest('li').remove();
            $('ul.accordion>li').each(function (key, val) {
                $(this).children('ul.inner').children('li').each(function (k, v) {
                    if (k > 0) {

                        $(this).children('ul.inner').children('li').each(function (i, cv) {
                            if (i > 0) {
                                var childQuestTxt = $(this).children('a.toggle ').text().trim().toString();
                                childQuestTxt = childQuestTxt.substr(3, childQuestTxt.length);
                                $(this).children('a.toggle ').text($(this).closest('ul.inner').parent().index() - 1 + '.' + $(this).index() + childQuestTxt);
                                $(this).children('a.toggle ').append('<span class="ms-Icon ms-Icon--trash place-right editDeleteChildQuestIcon"></span>');
                            }
                        });
                    }
                });
            });
            var editChildQuestionDialog = $("#dialogEditChildQuestionDelete").data('dialog');

            editChildQuestionDialog.close();
        }
        });
    }

function childQuestionDeleteConfirmFunc(e) {
    e.stopPropagation();
    var locationSearchId = window.location.hash.split("=");
var questSpinnerdialog = $('#spinnerDialog').data('dialog');
    questSpinnerdialog.open();
    $.ajax({
        url: 'api/question/DeleteQuestion?questionVersionId=' + child_To_Delete + '&questionnaireVersionId=' + locationSearchId[1],
        type: 'PUT',
        success: function (data) {


            questSpinnerdialog.close();

            $(createChildQuestionNode).closest('li').remove();
            $('ul.accordion>li').each(function (key, val) {
                if ($(this).children('ul.inner').children('li:eq(0)').is(':hidden')) {

                    $(this).children('ul.inner').children('li').each(function (k, v) {
                        if (k > 0) {

                            $(this).children('ul.inner').children('li').each(function (i, cv) {

                                if (i > 0) {


                                    if ($(this).find('div.inner').find('.childQuestBlock').css('display') == 'block') {

                                        var questval = $(this).find('div.inner').find('.childQuestionName').val();

                                        $(this).children('a.toggle ').text(($(this).closest('ul.inner').parent().index() - 1) + '.' + ($(this).find('div.inner').parent().parent().prev().index() + 1) + ' ' + questval);
                                        $(this).children('a.toggle ').append('<span class="ms-Icon ms-Icon--trash place-right deleteChildQuestIcon"></span>');
                                        $(this).find('div.inner').hide();
                                    }
                                }
                            });
                        }
                    });
                }
            });
            var createChildQuestionDialog = $("#dialogChildQuestionDelete").data('dialog');

            createChildQuestionDialog.close();
        }
    });
}

function editQuestionDeleteConfirmFunc(e) {
    e.stopPropagation();
    var locationSearchId = window.location.hash.split("=");
    var questSpinnerdialog = $('#spinnerDialog').data('dialog');
    questSpinnerdialog.open();
    $.ajax({
        url: 'api/question/DeleteQuestion?questionVersionId=' + questIdToDelete + '&questionnaireVersionId=' + locationSearchId[1],
        type: 'PUT',
        success: function (data) {

            questSpinnerdialog.close();


            $(editQuestionNode).closest('li').remove();


            $('ul.accordion>li').each(function (key, val) {
                $(this).children('ul.inner').children('li').each(function (k, v) {
                    if (k > 0) {
                        var questTxt = $(this).children('a.toggle ').text().trim().toString();
                        questTxt = questTxt.substr(1, questTxt.length);
                        $(this).children('a.toggle ').text(($(this).index() - 1) + ' ' + questTxt);
                        $(this).children('a.toggle ').append('<span class="ms-Icon ms-Icon--trash place-right editDeleteIcon"></span>');
                        $(this).children('ul.inner').children('li').each(function (i, cv) {
                            if (i > 0) {
                                var childQuestTxt = $(this).children('a.toggle ').text().trim().toString();
                                childQuestTxt = childQuestTxt.substr(1, childQuestTxt.length);
                                $(this).children('a.toggle ').text(($(this).closest('ul.inner').parent().index() - 1) + childQuestTxt);
                                $(this).children('a.toggle ').append('<span class="ms-Icon ms-Icon--trash place-right editDeleteChildQuestIcon"></span>');
                            }
                        });
                    }
                });
            });


            var editQuestionDialog = $("#dialogEditQuestionDelete").data('dialog');

            editQuestionDialog.close();

        }
        });




}
function questionDeleteConfirmFunc(e) {
    e.stopPropagation();
    var locationSearchId = window.location.hash.split("=");
    var questSpinnerdialog = $('#spinnerDialog').data('dialog');
    questSpinnerdialog.open();
    $.ajax({
        url: 'api/question/DeleteQuestion?questionVersionId=' + idToDelete + '&questionnaireVersionId=' + locationSearchId[1],
        type: 'PUT',
        success: function (data) {




            questSpinnerdialog.close();
            $(createQuestionNode).closest('li').remove();

            $('ul.accordion>li').each(function (key, val) {





                if ($(this).children('ul.inner').children('li:eq(0)').is(':hidden')) {


                    if ($(this).children('ul.inner').children('li').length == 1) {
                        $(this).children('ul.inner').append(newQuest);
                    } else {




                        $(this).children('ul.inner').children('li').each(function (k, v) {
                            if (k > 0) {

                                if ($(this).find('ul.inner').find('input[type="text"].questionName').length > 0) {
                                    $(this).children('a.toggle ').text(($(this).index() - 1) + '-' + $(this).find('ul.inner').find('input[type="text"].questionName').val())
                                    $(this).children('a.toggle ').append('<span class="ms-Icon ms-Icon--trash place-right deleteIcon"></span>');
                                    $(this).children('ul.inner').hide();
                                    $(this).children('ul.inner').children('li').each(function (i, cv) {

                                        if (i > 0) {
                                            if ($(this).find('div.inner').find('input[type="text"].childQuestionName').length > 0) {
                                                var questval = $(this).find('div.inner').find('.childQuestionName').val();

                                                $(this).children('a.toggle ').text(($(this).closest('ul.inner').parent().index() - 1) + '.' + ($(this).find('div.inner').parent().parent().prev().index() + 1) + ' ' + questval);
                                                $(this).children('a.toggle ').append('<span class="ms-Icon ms-Icon--trash place-right deleteChildQuestIcon"></span>');
                                                $(this).find('div.inner').hide();
                                            }
                                        }
                                    });
                                }

                            }

                        });
                    }
                }
                else {
                    $(this).children('ul.inner').children('li').each(function (k, v) {
                        if (k == 0) {
                            $(this).hide();
                        }

                    });
                }
            });


            var createQuestionDialog = $("#dialogQuestionDelete").data('dialog');

            createQuestionDialog.close();

        }


    });
}
function hideMetroQuestionDialog(e) {
    e.preventDefault();
    var createQuestionDialog = $("#dialogQuestionDelete").data('dialog');

    createQuestionDialog.close();

}

function hideMetroEditQuestionDialog(e) {
    e.preventDefault();
    var editQuestionDialog = $("#dialogEditQuestionDelete").data('dialog');

    editQuestionDialog.close();
}

function hideMetroEditChildQuestionDialog(e) {
    e.preventDefault();
    var editChildQuestionDialog = $("#dialogEditChildQuestionDelete").data('dialog');

    editChildQuestionDialog.close();
}

function hideMetroChildQuestionDialog(e) {
    e.preventDefault();
    var createChildQuestionDialog = $("#dialogChildQuestionDelete").data('dialog');

            createChildQuestionDialog.close();

}
function stepTwoDataBinding(data) {
    var pageQuestData = data;
    var pageNo = 0, questNo = 0;
    var questSpinnerdialog = $('#spinnerDialog').data('dialog');
   
    setTimeout(function () {
        $('ul.accordion').html('');
        var page, quest, childQuest, displayOrder;
        var questDisp = '';
        var childText = '';
        
        var arr = [];
        $.each(pageQuestData, function (i, val) {
            if(i>0){
                if ((val.QuestionText == "Blank Question Text") && (pageQuestData[i - 1]['DisplayOrder'] == val.DisplayOrder) && (pageQuestData[i - 1]['QuestionText'] !== "Blank Question Text")) {
                    arr.push(i);
                }
        }

        });
        $.each(arr.reverse(), function (i, val) {
            pageQuestData.splice(val, 1);
        });
$.each(pageQuestData, function (i, val) {
    if (i == pageQuestData.length - 1) {
        pageQuestData[i]['flag'] = "true";
            }
            if (val.DisplayOrder % 1 == 0) {
                if (i > 0) {
               
                            pageQuestData[i - 1]['flag'] = "true";
               


        }
            }

        });
        $.each(pageQuestData, function (i, val) {
            childText = '';
            displayOrder = (val.DisplayOrder).toString();
            questDisp = '';
            if (val.QuestionText != "Blank Question Text") {
                if (pageQuestData[i].flag == "true") {
                    questDisp = '<li>' +
                 '<a class="toggle editQuestionTxt rightArrowPng" href="javascript:void(0);">' + val.DisplayOrder + ' ' + val.QuestionText + '<span class="ms-Icon ms-Icon--trash place-right editDeleteIcon"></span></a>' +
                 '<ul class="inner">' +
                '<li style="display:none;"> <form>' +
                '<input type="hidden" class="questionHidden" value="' + val.QuestionVersionId + '">' +
                   '<div class="inner ">' +

                  '</div>' +
                 '</form>' +

                  '</li>' +
                    '<div class="editNewChildQuestion">New Child Question</div>' +
                  '</ul>' +
                                          
                 '</li>'
                } else {
                    questDisp = '<li>' +
                 '<a class="toggle editQuestionTxt rightArrowPng" href="javascript:void(0);">' + val.DisplayOrder + ' ' + val.QuestionText + '<span class="ms-Icon ms-Icon--trash place-right editDeleteIcon"></span></a>' +
                 '<ul class="inner">' +
                '<li style="display:none;"> <form>' +
                '<input type="hidden" class="questionHidden" value="' + val.QuestionVersionId + '">' +
                   '<div class="inner ">' +

              '</div>' +
             '</form>' +

              '</li>' +
              '</ul>' +
             '</li>'
                }
            }
            else {
                questDisp = '';
            }
            if (val.SectionOrder != pageNo) {
                                        
                                        
                pageNo = val.SectionOrder;
                questNo = (val.DisplayOrder).toString();
                page = '<li>' +
                 '<a class="toggle editPageTxt editingPage rightArrowPng" href="javascript:void(0);">Page ' + val.SectionOrder + '-' + val.PageTitle + '<span class="ms-Icon ms-Icon--trash place-right deletePage"  onclick="showDialogDeletePage(event)"></span></a>' +
                 '<ul class="inner">' +
                 '<input type="hidden" class="pageHidden" value="' + val.PageId + '">' +
                 '<li style="display:none;">' +
                    '<form>' +
                         '<div class="inner">' +
                         '<label class="alignLeft">Title</label>' +
    '<div class="input-control text alignLeft">' +
        '<input type="text" class="editPageTitle inputBorder fieldWidth pageTitle" name="editPageTitle" value="' + val.PageTitle + '">' +
        '<div class="errorMargin">' +
            '<label class="alignLeft errorText">Please Enter Page Title</label>' +
        '</div>' +
    '</div>' +
    '<label class="alignLeft top_Margin">Introduction</label>' +
    '<div class="input-control textarea alignLeft">' +
       '<textarea id="page_Intro" class="txtAreaWidth inputBorder" name="editPageIntroduction">' + val.PageIntro + '</textarea>' +
       '<span id="errorPageIntro" class="error_Message marginNone">Please Enter Page Introduction</span>' +
    '</div>' +
    '<div class="buttonDoneCancel alignLeft"><div class="pageDone actionButtonDone"><img src="/images/generic-tick-small-accent@2x.png">&nbsp;Done</div><div class="pageCancel actionButtonCancel margin80"><img src="/images/generic-cross-12px-accent@2x.png">&nbsp;Cancel</div></div>' +


                  '</div>' +
                 '</form>' +
                  '</li>' +
                     questDisp +
                     '</ul>' +
                     '<div class="editNewQuestion">New Question</div>' +
                 '</li>';
                $('ul.accordion').append(page);
            } else if ((displayOrder.indexOf('.')) <= 0) {
                if (val.QuestionText != "Blank Question Text") {
                    questNo = (val.DisplayOrder).toString();
                    if (pageQuestData[i].flag == "true") {
                        $('ul.accordion>li:eq(' + (val.SectionOrder - 1) + ')').children('ul.inner').append('<li><a class="toggle editQuestionTxt rightArrowPng" href="javascript:void(0);">' + val.DisplayOrder + ' ' + val.QuestionText + '<span class="ms-Icon ms-Icon--trash place-right editDeleteIcon"></span></a><ul class="inner"><li style="display:none;"><form><input type="hidden" class="questionHidden" value="' + val.QuestionVersionId + '"><div class="inner"></div></form></li><div class="editNewChildQuestion">New Child Question</div></ul></li>');
                    } else {
                        $('ul.accordion>li:eq(' + (val.SectionOrder - 1) + ')').children('ul.inner').append('<li><a class="toggle editQuestionTxt rightArrowPng" href="javascript:void(0);">' + val.DisplayOrder + ' ' + val.QuestionText + '<span class="ms-Icon ms-Icon--trash place-right editDeleteIcon"></span></a><ul class="inner"><li style="display:none;"><form><input type="hidden" class="questionHidden" value="' + val.QuestionVersionId + '"><div class="inner"></div></form></li></ul></li>');
                    }
                }
            } else {

                if (pageQuestData[i].flag == "true") {
                    childText = '<div class="editNewQuestion">New Child Question</div>'
                    $('ul.accordion>li:eq(' + (val.SectionOrder - 1) + ')')
                .children('ul.inner').children('li:eq(' + questNo + ')').children('ul.inner')
                .append('<li><a class="toggle editChildQuestTxt rightArrowPng" href="javascript:void(0);">' + val.DisplayOrder + ' ' + val.QuestionText + '<span class="ms-Icon ms-Icon--trash place-right editDeleteChildQuestIcon"></span></a><form><input type="hidden" class="childQuestionHidden" value="' + val.QuestionVersionId + '""><div class="inner" style="display:none;"></div></form>' + '<div class="editNewChildQuestion">New Child Question</div>' + '</li>');
                }
                else {
                    $('ul.accordion>li:eq(' + (val.SectionOrder - 1) + ')')
                    .children('ul.inner').children('li:eq(' + questNo + ')').children('ul.inner')
                    .append('<li><a class="toggle editChildQuestTxt rightArrowPng" href="javascript:void(0);">' + val.DisplayOrder + ' ' + val.QuestionText + '<span class="ms-Icon ms-Icon--trash place-right editDeleteChildQuestIcon"></span></a><form><input type="hidden" class="childQuestionHidden" value="' + val.QuestionVersionId + '""><div class="inner" style="display:none;"></div></form>' + childText + '</li>');
                }


            }

        })
        questSpinnerdialog.close();

    }, 5000);
}