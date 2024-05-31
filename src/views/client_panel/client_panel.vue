<template>
    <!--<WebSocketServe ref="websocket"/>-->
<div class="background">
    <UserHeader />
    <div class="box-card" style="height: 70vh;">
        <div class="box-card-header">AirConditioner Controller</div>
            <!-- 第一行，高度较高的信息显示区，有边框 -->
            <div class="info-box" style="height: 25vh">
                <!-- 根据开关状态显示不同的信息 -->
                <div v-if="!isPoweredOn" class="poweroff-box">
                    <p class="text">Power Off</p>
                </div>
                <div v-else class="poweron-box">
                    <!-- 服务状态点 -->
                    <div class="service-status" :class="{'service-on': isPoweredOn, 'service-off': !isPoweredOn}"></div>
                    <!-- 当前温度 -->
                    <div class="current-temperature">
                        {{ currentTemperature ? currentTemperature : '' }}°C
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
                    <div class="set-temperature">{{ setTemperature ? setTemperature : '' }}°C</div>
                    <!-- 风速显示区 -->
                    <div class="wind-speed">
                        <font-awesome-icon
                            v-for="n in 3"
                            :key="n"
                            :icon="['fas', 'fan']"
                            :class="{'wind-icon-black': n <= setWindSpeed, 'wind-icon-gray': n > setWindSpeed}"/>
                    </div>
                    <!-- <el-row class="info-row">
                        <el-col :span="12">
                            <div class="info-label">当前温度：</div>
                            <div class="info-value">{{ currentTemperature }}</div>
                        </el-col>
                        <el-col :span="12">
                            <div class="info-label">设定温度：</div>
                            <div class="info-value">{{ setTemperature }}</div>
                        </el-col>
                    </el-row>
                    <el-row class="info-row">
                        <el-col :span="12">
                            <div class="info-label">当前风速：</div>
                            <div class="info-value">{{ currentWindSpeed }}</div>
                        </el-col>
                        <el-col :span="12">
                            <div class="info-label">设定风速：</div>
                            <div class="info-value">{{ setWindSpeed }}</div>
                        </el-col>
                    </el-row> -->
                </div>
            </div>
            <!-- 第二行，一个开机/关机按钮 -->
            <div class="row">
                <el-form ref="form1" :model="form1" inline>
                    <el-form-item label="房间号" style="width: 150px;">
                        <el-input v-model="form1.field1" style="width: 100px;"></el-input>
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
                        <el-input v-model="form2.field2" style="width: 100px;"></el-input>
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

//import WebSocketServe from '../../websocket/WebSocketServe.vue';

