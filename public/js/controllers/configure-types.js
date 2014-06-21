$().ready(function(){
    "use strict";
    var App = window.App,
        configureTypes = App.module.configureTypes;

    configureTypes.controller('IssueCtrl', function DashboardCtrl($scope, $http) {
        $http.get('/record/type/issue',{ cache: true }).
            success(function(datam) {
                console.log(datam);
                angular.forEach(datam, function(value, key){
                    $scope[key] = value;
                });
            });
    });
    configureTypes.controller('TaskCtrl', function DashboardCtrl($scope, $http) {
        $http.get('/record/type/task',{ cache: true }).
            success(function(datam) {
                console.log(datam);
                angular.forEach(datam, function(value, key){
                    $scope[key] = value;
                });
            });    });
    configureTypes.controller('BugCtrl', function DashboardCtrl($scope, $http) {
        $http.get('/record/type/bug',{ cache: true }).
            success(function(datam) {
                console.log(datam);
                angular.forEach(datam, function(value, key){
                    $scope[key] = value;
                });
            });
    });
    configureTypes.controller('RFCCtrl', function DashboardCtrl($scope, $http) {
        $http.get('/record/type/rfc',{ cache: true }).
            success(function(datam) {
                console.log(datam);
                angular.forEach(datam, function(value, key){
                    $scope[key] = value;
                });
            });
    });
    configureTypes.controller('EnhancementCtrl', function DashboardCtrl($scope, $http) {
        $http.get('/record/type/enhancement',{ cache: true }).
            success(function(datam) {
                console.log(datam);
                angular.forEach(datam, function(value, key){
                    $scope[key] = value;
                });
            });
    });
    configureTypes.controller('MilestoneCtrl', function DashboardCtrl($scope, $http) {
        $http.get('/record/type/milestone',{ cache: true }).
            success(function(datam) {
                console.log(datam);
                angular.forEach(datam, function(value, key){
                    $scope[key] = value;
                });
            });
    });
    configureTypes.controller('ReleaseCtrl', function DashboardCtrl($scope, $http) {
        $http.get('/record/type/release',{ cache: true }).
            success(function(datam) {
                console.log(datam);
                angular.forEach(datam, function(value, key){
                    $scope[key] = value;
                });
            });
    });
    configureTypes.controller('ProjectCtrl', function DashboardCtrl($scope, $http) {
        $http.get('/record/type/project',{ cache: true }).
            success(function(datam) {
                console.log(datam);
                angular.forEach(datam, function(value, key){
                    $scope[key] = value;
                });
            });
    });
});