import { Component, OnInit,ElementRef } from '@angular/core';
import {RequestService} from "../../../service/request.service";
import {WarningService} from "../../../service/warning.service";
import {Default} from "../../../model/constant";
import {Messages} from "../../../model/msg";
import G2 from '@antv/g2/build/g2';
import { DataSet } from '@antv/data-set/build/data-set';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import * as differenceInCalendarDays from 'date-fns/difference_in_calendar_days';

@Component({
  selector: 'rev-stats-sketch',
  templateUrl: './stats-sketch.component.html',
  styleUrls: ['./stats-sketch.component.scss']
})
export class StatsSketchComponent implements OnInit {

	public data:Array<any>=[];  //图表数组
	public chart:any ; //渲染图表
	public startTime:Date; //日期选择器的开始时间
	public endTime:any; //日期选择器的结束时间
	public timeFlag:boolean = false; //是否打开日期选择器
	public dateRange:Array<any>; //绑定日期开始及结束时间
	public toBeDistributeCount:number; //待派单
	public toBeStartedCount:number; //待开工
	public constructionCount:number; //施工中
	public acceptanceCheck:number; //待验收
	public pageNo: number = Default.PAGE.PAGE_NO; //表格默认从第几页开始
    public pageSize: number = Default.PAGE.PAGE_SIZE; //表格一页的条数
	public total: number = Default.PAGE.PAGE_TOTAL; //表格总条数
	public tableList:Array<any>; //表格数据
	public today:Date = new Date();


	constructor(private request:RequestService,
				private warn:WarningService,
				private el:ElementRef
				) { }

	ngOnInit() {
		this.endTime = new Date();
		let date2 = new Date(this.endTime);
		date2.setDate(this.endTime.getDate() - 7);
		this.startTime = date2;
		this.dateRange = [this.startTime,this.endTime]
		this.rectData();
		this.changeData();
	}

	//初始渲染数据
	rectData(){
		let that = this;
		let params = {
			startTime:this.startTime,
			endTime:this.endTime
		}
		that.request.doPost({
			url:"statisticalConstructionSite",
			data:params,
			success:res=>{
				console.log(res)
				if(res && res.code == 200){
					this.toBeDistributeCount = res.data.toBeDistributeCount;
					this.toBeStartedCount = res.data.toBeStartedCount;
					this.constructionCount = res.data.constructionCount;
					this.acceptanceCheck = res.data.acceptanceCheck;
					var keyMap = {
						"dynamicCount" : "动态数",
						"joinCount" : "负责工地数",
						"activeCount":"发布动态数",
					};
					// 改变key值
					for(let i = 0;i < res.data.supervisorStatistics.length;i++){
						var obj = res.data.supervisorStatistics[i];
						for(var key in obj){
							var newKey = keyMap[key];
							if(newKey){
								obj[newKey] = obj[key];
								delete obj[key];
							}
						}
					}
					this.data = res.data.supervisorStatistics;
					this.chartData();
					this.clearView();
				}else{
					that.warn.onError(res.msg || Messages.FAIL.DATA);
				}
			}
		})
	}

	chartData(){
		const ds = new DataSet({
			state: {
				start: this.startTime.getTime(),
				end: this.endTime.getTime()
			}
		});
		const dv = ds.createView('origin').source(this.data);
		dv.transform({
			type: 'fold',
			fields:['发布动态数','负责工地数','动态数'],
			key:'key',
			value:'value',
			retains:['name']
		})
		this.chart = new G2.Chart({
			container: 'container',
			forceFit: true,
			padding: [ 20, 20, 120, 100 ]
		});
		// x轴名字太长用...
		function formatter(value:any) {
			if (value.length <= 3) {
			  	return value;
			}
			return value.substring(0, 3) + '...';
		}
		console.log(dv.rows)
		if(dv.rows.length > 30 && dv.rows){
			this.chart.source(dv.rows,{
				name:{
					formatter,
					values: dv.rows.slice(0, 30).map(row => row['name'])
				}
			});
		}else{
			this.chart.source(dv.rows,{
				name:{
					formatter
				}
			});
		}
		/* this.chart.source(dv.rows,{
			name:{
				formatter
			}
		}); */
		this.chart.interval()
		.position('name*value')
		.color('key',['#1890FF','#40A9FF','#91D5FF'])
		.adjust([{
			type: 'dodge',
			// 1 / 32
			marginRatio: 0
		}]);
		this.chart.render();
		if(dv.rows.length > 30 && dv.rows){
			this.chart.interact('drag', {
				type: 'X'
			}).interact('scroll-bar', {
				type: 'X'
			});
		}else{
			return;
		}
	}

