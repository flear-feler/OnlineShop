from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")
    #model_config = SettingsConfigDict(env_file="../.env", extra="ignore")

    DB_HOST: str
    DB_PORT: str
    DB_NAME: str
    DB_USER: str
    DB_PASS: str
    SECRET: str

    REDIS_HOST: str
    REDIS_PASSWORD: str
    REDIS_PORT: int