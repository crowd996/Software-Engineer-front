<template>
  <el-container class="reception-page">
    <el-container class="background">  
    <!-- <el-aside style="height: 100%; width: 20%">  
      <MenuRight class="menu"/>  
    </el-aside>   -->
    <UserHeader />
    <div class="room-table"> 
        <div  
          v-for="(room, index) in rooms"  
          :key="index"  class="room-grid-wrapper" >  
          <RoomGridMA :room_id="room.id" :room_name="room.name" :state="room.state" @chengeState="chengeState"
          style="margin: 0; padding: 0;" />  
        </div>
      </div>
    </el-container>
  </el-container>
</template>

<script>
import RoomGridMA from '@/components/RoomGrid/roomgrid_ma.vue'
import UserHeader from '@/components/header/userheader.vue'
import api from '@/api';
export default {
  name: 'PanelView',
  computed: {
  },
  data() {
    return {
      rooms: [], 
    }
  }, 
  created() {  
    api.getRoomList()  
      .then(response => {  
        response = response.data
        response.data.forEach(room => {  
          if (room.use === 0) {  
            room.state = 'empty';
          }  
          else{
            room.state = 'occupied';
          }
        });  
        this.rooms = response.data;  
      })  
      .catch(error => {  
        console.log(error);  
      });  
  },  
  components: {
    RoomGridMA,
    UserHeader
  },
  methods: {
    chengeState(roomId, newState) {
      const room = this.rooms.find(room => roomId === room.id);
      if(room) {
        room.state = newState;
      }
    }
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
