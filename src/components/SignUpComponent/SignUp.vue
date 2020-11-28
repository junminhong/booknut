<template src="./SignUp.html">

</template>

<script>
import db from '../../db'
import Swal from 'sweetalert2'

// let usersRef = db.firestore().ref("users")
let userDoc = db.firestore().collection('users')

export default {
  name: 'signup-component',
  // firebase: {
  //   users: usersRef
  // },
  firestore:{
    persons: userDoc
  },
  data() {
    return {
      accept_user: false,
      user_name: "",
      user_email: "",
      user_password: "",
      user_confirm_password: "",
      user_name_error_msg: "",
      isCanCreateAccount: false,
    };
  },
  methods:{
    addUser: function() {
      // usersRef.push("asd")
      userDoc.add({
        name: "asd",
        age: "asd"
      })
    },
    testAuth: function (){
      // db.auth().createUserWithEmailAndPassword("cbj25726@bcaoo.com", "cbj25726")
      const googleProvider = new db.auth.GoogleAuthProvider
      console.log(googleProvider)
      db.auth().signInWithRedirect(googleProvider).then(
          ()=>{
            return db.auth().getRedirectResult()
          }
      ).then(
          value => {
            console.log(db.auth().currentUser)
            console.log(value)
          })
    },
    testLogin: function (){
      if (this.user_name == '')
        Swal.fire()
      else
        db.auth().signInWithEmailAndPassword("cbj25726@bcaoo.com", "cbj25726").then(
            data => {
              Swal.fire(
                  'Good job!',
                  'You clicked the button!',
                  'success'
              )
              console.log(data.user.emailVerified)
        })
    },
    signup: function (){
      this.isCanCreateAccount = false
      if (this.user_password == this.user_confirm_password){
        this.isCanCreateAccount = true
      }else{
        this.isCanCreateAccount = false
        Swal.fire({
          icon: 'error',
          title: '註冊訊息',
          text: '密碼輸入不正確！',
        })
      }
      if(this.isCanCreateAccount){
        db.auth().createUserWithEmailAndPassword(this.user_email, this.user_password).then(
            result => {
              console.log(result)
              Swal.fire({
                icon: 'info',
                title: '註冊訊息',
                text: '註冊成功，請至信箱驗證，否則無法登入！'
              })
              result.user.sendEmailVerification()
              db.firestore().collection('users').doc(result.user.uid).set({
                user_name: this.user_name
              })
            }
        ).catch(function (error) {
              if(error.toString() == "Error: The email address is already in use by another account."){
                Swal.fire({
                  icon: 'error',
                  title: '註冊訊息',
                  text: '此信箱已被註冊過！',
                })
              }
            }
        )
      }
    }
  }
}
</script>

<style src="./SignUp.css" scoped>

</style>