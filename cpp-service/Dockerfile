FROM ubuntu:22.04

# Prevent interactive installs
ENV DEBIAN_FRONTEND=noninteractive

# Install build tools + OpenCV
RUN apt-get update && \
    apt-get install -y \
        build-essential \
        cmake \
        libopencv-dev \
        pkg-config && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy entire C++ service
COPY . .

# Build the service
RUN mkdir -p build && \
    cd build && \
    cmake .. && \
    make

EXPOSE 8000

# Run the compiled binary
CMD ["./build/cpp_service"]
