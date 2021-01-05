<template src="./NutWallet.html">

</template>

<script>
import db from "@/db";
import VueQrcode from "vue3-qrcode";
import Swal from "sweetalert2";
import { uid } from 'uid'
let dateFormat = require("dateformat")
export default {
  name: "NutWallet",
  data(){
    return{
      nut_wallet_address: '',
      nut_wallet_money: '',
      nut_wallet_status: 'block',
      want_nut_count: ''
    }
  },
  components: {
    VueQrcode,
  },
  props:{
    user: Object
  },
  mounted() {
    this.showUserWalletStatus()
  },
  methods: {
    showUserWalletStatus: function (){
      if (this.user.phoneNumber !== undefined && this.user.phoneNumber !== null && this.user.phoneNumber !== ''){
        this.nut_wallet_status = 'ok'
      }
      db.firestore().collection("users").doc(this.user.uid).get().then(result=>{
        this.nut_wallet_address = result.data().user_bunt_wallet_address
        this.nut_wallet_money = result.data().user_bunt_wallet_money
      })
    },
    giveNutMoneyToWallet: function (){
      if (this.nut_wallet_status !== 'block'){
        if (this.want_nut_count === ''){
          Swal.fire(
              '堅果幣儲值訊息',
              '想要儲值還不打好數量',
              'info'
          )
        }else{
          db.firestore().collection("users").doc(this.user.uid).update({
            user_bunt_wallet_money: parseInt(this.nut_wallet_money) + parseInt(this.want_nut_count)
          })
          let date = dateFormat(db.firestore.Timestamp.seconds, "yyyy-mm-dd HH:mm:ss")
          db.firestore().collection("users").doc(this.user.uid).collection("wallet_record").doc(uid(10)).set({
            wallet_address_from: 'system',
            wallet_owner_from: 'system',
            wallet_address_to: this.nut_wallet_address,
            wallet_owner_to: this.user.uid,
            record_money: this.want_nut_count,
            record_date: date,
            record_status: 'demo', // order, demo
            record_ok: 'ok',
            record_order_id: '',
            record_check_out_date: date
          }).then(()=>{
            Swal.fire(
                '堅果幣儲值訊息',
                '儲值成功',
                'success'
            ).then(()=>{
              location.href = 'nutwallet'
            })
          })
        }
      }else{
       Swal.fire(
           '堅果幣儲值訊息',
           '錢包已被鎖住，請盡快綁定手機號碼',
           'error'
       )
      }
    }
  }
}
</script>

<style src="./NutWallet.css" scoped>

</style>