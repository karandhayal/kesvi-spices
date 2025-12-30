const allowedOrigins = [
  'https://parosa.co.in',
  'https://www.parosa.co.in',
  'http://localhost:3000',
  'https://kesvi-spices.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("Blocked by CORS:", origin);
      callback(null, false); // ✅ DO NOT throw error
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"]
}));

// ✅ REQUIRED FOR CLOUD RUN + BROWSERS
app.options('*', cors());
