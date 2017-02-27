var listApp = angular.module('listApp', ['footerModule', 'infinite-scroll'])
	.controller('listCtl', function($scope, Restaurant, $http) {
		
		$scope.isLogin = false; // 判断是否登录
		// 判断用户是否登录如果登录了的话就直接返回原来的页面
		var dinerInfo = localStorage.getItem('dinerInfo');
		if (dinerInfo != null && dinerInfo != '') {
			try{
				var dinerId = JSON.parse(dinerInfo).dinerId;
				console.log(typeof dinerId)
				if (dinerId != null && !isNaN(dinerId)) { // 表示dinerId是number类型
					$scope.isLogin = true;
					$scope.firstname =JSON.parse(dinerInfo).firstname; 
				}
			}catch(e){
				console.log(e)
			}
		}
		
		
		// 加载数据
		$scope.restaurant = new Restaurant();
		
		// 加载左侧的过滤菜单
		$http.get('js/data/cuisine_area.json').success(function(data) {
			$scope.filterMenus = data;
		});
		
		// 显示更多/
		$scope.showMoreLess = 1;
		$scope.showMoreLessCuisine = function(type) {
			if ($scope.showMoreLess == type) {
				return;
			}
			$scope.showMoreLess = type;
		}
		
		// 搜索
		$scope.search = function () {
			$scope.restaurant.queryParams.page = 1; // 置为1是由于当前的页码不是首页
			$scope.restaurant.busy = false;
			$scope.restaurant.items = []; // 是由于items里面本身有值
			// 调用接口查询数据
			$scope.restaurant.nextPage();
		}
		
		// 排序
		$scope.sort = function (type) {
			if (type == 1) { // rating
				$scope.restaurant.queryParams.sort = 'rating.desc';
				$scope.restaurant.queryParams.rating = 1;
			} else if (type == 2) { // price
				$scope.restaurant.queryParams.sort = 'averagePrice.asc';
			} else if (type == 3) { // name
				$scope.restaurant.queryParams.sort = 'name.asc';
			}
			
			// 调用搜索
			$scope.search();
		}
	});

listApp.factory('Restaurant', function($http) {
			
	var Restaurant = function () {
		this.items = [];
		this.busy = false;
		this.totalCount = 0; // 展示总记录数
		this.searchKey = '';
		this.hasNextPage = true; // 是否有下一页
		this.queryParams = {
			page: 1, 
			searchKey: '',
			sort: null,
			rating: 0,
			cuisine: '',
			neighborhood:'',
			averagePrice:''
		}
	}
	
	Restaurant.prototype.nextPage = function () {
		// 根据busy判断是否加载数据
		if (this.busy) {
			return;
		}
		this.busy = true;
		var url = "http://iservice.itshsxt.com/restaurant/find?callback=JSON_CALLBACK";
		// 
		console.log(this.queryParams);
		// 从sessionStorage里面获取参数
		var paramStr = sessionStorage.getItem("params");
		if (paramStr != null) {
			try {
				var paramObj = JSON.parse(paramStr);
				this.queryParams.cuisine = paramObj.cuisine;
				this.queryParams.searchKey = paramObj.searchKey;
				// 两个json合并
//				this.queryParams = Object.assign(this.queryParams, paramObj);
				sessionStorage.removeItem('params');
			} catch(e) {
				console.log('json 解析失败：' + e);
			}
		}
		
		
		$http({method:'jsonp', url: url, params:this.queryParams}).success(function(data) {
			if (data.resultCode == 0) {
				alert(data.message);
				return;
			}
			var items = data.result;
			this.items = this.items.concat(items); // 将两个数据合并
			
			this.queryParams.page = data.query.page + 1; // 下一页的页码
			this.totalCount = data.query.totalCount;
			this.hasNextPage = data.query.hasNextPage; // 是否有下一页
			if (data.query.hasNextPage) { // 是否有下一页
				this.busy = false;
			} else {
				this.busy = true;
			}
			
		}.bind(this));
	}
	return Restaurant;
});