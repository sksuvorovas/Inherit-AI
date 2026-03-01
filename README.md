<div align="center">
</div>

📖 Inspiration
The project was inspired by a harrowing personal experience: a co-founder’s struggle to settle his late parents' estate in Mexico. Facing a "perfect storm" of technical legal language barriers, opaque probate laws, and safety concerns in regions with cartel influence, he realized that heirs need more than just a lawyer—they need a trusted, objective digital guide.

✨ Core Features
Pro-Hunter: Uses AI-driven web search (Tavily) to vet and source English-speaking local lawyers in specific foreign jurisdictions.
Contract Whisperer: Audits complex foreign sale agreements (e.g., Mexican Escrituras or Spanish Arras) to flag non-standard liabilities and "red flag" clauses in plain English.
Listing Engine: Generates high-converting, localized real estate marketing materials tailored to regional portals.
Command Center: A centralized Kanban-style dashboard that orchestrates the "Success Roadmap" from probate to final sale.

🛠️ Tech Stack
LLM Engine: Google Gemini 1.5 Pro via Google AI Studio for high-context document reasoning (2M token window).
Search Layer: Tavily API for real-time, grounded web retrieval of local laws and professional ratings.
Document Processing: Google File API for secure handling of sensitive death certificates and deeds.
Frontend: React-based dashboard with JSON-structured AI outputs.

🚀 Getting Started
Prerequisites

**Prerequisites:**  Node.js (v18+) or Python (3.9+)
Google AI Studio API Key
Tavily API Key


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
