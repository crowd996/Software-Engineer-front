import axios from "../utils/requests_wrapper.js"
import path from "./path.js"
import store from "@/store"

const api = {
  // 权限相关

  postLogin(username, password) {
    return axios.post(path.baseUrl + path.login, {
      username: username,
      password: password
    }, {
      headers: { 'content-type': 'application/x-www-form-urlencoded' }
    });
  },
  postLogout() {
    const token = store.getters.getToken;
    return axios.post(path.baseUrl + path.logout, {}, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
  },

  //房间相关
  getRoomList() {
    const token = store.getters.getToken;
    console.log("token:" + token)
    return axios.get(path.baseUrl + path.roomList, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
  },
  getQueryRoomInfo(name, use, page, rows,) {
    const token = store.getters.getToken;
    const params = {};

    if (name !== undefined) params.name = name;
    if (use !== undefined) params.use = use;
    if (page !== undefined) params.page = page;
    if (rows !== undefined) params.rows = rows;

    return axios.get(path.baseUrl + path.queryRoomInfo, {
      headers: { 'Authorization': `Bearer ${token}` },
      params: params
    })
  },
  postChangeRoomState(id, name, use) {
    const token = store.getters.getToken;
    const data = {};

    data.id = id;
    if (name !== undefined) data.name = name;
    if (use !== undefined) data.use = use;

    return axios.post(path.baseUrl + path.changeRoomState, data, {
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${token}`
      }
    })
  },
  deleteRoomById(id) {
    const token = store.getters.getToken;

    return axios.delete(path.baseUrl + path.delRoomById + "/" + id, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
  },
  getRoomInfoById(roomId) {
    const token = store.getters.getToken;
    return axios.delete(path.baseUrl + path.roomInfoById + "/" + roomId, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
  },

  //入住相关
  postCheckIn(roomId, username) {
    const token = store.getters.getToken;
    return axios.post(path.baseUrl + path.checkIn, {
      roomId: roomId,
      userName: username
    }, {
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${token}`
      }
    });
  },
  postCheckOut(id) {
    const token = store.getters.getToken;
    return axios.post(path.baseUrl + path.checkOut, {
      id: id
    }, {
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${token}`
      }
    });
  },
  getQueryRecordInfo(id, roomId, complete, page, rows) {
    const token = store.getters.getToken;
    const params = {};

    if (id !== undefined) params.id = id;
    if (roomId !== undefined) params.roomId = roomId;
    if (complete !== undefined) params.complete = complete;
    if (page !== undefined) params.page = page;
    if (rows !== undefined) params.rows = rows;

    return axios.get(path.baseUrl + path.queryRecordInfo, {
      headers: { 'Authorization': `Bearer ${token}` },
      params: params
    })
  },
  getQueryRecordByUN(userName, complete) {
    const token = store.getters.getToken;
    const params = {};

    if (complete !== undefined) params.complete = complete;

    return axios.get(path.baseUrl + path.queryRecordByUN + '/' + userName, {
      headers: { 'Authorization': `Bearer ${token}` },
      params: params
    })
  },
  getQueryRecordByToken() {
    const token = store.getters.getToken;

    return axios.get(path.baseUrl + path.queryRecordByToken, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
  },
  getQueryRecordByroomId(roomId) {
    const token = store.getters.getToken;
    return axios.get(path.baseUrl + path.recordInfoById + "/" + roomId, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
  },

  //账单相关
  postBillByRecordId(recordId) {
    const token = store.getters.getToken;

    return axios.post(path.baseUrl + path.billByRecordId + '/' + recordId, {}, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
  },
  getExcelBill(billId) {
    const token = store.getters.getToken;

    return axios.get(path.baseUrl + path.excelBill + '/' + billId, {
      responseType: 'blob',
      headers: { 'Authorization': `Bearer ${token}` }
    })
  },
  getExcelDetail(billId) {
    const token = store.getters.getToken;

    return axios.get(path.baseUrl + path.excelDetail + '/' + billId, {
      responseType: 'blob',
      headers: { 'Authorization': `Bearer ${token}` }
    })
  },

  //空调管理员
  getTemperatureBound() {
    const token = store.getters.getToken;

    return axios.get(path.baseUrl + path.checkBound, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
  },
  postChangeTemperatureBound(low, high) {
    const token = store.getters.getToken;

    return axios.post(path.baseUrl + path.changeBound, {
      lowerBound: low,
      upperBound: high
    }, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
  },

  //统计信息
  postRoomStatisticInfo(roomId, roomName) {
    const token = store.getters.getToken;

    return axios.post(path.baseUrl + path.roomStatisticInfo, {
      roomId: roomId,
      roomName: roomName
    }, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
  }
}

export default api;