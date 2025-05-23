<?php
header('Content-Type: application/json');

// Database connection
$host = 'localhost';
$dbname = 'frandb';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]);
    exit;
}

// Get the JSON data from the request
$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    echo json_encode(['error' => 'Invalid input']);
    exit;
}

$orders = $data['orders'];
$totalPrice = $data['totalPrice'];
$status = $data['paymentMethod'];
$address = $data['address'];

try {
    $stmt = $pdo->prepare("INSERT INTO orders (product_id, product_name, quantity, total_price, status, address) VALUES (:product_id, :product_name, :quantity, :total_price, :status, :address)");

    foreach ($orders as $order) {
        $stmt->execute([
            ':product_id' => $order['id'],
            ':product_name' => $order['name'],
            ':quantity' => $order['quantity'],
            ':total_price' => $order['totalPrice'],
            ':status' => $status,
            ':address' => $address,
        ]);
    }

    echo json_encode(['success' => true]);
} catch (PDOException $e) {
    echo json_encode(['error' => 'Failed to save order: ' . $e->getMessage()]);
}
?>