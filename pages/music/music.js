// pages/music/music.js
const util = require('../../utils/util.js');
const musicUrl = getApp().globalData.QQMusicBase;
Page({
  data: {
    isLoading: false,
    hasMore: true,
    id: 0,
    key: 579621905,
    musicList: [],
  },
  onLoad() {
    this.getList('down')
  },
  getList(type) {
    this.setData({
      isLoading: true,
      hasMore: true,
      id: 1147906982,
    })
    type === 'down' ? this.setData({ id: 1147906982 }) : null;
    util.$get(`${musicUrl}/music/tencent/songList`, { id: this.data.id,key: this.data.key }).then(res => {
      console.log(res);
      if (res.data.code === 200) {
        this.processData(type, res.data.data.songs)
      }
    }).catch(e => {
      this.setData({
        isLoading: true,
        hasMore: false
      })
      wx.stopPullDownRefresh()
      wx.showToast({ title: `网络错误!`, duration: 1000, icon: "none" })
    })
  },
  processData(type, list) {
    if (list.length) {
      list.map(v => { // 转换一下时间
        return v.post_date = util.formatTime(new Date(v.post_date), 'yyyy-MM-dd')
      })
      if (type === 'up') { // 上拉处理
        this.setData({
          musicList: this.data.musicList.concat(list)
        })
      } else { // 下拉出来
        this.setData({
          musicList: list
        })
        wx.stopPullDownRefresh()
      }
      this.setData({
        id: list[list.length - 1].id,
        isLoading: false,
        hasMore: true
      })
    } else {
      if (type === 'down') {
        wx.showToast({ title: `没有数据`, duration: 1500, icon: "none" })
        this.setData({
          isLoading: false,
          hasMore: false
        })
      } else {
        this.setData({
          isLoading: false,
          hasMore: true
        })
      }
    }

  },
  onPullDownRefresh() {
    console.log(1);
    this.getList('down')
  },
  onReachBottom() {
    if (this.data.isLoading) { // 防止数据还没回来再次触发加载
      return;
    }
    this.getList('up')
  },
  openDetail(event) {
    let item = event.currentTarget.dataset.list
    wx.navigateTo({
      url: `music-detail/music-detail?id=${item.id}&title=${item.name}`
    })
  },
  onColletionTap(event) { // 点击收藏
    // this.getPostsCollectedSyc();
    this.getPostsCollectedAsy();
  }
})
