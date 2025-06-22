# Set your image name
$LOCAL_IMAGE = "dev:latest"
$REGISTRY_URL = "registry.render.com"
$RENDER_SERVICE = "hackbox-web"

# Tag your local image for Render's registry
# You'll need to replace YOUR_RENDER_USERNAME with your actual Render username
$RENDER_IMAGE = "$REGISTRY_URL/YOUR_RENDER_USERNAME/$RENDER_SERVICE:latest"
docker tag $LOCAL_IMAGE $RENDER_IMAGE

# Log in to Render's registry (you'll need to get this token from Render)
# docker login $REGISTRY_URL -u token -p YOUR_RENDER_TOKEN

# Push the image to Render's registry
# docker push $RENDER_IMAGE

Write-Host "To push your local image to Render:"
Write-Host "1. Get a deploy token from Render dashboard"
Write-Host "2. Uncomment the docker login and push commands above"
Write-Host "3. Replace YOUR_RENDER_USERNAME with your Render username"
Write-Host "4. Replace YOUR_RENDER_TOKEN with your deploy token"
Write-Host "5. Run this script again"
Write-Host ""
Write-Host "Alternatively, you can use Render's Web UI to upload your Docker image"