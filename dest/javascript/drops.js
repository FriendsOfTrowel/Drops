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
            switch (this._options.behavior) {
                case 'click':
                    this._trigger.addEventListener('click', function (event) {
                        this.toggle();
                    }.bind(this), false);

                    document.addEventListener('click', function (event) {
                        var isClickInside = this._trigger.contains(event.target);

                        if (!isClickInside && this.isShown()) {
                            this.hide();
                        }
                    }.bind(this), false);
                    break;
                case 'hover':
                    this._trigger.addEventListener('mouseenter', function (event) {
                        this.show();
                    }.bind(this), false);

                    this._trigger.addEventListener('mouseout', function (event) {
                        var hoveringTrigger = event.toElement == this._trigger || this._trigger.contains(event.toElement);
                        var hoveringDrop = event.toElement == this._drop || this._drop.contains(event.toElement);

                        if (!hoveringTrigger && !hoveringDrop) {
                            this.hide();
                        }
                    }.bind(this), false);

                    this._drop.addEventListener('mouseout', function (event) {
                        var hoveringTrigger = event.toElement == this._trigger || this._trigger.contains(event.toElement);
                        var hoveringDrop = event.toElement == this._drop || this._drop.contains(event.toElement);

                        if (!hoveringTrigger && !hoveringDrop) {
                            this.hide();
                        }
                    }.bind(this), false);

                    break;
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRyb3BzLmpzIl0sIm5hbWVzIjpbImlzT2JqZWN0IiwiaXRlbSIsIkFycmF5IiwiaXNBcnJheSIsIm1lcmdlRGVlcCIsInRhcmdldCIsInNvdXJjZSIsIm91dHB1dCIsIk9iamVjdCIsImFzc2lnbiIsImtleXMiLCJmb3JFYWNoIiwia2V5IiwiVHJvd2VsRHJvcHMiLCJlbGVtZW50cyIsImVsZW1lbnQiLCJlbGVtZW50X29iaiIsIlRyb3dlbERyb3AiLCJ0cmlnZ2VyIiwib3B0aW9ucyIsIndpbmRvdyIsIlRldGhlciIsInVuZGVmaW5lZCIsIkVycm9yIiwiX3RyaWdnZXIiLCJfZHJvcCIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvciIsImdldEF0dHJpYnV0ZSIsIl9vcHRpb25zIiwic2V0T3B0aW9ucyIsIl90ZXRoZXIiLCJnZXRUZXRoZXJPcHRpb25zIiwiX3Zpc2libGUiLCJ2aXNpYmxlIiwidHVyblZpc2liaWxpdHkiLCJzZXRHdXR0ZXJQb3NpdGlvbnMiLCJfbGlzdGVuZXIiLCJkZWZhdWx0T3B0aW9ucyIsImJlaGF2aW9yIiwicG9zaXRpb24iLCJmdWxsT3B0aW9ucyIsIm9wdGlvbiIsImRhdGFPcHRpb24iLCJnZXRQb3NpdGlvbnMiLCJwb3NZIiwicG9zWCIsImluY2x1ZGVzIiwic3BsaXQiLCJsZW5ndGgiLCJhdHRhY2htZW50WCIsImF0dGFjaG1lbnRZIiwidGFyZ2V0QXR0YWNobWVudFgiLCJ0YXJnZXRBdHRhY2htZW50WSIsImd1dHRlclgiLCJndXR0ZXJZIiwiY29uZmlnIiwiYXR0YWNobWVudCIsInRhcmdldEF0dGFjaG1lbnQiLCJzZXRBdHRyaWJ1dGUiLCJzdHlsZSIsImRpc3BsYXkiLCJfZ2VuZXJhdGVFdmVudCIsImFkZEV2ZW50TGlzdGVuZXIiLCJldmVudCIsInRvZ2dsZSIsImJpbmQiLCJpc0NsaWNrSW5zaWRlIiwiY29udGFpbnMiLCJpc1Nob3duIiwiaGlkZSIsInNob3ciLCJob3ZlcmluZ1RyaWdnZXIiLCJ0b0VsZW1lbnQiLCJob3ZlcmluZ0Ryb3AiLCJuYW1lIiwiRXZlbnQiLCJkaXNwYXRjaEV2ZW50IiwiY29uc29sZSIsImxvZyIsImxlZnQiLCJ0b3AiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxJQUFJQSxXQUFXLFNBQVhBLFFBQVcsT0FBUTtBQUNuQixXQUFRQyxRQUFRLFFBQU9BLElBQVAseUNBQU9BLElBQVAsT0FBZ0IsUUFBeEIsSUFBb0MsQ0FBQ0MsTUFBTUMsT0FBTixDQUFjRixJQUFkLENBQXJDLElBQTREQSxTQUFTLElBQTdFO0FBQ0gsQ0FGRDs7QUFJQSxJQUFJRyxZQUFZLFNBQVpBLFNBQVksQ0FBQ0MsTUFBRCxFQUFTQyxNQUFULEVBQW9CO0FBQ2hDLFFBQUlDLFNBQVNDLE9BQU9DLE1BQVAsQ0FBYyxFQUFkLEVBQWtCSixNQUFsQixDQUFiOztBQUVBLFFBQUlMLFNBQVNLLE1BQVQsS0FBb0JMLFNBQVNNLE1BQVQsQ0FBeEIsRUFBMEM7QUFDdENFLGVBQU9FLElBQVAsQ0FBWUosTUFBWixFQUFvQkssT0FBcEIsQ0FBNEIsZUFBTztBQUMvQixnQkFBSVgsU0FBU00sT0FBT00sR0FBUCxDQUFULENBQUosRUFBMkI7QUFDdkIsb0JBQUksRUFBRUEsT0FBT1AsTUFBVCxDQUFKLEVBQ0FHLE9BQU9DLE1BQVAsQ0FBY0YsTUFBZCxzQkFBeUJLLEdBQXpCLEVBQStCTixPQUFPTSxHQUFQLENBQS9CLEdBREEsS0FHQUwsT0FBT0ssR0FBUCxJQUFjUixVQUFVQyxPQUFPTyxHQUFQLENBQVYsRUFBdUJOLE9BQU9NLEdBQVAsQ0FBdkIsQ0FBZDtBQUNILGFBTEQsTUFLTztBQUNISix1QkFBT0MsTUFBUCxDQUFjRixNQUFkLHNCQUF5QkssR0FBekIsRUFBK0JOLE9BQU9NLEdBQVAsQ0FBL0I7QUFDSDtBQUNKLFNBVEQ7QUFVSDtBQUNELFdBQU9MLE1BQVA7QUFDSCxDQWhCRDs7SUFrQk1NLFcsR0FDRixxQkFBWUMsUUFBWixFQUFzQjtBQUFBOztBQUNsQixTQUFLLElBQUlDLE9BQVQsSUFBb0JELFFBQXBCLEVB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QUlYLFFBQVEsSUFBSVksS0FBSixDQUFVRCxJQUFWLENBQVo7O0FBRUE7QUFDQSxpQkFBS2xELEtBQUwsQ0FBV29ELGFBQVgsQ0FBeUJiLEtBQXpCO0FBQ0g7Ozs2Q0FFb0IvRCxJLEVBQU07QUFDdkI2RSxvQkFBUUMsR0FBUixDQUFZOUUsSUFBWjtBQUNBLGdCQUFJQSxLQUFLd0QsVUFBTCxDQUFnQnVCLElBQWhCLElBQXdCLE9BQXhCLElBQW1DL0UsS0FBS3dELFVBQUwsQ0FBZ0J3QixHQUFoQixJQUF1QixLQUExRCxJQUFtRWhGLEtBQUt5RCxnQkFBTCxDQUFzQnNCLElBQXRCLElBQThCLE1BQWpHLElBQTJHL0UsS0FBS3lELGdCQUFMLENBQXNCdUIsR0FBdEIsSUFBNkIsUUFBNUksRUFBc0o7QUFDbEp6Qix1QkFBT0MsVUFBUCxHQUFvQixXQUFwQjtBQUNBRCx1QkFBT0UsZ0JBQVAsR0FBMEIsY0FBMUI7O0FBRUEscUJBQUszQixPQUFMLENBQWFELFVBQWIsQ0FBd0IwQixNQUF4QixFQUFnQyxLQUFoQztBQUNIO0FBQ0oiLCJmaWxlIjoiZHJvcHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJsZXQgaXNPYmplY3QgPSBpdGVtID0+IHtcbiAgICByZXR1cm4gKGl0ZW0gJiYgdHlwZW9mIGl0ZW0gPT09ICdvYmplY3QnICYmICFBcnJheS5pc0FycmF5KGl0ZW0pICYmIGl0ZW0gIT09IG51bGwpO1xufVxuXG5sZXQgbWVyZ2VEZWVwID0gKHRhcmdldCwgc291cmNlKSA9PiB7XG4gICAgbGV0IG91dHB1dCA9IE9iamVjdC5hc3NpZ24oe30sIHRhcmdldCk7XG5cbiAgICBpZiAoaXNPYmplY3QodGFyZ2V0KSAmJiBpc09iamVjdChzb3VyY2UpKSB7XG4gICAgICAgIE9iamVjdC5rZXlzKHNvdXJjZSkuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgICAgICAgaWYgKGlzT2JqZWN0KHNvdXJjZVtrZXldKSkge1xuICAgICAgICAgICAgICAgIGlmICghKGtleSBpbiB0YXJnZXQpKVxuICAgICAgICAgICAgICAgIE9iamVjdC5hc3NpZ24ob3V0cHV0LCB7IFtrZXldOiBzb3VyY2Vba2V5XSB9KTtcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgb3V0cHV0W2tleV0gPSBtZXJnZURlZXAodGFyZ2V0W2tleV0sIHNvdXJjZVtrZXldKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgT2JqZWN0LmFzc2lnbihvdXRwdXQsIHsgW2tleV06IHNvdXJjZVtrZXldIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIG91dHB1dDtcbn1cblxuY2xhc3MgVHJvd2VsRHJvcHMge1xuICAgIGNvbnN0cnVjdG9yKGVsZW1lbnRzKSB7XG4gICAgICAgIGZvciAobGV0IGVsZW1lbnQgaW4gZWxlbWVudHMpIHtcbiAgICAgICAgICAgIGxldCBlbGVtZW50X29iaiA9IG5ldyBUcm93ZWxEcm9wKGVsZW1lbnRzW2VsZW1lbnRdKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuY2xhc3MgVHJvd2VsRHJvcCB7XG4gICAgY29uc3RydWN0b3IodHJpZ2dlciwgb3B0aW9ucyA9IHt9KSB7XG4gICAgICAgIGlmICh3aW5kb3cuVGV0aGVyID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQm9vdHN0cmFwIHRvb2x0aXBzIHJlcXVpcmUgVGV0aGVyIChodHRwOi8vdGV0aGVyLmlvLyknKVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGVvZih0cmlnZ2VyKSA9PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgdGhpcy5fdHJpZ2dlciA9IHRyaWdnZXI7XG4gICAgICAgICAgICB0aGlzLl9kcm9wID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0aGlzLl90cmlnZ2VyLmdldEF0dHJpYnV0ZSgnZGF0YS1ocmVmJykpO1xuICAgICAgICAgICAgdGhpcy5fb3B0aW9ucyA9IHRoaXMuc2V0T3B0aW9ucyhvcHRpb25zKTtcbiAgICAgICAgICAgIHRoaXMuX3RldGhlciA9IG5ldyBUZXRoZXIodGhpcy5nZXRUZXRoZXJPcHRpb25zKHRoaXMuX29wdGlvbnMpKTtcbiAgICAgICAgICAgIHRoaXMuX3Zpc2libGUgPSB0aGlzLl9vcHRpb25zLnZpc2libGU7XG4gICAgICAgICAgICB0aGlzLnR1cm5WaXNpYmlsaXR5KCk7XG4gICAgICAgICAgICB0aGlzLnNldEd1dHRlclBvc2l0aW9ucygpO1xuICAgICAgICAgICAgdGhpcy5fbGlzdGVuZXIoKTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgc2V0T3B0aW9ucyhvcHRpb25zKSB7XG4gICAgICAgIGNvbnN0IGRlZmF1bHRPcHRpb25zID0ge1xuICAgICAgICAgICAgdmlzaWJsZTogZmFsc2UsXG4gICAgICAgICAgICBiZWhhdmlvcjogJ2NsaWNrJyxcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnYm90dG9tb3V0IGxlZnRpbicsXG4gICAgICAgIH07XG5cbiAgICAgICAgbGV0IGZ1bGxPcHRpb25zID0gbWVyZ2VEZWVwKGRlZmF1bHRPcHRpb25zLCBvcHRpb25zKTtcblxuICAgICAgICBmb3IgKGxldCBvcHRpb24gaW4gZGVmYXVsdE9wdGlvbnMpIHtcbiAgICAgICAgICAgIGNvbnN0IGRhdGFPcHRpb24gPSB0aGlzLl90cmlnZ2VyLmdldEF0dHJpYnV0ZShgZGF0YS0ke29wdGlvbn1gKTtcblxuICAgICAgICAgICAgaWYgKGRhdGFPcHRpb24pIHtcbiAgICAgICAgICAgICAgICBmdWxsT3B0aW9uc1tvcHRpb25dID0gZGF0YU9wdGlvbjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG5cbiAgICAgICAgY29uc3QgeyBwb3NZLCBwb3NYIH0gPSB0aGlzLmdldFBvc2l0aW9ucyhmdWxsT3B0aW9ucyk7XG5cbiAgICAgICAgaWYgKCFbJ2NsaWNrJywgJ2hvdmVyJ10uaW5jbHVkZXMoZnVsbE9wdGlvbnMuYmVoYXZpb3IpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Ryb3dlbCBkcm9wcyBiZWhhdmlvciBvcHRpb24gbXVzdCBiZSBcXCdjbGlja1xcJyBvciBcXCdob3ZlclxcJycpXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZnVsbE9wdGlvbnMucG9zaXRpb24uc3BsaXQoJyAnKS5sZW5ndGggIT0gMikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUcm93ZWwgZHJvcHMgcG9zaXRpb24gb3B0aW9uIG11c3QgYmUgYSBzdHJpbmcgd2l0aGluIHR3byB3b3JkcyBkZXNjcmliaW5nIFkgKFxcJ3RvcFxcJywgXFwnbWlkZGxlXFwnIG9yIFxcJ2JvdHRvbVxcJykgYW5kIFggKFxcJ2xlZnRcXCcsIFxcJ2NlbnRlclxcJyBvciBcXCdyaWdodFxcJykgcG9zaXRpb24nKVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFbJ3RvcGluJywgJ3RvcG91dCcsICdtaWRkbGUnLCAnYm90dG9taW4nLCAnYm90dG9tb3V0J10uaW5jbHVkZXMocG9zWSkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVHJvd2VsIGRyb3BzIHBvc2l0aW9uIG9wdGlvbiBmaXJzdCB3b3JkIG11c3QgYmUgXFwndG9waW5cXCcsIFxcJ3RvcG91dFxcJywgXFwnbWlkZGxlXFwnLCBcXCdib3R0b21pblxcJyBvciBcXCdib3R0b21vdXRcXCcnKVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFbJ2xlZnRpbicsICdsZWZ0b3V0JywgJ2NlbnRlcicsICdyaWdodGluJywgJ3JpZ2h0b3V0J10uaW5jbHVkZXMocG9zWCkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVHJvd2VsIGRyb3BzIHBvc2l0aW9uIG9wdGlvbiBzZWNvbmQgd29yZCBtdXN0IGJlIFxcJ2xlZnRpblxcJywgXFwnbGVmdG91dFxcJywgXFwnY2VudGVyXFwnLCBcXCdyaWdodGluXFwnIG9yIFxcJ3JpZ2h0b3V0XFwnJylcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmdWxsT3B0aW9ucztcbiAgICB9XG5cbiAgICBnZXRQb3NpdGlvbnMob3B0aW9ucykge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgb3B0aW9uczogb3B0aW9ucyxcbiAgICAgICAgICAgIHBvc1k6IG9wdGlvbnMucG9zaXRpb24uc3BsaXQoJyAnKVswXSxcbiAgICAgICAgICAgIHBvc1g6IG9wdGlvbnMucG9zaXRpb24uc3BsaXQoJyAnKVsxXSxcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldFRldGhlck9wdGlvbnMob3B0aW9ucykge1xuICAgICAgICBjb25zdCB7IHBvc1ksIHBvc1ggfSA9IHRoaXMuZ2V0UG9zaXRpb25zKG9wdGlvbnMpO1xuICAgICAgICBsZXQgYXR0YWNobWVudFgsIGF0dGFjaG1lbnRZLCB0YXJnZXRBdHRhY2htZW50WCwgdGFyZ2V0QXR0YWNobWVudFksIGd1dHRlclgsIGd1dHRlclk7XG5cbiAgICAgICAgc3dpdGNoIChwb3NZKSB7XG4gICAgICAgICAgICBjYXNlICd0b3BvdXQnOlxuICAgICAgICAgICAgICAgIGF0dGFjaG1lbnRZID0gJ2JvdHRvbSc7XG4gICAgICAgICAgICAgICAgdGFyZ2V0QXR0YWNobWVudFkgPSAndG9wJztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ3RvcGluJzpcbiAgICAgICAgICAgICAgICBhdHRhY2htZW50WSA9ICd0b3AnO1xuICAgICAgICAgICAgICAgIHRhcmdldEF0dGFjaG1lbnRZID0gJ3RvcCc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdib3R0b21pbic6XG4gICAgICAgICAgICAgICAgYXR0YWNobWVudFkgPSAnYm90dG9tJztcbiAgICAgICAgICAgICAgICB0YXJnZXRBdHRhY2htZW50WSA9ICdib3R0b20nO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnYm90dG9tb3V0JzpcbiAgICAgICAgICAgICAgICBhdHRhY2htZW50WSA9ICd0b3AnO1xuICAgICAgICAgICAgICAgIHRhcmdldEF0dGFjaG1lbnRZID0gJ2JvdHRvbSc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGF0dGFjaG1lbnRZID0gJ2NlbnRlcic7XG4gICAgICAgICAgICAgICAgdGFyZ2V0QXR0YWNobWVudFkgPSAnY2VudGVyJztcbiAgICAgICAgfVxuXG4gICAgICAgIHN3aXRjaCAocG9zWCkge1xuICAgICAgICAgICAgY2FzZSAnbGVmdG91dCc6XG4gICAgICAgICAgICAgICAgYXR0YWNobWVudFggPSAncmlnaHQnO1xuICAgICAgICAgICAgICAgIHRhcmdldEF0dGFjaG1lbnRYID0gJ2xlZnQnO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnbGVmdGluJzpcbiAgICAgICAgICAgICAgICBhdHRhY2htZW50WCA9ICdsZWZ0JztcbiAgICAgICAgICAgICAgICB0YXJnZXRBdHRhY2htZW50WCA9ICdsZWZ0JztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ3JpZ2h0aW4nOlxuICAgICAgICAgICAgICAgIGF0dGFjaG1lbnRYID0gJ3JpZ2h0JztcbiAgICAgICAgICAgICAgICB0YXJnZXRBdHRhY2htZW50WCA9ICdyaWdodCc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdyaWdodG91dCc6XG4gICAgICAgICAgICAgICAgYXR0YWNobWVudFggPSAnbGVmdCc7XG4gICAgICAgICAgICAgICAgdGFyZ2V0QXR0YWNobWVudFggPSAncmlnaHQnO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBhdHRhY2htZW50WCA9ICdjZW50ZXInO1xuICAgICAgICAgICAgICAgIHRhcmdldEF0dGFjaG1lbnRYID0gJ2NlbnRlcic7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgY29uZmlnID0ge1xuICAgICAgICAgICAgZWxlbWVudDogdGhpcy5fZHJvcCxcbiAgICAgICAgICAgIHRhcmdldDogdGhpcy5fdHJpZ2dlcixcbiAgICAgICAgICAgIGF0dGFjaG1lbnQ6IGAke2F0dGFjaG1lbnRZfSAke2F0dGFjaG1lbnRYfWAsXG4gICAgICAgICAgICB0YXJnZXRBdHRhY2htZW50OiBgJHt0YXJnZXRBdHRhY2htZW50WX0gJHt0YXJnZXRBdHRhY2htZW50WH1gLFxuICAgICAgICB9O1xuXG5cbiAgICAgICAgcmV0dXJuIGNvbmZpZztcbiAgICB9XG5cbiAgICBzZXRHdXR0ZXJQb3NpdGlvbnMoKSB7XG4gICAgICAgIGNvbnN0IHsgcG9zWSwgcG9zWCB9ID0gdGhpcy5nZXRQb3NpdGlvbnModGhpcy5fb3B0aW9ucyk7XG4gICAgICAgIGxldCBndXR0ZXJZLCBndXR0ZXJYO1xuXG4gICAgICAgIHN3aXRjaCAocG9zWSkge1xuICAgICAgICAgICAgY2FzZSAndG9wb3V0JzpcbiAgICAgICAgICAgICAgICBndXR0ZXJZID0gJ2JvdHRvbSc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdib3R0b21vdXQnOlxuICAgICAgICAgICAgICAgIGd1dHRlclkgPSAndG9wJztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgZ3V0dGVyWSA9ICdub25lJztcbiAgICAgICAgfVxuXG4gICAgICAgIHN3aXRjaCAocG9zWCkge1xuICAgICAgICAgICAgY2FzZSAnbGVmdG91dCc6XG4gICAgICAgICAgICAgICAgZ3V0dGVyWCA9ICdyaWdodCc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdyaWdodG91dCc6XG4gICAgICAgICAgICAgICAgZ3V0dGVyWCA9ICdsZWZ0JztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgZ3V0dGVyWCA9ICdub25lJztcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2Ryb3Auc2V0QXR0cmlidXRlKCdkYXRhLWd1dHRlcicsIGAke2d1dHRlcll9ICR7Z3V0dGVyWH1gKVxuICAgIH1cblxuICAgIHNob3coKSB7XG4gICAgICAgIHRoaXMuX3Zpc2libGUgPSB0cnVlO1xuICAgICAgICB0aGlzLnR1cm5WaXNpYmlsaXR5KCk7XG4gICAgfVxuXG4gICAgaGlkZSgpIHtcbiAgICAgICAgdGhpcy5fdmlzaWJsZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLnR1cm5WaXNpYmlsaXR5KCk7XG4gICAgfVxuXG4gICAgaXNTaG93bigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2Ryb3Auc3R5bGUuZGlzcGxheSA9PSAnYmxvY2snO1xuICAgIH1cblxuICAgIGlzSGlkZGVuKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZHJvcC5zdHlsZS5kaXNwbGF5ID09ICdub25lJztcbiAgICB9XG5cbiAgICB0b2dnbGUoKSB7XG4gICAgICAgIHRoaXMuX3Zpc2libGUgPSAhdGhpcy5fdmlzaWJsZTtcbiAgICAgICAgdGhpcy50dXJuVmlzaWJpbGl0eSgpO1xuICAgIH1cblxuICAgIHR1cm5WaXNpYmlsaXR5KCkge1xuICAgICAgICBpZiAodGhpcy5fdmlzaWJsZSkge1xuICAgICAgICAgICAgdGhpcy5fZ2VuZXJhdGVFdmVudCgnc2hvdy50cm93ZWwuZHJvcHMnKTtcbiAgICAgICAgICAgIHRoaXMuX2Ryb3Auc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgICAgICB0aGlzLl9nZW5lcmF0ZUV2ZW50KCdzaG93bi50cm93ZWwuZHJvcHMnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX2dlbmVyYXRlRXZlbnQoJ2hpZGUudHJvd2VsLmRyb3BzJyk7XG4gICAgICAgICAgICB0aGlzLl9kcm9wLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgICAgICB0aGlzLl9nZW5lcmF0ZUV2ZW50KCdkaXNwbGF5LnRyb3dlbC5kcm9wcycpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fdGV0aGVyLnBvc2l0aW9uKCk7XG4gICAgfVxuXG4gICAgX2xpc3RlbmVyKCkge1xuICAgICAgICBzd2l0Y2ggKHRoaXMuX29wdGlvbnMuYmVoYXZpb3IpIHtcbiAgICAgICAgICAgIGNhc2UgJ2NsaWNrJzpcbiAgICAgICAgICAgICAgICB0aGlzLl90cmlnZ2VyLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50b2dnbGUoKTtcbiAgICAgICAgICAgICAgICB9LmJpbmQodGhpcyksIGZhbHNlKTtcblxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGlzQ2xpY2tJbnNpZGUgPSB0aGlzLl90cmlnZ2VyLmNvbnRhaW5zKGV2ZW50LnRhcmdldCk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFpc0NsaWNrSW5zaWRlICYmIHRoaXMuaXNTaG93bigpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmhpZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0uYmluZCh0aGlzKSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnaG92ZXInOlxuICAgICAgICAgICAgICAgIHRoaXMuX3RyaWdnZXIuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VlbnRlcicsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2hvdygpO1xuICAgICAgICAgICAgICAgIH0uYmluZCh0aGlzKSwgZmFsc2UpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5fdHJpZ2dlci5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW91dCcsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBob3ZlcmluZ1RyaWdnZXIgPSBldmVudC50b0VsZW1lbnQgPT0gdGhpcy5fdHJpZ2dlciB8fCB0aGlzLl90cmlnZ2VyLmNvbnRhaW5zKGV2ZW50LnRvRWxlbWVudCk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBob3ZlcmluZ0Ryb3AgPSBldmVudC50b0VsZW1lbnQgPT0gdGhpcy5fZHJvcCB8fMKgdGhpcy5fZHJvcC5jb250YWlucyhldmVudC50b0VsZW1lbnQpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICghaG92ZXJpbmdUcmlnZ2VyICYmICFob3ZlcmluZ0Ryb3ApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaGlkZSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfS5iaW5kKHRoaXMpLCBmYWxzZSk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLl9kcm9wLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3V0JywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGhvdmVyaW5nVHJpZ2dlciA9IGV2ZW50LnRvRWxlbWVudCA9PSB0aGlzLl90cmlnZ2VyIHx8IHRoaXMuX3RyaWdnZXIuY29udGFpbnMoZXZlbnQudG9FbGVtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGhvdmVyaW5nRHJvcCA9IGV2ZW50LnRvRWxlbWVudCA9PSB0aGlzLl9kcm9wIHx8wqB0aGlzLl9kcm9wLmNvbnRhaW5zKGV2ZW50LnRvRWxlbWVudCk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFob3ZlcmluZ1RyaWdnZXIgJiYgIWhvdmVyaW5nRHJvcCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5oaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LmJpbmQodGhpcyksIGZhbHNlKTtcblxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgX2dlbmVyYXRlRXZlbnQobmFtZSkge1xuICAgICAgICBsZXQgZXZlbnQgPSBuZXcgRXZlbnQobmFtZSk7XG5cbiAgICAgICAgLy8gRGlzcGF0Y2ggdGhlIGV2ZW50LlxuICAgICAgICB0aGlzLl9kcm9wLmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuICAgIH1cblxuICAgIF90ZXRoZXJIb3Jpem9udGFsUG9zKGl0ZW0pIHtcbiAgICAgICAgY29uc29sZS5sb2coaXRlbSk7XG4gICAgICAgIGlmIChpdGVtLmF0dGFjaG1lbnQubGVmdCA9PSAncmlnaHQnICYmIGl0ZW0uYXR0YWNobWVudC50b3AgPT0gJ3RvcCcgJiYgaXRlbS50YXJnZXRBdHRhY2htZW50LmxlZnQgPT0gJ2xlZnQnICYmIGl0ZW0udGFyZ2V0QXR0YWNobWVudC50b3AgPT0gJ2JvdHRvbScpIHtcbiAgICAgICAgICAgIGNvbmZpZy5hdHRhY2htZW50ID0gJ3RvcCByaWdodCc7XG4gICAgICAgICAgICBjb25maWcudGFyZ2V0QXR0YWNobWVudCA9ICdib3R0b20gcmlnaHQnO1xuXG4gICAgICAgICAgICB0aGlzLl90ZXRoZXIuc2V0T3B0aW9ucyhjb25maWcsIGZhbHNlKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiJdfQ==
