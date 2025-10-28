import prisma from "@shared/dbConfig/database.js";


export const getAllTickets = async (req,res,next) => {
    try {
     const data = await prisma.tickets.findMany()
     return res.status(200).json({message:'Successfully fetched all tickets',data:data});
    } catch (error) {
      res.status(500).json({ message: error.message });
      next(error)
    }
}

export const updateStatus = async (req, res, next) => {
    try {
    const { id } = req.params;
        const { ticket_status } = req.body;

    const ticket = await prisma.tickets.update({
        where: { id :Number(id)},
        data: { ticket_status: ticket_status },
    });

    if (!ticket) {
        return res.status(404).json({ message: 'Ticket not found' });
    }

    res.status(200).json({ message: 'Status updated successfully', ticket });

}catch(error){
res.status(500).json({ message: error.message });
next(error)
    
    }
}