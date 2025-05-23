<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

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

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Fetch orders
    try {
        $stmt = $pdo->query("SELECT * FROM orders ORDER BY created_at DESC");
        $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($orders);
    } catch (PDOException $e) {
        echo json_encode(['error' => 'Failed to fetch orders: ' . $e->getMessage()]);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    // Update order status
    $data = json_decode(file_get_contents('php://input'), true);
    $orderId = $data['id'];
    $status = $data['status'];

    try {
        if ($status === 'Finished') {
            // Subtract stock and delete the order
            $stmt = $pdo->prepare("SELECT product_id, quantity FROM orders WHERE id = :id");
            $stmt->execute([':id' => $orderId]);
            $order = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($order) {
                $productId = $order['product_id'];
                $quantity = $order['quantity'];

                // Update stock
                $updateStockStmt = $pdo->prepare("UPDATE products SET stock = stock - :quantity WHERE id = :product_id");
                $updateStockStmt->execute([':quantity' => $quantity, ':product_id' => $productId]);

                // Delete the order
                $deleteOrderStmt = $pdo->prepare("DELETE FROM orders WHERE id = :id");
                $deleteOrderStmt->execute([':id' => $orderId]);

                echo json_encode(['success' => true, 'message' => 'Order finished and removed.']);
                exit;
            }
        } else {
            // Update order status
            $stmt = $pdo->prepare("UPDATE orders SET status = :status WHERE id = :id");
            $stmt->execute([':status' => $status, ':id' => $orderId]);
            echo json_encode(['success' => true, 'message' => 'Order status updated.']);
        }
    } catch (PDOException $e) {
        echo json_encode(['error' => 'Failed to update order status: ' . $e->getMessage()]);
    }
}
?>