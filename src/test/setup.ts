import '@testing-library/jest-dom'

Object.defineProperty(HTMLDialogElement.prototype, 'showModal', {
  value: function () {
    this.open = true;
  },
  writable: true,
});

Object.defineProperty(HTMLDialogElement.prototype, 'close', {
  value: function () {
    this.open = false;
  },
  writable: true,
});

Object.defineProperty(HTMLDialogElement.prototype, 'open', {
  value: false,
  writable: true,
});