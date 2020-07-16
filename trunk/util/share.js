import {getColor} from './util.js';
/**
 * 微信分享
 * @param {Object} e
 * @param {Object} options
 */
export function shareWechat(e, options) {
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
	let circleColor = "rgba(0,0,0,0.04)";
	console.log(options);
	
	//开户设置背景
	ctx.setFillStyle('white');
    ctx.fillRect(0, 0, options.width, options.height);

	
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
		src: options.bgImg,
		success: (bg) => {
			console.log(bg);
			let bgWidth = bg.width,bgHeight = bg.height;
			if(bgWidth > options.width){
				bgWidth = options.width;
				bgHeight = bgHeight / (bg.width/options.width);
			}
			
			ctx.drawImage(bg.path,0,0,options.width,options.height);
			//获取背景图片指定颜色 
			ctx.draw(false,function(){
				wx.canvasGetImageData({
						canvasId: options.canvasId,
						x:72,
						y:coverHeight + 422 + 366 - 24,
						width: 72,
						height: 72,
						success:(image =>{
							circleColor = getColor(image,10,15);
						})
					
				})
			})
			
			wx.getImageInfo({
				src:options.coverImg,
				success: (res) => {
					console.log(res);
					let imgWidth = res.width,imgHeight = res.height;
						
			 		//调度400
					ctx.save();
					
					let renderWidth = imgWidth >= coverWidth ? coverWidth:imgWidth;
					let renderHeight = imgHeight >= coverHeight?coverHeight:imgHeight;
					
					let moveWidth = Math.abs(coverWidth - imgWidth);
					let moveHeight = Math.abs(coverHeight - imgHeight);
					
					// ctx.clip();
					// ctx.drawImage(res.path,(coverWidth - imgWidth)/2,(coverHeight - imgHeight),coverWidth)
					ctx.drawImage(res.path,72,422,coverWidth -144,coverHeight,moveWidth/2,moveHeight/2);
					ctx.restore();
					
					//上端两边圆弧
				// 	ctx.beginPath();
				// 	ctx.setFillStyle("rgba(255,5,1,1)");
				// 	ctx.clearRect(72,422,32,32);
				// 	ctx.fill();
				// 	ctx.lineTo(72,422+32);
				// 	// ctx.arc(72+32,422+32,32,Math.PI,Math.PI*1.5,false);
				// 	ctx.arcTo(72,422,72+32,422,32);
				// 	ctx.setStrokeStyle("rgba(255,2,0,1)");
				// 	ctx.stroke();
				// 	ctx.fill();
				// 	ctx.closePath();
				
				// 	ctx.restore();
					
					
					//添加内容背景
					ctx.save();
					ctx.setFillStyle("rgba(255,255,255,1)");					ctx.fillRect(72,1100, 1098, 693);					ctx.fill();
					ctx.restore();
					
					//项目名称
					ctx.save();
					ctx.setFillStyle("rgba(0,0,0,0.9)");
					ctx.setFontSize(68);
					let fname = options.name;
					if(fname.length > 10){
						fname = fname.substring(0,5)+'...';
					}
					ctx.fillText(options.name,72 + 48, coverHeight + 422 + 116);
					ctx.restore();
					if(options.price !== ''){
						//价格
						ctx.save();
						ctx.setFillStyle("rgba(255,136,0,1)");
						ctx.setFontSize(45);
						ctx.setTextAlign("right");
						ctx.fillText("￥"+options.price+"万", coverWidth - 72 - 48, coverHeight + 422 + 109);
						ctx.restore();
					}
					
					//类别设置
					let pw = (coverWidth - 144 - 96) /3.5; 
					ctx.save();
					ctx.setFillStyle("rgba(0,0,0,0.9)");
					// ctx.font = "normal bold 16px";
					ctx.setFontSize(44);
					ctx.setTextAlign("left");
					ctx.fillText(options.type, 72 + 48, coverHeight + 422 + 194,pw);
					ctx.fillText(options.style, 72 + 48 + pw , coverHeight + 422 +194,pw);
					ctx.fillText(options.houseType, 72 + 48+ pw*2, coverHeight + 422 +194,pw);
					ctx.fillText(options.houseArea+'m²', 72 + 48 + pw*3, coverHeight + 422 + 194,pw);
					ctx.restore();
					
				
					ctx.save();
					ctx.setFillStyle("rgba(0,0,0,0.4)");
					ctx.setFontSize(40);
					ctx.setTextAlign("left");
					ctx.fillText("类型", 72 + 48, coverHeight + 422 + 244,pw);
					ctx.fillText("风格", 72 + 48 + pw , coverHeight + 422 + 244,pw);
					ctx.fillText("户型", 72 + 48 + pw*2, coverHeight + 422 + 244,pw);
					ctx.fillText("面积", 72 + 48 + pw*3, coverHeight + 422 + 244,pw);
					ctx.restore();
					
					
					
					//分隔符
					ctx.save();
					ctx.beginPath();
					ctx.arc(72, coverHeight + 422 + 366 - 24,24,Math.PI*1.5,Math.PI*0.5,false);
					ctx.setFillStyle(circleColor);
					ctx.fill();
					ctx.closePath();
					
				
					ctx.beginPath();
					ctx.arc(coverWidth -72,coverHeight +422 + 366 - 24,24,Math.PI*1.5,Math.PI*0.5,true);
					ctx.setFillStyle(circleColor);
					ctx.fill();
					ctx.closePath();
					ctx.restore();
					
					
					//虚线
					ctx.save();
					ctx.beginPath();
					ctx.setLineDash([5, 15], 3);
					ctx.setLineWidth(3); 
					ctx.setStrokeStyle("rgba(0,0,0,0.06)");
					ctx.moveTo(72+24, coverHeight + 422 + 366 - 24); 
					ctx.lineTo(coverWidth - 72 - 24, coverHeight + 422 + 366 - 24); 
					ctx.stroke();
					ctx.closePath();
					ctx.restore();
					
					
				
					//提醒业务
					ctx.save();
					ctx.setFillStyle("rgba(0,0,0,0.9)");
					ctx.setFontSize(45);
					ctx.fillText("在线装修", 72+48, coverHeight + 422 + 514);
					ctx.fill();
					ctx.restore();
				
					ctx.save();
					ctx.setFillStyle("rgba(0,0,0,0.4)");
					ctx.setFontSize(40);
					ctx.fillText("长按扫码查看", 72+48, coverHeight + 422 + 587);
					ctx.fill();
					ctx.restore();
					
					wx.getImageInfo({
						src:options.qrImg,
						success: (qr) => {
							console.log("SUCCESS DATA==="+JSON.stringify(qr));
							ctx.drawImage(qr.path,coverWidth - (72 + 48 + 230), coverHeight + 422 + 415,230,230);
							ctx.draw(true,()=>{
								setTimeout(()=>{
									options.show();		
								},1000);
							});
							
							// console.log(Canvas.toDataURL("image/png"));
							// console.log(document.getElementById(options.canvasId).toDataURL("image/png"));
						},
						fail:(err) =>{
							console.log("FAIL ERROR==="+JSON.stringify(err));
							uni.hideLoading();
							wx.getImageInfo({
								src:Constant.defaultQrcodeImg,
								success: (qr) => {
									console.log("FAIL ERROR + SUCCESS DATA==="+JSON.stringify(qr));
									ctx.drawImage(qr.path,coverWidth - (72 + 48 + 230), coverHeight + 422 + 415,230,230);
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
	})
	
	
}

/**
 * 活动分享
 * @param {Object} options
 */
export function sharePosterByImg(options){
	 let ctx = wx.createCanvasContext(options.canvasId);
	 ctx.clearRect(0,0,options.width,options.height);
	 let src = options.bgImg+'?imageslim';
	 wx.getImageInfo({
		 src: src,
		 success: (res) => {
			 console.log(res);
		 	ctx.drawImage(res.path,0,0,options.width,options.height);
			wx.getImageInfo({
				src:options.qrImg,
				success: (qr) => {
					console.log(qr);
					ctx.drawImage(qr.path,206,(options.height - 227 - 90),227,227);
					ctx.draw(true,()=>{
						setTimeout(()=>{
							options.show();		
						},500);
					});
				}
			})
		 }
	 })
}