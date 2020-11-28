<template>
  <header-component :user_name="user_name" />
  <router-view/>
</template>

<script>
import HeaderComponent from '@/components/HeaderComponent/index'
import db from "@/db";
import Swal from "sweetalert2";

export default {
  name: 'app',
  components:{
    HeaderComponent
  },
  mounted() {
    this.checkUserStatus()
  },
  data(){
    return{
      user_cer: db.auth().currentUser,
      user_uid: '',
      user_name: ''
    }
  },
  methods: {
    checkUserStatus: function (){
      db.auth().onAuthStateChanged(user =>{
        if (user != null){
          console.log(user)
          this.user_uid = user.uid
          db.firestore().collection('users').doc(this.user_uid).get().then(doc=>{
            this.user_name = doc.data().user_name
          })
        }else{
          this.user_uid = ''
          this.user_name =  ''
        }
      })
      db.auth().getRedirectResult().then(function(result) {
        if (result.credential) {
          console.log(result.credential.accessToken)
          console.log(result.user)
          Swal.fire("成功")
        }
      }).catch(function(error) {
        console.log(error)
        Swal.fire("error")
      });
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
