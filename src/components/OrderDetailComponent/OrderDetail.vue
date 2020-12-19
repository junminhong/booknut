<template src="./OrderDetail.html">

</template>

<script>
import db from "@/db";

export default {
name: "OrderDetail",
  data(){
    return{
      order_id: this.$route.query.order_id,
      order_detail_product: [],
      all_order_detail_product: [],
      fare_discount_money: 60,
      total_money: 0
    }
  },
  props: {
    user: Object,
  },
  mounted() {
    this.showOrderDetail()
  },
  // watch: {
  //   user:[{
  //     handler: 'showOrderDetail'
  //   }]
  // },
  methods: {
    showOrderDetail: function (){
      this.total_money = 0
      this.all_order_detail_product = []
      db.firestore().collection("users").doc(this.user.uid).collection("order_list").doc(this.order_id).get().then(result => {
        this.order_detail_product = result.data()
        db.firestore().collection("users").doc(this.user.uid).collection("order_list").doc(this.order_id).collection("shop_cart").get().then(snap_shot=>{
          snap_shot.forEach((value) =>{
            this.total_money += parseInt( value.data().order_book_money)
            if (this.order_detail_product.have_fare_money === true){
              this.fare_discount_money = 60
            }else{
              this.fare_discount_money = 0
            }
            this.all_order_detail_product.push(value.data())
          })
        })
      })
    }
  }
}
</script>

<style src="./OrderDetail.css" scoped>

</style>