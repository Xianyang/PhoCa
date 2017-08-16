# Specifications for wx-app
`LUO XIANYANG` `2017-08-16`

## 基本设置
- 登录[微信公众平台](https://mp.weixin.qq.com/)，进入后台管理界面，需使用管理员的微信号扫描二维码来验证
- 阅读[开发文档](https://mp.weixin.qq.com/debug/wxadoc/dev/framework/MINA.html)
- 在`设置->开发设置->开发者ID`处获取`AppID`用于创建本地小程序

## 开发准备
### 工具
- 微信web开发者工具
    - [下载链接](https://mp.weixin.qq.com/debug/wxadoc/dev/devtools/download.html)
    - 需使用管理员/开发者的微信账号登录，并输入`AppID`来创建一个工程
    - 原生工具，开发界面不友好
    - 主要用于预览、编译、上传
- Egret Wing
    - [下载链接](https://www.egret.com/products/wing.html)
    - 第三方工具，开发界面友好
    - 主要用于编写代码以及版本控制
- Postman

    > Postman makes API development faster, easier, and better
    
    - [下载链接](https://chrome.google.com/webstore/detail/postman/fhbjgbiflinjbdggehcddcbncdddomop)
    - 用于测试http请求
    
### 基础知识
> 小程序使用js、wxml、wxss来定义界面和功能

![wx-app-framework-w550](http://i.imgur.com/O6lDwDH.png)

- javascript: 定义逻辑层，[基础知识](https://www.w3schools.com/js/default.asp)
- wxml: 微信定义的文件类型，与html相似，[基础知识](https://www.w3schools.com/html/default.asp)
- wxss: 微信定义的文件类型，月css相似，[基础知识](https://www.w3schools.com/css/default.asp)

## 进度
### 功能
1. 图像相关
    * [x] 图像上传至TCL服务器
    * [x] 图像上传至LeanCloud并返回 *url*
    * [x] 使用Face++进行图像中`物体`与`场景`的识别
    * [x] 使用Google Custom Search搜索相似的物体并展示
    * [x] 图像本地裁剪
2. 图表相关
    * [x] 使用数据生成对应图表
3. 位置相关
    * [x] 获取用户实时位置
    * [x] 在地图上显示用户的位置
    * [x] 让用户选择附近的位置

### 结构
![wx-app-structure-w600](http://i.imgur.com/QMhMp8o.png)


### 图像相关
#### 第三方组件
1. wx-cropper
    > [wx-cropper](https://github.com/dlhandsome/we-cropper) 是一款灵活小巧的canvas图片裁剪器
    
    ![screenshot-w350](http://i.imgur.com/euQ4f1Q.png)
    
    在此程序中使用了其局部裁剪图片的功能，使用方法如下
    
    **克隆wx-cropper到项目地址**
    
    ```
    cd my-project
    
    git clone https://github.com/dlhandsome/we-cropper.git
    ```
    
    **将其加到需要使用的文件中**
    
    ```javascript
    var weCropper = require('utils/weCropper')

    import weCropper from 'utils/weCropper'
    ```
    
    **在`onLoad()`函数中将其实例化**

    ```javascript
    new weCropper(cropperOpt)
    ```
    
    **缩放调整画布中的图片直到满意的状态，点击生成图片按钮，导出图片**
    
    ```javascript
    this.wecropper.getCropperImage((src) => {
        if (src) {
          wx.previewImage({
            current: '', // 当前显示图片的http链接
            urls: [src] // 需要预览的图片http链接列表
          })
        } else {
          console.log('获取图片地址失败，请稍后重试')
        }
      })
    ```
    
    详细方法参见 `pages/imageCropper/imageCropper.js`

2. LeanCloud
    > [LeanCloud](https://leancloud.cn/)是领先的移动服务端整体解决方案提供商，
    
    它现在的图片服务器，用来存储图片并生成能读取图片的url，步骤如下

    ##### 创建应用
    1. 登录LeanCloud控制台创建一个新应用
    2. 在`应用设置->设置->应用key`中获取 `App ID` & `App Key`
    
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
    在 `wx.chooseImage` 的 `success()` 中调用以下代码
    
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
    
    上传成功后即可通过 `file.url()` 获得服务器端图片 *url*。 详细方法参见 `pages/facepp/facepp.js`
    
3. Face++
    > [Face++](https://www.faceplusplus.com.cn/)人工智能开放平台是旷视科技推出的、面向开发者的开放平台。Face++以 API 或 SDK 的形式，将领先的、基于深度学习的计算机视觉技术开放给开发者
    
    它可识别图片中的人脸/物体，这里仅处理了物体，此请求无须申请权限，步骤如下

    ##### 安装与初始化
    1. 登录Face++并创建一个应用
    2. 在应用管理里面获取 `API key` & `API Secret`
    
    ##### 图片要求
    - 图片格式：JPG(JPEG)，PNG
    - 图片像素尺寸：最小48 * 48像素，最大800 * 800像素
    - 图片文件大小：2MB
    
    ##### 物体识别
    - 发送请求到 `https://api-cn.faceplusplus.com/imagepp/v1/recognizetext`
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

4. Google Customer Search
    > [Google Custom Search](https://developers.google.com/custom-search/) 可以让用户自定义一个搜索引擎
    
    本项目中使用它搜索相似的图片，现在已完成在指定网站进行图片搜索，步骤如下

    ##### 创建应用
    1. 在 [Google Console](https://console.developers.google.com/project) 创建一个应用
    2. 在 [JSON - introduction](https://developers.google.com/custom-search/json-api/v1/introduction) 界面点击 `GET A KEY` 来获取 custom search engine的 `key`
    3. 在 [Control Panel](https://cse.google.com/all) 选择刚刚创建的应用，在 `Basics->Details->Search engine ID` 中获取 `cx`
    4. 在 [Control Panel](https://cse.google.com/all) 添加想要搜索的网站
    
    ##### 搜索请求
    - 发送请求到 `https://www.googleapis.com/customsearch/v1`
    - 类型： GET
    - 参数： `key` `cs` `q`
    - 返回结果：[Example](https://www.googleapis.com/customsearch/v1?key=AIzaSyAljP8hMCeAuY6h6Jl2I4CUGHCPVVsmbf8&cx=003254118020475787427:jgng_p5tzc0&q=rose)
    
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
    
#### 功能实现

##### 图像识别与搜索
用于可从相册选择照片或拍照，裁剪后程序将识别这张照片中的场景和物体，给出结果并用Google搜索相似的照片

###### 流程
![process for image-w800](http://i.imgur.com/Eo94FOl.png)

###### 实现
1. 变量

    ```json
    data: {
        imageSrc: "", // 图片本地地址
        imageAVUrl: "", // 图片在leanCloud上的地址
        uploadBtnDisabled: true, // 禁用上传按钮
        uploadBtnLoading: false, // 上传按钮状态
        chooseImageBtnDisabled: false, // 禁用选择图片按钮
        detect_object_result: "", // 检测物体结果
        detect_scene_result: "", // 检测场景结果
        detect_result: "", // 检测结果
        scrollHidden: true, // 隐藏图片搜索结果
        preChosen: 0, // 上一次选择的结果
        isChosen: [true], // 图片选择状态数组
        imageSearchResults: [], // 图片搜索结果
    },
    ```
2. 方法
    - `onLoad()`
    
        页面首次加载时调用, 若有图片从裁剪界面传入，则会显示这张图片
        
        ```javascript
        var avatar = option.avatar
        if (avatar) {
          console.log('got the image from cropper')
          this.getImageUrl(avatar)
        }
        ```
        
    - `chooseImage()`

        用户选择照片，可从相册选择或者拍照，只可选择一张并只可选择压缩。选择成功后将跳转到图片裁剪界面并传入返回界面参数，用于返回正确的界面
        
        ```javascript
        wx.chooseImage({
          count: 1,
          sizeType: ["compressed"],
          sourceType: ["album", "camera"],
          success: function(res) {
            const src = res.tempFilePaths[0]
            wx.redirectTo({
              url: `../imageCropper/imageCropper?src=${src}&backPage=facepp`
            })
          },
          fail: function({errMsg}) {
            console.log("chooseImage fail, err is", errMsg)
          }
        })
        ```
        
    - `getImageUrl()`

        上传图片至LeanCloud并获取图片的url，[参考代码](https://leancloud.cn/docs/weapp.html#对象存储)
    
        ```javascript
        new AV.File('file-name', {
          blob: {uri: image,},
        }).save().then((file) => {
          wx.hideLoading()
          self.setData({
            imageAVUrl: file.url(),
          })
        }).catch(console.error);
        ```
        
    - `uploadImageToFacepp()`

        将图片上传至face++并返回识别结果
        - 调用 `wx.request()`向Face++发送POST请求
        - `content-type` 必须为 `application/x-www-form-urlencoded`
        - `data`中需包含 `api_key` `api_secret` `image_url`
        
        ```javascript
        wx.request({
          url: SERVER_INFO.uploadToFaceppObjectDetectionUrl,
          method: "POST",
          header: {
            'content-type':'application/x-www-form-urlencoded'
          },
          data: {
            'api_key':SERVER_INFO.faceppApiKey,
            'api_secret': SERVER_INFO.faceppApiSecret,
            'image_url': imageAVUrl
          },
          success: function(res) {
            // show the result
          },
          fail: function({errMsg}) {
            // fail to recognize image
          }
        })
        ```
        
    - `searchGoogleForImages()` 
    
        用Google搜索相似的照片
        - 调用 `wx.request()`向Face++发送POST请求
        - `data`中需包含 `key` `cx` `q`
        - `q` 为从Face++得到的结果
        
        ```javascript
        wx.request({
          url: SERVER_INFO.googleCustomSearchUrl,
          header: {
            'content-type':'application/x-www-form-urlencoded'
          },
          data: {
            'key': SERVER_INFO.googleCustomSearchKey,
            'cx': SERVER_INFO.gogoleCustomSearchCx,
            'q': query
          },
          success: function(res) {
            // show results
          },
          fail: function({errMsg}) {
          }
        })
        ```
        
    - `optionChosen()`

        用户选择一张照片时将其展示
        
        ```javascript
        var object_id = e.currentTarget.id.slice(-1);
        optionArray[preChosen] = false
        optionArray[object_id] = true
        self.setData({
          isChosen: optionArray,
          preChosen: object_id,
          imageSrc: self.data.imageSearchResults[object_id]
        })
        ```
    - `getCropperImage()`

        裁剪用户选择的图片区域，调用wx-cropper的 `getCropperImage` 方法
        
        ```javascript
        getCropperImage () {
            this.wecropper.getCropperImage((avatar) => {
              if (avatar) {
                wx.redirectTo({
                  url: `../${this.data.backPage}/${this.data.backPage}?avatar=${avatar}`,
                  // 接口调用成功的回调函数
                  success: function (res) {
                  },
                  // 接口调用失败的回调函数
                  fail: function (err) {
                  }
                })
              } else {
                console.log('获取图片失败，请稍后重试')
              }
            })
          },
        ```
        
###### demo
![demo1-w350](http://i.imgur.com/iecI7QL.gif)




-------

##### 上传图片至TCL服务器
用户可从相册选择照片或拍照，裁剪后可将这张照片上传至TCL的服务器，由于图像选取与裁剪已经介绍，在此只介绍上传至TCL服务器的实现

###### 流程
![上传图片流程-w550](http://i.imgur.com/IRduFki.png)

###### 上传方法的实现
调用微信API中的`wx.uploadFile()`方法，[官方介绍](https://mp.weixin.qq.com/debug/wxadoc/dev/api/network-file.html#wxuploadfileobject)

```javascript
wx.uploadFile({
 url: uploadToTCLUrl,
 filePath: imageSrc,
 name: "anything",
 success: function(res) {
   console.log("uploadImage success, res is:", res)
 },
 fail: function({errMsg}) {
   console.log("uploadImage fail, errMsg is", errMsg)
 }
})
```
必要参数

- `url`: 开发者服务器url
- `filePath`: 要上传文件资源的路径, **服务器接收文件的字段必须为 `filePath`
- `name`: 文件对应的 key , 开发者在服务器端通过这个 key 可以获取到文件二进制内容

###### demo
![demo2-w350](http://i.imgur.com/wsDnM1F.gif)


-----

### 图表相关
本项目使用 [wx-charts](https://github.com/xiaolin3303/wx-charts) 作图
> wx-charts是基于canvas绘制，体积小巧

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
![pieChart](https://raw.githubusercontent.com/xiaolin3303/wx-charts/master/example/pie.gif) ![ringChart](https://raw.githubusercontent.com/xiaolin3303/wx-charts/master/example/ring.gif)
![lineChart](https://raw.githubusercontent.com/xiaolin3303/wx-charts/master/example/line.gif) ![columnChart](https://raw.githubusercontent.com/xiaolin3303/wx-charts/master/example/column.gif)
![areaChart](https://raw.githubusercontent.com/xiaolin3303/wx-charts/master/example/area.gif) ![tooltip](https://raw.githubusercontent.com/xiaolin3303/wx-charts/master/example/tooltip.gif)

-----

### 定位相关
可使用微信所给接口来获取用户的位置，[详细文档](https://mp.weixin.qq.com/debug/wxadoc/dev/api/location.html#wxgetlocationobject)

#### 获取经纬度

```javascript
wx.getLocation({
 success: function (res) {
   that.setData({
     location: formatLocation(res.longitude, res.latitude)
   })
 }
})
```

#### 显示地图

```javascript
wx.openLocation({
    longitude: Number(res.longitude),
    latitude: Number(res.latitude),
})
```

#### 选择地点

```javascript
wx.chooseLocation({
 success: function (res) {
   that.setData({
     hasLocation: true,
     location: formatLocation(res.longitude, res.latitude),
     locationAddress: res.address
   })
 }
})
```

#### demo
![IMG_6250-w300](http://i.imgur.com/D93bMJT.png)![IMG_6251-w300](http://i.imgur.com/WKWkGSW.png)
![IMG_6252-w300](http://i.imgur.com/dx305Eg.png)





