app.controller('train_controller', ($scope, $http, state) => {

    $scope.state = state;

    $http({
        method: 'GET',
        url: '/api/dataset/',
    })
    .then(response => $scope.datasets = response.data, console.error);

    $scope.train = () =>
		$http({
	        method: 'POST',
	        url: '/api/dataset/' + $scope.dataset.dataset + '/train',
	        data: {
	            'targetvar': $scope.parameter
	        },
	        headers: {
	            'Content-type': 'application/json'
	        }
	    })
		.then(console.log, console.log);

    $scope.$watch('state.datasets', (newValue, oldValue) => {
		$scope.datasets = newValue;
    }, true);

});
