// --- Hardcoded User Profile for MVP ---
const userProfile = {
    fullName: "Alex Chen",
    age: 18,
    state: "Florida",
    householdIncome: 85000,
    gpa: 3.8,
    major: "Computer Science",
    isFirstGen: true,
};

// --- DOM Element References ---
const getAdviceBtn = document.getElementById('getAdviceBtn');
const collegeNameInput = document.getElementById('collegeName');
const resultsSection = document.getElementById('results-section');
const loadingIndicator = document.getElementById('loading-indicator');
const responseContainer = document.getElementById('response-container');
const chartContainer = document.getElementById('chart-container');
const errorContainer = document.getElementById('error-container');
const userInfoContainer = document.getElementById('userInfo');

let costChart = null; // To hold the chart instance

// --- Main Event Listener ---
document.addEventListener('DOMContentLoaded', () => {
    displayUserInfo();
    getAdviceBtn.addEventListener('click', handleGetAdvice);
});

// --- Functions ---

/**
 * Displays the hardcoded user info on the page.
 */
function displayUserInfo() {
    userInfoContainer.innerHTML = `
        <span><strong>Name:</strong> ${userProfile.fullName}</span>
        <span><strong>State:</strong> ${userProfile.state}</span>
        <span><strong>Income:</strong> $${userProfile.householdIncome.toLocaleString()}</span>
        <span><strong>Major:</strong> ${userProfile.major}</span>
    `;
}

/**
 * MOCK API CALL: Simulates fetching data from the backend.
 * @returns {Promise<object>} A promise that resolves with mock data.
 */
function mockApiCall(collegeName) {
    console.log("Simulating API call for:", collegeName);
    
    // Create a mock response object that looks exactly like the real backend response
    const mockResponse = {
        text_response: `
            ### Financial Overview for University of Florida
            Based on your profile, here is a breakdown of the estimated costs and potential aid.
            
            * **Estimated Tuition & Fees:** The sticker price for tuition and fees is significantly higher than what you might actually pay.
            * **Potential Aid:** With a household income of $85,000, you are likely eligible for federal grants like the Pell Grant, as well as state-specific aid like the Florida Bright Futures scholarship.
            * **Federal Loans:** You would qualify for Federal Direct Subsidized and Unsubsidized loans. We recommend prioritizing subsidized loans as interest does not accrue while you are in school.
        `,
        chart_data: {
            stickerPrice: 38700,
            estimatedNetCost: 17500,
            inStatePublicAlternativeCost: 22300,
        },
    };

    // Simulate a network delay of 1.5 seconds
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(mockResponse);
        }, 1500);
    });
}


/**
 * Handles the click event to fetch AI advice.
 */
async function handleGetAdvice() {
    const collegeName = collegeNameInput.value;
    if (!collegeName) {
        showError("Please enter a college name.");
        return;
    }

    setLoadingState(true);

    try {
        // --- THIS IS THE CHANGE ---
        // We are calling our mock function instead of the real backend.
        const data = await mockApiCall(collegeName);

        /* // WHEN YOUR BACKEND IS READY: 
        // 1. Comment out the line above (const data = await mockApiCall...).
        // 2. Uncomment the 'fetch' block below.
        
        const response = await fetch('http://127.0.0.1:8000/get-advice', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_profile: userProfile,
                college_name: collegeName,
                question: "What is the estimated net cost for me to attend, and what kind of federal loans might I qualify for?"
            }),
        });

        if (!response.ok) {
            throw new Error(`Network response was not ok. Status: ${response.status}`);
        }

        const data = await response.json();
        */

        // Render the text and visual outputs
        renderTextResponse(data.text_response);
        if (data.chart_data) {
            renderCostChart(data.chart_data);
        }

    } catch (error) {
        console.error("Error fetching advice:", error);
        showError("Failed to get advice. Please check the console and ensure your local Python server is running.");
    } finally {
        setLoadingState(false);
    }
}

/**
 * Renders the textual advice from the AI.
 * A library like 'marked.js' would be better for production.
 */
function renderTextResponse(text) {
    // Simple markdown to HTML conversion
    const html = text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/### (.*?)\n/g, '<h3>$1</h3>')
        .replace(/\* (.*?)\n/g, '<li>$1</li>')
        .replace(/\n/g, '<br>')
        .replace(/<br><li>/g, '<li>'); // Fix for extra space before list items
    
    // Check if the text contains list items to decide whether to wrap in <ul>
    if (html.includes('<li>')) {
         responseContainer.innerHTML = `<ul>${html.replace(/<\/li><br>/g, '</li>')}</ul>`;
    } else {
        responseContainer.innerHTML = html;
    }
}


/**
 * Renders the cost comparison bar chart.
 */
function renderCostChart(data) {
    const ctx = document.getElementById('cost-comparison-chart').getContext('2d');
    const chartData = {
        labels: ['Sticker Price', 'Your Estimated Net Cost', 'In-State Public Average'],
        datasets: [{
            label: 'Annual Cost ($)',
            data: [data.stickerPrice, data.estimatedNetCost, data.inStatePublicAlternativeCost],
            backgroundColor: ['#ef4444', '#22c55e', '#3b82f6'],
            borderRadius: 6,
        }]
    };

    if (costChart) costChart.destroy();

    costChart = new Chart(ctx, {
        type: 'bar',
        data: chartData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: { y: { beginAtZero: true, ticks: { callback: value => '$' + value.toLocaleString() } } },
            plugins: { legend: { display: false }, tooltip: {
                callbacks: {
                    label: function(context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y);
                        }
                        return label;
                    }
                }
            } }
        }
    });
}

/**
 * Manages the UI loading state.
 */
function setLoadingState(isLoading) {
    getAdviceBtn.disabled = isLoading;
    resultsSection.classList.toggle('hidden', !isLoading);
    loadingIndicator.classList.toggle('hidden', !isLoading);
    responseContainer.classList.add('hidden');
    chartContainer.classList.add('hidden');
    errorContainer.classList.add('hidden');
    
    if (isLoading) {
       getAdviceBtn.textContent = 'Generating...';
    } else {
       getAdviceBtn.textContent = 'Generate Financial Advice';
       resultsSection.classList.remove('hidden');
       loadingIndicator.classList.add('hidden'); // Hide loader once done
       responseContainer.classList.remove('hidden');
       if (document.getElementById('cost-comparison-chart').chart) { // check if chart exists
            chartContainer.classList.remove('hidden');
       }
    }
}

/**
 * Displays an error message in the UI.
 */
function showError(message) {
    resultsSection.classList.remove('hidden');
    loadingIndicator.classList.add('hidden');
    errorContainer.textContent = message;
    errorContainer.classList.remove('hidden');
}

