import Constant from './constant.js'
/**
 * 用户title提示
 * @param {Object} type
 */
export function getTitleByType(type) {
  switch (type) {
    case 0:
      return '浏览记录'
    case 1:
      return '点赞记录'
    case 2:
      return '收藏记录'
    default:
      return '其它'
  }
}

/**
 * 设置图片居中，不拉伸
 */
export function imageStrenth(src, defaultImg = Constant.defaultImg) {
  if (src) {
    return src.indexOf('?') > -1 ? src : src + '?imageView2/1/w/750/h/498/interlace/1'
  }
  return defaultImg
}

/**
 * 微信分享
 * @param {Object} e
 * @param {Object} options
 */
export function shareWechat(e, options) {
	if (e.from === 'button') {
		console.log(options.target);
	}
	let share = {
		title: options.title,
		path: options.path,
		desc: options.desc,
		imageUrl: options.imageUrl,
		success: (res => {
			if (res.errMsg == 'shareAppMessage:ok') {
				uni.showToast({
					icon: "none",
					title: "分享成功"
				})
			}
		}),
		fail: (err => {
			if (res.errMsg == 'shareAppMessage:fail cancel') {
				// 用户取消转发
				uni.showToast({
					icon: "none",
					title: "分享取消"
				})
			} else if (res.errMsg == 'shareAppMessage:fail') {
				uni.showToast({
					icon: "none",
					title: "分享失败"
				})
			}
		}),
		complete: (res => {
			console.log(res);
		})
	}
	return share;
}

/**
 * 小程序分享朋友圈生成海报
 * @param {Object} e
 * @param {Object} options
 */
