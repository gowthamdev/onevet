var workFlowType = "";


var max_Date_Filter = "";
var min_Date_Filter = "";
var searchText = "";

var types = "";
var tenant = "";
var globalWorkFlowScope = {
    updateWorkFlowService: null,
    workFlowService: null,
    questionnairePreviewService: null,
    location: null
};
function fnCloneWorkFlow(workFlowId) {
    fnOpenSpinner();

    var myDataPromise = globalWorkFlowScope.updateWorkFlowService.getData('api/Workflow/CloneWorkflow?id=' + workFlowId.id, "Clone for selected Workflow has been created successfully.", null);
    myDataPromise.then(function (result) {
        fnCloseSpinner();
        setTimeout(function () {
            window.location.reload();
        }, 2000);
        
        
    });
}
function fnRedirectToEditWorkflow(workFlowId, isNew) {

    if (isNew == "true") {

        $.ajax({

            url: 'api/Workflow/UpdateWorkflowIsNewFlag?id=' + workFlowId,
            type: 'PUT',

            contentType: "application/json",
            dataType: "json",
            success: function (data) {


                document.location.href = "#/newWorkflow?id=" + workFlowId;
                window.location.reload();



            }
        })
        return false;
    }
    else {
        document.location.href = "#/newWorkflow?id=" + workFlowId;
        window.location.reload();
    }








   
   
}
function fnFormatWorkFlowActions(data, type, row, index, workFlow) {
    
    if (workFlow === "#myWorkFlow") {
        if (row.IsPublished == false) {
            data = "<a class='ms-Icon ms-Icon--pencil ms-Icon-CustomSize' onclick='fnRedirectToEditWorkflow(\"" + row.Id + "\",\"" + row.IsNew + "\")'></a> <span id=" + row.Id + " class='ms-Icon ms-Icon--trash ms-Icon-Custom-Red' onclick='showDialogWorkflowDelete(this)'></span>";
        }
        else {
            data = ((row.UsebyRequestCount === 0) && (row.IsActive == false)) ? "<a class='ms-Icon ms-Icon--pencil ms-Icon-CustomSize' onclick='fnRedirectToEditWorkflow(\"" + row.Id + "\",\"" + row.IsNew + "\")'></a> <span id=" + row.Id + " class='ms-Icon ms-Icon--trash ms-Icon-Custom-Red' onclick='showDialogWorkflowDelete(this)'></span>" : "<a class='ms-Icon ms-Icon--pencil ms-Icon-CustomSize ms-Icon-Custom-Gray'></a> <span id='" + row.Id + "' class='ms-Icon ms-Icon--trash ms-Icon-Custom-Gray'></span>";
        }
        }
    else {

        if (row.IsPublished == false) {
            data = "<a class='ms-Icon ms-Icon--pencil ms-Icon-CustomSize' onclick='fnRedirectToEditWorkflow(\"" + row.Id + "\",\"" + row.IsNew + "\")'></a>" +
                            "<span id =" + row.Id + " class='ms-Icon ms-Icon--copy ms-Icon-CustomSize' onclick='fnCloneWorkFlow(this)'></span>" +
                            "<span id=" + row.Id + " class='ms-Icon ms-Icon--trash ms-Icon-Custom-Red' onclick='showDialogWorkflowDelete(this)'></span>";
        }



        if ((row.UsebyRequestCount === 0) && (row.IsActive == false)) {
            data = "<a class='ms-Icon ms-Icon--pencil ms-Icon-CustomSize' onclick='fnRedirectToEditWorkflow(\"" + row.Id + "\",\"" + row.IsNew + "\")'></a>" +
                "<span id =" + row.Id + " class='ms-Icon ms-Icon--copy ms-Icon-CustomSize' onclick='fnCloneWorkFlow(this)'></span>" +
                "<span id=" + row.Id + " class='ms-Icon ms-Icon--trash ms-Icon-Custom-Red' onclick='showDialogWorkflowDelete(this)'></span>";
        } else {
            data = "<a class='ms-Icon ms-Icon--pencil ms-Icon-CustomSize ms-Icon-Custom-Gray'></a>" +
                "<span id =" + row.Id + " class='ms-Icon ms-Icon--copy ms-Icon-CustomSize' onclick='fnCloneWorkFlow(this)'></span>" +
                "<span id='" + row.Id + "' class='ms-Icon ms-Icon--trash ms-Icon-Custom-Gray'></span>";

        }
    }
    return data;
}
var workFlowId, dialog;
function showDialogWorkflowDelete(id) {

    dialog = $("#dialogWorkflowDelete").data('dialog');
    workFlowId = id;
    dialog.open();
}
function fnDeleteWorkFlow(id) {
    id = workFlowId;
        fnOpenSpinner();
        var myDataPromise = globalWorkFlowScope.updateWorkFlowService.getData('api/Workflow/DeleteWorkflow?id=' + id.id, "Workflow has been marked as deleted.", id);
}

