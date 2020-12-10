<template src="./AllReleaseProduct.html">

</template>

<script>
import db from "@/db";
export default {
  name: "AllReleaseProduct",
  data(){
    return{
      book_isbn: '',
      book_name: '',
      book_publishing_house: '',
      book_publishing_date: '',
      book_classification: '',
      book_description: '',
      book_status: '',
      book_transaction: '',
      book_shipment: '',
      book_shipment_date: '',
      book_money: '',
      all_doc_data: [],
      total_index: '',
      product_id: ''
    }
  },
  props: {
    user: Object,
  },

  watch: {
    user: [{
      handler: 'showAllReleaseProduct'
    }]
  },
  methods:{
    showAllReleaseProduct: function (){
      db.firestore().collection("users").doc(this.user.uid).collection("release_product").get().then(all_doc=>{
        let all_doc_data = []
        all_doc.forEach(doc=>{
          all_doc_data.push(doc)
        })
        this.all_doc_data = all_doc_data
        if (all_doc_data.length < 10){
          this.total_index = 1
        }else{
          this.total_index = all_doc_data.length / 10
        }

      })
    },
  }
}
</script>

<style src="./AllReleaseProduct.css" scoped>

</style>