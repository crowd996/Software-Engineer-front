<template>
    <el-container class="header-bar">
      <el-image :src="hotel_icon" class="header-image" fit="contain"></el-image>
      <h1 class="header-title">当前用户：{{ role }}</h1>
      <el-button class="header-button" @click="onLogout">Logout
        <span class="underline"></span>
      </el-button>
    </el-container>
    
  </template>
  
  <script>
  import { computed } from 'vue';
  import { useStore } from 'vuex';
  import api from '@/api'
  import hotel_icon from "@/assets/photos/hotel-icon.png";

  export default {
    name: 'UserHeader',
    setup(){
        const store = useStore();
        const role = computed(() => store.state.user);

        return {
            hotel_icon,
            role
        };
    },
    methods:{
      onLogout(){
        api.postLogout().then(res => {
          console.log(res);
          if (res.status == 200) {
            console.log('logout success');
            store.commit('logout');
            this.$router.push({path: '/login'});
          }
        })
      }
    }
  }
  </script>
  
  <style scoped>
  .header-bar {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 15%;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0));
    display: flex;
    align-items: center;
    padding: 10px;
    box-sizing: border-box;
    z-index: 1000;
  }
  
  .header-image {
    width: 12%;
    height: 90%;
    margin-right: 20px;
  }
  
  .header-title {
    color: white;
    font-size: 25px;
    font-weight: 600;
    margin: 0;
    flex-grow: 1;
  }
  
  .header-button {
    position: relative;
    background-color: rgba(0, 0, 0, 0);
    border: none;
    padding: 10px 20px;
    cursor: pointer;
    font-size: 20px;
    font-weight: 600;
    color: white;
    font-family: 'Arial', sans-serif;
  }
  .header-button .underline {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: white;
  transform: scaleX(0);
  transform-origin: bottom left;
  transition: transform 0.3s ease;
  }
  .header-button:hover .underline{
    transform: scaleX(1);
  }
  </style>