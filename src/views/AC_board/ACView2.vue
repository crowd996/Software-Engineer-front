<template>  
    <el-container class="reception-page">  
      <el-container class="background">  
        <UserHeader/>
            <div class="room-table"> 
        <div  
          v-for="(room, index) in rooms"  
          :key="index"  class="room-grid-wrapper" >  
          <RoomGridAC :room_id="room.id" :temperature="room.temperature" :wind_speed="room.wind_speed" :state="room.state" style="margin: 0; padding: 0;" />
        </div>
      </div>
      </el-container>  
    </el-container>  
</template>
  
<script>
  import RoomGridAC from '@/components/RoomGrid/roomgrid_ac.vue'
  import UserHeader from '@/components/header/userheader.vue'
  import api from '@/api';
  export default {
    name: 'ACView',
    data() {
      return {
        rooms: [
            {"name": 504, "temperature": 11, "wind_speed": 3, "state": "work"},
            {"name": 4, "temperature": 37, "wind_speed": 3, "state": "error"},
            {"name": 510, "temperature": 31, "wind_speed": 3, "state": "stop"},
            {"name": 298, "temperature": 16, "wind_speed": 2, "state": "stop"},
            {"name": 249, "temperature": 21, "wind_speed": 1, "state": "error"},
            {"name": 280, "temperature": 8, "wind_speed": 3, "state": "stop"},
            {"name": 109, "temperature": 9, "wind_speed": 2, "state": "stop"},
            {"name": 358, "temperature": 35, "wind_speed": 3, "state": "work"},
            {"name": 160, "temperature": 9, "wind_speed": 3, "state": "stop"},
            {"name": 141, "temperature": 16, "wind_speed": 1, "state": "error"},
            {"name": 393, "temperature": 26, "wind_speed": 2, "state": "stop"},
            {"name": 359, "temperature": 27, "wind_speed": 1, "state": "error"},
            {"name": 508, "temperature": 9, "wind_speed": 3, "state": "work"},
            {"name": 185, "temperature": 18, "wind_speed": 2, "state": "work"},
            {"name": 297, "temperature": 13, "wind_speed": 3, "state": "stop"},
            {"name": 395, "temperature": 8, "wind_speed": 2, "state": "stop"},
            {"name": 43, "temperature": 2, "wind_speed": 1, "state": "error"},
            {"name": 283, "temperature": 29, "wind_speed": 1, "state": "error"},
            {"name": 403, "temperature": 20, "wind_speed": 1, "state": "error"},
            {"name": 419, "temperature": 26, "wind_speed": 1, "state": "error"}
        ],
      }
    },
    components: {
        UserHeader,
        RoomGridAC,
    },
    methods: {
      
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