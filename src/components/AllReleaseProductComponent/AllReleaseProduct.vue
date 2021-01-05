<template src="./AllReleaseProduct.html">

</template>

<script>
import db from "@/db"
import Swal from 'sweetalert2'
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
      total_index: 1,
      product_id: '',
      storageRef_one_result: '',
      storageRef_two_result: ''
    }
  },
  props: {
    user: Object,
  },
  mounted() {
    this.showAllReleaseProduct()
  },
  // watch: {
  //   user: [{
  //     handler: 'showAllReleaseProduct'
  //   }]
  // },
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
          let all_doc_data_len = all_doc_data.length
          this.total_index += parseInt(all_doc_data_len / 10)
        }

      })
    },
    removeProduct: function (product_id, book_classification){
      Swal.fire({
        title: '賣場中心訊息',
        text: "是否要移除商品？",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '確定',
        cancelButtonText: '取消'}).then(result=>{
          if (result.isConfirmed) {
            console.log(product_id)
            let storageRef_one = db.storage().ref("release_product_pic/" + book_classification + "/" + product_id + "1.jpg")
            let storageRef_two = db.storage().ref("release_product_pic/" + book_classification + "/" + product_id + "2.jpg")
            storageRef_one.delete().then( () => {
            }).then(()=> {
              storageRef_two.delete().then(() => {
              }).then(()=>{
                db.firestore().collection("users").doc(this.user.uid).collection("release_product").doc(product_id).delete().then(()=>{
                  db.firestore().collection("market_books").doc(book_classification).collection("release_product").doc(product_id).delete().then(()=>{
                  })
                })
              })
            })
          }

      })
    }
  }
}
</script>

<style src="./AllReleaseProduct.css" scoped>

</style>