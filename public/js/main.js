/**
 * CraftyCrib - Main JavaScript
 * AI-Powered Interior Design Platform
 */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize Lucide icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // Navbar scroll effect
  initNavbarScroll();
  
  // Alert auto-dismiss
  initAlertDismiss();
  
  // Mobile menu
  initMobileMenu();
  
  // Smooth scroll
  initSmoothScroll();
  
  // Form enhancements
  initFormEnhancements();
});

/**
 * Navbar scroll effect
 */
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  
  const handleScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  
  window.addEventListener('scroll', handleScroll);
  handleScroll();
}

/**
 * Alert auto-dismiss
 */
function initAlertDismiss() {
  const alerts = document.querySelectorAll('.alert');
  
  alerts.forEach(alert => {
    // Auto dismiss after 5 seconds
    setTimeout(() => {
      alert.style.opacity = '0';
      alert.style.transform = 'translateY(-10px)';
      setTimeout(() => alert.remove(), 300);
    }, 5000);
    
    // Manual dismiss
    const closeBtn = alert.querySelector('.alert-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        alert.style.opacity = '0';
        alert.style.transform = 'translateY(-10px)';
        setTimeout(() => alert.remove(), 300);
      });
    }
  });
}

/**
 * Mobile menu toggle
 */
function initMobileMenu() {
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  const navActions = document.querySelector('.nav-actions');
  
  if (!menuBtn) return;
  
  menuBtn.addEventListener('click', () => {
    navLinks?.classList.toggle('mobile-active');
    navActions?.classList.toggle('mobile-active');
    
    const icon = menuBtn.querySelector('i');
    if (icon) {
      const isOpen = navLinks?.classList.contains('mobile-active');
      icon.setAttribute('data-lucide', isOpen ? 'x' : 'menu');
      lucide.createIcons();
    }
  });
}

/**
 * Smooth scroll for anchor links
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

/**
 * Form enhancements
 */
function initFormEnhancements() {
  // File input preview
  const fileInputs = document.querySelectorAll('input[type="file"]');
  fileInputs.forEach(input => {
    input.addEventListener('change', function() {
      const preview = document.querySelector(`#${this.id}-preview`);
      if (!preview) return;
      
      preview.innerHTML = '';
      
      Array.from(this.files).forEach(file => {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.className = 'file-preview-img';
            preview.appendChild(img);
          };
          reader.readAsDataURL(file);
        }
      });
    });
  });
  
  // Character counter for textareas
  const textareas = document.querySelectorAll('textarea[maxlength]');
  textareas.forEach(textarea => {
    const maxLength = textarea.getAttribute('maxlength');
    const counter = document.createElement('div');
    counter.className = 'char-counter';
    counter.textContent = `0 / ${maxLength}`;
    textarea.parentNode.appendChild(counter);
    
    textarea.addEventListener('input', () => {
      counter.textContent = `${textarea.value.length} / ${maxLength}`;
    });
  });
}

/**
 * API Helper
 */
const api = {
  async get(url) {
    const response = await fetch(url);
    return response.json();
  },
  
  async post(url, data) {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  },
  
  async put(url, data) {
    const response = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  },
  
  async delete(url) {
    const response = await fetch(url, { method: 'DELETE' });
    return response.json();
  }
};

/**
 * Toast notifications
 */
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <i data-lucide="${type === 'success' ? 'check-circle' : 'alert-circle'}"></i>
    <span>${message}</span>
  `;
  
  document.body.appendChild(toast);
  lucide.createIcons();
  
  // Animate in
  setTimeout(() => toast.classList.add('show'), 10);
  
  // Remove after 3 seconds
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

/**
 * Loading state helper
 */
function setLoading(button, isLoading) {
  if (isLoading) {
    button.disabled = true;
    button.dataset.originalText = button.innerHTML;
    button.innerHTML = '<span class="spinner"></span> Loading...';
  } else {
    button.disabled = false;
    button.innerHTML = button.dataset.originalText;
  }
}

/**
 * Format currency
 */
function formatCurrency(amount, currency = 'EUR') {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currency
  }).format(amount);
}

/**
 * Format date
 */
function formatDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(date));
}

/**
 * Debounce helper
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Add toast styles dynamically
const toastStyles = document.createElement('style');
toastStyles.textContent = `
  .toast {
    position: fixed;
    bottom: 20px;
    right: 20px;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 16px 24px;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-lg);
    transform: translateY(100px);
    opacity: 0;
    transition: all 0.3s ease;
    z-index: 9999;
  }
  
  .toast.show {
    transform: translateY(0);
    opacity: 1;
  }
  
  .toast-success {
    border-color: rgba(0, 255, 136, 0.3);
  }
  
  .toast-success i {
    color: var(--success);
  }
  
  .toast-error {
    border-color: rgba(255, 71, 87, 0.3);
  }
  
  .toast-error i {
    color: var(--error);
  }
  
  .spinner {
    width: 16px;
    height: 16px;
    border: 2px solid transparent;
    border-top-color: currentColor;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    display: inline-block;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  .char-counter {
    font-size: 0.75rem;
    color: var(--text-muted);
    text-align: right;
    margin-top: 4px;
  }
  
  .file-preview-img {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: var(--radius-md);
    margin: 4px;
  }
  
  /* Mobile menu styles */
  @media (max-width: 768px) {
    .nav-links.mobile-active,
    .nav-actions.mobile-active {
      display: flex !important;
      flex-direction: column;
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: var(--bg-primary);
      border-bottom: 1px solid var(--border-color);
      padding: 1rem;
      gap: 0.5rem;
    }
    
    .nav-actions.mobile-active {
      top: auto;
      border-top: 1px solid var(--border-color);
    }
  }
`;
document.head.appendChild(toastStyles);

// Export for use in other scripts
window.CraftyCrib = {
  api,
  showToast,
  setLoading,
  formatCurrency,
  formatDate,
  debounce
};

