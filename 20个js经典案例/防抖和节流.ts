/**
 * 防抖函数
 * @param {Function} fn - 需要防抖的函数
 * @param {Number} delay - 延迟时间 (ms)
 * @param {Boolean} immediate - 是否立即执行 (默认 false，即 trailing 模式)
 */
function debounce(fn, delay, immediate = false) {
    let timer = null;

    //返回一个闭包函数
    return function (...args) {
        //设置了立刻执行且没有定时器
        if (immediate && !timer) {
            fn.apply(this, args);
        }

        clearTimeout(timer);

        if (!immediate) {
            timer = setTimeout(() => {
                fn.apply(this, args);
            }, delay)
        } else {
             // 如果是立即执行模式，需要在 delay 后将 timer 置为 null，以便下次能再次立即执行
      timer = setTimeout(() => {
        timer = null;
      }, delay);
        }
    }
}

/**节流函数-时间戳版
 * 逻辑：在单位时间内只触发一次函数，每隔一段时间触发一次
 * 时间戳法的意思就是比对上次触发的时间和当前的时间是否大于间隔的时间，大于才能触发
 * 滚动加载，鼠标移动
 * @param {Function} fn
 * @param {Number} delay
 */

function throttle(fn, delay) {
   let lastTime = 0;//上次的时间

   return function (...args) {
    const now = Date.now();
    
    if (now - lastTime >= delay) {
        fn.apply(this, args);
        lastTime = now;
    }
   }
}

/**定时器版 */

function throttleByTimer(fn, delay) {
    let timer = null;

    //如果没定时器就加定时器，并执行函数，执行完后清空定时器。
    return function (...args) {
        if (!timer) {
            timer = setinterval(() => {
                fn.apply(this, args);
                timer = null;
            }, delay)
        }
    }
}

/**时间戳+定时器 
 * 保证第一次立刻执行，保证最后一次也能执行
 * 如果不需要等待就立刻执行
 * 还在等待期且没有定时器，则设置一个定时器来处理最后一次执行
*/
function throttle (fn, delay) {
    let timer = null;
    let lastTime = 0;

    return function (...args) {
        const now = Date.now();
        const remaining = delay - (now - lastTime);

        //时间到了或者系统时间倒流
        if (remaining <= 0 || remaining > delay) {
            if (timer) {
                clearTimeout(timer);
                timer = null;
            }
            lastTime = now;
            fn.apply(this, args);
        } else if (!timer) { //当时间没到且没有定时器
            timer = setTimeout(() => {
                lastTime = Date.now();
                timer = null;
                fn.apply(this, args);
            }, remaining)
        }
    }
}

