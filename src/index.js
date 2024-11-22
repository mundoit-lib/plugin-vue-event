import mitt from 'mitt';

function plugin(VueOrApp) {
  let isVue3 = false;

  if (typeof VueOrApp.version === 'string' && VueOrApp.version.startsWith('3.')) {
    isVue3 = true;
  }

  const eventBus = mitt();

  const bus = {
    emit(event, ...args) {
       eventBus.emit(event, args);
    },
    on(event, callback) {
      const listener = (args) => callback(...args);
      eventBus.on(event, listener);
      return listener;
    },
    fire(event, ...args) {
      eventBus.emit(event, args);
    },
    off(event, listener) {
      eventBus.off(event, listener);
    },
  };

  if (isVue3) {
    VueOrApp.config.globalProperties.$events = bus;

    VueOrApp.mixin({
      beforeCreate() {
        if (typeof this.$options.events !== 'object') return;

        this._eventListeners = [];

        for (const [event, handler] of Object.entries(this.$options.events)) {
          const boundHandler = handler.bind(this);
          const listener = bus.on(event, boundHandler);
          this._eventListeners.push({ event, listener });
        }
      },

      beforeUnmount() {
        if (!this._eventListeners) return;

        for (const { event, listener } of this._eventListeners) {
          bus.off(event, listener);
        }
      },
    });
  } else {
    Object.defineProperty(VueOrApp.prototype, '$events', {
      get() {
        return bus;
      },
    });

    VueOrApp.mixin({
      beforeCreate() {
        if (typeof this.$options.events !== 'object') return;

        this._eventListeners = [];

        for (const [event, handler] of Object.entries(this.$options.events)) {
          const boundHandler = handler.bind(this);
          const listener = bus.on(event, boundHandler);
          this._eventListeners.push({ event, listener });
        }
      },

      beforeDestroy() {
        if (!this._eventListeners) return;

        for (const { event, listener } of this._eventListeners) {
          bus.off(event, listener);
        }
      },
    });
  }
}

export default plugin;
