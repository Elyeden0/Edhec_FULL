"""Part 18 — Dataset pointers & download helpers
Provides links and helper stubs to download datasets (Hugging Face, custom).
"""
def hf_dataset_info():
    return {
        'segmentation': 'UniqueData/hair-detection-and-segmentation (Hugging Face)',
        'hair_type': 'dima806/hair_type_image_detection (Hugging Face)'
    }

def download_hf_dataset_stub(name):
    raise NotImplementedError("Use datasets.load_dataset in notebook/script to download HF datasets.")
