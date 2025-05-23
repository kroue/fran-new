<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$host = 'localhost';
$dbname = 'frandb';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $pdo->query("SELECT * FROM order_history ORDER BY finished_at DESC");
    $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($orders);
} catch (PDOException $e) {
    echo json_encode(['error' => 'Failed to fetch order history: ' . $e->getMessage()]);
}
?>