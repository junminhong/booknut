<template src="./TransactionProcess.html">

</template>

<script>
import db from "@/db";
import VueQrcode from 'vue3-qrcode'
import Swal from "sweetalert2";
import { uid } from 'uid'
let dateFormat = require("dateformat")
export default {
  name: "TransactionProcess",
  data(){
    return{
      order_id: '',
      buyer_id: '',
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
    order_id:[{handler: 'showOrderDetail'}]
  },
  methods:{
    checkOrderStatus: function (){
      console.log(this.all_order.get(this.order_id))
      if (this.all_order.get(this.order_id).book_transaction === 'nut_coin_payment'){
        db.firestore().collection("users").doc(this.user.uid).collection("order_list").doc(this.order_id)
            .onSnapshot({
              // Listen for document metadata changes
            }, doc=> {
              console.log(doc.data().order_status)
              if(doc.data().order_status === "wait_for_seller_send" && !doc.data().is_reload){
                console.log("重整")
                db.firestore().collection("users").doc(this.user.uid).collection("order_list").doc(this.order_id).update({
                  is_reload: true
                }).then(()=>{
                  location.reload()
                })
              }
            });
      }else if(this.all_order.get(this.order_id).book_transaction === 'face_to_face'){
        db.firestore().collection("users").doc(this.user.uid).collection("seller_order_list").doc(this.order_id)
            .onSnapshot({
              // Listen for document metadata changes
            }, doc=> {
              console.log(doc.data().order_status)
              if(doc.data().order_status === "wait_for_ship" && !doc.data().is_reload){
                console.log("重整")
                db.firestore().collection("users").doc(this.user.uid).collection("seller_order_list").doc(this.order_id).update({
                  is_reload: true
                }).then(()=>{
                  location.reload()
                })
              }
            });
      }
    },
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
          }).then(()=>{
            this.checkOrderStatus()
          })
        }else{
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
                this.btn_status = '等待賣家確認'
                this.btn_hidden_flag = true
              }else if (result.data().order_status === 'wait_for_buyer'){
                this.create_order_flag = true
                this.wait_for_seller_flag = true
                this.btn_status = '付款去'
                this.btn_hidden_flag = false
              }else if (result.data().order_status === 'wait_for_seller_send'){
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
                this.btn_status = '等待賣家確認'
                this.btn_hidden_flag = true
              }else if (result.data().order_status === 'wait_for_buyer'){
                this.create_order_flag = true
                this.wait_for_seller_flag = true
                this.wait_for_buyer_flag = true
                this.btn_status = '等待賣家出示QRCODE進行付款'
                this.btn_hidden_flag = true
              }else if (result.data().order_status === 'wait_for_ship'){
                this.create_order_flag = true
                this.wait_for_seller_flag = true
                this.wait_for_buyer_flag = true
                this.wait_for_ship_flag = true
                this.btn_status = '等待賣家確認已給予貨物'
                this.btn_hidden_flag = true
              }else if (result.data().order_status === 'wait_for_buyer_rec'){
                this.create_order_flag = true
                this.wait_for_seller_flag = true
                this.wait_for_buyer_flag = true
                this.wait_for_ship_flag = true
                this.wait_for_buyer_rec_flag = true
                this.btn_status = '確認已收到貨物'
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
          }).then(()=>{
            this.checkOrderStatus()
          })
        }

      }else if (this.$route.query.status === 'sell'){
        db.firestore().collection("users").doc(this.user.uid).collection("seller_order_list").doc(this.order_id).get().then(result => {
          this.all_order.set(result.id, result.data())
          this.checkOrderStatus()
          this.order_status = result.data().order_status
          if (result.data().book_transaction === 'nut_coin_payment'){
            if (result.data().order_status === 'create_order'){
              this.create_order_flag = true
              this.btn_status = '訂單成立'
              this.btn_hidden_flag = true
            }else if (result.data().order_status === 'wait_for_seller'){
              this.create_order_flag = true
              this.btn_status = '確認訂單'
              this.btn_hidden_flag = false
            }else if (result.data().order_status === 'wait_for_buyer'){
              this.create_order_flag = true
              this.wait_for_seller_flag = true
              this.btn_status = '等待買家付款'
              this.btn_hidden_flag = true
            }else if (result.data().order_status === 'wait_for_seller_send'){
              this.create_order_flag = true
              this.wait_for_seller_flag = true
              this.wait_for_buyer_flag = true
              this.btn_status = '出貨去'
              this.btn_hidden_flag = false
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
              this.btn_status = '等待買家收貨'
              this.btn_hidden_flag = true
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
              this.btn_status = '訂單成立'
              this.btn_hidden_flag = true
            }else if (result.data().order_status === 'wait_for_seller'){
              this.create_order_flag = true
              this.btn_status = '確認訂單'
              this.btn_hidden_flag = false
            }else if (result.data().order_status === 'wait_for_buyer'){
              this.create_order_flag = true
              this.wait_for_seller_flag = true
              this.btn_status = '顯示付款QRCODE'
              this.btn_hidden_flag = false
            }else if (result.data().order_status === 'wait_for_ship'){
              this.create_order_flag = true
              this.wait_for_seller_flag = true
              this.wait_for_buyer_flag = true
              this.wait_for_ship_flag = true
              this.btn_status = '確認已給予貨物'
              this.btn_hidden_flag = false
            }else if (result.data().order_status === 'wait_for_buyer_rec'){
              this.create_order_flag = true
              this.wait_for_seller_flag = true
              this.wait_for_buyer_flag = true
              this.wait_for_ship_flag = true
              this.wait_for_buyer_rec_flag = true
              this.btn_status = '等待買家確認已收到貨物'
              this.btn_hidden_flag = true
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

    },
    transactionProcess: function (){
      if (this.$route.query.status === 'buy' && this.order_status === 'wait_for_buyer' && this.all_order.get(this.order_id).book_transaction === 'nut_coin_payment'){
        // 付款
        let dataURL = document.getElementById('qrcode').src;
        Swal.fire({
          title: '請掃描下方QrCode進行付款',
          icon: 'info',
          html: '<img src="'+ dataURL + '"/>'
        })
      }else if(this.$route.query.status === 'buy' && this.order_status === 'wait_for_buyer_rec' && this.all_order.get(this.order_id).book_transaction === 'nut_coin_payment') {
        Swal.fire({
          title: '收貨訊息',
          text: '是否確認收到貨物？',
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: '確定',
          cancelButtonText: '取消'}).then(result=>{
          if (result.isConfirmed){
            let seller_id = ''
            db.firestore().collection("users").doc(this.user.uid).collection("wallet_record").where('record_order_id', '==', this.order_id).get().then(result=>{
              result.docs.forEach(value=>{
                console.log(value.id, value.data().wallet_owner_from, value.data().wallet_owner_to, value.data().record_money)
                seller_id = value.data().wallet_owner_to
                let date = dateFormat(db.firestore.Timestamp.seconds, "yyyy-mm-dd HH:mm:ss")
                db.firestore().collection("users").doc(value.data().wallet_owner_from).collection("order_list").doc(this.order_id).update({
                  order_status: 'order_ok',
                  complete_order_date: date
                }).then(()=>{
                  db.firestore().collection("users").doc(value.data().wallet_owner_to).collection("seller_order_list").doc(this.order_id).update({
                    order_status: 'order_ok',
                    complete_order_date: date
                  })
                }).then(()=>{
                  let buyer_money = 0
                  let seller_money = 0
                  db.firestore().collection("users").doc(value.data().wallet_owner_from).get().then(result=>{
                    buyer_money = result.data().user_bunt_wallet_money
                  }).then(()=>{
                    console.log(parseInt(buyer_money) - parseInt(value.data().record_money))
                    db.firestore().collection("users").doc(value.data().wallet_owner_from).update({
                      user_bunt_wallet_money: parseInt(buyer_money) - parseInt(value.data().record_money)
                    })
                  }).then(()=>{
                    db.firestore().collection("users").doc(value.data().wallet_owner_to).get().then(result=>{
                      seller_money = result.data().user_bunt_wallet_money
                    }).then(()=>{
                      console.log(seller_money)
                      console.log(parseInt(seller_money) + parseInt(value.data().record_money))
                      db.firestore().collection("users").doc(value.data().wallet_owner_to).update({
                        user_bunt_wallet_money: parseInt(seller_money) + parseInt(value.data().record_money)
                      })
                    })
                  })
                }).then(()=>{
                  let date = dateFormat(db.firestore.Timestamp.seconds, "yyyy-mm-dd HH:mm:ss")
                  db.firestore().collection("users").doc(value.data().wallet_owner_from).collection("wallet_record").doc(value.id).update({
                    record_ok: 'ok',
                    record_check_out_date: date
                  })
                })
              })
            }).then(()=>{
              db.firestore().collection("users").doc(seller_id).collection("wallet_record").where('record_order_id', '==', this.order_id).get().then(result=>{
                result.docs.forEach(value=>{
                  console.log(value.id, value.data().wallet_owner_from, value.data().wallet_owner_to, value.data().record_money)
                  let date = dateFormat(db.firestore.Timestamp.seconds, "yyyy-mm-dd HH:mm:ss")
                  db.firestore().collection("users").doc(seller_id).collection("wallet_record").doc(value.id).update({
                    record_ok: 'ok',
                    record_check_out_date: date
                  }).then(()=>{
                    Swal.fire(
                        '收貨訊息',
                        '收貨成功',
                        'success'
                    )
                    let date = dateFormat(db.firestore.Timestamp.seconds, "yyyy-mm-dd HH:mm:ss")
                    db.database().ref('users_notify/' + seller_id  + '/' + uid(10)).update({
                      msg: '訂單已完成',
                      msg_date: date,
                      order_id: this.order_id,
                      status: 'sell'
                    })
                    this.create_order_flag = true
                    this.wait_for_seller_flag = true
                    this.wait_for_buyer_flag = true
                    this.wait_for_ship_flag = true
                    this.wait_for_buyer_rec_flag = true
                    this.btn_status = '訂單已完成'
                    this.btn_hidden_flag = true
                  })
                })
              })
            })
          }
        })
      }else if(this.$route.query.status === 'buy' && this.order_status === 'wait_for_buyer_rec' && this.all_order.get(this.order_id).book_transaction === 'face_to_face') {
        Swal.fire({
          title: '收貨訊息',
          text: '是否確認收到貨物？',
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: '確定',
          cancelButtonText: '取消'}).then(result=>{
          if (result.isConfirmed){
            let seller_id = ''
            db.firestore().collection("users").doc(this.user.uid).collection("wallet_record").where('record_order_id', '==', this.order_id).get().then(result=>{
              result.docs.forEach(value=>{
                console.log(value.id, value.data().wallet_owner_from, value.data().wallet_owner_to, value.data().record_money)
                seller_id = value.data().wallet_owner_to
                let date = dateFormat(db.firestore.Timestamp.seconds, "yyyy-mm-dd HH:mm:ss")
                db.firestore().collection("users").doc(value.data().wallet_owner_from).collection("order_list").doc(this.order_id).update({
                  order_status: 'order_ok',
                  complete_order_date: date
                }).then(()=>{
                  db.firestore().collection("users").doc(value.data().wallet_owner_to).collection("seller_order_list").doc(this.order_id).update({
                    order_status: 'order_ok',
                    complete_order_date: date
                  })
                }).then(()=>{
                  let buyer_money = 0
                  let seller_money = 0
                  db.firestore().collection("users").doc(value.data().wallet_owner_from).get().then(result=>{
                    buyer_money = result.data().user_bunt_wallet_money
                  }).then(()=>{
                    console.log(parseInt(buyer_money) - parseInt(value.data().record_money))
                    db.firestore().collection("users").doc(value.data().wallet_owner_from).update({
                      user_bunt_wallet_money: parseInt(buyer_money) - parseInt(value.data().record_money)
                    })
                  }).then(()=>{
                    db.firestore().collection("users").doc(value.data().wallet_owner_to).get().then(result=>{
                      seller_money = result.data().user_bunt_wallet_money
                    }).then(()=>{
                      console.log(seller_money)
                      console.log(parseInt(seller_money) + parseInt(value.data().record_money))
                      db.firestore().collection("users").doc(value.data().wallet_owner_to).update({
                        user_bunt_wallet_money: parseInt(seller_money) + parseInt(value.data().record_money)
                      })
                    })
                  })
                }).then(()=>{
                  let date = dateFormat(db.firestore.Timestamp.seconds, "yyyy-mm-dd HH:mm:ss")
                  db.firestore().collection("users").doc(value.data().wallet_owner_from).collection("wallet_record").doc(value.id).update({
                    record_ok: 'ok',
                    record_check_out_date: date
                  })
                })
              })
            }).then(()=>{
              db.firestore().collection("users").doc(seller_id).collection("wallet_record").where('record_order_id', '==', this.order_id).get().then(result=>{
                result.docs.forEach(value=>{
                  console.log(value.id, value.data().wallet_owner_from, value.data().wallet_owner_to, value.data().record_money)
                  let date = dateFormat(db.firestore.Timestamp.seconds, "yyyy-mm-dd HH:mm:ss")
                  db.firestore().collection("users").doc(seller_id).collection("wallet_record").doc(value.id).update({
                    record_ok: 'ok',
                    record_check_out_date: date
                  }).then(()=>{
                    Swal.fire(
                        '收貨訊息',
                        '收貨成功',
                        'success'
                    )
                    let date = dateFormat(db.firestore.Timestamp.seconds, "yyyy-mm-dd HH:mm:ss")
                    db.database().ref('users_notify/' + seller_id  + '/' + uid(10)).update({
                      msg: '訂單已完成',
                      msg_date: date,
                      order_id: this.order_id,
                      status: 'sell'
                    })
                    this.create_order_flag = true
                    this.wait_for_seller_flag = true
                    this.wait_for_buyer_flag = true
                    this.wait_for_ship_flag = true
                    this.wait_for_buyer_rec_flag = true
                    this.btn_status = '訂單已完成'
                    this.btn_hidden_flag = true
                  })
                })
              })
            })
          }
        })
      } else if(this.$route.query.status === 'sell' && this.order_status === 'wait_for_seller' && this.all_order.get(this.order_id).book_transaction === 'nut_coin_payment'){
        db.firestore().collection("users").doc(this.user.uid).collection("seller_order_list").doc(this.order_id).update({
          order_status: 'wait_for_buyer'
        }).then(()=>{
          let buyer_id = ''
          db.firestore().collection("users").doc(this.user.uid).collection("seller_order_list").doc(this.order_id).get().then(result=>{
            buyer_id = result.data().buyer_id
          }).then(()=>{
            db.firestore().collection("users").doc(buyer_id).collection("order_list").doc(this.order_id).update({
              order_status: 'wait_for_buyer'
            }).then(()=>{
              Swal.fire(
                  '訂單訊息',
                  '確認訂單成功，已通知買家進行付款',
                  'success'
              ).then(()=>{
                let date = dateFormat(db.firestore.Timestamp.seconds, "yyyy-mm-dd HH:mm:ss")
                db.database().ref('users_notify/' + buyer_id  + '/' + uid(10)).update({
                  msg: '訂單已被賣家確認，請前往付款',
                  msg_date: date,
                  order_id: this.order_id,
                  status: 'buy'
                })
                this.create_order_flag = true
                this.wait_for_seller_flag = true
                this.btn_status = '等待買家付款'
                this.btn_hidden_flag = true
              })
            })
          })
        })
      }else if(this.$route.query.status === 'sell' && this.order_status === 'wait_for_seller_send' && this.all_order.get(this.order_id).book_transaction === 'nut_coin_payment'){
        // 出貨要建立物流
        db.firestore().collection("users").doc(this.user.uid).collection("seller_order_list").doc(this.order_id).update({
          order_status: 'wait_for_buyer_rec'
        }).then(()=> {
          let buyer_id = ''
          db.firestore().collection("users").doc(this.user.uid).collection("seller_order_list").doc(this.order_id).get().then(result => {
            buyer_id = result.data().buyer_id
          }).then(() => {
            db.firestore().collection("users").doc(buyer_id).collection("order_list").doc(this.order_id).update({
              order_status: 'wait_for_buyer_rec'
            }).then(() => {
              Swal.fire(
                  '訂單訊息',
                  '出貨成功，等待物流配送',
                  'success'
              ).then(() => {
                let date = dateFormat(db.firestore.Timestamp.seconds, "yyyy-mm-dd HH:mm:ss")
                db.firestore().collection("ship_order").doc(this.order_id).set({
                  order_id: this.order_id,
                  ship_status: 'create_ship',
                  ship_create_date: date
                }).then(()=>{
                  date = dateFormat(new Date(), "yyyy-mm-dd HH:mm:ss")
                  db.database().ref('users_notify/' + buyer_id  + '/' + uid(10)).update({
                    msg: '賣家已出貨，等待物流配送',
                    msg_date: date,
                    order_id: this.order_id,
                    status: 'buy'
                  })
                  date = dateFormat(new Date(), "yyyy-mm-dd HH:mm:ss")
                  db.database().ref('users_notify/' + buyer_id  + '/' + uid(10)).update({
                    msg: '物流已送達，請取貨完成後確認訂單',
                    msg_date: date,
                    order_id: this.order_id,
                    status: 'buy'
                  })
                  this.create_order_flag = true
                  this.wait_for_seller_flag = true
                  this.wait_for_buyer_flag = true
                  this.wait_for_ship_flag = true
                  this.wait_for_buyer_rec_flag = true
                  this.btn_status = '等待買家收貨'
                  this.btn_hidden_flag = true
                })
              })
            })
          })
        })
      }else if(this.$route.query.status === 'sell' && this.order_status === 'wait_for_seller' && this.all_order.get(this.order_id).book_transaction === 'face_to_face'){
        /*
        * 面交確認訂單
        * */
        db.firestore().collection("users").doc(this.user.uid).collection("seller_order_list").doc(this.order_id).update({
          order_status: 'wait_for_buyer'
        }).then(()=>{
          let buyer_id = ''
          db.firestore().collection("users").doc(this.user.uid).collection("seller_order_list").doc(this.order_id).get().then(result=>{
            buyer_id = result.data().buyer_id
          }).then(()=>{
            db.firestore().collection("users").doc(buyer_id).collection("order_list").doc(this.order_id).update({
              order_status: 'wait_for_buyer'
            }).then(()=>{
              Swal.fire(
                  '訂單訊息',
                  '確認訂單成功',
                  'success'
              ).then(()=>{
                let date = dateFormat(db.firestore.Timestamp.seconds, "yyyy-mm-dd HH:mm:ss")
                db.database().ref('users_notify/' + buyer_id  + '/' + uid(10)).update({
                  msg: '訂單已被賣家確認',
                  msg_date: date,
                  order_id: this.order_id,
                  status: 'buy'
                })
                this.create_order_flag = true
                this.wait_for_seller_flag = true
                this.btn_status = '顯示付款QRCODE'
                this.btn_hidden_flag = false
                this.order_status = 'wait_for_buyer'
              })
            })
          })
        })
      }else if(this.$route.query.status === 'sell' && this.order_status === 'wait_for_buyer' && this.all_order.get(this.order_id).book_transaction === 'face_to_face'){
        /*
        * 面交賣家顯示qrcode給買家
        * */
        let dataURL = document.getElementById('qrcode').src;
        Swal.fire({
          title: '請掃描下方QrCode進行付款',
          icon: 'info',
          html: '<img src="'+ dataURL + '"/>'
        })
      }else if(this.$route.query.status === 'sell' && this.order_status === 'wait_for_ship' && this.all_order.get(this.order_id).book_transaction === 'face_to_face'){
        /*
        * 面交賣家確認出貨給買家
        * */
        db.firestore().collection("users").doc(this.user.uid).collection("seller_order_list").doc(this.order_id).update({
          order_status: 'wait_for_buyer_rec'
        }).then(()=> {
          let buyer_id = ''
          db.firestore().collection("users").doc(this.user.uid).collection("seller_order_list").doc(this.order_id).get().then(result => {
            buyer_id = result.data().buyer_id
          }).then(() => {
            db.firestore().collection("users").doc(buyer_id).collection("order_list").doc(this.order_id).update({
              order_status: 'wait_for_buyer_rec'
            }).then(() => {
              Swal.fire(
                  '訂單訊息',
                  '確認出貨成功，等待買家確認收貨',
                  'success'
              ).then(() => {
                let date = dateFormat(db.firestore.Timestamp.seconds, "yyyy-mm-dd HH:mm:ss")
                db.database().ref('users_notify/' + buyer_id  + '/' + uid(10)).update({
                  msg: '賣家已出貨，等待買家確認收貨',
                  msg_date: date,
                  order_id: this.order_id,
                  status: 'buy'
                })
                this.create_order_flag = true
                this.wait_for_seller_flag = true
                this.wait_for_buyer_flag = true
                this.wait_for_ship_flag = true
                this.wait_for_buyer_rec_flag = true
                this.btn_status = '等待買家確認已收到貨物'
                this.btn_hidden_flag = true
              })
            })
          })
        })
      }
    }
  },
}
</script>

<style src="./TransactionProcess.css" scoped>

</style>