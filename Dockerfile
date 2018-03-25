LABEL maintainer="James Tapsell"
FROM netlify/build@c782ee64a4a9
WORKDIR /opt/repo
COPY ./ ./
RUN build gulp

FROM nginx:1.13.10
COPY --from=0 /opt/buildhome/repo/dist /usr/share/nginx/html
