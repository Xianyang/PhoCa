//index.js
//获取应用实例
var app = getApp()

const uploadFileUrl = "http://photo.tclrd.com.hk/api/image"

Page({
  data: {
    imageSrc: "",
    uploadImageBtnDisabled: true,
    uploadimageBtnLoading: false,
    chooseImageBtnDisabled: false,
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
      },
      fail: function({errMsg}) {
        console.log("chooseImage fail, err is", errMsg)
      }
    })
  },
  uploadImage: function() {
    console.log("start uploading the image")
    var self = this
    var imageSrc = self.data.imageSrc
    self.setData ({
      uploadimageBtnLoading: true,
    })

    console.log(imageSrc)
    console.log(uploadFileUrl)

    wx.uploadFile({
      url: uploadFileUrl,
      filePath: imageSrc,
      name: "123",
      imageid: "123",
      success: function(res) {
        console.log("uploadImage success, res is:", res)
        wx.showToast({
          title: "上传成功",
          icon: "success",
          duration: 1000
        })
        self.setData ({
          uploadimageBtnLoading: false,
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
          uploadimageBtnLoading: false,
        })
      }
  })
  },
})
