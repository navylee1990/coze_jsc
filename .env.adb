# 阿里云ADB PostgreSQL连接配置
# 格式: postgresql://username:password@host:port/database

# 开发环境ADB
PGDATABASE_URL=postgresql://adb_username:adb_password@adb-host.region.aliyuncs.com:5432/adb_database

# 生产环境ADB
PGDATABASE_URL_PROD=postgresql://adb_username:adb_password@adb-host.region.aliyuncs.com:5432/adb_database

# 连接池配置（可选）
# PGDATABASE_URL=postgresql://adb_username:adb_password@adb-host.region.aliyuncs.com:5432/adb_database?connection_limit=10&pool_timeout=20
