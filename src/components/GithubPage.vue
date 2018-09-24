<template>
   <div>
      <div class="github" v-if="!isAuthorizate">
        <a href="https://shenfeng1945.xyz:6060/auth/github">
             <svg class="icon icon-28" style="fill:white;">
                <use xlink:href="#icon-github"></use>
             </svg>
             <p>
                GitHub登陆
             </p>
        </a>
      </div>
      <div v-else class="isLogin">
         <img :src="user.avatar" class="avatar" alt="">
         {{user.username}}
         <div class="logout" @click="logout()">登出</div>
      </div>
   </div>
</template>
<script>
import jwtDecode from 'jwt-decode'
import axios from 'axios'
export default {
    data(){
        return {
           user: {},
           isAuthorizate: false,
        }
    },
    created(){
       if(this.getToken()){
         this.user = jwtDecode(this.getToken())
         this.setAuthorizationToken(this.getToken())
       }
       if(this.user.username){
          this.$parent.getAllNoteLists()
       }
    },
    methods: {
        getToken(){
           return localStorage.getItem('token')    
        },
        setAuthorizationToken(jwtToken){
            if(jwtToken){
                this.isAuthorizate = true;
                axios.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`;
            }else{
                this.isAuthorizate = false;
                delete axios.defaults.headers.common['Authorization'];
            }
        },
        logout(){
            localStorage.removeItem('token');
            this.setAuthorizationToken(false)
            this.$parent.getNoteLists();
        }
    },
}
</script>

<style scoped>
  .isLogin{
      display: flex;
      align-items: center;
  }
  .logout{
      margin-left: 10px;
      color: #00d3aa;
      cursor: pointer;
  }
  .avatar{
      width:36px;
      height: 36px;
      vertical-align: middle;
      border-radius: 50%;
      margin-right:5px;
  }

</style>

