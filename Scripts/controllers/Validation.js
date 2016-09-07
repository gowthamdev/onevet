$(document).ready(function () {
    $('#title').on('input', fnValidateQuestionnaireTitle);
 });

function fnValidateQuestionnaireTitle() {
    var input = $(this);
    var isQuestionnaireTitle = $.trim(input.val());
    if (isQuestionnaireTitle) {
        input.removeClass("error").addClass("valid");
        $('#errorTitle').css('display', 'none');
        $('#errorNonEngTitle').css('display', 'none');
    }
    else {
        input.removeClass("valid").addClass("error");
        $('#errorTitle').css('display', 'inline-block');
        $('#errorNonEngTitle').css('display', 'none');
    }
}


    
