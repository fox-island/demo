<template>
  <div class="wrapper"
  :style="{ transform: `translateY(-${current * 100}vh)` }"
  >
  <div class="section-1">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 13 13" class="sword">
	<path d="M 4 8 L 10 1 L 13 0 L 12 3 L 5 9 C 6 10 6 11 7 10 C 7 11 8 12 7 12 A 1.42 1.42 0 0 1 6 13 A 5 5 0 0 0 4 10 Q 3.5 9.9 3.5 10.5 T 2 11.8 T 1.2 11 T 2.5 9.5 T 3 9 A 5 5 90 0 0 0 7 A 1.42 1.42 0 0 1 1 6 C 1 5 2 6 3 6 C 2 7 3 7 4 8 M 10 1 L 10 3 L 12 3 L 10.2 2.8 L 10 1" fill="rgba(255,255,255,0.9)"/>
</svg>
 <span class="word">
 based on slay the spire
 <span style="display: block; margin-top: 30px; font-size: 40px; color: goldenrod;">
    依旧...深陷狂怒吗？...很好
  </span>
 </span>
 </div>
 <div class="section-2">
  <img src="/pd-image.png" alt="杀戮尖塔" class="my-img">
  <img src="/pd-image (1).png" alt="杀戮尖塔" class="my-img">
  <img src="/pd-image (2).png" alt="杀戮尖塔" class="my-img">
  <img src="/pd-image (3).png" alt="杀戮尖塔" class="my-img">
  <img src="/01.webp" alt="杀戮尖塔" class="my-img2">
  <img src="/02.webp" alt="杀戮尖塔" class="my-img2">
 </div>
 </div>
</template>

<script setup>
import {onMounted, onUnmounted, ref} from 'vue'

const current=ref(0);
const total=2;
let locked=false;
function goTo(index){
  if(locked)return;
  else if(index<0||index>=total)return;
  else{
    locked=true;
    current.value=index;
    setTimeout(()=>{locked=false},850)
  }
}
function onWheel(e){
  e.preventDefault();
  if(e.deltaY>0)goTo(current.value+1);
  else goTo(current.value-1);
}
onMounted(()=>{
  window.addEventListener('wheel',onWheel,{passive:false});
})
onUnmounted(()=>{
  window.removeEventListener('wheel',onWheel);
})
</script>

<style scoped>
.img{
  position:absolute;
  right:50vw;
  width:50vw;
}
.wrapper {
  color:aliceblue;
  width:100vw;
  height: 200vh; 
  transition: transform 0.8s cubic-bezier(0.65, 0, 0.35, 1);
}
.sword {
  width: 850px;
  position: absolute; 
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%) translateY(50px) translateX(-200px); /* ✅ 用 left/top 配合 translate 居中 */
}
.word {
  position: absolute;
  right: 5%;
  top: 65%;
  font-weight: bold; 
  font-size: 50px;
  color: gold;
}
/* 给第一页也加上这些 */
.section-1 {
  height: 100vh;
  width: 100%;        /* ← 改这里！去掉 vw，用 % */
  position: relative;
  overflow: hidden;   
   padding-top: 54px; 
}
.section2{
  height:100vh;
  width:100%;
  
  background-color:black;
  display:flex;
  flex-wrap: wrap;          
  padding: 60px;    
}
.my-img{
  width:25vw;
  height:50vh;
}
.my-img2{
  width:50vw;
  height:50vh;
}
</style>