import express from 'express';
import helmet from 'helmet'

const port = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(helmet());

app.listen(port, () => {
    console.log(`App running on http://localhost:${port}`);
})

