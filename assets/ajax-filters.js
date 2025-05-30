// document.addEventListener('DOMContentLoaded', function () {
//   const attachCheckboxListeners = () => {
//     const form = document.getElementById('CollectionFiltersForm');
//     if (!form) return;

//     const checkboxes = form.querySelectorAll('input[type="checkbox"]');
//     checkboxes.forEach((checkbox) => {
//       checkbox.addEventListener('change', () => {
//         updateProductGrid();
//       });
//     });
//   };

//   const updateProductGrid = () => {
//     const form = document.getElementById('CollectionFiltersForm');
//     if (!form) return;

//     const params = new URLSearchParams(new FormData(form)).toString();

//     const baseUrl = form.getAttribute('action') || window.location.pathname;
//     const url = `${baseUrl}?${params}`;

//     fetch(`${url}&sections=main-collection-product-grid,main-collection-filters`)
//       .then((res) => res.json())
//       .then((data) => {
//         // ✅ Update product grid
//         if (data['main-collection-product-grid']) {
//           document.querySelector('#ProductGrid').innerHTML = data['main-collection-product-grid'];
//         }

//         // ✅ Update filters
//         if (data['main-collection-filters']) {
//           const parser = new DOMParser();
//           const doc = parser.parseFromString(data['main-collection-filters'], 'text/html');
//           const newFilters = doc.querySelector('#CollectionFiltersForm');
//           if (newFilters) {
//             const oldForm = document.getElementById('CollectionFiltersForm');
//             oldForm.replaceWith(newFilters);
//             attachCheckboxListeners(); // re-attach listeners to the new form
//           }
//         }

//         // ✅ Update browser URL
//         window.history.pushState({}, '', url);
//       });
//   };

//   attachCheckboxListeners();
// });
