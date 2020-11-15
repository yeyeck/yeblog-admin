FROM nginx:1.19.2-alpine
MAINTAINER yeyeck<yeyeck@sina.cn>
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories
RUN apk add -U tzdata
RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
RUN echo 'Asia/Shanghai' >/etc/timezone
WORKDIR /usr/share/nginx/html/admin
ADD spa ./
COPY default.conf /etc/nginx/conf.d/default.conf

