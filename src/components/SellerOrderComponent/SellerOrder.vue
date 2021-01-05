<template src="./SellerOrder.html">

</template>

<script>
import db from "@/db";

export default {
  name: "SellerOrder",
  data(){
    return{
      order_search_type: 'not_ok',
      all_order_data: '',
      total_index: 1,
    }
  },
  props: {
    user: Object,
  },
  mounted() {
    this.showAllOrder()
  },
  // watch: {
  //   user: [{
  //     handler: 'showAllOrder'
  //   }]
  // },
  methods:{
    showAllOrder:function (){
      if (this.order_search_type === 'not_ok'){
        this.notOkShowOrder()
      }else if(this.order_search_type === 'ok'){
        this.okShowOrder()
      }
    },
    notOkShowOrder:function (){
      db.firestore().collection("users").doc(this.user.uid).collection("seller_order_list").get().then(all_doc=>{
        let all_doc_data = []
        all_doc.forEach(doc=>{
          all_doc_data.push(doc)
        })
        this.all_order_data = all_doc_data
        if (all_doc_data.length < 10){
          this.total_index = 1
        }else{
          let all_doc_data_len = all_doc_data.length
          this.total_index += parseInt(all_doc_data_len / 10)
        }
      })
    },
    okShowOrder: function (){

    }
  }
}
</script>

<style src="./SellerOrder.css" scoped>

</style>