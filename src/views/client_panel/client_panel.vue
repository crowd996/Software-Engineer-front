<template>
    <!--<WebSocketServe ref="websocket"/>-->
<div class="background">
    <UserHeader />
    <div class="box-card" >
        <div class="box-card-header">AirConditioner Controller</div>
            <!-- 第一行，高度较高的信息显示区，有边框 -->
            <div class="info-box" style="height: 25vh">
                <!-- 根据开关状态显示不同的信息 -->
                <div v-if="!isPoweredOn" class="poweroff-box">
                    <p class="poweroff-text">Power Off</p>
                </div>
                <div v-else class="poweron-box">
                    <!-- 服务状态点 -->
                    <div class="service-status" :class="{'service-on': isService && isPoweredOn, 'service-off':  !isService && isPoweredOn,'power-off': !isPoweredOn}"></div>
                    <!-- 当前温度 -->
                    <div class="current-temperature">
                        {{ currentTemperature ? currentTemperature.toFixed(1) : '' }}°C
                        <font-awesome-icon
                            v-if="setTemperature > currentTemperature"
                            :icon="['fas', 'arrow-up']"
                            :class="{'blink': true}" />
                        <font-awesome-icon
                            v-else-if="setTemperature < currentTemperature"
                            :icon="['fas', 'arrow-down']"
                            :class="{'blink': true}"/>
                    </div>
                    <!-- 设定温度 -->
                    <div class="set-temperature">{{ setTemperature ? setTemperature.toFixed(1) : '' }}°C</div>
                    <div class="fee">{{ fee ? fee.toFixed(1) : 0 }}</div>
                    <!-- 风速显示区 -->
                    <div class="wind-speed">
                        <font-awesome-icon
                            v-for="n in 3"
                            :key="n"
                            :icon="['fas', 'fan']"
                            :class="{'wind-icon-black': n <= setWindSpeed, 'wind-icon-gray': n > setWindSpeed}"/>
                    </div>
                </div>
            </div>
            <!-- 第二行，一个开机/关机按钮 -->
            <div class="row">
                <el-form inline>
                    <el-form-item label="房间号" style="width: 150px;">
                        {{ roomId }}
                    </el-form-item>
                    <el-form-item>
                        <el-button :class="buttonClass" @click="togglePower">{{ powerButtonLabel }}</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <!-- 第三、四行，表单和按钮 -->
            <!-- 第三行，一个短输入栏和提交按钮 -->
            <div class="row">
                <el-form ref="form2" :model="form2" inline>
                    <el-form-item label="设置温度" style="width: 150px;">
                        <el-input v-model="form2.field2" style="width: 100px;" type="number"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button class="custom-button" @click="submitForm('form2')">SET</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="row">
                <el-form ref="form3" :model="form3" inline>
                    <el-form-item label="设置风速" style="width: 150px;">
                        <el-select v-model="form3.field3" placeholder="请选择" style="width: 100px;">
                            <el-option label="Low" value="Low"></el-option>
                            <el-option label="Medium" value="Medium"></el-option>
                            <el-option label="High" value="High"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button class="custom-button" @click="submitForm('form3')">SET</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
import api from '@/api';
import UserHeader from '@/components/header/userheader.vue';
import EventBus from '@/eventBus';
import { mapActions } from 'vuex';

