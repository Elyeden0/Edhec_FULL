"""Part 13 — Checkpointing helpers"""
import torch, os

def save_checkpoint(model, optimizer, epoch, path):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    torch.save({'model_state': model.state_dict(),
                'opt_state': optimizer.state_dict(),
                'epoch': epoch}, path)

def load_checkpoint(path, model, optimizer=None, device='cpu'):
    ck = torch.load(path, map_location=device)
    model.load_state_dict(ck['model_state'])
    if optimizer and 'opt_state' in ck:
        optimizer.load_state_dict(ck['opt_state'])
    return ck.get('epoch', None)
