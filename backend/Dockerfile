# Stage 1: Build the Spring Boot Application
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# Copy pom.xml and source code
COPY pom.xml .
COPY src ./src

# Build JAR package (skipping tests for fast container build)
RUN mvn clean package -DskipTests

# Stage 2: Production JRE Runtime
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copy the generated JAR from the build stage
COPY --from=build /app/target/*.jar app.jar

# Default fallback port (Render overrides this with $PORT)
ENV PORT=4000
EXPOSE ${PORT}

# Run application with dynamic Render port
ENTRYPOINT ["sh", "-c", "java -jar app.jar --server.port=${PORT}"]