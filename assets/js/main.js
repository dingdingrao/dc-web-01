const swiper = new Swiper('.swiper', {
  loop: true, // Turn on cycle scrolling
  autoplay: {
    delay: 0, // Set it to 0 to make it scroll without intervals
    disableOnInteraction: false, // Whether to stop auto-scrolling after user interaction
  },
  speed: 3000, // Scroll speed (ms) for smoother adjustments
  slidesPerView: 'auto', // Adapts to the size of the content
  spaceBetween: 80, // Slide spacing
  centeredSlides: true, // Center the current item
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

// Send a request function
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

// Displays the error message function
function showError(message) {
  const errorBar = document.getElementById('error-bar')
  errorBar.textContent = message
  errorBar.style.display = 'block' // An error bar is displayed
}
// Clear the error message function
function clearError() {
  const errorBar = document.getElementById('error-bar')
  errorBar.textContent = ''
  errorBar.style.display = 'none' // Hide the error bar
}

// tabTitle
const tabTitle = () => {
  console.log('Button tabTitle')

  clearError() // Clear the error message
}

// sendButton
const sendButton = async () => {
  console.log('sendButton')
  const sendButton = document.querySelector('.send')
  const tab_2_email = document.getElementById('tab_2_email')
  let countdown = 60 // Countdown time (seconds)

  const emailValue = tab_2_email.value.trim()

  // Mailbox format validates regular expressions
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  clearError() // Clear the error message with each click

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

  // Send the request to the server
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
      countdown = 60 // Reset the countdown
    } else {
      sendButton.textContent = `Resend (${countdown}s)`
    }
  }, 1000)
}

// tab_1_signInBtn click events
const tab_1_signInBtn = async () => {
  console.log('tab_1_signInBtn')
  const tab_1_email = document.getElementById('tab_1_email')
  const tab_1_password = document.getElementById('tab_1_password')
  const emailValue = tab_1_email.value.trim()
  const passwordValue = tab_1_password.value.trim()

  // Mailbox format validates regular expressions
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  clearError() // Clear the error message

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

  // Add the logic you need here
  console.log('Sign in button clicked for Tab 1.')

  // Send the request to the server
  const response = await sendRequest('https://api.thequestlabs.com/api/v1/login', {
    user_name: emailValue,
    user_passwd: passwordValue,
  })

  if (response.code === 0) {
    // ✅ Store response.data to localStorage
    localStorage.setItem('token', response?.data?.token)
    localStorage.setItem('user', JSON.stringify(response?.data))
    window.location.href = './index.html'
  }
}

// tab_2_signInBtn click events
const tab_2_signInBtn = async () => {
  console.log('tab_2_signInBtn')
  const tab_2_email = document.getElementById('tab_2_email')
  const tab_2_captcha = document.getElementById('tab_2_captcha')
  const emailValue = tab_2_email.value.trim()
  const captchaValue = tab_2_captcha.value.trim()

  // Mailbox format validates regular expressions
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  clearError() // Clear the error message

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

  // Add the logic you need here
  console.log('Sign in button clicked for Tab 2.')

  // Send the request to the server
  const response = await sendRequest('https://api.thequestlabs.com/api/v1/login', {
    user_name: emailValue,
    user_passwd: captchaValue,
  })

  if (response.code === 0) {
    // ✅ Store response.data to localStorage
    localStorage.setItem('token', response?.data?.token)
    localStorage.setItem('user', JSON.stringify(response?.data))

    window.location.href = './index.html'
  }
}

// Create your account click events
const signUpBtn = async () => {
  console.log('signUpBtn')
  const email = document.getElementById('tab_2_email')
  const password = document.getElementById('password')
  const signUp_captcha = document.getElementById('signUp_captcha')
  const emailValue = email.value.trim()
  const passwordValue = password.value.trim()
  const captchaValue = signUp_captcha.value.trim()

  // Mailbox format validates regular expressions
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  clearError() // Clear the error message

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

  // Add the logic you need here
  console.log('Sign up button clicked.')

  // Send the request to the server
  const response = await sendRequest('https://api.thequestlabs.com/api/v1/register', {
    user_name: emailValue,
    user_passwd: passwordValue,
    captcha: captchaValue,
  })

  if (response.code === 0) {
    // ✅ Store response.data to localStorage
    localStorage.setItem('token', response?.data?.token)
    localStorage.setItem('user', JSON.stringify(response?.data))

    window.location.href = './index.html'
  }
}

// Google The click event of the login button
const googleLoginBtn = async () => {
  const client = google.accounts.oauth2.initTokenClient({
    client_id: '743649952818-6a5f06glf2j4c3c0pl32hidt8mbo5pof.apps.googleusercontent.com',
    scope: 'email profile openid',
    callback: async response => {
      if (response.access_token) {
        // Get detailed user information
        const userinfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${response.access_token}` },
        })

        const profileData = await userInfo?.json()
        console.log('Full user information:', profileData)

        const auth_login_response = await sendRequest(
          'https://api.thequestlabs.com/api/v1/auth_login',
          {
            user_name: profileData.name,
            google_auth_id: 'xxxx.apps.googleusercontent.com',
          }
        )

        // Examples of key fields
        console.log('response', response)
        console.log('auth_login_response', auth_login_response)

        if (response.access_token) {
          // ✅ Store response.data to localStorage
          localStorage.setItem('token', response.access_token)
          localStorage.setItem('user', JSON.stringify(response?.data))

          window.location.href = './index.html'
        }
      }
    },
    error_callback: error => {
      console.error('OAuth errors:', error)
    },
  })
  client.requestAccessToken()
}
