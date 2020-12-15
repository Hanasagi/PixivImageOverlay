<template>
<div>
	<div id="overlay" ref="overlay" v-if="show">
		<svg v-on:click="hidePanel()" id="showSidePanel" ref="hidePanel" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class=""><path data-v-103b2d42="" d="M0 0h24v24H0z" fill="none"></path> <path data-v-103b2d42="" d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path></svg>
		<svg v-on:click="show = !show" id="quitOverlay" width="24" height="24" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg"><path d="M 500 0C 224 0 0 224 0 500C 0 776 224 1000 500 1000C 776 1000 1000 776 1000 500C 1000 224 776 0 500 0C 500 0 500 0 500 0 M 253 677C 242 666 242 652 253 641C 253 641 394 500 394 500C 394 500 253 359 253 359C 242 348 242 334 253 323C 253 323 323 253 323 253C 334 242 348 242 359 253C 359 253 500 394 500 394C 500 394 641 253 641 253C 652 242 666 242 677 253C 677 253 747 323 747 323C 758 334 758 348 747 359C 747 359 606 500 606 500C 606 500 747 641 747 641C 758 652 758 666 747 677C 747 677 677 747 677 747C 666 758 652 758 641 747C 641 747 500 606 500 606C 500 606 359 747 359 747C 348 758 334 758 323 747C 323 747 253 677 253 677"></path></svg>
		<div id="imgPlaceholder" ref="imgPlaceholder">
		</div>
    <div id="change">
      <div id="prev" v-on:click="checknChange('left')">
      </div>
      <div id="next" v-on:click="checknChange('right')">
      </div>
    </div>
    <span id="imgThumbnail" ref="imgThumbnail" class="panel-show"></span>
	</div>
	 <div id="triggerExt" v-on:click="show = !show">develop</div>
</div>
</template>

