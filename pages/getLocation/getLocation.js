// getLocation.js
var util = require('../../utils/util.js')
var formatLocation = util.formatLocation

Page({
  data: {
    hasLocation: false,
  },
  fetchLocation: function () {
    console.log("start to get location")
    var that = this
    wx.getLocation({
      success: function (res) {
        console.log(res)
        that.setData({
          hasLocation: true,
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