function PopulateWorkFlowFromServer(workFlow, workFlowService, updateWorkFlowService, questionnairePreviewService, $scope, apiUri,toastr) {
    globalWorkFlowScope.workFlowService = workFlowService;
    globalWorkFlowScope.updateWorkFlowService = updateWorkFlowService;
    globalWorkFlowScope.questionnairePreviewService = questionnairePreviewService;

    $('#workFlowDateModified').html('Date modified');
    $('#datesLabel').html('Date Modified');

    var blnTenantVisible = true;
    var blnActiveAction = true;
    var blnDeletedBy = false;
    var blnModifiedBy = true
    if (workFlow == "#myWorkFlow")
        blnTenantVisible = false;

    if (workFlow == "#deletedWorkFlow") {
        blnActiveAction = false;
        blnDeletedBy = true;
        blnModifiedBy = false;
        $('#workFlowDateModified').html('Date deleted');
        $('#datesLabel').html('Date Deleted');
    }


    $('#workFlowTable').show();

    var otable = $('#workFlowTable').dataTable({
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
                fnPassExternalWorkFlowFilters(data, apiUri);
            },
            "error": function (data) {
                fnCloseSpinner();
                toastr.error('', 'Error occured while trying to retrieve Workflow data. Please try again.');

                
            }
        },
        "aaSorting": [[2, 'desc']],
        "columns": [
            { "data": "Title", "orderable": true },
          
            { "data": "TenantName", "orderable": false },

            { "data": "UsebyRequestCount", "orderable": true },
             { "data": "DateTimeChanged", "orderable": true },
            { "data": "ModifiedBy", "orderable": false },
                        { "data": "ModifiedBy", "orderable": false },

            { "data": "Active", "orderable": false },
            { "data": "Action", "orderable": false }
        ],
        "columnDefs": [
        {
            "targets": [5],
            "visible": blnModifiedBy,
            "searchable": false,
            "width": "20%"
        },
        {
            "targets": [0],
            "searchable": true,
            "width": "20%",
            "render": function (data, type, row) {
                return formatWorkflowName(data, type, row, $scope);
            }
           
        },



        {
            "targets": [2],
            "searchable": true,
            "width": "15%",
            "visible": blnActiveAction
        },




             {
                 "targets": [3],
                 "searchable": true,
                 "width": "20%",
                 "render": function (data, type, row) {
                     return formatData(data, type, row);
                 }
             },
             {

                 "targets": [1],
                 "visible": blnTenantVisible,
                 "searchable": false,
                 "width": "25%"
             },
             {
                 "targets": [4],
                 "searchable": true,
                 "width": "15%",
                 "visible": blnDeletedBy
             },
             
             {
                 "targets": [6],
                 "searchable": true,
                 "width": "15%",
                 "visible": blnActiveAction,
                 "render": function (data, type, row) {
                     return fnFormatWorkFlowActive(data, TypeError, row);
                 }
                 

             },
             {
                 "targets": [7],
                 "searchable": true,
                 "width": "15%",
                 "visible": blnActiveAction,
                 "render": function (data, type, row, index) {
                     return fnFormatWorkFlowActions(data, type, row, index, workFlow);
                 }
             }
        ],
        "createdRow": function (row, data, index) {

            fnFormatRow(data, row, index);


        },
        "drawCallback": function (settings) {
            fnWorkFlowCheckData(settings);
        }
    });

}

function formatWorkflowName(data, type, row) {

    var dialog = $('#spinnerDialog').data('dialog');
    dialog.close();
    var newDraftFlag = "";
    if (row.IsNew)
        newDraftFlag = "New";
    if (!row.IsPublished)
        newDraftFlag = "Draft";
    data = "<a>" + data + "</a><span class='" + newDraftFlag + "'>" + newDraftFlag + "</span>";
    return data;
}
function fnFormatWorkFlowActive(data, type, row) {

    if (row.IsPublished === true && row.UsebyRequestCount == 0) {
        data = "<label id='btn_checked' class='switch'><input type='checkbox' onclick='showDialogWorkflowStatus(\"" +row.Id + "\",\"" + row.IsActive + "\" , event )'";

    } else {
        data = "<label id='btn_checked' class='switch'><input type='checkbox' disabled";

    }
    if (row.IsActive)
        data = data + " checked = true";
    if (parseInt(row.UsebyRequestCount) > 0)
        data = data + " 'disabled'";
    data = data + "><span class='check'></span></label>";
    return data;
}