export default {
data() {
    return {
        form2: {
            field2: ''
        },
        form3: {
            field3: ''
        },

        // 开关机按钮的状态
        isPoweredOn: false,
        isService: false,
        initTemperature: 0,
        currentTemperature: 25.0,
        setTemperature: 25.0,
        setWindSpeed: 2,
        status:4,

        fee:0,

        roomId: null,
        recordId: null,
        requestId:0,
        timer: null,
        timer2: null,

        lowerBound: 18,
        upperBound: 25
    };
},
components:{
    UserHeader,

},
computed: {
    // 计算属性，用于动态更新按钮文本
    buttonClass() {
        return this.isPoweredOn ? 'button-on' : 'button-off';
    },
    powerButtonLabel() {
        return this.isPoweredOn ? '关机' : '开机';
    }
},
created() {
    api.getQueryRecordByToken().then(res => {
        const data = res.data;
        if(data.code === 'success'){
            this.roomId = data.data.roomId;
            this.recordId = data.data.id;
            api.getQueryRecordByroomId(this.roomId).then(res =>{
                const data = res.data;
                if(data.code === 'success'){
                    this.initTemperature = data.data.initTemp;
                    this.currentTemperature = this.initTemperature
                }
                else{
                    alert("获取初始温度失败！");
                }
            }).catch(error => {
                alert("获取初始温度失败！");
                console.error('请求失败:', error);
            });
        }
        else{
            alert("获取房间号失败！");
        }
    }).catch(error => {
        alert("获取房间号失败！");
        console.error('请求失败:', error);
    });
    
    api.getTemperatureBound().then(res => {
        console.log(res)
        if(res.status === 200){
            console.log("获取调温范围成功")
            res=res.data
            this.lowerBound = res.data.lowerBound
            this.upperBound = res.data.upperBound
        }
        else{
            alert("获取调温范围失败！");
        }
    }).catch(error => {
        alert("获取调温范围失败！");
        console.error('请求失败:', error);
    });
    this.initSocket1('ws://43.143.173.140/api/sync');
    // 监听事件总线事件
    EventBus.$on('socket1-message', this.handleSocketMessage);
    this.timer = setInterval(() => {
            if(this.isPoweredOn){
                this.calculateTemperature();
            }
    }, 30000);
    this.timer2 = setInterval(() => {
            if(!this.isPoweredOn){
                this.calculateTemperatureClose();
            }
    }, 30000);
},
beforeDestroy() {
    // 组件销毁时清理定时器
    if (this.intervalId) {
        clearInterval(this.intervalId);
    }
    this.closeSocket1();
    // 移除事件监听
    EventBus.$off('socket1-message', this.handleSocketMessage);
},
methods: {
    ...mapActions(['sendMessageToSocket1','initSocket1','closeSocket1']),
    togglePower() {
        // 切换开关机状态
        this.isPoweredOn = !this.isPoweredOn;
        console.log(this.isPoweredOn ? "开机" : "关机");
        console.log(this.isPoweredOn);
        // 如果开机，则请求空调信息
        if (this.isPoweredOn) {
            if(this.currentTemperature >= this.setTemperature + 1){
                this.sendMessageToSocket({
                    roomId: this.roomId,
                    recordId: this.recordId,
                    windSpeed: this.setWindSpeed,
                    temperature: this.setTemperature,
                    status: 1
                })
            }
        }
        else {
            console.log(1)
            this.turnOFF();
        }
    },
    calculateTemperature() {
        console.log(this.status)
        console.log(this.setTemperature)
        if(this.isService || this.status === 2 || this.status === 1){
            this.sendMessageToSocket({
                id: this.requestId,
                roomId: this.roomId,
                recordId: this.recordId,
                windSpeed: this.setWindSpeed,
                temperature: this.setTemperature,
                status: this.status
            })
        }
        if(this.isService){
            if (this.setTemperature !== undefined && this.currentTemperature === this.setTemperature) {
                console.log("到达目标温度")
                this.sendMessageToSocket({
                    id: this.requestId,
                    roomId: this.roomId,
                    recordId: this.recordId,
                    windSpeed: this.setWindSpeed,
                    temperature: this.setTemperature,
                    status: 4
                })
            }
            else if (this.currentTemperature > this.setTemperature){
                if (this.setWindSpeed === 1){
                    if(this.currentTemperature-0.4<=this.setTemperature){
                        this.currentTemperature = this.setTemperature
                        console.log("到达目标温度")
                this.sendMessageToSocket({
                        id: this.requestId,
                        roomId: this.roomId,
                        recordId: this.recordId,
                        windSpeed: this.setWindSpeed,
                        temperature: this.setTemperature,
                        status: 4
                    })
                    }
                    else {
                        this.currentTemperature -= 0.4;
                    }
                }
                else if(this.setWindSpeed === 2){
                    if(this.currentTemperature-0.5<=this.setTemperature){
                        this.currentTemperature = this.setTemperature
                        console.log("到达目标温度")
                this.sendMessageToSocket({
                        id: this.requestId,
                        roomId: this.roomId,
                        recordId: this.recordId,
                        windSpeed: this.setWindSpeed,
                        temperature: this.setTemperature,
                        status: 4
                    })
                    }
                    else {
                        this.currentTemperature -= 0.5 ;
                    }
                }
                else if(this.setWindSpeed === 3){
                    if(this.currentTemperature-0.6<=this.setTemperature){
                        this.currentTemperature = this.setTemperature
                        console.log("到达目标温度")
                this.sendMessageToSocket({
                        id: this.requestId,
                        roomId: this.roomId,
                        recordId: this.recordId,
                        windSpeed: this.setWindSpeed,
                        temperature: this.setTemperature,
                        status: 4
                    })
                    }
                    else {
                        this.currentTemperature -= 0.6 ;
                    }
                }
            }
            else if (this.currentTemperature < this.setTemperature){
                if (this.setWindSpeed === 1){
                    if(this.currentTemperature+0.4>=this.setTemperature){
                        this.currentTemperature = this.setTemperature
                        console.log("到达目标温度")
                this.sendMessageToSocket({
                        id: this.requestId,
                        roomId: this.roomId,
                        recordId: this.recordId,
                        windSpeed: this.setWindSpeed,
                        temperature: this.setTemperature,
                        status: 4
                    })
                    }
                    else {
                        this.currentTemperature += 0.4 ;
                    }
                }
                else if(this.setWindSpeed === 2){
                    if(this.currentTemperature+0.5>=this.setTemperature){
                        this.currentTemperature = this.setTemperature
                        console.log("到达目标温度")
                this.sendMessageToSocket({
                        id: this.requestId,
                        roomId: this.roomId,
                        recordId: this.recordId,
                        windSpeed: this.setWindSpeed,
                        temperature: this.setTemperature,
                        status: 4
                    })
                    }
                    else {
                        this.currentTemperature += 0.5 ;
                    }
                }
                else if(this.setWindSpeed === 3){
                    if(this.currentTemperature+0.6>=this.setTemperature){
                        this.currentTemperature = this.setTemperature
                        console.log("到达目标温度")
                        this.sendMessageToSocket({
                        id: this.requestId,
                        roomId: this.roomId,
                        recordId: this.recordId,
                        windSpeed: this.setWindSpeed,
                        temperature: this.setTemperature,
                        status: 4
                    })
                    }
                    else {
                        this.currentTemperature += 0.6 ;
                    }
                }
            }
            console.log("当前温度：", this.currentTemperature)
            console.log(typeof this.currentTemperature)
        }
        if (this.status === 4){
            if(this.currentTemperature < this.initTemperature){
                if(this.currentTemperature+0.5<this.initTemperature){
                    this.currentTemperature += 0.5;
                }
                else {
                    this.currentTemperature = this.initTemperature;
                }
            }
            else {
                if(this.currentTemperature-0.5>this.initTemperature){
                    this.currentTemperature += 0.5;
                }
                else {
                    this.currentTemperature = this.initTemperature;
                }
            }
            
            if(this.currentTemperature >= this.setTemperature + 1){
                this.sendMessageToSocket({
                    roomId: this.roomId,
                    recordId: this.recordId,
                    windSpeed: this.setWindSpeed,
                    temperature: this.setTemperature,
                    status: 1
                })
            }
        }
    },
    endservice() {

    },
    calculateTemperatureClose() {
        if(this.currentTemperature < this.initTemperature){
            if(this.currentTemperature+0.5<this.initTemperature){
                this.currentTemperature += 0.5;
            }
            else {
                this.currentTemperature = this.initTemperature;
            }
        }
        else {
            if(this.currentTemperature-0.5>this.initTemperature){
                this.currentTemperature += 0.5;
            }
            else {
                this.currentTemperature = this.initTemperature;
            }
        }
    },
    submitForm(form_name) {
        if(form_name === "form1") {
            this.togglePower();
        } else if (form_name === "form2") {
            if(this.isPoweredOn){
                if(this.form2.field2 >= this.lowerBound && this.form2.field2 <= this.upperBound){
                    const value = parseFloat(this.form2.field2);
                    if (!isNaN(value)) {
                        this.setTemperature = value;
                    } else {
                        this.setTemperature = null; // 或者其他错误处理
                    }
                    if(this.status ===1 || this.status === 2 || this.status === 3){
                        this.sendMessageToSocket({
                        id: this.requestId,
                        roomId: this.roomId,
                        recordId: this.recordId,
                        windSpeed: this.setWindSpeed,
                        temperature: this.setTemperature,
                        status: this.status
                        })
                    }
                    else{
                        this.sendMessageToSocket({
                        roomId: this.roomId,
                        recordId: this.recordId,
                        windSpeed: this.setWindSpeed,
                        temperature: this.setTemperature,
                        status: 1
                        })
                    }
                }
                else{
                    alert("不在调温范围")
                }
            }
            else{
                alert("请先开机！");
            }
            this.form2.field2 = null;
        } else if (form_name === "form3") {
            if(this.isPoweredOn){
                let speed_ = this.form3.field3;
                this.form3.field3 = null
                // 转换为小写
                speed_ = speed_.toLowerCase();
                this.sendMessageToSocket({
                    id: this.requestId,
                    roomId: this.roomId,
                    recordId: this.recordId,
                    windSpeed: this.setWindSpeed,
                    temperature: this.setTemperature,
                    status: 4
                })
                // 定义一个函数来循环检查并发送消息
                const checkAndSend = (speed_) => {
                // 检查条件
                if (this.status === 4) {
                    // 如果条件满足，发送第二个消息并清除定时器
                    if(speed_ === "low") {
                        this.setWindSpeed = 1;
                    } else if(speed_ === "medium") {
                        this.setWindSpeed = 2;
                    } else if(speed_ === "high") {
                        this.setWindSpeed = 3;
                    }
                    this.sendMessageToSocket({
                        roomId: this.roomId,
                        recordId: this.recordId,
                        windSpeed: this.setWindSpeed,
                        temperature: this.setTemperature,
                        status: 1
                    });
                    clearInterval(intervalId);
                } else {
                    console.log('Waiting for status to be 4...');
                }
                };
                // 使用 setInterval 每秒检查一次条件
                const intervalId = setInterval(checkAndSend, 300,speed_);
            }
            else{
                alert("请先开机！");
            }
        }
    },
    turnOFF() {
        this.sendMessageToSocket1({
            id: this.requestId,
            roomId: this.roomId,
            recordId: this.recordId,
            windSpeed: this.setWindSpeed,
            temperature: this.setTemperature,
            status: 4,
        })
        this.isPoweredOn = false;
        this.isService = false;
    },
    sendMessageToSocket(message) {
        this.sendMessageToSocket1(message);
    },
    handleSocketMessage(message) {
      // 在这里处理 WebSocket 消息
      console.log('Received message from socket1:', message);
      // 确保 message.data 存在并且是一个对象
      const data = message.data || {};
      console.log(message.data)
      this.requestId = data.id !== undefined ? data.id : this.requestId;
        this.status = data.status !== undefined ? data.status : this.status;
        //this.setTemperature = data.temperature !== undefined ? data.temperature : this.setTemperature;
        this.setWindSpeed = data.windSpeed !== undefined ? data.windSpeed : this.setWindSpeed;
        console.log("fee:"+data.fee)
        this.fee = typeof data.fee == 'number' ? data.fee : this.fee;
        console.log("fee this:"+this.fee)
      if(this.status === 2 || this.status === 4){
        this.isService = false;
      }
      else if(this.status === 3){
        this.isService = true;
      }
    },
}
};
</script>

