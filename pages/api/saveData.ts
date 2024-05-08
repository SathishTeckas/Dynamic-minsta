// Backend: register.ts
import { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '../utils/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { eventId, activeAccountId } = req.body;
      
      const db = await connectToDatabase();
      const registrationsCollection = db.collection('registrations');

      if((!eventId)||(!activeAccountId)){
        res.status(500).json({ success: false});
      }
      const registration = await registrationsCollection.findOne({ activeAccountId, eventId});
      if(!registration){
        await registrationsCollection.insertOne({ eventId,activeAccountId,[eventId]:false});
        res.status(200).json({ success: true });
      }else{
      res.status(200).json({ success: false });
      }

     
    } catch (error) {
      console.error('Error saving registration data:', error);
      res.status(500).json({ success: false, error: 'Error saving registration data' });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
}
