(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("TrowelDrops", [], factory);
	else if(typeof exports === 'object')
		exports["TrowelDrops"] = factory();
	else
		root["TrowelDrops"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TrowelDrops = function TrowelDrops(triggers) {
  _classCallCheck(this, TrowelDrops);

  triggers.forEach(function (trigger, index) {
    var trigger_obj = new TrowelDrop(trigger);
  });
};

exports.default = TrowelDrops;

var TrowelDrop = function () {
  function TrowelDrop(trigger) {
    var customOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, TrowelDrop);

    if (window.Tether === undefined) throw new Error('Trowel Drops require Tether (http://tether.io/)');

    this.trigger = trigger;
    this.drop = document.querySelector(this.trigger.getAttribute('data-href'));
    this.options = customOptions;
    this.tether = new Tether(this.tetherOptions);

    this.events = this.events();

    this.options.visible ? this.show() : this.hide();
    this.setGutterPositions();

    this.listener();
    this.drop.dispatchEvent(this.events.mounted);
    return;
  }

  _createClass(TrowelDrop, [{
    key: 'getPositions',
    value: function getPositions() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.options;

      return {
        options: options,
        posY: options.position.split(' ')[0],
        posX: options.position.split(' ')[1]
      };
    }
  }, {
    key: 'setGutterPositions',
    value: function setGutterPositions() {
      var _getPositions = this.getPositions(),
          posY = _getPositions.posY,
          posX = _getPositions.posX;

      var gutterY = void 0,
          gutterX = void 0;

      switch (posY) {
        case 'topout':
          gutterY = 'bottom';
          break;
        case 'bottomout':
          gutterY = 'top';
          break;
        default:
          gutterY = 'none';
      }

      switch (posX) {
        case 'leftout':
          gutterX = 'right';
          break;
        case 'rightout':
          gutterX = 'left';
          break;
        default:
          gutterX = 'none';
      }

      this.drop.setAttribute('data-gutter', gutterY + ' ' + gutterX);
    }
  }, {
    key: 'show',
    value: function show() {
      this.drop.dispatchEvent(this.events.show);
      this.drop.style.display = 'block';
      this.drop.dispatchEvent(this.events.shown);
      return;
    }
  }, {
    key: 'hide',
    value: function hide() {
      this.drop.dispatchEvent(this.events.hide);
      this.drop.style.display = 'none';
      this.drop.dispatchEvent(this.events.hidden);
      return;
    }
  }, {
    key: 'toggle',
    value: function toggle() {
      this.drop.dispatchEvent(this.events.toggle);
      this.isVisible ? this.hide() : this.show();
      this.drop.dispatchEvent(this.events.toggled);
      return;
    }
  }, {
    key: 'listener',
    value: function listener() {
      var _this = this;

      if (this.options.behavior == 'click') {
        this.trigger.addEventListener('click', this.toggle.bind(this));

        // hide the drop when you click outside
        document.addEventListener('click', function (event) {
          var isClickInside = this.trigger.contains(event.target) || this.drop.contains(event.target);
          if (!isClickInside && this.isVisible) this.hide();
          return;
        }.bind(this));
      } else if (this.options.behavior == 'hover') {
        this.trigger.addEventListener('mouseenter', this.show.bind(this));

        [this.trigger, this.drop].map(function (element) {
          element.addEventListener('mouseout', function (event) {
            var hovering = this.trigger.contains(event.toElement) || this.drop.contains(event.toElement);
            if (!hovering) this.hide();
            return;
          }.bind(_this));
        });
      }
    }
  }, {
    key: 'events',
    value: function events() {
      var show = new Event('trowel.drop.show');
      var shown = new Event('trowel.drop.shown');
      var hide = new Event('trowel.drop.hide');
      var hidden = new Event('trowel.drop.hidden');
      var toggle = new Event('trowel.drop.toggle');
      var toggled = new Event('trowel.drop.toggled');
      var mounted = new Event('trowel.drop.mounted');

      return { show: show, shown: shown, hide: hide, hidden: hidden, toggle: toggle, toggled: toggled, mounted: mounted };
    }
  }, {
    key: 'options',
    set: function set(customOptions) {
      var _this2 = this;

      var defaultOptions = {
        visible: false,
        behavior: 'click',
        position: 'bottomout leftin'
      };

      var options = Object.keys(defaultOptions).reduce(function (options, option) {
        options[option] = defaultOptions[option];

        // 1st priority : data-options
        if (_this2.trigger.getAttribute('data-' + option)) {
          options[option] = _this2.trigger.getAttribute('data-' + option);

          // make sure the option is a bool and not a string
          if (option == 'visible') {
            options[option] = options[option] == "true";
          }

          // 2nd priority : customOptions
        } else if (customOptions[option]) {
          options[option] = customOptions[option];
        }

        return options;
      }, {});

      var _getPositions2 = this.getPositions(options),
          posY = _getPositions2.posY,
          posX = _getPositions2.posX;

      if (!['click', 'hover'].includes(options.behavior)) {
        throw new Error('Trowel drops behavior option must be \'click\' or \'hover\'');
      }

      if (options.position.split(' ').length != 2) {
        throw new Error('Trowel drops position option must be a string within two words describing Y (\'top\', \'middle\' or \'bottom\') and X (\'left\', \'center\' or \'right\') position');
      }

      if (!['topin', 'topout', 'middle', 'bottomin', 'bottomout'].includes(posY)) {
        throw new Error('Trowel drops position option first word must be \'topin\', \'topout\', \'middle\', \'bottomin\' or \'bottomout\'');
      }

      if (!['leftin', 'leftout', 'center', 'rightin', 'rightout'].includes(posX)) {
        throw new Error('Trowel drops position option second word must be \'leftin\', \'leftout\', \'center\', \'rightin\' or \'rightout\'');
      }

      return this._options = options;
    },
    get: function get() {
      return this._options;
    }
  }, {
    key: 'tetherOptions',
    get: function get() {
      var _getPositions3 = this.getPositions(),
          posY = _getPositions3.posY,
          posX = _getPositions3.posX;

      var attachmentX = void 0,
          attachmentY = void 0,
          targetAttachmentX = void 0,
          targetAttachmentY = void 0,
          gutterX = void 0,
          gutterY = void 0;

      switch (posY) {
        case 'topout':
          attachmentY = 'bottom';
          targetAttachmentY = 'top';
          break;
        case 'topin':
          attachmentY = 'top';
          targetAttachmentY = 'top';
          break;
        case 'bottomin':
          attachmentY = 'bottom';
          targetAttachmentY = 'bottom';
          break;
        case 'bottomout':
          attachmentY = 'top';
          targetAttachmentY = 'bottom';
          break;
        default:
          attachmentY = 'center';
          targetAttachmentY = 'center';
      }

      switch (posX) {
        case 'leftout':
          attachmentX = 'right';
          targetAttachmentX = 'left';
          break;
        case 'leftin':
          attachmentX = 'left';
          targetAttachmentX = 'left';
          break;
        case 'rightin':
          attachmentX = 'right';
          targetAttachmentX = 'right';
          break;
        case 'rightout':
          attachmentX = 'left';
          targetAttachmentX = 'right';
          break;
        default:
          attachmentX = 'center';
          targetAttachmentX = 'center';
      }

      var config = {
        element: this.drop,
        target: this.trigger,
        attachment: attachmentY + ' ' + attachmentX,
        targetAttachment: targetAttachmentY + ' ' + targetAttachmentX
      };

      return config;
    }
  }, {
    key: 'isVisible',
    get: function get() {
      return this.drop.style.display == 'block';
    }
  }]);

  return TrowelDrop;
}();

module.exports = exports['default'];

/***/ })
/******/ ]);
});
//# sourceMappingURL=drops.js.map