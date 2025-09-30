from fastapi_users import schemas
from pydantic import BaseModel

class UserView(BaseModel):
    id:int
    username: str
    role: str

class UserRead(schemas.BaseUser[int]):
    username: str
    role: str

class UserCreate(schemas.BaseUserCreate):
    username: str
    role: str


class UserUpdate(schemas.BaseUserUpdate):
    username: str
    role: str