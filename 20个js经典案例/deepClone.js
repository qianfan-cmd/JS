//在js中，对象，数组，函数都是引用类型，当我们对一个对象进行赋值操作时，
// 实际上是将对象的引用赋值给了新的变量，因此，修改新变量会影响原对象。
//而基本类型，如字符串，数字，布尔值等，则是值类型，当
// 我们对一个基本类型的值进行赋值操作时，进行的只是单纯的赋值操作，
//不会影响原变量的值，所以深拷贝顾名思义就是针对引用类型的值
//重新创建一份新的副本，然后把里面对应的基本类型创建赋值给新的副本

function deepClone(obj) {
    // 判断obj是不是一个对象
    if (obj === null || typeof obj !== 'object') {
        return obj; //基本类型直接返回
    }

    //处理数组和对象
    let clone = Array.isArray(obj) ? [] : {};

    //遍历属性并递归复制
    for (let key in obj) {
        //判断属性是否为原生属性
        if (obj.hasOwnProperty(key)) {
            clone[key] = deepClone(obj[key]);//递归调用
        }
    }

    return clone;
}

//进阶版，加个WeakMap来记录拷贝过的对象，避免死循环
//hash是以key:value形式存储，key是原对象，value是新对象
//{ name: "John", self: obj }  { name: "John", self: ? }
//遇到clone过的对象，直接返回新对象，避免死循环
function deepClone(obj, hash = new WeakMap()) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (hash.has(obj)) return hash.get(obj); // 防止循环引用

  const clone = Array.isArray(obj) ? [] : {};
  hash.set(obj, clone); // 记录该对象

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      clone[key] = deepClone(obj[key], hash);
    }
  }

  return clone;
}
