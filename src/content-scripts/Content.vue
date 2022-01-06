<template>
  <div :key="id" :id="id">
    <transition name="fade">
      <div id="overlay" ref="overlay" v-show="show">
        <svg
          v-on:click="hidePanel()"
          id="showSidePanel"
          ref="hidePanel"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          class=""
        >
          <title>Hide/Show Left Panel</title>
          <path data-v-103b2d42="" d="M0 0h24v24H0z" fill="none"></path>
          <path
            data-v-103b2d42=""
            d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"
          ></path>
        </svg>
        <svg
          v-on:click="show = !show"
          ref="quitOverlay"
          id="quitOverlay"
          width="24"
          height="24"
          viewBox="0 0 1000 1000"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>Hide Overlay</title>
          <path
            d="M 500 0C 224 0 0 224 0 500C 0 776 224 1000 500 1000C 776 1000 1000 776 1000 500C 1000 224 776 0 500 0C 500 0 500 0 500 0 M 253 677C 242 666 242 652 253 641C 253 641 394 500 394 500C 394 500 253 359 253 359C 242 348 242 334 253 323C 253 323 323 253 323 253C 334 242 348 242 359 253C 359 253 500 394 500 394C 500 394 641 253 641 253C 652 242 666 242 677 253C 677 253 747 323 747 323C 758 334 758 348 747 359C 747 359 606 500 606 500C 606 500 747 641 747 641C 758 652 758 666 747 677C 747 677 677 747 677 747C 666 758 652 758 641 747C 641 747 500 606 500 606C 500 606 359 747 359 747C 348 758 334 758 323 747C 323 747 253 677 253 677"
          ></path>
        </svg>
        <main id="imgPlaceholder" ref="imgPlaceholder">
          <VImg 
          :id="'img_'+index" 
          :class="setImgClass(index)" 
          v-for="(img,index) in imagesArray" 
          :key="index" 
          :src="transformImgUrl(img.url)" 
          :placeholder="tinyImagesArray[index].url" 
          alt="Main images"
          />
        </main>
        <div id="change">
          <div id="prev" v-on:click="checknChange('left')"></div>
          <div id="next" v-on:click="checknChange('right')"></div>
        </div>
        <aside id="imgThumbnail" ref="imgThumbnail" class="panel-show">
          <div
            :id="'thumbnail_'+index"
            v-for="(img,index) in imagesArray"
            :key="index"
            v-on="handlers"
          >
            <div class="imgNumber">
              <p class="textNumber">{{index+1}}</p>
            </div>
            <VImg
              :class="setThumbnailClass(index)"
              :src="transformImgUrl(img.url)"
              :placeholder="tinyImagesArray[index].url"
              :height="setThumbnailHeight('13')"
              alt="Thumbnail images"
            />
          </div>
        </aside>
        <footer>
          <button title="Add to public bookmarks" class="fav" @click="publicFav">
            <svg class="footer-svg" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path ref="publicNotFav" style="display: block" d="M12 9.229c.234-1.12 1.547-6.229 5.382-6.229 2.22 0 4.618 1.551 4.618 5.003 0 3.907-3.627 8.47-10 12.629-6.373-4.159-10-8.722-10-12.629 0-3.484 2.369-5.005 4.577-5.005 3.923 0 5.145 5.126 5.423 6.231zm-12-1.226c0 4.068 3.06 9.481 12 14.997 8.94-5.516 12-10.929 12-14.997 0-7.962-9.648-9.028-12-3.737-2.338-5.262-12-4.27-12 3.737z"/>
            <path ref="publicFav" style="display: none" d="M12 4.435c-1.989-5.399-12-4.597-12 3.568 0 4.068 3.06 9.481 12 14.997 8.94-5.516 12-10.929 12-14.997 0-8.118-10-8.999-12-3.568z"/>
          </svg>
        </button>
        <button title="Add to private bookmarks" class="fav" @click="privateFav">
          <svg  class="footer-svg" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path ref="privateNotFav" style="display:block;" d="M10 16c0-1.104.896-2 2-2s2 .896 2 2c0 .738-.404 1.376-1 1.723v2.277h-2v-2.277c-.596-.347-1-.985-1-1.723zm11-6v14h-18v-14h3v-4c0-3.313 2.687-6 6-6s6 2.687 6 6v4h3zm-13 0h8v-4c0-2.206-1.795-4-4-4s-4 1.794-4 4v4zm11 2h-14v10h14v-10z"/>
            <path ref="privateFav" style="display: none" d="M18 10v-4c0-3.313-2.687-6-6-6s-6 2.687-6 6v4h-3v14h18v-14h-3zm-5 7.723v2.277h-2v-2.277c-.595-.347-1-.984-1-1.723 0-1.104.896-2 2-2s2 .896 2 2c0 .738-.404 1.376-1 1.723zm-5-7.723v-4c0-2.206 1.794-4 4-4 2.205 0 4 1.794 4 4v4h-8z"/>
          </svg>
        </button>
        </footer>
      </div>
    </transition>
    <div id="switch" ref="switch" v-on:click="show = !show">
      <div></div>
      <div></div>
    </div>
  </div>
</template>

<script>
import { VImg } from 'vuetensils/src/components';

