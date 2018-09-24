<template>
  <div>
  </div>
</template>
<script>
export default {
    created(){
      const token = this.$router.currentRoute.query.token
      if(token){
         this.successLogin(token)
      }else{
         this.$router.replace('/')
      }
    },
    methods: {
        successLogin(token){
            localStorage.setItem('token',token)
            this.$router.replace('/')
        }
    }
}
</script>

