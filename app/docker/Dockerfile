FROM openjdk:17-jdk-slim

# Install dependencies
RUN apt-get update && apt-get install -y \
    git \
    bash \
    && rm -rf /var/lib/apt/lists/*

# Install Gradle
RUN apt-get update && apt-get install -y gradle && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Expose port
EXPOSE 3001

# Default command
CMD ["bash"]
