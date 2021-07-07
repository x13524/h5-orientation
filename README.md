# h5-orientation

> 横竖屏检测, 如果移动端处于横屏状态, 出现图片蒙层提示用户使用竖屏浏览页面

[![NPM](https://img.shields.io/npm/v/h5-orientation.svg)](https://www.npmjs.com/package/h5-orientation) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save h5-orientation
```

## Usage

```jsx

Orientation.propTypes = {
  /**
   * 横屏还是竖屏出现弹窗, 默认横屏  landscape: 横屏   vertical: 竖屏
   */
  orientation: oneOf(['landscape', 'vertical']),
  /**
   * 用于提示用户需要切换手机方向的图片, 优先级小于 "renderContent"
   * 默认: //xoyo.xoyocdn.com/mobile/img/icon-no-horizontal.58236282.png
   */
  promptImg: string,

  /**
   * 渲染主体内容, 开发者可以自定义如横屏时展示的具体内容
   * 当该值不存在时, 使用默认属性 "promptImg"
   */
  renderContent: func
}

```

用法1: 不传入任何参数, 默认横屏出现弹窗遮罩
```jsx
import React, { Component } from 'react'
import Orientation from 'h5-orientation'
class Example extends Component {
   render () {
     return (
       <Orientation />
     )
   }
 }

```

用法2: 定制化横屏或者竖屏的弹窗提示图片
```jsx
import React, { Component } from 'react'
import Orientation from 'h5-orientation'
class Example extends Component {
   render () {
     return (
       <Orientation
        orientation="vertical"
        promptImg="//s2.ax1x.com/2019/01/10/FOWfu8.png"
       />
     )
   }
 }

```

用法3: 定制化横屏或者竖屏的弹窗内容
```jsx
import React, { Component } from 'react'
import Orientation from 'h5-orientation'
import styles from './index.less'

class Example extends Component {
    renderContent = () => {
      return (
        <div className={styles.messageBox}>
          <img
            className={styles.messageImg}
            src="//s2.ax1x.com/2019/01/10/FOWfu8.png"
          />
          <p className={styles.messageText}>请横屏浏览器页面</p>
        </div>
      );
    };

   render () {
     return (
       <Orientation
        orientation = "vertical"
        promptImg = "//s2.ax1x.com/2019/01/10/FOWfu8.png"
        renderContent = {this.renderContent}
       />
     )
   }
 }

```

## 更新日志
### 1.0.5 20210707
* feat: 为了解决部分特殊浏览器(vivo x9与华为p9)在软键盘被唤醒时的横竖屏的问题; 优先使用orientationchange 事件进行判断, 如浏览器不支持该事件再使用 onResize 事件使用宽高判断, 尽量减少误判

### 1.0.4 20210511
* 优化判断横竖屏判断, 将原本的 screen.width 宽高判断调整为 innerWidth 和 innerHeight

### 1.0.3 20200110
* 优化代码, 使用新的判断方法, 用来判断横竖屏状态

### 1.0.2 20191018
* 优化代码, 如果初始化为竖屏时, 则不渲染虚拟dom

## License

MIT © [x13524](https://github.com/x13524)
