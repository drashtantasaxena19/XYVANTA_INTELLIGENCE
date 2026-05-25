import os
import uuid
from pathlib import Path

import fitz
import pdfplumber
import pytesseract
from docx import Document
from fastapi import UploadFile
from PIL import Image


UPLOAD_DIR = Path("uploads")


async def save_upload_file(
    upload_file: UploadFile,
    destination: Path,
) -> Path:
    destination.parent.mkdir(
        parents=True,
        exist_ok=True,
    )

    content = await upload_file.read()

    with open(destination, "wb") as file:
        file.write(content)

    return destination


def extract_pdf_text(file_path: str) -> str:
    text = ""

    try:
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                extracted = page.extract_text()

                if extracted:
                    text += extracted + "\n"

    except Exception as error:
        print(f"⚠️ pdfplumber failed: {error}")

    return text.strip()


def extract_docx_text(file_path: str) -> str:
    text = ""

    try:
        document = Document(file_path)

        for paragraph in document.paragraphs:
            text += paragraph.text + "\n"

    except Exception as error:
        print(f"⚠️ docx extraction failed: {error}")

    return text.strip()


def extract_image_text(file_path: str) -> str:
    try:
        image = Image.open(file_path)

        return pytesseract.image_to_string(image)

    except Exception as error:
        print(f"⚠️ OCR failed: {error}")
        return ""


def extract_scanned_pdf_text(file_path: str) -> str:
    text = ""

    try:
        pdf = fitz.open(file_path)

        for page_index in range(len(pdf)):
            page = pdf.load_page(page_index)

            pix = page.get_pixmap()

            image_path = (
                f"temp_page_{uuid.uuid4()}.png"
            )

            pix.save(image_path)

            image = Image.open(image_path)

            text += (
                pytesseract.image_to_string(image)
                + "\n"
            )

            os.remove(image_path)

    except Exception as error:
        print(f"⚠️ scanned pdf OCR failed: {error}")

    return text.strip()


def extract_text(file_path: str) -> str:
    extension = (
        Path(file_path)
        .suffix
        .lower()
    )

    if extension == ".pdf":
        text = extract_pdf_text(file_path)

        if len(text.strip()) > 50:
            return text

        return extract_scanned_pdf_text(file_path)

    if extension == ".docx":
        return extract_docx_text(file_path)

    if extension in [
        ".png",
        ".jpg",
        ".jpeg",
        ".webp",
    ]:
        return extract_image_text(file_path)

    try:
        with open(
            file_path,
            "r",
            encoding="utf-8",
        ) as file:
            return file.read()

    except Exception:
        return ""