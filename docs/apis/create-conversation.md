# Create Conversation

Start a new research conversation with Fay's deep research platform.

## Endpoint

```
POST /api/v1/conversations
```

## Request Headers

| Header | Type | Required | Description |
|--------|------|----------|-------------|
| `Authorization` | string | Yes | Bearer token for authentication |
| `Content-Type` | string | Yes | Must be `application/json` |

## Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `prompt` | string | Yes | Your research question or prompt |
| `structured_output` | boolean | No | Request structured output (default: false) |
| `output_schema` | object | No | JSON schema for structured output |

### Example Request

```bash
curl -X POST https://api.fay.work/api/v1/conversations \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Curate me a list of companies building AI agents in book editing / writing sector."
  }'
```

```javascript
const response = await fetch('https://api.fay.work/api/v1/conversations', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    prompt: 'Curate me a list of companies building AI agents in book editing / writing sector.'
  })
});
```

```python
import requests

headers = {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
}

data = {
    'prompt': 'Curate me a list of companies building AI agents in book editing / writing sector.'
}

response = requests.post('https://api.fay.work/api/v1/conversations', 
                        headers=headers, json=data)
```

## Response

### Success Response (200 OK)

```json
{
  "status": true,
  "version": "1.0.24",
  "data": {
    "request_id": "e0a05c59-a5d7-44f3-8d5e-9e535e4db957",
    "status": "PENDING",
    "created_at": "2025-06-23T13:16:28.635000+00:00"
  }
}
```

### Error Responses

#### 400 Bad Request

```json
{
  "status": false,
  "version": "1.0.24",
  "error": {
    "message": "Invalid prompt format",
    "code": "VALIDATION_ERROR"
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

#### 429 Too Many Requests

```json
{
  "status": false,
  "version": "1.0.24",
  "error": {
    "message": "Rate limit exceeded",
    "code": "RATE_LIMIT_EXCEEDED"
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
| `data.created_at` | string | Request creation timestamp (ISO 8601) |

## Status Values

- **PENDING**: Request has been received and is queued for processing
- **PROCESSING**: Research is currently being performed
- **COMPLETED**: Research has been completed successfully
- **FAILED**: Research failed due to an error

## Structured Output

To request structured output, include the `structured_output` and `output_schema` fields:

```json
{
  "prompt": "Find the top 5 AI companies in healthcare",
  "structured_output": true,
  "output_schema": {
    "type": "object",
    "properties": {
      "companies": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "name": {"type": "string"},
            "description": {"type": "string"},
            "founded": {"type": "string"}
          }
        }
      }
    }
  }
}
```

## Best Practices

### Prompt Writing

- Be specific and clear about what you're looking for
- Include context when relevant
- Specify the format you want (list, analysis, comparison, etc.)
- Mention any specific sources or time periods if important

### Error Handling

```javascript
const response = await fetch('https://api.fay.work/api/v1/conversations', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    prompt: 'Your research question here'
  })
});

const result = await response.json();

if (!result.status) {
  console.error('API Error:', result.error);
  // Handle error appropriately
} else {
  const requestId = result.data.request_id;
  // Store request_id for status checking
  console.log('Request ID:', requestId);
}
```

## Rate Limits

- **Free Tier**: 10 requests per hour
- **Pro Tier**: 100 requests per hour
- **Enterprise**: Custom limits

## Next Steps

After creating a conversation, you can:

1. [Check the status](/docs/apis/check-status) to monitor progress
2. [Retrieve the output](/docs/apis/get-output) when completed
3. [Stop the conversation](/docs/apis/stop-conversation) if needed

## Related Endpoints

- [Check Status](/docs/apis/check-status) - Monitor conversation progress
- [Get Output](/docs/apis/get-output) - Retrieve research results
- [Stop Conversation](/docs/apis/stop-conversation) - Cancel ongoing research 