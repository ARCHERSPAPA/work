import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'translateHTML'
})
export class TranslateHTMLPipe implements PipeTransform {


    transform(value: any, args?: any): any {
        if(value){
            return value.replace(/\</g, '&lt')
                .replace(/\>/g, '&gt')
                .replace(/\r\n/g, '<br>')
                .replace(/\n/g, '<br>')
                .replace(/\s/g, '&nbsp;');
        }
        return null;
    }

}
