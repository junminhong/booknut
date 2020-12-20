<template src="./TransactionProcess.html">

</template>

<script>
import db from "@/db";
import VueQrcode from 'vue3-qrcode'
import Swal from "sweetalert2";
export default {
  name: "TransactionProcess",
  data(){
    return{
      order_id: '',
      order_detail_product: [],
      all_order: [],
      btn_status: '',
      order_status: '',
      btn_hidden_flag: false,
      create_order_flag: false,
      wait_for_seller_flag: false,
      wait_for_buyer_flag: false,
      wait_for_ship_flag: false,
      wait_for_buyer_rec_flag: false,
      order_step_one: '訂單成立',
      order_step_two: '等待賣家確認訂單',
      order_step_three: '等待買家付款',
      order_step_four: '貨物運送中',
      order_step_five: '等待買家收貨'
    }
  },
  components: {
    VueQrcode,
  },
  props: {
    user: Object,
  },
  mounted() {
    this.showOrderDetail()
  },
  watch:{
    order_id:[{
        handler: 'showOrderDetail'
      }
    ]
  },
  methods:{
    showOrderDetail: function (){
      this.all_order = new Map()
      this.order_id = this.$route.query.order_id
      if (this.$route.query.status === 'buy'){
        if (this.order_id === '' || this.order_id === undefined || this.order_id === null){
          this.all_order_detail_product = []
          db.firestore().collection("users").doc(this.user.uid).collection("order_list").get().then(result => {
            result.forEach(docs =>{
              this.all_order.set(docs.id, docs.data())
            })
          })
        }else{
          console.log(this.all_order)
          db.firestore().collection("users").doc(this.user.uid).collection("order_list").doc(this.order_id).get().then(result => {
            this.all_order.set(result.id, result.data())
            this.order_status = result.data().order_status
            if (result.data().book_transaction === 'nut_coin_payment'){
              if (result.data().order_status === 'create_order'){
                this.create_order_flag = true
                this.btn_status = '等待賣家確認'
                this.btn_hidden_flag = true
              }else if (result.data().order_status === 'wait_for_seller'){
                this.create_order_flag = true
                this.wait_for_seller_flag = true
                this.btn_status = '付款去'
                this.btn_hidden_flag = false
              }else if (result.data().order_status === 'wait_for_buyer'){
                this.create_order_flag = true
                this.wait_for_seller_flag = true
                this.wait_for_buyer_flag = true
                this.btn_status = '等待賣家出貨'
                this.btn_hidden_flag = true
              }else if (result.data().order_status === 'wait_for_ship'){
                this.create_order_flag = true
                this.wait_for_seller_flag = true
                this.wait_for_buyer_flag = true
                this.wait_for_ship_flag = true
                this.btn_status = '運送中'
                this.btn_hidden_flag = true
              }else if (result.data().order_status === 'wait_for_buyer_rec'){
                this.create_order_flag = true
                this.wait_for_seller_flag = true
                this.wait_for_buyer_flag = true
                this.wait_for_ship_flag = true
                this.wait_for_buyer_rec_flag = true
                this.btn_status = '收貨去'
                this.btn_hidden_flag = false
              }else if (result.data().order_status === 'order_ok'){
                this.create_order_flag = true
                this.wait_for_seller_flag = true
                this.wait_for_buyer_flag = true
                this.wait_for_ship_flag = true
                this.wait_for_buyer_rec_flag = true
                this.btn_status = '訂單已完成'
                this.btn_hidden_flag = true
              }
            }else{
              this.order_step_four = '物品面交中'
              if (result.data().order_status === 'create_order'){
                this.create_order_flag = true
                this.btn_status = '等待賣家確認'
                this.btn_hidden_flag = true
              }else if (result.data().order_status === 'wait_for_seller'){
                this.create_order_flag = true
                this.wait_for_seller_flag = true
                this.btn_status = '付款去'
                this.btn_hidden_flag = false
              }else if (result.data().order_status === 'wait_for_buyer'){
                this.create_order_flag = true
                this.wait_for_seller_flag = true
                this.wait_for_buyer_flag = true
                this.btn_status = '等待賣家出貨'
                this.btn_hidden_flag = true
              }else if (result.data().order_status === 'wait_for_ship'){
                this.create_order_flag = true
                this.wait_for_seller_flag = true
                this.wait_for_buyer_flag = true
                this.wait_for_ship_flag = true
                this.btn_status = '運送中'
                this.btn_hidden_flag = true
              }else if (result.data().order_status === 'wait_for_buyer_rec'){
                this.create_order_flag = true
                this.wait_for_seller_flag = true
                this.wait_for_buyer_flag = true
                this.wait_for_ship_flag = true
                this.wait_for_buyer_rec_flag = true
                this.btn_status = '收貨去'
                this.btn_hidden_flag = false
              }else if (result.data().order_status === 'order_ok'){
                this.create_order_flag = true
                this.wait_for_seller_flag = true
                this.wait_for_buyer_flag = true
                this.wait_for_ship_flag = true
                this.wait_for_buyer_rec_flag = true
                this.btn_status = '訂單已完成'
                this.btn_hidden_flag = true
              }
            }
          })
        }
      }else if (this.$route.query.status === 'sell'){
        db.firestore().collection("users").doc(this.user.uid).collection("seller_order_list").doc(this.order_id).get().then(result => {
          this.all_order.set(result.id, result.data())
          if (result.data().order_status === 'create_order'){
            this.btn_status = '確認訂單'
            this.btn_hidden_flag = false
          }else if (result.data().order_status === 'wait_for_seller'){
            this.create_order_flag = true
            this.wait_for_seller_flag = true
            this.btn_status = '等待買家付款'
            this.btn_hidden_flag = true
          }
        })
      }
    },
    transactionProcess: function (){
      if (this.order_status === 'wait_for_seller' && this.all_order.get(this.order_id).book_transaction === 'nut_coin_payment'){
        // 付款
        let dataURL = document.getElementById('qrcode').src;
        Swal.fire({
          title: '請掃描下方QrCode進行付款',
          icon: 'info',
          html: '<img src="'+ dataURL + '"/>'
        })
      }
    }
  },
}
</script>

<style src="./TransactionProcess.css" scoped>

</style>