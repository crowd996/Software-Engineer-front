<template>
  <el-card shadow="always" style="width: 800px;">
    <el-row>
      <el-botton class="close-button" @click="onClose">
        <font-awesome-icon :icon="['fas', 'xmark']" />
      </el-botton>
    </el-row>
    <el-row>
      <el-col :span="12">
        <div style="margin-top: 10px"></div>
        <div>
          <el-image :src="hotel_icon" style="width: 220px;" fit="contain"></el-image>
        </div>
      </el-col>
      <el-col :span="12">
        <div style="margin-top: 25px; justify-content: center;"></div>
        <LoginForm />
      </el-col>
    </el-row>
  </el-card>
  
</template>

<script>
import LoginForm from "./loginform.vue";
import hotel_icon from "@/assets/photos/hotel-icon.png";

export default{
  name:"LoginCard",
  components:{
    LoginForm
  },
  data(){
    return{
      hotel_icon
    }
  },
  methods:{
    onClose(){
      this.$emit('clickClose')
    }
  }
}


</script>

<style scoped>
.close-button {
  font-size: 30px;
  transition: transform 0.3s ease; /* 添加过渡效果 */
}

.close-button:hover {
  transform: rotate(90deg); /* 悬浮时旋转90度 */
}

</style>