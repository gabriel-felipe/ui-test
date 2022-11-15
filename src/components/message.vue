<template>
  <div class="message" :class="['level-'+level]">
    <div class="title" ref="title"
         :style="{marginLeft: padding+'px', width: width, zIndex: (level - 50) * -1, top: (level * 50) + 'px', position: (childs.length > 0) ? 'sticky' : 'static' }"
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
        <div class="snippet">lorem ipsum dolor sit amet...</div>
      </template>
    </div>
    <div class="body" :style="{paddingLeft: ((level + 1) * 10) + 'px'}">
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aut autem consequuntur dolor eos eum exercitationem, facilis illum ipsum laudantium magnam maxime minus nesciunt omnis pariatur quae quod rerum suscipit veniam.
    </div>
<!--    <div class="shadow">-->
<!--      <slot></slot>-->
<!--    </div>-->
    <div class="childs">
      <MessageComponent
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
      >
        {{m.message}}
      </MessageComponent>
    </div>
  </div>
</template>
<script>

export default {
  name: "MessageComponent",
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
    }
  },
  data() {
    return {
     sticky: false,
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
      }
      return limit;
    }
  },
  mounted() {
    window.setInterval(() => {
      if(this.$refs.title) {
        this.sticky = !!(this.isInViewport(this.$refs.title) && this.childs.length > 0);
      }
    }, 100);
  },
  methods: {
    isInViewport(element) {
      const rect = element.getBoundingClientRect();
      const scrollY = window.scrollY
      return (
          rect.top <= this.topLimit + 10  && scrollY > 10
      );
    },
  }
}
</script>

<style>
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
}
.message * {
  transition:  all .2s;
}
.message .title {
  box-sizing: border-box;
  padding: 10px;
  height: 50px;
  background: rgba(230,230,230,1);
  max-height: 1000px;
  text-align: left;
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
  background: #e0e0e0;
}

.level-1 .title {
  background: #cdcdcd;
}

.level-2 .title {
  background: #a5a5a5;
}

.level-3 .title, .level-2 .title {
  background: #888;
  color: #fff;
}

.level-3 .title {
  background: #666;
}

.level-3 .title .date, .level-2 .title .date {
  color: #fff;
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
</style>
