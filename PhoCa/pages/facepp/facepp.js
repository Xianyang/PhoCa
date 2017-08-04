//index.js
//获取应用实例
var app = getApp()
const AV = require('../../utils/av-live-query-weapp-min.js')
const uploadToFaceppObjectDetectionUrl = "https://api-cn.faceplusplus.com/imagepp/beta/detectsceneandobject"
const faceppApiKey = "vQBn8Zwg8a5ghGhhlFGIoc3qyA_sYdat"
const faceppApiSecret = "GgtEbbVFBlSijwGiuv4mc8gO8WgWEfM6"



Page({
  data: {
    imageSrc: "",
    imageAVUrl: "",
    detect_result: "",
    uploadImageBtnDisabled: true,
    uploadToFaceppLoading: false,
    chooseImageBtnDisabled: false,
  },
  onLoad (option) {
    var self = this
    var avatar = option.avatar
    if (avatar) {
      console.log('got the image from cropper')
      wx.showLoading({
        title: 'Loading...',
      })

      // upload the image to leancloud
      new AV.File('file-name', {
        blob: {
          uri: avatar,
        },
      }).save().then((file) => {
        // file => console.log(file.url()),
        console.log('image url on leancloud is ' + file.url())
        wx.hideLoading()
        self.setData({
          imageSrc: avatar,
          uploadImageBtnDisabled: false,
          imageAVUrl: file.url(),
        })
      }).catch(console.error);
    }
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
        wx.redirectTo({
          url: `../imageCropper/imageCropper?src=${src}`
        })
      },
      fail: function({errMsg}) {
        console.log("chooseImage fail, err is", errMsg)
      }
    })
  },
  uploadImageToFacepp: function() {
    console.log("start uploading the image to face plus plus")
    // wx.showLoading({
    //   title: 'Loading...',
    // })
    var self = this
    var imageUrl = self.data.imageAVUrl
    self.setData ({
      uploadToFaceppLoading: true,
      detect_result: "",
    })

    console.log("image url is " + imageUrl)

    wx.request({
      url: uploadToFaceppObjectDetectionUrl,
      method: "POST",
      header: {
        // 'Content-Type': 'application/json'
        'content-type':'application/x-www-form-urlencoded'
      },
      data: {
        'api_key':faceppApiKey,
        'api_secret': faceppApiSecret,
        'image_url': imageUrl
      },
      success: function(res) {
        // wx.hideLoading()
        if (res.data.objects.length > 0) {
          console.log(res.data)
          wx.hideLoading()
          self.setData ({
            uploadToFaceppLoading: false,
            detect_result: res.data.objects[0].value
          })
        } else {
          console.log("no object in the picture")
          self.setData ({
            uploadToFaceppLoading: false,
            detect_result: "can not detect an object in the picture"
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
          uploadToFaceppLoading: false,
        })
      }
    })
  },
})
