# 🧪 Comprehensive Testing Guide - AI Integration Portfolio

> **Complete Testing Reference:** Step-by-step commands and scenarios for all three AI-powered projects

---

## 🎯 **Project 1: AI Form Autocomplete (Enhanced)**

### **🚀 Start Development Server:**
```bash
cd ai-form-autocomplete
npm install
npm run dev
```
**URL:** http://localhost:5173

### **🧪 Test Scenarios:**

#### **✅ Basic Functionality Test:**
```bash
1. Type: "How to learn JavaScript programming"
2. Wait 500ms for debounced suggestions
3. Click any suggestion to autocomplete
4. Verify text appears in input field
```

#### **🤖 AI Provider Testing:**
```bash
# Mock Provider (Default - No API key needed)
1. Ensure .env has: VITE_AI_PROVIDER=mock
2. Type: "Hello world"
3. Should see mock suggestions instantly

# Gemini Provider (Current Primary)
1. Set .env: VITE_AI_PROVIDER=gemini
2. Add valid VITE_GEMINI_API_KEY
3. Type: "Write a Python function"
4. Should see AI-generated suggestions

# OpenAI Provider (Fallback)
1. Set .env: VITE_AI_PROVIDER=openai  
2. Add valid VITE_OPENAI_API_KEY
3. Type: "Explain React hooks"
4. Should see GPT-generated suggestions
```

#### **🔥 Error Handling Test:**
```bash
1. Set .env: VITE_AI_PROVIDER=gemini
2. Use invalid API key: VITE_GEMINI_API_KEY=invalid_key
3. Type any text
4. Should see error message with recovery instructions
5. Switch to mock provider to continue testing
```

#### **📱 Responsive Design Test:**
```bash
1. Open browser developer tools (F12)
2. Switch to mobile view (iPhone/Android)
3. Test input field and buttons
4. Verify text wraps properly on small screens
```

---

## 🔧 **Project 2: AI Workflow API (Production-Ready)**

### **🚀 Start API Server:**
```bash
cd ai-workflow-api
npm install
npm run dev
```
**URLs:** 
- **API:** http://localhost:3000
- **Swagger Docs:** http://localhost:3000/api-docs

### **🧪 Test Commands:**

#### **✅ Health Check:**
```bash
curl http://localhost:3000/health
# Expected: {"ok":true,"timestamp":"2025-08-22T..."}
```

#### **📚 Interactive API Documentation:**
```bash
1. Open: http://localhost:3000/api-docs
2. Explore interactive Swagger UI
3. Test endpoints directly from browser
4. View request/response schemas
```

#### **🤖 Generate Step (PowerShell):**
```powershell
# Basic Task Generation
Invoke-RestMethod -Method Post "http://localhost:3000/generate-step" `
  -Headers @{ "Content-Type" = "application/json" } `
  -Body '{ "task": "Set up customer database for e-commerce website" }'

# Expected Response:
# {
#   "step": "Research and choose appropriate database technology...",
#   "rationale": "Starting with technology selection is crucial...",
#   "aiProvider": "gemini"
# }
```

#### **🔥 Error Testing:**
```powershell
# Missing Task Field
Invoke-RestMethod -Method Post "http://localhost:3000/generate-step" `
  -Headers @{ "Content-Type" = "application/json" } `
  -Body '{}'
# Expected: 400 error with validation message

# Invalid JSON
Invoke-RestMethod -Method Post "http://localhost:3000/generate-step" `
  -Headers @{ "Content-Type" = "application/json" } `
  -Body 'invalid json'
# Expected: 400 error with JSON parsing message
```

#### **🌐 Provider Switching Test:**
```bash
# Test different AI providers by modifying backend/.env:
1. AI_PROVIDER=mock (instant responses)
2. AI_PROVIDER=gemini (Google AI responses)  
3. AI_PROVIDER=openai (GPT responses)
4. Restart server and test same endpoint
```

---

## 🌐 **Project 3: AI Full-Stack (Complete System)**

