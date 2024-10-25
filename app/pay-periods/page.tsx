'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { ChevronDown, ChevronRight, Menu, X, Home, Rocket, Lightbulb, Map, Target, ClipboardCheck, Zap, ChartBar, DollarSign, FileText } from 'lucide-react'
import Link from 'next/link'
import { format, addDays, startOfDay, isBefore, isAfter, isSameDay, parseISO } from 'date-fns'
import { motion, AnimatePresence } from 'framer-motion'

interface SalesData {
  date: string
  totalNetSale: string
  chatterName: string
}

interface PayPeriod {
  startDate: Date
  endDate: Date
  salaryDate: Date
  status: 'Chatters Paid' | 'Active Pay Period' | 'Inactive Pay Period'
  totalPayout: number
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'default', size = 'default', ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background"
    const variants = {
      default: "bg-primary text-primary-foreground hover:bg-primary/90",
      outline: "border border-input hover:bg-accent hover:text-accent-foreground",
      ghost: "hover:bg-accent hover:text-accent-foreground"
    }
    const sizes = {
      default: "h-10 py-2 px-4",
      sm: "h-9 px-3 rounded-md",
      lg: "h-11 px-8 rounded-md",
      icon: "h-10 w-10"
    }
    return (
      <button
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

const menuItems = [
  { name: 'Home', icon: Home, hasDropdown: false },
  { name: 'Sales Data', icon: ChartBar, hasDropdown: true, submenu: [
    { name: 'Form', url: '/form' },
    { name: 'Pay Period', url: 'pay-periods' },
  ]},
  { name: 'Sales', icon: DollarSign, hasDropdown: false, url: '/sales' },
  { name: 'Invoice Creator', icon: FileText, hasDropdown: false, url: '/invoice' },
]

const Sidebar = ({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (isOpen: boolean) => void }) => {
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const toggleExpand = (itemName: string) => {
    setExpandedItems(prev =>
      prev.includes(itemName)
        ? prev.filter(item => item !== itemName)
        : [...prev, itemName]
    )
  }

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-gray-900 text-white p-4 shadow-lg transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
        initial={false}
        animate={{ x: isOpen ? 0 : '-100%' }}
      >
        <h1 className="text-2xl font-bold mb-8">Connect Chatting LLC</h1>
        <nav>
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.name}>
                <div className="flex items-center justify-between p-2 hover:bg-gray-800 rounded-md cursor-pointer">
                  <Link href={item.url || '#'} className="flex items-center space-x-3 flex-grow">
                    <item.icon size={20} />
                    <span>{item.name}</span>
                  </Link>
                  {item.hasDropdown && (
                    <button
                      onClick={() => toggleExpand(item.name)}
                      aria-label={`Expand ${item.name}`}
                      className="p-1 hover:bg-gray-700 rounded-full"
                    >
                      <motion.div
                        animate={{ rotate: expandedItems.includes(item.name) ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronDown size={16} />
                      </motion.div>
                    </button>
                  )}
                </div>
                {item.hasDropdown && item.submenu && (
                  <AnimatePresence>
                    {expandedItems.includes(item.name) && (
                      <motion.ul
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="ml-6 mt-2 space-y-2"
                      >
                        {item.submenu.map((subItem) => (
                          <li key={subItem.name}>
                            <Link href={subItem.url} className="block p-2 hover:bg-gray-800 rounded-md">
                              {subItem.name}
                            </Link>
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                )}
              </li>
            ))}
          </ul>
        </nav>
        <div className="absolute bottom-4 left-4">
          <button className="p-2 bg-gray-800 rounded-full" aria-label="Quick action">
            <Zap size={20} />
          </button>
        </div>
      </motion.aside>
    </>
  )
}

export default function CombinedDashboard() {
  const [payPeriods, setPayPeriods] = useState<PayPeriod[]>([])
  const [salesData, setSalesData] = useState<SalesData[]>([])
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0])
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const generatePayPeriods = useMemo(() => {
    const periods: PayPeriod[] = []
    let startDate = startOfDay(parseISO(currentDate))
    startDate = addDays(startDate, -70) // Start 10 weeks before current date

    for (let i = 0; i < 6; i++) {
      const periodStart = new Date(startDate)
      const periodEnd = addDays(periodStart, 13) // 14 day period
      const salaryDate = addDays(periodEnd, 14) // Salary date is 14 days after period end

      periods.push({
        startDate: periodStart,
        endDate: periodEnd,
        salaryDate: salaryDate,
        status: 'Inactive Pay Period',
        totalPayout: 0
      })

      startDate = addDays(startDate, 14) // Move to next period
    }

    return periods
  }, [currentDate])

  useEffect(() => {
    // Fetch sales data from localStorage
    const storedSalesData = JSON.parse(localStorage.getItem('chatterData') || '[]')
    setSalesData(storedSalesData)

    setPayPeriods(generatePayPeriods)
  }, [generatePayPeriods])

  useEffect(() => {
    if (salesData.length === 0 || payPeriods.length === 0) return

    const now = parseISO(currentDate)
    const updatedPayPeriods = payPeriods.map(period => {
      let status: PayPeriod['status'] = 'Inactive Pay Period'
      
      if (isBefore(now, period.startDate)) {
        status = 'Inactive Pay Period'
      } else if (isAfter(now, period.endDate)) {
        status = 'Chatters Paid'
      } else {
        status = 'Active Pay Period'
      }

      // Calculate total payout for the period
      const totalPayout = salesData.reduce((sum, sale) => {
        const saleDate = parseISO(sale.date)
        if ((isAfter(saleDate, period.startDate) || isSameDay(saleDate, period.startDate)) && 
            (isBefore(saleDate, period.endDate) || isSameDay(saleDate, period.endDate))) {
          const saleAmount = parseFloat(sale.totalNetSale)
          return sum + (saleAmount * 0.07) // Calculate 7% of the total net sale
        }
        return sum
      }, 0)

      return { ...period, status, totalPayout }
    })

    setPayPeriods(updatedPayPeriods)
  }, [salesData, payPeriods, currentDate])

  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 768)
    }

