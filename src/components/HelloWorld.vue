<template>
  <input type="file"
       id="video" name="avatar"
       accept="video/webm">
       <button v-on:click="buttonEvent"> 开始转换 </button>
</template>

<script setup lang="ts">
  import { ref } from 'vue' 
import { MediaTool, MediaToolAudioInsert } from '../MediaTool/MediaTool';
  
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

    const blob = await mediaTool.addOverlay('https://resources.laihua.com/2021-2-6/98383168-06b5-42ab-936d-783f6a679262.mp4', 'https://v.moele.me/v/1431/9421057_a-01.webm', {x: 20, y: 400, width: 500, height: 500});
    /*
    https://resources.laihua.com/2022-9-15/f74d3eb0-34d0-11ed-86ad-21fb8a4b0f0f.mp3
    https://resources.laihua.com/2022-9-15/f769ee70-34d0-11ed-8995-25a0ca1030e7.mp3
    https://resources.laihua.com/2022-9-15/f7432c90-34d0-11ed-8995-25a0ca1030e7.mp3
    https://resources.laihua.com/2022-9-15/f7586240-34d0-11ed-86ad-21fb8a4b0f0f.mp3
    https://resources.laihua.com/2022-9-15/f7552df0-34d0-11ed-8995-25a0ca1030e7.mp3
    https://resources.laihua.com/2022-9-15/f7317950-34d0-11ed-86ad-21fb8a4b0f0f.mp3
    */

    // let audios: MediaToolAudioInsert[] = [
    // {url: 'https://resources.laihua.com/2022-9-15/f74d3eb0-34d0-11ed-86ad-21fb8a4b0f0f.mp3', duration: 1.5},
    // {url: 'https://resources.laihua.com/2022-9-15/f769ee70-34d0-11ed-8995-25a0ca1030e7.mp3', duration: 3.5},
    // {url: 'https://resources.laihua.com/2022-9-15/f7432c90-34d0-11ed-8995-25a0ca1030e7.mp3', duration: 3.5},
    // {url: 'https://resources.laihua.com/2022-9-15/f7552df0-34d0-11ed-8995-25a0ca1030e7.mp3', duration: 4.5},
    // {url: 'https://resources.laihua.com/2022-9-15/f7317950-34d0-11ed-86ad-21fb8a4b0f0f.mp3', duration: 1.5}];

    // const blob = await mediaTool.videoAppendAudio('https://resources.laihua.com/2021-2-6/98383168-06b5-42ab-936d-783f6a679262.mp4', audios);
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
