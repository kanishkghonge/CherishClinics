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
    let autoSlideTimer = null;

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

    // Auto-slide every 5 seconds
    const startAutoSlide = () => {
      autoSlideTimer = setInterval(() => {
        updateSlider(currentSlideIndex + 1);
      }, 5000);
    };

    const resetAutoSlide = () => {
      clearInterval(autoSlideTimer);
      startAutoSlide();
    };

    nextBtn.addEventListener('click', () => {
      updateSlider(currentSlideIndex + 1);
      resetAutoSlide();
    });

    prevBtn.addEventListener('click', () => {
      updateSlider(currentSlideIndex - 1);
      resetAutoSlide();
    });

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        updateSlider(index);
        resetAutoSlide();
      });
    });

    startAutoSlide();
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
  // 7. Booking Wizard Steps, Timezone conversion, and Nutritionist Path
  // ==========================================
  let activeStep = 1;
  const bookingStepperMax = 4;

  // Booking states
  let consultType = 'In-Clinic Consultation';
  let doctorName = 'Dr. K. Jyothirmayi';
  let appointmentDate = '';
  let appointmentTime = '';
  
  // Region/Currency state defaults
  let selectedCountry = 'in';
  let currencySymbol = '₹';
  let currencyCode = 'INR';

  // Consultation regions and pricing
  const countryConfig = {
    'in': { symbol: '₹', code: 'INR', region: 'india' },
    'gulf': { symbol: '₹', code: 'INR', region: 'regional' },
    'sg': { symbol: '₹', code: 'INR', region: 'regional' },
    'my': { symbol: '₹', code: 'INR', region: 'regional' },
    'au': { symbol: '₹', code: 'INR', region: 'regional' },
    'us': { symbol: '₹', code: 'INR', region: 'international' },
    'ca': { symbol: '₹', code: 'INR', region: 'international' },
    'uk': { symbol: '₹', code: 'INR', region: 'international' },
    'eu': { symbol: '₹', code: 'INR', region: 'international' },
    'other': { symbol: '₹', code: 'INR', region: 'international' }
  };

  const getTimezoneTime = (istTime) => {
    return `${istTime} IST`;
  };

  const getPriceForSelectedDoctor = () => {
    return selectedCountry === 'in' ? 800 : 1500;
  };

  // DOM Elements
  const bookingPrev = document.getElementById('booking-prev');
  const bookingNext = document.getElementById('booking-next');
  const stepFillLine = document.getElementById('booking-progress-fill');
  
  // step cards selection
  const offlineCard = document.getElementById('type-offline');
  const teleCard = document.getElementById('type-tele');
  const nutritionCard = document.getElementById('type-nutrition');
  
  const docJyo = document.getElementById('doc-jyo');
  const docKalyan = document.getElementById('doc-kalyan');
  const docNutritionist = document.getElementById('doc-nutritionist');
  const step2Heading = document.getElementById('step-2-heading');

  // Timezone modal elements
  const tzModal = document.getElementById('timezone-modal');
  const tzConfirmBtn = document.getElementById('timezone-modal-confirm');
  const countrySelector = document.getElementById('country-selector');

  const isForeignCountry = () => selectedCountry !== 'in';

  const applyCountryConsultVisibility = () => {
    if (!offlineCard || !teleCard || !nutritionCard) return;

    if (isForeignCountry()) {
      offlineCard.style.display = 'none';
      if (consultType === 'In-Clinic Consultation') {
        consultType = 'Telehealth Video Consult';
        teleCard.classList.add('active');
        offlineCard.classList.remove('active');
        nutritionCard.classList.remove('active');
      }
    } else {
      offlineCard.style.display = '';
    }
  };

  // Timezone popup modal interactions
  if (tzModal && tzConfirmBtn && countrySelector) {
    // Show modal automatically
    tzModal.classList.add('open');

    tzConfirmBtn.addEventListener('click', () => {
      selectedCountry = countrySelector.value;
      const config = countryConfig[selectedCountry] || countryConfig.in;
      currencySymbol = config.symbol;
      currencyCode = config.code;
      applyCountryConsultVisibility();
      
      // Close modal
      tzModal.classList.remove('open');
    });
  }

  if (bookingNext && bookingPrev) {

    // Step 1 toggling
    const selectConsultType = (type, activeCard, inactiveCards) => {
      if (type === 'In-Clinic Consultation' && isForeignCountry()) return;

      consultType = type;
      activeCard.classList.add('active');
      inactiveCards.forEach(card => card.classList.remove('active'));
      appointmentDate = '';
      appointmentTime = '';

      // If Nutritionist Teleconsult is selected, modify Step 2 view
      if (type === 'Nutritionist Teleconsult') {
        if (docNutritionist) docNutritionist.style.display = 'block';
        if (docJyo) docJyo.style.display = 'none';
        if (docKalyan) docKalyan.style.display = 'none';
        
        // Select Nutritionist as default doctor
        if (docNutritionist && docJyo && docKalyan) {
          docNutritionist.classList.add('active');
          docJyo.classList.remove('active');
          docKalyan.classList.remove('active');
        }
        doctorName = 'Ms. Ananya Sen';
        if (step2Heading) step2Heading.innerText = 'Select Nutrition Specialist';
      } else {
        if (docNutritionist) docNutritionist.style.display = 'none';
        if (docJyo) docJyo.style.display = 'block';
        if (docKalyan) docKalyan.style.display = 'block';
        
        // Default to Dr Jyo
        if (docNutritionist && docJyo && docKalyan) {
          docJyo.classList.add('active');
          docNutritionist.classList.remove('active');
          docKalyan.classList.remove('active');
        }
        doctorName = 'Dr. K. Jyothirmayi';
        if (step2Heading) step2Heading.innerText = 'Select Pediatrician';
      }
    };

    if (offlineCard && teleCard && nutritionCard) {
      applyCountryConsultVisibility();
      offlineCard.addEventListener('click', () => selectConsultType('In-Clinic Consultation', offlineCard, [teleCard, nutritionCard]));
      teleCard.addEventListener('click', () => selectConsultType('Telehealth Video Consult', teleCard, [offlineCard, nutritionCard]));
      nutritionCard.addEventListener('click', () => selectConsultType('Nutritionist Teleconsult', nutritionCard, [offlineCard, teleCard]));
    }

    // Step 2 toggling
    if (docJyo && docKalyan && docNutritionist) {
      docJyo.addEventListener('click', () => {
        docJyo.classList.add('active');
        docKalyan.classList.remove('active');
        docNutritionist.classList.remove('active');
        doctorName = 'Dr. K. Jyothirmayi';
        appointmentDate = '';
        appointmentTime = '';
        if (activeStep === 3) {
          generateWizardDates();
          generateWizardTimeSlots();
        }
      });

      docKalyan.addEventListener('click', () => {
        docKalyan.classList.add('active');
        docJyo.classList.remove('active');
        docNutritionist.classList.remove('active');
        doctorName = 'Dr. Kalyan C. Battineni';
        appointmentDate = '';
        appointmentTime = '';
        if (activeStep === 3) {
          generateWizardDates();
          generateWizardTimeSlots();
        }
      });

      docNutritionist.addEventListener('click', () => {
        docNutritionist.classList.add('active');
        docJyo.classList.remove('active');
        docKalyan.classList.remove('active');
        doctorName = 'Ms. Ananya Sen';
        appointmentDate = '';
        appointmentTime = '';
        if (activeStep === 3) {
          generateWizardDates();
          generateWizardTimeSlots();
        }
      });
    }

    // Step 3 Populating dates dynamically
    const dateScrollRow = document.getElementById('date-scroll-row');
    const slotsTimeGrid = document.getElementById('slots-time-grid');

    const parseTimeToMinutes = (time) => {
      const match = time.match(/^(\d{1,2}):(\d{2})\s(AM|PM)$/);
      if (!match) return 0;
      let hours = Number(match[1]);
      const minutes = Number(match[2]);
      const period = match[3];

      if (period === 'PM' && hours !== 12) hours += 12;
      if (period === 'AM' && hours === 12) hours = 0;

      return (hours * 60) + minutes;
    };

    const formatMinutesToTime = (totalMinutes) => {
      const hours24 = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      const period = hours24 >= 12 ? 'PM' : 'AM';
      const hours12 = hours24 % 12 || 12;
      return `${hours12}:${String(minutes).padStart(2, '0')} ${period}`;
    };

    const buildSlots = (startTime, endTime) => {
      const slots = [];
      const start = parseTimeToMinutes(startTime);
      const end = parseTimeToMinutes(endTime);

      for (let time = start; time < end; time += 15) {
        slots.push(formatMinutesToTime(time));
      }

      return slots;
    };

    const getConsultWindow = () => {
      const config = countryConfig[selectedCountry] || countryConfig.in;

      if (doctorName === 'Dr. Kalyan C. Battineni') {
        return { days: [1, 2, 3, 4, 5, 6], start: '5:30 PM', end: '8:00 PM' };
      }

      if (doctorName === 'Ms. Ananya Sen') {
        return { days: [1, 2, 3, 4, 5, 6], start: '5:30 PM', end: '8:00 PM' };
      }

      if (consultType === 'In-Clinic Consultation') {
        return { days: [1, 2, 3, 4, 5, 6], start: '9:00 AM', end: '2:00 PM' };
      }

      if (config.region === 'international') {
        return { days: [2, 4], start: '8:00 PM', end: '9:00 PM' };
      }

      return { days: [1, 3, 5], start: '2:30 PM', end: '3:30 PM' };
    };

    const generateWizardDates = () => {
      dateScrollRow.innerHTML = '';
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const consultWindow = getConsultWindow();
      
      const today = new Date();
      let createdCount = 0;

      for (let i = 0; i < 21 && createdCount < 4; i++) {
        const futDate = new Date();
        futDate.setDate(today.getDate() + i + 1);

        if (!consultWindow.days.includes(futDate.getDay())) continue;

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

    const generateWizardTimeSlots = () => {
      slotsTimeGrid.innerHTML = '';
      appointmentTime = ''; // reset on date change
      const consultWindow = getConsultWindow();
      const slotsList = buildSlots(consultWindow.start, consultWindow.end);

      slotsList.forEach(slot => {
        const converted = getTimezoneTime(slot);
        const pill = document.createElement('button');
        pill.classList.add('wizard-slot-pill');
        pill.innerText = converted;

        pill.addEventListener('click', () => {
          document.querySelectorAll('.wizard-slot-pill').forEach(p => p.classList.remove('active'));
          pill.classList.add('active');
          appointmentTime = converted;
        });

        slotsTimeGrid.appendChild(pill);
      });

      if (!slotsList.length) {
        slotsTimeGrid.innerHTML = '<p style="color: var(--text-secondary);">No slots available for this selection.</p>';
      }
    };

    // Step 4: Checkout Summary Update
    const renderCheckoutSummary = () => {
      const price = getPriceForSelectedDoctor();
      document.getElementById('sum-type').innerText = consultType;
      document.getElementById('sum-doc').innerText = doctorName;
      document.getElementById('sum-date').innerText = appointmentDate;
      document.getElementById('sum-time').innerText = appointmentTime || 'Select Time';
      document.getElementById('sum-fee').innerText = `${currencySymbol}${price}.00`;
      document.getElementById('sum-total').innerText = `${currencySymbol}${price}.00`;
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
        const price = getPriceForSelectedDoctor();
        let successMsg = '';

        if (payMethod === 'upi') {
          const upiId = document.getElementById('upi-id').value || 'your VPA ID';
          successMsg = `Congratulations! Your ${consultType} with ${doctorName} is scheduled for ${appointmentDate} at ${appointmentTime}. A secure UPI payment request of ${currencySymbol}${price}.00 was pushed to ${upiId}.`;
        } else if (payMethod === 'card') {
          successMsg = `Payment of ${currencySymbol}${price}.00 received successfully. Your ${consultType} with ${doctorName} is confirmed for ${appointmentDate} at ${appointmentTime}.`;
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

  const upiInputPane = document.getElementById('upi-inputs-panel');
  const ccInputPane = document.getElementById('cc-inputs-panel');
  const ccGraphic = document.getElementById('payment-card-graphic');

  const showUpiForm = () => {
    if (payUpi) payUpi.classList.add('active');
    if (payCard) payCard.classList.remove('active');
    
    if (upiInputPane) upiInputPane.style.display = 'block';
    if (ccInputPane) ccInputPane.style.display = 'none';
    if (ccGraphic) ccGraphic.style.display = 'none';
  };

  const showCardForm = () => {
    if (payCard) payCard.classList.add('active');
    if (payUpi) payUpi.classList.remove('active');
    
    if (ccInputPane) ccInputPane.style.display = 'block';
    if (ccGraphic) ccGraphic.style.display = 'block';
    if (upiInputPane) upiInputPane.style.display = 'none';
  };

  if (payUpi && payCard) {
    // Radio buttons change tracking
    document.querySelectorAll('input[name="pay-method"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        if (e.target.value === 'upi') showUpiForm();
        if (e.target.value === 'card') showCardForm();
      });
    });
    
    // Fallback pill click handlers
    payUpi.addEventListener('click', () => {
      const radio = document.querySelector('input[name="pay-method"][value="upi"]');
      if (radio) radio.checked = true;
      showUpiForm();
    });
    payCard.addEventListener('click', () => {
      const radio = document.querySelector('input[name="pay-method"][value="card"]');
      if (radio) radio.checked = true;
      showCardForm();
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
      if (ccNumPreview) ccNumPreview.innerText = formatted || '•••• •••• •••• ••••';
    });

    // Formatting expiry (MM/YY)
    ccExpiryInput.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
      if (val.length > 2) {
        val = val.substring(0, 2) + '/' + val.substring(2, 4);
      }
      e.target.value = val;
      if (ccExpiryPreview) ccExpiryPreview.innerText = val || 'MM/YY';
    });

    // Syncing Cardholder name
    ccNameInput.addEventListener('input', (e) => {
      if (ccNamePreview) ccNamePreview.innerText = e.target.value.toUpperCase() || 'YOUR NAME';
    });

    // Formatting CVV
    ccCvvInput.addEventListener('input', (e) => {
      let val = e.target.value.replace(/[^0-9]/gi, '');
      e.target.value = val;
      if (ccCvvPreview) ccCvvPreview.innerText = val || '•••';
    });
  }

  // ==========================================
  // 6. Resources Page Interactive Filtering & Search
  // ==========================================
  window.filterResources = function(type) {
    const cards = document.querySelectorAll('.resource-card-link');
    const btnAll = document.getElementById('filter-btn-all');
    const btnTools = document.getElementById('filter-btn-tools');
    const btnBlogs = document.getElementById('filter-btn-blogs');

    // Toggle active class on filter buttons
    if (btnAll) btnAll.classList.toggle('active', type === 'all');
    if (btnTools) btnTools.classList.toggle('active', type === 'tools');
    if (btnBlogs) btnBlogs.classList.toggle('active', type === 'blogs');

    cards.forEach(card => {
      const cardType = card.getAttribute('data-type');
      const searchInput = document.getElementById('resource-search-input');
      const searchQuery = searchInput ? searchInput.value.toLowerCase().trim() : '';

      const matchesType = (type === 'all' || cardType === type);
      const cardText = card.textContent.toLowerCase();
      const matchesSearch = !searchQuery || cardText.includes(searchQuery);

      if (matchesType && matchesSearch) {
        card.style.display = 'block';
        // Small delay to trigger CSS opacity transition
        requestAnimationFrame(() => {
          card.style.opacity = '1';
          card.style.transform = 'scale(1)';
        });
      } else {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.95)';
        setTimeout(() => {
          if (card.style.opacity === '0') {
            card.style.display = 'none';
          }
        }, 300);
      }
    });
  };

  // Search input change handler
  const searchInput = document.getElementById('resource-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      // Find currently active category type
      let activeType = 'all';
      const btnTools = document.getElementById('filter-btn-tools');
      const btnBlogs = document.getElementById('filter-btn-blogs');
      
      if (btnTools && btnTools.classList.contains('active')) activeType = 'tools';
      else if (btnBlogs && btnBlogs.classList.contains('active')) activeType = 'blogs';

      window.filterResources(activeType);
    });
  }

});
