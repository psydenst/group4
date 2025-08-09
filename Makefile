# Makefile
.PHONY: all up down build clean logs db-only

all: build up

build:
	docker-compose build

up:
	docker-compose up -d

down:
	docker-compose down

fclean:
	docker-compose down -v
	docker system prune -af
	docker volume prune -f
	docker network prune -f
	docker container prune -f
	docker image prune -af

clean:
	docker-compose down
	docker system prune -f
	docker volume prune -f

logs:
	docker-compose logs -f

backend:
	docker-compose up backend

frontend:
	docker-compose up frontend

db-only:
	docker-compose up db pgadmin
