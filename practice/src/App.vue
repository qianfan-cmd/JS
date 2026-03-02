<template>
  <div class="container">
    <h1>流式输出测试</h1>

    <el-input v-model="input" style="width: 300px;" placeholder="流式输出测试" type="textarea" :rows="3" />

    <el-button type="primary" @click="textStream" :loading="loading">开始测试</el-button>

    <div class="output">
      <h3>输出内容：</h3>
      <div class="content">{{ output }}</div>
    </div>

    <!-- JSON.stringify()的三个参数 
     语法：JSON.stringify(value[, replacer [, space]])
     
     -->
    <div class="debug">
      <h3>调试信息：</h3>
      <pre>{{ JSON.stringify(debug, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const input = ref('这是一段文本，他待会会以流式输出的方式显示在页面上');
const loading = ref(false);
const output = ref('');
const debug = ref<any>({});


/**
 * 函数实现拆解
 * 0.前置条件，判断是否在加载中、判断是否有内容 loading ==== true
 * 1.界面上显示文字-》更新output.value
 * 2.文字一个一个出现=>需要延迟发送
 * 3.有多个字符=》循环延迟
 * 4.字符来源=》从input.value中获取（真实场景是后端服务器返回的内容）
 */
const textStream = async () => {
  // output.value = input.value; 直接赋值，非流式输出
  loading.value = true;
  output.value = '';

  //记录开始时间
  const startTime = Date.now();
  debug.value = {
    startTime: new Date().toISOString(),//返回一个ISO格式的字符串，YYYY-MM-DDTHH:mm:ss.sssZ  2011-10-05T14:48:00.000Z
    endTime: 0,
    totalChars: 0,
    processedChars: 0
  }

  try {
    debug.value.totalChars = input.value.length;
    for (let c of input.value) {
      output.value += c;
      debug.value.processedChars = output.value.length;
      await new Promise(resolve => setTimeout(resolve, 100));//直接用setTimeout无法在循环中暂停
    }
    const endTime = Date.now();
    debug.value.endTime = new Date().toISOString();
    debug.value.duration = `${endTime - startTime}ms`

    console.log('输出完成');
  } catch(error) {
     console.error("错误",error);
     debug.value.error = String(error);
  } finally {
    loading.value = false;
  }
}

</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 20px;
}

.content {
  width: 300px;
  height: 200px;
  background-color: #000;
  color: #fff;
  padding: 10px;
  overflow-y: auto;
  word-wrap: break-word;
  word-break: break-all;
}

.debug {
  width: 300px;
  height: 200px;
  background-color: #000;
  color: #fff;
}
</style>