export default {
  name: 'Content',
  components: {
    VImg,
  },
  data(){
    return {
        show:false,
        currentIMG:0,
        imagesArray:undefined,
        tinyImagesArray:undefined,
        id: this.$parent.urlId,
        handlers:{
          click:this.addListenerThumbnail,
          mouseenter:this.addListenerThumbnail,
          mouseleave:this.addListenerThumbnail
        }
      }
  },
  mounted() {
    window.scrollTo(0,0);
    if(document.evaluate('//*[@id="root"]/div[2]/div[2]/div/div[1]/main/section/div[1]/div/div[4]/div/div[2]/section/div[3]/a', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue){ //check if its already fav
      
      if(document.querySelector("a[class='sc-kgq5hw-1 eHcNWv'] > svg > path:first-of-type")!=undefined){ //check if fav is private or not
        this.$refs.privateNotFav.style.display="none";
        this.$refs.privateFav.style.display="block";
      }else{
        this.$refs.publicNotFav.style.display="none";
        this.$refs.publicFav.style.display="block";
      }
    }
    this.addDocListener();
    this.lockScroll();
    this.storeIMG(this.$parent.imgNumber.innerText.split("/")[1]);
    document.body.insertBefore(this.$el, document.body.firstChild);
    this.show=true;
    this.$emit("mounted");
  },
  methods:{
    async clearStorage(){
        chrome.storage.local.clear(()=> {
        var error = chrome.runtime.lastError;
        if (error) {
            console.error(error);
          }
        });
    },
    lockScroll(){
      document.body.style.overflow="hidden";
    },
    unlockScroll(){
      document.body.style.overflow="initial";
    },
    storeIMG(numberOfImg) {
      let firstImg = document.evaluate('//body//div[@role="presentation"]/a', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.href;
      let img = []
      let tinyimg=[];
      for(let i=0;i<numberOfImg;i++){
        img[i] = {'url': firstImg.replace(/p[0-9]/g, "p" + i)}
        tinyimg[i]={'url':this.getTinyImg(firstImg.replace(/p[0-9]/g, "p" + i))}
      }
      this.getIMG(img,tinyimg)
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
    async getIMG(img,tinyimg){
      this.imagesArray=img;
      this.tinyImagesArray=tinyimg;
      this.addListenerThumbnail();
    },
    transformImgUrl(url){
      url=url.replace("img-original","img-master")
      url=url.substring(0,url.lastIndexOf("."))+"_master1200.jpg";
      return url
    },
    getTinyImg(url){
      url=url.replace("img-original","c/540x540_70/img-master")
      url=url.substring(0,url.lastIndexOf("."))+"_master1200.jpg";
      return url;
    },
    setThumbnailHeight(width){
      return window.screen.availHeight*(width/100);
    },
    setThumbnailClass(index){
      let classStr="thumbnailIMG"
      if(index==0)
        classStr+=" active_thumbnail"
      return classStr;
    },
    setImgClass(index){
      let classStr=""
      if(index==0)
        classStr+="active"
      else
        classStr+="hide"
      return classStr;
    },
    addListenerThumbnail(e){
      if(e===undefined) return;
        if(e.type==="click"){
            this.checkPreviousImg()
            if(isNaN(parseInt(e.path[1].id.split("_")[1]))){
              this.currentIMG = parseInt(e.path[0].id.split("_")[1])
            }else{
              this.currentIMG = parseInt(e.path[1].id.split("_")[1])
            }
            this.changeImg(this.currentIMG)
        }else if(e.type==="mouseenter"){
            e.target.children[0].style.visibility = "visible"
        }else if(e.type==="mouseleave"){
            e.target.children[0].style.visibility = "hidden"
        }

    },
    addDocListener(){
      document.addEventListener("keydown", e => {
            e.stopPropagation()
            console.log(e.code)
            if (e.code === "ArrowRight") {
                this.checknChange("right")
            } else if (e.code === "ArrowLeft") {
                this.checknChange("left")
            } else if(e.code==="Escape"){
              this.show!=this.show;
            }else if ( e.code==="KeyF"){
              this.publicFav();
            } else if(e.code==="KeyP"){
              this.privateFav();
            }
        }, true)
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
      let panel = this.$refs.imgThumbnail
      let imgs = this.$refs.imgPlaceholder.children
      console.log(imgs)
      if (panel.classList.contains("panel-hide")) {
        for(let img of imgs){
            img.children[0].style.height = "85vh"
        }
        panel.classList.remove("panel-hide")
        panel.classList.add("panel-show")
      } else {
         for(let img of imgs){
            img.children[0].style.height = "90vh"
        }
        panel.classList.add("panel-hide")
        panel.classList.remove("panel-show")
      }
    },
    publicFav(){
      let favButton = document.querySelector("button.sc-kgq5hw-0.fgVkZi.gtm-main-bookmark");
      favButton.click();
      setTimeout(()=>{
        this.$refs.overlay.style.transform="translateY(168px)";
        this.$refs.publicNotFav.style.display="none";
        this.$refs.publicFav.style.display="block";
      }, 1500)
    },
    privateFav(){
      let checkNextButton=()=>{
        let checkPrivateFav = setInterval(()=>{
                let button = document.querySelector("li.sc-1o8nozx-2.bmbKoQ")
                if(button!=undefined){
                  button.click();
                  this.$refs.privateNotFav.style.display="none";
        this.$refs.privateFav.style.display="block";
                  clearInterval(checkPrivateFav);
                }
              },100)
      }
      let checkFirstButton = setInterval(()=>{
        let privateFavButton=document.querySelector("button.l6avS_e._1W1yk-M");
        if(privateFavButton!=undefined){
          privateFavButton.click();
          checkNextButton();
          clearInterval(checkFirstButton)
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
        if(!val){
          this.unlockScroll()
        }else{
          window.scrollTo(0,0)
          this.lockScroll()
        }
      }}
  }

}
</script>

<style lang="scss">
@import "content.scss";
</style>
