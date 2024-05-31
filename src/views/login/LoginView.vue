<template>
  <div class="login-page">
    <div id="loginbackground">
      <LoginHeader @clickLogin="showLogin"/>
      <transition name="fade">
        <LoginCard v-if="showLoginCard" class="login-card" @clickClose="hidLogin"/>
      </transition>
      <div id="hotelinfo">
        <HotelInfo :imageSrc="image1" text="经济但不失舒适<br>品质旅途从此开始"/>
        <HotelInfo :imageSrc="image2" text="实惠但不失享受<br>优质体验触手可及"/>
        <HotelInfo :imageSrc="image3" text="节俭但不失格调<br>您的明智之选"/>
        <HotelInfo :imageSrc="image4" text="简约但不失精致<br>理想住宿新标准"/>
        <ContectCard />
      </div>
    </div>
  </div>
</template>

<script>
  import LoginCard from "@/components/LoginCard/logincard.vue"
  import LoginHeader from "@/components/header/loginheader.vue"
  import HotelInfo from "@/components/hotelInfo/hotelinfo.vue"
  import ContectCard from "@/components/hotelInfo/contectcard.vue"
  import image1 from "@/assets/photos/hotelimage1.png"
  import image2 from "@/assets/photos/hotelimage2.png"
  import image3 from "@/assets/photos/hotelimage3.png"
  import image4 from "@/assets/photos/hotelimage4.png"
  export default {
    name: 'LoginView',
    components: {
      LoginCard,
      LoginHeader,
      HotelInfo,
      ContectCard
    },
    data() {
      return {
        showLoginCard: false,
        image1,
        image2,
        image3,
        image4
      }
    },
    methods:{
      showLogin(){
      console.log('click login receive');
      this.showLoginCard = true;
      },
      hidLogin(){
        this.showLoginCard = false;
      }
    }
  }
</script>

<style scoped>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family: 'Arial', sans-serif;
  overflow: auto;
}

.login-page {
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* 这是一个全屏的容器，用于放置背景和 LoginCard */
#loginbackground {
  display: flex;
  align-items: center;     /* 垂直居中 */
  width: 100vw;  /* 视窗的宽度 */
  height: 100%; /* 视窗的高度 */
  position: relative; /* 为了确保::before 伪元素正确定位 */
  opacity: 0.9;
  background-color: #D1D1B9;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#hotelinfo {
  display: flex;
  width: 100%;
  height: 100%;
  margin-top: 15%;
  flex-direction: column;
}

.login-card {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 300px;
  text-align: center;
  z-index: 100;
}

/* 定义淡入动画 */
.fade-enter-active, .fade-leave-active {
  transition: opacity 1s ease-in-out;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
