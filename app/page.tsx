'use client'

import React, { useState, useEffect } from 'react'
import { CalendarIcon, XCircleIcon, ChevronDownIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface FormData {
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

const initialFormData: FormData = {
  email: '',
  chatterName: '',
  timezone: '',
  date: '',
  modelsWorkedOn: '',
  shiftTime: '',
  wasItCover: '',
  whoCovered: '',
  totalNetSale: '',
}

const modelOptions = [
  'Alexis', 'Miaa', 'Bella', 'Ellie', 'Sasha', 'Hunkmo', 'Shrimp',
  'Laura', 'Mia', 'Ava', 'Kira', 'Carina', 'Evelyn', 'Tina'
]

const chatterNames = ['Cado', 'Janko', 'Moot', 'Stefq', 'Dayo', 'Angel', 'Christine', 'Death', 'Eryx', 'Gem', 'Mei', 'Raluca', 'Rommel'];

interface PayPeriod {
  start: Date;
  end: Date;
  invoiceDate: Date;
  chatterPayDate: Date;
}

const payPeriods: PayPeriod[] = [
  { start: new Date('2024-11-01'), end: new Date('2024-11-13'), invoiceDate: new Date('2024-11-14'), chatterPayDate: new Date('2024-11-15') },
  { start: new Date('2024-11-14'), end: new Date('2024-11-28'), invoiceDate: new Date('2024-11-29'), chatterPayDate: new Date('2024-11-30') },
  { start: new Date('2024-11-29'), end: new Date('2024-12-13'), invoiceDate: new Date('2024-12-14'), chatterPayDate: new Date('2024-12-15') },
  { start: new Date('2024-12-14'), end: new Date('2024-12-28'), invoiceDate: new Date('2024-12-29'), chatterPayDate: new Date('2024-12-30') },
  { start: new Date('2024-12-29'), end: new Date('2025-01-13'), invoiceDate: new Date('2025-01-14'), chatterPayDate: new Date('2025-01-15') },
  { start: new Date('2025-01-14'), end: new Date('2025-01-28'), invoiceDate: new Date('2025-01-29'), chatterPayDate: new Date('2025-01-30') },
]

export default function SalesTrackerForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [currentPayPeriod, setCurrentPayPeriod] = useState<PayPeriod | null>(null)
  const router = useRouter()

  useEffect(() => {
    const now = new Date()
    const currentPeriod = payPeriods.find(period => now >= period.start && now <= period.end)
    setCurrentPayPeriod(currentPeriod || payPeriods[0]) // Default to first period if current date is not in any period
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const existingData = JSON.parse(localStorage.getItem('chatterData') || '[]')
    const newData = [...existingData, formData]
    localStorage.setItem('chatterData', JSON.stringify(newData))
    setFormData(initialFormData)
    router.push('/sales-data')
  }

  const clearForm = () => {
    setFormData(initialFormData)
  }

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0]
  }

  return (
    <div className="max-w-2xl mx-auto p-4 mt-8">
      <h1 className="text-3xl font-bold mb-6">CNCT Sales Tracker</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>

        <div>
          <label htmlFor="chatterName" className="block text-sm font-medium text-gray-700">
            Chatter Name
          </label>
          <div className="relative">
            <select
              id="chatterName"
              name="chatterName"
              value={formData.chatterName}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 appearance-none"
            >
              <option value="">Select Chatter</option>
              {chatterNames.map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
            <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div>
          <label htmlFor="timezone" className="block text-sm font-medium text-gray-700">
            Timezone
          </label>
          <select
            id="timezone"
            name="timezone"
            value={formData.timezone}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            <option value="">Select Timezone</option>
            <option value="EST">EST</option>
            <option value="CST">CST</option>
            <option value="MST">MST</option>
            <option value="PST">PST</option>
          </select>
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">
            Date <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="date"
              id="date"
              name="date"
              required
              value={formData.date}
              onChange={handleInputChange}
              min={currentPayPeriod ? formatDate(currentPayPeriod.start) : undefined}
              max={currentPayPeriod ? formatDate(currentPayPeriod.end) : undefined}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 pl-10"
            />
            <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          {currentPayPeriod && (
            <p className="mt-1 text-sm text-gray-500">
              Current pay period: {formatDate(currentPayPeriod.start)} to {formatDate(currentPayPeriod.end)}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="modelsWorkedOn" className="block text-sm font-medium text-gray-700">
            Models you worked on
          </label>
          <div className="relative">
            <select
              id="modelsWorkedOn"
              name="modelsWorkedOn"
              value={formData.modelsWorkedOn}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 appearance-none"
            >
              <option value="">Select Model</option>
              {modelOptions.map((model) => (
                <option key={model} value={model}>{model}</option>
              ))}
            </select>
            <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div>
          <label htmlFor="shiftTime" className="block text-sm font-medium text-gray-700">
            Shift Time
          </label>
          <input
            type="text"
            id="shiftTime"
            name="shiftTime"
            value={formData.shiftTime}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>

        <div>
          <label htmlFor="wasItCover" className="block text-sm font-medium text-gray-700">
            Was It Cover?
          </label>
          <select
            id="wasItCover"
            name="wasItCover"
            value={formData.wasItCover}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        <div>
          <label htmlFor="whoCovered" className="block text-sm font-medium text-gray-700">
            Who did you cover?
          </label>
          <input
            type="text"
            id="whoCovered"
            name="whoCovered"
            value={formData.whoCovered}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>

        <div>
          <label htmlFor="totalNetSale" className="block text-sm font-medium text-gray-700">
            Total Net Sale
          </label>
          <input
            type="number"
            id="totalNetSale"
            name="totalNetSale"
            value={formData.totalNetSale}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>

        <div className="flex justify-between items-center mt-6">
          <button
            type="button"
            onClick={clearForm}
            className="flex items-center text-sm text-blue-600 hover:text-blue-800"
          >
            <XCircleIcon className="w-4 h-4 mr-1" />
            Clear form
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-gray-800 text-white text-sm font-medium rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  )
}