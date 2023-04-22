FROM python:latest

WORKDIR /app

COPY . /app

ARG FLASK_APP OPENAI_API_KEY

RUN python3 -m pip install flask flask-cors openai

EXPOSE 5000

CMD ["flask", "run", "--host=0.0.0.0"]