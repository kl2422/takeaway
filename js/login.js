angular.module('login', ['footerModule'])
	.controller('loginController', function ($scope, $http) {
		// 判断用户是否登录如果登录了的话就直接返回原来的页面
		var dinerInfo = localStorage.getItem('dinerInfo');
		if (dinerInfo != null && dinerInfo != '') {
			try{
				var dinerId = JSON.parse(dinerInfo).dinerId;
				console.log(typeof dinerId)
				if (dinerId != null && !isNaN(dinerId)) { // 表示dinerId是number类型
					var backurl = sessionStorage.getItem('backurl');
					if (backurl == null || backurl == '') {
						backurl = "index.html";
					}
					window.location.href = backurl;
				}
			}catch(e){
				console.log(e)
			}
		}
		
		$scope.email = null;
		$scope.password = null;
		
		$scope.login = function () {
			// 数据验证
			if ($scope.email == null || $scope.email == '') {
				alert("Please input your email");
				return;
			}
			if ($scope.password == null || $scope.password == '') {
				alert("Please input your password");
				return;
			}
			// 第一种jsonp请求
//			var url = "http://iservice.itshsxt.com/diner/login?callback=JSON_CALLBACK&email=" 
//				+ $scope.email + "&password="+$scope.password;
//			$http.jsonp(url).success(function(data) {
//				console.log(JSON.stringify(data));
//			});
			
			// 第二种原生的jsop请求方式
			var url = "http://iservice.itshsxt.com/diner/login?callback=JSON_CALLBACK"; 
			var params = {email:$scope.email, password:$scope.password};
			$http({method:'jsonp', url:url, params:params}).success(function(data) {
				var resultCode = data.resultCode;
				if (resultCode == 0) { // 失败
					alert(data.message);
				} else {
					var dinerInfo = data.result;
					localStorage.setItem('dinerInfo', JSON.stringify(dinerInfo));
					var backurl = sessionStorage.getItem('backurl');
					if (backurl == null || backurl == '') {
						backurl = "index.html";
					}
					window.location.href = backurl;
				}
			});
		}
		
		
	});
