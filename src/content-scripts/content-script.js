import Vue from 'vue';
import Content from './Content.vue';

const element = document.querySelector('body')
const anchor = document.createElement('div')
element.insertBefore(anchor, element.firstChild)
//eslint-disable-next-line
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  let urlId = 'u' + request.url.toString().split("/")[5] +request.message
  let previousId = 0
  let evalNumberofImg = document.evaluate('//div[@role="presentation"]//div[@aria-label="Preview"]/div/span', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue
  if (urlId != previousId)
    previousId = urlId
  if (evalNumberofImg) {
    if (request.message === "refresh"){
      console.log(document.body.children[0])
      document.body.removeChild(document.body.children[0])
    }
    new Vue({
      el: anchor,
      name: 'overlay',
      data: () => {
        return {
          imgNumber: evalNumberofImg,
          urlId: previousId
        }
      },
      render: h => h(Content)
    });
  }
});
