import { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '../utils/mongodb';
import fs from 'fs'; // Import the filesystem module
import { WithId, Document } from 'mongodb'; // Import MongoDB types

interface Registration {
  _id: string;
  eventId: string;
  activeAccountId: string;
}   

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const db = await connectToDatabase();
      const registrationsCollection = db.collection<Registration>('registrations'); 

      const registrations: Registration[] = await registrationsCollection.find().toArray();

      if (registrations && registrations.length > 0) {
        const transformedData = transformData(registrations);
        const csv = generateCSV(transformedData);
        const filePath = './registrations.csv';
        fs.writeFileSync(filePath, csv);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=registrations.csv');
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);
        fileStream.on('close', () => {
          fs.unlinkSync(filePath);
        });
      } else {
        res.status(200).json({ success: true, message: 'No registrations found' });
      }
    } catch (error) {
      console.error('Error fetching registrations:', error);
      res.status(500).json({ success: false, error: 'Error fetching registrations' });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
}

function transformData(registrations: Registration[]): Record<string, string[]> {
  const transformedData: Record<string, string[]> = {};
  registrations.forEach(registration => {
    const { activeAccountId, eventId } = registration;
    if (!transformedData[activeAccountId]) {
      transformedData[activeAccountId] = [];
    }
    transformedData[activeAccountId].push(eventId);
  });
  return transformedData;
}

function generateCSV(data: Record<string, string[]>): string {
  let csv = 'User ID,Event IDs\n';
  for (const userId in data) {
    if (Object.prototype.hasOwnProperty.call(data, userId)) {
      csv += `${userId},${data[userId].join(',')}\n`;
    }
  }
  return csv;
}
