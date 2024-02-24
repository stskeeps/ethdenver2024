FROM opstack:cartesi

RUN apk add python3

ADD . /home

WORKDIR /home
EXPOSE 8000

ENTRYPOINT ["python3", "dehashing-server.py"]
