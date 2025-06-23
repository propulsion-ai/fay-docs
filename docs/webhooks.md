# Webhooks

Learn how to use Fay webhooks to receive real-time notifications about research completion and other events through our dashboard interface.

## What are Webhooks?

Webhooks allow Fay to send real-time notifications to your application when certain events occur. Instead of polling our API for updates, webhooks push data to your server as soon as events happen.

## Supported Events

Fay currently supports the following webhook events:

- `Status` - Sent when a research task status changes (PENDING → PROCESSING → COMPLETED/FAILED)
- `Output` - Sent when research output is ready and available
- `Error` - Sent when a research task encounters an error

## Setting Up Webhooks

### Step 1: Create a Webhook Endpoint

First, create an endpoint in your application to receive webhook notifications:

```javascript
// Express.js example
app.post('/webhooks/fay', (req, res) => {
  const event = req.body;
  
  // Verify the webhook signature
  if (!verifyWebhookSignature(req)) {
    return res.status(400).send('Invalid signature');
  }
  
  // Handle the event
  switch (event.type) {
    case 'Status':
      handleStatusUpdate(event.data);
      break;
    case 'Output':
      handleResearchOutput(event.data);
      break;
    case 'Error':
      handleResearchError(event.data);
      break;
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }
  
  res.status(200).send('OK');
});
```

### Step 2: Register Your Webhook

