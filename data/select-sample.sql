SELECT co.name as country, re.name as region
    FROM countries as co

    JOIN regions as re 
        ON co.region_id = re.id

    WHERE re.name = 'Europe';


----------------------------------------------

SELECT ci.name as city, ci.population as population, st.name as state
    FROM cities as ci

    JOIN states as st
        ON ci.id = st.id

    JOIN countries as co
        ON ci.country_id = co.id
    WHERE co.name = 'Spain';

----------------------------------------------

SELECT *
FROM cities WHERE name = 'madrid';

----------------------------------------------

SELECT
		re.name,
		COUNT(*) AS número,
		TO_CHAR(SUM(co.population), '999G999G999') AS "Población Total",
		TO_CHAR(AVG(co.population), '999G999G999') AS "Población Media"
	FROM countries AS co
	JOIN regions AS re
		ON co.region_id = re.id
	GROUP BY re.name
	HAVING COUNT(*) > 1;

----------------------------------------------

-- SUBCONSULTAS

SELECT ci.name AS ciudad, st.name AS provincia, ci.population
    FROM cities AS ci
    JOIN states st
        ON ci.state_id = st.id
    WHERE ci.country_id = (SELECT * FROM countries WHERE name = 'Spain')
        AND ci.type != 'section'
        AND ci.population > 100000
    LIMIT 20;

----------------------------------------------

-- VISTAS

DROP VIEW IF EXISTS country_cities;

CREATE VIEW country_cities AS
    SELECT ci.name AS ciudad, st.name AS provincia, ci.population AS población, 
           co.name AS país, ci.type AS tipo
        FROM cities AS ci
        JOIN states st
            ON ci.state_id = st.id
        JOIN countries co
            ON ci.country_id = co.id;

SELECT *
    FROM country_cities
    WHERE país = 'Spain'
        AND tipo != 'section'
        AND población > 100000
    LIMIT 20;
