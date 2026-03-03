const tts = require('../../utils/tts.js')

// 角色配置表
const roleConfigs = {
  5: [
    { name: '梅林', type: 'good' },
    { name: '派西维尔', type: 'good' },
    { name: '忠臣', type: 'good' },
    { name: '忠臣', type: 'good' },
    { name: '莫德雷德', type: 'evil' },
    { name: '刺客', type: 'evil' }
  ],
  6: [
    { name: '梅林', type: 'good' },
    { name: '派西维尔', type: 'good' },
    { name: '忠臣', type: 'good' },
    { name: '忠臣', type: 'good' },
    { name: '忠臣', type: 'good' },
    { name: '莫德雷德', type: 'evil' },
    { name: '刺客', type: 'evil' }
  ],
  7: [
    { name: '梅林', type: 'good' },
    { name: '派西维尔', type: 'good' },
    { name: '忠臣', type: 'good' },
    { name: '忠臣', type: 'good' },
    { name: '忠臣', type: 'good' },
    { name: '莫德雷德', type: 'evil' },
    { name: '刺客', type: 'evil' },
    { name: '奥伯伦', type: 'evil' }
  ],
  8: [
    { name: '梅林', type: 'good' },
    { name: '派西维尔', type: 'good' },
    { name: '忠臣', type: 'good' },
    { name: '忠臣', type: 'good' },
    { name: '忠臣', type: 'good' },
    { name: '莫德雷德', type: 'evil' },
    { name: '刺客', type: 'evil' },
    { name: '奥伯伦', type: 'evil' },
    { name: '莫甘娜', type: 'evil' }
  ],
  9: [
    { name: '梅林', type: 'good' },
    { name: '派西维尔', type: 'good' },
    { name: '忠臣', type: 'good' },
    { name: '忠臣', type: 'good' },
    { name: '忠臣', type: 'good' },
    { name: '忠臣', type: 'good' },
    { name: '莫德雷德', type: 'evil' },
    { name: '刺客', type: 'evil' },
    { name: '奥伯伦', type: 'evil' },
    { name: '莫甘娜', type: 'evil' }
  ],
  10: [
    { name: '梅林', type: 'good' },
    { name: '派西维尔', type: 'good' },
    { name: '忠臣', type: 'good' },
    { name: '忠臣', type: 'good' },
    { name: '忠臣', type: 'good' },
    { name: '忠臣', type: 'good' },
    { name: '忠臣', type: 'good' },
    { name: '莫德雷德', type: 'evil' },
    { name: '刺客', type: 'evil' },
    { name: '奥伯伦', type: 'evil' },
    { name: '莫甘娜', type: 'evil' }
  ]
}

// 夜间流程
const nightSteps = [
  { role: '所有人', type: 'neutral', instruction: '闭眼，握拳', duration: 20 },
  { role: '坏人阵营', type: 'evil', instruction: '莫德雷德、莫甘娜、刺客，睁眼，竖起大拇指，互认身份（奥伯伦不睁眼）', duration: 20 },
  { role: '坏人阵营', type: 'evil', instruction: '闭眼', duration: 20 },
  { role: '梅林', type: 'good', instruction: '睁眼，竖起大拇指，看竖起大拇指的人（莫德雷德不可见）', duration: 20 },
  { role: '梅林', type: 'good', instruction: '闭眼', duration: 20 },
  { role: '派西维尔', type: 'good', instruction: '睁眼，竖起大拇指，看梅林和莫甘娜', duration: 20 },
  { role: '派西维尔', type: 'good', instruction: '闭眼', duration: 20 },
  { role: '所有人', type: 'neutral', instruction: '天亮了，所有人睁眼', duration: 20 }
]

Page({
  data: {
    playerCount: 5,
    roles: [],
    isNightMode: false,
    isComplete: false,
    currentStep: 0,
    totalSteps: nightSteps.length,
    steps: nightSteps,
    timeLeft: 20,
    isPaused: false,
    timer: null
  },

  onLoad() {
    this.updateRoles(5)
  },

  onCountChange(e) {
    const count = e.detail.value
    this.setData({ playerCount: count })
    this.updateRoles(count)
  },

  updateRoles(count) {
    this.setData({ roles: roleConfigs[count] })
  },

  startNight() {
    this.setData({
      isNightMode: true,
      isComplete: false,
      currentStep: 0,
      timeLeft: 20,
      isPaused: false
    })
    this.showStep()
  },

  showStep() {
    const step = nightSteps[this.data.currentStep]
    const text = step.role + '，' + step.instruction
    
    // 播报语音两遍
    tts.speakTwice(text)
    
    // 开始倒计时
    this.startTimer()
  },

  startTimer() {
    this.clearTimer()
    
    const timer = setInterval(() => {
      if (!this.data.isPaused && this.data.timeLeft > 0) {
        const newTime = this.data.timeLeft - 1
        this.setData({ timeLeft: newTime })
        
        if (newTime === 0) {
          this.clearTimer()
          // 自动下一步
          setTimeout(() => this.autoNext(), 1000)
        }
      }
    }, 1000)
    
    this.setData({ timer })
  },

  clearTimer() {
    if (this.data.timer) {
      clearInterval(this.data.timer)
      this.setData({ timer: null })
    }
  },

  autoNext() {
    if (this.data.currentStep < nightSteps.length - 1) {
      this.setData({
        currentStep: this.data.currentStep + 1,
        timeLeft: 20
      })
      this.showStep()
    } else {
      this.showComplete()
    }
  },

  nextStep() {
    this.clearTimer()
    this.autoNext()
  },

  togglePause() {
    this.setData({ isPaused: !this.data.isPaused })
  },

  goBack() {
    this.clearTimer()
    tts.stop()
    this.setData({
      isNightMode: false,
      currentStep: 0,
      timeLeft: 20
    })
  },

  showComplete() {
    this.setData({
      isNightMode: false,
      isComplete: true
    })
    tts.speak('天亮了，所有人睁眼，游戏开始！')
  },

  restart() {
    this.setData({
      isComplete: false,
      currentStep: 0,
      timeLeft: 20,
      isPaused: false
    })
  },

  onUnload() {
    this.clearTimer()
    tts.stop()
  }
})