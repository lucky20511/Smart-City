var moderatorApp = angular.module('moderatorApp',[]).controller('moderatorCtrl',function($scope,$http){
    $http.get('moderator-info.json').success(function(response) {
        $scope.moderatorFile= response;
        $scope.delete= function(username) {
            var index = $scope.moderatorFile.indexOf(username);
            $scope.moderatorFile.splice(index, 1);
            console.log("JSON was deleted");
        }
    });
});


