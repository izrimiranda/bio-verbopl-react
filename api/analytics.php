<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once 'config.php';

// Get database connection
$db = Database::getInstance();
$pdo = $db->getConnection();

/**
 * Generate hash for IP address (privacy)
 */
function hashIP($ip) {
    return hash('sha256', $ip . 'VERBO_SALT_2025');
}

/**
 * Generate hash for User Agent (privacy)
 */
function hashUserAgent($ua) {
    return hash('sha256', $ua . 'VERBO_SALT_2025');
}

/**
 * Check if this is a unique visit based on recent activity (last 24h)
 */
function isUniqueVisit($pdo, $ipHash, $uaHash, $type, $eventId = null) {
    $sql = "SELECT COUNT(*) as count FROM DB_ANALYTICS 
            WHERE ip_hash = ? 
            AND user_agent_hash = ? 
            AND type = ?
            AND created_at > DATE_SUB(NOW(), INTERVAL 24 HOUR)";
    
    $params = [$ipHash, $uaHash, $type];
    
    if ($eventId !== null) {
        $sql .= " AND event_id = ?";
        $params[] = $eventId;
    }
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    
    return $result['count'] == 0;
}

/**
 * Record analytics event (page view, event click, or button click)
 */
function recordAnalytics($pdo) {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['type']) || !in_array($data['type'], ['page_view', 'event_click', 'button_click'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid type. Must be page_view, event_click, or button_click']);
        return;
    }
    
    // Get client IP (handle proxies)
    $ip = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    if (strpos($ip, ',') !== false) {
        $ip = trim(explode(',', $ip)[0]);
    }
    
    // Get user agent
    $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? 'unknown';
    
    // Hash for privacy
    $ipHash = hashIP($ip);
    $uaHash = hashUserAgent($userAgent);
    
    $type = $data['type'];
    $eventId = $data['event_id'] ?? null;
    $buttonName = $data['button_name'] ?? null;
    
    // Determine if unique
    $isUnique = isUniqueVisit($pdo, $ipHash, $uaHash, $type, $eventId ?: $buttonName);
    
    // Insert record - use event_id column for both event IDs and button names
    $sql = "INSERT INTO DB_ANALYTICS (event_id, ip_hash, user_agent_hash, type, is_unique) 
            VALUES (?, ?, ?, ?, ?)";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$eventId ?: $buttonName, $ipHash, $uaHash, $type, $isUnique ? 1 : 0]);
    
    echo json_encode([
        'success' => true,
        'is_unique' => $isUnique,
        'id' => $pdo->lastInsertId()
    ]);
}

/**
 * Get analytics statistics
 */
function getAnalytics($pdo) {
    $type = $_GET['type'] ?? 'all'; // all, page_view, event_click
    $eventId = $_GET['event_id'] ?? null;
    $period = $_GET['period'] ?? '30'; // days
    
    $stats = [];
    
    // Page views
    if ($type === 'all' || $type === 'page_view') {
        // For "all time" (365 days), fetch all records without date filter
        if ($period >= 365) {
            $sql = "SELECT 
                        COUNT(*) as total_views,
                        SUM(is_unique) as unique_views
                    FROM DB_ANALYTICS 
                    WHERE type = 'page_view'";
            
            $stmt = $pdo->prepare($sql);
            $stmt->execute();
        } else {
            $sql = "SELECT 
                        COUNT(*) as total_views,
                        SUM(is_unique) as unique_views
                    FROM DB_ANALYTICS 
                    WHERE type = 'page_view'
                    AND created_at > DATE_SUB(NOW(), INTERVAL ? DAY)";
            
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$period]);
        }
        $stats['page_views'] = $stmt->fetch(PDO::FETCH_ASSOC);
    }
    
    // Event clicks (per event)
    if ($type === 'all' || $type === 'event_click') {
        if ($eventId) {
            // Specific event
            if ($period >= 365) {
                $sql = "SELECT 
                            COUNT(*) as total_clicks,
                            SUM(is_unique) as unique_clicks
                        FROM DB_ANALYTICS 
                        WHERE type = 'event_click'
                        AND event_id = ?";
                
                $stmt = $pdo->prepare($sql);
                $stmt->execute([$eventId]);
            } else {
                $sql = "SELECT 
                            COUNT(*) as total_clicks,
                            SUM(is_unique) as unique_clicks
                        FROM DB_ANALYTICS 
                        WHERE type = 'event_click'
                        AND event_id = ?
                        AND created_at > DATE_SUB(NOW(), INTERVAL ? DAY)";
                
                $stmt = $pdo->prepare($sql);
                $stmt->execute([$eventId, $period]);
            }
            $stats['event_clicks'] = $stmt->fetch(PDO::FETCH_ASSOC);
        } else {
            // All events grouped
            if ($period >= 365) {
                $sql = "SELECT 
                            event_id,
                            COUNT(*) as total_clicks,
                            SUM(is_unique) as unique_clicks
                        FROM DB_ANALYTICS 
                        WHERE type = 'event_click'
                        AND event_id IS NOT NULL
                        GROUP BY event_id
                        ORDER BY total_clicks DESC";
                
                $stmt = $pdo->prepare($sql);
                $stmt->execute();
            } else {
                $sql = "SELECT 
                            event_id,
                            COUNT(*) as total_clicks,
                            SUM(is_unique) as unique_clicks
                        FROM DB_ANALYTICS 
                        WHERE type = 'event_click'
                        AND event_id IS NOT NULL
                        AND created_at > DATE_SUB(NOW(), INTERVAL ? DAY)
                        GROUP BY event_id
                        ORDER BY total_clicks DESC";
                
                $stmt = $pdo->prepare($sql);
                $stmt->execute([$period]);
            }
            $stats['event_clicks_by_event'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
        }
    }
    
    // Button clicks (grupos de crescimento e ministrações)
    if ($type === 'all' || $type === 'button_click') {
        if ($period >= 365) {
            $sql = "SELECT 
                        event_id as button_name,
                        COUNT(*) as total_clicks,
                        SUM(is_unique) as unique_clicks
                    FROM DB_ANALYTICS 
                    WHERE type = 'button_click'
                    AND event_id IS NOT NULL
                    GROUP BY event_id
                    ORDER BY total_clicks DESC";
            
            $stmt = $pdo->prepare($sql);
            $stmt->execute();
        } else {
            $sql = "SELECT 
                        event_id as button_name,
                        COUNT(*) as total_clicks,
                        SUM(is_unique) as unique_clicks
                    FROM DB_ANALYTICS 
                    WHERE type = 'button_click'
                    AND event_id IS NOT NULL
                    AND created_at > DATE_SUB(NOW(), INTERVAL ? DAY)
                    GROUP BY event_id
                    ORDER BY total_clicks DESC";
            
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$period]);
        }
        $stats['button_clicks'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
    // Recent activity timeline (last 7 days, grouped by day)
    if ($type === 'all') {
        $sql = "SELECT 
                    DATE(created_at) as date,
                    type,
                    COUNT(*) as count,
                    SUM(is_unique) as unique_count
                FROM DB_ANALYTICS 
                WHERE created_at > DATE_SUB(NOW(), INTERVAL 7 DAY)
                GROUP BY DATE(created_at), type
                ORDER BY date DESC, type";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        $stats['timeline'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
    echo json_encode($stats);
}

// Route requests
try {
    $method = $_SERVER['REQUEST_METHOD'];
    
    switch ($method) {
        case 'POST':
            recordAnalytics($pdo);
            break;
        
        case 'GET':
            getAnalytics($pdo);
            break;
        
        default:
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
