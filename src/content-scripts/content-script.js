import Vue from 'vue';
import Content from './Content.vue';

const element = document.querySelector('body')
const anchor = document.createElement('div')
anchor.setAttribute("id", "app")
element.insertBefore(anchor,element.firstChild)

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
 new Vue ({
  el: anchor,
  name: 'overlay',
  render: h => h (Content)
});
});

