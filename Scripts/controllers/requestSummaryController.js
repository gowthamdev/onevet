vettingApp.controller('requestSummaryController', function ($scope, $http, $location) {
    $scope.businessPanelOpened = false;

    $scope.gradeDetails = [
        { name: 'MS', rating: 1, size: 3000 },
        { name: 'Google', rating:5, size: 5000 },
        { name: 'Amazopn', rating: 3, size: 2000 },
        { name: 'IBM', rating: 2, size: 1000 },
        ];

    $scope.togglePanel = function (status) {
        $scope.businessPanelOpened = status;
        if (status === true) {
            $(".panel.collapsible .panel-header").css({ "border-bottom": "none" });
            $(".panel-content").css({ "display": "block" });
            $("#details").text("Hide Details");
        } else {
            $(".panel.collapsible .panel-header").css({ "border-bottom": "2px solid green" });
            $(".panel-content").css({ "display": "none" });
            $("#details").text("Details");
        }
    };
});