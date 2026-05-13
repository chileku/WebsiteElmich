const crypto = require('crypto');
const https = require('https');
const SalesInvoice = require('../models/salesInvoice.model');

// MoMo Configuration
const partnerCode = "MOMO";
const accessKey = "F8BBA842ECF85";
const secretkey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";

const createMoMoPayment = async (req, res) => {
  try {
    const { orderId, amount, orderInfo } = req.body;

    if (!orderId || !amount) {
      return res.status(400).json({ message: 'Thiếu thông tin đơn hàng hoặc số tiền.' });
    }

    const requestId = partnerCode + new Date().getTime();
    const momoOrderId = `${orderId}_${Date.now()}`; // Ensure unique orderId for MoMo
    const redirectUrl = "http://localhost:3000/payment-result"; // Local frontend URL
    const ipnUrl = "http://localhost:5000/api/payment/callback"; // Local backend URL
    const requestType = "payWithMethod";
    const extraData = ""; // pass empty value if your merchant does not have stores

    const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${momoOrderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;

    const signature = crypto.createHmac('sha256', secretkey)
      .update(rawSignature)
      .digest('hex');

    const requestBody = JSON.stringify({
      partnerCode,
      accessKey,
      requestId,
      amount: amount.toString(),
      orderId: momoOrderId,
      orderInfo,
      redirectUrl,
      ipnUrl,
      extraData,
      requestType,
      signature,
      autoCapture: true,
      lang: 'vi'
    });

    const options = {
      hostname: 'test-payment.momo.vn',
      port: 443,
      path: '/v2/gateway/api/create',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(requestBody)
      }
    };

    const request = https.request(options, response => {
      let data = '';
      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        const result = JSON.parse(data);
        if (result.resultCode === 0) {
          res.json({ payUrl: result.payUrl });
        } else {
          res.status(400).json({ message: result.localMessage || result.message || 'Lỗi từ MoMo', details: result });
        }
      });
    });

    request.on('error', (e) => {
      res.status(500).json({ message: `Lỗi kết nối MoMo: ${e.message}` });
    });

    request.write(requestBody);
    request.end();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const checkPaymentStatus = async (req, res) => {
  try {
    const {
      partnerCode, orderId, requestId, amount, orderInfo, orderType,
      transId, resultCode, message, payType, responseTime, extraData, signature
    } = req.body;

    // 1. Tạo chuỗi raw để kiểm tra chữ ký (theo format MoMo v2 redirect)
    const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&message=${message}&orderId=${orderId}&orderInfo=${orderInfo}&orderType=${orderType}&partnerCode=${partnerCode}&payType=${payType}&requestId=${requestId}&responseTime=${responseTime}&resultCode=${resultCode}&transId=${transId}`;

    const generatedSignature = crypto.createHmac('sha256', secretkey)
      .update(rawSignature)
      .digest('hex');

    // 2. Kiểm tra tính hợp lệ của chữ ký
    if (generatedSignature !== signature) {
      return res.status(400).json({ message: 'Chữ ký không hợp lệ!' });
    }

    // 3. Cập nhật cơ sở dữ liệu nếu thanh toán thành công (resultCode == 0)
    const realOrderId = orderId.split('_')[0];
    if (resultCode == 0) {
      await SalesInvoice.update(
        { Status: 'pending', PaymentStatus: 'Đã thanh toán', PaymentMethod: 'MoMo' },
        { where: { SalesInvoiceID: realOrderId } }
      );
      return res.json({ message: 'Thanh toán thành công và đã cập nhật đơn hàng.' });
    } else {
      await SalesInvoice.update(
        { Status: 'pending', PaymentStatus: 'Thanh toán thất bại', PaymentMethod: 'MoMo' },
        { where: { SalesInvoiceID: realOrderId } }
      );
      return res.json({ message: 'Thanh toán thất bại.' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const handleMoMoCallback = async (req, res) => {
  try {
    console.log('MoMo IPN Callback:', req.body);
    const {
      partnerCode, orderId, requestId, amount, orderInfo, orderType,
      transId, resultCode, message, payType, responseTime, extraData, signature
    } = req.body;

    // Tương tự callback cũng cần verify signature để bảo mật
    const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&message=${message}&orderId=${orderId}&orderInfo=${orderInfo}&orderType=${orderType}&partnerCode=${partnerCode}&payType=${payType}&requestId=${requestId}&responseTime=${responseTime}&resultCode=${resultCode}&transId=${transId}`;

    const generatedSignature = crypto.createHmac('sha256', secretkey)
      .update(rawSignature)
      .digest('hex');

    if (generatedSignature !== signature) {
      console.error('IPN Signature mismatch!');
      return res.status(400).send();
    }

    const realOrderId = orderId.split('_')[0];
    if (resultCode == 0) {
      await SalesInvoice.update(
        { Status: 'pending', PaymentStatus: 'Đã thanh toán', PaymentMethod: 'MoMo' },
        { where: { SalesInvoiceID: realOrderId } }
      );
    } else {
      await SalesInvoice.update(
        { Status: 'pending', PaymentStatus: 'Thanh toán thất bại', PaymentMethod: 'MoMo' },
        { where: { SalesInvoiceID: realOrderId } }
      );
    }

    res.status(204).send();
  } catch (err) {
    console.error('Lỗi xử lý IPN MoMo:', err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createMoMoPayment,
  checkPaymentStatus,
  handleMoMoCallback
};
