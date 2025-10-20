"""Part 20 — README / entrypoint
Simple script that outlines how to use the modular package.
"""
def print_instructions():
    print("""Modular Hair Condition Classifier
Files (part01..part20) in this folder.
Typical workflow:
1. Prepare dataset and create train/val image path lists + labels.
2. Use part03_transforms.get_train_transforms and part04_dataset.HairConditionDataset to create datasets.
3. Create model: from part05_model import HairConditionClassifier
4. Train using part06_training.run_training style loop (or call functions manually).
5. Evaluate with part07_eval.evaluate_with_metrics
6. Export with part15_export_onnx.export_onnx and serve using part16_fastapi
""")

if __name__ == '__main__':
    print_instructions()
