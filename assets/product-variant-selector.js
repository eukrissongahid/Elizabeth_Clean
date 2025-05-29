// class ProductVariantSelector extends HTMLElement {
//   constructor() {
//     super();
//     this.attachShadow({ mode: 'open' });

//     // Initialize state
//     this.variants = [];
//     this.options = [];
//     this.selectedVariant = null;

//     // Template for the component
//     this.shadowRoot.innerHTML = `
//       <style>
//         :host {
//           display: block;
//           font-family: Arial, sans-serif;
//         }
//         label {
//           font-weight: 600;
//           display: block;
//           margin-bottom: 4px;
//           font-size: 14px;
//         }
//         select, input[type="number"] {
//           width: 100%;
//           padding: 6px 8px;
//           font-size: 14px;
//           margin-bottom: 12px;
//           border: 1px solid #ccc;
//           border-radius: 4px;
//           box-sizing: border-box;
//         }
//         .price {
//           font-weight: bold;
//           font-size: 20px;
//           color: #222;
//           margin-top: 8px;
//         }
//         .compare-price {
//           font-size: 16px;
//           text-decoration: line-through;
//           color: gray;
//           margin-top: 4px;
//           display: none;
//         }
//         .compare-price.active {
//           display: block;
//         }
//         .quantity-container {
//           margin-top: 0;
//           font-size: 14px;
//           color: #333;
//         }
//         .available-qty {
//           font-weight: normal;
//           font-size: 12px;
//           color: #666;
//           margin-top: -10px;
//           margin-bottom: 12px;
//           display: block;
//         }
//       </style>

//       <div id="variant-selectors"></div>
//       <div>
//         <p class="compare-price" id="comparePrice"></p>
//         <p class="price" id="price"></p>
//       </div>

//       <div class="quantity-container">
//         <label for="quantityInput">Quantity:</label>
//         <input type="number" id="quantityInput" min="0" value="0" />
//         <span class="available-qty" id="availableQty"></span>
//       </div>
//     `;
//   }

//   connectedCallback() {
//     // Read variants and options from attributes (JSON strings)
//     try {
//       this.variants = JSON.parse(this.getAttribute('variants'));
//       this.options = JSON.parse(this.getAttribute('options'));
//     } catch (e) {
//       console.error('Invalid JSON data for variants or options', e);
//       return;
//     }

//     // Render variant selectors
//     this.renderSelectors();

//     requestAnimationFrame(() => {
//       this.updateSelectedVariantAndPrice();
//     });

//     // Listen for quantity input changes to clamp to max
//     const quantityInput = this.shadowRoot.getElementById('quantityInput');
//     quantityInput.addEventListener('input', () => {
//       this.clampQuantityInput();
//       if (this.selectedVariant) {
//         const qty = parseInt(quantityInput.value) || 1;
//         this.dispatchSelection(this.selectedVariant.id, qty);
//       }
//     });
//   }

//   renderSelectors() {
//     const container = this.shadowRoot.getElementById('variant-selectors');
//     container.innerHTML = ''; // Clear

//     // Pick the first variant (if any) to set default selected options
//     const firstVariant = this.variants[0];

//     this.options.forEach((optionName, idx) => {
//       const div = document.createElement('div');
//       const label = document.createElement('label');
//       label.textContent = optionName;
//       label.htmlFor = `option-select-${idx}`;
//       const select = document.createElement('select');
//       select.id = `option-select-${idx}`;
//       select.dataset.optionIndex = idx;

//       // Unique values for this option
//       const values = [...new Set(this.variants.map((v) => v.options[idx]))];
//       values.forEach((value) => {
//         const option = document.createElement('option');
//         option.value = value;
//         option.textContent = value;

//         // Set default selected if matches first variant's option
//         if (firstVariant && firstVariant.options[idx] === value) {
//           option.selected = true;
//         }

//         select.appendChild(option);
//       });

//       select.addEventListener('change', () => this.updateSelectedVariantAndPrice());

//       div.appendChild(label);
//       div.appendChild(select);
//       container.appendChild(div);
//     });
//   }

//   getSelectedOptions() {
//     const selects = this.shadowRoot.querySelectorAll('select');
//     return Array.from(selects).map((s) => s.value);
//   }

