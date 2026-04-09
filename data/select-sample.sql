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
