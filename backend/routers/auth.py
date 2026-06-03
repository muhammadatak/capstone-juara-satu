from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
import models
from schemas import LoginRequest, TokenResponse, UserMeResponse
from services.auth import (
    create_access_token,
    get_current_admin,
    verify_password,
)

router = APIRouter()


@router.post("/login", response_model=TokenResponse)
async def login(
    body: LoginRequest,
    db: Annotated[AsyncSession, Depends(get_db)],
):
    result = await db.execute(
        select(models.User).where(models.User.email == body.email)
    )
    user = result.scalar_one_or_none()

    if not user or not verify_password(body.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email atau password salah",
        )

    token = create_access_token(data={"sub": user.email})
    return TokenResponse(access_token=token, email=user.email, username=user.username)


@router.get("/me", response_model=UserMeResponse)
async def me(current_user: Annotated[models.User, Depends(get_current_admin)]):
    return UserMeResponse(email=current_user.email, username=current_user.username)
