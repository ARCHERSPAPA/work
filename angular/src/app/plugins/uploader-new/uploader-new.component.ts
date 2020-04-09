import {Component, OnInit, Input} from '@angular/core';

@Component({
    selector: 'rev-uploader-new',
    templateUrl: './uploader-new.component.html',
    styleUrls: ['./uploader-new.component.scss'],
})
export class UploaderNewComponent implements OnInit {

    @Input() content: string;
    @Input() width:number;
    @Input() height: number;

    ngOnInit(): void {
        this.width = this.width?this.width:160;
        this.height = this.height?this.height:160;
    }

}
