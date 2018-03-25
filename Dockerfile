FROM netlify/build@sha256:67ca2632e70b49d71299c408a523ee3b5b1a58e58f8c83f44c30b4589a2a5523
WORKDIR /opt/repo
COPY ./ ./
RUN build gulp

FROM nginx:1.13.10
LABEL maintainer="James Tapsell"
COPY --from=0 /opt/buildhome/repo/dist /usr/share/nginx/html
