<template src="./Profile.html">

</template>

<script>

import db from "@/db";
import Swal from 'sweetalert2'
const axios = require('axios');
const FormData = require('form-data');
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
      user_new_password: '',
      user_new_confirm_password: '',
      user_old_password: '',
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
      socail_system_notify: '',
      type: 'general'
    }
  },
  mounted() {
  },
  watch: {
    user: [{
      handler: 'checkUserAccountStatus'
    }]
  },
  methods: {
    checkUserAccountStatus: function () {
      this.user_email = this.user.email
      db.firestore().collection("users").doc(this.user.uid).get().then(user=>{
        this.user_name = user.data().user_name
      })
      let profile_img = document.getElementById('profile_img');
      let storageRef_profile_pic = db.storage().ref("profile_pic/" + this.user.uid + ".jpg")
      storageRef_profile_pic.getDownloadURL().then( result => {
        profile_img.src = result
      })
      profile_img.onload = function() {
        URL.revokeObjectURL(profile_img.src)
      }
      // db.auth().onAuthStateChanged(user =>{
      //   if (user != null){
      //     console.log(user)
      //     this.user_uid = user.uid
      //     db.firestore().collection('users').doc(this.user_uid).get().then(doc=>{
      //       if (doc.data().user_name.toString().length != 0){
      //         this.user_email = user.email
      //         this.user_name = doc.data().user_name.toString()
      //       }
      //     }).catch( error => {
      //       console.log(error)
      //       console.log(this.user_uid)
      //       db.firestore().collection('users').doc(this.user_uid).set({
      //         user_name: 'booknut'
      //       })
      //     })
      //   }else{
      //     this.user_uid = ''
      //     this.user_name =  ''
      //   }
      // })
    },
    changePasswordType: function (){
      this.type = "change_password"
    },
    generalType: function (){
      this.type = "general"
    },
    realVerificationType: function (){
      this.type = "real_verification"
      let user = db.auth().currentUser;
      console.log(user)
      db.firestore().collection("users").doc(user.uid).get().then(resault => {
        if(resault.data().user_real_name === undefined){
          console.log('沒東西')
        }else{
          this.user_real_name = resault.data().user_real_name
          this.user_birthday = resault.data().user_birthday
          this.user_address = resault.data().user_address
          this.user_gender = resault.data().user_gender
        }
      })
    },
    convertBlobImg: function (file){
      let blob = file.target.files[0]
      const reader = new FileReader()
      reader.readAsDataURL(blob)
      reader.onload = ()=>{
        let data = new FormData();
        data.append('base64Image', String(reader.result));
        data.append('isOverlayRequired', 'true');
        data.append('OCREngine', '2');
        data.append('filetype', 'JPG');
        data.append('scale', 'true');
        this.ocrIDNumber(data)
      }
    },
    ocrIDNumber: function (data){
      let config = {
        method: 'post',
        url: 'https://api.ocr.space/parse/image',
        headers: {
          'apikey': 'f3002f7ac988957',
        },
        data : data
      };
      axios(config)
          .then( response => {
            console.log(response.data["ParsedResults"])
            let lines = response.data["ParsedResults"][0]["TextOverlay"]["Lines"]
            console.log(lines[lines.length - 1]["LineText"])
            this.user_id_number = lines[lines.length - 1]["LineText"]
          })
          .catch(function (error) {
            console.log(error);
          });
    },
    uploadProfilePic: function (file){
      console.log(file.target.files)
      let profile_img = document.getElementById('profile_img');
      profile_img.src = URL.createObjectURL(file.target.files[0]);
      profile_img.onload = function() {
        URL.revokeObjectURL(profile_img.src)
        profile_img.hidden = false
      }
      let storageRef_profile_pic = db.storage().ref("profile_pic/" + this.user.uid + ".jpg")
      storageRef_profile_pic.put(file.target.files[0])
    },
    removeProfilePic: function (){
      let storageRef_profile_pic = db.storage().ref("profile_pic/" + this.user.uid + ".jpg")
      storageRef_profile_pic.delete().then(function() {
        location.href = 'profile'
      }).catch(function(error) {
        console.log(error)
      });
    },
    reauthenticate: function () {
      let user_data = db.auth().currentUser;
      let cred = db.auth.EmailAuthProvider.credential(this.user_email, this.user_old_password);
      return user_data.reauthenticateWithCredential(cred)
    },
    saveProfile: function (){
      switch (this.type){
        case "change_password":
          if (this.user_new_password === this.user_new_confirm_password){
            let user_new_confirm_password = this.user_new_confirm_password
            this.reauthenticate().then(() => {
              let user = db.auth().currentUser;
              user.updatePassword(user_new_confirm_password).then(() => {
                Swal.fire(
                    '變更密碼訊息',
                    "已成功變更密碼",
                    'success'
                )
                console.log("Password updated!");
              }).catch((error) => {
                Swal.fire(
                  '變更密碼訊息',
                  error.message,
                  'error'
                )
                console.log(error.message)
              });
            }).catch((error) => {
              Swal.fire(
                '變更密碼訊息',
                error.message,
                'error'
              )
              console.log(error.message)
            });
          }
          this.user_old_password = ''
          this.user_new_confirm_password = ''
          this.user_new_password = ''
          break
        case "general":
          db.firestore().collection("users").doc(this.user.uid).update({
            user_name: this.user_name,
          }).then(() => {
            Swal.fire(
                '變更暱稱訊息',
                "已成功變更暱稱",
                'success'
            ).then(()=>{
              location.href = 'profile'
            })
          });
          break
      }
    }
  }
}
</script>

<style src="./Profile.css" scoped>

</style>