<template src="./Profile.html">

</template>

<script>

import db from "@/db";

export default {
  name: "Profile",
  data(){
    return{
      user_name:'',
      user_email:''
    }
  },
  mounted() {
    this.checkUserAccountStatus()
  },
  methods: {
    checkUserAccountStatus: function () {
      db.auth().onAuthStateChanged(user =>{
        if (user != null){
          console.log(user)
          this.user_uid = user.uid
          db.firestore().collection('users').doc(this.user_uid).get().then(doc=>{
            if (doc.data().user_name.toString().length != 0){
              this.user_email = user.email
              this.user_name = doc.data().user_name.toString()
            }
          }).catch( error => {
            console.log(error)
            console.log(this.user_uid)
            db.firestore().collection('users').doc(this.user_uid).set({
              user_name: 'booknut'
            })
          })
        }else{
          this.user_uid = ''
          this.user_name =  ''
        }
      })
    }
  }
}
</script>

<style src="./Profile.css" scoped>

</style>