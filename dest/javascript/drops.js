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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRyb3BzLmpzIl0sIm5hbWVzIjpbImlzT2JqZWN0IiwiaXRlbSIsIkFycmF5IiwiaXNBcnJheSIsIm1lcmdlRGVlcCIsInRhcmdldCIsInNvdXJjZSIsIm91dHB1dCIsIk9iamVjdCIsImFzc2lnbiIsImtleXMiLCJmb3JFYWNoIiwia2V5IiwiVHJvd2VsRHJvcHMiLCJlbGVtZW50cyIsImVsZW1lbnQiLCJlbGVtZW50X29iaiIsIlRyb3dlbERyb3AiLCJ0cmlnZ2VyIiwib3B0aW9ucyIsIndpbmRvdyIsIlRldGhlciIsInVuZGVmaW5lZCIsIkVycm9yIiwiX3RyaWdnZXIiLCJfZHJvcCIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvciIsImdldEF0dHJpYnV0ZSIsIl9vcHRpb25zIiwic2V0T3B0aW9ucyIsIl90ZXRoZXIiLCJnZXRUZXRoZXJPcHRpb25zIiwiX3Zpc2libGUiLCJ2aXNpYmxlIiwidHVyblZpc2liaWxpdHkiLCJzZXRHdXR0ZXJQb3NpdGlvbnMiLCJfbGlzdGVuZXIiLCJkZWZhdWx0T3B0aW9ucyIsImJlaGF2aW9yIiwicG9zaXRpb24iLCJmdWxsT3B0aW9ucyIsIm9wdGlvbiIsImRhdGFPcHRpb24iLCJnZXRQb3NpdGlvbnMiLCJwb3NZIiwicG9zWCIsImluY2x1ZGVzIiwic3BsaXQiLCJsZW5ndGgiLCJhdHRhY2htZW50WCIsImF0dGFjaG1lbnRZIiwidGFyZ2V0QXR0YWNobWVudFgiLCJ0YXJnZXRBdHRhY2htZW50WSIsImd1dHRlclgiLCJndXR0ZXJZIiwiY29uZmlnIiwiYXR0YWNobWVudCIsInRhcmdldEF0dGFjaG1lbnQiLCJzZXRBdHRyaWJ1dGUiLCJzdHlsZSIsImRpc3BsYXkiLCJfZ2VuZXJhdGVFdmVudCIsImFkZEV2ZW50TGlzdGVuZXIiLCJldmVudCIsInRvZ2dsZSIsImJpbmQiLCJpc0NsaWNrSW5zaWRlIiwiY29udGFpbnMiLCJpc1Nob3duIiwiaGlkZSIsInNob3ciLCJuYW1lIiwiRXZlbnQiLCJkaXNwYXRjaEV2ZW50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QUFMLENBQWN1QyxnQkFBZCxDQUErQixVQUEvQixFQUEyQyxVQUFTQyxLQUFULEVBQWdCO0FBQ3ZELHlCQUFLTSxJQUFMO0FBQ0gsaUJBRjBDLENBRXpDSixJQUZ5QyxDQUVwQyxJQUZvQyxDQUEzQyxFQUVjLEtBRmQ7QUFHSDtBQUNKOzs7dUNBRWNNLEksRUFBTTtBQUNqQixnQkFBSVIsUUFBUSxJQUFJUyxLQUFKLENBQVVELElBQVYsQ0FBWjs7QUFFQTtBQUNBLGlCQUFLL0MsS0FBTCxDQUFXaUQsYUFBWCxDQUF5QlYsS0FBekI7QUFDSDs7OzZDQUVvQi9ELEksRUFBTTtBQUN2QjBFLG9CQUFRQyxHQUFSLENBQVkzRSxJQUFaO0FBQ0EsZ0JBQUlBLEtBQUt3RCxVQUFMLENBQWdCb0IsSUFBaEIsSUFBd0IsT0FBeEIsSUFBbUM1RSxLQUFLd0QsVUFBTCxDQUFnQnFCLEdBQWhCLElBQXVCLEtBQTFELElBQW1FN0UsS0FBS3lELGdCQUFMLENBQXNCbUIsSUFBdEIsSUFBOEIsTUFBakcsSUFBMkc1RSxLQUFLeUQsZ0JBQUwsQ0FBc0JvQixHQUF0QixJQUE2QixRQUE1SSxFQUFzSjtBQUNsSnRCLHVCQUFPQyxVQUFQLEdBQW9CLFdBQXBCO0FBQ0FELHVCQUFPRSxnQkFBUCxHQUEwQixjQUExQjs7QUFFQSxxQkFBSzNCLE9BQUwsQ0FBYUQsVUFBYixDQUF3QjBCLE1BQXhCLEVBQWdDLEtBQWhDO0FBQ0g7QUFDSiIsImZpbGUiOiJkcm9wcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImxldCBpc09iamVjdCA9IGl0ZW0gPT4ge1xuICAgIHJldHVybiAoaXRlbSAmJiB0eXBlb2YgaXRlbSA9PT0gJ29iamVjdCcgJiYgIUFycmF5LmlzQXJyYXkoaXRlbSkgJiYgaXRlbSAhPT0gbnVsbCk7XG59XG5cbmxldCBtZXJnZURlZXAgPSAodGFyZ2V0LCBzb3VyY2UpID0+IHtcbiAgICBsZXQgb3V0cHV0ID0gT2JqZWN0LmFzc2lnbih7fSwgdGFyZ2V0KTtcblxuICAgIGlmIChpc09iamVjdCh0YXJnZXQpICYmIGlzT2JqZWN0KHNvdXJjZSkpIHtcbiAgICAgICAgT2JqZWN0LmtleXMoc291cmNlKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICAgICAgICBpZiAoaXNPYmplY3Qoc291cmNlW2tleV0pKSB7XG4gICAgICAgICAgICAgICAgaWYgKCEoa2V5IGluIHRhcmdldCkpXG4gICAgICAgICAgICAgICAgT2JqZWN0LmFzc2lnbihvdXRwdXQsIHsgW2tleV06IHNvdXJjZVtrZXldIH0pO1xuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBvdXRwdXRba2V5XSA9IG1lcmdlRGVlcCh0YXJnZXRba2V5XSwgc291cmNlW2tleV0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBPYmplY3QuYXNzaWduKG91dHB1dCwgeyBba2V5XTogc291cmNlW2tleV0gfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gb3V0cHV0O1xufVxuXG5jbGFzcyBUcm93ZWxEcm9wcyB7XG4gICAgY29uc3RydWN0b3IoZWxlbWVudHMpIHtcbiAgICAgICAgZm9yIChsZXQgZWxlbWVudCBpbiBlbGVtZW50cykge1xuICAgICAgICAgICAgbGV0IGVsZW1lbnRfb2JqID0gbmV3IFRyb3dlbERyb3AoZWxlbWVudHNbZWxlbWVudF0pO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5jbGFzcyBUcm93ZWxEcm9wIHtcbiAgICBjb25zdHJ1Y3Rvcih0cmlnZ2VyLCBvcHRpb25zID0ge30pIHtcbiAgICAgICAgaWYgKHdpbmRvdy5UZXRoZXIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdCb290c3RyYXAgdG9vbHRpcHMgcmVxdWlyZSBUZXRoZXIgKGh0dHA6Ly90ZXRoZXIuaW8vKScpXG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mKHRyaWdnZXIpID09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICB0aGlzLl90cmlnZ2VyID0gdHJpZ2dlcjtcbiAgICAgICAgICAgIHRoaXMuX2Ryb3AgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRoaXMuX3RyaWdnZXIuZ2V0QXR0cmlidXRlKCdkYXRhLWhyZWYnKSk7XG4gICAgICAgICAgICB0aGlzLl9vcHRpb25zID0gdGhpcy5zZXRPcHRpb25zKG9wdGlvbnMpO1xuICAgICAgICAgICAgdGhpcy5fdGV0aGVyID0gbmV3IFRldGhlcih0aGlzLmdldFRldGhlck9wdGlvbnModGhpcy5fb3B0aW9ucykpO1xuICAgICAgICAgICAgdGhpcy5fdmlzaWJsZSA9IHRoaXMuX29wdGlvbnMudmlzaWJsZTtcbiAgICAgICAgICAgIHRoaXMudHVyblZpc2liaWxpdHkoKTtcbiAgICAgICAgICAgIHRoaXMuc2V0R3V0dGVyUG9zaXRpb25zKCk7XG4gICAgICAgICAgICB0aGlzLl9saXN0ZW5lcigpO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBzZXRPcHRpb25zKG9wdGlvbnMpIHtcbiAgICAgICAgY29uc3QgZGVmYXVsdE9wdGlvbnMgPSB7XG4gICAgICAgICAgICB2aXNpYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIGJlaGF2aW9yOiAnY2xpY2snLFxuICAgICAgICAgICAgcG9zaXRpb246ICdib3R0b21vdXQgbGVmdGluJyxcbiAgICAgICAgfTtcblxuICAgICAgICBsZXQgZnVsbE9wdGlvbnMgPSBtZXJnZURlZXAoZGVmYXVsdE9wdGlvbnMsIG9wdGlvbnMpO1xuXG4gICAgICAgIGZvciAobGV0IG9wdGlvbiBpbiBkZWZhdWx0T3B0aW9ucykge1xuICAgICAgICAgICAgY29uc3QgZGF0YU9wdGlvbiA9IHRoaXMuX3RyaWdnZXIuZ2V0QXR0cmlidXRlKGBkYXRhLSR7b3B0aW9ufWApO1xuXG4gICAgICAgICAgICBpZiAoZGF0YU9wdGlvbikge1xuICAgICAgICAgICAgICAgIGZ1bGxPcHRpb25zW29wdGlvbl0gPSBkYXRhT3B0aW9uO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cblxuICAgICAgICBjb25zdCB7IHBvc1ksIHBvc1ggfSA9IHRoaXMuZ2V0UG9zaXRpb25zKGZ1bGxPcHRpb25zKTtcblxuICAgICAgICBpZiAoIVsnY2xpY2snLCAnaG92ZXInXS5pbmNsdWRlcyhmdWxsT3B0aW9ucy5iZWhhdmlvcikpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVHJvd2VsIGRyb3BzIGJlaGF2aW9yIG9wdGlvbiBtdXN0IGJlIFxcJ2NsaWNrXFwnIG9yIFxcJ2hvdmVyXFwnJylcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChmdWxsT3B0aW9ucy5wb3NpdGlvbi5zcGxpdCgnICcpLmxlbmd0aCAhPSAyKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Ryb3dlbCBkcm9wcyBwb3NpdGlvbiBvcHRpb24gbXVzdCBiZSBhIHN0cmluZyB3aXRoaW4gdHdvIHdvcmRzIGRlc2NyaWJpbmcgWSAoXFwndG9wXFwnLCBcXCdtaWRkbGVcXCcgb3IgXFwnYm90dG9tXFwnKSBhbmQgWCAoXFwnbGVmdFxcJywgXFwnY2VudGVyXFwnIG9yIFxcJ3JpZ2h0XFwnKSBwb3NpdGlvbicpXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIVsndG9waW4nLCAndG9wb3V0JywgJ21pZGRsZScsICdib3R0b21pbicsICdib3R0b21vdXQnXS5pbmNsdWRlcyhwb3NZKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUcm93ZWwgZHJvcHMgcG9zaXRpb24gb3B0aW9uIGZpcnN0IHdvcmQgbXVzdCBiZSBcXCd0b3BpblxcJywgXFwndG9wb3V0XFwnLCBcXCdtaWRkbGVcXCcsIFxcJ2JvdHRvbWluXFwnIG9yIFxcJ2JvdHRvbW91dFxcJycpXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIVsnbGVmdGluJywgJ2xlZnRvdXQnLCAnY2VudGVyJywgJ3JpZ2h0aW4nLCAncmlnaHRvdXQnXS5pbmNsdWRlcyhwb3NYKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUcm93ZWwgZHJvcHMgcG9zaXRpb24gb3B0aW9uIHNlY29uZCB3b3JkIG11c3QgYmUgXFwnbGVmdGluXFwnLCBcXCdsZWZ0b3V0XFwnLCBcXCdjZW50ZXJcXCcsIFxcJ3JpZ2h0aW5cXCcgb3IgXFwncmlnaHRvdXRcXCcnKVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZ1bGxPcHRpb25zO1xuICAgIH1cblxuICAgIGdldFBvc2l0aW9ucyhvcHRpb25zKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBvcHRpb25zOiBvcHRpb25zLFxuICAgICAgICAgICAgcG9zWTogb3B0aW9ucy5wb3NpdGlvbi5zcGxpdCgnICcpWzBdLFxuICAgICAgICAgICAgcG9zWDogb3B0aW9ucy5wb3NpdGlvbi5zcGxpdCgnICcpWzFdLFxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0VGV0aGVyT3B0aW9ucyhvcHRpb25zKSB7XG4gICAgICAgIGNvbnN0IHsgcG9zWSwgcG9zWCB9ID0gdGhpcy5nZXRQb3NpdGlvbnMob3B0aW9ucyk7XG4gICAgICAgIGxldCBhdHRhY2htZW50WCwgYXR0YWNobWVudFksIHRhcmdldEF0dGFjaG1lbnRYLCB0YXJnZXRBdHRhY2htZW50WSwgZ3V0dGVyWCwgZ3V0dGVyWTtcblxuICAgICAgICBzd2l0Y2ggKHBvc1kpIHtcbiAgICAgICAgICAgIGNhc2UgJ3RvcG91dCc6XG4gICAgICAgICAgICAgICAgYXR0YWNobWVudFkgPSAnYm90dG9tJztcbiAgICAgICAgICAgICAgICB0YXJnZXRBdHRhY2htZW50WSA9ICd0b3AnO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAndG9waW4nOlxuICAgICAgICAgICAgICAgIGF0dGFjaG1lbnRZID0gJ3RvcCc7XG4gICAgICAgICAgICAgICAgdGFyZ2V0QXR0YWNobWVudFkgPSAndG9wJztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2JvdHRvbWluJzpcbiAgICAgICAgICAgICAgICBhdHRhY2htZW50WSA9ICdib3R0b20nO1xuICAgICAgICAgICAgICAgIHRhcmdldEF0dGFjaG1lbnRZID0gJ2JvdHRvbSc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdib3R0b21vdXQnOlxuICAgICAgICAgICAgICAgIGF0dGFjaG1lbnRZID0gJ3RvcCc7XG4gICAgICAgICAgICAgICAgdGFyZ2V0QXR0YWNobWVudFkgPSAnYm90dG9tJztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgYXR0YWNobWVudFkgPSAnY2VudGVyJztcbiAgICAgICAgICAgICAgICB0YXJnZXRBdHRhY2htZW50WSA9ICdjZW50ZXInO1xuICAgICAgICB9XG5cbiAgICAgICAgc3dpdGNoIChwb3NYKSB7XG4gICAgICAgICAgICBjYXNlICdsZWZ0b3V0JzpcbiAgICAgICAgICAgICAgICBhdHRhY2htZW50WCA9ICdyaWdodCc7XG4gICAgICAgICAgICAgICAgdGFyZ2V0QXR0YWNobWVudFggPSAnbGVmdCc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdsZWZ0aW4nOlxuICAgICAgICAgICAgICAgIGF0dGFjaG1lbnRYID0gJ2xlZnQnO1xuICAgICAgICAgICAgICAgIHRhcmdldEF0dGFjaG1lbnRYID0gJ2xlZnQnO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAncmlnaHRpbic6XG4gICAgICAgICAgICAgICAgYXR0YWNobWVudFggPSAncmlnaHQnO1xuICAgICAgICAgICAgICAgIHRhcmdldEF0dGFjaG1lbnRYID0gJ3JpZ2h0JztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ3JpZ2h0b3V0JzpcbiAgICAgICAgICAgICAgICBhdHRhY2htZW50WCA9ICdsZWZ0JztcbiAgICAgICAgICAgICAgICB0YXJnZXRBdHRhY2htZW50WCA9ICdyaWdodCc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGF0dGFjaG1lbnRYID0gJ2NlbnRlcic7XG4gICAgICAgICAgICAgICAgdGFyZ2V0QXR0YWNobWVudFggPSAnY2VudGVyJztcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBjb25maWcgPSB7XG4gICAgICAgICAgICBlbGVtZW50OiB0aGlzLl9kcm9wLFxuICAgICAgICAgICAgdGFyZ2V0OiB0aGlzLl90cmlnZ2VyLFxuICAgICAgICAgICAgYXR0YWNobWVudDogYCR7YXR0YWNobWVudFl9ICR7YXR0YWNobWVudFh9YCxcbiAgICAgICAgICAgIHRhcmdldEF0dGFjaG1lbnQ6IGAke3RhcmdldEF0dGFjaG1lbnRZfSAke3RhcmdldEF0dGFjaG1lbnRYfWAsXG4gICAgICAgIH07XG5cblxuICAgICAgICByZXR1cm4gY29uZmlnO1xuICAgIH1cblxuICAgIHNldEd1dHRlclBvc2l0aW9ucygpIHtcbiAgICAgICAgY29uc3QgeyBwb3NZLCBwb3NYIH0gPSB0aGlzLmdldFBvc2l0aW9ucyh0aGlzLl9vcHRpb25zKTtcbiAgICAgICAgbGV0IGd1dHRlclksIGd1dHRlclg7XG5cbiAgICAgICAgc3dpdGNoIChwb3NZKSB7XG4gICAgICAgICAgICBjYXNlICd0b3BvdXQnOlxuICAgICAgICAgICAgICAgIGd1dHRlclkgPSAnYm90dG9tJztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2JvdHRvbW91dCc6XG4gICAgICAgICAgICAgICAgZ3V0dGVyWSA9ICd0b3AnO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBndXR0ZXJZID0gJ25vbmUnO1xuICAgICAgICB9XG5cbiAgICAgICAgc3dpdGNoIChwb3NYKSB7XG4gICAgICAgICAgICBjYXNlICdsZWZ0b3V0JzpcbiAgICAgICAgICAgICAgICBndXR0ZXJYID0gJ3JpZ2h0JztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ3JpZ2h0b3V0JzpcbiAgICAgICAgICAgICAgICBndXR0ZXJYID0gJ2xlZnQnO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBndXR0ZXJYID0gJ25vbmUnO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fZHJvcC5zZXRBdHRyaWJ1dGUoJ2RhdGEtZ3V0dGVyJywgYCR7Z3V0dGVyWX0gJHtndXR0ZXJYfWApXG4gICAgfVxuXG4gICAgc2hvdygpIHtcbiAgICAgICAgdGhpcy5fdmlzaWJsZSA9IHRydWU7XG4gICAgICAgIHRoaXMudHVyblZpc2liaWxpdHkoKTtcbiAgICB9XG5cbiAgICBoaWRlKCkge1xuICAgICAgICB0aGlzLl92aXNpYmxlID0gZmFsc2U7XG4gICAgICAgIHRoaXMudHVyblZpc2liaWxpdHkoKTtcbiAgICB9XG5cbiAgICBpc1Nob3duKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZHJvcC5zdHlsZS5kaXNwbGF5ID09ICdibG9jayc7XG4gICAgfVxuXG4gICAgaXNIaWRkZW4oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9kcm9wLnN0eWxlLmRpc3BsYXkgPT0gJ25vbmUnO1xuICAgIH1cblxuICAgIHRvZ2dsZSgpIHtcbiAgICAgICAgdGhpcy5fdmlzaWJsZSA9ICF0aGlzLl92aXNpYmxlO1xuICAgICAgICB0aGlzLnR1cm5WaXNpYmlsaXR5KCk7XG4gICAgfVxuXG4gICAgdHVyblZpc2liaWxpdHkoKSB7XG4gICAgICAgIGlmICh0aGlzLl92aXNpYmxlKSB7XG4gICAgICAgICAgICB0aGlzLl9nZW5lcmF0ZUV2ZW50KCdzaG93LnRyb3dlbC5kcm9wcycpO1xuICAgICAgICAgICAgdGhpcy5fZHJvcC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgICAgICAgIHRoaXMuX2dlbmVyYXRlRXZlbnQoJ3Nob3duLnRyb3dlbC5kcm9wcycpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fZ2VuZXJhdGVFdmVudCgnaGlkZS50cm93ZWwuZHJvcHMnKTtcbiAgICAgICAgICAgIHRoaXMuX2Ryb3Auc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgICAgIHRoaXMuX2dlbmVyYXRlRXZlbnQoJ2Rpc3BsYXkudHJvd2VsLmRyb3BzJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBfbGlzdGVuZXIoKSB7XG4gICAgICAgIGlmICh0aGlzLl9vcHRpb25zLmJlaGF2aW9yID09ICdjbGljaycpIHtcbiAgICAgICAgICAgIHRoaXMuX3RyaWdnZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgICAgIHRoaXMudG9nZ2xlKCk7XG4gICAgICAgICAgICB9LmJpbmQodGhpcyksIGZhbHNlKTtcblxuICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgICAgIHZhciBpc0NsaWNrSW5zaWRlID0gdGhpcy5fdHJpZ2dlci5jb250YWlucyhldmVudC50YXJnZXQpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCFpc0NsaWNrSW5zaWRlICYmIHRoaXMuaXNTaG93bigpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaGlkZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0uYmluZCh0aGlzKSwgZmFsc2UpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fdHJpZ2dlci5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWVudGVyJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNob3coKTtcbiAgICAgICAgICAgIH0uYmluZCh0aGlzKSwgZmFsc2UpO1xuXG4gICAgICAgICAgICB0aGlzLl90cmlnZ2VyLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3V0JywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmhpZGUoKTtcbiAgICAgICAgICAgIH0uYmluZCh0aGlzKSwgZmFsc2UpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgX2dlbmVyYXRlRXZlbnQobmFtZSkge1xuICAgICAgICBsZXQgZXZlbnQgPSBuZXcgRXZlbnQobmFtZSk7XG5cbiAgICAgICAgLy8gRGlzcGF0Y2ggdGhlIGV2ZW50LlxuICAgICAgICB0aGlzLl9kcm9wLmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuICAgIH1cblxuICAgIF90ZXRoZXJIb3Jpem9udGFsUG9zKGl0ZW0pIHtcbiAgICAgICAgY29uc29sZS5sb2coaXRlbSk7XG4gICAgICAgIGlmIChpdGVtLmF0dGFjaG1lbnQubGVmdCA9PSAncmlnaHQnICYmIGl0ZW0uYXR0YWNobWVudC50b3AgPT0gJ3RvcCcgJiYgaXRlbS50YXJnZXRBdHRhY2htZW50LmxlZnQgPT0gJ2xlZnQnICYmIGl0ZW0udGFyZ2V0QXR0YWNobWVudC50b3AgPT0gJ2JvdHRvbScpIHtcbiAgICAgICAgICAgIGNvbmZpZy5hdHRhY2htZW50ID0gJ3RvcCByaWdodCc7XG4gICAgICAgICAgICBjb25maWcudGFyZ2V0QXR0YWNobWVudCA9ICdib3R0b20gcmlnaHQnO1xuXG4gICAgICAgICAgICB0aGlzLl90ZXRoZXIuc2V0T3B0aW9ucyhjb25maWcsIGZhbHNlKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiJdfQ==
