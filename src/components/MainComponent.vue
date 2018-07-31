<template>
    <div id="app">
        <header>
            <div class="header">
                <div class="title">Daskys
                    <span>在线便签</span>
                </div>
                <ul>
                    <li :class="{active:nowRank === 'all'}" @click="getAllNoteLists()">全部</li>
                    <li :class="{active:nowRank === 'haveDone'}" @click="getNoteDoneLists()">已完成</li>
                    <li :class="{active:nowRank === 'sort'}" class="last">
                        <span @click="getNoteSort()">{{sortRank.direc==='+'?'正序':'反序'}}</span>
                        <div @click="showDropDown()" class="odd"></div>
                        <div v-if="isShowDropDown" class="choose">
                            <div @click="setSortRankKind('time')" class="createTime" :class="{active:sortRank.kind === 'time'}">创建时间</div>
                            <div @click="setSortRankKind('star')" class="starNums" :class="{active:sortRank.kind === 'star'}">星级数</div>
                        </div>
                    </li>
                </ul>
                <div class="github">
                    <a href="http://127.0.0.1:3000/auth/github">
                        <svg class="icon icon-28" style="fill:white;">
                            <use xlink:href="#icon-github"></use>
                        </svg>
                        <p>
                            GitHub登陆
                        </p>
                    </a>
                </div>
            </div>
        </header>
        <div id="content" v-if="noteLists">
            <div class="note" 
                 v-for="(item,noteIndex) in noteLists" 
                 :style="{left:item.left+'px',top:item.top+'px'}" 
                 :key="noteIndex" 
                 :class="{active:!isNoteMove,topside:item.isTop}">
                <div class="head-note" 
                     @mousedown="mousedown($event,item)" 
                     @mousemove="mousemove($event,item)" 
                     @mouseup="mouseup(item)">
                    <div class="time">{{item.createdAt.split(' ')[0].replace(/\-/,'年').replace(/\-/,'月').replace(/$/,'日')}}</div>
                </div>
                <div class="close" @click="deleteNote(item.id)">
                    <svg class="icon icon-20">
                        <use xlink:href="#icon-close"></use>
                    </svg>
                </div>
                <div class="context">
                    <div v-if="!item.isEditing" @click="editNote(item)">
                        {{item.text}}
                    </div>
                    <textarea v-else v-focus 
                              @blur="switchNote(item)" 
                              @change="updateNote(item)" 
                              v-model="item.text" 
                              name="" id="" cols="30" rows="10">
                    </textarea>
                </div>
                <div class="stars" :class="item.className">
                    <svg class="icon icon-18 icon-star" 
                         v-for="(_,starIndex) in starLength" 
                         :key="starIndex" 
                         @click="changeStar(noteIndex,starIndex)" 
                         viewBox="0 0 1024 1024" width="100%" height="100%">
                        <path d="M956 398.5c-10.4-31-36.9-53.3-69.2-58.2L682.1 309l-91.6-195c-7.3-15.6-18.9-28.5-33.6-37.4-13.5-8.2-29.1-12.5-44.9-12.5-15.9 0-31.4 4.3-44.9 12.5-14.7 8.9-26.3 21.8-33.6 37.4l-91.6 195-204.7 31.3c-32.3 4.9-58.8 27.2-69.2 58.2-10.4 31-2.6 64.7 20.2 88.1l150.7 154.5-35.6 218c-4.1 25.2 3 50.7 19.5 70.1 16.6 19.5 40.7 30.7 66.2 30.7 14.6 0 29.1-3.8 42-10.9l181-100 181 100.1c12.9 7.1 27.4 10.9 42 10.9 25.5 0 49.6-11.2 66.2-30.7 16.5-19.4 23.6-44.9 19.5-70.1l-35.6-218 150.7-154.5c22.8-23.4 30.5-57.2 20.2-88.2z"></path>
                    </svg>
                </div>
                <div class="finish" :class="{done:item.finish?true:false}" @click="finish(item)">
                    <span v-if="item.finish">已完成</span>
                    <svg v-if="!item.finish" class="icon icon-check">
                        <use xlink:href="#icon-check"></use>
                    </svg>
                </div>
            </div>
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
// import WaterFall from '../modules/js/waterfall.js'
import sortRank from "../modules/js/sort.js";
// import Toast from '../modules/js/toast.js'
import noteService from "../modules/js/noteService.js";
import "../modules/css/index.less";
import "../assets/js/icon.js";
let options =  {
  name: "app",
  data() {
    return {
      noteLists: null,
      starLength: 5,
      isAddNote: false,
      addNotes: {
        star: 0,
        text: ""
      },
      isNoteMove: false,
      curClient: [0, 0],
      moveClient: [0, 0],
      element: null,
      nowRank: "all",
      sortRank: { direc: "+", kind: "time" },
      isShowDropDown: false
    };
  },
  created() {
    this.getNoteLists();
    console.log(document.cookie,'cookie')
    // this.getLocal();
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
      //    this.setSortRank()
    },
    getAllNoteLists() {
      this.nowRank = "all";
      this.getNoteLists();
    },
    getNoteLists() {
      noteService.list().then(res => {
          console.log(res,'res')
        this.setNoteAttri(res.data);
        if (this.nowRank === "sort") {
          this.setLocal();
          this.setSortRank();
        }
      });
    },
    getNoteDoneLists() {
      this.nowRank = "haveDone";
      noteService.list().then(res => {
        res.data = res.data.filter(item => item.finish);
        this.setNoteAttri(res);
        let data = res.data;
        data.map(item => {
          item.isEditing = false;
          item.left = 0;
          item.top = 0;
        });
        this.noteLists = data;
        this.setStar(res.data);
        // setTimeout(() => {
        //   this.doWaterFall();
        // }, 0);
        this.setSortRank();
      });
    },
    setNoteAttri(res) {
      let data = res.data;
      console.log(res);
      data.map(item => {
        item.isEditing = false;
        item.left = 0;
        item.top = 0;
        item.isTop = false;
      });
      this.noteLists = data;
      this.setStar(res.data);
      // setTimeout(() => {
      //   this.doWaterFall();
      // }, 0);
    },
    changeStar(noteIndex, starIndex) {
      noteService
        .editStar(this.noteLists[noteIndex].id, "" + (starIndex + 1))
        .then(res => {
          if (res.status === 200) {
            this.getNoteLists();
          } else if (res.status === 400) {
            // Toast(res.errorMsg);
          }
        });
    },
    setStar(data) {
      this.noteLists.forEach(item => {
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
    editNote(item) {
      item.isEditing = true;
    },
    switchNote(item) {
      item.isEditing = false;
    },
    updateNote(item) {
      noteService.editNote(item.id, item.text).then(res => {
        if (res.status === 200) {
          // Toast(res.msg);
        } else if (res.status === 400) {
          // Toast(res.errorMsg);
        }
      });
    },
    addNote() {
      if (!this.addNotes.text) {
        // Toast("内容不可为空");
        return;
      }
      noteService
        .addNote(this.addNotes.text, this.addNotes.star + "", false)
        .then(res => {
          if (res.status === 200) {
            this.getNoteLists();
            this.closeModel();
          } else if (res.status === 400) {
            // Toast(res.errorMsg, 1000, "error");
            return;
          }
        });
    },
    closeModel() {
      this.isAddNote = false;
      this.addNotes.text = "";
      this.addNotes.star = 0;
    },
    mousedown(e, item) {
      this.isNoteMove = true;
      item.isTop = true;
      this.curClient = [e.clientX - item.left, e.clientY - item.top];
    },
    mousemove(e, item) {
      if (this.isNoteMove) {
        item.left = e.clientX - this.curClient[0];
        item.top = e.clientY - this.curClient[1];
      }
    },
    mouseup(item) {
      item.isTop = false;
      this.isNoteMove = false;
    },
    deleteNote(id) {
      noteService.deleteNote(id).then(res => {
        if (res.status === 200) {
          // Toast("删除成功!");
          this.getNoteLists();
        } else if (res.status === 400) {
          // Toast(res.errorMsg);
        }
      });
    },
    initNoteStyle(el) {
      Array.from(el.children).forEach((item, i) => {
        this.noteLists[i].left = parseInt(item.style.getPropertyValue("left"));
        this.noteLists[i].top = parseInt(item.style.getPropertyValue("top"));
      });
    },
    doWaterFall() {
      // WaterFall.init(this.element);
      this.initNoteStyle(this.element);
    },
    finish(item) {
      noteService.editFinish(item.id, !item.finish).then(res => {
        if (res.status === 200) {
          item.finish = !item.finish;
        } else if (res.status === 400) {
          // Toast(res.errorMsg);
        }
      });
      if (this.nowRank === "haveDone") {
        this.getNoteDoneLists();
      }
    },
    showDropDown() {
      this.isShowDropDown = !this.isShowDropDown;
    },
    getNoteSort() {
      if (this.nowRank !== "sort") {
        this.nowRank = "sort";
      } else {
        this.sortRank.direc = this.sortRank.direc === "+" ? "-" : "+";
      }
      noteService.list().then(res => {
        this.setNoteAttri(res);
        this.setLocal();
        this.setSortRank();
        // this.doWaterFall();
      });
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
      this.noteLists = sortRank.replaceArray(this.noteLists, this.sortRank);
    },
    closeDropDown(e) {
      if (e.target.className === "odd") {
        return;
      }
      if (this.isShowDropDown) {
        this.isShowDropDown = false;
      }
    }
  },
  directives: {
    focus: {
      inserted(el) {
        el.focus();
      }
    },
    waterfall: {
      inserted(el) {
        WaterFall.init(el);
        options.initNoteStyle(el);
        options.element = el;
        window.onresize = () => {
          WaterFall.init(vue.element);
          options.initNoteStyle(options.element);
        };
      }
    }
  }
};
export default options
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
