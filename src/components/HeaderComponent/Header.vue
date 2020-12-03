<template src="Header.html">

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
      isSignin: false
    }
  },
  props: {
    user_name: String,
  },
  watch: {
    user_name: [{
      handler: 'hideSignInAndSignUp'
    }]
  },
  methods: {
     hideSignInAndSignUp: function () {
      if (this.user_name.toString().length == 0) {
        this.isSignin = false
      }else if (this.user_name.toString().length != 0){
        this.isSignin = true
      }
    },
    userSignout: function (){
      this.isSignin = false
      db.auth().signOut()
    }
  }
}
</script>

<style src="Header.css" scoped>

</style>