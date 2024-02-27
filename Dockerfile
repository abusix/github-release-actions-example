FROM nginx:alpine

ARG APP_VERSION=NOT_CONFIGURED
ENV APP_VERSION=$APP_VERSION

COPY src/index.html /usr/share/nginx/html/index.html
RUN echo "{ \"version\": \"$APP_VERSION\" }" > /usr/share/nginx/html/info.json

EXPOSE 80
