"""Part 19 — Instructions & tips for finishing training and deployment"""
TIPS = """
- Create clear labeling guidelines for 'greasy', 'normal', 'dry'.
- Verify segmentation masks on a validation subset before training.
- Start with a frozen backbone and fine-tune last blocks gradually.
- Use augmentation and Mixup/CutMix for small datasets.
- Monitor per-class metrics and confusion matrices.
- For deployment, export to ONNX and quantify where appropriate.
"""
