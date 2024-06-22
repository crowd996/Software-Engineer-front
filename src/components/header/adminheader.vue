<template>
    <el-container class="header-bar">
      <el-image :src="hotel_icon" class="header-image" fit="contain"></el-image>
      <h1 class="header-title">当前用户：{{ role }}</h1>
      <el-button class="header-button temperature-range-button" @click="dialogVisible = true">
        <font-awesome-icon :icon="['fas', 'gear']" class="gear-icon"/>
        Temperature Range
        <span class="underline"></span>
      </el-button>
      <el-button class="header-button" @click="onLogout">Logout
        <span class="underline"></span>
      </el-button>
    </el-container>
    <el-dialog
    v-model="dialogVisible"
    title="Set Temperature Range"
    width="40%"
    :show-close="false">
    <template #header>
      <span class="title-text">Set Temperature Range</span>
      <font-awesome-icon :icon="['fas', 'xmark']" class="close-button" @click="dialogVisible = false"/>
    </template>
    <div style="max-height: 400px; overflow-y: auto; font-size: 20px; font-weight: 700;">
      Current: {{ clowerBound }} °C - {{ cupperBound }} °C
    </div>
    <el-form :model="tempRange" label-width="120px" style="margin-top: 20px;">
      <el-form-item label="Lower Bound">
        <el-input v-model="lowerBound" type="number" placeholder="Enter lower bound"></el-input>
      </el-form-item>
      <el-form-item label="Upper Bound">
        <el-input v-model="upperBound" type="number" placeholder="Enter upper bound"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button class="submit-botton" @click="setTemperatureRange">Set Temperature Range</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
    
  </template>
  
  <script>
  import { computed } from 'vue';
  import { useStore } from 'vuex';
  import api from '@/api'
  import hotel_icon from "@/assets/photos/hotel-icon.png";

  export default {
    name: 'AdminHeader',
    setup(){
        const store = useStore();
        const role = computed(() => store.state.user);

        return {
            hotel_icon,
            role
        };
    },
    data() {
      return {
        dialogVisible: false,
        clowerBound:0,
        cupperBound:0,
        lowerBound:null,
        upperBound:null
      }
    },
    created() {
      api.getTemperatureBound().then(res => {
        console.log(res)
        if(res.status === 200){
            console.log("获取调温范围成功")
            res=res.data
            this.clowerBound = res.data.lowerBound
            this.cupperBound = res.data.upperBound
        }
        else{
            alert("获取调温范围失败！");
        }
      }).catch(error => {
        alert("获取调温范围失败！");
        console.error('请求失败:', error);
      });
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
        this.$store.commit('logout');
        this.$router.push('/login');
      },
      setTemperatureRange() {
        this.lowerBound = parseFloat(parseFloat(this.lowerBound).toFixed(1));
        this.upperBound = parseFloat(parseFloat(this.upperBound).toFixed(1));
        console.log(typeof this.lowerBound)
        if (this.lowerBound !== null && this.upperBound !== null && this.upperBound>this.lowerBound) {
          api.postChangeTemperatureBound(this.lowerBound,this.upperBound).then(res => {
            console.log(res)
            if(res.status === 200){
              console.log("Set Tenperature Range Success")
              this.clowerBound = this.lowerBound;
              this.cupperBound = this.upperBound;
              this.lowerBound = null;
              this.upperBound = null;
            }
            else{
              alert("Set Tenperature Range Failed");
            }
          }).catch(error => {
            alert("Set Tenperature Range Failed");
            console.error('请求失败:', error);
          });
          this.dialogVisible = false;
        } else {
          alert('Please enter valid temperature ranges.');
        }
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
  .temperature-range-button:hover .gear-icon {
   animation: rotate 1s linear infinite;
  }

  @keyframes rotate {
   0% {
     transform: rotate(0deg);
   }
   100% {
     transform: rotate(360deg);
   }
  }

  .close-button {
    font-size: 20px;
    transition: transform 0.3s ease; /* 添加过渡效果 */
    float: right;
  }

  .close-button:hover {
    transform: rotate(90deg); /* 悬浮时旋转90度 */
  }

  .title-text {
    font-size: 20px;
    font-weight: 500;
    color: black;
  }

  .submit-botton{
    width: 100%;
    margin-top: 0px;
    background-color: black;
    color: white;
    border: none;
    text-align: center;
    font-size: 17px;
    font-weight: 600;
    font-family: 'Arial', sans-serif;
  }
  </style>