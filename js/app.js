/**
 * CampusGear P2P — Core Application Logic
 * Dedicated Equipment Lending Platform
 * Features:
 * - Buttery-smooth spring lerp 3D card tilt physics
 * - Smooth ambient cursor glow following mouse movement
 * - Instant product category filtering and live search
 * - Borrow Request & Escrow Authorization Modal with Confetti
 * - + Lend Equipment listing modal with immediate live state insertion
 * - Lenis inertia smooth scroll
 */

class CampusGearApp {
  constructor() {
    this.gearList = window.CAMPUS_DATA ? [...window.CAMPUS_DATA.initialGear] : [];
    this.activeCategory = 'all';
    this.searchQuery = '';
    this.lenis = null;
    this.cardsWithTilt = [];

    // Smooth ambient cursor position tracking
    this.cursorPos = { x: window.innerWidth / 2, y: window.innerHeight / 2, targetX: window.innerWidth / 2, targetY: window.innerHeight / 2 };

    this.init();
  }

  init() {
    this.initSmoothScroll();
    this.initAmbientCursor();
    this.initEquipmentHub();
    this.initModals();
    this.initKeyboardShortcuts();
    this.startCardTiltPhysicsLoop();

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  // 1. Lenis Smooth Momentum Scroll & Progress Bar
  initSmoothScroll() {
    if (typeof Lenis !== 'undefined') {
      this.lenis = new Lenis({
        duration: 1.35,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1.05,
        touchMultiplier: 1.8,
        syncTouch: false,
        infinite: false,
      });

      // Synchronize Lenis RAF with browser refresh rate (60/120Hz)
      const raf = (time) => {
        this.lenis.raf(time);
        requestAnimationFrame(raf);
      };
      requestAnimationFrame(raf);

      // Listen directly to Lenis scroll updates for 100% fluid sync
      this.lenis.on('scroll', (e) => {
        const progressBar = document.getElementById('scroll-progress');
        if (progressBar && e.limit) {
          const progress = Math.min(100, Math.max(0, (e.scroll / e.limit) * 100));
          progressBar.style.width = progress + '%';
        }

        const navbar = document.getElementById('main-navbar');
        if (navbar) {
          if (e.scroll > 25) {
            navbar.classList.add('scrolled');
          } else {
            navbar.classList.remove('scrolled');
          }
        }
      });
    } else {
      // Fallback
      const progressBar = document.getElementById('scroll-progress');
      const navbar = document.getElementById('main-navbar');

      window.addEventListener('scroll', () => {
        const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        if (progressBar) progressBar.style.width = scrolled + '%';
        if (navbar) {
          if (winScroll > 25) navbar.classList.add('scrolled');
          else navbar.classList.remove('scrolled');
        }
      });
    }

    // Ultra-smooth programmatic scrolling on anchor click
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (!href) return;
        if (href === '#') {
          e.preventDefault();
          if (this.lenis) {
            this.lenis.scrollTo(0, { duration: 1.35 });
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
          return;
        }

        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          if (this.lenis) {
            this.lenis.scrollTo(target, { offset: -80, duration: 1.35 });
          } else {
            target.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
    });

    this.initScrollReveal();
  }

  // Scroll reveal observer
  initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, { threshold: 0.08 });

