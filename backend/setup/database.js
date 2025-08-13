const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

// Use in-memory database for Vercel deployment
const dbPath = process.env.NODE_ENV === 'production' 
  ? ':memory:' 
  : path.join(__dirname, '../../database/chatbot.db');

// Ensure database directory exists only for local development
if (process.env.NODE_ENV !== 'production') {
  const fs = require('fs');
  const dbDir = path.dirname(dbPath);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }
}

const db = new sqlite3.Database(dbPath);

// Initialize database tables
const initializeDatabase = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Create users table for authentication
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          role TEXT DEFAULT 'user',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create chatbot queries table
      db.run(`
        CREATE TABLE IF NOT EXISTS chatbot_queries (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          intent TEXT NOT NULL,
          patterns TEXT NOT NULL,
          response TEXT NOT NULL,
          category TEXT DEFAULT 'general',
          priority INTEGER DEFAULT 1,
          is_active BOOLEAN DEFAULT 1,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create conversation logs table
      db.run(`
        CREATE TABLE IF NOT EXISTS conversation_logs (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          session_id TEXT NOT NULL,
          user_message TEXT NOT NULL,
          bot_response TEXT NOT NULL,
          intent_matched TEXT,
          confidence_score REAL,
          response_time_ms INTEGER,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create bot configuration table
      db.run(`
        CREATE TABLE IF NOT EXISTS bot_config (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          key TEXT UNIQUE NOT NULL,
          value TEXT NOT NULL,
          description TEXT,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Insert default admin user
      const defaultPassword = 'admin123';
      bcrypt.hash(defaultPassword, 10, (err, hash) => {
        if (err) {
          return;
        }

        db.run(`
          INSERT OR IGNORE INTO users (username, password_hash, role)
          VALUES (?, ?, ?)
        `, ['admin', hash, 'admin'], (err) => {
          if (err) {
            // Error creating admin user
                  } else {
          // Admin user created successfully
        }
        });
      });

      // Insert default bot configuration
      const defaultConfig = [
        ['bot_name', 'XumtechBot', 'Chatbot name'],
        ['welcome_message', 'Hello! I\'m the virtual assistant of Xumtech. How can I help you?', 'Welcome message'],
        ['max_response_time', '5000', 'Maximum response time in ms'],
        ['confidence_threshold', '0.6', 'Confidence threshold for matching'],
        ['suggested_queries', 'What services do you offer?,What are your business hours?,How can I contact you?', 'Suggested queries']
      ];

      defaultConfig.forEach(([key, value, description]) => {
        db.run(`
          INSERT OR IGNORE INTO bot_config (key, value, description)
          VALUES (?, ?, ?)
        `, [key, value, description]);
      });

      // Insert default chatbot queries
      const defaultQueries = [
        {
          intent: 'servicios',
          patterns: 'servicios,ofrecen,que hacen,que ofrecen,servicios que',
          response: 'En Xumtech ofrecemos servicios de desarrollo de software, consultoría tecnológica, implementación de sistemas, mantenimiento y soporte técnico. Nos especializamos en soluciones web, móviles y empresariales.',
          category: 'servicios'
        },
        {
          intent: 'horarios',
          patterns: 'horarios,horario,atencion,cuando abren,cuando cierran,dias laborales',
          response: 'Nuestros horarios de atención son de lunes a viernes de 8:00 AM a 6:00 PM, y sábados de 9:00 AM a 2:00 PM. Para emergencias técnicas, contamos con soporte 24/7.',
          category: 'contacto'
        },
        {
          intent: 'contacto',
          patterns: 'contacto,contactar,telefono,email,correo,comunicar,como puedo contactarlos,como contactarlos,como los contacto',
          response: 'Puedes contactarnos por teléfono al +57 1 234 5678, por email a info@xumtech.com, o visitarnos en nuestra oficina principal en Bogotá, Colombia.',
          category: 'contacto'
        },
        {
          intent: 'ubicacion',
          patterns: 'ubicacion,direccion,donde estan,localizacion,oficina,donde estan ubicados,donde se encuentran,donde queda',
          response: 'Nuestra oficina principal está ubicada en la Calle 123 #45-67, Edificio Tech Plaza, Piso 8, Bogotá, Colombia. También tenemos presencia en Medellín y Cali.',
          category: 'contacto'
        },
        {
          intent: 'xumtech_info',
          patterns: 'xumtech,que es xumtech,empresa,sobre xumtech,quienes son',
          response: 'Xumtech es una empresa de tecnología fundada en 2015, especializada en desarrollo de software y soluciones digitales. Somos líderes en innovación tecnológica en Colombia.',
          category: 'empresa'
        },
        {
          intent: 'especializacion',
          patterns: 'especializacion,especialidad,areas,en que se especializan,tecnologias',
          response: 'Nos especializamos en desarrollo web con React, Angular y Vue.js, aplicaciones móviles nativas e híbridas, sistemas empresariales, inteligencia artificial y cloud computing.',
          category: 'servicios'
        },
        {
          intent: 'cotizacion',
          patterns: 'cotizacion,presupuesto,precio,costo,cuanto cuesta,solicitar cotizacion',
          response: 'Para solicitar una cotización, puedes enviarnos un email a cotizaciones@xumtech.com con los detalles de tu proyecto, o agendar una reunión llamando al +57 1 234 5678.',
          category: 'servicios'
        },
        {
          intent: 'soporte_tecnico',
          patterns: 'soporte tecnico,soporte,ayuda tecnica,problemas tecnicos,fallas',
          response: 'Ofrecemos soporte técnico 24/7 para todos nuestros clientes. Puedes contactar a nuestro equipo de soporte al +57 1 234 5679 o enviar un ticket a soporte@xumtech.com.',
          category: 'servicios'
        },
        {
          intent: 'tecnologias',
          patterns: 'tecnologias,stack tecnologico,herramientas,lenguajes,framework',
          response: 'Trabajamos con las últimas tecnologías: JavaScript/TypeScript, Python, Java, .NET, React, Angular, Vue.js, Node.js, Django, Spring Boot, AWS, Azure, Docker, Kubernetes y más.',
          category: 'servicios'
        },
        {
          intent: 'experiencia',
          patterns: 'experiencia,anos en el mercado,historia,trayectoria,proyectos realizados',
          response: 'Con más de 8 años en el mercado, hemos completado más de 200 proyectos exitosos para empresas de diversos sectores. Nuestra experiencia incluye startups, medianas empresas y corporaciones.',
          category: 'empresa'
        },
        {
          intent: 'capacitacion',
          patterns: 'capacitacion,entrenamiento,cursos,formacion,aprendizaje',
          response: 'Ofrecemos programas de capacitación en tecnologías modernas, metodologías ágiles y mejores prácticas de desarrollo. Nuestros cursos son personalizados según las necesidades de tu empresa.',
          category: 'servicios'
        },
        {
          intent: 'metodologias',
          patterns: 'metodologias,metodologia de trabajo,proceso,agile,scrum',
          response: 'Utilizamos metodologías ágiles como Scrum y Kanban, con sprints de 2 semanas, reuniones diarias, retrospectivas y entrega continua. Adaptamos nuestros procesos a las necesidades específicas de cada proyecto.',
          category: 'servicios'
        },
        {
          intent: 'saludo',
          patterns: 'hola,buenos dias,buenas tardes,buenas noches,como estas,que tal,como te llamas,tu nombre',
          response: '¡Hola! Soy XumtechBot, el asistente virtual de Xumtech. Estoy aquí para ayudarte con cualquier consulta sobre nuestros servicios, ubicación, horarios o información de contacto. ¿En qué puedo ayudarte?',
          category: 'general'
        }
      ];

      defaultQueries.forEach(query => {
        db.run(`
          INSERT OR IGNORE INTO chatbot_queries (intent, patterns, response, category)
          VALUES (?, ?, ?, ?)
        `, [query.intent, query.patterns, query.response, query.category]);
      });

      // Database initialized successfully
      // Tables created: users, chatbot_queries, conversation_logs, bot_config
      // Chatbot queries loaded
      resolve();
    });
  });
};

// Close database connection
const closeDatabase = () => {
  return new Promise((resolve, reject) => {
    db.close((err) => {
      if (err) {
        reject(err);
      } else {
        // Database connection closed
        resolve();
      }
    });
  });
};

// Run setup if this file is executed directly
if (require.main === module) {
  initializeDatabase()
    .then(() => closeDatabase())
    .then(() => {
      // Database setup completed
      process.exit(0);
    })
    .catch((err) => {
      // Error in setup
      process.exit(1);
    });
}

module.exports = { db, initializeDatabase, closeDatabase }; 