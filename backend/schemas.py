from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, EmailStr, Field


class TodoBase(BaseModel):
    title: str = Field(min_length=1, max_length=120)
    description: Optional[str] = Field(default=None, max_length=400)


class TodoCreate(TodoBase):
    pass


class TodoUpdate(BaseModel):
    title: Optional[str] = Field(default=None, min_length=1, max_length=120)
    description: Optional[str] = Field(default=None, max_length=400)
    completed: Optional[bool] = None


class Todo(TodoBase):
    id: int
    completed: bool
    created_at: datetime
    owner_id: int

    model_config = {"from_attributes": True}


class UserBase(BaseModel):
    email: EmailStr


class UserCredentials(UserBase):
    password: str = Field(min_length=8, max_length=128)


class UserCreate(UserCredentials):
    pass


class UserSummary(UserBase):
    id: int
    is_active: bool

    model_config = {"from_attributes": True}


class User(UserSummary):
    todos: List[Todo] = Field(default_factory=list)

    model_config = {"from_attributes": True}


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: Optional[str] = None


class ProtectedResponse(BaseModel):
    authenticated: bool
    message: str
    user: UserSummary
