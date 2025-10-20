"""Part 03 — Transforms (albumentations wrappers)
Defines training/validation transforms used by the Dataset.
Requires: albumentations, albumentations.pytorch
"""
from albumentations import Compose, RandomBrightnessContrast, HueSaturationValue, Blur, GaussNoise, Resize, Normalize
from albumentations.pytorch import ToTensorV2

def get_train_transforms(size=224):
    return Compose([
        Resize(size, size),
        RandomBrightnessContrast(p=0.5),
        HueSaturationValue(p=0.3),
        Blur(p=0.2),
        GaussNoise(p=0.2),
        Normalize(),
        ToTensorV2()
    ])

def get_val_transforms(size=224):
    return Compose([
        Resize(size, size),
        Normalize(),
        ToTensorV2()
    ])
