"""Part 17 — Metrics dashboard helpers
Contains utilities to plot ROC/PR curves and probability distributions.
"""
import numpy as np
import matplotlib.pyplot as plt
from sklearn.metrics import roc_curve, auc, precision_recall_curve

def plot_prob_distributions(y_true, y_prob, class_idx=0, class_name='dry'):
    plt.hist([p[class_idx] for p in y_prob], bins=50)
    plt.title(f'Probability distribution for class {class_name}')
    plt.show()
