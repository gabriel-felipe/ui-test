<template>
  <div class="message" :class="['level-'+level]">
    <div class="title" ref="title"
         :style="{zIndex: (level - 50) * -1, top: (topLimit + 1) + 'px', position:  postType === 'question' ? 'fixed' : 'sticky' }"
         :class="{sticky: (sticky && parentSticky), reply: postType === 'reply', question: postType === 'question'}"
         @click="scrollToBody()"

    >
      <template v-if="postType === 'question'">
        <img src="@/assets/forum-logo.png" alt="">

        <span>
          <slot></slot>
        </span>
      </template>
      <template v-else>
        <div class="top">
          <span class="author">@{{ author }}:</span>
          <div class="snippet">{{ title }}</div>
        </div>
        <div class="right">
          <span class="date">11/14/22 20:42</span>
          <button>.....</button>
        </div>

      </template>
    </div>
    <div class="title bigtitle question" ref="bigtitle" v-if="postType === 'question'">
      <img src="@/assets/forum-logo.png" alt="">

      <span>
        <slot></slot>
      </span>
    </div>
    <div
        ref="messageBody"
        class="body"
        :class="{sticky: (sticky && parentSticky), reply: postType === 'reply', question: postType === 'question'}" :style="{paddingLeft: '10px'}"
    >
      {{message}}

      <div class="actions">
        <div class="reply">
          Reply
        </div>
        <div class="upvotes">
          <img src="@/assets/actions.png" alt="" width="150px">
        </div>
      </div>
    </div>
    <div v-if="openChilds && childsCount > 2 && level > 1">
      <button @click.prevent="openChilds = !openChilds" class="expand-discussion">Hide Replies</button>
    </div>
    <div v-if="!openChilds && childs.length">
      <button @click.prevent="openChilds = !openChilds" class="expand-discussion">Expand Discussion <small>{{childsCount}} Replies</small></button>
    </div>
<!--    <div class="shadow">-->
<!--      <slot></slot>-->
<!--    </div>-->
    <div class="childs" :class="{sticky: (sticky && parentSticky)}" v-show="openChilds">
      <example6
          v-for="m in childs"
          :parentSticky="sticky"
          :key="m.key"
          :id="'m-'+m.key"
          :level="m.level"
          :parent="m.parent"
          :childs="m.childs"
          :class="{messageList: true}"
          :post-type="m.postType"
          :author="m.author"
          :message="m.message"
          :title="m.title"
          :all="m"
      >
        {{m.title}}
      </example6>
    </div>
  </div>
</template>
<script>

export default {
  name: "example6",
  props: {
    level: {
      type: Number,
      default: 0
    },
    parent: {
      type: String,
      default: ""
    },
    parentSticky: {
      type: Boolean,
      default: true
    },
    childs: {
      type: Array,
      default: () => []
    },
    postType: {
      type: String,
      default: "question"
    },
    author: {
      type: String,
      default: ""
    },
    message: {
      type: String,
      default: ""
    },
    title: {
      type: String,
      default: ""
    },
    all: {
      type: Object
    }
  },
  data() {
    return {
     sticky: false,
      openChilds: this.all.expandedChilds
    }
  },
  computed: {
    width() {
      return "calc(100% - "+this.padding+"px)";
    },
    padding() {
      return this.level * 5
    },
    topLimit() {
      let limit = this.level * 50
      if(this.level >= 1) {
        limit = limit - 1
        limit += 20
      }
      return limit
    },
    childsCount() {
      let countChilds = (m) => {
        let grandChilds = (m.childs) ? m.childs.map(m => countChilds(m)).reduce((partialSum, a) => partialSum + a, 0) : 0
        return m.childs.length + grandChilds
      }
      return countChilds(this.all)
    }
  },
  mounted() {
    window.setInterval(() => {
      if(this.$refs.title) {
        this.sticky = !!(this.isInViewport(this.$refs.title));
      }
    }, 100);
  },
  methods: {
    scrollToBody() {
      const body = document.getElementsByTagName("body")[0];
      console.log(body.scrollTop)
      console.log(this.$refs.messageBody.getBoundingClientRect().top)
      console.log(this.topLimit + 50)
      const y = this.$refs.messageBody.getBoundingClientRect().top + body.scrollTop - (this.topLimit + 50);
      console.log(y)
      body.scroll({
        top: y,
        behavior: 'smooth'
      });
    },
    isInViewport(element) {
      const rect = element.getBoundingClientRect();
      const scrollY = window.scrollY
      if(this.postType === "question") {
        return scrollY > 10
      }
      return (
          rect.top <= this.topLimit + 10  && scrollY > 10
      );
    },
  }
}
</script>

