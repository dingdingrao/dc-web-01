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

// 发送请求函数
const sendRequest = async (url, data, method = 'POST') => {
  console.log('Sending request to:', url)

  try {
    const formData = new URLSearchParams()
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        formData.append(key, data[key])
      }
    }

    const response = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: method === 'GET' ? null : formData.toString(),
    })

    const result = await response.json()
    if (result.code === 0) {
      console.log('Request successful:', result)
      return result
    } else {
      console.error('Request failed:', result)
      showError(result.info || result.data.info || 'Request failed. Please try again.')
    }
  } catch (error) {
    console.error('Error:', error)
  }
}

// 显示错误信息函数
function showError(message) {
  const errorBar = document.getElementById('error-bar')
  errorBar.textContent = message
  errorBar.style.display = 'block' // 显示错误条
}
// 清除错误信息函数
function clearError() {
  const errorBar = document.getElementById('error-bar')
  errorBar.textContent = ''
  errorBar.style.display = 'none' // 隐藏错误条
}

// tabTitle 的点击事件
const tabTitle = () => {
  console.log('Button tabTitle')

  clearError() // 清除错误信息
}

// sendButton 的点击事件
const sendButton = async () => {
  console.log('sendButton')
  const sendButton = document.querySelector('.send')
  const tab_2_email = document.getElementById('tab_2_email')
  let countdown = 60 // 倒计时时间（秒）

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

  // 发送请求到服务器
  await sendRequest('https://api.thequestlabs.com/api/v1/send_code', {
    user_name: emailValue,
  })

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
}

// tab_1_signInBtn 的点击事件
const tab_1_signInBtn = async () => {
  console.log('tab_1_signInBtn')
  const tab_1_email = document.getElementById('tab_1_email')
  const tab_1_password = document.getElementById('tab_1_password')
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

  // 发送请求到服务器
  const response = await sendRequest('https://api.thequestlabs.com/api/v1/login', {
    user_name: emailValue,
    user_passwd: passwordValue,
  })

  if (response.code === 0) {
    // ✅ 存储 response.data 到 localStorage
    localStorage.setItem('token', response?.data?.token)
    localStorage.setItem('user', JSON.stringify(response?.data))
    window.location.href = './index.html'
  }
}

// tab_2_signInBtn 的点击事件
const tab_2_signInBtn = async () => {
  console.log('tab_2_signInBtn')
  const tab_2_email = document.getElementById('tab_2_email')
  const tab_2_captcha = document.getElementById('tab_2_captcha')
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

  // 发送请求到服务器
  const response = await sendRequest('https://api.thequestlabs.com/api/v1/login', {
    user_name: emailValue,
    user_passwd: captchaValue,
  })

  if (response.code === 0) {
    // ✅ 存储 response.data 到 localStorage
    localStorage.setItem('token', response?.data?.token)
    localStorage.setItem('user', JSON.stringify(response?.data))

    window.location.href = './index.html'
  }
}

// Create your account 的点击事件
const signUpBtn = async () => {
  console.log('signUpBtn')
  const email = document.getElementById('tab_2_email')
  const password = document.getElementById('password')
  const signUp_captcha = document.getElementById('signUp_captcha')
  const emailValue = email.value.trim()
  const passwordValue = password.value.trim()
  const captchaValue = signUp_captcha.value.trim()

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
  if (captchaValue === '') {
    showError('Please enter your captcha code.')
    return
  }

  if (!emailPattern.test(emailValue)) {
    showError('Please enter a valid email address.')
    return
  }

  // 在这里添加你需要的逻辑
  console.log('Sign up button clicked.')

  // 发送请求到服务器
  const response = await sendRequest('https://api.thequestlabs.com/api/v1/register', {
    user_name: emailValue,
    user_passwd: passwordValue,
    captcha: captchaValue,
  })

  if (response.code === 0) {
    // ✅ 存储 response.data 到 localStorage
    localStorage.setItem('token', response?.data?.token)
    localStorage.setItem('user', JSON.stringify(response?.data))

    window.location.href = './index.html'
  }
}

// Google 登录按钮的点击事件
const googleLoginBtn = async () => {
  const client = google.accounts.oauth2.initTokenClient({
    client_id: '743649952818-6a5f06glf2j4c3c0pl32hidt8mbo5pof.apps.googleusercontent.com',
    scope: 'email profile openid',
    callback: async response => {
      if (response.access_token) {
        // 获取详细用户信息
        const userinfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${response.access_token}` },
        })

        const profileData = await userInfo?.json()
        console.log('完整用户信息:', profileData)

        const auth_login_response = await sendRequest(
          'https://api.thequestlabs.com/api/v1/auth_login',
          {
            user_name: profileData.name,
            google_auth_id: 'xxxx.apps.googleusercontent.com',
          }
        )

        // 关键字段示例
        console.log('response', response)
        console.log('auth_login_response', auth_login_response)

        if (response.access_token) {
          // ✅ 存储 response.data 到 localStorage
          localStorage.setItem('token', response.access_token)
          localStorage.setItem('user', JSON.stringify(response?.data))

          window.location.href = './index.html'
        }
      }
    },
    error_callback: error => {
      console.error('OAuth错误:', error)
    },
  })
  client.requestAccessToken()
}
