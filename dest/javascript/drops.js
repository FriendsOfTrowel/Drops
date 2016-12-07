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

    elements.forEach(function (element, index) {
        var element_obj = new TrowelDrop(element);
    });
};

var TrowelDrop = function () {
    function TrowelDrop(trigger) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        _classCallCheck(this, TrowelDrop);

        if (window.Tether === undefined) {
            throw new Error('Bootstrap tooltips require Tether (http://tether.io/)');
        }

        this._trigger = trigger;
        this._drop = document.querySelector(this._trigger.getAttribute('data-href'));
        this._options = this.setOptions(options);
        this._tether = new Tether(this.getTetherOptions(this._options));
        this._visible = this._options.visible;
        this.turnVisibility();
        this.setGutterPositions();
        this._listener();
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRyb3BzLmpzIl0sIm5hbWVzIjpbImlzT2JqZWN0IiwiaXRlbSIsIkFycmF5IiwiaXNBcnJheSIsIm1lcmdlRGVlcCIsInRhcmdldCIsInNvdXJjZSIsIm91dHB1dCIsIk9iamVjdCIsImFzc2lnbiIsImtleXMiLCJmb3JFYWNoIiwia2V5IiwiVHJvd2VsRHJvcHMiLCJlbGVtZW50cyIsImVsZW1lbnQiLCJpbmRleCIsImVsZW1lbnRfb2JqIiwiVHJvd2VsRHJvcCIsInRyaWdnZXIiLCJvcHRpb25zIiwid2luZG93IiwiVGV0aGVyIiwidW5kZWZpbmVkIiwiRXJyb3IiLCJfdHJpZ2dlciIsIl9kcm9wIiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwiZ2V0QXR0cmlidXRlIiwiX29wdGlvbnMiLCJzZXRPcHRpb25zIiwiX3RldGhlciIsImdldFRldGhlck9wdGlvbnMiLCJfdmlzaWJsZSIsInZpc2libGUiLCJ0dXJuVmlzaWJpbGl0eSIsInNldEd1dHRlclBvc2l0aW9ucyIsIl9saXN0ZW5lciIsImRlZmF1bHRPcHRpb25zIiwiYmVoYXZpb3IiLCJwb3NpdGlvbiIsImZ1bGxPcHRpb25zIiwib3B0aW9uIiwiZGF0YU9wdGlvbiIsImdldFBvc2l0aW9ucyIsInBvc1kiLCJwb3NYIiwiaW5jbHVkZXMiLCJzcGxpdCIsImxlbmd0aCIsImF0dGFjaG1lbnRYIiwiYXR0YWNobWVudFkiLCJ0YXJnZXRBdHRhY2htZW50WCIsInRhcmdldEF0dGFjaG1lbnRZIiwiZ3V0dGVyWCIsImd1dHRlclkiLCJjb25maWciLCJhdHRhY2htZW50IiwidGFyZ2V0QXR0YWNobWVudCIsInNldEF0dHJpYnV0ZSIsInN0eWxlIiwiZGlzcGxheSIsIl9nZW5lcmF0ZUV2ZW50IiwiYWRkRXZlbnRMaXN0ZW5lciIsImV2ZW50IiwidG9nZ2xlIiwiYmluZCIsImlzQ2xpY2tJbnNpZGUiLCJjb250YWlucyIsImlzU2hvd24iLCJoaWRlIiwic2hvdyIsIm5hbWUiLCJFdmVudCIsImRpc3BhdGNoRXZlbnQiLCJjb25zb2xlIiwibG9nIiwibGVmdCIsInRvcCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLElBQUlBLFdBQVcsU0FBWEEsUUFBVyxPQUFRO0FBQ25CLFdBQVFDLFFBQVEsUUFBT0EsSUFBUCx5Q0FBT0EsSUFBUCxPQUFnQixRQUF4QixJQUFvQyxDQUFDQyxNQUFNQyxPQUFOLENBQWNGLElBQWQsQ0FBckMsSUFBNERBLFNBQVMsSUFBN0U7QUFDSCxDQUZEOztBQUlBLElBQUlHLFlBQVksU0FBWkEsU0FBWSxDQUFDQyxNQUFELEVBQVNDLE1BQVQsRUFBb0I7QUFDaEMsUUFBSUMsU0FBU0MsT0FBT0MsTUFBUCxDQUFjLEVBQWQsRUFBa0JKLE1BQWxCLENBQWI7O0FBRUEsUUFBSUwsU0FBU0ssTUFBVCxLQUFvQkwsU0FBU00sTUFBVCxDQUF4QixFQUEwQztBQUN0Q0UsZUFBT0UsSUFBUCxDQUFZSixNQUFaLEVBQW9CSyxPQUFwQixDQUE0QixlQUFPO0FBQy9CLGdCQUFJWCxTQUFTTSxPQUFPTSxHQUFQLENBQVQsQ0FBSixFQUEyQjtBQUN2QixvQkFBSSxFQUFFQSxPQUFPUCxNQUFULENBQUosRUFDQUcsT0FBT0MsTUFBUCxDQUFjRixNQUFkLHNCQUF5QkssR0FBekIsRUFBK0JOLE9BQU9NLEdBQVAsQ0FBL0IsR0FEQSxLQUdBTCxPQUFPSyxHQUFQLElBQWNSLFVBQVVDLE9BQU9PLEdBQVAsQ0FBVixFQUF1Qk4sT0FBT00sR0FBUCxDQUF2QixDQUFkO0FBQ0gsYUFMRCxNQUtPO0FBQ0hKLHVCQUFPQyxNQUFQLENBQWNGLE1BQWQsc0JBQXlCSyxHQUF6QixFQUErQk4sT0FBT00sR0FBUCxDQUEvQjtBQUNIO0FBQ0osU0FURDtBQVVIO0FBQ0QsV0FBT0wsTUFBUDtBQUNILENBaEJEOztJQWtCTU0sVyxHQUNGLHFCQUFZQyxRQUFaLEVBQXNCO0FBQUE7O0FBQ2xCQSxhQUFTSCxPQUFULENBQWlCLFVBQVNJLE9BQVQsRUFBa0JDLEtBQWxCLEVBQXlCO0FBQ3RDLFlBQUlDLGNBQWMsSUFBSUMsVUFBSixDQUFlSCxPQUFmLENBQWxCO0FBQ0gsS0FGRDtBQUdILEM7O0lBR0NHLFU7QUFDRix3QkFBWUMsT0FBWixFQUFtQztBQUFBLFlBQWRDLE9BQWMsdUVBQUosRUFBSTs7QUFBQTs7QUFDL0IsWUFBSUMsT0FBT0MsTUFBUCxLQUFrQkMsU0FBdEIsRUFBaUM7QUFDN0Isa0JBQU0sSUFBSUMsS0FBSixDQUFVLHVEQUFWLENBQU47QUFDSDs7QUFFRCxhQUFLQyxRQUFMLEdBQWdCTixPQUFoQjtBQUNBLGFBQUtPLEtBQUwsR0FBYUMsU0FBU0MsYUFBVCxDQUF1QixLQUFLSCxRQUFMLENBQWNJLFlBQWQsQ0FBMkIsV0FBM0IsQ0FBdkIsQ0FBYjtBQUNBLGFBQUtDLFFBQUwsR0FBZ0IsS0FBS0MsVUFBTCxDQUFnQlgsT0FBaEIsQ0FBaEI7QUFDQSxhQUFLWSxPQUFMLEdBQWUsSUFBSVYsTUFBSixDQUFXLEtBQUtXLGdCQUFMLENBQXNCLEtBQUtILFFBQTNCLENBQVgsQ0FBZjtBQUNBLGFBQUtJLFFBQUwsR0FBZ0IsS0FBS0osUUFBTCxDQUFjSyxPQUE5QjtBQUNBLGFBQUtDLGNBQUw7QUFDQSxhQUFLQyxrQkFBTDtBQUNBLGFBQUtDLFNBQUw7QUFDSDs7OzttQ0FFVWxCLE8sRUFBUztBQUNoQixnQkFBTW1CLGlCQUFpQjtBQUNuQkoseUJBQVMsS0FEVTtBQUVuQkssMEJBQVUsT0FGUztBQUduQkMsMEJBQVU7QUFIUyxhQUF2Qjs7QUFNQSxnQkFBSUMsY0FBY3RDLFVBQVVtQyxjQUFWLEVBQTBCbkIsT0FBMUIsQ0FBbEI7O0FBRUEsaUJBQUssSUFBSXVCLE1BQVQsSUFBbUJKLGNBQW5CLEVBQW1DO0FBQy9CLG9CQUFNSyxhQUFhLEtBQUtuQixRQUFMLENBQWNJLFlBQWQsV0FBbUNjLE1BQW5DLENBQW5COztBQUVBLG9CQUFJQyxVQUFKLEVBQWdCO0FBQ1pGLGdDQUFZQyxNQUFaLElBQXNCQyxVQUF0QjtBQUNIO0FBQ0o7O0FBZmUsZ0NBa0JPLEtBQUtDLFlBQUwsQ0FBa0JILFdBQWxCLENBbEJQO0FBQUEsZ0JBa0JSSSxJQWxCUSxpQkFrQlJBLElBbEJRO0FBQUEsZ0JBa0JGQyxJQWxCRSxpQkFrQkZBLElBbEJFOztBQW9CaEIsZ0JBQUksQ0FBQyxDQUFDLE9BQUQsRUFBVSxPQUFWLEVBQW1CQyxRQUFuQixDQUE0Qk4sWUFBWUYsUUFBeEMsQ0FBTCxFQUF3RDtBQUNwRCxzQkFBTSxJQUFJaEIsS0FBSixDQUFVLDZEQUFWLENBQU47QUFDSDs7QUFFRCxnQkFBSWtCLFlBQVlELFFBQVosQ0FBcUJRLEtBQXJCLENBQTJCLEdBQTNCLEVBQWdDQyxNQUFoQyxJQUEwQyxDQUE5QyxFQUFpRDtBQUM3QyxzQkFBTSxJQUFJMUIsS0FBSixDQUFVLG9LQUFWLENBQU47QUFDSDs7QUFFRCxnQkFBSSxDQUFDLENBQUMsT0FBRCxFQUFVLFFBQVYsRUFBb0IsUUFBcEIsRUFBOEIsVUFBOUIsRUFBMEMsV0FBMUMsRUFBdUR3QixRQUF2RCxDQUFnRUYsSUFBaEUsQ0FBTCxFQUE0RTtBQUN4RSxzQkFBTSxJQUFJdEIsS0FBSixDQUFVLGtIQUFWLENBQU47QUFDSDs7QUFFRCxnQkFBSSxDQUFDLENBQUMsUUFBRCxFQUFXLFNBQVgsRUFBc0IsUUFBdEIsRUFBZ0MsU0FBaEMsRUFBMkMsVUFBM0MsRUFBdUR3QixRQUF2RCxDQUFnRUQsSUFBaEUsQ0FBTCxFQUE0RTtBQUN4RSxzQkFBTSxJQUFJdkIsS0FBSixDQUFVLG1IQUFWLENBQU47QUFDSDs7QUFFRCxtQkFBT2tCLFdBQVA7QUFDSDs7O3FDQUVZdEIsTyxFQUFTO0FBQ2xCLG1CQUFPO0FBQ0hBLHlCQUFTQSxPQUROO0FBRUgwQixzQkFBTTFCLFFBQVFxQixRQUFSLENBQWlCUSxLQUFqQixDQUF1QixHQUF2QixFQUE0QixDQUE1QixDQUZIO0FBR0hGLHNCQUFNM0IsUUFBUXFCLFFBQVIsQ0FBaUJRLEtBQWpCLENBQXVCLEdBQXZCLEVBQTRCLENBQTVCO0FBSEgsYUFBUDtBQUtIOzs7eUNBRWdCN0IsTyxFQUFTO0FBQUEsaUNBQ0MsS0FBS3lCLFlBQUwsQ0FBa0J6QixPQUFsQixDQUREO0FBQUEsZ0JBQ2QwQixJQURjLGtCQUNkQSxJQURjO0FBQUEsZ0JBQ1JDLElBRFEsa0JBQ1JBLElBRFE7O0FBRXRCLGdCQUFJSSxvQkFBSjtBQUFBLGdCQUFpQkMsb0JBQWpCO0FBQUEsZ0JBQThCQywwQkFBOUI7QUFBQSxnQkFBaURDLDBCQUFqRDtBQUFBLGdCQUFvRUMsZ0JBQXBFO0FBQUEsZ0JBQTZFQyxnQkFBN0U7O0FBRUEsb0JBQVFWLElBQVI7QUFDSSxxQkFBSyxRQUFMO0FBQ0lNLGtDQUFjLFFBQWQ7QUFDQUUsd0NBQW9CLEtBQXBCO0FBQ0E7QUFDSixxQkFBSyxPQUFMO0FBQ0lGLGtDQUFjLEtBQWQ7QUFDQUUsd0NBQW9CLEtBQXBCO0FBQ0E7QUFDSixxQkFBSyxVQUFMO0FBQ0lGLGtDQUFjLFFBQWQ7QUFDQUUsd0NBQW9CLFFBQXBCO0FBQ0E7QUFDSixxQkFBSyxXQUFMO0FBQ0lGLGtDQUFjLEtBQWQ7QUFDQUUsd0NBQW9CLFFBQXBCO0FBQ0E7QUFDSjtBQUNJRixrQ0FBYyxRQUFkO0FBQ0FFLHdDQUFvQixRQUFwQjtBQW5CUjs7QUFzQkEsb0JBQVFQLElBQVI7QUFDSSxxQkFBSyxTQUFMO0FBQ0lJLGtDQUFjLE9BQWQ7QUFDQUUsd0NBQW9CLE1BQXBCO0FBQ0E7QUFDSixxQkFBSyxRQUFMO0FBQ0lGLGtDQUFjLE1BQWQ7QUFDQUUsd0NBQW9CLE1BQXBCO0FBQ0E7QUFDSixxQkFBSyxTQUFMO0FBQ0lGLGtDQUFjLE9BQWQ7QUFDQUUsd0NBQW9CLE9BQXBCO0FBQ0E7QUFDSixxQkFBSyxVQUFMO0FBQ0lGLGtDQUFjLE1BQWQ7QUFDQUUsd0NBQW9CLE9BQXBCO0FBQ0E7QUFDSjtBQUNJRixrQ0FBYyxRQUFkO0FBQ0FFLHdDQUFvQixRQUFwQjtBQW5CUjs7QUFzQkEsZ0JBQUlJLFNBQVM7QUFDVDFDLHlCQUFTLEtBQUtXLEtBREw7QUFFVHJCLHdCQUFRLEtBQUtvQixRQUZKO0FBR1RpQyw0QkFBZU4sV0FBZixTQUE4QkQsV0FIckI7QUFJVFEsa0NBQXFCTCxpQkFBckIsU0FBMENEO0FBSmpDLGFBQWI7O0FBUUEsbUJBQU9JLE1BQVA7QUFDSDs7OzZDQUVvQjtBQUFBLGlDQUNNLEtBQUtaLFlBQUwsQ0FBa0IsS0FBS2YsUUFBdkIsQ0FETjtBQUFBLGdCQUNUZ0IsSUFEUyxrQkFDVEEsSUFEUztBQUFBLGdCQUNIQyxJQURHLGtCQUNIQSxJQURHOztBQUVqQixnQkFBSVMsZ0JBQUo7QUFBQSxnQkFBYUQsZ0JBQWI7O0FBRUEsb0JBQVFULElBQVI7QUFDSSxxQkFBSyxRQUFMO0FBQ0lVLDhCQUFVLFFBQVY7QUFDQTtBQUNKLHFCQUFLLFdBQUw7QUFDSUEsOEJBQVUsS0FBVjtBQUNBO0FBQ0o7QUFDSUEsOEJBQVUsTUFBVjtBQVJSOztBQVdBLG9CQUFRVCxJQUFSO0FBQ0kscUJBQUssU0FBTDtBQUNJUSw4QkFBVSxPQUFWO0FBQ0E7QUFDSixxQkFBSyxVQUFMO0FBQ0lBLDhCQUFVLE1BQVY7QUFDQTtBQUNKO0FBQ0lBLDhCQUFVLE1BQVY7QUFSUjs7QUFXQSxpQkFBSzdCLEtBQUwsQ0FBV2tDLFlBQVgsQ0FBd0IsYUFBeEIsRUFBMENKLE9BQTFDLFNBQXFERCxPQUFyRDtBQUNIOzs7K0JBRU07QUFDSCxpQkFBS3JCLFFBQUwsR0FBZ0IsSUFBaEI7QUFDQSxpQkFBS0UsY0FBTDtBQUNIOzs7K0JBRU07QUFDSCxpQkFBS0YsUUFBTCxHQUFnQixLQUFoQjtBQUNBLGlCQUFLRSxjQUFMO0FBQ0g7OztrQ0FFUztBQUNOLG1CQUFPLEtBQUtWLEtBQUwsQ0FBV21DLEtBQVgsQ0FBaUJDLE9BQWpCLElBQTRCLE9BQW5DO0FBQ0g7OzttQ0FFVTtBQUNQLG1CQUFPLEtBQUtwQyxLQUFMLENBQVdtQyxLQUFYLENBQWlCQyxPQUFqQixJQUE0QixNQUFuQztBQUNIOzs7aUNBRVE7QUFDTCxpQkFBSzVCLFFBQUwsR0FBZ0IsQ0FBQyxLQUFLQSxRQUF0QjtBQUNBLGlCQUFLRSxjQUFMO0FBQ0g7Ozt5Q0FFZ0I7QUFDYixnQkFBSSxLQUFLRixRQUFULEVBQW1CO0FBQ2YscUJBQUs2QixjQUFMLENBQW9CLG1CQUFwQjtBQUNBLHFCQUFLckMsS0FBTCxDQUFXbUMsS0FBWCxDQUFpQkMsT0FBakIsR0FBMkIsT0FBM0I7QUFDQSxxQkFBS0MsY0FBTCxDQUFvQixvQkFBcEI7QUFDSCxhQUpELE1BSU87QUFDSCxxQkFBS0EsY0FBTCxDQUFvQixtQkFBcEI7QUFDQSxxQkFBS3JDLEtBQUwsQ0FBV21DLEtBQVgsQ0FBaUJDLE9BQWpCLEdBQTJCLE1BQTNCO0FBQ0EscUJBQUtDLGNBQUwsQ0FBb0Isc0JBQXBCO0FBQ0g7QUFDSjs7O29DQUVXO0FBQ1IsZ0JBQUksS0FBS2pDLFFBQUwsQ0FBY1UsUUFBZCxJQUEwQixPQUE5QixFQUF1QztBQUNuQyxxQkFBS2YsUUFBTCxDQUFjdUMsZ0JBQWQsQ0FBK0IsT0FBL0IsRUFBd0MsVUFBU0MsS0FBVCxFQUFnQjtBQUNwRCx5QkFBS0MsTUFBTDtBQUNILGlCQUZ1QyxDQUV0Q0MsSUFGc0MsQ0FFakMsSUFGaUMsQ0FBeEMsRUFFYyxLQUZkOztBQUlBeEMseUJBQVNxQyxnQkFBVCxDQUEwQixPQUExQixFQUFtQyxVQUFTQyxLQUFULEVBQWdCO0FBQy9DLHdCQUFJRyxnQkFBZ0IsS0FBSzNDLFFBQUwsQ0FBYzRDLFFBQWQsQ0FBdUJKLE1BQU01RCxNQUE3QixDQUFwQjs7QUFFQSx3QkFBSSxDQUFDK0QsYUFBRCxJQUFrQixLQUFLRSxPQUFMLEVBQXRCLEVBQXNDO0FBQ2xDLDZCQUFLQyxJQUFMO0FBQ0g7QUFDSixpQkFOa0MsQ0FNakNKLElBTmlDLENBTTVCLElBTjRCLENBQW5DLEVBTWMsS0FOZDtBQU9ILGFBWkQsTUFZTztBQUNILHFCQUFLMUMsUUFBTCxDQUFjdUMsZ0JBQWQsQ0FBK0IsWUFBL0IsRUFBNkMsVUFBU0MsS0FBVCxFQUFnQjtBQUN6RCx5QkFBS08sSUFBTDtBQUNILGlCQUY0QyxDQUUzQ0wsSUFGMkMsQ0FFdEMsSUFGc0MsQ0FBN0MsRUFFYyxLQUZkOztBQUlBLHFCQUFLMUMsUUFBTCxDQUFjdUMsZ0JBQWQsQ0FBK0IsVUFBL0IsRUFBMkMsVUFBU0MsS0FBVCxFQUFnQjtBQUN2RCx5QkFBS00sSUFBTDtBQUNILGlCQUYwQyxDQUV6Q0osSUFGeUMsQ0FFcEMsSUFGb0MsQ0FBM0MsRUFFYyxLQUZkO0FBR0g7QUFDSjs7O3VDQUVjTSxJLEVBQU07QUFDakIsZ0JBQUlSLFFBQVEsSUFBSVMsS0FBSixDQUFVRCxJQUFWLENBQVo7O0FBRUE7QUFDQSxpQkFBSy9DLEtBQUwsQ0FBV2lELGFBQVgsQ0FBeUJWLEtBQXpCO0FBQ0g7Ozs2Q0FFb0JoRSxJLEVBQU07QUFDdkIyRSxvQkFBUUMsR0FBUixDQUFZNUUsSUFBWjtBQUNBLGdCQUFJQSxLQUFLeUQsVUFBTCxDQUFnQm9CLElBQWhCLElBQXdCLE9BQXhCLElBQW1DN0UsS0FBS3lELFVBQUwsQ0FBZ0JxQixHQUFoQixJQUF1QixLQUExRCxJQUFtRTlFLEtBQUswRCxnQkFBTCxDQUFzQm1CLElBQXRCLElBQThCLE1BQWpHLElBQTJHN0UsS0FBSzBELGdCQUFMLENBQXNCb0IsR0FBdEIsSUFBNkIsUUFBNUksRUFBc0o7QUFDbEp0Qix1QkFBT0MsVUFBUCxHQUFvQixXQUFwQjtBQUNBRCx1QkFBT0UsZ0JBQVAsR0FBMEIsY0FBMUI7O0FBRUEscUJBQUszQixPQUFMLENBQWFELFVBQWIsQ0FBd0IwQixNQUF4QixFQUFnQyxLQUFoQztBQUNIO0FBQ0oiLCJmaWxlIjoiZHJvcHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJsZXQgaXNPYmplY3QgPSBpdGVtID0+IHtcbiAgICByZXR1cm4gKGl0ZW0gJiYgdHlwZW9mIGl0ZW0gPT09ICdvYmplY3QnICYmICFBcnJheS5pc0FycmF5KGl0ZW0pICYmIGl0ZW0gIT09IG51bGwpO1xufVxuXG5sZXQgbWVyZ2VEZWVwID0gKHRhcmdldCwgc291cmNlKSA9PiB7XG4gICAgbGV0IG91dHB1dCA9IE9iamVjdC5hc3NpZ24oe30sIHRhcmdldCk7XG5cbiAgICBpZiAoaXNPYmplY3QodGFyZ2V0KSAmJiBpc09iamVjdChzb3VyY2UpKSB7XG4gICAgICAgIE9iamVjdC5rZXlzKHNvdXJjZSkuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgICAgICAgaWYgKGlzT2JqZWN0KHNvdXJjZVtrZXldKSkge1xuICAgICAgICAgICAgICAgIGlmICghKGtleSBpbiB0YXJnZXQpKVxuICAgICAgICAgICAgICAgIE9iamVjdC5hc3NpZ24ob3V0cHV0LCB7IFtrZXldOiBzb3VyY2Vba2V5XSB9KTtcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgb3V0cHV0W2tleV0gPSBtZXJnZURlZXAodGFyZ2V0W2tleV0sIHNvdXJjZVtrZXldKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgT2JqZWN0LmFzc2lnbihvdXRwdXQsIHsgW2tleV06IHNvdXJjZVtrZXldIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIG91dHB1dDtcbn1cblxuY2xhc3MgVHJvd2VsRHJvcHMge1xuICAgIGNvbnN0cnVjdG9yKGVsZW1lbnRzKSB7XG4gICAgICAgIGVsZW1lbnRzLmZvckVhY2goZnVuY3Rpb24oZWxlbWVudCwgaW5kZXgpIHtcbiAgICAgICAgICAgIGxldCBlbGVtZW50X29iaiA9IG5ldyBUcm93ZWxEcm9wKGVsZW1lbnQpO1xuICAgICAgICB9KVxuICAgIH1cbn1cblxuY2xhc3MgVHJvd2VsRHJvcCB7XG4gICAgY29uc3RydWN0b3IodHJpZ2dlciwgb3B0aW9ucyA9IHt9KSB7XG4gICAgICAgIGlmICh3aW5kb3cuVGV0aGVyID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQm9vdHN0cmFwIHRvb2x0aXBzIHJlcXVpcmUgVGV0aGVyIChodHRwOi8vdGV0aGVyLmlvLyknKVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fdHJpZ2dlciA9IHRyaWdnZXI7XG4gICAgICAgIHRoaXMuX2Ryb3AgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRoaXMuX3RyaWdnZXIuZ2V0QXR0cmlidXRlKCdkYXRhLWhyZWYnKSk7XG4gICAgICAgIHRoaXMuX29wdGlvbnMgPSB0aGlzLnNldE9wdGlvbnMob3B0aW9ucyk7XG4gICAgICAgIHRoaXMuX3RldGhlciA9IG5ldyBUZXRoZXIodGhpcy5nZXRUZXRoZXJPcHRpb25zKHRoaXMuX29wdGlvbnMpKTtcbiAgICAgICAgdGhpcy5fdmlzaWJsZSA9IHRoaXMuX29wdGlvbnMudmlzaWJsZTtcbiAgICAgICAgdGhpcy50dXJuVmlzaWJpbGl0eSgpO1xuICAgICAgICB0aGlzLnNldEd1dHRlclBvc2l0aW9ucygpO1xuICAgICAgICB0aGlzLl9saXN0ZW5lcigpO1xuICAgIH1cblxuICAgIHNldE9wdGlvbnMob3B0aW9ucykge1xuICAgICAgICBjb25zdCBkZWZhdWx0T3B0aW9ucyA9IHtcbiAgICAgICAgICAgIHZpc2libGU6IGZhbHNlLFxuICAgICAgICAgICAgYmVoYXZpb3I6ICdjbGljaycsXG4gICAgICAgICAgICBwb3NpdGlvbjogJ2JvdHRvbW91dCBsZWZ0aW4nLFxuICAgICAgICB9O1xuXG4gICAgICAgIGxldCBmdWxsT3B0aW9ucyA9IG1lcmdlRGVlcChkZWZhdWx0T3B0aW9ucywgb3B0aW9ucyk7XG5cbiAgICAgICAgZm9yIChsZXQgb3B0aW9uIGluIGRlZmF1bHRPcHRpb25zKSB7XG4gICAgICAgICAgICBjb25zdCBkYXRhT3B0aW9uID0gdGhpcy5fdHJpZ2dlci5nZXRBdHRyaWJ1dGUoYGRhdGEtJHtvcHRpb259YCk7XG5cbiAgICAgICAgICAgIGlmIChkYXRhT3B0aW9uKSB7XG4gICAgICAgICAgICAgICAgZnVsbE9wdGlvbnNbb3B0aW9uXSA9IGRhdGFPcHRpb247XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuXG4gICAgICAgIGNvbnN0IHsgcG9zWSwgcG9zWCB9ID0gdGhpcy5nZXRQb3NpdGlvbnMoZnVsbE9wdGlvbnMpO1xuXG4gICAgICAgIGlmICghWydjbGljaycsICdob3ZlciddLmluY2x1ZGVzKGZ1bGxPcHRpb25zLmJlaGF2aW9yKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUcm93ZWwgZHJvcHMgYmVoYXZpb3Igb3B0aW9uIG11c3QgYmUgXFwnY2xpY2tcXCcgb3IgXFwnaG92ZXJcXCcnKVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGZ1bGxPcHRpb25zLnBvc2l0aW9uLnNwbGl0KCcgJykubGVuZ3RoICE9IDIpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVHJvd2VsIGRyb3BzIHBvc2l0aW9uIG9wdGlvbiBtdXN0IGJlIGEgc3RyaW5nIHdpdGhpbiB0d28gd29yZHMgZGVzY3JpYmluZyBZIChcXCd0b3BcXCcsIFxcJ21pZGRsZVxcJyBvciBcXCdib3R0b21cXCcpIGFuZCBYIChcXCdsZWZ0XFwnLCBcXCdjZW50ZXJcXCcgb3IgXFwncmlnaHRcXCcpIHBvc2l0aW9uJylcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghWyd0b3BpbicsICd0b3BvdXQnLCAnbWlkZGxlJywgJ2JvdHRvbWluJywgJ2JvdHRvbW91dCddLmluY2x1ZGVzKHBvc1kpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Ryb3dlbCBkcm9wcyBwb3NpdGlvbiBvcHRpb24gZmlyc3Qgd29yZCBtdXN0IGJlIFxcJ3RvcGluXFwnLCBcXCd0b3BvdXRcXCcsIFxcJ21pZGRsZVxcJywgXFwnYm90dG9taW5cXCcgb3IgXFwnYm90dG9tb3V0XFwnJylcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghWydsZWZ0aW4nLCAnbGVmdG91dCcsICdjZW50ZXInLCAncmlnaHRpbicsICdyaWdodG91dCddLmluY2x1ZGVzKHBvc1gpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Ryb3dlbCBkcm9wcyBwb3NpdGlvbiBvcHRpb24gc2Vjb25kIHdvcmQgbXVzdCBiZSBcXCdsZWZ0aW5cXCcsIFxcJ2xlZnRvdXRcXCcsIFxcJ2NlbnRlclxcJywgXFwncmlnaHRpblxcJyBvciBcXCdyaWdodG91dFxcJycpXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZnVsbE9wdGlvbnM7XG4gICAgfVxuXG4gICAgZ2V0UG9zaXRpb25zKG9wdGlvbnMpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG9wdGlvbnM6IG9wdGlvbnMsXG4gICAgICAgICAgICBwb3NZOiBvcHRpb25zLnBvc2l0aW9uLnNwbGl0KCcgJylbMF0sXG4gICAgICAgICAgICBwb3NYOiBvcHRpb25zLnBvc2l0aW9uLnNwbGl0KCcgJylbMV0sXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRUZXRoZXJPcHRpb25zKG9wdGlvbnMpIHtcbiAgICAgICAgY29uc3QgeyBwb3NZLCBwb3NYIH0gPSB0aGlzLmdldFBvc2l0aW9ucyhvcHRpb25zKTtcbiAgICAgICAgbGV0IGF0dGFjaG1lbnRYLCBhdHRhY2htZW50WSwgdGFyZ2V0QXR0YWNobWVudFgsIHRhcmdldEF0dGFjaG1lbnRZLCBndXR0ZXJYLCBndXR0ZXJZO1xuXG4gICAgICAgIHN3aXRjaCAocG9zWSkge1xuICAgICAgICAgICAgY2FzZSAndG9wb3V0JzpcbiAgICAgICAgICAgICAgICBhdHRhY2htZW50WSA9ICdib3R0b20nO1xuICAgICAgICAgICAgICAgIHRhcmdldEF0dGFjaG1lbnRZID0gJ3RvcCc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICd0b3Bpbic6XG4gICAgICAgICAgICAgICAgYXR0YWNobWVudFkgPSAndG9wJztcbiAgICAgICAgICAgICAgICB0YXJnZXRBdHRhY2htZW50WSA9ICd0b3AnO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnYm90dG9taW4nOlxuICAgICAgICAgICAgICAgIGF0dGFjaG1lbnRZID0gJ2JvdHRvbSc7XG4gICAgICAgICAgICAgICAgdGFyZ2V0QXR0YWNobWVudFkgPSAnYm90dG9tJztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2JvdHRvbW91dCc6XG4gICAgICAgICAgICAgICAgYXR0YWNobWVudFkgPSAndG9wJztcbiAgICAgICAgICAgICAgICB0YXJnZXRBdHRhY2htZW50WSA9ICdib3R0b20nO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBhdHRhY2htZW50WSA9ICdjZW50ZXInO1xuICAgICAgICAgICAgICAgIHRhcmdldEF0dGFjaG1lbnRZID0gJ2NlbnRlcic7XG4gICAgICAgIH1cblxuICAgICAgICBzd2l0Y2ggKHBvc1gpIHtcbiAgICAgICAgICAgIGNhc2UgJ2xlZnRvdXQnOlxuICAgICAgICAgICAgICAgIGF0dGFjaG1lbnRYID0gJ3JpZ2h0JztcbiAgICAgICAgICAgICAgICB0YXJnZXRBdHRhY2htZW50WCA9ICdsZWZ0JztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2xlZnRpbic6XG4gICAgICAgICAgICAgICAgYXR0YWNobWVudFggPSAnbGVmdCc7XG4gICAgICAgICAgICAgICAgdGFyZ2V0QXR0YWNobWVudFggPSAnbGVmdCc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdyaWdodGluJzpcbiAgICAgICAgICAgICAgICBhdHRhY2htZW50WCA9ICdyaWdodCc7XG4gICAgICAgICAgICAgICAgdGFyZ2V0QXR0YWNobWVudFggPSAncmlnaHQnO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAncmlnaHRvdXQnOlxuICAgICAgICAgICAgICAgIGF0dGFjaG1lbnRYID0gJ2xlZnQnO1xuICAgICAgICAgICAgICAgIHRhcmdldEF0dGFjaG1lbnRYID0gJ3JpZ2h0JztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgYXR0YWNobWVudFggPSAnY2VudGVyJztcbiAgICAgICAgICAgICAgICB0YXJnZXRBdHRhY2htZW50WCA9ICdjZW50ZXInO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGNvbmZpZyA9IHtcbiAgICAgICAgICAgIGVsZW1lbnQ6IHRoaXMuX2Ryb3AsXG4gICAgICAgICAgICB0YXJnZXQ6IHRoaXMuX3RyaWdnZXIsXG4gICAgICAgICAgICBhdHRhY2htZW50OiBgJHthdHRhY2htZW50WX0gJHthdHRhY2htZW50WH1gLFxuICAgICAgICAgICAgdGFyZ2V0QXR0YWNobWVudDogYCR7dGFyZ2V0QXR0YWNobWVudFl9ICR7dGFyZ2V0QXR0YWNobWVudFh9YCxcbiAgICAgICAgfTtcblxuXG4gICAgICAgIHJldHVybiBjb25maWc7XG4gICAgfVxuXG4gICAgc2V0R3V0dGVyUG9zaXRpb25zKCkge1xuICAgICAgICBjb25zdCB7IHBvc1ksIHBvc1ggfSA9IHRoaXMuZ2V0UG9zaXRpb25zKHRoaXMuX29wdGlvbnMpO1xuICAgICAgICBsZXQgZ3V0dGVyWSwgZ3V0dGVyWDtcblxuICAgICAgICBzd2l0Y2ggKHBvc1kpIHtcbiAgICAgICAgICAgIGNhc2UgJ3RvcG91dCc6XG4gICAgICAgICAgICAgICAgZ3V0dGVyWSA9ICdib3R0b20nO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnYm90dG9tb3V0JzpcbiAgICAgICAgICAgICAgICBndXR0ZXJZID0gJ3RvcCc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGd1dHRlclkgPSAnbm9uZSc7XG4gICAgICAgIH1cblxuICAgICAgICBzd2l0Y2ggKHBvc1gpIHtcbiAgICAgICAgICAgIGNhc2UgJ2xlZnRvdXQnOlxuICAgICAgICAgICAgICAgIGd1dHRlclggPSAncmlnaHQnO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAncmlnaHRvdXQnOlxuICAgICAgICAgICAgICAgIGd1dHRlclggPSAnbGVmdCc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGd1dHRlclggPSAnbm9uZSc7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9kcm9wLnNldEF0dHJpYnV0ZSgnZGF0YS1ndXR0ZXInLCBgJHtndXR0ZXJZfSAke2d1dHRlclh9YClcbiAgICB9XG5cbiAgICBzaG93KCkge1xuICAgICAgICB0aGlzLl92aXNpYmxlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy50dXJuVmlzaWJpbGl0eSgpO1xuICAgIH1cblxuICAgIGhpZGUoKSB7XG4gICAgICAgIHRoaXMuX3Zpc2libGUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy50dXJuVmlzaWJpbGl0eSgpO1xuICAgIH1cblxuICAgIGlzU2hvd24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9kcm9wLnN0eWxlLmRpc3BsYXkgPT0gJ2Jsb2NrJztcbiAgICB9XG5cbiAgICBpc0hpZGRlbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2Ryb3Auc3R5bGUuZGlzcGxheSA9PSAnbm9uZSc7XG4gICAgfVxuXG4gICAgdG9nZ2xlKCkge1xuICAgICAgICB0aGlzLl92aXNpYmxlID0gIXRoaXMuX3Zpc2libGU7XG4gICAgICAgIHRoaXMudHVyblZpc2liaWxpdHkoKTtcbiAgICB9XG5cbiAgICB0dXJuVmlzaWJpbGl0eSgpIHtcbiAgICAgICAgaWYgKHRoaXMuX3Zpc2libGUpIHtcbiAgICAgICAgICAgIHRoaXMuX2dlbmVyYXRlRXZlbnQoJ3Nob3cudHJvd2VsLmRyb3BzJyk7XG4gICAgICAgICAgICB0aGlzLl9kcm9wLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgICAgICAgdGhpcy5fZ2VuZXJhdGVFdmVudCgnc2hvd24udHJvd2VsLmRyb3BzJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9nZW5lcmF0ZUV2ZW50KCdoaWRlLnRyb3dlbC5kcm9wcycpO1xuICAgICAgICAgICAgdGhpcy5fZHJvcC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICAgICAgdGhpcy5fZ2VuZXJhdGVFdmVudCgnZGlzcGxheS50cm93ZWwuZHJvcHMnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIF9saXN0ZW5lcigpIHtcbiAgICAgICAgaWYgKHRoaXMuX29wdGlvbnMuYmVoYXZpb3IgPT0gJ2NsaWNrJykge1xuICAgICAgICAgICAgdGhpcy5fdHJpZ2dlci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgdGhpcy50b2dnbGUoKTtcbiAgICAgICAgICAgIH0uYmluZCh0aGlzKSwgZmFsc2UpO1xuXG4gICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgdmFyIGlzQ2xpY2tJbnNpZGUgPSB0aGlzLl90cmlnZ2VyLmNvbnRhaW5zKGV2ZW50LnRhcmdldCk7XG5cbiAgICAgICAgICAgICAgICBpZiAoIWlzQ2xpY2tJbnNpZGUgJiYgdGhpcy5pc1Nob3duKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5oaWRlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfS5iaW5kKHRoaXMpLCBmYWxzZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl90cmlnZ2VyLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZW50ZXInLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2hvdygpO1xuICAgICAgICAgICAgfS5iaW5kKHRoaXMpLCBmYWxzZSk7XG5cbiAgICAgICAgICAgIHRoaXMuX3RyaWdnZXIuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdXQnLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgICAgIHRoaXMuaGlkZSgpO1xuICAgICAgICAgICAgfS5iaW5kKHRoaXMpLCBmYWxzZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBfZ2VuZXJhdGVFdmVudChuYW1lKSB7XG4gICAgICAgIGxldCBldmVudCA9IG5ldyBFdmVudChuYW1lKTtcblxuICAgICAgICAvLyBEaXNwYXRjaCB0aGUgZXZlbnQuXG4gICAgICAgIHRoaXMuX2Ryb3AuZGlzcGF0Y2hFdmVudChldmVudCk7XG4gICAgfVxuXG4gICAgX3RldGhlckhvcml6b250YWxQb3MoaXRlbSkge1xuICAgICAgICBjb25zb2xlLmxvZyhpdGVtKTtcbiAgICAgICAgaWYgKGl0ZW0uYXR0YWNobWVudC5sZWZ0ID09ICdyaWdodCcgJiYgaXRlbS5hdHRhY2htZW50LnRvcCA9PSAndG9wJyAmJiBpdGVtLnRhcmdldEF0dGFjaG1lbnQubGVmdCA9PSAnbGVmdCcgJiYgaXRlbS50YXJnZXRBdHRhY2htZW50LnRvcCA9PSAnYm90dG9tJykge1xuICAgICAgICAgICAgY29uZmlnLmF0dGFjaG1lbnQgPSAndG9wIHJpZ2h0JztcbiAgICAgICAgICAgIGNvbmZpZy50YXJnZXRBdHRhY2htZW50ID0gJ2JvdHRvbSByaWdodCc7XG5cbiAgICAgICAgICAgIHRoaXMuX3RldGhlci5zZXRPcHRpb25zKGNvbmZpZywgZmFsc2UpO1xuICAgICAgICB9XG4gICAgfVxufVxuIl19
