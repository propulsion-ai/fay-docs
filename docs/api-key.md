# API Keys

Learn how to create and manage your Fay API key through our user-friendly dashboard interface.

## What is a Fay API Key?

Your API key is your authentication credential for accessing Fay's deep research capabilities. It allows you to:

- Make API requests to Fay's research endpoints
- Access production-grade deep research with live citations
- Integrate Fay into your applications and workflows

## Creating an API Key

### Step 1: Sign Up for Fay

1. Visit [fay.work](https://fay.work) and click "Get Started"
2. Complete the registration process to create your account

### Step 2: Access API Key Management

1. Log in to your Fay dashboard at [fay.work](https://fay.work)
2. Click on your profile picture in the top right corner
3. Select "Settings" from the dropdown menu
4. In the left sidebar, click on "API Keys"

### Step 3: Generate Your API Key

1. Click "Generate New API Key"
2. Give your API key a descriptive name (e.g., "Production App", "Development Testing")
3. Set an optional expiration date (recommended for security)
4. Click "Generate"

**Important**: Copy and save your API key immediately. You won't be able to see it again for security reasons.

## Using Your API Key

### Basic API Usage

Once you have your API key, you can start using Fay's research API. Here's a complete example:

```javascript
const API_KEY = 'your_api_key_here';

// 1. Create a research conversation
async function startResearch(prompt) {
  const response = await fetch('https://api.fay.work/api/v1/conversations', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ prompt })
  });
  
  const result = await response.json();
  return result.data.request_id;
}

// 2. Check status until completed
async function waitForCompletion(requestId) {
  while (true) {
    const response = await fetch(`https://api.fay.work/api/v1/conversation/${requestId}/status`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`
      }
    });
    
    const result = await response.json();
    const status = result.data.status;
    
    if (status === 'COMPLETED') {
      return result.data;
    } else if (status === 'FAILED') {
      throw new Error(result.data.error_message);
    }
    
    // Wait 2 seconds before checking again
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
}

// 3. Get the research output
async function getOutput(requestId) {
  const response = await fetch(`https://api.fay.work/api/v1/conversation/${requestId}/output`, {
    headers: {
      'Authorization': `Bearer ${API_KEY}`
    }
  });
  
  const result = await response.json();
  return result.data.output;
}

// Complete workflow
async function researchWorkflow(prompt) {
  try {
    console.log('Starting research...');
    const requestId = await startResearch(prompt);
    console.log('Request ID:', requestId);
    
    console.log('Waiting for completion...');
    await waitForCompletion(requestId);
    
    console.log('Getting output...');
    const output = await getOutput(requestId);
    console.log('Research completed:', output);
    
    return output;
  } catch (error) {
    console.error('Research failed:', error);
    throw error;
  }
}

// Usage
researchWorkflow('What are the latest developments in quantum computing?')
  .then(output => console.log(output))
  .catch(error => console.error(error));
```

### In API Requests

Include your API key in the Authorization header:

```bash
curl -X POST https://api.fay.work/api/v1/conversations \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "What are the latest developments in quantum computing?"
  }'
```

### In Code Examples

```javascript
const response = await fetch('https://api.fay.work/api/v1/conversations', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    prompt: 'What are the latest developments in quantum computing?'
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
    'prompt': 'What are the latest developments in quantum computing?'
}

response = requests.post('https://api.fay.work/api/v1/conversations', 
                        headers=headers, json=data)
```

## Managing Your API Keys

### Viewing Active Keys

1. Go to Settings → API Keys in your Fay dashboard
2. View all your active API keys with their:
   - Name and description
   - Creation date
   - Expiration date (if set)
   - Last used date
   - Usage statistics

### Revoking Keys

1. Find the key you want to revoke in the API Keys section
2. Click the "Revoke" button next to the key
3. Confirm the action

**Warning**: Revoking a key will immediately disable all applications using that key.

### Regenerating Keys

If you suspect a key has been compromised:

1. Revoke the compromised key
2. Generate a new key with the same name and expiration
3. Update your applications with the new key

## Security Best Practices

### Keep Your API Key Secure

- **Never commit API keys to version control**
- Store keys in environment variables or secure configuration files
- Use different keys for development and production environments
- Set expiration dates for all API keys
- Rotate keys regularly

### Environment Variables

```bash
# .env file
FAY_API_KEY=your_api_key_here
```

```javascript
// JavaScript
const apiKey = process.env.FAY_API_KEY;
```

```python
# Python
import os
api_key = os.environ.get('FAY_API_KEY')
```

## API Key Features

### Expiration Dates

- Set optional expiration dates when creating API keys
- Keys automatically become invalid after expiration
- Receive notifications before keys expire
- Easily extend expiration dates from the dashboard

### Usage Tracking

- Monitor API key usage in real-time
- View request counts and bandwidth usage
- Track which applications are using each key
- Set up alerts for unusual usage patterns

### Key Permissions

All API keys have the same permissions as your user account:
- Access to all research endpoints
- Ability to create and manage webhooks
- Access to user profile and settings

## Rate Limits

API keys are subject to rate limits based on your plan:

- **Free Tier**: 100 requests per month
- **Pro Tier**: 10,000 requests per month
- **Enterprise**: Custom limits

## Getting Help

If you need assistance with API keys:

- Check our [API Reference](/docs/apis/create-conversation) for detailed endpoint documentation
- Visit our [GitHub repository](https://github.com/fay-work/fay-docs) for examples
- Contact support through your Fay dashboard

## Next Steps

Now that you have your API key, you can:

- [Explore the API Reference](/docs/apis/create-conversation) to see all available endpoints
- [Learn about Webhooks](/docs/webhooks) for real-time notifications
- Start building with Fay's deep research capabilities

