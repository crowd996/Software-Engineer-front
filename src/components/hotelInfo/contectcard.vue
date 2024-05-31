<template>
    <div class="container" ref="container">
      <p class="text">Contact Us: Team 310-C</p>
    </div>
  </template>
  
  <script>
    import { ref, onMounted, onUnmounted } from 'vue';
  
    export default {
      name: 'ContectCard',
      setup() {
        const container = ref(null);
  
        onMounted(() => {
          const observerOptions = {
            threshold: 0.1, // 触发阈值，当元素进入视口 10% 时触发
          };
  
          const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add('animate-bottom-in');
              }
            });
          }, observerOptions);
  
          observer.observe(container.value);
  
          // 清除观察者
          onUnmounted(() => {
            if (container.value) {
              observer.unobserve(container.value);
            }
          });
        });
  
        return {
          container,
        };
      },
    };
  </script>
  
  <style scoped>
  .container {
    opacity: 0;
    transform: translateY(50px); /* 初始状态：从底部移入 */
    transition: all 1s ease; /* 动画效果 */
  }
  
  .animate-bottom-in {
    opacity: 1;
    transform: translateY(0); /* 触发动画：元素进入视口 */
  }
  
  .text {
    font-size: 30px;
    font-weight: 600;
    color: white;
    text-align: center;
    font-family: 'Arial', sans-serif;
  }
  </style>
  