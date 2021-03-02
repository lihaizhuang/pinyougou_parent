app.controller("loginController",function ($scope, loginService) {
    //显示当前用户姓名
    $scope.showName=function () {
        loginService.loginName().success(function (data) {
            $scope.loginName=data.loginName;
        })
    }

})
