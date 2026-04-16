# demo DB SQL

Demo de DB del Curso DATW 2026.

Comando de creación del contenedor de Postgres en Docker:

```sh
docker run -d --name=<Nombre del contenedor> -e POSTGRES_PASSWORD=<contraseña del servidor> -p <puertos> <imagen-docker>
```

Ejemplo:

```sh
docker run -d --postgres -e POSTGRES_PASSWORD=Mananas -p 5434:5432 postgres
```
