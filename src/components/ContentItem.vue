<template>
    <div class="note" :style="{left:noteItem.left+'px',top: noteItem.top+'px'}" v-position :class="{active:!isNoteMove,topside:noteItem.isTop}">
        <div class="head-note" 
             @mousedown="mousedown($event)" 
             @mousemove="mousemove($event)" 
             @mouseup="mouseup()">
            <div class="time">{{getTime(noteItem.createdAt)}}</div>
        </div>
        <div class="close" @click="deleteNote(noteItem.id)">
            <svg class="icon icon-20">
              <use xlink:href="#icon-close"></use>
            </svg>
        </div>
        <div class="context">
            <div v-if="!noteItem.isEditing" @click="editNote()">
                {{noteItem.text}}
            </div>
            <textarea v-else v-focus @blur="switchNote()" @change="updateNote()" v-model="noteItem.text" name="" id="" cols="30" rows="10">
                                                </textarea>
        </div>
        <div class="stars" :class="noteItem.className">
            <svg class="icon icon-18 icon-star" v-for="(_,starIndex) in starLength" :key="starIndex" @click="changeStar(noteItem.id,starIndex)" viewBox="0 0 1024 1024" width="100%" height="100%">
                <path d="M956 398.5c-10.4-31-36.9-53.3-69.2-58.2L682.1 309l-91.6-195c-7.3-15.6-18.9-28.5-33.6-37.4-13.5-8.2-29.1-12.5-44.9-12.5-15.9 0-31.4 4.3-44.9 12.5-14.7 8.9-26.3 21.8-33.6 37.4l-91.6 195-204.7 31.3c-32.3 4.9-58.8 27.2-69.2 58.2-10.4 31-2.6 64.7 20.2 88.1l150.7 154.5-35.6 218c-4.1 25.2 3 50.7 19.5 70.1 16.6 19.5 40.7 30.7 66.2 30.7 14.6 0 29.1-3.8 42-10.9l181-100 181 100.1c12.9 7.1 27.4 10.9 42 10.9 25.5 0 49.6-11.2 66.2-30.7 16.5-19.4 23.6-44.9 19.5-70.1l-35.6-218 150.7-154.5c22.8-23.4 30.5-57.2 20.2-88.2z"></path>
            </svg>
        </div>
        <div class="finish" :class="{done:noteItem.finish?true:false}" @click="finish()">
            <span v-if="noteItem.finish">已完成</span>
            <svg v-if="!noteItem.finish" class="icon icon-check">
                <use xlink:href="#icon-check"></use>
            </svg>
        </div>
    </div>
</template>

<script>
import noteService from "../modules/js/noteService.js";
import Vue from "vue";
import Toast from "../modules/js/toast.js";
export default {
  data() {
    return {
      noteItem: {},
      starLength: 5,
      isNoteMove: false,
      curClient: [0, 0],
      moveClient: [0, 0],
      element: null
    };
  },
  created() {
    this.noteItem = Object.assign({}, this.item);
  },
  methods: {
    mousedown(e) {
      this.noteItem.left = $(this.element)
        .css("left")
        .replace("px", "");
      this.noteItem.top = $(this.element)
        .css("top")
        .replace("px", "");
      this.isNoteMove = true;
      this.noteItem.isTop = true;
      this.curClient = [
        e.clientX - this.noteItem.left,
        e.clientY - this.noteItem.top
      ];
    },
    mousemove(e) {
      if (this.isNoteMove) {
        this.noteItem.left = e.clientX - this.curClient[0];
        this.noteItem.top = e.clientY - this.curClient[1];
      }
    },
    mouseup() {
      this.noteItem.isTop = false;
      this.isNoteMove = false;
    },
    deleteNote(id) {
      noteService.deleteNote(id).then(res => {
        if (res.status === 200) {
          Toast("删除成功!");
          this.$parent.deleteNoteById(id);
        } else if (res.status === 400) {
          // Toast(res.errorMsg);
        }
      });
    },
    editNote() {
      this.noteItem.isEditing = true;
    },
    switchNote() {
      this.noteItem.isEditing = false;
    },
    updateNote() {
      noteService.editNote(this.noteItem.id, this.noteItem.text).then(res => {
        if (res.status === 200) {
          Toast(res.data.msg);
        } else if (res.status === 400) {
          Toast(res.data.errorMsg);
        }
      });
    },
    finish() {
      noteService
        .editFinish(this.noteItem.id, !this.noteItem.finish)
        .then(res => {
          if (res.status === 200) {
            this.noteItem.finish = !this.noteItem.finish;
            Toast("更新成功");
          } else if (res.status === 400) {
            Toast(res.errorMsg);
          }
        });
      // if (this.nowRank === "haveDone") {
      //     this.getNoteDoneLists();
      // }
    },
    changeStar(id, starIndex) {
      noteService.editStar(id, "" + (starIndex + 1)).then(res => {
        if (res.status === 200) {
          this.noteItem.className = `star${starIndex + 1}`;
          Toast("更新成功");
        } else if (res.status === 400) {
          // Toast(res.errorMsg);
        }
      });
    },
    getTime(createdAt) {
      const time = new Date(createdAt);
      const year = time.getFullYear(time);
      const month = time.getMonth(time) + 1;
      const day = time.getDate(time);
      return `${year}年${month}月${day}日`;
    }
  },
  props: ["item"],
  directives: {
    focus: {
      inserted(el) {
        el.focus();
      }
    },
    position: {
      inserted(el, a, b) {
        b.context.element = el;
      }
    }
  }
};
</script>
