<template>
  <div class="app-container">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';

// 适配移动设备高度
const setAppHeight = () => {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
};

onMounted(() => {
  setAppHeight();
  window.addEventListener('resize', setAppHeight);
});

onUnmounted(() => {
  window.removeEventListener('resize', setAppHeight);
});
</script>

<style lang="scss">
.app-container {
  position: relative;
  width: 100%;
  height: 100vh;
  height: calc(var(--vh, 1vh) * 100);
  overflow: auto;
  background-color: var(--bg-color);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style> 