<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Método não permitido']);
    exit;
}

try {
    // Verificar se arquivo foi enviado
    if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
        throw new Exception('Nenhum arquivo foi enviado ou ocorreu um erro no upload');
    }

    $file = $_FILES['image'];
    
    // Validar tipo de arquivo
    $allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mimeType = finfo_file($finfo, $file['tmp_name']);
    finfo_close($finfo);
    
    if (!in_array($mimeType, $allowedTypes)) {
        throw new Exception('Tipo de arquivo não permitido. Use: JPG, PNG, WEBP ou GIF');
    }
    
    // Validar tamanho (máx 5MB)
    if ($file['size'] > 5 * 1024 * 1024) {
        throw new Exception('Arquivo muito grande. Máximo: 5MB');
    }
    
    // Criar pasta capas se não existir
    // No servidor HestiaCP: /home/verboadmin/web/bio.verbopedroleopoldo.com.br/public_html/capas
    $uploadDir = __DIR__ . '/../capas/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }
    
    // Gerar nome único para o arquivo
    $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
    $fileName = 'event_' . time() . '_' . uniqid() . '.' . $extension;
    $filePath = $uploadDir . $fileName;
    
    // Mover arquivo para pasta de destino
    if (!move_uploaded_file($file['tmp_name'], $filePath)) {
        throw new Exception('Erro ao salvar arquivo no servidor');
    }
    
    // Retornar caminho relativo (sem 'public/' pois já é o root do servidor web)
    $relativePath = 'capas/' . $fileName;
    
    echo json_encode([
        'success' => true,
        'path' => $relativePath,
        'fileName' => $fileName,
        'message' => 'Upload realizado com sucesso'
    ]);
    
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
