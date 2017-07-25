// locationMap.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
  },

  openLocation: function() {
    console.log("getting current location")
    var that = this
    that.setData({
      loading: true,
    })
    wx.getLocation({
      success: function (res) {
        that.setData({
          loading: false
        })
        console.log(res)
        wx.openLocation({
          longitude: Number(res.longitude),
          latitude: Number(res.latitude),
          // name: "name?",
          // address: "address?"
        })
      }
    })
  },
})