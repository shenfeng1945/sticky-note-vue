var express = require('express');
var router = express.Router()
var Note = require('../model/note')
var Authorization = require('../middlewares/judgeAuthorization')

/*
1. 获取所有的note: Get /api/notes          req:{},    res:{status:200,data:[{},{}]}  {status:400,errorMsg:'失败的原因'}
2. 创建一个note:Post /api/note/add         req:{note:'hello world'}   res:{status:200}  {status:400,errorMsg:'失败的原因'}
3. 修改一个note: Post  /api/note/edit      req:{note:'new note',id:3}
4. 删除一个note: Post /api/note/delete     req:{id:2}
*/ 

// get notes list
router.get('/notes',Authorization,(req,res,next)=>{
    var opts = {where:{id:0}}
    if(req.userId){
      let userId = req.userId
      opts = {where:{userId}}
    }      
    Note.findAll(opts).then(notes=>{
      res.send({status:200,data:notes})
    }).catch(()=>res.send({status:200,data:[]}))
})
//修改星星等级
router.post('/notes/editStar',Authorization,(req,res,next)=>{
    if(!req.userId){
        // 若不加return 会出现‘Can't set headers after they are sent.’报错
        return res.status(400).json({error: '请先登录'})
      }
  var noteId =req.body.id;
  var userId = req.userId;
  var star = req.body.star;
  Note.update({star},{where:{id:noteId,userId}}).then(lists=>{
      res.send({status:200,msg:'更新成功'})
  }).catch(()=>{
      res.send({status:400,errorMsg:'数据库异常或者你没有权限'})
  })
})
//修改内容
router.post('/notes/edit',Authorization,(req,res,next)=>{
    if(!req.userId){
        return res.status(400).json({error: '请先登录'})
      }
    var noteId = req.body.id;
    var note = req.body.note;
    var userId = req.userId;
    Note.update({text:note},{where:{id:noteId,userId}}).then(lists=>{
       res.send({status:200,msg:'更新成功'})
    }).catch(_=>{
       res.send({status:400,errorMsg:'数据库异常或者你没有权限'})
    })
})

router.post('/notes/finish',Authorization,(req,res,next)=>{
    if(!req.userId){
        return res.status(400).json({error:'请先登录'})
      }
    var noteId = req.body.id;
    var finish = req.body.finish;
    var userId = req.userId;
    Note.update({finish},{where:{id:noteId,userId}}).then(lists=>{
       res.send({status:200,msg:'修改成功'})
    }).catch(_=>{
       res.send({status:400,errorMsg:''})
        res.status(400).json({error:'数据库异常或者你没有权限'})
    })
})

router.post('/notes/add',Authorization,(req,res,next)=>{
    if(!req.userId){
        return res.status(400).json({error: '请先登录'})
    }
    var note = req.body.note;
    var userId = req.userId;
    var star = req.body.star;
    var finish = req.body.finish;
    Note.create({text:note,star,finish,userId}).then(()=>{
        res.send({status:200})
    }).catch(()=>{
        res.send({status:400,errorMsg:'数据库异常或者你没有权限'})
    })
})

router.post('/notes/delete',Authorization,(req,res,next)=>{
    if(!req.userId){
        return res.send({status:400,errorMsg:'请先登录'})
      }
    var noteId = req.body.id
    var userId = req.userId
    Note.destroy({where:{id:noteId,userId}}).then(deleteLen=>{
        if(deleteLen === 0){
            return res.send({status:404,errorMsg:'你没有权限'})
        }
        res.send({status:200})
    }).catch(()=>{
        res.send({status:404,errorMsg:'数据库异常或者你没有权限'})
    })
})

module.exports = router;