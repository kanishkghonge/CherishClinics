/* script.js - Cherish Children's Clinic Unified Script Controller */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. Global Header sticky transition & Active page tab highlight
  // ==========================================
  const header = document.getElementById('main-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 30) {
        header.classList.add('header-scrolled');
      } else {
        header.classList.remove('header-scrolled');
      }
    });
  }

  // Active navigation tab detection
  const navLinks = document.querySelectorAll('.nav-menu .nav-link');
  const currentFilename = window.location.pathname.split('/').pop() || 'index.html';
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('href');
    if (href === currentFilename) {
      link.classList.add('active');
    }
  });

  // ==========================================
  // 2. Mobile Nav Drawer Toggle
  // ==========================================
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileDrawerClose = document.getElementById('mobile-drawer-close');
  const mobileDrawerLinks = document.querySelectorAll('.mobile-nav-drawer a');

  if (mobileToggle && mobileDrawer && mobileDrawerClose) {
    mobileToggle.addEventListener('click', () => {
      mobileDrawer.classList.add('open');
    });

    const closeMobileDrawer = () => {
      mobileDrawer.classList.remove('open');
    };

    mobileDrawerClose.addEventListener('click', closeMobileDrawer);
    mobileDrawerLinks.forEach(link => {
      link.addEventListener('click', closeMobileDrawer);
    });
  }

  // ==========================================
  // 3. Testimonials Swipe Slider (Featured reviews)
  // ==========================================
  const track = document.getElementById('testimonial-track');
  const prevBtn = document.getElementById('slide-prev');
  const nextBtn = document.getElementById('slide-next');
  const dotsContainer = document.getElementById('slider-dots');

  if (track && prevBtn && nextBtn && dotsContainer) {
    const slides = Array.from(track.children);
    let currentSlideIndex = 0;

    // Build dots dynamically
    slides.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.classList.add('slider-dot');
      if (index === 0) dot.classList.add('active');
      dot.setAttribute('aria-label', `Navigate to slide ${index + 1}`);
      dotsContainer.appendChild(dot);
    });

    const dots = Array.from(dotsContainer.children);

    const updateSlider = (targetIndex) => {
      if (targetIndex < 0) targetIndex = slides.length - 1;
      if (targetIndex >= slides.length) targetIndex = 0;

      track.style.transform = `translateX(-${targetIndex * 100}%)`;
      
      dots[currentSlideIndex].classList.remove('active');
      dots[targetIndex].classList.add('active');
      
      currentSlideIndex = targetIndex;
    };

    nextBtn.addEventListener('click', () => {
      updateSlider(currentSlideIndex + 1);
    });

    prevBtn.addEventListener('click', () => {
      updateSlider(currentSlideIndex - 1);
    });

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        updateSlider(index);
      });
    });
  }

  // ==========================================
  // 4. Services Accordions (What to Expect)
  // ==========================================
  const accordions = document.querySelectorAll('.service-accordion');
  accordions.forEach(acc => {
    const accordionHeader = acc.querySelector('.service-accordion-header');
    const accordionContent = acc.querySelector('.service-accordion-content');
    
    if (accordionHeader && accordionContent) {
      accordionHeader.addEventListener('click', () => {
        const isOpen = acc.classList.contains('active');
        
        // Toggle active state
        acc.classList.toggle('active');
        if (!isOpen) {
          accordionContent.style.maxHeight = accordionContent.scrollHeight + 'px';
        } else {
          accordionContent.style.maxHeight = '0px';
        }
      });
    }
  });

  // ==========================================
  // 5. Interactive BMI Calculator
  // ==========================================
  const boyBtn = document.getElementById('gender-boy-btn');
  const girlBtn = document.getElementById('gender-girl-btn');
  const sliderAge = document.getElementById('slider-age');
  const sliderHeight = document.getElementById('slider-height');
  const sliderWeight = document.getElementById('slider-weight');
  const valAge = document.getElementById('val-age');
  const valHeight = document.getElementById('val-height');
  const valWeight = document.getElementById('val-weight');
  const resBmiVal = document.getElementById('res-bmi-val');
  const resBmiStatus = document.getElementById('res-bmi-status');
  const resBmiTitle = document.getElementById('res-bmi-title');
  const resBmiDesc = document.getElementById('res-bmi-desc');
  const bmiGaugeFill = document.getElementById('bmi-gauge-fill');
  const bmiNudgeCard = document.getElementById('bmi-nudge-card');
  const bmiLoader = document.getElementById('bmi-loader');
  const bmiResultContent = document.getElementById('bmi-result-content');
  const bmiLoaderFill = document.getElementById('bmi-loader-fill');

  if (sliderAge && sliderHeight && sliderWeight) {
    let gender = 'boy';
    let bmiTimeout = null;

    const calculateBmi = () => {
      const ageVal = parseFloat(sliderAge.value);
      const heightVal = parseFloat(sliderHeight.value);
      const weightVal = parseFloat(sliderWeight.value);

      const heightMeters = heightVal / 100;
      let bmi = weightVal / (heightMeters * heightMeters);
      bmi = Math.round(bmi * 10) / 10;

      if (resBmiVal) resBmiVal.innerText = bmi;

      // Animate circular SVG gauge (r=70 -> Circumference = 439.6)
      const circumference = 439.6;
      // Map BMI range [10, 35] to percentage [0, 100]
      let percent = ((bmi - 10) / 25) * 100;
      if (percent < 0) percent = 0;
      if (percent > 100) percent = 100;

      const offset = circumference - (circumference * percent / 100);
      if (bmiGaugeFill) bmiGaugeFill.style.strokeDashoffset = offset;

      // Interpretation Thresholds based on pediatric references
      let underweightLimit = 14.0;
      let healthyLimit = 18.5;
      let overweightLimit = 22.5;

      if (ageVal < 5) {
        underweightLimit = 13.8; healthyLimit = 17.2; overweightLimit = 19.2;
      } else if (ageVal < 9) {
        underweightLimit = 13.5; healthyLimit = 18.2; overweightLimit = 21.2;
      } else if (ageVal < 13) {
        underweightLimit = 14.5; healthyLimit = 21.2; overweightLimit = 24.2;
      } else if (ageVal < 17) {
        underweightLimit = 16.0; healthyLimit = 23.8; overweightLimit = 27.2;
      } else {
        underweightLimit = 18.5; healthyLimit = 24.9; overweightLimit = 29.9;
      }

      let category = '';
      let statusClass = '';
      let statusTextTitle = '';
      let statusTextDesc = '';
      let showNudge = false;
      let strokeColor = '';

      if (bmi < underweightLimit) {
        category = 'Underweight';
        statusClass = 'underweight';
        statusTextTitle = 'Growth Deficit Risk';
        statusTextDesc = 'Your child’s weight is below the expected percentile for their age and height. This may suggest nutritional gaps.';
        showNudge = true;
        strokeColor = '#e0a96d'; // Gold/Yellow
      } else if (bmi <= healthyLimit) {
        category = 'Healthy Weight';
        statusClass = 'healthy';
        statusTextTitle = 'Optimal Growth';
        statusTextDesc = 'Your child’s weight is in the healthy percentile. Continue supporting growth with diverse nutrition and daily activities.';
        showNudge = false;
        strokeColor = '#3e5c4a'; // Forest Sage green
      } else if (bmi <= overweightLimit) {
        category = 'Overweight';
        statusClass = 'warning';
        statusTextTitle = 'Elevated Growth Curve';
        statusTextDesc = 'Your child’s BMI falls in the overweight range. Consider portion balances and outdoor play adjustments.';
        showNudge = true;
        strokeColor = '#c67b73'; // Terracotta Rose
      } else {
        category = 'Obese';
        statusClass = 'danger';
        statusTextTitle = 'Obesity Concerns';
        statusTextDesc = 'Your child’s growth chart indicates obesity. We advise consulting a specialist to assess diet and metabolic growth signs.';
        showNudge = true;
        strokeColor = '#a85650'; // Dark terracotta red
      }

      // Update styles
      if (resBmiStatus) {
        resBmiStatus.className = `bmi-status-badge ${statusClass}`;
        resBmiStatus.innerText = category;
      }
      if (resBmiTitle) resBmiTitle.innerText = statusTextTitle;
      if (resBmiDesc) resBmiDesc.innerText = statusTextDesc;
      if (bmiGaugeFill) bmiGaugeFill.style.stroke = strokeColor;

      if (bmiNudgeCard) {
        if (showNudge) {
          bmiNudgeCard.style.display = 'flex';
        } else {
          bmiNudgeCard.style.display = 'none';
        }
      }
    };

    const triggerBmiCalculationWithLoader = () => {
      const ageVal = parseFloat(sliderAge.value);
      const heightVal = parseFloat(sliderHeight.value);
      const weightVal = parseFloat(sliderWeight.value);

      // Render sliders text labels instantly in real-time
      if (valAge) valAge.innerText = ageVal;
      if (valHeight) valHeight.innerText = heightVal;
      if (valWeight) valWeight.innerText = weightVal;

      // Show loader and hide result content
      if (bmiLoader && bmiResultContent) {
        bmiLoader.style.display = 'flex';
        bmiResultContent.style.display = 'none';
      }

      // Reset loading progress animation
      if (bmiLoaderFill) {
        bmiLoaderFill.style.animation = 'none';
        void bmiLoaderFill.offsetWidth; // force reflow
        bmiLoaderFill.style.animation = 'loadProgress 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards';
      }

      // Debounce and trigger compute after fake loading (800ms)
      if (bmiTimeout) clearTimeout(bmiTimeout);
      bmiTimeout = setTimeout(() => {
        calculateBmi();
        if (bmiLoader && bmiResultContent) {
          bmiLoader.style.display = 'none';
          bmiResultContent.style.display = 'block';
        }
      }, 800);
    };

    if (boyBtn && girlBtn) {
      boyBtn.addEventListener('click', () => {
        boyBtn.classList.add('active');
        girlBtn.classList.remove('active');
        gender = 'boy';
        triggerBmiCalculationWithLoader();
      });

      girlBtn.addEventListener('click', () => {
        girlBtn.classList.add('active');
        boyBtn.classList.remove('active');
        gender = 'girl';
        triggerBmiCalculationWithLoader();
      });
    }

    // Sliders event listeners (both input and change)
    sliderAge.addEventListener('input', triggerBmiCalculationWithLoader);
    sliderAge.addEventListener('change', triggerBmiCalculationWithLoader);
    sliderHeight.addEventListener('input', triggerBmiCalculationWithLoader);
    sliderHeight.addEventListener('change', triggerBmiCalculationWithLoader);
    sliderWeight.addEventListener('input', triggerBmiCalculationWithLoader);
    sliderWeight.addEventListener('change', triggerBmiCalculationWithLoader);

    // Run initial calculation without loader overlay delay
    calculateBmi();
  }

  // ==========================================
  // 6. Developmental Milestones Age Tabs
  // ==========================================
  const ageDockBtns = document.querySelectorAll('.age-dock-btn');
  const milestonesPanels = document.querySelectorAll('.timeline-list-panel');

  if (ageDockBtns.length > 0 && milestonesPanels.length > 0) {
    ageDockBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        ageDockBtns.forEach(b => b.classList.remove('active'));
        milestonesPanels.forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        const targetAge = btn.getAttribute('data-age');
        document.getElementById(`milestones-panel-${targetAge}`).classList.add('active');
      });
    });
  }

  // ==========================================
  // 7. Booking Wizard Steps & Credit Card Flip
  // ==========================================
  let activeStep = 1;
  const bookingStepperMax = 4;

  // Booking states
  let consultType = 'In-Clinic Consultation';
  let doctorName = 'Dr. K. Jyothirmayi';
  let appointmentDate = '';
  let appointmentTime = '';
  let consultationPrice = 500;

  // DOM Elements
  const bookingPrev = document.getElementById('booking-prev');
  const bookingNext = document.getElementById('booking-next');
  const stepFillLine = document.getElementById('booking-progress-fill');
  
  // step cards selection
  const offlineCard = document.getElementById('type-offline');
  const teleCard = document.getElementById('type-tele');
  const docJyo = document.getElementById('doc-jyo');
  const docX = document.getElementById('doc-x');

  if (bookingNext && bookingPrev) {

    // Step 1 toggling
    if (offlineCard && teleCard) {
      offlineCard.addEventListener('click', () => {
        offlineCard.classList.add('active');
        teleCard.classList.remove('active');
        consultType = 'In-Clinic Consultation';
      });

      teleCard.addEventListener('click', () => {
        teleCard.classList.add('active');
        offlineCard.classList.remove('active');
        consultType = 'Telehealth Video Consult';
      });
    }

    // Step 2 toggling
    if (docJyo && docX) {
      docJyo.addEventListener('click', () => {
        docJyo.classList.add('active');
        docX.classList.remove('active');
        doctorName = 'Dr. K. Jyothirmayi';
        consultationPrice = 500;
      });

      docX.addEventListener('click', () => {
        docX.classList.add('active');
        docJyo.classList.remove('active');
        doctorName = 'Dr. Rohan Sharma';
        consultationPrice = 400; // Mock consultant fee
      });
    }

    // Step 3 Populating dates dynamically
    const dateScrollRow = document.getElementById('date-scroll-row');
    const slotsTimeGrid = document.getElementById('slots-time-grid');

    const generateWizardDates = () => {
      dateScrollRow.innerHTML = '';
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      const today = new Date();
      let createdCount = 0;

      for (let i = 0; i < 7 && createdCount < 4; i++) {
        const futDate = new Date();
        futDate.setDate(today.getDate() + i + 1);

        // Skip Sunday
        if (futDate.getDay() === 0) continue;

        const dayName = days[futDate.getDay()];
        const dateNum = futDate.getDate();
        const monthName = months[futDate.getMonth()];
        const dateStr = `${dayName}, ${monthName} ${dateNum}, ${futDate.getFullYear()}`;

        const card = document.createElement('div');
        card.classList.add('wizard-date-rack-card', 'glass-card');
        
        if (createdCount === 0) {
          card.classList.add('active');
          appointmentDate = dateStr;
        }

        card.innerHTML = `
          <span class="day">${dayName}</span>
          <span class="date">${dateNum}</span>
        `;

        card.addEventListener('click', () => {
          document.querySelectorAll('.wizard-date-rack-card').forEach(c => c.classList.remove('active'));
          card.classList.add('active');
          appointmentDate = dateStr;
          generateWizardTimeSlots();
        });

        dateScrollRow.appendChild(card);
        createdCount++;
      }
    };

    const slotsList = ["10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM", "5:30 PM", "6:00 PM", "6:30 PM", "7:00 PM"];

    const generateWizardTimeSlots = () => {
      slotsTimeGrid.innerHTML = '';
      appointmentTime = ''; // reset on date change

      slotsList.forEach(slot => {
        const pill = document.createElement('button');
        pill.classList.add('wizard-slot-pill');
        pill.innerText = slot;

        pill.addEventListener('click', () => {
          document.querySelectorAll('.wizard-slot-pill').forEach(p => p.classList.remove('active'));
          pill.classList.add('active');
          appointmentTime = slot;
        });

        slotsTimeGrid.appendChild(pill);
      });
    };

    // Step 4: Checkout Summary Update
    const renderCheckoutSummary = () => {
      document.getElementById('sum-type').innerText = consultType;
      document.getElementById('sum-doc').innerText = doctorName;
      document.getElementById('sum-date').innerText = appointmentDate;
      document.getElementById('sum-time').innerText = appointmentTime || 'Select Time';
      document.getElementById('sum-fee').innerText = `₹${consultationPrice}.00`;
      document.getElementById('sum-total').innerText = `₹${consultationPrice}.00`;
    };

    // Stepper Navigation Handler
    const updateStepperUI = () => {
      for (let s = 1; s <= bookingStepperMax; s++) {
        const pane = document.getElementById(`booking-step-${s}`);
        const indicator = document.querySelector(`.stepper-node[data-step="${s}"]`);
        
        if (s === activeStep) {
          pane.classList.add('active');
          indicator.classList.add('active');
          indicator.classList.remove('completed');
        } else {
          pane.classList.remove('active');
          if (s < activeStep) {
            indicator.classList.add('completed');
            indicator.classList.remove('active');
          } else {
            indicator.classList.remove('completed', 'active');
          }
        }
      }

      // Progress bar percentage
      const percent = ((activeStep - 1) / (bookingStepperMax - 1)) * 100;
      stepFillLine.style.width = `${percent}%`;

      // Back button visibility
      if (activeStep === 1) {
        bookingPrev.style.visibility = 'hidden';
      } else {
        bookingPrev.style.visibility = 'visible';
      }

      // Next / Pay text
      if (activeStep === bookingStepperMax) {
        bookingNext.innerHTML = `Pay & Confirm <i class="fa-solid fa-lock" style="margin-left: 5px;"></i>`;
      } else {
        bookingNext.innerHTML = `Next Step <i class="fa-solid fa-arrow-right" style="margin-left: 5px;"></i>`;
      }
    };

    bookingNext.addEventListener('click', () => {
      // Step 3 Validation
      if (activeStep === 3) {
        if (!appointmentDate) {
          alert("Please pick a consultation date.");
          return;
        }
        if (!appointmentTime) {
          alert("Please select a time slot.");
          return;
        }
      }

      if (activeStep < bookingStepperMax) {
        activeStep++;
        if (activeStep === 3) {
          generateWizardDates();
          generateWizardTimeSlots();
        }
        if (activeStep === 4) {
          renderCheckoutSummary();
        }
        updateStepperUI();
      } else {
        // Confirm booking, display success screen
        const payMethod = document.querySelector('input[name="pay-method"]:checked').value;
        let successMsg = '';

        if (payMethod === 'upi') {
          const upiId = document.getElementById('upi-id').value || 'your VPA ID';
          successMsg = `Congratulations! Your ${consultType} with ${doctorName} is scheduled for ${appointmentDate} at ${appointmentTime}. A secure UPI payment request of ₹${consultationPrice}.00 was pushed to ${upiId}.`;
        } else if (payMethod === 'card') {
          successMsg = `Payment of ₹${consultationPrice}.00 received successfully. Your ${consultType} with ${doctorName} is confirmed for ${appointmentDate} at ${appointmentTime}.`;
        } else {
          successMsg = `Your ${consultType} with ${doctorName} is scheduled for ${appointmentDate} at ${appointmentTime}. You have chosen to pay at the clinic counter.`;
        }

        // Hide inputs and next buttons, display success
        document.getElementById('booking-step-4').classList.remove('active');
        document.getElementById('booking-success-panel').style.display = 'flex';
        document.getElementById('wizard-nav-buttons-row').style.display = 'none';
        document.querySelector('.booking-stepper-tracker').style.display = 'none';
        document.getElementById('booking-success-message').innerText = successMsg;
      }
    });

    bookingPrev.addEventListener('click', () => {
      if (activeStep > 1) {
        activeStep--;
        updateStepperUI();
      }
    });
  }

  // ==========================================
  // 8. Payment Method forms toggling & Credit Card Flip interactions
  // ==========================================
  const payUpi = document.getElementById('pay-upi-pill');
  const payCard = document.getElementById('pay-card-pill');
  const payCounter = document.getElementById('pay-counter-pill');

  const upiInputPane = document.getElementById('upi-inputs-panel');
  const ccInputPane = document.getElementById('cc-inputs-panel');
  const counterInputPane = document.getElementById('counter-inputs-panel');
  const ccGraphic = document.getElementById('payment-card-graphic');

  const showUpiForm = () => {
    payUpi.classList.add('active');
    payCard.classList.remove('active');
    payCounter.classList.remove('active');
    
    upiInputPane.style.display = 'block';
    ccInputPane.style.display = 'none';
    counterInputPane.style.display = 'none';
    ccGraphic.style.display = 'none';
  };

  const showCardForm = () => {
    payCard.classList.add('active');
    payUpi.classList.remove('active');
    payCounter.classList.remove('active');
    
    ccInputPane.style.display = 'block';
    ccGraphic.style.display = 'block';
    upiInputPane.style.display = 'none';
    counterInputPane.style.display = 'none';
  };

  const showCounterForm = () => {
    payCounter.classList.add('active');
    payUpi.classList.remove('active');
    payCard.classList.remove('active');
    
    counterInputPane.style.display = 'block';
    upiInputPane.style.display = 'none';
    ccInputPane.style.display = 'none';
    ccGraphic.style.display = 'none';
  };

  if (payUpi && payCard && payCounter) {
    // Radio buttons change tracking
    document.querySelectorAll('input[name="pay-method"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        if (e.target.value === 'upi') showUpiForm();
        if (e.target.value === 'card') showCardForm();
        if (e.target.value === 'counter') showCounterForm();
      });
    });
    
    // Fallback pill click handlers
    payUpi.addEventListener('click', () => {
      document.querySelector('input[name="pay-method"][value="upi"]').checked = true;
      showUpiForm();
    });
    payCard.addEventListener('click', () => {
      document.querySelector('input[name="pay-method"][value="card"]').checked = true;
      showCardForm();
    });
    payCounter.addEventListener('click', () => {
      document.querySelector('input[name="pay-method"][value="counter"]').checked = true;
      showCounterForm();
    });
  }

  // Credit Card Real-time Preview syncing and Flip actions
  const ccNumInput = document.getElementById('cc-number');
  const ccNameInput = document.getElementById('cc-name');
  const ccExpiryInput = document.getElementById('cc-expiry');
  const ccCvvInput = document.getElementById('cc-cvv');

  const ccNumPreview = document.getElementById('card-number-preview');
  const ccNamePreview = document.getElementById('card-holder-preview');
  const ccExpiryPreview = document.getElementById('card-expiry-preview');
  const ccCvvPreview = document.getElementById('card-cvv-preview');
  const ccCardGraphicObj = document.getElementById('payment-card-graphic');

  if (ccNumInput && ccNameInput && ccExpiryInput && ccCvvInput && ccCardGraphicObj) {
    
    // Focus actions (flip card when CVV is focused)
    ccCvvInput.addEventListener('focus', () => {
      ccCardGraphicObj.classList.add('flip');
    });
    
    ccCvvInput.addEventListener('blur', () => {
      ccCardGraphicObj.classList.remove('flip');
    });

    // Formatting card number (spacing)
    ccNumInput.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
      let formatted = '';
      for (let i = 0; i < val.length; i++) {
        if (i > 0 && i % 4 === 0) formatted += ' ';
        formatted += val[i];
      }
      e.target.value = formatted;
      ccNumPreview.innerText = formatted || '•••• •••• •••• ••••';
    });

    // Formatting expiry (MM/YY)
    ccExpiryInput.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
      if (val.length > 2) {
        val = val.substring(0, 2) + '/' + val.substring(2, 4);
      }
      e.target.value = val;
      ccExpiryPreview.innerText = val || 'MM/YY';
    });

    // Syncing Cardholder name
    ccNameInput.addEventListener('input', (e) => {
      ccNamePreview.innerText = e.target.value.toUpperCase() || 'YOUR NAME';
    });

    // Syncing CVV
    ccCvvInput.addEventListener('input', (e) => {
      let val = e.target.value.replace(/[^0-9]/gi, '');
      e.target.value = val;
      ccCvvPreview.innerText = val || '•••';
    });
  }

});
