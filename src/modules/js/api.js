let url = {
  articleLists: "/api/notes",
  starEdit: "/api/notes/editStar",
  articleEdit: "/api/notes/edit",
  addNote: "/api/notes/add",
  deleteNote: "/api/notes/delete",
  editFinish: "/api/notes/finish"
};
// let host = "https://shenfeng1945.cn:6060";
let host = "https://sticky-note-vue.onrender.com";
for (let key in url) {
  if (url.hasOwnProperty(key)) {
    url[key] = host + url[key];
  }
}
export default url;
