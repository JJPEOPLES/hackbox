#!/bin/bash

# Set your image name
LOCAL_IMAGE="dev:latest"
REGISTRY_URL="registry.render.com"
RENDER_SERVICE="hackbox-web"

# Tag your local image for Render's registry
# You'll need to replace YOUR_RENDER_USERNAME with your actual Render username
RENDER_IMAGE="$REGISTRY_URL/YOUR_RENDER_USERNAME/$RENDER_SERVICE:latest"
docker tag $LOCAL_IMAGE $RENDER_IMAGE

# Log in to Render's registry (you'll need to get this token from Render)
# docker login $REGISTRY_URL -u token -p YOUR_RENDER_TOKEN

# Push the image to Render's registry
# docker push $RENDER_IMAGE

echo "To push your local image to Render:"
echo "1. Get a deploy token from Render dashboard"
echo "2. Uncomment the docker login and push commands above"
echo "3. Replace YOUR_RENDER_USERNAME with your Render username"
echo "4. Replace YOUR_RENDER_TOKEN with your deploy token"
echo "5. Run this script again"
echo ""
echo "Alternatively, you can use Render's Web UI to upload your Docker image"