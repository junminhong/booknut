<template src="./NutWalletRecord.html">

</template>

<script>
import db from "@/db";
import VueQrcode from "vue3-qrcode";

export default {
  name: "NutWalletRecord",
  data(){
    return{
      record_search_type: 'not_ok',
      all_record_data: '',
      total_index: 1,
    }
  },
  props: {
    user: Object,
  },
  components: {
    VueQrcode,
  },
  mounted() {
    this.showAllRecord()
  },
  methods:{
    showAllRecord:function (){
      if (this.record_search_type === 'not_ok'){
        this.notOkShowRecord()
      }else if(this.record_search_type === 'ok'){
        this.okShowRecord()
      }
    },
    notOkShowRecord:function (){
      db.firestore().collection("users").doc(this.user.uid).collection("wallet_record").get().then(all_doc=>{
        let all_doc_data = []
        all_doc.forEach(doc=>{
          all_doc_data.push(doc)
        })
        this.all_record_data = all_doc_data
        if (all_doc_data.length < 10){
          this.total_index = 1
        }else{
          let all_doc_data_len = all_doc_data.length
          this.total_index += parseInt(all_doc_data_len / 10)
        }
      })
    },
    okShowRecord: function (){

    }
  }
}
</script>

<style src="./NutWalletRecord.css" scoped>

</style>