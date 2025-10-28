
import app from './webs/loyalty/app.js';

const PORT = process.env.PORT || 5000;
app.get('/health', (req, res) => {
    res.json({
        status: ' Server Running!',
        port: process.env.PORT || 5000,
        timestamp: new Date().toISOString()
    });
});



app.listen(PORT, () => {
    console.log(` Server running on http://localhost:${PORT}`);
    console.log(` Health check: http://localhost:${PORT}/health`);
});