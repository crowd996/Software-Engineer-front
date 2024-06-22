const base = {
  baseUrl: "http://43.143.173.140/api",
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
  recordInfoById: "/record/room",

  //账单相关
  billByRecordId: "/bill/record",
  excelBill: "/bill/excel",
  excelDetail: "/bill/detail/excel",

  //空调管理员
  checkBound: "/temperature/bound",
  changeBound: "/temperature/bound",

  //统计信息
  roomStatisticInfo: "/statisticInfo/room",
}

export default base;