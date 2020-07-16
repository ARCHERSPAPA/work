<template>
	<view class="order-sign">
		<view class="order-sign-tip">
			<text>请横屏完成签名</text>
		</view>
		<view class="order-sign-panel">
			<view class="order-sign-btns">
				<button @tap="reset" class="btn-reset"><text>重</text><text>置</text></button>
				<button @tap.stop="submit" class="btn-submit"><text>提</text><text>交</text></button>
			</view>
			<view class="order-sign-box">
				<canvas class="writing-panel" disable-scroll="true" @touchstart="uploadScaleStart" @touchmove="uploadScaleMove"
				 @touchend="uploadScaleEnd" canvas-id="handWriting" style="border:0;background:#FFF">
				</canvas>
			</view>
		</view>
		<view class="order-sign-rotate">
			<canvas canvas-id="rotateSign" :style="{width:transformWidth+'px',height: transformHeight+'px',border:0,background:'#FFF'}"></canvas>
		</view>
	</view>
</template>

<script>
	import {
		getQueryString
	} from '../../util/util.js'
	import {
		appConfig
	} from '../../util/config.js'
	import Messages from '../../util/messages.js'
	export default {
		data() {
			return {
				canvasName: 'handWriting',
				ctx: null,
				canvasWidth: 0,
				canvasHeight: 0,
				transformWidth: 0,
				transformHeight: 0,
				transparent: 1, // 透明度
				selectColor: 'black',
				lineColor: '#1A1A1A', // 颜色
				lineSize: 1.5, // 笔记倍数
				lineMin: 0.5, // 最小笔画半径
				lineMax: 4, // 最大笔画半径
				pressure: 1, // 默认压力
				smoothness: 60, //顺滑度，用60的距离来计算速度
				currentPoint: {},
				currentLine: [], // 当前线条
				firstTouch: true, // 第一次触发
				radius: 1, //画圆的半径
				cutArea: {
					top: 0,
					right: 0,
					bottom: 0,
					left: 0
				}, //裁剪区域
				bethelPoint: [], //保存所有线条 生成的贝塞尔点；
				lastPoint: 0,
				chirography: [], //笔迹
				currentChirography: {}, //当前笔迹
				linePrack: [], //划线轨迹 , 生成线条的实际点
				bgImg: "https://qiniu.madrock.com.cn/rev/project/ONLINE/44/1ef25b51-0c50-0ec4-ab2a-a02bb308ccfa.png",
				quoteId: null, //当前报价id
				userId: null, //当前登录用户id
				submitControl: false, //提交签名控制
				submitCount: 0, //渲染旋转图片三次
			}
		},
		onLoad(options) {
			console.log("options==========", options);

			this.quoteId = options.quoteId ||
				getQueryString('quoteId', decodeURIComponent(options.scene)) ||
				this.$parseURL().quoteId;
			// this.quoteId = 5399;
			if (this.$store.state.userInfo) {
				this.userId = this.$store.state.userInfo.userId;
			}

			let canvasName = this.canvasName
			let ctx = wx.createCanvasContext(canvasName)
			this.ctx = ctx;
			var query = wx.createSelectorQuery();
			query.select('.order-sign-panel').boundingClientRect(rect => {
				this.canvasWidth = rect.width;
				this.canvasHeight = rect.height;
				/* 将canvas背景设置为 白底，不设置  导出的canvas的背景为透明 */
				this.setCanvasBg(this.bgImg);
			}).exec();
		},
		
		methods: {
			uploadScaleStart(e) {
				if(this.submitControl) return false;
				if (e.type != 'touchstart') return false;
				let ctx = this.ctx;
				if (this.chirography && this.chirography.length == 0) {
					this.setCanvasBg("#FFF");
				}
				ctx.setFillStyle(this.lineColor); // 初始线条设置颜色
				ctx.setGlobalAlpha(this.transparent); // 设置半透明
				let currentPoint = {
					x: e.touches[0].x,
					y: e.touches[0].y
				}
				let currentLine = this.currentLine;

				currentLine.unshift({
					time: new Date().getTime(),
					dis: 0,
					x: currentPoint.x,
					y: currentPoint.y
				})
				this.currentLine = currentLine;

				if (this.firstTouch) {
					this.cutArea = {
						top: currentPoint.y,
						right: currentPoint.x,
						bottom: currentPoint.y,
						left: currentPoint.x,
					};
					this.firstTouch = false;

				}
				this.pointToLine(currentLine);
			},
			// 笔迹移动
			uploadScaleMove(e) {
				if(this.submitControl) return false;
				if (e.type != 'touchmove') return false;
				if (e.cancelable) {
					// 判断默认行为是否已经被禁用
					if (!e.defaultPrevented) {
						e.preventDefault();
					}
				}
				let point = {
					x: e.touches[0].x,
					y: e.touches[0].y
				}

				//测试裁剪
				if (point.y < this.cutArea.top) {
					this.cutArea.top = point.y;
				}
				if (point.y < 0) this.cutArea.top = 0;

				if (point.x > this.cutArea.right) {
					this.cutArea.right = point.x;
				}
				if (this.canvasWidth - point.x <= 0) {
					this.cutArea.right = this.canvasWidth;
				}
				if (point.y > this.cutArea.bottom) {
					this.cutArea.bottom = point.y;
				}
				if (this.canvasHeight - point.y <= 0) {
					this.cutArea.bottom = this.canvasHeight;
				}
				if (point.x < this.cutArea.left) {
					this.cutArea.left = point.x;
				}
				if (point.x < 0) this.cutArea.left = 0;

				this.lastPoint = this.currentPoint;

				let currentLine = this.currentLine
				currentLine.unshift({
					time: new Date().getTime(),
					dis: this.distance(this.currentPoint, this.lastPoint),
					x: point.x,
					y: point.y
				})
				this.pointToLine(currentLine);
			},
			// 笔迹结束
			uploadScaleEnd(e) {
				if(this.submitControl) return false;
				if (e.type != 'touchend') return false;
				let point = {
					x: e.changedTouches[0].x,
					y: e.changedTouches[0].y
				}

				this.lastPoint = this.currentPoint;

				let currentLine = this.currentLine
				currentLine.unshift({
					time: new Date().getTime(),
					dis: this.distance(this.currentPoint, this.lastPoint),
					x: point.x,
					y: point.y
				})

				if (currentLine.length > 2) {
					var info = (currentLine[0].time - currentLine[currentLine.length - 1].time) / currentLine.length;
					//$("#info").text(info.toFixed(2));
				}
				//一笔结束，保存笔迹的坐标点，清空，当前笔迹
				//增加判断是否在手写区域；
				this.pointToLine(currentLine);
				var currentChirography = {
					lineSize: this.lineSize,
					lineColor: this.lineColor
				};
				var chirography = this.chirography
				chirography.unshift(currentChirography);

				this.chirography = chirography;

				var linePrack = this.linePrack
				linePrack.unshift(this.currentLine);

				this.linePrack = linePrack;
				this.currentLine = [];
			},

			/**
			 * 重置
			 */
			reset() {
				if(this.submitControl) return false;
				this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
				this.ctx.draw();
				//设置canvas背景
				this.setCanvasBg(this.bgImg);
				this.chirography = [];
			},

			/**
			 * 提交图片信息
			 */
			submit() {
				let that = this;
				if(that.submitControl) return;
				uni.showLoading({
					title:"绘画提交中"
				});
				that.submitCount = 0;
				
				if(this.chirography && this.chirography.length > 0){
					that.submitControl = true;
					wx.canvasToTempFilePath({
						canvasId: that.canvasName,
						fileType: "png",
						success: (res) => {
							console.log(res);
							var query = wx.createSelectorQuery();
							query.select('.writing-panel').boundingClientRect(rect => {
								uni.hideLoading();	
								console.log(rect);
								this.transformWidth = rect.height;
								this.transformHeight = rect.width;
								let url = res.tempFilePath;
								that.rotateImage(url)
								// /* 将canvas背景设置为 白底，不设置  导出的canvas的背景为透明 */
								// this.setCanvasBg(this.bgImg);
							}).exec();
							
												
							
							console.log("sign userId is" + that.userId);
							// let base64 = wx.getFileSystemManager().readFileSync(res.tempFilePath, "base64");
							// console.log(base64);
						}
					})
				}else{
					that.submitControl = false;
					uni.showToast({
						icon:"none",
						title:"请在面板上完成您的签名"
					})
				}
				
			},

			//图片旋转转换
			rotateImage(src) {
				let that = this;
				uni.showLoading({
					title:"图片整理中"
				});
				that.submitControl = true;
				wx.getImageInfo({
					src: src,
					success: (data) => {
						console.log(data);
						console.log("width======="+that.canvasWidth,"heigh====="+that.canvasHeight);
						uni.hideLoading();
						let ctx = wx.createCanvasContext("rotateSign"),
							gap = Math.abs(that.transformHeight-that.transformWidth)/2 + 2,
							size = Math.round(that.transformHeight/that.transformWidth);
						ctx.clearRect(0, 0, that.transformWidth, that.transformHeight);
						//切换位置到指定点
						ctx.translate(that.transformWidth/2, that.transformHeight/2)
						ctx.rotate(-90 * Math.PI / 180);
						ctx.drawImage(data.path,-(that.transformWidth*size)/2, -(that.transformHeight/size)/2,that.transformWidth,that.transformHeight);	
						console.log("已经完成旋转图片.....");
						ctx.draw(false, setTimeout(()=>{
							that.getTempRotateInfo(gap);
						}),500);
					}
				})
			},
			
			//生成旋转后的图片信息
			getTempRotateInfo(gap){
				let that = this;
				uni.showLoading({
					title:"图片生成中"
				});
				wx.canvasToTempFilePath({
					canvasId: "rotateSign",
					fileType: "png",
					x: gap,
					y: 0,
					width: that.transformWidth - gap*2,
					height: that.transformHeight - 2,
					destWidth: 300,
					destHeight: 150,
					success: (res => {
						console.log(res);
						let base64 = wx.getFileSystemManager().readFileSync(res.tempFilePath, "base64");
						console.log(base64);
						uni.hideLoading();
						// that.submitControl = false;
						that.signData(base64);
						
					}),
					complete: (data) => {
						console.log("complate data")
						console.log(data);
					},
					fail: (error) => {
						console.log("fail data");
						console.error(error);
						uni.hideLoading()
						that.submitCount ++;
						if(that.submitControl > 3){
							that.submitControl = false;
							uni.showToast({
								icon:"none",
								title:error.errMsg || "图片生成失败"
							})
						}else{
							this.getTempRotateInfo(gap);
						}
					}
				})
			},
			
			
			
			//提交数据
			signData(base64){
				let that = this;
				uni.showLoading({
					title:"提交数据中"
				})
				that.submitControl = true;
				that.$http.setSignInfo({
						miniUserId: that.userId,
						quoteId: that.quoteId,
						imageData: base64
				
				},{
					baseURL:appConfig.baseURL
				}).then(res =>{
					uni.hideLoading();
					that.submitControl = false;
					if(res && res.code == 200){
						uni.navigateBack({
							delta:4
						})
					}else{
						uni.showToast({
							icon:"none",
							title: res.msg || Messages.FAIL_INFO
						});
					}
				}).catch(err =>{
					uni.hideLoading();
					that.submitControl = false;
					console.error(err);
					uni.showToast({
						icon:"none",
						title: err.msg || Messages.FAIL_INFO
					});
				}).finally(data =>{
					uni.hideLoading();
					that.submitControl = false;
					console.log("finally in here");
					console.log(data);
				})
			},


			//画两点之间的线条；参数为:line，会绘制最近的开始的两个点；
			pointToLine(line) {
				this.calcBethelLine(line);
				return;
			},

			//计算插值的方式；
			calcBethelLine(line) {
				if (line.length <= 1) {
					line[0].r = this.radius;
					return;
				}
				let x0, x1, x2, y0, y1, y2, r0, r1, r2, len, lastRadius, dis = 0,
					time = 0,
					curveValue = 0.5;
				if (line.length <= 2) {
					x0 = line[1].x
					y0 = line[1].y
					x2 = line[1].x + (line[0].x - line[1].x) * curveValue;
					y2 = line[1].y + (line[0].y - line[1].y) * curveValue;
					//x2 = line[1].x;
					//y2 = line[1].y;
					x1 = x0 + (x2 - x0) * curveValue;
					y1 = y0 + (y2 - y0) * curveValue;;

				} else {
					x0 = line[2].x + (line[1].x - line[2].x) * curveValue;
					y0 = line[2].y + (line[1].y - line[2].y) * curveValue;
					x1 = line[1].x;
					y1 = line[1].y;
					x2 = x1 + (line[0].x - x1) * curveValue;
					y2 = y1 + (line[0].y - y1) * curveValue;
				}
				//从计算公式看，三个点分别是(x0,y0),(x1,y1),(x2,y2) ；(x1,y1)这个是控制点，控制点不会落在曲线上；实际上，这个点还会手写获取的实际点，却落在曲线上
				len = this.distance({
					x: x2,
					y: y2
				}, {
					x: x0,
					y: y0
				});
				lastRadius = this.radius;
				for (let n = 0; n < line.length - 1; n++) {
					dis += line[n].dis;
					time += line[n].time - line[n + 1].time;
					if (dis > this.smoothness) break;
				}
				this.radius = Math.min(time / len * this.pressure + this.lineMin, this.lineMax) * this.lineSize;
				line[0].r = this.radius;
				//计算笔迹半径；
				if (line.length <= 2) {
					r0 = (lastRadius + this.radius) / 2;
					r1 = r0;
					r2 = r1;
					//return;
				} else {
					r0 = (line[2].r + line[1].r) / 2;
					r1 = line[1].r;
					r2 = (line[1].r + line[0].r) / 2;
				}
				let n = 5;
				let point = [];
				for (let i = 0; i < n; i++) {
					let t = i / (n - 1);
					let x = (1 - t) * (1 - t) * x0 + 2 * t * (1 - t) * x1 + t * t * x2;
					let y = (1 - t) * (1 - t) * y0 + 2 * t * (1 - t) * y1 + t * t * y2;
					let r = lastRadius + (this.radius - lastRadius) / n * i;
					point.push({
						x: x,
						y: y,
						r: r
					});
					if (point.length == 3) {
						let a = this.ctaCalc(point[0].x, point[0].y, point[0].r, point[1].x, point[1].y, point[1].r, point[2].x, point[2]
							.y, point[2].r);
						a[0].color = this.lineColor;
						this.bethelDraw(a, 1);
						point = [{
							x: x,
							y: y,
							r: r
						}];
					}
				}
				this.currentLine = line;
			},

			//求两点之间距离
			distance(a, b) {
				let x = b.x - a.x;
				let y = b.y - a.y;
				return Math.sqrt(x * x + y * y);
			},

			/**
			 * 根据三点坐标计算出贝塞尔坐标点
			 * @param {Object} x0
			 * @param {Object} y0
			 * @param {Object} r0
			 * @param {Object} x1
			 * @param {Object} y1
			 * @param {Object} r1
			 * @param {Object} x2
			 * @param {Object} y2
			 * @param {Object} r2
			 */
			ctaCalc(x0, y0, r0, x1, y1, r1, x2, y2, r2) {
				let a = [],
					vx01, vy01, norm, n_x0, n_y0, vx21, vy21, n_x2, n_y2;
				vx01 = x1 - x0;
				vy01 = y1 - y0;
				norm = Math.sqrt(vx01 * vx01 + vy01 * vy01 + 0.0001) * 2;
				vx01 = vx01 / norm * r0;
				vy01 = vy01 / norm * r0;
				n_x0 = vy01;
				n_y0 = -vx01;
				vx21 = x1 - x2;
				vy21 = y1 - y2;
				norm = Math.sqrt(vx21 * vx21 + vy21 * vy21 + 0.0001) * 2;
				vx21 = vx21 / norm * r2;
				vy21 = vy21 / norm * r2;
				n_x2 = -vy21;
				n_y2 = vx21;
				a.push({
					mx: x0 + n_x0,
					my: y0 + n_y0,
					color: "#1A1A1A"
				});
				a.push({
					c1x: x1 + n_x0,
					c1y: y1 + n_y0,
					c2x: x1 + n_x2,
					c2y: y1 + n_y2,
					ex: x2 + n_x2,
					ey: y2 + n_y2
				});
				a.push({
					c1x: x2 + n_x2 - vx21,
					c1y: y2 + n_y2 - vy21,
					c2x: x2 - n_x2 - vx21,
					c2y: y2 - n_y2 - vy21,
					ex: x2 - n_x2,
					ey: y2 - n_y2
				});
				a.push({
					c1x: x1 - n_x2,
					c1y: y1 - n_y2,
					c2x: x1 - n_x0,
					c2y: y1 - n_y0,
					ex: x0 - n_x0,
					ey: y0 - n_y0
				});
				a.push({
					c1x: x0 - n_x0 - vx01,
					c1y: y0 - n_y0 - vy01,
					c2x: x0 + n_x0 - vx01,
					c2y: y0 + n_y0 - vy01,
					ex: x0 + n_x0,
					ey: y0 + n_y0
				});
				a[0].mx = a[0].mx.toFixed(1);
				a[0].mx = parseFloat(a[0].mx);
				a[0].my = a[0].my.toFixed(1);
				a[0].my = parseFloat(a[0].my);
				for (let i = 1; i < a.length; i++) {
					a[i].c1x = a[i].c1x.toFixed(1);
					a[i].c1x = parseFloat(a[i].c1x);
					a[i].c1y = a[i].c1y.toFixed(1);
					a[i].c1y = parseFloat(a[i].c1y);
					a[i].c2x = a[i].c2x.toFixed(1);
					a[i].c2x = parseFloat(a[i].c2x);
					a[i].c2y = a[i].c2y.toFixed(1);
					a[i].c2y = parseFloat(a[i].c2y);
					a[i].ex = a[i].ex.toFixed(1);
					a[i].ex = parseFloat(a[i].ex);
					a[i].ey = a[i].ey.toFixed(1);
					a[i].ey = parseFloat(a[i].ey);
				}
				return a;
			},

			/**
			 * 根据曲线绘制贝塞尔
			 * @param {Object} point
			 * @param {Object} is_fill
			 * @param {Object} color
			 */
			bethelDraw(point, is_fill, color) {
				let that = this;
				let ctx = this.ctx;
				ctx.beginPath();
				ctx.moveTo(point[0].mx, point[0].my);
				if (undefined != color) {
					ctx.setFillStyle(color);
					ctx.setStrokeStyle(color);
				} else {
					ctx.setFillStyle(point[0].color);
					ctx.setStrokeStyle(point[0].color);
				}
				for (let i = 1; i < point.length; i++) {
					ctx.bezierCurveTo(point[i].c1x, point[i].c1y, point[i].c2x, point[i].c2y, point[i].ex, point[i].ey);
				}
				ctx.stroke();
				if (undefined != is_fill) {
					ctx.fill(); //填充图形 ( 后绘制的图形会覆盖前面的图形, 绘制时注意先后顺序 )
				}
				ctx.draw(true)
			},

			/**
			 * 设置canvas背景色  不设置  导出的canvas的背景为透明
			 * @param {Object} color 字符串  color
			 */
			setCanvasBg(bg) {
				/* 将canvas背景设置为 白底，不设置  导出的canvas的背景为透明 */
				//rect() 参数说明  矩形路径左上角的横坐标，左上角的纵坐标, 矩形路径的宽度, 矩形路径的高度
				//这里是 canvasHeight - 4 是因为下边盖住边框了，所以手动减了写
				this.ctx.rect(0, 0, this.canvasWidth, this.canvasHeight - 4);
				// this.ctx.setFillStyle( color )
				// this.ctx.fill()  //设置填充
				// this.ctx.draw()	//开画
				let that = this;
				if (bg.indexOf(".png") > -1) {
					wx.getImageInfo({
						src: bg,
						success: (res) => {
							that.ctx.drawImage(res.path, 0, 0);
							that.ctx.draw();
						}
					})
				} else {
					this.ctx.setFillStyle(bg)
					this.ctx.fill() //设置填充
					this.ctx.draw() //开画
				}


			},
		}
	}
