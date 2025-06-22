# Set your Docker Hub username or use another registry
$DOCKER_USERNAME = "your-username"
$IMAGE_NAME = "hackbox-web"
$TAG = "latest"

# Build the Docker image with increased memory
docker build -t "$DOCKER_USERNAME/$IMAGE_NAME:$TAG" .

# Push the image to Docker Hub
docker push "$DOCKER_USERNAME/$IMAGE_NAME:$TAG"

Write-Host "Image pushed to $DOCKER_USERNAME/$IMAGE_NAME:$TAG"
Write-Host "Now update your render.yaml to use this image"
Write-Host "Uncomment the 'image:' line and replace with: image: $DOCKER_USERNAME/$IMAGE_NAME:$TAG"