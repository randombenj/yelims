FROM python:3.7
MAINTAINER info@yelmis.io

RUN pip install pipenv

COPY . /app
WORKDIR /app

RUN pipenv install --system --deploy

EXPOSE 8000

CMD [ "gunicorn", "-b0.0.0.0:8000", "--reload", "--access-logfile", "-", "wsgi:app" ]