//   findVariant(selectedOptions) {
//     return this.variants.find((variant) => {
//       const match = variant.options.every((opt, i) => opt === selectedOptions[i]);
//       if (match) console.log('Matching variant found:', variant);
//       return match;
//     });
//   }

//   updateSelectedVariantAndPrice() {
//     const selectedOptions = this.getSelectedOptions();
//     const variant = this.findVariant(selectedOptions);

//     if (!variant) {
//       this.selectedVariant = null;
//       this.shadowRoot.getElementById('price').textContent = '';
//       this.shadowRoot.getElementById('comparePrice').classList.remove('active');
//       this.shadowRoot.getElementById('comparePrice').textContent = '';
//       this.updateQuantityDisplay(0);
//       this.dispatchSelection(null, 0);
//       return;
//     }
//     this.selectedVariant = variant;

//     // Update price display
//     const priceElem = this.shadowRoot.getElementById('price');
//     const comparePriceElem = this.shadowRoot.getElementById('comparePrice');

//     const price = variant.price / 100;
//     priceElem.textContent = `$${price.toFixed(2)}`;

//     if (variant.compare_at_price && variant.compare_at_price > variant.price) {
//       comparePriceElem.textContent = `$${(variant.compare_at_price / 100).toFixed(2)}`;
//       comparePriceElem.classList.add('active');
//       priceElem.style.color = 'red';
//     } else {
//       comparePriceElem.textContent = '';
//       comparePriceElem.classList.remove('active');
//       priceElem.style.color = '';
//     }

//     // Update quantity input max and available quantity text
//     this.updateQuantityDisplay(variant.available ? null : 0);

//     // Dispatch event with selected variant details
//     this.dispatchEvent(
//       new CustomEvent('variant-changed', {
//         detail: { variant: this.selectedVariant },
//         bubbles: true,
//         composed: true
//       })
//     );

//     const quantityInput = this.shadowRoot.getElementById('quantityInput');
//     const quantity = parseInt(quantityInput.value);

//     this.dispatchSelection(this.selectedVariant.id, quantity);
//   }

//   updateQuantityDisplay(availableQty) {
//     const quantityInput = this.shadowRoot.getElementById('quantityInput');
//     const availableQtySpan = this.shadowRoot.getElementById('availableQty');

//     if (availableQty > 0 || availableQty === null) {
//       availableQtySpan.textContent = `(In stock)`;
//       quantityInput.disabled = false;
//       quantityInput.removeAttribute('max');
//     } else {
//       availableQtySpan.textContent = `(Out of stock)`;
//       quantityInput.disabled = true;
//       quantityInput.value = 0;
//       quantityInput.setAttribute('max', 0);
//     }
//   }

//   clampQuantityInput() {
//     const quantityInput = this.shadowRoot.getElementById('quantityInput');
//     const max = parseInt(quantityInput.max) || Infinity;
//     let val = parseInt(quantityInput.value) || 1;
//     if (val < 1) val = 1;
//     if (val > max) val = max;
//     quantityInput.value = val;
//   }

//   dispatchSelection(variantId, quantity) {
//     this.dispatchEvent(
//       new CustomEvent('variant-change', {
//         detail: { variantId, quantity },
//         bubbles: true,
//         composed: true
//       })
//     );
//   }
// }

// customElements.define('product-variant-selector', ProductVariantSelector);

// class ProductVariantSelector extends HTMLElement {
//   constructor() {
//     super();
//     this.attachShadow({ mode: 'open' });

//     this.variants = [];
//     this.options = [];
//     this.selectedVariant = null;

