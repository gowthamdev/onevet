vettingApp.service('commonService', function ($http, $q) {

    this.loadData = function (type, url, data) {
        var request = $http({ method: type, url: url, params: data });
        return (request.then(this.handleSuccess, this.handleError));
    };

    this.sendRequest = function (type, url, data) {
        var request = $http({ method: type, url: url, data: data });
        return (request.then(this.handleSuccess, this.handleError));
    };
    this.updateRole = function (data) {
        var request = $http({ method: "put", url: "api/RegionSubsidiaryCountry/updateRole", data: data });
        return (request.then(this.handleSuccess, this.handleError));
    };
    this.removeRoleUserMapping = function (data) {
        var request = $http({ method: "delete", url: "api/RegionSubsidiaryCountry/DeleteUser", params: data });
        return (request.then(this.handleSuccess, this.handleError));
    }
    this.getUserName = function (data) {
        var request = $http({ method: "get", url: "/api/RegionSubsidiaryCountry/GetRoleUserByRoleCountry", params: data });
        return (request.then(this.handleSuccess, this.handleError));
    };
    this.userByRoleCountry = function (data) {
        var request = $http({ method: "post", url: "/api/RegionSubsidiaryCountry/GetUserByRoleCountry", data: data });
        return (request.then(this.handleSuccess, this.handleError));
    };
    //this.addRoles = function (data) {
    //    var request = $http({ method: "post", url: "api/RegionSubsidiaryCountry/AddRole", data: data });
    //    return (request.then(this.handleSuccess, this.handleError));
    //};
    //this.getContactByEmail = function (data) {
    //    var request = $http({ method: "get", url: "/api/User/GetByEmail", params: data });
    //    return (request.then(this.handleSuccess, this.handleError));
    //};
    //this.getRoleDetailsbyRoleId = function (data) {   
    //    var request = $http({ method: "get", url: "/api/RegionSubsidiaryCountry/GetRoleAreaCountryUserDetailsByRoleId", params: data });
    //    return (request.then(this.handleSuccess, this.handleError));
    //}
    //this.deleteRoles = function (data) {
    //    var request = $http({ method: "delete", url: "/api/RegionSubsidiaryCountry/DeleteRole", data: data });
    //    return (request.then(this.handleSuccess, this.handleError));
    //};
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