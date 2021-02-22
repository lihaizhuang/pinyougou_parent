app.service("brandService",function ($http) {
    this.findAll =function () {
        return $http.get("../brand/findAll.do");
    }
    this.findBrandByPage =function (currentPage,itemsPerPage,searchEntity) {
        return $http.post("../brand/findBrandByPage.do?pageNum="+currentPage+
            "&pageSize="+itemsPerPage, searchEntity);
    }
    this.add =function (entity) {
        return $http.post("../brand/add.do",entity);
    }
    this.update = function (entity) {
        return $http.post("../brand/update.do",entity);
    }
    this.findOne = function (id) {
        return $http.get("../brand/findOne.do?id=" +id);
    }
    this.delete =function (selectIds) {
        return $http.get('../brand/delete.do?ids='+selectIds);
    }
});