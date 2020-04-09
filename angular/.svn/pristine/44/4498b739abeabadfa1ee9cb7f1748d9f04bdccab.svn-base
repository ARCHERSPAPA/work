import {Component, OnInit, Input, ElementRef} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Messages} from "../../model/msg";

@Component({
    selector: 'rev-img-large',
    templateUrl: './img-large.component.html',
    styleUrls: ['./img-large.component.scss']
})
export class ImgLargeComponent implements OnInit {
    //查看图片title
    @Input() title: string;

    //查看图片的source
    @Input() src: string;

    private movePos = {
        x: 0,
        y: 0
    };
    private isMove: boolean = false;

    private imgDom: any;
    private moveDom: any;

    constructor(private el: ElementRef,
                public activeModal: NgbActiveModal) {
    }

    ngOnInit() {
        this.imgDom = this.el.nativeElement.querySelector("#imageLarge");

        this.moveDom = this.el.nativeElement.querySelector("#moveLarge");


    }

    onMouseWheel(e) {
        e.stopPropagation();
        e.preventDefault();
        let zoom = parseInt(this.imgDom.style.zoom, 10) || 100;
        zoom += e.wheelDelta / 12;
        if (zoom > 100) {
            this.imgDom.style.zoom = zoom + "%";
        }
    }
    onZoom(e){
        e.stopPropagation();
        e.preventDefault();
        let zoom = parseInt(this.imgDom.style.zoom, 10) || 100;
        zoom += 20;
        if (zoom > 100) {
            this.imgDom.style.zoom = zoom + "%";
        }
    }

    onMove(e) {
        e.stopPropagation();
        e.preventDefault();
        if (this.isMove) {
            let zoom = parseInt(this.imgDom.style.zoom ? this.imgDom.style.zoom : 100) / 100;

            let l = parseInt(e.clientX),
                t = parseInt(e.clientY);


            let iw = Number(this.imgDom.width),
                ih = Number(this.imgDom.height),
                mw = Math.floor(this.imgDom.width * zoom),
                mh = Math.floor(this.imgDom.height * zoom);

            let ml = Math.floor(l - this.movePos.x),
                mt = Math.floor(t - this.movePos.y);

            if (ml != 0) {
                if (Math.abs(ml) >= (mw - iw)) {
                    ml = (mw - iw) * Math.pow(-1, ((ml < 0) ? 1 : 2));
                }
            }

            if (mt != 0) {
                if (Math.abs(mt) >= (mh - ih)) {
                    mt = (mh - ih) * Math.pow(-1, ((mt < 0) ? 1 : 2));
                }
            }

            this.moveDom.style.left = ml + "px";
            this.moveDom.style.top = mt + "px";

        }
    }

    onDown(e) {
        e.stopPropagation();
        e.preventDefault();
        //获取当前元素已经移动的坐标位移
        let ol = parseInt(this.moveDom.offsetLeft ? this.moveDom.offsetLeft : 0),
            ot = parseInt(this.moveDom.offsetTop ? this.moveDom.offsetTop : 0);
        this.movePos = {
            x: parseInt(e.clientX) - ol,
            y: parseInt(e.clientY) - ot
        }
        this.isMove = true;
    }

    onUp(e) {
        e.stopPropagation();
        e.preventDefault();
        this.isMove = false;
    }

    onLeave(e) {
        e.stopPropagation();
        e.preventDefault();
        this.isMove = false;
    }

    onReset(e) {
        e.stopPropagation();
        e.preventDefault();
        this.moveDom.style.left = "0px";
        this.moveDom.style.top = "0px";
        this.imgDom.style.zoom = "100%";
    }

}
