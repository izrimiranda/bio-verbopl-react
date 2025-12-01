<?php
/**
 * API de Eventos/Links
 * Igreja Verbo da Vida - Pedro Leopoldo
 */

require_once 'config.php';

$db = Database::getInstance()->getConnection();
$method = $_SERVER['REQUEST_METHOD'];

try {
    switch ($method) {
        case 'GET':
            handleGet($db);
            break;
        case 'POST':
            handlePost($db);
            break;
        case 'PUT':
            handlePut($db);
            break;
        case 'DELETE':
            handleDelete($db);
            break;
        default:
            sendError('Método não permitido', 405);
    }
} catch (Exception $e) {
    error_log("API Error: " . $e->getMessage());
    sendError('Erro interno do servidor', 500);
}

/**
 * GET - Listar todos os eventos
 */
function handleGet($db) {
    // Buscar todos os eventos ordenados por ORDEM
    $stmt = $db->prepare("
        SELECT 
            ID as id,
            NOME_EVENTO as name,
            LINK as link,
            CAMINHO_CAPA as coverImage,
            ORDEM as `order`,
            ATIVO as active,
            DATA_INICIO as startDate,
            DATA_FIM as endDate
        FROM DB_LINK
        ORDER BY ORDEM ASC
    ");
    
    $stmt->execute();
    $events = $stmt->fetchAll();
    
    // Converter valores booleanos e formatar datas
    foreach ($events as &$event) {
        $event['id'] = (string)$event['id'];
        $event['active'] = (bool)$event['active'];
        $event['order'] = (int)$event['order'];
        
        // Formatar URLs de imagem (assumindo que estão em um diretório público)
        if (!empty($event['coverImage']) && !filter_var($event['coverImage'], FILTER_VALIDATE_URL)) {
            // Se não for URL completa, assumir que é caminho relativo
            $event['coverImage'] = 'https://verbopedroleopoldo.com.br/bio/' . $event['coverImage'];
        }
    }
    
    sendJSON($events);
}

/**
 * POST - Criar novo evento
 */
function handlePost($db) {
    $data = getRequestData();
    
    // Validações
    if (empty($data['name'])) {
        sendError('Nome do evento é obrigatório', 400);
    }
    if (empty($data['link'])) {
        sendError('Link é obrigatório', 400);
    }
    
    // Obter próxima ordem
    $stmt = $db->query("SELECT MAX(ORDEM) as max_order FROM DB_LINK");
    $maxOrder = $stmt->fetch()['max_order'] ?? 0;
    $newOrder = $maxOrder + 1;
    
    // Upload de imagem (se fornecida como base64)
    $coverImage = $data['coverImage'] ?? 'https://picsum.photos/800/450';
    
    // Inserir evento
    $stmt = $db->prepare("
        INSERT INTO DB_LINK 
        (NOME_EVENTO, LINK, CAMINHO_CAPA, ORDEM, ATIVO, DATA_INICIO, DATA_FIM)
        VALUES (:name, :link, :coverImage, :order, :active, :startDate, :endDate)
    ");
    
    $stmt->execute([
        ':name' => $data['name'],
        ':link' => $data['link'],
        ':coverImage' => $coverImage,
        ':order' => $newOrder,
        ':active' => $data['active'] ?? true,
        ':startDate' => $data['startDate'] ?: null,
        ':endDate' => $data['endDate'] ?: null
    ]);
    
    $newId = $db->lastInsertId();
    
    sendJSON([
        'id' => (string)$newId,
        'message' => 'Evento criado com sucesso'
    ], 201);
}

/**
 * PUT - Atualizar evento existente
 */
function handlePut($db) {
    $data = getRequestData();
    
    if (empty($data['id'])) {
        sendError('ID do evento é obrigatório', 400);
    }
    
    // Verificar se evento existe
    $stmt = $db->prepare("SELECT ID FROM DB_LINK WHERE ID = :id");
    $stmt->execute([':id' => $data['id']]);
    
    if (!$stmt->fetch()) {
        sendError('Evento não encontrado', 404);
    }
    
    // Construir query de atualização dinamicamente
    $fields = [];
    $params = [':id' => $data['id']];
    
    if (isset($data['name'])) {
        $fields[] = "NOME_EVENTO = :name";
        $params[':name'] = $data['name'];
    }
    if (isset($data['link'])) {
        $fields[] = "LINK = :link";
        $params[':link'] = $data['link'];
    }
    if (isset($data['coverImage'])) {
        $fields[] = "CAMINHO_CAPA = :coverImage";
        $params[':coverImage'] = $data['coverImage'];
    }
    if (isset($data['order'])) {
        $fields[] = "ORDEM = :order";
        $params[':order'] = $data['order'];
    }
    if (isset($data['active'])) {
        $fields[] = "ATIVO = :active";
        $params[':active'] = $data['active'] ? 1 : 0;
    }
    if (isset($data['startDate'])) {
        $fields[] = "DATA_INICIO = :startDate";
        $params[':startDate'] = $data['startDate'] ?: null;
    }
    if (isset($data['endDate'])) {
        $fields[] = "DATA_FIM = :endDate";
        $params[':endDate'] = $data['endDate'] ?: null;
    }
    
    if (empty($fields)) {
        sendError('Nenhum campo para atualizar', 400);
    }
    
    $sql = "UPDATE DB_LINK SET " . implode(', ', $fields) . " WHERE ID = :id";
    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    
    sendJSON(['message' => 'Evento atualizado com sucesso']);
}

/**
 * DELETE - Deletar evento
 */
function handleDelete($db) {
    $id = $_GET['id'] ?? null;
    
    if (empty($id)) {
        sendError('ID do evento é obrigatório', 400);
    }
    
    // Verificar se evento existe
    $stmt = $db->prepare("SELECT CAMINHO_CAPA FROM DB_LINK WHERE ID = :id");
    $stmt->execute([':id' => $id]);
    $event = $stmt->fetch();
    
    if (!$event) {
        sendError('Evento não encontrado', 404);
    }
    
    // Deletar evento
    $stmt = $db->prepare("DELETE FROM DB_LINK WHERE ID = :id");
    $stmt->execute([':id' => $id]);
    
    // TODO: Deletar arquivo de imagem se necessário
    // if (!filter_var($event['CAMINHO_CAPA'], FILTER_VALIDATE_URL)) {
    //     @unlink('../' . $event['CAMINHO_CAPA']);
    // }
    
    sendJSON(['message' => 'Evento deletado com sucesso']);
}
