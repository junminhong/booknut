import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/components/HomeComponent/Home'
import Signup from '../components/SignUpComponent/SignUp'
import SignIn from "@/components/SignInComponent/SignIn"
import NewBook from "@/components/NewBookComponent/NewBook"
import Profile from '@/components/ProfileComponent/Profile'
import OldBook from "@/components/OldBookComponent/OldBook"
import ProductRelease from "@/components/ProductReleaseComponent/ProductRelease"
import Discuss from "@/components/DiscussComponent/Discuss"
import AllReleaseProduct from "@/components/AllReleaseProductComponent/AllReleaseProduct"
import ShopCart from "@/components/ShopCartComponent/ShopCart"
import QRCodeScanner from "@/components/QRCodeScannerComponent/QRCodeScanner"
import db from "@/db";
import TransactionProcess from "@/components/TransactionProcessComponent/TransactionProcess";

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup,
    meta: { isLoginAuth: true }
  },
  {
    path: '/signin',
    name: 'SingIn',
    component: SignIn,
    meta: { isLoginAuth: true }
  },
  {
    path: '/new',
    name: 'NewBook',
    component: NewBook
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true }
  },
  {
    path: '/old',
    name: 'OldBook',
    component: OldBook
  },
  {
    path: '/release',
    name: 'ProductRelease',
    component: ProductRelease,
    meta: { requiresAuth: true, realDataAuth: true }
  },
  {
    path: '/discuss',
    name: 'Discuss',
    component: Discuss
  },
  {
    path: '/allrelease',
    name: 'AllReleaseProduct',
    component: AllReleaseProduct,
    meta: { requiresAuth: true, realDataAuth: true }
  },
  {
    path: '/shopcart',
    name: 'ShopCart',
    component: ShopCart
  },
  {
    path: '/scanqrcode',
    name: 'QRCodeScanner',
    component: QRCodeScanner,
    meta: { requiresAuth: true, realDataAuth: true }
  },
  {
    path: '/transactionprocess',
    name: 'TransactionProcess',
    component: TransactionProcess,
    meta: { requiresAuth: true, realDataAuth: true }
  }
]


const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  // 如果 router 轉跳的頁面需要驗證 requiresAuth: true
  if(to.meta.requiresAuth){
    db.auth().onAuthStateChanged(user => {
      if (to.meta.realDataAuth){
        db.firestore().collection("users").doc(user.uid).get().then(result=>{
          let user_id_number = result.data().user_id_number
          let user_phone = user.phoneNumber
          if (user_id_number !== '' && user_id_number !== undefined && user_phone !== '' && user_phone !== undefined){
            next()
          }else{
            location.href = 'old'
          }
        })
      }else{
        if (user != null && user.emailVerified){
          next()
        }else{
          location.href = 'signin'
        }
      }
    })
  }else if(to.meta.isLoginAuth){
    db.auth().onAuthStateChanged(user =>{
      if (user != null && user.emailVerified){
        console.log(user)
        location.href = '/'
      }else{
        next()
      }
    })
  }
  next()
});

export default router
