<template>
  <header-component :user_name="user_name"/>
  <router-view :user="user"/>
</template>

<script>
import HeaderComponent from '@/components/HeaderComponent/Header'
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
      user_name: '',
      user: '',
    }
  },
  methods: {
    checkUserStatus: function (){
      db.auth().onAuthStateChanged(user =>{
        if (user != null && user.emailVerified){
          this.user_uid = user.uid
          this.user = user
          db.firestore().collection('users').doc(this.user_uid).get().then(doc=>{
            if (doc.data().user_name.toString().length != 0){
              this.user_name = doc.data().user_name
            }
          }).catch( error => {
            console.log(error)
            db.firestore().collection('users').doc(this.user_uid).set({
              user_name: 'booknut',
              accept_user: true
            }).then(()=>{
              location.href = '/'
            })
          })
        }else{
          this.user_uid = ''
          this.user_name =  ''
        }
      })
      db.auth().getRedirectResult().then(function(result) {
        if (result.credential) {
          // Swal.fire("成功")
          location.href = '/'
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
