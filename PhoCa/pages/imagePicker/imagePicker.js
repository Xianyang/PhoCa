//index.js
//获取应用实例
var app = getApp()
const uploadToTCLUrl = "http://photo.tclrd.com.hk/szapi/upload"

Page({
  data: {
    imageSrc: "",
    uploadImageBtnDisabled: true,
    uploadToTCLLoading: false,
    chooseImageBtnDisabled: false,
  },
  onLoad (option) {
    let { avatar } = option
    if (avatar) {
      this.setData({
        imageSrc: avatar,
        uploadImageBtnDisabled: false,
      })
    }
  },
  chooseImage: function() {
    var self = this
    wx.chooseImage({
      count: 1,
      sizeType: ["compressed"],
      sourceType: ["album", "camera"],
      success: function(res) {
        console.log("chooseImage success, temp path is", res.tempFilePaths[0])
        self.setData({
          imageSrc: res.tempFilePaths[0],
          uploadImageBtnDisabled: false,
        })

        const src = res.tempFilePaths[0]
        wx.redirectTo({
          url: `../imageCropper/imageCropper?src=${src}`
        })
      },
      fail: function({errMsg}) {
        console.log("chooseImage fail, err is", errMsg)
      }
    })
  },
  uploadImageToTcl: function() {
    console.log("start uploading the image to tcl")
    var self = this
    var imageSrc = self.data.imageSrc
    self.setData ({
      uploadToTCLLoading: true,
    })

    console.log("image path is " + imageSrc)
    var time = new Date().getTime().toString()
    console.log("image name is " + time)

    wx.uploadFile({
      url: uploadToTCLUrl,
      filePath: imageSrc,
      name: "anything",
      success: function(res) {
        console.log("uploadImage success, res is:", res)
        wx.navigateTo({
          url: "../imageViewer/imageViewer",
        })
        wx.showToast({
          title: "上传成功",
          icon: "success",
          duration: 1000
        })
        self.setData ({
          uploadToTCLLoading: false,
        })
      },
      fail: function({errMsg}) {
        console.log("uploadImage fail, errMsg is", errMsg)
        wx.showToast({
          title: "上传失败",
          icon: "success",
          duration: 1000
        })
        self.setData ({
          uploadToTCLLoading: false,
        })
      }
    })
  },
})
