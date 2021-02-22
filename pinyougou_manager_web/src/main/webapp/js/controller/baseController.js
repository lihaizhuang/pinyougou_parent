app.controller("baseController",function ($scope) {
    // 配置分页信息
    $scope.paginationConf = {
        currentPage: 1, // 当前页码;
        totalItems: 10, // 总条数;
        itemsPerPage: 10,
        perPageOptions: [10, 20, 30, 40, 50], // 页码选项;
        onChange: function(){ // 更改页面时触发事件;
            $scope.findBrandByPage();
        }
    };
    $scope.selectIds = [];
    $scope.updateSelection = function ($event, id) {
        if($event.target.checked){
            $scope.selectIds.push(id);
        }else{
            var idx = $scope.selectIds.indexOf(id);//查找id所在位置
            $scope.selectIds.splice(idx,1);//从位置开始，移除多少个
        }
    }

    //是否选中为了翻页后回来还能勾选上
    $scope.isChecked = function(id){
        if($scope.selectIds.indexOf(id)!= -1){
            return true;
        }
        return false;
    }
})