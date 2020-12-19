<template src="./ShopCart.html">

</template>

<script>
import db from "@/db"
import Swal from "sweetalert2"
import {uid} from "uid"
let dateFormat = require("dateformat")
export default {
  name: "ShopCart",
  props:{
    user: Object
  },
  watch: {
    user:[{
      handler: 'showAllShopCart'
    },{
      handler: 'updateShopCartAmount'
    }]
  },
  data(){
    return{
      all_shop_cart_user_name: [],
      all_shop_cart_user_id: [],
      all_shop_cart_product: '',
      total_money: 0,
      fare_money: 0,
      discountCode: '',
      fare_discount_money: '',
      is_use_discount_code: false,
      is_ok_flag: false
    }
  },
  methods:{
    showAllShopCart: function (){
      let all_shop_cart_product = new Map()
      let all_shop_cart_user_id = new Map()
      db.database().ref("/users/" + this.user.uid + '/shop_cart').get().then(result=>{
        result.forEach(snap_shot=>{
          db.firestore().collection("users").doc(snap_shot.key).get().then(result=>{
            all_shop_cart_user_id.set(result.data().user_name, snap_shot.key)
            this.all_shop_cart_user_id = all_shop_cart_user_id
            this.all_shop_cart_user_name.push(result.data().user_name)
            let shop_cart_product = []
            snap_shot.forEach(product_snap_shot=>{
              shop_cart_product.push(product_snap_shot.val())
              this.total_money += parseInt(product_snap_shot.val().book_money)
            })
            this.fare_money += 60
            this.total_money += 60
            all_shop_cart_product.set(result.data().user_name, shop_cart_product)
            this.all_shop_cart_product = all_shop_cart_product
          })
        })
      })
    },
    useDiscountCode: function (){
      if (this.discountCode === 'booknut'){
        this.is_use_discount_code = true
        this.fare_discount_money = '$ ' + this.fare_money
        this.total_money -= this.fare_money
        this.fare_money = 0
      }
    },
    gotoTransaction: function (){
      Swal.fire({
        title: '購物車通知訊息',
        text: "是否要進入結帳程序？",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '確定',
        cancelButtonText: '取消'}).then(result=>{
        if (result.isConfirmed) {
          let have_fare_money = true
          if (this.fare_money === 0){
            have_fare_money = false
          }
          this.is_ok_flag = true
          this.all_shop_cart_product.forEach((value, key)=>{
            let order_number = uid(10)
            let date = dateFormat(new Date(), "yyyy-mm-dd HH:mm:ss")
            let seller_id = this.all_shop_cart_user_id.get(key)
            db.firestore().collection("users").doc(this.user.uid).collection("order_list").doc(order_number).set({
              order_status: 'create_order',
              have_fare_money: have_fare_money,
              order_date: date,
              seller_id: seller_id
            })
            db.firestore().collection("users").doc(seller_id).collection("seller_order_list").doc(order_number).set({
              order_status: 'create_order',
              have_fare_money: have_fare_money,
              order_date: date,
              buyer_id: this.user.uid
            })
            value.forEach((value, key)=>{
              db.firestore().collection("users").doc(this.user.uid).collection("order_list").doc(order_number).collection("shop_cart").doc(key.toString()).set({
                order_product_id: value.product_id,
                order_classification: value.classification,
                order_book_isbn: value.book_isbn,
                order_book_name: value.book_name,
                order_book_money: value.book_money,
                order_book_status: value.book_status,
                order_want_to_buy: true,
                product_one_img_url: value.product_one_img_url
              }).then(()=>{
                console.log(seller_id)
                db.firestore().collection("users").doc(seller_id).collection("seller_order_list").doc(order_number).collection("sell_product").doc(key.toString()).set({
                  order_product_id: value.product_id,
                  order_classification: value.classification,
                  order_book_isbn: value.book_isbn,
                  order_book_name: value.book_name,
                  order_book_money: value.book_money,
                  order_book_status: value.book_status,
                  order_want_to_buy: true,
                  product_one_img_url: value.product_one_img_url
                }).catch(error=>{
                  console.log(error)
                })
              }).then(()=>{
                db.database().ref("/users/" + this.user.uid + '/shop_cart/' + seller_id).remove()
              }).catch(error=>{
                console.log(error)
              })
            })
          })
        }
      })
    },
    allSelectShopCart: function (){
      // let now_user = db.auth().currentUser
      // let seller_id = ''
      // this.all_shop_cart_user_id.forEach((value, key)=>{
      //   if (value === seller_name)
      //     seller_id = key
      // })
      // db.database().ref("/users/" + now_user.uid + '/shop_cart/' + seller_id).get().then(result=>{
      //   db.database().ref("/users/" + now_user.uid + '/shop_cart/' + seller_id + '/' + result.key).update({
      //     want_to_buy: false
      //   })
      // })
    },
    updateShopCartAmount: function (){
      if(this.is_ok_flag){
        let tutorialsRef = db.database().ref("/users/" + this.user.uid + '/shop_cart/');
        tutorialsRef.on('child_removed', () => {
          tutorialsRef.get().then(result=>{
            if (result.numChildren() === 0){
              location.href = 'transactionprocess'
            }
          })
        });
      }
    },
    removeSingleShopCart: function (product_id, seller_id){
      this.is_ok_flag = false
      db.database().ref("/users/" + this.user.uid + '/shop_cart/' + seller_id + '/' + product_id).remove()
      location.href = 'shopcart'
    },
    removeSellerShopCart: function (user_name){
      let seller_id = this.all_shop_cart_user_id.get(user_name)
      db.database().ref("/users/" + this.user.uid + '/shop_cart/' + seller_id).remove()
      location.href = 'shopcart'
    }
  }
}
</script>

<style src="./ShopCart.css" scoped>

</style>