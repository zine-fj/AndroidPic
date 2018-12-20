let screenW;
let screenH;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    picLass: [],
    picW: 0, // 图片显示宽
    picH: 0, // 图片显示高
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getSystemInfo();
    this.getClass();
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
   
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: 'http://service.picasso.adesk.com/v1/vertical/category',
      success(res) {
        wx.hideLoading();
        wx.stopPullDownRefresh();
        let _picLass = res.data.res.category;
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
    let id = e.currentTarget.dataset.id;
    let num = e.currentTarget.dataset.num;
    let name = e.currentTarget.dataset.name;
    wx.navigateTo({
      url: `/pages/kind/kind?id=${id}&num=${num}&name=${name}`,
    })
  },

})