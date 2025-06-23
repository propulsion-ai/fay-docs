# Check Status

Check the status of a research conversation to monitor its progress.

## Endpoint

```
GET /api/v1/conversation/{request_id}/status
```

## Request Headers

| Header | Type | Required | Description |
|--------|------|----------|-------------|
| `Authorization` | string | Yes | Bearer token for authentication |

## Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `request_id` | string | Yes | The request ID returned from create conversation |

### Example Request

```bash
curl -X GET https://api.fay.work/api/v1/conversation/e0a05c59-a5d7-44f3-8d5e-9e535e4db957/status \
  -H "Authorization: Bearer YOUR_API_KEY"
```

```javascript
const requestId = 'e0a05c59-a5d7-44f3-8d5e-9e535e4db957';
const response = await fetch(`https://api.fay.work/api/v1/conversation/${requestId}/status`, {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  }
});
```

```python
import requests

request_id = 'e0a05c59-a5d7-44f3-8d5e-9e535e4db957'
headers = {
    'Authorization': 'Bearer YOUR_API_KEY'
}

response = requests.get(f'https://api.fay.work/api/v1/conversation/{request_id}/status', 
                       headers=headers)
```

## Response

### Success Response (200 OK)

#### Pending Status

```json
{
  "status": true,
  "version": "1.0.24",
  "data": {
    "request_id": "e0a05c59-a5d7-44f3-8d5e-9e535e4db957",
    "status": "PENDING",
    "prompt": "Curate me a list of companies building AI agents in book editing / writing sector.",
    "structured_output": false,
    "output_schema": null,
    "conversation_id": "68594d2b733c9f7ac2422f1f",
    "created_at": "2025-06-23T12:48:43.031000+00:00",
    "started_at": null,
    "completed_at": null,
    "error_message": null,
    "metadata": null
  }
}
```

#### Completed Status

```json
{
  "status": true,
  "version": "1.0.24",
  "data": {
    "request_id": "8f1fdfde-cecb-4ea9-aeec-502d9c6d68d2",
    "status": "COMPLETED",
    "prompt": "Curate me a list of companies building AI agents in book editing / writing sector.",
    "structured_output": false,
    "output_schema": null,
    "conversation_id": "68594d2b733c9f7ac2422f1f",
    "created_at": "2025-06-23T12:48:43.031000+00:00",
    "started_at": "2025-06-23T12:49:32.888000+00:00",
    "completed_at": "2025-06-23T12:49:44.067000+00:00",
    "error_message": null,
    "metadata": null
  }
}
```

#### Failed Status

```json
{
  "status": true,
  "version": "1.0.24",
  "data": {
    "request_id": "8f1fdfde-cecb-4ea9-aeec-502d9c6d68d2",
    "status": "FAILED",
    "prompt": "Curate me a list of companies building AI agents in book editing / writing sector.",
    "structured_output": false,
    "output_schema": null,
    "conversation_id": "68594d2b733c9f7ac2422f1f",
    "created_at": "2025-06-23T12:48:43.031000+00:00",
    "started_at": "2025-06-23T12:49:32.888000+00:00",
    "completed_at": "2025-06-23T12:49:44.067000+00:00",
    "error_message": "Error adding new message to conversation - Unable to match input value to any allowed input type for the field.",
    "metadata": null
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
| `data.status` | string | Current status (PENDING, PROCESSING, COMPLETED, FAILED) |
| `data.prompt` | string | Original research prompt |
| `data.structured_output` | boolean | Whether structured output was requested |
| `data.output_schema` | object | JSON schema for structured output (if requested) |
| `data.conversation_id` | string | Internal conversation identifier |
| `data.created_at` | string | Request creation timestamp (ISO 8601) |
| `data.started_at` | string | Processing start timestamp (ISO 8601) |
| `data.completed_at` | string | Completion timestamp (ISO 8601) |
| `data.error_message` | string | Error message if status is FAILED |
| `data.metadata` | object | Additional metadata (if any) |

## Status Values

- **PENDING**: Request is queued and waiting to be processed
- **PROCESSING**: Research is currently being performed
- **COMPLETED**: Research has been completed successfully
- **FAILED**: Research failed due to an error

## Polling Strategy

For real-time updates, implement a polling strategy:

```javascript
async function pollStatus(requestId, maxAttempts = 60) {
  let attempts = 0;
  
  while (attempts < maxAttempts) {
    const response = await fetch(`https://api.fay.work/api/v1/conversation/${requestId}/status`, {
      headers: {
        'Authorization': 'Bearer YOUR_API_KEY'
      }
    });
    
    const result = await response.json();
    
    if (!result.status) {
      throw new Error(result.error.message);
    }
    
    const status = result.data.status;
    
    if (status === 'COMPLETED') {
      return result.data;
    } else if (status === 'FAILED') {
      throw new Error(result.data.error_message);
    }
    
    // Wait 2 seconds before next poll
    await new Promise(resolve => setTimeout(resolve, 2000));
    attempts++;
  }
  
  throw new Error('Timeout waiting for completion');
}

// Usage
try {
  const result = await pollStatus('e0a05c59-a5d7-44f3-8d5e-9e535e4db957');
  console.log('Research completed:', result);
} catch (error) {
  console.error('Error:', error.message);
}
```

## Best Practices

### Polling Intervals

- **PENDING**: Poll every 2-5 seconds
- **PROCESSING**: Poll every 2-3 seconds
- **COMPLETED/FAILED**: No need to poll further

### Error Handling

```javascript
const checkStatus = async (requestId) => {
  try {
    const response = await fetch(`https://api.fay.work/api/v1/conversation/${requestId}/status`, {
      headers: {
        'Authorization': 'Bearer YOUR_API_KEY'
      }
    });
    
    const result = await response.json();
    
    if (!result.status) {
      throw new Error(result.error.message);
    }
    
    return result.data;
  } catch (error) {
    console.error('Status check failed:', error);
    throw error;
  }
};
```

## Rate Limits

- **Free Tier**: 100 status checks per hour
- **Pro Tier**: 1,000 status checks per hour
- **Enterprise**: Custom limits

## Next Steps

Once status is `COMPLETED`, you can:

- [Retrieve the output](/docs/apis/get-output) to get the research results
- Use the `conversation_id` for future reference

## Related Endpoints

- [Create Conversation](/docs/apis/create-conversation) - Start a new research request
- [Get Output](/docs/apis/get-output) - Retrieve research results
- [Stop Conversation](/docs/apis/stop-conversation) - Cancel ongoing research 