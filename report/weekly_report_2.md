# Weekly Report

`Luo Xianyang` `2017-08-11`
## 本周进度
### 图片相关
- 本地图片裁剪
- 图片上传到LeanCloud并返回url
- 使用Face++识别物体
- 从Google拉取相似的物体
- 完善界面

#### LeanCloud
[LeanCloud](https://leancloud.cn/)是现在的图片后台，用来存储图片并生成图片url，步骤如下

##### 创建应用
- 登录LeanCloud控制台创建一个新应用
- 在`应用设置->设置->应用key`中获取 `App ID` & `App Key`

##### 安装与初始化
1. 下载 [av-weapp-min.js](https://unpkg.com/leancloud-storage@%5E3.0.0-alpha/dist/av-weapp-min.js) 并移动到utils目录
2. 在 `app.js` 中使用 `const AV = require('../../utils/av-weapp-min.js')` 获得 AV 的引用
3. 在 `app.js` 中初始化应用：

```javascript
AV.init({ 
 appId: 'dCvLedPXQ1BuWWP4PbSLL4DF-gzGzoHsz', 
 appKey: 'Wwl5HDlKJk4T887iXw1FwjCP', 
});

```

##### 图片上传
在 `wx.chooseImage` 的 `success` 中调用一下代码

```javascript
wx.chooseImage({
  count: 1,
  sizeType: ['original', 'compressed'],
  sourceType: ['album', 'camera'],
  success: function(res) {
    var tempFilePath = res.tempFilePaths[0];
    new AV.File('file-name', {
      blob: {
        uri: tempFilePath,
      },
    }).save().then(
      file => console.log(file.url())
    ).catch(console.error);
  }
});
```

上传成功后即可通过 `file.url()` 获得服务器端图片url

-

#### Face++
[Face++](https://www.faceplusplus.com.cn/)可识别图片中的人脸/物体，这里仅处理了物体，此请求无须申请权限

##### 安装与初始化
- 登录Face++并创建一个应用
- 在应用管理里面获取 `API key` & `API Secret`

##### 图片要求
- 图片格式：JPG(JPEG)，PNG
- 图片像素尺寸：最小48 * 48像素，最大800 * 800像素
- 图片文件大小：2MB

##### 物体识别
- 发送请求到 `
https://api-cn.faceplusplus.com/imagepp/v1/recognizetext`
- 类型：POST
- 参数：`api_key` `api_secret` `image_url`
- 返回结果：

```json
{
    "time_used": 1767,
    "scenes": [
        {
            "confidence": 100,
            "value": "Pond"
        }
    ],
    "image_id": "LSMQwfo+Na5C7PEk6r7vZg==",
    "objects": [
        {
            "confidence": 93.078,
            "value": "Rose"
        }
    ],
    "request_id": "1502183369,804066a1-3eda-4fb1-a7f4-887b70441c68"
}
```

-

#### Google Custom Search
[Google Custom Search](https://developers.google.com/custom-search/) 可以让用户自定义一个搜索引擎，现在已完成在指定网站进行图片搜索

##### 创建应用
- 在 [Google Console](https://console.developers.google.com/project) 创建一个应用
- 在 [JSON - introduction](https://developers.google.com/custom-search/json-api/v1/introduction) 界面点击 `GET A KEY` 来获取 custom search engine的 `key`
- 在 [Control Panel](https://cse.google.com/all) 选择刚刚创建的应用，在 `Basics->Details->Search engine ID` 中找到 `cx`
- 在 [Control Panel](https://cse.google.com/all) 添加想要搜索的网站

##### 搜索请求
- 发送请求到 `https://www.googleapis.com/customsearch/v1`
- 类型： GET
- 参数： `key` `cs` `q`
- 返回结果：[example](https://www.googleapis.com/customsearch/v1?key=AIzaSyAljP8hMCeAuY6h6Jl2I4CUGHCPVVsmbf8&cx=003254118020475787427:jgng_p5tzc0&q=rose)

##### 本地处理

```javascript
if (res.statusCode == 200) {
          console.log("google return 10 items")
          var urlResults = []
          for (var i = 0; i < 10; i++) {
            urlResults[i] = res.data.items[i].pagemap.cse_image[0].src
          }
          self.setData({
            imageSearchResults: urlResults
          })
        }
```

#### demo
![](./image/2/result_1.png)
![](./image/2/result_2.png)

-

### 图表相关
现可使用 [wx-charts](https://github.com/xiaolin3303/wx-charts) 作图

#### 支持类型

- 饼图   `pie`
- 圆环图 `ring`
- 线图   `line`
- 柱状图 `column`
- 区域图 `area`
- 雷达图 `radar`

#### 使用方法
- 将 `wxcharts.js` 复制到 `utils` 中
- 在 `.wxml` 中增加一个canvas，如线图 `<canvas canvas-id="lineCanvas"></canvas>`
- 在 `.js` 中调用 `new wxCharts({})`
- 所需数据如下

```javascript
canvasId: 'lineCanvas',
type: 'line',
categories: simulationData.categories,
animation: true,
background: '#f5f5f5',
series: [{
    name: '成交量1',
    data: simulationData.data,
    format: function (val, name) {
        return val.toFixed(2) + '万';
    }
}],
xAxis: {
    disableGrid: true
},
yAxis: {
    title: '成交金额 (万元)',
    format: function (val) {
        return val.toFixed(2);
    },
    min: 0
},
width: windowWidth,
height: 200,
```

#### 例子
![pieChart](https://raw.githubusercontent.com/xiaolin3303/wx-charts/master/example/pie.gif)
![ringChart](https://raw.githubusercontent.com/xiaolin3303/wx-charts/master/example/ring.gif)
![lineChart](https://raw.githubusercontent.com/xiaolin3303/wx-charts/master/example/line.gif)
![columnChart](https://raw.githubusercontent.com/xiaolin3303/wx-charts/master/example/column.gif)
![areaChart](https://raw.githubusercontent.com/xiaolin3303/wx-charts/master/example/area.gif)
![tooltip](https://raw.githubusercontent.com/xiaolin3303/wx-charts/master/example/tooltip.gif)


## 下周计划
