"""Part 07 — Evaluation and visualization helpers"""
import matplotlib.pyplot as plt
import numpy as np
from sklearn.metrics import confusion_matrix, classification_report

def evaluate_with_metrics(model, dataloader, device, class_names=['dry','normal','greasy']):
    model.eval()
    y_true, y_pred = [], []
    with __import__('torch').no_grad():
        for images, labels in dataloader:
            images = images.to(device).float()
            labels = labels.to(device)
            out = model(images)
            preds = out['logits'].argmax(dim=-1)
            y_true.extend(labels.cpu().numpy())
            y_pred.extend(preds.cpu().numpy())
    cm = confusion_matrix(y_true, y_pred, normalize='true')
    plt.figure(figsize=(5,5))
    plt.imshow(cm, cmap='Blues')
    plt.xticks(range(len(class_names)), class_names, rotation=45)
    plt.yticks(range(len(class_names)), class_names)
    plt.title('Confusion matrix (normalized)')
    plt.colorbar()
    plt.show()
    print(classification_report(y_true, y_pred, target_names=class_names))
