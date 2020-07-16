(function (window) {
  let w = 290 // canvas宽度
  let h = 155 // canvas高度
  const l = 42 // 滑块边长
  const r = 9 // 滑块半径
  const PI = Math.PI
  const L = l + r * 2 + 3 // 滑块实际边长
  var ILT='https://qiniu.madrock.com.cn/rev/imgs/b828deb8-5218-1e50-8a50-210c203b7fa8.png'

  function getRandomNumberByRange(start, end) {
    return Math.round(Math.random() * (end - start) + start)
  }

  function createCanvas(width, height) {
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    return canvas
  }

  function createImg(onload) {
    const img = new Image()
    img.crossOrigin = "Anonymous"
    img.onload = onload
    img.onerror = () => {
      img.setSrc(getRandomImgSrc(ILT ))
    }

    img.setSrc = function (src) {
      const isIE = window.navigator.userAgent.indexOf('Trident') > -1
      if (isIE) { // IE浏览器无法通过img.crossOrigin跨域，使用ajax获取图片blob然后转为dataURL显示
        const xhr = new XMLHttpRequest()
        xhr.onloadend = function (e) {
          const file = new FileReader() // FileReader仅支持IE10+
          file.readAsDataURL(e.target.response)
          file.onloadend = function (e) {
            img.src = e.target.result
          }
        }
        xhr.open('GET', src)
        xhr.responseType = 'blob'
        xhr.send()
      }
      else img.src = src
    }
    //固定一张图片
    img.setSrc(getRandomImgSrc(ILT ))
    return img
  }

  function createElement(tagName, className) {
    const elment = document.createElement(tagName)
    elment.className = className
    return elment
  }

  function addClass(tag, className) {
    if(tag){
      tag.classList.add(className)
    }
  
  }

  function removeClass(tag, className) {
    if(tag){
      tag.classList.remove(className)
    }
  }
  // function getImg(e){
  //    console.log(e)
  //  ILT=e
  //  createImg()
  //  }
  function getRandomImgSrc(src) {
    if(src){
    return src+""
    }else{
      return ILT
    }
    // return 'https://picsum.photos/300/150/?image=' + getRandomNumberByRange(0, 1084)
  
  }

  function draw(ctx, x, y, operation) {
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.arc(x + l / 2, y - r + 2, r, 0.72 * PI, 2.26 * PI)
    ctx.lineTo(x + l, y)
    ctx.arc(x + l + r - 2, y + l / 2, r, 1.21 * PI, 2.78 * PI)
    ctx.lineTo(x + l, y + l)
    ctx.lineTo(x, y + l)
    ctx.arc(x + r - 2, y + l / 2, r + 0.4, 2.76 * PI, 1.24 * PI, true)
    ctx.lineTo(x, y)
    ctx.lineWidth = 2
    ctx.fillStyle = 'rgba(255, 255, 255, 1)'
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)'
    ctx.stroke()
    ctx[operation]()
    ctx.globalCompositeOperation = 'destination-over'
  }

  function sum(x, y) {
    return x + y
  }

  function square(x) {
    return x * x
  }
  function checekLog(e) {
    if (e) {
      document.querySelector('.refreshIcon').click()
    }

  }
  class jigsaw {
    constructor({ el, width, height, imgList, onSuccess, onFail, onRefresh, reset }) {
      w = width
      h = height
      el.style.position = 'relative'
      el.style.width = w + 'px'
      Object.assign(el.style, {
        position: 'relative',
        width: w + 'px',
        margin: '0 auto'
      })
      this.el = el
      this.onSuccess = onSuccess
      this.onFail = onFail
      this.onRefresh = onRefresh
      this.width = width
      this.height = height
      ILT = imgList
      // console.log(reset)
      getRandomImgSrc(ILT)

    }

    init() {
      this.initDOM()
      this.initImg()
      this.bindEvents()
    }

    initDOM() {
      const canvas = createCanvas(w, h) // 画布
      const block = canvas.cloneNode(true) // 滑块
      const sliderContainer = createElement('div', 'sliderContainer')
      sliderContainer.style.width = w + 'px'
      const refreshIcon = createElement('div', 'refreshIcon')
      const sliderMask = createElement('div', 'sliderMask')
      const slider = createElement('div', 'slider')
      const sliderIcon = createElement('span', 'sliderIcon')
      const text = createElement('span', 'sliderText')
      const sliderTime=createElement('span', 'sliderTime')

      block.className = 'sliderContainer_active_block'
      text.innerHTML = '按住滑块向右拖动，完成验证'
      sliderTime.innerHTML = ''
      const el = this.el
      el.appendChild(canvas)
      el.appendChild(refreshIcon)
      el.appendChild(block)
      slider.appendChild(sliderIcon)
      sliderMask.appendChild(slider)
      sliderContainer.appendChild(sliderMask)
      sliderContainer.appendChild(text)
      sliderContainer.appendChild(sliderTime)
      el.appendChild(sliderContainer)

      Object.assign(this, {
        canvas,
        block,
        sliderContainer,
        refreshIcon,
        slider,
        sliderTime,
        sliderMask,
        sliderIcon,
        text,
        canvasCtx: canvas.getContext('2d'),
        blockCtx: block.getContext('2d')
      })

    }

    initImg() {
      const img = createImg(() => {
        this.draw()
        this.canvasCtx.drawImage(img, 0, 0, w, h)
        this.blockCtx.drawImage(img, 0, 0, w, h)
        const y = this.y - r * 2 - 1
        const ImageData = this.blockCtx.getImageData(this.x - 3, y, L, L)
        this.block.width = L
        this.blockCtx.putImageData(ImageData, 0, y)
      })
      this.img = img
      if(document.querySelector('canvas')){
        addClass(document.querySelector('canvas'), 'sliderContainer_active_canvas')
        addClass(document.querySelector('canvas.sliderContainer_active_block'), 'sliderContainer_active_canvas')
      }
  
    
    }

    draw() {
      // 随机创建滑块的位置
      this.x = getRandomNumberByRange(L + 35, w - (L + 10))
      this.y = getRandomNumberByRange(10 + r * 2, h - (L + 10))
      draw(this.canvasCtx, this.x, this.y, 'fill')
      draw(this.blockCtx, this.x, this.y, 'clip')
    }

    clean() {
      this.canvasCtx.clearRect(0, 0, w, h)
      this.blockCtx.clearRect(0, 0, w, h)
      this.block.width = w
    }
    renderTime(n,c){
           return (c-n)/1000 
    }
    bindEvents() {

      let useTime
      let that=this
      let lock=true
      this.el.onselectstart = () => false
      this.refreshIcon.onclick = () => {
        // console.log(that.sliderTime.innerText)
        this.text.innerHTML = '按住滑块向右拖动，完成验证'
        if(this.sliderTime.innerText.length>0){
          this.slider.addEventListener('mousedown', handleDragStart)
          this.slider.addEventListener('touchstart', handleDragStart)
          this.block.addEventListener('mousedown', handleDragStart)
          this.block.addEventListener('touchstart', handleDragStart)
          lock=true
        }
        this.reset()
        typeof this.onRefresh === 'function' && this.onRefresh()
      }
      let originX, originY, trail = [], isMouseDown = false
       const handleDragStart = function (e) {
        useTime=Date.now();
        originX = e.clientX || e.touches[0].clientX
        originY = e.clientY || e.touches[0].clientY
        isMouseDown = true
      }
      const handleDragMove = (e) => {
        if (!isMouseDown) return false
        const eventX = e.clientX || e.touches[0].clientX
        const eventY = e.clientY || e.touches[0].clientY
        const moveX = eventX - originX
        const moveY = eventY - originY
        if (moveX < 0 || moveX + 38 >= w) return false
        this.slider.style.left = moveX + 'px'
        const blockLeft = (w - 40 - 20) / (w - 40) * moveX
        this.block.style.left = blockLeft + 'px'
        addClass(this.sliderContainer, 'sliderContainer_active')
        this.sliderMask.style.width = moveX + 'px'
        trail.push(moveY)
      }
        
      const handleDragEnd = (e) => {
        if (!isMouseDown) return false
        isMouseDown = false
        const eventX = e.clientX || e.changedTouches[0].clientX
        if (eventX === originX) return false
        removeClass(this.sliderContainer, 'sliderContainer_active')
        this.trail = trail
        const { spliced, verified } = this.verify()
        if (spliced) {
          if (verified) {
            addClass(this.sliderContainer, 'sliderContainer_success')
            typeof this.onSuccess === 'function' && this.onSuccess()
            if(this.renderTime(useTime,Date.now())>10){
              this.sliderTime.innerText ='验证成功!'
            }else{
              this.sliderTime.innerText = `仅用了${this.renderTime(useTime,Date.now())}秒！`
            }
            this.slider.removeEventListener('touchstart', handleDragStart)
            this.slider.removeEventListener('mousedown', handleDragStart)
            this.block.removeEventListener('touchstart', handleDragStart)
            this.block.removeEventListener('mousedown', handleDragStart)
            removeClass(document.querySelector('.refreshIcon'), 'sliderContainer_active_showC')
            removeClass(document.querySelector('.sliderContainer_active_canvas'), 'sliderContainer_active_show')
            removeClass(document.querySelector('.sliderContainer_active_block'), 'sliderContainer_active_show')
            removeClass(document.querySelector('.refreshIcon'), 'sliderContainer_active_show')
            removeClass(document.querySelectorAll('.sliderContainer_active_input')[0], 'sliderContainer_active_hidden')
            removeClass(document.querySelectorAll('.sliderContainer_active_input')[1], 'sliderContainer_active_hidden')
            lock=false
          }
        } else {
          addClass(this.sliderContainer, 'sliderContainer_fail')
          this.text.innerHTML = '请再试一次'
          typeof this.onFail === 'function' && this.onFail()
          setTimeout(() => {
            this.reset()
          }, 500)
        }
      }
      // console.log( document.querySelector('.block'))
      document.querySelector('.sliderContainer').onmouseover = function () {
        if(lock){
          addClass(document.querySelector('.sliderContainer_active_canvas'), 'sliderContainer_active_show')
          addClass(document.querySelector('.sliderContainer_active_canvas'), 'sliderContainer_active_trs')
          addClass(document.querySelector('.sliderContainer_active_block'), 'sliderContainer_active_show')
          addClass(document.querySelectorAll('.sliderContainer_active_input')[0], 'sliderContainer_active_hidden')
          addClass(document.querySelectorAll('.sliderContainer_active_input')[1], 'sliderContainer_active_hidden')
          removeClass(document.querySelector('.sliderContainer_active_block'), 'sliderContainer_active_trs')
          addClass(document.querySelector('.refreshIcon'), 'refreshIcon_show')
          addClass(document.querySelector('.refreshIcon'), 'sliderContainer_active_showC')
        }
        // console.log(document.querySelector('canvas'))
  
      }
      document.querySelector('#captcha').onmouseleave = function () {
        // console.log(document.querySelector('canvas'))
        removeClass(document.querySelector('.refreshIcon'), 'sliderContainer_active_showC')
        removeClass(document.querySelector('.sliderContainer_active_canvas'), 'sliderContainer_active_show')
        removeClass(document.querySelector('.sliderContainer_active_block'), 'sliderContainer_active_show')
        removeClass(document.querySelector('.refreshIcon'), 'refreshIcon_show')
        removeClass(document.querySelectorAll('.sliderContainer_active_input')[0], 'sliderContainer_active_hidden')
        removeClass(document.querySelectorAll('.sliderContainer_active_input')[1], 'sliderContainer_active_hidden')
      }
      this.slider.addEventListener('mousedown', handleDragStart)
      this.slider.addEventListener('touchstart', handleDragStart)
      this.block.addEventListener('mousedown', handleDragStart)
      this.block.addEventListener('touchstart', handleDragStart)
      document.addEventListener('mousemove', handleDragMove)
      document.addEventListener('touchmove', handleDragMove)
      document.addEventListener('mouseup', handleDragEnd)
      document.addEventListener('touchend', handleDragEnd)
    }

    verify() {
      const arr = this.trail // 拖动时y轴的移动距离
      const average = arr.reduce(sum) / arr.length
      const deviations = arr.map(x => x - average)
      const stddev = Math.sqrt(deviations.map(square).reduce(sum) / arr.length)
      const left = parseInt(this.block.style.left)
      return {
        spliced: Math.abs(left - this.x) < 10,
        verified: stddev !== 0, // 简单验证拖动轨迹，为零时表示Y轴上下没有波动，可能非人为操作
      }
    }

    reset() {
      this.sliderContainer.className = 'sliderContainer'
      this.slider.style.left = 0
      this.block.style.left = 0
      this.sliderMask.style.width = 0
      this.clean()
   
     
      this.sliderTime.innerHTML = ''
      this.img.setSrc(getRandomImgSrc())
    }
  }

  window.jigsaw = {
    init: function (opts) {
      return new jigsaw(opts).init()
    },
    check: function (e) {
      return checekLog(e)
    },
//     imgList(e){
// return getImg(e)
//     }
  }
}(window))