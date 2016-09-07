$(document).ready(function () {
    $('#notifyMe').tagsInput({ width: 'auto' });
    $('#firstName').on('input', fnValidateFirstName);
    $('#lastName').on('input', fnValidateLastName);
    $('#emailId').on('input', fnValidateEmailError);
    $('#streetAddress').on('keypress', fnValidateAddressError);
    $('#city').on('keyupress', fnValidateAddressError);
    $('#state').on('keyupress', fnValidateAddressError);
    $('#zip').on('keyupress', fnValidateAddressError);
    $('#companyName').on('input', fnValidateCompanyError);
    $('#companyStreetAddress').on('keyupress', fnValidateCompanyAddressError);
    $('#companyCity').on('keyupress', fnValidateCompanyAddressError);
    $('#companyState').on('keyupress', fnValidateCompanyAddressError);
    $('#companyZip').on('keyupress', fnValidateCompanyAddressError);
    $('#countryCode').on('input', fnRemoveCountryCodeErrorClass);
    $('#companyWebsite').on('input', fnRemoveCompanyWebSiteErrorClass);
    $('#companyEnglishName').on('input', fnRemoveCompanyEnglishNameErrorClass);
    $("#companyPhone").on('input', fnRemoveCompanyPhoneErrorClass);
    $('#countryCode').on('input', fnRemoveCompanyCodeErrorClass);
    $("#personalPhone").on('input', fnRemovePersonalPhoneErrorClass);
    $('#personalCountryCode').on('input', fnRemovePersonalCodeErrorClass);
});

function fnRemovePersonalPhoneErrorClass() {
    $("#personalPhone").removeClass("error").addClass("valid");
    $('#errorValidPhoneNumber').css('display', 'none');
    $('#errorvalidPhoneNumber10').css('display', 'none');
}
function fnRemovePersonalCodeErrorClass() {
    $("#personalCountryCode").removeClass("error").addClass("valid");
    $('#errorValidPhoneNumber').css('display', 'none');
    $('#errorvalidPhoneNumber10').css('display', 'none');
}
function fnRemoveCompanyPhoneErrorClass() {
    $("#companyPhone").removeClass("error").addClass("valid");
    $('#errorValidCompanyContact').css('display', 'none');
    $('#errorValidCompanyContact10').css('display', 'none');
}
function fnRemoveCompanyCodeErrorClass() {
    $('#countryCode').removeClass("error").addClass("valid");
    $('#errorValidCompanyContact').css('display', 'none');
    $('#errorValidCompanyContact10').css('display', 'none');
}

function fnRemoveCompanyWebSiteErrorClass() {
    $('#companyWebsite').removeClass("error").addClass("valid");
    $('#errorWebsite').css('display', 'none');
    $('#errorRequiredWebsite').css('display', 'none');
}
function fnRemoveCompanyEnglishNameErrorClass() {
    $('#companyEnglishName').removeClass("error").addClass("valid");
    $('#errorCompanyEnglishName').css('display', 'none');
}
function fnRemoveCountryCodeErrorClass() {
    $('#countryCode').removeClass("error").addClass("valid");
    $('#errorValidCompanyContact').css('display', 'none');
    $('#errorValidCompanyContact10').css('display', 'none');
}
function fnRemoveCountryPhoneErrorClass() {
    $('#companyPhone').removeClass("error").addClass("valid");
    $('#errorValidCompanyContact').css('display', 'none');
    $('#errorValidCompanyContact10').css('display', 'none');
}
function fnRemovePersonalCountryCodeErrorClass() {
    $('#personalCountryCode').removeClass("error").addClass("valid");
    $('#errorValidPhoneNumber').css('display', 'none');
    $('#errorvalidPhoneNumber10').css('display', 'none');
}
function fnRemovePersonalCountryPhoneErrorClass() {
    $('#personalPhone').removeClass("error").addClass("valid");
    $('#errorValidPhoneNumber').css('display', 'none');
    $('#errorvalidPhoneNumber10').css('display', 'none');
}
function fnRemoveWebsiteErrorClass() {
    $("#companyWebsite").removeClass("error").addClass("valid");
    $("#errorWebsite").css('display', 'none');
}
 
function fnValidateCompanyAddressError(e) {
    if (e.char !== "\t")
        {
            var input = $(this);
            var isFirstName = $.trim(input.val());
            if (isFirstName) {
                input.removeClass("error").addClass("valid");
                $('#errorCompnayAddress').css('display', 'none');
            }
            else {
                input.removeClass("valid").addClass("error");
                $('#errorCompnayAddress').css('display', 'inline-block');
            }
    }
}
function fnValidateCompanyError(e) {
    if (e.char !== "\t") {
        var input = $(this);
        var isFirstName = $.trim(input.val());
        if (isFirstName) {
            input.removeClass("error").addClass("valid");
            $('#errorCompany').css('display', 'none');
        } else {
            input.removeClass("valid").addClass("error");
            $('#errorCompany').css('display', 'inline-block');
        }
    }
}

function fnValidateAddressError(e) {
    if (e.char !== "\t") {
        var input = $(this);
        var isFirstName = $.trim(input.val());
        if (isFirstName) {
            input.removeClass("error").addClass("valid");
            $('#errorAddress').css('display', 'none');
        } else {
            input.removeClass("valid").addClass("error");
            $('#errorAddress').css('display', 'inline-block');
        }
    }
}
function fnValidateFirstName(e) {
    if (e.char !== "\t") {
        var input = $(this);
        var isFirstName = $.trim(input.val());
        if (isFirstName) {
            input.removeClass("error").addClass("valid");
            $('#errorFirstName').css('display', 'none');
        } else {
            input.removeClass("valid").addClass("error");
            $('#errorFirstName').css('display', 'inline-block');
        }
    }
}
function fnValidateLastName(e) {
    if (e.char !== "\t") {
        var input = $(this);
        var isFirstName = $.trim(input.val());
        if (isFirstName) {
            input.removeClass("error").addClass("valid");
            $('#errorLastName').css('display', 'none');
        } else {
            input.removeClass("valid").addClass("error");
            $('#errorLastName').css('display', 'inline-block');
        }
    }
}
function fnValidateEmailError(e) {
    if (e.char !== "\t") {
        var input = $(this);
        var isFirstName = $.trim(input.val());
        if (isFirstName) {
            input.removeClass("error").addClass("valid");
            $('#errorEmail').css('display', 'none');
        } else {
            input.removeClass("valid").addClass("error");
            $('#errorEmail').css('display', 'inline-block');
        }
    }
}

