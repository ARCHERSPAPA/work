import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ExplainPipe'
})
export class ExplainPipe implements PipeTransform {

  transform(value: any) {

    if (value) {
      const explain = value.toString();
      if (explain.length > 40) {
        return explain.substr(0, 40) + '...';
      } else {
        return explain;
      }
    }
    return '----';
  }
}

@Pipe({
  name: 'MaxPipe'
})
export class MaxPipe implements PipeTransform {

  transform(value: any) {

    if (value) {
      const explain = value.toString();
      if (explain.length > 10) {
        return explain.substr(0, 10) + '...';
      } else {
        return explain;
      }
    }
    return '----';
  }

}

@Pipe({
  name: 'NoticePipe'
})
export class NoticePipe implements PipeTransform {

  transform(value: any) {

    if (value) {
      const explain = value.toString();
      if (explain.length > 45) {
        return explain.substr(0, 45) + '...';
      } else {
        return explain;
      }
    }
    return '----';
  }

}

@Pipe({
  name: 'NoticeTwentyPipe'
})
export class NoticeTwentyPipe implements PipeTransform {

  transform(value: any) {

    if (value) {
      const explain = value.toString();
      if (explain.length > 20) {
        return explain.substr(0, 20) + '...';
      } else {
        return explain;
      }
    }
    return '----';
  }

}

@Pipe({
  name: 'FourPipe'
})
export class FourPipe implements PipeTransform {
  transform(value: any) {
    if (value) {
      const str = value.toString();
      if (str.length > 4) {
        let elip = '';
        for (let i = 0; i < str.length - 4; i++) {
          elip += '*';
        }
        return elip + str.substr(-4);
      } else {
        return str;
      }
    }
    return '----';
  }
}

@Pipe({
  name: 'CheckHtml'
})
export class CheckHtml implements PipeTransform {
  transform(value: any) {
    if (value) {
      return value;
    }
    return '--';
  }

}
