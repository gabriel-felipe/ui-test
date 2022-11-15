<template>
  <div class="message" :class="['level-'+level]">
    <div class="title" ref="title"
         :style="{borderLeftWidth: (level * 10) + 'px', zIndex: (level - 50) * -1, top: (level * 50) + 'px', position: (childs.length > 0) ? 'sticky' : 'static' }"
         :class="{sticky: (sticky && parentSticky), reply: postType === 'reply'}"
    >
      <template v-if="postType === 'question'">
        <slot></slot>
      </template>
      <template v-else>
        <div class="top">
          <span class="date">11/14/22 20:42</span>
          <span class="author">@{{ getAuthorName() }}:</span>
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
    }
  },
  data() {
    return {
     sticky: false
    }
  },
  computed: {
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
        if(this.isInViewport(this.$refs.title) && this.childs.length > 0) {
          this.sticky = true
        } else {
          this.sticky = false
        }
      }
    }, 100);
  },
  methods: {
    getAuthorName() {
      let items = ["Gabriel", "Reed", "Oliver"]
      return items[Math.floor(Math.random()*items.length)]
    },
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
  border-left: 1px solid black;
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
.level-1 .title {
  background: rgba(200,200,200,1);
}
.level-2 .title {
  background: rgba(100,100,100,1);
  color: #fff;
}
.level-3 .title {
  background: rgba(60,60,60,1);
  color: #fff;
}

.level-1 .date {
  color: #333;
}

.level-2 .date {
  color: #fff;
}

.title.sticky {
  max-height: 50px;
  background: #000 !important;
  color: #fff !important;
  box-shadow: 0 0 0 2px #000;
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

.title.sticky .date {
  color: #fff !important;
}


.level-1 .title.sticky {
  max-height: 50px;
  background: #222 !important;
  color: #fff !important;
}
.level-2 .title.sticky {
  max-height: 50px;
  background: #444 !important;
  color: #fff !important;
}
.level-3 .title.sticky {
  max-height: 50px;
  background: #666 !important;
  color: #fff !important;
}
</style>
