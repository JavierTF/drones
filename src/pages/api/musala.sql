CREATE TABLE IF NOT EXISTS `model` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `name` CHAR(15) NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DELETE FROM `model`;

CREATE TABLE IF NOT EXISTS `state` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `name` CHAR(15) NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DELETE FROM `state`;

CREATE TABLE IF NOT EXISTS `config` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `key` CHAR(50) NOT NULL,
    `value` CHAR(50) NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DELETE FROM `config`;

CREATE TABLE IF NOT EXISTS `medication` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `name` CHAR(150) NOT NULL,
    `weight` FLOAT NOT NULL,
    `code` CHAR(50) NOT NULL,
    `image` VARCHAR(255) DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DELETE FROM `medication`;

CREATE TABLE IF NOT EXISTS `drone` (
    `id` INT(10) NOT NULL AUTO_INCREMENT,
    `serial_number` CHAR(100) NOT NULL,
    `model` INT(11) NOT NULL,
    `weight_limit` FLOAT NOT NULL DEFAULT 0,
    `battery_capacity` FLOAT NOT NULL,
    `state` INT(11) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `serial_number` (`serial_number`),
    KEY `state` (`state`),
    KEY `FK_drone_model` (`model`),
    CONSTRAINT `FK_drone_model` FOREIGN KEY (`model`) REFERENCES `model` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT `FK_drone_state` FOREIGN KEY (`state`) REFERENCES `state` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DELETE FROM `drone`;

CREATE TABLE IF NOT EXISTS `drone_log` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `drone_id` INT(10) NOT NULL,
    `battery_log` INT(11) NOT NULL,
    `update` DATETIME DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `FK__dron` (`drone_id`) USING BTREE,
    CONSTRAINT `FK_drone_log_drone` FOREIGN KEY (`drone_id`) REFERENCES `drone` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DELETE FROM `drone_log`;

CREATE TABLE IF NOT EXISTS `drone_medication` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `drone_id` INT(10) NOT NULL,
    `medication_id` INT(11) NOT NULL,
    `timelog` DATETIME DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `FK_dron_medication_dron` (`drone_id`) USING BTREE,
    KEY `FK_drone_medication_medication` (`medication_id`),
    CONSTRAINT `FK_drone_medication_drone` FOREIGN KEY (`drone_id`) REFERENCES `drone` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT `FK_drone_medication_medication` FOREIGN KEY (`medication_id`) REFERENCES `medication` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DELETE FROM `drone_medication`;

INSERT INTO `model` (`id`, `name`)
VALUES
    (1, 'Lightweight'),
    (2, 'Middleweight'),
    (3, 'Cruiserweight'),
    (4, 'Heavyweight');

INSERT INTO `state` (`id`, `name`)
VALUES
    (1, 'IDLE'),
    (2, 'LOADING'),
    (3, 'LOADED'),
    (4, 'DELIVERING'),
    (5, 'DELIVERED'),
    (6, 'RETURNING');

INSERT INTO `config` (`id`, `key`, `value`) VALUES (1, 'time_to_log', '60000');

INSERT INTO `medication` (`id`, `name`, `weight`, `code`, `image`)
VALUES
    (1, 'Famciclovir', 50, 'asd45', NULL),
    (2, 'Farbital', 120, 'fa98', NULL),
    (3, 'Felbamato', 399, 'fel34', NULL),
    (4, 'Femtest', 250, 'jsj', NULL),
    (5, 'Fenofibrato', 450, 'hs', NULL),
    (6, 'Fentanilo', 300, '54', NULL),
    (7, 'Xadago', 94, 'xa344', NULL),
    (8, 'Xigduo', 320, 'df', NULL),
    (9, 'Oxibato de sodio', 80, 'sds', NULL),
    (10, 'Abraxane', 210, 'df', NULL),
    (11, 'Elemento-1', 1.5, 'A', NULL),
    (12, 'Elemento_2', 2.7, 'B', NULL),
    (13, 'Elemento-_3', 0.8, 'C', NULL);

INSERT INTO `drone` (`id`, `serial_number`, `model`, `weight_limit`, `battery_capacity`, `state`)
VALUES
    (1, 'cgfg', 3, 450, 45, 3),
    (2, 'cgfg3', 2, 345, 33, 2),
    (3, 'fghf', 2, 500, 98, 6),
    (4, 'fghfu7', 2, 500, 98, 6),
    (5, 'gfjghj', 2, 54, 35, 2);
    
INSERT INTO `drone_medication` (`id`, `drone_id`, `medication_id`, `timelog`)
VALUES
    (1, 1, 3, '2023-07-15 07:45:56'),
    (3, 1, 5, '2023-07-15 07:45:57'),
    (4, 1, 1, '2023-07-15 07:45:58'),
    (5, 2, 2, '2023-07-15 07:45:59'),
    (6, 2, 3, '2023-07-15 07:45:59'),
    (9, 2, 6, '2023-07-15 07:46:00'),
    (11, 3, 8, '2023-07-15 07:46:00'),
    (13, 3, 10, '2023-07-15 07:46:00'),
    (14, 3, 3, '2023-07-15 07:55:06'),
    (16, 4, 2, '2023-07-15 07:55:06'),
    (29, 4, 3, '2023-07-15 22:55:49'),
    (30, 4, 1, '2023-07-15 22:55:50'),
    (31, 5, 11, '2023-07-24 17:20:25');