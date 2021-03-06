// imageViewer.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imageSrc: "../../images/minions_1.jpeg",
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
    let { avatar } = option
    if (avatar) {
      this.setData({
        imageSrc: avatar
      })
    }
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