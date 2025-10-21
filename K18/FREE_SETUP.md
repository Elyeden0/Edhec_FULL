# 100% FREE Setup Guide - Using Ollama

## Quick Setup (5 minutes)

### 1. Install Ollama (Free)
```bash
# Install Ollama
curl -fsSL https://ollama.com/install.sh | sh
```

### 2. Download Vision Model (Free)
```bash
# Download the LLaVA vision model (~4.5GB, one-time download)
ollama pull llava
```

### 3. Start Backend
```bash
cd /home/alex/Documents/Ecole42/Edhec_FULL/K18/backend
source venv/bin/activate
pip install -r requirements.txt
python main.py
```

### 4. Start Frontend
```bash
# New terminal
cd /home/alex/Documents/Ecole42/Edhec_FULL/K18
npm run dev
```

## That's it! 🎉

- **No API keys needed**
- **No credit card required**
- **100% free forever**
- **Runs on your machine**
- **Privacy: images never leave your computer**

## How It Works

1. Upload hair photo → Frontend
2. Backend calls Ollama (locally on your computer)
3. LLaVA vision model analyzes the hair
4. Returns: hair type + reasoning + characteristics
5. Frontend displays results

## Fallback Mode

If Ollama isn't running, the system automatically uses simple image analysis (brightness/texture). Still works, just less accurate.

## Commands

```bash
# Check if Ollama is running
curl http://localhost:11434/api/tags

# Start Ollama (if not auto-started)
ollama serve

# Test the vision model
ollama run llava "What do you see in this image?"
```

## Comparison

### Ollama (Free):
- ✅ 100% free
- ✅ Unlimited usage
- ✅ Privacy (local)
- ✅ No internet needed
- ⚠️ Slower on older CPUs
- ⚠️ 4.5GB model download

### OpenAI ($):
- ⚠️ $5 free trial (then paid)
- ⚠️ ~$0.01-0.03 per image after trial
- ✅ Faster
- ✅ No local resources needed
- ⚠️ Requires internet
- ⚠️ Images sent to OpenAI

## For Your Mockup (10 images)

**Ollama is perfect!**
- Free
- Good quality
- Privacy
- Unlimited testing

## Troubleshooting

### "Ollama not running"
```bash
ollama serve
```

### Model not found
```bash
ollama pull llava
```

### Slow analysis
- Normal on first run (model loads)
- Faster on subsequent analyses
- Use smaller images (auto-resized to 512px)

## OpenAI Option (If You Want)

The code supports both! To use OpenAI instead:

1. Get API key: https://platform.openai.com
2. Add to `backend/.env`:
   ```
   OPENAI_API_KEY=sk-your-key
   ```
3. Update `hair_analyzer.py` line 10 to use OpenAI

But for 10 test images, **Ollama is better** (free + private)!
