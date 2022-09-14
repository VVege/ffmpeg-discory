<template>
  <input type="file"
       id="video" name="avatar"
       accept="video/webm">
       <button v-on:click="buttonEvent"> 开始转换 </button>
</template>

<script setup lang="ts">
  import { ref } from 'vue' 
import { MediaTool } from '../MediaTool/MediaTool';
  
  const buttonEvent = async () => {
    // let inputDom = document.getElementById('file') as HTMLInputElement;
    // let files = inputDom.files;
    // if (!inputDom || !files) {
    //   return;
    // }
    // let file = files[0];
    let mediaTool = new MediaTool();
    await mediaTool.load();
    // const blob = await mediaTool.convert('webm', 'mp4', 'https://resources.laihua.com/2022-9-8/6b2d7eb0-2f56-11ed-acd1-2f6293e25486.mp3');

    const blob = await mediaTool.addOverlay('https://resources.laihua.com/2022-8-24/1f130c26-e030-4e54-a7a5-49a5ba0d2abb.mp4', 'https://v.moele.me/v/1431/9421057_a-01.webm');
    saveAs(blob);
  }

  const saveAs = (blob: Blob) => {
    // 创建隐藏的可下载链接
    const eleLink = document.createElement('a');
    eleLink.download = 'name.mp4';
    eleLink.style.display = 'none';
    // 字符内容转变成blob地址
    eleLink.href = URL.createObjectURL(blob);
    // 触发点击
    document.body.appendChild(eleLink);
    eleLink.click();
    // 然后移除
    document.body.removeChild(eleLink);
  }
</script>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