<style scoped lang="scss">
.message {
  width: 500px;
  position: relative;
}

.date {
  display: block;
  font-size: 12px;
  color: #8C8C8C !important;
  margin-top: 3px;
}
.author {
  font-weight: 500;
  font-size: 16px;
  color: #575757;
}
.message .body {
  text-align: left;
  padding: 10px;
  position: relative;
  white-space: pre-line;
  font-weight: 500;
  font-size: 16px;
  line-height: 30px;
  padding-bottom: 20px;
  &.question {
    padding-top: 20px;
  }
  .actions {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    color: #333;
    div {
      margin-right: 20px;
    }
    .reply {
      font-size: 14px;
      text-transform: uppercase;
      font-weight: 500;
      cursor: pointer;
      &:hover {
        color: #000;
      }
    }
  }
}

.expand-discussion {
  color: #333;
  font-size: 14px;
  text-transform: uppercase;
  font-weight: 600;
  background: transparent;
  border:none;
  margin-bottom: 50px;
  cursor: pointer;
}

.message * {
  transition:  all .2s;
}
.message .title {
  box-sizing: border-box;
  padding: 10px;
  background: #fff;
  border-bottom: 1px solid #ddd;
  color: #333 !important;
  text-align: left;
  font-size: 14px;
}

.reply.title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 50px;
  transition: all .3s;
  border-left: 1px solid transparent;
  .top {
    display: flex;
    align-items: center;
    flex-basis: auto;
  }
  .right {
    display: flex;
    align-items: center;
    justify-content: flex-end;

    button {
      font-size: 10px;
      background: #fff;
      border: 1px solid #DADADA;
      height: 24px;
      border-radius: 2px;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      line-height: 1em;
      margin-left: 5px;
      color: #000;
      padding-bottom: 5px;
      cursor: pointer;
      visibility: hidden;
      width: 0;
    }
  }
}

.reply.title .snippet {
  opacity: 0;
  visibility: hidden;
  font-size: 12px;
  margin-left: 5px;
}

.reply.title.sticky .snippet {
  opacity: 1;
  visibility: visible;
}

.title.sticky > p {
  max-height: 0;
  opacity: 0;
  visibility: hidden;
}

.reply.title.sticky {
  max-height: 40px;
  height: 40px;
  border-left: #000 2px solid !important;
  .author {
    font-size: 12px;
  }
  button {
    width: 24px;
    visibility: visible;
  }
}

.childs {
  margin-left: 10px;
  position: relative;
  &:before {
    position: absolute;
    left: 0;
    content: "";
    top: 0;
    height: 0;
    width: 1px;
    background: #ddd;
    display: block;
    transition: all 2s;
  }
}

.message .question.title.bigtitle {
  font-size: 30px;
  position: relative;
  top: 0;
  z-index: 1000 !important;
  flex-direction: column;
  img {
    margin-bottom: 20px;
  }
}
.message .question.title {
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 135%;
  height: auto;
  padding-left: 0;
  max-height: 1000px !important;
  position: relative;
  z-index: 99;
  transition: font-size .1s, height .3s;
  align-items: flex-start;

  &:not(.bigtitle) {
    height: 70px;
    position: fixed !important;
    width: 490px;
    max-width: calc(100vw);
    top: 0 !important;
    z-index: 999 !important;
    &.sticky {
      padding: 10px;
    }
  }
  img {
    margin-right: 20px;
  }
  span {
    margin-top: -5px;
    transition: all .3s;
    transform-origin: 0 0;
  }
}

/*.title.sticky:before {*/
/*  content: "";*/
/*  display: block;*/
/*  position: absolute;*/
/*  background: #fff;*/
/*  width: 100vw;*/
/*  height: 100%;*/
/*  left: 0;*/
/*  top: 0;*/
/*  z-index: -2;*/
/*}*/

.level-1 .title.sticky {
  max-height: 40px;
}
.level-2 .title.sticky {
  max-height: 40px;
}
.level-3 .title.sticky {
  max-height: 40px;
}
.level-4 .title.sticky {
  max-height: 40px;
}
</style>
