const base = {
  baseUrl: "https://iwenwiki.com",
  //权限相关
  login: "/user/login",
  logout: "/user/logout",

  //房间相关
  roomList: "/room/list",
  queryRoomInfo: "/room/list/page",
  changeRoomState: "/room/",
  delRoomById: "/room",
  roomInfoById: "/room",

  //入住相关
  checkIn: "/user/checkin",
  checkOut: "/user/checkout",
  queryRecordInfo: "/record/list/page",
  queryRecordByUN: "/record/username",
  queryRecordByToken: "/record/",

  //账单相关
  billByRecordId: "/bill/record",
  excelBill: "/bill/excel",
  excelDetail: "/bill/detail/excel",

  chengpin: "/api/blueberrypai/getChengpinDetails.php",
  localTEST: "/api/getData",



  turnOn: "/api/turn_on",
  turnOff: "/api/turn_off",
  setTemperature: "/api/setTemperature",
  setTemperatureInit: "/api/setTemperature_init",
  setSpeed: "/api/setSpeed",
  queryRoomInfo: "/api/query_room_info",
  updateRooms: "/api/rooms/updateRooms",

  getForm: "/api/form/rep",
  send_cur_temp: "/api/send_current_temp",
  detail: "/api/detail_bill",
  bill: "/api/query_room_bill"
}

export default base;