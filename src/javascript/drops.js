export default class TrowelDrops {
  constructor(triggers) {
    triggers.forEach(function(trigger, index) {
      let trigger_obj = new TrowelDrop(trigger);
    })
  }
}

class TrowelDrop {
  constructor(trigger, customOptions = {}) {
    if (window.Tether === undefined) throw new Error('Trowel Drops require Tether (http://tether.io/)')

    this.trigger = trigger;
    this.drop = document.querySelector(this.trigger.getAttribute('data-href'));
    this.options = customOptions;
    this.tether = new Tether(this.tetherOptions);

    this.options.visible ? this.show() : this.hide();
    this.setGutterPositions();

    this.events = this.events();
    this.listener();
    this.element.dispatchEvent(this.events.mounted);
    return;
  }

  set options(customOptions) {
    const defaultOptions = {
      visible: false,
      behavior: 'click',
      position: 'bottomout leftin',
    };

    const options = Object.keys(defaultOptions).reduce((options, option) => {
      options[option] = defaultOptions[option];

      // 1st priority : data-options
      if (this.trigger.getAttribute(`data-${option}`)) {
        options[option] = this.trigger.getAttribute(`data-${option}`);

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

    const { posY, posX } = this.getPositions(options);

    if (!['click', 'hover'].includes(options.behavior)) {
      throw new Error('Trowel drops behavior option must be \'click\' or \'hover\'')
    }

    if (options.position.split(' ').length != 2) {
      throw new Error('Trowel drops position option must be a string within two words describing Y (\'top\', \'middle\' or \'bottom\') and X (\'left\', \'center\' or \'right\') position')
    }

    if (!['topin', 'topout', 'middle', 'bottomin', 'bottomout'].includes(posY)) {
      throw new Error('Trowel drops position option first word must be \'topin\', \'topout\', \'middle\', \'bottomin\' or \'bottomout\'')
    }

    if (!['leftin', 'leftout', 'center', 'rightin', 'rightout'].includes(posX)) {
      throw new Error('Trowel drops position option second word must be \'leftin\', \'leftout\', \'center\', \'rightin\' or \'rightout\'')
    }

    return this._options = options;
  }

  get options() {
    return this._options;
  }

  getPositions(options = this.options) {
    return {
      options: options,
      posY: options.position.split(' ')[0],
      posX: options.position.split(' ')[1],
    }
  }

  get tetherOptions() {
    const { posY, posX } = this.getPositions();
    let attachmentX, attachmentY, targetAttachmentX, targetAttachmentY, gutterX, gutterY;

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

    let config = {
      element: this.drop,
      target: this.trigger,
      attachment: `${attachmentY} ${attachmentX}`,
      targetAttachment: `${targetAttachmentY} ${targetAttachmentX}`,
    };


    return config;
  }

  setGutterPositions() {
    const { posY, posX } = this.getPositions();
    let gutterY, gutterX;

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

    this.drop.setAttribute('data-gutter', `${gutterY} ${gutterX}`)
  }

  get isVisible() {
    return this.drop.style.display == 'block';
  }

  show() {
    this.element.dispatchEvent(this.events.show);
    this.drop.style.display = 'block';
    this.element.dispatchEvent(this.events.shown);
    return;
  }

  hide() {
    this.element.dispatchEvent(this.events.hide);
    this.drop.style.display = 'none';
    this.element.dispatchEvent(this.events.hidden);
    return;
  }

  toggle() {
    this.element.dispatchEvent(this.events.toggle);
    this.isVisible ? this.hide() : this.show();
    this.element.dispatchEvent(this.events.toggled);
    return;
  }

  listener() {
    if (this.options.behavior == 'click') {
      this.trigger.addEventListener('click', this.toggle.bind(this));

      // hide the drop when you click outside
      document.addEventListener('click', function(event) {
        const isClickInside = this.trigger.contains(event.target) || this.drop.contains(event.target);
        if (!isClickInside && this.isVisible) this.hide();
        return;
      }.bind(this))

    } else if (this.options.behavior == 'hover') {
      this.trigger.addEventListener('mouseenter', this.show.bind(this));

      [this.trigger, this.drop].map(element => {
        element.addEventListener('mouseout', function(event) {
          const hovering = this.trigger.contains(event.toElement) || this.drop.contains(event.toElement);
          if (!hovering) this.hide();
          return;
        }.bind(this));
      })
    }
  }

  events() {
    const show = new Event('trowel.drop.show');
    const shown = new Event('trowel.drop.shown');
    const hide = new Event('trowel.drop.hide');
    const hidden = new Event('trowel.drop.hidden');
    const toggle = new Event('trowel.drop.toggle');
    const toggled = new Event('trowel.drop.toggled');
    const mounted = new Event('trowel.drop.mounted');

    return { show, shown, hide, hidden, toggle, toggled, mounted };
  }

}
