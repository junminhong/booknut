<template src="./OldBook.html">

</template>

<script>
import db from "@/db"
export default {
  name: "OldBook",
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
      querySnapshot: '',
      all_doc_data: ''
    }
  },
  mounted() {
    this.showAllBooks()
  },
  methods:{
    showAllBooks: function (){
      db.firestore().collection('market_books').doc("exam_book").collection("release_product").get().then(querySnapshot => {
        let doc_data = [];
        querySnapshot.forEach(doc => {
          doc_data.push(doc.data())
        });
        this.querySnapshot = querySnapshot
        console.log(doc_data)
        this.all_doc_data = doc_data
      })
    }
  }
}
</script>

<style src="./OldBool.css" scoped>

</style>