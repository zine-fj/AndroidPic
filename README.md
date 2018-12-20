# AndroidPic
## 此接口用的是 安卓壁纸 的接口

## 接口
1、获取分类：  
```shell
http://service.picasso.adesk.com/v1/vertical/category
```
2、分类中根据类型id获取数据：  
```shell
http://service.picasso.adesk.com/v1/vertical/category/4e4d610cdf714d2966000003
```
3、壁纸大的分类为：new 和 hot：
```shell
http://service.picasso.adesk.com/v1/vertical/category/4e4d610cdf714d2966000003/vertical?order=new
```
4、壁纸中数量：limit 一般为 40 个：
```shell
http://service.picasso.adesk.com/v1/vertical/category/4e4d610cdf714d2966000003/vertical?limit=10
```
5、skip 为省略前多少张壁纸，目前暂定 1-5000：
```shell
http://service.picasso.adesk.com/v1/vertical/category/4e4d610cdf714d2966000003/vertical?limit=10&order=new&skip=1
```

## 逻辑
1、点击 分类，最新，最热：（skip: 1，limit: 10）
```shell
http://service.picasso.adesk.com/v1/vertical/category/4e4d610cdf714d2966000003/vertical?limit=10&order=new&skip=1
```
2、下拉刷新时：（skip: 1，limit: 10）
