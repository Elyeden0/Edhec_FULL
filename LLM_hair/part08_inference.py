"""Part 08 — Inference utilities"""
from PIL import Image
import numpy as np
import torch.nn.functional as F
from part05_model import HairConditionClassifier

def preprocess_pil(img, size=224):
    img = img.resize((size,size))
    arr = np.array(img).astype('float32')/255.0
    t = __import__('torch').from_numpy(arr).permute(2,0,1).unsqueeze(0)
    return t

def infer_image(model, pil_img, device='cpu', use_mask=False):
    model.eval()
    if use_mask:
        from part01_segmentation import get_hair_mask_pil
        mask = get_hair_mask_pil(pil_img)
        arr = np.array(pil_img)
        arr[mask==0] = 0
        pil_img = Image.fromarray(arr)
    inp = preprocess_pil(pil_img).to(device)
    with __import__('torch').no_grad():
        out = model(inp)
        probs = F.softmax(out['logits'], dim=-1)[0].cpu().numpy()
        idx = int(probs.argmax())
    classes = ['dry','normal','greasy']
    return classes[idx], probs