//     this.shadowRoot.innerHTML = `
//       <style>
//         :host {
//           display: block;
//           font-family: Arial, sans-serif;
//         }
//         label {
//           font-weight: 600;
//           display: block;
//           margin-bottom: 4px;
//           font-size: 14px;
//         }
//         select, input[type="number"] {
//           width: 100%;
//           padding: 6px 8px;
//           font-size: 14px;
//           margin-bottom: 12px;
//           border: 1px solid #ccc;
//           border-radius: 4px;
//           box-sizing: border-box;
//         }
//         .price {
//           font-weight: bold;
//           font-size: 20px;
//           color: #222;
//           margin-top: 8px;
//         }
//         .compare-price {
//           font-size: 16px;
//           text-decoration: line-through;
//           color: gray;
//           margin-top: 4px;
//           display: none;
//         }
//         .compare-price.active {
//           display: block;
//         }
//         .quantity-container {
//           margin-top: 0;
//           font-size: 14px;
//           color: #333;
//         }
//         .available-qty {
//           font-weight: normal;
//           font-size: 12px;
//           color: #666;
//           margin-top: -10px;
//           margin-bottom: 12px;
//           display: block;
//         }
//       </style>

//       <div id="variant-selectors"></div>
//       <div>
//         <p class="compare-price" id="comparePrice"></p>
//         <p class="price" id="price"></p>
//       </div>

//       <div class="quantity-container">
//         <label for="quantityInput">Quantity:</label>
//         <input type="number" id="quantityInput" min="0" value="0" />
//         <span class="available-qty" id="availableQty"></span>
//       </div>
//     `;
//   }

//   connectedCallback() {
//     try {
//       this.variants = JSON.parse(this.getAttribute('variants'));
//       this.options = JSON.parse(this.getAttribute('options'));
//     } catch (e) {
//       console.error('Invalid JSON data for variants or options', e);
//       return;
//     }

//     this.renderSelectors();

//     requestAnimationFrame(() => {
//       this.updateSelectedVariantAndPrice();
//     });

//     const quantityInput = this.shadowRoot.getElementById('quantityInput');
//     quantityInput.addEventListener('input', () => {
//       this.clampQuantityInput();
//       if (this.selectedVariant) {
//         const qty = parseInt(quantityInput.value) || 1;
//         this.dispatchSelection(this.selectedVariant.id, qty);
//       }
//     });
//   }

//   renderSelectors() {
//     const container = this.shadowRoot.getElementById('variant-selectors');
//     container.innerHTML = '';

//     const firstVariant = this.variants[0];

//     this.options.forEach((optionName, idx) => {
//       const div = document.createElement('div');
//       const label = document.createElement('label');
//       label.textContent = optionName;
//       label.htmlFor = `option-select-${idx}`;

//       const select = document.createElement('select');
//       select.id = `option-select-${idx}`;
//       select.dataset.optionIndex = idx;

//       const values = [...new Set(this.variants.map((v) => v.options[idx]))];
//       values.forEach((value) => {
//         const option = document.createElement('option');
//         option.value = value;
//         option.textContent = value;
//         if (firstVariant && firstVariant.options[idx] === value) {
//           option.selected = true;
//         }
//         select.appendChild(option);
//       });

//       select.addEventListener('change', () => this.updateSelectedVariantAndPrice());

//       div.appendChild(label);
//       div.appendChild(select);
//       container.appendChild(div);
//     });
//   }

//   getSelectedOptions() {
//     return Array.from(this.shadowRoot.querySelectorAll('select')).map((s) => s.value);
//   }

//   findVariant(selectedOptions) {
//     return this.variants.find((variant) =>
//       variant.options.every((opt, i) => opt === selectedOptions[i])
//     );
//   }

//   updateSelectedVariantAndPrice() {
//     const selectedOptions = this.getSelectedOptions();
//     const variant = this.findVariant(selectedOptions);
//     const priceElem = this.shadowRoot.getElementById('price');
//     const comparePriceElem = this.shadowRoot.getElementById('comparePrice');
//     const quantityInput = this.shadowRoot.getElementById('quantityInput');

//     if (!variant) {
//       this.selectedVariant = null;
//       priceElem.textContent = '';
//       comparePriceElem.classList.remove('active');
//       comparePriceElem.textContent = '';
//       this.updateQuantityDisplay(0);
//       this.dispatchSelection(null, 0);
//       return;
//     }

//     this.selectedVariant = variant;
//     priceElem.textContent = `$${(variant.price / 100).toFixed(2)}`;

//     if (variant.compare_at_price && variant.compare_at_price > variant.price) {
//       comparePriceElem.textContent = `$${(variant.compare_at_price / 100).toFixed(2)}`;
//       comparePriceElem.classList.add('active');
//       priceElem.style.color = 'red';
//     } else {
//       comparePriceElem.textContent = '';
//       comparePriceElem.classList.remove('active');
//       priceElem.style.color = '';
//     }

