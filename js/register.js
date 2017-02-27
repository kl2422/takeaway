angular.module('registerApp', [])
	.controller('registerCtl', function ($scope, $http, $interval, $timeout) {
	
	$scope.searchForm = {
		firstname: null,
		email: null,
		password: null,
		phone : null,
		verifyCode:null
	}
	
	$scope.title = "Verify Code";
	$scope.clicked = false; // 点击后禁用click
	
	// 短信验证码发送
	$scope.sendVerifyCode = function () {
		$scope.clicked = true; // 进入后禁用按钮
		
		// 调用发送短信验证码的url发送验证码
		var smsUrl = "http://iservice.itshsxt.com/sms/send?callback=JSON_CALLBACK";
		var sendCodeParams = {'mobile': $scope.searchForm.phone};
		$http({method:'jsonp', url: smsUrl, params: sendCodeParams}).success(function (data) {
			if (data.resultCode == 1) { // 成功
				// 倒计时开始
				countdown();
			} else {
				alert(data.message);
				$scope.clicked = false; // 让按钮可以点击
			}
		})
	}
	
	var i = 61;
	function countdown() {
		var countdown = $interval(function() {
			i --;
			$scope.title = i + " s"; // 按钮显示倒计时
			if (i == 0) { // 回到最初
				$scope.title = "Verify Code";
				$scope.clicked = false;
				i = 61;
				$interval.cancel(countdown);
			}
		}, 1000);

//		if (i == 0) {
//			$scope.clicked = false;
//			$scope.title = "Verify Code";
//			i = 60;
//		} else {
//			$scope.clicked = true;
//			$scope.title = i + "s";
//			i --;
//			$timeout(function() {
//				$scope.countdown();
//			}, 1000);
//		}
	}
	
	// 注册
	$scope.registerBtnClicked = false;
	$scope.signup = function () {
		
		registerBtnClicked = true; // 禁用点击按钮
		// 基本参数验证
		
		// 调用注册接口
		var signupUrl = "http://iservice.itshsxt.com/diner/signup?callback=JSON_CALLBACK";
		$http({method:'jsonp', url: signupUrl, params: $scope.searchForm}).success(function(data) {
			console.log(JSON.stringify(data));
			// 如果成功跳转，如果失败就打印失败信息
			if (data.resultCode == 1) { // 成功
				var dinerInfo = data.result;
				localStorage.setItem('dinerInfo', JSON.stringify(dinerInfo));
				var backurl = sessionStorage.getItem('backurl');
				if (backurl == null || backurl == '') {
					backurl = "index.html";
				}
				window.location.href = backurl;
			} else { // 失败
				alert(data.message);
				registerBtnClicked = false; // 开启
			}
			
			
		});
		
	}
	
	
});