    setTimeout(() => {
      document.querySelectorAll('.section-header, .hub-toolbar, .gear-card-wrapper').forEach(el => {
        el.classList.add('reveal-on-scroll');
        observer.observe(el);
      });
    }, 100);
  }

  // 2. Ambient Cursor Halo with Spring Lerp
  initAmbientCursor() {
    const cursor = document.getElementById('ambient-cursor');
    if (!cursor) return;

    window.addEventListener('mousemove', (e) => {
      this.cursorPos.targetX = e.clientX;
      this.cursorPos.targetY = e.clientY;
    });

    const updateCursor = () => {
      this.cursorPos.x += (this.cursorPos.targetX - this.cursorPos.x) * 0.12;
      this.cursorPos.y += (this.cursorPos.targetY - this.cursorPos.y) * 0.12;
      cursor.style.transform = `translate3d(${this.cursorPos.x}px, ${this.cursorPos.y}px, 0)`;
      requestAnimationFrame(updateCursor);
    };
    requestAnimationFrame(updateCursor);
  }

  // 3. Equipment Hub (Search, Category Pills, Grid)
  initEquipmentHub() {
    this.renderCategoryPills();
    this.renderGearGrid();

    // Search Input
    const searchInput = document.getElementById('gear-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.renderGearGrid();
      });
    }

    // Available Only Filter
    const filterAvailableOnly = document.getElementById('filter-available-only');
    if (filterAvailableOnly) {
      filterAvailableOnly.addEventListener('change', () => {
        this.renderGearGrid();
      });
    }
  }

  renderCategoryPills() {
    const container = document.getElementById('category-pills-container');
    if (!container || !window.CAMPUS_DATA) return;

    container.innerHTML = '';
    window.CAMPUS_DATA.categories.forEach(cat => {
      const pill = document.createElement('button');
      pill.className = `cat-pill ${cat.id === this.activeCategory ? 'active' : ''}`;
      pill.innerHTML = `<i data-lucide="${cat.icon}"></i> ${cat.name}`;
      pill.addEventListener('click', () => {
        this.activeCategory = cat.id;
        document.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        this.renderGearGrid();
      });
      container.appendChild(pill);
    });
  }

  renderGearGrid() {
    const grid = document.getElementById('equipment-grid');
    const countBadge = document.getElementById('active-items-count');
    if (!grid) return;

    this.cardsWithTilt = [];

    const availableOnlyCheck = document.getElementById('filter-available-only');
    const isOnlyAvailable = availableOnlyCheck ? availableOnlyCheck.checked : false;

    // Filter items
    const filtered = this.gearList.filter(item => {
      const matchCat = this.activeCategory === 'all' || item.category === this.activeCategory;
      const matchSearch = item.title.toLowerCase().includes(this.searchQuery) ||
                          item.description.toLowerCase().includes(this.searchQuery) ||
                          item.owner.name.toLowerCase().includes(this.searchQuery) ||
                          item.owner.department.toLowerCase().includes(this.searchQuery);
      const matchAvailable = isOnlyAvailable ? item.available : true;
      return matchCat && matchSearch && matchAvailable;
    });

    if (countBadge) {
      countBadge.textContent = `${filtered.length} Products Available`;
    }

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 4rem 1rem; background: rgba(15,23,42,0.4); border: 1px dashed var(--border-blueprint); border-radius: 16px;">
          <i data-lucide="package-search" style="width: 48px; height: 48px; color: var(--text-dim); margin-bottom: 1rem;"></i>
          <h3 style="color:#fff; font-size:1.2rem; margin-bottom:0.5rem;">No Products Found</h3>
          <p style="color:var(--text-muted); font-size:0.9rem;">Try adjusting your search query or select another product category.</p>
          <button class="btn btn-outline btn-sm" style="margin-top:1.2rem;" onclick="window.campusApp.resetFilters()">
            <i data-lucide="rotate-ccw"></i> Reset Filters
          </button>
        </div>
      `;
      if (window.lucide) window.lucide.createIcons();
      return;
    }

    grid.innerHTML = '';
    filtered.forEach(item => {
      const cardWrapper = document.createElement('div');
      cardWrapper.className = 'gear-card-wrapper';

      const card = document.createElement('div');
      card.className = 'gear-card';
      card.dataset.id = item.id;

      card.innerHTML = `
        <div class="card-glare"></div>
        <div class="gear-image-box">
          <img src="${item.image}" alt="${item.title}" loading="lazy">
          <span class="gear-status-badge ${item.available ? 'available' : 'reserved'}">
            ${item.available ? '● Available to Borrow' : '○ Currently Loaned'}
          </span>
          <span class="gear-category-badge">${this.getCategoryName(item.category)}</span>
          <span class="gear-score-badge">
            <i data-lucide="shield-check" style="width:13px; height:13px;"></i> ${item.conditionScore}% Rating
          </span>
        </div>
        <div class="gear-content">
          <h3 class="gear-title">${item.title}</h3>
          <p class="gear-description">${item.description}</p>
          <div class="gear-specs">
            ${item.specifications.slice(0, 4).map(s => `<span class="spec-chip">${s}</span>`).join('')}
          </div>
          <div class="gear-divider"></div>
          <div class="gear-owner-row">
            <div class="owner-info">
              <div class="owner-avatar">${item.owner.name.charAt(0)}</div>
              <div class="owner-details">
                <span class="owner-name">
                  ${item.owner.name}
                  <i data-lucide="badge-check" class="verified-icon" style="width:14px; height:14px;"></i>
                </span>
                <span class="owner-dept">${item.owner.department} • ${item.owner.hostel}</span>
              </div>
            </div>
            <div class="owner-rating">
              <i data-lucide="star" style="width:13px; height:13px; fill:#f59e0b; color:#f59e0b;"></i>
              <span>${item.owner.rating}</span>
            </div>
          </div>
          <div class="gear-footer">
            <div class="gear-deposit">
              <span class="deposit-label">Refundable Deposit</span>
              <span class="deposit-val">$${item.deposit}.00</span>
            </div>
            <button class="btn ${item.available ? 'btn-primary' : 'btn-outline'} btn-sm" onclick="window.campusApp.openBorrowModal('${item.id}')">
              <i data-lucide="${item.available ? 'arrow-right' : 'clock'}"></i>
              ${item.available ? 'Borrow Product' : 'Check Waitlist'}
            </button>
          </div>
        </div>
      `;

      cardWrapper.appendChild(card);
      grid.appendChild(cardWrapper);

      // Register card for continuous smooth 3D spring tilt
      this.registerCardTilt(card);
    });

    if (window.lucide) window.lucide.createIcons();
    this.initScrollReveal();
  }

  getCategoryName(catId) {
    if (!window.CAMPUS_DATA) return catId;
    const found = window.CAMPUS_DATA.categories.find(c => c.id === catId);
    return found ? found.name : catId;
  }

  resetFilters() {
    this.activeCategory = 'all';
    this.searchQuery = '';
    const searchInput = document.getElementById('gear-search-input');
    if (searchInput) searchInput.value = '';
    const availCheck = document.getElementById('filter-available-only');
    if (availCheck) availCheck.checked = false;
    this.renderCategoryPills();
    this.renderGearGrid();
  }

  // 4. Ultra-Smooth Spring Lerp 3D Card Tilt
  registerCardTilt(card) {
    const glare = card.querySelector('.card-glare');

    const state = {
      card: card,
      glare: glare,
      currentRotX: 0,
      currentRotY: 0,
      targetRotX: 0,
      targetRotY: 0,
      currentScale: 1,
      targetScale: 1,
      glareX: 0,
      glareY: 0,
      targetGlareX: 0,
      targetGlareY: 0,
      isHovered: false
    };

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Smooth tilt limits
      state.targetRotX = -((y - centerY) / centerY) * 8.5;
      state.targetRotY = ((x - centerX) / centerX) * 8.5;
      state.targetScale = 1.02;
      state.targetGlareX = x;
      state.targetGlareY = y;
      state.isHovered = true;
    });

    card.addEventListener('mouseleave', () => {
      state.targetRotX = 0;
      state.targetRotY = 0;
      state.targetScale = 1;
      state.isHovered = false;
    });

    this.cardsWithTilt.push(state);
  }

  startCardTiltPhysicsLoop() {
    const loop = () => {
      this.cardsWithTilt.forEach(st => {
        // High-fidelity spring interpolation (lerp)
        st.currentRotX += (st.targetRotX - st.currentRotX) * 0.1;
        st.currentRotY += (st.targetRotY - st.currentRotY) * 0.1;
        st.currentScale += (st.targetScale - st.currentScale) * 0.1;

        st.card.style.transform = `perspective(1000px) rotateX(${st.currentRotX.toFixed(3)}deg) rotateY(${st.currentRotY.toFixed(3)}deg) scale3d(${st.currentScale.toFixed(3)}, ${st.currentScale.toFixed(3)}, ${st.currentScale.toFixed(3)})`;

        if (st.glare) {
          if (st.isHovered) {
            st.glareX += (st.targetGlareX - st.glareX) * 0.15;
            st.glareY += (st.targetGlareY - st.glareY) * 0.15;
            st.glare.style.opacity = '1';
            st.glare.style.background = `radial-gradient(circle at ${st.glareX.toFixed(1)}px ${st.glareY.toFixed(1)}px, rgba(255,255,255,0.18) 0%, transparent 60%)`;
          } else {
            st.glare.style.opacity = '0';
          }
        }
      });

      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  // 5. Modals Management (Borrow, Post)
  initModals() {
    const postGearBtns = document.querySelectorAll('[data-open-modal="post-gear"]');
    const postGearModal = document.getElementById('post-gear-modal');
    postGearBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.openModal(postGearModal);
      });
    });

    document.querySelectorAll('.modal-close-btn, [data-modal-close]').forEach(btn => {
      btn.addEventListener('click', () => {
        const modal = btn.closest('.modal-overlay');
        if (modal) this.closeModal(modal);
      });
    });

    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          this.closeModal(overlay);
        }
      });
    });

    const postForm = document.getElementById('post-gear-form');
    if (postForm) {
      postForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handlePostGearSubmit(postForm);
      });
    }
  }

  openModal(modal) {
    if (!modal) return;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  openBorrowModal(gearId) {
    const item = this.gearList.find(g => g.id === gearId);
    if (!item) return;

    const modal = document.getElementById('borrow-modal');
    const container = document.getElementById('borrow-modal-content');
    if (!modal || !container) return;

    container.innerHTML = `
      <div style="display:flex; gap:1.5rem; align-items:flex-start; margin-bottom:1.5rem;">
        <img src="${item.image}" alt="${item.title}" style="width:130px; height:100px; object-fit:cover; border-radius:10px; border:1px solid var(--border-blueprint);">
        <div style="flex:1;">
          <span class="blueprint-badge" style="margin-bottom:0.4rem;">${this.getCategoryName(item.category)}</span>
          <h4 style="font-size:1.2rem; color:#fff; margin-bottom:0.3rem;">${item.title}</h4>
          <p style="font-size:0.85rem; color:var(--text-muted);">${item.description}</p>
        </div>
      </div>

      <!-- Deposit & Fee Breakdown -->
      <div class="modal-escrow-box">
        <div class="escrow-row">
          <span style="color:var(--text-muted);">Refundable Escrow Deposit</span>
          <span class="mono" style="color:#fff; font-weight:700;">$${item.deposit}.00</span>
        </div>
        <div class="escrow-row">
          <span style="color:var(--text-muted);">Rental Usage Fee</span>
          <span class="mono" style="color:var(--emerald-sdg); font-weight:700;">${item.feeType}</span>
        </div>
        <div class="escrow-row total">
          <span style="color:#fff;">Total Escrow Hold (Returned on Handover)</span>
          <span class="mono" style="color:var(--cyan-primary); font-size:1.2rem;">$${item.deposit}.00</span>
        </div>
      </div>

      <!-- Return Schedule -->
      <div class="form-row" style="margin-top:0.5rem;">
        <div class="form-group">
          <label class="form-label">Rental Duration</label>
          <select id="borrow-duration-select" class="form-select">
            <option value="3">3 Days (Quick Lab / Exam)</option>
            <option value="7" selected>7 Days (Standard Week)</option>
            <option value="14">14 Days (Full Course Module)</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Campus Pickup Location</label>
          <input type="text" class="form-input" value="${item.owner.hostel}" readonly>
        </div>
      </div>

      <div style="background:rgba(56,189,248,0.06); border:1px solid var(--border-blueprint); border-radius:10px; padding:1rem; margin-top:0.5rem;">
        <label class="check-item" style="cursor:pointer;">
          <input type="checkbox" id="borrow-terms-checkbox" checked>
          <span style="font-size:0.82rem; color:#f1f5f9;">
            I agree to return the product in verified working condition at <strong>${item.owner.hostel}</strong> before the selected due date.
          </span>
        </label>
      </div>

      <div class="modal-footer" style="padding:1.5rem 0 0 0; background:transparent;">
        <button class="btn btn-outline" data-modal-close>Cancel</button>
        <button class="btn btn-primary" onclick="window.campusApp.confirmBorrowRequest('${item.id}')">
          <i data-lucide="check-circle-2"></i> Confirm Borrow Request
        </button>
      </div>
    `;

    this.openModal(modal);
    if (window.lucide) window.lucide.createIcons();
  }

  confirmBorrowRequest(gearId) {
    const item = this.gearList.find(g => g.id === gearId);
    if (!item) return;

    const modal = document.getElementById('borrow-modal');
    this.closeModal(modal);

    if (typeof confetti === 'function') {
      confetti({ particleCount: 85, spread: 75, origin: { y: 0.6 } });
    }

    this.showToast(
      'Borrow Request Confirmed!',
      `You requested “${item.title}”. Pickup arranged with ${item.owner.name} at ${item.owner.hostel}.`,
      'success'
    );
  }

  handlePostGearSubmit(form) {
    const title = form.querySelector('#post-title').value;
    const category = form.querySelector('#post-category').value;
    const description = form.querySelector('#post-desc').value;
    const deposit = parseFloat(form.querySelector('#post-deposit').value) || 20;
    const imageSelect = form.querySelector('#post-image').value;
    const hostel = form.querySelector('#post-location').value || 'Hostel Block B';

    if (!title || !description) {
      this.showToast('Missing Fields', 'Please complete the product title and description.', 'warning');
      return;
    }

    const newGear = {
      id: `gear-${Date.now()}`,
      title: title,
      category: category,
      image: imageSelect,
      description: description,
      condition: "Pristine (Verified)",
      conditionScore: 99,
      deposit: deposit,
      rentalFee: 0,
      feeType: "Free Campus Share",
      duration: "Up to 14 days",
      owner: {
        name: "You (Verified Student)",
        department: "Engineering '26",
        hostel: hostel,
        rating: 5.0,
        reviewsCount: 1,
        verified: true,
        eduEmail: "student@campus.edu"
      },
      specifications: ["Campus ID Verified", "Immediate Handover", "Exam Tested"],
      available: true
    };

    this.gearList.unshift(newGear);
    this.renderGearGrid();

    const postModal = document.getElementById('post-gear-modal');
    this.closeModal(postModal);
    form.reset();

    if (typeof confetti === 'function') {
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
    }

    this.showToast(
      'Product Listed for Lending!',
      `“${title}” is now live and available for campus peers to borrow.`,
      'success'
    );
  }

  // 6. Toast Notification System
  showToast(title, message, type = 'info') {
    const rack = document.getElementById('toast-rack');
    if (!rack) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    let iconName = type === 'success' ? 'check-circle-2' : (type === 'warning' ? 'alert-triangle' : 'info');

    toast.innerHTML = `
      <i data-lucide="${iconName}" class="toast-icon"></i>
      <div class="toast-content">
        <h4 class="toast-title">${title}</h4>
        <p class="toast-msg">${message}</p>
      </div>
    `;

    rack.appendChild(toast);
    if (window.lucide) window.lucide.createIcons();

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(40px)';
      setTimeout(() => toast.remove(), 300);
    }, 4500);
  }

  // 7. Keyboard Shortcut (⌘K / Ctrl+K)
  initKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('gear-search-input');
        if (searchInput) {
          searchInput.focus();
          searchInput.select();
        }
      }
    });
  }
}

// Global initialization
window.addEventListener('DOMContentLoaded', () => {
  window.campusApp = new CampusGearApp();
});
