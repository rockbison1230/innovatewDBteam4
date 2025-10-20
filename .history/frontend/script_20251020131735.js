<script>
    /***************
     * Hard-coded student profile (no input)
     ***************/
    const student = {
      name: "Maya Johnson",
      gpa: 3.8,
      colleges: ["UCLA", "UC Berkeley"],
      major: "Computer Science",
      residency: "CA",
      year: "High School Senior",
      hasCosigner: false,   // toggle to true to show better private loan odds
      income: 0              // typical HS student = 0; used in private underwriting heuristic
    };

    /***************
     * Hard-coded loan data (representative)
     * - Federal loan uses current federal-interest calculation (fixed rate for demo).
     * - Private loans have example sample rates (private rates vary by creditworthiness).
     *
     * Note: Federal rates referenced from official Dept of Education pages; private lenders' acceptance criteria referenced from lender docs (Sallie Mae, SoFi) for demo heuristics.
     ***************/
    const loans = [
      {
        id: 'FED-1',
        name: 'Federal Direct Subsidized Loan',
        amount: 5500,
        interestRate: 6.39, // representative fixed rate for 2025-2026 undergrad (see official sources)
        type: 'Federal',
        minGpa: 0,
        notes: ['FAFSA required', 'Subsidized for eligible undergrads'],
      },
      {
        id: 'SALLIE-1',
        name: 'Sallie Mae Smart Option Student Loan',
        amount: 10000,
        interestRate: 8.50, // representative example — private rates vary by credit/term
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

    /***************
     * Heuristic for "acceptance likelihood"
     * - Federal: Very likely if FAFSA assumed; we present "Very likely (FAFSA)" for demo.
     * - Private: 
     *     - If student has cosigner -> Likely (cosigner improves chances per lenders).
     *     - Else if student.gpa >= minGpa AND student.income >= some small threshold -> Possible.
     *     - Else -> Unlikely.
     *
     * These are simplified demo heuristics inspired by lender docs:
     * - Sallie Mae: cosigner improves chances, cosigner release after payments. :contentReference[oaicite:3]{index=3}
     * - SoFi: underwriting considers age, income, credit; cosigner often needed for younger borrowers. :contentReference[oaicite:4]{index=4}
     ***************/
    function acceptanceLikelihood(loan, student) {
      if (loan.type === 'Federal') {
        return { label: 'Very likely', color: 'bg-green-100 text-green-800', reason: 'Federal loans are awarded based on FAFSA eligibility (demo assumes FAFSA filed).' };
      }

      // Private loan heuristics
      if (student.hasCosigner) {
        return { label: 'Likely', color: 'bg-emerald-100 text-emerald-800', reason: 'Cosigner improves approval chances (per lender guidance).' };
      }

      const gpaOk = student.gpa >= (loan.minGpa || 0);
      const incomeOk = (student.income || 0) >= 8000; // demo threshold
      if (gpaOk && incomeOk) {
        return { label: 'Possible', color: 'bg-amber-100 text-amber-800', reason: 'Some private lenders may approve based on strong GPA + income.' };
      }

      // default
      return { label: 'Unlikely', color: 'bg-red-100 text-red-800', reason: 'Private lenders usually expect credit history/income or a cosigner.' };
    }

    /***************
     * Render a single rectangular "flash" card (Tailwind)
     ***************/
    function renderCard(loan) {
      const likelihood = acceptanceLikelihood(loan, student);

      const container = document.createElement('article');
      container.className = 'card group bg-white rounded-lg2 shadow-soft-lg border border-slate-100 p-6 flex flex-col justify-between min-h-[190px]';

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
            <div class="px-3 py-1 rounded-full ${likelihood.color} text-sm font-semibold">${likelihood.label}</div>
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

    /***************
     * Render top 3 (we only have 3 loans, but logic keeps it generic)
     ***************/
    function renderTopThree() {
      const row = document.getElementById('cardsRow');
      row.innerHTML = '';
      // Simple ranking by interest rate for demo (lower rate = better), but federal always top if applicable
      const ranked = loans.slice().sort((a,b) => {
        // slight bias: federal loans get a tiny boost due to protections
        const aScore = a.interestRate + (a.type === 'Federal' ? -0.5 : 0);
        const bScore = b.interestRate + (b.type === 'Federal' ? -0.5 : 0);
        return aScore - bScore;
      }).slice(0,3);

      ranked.forEach(loan => {
        const card = renderCard(loan);
        row.appendChild(card);
      });
    }

    document.addEventListener('DOMContentLoaded', () => {
      // show student gpa in header (keeps header synced)
      document.getElementById('studentGpa').textContent = student.gpa.toFixed(1);
      renderTopThree();
    });
  </script>
</body>
</html>