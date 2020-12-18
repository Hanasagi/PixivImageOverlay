import Vue from 'vue';
import Content from './Content.vue';

const element = document.querySelector('body')
const anchor = document.createElement('div')
anchor.setAttribute("id", "app")
element.insertBefore(anchor,element.firstChild)

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
		let urlId = 'u'+request.url.toString().split("/")[5]
		if(request.message==="refresh")
			document.body.removeChild(document.body.children[0])
		let previousId=0
		let evalNumberofImg = document.evaluate('//div[@role="presentation"]//div[@aria-label="Preview"]/div/span', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue   
		if(urlId!=previousId)
	        previousId=urlId
		if (evalNumberofImg) {
			 new Vue ({
			  el: anchor,
			  name: 'overlay',
			  data:()=>{
	        	return{
	        		imgNumber: evalNumberofImg,
	        		urlId: previousId
	        	}
	    	},
			  render: h => h (Content)
			});
		}
});

