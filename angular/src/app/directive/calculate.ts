import Stack  from './stack';
export  class Calculate {
    public operand: Stack;
    public operator: Stack;

    public tempNum: string;
    public tempSymbol: string;

    constructor() {
        this.operand = new Stack();
        this.operator = new Stack();
        this.tempNum = '';
        this.tempSymbol = '';
    }

    /**
     * 单独乘除计算
     * @param symbol
     */
    computedMultiOrDivs(symbol) {
        const oc1 = this.operand.pop();
        const oc2 = this.operand.pop();
        // console.log(symbol);
        this.operand.push(Arith.selectOperatorRule(symbol, oc1, oc2));
    }

    /**
     * 优先括号运算
     * @param exp
     * @returns {any}
     */
    matchInBracket(exp) {
        const braReg = /\([\+|\-|\*\/|\.|\d]+\)?/g;
        let brackets = exp.match(braReg);
        if (brackets) {
            brackets.forEach(item => {
                const tempRes = this.computed(item.replace(/[\(|\)]/g, ''));
                exp = exp.replace(item, tempRes);
            });
        }
        brackets = exp.match(braReg);
        return brackets ? this.matchInBracket(exp) : exp;
    }

    /**
     * 实现运算
     * @param exp
     */
    computed(exp) {
        exp = this.matchInBracket(exp);
        for (let i = exp.length - 1; i >= 0; i--) {
        // for(let i = 0; i < exp.length; i++){
            const numReg = /[\.|\d]/;
            let char = exp[i];
            if (numReg.test(char)) {
                //当前数字组合
                this.tempNum = char + this.tempNum;
                if (i === 0) {
                    if (this.tempSymbol) {
                        this.computedMultiOrDivs(this.tempSymbol);
                        this.tempSymbol = '';
                    }
                    if (this.tempNum) {
                        this.operand.push(this.tempNum);
                    }
                    break;
                }
            } else {
                if (i === 0) {
                    if (this.tempSymbol) {
                        this.computedMultiOrDivs(this.tempSymbol);
                        this.tempSymbol = '';
                    }
                    if (this.tempNum) {
                        this.operand.push(this.tempNum);
                    }
                    this.operator.push(char);
                    break;
                }

                if (this.tempSymbol) {
                    this.computedMultiOrDivs(this.tempSymbol);
                    this.tempSymbol = '';
                }
                const peekSymbol = this.operator.peek();
                const nextChar = exp[i - 1];
                const symbolReg = /[\+|\-|\*|\/]/;

                if (peekSymbol) {
                    if (this.tempNum) {
                        if (symbolReg.test(nextChar) && '-' === char) {
                            this.operand.push(char + this.tempNum);
                            char = '';
                        } else {
                            this.operand.push(this.tempNum);
                        }
                        this.tempNum = '';
                    }
                    //优先级算法
                    switch (Arith.priority(peekSymbol, char)) {
                        case 2:
                            this.tempSymbol = this.operator.pop();
                            break;
                        case 1:
                            this.computedMultiOrDivs(this.operator.pop());
                            break;
                        default:
                            break;
                    }
                } else if (!peekSymbol && this.tempNum) {
                    if (symbolReg.test(nextChar) && '-' === char) {
                        this.operand.push(char + this.tempNum);
                        char = '';
                    } else {
                        this.operand.push(this.tempNum);
                    }
                    this.tempNum = '';
                }

                if (char) {
                    this.operator.push(char);
                }
            }
        }
        return this.computedReverse();
    }

    /**
     * 实现逆推导
     */
    computedReverse() {
        let result = 0;
        while (0 < this.operand.getLength()) {
            if (this.operator.getLength() === this.operand.getLength()) {
                const oc1 = result;
                const oc2 = this.operand.pop();
                const symbol = this.operator.pop();
                result = ('+' === symbol) ? Arith.addition(oc1, oc2) : Arith.subtraction(oc1, oc2);
            } else {
                if (this.operand.getLength() === 1) {
                    result = Number(this.operand.pop());
                    break;
                }
                const oc1 = this.operand.pop();
                const oc2 =  this.operand.pop();
                const symbol = this.operator.pop();
                result = Arith.selectOperatorRule(symbol, oc1, oc2);
            }
            this.operand.push(result);
        }

        this.operand.reset();
        this.operator.reset();
        this.tempNum = '';
        this.tempSymbol = '';

        return Arith.substring(result);
    }
}