    handleResize() // Set initial state
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Function to format date as "MMM D"
  const formatDate = (date: Date) => {
    return format(date, 'MMM d')
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden md:ml-64">
        <header className="bg-white shadow-sm z-10">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Pay Periods</h1>
            <Button
              variant="outline"
              size="icon"
              className="md:hidden"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <Menu className="h-4 w-4" />
              <span className="sr-only">Toggle sidebar</span>
            </Button>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto p-4">
            <div className="flex space-x-4 mb-4">
              <Link href="/" className="text-blue-500 hover:underline">
                Back to Form
              </Link>
              <Link href="/sales-data" className="text-blue-500 hover:underline">
                View Sales Data
              </Link>
            </div>
            <div className="mb-4">
              <label htmlFor="currentDate" className="block text-sm font-medium text-gray-700">Current Date (for testing):</label>
              <input
                type="date"
                id="currentDate"
                value={currentDate}
                onChange={(e) => setCurrentDate(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pay Period</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salary Date</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Chatter Payout</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {payPeriods.map((period, index) => (
                    <tr key={index} className={period.status === 'Active Pay Period' ? 'bg-blue-50' : ''}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(period.startDate)} - {formatDate(period.endDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(period.salaryDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="relative inline-block w-full">
                          <select
                            className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                            value={period.status}
                            onChange={(e) => {
                              const newPayPeriods = [...payPeriods]
                              newPayPeriods[index].status = e.target.value as PayPeriod['status']
                              setPayPeriods(newPayPeriods)
                            }}
                          >
                            <option>Chatters Paid</option>
                            <option>Active Pay Period</option>
                            <option>Inactive Pay Period</option>
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <ChevronDown className="h-4 w-4" />
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${period.totalPayout.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}