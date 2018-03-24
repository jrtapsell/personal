FROM netlify/build
WORKDIR /opt/repo
ADD ./ ./
RUN build gulp

FROM nginx
COPY --from=0 /opt/buildhome/repo/dist /usr/share/nginx/html
