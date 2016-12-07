'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var isObject = function isObject(item) {
    return item && (typeof item === 'undefined' ? 'undefined' : _typeof(item)) === 'object' && !Array.isArray(item) && item !== null;
};

var mergeDeep = function mergeDeep(target, source) {
    var output = Object.assign({}, target);

    if (isObject(target) && isObject(source)) {
        Object.keys(source).forEach(function (key) {
            if (isObject(source[key])) {
                if (!(key in target)) Object.assign(output, _defineProperty({}, key, source[key]));else output[key] = mergeDeep(target[key], source[key]);
            } else {
                Object.assign(output, _defineProperty({}, key, source[key]));
            }
        });
    }
    return output;
};

var TrowelDrops = function TrowelDrops(elements) {
    _classCallCheck(this, TrowelDrops);

    for (var element in elements) {
        var element_obj = new TrowelDrop(elements[element]);
    }
};

var TrowelDrop = function () {
    function TrowelDrop(trigger) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        _classCallCheck(this, TrowelDrop);

        if (window.Tether === undefined) {
            throw new Error('Bootstrap tooltips require Tether (http://tether.io/)');
        }

        if ((typeof trigger === 'undefined' ? 'undefined' : _typeof(trigger)) == 'object') {
            this._trigger = trigger;
            this._drop = document.querySelector(this._trigger.getAttribute('data-href'));
            this._options = this.setOptions(options);
            this._tether = new Tether(this.getTetherOptions(this._options));
            this._visible = this._options.visible;
            this.turnVisibility();
            this.setGutterPositions();
            this._listener();
        }
    }

    _createClass(TrowelDrop, [{
        key: 'setOptions',
        value: function setOptions(options) {
            var defaultOptions = {
                visible: false,
                behavior: 'click',
                position: 'bottomout leftin'
            };

            var fullOptions = mergeDeep(defaultOptions, options);

            for (var option in defaultOptions) {
                var dataOption = this._trigger.getAttribute('data-' + option);

                if (dataOption) {
                    fullOptions[option] = dataOption;
                }
            }

            var _getPositions = this.getPositions(fullOptions),
                posY = _getPositions.posY,
                posX = _getPositions.posX;

            if (!['click', 'hover'].includes(fullOptions.behavior)) {
                throw new Error('Trowel drops behavior option must be \'click\' or \'hover\'');
            }

            if (fullOptions.position.split(' ').length != 2) {
                throw new Error('Trowel drops position option must be a string within two words describing Y (\'top\', \'middle\' or \'bottom\') and X (\'left\', \'center\' or \'right\') position');
            }

            if (!['topin', 'topout', 'middle', 'bottomin', 'bottomout'].includes(posY)) {
                throw new Error('Trowel drops position option first word must be \'topin\', \'topout\', \'middle\', \'bottomin\' or \'bottomout\'');
            }

            if (!['leftin', 'leftout', 'center', 'rightin', 'rightout'].includes(posX)) {
                throw new Error('Trowel drops position option second word must be \'leftin\', \'leftout\', \'center\', \'rightin\' or \'rightout\'');
            }

            return fullOptions;
        }
    }, {
        key: 'getPositions',
        value: function getPositions(options) {
            return {
                options: options,
                posY: options.position.split(' ')[0],
                posX: options.position.split(' ')[1]
            };
        }
    }, {
        key: 'getTetherOptions',
        value: function getTetherOptions(options) {
            var _getPositions2 = this.getPositions(options),
                posY = _getPositions2.posY,
                posX = _getPositions2.posX;

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
                element: this._drop,
                target: this._trigger,
                attachment: attachmentY + ' ' + attachmentX,
                targetAttachment: targetAttachmentY + ' ' + targetAttachmentX
            };

            return config;
        }
    }, {
        key: 'setGutterPositions',
        value: function setGutterPositions() {
            var _getPositions3 = this.getPositions(this._options),
                posY = _getPositions3.posY,
                posX = _getPositions3.posX;

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

            this._drop.setAttribute('data-gutter', gutterY + ' ' + gutterX);
        }
    }, {
        key: 'show',
        value: function show() {
            this._visible = true;
            this.turnVisibility();
        }
    }, {
        key: 'hide',
        value: function hide() {
            this._visible = false;
            this.turnVisibility();
        }
    }, {
        key: 'isShown',
        value: function isShown() {
            return this._drop.style.display == 'block';
        }
    }, {
        key: 'isHidden',
        value: function isHidden() {
            return this._drop.style.display == 'none';
        }
    }, {
        key: 'toggle',
        value: function toggle() {
            this._visible = !this._visible;
            this.turnVisibility();
        }
    }, {
        key: 'turnVisibility',
        value: function turnVisibility() {
            if (this._visible) {
                this._generateEvent('show.trowel.drops');
                this._drop.style.display = 'block';
                this._generateEvent('shown.trowel.drops');
            } else {
                this._generateEvent('hide.trowel.drops');
                this._drop.style.display = 'none';
                this._generateEvent('display.trowel.drops');
            }

            this._tether.position();
        }
    }, {
        key: '_listener',
        value: function _listener() {
            if (this._options.behavior == 'click') {
                this._trigger.addEventListener('click', function (event) {
                    this.toggle();
                }.bind(this), false);

                document.addEventListener('click', function (event) {
                    var isClickInside = this._trigger.contains(event.target);

                    if (!isClickInside && this.isShown()) {
                        this.hide();
                    }
                }.bind(this), false);
            } else {
                this._trigger.addEventListener('mouseenter', function (event) {
                    this.show();
                }.bind(this), false);

                this._trigger.addEventListener('mouseout', function (event) {
                    this.hide();
                }.bind(this), false);
            }
        }
    }, {
        key: '_generateEvent',
        value: function _generateEvent(name) {
            var event = new Event(name);

            // Dispatch the event.
            this._drop.dispatchEvent(event);
        }
    }, {
        key: '_tetherHorizontalPos',
        value: function _tetherHorizontalPos(item) {
            console.log(item);
            if (item.attachment.left == 'right' && item.attachment.top == 'top' && item.targetAttachment.left == 'left' && item.targetAttachment.top == 'bottom') {
                config.attachment = 'top right';
                config.targetAttachment = 'bottom right';

                this._tether.setOptions(config, false);
            }
        }
    }]);

    return TrowelDrop;
}();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRyb3BzLmpzIl0sIm5hbWVzIjpbImlzT2JqZWN0IiwiaXRlbSIsIkFycmF5IiwiaXNBcnJheSIsIm1lcmdlRGVlcCIsInRhcmdldCIsInNvdXJjZSIsIm91dHB1dCIsIk9iamVjdCIsImFzc2lnbiIsImtleXMiLCJmb3JFYWNoIiwia2V5IiwiVHJvd2VsRHJvcHMiLCJlbGVtZW50cyIsImVsZW1lbnQiLCJlbGVtZW50X29iaiIsIlRyb3dlbERyb3AiLCJ0cmlnZ2VyIiwib3B0aW9ucyIsIndpbmRvdyIsIlRldGhlciIsInVuZGVmaW5lZCIsIkVycm9yIiwiX3RyaWdnZXIiLCJfZHJvcCIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvciIsImdldEF0dHJpYnV0ZSIsIl9vcHRpb25zIiwic2V0T3B0aW9ucyIsIl90ZXRoZXIiLCJnZXRUZXRoZXJPcHRpb25zIiwiX3Zpc2libGUiLCJ2aXNpYmxlIiwidHVyblZpc2liaWxpdHkiLCJzZXRHdXR0ZXJQb3NpdGlvbnMiLCJfbGlzdGVuZXIiLCJkZWZhdWx0T3B0aW9ucyIsImJlaGF2aW9yIiwicG9zaXRpb24iLCJmdWxsT3B0aW9ucyIsIm9wdGlvbiIsImRhdGFPcHRpb24iLCJnZXRQb3NpdGlvbnMiLCJwb3NZIiwicG9zWCIsImluY2x1ZGVzIiwic3BsaXQiLCJsZW5ndGgiLCJhdHRhY2htZW50WCIsImF0dGFjaG1lbnRZIiwidGFyZ2V0QXR0YWNobWVudFgiLCJ0YXJnZXRBdHRhY2htZW50WSIsImd1dHRlclgiLCJndXR0ZXJZIiwiY29uZmlnIiwiYXR0YWNobWVudCIsInRhcmdldEF0dGFjaG1lbnQiLCJzZXRBdHRyaWJ1dGUiLCJzdHlsZSIsImRpc3BsYXkiLCJfZ2VuZXJhdGVFdmVudCIsImFkZEV2ZW50TGlzdGVuZXIiLCJldmVudCIsInRvZ2dsZSIsImJpbmQiLCJpc0NsaWNrSW5zaWRlIiwiY29udGFpbnMiLCJpc1Nob3duIiwiaGlkZSIsInNob3ciLCJuYW1lIiwiRXZlbnQiLCJkaXNwYXRjaEV2ZW50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QTdDLEVBRWMsS0FGZDs7QUFJQSxxQkFBSzFDLFFBQUwsQ0FBY3VDLGdCQUFkLENBQStCLFVBQS9CLEVBQTJDLFVBQVNDLEtBQVQsRUFBZ0I7QUFDdkQseUJBQUtNLElBQUw7QUFDSCxpQkFGMEMsQ0FFekNKLElBRnlDLENBRXBDLElBRm9DLENBQTNDLEVBRWMsS0FGZDtBQUdIO0FBQ0o7Ozt1Q0FFY00sSSxFQUFNO0FBQ2pCLGdCQUFJUixRQUFRLElBQUlTLEtBQUosQ0FBVUQsSUFBVixDQUFaOztBQUVBO0FBQ0EsaUJBQUsvQyxLQUFMLENBQVdpRCxhQUFYLENBQXlCVixLQUF6QjtBQUNIOzs7NkNBRW9CL0QsSSxFQUFNO0FBQ3ZCMEUsb0JBQVFDLEdBQVIsQ0FBWTNFLElBQVo7QUFDQSxnQkFBSUEsS0FBS3dELFVBQUwsQ0FBZ0JvQixJQUFoQixJQUF3QixPQUF4QixJQUFtQzVFLEtBQUt3RCxVQUFMLENBQWdCcUIsR0FBaEIsSUFBdUIsS0FBMUQsSUFBbUU3RSxLQUFLeUQsZ0JBQUwsQ0FBc0JtQixJQUF0QixJQUE4QixNQUFqRyxJQUEyRzVFLEtBQUt5RCxnQkFBTCxDQUFzQm9CLEdBQXRCLElBQTZCLFFBQTVJLEVBQXNKO0FBQ2xKdEIsdUJBQU9DLFVBQVAsR0FBb0IsV0FBcEI7QUFDQUQsdUJBQU9FLGdCQUFQLEdBQTBCLGNBQTFCOztBQUVBLHFCQUFLM0IsT0FBTCxDQUFhRCxVQUFiLENBQXdCMEIsTUFBeEIsRUFBZ0MsS0FBaEM7QUFDSDtBQUNKIiwiZmlsZSI6ImRyb3BzLmpzIiwic291cmNlc0NvbnRlbnQiOlsibGV0IGlzT2JqZWN0ID0gaXRlbSA9PiB7XG4gICAgcmV0dXJuIChpdGVtICYmIHR5cGVvZiBpdGVtID09PSAnb2JqZWN0JyAmJiAhQXJyYXkuaXNBcnJheShpdGVtKSAmJiBpdGVtICE9PSBudWxsKTtcbn1cblxubGV0IG1lcmdlRGVlcCA9ICh0YXJnZXQsIHNvdXJjZSkgPT4ge1xuICAgIGxldCBvdXRwdXQgPSBPYmplY3QuYXNzaWduKHt9LCB0YXJnZXQpO1xuXG4gICAgaWYgKGlzT2JqZWN0KHRhcmdldCkgJiYgaXNPYmplY3Qoc291cmNlKSkge1xuICAgICAgICBPYmplY3Qua2V5cyhzb3VyY2UpLmZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgICAgIGlmIChpc09iamVjdChzb3VyY2Vba2V5XSkpIHtcbiAgICAgICAgICAgICAgICBpZiAoIShrZXkgaW4gdGFyZ2V0KSlcbiAgICAgICAgICAgICAgICBPYmplY3QuYXNzaWduKG91dHB1dCwgeyBba2V5XTogc291cmNlW2tleV0gfSk7XG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIG91dHB1dFtrZXldID0gbWVyZ2VEZWVwKHRhcmdldFtrZXldLCBzb3VyY2Vba2V5XSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIE9iamVjdC5hc3NpZ24ob3V0cHV0LCB7IFtrZXldOiBzb3VyY2Vba2V5XSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBvdXRwdXQ7XG59XG5cbmNsYXNzIFRyb3dlbERyb3BzIHtcbiAgICBjb25zdHJ1Y3RvcihlbGVtZW50cykge1xuICAgICAgICBmb3IgKGxldCBlbGVtZW50IGluIGVsZW1lbnRzKSB7XG4gICAgICAgICAgICBsZXQgZWxlbWVudF9vYmogPSBuZXcgVHJvd2VsRHJvcChlbGVtZW50c1tlbGVtZW50XSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmNsYXNzIFRyb3dlbERyb3Age1xuICAgIGNvbnN0cnVjdG9yKHRyaWdnZXIsIG9wdGlvbnMgPSB7fSkge1xuICAgICAgICBpZiAod2luZG93LlRldGhlciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Jvb3RzdHJhcCB0b29sdGlwcyByZXF1aXJlIFRldGhlciAoaHR0cDovL3RldGhlci5pby8pJylcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0eXBlb2YodHJpZ2dlcikgPT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIHRoaXMuX3RyaWdnZXIgPSB0cmlnZ2VyO1xuICAgICAgICAgICAgdGhpcy5fZHJvcCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGhpcy5fdHJpZ2dlci5nZXRBdHRyaWJ1dGUoJ2RhdGEtaHJlZicpKTtcbiAgICAgICAgICAgIHRoaXMuX29wdGlvbnMgPSB0aGlzLnNldE9wdGlvbnMob3B0aW9ucyk7XG4gICAgICAgICAgICB0aGlzLl90ZXRoZXIgPSBuZXcgVGV0aGVyKHRoaXMuZ2V0VGV0aGVyT3B0aW9ucyh0aGlzLl9vcHRpb25zKSk7XG4gICAgICAgICAgICB0aGlzLl92aXNpYmxlID0gdGhpcy5fb3B0aW9ucy52aXNpYmxlO1xuICAgICAgICAgICAgdGhpcy50dXJuVmlzaWJpbGl0eSgpO1xuICAgICAgICAgICAgdGhpcy5zZXRHdXR0ZXJQb3NpdGlvbnMoKTtcbiAgICAgICAgICAgIHRoaXMuX2xpc3RlbmVyKCk7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIHNldE9wdGlvbnMob3B0aW9ucykge1xuICAgICAgICBjb25zdCBkZWZhdWx0T3B0aW9ucyA9IHtcbiAgICAgICAgICAgIHZpc2libGU6IGZhbHNlLFxuICAgICAgICAgICAgYmVoYXZpb3I6ICdjbGljaycsXG4gICAgICAgICAgICBwb3NpdGlvbjogJ2JvdHRvbW91dCBsZWZ0aW4nLFxuICAgICAgICB9O1xuXG4gICAgICAgIGxldCBmdWxsT3B0aW9ucyA9IG1lcmdlRGVlcChkZWZhdWx0T3B0aW9ucywgb3B0aW9ucyk7XG5cbiAgICAgICAgZm9yIChsZXQgb3B0aW9uIGluIGRlZmF1bHRPcHRpb25zKSB7XG4gICAgICAgICAgICBjb25zdCBkYXRhT3B0aW9uID0gdGhpcy5fdHJpZ2dlci5nZXRBdHRyaWJ1dGUoYGRhdGEtJHtvcHRpb259YCk7XG5cbiAgICAgICAgICAgIGlmIChkYXRhT3B0aW9uKSB7XG4gICAgICAgICAgICAgICAgZnVsbE9wdGlvbnNbb3B0aW9uXSA9IGRhdGFPcHRpb247XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuXG4gICAgICAgIGNvbnN0IHsgcG9zWSwgcG9zWCB9ID0gdGhpcy5nZXRQb3NpdGlvbnMoZnVsbE9wdGlvbnMpO1xuXG4gICAgICAgIGlmICghWydjbGljaycsICdob3ZlciddLmluY2x1ZGVzKGZ1bGxPcHRpb25zLmJlaGF2aW9yKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUcm93ZWwgZHJvcHMgYmVoYXZpb3Igb3B0aW9uIG11c3QgYmUgXFwnY2xpY2tcXCcgb3IgXFwnaG92ZXJcXCcnKVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGZ1bGxPcHRpb25zLnBvc2l0aW9uLnNwbGl0KCcgJykubGVuZ3RoICE9IDIpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVHJvd2VsIGRyb3BzIHBvc2l0aW9uIG9wdGlvbiBtdXN0IGJlIGEgc3RyaW5nIHdpdGhpbiB0d28gd29yZHMgZGVzY3JpYmluZyBZIChcXCd0b3BcXCcsIFxcJ21pZGRsZVxcJyBvciBcXCdib3R0b21cXCcpIGFuZCBYIChcXCdsZWZ0XFwnLCBcXCdjZW50ZXJcXCcgb3IgXFwncmlnaHRcXCcpIHBvc2l0aW9uJylcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghWyd0b3BpbicsICd0b3BvdXQnLCAnbWlkZGxlJywgJ2JvdHRvbWluJywgJ2JvdHRvbW91dCddLmluY2x1ZGVzKHBvc1kpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Ryb3dlbCBkcm9wcyBwb3NpdGlvbiBvcHRpb24gZmlyc3Qgd29yZCBtdXN0IGJlIFxcJ3RvcGluXFwnLCBcXCd0b3BvdXRcXCcsIFxcJ21pZGRsZVxcJywgXFwnYm90dG9taW5cXCcgb3IgXFwnYm90dG9tb3V0XFwnJylcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghWydsZWZ0aW4nLCAnbGVmdG91dCcsICdjZW50ZXInLCAncmlnaHRpbicsICdyaWdodG91dCddLmluY2x1ZGVzKHBvc1gpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Ryb3dlbCBkcm9wcyBwb3NpdGlvbiBvcHRpb24gc2Vjb25kIHdvcmQgbXVzdCBiZSBcXCdsZWZ0aW5cXCcsIFxcJ2xlZnRvdXRcXCcsIFxcJ2NlbnRlclxcJywgXFwncmlnaHRpblxcJyBvciBcXCdyaWdodG91dFxcJycpXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZnVsbE9wdGlvbnM7XG4gICAgfVxuXG4gICAgZ2V0UG9zaXRpb25zKG9wdGlvbnMpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG9wdGlvbnM6IG9wdGlvbnMsXG4gICAgICAgICAgICBwb3NZOiBvcHRpb25zLnBvc2l0aW9uLnNwbGl0KCcgJylbMF0sXG4gICAgICAgICAgICBwb3NYOiBvcHRpb25zLnBvc2l0aW9uLnNwbGl0KCcgJylbMV0sXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRUZXRoZXJPcHRpb25zKG9wdGlvbnMpIHtcbiAgICAgICAgY29uc3QgeyBwb3NZLCBwb3NYIH0gPSB0aGlzLmdldFBvc2l0aW9ucyhvcHRpb25zKTtcbiAgICAgICAgbGV0IGF0dGFjaG1lbnRYLCBhdHRhY2htZW50WSwgdGFyZ2V0QXR0YWNobWVudFgsIHRhcmdldEF0dGFjaG1lbnRZLCBndXR0ZXJYLCBndXR0ZXJZO1xuXG4gICAgICAgIHN3aXRjaCAocG9zWSkge1xuICAgICAgICAgICAgY2FzZSAndG9wb3V0JzpcbiAgICAgICAgICAgICAgICBhdHRhY2htZW50WSA9ICdib3R0b20nO1xuICAgICAgICAgICAgICAgIHRhcmdldEF0dGFjaG1lbnRZID0gJ3RvcCc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICd0b3Bpbic6XG4gICAgICAgICAgICAgICAgYXR0YWNobWVudFkgPSAndG9wJztcbiAgICAgICAgICAgICAgICB0YXJnZXRBdHRhY2htZW50WSA9ICd0b3AnO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnYm90dG9taW4nOlxuICAgICAgICAgICAgICAgIGF0dGFjaG1lbnRZID0gJ2JvdHRvbSc7XG4gICAgICAgICAgICAgICAgdGFyZ2V0QXR0YWNobWVudFkgPSAnYm90dG9tJztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2JvdHRvbW91dCc6XG4gICAgICAgICAgICAgICAgYXR0YWNobWVudFkgPSAndG9wJztcbiAgICAgICAgICAgICAgICB0YXJnZXRBdHRhY2htZW50WSA9ICdib3R0b20nO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBhdHRhY2htZW50WSA9ICdjZW50ZXInO1xuICAgICAgICAgICAgICAgIHRhcmdldEF0dGFjaG1lbnRZID0gJ2NlbnRlcic7XG4gICAgICAgIH1cblxuICAgICAgICBzd2l0Y2ggKHBvc1gpIHtcbiAgICAgICAgICAgIGNhc2UgJ2xlZnRvdXQnOlxuICAgICAgICAgICAgICAgIGF0dGFjaG1lbnRYID0gJ3JpZ2h0JztcbiAgICAgICAgICAgICAgICB0YXJnZXRBdHRhY2htZW50WCA9ICdsZWZ0JztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2xlZnRpbic6XG4gICAgICAgICAgICAgICAgYXR0YWNobWVudFggPSAnbGVmdCc7XG4gICAgICAgICAgICAgICAgdGFyZ2V0QXR0YWNobWVudFggPSAnbGVmdCc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdyaWdodGluJzpcbiAgICAgICAgICAgICAgICBhdHRhY2htZW50WCA9ICdyaWdodCc7XG4gICAgICAgICAgICAgICAgdGFyZ2V0QXR0YWNobWVudFggPSAncmlnaHQnO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAncmlnaHRvdXQnOlxuICAgICAgICAgICAgICAgIGF0dGFjaG1lbnRYID0gJ2xlZnQnO1xuICAgICAgICAgICAgICAgIHRhcmdldEF0dGFjaG1lbnRYID0gJ3JpZ2h0JztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgYXR0YWNobWVudFggPSAnY2VudGVyJztcbiAgICAgICAgICAgICAgICB0YXJnZXRBdHRhY2htZW50WCA9ICdjZW50ZXInO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGNvbmZpZyA9IHtcbiAgICAgICAgICAgIGVsZW1lbnQ6IHRoaXMuX2Ryb3AsXG4gICAgICAgICAgICB0YXJnZXQ6IHRoaXMuX3RyaWdnZXIsXG4gICAgICAgICAgICBhdHRhY2htZW50OiBgJHthdHRhY2htZW50WX0gJHthdHRhY2htZW50WH1gLFxuICAgICAgICAgICAgdGFyZ2V0QXR0YWNobWVudDogYCR7dGFyZ2V0QXR0YWNobWVudFl9ICR7dGFyZ2V0QXR0YWNobWVudFh9YCxcbiAgICAgICAgfTtcblxuXG4gICAgICAgIHJldHVybiBjb25maWc7XG4gICAgfVxuXG4gICAgc2V0R3V0dGVyUG9zaXRpb25zKCkge1xuICAgICAgICBjb25zdCB7IHBvc1ksIHBvc1ggfSA9IHRoaXMuZ2V0UG9zaXRpb25zKHRoaXMuX29wdGlvbnMpO1xuICAgICAgICBsZXQgZ3V0dGVyWSwgZ3V0dGVyWDtcblxuICAgICAgICBzd2l0Y2ggKHBvc1kpIHtcbiAgICAgICAgICAgIGNhc2UgJ3RvcG91dCc6XG4gICAgICAgICAgICAgICAgZ3V0dGVyWSA9ICdib3R0b20nO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnYm90dG9tb3V0JzpcbiAgICAgICAgICAgICAgICBndXR0ZXJZID0gJ3RvcCc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGd1dHRlclkgPSAnbm9uZSc7XG4gICAgICAgIH1cblxuICAgICAgICBzd2l0Y2ggKHBvc1gpIHtcbiAgICAgICAgICAgIGNhc2UgJ2xlZnRvdXQnOlxuICAgICAgICAgICAgICAgIGd1dHRlclggPSAncmlnaHQnO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAncmlnaHRvdXQnOlxuICAgICAgICAgICAgICAgIGd1dHRlclggPSAnbGVmdCc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGd1dHRlclggPSAnbm9uZSc7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9kcm9wLnNldEF0dHJpYnV0ZSgnZGF0YS1ndXR0ZXInLCBgJHtndXR0ZXJZfSAke2d1dHRlclh9YClcbiAgICB9XG5cbiAgICBzaG93KCkge1xuICAgICAgICB0aGlzLl92aXNpYmxlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy50dXJuVmlzaWJpbGl0eSgpO1xuICAgIH1cblxuICAgIGhpZGUoKSB7XG4gICAgICAgIHRoaXMuX3Zpc2libGUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy50dXJuVmlzaWJpbGl0eSgpO1xuICAgIH1cblxuICAgIGlzU2hvd24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9kcm9wLnN0eWxlLmRpc3BsYXkgPT0gJ2Jsb2NrJztcbiAgICB9XG5cbiAgICBpc0hpZGRlbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2Ryb3Auc3R5bGUuZGlzcGxheSA9PSAnbm9uZSc7XG4gICAgfVxuXG4gICAgdG9nZ2xlKCkge1xuICAgICAgICB0aGlzLl92aXNpYmxlID0gIXRoaXMuX3Zpc2libGU7XG4gICAgICAgIHRoaXMudHVyblZpc2liaWxpdHkoKTtcbiAgICB9XG5cbiAgICB0dXJuVmlzaWJpbGl0eSgpIHtcbiAgICAgICAgaWYgKHRoaXMuX3Zpc2libGUpIHtcbiAgICAgICAgICAgIHRoaXMuX2dlbmVyYXRlRXZlbnQoJ3Nob3cudHJvd2VsLmRyb3BzJyk7XG4gICAgICAgICAgICB0aGlzLl9kcm9wLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgICAgICAgdGhpcy5fZ2VuZXJhdGVFdmVudCgnc2hvd24udHJvd2VsLmRyb3BzJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9nZW5lcmF0ZUV2ZW50KCdoaWRlLnRyb3dlbC5kcm9wcycpO1xuICAgICAgICAgICAgdGhpcy5fZHJvcC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICAgICAgdGhpcy5fZ2VuZXJhdGVFdmVudCgnZGlzcGxheS50cm93ZWwuZHJvcHMnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX3RldGhlci5wb3NpdGlvbigpO1xuICAgIH1cblxuICAgIF9saXN0ZW5lcigpIHtcbiAgICAgICAgaWYgKHRoaXMuX29wdGlvbnMuYmVoYXZpb3IgPT0gJ2NsaWNrJykge1xuICAgICAgICAgICAgdGhpcy5fdHJpZ2dlci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgdGhpcy50b2dnbGUoKTtcbiAgICAgICAgICAgIH0uYmluZCh0aGlzKSwgZmFsc2UpO1xuXG4gICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgdmFyIGlzQ2xpY2tJbnNpZGUgPSB0aGlzLl90cmlnZ2VyLmNvbnRhaW5zKGV2ZW50LnRhcmdldCk7XG5cbiAgICAgICAgICAgICAgICBpZiAoIWlzQ2xpY2tJbnNpZGUgJiYgdGhpcy5pc1Nob3duKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5oaWRlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfS5iaW5kKHRoaXMpLCBmYWxzZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl90cmlnZ2VyLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZW50ZXInLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2hvdygpO1xuICAgICAgICAgICAgfS5iaW5kKHRoaXMpLCBmYWxzZSk7XG5cbiAgICAgICAgICAgIHRoaXMuX3RyaWdnZXIuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdXQnLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgICAgIHRoaXMuaGlkZSgpO1xuICAgICAgICAgICAgfS5iaW5kKHRoaXMpLCBmYWxzZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBfZ2VuZXJhdGVFdmVudChuYW1lKSB7XG4gICAgICAgIGxldCBldmVudCA9IG5ldyBFdmVudChuYW1lKTtcblxuICAgICAgICAvLyBEaXNwYXRjaCB0aGUgZXZlbnQuXG4gICAgICAgIHRoaXMuX2Ryb3AuZGlzcGF0Y2hFdmVudChldmVudCk7XG4gICAgfVxuXG4gICAgX3RldGhlckhvcml6b250YWxQb3MoaXRlbSkge1xuICAgICAgICBjb25zb2xlLmxvZyhpdGVtKTtcbiAgICAgICAgaWYgKGl0ZW0uYXR0YWNobWVudC5sZWZ0ID09ICdyaWdodCcgJiYgaXRlbS5hdHRhY2htZW50LnRvcCA9PSAndG9wJyAmJiBpdGVtLnRhcmdldEF0dGFjaG1lbnQubGVmdCA9PSAnbGVmdCcgJiYgaXRlbS50YXJnZXRBdHRhY2htZW50LnRvcCA9PSAnYm90dG9tJykge1xuICAgICAgICAgICAgY29uZmlnLmF0dGFjaG1lbnQgPSAndG9wIHJpZ2h0JztcbiAgICAgICAgICAgIGNvbmZpZy50YXJnZXRBdHRhY2htZW50ID0gJ2JvdHRvbSByaWdodCc7XG5cbiAgICAgICAgICAgIHRoaXMuX3RldGhlci5zZXRPcHRpb25zKGNvbmZpZywgZmFsc2UpO1xuICAgICAgICB9XG4gICAgfVxufVxuIl19
