# Yelmis Backend

## Running locally

Set up Python environment:

```shell
pipenv install
```

To create a virtual environment you just execute the `pipenv shell`.

Run a development server:

```shell
FLASK_APP=yelmis flask run
```

## Docker image

Build the docker image:

```shell
docker build -t yelmis-backend .
```

Run the Docker Container:

```shell
docker run -p 8000:8000 yelmis-backend
```

## Running the tests

Install the prerequisites:

```shell
pipenv install --dev
```

Runs tests:

```shell
pipenv run python -m pytest
```
