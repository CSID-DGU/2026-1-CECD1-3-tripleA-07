import array
from FlagEmbedding import BGEM3FlagModel

from app.common.dto.product import Product

model = BGEM3FlagModel("BAAI/bge-m3", use_fp16=True)

def build_text(item: Product):
    return f"name: {item.name}, description: {item.description}, category: {item.category}"


def embed_document(item: Product):
    text = build_text(item)

    embedding = model.encode(
        text,
        batch_size=1,
        max_length=8192
    )

    dense_vec = array.array("f", embedding["dense_vecs"])

    return text, dense_vec