export default {
data() {
    return {
        form1: {
            field1: ''
        },
        form2: {
            field2: ''
        },
        form3: {
            field3: ''
        },

        // 开关机按钮的状态
        isPoweredOn: true,
        currentTemperature: 25,
        setTemperature: 30,
        currentWindSpeed: null,
        setWindSpeed: 3,
        airConditioningCost: null,

        receivedMsg: null
    };
},
components:{
    UserHeader,
    //WebSocketServe

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
    //this.$refs.websocket.registerMessageCallback(this.handleMsg);
},
beforeDestroy() {
    // 组件销毁时清理定时器
    if (this.intervalId) {
        clearInterval(this.intervalId);
    }
},
methods: {
    togglePower() {
        // 切换开关机状态
        this.isPoweredOn = !this.isPoweredOn;
        console.log(this.isPoweredOn ? "开机" : "关机");
        // 如果开机，则请求空调信息
        if (this.isPoweredOn) {
            this.intervalId = setInterval(this.fetchRoomInfo, 5000);
            this.intervalId2 = setInterval(this.send_cur_temperature, 5000);
            this.fetchAirConditioningInfo();
        }
        else {
            this.turnOFF();
        }
        this.initialTime = new Date();
        this.currentTime = new Date();
        const room1_init = 32;
        const room2_init = 28;
        const room3_init = 30;
        const room4_init = 29;
        const room5_init = 31;
        const temp_init_dict = {
            "101": room1_init,
            "102": room2_init,
            "103": room3_init,
            "104": room4_init,
            "105": room5_init
        };
        this.currTemp = temp_init_dict[this.form1.field1];
        console.log("当前温度：", this.currTemp)

        // 每秒更新当前时间并重新计算温度   在这里要先问一下是否在服务
        this.timer = setInterval(() => {
            this.currentTime = new Date();
            this.calculateTemperature();
        }, 10000);
    },
    calculateTemperature() {
        // const minutesPassed = (this.currentTime - this.initialTime) / 10000; // 计算经过的分钟数
        
        if (this.currTemp == this.setTemperature) {
            return;
        }
        else if (this.currTemp > this.setTemperature) {
            this.currTemp -= 0.5 ;
        }
        else {
            this.currTemp += 0.5 ;
        }
        console.log("当前温度：", this.currTemp)
        console.log("发送请求")
        // this.send_cur_temperature();
    },
    handleMsg(message){
        this.currentTemperature = this.currTemp;
        this.setTemperature = message.set_temperature;
        this.currentWindSpeed = message.speed;
        this.setWindSpeed = message.speed;
        this.airConditioningCost = message.bill;
    },
    fetchRoomInfo(){
        api.getQueryRoomInfo({
            room_number: this.form1.field1
        }).then(res => {
            console.log("res:", res);
            // 更新数据
            // this.currentTemperature = res.data.cur_temperature;
            this.currentTemperature = this.currTemp;
            this.setTemperature = res.data.set_temperature;
            this.currentWindSpeed = res.data.speed;
            this.setWindSpeed = res.data.speed;
            this.airConditioningCost = res.data.bill;
        }).catch(err => {
            console.error('Error fetching room info:', err);
            alert("error！");
        });
    },
    send_cur_temperature() {
        console.log("发送出去的温度：", this.currTemp)
        api.postCurTemperature({
            room_number: this.form1.field1, current_temp: this.currTemp
        }).catch(err => {
            console.log(err);
            console.log('send failed');
            alert("请检查房间号是否正确！");
        });
        //this.$refs.websocket.sendMessage();
    },
    fetchAirConditioningInfo() {
        // 这里是请求后端获取空调信息的逻辑
        // 假设您从后端获取的信息是一个对象，例如：
        // { currentTemperature: 24, setTemperature: 26, currentWindSpeed: 3, setWindSpeed: 2, airConditioningCost: 100 }
        // 您需要根据实际情况调整这个方法来适应您的后端接口

        // 模拟异步请求获取数据
        this.fetchRoomInfo();
        
        // 在这里，我们首先的逻辑是向后端告知我们打开了空调，然后后端返回给我们一个对象，包含了空调的信息
        this.submitForm('form1');
    },
    submitForm(form_name) {
        if(form_name === "form1") {
            api.postTurnOn({
                room_number: this.form1.field1
            }).then(res => {
                console.log(res);
                if (res) {
                    console.log('turn on success');
                    console.log(res.data);
                }
            }).catch(err => {
                console.log(err);
                console.log('turn on failed');
                alert("开机失败，请检查房间号是否正确！");
            });
        } else if (form_name === "form2") {
            api.postSetTemperature({
                room_number: this.form1.field1, temperature: parseInt(this.form2.field2)
            }).catch(err =>{
                console.log(err);
                console.log('set failed');
                alert("请检查房间号是否正确！");
            });
        } else if (form_name === "form3") {
            let speed_ = this.form3.field3;
            // 转换为小写
            speed_ = speed_.toLowerCase();
            api.postSetSpeed({
                room_number: this.form1.field1, speed: speed_
            }).catch(err =>{
                console.log(err);
                console.log('set failed');
                alert("请检查房间号是否正确！");
            });
        }
    },
    turnOFF() {
        api.postTurnOff({
            room_number: this.form1.field1
        }).then(res => {
            console.log(res);
            if (res) {
                console.log('turn off success');
                console.log(res.data);
            }
        }).catch(err => {
            console.log(err);
            console.log('turn off failed');
            alert("关机失败，请检查房间号是否正确！");
        });
    }
}
};
</script>

<style scoped>
.background {
    display: flex;
    justify-content: center; /* 水平居中 */
    align-items: center; /* 垂直居中 */
    height: 100vh; /* 全视口高度 */
    display: flex;
    width: 100%;
    opacity: 0.9;
    background-color: #D1D1B9;
    box-sizing: border-box;
    overflow: auto;
    padding-top: 17vh;
}

.box-card {
    display: flex;
    flex-direction: column; /* 垂直排列子元素 */
    justify-content: center; /* 垂直居中对齐 */
    align-items: center; /* 水平居中对齐 */
    width: 33vw; /* 卡片宽度设置为页面的三分之一 */
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

.info-row {
    width: 100%;
    margin-bottom: 10px; /* 行间距 */
}

.info-label, .info-value {
    font-size: 15px;
    font-weight: 600;
    color: rgb(36, 28, 28);
    display: inline-block; /* 内联块布局 */
}

.info-label {
    margin-right: 10px; /* 标签后的间隔 */
}

.text {
    font-size: 20px;
    font-weight: 500;
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
