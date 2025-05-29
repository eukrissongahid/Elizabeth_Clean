document.addEventListener('DOMContentLoaded', function () {
  const attachCheckboxListeners = () => {
    const form = document.getElementById('CollectionFiltersForm');
    if (!form) return;

    const checkboxes = form.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener('change', () => {
        updateProductGrid();
      });
    });
  };

  const updateProductGrid = () => {
    const form = document.getElementById('CollectionFiltersForm');
    if (!form) return;

    const params = new URLSearchParams(new FormData(form)).toString();

    const baseUrl = form.getAttribute('action') || window.location.pathname;
    const url = `${baseUrl}?${params}`;

    fetch(`${url}&sections=main-collection-product-grid,main-collection-filters`)
      .then((res) => res.json())
      .then((data) => {
        // ✅ Update product grid
        if (data['main-collection-product-grid']) {
          document.querySelector('#ProductGrid').innerHTML = data['main-collection-product-grid'];
        }

        // ✅ Update filters
        if (data['main-collection-filters']) {
          const parser = new DOMParser();
          const doc = parser.parseFromString(data['main-collection-filters'], 'text/html');
          const newFilters = doc.querySelector('#CollectionFiltersForm');
          if (newFilters) {
            const oldForm = document.getElementById('CollectionFiltersForm');
            oldForm.replaceWith(newFilters);
            attachCheckboxListeners(); // re-attach listeners to the new form
          }
        }

        // ✅ Update browser URL
        window.history.pushState({}, '', url);
      });
  };

  attachCheckboxListeners();
});


// document.addEventListener('DOMContentLoaded', function () {
//   // Delegate click for pagination links
//   document.body.addEventListener('click', function (e) {
//     const target = e.target;
//     if (target.classList.contains('pagination-link')) {
//       e.preventDefault();

//       const url = target.getAttribute('href');

//       fetch(url + '&sections=main-collection-product-grid,main-collection-filters')
//         .then(res => res.json())
//         .then(data => {
//           // Replace product grid
//           document.querySelector('#ProductGrid').innerHTML = data['main-collection-product-grid'];

//           // Replace filters
//           const parser = new DOMParser();
//           const doc = parser.parseFromString(data['main-collection-filters'], 'text/html');
//           const newFilters = doc.querySelector('#CollectionFiltersForm');
//           if (newFilters) {
//             const oldForm = document.getElementById('CollectionFiltersForm');
//             oldForm.replaceWith(newFilters);
//           }

//           // Update browser URL without reloading
//           window.history.pushState({}, '', url);
//         })
//         .catch(() => {
//           // fallback: reload page on error
//           window.location.href = url;
//         });
//     }
//   });
// });


// document.addEventListener('DOMContentLoaded', function () {
//   const form = document.getElementById('CollectionFiltersForm');

//   // Attach event listeners on checkboxes for filters
//   const attachCheckboxListeners = () => {
//     if (!form) return;

//     const checkboxes = form.querySelectorAll('input[type="checkbox"]');
//     checkboxes.forEach(checkbox => {
//       checkbox.addEventListener('change', () => {
//         updateContent();
//       });
//     });
//   };

//   // Attach event listener for pagination links (delegated)
//   document.body.addEventListener('click', function (e) {
//     const target = e.target;
//     if (target.classList.contains('pagination-link')) {
//       e.preventDefault();

//       const url = target.getAttribute('href');
//       updateContent(url);
//     }
//   });

//   // Main function to update product grid and filters
//   const updateContent = (optionalUrl) => {
//     // Build URL from form or use provided URL from pagination click
//     let url;
//     if (optionalUrl) {
//       url = optionalUrl;
//     } else {
//       const params = new URLSearchParams(new FormData(form)).toString();
//       url = `${window.location.pathname}?${params}`;
//     }

//     // Shopify expects sections param to return JSON of those sections
//     const fetchUrl = url.includes('?') ? `${url}&sections=main-collection-product-grid,main-collection-filters` : `${url}?sections=main-collection-product-grid,main-collection-filters`;

//     fetch(fetchUrl)
//       .then(res => res.json())
//       .then(data => {
//         // Replace product grid
//         document.querySelector('#ProductGrid').innerHTML = data['main-collection-product-grid'];

//         // Replace filters form
//         const parser = new DOMParser();
//         const doc = parser.parseFromString(data['main-collection-filters'], 'text/html');
//         const newFilters = doc.querySelector('#CollectionFiltersForm');
//         if (newFilters) {
//           const oldForm = document.getElementById('CollectionFiltersForm');
//           oldForm.replaceWith(newFilters);
//           attachCheckboxListeners(); // reattach on new checkboxes
//         }

//         // Update URL
//         window.history.pushState({}, '', url);
//       })
//       .catch(() => {
//         // fallback to page reload if fetch fails
//         window.location.href = url;
//       });
//   };

//   // Initial attach for filters
//   attachCheckboxListeners();
// });

