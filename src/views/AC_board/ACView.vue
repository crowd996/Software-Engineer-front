<template>  
    <el-container class="reception-page">  
      <el-container class="background">  
        <AdminHeader/>
            <div class="room-table"> 
        <div  
          v-for="(room, index) in rooms"  
          :key="index"  class="room-grid-wrapper" >  
          <RoomGridAC :room_id="room.name" :temperature="room.temperature" :wind_speed="room.wind_speed" :state="room.state" style="margin: 0; padding: 0;" />
        </div>
      </div>
      </el-container>  
    </el-container>  
</template>
  
<script>
  import api from '@/api';
  import RoomGridAC from '@/components/RoomGrid/roomgrid_ac.vue'
  import AdminHeader from '@/components/header/adminheader.vue'
  import EventBus from '@/eventBus';
  import { mapActions } from 'vuex';
  export default {
    name: 'ACView',
    data() {
      return {
        roomList:[],
        rooms: [
            {
              "id": 2,
              "name": "408",
              "use": 1,
              "temperature": 11, "wind_speed": 3, "state": "work"
            },
            {
              "id": 4,
              "name": "408",
              "use": 1,
              "temperature": 11, "wind_speed": 3, "state": "unsue"
            },
            {
              "id": 5,
              "name": "408",
              "use": 1,
              "temperature": 11, "wind_speed": 3, "state": "wait"
            },
            {
              "id": 6,
              "name": "408",
              "use": 1,
              "temperature": 11, "wind_speed": 3, "state": "work"
            },
        ],
      }
    },
    components: {
        AdminHeader,
        RoomGridAC,
    },
    created() {
      api.getQueryRoomInfo()
        .then(res => {
          res =res.data
          if(res.code === 'success'){
            console.log("get Detail Success");
            console.log(res)
            this.rooms = res.data.list;
          }
          else {
            console.log("get Detail Failed");
          }
        }).catch(error =>{
          alert("get Detail Failed");
          console.log(error);
        });
      // 初始化 WebSocket 连接
      this.initSocket2('ws://43.143.173.140/api/monitor');
      // 监听事件总线事件
      EventBus.$on('socket2-message', this.updateRoom);
    },
    beforeUnmount() {
      // 移除事件监听
      EventBus.$off('socket2-message', this.updateRoom);
    },
    methods: {
      ...mapActions(['initSocket2']),
      updateRoom(message) {
        console.log(this.rooms)
        // 在这里处理 WebSocket 消息
        console.log('Received message from socket2:', message);
        // 确保 message 存在并且是一个对象
        const data = message || {};
        // 创建一个 Set 来存储所有出现的房间 name
        const updatedRoomNames = new Set();

        // 更新 waiting 中的房间信息
        if (Array.isArray(data.waiting)) {
            data.waiting.forEach(room => {
                const index = this.rooms.findIndex(r => r.id === room.roomId);
                if (index !== -1) {
                  this.rooms[index] = { 
                      ...this.rooms[index], 
                      state: 'wait',
                      temperature: room.temperature !== undefined ? room.temperature : this.rooms[index].temperature,
                      wind_speed: room.windSpeed !== undefined ? room.windSpeed : this.rooms[index].wind_speed
                    };
                    updatedRoomNames.add(room.roomId);
                }
            });
        }

        // 更新 servicing 中的房间信息
        if (Array.isArray(data.servicing)) {
            data.servicing.forEach(room => {
                const index = this.rooms.findIndex(r => r.id === room.roomId);
                console.log("index:"+index)
                if (index !== -1) {
                    this.rooms[index] = { 
                      ...this.rooms[index], 
                      state: 'work',
                      temperature: room.temperature !== undefined ? room.temperature : this.rooms[index].temperature,
                      wind_speed: room.windSpeed !== undefined ? room.windSpeed : this.rooms[index].wind_speed
                    };
                    console.log(this.rooms[index])
                    updatedRoomNames.add(room.roomId);
                }
            });
        }

        // 将未出现的房间信息设置为 null
        this.rooms.forEach((room, index) => {
            if (!updatedRoomNames.has(room.id)) {
              this.rooms[index] = { 
              ...room, 
              state: 'unuse',
              temperature: null,
              wind_speed: null 
            };
            }
        });
        console.log('Updated rooms:', this.rooms);
      },
    }
  }
  </script>
  
  <style scoped>
  .html, body {
  margin: 0;
  padding: 0;
  height: 100vh;
  font-family: 'Arial', sans-serif;
  overflow: auto;
}

.reception-page {
  width: 100%;
  height: 100vh;
  display: flex;
}

.background {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  width: 100vw;
  height: 100%;
  opacity: 0.9;
  background-color: #D1D1B9;
  box-sizing: border-box;
  overflow: auto;
  padding-top: 17vh;
}

.room-table {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
  width: 80%;
  height: auto;
}

.room-grid-wrapper {
  width: 200px;
  padding: 0;
}
  
  </style>