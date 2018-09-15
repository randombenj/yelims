app:
	docker-compose up --build

local:
	pipenv install
	FLASK_APP=yelmis pipenv run flask run

docker:
	docker build -t yelmis-backend .
	docker run -p 8000:8000 yelmis-backend
