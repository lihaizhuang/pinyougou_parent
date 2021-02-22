app.controller("brandController",function($scope,$controller,brandService){
    $controller("baseController",{$scope : $scope})//伪继承 通过$controller实现

    $scope.findAll = function () {
        brandService.findAll().success(function (data) {
            $scope.brandList =data;
        })
    }

    //搜索框对象
    $scope.searchEntity={};  //解决初始请求参数为空的问题
    $scope.findBrandByPage = function(){
        brandService.findBrandByPage($scope.paginationConf.currentPage,$scope.paginationConf.itemsPerPage,$scope.searchEntity).success(function (data) {
            $scope.brandList = data.rows;
            $scope.paginationConf.totalItems =data.total;
        })
    }

    //品牌新增和修改方法
    $scope.save =function () {
        var object ;
        if($scope.entity.id !=null){
            object = brandService.update($scope.entity)
        }else{
            object= brandService.add($scope.entity)
        }
        object.success(function (data) {
            if(data.success){
                $scope.findBrandByPage();
            }else{
                alert(data.message)
            }
        })
    }
    //查询一个
    $scope.findOne = function (id) {
        brandService.findOne(id).success(function (data) {
            $scope.entity = data;
        })
    }


    $scope.delete = function () {
        if(confirm('确定要删除吗')){
            brandService.delete($scope.selectIds).success(
                function(response){
                    if(response.success){
                        $scope.findBrandByPage();
                        $scope.selectIds=[]; //清空所有ID的选择
                    }
                    alert(response.message);
                }
            )
        }
    }


});