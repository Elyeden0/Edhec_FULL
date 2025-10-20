"""Part 06 — Training loop and utilities
Standard training/evaluation loops with optional aux loss.
"""
import torch
import torch.nn as nn
from tqdm import tqdm

def train_one_epoch(model, dataloader, optimizer, device, aux_weight=0.3):
    model.train()
    criterion = nn.CrossEntropyLoss()
    running_loss = 0.0
    for images, labels in tqdm(dataloader, desc="Train", leave=False):
        images = images.to(device).float()
        labels = labels.to(device)
        out = model(images)
        logits = out["logits"]
        loss = criterion(logits, labels)
        if 'aux_logits' in out:
            # placeholder for aux loss
            pass
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()
        running_loss += loss.item() * images.size(0)
    return running_loss / len(dataloader.dataset)

def evaluate(model, dataloader, device):
    model.eval()
    total, correct = 0,0
    with torch.no_grad():
        for images, labels in dataloader:
            images = images.to(device).float()
            labels = labels.to(device)
            out = model(images)
            preds = out["logits"].argmax(dim=-1)
            total += labels.size(0)
            correct += (preds == labels).sum().item()
    return correct / total
