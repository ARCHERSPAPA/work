<template>
	<view class="mkb-activity">
		<view v-if="coloration" class="activity-home" :style="{'background': homeStyle}">
			<view class="home-img" v-if="activityHomeImgs && activityCntImgs.length > 0">
				<view v-for="(ahImg,index) of activityHomeImgs" :key="index">
					<image :src="ahImg.image+'?imageslim'" mode="widthFix" lazy-load="true" class="image" />
				</view>
			</view>

			<view class="home-cnt">
				<view class="home-cnt-side1">
					<view class="side-activity">
						<!--标题名称-->
						<view class="side-activity-title" :style="{'border-color': themeColor,'box-shadow':titleBoxShadowStyle,'background-color':themeColor}">
							<text class="title-text" :style="{'color': themeColor}" v-if="nickname">发起人:{{nickname}}</text>
							<text class="title-text" :style="{'color': themeColor}" v-else>好友助力抢福利</text>
							<view class="title-mask"></view>
						</view>
						<!--倒计时-->
						<view class="side-activity-interval" v-if="isOnline === 1">
							<text class="interval-text" :style="{'color': themeColor}">还剩</text>
							<text class="interval-time" :style="{'background-color': themeColor}">{{hour >= 10?hour:'0'+hour}}</text>
							<text class="interval-mark" :style="{'color': themeColor}">:</text>
							<text class="interval-time" :style="{'background-color': themeColor}">{{minute >= 10? minute:'0'+minute}}</text>
							<text class="interval-mark" :style="{'color': themeColor}">:</text>
							<text class="interval-time" :style="{'background-color': themeColor}">{{seconds >= 10? seconds:'0'+seconds}}</text>
							<text class="interval-text" :style="{'color': themeColor}">结束</text>
						</view>
						<!--活动还未开始-->
						<view class="side-activity-interval" v-if="isOline === 0 || rawTime">
							<text class="interval-text" :style="{'color': themeColor}" v-if="activityST">活动将于{{activityST |format('MM月dd日hh时')}}开始,敬请期待！</text>
							<text class="interval-text" :style="{'color': themeColor}" v-else>活动尚未开始，敬请期待！</text>
						</view>
						<view class="side-activity-interval" v-if="isOnline === 2 || activityDown">
							<text class="interval-text" :style="{'color': themeColor}" v-if="activityET">活动已于{{activityET | format('MM月dd日hh时')}}结束！</text>
							<text class="interval-text" :style="{'color': themeColor}" v-else>活动已结束！</text>
						</view>

						<!--提示文本-->
						<view class="side-activity-text" v-if="(!finishEvent() && !activitySpill)">
							<view class="side-activity-text-block icon-left">
								<view class="icon-line" :style="{'background-color': themeColor}"></view>
								<view class="icon-circle" :style="{'background-color': themeColor}"></view>
							</view>
							<view class="side-activity-text-block">还差<text :style="{'color':themeColor}">{{total - getFill()}}</text>人助力</view>
							<view class="side-activity-text-block icon-right">
								<view class="icon-line" :style="{'background-color': themeColor}"></view>
								<view class="icon-circle" :style="{'background-color': themeColor}"></view>
							</view>
						</view>


						<view class="side-activity-text" v-if="(finishEvent() || activitySpill)">
							<view class="side-activity-text-block icon-left">
								<view class="icon-line" :style="{'background-color': themeColor}"></view>
								<view class="icon-circle" :style="{'background-color': themeColor}"></view>
							</view>
							<view class="side-activity-text-block" v-if="role === 1 && code">恭喜您完成全部<text :style="{'color':themeColor}">{{total}}</text>人助力</view>
							<view class="side-activity-text-block" v-else-if="!finishEvent()">还差<text :style="{'color':themeColor}">{{total - getFill()}}</text>人助力</view>
							<view class="side-activity-text-block" v-else>TA已完成全部<text :style="{'color':themeColor}">{{total}}</text>人助力</view>
							<view class="side-activity-text-block icon-right">
								<view class="icon-line" :style="{'background-color': themeColor}"></view>
								<view class="icon-circle" :style="{'background-color': themeColor}"></view>
							</view>
						</view>




						<!--完成时获得验证码-->
						<view class="side-activity-code" v-if="(finishEvent() || activitySpill) && role === 1 && code">
							<text class="code-title" :style="{'color': themeColor}">以下是您获得的验证码</text>
							<view class="code-rand">
								<text class="code-rand-text" :style="{'color': themeColor}">{{code}}</text>
								<view class="code-rand-mask" :style="{'background-color': themeColor}"></view>
							</view>
						</view>

						<!--进度条-->
						<!-- <view class="side-activity-progress" v-if="(activityTime || rawTime) && (!finishEvent && selfDoing || otherDoing)"> -->
						<view class="side-activity-progress" v-if="loginStatus === 1 && role !== 1">
							<progress :percent="getPercent()" :activeColor="themeColor" active stroke-width="8" border-radius="16" :duration="10" />
							<view class="progress-text">
								<view class="progress-text-start">
									<view class="triggle" :style="{'border-color':progressTriggleStyle(getPercent(),0)}"></view>
									<text class="text" :style="{color:progressTextStyle(getPercent(),0)}">开始</text>
									<view class="mask" :style="{'background-color':progressMaskStyle(getPercent(),0)}"></view>
								</view>
								<view class="progress-text-middle">
									<view class="triggle" :style="{'border-color':progressTriggleStyle(getPercent(),50)}"></view>
									<text class="text" :style="{color:progressTextStyle(getPercent(),50)}">只剩一半啦</text>
									<view class="mask" :style="{'background-color':progressMaskStyle(getPercent(),50)}"></view>
								</view>
								<view class="progress-text-end">
									<view class="triggle" :style="{'border-color':progressTriggleStyle(getPercent(),100)}"></view>
									<text class="text" :style="{color:progressTextStyle(getPercent(),100)}">完成</text>
									<view class="mask" :style="{'background-color':progressMaskStyle(getPercent(),100)}"></view>
								</view>
							</view>
						</view>

						<view class="side-activity-progress" v-if="loginStatus === 1 && role === 1 && !finishEvent()">
							<progress :percent="getPercent()" :activeColor="themeColor" active stroke-width="8" border-radius="16" />
							<view class="progress-text">
								<view class="progress-text-start">
									<view class="triggle" :style="{'border-color':progressTriggleStyle(getPercent(),0)}"></view>
									<text class="text" :style="{color:progressTextStyle(getPercent(),0)}">开始</text>
									<view class="mask" :style="{'background-color':progressMaskStyle(getPercent(),0)}"></view>
								</view>
								<view class="progress-text-middle">
									<view class="triggle" :style="{'border-color':progressTriggleStyle(getPercent(),50)}"></view>
									<text class="text" :style="{color:progressTextStyle(getPercent(),50)}">只剩一半啦</text>
									<view class="mask" :style="{'background-color':progressMaskStyle(getPercent(),50)}"></view>
								</view>
								<view class="progress-text-end">
									<view class="triggle" :style="{'border-color':progressTriggleStyle(getPercent(),100)}"></view>
									<text class="text" :style="{color:progressTextStyle(getPercent(),100)}">完成</text>
									<view class="mask" :style="{'background-color':progressMaskStyle(getPercent(),100)}"></view>
								</view>
							</view>
						</view>

						<view class="side-activity-progress" v-if="loginStatus === 0">
							<progress :percent="getPercent()" :activeColor="themeColor" active stroke-width="8" border-radius="16" />
							<view class="progress-text">
								<view class="progress-text-start">
									<view class="triggle" :style="{'border-color':progressTriggleStyle(getPercent(),0)}"></view>
									<text class="text" :style="{color:progressTextStyle(getPercent(),0)}">开始</text>
									<view class="mask" :style="{'background-color':progressMaskStyle(getPercent(),0)}"></view>
								</view>
								<view class="progress-text-middle">
									<view class="triggle" :style="{'border-color':progressTriggleStyle(getPercent(),50)}"></view>
									<text class="text" :style="{color:progressTextStyle(getPercent(),50)}">只剩一半啦</text>
									<view class="mask" :style="{'background-color':progressMaskStyle(getPercent(),50)}"></view>
								</view>
								<view class="progress-text-end">
									<view class="triggle" :style="{'border-color':progressTriggleStyle(getPercent(),100)}"></view>
									<text class="text" :style="{color:progressTextStyle(getPercent(),100)}">完成</text>
									<view class="mask" :style="{'background-color':progressMaskStyle(getPercent(),100)}"></view>
								</view>
							</view>
						</view>




						<!--助力功能-->
						<view class="side-activity-btns" v-if="isAant() && !activitySpill">
							<button class="btn-fight" open-type="getUserInfo" v-if="loginStatus === 0" @getuserinfo="getUserInfo($event,'fight')"
							 :style="{'background-color':themeColor,'box-shadow':fightStyle}">一键帮TA助力</button>
							<button class="btn-fight" @tap.stop="fightActivity" v-if="loginStatus ===  1 && !fightState()" :style="{'background-color':themeColor,'box-shadow':fightStyle}">一键帮TA助力</button>

							<button class="btn-fight disabled" v-if="loginStatus ===  1 && fightState()" :style="{'background-color':themeColor,'box-shadow':fightStyle}">已为TA助力</button>

							<button class="btn-share" open-type="getUserInfo" @getuserinfo="getUserInfo($event,'share',2)" v-if="loginStatus === 0"
							 data-state="2" :style="{'border-color':themeColor,color:themeColor}">邀请好友为TA助力</button>
							<button class="btn-share" open-type="share" data-state="2" v-if="loginStatus ===  1" :style="{'border-color':themeColor,color:themeColor}">邀请好友为TA助力</button>
						</view>


						<view class="side-activity-btns" v-if="!finishEvent() && !activitySpill && role === 1">
							<button class="btn-fight" open-type="getUserInfo" @getuserinfo="getUserInfo($event,'share',1)" v-if="loginStatus === 0"
							 data-state="1" :style="{'background-color':themeColor,'box-shadow':fightStyle}">邀请好友为我助力</button>
							<button class="btn-fight" open-type="share" data-state="1" v-if="loginStatus === 1" :style="{'background-color':themeColor,'box-shadow':fightStyle}">邀请好友为我助力</button>

							<button class="btn-share" open-type="getUserInfo" @getuserinfo="getUserInfo($event,'poster',1)" v-if="loginStatus === 0"
							 :style="{'border-color':themeColor,color:themeColor}">生成海报</button>
							<button class="btn-share" @tap="getQrcodeImg(hostId)" v-if="loginStatus === 1" :style="{'border-color':themeColor,color:themeColor}">生成海报</button>
						</view>

						<!--功能控制-->
						<view class="side-activity-fb" v-if="isAant() && !activitySpill">
							<button class="fb-flex" open-type="getUserInfo" @getuserinfo="getUserInfo($event,'share',1)" v-if="loginStatus === 0 && isAant()">
								<view class="fb-flex-icon">
									<uni-icons type="zhuli" :color="themeColor" size="60"></uni-icons>
								</view>
								<text class="fb-flex-text" :style="{color:themeColor}">邀请好友为我助力</text>
							</button>
							<button class="fb-flex" open-type="share" data-state="1" v-if="loginStatus === 1 && isAant()">
								<view class="fb-flex-icon">
									<uni-icons type="zhuli" :color="themeColor" size="60"></uni-icons>
								</view>
								<text class="fb-flex-text" :style="{color:themeColor}">邀请好友为我助力</text>
							</button>

							<button class="fb-flex" open-type="getUserInfo" @getuserinfo="getUserInfo($event,'poster',1)" v-if="loginStatus === 0">
								<view class="fb-flex-icon">
									<uni-icons type="haibao" :color="themeColor" size="60"></uni-icons>
								</view>
								<text class="fb-flex-text" :style="{color:themeColor}">生成我的助力海报</text>
							</button>
							<button class="fb-flex" @tap="getQrcodeImg(guestId)" v-if="loginStatus === 1 && isAant()">
								<view class="fb-flex-icon">
									<uni-icons type="haibao" :color="themeColor" size="60"></uni-icons>
								</view>
								<text class="fb-flex-text" :style="{color:themeColor}">生成我的助力海报</text>
							</button>
						</view>

						<view class="side-activity-state" v-if="activitySpill && ((!code && role === 1) || (role !== 1))">
							<view class="state-circle">
								<uni-icons type="tishi" :color="themeColor" size="80" />
								<view class="state-circle-mask" :style="{'background-color': themeColor}"></view>
							</view>
							<text class="state-text" :style="{'color':themeColor}">很遗憾，活动奖励{{limit}}人已全部产生， 下次再来吧！</text>
						</view>

					</view>

					<!--提示文本助力人数-->
					<view class="side-activity-text side-info-text" v-if="getFill()">
						<view class="side-activity-text-block icon-left">
							<view class="icon-line" :style="{'background-color': themeColor}"></view>
							<view class="icon-circle" :style="{'background-color': themeColor}"></view>
						</view>
						<view class="side-activity-text-block">已有<text :style="{'color': themeColor}">{{getFill()}}</text>人助力</view>
						<view class="side-activity-text-block icon-right">
							<view class="icon-line" :style="{'background-color': themeColor}"></view>
							<view class="icon-circle" :style="{'background-color': themeColor}"></view>
						</view>
					</view>

					<view class="side-imgs">
						<scroll-view scroll-x="true" v-if="headImgs && headImgs.length > 0">
							<view v-for="(item,index) of headImgs" :key="index" class="side-imgs-item">
								<image :src="item.headImg" lazy-load="true" />
							</view>
						</scroll-view>
					</view>

					<view class="side-mask"></view>
				</view>

				<view class="home-cnt-side2" v-if="activityCntImgs && activityCntImgs.length > 0">
					<view v-for="(actImg,index) of activityCntImgs" :key="index" v-if="index > 0">
						<image :src="actImg.image+'?imageslim'" mode="widthFix" lazy-load="true" />
					</view>
				</view>

			</view>
		</view>


		<!-- <canvas canvas-id="img" :style="{'width':width+'px','height':height+'px'}"></canvas> -->
		<canvas class="poster-canvas" canvas-id="img" style="width:4px;height:2px;"></canvas>
		<canvas class="poster-canvas" canvas-id="poster" style="width:1242px;height:2200px"></canvas>
		<view class="poster" v-if="posterBool" @tap.stop="closePoster">
			<view class="poster-close">
				<uni-icons color="rgba(255,255,255,1)" size="40" type="guanbi" />
			</view>
			<view class="poster-img">
				<cover-image class="image" :src="posterImg"></cover-image>
			</view>
			<view class="poster-btns">
				<button class="poster-btns-item" @tap.stop="savePhoto">保存到手机</button>
			</view>
		</view>
	</view>
