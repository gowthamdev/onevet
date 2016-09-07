vettingApp.service('audienceService', function ($http, $q) {

    this.getType = function (data) {
        var request = $http({ method: "get", url: "/api/Audience/GetAllAudienceTypes", params: data });
        return (request.then(this.handleSuccess, this.handleError));
    };

    this.getSubTypeByTypeId = function (data) {
        var request = $http({ method: "get", url: "/api/Audience/GetAudienceSubTypesByAudienceTypeId", params: data });
        return (request.then(this.handleSuccess, this.handleError));
    };
    this.addType = function (data) {
        var request = $http({ method: "post", url: "/api/Audience/AddAudience", data: data });
        return (request.then(this.handleSuccess, this.handleError));
    };
    this.addSubType = function (data) {
        var request = $http({ method: "post", url: "/api/Audience/SaveAudienceTypeSubType", data: data });
        return (request.then(this.handleSuccess, this.handleError));
    };
    this.deleteType = function (data) {
        var request = $http({ method: "delete", url: "/api/Audience/DeleteAudienceType", params: data });
        return (request.then(this.handleSuccess, this.handleError));
    };
    this.updateAudienceType = function (data) {
        var request = $http({ method: "put", url: "/api/Audience/UpdateAudience", data: data });
        return (request.then(this.handleSuccess, this.handleError));
    };
    this.handleSuccess = function (response) {
        var result = {};//response.data;
        result = {
            data: response.data,
            status: 'success'
        };
        // console.log(result);
        return (result);
    };
    this.handleError = function (response) {

        return ($q.reject(response.data.errorMsg));

    };
});