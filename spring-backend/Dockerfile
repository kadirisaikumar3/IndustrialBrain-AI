FROM eclipse-temurin:21-jdk

RUN apt-get update && \
    apt-get install -y \
    tesseract-ocr \
    tesseract-ocr-eng \
    poppler-utils && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY spring-backend/ .

RUN chmod +x mvnw

RUN ./mvnw clean package -DskipTests

EXPOSE 8081

CMD ["sh", "-c", "java -jar target/industrialbrain-backend-0.0.1-SNAPSHOT.jar --server.port=$PORT"]