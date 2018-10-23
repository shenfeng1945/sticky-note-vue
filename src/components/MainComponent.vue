<template>
    <div id="app">
        <header>
            <div class="header">
                <div class="title">Sticky
                    <span>在线便签</span>
                </div>
                <ul>
                    <li :class="{active:nowRank === 'all'}" @click="getAllNoteLists()">全部</li>
                    <li :class="{active:nowRank === 'haveDone'}" @click="getNoteDoneLists()">已完成</li>
                    <li :class="{active:nowRank === 'sort'}" class="last">
                        <span @click="getNoteSort()">{{sortRank.direc==='+'?'正序':'反序'}}</span>
                        <div @click="showDropDown($event)" class="odd"></div>
                        <div v-if="isShowDropDown" class="choose">
                            <div @click="setSortRankKind('time')" class="createTime" :class="{active:sortRank.kind === 'time'}">创建时间</div>
                            <div @click="setSortRankKind('star')" class="starNums" :class="{active:sortRank.kind === 'star'}">星级数</div>
                        </div>
                    </li>
                </ul>
                <GithubPage/>
            </div>
        </header>
        <div id="content" v-if="currentNoteLists" v-waterfall>
           <ContentItem v-for="item in currentNoteLists"
                        :key="item.id" 
                        :item="item"/>
        </div>
        <div class="bottom-icon">
            <!-- <div class="up">
                <svg class="icon icon-36">
                    <use xlink:href="#icon-up"></use>
                </svg>
            </div> -->
            <div class="add" @click="isAddNote = true">
                <svg class="icon icon-36">
                    <use xlink:href="#icon-add"></use>
                </svg>
            </div>
        </div>
        <div class="add-wrapper" v-if="isAddNote">
            <div class="add-model">
                <h3>添加新便签</h3>
                <div class="close-model" @click="closeModel()">
                    <svg class="icon icon-28">
                        <use xlink:href="#icon-close"></use>
                    </svg>
                </div>
                <div class="input-note">
                    <textarea v-model="addNotes.text" class="input-text" placeholder="输入内容"></textarea>
                </div>
                <div class="set-star">
                    <span>重要星级:</span>
                    <div class="stars" :class="'star'+addNotes.star">
                        <svg class="icon icon-18 icon-star" v-for="(_,starIndex) in starLength" :key="starIndex" viewBox="0 0 1024 1024" @click="addNotes.star = (starIndex+1)" width="100%" height="100%">
                            <path d="M956 398.5c-10.4-31-36.9-53.3-69.2-58.2L682.1 309l-91.6-195c-7.3-15.6-18.9-28.5-33.6-37.4-13.5-8.2-29.1-12.5-44.9-12.5-15.9 0-31.4 4.3-44.9 12.5-14.7 8.9-26.3 21.8-33.6 37.4l-91.6 195-204.7 31.3c-32.3 4.9-58.8 27.2-69.2 58.2-10.4 31-2.6 64.7 20.2 88.1l150.7 154.5-35.6 218c-4.1 25.2 3 50.7 19.5 70.1 16.6 19.5 40.7 30.7 66.2 30.7 14.6 0 29.1-3.8 42-10.9l181-100 181 100.1c12.9 7.1 27.4 10.9 42 10.9 25.5 0 49.6-11.2 66.2-30.7 16.5-19.4 23.6-44.9 19.5-70.1l-35.6-218 150.7-154.5c22.8-23.4 30.5-57.2 20.2-88.2z"></path>
                        </svg>
                    </div>
                </div>
                <div class="add">
                    <button @click="addNote()">添加</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import WaterFall from '../modules/js/waterfall.js'
