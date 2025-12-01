<?php
/**
 * Script de Teste de Conexão com MySQL
 * Igreja Verbo da Vida - Pedro Leopoldo
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json; charset=utf-8');

$host = 'srv723.hstgr.io';
$dbname = 'u959347836_links';
$username = 'u959347836_adminlink';
$password = 'z00[jZ0Z|';

$results = [
    'timestamp' => date('Y-m-d H:i:s'),
    'tests' => []
];

// Teste 1: Extensão PDO disponível
$results['tests'][] = [
    'test' => 'PDO Extension',
    'status' => extension_loaded('pdo_mysql') ? 'OK' : 'FAIL',
    'message' => extension_loaded('pdo_mysql') ? 'PDO MySQL extension is loaded' : 'PDO MySQL extension NOT found'
];

// Teste 2: Conexão com banco
try {
    $dsn = "mysql:host=$host;dbname=$dbname;charset=utf8mb4";
    $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ];
    
    $conn = new PDO($dsn, $username, $password, $options);
    
    $results['tests'][] = [
        'test' => 'Database Connection',
        'status' => 'OK',
        'message' => 'Successfully connected to database'
    ];
    
    // Teste 3: Verificar tabelas
    $tables = $conn->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);
    $results['tests'][] = [
        'test' => 'Tables Check',
        'status' => 'OK',
        'message' => 'Found ' . count($tables) . ' tables',
        'tables' => $tables
    ];
    
    // Teste 4: Contar eventos
    $stmt = $conn->query("SELECT COUNT(*) as total FROM DB_LINK");
    $count = $stmt->fetch()['total'];
    $results['tests'][] = [
        'test' => 'Events Count',
        'status' => 'OK',
        'message' => "Found $count events in DB_LINK table"
    ];
    
    // Teste 5: Listar eventos
    $stmt = $conn->query("
        SELECT 
            ID,
            NOME_EVENTO,
            LINK,
            ORDEM,
            ATIVO,
            DATA_INICIO,
            DATA_FIM
        FROM DB_LINK 
        ORDER BY ORDEM ASC 
        LIMIT 5
    ");
    $events = $stmt->fetchAll();
    $results['tests'][] = [
        'test' => 'Sample Events',
        'status' => 'OK',
        'message' => 'Retrieved sample events',
        'data' => $events
    ];
    
    // Teste 6: Verificar admin
    $stmt = $conn->query("SELECT COUNT(*) as total FROM DB_ADMIN");
    $adminCount = $stmt->fetch()['total'];
    $results['tests'][] = [
        'test' => 'Admin Check',
        'status' => 'OK',
        'message' => "Found $adminCount admin record(s)"
    ];
    
    $results['overall'] = 'SUCCESS';
    $results['message'] = 'All tests passed successfully!';
    
} catch (PDOException $e) {
    $results['tests'][] = [
        'test' => 'Database Connection',
        'status' => 'FAIL',
        'message' => 'Connection failed: ' . $e->getMessage()
    ];
    $results['overall'] = 'FAIL';
    $results['message'] = 'Database connection failed';
}

echo json_encode($results, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
