//facepp.js
var app = getApp()
const AV = require('../../utils/av-live-query-weapp-min.js')
const SERVER_INFO = require('../../utils/info.js').serverInfo

Page({
  data: {
    imageSrc: "", // 图片本地地址
    imageAVUrl: "", // 图片在leanCloud上的地址
    uploadBtnDisabled: true, // 禁用上传按钮
    uploadBtnLoading: false, // 上传按钮状态
    chooseImageBtnDisabled: false, // 禁用选择图片按钮
    detect_object_result: "", // 检测物体结果
    detect_scene_result: "", // 检测场景结果
    detect_result: "", // 检测结果
    scrollHidden: true, // 隐藏
    preChosen: 0,
    isChosen: [true],
    imageSearchResults: [],
  },
  onLoad (option) {
    var avatar = option.avatar
    if (avatar) {
      console.log('got the image from cropper')
      this.getImageUrl(avatar)
    }
  },
  clearResult: function () {
    this.setData({
      detect_object_result: "",
      detect_scene_result: "",
      detect_result: "",
      scrollHidden: true,
    })
  },
  // upload image to LeanCloud and return an url for the image
  getImageUrl: function (image) {
    var self = this
    wx.showLoading({
      title: 'Loading...',
    })

    // upload
    new AV.File('file-name', {
      blob: {
        uri: image,
      },
    }).save().then((file) => {
      console.log('image url on leancloud is ' + file.url())
      wx.hideLoading()
      self.setData({
        imageSrc: image,
        imageAVUrl: file.url(),
        uploadBtnDisabled: false,
      })
    }).catch(console.error);
  },
  chooseImage: function() {
    var self = this
    wx.chooseImage({
      count: 1,
      sizeType: ["compressed"],
      sourceType: ["album", "camera"],
      success: function(res) {
        const src = res.tempFilePaths[0]
        console.log("chooseImage success, temp path is", src)
        self.clearResult()
        wx.redirectTo({
          url: `../imageCropper/imageCropper?src=${src}&backPage=facepp`
        })
      },
      fail: function({errMsg}) {
        console.log("chooseImage fail, err is", errMsg)
      }
    })
  },
  uploadImageToFacepp: function() {
    console.log("start uploading the image to face plus plus")
    var self = this
    var imageAVUrl = self.data.imageAVUrl
    self.clearResult()
    self.setData ({
      uploadBtnLoading: true,
      chooseImageBtnDisabled: true,
    })

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
        if (res.data.objects.length > 0) {
          console.log(res.data)
          var object_result = res.data.objects[0].value
          self.searchGoogleForImages(object_result)
          wx.hideLoading()
          self.setData ({
            uploadBtnLoading: false,
            chooseImageBtnDisabled: false,
            detect_object_result: res.data.objects[0].value,
            scrollHidden: false,
          })
        } else {
          console.log("no object in the picture")
          self.setData ({
            uploadBtnLoading: false,
            chooseImageBtnDisabled: false,
            detect_object_result: "can not detect an object in the picture",
            scrollHidden: true,
          })
        }
      },
      fail: function({errMsg}) {
        // wx.hideLoading()
        console.log("uploadImage fail, errMsg is", errMsg)
        wx.showToast({
          title: "上传失败",
          icon: "success",
          duration: 1000
        })
        self.setData ({
          uploadBtnLoading: false,
          chooseImageBtnDisabled: false,
        })
      }
    })
  },
  searchGoogleForImages: function(query) {
    var self = this
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
      },
      fail: function({errMsg}) {

      }
    })
  },
  optionChosen: function(e) {
    var self = this
    var optionArray = self.data.isChosen;
    var preChosen = self.data.preChosen;

    var object_id = e.currentTarget.id.slice(-1);
    if (optionArray[object_id]) {
      // user chooses this option again
      return
    }

    // set new data
    console.log("user chooses option " + object_id)
    optionArray[preChosen] = false
    optionArray[object_id] = true
    self.setData({
      isChosen: optionArray,
      preChosen: object_id,
      imageSrc: self.data.imageSearchResults[object_id]
    })
  },
  scroll: function(e) {
    // nothing to do here
  },
})
