// class CustomToast extends HTMLElement {
//   constructor() {
//     super();
//     this.attachShadow({ mode: 'open' });
//   }

//   connectedCallback() {
//     const type = this.getAttribute('type') || 'success';
//     const title = this.getAttribute('title') || this.capitalize(type);
//     const message = this.getAttribute('message') || '';
//     const duration = parseInt(this.getAttribute('duration')) || 4000;

//     const icons = {
//       success: '✅',
//       danger: '❌',
//       warning: '⚠️',
//       info: 'ℹ️'
//     };

//     const colors = {
//       success: { bg: '#D1FAE5', text: '#065F46' },
//       danger: { bg: '#FECACA', text: '#991B1B' },
//       warning: { bg: '#FEF3C7', text: '#92400E' },
//       info: { bg: '#DBEAFE', text: '#1E40AF' }
//     };

//     const { bg, text } = colors[type] || colors.success;

//     this.shadowRoot.innerHTML = `
//       <style>
//         :host {
//           all: initial;
//           font-family: sans-serif;
//         }
//         .toast {
//           display: flex;
//           align-items: flex-start;
//           gap: 0.75rem;
//           padding: 1rem 1.25rem;
//           margin: 0.5rem;
//           background-color: ${bg};
//           color: ${text};
//           border-left: 6px solid ${text};
//           border-radius: 0.5rem;
//           box-shadow: 0 5px 10px rgba(0,0,0,0.1);
//           min-width: 260px;
//           max-width: 320px;
//           animation: fadeIn 0.3s ease-out, fadeOut 0.3s ease-in ${duration - 4000}ms forwards;
//         }
//         .icon {
//           font-size: 1.5rem;
//           margin-top: 0.15rem;
//         }
//         .content {
//           flex-grow: 1;
//         }
//         .title {
//           font-weight: bold;
//           margin-bottom: 0.25rem;
//         }
//         .close {
//           cursor: pointer;
//           font-size: 1.25rem;
//           margin-left: auto;
//           color: ${text};
//         }
//         @keyframes fadeIn {
//           from { opacity: 0; transform: translateY(10px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//         @keyframes fadeOut {
//           to { opacity: 0; transform: translateY(-10px); }
//         }
//       </style>
//       <div class="toast" role="alert">
//         <div class="icon">${icons[type]}</div>
//         <div class="content">
//           <div class="title">${title}</div>
//           <div class="message">${message}</div>
//         </div>
//         <div class="close" title="Close">&times;</div>
//       </div>
//     `;

//     this.shadowRoot.querySelector('.close').addEventListener('click', () => this.remove());
//     setTimeout(() => this.remove(), duration);
//   }

//   capitalize(text) {
//     return text.charAt(0).toUpperCase() + text.slice(1);
//   }
// }

// customElements.define('custom-toast', CustomToast);

class CustomToast extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    const type = this.getAttribute('type') || 'success';
    const message = this.getAttribute('message') || '';
    const duration = parseInt(this.getAttribute('duration')) || 10000;

    // Color schemes similar to your Tailwind colors
    const colors = {
      success: { bg: '#D1FAE5', border: '#10B981', text: '#065F46' }, // teal
      danger: { bg: '#FEE2E2', border: '#EF4444', text: '#991B1B' }, // red
      warning: { bg: '#FEF3C7', border: '#F59E0B', text: '#92400E' }, // yellow
      info: { bg: '#DBEAFE', border: '#3B82F6', text: '#1E40AF' } // blue
    };

    const { bg, border, text } = colors[type] || colors.success;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          all: initial;
          font-family: system-ui, sans-serif;
          display: block;
          max-width: 100%;
        }
        .toast {
          display: flex;
          padding: 10px 20px 10px 20px;
          align-items: center;
          background-color: ${bg};
          color: ${text};
          border-radius: 0.5rem;
          box-shadow: 0 5px 10px rgba(0,0,0,0.1);
        }
        .content {
          flex-grow: 1;
        }
        .title {
          font-weight: 600;
          margin-bottom: 0.25rem;
          font-size: 1rem;
        }
        .message {
          font-size: 0.875rem;
          line-height: 1.25rem;
          user-select: text;
        }
        .close {
          cursor: pointer;
          font-size: 1.25rem;
          margin-left: auto;
          color: ${text};
          opacity: 0.6;
          user-select: none;
          transition: opacity 0.2s;
        }
        .close:hover,
        .close:focus {
          opacity: 1;
          outline: none;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeOut {
          to { opacity: 0; transform: translateY(-10px); }
        }
      </style>

      <div class="toast" role="alert" tabindex="0" aria-live="assertive" aria-atomic="true">
        <div class="content">
          <div class="message">${message}</div>
        </div>
        <span class="close" aria-label="Close toast">&times;</span>
      </div>
    `;

    this.shadowRoot.querySelector('.close').addEventListener('click', () => this.remove());

    setTimeout(() => this.remove(), duration);
  }

  capitalize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
}

customElements.define('custom-toast', CustomToast);
