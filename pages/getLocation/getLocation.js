// getLocation.js
var util = require('../../utils/util.js')
var formatLocation = util.formatLocation

Page({
  data: {
    hasLocation: false,
    loading: false,
  },
  fetchLocation: function () {
    console.log("start to get location")
    var that = this
    that.setData({
      loading: true,
    })
    wx.getLocation({
      success: function (res) {
        console.log(res)
        that.setData({
          hasLocation: true,
          loading: false,
          location: formatLocation(res.longitude, res.latitude)
        })
      }
    })
  },
  clear: function () {
    this.setData({
      hasLocation: false
    })
  }
})