<template src="./TransactionProcess.html">

</template>

<script>
import db from "@/db";

export default {
  name: "TransactionProcess",
  data(){
    return{
      order_id: '',
      order_detail_product: [],
      all_order: []
    }
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
      if (this.order_id === '' || this.order_id === undefined || this.order_id === null){
        this.all_order_detail_product = []
        db.firestore().collection("users").doc(this.user.uid).collection("order_list").get().then(result => {
          result.forEach(docs =>{
            this.all_order.set(docs.id, docs.data())
          })
        })
      }else{
        db.firestore().collection("users").doc(this.user.uid).collection("order_list").doc(this.order_id).get().then(result => {
          this.all_order.set(result.id, result.data())
        })
      }
    }
  },
}
</script>

<style src="./TransactionProcess.css" scoped>

</style>