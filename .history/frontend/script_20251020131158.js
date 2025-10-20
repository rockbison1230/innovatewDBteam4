const loans = [
    { lender: "Federal Direct Subsidized", rate: 4.99, type: "Federal", gpaReq: 3.0 },
    { lender: "State Education Loan", rate: 5.5, type: "State", gpaReq: 3.2 },
    { lender: "CampusLoan Private", rate: 6.8, type: "Private", gpaReq: 3.5 },
    { lender: "SmartFuture Loan", rate: 7.1, type: "Private", gpaReq: 2.5 }
  ];
  
  document.getElementById("studentForm").addEventListener("submit", (e) => {
    e.preventDefault();
    
    const student = {
      name: document.getElementById("name").value,
      gpa: parseFloat(document.getElementById("gpa").value),
      colleges: document.getElementById("colleges").value.split(",").map(c => c.trim()),
      major: document.getElementById("major").value
    };
  
    const bestLoans = loans.filter(l => student.gpa >= l.gpaReq).sort((a,b) => a.rate - b.rate);
  
    const container = document.getElementById("loanResults");
    container.innerHTML = "";
  
    if (bestLoans.length === 0) {
      container.innerHTML = "<p>No loans available based on this profile.</p>";
      return;
    }
  
    bestLoans.forEach(loan => {
      const card = document.createElement("div");
      card.classList.add("loan-card");
      card.innerHTML = `
        <div class="loan-title">${loan.lender}</div>
        <div class="loan-meta">${loan.type} Loan</div>
        <div class="loan-rate">${loan.rate}% interest</div>
        <p>Minimum GPA: ${loan.gpaReq}</p>
      `;
      container.appendChild(card);
    });
  });
  