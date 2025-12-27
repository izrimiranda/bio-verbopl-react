<?php
/**
 * Configuração do Banco de Dados MySQL
 * Igreja Verbo da Vida - Pedro Leopoldo
 */

// Configurações do banco de dados
define('DB_HOST', '205.172.59.146');
define('DB_NAME', 'verboadmin_bio_db');
define('DB_USER', 'verboadmin_bio');
define('DB_PASS', 'i[)@Hrq_Aa-24YRK');
define('DB_CHARSET', 'utf8mb4');

// Headers CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=utf-8');

// Tratar requisições OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

/**
 * Classe de Conexão com o Banco de Dados
 */
class Database
{
    private static $instance = null;
    private $conn;

    private function __construct()
    {
        try {
            $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ];

            $this->conn = new PDO($dsn, DB_USER, DB_PASS, $options);
        } catch (PDOException $e) {
            error_log("Database connection error: " . $e->getMessage());
            http_response_code(500);
            echo json_encode(['error' => 'Erro ao conectar com o banco de dados']);
            exit();
        }
    }

    public static function getInstance()
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function getConnection()
    {
        return $this->conn;
    }
}

/**
 * Funções Auxiliares
 */
function sendJSON($data, $statusCode = 200)
{
    http_response_code($statusCode);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit();
}

function sendError($message, $statusCode = 400)
{
    sendJSON(['error' => $message], $statusCode);
}

function getRequestData()
{
    $data = json_decode(file_get_contents('php://input'), true);
    return $data ?? [];
}
