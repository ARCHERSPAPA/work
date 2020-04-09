import * as d3 from "d3";

//自定义渲染的line对象
export class LigatureChart {
    public target: any;

    constructor(target: HTMLElement) {
        this.target = target;
    }

    render(data: any, id: number) {

        d3.select(this.target).selectAll("path")
            .data(data)
            .enter()
            .append("path")
            .transition()
            .duration(100)
            .ease(d3.easeLinear)
            // .attr('transform', d =>{
            //     return "skewX(10)"
            // })
            .attr("d", d => {
                return this.line(d.data);
            })
            .attr("fill", "none")
            .attr("stroke", d => {
                return (id && d.id === id) ? "#1890FF" : "#D9D9D9";
            })
            .attr("stroke-width", 2)
    }


    //设置贝塞尔曲线方程
    line(array: any) {
        let x1 = array[0], y1 = array[1], x2 = array[2], y2 = array[3], divide = 3;
        //三角形
        let x31 = x2 - divide, y31 = y2 - divide, x32 = x2 - divide, y32 = y2 + divide;

        return this.bezierCurve(x1,y1,x2,y2,divide*1.2)+" S"+[x2-divide*1.2,y2,x2,y2].join(",")+" M" + [x31, y31, x2, y2, x32, y32].join(",") + "Z";


    }

    //画圆
    ellipse2path(cx, cy) {
        return "M" + [cx, cy].join(',') + " m-5,0, a5,5,0,1,0,10,0, a5,5,0,1,0,-10,0Z";
    }

    //贝塞尔曲线
    bezierCurve(x1,y1,x2,y2,divide){
        if(y2-y1 > 0){
            return " M" + [x1, y1].join(",")+" Q"+[x1+100,y1-50,Math.floor((x1+x2)/2),(y2+y1)/2].join(",")+" T"+[x2-divide,y2].join(",");
        }
        else{
            return " M" + [x1, y1].join(",")+" Q"+[x1+100,y1+50,Math.floor((x1+x2)/2),y2+(y1-y2)/2].join(",")+" T"+[x2-divide,y2].join(",");
        }
    }

    destroy() {
        d3.select(this.target).selectAll("path").remove();
    }

}