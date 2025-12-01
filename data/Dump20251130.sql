/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19  Distrib 10.11.13-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: srv723.hstgr.io    Database: u959347836_links
-- ------------------------------------------------------
-- Server version	11.8.3-MariaDB-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `DB_ADMIN`
--

DROP TABLE IF EXISTS `DB_ADMIN`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `DB_ADMIN` (
  `ID` bigint(20) NOT NULL AUTO_INCREMENT,
  `SENHA_HASH` varchar(255) NOT NULL,
  `ULTIMO_ACESSO` date NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `DB_ADMIN`
--

LOCK TABLES `DB_ADMIN` WRITE;
/*!40000 ALTER TABLE `DB_ADMIN` DISABLE KEYS */;
INSERT INTO `DB_ADMIN` VALUES
(1,'$2y$10$cecpgM.p6s5s97ZL0Zh.oOeMx8rrLHRq6QfPNjLtlRSSHWUR70ehm','2025-11-23');
/*!40000 ALTER TABLE `DB_ADMIN` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `DB_LINK`
--

DROP TABLE IF EXISTS `DB_LINK`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `DB_LINK` (
  `ID` bigint(20) NOT NULL AUTO_INCREMENT,
  `NOME_EVENTO` varchar(255) NOT NULL,
  `LINK` varchar(500) NOT NULL,
  `CAMINHO_CAPA` varchar(255) NOT NULL,
  `ORDEM` int(11) NOT NULL DEFAULT 0,
  `ATIVO` tinyint(1) NOT NULL DEFAULT 1 COMMENT 'Indica se o evento está ativo (1) ou inativo (0) na página principal',
  `DATA_INICIO` date DEFAULT NULL COMMENT 'Data de início da exibição do evento',
  `DATA_FIM` date DEFAULT NULL COMMENT 'Data de fim da exibição do evento (desativa automaticamente)',
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `DB_LINK`
--

LOCK TABLES `DB_LINK` WRITE;
/*!40000 ALTER TABLE `DB_LINK` DISABLE KEYS */;
INSERT INTO `DB_LINK` VALUES
(24,'Grupo dos Pais - Departamento Infantil','https://chat.whatsapp.com/K8dnRI0H26f5Oit0YW9QkX?mode=ac_t','capas/evento_1753917851.jpeg',3,1,'2025-10-01','2098-12-31'),
(30,'Conferência Avivamento e Milagres - 2025','https://tiketo.com.br/evento/3989','capas/evento_1759761370.png',1,0,'2025-10-01','2025-11-29'),
(35,'Inscrição Batismo nas Águas','https://discipulado.verbopedroleopoldo.com.br/sistema/inscricao/batismo.php','capas/evento_1763931908.jpeg',2,1,'2025-11-23','2025-12-06');
/*!40000 ALTER TABLE `DB_LINK` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `emails`
--

DROP TABLE IF EXISTS `emails`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `emails` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `emails`
--

LOCK TABLES `emails` WRITE;
/*!40000 ALTER TABLE `emails` DISABLE KEYS */;
INSERT INTO `emails` VALUES
(1,'i.brunomiranda@gmail.com');
/*!40000 ALTER TABLE `emails` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `eventos`
--

DROP TABLE IF EXISTS `eventos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `eventos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `titulo` varchar(255) NOT NULL,
  `data` date NOT NULL,
  `hora` time DEFAULT NULL,
  `categoria` varchar(50) NOT NULL,
  `descricao` text DEFAULT NULL,
  `criado_em` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `eventos`
--

LOCK TABLES `eventos` WRITE;
/*!40000 ALTER TABLE `eventos` DISABLE KEYS */;
INSERT INTO `eventos` VALUES
(1,'Teste Título','2025-04-11','08:00:00','Cultos','Teste Descricao','2025-04-11 20:12:00');
/*!40000 ALTER TABLE `eventos` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-30 13:48:26
