<template src="./QRCodeScanner.html">

</template>

<script>
import {QrStream} from 'vue3-qr-reader';
import Swal from "sweetalert2";
import db from "@/db";
import {uid} from "uid";
let dateFormat = require("dateformat")
export default {
  name: "QRCodeScanner",
  components: {
    QrStream
  },
  props:{
    user: Object
  },
  data () {
    return {
      isValid: undefined,
      camera: 'auto',
      result: null,
      order_total_money: '',
      seller_id: '',
      seller_wallet: '',
      owner_wallet: '',
      owner_money: '',
      order_status: ''
      // wallet_address_from: 'system',
      // wallet_owner_from: 'system',
      // wallet_address_to: this.nut_wallet_address,
      // wallet_owner_to: this.user.uid,
      // record_money: this.want_nut_count,
      // record_date: date,
      // record_status: 'demo', // order, demo
      // record_order_id: ''
    }
  },

  computed: {
    validationPending () {
      return this.isValid === undefined
          && this.camera === 'off'
    },

    validationSuccess () {
      return this.isValid === true
    },

    validationFailure () {
      return this.isValid === false
    }
  },

  methods: {

    onInit (promise) {
      promise
          .catch(console.error)
          .then(this.resetValidationState)
    },

    resetValidationState () {
      this.isValid = undefined
    },
    getOrderMoney: function (){
      this.order_total_money = parseInt(0)
      db.firestore().collection("users").doc(this.user.uid).collection("order_list").doc(this.result).collection("shop_cart").get().then(result=>{
        result.forEach(value=>{
          this.order_total_money += parseInt(value.data().order_book_money)
        })
      }).then(()=>{
          db.firestore().collection("users").doc(this.user.uid).collection("order_list").doc(this.result).get().then(result=>{
            if (result.data().have_fare_money){
              this.order_total_money += parseInt(60)
            }
            this.seller_id = result.data().seller_id
            this.order_status = result.data().order_status
            db.firestore().collection("users").doc(this.seller_id).get().then(result=>{
              this.seller_wallet = result.data().user_bunt_wallet_address
            }).then(()=>{
              db.firestore().collection("users").doc(this.user.uid).get().then(result=>{
                this.owner_wallet =  result.data().user_bunt_wallet_address
                this.owner_money = result.data().user_bunt_wallet_money
              })
            })
          }).then(()=>{
            if (this.order_status === 'wait_for_buyer'){
              let swal_msg = "確定要支付『 $ " + this.order_total_money + " 』嗎？"
              Swal.fire({
                title: '堅果幣付款訊息',
                text: swal_msg,
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: '確定',
                cancelButtonText: '取消'}).then(result=>{
                if (result.isConfirmed){
                  if (parseInt(this.owner_money ) >= parseInt(this.order_total_money)){
                    this.checkoutOrder()
                  }else{
                    Swal.fire(
                        '堅果幣付款訊息',
                        '錢包餘額不足',
                        'error'
                    )
                  }
                }else{
                  this.timeout(2000)
                  this.turnCameraOn()
                }
              })
            } else{
              Swal.fire(
                  '堅果幣付款訊息',
                  '已經付過款了',
                  'error'
              )
            }
          })
      })
    },
    checkoutOrder: function (){
      db.firestore().collection("users").doc(this.user.uid).collection("order_list").doc(this.result).update({
        order_status: 'wait_for_seller_send',
        is_reload: false
      }).then(()=>{
        db.firestore().collection("users").doc(this.seller_id).collection("seller_order_list").doc(this.result).update({
          order_status: 'wait_for_seller_send'
        })
        let date = dateFormat(new Date(), "yyyy-mm-dd HH:mm:ss")
        db.firestore().collection("users").doc(this.user.uid).collection("wallet_record").doc(uid(10)).set({
          wallet_address_from: this.owner_wallet,
          wallet_owner_from: this.user.uid,
          wallet_address_to: this.seller_wallet,
          wallet_owner_to: this.seller_id,
          record_money: this.order_total_money,
          record_date: date,
          record_status: 'order', // order, demo
          record_ok: 'not_ok',
          record_order_id: this.result
        }).then(()=>{
          db.firestore().collection("users").doc( this.seller_id).collection("wallet_record").doc(uid(10)).set({
            wallet_address_from: this.owner_wallet,
            wallet_owner_from: this.user.uid,
            wallet_address_to: this.seller_wallet,
            wallet_owner_to: this.seller_id,
            record_money: this.order_total_money,
            record_date: date,
            record_status: 'order', // order, demo
            record_ok: 'not_ok',
            record_order_id: this.result
          })
        }).then(()=>{
          Swal.fire(
              '堅果幣付款訊息',
              '付款成功',
              'success'
          ).then(()=>{
            let date = dateFormat(new Date(), "yyyy-mm-dd HH:mm:ss")
            console.log(this.seller_id)
            db.database().ref('users_notify/' + this.seller_id  + '/' + uid(10)).update({
              msg: '訂單已付款，請盡快前往出貨',
              msg_date: date,
              order_id: this.result,
              status: 'sell'
            }).then(()=>{
              location.href = 'nutwallet'
            })
          })
        })
      })
    },
    async onDecode (content) {
      this.result = content
      this.turnCameraOff()
      // Swal.fire(
      //     'QRCODE訊息',
      //     this.result,
      //     'info'
      // ).then(()=>{
      //
      // })
      this.getOrderMoney()
      // pretend it's taking really long
      // await this.timeout(3000)
      // this.isValid = content.startsWith('http')

      // some more delay, so users have time to read the message
      // await this.timeout(2000)
      //
      // this.turnCameraOn()
    },

    turnCameraOn () {
      this.camera = 'auto'
    },

    turnCameraOff () {
      this.camera = 'off'
    },

    timeout (ms) {
      return new Promise(resolve => {
        window.setTimeout(resolve, ms)
      })
    }
  }
}
</script>

<style src="./QRCodeScanner.css" scoped>

</style>