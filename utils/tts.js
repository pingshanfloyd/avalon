// 语音播报工具
const innerAudioContext = wx.createInnerAudioContext()

module.exports = {
  // 播报两遍
  speakTwice(text) {
    this.speak(text, () => {
      setTimeout(() => {
        this.speak(text)
      }, 500)
    })
  },

  // 播报一次
  speak(text, onEnd) {
    // 使用微信语音合成（需要配置腾讯云或百度语音）
    // 这里使用简单的提示音代替，实际项目需要接入语音合成API
    
    // 方案1: 使用微信同声传译插件（需要申请）
    // const plugin = requirePlugin('WechatSI')
    // plugin.textToSpeech({ content: text, lang: 'zh_CN' })
    
    // 方案2: 使用预录制的音频文件
    // innerAudioContext.src = '/audio/' + text + '.mp3'
    // innerAudioContext.play()
    
    // 方案3: 调用第三方语音合成API（腾讯云、百度、科大讯飞）
    this.callTTSAPI(text, onEnd)
  },

  // 调用语音合成API（示例：腾讯云）
  callTTSAPI(text, onEnd) {
    // 实际使用时需要配置腾讯云 SecretId/SecretKey
    // 这里展示调用结构，需要替换为实际的API调用
    
    wx.request({
      url: 'https://tts.tencentcloudapi.com',
      method: 'POST',
      header: {
        'Content-Type': 'application/json'
      },
      data: {
        Text: text,
        SessionId: 'avalon_' + Date.now(),
        ModelType: 1,
        Volume: 0,
        Speed: 0,
        VoiceType: 1001
      },
      success: (res) => {
        if (res.data.Response && res.data.Response.Audio) {
          // base64音频转文件播放
          const fs = wx.getFileSystemManager()
          const filePath = wx.env.USER_DATA_PATH + '/tts_' + Date.now() + '.mp3'
          
          fs.writeFile({
            filePath: filePath,
            data: res.data.Response.Audio,
            encoding: 'base64',
            success: () => {
              innerAudioContext.src = filePath
              innerAudioContext.onEnded = onEnd
              innerAudioContext.play()
            }
          })
        }
      },
      fail: () => {
        console.log('TTS API调用失败')
        if (onEnd) onEnd()
      }
    })
  },

  // 停止播报
  stop() {
    innerAudioContext.stop()
  }
}