	//清除重复的图形
	clearView(){
		// canvas重复渲染 删除第一个子节点
		let lineDraw = this.el.nativeElement.querySelector('#container');
		if(lineDraw.children.length > 1){
			lineDraw.removeChild(lineDraw.firstChild);
		}else{
			return;
		}
	}  
	
	onChange(result: Date): void {
		this.timeFlag = false;
		this.startTime = result[0];
		this.endTime = result[1];	
		this.rectData();
		this.changeData();
	}

	open(){
		this.timeFlag = true;
	}
	//日期选择不能选今天之后的
	disabledDate = (current: Date): boolean => {
		return differenceInCalendarDays(current, this.today) > 0;
	};

	//表格分页
	changeData(){
		let that = this;
		let params = {
			startTime:this.startTime,
			endTime:this.endTime,
			pageNo:this.pageNo,
			pageSize:this.pageSize
		}
		that.request.doPost({
			url:'statisticalConstructionSiteInfo',
			data:params,
			success:res=>{
				if (res && res.code == 200) {
					res.data.pageSet.forEach(item=>{
						if(item.customerHouseArea !== null){
							item.customerHouseArea = parseFloat(item.customerHouseArea).toFixed(2);
						}
						if(item.customerName!==null){
							item.customerName = item.customerName.slice(0,1) + '*';
						}
					})
                    that.tableList = res.data.pageSet;
					that.total = res.data.pageCount;
                } else {
                    that.warn.onError(res.msg || Messages.FAIL.DATA);
                }
			}
		})
	}

	//下载excel
	exportToExcel(){
		let that = this;
		let params = {
			startTime:this.startTime,
			endTime:this.endTime,
		}
		that.request.doPost({
			url:'statisticalConstructionSiteInfoDw',
			data:params,
			success:res=>{
				if (res && res.code == 200) {
					let excelData = res.data;
					excelData.forEach(item=>{
						switch (item.type) {
							case 1:
								item.type = '基装'
								break;
							case 2:
								item.type = '套装'
								break;
							case 3:
								item.type = '整装'
								break;
						}
						let date = new Date(item.createDate);
						let seperator1 = "-";
						let year = date.getFullYear();
						let month:any = date.getMonth() + 1;
						let strDate:any = date.getDate();
						if (month >= 1 && month <= 9) {
							month = "0" + month;
						}
						if (strDate >= 0 && strDate <= 9) {
							strDate = "0" + strDate;
						}
						let hour:any = date.getHours();
						if(hour.toString().length !== 2){
							hour = "0" + hour
						}
						let minute:any = date.getMinutes()
						if(minute.toString().length !== 2 ){
							minute =  "0" + minute
						}
						let second:any = date.getSeconds();
						if(second.toString().length !== 2 ){
							second =  "0" + second
						}
						item.createDate = year + seperator1 + month + seperator1 + strDate +'\xa0'+ hour + ':' + minute + ':' +second;
						item.customerHouseArea = parseFloat(item.customerHouseArea).toFixed(2);
					})
					let keyMap = {
						"createDate" : "发布时间",
						"supervisorName" : "监理",
						"wokerName":"工长",
						"customerName":"客户",
						"customerHouseAddress":"楼盘房号",
						"customerHouseType":"户型",
						"customerHouseArea":"面积",
						"type":"装修类型",
						"stageName":"进度",
					};
					// 改变key值
					for(let i = 0;i < excelData.length;i++){
						let obj = excelData[i];
						for(let key in obj){
							let newKey = keyMap[key];
							if(newKey){
								obj[newKey] = obj[key];
								delete obj[key];
							}
						}
					}
					let json = excelData;
					const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
					const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
					const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
					this.saveAsExcelFile(excelBuffer, "工地概况");
                } else {
                    that.warn.onError(res.msg || Messages.FAIL.DATA);
                }
			}
		})
	}
	saveAsExcelFile(buffer: any, fileName: string) {
	    const data: Blob = new Blob([buffer], {
	    	type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
		});
		// 下载Excel的名字
 		FileSaver.saveAs(data, fileName + '.xls');     
	} 
}
