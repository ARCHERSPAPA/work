<template>
	<view class="mkb-form">
		<view class="mkb-form-box">
			<input class="mkb-input" type="number" v-model="phone" placeholder="请输入手机号码" 
			@input="changePhone"  maxlength="11" :disabled="disabled" />
			<button class="mkb-btn" :class="{'actived':disabled}" type="button" @click="getCode">
				<uni-countdown color="#FF8000" background-color="#FFF" 
				:showColon="false" :showDay="false" border-color="#FFF" 
				:showHour="false" :showMinute="false" splitorColor="#FF8000"
				:second="60" @timeup="timeup" v-if="countDown"></uni-countdown>
				<text v-else>获取验证码</text>
			</button>
		</view>
		<view>
			<view class="mkb-form-box">
				<input class="mkb-input" type="number" v-model="code"
				placeholder="请输入验证码" @input="changeCode"/>
			</view>
		</view>
		<view class="mkb-form-box">
			<button type="button" class="mkb-btn-login" :class="{'valid':valid}">登录</button>
		</view>
	</view>
</template>

<script>
	import Validators from '../../util/validators.js'
	import uniCountdown from '../../components/uni-countdown/uni-countdown.vue'
	export default {
		comnponents:{
			uniCountdown
		},
		data() {
			return {
				phone: '',
				code: '',
				disabled: false,
				countDown: false,
				valid: false,
				second: 0
			}
		},
		methods: {
			timeup(){
				this.disabled = false;
				this.countDown = false;
			},
			
			getCode() {
				if(this.countDown) return;
				if(this.disabled) return;
				this.countDown = true;
				this.disabled = true;
				this.second = 60;
			},
			
			changePhone() {
				if(this.phone.length === 11){
					let result = Validators.validPhone(this.phone);
					if(result){
						uni.showModal({
							title:"提示",
							content: result,
							showCancel: false
						})
					}else{
						this.disabled = true;
					}
				}
			},
			
			changeCode(){
				if(this.code.length == 4){
					let result = Validators.validCode(this.phone);
					if(result){
						uni.showModal({
							title:"提示",
							content: result,
							showCancel: false
						})
					}else{
						if(this.disabled){
							this.valid = true;
						}else if(!Validators.validPhone(this.phone)){
							this.valid = true;
						}
					}
				}
			}
		}
	}
</script>

<style lang="scss">
	::-webkit-input-placeholder {
		color: rgba(204, 206, 211, 1);
	}

	.mkb-form {
		margin: 48.91rpx;

		.mkb-form-box {
			width: 100%;
			height: 126.81rpx;
			position: relative;

			.mkb-input {
				width: 100%;
				height: 100%;
				font-size: 32.6rpx;
				font-weight: 400;
				color: rgba(0, 0, 0, 1);
				border-bottom: 1.81rpx solid rgba(222, 222, 222, 1);
			}

			.mkb-btn {
				display: inline-block;
				padding: 0;
				font-size: 32.6rpx;
				font-weight: 400;
				position: absolute;
				right: 0;
				outline: none;
				top: 24.45rpx;
				color: rgba(155, 152, 152, 1);
				background: transparent;
				&:after {
					border: 0;
				}
				&.actived{
					color:rgba(255, 136, 0, 1);
				}
			}

			.mkb-btn-login {
				display: block;
				width: 100%;
				height: 101.44rpx;
				line-height: 101.44rpx;
				margin-top: 79.71rpx;
				color: rgba(255, 255, 255, 1);
				font-size: 36.23rpx;
				font-weight: 500;
				background: rgba(222, 222, 222, 1);
				outline: none;
				border-radius: 18.11rpx;

				&:after {
					border: 0;
				}

				&.valid {
					background: rgba(255, 136, 0, 1);
				}
			}
		}
	}
</style>
