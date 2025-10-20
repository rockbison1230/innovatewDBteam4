
/* ========== Hard-coded student profile ========== */
const student = {
    name: "Maya Johnson",
    gpa: 3.8,
    colleges: ["UCLA", "UC Berkeley"],
    major: "Computer Science",
    residency: "CA",
    year: "High School Senior",
    hasCosigner: false,
    income: 0
  };
  
  /* ========== Hard-coded loans (representative) ========== */
  const loans = [
    {
      id: 'FED-1',
      name: 'Federal Direct Subsidized Loan',
      amount: 5500,
      interestRate: 6.39,
      type: 'Federal',
      minGpa: 0,
      notes: ['FAFSA required', 'Subsidized for eligible undergrads'],
    },
    {
      id: 'SALLIE-1',
      name: 'Sallie Mae Smart Option Student Loan',
      amount: 10000,
      interestRate: 8.50,
      type: 'Private',
      minGpa: 3.2,
      notes: ['Cosigner improves approval chances','Flexible repayment options']
    },
    {
      id: 'SOFI-1',
      name: 'SoFi Private Student Loan',
      amount: 12000,
      interestRate: 5.99,
      type: 'Private',
      minGpa: 3.0,
      notes: ['Requires income/credit or cosigner','Refinancing options for grads']
    }
  ];
  
  /* ========== Acceptance-likelihood heuristic ========== */
  function acceptanceLikelihood(loan, student) {
    if (loan.type === 'Federal') {
      return { label: 'Very likely', colorClass: 'bg-green-100 text-green-800', reason: 'Federal loans awarded based on FAFSA eligibility (demo assumes FAFSA filed).' };
    }
  
    if (student.hasCosigner) {
      return { label: 'Likely', colorClass: 'bg-emerald-100 text-emerald-800', reason: 'Cosigner improves approval chances (per lender guidance).' };
    }
  
    const gpaOk = student.gpa >= (loan.minGpa || 0);
    const incomeOk = (student.income || 0) >= 8000;
  
    if (gpaOk && incomeOk) {
      return { label: 'Possible', colorClass: 'bg-amber-100 text-amber-800', reason: 'Some private lenders may approve based on strong GPA + income.' };
    }
  
    return { label: 'Unlikely', colorClass: 'bg-red-100 text-red-800', reason: 'Private lenders usually expect credit history/income or a cosigner.' };
  }
  
  /* ========== Build a single flash card element (Tailwind classes) ========== */
  function createCardElement(loan, student) {
    const likelihood = acceptanceLikelihood(loan, student);
    const container = document.createElement('article');
  
    // Tailwind classes for rectangular flash card
    container.className = 'bg-white rounded-lg shadow-soft-lg border border-slate-100 p-6 flex flex-col justify-between min-h-[190px] transition-transform hover:-translate-y-2';
  
    // inner HTML with consistent layout
    container.innerHTML = `
      <div class="flex items-start justify-between gap-4">
        <div>
          <div class="text-sm text-slate-400 font-semibold">${loan.type}</div>
          <h3 class="text-xl font-extrabold mt-1">${loan.name}</h3>
        </div>
  
        <div class="text-right">
          <div class="text-2xl font-extrabold text-primary">${loan.interestRate.toFixed(2)}%</div>
          <div class="text-sm text-slate-500 mt-1">Est. interest</div>
        </div>
      </div>
  
      <div class="mt-4 flex flex-col gap-3">
        <div class="flex items-center justify-between">
          <div class="text-sm text-slate-500">Amount</div>
          <div class="font-semibold text-lg">$${loan.amount.toLocaleString()}</div>
        </div>
  
        <div class="flex items-center justify-between">
          <div class="text-sm text-slate-500">Min GPA</div>
          <div class="font-medium">${loan.minGpa}</div>
        </div>
  
        <div class="flex items-center justify-between">
          <div class="text-sm text-slate-500">Acceptance</div>
          <div class="px-3 py-1 rounded-full ${likelihood.colorClass} text-sm font-semibold">${likelihood.label}</div>
        </div>
  
        <div class="text-xs text-slate-500 italic mt-1">${likelihood.reason}</div>
      </div>
  
      <div class="mt-6 flex items-center justify-between">
        <div class="text-sm text-slate-500">${loan.notes.join(' • ')}</div>
        <button class="select-btn inline-flex items-center gap-2 bg-primary text-white rounded-md px-3 py-2 text-sm font-semibold hover:opacity-95">
          Select
        </button>
      </div>
    `;
  
    return container;
  }
  
  /* ========== Render top 3 cards into #cardsRow ========== */
  function renderTopThree() {
    const row = document.getElementById('cardsRow');
    if (!row) {
      console.warn('No #cardsRow found in DOM. Make sure index.html has <section id="cardsRow">'); // defensive
      return;
    }
    row.innerHTML = '';
  
    // ranking: low interest preferred but federal gets slight boost
    const ranked = loans.slice().sort((a, b) => {
      const aScore = a.interestRate + (a.type === 'Federal' ? -0.5 : 0);
      const bScore = b.interestRate + (b.type === 'Federal' ? -0.5 : 0);
      return aScore - bScore;
    }).slice(0, 3);
  
    ranked.forEach(loan => row.appendChild(createCardElement(loan, student)));
  }
  
  /* ========== Kick off on DOM ready ========== */
  document.addEventListener('DOMContentLoaded', () => {
    // set header GPA (keeps header in sync if you change student object)
    const gpaEl = document.getElementById('studentGpa');
    if (gpaEl) gpaEl.textContent = student.gpa.toFixed(1);
  
    renderTopThree();
  });
  