1. Log in to your Fay dashboard at [fay.work](https://fay.work)
2. Click on your profile picture in the top right corner
3. Select "Settings" from the dropdown menu
4. In the left sidebar, click on "Webhooks"
5. Click "Register Webhook"
6. Enter your webhook URL (must be HTTPS)
7. Select the events you want to receive:
   - **Status** - Task status updates
   - **Output** - Research results
   - **Error** - Error notifications
8. Click "Register"

### Step 3: Get Your Webhook Secret

After registering, you'll receive a webhook secret. This secret is used to verify that webhook payloads come from Fay.

**Important**: Copy and save your webhook secret immediately. You won't be able to see it again for security reasons.

## Webhook Payload Structure

All webhook payloads follow this structure:

```json
{
  "id": "evt_1234567890",
  "type": "Status",
  "created": 1640995200,
  "data": {
    // Event-specific data
  }
}
```

### Status Event

Sent when the research status changes:

```json
{
  "id": "evt_1234567890",
  "type": "Status",
  "created": 1640995200,
  "data": {
    "request_id": "e0a05c59-a5d7-44f3-8d5e-9e535e4db957",
    "status": "PROCESSING",
    "prompt": "Curate me a list of companies building AI agents in book editing / writing sector.",
    "conversation_id": "68594d2b733c9f7ac2422f1f",
    "created_at": "2025-06-23T12:48:43.031000+00:00",
    "started_at": "2025-06-23T12:49:32.888000+00:00",
    "completed_at": null
  }
}
```

### Output Event

Sent when research is completed and output is available:

```json
{
  "id": "evt_1234567891",
  "type": "Output",
  "created": 1640995200,
  "data": {
    "request_id": "e0a05c59-a5d7-44f3-8d5e-9e535e4db957",
    "conversation_id": "68594d2b733c9f7ac2422f1f",
    "status": "COMPLETED",
    "output": "### AI-Powered Innovation in Book Editing and Writing\n\nThe publishing industry is undergoing a significant transformation...",
    "completed_at": "2025-06-23T12:49:44.067000+00:00"
  }
}
```

### Error Event

Sent when research fails:

```json
{
  "id": "evt_1234567892",
  "type": "Error",
  "created": 1640995200,
  "data": {
    "request_id": "e0a05c59-a5d7-44f3-8d5e-9e535e4db957",
    "conversation_id": "68594d2b733c9f7ac2422f1f",
    "status": "FAILED",
    "error_message": "Error adding new message to conversation - Unable to match input value to any allowed input type for the field.",
    "completed_at": "2025-06-23T12:49:44.067000+00:00"
  }
}
```

## Security

### Webhook Signatures

Fay signs all webhook payloads to ensure they come from us. Each webhook request includes an `X-Fay-Signature` header with an HMAC-SHA256 signature.

#### Signature Format
```
X-Fay-Signature: sha256=<signature>
```

#### Verification Process

1. Get the raw request body
2. Get the signature from the `X-Fay-Signature` header
3. Extract the signature value (remove `sha256=` prefix)
4. Compute HMAC-SHA256 of the request body using your webhook secret
5. Compare the computed signature with the received signature

#### JavaScript/Node.js

```javascript
const crypto = require('crypto');

function verifyWebhookSignature(payload, signature, secret) {
    // Remove 'sha256=' prefix if present
    const signatureValue = signature.replace('sha256=', '');
    
    // Compute expected signature
    const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(payload)
        .digest('hex');
    
    // Compare signatures securely
    return crypto.timingSafeEqual(
        Buffer.from(signatureValue, 'hex'),
        Buffer.from(expectedSignature, 'hex')
    );
}

// Usage in Express
app.post('/webhooks/fay', (req, res) => {
    const payload = JSON.stringify(req.body);
    const signature = req.headers['x-fay-signature'];
    
    if (!verifyWebhookSignature(payload, signature, process.env.FAY_WEBHOOK_SECRET)) {
        return res.status(401).json({ error: 'Invalid signature' });
    }
    
    // Process webhook
    handleWebhookEvent(req.body);
    res.json({ status: 'ok' });
});
```

#### Python

```python
import hmac
import hashlib
import json
import os

def verify_webhook_signature(payload: str, signature: str, secret: str) -> bool:
    """Verify webhook signature"""
    # Remove 'sha256=' prefix if present
    if signature.startswith('sha256='):
        signature = signature[7:]
    
    # Compute expected signature
    expected_signature = hmac.new(
        secret.encode('utf-8'),
        payload.encode('utf-8'),
        hashlib.sha256
    ).hexdigest()
    
    # Compare signatures securely
    return hmac.compare_digest(signature, expected_signature)

# Flask example
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/webhooks/fay', methods=['POST'])
def webhook_handler():
    signature = request.headers.get('x-fay-signature')
    if not signature:
        return jsonify({'error': 'Missing signature'}), 400
    
    payload = request.get_data(as_text=True)
    
    if not verify_webhook_signature(payload, signature, os.environ.get('FAY_WEBHOOK_SECRET')):
        return jsonify({'error': 'Invalid signature'}), 401
    
    # Process webhook
    event = request.json
    handle_webhook_event(event)
    return jsonify({'status': 'ok'}), 200
```

#### PHP

```php
<?php

function verifyWebhookSignature($payload, $signature, $secret) {
    // Remove 'sha256=' prefix if present
    if (strpos($signature, 'sha256=') === 0) {
        $signature = substr($signature, 7);
    }
    
    $expectedSignature = hash_hmac('sha256', $payload, $secret);
    return hash_equals($expectedSignature, $signature);
}

// Usage in webhook endpoint
$payload = file_get_contents('php://input');
$signature = $_SERVER['HTTP_X_FAY_SIGNATURE'] ?? '';

if (!verifyWebhookSignature($payload, $signature, $_ENV['FAY_WEBHOOK_SECRET'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Invalid signature']);
    exit;
}

// Process webhook
$event = json_decode($payload, true);
handleWebhookEvent($event);

http_response_code(200);
echo json_encode(['status' => 'ok']);
?>
```

#### Ruby

```ruby
require 'openssl'
require 'json'

def verify_webhook_signature(payload, signature, secret)
  # Remove 'sha256=' prefix if present
  signature_value = signature.gsub('sha256=', '')
  
  expected_signature = OpenSSL::HMAC.hexdigest('sha256', secret, payload)
  Rack::Utils.secure_compare(signature_value, expected_signature)
end

# Sinatra example
post '/webhooks/fay' do
  signature = request.env['HTTP_X_FAY_SIGNATURE']
  payload = request.body.read
  
  unless verify_webhook_signature(payload, signature, ENV['FAY_WEBHOOK_SECRET'])
    status 401
    return { error: 'Invalid signature' }.to_json
  end
  
  # Process webhook
  event = JSON.parse(payload)
  handle_webhook_event(event)
  
  { status: 'ok' }.to_json
end
```

#### Go

```go
package main

import (
    "crypto/hmac"
    "crypto/sha256"
    "encoding/hex"
    "encoding/json"
    "net/http"
    "os"
    "strings"
)

func verifyWebhookSignature(payload []byte, signature, secret string) bool {
    // Remove 'sha256=' prefix if present
    signatureValue := strings.TrimPrefix(signature, "sha256=")
    
    h := hmac.New(sha256.New, []byte(secret))
    h.Write(payload)
    expectedSignature := hex.EncodeToString(h.Sum(nil))
    
    return hmac.Equal([]byte(signatureValue), []byte(expectedSignature))
}

func webhookHandler(w http.ResponseWriter, r *http.Request) {
    // Read request body
    body, err := io.ReadAll(r.Body)
    if err != nil {
        http.Error(w, "Error reading body", http.StatusBadRequest)
        return
    }
    
    // Get signature from header
    signature := r.Header.Get("x-fay-signature")
    if signature == "" {
        http.Error(w, "Missing signature", http.StatusBadRequest)
        return
    }
    
    // Verify signature
    if !verifyWebhookSignature(body, signature, os.Getenv("FAY_WEBHOOK_SECRET")) {
        http.Error(w, "Invalid signature", http.StatusUnauthorized)
        return
    }
    
    // Process webhook
    var event map[string]interface{}
    if err := json.Unmarshal(body, &event); err != nil {
        http.Error(w, "Invalid JSON", http.StatusBadRequest)
        return
    }
    
    handleWebhookEvent(event)
    
    w.WriteHeader(http.StatusOK)
    w.Write([]byte(`{"status":"ok"}`))
}
```

### Webhook Secret

When you register a webhook, Fay generates a secret key. Store this securely and use it to verify webhook signatures.

## Managing Your Webhooks

### Viewing Active Webhooks

1. Go to Settings → Webhooks in your Fay dashboard
2. View all your registered webhooks with their:
   - URL and event subscriptions
   - Registration date
   - Last delivery status
   - Delivery statistics

### Testing Webhooks

1. Find the webhook you want to test in the Webhooks section
2. Click "Test Webhook"
3. Fay will send a test event to your endpoint

### Deleting Webhooks

1. Find the webhook you want to delete
2. Click the "Delete" button next to the webhook
3. Confirm the action

**Warning**: Deleting a webhook will immediately stop all event deliveries to that endpoint.

## Best Practices

### Handle Duplicate Events

Webhooks may be sent multiple times for the same event. Make your webhook handler idempotent:

```javascript
function handleStatusUpdate(event) {
  const taskId = event.data.request_id;
  
  // Check if we've already processed this event
  if (alreadyProcessed(taskId)) {
    return;
  }
  
  // Process the event
  updateTaskStatus(event.data);
  
  // Mark as processed
  markAsProcessed(taskId);
}
```

### Respond Quickly

Respond to webhooks within 5 seconds. If you need more time, acknowledge the webhook immediately and process asynchronously:

```javascript
app.post('/webhooks/fay', async (req, res) => {
  // Acknowledge immediately
  res.status(200).send('OK');
  
  // Process asynchronously
  processWebhookAsync(req.body);
});
```

### Error Handling

Implement proper error handling and logging:

```javascript
app.post('/webhooks/fay', (req, res) => {
  try {
    // Verify signature
    if (!verifyWebhookSignature(req)) {
      console.error('Invalid webhook signature');
      return res.status(400).send('Invalid signature');
    }
    
    // Process webhook
    handleWebhookEvent(req.body);
    
    res.status(200).send('OK');
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).send('Internal server error');
  }
});
```

## Testing Webhooks

### Using Fay's Test Feature

1. Go to Settings → Webhooks in your Fay dashboard
2. Click "Test Webhook" for any registered webhook
3. Fay will send a test event to your endpoint

### Local Development

Use tools like ngrok to test webhooks locally:

```bash
# Install ngrok
npm install -g ngrok

# Start your local server
npm start

# In another terminal, expose your local server
ngrok http 3000

# Use the ngrok URL as your webhook endpoint
```

## Monitoring and Debugging

### Webhook Logs

Fay provides logs for all webhook delivery attempts. Check your dashboard for:

- Successful deliveries
- Failed deliveries with error details
- Retry attempts

### Common Issues

- **404 Errors**: Ensure your webhook endpoint is accessible
- **Timeout Errors**: Respond within 5 seconds
- **Signature Verification Failures**: Check your webhook secret
- **SSL Certificate Issues**: Ensure your endpoint uses valid HTTPS

## Rate Limits

Webhook delivery is subject to rate limits:

- Maximum 100 webhook deliveries per minute per endpoint
- Retry attempts are made for failed deliveries
- Webhooks are retried up to 3 times with exponential backoff

## Next Steps

- [Learn about API Keys](/docs/api-key) for authentication
- Start building real-time applications with Fay webhooks

