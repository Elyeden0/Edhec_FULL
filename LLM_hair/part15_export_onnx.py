"""Part 15 — Export to ONNX"""
import torch
def export_onnx(model, example_input, out_path='hair_condition.onnx', opset=13):
    model.eval()
    torch.onnx.export(model, example_input, out_path, input_names=['input'], output_names=['logits'], opset_version=opset)
    return out_path