<style scoped>
html, body, #app {
    margin: 0;
    padding: 0;
    min-height: 100%;
}

.background {
    position: relative;
    display: flex;
    justify-content: center; /* 水平居中 */
    align-items: center; /* 垂直居中 */
    min-height: 100vh; /* 全视口高度 */
    width: 100%;
    opacity: 0.9;
    background-color: #D1D1B9;
    box-sizing: border-box;
    overflow: visible;
    padding-top: 17vh;
}

.box-card {
    display: flex;
    flex-direction: column; /* 垂直排列子元素 */
    justify-content: center; /* 垂直居中对齐 */
    align-items: center; /* 水平居中对齐 */
    width: 33vw; /* 卡片宽度设置为页面的三分之一 */
    height: 70vh;
    background-color: white; /* 卡片背景色 */
    border-radius: 20px; /* 卡片圆角 */
    padding: 20px; /* 内边距 */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 默认阴影效果 */
    transition: box-shadow 0.3s ease-in-out; /* 添加过渡效果 */
}

.box-card:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2); /* 鼠标悬停时的阴影效果 */
}

.box-card-header {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
}

.info-box {
    display: flex;
    position: relative;
    flex-direction: column;
    align-items: center;
    width: 80%;
    border: 1px solid #dcdfe6; /* 信息区边框 */
    padding: 10px;
    margin-bottom: 20px;
    background-color: #f9f9f9;
}

