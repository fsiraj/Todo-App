DROP DATABASE IF EXISTS todoapp;
CREATE DATABASE todoapp;
USE todoapp;
CREATE TABLE tasks (
    id INT NOT NULL AUTO_INCREMENT,
    task VARCHAR(128) NOT NULL,
    done BOOLEAN NOT NULL DEFAULT 0,
    added TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    edited TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);