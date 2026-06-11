import fitz  # PyMuPDF
import docx


def extract_text_from_pdf(file_path: str):

    text = ""

    pdf = fitz.open(file_path)

    for page in pdf:
        text += page.get_text()

    return text

def extract_text_from_docx(file_path: str):

    doc = docx.Document(file_path)

    text = "\n".join([
        para.text for para in doc.paragraphs
    ])

    return text


def extract_text(file_path: str):

    if file_path.endswith(".pdf"):
        return extract_text_from_pdf(file_path)

    elif file_path.endswith(".docx"):
        return extract_text_from_docx(file_path)

    else:
        raise Exception("Unsupported file type")