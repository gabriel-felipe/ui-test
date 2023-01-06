<template>
  <div class="message" :class="['level-'+level]">
    <div class="title" ref="title"
         :style="{zIndex: (level - 50) * -1, top: (topLimit + 1) + 'px', position:  postType === 'question' ? 'fixed' : 'sticky' }"
         :class="{sticky: (sticky && parentSticky), reply: postType === 'reply', question: postType === 'question'}"
         @click="scrollToBody()"

    >
      <template v-if="postType === 'question'">
        <img src="@/assets/forum-logo.png" alt="">

        <span :class="{'font-small': title.length > 110}">
          <slot></slot>
        </span>
      </template>
      <template v-else>
        <div class="top">
          <span class="author">@{{ author }}:</span>
          <div class="snippet">{{ title }}</div>
        </div>
        <div class="right">
          <span class="date">{{ all.timestamp }}</span>
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
<div v-html="unescapeMessage"></div>
      <div class="actions">
        <div class="reply">
          Reply
        </div>
        <div class="upvotes">
          <img src="@/assets/actions.png" alt="" width="150px">
        </div>
      </div>
    </div>
    <div v-if="openChilds && childsCount > 2 && level > 2">
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
    unescapeMessage() {
      const htmlDecode = (input) => {
        const e = document.createElement('textarea');
        e.innerHTML = input;
        return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
      }
      return htmlDecode(this.message);
    },
    width() {
      return "calc(100% - "+this.padding+"px)";
    },
    padding() {
      return this.level * 5
    },
    topLimit() {
      let limit = this.level * 40
      if(this.level >= 1) {
        limit = limit - 1
        limit += 30
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
      const y = this.$refs.messageBody.getBoundingClientRect().top + body.scrollTop - (this.topLimit + 50);
      console.log(y)
      body.scroll({
        top: y,
        behavior: 'smooth'
      });
    },
    isInViewport(element) {
      const rect = element.getBoundingClientRect();
      const body = document.getElementsByTagName("body")[0];
      const scrollY = body.scrollTop
      if(this.postType === "question") {
        return scrollY > 10
      }
      return (
          rect.top <= this.topLimit + 40 && scrollY > 10
      );
    },
  }
}
</script>

<style scoped lang="scss">
.message {
  width: 100%;
  position: relative;
}

.date {
  display: block;
  font-size: 10px;
  color: #8C8C8C !important;
  margin-top: 3px;
  text-align: right;
  @media(max-width: 500px) {
    font-size: 10px;
  }
}

::v-deep blockquote {
  border-left: 4px solid #888;
  padding-left: 30px;
  color: #888;
  margin-left: 0;
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
  font-weight: 500;
  font-size: 16px;
  line-height: 30px;
  padding-bottom: 20px;
  ::v-deep a {
    word-break: break-all;
  }
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
    width: calc(100% - 110px);
  }
  .right {
    display: flex;
    align-items: center;
    justify-content: flex-end;

    button {
      font-size: 10px;
      background: #fff;
      border: 1px solid #DADADA;
      height: 18px;
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
  width: 100%;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  @media(max-width: 500px) {
    font-size: 10px;
  }
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
  padding: 5px 5px 5px 5px;
  .author {
    font-size: 12px;
  }
  button {
    width: 18px;
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
    width: 800px;
    max-width: 100%;
    top: 0 !important;
    z-index: 999 !important;
    align-items: center;
    &.sticky {
      padding: 10px;
    }
  }
  img {
    margin-right: 20px;
  }
  span {
    margin-top: 0px;
    transition: all .3s;
    transform-origin: 0 0;
    width: 100%;
  }
  span.font-small {
    font-size: 12px;
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
