<template src="./Header.html">

</template>

<script>
import db from "@/db";
export default {
  name: "header-component",
  mounted() {
    this.hideSignInAndSignUp()
  },
  data(){
    return {
      isSignin: false,
      is_real_data_user: false,
      shop_cart_amount: 0,
      notify_amount: 0,
      notify: [],
      remove_flag: false,
    }
  },
  props: {
    user_name: String,
    user: Object,
  },
  watch: {
    user_name: [{
      handler: 'hideSignInAndSignUp'
    }],
    user: [{
      handler: 'updateShopCartAmount'
    },{
      handler: 'checkUserNotify'
    }],
  },
  methods: {
    checkUserNotify: function (){
      let user = db.auth().currentUser
      let tutorialsRef = db.database().ref('/users_notify/' + user.uid)
      tutorialsRef.on('value', snapshot => {
        this.notify = []
        this.notify_amount = snapshot.numChildren()
        snapshot.forEach(value =>{
          this.notify.push(value)
        })
      });
      // db.database().ref('users_notify/' + this.user.id).get().then(result=>{
      //   console.log(result.key)
      //   result.forEach(value=>{
      //     console.log(value)
      //   })
      // })
    },
    gotoOrder: function (order_id, status){
      if (!this.remove_flag){
        console.log(order_id)
        location.href = 'transactionprocess?status=' + status + '&order_id=' + order_id
      }
      this.remove_flag = false
    },
    removeNotify: function (notify_id){
      console.log(notify_id)
      this.remove_flag = true
      db.database().ref('/users_notify/' + this.user.uid + '/' + notify_id).remove()
    },
    hideSignInAndSignUp: function () {
      if (this.user === undefined || this.user === null || this.user === '') {
        this.isSignin = false
      }else if(this.user.toString().length > 0){
        this.isSignin = true
        let profile_img = document.getElementById('profile_header_img');
        let user = this.user
        let storageRef_profile_pic = db.storage().ref("profile_pic/" + user.uid + ".jpg")
        storageRef_profile_pic.getDownloadURL().then( result => {
          console.log(result)
          profile_img.src = result
          profile_img.onload = function() {
            URL.revokeObjectURL(profile_img.src)
          }
        }).catch(error=>{
          console.log(error)
        })
        db.firestore().collection("users").doc(user.uid).get().then(result=>{
          let user_id_number = result.data().user_id_number
          let user_phone = user.phoneNumber
          if (user_id_number !== '' && user_id_number !== undefined && user_phone !== '' && user_phone !== undefined){
            this.is_real_data_user = true
          }
        })
      }
    },
    userSignout: function (){
      this.isSignin = false
      this.is_real_data_user = false
      db.auth().signOut().then(()=>{
        location.href = 'signin'
      })
    },
    updateShopCartAmount: function (){
      let tutorialsRef = db.database().ref("/users/" + this.user.uid + '/shop_cart/');
      tutorialsRef.on('value', snapshot => {
        this.shop_cart_amount = 0
        snapshot.forEach(childSnapshot => {
          childSnapshot.forEach(result=>{
            result.forEach(()=>{
              this.shop_cart_amount += 1
            })
          })
        });
      });
    }
  }
}
</script>

<style src="./Header.css" scoped>

</style>