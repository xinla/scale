/**
 * Scale.js
 * 元素放大缩小，内部元素可选择行缩放或保持
 * 2020.7.15
 * author xu
 * 
 * 使用方法：
 * new Scale({
  * el: "#wrap",  鼠标滚轮放大缩小事件绑定元素
    keep: ['#icon', '.icon-other', other...]  内部保持元素大小不变的css选择器数组集合
 * })
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
      (global = global || self, global.Scale = factory());
}(this, function () {
  'use strict';
  function Scale(object = {}) {
    var elSelector = object.el
    var keepSelectors = object.keep || []
    if (elSelector) {
      this.el = document.querySelector(elSelector)
    } else {
      console.error("'el' property connot be empty")
    }
    this._keep = []
    this._mousedownPageX = 0
    this._mousedownPageX = 0
    this._isMousedown = false
    this._scaleEl = 1
    this._scaleKeep = 1

    var _this = this
    keepSelectors.forEach(function (selector) {
      var qsa = document.querySelectorAll(selector);
      if (qsa) {
        for (var index = 0, length = qsa.length; index < length; index++) {
          _this._keep.push(qsa[index])
        }
      } else {
        console.error("connot find element: " + selector)
      }
    });

    if (this.el) {
      this.el.style.transition = 'transform 0.3s'

      this.el.addEventListener('wheel', this.zoom)
      this.el.addEventListener('mousedown', mousedown.bind(this))
      document.addEventListener('mousemove', mousemove.bind(this))
      document.addEventListener('mouseup', mouseup.bind(this))
    } else {
      console.error("connot find element: " + elSelector)
    }
  }

  function getElementCss(element) {
    return element.currentStyle ? element.currentStyle : window.getComputedStyle(element, null)
  }

  function mousedown(event) {
    event.preventDefault()
    event = event || window.event;
    var computedStyle = getElementCss(this.el)
    this.el.style.cursor = 'move';
    this.isMousedown = true
    this.mousedownPageX = event.pageX;
    this.mousedownPageY = event.pageY;
    this.mousedownOffsetLeft = this.el.offsetLeft
    this.mousedownOffsetTop = this.el.offsetTop
    this.mousedownPositionLeft = parseFloat(computedStyle.left)
    this.mousedownPositionTop = parseFloat(computedStyle.top)
  }

  function mousemove(event) {
    if (this.isMousedown) {
      event = event || window.event;

      // var body = document.documentElement || document.body;

      var style = this.el.style
      var position = getElementCss(this.el).getPropertyValue('position')
      var pageX = event.pageX
      var pageY = event.pageY
      var left = 0
      var top = 0

      if (position === 'absolute') {
        // 设置边界
        left = pageX - this.mousedownPageX + this.mousedownOffsetLeft;
        top = pageY - this.mousedownPageY + this.mousedownOffsetTop;
        //判断移动是否超过窗口
        //    if(left < 0) left = 0;
        //    if(left > body.offsetWidth - event.offsetWidth) left = body.offsetWidth - event.offsetX;
        //    if(top < 0) top =0;
        //    if(top > body.offsetHeight - event.offsetHeight) top = body.offsetHeight - event.offsetHeight;

      } else if (position === 'fixed') {
        left = event.clientX
        top = event.clientY
      } else {
        style.position = 'relative'
        var left = this.mousedownPositionLeft + pageX - this.mousedownPageX
        var top = this.mousedownPositionTop + pageY - this.mousedownPageY
        // if (positionLeft < this.mousedownOffsetLeft) {
        //   left = pageX - this.mousedownPageX + this.mousedownOffsetLeft
        //   top = pageY - this.mousedownPageY + this.mousedownOffsetTop
        // } else {
        //   left = pageX - this.mousedownPageX
        //   top = pageY - this.mousedownPageY
        // }
      }
      style.left = left + 'px';
      style.top = top + 'px';
    }
  }

  function mouseup(event) {
    // console.log('mouseup', event);
    if (this.isMousedown) {
      this.el.style.cursor = '';
    }
    this.isMousedown = false;
  }

  Scale.prototype.zoom = function (event) {
    event.preventDefault()
    var _this = this
    var delta = 0;
    if (!event) event = window.event;
    if (event.wheelDelta) {
      delta = event.wheelDelta / 120;
      if (window.opera) delta = -delta;
    } else if (event.detail) {
      delta = -event.detail / 3;
    }
    if (delta > 0) {
      this._scaleEl += 0.1
      this._scaleKeep = 1 / this._scaleEl
    } else if (delta < 0) {
      this._scaleEl -= 0.1
      this._scaleKeep = 1 / this._scaleEl
    }
    this.el.style.transform = 'scale(' + this._scaleEl + ')'
    this.el.style['-ms-transform'] = 'scale(' + this._scaleEl + ')'
    this.el.style['-webkit-transform'] = 'scale(' + this._scaleEl + ')'

    this._keep.forEach(function (element) {
      element.style.transform = 'scale(' + _this._scaleKeep + ')'
      element.style['-ms-transform'] = 'scale(' + _this._scaleKeep + ')'
      element.style['-webkit-transform'] = 'scale(' + _this._scaleKeep + ')'
    });
  }

  return Scale
}))
