angular.module('index', ['footerModule', 'siyfion.sfTypeahead'])
	.controller('indexController', function($scope, $http) {
	
	$scope.isLogin = false; // 判断是否登录
	// 判断用户是否登录如果登录了的话就直接返回原来的页面
	var dinerInfo = localStorage.getItem('dinerInfo');
	if (dinerInfo != null && dinerInfo != '') {
		try{
			var dinerId = JSON.parse(dinerInfo).dinerId;
			console.log(typeof dinerId)
			if (dinerId != null && !isNaN(dinerId)) { // 表示dinerId是number类型
				$scope.isLogin = true;
			}
		}catch(e){
			console.log(e)
		}
	}
	$scope.logout = function () {
		$scope.isLogin = false;
		localStorage.removeItem('dinerInfo');
	}
	
	$scope.selectedCuisine = null;
	// 获取cuisine
	$http.get('js/data/cuisine_area.json').success(function(data) {
		console.log(data);
		$scope.cuisines = data.cuisines;
	});
	
	// 获取所有餐厅的名称
	$scope.selectedName = null;
	
	// 搜索引擎对象
	var nameBlood = new Bloodhound({
		datumTokenizer: Bloodhound.tokenizers.whitespace, // 对数据源进行切词的分词器
		queryTokenizer: Bloodhound.tokenizers.whitespace,// 对查询关键字进行切词的分词器
		prefetch: 'http://iservice.itshsxt.com/restaurant/load_all_names?callback=?' // 初始化原创数据的url
	});
	
	
	// datasets
	$scope.nameDataset = { // datasets
		source: nameBlood
	}
	
	$scope.search = function () {
		var data = {
			cuisine: $scope.selectedCuisine,
			searchKey: $scope.selectedName
		}
		sessionStorage.setItem("params", JSON.stringify(data));
		window.location.href = "list.html";
	}
	
})
