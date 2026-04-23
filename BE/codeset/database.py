import pymysql
import os
from dotenv import load_dotenv

load_dotenv(dotenv_path="..\dataset\config\.env")

def get_db_connection():
    """ MySQL 연결 설정 """
    return pymysql.connect(
        host=os.getenv("DB_HOST", "localhost"),
        user=os.getenv("DB_USER", "root"),
        password=os.getenv("DB_PASSWORD", ""),
        db=os.getenv("DB_NAME", "ai_analyzer"),
        charset='utf8mb4',
        cursorclass=pymysql.cursors.DictCursor
    )

def save_analysis_result(file_name, question, answer, used_model):
    """ 분석 결과를 DB에 저장 """
    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            sql = """
            INSERT INTO analysis_logs (file_name, question, answer, used_model)
            VALUES (%s, %s, %s, %s)
            """
            cursor.execute(sql, (file_name, question, answer, used_model))
        connection.commit()
        print(f"✅ DB 저장 완료: {file_name}")
    except Exception as e:
        print(f"❌ DB 저장 오류: {e}")
    finally:
        connection.close()