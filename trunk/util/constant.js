export default {
	
	//工地参考bar
	siteBar: [
		{
			type: 0,
			name: "全部"
		},
		{
			type: 1,
			name: "前期"
		},
		{
			type: 2,
			name: "中期"
		},
		{
			type: 3,
			name: "后期"
		}
	],
	//搜索排序
	items:[
		{
			value: 0,
			content:"默认排序",
			actived:true
		},
		{
			value: 1,
			content:"距离从近到远",
			actived:false
		},
		{
			value: 2,
			content:"面积从大到小",
			actived:false
		},
		{
			value: 3,
			content:"面积从小到大",
			actived:false
		},
		{
			value: 4,
			content:"预算从高到低",
			actived:false
		},
		{
			value: 5,
			content:"预算从低到高",
			actived:false
		},
	],
	//工地参观排序
	workItems:[
		{
			value: 0,
			content:"默认排序",
			actived:false
		},
		{
			value: 1,
			content:"距离从近到远",
			actived:true
		},
		{
			value: 2,
			content:"面积从大到小",
			actived:false
		},
		{
			value: 3,
			content:"面积从小到大",
			actived:false
		},
		{
			value: 4,
			content:"预算从高到低",
			actived:false
		},
		{
			value: 5,
			content:"预算从低到高",
			actived:false
		}
	],
	//分页
	page: {
		pageNo: 1,
		pageSize: 20
	},
	defaultThemeColor:"#098684",
	//默认图片
	defaultImage: "http://tqiniu.madrock.com.cn/rev/case/TEST/undefined/b4f3875e-d4c4-bc08-1cc8-79d2f0ed16ee.jpg",
	//默认图上(详情、动态)
	// defaultImg:"https://qiniu.madrock.com.cn/rev/remark/ONLINE/2504/9a82d04b-6b48-b94c-ea64-738626beb666.jpg",
	// defaultImg:"https://qiniu.madrock.com.cn/rev/graph/ONLINE/2501/4e92893a-7d22-fbfa-0326-b34c09d81747.png",
	defaultImg:"https://qiniu.madrock.com.cn/rev/project/ONLINE/44/eafbac90-73ca-c682-c4f8-bfd76fa8e291.png",
	
	//默认头像图
	defaultHeadImg:"https://qiniu.madrock.com.cn/rev/remark/ONLINE/2504/d9ceca10-9291-86aa-834c-e1b522dd0b22.png",
	//默认用户登录时的图标
	defaultIconImgs:["https://qiniu.madrock.com.cn/rev/remark/ONLINE/2504/eee4b30b-5a0c-acbe-aaf9-7aaf5a8f638e.png","https://qiniu.madrock.com.cn/rev/remark/ONLINE/2504/30f4c161-cb4d-a0c0-b41f-f4b86799ed32.png","https://qiniu.madrock.com.cn/rev/remark/ONLINE/2504/3828089e-139b-1be6-2b42-481cf395eef3.png"],
	//空白数据显示图片
	defaultEmptyImg:"https://qiniu.madrock.com.cn/rev/remark/ONLINE/2504/adcfaf11-15e7-b0d9-b257-f7e80a6af536.jpg",
	//默认首页图片组
	// defaultHomeImgs:["https://qiniu.madrock.com.cn/rev/remark/ONLINE/2504/c265b06e-ecaf-4131-d762-3d2bb0afff77.jpg","https://qiniu.madrock.com.cn/rev/remark/ONLINE/2504/11ff5804-b76f-44d3-a42e-fc5eb268aa6e.jpg","https://qiniu.madrock.com.cn/rev/remark/ONLINE/2504/fdce60b3-343e-98ce-4e43-c321d7195eae.jpg"],
	defaultHomeImgs:["https://qiniu.madrock.com.cn/rev/project/ONLINE/44/1960a214-13b6-6338-a73d-409929a9129e.jpg","https://qiniu.madrock.com.cn/rev/project/ONLINE/44/bd0febd5-5a5a-36d9-d96c-6c32b2621003.jpg","https://qiniu.madrock.com.cn/rev/project/ONLINE/44/0792ca0e-d7fe-0805-f591-ebf9050da989.jpg"],
	//默认导出图片时的图片
	// defaultQrcodeHeadImg:"https://qiniu.madrock.com.cn/rev/case/ONLINE/2888/d704f7a9-85fa-e0cf-794f-191c0788c420.jpg",	
	defaultQrcodeHeadImg:"https://qiniu.madrock.com.cn/rev/project/ONLINE/44/c6eae5f8-6c0a-9fba-98f8-13662759072f.jpg",
	//默认二维码图片
	defaultQrcodeImg:"https://qiniu.madrock.com.cn/rev/graph/ONLINE/2848/29328fa6-49fd-3e41-84ca-79faf30dbb44.png",
	//分享到朋友的小图片5：4
	defaultShareImg:"https://qiniu.madrock.com.cn/rev/graph/ONLINE/3034/82056f31-1da1-91ce-6f55-9ecad2ebcc45.png",
	//默认分享图片时的背景照
	defaultShareBg:["https://qiniu.madrock.com.cn/rev/remark/ONLINE/3034/3cf5deb6-9c8d-8178-ce23-11d57ac25d25.png"],
	//置顶
	// defaultBackTop:"https://qiniu.madrock.com.cn/rev/graph/ONLINE/198/d95806d0-1241-6305-5ae0-58f90ea2fcc1.png",
	//授权登录页面图片
	authImg:"https://qiniu.madrock.com.cn/rev/project/ONLINE/44/98f5bd8a-9c19-0f21-a876-28e9b3df62c3.png",
		
	//记录
	records: [{
		coverImg: [
			"https://qiniu.madrock.com.cn/rev/remark/ONLINE/2504/9a82d04b-6b48-b94c-ea64-738626beb666.jpg"
		],
		state: Math.floor(Math.random() * 5 + 1),
		finalPrice: (Math.random() * 100000000),
		decorationType: '新房装修',
		customerHouseType: '3室2卫',
		customerHouseArea: Math.floor(Math.random() * 100 + 1),
		time: new Date().getTime(),
		customerHouseAddress: "两江国际社区"
	}],
	// 位置定位后的项目
	siteList: [{
		coverImgs: [
			"https://qiniu.madrock.com.cn/rev/remark/ONLINE/2504/9a82d04b-6b48-b94c-ea64-738626beb666.jpg"
		],
		createTime: new Date().getTime(),
		customerAreaName: "青羊区",
		customerCityName: "成都市",
		customerHouseAddress: "新建项目",
		customerGpsAddress: "成都高新区天府大道399号",
		customerHouseArea: Math.floor(Math.random() * 100 + 1),
		customerHouseAreaVal: Math.floor(Math.random() * 100 + 1),
		customerHouseType: "1室1卫",
		distance: 6.694,
		fabulousCount: 0,
		id: 1325,
		latitude: "30.67754",
		longitude: "104.071528",
		stage: Math.floor(Math.random() * 5 + 1),
		stageName: "1阶段",
		totalPrice: (Math.random() * 100000000)
	}],
	// 装修类型
	topItems: [{
			id: 1111,
			src: "https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3278128204,644852052&fm=26&gp=0.jpg",
			text: "整体装修"
		},
		{
			id: 1112,
			src: "https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3278128204,644852052&fm=26&gp=0.jpg",
			text: "精装房改造"
		},
		{
			id: 1113,
			src: "https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3278128204,644852052&fm=26&gp=0.jpg",
			text: "老房翻新"
		},
		{
			id: 1114,
			src: "https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3278128204,644852052&fm=26&gp=0.jpg",
			text: "整体装修"
		},
		{
			id: 1115,
			src: "https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3278128204,644852052&fm=26&gp=0.jpg",
			text: "出租房装修"
		},
		{
			id: 1116,
			src: "https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3278128204,644852052&fm=26&gp=0.jpg",
			text: "店铺装修"
		},
		{
			id: 1117,
			src: "https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3278128204,644852052&fm=26&gp=0.jpg",
			text: "办公室装修"
		},
		{
			id: 1118,
			src: "https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3278128204,644852052&fm=26&gp=0.jpg",
			text: "别墅大宅"
		},
		{
			id: 1119,
			src: "https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3278128204,644852052&fm=26&gp=0.jpg",
			text: "出租房装修"
		},
		{
			id: 1120,
			src: "https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3278128204,644852052&fm=26&gp=0.jpg",
			text: "预算有限"
		}
	],
	//查询keys
	searchKeys:["houseType","budget","area","styleType","worked"],
	headKey:"decorateType"
}
