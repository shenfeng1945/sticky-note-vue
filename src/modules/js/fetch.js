import Toast from './toast'
import axios from 'axios'
function fetch(url,data){
    if(data){
        return new Promise((resolve,reject)=>{
            axios.post(url,data)
             .then(res=>{
               resolve(res)
             }).catch(({response})=>{
                Toast(response.data.error,1000,'error')
             })
        })
    }else{
        return new Promise((resolve,reject)=>{
            axios.get(url)
             .then(res=>{
               resolve(res)
             }).catch(({response})=>{
                Toast(response.data.error,1000,'error')
             })
        })
    }
}
export default fetch