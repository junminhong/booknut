<template src="./ShopCart.html">

</template>

<script>
import db from "@/db";
export default {
  name: "ShopCart",
  props:{
    user: Object
  },
  watch: {
    user:[{
      handler: 'showAllShopCart'
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
      is_use_discount_code: false
    }
  },
  methods:{
    showAllShopCart: function (){
      let all_shop_cart_product = new Map()
      let all_shop_cart_user_id = new Map()
      db.database().ref("/users/" + this.user.uid + '/shop_cart').get().then(result=>{
        result.forEach(snap_shot=>{
          console.log(snap_shot.key)
          db.firestore().collection("users").doc(snap_shot.key).get().then(result=>{
            all_shop_cart_user_id.set(snap_shot.key, result.data().user_name)
            this.all_shop_cart_user_id = all_shop_cart_user_id
            this.all_shop_cart_user_name.push(result.data().user_name)
            console.log( this.all_shop_cart_user_name)
            let shop_cart_product = []
            snap_shot.val().forEach(product_snap_shot=>{
              shop_cart_product.push(product_snap_shot)
              this.total_money += parseInt(product_snap_shot.book_money)
            })
            this.fare_money += 60
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
        this.fare_money = 0
      }
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
    }
  }
}
</script>

<style src="./ShopCart.css" scoped>

</style>