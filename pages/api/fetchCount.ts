// Backend: getRegistrations.ts
import { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '../utils/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { activeAccountId } = req.query;
      
      const db = await connectToDatabase();
      const registrationsCollection = db.collection('registrations');

      
      const registration = await registrationsCollection.findOne({ activeAccountId});

     
        const countResult = await registrationsCollection.aggregate([
          {
            $match: {
              activeAccountId: activeAccountId 
            }
          },
          {
            $group: {
              _id: "$activeAccountId",
              Total_True_Events: {
                $sum: {
                  $add: [
                    { $cond: ["$EVT001", 1, 0] },
                    { $cond: ["$EVT002", 1, 0] },
                    { $cond: ["$EVT003", 1, 0] },
                    { $cond: ["$EVT004", 1, 0] },
                    { $cond: ["$EVT005", 1, 0] }
                  ]
                }
              }
            }
          }
        ]).toArray();
        
        

        const count = countResult[0]?.Total_True_Events || 0;

        res.status(200).json({ success: true, count });
      } 
     catch (error) {
      console.error('Error checking registration:', error);
      res.status(500).json({ success: false, error: 'Error checking registration' });
    }
}
}
