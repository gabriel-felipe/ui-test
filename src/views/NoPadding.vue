<template>
  <div class="home">
    <div class="messages-holder">
      <div class="messages">
        <MessageComponent
            v-for="m in messages"
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
  </div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator';
import MessageComponent from '@/components/message.vue'; // @ is an alias to /src

const messages = []
const getAuthorName = () => {
  let items = ["Gabriel", "Reed", "Oliver"]
  return items[Math.floor(Math.random()*items.length)]
}
for (let i=0; i<10; i++) {
  let message = {
    message: "The real question "+(i+1)+ "",
    parent: "",
    level: 0,
    key: String(i),
    childs: [],
    postType: "question",
    author: getAuthorName()
  }

  let nChilds = Math.floor(Math.random() * 3);
  for (let j=0; j<=nChilds; j++) {
    let childMessage = {
      message: "Message "+i+" CHILD "+j,
      parent: String(i),
      level: 1,
      key: String(i),
      childs: [],
      postType: "reply",
      author: getAuthorName()
    }
    let nGranChilds = Math.floor(Math.random() * 3);
    for (let k=0; k<=nGranChilds; k++) {
      let grandChild = {
        message: "Message "+i+" CHILD "+j+" CHILD "+k+"",
        parent: String(i)+String(j),
        level: 2,
        key: String(i)+String(j)+String(k),
        childs: [],
        postType: "reply",
        author: getAuthorName()
      }
      let nGranGrandChilds = Math.floor(Math.random() * 3);
      for (let l=0; l<=nGranGrandChilds; l++) {
        grandChild.childs.push({
          message: "Message "+i+" CHILD "+j+" CHILD "+k+" CHILD "+l+"",
          parent: String(i)+String(j),
          level: 3,
          key: String(i)+String(j)+String(k),
          childs: [],
          postType: "reply",
          author: getAuthorName()
        })
      }
      childMessage.childs.push(grandChild)
    }
    message.childs.push(childMessage)
  }
  messages.push(message)
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
  computed: {
    // height() {
    //   return (this.fixedClasses.length * 51)
    // },
    // fixedClasses() {
    //   let ids = this.firstMessage.substr(2,this.firstMessage.length - 2)
    //   let result = []
    //   while (ids.length > 0) {
    //     if(this.messages.some(m => m.parent === ids)) {
    //       result.push(ids);
    //     }
    //     ids = ids.substr(0, ids.length-1)
    //   }
    //   return result
    // },
    // lastClass() {
    //   return this.fixedClasses[0]
    // }
  },
  methods: {
    // isInViewport(element) {
    //   const rect = element.getBoundingClientRect();
    //   return (
    //       rect.top >= -10 + this.height &&
    //       rect.left >= 0 &&
    //       rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    //       rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    //   );
    // },
    // checkMessages() {
    //   if(this.scrolling) return
    //   let messages = Array.from(document.querySelectorAll('.messageList'))
    //   let visible = 0;
    //   messages.every(m => {
    //     if(this.isInViewport(m)) {
    //       this.firstMessage = m.id
    //       this.firstMessageContent = m.textContent
    //       return false
    //     }
    //     return true;
    //   })
    // }
  },
})
export default class Home extends Vue {}
</script>
<style scoped>
.messages-holder {
  width: 100%;
  display: flex;
  flex-direction: column;
}

::v-deep .body {
  padding-left: 10px !important;
}
::v-deep .title {
  border-left-width: 0 !important;
  padding-left: 10px;
}
/*.first-message {*/
/*  display: none;*/
/*  position: fixed;*/
/*  bottom: 0;*/
/*  right: 0;*/
/*  background: #000;*/
/*  color: #fff;*/
/*  padding: 20px;*/
/*}*/
/*.fixedMessages {*/
/*  position: fixed;*/
/*  top: 0;*/
/*  left: 0%;*/
/*  width: 100%;*/
/*  background: #fff;*/
/*  box-shadow: 0 0 4px rgba(0,0,0,0.4);*/
/*  z-index: 999;*/
/*  border-bottom: 5px solid #Fff;*/
/*}*/
</style>
