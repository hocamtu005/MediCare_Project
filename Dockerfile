# STAGE 1: Build Frontend
FROM node:22-alpine AS frontend-build
WORKDIR /app/frontend

COPY frontend/package*.json ./
# Cài đặt toàn bộ package, ép bỏ qua xung đột phiên bản
RUN npm ci --legacy-peer-deps

COPY frontend/ ./
RUN npx vite build

# STAGE 2: Build Backend
FROM maven:3.9.4-eclipse-temurin-17 AS backend-build
WORKDIR /app/backend

COPY backend/api/pom.xml .
COPY backend/api/src ./src
COPY --from=frontend-build /app/frontend/dist ./src/main/resources/static

RUN mvn clean package -DskipTests

# STAGE 3: Run App
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

COPY --from=backend-build /app/backend/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]