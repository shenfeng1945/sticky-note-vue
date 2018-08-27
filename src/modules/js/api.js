let url = {
    articleLists: '/api/notes',
    starEdit: '/api/notes/editStar',
    articleEdit: '/api/notes/edit',
    addNote: '/api/notes/add',
    deleteNote:'/api/notes/delete',
    editFinish: '/api/notes/finish',
}
let host= 'http://127.0.0.1:3000'
// let host= 'http://shenfeng1945.top:3000'
for(let key in url){
    if(url.hasOwnProperty(key)){
        url[key] = host + url[key]
    }
}
export default url