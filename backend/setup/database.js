const bcrypt = require('bcryptjs');

// In-memory database for Vercel deployment
class InMemoryDatabase {
  constructor() {
    this.users = [];
    this.queries = [];
    this.conversations = [];
    this.config = {};
    this.initializeData();
  }

  initializeData() {
    // Default admin user
    const defaultPassword = 'admin123';
    const hash = bcrypt.hashSync(defaultPassword, 10);
    
    this.users.push({
      id: 1,
      username: 'admin',
      password_hash: hash,
      role: 'admin',
      created_at: new Date().toISOString()
    });

    // Default bot configuration
    this.config = {
      bot_name: 'XumtechBot',
      welcome_message: 'Hello! I\'m the virtual assistant of Xumtech. How can I help you?',
      max_response_time: '5000',
      confidence_threshold: '0.6',
      suggested_queries: 'What services do you offer?,What are your business hours?,How can I contact you?'
    };

    // Default chatbot queries
    this.queries = [
      {
        id: 1,
        intent: 'servicios',
        patterns: 'servicios,ofrecen,que hacen,que ofrecen,servicios que',
        response: 'En Xumtech ofrecemos servicios de desarrollo de software, consultoría tecnológica, implementación de sistemas, mantenimiento y soporte técnico. Nos especializamos en soluciones web, móviles y empresariales.',
        category: 'servicios',
        priority: 1,
        is_active: 1
      },
      {
        id: 2,
        intent: 'horarios',
        patterns: 'horarios,horario,atencion,cuando abren,cuando cierran,dias laborales',
        response: 'Nuestros horarios de atención son de lunes a viernes de 8:00 AM a 6:00 PM, y sábados de 9:00 AM a 2:00 PM. Para emergencias técnicas, contamos con soporte 24/7.',
        category: 'contacto',
        priority: 1,
        is_active: 1
      },
      {
        id: 3,
        intent: 'contacto',
        patterns: 'contacto,contactar,telefono,email,correo,comunicar,como puedo contactarlos,como contactarlos,como los contacto',
        response: 'Puedes contactarnos por teléfono al +57 1 234 5678, por email a info@xumtech.com, o visitarnos en nuestra oficina principal en Bogotá, Colombia.',
        category: 'contacto',
        priority: 1,
        is_active: 1
      },
      {
        id: 4,
        intent: 'ubicacion',
        patterns: 'ubicacion,direccion,donde estan,localizacion,oficina,donde estan ubicados,donde se encuentran,donde queda',
        response: 'Nuestra oficina principal está ubicada en la Calle 123 #45-67, Edificio Tech Plaza, Piso 8, Bogotá, Colombia. También tenemos presencia en Medellín y Cali.',
        category: 'contacto',
        priority: 1,
        is_active: 1
      },
      {
        id: 5,
        intent: 'xumtech_info',
        patterns: 'xumtech,que es xumtech,empresa,sobre xumtech,quienes son',
        response: 'Xumtech es una empresa de tecnología fundada en 2015, especializada en desarrollo de software y soluciones digitales. Somos líderes en innovación tecnológica en Colombia.',
        category: 'empresa',
        priority: 1,
        is_active: 1
      },
      {
        id: 6,
        intent: 'especializacion',
        patterns: 'especializacion,especialidad,areas,en que se especializan,tecnologias',
        response: 'Nos especializamos en desarrollo web con React, Angular y Vue.js, aplicaciones móviles nativas e híbridas, sistemas empresariales, inteligencia artificial y cloud computing.',
        category: 'servicios',
        priority: 1,
        is_active: 1
      },
      {
        id: 7,
        intent: 'cotizacion',
        patterns: 'cotizacion,presupuesto,precio,costo,cuanto cuesta,solicitar cotizacion',
        response: 'Para solicitar una cotización, puedes enviarnos un email a cotizaciones@xumtech.com con los detalles de tu proyecto, o agendar una reunión llamando al +57 1 234 5678.',
        category: 'servicios',
        priority: 1,
        is_active: 1
      },
      {
        id: 8,
        intent: 'soporte_tecnico',
        patterns: 'soporte tecnico,soporte,ayuda tecnica,problemas tecnicos,fallas',
        response: 'Ofrecemos soporte técnico 24/7 para todos nuestros clientes. Puedes contactar a nuestro equipo de soporte al +57 1 234 5679 o enviar un ticket a soporte@xumtech.com.',
        category: 'servicios',
        priority: 1,
        is_active: 1
      },
      {
        id: 9,
        intent: 'tecnologias',
        patterns: 'tecnologias,stack tecnologico,herramientas,lenguajes,framework',
        response: 'Trabajamos con las últimas tecnologías: JavaScript/TypeScript, Python, Java, .NET, React, Angular, Vue.js, Node.js, Django, Spring Boot, AWS, Azure, Docker, Kubernetes y más.',
        category: 'servicios',
        priority: 1,
        is_active: 1
      },
      {
        id: 10,
        intent: 'experiencia',
        patterns: 'experiencia,anos en el mercado,historia,trayectoria,proyectos realizados',
        response: 'Con más de 8 años en el mercado, hemos completado más de 200 proyectos exitosos para empresas de diversos sectores. Nuestra experiencia incluye startups, medianas empresas y corporaciones.',
        category: 'empresa',
        priority: 1,
        is_active: 1
      },
      {
        id: 11,
        intent: 'capacitacion',
        patterns: 'capacitacion,entrenamiento,cursos,formacion,aprendizaje',
        response: 'Ofrecemos programas de capacitación en tecnologías modernas, metodologías ágiles y mejores prácticas de desarrollo. Nuestros cursos son personalizados según las necesidades de tu empresa.',
        category: 'servicios',
        priority: 1,
        is_active: 1
      },
      {
        id: 12,
        intent: 'metodologias',
        patterns: 'metodologias,metodologia de trabajo,proceso,agile,scrum',
        response: 'Utilizamos metodologías ágiles como Scrum y Kanban, con sprints de 2 semanas, reuniones diarias, retrospectivas y entrega continua. Adaptamos nuestros procesos a las necesidades específicas de cada proyecto.',
        category: 'servicios',
        priority: 1,
        is_active: 1
      },
      {
        id: 13,
        intent: 'saludo',
        patterns: 'hola,buenos dias,buenas tardes,buenas noches,como estas,que tal,como te llamas,tu nombre',
        response: '¡Hola! Soy XumtechBot, el asistente virtual de Xumtech. Estoy aquí para ayudarte con cualquier consulta sobre nuestros servicios, ubicación, horarios o información de contacto. ¿En qué puedo ayudarte?',
        category: 'general',
        priority: 1,
        is_active: 1
      }
    ];
  }

