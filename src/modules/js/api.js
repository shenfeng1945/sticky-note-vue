let url = {
  articleLists: "/api/notes",
  starEdit: "/api/notes/editStar",
  articleEdit: "/api/notes/edit",
  addNote: "/api/notes/add",
  deleteNote: "/api/notes/delete",
  editFinish: "/api/notes/finish"
};
let host = "https://shenfeng2023.cn:6060";
for (let key in url) {
  if (url.hasOwnProperty(key)) {
    url[key] = host + url[key];
  }
}
export default url;
