$().ready(function(){
    "use strict";
    var App = window.App,
    dashboard = App.module.dashboard;

    dashboard.filter('join', function() {
        return function(input, separator) {
            return (null === typeof input ? '' : input.join(separator).replace(/\\(.)/mg, "$1"));
        }
    });
    dashboard.filter('localdatetime', function() {
        return function(date) {
            var datetime = new Date(date);
            return (null === date ? '' : datetime.toString());
        }
    });

    dashboard.directive('onLastRepeat', function() {
        return function(scope, element, attrs) {
            if (scope.$last) setTimeout(function(){
                scope.$emit('onRepeatLast', element, attrs);
            }, 1);
        };
    });

    dashboard.service('UserRecords', function($http, $q) {
        this.get = function(userId){
            var deferred = $q.defer();
            var url = '/record/list/'+ userId;
            $http.get(url).success(function(data, status) {
                deferred.resolve(data);
            }).error(function(data, status) {
                deferred.reject(data);
            });

            return deferred.promise;
        }
    });

    dashboard.controller('DashboardCtrl', function DashboardCtrl($scope, UserRecords) {
        $scope.types = [];
        $scope.$on('onRepeatLast', function(scope, element, attrs){
            App.initDataTables('.ng-datatable');
        });

        $scope.$watch('types', function(newValue, oldValue) { // @check is this working?
            if (newValue === oldValue) { return; }
            // App.reinitDataTables('.ng-datatable');
        });

        $scope.expand = function expand($event){
            var toggleDiv = $('#'+$event.target.parentNode.dataset.type+'Accordion').parent(null)[0];
            toggleDiv.className = (toggleDiv.className.indexOf('col-md-6') > -1 ?
                toggleDiv.className.replace('col-md-6','col-md-12'):
                toggleDiv.className.replace('col-md-12','col-md-6'));
            ('glyphicon glyphicon-resize-small' === $event.target.className ?
                $event.target.className = "glyphicon glyphicon-resize-full":
                $event.target.className = "glyphicon glyphicon-resize-small");
        };

        $scope.toggleAccodion = function toggleAccodion($event){
            ('glyphicon glyphicon-collapse-down' === $event.target.className ?
                $event.target.className = "glyphicon glyphicon-collapse-up":
                $event.target.className = "glyphicon glyphicon-collapse-down");
        };

        $scope.loadData = function loadData(){
            var promise = UserRecords.get(App.user.id);
            promise.then(function(records){
                $scope.types = records;
                App.initSortable();
            },function(reason){
                $().raise({
                    type: 'danger',
                    message: reason,
                    heading: 'Error in DashboardCtrl:'
                });
            });
        };

        $scope.loadData();
    });
});