### **🚀 Start Both Servers:**
```bash
# Terminal 1 - Backend
cd ai-fullstack/backend
npm install
npm run dev
# Expected: ✅ Server running on http://localhost:3001

# Terminal 2 - Frontend  
cd ai-fullstack/frontend
npm install
npm run dev
# Expected: ✅ Local: http://localhost:5173
```

### **🌐 Access Points:**
- **Frontend UI:** http://localhost:5173
- **Backend API:** http://localhost:3001  
- **API Documentation:** http://localhost:3001/api-docs

### **🧪 Test Full-Stack System:**

#### **✅ Frontend Integration Test:**
```bash
1. Open: http://localhost:5173
2. Enter prompt: "Write a Python function to sort a list"
3. Click "Run" button
4. Verify loading state appears
5. Check AI response appears in styled container
6. Test "Reset" button functionality
7. Verify responsive design (720px max width)
```

#### **📱 Responsive UI Test:**
```bash
1. Open developer tools (F12)
2. Test different screen sizes:
   - Mobile: 375px width
   - Tablet: 768px width  
   - Desktop: 1200px width
3. Verify text wraps properly in response container
4. Check button and input field usability
```

#### **🔧 Backend Direct API Test:**
```powershell
# API Information
Invoke-RestMethod -Uri "http://localhost:3001/"
# Expected: {"name": "AI Full-Stack Backend", "version": "1.0.0"}

# AI Completion
Invoke-RestMethod -Method Post "http://localhost:3001/ai/complete" `
  -Headers @{ "Content-Type" = "application/json" } `
  -Body '{ "prompt": "Explain the concept of closures in JavaScript" }'

# Expected Response:
# {
#   "text": "Closures in JavaScript are...",
#   "aiProvider": "gemini",
#   "timestamp": "2025-08-22T..."
# }
```

#### **🔥 Error Handling Test:**
```powershell
# Missing Prompt
Invoke-RestMethod -Method Post "http://localhost:3001/ai/complete" `
  -Headers @{ "Content-Type" = "application/json" } `
  -Body '{}'
# Expected: 400 error with validation message

# Empty Prompt
Invoke-RestMethod -Method Post "http://localhost:3001/ai/complete" `
  -Headers @{ "Content-Type" = "application/json" } `
  -Body '{ "prompt": "" }'
# Expected: 400 error indicating prompt is required
```

#### **🌐 CORS Test:**
```bash
# Verify frontend can communicate with backend
1. Open browser console on frontend (F12)
2. Submit a prompt through UI
3. Check Network tab for successful requests
4. Verify no CORS errors in console
5. Confirm backend responds with proper headers
```

---

## 🚀 **Advanced Testing Scenarios**

### **🔄 Multi-Provider Testing:**
```bash
# Test all AI providers across projects:

# 1. Set all projects to Mock provider
# ai-form-autocomplete/.env: VITE_AI_PROVIDER=mock
# ai-workflow-api/.env: AI_PROVIDER=mock  
# ai-fullstack/backend/.env: AI_PROVIDER=mock
# Expected: Instant responses, no API calls

# 2. Set all to Gemini (Primary)
# Update all .env files: *_AI_PROVIDER=gemini
# Add valid API keys
# Expected: Google AI responses

# 3. Set all to OpenAI (Fallback)  
# Update all .env files: *_AI_PROVIDER=openai
# Add valid API keys
# Expected: GPT responses
```

### **🔧 Performance Testing:**
```bash
# Test API response times:
1. Use browser developer tools Network tab
2. Submit multiple requests across all projects
3. Monitor response times and success rates
4. Test with different prompt lengths
5. Verify debouncing works in autocomplete
```

### **📊 Swagger Documentation Testing:**
```bash
# Test interactive API documentation:

# AI Workflow API
1. Open: http://localhost:3000/api-docs
2. Test each endpoint from Swagger UI
3. Verify request/response examples
4. Check schema validation

# AI Full-Stack Backend  
1. Open: http://localhost:3001/api-docs
2. Test /ai/complete endpoint
3. Verify proper error responses
4. Check API documentation completeness
```

