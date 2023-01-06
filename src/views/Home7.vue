<template>
  <div class="home">
    <div class="messages-holder">
      <div class="messages">
        <template v-if="loading">
          loading...
        </template>
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
            :all="m"
        >
          {{m.title}}
        </MessageFixedComponent>
      </div>
    </div>
  </div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator';
import MessageFixedComponent from '@/components/example-7.vue';
import axios from 'axios';
import messages from "../../scripts/103c1nz_converted-reddit.json";

import fs from "fs"; // @ is an alias to /src
function uuidv4() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}
const fixDepthAndKey = (messages, depth, parent) => {
  if(messages.map) {
    messages = messages.map(m => {
      let key = uuidv4()
      m.key = key
      m.level = depth
      m.parent = parent
      if(depth > 0) {
        m.postType = 'reply'
      } else {
        m.postType = 'question'
      }

      if (depth === 3) {
        m.expandedChilds = false
      } else {
        m.expandedChilds = true
      }
      if(!m.title && m.message) {
        m.title = m.message.substring(0,150)+"...";
      }
      m.childs = fixDepthAndKey(m.childs || [], depth+1, key)
      return m
    })
  } else {
    return []
  }

  return messages
}

@Component({
  components: {
    MessageFixedComponent,
  },
  props: {
    thread: {
      type: String,
      default: "",
    }
  },
  data: () => ({
    messages: [],
    firstMessage: "",
    firstMessageContent: '',
    scrolling: false,
    loading: false,
  }),
  mounted() {
    const questionUrl = "https://www.reddit.com/r/"+this.thread

    async function getChildren(commentId, level) {
      const commentUrl = questionUrl+"/"+commentId+".json";
      if(level >= 6) {
        return []
      }
      let result = []
      let response = await axios.get(commentUrl)
      try {
        if(response.data[1].data.children[0].data.replies.data.children.length > 0) {
          for(let i in response.data[1].data.children[0].data.replies.data.children) {
            let reply = response.data[1].data.children[0].data.replies.data.children[i].data
            if(!reply.collapsed) {
              result.push({
                id: reply.id,
                title: (reply.body) ? reply.body.substring(0, 45) + "..." : "",
                message: reply.body_html,
                author: reply.author,
                timestamp: new Date(reply.created_utc * 1000).toLocaleString(),
                childs: await getChildren(reply.id, level + 1)
              })
            }
          }
        }
        return result
      } catch (e) {
        return []
      }

    }

    if(this.thread) {
      this.loading = true
      (async () => {
        // let comment = await axios.get("https://www.reddit.com/r/changemyview/comments/103sqbf/cmv_preemployment_drug_testing_should_no_longer/j339o5e.json")
        // console.log(comment.data[1].data.children[0].data.replies.data.children)
        // return;
        let response = await axios.get(questionUrl+".json")
        const question = response.data[0].data.children[0].data
        const result = [{
          title: question.title,
          message: question.selftext_html,
          author: question.author,
          timestamp: question.created_utc,
          childs: []
        }]
        for (let i in response.data[1].data.children) {
          if(i === 10) {
            break;
          }
          let reply = response.data[1].data.children[i].data
          if(!reply.collapsed){
            result[0].childs.push({
              id: reply.id,
              title: (reply.body) ? reply.body.substring(0,45)+"..." : "",
              message: reply.body_html,
              author: reply.author,
              timestamp: new Date(reply.created_utc * 1000).toLocaleString(),
              childs: await getChildren(reply.id, 1)
            })
          }
        }
        this.messages = fixDepthAndKey(result, 0)
        this.loading = false
      })()
    } else {
      this.messages = fixDepthAndKey(messages, 0)
      this.loading = false
      return
    }

  },
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
<style lang="scss" scoped>
.home {
  max-width: 800px;
  .top {
    height: 50px;
    box-sizing: border-box;
    width: 100%;
    position: fixed;
    background: #fff;
    z-index: 99;
    top: 0;
    left: 0;
    padding: 10px;
    justify-content: flex-start;
    text-align: left;
  }
}
.messages-holder {
  padding-left: 10px;
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
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
