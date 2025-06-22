# Build and push the VNC-enabled Docker image

# Set your Docker Hub username
$DOCKER_USERNAME = "primecoder447"
$IMAGE_NAME = "hackbox"
$TAG = "vnc"

# Build the Docker image with VNC support
Write-Host "Building VNC-enabled Docker image..."
docker build -t "$DOCKER_USERNAME/$IMAGE_NAME:$TAG" -f Dockerfile.vnc .

# Tag as latest-vnc
docker tag "$DOCKER_USERNAME/$IMAGE_NAME:$TAG" "$DOCKER_USERNAME/$IMAGE_NAME:latest-vnc"

# Push the image to Docker Hub
Write-Host "Pushing image to Docker Hub..."
docker push "$DOCKER_USERNAME/$IMAGE_NAME:$TAG"
docker push "$DOCKER_USERNAME/$IMAGE_NAME:latest-vnc"

Write-Host "Done! Your VNC-enabled image is now available at:"
Write-Host "$DOCKER_USERNAME/$IMAGE_NAME:$TAG"
Write-Host "$DOCKER_USERNAME/$IMAGE_NAME:latest-vnc"
Write-Host ""
Write-Host "To use this image in render.yaml, update the image field to:"
Write-Host "image: $DOCKER_USERNAME/$IMAGE_NAME:latest-vnc"