//     this.updateQuantityDisplay(variant.available ? null : 0);
//     quantityInput.value = 0;

//     this.dispatchEvent(
//       new CustomEvent('variant-changed', {
//         detail: { variant: this.selectedVariant },
//         bubbles: true,
//         composed: true
//       })
//     );

//     this.dispatchSelection(variant.id, parseInt(quantityInput.value));
//   }

//   updateQuantityDisplay(availableQty) {
//     const quantityInput = this.shadowRoot.getElementById('quantityInput');
//     const availableQtySpan = this.shadowRoot.getElementById('availableQty');

//     if (availableQty > 0 || availableQty === null) {
//       availableQtySpan.textContent = `(In stock)`;
//       quantityInput.disabled = false;
//       quantityInput.removeAttribute('max');
//     } else {
//       availableQtySpan.textContent = `(Out of stock)`;
//       quantityInput.disabled = true;
//       quantityInput.value = 0;
//       quantityInput.setAttribute('max', 0);
//     }
//   }

//   clampQuantityInput() {
//     const quantityInput = this.shadowRoot.getElementById('quantityInput');
//     const max = parseInt(quantityInput.max) || Infinity;
//     let val = parseInt(quantityInput.value);
//     if (isNaN(val) || val < 0) val = 0;
//     if (val > max) val = max;
//     quantityInput.value = val;
//   }

//   dispatchSelection(variantId, quantity) {
//     this.dispatchEvent(
//       new CustomEvent('variant-change', {
//         detail: { variantId, quantity },
//         bubbles: true,
//         composed: true
//       })
//     );
//   }
// }

// customElements.define('product-variant-selector', ProductVariantSelector);

/**
 * Custom element to select product variants with options and quantity.
 * @extends HTMLElement
 */
class ProductVariantSelector extends HTMLElement {
  /**
   * Constants for UI texts and CSS class names.
   * @type {Object}
   * @readonly
   */
  static UI_TEXT = {
    LABEL_QUANTITY: 'Quantity:',
    IN_STOCK: '(In stock)',
    OUT_OF_STOCK: '(Out of stock)',
    CURRENCY_SYMBOL: '$'
  };

  /**
   * CSS class names used for UI state changes.
   * @type {Object}
   * @readonly
   */
  static CSS_CLASSES = {
    COMPARE_PRICE_ACTIVE: 'active'
  };

  /**
   * Selectors for elements inside the shadow DOM.
   * @type {Object}
   * @readonly
   */
  static SELECTORS = {
    VARIANT_SELECTORS_CONTAINER: 'variant-selectors',
    PRICE: 'price',
    COMPARE_PRICE: 'comparePrice',
    QUANTITY_INPUT: 'quantityInput',
    AVAILABLE_QTY: 'availableQty'
  };

  /**
   * Default values for quantity and price.
   * @type {Object}
   * @readonly
   */
  static DEFAULTS = {
    INITIAL_QUANTITY: 0,
    MIN_QUANTITY: 0,
    MAX_QUANTITY: Infinity,
    PRICE_DIVIDER: 100
  };

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    /** @type {Array} List of variant objects */
    this.variants = [];
    /** @type {Array} List of option names */
    this.options = [];
    /** @type {Object|null} Currently selected variant */
    this.selectedVariant = null;

