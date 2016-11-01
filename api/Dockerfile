FROM mhart/alpine-node:latest

RUN apk update && \
    apk add curl && \
    rm -rf /var/cache/apk/*

ENTRYPOINT ["node"]

RUN mkdir -p /opt/site-api/lib
COPY package.json /opt/site-api/
COPY *.js /opt/site-api/
COPY lib/*.js /opt/site-api/lib/
RUN cd /opt/site-api && npm install

CMD ["/opt/site-api/"]
