let images_array = []
let current_img = 0
already_opened = false

String.prototype.toDOM = function() {
    var d = document,
        i, a = d.createElement("div"),
        b = d.createDocumentFragment();
    a.innerHTML = this;
    while (i = a.firstChild) b.appendChild(i);
    return b;
};



function addTrigger() {
    let base = document.createElement("div")
    base.id = "triggerExt"
    base.style.cssText = 'width:5rem;height:5rem;background-color:#23272A;position:absolute;left:75%;z-index:999;'
    base.innerText = "develop"
    base.addEventListener("click", function() {
        if (!already_opened) {
            base.style.visibility = "hidden"
            init()
        } else {
            showOverlay()
        }

    })
    document.body.prepend(base)
}

function init() {
    //startObserver()
    document.addEventListener("keydown", e => {
        e.stopPropagation()

        if (e.code === "ArrowRight") {
            checknChange("right")
        } else if (e.code === "ArrowLeft") {
            checknChange("left")
        }
    }, true)
    addTrigger()
    let evalNumberofImg = document.evaluate('//div[@role="presentation"]//div[@aria-label="Preview"]/div/span', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue
    if (evalNumberofImg) {
        already_opened = true
        let numberOfImg = evalNumberofImg.innerText.split("/")[1]
        let firstImgURL = document.evaluate('//body//div[@role="presentation"]/a', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.href
        images_array[0] = firstImgURL
        let overlay = createOverlay()
        let imgDiv = createImgDiv(firstImgURL, numberOfImg)
        let changeImage = changeImageOverlay()

        let thumbScroll = addSidePanel()
        overlay.append(imgDiv, changeImage, thumbScroll)
        document.body.prepend(overlay)
        overlay.style.top = window.scrollY + "px"
        let quitEvt = document.querySelector("#quitOverlay")
        quitEvt.addEventListener("click", e=> {
            hideOverlay()
        })
        let showPanel = document.querySelector("#showSidePanel")
        showPanel.addEventListener("click", e=> {
          let panel = document.querySelector("#img-thumbnail")
          let img = document.querySelector("#overlayImg")
          if(panel.classList.contains("panel-hide")){
            img.style.height="85vh"
            panel.classList.remove("panel-hide")
            panel.classList.add("panel-show")
          }else{
            img.style.height="90vh"
            panel.classList.add("panel-hide")
            panel.classList.remove("panel-show")
          }
        })
    }
}

function disableScroll() {
    document.body.style.overflow = 'hidden';
    document.querySelector('html').scrollTop = window.scrollY;
}

function enableScroll() {
    document.body.style.overflow = null;
}

function createOverlay() {
    let base = document.createElement("div")
    base.id = "pixivOverlayAddon"
    base.style.cssText = `width:100vw;height:100vh;background-color:#23272A;position:absolute;z-index:1000;transition: top 0.5s ease-in;top:-300px;`
    let quitOverlay = "<svg id='quitOverlay' width='24' height='24' viewBox='0 0 1000 1000' style='fill: rgb(120, 120, 120);position:fixed;right:20px;top:20px;z-index:1020' xmlns='http://www.w3.org/2000/svg'><path d='M 500 0C 224 0 0 224 0 500C 0 776 224 1000 500 1000C 776 1000 1000 776 1000 500C 1000 224 776 0 500 0C 500 0 500 0 500 0 M 253 677C 242 666 242 652 253 641C 253 641 394 500 394 500C 394 500 253 359 253 359C 242 348 242 334 253 323C 253 323 323 253 323 253C 334 242 348 242 359 253C 359 253 500 394 500 394C 500 394 641 253 641 253C 652 242 666 242 677 253C 677 253 747 323 747 323C 758 334 758 348 747 359C 747 359 606 500 606 500C 606 500 747 641 747 641C 758 652 758 666 747 677C 747 677 677 747 677 747C 666 758 652 758 641 747C 641 747 500 606 500 606C 500 606 359 747 359 747C 348 758 334 758 323 747C 323 747 253 677 253 677'/></svg>".toDOM()
    let showSidePanel = `<svg id="showSidePanel" width='24' height='24' style='fill: rgb(120, 120, 120);position:fixed;right:60px;top:20px;z-index:1020' viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class=""><path data-v-103b2d42="" d="M0 0h24v24H0z" fill="none"></path> <path data-v-103b2d42="" d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path> <!----> <!----></svg>`.toDOM()
    base.append(showSidePanel, quitOverlay)
    disableScroll()
    return base
}

function hideOverlay() {
    let overlay = document.querySelector("#pixivOverlayAddon");
    let trigger = document.querySelector("#triggerExt");
    overlay.style.visibility = "hidden"
    overlay.style.top = "-300px"
    trigger.style.visibility = "visible"
    current_img = 0
    changeImg(current_img)
    enableScroll()
}

function showOverlay() {
    let overlay = document.querySelector("#pixivOverlayAddon");
    let trigger = document.querySelector("#triggerExt");
    overlay.style.visibility = "visible"
    overlay.style.top = window.scrollY + "px"
    trigger.style.visibility = "hidden"
    disableScroll()
}

function createImgDiv(firstImgUrl, num) {
    let img_div = document.createElement("div")
    img_div.style.cssText = "text-align:center;margin-top: 50vh;transform: translateY(-50%);"
    for (let i = 1; i < num; i++) {
        images_array[i] = firstImgUrl.replace(/p[0-9]/g, "p" + i)
    }
    img = document.createElement("img")
    img.id = "overlayImg"
    img.src = images_array[current_img]
    img.style.cssText = "height:85vh;"
    img_div.appendChild(img)
    return img_div
}

function changeImageOverlay() {
    c = current_img
    let wrapper = document.createElement("div")
    wrapper.style.cssText = `width: 100vw;height: 100vh;z-index: 1011;top:0;position: absolute;text-align: center;`
    let leftdiv = document.createElement("div")
    leftdiv.id = "prev"
    leftdiv.style.cssText = "width: 50vw;height: 100vh;top: 0;float: left;"
    leftdiv.addEventListener("click", function() {
        checknChange("left")
    })
    let rightdiv = document.createElement("div")
    rightdiv.id = "next"
    rightdiv.style.cssText = "width: 50vw;height: 100vh;top: 0;position: relative;float: right;"
    rightdiv.addEventListener("click", function() {
        checknChange("right")
    })
    wrapper.append(leftdiv, rightdiv)
    return wrapper
}

function checknChange(side) {
    if (side === "left") {
        if (current_img > 0) {
            checkPreviousImg()
            current_img -= 1
            changeImg(current_img)
        }
    } else if (side === "right") {
        if (current_img < images_array.length - 1) {
            checkPreviousImg()
            current_img += 1
            changeImg(current_img)
        }
    }
}

function changeImg(i) {
    let img_div = document.querySelector("#thumb_" + i)
    let img = document.querySelector("#overlayImg")
    img_div.classList.add("active")
    img.src = images_array[i]
    let thumb_div = document.querySelector("#img-thumbnail")
    thumb_div.scrollTop = img_div.offsetTop
}

function checkPreviousImg() {
    let img_div = document.querySelector("#thumb_" + current_img)
    img_div.classList.remove("active")
}

function addSidePanel() {
    let wrapper = document.createElement("span")
    wrapper.id = "img-thumbnail"
    wrapper.classList="panel-show"
    wrapper.style.cssText = "top:0;overflow:visible;overflow-x:hidden;position:absolute;width:10vw;height:100vh;background:rgb(53,53,53);z-index:1021;transition:display 0.5s,left 0.5s ease-out"
    for (let i = 0; i < images_array.length; i++) {

        let img_wrapper = document.createElement("div")
        let hover_div = document.createElement("div")
        hover_div.style.cssText = "background:rgba(120,120,120,.5);visibility:hidden;display:flex;width:inherit;height:inherit;z-index:1030;justify-content: center;align-items: center;"
        let num = document.createElement("p")
        num.style.cssText = "font-family: 'Calibri';font-size: 70px;color: black;"
        num.innerText = i + 1
        if (i === 0)
            img_wrapper.classList.add("active")
        img_wrapper.id = "thumb_" + i
        img_wrapper.style.cssText = "width:10vw;height:15vh;display: flex;justify-content: center;align-items: center;"

        img_wrapper.addEventListener("click", e => {
            checkPreviousImg()
            current_img = parseInt(e.path[1].id.split("_")[1])
            changeImg(i)
        })
        img_wrapper.addEventListener("mouseenter", e => {
            e.target.children[0].style.visibility = "visible"
        })
        img_wrapper.addEventListener("mouseleave", e => {
            e.target.children[0].style.visibility = "hidden"
        })
        let img = document.createElement("img")
        img.style.cssText = "width:auto;height:14vh;position:absolute;z-index:1029;"
        img.src = images_array[i]
        hover_div.append(num)
        img_wrapper.append(hover_div, img)
        wrapper.appendChild(img_wrapper)
    }
    return wrapper
}

function log(msg) {
    console.log(msg)
}




document.onreadystatechange = function() {
    if (document.readyState === 'complete') {
        init();

    }
}

function startObserver() {
    

    const targetNode = document.querySelector("div.sc-171jvz-0.ketmXG > div");

    // Options for the observer (which mutations to observe)
    const config = {
        attributes: true,
        childList: true,
        subtree: true
    };

    // Callback function to execute when mutations are observed
    const callback = function(mutationsList, observer) {
        // Use traditional 'for loops' for IE 11
        if (overlay = document.querySelector("#pixivOverlayAddon") != null) {
        document.querySelector("#pixivOverlayAddon").remove()
    }
        init()
        observer.disconnect
    };

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);
}