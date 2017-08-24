// credit.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    credit: "",
    buttonLoading: false,
    gender_array: ['Male', 'Female'],
    education_array:['Undergraduate', 'Master', 'Other'],
    marriage_array: ['Single', 'Married', 'Divorce'],
    estate_condition_array: ['Renting', 'Buying', 'Mortgage', 'Dormitory', 'Relation Building', 'Other', 'Unknow'],
    gender_index: 0,
    education_index: 0,
    marriage_index: 0,
    estate_condition_index: 0,
  },
  onLoad: function (options) {
  
  },
  bindGenderPickerChange: function(e) {
    this.setData({
      gender_index: e.detail.value
    })
  },
  bindEducationPickerChange: function(e) {
    this.setData({
      education_index: e.detail.value
    })
  },
  bindMarriagePickerChange: function(e) {
    this.setData({
      marriage_index: e.detail.value
    })
  },
  bindEstatePickerChange: function(e) {
    this.setData({
      estate_condition_index: e.detail.value
    })
  },

  getCredit: function() {
    var self = this
    self.setData({
      buttonLoading:true,
      credit: "",
    })
    wx.request({
      url: 'http://photo.tclrd.com.hk/credit/',
      method: 'POST',
      header: {
        'Content-Type':'application/x-www-form-urlencoded'
      },
      data: {
        'User_gender': self.data.gender_array[self.data.gender_index],
        'User_education': self.data.education_array[self.data.education_index],
        'User_marriage': self.data.marriage_array[self.data.marriage_index],
        'User_estate_condition': self.data.estate_condition_array[self.data.estate_condition_index],
      },
      success: function(res) {
        if (res.statusCode == 200) {
          self.setData({
            credit: 'Your credit score is ' + res.data,
            buttonLoading: false,
          })
        }
      },
      fail: function({errMsg}) {

      }
    }) 
  },
})