package com.pinyougou.shop.controller;

import com.pinyougou.entity.Result;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import util.FastDFSClient;

import java.io.File;
import java.io.IOException;

/**
 * @author lihai
 * @since 2021/3/2 0002
 */
@RestController
public class UploadController {
    //开发思路:
    //1.取文件扩展名
    //2.创建FastDFS客户端
    //3.客户端上传图片后，将获取的路径拼接全路径后
    //4.进行Result返回，success的时候返回图片路径给页面

    @Value("${FILE_SERVER_URL}")
    private String file_url;// 文件服务器地址 springmvc读取application.properties

    @RequestMapping("/upload")
    public Result upload(MultipartFile file) {
        // 1、 取文件的扩展名
        String originalFilename = file.getOriginalFilename();
        String extName = originalFilename.substring(originalFilename.lastIndexOf(".")+ 1);
        try {
            // 2、 创建一个 FastDFS 的客户端
            FastDFSClient fastDFSClient = new FastDFSClient("classpath:config/fdfs_client.conf");
            // 3、 执行上传处理
            String path = fastDFSClient.uploadFile(file.getBytes(), extName);
            // 4、 拼接返回的 url 和 ip 地址， 拼装成完整的 url
            String url = file_url + path;

            return new Result(true, url);
        } catch (Exception e) {
            e.printStackTrace();
            return new Result(false, "上传失败");
        }
    }
}
