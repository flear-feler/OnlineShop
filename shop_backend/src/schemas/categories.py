from pydantic import BaseModel

class CreateCategory(BaseModel):
    name: str

class Category(BaseModel):
    id: int
    name: str