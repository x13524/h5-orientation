import * as React from 'react'
import cx from 'classnames'
import styles from './index.less'
import {oneOf, string, func} from 'prop-types'

const ORIENTATION_TEXT = {
  横屏: 'landscape',
  竖屏: 'vertical'
}

export default class Orientation extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentOrientation: null,
    }
    this.isOrientationChangeSupported = window.screen && window.screen.orientation && window.screen.orientation.angle !== undefined && 'onorientationchange' in window
  }

  detectResize() {
    if (this.isOrientationChangeSupported) {
      // 如果当前浏览器支持使用 onorientationchange , 则使用该方法进行横竖屏判断
      this.onOrientationchange()
      window.addEventListener('orientationchange', this.onOrientationchange, false)
      this.dispose = () => window.removeEventListener('orientationchange', this.onOrientationchange, false)
    } else {
      // 如果不支持, 则通过 resize 方法判断横竖屏
      this.onPageResize()
      window.addEventListener('resize', this.onPageResize, false)
      this.dispose = () => window.removeEventListener('resize', this.onPageResize, false)
    }
  }

  // 使用手机自带的横竖屏判断
  onOrientationchange = () => {
    const angle = window.screen.orientation.angle
    if (angle === 0 || angle === 180 /* 竖屏 */) {
      this.onChange(ORIENTATION_TEXT['竖屏'])
    } else {
      this.onChange(ORIENTATION_TEXT['横屏'])
    }
  }

  onChange = type => {
    this.setState({currentOrientation: type})
  }

  componentDidMount() {
    this.detectResize()
  }

  componentWillUnmount() {
    this.dispose()
  }

  onPageResize = () => {
    const {currentOrientation} = this.state
    const timer = setTimeout(() => {
      if (window.innerWidth >= window.innerHeight && currentOrientation !== ORIENTATION_TEXT['横屏']) {
        this.onChange(ORIENTATION_TEXT['横屏'])
      } else if (window.innerWidth < window.innerHeight && currentOrientation !== ORIENTATION_TEXT['竖屏']) {
        this.onChange(ORIENTATION_TEXT['竖屏'])
      }
      clearTimeout(timer)
    }, 66)
  }

  renderContent() {
    const {promptImg, renderContent, orientation} = this.props
    if (renderContent && typeof renderContent === 'function') {
      return renderContent()
    }
    return (
      <div>
        <img className={styles.promptImg} src={promptImg} alt="横竖屏提示"/>
        <p className={styles.orientationText}>请保持{orientation === ORIENTATION_TEXT['竖屏'] ? '横屏' : '竖屏'}浏览</p>
      </div>
    )
  }

  render() {
    const {currentOrientation} = this.state
    const {orientation} = this.props

    if (currentOrientation === orientation) {
      return <div className={cx(styles.orientationMask, styles.showMask)}>{this.renderContent()}</div>
    }
    return null
  }
}

Orientation.defaultProps = {
  orientation: ORIENTATION_TEXT['横屏'],
  promptImg: 'https://s2.ax1x.com/2019/01/10/FOWfu8.png'
}

Orientation.propTypes = {
  /**
   * 传入横屏还是竖屏的判断  landscape: 横屏   vertical: 竖屏
   */
  orientation: oneOf(['landscape', 'vertical']),

  /**
   * 用于提示用户图片, 优先级小于 "renderContent"
   * 默认: //xoyo.xoyocdn.com/mobile/img/icon-no-horizontal.58236282.png
   */
  promptImg: string,

  /**
   * 渲染主体内容, 开发者可以自定义如横屏时展示的具体内容
   * 当该值不存在时, 使用默认属性 "promptImg"
   */
  renderContent: func
}
