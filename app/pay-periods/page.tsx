'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { format, parseISO, isAfter, isBefore, isSameDay } from 'date-fns'
import { ChevronDown, Menu, Edit2, Save } from 'lucide-react'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

// Database schema interface
interface FormData {
  id?: number
  email: string
  chatter_name: string
  timezone: string
  date: string
  models_worked_on: string
  shift_time: string
  was_it_cover: string
  who_covered: string
  total_net_sale: string
  pay?: number
  pay_percentage: number
}

// UI representation interfaces
interface ChatterEntry extends FormData {
  pay: number
  payPercentage: number
}

interface ChatterGroup {
  chatterName: string
  totalPay: number
  entries: ChatterEntry[]
  payPercentage: number
}

interface PayPeriod {
  start: string
  end: string
  invoiceDate: string
  chatterPayDate: string
  status: 'Chatters Paid' | 'Active Pay Period' | 'Inactive Pay Period'
}

interface PayPeriodGroup {
  payPeriod: PayPeriod
  chatterGroups: ChatterGroup[]
  totalPay: number
}

// Simplified Button component for brevity
const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'outline'
  size?: 'default' | 'sm'
}> = ({ children, className = '', variant = 'default', size = 'default', ...props }) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"
  const variantStyles = variant === 'default' ? "bg-primary text-primary-foreground hover:bg-primary/90" : "border border-input hover:bg-accent hover:text-accent-foreground"
  const sizeStyles = size === 'default' ? "h-10 py-2 px-4" : "h-9 px-3 rounded-md"
  
  return (
    <button className={`${baseStyles} ${variantStyles} ${sizeStyles} ${className}`} {...props}>
      {children}
    </button>
  )
}

const payPeriods: PayPeriod[] = [
  { start: '2024-11-01', end: '2024-11-13', invoiceDate: '2024-11-14', chatterPayDate: '2024-11-15', status: 'Inactive Pay Period' },
  { start: '2024-11-14', end: '2024-11-28', invoiceDate: '2024-11-29', chatterPayDate: '2024-11-30', status: 'Inactive Pay Period' },
  { start: '2024-11-29', end: '2024-12-13', invoiceDate: '2024-12-14', chatterPayDate: '2024-12-15', status: 'Inactive Pay Period' },
  { start: '2024-12-14', end: '2024-12-28', invoiceDate: '2024-12-29', chatterPayDate: '2024-12-30', status: 'Inactive Pay Period' },
  { start: '2024-12-29', end: '2025-01-13', invoiceDate: '2025-01-14', chatterPayDate: '2025-01-15', status: 'Inactive Pay Period' },
  { start: '2025-01-14', end: '2025-01-28', invoiceDate: '2025-01-29', chatterPayDate: '2025-01-30', status: 'Inactive Pay Period' },
]