    this.renderTemplate();
  }

  connectedCallback() {
    if (!this.parseAttributes()) return;

    this.renderSelectors();
    this.updateSelectedVariantAndPrice();

    this.getQuantityInput().addEventListener('input', () => {
      this.clampQuantityInput();
      if (this.selectedVariant) {
        const qty = parseInt(this.getQuantityInput().value, 10) || 1;
        this.dispatchSelection(this.selectedVariant.id, qty);
      }
    });
  }

  parseAttributes() {
    try {
      this.variants = JSON.parse(this.getAttribute('variants'));
      this.options = JSON.parse(this.getAttribute('options'));
      return true;
    } catch (e) {
      console.error('Invalid JSON data for variants or options', e);
      return false;
    }
  }

  renderTemplate() {
    const UI_TEXT = this.constructor.UI_TEXT;
    const CSS_CLASSES = this.constructor.CSS_CLASSES;
    const SELECTORS = this.constructor.SELECTORS;
    const DEFAULTS = this.constructor.DEFAULTS;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: Arial, sans-serif;
        }
        label {
          font-weight: 600;
          display: block;
          margin-bottom: 4px;
          font-size: 14px;
        }
        select, input[type="number"] {
          width: 100%;
          padding: 6px 8px;
          font-size: 14px;
          margin-bottom: 12px;
          border: 1px solid #ccc;
          border-radius: 4px;
          box-sizing: border-box;
        }
        .price {
          font-weight: bold;
          font-size: 20px;
          color: #222;
          margin-top: 8px;
        }
        .compare-price {
          font-size: 16px;
          text-decoration: line-through;
          color: gray;
          margin-top: 4px;
          display: none;
        }
        .compare-price.${CSS_CLASSES.COMPARE_PRICE_ACTIVE} {
          display: block;
        }
        .quantity-container {
          margin-top: 0;
          font-size: 14px;
          color: #333;
        }
        .available-qty {
          font-weight: normal;
          font-size: 12px;
          color: #666;
          margin-top: -10px;
          margin-bottom: 12px;
          display: block;
        }
      </style>
      <div id="${SELECTORS.VARIANT_SELECTORS_CONTAINER}"></div>
      <div>
        <p class="compare-price" id="${SELECTORS.COMPARE_PRICE}"></p>
        <p class="price" id="${SELECTORS.PRICE}"></p>
      </div>
      <div class="quantity-container">
        <label for="${SELECTORS.QUANTITY_INPUT}">${UI_TEXT.LABEL_QUANTITY}</label>
        <input type="number" id="${SELECTORS.QUANTITY_INPUT}" min="${DEFAULTS.MIN_QUANTITY}" value="${DEFAULTS.INITIAL_QUANTITY}" />
        <span class="available-qty" id="${SELECTORS.AVAILABLE_QTY}"></span>
      </div>
    `;
  }

  renderSelectors() {
    const container = this.getVariantSelectorsContainer();
    container.innerHTML = '';

    const firstVariant = this.variants[0] || null;

    this.options.forEach((optionName, idx) => {
      const wrapperDiv = document.createElement('div');
      const label = document.createElement('label');
      label.textContent = optionName;
      label.htmlFor = `option-select-${idx}`;

      const select = document.createElement('select');
      select.id = `option-select-${idx}`;
      select.dataset.optionIndex = idx.toString();

      const uniqueValues = [...new Set(this.variants.map((v) => v.options[idx]))];
      uniqueValues.forEach((value) => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = value;
        if (firstVariant && firstVariant.options[idx] === value) {
          option.selected = true;
        }
        select.appendChild(option);
      });

      select.addEventListener('change', () => this.updateSelectedVariantAndPrice());

      wrapperDiv.appendChild(label);
      wrapperDiv.appendChild(select);
      container.appendChild(wrapperDiv);
    });
  }

  getSelectedOptions() {
    return Array.from(this.shadowRoot.querySelectorAll('select')).map((select) => select.value);
  }

  findVariant(selectedOptions) {
    return this.variants.find((variant) =>
      variant.options.every((opt, i) => opt === selectedOptions[i])
    );
  }

  updateSelectedVariantAndPrice() {
    const SELECTORS = this.constructor.SELECTORS;
    const CSS_CLASSES = this.constructor.CSS_CLASSES;
    const UI_TEXT = this.constructor.UI_TEXT;
    const DEFAULTS = this.constructor.DEFAULTS;

    const selectedOptions = this.getSelectedOptions();
    const variant = this.findVariant(selectedOptions);
    const priceElem = this.getPriceElement();
    const comparePriceElem = this.getComparePriceElement();
    const quantityInput = this.getQuantityInput();

    if (!variant) {
      this.selectedVariant = null;
      this.clearPriceDisplay(priceElem, comparePriceElem);
      this.updateQuantityDisplay(0);
      this.dispatchSelection(null, 0);
      return;
    }

    this.selectedVariant = variant;

    priceElem.textContent = this.formatPrice(variant.price);
    if (variant.compare_at_price && variant.compare_at_price > variant.price) {
      comparePriceElem.textContent = this.formatPrice(variant.compare_at_price);
      comparePriceElem.classList.add(CSS_CLASSES.COMPARE_PRICE_ACTIVE);
      priceElem.style.color = 'red';
    } else {
      this.clearComparePrice(comparePriceElem);
      priceElem.style.color = '';
    }

    this.updateQuantityDisplay(variant.available ? null : 0);
    quantityInput.value = DEFAULTS.INITIAL_QUANTITY;

    this.dispatchEvent(
      new CustomEvent('variant-changed', {
        detail: { variant: this.selectedVariant },
        bubbles: true,
        composed: true
      })
    );

    this.dispatchSelection(variant.id, parseInt(quantityInput.value, 10));
  }

  updateQuantityDisplay(availableQty) {
    const UI_TEXT = this.constructor.UI_TEXT;
    const DEFAULTS = this.constructor.DEFAULTS;

    const quantityInput = this.getQuantityInput();
    const availableQtySpan = this.getAvailableQtySpan();

    if (availableQty > 0 || availableQty === null) {
      availableQtySpan.textContent = UI_TEXT.IN_STOCK;
      quantityInput.disabled = false;
      quantityInput.removeAttribute('max');
    } else {
      availableQtySpan.textContent = UI_TEXT.OUT_OF_STOCK;
      quantityInput.disabled = true;
      quantityInput.value = DEFAULTS.INITIAL_QUANTITY;
      quantityInput.setAttribute('max', '0');
    }
  }

  clampQuantityInput() {
    const DEFAULTS = this.constructor.DEFAULTS;
    const quantityInput = this.getQuantityInput();
    const max = parseInt(quantityInput.getAttribute('max'), 10) || DEFAULTS.MAX_QUANTITY;
    let val = parseInt(quantityInput.value, 10);
    if (isNaN(val) || val < DEFAULTS.MIN_QUANTITY) val = DEFAULTS.MIN_QUANTITY;
    if (val > max) val = max;
    quantityInput.value = val;
  }

  dispatchSelection(variantId, quantity) {
    this.dispatchEvent(
      new CustomEvent('variant-change', {
        detail: { variantId, quantity },
        bubbles: true,
        composed: true
      })
    );
  }

  formatPrice(priceInCents) {
    const UI_TEXT = this.constructor.UI_TEXT;
    const DEFAULTS = this.constructor.DEFAULTS;

    return `${UI_TEXT.CURRENCY_SYMBOL}${(priceInCents / DEFAULTS.PRICE_DIVIDER).toFixed(2)}`;
  }

  clearPriceDisplay(priceElem, comparePriceElem) {
    priceElem.textContent = '';
    this.clearComparePrice(comparePriceElem);
  }

  clearComparePrice(comparePriceElem) {
    const CSS_CLASSES = this.constructor.CSS_CLASSES;

    comparePriceElem.textContent = '';
    comparePriceElem.classList.remove(CSS_CLASSES.COMPARE_PRICE_ACTIVE);
  }

  getVariantSelectorsContainer() {
    const SELECTORS = this.constructor.SELECTORS;
    return this.shadowRoot.getElementById(SELECTORS.VARIANT_SELECTORS_CONTAINER);
  }

  getPriceElement() {
    const SELECTORS = this.constructor.SELECTORS;
    return this.shadowRoot.getElementById(SELECTORS.PRICE);
  }

  getComparePriceElement() {
    const SELECTORS = this.constructor.SELECTORS;
    return this.shadowRoot.getElementById(SELECTORS.COMPARE_PRICE);
  }

  getQuantityInput() {
    const SELECTORS = this.constructor.SELECTORS;
    return /** @type {HTMLInputElement} */ (
      this.shadowRoot.getElementById(SELECTORS.QUANTITY_INPUT)
    );
  }

  getAvailableQtySpan() {
    const SELECTORS = this.constructor.SELECTORS;
    return this.shadowRoot.getElementById(SELECTORS.AVAILABLE_QTY);
  }
}

customElements.define('product-variant-selector', ProductVariantSelector);
