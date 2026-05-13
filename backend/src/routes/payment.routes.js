const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');

// Tạo link thanh toán MoMo
router.post('/momo', paymentController.createMoMoPayment);

// Xác thực kết quả thanh toán từ redirect
router.post('/verify', paymentController.checkPaymentStatus);

// Callback nhận kết quả từ MoMo (IPN)
router.post('/callback', paymentController.handleMoMoCallback);

module.exports = router;
