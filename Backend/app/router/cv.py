from fastapi import APIRouter,UploadFile,File
from app.services.cv_service import processs_cv

router =APIRouter(
    prefix="/cv",
    tags = ["cv"]
)

@router.post("/upload")
def upload_cv(
    cv:UploadFile = File(...)
):
    text = processs_cv(cv)
    return {
        "message":"Cv upload Successfully.",
        "text":text
    }


#     cv: UploadFile means the cv parameter should receive an uploaded file, and UploadFile is FastAPI's file object containing the file, filename, and content type.
# = File(...) tells FastAPI that this file must come from a multipart/form-data request, and the ... means the file is required.