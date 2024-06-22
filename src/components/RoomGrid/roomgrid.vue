<template>
  <el-card @click="OfferDetail" @mouseover="handleMouseOver" @mouseout="handleMouseOut"
    class="card"
    :class="{hovered: isHovered}" 
    style="width: 200px; height: 150px; display: flex; flex-direction: column; justify-content: center; align-items: center; position: relative; clip-path: polygon(50% 0%, 100% 50px, 100% 100%, 0% 100%, 0% 50px);">
    
    <div class="text-rm" style="font-size: 24px; font-weight: bold; text-align: center;">
      {{ room_name }}
    </div>
    <div :class="state === 'empty' ? 'dot-green' : 'dot-red'" 
      style="position: absolute; bottom: 10px; right: 10px; width: 20px; height: 20px; border-radius: 50%;">
    </div>
  </el-card>

    <!-- 对话框 -->
  <el-dialog
    v-model="emptyDialogVisible"
    title="Checkin"
    width="40%"
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
    width="40%"
    :show-close="false">
    <template #header>
      <span class="title-text">Checkout</span>
      <font-awesome-icon :icon="['fas', 'xmark']" class="close-button" @click="occupiedDialogVisible = false"/>
    </template>
    <div style="max-height: 400px; overflow-y: auto;">
      <el-row style="justify-content: center; margin-bottom: 10px;">
          Check In Time: {{ checkInTime }}
      </el-row>
      <el-row>
        <el-button @click="onCheckout" class="submit-botton" style="width: 100%;">Checkout</el-button>
      </el-row>
    </div>
  </el-dialog>
  <el-dialog
    v-model="checkInDialogVisible"
    width="40%"
    :show-close="false">
    <template #header>
      <span class="title-text">{{ username !== '' ? 'Checkin Successs' : 'Checkin Failed'}}</span>
      <font-awesome-icon :icon="['fas', 'xmark']" class="close-button" @click="checkInDialogVisible = false"/>
    </template>
    <div v-if="username !== '' ">
      <el-row class="title-text">Username: {{ username }}</el-row>
      <el-row class="title-text">Password: {{ password }}</el-row>
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
    <el-row class="table-text" style="text-align: left; font-size: 18px; margin: 5px;">Totle Fee: {{ bill.fee }}</el-row>
    <el-row class="table-text" style="text-align: left;margin: 5px;">Detail:</el-row>
    <el-row style="margin: 5px; border: 1px solid #ccc;">
        <el-col :span="4" class="col-text">id</el-col>
        <el-col :span="4" class="col-text">requestTime</el-col>
        <el-col :span="4" class="col-text">startTime</el-col>
        <el-col :span="4" class="col-text">endTime</el-col>
        <el-col :span="4" class="col-text">windSpeed</el-col>
        <el-col :span="4" class="col-text">fee</el-col>
      </el-row>
    <div  
      v-for="(detail, index) in this.bill.detail"  
      :key="index"  class="detail-wrapper" > 
      <el-row style="margin: 5px; border: 1px solid #ccc;">
        <el-col :span="4" class="col-text">{{detail.id}}</el-col>
        <el-col :span="4" class="col-text">{{detail.requestTime}}</el-col>
        <el-col :span="4" class="col-text">{{detail.startTime}}</el-col>
        <el-col :span="4" class="col-text">{{detail.endTime}}</el-col>
        <el-col :span="4" class="col-text">{{detail.windSpeed}}</el-col>
        <el-col :span="4" class="col-text">{{detail.fee}}</el-col>
      </el-row>
    </div>
    <el-row>
      <el-col :span="16"></el-col>
      <el-col :span="4">
          <el-button @click="getExcelBill" class="submit-botton" style="width: 80%;">getBill</el-button>
        </el-col>
        <el-col :span="4">
          <el-button @click="getExcelDetail" class="submit-botton" style="width: 80%;">getDetail</el-button>
        </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import api from '@/api';
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
      checkInTime: "",
      nowRecordId: 0,
      bill: {
        billId: 0,
        fee: null,
        detail: []
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
        api.getQueryRecordInfo(undefined,this.room_id,0)
        .then(res => {
          if(res.status === 200){
            console.log("get Detail Success");
            res = res.data
            this.checkInTime = res.data.list[res.data.list.length -1].startTime;
            this.nowRecordId = res.data.list[res.data.list.length -1].id;
          }
          else {
            console.log("get Detail Failed");
          }
        }).catch(error =>{
          alert("get Detail Failed");
          console.log(error);
        });
      }
      console.log("OfferDetail");
    },

    handleMouseOver() {
      this.isHovered = true;
      console.log("handleMouseOver");
    },
    handleMouseOut() {
      this.isHovered = false;
      console.log("handleMouseOut");
    },
    onCheckin() {
      this.emptyDialogVisible = false;
      this.$emit('chengeState',this.room_id,'occupied');
      this.checkInDialogVisible = true;
      api.postCheckIn(this.room_id,this.name)
      .then(res => {
        console.log(res);
        res = res.data
        if (res.code === "success") {
          console.log("checkin success");
          this.username = res.data.account.username;
          this.password = res.data.account.password;
          this.chenkInDialogVisible = true;
          this.$emit('chengeState',this.room_id,'occupied');
        }
        else {
          console.log("checkin failed");
        }
      }).catch(error => {
        alert("checkin failed");
        console.log(error);
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
            res = res.data
            api.postBillByRecordId(this.nowRecordId).then(res => {
              console.log(res);
              if(res.status === 200){
                console.log("create bill success");
                res = res.data
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
              alert("create bill failed")
              console.log(err);
            });
          }
          else {
            console.log("checkout failed");
          }
        }).catch(err => {
          alert("checkout failed");
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
        const contentDisposition = res.headers['content-disposition'];
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
        console.error('download failed:', error);
        alert("download failed");
      });
    },
    getExcelDetail() {
      api.getExcelDetail(this.bill.billId).then(res => {
        // 创建一个链接元素
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;

        // 从响应头中获取文件名
        const contentDisposition = res.headers['content-disposition'];
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
        console.error('download failed:', error);
        alert("download failed");
      });
    },
  }
}

</script>

<style scoped>

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
.dot-red {
  background-color: #ff0000;
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





