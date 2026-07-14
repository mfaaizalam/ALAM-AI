from fastapi import UploadFile,HTTPException
from app.utils.pdf import extract_text_from_pdf
from app.services.gemini_service import analyze_cv
def processs_cv(file:UploadFile)->str:
    if file.content_type!="application/pdf":
        raise HTTPException(
            status_code=400, #Bad request
            detail="Only PDF files are allowed"
        )
    text =extract_text_from_pdf(file.file)

    if not text:
        raise HTTPException(
            status_code=400,
            detail="No readable text found in the PDF."
            )
    profile =analyze_cv(text)
    return profile 

# It is an UploadFile object.
# The actual PDF data is inside
# file = UploadFile(
#     filename="Muhammad_Faaiz_Alam_CV.pdf",
#     content_type="application/pdf",
#     file=<SpooledTemporaryFile>
# ) thats why is use file.file