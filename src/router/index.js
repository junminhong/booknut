import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/components/HomeComponent/Home'
import Signup from '../components/SignUpComponent/SignUp'
import SignIn from "@/components/SignInComponent/SignIn"
import NewBook from "@/components/NewBookComponent/NewBook"
import Profile from '@/components/ProfileComponent/Profile'
import OldBook from "@/components/OldBookComponent/OldBook"
import ProductRelease from "@/components/ProductReleaseComponent/ProductRelease"
import Discuss from "@/components/DiscussComponent/Discuss"
import AllReleaseProduct from "@/components/AllReleaseProduct/AllReleaseProduct"
import ShopCart from "@/components/ShopCart/ShopCart"
import QRCodeScanner from "@/components/QRCodeScanner/QRCodeScanner"
import QrcodeStream from 'vue-qrcode-reader'

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
    component: Signup
  },
  {
    path: '/signin',
    name: 'SingIn',
    component: SignIn
  },
  {
    path: '/new',
    name: 'NewBook',
    component: NewBook
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile
  },
  {
    path: '/old',
    name: 'OldBook',
    component: OldBook
  },
  {
    path: '/release',
    name: 'ProductRelease',
    component: ProductRelease
  },
  {
    path: '/discuss',
    name: 'Discuss',
    component: Discuss
  },
  {
    path: '/allrelease',
    name: 'AllReleaseProduct',
    component: AllReleaseProduct
  },
  {
    path: '/shopcart',
    name: 'ShopCart',
    component: ShopCart
  },
  {
    path: '/scanqrcode',
    name: 'QRCodeScanner',
    component: QRCodeScanner, QrcodeStream
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
