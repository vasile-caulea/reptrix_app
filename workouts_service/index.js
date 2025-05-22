import express from 'express';
import cors from 'cors';

import workoutRoutes from './routes/workoutRoutes.js';

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());
app.use(workoutRoutes);

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
