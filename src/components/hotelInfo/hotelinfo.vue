<template>
    <div class="container">
      <div ref="leftBlock" class="left-block">
        <el-image :src=imageSrc style="width: 70%;"></el-image>
      </div>
      <div ref="rightBlock" class="right-block">
        <p v-html="text" class="info-text"></p>
      </div>
    </div>
</template>
  
<script>
  import { ref, onMounted } from 'vue';
  
  export default {
    name: 'HotelInfo',
    components: {
    },
    props: {
    imageSrc:{
        type: String,
        required: true
    },
    text: {
      type: String,
      required: true
    }
  },
    setup(props) {
      const leftBlock = ref(null);
      const rightBlock = ref(null);
  
      onMounted(() => {
        const observerOptions = {
          threshold: 0.5 // 触发阈值，元素进入视口 50% 时触发
        };
  
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              if (entry.target === leftBlock.value) {
                entry.target.classList.add('animate-left');
              } else if (entry.target === rightBlock.value) {
                entry.target.classList.add('animate-right');
              }
            }
          });
        }, observerOptions);
  
        observer.observe(leftBlock.value);
        observer.observe(rightBlock.value);
      });
  
      return {
        leftBlock,
        rightBlock,
        imageSrc: props.imageSrc,
        text: props.text // 从 props 获取 text
      };
    }
  };
</script>
  
<style scoped>
  .container {
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 100%;
    height: 80vh;
    overflow: hidden;
  }
  
  .left-block, .right-block {
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: all 1s ease; /* 动画效果 */
  }
  
  .left-block {
    width: 60%;
    transform: translateX(-40%); /* 初始状态：左侧块移出视口 */
    align-self: flex-start; /* 顶部对齐 */
    margin-top: 0; /* 控制图片的顶部对齐 */
  }
  
  .right-block {
    width: 40%;
    transform: translateX(40%); /* 初始状态：右侧块移出视口 */
    align-self: flex-start; /* 顶部对齐 */
    margin-top: 30vh; /* 控制图片的顶部对齐 */
  }
  
  .left-block.animate-left {
    transform: translateX(0); /* 触发动画：左侧块进入视口 */
    opacity: 1;
  }
  
  .right-block.animate-right {
    transform: translateX(0); /* 触发动画：右侧块进入视口 */
    opacity: 1;
  }

  .info-text {
    font-size: 40px;
    font-weight: 900;
    color: white;
    position: absolute; /* 绝对定位 */
  }
</style>
  