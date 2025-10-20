"""Part 09 — Augmentation recipes and helpers
Examples of augmentations and advice for hair-condition datasets.
"""
# See part03_transforms for actual augmentation pipelines.
AUGMENTATION_TIPS = """
- RandomBrightnessContrast: simulate harsh lighting
- HueSaturationValue: color shifts between cameras
- Blur & MotionBlur: account for camera focus and motion
- RandomCrop + Resize: robustness to framing & head position
"""
