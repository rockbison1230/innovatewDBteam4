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
      card.className = "bg-white rounded-lg shadow p-6 flex flex-col gap-2";
  
      card.innerHTML = `
        <h2 class="text-xl font-semibold text-blue-700">${loan.name}</h2>
        <p><strong>Max Amount:</strong> $${loan.amount.toLocaleString()}</p>
        <p><strong>Interest Rate:</strong> ${loan.interestRate}%</p>
        <p><strong>Approval Likelihood:</strong> 
          <span class="${likelihood === 'High' ? 'text-green-600' : likelihood === 'Medium' ? 'text-yellow-600' : 'text-red-600'} font-bold">
            ${likelihood}
          </span>
        </p>
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
  