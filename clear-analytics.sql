-- ========================================
-- Script para Limpar Dados de Analytics
-- ========================================
-- Database: u959347836_links
-- Tabela: DB_ANALYTICS
-- 
-- ⚠️ ATENÇÃO: Este script irá deletar TODOS os dados de analytics!
-- Execute apenas se tiver certeza do que está fazendo.
-- ========================================

-- Visualizar dados antes de deletar (OPCIONAL)
-- SELECT COUNT(*) as total_registros FROM DB_ANALYTICS;
-- SELECT type, COUNT(*) as total FROM DB_ANALYTICS GROUP BY type;

-- LIMPAR TODOS OS DADOS DE ANALYTICS
TRUNCATE TABLE DB_ANALYTICS;

-- OU, se preferir DELETE (mais seguro, mas mais lento):
-- DELETE FROM DB_ANALYTICS;

-- Verificar se a tabela está vazia
SELECT COUNT(*) as registros_restantes FROM DB_ANALYTICS;

-- ========================================
-- Como executar este script:
-- ========================================
-- 
-- OPÇÃO 1: Via linha de comando (terminal)
-- mysql -h srv723.hstgr.io -u u959347836_adminlink -p'z00[jZ0Z|' u959347836_links < clear-analytics.sql
--
-- OPÇÃO 2: Via MySQL Workbench / phpMyAdmin
-- 1. Conecte ao banco de dados
-- 2. Copie e cole o comando TRUNCATE acima
-- 3. Execute
--
-- OPÇÃO 3: Via terminal interativo
-- mysql -h srv723.hstgr.io -u u959347836_adminlink -p'z00[jZ0Z|' u959347836_links
-- mysql> TRUNCATE TABLE DB_ANALYTICS;
-- mysql> SELECT COUNT(*) FROM DB_ANALYTICS;
-- mysql> exit;
-- ========================================
