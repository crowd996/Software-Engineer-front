<template>
    <el-card @click="OfferDetail" @mouseover="handleMouseOver" @mouseout="handleMouseOut"
    :class="{hovered: isHovered, 'red-bg': state === 'error', 'green-bg': state === 'work', 'gray-bg': state === 'stop'}" 
    style="width: 200px; height: 150px;">
      <div class="text item" style="padding: 5px;">Room ID: {{ room_id }}</div>
      <div class="text item" style="padding: 5px;">temperature: {{ temperature }}</div>
      <div class="text item" style="padding: 5px;">wind speed: {{ windSpeedText }}</div>
      <div class="text item" style="padding: 5px;">state: {{ state }}</div>
    </el-card>


  <el-dialog
    v-model="dialogVisible"
    title="详情"
    width="55%"
  >
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="checkout">
          报修
        </el-button>
        <el-button @click="dialogVisible = false">关闭</el-button>
      </span>
    </template>
  </el-dialog>  
</template>
  
  <script>
  export default {
    name:'RoomGridAC',
    props: {
      room_id: Number,
      temperature: Number,
      wind_speed: Number,
      state: String,
    },
    data() {
      return {
        isHovered: false,
        dialogVisible: false,
      }
    },
    computed: {
        windSpeedText() {
            switch (this.wind_speed) {
                case 3:
                    return 'high';
                case 2:
                    return 'mid';
                case 1:
                    return 'low';
                default:
                    return 'unknown';
            }
        }
    },
    methods: {
      OfferDetail() {
        console.log("OfferDetail");
        this.dialogVisible = true;
      },
      handleMouseOver() {
        this.isHovered = true;
        console.log("handleMouseOver");
      },
      handleMouseOut() {
        this.isHovered = false;
        console.log("handleMouseOut");
      },
    }
  }
  
  </script>
  
  <style scoped>
  /* 基本样式 */
  .el-card {
    transition: border 0.3s; /* 平滑的过渡效果 */
  }
  
  /* 悬停效果 */
  .el-card.hovered {
    border: 1px solid rgb(29, 168, 215);
    cursor: pointer;
  }
  .el-card.green-bg {  
  background-color: #C8E6C9;   
} 
  .el-card.red-bg {  
    background-color: #FFC0CB;   
  }

  .el-card.gray-bg {  
    background-color: gray;   
  } 
  /* 可以根据需要添加其他样式 */
  </style>