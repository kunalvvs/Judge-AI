# AI Judge - API Reference

## Base URL
```
Development: http://localhost:5000
Production: https://your-domain.com
```

## Authentication
Currently, no authentication is required. All endpoints are public.

---

## Case Management Endpoints

### Start a New Case
Creates a new case for dispute resolution.

```http
POST /api/cases/start
```

**Request Body:**
```json
{
  "title": "Contract Dispute - Widget Manufacturing",
  "description": "Dispute regarding delivery terms"
}
```

**Response:**
```json
{
  "caseId": "case_abc123",
  "title": "Contract Dispute - Widget Manufacturing",
  "description": "Dispute regarding delivery terms",
  "status": "active",
  "maxReevaluations": 5,
  "remainingReevaluations": 5,
  "createdAt": "2025-11-11T10:30:00.000Z"
}
```

---

### Get Case Details
Retrieves complete information about a case.

```http
GET /api/cases/:caseId
```

**Response:**
```json
{
  "caseId": "case_abc123",
  "title": "Contract Dispute - Widget Manufacturing",
  "status": "active",
  "remainingReevaluations": 5,
  "arguments": {
    "sideA": [
      {
        "id": "arg_1",
        "text": "We delivered on time as agreed...",
        "files": ["contract.pdf"],
        "timestamp": "2025-11-11T10:35:00.000Z"
      }
    ],
    "sideB": [
      {
        "id": "arg_2",
        "text": "The delivery was 3 days late...",
        "files": [],
        "timestamp": "2025-11-11T10:37:00.000Z"
      }
    ]
  },
  "verdicts": [
    {
      "round": 1,
      "decision": "Side A",
      "confidence": 75,
      "reasoning": "Based on the evidence...",
      "keyPoints": ["Point 1", "Point 2"],
      "timestamp": "2025-11-11T10:40:00.000Z"
    }
  ]
}
```

---

### Submit an Argument
Submits an argument for either Side A or Side B.

```http
POST /api/cases/:caseId/argue
```

**Request Body:**
```json
{
  "side": "A",
  "text": "We delivered the goods on the agreed date as per clause 5.2 of the contract.",
  "files": ["file_id_123", "file_id_456"]
}
```

**Parameters:**
- `side` (string, required): Either "A" or "B"
- `text` (string, required): The argument text (max 5000 characters)
- `files` (array, optional): Array of file IDs from upload endpoint

**Response:**
```json
{
  "success": true,
  "argument": {
    "id": "arg_3",
    "side": "A",
    "text": "We delivered the goods...",
    "files": ["contract.pdf", "receipt.pdf"],
    "timestamp": "2025-11-11T10:45:00.000Z"
  },
  "caseId": "case_abc123"
}
```

---

### Request Verdict
Requests the AI judge to evaluate the case and provide a verdict.

```http
POST /api/cases/:caseId/verdict
```

**Request Body:**
```json
{
  "round": 2
}
```

**Response:**
```json
{
  "verdict": {
    "round": 2,
    "decision": "Side B",
    "confidence": 82,
    "reasoning": "After reviewing both arguments and the provided evidence, Side B presents a more compelling case. The delivery records clearly show a delay of 3 days, which violates the terms specified in clause 5.2.",
    "keyPoints": [
      "Delivery records confirm 3-day delay",
      "Clause 5.2 explicitly states time-sensitive delivery",
      "No force majeure clause was invoked",
      "Side B provided corroborating evidence from third party"
    ],
    "suggestions": "Side A should provide evidence of any communications about the delay or reasons for the late delivery.",
    "timestamp": "2025-11-11T10:50:00.000Z"
  },
  "remainingReevaluations": 3
}
```

**Possible Decisions:**
- `"Side A"` - Side A wins
- `"Side B"` - Side B wins
- `"Neutral"` - No clear winner / tie

**Confidence Levels:**
- 80-100%: High confidence
- 60-79%: Moderate confidence
- 40-59%: Low confidence
- 0-39%: Very low confidence

---

## Document Management Endpoints

### Upload File
Uploads a document (PDF or DOCX) for use as evidence.

```http
POST /api/upload
Content-Type: multipart/form-data
```

**Form Data:**
- `file` (file, required): The file to upload (PDF or DOCX, max 10MB)
- `caseId` (string, optional): Associated case ID
- `side` (string, optional): "A" or "B"

