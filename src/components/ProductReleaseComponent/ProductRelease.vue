<template src="./ProductRelease.html">

</template>

<script>
import { uid } from 'uid'
let dateFormat = require("dateformat")
import db from "@/db"
import Swal from "sweetalert2";
export default {
  name: "ProductRelease",
  props: {
    user: Object,
  },
  mounted() {
    this.checkNowProductType()
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
      product_uuid: '',
      storageRef_one_result: '',
      storageRef_two_result: '',
      product_id: this.$route.query.product_id,
      release_product_type: '發佈商品',
      book_classification_hidden: false
    }
  },
  methods:{
    checkNowProductType: function (){
      if(this.product_id !=='' && this.product_id !== undefined && this.product_id !== null){
        this.release_product_type = '編輯商品'
        this.book_classification_hidden = true
        db.firestore().collection("users").doc(this.user.uid).collection("release_product").doc(this.product_id).get().then(result=>{
          this.book_isbn = result.data().book_isbn
          this.book_name = result.data().book_name
          this.book_publishing_house = result.data().book_publishing_house
          this.book_publishing_date = result.data().book_publishing_date
          this.book_classification = result.data().book_classification
          this.book_description = result.data().book_description
          this.book_status = result.data().book_status
          this.book_transaction = result.data().book_transaction
          this.book_shipment = result.data().book_shipment
          this.book_shipment_date = result.data().book_shipment_date
          this.book_money = result.data().book_money
          let storageRef_one = db.storage().ref("release_product_pic/" + this.book_classification + "/" + this.product_id + "1.jpg")
          let storageRef_two = db.storage().ref("release_product_pic/" + this.book_classification + "/" + this.product_id + "2.jpg")
          storageRef_one.getDownloadURL().then(img_url=>{
            let book_one_pic_img = document.getElementById('book_one_pic_img')
            book_one_pic_img.src = img_url
            book_one_pic_img.hidden = false
          })
          storageRef_two.getDownloadURL().then(img_url=>{
            let book_two_pic_img = document.getElementById('book_two_pic_img');
            book_two_pic_img.src = img_url
            book_two_pic_img.hidden = false
          })
        })
      }else{
        this.release_product_type = '發佈商品'
        this.book_classification_hidden = false
      }
    },
    editProduct: function (){
      let storageRef_one = db.storage().ref("release_product_pic/" + this.book_classification + "/" + this.product_id + "1.jpg")
      let storageRef_two = db.storage().ref("release_product_pic/" + this.book_classification + "/" + this.product_id + "2.jpg")
      if (this.user != null){
        if (this.book_one_pic !== null && this.book_one_pic !== undefined && this.book_one_pic !== ''){
          storageRef_one.delete()
          storageRef_one.put(this.book_one_pic).then(()=>{
            if (this.book_two_pic !== null && this.book_two_pic !== undefined && this.book_two_pic !== ''){
              storageRef_two.delete()
              storageRef_two.put(this.book_two_pic).then(()=>{
                this.editProductA(storageRef_one, storageRef_two)
              }).catch(error=>{
                console.log(error)
              })
            }else {
              this.editProductA(storageRef_one, storageRef_two)
            }
          }).catch(error=>{
            console.log(error)
          })
        }else if (this.book_two_pic !== null && this.book_two_pic !== undefined && this.book_two_pic !== ''){
          storageRef_two.delete()
          storageRef_two.put(this.book_two_pic).then(()=>{
            this.editProductA(storageRef_one, storageRef_two)
          }).catch(error=>{
            console.log(error)
          })
        }else{
          this.editProductA(storageRef_one, storageRef_two)
        }
      }
    },
    editProductA: function (storageRef_one, storageRef_two){
      let date = dateFormat(new Date(), "yyyy-mm-dd HH:mm:ss")
      storageRef_one.getDownloadURL().then( result => {
        this.storageRef_one_result = result
      }).then(()=>{
        storageRef_two.getDownloadURL().then( result => {
          this.storageRef_two_result = result
        }).then(()=>{
          db.firestore().collection('users').doc(this.user.uid).collection("release_product").doc(this.product_id).update({
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
            seller_status: '上架中',
            update_time: date,
            product_one_img_url: this.storageRef_one_result,
            product_two_img_url: this.storageRef_two_result
          }).then(()=>{
            db.firestore().collection('market_books').doc(this.book_classification).collection("release_product").doc(this.product_id).update({
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
              release_user_uuid: this.user.uid,
              customer_click_count: 0,
              seller_status: '上架中',
              update_time: date,
              product_one_img_url: this.storageRef_one_result,
              product_two_img_url: this.storageRef_two_result
            }).then(function (){
              Swal.fire(
                  '賣家中心訊息',
                  "商品編輯成功",
                  'success'
              ).then(()=>{
                location.href = 'allrelease'
              }).catch(error=>{
                console.log(error)
              })
            }).catch(function (){
              Swal.fire(
                  '賣家中心訊息',
                  "商品編輯失敗",
                  'error'
              ).then(()=>{
                location.href = 'allrelease'
              })
            })
          }).catch(error=>{
            console.log(error)
          })
        }).catch(error=>{
          console.log(error)
        })
      }).catch(error=>{
        console.log(error)
      })
    },
    previewOnePic: function (file){
      this.book_one_pic = file.target.files[0]
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
      if (this.book_one_pic == '' && this.release_product_type === '發佈商品'){
        this.book_one_pic_error_msg = '書籍圖片需要兩張'
        this.can_release_product = false
      }
      if (this.book_two_pic == '' && this.release_product_type === '發佈商品'){
        this.book_two_pic_error_msg = '書籍圖片需要兩張'
        this.can_release_product = false
      }
      if (this.can_release_product){
        if (this.release_product_type === '編輯商品'){
          this.editProduct()
        }else{
          this.releaseProduct()
        }
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
        storageRef_one.put(this.book_one_pic).then(()=>{
          storageRef_two.put(this.book_two_pic).then(()=>{
            storageRef_one.getDownloadURL().then( result => {
              this.storageRef_one_result = result
            }).then(()=>{
              storageRef_two.getDownloadURL().then( result => {
                this.storageRef_two_result = result
              }).then(()=>{
                console.log(this.storageRef_one_result)
                console.log(this.storageRef_two_result)
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
                  seller_status: '上架中',
                  release_time: date,
                  update_time: date,
                  product_one_img_url: this.storageRef_one_result,
                  product_two_img_url: this.storageRef_two_result
                }).then(()=>{
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
                    release_user_uuid: this.user.uid,
                    customer_click_count: 0,
                    seller_status: '上架中',
                    release_time: date,
                    update_time: date,
                    product_one_img_url: this.storageRef_one_result,
                    product_two_img_url: this.storageRef_two_result
                  }).then(function (){
                    Swal.fire(
                        '賣家中心訊息',
                        "商品上架成功",
                        'success'
                    ).then(()=>{
                      location.href = 'release'
                    })
                  }).catch(function (){
                    Swal.fire(
                        '賣家中心訊息',
                        "商品上架失敗",
                        'error'
                    ).then(()=>{
                      location.href = 'release'
                    })
                  })
                })
              })
            })
          })
        })
      }
    }
  }
}
</script>

<style src="./ProductRelease.css" scoped>

</style>