var WF_Id, statusDialog, currentSwitch,WF_Status;
function showDialogWorkflowStatus(id,status,e) {

    statusDialog = $("#dialogWorkflowStatus").data('dialog');
    WF_Id = id;
    WF_Status = status;

    currentSwitch = e;
   


    statusDialog.open();
}


function resetStatus(e) {
    var currentStatus = $(currentSwitch.target).prop('checked');
    $(currentSwitch.target).prop('checked', !currentStatus);
    statusDialog.close();
}

function fnChangeStatus(id,status) {
    id = WF_Id;
    status = WF_Status;
    fnOpenSpinner();

    var flag;
    if (status == "true") {
        flag = "false";
    } else {
        flag = "true";

    }


    $.ajax({

        url: 'api/Workflow/UpdateWorkflowIsActiveFlag?Id=' + id + '&flagStatus=' + flag,
        type: 'PUT',

        contentType: "application/json",
        dataType: "json",
        success: function (data) {
            statusDialog.close();
            window.location.reload();
        }, error: function (data) {
            fnCloseSpinner();

            statusDialog.close();
            window.alert("Error occured. Please contact support team.");

            window.location.reload();
        }
    })
}


function fnWorkFlowCheckData(settings) {
    
    settings.iDraw = 0;
    fnCloseSpinner();

}

function clearWorkFlowDatatable() {
        if ($.fn.DataTable.isDataTable("#workFlowTable") == true)
        $("#workFlowTable").DataTable().clear().destroy();
}
function showTenantDiv_WF(show) {
    if (show) {
        $('#tenantDiv_WF').css('display', 'block');
        $('#tenantLabel_WF').css('display', 'block');
    } else {
        $('#tenantDiv_WF').css('display', 'none');
        $('#tenantLabel_WF').css('display', 'none');
    }
}
function populateWorkFlowType(anchorId, workFlowService, updateWorkFlowService, questionnairePreviewService, $scope, $http, toastr) {
    $(anchorId).toggleClass('active', 'fg-lightgray');
    $('.active').toggleClass('active', 'fg-lightgray');
    var apiUri = "";
    var dialog = "";
    $scope.showActiveInActiveFilters = true;
    switch (anchorId) {
        case '#myWorkFlow':
            showHideElement('tenant', 'none');
            clearWorkFlowDatatable();
            $('#workFlowTable').hide();
            fnOpenSpinner();
            apiUri = 'api/Workflow/GetWorkflowsByTenant?tenantId=433C587E-837E-41D5-B2E0-F2D0658CD6BD';
            workFlowType = "#myWorkFlow";
            PopulateWorkFlowFromServer("#myWorkFlow", workFlowService, updateWorkFlowService, questionnairePreviewService, $scope, apiUri,toastr);
            showTenantDiv_WF(false);
      

            $scope.showActiveInActiveFilters = true;
            break;
        case '#allWorkFlow':
            showHideElement('tenant', '');
            showHideElement('activeQuestionnaire', '');
            showHideElement('actions', '');
            clearWorkFlowDatatable();
            $('#workFlowTable').hide();
            fnOpenSpinner();
            apiUri = 'api/Workflow/GetAllWorkflows';
            workFlowType = "#allWorkFlow";
            PopulateWorkFlowFromServer("#allWorkFlow", workFlowService, updateWorkFlowService, questionnairePreviewService, $scope, apiUri, toastr);
            showTenantDiv_WF(true);
            break;
        case '#deletedWorkFlow':
            showHideElement('activeQuestionnaire', 'none');
            showHideElement('actions', 'none');
            clearWorkFlowDatatable();
            $('#workFlowTable').hide();
            fnOpenSpinner();
            types = "";
            apiUri = 'api/Workflow/GetAllDeletedWorkflows';
            workFlowType = "#deletedWorkFlow";
            PopulateWorkFlowFromServer("#deletedWorkFlow", workFlowService, updateWorkFlowService, questionnairePreviewService, $scope, apiUri, toastr);
            showTenantDiv_WF(true);
            $scope.showActiveInActiveFilters = false;
            break;
    }
}

function fnSearchWorkFlowDataTable(workFlowService, updateWorkFlowService, questionnairePreviewService, $scope, $http,toastr) {

    populateWorkFlowType(workFlowType, workFlowService, updateWorkFlowService, questionnairePreviewService, $scope, $http,toastr);
}

