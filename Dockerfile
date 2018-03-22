FROM alpine
WORKDIR build
RUN apk update
RUN apk add nodejs git
ADD ./ ./
RUN npm install --global gulp-cli
RUN npm install
RUN gulp

FROM nginx
COPY --from=0 /build/dist /usr/share/nginx/html