  // Mock database methods
  all(query, params = []) {
    return new Promise((resolve) => {
      if (query.includes('bot_config')) {
        resolve(Object.entries(this.config).map(([key, value]) => ({ key, value })));
      } else if (query.includes('chatbot_queries')) {
        resolve(this.queries.filter(q => q.is_active === 1));
      } else if (query.includes('conversation_logs')) {
        resolve(this.conversations);
      }
    });
  }

  get(query, params = []) {
    return new Promise((resolve) => {
      if (query.includes('users')) {
        resolve(this.users.find(u => u.username === params[0]));
      } else if (query.includes('conversation_logs')) {
        resolve(this.conversations.length > 0 ? {
          total_conversations: this.conversations.length,
          avg_response_time: this.conversations.reduce((sum, c) => sum + (c.response_time_ms || 0), 0) / this.conversations.length,
          avg_confidence: this.conversations.reduce((sum, c) => sum + (c.confidence_score || 0), 0) / this.conversations.length
        } : { total_conversations: 0, avg_response_time: 0, avg_confidence: 0 });
      }
    });
  }

  run(query, params = []) {
    return new Promise((resolve) => {
      if (query.includes('INSERT INTO conversation_logs')) {
        this.conversations.push({
          id: this.conversations.length + 1,
          session_id: params[0],
          user_message: params[1],
          bot_response: params[2],
          intent_matched: params[3],
          confidence_score: params[4],
          response_time_ms: params[5],
          created_at: new Date().toISOString()
        });
      }
      resolve();
    });
  }

  close() {
    return Promise.resolve();
  }
}

const db = new InMemoryDatabase();

// Initialize database tables
const initializeDatabase = () => {
  return new Promise((resolve) => {
    // Database already initialized in constructor
    resolve();
  });
};

// Close database connection
const closeDatabase = () => {
  return new Promise((resolve) => {
    resolve();
  });
};

// Run setup if this file is executed directly
if (require.main === module) {
  initializeDatabase()
    .then(() => closeDatabase())
    .then(() => {
      console.log('In-memory database setup completed');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Error in setup:', err);
      process.exit(1);
    });
}

module.exports = { db, initializeDatabase, closeDatabase }; 