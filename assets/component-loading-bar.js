class LoadingBar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['color'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'color') {
      this.updateGradient(newValue);
    }
  }

  connectedCallback() {
    const color = this.getAttribute('color') || '#ea580c';

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 4px;
          overflow: hidden;
          display: none;
          z-index: 9999;
          background: transparent;
        }

        .bar {
          position: absolute;
          top: 0;
          left: -50%;
          height: 100%;
          width: 50%;
          background: linear-gradient(90deg, transparent, ${color}, transparent);
          animation: slide 1.2s ease-in-out infinite;
        }

        @keyframes slide {
          0% {
            left: -50%;
          }
          100% {
            left: 100%;
          }
        }
      </style>
      <div class="bar"></div>
    `;
  }

  updateGradient(color) {
    const bar = this.shadowRoot.querySelector('.bar');
    if (bar) {
      bar.style.background = `linear-gradient(90deg, transparent, ${color}, transparent)`;
    }
  }

  show() {
    this.style.display = 'block';
  }

  hide() {
    this.style.display = 'none';
  }
}

customElements.define('loading-bar', LoadingBar);
