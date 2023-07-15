-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Versión del servidor:         10.11.2-MariaDB - mariadb.org binary distribution
-- SO del servidor:              Win64
-- HeidiSQL Versión:             11.3.0.6295
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Volcando estructura de base de datos para musala
CREATE DATABASE IF NOT EXISTS `musala` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */;
USE `musala`;

-- Volcando estructura para tabla musala.drone
CREATE TABLE IF NOT EXISTS `drone` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `serial_number` char(100) NOT NULL COMMENT '100 characters max',
  `model` int(11) NOT NULL,
  `weight_limit` float NOT NULL DEFAULT 0,
  `battery_capacity` float NOT NULL,
  `state` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `serial_number` (`serial_number`),
  KEY `state` (`state`),
  KEY `FK_drone_model` (`model`),
  CONSTRAINT `FK_drone_model` FOREIGN KEY (`model`) REFERENCES `model` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_drone_state` FOREIGN KEY (`state`) REFERENCES `state` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='// from 0 to 10\r\nserial number (100 characters max);\r\nmodel (Lightweight, Middleweight, Cruiserweight, Heavyweight);\r\nweight limit (500gr max);\r\nbattery capacity (percentage);\r\nstate (IDLE, LOADING, LOADED, DELIVERING, DELIVERED, RETURNING).\r\n';

-- Volcando datos para la tabla musala.drone: ~2 rows (aproximadamente)
DELETE FROM `drone`;
/*!40000 ALTER TABLE `drone` DISABLE KEYS */;
INSERT INTO `drone` (`id`, `serial_number`, `model`, `weight_limit`, `battery_capacity`, `state`) VALUES
	(1, 'sdfs-456', 1, 140, 80, 1),
	(2, 'ert_ert', 4, 500, 20, 6),
	(3, 'cgfg', 3, 450, 45, 3),
	(4, 'cgfg3', 2, 345, 33, 2),
	(7, 'cgfg8', 3, 240, 50, 3),
	(13, 'fghf', 2, 500, 98, 6),
	(15, 'fghfu7', 2, 500, 98, 6);
/*!40000 ALTER TABLE `drone` ENABLE KEYS */;

-- Volcando estructura para tabla musala.drone_log
CREATE TABLE IF NOT EXISTS `drone_log` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `drone_id` int(10) NOT NULL,
  `battery_log` char(50) NOT NULL,
  `update` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK__dron` (`drone_id`) USING BTREE,
  CONSTRAINT `FK_drone_log_drone` FOREIGN KEY (`drone_id`) REFERENCES `drone` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla musala.drone_log: ~0 rows (aproximadamente)
DELETE FROM `drone_log`;
/*!40000 ALTER TABLE `drone_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `drone_log` ENABLE KEYS */;

-- Volcando estructura para tabla musala.drone_medication
CREATE TABLE IF NOT EXISTS `drone_medication` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `drone_id` int(10) NOT NULL,
  `medication_id` int(11) NOT NULL,
  `timelog` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_dron_medication_dron` (`drone_id`) USING BTREE,
  KEY `FK_drone_medication_medication` (`medication_id`),
  CONSTRAINT `FK_drone_medication_drone` FOREIGN KEY (`drone_id`) REFERENCES `drone` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_drone_medication_medication` FOREIGN KEY (`medication_id`) REFERENCES `medication` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla musala.drone_medication: ~0 rows (aproximadamente)
DELETE FROM `drone_medication`;
/*!40000 ALTER TABLE `drone_medication` DISABLE KEYS */;
INSERT INTO `drone_medication` (`id`, `drone_id`, `medication_id`, `timelog`) VALUES
	(1, 3, 3, NULL),
	(2, 3, 6, NULL),
	(3, 3, 5, NULL),
	(4, 13, 1, '2023-07-15 07:45:58'),
	(5, 13, 2, '2023-07-15 07:45:59'),
	(6, 13, 3, '2023-07-15 07:45:59'),
	(7, 13, 4, '2023-07-15 07:45:59'),
	(8, 13, 5, '2023-07-15 07:45:59'),
	(9, 13, 6, '2023-07-15 07:46:00'),
	(10, 13, 7, '2023-07-15 07:46:00'),
	(11, 13, 8, '2023-07-15 07:46:00'),
	(12, 13, 9, '2023-07-15 07:46:00'),
	(13, 13, 10, '2023-07-15 07:46:00'),
	(14, 15, 3, '2023-07-15 07:55:06'),
	(15, 15, 1, '2023-07-15 07:55:06'),
	(16, 15, 2, '2023-07-15 07:55:06');
/*!40000 ALTER TABLE `drone_medication` ENABLE KEYS */;

-- Volcando estructura para tabla musala.medication
CREATE TABLE IF NOT EXISTS `medication` (
  `id` int(11) NOT NULL,
  `name` char(150) NOT NULL COMMENT 'allowed only letters, numbers, ‘-‘, ‘_’',
  `weight` float NOT NULL,
  `code` char(50) NOT NULL COMMENT 'allowed only upper case letters, underscore and numbers',
  `image` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla musala.medication: ~10 rows (aproximadamente)
DELETE FROM `medication`;
/*!40000 ALTER TABLE `medication` DISABLE KEYS */;
INSERT INTO `medication` (`id`, `name`, `weight`, `code`, `image`) VALUES
	(1, 'Famciclovir', 50, 'asd45', NULL),
	(2, 'Farbital', 120, 'fa98', NULL),
	(3, 'Felbamato', 399, 'fel34', NULL),
	(4, 'Femtest', 250, 'jsj', NULL),
	(5, 'Fenofibrato', 450, 'hs', NULL),
	(6, 'Fentanilo', 300, '54', NULL),
	(7, 'Xadago', 94, 'xa344', NULL),
	(8, 'Xigduo', 320, 'df', NULL),
	(9, 'Oxibato de sodio', 80, 'sds', NULL),
	(10, 'Abraxane', 210, 'df', NULL);
/*!40000 ALTER TABLE `medication` ENABLE KEYS */;

-- Volcando estructura para tabla musala.model
CREATE TABLE IF NOT EXISTS `model` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` char(15) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Dron´s models\r\n\r\n0-149, 150-249, 250-349, 350-500 depending of the name';

-- Volcando datos para la tabla musala.model: ~4 rows (aproximadamente)
DELETE FROM `model`;
/*!40000 ALTER TABLE `model` DISABLE KEYS */;
INSERT INTO `model` (`id`, `name`) VALUES
	(1, 'Lightweight'),
	(2, 'Middleweight'),
	(3, 'Cruiserweight'),
	(4, 'Heavyweight');
/*!40000 ALTER TABLE `model` ENABLE KEYS */;

-- Volcando estructura para tabla musala.state
CREATE TABLE IF NOT EXISTS `state` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` char(15) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='drones states';

-- Volcando datos para la tabla musala.state: ~6 rows (aproximadamente)
DELETE FROM `state`;
/*!40000 ALTER TABLE `state` DISABLE KEYS */;
INSERT INTO `state` (`id`, `name`) VALUES
	(1, 'IDLE'),
	(2, 'LOADING'),
	(3, 'LOADED'),
	(4, 'DELIVERING'),
	(5, 'DELIVERED'),
	(6, 'RETURNING');
/*!40000 ALTER TABLE `state` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
