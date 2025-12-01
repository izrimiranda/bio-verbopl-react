<?php
/**
 * API de Reordenação de Eventos
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
    
    if (!isset($data['fromIndex']) || !isset($data['toIndex'])) {
        sendError('fromIndex e toIndex são obrigatórios', 400);
    }
    
    $fromIndex = (int)$data['fromIndex'];
    $toIndex = (int)$data['toIndex'];
    
    // Buscar todos os eventos ordenados
    $stmt = $db->query("SELECT ID FROM DB_LINK ORDER BY ORDEM ASC");
    $events = $stmt->fetchAll(PDO::FETCH_COLUMN);
    
    if ($fromIndex < 0 || $fromIndex >= count($events)) {
        sendError('fromIndex inválido', 400);
    }
    if ($toIndex < 0 || $toIndex >= count($events)) {
        sendError('toIndex inválido', 400);
    }
    
    // Mover elemento
    $item = array_splice($events, $fromIndex, 1)[0];
    array_splice($events, $toIndex, 0, [$item]);
    
    // Atualizar ordem no banco
    $db->beginTransaction();
    
    $stmt = $db->prepare("UPDATE DB_LINK SET ORDEM = :order WHERE ID = :id");
    foreach ($events as $index => $id) {
        $stmt->execute([
            ':order' => $index,
            ':id' => $id
        ]);
    }
    
    $db->commit();
    
    sendJSON(['message' => 'Ordem atualizada com sucesso']);
    
} catch (Exception $e) {
    if ($db->inTransaction()) {
        $db->rollBack();
    }
    error_log("Reorder Error: " . $e->getMessage());
    sendError('Erro ao reordenar eventos', 500);
}
