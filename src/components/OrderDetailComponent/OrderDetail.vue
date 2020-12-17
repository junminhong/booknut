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
      all_order_detail_product: []
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
      this.all_order_detail_product = []
      db.firestore().collection("users").doc(this.user.uid).collection("order_list").doc(this.order_id).get().then(result => {
        this.order_detail_product = result.data()
        console.log(this.order_detail_product)
        db.firestore().collection("users").doc(this.user.uid).collection("order_list").doc(this.order_id).collection("shop_cart").get().then(snap_shot=>{
          snap_shot.forEach((value) =>{
            console.log(value.data(), value.id)
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