Page({
  data:{
    text:"Image"
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
  },
  uploadImage: function() {
    wx.navigateTo({
        url: "../imagePicker/imagePicker",
    })
  }
})