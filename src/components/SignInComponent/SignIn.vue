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
      user_password_error_msg: "",
      user: ''
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
              this.user = data
              console.log(data.user.emailVerified)
            }).catch(function (error){
              console.log(error)
          Swal.fire(
              '登入訊息',
              '登入失敗！',
              'error'
          )
        })
      }
    },
    signinWithGoogle: function (){
      const googleProvider = new db.auth.GoogleAuthProvider
      db.auth().signInWithRedirect(googleProvider).then(
          result => {
            console.log(result)
            location.href = '/'
          }
      )
    },
    forgetPassword: function (){
      if (this.user_email === ''){
        Swal.fire(
            "忘記密碼訊息",
            "電子信箱欄位請勿為空",
            "info"
        )
      }else{
        db.auth().sendPasswordResetEmail(this.user_email)
      }
    },
    resendEmailVerified: function (){
      if (this.user_email === '' && this.user_password === ''){
        Swal.fire(
            "重發驗證信訊息",
            "電子信箱欄位或者密碼欄位請勿為空",
            "info"
        )
      }else{
        db.auth().signInWithEmailAndPassword(this.user_email, this.user_password).then(
            data => {
              data.user.sendEmailVerification().then(()=>{
                Swal.fire(
                    "重發驗證信訊息",
                    "驗證信已重發成功，請儘速至信箱查看",
                    "success"
                )
              })
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