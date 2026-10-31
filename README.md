# Prerequisites
#
- JDK 11 
- Maven 3 
- MySQL 8

# Technologies 
- Spring MVC
- Spring Security
- Spring Data JPA
- Maven
- JSP
- Tomcat
- MySQL
- Memcached
- Rabbitmq
- ElasticSearch
# Database
Here,we used Mysql DB 
sql dump file:
- /src/main/resources/db_backup.sql
- db_backup.sql file is a mysql dump file.we have to import this dump to mysql db server
- > mysql -u <user_name> -p accounts < db_backup.sql

# Docker Compose Quickstart

You can build and run the entire multi-container stack using Docker Compose:

| Service | Container | Image / Context | Port | Description |
| :--- | :--- | :--- | :--- | :--- |
| `vproweb` | `vproweb` | `./Docker-files/web` | `80:80` | Nginx reverse proxy |
| `vproapp` | `vproapp` | `./Docker-files/app` | `8080:8080` | Tomcat application server |
| `vprodb` | `vprodb` | `./Docker-files/db` | `3306:3306` | MySQL database |
| `vprocache01` | `vprocache01` | `memcached` | `11211:11211` | Memcached caching service |
| `vpromq01` | `vpromq01` | `rabbitmq` | `5672:5672` | RabbitMQ message broker |

### Commands

```bash
# Build images and start all containers in detached mode
docker compose up -d --build

# Check running containers
docker compose ps

# Stop and remove containers
docker compose down
```
