package com.pinyougou.entity;

import java.io.Serializable;
import java.util.List;

/**
 * @author lihai
 * @since 2021/2/21 0021
 */
public class PageResult implements Serializable{
    private Long total;
    private List rows;

    public PageResult(Long total, List rows) {
        this.total = total;
        this.rows = rows;
    }

    public Long getTotal() {
        return total;
    }

    public void setTotal(Long total) {
        this.total = total;
    }

    public List getRows() {
        return rows;
    }

    public void setRows(List rows) {
        this.rows = rows;
    }
}
