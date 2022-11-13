<template>
  <div class="home">
    <div class="messages-holder">
      <div class="fixedMessages" :style="{height: height+'px'}">
        <MessageComponent
            v-for="m in messages"
            v-show="fixedClasses.includes(m.key)"
            :key="m.key"
            :level="m.level"
            :parent="m.parent"
        >
          {{m.message}}
        </MessageComponent>
      </div>
      <div class="messages">
        <MessageComponent
            v-for="m in messages"
            :key="m.key"
            :id="'m-'+m.key"
            :level="m.level"
            :parent="m.parent"
            :class="{fixed: fixedClasses.includes(m.key), messageList: true}"
        >
          {{m.message}}
        </MessageComponent>
      </div>
    </div>
    <div class="first-message">
      FIRST MESSAGE: {{firstMessage}}! <br />
      {{fixedClasses}} <br />
      {{firstMessageContent}}
    </div>
  </div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator';
import MessageComponent from '@/components/message.vue'; // @ is an alias to /src

const messages = []
for (let i=0; i<10; i++) {

  messages.push({
    message: "Message "+i+ "",
    parent: "",
    level: 0,
    key: String(i)
  })

  const nChilds = Math.floor(Math.random() * 3);
  for (let j=0; j<=nChilds; j++) {
    messages.push({
      message: "Message "+i+" CHILD "+j+"",
      parent: String(i),
      level: 1,
      key: String(i)+String(j)
    })
    const nGranChilds = Math.floor(Math.random() * 3);
    for (let k=0; k<=nGranChilds; k++) {
      messages.push({
        message: "Message "+i+" CHILD "+j+" CHILD "+k+"",
        parent: String(i)+String(j),
        level: 2,
        key: String(i)+String(j)+String(k)
      })
    }
  }
}

@Component({
  components: {
    MessageComponent,
  },
  data: () => ({
    messages: messages,
    firstMessage: "",
    firstMessageContent: '',
    scrolling: false
  }),
  mounted() {
    this.checkMessages()
    document.addEventListener("scroll", this.checkMessages)
  },
  computed: {
    height() {
      return (this.fixedClasses.length * 51)
    },
    fixedClasses() {
      let ids = this.firstMessage.substr(2,this.firstMessage.length - 2)
      let result = []
      while (ids.length > 0) {
        if(this.messages.some(m => m.parent === ids)) {
          result.push(ids);
        }
        ids = ids.substr(0, ids.length-1)
      }
      return result
    },
    lastClass() {
      return this.fixedClasses[0]
    }

  },
  methods: {
    isInViewport(element) {
      const rect = element.getBoundingClientRect();
      return (
          rect.top >= -10 + this.height &&
          rect.left >= 0 &&
          rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
          rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      );
    },
    checkMessages() {
      if(this.scrolling) return
      let messages = Array.from(document.querySelectorAll('.messageList'))
      let visible = 0;
      messages.every(m => {
        if(this.isInViewport(m)) {
          this.firstMessage = m.id
          this.firstMessageContent = m.textContent
          return false
        }
        return true;
      })
    }
  },
  watch: {
    fixedClasses(newValue, oldValue) {
      let newLength = newValue.length
      let oldLength = oldValue.length
      if (newLength < oldLength) {
        this.scrolling = true
        let first = document.getElementById('m-'+newValue[newValue.length - 1]).getBoundingClientRect()
        window.scrollTo({ top: window.scrollY + first.top, behavior: 'smooth'})
        window.setTimeout(() => {
          this.scrolling = false
        }, 300)
      }
    }
  }
})
export default class Home extends Vue {}
</script>
<style>
.messages-holder {
  width: 100%;
  display: flex;
  flex-direction: column;
}
.first-message {
  display: none;
  position: fixed;
  bottom: 0;
  right: 0;
  background: #000;
  color: #fff;
  padding: 20px;
}
.fixedMessages {
  position: fixed;
  top: 0;
  left: 0%;
  width: 100%;
  background: #fff;
  box-shadow: 0 0 4px rgba(0,0,0,0.4);
  z-index: 999;
  border-bottom: 5px solid #Fff;
}
</style>
