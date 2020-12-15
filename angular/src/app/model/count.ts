/**
 * @name 主要场景实现数学计算化
 */

export function plus(...arg){
    let args = Array.prototype.slice.call(arguments);
    let count = (...args) =>{
        let elect = (...args) =>{
            args.push(...args);
            return elect;
        }
        elect.toString = () =>{
            return args.reduce((a,b) =>{
                return (Math.pow(10,2)*Number(a?a:0)+Math.pow(10,2)*Number(b?b:0))/Math.pow(10,2);
            })
        }
        return elect;
    }
    return count(...args);
}