.current-temperature {
    position: absolute;
    top: 10px;
    left: 10px;
    font-size: 30px;
    font-weight: 600;
    color: gray;
}

.set-temperature {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 60px;
    font-weight: 700;
    color: black;
}

.service-status {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: gray;
}

.service-on {
    background-color: green;
}

.service-off {
    background-color: gray;
}

.power-off {
    background-color: red;
}

.fee {
    display: flex;
    justify-content: center;
    position: absolute;
    bottom: 10px;
    left: 30px;
    height: 20px;
    margin-top: 20px;
    font-size: 20px;
    font-weight: 700;
    color: black;
}

.wind-speed {
    display: flex;
    justify-content: center;
    position: absolute;
    bottom: 10px;
    right: 30px;
    height: 20px;
    margin-top: 20px;
}

.wind-icon-black {
    color: black;
    font-size: 20px;
    margin: 0 5px;
}

.wind-icon-gray {
    color: gray;
    font-size: 20px;
    margin: 0 5px;
}

.row {
    display: flex;
    justify-content: center; /* 水平居中 */
    margin-bottom: 20px;
    width: 100%;
}

.custom-button {
    background-color: gray;
    color: white ;
    border: none ;
    transition: background-color 0.3s ease-in-out;
}

.custom-button:hover {
    background-color: black ;
}

/* 添加自定义样式 */
.button-on {
    background-color: #f85050;
}

.button-off {
  /* 默认样式，可以根据需要进行调整 */
}


.poweroff-text {
    font-size: 30px;
    font-weight: 700;
    color: rgb(36, 28, 28);
}

.poweroff-box {
    display: flex;
    justify-content: center;
    align-items: center;
}

.poweron-box {
    width: 100%;
}

:deep(.el-form-item__label){
  font-size: 15px; /* 调整字体大小 */
  color: black; /* 修改字体颜色 */
  font-weight: 600; /* 修改字体粗细 */
  font-family: 'Arial', sans-serif; /* 修改字体 */
}

.blink {
    animation: blink-animation 1s steps(2, start) infinite;
}

@keyframes blink-animation {
    to {
        visibility: hidden;
    }
}
</style>
