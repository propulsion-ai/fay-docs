# Stop Conversation

Stop an ongoing research conversation before it completes.

## Endpoint

```
POST /api/v1/conversation/{request_id}/stop
```

## Request Headers

| Header | Type | Required | Description |
|--------|------|----------|-------------|
| `Authorization` | string | Yes | Bearer token for authentication |
| `Content-Type` | string | Yes | Must be `application/json` |

## Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `request_id` | string | Yes | The request ID returned from create conversation |

### Example Request

```bash
curl -X POST https://api.fay.work/api/v1/conversation/e0a05c59-a5d7-44f3-8d5e-9e535e4db957/stop \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json"
```

```javascript
const requestId = 'e0a05c59-a5d7-44f3-8d5e-9e535e4db957';
const response = await fetch(`https://api.fay.work/api/v1/conversation/${requestId}/stop`, {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
});
```

```python
import requests

request_id = 'e0a05c59-a5d7-44f3-8d5e-9e535e4db957'
headers = {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
}

response = requests.post(f'https://api.fay.work/api/v1/conversation/{request_id}/stop', 
                        headers=headers)
```

## Response

### Success Response (200 OK)

```json
{
  "status": true,
  "version": "1.0.24",
  "data": {
    "request_id": "e0a05c59-a5d7-44f3-8d5e-9e535e4db957",
    "status": "STOPPED",
    "message": "Conversation stopped successfully"
  }
}
```

### Error Responses

#### 404 Not Found

```json
{
  "status": false,
  "version": "1.0.24",
  "error": {
    "message": "Request not found",
    "code": "REQUEST_NOT_FOUND"
  }
}
```

#### 400 Bad Request

```json
{
  "status": false,
  "version": "1.0.24",
  "error": {
    "message": "Cannot stop completed conversation",
    "code": "CONVERSATION_ALREADY_COMPLETED"
  }
}
```

#### 401 Unauthorized

```json
{
  "status": false,
  "version": "1.0.24",
  "error": {
    "message": "Invalid or expired API key",
    "code": "INVALID_API_KEY"
  }
}
```

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `status` | boolean | Request success status |
| `version` | string | API version |
| `data.request_id` | string | Unique identifier for the conversation request |
| `data.status` | string | New status (STOPPED) |
| `data.message` | string | Confirmation message |

## When to Use Stop

Use the stop endpoint when you need to:

- **Cancel long-running research** that's taking too long
- **Stop research** that's no longer needed
- **Save resources** by stopping unnecessary processing
- **Implement user cancellation** in your application

## Best Practices

### Check Status Before Stopping

```javascript
async function stopConversationIfNeeded(requestId) {
  // First check current status
  const statusResponse = await fetch(`https://api.fay.work/api/v1/conversation/${requestId}/status`, {
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY'
    }
  });
  
  const statusResult = await statusResponse.json();
  
  if (!statusResult.status) {
    throw new Error(statusResult.error.message);
  }
  
  const currentStatus = statusResult.data.status;
  
  // Only stop if conversation is still running
  if (currentStatus === 'PENDING' || currentStatus === 'PROCESSING') {
    const stopResponse = await fetch(`https://api.fay.work/api/v1/conversation/${requestId}/stop`, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer YOUR_API_KEY',
        'Content-Type': 'application/json'
      }
    });
    
    const stopResult = await stopResponse.json();
    
    if (!stopResult.status) {
      throw new Error(stopResult.error.message);
    }
    
    return stopResult.data;
  } else {
    console.log(`Conversation already ${currentStatus.toLowerCase()}`);
    return statusResult.data;
  }
}
```

### Error Handling

```javascript
const stopConversation = async (requestId) => {
  try {
    const response = await fetch(`https://api.fay.work/api/v1/conversation/${requestId}/stop`, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer YOUR_API_KEY',
        'Content-Type': 'application/json'
      }
    });
    
    const result = await response.json();
    
    if (!result.status) {
      throw new Error(result.error.message);
    }
    
    return result.data;
  } catch (error) {
    console.error('Failed to stop conversation:', error);
    throw error;
  }
};
```

### User Cancellation Flow

```javascript
class ResearchManager {
  constructor() {
    this.activeRequests = new Map();
  }
  
  async startResearch(prompt) {
    const response = await fetch('https://api.fay.work/api/v1/conversations', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer YOUR_API_KEY',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt })
    });
    
    const result = await response.json();
    
    if (!result.status) {
      throw new Error(result.error.message);
    }
    
    const requestId = result.data.request_id;
    this.activeRequests.set(requestId, { prompt, startTime: Date.now() });
    
    return requestId;
  }
  
  async cancelResearch(requestId) {
    if (!this.activeRequests.has(requestId)) {
      throw new Error('Request not found in active requests');
    }
    
    try {
      await stopConversation(requestId);
      this.activeRequests.delete(requestId);
      console.log(`Research ${requestId} cancelled successfully`);
    } catch (error) {
      console.error(`Failed to cancel research ${requestId}:`, error);
      throw error;
    }
  }
  
  async cancelAllResearch() {
    const promises = Array.from(this.activeRequests.keys()).map(requestId => 
      this.cancelResearch(requestId)
    );
    
    await Promise.allSettled(promises);
    this.activeRequests.clear();
  }
}
```

## Rate Limits

- **Free Tier**: 20 stop requests per hour
- **Pro Tier**: 200 stop requests per hour
- **Enterprise**: Custom limits

## Important Notes

### What Happens When You Stop

- **Immediate termination** of the research process
- **No partial results** are saved or returned
- **Resources are freed** immediately
- **Status changes** to "STOPPED"

### Cannot Stop

- **Completed conversations** (status: COMPLETED)
- **Failed conversations** (status: FAILED)
- **Already stopped conversations** (status: STOPPED)

### After Stopping

- **No output** will be available
- **Cannot restart** the same request
- **Create a new request** if you need the research again

## Use Cases

### Timeout Management

```javascript
async function researchWithTimeout(prompt, timeoutMs = 300000) { // 5 minutes
  const requestId = await startResearch(prompt);
  
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Research timeout')), timeoutMs);
  });
  
  const completionPromise = pollForCompletion(requestId);
  
  try {
    const result = await Promise.race([completionPromise, timeoutPromise]);
    return result;
  } catch (error) {
    if (error.message === 'Research timeout') {
      await stopConversation(requestId);
      throw new Error('Research cancelled due to timeout');
    }
    throw error;
  }
}
```

### User-Initiated Cancellation

```javascript
// In your UI
const cancelButton = document.getElementById('cancel-research');
cancelButton.addEventListener('click', async () => {
  try {
    await researchManager.cancelResearch(currentRequestId);
    showMessage('Research cancelled successfully');
  } catch (error) {
    showError('Failed to cancel research: ' + error.message);
  }
});
```

## Next Steps

After stopping a conversation:

- **Clean up** any local references to the request
- **Notify users** that the research was cancelled
- **Create a new request** if needed
- **Update UI** to reflect the stopped state

## Related Endpoints

- [Create Conversation](/docs/apis/create-conversation) - Start a new research request
- [Check Status](/docs/apis/check-status) - Monitor research progress
- [Get Output](/docs/apis/get-output) - Retrieve research results 