<template src="./Profile.html">

</template>

<script>

import db from "@/db";

export default {
  name: "Profile",
  props: {
    user: Object,
  },
  data(){
    return{
      user_name:'',
      user_email:'',
      user_real_name: '',
      user_gender: '',
      user_address: '',
      user_birthday: '',
      // 這裡開始進階認證資料
      user_phone: '',
      user_id_number: '',
      // 使用者簡述可有可無
      user_info: '',
      // 社群帳號設定
      user_twitter_website: '',
      user_facebook_website: '',
      user_google_plus_website: '',
      user_linkedin_website: '',
      user_instagram_website: '',
      // 帳號連動設定 暫時不實作
      // 電子錢包與信用卡片
      // 堅果幣錢包的地址
      user_wallet_address: '',
      // 信用卡應該可以設多張但現階段為一張
      user_card_number: '',
      // 隱私權設定 = 通知設定
      collect_user_info: '',
      new_and_old_system_notify: '',
      socail_system_notify: ''
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