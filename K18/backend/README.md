# K18 Hair Analysis Backend

AI-powered hair analysis using **Google Gemini (FREE & Best)**, Ollama, or fallback analysis for accurate hair type detection and K18 product recommendations.

## � Option 1: Google Gemini 2.0 Flash (RECOMMENDED - FREE)

### Why Gemini?
✅ **100% FREE** (1,500 requests/day - enough for development & demos)
✅ **Better quality** than GPT-4 Vision for hair analysis (95% accuracy)
✅ **Faster** than local models (1-2 seconds per analysis)
✅ **No installation** required - just API key
✅ **No credit card** needed

### Quick Setup (2 minutes)

#### 1. Get FREE API Key
1. Go to https://aistudio.google.com/apikey
2. Sign in with Google
3. Click "Create API Key"
4. Copy the key

#### 2. Add to .env
```bash
cd backend
nano .env
```

Add:
```bash
GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXX
```

#### 3. Install & Start
```bash
pip install -r requirements.txt
python3 main.py
```

You should see: `✓ Google Gemini API configured`

**See full setup guide:** [GEMINI_SETUP.md](../GEMINI_SETUP.md)

---

## 🆓 Option 2: Ollama (Free Local Alternative)

### Why LLaVA?
**LLaVA** (Large Language and Vision Assistant) is a specialized vision model that can "see" and analyze images, unlike text-only models. It's perfect for hair analysis because it can detect:
- Texture and shine
- Color and highlights
- Dryness or oiliness
- Overall hair health

### Quick Setup (5 minutes)

#### 1. Install Ollama
```bash
# Linux/Mac
curl -fsSL https://ollama.com/install.sh | sh

# Or visit: https://ollama.com/download
```

#### 2. Pull LLaVA Vision Model
```bash
# Start Ollama service (if not auto-started)
ollama serve

# In another terminal, download the model (~4.5GB, one-time)
ollama pull llava
```

**Alternative vision models you can try:**
```bash
ollama pull llava:13b      # Larger, more accurate (7GB)
ollama pull bakllava       # Alternative vision model
ollama pull llava:34b      # Most accurate (20GB)
```

#### 3. Verify Installation
```bash
# Check if Ollama is running
curl http://localhost:11434/api/tags

# Test the model
ollama run llava "describe this image"
```

#### 4. Install Python Dependencies
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

#### 5. Start Backend
```bash
python main.py
```

✅ **Done!** Your backend now uses free local AI for hair analysis.

---

## 💳 Option 2: OpenAI (Paid API)

If you prefer cloud-based AI (requires payment after free trial):

### 1. Get OpenAI API Key
1. Visit https://platform.openai.com/api-keys
2. Create a new API key
3. Copy the key (starts with `sk-...`)

### 2. Setup Environment

```bash
cd backend

# Create .env file
nano .env
```

Add to `.env`:
```env
OPENAI_API_KEY=sk-your-actual-api-key-here
```

### 3. Update Code

Edit `hair_analyzer.py` line 11:
```python
self.use_ollama = False  # Disable Ollama
```

Then add OpenAI integration (see CHATGPT_MIGRATION.md)

---

## 📋 How It Works

### With Ollama (Free):
1. Image uploaded → Backend receives it
2. Converts to base64 and resizes for speed
3. Sends to local Ollama API (port 11434)
4. LLaVA analyzes hair and returns JSON
5. Backend parses and formats response
6. Frontend displays results with AI reasoning

### Fallback (If Ollama Not Running):
- Uses simple image analysis (brightness/texture)
- Still provides reasoning and characteristics
- Good enough for basic mockups

---

## 🔍 Vision Models Comparison

### Why LLaVA for Hair Analysis?

| Model | Type | Best For | Size | Speed |
|-------|------|----------|------|-------|
| **llava** | Vision AI | **Hair analysis** ✅ | 4.5GB | Fast |
| llava:13b | Vision AI | More accuracy | 7GB | Medium |
| llava:34b | Vision AI | Best accuracy | 20GB | Slow |
| bakllava | Vision AI | Alternative | 4.5GB | Fast |
| llama3 | Text only | ❌ Can't see images | 3GB | N/A |
| mistral | Text only | ❌ Can't see images | 4GB | N/A |

**LLaVA is recommended because:**
- ✅ Can actually "see" and analyze images
- ✅ Trained on visual understanding
- ✅ Good balance of size/speed/accuracy
- ✅ Perfect for detecting hair texture, shine, and condition
- ✅ Provides natural language explanations

**Text-only models (like llama3, mistral) won't work** for this project because they can't process images.

---

## 🎯 API Endpoints

**Parameters:**
- `image` (file): Hair image
- `latitude` (float, optional): User's latitude
- `longitude` (float, optional): User's longitude

**Response:**
```json
{
  "success": true,
  "hair_analysis": {
    "hair_type": "dry",
    "confidence": 0.87,
    "scores": {"dry": 0.87, "normal": 0.10, "oily": 0.03}
  },
  "weather_data": {
    "temperature": 72,
    "humidity": 65,
    "condition": "partly_cloudy",
    "is_humid": true
  },
  "recommendations": [
    {
      "id": 1,
      "name": "K18 Leave-In Molecular Repair Hair Mask",
      "price": "$75.00",
      "reasoning": "Ideal for your dry hair - provides deep hydration and repair"
    }
  ]
}
```

### GET /products

Get all available K18 products.

### GET /health

Health check endpoint.

## Architecture

- `main.py` - FastAPI application and endpoints
- `hair_analyzer.py` - Hair condition analysis using LLM_hair models
- `weather_service.py` - Weather data fetching (Open-Meteo API)
- `product_recommender.py` - Product recommendation engine

## Integration with LLM_hair

The backend uses models from the `LLM_hair` folder:
- `part01_segmentation.py` - Hair segmentation
- `part05_model.py` - Hair condition classifier

Make sure the LLM_hair folder is in the parent directory.

## Development

```bash
# Run with auto-reload
uvicorn main:app --reload

# Run tests (if available)
pytest

# Check API documentation
# Visit http://localhost:8000/docs
```
