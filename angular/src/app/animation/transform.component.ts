/**定义动画的ts文件**/
import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';

export const sideAnimate = trigger('slide', [

    state('left', style({
        transform: 'translate3d(-300%,0,0)'
    })),

    state('right', style({
        transform: 'translate3d(0,0,0)'
    })),

    transition('left => right', animate(1000, keyframes([
            style({ transform: 'translate3d(0,0,0)' }),
        ]))),

    transition('right => left', animate(1000, keyframes([
        style({ transform: 'translate3d(-300%,0,0)' }),
    ])))
]);

export const bounceAnimate = trigger('bounce', [
    state('up', style({
        transform: 'translate3d(0,-1000%,0)'
    })),

    state('down', style({
       transform: 'translate3d(0,0,0)'
    })),

    state('bottom', style({
        transform: 'translate3d(0,1000%,0)'
    })),

    transition('up => down', animate(1000, keyframes([
        style({
            transform: 'translate3d(0,0,0)'
        })])
    )),

    transition('down => up', animate(1000, keyframes([
        style({
            transform: 'translate3d(0,-1000%,0)'
        })])
    )),

    transition('bottom => down', animate(1000, keyframes([
        style({
            transform: 'translate3d(0,0,0)'
        })])
    )),

    transition('down => bottom', animate(1000, keyframes([
        style({
            transform: 'translate3d(0,1000%,0)'
        })])
    ))
]);

export const fadeAnimate = trigger('fade', [
    state('true', style({
        opacity: '1',
        display: 'block',
    })),

    state('false', style({
        opacity: '0',
        display: 'none'
    })),


    transition('true => false', animate(100, keyframes([
        style({
            opacity: '0',
            display: 'none'
        })])
    )),
    transition('false => true', animate(100, keyframes([
        style({
            opacity: '1',
            display: 'block'
        })])
    )),
]);
