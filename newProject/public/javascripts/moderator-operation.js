var moderatorApp = angular.module('moderatorApp',[]).controller('moderatorCtrl',function($scope,$http){
    $http.get('moderator-info.json').success(function(response) {
        $scope.moderatorFile= response;
        $scope.date = new Date();
        $scope.delete= function(username) {
            var index = $scope.moderatorFile.indexOf(username);
            $scope.moderatorFile.splice(index, 1);
            console.log("JSON was deleted");
        }
            Highcharts.chart('container', {
                chart: {

                    renderTo: 'lineChart'},
                title: {
                    text: 'Number of people signing up for your cluster'
                },

                yAxis: {
                    title: {
                        text: 'Number of Clients'
                    }
                },
                legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'middle'
                },

                plotOptions: {
                    series: {
                            pointStart:0
                    }
                },

                series: [{
                    name: 'Installation',
                    data: [43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175]
                }]

            });



    });

});


