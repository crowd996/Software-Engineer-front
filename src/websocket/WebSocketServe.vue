<template>
    <div></div>
</template>
  
  <script>
  export default {
    data() {
      return {
        websocket: null, // WebSocket对象
        reconnectInterval: 3000, // 重连间隔时间（毫秒）
        heartbeatInterval: null, // 心跳定时器
        messageCallbacks:[]
      };
    },
    created() {
      this.setupWebSocket(); // 创建WebSocket连接
    },
    methods: {
      setupWebSocket() {
        this.websocket = new WebSocket("ws链接地址"); // 创建WebSocket连接
        this.websocket.onopen = this.onWebSocketOpen; // WebSocket连接打开时的处理函数
        this.websocket.onmessage = this.onWebSocketMessage; // 收到WebSocket消息时的处理函数
        this.websocket.onclose = this.onWebSocketClose; // WebSocket连接关闭时的处理函数
      },
      closeWebSocket() {
        if (this.websocket) {
          this.websocket.close(); // 关闭WebSocket连接
        }
      },
      /**
       *  WebSocket连接打开后，启动心跳检测
       */
      onWebSocketOpen() {
        console.log("WebSocket connection is open");
        this.startHeartbeat();
        // 发送初始化消息
        const initMessage = {
          type: "sub",
          topic: "/aa/bb/cc/d",
          parameter: {},
          id: "bb",
        };
        this.sendMessage(JSON.stringify(initMessage));
      },
      // 处理从服务器接收的消息
      onWebSocketMessage(event) {
        if (event.data) {
          const message = JSON.parse(event.data);
          this.messageCallbacks.forEach(callback => {
            callback(message);
          });
          //    根据业务来处理数据
        }
      },
      onWebSocketClose() {
        console.log("WebSocket connection is closed");
        this.stopHeartbeat(); // WebSocket连接关闭时，停止心跳检测
        setTimeout(this.setupWebSocket, this.reconnectInterval); // 在一定时间后重连WebSocket
      },
      sendMessage(message) {
        if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
          this.websocket.send(message); // 发送消息到WebSocket服务器
        }
      },
      startHeartbeat() {
        this.heartbeatInterval = setInterval(() => {
          if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
            this.websocket.send("ping"); // 发送心跳消息
          }
        }, 10000); // 每10秒发送一次心跳
      },
      stopHeartbeat() {
        if (this.heartbeatInterval) {
          clearInterval(this.heartbeatInterval); // 停止心跳检测定时器
        }
      },
    },
    beforeDestroy() {
      this.closeWebSocket(); // 在组件销毁前关闭WebSocket连接
    },
    registerMessageCallback(callback){
        this.messageCallbacks.push(callback);
    }
  };
  </script>

  <style lang="scss" scoped>
</style>
  