</template>

<script>
	import Messages from '../../util/messages.js';
	import {
		getColor,
		getQueryString
	} from '../../util/util.js';
	import {
		shareWechat,
		sharePosterByImg
	} from '../../util/share.js';
	import Constant from '../../util/constant.js';
	import {
		wxCheckLogin,
		wxUserRand,
		wxAuthLogin
	} from '../../util/login.js';
	export default {
		data() {
			return {
				isAuth: false, //是否用户授权
				eventId: null, //活动id
				hostId: null, //参与都id
				guestId: null, //助力者id
				themeColor: "rgba(251,69,41,1)",
				gradientColor: "rgba(251,69,41,1)",
				coloration: false, //读取头部图片颜色是否已经完成 
				total: 0, //总共参与人数
				limit: 0, //
				headImgs: [], //获得的助力用户信息
				code: null, //获得的随机验证码
				//canvas 渲染
				width: 10,
				height: 10,
				activityHomeImgs: [],
				activityCntImgs: [],
				//分享时的信息
				// shareImg:"https://qiniu.madrock.com.cn/rev/project/ONLINE/44/8a3507ab-c673-e3e2-667d-f5d4492d0e9b.png",
				shareImg: "https://qiniu.madrock.com.cn/rev/project/ONLINE/44/fe397852-12d0-916f-8dfc-cfe89ac0c36f.jpg",
				// shareTitle:"我正在抢618装修大礼包",
				shareTitle: "我正在抢618年中装修大礼包，请为我助力！",
				shareBgImg: "https://qiniu.madrock.com.cn/rev/project/ONLINE/44/3e9d4abc-c2b4-7acf-aa2e-91ca86b080ce.jpg",
				// shareBgImgs:['https://qiniu.madrock.com.cn/rev/project/ONLINE/44/8e92ccfb-9bd5-5d46-6198-1ecf6ced3669.jpg',
				// 'https://qiniu.madrock.com.cn/rev/project/ONLINE/44/e3929706-485f-7eb6-3bda-9175cde89ffd.jpg','https://qiniu.madrock.com.cn/rev/project/ONLINE/44/a3667085-d662-cc01-9d39-9bb4cb8270fd.jpg','https://qiniu.madrock.com.cn/rev/project/ONLINE/44/6527b67a-2b3c-7466-b198-d6e6947f1af0.jpg'],
				shareBgImgs:['https://qiniu.madrock.com.cn/rev/project/ONLINE/44/6654df11-ab3d-1dfa-531e-a35f751b321e.jpg','https://qiniu.madrock.com.cn/rev/project/ONLINE/44/0fd489dd-8bae-fec5-75f9-a4fc872e02ab.jpg','https://qiniu.madrock.com.cn/rev/project/ONLINE/44/e06da53f-80fe-4480-f1b4-c7696bef044b.jpg','https://qiniu.madrock.com.cn/rev/project/ONLINE/44/d9d2b87c-fe86-a595-3f41-d289992dd3bc.jpg'],
				qrImg: null,
				posterImg: null,
				posterBool: false,

				//倒计时钟显示
				hour: 0,
				minute: 0,
				seconds: 0,
				//活动状态码
				status: 0,
				//用户相关 0:发起人; 1: 助力人，2：其它人
				role: 3,
				//发起人昵称
				nickname: null,
				//是否已经上线 （0:未上线，1:已上线;2:已下线,3:其它）
				isOnline: 3,
				//分享来源(true:从banner,false:其它链接分享)
				state: true,
				//活动开启时间
				activityST: null,
				//活动截止时间
				activityET: null,

				//倒计时的定时器
				dsq: null,
				loginStatus: 0,
				renderColorId: "img",
				renderPosterId: "poster",
				readColorImg: "https://qiniu.madrock.com.cn/rev/project/ONLINE/44/7b2ee46d-1fcf-1a86-8e4f-91cc51aeb151.png"
			};
		},

		computed: {
			/**
			 * 0, "活动已下线" 1, "上线中" 2, "活动不存在" 3, "活动未开始" 4, "活动已结束" 5,"活动人数已达上限"
			 */
			//活动时间控制
			activityTime() {
				return this.status === 1;
			},
			//未开始
			rawTime() {
				return this.status === 3;
			},
			//活动已达上限
			activitySpill() {
				return this.status === 5;
			},
			//活动已结束
			activityTimeout() {
				return this.status === 4;
			},
			//活动已下线
			activityDown() {
				return this.status === 0;
			},


			//样式控制
			titleBoxShadowStyle() {
				return `0 3.62rpx 7.24rpx ${this.setColorOpcity(this.themeColor,50)}`;
			},


			fightStyle() {
				return `0 21.73rpx 43.47rpx ${this.setColorOpcity(this.themeColor,50)}`;
			},

			homeStyle() {
				// return  `linear-gradient(180deg,${this.themeColor} 0%,${this.gradientColor} 100%)`;
				return `${this.gradientColor}`;
			},



		},

		onLoad(options) {
			console.log(options);
			// this.eventId = options.eventId?options.eventId: 2;
			this.eventId = options.eventId ||
				getQueryString('eventId', decodeURIComponent(options.scene)) ||
				this.$parseURL().eventId;

			this.hostId = options.hostId ||
				getQueryString('hostId', decodeURIComponent(options.scene)) ||
				this.$parseURL().hostId;

			//如果有host 就外部分享，0就表示从banner分享
			this.state = this.hostId ? false : true;

			console.log("this options hostId===" + this.hostId);
			console.log("this options eventId====" + this.eventId);

			//获取当前用户的登录状态（方便用户后期授权）
			this.loginStatus = this.$store.state.loginStatus;
			console.log("login status is:", this.loginStatus);
			//检查是否已经登录
			if (!this.loginStatus && this.hostId) {
				this.checkUserLogin();
			} else {
				if (this.hostId) {
					this.guestId = this.$store.state.userInfo.userId;
				} else {
					this.hostId = this.$store.state.userInfo.userId;
				}
				this.getEventDetail();
			}


			//加载数据详情
			// this.getEventDetail();

		},

		methods: {

			setColorOpcity(color, opacity) {
				let reg = /^rgba\((\d+),\s*(\d+),\s*(\d+),\s*(\d+)\)$/;
				opacity = opacity !== undefined ? opacity : 100;
				if (reg.test(color)) {
					let colors = color.match(reg);
					return `rgba(${colors[1]}, ${colors[2]}, ${colors[3]}, ${(opacity / 100).toFixed(1)})`;
				}
				return color;
			},

			//助力者或者游客
			isAant() {
				return this.role !== 1;
			},
			//发起者
			isInitor() {
				return this.loginStatus === 1 && this.role === 1;
			},

			//助力与否
			fightState() {
				if (this.guestId && this.headImgs && this.headImgs.length > 0) {
					return this.headImgs.findIndex(img => img.guestId == this.guestId) > -1;
				}
				return false;
			},


			//是否已经上线 
			onLineTime(data) {
				//记录开启时间和结束时间
				this.activityST = data.startTime ? data.startTime : null;
				this.activityET = data.deadline ? data.deadline : null;

				if (data.startTime && data.deadline && data.systemTime) {
					//未开始
					if (data.startTime > data.systemTime) return 0;
					//正在进行中
					else if (data.startTime <= data.systemTime && data.deadline >= data.systemTime) return 1;
					//结束
					else if (data.deadline < data.systemTime) return 2;
				}
				//其它
				return 3;
			},

			//当前活动是否已经完成 
			finishEvent() {
				if (this.headImgs && this.headImgs.length > 0 && this.total) {
					return this.headImgs.length === this.total;
				}
				return false;
			},


			//获取用户基本信息
			getUserInfo(e, type, ...args) {
				console.log(e);
				let that = this;
				if (e.detail && e.detail.rawData) {
					wxUserRand().then(res => {
						return res;
					}).then(params => {
						if (params) {
							wxAuthLogin(that.$http, params)
								.then(res => {
									that.setLoginInfo(res);
									return res;
								}).then(data => {
									// console.log(data);
									// console.log("login statuss the hostId is :" + this.hostId, "login status the guest is:" + this.guestId);
									// console.log("type", type);
									switch (type) {
										case "fight":
											that.fightActivity();
											break;
										case "share":
											// if(args[0] !== 1){
											// 	that.shareState(2)
											// }else{
											// 	that.shareState(1);
											// }
											break;
										case "poster":
											if (args[0] !== 1) {
												that.getQrcodeImg(that.guestId);
											} else {
												that.getQrcodeImg(that.hostId);
											}
											break;
										default:
											break;
									}

								})
						}
					})

				} else {
					uni.reLaunch({
						url: "../index/index"
					});
				}
			},

			//查看当前用户是否已经登录
			checkUserLogin() {
				wxCheckLogin(this.$http).then(res => {
					console.log(res);
					if (res && res.token) {
						this.setLoginInfo(res)
					} else
						return true;
				}).catch(err => {
					console.log(err);
				}).then(res => {
					//用户没有登录时
					if (res) {
						this.getEventDetail();
					}

				})
			},

			//设置用户登录信息
			setLoginInfo(data) {
				let userInfo = {
					avatarUrl: data.avatarUrl,
					isSubscribe: data.isSubscribe,
					isService: data.isService,
					nickName: data.nickName,
					userId: data.userId
				};
				this.$store.commit('setToken', data.token);
				this.$store.commit('setUserInfo', userInfo);
				this.$store.commit('setLoginStatus', 1);
				//表示已登录
				this.loginStatus = 1;
				if (this.hostId) {
					this.guestId = userInfo.userId;
					// this.guestId = 10101;
				} else {
					this.hostId = userInfo.userId;
					// this.hostId = 10099;
				}
				// this.getEventDetail();
			},


			//获取图片颜色
			getImageColor(src) {
				let that = this;
				that.coloration = false;
				wx.getImageInfo({
					src: src,
					success: (info) => {
						console.log(info);
						let {
							width,
							height,
							path
						} = info;
						console.log(width);
						let ctx = wx.createCanvasContext(that.renderColorId);
						that.width = width;
						that.height = height;
						ctx.clearRect(0, 0, width, height);
						ctx.drawImage(path, 0, 0, width, height);
						console.log(ctx);
						ctx.draw(false, () => {
							wx.canvasGetImageData({
								canvasId: that.renderColorId,
								x: 0,
								y: 0,
								width: width,
								height: height > 300 ? 300 : height,
								success: (data) => {
									console.log(data);
									that.gradientColor = getColor(data,0,1);
									that.themeColor = getColor(data, 3, 1);
									that.coloration = true;
								},
								fail: (fail) => {
									console.log(fail);
								},
								complete: () => {
									that.coloration = true;
								}
							})
						})
					}
				})
			},

			//获取二维码
			getQrcodeImg(hostId) {
				let that = this;
				uni.showLoading();
				console.log("qr code share id" + hostId, "event id is:" + that.eventId);
				that.$http.getEventPoster({
					hostId: hostId,
					eventId: that.eventId
				}).then(data => {
					uni.hideLoading();
					that.shareLink(hostId).then(res => {
						if (data.code == 200 && res.code == 200) {
							try {
								const fs = wx.getFileSystemManager()
								const fileUrl = wx.env.USER_DATA_PATH + '/qr_activity_' + new Date().getTime() + '.png';
								fs.writeFileSync(fileUrl, data.data, 'base64', 'utf8');
								that.qrImg = fileUrl;
								that.renderPoster()
							} catch (err) {
								console.log('READ DATA' + JSON.stringify(err))
								that.qrImg = Constant.defaultQrcodeImg;
								that.renderPoster()
							}
						} else {
							that.qrImg = Constant.defaultQrcodeImg
						}
					}).catch(err => {
						console.error("share link error is:", JSON.stringify(err));
						uni.showToast({
							icon: "none",
							title: err.msg || Messages.FAIL_INFO
						});
					})
				}).catch(err => {
					console.error("get poster qrcode error is:", JSON.stringify(err));
					uni.showToast({
						icon: "none",
						title: JSON.stringify(err)
					});
				})
			},

			//拉取活动详情
			getEventDetail() {
				let that = this;
				uni.showLoading();
				if (that.eventId && that.hostId) {
					let params = {
						eventId: that.eventId,
						hostId: that.hostId,
						fromBanner: that.state
					};

					that.$http.getEventDetail(params).then(res => {
						console.log(res);
						uni.hideLoading();
						if (res && res.code === 200) {
							let data = res.data.data;
							//设置标题
							wx.setNavigationBarTitle({
								title: data.eventName
							});

							that.total = data && data.guestCount ? data.guestCount : 0;
							that.limit = data && data.personCount ? data.personCount : 0;
							console.log("that.total" + that.total, "limit is ===" + this.limit);
							that.headImgs = data.headImages;
							that.status = data.status;
							//获取角色
							that.role = data.role;
							that.nickname = data.nickname ? data.nickname : null;

							if (data.code) {
								let codes = [],
									code = String(data.code),
									i = 0;
								while (code.length > i) {
									codes.push(code.substring(i, i + 4));
									i += 4;
								}
								that.code = codes.join(" ");
							}
							if (data.images && data.images.length > 0) {
								that.activityHomeImgs = data.images.filter(img => {
									return img.type === 0;
								});
								that.activityCntImgs = data.images.filter(img => {
									return img.type === 1
								});

								if(that.activityCntImgs  && that.activityCntImgs.length > 0){
									that.readColorImg = that.activityCntImgs[0].image;
									// that.readColorImg = "https://qiniu.madrock.com.cn/rev/project/ONLINE/44/847a47c5-a11b-d5bd-648f-6b926928a0d8.jpg";
								}

							}

							that.getImageColor(that.readColorImg);

							that.isOnline = that.onLineTime(data);
							if (that.isOnline === 1) {
								if (data.endTime && data.endTime > 1000) {
									this.clearDsq();
									that.computedTimer(Math.round(data.endTime / 1000));
								}
							}


							// that.justState(data);							
						} else {
							that.handleError();
						}


					}).catch(err => {
						uni.hideLoading();
						console.log(err);
						that.handleError();
					})
				}
			},

			//错误提示语句
			handleError() {
				uni.showModal({
					title: "提示",
					content: Messages.ACTIVITY_EXPIRE_TIME,
					showCancel: false,
					success: (tip) => {
						console.log(tip);
						if (tip.confirm) {
							uni.reLaunch({
								url: "../../pages/index/index"
							})
						}
					},
					complete: () => {
						uni.hideLoading();
					}
				})
			},


			//控制百分比
			getPercent() {
				if (this.total === 0) return 0;
				else {
					if (this.headImgs && this.headImgs.length > 0)
						return ((this.headImgs.length / this.total) * 100).toFixed(0);
					else
						return 0;
				}
			},

			//实现助力人数
			getFill() {
				if (this.headImgs && this.headImgs.length > 0) {
					return this.headImgs.length;
				}
				return 0;
			},

			/**
			 * 进度条的渲染
			 * @param {Object} percent
			 * @param {Object} compare
			 */
			progressTriggleStyle(percent, compare) {
				return `transparent transparent ${percent >= compare? this.setColorOpcity(this.themeColor,20): 'rgba(0,0,0,0.06)'} transparent`;
			},
			progressTextStyle(percent, compare) {
				return `${percent >= compare ? this.themeColor:'rgba(0,0,0,0.4)'}`;
			},
			progressMaskStyle(percent, compare) {
				return `${percent >= compare ? this.setColorOpcity(this.themeColor,20):'rgba(0,0,0,0.06)'}`;
			},

			//倒计时
			computedTimer(seconds) {
				if (seconds < 0) {
					this.clearDsq();
					this.getEventDetail();
					return;
				}
				this.hour = Math.floor(seconds / 3600);
				this.minute = Math.floor((seconds - this.hour * 3600) / 60);
				this.seconds = seconds - this.hour * 3600 - this.minute * 60;
				//转换成秒
				this.dsq = setTimeout(() => {
					this.computedTimer(--seconds);
				}, 1000);
			},

			//清除定时器
			clearDsq() {
				if (this.dsq) {
					clearTimeout(this.dsq);
				}
			},

			//渲染海报
			renderPoster() {
				let that = this;
				uni.showLoading({
					title: Messages.POSTER_CREATE
				});
				sharePosterByImg({
					canvasId: that.renderPosterId,
					width: 1242,
					height: 2200,
					bgImg: that.shareBgImgs[Math.floor(Math.random() * (that.shareBgImgs.length))],
					qrImg: that.qrImg,
					show: () => {
						uni.showLoading({
							title: Messages.POSTER_DECODER
						});
						wx.canvasToTempFilePath({
							canvasId: that.renderPosterId,
							success: (res => {
								console.log(res);
								uni.hideLoading();
								that.posterImg = res.tempFilePath;
								that.posterBool = true;
							}),
							complete: (res => {
								uni.hideLoading();
							})
						})
					}
				})
			},

			//关闭弹出海报
			closePoster() {
				this.posterBool = false;
				this.posterImg = null;
			},

			/**
			 * 获得下载保存图片权限
			 */
			savePhoto() {
				const that = this;
				uni.getSetting({
					success: (settingData) => {
						if (!settingData.authSetting['scope.writePhotosAlbum']) {
							uni.authorize({
								scope: 'scope.writePhotosAlbum',
								success: (authData) => {
									that.loadPhotos(that);
								},
								fail: (authFail) => {
									console.log(authFail)
									uni.showModal({
										title: '相册授权',
										content: '小程序请求您打开相册权限',
										confirmText: '去设置',
										success: (authAgain) => {
											console.log(authAgain)
											if (authAgain.confirm) {
												uni.openSetting({
													success: (data) => {
														if (data.authSetting['scope.writePhotosAlbum']) {
															that.loadPhotos(that);
														} else {
															that.loadPhotos(that);
														}
													}
												})
											}
										},
										fail: (authFailAgain) => {
											console.log(authFailAgain)
											that.showToast({
												icon: 'none',
												title: Messages.FAIL_AUTH
											})
										}

									})
								}
							})
						} else {
							that.loadPhotos(that)
						}
					},
					fail: (settingFail) => {
						uni.showToast({
							icon: 'none',
							title: JSON.stringify(settingFail)
						})
					}
				})
			},

			//保存图片
			loadPhotos(that) {
				uni.showLoading({
					title: '图片保存中',
					icon: 'loading'
				})
				setTimeout(() => {
					wx.canvasToTempFilePath({
						canvasId: that.renderPosterId,
						fileType: 'jpg',
						success: (res) => {
							console.log('POSTER=====' + JSON.stringify(res))
							wx.saveImageToPhotosAlbum({
								filePath: res.tempFilePath,
								success: (albumData) => {
									console.log('LOCAL POHOTOES=====' + JSON.stringify(albumData))
									uni.hideLoading();
									uni.showToast({
										icon: 'none',
										title: '保存成功',
										success: () => {
											that.closePoster()
										}
									})
								},
								complete: (info) => {
									uni.hideLoading()
								}
							})
						}
					})
				}, 500);
			},

			//为好友助力
			fightActivity() {
				let that = this;
				console.log("fight activity host id:" + that.hostId, "guest id" + that.guestId, "event id" + that.eventId);
				// that.guestId = 10093;
				if (that.eventId && that.hostId && that.guestId) {
					that.$http.getEventFight({
							eventId: that.eventId,
							hostId: that.hostId,
							guestId: that.guestId
						})
						.then(res => {
							if (res && res.code == 200) {
								uni.showToast({
									icon: "none",
									title: "助力成功"
								});
								that.getEventDetail();
							} else {
								uni.showToast({
									icon: "none",
									title: res.msg || "助力失败"
								});
							}
						}).catch(err => {
							uni.showToast({
								icon: "none",
								title: JSON.stringify(err)
							});
						})
				}
			},



			/**
			 * 参与者分享
			 */
			shareLink(hostId) {
				let that = this;
				return new Promise((reslove, reject) => {
					if (hostId && that.eventId) {
						that.$http.getEventShare({
								hostId: hostId,
								eventId: that.eventId
							})
							.then(res => {
								if (res && res.code == 200) {
									reslove(res);
								} else {
									reject(res);
								}
							})
							.catch(err => {
								reject(err);
							})
					}
				})
			},

			/**
			 * 阻止弹出框滑动
			 */
			touchmove(e) {
				e.stopPropagation();
				e.preventDefault();
				return;
			},





		},

		onShareAppMessage(res) {
			let shareId = null;
			// 1：为自己；2：为他人
			if (res.from === "button") {
				console.log(res.target.dataset.state === '1');
				shareId = (res.target.dataset.state === '1') ? this.guestId : this.hostId;
				console.log("button share id is:", shareId);
			} else {
				console.log("form menu in here");
				shareId = this.guestId ? this.guestId : this.hostId;
			}
			if (!shareId) {
				console.log("share guest id in not here");
				shareId = this.hostId;
			}
			try {
				console.info("data target for self is" + res.target.dataset.state, "guest id is:" + this.guestId, "shareId id" +
					this.shareId)
			} catch (e) {
				console.error(e);
				console.info("guest id is:" + this.guestId, "shareId id" + this.shareId)
			}
			this.shareLink(shareId);

			let path = '/pagesActivities/activity/activity?eventId=' + this.eventId + '&hostId=' + shareId;
			console.log("share path", path);
			return shareWechat(res, {
				title: this.shareTitle,
				path: path,
				desc: '在线装修',
				imageUrl: this.shareImg
			})

			// console.log('share path event is:','/pagesActivities/activity/activity?eventId=' + this.eventId + '&hostId=' + shareId);
			// this.shareLink(shareId).then(res =>{



			// }).catch(err =>{
			// 	 console.error(JSON.stringify(err));
			// 	 uni.showToast({
			// 		 icon:"none",
			// 		 title:err.msg || Messages.FAIL_INFO,
			// 	});
			// 	return false;
			// })
		}
	}
