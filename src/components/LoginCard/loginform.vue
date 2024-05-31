<template>
  <div style="margin: 20px"></div>
  <el-form
    :label-position="labelPosition"
    label-width="100px"
    :model="formLabelAlign"
    style="max-width: 460px">

    <el-form-item label="Username">
      <el-input v-model="formLabelAlign.username" type="text" class="custom-input"/>
    </el-form-item>

    <el-form-item label="Password">
      <el-input v-model="formLabelAlign.password" type="password" class="custom-input"/>
    </el-form-item>

    <el-form-item label="Verify">
      <div style="display: flex">
        <el-input v-model="formLabelAlign.verify_code" style="width: 100px" type="text" class="custom-input"/>
      </div>
      <div style="flex: 1; margin-left: 30px">
        <ValidCode style="height: 32px; width: 90px" @update:value="getCode" ref="ValidCodeRef"/>
      </div>
    </el-form-item>

    <el-form-item>
      <el-button @click="onSubmit" class="submit-botton">Login</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import ValidCode from '../ValidCode/validcode.vue';
import api from '../../api';
import { ElMessage } from 'element-plus';
import {h} from 'vue';

export default {
  name: 'LoginForm',
  components: {
    ValidCode
  },
  data() {
    return {
      labelPosition: 'right',
      formLabelAlign: {
        username: '',
        password: '',
        verify_code: '',
      },
      code_value: ''
    }
  },
  methods: {
    onSubmit() {
      console.log('validating...');
      // first validate the verify code
      const code_submit = this.formLabelAlign.verify_code.toLowerCase();
      const code_valid = this.code_value.toLowerCase();
      if (code_submit != code_valid) {
        console.log('verify code error');
        alert("验证码错误，请重新输入！");
        this.$refs.ValidCodeRef.refreshCode();
        return;
      }
      else {
        api.postLogin(this.formLabelAlign.username,this.formLabelAlign.password)
        .then(res => {
          console.log(res);
          if (res.status == 200) {
            console.log('login success');
            console.log(res.data.token)
            let role = null;
            if (identity == '0') {
              // admin: 空调管理员
              role = 'admin';
            }
            else if (identity == '1') {
              // reception: 前台
              role = 'reception';
            }
            else if (identity == '2') {
              // manager: 酒店经理
              role = 'manager';
            }
            this.$store.commit('setLogin', role,res.data.token);
            this.redirectUser(role);
          }
          else {
            console.log('login failed');
            ElMessage.error("用户名或密码错误！");
            this.$refs.ValidCodeRef.refreshCode();
            return;
          }
        }).catch(err => {
          console.log(err);
        });
        let role = null;
          if (this.formLabelAlign.username == 'admin') {
            // admin: 空调管理员
            role = 'admin';
          }
          else if (this.formLabelAlign.username == 'reception') {
            // reception: 前台
            role = 'reception';
          }
          else if (this.formLabelAlign.username == 'manager') {
            // manager: 酒店经理
            role = 'manager';
          }
          this.$store.commit('setLogin', role);
          this.redirectUser(role);
      }
    },
    getCode(code) {
      // console.log(code);
      this.code_value = code;
    },
    redirectUser(role) {
      if(role == 'admin') {
        this.$router.push('/ac');
      }
      else if(role == 'reception') {
        this.$router.push('/reception');
      }
      else if(role == 'manager') {
        this.$router.push('/manager');
      }
      else if(role == 'customer'){
        this.$router.push('/customer')
      }
    }
  }
}
</script>

<style scoped>
.submit-botton{
  width: 100%;
  margin-top: 0px;
  background-color: black;
  color: white;
  border: none;
  text-align: center;
  font-size: 17px;
  font-weight: 600;
  font-family: 'Arial', sans-serif;
}
:deep(.el-form-item__label){
  font-size: 15px; /* 调整字体大小 */
  color: black; /* 修改字体颜色 */
  font-weight: 600; /* 修改字体粗细 */
  font-family: 'Arial', sans-serif; /* 修改字体 */
}

:deep(.custom-input .el-input__wrapper) {
  border: none; /* 去掉边框 */
  border-bottom: 2px solid gray; /* 添加底部边框 */
  border-radius: 0; /* 去掉圆角 */
  box-shadow: none; /* 去掉阴影 */
  background-color: transparent;
}

:deep(.custom-input .el-input__wrapper:hover) {
  border-bottom: 2px solid black; /* 悬停时底部边框颜色 */
}
</style>