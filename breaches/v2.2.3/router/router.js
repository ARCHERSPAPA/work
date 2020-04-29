import MinRouter from './MinRouter'

/*
参数
  path 路径
  name 页面名
  type  页面类型
函数
  打开新页面：this.$openPage({name:页面名,query:{传递参数}})
  获取传递的参数: this.$parseURL()

*/

// 配置路由
const router = new MinRouter({
	routes: [{
			'path': 'pages/index/index',
			'name': 'index',
			'type': 'switchTab',
			'style': {
				'navigationBarTitleText': '首页',
				'enablePullDownRefresh': true,
				'navigationBarBackgroundColor': '#000',
				'navigationBarTextStyle': 'white'
			}
		},
		{
			'path': 'pages/user/user',
			'name': 'user',
			'type': 'switchTab',
			'style': {
				'navigationBarTitleText': '我的'
			}
		},
		{
			'path': 'pages/user/info',
			'name': 'info',
			'style': {
				'navigationBarTitleText': '个人信息'
			}
		},
		{
			'path': 'pages/message/message',
			'name': 'message',
			'type': 'switchTab',
			'style': {
				'navigationBarTitleText': '在线装修'
			}
		},
		{
			'path': 'pages/search/search',
			'name': 'search',
			'style': {
				'navigationBarTitleText': '搜索'
			}
		},
		{
			'path': 'pages/chat/chat',
			'name': 'chat',
			'style': {
				'navigationBarTitleText': '消息详情'
			}
		},
		{
			'path': 'pages/area/area',
			'name': 'area',
			'style': {
				'navigationBarTitleText': '一键报价'
			}
		},
		{
			'path': 'pages/layout/layout',
			'name': 'layout',
			'style': {
				'navigationBarTitleText': '一键报价'
			}
		},
		{
			'path': 'pages/manner/manner',
			'name': 'manner',
			'style': {
				'navigationBarTitleText': '一键报价'
			}
		},
		{
			'path': 'pages/result/result',
			'name': 'result',
			'style': {
				'navigationBarTitleText': '一键报价'
			}
		},
		{
			'path': 'pages/example/example',
			'name': 'example',
			'style': {
				'navigationBarTitleText': '案例详情'
			}
		},
		{
			'path': 'pages/example/example-site',
			'name': 'exampleSite',
			'style': {
				'navigationBarTitleText': '工地实况'
			}
		},
		{
			'path': 'pages/site/site',
			'name': 'site',
			'style': {
				'navigationBarTitleText': '工地参观'
			}
		},
		{
			'path': 'pages/site-address/site-address',
			'name': 'siteAddress',
			'style': {
				'navigationBarTitleText': '工地参观'
			}
		},
		{
			'path': 'pages/out/out',
			'name': 'out',
			'style': {
				'navigationBarTitleText': 'out'
			}
		}
	]
})

router.beforeEach((to, from, next) => {
	// console.log('from---',from);
	// console.log('to---',to);

	// if (from === 'pages/index/index' && to === 'pages/my/index') {
	// 不希望跳转就传false
	// next(false)
	// 跳到指定页面
	// next('pages/test/index')
	// }
})

export default router
