﻿/// <reference path="../../../smartJs/sj.js" />
/// <reference path="../../../smartJs/sj-core.js" />
/// <reference path="../../../smartJs/sj-event.js" />
/// <reference path="../../../smartJs/sj-ui.js" />
/// <reference path="../core.js" />
/// <reference path="../ui.js" />
'use strict';


PocketCode.Ui.Canvas = (function () {
  Canvas.extends(SmartJs.Ui.Control, false);

  function Canvas(args) {
    args = args || {className: 'pc-canvasContainer'};
    SmartJs.Ui.Control.call(this, 'div', args);

    this.init_done = 0;
    this._renderingSprite = [];
    this._renderingTexts = [];
    this._scalingX = 1.0;
    this._scalingY = 1.0;
    this._sceneIds = 0; //TODO: remove
    this._sceneDrawCanvas = {}; //register here with { id: { elem: ?, ctx: ? } } on first use
    this.currentSceneId = undefined;
    this._cameraStream = null;
    this._cameraOn = false;
    //handling click/touch/multi-touch
    this._activeTouchEvents = [];


    this._helperCanvasEl = document.createElement('canvas');
    this._helperCanvasCtx = this._helperCanvasEl.getContext('2d');

    this._cameraCanvasEl = document.createElement('canvas');
    this._cameraCanvasCtx = this._cameraCanvasEl.getContext('2d');

    this._backgroundCanvasEl = document.createElement('canvas');
    this._backgroundCanvasCtx = this._backgroundCanvasEl.getContext('2d');

    this._translation = {
      x: Math.round(this._backgroundCanvasEl.width * 0.5),
      y: Math.round(this._backgroundCanvasEl.height * 0.5)
    };

    this._penStampCanvasEl = document.createElement('canvas');
    this._penStampCanvasCtx = this._penStampCanvasEl.getContext('2d');

    this._spritesCanvasEl = document.createElement('canvas');
    this._spritesCanvasCtx = this._spritesCanvasEl.getContext('2d');

    this._bubblesCanvasEl = document.createElement('canvas');
    this._bubblesCanvasCtx = this._bubblesCanvasEl.getContext('2d');


    this._upperCanvasEl = document.createElement('canvas');
    this._upperCanvasCtx = this._upperCanvasEl.getContext('2d');


    this._dom.appendChild(this._cameraCanvasEl);
    this._dom.appendChild(this._backgroundCanvasEl);
    this._dom.appendChild(this._penStampCanvasEl);
    this._dom.appendChild(this._spritesCanvasEl);
    this._dom.appendChild(this._bubblesCanvasEl);
    this._dom.appendChild(this._upperCanvasEl);


    //events
    this._onRenderingSpriteTouched = new SmartJs.Event.Event(this);

    this._onTouchStart = new SmartJs.Event.Event(this);
    this._addDomListener(this._upperCanvasEl, 'mousedown', this._touchStartHandler);
    this._addDomListener(this._upperCanvasEl, 'touchstart', this._touchStartHandler);

    this._onTouchMove = new SmartJs.Event.Event(this);
    this._addDomListener(this._upperCanvasEl, 'mousemove', this._touchMoveHandler);
    this._addDomListener(this._upperCanvasEl, 'touchmove', this._touchMoveHandler);

    this._onTouchEnd = new SmartJs.Event.Event(this);
    this._addDomListener(this._upperCanvasEl, 'mouseup', this._touchEndHandler);
    this._addDomListener(this._upperCanvasEl, 'mouseout', this._touchEndHandler);
    this._addDomListener(this._upperCanvasEl, 'touchend', this._touchEndHandler);
  }

  //properties
  Object.defineProperties(Canvas.prototype, {
    contextTop: {
      get: function () {
        return this._upperCanvasCtx;
      },
    },
    cameraContext: {
      get: function () {
        return this._cameraCanvasCtx;
      }
    },

    cameraStream : {
      set: function(cameraStream){

        this._cameraStream = cameraStream;
          console.log("camera stream in setter:", this._cameraStream);
      },
      get: function(){
        return this._cameraStream;
      }
    },

    cameraOn: {
      set: function(cameraOn){
          console.log("setting camera on in canvas to :", cameraOn);
        this._cameraOn = cameraOn;
            this.renderCamera();
            },


      get: function(){
        return this._cameraOn;
      }
    },
    renderingSprites: {
      set: function (list) {
        if (!(list instanceof Array))
          throw new Error('invalid argument: expectes type: list');
        this._renderingSprite = list;
      },
    },
    renderingTexts: {
      set: function (list) {
        if (!(list instanceof Array))
          throw new Error('invalid argument: expected type: list');
        this._renderingTexts = list;  //TODO: exception handling, argument check
      },
    },
    /* override: we do not calculate borders here, with/height are returned based on internal canvas elements even if control is not in DOM */
    width: {
      get: function () {
        return this._backgroundCanvasEl.width;
      },
      set: function (value) {
        if (typeof value !== 'number')
          throw new Error('invalid argument: expected "value" typeof "number" (px)');

        this._dom.style.width = (value + 'px');
        this._backgroundCanvasEl.width = value;
        this._cameraCanvasEl.width = value;
        this._penStampCanvasEl.width = value;

        var ids = this._sceneIds;
        for (var i = 0; i < ids.length; i++) {
          this._penStampCanvasEl[ids[i]].width = value;
        }


        this._spritesCanvasEl.width = value;
        this._bubblesCanvasEl.width = value;
        this._translation = {x: Math.round(value * 0.5), y: Math.round(this.height * 0.5)};
        this._upperCanvasEl.width = value;

        for (var i = 0; i < this._sceneIds.length; i++) {
          this._penStampCanvasEl[this._sceneIds[i]].width = value;
          //    this._currentDrawEl = this._penCanvasEl[this._sceneIds[i]];
        }
        this._helperCanvasEl.width = value;
      },
    },
    /* override */
    height: {
      get: function () {
        return this._backgroundCanvasEl.height;
      },
      set: function (value) {
        if (typeof value !== 'number')
          throw new Error('invalid argument: expected "value" typeof "number" (px)');

        this._dom.style.height = (value + 'px');
        this._backgroundCanvasEl.height = value;
        this._cameraCanvasEl.height = value;
        this._penStampCanvasEl.height = value;

        var ids = this._sceneIds;
        for (var i = 0; i < ids.length; i++) {
          this._penStampCanvasEl[ids[i]].height = value;
        }

        this._spritesCanvasEl.height = value;
        this._bubblesCanvasEl.height = value;
        this._translation = {x: Math.round(this.width * 0.5), y: Math.round(value * 0.5)};
        this._upperCanvasEl.height = value;

        this._upperCanvasEl.height = value;

        for (var i = 0; i < this._sceneIds.length; i++) {
          this._penStampCanvasEl[this._sceneIds[i]].height = value;
          //this._currentDrawEl = this._penCanvasEl[this._sceneIds[i]];
          //console.log("........");
        }
        this._helperCanvasEl.height = value;
      },
    },
  });

  //events
  Object.defineProperties(Canvas.prototype, {
    onRenderingSpriteTouched: {
      get: function () {
        return this._onRenderingSpriteTouched;
      },
    },
    onTouchStart: {
      get: function () {
        return this._onTouchStart;
      },
    },
    onTouchMove: {
      get: function () {
        return this._onTouchMove;
      },
    },
    onTouchEnd: {
      get: function () {
        return this._onTouchEnd;
      },
    },
  });

  //methods
  Canvas.prototype.merge({
    setDimensions: function (width, height, scalingX, scalingY) {
      width = Math.floor(width * 0.5) * 2.0;
      height = Math.floor(height * 0.5) * 2.0;

      this.height = height;
      this.width = width;

      this.scale(scalingX, scalingY);
    },
    scale: function (x, y) {
      this._scalingX = x;
      this._scalingY = y;
      this.render();
    },
    initScene: function (id, screenSize) { //TODO: make sure to remove + recreate canvas elements - draw canvas keeps the same, sceneDrawCache as { sceneId: { elem: ?, ctx: ? } }

      if (this._sceneDrawCanvas[id])
        return;

        var penStampCanvasEl = document.createElement('canvas');
      penStampCanvasEl.height = screenSize.height;
      penStampCanvasEl.width = screenSize.width;
      var penStampCanvasCtx = this._penStampCanvasEl.getContext('2d');

      this._sceneDrawCanvas[id] = {
        element: penStampCanvasEl,
        ctx: penStampCanvasCtx
      };
      this.currentSceneId = id;
    },
    clear: function () {
      this._upperCanvasCtx.clearRect(0, 0, this.width, this.height);
      this._bubblesCanvasCtx.clearRect(0, 0, this.width, this.height);
      this._spritesCanvasCtx.clearRect(0, 0, this.width, this.height);
      this._cameraCanvasCtx.clearRect(0, 0, this.width, this.height);
      this._backgroundCanvasCtx.clearRect(0, 0, this.width, this.height);
    },
    clearPenStampCache: function () {
      for (var c in this._sceneDrawCanvas) {
        var c = this._sceneDrawCanvas[c];
        c.ctx.clearRect(0, 0, c.element.width, c.element.height);
      }
    },
    _getTouchData: function (e) {
      var pointer;
      if (!e.touches) {   //mouse event
        pointer = this._getTouchEventPosition(e);
        return [{id: 'm' + (e.which || e.button), x: pointer.x, y: pointer.y}];
      }
      //else: touch event
      var touch,
        touches = e.changedTouches,
        touchData = [];
      for (var i = 0, l = touches.length; i < l; i++) {
        touch = touches[i];
        pointer = this._getTouchEventPosition(e, touch);
        touchData.push({id: 't' + touch.identifier, x: pointer.x, y: pointer.y});
      }
      return touchData;
    },
    _touchStartHandler: function (e) {

      var cur_ctx = this._sceneDrawCanvas[this.currentSceneId]["ctx"];
      //var data = cur_ctx.toDataURL('image/png');
      //console.log(data);
      //console.log(this._penStampCanvasEl);

      if (e.cancelable)
        e.preventDefault();
      e.stopPropagation();    //TODO: use .offsetX for mouse events (check support)

      var touchData = this._getTouchData(e);
      for (var i = 0, l = touchData.length; i < l; i++) {
        this._activeTouchEvents.push(touchData[i].id);
        this._onTouchStart.dispatchEvent(touchData[i]);
      }

      if (e.touches || e.which == 1 || e.button == 0)
        for (var i = 0, l = touchData.length; i < l; i++) {
          var target = this._getTargetAt({x: touchData[i].x, y: touchData[i].y});
          if (target) {
            this._onRenderingSpriteTouched.dispatchEvent(touchData[i].merge({targetId: target.id}));
          }
        }
      return false;
    },
    _touchMoveHandler: function (e) {
      if (e.cancelable)
        e.preventDefault();
      e.stopPropagation();

      if (!e.changedTouches && !e.which && isNaN(e.button))
        return; //move event, no button pressed

      var touchData = this._getTouchData(e);
      if (!e.touches) {   //get all data for mouse events
        var mouseData = [];
        for (var i = 0, l = this._activeTouchEvents.length; i < l; i++) {
          var id = this._activeTouchEvents[i];
          if (id[0] == 'm')
            mouseData.push({id: id, x: touchData[0].x, y: touchData[0].y});
        }
        touchData = mouseData;
      }
      for (var i = 0, l = touchData.length; i < l; i++) {
        if (Math.abs(touchData[i].x) > this._backgroundCanvasEl.width * 0.5 / this._scalingX ||
          Math.abs(touchData[i].y) > this._backgroundCanvasEl.height * 0.5 / this._scalingY) {  //ouside
          this._touchEndHandler(e);
          continue;
        }
        if (this._activeTouchEvents.indexOf(touchData[i].id) >= 0)
          this._onTouchMove.dispatchEvent(touchData[i]);
      }
      return false;
    },
    _touchEndHandler: function (e) {
      if (e.cancelable)
        e.preventDefault();
      e.stopPropagation();

      var touchData = this._getTouchData(e);
      if (!e.touches) {   //get all data for mouse events
        var mouseData = [];
        for (var i = 0, l = this._activeTouchEvents.length; i < l; i++) {
          var id = this._activeTouchEvents[i];
          if (id[0] == 'm')
            mouseData.push({id: id, x: touchData[0].x, y: touchData[0].y});
        }
        touchData = mouseData;
      }
      for (var i = 0, l = touchData.length; i < l; i++)
        if (this._activeTouchEvents.indexOf(touchData[i].id) >= 0) {
          this._activeTouchEvents.remove(touchData[i].id);
          this._onTouchEnd.dispatchEvent(touchData[i]);
        }

      return false;
    },
    _getTouchEventPosition: function (e, touch) {
      var pointerX,
        pointerY;
      var boundingClientRect = this._backgroundCanvasEl.getBoundingClientRect();

      if (touch != undefined) {
        pointerX = touch.clientX != undefined ? touch.clientX - boundingClientRect.left - this._translation.x : e.clientX - this._translation.x;
        pointerY = -(touch.clientY != undefined ? touch.clientY - boundingClientRect.top - this._translation.y : e.clientY - this._translation.y);
      }
      else {
        //boundingClientRect = this._backgroundCanvasEl.getBoundingClientRect();
        pointerX = e.clientX != undefined ? e.clientX - boundingClientRect.left - this._translation.x : -this._translation.x;    //TODO: use .offsetX for mouse events (check support)
        pointerY = -(e.clientY != undefined ? e.clientY - boundingClientRect.top - this._translation.y : -this._translation.y);  //or: include scroll offsets to make sure this control also works in another app/page
      }

      var pointer = {
        x: pointerX / this._scalingX,
        y: pointerY / this._scalingY,
      };

      return pointer;
    },
    _getTargetAt: function (point) {
      var objects = this._renderingSprite;
      var object, target;

      for (var i = objects.length - 1; i >= 0; i--) {
        object = objects[i];
        if (object.visible && object.containsPoint(point) && !this._isTargetTransparent(object, point)) {
          target = object;
          break;
        }
      }
      return target;
    },
    _isTargetTransparent: function (target, point) {
      var ctx = this._helperCanvasCtx;
      ctx.clearRect(0, 0, this._helperCanvasEl.width, this._helperCanvasEl.height);
      ctx.save();
      ctx.translate(this._translation.x, this._translation.y);
      ctx.scale(this._scalingX, this._scalingY);
      target.draw(ctx);
      ctx.restore();

      //imageData.data contains rgba values - here we look at the alpha value
      var imageData = ctx.getImageData(this._translation.x + Math.floor(point.x * this._scalingX), this._translation.y - Math.floor(point.y * this._scalingY), 1, 1);
      var hasTransparentAlpha = !imageData.data || !imageData.data[3];

      //clear
      imageData = undefined;
      return hasTransparentAlpha;
    },
    render: function () {
      var background_ctx = this._backgroundCanvasCtx;
      var ctx = this._spritesCanvasCtx;

      background_ctx.clearRect(0, 0, this.width, this.height);
      background_ctx.save();
      background_ctx.translate(this._translation.x, this._translation.y);
      background_ctx.scale(this._scalingX, this._scalingY);

      ctx.clearRect(0, 0, this.width, this.height);
      ctx.save();
      ctx.translate(this._translation.x, this._translation.y);
      ctx.scale(this._scalingX, this._scalingY);

      var ro = this._renderingSprite;

      if (ro.length > 0) {
        ro[0].draw(background_ctx);
        document.body.appendChild(ro[0]._cacheCanvas);
      }
      for (var i = 1, l = ro.length; i < l; i++) {
        ro[i].draw(ctx);

        if (ro[i].stamp === true) {
          this.drawStamp(ro[i]._id);
          ro[i].stamp = false;
        }


        if (ro[i]._penDown === true) {
          this.drawPen(ro[i]._id);
        }
      }

      //draw
      ro = this._renderingTexts;
      for (var i = 0, l = ro.length; i < l; i++) {
        ro[i].draw(ctx);
        if (ro[i].stamp === true) {
          this.drawStamp(ro[i]._id);
          ro[i].stamp = false;
        }
      }


      background_ctx.restore();
      ctx.restore();

      if (this.init_done == 1) {
        //this._penStampCanvasCtx.clearRect(0, 0, this.width, this.height);

        //console.log(this._sceneDrawCanvas);
        console.log(this.currentSceneId);

        var penStampCanvas_ctx = this._sceneDrawCanvas[this.currentSceneId]["ctx"];

        /*
         penStampCanvas_ctx.clearRect(0, 0, this.width, this.height);

         penStampCanvas_ctx.save();
         penStampCanvas_ctx.translate(this._translation.x, this._translation.y);
         penStampCanvas_ctx.scale(this._scalingX, this._scalingY);
         penStampCanvas_ctx.restore();
         */
        //penStampCanvas_ctx.save();
        //penStampCanvas_ctx.save();
        //penStampCanvas_ctx.translate(this._translation.x, this._translation.y);
        //penStampCanvas_ctx.scale(this._scalingX, this._scalingY);
        //penStampCanvas_ctx = this._sceneDrawCanvas[this.currentSceneId]["ctx"];
        //penStampCanvas_ctx.restore();
      }
    },


    drawStamp: function (renderingSpriteId) {

      //this._currentDrawCtx.save();

      var ro = this._renderingSprite;
      for (var i = 0, l = ro.length; i < l; i++) {
        if (ro[i].id === renderingSpriteId) {
          this._sceneDrawCanvas[this.currentSceneId]["ctx"].save();
          this._sceneDrawCanvas[this.currentSceneId]["ctx"].translate(this._translation.x, this._translation.y);
          this._sceneDrawCanvas[this.currentSceneId]["ctx"].scale(this._scalingX, this._scalingY);
          ro[i].draw(this._sceneDrawCanvas[this.currentSceneId]["ctx"]);
          this._sceneDrawCanvas[this.currentSceneId]["ctx"].restore();
          break;
        }
      }
    },

    drawPen: function (renderingSpriteId) {

      //this._currentDrawCtx.save();
      var ro = this._renderingSprite;
      for (var i = 0, l = ro.length; i < l; i++) {
        if (ro[i].id === renderingSpriteId) {
          var x = ro[i].x;
          x -= ro[i].offsetX * ro[i]._scaling;
          var y = ro[i].y;
          y -= ro[i].offsetY * ro[i]._scaling;
          y *= -1;
          var currentPenStampCtx = this._sceneDrawCanvas[this.currentSceneId]["ctx"];
          currentPenStampCtx.save();
          currentPenStampCtx.translate(this._translation.x, this._translation.y);
          currentPenStampCtx.scale(this._scalingX, this._scalingY);
          currentPenStampCtx.beginPath();
          currentPenStampCtx.moveTo(ro[i].penXPosition, ro[i].penYPosition);
          currentPenStampCtx.lineTo(x, y);
          ro[i].penXPosition = x;
          ro[i].penYPosition = y;
          currentPenStampCtx.strokeStyle = "rgb( " + ro[i]._penColorRed + ", " + ro[i]._penColorGreen + ", " + ro[i]._penColorBlue + " )";
          currentPenStampCtx.lineWidth = ro[i]._penSize;
          currentPenStampCtx.stroke();
          currentPenStampCtx.closePath();
          currentPenStampCtx.restore();
        }
      }
    },

    clearPenCanvas: function () {
      var ctx = this._currentPenCtx;
      ctx.clearRect(0, 0, this.width, this.height);
    },
    toDataURL: function (width, height) {
      var currentWidth = this.width,
        currentHeight = this.height;

      this._helperCanvasEl.width = width;
      this._helperCanvasEl.height = height;

      var ctx = this._helperCanvasCtx;
      ctx.save();
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);
      ctx.translate(width * 0.5, height * 0.5);
      ctx.scale(width * this._scalingX / currentWidth, height * this._scalingY / currentHeight);

      var ro = this._renderingSprite;
      for (var i = 0, l = ro.length; i < l; i++)
        ro[i].draw(ctx);

      ro = this._renderingTexts;
      for (var i = 0, l = ro.length; i < l; i++)
        ro[i].draw(ctx);
      ctx.restore();

      var data = this._helperCanvasEl.toDataURL('image/png');
      this._helperCanvasEl.width = currentWidth;
      this._helperCanvasEl.height = currentHeight;

      return data;
    },

      renderCamera: function() {
          if(this._cameraOn && this._cameraStream != null && this._cameraStream != undefined ){
              this._cameraCanvasCtx.drawImage(this._cameraStream, 0,0, this._cameraCanvasEl.width, this._cameraCanvasEl.height );
              setTimeout(this.renderCamera.bind(this), 10);
          }
          else {
              //this._cameraCanvasCtx.clearRect(0, 0, this.width, this.height);
          }
      },
    dispose: function () {
      this._removeDomListener(this._upperCanvasEl, 'mousedown', this._touchStartHandler);
      this._removeDomListener(this._upperCanvasEl, 'touchstart', this._touchStartHandler);
      this._removeDomListener(this._upperCanvasEl, 'mousemove', this._touchMoveHandler);
      this._removeDomListener(this._upperCanvasEl, 'touchmove', this._touchMoveHandler);
      this._removeDomListener(this._upperCanvasEl, 'mouseup', this._touchEndHandler);
      this._removeDomListener(this._upperCanvasEl, 'mouseout', this._touchEndHandler);
      this._removeDomListener(this._upperCanvasEl, 'touchend', this._touchEndHandler);

      SmartJs.Ui.Control.prototype.dispose.call(this);    //call super
    }
  });

  return Canvas;
})();
