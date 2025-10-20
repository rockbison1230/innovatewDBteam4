
window.onload = () => {
  setUpSurveyPage();
};

async function getOpenAICompletion(prompt) {
  const payload = {
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }]
  };

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI API error: ${errorText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

function setUpSurveyPage() {
  const form = document.getElementById("search-form");
  const resultsDiv = document.getElementById('results');

  // Set up an event handler for the form submit button
  $("#submit").click(async (event) => {
    resultsDiv.textContent = 'Searching...';

    // Collect form values
    const Nationality = document.getElementById('Nationality').value.trim().toUpperCase();
    const Academics = document.getElementById('Academics').value.trim().toUpperCase();
    const voluteer = document.getElementById('voluteer').value;
    const TestScore = parseInt(document.getElementById('TestScore').value, 10);
    const Major = parseInt(document.getElementById('Major').value, 10) || 5;
    const Extracurricular = document.getElementById('Extracurricular').value.trim();
    const schools = document.getElementById('schools').value.trim();

    // Make sure all required fields are inputted
    if (!Academics || !Major || !Extracurricular || !schools) {
      resultsDiv.textContent = 'Please fill in all required fields.';
      return;
    }

    try {
      const prompt = `I searched for Scholarships that are for specificly tailored towards me,I am ${Nationality} have a ${Academics}. I have been (${voluteer}). I also have a SAT/ACT score of ${TestScore}. I am a ${Major} major. Outside of school I like to ${Extracurricular}. My dream school is ${schools} Please provide a scholarship I can apply to with these qualifications, as well as a link to where I can apply.`;

      const aiResponse = await getOpenAICompletion(prompt);

      let aiDiv = document.getElementById('ai-response');
      if (!aiDiv) {
        aiDiv = document.createElement('div');
        aiDiv.id = 'ai-response';
        aiDiv.style.marginTop = '20px';
        aiDiv.style.padding = '10px';
        aiDiv.style.border = '1px solid #ccc';
        aiDiv.style.backgroundColor = '#f9f9f9';
        resultsDiv.parentNode.appendChild(aiDiv);
      }

      aiDiv.innerHTML = `<h2>Recommendation</h2>` + marked.parse(aiResponse);

    } catch (error) {
      resultsDiv.textContent = 'Error: ' + error.message;
      console.error(error);
    }
  });
}
