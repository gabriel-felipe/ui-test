<template>
  <div class="message" :class="['level-'+level]" >
    <div class="title" ref="title"
         @click="scrollToBody"
         :style="{marginLeft: padding+'px', width: width, zIndex: zIndex, top: (topLimit + 1) + 'px', position: 'sticky'}"
         :class="{sticky: (sticky && parentSticky), reply: postType === 'reply'}"
    >
      <template v-if="postType === 'question'">
        <slot></slot>
      </template>
      <template v-else>
        <div class="top">
          <span class="date">11/14/22 20:42</span>
          <span class="author">@{{ author }}:</span>
        </div>
        <div class="snippet">{{ title }}</div>
      </template>
    </div>
    <div class="body" :style="{paddingLeft: ((level + 1) * 5) + 'px'}" ref="messageBody">
      {{message}}
    </div>
<!--    <div class="shadow">-->
<!--      <slot></slot>-->
<!--    </div>-->
    <div class="childs">
      <MessageFixedHeadersComponent
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
          :m-key="m.key"
          @sticky="addStickyChild"
          @unsticky="removeStickyChild"
      >
        {{m.title}}
      </MessageFixedHeadersComponent>
    </div>
  </div>
</template>
<script>

export default {
  name: "MessageFixedHeadersComponent",
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
    mKey: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      sticky: false,
      scrolledBy: false,
      childsStuck: [],
    }
  },
  watch: {
    sticky() {
      if(this.sticky) {
        this.$emit('sticky', this.mKey)
      } else {
        this.$emit('unsticky', this.mKey)
      }
    }
  },
  computed: {
    width() {
      return "calc(100% - "+this.padding+"px)";
    },
    padding() {
      return this.level * 5
    },
    zIndex() {
      if(this.postType === "question") {
        return 99
      }
      return this.level > 2 ? 4 : (this.level + 2);
    },
    topLimit() {
      let limit = this.level * 50
      if(this.level >= 1) {
        limit = limit - 1
      }
      return (limit >= 50) ? 50 : limit;
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
      const y = this.$refs.messageBody.getBoundingClientRect().top + window.scrollY - (this.topLimit + 50);
      window.scroll({
        top: y,
        behavior: 'smooth'
      });
    },
    addStickyChild(child) {
      this.childsStuck.push(child)
    },
    removeStickyChild(child) {
      this.childsStuck = this.childsStuck.filter(n => n !== child)
    },
    isInViewport(element) {
      const rect = element.getBoundingClientRect();
      const scrollY = window.scrollY
      this.scrolledBy = rect.top <= this.topLimit - 10  && scrollY > 10
      return (
          rect.top <= this.topLimit + 10  && scrollY > 10
      );
    },
  }
}
</script>

<style scoped>
.message {
  width: 500px;
  max-width: 100%;
  position: relative;
}

.date {
  display: block;
  font-size: 10px;
  color: #333;
}
.author {
  font-size: 12px;
}
.message .body {
  text-align: left;
  padding: 10px;
  position: relative;
  white-space: pre-line;
  z-index: -1;
}
.message * {
  transition:  all .2s;
}
.message .title {
  box-sizing: border-box;
  padding: 10px;
  height: 50px;
  background: #cdcdcd;
  text-align: left;
  font-size: 14px;
}
.reply.title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  border-left: 1px solid transparent;
}

.reply.title .snippet {
  opacity: 0;
  visibility: hidden;
  font-size: 12px;
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

.title.sticky {
  max-height: 50px;
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

.level-0 .title {
  background: #000;
}

.level-1 .title {
  background: #222;
}

.level-2 .title {
  background: #444;
}

.level-3 .title {
  background: #666;
}

.level-4 .title {
  background: #888;
}

.level-5 .title {
  background: #aaa;
}

.level-6 .title {
  background: #ccc;
}

.level-0 .title,.level-1 .title, .level-2 .title {
  color: #fff;
}
.level-0 .title .date, .level-1 .title .date {
  color: #fff !important;
}

.level-1 .title.sticky {
  max-height: 50px;
}
.level-2 .title.sticky {
  max-height: 50px;
}
.level-3 .title.sticky {
  max-height: 50px;
}
.level-4 .title.sticky {
  max-height: 50px;
}
</style>
