 //控制层 
app.controller('goodsController' ,function($scope,$controller,$location,goodsService,itemCatService){
	
	$controller('baseController',{$scope:$scope});//继承
	
    //读取列表数据绑定到表单中  
	$scope.findAll=function(){
		goodsService.findAll().success(
			function(response){
				$scope.list=response;
			}			
		);
	}    
	
	//分页
	$scope.findPage=function(page,rows){			
		goodsService.findPage(page,rows).success(
			function(response){
				$scope.list=response.rows;	
				$scope.paginationConf.totalItems=response.total;//更新总记录数
			}			
		);
	}
	
	//查询实体 
	$scope.findOne=function(){
        var id = $location.search()['id'];// 获取参数值
        if (id == null) {
            return;
        }
		goodsService.findOne(id).success(
			function(response){
				$scope.entity= response;
                //向富文本编辑器添加商品介绍
                editor.html($scope.entity.goodsDesc.introduction);
                //显示图片列表
                $scope.entity.goodsDesc.itemImages=
                    JSON.parse($scope.entity.goodsDesc.itemImages);
                //显示扩展属性
                $scope.entity.goodsDesc.customAttributeItems=
                    JSON.parse($scope.entity.goodsDesc.customAttributeItems);
                //读取规格
                $scope.entity.goodsDesc.specificationItems=
                    JSON.parse($scope.entity.goodsDesc.specificationItems);
                //准备SKU信息
                for( var i=0;i<$scope.entity.itemList.length;i++ ){
                    $scope.entity.itemList[i].spec = JSON.parse( $scope.entity.itemList[i].spec);
                }
			}
		);				
	}
	
	//保存 
	$scope.save=function(){				
		var serviceObject;//服务层对象  				
		if($scope.entity.goods.id !=null){//如果有ID
			serviceObject=goodsService.update( $scope.entity ); //修改  
		}else{
			serviceObject=goodsService.add( $scope.entity  );//增加 
		}
        serviceObject.success(function(response) {
            if (response.success) {
                // 重新查询
                // alert('保存成功');
                // $scope.entity = {};
                // editor.html(""); // 富文本编辑器提交后清空
                location.href="goods.html";//修改成功直接跳转到商品列表
            } else {
                alert(response.message);
            }
        });
	}
	
	 
	//批量删除 
	$scope.dele=function(){			
		//获取选中的复选框			
		goodsService.dele( $scope.selectIds ).success(
			function(response){
				if(response.success){
					$scope.reloadList();//刷新列表
					$scope.selectIds=[];
				}						
			}		
		);				
	}
	
	$scope.searchEntity={};//定义搜索对象 
	
	//搜索
	$scope.search=function(page,rows){			
		goodsService.search(page,rows,$scope.searchEntity).success(
			function(response){
				$scope.list=response.rows;	
				$scope.paginationConf.totalItems=response.total;//更新总记录数
			}			
		);
	}
    //保存
    $scope.add=function(){
        //增加获取赋值 富文本编辑器的内容
        $scope.entity.goodsDesc.introduction=editor.html();
        // alert(editor.html());
        goodsService.add( $scope.entity  ).success(
            function(response){
                if(response.success){
					//以及清空
                    editor.html("");
                    $scope.entity={};//提交后清空
                }
                alert(response.message);
            }
        );
    }

    //页面的body调用ng-init="init()"方法进行对象初始化
    //页面内容初始化，初始化实体结构，可以统一放到init方法中
    $scope.init = function(){
        // $scope.entity = {goods:{},goodsDesc:{itemImages:[]}};
        //完成entity对象的初始化，防止push崩
        $scope.entity = {goods:{isEnableSpec:0},goodsDesc:{itemImages:[],specificationItems:[]}};
        $scope.selectItemCat1List();
        $scope.findOne();
    }

    // 添加图片列表
    $scope.addImage = function() {
        $scope.entity.goodsDesc.itemImages.push($scope.image_entity);
    }

    //移除图片
    $scope.deleImage = function(index) {
        $scope.entity.goodsDesc.itemImages.splice(index, 1);
    }

    //查询商品分类列表
    $scope.selectItemCat1List = function(){
        itemCatService.findParentId(0).success(
            function(response){
                //查询一级分类
                $scope.itemCat1List = response;
            }
        )
    }
    //调用$watch('观察变量',function(新值,旧值)),$watch不需要额外引入
    $scope.$watch('entity.goods.category1Id', function(newValue, oldValue) {
        //根据选择的值，查询二级分类
        itemCatService.findParentId(newValue).success(
            function(response){
                $scope.itemCat2List=response;
            }
        );
    });

    $scope.$watch('entity.goods.category2Id', function(newValue, oldValue) {
        //根据选择的值，查询三级分类
        itemCatService.findParentId(newValue).success(
            function(response){
                $scope.itemCat3List=response;
            }
        );
    });
    //根据选择的三级菜单查询模版ID
    $scope.$watch('entity.goods.category3Id', function(newValue, oldValue) {
        itemCatService.findOne(newValue).success(
            function(response) {
                $scope.entity.goods.typeTemplateId = response.typeId; // 更新模板ID
            });
    });


    //2.增加对当前规格集合增加内容的方法，需要判断是新增还是追加
    //参数1:$event判断单选框是否选中，参数2:name要判断的规格名称，参数3:value当前的value是否已经有
    $scope.updateSpecAttribute = function($event, name, value) {
        //先查询当前的集合中是否已经有当前的name了
        var object = searchObjectByKey(
            $scope.entity.goodsDesc.specificationItems,'attributeName',name);
        if (object != null) {
            if ($event.target.checked) {//如果已经有了，并且当前check选择了
                object.attributeValue.push(value); //进行追加
            } else {
                // 取消勾选
                object.attributeValue.splice(object.attributeValue.indexOf(value ) ,1);//移除选项
                // 如果选项都取消了，将此条记录移除
                if (object.attributeValue.length == 0) {
                    $scope.entity.goodsDesc.specificationItems.splice(
                        $scope.entity.goodsDesc.specificationItems
                            .indexOf(object), 1);
                }
            }
        } else {
            $scope.entity.goodsDesc.specificationItems.push({
                "attributeName" : name,
                "attributeValue" :[value]
            });
        }
    }
    var searchObjectByKey = function (list, key, value) {
        for (var i = 0; i < list.length; i++) {
            if (list[i][key] == value) {
                return list[i];
            }
        }
        return null;
    }

    $scope.createItemList = function() {
        $scope.entity.itemList = [ {spec : {},price : 0,num : 99999,status : '0',isDefault : '0'} ];// 初始
        var items = $scope.entity.goodsDesc.specificationItems;
        for (var i = 0; i < items.length; i++) {
            $scope.entity.itemList = addColumn($scope.entity.itemList,
                items[i].attributeName, items[i].attributeValue);
        }
    }
    // 添加列值:参数1是创建的itemList集合，参数2是规格名称，参数3是规格值的集合
    var addColumn = function(list, columnName, conlumnValues) {
        var newList = [];// 新的集合
        for (var i = 0; i < list.length; i++) {
            var oldRow = list[i];  //获取出当前行的内容 {spec:{},price:'0.01',num:'99999',status:'0',isDefault:'0'}
            for (var j = 0; j < conlumnValues.length; j++) {//循环attributeValue数组的内容
                var newRow = JSON.parse(JSON.stringify(oldRow));// 深克隆,根据attributeValue的数量
                newRow.spec[columnName] = conlumnValues[j];//{spec:{"网络制式":"移动4G"},price:'0.01',num:'99999',status:'0',isDefault:'0'}
                newList.push(newRow);
            }
        }
        return newList;
    }

    $scope.status=['未审核','已审核','审核未通过','关闭'];

    $scope.itemCatList = [];// 商品分类列表
    // 加载商品分类列表
    $scope.findItemCatList=function () {
        itemCatService.findAll().success(function(response) {
            for (var i = 0; i < response.length; i++) {
                $scope.itemCatList[response[i].id] = response[i].name;
            }
        });
    }

    //根据规格名称和选项名称返回是否被勾选
    $scope.checkAttributeValue=function(specName,optionName){
        var items= $scope.entity.goodsDesc.specificationItems;
        var object= searchObjectByKey(items,'attributeName',specName);
        if(object==null){
            return false;
        }else{
            if(object.attributeValue.indexOf(optionName)>=0){
                return true;
            }else{
                return false;
            }
        }
    }

    // 更改状态
    $scope.updateStatus = function(status) {
        goodsService.updateStatus($scope.selectIds, status).success(
            function(response) {
                if (response.success) {// 成功
                    $scope.reloadList();// 刷新列表
                    $scope.selectIds = [];// 清空 ID 集合
                } else {
                    alert(response.message);
                }
            });
    }
});	
