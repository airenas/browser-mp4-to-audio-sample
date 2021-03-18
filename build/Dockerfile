FROM nginx:1.17.9

LABEL Description="This image is used to start the browser-audio-extract service" \ 
      Maintainer="airenass@gmail.com" Vendor="Airenas Vaiciunas"

COPY entrypoint.sh /root/entrypoint.sh
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY deploy/html /usr/share/nginx/html

CMD ["/root/entrypoint.sh"]
