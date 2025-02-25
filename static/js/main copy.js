const swiper = new Swiper('.swiper', {
  loop: true, // 开启循环滚动
  autoplay: {
    delay: 0, // 设置为 0 使其无间隔滚动
    disableOnInteraction: false, // 用户交互后是否停止自动滚动
  },
  speed: 3000, // 滚动速度（ms），调整更流畅
  slidesPerView: 'auto', // 适应内容大小
  spaceBetween: 80, // 幻灯片间距
  centeredSlides: true, // 使当前项居中
})

new WOW().init()

document.addEventListener('alpine:init', () => {
  Alpine.data('scrollBehavior', () => ({
    scrollToSection(id) {
      const element = document.getElementById(id)
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      }
    },
  }))
})

document.addEventListener('DOMContentLoaded', function () {
  const sendButton = document.querySelector('.send')
  const tab_2_email = document.getElementById('tab_2_email')
  let countdown = 60 // 倒计时时间（秒）

  // 获取错误条容器
  const errorBar = document.getElementById('error-bar')

  // 显示错误信息函数
  function showError(message) {
    errorBar.textContent = message
    errorBar.style.display = 'block' // 显示错误条
  }

  // 清除错误信息函数
  function clearError() {
    errorBar.textContent = ''
    errorBar.style.display = 'none' // 隐藏错误条
  }

  sendButton.addEventListener('click', function () {
    const emailValue = tab_2_email.value.trim()

    // 邮箱格式验证正则表达式
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    clearError() // 每次点击时清除错误信息

    if (emailValue === '') {
      showError('Please enter your email address.')
      return
    }

    if (!emailPattern.test(emailValue)) {
      showError('Please enter a valid email address.')
      return
    }

    if (sendButton.disabled) {
      return
    }

    console.log(emailValue)

    sendButton.disabled = true
    sendButton.textContent = `Resend (${countdown}s)`

    const interval = setInterval(() => {
      countdown--
      if (countdown <= 0) {
        clearInterval(interval)
        sendButton.disabled = false
        sendButton.textContent = 'Send'
        countdown = 60 // 重置倒计时
      } else {
        sendButton.textContent = `Resend (${countdown}s)`
      }
    }, 1000)
  })
})

// 注册点击事件监听器
document.addEventListener('DOMContentLoaded', function () {
  const tabTitle = document.getElementById('Tab_Title')
  const tab_1_email = document.getElementById('tab_1_email')
  const tab_1_password = document.getElementById('tab_1_password')
  const tab_2_email = document.getElementById('tab_2_email')
  const tab_2_captcha = document.getElementById('tab_2_captcha')
  const tab_1_signInBtn = document.getElementById('tab_1_signInBtn')
  const tab_2_signInBtn = document.getElementById('tab_2_signInBtn')

  // 获取错误条容器
  const errorBar = document.getElementById('error-bar')

  // 显示错误信息函数
  function showError(message) {
    errorBar.textContent = message
    errorBar.style.display = 'block' // 显示错误条
  }

  // 清除错误信息函数
  function clearError() {
    errorBar.textContent = ''
    errorBar.style.display = 'none' // 隐藏错误条
  }

  // 为 tab_1_signInBtn 和 tab_2_signInBtn 绑定 submit 事件
  tab_1_signInBtn.addEventListener('click', function (event) {
    console.log('Form submitted.')

    event.preventDefault() // 阻止表单提交，防止页面刷新
    const emailValue = tab_1_email.value.trim()
    const passwordValue = tab_1_password.value.trim()

    // 邮箱格式验证正则表达式
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    clearError() // 清除错误信息

    if (emailValue === '') {
      showError('Please enter your email address.')
      return
    }
    if (passwordValue === '') {
      showError('Please enter your password.')
      return
    }
    if (passwordValue.length < 6) {
      showError('Password cannot be less than 6 characters.')
      return
    }

    if (!emailPattern.test(emailValue)) {
      showError('Please enter a valid email address.')
      return
    }

    // 在这里添加你需要的逻辑
    console.log('Sign in button clicked for Tab 1.')
  })

  tab_2_signInBtn.addEventListener('click', function (event) {
    event.preventDefault() // 阻止表单提交，防止页面刷新
    const emailValue = tab_2_email.value.trim()
    const captchaValue = tab_2_captcha.value.trim()

    // 邮箱格式验证正则表达式
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    clearError() // 清除错误信息

    if (emailValue === '') {
      showError('Please enter your email address.')
      return
    }
    if (captchaValue === '') {
      showError('Please enter your captcha code.')
      return
    }

    if (!emailPattern.test(emailValue)) {
      showError('Please enter a valid email address.')
      return
    }

    // 在这里添加你需要的逻辑
    console.log('Sign in button clicked for Tab 2.')
  })

  // 监听 tabTitle 的点击事件
  tabTitle.addEventListener('click', function (event) {
    if (event.target.tagName === 'BUTTON') {
      console.log('Button clicked')

      clearError() // 清除错误信息
    }
  })
})