function LoadTemplate($scope, workFlowService) {
    
    var myDataPromise = workFlowService.getData('api/Tenant');
    myDataPromise.then(function (result) {
        $scope.tenants = result;
    });
}

function getSelectedTemplate(workFlowType, workFlowService, updateWorkFlowService, questionnairePreviewService, $scope, $http, toastr) {

    tenant = $scope.selectedTenant;

    populateWorkFlowType(workFlowType, workFlowService, updateWorkFlowService, questionnairePreviewService, $scope, $http, toastr);
}

$("#datepicker_from_workflow").datepicker({

    "onSelect": function (date) {
        var dateFormatted = date.replace(/\./g, '-');
        var getDates = new Date(dateFormatted);
        min_Date_Filter = getDates;
        otable.fnDraw();
    },
    "format": "mmmm d, yyyy"
}).keyup(function () {
    min_Date_Filter = new Date(this.value).getTime();
    otable.fnDraw();
});

$("#datepicker_to_workflow").datepicker({
    "onSelect": function (date) {
        var dateFormatted = date.replace(/\./g, '-');
        var getDates = new Date(dateFormatted);
        max_Date_Filter = getDates;
        otable.fnDraw();
    },
    "format": "mmmm d, yyyy"
}).keyup(function () {

    max_Date_Filter = new Date(this.value).getTime();
    otable.fnDraw();
});
min_Date_Filter = "";
min_Date_Filter = "";
function fnPassExternalWorkFlowFilters(data, apiUri) {
    var dialog = $('#spinnerDialog').data('dialog');
    dialog.open();
    var pageInfo = $('#workFlowTable').DataTable().page.info();
    data.toWorkflowDateValue = max_Date_Filter;
    data.fromWorkflowDateValue = min_Date_Filter;
    data.activeInActive = types;
    data.searchText = $.trim($('#workFlowTableSearchText').val()) == '' ? '' : $.trim($('#workFlowTableSearchText').val());
    data.tenant = tenant;
    data.start = pageInfo.page;
}

function ToWorkFlowDateValue(workFlowService, updateWorkFlowService, questionnairePreviewService, $scope, $http, toastr) {
    $("#datepicker_to_workflow").datepicker({
        "onSelect": function (date) {
            var dateFormatted = date.replace(/\./g, '-');
            var getDates = new Date(dateFormatted);
            max_Date_Filter = convertDate(getDates);
            var maxDate = new Date(max_Date_Filter);
            var minDate = new Date(min_Date_Filter);
            if (maxDate < minDate) {
                $('#errorDate_workFlow').css('display', 'inline-block');
                $('#errorDateDiv_workFlow').css('display', 'inline-block');
            } else {
                $('#errorDate_workFlow').css('display', 'none');
                $('#errorDateDiv_workFlow').css('display', 'none');
                populateWorkFlowType(workFlowType, workFlowService, updateWorkFlowService, questionnairePreviewService, $scope, $http, toastr);
            }
        },
        "format": "mmmm d, yyyy"
    }).keyup(function () {
        max_Date_Filter = new Date(this.value).getTime();
    });
}

function FromWorkflowDateValue(workFlowService, updateWorkFlowService, questionnairePreviewService, $scope, $http, toastr) {

    $("#datepicker_from_workflow").datepicker({
        "onSelect": function (date) {

            var dateFormatted = date.replace(/\./g, '-');
            var getDates = new Date(dateFormatted);
            min_Date_Filter = convertDate(getDates);
            if (max_Date_Filter == "")
                max_Date_Filter = convertDate(new Date());
            var maxDate = new Date(max_Date_Filter);
            var minDate = new Date(min_Date_Filter);
            if (maxDate < minDate) {
                $('#errorDate_workFlow').css('display', 'inline-block');
                $('#errorDateDiv_workFlow').css('display', 'inline-block');
                $('#datePickerToWorkFlow').val(max_Date_Filter);
                $("#datepicker_to_workflow").datepicker();
            } else {
                $('#errorDate_workFlow').css('display', 'none');
                $('#errorDateDiv_workFlow').css('display', 'none');
                $('#datePickerToWorkFlow').val(max_Date_Filter)
                $("#datepicker_to_workflow").datepicker();
                populateWorkFlowType(workFlowType, workFlowService, updateWorkFlowService, questionnairePreviewService, $scope, $http,toastr);
            }

        },
        "format": "mmmm d, yyyy"
    }).keyup(function () {
        max_Date_Filter = new Date(this.value).getTime();
    });

}

