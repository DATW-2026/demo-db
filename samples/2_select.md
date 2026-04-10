---
title: Select
---

## Ejercicio 1

- Listar todos los países con su población y su extensión, incluyendo los correspondientes alias adecuados en español
- Añadir un elemento calculado: la densidad
- Listar los 10 primeros países
- Listar los países entre el 10 y el 20
- Ordenar la salida según densidad (sin verla)
- Ver la población y comprobar el orden

```sql
SELECT
	id,
    name AS país,
    TO_CHAR(population, '999G999G999G999') AS población,
    TO_CHAR(area_sq_km, '999G999G999G999') AS extensión,
    TO_CHAR(population/area_sq_km, '999G999') AS densidad
FROM countries
WHERE population/area_sq_km IS NOT NULL
ORDER BY densidad DESC
LIMIT 11;
```

## Ejercicio 2

- Listar los países de Asia o África de cuatro letras ordenados por población

```sql
SELECT
	co.id,
    co.name AS país,
    region AS continente,
	TO_CHAR(co.population, '99G99G999G999') as población
FROM countries as co
JOIN regions as re
    ON co.region_id = re.id
WHERE
	(re.name = 'Asia' OR re.name = 'Africa')
	AND co.name LIKE '____'
ORDER BY co.population
```

```sql
SELECT c.id, c.name, c.population, r.name AS region
FROM countries c
JOIN regions r ON c.region_id = r.id
WHERE r.name IN ('Asia', 'Africa')
  AND LENGTH(c.name) = 4
ORDER BY c.population;
```

- Lista del 10 al 20 de los países mayores de 1.000.000 orden por población y mostrándola

```sql

```

- Listar los países con densidad mayor que 500
- Listar los 10 países de mayor extensión, ordenados por su población, mostrándola

```sql

```

## Ejercicio 3

Probamos algunas selecciones en las que se utilice la unión de dos tablas (select left join)

- Nombre de la ciudad, país y su extensión web de las ciudades de más de 1.000.000 de habitantes de Asia y África

```sql
SELECT ci.name AS ciudad, co.name AS país, re.name as continente, TO_CHAR(ci.population, '999G999G999G999') as posblación, co.tld AS extensión
FROM cities ci
JOIN countries co ON ci.country_id = co.id
JOIN regions re ON co.region_id = re.id
WHERE re.name IN ('Asia', 'Africa') AND ci.population > 10000000;
```

- Países y sus capitales en América

## Ejercicio 4

- Seleccionamos ciudades Europeas de más de 1.500.000 de habitantes indicado el país al que pertenecen y sus lenguajes oficiales

## Ejercicio 5

Funciones de agregación

- Cuantos países hay en el mundo según nuestra tabla
- Cual es la superficie total del mundo
- Cual es la superficie media de los países del mundo
- Cual es el país más grande del mundo
- Cual es el país más pequeño del mundo

- Cual es la superficie y la población de cada continente
