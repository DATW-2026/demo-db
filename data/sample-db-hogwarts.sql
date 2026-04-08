DROP DATABASE IF EXISTS hogwarts;

CREATE DATABASE hogwarts;

\c hogwarts;

CREATE TABLE grimoires
(
    grimoire_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    wizard_id INT NOT NULL,
    CONSTRAINT grimoire_pkey PRIMARY KEY (grimoire_id)
);

CREATE TABLE wizards
(
    wizard_id INT NOT NULL,
    name VARCHAR(120),
    CONSTRAINT wizard_pkey PRIMARY KEY (wizard_id)
);

ALTER TABLE grimoires ADD CONSTRAINT grimoire_wizard_id_fkey
    FOREIGN KEY (wizard_id) REFERENCES wizards (wizard_id) ON DELETE NO ACTION ON UPDATE NO ACTION;

CREATE INDEX grimoires_wizard_id_idx ON grimoires (wizard_id);
