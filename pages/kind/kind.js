let whitch;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    picLass: [],
    textId: 0,
    imgClass: [],
    title: '',
    order: 'new', // 壁纸类型默认为 hot，还有一种 new
    skip: 0, // 默认为0，最大应该为5000
    skipNum: 5000,
    countNum: 10, // 每页壁纸数量
    limitNum: 40, // 默认每页最多有40张
    scrollTop: 0,
    isHeaderShow: false, // 头部是否显示
    hasMore: false,
    isTypeShow: true,
  },
  // 点击最新或最热
  newHot(e) {
    let that = this;
    let order = this.data.order;
    let theNew = e.currentTarget.dataset.type;
    let theHot = e.currentTarget.dataset.type;
    if (theNew == 'new') {
      that.setData({
        order: 'new'
      })
    } else if (theHot == 'hot') {
      that.setData({
        order: 'hot'
      })
    }
    this.getPic(whitch);
    this.goTop();
  },

  // 点击最新最热右边小箭头
  newHotShow() {
    this.setData({
      isTypeShow: !this.data.isTypeShow
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    whitch = options;
    this.getClass();
  },
  // 点击查看图片
  lookPic(e) {
    // 注意：当前图片和图片数组都应为同一路径即preview
    let src = e.currentTarget.dataset.src;
    let imgs = e.currentTarget.dataset.imgs;
    let imgUrls = [];
    imgs.forEach((item, index) => {
      imgUrls.push(item.preview)
    })
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgUrls, // 需要预览的图片http链接列表
    })
    // wx.saveImageToPhotosAlbum({
    //   filePath: src,
    //   success: function(fres) {
    //   }
    // })
  },

  // 获取图片类别 用于头部
  getClass() {
    let that = this;
    wx.showLoading({
      title: '列表加载中...',
    })
    wx.request({
      url: 'http://service.picasso.adesk.com/v1/vertical/category',
      success(res) {
        wx.hideLoading();
        let _picLass = res.data.res.category;
        that.setData({
          picLass: _picLass,
        })
      }
    })
  },
  // 获取图片
  getPic(whitch) {
    let that = this;
    let title = this.data.title;
    let order = this.data.order;
    let skip = this.data.skip;
    wx.showLoading({
      title: '首页加载中...',
    });
    // 初始化时获取id、num、title
    wx.request({
      url: `http://service.picasso.adesk.com/v1/vertical/category/${whitch.id}/vertical?limit=10&order=${order}&skip=0`,
      success(res) {
        wx.hideLoading();
        wx.stopPullDownRefresh();
        that.setData({
          imgClass: res.data.res.vertical,
          textId: whitch.num,
          countNum: 10,
          skip: 0
        });
        wx.setNavigationBarTitle({
          title: whitch.name
        });
      }
    });
  },
  // 类别点击
  textClick(e) {
    let that = this;
    whitch = e.currentTarget.dataset;
    this.getPic(whitch);
    this.goTop();
  },
  // 点击上一页或下一页
  clickMore(e) {
    let state = e.currentTarget.dataset.state;
    let that = this;
    let skip = this.data.skip;
    let order = this.data.order;
    let skipNum = this.data.skipNum;

    if (state == 'right') {
      if (skip < skipNum) {
        skip += 40;
      } else {
        skip = skipNum
      }
      that.setData({
        skip
      })
    } else if (state == 'left') {
      if (skip > 40) {
        skip -= 40;
      } else {
        skip = 0
      }
      that.setData({
        skip
      })
    }
    wx.request({
      url: `http://service.picasso.adesk.com/v1/vertical/category/${whitch.id}/vertical?limit=10&order=${order}&skip=${skip}`,
      success(res) {
        wx.hideLoading();
        that.setData({
          imgClass: res.data.res.vertical,
          textId: whitch.num,
          countNum: 10
        });
      }
    });
    that.goTop();
  },

  // 获取更多
  loadMore(whitch) {
    let countNum = this.data.countNum;
    let limitNum = this.data.limitNum;
    let that = this;
    let order = this.data.order;
    let skip = this.data.skip;
    wx.showLoading({
      title: '上拉拼命加载中',
    });
    // 假设每页壁纸最多 40 张
    if (countNum < limitNum) { // 当前数量 < 总数量
      that.setData({
        hasMore: true
      })
      countNum += 10;
    } else {
      that.setData({
        hasMore: false
      })
    }
    wx.request({
      url: `http://service.picasso.adesk.com/v1/vertical/category/${whitch.id}/vertical?limit=${countNum}&order=${order}&skip=${skip}`,
      success(res) {
        wx.hideLoading();
        that.setData({
          imgClass: res.data.res.vertical,
        });
      }
    });
    that.setData({
      textId: whitch.num,
      countNum
    });
    wx.setNavigationBarTitle({
      title: whitch.name
    });

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function(e) {
    this.getPic(whitch);
    this.setData({
      hasMore: true
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom(e) {
    this.loadMore(whitch);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.getPic(whitch);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  // 监听页面滚动
  // onPageScroll() {
  //   this.setData({
  //     isTypeShow: false
  //   })
  // },



  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  // 返回顶部
  goTop() {
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  }
})