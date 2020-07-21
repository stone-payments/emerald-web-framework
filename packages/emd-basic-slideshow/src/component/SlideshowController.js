export const SlideshowController = (Base = class {}) =>
  class extends Base {
    static get properties () {
      return {
        current: {
          type: Number,
          reflect: true
        },
        delay: {
          type: Number,
          reflect: true
        }
      };
    }

    get current () {
      return this._current == null
        ? Number(this.slideCount != null && this.slideCount > 0)
        : this._current;
    }

    set current (value) {
      const pastValue = this.current;
      const parsedValue = this._parseUserDefinedCurrent(value);
      const nextValue = parsedValue != null ? parsedValue : pastValue;

      this._current = nextValue;

      this.setAttribute('current', nextValue);
      this.requestUpdate('current', pastValue);
      this._updateSlides();
      this._dispatchSlideEvents(pastValue, nextValue);
    }

    _parseUserDefinedCurrent (current) {
      const parsed = Number(current);

      if (Number.isNaN(parsed)) {
        return undefined;
      }

      const rounded = Math.round(parsed);

      if (rounded < 1 && this.slideCount > 0) {
        return 1;
      }

      return (rounded > this.slideCount)
        ? this.slideCount
        : Math.max(0, rounded);
    }

    childrenUpdatedCallback () {
      this.slideCount = this.children.length;

      // trigger `current` accessors when the number of slides change
      const nextCurrent = this.current;
      this.current = nextCurrent;

      this._updateSlides();
    }

    _updateSlides () {
      Array.from(this.children).forEach((slide, index) => {
        const slideNumber = index + 1;

        slide.removeAttribute('before');
        slide.removeAttribute('current');
        slide.removeAttribute('after');

        if (slideNumber < this.current) {
          slide.setAttribute('before', '');
        } else if (slideNumber > this.current) {
          slide.setAttribute('after', '');
        } else {
          slide.setAttribute('current', '');
        }
      });
    }

    _dispatchSlideEvents (pastValue, nextValue) {
      if (pastValue !== nextValue) {
        ['slidechange', 'slidechangestart'].forEach(evtName => {
          this.dispatchEventAndMethod(evtName, {
            previous: pastValue,
            current: nextValue
          });
        });

        const slideChangeEnd = () => {
          this.dispatchEventAndMethod('slidechangeend', {
            previous: pastValue,
            current: nextValue
          });
          this.renderRoot.removeEventListener('transitionend', slideChangeEnd);
        };

        this.renderRoot.addEventListener('transitionend', slideChangeEnd);
      }
    }

    render () {
      return this.currentView.use(this);
    }
  };
