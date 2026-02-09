export default {
  pages: [
    'pages/home/index',
    'pages/rewards/index',
    'pages/stats/index',
    'pages/moments/index',
    'pages/profile/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#F0F4FF',
    navigationBarTitleText: '磁贴大挑战',
    navigationBarTextStyle: 'black',
    backgroundColor: '#F0F4FF'
  },
  tabBar: {
    color: '#9CA3AF',
    selectedColor: '#EC4899',
    backgroundColor: '#FFFFFF',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '首页'
      },
      {
        pagePath: 'pages/rewards/index',
        text: '梦想屋'
      },
      {
        pagePath: 'pages/stats/index',
        text: '统计'
      },
      {
        pagePath: 'pages/moments/index',
        text: '美好'
      },
      {
        pagePath: 'pages/profile/index',
        text: '我的'
      }
    ]
  }
}
