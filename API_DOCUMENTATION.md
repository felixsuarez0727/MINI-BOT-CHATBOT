# 📚 Documentación de la API - XumtechBot

## 🔗 Base URL
```
http://localhost:3000/api
```

## 🔐 Autenticación

La API utiliza JWT (JSON Web Tokens) para autenticación. Para endpoints protegidos, incluye el token en el header:

```
Authorization: Bearer <your-jwt-token>
```

## 📋 Endpoints

### 🤖 Chatbot Endpoints

#### POST /chatbot/message
Envía un mensaje al chatbot y recibe una respuesta.

**Request:**
```json
{
  "message": "¿Qué servicios ofrecen?",
  "sessionId": "optional-session-id"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "response": "En Xumtech ofrecemos servicios de desarrollo de software...",
    "intent": "servicios",
    "confidence": 0.9,
    "responseTime": 2,
    "suggestions": ["¿Cuáles son sus horarios?", "¿Cómo contactarlos?"],
    "fallback": false
  }
}
```

**Parámetros:**
- `message` (string, required): Mensaje del usuario (1-500 caracteres)
- `sessionId` (string, optional): ID de sesión para tracking

**Códigos de Error:**
- `400`: Datos de entrada inválidos
- `500`: Error interno del servidor

---

#### GET /chatbot/config
Obtiene la configuración del chatbot.

**Response:**
```json
{
  "success": true,
  "data": {
    "bot_name": "XumtechBot",
    "welcome_message": "¡Hola! Soy el asistente virtual de Xumtech...",
    "max_response_time": "5000",
    "confidence_threshold": "0.6",
    "suggested_queries": "¿Qué servicios ofrecen?,¿Cuáles son sus horarios?"
  }
}
```

---

#### GET /chatbot/health
Verifica el estado de salud del servicio de chatbot.

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "configLoaded": true,
    "queriesCount": 12,
    "timestamp": "2025-07-27T15:24:02.663Z"
  }
}
```

---

#### GET /chatbot/queries (Admin)
Obtiene todas las consultas disponibles del chatbot.

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "intent": "servicios",
      "patterns": "servicios,ofrecen,que hacen",
      "response": "En Xumtech ofrecemos...",
      "category": "servicios",
      "priority": 1,
      "is_active": 1
    }
  ]
}
```

---

#### GET /chatbot/stats (Admin)
Obtiene estadísticas de las conversaciones.

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total_conversations": 150,
    "avg_response_time": 245.67,
    "avg_confidence": 0.85
  }
}
```

---

#### GET /chatbot/conversations (Admin)
Obtiene conversaciones recientes.

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Query Parameters:**
- `limit` (number, optional): Número de conversaciones a obtener (default: 10)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "session_id": "uuid-session-id",
      "user_message": "¿Qué servicios ofrecen?",
      "bot_response": "En Xumtech ofrecemos...",
      "intent_matched": "servicios",
      "confidence_score": 0.9,
      "response_time_ms": 2,
      "created_at": "2025-07-27T15:24:02.663Z"
    }
  ]
}
```

### 🔐 Autenticación Endpoints

#### POST /auth/login
Inicia sesión de usuario.

**Request:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "username": "admin",
      "role": "admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "message": "Inicio de sesión exitoso"
  }
}
```

**Códigos de Error:**
- `400`: Datos de entrada inválidos
- `401`: Credenciales inválidas

---

#### GET /auth/verify
Verifica la validez de un token JWT.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "username": "admin",
      "role": "admin"
    },
    "message": "Token válido"
  }
}
```

**Códigos de Error:**
- `401`: Token requerido
- `403`: Token inválido o expirado

---

#### GET /auth/me
Obtiene información del usuario actual.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "username": "admin",
      "role": "admin"
    }
  }
}
```

### 🏥 Sistema Endpoints

#### GET /health
Verifica el estado general del servidor.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2025-07-27T15:24:02.663Z",
  "uptime": 5.205477542,
  "environment": "development"
}
```

## 📊 Códigos de Estado HTTP

| Código | Descripción |
|--------|-------------|
| 200 | OK - Solicitud exitosa |
| 201 | Created - Recurso creado |
| 400 | Bad Request - Datos inválidos |
| 401 | Unauthorized - Autenticación requerida |
| 403 | Forbidden - Acceso denegado |
| 404 | Not Found - Recurso no encontrado |
| 429 | Too Many Requests - Rate limit excedido |
| 500 | Internal Server Error - Error del servidor |
| 503 | Service Unavailable - Servicio no disponible |

## 🔒 Seguridad

### Rate Limiting
- **Límite**: 100 requests por 15 minutos por IP
- **Headers de respuesta**:
  - `X-RateLimit-Limit`: Límite de requests
  - `X-RateLimit-Remaining`: Requests restantes
  - `X-RateLimit-Reset`: Tiempo de reset

### Validación de Entrada
- **Mensajes**: 1-500 caracteres
- **Usernames**: 3-50 caracteres
- **Passwords**: Mínimo 6 caracteres
- **Sanitización**: HTML tags removidos automáticamente

### Headers de Seguridad
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security: max-age=31536000`

## 📝 Ejemplos de Uso

### Ejemplo 1: Enviar Mensaje al Chatbot
```bash
curl -X POST http://localhost:3000/api/chatbot/message \
  -H "Content-Type: application/json" \
  -d '{
    "message": "¿Cuáles son sus horarios de atención?"
  }'
```

### Ejemplo 2: Login de Administrador
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

### Ejemplo 3: Obtener Estadísticas (Admin)
```bash
curl -X GET http://localhost:3000/api/chatbot/stats \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Ejemplo 4: Verificar Estado del Servidor
```bash
curl -X GET http://localhost:3000/api/health
```

## 🧪 Testing

### Endpoints de Prueba
```bash
# Health check
curl http://localhost:3000/api/health

# Chatbot config
curl http://localhost:3000/api/chatbot/config

# Send test message
curl -X POST http://localhost:3000/api/chatbot/message \
  -H "Content-Type: application/json" \
  -d '{"message": "Hola"}'
```

### Consultas de Prueba Recomendadas
1. "¿Qué servicios ofrecen?"
2. "¿Cuáles son sus horarios?"
3. "¿Cómo puedo contactarlos?"
4. "¿Dónde están ubicados?"
5. "¿Qué es Xumtech?"

## 🔧 Configuración

### Variables de Entorno
```bash
PORT=3000
NODE_ENV=development
JWT_SECRET=your-secret-key
DB_PATH=./database/chatbot.db
FRONTEND_URL=http://localhost:3000
```

### Configuración de CORS
```javascript
{
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}
```

## 📈 Monitoreo

### Métricas Disponibles
- Tiempo de respuesta promedio
- Número total de conversaciones
- Nivel de confianza promedio
- Consultas más frecuentes
- Errores y fallbacks

### Logs
- Conversaciones de usuarios
- Errores de API
- Accesos de administración
- Performance metrics

## 🚀 Despliegue

### Producción
```bash
# Configurar variables de entorno
NODE_ENV=production
JWT_SECRET=your-production-secret
PORT=3000

# Iniciar servidor
npm start
```

### Docker (Futuro)
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 📞 Soporte

Para soporte técnico o preguntas sobre la API:
- **Documentación**: Este archivo
- **Issues**: Crear issue en el repositorio
- **Email**: soporte@xumtech.com

---

*Documentación generada automáticamente - XumtechBot API v1.0.0* 