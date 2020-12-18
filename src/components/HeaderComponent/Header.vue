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
    }]
  },
  methods: {
    hideSignInAndSignUp: function () {
      if (this.user_name.toString().length == 0) {
        this.isSignin = false
      }else if (this.user_name.toString().length != 0){
        this.isSignin = true
        let profile_img = document.getElementById('profile_header_img');
        let user = db.auth().currentUser
        let storageRef_profile_pic = db.storage().ref("profile_pic/" + user.uid + ".jpg")
        storageRef_profile_pic.getDownloadURL().then( result => {
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
          childSnapshot.forEach(()=>{
            this.shop_cart_amount += 1
          })
        });
      });
    }
  }
}
</script>

<style src="./Header.css" scoped>

</style>