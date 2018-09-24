const Sequelize = require('sequelize');
const path = require('path')
const sequelize = new Sequelize(undefined, undefined, undefined, {
    host: 'localhost',
    dialect: 'sqlite',
    storage: path.join(__dirname,'../database/database.splite')
});

var Note = sequelize.define('note', {
    text: {
        type: Sequelize.STRING
    },
    star:{
        type:Sequelize.STRING
    },
    finish:{
        type:Sequelize.BOOLEAN
    },
    userId:{
        type:Sequelize.STRING
    }
})
// Note.sync({force:true})

// Note.sync().then(() => {
//     Note.create({ text: 'hello world',star:'4',finish:false,userId: '27106362'})
// }).then(() => {
//     Note.findAll({raw:true}).then(res => {
//         console.log(res)
//     })
// })

// Note.findAll({raw:true}).then(res=>{
//     console.log(res)
// })

// Note.destroy({raw:true,where:{id:2}}).then(res=>{
//     console.log(res)
// })
module.exports = Note;