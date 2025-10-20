window.onload = () => {
  setUpSurveyPage();
};

const OPENAI_API_KEY = "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";

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
  const resultsDiv = document.getElementById("results");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    resultsDiv.textContent = "Searching...";

    const Nationality = document.getElementById("Nationality").value.trim().toUpperCase();
    const Academics = document.getElementById("Academics").value.trim().toUpperCase();
    const volunteer = document.getElementById("volunteer").value;
    const TestScore = parseInt(document.getElementById("TestScore").value, 10);
    const Major = document.getElementById("Major").value.trim() || "Undeclared";
    const Extracurricular = document.getElementById("Extracurricular").value.trim();
    const schools = document.getElementById("schools").value.trim();

    if (!Academics || !Major || !Extracurricular || !schools) {
      resultsDiv.textContent = "Please fill in all required fields.";
      return;
    }

    const prompt = `I searched for scholarships specifically tailored to me. I am ${Nationality}, have a ${Academics}. I have been involved in (${volunteer}). I also have a SAT/ACT score of ${TestScore}. I am a ${Major} major. Outside of school I like to ${Extracurricular}. My dream school is ${schools}. Please provide a scholarship I can apply to with these qualifications, as well as a link to where I can apply.`;

    try {
      const aiResponse = await getOpenAICompletion(prompt);

      let aiDiv = document.getElementById("ai-response");
      if (!aiDiv) {
        aiDiv = document.createElement("div");
        aiDiv.id = "ai-response";
        aiDiv.style.marginTop = "20px";
        aiDiv.style.padding = "10px";
        aiDiv.style.border = "1px solid #ccc";
        aiDiv.style.backgroundColor = "#f9f9f9";
        resultsDiv.appendChild(aiDiv);
      }

      aiDiv.innerHTML = `<h2>Recommendation</h2>` + marked.parse(aiResponse);
    } catch (error) {
      resultsDiv.textContent = "Error: " + error.message;
      console.error(error);
    }
  });
}
