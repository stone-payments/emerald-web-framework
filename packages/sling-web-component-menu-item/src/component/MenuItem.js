import { html, SlingElement } from 'sling-framework';
import 'sling-web-component-icon';

export class MenuItem extends SlingElement {

  static get properties() {
    return {
      aim: {
        type: String,
        reflectToAttribute: true,
      },
      size: {
        type: String,
        reflectToAttribute: true,
      },
      menu: {
        type: String,
        reflectToAttribute: true,
      },
    };
  }

  render() {
    const menuSize = this.parentElement.getAttribute('size') || '';
    const layoutType = this.parentElement.getAttribute('layout') || '';
    const anchorHref = this.getAttribute('href');
    
    const isActive = (this.getAttribute('active') != null) ? 'active' : '';

    const childrensArray = Array.from(this.children);
    const childrensTags = childrensArray.map($el => $el.nodeName);

    const submenuPosition = childrensTags.indexOf('SLING-MENU');
    const hasSubmenu = (submenuPosition !== -1);

    if (hasSubmenu) {
      const submenuElement = childrensArray[submenuPosition];
      submenuElement.setAttribute('layout', layoutType);
    }

    return (anchorHref && !hasSubmenu) ? html`
      <style>
        @import url('sling-web-component-menu-item/src/index.css');
      </style>
        ${this.aim ? html`
          <a href="${anchorHref}" className="${layoutType} ${menuSize} ${isActive} hasIcon">
            <sling-icon icon="${this.aim}" className="${menuSize}"></sling-icon>
            <slot></slot>
          </a>
        ` : html`
          <a href="${anchorHref}" className="${layoutType} ${menuSize} ${isActive}">
            <slot></slot>
          </a>
        `}
    ` : html`
      <style>
        @import url('sling-web-component-menu-item/src/index.css');
      </style>
        ${this.aim ? html`
          <a className="${layoutType} ${menuSize} ${isActive} hasIcon">
            <sling-icon icon="${this.aim || 'info'}" className="${menuSize}"></sling-icon>
            <slot name="title"></slot>
          </a>
          <slot></slot>
        ` : html`
          <a className="${layoutType} ${menuSize} ${isActive}">
            <slot name="title"></slot>
          </a>
          <slot></slot>
        `}
      
    `;
  }
}
