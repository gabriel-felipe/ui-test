import { createRequire } from "module";
import axios from 'axios';
import fs from 'fs';
// console.log(data[1].data.children[3])

const questionUrl = "https://www.reddit.com/r/askscience/comments/1031gw1/using_a_cpap_can_increase_the_life_span_of_a"

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
                timestamp: reply.created_utc,
                childs: await getChildren(reply.id, 1)
            })
        }
    }
    fs.writeFile(question.id+"_converted-reddit.json", JSON.stringify(result,null, 2), () => {})
})()


