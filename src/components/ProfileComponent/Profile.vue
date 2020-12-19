<template src="./Profile.html">

</template>

<script>

import db from "@/db";
import Swal from 'sweetalert2'
const axios = require('axios');
const FormData = require('form-data');
import { uid } from 'uid'
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
      user_real_name_error_msg: '',
      user_gender: '0',
      user_gender_error_msg: '',
      user_address: '',
      user_address_error_msg: '',
      user_birthday: '',
      user_birthday_error_msg: '',
      user_new_password: '',
      user_new_confirm_password: '',
      user_old_password: '',
      // 這裡開始進階認證資料
      user_phone: '',
      user_id_number: '',
      user_id_number_error_msg: '',
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
      user_bunt_wallet_address: '',
      // 信用卡應該可以設多張但現階段為一張
      user_card_number: '',
      // 隱私權設定 = 通知設定
      accept_user: '',
      new_and_old_system_notify: '',
      social_system_notify: '',
      type: 'general',
      user_id_number_is_ok: false,
      verification_code: '',
      send_sms_msg: '寄送驗證碼',
      resend_sms_msg_count: 60,
      can_resend_sms_btn: false,
      id_send_sms: true,
      can_create_user_real_data: true,
      is_have_user_phone_number: false,
      is_have_user_real_data: false
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
      console.log(this.user.email)
      this.user_email = this.user.email
      this.user_phone = db.auth().currentUser.phoneNumber
      db.firestore().collection("users").doc(this.user.uid).get().then(user=>{
        this.user_name = user.data().user_name
        this.user_twitter_website = user.data().user_twitter_website
        this.user_facebook_website = user.data().user_facebook_website
        this.user_google_plus_website = user.data().user_google_plus_website
        this.user_linkedin_website = user.data().user_linkedin_website
        this.user_instagram_website = user.data().user_instagram_website
        this.user_bunt_wallet_address = user.data().user_bunt_wallet_address
        this.accept_user = user.data().accept_user
      })
      let profile_img = document.getElementById('profile_img');
      let storageRef_profile_pic = db.storage().ref("profile_pic/" + this.user.uid + ".jpg")
      storageRef_profile_pic.getDownloadURL().then( result => {
        profile_img.src = result
        profile_img.onload = function() {
          URL.revokeObjectURL(profile_img.src)
        }
      }).catch(error => {
        console.log(error)
      })
      window.recaptchaVerifier = new db.auth.RecaptchaVerifier('send_sms', {
        'size': 'invisible',
        'callback': function(response) {
          console.log(response)
        }
      })
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
    socialAccountType: function (){
      this.type = "socialist"
    },
    privacyType: function (){
      this.type = "privacy"
    },
    sendVerificationPhone: function (){
      if (this.user_phone === ''){
        Swal.fire(
            '手機認證訊息',
            '手機號碼請勿為空',
            'error'
        )
      }else{
        if (this.send_sms_msg === '寄送驗證碼'){
          console.log('寄送驗證碼')
          db.auth().useDeviceLanguage();
          let appVerifier = window.recaptchaVerifier
          let taiwan_phone_number = '+886' + this.user_phone.slice(1, 10)
          console.log(taiwan_phone_number)
          db.auth().currentUser.linkWithPhoneNumber(taiwan_phone_number, appVerifier)
              .then(confirmationResult => {
                // SMS sent. Prompt user to type the code from the message, then sign the
                // user in with confirmationResult.confirm(code).
                console.log(confirmationResult)
                window.confirmationResult = confirmationResult;
                this.timer = setInterval(this.SmsTimeOut, 1000);
                this.can_resend_sms_btn = true
                this.id_send_sms = false
              }).catch( error => {
            console.log(error)
            Swal.fire(
                '手機認證訊息',
                '手機號碼輸入錯誤',
                'error'
            )
            this.resetSms()
          })
        }else{
          console.log('沒有寄發')
        }
      }
    },
    resetSms: function (){
      clearInterval(this.timer);
      this.can_resend_sms_btn = false
      this.id_send_sms = true
      this.resend_sms_msg_count = 60
      this.send_sms_msg = '寄送驗證碼'
    },
    SmsTimeOut:function (){
      console.log(this.can_resend_sms_btn)
      this.send_sms_msg = '已發送(' + this.resend_sms_msg_count + ')秒'
      this.resend_sms_msg_count--
      if (this.resend_sms_msg_count === 0){
        this.resetSms()
      }
    },
    verificationPhone: function (){
      if(this.verification_code === ''){
        Swal.fire(
            '手機認證訊息',
            '驗證碼請勿為空',
            'error'
        )
      }else{
        window.confirmationResult.confirm(this.verification_code).then(result => {
          // User signed in successfully.
          console.log(result)
          Swal.fire(
              '手機認證訊息',
              '手機認證成功，感謝您的配合',
              'success'
          )
          this.is_have_user_phone_number = true
          this.verification_code = ''
          this.resetSms()
          // ...
        }).catch(error => {
          // User couldn't sign in (bad verification code?)
          // ...
          console.log(error)
          Swal.fire(
              '手機認證訊息',
              '手機認證失敗，手機號碼可能被使用過了哦',
              'error'
          )
          this.resetSms()
        });
      }
    },
    realVerificationType: function (){
      this.type = "real_verification"
      let user = db.auth().currentUser;
      console.log(this.user.phoneNumber)
      if (this.user.phoneNumber !== '' && this.user.phoneNumber !== null){
        let taiwan_phone_number = '0' + this.user.phoneNumber.slice(4, 14)
        this.user_phone = taiwan_phone_number
        this.is_have_user_phone_number = true
      }
      db.firestore().collection("users").doc(user.uid).get().then(resault => {
        if(resault.data().user_real_name === undefined){
          this.can_create_user_real_data = true
        }else{
          this.user_real_name = resault.data().user_real_name
          this.user_birthday = resault.data().user_birthday
          this.user_address = resault.data().user_address
          this.user_gender = resault.data().user_gender
          this.user_id_number = resault.data().user_id_number
          this.can_create_user_real_data = false
          this.user_id_number_is_ok = true
          this.is_have_user_real_data = true
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
      console.log("convert")
    },
    ocrIDNumber: function (data){
      console.log(data)
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
            let lines = response.data["ParsedResults"][0]["TextOverlay"]["Lines"]
            lines = lines[lines.length - 1]["Words"]
            this.user_id_number = lines[lines.length - 1]["WordText"]
            console.log(response)
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
      Swal.fire({
        title: '儲存設定訊息',
        text: "確定要儲存設定嗎？",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '確定',
        cancelButtonText: '取消'}).then(result=>{
          if(result.isConfirmed){
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
                })
                break
              case "socialist":
                db.firestore().collection("users").doc(this.user.uid).update({
                  user_twitter_website: this.user_twitter_website,
                  user_facebook_website: this.user_facebook_website,
                  user_google_plus_website: this.user_google_plus_website,
                  user_linkedin_website: this.user_linkedin_website,
                  user_instagram_website: this.user_instagram_website,
                }).then(() => {
                  Swal.fire(
                      '社群帳號設定訊息',
                      "社群帳號已設定成功",
                      'success'
                  )
                }).catch(()=>{
                  Swal.fire(
                      '社群帳號設定訊息',
                      "社群帳號設定失敗",
                      'error'
                  )
                })
                break
              case "real_verification":
                this.can_create_user_real_data = true
                if (this.user_real_name === ''){
                  this.user_real_name_error_msg = '真實姓名請勿為空'
                  this.can_create_user_real_data = false
                }
                if (this.user_gender === ''){
                  this.user_gender_error_msg = '性別請勿為空'
                  this.can_create_user_real_data = false
                }
                if (this.user_birthday === ''){
                  this.user_birthday_error_msg = '生日請勿為空'
                  this.can_create_user_real_data = false
                }
                if (this.user_address === ''){
                  this.user_address_error_msg = '地址請勿為空'
                  this.can_create_user_real_data = false
                }
                if (this.user_id_number === ''){
                  this.user_id_number_error_msg = '請上傳身份證驗證'
                  this.can_create_user_real_data = false
                }
                if (this.can_create_user_real_data){
                  console.log(this.user.uid)
                  db.firestore().collection("users").doc(this.user.uid).update({
                    user_real_name: this.user_real_name,
                    user_gender: this.user_gender,
                    user_birthday: this.user_birthday,
                    user_address: this.user_address,
                    user_id_number: this.user_id_number,
                    user_bunt_wallet_address: uid(128),
                    user_bunt_wallet_money: 0
                  }).then(() => {
                    Swal.fire(
                        '進階認證訊息',
                        "進階認證已驗證成功",
                        'success'
                    )
                    this.is_have_user_real_data = true
                    this.user_id_number_is_ok = true
                    this.user_real_name_error_msg = ''
                    this.user_gender_error_msg = ''
                    this.user_birthday_error_msg = ''
                    this.user_address_error_msg = ''
                  }).catch(()=>{
                    Swal.fire(
                        '進階認證訊息',
                        "進階認證驗證失敗",
                        'error'
                    )
                  })
                }
                break
              case "privacy":
                db.firestore().collection("users").doc(this.user.uid).update({
                  accept_user: this.accept_user,
                }).then(()=>{
                  Swal.fire("儲存設定訊息", "儲存設定成功", "success")
                })
                break
            }
          }
      })

    },
    removePhoneNumber: function (){
      Swal.fire({
        title: '解除綁定訊息',
        text: "確定要移除手機綁定嗎？",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '移除',
        cancelButtonText: '取消'
      }).then(result=> {
        if (result.isConfirmed){
          if (this.user_phone === '') {
            Swal.fire(
                "解除綁定訊息",
                "尚未綁定任何手機",
                "info"
            )
          } else {
            let phone_provider = db.auth.PhoneAuthProvider.PROVIDER_ID
            db.auth().currentUser.unlink(phone_provider).then(result => {
              console.log(result)
              Swal.fire(
                  "解除綁定訊息",
                  "手機綁定已解除",
                  "success"
              )
              this.is_have_user_phone_number = false
              this.user_phone = ''
            })
          }
        }
      })
    }
  }
}
</script>

<style src="./Profile.css" scoped>

</style>