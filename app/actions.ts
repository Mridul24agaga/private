'use server'

import fs from 'fs/promises'
import path from 'path'

export interface SalesFormData {
  email: string
  chatterName: string
  timezone: string
  date: string
  modelsWorkedOn: string
  shiftTime: string
  wasItCover: string
  whoCovered: string
  totalNetSale: string
}

const dataFilePath = path.join(process.cwd(), 'data', 'chatter-data.json');

export async function saveData(data: SalesFormData) {
  let existingData: SalesFormData[] = [];
  try {
    const fileContent = await fs.readFile(dataFilePath, 'utf8');
    existingData = JSON.parse(fileContent);
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code !== 'ENOENT') {
      throw error;
    }
    // If the file doesn't exist, we'll create it with the new data
  }
  existingData.push(data);
  await fs.writeFile(dataFilePath, JSON.stringify(existingData, null, 2));
}