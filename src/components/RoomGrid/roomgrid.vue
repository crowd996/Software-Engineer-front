<template>
  <el-card @click="OfferDetail" @mouseover="handleMouseOver" @mouseout="handleMouseOut"
  :class="{hovered: isHovered, 'green-bg': state === 'empty', 'gray-bg': state !== 'empty'}" 
  style="width: 200px; height: 150px; align-items: center;">
    <div class="text" style="padding: 5px;">{{ room_name }}</div>
    <div class="text" style="padding: 5px;">{{ state }}</div>
  </el-card>

    <!-- 对话框 -->
  <el-dialog
    v-model="emptyDialogVisible"
    title="Checkin"
    width="65%"
    :show-close="false">
    <template #header>
      <span class="title-text">Checkin</span>
      <font-awesome-icon :icon="['fas', 'xmark']" class="close-button" @click="emptyDialogVisible = false"/>
    </template>
    <div style="max-height: 400px; overflow-y: auto;">
      <el-from>
        <el-form-item label="Username">
          <el-input v-model="name" type="text" class="custom-input"/>
        </el-form-item>
        <el-form-item>
          <el-button @click="onCheckin" class="submit-botton">Checkin</el-button>
        </el-form-item>
      </el-from>
    </div>
  </el-dialog>
  <el-dialog
    v-model="occupiedDialogVisible"
    title="Checkout"
    width="65%"
    :show-close="false">
    <template #header>
      <span class="title-text">Checkout</span>
      <font-awesome-icon :icon="['fas', 'xmark']" class="close-button" @click="occupiedDialogVisible = false"/>
    </template>
    <div style="max-height: 400px; overflow-y: auto;">
      <el-row>
        <el-col :span="12">
          Check In Time: {{ checkInTime }}
        </el-col>
        <el-col :span="8"></el-col>
        <el-col :span="4">
          <el-button @click="onCheckout" class="submit-botton" style="width: 80%;">Checkout</el-button>
        </el-col>
        
      </el-row>
    </div>
  </el-dialog>
  <el-dialog
    v-model="checkInDialogVisible"
    width="65%"
    :show-close="false">
    <template #header>
      <span class="title-text">{{ username !== '' ? 'Checkin Successs' : 'Checkin Failed'}}</span>
      <font-awesome-icon :icon="['fas', 'xmark']" class="close-button" @click="checkInDialogVisible = false"/>
    </template>
    <div v-if="username !== '' ">
      <span class="title-text">Username: {{ username }}</span>
      <span class="title-text">Password: {{ password }}</span>
    </div>
  </el-dialog>

  <el-dialog
    v-model="checkOutDialogVisible"
    width="65%"
    :show-close="false">
    <template #header>
      <span class="title-text">{{ nowRecordId === 0 ? 'Checkout Success' : 'Checkout Failed'}}</span>
      <font-awesome-icon :icon="['fas', 'xmark']" class="close-button" @click="checkOutDialogVisible = false"/>
    </template>
    <el-row class="table-text" style="text-align: left; font-size: 18px;">Totle Fee: {{ bill.fee }}</el-row>
    <el-row class="table-text" style="text-align: left;">Detail:</el-row>
    <el-row>
        <el-col :span="4" class="table-text">id</el-col>
        <el-col :span="4" class="table-text">requestTime</el-col>
        <el-col :span="4" class="table-text">startTime</el-col>
        <el-col :span="4" class="table-text">endTime</el-col>
        <el-col :span="4" class="table-text">windSpeed</el-col>
        <el-col :span="4" class="table-text">fee</el-col>
      </el-row>
    <div  
      v-for="(detail, index) in this.bill.detail"  
      :key="index"  class="detail-wrapper" > 
      <el-row>
        <el-col :span="4" class="table-text">{{detail.id}}</el-col>
        <el-col :span="4" class="table-text">{{detail.requestTime}}</el-col>
        <el-col :span="4" class="table-text">{{detail.startTime}}</el-col>
        <el-col :span="4" class="table-text">{{detail.endTime}}</el-col>
        <el-col :span="4" class="table-text">{{detail.windSpeed}}</el-col>
        <el-col :span="4" class="table-text">{{detail.fee}}</el-col>
      </el-row>
    </div>
    <el-row>
      <el-col :span="16"></el-col>
      <el-col :span="4">
          <el-button @click="getBill" class="submit-botton" style="width: 80%;">getBill</el-button>
        </el-col>
        <el-col :span="4">
          <el-button @click="getDetail" class="submit-botton" style="width: 80%;">getDetail</el-button>
        </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { ElMessageBox } from 'element-plus';
