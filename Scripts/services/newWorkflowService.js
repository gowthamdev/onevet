vettingApp.service('newWorkflowService', function ($http, $q) {

    this.saveGeneralSetings = function (data) {
        var request = $http({ method: "post", url: "/api/Workflow/SaveWorkflowGeneralSettings", data: data });
        return (request.then(this.handleSuccess, this.handleError));
    };
    this.updateGeneralSetings = function (data) {
        var request = $http({ method: "put", url: "/api/Workflow/UpdateWorkflowGeneralSettings", data: data });
        return (request.then(this.handleSuccess, this.handleError));
    };

    this.getGeneralSetings = function (data) {
        var request = $http({ method: "get", url: "/api/Workflow/GetWorkflowGeneralSettings", params: data });
        return (request.then(this.handleSuccess, this.handleError));
    };


    this.handleSuccess = function (response) {
        var result = {};//response.data;
        result = {
            data: response.data,
            status: 'success'
        };
        return (result);
    };
    this.handleError = function (response) {

        return ($q.reject(response.data.errorMsg));

    };

});
