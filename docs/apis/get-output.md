# Get Output

Retrieve the research output from a completed conversation.

## Endpoint

```
GET /api/v1/conversation/{request_id}/output
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
curl -X GET https://api.fay.work/api/v1/conversation/e0a05c59-a5d7-44f3-8d5e-9e535e4db957/output \
  -H "Authorization: Bearer YOUR_API_KEY"
```

```javascript
const requestId = 'e0a05c59-a5d7-44f3-8d5e-9e535e4db957';
const response = await fetch(`https://api.fay.work/api/v1/conversation/${requestId}/output`, {
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

response = requests.get(f'https://api.fay.work/api/v1/conversation/{request_id}/output', 
                       headers=headers)
```

## Response

### Success Response (200 OK)

```json
{
  "status": true,
  "version": "1.0.24",
  "data": {
    "conversation_id": "68594d2b733c9f7ac2422f1f",
    "status": "COMPLETED",
    "output": "### AI-Powered Innovation in Book Editing and Writing\n\nThe publishing industry is undergoing a significant transformation, with artificial intelligence at the forefront of this change. A new wave of companies is developing AI agents specifically designed for book editing and writing processes.\n\n#### Key Companies in AI Book Editing & Writing:\n\n1. **Grammarly** - Advanced writing assistant with AI-powered grammar and style suggestions\n2. **ProWritingAid** - Comprehensive writing analysis tool with AI-driven feedback\n3. **Hemingway Editor** - AI-powered readability and style optimization\n4. **Jasper AI** - Content creation platform with book writing capabilities\n5. **Sudowrite** - AI-powered creative writing assistant for authors\n\n#### Emerging Trends:\n\n- **Automated Manuscript Analysis**: AI agents that analyze plot structure, character development, and pacing\n- **Intelligent Editing Suggestions**: Context-aware recommendations for improving writing quality\n- **Collaborative Writing Tools**: AI assistants that work alongside human authors\n- **Market Analysis Integration**: AI tools that help authors understand market trends and reader preferences\n\n#### Benefits for Authors:\n\n- **Faster Editing Cycles**: AI can identify issues quickly, reducing revision time\n- **Consistent Quality**: AI ensures consistency in style, grammar, and formatting\n- **Data-Driven Insights**: AI provides insights based on successful book patterns\n- **Accessibility**: Makes professional editing tools available to independent authors\n\nThis technological evolution is democratizing the publishing process, allowing more authors to produce high-quality work with AI assistance."
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
    "message": "Research not completed yet",
    "code": "RESEARCH_NOT_COMPLETED"
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
| `data.conversation_id` | string | Internal conversation identifier |
| `data.status` | string | Current status (should be COMPLETED) |
| `data.output` | string | The research output in markdown format |

## Output Format

The output is returned in **Markdown format** and includes:

- **Structured headings** with proper hierarchy
- **Lists and bullet points** for organized information
- **Bold and italic text** for emphasis
- **Links** to sources when available
- **Code blocks** for technical content when relevant

## Best Practices

### Check Status First

Always check the status before requesting output:

```javascript
async function getResearchOutput(requestId) {
  // First check if research is completed
  const statusResponse = await fetch(`https://api.fay.work/api/v1/conversation/${requestId}/status`, {
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY'
    }
  });
  
  const statusResult = await statusResponse.json();
  
  if (!statusResult.status) {
    throw new Error(statusResult.error.message);
  }
  
  if (statusResult.data.status !== 'COMPLETED') {
    throw new Error(`Research not completed. Current status: ${statusResult.data.status}`);
  }
  
  // Now get the output
  const outputResponse = await fetch(`https://api.fay.work/api/v1/conversation/${requestId}/output`, {
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY'
    }
  });
  
  const outputResult = await outputResponse.json();
  
  if (!outputResult.status) {
    throw new Error(outputResult.error.message);
  }
  
  return outputResult.data.output;
}
```

### Error Handling

```javascript
const getOutput = async (requestId) => {
  try {
    const response = await fetch(`https://api.fay.work/api/v1/conversation/${requestId}/output`, {
      headers: {
        'Authorization': 'Bearer YOUR_API_KEY'
      }
    });
    
    const result = await response.json();
    
    if (!result.status) {
      throw new Error(result.error.message);
    }
    
    return result.data.output;
  } catch (error) {
    console.error('Failed to get output:', error);
    throw error;
  }
};
```

### Processing Output

```javascript
// Parse markdown output
function processOutput(output) {
  // You can use a markdown parser like marked.js
  const html = marked.parse(output);
  
  // Extract headings
  const headings = output.match(/^#{1,6}\s+(.+)$/gm) || [];
  
  // Extract links
  const links = output.match(/\[([^\]]+)\]\(([^)]+)\)/g) || [];
  
  return {
    html,
    headings: headings.map(h => h.replace(/^#{1,6}\s+/, '')),
    links: links.map(l => {
      const match = l.match(/\[([^\]]+)\]\(([^)]+)\)/);
      return { text: match[1], url: match[2] };
    }),
    raw: output
  };
}
```

## Rate Limits

- **Free Tier**: 50 output requests per hour
- **Pro Tier**: 500 output requests per hour
- **Enterprise**: Custom limits

## Output Retention

- Research outputs are retained for **30 days** after completion
- After 30 days, outputs are automatically deleted
- Download and store important outputs locally

## Structured Output

If you requested structured output, the response will include JSON data:

```json
{
  "status": true,
  "version": "1.0.24",
  "data": {
    "conversation_id": "68594d2b733c9f7ac2422f1f",
    "status": "COMPLETED",
    "output": {
      "companies": [
        {
          "name": "Grammarly",
          "description": "Advanced writing assistant with AI-powered grammar and style suggestions",
          "founded": "2009"
        },
        {
          "name": "ProWritingAid",
          "description": "Comprehensive writing analysis tool with AI-driven feedback",
          "founded": "2012"
        }
      ]
    }
  }
}
```

## Next Steps

After retrieving the output, you can:

- Process and display the markdown content
- Extract specific information using text parsing
- Store the results in your database
- Use the `conversation_id` for future reference

## Related Endpoints

- [Create Conversation](/docs/apis/create-conversation) - Start a new research request
- [Check Status](/docs/apis/check-status) - Monitor research progress
- [Stop Conversation](/docs/apis/stop-conversation) - Cancel ongoing research 