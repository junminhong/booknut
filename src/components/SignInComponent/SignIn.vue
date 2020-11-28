<template src="./SignIn.html">

</template>

<script>

import Swal from "sweetalert2";
import db from "@/db";


export default {
  name: "SignIn-component",
  data(){
    return{
      user_email: "",
      user_password: "",
      user_email_error_msg: "",
      user_password_error_msg: ""
    }
  },
  methods: {
    signin: function (){
      if (this.user_email == ''){
        Swal.fire({
          icon: 'error',
          title: '登入',
          text: 'email請勿為空！',
        })
      }
      else if (this.user_password == ''){
        Swal.fire({
          icon: 'error',
          title: '登入',
          text: '密碼請勿為空！',
        })
      } else {
        this.user_email_error_msg = ''
        //this.user_password_error_msg = ''
        db.auth().signInWithEmailAndPassword(this.user_email, this.user_password).then(
            data => {
              if (!data.user.emailVerified) {
                Swal.fire(
                    '登入訊息',
                    '請去驗證信件!',
                    'info'
                )
              }else{
                location.href = '/'
              }
              console.log(data.user.emailVerified)
            }).catch(function (error){
              console.log(error)
        })
      }
    }
  }
}
</script>

<style src="./SingIn.css" scoped>

</style>