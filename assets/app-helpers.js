function showToast({ type = 'success', message = '', duration = 4000 }) {
  const toast = document.createElement('custom-toast');
  toast.setAttribute('type', type);
  toast.setAttribute('message', message);
  toast.setAttribute('duration', duration);
  toast.classList.add('w-full');
  document.getElementById('toast-container').appendChild(toast);
}