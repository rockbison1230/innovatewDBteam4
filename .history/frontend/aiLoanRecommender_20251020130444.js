function calculateLikelihood(loan, profile) {
    if (profile.creditScore >= loan.minCreditScore) {
      if (profile.income < 15000 && loan.acceptsLowIncome) return "High";
      if (profile.income < 15000 && !loan.acceptsLowIncome) return "Medium";
      return "High";
    }
    return "Low";
  }
  
  function renderLoanCards(profile) {
    const container = document.getElementById("ai-loan-rec");
    container.innerHTML = "";
  
    loanData.forEach(loan => {
      const likelihood = calculateLikelihood(loan, profile);
  
      const card = document.createElement("div");
      card.className = `
        bg-white border border-gray-200 rounded-lg shadow-md
        p-6 flex flex-col justify-between hover:shadow-lg transition
      `;
  
      card.innerHTML = `
        <div>
          <h2 class="text-xl font-bold text-blue-700 mb-2">${loan.name}</h2>
          <p class="mb-1"><span class="font-semibold">Max Amount:</span> $${loan.amount.toLocaleString()}</p>
          <p class="mb-1"><span class="font-semibold">Interest Rate:</span> ${loan.interestRate}%</p>
          <p>
            <span class="font-semibold">Approval Likelihood:</span>
            <span class="${likelihood === 'High' ? 'text-green-600' : likelihood === 'Medium' ? 'text-yellow-600' : 'text-red-600'} font-bold">
              ${likelihood}
            </span>
          </p>
        </div>
      `;
  
      container.appendChild(card);
    });
  }
  
  function initLoanRecommender() {
    const studentProfile = {
      name: "Student A",
      creditScore: 640,
      income: 12000
    };
  
    renderLoanCards(studentProfile);
  }
  