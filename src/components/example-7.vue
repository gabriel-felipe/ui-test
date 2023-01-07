<template>
  <div class="message" :class="['level-'+level]">
    <div class="title" ref="title"
         :data-key="all.key"
         :style="{zIndex: (level - 50) * -1, top: (topLimit + 1) + 'px', position:  postType === 'question' ? 'fixed' : 'sticky' }"
         :class="{sticky: (sticky && parentSticky), reply: postType === 'reply', question: postType === 'question', lastStuck: lastStuck, showSnippet: showSnippet}"
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
      <div class="actions" ref="actions">
        <div class="reply">
          Reply
        </div>
        <div class="upvotes">
          <img src="@/assets/actions.png" alt="" width="150px">
        </div>
      </div>
    </div>
    <div v-if="openChilds && childsCount > 2 && level > 2" style="margin-top: 30px">
      <button @click.prevent="openChilds = !openChilds" class="expand-discussion">Hide Replies</button>
    </div>
    <div v-if="!openChilds && childs.length" style="margin-top: 30px">
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
      openChilds: this.all.expandedChilds,
      scrolledBy: false,
      showSnippet: false
    }
  },
  computed: {
    lastStuck() {
      return this.$store.state.lastStuck === this.all.key
    },
    currentlyStuck() {
      return this.sticky && !this.scrolledBy
    },
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
    }, 200);
  },
  watch: {
    currentlyStuck() {
      if(this.currentlyStuck) {
        this.$store.commit('sticky', this.mKey)
      } else {
        this.$store.commit('unsticky', this.mKey)
      }
    },
  },
  methods: {
    scrollToBody() {
      const body = document.getElementsByTagName("body")[0];
      const y = this.$refs.messageBody.getBoundingClientRect().top + body.scrollTop - (this.topLimit + 50);
      body.scroll({
        top: y,
        behavior: 'smooth'
      });
    },
    isInViewport(element) {
      const rect = element.getBoundingClientRect();
      const body = document.getElementsByTagName("body")[0];
      const scrollY = body.scrollTop
      this.showSnippet = (this.childs.length > 0) && (this.openChilds) && (rect.top + rect.height) > this.$refs.actions.getBoundingClientRect().top
      this.scrolledBy = rect.width > 0 && rect.top <= this.topLimit - 10  && scrollY > 10
      return (
          rect.width > 0 && rect.top <= this.topLimit + 40 && scrollY > 10
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
.title.reply.sticky + .body {
  border-left: 2px solid #000;
}
.message .body {
  text-align: left;
  padding: 0 10px 10px;
  position: relative;
  font-weight: 500;
  font-size: 16px;
  line-height: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #ddd;
  border-left: 2px solid #dadada;
  ::v-deep {
    p:first-child, blockquote:first-child {
      margin-top: 0;
    }
  }
  ::v-deep a {
    word-break: break-all;
  }
  &.question {
    padding-top: 20px;
    border-left-color: transparent;
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
  cursor: pointer;
  border-left: 2px solid #dadada;
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
  height: 0;
  transition-delay: 250ms;
  @media(max-width: 500px) {
    font-size: 10px;
  }
}


.reply.title.sticky.showSnippet .snippet {
  height: 1.2em;
  opacity: 1;
  visibility: visible;
  display: block;
}

.title.sticky.showSnippet > p {
  max-height: 0;
  opacity: 0;
  visibility: hidden;
}

.reply.title.sticky {
  max-height: 40px;
  height: 40px;
  border-left: #000 2px solid !important;
  &.showSnippet {
    padding: 5px 5px 5px 5px;
    .author {
      font-size: 12px;
    }
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
  max-height: 1000px !important;
  position: relative;
  z-index: 99;
  transition: font-size .1s, height .3s;
  align-items: flex-start;
  display: flex;
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

.level-1 .title.sticky.showSnippet {
  max-height: 40px;
}
.level-2 .title.sticky.showSnippet {
  max-height: 40px;
}
.level-3 .title.sticky.showSnippet {
  max-height: 40px;
}
.level-4 .title.sticky.showSnippet {
  max-height: 40px;
}
</style>
