"""Part 14 — Learning rate schedulers (warmup + cosine)"""
from torch.optim.lr_scheduler import LinearLR, CosineAnnealingLR, SequentialLR

def get_scheduler(optimizer, warmup_epochs=1, total_epochs=10):
    warmup = LinearLR(optimizer, start_factor=0.1, total_iters=warmup_epochs)
    cosine = CosineAnnealingLR(optimizer, T_max=max(1, total_epochs-warmup_epochs))
    return SequentialLR(optimizer, schedulers=[warmup, cosine], milestones=[warmup_epochs])
