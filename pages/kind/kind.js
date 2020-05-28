let whitch;
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    thePhpUrl: app.globalData.thePhpUrl,
    appUrl: app.globalData.appUrl,
    arrowRight: 'https://agent-app-1255417960.cos-website.ap-beijing.myqcloud.com/images/sprogress/IterationYfb/enter.png',
    picLass: [],
    textId: 0,
    imgClass: [],
    picListLiNums: app.globalData.picListLiNums, // 图片数量
    order: 'new', // 壁纸类型默认为 hot，还有一种 new
    skip: 0, // 默认为0,略过前面图片数量
    skipNumSkip: 100, // 图片数量/略过数量=页数
    limitNum: 45, // 默认每页最多有45张
    scrollTop: 0,
    isHeaderShow: false, // 头部是否显示
    x: 100,
    y: 100,
  },
  // 点击最新或最热
  bindNewHot() {
    let order = this.data.order;
    let _order = order == 'new' ? 'hot' : 'new';
    this.setData({
      order: _order,
    })
    this.getPic(whitch, _order);
    this.goTop();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // let arr = {
    //   id: "4e4d610cdf714d2966000000",
    //   name: "美女",
    //   num: "0"
    // }
    // whitch = arr;
    whitch = options;
    console.log(whitch)
    this.getClass();
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#f05b72',
    })
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
  },

  // 获取图片类别 用于头部
  getClass() {
    let that = this;
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: `${this.data.appUrl}/v1/vertical/category`,
      success(res) {
        wx.hideLoading();
        let _picLass = res.data.res.category;
        that.setData({
          picLass: _picLass,
        })
      }
    })
  },
  // 图片加载完毕
  onImageLoad(e) {
    console.log(e)
  },
  // 获取图片
  getPic(whitch, order) {
    let that = this;
    let appUrl = this.data.appUrl;
    let thePhpUrl = this.data.thePhpUrl;
    let skip = 0;
    let limitNum = this.data.limitNum;
    let picListLiNums = this.data.picListLiNums;
    wx.showLoading({
      title: '加载中...',
    });
    // 初始化时获取id、num、title
    let _url = `${appUrl}/v1/vertical/category/${whitch.id}/vertical?limit=${limitNum}&order=${order}&skip=${skip}`;
    wx.request({
      url: _url,
      success(res) {
        console.log(res)
        let idCount = wx.getStorageSync('idCount');
        idCount.forEach((item, index) => {
          if (whitch.id == item.id) {
            console.log('-----------: ', item.id, item.count)
          }
          picListLiNums.forEach((pic,picIn)=>{
            if (whitch.name == pic.rname) {
              let _skipNumSkip = 0;
              if (order == 'new') {
                if (pic.new < limitNum) {
                  _skipNumSkip = 0
                } else {
                  _skipNumSkip = Math.ceil(pic.new / limitNum)
                }
              } else if(order == 'hot') {
                if (pic.hot < limitNum) {
                  _skipNumSkip = 0
                } else {
                  _skipNumSkip = Math.ceil(pic.hot / limitNum)
                }
              }
              console.log(_skipNumSkip)
              that.setData({
                skipNumSkip: _skipNumSkip,
              })
            }
          })
          
        })
        wx.hideLoading();
        that.setData({
          imgClass: res.data.res.vertical,
          textId: whitch.num,
          limitNum: 45,
          skip: 0,
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
    let order = this.data.order;
    this.getPic(whitch, order);
    this.goTop();
  },
  // 点击上一页或下一页
  bindMorePic(e) {
    let state = e.currentTarget.dataset.state;
    let that = this;
    let skip = this.data.skip;
    let order = this.data.order;
    let picListLiNums = this.data.picListLiNums;
    let limitNum = this.data.limitNum;
    let _skipNum = 0;
    picListLiNums.forEach((pic, picIn) => {
      if (whitch.name == pic.rname) {
        if (order == 'new') {
          _skipNum = pic.new
        } else if (order == 'hot') {
          _skipNum = pic.hot
        }
        
      }
    })

    let onePage = false;
    if (_skipNum > limitNum) {
      onePage = false;
      _skipNum = _skipNum - (_skipNum % limitNum) + limitNum
    } else { // 就一页
      onePage = true;
      _skipNum = limitNum;
      skip = limitNum;
    }
    

    if (state == 'right') {
      if (skip < _skipNum) {
        skip += limitNum;
      } else {
        skip = _skipNum;
        wx.showToast({
          icon: 'none',
          title: '已经是所有图片啦~',
        })
        return
      }
      console.log(skip,_skipNum)
      that.setData({
        skip
      })
    } else if (state == 'left') {
      if (skip >= limitNum && !onePage) {
        skip -= limitNum;
      } else {
        skip = 0;
        wx.showToast({
          icon: 'none',
          title: '已经是第一页啦',
        })
        return;
      }
      that.setData({
        skip
      })
    }
    wx.showLoading({
      title: '加载中...',
    })
    let _url = `${this.data.appUrl}/v1/vertical/category/${whitch.id}/vertical?limit=${limitNum}&order=${order}&skip=${skip}`;
    console.log(_url)
    wx.request({
      url: _url,
      success(res) {
        wx.hideLoading();
        console.log('点击左右后数据：', res.data.res.vertical)
        that.setData({
          imgClass: res.data.res.vertical,
          textId: whitch.num,
          limitNum: 45
        });
      }
    });
    that.goTop();
  },

  // 失去焦点的时候
  bindBlur(e) {
    let num = e.detail.value;
    let skipNumSkip = this.data.skipNumSkip;
    let appUrl = this.data.appUrl;
    let that = this;
    let order = this.data.order;
    let limitNum = this.data.limitNum;
    let skip = num * limitNum;
    console.log(num, skip)
    if(num < 0) {
      wx.showToast({
        icon: 'none',
        title: '已经是第一页啦~',
      })
    } else if (num > skipNumSkip) {
      wx.showToast({
        icon: 'none',
        title: '超过最大页码啦~',
      })
    } else {
      wx.showLoading({
        title: '加载中...',
      });
      // 初始化时获取id、num、title
      let _url = `${appUrl}/v1/vertical/category/${whitch.id}/vertical?limit=${limitNum}&order=${order}&skip=${skip}`;
      wx.request({
        url: _url,
        success(res) {
          wx.hideLoading();
          that.setData({
            imgClass: res.data.res.vertical,
            skip
          });
        }
      });
      that.goTop();
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function(e) {

  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom(e) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    let order = this.data.order;
    this.getPic(whitch, order);
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