import sortRank from "../modules/js/sort.js";
import Toast from '../modules/js/toast.js'
import noteService from "../modules/js/noteService.js";
import "../modules/css/index.less";
import "../assets/js/icon.js";
import GithubPage from './GithubPage'
import ContentItem from './ContentItem'
let options =  {
  name: "app",
  data() {
    return {
      currentNoteLists: null,
      starLength: 5,
      isAddNote: false,
      addNotes: {
        star: 0,
        text: ""
      },
      isNoteMove: false,
      element: null,
      nowRank: "all",
      sortRank: { direc: "+", kind: "time" },
      isShowDropDown: false,
    };
  },
  created() {
    this.getLocal();
    document.addEventListener('click',()=>{
      this.isShowDropDown = false;
    })
  },
  methods: {
    setLocal() {
      localStorage.setItem("sort", JSON.stringify(this.sortRank));
    },
    getLocal() {
      if (!localStorage.getItem("sort")) {
        this.setLocal();
      } else {
        this.sortRank = JSON.parse(localStorage.getItem("sort"));
      }
    //  this.setSortRank()
    },
    getAllNoteLists() {
      this.nowRank = "all";
      noteService.list().then(res => {
        this.currentNoteLists = Object.assign([],res.data.data);
        this.setNoteAttri();
        setTimeout(()=>{
          this.doWaterFall()
        },0)
      })   
    },
    getNoteLists() {
      if(this.nowRank === 'all'){
         this.getAllNoteLists()
      }else if(this.nowRank === 'haveDone'){
        this.getNoteDoneLists();
      }else if(this.nowRank === 'sort'){
        this.getNoteSort();
      }
    },
    getNoteDoneLists() {
      this.nowRank = "haveDone";
      noteService.list().then(res => {
        this.currentNoteLists = Object.assign([],res.data.data).filter(item=>item.finish)
        this.setNoteAttri();
        setTimeout(()=>{
          this.doWaterFall()
        },0)
      })
    },
    setNoteAttri() {
      this.currentNoteLists.map(item=>{
        item.isEditing = false;
        item.left = 0;
        item.top = 0;
        item.isTop = false;
        item.createdAt = new Date(item.createdAt).toLocaleDateString()
      })
      this.setStar();
      // setTimeout(() => {
      //   this.doWaterFall();
      // }, 0);
    },
    doWaterFall(){
      WaterFall.init(this.element)
    },
    setStar() {
      this.currentNoteLists.forEach(item => {
        let num = item.star;
        switch (num) {
          case "0":
            item["className"] = "star0";
            break;
          case "1":
            item["className"] = "star1";
            break;
          case "2":
            item["className"] = "star2";
            break;
          case "3":
            item["className"] = "star3";
            break;
          case "4":
            item["className"] = "star4";
            break;
          case "5":
            item["className"] = "star5";
            break;
        }
      });
    },
    addNote() {
      if (!this.addNotes.text) {
        Toast("内容不可为空");
        return;
      }
      noteService
        .addNote(this.addNotes.text, this.addNotes.star + "", false)
        .then(res => {
          if (res.status === 200) {
            this.getNoteLists();
            this.closeModel();
            Toast('添加成功')
          } else if (res.status === 400) {
            Toast(res.errorMsg, 1000, "error");
            return;
          }
        });
    },
    closeModel() {
      this.isAddNote = false;
      this.addNotes.text = "";
      this.addNotes.star = 0;
    },
    initNoteStyle(el) {
      Array.from(el.children).forEach((item, i) => {
        this.noteLists[i].left = parseInt(item.style.getPropertyValue("left"));
        this.noteLists[i].top = parseInt(item.style.getPropertyValue("top"));
      });
    },
    showDropDown(e) {
      e.stopPropagation();
      this.isShowDropDown = !this.isShowDropDown;
    },
    getNoteSort() {
      if (this.nowRank !== "sort") {
        this.nowRank = "sort";
      } else {
        this.sortRank.direc = this.sortRank.direc === "+" ? "-" : "+";
      }
      noteService.list().then(res => {
         this.currentNoteLists = Object.assign([],res.data.data);
         this.setSortRank();
      })
    },
    setSortRankKind(string) {
      this.isShowDropDown = false;
      this.sortRank.kind = string;
      this.setLocal();
      if (this.nowRank === "sort") {
        this.setSortRank();
        // this.doWaterFall();
      }
    },
    setSortRank() {
      this.currentNoteLists = Object.assign([],sortRank.replaceArray(this.currentNoteLists, this.sortRank));
      setTimeout(()=>{
        this.doWaterFall()
      },0)
    },
    closeDropDown(e) {
      if (e.target.className === "odd") {
        return;
      }
      if (this.isShowDropDown) {
        this.isShowDropDown = false;
      }
    },
    changeStar(id,starIndex){
      this.currentNoteLists.map(item=>{
        if(item.id === id){
          item.className = `star${starIndex+1}`
        }
      })
    },
    deleteNoteById(id){
      this.currentNoteLists = this.currentNoteLists.filter(item=>item.id!==id)
      this.setSortRank();
    }
  },
  directives: {
    focus: {
      inserted(el) {
        el.focus();
      }
    },
    waterfall: {
      inserted(el,a,b){
        WaterFall.init(el);
    //     options.initNoteStyle(el);
        b.context.element = el;
    //     window.onresize = () => {
    //       WaterFall.init(vue.element);
    //       options.initNoteStyle(options.element);
    //     };
      }
    }
  },
  components:{
    GithubPage,
    ContentItem,
  }
};
export default options
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
