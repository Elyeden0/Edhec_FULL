"""Part 04 — Dataset
Dataset that loads images, optionally applies segmentation mask and transforms.
"""
from torch.utils.data import Dataset
from PIL import Image
import numpy as np

from part01_segmentation import get_hair_mask_pil

class HairConditionDataset(Dataset):
    def __init__(self, image_paths, labels, transform=None, mask_hair=False):
        assert len(image_paths) == len(labels)
        self.image_paths = image_paths
        self.labels = labels
        self.transform = transform
        self.mask_hair = mask_hair

    def __len__(self):
        return len(self.image_paths)

    def __getitem__(self, idx):
        p = self.image_paths[idx]
        label = self.labels[idx]
        img = Image.open(p).convert('RGB')
        if self.mask_hair:
            mask = get_hair_mask_pil(img)
            arr = np.array(img)
            arr[mask == 0] = 0
            img = Image.fromarray(arr)
        if self.transform:
            augmented = self.transform(image=np.array(img))
            img_t = augmented['image']
        else:
            # fallback to simple tensor conversion
            from torchvision import transforms
            img_t = transforms.ToTensor()(img)
        return img_t, int(label)