<script>
export default {
  name: 'Content',
  data(){
  return {
  		show:true,
      currentIMG:0,
      imagesArray:undefined
  	}
  },
  mounted() {
  	this.log(this)
    document.addEventListener("click",function(e){
      console.log(e.target)
    })
  	let evalNumberofImg = document.evaluate('//div[@role="presentation"]//div[@aria-label="Preview"]/div/span', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue
    if (evalNumberofImg) {
    	this.showOverlay()
      	this.storeIMG(evalNumberofImg.innerText.split("/")[1])
      	document.body.insertBefore(this.$el, document.body.firstChild)
    }
    this.$emit("mounted")
  },
  methods:{
    async clearStorage(){
        chrome.storage.local.clear(()=> {
        var error = chrome.runtime.lastError;
        console.log("cleared")
        if (error) {
            console.error(error);
          }
        });
    },
  	showOverlay(){
  		document.body.style.overflow="hidden"
  	},
  	hideOverlay(){
		document.body.style.overflow="initial"
  	},
  	storeIMG(numberOfImg) {
  		let firstImg = document.evaluate('//body//div[@role="presentation"]/a', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.href
  		let key = []
  		let img = []
      let thumbnail = []
  		for(let i=0;i<numberOfImg;i++){
  			img[i] = {'url': firstImg.replace(/p[0-9]/g, "p" + i)}
        thumbnail[i] = {'url': firstImg.replace(/p[0-9]/g, "p" + i),'height':'14vh'}
  		}
  		chrome.storage.local.set({"imgInfo": img});
      chrome.storage.local.set({"thumbnailInfo": thumbnail});
  		this.getIMG()
      this.getThumbnail()
  	},
  	//https://stackoverflow.com/questions/59440008/how-to-wait-for-asynchronous-chrome-storage-local-get-to-finish-before-continu
  	readLocalStorage(key) {
    	return new Promise((resolve, reject) => {
        	chrome.storage.local.get(key, function(result) {
            	if (result != undefined) {
                	resolve(result);
            	} else {
                	reject();
            	}
        	});
    	});
	},
  	async getIMG(){
  		let images = await this.readLocalStorage("imgInfo")
      this.imagesArray=images.imgInfo
      this.addIMG(images.imgInfo)
  	},
    async getThumbnail(){
      let thumbnail = await this.readLocalStorage("thumbnailInfo")
      this.addThumbnail(thumbnail.thumbnailInfo)
    },
  	addIMG(images){
      let i = 0
      images.forEach((img)=>{
  			let el = document.createElement("img")
  			if(i=="0")
  				el.classList.add("active")
  			else
  				el.classList.add("hide")
  			el.id="img_"+i
  			el.loading = 'lazy'
  			el.src=img.url
  			this.$refs.imgPlaceholder.append(el)
        i++;
		  });
  	},
    addThumbnail(images){
      let i = 0
      images.forEach((img)=>{
        let wrapper = document.createElement("div")
        wrapper.id="thumbnail_"+i
        wrapper.addEventListener("click", e => {
            this.checkPreviousImg()
            if(isNaN(parseInt(e.path[1].id.split("_")[1]))){
              this.currentIMG = parseInt(e.path[0].id.split("_")[1])
            }else{
              this.currentIMG = parseInt(e.path[1].id.split("_")[1])
            }
            this.changeImg(this.currentIMG)
        })
        wrapper.addEventListener("mouseenter", e => {
            e.target.children[0].style.visibility = "visible"
        })
        wrapper.addEventListener("mouseleave", e => {
            e.target.children[0].style.visibility = "hidden"
        })
        let number = document.createElement("div")
        number.classList.add("imgNumber")
        let text = document.createElement("p")
        text.classList.add("textNumber")
        text.innerText=i+1
        let el = document.createElement("img")
        if(i=="0")
          el.classList.add("active_thumbnail")
        el.classList.add("thumbnailIMG")
        el.loading = 'lazy'
        el.style.height=img.height
        el.src=img.url
        number.append(text)
        wrapper.append(number,el)
        this.$refs.imgThumbnail.append(wrapper)
        i++;
      });
    },
    checknChange(side) {
      if (side === "left") {
          if (this.currentIMG > 0) {
            this.checkPreviousImg()
            this.currentIMG--
            this.changeImg(this.currentIMG)
          }
      } else if (side === "right") {
          if (this.currentIMG < this.imagesArray.length - 1) {
            this.checkPreviousImg()
            this.currentIMG++
            this.changeImg(this.currentIMG)
          }
      }
    },

    changeImg(i) {
        let thumb = this.$refs.imgThumbnail.children[i]
        let img = this.$refs.imgPlaceholder.children[i]
        thumb.classList.add("active_thumbnail")
        img.classList.add("active")
        img.classList.remove("hide")
        let thumb_div = this.$refs.imgThumbnail
        thumb_div.scrollTop = thumb.offsetTop
    },

    checkPreviousImg() {
         let thumb = this.$refs.imgThumbnail.children[this.currentIMG]
        let img = this.$refs.imgPlaceholder.children[this.currentIMG]
        thumb.classList.remove("active_thumbnail")
        img.classList.remove("active")
        img.classList.add("hide")
    },
    hidePanel(){
      let showPanel = this.$refs.hidePanel
        showPanel.addEventListener("click", e => {
            let panel = this.$refs.imgThumbnail
            let imgs = this.$refs.imgPlaceholder.children
            if (panel.classList.contains("panel-hide")) {
                imgs.forEach(el => {
                    el.style.height = "85vh"
                })
                panel.classList.remove("panel-hide")
                panel.classList.add("panel-show")
            } else {
                imgs.forEach(el => {
                    el.style.height = "90vh"
                })
                panel.classList.add("panel-hide")
                panel.classList.remove("panel-show")
            }
        })
    },
  	log(msg){
		console.log(msg)
	}
	},
	watch:{
		show: {
			handler: function(val) {
            	this.hideOverlay()

        }}
	}
	
}
</script>

<style lang="scss">
@import 'content.scss';
</style>