function fnResetWorkFlowFilters(workFlowType, workFlowService, updateWorkFlowService, questionnairePreviewService, $scope, $http,toastr) {

    $("#datepicker_from_workflow").children()[0].value = "";
    $("#datepicker_to_workflow").children()[0].value = "";
    $('#activeWorkFlow').attr('checked', false);
    $('#inactiveWorkFlow').attr('checked', false);
    $('#workFlowTableSearchText').val("");
    $('#selectTenant_WF').val("");
    $('#select2-selectTenant_WF-container')[0].title = "";
    $('#select2-selectTenant_WF-container')[0].textContent = "";
    $('#errorDateDiv_workFlow').hide();

    max_Date_Filter = "";
    min_Date_Filter = "";
    searchText = "";
    $scope.selectedTenant = "";
    tenant = "";
    types = "";
    populateWorkFlowType(workFlowType, workFlowService, updateWorkFlowService, questionnairePreviewService, $scope, $http,toastr);
}
vettingApp.controller('workflowLandingController', function ($scope, $http, $timeout, toastr, $window, workFlowService, updateWorkFlowService, questionnairePreviewService, WizardHandler, $location, $sce) {
    var languageId = "192C79DD-B246-4BF2-B297-A36338981F99";

    workFlowType = "#myWorkFlow";

    var questionnaireVersionId = null;

    $scope.showActiveInActiveFilters = true;

    $scope.onFolderNumberKeyPress = function (event) {
        if (event.charCode == 13) {
           
            $scope.searchDataTable = function () {
                fnSearchWorkFlowDataTable(workFlowService, updateWorkFlowService, questionnairePreviewService, $scope, $http, toastr);
            }
            $scope.searchDataTable();
        }
            
    }

    var otable = PopulateWorkFlowFromServer("#myWorkFlow", workFlowService, updateWorkFlowService, questionnairePreviewService, $scope, 'api/Workflow/GetWorkflowsByTenant?tenantId=433C587E-837E-41D5-B2E0-F2D0658CD6BD', toastr);
   
    $scope.fnClearFilters = function () {
        fnResetWorkFlowFilters(workFlowType, workFlowService, updateWorkFlowService, questionnairePreviewService, $scope, $http, toastr);
    }

    $scope.redirectToAdmin = function () {
        $location.url('/admin');
        $window.location.reload();
    }
    $scope.redirectToSystemSettings = function () {
        $location.url('/systemSettings');
    }
    $scope.previewQuestionnaire = function () {
      
        var questionnaireVersionId = "c37cb89a-3c39-4fbe-a7b1-a9f9899d1acc";

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
    $scope.redirectToWorkFlowLanding = function () {
        $location.url('/workflowLanding');
        $window.location.reload();
    }

    $scope.reDirectToNewWorkflow = function () {
        $location.url('/newWorkflow');
        $window.location.reload();
    }

    LoadTemplate($scope, workFlowService);
    //showTenantDiv(true);
    showTenantDiv_WF(false);
    $scope.searchDataTable = function () {
        fnSearchWorkFlowDataTable(workFlowService, updateWorkFlowService, questionnairePreviewService, $scope, $http,toastr);
    }

    $scope.SetSelectTemplate = function () {
        getSelectedTemplate(workFlowType, workFlowService, updateWorkFlowService, questionnairePreviewService, $scope, $http, toastr);
    }

    ToWorkFlowDateValue(workFlowService, updateWorkFlowService, questionnairePreviewService, $scope, $http, toastr);
    FromWorkflowDateValue(workFlowService, updateWorkFlowService, questionnairePreviewService, $scope, $http, toastr);
    $scope.changeClass = function (anchorId) {
        populateWorkFlowType(anchorId, workFlowService, updateWorkFlowService, questionnairePreviewService, $scope, $http,toastr);
    }
    $scope.filterme = function () {

        getActiveInActive();
        populateWorkFlowType(workFlowType, workFlowService, updateWorkFlowService, questionnairePreviewService, $scope, $http, toastr);
    }

});

vettingApp.factory('workFlowService', function ($http) {
    var getData = function (apiUri) {
        return $http.get(apiUri).then(function (result) {
            return result.data;
        });
    };
    return { getData: getData };
});

vettingApp.factory('updateWorkFlowService', function ($http, toastr, $timeout) {

    var getData = function (apiUri, successMessage, workFlowId) {
        return $http.put(apiUri).success(function (data) {
            toastr.success('', successMessage);
            $timeout(function () {
                if (workFlowId != null) {
                    window.location.reload();

                }
            }, 2000);


            
        }).error(function () {
            fnCloseSpinner();
            toastr.error('', 'Error occured while performing this operation');

        });
    };
    return { getData: getData };
});

