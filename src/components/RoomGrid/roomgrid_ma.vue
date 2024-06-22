<template>
  <el-card @click="OfferDetail" @mouseover="handleMouseOver" @mouseout="handleMouseOut"
    class="card"
    :class="{hovered: isHovered}" 
    style="width: 200px; height: 150px; display: flex; flex-direction: column; justify-content: center; align-items: center; position: relative; clip-path: polygon(50% 0%, 100% 50px, 100% 100%, 0% 100%, 0% 50px);">
    
    <div class="text-rm" style="font-size: 24px; font-weight: bold; text-align: center;">
      {{ room_name }}
    </div>
    <div :class="state === 'empty' ? 'dot-gray' : 'dot-green'" 
      style="position: absolute; bottom: 10px; right: 10px; width: 20px; height: 20px; border-radius: 50%;">
    </div>
  </el-card>

  <el-dialog
    v-model="emptyDialogVisible"
    title="Room Detail"
    width="40%"
    :show-close="false">
    <template #header>
      <span class="title-text">Room Detail</span>
      <font-awesome-icon :icon="['fas', 'xmark']" class="close-button" @click="emptyDialogVisible = false"/>
    </template>
    <div style="max-height: 400px; overflow-y: auto; font-size: 20px; font-weight: 700;">
      The Room Is Empty
    </div>
  </el-dialog>

  <el-dialog
    v-model="occupiedDialogVisible"
    title="Room Detail"
    width="60%"
    :show-close="false">
    <template #header>
      <span class="title-text">Room Detail</span>
      <font-awesome-icon :icon="['fas', 'xmark']" class="close-button" @click="occupiedDialogVisible = false"/>
    </template>
    <el-row class="table-text" style="text-align: left; font-size: 18px; margin: 5px;">Use Count: {{ useCount }}</el-row>
    <el-row class="table-text" style="text-align: left; font-size: 18px; margin: 5px;">Totle Fee: {{ totalFee }}</el-row>
    <el-row class="table-text" style="text-align: left;margin: 5px;">Request List:</el-row>
    <el-row style="margin: 5px; border: 1px solid #ccc;">
        <el-col :span="3" class="col-text">Record Id</el-col>
        <el-col :span="4" class="col-text">Request Time</el-col>
        <el-col :span="4" class="col-text">Start Time</el-col>
        <el-col :span="4" class="col-text">End Time</el-col>
        <el-col :span="3" class="col-text">Wind Speed</el-col>
        <el-col :span="3" class="col-text">Fee(￥)</el-col>
        <el-col :span="3" class="col-text">Rate(￥/s)</el-col>
      </el-row>
    <div  
      v-for="(request, index) in this.requestList"  
      :key="index"  class="detail-wrapper" > 
      <el-row style="margin: 5px; border: 1px solid #ccc;">
        <el-col :span="3" class="col-text">{{request.recordId}}</el-col>
        <el-col :span="4" class="col-text">{{request.requestTime}}</el-col>
        <el-col :span="4" class="col-text">{{request.startTime}}</el-col>
        <el-col :span="4" class="col-text">{{request.endTime}}</el-col>
        <el-col :span="3" class="col-text">{{windSpeedLabel(request.windSpeed)}}</el-col>
        <el-col :span="3" class="col-text">{{request.fee}}</el-col>
        <el-col :span="3" class="col-text">{{request.rate}}</el-col>
      </el-row>
    </div>
  </el-dialog>
</template>
<script>
import api from '@/api';
export default {
  name:"RoomGridMA",
  props: {
    room_id: Number,
    room_name: String,
    state: String
  },
  data() {
    return {
      isHovered: false,
      emptyDialogVisible: false,
      occupiedDialogVisible: false,
      nowRecordId: 0,
      requestList: [
        {
          "id": 14,
          "recordId": 1,
          "roomId": null,
          "requestTime": "2024-05-15 16:06:11",
          "startTime": "2024-05-15 16:06:12",
          "endTime": "2024-05-15 16:06:45",
          "temperature": null,
          "windSpeed": 3,
          "fee": 33.06,
          "rate": 1,
          "status": 4
        }
      ],
      useCount: 6,
      totalFee: 333.57,
      mostCommonTemperature: null,
      mostCommonWindSpeed: 3
    }
  },
  methods: {
    windSpeedLabel(windSpeed) {
      switch (windSpeed) {
        case 1:
          return 'Low';
        case 2:
          return 'Mid';
        case 3:
          return 'High';
        default:
          return 'Unknown';
      }
    },
    OfferDetail() {
      if(this.state === 'empty'){
        this.emptyDialogVisible = true;
      }
      else {
        this.occupiedDialogVisible = true;
      }
      console.log("OfferDetail");
      if(this.state === 'occupied'){
        api.postRoomStatisticInfo(this.room_id,this.room_name)
        .then(res => {
          if(res.status === 200){
            const data = res.data.data;
            console.log(data)
            this.requestList = data.requestList;
            console.log(this.requestList)
            this.useCount = data.useCount;
            this.totalFee = data.totalFee;
            this.mostCommonTemperature = data.mostCommonTemperature;
            this.mostCommonWindSpeed = data.mostCommonWindSpeed;
          }
          else {
            console.log("post Room Statistic Info Failed");
          }
        }).catch(error =>{
          alert("post Room Statistic Info Failed")
          console.log(error)
        });
      }
    },

    handleMouseOver() {
      this.isHovered = true;
      console.log("handleMouseOver");
    },
    handleMouseOut() {
      this.isHovered = false;
      console.log("handleMouseOut");
    }
  }
}

</script>

<style scoped>

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

.table-text,.col-text{
  font-size: 15px;
  font-weight: 500;
  color: rgb(36, 28, 28);
  text-align: center;
}

.col-text {
  border-left: 1px solid #ccc;
}

.col-text:first-child {
  border-left: none;
}


.el-card {
  transition: border 0.3s;
}


.el-card.hovered {
  border: 1px solid rgb(29, 168, 215);
  cursor: pointer;
}

.card {
  background-color: rgb(238, 231, 231);
  transition: transform 0.3s, box-shadow 0.3s;
}

.card.hovered {
  transform: scale(1.1);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.dot-green {
  background-color: #00ff00;
}
.dot-gray {
  background-color: gray;
}

:deep(.el-form-item__label){
  font-size: 15px;
  color: black;
  font-weight: 600;
  font-family: 'Arial', sans-serif;
}

:deep(.custom-input .el-input__wrapper) {
  border: none;
  border-bottom: 2px solid gray;
  border-radius: 0;
  box-shadow: none;
  background-color: transparent;
}

:deep(.custom-input .el-input__wrapper:hover) {
  border-bottom: 2px solid black;
}

</style>