class Arith {
    /**
     * 精度置换
     * @param num
     * @param pow
     * @returns {number}
     */
    static conver(num, pow) {
        return Number(num) * Math.pow(10, pow);
    }

    /**
     * 加法
     * @param nums
     * @returns {number}
     */
    static addition(...nums) {
        const n1 = String(nums[0]).split('.'),
            n2 = String(nums[1]).split('.');
        const p1 = n1 && n1.length > 1 ? n1[1].length : 0;
        const p2 = n2 && n2.length > 1 ? n2[1].length : 0;
        const p = p1 > p2 ? p1 : p2;
        const a1 = this.conver(nums[0], p);
        const a2 = this.conver(nums[1], p);

        return (a1 + a2) / Math.pow(10, p);
    }

    /**
     * 减法
     * @param nums
     * @returns {number}
     */
    static subtraction(...nums) {
        const n1 = String(nums[0]).split('.'),
            n2 = String(nums[1]).split('.');
        const p1 = n1 && n1.length > 1 ? n1[1].length : 0;
        const p2 = n2 && n2.length > 1 ? n2[1].length : 0;
        const p = p1 > p2 ? p1 : p2;
        const a1 = this.conver(nums[0], p);
        const a2 = this.conver(nums[1], p);
        return (a1 - a2) / Math.pow(10, p);
    }

    /**
     * 乘法
     * @param nums
     * @returns {number}
     */
    static multiplication(...nums) {
        const n1 = String(nums[0]).split('.'),
            n2 = String(nums[1]).split('.');
        const p1 = n1 && n1.length > 1 ? n1[1].length : 0;
        const p2 = n2 && n2.length > 1 ? n2[1].length : 0;
        const a1 = this.conver(nums[0], p1);
        const a2 = this.conver(nums[1], p2);
        return (a1 * a2) / Math.pow(10, p1 + p2);
    }

    /**
     * 除法
     * @param nums
     * @returns {number}
     */
    static division(...nums) {
        const n1 = String(nums[0]).split('.'),
            n2 = String(nums[1]).split('.');
        const p1 = n1 && n1.length > 1 ? n1[1].length : 0;
        const p2 = n2 && n2.length > 1 ? n2[1].length : 0;
        const p = p1 > p2 ? p1 : p2;

        const a1 = this.conver(nums[0], p);
        const a2 = this.conver(nums[1], p);

        // let a1 = this.conver(nums[0],2);
        // let a2 = this.conver(nums[1],2);
        return (a1 / a2);
    }

    /**
     * 比较运算符优先级
     * @param ocA
     * @param ocB
     * @returns {number}
     */
    static priority(ocA, ocB) {
        const ocReg = /[\*|\/]/;
        if (ocReg.test(ocA) && !ocReg.test(ocB)) {
            return 2;
        } else if (ocReg.test(ocA) && ocReg.test(ocB)) {
            return 1;
        } else {
            return 0;
        }
    }

    /**
     * 根据运算符计算数据
     * @param symbol
     * @param nums
     * @returns {any}
     */
    static selectOperatorRule(symbol, ...nums) {
        // console.log(symbol);
        switch (symbol) {
            case '+':
                return this.addition(...nums);
            case '*':
                return this.multiplication(...nums);
            case '/':
                return this.division(...nums);
            default:
                return this.subtraction(...nums);
        }
    }

    static substring(num) {
        if (num) {
            return Number(num.toString().match(/^(-)?\d+(\.\d{1,2})?/)[0]);
        }
        return '';
    }
}

