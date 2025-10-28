import express from 'express';
import { getAllTickets, updateStatus } from '../controllers/ticketController.js';
const ticketRoutes=express.Router();

ticketRoutes.get('/get_all_tickets',getAllTickets);
ticketRoutes.put('/update_status/:id',updateStatus);


export default ticketRoutes;