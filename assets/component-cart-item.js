class CartItem extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  get variantId() {
    return this.getAttribute('variant-id');
  }

  get quantity() {
    return parseInt(this.getAttribute('quantity'), 10);
  }

  set quantity(val) {
    this.setAttribute('quantity', val);
    this.render();
  }

  render() {
    const productUrl = this.getAttribute('product-url');
    const productTitle = this.getAttribute('product-title');
    const variantTitle = this.getAttribute('variant-title');
    const imageSrc = this.getAttribute('image-src');
    const linePrice = this.getAttribute('line-price');
    const finalPrice = this.getAttribute('final-price');
    const lineIndex = this.getAttribute('line-index');
    const quantity = this.quantity;

    this.shadowRoot.innerHTML = `
      <style>
        .cart-item {
          display: flex;
          flex-direction: column;
          padding: 1rem 0.5rem;
          gap: 1rem;
          border-bottom: 1px solid #fb923c; /* Orange border */
        }

        @media (min-width: 768px) {
          .cart-item {
            flex-direction: row;
            align-items: center;
          }
        }

        .item-info {
          display: flex;
          flex: 1;
          gap: 1rem;
          align-items: flex-start;
          padding: 0 0.5rem;
        }

        .item-info img {
          width: 5rem;
          height: 5rem;
          object-fit: cover;
          border-radius: 0.25rem;
          box-shadow: 0 0 5px rgba(0,0,0,0.1);
        }

        .item-details {
          display: flex;
          flex-direction: column;
        }

        .item-details a {
          font-weight: 500;
          font-size: 1rem;
          text-decoration: none;
          color: inherit;
        }

        .item-details span {
          font-size: 0.875rem;
          color: #6b7280; /* Gray-500 */
        }

        .quantity {
          display: flex;
          justify-content: center;
          width: 100%;
          padding: 0 0.5rem;
        }

        @media (min-width: 768px) {
          .quantity {
            width: 7rem;
          }
        }

        .quantity input {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #d1d5db; /* Gray-300 */
          border-radius: 0.2rem;
          outline: none;
        }

        .total {
          display: flex;
          justify-content: start;
          width: 100%;
          padding: 0 0.5rem;
        }

        @media (min-width: 768px) {
          .total {
            width: 5rem;
          }
        }

        .remove {
          display: flex;
          justify-content: start;
          width: 3rem;
          padding: 0 0.5rem;
        }

        .remove a {
          font-size: 1.25rem;
          font-weight: bold;
          color: #ef4444; /* Red-500 */
          cursor: pointer;
          text-decoration: none;
        }

        .remove a:hover {
          color: #b91c1c; /* Red-700 */
        }
      </style>

      <div class="cart-item">
        <div class="item-info">
          <a href="${productUrl}">
            ${
              imageSrc
                ? `<img src="${imageSrc}" alt="${productTitle}" />`
                : `<div style="width: 5rem; height: 5rem; background-color: #eee; display: flex; align-items: center; justify-content: center; border-radius: 0.25rem;">No Image</div>`
            }
          </a>
          <div class="item-details">
            <a href="${productUrl}">${productTitle}</a>
            <span>${variantTitle}</span>
            <span>${finalPrice} each</span>
          </div>
        </div>

        <div class="quantity">
          <input
            type="number"
            value="${quantity}"
            min="1"
            id="qty-input-${lineIndex}"
          />
        </div>

        <div class="total">
          <span>${linePrice}</span>
        </div>

        <div class="remove">
          <a class="remove-btn" title="Remove item">&times;</a>
        </div>
      </div>
    `;

    this.shadowRoot.querySelector('input[type=number]').addEventListener('change', (e) => {
      const newQty = parseInt(e.target.value, 10);
      if (newQty >= 1) {
        this.dispatchEvent(
          new CustomEvent('quantity-change', {
            detail: { variantId: this.variantId, quantity: newQty },
            bubbles: true,
            composed: true
          })
        );
      }
    });

    this.shadowRoot.querySelector('.remove-btn').addEventListener('click', () => {
      this.dispatchEvent(
        new CustomEvent('remove-item', {
          detail: { lineIndex: this.getAttribute('line-index') },
          bubbles: true,
          composed: true
        })
      );
    });
  }

  get currentQuantity() {
    const input = this.shadowRoot.querySelector('input[type=number]');
    return input ? parseInt(input.value, 10) : this.quantity;
  }
}

customElements.define('cart-item', CartItem);
