

          name: Deploy Node Application

          on:
            push:
             branches: 
              - main
          
          jobs:
            build:
              runs-on: ubuntu-latest
              steps:
                - name: Checkout Source
                  uses: actions/checkout@v4
                - name: Login to docker hub
                  run: docker login -u ${{ secrets.DOCKERUSERNAME }} -p ${{ secrets.DOCKERPASSWORD }}
                - name: Build and push image
                  run: docker build -t ecommerce584956/node-app .
                - name: Publish Image to docker hub
                  run : docker push ecommerce584956/node-app:latest 
          
            deploy:
              needs: build
              runs-on: self-hosted
              steps:
                - name: Login to docker hub
                  run: docker login -u ${{ secrets.DOCKERUSERNAME }} -p ${{ secrets.DOCKERPASSWORD }}
                - name: Pull image form docker hub
                  run: docker pull ecommerce584956/node-app:latest
                - name: Run docker container
                  run: docker run -d -p 8000:8000 --name node-app-container \ 
                      -e PORT = ${{secrets.PORT}} \
                      -e MONGO_URI = ${{secrets.MONGOURL}} \
                      -e BUCKET_NAME = ${{secrets.BUCKETNAME}} \
                      -e BUCKET_REGION = ${{secrets.BUCKETREGION}} \
                      -e ACCESS_KEY = ${{secrets.ACCESSKEY}} \
                      -e SECRET_ACCESS_KEY = ${{secrets.SECRETACCESSKEY}} \
                      -e ADMIN_EMAIL = ${{secrets.ADMINLOGIN}} \
                      -e ADMIN_PASSWORD = ${{secrets.ADMINPASSWORD}} \
                      -e JSON_WEB_TOKEN_SECRET_KEY =  ${{secrets.JSONWEBTOKENSECRETKEY}} \
                      -e EMAIL_SERVER_HOST = ${{secrets.EMAILSERVERHOST}} \
                      -e EMAIL_SERVER_PORT = ${{secrets.EMAILSERVERPORT}} \
                      -e EMAIL_SERVER_USER = ${{secrets.EMAILSERVERUSER}} \
                      -e EMAIL_SERVER_PASSWORD = ${{secrets.EMAILSERVERPASSWORD}} \
                      -e FROM_NAME = ${{secrets.FROMNAME}} \
                      -e FROM_EMAIL = ${{secrets.FROMEMAIL}} \
                      -e STRIPE_SECRET_KEY = ${{secrets.STRIPESECRETKEY}} \
                      ecommerce584956/node-app:latest
          