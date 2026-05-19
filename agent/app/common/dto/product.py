from pydantic import BaseModel, Field

class Product(BaseModel):
    name: str
    description: str
    list_price: int = Field(alias="listPrice")
    price: int
    category: str
    image_url: str = Field(alias="imageUrl")