import * as React from 'react';
import cx from 'classnames';
import styles from './index.less';
import {oneOf, string, func} from 'prop-types';

export default class Orientation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stateDirection: null,
      width: undefined,
      height: undefined
    }
  }

  componentDidMount() {
    this.detectOrientationChange();
    this.onPageResize();
  }

  detectOrientationChange ()  {
    let optimizedResize = (function () {
      let callbacks = [];
      let running = false;

      // fired on resize event
      function resize() {
        if (!running) {
          running = true;
          if (window.requestAnimationFrame) {
            window.requestAnimationFrame(runCallbacks)
          } else {
            setTimeout(runCallbacks, 66)
          }
        }
      }

      // run the actual callbacks
      function runCallbacks() {
        callbacks.forEach(function (callback) {
          callback()
        });

        running = false
      }

      // adds callback to loop
      function addCallback(callback) {
        if (callback) {
          callbacks.push(callback)
        }
      }

      return {
        // public method to add additional callback
        add: function (callback) {
          if (!callbacks.length) {
            window.addEventListener('resize', resize)
          }
          addCallback(callback)
        }
      }
    })();

    // start process
    optimizedResize.add(() => {
      this.onPageResize()
    })
  };

  onPageResize = () => {
    const {width, height} = this.state;
    let _Width = 0,
      _Height = 0;

    let cw = document.documentElement.clientWidth;

    if (width === undefined && height === undefined) {
      let sw = window.screen.width;
      let sh = window.screen.height;
      // 2.在某些机型（如华为P9）下出现 srceen.width/height 值交换，所以进行大小值比较判断
      _Width = sw < sh ? sw : sh;
      _Height = sw >= sh ? sw : sh;
      this.setState({
        width: _Width,
        height: _Height
      })
    } else {
      _Width = width;
      _Height = height;
    }

    if (cw === _Width) {
      // 竖屏
      this.setState({
        stateDirection: 'vertical'
      })
    }

    if (cw === _Height) {
      // 横屏
      this.setState({
        stateDirection: 'landscape'
      })
    }
  };

  renderContent() {
    const {promptImg, renderContent} = this.props;
    if (renderContent) {
      return renderContent();
    }
    return (
      <img className={styles.promptImg} src={promptImg}/>
    )
  }

  render() {
    const {stateDirection} = this.state;
    const {orientation} = this.props;
    if (stateDirection === orientation) {
      return (
        <div
          className={cx(
            styles.orientationMask, styles.showMask
          )}
        >
          {this.renderContent()}
        </div>
      )
    }
    return null;
  }
}

Orientation.defaultProps = {
  orientation: 'landscape',
  promptImg: 'https://s2.ax1x.com/2019/01/10/FOWfu8.png'
};

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
};
