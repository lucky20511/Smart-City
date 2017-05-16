
    //defining controller and executing 3dPie Chart
    var adminApp = angular.module('adminApp', []).controller('adminCtrl', function ($scope, $http){
        //getting the json file
        $http({
            method: 'GET',
            url: 'pieChart.json'
        }).then(function successCallback(response) {
            //getting the data into an array
            var dataChart = response.data.data;
            var st = [];
            dataChart.forEach(function callback(currentValue) {
                st.push(currentValue);
            });
            //drawing the chart here
            Highcharts.chart('container', {
                chart: {
                    type: 'pie',
                    renderTo: 'importantchart',
                    options3d: {
                        enabled: true,
                        alpha: 45
                    }
                },
                title: {
                    text: 'Cluster demographics'
                },
                subtitle: {
                    text: 'Based on the alliance of members of the Community'
                },
                plotOptions: {
                    pie: {
                        innerSize: 100,
                        depth: 45
                    }
                },
                series:  [{
                    name: 'Delivered amount',
                    data: st }]
            });
        });
        $http.get('pieChart.json').success(function(response) {
            $scope.chartFile = response;

        });
        //getting the JSON file here
    $http.get('admin-info.json').success(function(response) {
        $scope.adminFile = response;
        // Deleting the results
        $scope.delete= function(clustername){

            var index= $scope.adminFile.indexOf(clustername);
            $scope.adminFile.splice(index,1);

            console.log("JSON was deleted");
        }
       //drawing the force directed graph
        var nodes = new vis.DataSet([
            {id: 1, label: 'Node 1',image:'F:/School Work/Gao 281/Final Project/other examples/Vis-js/images/1.png'},
            {id: 2, label: 'Node 2',image:'F:/School Work/Gao 281/Final Project/other examples/Vis-js/images/2.jpg'},
            {id: 3, label: 'Node 3',image:'F:/School Work/Gao 281/Final Project/other examples/Vis-js/images/3.jpeg'},
            {id: 4, label: 'Node 4',image:'F:/School Work/Gao 281/Final Project/other examples/Vis-js/images/4.jpg'},
            {id: 5, label: 'Node 5',image:'F:/School Work/Gao 281/Final Project/other examples/Vis-js/images/5.jpg'}
        ]);

        // create an array with edges
        var edges = new vis.DataSet([
            {from: 1, to: 3},
            {from: 1, to: 2},
            {from: 2, to: 4},
            {from: 2, to: 5}
        ]);

        // create a network
        var container = document.getElementById('forceChart');

        // provide the data in the vis format
        var data = {
            nodes: nodes,
            edges: edges
        };
        var options = {
            autoResize: true,
            height: '100%',
            width: '100%',


            nodes:{
                borderWidth: 1,
                borderWidthSelected: 2,
                shape:'circularImage',


                chosen: true,
                color: {
                    border: '#2B7CE9',
                    background: '#97C2FC',
                    highlight: {
                        border: '#2B7CE9',
                        background: '#D2E5FF'
                    },
                    hover: {
                        border: '#2B7CE9',
                        background: '#D2E5FF'
                    }
                }
            }

        };

        // initialize your network!
        var network = new vis.Network(container, data, options);

    });
});
