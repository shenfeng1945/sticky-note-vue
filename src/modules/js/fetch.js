// import Toast from './toast'
import axios from 'axios'
function fetch(url,data){
    if(data){
        return new Promise((resolve,reject)=>{
            axios.post(url,data)
             .then(res=>{
               resolve(res)
             }).catch(()=>{
                // Toast('网络异常')
             })
        })
    }else{
        return new Promise((resolve,reject)=>{
            axios.get(url)
             .then(res=>{
               resolve(res)
             }).catch(()=>{
                // Toast('网络异常')
             })
        })
    }
}
export default fetch