---

## 🚀 **Quick Start All Projects (Parallel Testing)**

### **🏃‍♂️ Sequential Testing:**
```bash
# Start each project one by one
cd ai-form-autocomplete && npm install && npm run dev
# Test in browser, then Ctrl+C

cd ../ai-workflow-api && npm install && npm run dev
# Test API endpoints, then Ctrl+C

cd ../ai-fullstack/backend && npm install && npm run dev
# In new terminal:
cd ../frontend && npm install && npm run dev
# Test full-stack system
```

### **⚡ Parallel Testing (Advanced):**
```powershell
# Windows PowerShell - Start all projects simultaneously
Start-Process powershell -ArgumentList "-Command", "cd ai-form-autocomplete; npm run dev"
Start-Process powershell -ArgumentList "-Command", "cd ai-workflow-api; npm run dev"  
Start-Process powershell -ArgumentList "-Command", "cd ai-fullstack/backend; npm run dev"
Start-Process powershell -ArgumentList "-Command", "cd ai-fullstack/frontend; npm run dev"

# URLs to test:
# http://localhost:5173 - AI Form Autocomplete
# http://localhost:3000 - AI Workflow API  
# http://localhost:5173 - AI Full-Stack Frontend
# http://localhost:3001 - AI Full-Stack Backend
```

---

## 🔧 **Troubleshooting Commands**

### **📦 Dependency Issues:**
```bash
# Check installed packages
npm list --depth=0

# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install

# Check for vulnerabilities
npm audit
npm audit fix
```

### **🔍 TypeScript Issues:**
```bash
# Check for TypeScript errors without running
npx tsc --noEmit

# Build project to check compilation
npm run build

# Check TypeScript configuration
npx tsc --showConfig
```

### **🌐 Port Conflicts:**
```powershell
# Check what's using specific ports
netstat -ano | findstr :5173  # Vite dev server
netstat -ano | findstr :3000  # Workflow API
netstat -ano | findstr :3001  # Full-stack backend

# Kill process using port (replace PID)
taskkill /PID <PID> /F
```

### **🔑 Environment Variable Issues:**
```bash
# Check environment variables are loaded
# Add to any Node.js file temporarily:
console.log('Environment check:', {
  AI_PROVIDER: process.env.AI_PROVIDER,
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV
});
```

---

## 📊 **Expected Results Summary**

| Project | Frontend URL | Backend URL | API Docs | Status |
|---------|-------------|-------------|----------|--------|
| **AI Form Autocomplete** | http://localhost:5173 | N/A | N/A | ✅ Ready |
| **AI Workflow API** | N/A | http://localhost:3000 | http://localhost:3000/api-docs | ✅ Ready |
| **AI Full-Stack** | http://localhost:5173 | http://localhost:3001 | http://localhost:3001/api-docs | ✅ Ready |

---

## 🎯 **Success Criteria Checklist**

### **✅ All Systems Operational When:**
- [ ] All development servers start without errors
- [ ] Frontend applications load properly in browser
- [ ] API endpoints respond with correct status codes
- [ ] Swagger documentation is accessible and interactive
- [ ] AI integrations work (or show proper mock responses)
- [ ] No TypeScript compilation errors in any project
- [ ] CORS is configured correctly for frontend-backend communication
- [ ] Environment variables are loaded properly
- [ ] Error handling displays user-friendly messages
- [ ] Responsive design works on mobile and desktop

### **🔍 Debugging Workflow:**
1. **Start with Mock Providers** - Ensure basic functionality works
2. **Check Terminal Output** - Look for error messages and warnings
3. **Verify Environment Files** - Confirm .env files are configured correctly
4. **Test API Endpoints Directly** - Use curl or Postman before testing UI
5. **Check Browser Console** - Look for JavaScript errors and network issues
6. **Review Network Tab** - Verify API requests and responses
7. **Use Swagger Documentation** - Test backend APIs interactively
8. **Test One Project at a Time** - Isolate issues to specific components

