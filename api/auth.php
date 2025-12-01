<?php
/**
 * API de Autenticação Admin
 * Igreja Verbo da Vida - Pedro Leopoldo
 */

require_once 'config.php';

$db = Database::getInstance()->getConnection();
$method = $_SERVER['REQUEST_METHOD'];

if ($method !== 'POST') {
    sendError('Método não permitido. Use POST', 405);
}

try {
    $data = getRequestData();
    
    if (empty($data['password'])) {
        sendError('Senha é obrigatória', 400);
    }
    
    // Buscar hash da senha do banco
    $stmt = $db->prepare("SELECT SENHA_HASH FROM DB_ADMIN WHERE ID = 1");
    $stmt->execute();
    $admin = $stmt->fetch();
    
    if (!$admin) {
        sendError('Configuração de admin não encontrada', 500);
    }
    
    // Verificar senha
    if (password_verify($data['password'], $admin['SENHA_HASH'])) {
        // Atualizar último acesso
        $stmt = $db->prepare("UPDATE DB_ADMIN SET ULTIMO_ACESSO = CURDATE() WHERE ID = 1");
        $stmt->execute();
        
        // Retornar sucesso (em produção, você deve gerar um token JWT)
        sendJSON([
            'authenticated' => true,
            'message' => 'Login realizado com sucesso'
        ]);
    } else {
        sendError('Senha incorreta', 401);
    }
    
} catch (Exception $e) {
    error_log("Auth Error: " . $e->getMessage());
    sendError('Erro ao autenticar', 500);
}
