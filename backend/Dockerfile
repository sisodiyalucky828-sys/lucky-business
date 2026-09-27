FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /app
COPY . .
RUN cd backend && mvn clean package -DskipTests

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/backend/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]