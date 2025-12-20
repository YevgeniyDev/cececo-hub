from fastapi import APIRouter

from app.api.v1.countries import router as countries_router
from app.api.v1.projects import router as projects_router
from app.api.v1.investors import router as investors_router

router = APIRouter()

router.include_router(countries_router, prefix="/v1")
router.include_router(projects_router, prefix="/v1")
router.include_router(investors_router, prefix="/v1")