**Response:**
```json
{
  "success": true,
  "fileId": "file_xyz789",
  "filename": "contract.pdf",
  "originalName": "Contract Agreement 2025.pdf",
  "size": 245678,
  "mimeType": "application/pdf",
  "uploadedAt": "2025-11-11T10:32:00.000Z"
}
```

**Error Response:**
```json
{
  "error": "File too large. Maximum size is 10MB"
}
```

---

### Parse Document
Extracts text from an uploaded document.

```http
POST /api/parse
```

**Request Body:**
```json
{
  "fileId": "file_xyz789"
}
```

**Response:**
```json
{
  "success": true,
  "fileId": "file_xyz789",
  "text": "CONTRACT AGREEMENT\n\nThis agreement is made between...",
  "pages": 5,
  "wordCount": 2341
}
```

---

### Index Document
Indexes a parsed document in the vector database for RAG.

```http
POST /api/index
```

**Request Body:**
```json
{
  "fileId": "file_xyz789",
  "text": "CONTRACT AGREEMENT\n\nThis agreement...",
  "metadata": {
    "caseId": "case_abc123",
    "side": "A",
    "filename": "contract.pdf"
  }
}
```

**Response:**
```json
{
  "success": true,
  "indexed": true,
  "vectorId": "vec_123456",
  "chunks": 15
}
```

---

## Error Responses

All endpoints may return these error responses:

### 400 Bad Request
```json
{
  "error": "Invalid input: side must be 'A' or 'B'"
}
```

### 404 Not Found
```json
{
  "error": "Case not found"
}
```

### 429 Too Many Requests
```json
{
  "error": "Maximum re-evaluations reached (5)"
}
```

### 500 Internal Server Error
```json
{
  "error": "Failed to generate verdict",
  "details": "Gemini API error: Rate limit exceeded"
}
```

---

## Rate Limits

- Upload: 10 files per minute per IP
- Verdict: 1 request per 10 seconds per case
- Argue: 5 arguments per minute per case
- Maximum 5 re-evaluations per case (enforced)

---

## WebSocket Events (Future)

Currently, the API uses REST polling. WebSocket support is planned for real-time updates.

---

## Example Usage

### Complete Case Flow

```javascript
// 1. Start a case
const caseResponse = await fetch('http://localhost:5000/api/cases/start', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Contract Dispute',
    description: 'Delivery terms disagreement'
  })
});
const { caseId } = await caseResponse.json();

// 2. Upload evidence for Side A
const formData = new FormData();
formData.append('file', pdfFile);
formData.append('caseId', caseId);
formData.append('side', 'A');

const uploadResponse = await fetch('http://localhost:5000/api/upload', {
  method: 'POST',
  body: formData
});
const { fileId } = await uploadResponse.json();

// 3. Submit argument for Side A
const argResponse = await fetch(`http://localhost:5000/api/cases/${caseId}/argue`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    side: 'A',
    text: 'We delivered on time as per contract clause 5.2',
    files: [fileId]
  })
});

// 4. Submit argument for Side B
await fetch(`http://localhost:5000/api/cases/${caseId}/argue`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    side: 'B',
    text: 'The delivery was 3 days late, violating clause 5.2'
  })
});

// 5. Request verdict
const verdictResponse = await fetch(`http://localhost:5000/api/cases/${caseId}/verdict`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ round: 1 })
});
const { verdict } = await verdictResponse.json();

console.log('Decision:', verdict.decision);
console.log('Confidence:', verdict.confidence + '%');
console.log('Reasoning:', verdict.reasoning);
```

---

## Testing the API

### Using cURL

```bash
# Start a case
curl -X POST http://localhost:5000/api/cases/start \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Case","description":"Testing"}'

# Submit argument
curl -X POST http://localhost:5000/api/cases/case_abc123/argue \
  -H "Content-Type: application/json" \
  -d '{"side":"A","text":"My argument here"}'

# Get case details
curl http://localhost:5000/api/cases/case_abc123
```

### Using Postman

Import this collection URL:
```
Coming soon
```

---

## Changelog

### v1.0.0 (Current)
- Initial release
- Case management
- Document upload and parsing
- Gemini AI integration
- Vector DB support (Supabase/Pinecone)
- 5 re-evaluation limit

---

For more information, see the main [README.md](./README.md)
