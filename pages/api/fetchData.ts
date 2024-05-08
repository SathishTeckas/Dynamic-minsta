// Backend: getRegistrations.ts
import { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '../utils/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { activeAccountId, eventId } = req.query;
      
      const db = await connectToDatabase();
      const registrationsCollection = db.collection('registrations');

      // Fetch registration data from MongoDB based on activeAccountId and eventId
      const registration = await registrationsCollection.findOne({ activeAccountId, eventId });

      if (registration) {
        const eventIdString = eventId as string;
        await registrationsCollection.findOneAndUpdate(
          { activeAccountId, eventId },
          { $set: { [eventIdString]: true } }
        );


        res.status(200).json({ success: true, registered: true, registration:registration });
      } else {
        // User is not registered for the event
        res.status(200).json({  registered: false });
      }
    } catch (error) {
      console.error('Error checking registration:', error);
      res.status(500).json({ success: false, error: 'Error checking registration' });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
}
