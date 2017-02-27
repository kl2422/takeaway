angular.module('footerModule', [])
	.directive('footerHtml', function() {
	
	var directive = {};
	directive.restrict = "E";
	directive.templateUrl = "footer.html";
	return directive;
})