</script>

<style lang="scss">
	@import "../../mixin/common.scss";
	@import "../../mixin/share.scss";

	.mkb-activity {
		.auth-btn {
			margin: 50% 28.98rpx;
			background: $col_DDF3F3;
			color: $col_098684;
		}
		overflow-x:hidden;
		.activity-home {
			min-height: 100%;
			background: rgba(251, 69, 41, 1);

			.home-img {
				width: 100%;
				text-align: center;

				.image {
					width: 100%;
				}
			}

			.home-cnt {
				&-side1 {
					width: calc(100% - 57.96rpx);
					position: relative;
					margin: 0 28.98rpx;
					padding-bottom: 28.98rpx;
					box-sizing: border-box;

					.side-activity {
						position: relative;
						background: rgba(255, 255, 255, 1);
						border-radius: 28.98rpx;
						padding: 79.71rpx 0 43.47rpx;
						z-index: 9;
						margin-bottom: 28.98rpx;

						&-title {
							width: 362.31rpx;
							height: 72.46rpx;
							background: rgba(254, 218, 212, 1);
							border: 3.62rpx solid rgba(251, 69, 41, 1);
							box-shadow: 0 3.62rpx 7.24rpx rgba(251, 69, 41, 1);
							border-radius: 14.49rpx;
							position: absolute;
							left: 50%;
							margin-left: -181.16rpx;
							top: -36.23rpx;
							z-index: 10;
							text-align: center;
							line-height: 72.46rpx;
							box-sizing: border-box;
							overflow: hidden;
							@include eclipse;

							.title {
								&-text {
									display: block;
									width: 100%;
									color: rgba(251, 69, 41, 1);
									position: relative;
									z-index: 9;
								}

								&-mask {
									position: absolute;
									left: 0;
									top: 0;
									z-index: 1;
									width: 100%;
									height: 100%;
									background: #FFF;
									opacity: 0.8;
								}
							}
						}

						&-interval {
							text-align: center;
							margin-bottom: 28.98rpx;

							.interval {
								display: flex;

								&-text {
									display: inline-block;
									font-size: 28.98rpx;
									font-family: Microsoft YaHei;
									font-weight: 400;
									line-height: 57.97rpx;
									color: rgba(251, 69, 41, 1);
									margin-right: 14.49rpx;
								}

								&-time {
									display: inline-block;
									background: rgba(251, 69, 41, 1);
									line-height: 57.97rpx;
									border-radius: 14.49rpx;
									color: #fff;
									padding: 0 12.68rpx;
									margin-right: 14.49rpx;
								}

								&-mark {
									font-size: 28.98rpx;
									font-family: 'Microsoft YaHei';
									font-weight: 400;
									line-height: 57.97rpx;
									color: rgba(251, 69, 41, 1);
									margin-right: 14.49rpx;
								}
							}
						}

						&-text {
							display: flex;
							flex-wrap: nowrap;
							align-items: center;
							justify-content: center;
							margin-bottom: 28.98rpx;

							&-block {
								position: relative;
								line-height: 36.23rpx;

								.icon-line {
									width: 43.47rpx;
									height: 3.62rpx;
									background: rgba(251, 69, 41, 1);
								}

								.icon-circle {
									width: 10.86rpx;
									height: 10.86rpx;
									border-radius: 10.86rpx;
									background: rgba(251, 69, 41, 1);
									position: absolute;
									right: 0;
									top: -5.43rpx;
								}

								&.icon-left {
									transform: rotate(0);
									margin-right: 28.98rpx;
								}

								&.icon-right {
									transform: rotate(180deg);
									margin-left: 28.98rpx;
								}
							}
						}

						&-code {
							margin: 0 43.47rpx;

							.code {

								&-title,
								&-rand {
									font-family: 'Microsoft YaHei';
									font-weight: 400;
								}
							}

							.code-title {
								font-size: 28.98rpx;
								line-height: 38.04rpx;
								color: rgba(251, 69, 41, 1);
								display: block;
								text-align: center;
								margin-bottom: 28.98rpx;
							}

							.code-rand {
								padding: 43.47rpx 48.91rpx;
								border-radius: 28.98rpx;
								line-height: 76.08rpx;
								position: relative;
								overflow: hidden;

								&-text {
									position: relative;
									z-index: 9;
									color: rgba(251, 69, 41, 1);
									font-size: 57.97rpx;
									display: block;
									text-align: center;
								}

								&-mask {
									position: absolute;
									left: 0;
									top: 0;
									z-index: 1;
									width: 100%;
									height: 100%;
									opacity: 0.2;
									background: rgba(251, 69, 41, 1);
								}
							}
						}

						&-progress {
							padding: 0 76.08rpx;
							margin-bottom: 57.97rpx;

							.progress-text {
								width: 100%;
								height: 57.97rpx;
								margin-top: 25.35rpx;
								position: relative;

								&-start,
								&-middle,
								&-end {
									display: inline-block;
									position: absolute;
									top: 0;
									padding:0 7.24rpx;
									.triggle {
										display: inline-block;
										border-width: 10.86rpx;
										border-style: solid;
										border-color: transparent transparent rgba(0, 0, 0, 0.06) transparent;
										position: absolute;
										top: -21.73rpx;
										left: 50%;
										margin-left: -10.86rpx;
									}

									.text {
										font-size: 25.36rpx;
										font-family: 'Microsoft YaHei';
										font-weight: 400;
										line-height: 43.47rpx;
										color: rgba(0, 0, 0, 0.40);
									}

									.mask {
										width: 100%;
										height: 100%;
										background: rgba(0, 0, 0, 0.6);										
										position: absolute;
										left: 0;
										top: 0;
										border-radius: 7.24rpx;
									}
								}

								&-start {
									left: -25.36rpx;
								}

								&-middle {
									left: calc(50% - 70.65rpx);
								}

								&-end {
									right: -25.36rpx;
								}
							}
						}

						&-btns {
							padding: 0 86.95rpx;

							.btn {

								&-fight,
								&-share {
									width: 100%;
									font-size: 36.23rpx;
									font-family: 'Microsoft YaHei';
									font-weight: 400;
									line-height: 101.44rpx;
									border-radius: 50.72rpx;
									outline: none;
								}

								&-fight {
									color: rgba(255, 255, 255, 1);
									background: rgba(251, 69, 41, 1);
									box-shadow: 0 21.73rpx 43.47rpx rgba(251, 69, 41, 0.5);
									margin-bottom: 43.47rpx;

									&.disabled {
										opacity: 0.2;
									}
								}

								&-share {
									border: 3.62rpx solid rgba(251, 69, 41, 1);
									color: rgba(251, 69, 41, 1);

									&::after {
										background: transparent;
										border-color: transparent;
									}

									&:hover {
										background: transparent;
									}
								}
							}
						}

						&-fb {
							// margin-top: 57.97rpx;
							display: flex;
							align-items: center;
							justify-content: space-between;
							padding: 0 43.47rpx;
							.fb-flex {
								flex: 1;
								text-align: center;
								outline: 0;
								border: 0;
								background: transparent;

								&::after {
									border: 0;
								}

								&-icon {
									height: 105.07rpx;
									margin-bottom: 14.49rpx;
								}

								&-text {
									display: block;
									margin-top: 14.49rpx;
									font-size: 28.98rpx;
									font-family: 'Microsoft YaHei';
									font-weight: 400;
									line-height: 38.04rpx;
									color: rgba(251, 69, 41, 1);
								}
							}
						}

						&-state {
							margin: 0 126.81rpx;
							text-align: center;

							.state {
								&-circle {
									width: 144.92rpx;
									height: 144.92rpx;
									border-radius: 50%;
									overflow: hidden;
									position: relative;
									margin: 0 auto 28.98rpx;
									line-height: 144.92rpx;

									&-mask {
										position: absolute;
										left: 0;
										top: 0;
										width: 100%;
										height: 100%;
										background: #FB4529;
										opacity: 0.2;
									}
								}

								&-text {
									display: block;
									font-size: 28.98rpx;
									font-family: 'Microsoft YaHei';
									font-weight: 400;
									line-height: 38.04rpx;
									color: rgba(251, 69, 41, 1);
								}
							}
						}
					}

					.side-info {
						&-text {
							position: relative;
							z-index: 9;
						}
					}

					.side-imgs {
						padding:0 43.47rpx;
						position: relative;
						z-index: 9;
						text-align: center;
						width: 100%;
						white-space: nowrap;
						overflow: hidden;
						box-sizing: border-box;
						&-item {
							width: 72.46rpx;
							height: 72.46rpx;
							border-radius: 50%;
							display: inline-block;
							margin-right: 19.92rpx;
							overflow: hidden;
							&:last-child {
								margin-right: 0;
							}

							image {
								width: 100%;
								height: 100%;
								border-radius: 100%;
							}
						}
					}

					.side-mask {
						position: absolute;
						left: 0;
						top: 0;
						width: 100%;
						height: 100%;
						background: rgba(255, 255, 255, 1);
						opacity: 0.88;
						border-radius: 28.98rpx;
						z-index: 1;
					}

					button {
						background: transparent;
						&::after {
							border: 0;
						}
					}
				}

				&-side2 {
					width: 100%;
					margin-top: 28.98rpx;

					image {
						width: 100%;
						display: block;
					}

					// height: 905.79rpx;
					// border-radius: 28.98rpx;
					// background: rgba(255,255,255,1);
				}
			}
		}
	}
</style>
