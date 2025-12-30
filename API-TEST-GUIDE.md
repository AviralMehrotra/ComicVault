# API Endpoint Testing Guide

## Prerequisites

1. Run the database schema in Supabase SQL Editor
2. Update backend .env with SUPABASE_URL and SUPABASE_SERVICE_KEY
3. Start the backend server: `cd backend && npm run dev`
4. Get your auth token (see steps below)

## Get Auth Token

1. Login to your app in the browser
2. Open Developer Tools (F12)
3. Go to Application > Local Storage
4. Find the supabase auth token
5. Copy the `access_token` value

## Test Commands

### 1. Test Search (No auth needed)

```bash
curl "http://localhost:3001/api/search?query=batman&limit=5"
```

### 2. Add Comic to Collection

```bash
curl -X POST http://localhost:3001/api/comics/add-to-collection \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "comic": {
      "id": 12345,
      "name": "Batman Test",
      "publisher": {"name": "DC Comics"},
      "start_year": 2020,
      "count_of_issues": 50,
      "image": {"medium_url": "https://example.com/image.jpg"}
    },
    "status": "reading"
  }'
```

### 3. Get User Comics

```bash
curl -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  "http://localhost:3001/api/user/comics"
```

### 4. Update Comic Status (replace COMIC_ID)

```bash
curl -X PUT http://localhost:3001/api/comics/COMIC_ID/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"status": "completed", "rating": 5}'
```

### 5. Toggle Issue Read Status (replace COMIC_ID)

```bash
curl -X POST http://localhost:3001/api/issues/COMIC_ID/1/toggle \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 6. Get Reading Progress (replace COMIC_ID)

```bash
curl -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  "http://localhost:3001/api/issues/COMIC_ID/progress"
```

## Expected Responses

### Success Response Format:

```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response Format:

```json
{
  "error": "Error message"
}
```

## Common Issues

1. **401 Unauthorized**: Check your auth token
2. **500 Internal Server Error**: Check database connection and schema
3. **CORS Error**: Make sure backend is running on port 3001

## Quick Test Script

Run: `node test-endpoints.js` (after updating the token)
