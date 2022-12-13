<template>
  <div class="message" :class="['level-'+level]" >
    <div class="expand" @click.prevent.stop="expand(!expanded)" :class="{visible: level === 2 && !scrolledBy && sticky}">
      <span>⇿</span>
    </div>
    <div class="title" ref="title"
         @click="scrollToBody"
         :data-key="mKey"
         :style="{marginLeft: padding+'px', width: width, zIndex: zIndex, top: (topLimit + 1) + 'px', position: 'sticky', transform: 'translateY('+topTranslate+'px)'}"
         :class="{sticky: (sticky && parentSticky), reply: postType === 'reply'}"
    >
      <template v-if="postType === 'question'">
        <slot></slot>
      </template>
      <template v-else>
        <div class="top">
          <span class="date">{{timestamp || "11/14/22 20:42"}}</span>
          <span class="author">@{{ author }}:</span>
        </div>
        <div class="snippet">{{ title }}</div>
<!--        <div class="snippet">{{ mKey }}</div>-->
      </template>
    </div>
    <div class="body" :style="{paddingLeft: (padding + 5) + 'px', marginTop: (expandedTranslateY+'px')}" ref="messageBody">
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
          :timestamp="m.timestamp"
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
    },
    timestamp: {
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
        this.$emit('sticky', {key: this.mKey, level: this.level})
      } else {
        this.$emit('unsticky', {key: this.mKey, level: this.level})
      }
    },
    currentlyStuck() {
      if(this.currentlyStuck) {
        this.$store.commit('sticky', this.mKey)
      } else {
        this.$store.commit('unsticky', this.mKey)
      }
    },
  },
  computed: {
    expanded() {
      return this.$store.state.expanded
    },
    lastStuck() {
      return this.$store.state.lastStuck
    },
    expandedTranslateY() {
      return (this.expanded && this.stickyCount > 2 && this.mKey === this.lastStuck) ? (this.stickyCount - 2) * 50 : 0;
    },
    currentlyStuck() {
      return this.sticky && !this.scrolledBy
    },
    stickyCount() {
      return this.$store.state.stickyCount
    },
    width() {
      return "calc(100% - "+this.padding+"px)";
    },
    padding() {
      if(this.level === 0) return 0
      return this.level * 5 + 10
    },
    zIndex() {
      if(this.postType === "question") {
        return 99
      }
      if(this.expanded && this.sticky && !this.scrolledBy) {
        return this.level + 99;
      }
      return this.level > 2 ? 4 : (this.level + 2);
    },
    topLimit() {
      let limit = this.level * 50
      return (limit >= 50) ? 50 : limit;
    },
    topTranslate() {
      if(!this.expanded || this.level <= 1 || !this.sticky || this.scrolledBy) {
        return 0;
      }
      let top = (this.level - 1) * 50
      if(this.level >= 1) {
        top = top - 1
      }
      return top;
    }
  },
  mounted() {
    window.setInterval(() => {
      if(this.expanded) return
      if(this.$refs.title) {
        this.sticky = !!(this.isInViewport(this.$refs.title));
      }
    }, 200);
  },
  methods: {
    async expand(expand) {
      await this.$store.commit('setExpanded', expand)

    },
    scrollToBody() {
      if(this.sticky && !this.expanded) {
        this.expand(true)
        return
      }
      const y = this.$refs.messageBody.getBoundingClientRect().top + window.scrollY - (this.topLimit + 50);
      window.scroll({
        top: y,
        behavior: 'smooth'
      });
      window.setTimeout(() => {
        this.$store.commit('lastStuck', this.mKey)
      }, 100)
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
  color: inherit;
  text-shadow: inherit;
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
  margin-left: 20px;
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

.expand {
  position: fixed;
  top: 50px;
  height: 50px;
  width: 15px;
  left: 0px;
  font-size: 24px;
  color: #000;
  z-index: 150;
  opacity: 0;
  visibility: hidden;
  transition:  all .5s;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding-left: 0px;
}

.expand span {
  transform: rotate(90deg);
  transform-origin: center;
  display: block;
}

.expand.visible {
  opacity: 1;
  visibility: visible;
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

.title {
  color: #fff !important;
  text-shadow: 0 0 20px #000 !important;
}

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
  color: #000 !important;
  text-shadow: 0 0 20px #fff !important;
}

.level-6 .title .date {
  color: #000 !important;
}

.level-7 .title {
  background: #ddd;
}

.level-7 .title.sticky {
  border-left: 1px solid #ddd
}

.level-8 .title {
  background: #eee;
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
