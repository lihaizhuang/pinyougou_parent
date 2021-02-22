package com.pinyougou.sellergoods.service;

import com.pinyougou.entity.PageResult;
import com.pinyougou.pojo.TbBrand;

import java.util.List;

/**
 * @author lihai
 * @since 2021/2/16 0016
 */
public interface BrandService {
    List<TbBrand> findAll();

    PageResult findBrandByPage(int pageNum, int pageSize);

    PageResult findBrandByPage(TbBrand brand, int pageNum, int pageSize);

    void add(TbBrand brand);

    TbBrand findById(Long id);

    void updateBrand(TbBrand brand);

    void delete(Long[] ids);
}
