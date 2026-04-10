import { OPENROUTER_KEY } from "./api/key.js";

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === "ai_request") {
        handleAIRequest(msg)
            .then((result) => sendResponse({ success: true, result }))
            .catch((err) =>
                sendResponse({ success: false, error: err.toString() })
            );
        return true; // keep channel open for async
    }
    if (msg.type === "reload_active_tab") {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]) {
                chrome.tabs.reload(tabs[0].id);
            }
        });
        return false;
    }
});

async function handleAIRequest({ action, text }) {
    const apiKey = OPENROUTER_KEY;

    const prompt = getPrompt(action, text);

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "openai/gpt-4o-mini",      // OpenRouter uses provider/model format
            messages: [
                { role: "user", content: prompt }
            ]
        })
    });

    const data = await res.json();

    // safety: if error occurs
    if (!data || !data.choices || !data.choices[0]) {
        return "AI Error: Invalid response.";
    }

    return data.choices[0].message.content;
}

function getPrompt(action, text) {
    switch (action) {
        case "summarize":
            return `Summarize the following text in 5 short bullet points:\n\n${text}`;
        case "highlight":
            return `Extract the most important key ideas from this text:\n\n${text}`;
        case "simplify":
            return `Rewrite this text in simpler, easier-to-understand language:\n\n${text}`;
        case "explain":
            return `Explain this text as if teaching a beginner:\n\n${text}`;
        case "flashcards":
            return `Create 10 flashcards (Q&A format) based on this text:\n\n${text}`;
        default:
            return text;
    }
}
