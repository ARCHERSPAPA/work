import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'region'
})
export class RegionPipe implements PipeTransform {

    transform(region: any, args?: any): any {
        if(region && region["districts"]){
            let regions = [];
            for(let i in region["districts"]){
                regions.push(region["districts"][i].name);
            }
            return regions.join(",")
        }
        return null;
    }


}

