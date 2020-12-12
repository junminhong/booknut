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
        console.log(doc_data)
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
    },
    computerType: function (){
      this.classification_type = 'computer_book'
    },
    religiousHumanities: function (){
      this.classification_type = 'religious_humanities_book'
    },
    artDesign: function (){
      this.classification_type = 'art_design_book'
    },
    travelFool: function (){
      this.classification_type = 'travel_fool_book'
    },
    parentChild: function (){
      this.classification_type = 'parent_child_book'
    },
    comicNovel: function (){
      this.classification_type = 'comic_novel_book'
    },
    businessFinance: function (){
      this.classification_type = 'business_finance_book'
    },
    addShopCart: function (product_id, seller_uid){
      if (seller_uid !== this.user.uid){
        let shop_cart_count = 0
        db.database().ref("/users/" + this.user.uid + '/shop_cart').get().then(snapshot => {
          shop_cart_count = snapshot.numChildren()
          if (shop_cart_count === 0){
            db.database().ref("/users/" + this.user.uid + '/shop_cart' + '/' + shop_cart_count).update({
              product_id: product_id
            })
          }else {
            let shop_cart = snapshot.val()
            let canAddCart = true
            shop_cart.forEach(shop_cart_product_id => {
              if (shop_cart_product_id.product_id === product_id) {
                canAddCart = false
              }
            })
            if (canAddCart){
              db.database().ref("/users/" + this.user.uid + '/shop_cart' + '/' + shop_cart_count).update({
                product_id: product_id
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