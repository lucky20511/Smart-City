/**
 * Created by Arsh Bhatti on 5/16/2017.
 */
var myApp = angular.module('myApp', []);



myApp.controller('login', ['$scope', '$http', function($scope, $http) {
    $scope.invalid_user = true;
    $scope.login = function() {
        if($scope.username== undefined || $scope.password == undefined){
            $scope.invalid_user = false;
        }
        else if($scope.username== "admin" && $scope.password == "admin"){
            $scope.invalid_user = true;
            window.location.assign("/admin");
        }
        else if($scope.username== "user" && $scope.password == "user"){
            $scope.invalid_user = true;
            window.location.assign("/user");

        }
        else if($scope.username== "moderator" && $scope.password == "moderator"){
            $scope.invalid_user = true;
            window.location.assign("/moderator");
        }
    };
}]);