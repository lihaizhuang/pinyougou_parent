package com.pinyougou.manager.controller;

import com.alibaba.dubbo.config.annotation.Reference;
import com.pinyougou.entity.PageResult;
import com.pinyougou.entity.Result;
import com.pinyougou.pojo.TbBrand;
import com.pinyougou.sellergoods.service.BrandService;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * @author lihai
 * @since 2021/2/16 0016
 */
@RestController
@RequestMapping("/brand")
public class BrandController {

    @Reference
    private BrandService brandService;

    @RequestMapping("/findAll")
    public List<TbBrand> findAll(){
        return brandService.findAll();
    }

    @RequestMapping("/findBrandByPage")
    public PageResult findBrandByPage(@RequestBody TbBrand brand ,int pageNum, int pageSize){

        return brandService.findBrandByPage(brand,pageNum,pageSize);
    }

    @RequestMapping("/add")
    public Result addBrand(@RequestBody TbBrand brand){

        try {
            brandService.add(brand);

            return new Result(true,"新增成功!!!");
        } catch (Exception e) {
            e.printStackTrace();
            return new Result(false,"新增失败!!!");
        }
    }

    @RequestMapping("/findOne")
    public TbBrand findOne(Long id){
        return brandService.findById(id);
    }

    @RequestMapping("/update")
    public Result update(@RequestBody TbBrand brand){
        try {
            brandService.updateBrand(brand);
            return new Result(true,"修改成功");
        } catch (Exception e) {
            e.printStackTrace();
            return  new Result(false,"修改失败");
        }
    }

    @RequestMapping("/delete")
    public Result delete(Long[] ids){
        try {
            brandService.delete(ids);
            return new Result(true,"删除成功");
        } catch (Exception e) {
            e.printStackTrace();
            return  new Result(false,"删除失败");
        }
    }
}
