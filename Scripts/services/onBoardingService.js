vettingApp.service('onBoardingService', function ($http, $q) {

    this.getTenants = function (data) {
        var request = $http({ method: "get", url: "/api/Tenants/GetTenants", params: data });
        return (request.then(this.handleSuccess, this.handleError));
    };
    this.addTenant = function (data) {
        var request = $http({ method: "post", url: "/api/Tenants/AddTenant", data: data });
        return (request.then(this.handleSuccess, this.handleError));
    };
    this.updateTenant = function (data) {
        var request = $http({ method: "put", url: "/api/Tenants/UpdateTenants", data: data });
        return (request.then(this.handleSuccess, this.handleError));
    };
    this.deleteTenant = function (data) {
        var request = $http({ method: "delete", url: "/api/Tenants/DeleteTenants", params: data });
        return (request.then(this.handleSuccess, this.handleError));
    };  

    this.getUserByEmail = function (data) {
        var request = $http({ method: "get", url: "/api/User/GetByEmail", params: data });
        return (request.then(this.handleSuccess, this.handleError));
    };

    this.createUser = function (data) {
        var request = $http({ method: "post", url: "api/User", data: data });
        return (request.then(this.handleSuccess, this.handleError));
    };
    this.addTenantUser = function (data) {
        var request = $http({ method: "post", url: "/api/Tenants/AddTenantUser", data: data });
        return (request.then(this.handleSuccess, this.handleError));
    };
    this.getTenantbyTenantDetails = function (data) {
        var request = $http({ method: "get", url: "/api/Tenants/GetTenantDetailsByTenantId", params: data });
        return (request.then(this.handleSuccess,this.handleError));
    };
    this.removeTenantUserMapping = function (data) {
        var request = $http({ method: "put", url: "/api/Tenants/UpdateRemoveTenantUserMapping", data: data });
        return (request.then(this.handleSuccess, this.handleError));
    };

    this.getAllAudienceTypesAndSubTypes = function (data) {
        var request = $http({ method: "get", url: "/api/Tenants/GetAllAudienceTypesSubTypes", params: data });
        //console.log(request);
        return (request.then(this.handleSuccess, this.handleError));
    };
    this.getAllSenarios = function (data) {
        var request = $http({ method: "get", url: "/api/Tenants/GetScenarios", params: data });
        return (request.then(this.handleSuccess, this.handleError));
    };
    this.saveTenantDetails = function (data) {
        var request = $http({ method: "post", url: "/api/Tenants/SaveTenant", data: data });
        return (request.then(this.handleSuccess, this.handleError));
    };
    this.addAudienceTypes = function (data) {
        var request = $http({ method: "put", url: "/api/Tenants/UpdateTenantAudienceTypeSubType", data: data });
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