</script>

<style lang="scss">
	@import "../../mixin/common.scss";

	.order-sign {
		overflow: hidden;
		//横屏提示
		&-tip {
			width: 100%;
			height: 39.85rpx;
			margin: 28.98rpx 0;
			text-align: center;

			text {
				font-size: 28.98rpx;
				font-weight: 400;
				line-height: 39.85rpx;
				color: rgba(0, 0, 0, 0.40);
			}
		}

		//签名区域
		&-panel {
			width: 100%;
			height: 90vh;
			overflow: hidden;
			display: flex;
			align-content: center;
			flex-direction: row;
			justify-content: center;

			.order-sign {
				&-btns {
					height: 90%;
					display: inline-flex;
					flex-direction: column;
					// justify-content: space-between;
					// align-content: space-between;
					justify-content: center;
					flex: 1;
					overflow: hidden;

					>button {
						&.btn {

							&-reset,
							&-submit {
								font-size: 28.98rpx;
								text-align: center;
								width: 79.71rpx;
								padding: (434.78rpx - 100rpx)/2 0;
								border-radius: 79.71rpx;
								border: 1.81rpx solid $col_098684;
								margin-top: 36rpx;

								>text {
									display: block;
									transform: rotate(90deg);
								}
							}

							&-reset {
								background: rgba(255, 255, 255, 1);
								color: $col_098684;
							}

							&-submit {
								color: rgba(255, 255, 255, 1);
								background: $col_098684;
							}
						}

					}
				}

				&-box {
					flex: 5;
					overflow: hidden;
					box-sizing: border-box;
					height: 90%;

					.writing-panel {
						background: #fff;
						width: 100%;
						height: 100%;
						border: 0;
					}
				}
			}

		}
		
		//转换图片
		&-rotate{
			position: fixed;
			left: 0;
			top: -999999999999rpx;
			z-index: -999999;
		}
	}
</style>
