let screenW;
let screenH;
let app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    picLass: [],
    picW: 0, // 图片显示宽
    picH: 0, // 图片显示高
    appUrl: app.globalData.appUrl,
    thePhpUrl: app.globalData.thePhpUrl,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getSystemInfo();
    this.getClass();
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#f05b72',
    })
  },
  // 获取手机信息
  getSystemInfo() {
    let that = this;
    let picW = this.data.picW;
    let picH = this.data.picH;
    wx.getSystemInfo({
      success(res) {
        screenW = res.windowWidth;
        screenH = res.windowHeight;
        let _picW = parseInt(screenW * 0.48);
        that.setData({
          picW: _picW,
        })
      },
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    this.getClass();
  },
  // 获取图片类别
  getClass() {
    let that = this;
    let picW = this.data.picW;
    let picH = this.data.picH;
    let appUrl = this.data.appUrl;
    let thePhpUrl = this.data.thePhpUrl;
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: `${appUrl}/v1/vertical/category`,
      success(res) {
        wx.hideLoading();
        wx.stopPullDownRefresh();
        let _picLass = res.data.res.category;
        console.log(_picLass)
        let setArr = []
        _picLass.forEach((item,index)=>{
          item.cover = `${thePhpUrl}${item.cover}`
          setArr.push({
            id: item.id,
            count: item.count,
            cover: `${thePhpUrl}${item.cover}`
          })
        });
        wx.setStorage({
          key: 'idCount',
          data: setArr,
        })
        that.setData({
          picLass: _picLass,
        });
        // 获取图片信息
        wx.getImageInfo({
          src: _picLass[0].cover,
          success(res) {
            that.setData({
              picH: (res.height / res.width) * picW
            })
          }
        });
      }
    })
  },
  // 点击单个
  clickLi(e) {
    console.log(e)
    let ecd = e.currentTarget.dataset;
    let id = ecd.id;
    let num = ecd.num;
    let name = ecd.name;
    let count = ecd.count;
    wx.navigateTo({
      url: `/pages/kind/kind?id=${id}&num=${num}&name=${name}&count=${count}`,
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let _path = '/pages/index/index';
    return {
      title: '手机壁纸',
      path: _path,
      success: function (res) {
        // 转发成功
        wx.showToast({
          title: "转发成功",
          icon: 'success',
          duration: 2000
        })
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }

})