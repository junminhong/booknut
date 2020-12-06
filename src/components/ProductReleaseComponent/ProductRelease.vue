<template src="./ProductRelease.html">

</template>

<script>
import { uid } from 'uid'
let dateFormat = require("dateformat")
import db from "@/db"
export default {
  name: "ProductRelease",
  props: {
    user: Object,
  },
  data(){
    return{
      book_one_pic: '',
      book_two_pic: '',
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
      book_name_error_msg: '',
      book_publishing_house_error_msg: '',
      book_publishing_date_error_msg: '',
      book_status_error_msg: '',
      book_classification_error_msg: '',
      book_money_error_msg: '',
      book_description_error_msg: '',
      book_transaction_error_msg: '',
      book_shipment_error_msg: '',
      book_shipment_date_error_msg: '',
      book_isbn_error_msg: '',
      book_one_pic_error_msg: '',
      book_two_pic_error_msg: '',
      can_release_product: '',
      product_uuid: ''
    }
  },
  methods:{
    previewOnePic: function (file){
      console.log(file)
      console.log(file.target.files)
      this.book_one_pic = file.target.files[0]
      console.log(uid(32))
      let date = dateFormat(new Date(), "yyyy-mm-dd HH:mm:ss")
      console.log(date)
      let book_one_pic_img = document.getElementById('book_one_pic_img');
      book_one_pic_img.src = URL.createObjectURL(file.target.files[0]);
      book_one_pic_img.onload = function() {
        URL.revokeObjectURL(book_one_pic_img.src)
        book_one_pic_img.hidden = false
      }
    },
    previewTwoPic: function (file){
      this.book_two_pic = file.target.files[0]
      let book_two_pic_img = document.getElementById('book_two_pic_img');
      book_two_pic_img.src = URL.createObjectURL(file.target.files[0]);
      book_two_pic_img.onload = function() {
        URL.revokeObjectURL(book_two_pic_img.src)
        book_two_pic_img.hidden = false
      }
    },
    checkFrom: function (){
      /*
      * 檢查表單
      * */
      this.can_release_product = true
      if (this.book_name == ''){
        this.book_name_error_msg = '書籍名稱不可為空'
        this.can_release_product = false
      }
      if (this.book_status == ''){
        this.book_status_error_msg = '書籍狀況不可為空'
        this.can_release_product = false
      }
      if (this.book_shipment == ''){
        this.book_shipment_error_msg = '書籍寄貨方式不可為空'
        this.can_release_product = false
      }
      if (this.book_description == ''){
        this.book_description_error_msg = '書籍描述不可為空'
        this.can_release_product = false
      }
      if (this.book_shipment_date == ''){
        this.book_shipment_date_error_msg = '書籍出貨天數不可為空'
        this.can_release_product = false
      }
      if (this.book_transaction == ''){
        this.book_transaction_error_msg = '書籍交易方式不可為空'
        this.can_release_product = false
      }
      if (this.book_money == ''){
        this.book_money_error_msg = '書籍金額不可為空'
        this.can_release_product = false
      }
      if (this.book_publishing_house == ''){
        this.book_publishing_house_error_msg = '書籍出版社不可為空'
        this.can_release_product = false
      }
      if (this.book_publishing_date == ''){
        this.book_publishing_date_error_msg = '書籍出版日期不可為空'
        this.can_release_product = false
      }
      if (this.book_isbn == ''){
        this.book_isbn_error_msg = '書籍ISBN不可為空'
        this.can_release_product = false
      }
      if (this.book_classification == ''){
        this.book_classification_error_msg = '書籍分類不可為空'
        this.can_release_product = false
      }
      if (this.book_one_pic == ''){
        this.book_one_pic_error_msg = '書籍圖片需要兩張'
        this.can_release_product = false
      }
      if (this.book_two_pic == ''){
        this.book_two_pic_error_msg = '書籍圖片需要兩張'
        this.can_release_product = false
      }
      if (this.can_release_product){
        this.releaseProduct()
        this.book_name_error_msg = ''
        this.book_publishing_house_error_msg = ''
        this.book_publishing_date_error_msg = ''
        this.book_status_error_msg = ''
        this.book_classification_error_msg = ''
        this.book_money_error_msg = ''
        this.book_description_error_msg = ''
        this.book_transaction_error_msg = ''
        this.book_shipment_error_msg = ''
        this.book_shipment_date_error_msg = ''
        this.book_isbn_error_msg = ''
        this.book_one_pic_error_msg = ''
        this.book_two_pic_error_msg = ''
      }
    },
    releaseProduct: function (){
      this.product_uuid = uid(32)
      let date = dateFormat(new Date(), "yyyy-mm-dd HH:mm:ss")
      let storageRef_one = db.storage().ref("release_product_pic/" + this.book_classification + "/" + this.product_uuid + "1.jpg")
      let storageRef_two = db.storage().ref("release_product_pic/" + this.book_classification + "/" + this.product_uuid + "2.jpg")
      if (this.user != null){
        storageRef_one.put(this.book_one_pic)
        storageRef_two.put(this.book_two_pic)
        db.firestore().collection('users').doc(this.user.uid).collection("release_product").doc(this.product_uuid).set({
          book_isbn: this.book_isbn,
          book_name: this.book_name,
          book_publishing_house: this.book_publishing_house,
          book_publishing_date: this.book_publishing_date,
          book_classification: this.book_classification,
          book_description: this.book_description,
          book_status: this.book_status,
          book_transaction: this.book_transaction,
          book_shipment: this.book_shipment,
          book_shipment_date: this.book_shipment_date,
          book_money: this.book_money,
          customer_click_count: 0,
          release_time: date,
          update_time: date
        })
        db.firestore().collection('market_books').doc(this.book_classification).collection("release_product").doc(this.product_uuid).set({
          book_isbn: this.book_isbn,
          book_name: this.book_name,
          book_publishing_house: this.book_publishing_house,
          book_publishing_date: this.book_publishing_date,
          book_classification: this.book_classification,
          book_description: this.book_description,
          book_status: this.book_status,
          book_transaction: this.book_transaction,
          book_shipment: this.book_shipment,
          book_shipment_date: this.book_shipment_date,
          book_money: this.book_money,
          release_time: date,
          update_time: date,
          release_user_uuid: this.user_uid,
          customer_click_count: 0
        }).then(function (){
          location.href = 'release'
        })
      }
    }
  }
}
</script>

<style src="./ProductRelease.css" scoped>

</style>