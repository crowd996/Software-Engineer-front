import axios from "../utils/requests_wrapper.js"
import path from "./path.js"
import store from "../store"

const api = {
  // 权限相关
  postLogin(username, password) {
    return axios.post(path.login, {
      username: username,
      password: password
    });
  },
  postLogout() {
    const token = store.state.token;
    return axios.post(path.logout, {}, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
  },

  //房间相关
  getRoomList() {
    const token = store.state.token;
    return axios.get(path.roomList, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
  },
  getQueryRoomInfo(name, use, page, rows,) {
    const token = store.state.token;
    const params = {};

    if (name !== undefined) params.name = name;
    if (use !== undefined) params.use = use;
    if (page !== undefined) params.page = page;
    if (rows !== undefined) params.rows = rows;

    return axios.get(path.queryRoomInfo, {
      headers: { 'Authorization': `Bearer ${token}` },
      params: params
    })
  },
  postChangeRoomState(id, name, use) {
    const token = store.state.token;
    const data = {};

    data.id = id;
    if (name !== undefined) data.name = name;
    if (use !== undefined) data.use = use;

    return axios.post(path.changeRoomState, data, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
  },
  deleteRoomById(id) {
    const token = store.state.token;

    return axios.delete(path.delRoomById + "/" + id, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
  },
  getRoomInfoById(roomId) {
    const token = store.state.token;

    return axios.delete(path.roomInfoById + "/" + roomId, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
  },

  //入住相关
  postCheckIn(roomId, username) {
    const token = store.state.token;
    return axios.post(path.checkIn, {
      roomId: roomId,
      userName: username
    }, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
  },
  postCheckOut(id) {
    const token = store.state.token;
    return axios.post(path.checkOut, {
      id: id
    }, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
  },
  getQueryRecordInfo(id, roomId, complete, page, rows) {
    const token = store.state.token;
    const params = {};

    if (id !== undefined) params.id = id;
    if (roomId !== undefined) params.roomId = roomId;
    if (complete !== undefined) params.complete = complete;
    if (page !== undefined) params.page = page;
    if (rows !== undefined) params.rows = rows;

    return axios.get(path.queryRecordInfo, {
      headers: { 'Authorization': `Bearer ${token}` },
      params: params
    })
  },
  getQueryRecordByUN(userName, complete) {
    const token = store.state.token;
    const params = {};

    if (complete !== undefined) params.complete = complete;

    return axios.get(path.queryRecordByUN + '/' + userName, {
      headers: { 'Authorization': `Bearer ${token}` },
      params: params
    })
  },
  getQueryRecordByToken() {
    const token = store.state.token;

    return axios.get(path.queryRecordByToken, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
  },

  //账单相关
  postBillByRecordId(recordId) {
    const token = store.state.token;

    if (complete !== undefined) params.complete = complete;

    return axios.get(path.billByRecordId + '/' + recordId, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
  },
  getExcelBill(billId) {
    const token = store.state.token;

    return axios.get(path.excelBill + '/' + billId, {
      responseType: 'blob',
      headers: { 'Authorization': `Bearer ${token}` }
    })
  },
  getExcelDetail(billId) {
    const token = store.state.token;

    return axios.get(path.excelDetail + '/' + billId, {
      responseType: 'blob',
      headers: { 'Authorization': `Bearer ${token}` }
    })
  },


  getChengpin() {
    return axios.get(path.baseUrl + path.chengpin);
  },
  getData() {
    return axios.get(path.localTEST);
  },


  postTurnOn(data) {
    return axios.post(path.turnOn, data);
    // return axios.post(path.turnOn + '/', data);
  },
  postTurnOff(data) {
    return axios.post(path.turnOff, data);
    // return axios.post(path.turnOff + '/', data);
  },
  postSetTemperature(data) {
    return axios.post(path.setTemperature, data);
    // return axios.post(path.setTemperature + '/', data);
  },
  postSetSpeed(data) {
    return axios.post(path.setSpeed, data);
    // return axios.post(path.setSpeed + '/', data);
  },
  postSetTemperatureInit(data) {
    return axios.post(path.setTemperatureInit, data);
  },
  postUpdateRooms(data) {
    return axios.post(path.updateRooms, data);
  },

  getForm() {
    return axios.get(path.getForm);
  },
  postCurTemperature(data) {
    return axios.post(path.send_cur_temp, data);
  }
}

export default api;