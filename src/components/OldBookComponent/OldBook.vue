<template src="./OldBook.html">

</template>

<script>
import db from "@/db"
import {uid} from "uid";
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
      all_doc_data: '',
      sort_type: 'list',
      classification_type: 'exam_book',
      user_id_number: ''
    }
  },
  mounted() {
    this.showAllBooks()
  },
  props:{
    user: Object,
  },
  watch:{
    user: [{
      handler: 'setUserIDNumber'
    }]
  },
  methods:{
    showAllBooks: function (){
      db.firestore().collection('market_books').doc(this.classification_type).collection("release_product").get().then(querySnapshot => {
        let doc_data = [];
        querySnapshot.forEach(doc => {
          doc_data.push(doc)
        });
        this.querySnapshot = querySnapshot
        this.all_doc_data = doc_data
      })
    },
    setUserIDNumber: function(){
      db.firestore().collection("users").doc(this.user.uid).get().then(result=>{
        this.user_id_number = result.data().user_id_number
      })
    },
    sortListType: function (){
      this.sort_type = 'list'
    },
    sortGridType: function (){
      this.sort_type = 'grid'
    },
    examType: function (){
      this.classification_type = 'exam_book'
      this.showAllBooks()
    },
    professionalType: function (){
      this.classification_type = 'professional_book'
      this.showAllBooks()
    },
    computerType: function (){
      this.classification_type = 'computer_book'
      this.showAllBooks()
    },
    religiousHumanities: function (){
      this.classification_type = 'religious_humanities_book'
      this.showAllBooks()
    },
    artDesign: function (){
      this.classification_type = 'art_design_book'
      this.showAllBooks()
    },
    travelFool: function (){
      this.classification_type = 'travel_fool_book'
      this.showAllBooks()
    },
    parentChild: function (){
      this.classification_type = 'parent_child_book'
      this.showAllBooks()
    },
    comicNovel: function (){
      this.classification_type = 'comic_novel_book'
      this.showAllBooks()
    },
    businessFinance: function (){
      this.classification_type = 'business_finance_book'
      this.showAllBooks()
    },
    addShopCart: function (product_id, classification, seller_uid, book_isbn, book_name, book_money, book_status){
      if (seller_uid !== this.user.uid){
        let shop_cart_count = 0
        db.database().ref("/users/" + this.user.uid + '/shop_cart/' + seller_uid).get().then(snapshot => {
          shop_cart_count = snapshot.numChildren()
          if (shop_cart_count === 0){
            db.database().ref("/users/" + this.user.uid + '/shop_cart/' + seller_uid + '/' + uid(10)).update({
              product_id: product_id,
              classification: classification,
              book_isbn: book_isbn,
              book_name: book_name,
              book_money: book_money,
              book_status: book_status,
              want_to_buy: true
            })
          }else {
            let canAddCart = true
            if (snapshot.val().product_id === product_id) {
              canAddCart = false
            }
            if (canAddCart){
              db.database().ref("/users/" + this.user.uid + '/shop_cart/' + seller_uid + '/' + uid(10)).update({
                product_id: product_id,
                classification: classification,
                book_isbn: book_isbn,
                book_name: book_name,
                book_money: book_money,
                book_status: book_status,
                want_to_buy: true
              })
            }
          }
        })
      }
    }
  }
}
</script>

<style src="./OldBool.css" scoped>

</style>