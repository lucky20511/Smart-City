var profileApp = angular.module('profileApp',[]).controller('profileCtrl',function($scope,$http){
    $http.get('post-data.json').success(function(response) {
        $scope.postFile = response;
    });

        // the function runs when the "Add Post" button is clicked
        $scope.addPost = function () {
            // Only add a post if there is a body
            if ($scope.postBody) {
                // unshift a new post into $scope.posts
                $scope.postFile.unshift({
                    username: 'Arsh Bhatti',
                    body: $scope.postBody // use the text entered
                })
                // clear out the input field
                $scope.postBody = null
            }
        }



});


/**
 * Created by Arsh Bhatti on 5/16/2017.
 */
