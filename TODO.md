# Chatbot Fix TODO

## Steps
- [x] Step 1: Fix `backend/controllers/chatbotController.js` — add API key validation, knowledge-base fallback when Gemini fails
- [x] Step 2: Create `frontend/src/components/Chatbot.jsx` — floating chat widget with backend integration, error handling, offline mode indicator
- [x] Step 3: Fix `frontend/src/utils/chatbot.js` — ensure full error payload is propagated to component
- [x] Step 4: Fix `backend/routes/chatbotRoutes.js` — update `/health` to report whether Gemini API key is configured
- [x] Step 5: Fix `frontend/src/components/layouts/DashboardLayout.jsx` — remove unused `Chatbot` import
- [ ] Step 6: Restart backend and test chatbot functionality