import api from '../../api';
import { getDefaultClassName } from 'element-plus/es/components/table/src/config.mjs';
export default {
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
      checkInDialogVisible: false,
      checkOutDialogVisible: false,
      name: "",
      username: "",
      password: "",
      checkInTime: "2021-2-20",
      nowRecordId: 5,
      bill: {
        billId: 0,
        fee: 0,
        detail: [
        {
          "id": 14,
          "recordId": 1,
          "requestTime": "2024-05-15 16:06:11",
          "startTime": "2024-05-15 16:06:12",
          "endTime": "2024-05-15 16:06:45",
          "temperature": null,
          "windSpeed": 3,
          "fee": 33.06,
          "rate": 1,
          "status": 4
        },
        {
          "id": 15,
          "recordId": 1,
          "requestTime": "2024-05-15 16:08:54",
          "startTime": "2024-05-15 16:08:54",
          "endTime": "2024-05-15 16:09:14",
          "temperature": null,
          "windSpeed": 3,
          "fee": 19.14,
          "rate": 1,
          "status": 4
        }]
      }
    }
  },
  methods: {
    OfferDetail() {
      if(this.state === 'empty'){
        this.emptyDialogVisible = true;
      }
      else {
        this.occupiedDialogVisible = true;
      }
      console.log("OfferDetail");

      api.getQueryRecordInfo(undefined,this.room_id,0)
      .then(res => {
        if(res.status === 200){
          console.log("get Detail Success");
          this.checkInTime = res.data.list[0].startTime;
          this.nowRecordId = res.data.list[0].id;
        }
        else {
          console.log("get Detail Failed");
        }
      });

      // api.getDetail({
      //   room_number: this.room_id,
      // }).then(res => {
      //   console.log(res);
      //     let data_length = res.data.length;
      //     for(let i = 0; i < data_length; i++) {
      //       let record = {
      //         id: res.data[i].record,
      //         room_id: res.data[i].room_id,
      //         req_date_time: res.data[i].query_time,
      //         serve_start_time: res.data[i].start_time,
      //         serve_end_time: res.data[i].end_time,
      //         serve_time: res.data[i].serve_time,
      //         wind: res.data[i].speed,
      //         current_bill: this.Fixed(res.data[i].cost, 1),
      //         rate: res.data[i].rate,
      //       };
      //       this.records.push(record);
      //     }
      // }).catch(err => {
      //   console.log(err);
      // });
    },

    handleMouseOver() {
      this.isHovered = true;
      console.log("handleMouseOver");
    },
    handleMouseOut() {
      this.isHovered = false;
      console.log("handleMouseOut");
    },
    handleConfirm() {
      // 确认按钮的处理逻辑
      console.log('确认操作');
      this.dialogVisible = false; // 关闭对话框
    },
    onCheckin() {
      this.emptyDialogVisible = false;
      this.username = "1";
      this.password = "1";
      this.$emit('chengeState',this.room_id,'occupied');
      this.checkInDialogVisible = true;
      api.postCheckIn(this.room_id,this.name)
      .then(res => {
        console.log(res);
        if (res.code === "success") {
          console.log("checkin success");
          this.username = res.data.username;
          this.password = res.data.password;
          this.chenkInDialogVisible = true;
          this.$emit('chengeState',this.room_id,'occupied');
        }
        else {
          console.log("checkin failed");
        }
      });
    },
    onCheckout() {
      this.occupiedDialogVisible = false;
      this.checkOutDialogVisible = true;
      this.$emit('chengeState',this.room_id,'empty');
      if(this.nowRecordId !== 0){
        api.postCheckOut(this.nowRecordId).then(res => {
        console.log(res);
        if (res.status === 200) {
          console.log("checkout success");
          api.postBillByRecordId(this.nowRecordId).then(res => {
            console.log(res);
            if(res.status === 200){
              console.log("create bill success");
              this.checkInTime = "";
              this.nowRecordId = 0;
              this.bill.billId = res.data.bill.id;
              this.bill.fee = res.data.bill.fee;
              this.bill.detail = res.data.bill.detail;
              this.checkOutDialogVisible = true;
              this.$emit('chengeState',this.room_id,'empty');
            }
            else {
              console.log("create bill failed");
            }
          }).catch(err => {
            console.log(err);
          });
        }
        else {
          console.log("checkout failed");
        }
      }).catch(err => {
        console.log(err);
      });
      }
    },
    getExcelBill() {
      api.getExcelBill(this.bill.billId).then(res => {
        // 创建一个链接元素
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;

        // 从响应头中获取文件名
        const contentDisposition = response.headers['content-disposition'];
        let fileName = 'bill.xlsx'; // 默认文件名
        if (contentDisposition) {
          const fileNameMatch = contentDisposition.match(/filename="?(.+)"?/);
          if (fileNameMatch.length === 2) {
            fileName = fileNameMatch[1];
          }
        }
        link.setAttribute('download', fileName);

        // 触发下载
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }).catch((error) => {
        console.error('下载失败:', error);
      });
    },
    getExcelDetail() {
      api.getExcelDetail(this.bill.billId).then(res => {
        // 创建一个链接元素
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;

        // 从响应头中获取文件名
        const contentDisposition = response.headers['content-disposition'];
        let fileName = 'detail.xlsx'; // 默认文件名
        if (contentDisposition) {
          const fileNameMatch = contentDisposition.match(/filename="?(.+)"?/);
          if (fileNameMatch.length === 2) {
            fileName = fileNameMatch[1];
          }
        }
        link.setAttribute('download', fileName);

        // 触发下载
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }).catch((error) => {
        console.error('下载失败:', error);
      });
    },
    Fixed(number, precision) {
      return Number.parseFloat(number).toFixed(precision);
    },
  }
}

</script>

<style scoped>
.text {
  font-size: 20px;
  font-weight: 500;
  color: rgb(36, 28, 28);
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

.table-text{
  font-size: 15px;
  font-weight: 500;
  color: rgb(36, 28, 28);
  text-align: center;
}

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
  
.el-card.gray-bg {  
  background-color: #e7a7a7;  
}

:deep(.el-form-item__label){
  font-size: 15px; /* 调整字体大小 */
  color: black; /* 修改字体颜色 */
  font-weight: 600; /* 修改字体粗细 */
  font-family: 'Arial', sans-serif; /* 修改字体 */
}

:deep(.custom-input .el-input__wrapper) {
  border: none; /* 去掉边框 */
  border-bottom: 2px solid gray; /* 添加底部边框 */
  border-radius: 0; /* 去掉圆角 */
  box-shadow: none; /* 去掉阴影 */
  background-color: transparent;
}

:deep(.custom-input .el-input__wrapper:hover) {
  border-bottom: 2px solid black; /* 悬停时底部边框颜色 */
}

</style>





