const questions = [
    {
        text: "When reading a long article online, how easily are you distracted by sidebars, links, or moving advertisements?",
        options: [
            { text: "Very easily – I often lose my train of thought.", scores: { adhd: 2, autism: 1 } },
            { text: "Sometimes, depending on how cluttered the page is.", scores: { adhd: 1 } },
            { text: "Rarely – I can usually focus on the main text.", scores: {} }
        ]
    },
    {
        text: "Do you ever feel like the words on a screen blur together, or do you frequently need to re-read paragraphs to understand them?",
        options: [
            { text: "Yes, this happens to me frequently.", scores: { dyslexia: 2 } },
            { text: "Occasionally, especially if the font is small or crowded.", scores: { dyslexia: 1 } },
            { text: "No, reading digital text is usually comfortable for me.", scores: {} }
        ]
    },
    {
        text: "How do bright colors, high-contrast patterns, or auto-playing videos make you feel?",
        options: [
            { text: "They feel overwhelming, visually exhausting, or cause discomfort.", scores: { autism: 2, epilepsy: 2 } },
            { text: "They are slightly annoying but I manage.", scores: { autism: 1, adhd: 1 } },
            { text: "I don't really notice or mind them.", scores: {} }
        ]
    },
    {
        text: "Do you find it helpful when complex paragraphs are simplified into bullet points or shorter sentences?",
        options: [
            { text: "Yes, it makes a huge difference for my comprehension.", scores: { adhd: 1, dyslexia: 1, autism: 1 } },
            { text: "Sometimes it helps.", scores: {} },
            { text: "I prefer reading the full original text.", scores: {} }
        ]
    }
];

let currentQuestionIndex = 0;
let userScores = { adhd: 0, dyslexia: 0, autism: 0, epilepsy: 0 };

function startQuiz() {
    document.getElementById('intro-screen').style.display = 'none';
    document.getElementById('quiz-screen').style.display = 'block';
    showQuestion();
}

function showQuestion() {
    const questionData = questions[currentQuestionIndex];
    document.getElementById('question').innerText = questionData.text;
    
    // Update progress bar
    const progressPercentage = ((currentQuestionIndex) / questions.length) * 100;
    document.getElementById('progress').style.width = `${progressPercentage}%`;

    const optionsContainer = document.getElementById('options');
    optionsContainer.innerHTML = ''; // Clear previous

    questionData.options.forEach(option => {
        const button = document.createElement('button');
        button.className = 'option-btn';
        button.innerText = option.text;
        button.onclick = () => selectOption(option.scores);
        optionsContainer.appendChild(button);
    });
}

function selectOption(scores) {
    // Add scores
    for (let profile in scores) {
        userScores[profile] += scores[profile];
    }

    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        showResults();
    }
}

function showResults() {
    document.getElementById('quiz-screen').style.display = 'none';
    document.getElementById('result-screen').style.display = 'block';

    // Find the highest score
    let highestProfile = 'reader'; // Default fallback
    let highestScore = -1;

    for (let profile in userScores) {
        if (userScores[profile] > highestScore && userScores[profile] > 0) {
            highestScore = userScores[profile];
            highestProfile = profile;
        }
    }

    // Map profile keys to HTML structures using your existing styling
    const profileData = {
        adhd: `
            <div class="access-icon-wrap bg-purple"><span class="access-icon-emoji">⚡</span></div>
            <div class="access-content">
                <h3>ADHD Profile</h3>
                <p>We recommend this profile to minimize distractions and help you maintain focus on the essential content without feeling overwhelmed.</p>
            </div>`,
        dyslexia: `
            <div class="access-icon-wrap bg-pink"><span class="access-icon-emoji">📖</span></div>
            <div class="access-content">
                <h3>Dyslexia Profile</h3>
                <p>We recommend this profile. It utilizes the OpenDyslexic font and optimized spacing for an easier, more comfortable reading experience.</p>
            </div>`,
        autism: `
            <div class="access-icon-wrap bg-blue"><span class="access-icon-emoji">🧩</span></div>
            <div class="access-content">
                <h3>Autism Profile</h3>
                <p>We recommend this profile. It will help reduce sensory overload by creating a calm, predictable, and simplified browsing environment.</p>
            </div>`,
        epilepsy: `
            <div class="access-icon-wrap bg-orange"><span class="access-icon-emoji">⚠️</span></div>
            <div class="access-content">
                <h3>Epilepsy / Safe Profile</h3>
                <p>We highly recommend turning on our safety features to prevent flashing animations and hazardous color combinations.</p>
            </div>`,
        reader: `
            <div class="access-icon-wrap bg-teal"><span class="access-icon-emoji">📚</span></div>
            <div class="access-content">
                <h3>Reader Mode</h3>
                <p>Your browsing habits look great! We recommend trying our standard Reader Mode and AI Assistant to further boost your productivity.</p>
            </div>`
    };

    document.getElementById('result-profile').innerHTML = profileData[highestProfile] || profileData['reader'];
}