### **🚨 Common Issues & Solutions:**
- **Port Already in Use:** Kill existing processes or change ports
- **CORS Errors:** Verify backend CORS configuration matches frontend URL
- **Environment Variables Not Loading:** Check .env file location and syntax
- **TypeScript Errors:** Run `npx tsc --noEmit` to check compilation
- **API Key Issues:** Test with mock provider first, then add real keys
- **Dependency Conflicts:** Clear node_modules and reinstall

---

🎉 **Happy Testing!** Your AI integration portfolio is ready for development, learning, and showcasing professional full-stack skills! ✨

# ✅ Generate Step (PowerShell)
Invoke-RestMethod -Method Post "http://localhost:3000/generate-step" `
  -Headers @{ "Content-Type" = "application/json" } `
  -Body '{ "task": "Set up customer database" }'

# ✅ Error Test
Invoke-RestMethod -Method Post "http://localhost:3000/generate-step" `
  -Headers @{ "Content-Type" = "application/json" } `
  -Body '{}'
# Expected: Error about missing task
```

---

## 🌐 **Project 3: AI Full-Stack**

### **Start Both Servers:**
```bash
# Terminal 1 - Backend
cd ai-fullstack/backend
npm run dev
# Expected: BE http://localhost:3001

# Terminal 2 - Frontend  
cd ai-fullstack/frontend
npm run dev
# Expected: http://localhost:3000
```

### **Test Full-Stack:**
```bash
# ✅ Frontend Test
1. Open: http://localhost:3000
2. Enter: "Write a Python function"
3. Click "Run"
4. Should see AI response

# ✅ Backend Direct Test
Invoke-RestMethod -Method Post "http://localhost:3001/ai/complete" `
  -Headers @{ "Content-Type" = "application/json" } `
  -Body '{ "prompt": "Explain React hooks" }'
```

---

## 🚀 **Quick Start All Projects**

### **Option 1: Test One by One**
```bash
# Test ai-form-autocomplete
cd ai-form-autocomplete && npm run dev

# Test ai-workflow-api  
cd ../ai-workflow-api && npm run dev

# Test ai-fullstack
cd ../ai-fullstack/backend && npm run dev    # Terminal 1
cd ../frontend && npm run dev                # Terminal 2
```

### **Option 2: Parallel Testing (Advanced)**
```bash
# Start all in background (Windows)
start cmd /c "cd ai-form-autocomplete && npm run dev"
start cmd /c "cd ai-workflow-api && npm run dev"  
start cmd /c "cd ai-fullstack/backend && npm run dev"
start cmd /c "cd ai-fullstack/frontend && npm run dev"
```

---

## 🔧 **Troubleshooting Commands**

### **Check Dependencies:**
```bash
npm list --depth=0    # List installed packages
npm audit            # Check for vulnerabilities
npm install          # Install missing packages
```

### **TypeScript Check:**
```bash
npx tsc --noEmit     # Check for TypeScript errors
```

### **Port Issues:**
```bash
netstat -ano | findstr :3000   # Check what's using port 3000
taskkill /PID <PID> /F         # Kill process using port
```

---

## 📊 **Expected Results Summary**

| Project | URL | Expected Result |
|---------|-----|-----------------|
| **ai-form-autocomplete** | http://localhost:5173 | Form with AI suggestions |
| **ai-workflow-api** | http://localhost:3000/health | `{"ok":true}` |
| **ai-fullstack frontend** | http://localhost:3000 | AI completion interface |
| **ai-fullstack backend** | http://localhost:3001 | API endpoints |

---

## 🎯 **Success Criteria**

### **✅ All Working When:**
- [ ] All servers start without errors
- [ ] Frontend apps load in browser
- [ ] API endpoints respond correctly
- [ ] AI integrations work (or show proper errors)
- [ ] No TypeScript compilation errors

### **🔍 Debug Steps:**
1. **Check terminal output** for error messages
2. **Verify .env files** have correct values
3. **Confirm dependencies** are installed (`npm install`)
4. **Test with mock providers** first
5. **Check browser console** for frontend errors

---

Happy testing! 🧪✨
