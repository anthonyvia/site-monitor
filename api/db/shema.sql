CREATE SCHEMA `sites` DEFAULT CHARACTER SET utf8mb4;
CREATE TABLE `sites`.`sites` (
  `id` varchar(36) NOT NULL,
  `name` varchar(45) NOT NULL,
  `url` varchar(45) NOT NULL,
  `check_interval` INT NOT NULL,
  `created_date` datetime NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
);
CREATE TABLE `sites`.`site_checks` (
  `site_id` VARCHAR(36) NOT NULL,
  `check_result` INT NULL,
  `check_time` INT NOT NULL);
