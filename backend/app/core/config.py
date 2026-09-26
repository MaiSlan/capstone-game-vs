from pydantic_settings import BaseSettings, SettingsConfigDict
import os

class Settings(BaseSettings):
    SUPABASE_URL: str
    SUPABASE_SERVICE_ROLE_KEY: str

    model_config = SettingsConfigDict(
        # Force an absolute path to avoid "current directory" confusion
        env_file=os.path.join(os.path.dirname(os.path.abspath(__file__)), "../../.env"),
        env_file_encoding='utf-8',
        extra='ignore' 
    )

settings = Settings()