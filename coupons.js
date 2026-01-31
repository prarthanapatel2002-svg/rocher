// =========================
// PREMIUM COUPONS INTERACTIONS
// =========================

class CouponsManager {
  constructor() {
    this.termsCheckbox = document.getElementById('terms-checkbox');
    this.termsSection = document.getElementById('terms-section');
    this.couponsGrid = document.getElementById('coupons-grid');
    this.modal = document.getElementById('coupon-modal');
    this.modalClose = document.getElementById('modal-close');
    this.modalImage = document.getElementById('modal-coupon-image');
    this.redeemBtn = document.getElementById('redeem-btn');
    this.resetBtn = document.getElementById('reset-btn');
    this.currentCoupon = null;
    
    this.init();
  }

  init() {
    // Load redeemed state from localStorage (separate from T&C)
    this.loadRedeemedState();
    
    // Load T&C acceptance state (separate from redemption)
    const termsAccepted = localStorage.getItem('coupons-terms-accepted');
    if (termsAccepted === 'true') {
      this.termsCheckbox.checked = true;
      this.enableCoupons();
    }
    
    // Terms checkbox handler - only controls coupon interactivity
    this.termsCheckbox.addEventListener('change', () => {
      if (this.termsCheckbox.checked) {
        localStorage.setItem('coupons-terms-accepted', 'true');
        this.enableCoupons();
      } else {
        localStorage.setItem('coupons-terms-accepted', 'false');
        this.disableCoupons();
      }
    });
    
    // Coupon card click handlers
    document.querySelectorAll('.coupon-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (this.couponsGrid.classList.contains('enabled') && !card.classList.contains('redeemed')) {
          this.openCoupon(card);
        }
      });
    });
    
    // Modal close handlers
    this.modalClose.addEventListener('click', () => this.closeModal());
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal || e.target.classList.contains('modal-backdrop')) {
        this.closeModal();
      }
    });
    
    // Redeem button handler
    this.redeemBtn.addEventListener('click', () => this.redeemCoupon());
    
    // Reset button handler
    this.resetBtn.addEventListener('click', () => this.resetAllCoupons());
    
    // Keyboard handlers
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal.classList.contains('active')) {
        this.closeModal();
      }
    });
  }

  enableCoupons() {
    this.couponsGrid.classList.add('enabled');
  }

  disableCoupons() {
    this.couponsGrid.classList.remove('enabled');
  }

  openCoupon(card) {
    const img = card.querySelector('img');
    const couponId = card.dataset.coupon;
    
    // Check if already redeemed
    if (this.isRedeemed(couponId)) {
      return;
    }
    
    this.currentCoupon = {
      element: card,
      id: couponId,
      src: img.src,
      alt: img.alt
    };
    
    // Set modal image
    this.modalImage.src = this.currentCoupon.src;
    this.modalImage.alt = this.currentCoupon.alt;
    
    // Show/hide redeem button
    if (this.isRedeemed(couponId)) {
      this.redeemBtn.disabled = true;
      this.redeemBtn.textContent = 'Already Redeemed';
    } else {
      this.redeemBtn.disabled = false;
      this.redeemBtn.textContent = 'Mark as Redeemed';
    }
    
    // Open modal with animation
    this.modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    this.modal.classList.remove('active');
    document.body.style.overflow = '';
    this.currentCoupon = null;
  }

  redeemCoupon() {
    if (!this.currentCoupon) return;
    
    const couponId = this.currentCoupon.id;
    
    // Mark as redeemed in localStorage (separate from T&C state)
    this.markAsRedeemed(couponId);
    
    // Update UI - only affects this coupon
    this.currentCoupon.element.classList.add('redeemed');
    this.redeemBtn.disabled = true;
    this.redeemBtn.textContent = 'Redeemed!';
    
    // Close modal after a moment
    setTimeout(() => {
      this.closeModal();
    }, 1000);
  }

  markAsRedeemed(couponId) {
    const redeemed = this.getRedeemedCoupons();
    if (!redeemed.includes(couponId)) {
      redeemed.push(couponId);
      localStorage.setItem('coupons-redeemed', JSON.stringify(redeemed));
    }
  }

  isRedeemed(couponId) {
    const redeemed = this.getRedeemedCoupons();
    return redeemed.includes(couponId);
  }

  getRedeemedCoupons() {
    const stored = localStorage.getItem('coupons-redeemed');
    return stored ? JSON.parse(stored) : [];
  }

  loadRedeemedState() {
    const redeemed = this.getRedeemedCoupons();
    
    document.querySelectorAll('.coupon-card').forEach(card => {
      const couponId = card.dataset.coupon;
      if (redeemed.includes(couponId)) {
        card.classList.add('redeemed');
      }
    });
  }

  resetAllCoupons() {
    // Ask for confirmation
    const confirmed = confirm('Are you sure you want to reset all coupons? This will clear all redemption states.');
    
    if (confirmed) {
      // Clear redemption state from localStorage (keep T&C state separate)
      localStorage.removeItem('coupons-redeemed');
      
      // Remove redeemed class from all coupons
      document.querySelectorAll('.coupon-card').forEach(card => {
        card.classList.remove('redeemed');
      });
      
      // Close modal if open
      if (this.modal.classList.contains('active')) {
        this.closeModal();
      }
      
      // T&C remains visible and unchanged
      // Coupons are now fresh and unredeemed
    }
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new CouponsManager();
  });
} else {
  new CouponsManager();
}
