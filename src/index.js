import * as React from 'react'
import cx from 'classnames'
import styles from './index.less'
import {oneOf, string, func} from 'prop-types'

export default class Orientation extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentOrientation: null
    }
  }

  componentDidMount() {
    this.onPageResize()
    window.addEventListener('resize', this.onPageResize, false)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onPageResize, false)
  }

  onPageResize = () => {
    const {currentOrientation} = this.state
    const timer = setTimeout(() => {
      if (window.innerWidth >= window.innerHeight && currentOrientation !== 'landscape') {
        this.setState({
          currentOrientation: 'landscape'
        })
      }
      if (window.innerWidth < window.innerHeight && currentOrientation !== 'vertical') {
        this.setState({
          currentOrientation: 'vertical'
        })
      }
      clearTimeout(timer)
    }, 66)
  }

  renderContent() {
    const {promptImg, renderContent} = this.props
    if (renderContent && typeof renderContent === 'function') {
      return renderContent()
    }
    return (
      <img className={styles.promptImg} src={promptImg} />
    )
  }

  render() {
    const {currentOrientation} = this.state
    const {orientation} = this.props

    if (currentOrientation === orientation) {
      return (
        <div className={cx(styles.orientationMask, styles.showMask)}>
          {this.renderContent()}
        </div>
      )
    }
    return null
  }
}

Orientation.defaultProps = {
  orientation: 'landscape',
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
