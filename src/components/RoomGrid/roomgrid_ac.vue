<template>
    <el-card @click="OfferDetail" @mouseover="handleMouseOver" @mouseout="handleMouseOut"
    :class="{hovered: isHovered,'card':true}" 
    style="width: 200px; height: 150px; display: flex; flex-direction: column; justify-content: center; align-items: center; position: relative;">
    <div class="text-rm" style="font-size: 30px; font-weight: bold; text-align: center;">
      {{ room_id }}
    </div>
    <div class="text-temp" style="font-size: 18px; text-align: center;">
      {{ temperature }}°C
    </div>
    <div class="wind-speed" style="display: flex; justify-content: center; align-items: center;">
      <font-awesome-icon
        v-for="n in 3"
        :key="n"
        :icon="['fas', 'fan']"
        :class="{'wind-icon-black': n <= wind_speed, 'wind-icon-gray': n > wind_speed}"
        style="margin-left: 5px;"/>
    </div>
      <div :class="{'dot-green':state === 'work', 'dot-red': state === 'unuse', 'dot-gray': state === 'wait'}" 
      style="position: absolute; bottom: 10px; right: 10px; width: 20px; height: 20px; border-radius: 50%;">
    </div>
    </el-card>
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
        this.dialogVisible = false;
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
  .dot-gray {
    background-color: #808080;
  }

  .wind-icon-black {
    color: black;
  }
  .wind-icon-gray {
    color: gray;
  }
  </style>