export default function SalesDashboard() {
  const [payPeriodGroups, setPayPeriodGroups] = useState<PayPeriodGroup[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [expandedPayPeriod, setExpandedPayPeriod] = useState<string | null>(null)
  const [expandedChatter, setExpandedChatter] = useState<string | null>(null)
  const [editingChatter, setEditingChatter] = useState<string | null>(null)
  const [editedPercentage, setEditedPercentage] = useState<number>(0)
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [currentDate])

  const fetchData = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const { data, error } = await supabase
        .from('sales')
        .select('*')
        .order('date', { ascending: true })

      if (error) throw new Error(error.message)

      if (!data || !Array.isArray(data)) {
        throw new Error('Invalid data format received from the server')
      }

      const validatedData = validateAndTransformData(data)
      const groupedData = processData(validatedData)
      setPayPeriodGroups(groupedData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const validateAndTransformData = (data: any[]): FormData[] => {
    return data.filter((item): item is FormData => {
      return (
        typeof item === 'object' &&
        item !== null &&
        typeof item.email === 'string' &&
        typeof item.chatter_name === 'string' &&
        typeof item.timezone === 'string' &&
        typeof item.date === 'string' &&
        typeof item.models_worked_on === 'string' &&
        typeof item.shift_time === 'string' &&
        typeof item.was_it_cover === 'string' &&
        typeof item.who_covered === 'string' &&
        typeof item.total_net_sale === 'string' &&
        (typeof item.pay_percentage === 'number' || item.pay_percentage === null)
      )
    })
  }

  const processData = (salesData: FormData[]): PayPeriodGroup[] => {
    return payPeriods.map(payPeriod => {
      const periodEntries = salesData.filter(entry => {
        const entryDate = new Date(entry.date)
        const periodStart = new Date(payPeriod.start)
        const periodEnd = new Date(payPeriod.end)
        return (isAfter(entryDate, periodStart) || isSameDay(entryDate, periodStart)) && 
               (isBefore(entryDate, periodEnd) || isSameDay(entryDate, periodEnd))
      })

      const chatterGroups = periodEntries.reduce((acc: ChatterGroup[], item) => {
        const payPercentage = item.pay_percentage || 7
        const pay = parseFloat(item.total_net_sale) * (payPercentage / 100)
        
        const transformedEntry: ChatterEntry = {
          ...item,
          pay,
          payPercentage
        }

        let group = acc.find(g => g.chatterName === item.chatter_name)
        if (!group) {
          group = { chatterName: item.chatter_name, totalPay: 0, entries: [], payPercentage }
          acc.push(group)
        }

        group.totalPay += pay
        group.entries.push(transformedEntry)

        return acc
      }, [])

      const totalPay = chatterGroups.reduce((sum, group) => sum + group.totalPay, 0)

      const now = parseISO(currentDate)
      let status: PayPeriod['status'] = 'Inactive Pay Period'
      
      if ((isAfter(now, new Date(payPeriod.start)) || isSameDay(now, new Date(payPeriod.start))) && 
          (isBefore(now, new Date(payPeriod.end)) || isSameDay(now, new Date(payPeriod.end)))) {
        status = 'Active Pay Period'
      } else if (isAfter(now, new Date(payPeriod.end))) {
        status = 'Chatters Paid'
      }

      return { 
        payPeriod: { ...payPeriod, status }, 
        chatterGroups, 
        totalPay 
      }
    })
  }

  const togglePayPeriod = (payPeriodStart: string) => {
    setExpandedPayPeriod(expandedPayPeriod === payPeriodStart ? null : payPeriodStart)
  }

  const toggleChatter = (payPeriodStart: string, chatterName: string) => {
    const key = `${payPeriodStart}-${chatterName}`
    setExpandedChatter(expandedChatter === key ? null : key)
  }

  const startEditing = (payPeriodStart: string, chatterName: string, currentPercentage: number) => {
    setEditingChatter(`${payPeriodStart}-${chatterName}`)
    setEditedPercentage(currentPercentage)
  }

  const saveEditedPercentage = async (payPeriodStart: string, chatterName: string) => {
    try {
      const { data: entries, error: fetchError } = await supabase
        .from('sales')
        .select('*')
        .eq('chatter_name', chatterName)
        .gte('date', payPeriodStart)

      if (fetchError) throw fetchError

      const validEntries = validateAndTransformData(entries || [])

      for (const entry of validEntries) {
        const { error: updateError } = await supabase
          .from('sales')
          .update({ pay_percentage: editedPercentage })
          .eq('id', entry.id)

        if (updateError) throw updateError
      }

      await fetchData()
      setEditingChatter(null)
    } catch (error) {
      console.error('Error updating percentage:', error)
      setError(error instanceof Error ? error.message : 'An error occurred while updating the percentage')
    }
  }

  if (isLoading) {
    return <p>Loading...</p>
  }

  if (error) {
    return <p>Error: {error}</p>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Sales Dashboard</h1>
      <div className="mb-4">
        <label htmlFor="currentDate" className="block text-sm font-medium text-gray-700">
          Current Date:
        </label>
        <input
          type="date"
          id="currentDate"
          value={currentDate}
          onChange={(e) => setCurrentDate(e.target.value)}
          className="mt-1 block w-64 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      {payPeriodGroups.map((group) => (
        <div 
          key={group.payPeriod.start} 
          className={`mb-8 shadow overflow-hidden sm:rounded-lg ${
            group.payPeriod.status === 'Active Pay Period' 
              ? 'bg-yellow-50' 
              : 'bg-white'
          }`}
        >
          <div
            className="px-4 py-5 sm:px-6 flex justify-between items-center cursor-pointer"
            onClick={() => togglePayPeriod(group.payPeriod.start)}
          >
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Pay Period: {format(new Date(group.payPeriod.start), 'MMM d, yyyy')} to {format(new Date(group.payPeriod.end), 'MMM d, yyyy')}
            </h3>
            <div className="flex items-center space-x-4">
              <select
                className="block w-40 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                value={group.payPeriod.status}
                onChange={(e) => {
                  const newGroups = payPeriodGroups.map(g => 
                    g.payPeriod.start === group.payPeriod.start
                      ? { ...g, payPeriod: { ...g.payPeriod, status: e.target.value as PayPeriod['status'] } }
                      : g
                  )
                  setPayPeriodGroups(newGroups)
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <option value="Chatters Paid">Chatters Paid</option>
                <option value="Active Pay Period">Active Pay Period</option>
                <option value="Inactive Pay Period">Inactive Pay Period</option>
              </select>
              <span className="text-sm text-gray-500">Total Pay: ${group.totalPay.toFixed(2)}</span>
              <ChevronDown
                className={`h-5 w-5 text-gray-500 transform transition-transform ${
                  expandedPayPeriod === group.payPeriod.start ? 'rotate-180' : ''
                }`}
              />
            </div>
          </div>
          {expandedPayPeriod === group.payPeriod.start && (
            <div className="border-t border-gray-200">
              {group.chatterGroups.map((chatterGroup) => (
                <div key={chatterGroup.chatterName} className="border-b border-gray-200 last:border-b-0">
                  <div
                    className="px-4 py-4 sm:px-6 flex justify-between items-center cursor-pointer hover:bg-gray-50"
                    onClick={() => toggleChatter(group.payPeriod.start, chatterGroup.chatterName)}
                  >
                    <p className="text-sm font-medium text-indigo-600 truncate">
                      {chatterGroup.chatterName}
                    </p>
                    <div className="flex items-center">
                      <span className="mr-2 text-sm text-gray-500">
                        Total Pay: ${chatterGroup.totalPay.toFixed(2)} ({chatterGroup.payPercentage}%)
                      </span>
                      
                      {editingChatter === `${group.payPeriod.start}-${chatterGroup.chatterName}` ? (
                        <>
                          <input
                            type="number"
                            value={editedPercentage}
                            onChange={(e) => setEditedPercentage(Number(e.target.value))}
                            className="w-16 px-2 py-1 text-sm border rounded mr-2"
                            onClick={(e) => e.stopPropagation()}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              saveEditedPercentage(group.payPeriod.start, chatterGroup.chatterName)
                            }}
                          >
                            <Save className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            startEditing(group.payPeriod.start, chatterGroup.chatterName, chatterGroup.payPercentage)
                          }}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      )}
                      <ChevronDown
                        className={`h-5 w-5 text-gray-500 transform transition-transform ${
                          expandedChatter === `${group.payPeriod.start}-${chatterGroup.chatterName}` ? 'rotate-180' : ''
                        }`}
                      />
                    </div>
                  </div>
                  
                  {expandedChatter === `${group.payPeriod.start}-${chatterGroup.chatterName}` && (
                    <div className="px-4 py-4 sm:px-6 bg-gray-50">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Models Worked On</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shift Time</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Was It Cover</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Who Covered</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Net Sale</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pay ({chatterGroup.payPercentage}%)</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {chatterGroup.entries.map((entry, index) => (
                            <tr key={index}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.date}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.models_worked_on}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.shift_time}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.was_it_cover}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.who_covered}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${entry.total_net_sale}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${entry.pay.toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}