export function sharePoster(options){
	let ctx = wx.createCanvasContext(options.canvasId);
	let win = wx.getSystemInfoSync();
	console.log(options);
	// ctx.width = options.width;
	// ctx.height = options.height;
	
	// ctx.draw()
	//开户设置背景
	ctx.setFillStyle('white');
    ctx.fillRect(0, 0, options.width, options.height);
	// ctx.draw(true);
	// console.log(ctx);
	
	//设置封面图
	// ctx.save();
	// let coverImg = this.getImageAsync(options.coverImg);
	// console.log(coverImg);
	// ctx.restore();
	let ratio = 3;
	let coverWidth = options.width;
	let coverHeight = 236 * ratio;
	
	// uni.showModal({
	// 	title: JSON.stringify(options)
	// })
	
	//背景图渲染
	ctx.save();
	ctx.setFillStyle("rgba(0,0,0,0.04)");
	ctx.fillRect(0, 0, coverWidth, coverHeight);
	ctx.fill();
	ctx.restore();
	
	
	wx.getImageInfo({
		src:options.coverImg,
		success: (res) => {
			console.log(res);
			// uni.showModal({
			// 	title:JSON.stringify(res)
			// });
			// let ratioWidth = res.width / coverWidth;
			// let ratioHeight = res.height /coverHeight;
			let imgWidth = res.width,imgHeight = res.height;
			
			
	// 		//调度400
			ctx.save();
			
			// ctx.fillRect(0, 0, coverWidth, coverHeight);
			
			let renderWidth = imgWidth >= coverWidth ? coverWidth:imgWidth;
			let renderHeight = imgHeight >= coverHeight?coverHeight:imgHeight;
			
			let moveWidth = Math.abs(coverWidth - imgWidth);
			let moveHeight = Math.abs(coverHeight - imgHeight);
			
			// ctx.clip();
			// ctx.drawImage(res.path,(coverWidth - imgWidth)/2,(coverHeight - imgHeight),coverWidth)
			ctx.drawImage(res.path,0,0,coverWidth,coverHeight,moveWidth/2,moveHeight/2);
			
			ctx.restore();
			//项目名称
			ctx.save();
			ctx.setFillStyle("rgba(0,0,0,0.9)");
			ctx.setFontSize(24*ratio);
			let fname = options.name;
			if(fname.length > 10){
				fname = fname.substring(0,5)+'...';
			}
			ctx.fillText(options.name,16*ratio, coverHeight + 48*ratio);
			ctx.restore();
			//价格
			ctx.save();
			ctx.setFillStyle("rgba(255,136,0,1)");
			ctx.setFontSize(16*ratio);
			ctx.setTextAlign("right");
			ctx.fillText("￥"+options.price+"万", coverWidth - 16*ratio, coverHeight + 48*ratio);
			ctx.restore();
			//类别设置
			let pw = (coverWidth - 16 * ratio * 2) /3.5; 
			ctx.save();
			ctx.setFillStyle("rgba(0,0,0,0.9)");
			// ctx.font = "normal bold 16px";
			ctx.setFontSize(16*ratio);
			ctx.setTextAlign("left");
			ctx.fillText(options.type, 16*ratio, coverHeight +48*(ratio+2),pw);
			ctx.fillText(options.style, 16*ratio + pw , coverHeight +48*(ratio+2),pw);
			ctx.fillText(options.houseType, 16*ratio + pw*2, coverHeight + 48*(ratio+2),pw);
			ctx.fillText(options.houseArea+'m²', 16*ratio + pw*3, coverHeight + 48*(ratio+2),pw);
			ctx.restore();
			
		
			ctx.save();
			ctx.setFillStyle("rgba(0,0,0,0.4)");
			ctx.setFontSize(14*ratio);
			ctx.setTextAlign("left");
			ctx.fillText("类型", 16*ratio, coverHeight + 48*(ratio+3.4),pw);
			ctx.fillText("风格", 16*ratio + pw , coverHeight + 48*(ratio+3.4),pw);
			ctx.fillText("户型", 16*ratio + pw*2, coverHeight + 48*(ratio+3.4),pw);
			ctx.fillText("面积", 16*ratio + pw*3, coverHeight + 48*(ratio+3.4),pw);
			ctx.restore();
			
			
			
			// ctx.setFillStyle("rgba(0,0,0,0.04)");
			// ctx.setStrokeStyle("rgba(0,0,0,0.04)");
			
			//分隔符
			ctx.save();
			ctx.beginPath();
			ctx.arc(0, coverHeight + 48*(ratio+5),8*ratio,Math.PI*1.5,Math.PI*0.5,false);
			ctx.closePath();
			ctx.setFillStyle("rgba(0,0,0,0.04)");
			ctx.fill();
			// ctx.stroke();
		
			// ctx.restore();
			
			ctx.beginPath();
			ctx.arc(coverWidth,coverHeight + 48*(ratio+5),8*ratio,Math.PI*1.5,Math.PI*0.5,true);
			ctx.closePath();
			ctx.setFillStyle("rgba(0,0,0,0.04)");
			ctx.fill();
			// ctx.restore();
			
			
			ctx.beginPath();
			// ctx.arc(560,400 + 16 +30*5,20,0,Math.PI*2,true);
			ctx.closePath();
			ctx.setFillStyle("rgba(0,0,0,0.04)");
			ctx.fill();
			ctx.restore();
			// ctx.draw();
			
			//虚线
			ctx.save();
			ctx.setLineDash([5, 10], 2);
			ctx.setLineWidth(1*ratio); 
			ctx.setFillStyle("rgba(0,0,0,0.06)");
			ctx.setStrokeStyle("rgba(0,0,0,0.06)");
			ctx.moveTo(8*ratio, coverHeight + 48*(ratio+5)); 
			ctx.lineTo(coverWidth - 20*ratio, coverHeight + 48*(ratio+5)); 
			ctx.stroke();
			ctx.restore();
			
			
		
			//提醒业务
			ctx.save();
			ctx.setFillStyle("rgba(0,0,0,0.9)");
			// ctx.font = "normal 16px";
			ctx.setFontSize(16*ratio);
			ctx.fillText("在线装修", 16*ratio, coverHeight + 48*(ratio+9));
			ctx.fill();
			ctx.restore();
		
			ctx.save();
			ctx.setFillStyle("rgba(0,0,0,0.4)");
			// ctx.font = "normal 14px";
			ctx.setFontSize(14*ratio);
			ctx.fillText("长按扫码查看", 16*ratio, coverHeight + 48*(ratio+10.4));
			ctx.fill();
			ctx.restore();
			
			wx.getImageInfo({
				src:options.qrImg,
				success: (qr) => {
					console.log("SUCCESS DATA==="+JSON.stringify(qr));
					ctx.drawImage(qr.path,coverWidth - 16*ratio - 280, coverHeight + 48*(ratio+6),280,280);
					ctx.draw(true);
					// uni.showLoading({
					// 	title:"正在生成海报中"
					// });
					// ctx.draw(false,()=>{
					// 	setTimeout(()=>{
					// 		wx.canvasToTempFilePath({
					// 			canvasId:"poster",
					// 			success: (res) => {
					// 				console.log("POSTER====="+JSON.stringify(res));
					// 				wx.saveImageToPhotosAlbum({
					// 					filePath:res.tempFilePath,
					// 					success: (albumData) => {
					// 						console.log("LOCAL POHOTOES====="+JSON.stringify(albumData));
					// 						uni.hideLoading();
					// 						uni.showToast({
					// 							icon:"none",
					// 							title:"保存成功",
					// 							success: () => {
					// 								options.close();
					// 							}
					// 						})
					// 					},
					// 					complete: (info) => {
					// 						uni.hideLoading();
					// 					}
					// 				})
					// 			}
					// 		})
					// 	},1000);
					// });
				},
				fail:(err) =>{
					console.log("FAIL ERROR==="+JSON.stringify(err));
					uni.hideLoading();
					wx.getImageInfo({
						src:Constant.defaultQrcodeImg,
						success: (qr) => {
							console.log("FAIL ERROR + SUCCESS DATA==="+JSON.stringify(qr));
							ctx.drawImage(qr.path,coverWidth - 16*ratio - 280, coverHeight + 48*(ratio+6),280,280);
							uni.showLoading({
								title:"正在生成海报中"
							});
							ctx.draw(false,()=>{
								setTimeout(()=>{
									wx.canvasToTempFilePath({
										canvasId:"poster",
										success: (res) => {
											console.log("POSTER====="+JSON.stringify(res));
											wx.saveImageToPhotosAlbum({
												filePath:res.tempFilePath,
												success: (albumData) => {
													console.log("LOCAL POHOTOES====="+JSON.stringify(albumData));
													uni.hideLoading();
													uni.showToast({
														icon:"none",
														title:"保存成功",
														success: () => {
															options.close();
														}
													})
												},
												complete: (info) => {
													uni.hideLoading();
												}
											})
										}
									})
								},1000);
							});
							
							
						}
					})
				},
				complete:(info) =>{
					// uni.hideLoading();
					console.log("complete infomation=="+JSON.stringify(info));
				}
			})
			
		}
	})
	
}

/**
 * 截取整数的位数判定
 * @param {Object} val
 * @param {Object} num 截取的位数
 * @param {Object} bool 是否采用四舍五入
 */
export function subPrecision(val,num,bool = true){
	if(val){
		let current = String(val);
		let arr = current.split(".");
		console.log(arr);
		if(bool){
			if(arr && arr.length > 1){
				if(arr[1].substring(0,num)){
					return [arr[0],arr[1].substring(0,num)].join(".");	
				}
				return arr[0];
			}
			return arr[0];
		}else{
			return Number(val).toFixed(num);
		}
	}
}

/**
 * 截取字符串
 * @param {Object} val
 * @param {Object} len 截取长度
 * @param {Object} mark 替代符号 
 */
export function subText(val,len,mark = '.'){
	if(val){
		if(String(val).length > len){
			return String(val).substring(0,len)+mark.repeat(3);
		}
		return String(val).substring(0,len);
	}
}