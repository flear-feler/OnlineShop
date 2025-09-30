from pydantic import BaseModel

class GetGoods(BaseModel):
    id:int
    name: str
    price: int
    rating: float
    category: str
    color: str
    size: str
    number_in_storage: int
    description: str

class CreateGoodSchema(BaseModel):
    name: str
    price: int
    rating: float
    category_id: int
    color: str
    size: str
    number_in_storage: int
    description: str