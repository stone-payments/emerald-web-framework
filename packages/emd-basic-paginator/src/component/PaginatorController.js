export const CASES = 7;

const createRangeArray = (start, end = start) =>
  Array.from(Array(1 + (end - start)).keys()).map(item => item + start);

const isPositiveIntegerStartingAt = (start, value) =>
  typeof value === 'number' && value >= start && value === Math.round(value);

export const PaginatorController = (Base = class {}) =>
  class extends Base {
    constructor () {
      super();
      this.paginate = this.paginate.bind(this);
    }

    static get properties () {
      return {
        configuration: Object,
        view: {
          type: String,
          reflect: true
        },
        total: {
          type: Number,
          reflect: true
        },
        selected: {
          type: Number,
          reflect: true
        }
      };
    }

    get isTotalValid () {
      return isPositiveIntegerStartingAt(1, this.total);
    }

    get isSelectedValid () {
      return isPositiveIntegerStartingAt(0, this.selected);
    }

    get isSelectedValidOrNull () {
      return this.selected == null || this.isSelectedValid;
    }

    get isSelectedInRange () {
      return this.selected >= 1 && this.selected <= this.total;
    }

    get isFirstSelected () {
      return this.isSelectedValid && this.selected === 1;
    }

    get isLastSelected () {
      return this.isSelectedValid && this.selected === this.total;
    }

    putSelectedInRange () {
      if (this.selected < 1) {
        this.selected = 1;
      }

      if (this.selected > this.total) {
        this.selected = this.total;
      }
    }

    changeSelected (type, index) {
      if (type === 'previous') {
        this.selected -= 1;
      } else if (type === 'next') {
        this.selected += 1;
      } else {
        this.selected = index;
      }
    }

    removeSelected () {
      this.removeAttribute('selected');
      this.selected = undefined;
    }

    removeTotal () {
      this.removeAttribute('total');
      this.total = undefined;
    }

    updateSelected () {
      if (this.isSelectedValidOrNull && this.isTotalValid) {
        if (!this.isSelectedInRange) {
          this.putSelectedInRange();
        } else {
          this.dispatchEventAndMethod('paginate', {
            type: 'index',
            index: this.selected
          });
        }
      } else {
        this.removeSelected();
      }
    }

    updateTotal () {
      if (this.isTotalValid) {
        if (!this.isSelectedValid) {
          this.changeSelected('index', 1);
        }
      } else {
        this.removeTotal();
        this.removeSelected();
      }
    }

    paginate (type, index) {
      return () => {
        if (this.isTotalValid) {
          this.changeSelected(type, index);
        } else {
          this.dispatchEventAndMethod('paginate', { type });
        }
      };
    }

    get currentRange () {
      const { total, selected = 1 } = this;
      const delta = CASES / 2;

      const shouldCollapse = (total > CASES);

      const shouldCollapseOnlyTheRight = shouldCollapse &&
        (selected >= 1 && selected <= 1 + delta);

      const shouldCollapseOnlyTheLeft = shouldCollapse &&
        !shouldCollapseOnlyTheRight &&
        (selected >= total - delta && selected <= total);

      const shouldCollapseOnBothSides = shouldCollapse &&
        !shouldCollapseOnlyTheRight &&
        !shouldCollapseOnlyTheLeft;

      let range;

      if (shouldCollapseOnlyTheRight) {
        range = [...createRangeArray(1, CASES - 2), null, total];
      } else if (shouldCollapseOnBothSides) {
        range = [1, null, ...createRangeArray(Math.floor(selected - delta) + 3,
          Math.floor(selected + delta) - 2), null, total];
      } else if (shouldCollapseOnlyTheLeft) {
        range = [1, null, ...createRangeArray((total - CASES) + 3, total)];
      } else {
        range = createRangeArray(1, total);
      }

      return range;
    }

    render () {
      return this.currentView.use(this);
    }
  };
