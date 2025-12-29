from fastapi import APIRouter

from app.api.v1.countries import router as countries_router
from app.api.v1.projects import router as projects_router
from app.api.v1.investors import router as investors_router
from app.api.v1.news import router as news_router
from app.api.v1.library import router as library_router
from app.api.v1.search import router as search_router
from app.api.routes.admin_import import router as admin_import_router

router = APIRouter()

router.include_router(countries_router, prefix="/v1")
router.include_router(projects_router, prefix="/v1")
router.include_router(investors_router, prefix="/v1")
router.include_router(news_router, prefix="/v1")
router.include_router(library_router, prefix="/v1")
router.include_router(search_router, prefix="/v1")
router.include_router(admin_import_router, prefix="/v1")
