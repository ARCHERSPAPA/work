export default class {
    public stack: Array<any>;

    constructor() {
        this.stack = [];
    }

    getLength() {
        return this.stack.length;
    }

    peek() {
        const len = this.getLength();
        return len ? this.stack[len - 1] : false;
    }

    pop() {
        return this.stack.pop();
    }

    push(num: any) {
        this.stack.push(num);
        return false;
    }

    reset() {
        this.stack = [];
    }



}
