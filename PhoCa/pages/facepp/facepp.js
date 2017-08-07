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
    uploadBtnDisabled: true,
    uploadBtnLoading: false,
    chooseImageBtnDisabled: false,
    detect_object_result: "",
    detect_scene_result: "",
    detect_result: "",
    scrollHidden: true,
    minions: ["../../images/minions_1.jpeg",
    "../../images/minions_2.jpeg",
    "../../images/minions_3.jpeg",
    "../../images/minions_4.jpeg",
    "../../images/minions_5.jpeg",
    "../../images/minions_6.jpeg",
    "../../images/minions_7.jpeg",
    "../../images/minions_8.jpeg",
    "../../images/minions_9.jpeg",
    "../../images/minions_10.jpeg",
    ],
    preChosen: 0,
    isChosen: [true],
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
  getImageUrl: function (image) {
      var self = this
      wx.showLoading({
        title: 'Loading...',
      })

      // upload the image to leancloud
      new AV.File('file-name', {
        blob: {
          uri: image,
        },
      }).save().then((file) => {
        // file => console.log(file.url()),
        console.log('image url on leancloud is ' + file.url())
        wx.hideLoading()
        self.setData({
          imageSrc: image,
          uploadBtnDisabled: false,
          imageAVUrl: file.url(),
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
    var imageUrl = self.data.imageAVUrl
    self.clearResult()
    self.setData ({
      uploadBtnLoading: true,
      chooseImageBtnDisabled: true,
    })

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
        // show the result
        if (res.data.objects.length > 0) {
          console.log(res.data)
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
            scrollHidden: false,
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
  optionChosen: function(e) {
    var that = this
    var optionArray = that.data.isChosen;
    var preChosen = that.data.preChosen;

    var object_id = e.currentTarget.id.slice(-1);
    if (optionArray[object_id]) {
      return
    }

    // set new data
    console.log("user chooses option " + object_id)
    optionArray[preChosen] = false
    optionArray[object_id] = true
    that.setData({
      isChosen: optionArray,
      preChosen: object_id,
      imageSrc: that.data.minions[object_id]
    })
  },
  scroll: function(e) {
    
  },
})
