from pydantic import BaseModel

class GetDeals(BaseModel):
    id: int
    user_id: int
    name: str
    price: int

class CreateDealSchema(BaseModel):
    good_id: int
    price: int