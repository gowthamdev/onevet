vettingApp.controller('requestLandingController', function ($scope, $http, $location, DTOptionsBuilder, DTColumnBuilder) {
    $scope.reloadData = '';
    $scope.fromDate = '';
    $scope.toDate = '';
    $scope.minDateFilter = '';
    $scope.maxDateFilter = '';
    $scope.tenants = [];
    $scope.dtInstance = {};
    $scope.results = {
        'Pass': false,
        'Submitting': false,
        'Error': false,
        'Fail': false,
        'In progress': false,
        'Override': false
    };
    /*filter result */
    $scope.toggleResults = function () {
        $scope.reloadTable();
    };
    $scope.selectedRequestTenant = '';
    data = {};
    showAllEntities($scope, $http, $location, DTOptionsBuilder, DTColumnBuilder,data);
    $scope.searchDataTable = function () {
        $scope.reloadTable();
    }

    $scope.processSearch = function (event) {
        if (event.which === 13) {
            $scope.reloadTable();
        }
    }
    $scope.reloadTable = function () {
        fnOpenSpinner();
        $scope.dtInstance.reloadData(fnCloseSpinner);
    }
    $scope.initializeDates = function () {
        $("#datepicker_to").datepicker({
            "onSelect": function (date) {
                var dateFormatted = date.replace(/\./g, '-');
                var getDates = new Date(dateFormatted);
                $scope.maxDateFilter = convertDate(getDates);
                var maxDate = new Date($scope.maxDateFilter);
                var minDate = new Date($scope.minDateFilter);
                if (maxDate < minDate || minDate == null) {
                    $('#errorDate').css('display', 'inline-block');
                    //$('#errorDate').css('display', 'inline-block');
                } else {
                   $('#errorDate').css('display', 'none');
                    //$('#errorDate').css('display', 'none');
                }
                $scope.reloadTable();
            },
            "format": "mmmm d, yyyy"
        }).keyup(function () {
            $scope.maxDateFilter = new Date(this.value).getTime();
        });

        $("#datepicker_from").datepicker({
            "onSelect": function (date) {
                var dateFormatted = date.replace(/\./g, '-');
                var getDates = new Date(dateFormatted);
                $scope.minDateFilter = convertDate(getDates);
                if ($scope.maxDateFilter == "")
                    $scope.maxDateFilter = convertDate(new Date());
                var maxDate = new Date($scope.maxDateFilter);
                var minDate = new Date($scope.minDateFilter);
                if (maxDate < minDate || minDate == null) {
                    $('#errorDate').css('display', 'inline-block');
                   // $('#errorDate').css('display', 'inline-block');
                    $('#datePickerTo').val($scope.maxDateFilter);
                    $("#datepicker_to").datepicker();
                } else {
                    $('#errorDate').css('display', 'none');
                   // $('#errorDate').css('display', 'none');
                    $('#datePickerTo').val($scope.maxDateFilter)
                    $("#datepicker_to").datepicker();
                }  
                var data = {};
                $scope.reloadTable();
            },
            "format": "mmmm d, yyyy"
        }).keyup(function () {
            $scope.maxDateFilter = new Date(this.value).getTime();
        });
    };
  
    $scope.fnClearFilters = function () {
        fnResetRequestLandingFilters($scope, $http, $location, DTOptionsBuilder, DTColumnBuilder, data);
    }
  

    $scope.initializeDates();
   // $scope.fnClearFilters();
    DTOptionsBuilder.newOptions().withOption('bFilter', false);
    DTOptionsBuilder.newOptions().withDOM('lrtip');
});
function processInputParams(d, $scope) {
    var keys = Object.keys($scope.results);
    var resultsToShow = keys.filter(function (key) { return $scope.results[key] === true; });
    d.fromRequestDate = $scope.minDateFilter;
    d.toRequestDate = $scope.maxDateFilter;
    d.status = resultsToShow;
    d.searchText = $scope.searchText;
    return d;
}
function showAllEntities($scope, $http, $location, DTOptionsBuilder, DTColumnBuilder, data) {
    showDialog("#spinnerDialog");
    data = {}
    $scope.dtColumns = [
        //here We will add .withOption('name','column_name') for send column name to the server 
        DTColumnBuilder.newColumn("EntityName", "Entity Name").withOption('name', 'EntityName'),
        DTColumnBuilder.newColumn("DateRequested", "Date Requested").withOption('name', 'DateRequested').renderWith(formatDate),
        DTColumnBuilder.newColumn("RequestId", "Request Id").withOption('name', 'RequestId').notSortable(),
        DTColumnBuilder.newColumn("Source", "Source").withOption('name', 'Source'),
        DTColumnBuilder.newColumn("TenantId", "Tenant").withOption('name', 'TenantId').notSortable(),
        DTColumnBuilder.newColumn("StatusText", "Results").withOption('name', 'StatusText').renderWith(statusIcons).notSortable()
    ];
    $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
        dataSrc: "data",
        url: "api/SingleRequest/GetRequestSummaryDetails",
        type: "GET",
        //success
        data: function (data) {
            fnOpenSpinner();
            processInputParams(data, $scope)
        },
        error: function() {
            fnCloseSpinner();
            window.alert("Error occured while trying to retrieve Request data. Please try again.");
        }
    })
       
    .withOption('searching', false) //for show progress bar
    .withOption('processing', false) //for show progress bar
    .withOption('serverSide', true) // for server side processing
    .withPaginationType('simple_numbers') // for get full pagination options // first / last / prev / next and page numbers
    .withDisplayLength(10) // Page size
    .withOption('aaSorting', [1, 'desc'])
    .withOption('drawCallback', function (setting) {
        setting.iDraw = 0;
        fnCloseSpinner();
    })
};

function formatDate(currentFormat) {
    var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    return monthNames[new Date(currentFormat).getUTCMonth()] + " " + new Date(currentFormat).getDate() + " " + new Date(currentFormat).getUTCFullYear();
}
function statusIcons(data) {
    var test = data.split(" ");
    if (test.length > 1) {
        data = test.join("-");
    }
    return '<span class="' + data + '"></span>';
}

function fnResetRequestLandingFilters($scope, $http, $location, DTOptionsBuilder, DTColumnBuilder, data) {
    $("#datePickerFrom").val("");
    $("#datePickerTo").val("");
    $scope.results = {
        'Pass': false,
        'Submitting': false,
        'Error': false,
        'Fail': false,
        'In progress': false,
        'Override': false
    };
    $("#errorDate").css({ "display": "none" });
    $scope.searchText = '';
   $scope.fromDate = '';
   $scope.toDate = '';
   $scope.minDateFilter = '';
   $scope.maxDateFilter = '';
   $scope.tenants = [];
   $scope.reloadTable();
}
