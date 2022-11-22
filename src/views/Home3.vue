<template>
  <div class="home">
    <div class="messages-holder">
      <div class="messages">
        <MessageFixedComponent
            v-for="m in messages"
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
        >
          {{m.title}}
        </MessageFixedComponent>
      </div>
    </div>
  </div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator';
import MessageFixedComponent from '@/components/message-all-headers-fixed.vue'; // @ is an alias to /src
import messages from '../../scripts/reddit-compact-json.js'
@Component({
  components: {
    MessageFixedComponent,
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
<style>
.messages-holder {
  width: 100%;
  display: flex;
  flex-direction: column;
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
